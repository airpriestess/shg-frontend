// Lucky Girl color system — replacing all rose/peach/champagne
// Primary gradient: gold → lavender → teal-green → deep teal
export const LG_GRAD = "linear-gradient(110deg,#C8960A 0%,#B8820A 25%,#5B8DB8 55%,#2AA89A 80%,#167A6B 100%)";
export const LG_MID  = "#2CB7A7";   // teal-green — replaces #2CB7A7 rose
export const LG_LAV  = "#5B8DB8";   // lavender   — replaces #5B8DB8 peach
export const LG_GOLD = "#C8860A";   // rich gold  — replaces #C8860A champagne
export const LG_DEEP = "#167A6B";   // deep teal  — accent dark

export const T = {
  bgRoot: "#000000",
  bgSoft: "#050505",
  surfaceBase: "#000000",
  surfaceRaised: "#0a0a0a",
  surfaceHigh: "#121212",
  borderSoft: "#1e1e1e",
  borderGlow: "#242424",

  // Text — warm cream white
  textPrimary:   "#f2ece4",
  textSecondary: "#dcc8b8",
  textMuted:     "#b09888",
  textFaint:     "#786860",

  // Lucky Girl accent colors — no more rose/peach
  gold:      "#C8860A",   // rich gold
  roseGold:  "#2CB7A7",   // was dusty rose, now teal-green
  rose:      "#2CB7A7",   // was rose, now teal-green
  champagne: "#C8860A",   // was pale champagne, now rich gold
  champSoft: "#C8960A",   // warm amber-gold
  success:   "#4a9a5a",
  warning:   "#C8860A",
  danger:    "#2CB7A7",
  blood:     "#2CB7A7",

  // Lucky Girl gradient replaces old amber/rose ombre
  grad:  "linear-gradient(110deg,#C8960A,#5B8DB8,#167A6B)",
  gradV: "linear-gradient(135deg,#C8960A 0%,#B8820A 25%,#5B8DB8 55%,#2AA89A 80%,#167A6B 100%)",

  bgGrad:      "#000000",
  cardBg:      "rgba(10,10,10,0.97)",
  premiumCard: "linear-gradient(135deg,rgba(14,14,14,0.98),rgba(8,8,8,0.98))",
  border:      "1px solid #1e1e1e",
  glow:        "0 0 40px rgba(44,183,167,0.12)",
  glowChamp:   "0 0 30px rgba(44,183,167,0.14)",
};

export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Jost:wght@300;400;500;600;700;800&display=swap');

/* ── RESET ─────────────────────── */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;}
body{background:#000;color:#f2ece4;font-family:'Jost',sans-serif;font-weight:300;font-size:16px;line-height:1.65;overflow-x:hidden;-webkit-font-smoothing:antialiased;min-height:100vh;}
button,input,textarea,select{font-family:'Jost',sans-serif;}
input,textarea{background:#000;border:1px solid #1e1e1e;color:#f2ece4;border-radius:10px;padding:13px 16px;font-size:15px;width:100%;outline:none;transition:border-color 0.2s;}
input::placeholder,textarea::placeholder{color:#3a3430;}
input:focus,textarea:focus{border-color:#2CB7A766;}
::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:#1e1e1e;border-radius:2px;}
*{-webkit-tap-highlight-color:transparent;}
img{max-width:100%;}

/* ── TYPOGRAPHY ─────────────────── */
.wm{font-family:'Cormorant Garamond',serif;font-style:italic;}

/* ── ANIMATIONS ─────────────────── */
@keyframes fadeIn{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
@keyframes wave{0%,100%{transform:scaleY(0.4);}50%{transform:scaleY(1);}}
@keyframes marquee{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(44,183,167,0.5);}50%{box-shadow:0 0 0 12px rgba(44,183,167,0);}}
@keyframes breathe{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:var(--op);}50%{transform:translate(-50%,-50%) scale(1.06);opacity:calc(var(--op)*2);}}
.fade{animation:fadeIn 0.4s ease both;}
.marquee-track{display:flex;width:max-content;animation:marquee 320s linear infinite;}
.cta-pulse{animation:pulse 2.2s ease-in-out infinite;}
.ring{position:absolute;border-radius:50%;border:1px solid;pointer-events:none;top:50%;left:50%;animation:breathe 6s ease-in-out infinite;}
@media(prefers-reduced-motion:reduce){.marquee-track,.cta-pulse,.ring{animation:none;}}

/* ── LAYOUT ─────────────────────── */
.section-wrap{width:100%;max-width:1200px;margin-left:auto;margin-right:auto;padding-left:clamp(20px,5vw,80px);padding-right:clamp(20px,5vw,80px);}

/* ── GRID CLASSES ── */
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
  .section-wrap{padding-left:18px!important;padding-right:18px!important;}
  .grid-2{display:flex!important;flex-direction:column!important;gap:14px!important;}
  .grid-3{display:flex!important;flex-direction:column!important;gap:12px!important;}
  .grid-4{display:flex!important;flex-direction:column!important;gap:12px!important;}
  .price-grid{display:flex!important;flex-direction:column!important;gap:14px!important;}
  .proof-grid{display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px!important;}
  .comp-table{display:flex!important;flex-direction:column!important;}
  .steps-grid{display:flex!important;flex-direction:column!important;gap:0!important;}
  .step-arrow{display:none!important;}
  .tech-table{display:none!important;}
  .hide-mob{display:none!important;}
  .mob-nav{display:flex!important;}
  .mob-pb{padding-bottom:80px!important;}
  [class*="landing-grid"]{display:flex!important;flex-direction:column!important;}
  .hero-title{font-size:clamp(32px,9vw,52px)!important;}
  .mob-full{width:100%!important;display:block!important;}
  .banner-text{font-size:9px!important;letter-spacing:0.04em!important;}
  .banner-inner{gap:6px!important;flex-wrap:wrap!important;justify-content:center!important;}
  .price-card-audio{order:2;}
  .price-card-goddess{order:1;}
  .price-card-lifetime{order:3;}
  .section-pad{padding-left:18px!important;padding-right:18px!important;padding-top:56px!important;padding-bottom:56px!important;}
  .mobile-h2{font-size:clamp(26px,7vw,40px)!important;}
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
  0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(44,183,167,0.4);}
  50%{transform:scale(1.03);box-shadow:0 0 0 8px rgba(44,183,167,0);}
}
.maxx-item{animation:maxxFlash 3s ease-in-out infinite;}
.maxx-item:nth-child(2n){animation-delay:0.4s;}
.maxx-item:nth-child(3n){animation-delay:0.8s;}
.maxx-item:nth-child(4n){animation-delay:1.2s;}
.maxx-item:nth-child(5n){animation-delay:1.6s;}
.cta-shake{animation:shake 0.6s ease-in-out infinite;animation-delay:2s;}
.join-pulse{animation:joinPulse 1.8s ease-in-out infinite;}
@media(prefers-reduced-motion:reduce){.maxx-item,.cta-shake,.join-pulse{animation:none;}}

/* ── NUCLEAR MOBILE OVERRIDE ────────────── */
@media(max-width:680px){
  body [style*="grid-template-columns"]{
    display:flex!important;
    flex-direction:column!important;
    flex-wrap:nowrap!important;
  }
  body [style*="1.2fr 1.8fr"],[style*="1fr 36px"]{
    display:none!important;
  }
  body > #root > * [style*="padding"]{
    max-width:100vw!important;
    overflow-x:hidden!important;
  }
  h1{font-size:clamp(32px,9vw,52px)!important;}
  .hero-ctas>button{width:100%!important;}
  html,body{overflow-x:hidden!important;max-width:100vw!important;}
}

/* ── WORDMARK — Lucky Girl gradient ───────────── */
@keyframes wordmarkShimmer{
  0%{background-position:0% center;}
  50%{background-position:200% center;}
  100%{background-position:0% center;}
}
.wm-shimmer{
  background:linear-gradient(135deg,#C8960A 0%,#B8820A 25%,#5B8DB8 55%,#2AA89A 80%,#167A6B 100%)!important;
  -webkit-background-clip:text!important;
  background-clip:text!important;
  -webkit-text-fill-color:transparent!important;
  color:transparent!important;
}

/* ── SECTION COLOUR BANDS ─────────────── */
.section-rose{background:linear-gradient(180deg,#000 0%,#0a1a18 50%,#000 100%)!important;}
.section-peach{background:linear-gradient(180deg,#000 0%,#0a1810 50%,#000 100%)!important;}
.section-black{background:#000!important;}
`;
