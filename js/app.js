// js/app.js — SAFE VERSION: Single flow, no automatic retries

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
  generationStarted: false, // hard guard

  async init() {
    this.renderCategories();
    this.bindEvents();
    this.checkOnlineStatus();
    this.loadSettings();
    this.showScreen('home');
    console.log('OM Events Kiosk ready');
  },

  showScreen(name) {
    if (name === 'home') this.cleanup();
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(`screen-${name}`);
    if (el) {
      el.classList.add('active');
      this.currentScreen = name;
      console.log('Screen:', name);
    }
  },

  renderCategories() {
    const grid = document.getElementById('category-grid');
    if (!grid) return;
    grid.innerHTML = TEMPLATES.categories.map(cat => `
      <div class="category-card cat-${cat.id}" onclick="App.selectCategory('${cat.id}')">
        <div class="card-bg" style="background:${cat.gradient}"></div>
        <div class="card-overlay"></div>
        <div class="gold-corner"></div>
        <div class="card-content">
          <div class="card-icon">${cat.icon}</div>
          <div class="card-name">${cat.name}</div>
          <div class="card-count">${cat.scenes.length} Scenes</div>
        </div>
      </div>
    `).join('');
  },

  selectCategory(categoryId) {
    const cat = TEMPLATES.categories.find(c => c.id === categoryId);
    if (!cat) return;
    this.state.selectedCategory = cat;
    const grid = document.getElementById('scene-grid');
    const title = document.getElementById('scenes-category-name');
    if (title) title.innerHTML = `<span>${cat.name}</span> Scenes`;
    if (grid) {
      grid.innerHTML = cat.scenes.map(scene => `
        <div class="scene-card" onclick="App.selectScene('${scene.id}')">
          <div class="scene-preview" style="background:${scene.gradient}"></div>
          <div class="scene-overlay"></div>
          <div class="scene-select-ring"></div>
          <div class="scene-name">${scene.name}</div>
        </div>
      `).join('');
    }
    this.showScreen('scenes');
  },

  async selectScene(sceneId) {
    const cat = this.state.selectedCategory;
    const scene = cat.scenes.find(s => s.id === sceneId);
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

    // Double check — if video is actually playing, camera is working
    setTimeout(() => {
      if (videoEl.readyState >= 2 || videoEl.srcObject) {
        this.setCameraStatus(''); // camera is working, clear error
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
    // Prevent double tap — but reset if stuck
    if (this.generationStarted) {
      console.warn('Resetting stuck generation flag');
      this.generationStarted = false;
      API.isGenerating = false;
    }

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
        this.generationStarted = true;
        this.showScreen('processing');
        await this.startGeneration();
      }
    );
  },

  async startGeneration() {
    const messageEl = document.getElementById('processing-message');
    const scene = this.state.selectedScene;

    const updateMessage = (msg) => {
      if (messageEl) messageEl.textContent = msg;
      console.log('Status:', msg);
    };

    updateMessage('Starting...');

    let result;

    if (navigator.onLine) {
      // Single attempt — no retry
      result = await API.generatePhoto(scene.prompt, scene.negative, updateMessage);
    } else {
      // Offline — use fallback immediately
      console.log('No internet — using offline mode');
      result = await API.generateOfflineFallback();
    }

    // If online failed — show error screen then go home
    if (!result || !result.success) {
      console.error('Generation failed:', result?.error);
      this.generationStarted = false;
      this.showErrorAndGoHome(result?.error || 'Unknown error');
      return;
    }

    // Success — show result ONCE
    this.state.resultImageUrl = result.imageUrl;
    this.showResultScreen(result.imageUrl);
  },

  async showResultScreen(imageUrl) {
    const resultImg = document.getElementById('result-image');
    if (resultImg) resultImg.src = imageUrl;
    this.showScreen('result');

    // Generate QR
    const qrCanvas = document.getElementById('qr-canvas');
    if (qrCanvas) {
      try {
        await QRManager.generate(qrCanvas, imageUrl);
      } catch (err) {
        console.error('QR failed:', err);
      }
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
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<html><head><title>OM Events</title>
    <style>*{margin:0;padding:0;}img{width:6in;height:4in;object-fit:cover;display:block;}
    @media print{@page{size:6in 4in;margin:0;}img{width:100vw;height:100vh;}}</style>
    </head><body><img src="${imageUrl}" onload="window.print();setTimeout(()=>window.close(),1000);"/></body></html>`);
    w.document.close();
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
      if (count <= 0) { clearInterval(this.thankYouInterval); this.thankYouInterval = null; this.resetAndGoHome(); }
    }, 1000);
  },

  showErrorAndGoHome(errorMsg) {
    // Show error on processing screen then auto go home
    const messageEl = document.getElementById('processing-message');
    if (messageEl) {
      messageEl.innerHTML = `
        <span style="color:#ff6b6b; font-size:16px;">Something went wrong</span>
        <br><br>
        <span style="font-size:12px; opacity:0.7; letter-spacing:1px;">${errorMsg.substring(0, 100)}</span>
        <br><br>
        <span style="font-size:11px; color:#C9A84C; letter-spacing:2px;">Returning to home...</span>
      `;
    }
    // Stop spinner
    const spinner = document.querySelector('.gold-spinner');
    if (spinner) spinner.style.display = 'none';
    const dots = document.querySelector('.processing-dots');
    if (dots) dots.style.display = 'none';

    // Go home after 3 seconds
    setTimeout(() => {
      if (spinner) spinner.style.display = '';
      if (dots) dots.style.display = '';
      if (messageEl) messageEl.innerHTML = 'Creating your moment...';
      this.resetAndGoHome();
    }, 3000);
  },

  resetAndGoHome() {
    this.state.selectedScene = null;
    this.state.capturedImage = null;
    this.state.resultImageUrl = null;
    this.generationStarted = false;
    API.capturedFaceBase64 = null;
    API.faceImageUrl = null;
    API.isGenerating = false;
    Camera.stop();
    Camera.cancelCountdown();
    QRManager.stopTimer();
    if (this.thankYouInterval) { clearInterval(this.thankYouInterval); this.thankYouInterval = null; }
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
    document.getElementById('back-to-home')?.addEventListener('click', () => { Camera.stop(); this.showScreen('home'); });
    document.getElementById('back-to-scenes')?.addEventListener('click', () => { Camera.cancelCountdown(); Camera.stop(); this.showScreen('scenes'); });
    document.getElementById('capture-btn')?.addEventListener('click', () => { this.startCapture(); });
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
      const saved = localStorage.getItem('om-kiosk-settings');
      if (saved) {
        const s = JSON.parse(saved);
        this.state.mode = s.mode || 'soft';
      }
    } catch (e) {}
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
