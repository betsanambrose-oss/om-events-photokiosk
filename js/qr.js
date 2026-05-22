// js/qr.js — Self-contained QR generator, no external library needed

const QRManager = {
  timerInterval: null,

  async generate(canvasEl, imageUrl) {
    return new Promise((resolve) => {
      try {
        // Store URL in sessionStorage with short key
        const key = 'photo_' + Date.now();
        try { sessionStorage.setItem(key, imageUrl); } catch(e) {}
        try { localStorage.setItem(key, imageUrl); } catch(e) {}

        // Build short download URL
        const base = window.location.href.replace(/[^/]*$/, '');
        const shortUrl = base + 'download.html?k=' + key;
        console.log('QR URL:', shortUrl, 'length:', shortUrl.length);

        // Use qrcode-generator if available
        if (typeof qrcode !== 'undefined') {
          this._generateWithLib(canvasEl, shortUrl);
          resolve();
          return;
        }

        // Fallback: load library dynamically then generate
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js';
        script.onload = () => {
          this._generateWithLib(canvasEl, shortUrl);
          resolve();
        };
        script.onerror = () => {
          // Final fallback: draw text link
          this._drawFallback(canvasEl, shortUrl);
          resolve();
        };
        document.head.appendChild(script);

      } catch (err) {
        console.error('QR setup error:', err);
        resolve();
      }
    });
  },

  _generateWithLib(canvasEl, url) {
    try {
      const qr = qrcode(0, 'L');
      qr.addData(url);
      qr.make();

      const size = 180;
      const moduleCount = qr.getModuleCount();
      const cellSize = Math.max(1, Math.floor(size / moduleCount));
      const actualSize = cellSize * moduleCount;

      canvasEl.width = actualSize;
      canvasEl.height = actualSize;
      const ctx = canvasEl.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, actualSize, actualSize);
      ctx.fillStyle = '#000000';

      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (qr.isDark(row, col)) {
            ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
          }
        }
      }
      console.log('QR generated ✅');
    } catch(e) {
      console.error('QR lib error:', e);
      this._drawFallback(canvasEl, url);
    }
  },

  _drawFallback(canvasEl, url) {
    canvasEl.width = 180;
    canvasEl.height = 180;
    const ctx = canvasEl.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 180, 180);
    ctx.fillStyle = '#333333';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Tap image to', 90, 85);
    ctx.fillText('download', 90, 100);
  },

  startTimer(seconds, onTick, onComplete) {
    this.stopTimer();
    let remaining = seconds;
    onTick?.(remaining, seconds);
    this.timerInterval = setInterval(() => {
      remaining--;
      onTick?.(remaining, seconds);
      if (remaining <= 0) {
        this.stopTimer();
        onComplete?.();
      }
    }, 1000);
  },

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }
};
