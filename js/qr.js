// js/qr.js — QR Code with auto type sizing for long URLs

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

        // Auto-detect type based on URL length
        // Type 0 = auto, but long URLs need higher type
        let type = 0;
        if (imageUrl.length > 500) type = 10;
        if (imageUrl.length > 1000) type = 20;
        if (imageUrl.length > 1500) type = 30;
        if (imageUrl.length > 2000) type = 40;

        console.log('QR URL length:', imageUrl.length, 'type:', type);

        const qr = qrcode(type, 'L'); // L = lowest error correction = fits more data
        qr.addData(imageUrl);
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

        console.log('QR generated, modules:', moduleCount);
        resolve();
      } catch (err) {
        console.error('QR error:', err.message);
        // Show URL as text fallback
        try {
          const ctx = canvasEl.getContext('2d');
          canvasEl.width = 180; canvasEl.height = 180;
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, 180, 180);
          ctx.fillStyle = '#000000';
          ctx.font = '8px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('QR Error', 90, 90);
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
