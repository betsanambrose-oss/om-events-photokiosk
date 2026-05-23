// js/tracker.js — Event Usage Tracker
// Stores per-photo records in localStorage
// Auto-closes active event at midnight

const Tracker = {
  EVENTS_KEY: 'om_events_log',
  ACTIVE_KEY: 'om_active_event',

  // ── Event Management ──

  startEvent(eventName, organizer, date) {
    const event = {
      id: 'evt_' + Date.now(),
      name: eventName || 'Unnamed Event',
      organizer: organizer || '',
      date: date || new Date().toISOString().split('T')[0],
      startedAt: new Date().toISOString(),
      closedAt: null,
      photos: []
    };
    localStorage.setItem(this.ACTIVE_KEY, JSON.stringify(event));
    this._saveEvent(event);
    this._scheduleMidnightClose();
    console.log('Event started:', event.name);
    return event;
  },

  closeEvent() {
    const event = this.getActiveEvent();
    if (!event) return null;
    event.closedAt = new Date().toISOString();
    this._saveEvent(event);
    localStorage.removeItem(this.ACTIVE_KEY);
    if (this._midnightTimer) { clearTimeout(this._midnightTimer); this._midnightTimer = null; }
    console.log('Event closed:', event.name, '| Photos:', event.photos.length);
    return event;
  },

  getActiveEvent() {
    try {
      const raw = localStorage.getItem(this.ACTIVE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  },

  isEventActive() {
    return !!this.getActiveEvent();
  },

  // ── Photo Recording ──

  recordPhoto(scene, category, imageUrl) {
    const event = this.getActiveEvent();
    if (!event) return null;

    const photo = {
      id: 'ph_' + Date.now(),
      timestamp: new Date().toISOString(),
      scene: scene?.name || '',
      category: category?.name || scene?.categoryName || '',
      imageUrl: imageUrl || '',
      printStatus: 'not_printed' // not_printed | sent | success | failed
    };

    event.photos.push(photo);
    this._saveActiveEvent(event);
    this._saveEvent(event);
    console.log('Photo recorded:', photo.scene, '| Total:', event.photos.length);
    return photo;
  },

  updatePrintStatus(photoId, status) {
    // status: 'sent' | 'success' | 'failed'
    const event = this.getActiveEvent();
    if (!event) return;
    const photo = event.photos.find(p => p.id === photoId);
    if (photo) {
      photo.printStatus = status;
      this._saveActiveEvent(event);
      this._saveEvent(event);
    }
  },

  getLastPhotoId() {
    const event = this.getActiveEvent();
    if (!event || !event.photos.length) return null;
    return event.photos[event.photos.length - 1].id;
  },

  // ── Stats ──

  getStats(event) {
    const e = event || this.getActiveEvent();
    if (!e) return { total: 0, printed: 0, printSuccess: 0, printFailed: 0 };
    const photos = e.photos || [];
    return {
      total: photos.length,
      printed: photos.filter(p => p.printStatus !== 'not_printed').length,
      printSuccess: photos.filter(p => p.printStatus === 'success').length,
      printFailed: photos.filter(p => p.printStatus === 'failed').length
    };
  },

  // ── All Events ──

  getAllEvents() {
    try {
      const raw = localStorage.getItem(this.EVENTS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  },

  // ── Excel Export ──

  exportToExcel(eventId) {
    const events = this.getAllEvents();
    let event = eventId ? events.find(e => e.id === eventId) : this.getActiveEvent();
    if (!event) { alert('No event data found'); return; }

    // Build CSV data (will be downloaded as CSV, openable in Excel)
    const rows = [
      ['Event Name', 'Date', 'Timestamp', 'Photos Taken', 'Prints Sent', 'Prints Successful', 'Print Failed', 'Category', 'Scene', 'Print Status', 'URL']
    ];

    const stats = this.getStats(event);

    (event.photos || []).forEach((photo, idx) => {
      rows.push([
        event.name,
        event.date,
        this._formatTimestamp(photo.timestamp),
        idx + 1,
        photo.printStatus !== 'not_printed' ? 'Yes' : 'No',
        photo.printStatus === 'success' ? 'Yes' : 'No',
        photo.printStatus === 'failed' ? 'Yes' : 'No',
        photo.category,
        photo.scene,
        photo.printStatus,
        photo.imageUrl
      ]);
    });

    // Summary row
    rows.push([]);
    rows.push(['SUMMARY', '', '', stats.total, stats.printed, stats.printSuccess, stats.printFailed, '', '', '', '']);

    // Convert to CSV
    const csv = rows.map(row =>
      row.map(cell => {
        const str = String(cell ?? '');
        // Escape quotes and wrap in quotes if contains comma/quote/newline
        return str.includes(',') || str.includes('"') || str.includes('\n')
          ? '"' + str.replace(/"/g, '""') + '"'
          : str;
      }).join(',')
    ).join('\n');

    // Download
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `om-events-${event.name.replace(/\s+/g, '-')}-${event.date}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    console.log('Exported:', event.name, '| Rows:', rows.length);
  },

  // ── Midnight Auto-Close ──

  _midnightTimer: null,

  _scheduleMidnightClose() {
    if (this._midnightTimer) clearTimeout(this._midnightTimer);
    const now = new Date();
    const midnight = new Date(now);
    midnight.setDate(midnight.getDate() + 1);
    midnight.setHours(0, 0, 0, 0);
    const msUntilMidnight = midnight - now;
    console.log('Auto-close scheduled in', Math.round(msUntilMidnight / 60000), 'minutes');
    this._midnightTimer = setTimeout(() => {
      console.log('Auto-closing event at midnight');
      this.closeEvent();
    }, msUntilMidnight);
  },

  init() {
    // On app load — reschedule midnight close if event is active
    if (this.getActiveEvent()) {
      this._scheduleMidnightClose();
      console.log('Active event restored:', this.getActiveEvent()?.name);
    }
  },

  // ── Helpers ──

  _saveActiveEvent(event) {
    localStorage.setItem(this.ACTIVE_KEY, JSON.stringify(event));
  },

  _saveEvent(event) {
    const events = this.getAllEvents();
    const idx = events.findIndex(e => e.id === event.id);
    if (idx >= 0) events[idx] = event;
    else events.push(event);
    localStorage.setItem(this.EVENTS_KEY, JSON.stringify(events));
  },

  _formatTimestamp(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-IN') + ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch (e) { return iso; }
  }
};
