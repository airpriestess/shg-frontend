import { useState, useRef, useEffect } from "react";
import { CSS, T } from "./design/tokens.js";
import { Btn, Card, Rings, WaveForm, Pill, Modal, FormField, Label, ProgressBar } from "./components/UI.jsx";
import AudioVault from "./pages/AudioVault.jsx";
import ProofThreads from "./pages/ProofThreads.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import VaultSettings from "./pages/VaultSettings.jsx";
import ProofWall from "./pages/ProofWall.jsx";
import ListeningGuide from "./pages/ListeningGuide.jsx";
import CreateThreadModal from "./components/CreateThreadModal.jsx";
import { PhotoProofModal, VoiceProofModal } from "./components/ProofUpload.jsx";
import { requestNotificationPermission, scheduleReminders } from "./utils/notifications.js";
import { createClient as _sbClient } from "@supabase/supabase-js";

const FREE_TRACK_URL = "https://qtwvslrwmreazmrdktsn.supabase.co/storage/v1/object/public/tracks/COMPRESS%2010%20YEARS%20OF%20DELAY%20INTO%20ONE%20HOUR%20EMDR%20THEN%20ECHO%2007.04.2026.mp3";

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [userTier, setUserTier] = useState("goddess");
  const [playingId, setPlayingId] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [portalTab, setPortalTab] = useState("dashboard");
  const [createThreadModal, setCreateThreadModal] = useState(false);
  const [preselectedAudioId, setPreselectedAudioId] = useState(null);
  const [addProofType, setAddProofType] = useState(null);
  const [addProofThreadId, setAddProofThreadId] = useState(null);
  const [onboardTier, setOnboardTier] = useState("audio");

  const goPortal = async (tier) => {
    if (tier) setUserTier(tier);
    setScreen("portal");
    setPortalTab("dashboard");
    // Request notification permission and schedule reminders
    const perm = await requestNotificationPermission();
    if (perm === "granted") scheduleReminders();
  };
  const openCreateThread = (audioId) => { setPreselectedAudioId(audioId || null); setCreateThreadModal(true); };
  const openAddProof = (type, threadId) => { setAddProofType(type); setAddProofThreadId(threadId || null); };
  const playAudio = (a) => { setCurrentAudio(a); setPlayingId(a.id); };
  const navigate = (tab) => setPortalTab(tab);

  return (
    <>
      <style>{CSS}</style>
      {screen === "landing" && <Landing onJoin={(t) => {
          if (t === "audio") window.open("https://buy.stripe.com/8x2bJ1c3L2jQ2lb5CU7AI00", "_blank");
          else if (t === "goddess") window.open("https://buy.stripe.com/6oUfZh3xfcYu5xn4yQ7AI01", "_blank");
          else if (t === "founder") window.open("https://buy.stripe.com/00w8wP2tbgaG3pffdu7AI02", "_blank");
          else window.open("https://buy.stripe.com/8x2bJ1c3L2jQ2lb5CU7AI00", "_blank");
        }} onDemo={() => goPortal("goddess")} />}
      {screen === "portal" && (
        <AppShell
          userTier={userTier} tab={portalTab} setTab={setPortalTab}
          onSignOut={() => setScreen("landing")} onUpgrade={() => setScreen("landing")}
          currentAudio={currentAudio} playingId={playingId}
          onStopPlay={() => { setPlayingId(null); }}
          onCreateThread={openCreateThread}
          onAddProof={openAddProof}
          onNavigate={navigate}
          onPlayAudio={playAudio}
        />
      )}
      <CreateThreadModal open={createThreadModal} onClose={() => setCreateThreadModal(false)} preselectedAudioId={preselectedAudioId} />
      <PhotoProofModal
        open={addProofType === "Photo Proof"}
        onClose={() => { setAddProofType(null); setAddProofThreadId(null); }}
        threadId={addProofThreadId}
        audioTitle={currentAudio?.title}
      />
      <VoiceProofModal
        open={addProofType === "Voice Proof"}
        onClose={() => { setAddProofType(null); setAddProofThreadId(null); }}
        threadId={addProofThreadId}
        audioTitle={currentAudio?.title}
      />
      <SignModal
        open={addProofType === "Sign" || addProofType === "Symptom" || addProofType === "Synchronicity"}
        type={addProofType}
        onClose={() => { setAddProofType(null); setAddProofThreadId(null); }}
        threadId={addProofThreadId}
      />
    </>
  );
}

/* ── APP SHELL ─────────────────────────────────────────────────────────────── */
function AppShell({ userTier, tab, setTab, onSignOut, onUpgrade, currentAudio, playingId, onStopPlay, onCreateThread, onAddProof, onNavigate, onPlayAudio }) {
  const NAV = [
    { id: "dashboard", icon: "◎", label: "Dashboard" },
    { id: "audio-vault", icon: "🎧", label: "Audio Vault" },
    { id: "proof-threads", icon: "🧵", label: "Proof Threads" },
    { id: "proof-wall", icon: "📷", label: "Proof Wall" },
    { id: "listening-guide", icon: "📖", label: "Listening Guide" },
    { id: "vault-settings", icon: "⚙", label: "Vault Settings" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      {/* TOP NAV */}
      <header style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", background: "rgba(0,0,0,0.96)", borderBottom: "1px solid #1e1c0a", flexShrink: 0, zIndex: 50 }}>
        <button onClick={onSignOut} style={{ background: "none", border: "none", cursor: "pointer" }} title="Back to homepage">
          <span className="wm" style={{ fontSize: 20, background: `linear-gradient(90deg, ${T.champagne}, ${T.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" , cursor: "pointer" }} onClick={() => window.scrollTo({top:0,behavior:"smooth"})}>Self Hypnosis Goddess</span>
        </button>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {userTier === "goddess" || userTier === "founder"
            ? <Pill color="champagne">{userTier === "founder" ? "Founder ✦" : "Goddess ✦"}</Pill>
            : <Btn size="sm" variant="champagne" onClick={onUpgrade}>Unlock Goddess Vault</Btn>}
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* SIDEBAR */}
        <aside className="hide-mob" style={{ width: 220, background: "#040200", borderRight: "1px solid #1e1c0a", padding: "20px 12px", display: "flex", flexDirection: "column", gap: 4, flexShrink: 0, overflowY: "auto" }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, border: "none", background: tab === n.id ? T.gold + "18" : "transparent", cursor: "pointer", textAlign: "left", width: "100%" }}>
              <span style={{ fontSize: 16 }}>{n.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 300, color: tab === n.id ? T.gold : T.textMuted }}>{n.label}</span>
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <Btn size="sm" variant="ghost" full onClick={onSignOut} style={{ marginTop: 12 }}>Sign out</Btn>
        </aside>

        {/* MAIN CONTENT */}
        <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>
            {tab === "dashboard" && <Dashboard userTier={userTier} onNavigate={n => setTab(n)} onAddProof={onAddProof} onCreateThread={onCreateThread} />}
            {tab === "audio-vault" && <AudioVault userTier={userTier} onCreateThread={onCreateThread} onPlayAudio={playAudio => { setTab("audio-vault"); onPlayAudio(playAudio); }} playingId={playingId} onUpgrade={onUpgrade} />}
            {tab === "proof-threads" && <ProofThreads onAddProof={onAddProof} onCreateThread={onCreateThread} />}
            {tab === "proof-wall" && <ProofWall onAddProof={onAddProof} />}
            {tab === "listening-guide" && <ListeningGuide />}
            {tab === "vault-settings" && <VaultSettings userTier={userTier} onSignOut={onSignOut} onUpgrade={onUpgrade} />}
          </div>

          {/* NOW PLAYING BAR */}
          {currentAudio && (
            <div style={{ height: 60, background: "rgba(0,0,0,0.97)", borderTop: "1px solid #B76E7933", display: "flex", alignItems: "center", padding: "0 20px", gap: 16, flexShrink: 0 }}>
              <WaveForm playing color={T.champagne} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.champagne, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentAudio.title}</div>
                <div style={{ fontSize: 11, color: T.textFaint }}>{(currentAudio.audioFormats || []).join(' · ')}{currentAudio.frequency ? ` · ${currentAudio.frequency}` : ''}</div>
              </div>
              <button onClick={onStopPlay} style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${T.blood}, ${T.rose})`, border: "none", color: "#fff", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>⏸</button>
            </div>
          )}
        </main>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <nav className="mob-nav" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.97)", borderTop: "1px solid #1e1c0a", zIndex: 200, paddingBottom: "env(safe-area-inset-bottom,8px)", display: "none" }}>
        {NAV.filter(n => n.id !== "proof-wall" && n.id !== "vault-settings").concat({ id: "vault-settings", icon: "⚙", label: "Settings" }).map(n => (
          <button key={n.id} onClick={() => setTab(n.id)} style={{ flex: 1, padding: "9px 4px", background: "none", border: "none", color: tab === n.id ? T.gold : T.textMuted, fontSize: 10, fontWeight: 300, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minHeight: 52, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            <span style={{ fontSize: 18 }}>{n.icon}</span>
            <span>{n.label.split(" ")[0]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

function ArchivePage() {
  const { PROOF_THREADS } = { PROOF_THREADS: [] };
  return (
    <div style={{ padding: "28px 24px", overflowY: "auto", height: "100%", width: "100%" }} className="fade mob-pb">
      <h1 style={{ fontSize: 28, fontWeight: 700, color: T.textPrimary, marginBottom: 8 }}>Manifested Archive</h1>
      <p style={{ fontSize: 15, color: T.textMuted, marginBottom: 24 }}>Every completed Proof Thread lives here. Your permanent record of proof.</p>
      <div style={{ textAlign: "center", padding: "60px 24px" }}>
        <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.4 }}>✦</div>
        <div style={{ fontSize: 16, color: T.textMuted }}>Manifested threads will appear here.</div>
      </div>
    </div>
  );
}

/* ── ADD PROOF MODAL (quick capture) ──────────────────────────────────────── */
/* ── LANDING PAGE ─────────────────────────────────────────────────────────── */
function Landing({ onJoin, onDemo }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [billing, setBilling] = useState("monthly");
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play().catch(() => {}); setPlaying(true); }
  };

  useEffect(() => {
    const a = audioRef.current; if (!a) return;
    const upd = () => setProgress((a.currentTime / a.duration) * 100 || 0);
    const end = () => { setPlaying(false); setProgress(0); };
    a.addEventListener("timeupdate", upd); a.addEventListener("ended", end);
    return () => { a.removeEventListener("timeupdate", upd); a.removeEventListener("ended", end); };
  }, []);

  const cats = [
    { label: "Lovemaxxing", tagline: "He's obsessed. Of course he is.", color: T.rose },
    { label: "Moneymaxxing", tagline: "Money finds you first. Obviously.", color: T.champagne },
    { label: "Beautymaxxing", tagline: "Gorgeous is your default.", color: T.champSoft },
    { label: "Lifemaxxing", tagline: "Highest timeline. Activated.", color: T.textSecondary },
    { label: "DNA Shifting", tagline: "Your bloodline remembers.", color: "#9a8ad0" },
    { label: "Sleep Shifting", tagline: "You shift while you sleep.", color: "#7a9ab0" },
  ];

  // Comparison section heading explanation is added in JSX below
  const compRows = [
    { old: "I have to work hard to receive money.", neu: "Money found me without effort.", proof: "€2,000 refund arrived out of nowhere. Day 6.", cat: "Money" },
    { old: "He has moved on. I need to accept it.", neu: "He is already on his way back.", proof: "He texted first after 3 weeks of silence. Day 9.", cat: "SP & Love" },
    { old: "I don't feel beautiful unless someone tells me.", neu: "I feel gorgeous from the inside. The mirror confirmed it.", proof: "Woke up and felt it before I even looked. Day 4.", cat: "Beauty" },
    { old: "I've tried scripting, affirmations, vision boards. Nothing sticks.", neu: "I stopped trying. The subconscious installed it while I slept.", proof: "Stopped forcing it. It arrived anyway.", cat: "Identity" },
    { old: "I've been visualising for months. Still waiting.", neu: "One listen changed how I felt about it. Then it moved.", proof: "Felt the shift after the first audio. Evidence followed.", cat: "Identity" },
  ];

  const faqs = [
    { q: "What is self hypnosis?", a: "Hypnosis bypasses the critical conscious mind and speaks directly to the subconscious. In a deeply relaxed theta state, your subconscious accepts new beliefs as true — at the identity level. Reshma's voice guides you into that state. The reprogramming happens while you are in it." },
    { q: "What is a subliminal?", a: "Subliminal audios layer affirmations beneath music or sound at a frequency your conscious mind cannot detect — but your subconscious hears clearly. No mental resistance. No filtering. The new belief goes straight in. Most effective when listened to repeatedly, especially during sleep." },
    { q: "Why include both?", a: "Some self hypnosis tracks include subliminal layers beneath the voice — working on two levels simultaneously. The hypnosis creates the open channel. The subliminals reinforce the new identity beneath it. Together, they reprogram faster and more deeply than either alone." },
    { q: "How often should I listen?", a: "Daily is ideal. First thing on waking or last thing at night — when your subconscious is most receptive in alpha and theta states. Results depend on your belief system and how consistently you listen. Some shift in days. Some in weeks. Every person and every topic is different." },
    { q: "What is SATs?", a: "State Akin to Sleep — the threshold between waking and sleep. Your critical mind is offline. The subconscious is fully open. This is the most powerful state for identity installation. The sleep tracks are designed to work in this state." },
    { q: "Does it play in background?", a: "Yes. Add to Home Screen on iPhone or Android and it plays in background like Spotify. No app download needed. No ads. No interruptions at 3am." },
  ];

  const TECH_ROWS = [
    { t: "Self Hypnosis", w: "Guided induction — Reshma's voice", d: "Bypasses conscious resistance. Opens the subconscious.", when: "Theta state · 4–8 Hz" },
    { t: "Subliminals", w: "Affirmations layered beneath sound", d: "Delivers the new self-concept without conscious filtering.", when: "Any state · most powerful during sleep" },
    { t: "Binaural Beats", w: "Two frequencies — one per ear", d: "Entrains the brain to theta or delta — full receptivity.", when: "Headphones required · begins within minutes" },
    { t: "EMDR (bilateral)", w: "Bilateral audio stimulation", d: "Dissolves old beliefs and identity blocks at depth.", when: "During the audio session" },
    { t: "Reiki / Energy", w: "Encoded energetic frequency", d: "Raises the energetic vibration — activates alignment.", when: "Present throughout every track" },
    { t: "Solfeggio", w: "432hz · 528hz · 963hz", d: "432hz: harmony · 528hz: DNA repair · 963hz: activation", when: "Stated per track" },
  ];

  return (
    <div className="hypno-bg" style={{ background: "#000000", minHeight: "100vh" }}>
      <audio ref={audioRef} src={FREE_TRACK_URL} preload="none" />

      {/* ANNOUNCEMENT BANNER */}
      {!menuOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 400, background: "linear-gradient(90deg,#d4a090,#B76E79)", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 300, color: "#000", letterSpacing: "0.12em" }}>
            ✦ &nbsp; EARLY BIRD LIFETIME ACCESS &nbsp;·&nbsp; €500 once, forever &nbsp;·&nbsp; 1,000 spots only
          </span>
          <button onClick={() => window.open("https://buy.stripe.com/00w8wP2tbgaG3pffdu7AI02", "_blank")} style={{ padding: "5px 14px", background: "#000", border: "none", borderRadius: 20, color: "#B76E79", fontSize: 12, fontWeight: 800, cursor: "pointer", flexShrink: 0 }}>
            Claim yours
          </button>
        </div>
      )}

      {/* NAV */}
      <nav style={{ position: "fixed", top: 40, left: 0, right: 0, zIndex: 300, height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", background: "rgba(0,0,0,0.96)", borderBottom: "1px solid #1e1c0a", backdropFilter: "blur(20px)" }}>
        <span className="wm" style={{ fontSize: 20, background: `linear-gradient(90deg, ${T.champagne}, ${T.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Self Hypnosis Goddess</span>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Btn size="sm" variant="ghost" onClick={onDemo} style={{ display: "none" }}>See Dashboard</Btn>
          <button onClick={() => onJoin("audio")} style={{ padding: "11px 28px", background: "linear-gradient(135deg,#d4a090,#B76E79)", border: "none", borderRadius: 22, color: "#000", fontSize: 14, fontWeight: 800, cursor: "pointer", letterSpacing: "0.03em", boxShadow: "0 0 32px rgba(183,110,121,0.7), 0 0 64px rgba(183,110,121,0.3)" }}>Join now ✦</button>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "1px solid rgba(215,185,130,0.14)", borderRadius: 8, padding: "8px 10px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 3 }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 16, height: 1.5, background: T.textMuted }} />)}
          </button>
        </div>
        {menuOpen && (
          <div style={{ position: "absolute", top: 58, right: 24, background: "#0a0800", border: "1px solid #1e1c0a", borderRadius: 14, padding: 10, minWidth: 200, zIndex: 400, boxShadow: "0 24px 60px rgba(0,0,0,0.8)" }}>
            {[["Preview Dashboard", onDemo], ["YouTube ↗", () => window.open("https://www.youtube.com/@Reshma.Oracle","_blank")], ["Instagram ↗", () => window.open("https://www.instagram.com/reshma.oracle/","_blank")]].map(([l,fn],i) => (
              <button key={i} onClick={() => { fn(); setMenuOpen(false); }} style={{ display:"block",width:"100%",textAlign:"left",padding:"11px 16px",background:"none",border:"none",color:T.textSecondary,fontSize:14,cursor:"pointer",borderRadius:8 }}
                onMouseEnter={e=>e.currentTarget.style.background="#1a1208"}
                onMouseLeave={e=>e.currentTarget.style.background="none"}>{l}</button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <div style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 110, overflow: "hidden" }}>
        <Rings count={5} />
        {/* Dot grid overlay */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: "radial-gradient(circle, rgba(183,110,121,0.15) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
        }} />
        <div className="hero-wrap" style={{ position: "relative", zIndex: 1, textAlign: "center", paddingTop: "clamp(52px,8vw,80px)", paddingBottom: "clamp(52px,8vw,80px)" }}>
          {/* Soundwave */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, height: 56, marginBottom: 28 }}>
            {Array.from({ length: 24 }).map((_, i) => {
              const heights = [8,18,30,22,38,26,42,20,34,16,40,24,36,28,18,42,22,32,14,26,20,36,24,30];
              return <div key={i} style={{ width: 3, borderRadius: 2, height: heights[i], background: `linear-gradient(180deg,${T.champagne},${T.rose})`, animation: `wave ${0.9+(i%5)*0.15}s ease-in-out infinite`, animationDelay: `${i*0.06}s`, opacity: 0.6+(i%3)*0.12 }} />;
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 11, padding: "5px 16px", background: "#B76E7918", border: "1px solid #B76E7933", borderRadius: 20, color: "#B76E79", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" }}>✦ As seen on YouTube</span>
          </div>
          <div style={{ overflow: "hidden", marginBottom: 24, maskImage: "linear-gradient(90deg,transparent,black 8%,black 92%,transparent)", WebkitMaskImage: "linear-gradient(90deg,transparent,black 8%,black 92%,transparent)" }}>
            <div className="marquee-track" style={{ gap: "0 40px" }}>
              {["MoneyMaxxing ✦","LoveMaxxing ✦","BeautyMaxxing ✦","LifeMaxxing ✦","IdentityMaxxing ✦","SleepMaxxing ✦","DNAMaxxing ✦","MoneyMaxxing ✦","LoveMaxxing ✦","BeautyMaxxing ✦","LifeMaxxing ✦","IdentityMaxxing ✦","SleepMaxxing ✦","DNAMaxxing ✦"].map((t,i) => (
                <span key={i} style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: i%3===0?T.champagne:i%3===1?T.roseGold:T.textFaint, whiteSpace: "nowrap" }}>{t}</span>
              ))}
            </div>
          </div>

          {/* TITLE */}
          <h1 className="wm" style={{ fontSize: "clamp(30px,8vw,72px)", lineHeight: 1.0, marginBottom: 16, color: T.textPrimary }}>
            Self Hypnosis Goddess<br />
            <span style={{ background: `linear-gradient(90deg,${T.champagne},${T.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Audio Library</span>
          </h1>

          {/* TAGLINE */}
          <div style={{ fontSize: "clamp(18px,2.5vw,24px)", color: T.roseGold, fontWeight: 600, marginBottom: 10, letterSpacing: "0.01em" }}>
            Shift into your dream reality.
          </div>

          {/* WAKE UP KNOWING */}
          <div style={{ fontSize: "clamp(15px,1.8vw,18px)", color: T.textMuted, marginBottom: 32, lineHeight: 1.7 }}>
            Wake up knowing. Not hoping. <span style={{ color: T.textPrimary, fontWeight: 600 }}>Knowing.</span>
          </div>

          {/* FREE TRACK — right under heading */}
          <div style={{ background: "#0a0800", border: "1.5px solid #B76E7955", borderRadius: 20, padding: "22px 26px", maxWidth: 740, margin: "0 auto 36px", boxShadow: "0 0 40px rgba(183,110,121,0.1)" }}>
            <div style={{ fontSize: 11, color: T.roseGold, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>Audio Vault Preview</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: T.textPrimary, marginBottom: 3 }}>10 Years of Delay Into One Hour</div>
            <div style={{ fontSize: 13, color: T.textMuted, marginBottom: 18 }}>EMDR · Binaural beats · Reshma's voice · 432hz</div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button onClick={togglePlay} className={playing ? "pulse" : ""} style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg,#d4a090,#B76E79)", border: "none", color: "#000", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 700 }}>{playing ? "⏸" : "▶"}</button>
              <div style={{ flex: 1 }}>
                <div style={{ height: 4, background: "#1e1c0a", borderRadius: 2, marginBottom: 6, cursor: "pointer" }}
                  onClick={e => { const r=e.currentTarget.getBoundingClientRect(); if(audioRef.current?.duration) audioRef.current.currentTime=((e.clientX-r.left)/r.width)*audioRef.current.duration; }}>
                  <div style={{ width:`${progress}%`, height:"100%", background:"linear-gradient(90deg,#d4a090,#B76E79)", borderRadius:2 }} />
                </div>
                <div style={{ fontSize: 12, color: T.textFaint }}>{playing ? "Playing — continues in background ✦" : "Tap to listen now"}</div>
              </div>
              {playing && <WaveForm playing color="#B76E79" />}
            </div>
          </div>

          {/* PAIN POINT */}
                    {/* HERO CTA BUTTONS */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
            <button onClick={() => onJoin("audio")} style={{ padding: "16px 40px", background: "linear-gradient(135deg,#d4a090,#B76E79)", border: "none", borderRadius: 14, color: "#000", fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 0 36px rgba(183,110,121,0.55), 0 0 72px rgba(183,110,121,0.2)", letterSpacing: "0.02em" }}>
              START LISTENING ✦
            </button>
            <button onClick={() => onJoin("founder")} style={{ padding: "16px 32px", background: "transparent", border: "1.5px solid #B76E7966", borderRadius: 14, color: "#B76E79", fontSize: 16, fontWeight: 300, cursor: "pointer", letterSpacing: "0.1em" }}>
              EARLY BIRD ACCESS →
            </button>
          </div>
          <div style={{ fontSize: 13, color: T.textFaint, textAlign: "center", marginBottom: 40 }}>Audio Tier €19/mo · Goddess Tier €33/mo · Cancel anytime</div>


        </div>
      </div>

      {/* EARLY PRICING */}
      <div style={{ padding: "0 0 80px" }} className="section-wrap">
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 11, color: "#B76E79", letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 700, marginBottom: 0 }}>Simple pricing · Start today</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
          {[
            { label: "Audio Tier", price: "€19", period: "/month", desc: "Full vault. All categories. New tracks weekly.", cta: "Start listening →", stripe: "https://buy.stripe.com/8x2bJ1c3L2jQ2lb5CU7AI00", popular: false },
            { label: "Goddess Tier", price: "€33", period: "/month", desc: "Everything in Audio + ProofOS manifestation tracker.", cta: "Become Goddess →", stripe: "https://buy.stripe.com/6oUfZh3xfcYu5xn4yQ7AI01", popular: true },
            { label: "Early Bird Lifetime", price: "€500", period: "once · forever", desc: "Full vault + ProofOS + every future feature. 1,000 spots.", cta: "Claim Early Bird Access →", stripe: "https://buy.stripe.com/00w8wP2tbgaG3pffdu7AI02", popular: false },
          ].map((p, i) => (
            <div key={i} style={{ background: p.popular ? "#0f0c0a" : "#0a0908", border: p.popular ? "2px solid #B76E7966" : "1px solid #201e1c", borderRadius: 18, padding: "28px 24px", position: "relative" }}>
              {p.popular && <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(90deg,#d4a090,#B76E79)", borderRadius: 20, padding: "3px 16px", fontSize: 11, fontWeight: 800, color: "#000", whiteSpace: "nowrap" }}>Most popular</div>}
              <div style={{ fontSize: 12, color: "#B76E79", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 10 }}>{p.label}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                <span style={{ fontSize: 48, fontWeight: 800, color: "#f2ece4", lineHeight: 1 }}>{p.price}</span>
                <span style={{ fontSize: 14, color: "#786860" }}>{p.period}</span>
              </div>
              <p style={{ fontSize: 14, color: "#b09888", lineHeight: 1.7, marginBottom: 24 }}>{p.desc}</p>
              <button onClick={() => window.open(p.stripe, "_blank")} style={{ width: "100%", padding: "14px", background: p.popular ? "linear-gradient(135deg,#d4a090,#B76E79)" : "transparent", border: p.popular ? "none" : "1.5px solid #B76E7944", borderRadius: 12, color: p.popular ? "#000" : "#B76E79", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.04em" }}>{p.cta}</button>
            </div>
          ))}
        </div>
      </div>




      {/* LANDING PROOF WALL */}
      <div style={{ padding: "0 0 70px" }} className="section-wrap">
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 11, color: "#B76E79", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 14 }}>ProofOS · Real evidence</div>
          <h2 className="wm" style={{ fontSize: "clamp(28px,4vw,44px)", color: T.textPrimary, lineHeight: 1.15, marginBottom: 14 }}>
            Proof Wall.<br />
            <span style={{ background: "linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>The evidence captured.</span>
          </h2>
          <p style={{ fontSize: 15, color: T.textMuted, lineHeight: 1.8, maxWidth: 780, margin: "0 auto" }}>Screenshot the bank transfer. Record the moment something shifts. Log the sign. Every piece of evidence linked to the audio that preceded it.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 12 }}>
          {[
            { label: "Bank Transfer", sub: "€5,000 received · Day 8", bg: "linear-gradient(135deg,#0a1a0e,#051005)", color: "#4a9a5a", text: "€5,000", sz: 20 },
            { label: "Message Screenshot", sub: "He texted first · Day 5", bg: "linear-gradient(135deg,#1a0e12,#0e0810)", color: "#f2ece4", text: "I miss you.", sz: 13 },
            { label: "Mirror Photo", sub: "The glow · Day 14", bg: "linear-gradient(135deg,#1a0e18,#0e0812)", color: "#d4a090", text: "🪞", sz: 28 },
            { label: "Angel Number", sub: "Saw 555 three times", bg: "linear-gradient(135deg,#1a1400,#0e0e00)", color: "#d4a090", text: "5:55", sz: 22 },
            { label: "Email Proof", sub: "The opportunity arrived", bg: "linear-gradient(135deg,#0a0e14,#080810)", color: "#8a9ab0", text: "📧", sz: 26 },
            { label: "Second Transfer", sub: "Money keeps arriving", bg: "linear-gradient(135deg,#0a1a0e,#051005)", color: "#4a9a5a", text: "€2,500", sz: 18 },
          ].map((p, i) => (
            <div key={i} style={{ background: "#0a0908", border: "1px solid #201e1c", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ height: 80, background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid #201e1c" }}>
                <div style={{ fontSize: p.sz, fontWeight: 700, color: p.color }}>{p.text}</div>
              </div>
              <div style={{ padding: "10px 12px" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#B76E79", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>{p.label}</div>
                <div style={{ fontSize: 11, color: T.textMuted }}>{p.sub}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: "#0a0908", border: "1px solid #B76E7933", borderRadius: 14, padding: "14px 18px", display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "#B76E7918", border: "1px solid #B76E7933", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🎙</div>
          <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
            {[6,14,20,10,18,8,16,22,12,18,6,14,10,20,16].map((h,j) => (
              <div key={j} style={{ width: 2, height: h, borderRadius: 1, background: "linear-gradient(180deg,#d4a090,#B76E79)", opacity: 0.7 }} />
            ))}
          </div>
          <div style={{ flex: 1, marginLeft: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary, marginBottom: 2 }}>Voice Proof · Day 3</div>
            <div style={{ fontSize: 12, color: T.textMuted, fontStyle: "italic" }}>"I woke up knowing before anything happened."</div>
          </div>
        </div>
      </div>

      {/* SCIENCE */}
      <div style={{ padding: "70px 0" }} className="section-wrap">
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 12, color: T.textFaint, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 16, fontWeight: 700 }}>The science</div>
          <h2 className="wm" style={{ fontSize: "clamp(36px,6vw,68px)", color: T.textPrimary, lineHeight: 1.1, marginBottom: 22 }}>
            Your subconscious mind<br />
            <span style={{ background: `linear-gradient(90deg,${T.champagne},${T.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>creates your entire reality.</span>
          </h2>
          <p style={{ fontSize: 19, color: T.textMuted, lineHeight: 1.9, maxWidth: 1000, margin: "0 auto 16px" }}>
            Neuroscience confirms 95% of your thoughts, beliefs and behaviours are subconscious. Your self-concept — what you assume to be true about yourself, down to a DNA level — determines everything you experience. Not your desires. Your assumptions.
          </p>
          <p style={{ fontSize: 19, color: T.textMuted, lineHeight: 1.9 }}>
            You can read every book. Study Neville Goddard. Understand every theory. But theory without installation changes nothing. These audios install it — passively, at depth, while your conscious mind rests.
          </p>
        </div>

        {/* AUDIO SAMPLES */}
      <div style={{ padding: "0 0 70px" }} className="section-wrap">
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 11, color: "#B76E79", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 14 }}>Inside the vault</div>
          <h2 className="wm" style={{ fontSize: "clamp(28px,4vw,44px)", color: T.textPrimary, lineHeight: 1.15, marginBottom: 14 }}>
            Three formats.<br />
            <span style={{ background: "linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>One voice. Your subconscious.</span>
          </h2>
          <p style={{ fontSize: 15, color: T.textMuted, lineHeight: 1.8 }}>
            Melodic house for deep receptivity. Sleep subliminals for overnight installation. Vocals only for pure hypnotic induction. Reshma decides the format for each desire.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { title: "Money Finds Me First", format: "Melodic House · Spoken Hypnosis", freq: "528hz", badge: "Melodic House", badgeColor: "#d4a090", icon: "🎵", desc: "Subconscious reprogramming for receiving. Reshma's voice layered beneath melodic house music." },
            { title: "Gorgeous Is My Default Setting", format: "Sleep Subliminal", freq: "432hz", badge: "Sleep Subliminal", badgeColor: "#B76E79", icon: "🌙", desc: "8-hour overnight subliminal. Plays while you sleep. Identity installation at the deepest level." },
            { title: "He Is Already On His Way Back", format: "Vocals Only · Subliminal", freq: "432hz", badge: "Vocals Only", badgeColor: "#c8a08a", icon: "🎙", desc: "Pure voice. No music. Just Reshma's hypnotic induction and bilateral subliminal installation." },
          ].map((a, i) => (
            <div key={i} style={{ background: "#0a0908", border: "1px solid #201e1c", borderRadius: 14, padding: "16px 20px", display: "flex", gap: 14, alignItems: "center" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#B76E7944"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#201e1c"}
            >
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(135deg,#d4a09018,#B76E7918)", border: "1px solid #B76E7933", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{a.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: T.textPrimary, marginBottom: 3 }}>{a.title}</div>
                <div style={{ fontSize: 12, color: T.textMuted }}>{a.format} · {a.freq}</div>
              </div>
              <span style={{ fontSize: 10, padding: "3px 10px", background: a.badgeColor + "18", border: `1px solid ${a.badgeColor}44`, borderRadius: 20, color: a.badgeColor, fontWeight: 600, letterSpacing: "0.08em", flexShrink: 0, whiteSpace: "nowrap" }}>{a.badge}</span>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#d4a090,#B76E79)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0, opacity: 0.5 }}>▶</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 14, fontSize: 12, color: T.textFaint }}>Sample previews · Full tracks unlock in the vault</div>
      </div>

      {/* COMPARISON TABLE */}
        <div style={{ marginBottom: 70 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", marginBottom: 2 }}>
            <div style={{ background: "#0a0505", borderRadius: "14px 0 0 0", padding: "22px 30px", border: "1px solid #2a1010", borderBottom: "none", borderRight: "none" }}>
              <div style={{ fontSize: 12, color: T.danger, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>Old self-concept</div>
              <div className="wm" style={{ fontSize: 26, color: "#8a5560" }}>Running old programming</div>
            </div>
            <div style={{ background: "#080a08", borderRadius: "0 14px 0 0", padding: "22px 30px", border: `1px solid ${T.gold}33`, borderBottom: "none", borderLeft: "none" }}>
              <div style={{ fontSize: 12, color: T.champagne, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>New self-concept</div>
              <div className="wm" style={{ fontSize: 26, color: T.textSecondary }}>Reprogrammed subconscious</div>
            </div>
          </div>
          {compRows.map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", marginBottom: 1 }}>
              <div style={{ background: "#0a0900", padding: "18px 24px", border: "1px solid #1e1a08", borderRight: "none", borderBottom: "none", borderRadius: i === compRows.length-1 ? "0 0 0 14px" : 0 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ color: "#4a3030", fontSize: 16, flexShrink: 0, marginTop: 3 }}>✗</span>
                  <span style={{ fontSize: 15, color: "#786860", lineHeight: 1.75 }}>{row.old}</span>
                </div>
              </div>
              <div style={{ background: "#0c0a06", padding: "18px 24px", border: "1px solid #1e1a08", borderLeft: "none", borderBottom: "none", borderRadius: i === compRows.length-1 ? "0 0 14px 0" : 0 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
                  <span style={{ color: T.champagne, fontSize: 16, flexShrink: 0, marginTop: 2 }}>✦</span>
                  <span style={{ fontSize: 15, color: T.textPrimary, lineHeight: 1.7, fontWeight: 500 }}>{row.neu}</span>
                </div>
                {row.proof && <div style={{ fontSize: 12, color: T.roseGold, fontStyle: "italic", paddingLeft: 26, lineHeight: 1.6, marginBottom: 6 }}>"{row.proof}"</div>}
                {row.cat && <div style={{ paddingLeft: 26 }}><span style={{ fontSize: 10, padding: "2px 8px", background: "#B76E7915", border: "1px solid #B76E7933", borderRadius: 20, color: "#B76E79", fontWeight: 700, letterSpacing: "0.08em" }}>{row.cat}</span></div>}
              </div>
            </div>
          ))}
        </div>

        {/* 4 STEPS */}
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <h2 className="wm" style={{ fontSize: "clamp(32px,5vw,56px)", color: T.textPrimary, marginBottom: 10 }}>How one listen changes everything.</h2>
          <p style={{ fontSize: 18, color: T.textMuted }}>Press play. The rest happens without you.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 40px 1fr 40px 1fr 40px 1fr", gap: 0, marginBottom: 70, alignItems: "center" }}>
          {[
            { icon:"🎧", title:"Press play", body:"Works while you sleep, drive, rest. No active effort. Reshma's voice opens your subconscious.", outcome: "Nervous system relaxes" },
            null,
            { icon:"◈", title:"Old belief dissolves", body:"Your assumption that money is hard. That he won't come back. That you're not enough. All of it loosens in theta state.", outcome: "Identity updates at depth" },
            null,
            { icon:"✦", title:"Reality shifts", body:"He texts. Money arrives. Skin changes. Your outer world rearranges to match your new inner assumption. Of course it does.", outcome: "Evidence shows up" },
            null,
            { icon:"◉", title:"You capture proof", body:"Screenshot the transfer. Record your voice note. Log the sign. ProofOS stores it all. The pattern becomes undeniable.", outcome: "Proof Wall fills up" },
          ].map((s,i) => (
            s === null
              ? <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#B76E7955", textAlign: "center" }}>→</div>
              : <div key={i} style={{ background: T.cardBg, border: T.border, borderRadius: 14, padding: "36px 32px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${T.champagne},${T.rose})` }} />
                <div style={{ fontSize: 40, marginBottom: 20 }}>{s.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: T.champagne, marginBottom: 14, lineHeight: 1.2 }}>{s.title}</div>
                <div style={{ fontSize: 16, color: T.textMuted, lineHeight: 1.85, marginBottom: 18 }}>{s.body}</div>
                <div style={{ display: "inline-flex", padding: "5px 14px", background: "#B76E7915", border: "1px solid #B76E7933", borderRadius: 20, fontSize: 12, color: "#B76E79", fontWeight: 600 }}>{s.outcome}</div>
              </div>
          ))}
        </div>
      </div>

      {/* LISTENING TIMELINE */}
      <div style={{ padding: "0 0 80px" }} className="section-wrap">
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: "#B76E79", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 14, fontWeight: 700 }}>What repetition does</div>
          <h2 className="wm" style={{ fontSize: "clamp(28px,4.5vw,54px)", color: T.textPrimary, lineHeight: 1.15, marginBottom: 12 }}>
            It is not one listen.<br/>
            <span style={{ background: "linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>It is repetition that rewires.</span>
          </h2>
          <p style={{ fontSize: 16, color: T.textMuted, lineHeight: 1.8, maxWidth: 900, margin: "0 auto" }}>Every time you listen, the subconscious accepts the new self-concept more deeply. The first listen opens the channel. Thirty days closes the old identity completely.</p>
        </div>

        {/* TIMELINE — Day 1 to Day 30+ */}
        <div style={{ position: "relative", marginBottom: 64 }}>
          {/* Connecting line */}
          <div style={{ position: "absolute", top: 28, left: 28, right: 28, height: 1, background: "linear-gradient(90deg,#B76E7944,#B76E7988,#B76E7944)", zIndex: 0 }} className="hide-mob" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }} className="grid-3">
            {[
              { day: "Day 1", icon: "🎧", label: "First listen", body: "You feel something loosen. The obsessive loop quiets. You fall asleep before the track ends.", color: "#B76E79" },
              { day: "Day 3", icon: "◈", label: "Something shifts", body: "A small sign. A message you weren't expecting. Someone mentions your name. You notice.", color: "#C0789A" },
              { day: "Day 7", icon: "✦", label: "Evidence appears", body: "Signs arrive faster. Money from somewhere forgotten. He texts. Your skin looks different. You start logging proof.", color: "#B76E79" },
              { day: "Day 14", icon: "◉", label: "Identity updates", body: "You stop needing it. Certainty replaces desire. The old self-concept has nowhere left to live.", color: "#B76E79" },
              { day: "Day 30+", icon: "★", label: "Reality confirms", body: "What you assumed is now undeniable. The proof thread closes. Manifested.", color: "#d8c8a0" },
            ].map((s, i) => (
              <div key={i} style={{ position: "relative", zIndex: 1 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: `radial-gradient(circle,${s.color}22,transparent)`, border: `1.5px solid ${s.color}66`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, margin: "0 auto 14px" }}>{s.icon}</div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: s.color, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>{s.day}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.textPrimary, marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.65 }}>{s.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BEFORE / AFTER CARDS */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 11, color: "#B76E79", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 12, fontWeight: 700 }}>The results</div>
          <h2 className="wm" style={{ fontSize: "clamp(26px,4vw,48px)", color: T.textPrimary, lineHeight: 1.2 }}>
            What shifts when your<br/>
            <span style={{ background: "linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>self-concept shifts.</span>
          </h2>
        </div>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {[
            { cat: "Lovemaxxing", color: "#B76E79", bgHdr: "#0a0800", before: { label: "Old assumption", text: "I am not enough. He leaves. I chase.", msgs: [{txt:"Hey are you there?",sent:true},{txt:"Can we talk?",sent:true},{txt:"8 days · No reply",center:true}] }, after: { label: "New assumption", text: "He comes back. Of course he does.", msgs: [{txt:"I miss you. Been thinking about you constantly.",green:true},{txt:"✓✓ Read",small:true,green:true}] } },
            { cat: "Moneymaxxing", color: "#B76E79", bgHdr: "#0a0800", before: { label: "Old assumption", text: "There is never enough. I am always behind.", amount: "€247", dim: true }, after: { label: "New assumption", text: "I receive unexpectedly. Always.", amount: "€10,000", transfer: true } },
            { cat: "Beautymaxxing", color: "#B76E79", bgHdr: "#0a0800", before: { label: "Old assumption", text: "I need to fix myself.", mirror: true }, after: { label: "New assumption", text: "They notice before you do.", msgs: [{txt:"What are you doing differently?? You're GLOWING",from:"Sarah"},{txt:"Your skin is actually shifting omg",from:"Mia"}] } },
          ].map((item, idx) => (
            <div key={idx} style={{ background: T.cardBg, border: T.border, borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "12px 18px", borderBottom: "1px solid #1e1c0a", background: "#0a0800" }}>
                <div style={{ fontSize: 12, color: item.color, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>{item.cat}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                {[item.before, item.after].map((side, si) => (
                  <div key={si} style={{ padding: 14, borderRight: si === 0 ? "1px solid rgba(215,185,130,0.06)" : "none" }}>
                    <div style={{ fontSize: 10, color: si === 0 ? T.textFaint : "#B76E79", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>{side.label}</div>
                    <div style={{ background: si === 0 ? "#0a0a0a" : "#080e08", borderRadius: 10, padding: 10, marginBottom: 8, minHeight: 70, border: si === 1 ? "1px solid rgba(141,175,122,0.15)" : "none" }}>
                      {side.mirror && <div style={{ textAlign: "center", fontSize: 24, filter: "grayscale(1) opacity(0.25)", margin: "6px 0" }}>🪞</div>}
                      {side.amount && !side.transfer && <div style={{ fontSize: si === 0 ? 20 : 28, fontWeight: 800, color: si === 0 ? "#4a3a3a" : "#6ab06a", marginBottom: 3 }}>{side.amount}</div>}
                      {side.transfer && <div style={{ background: "rgba(10,25,10,0.8)", borderRadius: 8, padding: "7px 9px" }}><div style={{ fontSize: 10, color: "#4a8a4a" }}>✓ Payment received</div><div style={{ fontSize: 22, fontWeight: 800, color: "#6ab06a" }}>{side.amount}</div></div>}
                      {(side.msgs || []).map((m, mi) => (
                        <div key={mi}>
                          {m.center ? <div style={{ textAlign: "center", fontSize: 10, color: "#3a2a2a", marginBottom: 4 }}>{m.txt}</div>
                            : m.from ? <div style={{ background: "rgba(25,15,3,0.8)", borderRadius: 7, padding: "6px 8px", marginBottom: 4, border: "1px solid rgba(215,185,130,0.1)" }}><div style={{ fontSize: 10, color: T.textFaint, marginBottom: 2 }}>{m.from}</div><div style={{ fontSize: 11, color: T.textSecondary }}>{m.txt}</div></div>
                            : <div style={{ background: m.green ? "rgba(10,25,10,0.8)" : "rgba(25,15,15,0.8)", borderRadius: 7, padding: "5px 8px", marginBottom: 4 }}><div style={{ fontSize: m.small ? 10 : 11, color: m.green ? "#7ab07a" : "#4a3a3a" }}>{m.txt}</div></div>}
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: 12, color: si === 0 ? T.textFaint : "#B76E79", fontStyle: "italic", lineHeight: 1.5 }}>{side.text}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* DASHBOARD PREVIEWS */}
      <div style={{ padding: "0 0 70px" }} className="section-wrap">
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 11, color: "#B76E79", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 12, fontWeight: 700 }}>What you get access to</div>
          <h2 className="wm" style={{ fontSize: "clamp(28px,4.5vw,48px)", color: T.textPrimary, lineHeight: 1.2, marginBottom: 10 }}>
            Two dashboards.<br/>
            <span style={{ background: "linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>One practice.</span>
          </h2>
          <p style={{ fontSize: 15, color: T.textMuted, lineHeight: 1.7, maxWidth: 800, margin: "0 auto" }}>New audios added regularly — and a proof system that shows you exactly what is working.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="grid-2">

          {/* AUDIO DASHBOARD PREVIEW */}
          <div style={{ background: "#0a0800", border: "1.5px solid #B76E7944", borderRadius: 18, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid #1e1c0a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, color: "#B76E79", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 2 }}>Audio Library</div>
                <div style={{ fontSize: 13, color: T.textPrimary, fontWeight: 600 }}>Thousands of tracks. Yours.</div>
              </div>
              <span style={{ padding: "3px 10px", background: "#B76E7922", border: "1px solid #B76E7944", borderRadius: 20, fontSize: 11, color: "#B76E79", fontWeight: 700 }}>Audio Tier</span>
            </div>
            {/* Mock stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0 }}>
              {[["14d", "Streak"], ["", "Tracks"], ["3", "Active goals"]].map(([v,l],i) => (
                <div key={i} style={{ padding: "12px 14px", textAlign: "center", borderRight: i < 2 ? "1px solid #1e1c0a" : "none" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#B76E79" }}>{v}</div>
                  <div style={{ fontSize: 10, color: T.textMuted, marginTop: 1 }}>{l}</div>
                </div>
              ))}
            </div>
            {/* Track list preview */}
            <div style={{ padding: "10px 14px" }}>
              {[
                { title: "Money finds me first", cat: "Money", freq: "528hz", playing: true },
                { title: "Gorgeous is my default setting", cat: "Beauty", freq: "432hz" },
                { title: "He is already on his way back", cat: "Love", freq: "432hz" },
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < 2 ? "1px solid #1e1c0a" : "none" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: t.playing ? "#B76E7922" : "#0f0b02", border: `1px solid ${t.playing ? "#B76E7966" : "#1e1c0a"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0, color: t.playing ? "#B76E79" : T.textFaint }}>
                    {t.playing ? "▶" : "○"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: t.playing ? "#B76E79" : T.textPrimary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</div>
                    <div style={{ fontSize: 10, color: T.textFaint }}>{t.cat} · {t.freq}</div>
                  </div>
                  {t.playing && (
                    <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
                      {[6,14,20,11,16,9].map((h,j) => (
                        <div key={j} style={{ width: 2, height: h, borderRadius: 1, background: "#B76E79", opacity: 0.7 }} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ padding: "12px 18px", borderTop: "1px solid #1e1c0a", textAlign: "center" }}>
              <button onClick={onDemo} style={{ background: "none", border: "1px solid #B76E7966", borderRadius: 10, padding: "8px 20px", color: "#B76E79", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Preview audio dashboard →</button>
            </div>
          </div>

          {/* PROOFOS DASHBOARD PREVIEW */}
          <div style={{ background: "#0a0800", border: "1.5px solid #B76E7944", borderRadius: 18, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid #1e1c0a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, color: "#B76E79", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 2 }}>ProofOS ✦</div>
                <div style={{ fontSize: 13, color: T.textPrimary, fontWeight: 600 }}>Your manifestation ledger.</div>
              </div>
              <span style={{ padding: "3px 10px", background: "#B76E7922", border: "1px solid #B76E7944", borderRadius: 20, fontSize: 11, color: "#B76E79", fontWeight: 700 }}>Goddess Tier</span>
            </div>
            {/* Mock stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0 }}>
              {[["7", "Intentions"], ["4", "Manifested"], ["11d", "Avg time"]].map(([v,l],i) => (
                <div key={i} style={{ padding: "12px 14px", textAlign: "center", borderRight: i < 2 ? "1px solid #1e1c0a" : "none" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: i === 1 ? "#B76E79" : "#B76E79" }}>{v}</div>
                  <div style={{ fontSize: 10, color: T.textMuted, marginTop: 1 }}>{l}</div>
                </div>
              ))}
            </div>
            {/* Proof threads preview */}
            <div style={{ padding: "10px 14px" }}>
              {[
                { title: "I receive €5,000 unexpectedly", days: 9, status: "manifested", audio: "Money finds me first", mood_before: "Anxious", mood_after: "Certain" },
                { title: "He texts me first", days: 14, status: "manifested", audio: "He is already on his way back", mood_before: "Desperate", mood_after: "Detached" },
                { title: "My skin is visibly shifting", days: 21, status: "active", audio: "Gorgeous is my default", mood_before: "Doubtful", mood_after: "Noticing" },
              ].map((t, i) => (
                <div key={i} style={{ padding: "9px 0", borderBottom: i < 2 ? "1px solid #1e1c0a" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: T.textPrimary, flex: 1, lineHeight: 1.35 }}>{t.title}</div>
                    <span style={{ fontSize: 10, padding: "2px 8px", background: t.status === "manifested" ? "#0a1a0a" : "#0a0800", color: t.status === "manifested" ? "#4a9a5a" : "#B76E79", borderRadius: 20, fontWeight: 700, flexShrink: 0, border: `1px solid ${t.status === "manifested" ? "#2a4a2a" : "#B76E7944"}` }}>
                      {t.status === "manifested" ? `✦ ${t.days}d` : `${t.days}d`}
                    </span>
                  </div>
                  <div style={{ fontSize: 10, color: T.textFaint, marginBottom: 4 }}>🎧 {t.audio}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <span style={{ fontSize: 10, padding: "2px 7px", background: "#0a0a0a", border: "1px solid #1e1c0a", borderRadius: 20, color: T.textFaint }}>Before: {t.mood_before}</span>
                    <span style={{ fontSize: 10 , color: T.textFaint }}>→</span>
                    <span style={{ fontSize: 10, padding: "2px 7px", background: "#B76E7918", border: "1px solid #B76E7933", borderRadius: 20, color: "#B76E79" }}>After: {t.mood_after}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "12px 18px", borderTop: "1px solid #1e1c0a", textAlign: "center" }}>
              <button onClick={onDemo} style={{ background: "none", border: "1px solid #B76E7966", borderRadius: 10, padding: "8px 20px", color: "#B76E79", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Preview ProofOS dashboard →</button>
            </div>
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div style={{ padding: "0 0 70px" }} className="section-wrap">
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 11, color: "#B76E79", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 14 }}>What people are saying</div>
          <h2 className="wm" style={{ fontSize: "clamp(28px,4vw,44px)", color: T.textPrimary, lineHeight: 1.15 }}>
            They came for the audio.<br />
            <span style={{ background: "linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>The proof arrived on its own.</span>
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12 }}>
          {[
            { quote: "I listened on day 1 and felt something shift. By day 5 he texted. I didn't even look for it.", handle: "@manifestingwithme", cat: "SP & Love" },
            { quote: "€1,800 came back as a refund I had forgotten about. Three days after starting Money Finds Me First.", handle: "@luckygirlenergy", cat: "Money" },
            { quote: "I look the same and feel completely different about my face. The glow is internal first.", handle: "@beautymaxxing_", cat: "Beauty" },
            { quote: "I've tried every subliminal channel. This is the only one where I actually feel it working in real time.", handle: "@shiftingjournal", cat: "Identity" },
            { quote: "Woke up knowing he was coming back. No logical reason. He called that afternoon.", handle: "@sp_manifest", cat: "SP & Love" },
            { quote: "The sleep subliminal changed my dreams. I woke up feeling like money was already mine.", handle: "@goddessmindset__", cat: "Money" },
          ].map((t, i) => (
            <div key={i} style={{ background: "#0a0908", border: "1px solid #201e1c", borderRadius: 14, padding: "18px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 20, color: "#B76E7944", lineHeight: 1 }}>"</div>
              <p style={{ fontSize: 14, color: T.textSecondary, lineHeight: 1.8, fontStyle: "italic", flex: 1 }}>{t.quote}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: T.textFaint, fontWeight: 500 }}>{t.handle}</span>
                <span style={{ fontSize: 10, padding: "2px 8px", background: "#B76E7915", border: "1px solid #B76E7933", borderRadius: 20, color: "#B76E79", fontWeight: 700, letterSpacing: "0.08em" }}>{t.cat}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 14, fontSize: 12, color: T.textFaint }}>Replace with real YouTube comment screenshots</div>
      </div>

      {/* YOUR RECEIPTS GRID */}
      <div style={{ padding: "0 0 70px" }} className="section-wrap">
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 11, color: "#B76E79", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 12, fontWeight: 700 }}>ProofOS ✦</div>
          <h2 className="wm" style={{ fontSize: "clamp(28px,4.5vw,48px)", color: T.textPrimary, lineHeight: 1.2, marginBottom: 12 }}>
            Your receipts,<br/>
            <span style={{ background: "linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>finally organised.</span>
          </h2>
          <p style={{ fontSize: 15, color: T.textMuted, lineHeight: 1.8, maxWidth: 840, margin: "0 auto" }}>
            Photo proof, voice notes, signs, symptoms, synchronicities, and final manifestations — all stored inside the Proof Thread connected to the audio you listened to.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }} className="grid-3">
          {[
            { icon: "💬", label: "Message Screenshot",   sub: "He sent this on Day 8",         color: "#B76E79" },
            { icon: "💰", label: "Money Receipt",         sub: "€5,000 received",               color: "#B76E79" },
            { icon: "🪞", label: "Mirror Photo",          sub: "The glow. Day 14.",              color: "#B76E79" },
            { icon: "555", label: "Angel Number",          sub: "Saw it 3 times in one hour",    color: "#B76E79" },
            { icon: "📧", label: "Email Confirmation",    sub: "Arrived unexpectedly",           color: "#d8c8a0" },
            { icon: "📅", label: "Calendar Invite",       sub: "The meeting that changed it",   color: "#6a8ad0" },
          ].map((p, i) => (
            <div key={i} style={{ background: "#0a0800", border: `1px solid ${p.color}33`, borderRadius: 14, overflow: "hidden" }}>
              <div style={{ height: 88, background: `linear-gradient(135deg, ${p.color}18, ${p.color}06)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34 }}>{p.icon}</div>
              <div style={{ padding: "10px 14px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: p.color, marginBottom: 3 }}>{p.label}</div>
                <div style={{ fontSize: 12, color: T.textMuted }}>{p.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

                  {/* REFERRAL */}
      <div style={{ padding: "0 clamp(16px,4vw,24px) 70px" }}>
        <div style={{ background: "#0a0908", border: "1px solid #B76E7944", borderRadius: 20, padding: "36px 40px", textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#B76E79", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 14 }}>Refer a friend</div>
          <h2 className="wm" style={{ fontSize: "clamp(26px,4vw,40px)", background: "linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 14, lineHeight: 1.2 }}>
            Share the portal.<br />Both of you receive one month free.
          </h2>
          <p style={{ fontSize: 16, color: "#b09888", lineHeight: 1.8, marginBottom: 28, maxWidth: 1000, margin: "0 auto 28px" }}>
            Invite a friend to Self Hypnosis Goddess. When they subscribe to an annual plan, you both receive one month free. No codes. No limits.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => { const url = "https://reshmaoracle.com?ref=friend"; if (navigator.share) { navigator.share({ title: "Self Hypnosis Goddess", text: "I have been using this — thought of you.", url }); } else { navigator.clipboard?.writeText(url); alert("Link copied to clipboard"); } }} style={{ padding: "14px 28px", background: "linear-gradient(90deg,#d4a090,#B76E79)", border: "none", borderRadius: 12, color: "#000", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              Share your link
            </button>
            <button onClick={() => onJoin("audio")} style={{ padding: "14px 28px", background: "transparent", border: "1px solid #B76E7966", borderRadius: 12, color: "#B76E79", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
              Join now
            </button>
          </div>
          <div style={{ fontSize: 12, color: "#786860", marginTop: 16 }}>Annual plan required for referral bonus · Applied automatically</div>
        </div>
      </div>

{/* PRICING */}
      <div style={{ padding: "0 0 80px" }} className="section-wrap">
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 11, color: T.roseGold, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 14, fontWeight: 700 }}>Pricing</div>
          <h2 className="wm" style={{ fontSize: "clamp(32px,4.5vw,56px)", color: T.textPrimary, marginBottom: 20 }}>Choose your tier</h2>
          <div style={{ display: "inline-flex", background: T.surfaceBase, border: T.border, borderRadius: 12, padding: 4, gap: 4 }}>
            {["monthly", "annual"].map(b => (
              <button key={b} onClick={() => setBilling(b)} style={{ padding: "9px 20px", borderRadius: 9, background: billing === b ? "linear-gradient(90deg,#d4a090,#B76E79)" : "transparent", border: "none", color: billing === b ? "#000" : T.textMuted, fontSize: 14, fontWeight: 700, cursor: "pointer", minHeight: 40 }}>
                {b === "annual" ? "Annual — save €36" : "Monthly"}
              </button>
            ))}
          </div>
        </div>

        {/* 2 tier cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} className="grid-2">
          {[
            {
              id: "audio", name: "Audio Tier",
              price: billing === "monthly" ? "€19" : "€144",
              period: billing === "monthly" ? "/month" : "/year",
              sub: billing === "annual" ? "€19/mo · save €36/year" : null,
              color: T.textSecondary,
              features: ["An ever-expanding hypnosis library", "All 6 desire categories", "4 new tracks every week", "Loop player + sleep timer", "Plays in background like Spotify", "No ads. Ever."],
              cta: "Join Audio Tier",
            },
            {
              id: "goddess", name: "Goddess Tier", popular: true,
              price: billing === "monthly" ? "€33" : "€317",
              period: billing === "monthly" ? "/month" : "/year",
              sub: billing === "annual" ? "€33/mo · save €79/year" : null,
              color: T.roseGold,
              features: ["Everything in Audio Tier", "ProofOS manifestation tracker ✦", "Log desires · link to audios · capture proof", "Early access — 48hrs before everyone", "Monthly ritual audio included", "Goddess community"],
              cta: "Become Goddess",
            }
          ].map(p => (
            <div key={p.id} style={{ background: T.cardBg, border: `${p.popular ? "2px" : "1px"} solid ${p.popular ? "#B76E7966" : T.borderSoft}`, borderRadius: 18, padding: 28, position: "relative" }}>
              {p.popular && <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(90deg,#d4a090,#B76E79)", color: "#000", fontSize: 10, fontWeight: 800, padding: "3px 16px", borderRadius: 20, whiteSpace: "nowrap", letterSpacing: "0.1em" }}>MOST POPULAR</div>}
              <div style={{ fontSize: 15, fontWeight: 700, color: T.textPrimary, marginBottom: 4 }}>{p.name}</div>
              {p.sub && <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 8 }}>{p.sub}</div>}
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}>
                <span style={{ fontSize: 42, fontWeight: 800, color: p.color, lineHeight: 1 }}>{p.price}</span>
                <span style={{ fontSize: 14, color: T.textMuted }}>{p.period}</span>
              </div>
              <div style={{ marginBottom: 24 }}>
                {p.features.map((f, i) => (
                  <div key={i} style={{ fontSize: 14, color: f.includes("✦") ? "#B76E79" : T.textMuted, marginBottom: 8, paddingLeft: 16, position: "relative", lineHeight: 1.5 }}>
                    <span style={{ position: "absolute", left: 0, color: "#B76E79" }}>·</span>{f}
                  </div>
                ))}
              </div>
              <button onClick={() => onJoin(p.id)} style={{ width: "100%", padding: "16px", background: p.popular ? "linear-gradient(90deg,#d4a090,#B76E79)" : "transparent", border: p.popular ? "none" : "1.5px solid #C8956A", borderRadius: 12, color: p.popular ? "#000" : "#B76E79", fontSize: 15, fontWeight: 700, cursor: "pointer", minHeight: 52 }}>{p.cta}</button>
            </div>
          ))}
        </div>

        {/* Founder card — full width */}
        <div style={{ background: "linear-gradient(135deg,#0d0900,#1a0d02)", border: "2px solid #B76E7955", borderRadius: 18, padding: "28px 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "center" }} className="grid-2">
            <div>
              <div style={{ fontSize: 11, color: "#B76E79", letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>First 1,000 only · Lifetime access</div>
              <div className="wm" style={{ fontSize: "clamp(26px,4vw,38px)", color: T.textPrimary, marginBottom: 10 }}>Early Bird Lifetime</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 48, fontWeight: 800, color: "#B76E79", lineHeight: 1 }}>€500</span>
                <span style={{ fontSize: 15, color: T.textMuted }}>once · never pay again</span>
              </div>
              <div style={{ fontSize: 15, color: T.textMuted, lineHeight: 1.8, marginBottom: 20 }}>
                Full vault + ProofOS + every future feature — forever. No subscription can be cancelled from under you. The €500 Founder price closes once the first 1,000 members join.
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
                {["Full vault for life", "ProofOS for life", "1 GB evidence vault", "All future features", "Founder's seal ✦"].map((f, i) => (
                  <span key={i} style={{ padding: "5px 14px", background: "#B76E7918", border: "1px solid #B76E7944", borderRadius: 20, fontSize: 13, color: "#B76E79", fontWeight: 600 }}>{f}</span>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
                <button onClick={() => onJoin("founder")} style={{ padding: "16px 36px", background: "linear-gradient(90deg,#d4a090,#B76E79)", border: "none", borderRadius: 12, color: "#000", fontSize: 16, fontWeight: 800, cursor: "pointer", minHeight: 52 }}>Claim Founder price</button>
                <div style={{ fontSize: 12, color: T.textMuted }}>Original price · First 1,000 members only</div>
              </div>
            </div>
            <div className="hide-mob" style={{ minWidth: 220 }}>
              <div style={{ background: T.surfaceBase, border: T.border, borderRadius: 14, padding: 20, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: T.textFaint, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>What's included</div>
                {[["Audio vault", "Lifetime"], ["ProofOS tracker", "Lifetime"], ["Evidence vault", "1 GB"], ["Future features", "All"], ["Price increase", "Never"], ["Subscription", "None"]].map(([k,v], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 5 ? "1px solid #1e1c0a" : "none" }}>
                    <span style={{ fontSize: 13, color: T.textMuted }}>{k}</span>
                    <span style={{ fontSize: 13, color: "#B76E79", fontWeight: 700 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16, textAlign: "center", fontSize: 13, color: T.textFaint, lineHeight: 1.9 }}>
          No refunds after 14 days · Cancel before renewal · Web app — no download · iPhone: Add to Home Screen
        </div>
      </div>

      {/* FINAL CTA */}
      <div style={{ position: "relative", padding: "80px 24px", textAlign: "center", overflow: "hidden", borderTop: T.border }}>
        <Rings count={3} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 className="wm" style={{ fontSize: "clamp(28px,5vw,52px)", color: T.textPrimary, lineHeight: 1.2, marginBottom: 24 }}>
            Wake up knowing.<br />
            <span style={{ background: "linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Not hoping. Knowing.</span>
          </h2>
          <p style={{ fontSize: 17, color: T.textMuted, marginBottom: 32, lineHeight: 1.7, maxWidth: 740, margin: "0 auto 32px" }}>
            In that state, reality shows you the proof of what you already know.
          </p>
          <button onClick={() => onJoin("audio")} style={{ padding: "18px 52px", background: "linear-gradient(135deg,#d4a090,#B76E79)", boxShadow: "0 0 40px rgba(183,110,121,0.4)", transform: "none", border: "none", borderRadius: 14, color: "#000", fontSize: 17, fontWeight: 800, cursor: "pointer", minHeight: 56 }}>Start your shift →</button>
          <div style={{ marginTop: 12, fontSize: 13, color: T.textFaint }}>Cancel anytime · No download · Any device</div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: T.border, padding: "28px 24px", textAlign: "center" }}>
        <span className="wm" style={{ fontSize: 22, display: "block", marginBottom: 8, background: "linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Self Hypnosis Goddess</span>
        <div style={{ fontSize: 12, color: T.textFaint, marginBottom: 6 }}>Reshma Oracle · reshmaoracle.com · Not on YouTube</div>
        <div style={{ fontSize: 11, color: T.borderGlow, letterSpacing: "0.15em" }}>© 2026 RESHMA ORACLE · ALL RIGHTS RESERVED</div>
      </div>
    </div>
  );
}

/* ── SIGN MODAL ─────────────────────────────────────────────────────────────── */
const _sb = _sbClient("https://qtwvslrwmreazmrdktsn.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0d3ZzbHJ3bXJlYXptcmRrdHNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MzIwMjAsImV4cCI6MjA5ODMwODAyMH0.FjfHRNOjnmbiYMjA9eKT1hexvwCN2ERtTyBOqY2cj-8");

const SIGN_SUGGESTIONS = {
  Sign: ["Saw 111 · 222 · 333 · 555", "Someone mentioned it unexpectedly", "Dreamed about it clearly", "Felt sudden calm certainty", "Received a surprise message"],
  Synchronicity: ["His name appeared three times today", "The exact thing I wanted appeared", "A stranger confirmed my intention"],
  Symptom: ["Body felt warm and certain after listening", "Chest felt open and relaxed", "Sudden peace for no reason", "Woke up knowing before anything happened"],
};

function SignModal({ open, type, onClose, threadId }) {
  const [val, setVal] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const save = async () => {
    if (!val.trim()) return;
    setSaving(true);
    try {
      await _sb.from("proof_entries").insert({
        thread_id: threadId || null,
        type: type || "Sign",
        caption: val,
        happened_at: new Date().toISOString(),
      });
    } catch(e) { console.error(e); }
    setDone(true);
    setSaving(false);
  };

  if (!open) return null;

  return (
    <Modal open title={`Log ${type || "Sign"}`} onClose={() => { setVal(""); setDone(false); onClose(); }} width={460}>
      {done ? (
        <div style={{ textAlign: "center", padding: "28px 0" }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>◈</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.textPrimary, marginBottom: 20 }}>Logged.</div>
          <Btn variant="champagne" onClick={() => { setVal(""); setDone(false); onClose(); }}>Done</Btn>
        </div>
      ) : (
        <>
          <FormField label="What did you notice?">
            <input value={val} onChange={e => setVal(e.target.value)}
              placeholder="Describe what appeared, shifted, or showed up..."
              autoFocus onKeyDown={e => e.key === "Enter" && save()}
              style={{ width: "100%" }} />
          </FormField>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {(SIGN_SUGGESTIONS[type] || SIGN_SUGGESTIONS.Sign).map((s, i) => (
              <button key={i} onClick={() => setVal(s)} style={{ padding: "5px 12px", background: "none", border: "1px solid #1e1c0a", borderRadius: 20, color: T.textMuted, fontSize: 12, cursor: "pointer" }}>{s}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn full variant="champagne" onClick={save} disabled={saving || !val.trim()}>{saving ? "Saving..." : `Save ${type || "Sign"}`}</Btn>
            <Btn variant="soft" onClick={() => { setVal(""); onClose(); }}>Cancel</Btn>
          </div>
        </>
      )}
    </Modal>
  );
}
