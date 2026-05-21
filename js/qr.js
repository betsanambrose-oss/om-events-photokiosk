// js/qr.js — QR that works with long URLs by creating a short local key

const QRManager = {
  timerInterval: null,

  async generate(canvasEl, imageUrl) {
    return new Promise((resolve) => {
      try {
        if (typeof qrcode === 'undefined') {
          console.warn('QR library not loaded');
          resolve();
          return;
        }

        // Store full URL in sessionStorage with a short key
        // QR points to local download page with that key
        const key = 'photo_' + Date.now();
        try {
          sessionStorage.setItem(key, imageUrl);
        } catch(e) {}

        // Build short local URL for QR
        const baseUrl = window.location.origin + window.location.pathname.replace('index.html', '');
        const shortUrl = baseUrl + 'download.html?k=' + key;

        // Also try direct URL first, fallback to short URL
        let urlToEncode = imageUrl;

        // If URL is too long (>500 chars), use the short local URL
        if (imageUrl.length > 500) {
          urlToEncode = shortUrl;
          console.log('Using short URL for QR:', shortUrl);
        }

        console.log('QR URL length:', urlToEncode.length);

        // Pick QR type based on length
        let type = 1;
        if (urlToEncode.length > 100) type = 3;
        if (urlToEncode.length > 200) type = 5;
        if (urlToEncode.length > 300) type = 8;
        if (urlToEncode.length > 400) type = 10;

        const qr = qrcode(type, 'L');
        qr.addData(urlToEncode);
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

        console.log('QR generated ✅, modules:', moduleCount);
        resolve();

      } catch (err) {
        console.error('QR failed:', err.message);
        // Draw direct link as fallback text
        try {
          canvasEl.width = 180; canvasEl.height = 180;
          const ctx = canvasEl.getContext('2d');
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, 180, 180);
          ctx.fillStyle = '#888';
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Tap image to', 90, 80);
          ctx.fillText('download', 90, 95);
        } catch(e) {}
        resolve();
      }
    });
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
