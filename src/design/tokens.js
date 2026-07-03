export const T = {
  bgRoot: "#000000",
  bgSoft: "#050404",
  surfaceBase: "#0a0908",
  surfaceRaised: "#0f0e0c",
  surfaceHigh: "#141210",
  borderSoft: "#201e1c",
  borderGlow: "#2c2826",

  // Text — warm cream white fading to soft peach
  textPrimary:   "#f2ece4",   // warm cream white
  textSecondary: "#dcc8b8",   // soft peach
  textMuted:     "#b09888",   // muted peach — readable
  textFaint:     "#786860",   // dim peach — still legible

  // THE LOCKED ACCENT — soft dusty rose gold to light peach
  // This is the colour Reshma approved. Light. Feminine. Not orange. Not red.
  gold:      "#C8956A",   // warm peach (used as secondary)
  roseGold:  "#B76E79",   // LOCKED — soft dusty rose gold   // THE accent — soft dusty rose gold ← LOCKED
  rose:      "#B76E79",
  champagne: "#B76E79",
  champSoft: "#C8956A",
  success:   "#4a9a5a",
  warning:   "#C8956A",
  danger:    "#B76E79",
  blood:     "#B76E79",

  // Gradient: light peach → soft rose gold
  // Left = lighter peach cream, right = dusty rose gold
  grad:  "linear-gradient(90deg,#d4a090,#B76E79)",
  gradV: "linear-gradient(135deg,#d4a090,#B76E79)",

  bgGrad:      "#000000",
  cardBg:      "rgba(10,9,8,0.96)",
  premiumCard: "linear-gradient(135deg,rgba(15,14,12,0.98),rgba(8,7,6,0.98))",
  border:      "1px solid #201e1c",
  glow:        "0 0 40px rgba(183,110,121,0.1)",
  glowChamp:   "0 0 30px rgba(183,110,121,0.14)",
};

export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Jost:wght@300;400;500;600;700;800&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;}
body{background:#000;color:#f2ece4;font-family:'Jost',sans-serif;font-size:16px;line-height:1.65;overflow-x:hidden;-webkit-font-smoothing:antialiased;min-height:100vh;}
button,input,textarea,select{font-family:'Jost',sans-serif;}
input,textarea{background:#0a0908;border:1px solid #201e1c;color:#f2ece4;border-radius:10px;padding:13px 16px;font-size:15px;width:100%;outline:none;transition:border-color 0.2s;}
input::placeholder,textarea::placeholder{color:#3a3430;}
input:focus,textarea:focus{border-color:#B76E7966;}
::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:#201e1c;border-radius:2px;}
*{-webkit-tap-highlight-color:transparent;}

/* ── TYPOGRAPHY ─────────────────────────────────────── */
.wm{font-family:'Cormorant Garamond',serif;font-style:italic;}

/* ── ANIMATIONS ─────────────────────────────────────── */
@keyframes fadeIn{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
@keyframes wave{0%,100%{transform:scaleY(0.4);}50%{transform:scaleY(1);}}
@keyframes marquee{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(183,110,121,0.6);}50%{box-shadow:0 0 0 10px rgba(183,110,121,0);}}
@keyframes breathe{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:var(--op);}50%{transform:translate(-50%,-50%) scale(1.06);opacity:calc(var(--op)*2);}}
.fade{animation:fadeIn 0.4s ease both;}
.marquee-track{display:flex;width:max-content;animation:marquee 22s linear infinite;}
.marquee-track:hover{animation-play-state:paused;}
.cta-pulse{animation:pulse 2.2s ease-in-out infinite;}
.ring{position:absolute;border-radius:50%;border:1px solid;pointer-events:none;top:50%;left:50%;animation:breathe 6s ease-in-out infinite;}

/* ── BACKGROUND ─────────────────────────────────────── */
body::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;background-image:linear-gradient(rgba(183,110,121,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(183,110,121,0.04) 1px,transparent 1px);background-size:60px 60px;mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%);-webkit-mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%);}
body::after{content:'';position:fixed;top:50%;left:50%;width:600px;height:600px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(183,110,121,0.03) 0%,transparent 70%);pointer-events:none;z-index:0;}
#root{position:relative;z-index:1;}

/* ── LAYOUT ─────────────────────────────────────────── */
.section-wrap{width:100%;max-width:1200px;margin-left:auto;margin-right:auto;padding-left:clamp(20px,5vw,80px);padding-right:clamp(20px,5vw,80px);}
.hero-wrap{width:100%;max-width:820px;margin-left:auto;margin-right:auto;text-align:center;}

/* ── GRID CLASSES ────────────────────────────────────── */
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
.price-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.proof-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
.comp-table{display:grid;grid-template-columns:1fr 1fr;}
.steps-grid{display:grid;grid-template-columns:1fr 36px 1fr 36px 1fr 36px 1fr;align-items:start;}

/* ── HIDE/SHOW ───────────────────────────────────────── */
.mob-only{display:none;}
.desk-only{display:block;}

/* ── MOBILE ≤ 680px ──────────────────────────────────── */
@media(max-width:680px){
  .section-wrap{padding-left:18px!important;padding-right:18px!important;}
  .hero-wrap{padding-left:18px!important;padding-right:18px!important;}

  /* ALL section grids → single column */
  .grid-2{display:flex!important;flex-direction:column!important;gap:12px!important;}
  .grid-3{display:flex!important;flex-direction:column!important;gap:12px!important;}
  .grid-4{display:flex!important;flex-direction:column!important;gap:12px!important;}
  .price-grid{display:flex!important;flex-direction:column!important;gap:14px!important;}

  /* proof grid stays 2-col on mobile */
  .proof-grid{display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px!important;}

  /* comp table stacks */
  .comp-table{display:flex!important;flex-direction:column!important;}

  /* steps → vertical */
  .steps-grid{display:flex!important;flex-direction:column!important;gap:0!important;}
  .step-arrow{display:none!important;}

  /* nav */
  .desk-only{display:none!important;}
  .mob-only{display:flex!important;}
  .mob-pb{padding-bottom:80px!important;}

  /* hero */
  .hero-section{padding-top:88px!important;padding-bottom:40px!important;min-height:auto!important;}

  /* tech table — hide on mobile, too complex */
  .tech-table{display:none!important;}

  /* font scaling */
  .mobile-h1{font-size:clamp(34px,9vw,52px)!important;}
  .mobile-body{font-size:15px!important;}

  /* buttons */
  .btn-full-mobile{width:100%!important;display:block!important;}

  /* banner */
  .banner-inner{font-size:9px!important;letter-spacing:0.05em!important;}
}

/* ── TABLET 681–1024px ───────────────────────────────── */
@media(min-width:681px) and (max-width:1024px){
  .price-grid{grid-template-columns:1fr!important;max-width:480px;margin-left:auto;margin-right:auto;}
  .steps-grid{grid-template-columns:1fr 28px 1fr 28px 1fr 28px 1fr!important;}
}
`;
