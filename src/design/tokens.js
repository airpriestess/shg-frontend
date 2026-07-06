export const T = {
  bgRoot: "#000000",
  bgSoft: "#050404",
  surfaceBase: "#000000",
  surfaceRaised: "#08060e",
  surfaceHigh: "#100e16",
  borderSoft: "#1e1828",
  borderGlow: "#241e38",

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
  cardBg:      "rgba(6,4,10,0.97)",
  premiumCard: "linear-gradient(135deg,rgba(15,14,12,0.98),rgba(8,7,6,0.98))",
  border:      "1px solid #1e1828",
  glow:        "0 0 40px rgba(183,110,121,0.1)",
  glowChamp:   "0 0 30px rgba(183,110,121,0.14)",
};

export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Jost:wght@300;400;500;600;700;800&display=swap');

/* ── RESET ─────────────────────── */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;}
body{background:#000;color:#f2ece4;font-family:'Jost',sans-serif;font-weight:300;font-size:16px;line-height:1.65;overflow-x:hidden;-webkit-font-smoothing:antialiased;min-height:100vh;}
button,input,textarea,select{font-family:'Jost',sans-serif;}
input,textarea{background:#000;border:1px solid #1e1828;color:#f2ece4;border-radius:10px;padding:13px 16px;font-size:15px;width:100%;outline:none;transition:border-color 0.2s;}
input::placeholder,textarea::placeholder{color:#3a3430;}
input:focus,textarea:focus{border-color:#B76E7966;}
::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:#1e1828;border-radius:2px;}
*{-webkit-tap-highlight-color:transparent;}
img{max-width:100%;}

/* ── TYPOGRAPHY ─────────────────── */
.wm{font-family:'Cormorant Garamond',serif;font-style:italic;}

/* ── ANIMATIONS ─────────────────── */
@keyframes fadeIn{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
@keyframes wave{0%,100%{transform:scaleY(0.4);}50%{transform:scaleY(1);}}
@keyframes marquee{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(183,110,121,0.5);}50%{box-shadow:0 0 0 12px rgba(183,110,121,0);}}
@keyframes breathe{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:var(--op);}50%{transform:translate(-50%,-50%) scale(1.06);opacity:calc(var(--op)*2);}}
.fade{animation:fadeIn 0.4s ease both;}
.marquee-track{display:flex;width:max-content;animation:marquee 320s linear infinite;}
.cta-pulse{animation:pulse 2.2s ease-in-out infinite;}
.ring{position:absolute;border-radius:50%;border:1px solid;pointer-events:none;top:50%;left:50%;animation:breathe 6s ease-in-out infinite;}
@media(prefers-reduced-motion:reduce){.marquee-track,.cta-pulse,.ring{animation:none;}}

/* ── LAYOUT ─────────────────────── */
.section-wrap{width:100%;max-width:1200px;margin-left:auto;margin-right:auto;padding-left:clamp(20px,5vw,80px);padding-right:clamp(20px,5vw,80px);}

/* ── GRID CLASSES (never inline gridTemplateColumns on sections) ── */
.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
.grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
.price-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.proof-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
.comp-table{display:grid;grid-template-columns:1fr 1fr;}
.steps-grid{display:grid;grid-template-columns:1fr 36px 1fr 36px 1fr 36px 1fr;align-items:start;}

/* ── PORTAL ─────────────────────── */
.hide-mob{display:flex;}
.mob-nav{display:none!important;}
.mob-pb{padding-bottom:0;}

/* ── MOBILE ≤ 680px ─────────────── */
@media(max-width:680px){
  /* Layout */
  .section-wrap{padding-left:18px!important;padding-right:18px!important;}

  /* ALL section grids → single column */
  .grid-2{display:flex!important;flex-direction:column!important;gap:14px!important;}
  .grid-3{display:flex!important;flex-direction:column!important;gap:12px!important;}
  .grid-4{display:flex!important;flex-direction:column!important;gap:12px!important;}
  .price-grid{display:flex!important;flex-direction:column!important;gap:14px!important;}

  /* proof grid stays 2-col */
  .proof-grid{display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px!important;}

  /* steps + table */
  .comp-table{display:flex!important;flex-direction:column!important;}
  .steps-grid{display:flex!important;flex-direction:column!important;gap:0!important;}
  .step-arrow{display:none!important;}
  .tech-table{display:none!important;}

  /* Portal nav */
  .hide-mob{display:none!important;}
  .mob-nav{display:flex!important;}
  .mob-pb{padding-bottom:80px!important;}

  /* Landing page sections — all single column */
  [class*="landing-grid"]{display:flex!important;flex-direction:column!important;}

  /* Hero */
  .hero-title{font-size:clamp(32px,9vw,52px)!important;}

  /* Buttons full width on mobile */
  .mob-full{width:100%!important;display:block!important;}

  /* Banner */
  .banner-text{font-size:9px!important;letter-spacing:0.04em!important;}
  .banner-inner{gap:6px!important;flex-wrap:wrap!important;justify-content:center!important;}

  /* Pricing order on mobile — Goddess first */
  .price-card-audio{order:2;}
  .price-card-goddess{order:1;}
  .price-card-lifetime{order:3;}

  /* Section padding */
  .section-pad{padding-left:18px!important;padding-right:18px!important;padding-top:56px!important;padding-bottom:56px!important;}

  /* Font adjustments */
  .mobile-h2{font-size:clamp(26px,7vw,40px)!important;}

  /* Hero CTAs stack on mobile */
  .hero-ctas{flex-direction:column!important;align-items:stretch!important;}
  .hero-ctas button{width:100%!important;}
}

/* ── TABLET 681–1024px ───────────── */
@media(min-width:681px) and (max-width:1024px){
  .price-grid{grid-template-columns:1fr!important;max-width:480px;margin-left:auto;margin-right:auto;}
  .grid-3{grid-template-columns:1fr 1fr!important;}
  .steps-grid{grid-template-columns:1fr 28px 1fr 28px 1fr 28px 1fr!important;}
}

/* ── MARQUEE FLASH ─────────────────── */
@keyframes flash{0%,100%{opacity:1;color:inherit;}50%{opacity:0.5;}}
@keyframes maxxFlash{
  0%,85%,100%{opacity:1;transform:none;}
  90%{opacity:0.3;transform:scaleX(0.97);}
  95%{opacity:1;transform:none;}
}
@keyframes shake{
  0%,100%{transform:none;}
  10%,30%,50%,70%,90%{transform:translateX(-3px);}
  20%,40%,60%,80%{transform:translateX(3px);}
}
@keyframes shimmerGold{
  0%{background-position:200% center;}
  100%{background-position:-200% center;}
}
@keyframes joinPulse{
  0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(183,110,121,0.4);}
  50%{transform:scale(1.03);box-shadow:0 0 0 8px rgba(183,110,121,0);}
}
.maxx-item{animation:maxxFlash 3s ease-in-out infinite;}
.maxx-item:nth-child(2n){animation-delay:0.4s;}
.maxx-item:nth-child(3n){animation-delay:0.8s;}
.maxx-item:nth-child(4n){animation-delay:1.2s;}
.maxx-item:nth-child(5n){animation-delay:1.6s;}
.cta-shake{animation:shake 0.6s ease-in-out infinite;animation-delay:2s;}
.join-pulse{animation:joinPulse 1.8s ease-in-out infinite;}
@media(prefers-reduced-motion:reduce){.maxx-item,.cta-shake,.join-pulse{animation:none;}}

/* ── NUCLEAR MOBILE OVERRIDE — catches ALL inline grids ────────────── */
@media(max-width:680px){
  /* Force ANY element that has inline display:grid to flex-column */
  /* This catches cases where JS hasn't run yet or inline styles win */
  body [style*="grid-template-columns"]{
    display:flex!important;
    flex-direction:column!important;
    flex-wrap:nowrap!important;
  }
  /* Exceptions — internal card stats that SHOULD stay grid */
  body [style*="1.2fr 1.8fr"],[style*="1fr 36px"]{
    display:none!important;
  }
  /* Force all top-level section padding to mobile */
  body > #root > * [style*="padding"]{
    max-width:100vw!important;
    overflow-x:hidden!important;
  }
  /* Hero font */
  h1{font-size:clamp(32px,9vw,52px)!important;}
  /* Buttons full width in hero */
  .hero-ctas>button{width:100%!important;}
  /* Ensure page doesn't overflow */
  html,body{overflow-x:hidden!important;max-width:100vw!important;}
}

/* ── WORDMARK SHIMMER ───────────── */
@keyframes wordmarkShimmer{
  0%{background-position:0% center;}
  50%{background-position:200% center;}
  100%{background-position:0% center;}
}
.wm-shimmer{
  background:linear-gradient(135deg,#f5e0a0 0%,#e8b870 22%,#d4a090 48%,#c4789a 72%,#B76E79 100%)!important;
  -webkit-background-clip:text!important;
  background-clip:text!important;
  -webkit-text-fill-color:transparent!important;
  color:transparent!important;
}

/* ── SECTION COLOUR BANDS ─────────────── */
.section-rose{background:linear-gradient(180deg,#000 0%,#130818 50%,#000 100%)!important;}
.section-peach{background:linear-gradient(180deg,#000 0%,#140c18 50%,#000 100%)!important;}
.section-black{background:#000!important;}
`;
