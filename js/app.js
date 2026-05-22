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
      img.onload = () => { el.style.backgroundImage = `url(${src})`; };
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

    const previewLabel = document.getElementById('selected-scene-name');
    const previewBg = document.getElementById('selected-scene-bg');
    if (previewLabel) previewLabel.textContent = scene.name;
    if (previewBg) previewBg.style.background = scene.gradient;

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

    if (navigator.onLine) {
      result = await API.generatePhoto(
        this.state.selectedScene.prompt,
        this.state.selectedScene.negative,
        updateMessage
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
    if (resultImg) resultImg.src = imageUrl;
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
