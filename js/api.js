// js/api.js — Direct calls, single execution guarantee

const WORKER_URL = 'https://om-events-proxy.betsanambrose.workers.dev';

const API = {
  capturedFaceBase64: null,
  faceImageUrl: null,
  isGenerating: false,

  setCapturedFace(dataUrl) {
    this.capturedFaceBase64 = dataUrl;
    this.faceImageUrl = null;
    console.log('Face captured, size:', dataUrl?.length);
  },

  // Single worker call — no retry, throws immediately on error
  async callWorker(payload) {
    console.log('→ Worker:', payload.step);

    let res, data;
    try {
      res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      data = await res.json();
    } catch (networkErr) {
      throw new Error(`Network error on ${payload.step}: ${networkErr.message}`);
    }

    console.log('← Response:', payload.step, JSON.stringify(data).substring(0, 200));

    if (data.error) {
      throw new Error(`[${payload.step}] ${data.error}`);
    }
    return data;
  },

  // Main generation — 3 sequential steps, no retry, no loop
  async generatePhoto(prompt, negativePrompt, onProgress) {

    // Absolute hard guard
    if (this.isGenerating) {
      return { success: false, error: 'Already running — please wait' };
    }
    this.isGenerating = true;

    try {
      // ── STEP 1: Upload face ──
      onProgress?.('Uploading your photo...');
      if (!this.capturedFaceBase64) {
        throw new Error('No face image — please capture again');
      }

      const base64 = this.capturedFaceBase64.replace(/^data:image\/\w+;base64,/, '');
      if (!base64 || base64.length < 1000) {
        throw new Error('Face image too small or empty');
      }

      const uploaded = await this.callWorker({ step: 'upload', base64 });
      if (!uploaded.fileUrl) throw new Error('Upload returned no URL');
      this.faceImageUrl = uploaded.fileUrl;
      console.log('✅ Face uploaded:', this.faceImageUrl);

      // ── STEP 2: Generate scene ──
      onProgress?.('Generating your scene...');
      const sceneData = await this.callWorker({
        step: 'generate',
        prompt: prompt
      });
      if (!sceneData.sceneUrl) throw new Error('Scene generation returned no image');
      console.log('✅ Scene ready:', sceneData.sceneUrl);

      // ── STEP 3: Face swap ──
      onProgress?.('Placing you in the scene...');
      const faceData = await this.callWorker({
        step: 'faceswap',
        faceImageUrl: this.faceImageUrl,
        sceneUrl: sceneData.sceneUrl
      });
      if (!faceData.resultUrl) throw new Error('Face swap returned no image');
      console.log('✅ Final result:', faceData.resultUrl);

      return { success: true, imageUrl: faceData.resultUrl };

    } catch (err) {
      console.error('❌ GENERATION FAILED:', err.message);
      return { success: false, error: err.message };

    } finally {
      // Always release lock — no matter what happens
      this.isGenerating = false;
    }
  },

  // Offline fallback — zero API calls
  async generateOfflineFallback() {
    console.log('OFFLINE MODE — no API calls made');
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 768;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#1a1a2e');
      grad.addColorStop(1, '#16213e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const finalize = () => {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
        ctx.fillStyle = '#C9A84C';
        ctx.font = 'bold 24px Georgia';
        ctx.textAlign = 'center';
        ctx.fillText('OM EVENTS — Offline Mode', canvas.width / 2, canvas.height - 35);
        resolve({ success: true, imageUrl: canvas.toDataURL('image/jpeg', 0.9) });
      };

      if (API.capturedFaceBase64) {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(canvas.width / img.width, (canvas.height * 0.8) / img.height);
          ctx.drawImage(img,
            (canvas.width - img.width * scale) / 2, 50,
            img.width * scale, img.height * scale
          );
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
