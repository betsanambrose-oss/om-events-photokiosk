// js/api.js — Flux Kontext: upload face + one AI call = done

const WORKER_URL = 'https://om-events-proxy.betsanambrose.workers.dev';

const API = {
  capturedFaceBase64: null,
  faceImageUrl: null,
  isGenerating: false,

  setCapturedFace(dataUrl) {
    this.capturedFaceBase64 = dataUrl;
    this.faceImageUrl = null;
    const base64Part = dataUrl?.split(',')[1] || '';
    const sizeKB = Math.round((base64Part.length * 0.75) / 1024);
    console.log('Face set, size:', sizeKB + 'KB');
  },

  async callWorker(payload) {
    console.log('→ Worker:', payload.step);
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    console.log('← Response:', payload.step, JSON.stringify(data).substring(0, 200));
    if (data.error) throw new Error(`[${payload.step}] ${data.error}`);
    return data;
  },

  async pollKontext(statusUrl, responseUrl, onProgress) {
    const MAX = 60;
    for (let i = 0; i < MAX; i++) {
      await new Promise(r => setTimeout(r, 3000));
      const s = await this.callWorker({ step: 'kontext_status', statusUrl });
      console.log(`Kontext poll ${i + 1}/${MAX}: ${s.status}`);

      if (s.status === 'IN_QUEUE') {
        onProgress?.(`Creating your scene — queue (${s.queuePosition ?? i})...`);
      } else if (s.status === 'IN_PROGRESS') {
        onProgress?.('Creating your scene...');
      } else if (s.status === 'COMPLETED') {
        const result = await this.callWorker({ step: 'kontext_result', responseUrl });
        return result.resultUrl;
      } else {
        throw new Error('Generation failed with status: ' + s.status);
      }
    }
    throw new Error('Generation timed out after 3 minutes');
  },

  async generatePhoto(prompt, negativePrompt, onProgress, personCount = 1) {
    if (this.isGenerating) {
      return { success: false, error: 'Already running — please wait' };
    }
    this.isGenerating = true;

    try {
      // STEP 1 — Validate and upload face image
      onProgress?.(personCount > 1 ? 'Uploading group photo...' : 'Uploading your photo...');

      if (!this.capturedFaceBase64) {
        throw new Error('No photo captured. Please try again.');
      }

      const dataUrl = this.capturedFaceBase64;
      const isPng = dataUrl.startsWith('data:image/png');
      const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, '');
      if (!base64) {
        throw new Error('Photo capture failed — empty image. Please try again.');
      }

      // PNG is larger than JPEG — min 50KB for PNG, 20KB for JPEG
      const estimatedKB = (base64.length * 0.75) / 1024;
      const minKB = isPng ? 30 : 20;
      if (estimatedKB < minKB) {
        throw new Error(`Photo appears blank (${Math.round(estimatedKB)}KB). Check camera connection and try again.`);
      }

      console.log('Uploading photo:', Math.round(estimatedKB) + 'KB', isPng ? '(PNG)' : '(JPEG)');
      const uploaded = await this.callWorker({ step: 'upload', base64, isPng });
      if (!uploaded.fileUrl) throw new Error('Upload failed — no URL returned');
      this.faceImageUrl = uploaded.fileUrl;
      console.log('✅ Photo uploaded:', this.faceImageUrl);

      // STEP 2 — Submit Kontext
      onProgress?.('Creating your scene...');
      const job = await this.callWorker({
        step: 'kontext_submit',
        prompt: prompt,
        faceImageUrl: this.faceImageUrl
      });
      if (!job.statusUrl) throw new Error('Scene generation job not created');
      console.log('✅ Kontext job submitted:', job.requestId);

      // STEP 3 — Poll until done
      onProgress?.(personCount > 1 ? 'Placing your group in the scene...' : 'Creating your scene...');
      const resultUrl = await this.pollKontext(job.statusUrl, job.responseUrl, onProgress);
      if (!resultUrl) throw new Error('No result image returned');
      console.log('✅ Final result:', resultUrl);

      return { success: true, imageUrl: resultUrl };

    } catch (err) {
      console.error('❌ FAILED:', err.message);
      return { success: false, error: err.message };
    } finally {
      this.isGenerating = false;
    }
  },

  async generateOfflineFallback() {
    console.log('OFFLINE MODE');
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 768; canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#1a1a2e'); grad.addColorStop(1, '#16213e');
      ctx.fillStyle = grad; ctx.fillRect(0, 0, canvas.width, canvas.height);
      const finalize = () => {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
        ctx.fillStyle = '#C9A84C'; ctx.font = 'bold 24px Georgia';
        ctx.textAlign = 'center';
        ctx.fillText('OM EVENTS — Offline Mode', canvas.width / 2, canvas.height - 35);
        resolve({ success: true, imageUrl: canvas.toDataURL('image/jpeg', 0.9) });
      };
      if (API.capturedFaceBase64) {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(canvas.width / img.width, (canvas.height * 0.8) / img.height);
          ctx.drawImage(img, (canvas.width - img.width * scale) / 2, 50, img.width * scale, img.height * scale);
          finalize();
        };
        img.onerror = finalize;
        img.src = API.capturedFaceBase64;
      } else { finalize(); }
    });
  }
};
