// js/api.js — Flux Kontext with 2G network optimization

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

  // Compress image based on network quality
  // On 2G: JPEG 50% quality (~80-120KB) — fast upload
  // On slow: JPEG 70% quality (~150-200KB)
  // On fast: PNG (lossless, full quality)
  compressForUpload(dataUrl) {
    return new Promise((resolve) => {
      const quality = typeof Network !== 'undefined' ? Network.getUploadQuality() : 0.85;
      const isSlow = typeof Network !== 'undefined' ? Network.isSlow() : false;

      // If already JPEG or slow network — re-encode at appropriate quality
      if (isSlow || dataUrl.startsWith('data:image/jpeg')) {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const compressed = canvas.toDataURL('image/jpeg', quality);
          const origKB = Math.round((dataUrl.length * 0.75) / 1024);
          const compKB = Math.round((compressed.length * 0.75) / 1024);
          console.log(`Compressed: ${origKB}KB → ${compKB}KB (quality: ${quality})`);
          resolve(compressed);
        };
        img.onerror = () => resolve(dataUrl);
        img.src = dataUrl;
      } else {
        // Fast network — use original PNG
        resolve(dataUrl);
      }
    });
  },

  async pollKontext(statusUrl, responseUrl, onProgress) {
    const pollInterval = typeof Network !== 'undefined' ? Network.getPollInterval() : 3000;
    const maxPolls = typeof Network !== 'undefined' ? Network.getMaxPolls() : 60;
    const isSlow = typeof Network !== 'undefined' ? Network.isSlow() : false;

    for (let i = 0; i < maxPolls; i++) {
      await new Promise(r => setTimeout(r, pollInterval));

      const s = await this.callWorker({ step: 'kontext_status', statusUrl });
      console.log(`Kontext poll ${i + 1}/${maxPolls}: ${s.status}`);

      if (s.status === 'IN_QUEUE') {
        const msg = isSlow
          ? `Creating your scene — queue (${s.queuePosition ?? i})... Slow connection, please wait`
          : `Creating your scene — queue (${s.queuePosition ?? i})...`;
        onProgress?.(msg);
      } else if (s.status === 'IN_PROGRESS') {
        const msg = isSlow ? 'Creating your scene... Slow connection, almost there' : 'Creating your scene...';
        onProgress?.(msg);
      } else if (s.status === 'COMPLETED') {
        const result = await this.callWorker({ step: 'kontext_result', responseUrl });
        return result.resultUrl;
      } else {
        throw new Error('Generation failed with status: ' + s.status);
      }
    }
    const minutes = Math.round((pollInterval * maxPolls) / 60000);
    throw new Error(`Generation timed out after ${minutes} minutes. Please check your connection and try again.`);
  },

  async generatePhoto(prompt, negativePrompt, onProgress, sceneReferenceUrl = null) {
    if (this.isGenerating) {
      return { success: false, error: 'Already running — please wait' };
    }
    this.isGenerating = true;

    try {
      // Detect network quality first
      if (typeof Network !== 'undefined') {
        await Network.detect();
        console.log('Network quality for generation:', Network.quality);
      }

      const isSlow = typeof Network !== 'undefined' ? Network.isSlow() : false;
      const is2G = typeof Network !== 'undefined' ? Network.is2G() : false;

      // STEP 1 — Validate capture
      if (!this.capturedFaceBase64) {
        throw new Error('No photo captured. Please try again.');
      }

      // Network-aware upload message
      if (is2G) {
        onProgress?.('Weak signal detected — compressing photo for upload...');
      } else if (isSlow) {
        onProgress?.('Uploading your photo... (slow connection)');
      } else {
        onProgress?.('Uploading your photo...');
      }

      // Compress based on network
      const uploadDataUrl = await this.compressForUpload(this.capturedFaceBase64);
      const isPng = uploadDataUrl.startsWith('data:image/png');
      const base64 = uploadDataUrl.replace(/^data:image\/\w+;base64,/, '');

      if (!base64) throw new Error('Photo capture failed — empty image. Please try again.');

      const estimatedKB = (base64.length * 0.75) / 1024;
      const minKB = isPng ? 30 : 15;
      if (estimatedKB < minKB) {
        throw new Error(`Photo appears blank (${Math.round(estimatedKB)}KB). Check camera connection and try again.`);
      }

      console.log('Uploading:', Math.round(estimatedKB) + 'KB', isPng ? '(PNG)' : '(JPEG)', '| Network:', typeof Network !== 'undefined' ? Network.quality : 'unknown');

      const uploaded = await this.callWorker({ step: 'upload', base64, isPng });
      if (!uploaded.fileUrl) throw new Error('Upload failed — no URL returned');
      this.faceImageUrl = uploaded.fileUrl;
      console.log('✅ Photo uploaded:', this.faceImageUrl);

      // STEP 2 — Submit Kontext
      const submitMsg = isSlow ? 'Sending to AI... (slow connection, please wait)' : 'Creating your scene...';
      onProgress?.(submitMsg);

      const job = await this.callWorker({
        step: 'kontext_submit',
        prompt: prompt,
        faceImageUrl: this.faceImageUrl,
        sceneReferenceUrl: sceneReferenceUrl || null
      });
      if (sceneReferenceUrl) {
        console.log('Using scene reference:', sceneReferenceUrl);
      }
      if (!job.statusUrl) throw new Error('Scene generation job not created');
      console.log('✅ Kontext job submitted:', job.requestId);

      // STEP 3 — Poll until done
      const pollMsg = isSlow ? 'AI is working... Slow connection — this may take a few minutes' : 'Creating your scene...';
      onProgress?.(pollMsg);
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
