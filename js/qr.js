// js/qr.js — Self-contained QR using qrcode-generator library

const QRManager = {
  timerInterval: null,

  async generate(canvasEl, imageUrl) {
    return new Promise((resolve) => {
      try {
        // Use qrcode-generator which is always available via this CDN
        if (typeof qrcode === 'undefined') {
          console.warn('QR library not loaded, skipping QR');
          resolve();
          return;
        }

        const qr = qrcode(0, 'M');
        qr.addData(imageUrl);
        qr.make();

        const size = 180;
        const moduleCount = qr.getModuleCount();
        const cellSize = Math.floor(size / moduleCount);
        const margin = Math.floor((size - cellSize * moduleCount) / 2);

        canvasEl.width = size;
        canvasEl.height = size;
        const ctx = canvasEl.getContext('2d');

        // White background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, size, size);

        // Draw modules
        ctx.fillStyle = '#000000';
        for (let row = 0; row < moduleCount; row++) {
          for (let col = 0; col < moduleCount; col++) {
            if (qr.isDark(row, col)) {
              ctx.fillRect(
                margin + col * cellSize,
                margin + row * cellSize,
                cellSize,
                cellSize
              );
            }
          }
        }

        console.log('QR generated successfully');
        resolve();
      } catch (err) {
        console.error('QR error:', err);
        resolve(); // don't block the result screen
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
