// js/admin.js — Admin Panel Logic

const Admin = {
  settings: {},
  cameraStream: null,
  DEFAULT_PASSWORD: 'omevents2024',

  // ── INIT ──
  init() {
    this.loadSettings();
    this.updateOnlineStatus();
    window.addEventListener('online', () => this.updateOnlineStatus());
    window.addEventListener('offline', () => this.updateOnlineStatus());
    // Auto-focus password field
    setTimeout(() => document.getElementById('password-input')?.focus(), 100);
  },

  // ── LOGIN ──
  login() {
    const input = document.getElementById('password-input');
    const error = document.getElementById('login-error');
    const stored = localStorage.getItem('om-admin-password') || this.DEFAULT_PASSWORD;

    if (input.value === stored) {
      document.getElementById('login-screen').style.display = 'none';
      document.getElementById('admin-app').classList.add('active');
      this.populateUI();
      error.textContent = '';
    } else {
      error.textContent = 'Incorrect password';
      input.value = '';
      input.focus();
      // Shake animation
      input.style.borderColor = 'var(--red)';
      setTimeout(() => input.style.borderColor = '', 1000);
    }
  },

  // ── POPULATE UI FROM SETTINGS ──
  populateUI() {
    const s = this.settings;

    // Event info
    if (s.eventName) document.getElementById('event-name').value = s.eventName;
    if (s.eventOrganizer) document.getElementById('event-organizer').value = s.eventOrganizer;
    if (s.eventDate) document.getElementById('event-date').value = s.eventDate;

    // Category toggles
    this.renderCategoryToggles();

    // Scene manager dropdown
    const catSelect = document.getElementById('active-category');
    if (catSelect) {
      catSelect.innerHTML = TEMPLATES.categories.map(c =>
        `<option value="${c.id}">${c.name}</option>`
      ).join('');
      this.renderSceneToggles();
    }

    // Mode
    this.setMode(s.mode || 'soft', false);

    // Branding
    document.getElementById('toggle-om-watermark').checked = s.omWatermark !== false;
    document.getElementById('toggle-client-logo').checked = !!s.clientLogo;
    document.getElementById('toggle-client-frame').checked = !!s.clientFrame;

    if (s.clientFrame) {
      document.getElementById('client-frame-section').style.display = 'block';
      document.getElementById('frame-preview').src = s.clientFrame;
      document.getElementById('frame-preview').style.display = 'block';
    }
    if (s.clientLogo) {
      document.getElementById('client-logo-section').style.display = 'block';
      document.getElementById('logo-preview').src = s.clientLogo;
      document.getElementById('logo-preview').style.display = 'block';
    }
    if (s.watermarkPos) this.setWatermarkPos(s.watermarkPos, false);

    // Force offline
    document.getElementById('toggle-force-offline').checked = !!s.forceOffline;
  },

  // ── SECTIONS ──
  showSection(name) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById('section-' + name)?.classList.add('active');

    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelector(`[data-section="${name}"]`)?.classList.add('active');

    // Auto-load camera list when switching to camera section
    if (name === 'camera') this.refreshCameras();
  },

  // ── CATEGORY TOGGLES (multiple) ──
  renderCategoryToggles() {
    const grid = document.getElementById('category-toggle-grid');
    if (!grid) return;

    const activeCategories = this.settings.activeCategories ||
      TEMPLATES.categories.map(c => c.id); // all active by default

    grid.innerHTML = TEMPLATES.categories.map(cat => `
      <div class="toggle-row">
        <div>
          <div class="toggle-label">${cat.icon} ${cat.name}</div>
          <div class="toggle-desc">${cat.scenes.length} scenes available</div>
        </div>
        <label class="toggle">
          <input type="checkbox" data-cat="${cat.id}"
            ${activeCategories.includes(cat.id) ? 'checked' : ''}
            onchange="Admin.updateCategoryToggle('${cat.id}', this.checked)"/>
          <span class="toggle-slider"></span>
        </label>
      </div>
    `).join('');
  },

  updateCategoryToggle(catId, enabled) {
    if (!this.settings.activeCategories) {
      this.settings.activeCategories = TEMPLATES.categories.map(c => c.id);
    }
    if (enabled) {
      if (!this.settings.activeCategories.includes(catId)) {
        this.settings.activeCategories.push(catId);
      }
    } else {
      this.settings.activeCategories = this.settings.activeCategories.filter(id => id !== catId);
    }
    this.saveSettings();
  },

  // ── SCENE TOGGLES ──
  renderSceneToggles() {
    const catId = document.getElementById('active-category').value;
    const cat = TEMPLATES.categories.find(c => c.id === catId);
    const grid = document.getElementById('scene-toggle-grid');
    if (!cat || !grid) return;

    const activeScenes = this.settings.activeScenes?.[catId] || cat.scenes.map(s => s.id);

    grid.innerHTML = cat.scenes.map(scene => `
      <div class="scene-toggle-item">
        <span class="scene-toggle-name">${scene.name}</span>
        <label class="toggle">
          <input type="checkbox" data-scene="${scene.id}"
            ${activeScenes.includes(scene.id) ? 'checked' : ''}
            onchange="Admin.updateSceneToggle('${catId}', '${scene.id}', this.checked)"/>
          <span class="toggle-slider"></span>
        </label>
      </div>
    `).join('');
  },

  updateSceneToggle(catId, sceneId, enabled) {
    if (!this.settings.activeScenes) this.settings.activeScenes = {};
    if (!this.settings.activeScenes[catId]) {
      const cat = TEMPLATES.categories.find(c => c.id === catId);
      this.settings.activeScenes[catId] = cat.scenes.map(s => s.id);
    }
    if (enabled) {
      if (!this.settings.activeScenes[catId].includes(sceneId)) {
        this.settings.activeScenes[catId].push(sceneId);
      }
    } else {
      this.settings.activeScenes[catId] = this.settings.activeScenes[catId].filter(id => id !== sceneId);
    }
  },

  // ── OUTPUT MODE ──
  setMode(mode, save = false) {
    this.settings.mode = mode;
    document.querySelectorAll('.mode-card').forEach(c => {
      c.classList.toggle('active', c.dataset.mode === mode);
    });
    if (save) this.saveSettings();
  },

  // ── BRANDING ──
  toggleClientFrame() {
    const enabled = document.getElementById('toggle-client-frame').checked;
    document.getElementById('client-frame-section').style.display = enabled ? 'block' : 'none';
    if (!enabled) {
      this.settings.clientFrame = null;
      document.getElementById('frame-preview').style.display = 'none';
      this.saveSettings();
    }
  },

  handleFrameUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.includes('png')) {
      alert('Please upload a PNG file for the frame');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      this.settings.clientFrame = dataUrl;
      const preview = document.getElementById('frame-preview');
      preview.src = dataUrl;
      preview.style.display = 'block';
      this.saveSettings();
      this.showToast('✓ Frame Uploaded');
    };
    reader.readAsDataURL(file);
  },

  removeFrame() {
    this.settings.clientFrame = null;
    document.getElementById('frame-preview').style.display = 'none';
    document.getElementById('toggle-client-frame').checked = false;
    document.getElementById('client-frame-section').style.display = 'none';
    this.saveSettings();
    this.showToast('✓ Frame Removed');
  },

  toggleClientLogo() {
    const enabled = document.getElementById('toggle-client-logo').checked;
    document.getElementById('client-logo-section').style.display = enabled ? 'block' : 'none';
    if (!enabled) {
      this.settings.clientLogo = null;
      document.getElementById('logo-preview').style.display = 'none';
    }
  },

  handleLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      this.settings.clientLogo = dataUrl;
      const preview = document.getElementById('logo-preview');
      preview.src = dataUrl;
      preview.style.display = 'block';
      this.showToast();
    };
    reader.readAsDataURL(file);
  },

  setWatermarkPos(pos, save = true) {
    this.settings.watermarkPos = pos;
    document.querySelectorAll('.position-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.pos === pos);
    });
    if (save) this.saveSettings();
  },

  // ── CAMERA ──
  async refreshCameras() {
    try {
      // Request permission first
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      stream.getTracks().forEach(t => t.stop());

      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(d => d.kind === 'videoinput');

      const select = document.getElementById('camera-select');
      select.innerHTML = cameras.map((cam, i) =>
        `<option value="${cam.deviceId}">${cam.label || 'Camera ' + (i + 1)}</option>`
      ).join('');

      if (this.settings.cameraDeviceId) {
        select.value = this.settings.cameraDeviceId;
      }
    } catch (err) {
      document.getElementById('camera-select').innerHTML =
        '<option value="">Camera permission denied</option>';
    }
  },

  async startCameraPreview() {
    this.stopCameraPreview();
    const deviceId = document.getElementById('camera-select').value;
    try {
      const constraints = deviceId
        ? { video: { deviceId: { exact: deviceId } }, audio: false }
        : { video: true, audio: false };
      this.cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
      const video = document.getElementById('admin-camera-preview');
      video.srcObject = this.cameraStream;
      this.settings.cameraDeviceId = deviceId;
      this.saveSettings();
    } catch (err) {
      alert('Could not start camera: ' + err.message);
    }
  },

  stopCameraPreview() {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(t => t.stop());
      this.cameraStream = null;
    }
    const video = document.getElementById('admin-camera-preview');
    video.srcObject = null;
  },

  switchCamera() {
    if (this.cameraStream) this.startCameraPreview();
  },

  // ── PRINTER ──
  testPrint() {
    const dot = document.getElementById('printer-status-dot');
    const text = document.getElementById('printer-status-text');

    const w = window.open('', '_blank');
    if (!w) {
      dot.style.background = 'var(--red)';
      text.textContent = 'Popup blocked — allow popups';
      return;
    }

    w.document.write(`
      <html><head><title>OM Events Test Print</title>
      <style>
        * { margin:0; padding:0; }
        body { display:flex; align-items:center; justify-content:center;
               background:#000; width:6in; height:4in; }
        .box { border:3px solid #C9A84C; width:5.5in; height:3.5in;
               display:flex; flex-direction:column;
               align-items:center; justify-content:center; color:#C9A84C; }
        h1 { font-family:Georgia; font-size:36px; font-weight:300; letter-spacing:8px; }
        p { font-family:Arial; font-size:12px; letter-spacing:3px; margin-top:8px; opacity:0.6; }
        @media print { @page { size:6in 4in; margin:0; } }
      </style></head>
      <body>
        <div class="box">
          <h1>OM EVENTS</h1>
          <p>TEST PRINT — ${new Date().toLocaleDateString()}</p>
        </div>
        <script>window.onload = () => { window.print(); setTimeout(() => window.close(), 1000); }<\/script>
      </body></html>
    `);
    w.document.close();

    dot.style.background = 'var(--green)';
    text.textContent = 'Test print sent';
  },

  // ── SYSTEM ──
  updateOnlineStatus() {
    const online = navigator.onLine;
    ['sidebar-online-dot', 'sys-online-dot'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.background = online ? 'var(--green)' : 'var(--red)';
    });
    ['sidebar-online-text', 'sys-online-text'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = online ? 'Online' : 'Offline';
    });
  },

  toggleForceOffline() {
    this.settings.forceOffline = document.getElementById('toggle-force-offline').checked;
    this.saveSettings();
  },

  clearCache() {
    if (confirm('Clear all cached data? The page will reload.')) {
      if ('caches' in window) {
        caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
      }
      localStorage.removeItem('om-kiosk-settings');
      setTimeout(() => location.reload(), 500);
    }
  },

  async testWorker() {
    const result = document.getElementById('worker-test-result');
    result.textContent = 'Testing connection...';
    result.style.color = 'var(--white-dim)';
    try {
      const res = await fetch('https://om-events-proxy.betsanambrose.workers.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 'ping' })
      });
      const data = await res.json();
      // Worker returns "Unknown step" for ping — that means it's alive
      if (data.error && data.error.includes('Unknown step')) {
        result.textContent = '✓ Worker is connected and responding';
        result.style.color = 'var(--green)';
      } else if (data.error && data.error.includes('API key not configured')) {
        result.textContent = '⚠ Worker alive but FAL_KEY missing';
        result.style.color = 'var(--gold)';
      } else {
        result.textContent = '✓ Worker responding: ' + JSON.stringify(data).substring(0, 60);
        result.style.color = 'var(--green)';
      }
    } catch (err) {
      result.textContent = '✗ Worker unreachable: ' + err.message;
      result.style.color = 'var(--red)';
    }
  },

  // ── PASSWORD ──
  changePassword() {
    const current = document.getElementById('current-password').value;
    const newPwd = document.getElementById('new-password').value;
    const confirm = document.getElementById('confirm-password').value;
    const msg = document.getElementById('password-message');
    const stored = localStorage.getItem('om-admin-password') || this.DEFAULT_PASSWORD;

    if (current !== stored) {
      msg.textContent = 'Current password is incorrect';
      msg.style.color = 'var(--red)';
      return;
    }
    if (newPwd.length < 6) {
      msg.textContent = 'New password must be at least 6 characters';
      msg.style.color = 'var(--red)';
      return;
    }
    if (newPwd !== confirm) {
      msg.textContent = 'Passwords do not match';
      msg.style.color = 'var(--red)';
      return;
    }

    localStorage.setItem('om-admin-password', newPwd);
    msg.textContent = '✓ Password updated successfully';
    msg.style.color = 'var(--green)';
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
  },

  // ── SAVE / LOAD ──
  saveSettings() {
    // Read current UI values
    this.settings.eventName = document.getElementById('event-name')?.value || '';
    this.settings.eventOrganizer = document.getElementById('event-organizer')?.value || '';
    this.settings.eventDate = document.getElementById('event-date')?.value || '';
    this.settings.omWatermark = document.getElementById('toggle-om-watermark')?.checked !== false;
    this.settings.forceOffline = document.getElementById('toggle-force-offline')?.checked || false;

    // activeCategories is saved directly via updateCategoryToggle
    // activeScenes is saved directly via updateSceneToggle

    // Save to localStorage
    localStorage.setItem('om-kiosk-settings', JSON.stringify(this.settings));
    this.showToast();
  },

  loadSettings() {
    try {
      const saved = localStorage.getItem('om-kiosk-settings');
      this.settings = saved ? JSON.parse(saved) : {};
    } catch (e) {
      this.settings = {};
    }
  },

  resetDefaults() {
    if (confirm('Reset all settings to default?')) {
      this.settings = {};
      localStorage.removeItem('om-kiosk-settings');
      this.populateUI();
      this.showToast();
    }
  },

  // ── TOAST ──
  showToast(msg = '✓ Settings Saved') {
    const toast = document.getElementById('save-toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  },

  // ── EXIT ──
  exitToKiosk() {
    this.stopCameraPreview();
    window.location.href = '../index.html';
  }
};

document.addEventListener('DOMContentLoaded', () => Admin.init());
