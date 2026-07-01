import { useState, useEffect } from "react";

// ── BRAND ─────────────────────────────────────────────────────
const C = {
  black: "#000000",
  surface: "#0a0800",
  card: "#0d0900",
  card2: "#110c02",
  border: "#2a1e0a",
  border2: "#1a1208",
  gold: "#C8892A",
  rose: "#C4365A",
  text: "#e8e0d0",
  text2: "#c8a870",
  muted: "#6a5a3a",
  dim: "#3a2a14",
  green: "#4a9a5a",
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap');

*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:#000;color:#e8e0d0;font-family:'Inter',sans-serif;min-height:100vh;overflow-x:hidden}
button,input,select,textarea{font-family:'Inter',sans-serif}
input,textarea{background:#0a0700;border:0.5px solid #2a1e0a;color:#e8e0d0;border-radius:8px;padding:10px 14px;font-size:14px;width:100%;outline:none;transition:border-color 0.2s}
input:focus{border-color:#C8892A66}
::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-thumb{background:#2a1e0a;border-radius:2px}

.wm{font-family:'Cormorant Garamond',serif;font-style:italic;background:linear-gradient(90deg,#C8892A,#C4365A);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.serif{font-family:'Cormorant Garamond',serif;font-style:italic}
.serif-plain{font-family:'Cormorant Garamond',serif;font-style:italic;color:#e8e0d0}

.fade{animation:fi 0.4s ease}
@keyframes fi{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

/* Hypnosis rings */
.rings{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;z-index:0}
.ring{position:absolute;border-radius:50%;border:0.5px solid #C8892A;transform:translate(-50%,-50%);animation:pulse-ring 4s ease-in-out infinite}
.ring:nth-child(1){width:200px;height:200px;opacity:0.12;animation-delay:0s}
.ring:nth-child(2){width:350px;height:350px;opacity:0.08;animation-delay:0.8s}
.ring:nth-child(3){width:520px;height:520px;opacity:0.05;animation-delay:1.6s}
.ring:nth-child(4){width:700px;height:700px;opacity:0.03;animation-delay:2.4s}
@keyframes pulse-ring{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:var(--o,0.08)}50%{transform:translate(-50%,-50%) scale(1.04);opacity:calc(var(--o,0.08)*1.6)}}

/* Glow pulse on CTA */
.glow-btn{position:relative}
.glow-btn::after{content:'';position:absolute;inset:-8px;border-radius:16px;background:radial-gradient(ellipse,#C8892A22 0%,transparent 70%);animation:glow-pulse 3s ease-in-out infinite;pointer-events:none}
@keyframes glow-pulse{0%,100%{opacity:0.4}50%{opacity:1}}

.wave span{display:inline-block;width:2px;background:#C8892A;border-radius:1px;margin:0 1px;animation:wv 1s ease-in-out infinite}
.wave span:nth-child(1){height:5px;animation-delay:0s}
.wave span:nth-child(2){height:11px;animation-delay:.1s}
.wave span:nth-child(3){height:16px;animation-delay:.2s}
.wave span:nth-child(4){height:9px;animation-delay:.15s}
.wave span:nth-child(5){height:13px;animation-delay:.25s}
@keyframes wv{0%,100%{transform:scaleY(0.4)}50%{transform:scaleY(1)}}

/* Mobile nav */
.bottom-nav{display:none}
@media(max-width:768px){
  .bottom-nav{display:flex;position:fixed;bottom:0;left:0;right:0;background:#050300;border-top:0.5px solid #2a1e0a;z-index:100;padding-bottom:env(safe-area-inset-bottom)}
  .desktop-nav{display:none!important}
  .grid-2{grid-template-columns:1fr!important}
  .grid-3{grid-template-columns:1fr!important}
  .hero-title{font-size:clamp(36px,8vw,52px)!important}
  .section-pad{padding:48px 20px!important}
  .price-big{font-size:32px!important}
  .before-after-grid{grid-template-columns:1fr!important}
  .track-cats{flex-wrap:wrap!important}
}
`;

// ── SHARED ─────────────────────────────────────────────────────
function Btn({ children, onClick, full, outline, small, disabled, rose }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: full ? "100%" : "auto",
      padding: small ? "8px 16px" : "13px 26px",
      background: disabled ? "#1a1208" : outline ? "transparent" : rose
        ? `linear-gradient(90deg,${C.rose},#8a1a3a)`
        : `linear-gradient(90deg,${C.gold},${C.rose})`,
      border: outline ? `0.5px solid ${C.gold}66` : "none",
      borderRadius: 10,
      color: disabled ? C.dim : outline ? C.gold : "#000",
      fontSize: small ? 12 : 14,
      fontWeight: 600,
      letterSpacing: "0.04em",
      cursor: disabled ? "not-allowed" : "pointer",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      gap: 6, transition: "opacity 0.2s, transform 0.15s",
      minHeight: 44,
    }}
      onMouseEnter={e => !disabled && (e.currentTarget.style.transform = "translateY(-1px)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
    >{children}</button>
  );
}

function Label({ children, color }) {
  return (
    <div style={{ fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", color: color || C.muted, fontWeight: 600, marginBottom: 12 }}>
      {children}
    </div>
  );
}

function Tag({ label, color }) {
  const map = {
    sp: { bg: "#2a0a14", t: "#c4365a" },
    money: { bg: "#0a1a08", t: "#5a9a4a" },
    beauty: { bg: "#1a1208", t: "#c8892a" },
    sleep: { bg: "#080a1a", t: "#4a6ab0" },
    dna: { bg: "#0a0a1a", t: "#7a5ab0" },
    identity: { bg: "#1a0a0a", t: "#b05050" },
  };
  const c = map[color] || map.sp;
  return (
    <span style={{ padding: "2px 8px", background: c.bg, color: c.t, borderRadius: 20, fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", flexShrink: 0 }}>
      {label}
    </span>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("landing"); // landing | proofos | onboard | portal
  const [tier, setTier] = useState("audio");
  const [portalTier, setPortalTier] = useState("goddess");

  const go = (s, t) => { if (t) setTier(t); setScreen(s); window.scrollTo(0, 0); };

  return (
    <>
      <style>{css}</style>
      {screen === "landing" && <Landing onJoin={(t) => go("onboard", t)} onProofOS={() => go("proofos")} onDemo={() => go("portal")} />}
      {screen === "proofos" && <ProofOSPage onBack={() => go("landing")} onJoin={(t) => go("onboard", t)} />}
      {screen === "onboard" && <Onboard tier={tier} onSuccess={() => { setPortalTier(tier === "goddess" ? "goddess" : "audio"); go("portal"); }} onBack={() => go("landing")} />}
      {screen === "portal" && <Portal userTier={portalTier} onSignOut={() => go("landing")} onUpgrade={() => go("proofos")} />}
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// LANDING PAGE
// ════════════════════════════════════════════════════════════════
function Landing({ onJoin, onProofOS, onDemo }) {
  const [billing, setBilling] = useState("monthly");
  const [activeCategory, setActiveCategory] = useState("sp");

  const categories = [
    {
      id: "sp", label: "SP & Love", tagline: "He was always going to come back.",
      tracks: [
        { title: "He's already on his way back", freq: "432hz", dur: "30 min", type: "Subliminal", free: true },
        { title: "He's obsessed and he knows it", freq: "432hz", dur: "28 min", type: "Subliminal" },
        { title: "I never chase — he catches up", freq: "528hz", dur: "26 min", type: "Hypnosis" },
        { title: "No contact — he comes back first", freq: "432hz", dur: "32 min", type: "Subliminal" },
      ]
    },
    {
      id: "money", label: "Money", tagline: "Money behaves around me.",
      tracks: [
        { title: "Money is obsessed with me", freq: "528hz", dur: "25 min", type: "Hypnosis", free: true },
        { title: "Lucky girl, unlimited", freq: "528hz", dur: "22 min", type: "Subliminal" },
        { title: "Unexpected money finds me first", freq: "963hz", dur: "27 min", type: "Frequency + Subliminal" },
        { title: "I receive beyond what I ask", freq: "528hz", dur: "35 min", type: "Hypnosis" },
      ]
    },
    {
      id: "beauty", label: "Beauty", tagline: "I was born the exception.",
      tracks: [
        { title: "Gorgeous is my default setting", freq: "432hz", dur: "35 min", type: "Subliminal" },
        { title: "I get prettier every single day", freq: "432hz", dur: "25 min", type: "Subliminal" },
        { title: "Everyone notices — I don't have to", freq: "528hz", dur: "24 min", type: "Hypnosis" },
        { title: "My face is shifting", freq: "432hz", dur: "40 min", type: "Frequency + Subliminal" },
      ]
    },
    {
      id: "identity", label: "Identity", tagline: "Reality is catching up to me.",
      tracks: [
        { title: "I've always been the prize", freq: "LOA", dur: "30 min", type: "Subliminal" },
        { title: "I said so, therefore it is", freq: "528hz", dur: "32 min", type: "Hypnosis" },
        { title: "Reality rearranges for me", freq: "963hz", dur: "33 min", type: "Frequency + Subliminal" },
        { title: "She version of me", freq: "432hz", dur: "28 min", type: "Subliminal" },
      ]
    },
    {
      id: "dna", label: "DNA", tagline: "My blood remembers who I am.",
      tracks: [
        { title: "DNA activation ceremony", freq: "963hz", dur: "45 min", type: "Frequency + Subliminal" },
        { title: "I override what I inherited", freq: "963hz", dur: "40 min", type: "Frequency + Subliminal" },
        { title: "Cellular regeneration", freq: "963hz", dur: "38 min", type: "Frequency" },
      ]
    },
    {
      id: "sleep", label: "Sleep", tagline: "I wake up as her.",
      tracks: [
        { title: "I manifest while I sleep", freq: "Delta", dur: "60 min", type: "Sleep subliminal" },
        { title: "I wake up as her", freq: "Theta", dur: "55 min", type: "Sleep subliminal" },
        { title: "Overnight identity shift", freq: "Delta", dur: "8 hrs", type: "Sleep subliminal" },
      ]
    },
  ];

  const activeCat = categories.find(c => c.id === activeCategory);

  const prices = {
    audio: { monthly: "€19.99", annual: "€192", perMonth: "€16/mo" },
    goddess: { monthly: "€33", annual: "€317", perMonth: "€26.40/mo" },
  };

  return (
    <div style={{ minHeight: "100vh", background: C.black }}>

      {/* NAV */}
      <nav className="desktop-nav" style={{ position: "sticky", top: 0, zIndex: 100, padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,0,0.92)", borderBottom: `0.5px solid ${C.border}`, backdropFilter: "blur(16px)" }}>
        <span className="wm" style={{ fontSize: 18 }}>Self Hypnosis Goddess</span>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button onClick={onProofOS} style={{ background: "none", border: `0.5px solid ${C.border}`, borderRadius: 6, padding: "6px 14px", color: C.muted, fontSize: 12, cursor: "pointer", letterSpacing: "0.08em" }}>ProofOS ✦</button>
          <button onClick={onDemo} style={{ background: "none", border: "none", color: C.muted, fontSize: 12, cursor: "pointer" }}>Preview</button>
          <Btn small onClick={() => onJoin("audio")}>Enter the portal</Btn>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ position: "relative", padding: "90px 24px 80px", textAlign: "center", overflow: "hidden" }}>
        <div className="rings" style={{ top: "50%", left: "50%" }}>
          {[1, 2, 3, 4].map(i => <div key={i} className="ring" style={{ "--o": 0.1 / i }} />)}
        </div>
        <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto" }}>
          <Label>The private vault · Reshma Oracle · Barcelona</Label>
          <h1 className="serif-plain hero-title" style={{ fontSize: "clamp(38px,6vw,64px)", lineHeight: 1.1, marginBottom: 24, background: `linear-gradient(135deg,${C.text} 0%,${C.gold} 50%,${C.rose} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Subliminal audio and<br />hypnosis tracks your<br />subconscious has been<br />waiting for.
          </h1>
          <p style={{ fontSize: 16, color: "#8a7a5a", lineHeight: 1.85, marginBottom: 10, maxWidth: 480, margin: "0 auto 10px" }}>
            Not on YouTube. No ads at 3am. Original frequencies.<br />
            You close your eyes searching.<br />
            You open them changed.
          </p>
          <p style={{ fontSize: 13, color: C.muted, marginBottom: 32 }}>
            50+ subliminal, hypnosis and frequency audios. 4 new tracks every week.
          </p>
          <div className="glow-btn" style={{ display: "inline-block", marginBottom: 16 }}>
            <Btn onClick={() => onJoin("audio")}>Enter the portal</Btn>
          </div>
          <div style={{ fontSize: 11, color: C.dim }}>Cancel anytime · Stripe · No download · Any device</div>
        </div>
      </div>

      {/* TRANSFORMATION TIMELINE */}
      <div className="section-pad" style={{ padding: "64px 24px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Label>What actually happens</Label>
          <div className="serif-plain" style={{ fontSize: "clamp(28px,4vw,40px)", lineHeight: 1.2 }}>
            One session changes the feeling.<br />Thirty days changes the reality.
          </div>
        </div>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {[
            { time: "After your first session", icon: "☾", title: "The feeling shifts.", body: "Something loosens. The obsessive loop quiets. You fall asleep before the track ends. You wake up and realise you stopped caring about the thing that was consuming you. That is the subconscious receiving." },
            { time: "After one week", icon: "◈", title: "Reality starts moving.", body: "Small things first. A message you were not expecting. Money from somewhere you forgot about. Someone mentioning your name in a room you were not in. The signs are always small before they are undeniable." },
            { time: "After thirty days", icon: "✦", title: "The evidence is impossible to ignore.", body: "You will have things you cannot explain. Desires that arrived faster than logic allows. A version of yourself you do not fully recognise yet — calmer, more magnetic, more certain. ProofOS exists to show you the pattern." },
          ].map((s, i) => (
            <div key={i} style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
              <div style={{ fontSize: 24, color: C.gold, marginBottom: 12 }}>{s.icon}</div>
              <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: C.muted, marginBottom: 8 }}>{s.time}</div>
              <div className="serif-plain" style={{ fontSize: 18, marginBottom: 12 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: "#8a7a5a", lineHeight: 1.75 }}>{s.body}</div>
            </div>
          ))}
        </div>
      </div>

      {/* BEFORE & AFTER */}
      <div className="section-pad" style={{ padding: "64px 24px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Label>The shift</Label>
          <div className="serif-plain" style={{ fontSize: "clamp(28px,4vw,40px)", lineHeight: 1.2, marginBottom: 12 }}>
            It starts inside.<br />Then your outside world catches up.
          </div>
        </div>
        <div className="before-after-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            {
              cat: "SP & Love", catColor: C.rose,
              before: {
                label: "Before",
                visual: (
                  <div style={{ background: "#0a0008", borderRadius: 12, padding: 16, fontFamily: "monospace" }}>
                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>Messages</div>
                    <div style={{ background: "#1a0a14", borderRadius: 8, padding: "10px 12px", marginBottom: 6 }}>
                      <div style={{ fontSize: 12, color: "#8a6a7a", marginBottom: 4 }}>You · 3 days ago</div>
                      <div style={{ fontSize: 13, color: "#c8a8b8" }}>You up?</div>
                      <div style={{ fontSize: 10, color: C.dim, marginTop: 4 }}>Delivered</div>
                    </div>
                    <div style={{ fontSize: 11, color: "#5a3a4a", textAlign: "center", marginTop: 8 }}>No reply</div>
                  </div>
                ),
                text: "Checking. Waiting. Wondering."
              },
              after: {
                label: "After",
                visual: (
                  <div style={{ background: "#08000a", borderRadius: 12, padding: 16 }}>
                    <div style={{ background: `linear-gradient(90deg,${C.gold}22,${C.rose}22)`, border: `0.5px solid ${C.gold}44`, borderRadius: 10, padding: "10px 14px", marginBottom: 8 }}>
                      <div style={{ fontSize: 10, color: C.muted, marginBottom: 4 }}>Him · 11:43pm</div>
                      <div style={{ fontSize: 13, color: C.text2 }}>"Hey, been thinking about you"</div>
                    </div>
                    <div style={{ fontSize: 11, color: C.gold, textAlign: "center" }}>Notification received ✦</div>
                  </div>
                ),
                text: "You had already stopped waiting."
              }
            },
            {
              cat: "Money", catColor: C.green,
              before: {
                label: "Before",
                visual: (
                  <div style={{ background: "#00080a", borderRadius: 12, padding: 16 }}>
                    <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>Current balance</div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: "#5a7a6a", marginBottom: 12 }}>£247.83</div>
                    {[["Rent", "-£900"], ["Electric", "-£84"], ["Phone", "-£45"]].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.dim, marginBottom: 4 }}>
                        <span>{k}</span><span style={{ color: "#8a4a4a" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                ),
                text: "Counting what is left."
              },
              after: {
                label: "After",
                visual: (
                  <div style={{ background: "#00080a", borderRadius: 12, padding: 16 }}>
                    <div style={{ background: "#0a1a0a", border: `0.5px solid ${C.green}44`, borderRadius: 10, padding: "10px 14px", marginBottom: 8 }}>
                      <div style={{ fontSize: 10, color: "#4a9a5a", marginBottom: 4 }}>✓ Payment received</div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: "#6ab06a" }}>€1,847.00</div>
                      <div style={{ fontSize: 11, color: C.dim, marginTop: 4 }}>Sender: ████████</div>
                    </div>
                    <div style={{ fontSize: 11, color: "#6ab06a", textAlign: "center" }}>Unexpected. Exactly as asked.</div>
                  </div>
                ),
                text: "Unexpected. Exactly as asked."
              }
            },
            {
              cat: "Beauty & Identity", catColor: C.gold,
              before: {
                label: "Before",
                visual: (
                  <div style={{ background: "#080808", borderRadius: 12, padding: 16, textAlign: "center" }}>
                    <div style={{ width: 70, height: 70, borderRadius: "50%", background: "#1a1a1a", border: `1px solid ${C.border}`, margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 28, filter: "grayscale(1) opacity(0.4)" }}>🪞</span>
                    </div>
                    <div style={{ fontSize: 13, color: "#6a5a5a", lineHeight: 1.5 }}>Picking apart<br />every detail</div>
                  </div>
                ),
                text: "Looking for what is wrong."
              },
              after: {
                label: "After",
                visual: (
                  <div style={{ background: "#0a0800", borderRadius: 12, padding: 16, textAlign: "center" }}>
                    <div style={{ width: 70, height: 70, borderRadius: "50%", background: `radial-gradient(circle,${C.gold}22,transparent)`, border: `1px solid ${C.gold}44`, margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 20px ${C.gold}22` }}>
                      <span style={{ fontSize: 28 }}>✨</span>
                    </div>
                    <div style={{ fontSize: 13, color: C.text2, lineHeight: 1.5 }}>"What are you<br />doing differently?"</div>
                  </div>
                ),
                text: "They notice before you do."
              }
            }
          ].map((item, i) => (
            <div key={i} style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
              <div style={{ padding: "10px 16px", borderBottom: `0.5px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, color: item.catColor, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>{item.cat}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                {[item.before, item.after].map((side, j) => (
                  <div key={j} style={{ padding: 14, borderRight: j === 0 ? `0.5px solid ${C.border}` : "none" }}>
                    <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: j === 0 ? "#5a4a4a" : C.gold, marginBottom: 10, fontWeight: 600 }}>{side.label}</div>
                    {side.visual}
                    <div style={{ fontSize: 11, color: j === 0 ? "#6a5a5a" : C.text2, marginTop: 10, fontStyle: "italic", lineHeight: 1.5 }}>{side.text}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <div className="serif-plain" style={{ fontSize: "clamp(16px,2.5vw,22px)", color: C.gold, lineHeight: 1.6 }}>
            "The audios do not motivate you.<br />They reprogram you at the level where motivation is no longer required."
          </div>
        </div>
      </div>

      {/* AUDIO VAULT */}
      <div className="section-pad" style={{ padding: "64px 24px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Label>Subliminals · Hypnosis · Frequency Audios</Label>
          <div className="serif-plain" style={{ fontSize: "clamp(28px,4vw,40px)", marginBottom: 8 }}>Every desire has its own frequency.</div>
          <div style={{ fontSize: 13, color: C.muted }}>An ever-expanding vault. 4 new tracks every week. Never on YouTube.</div>
        </div>

        {/* Category tabs */}
        <div className="track-cats" style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
          {categories.map(c => (
            <button key={c.id} onClick={() => setActiveCategory(c.id)} style={{ padding: "7px 16px", borderRadius: 20, border: `0.5px solid ${activeCategory === c.id ? C.gold : C.border}`, background: activeCategory === c.id ? C.gold + "18" : "none", color: activeCategory === c.id ? C.gold : C.muted, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", minHeight: 36, transition: "all 0.2s" }}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Active category */}
        <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: `0.5px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 10, color: C.muted, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>{activeCat.label}</div>
              <div className="serif-plain" style={{ fontSize: 20 }}>{activeCat.tagline}</div>
            </div>
            <Tag label={activeCat.label} color={activeCat.id} />
          </div>
          {activeCat.tracks.map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 20px", borderBottom: i < activeCat.tracks.length - 1 ? `0.5px solid ${C.border2}` : "none", opacity: t.free || i === 0 ? 1 : 0.6 }}
              onMouseEnter={e => e.currentTarget.style.background = "#0d0900"}
              onMouseLeave={e => e.currentTarget.style.background = "none"}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: t.free ? C.gold + "18" : "#080500", border: `0.5px solid ${t.free ? C.gold : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 14, color: t.free ? C.gold : C.muted }}>{t.free ? "▶" : "🔒"}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: t.free ? C.gold : C.text2, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</div>
                <div style={{ fontSize: 11, color: C.dim }}>{t.freq} · {t.type} · {t.dur}</div>
              </div>
              {t.free && <span style={{ fontSize: 10, padding: "2px 8px", background: C.gold + "22", color: C.gold, borderRadius: 10, fontWeight: 600, flexShrink: 0 }}>FREE</span>}
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: C.muted }}>
          Free track available in every realm · Full vault requires membership
        </div>
      </div>

      {/* PROOFOS TEASER */}
      <div className="section-pad" style={{ padding: "0 24px 64px", maxWidth: 900, margin: "0 auto" }}>
        <div onClick={onProofOS} style={{ background: "linear-gradient(135deg,#0a0500,#120a02)", border: `0.5px solid ${C.gold}44`, borderRadius: 16, padding: 32, cursor: "pointer", position: "relative", overflow: "hidden", transition: "border-color 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = C.gold + "88"}
          onMouseLeave={e => e.currentTarget.style.borderColor = C.gold + "44"}>
          <div style={{ position: "absolute", top: 0, right: 0, width: 300, height: 300, background: `radial-gradient(circle,${C.rose}12 0%,transparent 70%)`, pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <Label color={C.rose}>Coming soon · Goddess Tier exclusive</Label>
            <div className="wm" style={{ fontSize: "clamp(32px,5vw,48px)", lineHeight: 1, marginBottom: 8 }}>ProofOS ✦</div>
            <div style={{ fontSize: 13, color: C.muted, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 20 }}>The manifestation ledger</div>
            <div style={{ fontSize: 15, color: "#8a7a5a", lineHeight: 1.85, marginBottom: 24, maxWidth: 520 }}>
              Most people manifest and forget. They dismiss the signs as coincidence — they never connect what arrived to what they listened to the night before.<br /><br />
              ProofOS changes that. Log your desire. Link it to your audio. Capture the signs. Watch the pattern become undeniable.
            </div>
            {/* Mini proof board */}
            <div style={{ background: "#0d0900", border: `0.5px solid ${C.border}`, borderRadius: 12, padding: 16, maxWidth: 440, marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: C.gold, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>Your proof board</div>
              {[
                { d: "He texted me", days: "14 days", status: "manifested", track: "He's already on his way back" },
                { d: "€1,847 received", days: "9 days", status: "manifested", track: "Money is obsessed with me" },
                { d: "My skin is visibly different", days: "21 days", status: "in progress", track: "Gorgeous is my default" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 2 ? `0.5px solid ${C.border2}` : "none" }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: item.status === "manifested" ? C.green : C.gold, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: C.text2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.d}</div>
                    <div style={{ fontSize: 10, color: C.dim }}>{item.track}</div>
                  </div>
                  <span style={{ fontSize: 10, padding: "2px 8px", background: item.status === "manifested" ? "#0a1a0a" : C.dim, color: item.status === "manifested" ? C.green : C.gold, borderRadius: 20, fontWeight: 600, flexShrink: 0 }}>
                    {item.status === "manifested" ? `✓ ${item.days}` : item.days}
                  </span>
                </div>
              ))}
              <div style={{ marginTop: 10, fontSize: 11, color: C.muted, textAlign: "center" }}>3 manifested · avg 11 days · 14 day streak ✦</div>
            </div>
            <span style={{ fontSize: 13, color: C.gold, fontWeight: 500 }}>See how ProofOS works →</span>
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div className="section-pad" style={{ padding: "0 24px 64px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Label>Early members</Label>
          <div className="serif-plain" style={{ fontSize: "clamp(24px,3.5vw,36px)" }}>The receipts are already coming in.</div>
          <div style={{ fontSize: 11, color: C.dim, marginTop: 8 }}>Placeholder — to be replaced with verified member testimonials</div>
        </div>
        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { q: "I listened three nights in a row. On day four he texted me out of nowhere. Two months of silence and then that.", who: "S.R.", tier: "Audio Tier", cat: "SP & Love" },
            { q: "€1,200 from a client I had completely forgotten. Three days after starting the money audio. I checked my bank twice.", who: "M.K.", tier: "Goddess Tier", cat: "Abundance" },
            { q: "People keep asking what I am using on my skin. I am not using anything new.", who: "C.D.", tier: "Goddess Tier", cat: "Beauty" },
            { q: "I woke up feeling like a different person. Calmer. More certain. Like something reset while I was asleep.", who: "L.M.", tier: "Audio Tier", cat: "Sleep" },
          ].map((t, i) => (
            <div key={i} style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 10, color: C.rose, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>Early member result</div>
              <div className="serif-plain" style={{ fontSize: 15, lineHeight: 1.7, color: C.text, marginBottom: 14 }}>"{t.q}"</div>
              <div style={{ fontSize: 11, color: C.muted }}>— {t.who} · {t.tier} · {t.cat} · ★★★★★</div>
            </div>
          ))}
        </div>
      </div>

      {/* PRICING */}
      <div className="section-pad" style={{ padding: "0 24px 80px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Label>Choose your tier</Label>
          <div className="serif-plain" style={{ fontSize: "clamp(24px,3.5vw,36px)", marginBottom: 8 }}>Choose your tier</div>
          <div style={{ fontSize: 13, color: C.muted }}>She doesn't chase the sale. She simply exists — and you decide.</div>
        </div>

        {/* Billing toggle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 10, padding: 4, display: "flex", gap: 4 }}>
            {["monthly", "annual"].map(b => (
              <button key={b} onClick={() => setBilling(b)} style={{ padding: "7px 18px", borderRadius: 8, background: billing === b ? `linear-gradient(90deg,${C.gold},${C.rose})` : "transparent", border: "none", color: billing === b ? "#000" : C.muted, fontSize: 12, fontWeight: 600, cursor: "pointer", minHeight: 36 }}>
                {b === "annual" ? "Annual — save 20%" : "Monthly"}
              </button>
            ))}
          </div>
        </div>

        {/* Tier cards */}
        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          {[
            {
              id: "audio", name: "Audio Tier",
              price: billing === "monthly" ? "€19.99" : "€192",
              sub: billing === "annual" ? "€16/mo — 2 months free" : null,
              period: billing === "monthly" ? "/month" : "/year",
              features: [
                "Full subliminal, hypnosis and frequency vault",
                "All 6 desire categories",
                "Loop player and sleep timer",
                "4 new tracks every week — never on YouTube",
                "Ever-expanding audio library",
                "No ads. Ever.",
              ],
              cta: "Join Audio Tier",
            },
            {
              id: "goddess", name: "Goddess Tier", popular: true,
              price: billing === "monthly" ? "€33" : "€317",
              sub: billing === "annual" ? "€26.40/mo — 2 months free" : null,
              period: billing === "monthly" ? "/month" : "/year",
              features: [
                "Everything in Audio Tier",
                "ProofOS manifestation tracker ✦ coming soon",
                "Log desires, link to audios, capture proof",
                "Early access — new tracks 48hrs ahead",
                "Monthly ritual audio included",
                "Goddess community",
              ],
              cta: "Become Goddess",
            }
          ].map(p => (
            <div key={p.id} style={{ background: C.card, border: `${p.popular ? "1.5px" : "0.5px"} solid ${p.popular ? C.gold + "66" : C.border}`, borderRadius: 14, padding: 24, position: "relative" }}>
              {p.popular && <div style={{ position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)", background: `linear-gradient(90deg,${C.gold},${C.rose})`, color: "#000", fontSize: 9, fontWeight: 700, padding: "2px 14px", borderRadius: 20, whiteSpace: "nowrap", letterSpacing: "0.1em" }}>MOST POPULAR</div>}
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 4 }}>{p.name}</div>
              {p.sub && <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>{p.sub}</div>}
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}>
                <span className="price-big" style={{ fontSize: 38, fontWeight: 700, color: p.popular ? C.rose : C.gold }}>{p.price}</span>
                <span style={{ fontSize: 12, color: C.muted }}>{p.period}</span>
              </div>
              <div style={{ marginBottom: 20 }}>
                {p.features.map((f, i) => (
                  <div key={i} style={{ fontSize: 12, color: f.includes("✦") ? C.gold : "#9a8060", marginBottom: 7, paddingLeft: 14, position: "relative", lineHeight: 1.5 }}>
                    <span style={{ position: "absolute", left: 0, color: C.gold }}>·</span>{f}
                  </div>
                ))}
              </div>
              <Btn full outline={!p.popular} onClick={() => onJoin(p.id)}>{p.cta}</Btn>
            </div>
          ))}
        </div>

        {/* Founder card */}
        <div style={{ background: "linear-gradient(135deg,#0d0900,#1a0d02)", border: `1.5px solid ${C.gold}55`, borderRadius: 14, padding: 28, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: 200, height: 200, background: `radial-gradient(circle,${C.gold}08,transparent)`, pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <Label color={C.gold}>First 1,000 only · Lifetime access</Label>
            <div className="serif-plain" style={{ fontSize: "clamp(24px,4vw,36px)", marginBottom: 8 }}>Founder Lifetime</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 16 }}>
              <span style={{ fontSize: 42, fontWeight: 700, color: C.gold }}>€500</span>
              <span style={{ fontSize: 13, color: C.muted }}>once · never pay again</span>
            </div>
            <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 13, color: "#8a7a5a", lineHeight: 1.8 }}>
                  Lock in the full vault, ProofOS, every future feature and every future tier — forever. No subscription can be cancelled out from under you. The €500 Founder price closes once the first 1,000 members join. After that, lifetime access will not exist at any price.
                </div>
              </div>
              <div>
                {["Full audio vault for life", "ProofOS for life", "All future features and tiers", "1 GB private evidence vault", "Founder's seal ✦", "Never pay again"].map((f, i) => (
                  <div key={i} style={{ fontSize: 12, color: C.text2, marginBottom: 7, paddingLeft: 14, position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: C.gold }}>✦</span>{f}
                  </div>
                ))}
              </div>
            </div>
            <Btn onClick={() => onJoin("founder")}>Claim lifetime access — €500</Btn>
          </div>
        </div>

        <div style={{ marginTop: 16, textAlign: "center", fontSize: 11, color: C.dim, lineHeight: 1.9 }}>
          No refunds after 14 days · Cancel before renewal · Web app — no download · iPhone: save to home screen
        </div>
      </div>

      {/* FINAL CTA */}
      <div style={{ position: "relative", padding: "80px 24px", textAlign: "center", overflow: "hidden", borderTop: `0.5px solid ${C.border}` }}>
        <div className="rings"><div className="ring" /><div className="ring" /><div className="ring" /></div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="serif-plain" style={{ fontSize: "clamp(24px,4vw,40px)", lineHeight: 1.3, marginBottom: 24 }}>
            Your subconscious already knows.<br />The rest of you is catching up.
          </div>
          <div className="glow-btn" style={{ display: "inline-block", marginBottom: 12 }}>
            <Btn onClick={() => onJoin("audio")}>Enter the portal</Btn>
          </div>
          <div style={{ fontSize: 12, color: C.dim }}>The vault is open now.</div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: `0.5px solid ${C.border}`, padding: "24px", textAlign: "center" }}>
        <span className="wm" style={{ fontSize: 18, display: "block", marginBottom: 8 }}>Self Hypnosis Goddess</span>
        <div style={{ fontSize: 11, color: C.dim, marginBottom: 8 }}>Listened to by thousands · Never on YouTube · Original frequencies composed for the subconscious</div>
        <div style={{ fontSize: 10, color: C.dim, letterSpacing: "0.15em" }}>© 2026 RESHMA ORACLE · ALL RIGHTS RESERVED</div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// PROOFOS PAGE
// ════════════════════════════════════════════════════════════════
function ProofOSPage({ onBack, onJoin }) {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: C.black }} className="fade">
      <nav style={{ position: "sticky", top: 0, zIndex: 100, padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,0,0.95)", borderBottom: `0.5px solid ${C.border}` }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.muted, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>← Back</button>
        <span className="wm" style={{ fontSize: 16 }}>Self Hypnosis Goddess</span>
        <div style={{ width: 60 }} />
      </nav>

      {/* Hero */}
      <div style={{ position: "relative", padding: "80px 24px 64px", textAlign: "center", overflow: "hidden" }}>
        <div className="rings"><div className="ring" /><div className="ring" /><div className="ring" /></div>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: `radial-gradient(ellipse,${C.rose}10 0%,transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto" }}>
          <Label color={C.rose}>Goddess Tier exclusive · Coming soon</Label>
          <div className="wm" style={{ fontSize: "clamp(52px,10vw,80px)", lineHeight: 0.95, marginBottom: 16 }}>ProofOS</div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 24 }}>The manifestation ledger</div>
          <div className="serif-plain" style={{ fontSize: "clamp(18px,3vw,26px)", lineHeight: 1.5, marginBottom: 12 }}>
            You've been manifesting.<br />Now watch it prove itself.
          </div>
          <div style={{ fontSize: 14, color: "#8a7a5a", lineHeight: 1.8, marginBottom: 36 }}>
            For every desire that arrived — the text, the payment, the shift in the mirror —<br />
            ProofOS holds the evidence. Dated. Linked to the audio. Undeniable.
          </div>
          {!joined ? (
            <div style={{ maxWidth: 380, margin: "0 auto" }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email" style={{ flex: 1 }} />
                <Btn onClick={() => { if (email.includes("@")) setJoined(true); }}>Join waitlist</Btn>
              </div>
              <div style={{ fontSize: 11, color: C.dim }}>Goddess Tier members get first access · No spam</div>
            </div>
          ) : (
            <div style={{ padding: "16px 24px", background: "#0a1a0a", border: `0.5px solid #2a4a2a`, borderRadius: 10, maxWidth: 380, margin: "0 auto", fontSize: 13, color: C.green }}>
              ✓ You're on the list. First access when ProofOS launches.
            </div>
          )}
        </div>
      </div>

      {/* The concept */}
      <div style={{ padding: "0 24px 64px", maxWidth: 900, margin: "0 auto" }}>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 48 }}>
          {[
            { step: "01", title: "You set the intention", body: "Log exactly what you want. Specific, present tense, precise — the way your hypnosis audios trained you to think." },
            { step: "02", title: "You listen with purpose", body: "Every track you play links automatically to your active proof threads. Your listening becomes intentional. Every session is recorded." },
            { step: "03", title: "You collect the proof", body: "Signs, synchronicities, results. A voice note. A photo receipt. You log them as they arrive. The pattern becomes undeniable." },
          ].map((s, i) => (
            <div key={i} style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
              <div style={{ fontSize: 28, color: C.gold + "44", fontWeight: 700, marginBottom: 12, fontFamily: "monospace" }}>{s.step}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 10 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>{s.body}</div>
            </div>
          ))}
        </div>

        {/* Proof board mockup */}
        <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 16, padding: 24, maxWidth: 560, margin: "0 auto 48px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.gold, letterSpacing: "0.15em", textTransform: "uppercase" }}>Proof Thread</div>
            <span style={{ fontSize: 10, padding: "3px 10px", background: "#0a1a0a", color: C.green, borderRadius: 20, fontWeight: 600 }}>✓ Manifested</span>
          </div>
          <div className="serif-plain" style={{ fontSize: 20, marginBottom: 4 }}>I receive €5,000 from an unexpected source</div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 20 }}>Linked to: Money is obsessed with me · 528hz · Subliminal</div>

          {/* Timeline */}
          {[
            { day: "Day 1", icon: "🎧", label: "Audio listened to", detail: "Night mode · Certainty score 8/10" },
            { day: "Day 3", icon: "🎙", label: "Voice proof logged", detail: "\"Felt something shift on third listen. Like I stopped needing it.\" — 0:47" },
            { day: "Day 5", icon: "✦", label: "Sign noticed", detail: "Found €20 in a jacket I hadn't worn since winter." },
            { day: "Day 7", icon: "◈", label: "Synchronicity", detail: "Three separate people mentioned money to me today unprompted." },
            { day: "Day 9", icon: "📸", label: "Photo proof — Final manifestation", detail: "€5,000 client payment. Project I had forgotten I quoted.", gold: true },
          ].map((e, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: e.gold ? C.gold + "22" : "#0d0900", border: `0.5px solid ${e.gold ? C.gold : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{e.icon}</div>
                {i < 4 && <div style={{ width: 1, height: 16, background: C.border, margin: "4px 0" }} />}
              </div>
              <div style={{ paddingTop: 4 }}>
                <div style={{ fontSize: 10, color: C.muted, marginBottom: 2 }}>{e.day}</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: e.gold ? C.gold : C.text2, marginBottom: 2 }}>{e.label}</div>
                <div style={{ fontSize: 11, color: C.dim }}>{e.detail}</div>
              </div>
            </div>
          ))}
          <div style={{ marginTop: 12, padding: "10px 14px", background: "#0a1a0a", borderRadius: 10, textAlign: "center" }}>
            <span style={{ fontSize: 13, color: C.green, fontWeight: 600 }}>9 days · first listen to final proof ✦</span>
          </div>
        </div>

        {/* Features */}
        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 48 }}>
          {[
            { icon: "✦", title: "Proof Threads", body: "One specific desire becomes its own living thread — linked audio, timeline, signs, synchronicities, and the final receipt." },
            { icon: "🎙", title: "Voice proof", body: "Record voice notes describing what happened, what you felt, what shifted. Hear your own certainty building over time." },
            { icon: "📸", title: "Photo receipts", body: "Screenshot the text message. Photograph the bank notification. Upload the email. Visible, dated, undeniable proof." },
            { icon: "◈", title: "Proof Intelligence", body: "Coming soon — pattern analysis across all your threads. Which audio manifests fastest. How many days on average. Your personal data." },
          ].map((f, i) => (
            <div key={i} style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 22, color: C.gold, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.7 }}>{f.body}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <div className="serif-plain" style={{ fontSize: "clamp(22px,3.5vw,34px)", marginBottom: 12 }}>Ready to begin?</div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 24, lineHeight: 1.7 }}>
            ProofOS is included in the Goddess Tier.<br />
            Start with the audio vault now. The tracker unlocks when it launches.
          </div>
          <Btn onClick={() => onJoin("goddess")}>Join Goddess Tier — €33/month</Btn>
          <div style={{ marginTop: 10, fontSize: 12, color: C.dim }}>Or join the waitlist above for early access</div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// ONBOARDING
// ════════════════════════════════════════════════════════════════
function Onboard({ tier, onSuccess, onBack }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [billing, setBilling] = useState("monthly");
  const [loading, setLoading] = useState(false);

  const tierName = tier === "goddess" ? "Goddess Tier" : tier === "founder" ? "Founder Lifetime" : "Audio Tier";
  const price = tier === "founder" ? "€500" : tier === "goddess" ? (billing === "monthly" ? "€33" : "€317") : (billing === "monthly" ? "€19.99" : "€192");

  const next = () => {
    if (step === 3) { setLoading(true); setTimeout(() => { setLoading(false); setStep(4); }, 1400); }
    else if (step === 4) onSuccess();
    else setStep(s => s + 1);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 20px", background: C.black }} className="fade">
      {step < 4 && <button onClick={onBack} style={{ position: "absolute", top: 20, left: 20, background: "none", border: "none", color: C.muted, fontSize: 13, cursor: "pointer" }}>← Back</button>}

      {step < 4 && (
        <div style={{ display: "flex", gap: 0, marginBottom: 40 }}>
          {[1, 2, 3].map(n => (
            <div key={n} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: n <= step ? `linear-gradient(135deg,${C.gold},${C.rose})` : C.card, border: `0.5px solid ${n <= step ? C.gold : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: n <= step ? "#000" : C.muted }}>
                {n < step ? "✓" : n}
              </div>
              {n < 3 && <div style={{ width: 48, height: "0.5px", background: n < step ? C.gold : C.border }} />}
            </div>
          ))}
        </div>
      )}

      <div style={{ width: "100%", maxWidth: 440 }}>
        {step === 1 && (
          <div className="fade">
            <span className="wm" style={{ fontSize: 22, display: "block", marginBottom: 6 }}>Self Hypnosis Goddess</span>
            <div style={{ fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 6 }}>Create your account</div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>Joining: {tierName}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              <input placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              <input placeholder="Password (min 8 characters)" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <Btn full onClick={next} disabled={!form.email || !form.password || form.password.length < 8}>Continue →</Btn>
            <div style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: C.muted }}>
              Already a member? <span style={{ color: C.gold, cursor: "pointer" }} onClick={onBack}>Sign in</span>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fade">
            <div style={{ fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 4 }}>Confirm your plan</div>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 24 }}>You chose: {tierName}</div>
            {tier !== "founder" && (
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {["monthly", "annual"].map(b => (
                  <button key={b} onClick={() => setBilling(b)} style={{ flex: 1, padding: 14, background: billing === b ? C.card2 : C.card, border: `${billing === b ? "1px" : "0.5px"} solid ${billing === b ? C.gold + "66" : C.border}`, borderRadius: 10, cursor: "pointer", textAlign: "left" }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: billing === b ? C.gold : C.text, marginBottom: 2 }}>{b === "monthly" ? "Monthly" : "Annual"}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: billing === b ? C.gold : C.text }}>{tier === "goddess" ? (b === "monthly" ? "€33" : "€317") : (b === "monthly" ? "€19.99" : "€192")}<span style={{ fontSize: 11, color: C.muted }}>/{b === "monthly" ? "mo" : "yr"}</span></div>
                    {b === "annual" && <div style={{ fontSize: 10, color: C.rose, marginTop: 2 }}>Save 20% · 2 months free</div>}
                  </button>
                ))}
              </div>
            )}
            <div style={{ background: C.card, border: `0.5px solid ${C.gold}44`, borderRadius: 10, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>What's included</div>
              {(tier === "goddess" ? ["Full audio vault", "4 new tracks/week", "ProofOS tracker (coming soon)", "Early access drops", "Monthly ritual included"] :
                tier === "founder" ? ["Full audio vault forever", "ProofOS for life", "All future features", "1 GB evidence vault", "Founder's seal ✦"] :
                  ["Full audio vault", "4 new tracks/week", "Loop player + sleep timer", "All 6 desire categories", "No ads. Ever."]).map((f, i) => (
                    <div key={i} style={{ fontSize: 12, color: C.text2, paddingLeft: 12, position: "relative", marginBottom: 5 }}>
                      <span style={{ position: "absolute", left: 0, color: C.gold }}>·</span>{f}
                    </div>
                  ))}
            </div>
            <Btn full onClick={next}>Continue to payment →</Btn>
          </div>
        )}

        {step === 3 && (
          <div className="fade">
            <div style={{ fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 20 }}>Secure checkout</div>
            <div style={{ background: C.card, border: `0.5px solid ${C.gold}44`, borderRadius: 10, padding: 16, marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{tierName}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{tier === "founder" ? "One-time · lifetime access" : `Billed ${billing}`}</div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: C.gold }}>{price}</div>
            </div>
            <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 10, padding: 16, marginBottom: 16, fontSize: 12, color: "#7a6a52", lineHeight: 1.8 }}>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 8, letterSpacing: "0.15em", textTransform: "uppercase" }}>Stripe secure checkout</div>
              You will be redirected to Stripe's secure checkout.<br />
              {tier !== "founder" && "Recurring billing · Cancel anytime before renewal · "}
              No refunds after 14 days from payment date
            </div>
            <Btn full onClick={next} disabled={loading}>{loading ? "Processing..." : "Pay with Stripe →"}</Btn>
            <div style={{ textAlign: "center", marginTop: 10, fontSize: 10, color: C.dim }}>SSL encrypted · No card data stored · Powered by Stripe</div>
          </div>
        )}

        {step === 4 && (
          <div style={{ textAlign: "center" }} className="fade">
            <div style={{ fontSize: 48, marginBottom: 20 }}>✦</div>
            <span className="wm" style={{ fontSize: 34, display: "block", marginBottom: 10 }}>Welcome.</span>
            <div style={{ fontSize: 14, color: C.muted, marginBottom: 32, lineHeight: 1.8 }}>
              Your portal is ready.<br />
              {tier === "goddess" && "ProofOS tracker activates when it launches."}
              {tier === "founder" && "Your Founder seal is locked in. ProofOS activates when it launches."}
            </div>
            <Btn full onClick={next}>Enter the portal →</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// PORTAL — FULL APP
// ════════════════════════════════════════════════════════════════
function Portal({ userTier, onSignOut, onUpgrade }) {
  const [tab, setTab] = useState("audios");
  const [playing, setPlaying] = useState(null);
  const [cat, setCat] = useState("all");
  const [loop, setLoop] = useState(true);
  const [sleep, setSleep] = useState(60);
  const [progress, setProgress] = useState(38);
  const [search, setSearch] = useState("");
  const [desires, setDesires] = useState([
    { id: 1, desire: "He texts me first", status: "manifested", track: "He's already on his way back", days: 14, signs: ["Got a like on Instagram", "Mutual friend mentioned me", "Had a vivid dream about him"] },
    { id: 2, desire: "€5,000 arrives unexpectedly", status: "in_progress", track: "Money is obsessed with me", days: 6, signs: ["Found €20 in old jacket", "Client asked to extend contract"] },
    { id: 3, desire: "Glowing skin visible to others", status: "in_progress", track: "Gorgeous is my default setting", days: 3, signs: [] },
  ]);
  const [newDesire, setNewDesire] = useState("");
  const [newSign, setNewSign] = useState("");
  const [expanded, setExpanded] = useState(null);

  const tracks = [
    { id: 1, title: "He's already on his way back", cat: "sp", tag: "SP & Love", freq: "432hz", dur: "30:00", type: "Subliminal", tier: "audio", isNew: true },
    { id: 2, title: "Money is obsessed with me", cat: "money", tag: "Money", freq: "528hz", dur: "25:00", type: "Hypnosis", tier: "audio", isNew: true },
    { id: 3, title: "Gorgeous is my default setting", cat: "beauty", tag: "Beauty", freq: "432hz", dur: "35:00", type: "Subliminal", tier: "audio" },
    { id: 4, title: "I've always been the prize", cat: "identity", tag: "Identity", freq: "LOA", dur: "30:00", type: "Subliminal", tier: "audio" },
    { id: 5, title: "DNA activation ceremony", cat: "dna", tag: "DNA", freq: "963hz", dur: "45:00", type: "Frequency + Subliminal", tier: "goddess" },
    { id: 6, title: "I manifest while I sleep", cat: "sleep", tag: "Sleep", freq: "Delta", dur: "60:00", type: "Sleep subliminal", tier: "audio" },
    { id: 7, title: "He's obsessed and he knows it", cat: "sp", tag: "SP & Love", freq: "432hz", dur: "28:00", type: "Subliminal", tier: "audio" },
    { id: 8, title: "Reality rearranges for me", cat: "identity", tag: "Identity", freq: "963hz", dur: "33:00", type: "Frequency + Subliminal", tier: "goddess" },
    { id: 9, title: "I get prettier every single day", cat: "beauty", tag: "Beauty", freq: "432hz", dur: "25:00", type: "Subliminal", tier: "audio" },
    { id: 10, title: "Unexpected money finds me first", cat: "money", tag: "Money", freq: "963hz", dur: "27:00", type: "Frequency + Subliminal", tier: "audio", isNew: true },
  ];

  const cats = [{ id: "all", l: "All" }, { id: "sp", l: "SP & Love" }, { id: "money", l: "Money" }, { id: "beauty", l: "Beauty" }, { id: "sleep", l: "Sleep" }, { id: "dna", l: "DNA" }, { id: "identity", l: "Identity" }];
  const canPlay = t => t.tier === "audio" || userTier === "goddess";
  const ct = tracks.find(t => t.id === playing);
  const filtered = tracks.filter(t => (cat === "all" || t.cat === cat) && (!search || t.title.toLowerCase().includes(search.toLowerCase())));
  const manifested = desires.filter(d => d.status === "manifested").length;

  const addDesire = () => {
    if (!newDesire.trim()) return;
    setDesires([{ id: Date.now(), desire: newDesire, status: "in_progress", track: ct?.title || null, days: 0, signs: [] }, ...desires]);
    setNewDesire("");
  };

  const addSign = (id) => {
    if (!newSign.trim()) return;
    setDesires(desires.map(d => d.id === id ? { ...d, signs: [...d.signs, newSign] } : d));
    setNewSign("");
  };

  const tabs = [
    { id: "audios", icon: "▶", label: "Audios" },
    { id: "tracker", icon: "✦", label: userTier === "goddess" ? "Tracker" : "Tracker 🔒" },
    { id: "account", icon: "◎", label: "Account" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: C.black, paddingBottom: playing ? 96 : 0 }} className="fade">

      {/* Header */}
      <div style={{ borderBottom: `0.5px solid ${C.border}`, padding: "0 16px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#030200", position: "sticky", top: 0, zIndex: 50 }}>
        <span className="wm" style={{ fontSize: 17 }}>Self Hypnosis Goddess</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {userTier === "goddess"
            ? <div style={{ padding: "3px 10px", background: "#1a0a04", border: `0.5px solid ${C.gold}44`, borderRadius: 20, fontSize: 10, color: C.gold, fontWeight: 600 }}>Goddess ✦</div>
            : <button onClick={onUpgrade} style={{ padding: "3px 10px", background: "none", border: `0.5px solid ${C.rose}44`, borderRadius: 20, fontSize: 10, color: C.rose, fontWeight: 600, cursor: "pointer" }}>Upgrade ↑</button>
          }
        </div>
      </div>

      {/* Desktop tabs */}
      <div className="desktop-nav" style={{ display: "flex", borderBottom: `0.5px solid ${C.border}`, background: "#050300", position: "sticky", top: 52, zIndex: 49 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "12px 8px", background: "none", border: "none", borderBottom: `1.5px solid ${tab === t.id ? C.gold : "transparent"}`, color: tab === t.id ? C.gold : C.muted, fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s" }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, maxWidth: 800, width: "100%", margin: "0 auto", padding: "18px 16px 24px" }}>

        {/* AUDIOS */}
        {tab === "audios" && (
          <div className="fade">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tracks..." style={{ marginBottom: 14 }} />
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
              {cats.map(c => (
                <button key={c.id} onClick={() => setCat(c.id)} style={{ padding: "5px 12px", borderRadius: 20, border: `0.5px solid ${cat === c.id ? C.gold : C.border}`, background: cat === c.id ? C.gold + "18" : "none", color: cat === c.id ? C.gold : C.muted, fontSize: 11, cursor: "pointer", minHeight: 34, transition: "all 0.2s" }}>{c.l}</button>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filtered.map(t => {
                const isP = playing === t.id;
                const can = canPlay(t);
                return (
                  <div key={t.id} onClick={() => can && setPlaying(isP ? null : t.id)}
                    style={{ display: "flex", alignItems: "center", gap: 13, padding: "12px 14px", background: isP ? C.card2 : C.card, border: `0.5px solid ${isP ? C.gold + "55" : C.border}`, borderRadius: 10, cursor: can ? "pointer" : "default", opacity: can ? 1 : 0.45, transition: "all 0.2s" }}
                    onMouseEnter={e => can && !isP && (e.currentTarget.style.borderColor = C.gold + "33")}
                    onMouseLeave={e => can && !isP && (e.currentTarget.style.borderColor = C.border)}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: isP ? C.gold + "18" : "#080500", border: `0.5px solid ${isP ? C.gold : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {!can ? <span style={{ fontSize: 13 }}>🔒</span>
                        : isP ? <div className="wave"><span /><span /><span /><span /><span /></div>
                          : <span style={{ fontSize: 13, color: C.muted, marginLeft: 2 }}>▶</span>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: isP ? C.gold : C.text2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</span>
                        {t.isNew && <span style={{ fontSize: 9, padding: "1px 6px", background: C.rose + "22", color: C.rose, borderRadius: 10, fontWeight: 700, flexShrink: 0 }}>NEW</span>}
                      </div>
                      <div style={{ fontSize: 10, color: C.dim }}>{t.freq} · {t.type}{!can ? " · Goddess tier" : ""} · {t.dur}</div>
                    </div>
                    <Tag label={t.tag} color={t.cat} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TRACKER */}
        {tab === "tracker" && (
          <div className="fade">
            {userTier !== "goddess" ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>✦</div>
                <div className="serif-plain" style={{ fontSize: 26, marginBottom: 10 }}>ProofOS</div>
                <div style={{ fontSize: 14, color: C.muted, marginBottom: 6 }}>The manifestation ledger.</div>
                <div style={{ fontSize: 13, color: "#7a6a52", lineHeight: 1.8, marginBottom: 24, maxWidth: 340, margin: "0 auto 24px" }}>
                  Log your desires. Link them to your listening.<br />Watch the proof accumulate in real time.
                </div>
                <Btn onClick={onUpgrade}>Upgrade to Goddess — €33/month</Btn>
                <div style={{ marginTop: 10, fontSize: 12, color: C.dim }}>Included in Goddess Tier when it launches</div>
              </div>
            ) : (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 16 }}>
                  {[{ v: desires.length, l: "Desires", c: C.text }, { v: manifested, l: "Manifested", c: C.rose }, { v: "14d", l: "Streak", c: C.gold }].map((s, i) => (
                    <div key={i} style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 10, padding: 14, textAlign: "center" }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: s.c, marginBottom: 2 }}>{s.v}</div>
                      <div style={{ fontSize: 10, color: C.muted }}>{s.l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 10, padding: 14, marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: C.muted }}>Manifestation rate</span>
                    <span style={{ fontSize: 11, color: C.gold, fontWeight: 600 }}>{manifested}/{desires.length}</span>
                  </div>
                  <div style={{ height: 4, background: C.border, borderRadius: 2 }}>
                    <div style={{ width: `${(manifested / desires.length) * 100}%`, height: "100%", background: `linear-gradient(90deg,${C.gold},${C.rose})`, borderRadius: 2 }} />
                  </div>
                </div>
                <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 10, padding: 14, marginBottom: 14 }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted, marginBottom: 10 }}>Log a new desire</div>
                  <input value={newDesire} onChange={e => setNewDesire(e.target.value)} placeholder="State it in present tense — I am, I have, I receive..." style={{ marginBottom: 10 }} onKeyDown={e => e.key === "Enter" && addDesire()} />
                  {ct && <div style={{ fontSize: 11, color: C.muted, marginBottom: 10 }}>Will link to: <span style={{ color: C.gold }}>{ct.title}</span></div>}
                  <Btn full small onClick={addDesire} disabled={!newDesire.trim()}>Add to tracker</Btn>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {desires.map(d => (
                    <div key={d.id} style={{ background: C.card, border: `0.5px solid ${d.status === "manifested" ? "#2a4a2a55" : C.border}`, borderRadius: 10, overflow: "hidden" }}>
                      <div style={{ padding: "12px 14px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }} onClick={() => setExpanded(expanded === d.id ? null : d.id)}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: C.text2, marginBottom: 3 }}>{d.desire}</div>
                          {d.track && <div style={{ fontSize: 11, color: C.dim }}>Listening: {d.track}{d.days > 0 ? ` · ${d.days} days` : ""}</div>}
                          {d.signs.length > 0 && <div style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>{d.signs.length} sign{d.signs.length !== 1 ? "s" : ""} logged</div>}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
                          {d.status === "manifested"
                            ? <span style={{ padding: "3px 10px", background: "#1a3a1a", color: "#6ab06a", borderRadius: 20, fontSize: 10, fontWeight: 600 }}>✓ manifested</span>
                            : <button onClick={e => { e.stopPropagation(); setDesires(desires.map(x => x.id === d.id ? { ...x, status: "manifested" } : x)); }} style={{ padding: "3px 10px", background: "none", border: `0.5px solid ${C.gold}44`, borderRadius: 20, color: C.gold, fontSize: 10, fontWeight: 600, cursor: "pointer" }}>mark done ✓</button>
                          }
                          <span style={{ fontSize: 10, color: C.dim }}>{expanded === d.id ? "▲" : "▼"}</span>
                        </div>
                      </div>
                      {expanded === d.id && (
                        <div style={{ borderTop: `0.5px solid ${C.border2}`, padding: "12px 14px", background: "#090600" }}>
                          <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: C.muted, marginBottom: 8 }}>Signs & synchronicities</div>
                          {d.signs.length === 0 && <div style={{ fontSize: 12, color: C.dim, marginBottom: 10 }}>No signs logged yet — add the first one below</div>}
                          {d.signs.map((s, i) => (
                            <div key={i} style={{ fontSize: 12, color: C.muted, paddingLeft: 12, position: "relative", marginBottom: 5 }}>
                              <span style={{ position: "absolute", left: 0, color: C.gold }}>·</span>{s}
                            </div>
                          ))}
                          {d.status !== "manifested" && (
                            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                              <input value={newSign} onChange={e => setNewSign(e.target.value)} placeholder="Log a sign..." style={{ flex: 1 }} onKeyDown={e => e.key === "Enter" && addSign(d.id)} />
                              <Btn small onClick={() => addSign(d.id)} disabled={!newSign.trim()}>Add</Btn>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ACCOUNT */}
        {tab === "account" && (
          <div className="fade" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted, marginBottom: 12 }}>Your account</div>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 3 }}>Signed in as</div>
              <div style={{ fontSize: 14, color: C.text, marginBottom: 12 }}>member@reshmaoracle.com</div>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 3 }}>Current plan</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: userTier === "goddess" ? C.gold : C.text2 }}>
                {userTier === "goddess" ? "Goddess Tier · €33/month" : "Audio Tier · €19.99/month"}
              </div>
            </div>
            {userTier === "audio" && (
              <div onClick={onUpgrade} style={{ background: "#0a0500", border: `1px solid ${C.gold}44`, borderRadius: 12, padding: 16, cursor: "pointer" }}>
                <div style={{ fontSize: 11, color: C.rose, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>Upgrade available</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>Goddess Tier — €33/month</div>
                <div style={{ fontSize: 12, color: C.muted }}>Unlock ProofOS tracker + early access drops →</div>
              </div>
            )}
            <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted, marginBottom: 12 }}>Subscription</div>
              <div style={{ fontSize: 12, color: "#8a7a5a", lineHeight: 1.85, marginBottom: 12 }}>
                Next billing: 29 July 2026<br />
                No refunds after 14 days from payment<br />
                Cancel before renewal to avoid next charge
              </div>
              <Btn small outline onClick={() => {}}>Manage billing ↗</Btn>
            </div>
            <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: C.muted, marginBottom: 12 }}>Access your portal</div>
              <div style={{ fontSize: 12, color: "#8a7a5a", lineHeight: 1.85 }}>
                Works in any browser on any device<br />
                iPhone: tap Share → "Add to Home Screen"<br />
                Android: tap menu → "Add to Home Screen"<br />
                No App Store download needed
              </div>
            </div>
            <button onClick={onSignOut} style={{ padding: 14, background: "none", border: `0.5px solid ${C.border}`, borderRadius: 8, color: C.muted, fontSize: 13, cursor: "pointer", minHeight: 44 }}>
              Sign out
            </button>
          </div>
        )}
      </div>

      {/* Mobile bottom nav */}
      <div className="bottom-nav" style={{ display: "flex" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "12px 8px", background: "none", border: "none", color: tab === t.id ? C.gold : C.muted, fontSize: 10, fontWeight: 500, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minHeight: 56 }}>
            <span style={{ fontSize: 16 }}>{t.icon}</span>
            <span style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Player bar */}
      {playing && ct && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#060400", borderTop: `0.5px solid ${C.gold}33`, padding: "10px 16px", zIndex: 100 }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: C.gold, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ct.title}</div>
                <div style={{ fontSize: 10, color: C.dim }}>{ct.freq} · {ct.type} · {loop ? "Loop on" : "Loop off"} · Sleep: {sleep ? `${sleep}m` : "off"}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                <button onClick={() => setLoop(!loop)} style={{ background: "none", border: "none", fontSize: 16, color: loop ? C.gold : C.dim, cursor: "pointer", minWidth: 28, minHeight: 28 }}>↻</button>
                <button onClick={() => setPlaying(null)} style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg,${C.gold},${C.rose})`, border: "none", color: "#000", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>⏸</button>
                <button onClick={() => setSleep(s => s === 60 ? 30 : s === 30 ? 0 : 60)} style={{ background: "none", border: `0.5px solid ${C.border}`, borderRadius: 6, padding: "5px 10px", color: sleep ? C.gold : C.dim, fontSize: 11, cursor: "pointer", minHeight: 32 }}>
                  {sleep ? `${sleep}m` : "∞"}
                </button>
              </div>
            </div>
            <div style={{ height: 2, background: C.border, borderRadius: 1, cursor: "pointer" }}
              onClick={e => { const r = e.target.getBoundingClientRect(); setProgress(Math.round(((e.clientX - r.left) / r.width) * 100)); }}>
              <div style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg,${C.gold},${C.rose})`, borderRadius: 1 }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
