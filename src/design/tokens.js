export const T = {
  bgRoot: "#000000",
  bgSoft: "#050402",
  surfaceBase: "#0c0b08",
  surfaceRaised: "#111008",
  surfaceHigh: "#161408",
  borderSoft: "#242014",
  borderGlow: "#302c18",

  // Text — cream and peach. Zero brown.
  textPrimary:   "#f0e8d8",   // warm cream
  textSecondary: "#d8c8a0",   // soft champagne
  textMuted:     "#a09070",   // warm stone — readable, not brown
  textFaint:     "#605840",   // dim stone — still visible

  // Accents — gold to peach rose gold ombre only
  gold:      "#C8A050",
  roseGold:  "#C8956A",
  rose:      "#C8906A",
  champagne: "#C8A050",
  champSoft: "#C8956A",
  success:   "#4a9a5a",
  warning:   "#C8A050",
  danger:    "#C8906A",
  blood:     "#C8956A",

  grad:  "linear-gradient(90deg,#C8A050,#C8956A)",
  gradV: "linear-gradient(135deg,#C8A050,#C8956A)",

  bgGrad:      "linear-gradient(135deg,#000000 0%,#050402 50%,#080600 100%)",
  cardBg:      "rgba(12,11,8,0.95)",
  premiumCard: "linear-gradient(135deg,rgba(17,16,8,0.98) 0%,rgba(8,7,4,0.98) 100%)",
  border:      "1px solid #242014",
  glow:        "0 0 40px rgba(200,160,80,0.08)",
  glowChamp:   "0 0 30px rgba(200,160,80,0.12)",
};

export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Inter:wght@300;400;500;600;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}

body{
  background:#000;
  color:#f0e8d8;
  font-family:'Inter',sans-serif;
  font-size:16px;
  line-height:1.65;
  overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
  min-height:100vh;
}

button,input,textarea,select{font-family:'Inter',sans-serif;}

input,textarea{
  background:#0c0b08;
  border:1px solid #242014;
  color:#f0e8d8;
  border-radius:10px;
  padding:13px 16px;
  font-size:15px;
  width:100%;
  outline:none;
  transition:border-color 0.2s,box-shadow 0.2s;
}
input::placeholder,textarea::placeholder{color:#403820;}
input:focus,textarea:focus{
  border-color:#C8A05066;
  box-shadow:0 0 0 3px rgba(200,160,80,0.08);
}

select{
  background:#0c0b08;
  border:1px solid #242014;
  color:#f0e8d8;
  border-radius:10px;
  padding:12px 16px;
  font-size:15px;
  outline:none;
  cursor:pointer;
  width:100%;
}

::-webkit-scrollbar{width:3px;height:3px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:#242014;border-radius:2px;}

.wm{font-family:'Cormorant Garamond',serif;font-style:italic;}

.fade{animation:fadeIn 0.3s ease;}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}

.wave span{
  display:inline-block;width:3px;border-radius:2px;
  background:linear-gradient(180deg,#C8A050,#C8956A);
  animation:wave 1.4s ease-in-out infinite;
}
@keyframes wave{
  0%,100%{transform:scaleY(0.3);opacity:0.5;}
  50%{transform:scaleY(1);opacity:1;}
}

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
  0%{box-shadow:0 0 0 0 rgba(200,160,80,0.4);}
  70%{box-shadow:0 0 0 20px rgba(200,160,80,0);}
  100%{box-shadow:0 0 0 0 rgba(200,160,80,0);}
}
.pulse{animation:pulse 2s infinite;}

@keyframes slide{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}

@media(max-width:900px){
  .hide-mob{display:none !important;}
  .mob-col{flex-direction:column !important;}
  .grid-2{grid-template-columns:1fr !important;}
  .grid-3{grid-template-columns:1fr !important;}
  .grid-4{grid-template-columns:1fr 1fr !important;}
  .mob-nav{display:flex !important;}
  .desk-only{display:none !important;}
  .mob-pb{padding-bottom:72px !important;}
}
.mob-nav{display:none;}
`;
