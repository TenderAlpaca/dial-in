import { useState, useEffect, useRef } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700&family=IBM+Plex+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  button {
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    touch-action: manipulation;
  }

  :root {
    --chrome:       #b8c4d0;
    --chrome-bright:#dce8f4;
    --chrome-dim:   #5a6672;
    --bg:           #0b0c0e;
    --surface:      #131518;
    --surface2:     #1a1c20;
    --surface3:     #222428;
    --border:       #2a2d32;
    --border-bright:#3a3f46;
    --text:         #c8d0da;
    --muted:        #525a64;
    --red:          #d45a4a;
    --green:        #4ab87a;
    --yellow:       #c8a84a;
    --blue:         #5a8ad4;
  }

  body { background: var(--bg); }

  .app {
    background: var(--bg);
    min-height: 100vh;
    color: var(--text);
    font-family: 'IBM Plex Mono', monospace;
    padding: 0 0 60px;
    max-width: 480px;
    margin: 0 auto;
    position: relative;
    overflow-x: hidden;
  }

  /* subtle metal texture overlay */
  .app::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
  }

  .app > * { position: relative; z-index: 1; }

  /* HEADER */
  .header {
    padding: calc(36px + env(safe-area-inset-top)) 20px 28px;
    text-align: center;
    position: relative;
    background: linear-gradient(180deg, #1a1c20 0%, transparent 100%);
    border-bottom: 1px solid var(--border);
  }

  .header-eyebrow {
    font-size: 0.58rem;
    letter-spacing: 0.28em;
    color: var(--chrome-dim);
    text-transform: uppercase;
    margin-bottom: 10px;
    font-family: 'IBM Plex Mono', monospace;
    font-weight: 300;
  }

  .header-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: clamp(3rem, 12vw, 4.5rem);
    font-weight: 700;
    color: var(--chrome-bright);
    line-height: 0.9;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    /* chrome engraved effect */
    text-shadow:
      0 1px 0 #ffffff18,
      0 -1px 0 #00000060;
  }

  .header-sub {
    font-size: 0.58rem;
    color: var(--muted);
    letter-spacing: 0.2em;
    margin-top: 10px;
    text-transform: uppercase;
  }

  /* SECTIONS */
  .section {
    padding: 20px 16px 0;
  }

  .section-label {
    font-size: 0.52rem;
    letter-spacing: 0.22em;
    color: var(--chrome-dim);
    text-transform: uppercase;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
  }
  .section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, var(--border-bright), transparent);
  }

  /* SHOT TIMER HERO */
  .timer-hero {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px 20px;
    text-align: center;
    position: relative;
    overflow: hidden;
    /* inset bevel like machine body panels */
    box-shadow: inset 0 1px 0 #ffffff08, inset 0 -1px 0 #00000040;
  }

  .timer-hero::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #ffffff14, transparent);
  }

  .timer-display {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 5.5rem;
    font-weight: 300;
    line-height: 1;
    letter-spacing: 0.06em;
    transition: color 0.4s;
    position: relative;
  }

  .timer-display.idle      { color: var(--muted); }
  .timer-display.running   { color: var(--chrome-bright); animation: pulse-chrome 1s ease-in-out infinite; }
  .timer-display.done-good { color: var(--green); }
  .timer-display.done-fast { color: var(--yellow); }
  .timer-display.done-slow { color: var(--red); }

  @keyframes pulse-chrome {
    0%, 100% { text-shadow: 0 0 20px #b8c4d044; }
    50%       { text-shadow: 0 0 40px #dce8f488; }
  }

  .timer-unit {
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    color: var(--muted);
    margin-top: 4px;
    text-transform: uppercase;
  }

  /* round AVX-style start/stop button */
  .timer-btn {
    margin-top: 20px;
    width: 100%;
    height: 56px;
    border-radius: 28px;
    border: 1px solid;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.15s;
    -webkit-tap-highlight-color: transparent;
    position: relative;
    overflow: hidden;
  }

  .timer-btn.start {
    background: var(--surface2);
    border-color: var(--border-bright);
    color: var(--chrome);
    box-shadow: inset 0 1px 0 #ffffff0a, 0 2px 8px #00000040;
  }
  .timer-btn.start:active {
    background: var(--surface3);
    box-shadow: inset 0 2px 4px #00000060;
  }

  .timer-btn.stop {
    background: #1f0e0e;
    border-color: var(--red);
    color: #ff8a7a;
    animation: border-pulse-red 0.8s ease-in-out infinite;
  }

  .timer-btn.reset {
    background: var(--surface);
    border-color: var(--border);
    color: var(--muted);
    font-size: 0.6rem;
    height: 40px;
    border-radius: 20px;
    margin-top: 8px;
  }

  @keyframes border-pulse-red {
    0%, 100% { box-shadow: 0 0 0 0 #d45a4a22; }
    50%       { box-shadow: 0 0 0 5px #d45a4a00; }
  }

  /* EXTRACTION BAR */
  .extraction-wrap { margin-top: 16px; }

  .extraction-track {
    height: 5px;
    background: var(--surface3);
    border-radius: 3px;
    position: relative;
    overflow: hidden;
    box-shadow: inset 0 1px 2px #00000040;
  }

  .extraction-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.1s linear, background 0.4s;
    position: relative;
  }
  .extraction-fill::after {
    content: '';
    position: absolute;
    right: 0; top: 0;
    width: 16px; height: 100%;
    background: linear-gradient(90deg, transparent, #ffffff44);
    border-radius: 3px;
  }

  .extraction-zones {
    display: flex;
    justify-content: space-between;
    margin-top: 6px;
    font-size: 0.5rem;
    color: var(--muted);
    letter-spacing: 0.08em;
  }

  /* STEPPER — round ends like AVX knobs */
  .stepper {
    display: flex;
    align-items: center;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 34px;
    overflow: hidden;
    height: 68px;
    box-shadow: inset 0 1px 0 #ffffff06, 0 2px 6px #00000030;
  }

  .step-btn {
    background: none;
    border: none;
    color: var(--chrome);
    font-size: 1.5rem;
    width: 68px;
    height: 68px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    transition: background 0.1s, color 0.1s;
    flex-shrink: 0;
    font-weight: 300;
  }
  .step-btn:active { background: var(--surface3); color: var(--chrome-bright); }
  .step-btn:disabled { color: var(--border); }

  .step-val {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
  }

  .step-num {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 2.2rem;
    font-weight: 600;
    color: var(--chrome-bright);
    line-height: 1;
    letter-spacing: 0.02em;
  }

  .step-unit {
    font-size: 0.52rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-family: 'IBM Plex Mono', monospace;
  }

  /* RATIO GRID */
  .ratio-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .ratio-btn {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    color: var(--muted);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.68rem;
    padding: 15px 10px;
    cursor: pointer;
    transition: all 0.15s;
    text-align: center;
    -webkit-tap-highlight-color: transparent;
    box-shadow: inset 0 1px 0 #ffffff06;
  }
  .ratio-btn:active { background: var(--surface3); }
  .ratio-btn.active {
    border-color: var(--border-bright);
    color: var(--chrome-bright);
    background: var(--surface2);
    box-shadow: inset 0 1px 0 #ffffff10, 0 0 12px #b8c4d018;
  }

  .ratio-name {
    display: block;
    font-size: 0.56rem;
    opacity: 0.5;
    margin-top: 4px;
  }

  /* STATS */
  .stats-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
  }

  .stat {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 14px 8px;
    text-align: center;
    box-shadow: inset 0 1px 0 #ffffff06;
  }

  .stat-val {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.7rem;
    font-weight: 600;
    color: var(--chrome-bright);
    line-height: 1;
    margin-bottom: 5px;
    letter-spacing: 0.02em;
  }

  .stat-lbl {
    font-size: 0.52rem;
    color: var(--muted);
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  /* GRIND DIAL RULER */
  .dial-wrap {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 34px;
    overflow: hidden;
    height: 72px;
    display: flex;
    align-items: center;
    box-shadow: inset 0 1px 0 #ffffff06, 0 2px 6px #00000030;
    margin-bottom: 18px;
    position: relative;
  }
  .dial-ruler-wrap {
    flex: 1;
    overflow: hidden;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
  }
  .dial-ruler-wrap::before {
    content: '';
    position: absolute;
    left: 50%; top: 8px; bottom: 8px;
    width: 2px;
    background: var(--chrome-bright);
    transform: translateX(-50%);
    z-index: 2;
    border-radius: 1px;
    box-shadow: 0 0 6px var(--chrome)88;
  }
  .dial-ruler-wrap::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg,
      var(--surface) 0%, transparent 28%,
      transparent 72%, var(--surface) 100%
    );
    z-index: 3;
    pointer-events: none;
  }
  .dial-ruler {
    display: flex;
    align-items: flex-end;
    height: 100%;
    padding-bottom: 10px;
    transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
    will-change: transform;
  }
  .dial-tick {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    width: 14px;
    flex-shrink: 0;
  }
  .dial-tick-mark {
    width: 1.5px;
    border-radius: 1px;
    background: var(--border-bright);
    margin-bottom: 4px;
    height: 8px;
  }
  .dial-tick.major .dial-tick-mark {
    width: 2px;
    background: var(--chrome-dim);
    height: 18px;
  }
  .dial-tick.current .dial-tick-mark {
    background: var(--chrome-bright);
    box-shadow: 0 0 4px var(--chrome)88;
    height: 22px;
    width: 2px;
  }
  .dial-tick-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 0.68rem;
    font-weight: 600;
    color: var(--chrome-dim);
    letter-spacing: 0.02em;
    margin-bottom: 2px;
    user-select: none;
    line-height: 1;
  }
  .dial-tick.current .dial-tick-label {
    color: var(--chrome-bright);
  }
  .dial-zone-badge {
    position: absolute;
    top: 9px;
    right: 74px;
    font-size: 0.46rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-family: 'IBM Plex Mono', monospace;
    z-index: 4;
    opacity: 0.75;
  }

  /* GRIND BAR */
  .grind-bar {
    height: 12px;
    border-radius: 6px;
    background: linear-gradient(90deg,
      #6a2a2a 0%, #6a2a2a 11%,
      #1e4a2a 12%, #1e4a2a 38%,
      #1e2e5a 39%, #1e2e5a 64%,
      #1a2028 65%, #1a2028 100%
    );
    position: relative;
    margin-bottom: 6px;
    box-shadow: inset 0 1px 3px #00000060;
  }

  .grind-needle {
    position: absolute;
    top: -6px;
    width: 3px;
    height: 24px;
    background: var(--chrome-bright);
    border-radius: 2px;
    transform: translateX(-50%);
    transition: left 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 0 8px var(--chrome)88;
  }

  .grind-zone-row {
    display: flex;
    justify-content: space-between;
    margin-top: 12px;
  }

  .gz { display: flex; flex-direction: column; align-items: center; gap: 2px; }
  .gz-name { font-size: 0.56rem; }
  .gz-range { font-size: 0.5rem; color: var(--muted); }

  /* FLAVOR */
  .flavor-wrap {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 18px;
    box-shadow: inset 0 1px 0 #ffffff06;
  }

  .flavor-row { display: flex; flex-direction: column; gap: 12px; }

  .flavor-item { display: flex; align-items: center; gap: 10px; }

  .flavor-label {
    font-size: 0.55rem;
    color: var(--muted);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    width: 70px;
    flex-shrink: 0;
  }

  .flavor-bar-bg {
    flex: 1;
    height: 5px;
    background: var(--surface3);
    border-radius: 3px;
    overflow: hidden;
    box-shadow: inset 0 1px 2px #00000040;
  }

  .flavor-bar-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.5s;
  }

  .flavor-val {
    font-size: 0.58rem;
    color: var(--chrome);
    width: 28px;
    text-align: right;
    flex-shrink: 0;
  }

  /* HISTORY */
  .history-wrap { display: flex; flex-direction: column; gap: 8px; }

  .history-empty {
    font-size: 0.6rem;
    color: var(--muted);
    text-align: center;
    padding: 20px;
    border: 1px dashed var(--border);
    border-radius: 12px;
    letter-spacing: 0.08em;
  }

  .history-item {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    animation: slide-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: inset 0 1px 0 #ffffff06;
  }

  @keyframes slide-in {
    from { transform: translateY(-8px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }

  .history-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

  .history-info { flex: 1; }

  .history-primary { font-size: 0.68rem; color: var(--text); margin-bottom: 2px; }

  .history-secondary { font-size: 0.55rem; color: var(--muted); letter-spacing: 0.06em; }

  .history-verdict { font-size: 0.55rem; letter-spacing: 0.08em; text-transform: uppercase; text-align: right; }

  .history-clear {
    background: none;
    border: 1px solid var(--border);
    border-radius: 20px;
    color: var(--muted);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.56rem;
    padding: 8px 16px;
    cursor: pointer;
    letter-spacing: 0.1em;
    -webkit-tap-highlight-color: transparent;
    align-self: flex-end;
    text-transform: uppercase;
  }
  .history-clear:active { background: var(--surface2); }

  /* DIAGNOSIS */
  .diag {
    margin: 0 16px;
    border-radius: 14px;
    padding: 22px 20px;
    border: 1px solid;
    transition: all 0.4s;
    position: relative;
    overflow: hidden;
    box-shadow: inset 0 1px 0 #ffffff08;
  }

  .diag::before {
    content: '';
    position: absolute;
    top: -30px; right: -30px;
    width: 120px; height: 120px;
    border-radius: 50%;
    opacity: 0.05;
  }

  .diag.good   { background: #071a0e; border-color: #1e4a2e; color: var(--green); }
  .diag.good::before { background: var(--green); }
  .diag.under  { background: #1a1508; border-color: #4a3a18; color: var(--yellow); }
  .diag.under::before { background: var(--yellow); }
  .diag.over   { background: #1a0808; border-color: #4a1818; color: var(--red); }
  .diag.over::before { background: var(--red); }
  .diag.wayoff { background: #08091a; border-color: #18184a; color: var(--blue); }
  .diag.wayoff::before { background: var(--blue); }

  .diag-icon { font-size: 1.5rem; margin-bottom: 10px; }

  .diag-title {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 8px;
    line-height: 1.1;
  }

  .diag-text { font-size: 0.66rem; line-height: 1.9; opacity: 0.9; }

  .diag-action {
    margin-top: 14px;
    padding: 12px 14px;
    border-radius: 8px;
    font-size: 0.63rem;
    line-height: 1.8;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
  }

  /* STEAM */
  .steam-wrap {
    display: flex;
    justify-content: center;
    gap: 6px;
    height: 32px;
    align-items: flex-end;
    margin-bottom: 8px;
  }

  .steam {
    width: 3px;
    border-radius: 2px;
    background: linear-gradient(to top, #b8c4d044, transparent);
    animation: steam-rise 1.5s ease-in-out infinite;
    transform-origin: bottom;
  }
  .steam:nth-child(2) { animation-delay: 0.3s; height: 16px; }
  .steam:nth-child(1) { animation-delay: 0.6s; height: 12px; }
  .steam:nth-child(3) { animation-delay: 0.1s; height: 20px; }

  @keyframes steam-rise {
    0%   { transform: scaleY(0.3) translateY(0);    opacity: 0; }
    50%  { opacity: 1; }
    100% { transform: scaleY(1.2) translateY(-8px); opacity: 0; }
  }

  /* MODE TOGGLE */
  .mode-toggle {
    display: flex;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 28px;
    padding: 4px;
    margin-bottom: 16px;
    gap: 4px;
  }
  .mode-btn {
    flex: 1;
    height: 36px;
    border: none;
    border-radius: 24px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.58rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    -webkit-tap-highlight-color: transparent;
  }
  .mode-btn.inactive { background: transparent; color: var(--muted); }
  .mode-btn.active-mode {
    background: var(--surface3);
    border: 1px solid var(--border-bright);
    color: var(--chrome-bright);
    box-shadow: inset 0 1px 0 #ffffff0a, 0 0 8px #b8c4d014;
  }

  /* MANUAL INPUT */
  .manual-input-wrap {
    display: flex;
    align-items: center;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 34px;
    overflow: hidden;
    height: 68px;
    margin-bottom: 16px;
    box-shadow: inset 0 1px 0 #ffffff06, 0 2px 6px #00000030;
  }
  .manual-step-btn {
    background: none;
    border: none;
    color: var(--chrome);
    font-size: 1.5rem;
    width: 68px;
    height: 68px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    transition: background 0.1s, color 0.1s;
    flex-shrink: 0;
    font-weight: 300;
  }
  .manual-step-btn:active { background: var(--surface3); color: var(--chrome-bright); }
  .manual-step-btn:disabled { color: var(--border); }
  .manual-val {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
  }
  .manual-num {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 2.2rem;
    font-weight: 600;
    color: var(--chrome-bright);
    line-height: 1;
    letter-spacing: 0.02em;
  }
  .manual-unit {
    font-size: 0.52rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .manual-log-btn {
    width: 100%;
    height: 48px;
    border-radius: 24px;
    border: 1px solid var(--border-bright);
    background: var(--surface2);
    color: var(--chrome);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.63rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.15s;
    -webkit-tap-highlight-color: transparent;
    box-shadow: inset 0 1px 0 #ffffff0a;
  }
  .manual-log-btn:active {
    background: var(--surface3);
    box-shadow: inset 0 2px 4px #00000050;
  }

  /* DIVIDER */
  .divider {
    height: 1px;
    margin: 24px 16px 0;
    background: linear-gradient(90deg, transparent, var(--border-bright), transparent);
  }

  .footer {
    text-align: center;
    padding: 28px 20px 0;
    font-size: 0.52rem;
    color: var(--border-bright);
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }
`;

const RATIOS = [
  { label: "1:1.5", name: "Ristretto", value: 1.5 },
  { label: "1:2",   name: "Normale",   value: 2   },
  { label: "1:2.5", name: "Lungo",     value: 2.5 },
  { label: "1:3",   name: "Extra",     value: 3   },
];

// Grind: index 0-44, display = 1 + index/4 (so 0=1, 4=2, 8=3 ... 44=12)
// 3 sub-ticks between each number = 45 total selectable positions
const GRIND_TOTAL = 45;
const idxToDisplay = i => 1 + i / 4; // 1.00 to 12.00
const fmtGrind = i => {
  const v = idxToDisplay(i);
  return Number.isInteger(v) ? v.toString() : v.toFixed(2).replace(/\.?0+$/, '');
};

const GRIND_ZONES = [
  { name: "Too fine",  range: [0,  7],  color: "#c06a6a" },
  { name: "Espresso",  range: [8,  20], color: "#6abd7a" },
  { name: "Moka/Aero", range: [21, 32], color: "#6a8abd" },
  { name: "Filter",    range: [33, 44], color: "#6a8a9a" },
];

function getZone(g) {
  return GRIND_ZONES.find(z => g >= z.range[0] && g <= z.range[1]);
}

// Map 0-44 index to 0-40 for flavor/diag logic continuity
function grindTo40(g) { return g * 40 / 44; }

function getFlavorProfile(shotTime, grindIdx) {
  const grind = grindTo40(grindIdx);
  const timeFactor  = (shotTime - 27) / 18;
  const grindFactor = (grind - 10) / 20;
  const underExtraction = Math.max(0, -(timeFactor + grindFactor) / 2);
  const overExtraction  = Math.max(0,  (timeFactor + grindFactor) / 2);
  const acidity    = Math.round(Math.min(100, Math.max(5, 50 + underExtraction * 45 - overExtraction * 30)));
  const sweetness  = Math.round(Math.min(100, Math.max(5, 62 - underExtraction * 45 - overExtraction * 35)));
  const bitterness = Math.round(Math.min(100, Math.max(5, 18 + overExtraction * 72 - underExtraction * 12)));
  const body       = Math.round(Math.min(100, Math.max(5, 50 - underExtraction * 35 + overExtraction * 22)));
  return { acidity, sweetness, bitterness, body };
}

function flavorBarColor(key, val) {
  if (key === "acidity")    return val > 70 ? "#d4b84a" : val > 45 ? "#7abd7a" : "#4a8a6a";
  if (key === "sweetness")  return val > 55 ? "#7abd7a" : val > 30 ? "#d4b84a" : "#d45a4a";
  if (key === "bitterness") return val < 35 ? "#7abd7a" : val < 60 ? "#d4b84a" : "#d45a4a";
  if (key === "body")       return val > 40 ? "#7abd7a" : "#d4b84a";
  return "#c9933a";
}

function getDiag(shotTime, grindIdx, dose, ratio) {
  const grind  = grindTo40(grindIdx);
  const yieldG = Math.round(dose * ratio);
  const zone   = getZone(grindIdx);
  const tooFast = shotTime < 22;
  const tooSlow = shotTime > 32;

  const finerSug  = fmtGrind(Math.max(0, grindIdx - 2));
  const coarserSug = fmtGrind(Math.min(44, grindIdx + 2));
  const cur = fmtGrind(grindIdx);

  if (grind > grindTo40(20) && tooFast) return {
    type: "wayoff", icon: "⚠️",
    title: "Way too coarse",
    text: `Position ${cur} is ${zone?.name} territory. Water has no resistance — this isn't espresso range.`,
    action: `Move to around position 4–5 and start from there.`,
    verdict: "Wrong zone", verdictColor: "#6a8abd",
  };
  if (grind < grindTo40(8) && tooSlow) return {
    type: "wayoff", icon: "⚠️",
    title: "Puck is choking",
    text: `Position ${cur} is extremely fine. The machine is struggling. Stop the shot if it's barely dripping.`,
    action: `Move up to around position 3–4 immediately.`,
    verdict: "Choking", verdictColor: "#d45a4a",
  };
  if (tooFast) return {
    type: "under", icon: "💧",
    title: "Under-extracted",
    text: `${shotTime}s is too fast. Water raced through with too little resistance. Expect sour, sharp or thin flavour.`,
    action: `Go finer: try position ${finerSug}. One click at a time.`,
    verdict: "Too fast", verdictColor: "#d4b84a",
  };
  if (tooSlow) return {
    type: "over", icon: "🔥",
    title: "Over-extracted",
    text: `${shotTime}s is too long. Puck had too much resistance. Expect bitter, harsh or dry finish.`,
    action: `Go coarser: try position ${coarserSug}. Also check your ${dose}g dose isn't too high.`,
    verdict: "Too slow", verdictColor: "#d45a4a",
  };
  return {
    type: "good", icon: "✓",
    title: "Dialled in",
    text: `${dose}g in → ${yieldG}g out in ${shotTime}s at 1:${ratio}. Position ${cur} is working for this setup.`,
    action: `Sour edge? One click finer. Bitter finish? One click coarser. Time is a guide — your palate is the judge.`,
    verdict: "On point", verdictColor: "#6abd7a",
  };
}

const fmt = s => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

function useHold(callback, { delay = 400, interval = 80 } = {}) {
  const holdRef  = useRef(null);
  const isTouchRef = useRef(false);

  const stop = () => {
    clearTimeout(holdRef.current);
    clearInterval(holdRef.current);
    holdRef.current = null;
  };

  const begin = () => {
    callback();
    holdRef.current = setTimeout(() => {
      holdRef.current = setInterval(callback, interval);
    }, delay);
  };

  const onTouchStart = (e) => {
    e.preventDefault();
    isTouchRef.current = true;
    begin();
  };

  const onTouchEnd = (e) => {
    e.preventDefault();
    stop();
    // keep isTouchRef true briefly so the simulated mousedown is ignored
    setTimeout(() => { isTouchRef.current = false; }, 600);
  };

  const onMouseDown = (e) => {
    if (isTouchRef.current) return;
    begin();
  };

  useEffect(() => () => stop(), []);

  return {
    onTouchStart, onTouchEnd,
    onMouseDown, onMouseUp: stop, onMouseLeave: stop,
    onContextMenu: (e) => e.preventDefault(),
  };
}

// localStorage helpers
function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}
function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

export default function App() {
  const [dose, setDose]         = useState(() => load('dose', 18));
  const [ratio, setRatio]       = useState(() => load('ratio', 2));
  const [grind, setGrind]       = useState(() => load('grind', 12));
  const [shotTime, setShotTime] = useState(() => load('shotTime', 27));
  const [timerMode, setTimerMode]   = useState("timer");
  const [manualTime, setManualTime] = useState(() => load('shotTime', 27));
  const [timerState, setTimerState] = useState("idle");
  const [elapsed, setElapsed]   = useState(0);
  const [history, setHistory]   = useState(() => load('history', []));
  const [hasLogged, setHasLogged] = useState(() => load('history', []).length > 0);

  // Persist whenever values change
  useEffect(() => { save('dose', dose); },     [dose]);
  useEffect(() => { save('ratio', ratio); },   [ratio]);
  useEffect(() => { save('grind', grind); },   [grind]);
  useEffect(() => { save('shotTime', shotTime); }, [shotTime]);
  useEffect(() => { save('history', history); },   [history]);
  const intervalRef = useRef(null);
  const startRef    = useRef(null);

  const doseDown  = useHold(() => setDose(d => Math.max(14, +(d - 0.5).toFixed(1))));
  const doseUp    = useHold(() => setDose(d => Math.min(22, +(d + 0.5).toFixed(1))));
  const grindDown = useHold(() => setGrind(g => Math.max(0, g - 1)));
  const grindUp   = useHold(() => setGrind(g => Math.min(44, g + 1)));
  const manDown   = useHold(() => setManualTime(t => Math.max(1, t - 1)));
  const manUp     = useHold(() => setManualTime(t => Math.min(60, t + 1)));

  const yieldG    = Math.round(dose * ratio);
  const zone      = getZone(grind);
  const flavor    = getFlavorProfile(shotTime, grind);
  const diag      = getDiag(shotTime, grind, dose, ratio);
  const needlePct = (grind / 44) * 100;

  // Timer logic
  const startTimer = () => {
    startRef.current = Date.now() - elapsed * 1000;
    setTimerState("running");
    intervalRef.current = setInterval(() => {
      const s = (Date.now() - startRef.current) / 1000;
      setElapsed(s);
    }, 50);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    const finalTime = Math.round(elapsed);
    setShotTime(finalTime);
    setTimerState("done");
    const v = finalTime < 22 ? "Too fast" : finalTime > 32 ? "Too slow" : "On point";
    const vc = finalTime < 22 ? "#d4b84a" : finalTime > 32 ? "#d45a4a" : "#6abd7a";
    setHistory(h => [{
      time: finalTime, grind, dose, ratio,
      verdict: v, verdictColor: vc,
      id: Date.now()
    }, ...h].slice(0, 6));
    setHasLogged(true);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setElapsed(0);
    setTimerState("idle");
  };

  const logManual = () => {
    setShotTime(manualTime);
    const v = manualTime < 22 ? "Too fast" : manualTime > 32 ? "Too slow" : "On point";
    const vc = manualTime < 22 ? "#d4b84a" : manualTime > 32 ? "#d45a4a" : "#6abd7a";
    setHistory(h => [{
      time: manualTime, grind, dose, ratio,
      verdict: v, verdictColor: vc,
      id: Date.now()
    }, ...h].slice(0, 6));
    setHasLogged(true);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const displayTime = timerMode === "manual" ? manualTime
    : (timerState === "running" || timerState === "done") ? elapsed : shotTime;
  const timerClass  = timerState === "running" ? "running"
    : timerState === "done"
      ? displayTime < 22 ? "done-fast" : displayTime > 32 ? "done-slow" : "done-good"
      : "idle";

  const dialWrapRef = useRef(null);
  const [dialWrapWidth, setDialWrapWidth] = useState(0);
  useEffect(() => {
    if (!dialWrapRef.current) return;
    const ro = new ResizeObserver(e => setDialWrapWidth(e[0].contentRect.width));
    ro.observe(dialWrapRef.current);
    return () => ro.disconnect();
  }, []);

  const SLOT_PX = 14;
  const dialOffset = dialWrapWidth / 2 - (grind * SLOT_PX + SLOT_PX / 2);
  const MAX_TIME = 45;
  const fillPct = Math.min(100, (displayTime / MAX_TIME) * 100);
  const fillColor = displayTime < 22 ? "#d4b84a" : displayTime > 32 ? "#d45a4a" : "#6abd7a";

  const toTimePct = s => Math.min(100, ((s - 0) / MAX_TIME) * 100);
  const goodStart = toTimePct(22);
  const goodEnd   = toTimePct(32);

  return (
    <>
      <style>{css}</style>
      <div className="app">

        {/* HEADER */}
        <div className="header">
          <h1 className="header-title">Dial-In</h1>
        </div>

        {/* SHOT TIMER */}
        <div className="section">
          <p className="section-label">Shot Timer</p>

          {/* MODE TOGGLE */}
          <div className="mode-toggle">
            <button className={`mode-btn ${timerMode === "timer" ? "active-mode" : "inactive"}`}
              onClick={() => { setTimerMode("timer"); resetTimer(); }}>
              ⏱ Live Timer
            </button>
            <button className={`mode-btn ${timerMode === "manual" ? "active-mode" : "inactive"}`}
              onClick={() => { setTimerMode("manual"); resetTimer(); }}>
              ✎ Enter Time
            </button>
          </div>

          {timerMode === "manual" ? (
            <>
              <div className="manual-input-wrap">
                <button className="manual-step-btn" {...manDown} disabled={manualTime <= 1}>−</button>
                <div className="manual-val">
                  <span className="manual-num">{manualTime}s</span>
                  <span className="manual-unit">
                    {manualTime < 22 ? "too fast" : manualTime > 32 ? "too slow" : "sweet spot ✓"}
                  </span>
                </div>
                <button className="manual-step-btn" {...manUp} disabled={manualTime >= 60}>+</button>
              </div>
              <div className="extraction-wrap" style={{ marginBottom: 16 }}>
                <div className="extraction-track">
                  <div style={{ position: "absolute", left: `${goodStart}%`, width: `${goodEnd - goodStart}%`, height: "100%", background: "rgba(90,184,122,0.12)", borderRadius: 3 }} />
                  <div className="extraction-fill" style={{ width: `${fillPct}%`, background: fillColor }} />
                </div>
                <div className="extraction-zones">
                  <span>0s</span>
                  <span style={{ color: "#6abd7a" }}>22–32s</span>
                  <span>45s</span>
                </div>
              </div>
              <button className="manual-log-btn" onClick={logManual}>+ Log This Shot</button>
            </>
          ) : (
          <div className="timer-hero">
            {timerState === "running" && (
              <div className="steam-wrap">
                <div className="steam" style={{ height: 14 }} />
                <div className="steam" style={{ height: 20 }} />
                <div className="steam" style={{ height: 14 }} />
              </div>
            )}
            <div className={`timer-display ${timerClass}`}>
              {fmt(displayTime)}
            </div>
            <div className="timer-unit">
              {timerState === "idle"    && "ready to pull"}
              {timerState === "running" && "pulling shot…"}
              {timerState === "done"    && (displayTime < 22 ? "too fast" : displayTime > 32 ? "too slow" : "sweet spot ✓")}
            </div>

            <div className="extraction-wrap">
              <div className="extraction-track">
                <div style={{ position: "absolute", left: `${goodStart}%`, width: `${goodEnd - goodStart}%`, height: "100%", background: "rgba(90,184,122,0.12)", borderRadius: 3 }} />
                <div className="extraction-fill" style={{ width: `${fillPct}%`, background: fillColor }} />
              </div>
              <div className="extraction-zones">
                <span>0s</span>
                <span style={{ color: "#6abd7a" }}>22–32s</span>
                <span>45s</span>
              </div>
            </div>

            {timerState === "idle" && (
              <button className="timer-btn start" onClick={startTimer}>▶ Start Shot</button>
            )}
            {timerState === "running" && (
              <button className="timer-btn stop" onClick={stopTimer}>■ Stop &amp; Log</button>
            )}
            {timerState === "done" && (
              <>
                <button className="timer-btn start" onClick={startTimer}>▶ Pull Another</button>
                <button className="timer-btn reset" onClick={resetTimer}>Reset</button>
              </>
            )}
          </div>
          )}
        </div>

        {/* DOSE */}
        <div className="section">
          <p className="section-label">Dose</p>
          <div className="stepper">
            <button className="step-btn" {...doseDown} disabled={dose <= 14}>−</button>
            <div className="step-val">
              <span className="step-num">{dose}</span>
              <span className="step-unit" style={{ color: "var(--muted)" }}>grams in</span>
            </div>
            <button className="step-btn" {...doseUp} disabled={dose >= 22}>+</button>
          </div>
        </div>

        {/* RATIO */}
        <div className="section">
          <p className="section-label">Ratio</p>
          <div className="ratio-grid">
            {RATIOS.map(r => (
              <button key={r.value} className={`ratio-btn ${ratio === r.value ? "active" : ""}`}
                onClick={() => setRatio(r.value)}>
                <strong>{r.label}</strong>
                <span className="ratio-name">{r.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* OUTPUT */}
        <div className="section">
          <p className="section-label">Target Output</p>
          <div className="stats-row">
            <div className="stat">
              <div className="stat-val">{dose}g</div>
              <div className="stat-lbl">In</div>
            </div>
            <div className="stat">
              <div className="stat-val">{yieldG}g</div>
              <div className="stat-lbl">Out</div>
            </div>
            <div className="stat">
              <div className="stat-val">1:{ratio}</div>
              <div className="stat-lbl">Ratio</div>
            </div>
          </div>
        </div>

        {/* GRIND */}
        <div className="section">
          <p className="section-label">Grind — Opus 1–12</p>
          <div className="dial-wrap">
            <button className="step-btn" {...grindDown} disabled={grind <= 0}>−</button>
            <div className="dial-ruler-wrap" ref={dialWrapRef}>
              <div className="dial-ruler" style={{ transform: `translateX(${dialOffset}px)` }}>
                {Array.from({ length: GRIND_TOTAL }, (_, i) => {
                  const isMajor   = i % 4 === 0;
                  const isMid     = i % 4 === 2;
                  const isCurrent = i === grind;
                  const num       = isMajor ? (i / 4 + 1) : null;
                  const tickH     = isCurrent ? 22 : isMajor ? 18 : isMid ? 11 : 7;
                  const tickColor = isCurrent
                    ? 'var(--chrome-bright)'
                    : isMajor ? 'var(--chrome-dim)' : 'var(--border-bright)';
                  return (
                    <div
                      key={i}
                      className="dial-tick"
                      style={{ width: SLOT_PX, cursor: 'pointer' }}
                      onClick={() => setGrind(i)}
                    >
                      {isMajor && (
                        <span className="dial-tick-label" style={{
                          color: isCurrent ? 'var(--chrome-bright)' : 'var(--chrome-dim)',
                          fontWeight: isCurrent ? 700 : 600,
                        }}>{num}</span>
                      )}
                      <div className="dial-tick-mark" style={{ height: tickH, background: tickColor,
                        width: isMajor || isCurrent ? '2px' : '1.5px',
                        boxShadow: isCurrent ? '0 0 6px var(--chrome)88' : 'none',
                      }} />
                    </div>
                  );
                })}
              </div>
            </div>
            <button className="step-btn" {...grindUp} disabled={grind >= 44}>+</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, padding: '0 4px' }}>
            <span style={{ fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Position {fmtGrind(grind)}
            </span>
            <span style={{ fontSize: '0.58rem', color: zone?.color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {zone?.name}
            </span>
          </div>
        </div>

        {/* FLAVOR PROFILE */}
        <div className="section">
          <p className="section-label">Predicted Flavor Profile</p>
          <div className="flavor-wrap">
            <div className="flavor-row">
              {Object.entries(flavor).map(([key, val]) => (
                <div key={key} className="flavor-item">
                  <span className="flavor-label">{key}</span>
                  <div className="flavor-bar-bg">
                    <div className="flavor-bar-fill" style={{
                      width: `${val}%`,
                      background: flavorBarColor(key, val)
                    }} />
                  </div>
                  <span className="flavor-val">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SHOT HISTORY */}
        <div className="section">
          <p className="section-label">Shot Log</p>
          <div className="history-wrap">
            {history.length === 0 && (
              <div className="history-empty">No shots logged yet — use the timer above</div>
            )}
            {history.map(s => (
              <div key={s.id} className="history-item">
                <div className="history-dot" style={{ background: s.verdictColor }} />
                <div className="history-info">
                  <div className="history-primary">{s.time}s · {s.dose}g → {Math.round(s.dose * s.ratio)}g · 1:{s.ratio}</div>
                  <div className="history-secondary">grind {fmtGrind(s.grind)}</div>
                </div>
                <div className="history-verdict" style={{ color: s.verdictColor }}>{s.verdict}</div>
              </div>
            ))}
            {history.length > 0 && (
              <button className="history-clear" onClick={() => {
                setHistory([]);
                setHasLogged(false);
                setShotTime(27);
                setManualTime(27);
                setElapsed(0);
                setTimerState("idle");
                clearInterval(intervalRef.current);
              }}>Clear log</button>
            )}
          </div>
        </div>

        <div className="divider" />

        {/* DIAGNOSIS */}
        <div className="section" style={{ paddingBottom: 20 }}>
          <p className="section-label">Diagnosis</p>
        </div>
        {hasLogged ? (
        <div className={`diag ${diag.type}`}>
          <div className="diag-icon">{diag.icon}</div>
          <div className="diag-title">{diag.title}</div>
          <div className="diag-text">{diag.text}</div>
          {diag.action && <div className="diag-action">{diag.action}</div>}
        </div>
        ) : (
        <div className="diag wayoff" style={{ opacity: 0.4 }}>
          <div className="diag-icon">☕</div>
          <div className="diag-title">No shots logged yet</div>
          <div className="diag-text">Pull a shot and log it to get your diagnosis.</div>
        </div>
        )}

        <p className="footer">Taste is the final judge — always</p>
      </div>
    </>
  );
}
