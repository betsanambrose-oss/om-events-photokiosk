// js/api.js — Queue polling via Cloudflare Worker

const WORKER_URL = 'https://om-events-proxy.betsanambrose.workers.dev';

const API = {

  capturedFaceBase64: null,

  setCapturedFace(dataUrl) {
    this.capturedFaceBase64 = dataUrl;
    console.log('Face captured, size:', dataUrl?.length);
  },

  async callWorker(payload) {
    console.log('→ Worker call:', payload.step);
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    console.log('← Worker response:', payload.step, JSON.stringify(data).substring(0, 300));
    if (data.error) throw new Error(`[${payload.step}] ${data.error}`);
    return data;
  },

  // Poll status URL every 3 seconds until COMPLETED
  async pollStatus(statusUrl, responseUrl, onProgress, label) {
    let attempts = 0;
    const maxAttempts = 40; // 40 × 3s = 2 min max

    while (attempts < maxAttempts) {
      await new Promise(r => setTimeout(r, 3000));
      attempts++;

      const statusData = await this.callWorker({
        step: 'status',
        statusUrl
      });

      const status = statusData.status;
      console.log(`Poll #${attempts} ${label}:`, status);

      if (status === 'IN_QUEUE') {
        onProgress?.(`${label} — In queue (${statusData.queuePosition ?? '?'})`);
      } else if (status === 'IN_PROGRESS') {
        onProgress?.(`${label} — Processing...`);
      } else if (status === 'COMPLETED') {
        // Fetch actual result
        const result = await this.callWorker({
          step: 'getresult',
          responseUrl
        });
        return result.data;
      } else {
        throw new Error(`${label} failed with status: ${status}`);
      }
    }

    throw new Error(`${label} timed out after ${maxAttempts} attempts`);
  },

  // ── Main generation flow ──
  async generatePhoto(prompt, negativePrompt, onProgress) {
    try {
      // STEP 1 — Submit scene generation
      onProgress?.('Submitting scene...');
      const sceneSubmit = await this.callWorker({
        step: 'generate',
        prompt,
        negativePrompt
      });

      console.log('Scene job ID:', sceneSubmit.requestId);

      // STEP 2 — Poll until scene ready
      onProgress?.('Generating scene...');
      const sceneResult = await this.pollStatus(
        sceneSubmit.statusUrl,
        sceneSubmit.responseUrl,
        onProgress,
        'Generating scene'
      );

      const sceneUrl = sceneResult?.images?.[0]?.url;
      if (!sceneUrl) throw new Error('No scene image in result: ' + JSON.stringify(sceneResult));
      console.log('Scene URL:', sceneUrl);

      // STEP 3 — Submit face swap
      onProgress?.('Submitting face placement...');
      const faceSubmit = await this.callWorker({
        step: 'faceswap',
        faceImageBase64: this.capturedFaceBase64,
        sceneUrl
      });

      console.log('Face swap job ID:', faceSubmit.requestId);

      // STEP 4 — Poll until face swap ready
      onProgress?.('Placing you in the scene...');
      const faceResult = await this.pollStatus(
        faceSubmit.statusUrl,
        faceSubmit.responseUrl,
        onProgress,
        'Placing you in scene'
      );

      const resultUrl = faceResult?.image?.url;
      if (!resultUrl) throw new Error('No face result: ' + JSON.stringify(faceResult));
      console.log('Final result:', resultUrl);

      return { success: true, imageUrl: resultUrl };

    } catch (err) {
      console.error('API failed:', err.message);
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
        ctx.fillText('Offline Mode — No Internet', canvas.width / 2, canvas.height - 30);
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
