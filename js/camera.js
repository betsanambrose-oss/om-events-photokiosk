// js/camera.js — Camera handling with external camera support

const Camera = {
  stream: null,
  devices: [],
  currentDeviceId: null,
  videoEl: null,
  countdownInterval: null,
  isFrontFacing: true, // track whether current cam is front-facing (mirror) or external (no mirror)

  async init(videoElement, deviceId = null) {
    this.videoEl = videoElement;
    const started = await this.start(deviceId);
    return started;
  },

  async start(deviceId = null) {
    this.stop();

    const strategies = [];

    // Request highest resolution first (eMeet S800 supports 4K / 8.3MP)
    // More capture pixels = more real face detail for AI identity preservation
    // Falls back gracefully to lower res if 4K unsupported
    if (deviceId) {
      strategies.push({ video: { deviceId: { exact: deviceId }, width: { ideal: 3840 }, height: { ideal: 2160 }, aspectRatio: { ideal: 1.7778 } }, audio: false });
      strategies.push({ video: { deviceId: { exact: deviceId }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: false });
      strategies.push({ video: { deviceId: { exact: deviceId } }, audio: false });
      strategies.push({ video: { deviceId }, audio: false });
    }

    // Front camera strategies — 4K first, then fall back
    // 16:9 landscape — matches AI output aspect ratio
    strategies.push({
      video: { facingMode: 'user', width: { ideal: 3840 }, height: { ideal: 2160 }, aspectRatio: { ideal: 1.7778 } },
      audio: false
    });
    strategies.push({
      video: { facingMode: 'user', width: { ideal: 1920 }, height: { ideal: 1080 }, aspectRatio: { ideal: 1.7778 } },
      audio: false
    });
    strategies.push({
      video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false
    });
    // Any camera — 4K first, then 16:9 fallbacks
    strategies.push({
      video: { width: { ideal: 3840 }, height: { ideal: 2160 }, aspectRatio: { ideal: 1.7778 } },
      audio: false
    });
    strategies.push({
      video: { width: { ideal: 1920 }, height: { ideal: 1080 }, aspectRatio: { ideal: 1.7778 } },
      audio: false
    });
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
          this.videoEl.setAttribute('playsinline', 'true');
          this.videoEl.setAttribute('autoplay', 'true');
          this.videoEl.muted = true;

          await new Promise((resolve) => {
            this.videoEl.onloadedmetadata = () => resolve();
            setTimeout(resolve, 3000);
          });

          await this.videoEl.play().catch(() => {});
        }

        const track = this.stream.getVideoTracks()[0];
        const settings = track?.getSettings?.() || {};
        this.currentDeviceId = settings.deviceId || deviceId;

        // Determine if this is a front-facing camera (should be mirrored in CSS only)
        // External/USB cameras are NOT front-facing
        const facingMode = settings.facingMode || '';
        const label = (track?.label || '').toLowerCase();
        const isExplicitlyFront = facingMode === 'user';
        const isExplicitlyBack = facingMode === 'environment';
        const labelSuggestsExternal = label.includes('usb') || label.includes('external') || label.includes('elgato') || label.includes('capture') || label.includes('hdmi') || label.includes('obs') || label.includes('droidcam') || label.includes('ivcam') || label.includes('camo') || label.includes('iriun');

        if (isExplicitlyBack || labelSuggestsExternal) {
          this.isFrontFacing = false;
        } else {
          this.isFrontFacing = true; // default assumption for unknown cameras
        }

        // Apply CSS mirror to video preview for front cameras only (natural selfie view)
        if (this.videoEl) {
          this.videoEl.style.transform = this.isFrontFacing ? 'scaleX(-1)' : 'scaleX(1)';
        }

        console.log('Camera started:', track?.label || 'unknown', '| front-facing:', this.isFrontFacing, '| res:', settings.width + 'x' + settings.height);
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

  async refreshDevices() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.devices = devices.filter(d => d.kind === 'videoinput');
      console.log('Available cameras:', this.devices.map(d => d.label || d.deviceId));
      return this.devices;
    } catch (err) {
      console.error('Could not enumerate devices:', err);
      return [];
    }
  },

  async switchTo(deviceId) {
    return this.start(deviceId);
  },

  async switchNext() {
    await this.refreshDevices();
    if (this.devices.length <= 1) return false;
    const currentIndex = this.devices.findIndex(d => d.deviceId === this.currentDeviceId);
    const nextIndex = (currentIndex + 1) % this.devices.length;
    return this.start(this.devices[nextIndex].deviceId);
  },

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
    if (this.videoEl) {
      this.videoEl.srcObject = null;
    }
  },

  // Capture current frame — handles both front and external cameras correctly
  capture() {
    if (!this.videoEl) {
      console.error('Capture failed: no video element');
      return null;
    }

    const w = this.videoEl.videoWidth;
    const h = this.videoEl.videoHeight;

    // Validate we have actual video frame
    if (!w || !h || w < 10 || h < 10) {
      console.error('Capture failed: video dimensions invalid', w, 'x', h);
      return null;
    }

    // Check video is actually playing and has content
    if (this.videoEl.readyState < 2) {
      console.error('Capture failed: video not ready, readyState:', this.videoEl.readyState);
      return null;
    }

    const canvas = document.createElement('canvas');
    // Use full native resolution for maximum quality
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    if (this.isFrontFacing) {
      // Front camera: mirror the capture to match real world (undo the CSS mirror)
      ctx.scale(-1, 1);
      ctx.translate(-w, 0);
    }
    // External/USB camera: draw directly without mirroring
    ctx.drawImage(this.videoEl, 0, 0, w, h);

    // Export as PNG for lossless quality upload to Kontext
    // PNG preserves all facial detail with no compression artifacts
    const dataUrl = canvas.toDataURL('image/png');

    // Validate the output is not a black/empty frame
    // A blank black image at 1280x720 would be ~50kb — if it's too small, something is wrong
    const base64Part = dataUrl.split(',')[1] || '';
    const estimatedKB = (base64Part.length * 0.75) / 1024;
    console.log('Captured frame:', w + 'x' + h, '| ~' + Math.round(estimatedKB) + 'KB');

    if (estimatedKB < 5) {
      console.error('Capture warning: image suspiciously small (' + Math.round(estimatedKB) + 'KB) — may be blank');
      // Return it anyway and let the validation in api.js handle it
    }

    return dataUrl;
  },

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
