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
    console.log('OM Events Kiosk ready');

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
    if (name && name !== 'OM Events') {
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

    // Camera instructions — same for all, no person count
    const instructionEl = document.getElementById('camera-instruction-text');
    const hintEl = document.getElementById('face-guide-hint');
    if (instructionEl) instructionEl.innerHTML = 'Stand 3-4 feet from camera<br>Everyone face forward<br>Full body visible in frame';
    if (hintEl) hintEl.textContent = 'Everyone stand in this area';

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
    const started = await Camera.init(videoEl);

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

  startCapture() {
    if (this.LOCKED) {
      console.warn('LOCKED — ignoring capture tap');
      return;
    }

    // Lock immediately on first tap
    this.lock();

    const overlay = document.getElementById('countdown-overlay');
    const countNum = document.getElementById('countdown-number');
    const captureBtn = document.getElementById('capture-btn');

    if (captureBtn) captureBtn.style.display = 'none';
    if (overlay) overlay.classList.add('active');

    Camera.countdown(3,
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
        Camera.stop();
        this.showScreen('processing');
        await this.startGeneration();
      }
    );
  },

  async startGeneration() {
    const messageEl = document.getElementById('processing-message');
    const updateMessage = (msg) => {
      if (messageEl) messageEl.textContent = msg;
      console.log('Status:', msg);
    };
    this.updateMessage = updateMessage;

    updateMessage('Starting...');

    let result;

    // Build gender-aware prompt
    const rawPrompt = this.state.selectedScene.prompt || '';
    const scene = this.state.selectedScene;

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
      // Kontext sees both images; image_1 = face, image_2 = scene
      // Don't add the usual prefix — the prompt already describes what to do
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

    if (navigator.onLine) {
      result = await API.generatePhoto(
        enhancedPrompt,
        scene.negative,
        updateMessage,
        sceneReferenceUrl
      );
    } else {
      result = await API.generateOfflineFallback();
    }

    if (!result || !result.success) {
      console.error('Generation failed:', result?.error);
      this.showError(result?.error || 'Unknown error');
      return;
    }

    // Apply watermark + frame overlays for DISPLAY only
    // Keep original fal.ai URL for QR and download
    this.updateMessage?.('Applying final touches...');
    const originalUrl = result.imageUrl; // fal.ai URL — used for QR + download
    let displayUrl = result.imageUrl;    // canvas version — used for on-screen display only
    try {
      displayUrl = await Settings.applyOverlays(result.imageUrl);
    } catch (e) {
      console.warn('Overlay failed, using original:', e);
    }

    this.state.resultImageUrl = originalUrl;

    // Track photo in event log
    if (typeof Tracker !== 'undefined' && Tracker.isEventActive()) {
      const scene = this.state.selectedScene;
      const cat = this.state.selectedCategory;
      this.state.currentPhotoId = Tracker.recordPhoto(scene, cat, originalUrl);
    }

    this.showResultScreen(displayUrl, originalUrl);
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
          background:#C9A84C;color:#000;border:none;padding:12px 32px;
          font-size:12px;letter-spacing:3px;text-transform:uppercase;
          border-radius:2px;cursor:pointer;margin-top:8px;">
          TRY AGAIN
        </button>
      `;
    }
  },

  async showResultScreen(displayUrl, downloadUrl) {
    // displayUrl = canvas with overlays (shown on screen, may be base64)
    // downloadUrl = original fal.ai URL (used for QR and download — always short)
    const qrUrl = downloadUrl || displayUrl;

    const resultImg = document.getElementById('result-image');
    if (resultImg) {
      resultImg.src = displayUrl;
      resultImg.style.cursor = 'pointer';
      resultImg.onclick = () => window.open(qrUrl, '_blank');
    }
    this.showScreen('result');

    const qrCanvas = document.getElementById('qr-canvas');
    if (qrCanvas) {
      try { await QRManager.generate(qrCanvas, qrUrl); }
      catch (err) { console.error('QR failed:', err); }
    }

    const mode = this.state.mode;

    // Show/hide print button based on output mode
    const printSection = document.getElementById('print-section');
    const qrSection = document.getElementById('qr-section');
    if (printSection) {
      printSection.style.display = (mode === 'soft') ? 'none' : 'flex';
    }

    // Reset print UI state
    const printBtn = document.getElementById('print-btn');
    const printConfirm = document.getElementById('print-confirm');
    const printBadge = document.getElementById('print-status-badge');
    if (printBtn) { printBtn.style.display = 'flex'; printBtn.disabled = false; printBtn.classList.remove('loading'); }
    if (printConfirm) printConfirm.style.display = 'none';
    if (printBadge) { printBadge.style.display = 'none'; printBadge.className = 'print-status-badge'; }

    if (mode === 'print') {
      if (qrSection) qrSection.style.display = 'none';
      return; // Staff taps print manually
    }

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
        () => {
          if (mode === 'both') this.triggerPrint(qrUrl);
          this.showThankYou();
        }
      );
    }, 500);
  },

  handlePrint() {
    const imageUrl = this.state.resultImageUrl;
    if (!imageUrl) return;

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

    // Show confirmation buttons after short delay
    // (gives time for print dialog to open and staff to interact)
    setTimeout(() => {
      if (printBtn) printBtn.style.display = 'none';
      if (printBadge) printBadge.style.display = 'none';
      if (printConfirm) printConfirm.style.display = 'block';
    }, 1500);
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

    // Show status badge
    if (printBadge) {
      printBadge.style.display = 'block';
      printBadge.className = 'print-status-badge ' + status;
      printBadge.textContent = status === 'success' ? '✓ Printed Successfully' : '✗ Print Failed — Retry?';
    }

    // If failed — show print button again for retry
    if (status === 'failed' && printBtn) {
      setTimeout(() => {
        printBtn.style.display = 'flex';
        printBtn.disabled = false;
        printBtn.classList.remove('loading');
        if (printBadge) printBadge.style.display = 'none';
        if (printConfirm) printConfirm.style.display = 'none';
      }, 2000);
    }
  },

  triggerPrint(imageUrl) {
    // Legacy — used by auto-print in 'both' mode timer
    this.handlePrint();
  },

  showThankYou() {
    QRManager.stopTimer();
    this.showScreen('thankyou');
    let count = 5;
    const el = document.getElementById('thankyou-countdown');
    if (el) el.textContent = `Returning in ${count} seconds...`;
    if (this.thankYouInterval) clearInterval(this.thankYouInterval);
    this.thankYouInterval = setInterval(() => {
      count--;
      if (el) el.textContent = `Returning in ${count} seconds...`;
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
