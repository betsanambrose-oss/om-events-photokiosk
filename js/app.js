// js/app.js — Main application state and screen navigation

const App = {
  state: {
    selectedCategory: null,
    selectedScene: null,
    capturedImage: null,
    resultImageUrl: null,
    mode: 'soft', // soft | print | both
    watermarkEnabled: true,
    clientLogo: null,
    isOnline: true
  },

  screens: ['home', 'scenes', 'camera', 'processing', 'result', 'thankyou'],
  currentScreen: 'home',
  adminTaps: 0,

  async init() {
    this.renderCategories();
    this.bindEvents();
    this.checkOnlineStatus();
    this.loadSettings();
    this.showScreen('home');
    console.log('OM Events Photo Kiosk initialized');
  },

  showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(`screen-${name}`);
    if (el) {
      el.classList.add('active');
      this.currentScreen = name;
    }
  },

  renderCategories() {
    const grid = document.getElementById('category-grid');
    if (!grid) return;

    grid.innerHTML = TEMPLATES.categories.map(cat => `
      <div class="category-card cat-${cat.id}" data-category="${cat.id}" onclick="App.selectCategory('${cat.id}')">
        <div class="card-bg" style="background: ${cat.gradient}"></div>
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
        <div class="scene-card" data-scene="${scene.id}" onclick="App.selectScene('${scene.id}')">
          <div class="scene-preview" style="background: ${scene.gradient}"></div>
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

    // Show camera screen first
    this.showScreen('camera');

    // Show loading state on camera screen
    this.setCameraStatus('Starting camera...');

    // Check if mediaDevices is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.setCameraStatus('Camera not supported on this browser. Please use Chrome or Firefox.');
      return;
    }

    // Start camera
    const videoEl = document.getElementById('camera-feed');
    const started = await Camera.init(videoEl);

    if (started) {
      this.setCameraStatus('');
    } else {
      this.setCameraStatus('Could not access camera.\n\nPlease:\n1. Allow camera permission\n2. Reload the page\n3. Try Chrome browser');
    }
  },

  setCameraStatus(msg) {
    let statusEl = document.getElementById('camera-status');
    if (!statusEl) return;
    if (msg) {
      statusEl.textContent = msg;
      statusEl.style.display = 'flex';
      document.getElementById('capture-btn').style.display = msg ? 'none' : 'flex';
    } else {
      statusEl.style.display = 'none';
      document.getElementById('capture-btn').style.display = 'flex';
    }
  },

  startCapture() {
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
        this.startGeneration();
      }
    );
  },

  async startGeneration() {
    const messageEl = document.getElementById('processing-message');
    const scene = this.state.selectedScene;

    const updateMessage = (msg) => {
      if (messageEl) messageEl.textContent = msg;
    };

    updateMessage('Creating your moment...');

    let result;

    if (navigator.onLine) {
      result = await API.generatePhoto(scene.prompt, scene.negative, updateMessage);
    }

    if (!navigator.onLine || !result?.success) {
      updateMessage('Preparing your photo...');
      result = await API.generateOfflineFallback(scene.prompt);
    }

    if (result?.success) {
      this.state.resultImageUrl = result.imageUrl;
      this.showResultScreen(result.imageUrl);
    } else {
      alert('Something went wrong. Please try again.');
      this.showScreen('home');
    }
  },

  async showResultScreen(imageUrl) {
    const resultImg = document.getElementById('result-image');
    const qrCanvas = document.getElementById('qr-canvas');
    const timerFill = document.getElementById('timer-fill');
    const timerCount = document.getElementById('timer-count');

    if (resultImg) resultImg.src = imageUrl;
    this.showScreen('result');

    try {
      await QRManager.generate(qrCanvas, imageUrl);
    } catch (err) {
      console.error('QR generation failed:', err);
    }

    const mode = this.state.mode;

    if (mode === 'print') {
      document.getElementById('qr-section')?.style.setProperty('display', 'none');
      setTimeout(() => this.triggerPrint(imageUrl), 1000);
      setTimeout(() => this.showThankYou(), 4000);
      return;
    }

    if (timerFill) timerFill.style.width = '100%';

    QRManager.startTimer(30,
      (remaining, total) => {
        if (timerFill) timerFill.style.width = `${(remaining / total) * 100}%`;
        if (timerCount) timerCount.textContent = remaining;
      },
      () => {
        if (mode === 'both') this.triggerPrint(imageUrl);
        this.showThankYou();
      }
    );
  },

  triggerPrint(imageUrl) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>OM Events Photo</title>
      <style>* { margin:0; padding:0; } body { display:flex; align-items:center; justify-content:center; }
      img { width:6in; height:4in; object-fit:cover; }
      @media print { @page { size:6in 4in; margin:0; } img { width:100vw; height:100vh; } }
      </style></head><body>
      <img src="${imageUrl}" onload="window.print(); window.close();" />
      </body></html>
    `);
    printWindow.document.close();
  },

  showThankYou() {
    QRManager.stopTimer();
    this.showScreen('thankyou');

    let count = 5;
    const countEl = document.getElementById('thankyou-countdown');
    if (countEl) countEl.textContent = `Returning in ${count} seconds...`;

    const interval = setInterval(() => {
      count--;
      if (countEl) countEl.textContent = `Returning in ${count} seconds...`;
      if (count <= 0) {
        clearInterval(interval);
        this.resetAndGoHome();
      }
    }, 1000);
  },

  resetAndGoHome() {
    this.state.selectedCategory = null;
    this.state.selectedScene = null;
    this.state.capturedImage = null;
    this.state.resultImageUrl = null;
    API.capturedFaceBase64 = null;
    Camera.stop();
    QRManager.stopTimer();

    const captureBtn = document.getElementById('capture-btn');
    if (captureBtn) captureBtn.style.display = 'flex';
    document.getElementById('qr-section')?.style.removeProperty('display');

    this.showScreen('home');
  },

  bindEvents() {
    document.getElementById('back-to-home')?.addEventListener('click', () => {
      Camera.stop();
      this.showScreen('home');
    });

    document.getElementById('back-to-scenes')?.addEventListener('click', () => {
      Camera.cancelCountdown();
      Camera.stop();
      this.showScreen('scenes');
    });

    document.getElementById('capture-btn')?.addEventListener('click', () => {
      this.startCapture();
    });
  },

  checkOnlineStatus() {
    const update = () => {
      this.state.isOnline = navigator.onLine;
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
        const settings = JSON.parse(saved);
        this.state.mode = settings.mode || 'soft';
        this.state.watermarkEnabled = settings.watermarkEnabled !== false;
      }
    } catch (e) {}
  },

  saveSettings() {
    try {
      localStorage.setItem('om-kiosk-settings', JSON.stringify({
        mode: this.state.mode,
        watermarkEnabled: this.state.watermarkEnabled
      }));
    } catch (e) {}
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
