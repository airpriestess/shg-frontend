import { useState } from "react";

const C = {
  black: "#000000",
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
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,400;1,600&family=Inter:wght@300;400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:#000;color:#e8e0d0;font-family:'Inter',sans-serif;font-size:16px;line-height:1.6;overflow-x:hidden}
button,input,select,textarea{font-family:'Inter',sans-serif}
input{background:#0a0700;border:1px solid #2a1e0a;color:#e8e0d0;border-radius:10px;padding:14px 16px;font-size:15px;width:100%;outline:none;transition:border-color 0.2s}
input:focus{border-color:#C8892A}
::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-thumb{background:#2a1e0a;border-radius:2px}
.wm{font-family:'Cormorant Garamond',serif;font-style:italic}
.fade{animation:fi 0.4s ease}
@keyframes fi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.wave span{display:inline-block;width:3px;background:#C8892A;border-radius:2px;margin:0 1.5px;animation:wv 1s ease-in-out infinite}
.wave span:nth-child(1){height:6px;animation-delay:0s}
.wave span:nth-child(2){height:14px;animation-delay:.1s}
.wave span:nth-child(3){height:20px;animation-delay:.2s}
.wave span:nth-child(4){height:11px;animation-delay:.15s}
.wave span:nth-child(5){height:16px;animation-delay:.25s}
@keyframes wv{0%,100%{transform:scaleY(0.4)}50%{transform:scaleY(1)}}

/* Mobile bottom nav */
.mobile-nav{display:none}
@media(max-width:768px){
  .mobile-nav{display:flex;position:fixed;bottom:0;left:0;right:0;background:#080500;border-top:1px solid #2a1e0a;z-index:200;padding-bottom:env(safe-area-inset-bottom,12px)}
  .desktop-tabs{display:none!important}
  .hide-mobile{display:none!important}
  .grid-2{grid-template-columns:1fr!important}
  .grid-3{grid-template-columns:1fr!important}
  .price-grid{grid-template-columns:1fr!important}
  .step-row{flex-direction:column!important}
  .step-arrow{transform:rotate(90deg)!important}
  .portal-body{padding-bottom:80px!important}
}
`;

function Btn({ children, onClick, full, outline, small, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: full ? "100%" : "auto",
      padding: small ? "10px 20px" : "16px 32px",
      background: disabled ? "#1a1208" : outline ? "transparent" : `linear-gradient(90deg,${C.gold},${C.rose})`,
      border: outline ? `1.5px solid ${C.gold}` : "none",
      borderRadius: 12,
      color: disabled ? C.dim : outline ? C.gold : "#000",
      fontSize: small ? 14 : 16,
      fontWeight: 700,
      cursor: disabled ? "not-allowed" : "pointer",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      gap: 8, transition: "transform 0.15s, opacity 0.2s",
      minHeight: 48, letterSpacing: "0.02em",
    }}
      onMouseEnter={e => !disabled && (e.currentTarget.style.transform = "translateY(-2px)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
    >{children}</button>
  );
}

function CatTag({ label, color }) {
  const map = {
    sp: { bg: "#2a0a14", t: "#e05a7a" },
    money: { bg: "#0a1a08", t: "#6ab05a" },
    beauty: { bg: "#1a1208", t: "#c8892a" },
    sleep: { bg: "#080a1a", t: "#6a8ad0" },
    dna: { bg: "#0a0a1a", t: "#9a7ad0" },
    identity: { bg: "#1a0a0a", t: "#c07070" },
  };
  const c = map[color] || map.sp;
  return (
    <span style={{ padding: "4px 10px", background: c.bg, color: c.t, borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", flexShrink: 0 }}>
      {label}
    </span>
  );
}

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [tier, setTier] = useState("audio");
  const [userTier, setUserTier] = useState("goddess");

  const go = (s, t) => { if (t) setTier(t); setScreen(s); window.scrollTo(0, 0); };

  return (
    <>
      <style>{css}</style>
      {screen === "landing" && <Landing onJoin={t => go("onboard", t)} onProofOS={() => go("proofos")} onDemo={() => { setUserTier("goddess"); go("portal"); }} />}
      {screen === "proofos" && <ProofOSPage onBack={() => go("landing")} onJoin={t => go("onboard", t)} />}
      {screen === "onboard" && <Onboard tier={tier} onSuccess={() => { setUserTier(tier === "goddess" ? "goddess" : "audio"); go("portal"); }} onBack={() => go("landing")} />}
      {screen === "portal" && <Portal userTier={userTier} onSignOut={() => go("landing")} onUpgrade={() => go("proofos")} />}
    </>
  );
}

// ═══════════════════════════════════════════
// LANDING PAGE
// ═══════════════════════════════════════════
function Landing({ onJoin, onProofOS, onDemo }) {
  const [billing, setBilling] = useState("monthly");
  const [activeCategory, setActiveCategory] = useState("sp");

  const categories = [
    { id: "sp", label: "SP & Love", color: "#e05a7a", tagline: "He was always going to come back.",
      tracks: [
        { title: "He's already on his way back", freq: "432hz", type: "Subliminal", dur: "30 min", free: true },
        { title: "He's obsessed and he knows it", freq: "432hz", type: "Subliminal", dur: "28 min" },
        { title: "I never chase — he catches up", freq: "528hz", type: "Hypnosis", dur: "26 min" },
        { title: "No contact — he comes back first", freq: "432hz", type: "Subliminal", dur: "32 min" },
      ]
    },
    { id: "money", label: "Money", color: "#6ab05a", tagline: "Money behaves around me.",
      tracks: [
        { title: "Money is obsessed with me", freq: "528hz", type: "Hypnosis", dur: "25 min", free: true },
        { title: "Lucky girl, unlimited", freq: "528hz", type: "Subliminal", dur: "22 min" },
        { title: "Unexpected money finds me first", freq: "963hz", type: "Frequency", dur: "27 min" },
        { title: "I receive beyond what I ask", freq: "528hz", type: "Hypnosis", dur: "35 min" },
      ]
    },
    { id: "beauty", label: "Beauty", color: "#c8892a", tagline: "I was born the exception.",
      tracks: [
        { title: "Gorgeous is my default setting", freq: "432hz", type: "Subliminal", dur: "35 min", free: true },
        { title: "I get prettier every single day", freq: "432hz", type: "Subliminal", dur: "25 min" },
        { title: "Everyone notices — I don't have to", freq: "528hz", type: "Hypnosis", dur: "24 min" },
        { title: "My face is shifting", freq: "432hz", type: "Frequency", dur: "40 min" },
      ]
    },
    { id: "identity", label: "Identity", color: "#c07070", tagline: "Reality is catching up to me.",
      tracks: [
        { title: "I've always been the prize", freq: "LOA", type: "Subliminal", dur: "30 min", free: true },
        { title: "I said so, therefore it is", freq: "528hz", type: "Hypnosis", dur: "32 min" },
        { title: "Reality rearranges for me", freq: "963hz", type: "Frequency", dur: "33 min" },
        { title: "She version of me", freq: "432hz", type: "Subliminal", dur: "28 min" },
      ]
    },
    { id: "dna", label: "DNA", color: "#9a7ad0", tagline: "My blood remembers who I am.",
      tracks: [
        { title: "DNA activation ceremony", freq: "963hz", type: "Frequency", dur: "45 min", free: true },
        { title: "I override what I inherited", freq: "963hz", type: "Frequency", dur: "40 min" },
        { title: "Cellular regeneration", freq: "963hz", type: "Frequency", dur: "38 min" },
      ]
    },
    { id: "sleep", label: "Sleep", color: "#6a8ad0", tagline: "I wake up as her.",
      tracks: [
        { title: "I manifest while I sleep", freq: "Delta", type: "Sleep subliminal", dur: "60 min", free: true },
        { title: "I wake up as her", freq: "Theta", type: "Sleep subliminal", dur: "55 min" },
        { title: "Overnight identity shift", freq: "Delta", type: "Sleep subliminal", dur: "8 hrs" },
      ]
    },
  ];

  const activeCat = categories.find(c => c.id === activeCategory);

  return (
    <div style={{ minHeight: "100vh", background: C.black }}>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, padding: "0 20px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,0,0.96)", borderBottom: `1px solid ${C.border}`, backdropFilter: "blur(12px)" }}>
        <span className="wm" style={{ fontSize: 20, background: `linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Self Hypnosis Goddess</span>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={onProofOS} className="hide-mobile" style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 16px", color: C.muted, fontSize: 14, cursor: "pointer" }}>ProofOS ✦</button>
          <button onClick={onDemo} className="hide-mobile" style={{ background: "none", border: "none", color: C.muted, fontSize: 14, cursor: "pointer" }}>Preview dashboard</button>
          <Btn small onClick={() => onJoin("audio")}>Join now</Btn>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ padding: "60px 20px 50px", textAlign: "center", maxWidth: 700, margin: "0 auto" }}>
        <div style={{ display: "inline-block", padding: "6px 16px", background: C.gold + "18", border: `1px solid ${C.gold}44`, borderRadius: 20, fontSize: 13, color: C.gold, fontWeight: 600, marginBottom: 24, letterSpacing: "0.05em" }}>
          Reshma Oracle · 50+ exclusive tracks
        </div>
        <h1 style={{ fontSize: "clamp(32px,7vw,56px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 20, color: C.text }}>
          Self Hypnosis Goddess<br />
          <span style={{ background: `linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Audio Library</span>
        </h1>
        <p style={{ fontSize: "clamp(16px,3vw,20px)", color: "#9a8a6a", lineHeight: 1.7, marginBottom: 12, maxWidth: 540, margin: "0 auto 12px" }}>
          Subliminal, hypnosis and frequency audio tracks that reprogram your subconscious — not available on YouTube.
        </p>
        <p style={{ fontSize: 15, color: C.muted, marginBottom: 36 }}>
          SP & Love · Money · Beauty · Identity · DNA · Sleep
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
          <Btn onClick={() => onJoin("audio")}>Start listening — €19.99/month</Btn>
          <Btn outline onClick={onDemo}>Preview the dashboard</Btn>
        </div>
        <div style={{ fontSize: 13, color: C.dim }}>Cancel anytime · Stripe · No download · Any device</div>
      </div>

      {/* WHAT YOU GET — 3 CLEAR BOXES */}
      <div style={{ padding: "0 20px 60px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 13, color: C.muted, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>What this is</div>
          <h2 style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 700, color: C.text }}>Everything you get when you join</h2>
        </div>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {[
            {
              img: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&q=80",
              title: "50+ Exclusive Audio Tracks",
              body: "Subliminal, hypnosis and frequency audios across 6 categories. 4 new tracks added every week. Never on YouTube.",
              tag: "Audio Tier"
            },
            {
              img: "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=600&q=80",
              title: "Loop Player + Sleep Timer",
              body: "Play any track on loop all night. Set a sleep timer. Your subconscious does the work while you rest.",
              tag: "Audio Tier"
            },
            {
              img: "https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=600&q=80",
              title: "ProofOS Tracker",
              body: "Log your desires, link them to your audios, capture signs as they arrive. Watch the pattern become undeniable.",
              tag: "Goddess Tier ✦"
            },
          ].map((item, i) => (
            <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
              <img src={item.img} alt={item.title} style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
              <div style={{ padding: 20 }}>
                <div style={{ fontSize: 11, color: i === 2 ? C.rose : C.gold, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>{item.tag}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 10 }}>{item.title}</div>
                <div style={{ fontSize: 14, color: "#8a7a5a", lineHeight: 1.65 }}>{item.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BEFORE & AFTER */}
      <div style={{ padding: "0 20px 60px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 13, color: C.muted, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>The shift</div>
          <h2 style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 700, color: C.text }}>What changes when you listen</h2>
        </div>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {[
            {
              cat: "SP & Love", catColor: "#e05a7a",
              img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&q=80",
              before: "Checking your phone every hour. Waiting for a message that doesn't come.",
              after: "He texts first. You had already stopped waiting."
            },
            {
              cat: "Money", catColor: "#6ab05a",
              img: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=600&q=80",
              before: "Counting what's left. Watching money leave faster than it arrives.",
              after: "€1,847 arrives unexpectedly. A client you forgot. A refund. A gift. Exactly as asked."
            },
            {
              cat: "Beauty & Identity", catColor: "#c8892a",
              img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80",
              before: "Looking for what's wrong in the mirror every morning.",
              after: "Three people ask what you're doing differently. You're not doing anything differently."
            },
          ].map((item, i) => (
            <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
              <div style={{ position: "relative" }}>
                <img src={item.img} alt={item.cat} style={{ width: "100%", height: 200, objectFit: "cover", display: "block", filter: "brightness(0.7)" }} />
                <div style={{ position: "absolute", bottom: 12, left: 12 }}>
                  <span style={{ background: item.catColor + "33", border: `1px solid ${item.catColor}66`, color: item.catColor, fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, letterSpacing: "0.1em", textTransform: "uppercase" }}>{item.cat}</span>
                </div>
              </div>
              <div style={{ padding: 20 }}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: "#6a4a4a", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>Before</div>
                  <div style={{ fontSize: 14, color: "#7a6a5a", lineHeight: 1.65 }}>{item.before}</div>
                </div>
                <div style={{ borderTop: `1px solid ${C.border2}`, paddingTop: 16 }}>
                  <div style={{ fontSize: 11, color: C.gold, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>After</div>
                  <div style={{ fontSize: 14, color: C.text2, lineHeight: 1.65, fontWeight: 500 }}>{item.after}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 28, padding: "20px 24px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, maxWidth: 600, margin: "28px auto 0" }}>
          <div className="wm" style={{ fontSize: "clamp(18px,3vw,26px)", color: C.text, lineHeight: 1.5 }}>
            "The audios do not motivate you. They reprogram you at the level where motivation is no longer required."
          </div>
        </div>
      </div>

      {/* AUDIO LIBRARY */}
      <div style={{ padding: "0 20px 60px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 13, color: C.muted, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>The vault</div>
          <h2 style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 700, color: C.text, marginBottom: 8 }}>Every desire has its own frequency</h2>
          <div style={{ fontSize: 15, color: C.muted }}>An ever-expanding library. 4 new tracks every week. Never on YouTube.</div>
        </div>

        {/* Category tabs */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20, justifyContent: "center" }}>
          {categories.map(c => (
            <button key={c.id} onClick={() => setActiveCategory(c.id)} style={{ padding: "8px 18px", borderRadius: 24, border: `1.5px solid ${activeCategory === c.id ? c.color : C.border}`, background: activeCategory === c.id ? c.color + "22" : "none", color: activeCategory === c.id ? c.color : C.muted, fontSize: 14, fontWeight: 600, cursor: "pointer", minHeight: 40, transition: "all 0.2s" }}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Track list */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, color: activeCat.color, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>{activeCat.label}</div>
              <div className="wm" style={{ fontSize: 20, color: C.text }}>{activeCat.tagline}</div>
            </div>
          </div>
          {activeCat.tracks.map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderBottom: i < activeCat.tracks.length - 1 ? `1px solid ${C.border2}` : "none" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: t.free ? activeCat.color + "22" : "#080500", border: `1.5px solid ${t.free ? activeCat.color : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 16 }}>
                {t.free ? "▶" : "🔒"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: t.free ? activeCat.color : C.text2, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</div>
                <div style={{ fontSize: 13, color: C.dim }}>{t.freq} · {t.type} · {t.dur}</div>
              </div>
              {t.free && <span style={{ fontSize: 12, padding: "3px 10px", background: activeCat.color + "22", color: activeCat.color, borderRadius: 12, fontWeight: 700, flexShrink: 0 }}>FREE</span>}
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 12, fontSize: 14, color: C.muted }}>
          First track in every category is free · Full library requires membership
        </div>
      </div>

      {/* PROOFOS TEASER */}
      <div style={{ padding: "0 20px 60px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ background: "linear-gradient(135deg,#0a0500,#150a02)", border: `1.5px solid ${C.gold}55`, borderRadius: 20, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }} className="grid-2">
            <div style={{ padding: 32 }}>
              <div style={{ fontSize: 13, color: C.rose, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>Goddess Tier · Coming soon</div>
              <div className="wm" style={{ fontSize: "clamp(32px,5vw,48px)", background: `linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1, marginBottom: 8 }}>ProofOS ✦</div>
              <div style={{ fontSize: 15, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20 }}>The manifestation ledger</div>
              <div style={{ fontSize: 15, color: "#8a7a5a", lineHeight: 1.75, marginBottom: 24 }}>
                Log your desire. Link it to your audio. Capture the signs as they arrive. Watch the proof build until it becomes undeniable.
              </div>
              <Btn onClick={onProofOS} outline>See how ProofOS works →</Btn>
            </div>
            <div style={{ padding: "24px 24px 24px 0" }} className="hide-mobile">
              <div style={{ background: "#0d0900", border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, height: "100%" }}>
                <div style={{ fontSize: 13, color: C.gold, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>Your proof board</div>
                {[
                  { d: "He texts me first", days: 14, status: "manifested", track: "He's already on his way back" },
                  { d: "€5,000 arrives", days: 9, status: "manifested", track: "Money is obsessed with me" },
                  { d: "Skin visibly glowing", days: 21, status: "in progress", track: "Gorgeous is my default" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < 2 ? `1px solid ${C.border2}` : "none", alignItems: "center" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.status === "manifested" ? C.green : C.gold, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: C.text2, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.d}</div>
                      <div style={{ fontSize: 11, color: C.dim }}>{item.track}</div>
                    </div>
                    <span style={{ fontSize: 11, padding: "2px 8px", background: item.status === "manifested" ? "#0a1a0a" : C.dim, color: item.status === "manifested" ? C.green : C.gold, borderRadius: 20, fontWeight: 700, flexShrink: 0 }}>
                      {item.status === "manifested" ? `✓ ${item.days}d` : `${item.days}d`}
                    </span>
                  </div>
                ))}
                <div style={{ marginTop: 14, textAlign: "center", fontSize: 13, color: C.muted }}>2 manifested · avg 11 days · 14 day streak ✦</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PROOF - testimonials */}
      <div style={{ padding: "0 20px 60px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 13, color: C.muted, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>Early members</div>
          <h2 style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 700, color: C.text }}>The proof is already building.</h2>
        </div>
        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            { q: "I listened three nights in a row. On day four he texted me out of nowhere. Two months of silence.", who: "S.R.", tier: "Audio Tier", cat: "SP & Love", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80" },
            { q: "€1,200 from a client I had completely forgotten. Three days after starting the money audio.", who: "M.K.", tier: "Goddess Tier", cat: "Money", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&q=80" },
            { q: "People keep asking what I'm using on my skin. I'm not using anything new.", who: "C.D.", tier: "Goddess Tier", cat: "Beauty", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80" },
            { q: "I woke up feeling like a different person. Calmer. More certain. Like something reset.", who: "L.M.", tier: "Audio Tier", cat: "Sleep", img: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=80&q=80" },
          ].map((t, i) => (
            <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
              <div style={{ fontSize: 11, color: C.rose, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>Early member · {t.cat}</div>
              <div style={{ fontSize: 15, color: C.text, lineHeight: 1.7, marginBottom: 16 }}>"{t.q}"</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <img src={t.img} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text2 }}>— {t.who}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{t.tier} · ★★★★★</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRICING */}
      <div style={{ padding: "0 20px 80px", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 13, color: C.muted, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>Pricing</div>
          <h2 style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 700, color: C.text, marginBottom: 8 }}>Choose your tier</h2>
          <div style={{ fontSize: 15, color: C.muted }}>She doesn't chase the sale. She simply exists — and you decide.</div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 5, display: "flex", gap: 4 }}>
            {["monthly", "annual"].map(b => (
              <button key={b} onClick={() => setBilling(b)} style={{ padding: "9px 20px", borderRadius: 9, background: billing === b ? `linear-gradient(90deg,${C.gold},${C.rose})` : "transparent", border: "none", color: billing === b ? "#000" : C.muted, fontSize: 14, fontWeight: 700, cursor: "pointer", minHeight: 40 }}>
                {b === "annual" ? "Annual — save 20%" : "Monthly"}
              </button>
            ))}
          </div>
        </div>

        <div className="price-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          {[
            {
              id: "audio", name: "Audio Tier",
              price: billing === "monthly" ? "€19.99" : "€192",
              period: billing === "monthly" ? "/month" : "/year",
              sub: billing === "annual" ? "€16/mo · 2 months free" : null,
              features: ["Full audio library — 50+ tracks", "All 6 desire categories", "4 new tracks every week", "Loop player + sleep timer", "No ads. Ever.", "Any device — no download"],
              cta: "Join Audio Tier",
            },
            {
              id: "goddess", name: "Goddess Tier", popular: true,
              price: billing === "monthly" ? "€33" : "€317",
              period: billing === "monthly" ? "/month" : "/year",
              sub: billing === "annual" ? "€26.40/mo · 2 months free" : null,
              features: ["Everything in Audio Tier", "ProofOS tracker — log desires + proof ✦", "Link every desire to your audio", "Early access — 48hrs before everyone", "Monthly ritual audio included", "Goddess community"],
              cta: "Become Goddess",
            }
          ].map(p => (
            <div key={p.id} style={{ background: C.card, border: `${p.popular ? "2px" : "1px"} solid ${p.popular ? C.gold + "88" : C.border}`, borderRadius: 16, padding: 24, position: "relative" }}>
              {p.popular && <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: `linear-gradient(90deg,${C.gold},${C.rose})`, color: "#000", fontSize: 11, fontWeight: 800, padding: "3px 16px", borderRadius: 20, whiteSpace: "nowrap", letterSpacing: "0.08em" }}>MOST POPULAR</div>}
              <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 4 }}>{p.name}</div>
              {p.sub && <div style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>{p.sub}</div>}
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}>
                <span style={{ fontSize: 40, fontWeight: 800, color: p.popular ? C.rose : C.gold, lineHeight: 1 }}>{p.price}</span>
                <span style={{ fontSize: 14, color: C.muted }}>{p.period}</span>
              </div>
              {p.features.map((f, i) => (
                <div key={i} style={{ fontSize: 14, color: f.includes("✦") ? C.gold : "#9a8060", marginBottom: 8, paddingLeft: 16, position: "relative", lineHeight: 1.5 }}>
                  <span style={{ position: "absolute", left: 0, color: C.gold, fontWeight: 700 }}>·</span>{f}
                </div>
              ))}
              <div style={{ marginTop: 20 }}>
                <Btn full outline={!p.popular} onClick={() => onJoin(p.id)}>{p.cta}</Btn>
              </div>
            </div>
          ))}
        </div>

        {/* Founder */}
        <div style={{ background: "linear-gradient(135deg,#0d0900,#1a0d02)", border: `2px solid ${C.gold}55`, borderRadius: 16, padding: 28 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "center" }} className="grid-2">
            <div>
              <div style={{ fontSize: 12, color: C.gold, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>First 1,000 only · Lifetime access</div>
              <div className="wm" style={{ fontSize: "clamp(24px,4vw,34px)", color: C.text, marginBottom: 8 }}>Founder Lifetime</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 14 }}>
                <span style={{ fontSize: 42, fontWeight: 800, color: C.gold }}>€500</span>
                <span style={{ fontSize: 14, color: C.muted }}>once · never pay again</span>
              </div>
              <div style={{ fontSize: 14, color: "#8a7a5a", lineHeight: 1.7, marginBottom: 16 }}>
                Full vault + ProofOS + every future feature + 1 GB evidence vault — forever. No subscription. No price increase. The €500 price closes when the first 1,000 join.
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                {["Full vault for life", "ProofOS for life", "1 GB evidence vault", "All future features", "Founder's seal ✦"].map((f, i) => (
                  <span key={i} style={{ padding: "4px 12px", background: C.gold + "18", border: `1px solid ${C.gold}44`, borderRadius: 20, fontSize: 12, color: C.gold, fontWeight: 600 }}>{f}</span>
                ))}
              </div>
              <Btn onClick={() => onJoin("founder")}>Claim lifetime access — €500</Btn>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16, textAlign: "center", fontSize: 13, color: C.dim, lineHeight: 1.9 }}>
          No refunds after 14 days · Cancel before renewal · Web app — no download needed · iPhone: Add to Home Screen
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: "28px 20px", textAlign: "center" }}>
        <span className="wm" style={{ fontSize: 20, display: "block", marginBottom: 8, background: `linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Self Hypnosis Goddess</span>
        <div style={{ fontSize: 13, color: C.dim }}>© 2026 Reshma Oracle · All rights reserved</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// PROOFOS PAGE
// ═══════════════════════════════════════════
function ProofOSPage({ onBack, onJoin }) {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: C.black }} className="fade">
      <nav style={{ position: "sticky", top: 0, zIndex: 100, padding: "0 20px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,0,0.96)", borderBottom: `1px solid ${C.border}` }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.muted, fontSize: 15, cursor: "pointer" }}>← Back</button>
        <span className="wm" style={{ fontSize: 18, background: `linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Self Hypnosis Goddess</span>
        <div style={{ width: 60 }} />
      </nav>

      {/* Hero */}
      <div style={{ padding: "60px 20px 48px", textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
        <div style={{ fontSize: 13, color: C.rose, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>Goddess Tier Exclusive · Coming Soon</div>
        <div className="wm" style={{ fontSize: "clamp(56px,12vw,90px)", lineHeight: 0.95, marginBottom: 12, background: `linear-gradient(135deg,${C.gold},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ProofOS</div>
        <div style={{ fontSize: 16, color: C.muted, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 24 }}>The manifestation ledger</div>
        <div style={{ fontSize: "clamp(18px,3vw,22px)", color: C.text, lineHeight: 1.6, marginBottom: 12, fontWeight: 500 }}>
          You've been manifesting.<br />Now watch it prove itself.
        </div>
        <div style={{ fontSize: 16, color: "#8a7a5a", lineHeight: 1.75, marginBottom: 36 }}>
          ProofOS links every desire you set to the exact audio you listened to. It captures your signs. It records your proof. It shows you exactly how many days it took from first listen to final result.
        </div>
        {!joined ? (
          <div style={{ maxWidth: 400, margin: "0 auto" }}>
            <div style={{ display: "flex", gap: 10 }}>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email" />
              <Btn onClick={() => { if (email.includes("@")) setJoined(true); }}>Join waitlist</Btn>
            </div>
            <div style={{ fontSize: 13, color: C.dim, marginTop: 8 }}>Goddess Tier members get first access · No spam</div>
          </div>
        ) : (
          <div style={{ padding: "16px 24px", background: "#0a1a0a", border: `1px solid #2a4a2a`, borderRadius: 12, maxWidth: 400, margin: "0 auto", fontSize: 15, color: C.green, fontWeight: 500 }}>
            ✓ You're on the list. First access when ProofOS launches.
          </div>
        )}
      </div>

      {/* HOW IT WORKS — HORIZONTAL */}
      <div style={{ padding: "0 20px 60px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ fontSize: "clamp(22px,4vw,34px)", fontWeight: 700, color: C.text }}>How ProofOS works</h2>
        </div>
        <div className="step-row" style={{ display: "flex", gap: 0, alignItems: "stretch" }}>
          {[
            {
              num: "01",
              img: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=80",
              title: "Set your intention",
              body: "State exactly what you want. Specific. Present tense. The way your hypnosis audios trained you to think. This becomes your active proof thread."
            },
            {
              num: "02",
              img: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&q=80",
              title: "Listen with purpose",
              body: "Every track you play links automatically to your active proof threads. Your listening becomes intentional. Every session is dated and recorded."
            },
            {
              num: "03",
              img: "https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=600&q=80",
              title: "Capture the proof",
              body: "Signs, synchronicities, results. A photo of the bank notification. A screenshot of the text. A voice note. You log them as they arrive."
            },
            {
              num: "04",
              img: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=600&q=80",
              title: "Mark it manifested",
              body: "The moment it arrives — you mark it. The thread closes. ProofOS shows you the days from first listen to final proof. Undeniable."
            },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "stretch", flex: 1 }}>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden", flex: 1, borderLeft: i > 0 ? "none" : undefined, borderTopLeftRadius: i > 0 ? 0 : 14, borderBottomLeftRadius: i > 0 ? 0 : 14, borderTopRightRadius: i < 3 ? 0 : 14, borderBottomRightRadius: i < 3 ? 0 : 14 }}>
                <div style={{ position: "relative" }}>
                  <img src={s.img} alt={s.title} style={{ width: "100%", height: 140, objectFit: "cover", display: "block", filter: "brightness(0.6)" }} />
                  <div style={{ position: "absolute", top: 12, left: 12, fontSize: 28, fontWeight: 800, color: C.gold, fontFamily: "monospace", opacity: 0.8 }}>{s.num}</div>
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 8 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{s.body}</div>
                </div>
              </div>
              {i < 3 && (
                <div className="step-arrow" style={{ display: "flex", alignItems: "center", padding: "0 4px", color: C.gold, fontSize: 20, flexShrink: 0 }}>→</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* PROOF THREAD EXAMPLE */}
      <div style={{ padding: "0 20px 60px", maxWidth: 700, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h2 style={{ fontSize: "clamp(22px,4vw,32px)", fontWeight: 700, color: C.text, marginBottom: 8 }}>A real proof thread</h2>
          <div style={{ fontSize: 15, color: C.muted }}>This is what your evidence looks like inside ProofOS</div>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 4 }}>Proof Thread · 9 days</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: C.text2 }}>I receive €5,000 from an unexpected source</div>
            </div>
            <span style={{ padding: "5px 12px", background: "#0a1a0a", color: C.green, borderRadius: 20, fontSize: 13, fontWeight: 700, flexShrink: 0 }}>✓ Manifested</span>
          </div>
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border2}`, background: "#090600" }}>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>Linked audio</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.gold }}>🎧 Money is obsessed with me · 528hz · Subliminal · Listened 9 times</div>
          </div>
          {[
            { day: "Day 1", icon: "🎧", label: "First listen", detail: "Night mode. Set intention before sleeping.", color: C.muted },
            { day: "Day 3", icon: "🎙", label: "Voice note logged", detail: "\"Felt something shift on third listen. Stopped needing it.\" — 0:47", color: C.text2 },
            { day: "Day 5", icon: "✦", label: "Sign noticed", detail: "Found €20 in a jacket I hadn't worn since winter.", color: C.gold },
            { day: "Day 7", icon: "📸", label: "Photo proof", detail: "Screenshot of bank notification — unexpected transfer.", color: C.gold },
            { day: "Day 9", icon: "✓", label: "Manifested — €5,000 client payment", detail: "Project I had forgotten I quoted. Paid in full.", color: C.green, final: true },
          ].map((e, i) => (
            <div key={i} style={{ display: "flex", gap: 14, padding: "12px 20px", borderBottom: i < 4 ? `1px solid ${C.border2}` : "none", background: e.final ? "#0a1a0a" : "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: e.final ? C.green + "22" : "#0d0900", border: `1.5px solid ${e.final ? C.green : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{e.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 3 }}>
                  <span style={{ fontSize: 11, color: C.dim, fontWeight: 600 }}>{e.day}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: e.color }}>{e.label}</span>
                </div>
                <div style={{ fontSize: 13, color: C.muted }}>{e.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: "0 20px 80px", textAlign: "center", maxWidth: 500, margin: "0 auto" }}>
        <div className="wm" style={{ fontSize: "clamp(24px,4vw,36px)", color: C.text, marginBottom: 14 }}>Ready to begin?</div>
        <div style={{ fontSize: 15, color: C.muted, marginBottom: 28, lineHeight: 1.7 }}>
          ProofOS is included in the Goddess Tier.<br />
          Start with the audio library now. The tracker unlocks when it launches.
        </div>
        <Btn full onClick={() => onJoin("goddess")}>Join Goddess Tier — €33/month</Btn>
        <div style={{ marginTop: 10, fontSize: 13, color: C.dim }}>Or join the waitlist above for early access notification</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// ONBOARDING
// ═══════════════════════════════════════════
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
      {step < 4 && <button onClick={onBack} style={{ position: "fixed", top: 20, left: 20, background: "none", border: "none", color: C.muted, fontSize: 15, cursor: "pointer" }}>← Back</button>}
      {step < 4 && (
        <div style={{ display: "flex", gap: 0, marginBottom: 40 }}>
          {[1, 2, 3].map(n => (
            <div key={n} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: n <= step ? `linear-gradient(135deg,${C.gold},${C.rose})` : C.card, border: `1.5px solid ${n <= step ? C.gold : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: n <= step ? "#000" : C.muted }}>
                {n < step ? "✓" : n}
              </div>
              {n < 3 && <div style={{ width: 48, height: "1px", background: n < step ? C.gold : C.border }} />}
            </div>
          ))}
        </div>
      )}
      <div style={{ width: "100%", maxWidth: 460 }}>
        {step === 1 && (
          <div className="fade">
            <div className="wm" style={{ fontSize: 24, display: "block", marginBottom: 6, background: `linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Self Hypnosis Goddess</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 4 }}>Create your account</div>
            <div style={{ fontSize: 15, color: C.muted, marginBottom: 28 }}>Joining: {tierName}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              <input placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input placeholder="Email address" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              <input placeholder="Password (min 8 characters)" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <Btn full onClick={next} disabled={!form.email || form.password.length < 8}>Continue →</Btn>
            <div style={{ textAlign: "center", marginTop: 14, fontSize: 14, color: C.muted }}>
              Already a member? <span style={{ color: C.gold, cursor: "pointer" }} onClick={onBack}>Sign in</span>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="fade">
            <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 4 }}>Confirm your plan</div>
            <div style={{ fontSize: 15, color: C.muted, marginBottom: 24 }}>You chose: {tierName}</div>
            {tier !== "founder" && (
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                {["monthly", "annual"].map(b => (
                  <button key={b} onClick={() => setBilling(b)} style={{ flex: 1, padding: 16, background: billing === b ? C.card2 : C.card, border: `${billing === b ? "2px" : "1px"} solid ${billing === b ? C.gold + "88" : C.border}`, borderRadius: 12, cursor: "pointer", textAlign: "left" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: billing === b ? C.gold : C.text, marginBottom: 2 }}>{b === "monthly" ? "Monthly" : "Annual"}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: billing === b ? C.gold : C.text }}>{tier === "goddess" ? (b === "monthly" ? "€33" : "€317") : (b === "monthly" ? "€19.99" : "€192")}<span style={{ fontSize: 12, color: C.muted }}>/{b === "monthly" ? "mo" : "yr"}</span></div>
                    {b === "annual" && <div style={{ fontSize: 12, color: C.rose, marginTop: 4, fontWeight: 600 }}>Save 20% · 2 months free</div>}
                  </button>
                ))}
              </div>
            )}
            <div style={{ background: C.card, border: `1px solid ${C.gold}44`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
              {(tier === "goddess" ? ["Full audio library", "4 new tracks/week", "ProofOS tracker (coming soon)", "Early access + monthly ritual"] :
                tier === "founder" ? ["Full vault forever", "ProofOS for life", "1 GB evidence vault", "All future features", "Founder's seal ✦"] :
                  ["Full audio library", "4 new tracks/week", "Loop player + sleep timer", "No ads. Ever."]).map((f, i) => (
                    <div key={i} style={{ fontSize: 14, color: C.text2, paddingLeft: 14, position: "relative", marginBottom: 6 }}>
                      <span style={{ position: "absolute", left: 0, color: C.gold, fontWeight: 700 }}>·</span>{f}
                    </div>
                  ))}
            </div>
            <Btn full onClick={next}>Continue to payment →</Btn>
          </div>
        )}
        {step === 3 && (
          <div className="fade">
            <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 24 }}>Secure checkout</div>
            <div style={{ background: C.card, border: `1.5px solid ${C.gold}55`, borderRadius: 12, padding: 18, marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{tierName}</div>
                <div style={{ fontSize: 13, color: C.muted }}>{tier === "founder" ? "One-time payment" : `Billed ${billing}`}</div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: C.gold }}>{price}</div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 14, color: "#7a6a52", lineHeight: 1.75 }}>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 8, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600 }}>Stripe secure checkout</div>
              You'll be redirected to Stripe's secure page.<br />
              No card data is stored by us · SSL encrypted<br />
              No refunds after 14 days from payment date
            </div>
            <Btn full onClick={next} disabled={loading}>{loading ? "Processing..." : "Pay with Stripe →"}</Btn>
          </div>
        )}
        {step === 4 && (
          <div style={{ textAlign: "center" }} className="fade">
            <div style={{ fontSize: 56, marginBottom: 20 }}>✦</div>
            <div className="wm" style={{ fontSize: 38, display: "block", marginBottom: 10, background: `linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Welcome.</div>
            <div style={{ fontSize: 16, color: C.muted, marginBottom: 36, lineHeight: 1.75 }}>
              Your portal is ready.<br />
              {tier === "goddess" && "ProofOS tracker activates when it launches."}
              {tier === "founder" && "Your Founder seal is locked in forever."}
            </div>
            <Btn full onClick={next}>Enter the portal →</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// PORTAL — FULL DASHBOARD
// ═══════════════════════════════════════════
function Portal({ userTier, onSignOut, onUpgrade }) {
  const [tab, setTab] = useState("audios");
  const [playing, setPlaying] = useState(null);
  const [activeCat, setActiveCat] = useState("all");
  const [loop, setLoop] = useState(true);
  const [sleep, setSleep] = useState(60);
  const [progress, setProgress] = useState(38);
  const [search, setSearch] = useState("");
  const [desires, setDesires] = useState([
    { id: 1, desire: "He texts me first", status: "manifested", track: "He's already on his way back", trackCat: "sp", days: 14, signs: ["Got a like on Instagram", "Mutual friend mentioned me"] },
    { id: 2, desire: "€5,000 arrives unexpectedly", status: "in_progress", track: "Money is obsessed with me", trackCat: "money", days: 6, signs: ["Found €20 in old jacket"] },
    { id: 3, desire: "Glowing skin visible to others", status: "in_progress", track: "Gorgeous is my default setting", trackCat: "beauty", days: 3, signs: [] },
  ]);
  const [newDesire, setNewDesire] = useState("");
  const [newSign, setNewSign] = useState({});
  const [expanded, setExpanded] = useState(null);

  const catColors = { sp: "#e05a7a", money: "#6ab05a", beauty: "#c8892a", sleep: "#6a8ad0", dna: "#9a7ad0", identity: "#c07070", all: C.gold };
  const catThumb = {
    sp: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=200&q=80",
    money: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=200&q=80",
    beauty: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&q=80",
    sleep: "https://images.unsplash.com/photo-1531353826977-0941b4779a1c?w=200&q=80",
    dna: "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=200&q=80",
    identity: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
  };

  const tracks = [
    { id: 1, title: "He's already on his way back", cat: "sp", tag: "SP & Love", freq: "432hz", type: "Subliminal", dur: "30:00", tier: "audio", isNew: true },
    { id: 2, title: "Money is obsessed with me", cat: "money", tag: "Money", freq: "528hz", type: "Hypnosis", dur: "25:00", tier: "audio", isNew: true },
    { id: 3, title: "Gorgeous is my default setting", cat: "beauty", tag: "Beauty", freq: "432hz", type: "Subliminal", dur: "35:00", tier: "audio" },
    { id: 4, title: "I've always been the prize", cat: "identity", tag: "Identity", freq: "LOA", type: "Subliminal", dur: "30:00", tier: "audio" },
    { id: 5, title: "DNA activation ceremony", cat: "dna", tag: "DNA", freq: "963hz", type: "Frequency", dur: "45:00", tier: "goddess" },
    { id: 6, title: "I manifest while I sleep", cat: "sleep", tag: "Sleep", freq: "Delta", type: "Sleep subliminal", dur: "60:00", tier: "audio" },
    { id: 7, title: "He's obsessed and he knows it", cat: "sp", tag: "SP & Love", freq: "432hz", type: "Subliminal", dur: "28:00", tier: "audio" },
    { id: 8, title: "Reality rearranges for me", cat: "identity", tag: "Identity", freq: "963hz", type: "Frequency", dur: "33:00", tier: "goddess" },
    { id: 9, title: "I get prettier every single day", cat: "beauty", tag: "Beauty", freq: "432hz", type: "Subliminal", dur: "25:00", tier: "audio", isNew: true },
    { id: 10, title: "Lucky girl, unlimited", cat: "money", tag: "Money", freq: "528hz", type: "Subliminal", dur: "22:00", tier: "audio", isNew: true },
  ];

  const cats = [
    { id: "all", label: "All tracks" },
    { id: "sp", label: "SP & Love" },
    { id: "money", label: "Money" },
    { id: "beauty", label: "Beauty" },
    { id: "sleep", label: "Sleep" },
    { id: "dna", label: "DNA" },
    { id: "identity", label: "Identity" },
  ];

  const canPlay = t => t.tier === "audio" || userTier === "goddess";
  const ct = tracks.find(t => t.id === playing);
  const filtered = tracks.filter(t => (activeCat === "all" || t.cat === activeCat) && (!search || t.title.toLowerCase().includes(search.toLowerCase())));
  const manifested = desires.filter(d => d.status === "manifested").length;

  const addDesire = () => {
    if (!newDesire.trim()) return;
    setDesires([{ id: Date.now(), desire: newDesire, status: "in_progress", track: ct?.title || null, trackCat: ct?.cat || null, days: 0, signs: [] }, ...desires]);
    setNewDesire("");
  };

  const addSign = (id, sign) => {
    if (!sign.trim()) return;
    setDesires(desires.map(d => d.id === id ? { ...d, signs: [...d.signs, sign] } : d));
    setNewSign(prev => ({ ...prev, [id]: "" }));
  };

  const markManifested = id => setDesires(desires.map(d => d.id === id ? { ...d, status: "manifested" } : d));
  const undoManifested = id => setDesires(desires.map(d => d.id === id ? { ...d, status: "in_progress" } : d));

  const signSuggestions = ["Saw a number sequence (111, 444...)", "Dreamed about it", "Someone mentioned it randomly", "Found money unexpectedly", "Received a surprise message", "Something shifted in my body", "Felt calm certainty out of nowhere", "Overheard a conversation about it"];

  const tabs = [
    { id: "audios", icon: "▶", label: "Audios" },
    { id: "tracker", icon: "✦", label: "Tracker" },
    { id: "account", icon: "◎", label: "Account" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.black }} className="fade">

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: "0 16px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#030200", position: "sticky", top: 0, zIndex: 50 }}>
        <span className="wm" style={{ fontSize: 18, background: `linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Self Hypnosis Goddess</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {userTier === "goddess"
            ? <div style={{ padding: "4px 12px", background: "#1a0a04", border: `1px solid ${C.gold}44`, borderRadius: 20, fontSize: 12, color: C.gold, fontWeight: 700 }}>Goddess ✦</div>
            : <button onClick={onUpgrade} style={{ padding: "4px 12px", background: "none", border: `1px solid ${C.rose}44`, borderRadius: 20, fontSize: 12, color: C.rose, fontWeight: 700, cursor: "pointer" }}>Upgrade ↑</button>
          }
        </div>
      </div>

      {/* Desktop tab nav */}
      <div className="desktop-tabs" style={{ display: "flex", borderBottom: `1px solid ${C.border}`, background: "#050300", position: "sticky", top: 56, zIndex: 49 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "13px 8px", background: "none", border: "none", borderBottom: `2px solid ${tab === t.id ? C.gold : "transparent"}`, color: tab === t.id ? C.gold : C.muted, fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Stats bar */}
      <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${C.border}`, background: "#080500" }}>
        {[
          { v: tracks.filter(t => canPlay(t)).length, l: "Tracks available", c: C.text },
          { v: desires.length, l: "Intentions set", c: C.gold },
          { v: manifested, l: "Manifested", c: C.rose },
          { v: "14d", l: "Listening streak", c: C.green },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, padding: "10px 12px", textAlign: "center", borderRight: i < 3 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: s.c, lineHeight: 1 }}>{s.v}</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 2, letterSpacing: "0.05em" }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div className="portal-body" style={{ display: "flex", minHeight: "calc(100vh - 140px)" }}>

        {/* LEFT SIDEBAR — categories */}
        <div className="hide-mobile" style={{ width: 200, borderRight: `1px solid ${C.border}`, background: "#050300", flexShrink: 0, position: "sticky", top: 112, height: "calc(100vh - 112px)", overflowY: "auto" }}>
          <div style={{ padding: "12px 8px" }}>
            {cats.map(c => (
              <button key={c.id} onClick={() => { setActiveCat(c.id); setTab("audios"); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: "none", background: activeCat === c.id && tab === "audios" ? catColors[c.id] + "18" : "none", cursor: "pointer", marginBottom: 4, textAlign: "left", transition: "all 0.2s" }}>
                {c.id !== "all" && (
                  <img src={catThumb[c.id]} alt="" style={{ width: 32, height: 32, borderRadius: 8, objectFit: "cover", flexShrink: 0, border: `1.5px solid ${activeCat === c.id ? catColors[c.id] : C.border}` }} />
                )}
                {c.id === "all" && (
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: C.gold + "22", border: `1.5px solid ${activeCat === c.id ? C.gold : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>▶</div>
                )}
                <span style={{ fontSize: 13, fontWeight: 600, color: activeCat === c.id && tab === "audios" ? catColors[c.id] : C.muted }}>{c.label}</span>
              </button>
            ))}
            <div style={{ height: 1, background: C.border, margin: "8px 0" }} />
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, border: "none", background: tab === t.id && t.id !== "audios" ? C.gold + "18" : "none", cursor: "pointer", marginBottom: 4, textAlign: "left" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: tab === t.id && t.id !== "audios" ? C.gold + "22" : "#0d0900", border: `1.5px solid ${tab === t.id && t.id !== "audios" ? C.gold : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{t.icon}</div>
                <span style={{ fontSize: 13, fontWeight: 600, color: tab === t.id && t.id !== "audios" ? C.gold : C.muted }}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ flex: 1, padding: "18px 16px 32px", maxWidth: 700, overflowX: "hidden" }}>

          {/* AUDIOS */}
          {tab === "audios" && (
            <div className="fade">
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tracks..." style={{ marginBottom: 14 }} />
              {/* Mobile category chips */}
              <div style={{ display: "flex", gap: 6, flexWrap: "nowrap", overflowX: "auto", marginBottom: 16, paddingBottom: 4 }} className="desktop-tabs" >
                {cats.map(c => (
                  <button key={c.id} onClick={() => setActiveCat(c.id)} style={{ padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${activeCat === c.id ? catColors[c.id] || C.gold : C.border}`, background: activeCat === c.id ? (catColors[c.id] || C.gold) + "18" : "none", color: activeCat === c.id ? catColors[c.id] || C.gold : C.muted, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", minHeight: 36, fontWeight: 600 }}>{c.label}</button>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {filtered.map(t => {
                  const isP = playing === t.id;
                  const can = canPlay(t);
                  const color = catColors[t.cat] || C.gold;
                  return (
                    <div key={t.id} onClick={() => can && setPlaying(isP ? null : t.id)}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: isP ? C.card2 : C.card, border: `1px solid ${isP ? color + "66" : C.border}`, borderRadius: 12, cursor: can ? "pointer" : "default", opacity: can ? 1 : 0.45, transition: "all 0.2s" }}
                      onMouseEnter={e => can && !isP && (e.currentTarget.style.borderColor = color + "44")}
                      onMouseLeave={e => can && !isP && (e.currentTarget.style.borderColor = C.border)}>
                      <img src={catThumb[t.cat]} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover", flexShrink: 0, border: `1.5px solid ${isP ? color : C.border}`, filter: can ? "none" : "grayscale(1)" }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: isP ? color : C.text2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</span>
                          {t.isNew && <span style={{ fontSize: 10, padding: "1px 7px", background: C.rose + "22", color: C.rose, borderRadius: 10, fontWeight: 700, flexShrink: 0 }}>NEW</span>}
                        </div>
                        <div style={{ fontSize: 12, color: C.dim }}>{t.freq} · {t.type}{!can ? " · Goddess only" : ""} · {t.dur}</div>
                      </div>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: isP ? color + "22" : "#080500", border: `1.5px solid ${isP ? color : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {!can ? <span style={{ fontSize: 14 }}>🔒</span>
                          : isP ? <div className="wave"><span /><span /><span /><span /><span /></div>
                            : <span style={{ fontSize: 13, color: C.muted }}>▶</span>}
                      </div>
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
                  <div style={{ fontSize: 48, marginBottom: 16 }}>✦</div>
                  <div className="wm" style={{ fontSize: 28, color: C.text, marginBottom: 10 }}>ProofOS</div>
                  <div style={{ fontSize: 16, color: C.muted, marginBottom: 24, lineHeight: 1.7 }}>Log your desires. Link them to your listening.<br />Watch the proof accumulate.</div>
                  <Btn onClick={onUpgrade}>Upgrade to Goddess — €33/month</Btn>
                </div>
              ) : (
                <div>
                  {/* Manifestation rate */}
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Manifestation rate</span>
                      <span style={{ fontSize: 14, color: C.gold, fontWeight: 700 }}>{manifested}/{desires.length}</span>
                    </div>
                    <div style={{ height: 6, background: C.border, borderRadius: 3 }}>
                      <div style={{ width: `${(manifested / desires.length) * 100}%`, height: "100%", background: `linear-gradient(90deg,${C.gold},${C.rose})`, borderRadius: 3, transition: "width 0.5s" }} />
                    </div>
                  </div>

                  {/* Add desire */}
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
                    <div style={{ fontSize: 12, color: C.muted, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, marginBottom: 10 }}>Log a new intention</div>
                    <input value={newDesire} onChange={e => setNewDesire(e.target.value)} placeholder="State it in present tense — I am, I have, I receive..." style={{ marginBottom: 10 }} onKeyDown={e => e.key === "Enter" && addDesire()} />
                    {ct && <div style={{ fontSize: 13, color: C.muted, marginBottom: 10 }}>Will link to: <span style={{ color: C.gold, fontWeight: 600 }}>{ct.title}</span></div>}
                    <Btn full small onClick={addDesire} disabled={!newDesire.trim()}>Add intention +</Btn>
                  </div>

                  {/* Desires */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {desires.map(d => {
                      const color = catColors[d.trackCat] || C.gold;
                      return (
                        <div key={d.id} style={{ background: C.card, border: `1px solid ${d.status === "manifested" ? "#2a4a2a88" : C.border}`, borderRadius: 12, overflow: "hidden" }}>
                          <div style={{ padding: "14px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }} onClick={() => setExpanded(expanded === d.id ? null : d.id)}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 15, fontWeight: 600, color: C.text2, marginBottom: 4 }}>{d.desire}</div>
                              {d.track && (
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  <span style={{ fontSize: 12 }}>🎧</span>
                                  <span style={{ fontSize: 12, color: color, fontWeight: 500 }}>{d.track}</span>
                                  {d.days > 0 && <span style={{ fontSize: 12, color: C.dim }}>· {d.days} days</span>}
                                </div>
                              )}
                              {d.signs.length > 0 && <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>✦ {d.signs.length} sign{d.signs.length !== 1 ? "s" : ""} logged</div>}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
                              {d.status === "manifested" ? (
                                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                  <span style={{ padding: "4px 10px", background: "#1a3a1a", color: C.green, borderRadius: 20, fontSize: 12, fontWeight: 700 }}>✓ manifested</span>
                                  <button onClick={e => { e.stopPropagation(); undoManifested(d.id); }} style={{ padding: "4px 8px", background: "none", border: `1px solid ${C.border}`, borderRadius: 8, color: C.dim, fontSize: 11, cursor: "pointer" }}>undo</button>
                                </div>
                              ) : (
                                <button onClick={e => { e.stopPropagation(); markManifested(d.id); }} style={{ padding: "4px 12px", background: "none", border: `1px solid ${C.gold}55`, borderRadius: 20, color: C.gold, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>mark done ✓</button>
                              )}
                              <span style={{ fontSize: 12, color: C.dim }}>{expanded === d.id ? "▲ less" : "▼ signs"}</span>
                            </div>
                          </div>

                          {expanded === d.id && (
                            <div style={{ borderTop: `1px solid ${C.border2}`, padding: "14px 16px", background: "#090600" }}>
                              <div style={{ fontSize: 12, color: C.muted, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, marginBottom: 10 }}>Signs & synchronicities</div>
                              {d.signs.length === 0 && <div style={{ fontSize: 14, color: C.dim, marginBottom: 12 }}>No signs logged yet. Add your first one below.</div>}
                              {d.signs.map((s, i) => (
                                <div key={i} style={{ fontSize: 14, color: C.muted, paddingLeft: 14, position: "relative", marginBottom: 6 }}>
                                  <span style={{ position: "absolute", left: 0, color: C.gold }}>·</span>{s}
                                </div>
                              ))}
                              {d.status !== "manifested" && (
                                <div style={{ marginTop: 12 }}>
                                  {/* Sign suggestions */}
                                  <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>Quick add a sign:</div>
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                                    {signSuggestions.slice(0, 4).map((s, i) => (
                                      <button key={i} onClick={() => addSign(d.id, s)} style={{ padding: "4px 10px", background: "none", border: `1px solid ${C.border}`, borderRadius: 20, color: C.muted, fontSize: 11, cursor: "pointer" }}>{s}</button>
                                    ))}
                                  </div>
                                  <div style={{ display: "flex", gap: 8 }}>
                                    <input value={newSign[d.id] || ""} onChange={e => setNewSign(prev => ({ ...prev, [d.id]: e.target.value }))} placeholder="Or write your own sign..." style={{ flex: 1 }} onKeyDown={e => e.key === "Enter" && addSign(d.id, newSign[d.id] || "")} />
                                    <Btn small onClick={() => addSign(d.id, newSign[d.id] || "")} disabled={!newSign[d.id]?.trim()}>Add</Btn>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ACCOUNT */}
          {tab === "account" && (
            <div className="fade" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
                <div style={{ fontSize: 12, color: C.muted, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, marginBottom: 14 }}>Your account</div>
                <div style={{ fontSize: 13, color: C.muted, marginBottom: 3 }}>Signed in as</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 14 }}>member@reshmaoracle.com</div>
                <div style={{ fontSize: 13, color: C.muted, marginBottom: 3 }}>Current plan</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: userTier === "goddess" ? C.gold : C.text2 }}>{userTier === "goddess" ? "Goddess Tier · €33/month" : "Audio Tier · €19.99/month"}</div>
              </div>
              {userTier === "audio" && (
                <div onClick={onUpgrade} style={{ background: "#0a0500", border: `1.5px solid ${C.gold}44`, borderRadius: 12, padding: 18, cursor: "pointer" }}>
                  <div style={{ fontSize: 12, color: C.rose, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Upgrade available</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 4 }}>Goddess Tier — €33/month</div>
                  <div style={{ fontSize: 13, color: C.muted }}>Unlock ProofOS tracker + early access →</div>
                </div>
              )}
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
                <div style={{ fontSize: 12, color: C.muted, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, marginBottom: 14 }}>Subscription</div>
                <div style={{ fontSize: 14, color: "#8a7a5a", lineHeight: 1.85, marginBottom: 14 }}>Next billing: 29 July 2026<br />No refunds after 14 days<br />Cancel before renewal to avoid next charge</div>
                <Btn small outline onClick={() => {}}>Manage billing ↗</Btn>
              </div>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18 }}>
                <div style={{ fontSize: 12, color: C.muted, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, marginBottom: 14 }}>Access your portal</div>
                <div style={{ fontSize: 14, color: "#8a7a5a", lineHeight: 1.85 }}>Any browser · Desktop, iPhone, Android<br />iPhone: tap Share → "Add to Home Screen"<br />No App Store download needed</div>
              </div>
              <button onClick={onSignOut} style={{ padding: 14, background: "none", border: `1px solid ${C.border}`, borderRadius: 10, color: C.muted, fontSize: 15, cursor: "pointer", minHeight: 48 }}>Sign out</button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="mobile-nav">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "10px 8px", background: "none", border: "none", color: tab === t.id ? C.gold : C.muted, fontSize: 10, fontWeight: 600, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minHeight: 56, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          <span style={{ fontSize: 18 }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* Player bar */}
      {playing && ct && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#060400", borderTop: `1px solid ${C.gold}44`, padding: "10px 16px", zIndex: 100 }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
              <img src={catThumb[ct.cat]} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.gold, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ct.title}</div>
                <div style={{ fontSize: 11, color: C.dim }}>{ct.freq} · {ct.type} · {loop ? "Loop on" : "Loop off"} · Sleep: {sleep ? `${sleep}m` : "off"}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                <button onClick={() => setLoop(!loop)} style={{ background: "none", border: "none", fontSize: 18, color: loop ? C.gold : C.dim, cursor: "pointer", minWidth: 32, minHeight: 32 }}>↻</button>
                <button onClick={() => setPlaying(null)} style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg,${C.gold},${C.rose})`, border: "none", color: "#000", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>⏸</button>
                <button onClick={() => setSleep(s => s === 60 ? 30 : s === 30 ? 0 : 60)} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "5px 10px", color: sleep ? C.gold : C.dim, fontSize: 12, cursor: "pointer", minHeight: 32 }}>{sleep ? `${sleep}m` : "∞"}</button>
              </div>
            </div>
            <div style={{ height: 3, background: C.border, borderRadius: 2, cursor: "pointer" }} onClick={e => { const r = e.target.getBoundingClientRect(); setProgress(Math.round(((e.clientX - r.left) / r.width) * 100)); }}>
              <div style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg,${C.gold},${C.rose})`, borderRadius: 2 }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
