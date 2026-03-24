# ☕ Dial-In

> A mobile-first espresso dial-in companion for the **Fellow Opus + AVX** — dial in your grind, track your shots, and chase that perfect cup.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![PWA](https://img.shields.io/badge/PWA-installable-5A0FC8?logo=pwa&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![Deploy with Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)

---

## What is Dial-In?

Dialing in espresso means finding the exact grind setting that produces a balanced, delicious shot. Too coarse and the shot runs fast and tastes sour (under-extracted). Too fine and it runs slow and tastes bitter (over-extracted). Dial-In helps you track each attempt, understand what went wrong, and converge on the sweet spot faster.

Built as a **Progressive Web App (PWA)**, it installs on your iPhone like a native app — no browser UI, no app store required.

---

## Features

### 🕒 Shot Timer
Start, stop, and reset a live shot timer with precision to the tenth of a second. Alternatively, enter your shot time manually if you already tracked it elsewhere.

### ⚙️ Grind Position Adjuster
A visual dial lets you set and adjust your grind position across the full 1–12 range of the Fellow Opus. Hold the +/− buttons to sweep quickly, or tap for single-step adjustments.

### 🎯 Dose & Ratio Calculator
Set your dose (14–22 g, default 18 g) and your coffee-to-yield ratio (default 1:2). The app automatically calculates your target yield weight so you know exactly when to stop your shot.

### 🌈 Flavor Profile
After each shot, see a real-time breakdown of four flavor dimensions — **Acidity**, **Sweetness**, **Bitterness**, and **Body** — modeled from your shot time and grind position. Color-coded bars make it easy to see where the shot landed.

### 🩺 Diagnostic Feedback
The app analyses your shot and tells you exactly what to do next:

| Result | Verdict |
|--------|---------|
| Shot < 22 s | Under-extracted — go finer |
| Shot 22–32 s | ✅ Dialed in — enjoy! |
| Shot > 32 s | Over-extracted — go coarser |
| Way too fast / slow | Strong warning with grind-step recommendation |

### 📋 Shot History
The last 6 shots are logged with time, dose, ratio, grind position, and verdict — so you can track your progression without pen and paper.

### 💾 Persistent Settings
All your settings (dose, ratio, grind, last shot time, and history) are saved automatically in local storage. Reload or close the app and everything is right where you left it.

### 📱 Grind Zone Awareness
The app shows which brewing zone your grind currently falls into:

| Zone | Grind Range | Colour |
|------|-------------|--------|
| Too fine | < 8 | Red |
| Espresso | 8 – 20 | Green |
| Moka / AeroPress | 21 – 32 | Blue |
| Filter | 33 – 44 | Grey |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 |
| Build Tool | Vite 5 |
| PWA | vite-plugin-pwa (Workbox, auto-update) |
| Styling | CSS-in-JS (component-scoped) |
| Fonts | Barlow Condensed · IBM Plex Mono (Google Fonts) |
| Storage | Browser `localStorage` |
| Hosting | Vercel |

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Deployment

### Option A — Vercel CLI

```bash
npm install
npx vercel
```

Follow the prompts — Vite is auto-detected and the app is live in seconds.

### Option B — GitHub + Vercel UI

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. Framework will be auto-detected as **Vite**
4. Click **Deploy**

---

## Install on iPhone

Dial-In is a fully installable PWA — no App Store needed.

1. Open your deployed URL in **Safari**
2. Tap the **Share** button (box with arrow)
3. Tap **Add to Home Screen**
4. Launch it from your home screen — it runs full-screen with no browser UI

---

## License

This project is open source. See [LICENSE](LICENSE) for details.
