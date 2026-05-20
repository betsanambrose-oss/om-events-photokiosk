# OM Events — AI Photo Kiosk

AI-powered photo experience. Captures guest face → generates ultra-realistic scene → delivers via QR.

## Tech Stack
- Frontend: Vanilla HTML/CSS/JS (PWA)
- AI: fal.ai (Flux Dev + Advanced Face Swap)
- Backend: Netlify Functions (secure API proxy)
- Hosting: Netlify + GitHub auto-deploy

## Project Structure
```
om-events-photokiosk/
├── index.html                  ← Main kiosk UI (all screens)
├── manifest.json               ← PWA manifest
├── sw.js                       ← Service worker (offline cache)
├── netlify.toml                ← Netlify config
├── css/
│   └── kiosk.css               ← All styles
├── js/
│   ├── app.js                  ← Main state + navigation
│   ├── camera.js               ← Camera handling
│   ├── api.js                  ← fal.ai proxy calls
│   └── qr.js                   ← QR generation + timer
├── templates/
│   └── templates.js            ← All scene prompts
└── netlify/
    └── functions/
        └── generate.js         ← Secure API proxy
```

## Setup

### 1. Environment Variable
In Netlify Dashboard → Site Configuration → Environment Variables:
```
FAL_KEY = your-fal-ai-key-here
```

### 2. Deploy
Every push to `main` branch auto-deploys via Netlify.

### 3. WebView APK
Wrap `https://om-events-photokiosk.netlify.app` using WebIntoApp.com
- Orientation: Landscape
- Full screen: Yes
- Camera permission: Required

## Guest Flow
1. Home → Select category
2. Select scene
3. Camera opens → Face guide → Tap to capture (3 sec countdown)
4. AI generates photo (~20-30 seconds)
5. Result shown + QR code (30 seconds)
6. Auto returns to home

## Output Modes
Set in admin panel (Phase 2):
- `soft` — QR only
- `print` — Auto print only
- `both` — QR (30s) then auto print

## Admin Access
Tap bottom-left corner of home screen 5 times quickly.

## Offline Fallback
When no internet: uses local canvas composite automatically.
No error shown to guest.
