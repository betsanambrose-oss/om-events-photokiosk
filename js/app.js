// js/app.js — FINAL SAFE VERSION

const App = {
  state: {
    selectedCategory: null,
    selectedScene: null,
    personCount: 1,
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

    // Pre-load gender detection models in background (non-blocking)
    // Try immediately, retry after delays if face-api not ready yet
    const tryLoadGender = (attempt = 0) => {
      if (typeof GenderDetector !== 'undefined' && typeof faceapi !== 'undefined') {
        GenderDetector.loadModels().catch(() => {});
      } else if (attempt < 5) {
        setTimeout(() => tryLoadGender(attempt + 1), 1500 * (attempt + 1));
      }
    };
    setTimeout(() => tryLoadGender(), 1000);
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

    // Show person count screen before camera
    this.showCountScreen(scene);
  },

  showCountScreen(scene) {
    // Update count screen preview pill
    const pill = document.getElementById('count-scene-label');
    const thumb = document.getElementById('count-scene-thumb');
    if (pill) pill.textContent = scene.name;
    if (thumb) {
      thumb.style.background = scene.gradient;
      // Try thumbnail
      const img = new Image();
      img.onload = () => { thumb.style.backgroundImage = `url(assets/thumbnails/${scene.id}.webp)`; };
      img.src = `assets/thumbnails/${scene.id}.webp`;
    }

    // Reset selected count buttons
    document.querySelectorAll('.count-btn').forEach(b => b.classList.remove('selected'));

    this.showScreen('count');
  },

  async setPersonCount(count) {
    this.state.personCount = count;

    // Highlight selected button
    document.querySelectorAll('.count-btn').forEach(b => {
      b.classList.toggle('selected', parseInt(b.dataset.count) === count);
    });

    // Update camera instructions based on count
    const instructionEl = document.getElementById('camera-instruction-text');
    const hintEl = document.getElementById('face-guide-hint');

    const faceGuide = document.querySelector('.face-guide');
    if (count === 1) {
      if (instructionEl) instructionEl.innerHTML = 'Stand 2-3 feet from camera<br>Face forward, look at lens<br>Full body visible in frame';
      if (hintEl) hintEl.textContent = 'Position yourself here';
      // Solo: medium portrait frame
      if (faceGuide) {
        faceGuide.style.width = '55%';
        faceGuide.style.height = '70%';
        faceGuide.style.top = '15%';
        faceGuide.style.left = '22.5%';
      }
    } else {
      if (instructionEl) instructionEl.innerHTML = `All ${count} people stand together<br>Everyone face the camera<br>Fit the whole group in frame`;
      if (hintEl) hintEl.textContent = `Fit all ${count} people in frame`;
      // Group: wider frame
      const guideWidth = Math.min(95, 55 + (count - 1) * 8);
      if (faceGuide) {
        faceGuide.style.width = guideWidth + '%';
        faceGuide.style.height = '80%';
        faceGuide.style.top = '10%';
        faceGuide.style.left = ((100 - guideWidth) / 2) + '%';
      }
    }

    // Update scene preview on camera screen — show thumbnail if available
    const previewLabel = document.getElementById('selected-scene-name');
    const previewBg = document.getElementById('selected-scene-bg');
    const scene = this.state.selectedScene;
    if (previewLabel) previewLabel.textContent = scene.name;
    if (previewBg) {
      // Set gradient as fallback first
      previewBg.style.background = scene.gradient;
      previewBg.style.backgroundSize = 'cover';
      previewBg.style.backgroundPosition = 'center';
      // Try loading the actual thumbnail
      const thumbImg = new Image();
      thumbImg.onload = () => {
        previewBg.style.backgroundImage = `url(assets/thumbnails/${scene.id}.webp)`;
        previewBg.style.backgroundSize = 'cover';
        previewBg.style.backgroundPosition = 'center';
      };
      thumbImg.src = `assets/thumbnails/${scene.id}.webp`;
    }

    // Short delay for visual feedback then go to camera
    await new Promise(r => setTimeout(r, 200));
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
    const personCount = this.state.personCount || 1;

    let enhancedPrompt;

    // Try gender detection — detect() handles all fallbacks internally
    if (typeof GenderDetector !== 'undefined' && API.capturedFaceBase64) {
      const detection = await GenderDetector.detect(API.capturedFaceBase64);
      enhancedPrompt = GenderDetector.buildPrompt(rawPrompt, detection, personCount);
      console.log('Gender result:', detection.description, '| detected:', detection.detected);
    } else {
      // GenderDetector not available — build neutral prompt
      const neutralPrompt = rawPrompt.replace(/\[GENDER\]/g, personCount > 1 ? 'people' : 'person');
      const prefix = personCount > 1
        ? `Using ONLY the group of exactly ${personCount} people visible in the reference image, with all their exact faces, skin tones, hair and proportions preserved — do not add or remove any people — naturally integrated into this scene: `
        : 'Using ONLY the single person visible in the reference image, with their exact face, skin tone, hair, and all physical features precisely preserved — no other people should appear — naturally integrated into this scene: ';
      enhancedPrompt = prefix + neutralPrompt;
    }

    if (navigator.onLine) {
      result = await API.generatePhoto(
        enhancedPrompt,
        this.state.selectedScene.negative,
        updateMessage,
        personCount
      );
    } else {
      result = await API.generateOfflineFallback();
    }

    if (!result || !result.success) {
      console.error('Generation failed:', result?.error);
      this.showError(result?.error || 'Unknown error');
      return;
    }

    // Apply watermark + frame overlays
    this.updateMessage?.('Applying final touches...');
    let finalImageUrl = result.imageUrl;
    try {
      finalImageUrl = await Settings.applyOverlays(result.imageUrl);
    } catch (e) {
      console.warn('Overlay failed, using original:', e);
    }

    this.state.resultImageUrl = finalImageUrl;
    this.showResultScreen(finalImageUrl);
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

  async showResultScreen(imageUrl) {
    const resultImg = document.getElementById('result-image');
    if (resultImg) {
      resultImg.src = imageUrl;
      // Make image tappable to open download URL directly
      resultImg.style.cursor = 'pointer';
      resultImg.onclick = () => window.open(imageUrl, '_blank');
    }
    this.showScreen('result');

    const qrCanvas = document.getElementById('qr-canvas');
    if (qrCanvas) {
      try { await QRManager.generate(qrCanvas, imageUrl); }
      catch (err) { console.error('QR failed:', err); }
    }

    const mode = this.state.mode;

    if (mode === 'print') {
      document.getElementById('qr-section')?.style.setProperty('display', 'none');
      setTimeout(() => this.triggerPrint(imageUrl), 1500);
      setTimeout(() => this.showThankYou(), 5000);
      return;
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
          if (mode === 'both') this.triggerPrint(imageUrl);
          this.showThankYou();
        }
      );
    }, 500);
  },

  triggerPrint(imageUrl) {
    Settings.printImage(imageUrl);
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
    this.state.personCount = 1;
    this.state.capturedImage = null;
    this.state.resultImageUrl = null;
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
    document.getElementById('back-to-home-from-count')?.addEventListener('click', () => {
      this.showScreen('home');
    });
    document.getElementById('back-to-scenes')?.addEventListener('click', () => {
      this.unlock();
      Camera.cancelCountdown();
      Camera.stop();
      this.showScreen('count'); // back to count screen
    });
    document.getElementById('capture-btn')?.addEventListener('click', () => {
      this.startCapture();
    });
  },

  checkOnlineStatus() {
    const update = () => {
      const indicator = document.getElementById('online-indicator');
      if (indicator) {
        indicator.textContent = navigator.onLine ? '● Online' : '○ Offline Mode';
        indicator.style.color = navigator.onLine ? '#4CAF50' : '#C9A84C';
      }
    };
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    update();
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
