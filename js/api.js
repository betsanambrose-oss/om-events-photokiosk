// js/api.js — OpenAI GPT Image 2 direct (synchronous, no polling) with 2G network optimization

const WORKER_URL = 'https://om-events-proxy.betsanambrose.workers.dev';

const API = {
  capturedFaceBase64: null,
  isGenerating: false,

  setCapturedFace(dataUrl) {
    this.capturedFaceBase64 = dataUrl;
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
      const is2G = typeof Network !== 'undefined' ? Network.is2G() : false;

      const img = new Image();
      img.onload = () => {
        // Preserve face detail — send at 2048px so the AI has enough real
        // facial pixels to lock identity. Downscaling to 1280 was destroying
        // face detail (full-body shots left faces ~100px → AI painted a new face).
        // On very weak 2G, drop to 1600px to keep upload manageable.
        const MAX_DIM = is2G ? 1600 : 2048;
        let w = img.width;
        let h = img.height;
        if (w > MAX_DIM || h > MAX_DIM) {
          const scale = MAX_DIM / Math.max(w, h);
          w = Math.round(w * scale);
          h = Math.round(h * scale);
        }

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, w, h);

        // JPEG 94% at 2048px = ~400-800KB — preserves face detail for identity
        // 2G: slightly lower quality for faster upload
        const quality = is2G ? 0.82 : 0.94;
        const result = canvas.toDataURL('image/jpeg', quality);

        const origKB = Math.round((dataUrl.length * 0.75) / 1024);
        const resultKB = Math.round((result.length * 0.75) / 1024);
        console.log(`Upload: ${origKB}KB → ${resultKB}KB (${w}×${h} JPEG ${quality})`);
        resolve(result);
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  },

  async generatePhoto(prompt, negativePrompt, onProgress, sceneReferenceUrl = null, sceneMeta = {}) {
    if (this.isGenerating) {
      return { success: false, error: 'Already running — please wait' };
    }
    this.isGenerating = true;
    // Store meta for the branded upload that happens after overlays
    this._currentPhotoId = 'ph_' + Date.now();
    this._currentSceneName = sceneMeta.sceneName || '';
    this._currentCategoryName = sceneMeta.categoryName || '';

    try {
      // Detect network quality for adaptive compression
      if (typeof Network !== 'undefined') {
        await Network.detect();
        console.log('Network quality:', Network.quality);
      }

      const isSlow = typeof Network !== 'undefined' ? Network.isSlow() : false;
      const is2G = typeof Network !== 'undefined' ? Network.is2G() : false;

      // STEP 1 — Validate capture
      if (!this.capturedFaceBase64) {
        throw new Error('No photo captured. Please try again.');
      }

      // STEP 2 — Compress guest photo for upload
      if (is2G) {
        onProgress?.('Weak signal — compressing photo...');
      } else if (isSlow) {
        onProgress?.('Preparing your photo... (slow connection)');
      } else {
        onProgress?.('Preparing your photo...');
      }

      const uploadDataUrl = await this.compressForUpload(this.capturedFaceBase64);
      const guestBase64 = uploadDataUrl.replace(/^data:image\/\w+;base64,/, '');
      if (!guestBase64) throw new Error('Photo capture failed — empty image. Please try again.');

      const estimatedKB = (guestBase64.length * 0.75) / 1024;
      if (estimatedKB < 15) {
        throw new Error(`Photo appears blank (${Math.round(estimatedKB)}KB). Check camera and try again.`);
      }

      // STEP 3 — Build scene reference URLs array
      const sceneUrls = [];
      if (Array.isArray(sceneReferenceUrl)) {
        sceneUrls.push(...sceneReferenceUrl);
      } else if (sceneReferenceUrl) {
        sceneUrls.push(sceneReferenceUrl);
      }
      if (sceneUrls.length > 0) console.log('Scene references:', sceneUrls);

      // STEP 4 — Get active event info for R2 storage
      const eventInfo = typeof Tracker !== 'undefined' ? Tracker.getActiveEvent() : null;

      // STEP 5 — Single synchronous call to OpenAI (no polling!)
      const genMsg = isSlow ? 'Creating your scene... (slow connection, please wait)' : 'Creating your scene...';
      onProgress?.(genMsg);

      const result = await this.callWorker({
        step: 'generate',
        guestBase64,
        faceCropBase64: sceneMeta.faceCropBase64 || null,
        isReferenceScene: sceneMeta.isReferenceScene || false,
        sceneUrls,
        prompt,
        provider: (typeof Settings !== 'undefined' ? Settings.getProvider() : 'gemini')
      });

      // Worker returns the raw AI image as base64 (no R2 save yet).
      // app.js will apply frame/logo/watermark overlays, then call
      // API.uploadBranded() to store the FINAL branded image in R2 for the QR.
      if (!result.resultB64) throw new Error('No result image returned');

      const imageUrl = 'data:image/jpeg;base64,' + result.resultB64;
      this._lastProvider = result.provider || 'gemini';
      console.log('✅ Raw image received — provider:', result.provider);

      // Return raw base64 for display + branding. shareUrl comes after branded upload.
      return { success: true, imageUrl, rawB64: result.resultB64 };

    } catch (err) {
      console.error('❌ FAILED:', err.message);
      return { success: false, error: err.message };
    } finally {
      this.isGenerating = false;
    }
  },

  // Upload the FINAL branded image (frame + logo + watermark already applied) to R2.
  // Called by app.js after overlays are applied. Returns the permanent R2 URL for the QR.
  // brandedDataUrl: a 'data:image/jpeg;base64,...' string of the branded image.
  async uploadBranded(brandedDataUrl, sceneMeta = {}) {
    try {
      const eventInfo = typeof Tracker !== 'undefined' ? Tracker.getActiveEvent() : null;
      if (!eventInfo) {
        console.log('⚠️ No active event — branded image not stored');
        return null;
      }

      const brandedB64 = brandedDataUrl.replace(/^data:image\/\w+;base64,/, '');
      if (!brandedB64) return null;

      const res = await this.callWorker({
        step: 'upload_branded',
        brandedB64,
        eventId: eventInfo.id,
        eventName: eventInfo.name,
        photoId: this._currentPhotoId || ('ph_' + Date.now()),
        sceneName: sceneMeta.sceneName || this._currentSceneName || '',
        categoryName: sceneMeta.categoryName || this._currentCategoryName || '',
        provider: this._lastProvider || ''
      });

      if (res.resultUrl) {
        this._lastR2Url = res.resultUrl;
        console.log('✅ Branded image stored:', res.resultUrl);
        return res.resultUrl;
      }
      console.warn('Branded upload returned no URL:', res.warning || '');
      return null;
    } catch (err) {
      console.warn('uploadBranded failed (non-critical):', err.message);
      return null;
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
        ctx.fillStyle = '#F6020C'; ctx.font = 'bold 24px Georgia';
        ctx.textAlign = 'center';
        ctx.fillText('GAME ON — Offline Mode', canvas.width / 2, canvas.height - 35);
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
