// js/camera.js — Camera handling, source switching, capture, countdown

const Camera = {
  stream: null,
  devices: [],
  currentDeviceId: null,
  videoEl: null,
  countdownInterval: null,

  async init(videoElement) {
    this.videoEl = videoElement;
    await this.refreshDevices();
    await this.start();
  },

  // Get all available video input devices
  async refreshDevices() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.devices = devices.filter(d => d.kind === 'videoinput');
      console.log('Available cameras:', this.devices.map(d => d.label));
      return this.devices;
    } catch (err) {
      console.error('Could not enumerate devices:', err);
      return [];
    }
  },

  // Start camera stream
  async start(deviceId = null) {
    // Stop existing stream
    this.stop();

    const constraints = {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: deviceId ? undefined : 'user',
        deviceId: deviceId ? { exact: deviceId } : undefined
      },
      audio: false
    };

    // Remove undefined keys
    if (!deviceId) delete constraints.video.deviceId;
    else delete constraints.video.facingMode;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.currentDeviceId = deviceId;

      if (this.videoEl) {
        this.videoEl.srcObject = this.stream;
        await this.videoEl.play();
      }
      return true;
    } catch (err) {
      console.error('Camera start error:', err);
      // Try without device constraint as fallback
      if (deviceId) {
        return this.start(null);
      }
      return false;
    }
  },

  // Switch to specific camera
  async switchTo(deviceId) {
    return this.start(deviceId);
  },

  // Switch to next available camera
  async switchNext() {
    await this.refreshDevices();
    if (this.devices.length <= 1) return;

    const currentIndex = this.devices.findIndex(d => d.deviceId === this.currentDeviceId);
    const nextIndex = (currentIndex + 1) % this.devices.length;
    return this.start(this.devices[nextIndex].deviceId);
  },

  // Stop stream
  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
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
    canvas.width = this.videoEl.videoWidth || 1280;
    canvas.height = this.videoEl.videoHeight || 720;
    const ctx = canvas.getContext('2d');

    // Mirror horizontally (since we show mirrored preview)
    ctx.scale(-1, 1);
    ctx.translate(-canvas.width, 0);
    ctx.drawImage(this.videoEl, 0, 0);

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
