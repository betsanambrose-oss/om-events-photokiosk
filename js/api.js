// js/api.js — Queue-based polling for fal.ai via Cloudflare Worker

const WORKER_URL = 'https://om-events-proxy.betsanambrose.workers.dev';

const API = {

  capturedFaceBase64: null,

  setCapturedFace(dataUrl) {
    this.capturedFaceBase64 = dataUrl;
    console.log('Face set, size:', dataUrl?.length);
  },

  // ── Call Worker ──
  async callWorker(payload) {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    console.log('Worker response:', payload.step, JSON.stringify(data).substring(0, 200));
    if (data.error) throw new Error(data.error);
    return data;
  },

  // ── Poll until job is complete ──
  async pollUntilDone(requestId, model, onProgress, maxWait = 120000) {
    const start = Date.now();
    let dots = 0;

    while (Date.now() - start < maxWait) {
      await new Promise(r => setTimeout(r, 3000)); // wait 3 seconds

      const result = await this.callWorker({
        step: 'poll',
        requestId,
        model
      });

      const status = result.data?.status || result.status;
      console.log('Poll status:', status);

      dots = (dots + 1) % 4;
      const dotStr = '.'.repeat(dots + 1);
      if (model === 'faceswap') {
        onProgress?.(`Placing you in the scene${dotStr}`);
      } else {
        onProgress?.(`Creating your scene${dotStr}`);
      }

      if (status === 'COMPLETED') {
        // Get the actual result
        const resultData = await this.callWorker({
          step: 'result',
          requestId,
          model
        });
        return resultData.data;
      }

      if (status === 'FAILED' || status === 'CANCELLED') {
        throw new Error(`Job ${status}`);
      }
    }

    throw new Error('Generation timed out');
  },

  // ── Main generation flow ──
  async generatePhoto(prompt, negativePrompt, onProgress) {
    try {
      // STEP 1 — Submit scene generation
      console.log('=== Submitting scene generation ===');
      onProgress?.('Submitting your scene...');

      const submitted = await this.callWorker({
        step: 'generate',
        prompt,
        negativePrompt
      });

      console.log('Scene submitted, requestId:', submitted.requestId);
      onProgress?.('Generating your scene...');

      // STEP 2 — Poll until scene is ready
      const sceneResult = await this.pollUntilDone(
        submitted.requestId,
        'flux',
        onProgress
      );

      const sceneUrl = sceneResult?.images?.[0]?.url;
      if (!sceneUrl) throw new Error('No scene image returned');
      console.log('Scene ready:', sceneUrl);

      // STEP 3 — Submit face swap
      console.log('=== Submitting face swap ===');
      onProgress?.('Submitting face swap...');

      const faceSubmitted = await this.callWorker({
        step: 'faceswap',
        faceImageBase64: this.capturedFaceBase64,
        sceneUrl
      });

      console.log('Face swap submitted, requestId:', faceSubmitted.requestId);
      onProgress?.('Placing you in the scene...');

      // STEP 4 — Poll until face swap is ready
      const faceResult = await this.pollUntilDone(
        faceSubmitted.requestId,
        'faceswap',
        onProgress
      );

      const resultUrl = faceResult?.image?.url;
      if (!resultUrl) throw new Error('No face swap result returned');
      console.log('=== SUCCESS:', resultUrl);

      return { success: true, imageUrl: resultUrl };

    } catch (err) {
      console.error('=== API FAILED:', err.message);
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
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
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
