// js/api.js — Full flow with face image upload + queue polling

const WORKER_URL = 'https://om-events-proxy.betsanambrose.workers.dev';

const API = {

  capturedFaceBase64: null,
  faceImageUrl: null, // URL after upload

  setCapturedFace(dataUrl) {
    this.capturedFaceBase64 = dataUrl;
    this.faceImageUrl = null; // reset on new capture
    console.log('Face captured, size:', dataUrl?.length);
  },

  // ── Call Worker ──
  async callWorker(payload) {
    console.log('→ Worker:', payload.step);
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    const preview = JSON.stringify(data).substring(0, 200);
    console.log('← Response:', payload.step, preview);
    if (data.error) throw new Error(`[${payload.step}] ${data.error}`);
    return data;
  },

  // ── Upload face image to fal.ai storage ──
  async uploadFaceImage(onProgress) {
    if (this.faceImageUrl) return this.faceImageUrl; // reuse if already uploaded

    onProgress?.('Uploading your photo...');
    console.log('Uploading face image...');

    // Strip data URL prefix to get pure base64
    const base64 = this.capturedFaceBase64.replace(/^data:image\/\w+;base64,/, '');

    const result = await this.callWorker({
      step: 'upload',
      base64,
      mimeType: 'image/jpeg'
    });

    this.faceImageUrl = result.fileUrl;
    console.log('Face uploaded:', this.faceImageUrl);
    return this.faceImageUrl;
  },

  // ── Poll status URL until COMPLETED ──
  async pollStatus(statusUrl, responseUrl, onProgress, label) {
    let attempts = 0;
    const maxAttempts = 40;

    while (attempts < maxAttempts) {
      await new Promise(r => setTimeout(r, 3000));
      attempts++;

      const statusData = await this.callWorker({ step: 'status', statusUrl });
      const status = statusData.status;
      console.log(`Poll #${attempts} [${label}]:`, status);

      if (status === 'IN_QUEUE') {
        const pos = statusData.queuePosition;
        onProgress?.(`${label} — Queue position: ${pos ?? '...'}`);
      } else if (status === 'IN_PROGRESS') {
        onProgress?.(`${label} — Generating...`);
      } else if (status === 'COMPLETED') {
        const result = await this.callWorker({ step: 'getresult', responseUrl });
        return result.data;
      } else {
        throw new Error(`${label} failed: ${status}`);
      }
    }
    throw new Error(`${label} timed out`);
  },

  // ── Main generation flow ──
  async generatePhoto(prompt, negativePrompt, onProgress) {
    try {
      // 1. Upload face image to get URL
      const faceUrl = await this.uploadFaceImage(onProgress);

      // 2. Submit scene generation
      onProgress?.('Creating your scene...');
      const sceneJob = await this.callWorker({
        step: 'generate',
        prompt,
        negativePrompt
      });
      console.log('Scene job:', sceneJob.requestId);

      // 3. Poll scene until done
      const sceneResult = await this.pollStatus(
        sceneJob.statusUrl,
        sceneJob.responseUrl,
        onProgress,
        'Creating scene'
      );

      const sceneUrl = sceneResult?.images?.[0]?.url;
      if (!sceneUrl) throw new Error('No scene URL returned: ' + JSON.stringify(sceneResult));
      console.log('Scene ready:', sceneUrl);

      // 4. Submit face swap (using URL not base64)
      onProgress?.('Placing you in the scene...');
      const faceJob = await this.callWorker({
        step: 'faceswap',
        faceImageUrl: faceUrl,
        sceneUrl
      });
      console.log('Face swap job:', faceJob.requestId);

      // 5. Poll face swap until done
      const faceResult = await this.pollStatus(
        faceJob.statusUrl,
        faceJob.responseUrl,
        onProgress,
        'Placing you in scene'
      );

      const resultUrl = faceResult?.image?.url;
      if (!resultUrl) throw new Error('No result URL: ' + JSON.stringify(faceResult));
      console.log('Final image:', resultUrl);

      return { success: true, imageUrl: resultUrl };

    } catch (err) {
      console.error('Generation failed:', err.message);
      return { success: false, error: err.message };
    }
  },

  // ── Offline fallback ──
  async generateOfflineFallback() {
    console.log('=== OFFLINE FALLBACK ===');
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 768;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');

      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#1a1a2e');
      grad.addColorStop(1, '#16213e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const finalize = () => {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, canvas.height - 120, canvas.width, 120);
        ctx.fillStyle = '#C9A84C';
        ctx.font = 'bold 22px Georgia';
        ctx.textAlign = 'center';
        ctx.fillText('OM EVENTS', canvas.width / 2, canvas.height - 60);
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = '14px Georgia';
        ctx.fillText('Offline Mode', canvas.width / 2, canvas.height - 30);
        resolve({ success: true, imageUrl: canvas.toDataURL('image/jpeg', 0.9) });
      };

      if (API.capturedFaceBase64) {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(canvas.width / img.width, (canvas.height * 0.8) / img.height);
          const x = (canvas.width - img.width * scale) / 2;
          const y = canvas.height * 0.05;
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
          finalize();
        };
        img.onerror = finalize;
        img.src = API.capturedFaceBase64;
      } else {
        finalize();
      }
    });
  }
};
