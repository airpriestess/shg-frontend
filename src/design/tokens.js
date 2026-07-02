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
/* ── RESPONSIVE ─────────────────────────────────────────────── */
html{-webkit-text-size-adjust:100%}
*{-webkit-tap-highlight-color:transparent}
/* Desktop: full width, generous padding */
.section-wrap{width:100%;max-width:1320px;margin-left:auto;margin-right:auto;padding-left:clamp(24px,5vw,72px);padding-right:clamp(24px,5vw,72px);box-sizing:border-box}
.hero-wrap{width:100%;max-width:1100px;margin-left:auto;margin-right:auto;padding-left:clamp(24px,6vw,80px);padding-right:clamp(24px,6vw,80px);box-sizing:border-box;text-align:center}
.grid-2{grid-template-columns:1fr 1fr}
.grid-3{grid-template-columns:repeat(3,1fr)}
.grid-4{grid-template-columns:1fr 40px 1fr 40px 1fr 40px 1fr}
/* Mobile: stack everything, big text, breathing room */
@media(max-width:768px){
  .section-wrap{padding-left:20px!important;padding-right:20px!important}
  .hero-wrap{padding-left:20px!important;padding-right:20px!important}
  .grid-2{grid-template-columns:1fr!important}
  .grid-3{grid-template-columns:1fr 1fr!important}
  .grid-4{grid-template-columns:1fr!important;gap:16px!important}
  .price-grid{grid-template-columns:1fr!important}
  .comp-grid{grid-template-columns:1fr!important}
  .hide-mobile{display:none!important}
  .steps-arrow{display:none!important}
  nav h1,nav .wm{font-size:16px!important}
}

/* ── ANIMATED MARQUEE ──────────────────────────────────────── */
@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
.marquee-track{display:flex;width:max-content;animation:marquee 18s linear infinite}
.marquee-track:hover{animation-play-state:paused}

@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Jost:wght@300;400;500;600;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{
  background:#000;
  color:#f2ece4;
  font-family:'Jost',sans-serif;
  font-size:16px;
  line-height:1.65;
  overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
  min-height:100vh;
}
button,input,textarea,select{font-family:'Jost',sans-serif;}
input,textarea{letter-spacing:0.01em;
  background:#0a0908;
  border:1px solid #201e1c;
  color:#f2ece4;
  border-radius:10px;
  padding:13px 16px;
  font-size:15px;
  width:100%;
  outline:none;
  transition:border-color 0.2s,box-shadow 0.2s;
}
input::placeholder,textarea::placeholder{color:#3a3430;}
input:focus,textarea:focus{
  border-color:#B76E7966;
  box-shadow:0 0 0 3px rgba(183,110,121,0.08);
}
select{
  background:#0a0908;border:1px solid #201e1c;color:#f2ece4;
  border-radius:10px;padding:12px 16px;font-size:15px;
  outline:none;cursor:pointer;width:100%;
}
::-webkit-scrollbar{width:3px;height:3px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:#201e1c;border-radius:2px;}
.wm{font-family:'Cormorant Garamond',serif;font-style:italic;}
.fade{animation:fadeIn 0.3s ease;}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
.wave span{
  display:inline-block;width:3px;border-radius:2px;
  background:linear-gradient(180deg,#d4a090,#B76E79);
  animation:wave 1.4s ease-in-out infinite;
}
@keyframes wave{0%,100%{transform:scaleY(0.3);opacity:0.5;}50%{transform:scaleY(1);opacity:1;}}
.ring{
  position:absolute;border-radius:50%;border:1px solid;
  pointer-events:none;top:50%;left:50%;
  animation:breathe 6s ease-in-out infinite;
}
@keyframes breathe{
  0%,100%{transform:translate(-50%,-50%) scale(1);opacity:var(--op);}
  50%{transform:translate(-50%,-50%) scale(1.06);opacity:calc(var(--op)*2);}
}
@keyframes pulse{
  0%{box-shadow:0 0 0 0 rgba(183,110,121,0.4);}
  70%{box-shadow:0 0 0 20px rgba(183,110,121,0);}
  100%{box-shadow:0 0 0 0 rgba(183,110,121,0);}
}
.pulse{animation:pulse 2s infinite;}
@keyframes slide{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
@media(max-width:900px){
  .hide-mob{display:none !important;}.mob-col{flex-direction:column !important;}
  .grid-2{grid-template-columns:1fr !important;}.grid-3{grid-template-columns:1fr !important;}
  .grid-4{grid-template-columns:1fr 1fr !important;}.mob-nav{display:flex !important;}
  .desk-only{display:none !important;}.mob-pb{padding-bottom:72px !important;}
}
.mob-nav{display:none;}

/* ── HYPNOTIC BACKGROUND GRID ──────────────────────────────────────────────── */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image:
    linear-gradient(rgba(183,110,121,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(183,110,121,0.04) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
}

/* Concentric rings pulse — hypnosis visual */
body::after {
  content: '';
  position: fixed;
  top: 50%;
  left: 50%;
  width: 600px;
  height: 600px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(183,110,121,0.03) 0%,
    rgba(212,160,144,0.02) 30%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 0;
  animation: slowPulse 8s ease-in-out infinite;
}

@keyframes slowPulse {
  0%, 100% { transform: translate(-50%,-50%) scale(1); opacity: 0.6; }
  50% { transform: translate(-50%,-50%) scale(1.08); opacity: 1; }
}

/* All app content sits above the grid */
#root { position: relative; z-index: 1; }

`;
