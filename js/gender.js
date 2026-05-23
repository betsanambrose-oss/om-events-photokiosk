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
  buildPrompt(rawPrompt, detection, personCount) {
    const count = personCount || detection.count || 1;
    const { description, groupDescription } = detection;
    // subject/groupSubject may not exist in fallback — build safely
    const subject = detection.subject || (count === 1 ? 'the person' : `the group of ${groupDescription}`);

    // Replace [GENDER] placeholder in the scene prompt
    let prompt = rawPrompt.replace(/\[GENDER\]/g,
      count === 1 ? description : groupDescription
    );

    // Build seamless integration prefix using subject (no double article)
    const prefix = count === 1
      ? `Using ${subject} in the reference image exactly as they appear, with their exact face, skin tone, hair, and natural expression naturally integrated into this scene: `
      : `Using ${subject} in the reference image exactly as they appear, with all their exact faces and natural expressions naturally integrated together into this scene: `;

    return prefix + prompt;
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
