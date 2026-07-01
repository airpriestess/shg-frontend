export const T = {
  bgRoot: "#000000",
  bgSoft: "#060401",
  surfaceBase: "#0a0800",
  surfaceRaised: "#0f0a02",
  surfaceHigh: "#140e03",
  borderSoft: "#1e1608",
  borderGlow: "#2a1e08",

  // Text — NO brown. Cream, rose gold, soft white.
  textPrimary: "#f0e8d8",
  textSecondary: "#d4a868",
  textMuted: "#9a8060",
  textFaint: "#5a4830",

  // Accents
  gold: "#C8892A",
  roseGold: "#B76E79",
  rose: "#C4365A",
  champagne: "#C8892A",
  champSoft: "#B76E79",
  success: "#3a8a4a",
  warning: "#C69A5B",
  danger: "#C4365A",
  blood: "#B76E79",

  bgGrad: "linear-gradient(135deg, #000000 0%, #060401 50%, #0a0500 100%)",
  cardBg: "rgba(10,8,0,0.92)",
  premiumCard: "linear-gradient(135deg, rgba(15,11,1,0.95) 0%, rgba(8,6,0,0.95) 100%)",
  border: "1px solid #1e1608",
  glow: "0 0 40px rgba(183,110,121,0.08)",
  glowChamp: "0 0 30px rgba(183,110,121,0.12)",
};

export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500;1,600&family=Inter:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }

body {
  background: #000000;
  color: #f0e8d8;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  line-height: 1.6;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}

button, input, textarea, select { font-family: 'Inter', sans-serif; }

input, textarea {
  background: #080601;
  border: 1px solid #1e1608;
  color: #f0e8d8;
  border-radius: 10px;
  padding: 13px 16px;
  font-size: 15px;
  width: 100%;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  font-family: 'Inter', sans-serif;
}
input::placeholder, textarea::placeholder { color: #3a2e1a; }
input:focus, textarea:focus {
  border-color: #B76E7966;
  box-shadow: 0 0 0 3px rgba(183,110,121,0.08);
}

select {
  background: #080601;
  border: 1px solid #1e1608;
  color: #f0e8d8;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 14px;
  outline: none;
  cursor: pointer;
  width: 100%;
}

::-webkit-scrollbar { width: 3px; height: 3px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #1e1608; border-radius: 2px; }

.wm { font-family: 'Cormorant Garamond', serif; font-style: italic; }

.fade { animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

.wave span {
  display: inline-block;
  width: 3px;
  border-radius: 2px;
  background: linear-gradient(180deg, #C8892A, #B76E79);
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
  0% { box-shadow: 0 0 0 0 rgba(183,110,121,0.4); }
  70% { box-shadow: 0 0 0 20px rgba(183,110,121,0); }
  100% { box-shadow: 0 0 0 0 rgba(183,110,121,0); }
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
