// js/app.js — Main application state and screen navigation

const App = {
  // State
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

  // Screen IDs
  screens: ['home', 'scenes', 'camera', 'processing', 'result', 'thankyou'],
  currentScreen: 'home',

  // ── Init ──
  async init() {
    this.renderCategories();
    this.bindEvents();
    this.checkOnlineStatus();
    this.showScreen('home');

    // Load saved settings from localStorage
    this.loadSettings();

    console.log('OM Events Photo Kiosk initialized');
  },

  // ── Screen Navigation ──
  showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(`screen-${name}`);
    if (el) {
      el.classList.add('active');
      this.currentScreen = name;
    }
  },

  // ── Render Category Grid ──
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

  // ── Select Category → Show Scenes ──
  selectCategory(categoryId) {
    const cat = TEMPLATES.categories.find(c => c.id === categoryId);
    if (!cat) return;

    this.state.selectedCategory = cat;

    // Render scene grid
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

  // ── Select Scene → Go to Camera ──
  async selectScene(sceneId) {
    const cat = this.state.selectedCategory;
    const scene = cat.scenes.find(s => s.id === sceneId);
    if (!scene) return;

    this.state.selectedScene = scene;

    // Update camera sidebar preview
    const previewLabel = document.getElementById('selected-scene-name');
    const previewBg = document.getElementById('selected-scene-bg');

    if (previewLabel) previewLabel.textContent = scene.name;
    if (previewBg) previewBg.style.background = scene.gradient;

    this.showScreen('camera');

    // Start camera
    const videoEl = document.getElementById('camera-feed');
    const started = await Camera.init(videoEl);

    if (!started) {
      alert('Camera not accessible. Please check permissions.');
      this.showScreen('scenes');
    }
  },

  // ── Capture Photo ──
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
          // Trigger re-animation
          countNum.style.animation = 'none';
          countNum.offsetHeight; // reflow
          countNum.style.animation = 'countPop 1s cubic-bezier(0.4,0,0.2,1) both';
        }
      },
      async (imageData) => {
        // Hide countdown
        if (overlay) overlay.classList.remove('active');

        // Store captured image
        this.state.capturedImage = imageData;
        API.setCapturedFace(imageData);

        // Stop camera
        Camera.stop();

        // Go to processing
        this.showScreen('processing');
        this.startGeneration();
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

    // Check online status
    const online = navigator.onLine;
    let result;

    if (online) {
      result = await API.generatePhoto(
        scene.prompt,
        scene.negative,
        updateMessage
      );
    }

    // If offline or API failed — use fallback
    if (!online || !result?.success) {
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

  // ── Show Result ──
  async showResultScreen(imageUrl) {
    const resultImg = document.getElementById('result-image');
    const qrCanvas = document.getElementById('qr-canvas');
    const timerFill = document.getElementById('timer-fill');
    const timerCount = document.getElementById('timer-count');

    if (resultImg) resultImg.src = imageUrl;

    this.showScreen('result');

    // Generate QR code
    try {
      await QRManager.generate(qrCanvas, imageUrl);
    } catch (err) {
      console.error('QR generation failed:', err);
    }

    // Mode handling
    const mode = this.state.mode;

    if (mode === 'print') {
      // Print only — no QR
      document.getElementById('qr-section')?.style.setProperty('display', 'none');
      setTimeout(() => this.triggerPrint(imageUrl), 1000);
      setTimeout(() => this.showThankYou(), 4000);
      return;
    }

    // Show QR timer (soft or both)
    if (timerFill) timerFill.style.width = '100%';

    QRManager.startTimer(30,
      (remaining, total) => {
        if (timerFill) timerFill.style.width = `${(remaining / total) * 100}%`;
        if (timerCount) timerCount.textContent = remaining;
      },
      () => {
        // Timer done
        if (mode === 'both') {
          this.triggerPrint(imageUrl);
        }
        this.showThankYou();
      }
    );
  },

  // ── Print ──
  triggerPrint(imageUrl) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>OM Events Photo</title>
          <style>
            * { margin: 0; padding: 0; }
            body { display: flex; align-items: center; justify-content: center; }
            img { width: 6in; height: 4in; object-fit: cover; }
            @media print {
              @page { size: 6in 4in; margin: 0; }
              img { width: 100vw; height: 100vh; }
            }
          </style>
        </head>
        <body>
          <img src="${imageUrl}" onload="window.print(); window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  },

  // ── Thank You Screen ──
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

  // ── Reset ──
  resetAndGoHome() {
    this.state.selectedCategory = null;
    this.state.selectedScene = null;
    this.state.capturedImage = null;
    this.state.resultImageUrl = null;
    API.capturedFaceBase64 = null;
    Camera.stop();
    QRManager.stopTimer();

    // Restore capture button
    const captureBtn = document.getElementById('capture-btn');
    if (captureBtn) captureBtn.style.display = 'flex';

    // Reset QR section visibility
    document.getElementById('qr-section')?.style.removeProperty('display');

    this.showScreen('home');
  },

  // ── Event Bindings ──
  bindEvents() {
    // Back button on scenes screen
    document.getElementById('back-to-home')?.addEventListener('click', () => {
      Camera.stop();
      this.showScreen('home');
    });

    // Back button on camera screen
    document.getElementById('back-to-scenes')?.addEventListener('click', () => {
      Camera.cancelCountdown();
      Camera.stop();
      this.showScreen('scenes');
    });

    // Capture button
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

  // ── Load Settings ──
  loadSettings() {
    try {
      const saved = localStorage.getItem('om-kiosk-settings');
      if (saved) {
        const settings = JSON.parse(saved);
        this.state.mode = settings.mode || 'soft';
        this.state.watermarkEnabled = settings.watermarkEnabled !== false;
      }
    } catch (e) {
      // Ignore
    }
  },

  saveSettings() {
    try {
      localStorage.setItem('om-kiosk-settings', JSON.stringify({
        mode: this.state.mode,
        watermarkEnabled: this.state.watermarkEnabled
      }));
    } catch (e) {
      // Ignore
    }
  }
};

// Boot
document.addEventListener('DOMContentLoaded', () => App.init());
