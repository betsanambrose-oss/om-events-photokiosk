// js/settings.js — Shared settings manager

const Settings = {

  KEY: 'om-kiosk-settings',

  load() {
    try {
      const saved = localStorage.getItem(this.KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) { return {}; }
  },

  save(settings) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(settings));
    } catch (e) {}
  },

  getActiveCategories() {
    const s = this.load();
    if (!s.activeCategories || s.activeCategories.length === 0) {
      return TEMPLATES.categories;
    }
    return TEMPLATES.categories.filter(c => s.activeCategories.includes(c.id));
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
    return cat.scenes.filter(scene => s.activeScenes[categoryId].includes(scene.id));
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
    return {
      name: s.eventName || 'OM Events',
      organizer: s.eventOrganizer || '',
      date: s.eventDate || ''
    };
  },

  // ── APPLY OVERLAYS ──
  // OUTPUT IMAGE size from fal.ai is typically ~900×1200px (portrait_4_3)
  // We draw on a canvas matching that, then export for QR + print
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

        // ── 1. Client Frame (full PNG overlay) ──
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

        // ── 2. OM Events watermark ──
        // Reduced to 50% of previous size: was 2.5% of width, now 1.25%
        if (wm.omEnabled) {
          const pos = wm.watermarkPos || 'bottom-left';
          const padding = 16;
          const fontSize = Math.max(10, Math.round(canvas.width * 0.0125)); // 50% smaller

          ctx.save();
          ctx.font = `500 ${fontSize}px Montserrat, Arial`;
          ctx.fillStyle = 'rgba(201, 168, 76, 0.80)';
          ctx.shadowColor = 'rgba(0,0,0,0.9)';
          ctx.shadowBlur = 4;

          let x, y;
          ctx.textBaseline = 'bottom';
          if (pos === 'bottom-left') { x = padding; y = canvas.height - padding; ctx.textAlign = 'left'; }
          else if (pos === 'bottom-right') { x = canvas.width - padding; y = canvas.height - padding; ctx.textAlign = 'right'; }
          else if (pos === 'top-left') { x = padding; y = fontSize + padding; ctx.textAlign = 'left'; ctx.textBaseline = 'top'; }
          else { x = canvas.width - padding; y = fontSize + padding; ctx.textAlign = 'right'; ctx.textBaseline = 'top'; }

          ctx.fillText('OM EVENTS', x, y);
          ctx.restore();
        }

        // ── 3. Client Logo ──
        // Increased to 150% of previous: was 8% height, now 12% height
        if (wm.clientLogo) {
          await new Promise(res => {
            const logoImg = new Image();
            logoImg.onload = () => {
              const logoH = Math.round(canvas.height * 0.12); // was 0.08, now 0.12
              const logoW = Math.round((logoImg.width / logoImg.height) * logoH);
              const lx = canvas.width - logoW - 16;
              const ly = 16;
              ctx.save();
              ctx.globalAlpha = 0.92;
              ctx.drawImage(logoImg, lx, ly, logoW, logoH);
              ctx.restore();
              res();
            };
            logoImg.onerror = res;
            logoImg.src = wm.clientLogo;
          });
        }

        resolve(canvas.toDataURL('image/jpeg', 0.95));
      };

      img.onerror = () => resolve(imageUrl);
      img.src = imageUrl;
    });
  },

  // ── PRINT: Fit image perfectly into 6x4 inches ──
  // Creates a properly sized print canvas — no cropping, no uneven space
  printImage(imageUrl) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print');
      return;
    }

    // 6x4 at 150dpi = 900x600px
    // Image is portrait (4:3) — we rotate/fit it properly
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>OM Events Photo</title>
        <style>
          * { margin:0; padding:0; box-sizing:border-box; }
          html, body {
            width: 6in; height: 4in;
            overflow: hidden;
            background: #ffffff;
          }
          .print-container {
            width: 6in; height: 4in;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #000000;
          }
          img {
            max-width: 6in;
            max-height: 4in;
            width: auto;
            height: auto;
            object-fit: contain;
            display: block;
          }
          @media print {
            @page {
              size: 6in 4in;
              margin: 0;
            }
            html, body { width: 6in; height: 4in; }
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <img src="${imageUrl}" onload="window.print(); setTimeout(()=>window.close(), 1500);"/>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
  }
};
