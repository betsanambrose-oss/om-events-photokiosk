// js/settings.js — Shared settings manager

const Settings = {

  KEY: 'om-kiosk-settings',
  TEMPLATE_VERSION: 'v2-12cats', // bump this when templates change

  load() {
    try {
      const saved = localStorage.getItem(this.KEY);
      if (!saved) return {};
      const s = JSON.parse(saved);

      // Version check — if templates changed, reset category/scene selections
      if (s._templateVersion !== this.TEMPLATE_VERSION) {
        const reset = {
          ...s,
          _templateVersion: this.TEMPLATE_VERSION,
          activeCategories: TEMPLATES.categories.map(c => c.id),
          activeScenes: {}
        };
        this.save(reset);
        return reset;
      }
      return s;
    } catch (e) { return {}; }
  },

  save(settings) {
    try {
      settings._templateVersion = this.TEMPLATE_VERSION;
      localStorage.setItem(this.KEY, JSON.stringify(settings));
    } catch (e) {}
  },

  getActiveCategories() {
    const s = this.load();
    if (!s.activeCategories || s.activeCategories.length === 0) {
      return TEMPLATES.categories;
    }
    const validIds = TEMPLATES.categories.map(c => c.id);
    const filtered = s.activeCategories.filter(id => validIds.includes(id));
    if (filtered.length === 0) return TEMPLATES.categories;
    return TEMPLATES.categories.filter(c => filtered.includes(c.id));
  },

  getActiveCategory() {
    const s = this.load();
    if (!s.activeCategory) return TEMPLATES.categories[0];
    return TEMPLATES.categories.find(c => c.id === s.activeCategory) || TEMPLATES.categories[0];
  },

  getActiveScenes(categoryId) {
    const s = this.load();
    const cat = TEMPLATES.categories.find(c => c.id === categoryId);
    if (!cat) return [];
    if (!s.activeScenes || !s.activeScenes[categoryId]) return cat.scenes;
    const validIds = cat.scenes.map(sc => sc.id);
    const filtered = s.activeScenes[categoryId].filter(id => validIds.includes(id));
    if (filtered.length === 0) return cat.scenes;
    return cat.scenes.filter(scene => filtered.includes(scene.id));
  },

  getMode() { return this.load().mode || 'soft'; },

  // AI provider: 'gemini' (Nano Banana 2, fast, default) or 'openai' (GPT Image 2, backup)
  getProvider() { return this.load().aiProvider || 'gemini'; },

  getWatermark() {
    const s = this.load();
    return {
      omEnabled: s.omWatermark !== false,
      clientFrame: s.clientFrame || null,
      clientLogo: s.clientLogo || null,
      watermarkPos: s.watermarkPos || 'bottom-left'
    };
  },

  getEventInfo() {
    const s = this.load();
    return { name: s.eventName || 'GAME ON', organizer: s.eventOrganizer || '', date: s.eventDate || '' };
  },

  getPrintSettings() {
    const s = this.load();
    return {
      paperSize: s.printPaperSize || '6x4',        // landscape default matches AI output
      orientation: s.printOrientation || 'landscape', // landscape to match 4:3 AI output
      colorMode: s.printColor || 'color',
      borderless: s.printBorderless !== false,
      printBrightness: (s.printBrightness != null ? s.printBrightness : 7)  // % lift to compensate for darker prints
    };
  },

  async applyOverlays(imageUrl) {
    const wm = this.getWatermark();
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = async () => {
        // Use native resolution — fal.ai PNG is already high quality
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        if (wm.clientFrame) {
          await new Promise(res => {
            const fi = new Image();
            fi.onload = () => { ctx.drawImage(fi, 0, 0, canvas.width, canvas.height); res(); };
            fi.onerror = res;
            fi.src = wm.clientFrame;
          });
        }
        if (wm.omEnabled) {
          const pos = wm.watermarkPos || 'bottom-left';
          const pad = 16;
          const fs = Math.max(10, Math.round(canvas.width * 0.0125));
          ctx.save();
          ctx.font = `500 ${fs}px Montserrat, Arial`;
          ctx.fillStyle = 'rgba(201,168,76,0.80)';
          ctx.shadowColor = 'rgba(0,0,0,0.9)';
          ctx.shadowBlur = 4;
          ctx.textBaseline = 'bottom';
          let x, y;
          if (pos === 'bottom-left') { x = pad; y = canvas.height - pad; ctx.textAlign = 'left'; }
          else if (pos === 'bottom-right') { x = canvas.width - pad; y = canvas.height - pad; ctx.textAlign = 'right'; }
          else if (pos === 'top-left') { x = pad; y = fs + pad; ctx.textAlign = 'left'; ctx.textBaseline = 'top'; }
          else { x = canvas.width - pad; y = fs + pad; ctx.textAlign = 'right'; ctx.textBaseline = 'top'; }
          ctx.fillText('GAME ON', x, y);
          ctx.restore();
        }
        if (wm.clientLogo) {
          await new Promise(res => {
            const li = new Image();
            li.onload = () => {
              const lh = Math.round(canvas.height * 0.12);
              const lw = Math.round((li.width / li.height) * lh);
              ctx.save();
              ctx.globalAlpha = 0.92;
              ctx.drawImage(li, canvas.width - lw - 16, 16, lw, lh);
              ctx.restore();
              res();
            };
            li.onerror = res;
            li.src = wm.clientLogo;
          });
        }
        resolve(canvas.toDataURL('image/jpeg', 0.95)); // branded image — used for display, QR download, and print
      };
      img.onerror = () => resolve(imageUrl);
      img.src = imageUrl;
    });
  },

  printImage(imageUrl) {
    const ps = this.getPrintSettings();

    // ── Print colour compensation ──
    // Paper is reflective, screens are backlit, so prints look darker than the
    // on-screen / QR-download image. We lift brightness (and a touch of saturation
    // and contrast) ONLY on the print path — the R2 image the QR points to is
    // untouched, so the download keeps its original colour.
    // Configurable in admin (printBrightness as a %, default 7). Set 0 to disable.
    const brightnessPct = (ps.printBrightness != null ? ps.printBrightness : 7);
    const b = 1 + (brightnessPct / 100);          // e.g. 7% -> 1.07
    const sat = 1 + (brightnessPct / 100) * 0.6;   // gentle saturation lift alongside
    const con = 1 + (brightnessPct / 100) * 0.3;   // slight contrast so it doesn't wash out

    const filters = [];
    if (ps.colorMode === 'grayscale') filters.push('grayscale(100%)');
    if (brightnessPct > 0) {
      filters.push(`brightness(${b.toFixed(3)})`);
      filters.push(`saturate(${sat.toFixed(3)})`);
      filters.push(`contrast(${con.toFixed(3)})`);
    }
    const filterCss = filters.length ? `filter: ${filters.join(' ')}; -webkit-filter: ${filters.join(' ')};` : '';

    // 6x4 landscape photo paper — fixed for the booth
    const pw = '6in';
    const ph = '4in';
    const margin = ps.borderless !== false ? '0' : '3mm';

    // SILENT KIOSK PRINTING via hidden iframe (no new tab, no redirect).
    // When Chrome is launched with --kiosk-printing, iframe.print() sends
    // directly to the Windows DEFAULT printer using its saved settings —
    // no print dialog appears. The page stays on the result screen.

    // Remove any previous print iframe
    const existing = document.getElementById('kiosk-print-frame');
    if (existing) existing.remove();

    const iframe = document.createElement('iframe');
    iframe.id = 'kiosk-print-frame';
    iframe.style.cssText = 'position:fixed; right:0; bottom:0; width:0; height:0; border:0; opacity:0; pointer-events:none;';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`<!DOCTYPE html><html><head>
    <title>GAME ON Photo</title>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
      html, body { width:${pw}; height:${ph}; overflow:hidden; background:#000; }
      .wrap { width:${pw}; height:${ph}; display:flex; align-items:center; justify-content:center; background:#000; }
      img { width:100%; height:100%; object-fit:cover; display:block; ${filterCss} }
      @media print {
        @page { size: ${pw} ${ph} landscape; margin: ${margin}; }
        html, body { width:${pw}; height:${ph}; }
        /* Re-apply the same filter inside print media and force colour-accurate output */
        img { width:100%; height:100%; object-fit:cover; ${filterCss} -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    </style></head><body>
    <div class="wrap"><img id="pimg" src="${imageUrl}" /></div>
    </body></html>`);
    doc.close();

    // Wait for the image to load inside the iframe, then print
    const img = doc.getElementById('pimg');
    const doPrint = () => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch (e) {
        console.error('Print failed:', e);
      }
      // Clean up the iframe after the print job is handed off
      setTimeout(() => { iframe.remove(); }, 2000);
    };

    if (img) {
      if (img.complete) {
        setTimeout(doPrint, 200);
      } else {
        img.onload = () => setTimeout(doPrint, 200);
        img.onerror = () => { console.error('Print image failed to load'); iframe.remove(); };
      }
    } else {
      setTimeout(doPrint, 400);
    }
  }
};
