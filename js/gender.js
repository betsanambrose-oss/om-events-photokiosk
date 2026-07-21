// js/gender.js — Silent gender detection using face-api.js
// Detects gender from captured photo, returns gender info for prompt
// Falls back gracefully to neutral 'person' if detection unavailable

const GenderDetector = {
  modelLoaded: false,
  modelLoading: false,
  loadPromise: null,

  // Models from vladmandic CDN (same package as the script)
  MODEL_URL: 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model',

  // Load models — safe to call multiple times
  async loadModels() {
    // Return existing promise if already loading
    if (this.loadPromise) return this.loadPromise;
    if (this.modelLoaded) return Promise.resolve();

    this.loadPromise = this._doLoad();
    return this.loadPromise;
  },

  async _doLoad() {
    try {
      if (typeof faceapi === 'undefined') {
        console.warn('face-api.js not available');
        this.loadPromise = null;
        return;
      }

      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(this.MODEL_URL),
        faceapi.nets.ageGenderNet.loadFromUri(this.MODEL_URL)
      ]);

      this.modelLoaded = true;
      console.log('Gender models loaded ✅');
    } catch (err) {
      console.warn('Gender model load failed:', err.message);
      this.loadPromise = null; // allow retry
    }
  },

  // Detect gender from image data URL
  // Always returns a valid result — never throws
  async detect(imageDataUrl) {
    const fallback = {
      genders: ['person'],
      description: 'person',       // used in [GENDER] replacement
      groupDescription: 'group of people', // used in group [GENDER] → 'this group of people'
      subject: 'the person',       // used in prefix "Using the person..."
      groupSubject: 'the group of people',
      count: 1,
      detected: false
    };

    try {
      // Try loading if not loaded
      if (!this.modelLoaded) {
        await this.loadModels();
      }

      if (!this.modelLoaded || typeof faceapi === 'undefined') {
        return fallback;
      }

      if (!imageDataUrl) return fallback;

      const img = await this._createImage(imageDataUrl);

      const detections = await faceapi
        .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.4 }))
        .withAgeAndGender();

      if (!detections || detections.length === 0) {
        console.log('No faces detected');
        return fallback;
      }

      console.log('Faces detected:', detections.map(d =>
        `${d.gender}(${Math.round(d.genderProbability * 100)}%)`).join(', '));

      // Map each detection to gender string
      const genders = detections.map(d => {
        if (d.genderProbability < 0.65) return 'person'; // low confidence
        return d.gender === 'male' ? 'man' : 'woman';
      });

      const count = detections.length;
      const males = genders.filter(g => g === 'man').length;
      const females = genders.filter(g => g === 'woman').length;
      const neutral = genders.filter(g => g === 'person').length;

      let description, groupDescription;

      let subject, groupSubject;

      if (count === 1) {
        // No article — templates use "this [GENDER]" → "this man/woman/person"
        description = genders[0] === 'man' ? 'man' :
                      genders[0] === 'woman' ? 'woman' : 'person';
        groupDescription = description;
        subject = genders[0] === 'man' ? 'the man' :
                  genders[0] === 'woman' ? 'the woman' : 'the person';
        groupSubject = subject;
      } else {
        // groupDescription used in "this [GENDER]" → "this group of 3 men"
        if (males > 0 && females > 0) {
          groupDescription = `group of ${count} people`;
        } else if (males === count) {
          groupDescription = `group of ${count} men`;
        } else if (females === count) {
          groupDescription = `group of ${count} women`;
        } else {
          groupDescription = `group of ${count} people`;
        }
        description = groupDescription;
        subject = `the ${groupDescription}`;
        groupSubject = subject;
      }

      return { genders, description, groupDescription, subject, groupSubject, count, detected: true };

    } catch (err) {
      console.warn('Gender detection error:', err.message);
      return fallback;
    }
  },

  // Build complete gender-aware prompt
  // personCount ignored — we use what's actually detected in the photo
  buildPrompt(rawPrompt, detection) {
    const count = detection.count || 1;
    const { description, groupDescription } = detection;
    const subject = detection.subject || (count === 1 ? 'the person' : `the group of ${groupDescription}`);

    // Replace [GENDER] placeholder
    let prompt = rawPrompt.replace(/\[GENDER\]/g,
      count === 1 ? description : groupDescription
    );

    // Strong ONLY instruction — Kontext must not invent extra people
    const prefix = count === 1
      ? `Using ONLY ${subject} visible in the reference image, with their exact face, skin tone, hair, body proportions and natural expression preserved exactly — do not add any other people — place them naturally into this scene: `
      : `Using ONLY the ${subject} visible in the reference image — preserve every face exactly, do not add or remove anyone — all naturally integrated together into this scene: `;

    return prefix + prompt;
  },

  // Crop a tight, high-detail close-up of the face(s) from the capture.
  // This is the KEY face-accuracy technique: the AI gets a large sharp face
  // to lock identity from, instead of a tiny face in a wide full-body shot.
  // Returns a data URL of the cropped face region (single face = tight crop,
  // multiple faces = crop bounding all faces), or null if no face detected.
  // Face-recognition gate. Returns { ok, count, reason }.
  // Used before AI generation to catch turned/blocked/absent faces so we can
  // ask the guest to recapture instead of generating a wrong/stranger face.
  // Uses a higher confidence threshold than cropping — we want CLEAR faces.
  async detectFaceCount(imageDataUrl) {
    try {
      if (!this.modelLoaded) await this.loadModels();
      if (!this.modelLoaded || typeof faceapi === 'undefined' || !imageDataUrl) {
        // If the model can't load, don't block the guest — fail open.
        return { ok: true, count: -1, reason: 'detector-unavailable' };
      }
      const img = await this._createImage(imageDataUrl);
      const detections = await faceapi
        .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 }));

      const count = detections ? detections.length : 0;
      if (count === 0) {
        return { ok: false, count: 0, reason: 'no-face' };
      }
      // Require each detected face to be a reasonable size (not a tiny speck),
      // which also filters out background people and profile/turned faces that
      // score low. A clear front face is decently large.
      const imgArea = img.width * img.height;
      const bigEnough = detections.filter(d => {
        const b = d.box || d.detection?.box;
        if (!b) return false;
        return (b.width * b.height) / imgArea > 0.004; // ~0.4% of frame minimum
      });
      if (bigEnough.length === 0) {
        return { ok: false, count, reason: 'face-too-small-or-turned' };
      }
      return { ok: true, count: bigEnough.length, reason: 'ok' };
    } catch (err) {
      console.warn('detectFaceCount error:', err.message);
      return { ok: true, count: -1, reason: 'error-fail-open' };
    }
  },

  async cropFaces(imageDataUrl) {
    try {
      if (!this.modelLoaded) await this.loadModels();
      if (!this.modelLoaded || typeof faceapi === 'undefined' || !imageDataUrl) return null;

      const img = await this._createImage(imageDataUrl);

      const detections = await faceapi
        .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.4 }));

      if (!detections || detections.length === 0) {
        console.log('cropFaces: no face detected — sending full image only');
        return null;
      }

      // Compute a bounding box covering all detected faces
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      detections.forEach(d => {
        const b = d.box || d.detection?.box;
        if (!b) return;
        minX = Math.min(minX, b.x);
        minY = Math.min(minY, b.y);
        maxX = Math.max(maxX, b.x + b.width);
        maxY = Math.max(maxY, b.y + b.height);
      });

      if (!isFinite(minX)) return null;

      // Expand the box generously to include hair, ears, neck, and some shoulders
      // — this context helps the AI preserve the whole head/identity, not just the face
      const boxW = maxX - minX;
      const boxH = maxY - minY;
      const padX = boxW * 0.6;   // 60% horizontal padding
      const padTop = boxH * 0.7; // more on top for hair
      const padBottom = boxH * 0.5;

      let cropX = Math.max(0, minX - padX);
      let cropY = Math.max(0, minY - padTop);
      let cropW = Math.min(img.width - cropX, boxW + padX * 2);
      let cropH = Math.min(img.height - cropY, boxH + padTop + padBottom);

      // Draw the crop at full resolution (no downscale — maximum face detail)
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(cropW);
      canvas.height = Math.round(cropH);
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height);

      // High quality JPEG — this is the identity anchor, keep it sharp
      const cropDataUrl = canvas.toDataURL('image/jpeg', 0.95);
      console.log(`cropFaces: ${detections.length} face(s), crop ${canvas.width}x${canvas.height}`);
      return cropDataUrl;

    } catch (err) {
      console.warn('cropFaces error:', err.message);
      return null;
    }
  },

  // Helper: HTMLImageElement from data URL
  _createImage(dataUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const timeout = setTimeout(() => reject(new Error('Image load timeout')), 5000);
      img.onload = () => { clearTimeout(timeout); resolve(img); };
      img.onerror = () => { clearTimeout(timeout); reject(new Error('Image load failed')); };
      img.src = dataUrl;
    });
  }
};
