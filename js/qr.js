// js/qr.js — QR code pointing directly to the fal.ai image URL

const QRManager = {
  timerInterval: null,

  async generate(canvasEl, imageUrl) {
    return new Promise((resolve) => {
      try {
        // Point QR directly to the fal.ai image URL
        // fal URLs are ~97 chars — well within QR limits
        // Guest scans → goes to download.html with the actual URL as param
        const base = window.location.href.replace(/[^/]*$/, '');
        const downloadUrl = base + 'download.html?url=' + encodeURIComponent(imageUrl);

        console.log('QR URL:', downloadUrl, 'length:', downloadUrl.length);

        const generate = () => {
          try {
            const qr = qrcode(0, 'L');
            qr.addData(downloadUrl);
            qr.make();

            const size = 200;
            const moduleCount = qr.getModuleCount();
            const cellSize = Math.max(2, Math.floor(size / moduleCount));
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
            resolve();
          } catch (err) {
            console.error('QR generation error:', err);
            this._drawFallback(canvasEl);
            resolve();
          }
        };

        if (typeof qrcode !== 'undefined') {
          generate();
        } else {
          // Load library dynamically
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js';
          script.onload = generate;
          script.onerror = () => { this._drawFallback(canvasEl); resolve(); };
          document.head.appendChild(script);
        }

      } catch (err) {
        console.error('QR setup error:', err);
        this._drawFallback(canvasEl);
        resolve();
      }
    });
  },

  _drawFallback(canvasEl) {
    canvasEl.width = 200; canvasEl.height = 200;
    const ctx = canvasEl.getContext('2d');
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, 200, 200);
    ctx.fillStyle = '#333333'; ctx.font = '11px Arial'; ctx.textAlign = 'center';
    ctx.fillText('Tap photo to', 100, 90);
    ctx.fillText('download', 100, 108);
  },

  startTimer(seconds, onTick, onComplete) {
    this.stopTimer();
    let remaining = seconds;
    onTick?.(remaining, seconds);
    this.timerInterval = setInterval(() => {
      remaining--;
      onTick?.(remaining, seconds);
      if (remaining <= 0) { this.stopTimer(); onComplete?.(); }
    }, 1000);
  },

  stopTimer() {
    if (this.timerInterval) { clearInterval(this.timerInterval); this.timerInterval = null; }
  }
};
