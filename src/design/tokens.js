export const T = {
  // Backgrounds
  bgRoot: "#090407",
  bgSoft: "#12070D",
  surfaceBase: "#170912",
  surfaceRaised: "#1F0C18",
  surfaceHigh: "#2A1221",

  // Borders
  borderSoft: "#3A2630",
  borderGlow: "#5A3345",

  // Text
  textPrimary: "#F6EFE6",
  textSecondary: "#C8B5AD",
  textMuted: "#9A8580",
  textFaint: "#6F5B58",

  // Accents
  rose: "#B9828E",
  blood: "#7C263F",
  champagne: "#D7B982",
  champSoft: "#BFA06B",
  success: "#8DAF7A",
  warning: "#C69A5B",
  danger: "#B85C68",

  // Gradients (as strings for inline use)
  bgGrad: "linear-gradient(135deg, #090407 0%, #170912 50%, #27101D 100%)",
  cardBg: "rgba(31,12,24,0.86)",
  premiumCard: "linear-gradient(135deg, rgba(42,18,33,0.95) 0%, rgba(23,9,18,0.95) 100%)",
  border: "1px solid rgba(215,185,130,0.14)",
  glow: "0 0 40px rgba(185,130,142,0.08)",
  glowChamp: "0 0 30px rgba(215,185,130,0.12)",
};

export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }

body {
  background: linear-gradient(135deg, #090407 0%, #170912 50%, #27101D 100%);
  background-attachment: fixed;
  color: #F6EFE6;
  font-family: 'Manrope', sans-serif;
  font-size: 15px;
  line-height: 1.6;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}

button, input, textarea, select { font-family: 'Manrope', sans-serif; }

input, textarea {
  background: rgba(31,12,24,0.6);
  border: 1px solid rgba(215,185,130,0.14);
  color: #F6EFE6;
  border-radius: 10px;
  padding: 13px 16px;
  font-size: 15px;
  width: 100%;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  font-family: 'Manrope', sans-serif;
}
input::placeholder, textarea::placeholder { color: #6F5B58; }
input:focus, textarea:focus {
  border-color: rgba(215,185,130,0.4);
  box-shadow: 0 0 0 3px rgba(215,185,130,0.06);
}

select {
  background: rgba(31,12,24,0.86);
  border: 1px solid rgba(215,185,130,0.14);
  color: #F6EFE6;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 14px;
  outline: none;
  cursor: pointer;
  width: 100%;
}

::-webkit-scrollbar { width: 3px; height: 3px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(215,185,130,0.15); border-radius: 2px; }

.wm { font-family: 'Cormorant Garamond', serif; }

.fade { animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

.wave span {
  display: inline-block;
  width: 3px;
  border-radius: 2px;
  background: linear-gradient(180deg, #D7B982, #B9828E);
  animation: wave 1.4s ease-in-out infinite;
}
@keyframes wave {
  0%, 100% { transform: scaleY(0.3); opacity: 0.5; }
  50% { transform: scaleY(1); opacity: 1; }
}

.ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid;
  pointer-events: none;
  top: 50%; left: 50%;
  animation: breathe 6s ease-in-out infinite;
}
@keyframes breathe {
  0%, 100% { transform: translate(-50%,-50%) scale(1); opacity: var(--op); }
  50% { transform: translate(-50%,-50%) scale(1.05); opacity: calc(var(--op) * 2); }
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(185,130,142,0.4); }
  70% { box-shadow: 0 0 0 20px rgba(185,130,142,0); }
  100% { box-shadow: 0 0 0 0 rgba(185,130,142,0); }
}
.pulse { animation: pulse 2s infinite; }

@keyframes slide { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

@media (max-width: 900px) {
  .hide-mob { display: none !important; }
  .mob-col { flex-direction: column !important; }
  .grid-2 { grid-template-columns: 1fr !important; }
  .grid-3 { grid-template-columns: 1fr !important; }
  .grid-4 { grid-template-columns: 1fr 1fr !important; }
  .mob-nav { display: flex !important; }
  .desk-only { display: none !important; }
  .mob-pb { padding-bottom: 72px !important; }
}
.mob-nav { display: none; }
`;
