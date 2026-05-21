// js/api.js — SAFE VERSION: Single attempt, hard stop on failure, no retries

const WORKER_URL = 'https://om-events-proxy.betsanambrose.workers.dev';

const API = {
  capturedFaceBase64: null,
  faceImageUrl: null,
  isGenerating: false, // HARD LOCK — prevents any double calls

  setCapturedFace(dataUrl) {
    this.capturedFaceBase64 = dataUrl;
    this.faceImageUrl = null;
    console.log('Face captured');
  },

  // ── Single worker call — throws on any error ──
  async callWorker(payload) {
    console.log('→ Worker:', payload.step);
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    console.log('← Worker:', payload.step, JSON.stringify(data).substring(0, 150));
    if (data.error) throw new Error(`[${payload.step}] ${data.error}`);
    return data;
  },

  // ── Poll with MAX 20 attempts (60 seconds total) — then hard stop ──
  async pollOnce(statusUrl, responseUrl, label, onProgress) {
    const MAX_POLLS = 20; // 20 × 3s = 60 seconds max

    for (let i = 0; i < MAX_POLLS; i++) {
      await new Promise(r => setTimeout(r, 3000));

      const statusData = await this.callWorker({ step: 'status', statusUrl });
      const status = statusData.status;
      console.log(`[${label}] poll ${i + 1}/${MAX_POLLS}: ${status}`);

      if (status === 'IN_QUEUE') {
        onProgress?.(`${label} — waiting (${statusData.queuePosition ?? i + 1})`);
      } else if (status === 'IN_PROGRESS') {
        onProgress?.(`${label} — processing...`);
      } else if (status === 'COMPLETED') {
        const result = await this.callWorker({ step: 'getresult', responseUrl });
        return result.data;
      } else {
        // Any other status = hard stop
        throw new Error(`${label} stopped with status: ${status}`);
      }
    }

    throw new Error(`${label} timed out after ${MAX_POLLS} attempts`);
  },

  // ── Main generation — runs ONCE, stops on any error ──
  async generatePhoto(prompt, negativePrompt, onProgress) {

    // Hard lock — prevents double execution
    if (this.isGenerating) {
      console.warn('Already generating — ignoring duplicate call');
      return { success: false, error: 'Already generating' };
    }

    this.isGenerating = true;

    try {
      // STEP 1 — Upload face image
      onProgress?.('Uploading your photo...');
      if (!this.capturedFaceBase64) throw new Error('No face image captured');

      const base64 = this.capturedFaceBase64.replace(/^data:image\/\w+;base64,/, '');
      if (!base64 || base64.length < 100) throw new Error('Face image data is empty or too small');

      const uploaded = await this.callWorker({ step: 'upload', base64 });
      if (!uploaded.fileUrl) throw new Error('Upload succeeded but no file URL returned');
      this.faceImageUrl = uploaded.fileUrl;
      console.log('Face uploaded:', this.faceImageUrl);

      // STEP 2 — Submit scene generation
      onProgress?.('Generating scene...');
      const sceneJob = await this.callWorker({ step: 'generate', prompt, negativePrompt });
      console.log('Scene job submitted:', sceneJob.requestId);

      // STEP 3 — Poll scene (max 60 seconds)
      const sceneResult = await this.pollOnce(
        sceneJob.statusUrl,
        sceneJob.responseUrl,
        'Scene',
        onProgress
      );

      const sceneUrl = sceneResult?.images?.[0]?.url;
      if (!sceneUrl) throw new Error('No scene image returned');
      console.log('Scene ready:', sceneUrl);

      // STEP 4 — Submit face swap
      onProgress?.('Placing you in the scene...');
      const faceJob = await this.callWorker({
        step: 'faceswap',
        faceImageUrl: this.faceImageUrl,
        sceneUrl
      });
      console.log('Face swap submitted:', faceJob.requestId);

      // STEP 5 — Poll face swap (max 60 seconds)
      const faceResult = await this.pollOnce(
        faceJob.statusUrl,
        faceJob.responseUrl,
        'Face swap',
        onProgress
      );

      const resultUrl = faceResult?.image?.url;
      if (!resultUrl) throw new Error('No face swap result returned');
      console.log('SUCCESS — Final image:', resultUrl);

      return { success: true, imageUrl: resultUrl };

    } catch (err) {
      console.error('GENERATION FAILED — hard stop:', err.message);
      return { success: false, error: err.message };

    } finally {
      // Always release the lock
      this.isGenerating = false;
    }
  },

  // ── Offline fallback — only used when NO internet at all ──
  async generateOfflineFallback() {
    console.log('OFFLINE MODE — no API calls');
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
        ctx.fillText('No Internet — Offline Mode', canvas.width / 2, canvas.height - 30);
        resolve({ success: true, imageUrl: canvas.toDataURL('image/jpeg', 0.9) });
      };

      if (API.capturedFaceBase64) {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(canvas.width / img.width, (canvas.height * 0.8) / img.height);
          const x = (canvas.width - img.width * scale) / 2;
          ctx.drawImage(img, x, canvas.height * 0.05, img.width * scale, img.height * scale);
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
