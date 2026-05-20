// js/api.js — Calls Netlify proxy function (never calls fal.ai directly)

const API = {

  // Upload face image to fal.ai storage via our proxy
  // Returns data URL as base64 for now (proxy handles upload)
  capturedFaceBase64: null,

  setCapturedFace(dataUrl) {
    this.capturedFaceBase64 = dataUrl;
  },

  // ── Main generation flow ──
  // Step 1: Generate scene → Step 2: Swap face → Return result URL
  async generatePhoto(prompt, negativePrompt, onProgress) {
    try {
      onProgress?.('Designing your scene...');

      // Step 1 — Generate scene
      const step1 = await fetch('/.netlify/functions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: 'generate',
          prompt,
          negativePrompt
        })
      });

      const scene = await step1.json();
      if (!step1.ok || scene.error) throw new Error(scene.error || 'Scene generation failed');

      onProgress?.('Placing you in the scene...');

      // Step 2 — Face swap
      const step2 = await fetch('/.netlify/functions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: 'faceswap',
          faceImageBase64: this.capturedFaceBase64,
          sceneUrl: scene.sceneUrl,
          prompt,
          negativePrompt
        })
      });

      const result = await step2.json();
      if (!step2.ok || result.error) throw new Error(result.error || 'Face swap failed');

      return { success: true, imageUrl: result.resultUrl };

    } catch (err) {
      console.error('API Error:', err);
      return { success: false, error: err.message };
    }
  },

  // ── Offline fallback ──
  // Creates a simple canvas composite when no internet
  async generateOfflineFallback(prompt) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 768;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');

      // Draw gradient background based on category
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#1a1a2e');
      grad.addColorStop(1, '#16213e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw captured face in center
      const img = new Image();
      img.onload = () => {
        // Center and scale face image
        const scale = Math.min(canvas.width / img.width, (canvas.height * 0.8) / img.height);
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height * 0.1);
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        // Overlay text
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
        ctx.fillStyle = '#C9A84C';
        ctx.font = 'bold 20px Georgia';
        ctx.textAlign = 'center';
        ctx.fillText('OM EVENTS', canvas.width / 2, canvas.height - 30);

        resolve({ success: true, imageUrl: canvas.toDataURL('image/jpeg', 0.9) });
      };
      img.onerror = () => {
        resolve({ success: true, imageUrl: canvas.toDataURL('image/jpeg', 0.9) });
      };

      if (API.capturedFaceBase64) {
        img.src = API.capturedFaceBase64;
      } else {
        resolve({ success: true, imageUrl: canvas.toDataURL('image/jpeg', 0.9) });
      }
    });
  },

  // Check internet connectivity
  async isOnline() {
    if (!navigator.onLine) return false;
    try {
      const res = await fetch('/.netlify/functions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 'ping' }),
        signal: AbortSignal.timeout(5000)
      });
      return res.status !== 0;
    } catch {
      return false;
    }
  }
};
