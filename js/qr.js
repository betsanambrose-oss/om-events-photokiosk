// js/qr.js — QR Code generation and 30-second timer

const QRManager = {
  timerInterval: null,
  timerSeconds: 30,

  // Generate QR code pointing to image URL
  // Uses qrcode.js library loaded from CDN
  async generate(canvasEl, imageUrl) {
    return new Promise((resolve, reject) => {
      if (typeof QRCode === 'undefined') {
        reject(new Error('QRCode library not loaded'));
        return;
      }

      // Clear canvas
      const ctx = canvasEl.getContext('2d');
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);

      try {
        QRCode.toCanvas(canvasEl, imageUrl, {
          width: 180,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'M'
        }, (err) => {
          if (err) reject(err);
          else resolve();
        });
      } catch (err) {
        reject(err);
      }
    });
  },

  // Start 30-second countdown timer
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
