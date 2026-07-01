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
body{background:#000;color:#e8e0d0;font-family:'Inter',sans-serif;font-size:18px;line-height:1.7;overflow-x:hidden;-webkit-font-smoothing:antialiased}
button,input{font-family:'Inter',sans-serif}
input{background:#080600;border:1px solid #1e1608;color:#e8e0d0;border-radius:10px;padding:16px 20px;font-size:17px;width:100%;outline:none;transition:border-color 0.2s}
input:focus{border-color:#C8892A88}
::-webkit-scrollbar{width:2px}
::-webkit-scrollbar-thumb{background:#1e1608}
.wm{font-family:'Cormorant Garamond',serif;font-style:italic}
.fade{animation:fi 0.4s ease}
@keyframes fi{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.sw span{display:inline-block;width:3px;border-radius:2px;background:linear-gradient(180deg,#C8892A,#C4365A);animation:sw 1.2s ease-in-out infinite}
.sw span:nth-child(1){height:8px;animation-delay:0s}
.sw span:nth-child(2){height:22px;animation-delay:.1s}
.sw span:nth-child(3){height:34px;animation-delay:.2s}
.sw span:nth-child(4){height:26px;animation-delay:.15s}
.sw span:nth-child(5){height:38px;animation-delay:.25s}
.sw span:nth-child(6){height:18px;animation-delay:.05s}
.sw span:nth-child(7){height:30px;animation-delay:.3s}
@keyframes sw{0%,100%{transform:scaleY(0.3);opacity:0.4}50%{transform:scaleY(1);opacity:1}}
.ring{position:absolute;border-radius:50%;border:1px solid;pointer-events:none;top:50%;left:50%;animation:breathe 5s ease-in-out infinite}
@keyframes breathe{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:var(--op)}50%{transform:translate(-50%,-50%) scale(1.06);opacity:calc(var(--op)*2.5)}}
@keyframes pulse{0%{box-shadow:0 0 0 0 #C8892A55}70%{box-shadow:0 0 0 24px #C8892A00}100%{box-shadow:0 0 0 0 #C8892A00}}
.pulse{animation:pulse 2s infinite}
@keyframes slide{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
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
      width: full ? "100%" : "auto", padding: small ? "12px 22px" : "17px 34px",
      background: disabled ? "#1a1208" : outline ? "transparent" : `linear-gradient(90deg,${C.gold},${C.rose})`,
      border: outline ? `1.5px solid ${C.gold}88` : "none", borderRadius: 12,
      color: disabled ? C.dim : outline ? C.gold : "#000",
      fontSize: small ? 15 : 17, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      gap: 8, transition: "transform 0.15s", minHeight: 52, letterSpacing: "0.02em", flexShrink: 0,
    }}
      onMouseEnter={e => !disabled && (e.currentTarget.style.transform = "translateY(-2px)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
    >{children}</button>
  );
}

function Rings({ count = 4, color = C.gold }) {
  const sizes = [320, 520, 720, 960, 1200];
  const ops = [0.18, 0.10, 0.06, 0.04, 0.02];
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, background: `radial-gradient(circle,${color}08 0%,transparent 70%)`, borderRadius: "50%" }} />
      {sizes.slice(0, count).map((s, i) => (
        <div key={i} className="ring" style={{ width: s, height: s, borderColor: `${color}${['22','12','08','05','03'][i]}`, "--op": ops[i], animationDelay: `${i * 0.9}s` }} />
      ))}
    </div>
  );
}

function AudioLibraryMockup() {
  const tracks = [
    { title: "He's already on his way back", cat: "Lovemaxxing", color: C.rose, playing: true },
    { title: "Money is obsessed with me", cat: "Moneymaxxing", color: "#b87a20" },
    { title: "Gorgeous is my default setting", cat: "Beautymaxxing", color: C.gold },
    { title: "I wake up as her", cat: "Sleep Shifting", color: "#5a7ab0" },
  ];
  return (
    <div style={{ background: "#060400", border: `1px solid ${C.gold}44`, borderRadius: 20, overflow: "hidden" }}>
      <div style={{ padding: "16px 22px", borderBottom: `1px solid ${C.border}`, background: "#080600" }}>
        <div style={{ fontSize: 12, color: C.muted, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 3 }}>Audio Library</div>
        <div style={{ fontSize: 17, fontWeight: 700, color: C.gold }}>50+ tracks · 4 new every week</div>
      </div>
      {tracks.map((t, i) => (
        <div key={i} style={{ padding: "14px 20px", borderBottom: i < tracks.length - 1 ? `1px solid ${C.border2}` : "none", display: "flex", alignItems: "center", gap: 14, background: t.playing ? "#0d0a00" : "none" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: t.playing ? t.color + "22" : "#080600", border: `1.5px solid ${t.playing ? t.color : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 15 }}>
            {t.playing ? <div className="sw" style={{ display: "flex", alignItems: "center", gap: 2 }}><span /><span /><span /><span /><span /></div> : "▶"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: t.playing ? t.color : C.text2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</div>
            <div style={{ fontSize: 13, color: C.dim, marginTop: 2 }}>{t.cat} · 30 min</div>
          </div>
        </div>
      ))}
      <div style={{ padding: "14px 20px", background: "#0d0a00", borderTop: `1px solid ${C.gold}33` }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.gold, marginBottom: 6 }}>▶ He's already on his way back · Loop on · 60m timer</div>
        <div style={{ height: 4, background: C.border, borderRadius: 2 }}>
          <div style={{ width: "38%", height: "100%", background: `linear-gradient(90deg,${C.gold},${C.rose})`, borderRadius: 2 }} />
        </div>
      </div>
    </div>
  );
}

function DashboardMockup() {
  const desires = [
    { text: "He texts me first", status: "manifested", days: 14, cat: "love", progress: 100 },
    { text: "€10,000 arrives", status: "manifested", days: 9, cat: "money", progress: 100 },
    { text: "Skin visibly glowing", status: "in_progress", days: 21, cat: "beauty", progress: 72 },
  ];
  const catColors = { love: C.rose, money: "#b87a20", beauty: C.gold };
  return (
    <div style={{ background: "#060400", border: `1px solid ${C.gold}44`, borderRadius: 20, overflow: "hidden" }}>
      <div style={{ padding: "16px 22px", borderBottom: `1px solid ${C.border}`, background: "#080600", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 3 }}>ProofOS · Goddess Tier</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: C.gold }}>Your proof board</div>
        </div>
        <div style={{ fontSize: 13, color: C.green, fontWeight: 700, padding: "5px 12px", background: "#0a1a0a", borderRadius: 20, border: `1px solid #2a4a2a` }}>14 day streak ✦</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: `1px solid ${C.border}` }}>
        {[{ v: 3, l: "Intentions", c: C.text2 }, { v: 2, l: "Manifested", c: C.rose }, { v: 11, l: "Avg days", c: C.green }].map((s, i) => (
          <div key={i} style={{ padding: "14px 8px", textAlign: "center", borderRight: i < 2 ? `1px solid ${C.border}` : "none" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.c, lineHeight: 1, marginBottom: 3 }}>{s.v}</div>
            <div style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>{s.l}</div>
          </div>
        ))}
      </div>
      {desires.map((d, i) => (
        <div key={i} style={{ padding: "14px 20px", borderBottom: i < desires.length - 1 ? `1px solid ${C.border2}` : "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: catColors[d.cat], flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: C.text2 }}>{d.text}</span>
            <span style={{ fontSize: 12, padding: "3px 10px", background: d.status === "manifested" ? "#0a1a0a" : C.dim, color: d.status === "manifested" ? C.green : C.gold, borderRadius: 20, fontWeight: 700 }}>
              {d.status === "manifested" ? `✓ ${d.days}d` : `${d.days}d`}
            </span>
          </div>
          <div style={{ height: 5, background: C.border, borderRadius: 3 }}>
            <div style={{ width: `${d.progress}%`, height: "100%", background: d.status === "manifested" ? `linear-gradient(90deg,${C.green},${C.gold})` : `linear-gradient(90deg,${catColors[d.cat]},${C.gold})`, borderRadius: 3 }} />
          </div>
        </div>
      ))}
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
    { id: "love", label: "Lovemaxxing", color: C.rose, tagline: "He's obsessed. Of course he is.", tracks: ["He's already on his way back · 432hz · 30 min", "He's obsessed and he knows it · 432hz · 28 min", "No contact — he comes back first · 528hz · 26 min", "I never chase. He always catches up · 432hz · 32 min"] },
    { id: "money", label: "Moneymaxxing", color: "#b87a20", tagline: "Money finds you first. Obviously.", tracks: ["Money is obsessed with me · 528hz · 25 min", "Unexpected income · always · 528hz · 22 min", "I receive beyond what I ask · 963hz · 27 min", "Overflow is my baseline · 528hz · 35 min"] },
    { id: "beauty", label: "Beautymaxxing", color: C.gold, tagline: "Gorgeous is your default. Obviously.", tracks: ["Gorgeous is my default setting · 432hz · 35 min", "I get prettier every single day · 432hz · 25 min", "The face card is permanently active · 528hz · 24 min", "My face shifted to the highest timeline · 432hz · 40 min"] },
    { id: "life", label: "Lifemaxxing", color: "#9a7a5a", tagline: "Highest timeline. Activated.", tracks: ["I've always been the prize · LOA · 30 min", "Reality rearranges for me · 963hz · 33 min", "I said so therefore it is · 528hz · 32 min", "Shifting into my highest self · 432hz · 28 min"] },
    { id: "dna", label: "DNA Shifting", color: "#8a6ad0", tagline: "Your bloodline remembers who you are.", tracks: ["DNA activation ceremony · 963hz · 45 min", "I override what I inherited · 963hz · 40 min", "Cellular regeneration · 963hz · 38 min", "Ancient codes unlocked · 963hz · 44 min"] },
    { id: "sleep", label: "Sleep Shifting", color: "#5a7ab0", tagline: "You shift while you sleep. Wake up as her.", tracks: ["I manifest while I sleep · Delta · 60 min", "I wake up as her · Theta · 55 min", "Overnight identity shift · Delta · 8 hrs", "The 180 installs silently while you dream · 8 hrs"] },
  ];
  const cat = cats.find(c => c.id === activeCat);

  const comparisonRows = [
    { old: "You check his profile 12 times a day", neu: "You assume he wants you. Of course he does." },
    { old: "You beg, script and see nothing change", neu: "You know it's done. The subconscious has it." },
    { old: "You pick apart your face every morning", neu: "Your self-image says: I am this. Already." },
    { old: "You feel desperate. You push it away.", neu: "You're magnetic because you assume you are." },
    { old: "You try to force with conscious effort", neu: "The subconscious creates it effortlessly." },
    { old: "You doubt the moment it doesn't arrive", neu: "You trust the timing. It's already in motion." },
  ];

  return (
    <div style={{ background: C.black, minHeight: "100vh" }}>
      <audio ref={audioRef} src={FREE_TRACK_URL} preload="none" />

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 300, height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", background: "rgba(0,0,0,0.96)", borderBottom: `1px solid ${C.border}`, backdropFilter: "blur(20px)" }}>
        <button onClick={() => window.scrollTo(0, 0)} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <span className="wm" style={{ fontSize: 20, background: `linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Self Hypnosis Goddess</span>
        </button>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={onProofOS} className="hide-mob" style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 16px", color: C.muted, fontSize: 14, cursor: "pointer" }}>ProofOS ✦</button>
          <Btn small onClick={() => onJoin("audio")}>Join now</Btn>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 11px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 4 }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 18, height: 1.5, background: C.muted }} />)}
          </button>
        </div>
        {menuOpen && (
          <div style={{ position: "absolute", top: 60, right: 24, background: "#0a0800", border: `1px solid ${C.border}`, borderRadius: 14, padding: 12, minWidth: 220, zIndex: 400 }}>
            {[["Audio Library", () => setMenuOpen(false)], ["ProofOS ✦", () => { setMenuOpen(false); onProofOS(); }], ["Preview Dashboard", () => { setMenuOpen(false); onDemo(); }], ["YouTube ↗", () => window.open("https://www.youtube.com/@Reshma.Oracle","_blank")], ["Instagram ↗", () => window.open("https://www.instagram.com/reshma.oracle/","_blank")]].map(([l,fn],i) => (
              <button key={i} onClick={fn} style={{ display:"block",width:"100%",textAlign:"left",padding:"12px 16px",background:"none",border:"none",color:C.text2,fontSize:15,cursor:"pointer",borderRadius:8 }}
                onMouseEnter={e=>e.currentTarget.style.background=C.dim}
                onMouseLeave={e=>e.currentTarget.style.background="none"}>{l}</button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <div style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 60, overflow: "hidden" }}>
        <Rings count={5} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "60px 24px 80px", maxWidth: 760, margin: "0 auto", width: "100%" }}>
          {/* Soundwave */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, height: 60, marginBottom: 28 }}>
            {Array.from({ length: 22 }).map((_, i) => {
              const h = [8,18,30,22,38,26,42,20,34,16,40,24,36,28,18,42,22,32,14,26,20,36][i];
              return <div key={i} style={{ width: 3, borderRadius: 2, height: h, background: `linear-gradient(180deg,${C.gold},${C.rose})`, animation: `sw ${0.8+(i%5)*0.15}s ease-in-out infinite`, animationDelay: `${i*0.06}s`, opacity: 0.7+(i%3)*0.1 }} />;
            })}
          </div>

          {/* TITLE */}
          <h1 className="wm" style={{ fontSize: "clamp(38px,7vw,72px)", lineHeight: 1.05, marginBottom: 10, color: C.text }}>
            Self Hypnosis Goddess<br />
            <span style={{ background: `linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Audio Library</span>
          </h1>
          <div style={{ fontSize: 14, letterSpacing: "0.2em", textTransform: "uppercase", color: C.muted, marginBottom: 28, fontWeight: 600 }}>Reshma Oracle · Self Hypnosis + Subliminals · Not on YouTube</div>

          {/* TAGLINE */}
          <div style={{ fontSize: "clamp(16px,2.2vw,22px)", color: C.gold, fontWeight: 700, letterSpacing: "0.04em", marginBottom: 32, lineHeight: 1.4 }}>
            Reprogram your subconscious mind. Manifest your ideal reality.<br />
            <span style={{ fontSize: "0.85em", color: C.muted, fontWeight: 400 }}>Passive. No effort. No force. Just your subconscious, finally reprogrammed.</span>
          </div>

          {/* PAIN POINT */}
          <p style={{ fontSize: "clamp(17px,2.2vw,20px)", color: "#7a6a4a", lineHeight: 1.9, marginBottom: 12, maxWidth: "100%" }}>
            You've tried everything. Scripted. Visualised. Affirmed. Nothing worked. Because conscious effort cannot reprogram the subconscious mind. Desire is not manifestation. Desire is the seed. <strong style={{ color: C.text2 }}>Certainty is manifestation.</strong>
          </p>
          <p style={{ fontSize: "clamp(17px,2.2vw,20px)", color: "#8a7a5a", lineHeight: 1.9, marginBottom: 12, maxWidth: "100%" }}>
            Your reality mirrors what you assume to be true about yourself — at the deepest subconscious, DNA level. It's not about what you want. It's about your self-concept. Your self-image. What you believe you deserve. Down to your DNA.
          </p>
          <p style={{ fontSize: "clamp(17px,2.2vw,20px)", color: "#8a7a5a", lineHeight: 1.9, marginBottom: 36, maxWidth: "100%" }}>
            These audios install the new self-concept passively — while you sleep, while you rest. No active effort. No conscious force. Just your subconscious, finally reprogrammed. You wake up knowing. Not hoping. <strong style={{ color: C.text2 }}>Knowing.</strong>
          </p>

          {/* FREE TRACK */}
          <div style={{ background: "#0a0800", border: `1px solid ${C.gold}55`, borderRadius: 18, padding: "24px 26px", maxWidth: 460, margin: "0 auto 36px", boxShadow: `0 0 40px ${C.gold}11` }}>
            <div style={{ fontSize: 11, color: C.gold, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Free track — listen now 🎧</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.text2, marginBottom: 3 }}>10 Years of Delay Into One Hour</div>
            <div style={{ fontSize: 14, color: C.muted, marginBottom: 18 }}>EMDR · Self hypnosis · Subconscious reprogramming</div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button onClick={togglePlay} className={playing ? "pulse" : ""} style={{ width: 54, height: 54, borderRadius: "50%", background: `linear-gradient(135deg,${C.gold},${C.rose})`, border: "none", color: "#000", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {playing ? "⏸" : "▶"}
              </button>
              <div style={{ flex: 1 }}>
                <div style={{ height: 5, background: C.border, borderRadius: 3, marginBottom: 7, cursor: "pointer" }}
                  onClick={e => { const r=e.currentTarget.getBoundingClientRect(); if(audioRef.current?.duration) audioRef.current.currentTime=((e.clientX-r.left)/r.width)*audioRef.current.duration; }}>
                  <div style={{ width: `${progress}%`, height: "100%", background: `linear-gradient(90deg,${C.gold},${C.rose})`, borderRadius: 3 }} />
                </div>
                <div style={{ fontSize: 13, color: C.dim }}>{playing ? "Playing — plays in background like Spotify ✦" : "Free — no sign up needed"}</div>
              </div>
              {playing && <div className="sw" style={{ display:"flex",alignItems:"center",gap:2 }}><span/><span/><span/><span/><span/><span/><span/></div>}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 18 }}>
            <Btn onClick={() => onJoin("audio")}>Start your shift — €19/month</Btn>
            <Btn outline onClick={onDemo}>See the dashboard</Btn>
          </div>
          <div style={{ fontSize: 14, color: C.dim }}>Cancel anytime · Stripe · No download · Plays in background like Spotify</div>
        </div>
      </div>

      {/* SLIDING CATEGORY BANNER */}
      <div style={{ overflow: "hidden", padding: "0 0 60px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", gap: 14, animation: "slide 28s linear infinite", width: "max-content", paddingTop: 32 }}>
          {[...cats, ...cats].map((c, i) => (
            <div key={i} style={{ background: C.card, border: `1px solid ${c.color}44`, borderRadius: 18, padding: "26px 34px", minWidth: 300, flexShrink: 0 }}>
              <div style={{ fontSize: 13, color: c.color, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>{c.label}</div>
              <div style={{ fontSize: 19, color: C.text2, lineHeight: 1.55, fontWeight: 500 }}>{c.tagline}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS — SELF CONCEPT */}
      <div style={{ padding: "70px 24px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 14 }}>The science</div>
          <h2 className="wm" style={{ fontSize: "clamp(38px,6vw,72px)", color: C.text, lineHeight: 1.1, marginBottom: 24 }}>
            Your subconscious mind<br />
            <span style={{ background: `linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>creates your entire reality.</span>
          </h2>
          <p style={{ fontSize: 20, color: "#8a7a5a", lineHeight: 1.9, maxWidth: 720, margin: "0 auto 16px" }}>
            Neuroscience confirms 95% of your thoughts, beliefs and behaviours are subconscious. Your self-concept — what you assume to be true about yourself, down to a DNA level — determines everything you experience. Not your desires. Your assumptions.
          </p>
          <p style={{ fontSize: 20, color: "#7a6a4a", lineHeight: 1.9, maxWidth: 720, margin: "0 auto" }}>
            You can read every book. Study Neville Goddard. Understand every theory. But theory without installation changes nothing. These audios install it — passively, at depth, while your conscious mind rests. No force. No effort. The subconscious does the work.
          </p>
        </div>

        {/* COMPARISON TABLE */}
        <div style={{ marginBottom: 60 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", marginBottom: 2 }}>
            <div style={{ background: "#0a0505", borderRadius: "14px 0 0 0", padding: "22px 32px", border: `1px solid #2a1010`, borderBottom: "none", borderRight: "none" }}>
              <div style={{ fontSize: 13, color: "#6a3535", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>Old self-concept</div>
              <div className="wm" style={{ fontSize: 28, color: "#7a5050" }}>Running old programming</div>
            </div>
            <div style={{ background: "#080a08", borderRadius: "0 14px 0 0", padding: "22px 32px", border: `1px solid ${C.gold}33`, borderBottom: "none", borderLeft: "none" }}>
              <div style={{ fontSize: 13, color: C.gold, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>New self-concept</div>
              <div className="wm" style={{ fontSize: 28, color: C.text2 }}>Reprogrammed subconscious</div>
            </div>
          </div>
          {comparisonRows.map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", marginBottom: 2 }}>
              <div style={{ background: "#0a0505", padding: "16px 28px", border: `1px solid #2a1010`, borderRight: "none", borderBottom: "none", borderRadius: i === comparisonRows.length-1 ? "0 0 0 14px" : 0, display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ color: "#5a2a2a", fontSize: 18, flexShrink: 0, marginTop: 2 }}>✗</span>
                <span style={{ fontSize: 19, color: "#7a5a5a", lineHeight: 1.7 }}>{row.old}</span>
              </div>
              <div style={{ background: "#080a08", padding: "16px 28px", border: `1px solid ${C.gold}33`, borderLeft: "none", borderBottom: "none", borderRadius: i === comparisonRows.length-1 ? "0 0 14px 0" : 0, display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ color: C.gold, fontSize: 16, flexShrink: 0, marginTop: 2 }}>✦</span>
                <span style={{ fontSize: 19, color: C.text2, lineHeight: 1.7 }}>{row.neu}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 4 STEPS */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 className="wm" style={{ fontSize: "clamp(36px,5vw,60px)", color: C.text, marginBottom: 12 }}>Four steps. One reality shift.</h2>
          <p style={{ fontSize: 20, color: C.muted }}>Your only job is to press play.</p>
        </div>
        <div className="step-flow" style={{ display: "flex", gap: 0 }}>
          {[
            { n:"01", icon:"🎧", title:"You listen", body:"Self hypnosis and subliminal audio. Headphones in. Press play. Works while you sleep, while you rest, while you exist. No active effort required." },
            { n:"02", icon:"◈", title:"Subconscious shifts", body:"Your self-concept updates at depth. Old assumptions dissolve. The new identity installs — not through willpower, but through repetition during theta and delta brainwave states." },
            { n:"03", icon:"✦", title:"Reality mirrors it", body:"He texts. Money arrives. Skin shifts. People treat you differently. Your outer world mirrors your new inner assumption. Of course it does." },
            { n:"04", icon:"◉", title:"You document proof", body:"Log every sign in ProofOS. Link it to the exact audio. Watch the pattern become undeniable. It is done." },
          ].map((s,i) => (
            <div key={i} style={{ display:"flex", flex:1 }}>
              <div style={{ background:C.card, border:`1px solid ${C.border}`, flex:1, padding:32, borderLeft:i>0?"none":undefined, borderTopLeftRadius:i===0?16:0, borderBottomLeftRadius:i===0?16:0, borderTopRightRadius:i===3?16:0, borderBottomRightRadius:i===3?16:0, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${C.gold}${['88','66','44','22'][i]},transparent)` }} />
                <div style={{ fontSize:"clamp(48px,7vw,80px)", fontWeight:900, color:C.gold+"22", lineHeight:1, marginBottom:8, fontFamily:"monospace" }}>{s.n}</div>
                <div style={{ fontSize:32, marginBottom:14 }}>{s.icon}</div>
                <div style={{ fontSize:22, fontWeight:700, color:C.gold, marginBottom:14 }}>{s.title}</div>
                <div style={{ fontSize:17, color:"#8a7a5a", lineHeight:1.8 }}>{s.body}</div>
              </div>
              {i<3 && <div style={{ display:"flex", alignItems:"center", color:C.gold+"44", fontSize:22, padding:"0 6px", flexShrink:0 }}>→</div>}
            </div>
          ))}
        </div>
      </div>

      {/* WHY SUBLIMINALS + HYPNOSIS */}
      <div style={{ padding: "0 24px 80px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 14 }}>Why it works</div>
          <h2 className="wm" style={{ fontSize: "clamp(28px,4vw,48px)", color: C.text, marginBottom: 10 }}>What is self hypnosis? What is a subliminal?</h2>
          <p style={{ fontSize: 18, color: C.muted }}>Why do these audios reach where affirmations can't?</p>
        </div>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {[
            { icon:"🎧", title:"Self Hypnosis", color:C.gold, body:"Hypnosis bypasses the critical conscious mind and speaks directly to the subconscious. In a deeply relaxed state, your subconscious accepts new beliefs as true — at the identity level. Reshma's voice guides you into that state. The reprogramming happens while you're in it.", freq:"Often results in the fastest shift — some notice a change after one session." },
            { icon:"◈", title:"Subliminals", color:C.rose, body:"Subliminal audios layer affirmations beneath music or sound at a frequency your conscious mind cannot detect — but your subconscious hears clearly. No mental resistance. No filtering. The new belief goes straight in. Most effective when listened to repeatedly, especially during sleep.", freq:"Works overnight. Your subconscious stays active while you sleep." },
            { icon:"✦", title:"Why Both?", color:"#8a7a5a", body:"Some self hypnosis tracks include subliminal layers beneath the voice — working on two levels simultaneously. The hypnosis creates the open channel. The subliminals reinforce the new identity beneath it. Together, they reprogram faster and more deeply than either alone.", freq:"Results vary per person and per desire. Some shift in days. Some in weeks. Each person is unique." },
          ].map((c,i) => (
            <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:28, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${c.color},transparent)` }} />
              <div style={{ fontSize:32, marginBottom:14 }}>{c.icon}</div>
              <div style={{ fontSize:20, fontWeight:700, color:c.color, marginBottom:14 }}>{c.title}</div>
              <div style={{ fontSize:16, color:"#8a7a5a", lineHeight:1.75, marginBottom:16 }}>{c.body}</div>
              <div style={{ fontSize:14, color:C.muted, fontStyle:"italic", lineHeight:1.6, borderTop:`1px solid ${C.border}`, paddingTop:14 }}>{c.freq}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop:32, background:C.card, border:`1px solid ${C.gold}33`, borderRadius:14, padding:"20px 28px", textAlign:"center" }}>
          <div style={{ fontSize:17, color:"#8a7a5a", lineHeight:1.85 }}>
            <strong style={{ color:C.text2 }}>How often should you listen?</strong> Daily is ideal — especially at night before sleep or in the morning before you're fully awake. The subconscious is most receptive at the threshold between sleep and wakefulness. Results depend on your belief system, how deep the old programming runs, and how consistently you listen. Every person and every topic is different. Trust your own timeline.
          </div>
        </div>
      </div>

      {/* TECHNOLOGY TABLE */}
      <div style={{ padding: "0 24px 80px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 14 }}>The technology</div>
          <h2 className="wm" style={{ fontSize: "clamp(28px,4vw,52px)", color: C.text, marginBottom: 14 }}>What's inside every audio.</h2>
          <p style={{ fontSize: 18, color: C.muted, maxWidth: 620, margin: "0 auto" }}>Every track is layered with multiple technologies working simultaneously to activate your ideal brainwave state and install the new self-concept at depth.</p>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", background: "#0a0800", borderBottom: `1px solid ${C.border}` }}>
            {["Technology", "What it is", "What it does", "When it activates"].map((h,i) => (
              <div key={i} style={{ padding: "14px 18px", fontSize: 13, color: C.gold, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", borderRight: i < 3 ? `1px solid ${C.border}` : "none" }}>{h}</div>
            ))}
          </div>
          {[
            { tech: "Self Hypnosis", what: "Guided induction using Reshma's voice", does: "Bypasses the critical conscious mind and opens the subconscious to new beliefs", when: "During hypnotic trance — theta state (4–8 Hz)" },
            { tech: "Subliminals", what: "Affirmations layered beneath audible sound", does: "Delivers the new self-concept directly to the subconscious without conscious resistance", when: "Any state — most powerful during sleep" },
            { tech: "Binaural Beats", what: "Two tones at different frequencies in each ear", does: "Entrains the brain to theta or delta states — making the subconscious receptive", when: "Headphones required · begins within minutes" },
            { tech: "EMDR (bilateral)", what: "Bilateral audio stimulation — left and right", does: "Processes and dissolves old beliefs, trauma patterns and identity blocks", when: "During the audio session · accelerates release" },
            { tech: "Reiki / Energy", what: "Encoded energetic frequency in the track", does: "Raises the energetic vibration of the recording — activates alignment at a cellular level", when: "Present throughout the entire track" },
            { tech: "Solfeggio Frequencies", what: "Sacred healing frequencies (432hz, 528hz, 963hz)", does: "432hz: harmony · 528hz: transformation / DNA repair · 963hz: higher consciousness activation", when: "432hz, 528hz, or 963hz — stated per track" },
            { tech: "Brainwave States", what: "Alpha, theta, and delta state entrainment", does: "The subconscious is most receptive at the threshold of sleep. Best listened to first thing on waking or last thing at night.", when: "Alpha 8–12 Hz · Theta 4–8 Hz · Delta 0.5–4 Hz" },
          ].map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", borderBottom: i < 6 ? `1px solid ${C.border2}` : "none" }}>
              <div style={{ padding: "16px 18px", fontSize: 16, fontWeight: 700, color: C.gold, borderRight: `1px solid ${C.border}` }}>{row.tech}</div>
              <div style={{ padding: "16px 18px", fontSize: 15, color: C.muted, borderRight: `1px solid ${C.border}`, lineHeight: 1.6 }}>{row.what}</div>
              <div style={{ padding: "16px 18px", fontSize: 15, color: C.text2, borderRight: `1px solid ${C.border}`, lineHeight: 1.6 }}>{row.does}</div>
              <div style={{ padding: "16px 18px", fontSize: 14, color: C.muted, fontStyle: "italic", lineHeight: 1.6 }}>{row.when}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RESULTS — before/after */}
      <div style={{ padding: "0 24px 80px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 14 }}>The results</div>
          <h2 className="wm" style={{ fontSize: "clamp(40px,6vw,76px)", color: C.text, marginBottom: 10, lineHeight: 1.1 }}>What shifts when<br/>your self-concept shifts.</h2>
        </div>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {[
            { cat:"Lovemaxxing", color:C.rose, before:{ label:"Old assumption", text:"I am not enough. He leaves. I chase.", visual:[{msg:"Hey are you there?",sent:true},{msg:"Can we talk?",sent:true},{msg:"No reply · 8 days",center:true,dim:true}] }, after:{ label:"New assumption", text:"He comes back. Of course he does.", visual:[{msg:"I miss you. Been thinking about you constantly.",green:true},{msg:"✓✓ Read · 11:43pm",small:true,green:true}] } },
            { cat:"Moneymaxxing", color:"#b87a20", before:{ label:"Old assumption", text:"There is never enough. I am always behind.", visual:[{amount:"€247.83",dim:true},{bill:"Rent −€900",dim:true},{bill:"Bills −€180",dim:true}] }, after:{ label:"New assumption", text:"I receive unexpectedly. Always.", visual:[{transfer:true,amount:"€10,000",label:"Unexpected transfer"}] } },
            { cat:"Beautymaxxing", color:C.gold, before:{ label:"Old assumption", text:"I am not beautiful. I need to fix myself.", visual:[{mirror:true}] }, after:{ label:"New assumption", text:"They notice before you do.", visual:[{msg:"What are you doing differently?? You're GLOWING",fromName:"Sarah"},{msg:"Your skin is actually shifting omg",fromName:"Mia"}] } },
          ].map((item,idx) => (
            <div key={idx} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden" }}>
              <div style={{ padding:"12px 18px", borderBottom:`1px solid ${C.border}`, background:idx===0?"#0d0508":idx===1?"#090d08":"#0d0c08" }}>
                <div style={{ fontSize:13, color:item.color, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:2 }}>{item.cat}</div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr" }}>
                {[item.before, item.after].map((side,si) => (
                  <div key={si} style={{ padding:16, borderRight:si===0?`1px solid ${C.border}`:"none" }}>
                    <div style={{ fontSize:11, color:si===0?"#5a3535":C.gold, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:10 }}>{side.label}</div>
                    <div style={{ background:si===0?"#111":"#080f08", borderRadius:10, padding:12, marginBottom:8, border:si===1?`1px solid #1a3a1a`:"none", minHeight:80 }}>
                      {side.visual?.map((v,vi) => (
                        <div key={vi}>
                          {v.mirror && <div style={{ textAlign:"center", fontSize:28, filter:"grayscale(1) opacity(0.3)", marginBottom:4 }}>🪞</div>}
                          {v.amount && !v.transfer && <div style={{ fontSize:v.dim?18:26, fontWeight:800, color:v.dim?"#4a4a4a":"#6ab06a", marginBottom:4 }}>{v.amount}</div>}
                          {v.bill && <div style={{ fontSize:12, color:"#3a3a3a", marginBottom:2 }}>{v.bill}</div>}
                          {v.transfer && <div style={{ background:"#0a1f0a", borderRadius:8, padding:"8px 10px", border:`1px solid #2a4a2a` }}><div style={{ fontSize:11, color:"#4a8a4a" }}>✓ Payment received</div><div style={{ fontSize:22, fontWeight:800, color:"#6ab06a" }}>{v.amount}</div><div style={{ fontSize:11, color:"#2a4a2a" }}>{v.label}</div></div>}
                          {v.msg && !v.fromName && <div style={{ background:v.green?"#0f2a0f":"#1a1a1a", borderRadius:8, padding:"6px 8px", marginBottom:4, border:v.green?`1px solid #1a3a1a`:"none" }}><div style={{ color:v.green?"#7ab07a":v.dim?"#333":"#555", fontSize:v.small?11:12 }}>{v.msg}</div></div>}
                          {v.fromName && <div style={{ background:"#140f02", borderRadius:8, padding:"6px 8px", marginBottom:4, border:`1px solid ${C.dim}` }}><div style={{ fontSize:10, color:C.muted, marginBottom:2 }}>{v.fromName}</div><div style={{ fontSize:12, color:C.text2 }}>{v.msg}</div></div>}
                          {v.center && <div style={{ textAlign:"center", fontSize:11, color:"#2a2a2a" }}>{v.msg}</div>}
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize:14, color:si===0?"#6a4a4a":C.text2, fontStyle:"italic", lineHeight:1.5 }}>{side.text}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WHY DESIRE DOESN'T MANIFEST */}
      <div style={{ padding: "0 24px 80px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ background: "linear-gradient(135deg,#0a0500,#0d0800)", border: `1px solid ${C.gold}33`, borderRadius: 20, padding: "44px 44px" }}>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 16 }}>The real reason</div>
          <h2 className="wm" style={{ fontSize: "clamp(28px,4vw,52px)", color: C.text, marginBottom: 20, lineHeight: 1.2 }}>
            Why desire doesn't manifest.<br/>
            <span style={{ background: `linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>And what does.</span>
          </h2>
          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            <div>
              <div style={{ fontSize: 14, color: C.rose, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14 }}>Why it hasn't worked</div>
              {["Desire lives in the conscious mind. The conscious mind doesn't create reality.", "Affirmations are rejected by a subconscious that holds the opposite belief.", "Visualisation without identity shift is just imagination. The subconscious knows the difference.", "Willpower requires constant effort. The subconscious always wins."].map((t,i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                  <span style={{ color: "#5a2a2a", fontSize: 20, flexShrink: 0, marginTop: 2 }}>✗</span>
                  <span style={{ fontSize: 17, color: "#7a5a5a", lineHeight: 1.7 }}>{t}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 14, color: C.gold, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14 }}>What actually works</div>
              {["The subconscious accepts new beliefs during theta and delta states — at the edge of sleep.", "Repetition installs the new self-concept below the threshold of conscious resistance.", "Once the subconscious holds the new identity as true, reality rearranges to match it.", "Passive. No effort. No force. The subconscious does the work while you rest."].map((t,i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                  <span style={{ color: C.gold, fontSize: 18, flexShrink: 0, marginTop: 2 }}>✦</span>
                  <span style={{ fontSize: 17, color: C.text2, lineHeight: 1.7 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* APP PREVIEW */}
      <div style={{ padding: "0 24px 80px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 14 }}>Inside the app</div>
          <h2 className="wm" style={{ fontSize: "clamp(34px,5vw,60px)", color: C.text, marginBottom: 10 }}>Your portal. Your library. Your proof.</h2>
          <p style={{ fontSize: 18, color: C.muted }}>Plays in background like Spotify. No download. Save to home screen.</p>
        </div>
        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div>
            <div style={{ fontSize: 14, color: C.gold, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>Audio Tier — Full library</div>
            <AudioLibraryMockup />
          </div>
          <div>
            <div style={{ fontSize: 14, color: C.rose, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>Goddess Tier — ProofOS tracker ✦</div>
            <DashboardMockup />
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Btn onClick={onDemo}>Preview the full dashboard →</Btn>
        </div>
      </div>

      {/* AUDIO LIBRARY */}
      <div style={{ padding: "0 24px 80px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 14 }}>The vault</div>
          <h2 className="wm" style={{ fontSize: "clamp(28px,4vw,48px)", color: C.text, marginBottom: 10 }}>Every desire has its own track.</h2>
          <p style={{ fontSize: 18, color: C.muted }}>50+ tracks. 4 new every week. Never on YouTube. Never interrupted.</p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 22 }}>
          {cats.map(c => (
            <button key={c.id} onClick={() => setActiveCat(c.id)} style={{ padding: "9px 20px", borderRadius: 24, border: `1.5px solid ${activeCat===c.id?c.color:C.border}`, background: activeCat===c.id?c.color+"22":"none", color: activeCat===c.id?c.color:C.muted, fontSize: 15, fontWeight: 700, cursor: "pointer", minHeight: 44, transition: "all 0.2s" }}>{c.label}</button>
          ))}
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 13, color: cat.color, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 5 }}>{cat.label}</div>
            <div className="wm" style={{ fontSize: 24, color: C.text }}>{cat.tagline}</div>
          </div>
          {cat.tracks.map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 24px", borderBottom: i < cat.tracks.length-1 ? `1px solid ${C.border2}` : "none" }}>
              <div style={{ width: 42, height: 42, borderRadius: "50%", background: i===0?cat.color+"22":"#080600", border: `1.5px solid ${i===0?cat.color:C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{i===0?"▶":"🔒"}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 17, fontWeight: 600, color: i===0?cat.color:C.text2 }}>{t}</div>
              </div>
              {i===0 && <span style={{ fontSize: 13, padding: "4px 12px", background: cat.color+"22", color: cat.color, borderRadius: 12, fontWeight: 700 }}>FREE</span>}
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 14, fontSize: 15, color: C.muted }}>First track in every category is free · Full library from €19/month</div>
      </div>

      {/* PROOFOS TEASER */}
      <div style={{ padding: "0 24px 80px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ position: "relative", background: "linear-gradient(135deg,#0a0700,#12080a)", border: `2px solid ${C.gold}44`, borderRadius: 20, padding: 40, overflow: "hidden", cursor: "pointer" }} onClick={onProofOS}>
          <Rings count={3} color={C.rose} />
          <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36 }} className="grid-2">
            <div>
              <div style={{ fontSize: 12, color: C.rose, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>Goddess Tier · Coming soon</div>
              <div className="wm" style={{ fontSize: "clamp(36px,5vw,60px)", lineHeight: 0.95, marginBottom: 12, background: `linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ProofOS ✦</div>
              <div style={{ fontSize: 15, color: C.muted, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>The manifestation ledger</div>
              <p style={{ fontSize: 18, color: "#8a7a5a", lineHeight: 1.85, marginBottom: 24 }}>Log your desire. Link it to your audio. Capture every sign. Watch the evidence build into something undeniable. See exactly how many days it took from first listen to final proof.</p>
              <span style={{ fontSize: 16, color: C.gold, fontWeight: 700 }}>Find out more →</span>
            </div>
            <DashboardMockup />
          </div>
        </div>
      </div>

      {/* PRICING — 3 COLUMN COMPARISON TABLE */}
      <div style={{ padding: "0 24px 80px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 12, color: C.muted, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 14 }}>Pricing</div>
          <h2 className="wm" style={{ fontSize: "clamp(28px,4vw,48px)", color: C.text, marginBottom: 10 }}>Choose your tier</h2>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 4, display: "flex", gap: 4 }}>
              {["monthly", "annual"].map(b => (
                <button key={b} onClick={() => setBilling(b)} style={{ padding: "10px 22px", borderRadius: 9, background: billing===b?`linear-gradient(90deg,${C.gold},${C.rose})`:"transparent", border: "none", color: billing===b?"#000":C.muted, fontSize: 15, fontWeight: 700, cursor: "pointer", minHeight: 44 }}>
                  {b==="annual"?"Annual — save 20%":"Monthly"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3-column comparison */}
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr 1fr", gap: 0, background: C.card, borderRadius: 18, overflow: "hidden", border: `1px solid ${C.border}` }}>
          {/* Header row */}
          <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}` }} />
          {[
            { name: "Audio Tier", price: billing==="monthly"?"€19":"€192", period: billing==="monthly"?"/mo":"/yr", color: C.text2, cta: "Join Audio", id: "audio" },
            { name: "Goddess Tier", price: billing==="monthly"?"€33":"€317", period: billing==="monthly"?"/mo":"/yr", color: C.gold, popular: true, cta: "Become Goddess", id: "goddess" },
            { name: "Founder Lifetime", price: "€500", period: "once", color: C.rose, cta: "Claim Founder", id: "founder", sub: "Original price · First 1,000 members only" },
          ].map((col, ci) => (
            <div key={ci} style={{ padding: "20px 20px 16px", borderBottom: `1px solid ${C.border}`, borderRight: ci < 2 ? `1px solid ${C.border}` : "none", background: col.popular ? "#0d0a00" : "none", position: "relative", textAlign: "center" }}>
              {col.popular && <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", background: `linear-gradient(90deg,${C.gold},${C.rose})`, color: "#000", fontSize: 11, fontWeight: 800, padding: "2px 14px", borderRadius: "0 0 10px 10px", whiteSpace: "nowrap" }}>MOST POPULAR</div>}
              <div style={{ fontSize: 16, fontWeight: 700, color: col.color, marginBottom: 6 }}>{col.name}</div>
              {col.sub && <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>{col.sub}</div>}
              <div style={{ display: "flex", alignItems: "baseline", gap: 3, justifyContent: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 34, fontWeight: 800, color: col.color }}>{col.price}</span>
                <span style={{ fontSize: 13, color: C.muted }}>{col.period}</span>
              </div>
              <Btn small full onClick={() => onJoin(col.id)}>{col.cta}</Btn>
            </div>
          ))}
          {/* Feature rows */}
          {[
            { label: "Full audio library — 50+ tracks", audio: true, goddess: true, founder: true },
            { label: "Lovemaxxing · Moneymaxxing · Beautymaxxing · Lifemaxxing · DNA · Sleep", audio: true, goddess: true, founder: true },
            { label: "4 new tracks every week", audio: true, goddess: true, founder: true },
            { label: "Loop player + sleep timer", audio: true, goddess: true, founder: true },
            { label: "Plays in background like Spotify", audio: true, goddess: true, founder: true },
            { label: "No ads. Ever.", audio: true, goddess: true, founder: true },
            { label: "ProofOS manifestation tracker ✦", audio: false, goddess: true, founder: true },
            { label: "Early access — 48hrs before everyone", audio: false, goddess: true, founder: true },
            { label: "Monthly ritual audio included", audio: false, goddess: true, founder: true },
            { label: "1 GB private evidence vault", audio: false, goddess: true, founder: true },
            { label: "All future features forever", audio: false, goddess: false, founder: true },
            { label: "Founder's seal ✦", audio: false, goddess: false, founder: true },
          ].map((row, ri) => (
            <div key={ri} style={{ display: "contents" }}>
              <div style={{ padding: "14px 24px", borderBottom: `1px solid ${C.border2}`, borderRight: `1px solid ${C.border}`, fontSize: 15, color: C.text2, lineHeight: 1.4, display: "flex", alignItems: "center" }}>{row.label}</div>
              {[row.audio, row.goddess, row.founder].map((has, ci) => (
                <div key={ci} style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border2}`, borderRight: ci < 2 ? `1px solid ${C.border}` : "none", textAlign: "center", background: ci === 1 ? "#0d0a00" : "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {has ? <span style={{ fontSize: 22, color: C.green }}>✓</span> : <span style={{ fontSize: 18, color: C.dim }}>—</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 14, color: C.dim, lineHeight: 1.9 }}>No refunds after 14 days · Cancel before renewal · Web app · iPhone: Add to Home Screen</div>
      </div>

      {/* FINAL CTA */}
      <div style={{ position: "relative", padding: "80px 24px", textAlign: "center", overflow: "hidden", borderTop: `1px solid ${C.border}` }}>
        <Rings count={4} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="wm" style={{ fontSize: "clamp(30px,5vw,56px)", color: C.text, lineHeight: 1.2, marginBottom: 24 }}>
            Wake up knowing.<br />
            <span style={{ background: `linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Not hoping. Knowing.</span>
          </div>
          <Btn onClick={() => onJoin("audio")}>Start your shift — €19/month</Btn>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: "36px 24px", textAlign: "center" }}>
        <div className="wm" style={{ fontSize: 22, display: "block", marginBottom: 16, background: `linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Self Hypnosis Goddess</div>
        <div style={{ display: "flex", gap: 28, justifyContent: "center", marginBottom: 16 }}>
          {[["YouTube","https://www.youtube.com/@Reshma.Oracle"],["Instagram","https://www.instagram.com/reshma.oracle/"]].map(([l,u]) => (
            <a key={l} href={u} target="_blank" rel="noopener noreferrer" style={{ fontSize: 15, color: C.muted, textDecoration: "none" }}>{l} →</a>
          ))}
        </div>
        <div style={{ fontSize: 13, color: C.dim }}>© 2026 Reshma Oracle · All rights reserved</div>
      </div>
    </div>
  );
}

function ProofOSPage({ onBack, onJoin }) {
  const [email, setEmail] = useState(""); const [joined, setJoined] = useState(false);
  return (
    <div style={{ minHeight:"100vh", background:C.black }} className="fade">
      <nav style={{ position:"sticky", top:0, zIndex:100, padding:"0 24px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(0,0,0,0.96)", borderBottom:`1px solid ${C.border}` }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:C.muted, fontSize:16, cursor:"pointer" }}>← Back</button>
        <span className="wm" style={{ fontSize:19, background:`linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Self Hypnosis Goddess</span>
        <div style={{ width:60 }} />
      </nav>
      <div style={{ position:"relative", padding:"72px 24px 56px", textAlign:"center", overflow:"hidden" }}>
        <Rings count={4} color={C.rose} />
        <div style={{ position:"relative", zIndex:1, maxWidth:640, margin:"0 auto" }}>
          <div style={{ fontSize:12, color:C.rose, fontWeight:700, letterSpacing:"0.25em", textTransform:"uppercase", marginBottom:18 }}>Goddess Tier Exclusive · Coming Soon</div>
          <div className="wm" style={{ fontSize:"clamp(56px,12vw,100px)", lineHeight:0.9, marginBottom:16, background:`linear-gradient(135deg,${C.gold},${C.rose})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>ProofOS</div>
          <div style={{ fontSize:15, color:C.muted, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:26 }}>The manifestation ledger</div>
          <div style={{ fontSize:"clamp(19px,3vw,26px)", fontWeight:700, color:C.text, lineHeight:1.5, marginBottom:16 }}>You've been manifesting.<br />Now watch it prove itself.</div>
          <p style={{ fontSize:18, color:"#8a7a5a", lineHeight:1.85, marginBottom:38 }}>Log your desire. Link it to the exact audio. Capture every sign. Watch the evidence build into something undeniable. See exactly how many days it took.</p>
          {!joined ? (
            <div style={{ maxWidth:400, margin:"0 auto" }}>
              <div style={{ display:"flex", gap:10, marginBottom:10 }}>
                <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" type="email" />
                <Btn onClick={() => { if(email.includes("@")) setJoined(true); }}>Join waitlist</Btn>
              </div>
              <div style={{ fontSize:14, color:C.dim }}>Goddess Tier members get first access · No spam</div>
            </div>
          ) : (
            <div style={{ padding:"18px 26px", background:"#0a1a0a", border:`1px solid #2a4a2a`, borderRadius:12, maxWidth:400, margin:"0 auto", fontSize:16, color:C.green, fontWeight:600 }}>✓ You're on the list. First access when ProofOS launches.</div>
          )}
        </div>
      </div>
      <div style={{ padding:"0 24px 60px", maxWidth:960, margin:"0 auto" }}>
        <h2 style={{ textAlign:"center", fontSize:"clamp(24px,4vw,40px)", fontWeight:700, color:C.text, marginBottom:40 }}>How ProofOS works</h2>
        <div className="step-flow" style={{ display:"flex", gap:0, marginBottom:40 }}>
          {[{n:"01",icon:"✦",t:"Set your intention",b:"State exactly what you want. Present tense. This becomes your active proof thread."},{n:"02",icon:"🎧",t:"Listen with purpose",b:"Every track links automatically to your active threads. Every session dated and recorded."},{n:"03",icon:"◈",t:"Capture the proof",b:"Signs, synchronicities, results. Screenshot. Voice note. Log them as they arrive."},{n:"04",icon:"✓",t:"Mark it manifested",b:"When it arrives — mark it. See the exact days from first listen to final proof."}].map((s,i) => (
            <div key={i} style={{ display:"flex", flex:1 }}>
              <div style={{ background:C.card, border:`1px solid ${C.border}`, flex:1, padding:26, borderLeft:i>0?"none":undefined, borderRadius:i===0?"14px 0 0 14px":i===3?"0 14px 14px 0":0 }}>
                <div style={{ fontSize:12, color:C.muted, fontFamily:"monospace", fontWeight:700, marginBottom:12 }}>{s.n}</div>
                <div style={{ fontSize:28, color:C.gold, marginBottom:12 }}>{s.icon}</div>
                <div style={{ fontSize:19, fontWeight:700, color:C.text, marginBottom:10 }}>{s.t}</div>
                <div style={{ fontSize:16, color:C.muted, lineHeight:1.7 }}>{s.b}</div>
              </div>
              {i<3 && <div style={{ display:"flex", alignItems:"center", color:C.gold+"55", fontSize:18, padding:"0 3px", flexShrink:0 }}>→</div>}
            </div>
          ))}
        </div>
        <DashboardMockup />
      </div>
      <div style={{ padding:"0 24px 80px", textAlign:"center", maxWidth:540, margin:"0 auto" }}>
        <div className="wm" style={{ fontSize:"clamp(24px,4vw,40px)", color:C.text, marginBottom:16 }}>Ready to begin?</div>
        <p style={{ fontSize:18, color:C.muted, marginBottom:32, lineHeight:1.75 }}>ProofOS is included in the Goddess Tier.<br />Start with the audio library now. The tracker unlocks when it launches.</p>
        <Btn full onClick={() => onJoin("goddess")}>Join Goddess Tier — €33/month</Btn>
      </div>
    </div>
  );
}

function Onboard({ tier, onSuccess, onBack }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [billing, setBilling] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const tierName = tier==="goddess"?"Goddess Tier":tier==="founder"?"Founder Lifetime":"Audio Tier";
  const price = tier==="founder"?"€500":tier==="goddess"?(billing==="monthly"?"€33":"€317"):(billing==="monthly"?"€19":"€192");
  const next = () => { if(step===3){setLoading(true);setTimeout(()=>{setLoading(false);setStep(4);},1400);}else if(step===4)onSuccess();else setStep(s=>s+1); };
  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px 20px", background:C.black }} className="fade">
      {step<4 && <button onClick={onBack} style={{ position:"fixed", top:20, left:20, background:"none", border:"none", color:C.muted, fontSize:16, cursor:"pointer" }}>← Back</button>}
      {step<4 && <div style={{ display:"flex", gap:0, marginBottom:44 }}>{[1,2,3].map(n=><div key={n} style={{ display:"flex", alignItems:"center" }}><div style={{ width:34,height:34,borderRadius:"50%",background:n<=step?`linear-gradient(135deg,${C.gold},${C.rose})`:C.card,border:`1.5px solid ${n<=step?C.gold:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:n<=step?"#000":C.muted }}>{n<step?"✓":n}</div>{n<3&&<div style={{ width:52,height:"1px",background:n<step?C.gold:C.border }} />}</div>)}</div>}
      <div style={{ width:"100%", maxWidth:480 }}>
        {step===1&&<div className="fade"><div className="wm" style={{ fontSize:26,marginBottom:8,background:`linear-gradient(90deg,${C.gold},${C.rose})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>Self Hypnosis Goddess</div><div style={{ fontSize:22,fontWeight:700,color:C.text,marginBottom:6 }}>Create your account</div><div style={{ fontSize:17,color:C.muted,marginBottom:30 }}>Joining: {tierName}</div><div style={{ display:"flex",flexDirection:"column",gap:14,marginBottom:22 }}><input placeholder="Your name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /><input placeholder="Email address" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /><input placeholder="Password (min 8 characters)" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} /></div><Btn full onClick={next} disabled={!form.email||form.password.length<8}>Continue →</Btn><div style={{ textAlign:"center",marginTop:16,fontSize:16,color:C.muted }}>Already a member? <span style={{ color:C.gold,cursor:"pointer" }} onClick={onBack}>Sign in</span></div></div>}
        {step===2&&<div className="fade"><div style={{ fontSize:22,fontWeight:700,color:C.text,marginBottom:26 }}>Confirm your plan</div>{tier!=="founder"&&<div style={{ display:"flex",gap:12,marginBottom:18 }}>{["monthly","annual"].map(b=><button key={b} onClick={()=>setBilling(b)} style={{ flex:1,padding:18,background:billing===b?C.card2:C.card,border:`${billing===b?"2px":"1px"} solid ${billing===b?C.gold+"88":C.border}`,borderRadius:12,cursor:"pointer",textAlign:"left" }}><div style={{ fontSize:16,fontWeight:700,color:billing===b?C.gold:C.text,marginBottom:3 }}>{b==="monthly"?"Monthly":"Annual"}</div><div style={{ fontSize:24,fontWeight:800,color:billing===b?C.gold:C.text }}>{tier==="goddess"?(b==="monthly"?"€33":"€317"):(b==="monthly"?"€19":"€192")}<span style={{ fontSize:13,color:C.muted }}>/{b==="monthly"?"mo":"yr"}</span></div>{b==="annual"&&<div style={{ fontSize:13,color:C.rose,marginTop:4,fontWeight:600 }}>Save 20% · 2 months free</div>}</button>)}</div>}<Btn full onClick={next}>Continue to payment →</Btn></div>}
        {step===3&&<div className="fade"><div style={{ fontSize:22,fontWeight:700,color:C.text,marginBottom:26 }}>Secure checkout</div><div style={{ background:C.card,border:`1.5px solid ${C.gold}55`,borderRadius:12,padding:20,marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center" }}><div><div style={{ fontSize:17,fontWeight:700,color:C.text }}>{tierName}</div><div style={{ fontSize:15,color:C.muted }}>{tier==="founder"?"One-time":`Billed ${billing}`}</div></div><div style={{ fontSize:34,fontWeight:800,color:C.gold }}>{price}</div></div><div style={{ background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:18,fontSize:16,color:"#6a5a3a",lineHeight:1.75 }}>Stripe secure checkout · SSL encrypted<br/>No card data stored · No refunds after 14 days</div><Btn full onClick={next} disabled={loading}>{loading?"Processing...":"Pay with Stripe →"}</Btn></div>}
        {step===4&&<div style={{ textAlign:"center" }} className="fade"><div style={{ fontSize:64,marginBottom:22 }}>✦</div><div className="wm" style={{ fontSize:46,marginBottom:12,background:`linear-gradient(90deg,${C.gold},${C.rose})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>Welcome.</div><div style={{ fontSize:18,color:C.muted,marginBottom:38,lineHeight:1.8 }}>Your portal is ready.<br/>Wake up knowing. Not hoping. Knowing.</div><Btn full onClick={next}>Enter the portal →</Btn></div>}
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
    { id:1, desire:"He texts me first", status:"manifested", track:"He's already on his way back", trackCat:"love", days:14, signs:["Got a like on Instagram","Mutual friend mentioned me"] },
    { id:2, desire:"€5,000 arrives unexpectedly", status:"in_progress", track:"Money is obsessed with me", trackCat:"money", days:6, signs:["Found €20 in old jacket"] },
    { id:3, desire:"Skin visibly glowing to others", status:"in_progress", track:"Gorgeous is my default setting", trackCat:"beauty", days:3, signs:[] },
  ]);
  const [newDesire, setNewDesire] = useState("");
  const [newSign, setNewSign] = useState({});
  const [expanded, setExpanded] = useState(null);

  const catColors = { love:C.rose, money:"#b87a20", beauty:C.gold, sleep:"#5a7ab0", dna:"#8a6ad0", life:"#9a7a5a", all:C.gold };
  const tracks = [
    { id:1, title:"He's already on his way back", cat:"love", tag:"Lovemaxxing", freq:"432hz", type:"Self hypnosis", dur:"30:00", tier:"audio", isNew:true },
    { id:2, title:"Money is obsessed with me", cat:"money", tag:"Moneymaxxing", freq:"528hz", type:"Subliminal", dur:"25:00", tier:"audio", isNew:true },
    { id:3, title:"Gorgeous is my default setting", cat:"beauty", tag:"Beautymaxxing", freq:"432hz", type:"Self hypnosis", dur:"35:00", tier:"audio" },
    { id:4, title:"I've always been the prize", cat:"life", tag:"Lifemaxxing", freq:"LOA", type:"Subliminal", dur:"30:00", tier:"audio" },
    { id:5, title:"DNA activation ceremony", cat:"dna", tag:"DNA Shifting", freq:"963hz", type:"Frequency", dur:"45:00", tier:"goddess" },
    { id:6, title:"I manifest while I sleep", cat:"sleep", tag:"Sleep Shifting", freq:"Delta", type:"Sleep subliminal", dur:"60:00", tier:"audio" },
    { id:7, title:"He's obsessed and he knows it", cat:"love", tag:"Lovemaxxing", freq:"432hz", type:"Subliminal", dur:"28:00", tier:"audio" },
    { id:8, title:"Reality rearranges for me", cat:"life", tag:"Lifemaxxing", freq:"963hz", type:"Frequency", dur:"33:00", tier:"goddess" },
    { id:9, title:"I get prettier every single day", cat:"beauty", tag:"Beautymaxxing", freq:"432hz", type:"Self hypnosis", dur:"25:00", tier:"audio", isNew:true },
    { id:10, title:"Unexpected money · always", cat:"money", tag:"Moneymaxxing", freq:"528hz", type:"Subliminal", dur:"22:00", tier:"audio", isNew:true },
  ];
  const cats = [{id:"all",label:"All"},{id:"love",label:"Lovemaxxing"},{id:"money",label:"Moneymaxxing"},{id:"beauty",label:"Beautymaxxing"},{id:"sleep",label:"Sleep"},{id:"dna",label:"DNA"},{id:"life",label:"Lifemaxxing"}];
  const canPlay = t => t.tier==="audio"||userTier==="goddess";
  const ct = tracks.find(t=>t.id===playing);
  const filtered = tracks.filter(t=>(activeCat==="all"||t.cat===activeCat)&&(!search||t.title.toLowerCase().includes(search.toLowerCase())));
  const manifested = desires.filter(d=>d.status==="manifested").length;
  const inProgress = desires.filter(d=>d.status==="in_progress").length;

  const addDesire = () => { if(!newDesire.trim())return; setDesires([{id:Date.now(),desire:newDesire,status:"in_progress",track:ct?.title||null,trackCat:ct?.cat||null,days:0,signs:[]},...desires]); setNewDesire(""); };
  const addSign = (id,sign) => { if(!sign.trim())return; setDesires(desires.map(d=>d.id===id?{...d,signs:[...d.signs,sign]}:d)); setNewSign(p=>({...p,[id]:""})); };
  const markManifested = id => setDesires(desires.map(d=>d.id===id?{...d,status:"manifested"}:d));
  const undoManifested = id => setDesires(desires.map(d=>d.id===id?{...d,status:"in_progress"}:d));
  const signSuggestions = ["Saw a number sequence","Dreamed about it","Someone mentioned it","Found money unexpectedly","Received a surprise message","Felt calm certainty","Overheard a conversation"];
  const tabs = [{id:"audios",icon:"▶",label:"Audios"},{id:"tracker",icon:"✦",label:"Tracker"},{id:"account",icon:"◎",label:"Account"}];

  return (
    <div style={{ minHeight:"100vh", background:C.black }} className="fade">
      <div style={{ borderBottom:`1px solid ${C.border}`, padding:"0 18px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between", background:"#030200", position:"sticky", top:0, zIndex:50 }}>
        <button onClick={onSignOut} style={{ background:"none", border:"none", cursor:"pointer" }}>
          <span className="wm" style={{ fontSize:19, background:`linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Self Hypnosis Goddess</span>
        </button>
        {userTier==="goddess"?<div style={{ padding:"5px 14px", background:"#1a0a04", border:`1px solid ${C.gold}44`, borderRadius:20, fontSize:14, color:C.gold, fontWeight:700 }}>Goddess ✦</div>
          :<button onClick={onUpgrade} style={{ padding:"5px 14px", background:"none", border:`1px solid ${C.rose}44`, borderRadius:20, fontSize:14, color:C.rose, fontWeight:700, cursor:"pointer" }}>Upgrade ↑</button>}
      </div>
      <div className="desk-tabs" style={{ display:"flex", borderBottom:`1px solid ${C.border}`, background:"#050300", position:"sticky", top:60, zIndex:49 }}>
        {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1, padding:"15px 8px", background:"none", border:"none", borderBottom:`3px solid ${tab===t.id?C.gold:"transparent"}`, color:tab===t.id?C.gold:C.muted, fontSize:16, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", cursor:"pointer" }}>{t.label}</button>)}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", borderBottom:`1px solid ${C.border}`, background:"#060400" }}>
        {[{v:tracks.filter(t=>canPlay(t)).length,l:"Tracks",c:C.text2,sub:"in vault"},{v:desires.length,l:"Intentions",c:C.gold,sub:"set"},{v:manifested,l:"Manifested",c:C.rose,sub:`${inProgress} active`},{v:"14d",l:"Streak",c:C.green,sub:"daily"}].map((s,i)=>(
          <div key={i} style={{ padding:"14px 8px", textAlign:"center", borderRight:i<3?`1px solid ${C.border}`:"none" }}>
            <div style={{ fontSize:28, fontWeight:800, color:s.c, lineHeight:1, marginBottom:3 }}>{s.v}</div>
            <div style={{ fontSize:13, color:C.text2, fontWeight:700 }}>{s.l}</div>
            <div style={{ fontSize:12, color:C.muted }}>{s.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", minHeight:"calc(100vh - 150px)" }}>
        <div className="sidebar" style={{ width:210, borderRight:`1px solid ${C.border}`, background:"#040200", flexShrink:0, position:"sticky", top:140, height:"calc(100vh - 140px)", overflowY:"auto", padding:"16px 10px" }}>
          {cats.map(c=>(
            <button key={c.id} onClick={()=>{setActiveCat(c.id);setTab("audios");}} style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"11px 14px", borderRadius:10, border:"none", background:activeCat===c.id&&tab==="audios"?(catColors[c.id]||C.gold)+"18":"none", cursor:"pointer", marginBottom:4, textAlign:"left" }}>
              <div style={{ width:10, height:10, borderRadius:"50%", background:catColors[c.id]||C.gold, flexShrink:0, opacity:activeCat===c.id&&tab==="audios"?1:0.3 }} />
              <span style={{ fontSize:16, fontWeight:600, color:activeCat===c.id&&tab==="audios"?catColors[c.id]||C.gold:C.muted }}>{c.label}</span>
            </button>
          ))}
          <div style={{ height:1, background:C.border, margin:"14px 0" }} />
          {tabs.filter(t=>t.id!=="audios").map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{ width:"100%", display:"flex", alignItems:"center", gap:12, padding:"11px 14px", borderRadius:10, border:"none", background:tab===t.id?C.gold+"18":"none", cursor:"pointer", marginBottom:4 }}>
              <span style={{ fontSize:18 }}>{t.icon}</span>
              <span style={{ fontSize:16, fontWeight:600, color:tab===t.id?C.gold:C.muted }}>{t.label}</span>
            </button>
          ))}
        </div>
        <div className="portal-pb" style={{ flex:1, padding:"20px 18px 36px", maxWidth:740, overflowX:"hidden" }}>
          {tab==="audios"&&(
            <div className="fade">
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tracks..." style={{ marginBottom:16 }} />
              <div style={{ display:"flex", gap:8, overflowX:"auto", marginBottom:18, paddingBottom:4 }}>
                {cats.map(c=><button key={c.id} onClick={()=>setActiveCat(c.id)} style={{ padding:"8px 16px", borderRadius:20, border:`1.5px solid ${activeCat===c.id?catColors[c.id]||C.gold:C.border}`, background:activeCat===c.id?(catColors[c.id]||C.gold)+"18":"none", color:activeCat===c.id?catColors[c.id]||C.gold:C.muted, fontSize:15, cursor:"pointer", whiteSpace:"nowrap", minHeight:40, fontWeight:600 }}>{c.label}</button>)}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {filtered.map(t=>{
                  const isP=playing===t.id, can=canPlay(t), color=catColors[t.cat]||C.gold;
                  return (
                    <div key={t.id} onClick={()=>can&&setPlaying(isP?null:t.id)}
                      style={{ display:"flex", alignItems:"center", gap:14, padding:"15px 16px", background:isP?C.card2:C.card, border:`1px solid ${isP?color+"66":C.border}`, borderRadius:12, cursor:can?"pointer":"default", opacity:can?1:0.4, transition:"all 0.2s" }}
                      onMouseEnter={e=>can&&!isP&&(e.currentTarget.style.borderColor=color+"44")}
                      onMouseLeave={e=>can&&!isP&&(e.currentTarget.style.borderColor=C.border)}>
                      <div style={{ width:10, height:10, borderRadius:"50%", background:color, flexShrink:0, opacity:0.8 }} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                          <span style={{ fontSize:17, fontWeight:600, color:isP?color:C.text2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.title}</span>
                          {t.isNew&&<span style={{ fontSize:11, padding:"2px 8px", background:C.rose+"22", color:C.rose, borderRadius:10, fontWeight:700, flexShrink:0 }}>NEW</span>}
                        </div>
                        <div style={{ fontSize:14, color:C.dim }}>{t.freq} · {t.type}{!can?" · Goddess only":""} · {t.dur}</div>
                      </div>
                      <div style={{ width:40, height:40, borderRadius:"50%", background:isP?color+"22":"#080600", border:`1.5px solid ${isP?color:C.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        {!can?<span style={{ fontSize:16 }}>🔒</span>:isP?<div className="sw" style={{ display:"flex",alignItems:"center",gap:2 }}><span/><span/><span/><span/><span/></div>:<span style={{ fontSize:16, color:C.muted }}>▶</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {tab==="tracker"&&(
            <div className="fade">
              {userTier!=="goddess"?(
                <div style={{ textAlign:"center", padding:"70px 20px" }}>
                  <div style={{ fontSize:56, marginBottom:18 }}>✦</div>
                  <div className="wm" style={{ fontSize:34, color:C.text, marginBottom:12 }}>ProofOS</div>
                  <p style={{ fontSize:18, color:C.muted, marginBottom:32, lineHeight:1.75 }}>Log your desires. Link them to your audio.<br/>Watch the proof accumulate in real time.</p>
                  <Btn onClick={onUpgrade}>Upgrade to Goddess — €33/month</Btn>
                </div>
              ):(
                <div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:18 }}>
                    {[{v:manifested,l:"Manifested",c:C.rose,sub:"desires complete"},{v:inProgress,l:"In progress",c:C.gold,sub:"currently active"},{v:desires.reduce((a,d)=>a+d.signs.length,0),l:"Signs logged",c:C.green,sub:"synchronicities"}].map((s,i)=>(
                      <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:"18px 16px", textAlign:"center" }}>
                        <div style={{ fontSize:36, fontWeight:800, color:s.c, lineHeight:1, marginBottom:6 }}>{s.v}</div>
                        <div style={{ fontSize:16, color:C.text2, fontWeight:700, marginBottom:3 }}>{s.l}</div>
                        <div style={{ fontSize:13, color:C.muted }}>{s.sub}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:18, marginBottom:16 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                      <span style={{ fontSize:17, fontWeight:700, color:C.text }}>Manifestation rate</span>
                      <span style={{ fontSize:17, color:C.gold, fontWeight:800 }}>{manifested}/{desires.length} · {Math.round((manifested/desires.length)*100)}%</span>
                    </div>
                    <div style={{ height:8, background:C.border, borderRadius:4 }}>
                      <div style={{ width:`${(manifested/desires.length)*100}%`, height:"100%", background:`linear-gradient(90deg,${C.gold},${C.rose})`, borderRadius:4, transition:"width 0.6s" }} />
                    </div>
                  </div>
                  <div style={{ background:"linear-gradient(135deg,#0a0600,#0d0a00)", border:`1px solid ${C.gold}44`, borderRadius:14, padding:22, marginBottom:16 }}>
                    <div style={{ fontSize:12, color:C.gold, letterSpacing:"0.2em", textTransform:"uppercase", fontWeight:800, marginBottom:14 }}>How to listen · Your guide</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
                      {[{t:"Best time to listen",b:"First thing on waking — before your feet touch the floor. Last thing at night — at the threshold of sleep. Your subconscious is most receptive in alpha and theta states."},{t:"How often",b:"Daily is ideal. Consistency creates the installation. Missing a day won't undo it. Think of it like watering a seed — the more consistent you are, the faster it grows."},{t:"SATs — State Akin to Sleep",b:"The most powerful state for reprogramming. On the edge of sleep, your critical mind is down. This is when the new self-concept installs deepest. Use the sleep tracks overnight."},{t:"Headphones or speakers?",b:"Headphones required for binaural beats and bilateral EMDR tracks. Speakers work for subliminals only. Check the track description for guidance."}].map((g,i)=>(
                        <div key={i} style={{ background:"#060400", borderRadius:10, padding:14, border:`1px solid ${C.border}` }}>
                          <div style={{ fontSize:15, fontWeight:700, color:C.gold, marginBottom:8 }}>{g.t}</div>
                          <div style={{ fontSize:14, color:C.muted, lineHeight:1.75 }}>{g.b}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:18, marginBottom:16 }}>
                    <div style={{ fontSize:14, color:C.muted, letterSpacing:"0.15em", textTransform:"uppercase", fontWeight:700, marginBottom:12 }}>Log a new intention</div>
                    <input value={newDesire} onChange={e=>setNewDesire(e.target.value)} placeholder="State it in present tense — I am, I have, I receive..." style={{ marginBottom:12 }} onKeyDown={e=>e.key==="Enter"&&addDesire()} />
                    {ct&&<div style={{ fontSize:15, color:C.muted, marginBottom:12 }}>Will link to: <span style={{ color:C.gold, fontWeight:700 }}>{ct.title}</span></div>}
                    <Btn full small onClick={addDesire} disabled={!newDesire.trim()}>Add intention +</Btn>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    {desires.map(d=>{
                      const color=catColors[d.trackCat]||C.gold;
                      return (
                        <div key={d.id} style={{ background:C.card, border:`1px solid ${d.status==="manifested"?"#2a4a2a":C.border}`, borderRadius:14, overflow:"hidden" }}>
                          <div style={{ padding:"16px 18px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }} onClick={()=>setExpanded(expanded===d.id?null:d.id)}>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ fontSize:19, fontWeight:700, color:C.text2, marginBottom:6 }}>{d.desire}</div>
                              {d.track&&<div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}><span style={{ fontSize:16 }}>🎧</span><span style={{ fontSize:15, color, fontWeight:600 }}>{d.track}</span>{d.days>0&&<span style={{ fontSize:14, color:C.dim }}>· {d.days}d</span>}</div>}
                              {d.signs.length>0&&<div style={{ fontSize:14, color:C.muted }}>✦ {d.signs.length} sign{d.signs.length!==1?"s":""} logged</div>}
                            </div>
                            <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:10, flexShrink:0 }}>
                              {d.status==="manifested"?(
                                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                                  <span style={{ padding:"5px 12px", background:"#1a3a1a", color:C.green, borderRadius:20, fontSize:14, fontWeight:700 }}>✓ manifested</span>
                                  <button onClick={e=>{e.stopPropagation();undoManifested(d.id);}} style={{ padding:"5px 10px", background:"none", border:`1px solid ${C.border}`, borderRadius:8, color:C.dim, fontSize:13, cursor:"pointer" }}>undo</button>
                                </div>
                              ):(
                                <button onClick={e=>{e.stopPropagation();markManifested(d.id);}} style={{ padding:"5px 14px", background:"none", border:`1px solid ${C.gold}55`, borderRadius:20, color:C.gold, fontSize:14, fontWeight:700, cursor:"pointer" }}>mark done ✓</button>
                              )}
                              <span style={{ fontSize:13, color:C.dim }}>{expanded===d.id?"▲":"▼ signs"}</span>
                            </div>
                          </div>
                          {expanded===d.id&&(
                            <div style={{ borderTop:`1px solid ${C.border2}`, padding:"16px 18px", background:"#060400" }}>
                              <div style={{ fontSize:13, color:C.muted, letterSpacing:"0.15em", textTransform:"uppercase", fontWeight:700, marginBottom:12 }}>Signs & synchronicities</div>
                              {d.signs.length===0&&<div style={{ fontSize:16, color:C.dim, marginBottom:14 }}>No signs logged yet. The universe is already moving.</div>}
                              {d.signs.map((s,i)=><div key={i} style={{ fontSize:16, color:C.muted, paddingLeft:18, position:"relative", marginBottom:8 }}><span style={{ position:"absolute", left:0, color:C.gold }}>·</span>{s}</div>)}
                              {d.status!=="manifested"&&(
                                <div style={{ marginTop:14 }}>
                                  <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:12 }}>
                                    {signSuggestions.slice(0,4).map((s,i)=><button key={i} onClick={()=>addSign(d.id,s)} style={{ padding:"6px 14px", background:"none", border:`1px solid ${C.border}`, borderRadius:20, color:C.muted, fontSize:14, cursor:"pointer" }}>{s}</button>)}
                                  </div>
                                  <div style={{ display:"flex", gap:10 }}>
                                    <input value={newSign[d.id]||""} onChange={e=>setNewSign(p=>({...p,[d.id]:e.target.value}))} placeholder="Log a sign..." style={{ flex:1 }} onKeyDown={e=>e.key==="Enter"&&addSign(d.id,newSign[d.id]||"")} />
                                    <Btn small onClick={()=>addSign(d.id,newSign[d.id]||"")} disabled={!newSign[d.id]?.trim()}>Add</Btn>
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
          {tab==="account"&&(
            <div className="fade" style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:22 }}>
                <div style={{ fontSize:13, color:C.muted, letterSpacing:"0.15em", textTransform:"uppercase", fontWeight:700, marginBottom:16 }}>Your account</div>
                <div style={{ fontSize:15, color:C.muted, marginBottom:4 }}>Plan</div>
                <div style={{ fontSize:20, fontWeight:700, color:userTier==="goddess"?C.gold:C.text2, marginBottom:16 }}>{userTier==="goddess"?"Goddess Tier · €33/month":"Audio Tier · €19/month"}</div>
                <div style={{ fontSize:16, color:"#7a6a4a", lineHeight:1.9, marginBottom:16 }}>No refunds after 14 days · Cancel before renewal</div>
                <Btn small outline onClick={()=>{}}>Manage billing ↗</Btn>
              </div>
              {userTier==="audio"&&<div onClick={onUpgrade} style={{ background:"#0a0500", border:`1.5px solid ${C.gold}44`, borderRadius:14, padding:22, cursor:"pointer" }}>
                <div style={{ fontSize:13, color:C.rose, letterSpacing:"0.15em", textTransform:"uppercase", fontWeight:700, marginBottom:8 }}>Upgrade</div>
                <div style={{ fontSize:20, fontWeight:700, color:C.text, marginBottom:6 }}>Goddess Tier — €33/month</div>
                <div style={{ fontSize:16, color:C.muted }}>Unlock ProofOS tracker + early access →</div>
              </div>}
              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:22 }}>
                <div style={{ fontSize:16, color:"#7a6a4a", lineHeight:1.9 }}>iPhone: tap Share → "Add to Home Screen"<br/>Plays in background like Spotify when locked<br/>No App Store download needed</div>
              </div>
              <div style={{ display:"flex", gap:14 }}>
                {[["YouTube","https://www.youtube.com/@Reshma.Oracle"],["Instagram","https://www.instagram.com/reshma.oracle/"]].map(([l,u])=><a key={l} href={u} target="_blank" rel="noopener noreferrer" style={{ flex:1, padding:16, background:C.card, border:`1px solid ${C.border}`, borderRadius:10, color:C.muted, fontSize:16, textAlign:"center", textDecoration:"none" }}>{l} →</a>)}
              </div>
              <button onClick={onSignOut} style={{ padding:16, background:"none", border:`1px solid ${C.border}`, borderRadius:10, color:C.muted, fontSize:17, cursor:"pointer", minHeight:52 }}>Sign out</button>
            </div>
          )}
        </div>
      </div>
      <div className="mob-nav" style={{ position:"fixed", bottom:0, left:0, right:0, background:"#050300", borderTop:`1px solid ${C.border}`, zIndex:200, paddingBottom:"env(safe-area-inset-bottom,8px)" }}>
        {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1, padding:"11px 8px", background:"none", border:"none", color:tab===t.id?C.gold:C.muted, fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:5, minHeight:58, letterSpacing:"0.08em", textTransform:"uppercase" }}><span style={{ fontSize:22 }}>{t.icon}</span>{t.label}</button>)}
      </div>
      {playing&&ct&&(
        <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"rgba(6,4,0,0.97)", borderTop:`1px solid ${C.gold}44`, padding:"12px 18px", zIndex:100, backdropFilter:"blur(20px)" }}>
          <div style={{ maxWidth:900, margin:"0 auto" }}>
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:10 }}>
              <div style={{ width:10, height:10, borderRadius:"50%", background:catColors[ct.cat]||C.gold, flexShrink:0 }} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:17, fontWeight:700, color:C.gold, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{ct.title}</div>
                <div style={{ fontSize:14, color:C.dim }}>{ct.type} · {loop?"Loop on":"Loop off"} · Sleep: {sleep?`${sleep}m`:"off"}</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:14, flexShrink:0 }}>
                <button onClick={()=>setLoop(!loop)} style={{ background:"none", border:"none", fontSize:22, color:loop?C.gold:C.dim, cursor:"pointer" }}>↻</button>
                <button onClick={()=>setPlaying(null)} style={{ width:44, height:44, borderRadius:"50%", background:`linear-gradient(135deg,${C.gold},${C.rose})`, border:"none", color:"#000", fontSize:20, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>⏸</button>
                <button onClick={()=>setSleep(s=>s===60?30:s===30?0:60)} style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:8, padding:"6px 12px", color:sleep?C.gold:C.dim, fontSize:14, cursor:"pointer" }}>{sleep?`${sleep}m`:"∞"}</button>
              </div>
            </div>
            <div style={{ height:4, background:C.border, borderRadius:2, cursor:"pointer" }} onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setProgress(Math.round(((e.clientX-r.left)/r.width)*100));}}>
              <div style={{ width:`${progress}%`, height:"100%", background:`linear-gradient(90deg,${C.gold},${C.rose})`, borderRadius:2 }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
