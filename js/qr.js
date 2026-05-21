// js/qr.js — QR Code generation using qrcodejs library

const QRManager = {
  timerInterval: null,

  // Generate QR code — uses qrcodejs which creates a canvas/img element
  async generate(canvasEl, imageUrl) {
    return new Promise((resolve, reject) => {
      try {
        // Clear the container
        const container = canvasEl.parentElement || document.getElementById('qr-container');

        // Remove old QR if any
        const old = document.getElementById('qr-generated');
        if (old) old.remove();

        // Hide original canvas
        canvasEl.style.display = 'none';

        // Create wrapper div for qrcodejs
        const wrapper = document.createElement('div');
        wrapper.id = 'qr-generated';
        wrapper.style.cssText = 'width:180px; height:180px; display:flex; align-items:center; justify-content:center;';
        canvasEl.parentElement.insertBefore(wrapper, canvasEl);

        if (typeof QRCode === 'undefined') {
          // Fallback: show URL text if library failed
          wrapper.innerHTML = `<div style="font-size:9px;word-break:break-all;color:#000;padding:8px;">${imageUrl}</div>`;
          resolve();
          return;
        }

        new QRCode(wrapper, {
          text: imageUrl,
          width: 180,
          height: 180,
          colorDark: '#000000',
          colorLight: '#FFFFFF',
          correctLevel: QRCode.CorrectLevel.M
        });

        resolve();
      } catch (err) {
        console.error('QR error:', err);
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
