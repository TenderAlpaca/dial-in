# Dial-In

Espresso dial-in tool for Fellow Opus + AVX. PWA — installable on iPhone via Safari.

## Deploy to Vercel

### Option A — Vercel CLI (easiest)
```bash
npm install
npx vercel
```
Follow the prompts, done.

### Option B — GitHub + Vercel UI
1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → Import that repo
3. Framework: Vite (auto-detected)
4. Hit Deploy

## Install on iPhone
1. Open the deployed URL in **Safari**
2. Tap the Share button → **Add to Home Screen**
3. Done — it'll appear as a full-screen app with no browser UI

## Local dev
```bash
npm install
npm run dev
```
