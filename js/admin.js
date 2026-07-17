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
    if (typeof Tracker !== 'undefined') Tracker.init();
    setTimeout(() => document.getElementById('password-input')?.focus(), 100);
  },

  resetPassword() {
    const masterKey = prompt('Enter master recovery code:');
    if (masterKey === 'OMEVENTS2024RESET') {
      localStorage.removeItem('om-admin-password');
      alert('Password reset to default: omevents2024');
      document.getElementById('login-error').textContent = '';
      document.getElementById('password-input').value = '';
      document.getElementById('password-input').focus();
    } else if (masterKey !== null) {
      alert('Incorrect recovery code');
    }
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
      this.showSection('event'); // ensure first section is always visible
      error.textContent = '';
    } else {
      error.textContent = 'Incorrect password';
      input.value = '';
      input.focus();
      input.style.borderColor = 'var(--red)';
      setTimeout(() => input.style.borderColor = '', 1000);
    }
  },

  // ── POPULATE UI FROM SETTINGS ──
  populateUI() {
    const s = this.settings;

    // AI provider selector
    this.refreshProviderUI();

    // Event info
    if (s.eventName) document.getElementById('event-name').value = s.eventName;
    if (s.eventOrganizer) document.getElementById('event-organizer').value = s.eventOrganizer;
    if (s.eventDate) document.getElementById('event-date').value = s.eventDate;

    // Category toggles
    this.renderCategoryToggles();

    // Scene manager dropdown
    const catSelect = document.getElementById('active-category');
    if (catSelect) {
      catSelect.innerHTML = TEMPLATES.categories.filter(c => c && c.id).map(c =>
        `<option value="${c.id}">${c.name}</option>`
      ).join('');
      this.renderSceneToggles();
    }

    // Mode
    this.setMode(s.mode || 'soft', false);

    // Branding
    document.getElementById('toggle-om-watermark').checked = s.omWatermark === true;
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

    // Print settings
    if (s.printPaperSize) {
      const el = document.getElementById('print-paper-size');
      if (el) el.value = s.printPaperSize;
    }
    if (s.printOrientation) {
      const el = document.getElementById('print-orientation');
      if (el) el.value = s.printOrientation;
    }
    if (s.printColor) {
      const el = document.getElementById('print-color');
      if (el) el.value = s.printColor;
    }
    const borderlessEl = document.getElementById('print-borderless');
    if (borderlessEl) borderlessEl.checked = s.printBorderless !== false;
    const brightnessEl = document.getElementById('print-brightness');
    if (brightnessEl) {
      const bv = (s.printBrightness != null ? s.printBrightness : 7);
      brightnessEl.value = bv;
      const lbl = document.getElementById('print-brightness-val');
      if (lbl) lbl.textContent = bv;
    }

    // Update event control UI
    this.updateEventControlUI();
  },

  // ── SECTIONS ──
  // ── CATEGORY TOGGLES (multiple) ──
  renderCategoryToggles() {
    const grid = document.getElementById('category-toggle-grid');
    if (!grid) return;

    const activeCategories = this.settings.activeCategories ||
      TEMPLATES.categories.map(c => c.id); // all active by default

    grid.innerHTML = TEMPLATES.categories.filter(cat => cat && cat.id).map(cat => `
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

  // ── EVENT CONTROL ──

  updateEventControlUI() {
    if (typeof Tracker === 'undefined') return;
    const active = Tracker.getActiveEvent();
    const dot = document.getElementById('event-active-dot');
    const label = document.getElementById('event-active-label');
    const count = document.getElementById('event-active-count');
    const btnStart = document.getElementById('btn-start-event');
    const btnClose = document.getElementById('btn-close-event');

    if (active) {
      const stats = Tracker.getStats();
      if (dot) dot.style.background = 'var(--green)';
      if (label) label.textContent = active.name;
      if (count) count.textContent = stats.total + ' photos';
      if (btnStart) btnStart.style.display = 'none';
      if (btnClose) btnClose.style.display = 'inline-flex';
    } else {
      if (dot) dot.style.background = 'var(--white-dim)';
      if (label) label.textContent = 'No active event';
      if (count) count.textContent = '';
      if (btnStart) btnStart.style.display = 'inline-flex';
      if (btnClose) btnClose.style.display = 'none';
    }
  },

  startEvent() {
    if (typeof Tracker === 'undefined') return;
    if (Tracker.isEventActive()) {
      if (!confirm('An event is already active. Start a new one? The current event will be closed.')) return;
      Tracker.closeEvent();
    }
    const name = document.getElementById('event-name')?.value || 'Event';
    const organizer = document.getElementById('event-organizer')?.value || '';
    const date = document.getElementById('event-date')?.value || '';
    Tracker.startEvent(name, organizer, date);
    this.updateEventControlUI();
    this.showToast('✓ Event Started');
  },

  closeEvent() {
    if (typeof Tracker === 'undefined') return;
    const active = Tracker.getActiveEvent();
    if (!active) return;
    const stats = Tracker.getStats();
    if (!confirm(`Close "${active.name}"?\n${stats.total} photos taken, ${stats.printSuccess} printed.`)) return;
    Tracker.closeEvent();
    this.updateEventControlUI();
    this.showToast('✓ Event Closed');
  },

  // ── REPORTS ──

  showSection(name) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById('section-' + name)?.classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelector(`[data-section="${name}"]`)?.classList.add('active');
    if (name === 'camera') this.refreshCameras();
    if (name === 'reports') this.renderReports();
    if (name === 'event') this.updateEventControlUI();
  },

  renderReports() {
    if (typeof Tracker === 'undefined') return;

    // Active event summary
    const activeEl = document.getElementById('active-event-summary');
    const active = Tracker.getActiveEvent();
    if (active && activeEl) {
      const stats = Tracker.getStats();
      activeEl.innerHTML = `
        <div class="status-row">
          <div class="status-dot" style="background:var(--green)"></div>
          <span class="status-label">${active.name}</span>
          <span class="status-value" style="color:var(--gold)">${stats.total} photos</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:16px 0;">
          <div style="text-align:center;padding:12px;background:var(--black-soft);border:1px solid var(--black-border);border-radius:2px;">
            <div style="font-size:28px;font-family:'Cormorant Garamond',serif;color:var(--white)">${stats.total}</div>
            <div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--white-dim);margin-top:4px">Photos Taken</div>
          </div>
          <div style="text-align:center;padding:12px;background:var(--black-soft);border:1px solid var(--black-border);border-radius:2px;">
            <div style="font-size:28px;font-family:'Cormorant Garamond',serif;color:var(--gold)">${stats.printSuccess}</div>
            <div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--white-dim);margin-top:4px">Prints Success</div>
          </div>
          <div style="text-align:center;padding:12px;background:var(--black-soft);border:1px solid var(--black-border);border-radius:2px;">
            <div style="font-size:28px;font-family:'Cormorant Garamond',serif;color:var(--red)">${stats.printFailed}</div>
            <div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--white-dim);margin-top:4px">Prints Failed</div>
          </div>
        </div>
        <div class="btn-row">
          <button class="btn btn-gold" onclick="Tracker.exportToExcel()">⬇ Export CSV</button>
          <button class="btn btn-outline" onclick="Admin.showEventPhotos('active')">🖼 View Photos</button>
          <button class="btn btn-outline" onclick="Admin.downloadPhotosZip('active')">⬇ Download ZIP</button>
        </div>
        <div id="photo-links-container" style="margin-top:16px;"></div>
      `;
    } else if (activeEl) {
      activeEl.innerHTML = '<p style="font-size:11px;color:var(--white-dim);letter-spacing:1px;">No active event. Start an event from Event Setup.</p>';
    }

    // All events table
    const tableEl = document.getElementById('events-table-container');
    const events = Tracker.getAllEvents();
    if (!tableEl) return;

    if (!events.length) {
      tableEl.innerHTML = '<p style="font-size:11px;color:var(--white-dim);letter-spacing:1px;">No events recorded yet.</p>';
      return;
    }

    // Sort newest first
    const sorted = [...events].sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));

    tableEl.innerHTML = `
      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-size:11px;">
          <thead>
            <tr style="border-bottom:1px solid var(--black-border);">
              <th style="text-align:left;padding:10px 8px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);font-weight:500;">Event</th>
              <th style="text-align:left;padding:10px 8px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);font-weight:500;">Date</th>
              <th style="text-align:center;padding:10px 8px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);font-weight:500;">Photos</th>
              <th style="text-align:center;padding:10px 8px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);font-weight:500;">Prints ✓</th>
              <th style="text-align:center;padding:10px 8px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);font-weight:500;">Prints ✗</th>
              <th style="text-align:center;padding:10px 8px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);font-weight:500;">Status</th>
              <th style="text-align:center;padding:10px 8px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);font-weight:500;">Export</th>
            </tr>
          </thead>
          <tbody>
            ${sorted.map(evt => {
              const stats = Tracker.getStats(evt);
              const isActive = !evt.closedAt;
              return `<tr style="border-bottom:1px solid var(--black-border);">
                <td style="padding:10px 8px;color:var(--white)">${evt.name}</td>
                <td style="padding:10px 8px;color:var(--white-dim)">${evt.date}</td>
                <td style="padding:10px 8px;text-align:center;color:var(--white)">${stats.total}</td>
                <td style="padding:10px 8px;text-align:center;color:var(--green)">${stats.printSuccess}</td>
                <td style="padding:10px 8px;text-align:center;color:${stats.printFailed > 0 ? 'var(--red)' : 'var(--white-dim)'}">${stats.printFailed}</td>
                <td style="padding:10px 8px;text-align:center;">
                  <span style="font-size:9px;letter-spacing:2px;text-transform:uppercase;padding:3px 8px;border-radius:2px;background:${isActive ? 'rgba(76,175,80,0.15)' : 'rgba(255,255,255,0.06)'};color:${isActive ? 'var(--green)' : 'var(--white-dim)'};">
                    ${isActive ? 'Active' : 'Closed'}
                  </span>
                </td>
                <td style="padding:10px 8px;text-align:center;">
                  <button onclick="Tracker.exportToExcel('${evt.id}')" style="padding:5px 12px;background:transparent;border:1px solid var(--gold-dim);color:var(--gold);font-size:9px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;border-radius:2px;margin-right:4px;">CSV</button>
                  <button onclick="Admin.showEventPhotos('${evt.id}')" style="padding:5px 12px;background:transparent;border:1px solid var(--black-border);color:var(--white-dim);font-size:9px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;border-radius:2px;margin-right:4px;">Photos</button>
                  <button onclick="Admin.downloadPhotosZip('${evt.id}')" style="padding:5px 12px;background:transparent;border:1px solid var(--black-border);color:var(--white-dim);font-size:9px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;border-radius:2px;">ZIP</button>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // ── AI PROVIDER SELECTOR ──

  setProvider(provider) {
    // 'gemini' (Nano Banana 2) or 'openai' (GPT Image 2)
    this.settings.aiProvider = provider;
    Settings.save(this.settings);
    this.refreshProviderUI();
    this.showToast(provider === 'gemini' ? 'Switched to Nano Banana 2' : 'Switched to GPT Image 2');
  },

  refreshProviderUI() {
    const provider = this.settings.aiProvider || 'gemini';
    const gCard = document.getElementById('provider-gemini');
    const oCard = document.getElementById('provider-openai');
    const label = document.getElementById('sys-provider-text');
    if (gCard) gCard.classList.toggle('active', provider === 'gemini');
    if (oCard) oCard.classList.toggle('active', provider === 'openai');
    if (label) label.textContent = provider === 'gemini' ? 'Nano Banana 2' : 'GPT Image 2';
  },

  // ── PHOTO STORAGE — R2 ──

  WORKER_URL: 'https://om-events-proxy.betsanambrose.workers.dev',

  async _callWorker(payload) {
    const res = await fetch(this.WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async showEventPhotos(eventId) {
    const container = document.getElementById('photo-links-container');
    if (!container) return;

    const resolvedId = eventId === 'active'
      ? (typeof Tracker !== 'undefined' ? Tracker.getActiveEvent()?.id : null)
      : eventId;

    if (!resolvedId) {
      container.innerHTML = '<p style="font-size:11px;color:var(--red);letter-spacing:1px;">No active event found.</p>';
      return;
    }

    container.innerHTML = '<p style="font-size:11px;color:var(--gold);letter-spacing:2px;text-transform:uppercase;">Loading photos...</p>';

    try {
      const data = await this._callWorker({ step: 'list_event_photos', eventId: resolvedId });

      if (!data.photos || data.photos.length === 0) {
        container.innerHTML = '<p style="font-size:11px;color:var(--white-dim);letter-spacing:1px;">No photos stored yet for this event.</p>';
        return;
      }

      const rows = data.photos.map((p, i) => `
        <tr style="border-bottom:1px solid var(--black-border);">
          <td style="padding:8px;color:var(--white-dim);font-size:11px;">${i + 1}</td>
          <td style="padding:8px;">
            <img src="${p.url}" style="width:80px;height:45px;object-fit:cover;border-radius:2px;border:1px solid var(--black-border);" loading="lazy"/>
          </td>
          <td style="padding:8px;color:var(--white);font-size:11px;">${p.sceneName || '\u2014'}</td>
          <td style="padding:8px;color:var(--white-dim);font-size:11px;">${p.categoryName || '\u2014'}</td>
          <td style="padding:8px;color:var(--white-dim);font-size:10px;">${p.createdAt ? new Date(p.createdAt).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}) : '\u2014'}</td>
          <td style="padding:8px;">
            <a href="${p.url}" target="_blank" download
               style="padding:4px 10px;background:transparent;border:1px solid var(--gold-dim);color:var(--gold);font-size:9px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;border-radius:2px;text-decoration:none;">
              \u2b07
            </a>
          </td>
        </tr>
      `).join('');

      container.innerHTML = `
        <div style="margin-top:8px;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
            <span style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:var(--gold);">
              ${data.count} Photos Stored
            </span>
            <button onclick="Admin.downloadPhotosZip('${resolvedId}')"
              style="padding:6px 14px;background:var(--gold);color:var(--black);font-size:9px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;border-radius:2px;border:none;font-weight:600;">
              \u2b07 Download All as ZIP
            </button>
          </div>
          <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr style="border-bottom:1px solid var(--black-border);">
                  <th style="text-align:left;padding:8px;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);font-weight:500;">#</th>
                  <th style="text-align:left;padding:8px;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);font-weight:500;">Preview</th>
                  <th style="text-align:left;padding:8px;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);font-weight:500;">Scene</th>
                  <th style="text-align:left;padding:8px;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);font-weight:500;">Category</th>
                  <th style="text-align:left;padding:8px;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);font-weight:500;">Time</th>
                  <th style="text-align:left;padding:8px;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);font-weight:500;">Save</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>
      `;
    } catch (err) {
      container.innerHTML = `<p style="font-size:11px;color:var(--red);letter-spacing:1px;">Error loading photos: ${err.message}</p>`;
    }
  },

  async downloadPhotosZip(eventId) {
    const resolvedId = eventId === 'active'
      ? (typeof Tracker !== 'undefined' ? Tracker.getActiveEvent()?.id : null)
      : eventId;

    if (!resolvedId) { alert('No event found'); return; }

    if (typeof JSZip === 'undefined') {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }

    const statusEl = document.getElementById('photo-links-container');
    const showStatus = (msg) => {
      if (statusEl) statusEl.innerHTML = `<p style="font-size:11px;color:var(--gold);letter-spacing:2px;text-transform:uppercase;">${msg}</p>`;
    };

    try {
      showStatus('Preparing ZIP...');

      const zip = new JSZip();
      const folder = zip.folder('game-on-photos');

      // Fetch images from the worker as base64 (server-side R2 read = no CORS issues).
      // The old method fetched R2 URLs directly from the browser, which failed on
      // CORS and produced an empty ZIP. Paginated to handle large events.
      let cursor = null;
      let total = 0;
      let safety = 0;
      do {
        const batch = await this._callWorker({ step: 'get_zip_batch', eventId: resolvedId, startAfter: cursor });
        if (batch.error) throw new Error(batch.error);
        if (batch.images && batch.images.length) {
          batch.images.forEach((img, idx) => {
            const bin = atob(img.b64);
            const bytes = new Uint8Array(bin.length);
            for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
            const name = `photo_${String(total + idx + 1).padStart(3, '0')}.jpg`;
            folder.file(name, bytes);
          });
          total += batch.images.length;
          showStatus(`Downloading... ${total} photos`);
        }
        cursor = batch.nextCursor;
        safety++;
      } while (cursor && safety < 100);

      if (total === 0) {
        showStatus('No photos found for this event.');
        return;
      }

      showStatus('Creating ZIP file...');
      const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'STORE' });

      const events = typeof Tracker !== 'undefined' ? Tracker.getAllEvents() : [];
      const evt = events.find(e => e.id === resolvedId);
      const evtName = (evt?.name || 'event').replace(/\s+/g, '-');
      const evtDate = evt?.date || new Date().toISOString().split('T')[0];
      const filename = `game-on-${evtName}-${evtDate}-photos.zip`;

      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10000);

      showStatus(`\u2713 ZIP downloaded \u2014 ${data.count} photos`);
      setTimeout(() => { if (statusEl) statusEl.innerHTML = ''; }, 4000);

    } catch (err) {
      showStatus(`Error: ${err.message}`);
    }
  },

  // ── CAMERA (override to fix section switching) ──
  async refreshCameras() {
    const select = document.getElementById('camera-select');
    const statusEl = document.getElementById('camera-switch-status');
    if (!select) return;

    try {
      // Must open a stream first — this triggers permission AND populates device labels
      // Use environment (back) camera on mobile as default for better kiosk results
      let initialStream;
      try {
        initialStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } }, audio: false
        });
      } catch (e) {
        initialStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }
      initialStream.getTracks().forEach(t => t.stop());

      // Now enumerate — labels will be populated after permission granted
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(d => d.kind === 'videoinput');

      if (!cameras.length) {
        select.innerHTML = '<option value="">No cameras found</option>';
        return;
      }

      // Build options with meaningful labels
      select.innerHTML = cameras.map((cam, i) => {
        let label = cam.label || `Camera ${i + 1}`;
        // Add facing hint for mobile cameras
        if (!cam.label) {
          if (i === 0) label = 'Front Camera';
          else if (i === 1) label = 'Back Camera';
          else label = `Camera ${i + 1}`;
        }
        // Detect facing from label
        const lowerLabel = label.toLowerCase();
        if (lowerLabel.includes('front') || lowerLabel.includes('user')) label = '📱 ' + label;
        else if (lowerLabel.includes('back') || lowerLabel.includes('rear') || lowerLabel.includes('environment')) label = '📷 ' + label;
        else if (lowerLabel.includes('usb') || lowerLabel.includes('external')) label = '🎥 ' + label;
        return `<option value="${cam.deviceId}">${label}</option>`;
      }).join('');

      // Restore saved camera or default to back camera (index 1 on Android)
      if (this.settings.cameraDeviceId) {
        const saved = cameras.find(c => c.deviceId === this.settings.cameraDeviceId);
        if (saved) select.value = this.settings.cameraDeviceId;
      } else if (cameras.length > 1) {
        // Default to second camera (usually back camera on Android)
        select.value = cameras[1].deviceId;
      }

      if (statusEl) statusEl.textContent = `${cameras.length} camera${cameras.length > 1 ? 's' : ''} found`;
    } catch (err) {
      select.innerHTML = '<option value="">Camera permission denied</option>';
      if (statusEl) statusEl.textContent = 'Permission denied';
      console.error('Camera refresh error:', err);
    }
  },

  async startCameraPreview() {
    this.stopCameraPreview();
    const select = document.getElementById('camera-select');
    const deviceId = select?.value;
    const statusEl = document.getElementById('camera-switch-status');

    if (!deviceId) {
      if (statusEl) statusEl.textContent = 'No camera selected';
      return;
    }

    try {
      if (statusEl) statusEl.textContent = 'Starting camera...';

      // Always use exact deviceId — this is the key fix for switching cameras
      const constraints = {
        video: {
          deviceId: { exact: deviceId },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      this.cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
      const video = document.getElementById('admin-camera-preview');
      video.srcObject = this.cameraStream;
      video.setAttribute('playsinline', 'true');
      video.muted = true;
      await video.play().catch(() => {});

      // Detect if front-facing and apply mirror accordingly
      const track = this.cameraStream.getVideoTracks()[0];
      const settings = track?.getSettings?.() || {};
      const label = (track?.label || '').toLowerCase();
      const isFront = settings.facingMode === 'user' ||
                      label.includes('front') || label.includes('user');
      video.style.transform = isFront ? 'scaleX(-1)' : 'scaleX(1)';

      // Save selected camera
      this.settings.cameraDeviceId = deviceId;
      this.saveSettings();

      const res = settings.width ? `${settings.width}×${settings.height}` : '';
      if (statusEl) statusEl.textContent = `✓ Active${res ? ' — ' + res : ''}`;
    } catch (err) {
      console.error('Camera start error:', err.name, err.message);
      if (statusEl) statusEl.textContent = '✗ ' + (err.name === 'OverconstrainedError'
        ? 'Camera busy or unavailable'
        : err.message);
    }
  },

  stopCameraPreview() {
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(t => t.stop());
      this.cameraStream = null;
    }
    const video = document.getElementById('admin-camera-preview');
    if (video) video.srcObject = null;
  },

  switchCamera() {
    this.startCameraPreview();
  },

  // ── PRINTER ──
  testPrint() {
    const dot = document.getElementById('printer-status-dot');
    const text = document.getElementById('printer-status-text');

    // Silent print via hidden iframe (same method as the kiosk result screen).
    // With Chrome --kiosk-printing, this prints with no dialog.
    const existing = document.getElementById('admin-print-frame');
    if (existing) existing.remove();

    const iframe = document.createElement('iframe');
    iframe.id = 'admin-print-frame';
    iframe.style.cssText = 'position:fixed; right:0; bottom:0; width:0; height:0; border:0; opacity:0; pointer-events:none;';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <html><head><title>GAME ON Test Print</title>
      <style>
        * { margin:0; padding:0; }
        body { display:flex; align-items:center; justify-content:center;
               background:#000; width:6in; height:4in; }
        .box { border:3px solid #F6020C; width:5.5in; height:3.5in;
               display:flex; flex-direction:column;
               align-items:center; justify-content:center; color:#F6020C; }
        h1 { font-family:Georgia; font-size:36px; font-weight:300; letter-spacing:8px; }
        p { font-family:Arial; font-size:12px; letter-spacing:3px; margin-top:8px; opacity:0.6; }
        @media print { @page { size:6in 4in landscape; margin:0; } }
      </style></head>
      <body>
        <div class="box">
          <h1>GAME ON</h1>
          <p>TEST PRINT</p>
        </div>
      </body></html>
    `);
    doc.close();

    setTimeout(() => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        if (dot) dot.style.background = 'var(--green)';
        if (text) text.textContent = 'Test print sent';
      } catch (e) {
        if (dot) dot.style.background = 'var(--red)';
        if (text) text.textContent = 'Print failed: ' + e.message;
      }
      setTimeout(() => iframe.remove(), 2000);
    }, 400);
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
        result.textContent = '⚠ Worker alive but OPENAI_KEY missing';
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
    this.settings.eventName = document.getElementById('event-name')?.value || '';
    this.settings.eventOrganizer = document.getElementById('event-organizer')?.value || '';
    this.settings.eventDate = document.getElementById('event-date')?.value || '';
    this.settings.omWatermark = document.getElementById('toggle-om-watermark')?.checked === true;
    this.settings.forceOffline = document.getElementById('toggle-force-offline')?.checked || false;

    // Print settings
    this.settings.printPaperSize = document.getElementById('print-paper-size')?.value || '4x6';
    this.settings.printOrientation = document.getElementById('print-orientation')?.value || 'portrait';
    this.settings.printColor = document.getElementById('print-color')?.value || 'color';
    this.settings.printBorderless = document.getElementById('print-borderless')?.checked !== false;
    const pb = document.getElementById('print-brightness');
    if (pb) this.settings.printBrightness = parseInt(pb.value, 10);

    // Ensure all valid categories are included if none saved
    if (!this.settings.activeCategories || this.settings.activeCategories.length === 0) {
      this.settings.activeCategories = TEMPLATES.categories.map(c => c.id);
    }

    if (typeof Settings !== 'undefined') {
      Settings.save(this.settings);
    } else {
      localStorage.setItem('om-kiosk-settings', JSON.stringify(this.settings));
    }
    this.showToast();
  },

  loadSettings() {
    try {
      // Use Settings.load() which handles template version reset automatically
      if (typeof Settings !== 'undefined') {
        this.settings = Settings.load();
      } else {
        const saved = localStorage.getItem('om-kiosk-settings');
        this.settings = saved ? JSON.parse(saved) : {};
      }
      // Always ensure all current categories are in activeCategories
      const validIds = TEMPLATES.categories.map(c => c.id);
      if (!this.settings.activeCategories || this.settings.activeCategories.length < validIds.length) {
        this.settings.activeCategories = validIds;
      }
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
  },

  exitKiosk() {
    // Best-effort close of the whole browser/kiosk.
    // window.close() only works reliably on script-opened windows; a tab
    // launched from a shortcut usually can't be closed by script. So we try
    // several methods, then show a clear fallback instruction if none work.
    this.stopCameraPreview();

    const confirmClose = confirm('Close the kiosk and exit? This ends the session.');
    if (!confirmClose) return;

    // Try 1: standard close
    try { window.close(); } catch (e) {}

    // Try 2: close a self-referenced window (works in some launch modes)
    try { window.open('', '_self'); window.close(); } catch (e) {}

    // Try 3: navigate to about:blank as a last visual reset
    // If the window is still here after a moment, show manual instructions.
    setTimeout(() => {
      document.body.innerHTML = `
        <div style="position:fixed;inset:0;background:#080808;color:#fff;
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          font-family:Montserrat,sans-serif;text-align:center;padding:40px;z-index:99999;">
          <img src="../assets/logo.png" alt="GAME ON" style="height:90px;margin-bottom:24px;"/>
          <div style="font-size:22px;letter-spacing:2px;margin-bottom:20px;color:#F6020C;font-weight:600;">
            KIOSK SESSION ENDED
          </div>
          <div style="font-size:13px;letter-spacing:0.5px;color:rgba(255,255,255,0.75);line-height:2.2;max-width:460px;">
            To fully shut down the kiosk, use one of these:<br/><br/>
            <b style="color:#fff;">Press the device power button</b> — to sleep or shut down<br/>
            <b style="color:#fff;">or connect a keyboard</b> and press <b style="color:#fff;">Alt + F4</b>
          </div>
          <button onclick="window.location.href='../index.html'"
            style="margin-top:36px;padding:14px 32px;background:transparent;
            border:1px solid rgba(255,255,255,0.3);color:#fff;border-radius:40px;
            font-size:11px;letter-spacing:3px;text-transform:uppercase;cursor:pointer;">
            ← Return to Kiosk
          </button>
        </div>`;
    }, 300);
  }
};

document.addEventListener('DOMContentLoaded', () => Admin.init());
