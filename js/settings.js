// js/settings.js — Shared settings manager between admin and kiosk

const Settings = {

  KEY: 'om-kiosk-settings',

  // Load all settings
  load() {
    try {
      const saved = localStorage.getItem(this.KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  },

  // Save all settings
  save(settings) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(settings));
    } catch (e) {}
  },

  // Get active category from settings
  getActiveCategory() {
    const s = this.load();
    if (!s.activeCategory) return TEMPLATES.categories[0];
    return TEMPLATES.categories.find(c => c.id === s.activeCategory) || TEMPLATES.categories[0];
  },

  // Get active scenes for a category
  getActiveScenes(categoryId) {
    const s = this.load();
    const cat = TEMPLATES.categories.find(c => c.id === categoryId);
    if (!cat) return [];
    if (!s.activeScenes || !s.activeScenes[categoryId]) return cat.scenes;
    return cat.scenes.filter(scene => s.activeScenes[categoryId].includes(scene.id));
  },

  // Get output mode
  getMode() {
    return this.load().mode || 'soft';
  },

  // Get watermark settings
  getWatermark() {
    const s = this.load();
    return {
      omEnabled: s.omWatermark !== false,
      clientFrame: s.clientFrame || null,       // PNG frame overlay
      clientLogo: s.clientLogo || null,         // Small logo
      watermarkPos: s.watermarkPos || 'bottom-left'
    };
  },

  // Get event info
  getEventInfo() {
    const s = this.load();
    return {
      name: s.eventName || 'OM Events',
      organizer: s.eventOrganizer || '',
      date: s.eventDate || ''
    };
  },

  // Apply watermark + frame to a canvas image
  // Returns a new data URL with overlays applied
  async applyOverlays(imageUrl) {
    const wm = this.getWatermark();

    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Apply client frame (full PNG overlay - acts as frame/border)
        if (wm.clientFrame) {
          await new Promise(res => {
            const frameImg = new Image();
            frameImg.onload = () => {
              ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
              res();
            };
            frameImg.onerror = res;
            frameImg.src = wm.clientFrame;
          });
        }

        // Apply OM Events watermark text
        if (wm.omEnabled) {
          const pos = wm.watermarkPos || 'bottom-left';
          const padding = 20;
          const fontSize = Math.max(16, canvas.width * 0.025);

          ctx.font = `${fontSize}px Montserrat, Arial`;
          ctx.fillStyle = 'rgba(201, 168, 76, 0.85)';
          ctx.textBaseline = 'bottom';

          let x, y;
          if (pos === 'bottom-left') { x = padding; y = canvas.height - padding; ctx.textAlign = 'left'; }
          else if (pos === 'bottom-right') { x = canvas.width - padding; y = canvas.height - padding; ctx.textAlign = 'right'; }
          else if (pos === 'top-left') { x = padding; y = fontSize + padding; ctx.textAlign = 'left'; ctx.textBaseline = 'top'; }
          else { x = canvas.width - padding; y = fontSize + padding; ctx.textAlign = 'right'; ctx.textBaseline = 'top'; }

          // Shadow for readability
          ctx.shadowColor = 'rgba(0,0,0,0.8)';
          ctx.shadowBlur = 6;
          ctx.fillText('OM EVENTS', x, y);
          ctx.shadowBlur = 0;
        }

        // Apply small client logo (separate from frame)
        if (wm.clientLogo) {
          await new Promise(res => {
            const logoImg = new Image();
            logoImg.onload = () => {
              const logoH = canvas.height * 0.08;
              const logoW = (logoImg.width / logoImg.height) * logoH;
              const lx = canvas.width - logoW - 20;
              const ly = 20;
              ctx.globalAlpha = 0.9;
              ctx.drawImage(logoImg, lx, ly, logoW, logoH);
              ctx.globalAlpha = 1;
              res();
            };
            logoImg.onerror = res;
            logoImg.src = wm.clientLogo;
          });
        }

        resolve(canvas.toDataURL('image/jpeg', 0.95));
      };

      img.onerror = () => resolve(imageUrl); // fallback: return original
      img.src = imageUrl;
    });
  }
};
