// js/camera.js — Camera handling with aggressive fallbacks for Android + Desktop

const Camera = {
  stream: null,
  devices: [],
  currentDeviceId: null,
  videoEl: null,
  countdownInterval: null,

  async init(videoElement) {
    this.videoEl = videoElement;
    const started = await this.start();
    return started;
  },

  // Try multiple constraint strategies until one works
  async start(deviceId = null) {
    this.stop();

    // Strategy list — from most specific to most permissive
    const strategies = [];

    if (deviceId) {
      strategies.push({ video: { deviceId: { exact: deviceId } }, audio: false });
      strategies.push({ video: { deviceId: deviceId }, audio: false });
    }

    // Front camera strategies
    strategies.push({
      video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false
    });

    // Any camera with resolution
    strategies.push({
      video: { width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false
    });

    // Any camera, no constraints
    strategies.push({ video: true, audio: false });

    for (const constraints of strategies) {
      try {
        console.log('Trying camera constraints:', JSON.stringify(constraints));
        this.stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (this.videoEl) {
          this.videoEl.srcObject = this.stream;
          this.videoEl.setAttribute('playsinline', true);
          this.videoEl.setAttribute('autoplay', true);
          this.videoEl.muted = true;

          await new Promise((resolve, reject) => {
            this.videoEl.onloadedmetadata = () => resolve();
            this.videoEl.onerror = (e) => reject(e);
            setTimeout(resolve, 3000); // Timeout fallback
          });

          await this.videoEl.play().catch(() => {});
        }

        // Store device id
        const track = this.stream.getVideoTracks()[0];
        this.currentDeviceId = track?.getSettings?.()?.deviceId || deviceId;

        console.log('Camera started with:', track?.label || 'unknown');
        await this.refreshDevices();
        return true;

      } catch (err) {
        console.warn('Camera strategy failed:', err.name, err.message);
        this.stop();
        continue;
      }
    }

    console.error('All camera strategies failed');
    return false;
  },

  // Get all available video input devices
  async refreshDevices() {
    try {
      // Must request permission first before labels are available
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.devices = devices.filter(d => d.kind === 'videoinput');
      console.log('Available cameras:', this.devices.length, this.devices.map(d => d.label || d.deviceId));
      return this.devices;
    } catch (err) {
      console.error('Could not enumerate devices:', err);
      return [];
    }
  },

  // Switch to specific camera
  async switchTo(deviceId) {
    return this.start(deviceId);
  },

  // Switch to next available camera
  async switchNext() {
    await this.refreshDevices();
    if (this.devices.length <= 1) return false;

    const currentIndex = this.devices.findIndex(d => d.deviceId === this.currentDeviceId);
    const nextIndex = (currentIndex + 1) % this.devices.length;
    return this.start(this.devices[nextIndex].deviceId);
  },

  // Stop stream
  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => {
        t.stop();
      });
      this.stream = null;
    }
    if (this.videoEl) {
      this.videoEl.srcObject = null;
    }
  },

  // Capture current frame as base64
  capture() {
    if (!this.videoEl) return null;

    const canvas = document.createElement('canvas');
    const w = this.videoEl.videoWidth || 1280;
    const h = this.videoEl.videoHeight || 720;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    // Mirror horizontally to correct selfie view
    ctx.scale(-1, 1);
    ctx.translate(-w, 0);
    ctx.drawImage(this.videoEl, 0, 0, w, h);

    return canvas.toDataURL('image/jpeg', 0.95);
  },

  // Countdown then capture
  countdown(seconds, onTick, onCapture) {
    let count = seconds;
    onTick?.(count);

    this.countdownInterval = setInterval(() => {
      count--;
      if (count <= 0) {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
        const imageData = this.capture();
        onCapture?.(imageData);
      } else {
        onTick?.(count);
      }
    }, 1000);
  },

  cancelCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }
};
