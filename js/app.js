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

  currentScreen: 'home',
  adminTaps: 0,
  thankYouInterval: null,

  async init() {
    this.renderCategories();
    this.bindEvents();
    this.checkOnlineStatus();
    this.loadSettings();
    this.showScreen('home');
    console.log('OM Events Photo Kiosk initialized');
  },

  // ── Screen Navigation ──
  showScreen(name) {
    // Clear any running timers when switching screens
    if (name === 'home') this.cleanup();

    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(`screen-${name}`);
    if (el) {
      el.classList.add('active');
      this.currentScreen = name;
      console.log('Screen:', name);
    }
  },

  // ── Render Category Grid ──
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

  // ── Select Category ──
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

  // ── Select Scene → Camera ──
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

    if (started) {
      this.setCameraStatus('');
    } else {
      this.setCameraStatus('Could not access camera.\n\nPlease allow camera permission\nand reload the page.');
    }
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

  // ── Capture ──
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
          countNum.offsetHeight; // force reflow
          countNum.style.animation = 'countPop 1s cubic-bezier(0.4,0,0.2,1) both';
        }
      },
      async (imageData) => {
        // Hide countdown immediately
        if (overlay) overlay.classList.remove('active');

        // Store face image
        this.state.capturedImage = imageData;
        API.setCapturedFace(imageData);

        // Stop camera
        Camera.stop();

        // Go to processing — stay here until fully done
        this.showScreen('processing');

        // Start generation — only moves to result when complete
        await this.startGeneration();
      }
    );
  },

  // ── AI Generation ──
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

    // Fallback if offline or failed
    if (!navigator.onLine || !result?.success) {
      updateMessage('Preparing your photo...');
      result = await API.generateOfflineFallback(scene.prompt);
    }

    if (result?.success) {
      this.state.resultImageUrl = result.imageUrl;
      // Only called ONCE when generation is fully done
      this.showResultScreen(result.imageUrl);
    } else {
      alert('Something went wrong. Please try again.');
      this.resetAndGoHome();
    }
  },

  // ── Result Screen — called ONCE only ──
  async showResultScreen(imageUrl) {
    // Set image
    const resultImg = document.getElementById('result-image');
    if (resultImg) {
      resultImg.src = imageUrl;
    }

    // Switch to result screen ONCE
    this.showScreen('result');

    // Generate QR
    const qrCanvas = document.getElementById('qr-canvas');
    try {
      await QRManager.generate(qrCanvas, imageUrl);
    } catch (err) {
      console.error('QR failed:', err);
    }

    const mode = this.state.mode;

    // ── Print only mode ──
    if (mode === 'print') {
      const qrSection = document.getElementById('qr-section');
      if (qrSection) qrSection.style.display = 'none';
      setTimeout(() => this.triggerPrint(imageUrl), 1500);
      setTimeout(() => this.showThankYou(), 5000);
      return;
    }

    // ── Soft or Both mode — show QR with 30 sec timer ──
    const timerFill = document.getElementById('timer-fill');
    const timerCount = document.getElementById('timer-count');

    // Reset timer bar to full
    if (timerFill) timerFill.style.transition = 'none';
    if (timerFill) timerFill.style.width = '100%';
    if (timerCount) timerCount.textContent = '30';

    // Small delay then start countdown
    setTimeout(() => {
      if (timerFill) timerFill.style.transition = 'width 1s linear';

      QRManager.startTimer(30,
        (remaining, total) => {
          if (timerFill) timerFill.style.width = `${(remaining / total) * 100}%`;
          if (timerCount) timerCount.textContent = remaining;
        },
        () => {
          // Timer finished — print if both mode, then thank you
          if (mode === 'both') this.triggerPrint(imageUrl);
          this.showThankYou();
        }
      );
    }, 300);
  },

  // ── Print ──
  triggerPrint(imageUrl) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>OM Events Photo</title>
      <style>
        * { margin:0; padding:0; }
        body { display:flex; align-items:center; justify-content:center; background:#000; }
        img { width:6in; height:4in; object-fit:cover; display:block; }
        @media print { @page { size:6in 4in; margin:0; } img { width:100vw; height:100vh; } }
      </style></head>
      <body><img src="${imageUrl}" onload="window.print(); setTimeout(()=>window.close(),1000);" /></body>
      </html>
    `);
    printWindow.document.close();
  },

  // ── Thank You ──
  showThankYou() {
    QRManager.stopTimer();
    this.showScreen('thankyou');

    let count = 5;
    const countEl = document.getElementById('thankyou-countdown');
    if (countEl) countEl.textContent = `Returning in ${count} seconds...`;

    if (this.thankYouInterval) clearInterval(this.thankYouInterval);

    this.thankYouInterval = setInterval(() => {
      count--;
      if (countEl) countEl.textContent = `Returning in ${count} seconds...`;
      if (count <= 0) {
        clearInterval(this.thankYouInterval);
        this.thankYouInterval = null;
        this.resetAndGoHome();
      }
    }, 1000);
  },

  // ── Reset & Home ──
  resetAndGoHome() {
    this.state.selectedCategory = null;
    this.state.selectedScene = null;
    this.state.capturedImage = null;
    this.state.resultImageUrl = null;
    API.capturedFaceBase64 = null;

    Camera.stop();
    Camera.cancelCountdown();
    QRManager.stopTimer();

    if (this.thankYouInterval) {
      clearInterval(this.thankYouInterval);
      this.thankYouInterval = null;
    }

    // Reset UI elements
    const captureBtn = document.getElementById('capture-btn');
    if (captureBtn) captureBtn.style.display = 'flex';

    const qrSection = document.getElementById('qr-section');
    if (qrSection) qrSection.style.display = '';

    const resultImg = document.getElementById('result-image');
    if (resultImg) resultImg.src = '';

    const timerFill = document.getElementById('timer-fill');
    if (timerFill) timerFill.style.width = '100%';

    const overlay = document.getElementById('countdown-overlay');
    if (overlay) overlay.classList.remove('active');

    this.showScreen('home');
  },

  // ── Cleanup (called when going home) ──
  cleanup() {
    QRManager.stopTimer();
    Camera.cancelCountdown();
    if (this.thankYouInterval) {
      clearInterval(this.thankYouInterval);
      this.thankYouInterval = null;
    }
  },

  // ── Event Bindings ──
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

  // ── Online Status ──
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

  // ── Settings ──
  loadSettings() {
    try {
      const saved = localStorage.getItem('om-kiosk-settings');
      if (saved) {
        const s = JSON.parse(saved);
        this.state.mode = s.mode || 'soft';
        this.state.watermarkEnabled = s.watermarkEnabled !== false;
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
