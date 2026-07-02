export const T = {
  bgRoot: "#000000",
  bgSoft: "#050403",
  surfaceBase: "#0a0908",
  surfaceRaised: "#100f0d",
  surfaceHigh: "#161512",
  borderSoft: "#1e1c18",
  borderGlow: "#2a2820",

  // Text — cream white and peach. Zero brown. Zero stone.
  textPrimary:   "#f2ece0",   // warm cream white
  textSecondary: "#e8d0a8",   // soft peach champagne
  textMuted:     "#c8a880",   // warm peach — readable
  textFaint:     "#907860",   // dim peach — still visible, not brown

  // Accents — rose gold to peach only
  gold:      "#C8956A",   // rose gold — THE primary accent
  roseGold:  "#C8956A",
  rose:      "#C8956A",
  champagne: "#C8956A",
  champSoft: "#d4a87a",
  success:   "#4a9a5a",
  warning:   "#C8956A",
  danger:    "#C8956A",
  blood:     "#C8956A",

  // Single gradient: deep gold → rose gold → peach
  grad:  "linear-gradient(90deg,#C8A050,#C8956A)",
  gradV: "linear-gradient(135deg,#C8A050,#C8956A)",

  bgGrad:      "#000000",
  cardBg:      "rgba(10,9,8,0.96)",
  premiumCard: "linear-gradient(135deg,rgba(16,15,13,0.98),rgba(8,7,6,0.98))",
  border:      "1px solid #1e1c18",
  glow:        "0 0 40px rgba(200,149,106,0.1)",
  glowChamp:   "0 0 30px rgba(200,149,106,0.14)",
};

export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Inter:wght@300;400;500;600;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{
  background:#000;
  color:#f2ece0;
  font-family:'Inter',sans-serif;
  font-size:16px;
  line-height:1.65;
  overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
  min-height:100vh;
}
button,input,textarea,select{font-family:'Inter',sans-serif;}
input,textarea{
  background:#0a0908;
  border:1px solid #1e1c18;
  color:#f2ece0;
  border-radius:10px;
  padding:13px 16px;
  font-size:15px;
  width:100%;
  outline:none;
  transition:border-color 0.2s,box-shadow 0.2s;
}
input::placeholder,textarea::placeholder{color:#3a3028;}
input:focus,textarea:focus{
  border-color:#C8956A66;
  box-shadow:0 0 0 3px rgba(200,149,106,0.08);
}
select{
  background:#0a0908;border:1px solid #1e1c18;color:#f2ece0;
  border-radius:10px;padding:12px 16px;font-size:15px;
  outline:none;cursor:pointer;width:100%;
}
::-webkit-scrollbar{width:3px;height:3px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:#1e1c18;border-radius:2px;}
.wm{font-family:'Cormorant Garamond',serif;font-style:italic;}
.fade{animation:fadeIn 0.3s ease;}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
.wave span{
  display:inline-block;width:3px;border-radius:2px;
  background:linear-gradient(180deg,#C8A050,#C8956A);
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
  0%{box-shadow:0 0 0 0 rgba(200,149,106,0.4);}
  70%{box-shadow:0 0 0 20px rgba(200,149,106,0);}
  100%{box-shadow:0 0 0 0 rgba(200,149,106,0);}
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
`;
