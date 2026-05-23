// js/network.js — Network quality detection and 2G optimization

const Network = {
  quality: 'unknown', // 'fast' | 'slow' | '2g' | 'offline'
  speedKbps: null,

  // Detect network quality using Connection API + speed test
  async detect() {
    if (!navigator.onLine) {
      this.quality = 'offline';
      return this.quality;
    }

    // Use Network Information API if available (Android Chrome)
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn) {
      const type = conn.effectiveType; // '2g' | '3g' | '4g' | 'slow-2g'
      const downlink = conn.downlink;  // Mbps estimate

      console.log('Network API:', type, downlink + 'Mbps');

      if (type === 'slow-2g' || type === '2g' || downlink < 0.15) {
        this.quality = '2g';
        this.speedKbps = Math.round((downlink || 0.05) * 1000);
      } else if (type === '3g' || downlink < 1.5) {
        this.quality = 'slow';
        this.speedKbps = Math.round((downlink || 0.5) * 1000);
      } else {
        this.quality = 'fast';
        this.speedKbps = Math.round((downlink || 5) * 1000);
      }
      return this.quality;
    }

    // Fallback: quick ping test to measure response time
    try {
      const start = Date.now();
      await fetch('https://om-events-proxy.betsanambrose.workers.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 'ping' }),
        signal: AbortSignal.timeout(5000)
      }).catch(() => {});
      const ms = Date.now() - start;

      if (ms > 3000) { this.quality = '2g'; this.speedKbps = 50; }
      else if (ms > 1000) { this.quality = 'slow'; this.speedKbps = 200; }
      else { this.quality = 'fast'; this.speedKbps = 2000; }
    } catch (e) {
      this.quality = 'slow';
    }

    console.log('Network quality:', this.quality, this.speedKbps + 'kbps');
    return this.quality;
  },

  is2G() { return this.quality === '2g' || this.quality === 'slow-2g'; },
  isSlow() { return this.quality === '2g' || this.quality === 'slow'; },
  isOffline() { return this.quality === 'offline' || !navigator.onLine; },

  // Return appropriate JPEG quality for upload based on network
  getUploadQuality() {
    if (this.is2G()) return 0.5;      // ~80-120KB — fast on 2G
    if (this.isSlow()) return 0.7;    // ~150-200KB — good balance
    return 0.92;                       // ~300-500KB — full quality
  },

  // Return poll interval based on network
  getPollInterval() {
    if (this.is2G()) return 8000;     // 8 seconds on 2G
    if (this.isSlow()) return 5000;   // 5 seconds on slow
    return 3000;                       // 3 seconds on fast
  },

  // Return max poll attempts based on network (timeout)
  getMaxPolls() {
    if (this.is2G()) return 100;      // ~13 min timeout on 2G
    if (this.isSlow()) return 80;     // ~7 min on slow
    return 60;                         // ~3 min on fast
  },

  // Human readable status for indicator
  getStatusLabel() {
    if (!navigator.onLine) return { text: '○ Offline', color: '#ff6b6b' };
    switch (this.quality) {
      case '2g':    return { text: '▲ Weak Signal', color: '#ff9800' };
      case 'slow':  return { text: '● Slow Network', color: '#FFD700' };
      case 'fast':  return { text: '● Online', color: '#4CAF50' };
      default:      return { text: '● Online', color: '#4CAF50' };
    }
  },

  // Listen for connection changes
  startMonitoring(onUpdate) {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn) {
      conn.addEventListener('change', async () => {
        await this.detect();
        onUpdate?.(this.quality);
      });
    }
    window.addEventListener('online', async () => {
      await this.detect();
      onUpdate?.(this.quality);
    });
    window.addEventListener('offline', () => {
      this.quality = 'offline';
      onUpdate?.('offline');
    });
  }
};
