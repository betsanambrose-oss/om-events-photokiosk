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
    return { name: s.eventName || 'OM Events', organizer: s.eventOrganizer || '', date: s.eventDate || '' };
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
          ctx.fillText('OM EVENTS', x, y);
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
        resolve(canvas.toDataURL('image/jpeg', 0.92)); // JPEG for display only — original PNG URL used for download
      };
      img.onerror = () => resolve(imageUrl);
      img.src = imageUrl;
    });
  },

  printImage(imageUrl) {
    const w = window.open('', '_blank');
    if (!w) { alert('Please allow popups to print'); return; }
    w.document.write(`<!DOCTYPE html><html><head><title>OM Events Photo</title>
    <style>*{margin:0;padding:0;box-sizing:border-box;}
    html,body{width:6in;height:4in;overflow:hidden;background:#000;}
    .wrap{width:6in;height:4in;display:flex;align-items:center;justify-content:center;background:#000;}
    img{max-width:6in;max-height:4in;width:auto;height:auto;object-fit:contain;display:block;}
    @media print{@page{size:6in 4in;margin:0;}html,body{width:6in;height:4in;}}
    </style></head><body><div class="wrap">
    <img src="${imageUrl}" onload="window.print();setTimeout(()=>window.close(),1500);"/>
    </div></body></html>`);
    w.document.close();
  }
};
