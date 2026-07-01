import { useState, useRef, useEffect } from "react";

const C = {
  black: "#000000", surface: "#060400", card: "#0a0800", card2: "#0f0b01",
  border: "#1e1608", border2: "#140f04", gold: "#C8892A", rose: "#C4365A",
  text: "#e8e0d0", text2: "#c8a870", muted: "#5a4a2a", dim: "#2a1e08", green: "#3a8a4a",
};

const FREE_TRACK_URL = "https://qtwvslrwmreazmrdktsn.supabase.co/storage/v1/object/public/tracks/COMPRESS%2010%20YEARS%20OF%20DELAY%20INTO%20ONE%20HOUR%20EMDR%20THEN%20ECHO%2007.04.2026.mp3";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300;1,400;1,600&family=Inter:wght@300;400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:#000;color:#e8e0d0;font-family:'Inter',sans-serif;overflow-x:hidden;-webkit-font-smoothing:antialiased}
button,input{font-family:'Inter',sans-serif}
input{background:#080600;border:1px solid #1e1608;color:#e8e0d0;border-radius:10px;padding:14px 18px;font-size:16px;width:100%;outline:none;transition:border-color 0.2s}
input:focus{border-color:#C8892A88}
::-webkit-scrollbar{width:2px}
::-webkit-scrollbar-thumb{background:#1e1608}
.wm{font-family:'Cormorant Garamond',serif;font-style:italic}
.fade{animation:fi 0.4s ease}
@keyframes fi{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.sw span{display:inline-block;width:3px;border-radius:2px;background:linear-gradient(180deg,#C8892A,#C4365A);animation:sw 1.2s ease-in-out infinite}
.sw span:nth-child(1){height:8px;animation-delay:0s}
.sw span:nth-child(2){height:20px;animation-delay:.1s}
.sw span:nth-child(3){height:32px;animation-delay:.2s}
.sw span:nth-child(4){height:24px;animation-delay:.15s}
.sw span:nth-child(5){height:36px;animation-delay:.25s}
.sw span:nth-child(6){height:16px;animation-delay:.05s}
.sw span:nth-child(7){height:28px;animation-delay:.3s}
@keyframes sw{0%,100%{transform:scaleY(0.3);opacity:0.4}50%{transform:scaleY(1);opacity:1}}
.ring{position:absolute;border-radius:50%;border:1px solid;pointer-events:none;top:50%;left:50%;animation:breathe 5s ease-in-out infinite}
@keyframes breathe{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:var(--op)}50%{transform:translate(-50%,-50%) scale(1.06);opacity:calc(var(--op)*2.5)}}
@keyframes pulse{0%{box-shadow:0 0 0 0 #C8892A55}70%{box-shadow:0 0 0 24px #C8892A00}100%{box-shadow:0 0 0 0 #C8892A00}}
.pulse{animation:pulse 2s infinite}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.float{animation:float 4s ease-in-out infinite}
@media(max-width:768px){
  .hide-mob{display:none!important}
  .grid-2{grid-template-columns:1fr!important}
  .grid-3{grid-template-columns:1fr!important}
  .price-grid{grid-template-columns:1fr!important}
  .step-flow{flex-direction:column!important}
  .mob-nav{display:flex!important}
  .desk-tabs{display:none!important}
  .sidebar{display:none!important}
  .portal-pb{padding-bottom:80px!important}
}
.mob-nav{display:none}
`;

function Btn({ children, onClick, full, outline, small, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: full ? "100%" : "auto", padding: small ? "10px 20px" : "16px 32px",
      background: disabled ? "#1a1208" : outline ? "transparent" : `linear-gradient(90deg,${C.gold},${C.rose})`,
      border: outline ? `1.5px solid ${C.gold}88` : "none", borderRadius: 12,
      color: disabled ? C.dim : outline ? C.gold : "#000",
      fontSize: small ? 14 : 16, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      gap: 8, transition: "transform 0.15s", minHeight: 48, letterSpacing: "0.02em", flexShrink: 0,
    }}
      onMouseEnter={e => !disabled && (e.currentTarget.style.transform = "translateY(-2px)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
    >{children}</button>
  );
}

function Rings({ count = 4, color = C.gold }) {
  const sizes = [180, 320, 480, 660, 860];
  const ops = [0.15, 0.08, 0.05, 0.03, 0.02];
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, background: `radial-gradient(circle,${color}08 0%,transparent 70%)`, borderRadius: "50%" }} />
      {sizes.slice(0, count).map((s, i) => (
        <div key={i} className="ring" style={{ width: s, height: s, borderColor: `${color}${['22','12','08','05','03'][i]}`, "--op": ops[i], animationDelay: `${i * 0.9}s` }} />
      ))}
    </div>
  );
}

// Animated dashboard mockup for ProofOS
function DashboardMockup({ mini }) {
  const desires = [
    { text: "He texts me first", status: "manifested", days: 14, cat: "love", progress: 100 },
    { text: "€10,000 arrives", status: "manifested", days: 9, cat: "money", progress: 100 },
    { text: "Skin visibly glowing", status: "in_progress", days: 21, cat: "beauty", progress: 72 },
    { text: "Dream job offer", status: "in_progress", days: 5, cat: "life", progress: 30 },
  ];
  const catColors = { love: C.rose, money: "#b87a20", beauty: C.gold, life: "#8a6ad0" };
  if (mini) return (
    <div style={{ background: "#080600", border: `1px solid ${C.gold}44`, borderRadius: 14, overflow: "hidden", fontSize: 12 }}>
      <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: C.gold, fontWeight: 700, fontSize: 11 }}>ProofOS · Your board</span>
        <span style={{ color: C.green, fontSize: 10, fontWeight: 700 }}>2 manifested ✦</span>
      </div>
      {desires.slice(0, 3).map((d, i) => (
        <div key={i} style={{ padding: "8px 14px", borderBottom: i < 2 ? `1px solid ${C.border2}` : "none", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: catColors[d.cat], flexShrink: 0 }} />
          <span style={{ flex: 1, color: d.status === "manifested" ? C.text2 : C.muted, fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.text}</span>
          <span style={{ fontSize: 10, padding: "2px 7px", background: d.status === "manifested" ? "#0a1a0a" : C.dim, color: d.status === "manifested" ? C.green : C.gold, borderRadius: 10, fontWeight: 700, flexShrink: 0 }}>{d.status === "manifested" ? `✓ ${d.days}d` : `${d.days}d`}</span>
        </div>
      ))}
    </div>
  );
  return (
    <div style={{ background: "#060400", border: `1px solid ${C.gold}44`, borderRadius: 20, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: "#080600" }}>
        <div>
          <div style={{ fontSize: 11, color: C.muted, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 2 }}>ProofOS · Manifestation Ledger</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.gold }}>Your proof board</div>
        </div>
        <div style={{ fontSize: 11, color: C.green, fontWeight: 700, padding: "4px 10px", background: "#0a1a0a", borderRadius: 20, border: `1px solid #2a4a2a` }}>14 day streak ✦</div>
      </div>
      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", borderBottom: `1px solid ${C.border}` }}>
        {[{ v: 4, l: "Intentions", c: C.text2 }, { v: 2, l: "Manifested", c: C.rose }, { v: 18, l: "Signs logged", c: C.gold }, { v: "11d", l: "Avg days", c: C.green }].map((s, i) => (
          <div key={i} style={{ padding: "12px 8px", textAlign: "center", borderRight: i < 3 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.c, lineHeight: 1, marginBottom: 3 }}>{s.v}</div>
            <div style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>{s.l}</div>
          </div>
        ))}
      </div>
      {/* Desires */}
      {desires.map((d, i) => (
        <div key={i} style={{ padding: "12px 20px", borderBottom: i < desires.length - 1 ? `1px solid ${C.border2}` : "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: catColors[d.cat], flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: d.status === "manifested" ? C.text2 : C.text2 }}>{d.text}</span>
            <span style={{ fontSize: 11, padding: "3px 10px", background: d.status === "manifested" ? "#0a1a0a" : C.dim, color: d.status === "manifested" ? C.green : C.gold, borderRadius: 20, fontWeight: 700, flexShrink: 0 }}>
              {d.status === "manifested" ? `✓ ${d.days} days` : `${d.days} days`}
            </span>
          </div>
          <div style={{ height: 4, background: C.border, borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: `${d.progress}%`, height: "100%", background: d.status === "manifested" ? `linear-gradient(90deg,${C.green},${C.gold})` : `linear-gradient(90deg,${catColors[d.cat]},${C.gold})`, borderRadius: 2 }} />
          </div>
          {d.status === "manifested" && (
            <div style={{ fontSize: 11, color: C.green, marginTop: 4 }}>✦ Manifested in {d.days} days · linked to audio</div>
          )}
        </div>
      ))}
      <div style={{ padding: "10px 20px", textAlign: "center", fontSize: 12, color: C.muted, borderTop: `1px solid ${C.border}` }}>
        Manifestation rate: 50% · avg 11 days · Goddess Tier exclusive
      </div>
    </div>
  );
}

// Audio library mockup
function AudioLibraryMockup() {
  const tracks = [
    { title: "He's already on his way back", cat: "Lovemaxxing", color: C.rose, playing: true },
    { title: "Money is obsessed with me", cat: "Moneymaxxing", color: "#b87a20", playing: false },
    { title: "Gorgeous is my default setting", cat: "Beautymaxxing", color: C.gold, playing: false },
    { title: "I wake up as her", cat: "Sleep Shifting", color: "#5a7ab0", playing: false },
  ];
  return (
    <div style={{ background: "#060400", border: `1px solid ${C.gold}44`, borderRadius: 20, overflow: "hidden" }}>
      <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, background: "#080600" }}>
        <div style={{ fontSize: 11, color: C.muted, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 2 }}>Self Hypnosis Goddess</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.gold }}>Audio Library · 50+ tracks</div>
      </div>
      {tracks.map((t, i) => (
        <div key={i} style={{ padding: "12px 18px", borderBottom: i < tracks.length - 1 ? `1px solid ${C.border2}` : "none", display: "flex", alignItems: "center", gap: 12, background: t.playing ? "#0d0a00" : "none" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: t.playing ? t.color + "22" : "#080600", border: `1.5px solid ${t.playing ? t.color : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14 }}>
            {t.playing ? <div className="sw" style={{ display: "flex", alignItems: "center", gap: 2, height: 20 }}><span style={{ height: 8 }} /><span style={{ height: 16 }} /><span style={{ height: 12 }} /><span style={{ height: 18 }} /><span style={{ height: 10 }} /></div> : "▶"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: t.playing ? t.color : C.text2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</div>
            <div style={{ fontSize: 11, color: C.dim, marginTop: 2 }}>{t.cat} · Self hypnosis · 30 min</div>
          </div>
          <span style={{ fontSize: 10, padding: "2px 8px", background: t.color + "22", color: t.color, borderRadius: 10, fontWeight: 700, flexShrink: 0 }}>{t.cat.split(" ")[0]}</span>
        </div>
      ))}
      {/* Player bar */}
      <div style={{ padding: "12px 18px", background: "#0d0a00", borderTop: `1px solid ${C.gold}33` }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.gold, marginBottom: 6 }}>▶ He's already on his way back · Loop on · Sleep timer 60m</div>
        <div style={{ height: 3, background: C.border, borderRadius: 2 }}>
          <div style={{ width: "38%", height: "100%", background: `linear-gradient(90deg,${C.gold},${C.rose})`, borderRadius: 2 }} />
        </div>
      </div>
    </div>
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

function Landing({ onJoin, onProofOS, onDemo }) {
  const [billing, setBilling] = useState("monthly");
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCat, setActiveCat] = useState("love");
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play().catch(() => {}); setPlaying(true); }
  };

  useEffect(() => {
    const a = audioRef.current; if (!a) return;
    const update = () => setProgress((a.currentTime / a.duration) * 100 || 0);
    const end = () => { setPlaying(false); setProgress(0); };
    a.addEventListener("timeupdate", update);
    a.addEventListener("ended", end);
    return () => { a.removeEventListener("timeupdate", update); a.removeEventListener("ended", end); };
  }, []);

  const cats = [
    { id: "love", label: "Lovemaxxing", color: C.rose, tagline: "He's obsessed. Of course he is.",
      tracks: ["He's already on his way back · 432hz · 30 min", "He's obsessed and he knows it · 432hz · 28 min", "No contact — he comes back first · 528hz · 26 min", "I never chase. He always catches up · 432hz · 32 min"] },
    { id: "money", label: "Moneymaxxing", color: "#b87a20", tagline: "Money finds you first. Obviously.",
      tracks: ["Money is obsessed with me · 528hz · 25 min", "Unexpected income · always · 528hz · 22 min", "I receive beyond what I ask · 963hz · 27 min", "Overflow is my baseline · 528hz · 35 min"] },
    { id: "beauty", label: "Beautymaxxing", color: C.gold, tagline: "Gorgeous is your default. Obviously.",
      tracks: ["Gorgeous is my default setting · 432hz · 35 min", "I get prettier every single day · 432hz · 25 min", "The face card is permanently active · 528hz · 24 min", "My face shifted to the highest timeline · 432hz · 40 min"] },
    { id: "life", label: "Lifemaxxing", color: "#9a7a5a", tagline: "Highest timeline. Activated.",
      tracks: ["I've always been the prize · LOA · 30 min", "Reality rearranges for me · 963hz · 33 min", "I said so therefore it is · 528hz · 32 min", "Shifting into my highest self · 432hz · 28 min"] },
    { id: "dna", label: "DNA Shifting", color: "#8a6ad0", tagline: "Your bloodline remembers who you are.",
      tracks: ["DNA activation ceremony · 963hz · 45 min", "I override what I inherited · 963hz · 40 min", "Cellular regeneration · 963hz · 38 min", "Ancient codes unlocked · 963hz · 44 min"] },
    { id: "sleep", label: "Sleep Shifting", color: "#5a7ab0", tagline: "You shift while you sleep. Wake up as her.",
      tracks: ["I manifest while I sleep · Delta · 60 min", "I wake up as her · Theta · 55 min", "Overnight identity shift · Delta · 8 hrs", "The 180 installs silently while you dream · 8 hrs"] },
  ];
  const cat = cats.find(c => c.id === activeCat);

  return (
    <div style={{ background: C.black, minHeight: "100vh" }}>
      <audio ref={audioRef} src={FREE_TRACK_URL} preload="none" />

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 300, height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", background: "rgba(0,0,0,0.96)", borderBottom: `1px solid ${C.border}`, backdropFilter: "blur(20px)" }}>
        <button onClick={() => window.scrollTo(0, 0)} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <span className="wm" style={{ fontSize: 19, background: `linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Self Hypnosis Goddess</span>
        </button>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={onProofOS} className="hide-mob" style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 14px", color: C.muted, fontSize: 13, cursor: "pointer" }}>ProofOS ✦</button>
          <Btn small onClick={() => onJoin("audio")}>Join now</Btn>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 10px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 4 }}>
            {[0, 1, 2].map(i => <div key={i} style={{ width: 18, height: 1.5, background: C.muted }} />)}
          </button>
        </div>
        {menuOpen && (
          <div style={{ position: "absolute", top: 58, right: 20, background: "#0a0800", border: `1px solid ${C.border}`, borderRadius: 14, padding: 12, minWidth: 200, zIndex: 400 }}>
            {[["Audio Library", () => setMenuOpen(false)], ["ProofOS ✦", () => { setMenuOpen(false); onProofOS(); }], ["Preview Dashboard", () => { setMenuOpen(false); onDemo(); }], ["YouTube ↗", () => window.open("https://www.youtube.com/@Reshma.Oracle", "_blank")], ["Instagram ↗", () => window.open("https://www.instagram.com/reshma.oracle/", "_blank")]].map(([l, fn], i) => (
              <button key={i} onClick={fn} style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 14px", background: "none", border: "none", color: C.text2, fontSize: 14, cursor: "pointer", borderRadius: 8 }}
                onMouseEnter={e => e.currentTarget.style.background = C.dim}
                onMouseLeave={e => e.currentTarget.style.background = "none"}>{l}</button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <div style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 58, overflow: "hidden" }}>
        <Rings count={5} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "60px 20px 80px", maxWidth: 720, margin: "0 auto", width: "100%" }}>

          {/* Soundwave visual */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, height: 56, marginBottom: 28 }}>
            {Array.from({ length: 20 }).map((_, i) => {
              const h = [8, 18, 30, 22, 38, 26, 42, 20, 34, 16, 40, 24, 36, 28, 18, 42, 22, 32, 14, 26][i];
              return <div key={i} style={{ width: 3, borderRadius: 2, height: h, background: `linear-gradient(180deg,${C.gold},${C.rose})`, animation: `sw ${0.8 + (i % 5) * 0.15}s ease-in-out infinite`, animationDelay: `${i * 0.06}s`, opacity: 0.7 + (i % 3) * 0.1 }} />;
            })}
          </div>

          <div style={{ fontSize: 11, letterSpacing: "0.35em", textTransform: "uppercase", color: C.muted, marginBottom: 20, fontWeight: 600 }}>Reshma Oracle · Self Hypnosis Goddess</div>

          {/* PAIN POINT HERO */}
          <h1 className="wm" style={{ fontSize: "clamp(36px,7vw,64px)", lineHeight: 1.1, marginBottom: 20, color: C.text }}>
            You've tried everything.<br />
            <span style={{ background: `linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Nothing worked.</span><br />
            Because you were trying to change<br />your reality without changing<br />your identity first.
          </h1>

          <p style={{ fontSize: "clamp(16px,2.5vw,20px)", color: "#8a7a5a", lineHeight: 1.85, marginBottom: 10, maxWidth: 560, margin: "0 auto 10px" }}>
            Press play. Wake up with the certainty, clarity and knowing that what you want is already done. Not wishful thinking — a new identity. A new set of actions. A new reality.
          </p>
          <p style={{ fontSize: 15, color: C.muted, marginBottom: 36 }}>Self hypnosis and subliminal audio tracks. Not on YouTube. No ads. Real voice.</p>

          {/* FREE TRACK */}
          <div style={{ background: "#0a0800", border: `1px solid ${C.gold}55`, borderRadius: 18, padding: "22px 24px", maxWidth: 440, margin: "0 auto 36px", boxShadow: `0 0 40px ${C.gold}11` }}>
            <div style={{ fontSize: 10, color: C.gold, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Free track — listen now 🎧</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text2, marginBottom: 3 }}>10 Years of Delay Into One Hour</div>
            <div style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>EMDR · Self hypnosis · Subconscious reprogramming</div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button onClick={togglePlay} className={playing ? "pulse" : ""} style={{ width: 50, height: 50, borderRadius: "50%", background: `linear-gradient(135deg,${C.gold},${C.rose})`, border: "none", color: "#000", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {playing ? "⏸" : "▶"}
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ height: 4, background: C.border, borderRadius: 2, marginBottom: 6, cursor: "pointer" }}
                  onClick={e => { const r = e.currentTarget.getBoundingClientRect(); if (audioRef.current?.duration) audioRef.current.currentTime = ((e.clientX - r.left) / r.width) * audioRef.current.duration; }}>
                  <div style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg,${C.gold},${C.rose})`, borderRadius: 2 }} />
                </div>
                <div style={{ fontSize: 11, color: C.dim }}>{playing ? "Playing — plays in background like Spotify ✦" : "Free — no sign up needed"}</div>
              </div>
              {playing && <div className="sw" style={{ display: "flex", alignItems: "center", gap: 2 }}><span /><span /><span /><span /><span /><span /><span /></div>}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
            <Btn onClick={() => onJoin("audio")}>Start your shift — €19.99/month</Btn>
            <Btn outline onClick={onDemo}>See the dashboard</Btn>
          </div>
          <div style={{ fontSize: 13, color: C.dim }}>Cancel anytime · Stripe · No download · Plays in background like Spotify</div>
        </div>
      </div>

      {/* THE IDENTITY SHIFT — what this actually does */}
      <div style={{ padding: "80px 20px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: C.muted, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 12 }}>How this actually works</div>
          <h2 className="wm" style={{ fontSize: "clamp(28px,5vw,52px)", color: C.text, lineHeight: 1.2, marginBottom: 16 }}>
            Desire is not manifestation.<br />
            <span style={{ background: `linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Certainty is.</span>
          </h2>
          <p style={{ fontSize: 17, color: "#8a7a5a", lineHeight: 1.85, maxWidth: 620, margin: "0 auto" }}>
            The version of you that already has what she wants doesn't obsess, wait, or beg. She moves differently. Thinks differently. Acts from a completely different identity — and that identity creates a completely different reality. These audios install that identity while you sleep.
          </p>
        </div>

        {/* Identity shift diagram */}
        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, marginBottom: 48 }}>
          {/* Old identity */}
          <div style={{ background: "#0a0505", border: `1px solid #2a1010`, borderRadius: "16px 0 0 16px", padding: 28 }}>
            <div style={{ fontSize: 12, color: "#6a3535", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>The old identity</div>
            <div className="wm" style={{ fontSize: 22, color: "#7a5050", marginBottom: 20 }}>The one that keeps attracting the same reality</div>
            {[
              "Checking his profile 12 times a day",
              "Manifesting from desperation and lack",
              "Picking your face apart every morning",
              "Scripting and seeing nothing change",
              "Taking actions from fear and scarcity",
              "Doubting everything the moment it doesn't arrive instantly",
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
                <span style={{ color: "#5a2525", fontSize: 14, flexShrink: 0 }}>✗</span>
                <span style={{ fontSize: 15, color: "#6a4a4a", lineHeight: 1.55 }}>{t}</span>
              </div>
            ))}
          </div>
          {/* New identity */}
          <div style={{ background: "#080a08", border: `1px solid ${C.gold}33`, borderRadius: "0 16px 16px 0", padding: 28 }}>
            <div style={{ fontSize: 12, color: C.gold, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>The new identity</div>
            <div className="wm" style={{ fontSize: 22, color: C.text2, marginBottom: 20 }}>The one that creates a completely different reality</div>
            {[
              "Wake up with knowing. Not hope. Knowing.",
              "Moving from certainty — it's already done",
              "Seeing yourself the way others see you after",
              "Taking actions your highest self naturally takes",
              "Guided by intuition — not desperation",
              "Every sign confirms what you already know is true",
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
                <span style={{ color: C.gold, fontSize: 14, flexShrink: 0 }}>✦</span>
                <span style={{ fontSize: 15, color: C.text2, lineHeight: 1.55 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4-step flow */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h3 className="wm" style={{ fontSize: "clamp(24px,4vw,40px)", color: C.text, marginBottom: 8 }}>Four steps. One reality shift.</h3>
          <p style={{ fontSize: 16, color: C.muted }}>Your only job is to press play.</p>
        </div>
        <div className="step-flow" style={{ display: "flex", gap: 0 }}>
          {[
            { n: "01", icon: "🎧", title: "You listen", body: "Self hypnosis and subliminal audio. Headphones in. Press play. Works while you sleep, rest, exist." },
            { n: "02", icon: "◈", title: "Identity installs", body: "The old programming dissolves. The new identity installs. Not through effort — through repetition at depth." },
            { n: "03", icon: "✦", title: "Reality responds", body: "He texts. Money arrives. Strangers compliment your skin. You're taking different actions from a different identity." },
            { n: "04", icon: "◉", title: "You document the proof", body: "Log every sign in ProofOS. Link it to your audio. Watch the pattern become undeniable. It is done." },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", flex: 1 }}>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, flex: 1, padding: 22, borderLeft: i > 0 ? "none" : undefined, borderTopLeftRadius: i === 0 ? 16 : 0, borderBottomLeftRadius: i === 0 ? 16 : 0, borderTopRightRadius: i === 3 ? 16 : 0, borderBottomRightRadius: i === 3 ? 16 : 0, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${C.gold}${['88', '66', '44', '22'][i]},transparent)` }} />
                <div style={{ fontSize: 11, color: C.muted, fontFamily: "monospace", fontWeight: 700, marginBottom: 10, letterSpacing: "0.1em" }}>{s.n}</div>
                <div style={{ fontSize: 26, marginBottom: 10 }}>{s.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.gold, marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>{s.body}</div>
              </div>
              {i < 3 && <div style={{ display: "flex", alignItems: "center", color: C.gold + "55", fontSize: 18, padding: "0 4px", flexShrink: 0 }}>→</div>}
            </div>
          ))}
        </div>
      </div>

      {/* RESULTS — before/after CSS mockups */}
      <div style={{ padding: "0 20px 80px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: C.muted, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 12 }}>The results</div>
          <h2 className="wm" style={{ fontSize: "clamp(28px,5vw,52px)", color: C.text, marginBottom: 10 }}>What shifts when your identity shifts.</h2>
          <p style={{ fontSize: 16, color: C.muted }}>Not motivation. Not affirmations. Subconscious identity reprogramming.</p>
        </div>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {/* SP */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, background: "#0d0508" }}>
              <div style={{ fontSize: 12, color: C.rose, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Lovemaxxing</div>
              <div style={{ fontSize: 13, color: C.muted }}>He's obsessed. Of course.</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <div style={{ padding: 14, borderRight: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 10, color: "#5a3535", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>Before</div>
                <div style={{ background: "#111", borderRadius: 10, padding: 10 }}>
                  <div style={{ fontSize: 10, color: "#3a3a3a", marginBottom: 8 }}>iMessage · 8 days</div>
                  {["Hey are you there?", "Can we talk?", "Please respond"].map((m, i) => (
                    <div key={i} style={{ background: "#1a1a1a", borderRadius: 8, padding: "5px 8px", marginBottom: 4 }}>
                      <div style={{ color: "#555", fontSize: 11 }}>{m}</div>
                      <div style={{ color: "#2a2a2a", fontSize: 9, textAlign: "right", marginTop: 1 }}>✓</div>
                    </div>
                  ))}
                  <div style={{ color: "#2a2a2a", fontSize: 10, textAlign: "center", marginTop: 6 }}>No reply</div>
                </div>
                <div style={{ fontSize: 12, color: "#5a4040", marginTop: 8, fontStyle: "italic", lineHeight: 1.5 }}>Desperate. Waiting. Checking.</div>
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ fontSize: 10, color: C.gold, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>After</div>
                <div style={{ background: "#080f0a", borderRadius: 10, padding: 10, border: `1px solid #1a3a1a` }}>
                  <div style={{ fontSize: 10, color: "#3a5a3a", marginBottom: 8 }}>iMessage · Today</div>
                  <div style={{ background: "#0f2a0f", borderRadius: 8, padding: "7px 9px", marginBottom: 4, border: `1px solid #1a3a1a` }}>
                    <div style={{ color: "#7ab07a", fontSize: 12 }}>I miss you. Been thinking about you constantly.</div>
                    <div style={{ color: "#2a4a2a", fontSize: 9, marginTop: 3 }}>✓✓ Read</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: C.text2, marginTop: 8, fontStyle: "italic", lineHeight: 1.5 }}>You had already stopped waiting.</div>
              </div>
            </div>
          </div>
          {/* Money */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, background: "#090d08" }}>
              <div style={{ fontSize: 12, color: "#b87a20", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Moneymaxxing</div>
              <div style={{ fontSize: 13, color: C.muted }}>Money finds you first.</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <div style={{ padding: 14, borderRight: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 10, color: "#5a3535", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>Before</div>
                <div style={{ background: "#111", borderRadius: 10, padding: 10 }}>
                  <div style={{ fontSize: 10, color: "#3a3a3a", marginBottom: 6 }}>Bank account</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#4a4a4a", marginBottom: 8 }}>€247.83</div>
                  {[["Rent", "−€900"], ["Bills", "−€180"]].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#3a3a3a", marginBottom: 3 }}>
                      <span>{k}</span><span style={{ color: "#5a2a2a" }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: "#5a4040", marginTop: 8, fontStyle: "italic" }}>Counting what's left.</div>
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ fontSize: 10, color: C.gold, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>After</div>
                <div style={{ background: "#080f08", borderRadius: 10, padding: 10, border: `1px solid #1a3a1a` }}>
                  <div style={{ fontSize: 10, color: "#4a8a4a", marginBottom: 6 }}>New transfer</div>
                  <div style={{ background: "#0a1f0a", borderRadius: 8, padding: "8px 10px", border: `1px solid #2a4a2a` }}>
                    <div style={{ fontSize: 10, color: "#4a8a4a" }}>✓ Payment received</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: "#6ab06a" }}>€10,000</div>
                    <div style={{ fontSize: 10, color: "#2a4a2a" }}>Unexpected. Exactly as asked.</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: C.text2, marginTop: 8, fontStyle: "italic" }}>Of course it did.</div>
              </div>
            </div>
          </div>
          {/* Beauty */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, background: "#0d0c08" }}>
              <div style={{ fontSize: 12, color: C.gold, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Beautymaxxing</div>
              <div style={{ fontSize: 13, color: C.muted }}>Gorgeous is your default.</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <div style={{ padding: 14, borderRight: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 10, color: "#5a3535", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>Before</div>
                <div style={{ background: "#111", borderRadius: 10, padding: 12, textAlign: "center" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#1a1a1a", margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, filter: "grayscale(1) opacity(0.3)" }}>🪞</div>
                  <div style={{ fontSize: 11, color: "#4a3535", lineHeight: 1.5 }}>Picking apart every detail. The same loop. Every morning.</div>
                </div>
                <div style={{ fontSize: 12, color: "#5a4040", marginTop: 8, fontStyle: "italic" }}>Never enough.</div>
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ fontSize: 10, color: C.gold, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>After</div>
                <div style={{ background: "#0a0900", borderRadius: 10, padding: 10, border: `1px solid ${C.dim}` }}>
                  {[{ from: "Sarah", msg: "What are you doing differently?? You're GLOWING" }, { from: "Mia", msg: "Your skin is actually shifting omg" }].map((m, i) => (
                    <div key={i} style={{ background: "#140f02", borderRadius: 8, padding: "6px 8px", marginBottom: 4, border: `1px solid ${C.dim}` }}>
                      <div style={{ fontSize: 9, color: C.muted, marginBottom: 2 }}>{m.from}</div>
                      <div style={{ fontSize: 11, color: C.text2 }}>{m.msg}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: C.text2, marginTop: 8, fontStyle: "italic" }}>They notice before you do.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* APP DASHBOARD PREVIEW */}
      <div style={{ padding: "0 20px 80px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: C.muted, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 12 }}>The app</div>
          <h2 className="wm" style={{ fontSize: "clamp(28px,5vw,52px)", color: C.text, marginBottom: 10 }}>Your portal. Your library. Your proof.</h2>
          <p style={{ fontSize: 16, color: C.muted }}>Everything in one place. Plays in background like Spotify. No download needed.</p>
        </div>
        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: C.gold, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Audio Library — Audio Tier</div>
            <AudioLibraryMockup />
          </div>
          <div>
            <div style={{ fontSize: 12, color: C.rose, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>ProofOS Tracker — Goddess Tier ✦</div>
            <DashboardMockup />
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Btn onClick={onDemo}>Preview the full dashboard →</Btn>
        </div>
      </div>

      {/* AUDIO LIBRARY */}
      <div style={{ padding: "0 20px 80px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 11, color: C.muted, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 12 }}>The vault</div>
          <h2 className="wm" style={{ fontSize: "clamp(28px,5vw,52px)", color: C.text, marginBottom: 10 }}>Every desire has its own track.</h2>
          <p style={{ fontSize: 16, color: C.muted }}>50+ tracks. 4 new every week. Never on YouTube. Never interrupted.</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 20 }}>
          {cats.map(c => (
            <button key={c.id} onClick={() => setActiveCat(c.id)} style={{ padding: "8px 18px", borderRadius: 24, border: `1.5px solid ${activeCat === c.id ? c.color : C.border}`, background: activeCat === c.id ? c.color + "22" : "none", color: activeCat === c.id ? c.color : C.muted, fontSize: 14, fontWeight: 700, cursor: "pointer", minHeight: 40, transition: "all 0.2s" }}>{c.label}</button>
          ))}
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 12, color: cat.color, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>{cat.label}</div>
            <div className="wm" style={{ fontSize: 22, color: C.text }}>{cat.tagline}</div>
          </div>
          {cat.tracks.map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderBottom: i < cat.tracks.length - 1 ? `1px solid ${C.border2}` : "none" }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: i === 0 ? cat.color + "22" : "#080600", border: `1.5px solid ${i === 0 ? cat.color : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
                {i === 0 ? "▶" : "🔒"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: i === 0 ? cat.color : C.text2 }}>{t}</div>
              </div>
              {i === 0 && <span style={{ fontSize: 12, padding: "3px 10px", background: cat.color + "22", color: cat.color, borderRadius: 12, fontWeight: 700 }}>FREE</span>}
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 14, fontSize: 14, color: C.muted }}>First track in every category is free · Full library from €19.99/month</div>
      </div>

      {/* PROOFOS TEASER */}
      <div style={{ padding: "0 20px 80px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ position: "relative", background: "linear-gradient(135deg,#0a0700,#12080a)", border: `2px solid ${C.gold}44`, borderRadius: 20, padding: 36, overflow: "hidden", cursor: "pointer" }} onClick={onProofOS}>
          <Rings count={3} color={C.rose} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className="grid-2">
              <div>
                <div style={{ fontSize: 11, color: C.rose, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14 }}>Goddess Tier · Coming soon</div>
                <div className="wm" style={{ fontSize: "clamp(36px,6vw,60px)", lineHeight: 0.95, marginBottom: 10, background: `linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ProofOS ✦</div>
                <div style={{ fontSize: 14, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>The manifestation ledger</div>
                <p style={{ fontSize: 16, color: "#8a7a5a", lineHeight: 1.85, marginBottom: 20 }}>Log your desire. Link it to your audio. Capture every sign. Watch the evidence build into something undeniable. See exactly how many days it took.</p>
                <span style={{ fontSize: 15, color: C.gold, fontWeight: 700 }}>Find out more →</span>
              </div>
              <div>
                <DashboardMockup mini />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRICING */}
      <div style={{ padding: "0 20px 80px", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 11, color: C.muted, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 12 }}>Choose your tier</div>
          <h2 className="wm" style={{ fontSize: "clamp(28px,5vw,52px)", color: C.text, marginBottom: 10 }}>Full access. No ads. Ever.</h2>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 4, display: "flex", gap: 4 }}>
            {["monthly", "annual"].map(b => (
              <button key={b} onClick={() => setBilling(b)} style={{ padding: "9px 20px", borderRadius: 9, background: billing === b ? `linear-gradient(90deg,${C.gold},${C.rose})` : "transparent", border: "none", color: billing === b ? "#000" : C.muted, fontSize: 14, fontWeight: 700, cursor: "pointer", minHeight: 40 }}>
                {b === "annual" ? "Annual — save 20%" : "Monthly"}
              </button>
            ))}
          </div>
        </div>
        <div className="price-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          {[
            { id: "audio", name: "Audio Tier", price: billing === "monthly" ? "€19.99" : "€192", period: billing === "monthly" ? "/month" : "/year", sub: billing === "annual" ? "€16/mo · 2 months free" : null, features: ["Full self hypnosis audio library — 50+ tracks", "All 6 desire categories", "Lovemaxxing · Moneymaxxing · Beautymaxxing", "4 new tracks every week — never on YouTube", "Loop player + sleep timer", "Plays in background when screen is locked", "No ads. Ever."], cta: "Join Audio Tier" },
            { id: "goddess", name: "Goddess Tier", popular: true, price: billing === "monthly" ? "€33" : "€317", period: billing === "monthly" ? "/month" : "/year", sub: billing === "annual" ? "€26.40/mo · 2 months free" : null, features: ["Everything in Audio Tier", "ProofOS manifestation tracker ✦ coming soon", "Log desires · link to audio · capture proof", "Watch your wins build into undeniable evidence", "Early access — 48hrs before everyone else", "Monthly ritual audio included"], proofos: true, cta: "Become Goddess" },
          ].map(p => (
            <div key={p.id} style={{ background: C.card, border: `${p.popular ? "2px" : "1px"} solid ${p.popular ? C.gold + "66" : C.border}`, borderRadius: 18, padding: 26, position: "relative" }}>
              {p.popular && <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: `linear-gradient(90deg,${C.gold},${C.rose})`, color: "#000", fontSize: 11, fontWeight: 800, padding: "3px 18px", borderRadius: 20, whiteSpace: "nowrap", letterSpacing: "0.1em" }}>MOST POPULAR</div>}
              <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 4 }}>{p.name}</div>
              {p.sub && <div style={{ fontSize: 13, color: C.muted, marginBottom: 8 }}>{p.sub}</div>}
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}>
                <span style={{ fontSize: 44, fontWeight: 800, color: p.popular ? C.rose : C.gold, lineHeight: 1 }}>{p.price}</span>
                <span style={{ fontSize: 14, color: C.muted }}>{p.period}</span>
              </div>
              {p.features.map((f, i) => (
                <div key={i} style={{ fontSize: 14, color: f.includes("✦") ? C.gold : "#8a7050", marginBottom: 8, paddingLeft: 16, position: "relative", lineHeight: 1.55 }}>
                  <span style={{ position: "absolute", left: 0, color: C.gold, fontWeight: 700 }}>·</span>{f}
                </div>
              ))}
              {p.proofos && <button onClick={onProofOS} style={{ background: "none", border: "none", color: C.rose, fontSize: 13, cursor: "pointer", padding: "6px 0", textDecoration: "underline", display: "block", marginTop: 4 }}>Find out more about ProofOS →</button>}
              <div style={{ marginTop: 20 }}><Btn full outline={!p.popular} onClick={() => onJoin(p.id)}>{p.cta}</Btn></div>
            </div>
          ))}
        </div>
        <div style={{ background: "linear-gradient(135deg,#0d0900,#160b01)", border: `2px solid ${C.gold}44`, borderRadius: 18, padding: 30 }}>
          <div style={{ fontSize: 11, color: C.gold, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>First 1,000 only · Lifetime access</div>
          <div className="wm" style={{ fontSize: "clamp(22px,4vw,34px)", color: C.text, marginBottom: 8 }}>Founder Lifetime</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 14 }}>
            <span style={{ fontSize: 48, fontWeight: 800, color: C.gold }}>€500</span>
            <span style={{ fontSize: 15, color: C.muted }}>once · never pay again</span>
          </div>
          <p style={{ fontSize: 15, color: "#7a6a4a", lineHeight: 1.75, marginBottom: 20, maxWidth: 560 }}>Full vault + ProofOS + every future feature + 1 GB evidence vault — forever. No subscription. The €500 price closes once the first 1,000 Founders join.</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
            {["Full vault for life", "ProofOS for life", "1 GB evidence vault", "All future features", "Founder's seal ✦"].map((f, i) => (
              <span key={i} style={{ padding: "5px 14px", background: C.gold + "18", border: `1px solid ${C.gold}33`, borderRadius: 20, fontSize: 13, color: C.gold, fontWeight: 600 }}>{f}</span>
            ))}
          </div>
          <Btn onClick={() => onJoin("founder")}>Claim lifetime access — €500</Btn>
        </div>
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: C.dim, lineHeight: 1.9 }}>No refunds after 14 days · Cancel before renewal · Web app · iPhone: Add to Home Screen</div>
      </div>

      {/* FINAL CTA */}
      <div style={{ position: "relative", padding: "80px 20px", textAlign: "center", overflow: "hidden", borderTop: `1px solid ${C.border}` }}>
        <Rings count={4} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="wm" style={{ fontSize: "clamp(28px,5vw,52px)", color: C.text, lineHeight: 1.2, marginBottom: 20 }}>
            Wake up knowing.<br />
            <span style={{ background: `linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Not hoping. Knowing.</span>
          </div>
          <Btn onClick={() => onJoin("audio")}>Start your shift — €19.99/month</Btn>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: "32px 20px", textAlign: "center" }}>
        <div className="wm" style={{ fontSize: 20, display: "block", marginBottom: 14, background: `linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Self Hypnosis Goddess</div>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", marginBottom: 16 }}>
          {[["YouTube", "https://www.youtube.com/@Reshma.Oracle"], ["Instagram", "https://www.instagram.com/reshma.oracle/"]].map(([l, u]) => (
            <a key={l} href={u} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: C.muted, textDecoration: "none" }}>{l} →</a>
          ))}
        </div>
        <div style={{ fontSize: 12, color: C.dim }}>© 2026 Reshma Oracle · All rights reserved</div>
      </div>
    </div>
  );
}

// ProofOS, Onboard, Portal components unchanged from previous version
function ProofOSPage({ onBack, onJoin }) {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  return (
    <div style={{ minHeight: "100vh", background: C.black }} className="fade">
      <nav style={{ position: "sticky", top: 0, zIndex: 100, padding: "0 20px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,0,0.96)", borderBottom: `1px solid ${C.border}` }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: C.muted, fontSize: 15, cursor: "pointer" }}>← Back</button>
        <span className="wm" style={{ fontSize: 17, background: `linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Self Hypnosis Goddess</span>
        <div style={{ width: 60 }} />
      </nav>
      <div style={{ position: "relative", padding: "72px 20px 56px", textAlign: "center", overflow: "hidden" }}>
        <Rings count={4} color={C.rose} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 620, margin: "0 auto" }}>
          <div style={{ fontSize: 11, color: C.rose, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 16 }}>Goddess Tier Exclusive · Coming Soon</div>
          <div className="wm" style={{ fontSize: "clamp(56px,12vw,96px)", lineHeight: 0.9, marginBottom: 14, background: `linear-gradient(135deg,${C.gold},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ProofOS</div>
          <div style={{ fontSize: 14, color: C.muted, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 24 }}>The manifestation ledger</div>
          <div style={{ fontSize: "clamp(18px,3vw,24px)", fontWeight: 700, color: C.text, lineHeight: 1.5, marginBottom: 14 }}>You've been manifesting.<br />Now watch it prove itself.</div>
          <p style={{ fontSize: 16, color: "#8a7a5a", lineHeight: 1.85, marginBottom: 36 }}>Log your desire. Link it to the exact audio. Capture every sign. Watch the evidence build into something undeniable. See exactly how many days it took.</p>
          {!joined ? (
            <div style={{ maxWidth: 380, margin: "0 auto" }}>
              <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email" />
                <Btn onClick={() => { if (email.includes("@")) setJoined(true); }}>Join waitlist</Btn>
              </div>
              <div style={{ fontSize: 13, color: C.dim }}>Goddess Tier members get first access</div>
            </div>
          ) : (
            <div style={{ padding: "16px 24px", background: "#0a1a0a", border: `1px solid #2a4a2a`, borderRadius: 12, maxWidth: 380, margin: "0 auto", fontSize: 15, color: C.green, fontWeight: 600 }}>✓ You're on the list.</div>
          )}
        </div>
      </div>
      <div style={{ padding: "0 20px 60px", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: "clamp(22px,4vw,36px)", fontWeight: 700, color: C.text, marginBottom: 36 }}>How ProofOS works</h2>
        <div className="step-flow" style={{ display: "flex", gap: 0 }}>
          {[{ n: "01", icon: "✦", t: "Set your intention", b: "State exactly what you want. Present tense. This becomes your active proof thread." }, { n: "02", icon: "🎧", t: "Listen with purpose", b: "Every track links automatically to your active threads. Every session dated and recorded." }, { n: "03", icon: "◈", t: "Capture the proof", b: "Signs, synchronicities, results. Screenshot. Voice note. Log them as they arrive." }, { n: "04", icon: "✓", t: "Mark it manifested", b: "When it arrives — mark it. Days from first listen to final proof. It is done." }].map((s, i) => (
            <div key={i} style={{ display: "flex", flex: 1 }}>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, flex: 1, padding: 22, borderLeft: i > 0 ? "none" : undefined, borderRadius: i === 0 ? "14px 0 0 14px" : i === 3 ? "0 14px 14px 0" : 0 }}>
                <div style={{ fontSize: 11, color: C.muted, fontFamily: "monospace", fontWeight: 700, marginBottom: 10 }}>{s.n}</div>
                <div style={{ fontSize: 24, color: C.gold, marginBottom: 10 }}>{s.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 8 }}>{s.t}</div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{s.b}</div>
              </div>
              {i < 3 && <div style={{ display: "flex", alignItems: "center", color: C.gold + "55", fontSize: 16, padding: "0 3px", flexShrink: 0 }}>→</div>}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 40 }}><DashboardMockup /></div>
      </div>
      <div style={{ padding: "0 20px 80px", textAlign: "center", maxWidth: 500, margin: "0 auto" }}>
        <div className="wm" style={{ fontSize: "clamp(22px,4vw,36px)", color: C.text, marginBottom: 14 }}>Ready to begin?</div>
        <p style={{ fontSize: 16, color: C.muted, marginBottom: 28, lineHeight: 1.75 }}>ProofOS is included in the Goddess Tier. Start with the audio library now.</p>
        <Btn full onClick={() => onJoin("goddess")}>Join Goddess Tier — €33/month</Btn>
      </div>
    </div>
  );
}

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
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: n <= step ? `linear-gradient(135deg,${C.gold},${C.rose})` : C.card, border: `1.5px solid ${n <= step ? C.gold : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: n <= step ? "#000" : C.muted }}>{n < step ? "✓" : n}</div>
              {n < 3 && <div style={{ width: 48, height: "1px", background: n < step ? C.gold : C.border }} />}
            </div>
          ))}
        </div>
      )}
      <div style={{ width: "100%", maxWidth: 460 }}>
        {step === 1 && (
          <div className="fade">
            <div className="wm" style={{ fontSize: 24, marginBottom: 6, background: `linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Self Hypnosis Goddess</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 4 }}>Create your account</div>
            <div style={{ fontSize: 15, color: C.muted, marginBottom: 28 }}>Joining: {tierName}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              <input placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input placeholder="Email address" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              <input placeholder="Password (min 8 characters)" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <Btn full onClick={next} disabled={!form.email || form.password.length < 8}>Continue →</Btn>
            <div style={{ textAlign: "center", marginTop: 14, fontSize: 14, color: C.muted }}>Already a member? <span style={{ color: C.gold, cursor: "pointer" }} onClick={onBack}>Sign in</span></div>
          </div>
        )}
        {step === 2 && (
          <div className="fade">
            <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 24 }}>Confirm your plan</div>
            {tier !== "founder" && (
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                {["monthly", "annual"].map(b => (
                  <button key={b} onClick={() => setBilling(b)} style={{ flex: 1, padding: 16, background: billing === b ? C.card2 : C.card, border: `${billing === b ? "2px" : "1px"} solid ${billing === b ? C.gold + "88" : C.border}`, borderRadius: 12, cursor: "pointer", textAlign: "left" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: billing === b ? C.gold : C.text, marginBottom: 2 }}>{b === "monthly" ? "Monthly" : "Annual"}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: billing === b ? C.gold : C.text }}>{tier === "goddess" ? (b === "monthly" ? "€33" : "€317") : (b === "monthly" ? "€19.99" : "€192")}<span style={{ fontSize: 12, color: C.muted }}>/{b === "monthly" ? "mo" : "yr"}</span></div>
                    {b === "annual" && <div style={{ fontSize: 12, color: C.rose, marginTop: 4, fontWeight: 600 }}>Save 20% · 2 months free</div>}
                  </button>
                ))}
              </div>
            )}
            <Btn full onClick={next}>Continue to payment →</Btn>
          </div>
        )}
        {step === 3 && (
          <div className="fade">
            <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 24 }}>Secure checkout</div>
            <div style={{ background: C.card, border: `1.5px solid ${C.gold}55`, borderRadius: 12, padding: 18, marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>{tierName}</div>
                <div style={{ fontSize: 13, color: C.muted }}>{tier === "founder" ? "One-time" : `Billed ${billing}`}</div>
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: C.gold }}>{price}</div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, marginBottom: 16, fontSize: 14, color: "#6a5a3a", lineHeight: 1.75 }}>
              Stripe secure checkout · SSL encrypted · No card data stored<br />No refunds after 14 days
            </div>
            <Btn full onClick={next} disabled={loading}>{loading ? "Processing..." : "Pay with Stripe →"}</Btn>
          </div>
        )}
        {step === 4 && (
          <div style={{ textAlign: "center" }} className="fade">
            <div style={{ fontSize: 60, marginBottom: 20 }}>✦</div>
            <div className="wm" style={{ fontSize: 42, marginBottom: 10, background: `linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Welcome.</div>
            <div style={{ fontSize: 16, color: C.muted, marginBottom: 36, lineHeight: 1.8 }}>Your portal is ready. Wake up knowing. Not hoping. Knowing.</div>
            <Btn full onClick={next}>Enter the portal →</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

function Portal({ userTier, onSignOut, onUpgrade }) {
  const [tab, setTab] = useState("audios");
  const [playing, setPlaying] = useState(null);
  const [activeCat, setActiveCat] = useState("all");
  const [loop, setLoop] = useState(true);
  const [sleep, setSleep] = useState(60);
  const [progress, setProgress] = useState(38);
  const [search, setSearch] = useState("");
  const [desires, setDesires] = useState([
    { id: 1, desire: "He texts me first", status: "manifested", track: "He's already on his way back", trackCat: "love", days: 14, signs: ["Got a like on Instagram", "Mutual friend mentioned me"] },
    { id: 2, desire: "€5,000 arrives unexpectedly", status: "in_progress", track: "Money is obsessed with me", trackCat: "money", days: 6, signs: ["Found €20 in old jacket"] },
    { id: 3, desire: "Skin visibly glowing to others", status: "in_progress", track: "Gorgeous is my default setting", trackCat: "beauty", days: 3, signs: [] },
  ]);
  const [newDesire, setNewDesire] = useState("");
  const [newSign, setNewSign] = useState({});
  const [expanded, setExpanded] = useState(null);

  const catColors = { love: C.rose, money: "#b87a20", beauty: C.gold, sleep: "#5a7ab0", dna: "#8a6ad0", identity: "#b07060", life: "#9a7a5a", all: C.gold };
  const tracks = [
    { id: 1, title: "He's already on his way back", cat: "love", tag: "Lovemaxxing", freq: "432hz", type: "Self hypnosis", dur: "30:00", tier: "audio", isNew: true },
    { id: 2, title: "Money is obsessed with me", cat: "money", tag: "Moneymaxxing", freq: "528hz", type: "Subliminal", dur: "25:00", tier: "audio", isNew: true },
    { id: 3, title: "Gorgeous is my default setting", cat: "beauty", tag: "Beautymaxxing", freq: "432hz", type: "Self hypnosis", dur: "35:00", tier: "audio" },
    { id: 4, title: "I've always been the prize", cat: "life", tag: "Lifemaxxing", freq: "LOA", type: "Subliminal", dur: "30:00", tier: "audio" },
    { id: 5, title: "DNA activation ceremony", cat: "dna", tag: "DNA Shifting", freq: "963hz", type: "Frequency", dur: "45:00", tier: "goddess" },
    { id: 6, title: "I manifest while I sleep", cat: "sleep", tag: "Sleep Shifting", freq: "Delta", type: "Sleep subliminal", dur: "60:00", tier: "audio" },
    { id: 7, title: "He's obsessed and he knows it", cat: "love", tag: "Lovemaxxing", freq: "432hz", type: "Subliminal", dur: "28:00", tier: "audio" },
    { id: 8, title: "Reality rearranges for me", cat: "life", tag: "Lifemaxxing", freq: "963hz", type: "Frequency", dur: "33:00", tier: "goddess" },
    { id: 9, title: "I get prettier every single day", cat: "beauty", tag: "Beautymaxxing", freq: "432hz", type: "Self hypnosis", dur: "25:00", tier: "audio", isNew: true },
    { id: 10, title: "Unexpected money · always", cat: "money", tag: "Moneymaxxing", freq: "528hz", type: "Subliminal", dur: "22:00", tier: "audio", isNew: true },
  ];

  const cats = [{ id: "all", label: "All" }, { id: "love", label: "Lovemaxxing" }, { id: "money", label: "Moneymaxxing" }, { id: "beauty", label: "Beautymaxxing" }, { id: "sleep", label: "Sleep" }, { id: "dna", label: "DNA" }, { id: "life", label: "Lifemaxxing" }];
  const canPlay = t => t.tier === "audio" || userTier === "goddess";
  const ct = tracks.find(t => t.id === playing);
  const filtered = tracks.filter(t => (activeCat === "all" || t.cat === activeCat) && (!search || t.title.toLowerCase().includes(search.toLowerCase())));
  const manifested = desires.filter(d => d.status === "manifested").length;
  const inProgress = desires.filter(d => d.status === "in_progress").length;

  const addDesire = () => { if (!newDesire.trim()) return; setDesires([{ id: Date.now(), desire: newDesire, status: "in_progress", track: ct?.title || null, trackCat: ct?.cat || null, days: 0, signs: [] }, ...desires]); setNewDesire(""); };
  const addSign = (id, sign) => { if (!sign.trim()) return; setDesires(desires.map(d => d.id === id ? { ...d, signs: [...d.signs, sign] } : d)); setNewSign(p => ({ ...p, [id]: "" })); };
  const markManifested = id => setDesires(desires.map(d => d.id === id ? { ...d, status: "manifested" } : d));
  const undoManifested = id => setDesires(desires.map(d => d.id === id ? { ...d, status: "in_progress" } : d));
  const signSuggestions = ["Saw a number sequence", "Dreamed about it", "Someone mentioned it", "Found money unexpectedly", "Received a surprise message", "Felt calm certainty", "Overheard a conversation"];
  const tabs = [{ id: "audios", icon: "▶", label: "Audios" }, { id: "tracker", icon: "✦", label: "Tracker" }, { id: "account", icon: "◎", label: "Account" }];

  return (
    <div style={{ minHeight: "100vh", background: C.black }} className="fade">
      <div style={{ borderBottom: `1px solid ${C.border}`, padding: "0 16px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#030200", position: "sticky", top: 0, zIndex: 50 }}>
        <button onClick={onSignOut} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <span className="wm" style={{ fontSize: 17, background: `linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Self Hypnosis Goddess</span>
        </button>
        {userTier === "goddess" ? <div style={{ padding: "4px 12px", background: "#1a0a04", border: `1px solid ${C.gold}44`, borderRadius: 20, fontSize: 12, color: C.gold, fontWeight: 700 }}>Goddess ✦</div>
          : <button onClick={onUpgrade} style={{ padding: "4px 12px", background: "none", border: `1px solid ${C.rose}44`, borderRadius: 20, fontSize: 12, color: C.rose, fontWeight: 700, cursor: "pointer" }}>Upgrade ↑</button>}
      </div>
      <div className="desk-tabs" style={{ display: "flex", borderBottom: `1px solid ${C.border}`, background: "#050300", position: "sticky", top: 56, zIndex: 49 }}>
        {tabs.map(t => <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "13px 8px", background: "none", border: "none", borderBottom: `2px solid ${tab === t.id ? C.gold : "transparent"}`, color: tab === t.id ? C.gold : C.muted, fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>{t.label}</button>)}
      </div>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderBottom: `1px solid ${C.border}`, background: "#060400" }}>
        {[{ v: tracks.filter(t => canPlay(t)).length, l: "Tracks", c: C.text2, sub: "in vault" }, { v: desires.length, l: "Intentions", c: C.gold, sub: "set" }, { v: manifested, l: "Manifested", c: C.rose, sub: `${inProgress} active` }, { v: "14d", l: "Streak", c: C.green, sub: "daily" }].map((s, i) => (
          <div key={i} style={{ padding: "12px 8px", textAlign: "center", borderRight: i < 3 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.c, lineHeight: 1, marginBottom: 2 }}>{s.v}</div>
            <div style={{ fontSize: 11, color: C.text2, fontWeight: 600 }}>{s.l}</div>
            <div style={{ fontSize: 10, color: C.muted }}>{s.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", minHeight: "calc(100vh - 140px)" }}>
        {/* Sidebar */}
        <div className="sidebar" style={{ width: 196, borderRight: `1px solid ${C.border}`, background: "#040200", flexShrink: 0, position: "sticky", top: 112, height: "calc(100vh - 112px)", overflowY: "auto", padding: "14px 8px" }}>
          {cats.map(c => (
            <button key={c.id} onClick={() => { setActiveCat(c.id); setTab("audios"); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, border: "none", background: activeCat === c.id && tab === "audios" ? (catColors[c.id] || C.gold) + "18" : "none", cursor: "pointer", marginBottom: 3, textAlign: "left" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: catColors[c.id] || C.gold, flexShrink: 0, opacity: activeCat === c.id && tab === "audios" ? 1 : 0.3 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: activeCat === c.id && tab === "audios" ? catColors[c.id] || C.gold : C.muted }}>{c.label}</span>
            </button>
          ))}
          <div style={{ height: 1, background: C.border, margin: "12px 0" }} />
          {tabs.filter(t => t.id !== "audios").map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, border: "none", background: tab === t.id ? C.gold + "18" : "none", cursor: "pointer", marginBottom: 3 }}>
              <span style={{ fontSize: 15 }}>{t.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: tab === t.id ? C.gold : C.muted }}>{t.label}</span>
            </button>
          ))}
        </div>
        {/* Main */}
        <div className="portal-pb" style={{ flex: 1, padding: "18px 16px 32px", maxWidth: 720, overflowX: "hidden" }}>
          {tab === "audios" && (
            <div className="fade">
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tracks..." style={{ marginBottom: 14 }} />
              <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 16, paddingBottom: 4 }}>
                {cats.map(c => <button key={c.id} onClick={() => setActiveCat(c.id)} style={{ padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${activeCat === c.id ? catColors[c.id] || C.gold : C.border}`, background: activeCat === c.id ? (catColors[c.id] || C.gold) + "18" : "none", color: activeCat === c.id ? catColors[c.id] || C.gold : C.muted, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", minHeight: 36, fontWeight: 600 }}>{c.label}</button>)}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {filtered.map(t => {
                  const isP = playing === t.id, can = canPlay(t), color = catColors[t.cat] || C.gold;
                  return (
                    <div key={t.id} onClick={() => can && setPlaying(isP ? null : t.id)}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", background: isP ? C.card2 : C.card, border: `1px solid ${isP ? color + "66" : C.border}`, borderRadius: 12, cursor: can ? "pointer" : "default", opacity: can ? 1 : 0.4, transition: "all 0.2s" }}
                      onMouseEnter={e => can && !isP && (e.currentTarget.style.borderColor = color + "44")}
                      onMouseLeave={e => can && !isP && (e.currentTarget.style.borderColor = C.border)}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0, opacity: 0.8 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: isP ? color : C.text2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</span>
                          {t.isNew && <span style={{ fontSize: 10, padding: "1px 7px", background: C.rose + "22", color: C.rose, borderRadius: 10, fontWeight: 700, flexShrink: 0 }}>NEW</span>}
                        </div>
                        <div style={{ fontSize: 12, color: C.dim }}>{t.freq} · {t.type}{!can ? " · Goddess only" : ""} · {t.dur}</div>
                      </div>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: isP ? color + "22" : "#080600", border: `1.5px solid ${isP ? color : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {!can ? <span>🔒</span> : isP ? <div className="sw" style={{ display: "flex", alignItems: "center", gap: 2 }}><span style={{ height: 8 }} /><span style={{ height: 16 }} /><span style={{ height: 12 }} /><span style={{ height: 18 }} /><span style={{ height: 10 }} /></div> : <span style={{ fontSize: 13, color: C.muted }}>▶</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {tab === "tracker" && (
            <div className="fade">
              {userTier !== "goddess" ? (
                <div style={{ textAlign: "center", padding: "60px 20px" }}>
                  <div style={{ fontSize: 52, marginBottom: 16 }}>✦</div>
                  <div className="wm" style={{ fontSize: 30, color: C.text, marginBottom: 10 }}>ProofOS</div>
                  <p style={{ fontSize: 16, color: C.muted, marginBottom: 28, lineHeight: 1.75 }}>Log your desires. Link them to your audio. Watch the proof accumulate.</p>
                  <Btn onClick={onUpgrade}>Upgrade to Goddess — €33/month</Btn>
                </div>
              ) : (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
                    {[{ v: manifested, l: "Manifested", c: C.rose, sub: "desires completed" }, { v: inProgress, l: "In progress", c: C.gold, sub: "currently active" }, { v: desires.reduce((a, d) => a + d.signs.length, 0), l: "Signs logged", c: C.green, sub: "synchronicities" }].map((s, i) => (
                      <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
                        <div style={{ fontSize: 28, fontWeight: 800, color: s.c, lineHeight: 1, marginBottom: 4 }}>{s.v}</div>
                        <div style={{ fontSize: 12, color: C.text2, fontWeight: 600, marginBottom: 2 }}>{s.l}</div>
                        <div style={{ fontSize: 10, color: C.muted }}>{s.sub}</div>
                      </div>
                    ))}
                  </div>
                  {/* Rate bar */}
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Manifestation rate</span>
                      <span style={{ fontSize: 13, color: C.gold, fontWeight: 700 }}>{manifested}/{desires.length} · {Math.round((manifested / desires.length) * 100)}%</span>
                    </div>
                    <div style={{ height: 6, background: C.border, borderRadius: 3 }}>
                      <div style={{ width: `${(manifested / desires.length) * 100}%`, height: "100%", background: `linear-gradient(90deg,${C.gold},${C.rose})`, borderRadius: 3, transition: "width 0.6s" }} />
                    </div>
                  </div>
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
                    <div style={{ fontSize: 12, color: C.muted, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Log a new intention</div>
                    <input value={newDesire} onChange={e => setNewDesire(e.target.value)} placeholder="State it in present tense — I am, I have, I receive..." style={{ marginBottom: 10 }} onKeyDown={e => e.key === "Enter" && addDesire()} />
                    {ct && <div style={{ fontSize: 13, color: C.muted, marginBottom: 10 }}>Will link to: <span style={{ color: C.gold, fontWeight: 700 }}>{ct.title}</span></div>}
                    <Btn full small onClick={addDesire} disabled={!newDesire.trim()}>Add intention +</Btn>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {desires.map(d => {
                      const color = catColors[d.trackCat] || C.gold;
                      return (
                        <div key={d.id} style={{ background: C.card, border: `1px solid ${d.status === "manifested" ? "#2a4a2a" : C.border}`, borderRadius: 12, overflow: "hidden" }}>
                          <div style={{ padding: "14px 16px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }} onClick={() => setExpanded(expanded === d.id ? null : d.id)}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 15, fontWeight: 600, color: C.text2, marginBottom: 5 }}>{d.desire}</div>
                              {d.track && <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}><span>🎧</span><span style={{ fontSize: 13, color, fontWeight: 600 }}>{d.track}</span>{d.days > 0 && <span style={{ fontSize: 12, color: C.dim }}>· {d.days}d</span>}</div>}
                              {d.signs.length > 0 && <div style={{ fontSize: 12, color: C.muted }}>✦ {d.signs.length} sign{d.signs.length !== 1 ? "s" : ""}</div>}
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
                              <span style={{ fontSize: 11, color: C.dim }}>{expanded === d.id ? "▲" : "▼"}</span>
                            </div>
                          </div>
                          {expanded === d.id && (
                            <div style={{ borderTop: `1px solid ${C.border2}`, padding: "14px 16px", background: "#060400" }}>
                              {d.signs.map((s, i) => <div key={i} style={{ fontSize: 14, color: C.muted, paddingLeft: 14, position: "relative", marginBottom: 7 }}><span style={{ position: "absolute", left: 0, color: C.gold }}>·</span>{s}</div>)}
                              {d.status !== "manifested" && (
                                <div style={{ marginTop: 10 }}>
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                                    {signSuggestions.slice(0, 4).map((s, i) => <button key={i} onClick={() => addSign(d.id, s)} style={{ padding: "5px 12px", background: "none", border: `1px solid ${C.border}`, borderRadius: 20, color: C.muted, fontSize: 12, cursor: "pointer" }}>{s}</button>)}
                                  </div>
                                  <div style={{ display: "flex", gap: 8 }}>
                                    <input value={newSign[d.id] || ""} onChange={e => setNewSign(p => ({ ...p, [d.id]: e.target.value }))} placeholder="Log a sign..." style={{ flex: 1 }} onKeyDown={e => e.key === "Enter" && addSign(d.id, newSign[d.id] || "")} />
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
          {tab === "account" && (
            <div className="fade" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 11, color: C.muted, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Your account</div>
                <div style={{ fontSize: 13, color: C.muted, marginBottom: 3 }}>Plan</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: userTier === "goddess" ? C.gold : C.text2, marginBottom: 14 }}>{userTier === "goddess" ? "Goddess Tier · €33/month" : "Audio Tier · €19.99/month"}</div>
                <div style={{ fontSize: 14, color: "#7a6a4a", lineHeight: 1.9, marginBottom: 14 }}>No refunds after 14 days · Cancel before renewal</div>
                <Btn small outline onClick={() => {}}>Manage billing ↗</Btn>
              </div>
              {userTier === "audio" && <div onClick={onUpgrade} style={{ background: "#0a0500", border: `1.5px solid ${C.gold}44`, borderRadius: 14, padding: 20, cursor: "pointer" }}>
                <div style={{ fontSize: 11, color: C.rose, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, marginBottom: 6 }}>Upgrade</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 4 }}>Goddess Tier — €33/month</div>
                <div style={{ fontSize: 13, color: C.muted }}>Unlock ProofOS tracker →</div>
              </div>}
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 14, color: "#7a6a4a", lineHeight: 1.9 }}>iPhone: tap Share → "Add to Home Screen"<br />Plays in background like Spotify when screen is locked</div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                {[["YouTube", "https://www.youtube.com/@Reshma.Oracle"], ["Instagram", "https://www.instagram.com/reshma.oracle/"]].map(([l, u]) => <a key={l} href={u} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: 14, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, color: C.muted, fontSize: 14, textAlign: "center", textDecoration: "none" }}>{l} →</a>)}
              </div>
              <button onClick={onSignOut} style={{ padding: 14, background: "none", border: `1px solid ${C.border}`, borderRadius: 10, color: C.muted, fontSize: 15, cursor: "pointer", minHeight: 48 }}>Sign out</button>
            </div>
          )}
        </div>
      </div>
      <div className="mob-nav" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#050300", borderTop: `1px solid ${C.border}`, zIndex: 200, paddingBottom: "env(safe-area-inset-bottom,8px)", display: "none" }}>
        {tabs.map(t => <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "10px 8px", background: "none", border: "none", color: tab === t.id ? C.gold : C.muted, fontSize: 10, fontWeight: 700, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minHeight: 56, letterSpacing: "0.08em", textTransform: "uppercase" }}><span style={{ fontSize: 20 }}>{t.icon}</span>{t.label}</button>)}
      </div>
      {playing && ct && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(6,4,0,0.97)", borderTop: `1px solid ${C.gold}44`, padding: "10px 16px", zIndex: 100, backdropFilter: "blur(20px)" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: catColors[ct.cat] || C.gold, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.gold, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ct.title}</div>
                <div style={{ fontSize: 11, color: C.dim }}>{ct.type} · {loop ? "Loop on" : "Loop off"} · Sleep: {sleep ? `${sleep}m` : "off"}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                <button onClick={() => setLoop(!loop)} style={{ background: "none", border: "none", fontSize: 18, color: loop ? C.gold : C.dim, cursor: "pointer" }}>↻</button>
                <button onClick={() => setPlaying(null)} style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg,${C.gold},${C.rose})`, border: "none", color: "#000", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>⏸</button>
                <button onClick={() => setSleep(s => s === 60 ? 30 : s === 30 ? 0 : 60)} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "5px 10px", color: sleep ? C.gold : C.dim, fontSize: 12, cursor: "pointer" }}>{sleep ? `${sleep}m` : "∞"}</button>
              </div>
            </div>
            <div style={{ height: 3, background: C.border, borderRadius: 2, cursor: "pointer" }} onClick={e => { const r = e.currentTarget.getBoundingClientRect(); setProgress(Math.round(((e.clientX - r.left) / r.width) * 100)); }}>
              <div style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg,${C.gold},${C.rose})`, borderRadius: 2 }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
