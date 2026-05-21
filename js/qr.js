// js/qr.js — QR Code using qrcode npm library (jsdelivr CDN)

const QRManager = {
  timerInterval: null,

  async generate(canvasEl, imageUrl) {
    return new Promise((resolve, reject) => {
      try {
        if (typeof QRCode === 'undefined') {
          console.error('QRCode library not loaded');
          resolve(); // don't crash — just skip QR
          return;
        }

        // qrcode npm library uses QRCode.toCanvas(canvas, text, options, callback)
        QRCode.toCanvas(canvasEl, imageUrl, {
          width: 180,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        }, (err) => {
          if (err) {
            console.error('QR canvas error:', err);
            // Fallback: try toDataURL instead
            QRCode.toDataURL(imageUrl, { width: 180 }, (err2, url) => {
              if (!err2 && url) {
                const img = document.createElement('img');
                img.src = url;
                img.width = 180;
                img.height = 180;
                canvasEl.parentNode.insertBefore(img, canvasEl);
                canvasEl.style.display = 'none';
              }
              resolve();
            });
          } else {
            resolve();
          }
        });
      } catch (err) {
        console.error('QR error:', err);
        resolve(); // don't block result screen
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
