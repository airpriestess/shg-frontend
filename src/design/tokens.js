const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Jost:wght@300;400;500;600;700;800&display=swap');

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
input,textarea{
  background:#0a0908;border:1px solid #201e1c;color:#f2ece4;
  border-radius:10px;padding:13px 16px;font-size:15px;width:100%;
  outline:none;transition:border-color 0.2s,box-shadow 0.2s;
}
input::placeholder,textarea::placeholder{color:#3a3430;}
input:focus,textarea:focus{border-color:#B76E7966;box-shadow:0 0 0 3px rgba(183,110,121,0.08);}
select{background:#0a0908;border:1px solid #201e1c;color:#f2ece4;border-radius:10px;padding:10px 14px;outline:none;}

/* ── SECTION WRAPPER
   Elegant desktop: content lives in a comfortable column with generous side margins.
   On desktop the max-width creates white space on both sides — not edge to edge.
   On mobile it just uses 20px gutters. ──────────────────────────────────────── */
.wrap{
  width:100%;
  max-width:1100px;
  margin-left:auto;
  margin-right:auto;
  padding-left:clamp(20px,6vw,80px);
  padding-right:clamp(20px,6vw,80px);
}

.hero-wrap{
  width:100%;
  max-width:780px;
  margin-left:auto;
  margin-right:auto;
  padding-left:clamp(20px,6vw,60px);
  padding-right:clamp(20px,6vw,60px);
  text-align:center;
}

/* ── GRID SYSTEM ────────────────────────────────────────────────────────────── */
.g2{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
.price-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.proof-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
.steps-grid{
  display:grid;
  grid-template-columns:1fr 28px 1fr 28px 1fr 28px 1fr;
  gap:0;
  align-items:start;
}
.comp-table{display:grid;grid-template-columns:1fr 1fr;}

/* ── MARQUEE ──────────────────────────────────────────────────────────────── */
@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
.marquee-track{display:flex;width:max-content;animation:marquee 24s linear infinite;}
.marquee-track:hover{animation-play-state:paused;}

/* ── ANIMATIONS ───────────────────────────────────────────────────────────── */
@keyframes wave{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.6)}}
@keyframes slowPulse{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.6}50%{transform:translate(-50%,-50%) scale(1.08);opacity:1}}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.fade{animation:fadeUp .45s ease both;}
.wm{font-family:'Cormorant Garamond',serif;font-style:italic;}
.pulse{animation:slowPulse 1.5s ease-in-out infinite;}
.hide-mob{display:block;}
.mob-nav{display:none;}

/* ── HYPNOTIC BACKGROUND ──────────────────────────────────────────────────── */
body::before{
  content:'';position:fixed;inset:0;pointer-events:none;z-index:0;
  background-image:
    linear-gradient(rgba(183,110,121,0.04) 1px,transparent 1px),
    linear-gradient(90deg,rgba(183,110,121,0.04) 1px,transparent 1px);
  background-size:60px 60px;
  mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%);
  -webkit-mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%);
}
body::after{
  content:'';position:fixed;top:50%;left:50%;width:600px;height:600px;
  transform:translate(-50%,-50%);border-radius:50%;
  background:radial-gradient(circle,rgba(183,110,121,0.03) 0%,rgba(212,160,144,0.02) 30%,transparent 70%);
  pointer-events:none;z-index:0;animation:slowPulse 8s ease-in-out infinite;
}
#root{position:relative;z-index:1;}

/* ── MOBILE: 700px and below ─────────────────────────────────────────────── */
@media(max-width:700px){

  /* gutters */
  .wrap{padding-left:18px!important;padding-right:18px!important;}
  .hero-wrap{padding-left:18px!important;padding-right:18px!important;}

  /* ALL multi-column grids collapse to single column */
  .g2,.g3,.g4,.price-grid{
    display:flex!important;
    flex-direction:column!important;
    gap:16px!important;
  }

  /* proof wall: 2 columns on mobile is fine */
  .proof-grid{
    display:grid!important;
    grid-template-columns:1fr 1fr!important;
    gap:8px!important;
  }

  /* comparison table: stack vertically */
  .comp-table{
    display:flex!important;
    flex-direction:column!important;
  }

  /* steps: single column, no arrows */
  .steps-grid{
    display:flex!important;
    flex-direction:column!important;
    gap:16px!important;
  }
  .step-arrow{display:none!important;}

  /* nav */
  .hide-mob{display:none!important;}
  .mob-nav{display:flex!important;}
  .mob-pb{padding-bottom:72px!important;}

  /* hero: no huge top padding */
  .hero-section{
    padding-top:88px!important;
    padding-bottom:40px!important;
    min-height:auto!important;
  }

  /* text that runs edge to edge */
  .science-body{
    font-size:15px!important;
    padding:0!important;
  }
}

/* ── TABLET: 701px–1024px ────────────────────────────────────────────────── */
@media(min-width:701px) and (max-width:1024px){
  .price-grid{grid-template-columns:1fr!important;max-width:480px;margin:0 auto;}
  .steps-grid{
    grid-template-columns:1fr 24px 1fr 24px 1fr 24px 1fr!important;
  }
}
`;

const style = document.createElement('style');
style.textContent = css;
document.head.appendChild(style);

export const T = {
  black:        '#000000',
  bg:           '#0a0908',
  bg2:          '#0f0e0c',
  bg3:          '#141210',
  border:       '1px solid #201e1c',
  borderC:      '#201e1c',
  rose:         '#B76E79',
  roseGold:     '#B76E79',
  champagne:    '#d4a090',
  gold:         '#C8892A',
  cream:        '#f0e8d8',
  textPrimary:  '#f2ece4',
  textPri:      '#f2ece4',
  textSecondary:'#d4c8bc',
  textMuted:    '#b09888',
  textFaint:    '#786860',
  cardBg:       '#0a0908',
  danger:       '#8a3030',
};

export default T;
