// js/app.js — FINAL SAFE VERSION

const App = {
  state: {
    selectedCategory: null,
    selectedScene: null,
    capturedImage: null,
    resultImageUrl: null,
    mode: 'soft',
    watermarkEnabled: true
  },

  currentScreen: 'home',
  adminTaps: 0,
  thankYouInterval: null,
  LOCKED: false, // single global lock — when true, nothing can start

  async init() {
    this.renderCategories();
    this.bindEvents();
    this.checkOnlineStatus();
    this.loadSettings();
    this.showScreen('home');
    console.log('GAME ON Kiosk ready');

    // Init tracker — restore active event if any
    if (typeof Tracker !== 'undefined') Tracker.init();

    // Show event name on home screen
    this.updateHomeEventName();

    // Show reminder if no active event
    const reminder = document.getElementById('event-reminder');
    if (reminder && typeof Tracker !== 'undefined' && !Tracker.isEventActive()) {
      reminder.style.display = 'block';
    }

    // Pre-load gender detection models in background (non-blocking)
    const tryLoadGender = (attempt = 0) => {
      if (typeof GenderDetector !== 'undefined' && typeof faceapi !== 'undefined') {
        GenderDetector.loadModels().catch(() => {});
      } else if (attempt < 5) {
        setTimeout(() => tryLoadGender(attempt + 1), 1500 * (attempt + 1));
      }
    };
    setTimeout(() => tryLoadGender(), 1000);
  },

  updateHomeEventName() {
    const eventNameEl = document.getElementById('home-event-name');
    const reminder = document.getElementById('event-reminder');

    if (reminder && typeof Tracker !== 'undefined') {
      reminder.style.display = Tracker.isEventActive() ? 'none' : 'block';
    }

    if (!eventNameEl) return;
    const info = typeof Settings !== 'undefined' ? Settings.getEventInfo() : null;
    const active = typeof Tracker !== 'undefined' ? Tracker.getActiveEvent() : null;
    const name = active?.name || info?.name || '';
    if (name && name !== 'GAME ON') {
      eventNameEl.textContent = name;
      eventNameEl.style.display = 'block';
    } else {
      eventNameEl.style.display = 'none';
    }
  },

  lock() {
    this.LOCKED = true;
    console.log('🔒 LOCKED');
  },

  unlock() {
    this.LOCKED = false;
    API.isGenerating = false;
    console.log('🔓 UNLOCKED');
  },

  showScreen(name) {
    if (name === 'home') this.cleanup();
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(`screen-${name}`);
    if (el) { el.classList.add('active'); this.currentScreen = name; }
    console.log('Screen:', name);
  },

  activeFilter: 'all',

  renderCategories() { this.renderHome(); },

  renderHome() {
    this.renderFilterBar();
    this.renderSceneGrid();
  },

  renderFilterBar() {
    const bar = document.getElementById('filter-bar');
    if (!bar) return;
    const cats = Settings.getActiveCategories();
    const filters = [{ id: 'all', name: 'All', icon: '✨' }, ...cats.map(c => ({ id: c.id, name: c.name, icon: c.icon }))];
    bar.innerHTML = filters.map(f => `
      <button class="filter-tab ${f.id === this.activeFilter ? 'active' : ''}"
        onclick="App.setFilter('${f.id}')">${f.icon} ${f.name}</button>
    `).join('');
  },

  setFilter(filterId) {
    this.activeFilter = filterId;
    this.renderFilterBar();
    this.renderSceneGrid();
  },

  renderSceneGrid() {
    const grid = document.getElementById('scene-grid-home');
    if (!grid) return;
    const cats = Settings.getActiveCategories();
    let scenes = [];
    if (this.activeFilter === 'all') {
      cats.forEach(cat => {
        Settings.getActiveScenes(cat.id).forEach(scene => {
          scenes.push({ ...scene, categoryId: cat.id, categoryName: cat.name });
        });
      });
    } else {
      const cat = cats.find(c => c.id === this.activeFilter);
      if (cat) {
        Settings.getActiveScenes(cat.id).forEach(scene => {
          scenes.push({ ...scene, categoryId: cat.id, categoryName: cat.name });
        });
      }
    }
    if (scenes.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;
        color:rgba(255,255,255,0.3);font-size:12px;letter-spacing:3px;text-transform:uppercase;">
        No scenes available</div>`;
      return;
    }
    grid.innerHTML = scenes.map((scene, i) => `
      <div class="scene-card-home" style="animation-delay:${i * 0.03}s"
        onclick="App.selectScene('${scene.id}', '${scene.categoryId}')">
        <div class="scene-card-inner">
          <div class="scene-thumb"
            style="background:${scene.gradient}; background-size:cover; background-position:center;"
            data-thumb="assets/thumbnails/${scene.id}.webp"></div>
          <div class="scene-overlay-home"></div>
          <div class="scene-select-ring-home"></div>
          <div class="scene-info">
            <span class="scene-cat-badge">${scene.categoryName}</span>
            <span class="scene-title-home">${scene.name}</span>
          </div>
        </div>
      </div>
    `).join('');
    this.loadThumbnails();
  },

  loadThumbnails() {
    document.querySelectorAll('.scene-thumb[data-thumb]').forEach(el => {
      const src = el.dataset.thumb;
      const img = new Image();
      img.onload = () => {
        // Override the gradient with the actual thumbnail image
        // Keep background-size:cover and background-position:center
        el.style.backgroundImage = `url(${src})`;
        el.style.backgroundSize = 'cover';
        el.style.backgroundPosition = 'center';
      };
      img.onerror = () => {
        // Gradient fallback already set — do nothing
      };
      // Add cache-busting only for development
      img.src = src;
    });
  },

  async selectScene(sceneId, categoryId) {
    if (this.LOCKED) return;
    const catId = categoryId || this.activeFilter;
    const cat = TEMPLATES.categories.find(c => c.id === catId) || TEMPLATES.categories.find(c => c.scenes.some(s => s.id === sceneId));
    const scene = cat?.scenes.find(s => s.id === sceneId);
    if (!scene) return;
    this.state.selectedScene = scene;
    this.state.selectedCategory = cat;
    await this.goToCamera(scene);
  },

  async goToCamera(scene) {
    // Update camera screen preview
    const previewLabel = document.getElementById('selected-scene-name');
    const previewBg = document.getElementById('selected-scene-bg');
    if (previewLabel) previewLabel.textContent = scene.name;
    if (previewBg) {
      previewBg.style.background = scene.gradient;
      previewBg.style.backgroundSize = 'cover';
      previewBg.style.backgroundPosition = 'center';
      const thumbImg = new Image();
      thumbImg.onload = () => {
        previewBg.style.backgroundImage = `url(assets/thumbnails/${scene.id}.webp)`;
        previewBg.style.backgroundSize = 'cover';
        previewBg.style.backgroundPosition = 'center';
      };
      thumbImg.src = `assets/thumbnails/${scene.id}.webp`;
    }

    // Camera instructions — simpler wording for the plain (no-AI) photo
    const instructionEl = document.getElementById('camera-instruction-text');
    const hintEl = document.getElementById('face-guide-hint');
    if (scene.noAI) {
      if (instructionEl) instructionEl.innerHTML = 'Get everyone in the frame<br>Look at the camera<br>Smile!';
      if (hintEl) hintEl.textContent = 'Stand in this area';
    } else {
      if (instructionEl) instructionEl.innerHTML = 'Stand 3-4 feet from camera<br>Everyone face forward<br>Full body visible in frame';
      if (hintEl) hintEl.textContent = 'Everyone stand in this area';
    }

    // Reset face guide to full-body frame
    const faceGuide = document.querySelector('.face-guide');
    if (faceGuide) {
      faceGuide.style.width = '80%';
      faceGuide.style.height = '85%';
      faceGuide.style.top = '7%';
      faceGuide.style.left = '10%';
    }

    this.showScreen('camera');
    this.setCameraStatus('Starting camera...');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.setCameraStatus('Camera not supported.\nPlease use Chrome browser.');
      return;
    }

    const videoEl = document.getElementById('camera-feed');
    const savedDeviceId = (typeof Settings !== 'undefined' ? Settings.load().cameraDeviceId : null) || null;
    const started = await Camera.init(videoEl, savedDeviceId);

    setTimeout(() => {
      if (videoEl.readyState >= 2 || videoEl.srcObject) {
        this.setCameraStatus('');
      } else if (!started) {
        this.setCameraStatus('Could not access camera.\nPlease allow camera permission and reload.');
      } else {
        this.setCameraStatus('');
      }
    }, 1500);
  },

  setCameraStatus(msg) {
    const statusEl = document.getElementById('camera-status');
    const captureBtn = document.getElementById('capture-btn');
    if (!statusEl) return;
    if (msg) {
      statusEl.textContent = msg;
      statusEl.style.display = 'flex';
      if (captureBtn) captureBtn.style.display = 'none';
    } else {
      statusEl.style.display = 'none';
      if (captureBtn) captureBtn.style.display = 'flex';
    }
  },

  // Shown when the face gate rejects a capture (turned/blocked/no face).
  // Keeps the guest on the camera screen and lets them retake immediately —
  // no API call spent, no processing screen, no wasted time.
  showFaceGateError() {
    const overlay = document.getElementById('countdown-overlay');
    const captureBtn = document.getElementById('capture-btn');
    if (overlay) overlay.classList.remove('active');

    // Unlock so they can tap capture again
    this.unlock();
    Camera._capturing = false;

    // Show a clear message
    this.setCameraStatus('Face Not Recognized\nPlease face the camera and try again.');

    // Auto-clear the message after 3.5s so it never lingers, and re-show the
    // capture button so they can retry.
    if (this._faceGateTimer) clearTimeout(this._faceGateTimer);
    this._faceGateTimer = setTimeout(() => {
      const statusEl = document.getElementById('camera-status');
      if (statusEl) statusEl.style.display = 'none';
      if (captureBtn) captureBtn.style.display = 'flex';
    }, 3500);

    // Re-show the capture button sooner too
    setTimeout(() => {
      if (captureBtn) captureBtn.style.display = 'flex';
    }, 100);
  },

  startCapture() {
    if (this.LOCKED) {
      console.warn('LOCKED — ignoring capture tap');
      return;
    }

    // Lock immediately on first tap
    this.lock();

    // Clear any lingering status message (e.g. the face-gate "Face Not
    // Recognized" overlay) so it doesn't sit on top of the countdown.
    const statusEl = document.getElementById('camera-status');
    if (statusEl) statusEl.style.display = 'none';

    const overlay = document.getElementById('countdown-overlay');
    const countNum = document.getElementById('countdown-number');
    const captureBtn = document.getElementById('capture-btn');

    if (captureBtn) captureBtn.style.display = 'none';
    if (overlay) overlay.classList.add('active');

    Camera.countdown(5,
      (count) => {
        if (countNum) {
          countNum.textContent = count;
          countNum.style.animation = 'none';
          countNum.offsetHeight;
          countNum.style.animation = 'countPop 1s cubic-bezier(0.4,0,0.2,1) both';
        }
      },
      async (imageData) => {
        if (overlay) overlay.classList.remove('active');
        if (countNum) countNum.style.fontSize = '';   // reset any capturing style

        // Validate capture — check it's not null or blank
        if (!imageData) {
          console.error('Capture returned null — camera may not be ready');
          this.unlock();
          this.setCameraStatus('Camera capture failed.\nMake sure camera is connected and try again.');
          if (captureBtn) captureBtn.style.display = 'flex';
          return;
        }

        // Check image is not suspiciously small (black/blank frame)
        const base64Part = imageData.split(',')[1] || '';
        const sizeKB = (base64Part.length * 0.75) / 1024;
        if (sizeKB < 10) {
          console.error('Captured image is blank/black:', Math.round(sizeKB) + 'KB');
          this.unlock();
          this.setCameraStatus('Camera returned a blank image.\nCheck your camera connection and try again.');
          if (captureBtn) captureBtn.style.display = 'flex';
          return;
        }

        this.state.capturedImage = imageData;
        API.setCapturedFace(imageData);

        // ── FACE GATE (AI scenes only) ──
        // Before spending an API call, verify a clear front-facing face is present.
        // Turned/blocked/absent faces make the model invent a stranger — so we
        // catch it here and ask for a recapture. Plain-photo scenes skip this.
        const scene = this.state.selectedScene;
        if (scene && !scene.noAI && typeof GenderDetector !== 'undefined') {
          const gate = await GenderDetector.detectFaceCount(imageData);
          if (!gate.ok) {
            console.warn('Face gate failed:', gate.reason);
            this.showFaceGateError();
            return;
          }
        }

        Camera.stop();
        this.showScreen('processing');
        await this.startGeneration();
      },
      // onCapturing — fires the moment the count hits zero, before the grab.
      // Just a brief visual cue; the capture itself is near-instant, so this
      // adds no real delay (no artificial pause).
      () => {
        if (countNum) {
          countNum.textContent = '📸';
          countNum.style.fontSize = '48px';
        }
      }
    );
  },

  async startGeneration() {
    const messageEl = document.getElementById('processing-message');

    // Stepped progress tracker driver
    // Steps: 0 Uploaded, 1 Visualizing, 2 Generating, 3 Created, 4 Previewing, 5 Done
    const Steps = {
      msgs: ['Uploading your photo...', 'Visualizing your scene...', 'Generating the magic...', 'Almost there...', 'Preparing your preview...', 'Done!'],
      current: 0,
      autoTimer: null,
      els: () => Array.from(document.querySelectorAll('#progress-steps .progress-step')),
      set(index) {
        // Never move backwards — only advance
        if (index < this.current) return;
        this.current = index;
        const steps = this.els();
        steps.forEach((el, i) => {
          el.classList.remove('active', 'done');
          if (i < index) el.classList.add('done');
          else if (i === index) el.classList.add('active');
        });
        if (messageEl && this.msgs[index]) messageEl.textContent = this.msgs[index];
      },
      // Gently auto-advance through steps 1→4 so the bar keeps moving during
      // the AI wait, building curiosity. Capped at step 4 (Previewing) — the
      // real completion (step 5 Done) only fires when the image is actually ready.
      startAuto() {
        this.stopAuto();
        // Pace: visualizing ~1s, generating ~sits longest, then creep toward previewing
        const schedule = [
          { at: 800,  step: 1 },
          { at: 2200, step: 2 },
          { at: 7000, step: 3 },
          { at: 12000, step: 4 }
        ];
        const start = Date.now();
        this.autoTimer = setInterval(() => {
          const elapsed = Date.now() - start;
          for (const s of schedule) {
            if (elapsed >= s.at) this.set(s.step);
          }
          if (this.current >= 4) this.stopAuto();
        }, 400);
      },
      stopAuto() {
        if (this.autoTimer) { clearInterval(this.autoTimer); this.autoTimer = null; }
      },
      reset() { this.current = 0; this.set(0); }
    };
    this.Steps = Steps;
    Steps.reset();

    const updateMessage = (msg) => {
      console.log('Status:', msg);
      // Real backend milestones can still nudge steps forward (never backward)
      const m = (msg || '').toLowerCase();
      if (m.includes('upload') || m.includes('compress') || m.includes('preparing your photo')) Steps.set(0);
      else if (m.includes('creating') || m.includes('generat') || m.includes('working') || m.includes('scene')) Steps.set(2);
    };
    this.updateMessage = updateMessage;

    // Start the continuous auto-advance so the bar always feels alive
    Steps.set(0);
    Steps.startAuto();

    let result;

    const scene = this.state.selectedScene;

    // ── PLAIN PHOTO (no AI) ──
    // Scenes flagged noAI skip generation entirely: the captured photo is used
    // as-is. Costs nothing, returns instantly. It still flows through the normal
    // branding, R2 upload, QR and print path below.
    if (scene.noAI) {
      console.log('Plain photo mode — skipping AI generation');
      Steps.stopAuto();
      Steps.set(3);
      result = { success: true, imageUrl: this.state.capturedImage };
    } else {

    // Build gender-aware prompt
    const rawPrompt = this.state.selectedScene.prompt || '';

    // Resolve scene reference image URL if present
    let sceneReferenceUrl = null;
    if (scene.referenceImage) {
      // Build absolute URL from relative path
      const base = window.location.href.replace(/[^/]*$/, '');
      sceneReferenceUrl = base + scene.referenceImage;
      console.log('Scene reference image:', sceneReferenceUrl);
    }

    let enhancedPrompt;

    if (sceneReferenceUrl) {
      // Reference image mode — simpler prompt focused on face placement
      // image_1 = face, image_2 = scene
      const genderWord = (typeof GenderDetector !== 'undefined' && API.capturedFaceBase64)
        ? (await GenderDetector.detect(API.capturedFaceBase64)).description
        : 'person';
      enhancedPrompt = rawPrompt.replace(/\[GENDER\]/g, genderWord);
      console.log('Using reference image mode — prompt only, no prefix');
    } else if (typeof GenderDetector !== 'undefined' && API.capturedFaceBase64) {
      // Standard mode — gender-aware prompt with prefix
      const detection = await GenderDetector.detect(API.capturedFaceBase64);
      enhancedPrompt = GenderDetector.buildPrompt(rawPrompt, detection, 1);
      console.log('Gender result:', detection.description, '| detected:', detection.detected);
    } else {
      // Fallback — neutral prompt with prefix
      const neutralPrompt = rawPrompt.replace(/\[GENDER\]/g, 'person');
      enhancedPrompt = 'Using ONLY the exact people visible in the reference image — preserve every face, skin tone, hair and physical feature precisely, do not add or remove any people — place them naturally into this scene: ' + neutralPrompt;
    }

    // FACE-ACCURACY BOOST — crop a tight high-res face close-up to send as an
    // identity anchor alongside the full shot. This is the biggest lever for
    // face accuracy: the AI locks the face from a large sharp crop instead of
    // Generate a tight, high-res face crop as the identity anchor.
    // For STANDARD scenes: sent as an extra first image (face lock + full body).
    // For REFERENCE scenes (CM photo): the crop REPLACES the wide guest photo as
    //   PHOTO A, because a sharp close-up is a far stronger identity reference than
    //   a small face in a wide full-body shot. This is the key CM-scene fix.
    let faceCropBase64 = null;
    if (typeof GenderDetector !== 'undefined' && API.capturedFaceBase64) {
      try {
        const crop = await GenderDetector.cropFaces(API.capturedFaceBase64);
        if (crop) {
          faceCropBase64 = crop.replace(/^data:image\/\w+;base64,/, '');
          console.log('Face crop ready — identity anchor');
        }
      } catch (e) {
        console.warn('Face crop failed (non-critical):', e.message);
      }
    }

    if (navigator.onLine) {
      result = await API.generatePhoto(
        enhancedPrompt,
        scene.negative,
        updateMessage,
        sceneReferenceUrl,
        {
          sceneName: scene.name || '',
          categoryName: scene.categoryName || '',
          faceCropBase64,
          isReferenceScene: !!sceneReferenceUrl
        }
      );
    } else {
      result = await API.generateOfflineFallback();
    }

    } // end of AI-generation branch (skipped for plain-photo scenes)

    if (!result || !result.success) {
      console.error('Generation failed:', result?.error);
      this.Steps?.stopAuto();
      this.showError(result?.error || 'Unknown error');
      return;
    }

    // Step 3 — Created (image is back from AI). Stop the auto-advance.
    this.Steps?.stopAuto();
    this.Steps?.set(3);

    // Apply watermark + frame + logo overlays to the raw AI image.
    // The BRANDED result is what we display AND upload to R2, so the QR/download
    // and print all carry the frame and client logo.
    this.Steps?.set(4); // Previewing
    const displaySource = result.imageUrl;   // raw AI base64
    let brandedUrl = displaySource;          // will become the branded version
    try {
      brandedUrl = await Settings.applyOverlays(displaySource);
    } catch (e) {
      console.warn('Overlay failed, using original:', e);
    }

    // Upload the BRANDED image to R2 → this URL is what the QR points to,
    // so the downloaded/printed photo includes the frame + logo branding.
    let shareUrl = null;
    try {
      shareUrl = await API.uploadBranded(brandedUrl, {
        sceneName: this.state.selectedScene?.name || '',
        categoryName: this.state.selectedCategory?.name || ''
      });
    } catch (e) {
      console.warn('Branded upload failed:', e);
    }

    // Display + print use the branded image; QR/download use the branded R2 URL
    const displayUrl = brandedUrl;
    this.state.resultImageUrl = shareUrl || brandedUrl;

    // Track photo in event log (store shareable R2 URL if available)
    if (typeof Tracker !== 'undefined' && Tracker.isEventActive()) {
      const scene = this.state.selectedScene;
      const cat = this.state.selectedCategory;
      this.state.currentPhotoId = Tracker.recordPhoto(scene, cat, shareUrl || '');
    }

    // Step 5 — Done (mark all complete before showing result)
    this.Steps?.set(5);
    const doneSteps = document.querySelectorAll('#progress-steps .progress-step');
    doneSteps.forEach(el => { el.classList.remove('active'); el.classList.add('done'); });

    this.showResultScreen(displayUrl, shareUrl);
  },

  showError(errorMsg) {
    // Unlock so user can try again
    this.unlock();

    const messageEl = document.getElementById('processing-message');
    const spinner = document.querySelector('.gold-spinner');
    const dots = document.querySelector('.processing-dots');
    if (spinner) spinner.style.display = 'none';
    if (dots) dots.style.display = 'none';

    if (messageEl) {
      messageEl.innerHTML = `
        <span style="color:#ff6b6b;font-size:16px;">Something went wrong</span><br><br>
        <span style="font-size:11px;opacity:0.6;line-height:1.6;">${errorMsg.substring(0, 150)}</span><br><br>
        <button onclick="App.resetAndGoHome()" style="
          background:#F6020C;color:#fff;border:none;padding:12px 32px;
          font-size:12px;letter-spacing:3px;text-transform:uppercase;
          border-radius:2px;cursor:pointer;margin-top:8px;">
          TRY AGAIN
        </button>
      `;
    }
  },

  async showResultScreen(displayUrl, shareUrl) {
    // displayUrl = canvas with overlays (shown on screen, may be base64)
    // shareUrl = permanent R2 URL for QR + download (null if photo not cloud-saved)
    // QR must NEVER receive base64 — it can't encode that much data

    const resultImg = document.getElementById('result-image');
    const printBtn = document.getElementById('print-btn');

    // Disable the print button until the result image has fully loaded.
    // Printing before the image is ready was hanging the whole browser and
    // forcing a system restart. The button re-enables on image load.
    this._resultImageReady = false;
    if (printBtn) {
      printBtn.disabled = true;
      printBtn.classList.add('loading');
    }

    if (resultImg) {
      resultImg.onload = () => {
        this._resultImageReady = true;
        if (printBtn) { printBtn.disabled = false; printBtn.classList.remove('loading'); }
      };
      resultImg.onerror = () => {
        // Even on error, let staff proceed (don't leave the button dead forever)
        this._resultImageReady = true;
        if (printBtn) { printBtn.disabled = false; printBtn.classList.remove('loading'); }
      };
      resultImg.src = displayUrl;
      // If it was already cached and loaded instantly, onload may not fire
      if (resultImg.complete && resultImg.naturalWidth > 0) {
        this._resultImageReady = true;
        if (printBtn) { printBtn.disabled = false; printBtn.classList.remove('loading'); }
      }
      // Image is NOT clickable — tapping it used to open the photo in a new
      // fullscreen tab with no way back in kiosk mode. The QR is for downloading.
      resultImg.style.cursor = 'default';
      resultImg.onclick = null;
    }
    this.showScreen('result');

    const qrCanvas = document.getElementById('qr-canvas');
    const qrHint = document.querySelector('.qr-hint');
    if (qrCanvas) {
      if (shareUrl) {
        // Valid R2 URL — generate scannable QR
        try {
          await QRManager.generate(qrCanvas, shareUrl);
          if (qrHint) qrHint.textContent = 'Scan with your phone camera';
        } catch (err) {
          console.error('QR failed:', err);
        }
      } else {
        // No cloud URL (no active event) — show friendly message instead of broken QR
        console.warn('No shareUrl — photo not cloud-saved, skipping QR');
        const ctx = qrCanvas.getContext('2d');
        qrCanvas.width = 200; qrCanvas.height = 200;
        ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, 200, 200);
        ctx.fillStyle = '#888'; ctx.font = '12px Arial'; ctx.textAlign = 'center';
        ctx.fillText('No active event', 100, 92);
        ctx.fillText('Photo not saved', 100, 112);
        if (qrHint) qrHint.textContent = 'Start an event to enable sharing';
      }
    }

    const mode = this.state.mode;

    const printSection = document.getElementById('print-section');
    const qrSection = document.getElementById('qr-section');

    // Reset print UI state every time result screen shows.
    // NOTE: printBtn is already declared above (for the load-gating). Reuse it.
    const printConfirm = document.getElementById('print-confirm');
    const printBadge = document.getElementById('print-status-badge');
    // Show the button, but keep it disabled until the image finishes loading
    // (the onload handler set above re-enables it). This prevents the print hang.
    if (printBtn) {
      printBtn.style.display = 'flex';
      printBtn.disabled = !this._resultImageReady;
      printBtn.classList.toggle('loading', !this._resultImageReady);
    }
    if (printConfirm) printConfirm.style.display = 'none';
    if (printBadge) { printBadge.style.display = 'none'; printBadge.className = 'print-status-badge'; }

    // Mode logic:
    // soft  → QR + timer only, no print button
    // print → print button only, no QR, no timer, staff taps manually
    // both  → QR + timer + print button
    if (mode === 'print') {
      if (qrSection) qrSection.style.display = 'none';
      if (printSection) printSection.style.display = 'flex';
      // No timer — stays on result screen until staff confirms print
      return;
    }

    // soft or both — show QR and run timer
    if (qrSection) qrSection.style.display = 'block';
    if (printSection) printSection.style.display = (mode === 'both') ? 'flex' : 'none';

    const timerFill = document.getElementById('timer-fill');
    const timerCount = document.getElementById('timer-count');
    if (timerFill) { timerFill.style.transition = 'none'; timerFill.style.width = '100%'; }
    if (timerCount) timerCount.textContent = '30';

    setTimeout(() => {
      if (timerFill) timerFill.style.transition = 'width 1s linear';
      QRManager.startTimer(30,
        (remaining, total) => {
          if (this.currentScreen !== 'result') { QRManager.stopTimer(); return; }
          if (timerFill) timerFill.style.width = `${(remaining / total) * 100}%`;
          if (timerCount) timerCount.textContent = remaining;
        },
        () => { this.showThankYou(); }
      );
    }, 500);
  },

  handlePrint() {
    // Debounce — ignore a second tap within 1.5s (double-tap protection)
    const now = Date.now();
    if (this._lastPrintTap && now - this._lastPrintTap < 1500) {
      console.warn('Print double-tap ignored');
      return;
    }
    this._lastPrintTap = now;

    const imageUrl = this.state.resultImageUrl;
    if (!imageUrl) return;

    // Safety guard — never print before the result image has loaded.
    // Printing an unready image was hanging the browser and forcing a restart.
    if (!this._resultImageReady) {
      console.warn('Print blocked — image not ready yet');
      return;
    }

    const printBtn = document.getElementById('print-btn');
    const printConfirm = document.getElementById('print-confirm');
    const printBadge = document.getElementById('print-status-badge');

    // Update tracker — mark as sent
    if (typeof Tracker !== 'undefined' && this.state.currentPhotoId) {
      Tracker.updatePrintStatus(this.state.currentPhotoId, 'sent');
    }

    // Disable print button while dialog is open
    if (printBtn) { printBtn.disabled = true; printBtn.classList.add('loading'); }

    // Open print dialog
    Settings.printImage(imageUrl);

    // Show confirmation buttons quickly — silent kiosk print fires immediately
    setTimeout(() => {
      if (printBtn) printBtn.style.display = 'none';
      if (printBadge) printBadge.style.display = 'none';
      if (printConfirm) printConfirm.style.display = 'block';
    }, 800);
  },

  confirmPrint(status) {
    // status: 'success' | 'failed'
    const printConfirm = document.getElementById('print-confirm');
    const printBadge = document.getElementById('print-status-badge');
    const printBtn = document.getElementById('print-btn');

    // Update tracker
    if (typeof Tracker !== 'undefined' && this.state.currentPhotoId) {
      Tracker.updatePrintStatus(this.state.currentPhotoId, status);
    }

    // Hide confirmation buttons
    if (printConfirm) printConfirm.style.display = 'none';

    if (status === 'success') {
      // Show success badge briefly then auto-advance to thank you
      if (printBadge) {
        printBadge.style.display = 'block';
        printBadge.className = 'print-status-badge success';
        printBadge.textContent = '✓ Printed Successfully';
      }
      setTimeout(() => { this.showThankYou(); }, 1500);

    } else {
      // Failed — show badge and retry button
      if (printBadge) {
        printBadge.style.display = 'block';
        printBadge.className = 'print-status-badge failed';
        printBadge.textContent = '✗ Print Failed — Tap to Retry';
        printBadge.style.cursor = 'pointer';
        printBadge.onclick = () => {
          printBadge.style.display = 'none';
          if (printBtn) {
            printBtn.style.display = 'flex';
            printBtn.disabled = false;
            printBtn.classList.remove('loading');
          }
        };
      }
    }
  },

  triggerPrint(imageUrl) {
    // Legacy — used by auto-print in 'both' mode timer
    this.handlePrint();
  },

  // Skip everything on the result screen and go straight back to the scene
  // grid for the next guest. Frees the booth immediately — no waiting for the
  // 30s download timer or the thank-you screen. This is the main queue-buster.
  nextGuest() {
    // Debounce — a double-tap here could fire the reset twice
    const now = Date.now();
    if (this._lastNextTap && now - this._lastNextTap < 1200) return;
    this._lastNextTap = now;

    QRManager.stopTimer();
    if (this.thankYouInterval) { clearInterval(this.thankYouInterval); this.thankYouInterval = null; }
    this.resetAndGoHome();
  },

  // Tapping the thank-you screen skips its countdown and returns home now.
  skipThankYou() {
    if (this.thankYouInterval) { clearInterval(this.thankYouInterval); this.thankYouInterval = null; }
    this.resetAndGoHome();
  },

  showThankYou() {
    QRManager.stopTimer();
    this.showScreen('thankyou');
    let count = 5;
    const el = document.getElementById('thankyou-countdown');
    if (el) el.textContent = 'Tap anywhere to continue';
    if (this.thankYouInterval) clearInterval(this.thankYouInterval);
    this.thankYouInterval = setInterval(() => {
      count--;
      if (count <= 0) {
        clearInterval(this.thankYouInterval);
        this.thankYouInterval = null;
        this.resetAndGoHome();
      }
    }, 1000);
  },

  resetAndGoHome() {
    this.unlock();
    this.state.selectedCategory = null;
    this.state.selectedScene = null;
    this.state.capturedImage = null;
    this.state.resultImageUrl = null;
    this.state.currentPhotoId = null;
    API.capturedFaceBase64 = null;
    API.faceImageUrl = null;
    Camera.stop();
    Camera.cancelCountdown();
    QRManager.stopTimer();
    if (this.thankYouInterval) { clearInterval(this.thankYouInterval); this.thankYouInterval = null; }

    // Restore processing screen
    const messageEl = document.getElementById('processing-message');
    if (messageEl) messageEl.textContent = 'Creating your moment...';
    const spinner = document.querySelector('.gold-spinner');
    if (spinner) spinner.style.display = '';
    const dots = document.querySelector('.processing-dots');
    if (dots) dots.style.display = '';
    const captureBtn = document.getElementById('capture-btn');
    if (captureBtn) captureBtn.style.display = 'flex';
    document.getElementById('qr-section')?.style.removeProperty('display');
    const resultImg = document.getElementById('result-image');
    if (resultImg) resultImg.src = '';
    const overlay = document.getElementById('countdown-overlay');
    if (overlay) overlay.classList.remove('active');

    this.updateHomeEventName();
    this.showScreen('home');
  },

  cleanup() {
    QRManager.stopTimer();
    Camera.cancelCountdown();
    if (this.thankYouInterval) { clearInterval(this.thankYouInterval); this.thankYouInterval = null; }
  },

  bindEvents() {
    document.getElementById('back-to-home')?.addEventListener('click', () => {
      this.unlock();
      Camera.stop();
      this.showScreen('home');
    });
    document.getElementById('back-to-scenes')?.addEventListener('click', () => {
      this.unlock();
      Camera.cancelCountdown();
      Camera.stop();
      this.showScreen('home');
    });
    document.getElementById('capture-btn')?.addEventListener('click', () => {
      this.startCapture();
    });
  },

  checkOnlineStatus() {
    const update = async () => {
      const indicator = document.getElementById('online-indicator');
      if (!indicator) return;

      if (!navigator.onLine) {
        indicator.textContent = '○ Offline';
        indicator.style.color = '#ff6b6b';
        return;
      }

      // Use Network module for quality detection if available
      if (typeof Network !== 'undefined') {
        const status = Network.getStatusLabel();
        indicator.textContent = status.text;
        indicator.style.color = status.color;
      } else {
        indicator.textContent = '● Online';
        indicator.style.color = '#4CAF50';
      }
    };

    // Monitor connection changes via Network module
    if (typeof Network !== 'undefined') {
      Network.startMonitoring(async () => {
        const status = Network.getStatusLabel();
        const indicator = document.getElementById('online-indicator');
        if (indicator) {
          indicator.textContent = status.text;
          indicator.style.color = status.color;
        }
      });
      // Initial detect
      Network.detect().then(update);
    } else {
      window.addEventListener('online', update);
      window.addEventListener('offline', update);
      update();
    }
  },

  loadSettings() {
    try {
      const s = Settings.load();
      this.state.mode = s.mode || 'soft';
      this.state.watermarkEnabled = s.omWatermark !== false;

      // Always ensure all current template categories are included
      const validIds = TEMPLATES.categories.map(c => c.id);
      if (!s.activeCategories || s.activeCategories.length < validIds.length) {
        const updated = { ...s, activeCategories: validIds };
        Settings.save(updated);
      }
    } catch (e) {}
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
