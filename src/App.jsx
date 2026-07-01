import { useState, useRef, useEffect } from "react";
import { CSS, T } from "./design/tokens.js";
import { Btn, Card, Rings, WaveForm, Pill, Modal, FormField, Label, ProgressBar } from "./components/UI.jsx";
import AudioVault from "./pages/AudioVault.jsx";
import ProofThreads from "./pages/ProofThreads.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import VaultSettings from "./pages/VaultSettings.jsx";
import CreateThreadModal from "./components/CreateThreadModal.jsx";

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
  const [onboardTier, setOnboardTier] = useState("audio");

  const goPortal = (tier) => { if (tier) setUserTier(tier); setScreen("portal"); setPortalTab("dashboard"); };
  const openCreateThread = (audioId) => { setPreselectedAudioId(audioId || null); setCreateThreadModal(true); };
  const openAddProof = (type) => setAddProofType(type);
  const playAudio = (a) => { setCurrentAudio(a); setPlayingId(a.id); };
  const navigate = (tab) => setPortalTab(tab);

  return (
    <>
      <style>{CSS}</style>
      {screen === "landing" && <Landing onJoin={(t) => { setOnboardTier(t); setScreen("onboard"); }} onDemo={() => goPortal("goddess")} />}
      {screen === "onboard" && <Onboard tier={onboardTier} onSuccess={(t) => goPortal(t)} onBack={() => setScreen("landing")} />}
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
      <AddProofModal type={addProofType} onClose={() => setAddProofType(null)} />
    </>
  );
}

/* ── APP SHELL ─────────────────────────────────────────────────────────────── */
function AppShell({ userTier, tab, setTab, onSignOut, onUpgrade, currentAudio, playingId, onStopPlay, onCreateThread, onAddProof, onNavigate, onPlayAudio }) {
  const NAV = [
    { id: "dashboard", icon: "◎", label: "Dashboard" },
    { id: "audio-vault", icon: "🎧", label: "Audio Vault" },
    { id: "proof-threads", icon: "🧵", label: "Proof Threads" },
    { id: "archive", icon: "✦", label: "Archive" },
    { id: "vault-settings", icon: "⚙", label: "Vault Settings" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      {/* TOP NAV */}
      <header style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", background: "rgba(0,0,0,0.96)", borderBottom: "1px solid #1e1608", flexShrink: 0, zIndex: 50 }}>
        <button onClick={() => setTab("dashboard")} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <span className="wm" style={{ fontSize: 20, background: `linear-gradient(90deg, ${T.champagne}, ${T.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Self Hypnosis Goddess</span>
        </button>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {userTier === "goddess" || userTier === "founder"
            ? <Pill color="champagne">{userTier === "founder" ? "Founder ✦" : "Goddess ✦"}</Pill>
            : <Btn size="sm" variant="champagne" onClick={onUpgrade}>Unlock Goddess Vault</Btn>}
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* SIDEBAR */}
        <aside className="hide-mob" style={{ width: 220, background: "#040200", borderRight: "1px solid #1e1608", padding: "20px 12px", display: "flex", flexDirection: "column", gap: 4, flexShrink: 0, overflowY: "auto" }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, border: "none", background: tab === n.id ? T.gold + "18" : "transparent", cursor: "pointer", textAlign: "left", width: "100%" }}>
              <span style={{ fontSize: 16 }}>{n.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: tab === n.id ? T.gold : T.textMuted }}>{n.label}</span>
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
            {tab === "archive" && <ArchivePage />}
            {tab === "vault-settings" && <VaultSettings userTier={userTier} onSignOut={onSignOut} onUpgrade={onUpgrade} />}
          </div>

          {/* NOW PLAYING BAR */}
          {currentAudio && (
            <div style={{ height: 60, background: "rgba(0,0,0,0.97)", borderTop: "1px solid #C8892A33", display: "flex", alignItems: "center", padding: "0 20px", gap: 16, flexShrink: 0 }}>
              <WaveForm playing color={T.champagne} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.champagne, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentAudio.title}</div>
                <div style={{ fontSize: 11, color: T.textFaint }}>{currentAudio.audioType} · {currentAudio.frequency}</div>
              </div>
              <button onClick={onStopPlay} style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${T.blood}, ${T.rose})`, border: "none", color: "#fff", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>⏸</button>
            </div>
          )}
        </main>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <nav className="mob-nav" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.97)", borderTop: "1px solid #1e1608", zIndex: 200, paddingBottom: "env(safe-area-inset-bottom,8px)", display: "none" }}>
        {NAV.filter(n => n.id !== "archive" && n.id !== "vault-settings").concat({ id: "vault-settings", icon: "⚙", label: "Settings" }).map(n => (
          <button key={n.id} onClick={() => setTab(n.id)} style={{ flex: 1, padding: "9px 4px", background: "none", border: "none", color: tab === n.id ? T.gold : T.textMuted, fontSize: 10, fontWeight: 700, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minHeight: 52, letterSpacing: "0.06em", textTransform: "uppercase" }}>
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
function AddProofModal({ type, onClose }) {
  const [val, setVal] = useState("");
  const suggestions = { Sign: ["Saw a number sequence", "Someone mentioned it unexpectedly", "Dreamed about it", "Felt calm certainty", "Received a surprise message", "Overheard a relevant conversation"], Synchronicity: ["His name appeared three times", "Same number sequence all day", "The exact thing I wanted appeared", "A stranger confirmed my intention"], Symptom: ["Body felt warm and calm", "Chest felt open and certain", "Sudden peace for no reason", "Tingling after the audio"] };

  if (!type) return null;
  if (type === "Photo Proof") return (
    <Modal open title="Add Photo Proof" onClose={onClose} width={500}>
      <div>
        <div style={{ border: "2px dashed rgba(215,185,130,0.2)", borderRadius: 12, padding: "32px 20px", textAlign: "center", marginBottom: 16, cursor: "pointer", background: "rgba(23,9,18,0.4)" }} onClick={() => document.getElementById("qp-upload").click()}>
          <input id="qp-upload" type="file" accept=".jpg,.jpeg,.png,.webp,.heic" style={{ display: "none" }} />
          <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
          <div style={{ fontSize: 14, color: T.textMuted }}>Tap to upload photo proof</div>
          <div style={{ fontSize: 12, color: T.textFaint, marginTop: 4 }}>JPG · PNG · WEBP · HEIC</div>
        </div>
        <FormField label="What does this prove?"><input placeholder="Bank notification arrived · He texted · Skin shifted..." /></FormField>
        <div style={{ display: "flex", gap: 10 }}><Btn full variant="champagne" onClick={onClose}>Save Photo Proof</Btn><Btn variant="soft" onClick={onClose}>Cancel</Btn></div>
      </div>
    </Modal>
  );
  if (type === "Voice Proof") return (
    <Modal open title="Record Voice Proof" onClose={onClose} width={480}>
      <div style={{ textAlign: "center", padding: "28px 20px", background: "rgba(23,9,18,0.6)", borderRadius: 14, marginBottom: 20 }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🎙</div>
        <div style={{ fontSize: 14, color: T.textMuted, marginBottom: 16 }}>How does it feel? What shifted? Speak it out.</div>
        <Btn variant="primary" onClick={onClose}>● Start Recording</Btn>
      </div>
      <Btn full variant="soft" onClick={onClose}>Cancel</Btn>
    </Modal>
  );
  return (
    <Modal open title={`Log ${type}`} onClose={onClose} width={460}>
      <FormField label="What did you notice?">
        <input value={val} onChange={e => setVal(e.target.value)} placeholder="Describe it..." autoFocus onKeyDown={e => e.key === "Enter" && onClose()} />
      </FormField>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {(suggestions[type] || []).map((s, i) => (
          <button key={i} onClick={() => setVal(s)} style={{ padding: "5px 12px", background: "none", border: "1px solid rgba(215,185,130,0.14)", borderRadius: 20, color: T.textMuted, fontSize: 12, cursor: "pointer" }}>{s}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <Btn full variant="champagne" onClick={onClose} disabled={!val.trim()}>Log {type}</Btn>
        <Btn variant="soft" onClick={onClose}>Cancel</Btn>
      </div>
    </Modal>
  );
}

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

  const compRows = [
    { old: "You script and see nothing change", neu: "Your subconscious is already running the new program" },
    { old: "You desire it and it stays out of reach", neu: "You assume it — and reality mirrors the assumption" },
    { old: "You affirm what you don't believe", neu: "The subconscious installs what the conscious cannot reach" },
    { old: "You feel desperate. You push it away.", neu: "You know it. Certainty replaces desire." },
    { old: "You doubt the moment it doesn't appear", neu: "You trust the timing. It is already in motion." },
    { old: "Your self-concept says: not enough", neu: "Your identity says: of course. Down to DNA level." },
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
    <div style={{ background: "#000000", minHeight: "100vh" }}>
      <audio ref={audioRef} src={FREE_TRACK_URL} preload="none" />

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 300, height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", background: "rgba(0,0,0,0.96)", borderBottom: "1px solid #1e1608", backdropFilter: "blur(20px)" }}>
        <span className="wm" style={{ fontSize: 20, background: `linear-gradient(90deg, ${T.champagne}, ${T.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Self Hypnosis Goddess</span>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Btn size="sm" variant="ghost" onClick={onDemo} style={{ display: "none" }}>See Dashboard</Btn>
          <Btn size="sm" variant="champagne" onClick={() => onJoin("audio")}>Join now</Btn>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "1px solid rgba(215,185,130,0.14)", borderRadius: 8, padding: "8px 10px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 3 }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 16, height: 1.5, background: T.textMuted }} />)}
          </button>
        </div>
        {menuOpen && (
          <div style={{ position: "absolute", top: 58, right: 24, background: "#0a0800", border: "1px solid #1e1608", borderRadius: 14, padding: 10, minWidth: 200, zIndex: 400, boxShadow: "0 24px 60px rgba(0,0,0,0.8)" }}>
            {[["Preview Dashboard", onDemo], ["YouTube ↗", () => window.open("https://www.youtube.com/@Reshma.Oracle","_blank")], ["Instagram ↗", () => window.open("https://www.instagram.com/reshma.oracle/","_blank")]].map(([l,fn],i) => (
              <button key={i} onClick={() => { fn(); setMenuOpen(false); }} style={{ display:"block",width:"100%",textAlign:"left",padding:"11px 16px",background:"none",border:"none",color:T.textSecondary,fontSize:14,cursor:"pointer",borderRadius:8 }}
                onMouseEnter={e=>e.currentTarget.style.background="#1a1208"}
                onMouseLeave={e=>e.currentTarget.style.background="none"}>{l}</button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <div style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 58, overflow: "hidden" }}>
        <Rings count={5} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "60px 24px 80px", maxWidth: 800, margin: "0 auto", width: "100%" }}>
          {/* Soundwave */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, height: 56, marginBottom: 28 }}>
            {Array.from({ length: 24 }).map((_, i) => {
              const heights = [8,18,30,22,38,26,42,20,34,16,40,24,36,28,18,42,22,32,14,26,20,36,24,30];
              return <div key={i} style={{ width: 3, borderRadius: 2, height: heights[i], background: `linear-gradient(180deg,${T.champagne},${T.rose})`, animation: `wave ${0.9+(i%5)*0.15}s ease-in-out infinite`, animationDelay: `${i*0.06}s`, opacity: 0.6+(i%3)*0.12 }} />;
            })}
          </div>

          <div style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: T.textMuted, marginBottom: 24, fontWeight: 700 }}>Reshma Oracle · Self Hypnosis + Subliminals · Not on YouTube</div>

          {/* TITLE */}
          <h1 className="wm" style={{ fontSize: "clamp(38px,7vw,72px)", lineHeight: 1.05, marginBottom: 12, color: T.textPrimary }}>
            Self Hypnosis Goddess<br />
            <span style={{ background: `linear-gradient(90deg,${T.champagne},${T.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Audio Library</span>
          </h1>

          {/* TAGLINE */}
          <div style={{ fontSize: "clamp(17px,2.2vw,22px)", color: T.champSoft, fontWeight: 600, marginBottom: 20, letterSpacing: "0.02em" }}>
            Shift into your dream reality.
          </div>

          {/* PAIN POINT */}
          <p style={{ fontSize: "clamp(16px,2vw,18px)", color: T.textMuted, lineHeight: 1.9, marginBottom: 12, maxWidth: "100%" }}>
            You've tried everything. Scripted. Visualised. Affirmed. Nothing worked. Because conscious effort cannot reprogram the subconscious mind. <strong style={{ color: T.textSecondary }}>Desire is not manifestation. Desire is the seed. Certainty is manifestation.</strong>
          </p>
          <p style={{ fontSize: "clamp(15px,1.8vw,17px)", color: "#6a5a3a", lineHeight: 1.9, marginBottom: 12, maxWidth: "100%", fontStyle: "italic" }}>
            Visualisation without identity shift is just fantasy.
          </p>
          <p style={{ fontSize: "clamp(16px,2vw,18px)", color: T.textMuted, lineHeight: 1.9, marginBottom: 12, maxWidth: "100%" }}>
            Your reality mirrors what you assume to be true about yourself — at the deepest subconscious, DNA level. It's about your self-concept. Your self-image. What you believe you deserve. Down to your DNA.
          </p>
          <p style={{ fontSize: "clamp(16px,2vw,18px)", color: T.textMuted, lineHeight: 1.9, marginBottom: 36, maxWidth: "100%" }}>
            These audios install the new self-concept passively — while you sleep, while you rest. No active effort. No conscious force. Just your subconscious, finally reprogrammed. Wake up knowing. Not hoping. Knowing. In that state, reality shows you the proof of what you already know.
          </p>

          {/* FREE TRACK */}
          <div style={{ background: "#0a0800", border: "1px solid #C8892A55", borderRadius: 18, padding: "24px 26px", maxWidth: 480, margin: "0 auto 36px", boxShadow: "0 0 40px rgba(185,130,142,0.08)" }}>
            <div style={{ fontSize: 11, color: T.champagne, letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>Free track — listen now 🎧</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: T.textSecondary, marginBottom: 3 }}>10 Years of Delay Into One Hour</div>
            <div style={{ fontSize: 13, color: T.textMuted, marginBottom: 18 }}>EMDR · Binaural beats · Self hypnosis · Subconscious reprogramming</div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button onClick={togglePlay} className={playing ? "pulse" : ""} style={{ width: 50, height: 50, borderRadius: "50%", background: `linear-gradient(135deg,#C8892A,#B76E79)`, border: "none", color: "#fff", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{playing ? "⏸" : "▶"}</button>
              <div style={{ flex: 1 }}>
                <div style={{ height: 4, background: "rgba(215,185,130,0.1)", borderRadius: 2, marginBottom: 6, cursor: "pointer" }}
                  onClick={e => { const r=e.currentTarget.getBoundingClientRect(); if(audioRef.current?.duration) audioRef.current.currentTime=((e.clientX-r.left)/r.width)*audioRef.current.duration; }}>
                  <div style={{ width:`${progress}%`, height:"100%", background:`linear-gradient(90deg,${T.champagne},${T.rose})`, borderRadius:2 }} />
                </div>
                <div style={{ fontSize: 12, color: T.textFaint }}>{playing ? "Playing — plays in background like Spotify ✦" : "Free — no sign up needed"}</div>
              </div>
              {playing && <WaveForm playing color={T.champagne} />}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
            <Btn variant="champagne" size="lg" onClick={() => onJoin("audio")}>Start your shift — €19/month</Btn>
            <Btn variant="ghost" size="lg" onClick={onDemo}>Preview the dashboard</Btn>
          </div>
          <div style={{ fontSize: 13, color: T.textFaint }}>Cancel anytime · Stripe · No download · Plays in background like Spotify</div>
        </div>
      </div>

      {/* VOICE TRUST */}
      <div style={{ padding: "60px 24px 0", maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 11, color: "#B76E79", letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700, marginBottom: 20 }}>Why one voice matters</div>
        <h2 className="wm" style={{ fontSize: "clamp(28px,4vw,48px)", color: T.textPrimary, lineHeight: 1.2, marginBottom: 20 }}>
          The more you trust this voice,<br />
          <span style={{ background: "linear-gradient(90deg,#C8892A,#B76E79)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>the more your subconscious opens.</span>
        </h2>
        <p style={{ fontSize: "clamp(15px,2vw,18px)", color: T.textMuted, lineHeight: 1.9, marginBottom: 14 }}>
          Reshma's calm, hypnotic voice puts you into a state of deep relaxation. The subconscious is most receptive when the body is calm and the mind trusts the guide. The more you return to the same voice, the deeper the trance goes.
        </p>
        <p style={{ fontSize: "clamp(15px,2vw,18px)", color: "#6a5a3a", lineHeight: 1.9, marginBottom: 14, fontStyle: "italic" }}>
          When you mix different voices, your subconscious fights it. It doesn't know who to trust. Consistency is part of the programming. One voice. One guide. One path.
        </p>
        <p style={{ fontSize: "clamp(15px,2vw,18px)", color: T.textMuted, lineHeight: 1.9, marginBottom: 30 }}>
          Every track is available in three versions: with melodic house music, with soft sleep music, or voice only — echoey, hypnotic, just the frequency of her voice in space.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {["Melodic house", "Sleep music", "Voice only — echoey + hypnotic"].map((v, i) => (
            <span key={i} style={{ padding: "8px 18px", background: "#0a0800", border: "1px solid #B76E7944", borderRadius: 20, fontSize: 13, color: "#B76E79", fontWeight: 600 }}>{v}</span>
          ))}
        </div>
      </div>

      {/* SLIDING BANNER */}
      <div style={{ overflow: "hidden", padding: "0 0 70px", borderTop: "1px solid #1e1608" }}>
        <div style={{ display: "flex", gap: 16, animation: "slide 32s linear infinite", width: "max-content", paddingTop: 36 }}>
          {[...cats, ...cats].map((c, i) => (
            <div key={i} style={{ background: "#0a0800", border: `1px solid ${c.color}44`, borderRadius: 18, padding: "22px 30px", minWidth: 280, flexShrink: 0 }}>
              <div style={{ fontSize: 12, color: c.color || "#B76E79", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>{c.label}</div>
              <div style={{ fontSize: 18, color: T.textSecondary, lineHeight: 1.5, fontWeight: 500 }}>{c.tagline}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SCIENCE */}
      <div style={{ padding: "70px 24px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 12, color: T.textFaint, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 16, fontWeight: 700 }}>The science</div>
          <h2 className="wm" style={{ fontSize: "clamp(36px,6vw,68px)", color: T.textPrimary, lineHeight: 1.1, marginBottom: 22 }}>
            Your subconscious mind<br />
            <span style={{ background: `linear-gradient(90deg,${T.champagne},${T.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>creates your entire reality.</span>
          </h2>
          <p style={{ fontSize: 19, color: T.textMuted, lineHeight: 1.9, maxWidth: 700, margin: "0 auto 16px" }}>
            Neuroscience confirms 95% of your thoughts, beliefs and behaviours are subconscious. Your self-concept — what you assume to be true about yourself, down to a DNA level — determines everything you experience. Not your desires. Your assumptions.
          </p>
          <p style={{ fontSize: 19, color: "#7a6a5a", lineHeight: 1.9, maxWidth: 700, margin: "0 auto" }}>
            You can read every book. Study Neville Goddard. Understand every theory. But theory without installation changes nothing. These audios install it — passively, at depth, while your conscious mind rests.
          </p>
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
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", marginBottom: 2 }}>
              <div style={{ background: "#0a0505", padding: "18px 30px", border: "1px solid #2a1010", borderRight: "none", borderBottom: "none", borderRadius: i === compRows.length-1 ? "0 0 0 14px" : 0, display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ color: T.danger, fontSize: 20, flexShrink: 0, marginTop: 2 }}>✗</span>
                <span style={{ fontSize: 17, color: "#8a6060", lineHeight: 1.7 }}>{row.old}</span>
              </div>
              <div style={{ background: "#080a08", padding: "18px 30px", border: `1px solid ${T.gold}22`, borderLeft: "none", borderBottom: "none", borderRadius: i === compRows.length-1 ? "0 0 14px 0" : 0, display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ color: T.champagne, fontSize: 18, flexShrink: 0, marginTop: 2 }}>✦</span>
                <span style={{ fontSize: 17, color: T.textSecondary, lineHeight: 1.7 }}>{row.neu}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 4 STEPS */}
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <h2 className="wm" style={{ fontSize: "clamp(32px,5vw,56px)", color: T.textPrimary, marginBottom: 10 }}>Four steps. One reality shift.</h2>
          <p style={{ fontSize: 18, color: T.textMuted }}>Your only job is to press play.</p>
        </div>
        <div className="mob-col" style={{ display: "flex", gap: 0, marginBottom: 70 }}>
          {[
            { n:"01", icon:"🎧", title:"You listen", body:"Self hypnosis and subliminal audio. Press play. Works while you sleep, while you rest. No active effort required." },
            { n:"02", icon:"◈", title:"Subconscious shifts", body:"Your self-concept updates at depth through repetition in theta and delta states. Old assumptions dissolve. New identity installs." },
            { n:"03", icon:"✦", title:"Reality mirrors it", body:"He texts. Money arrives. Skin shifts. Your outer world mirrors your new inner assumption. Of course it does." },
            { n:"04", icon:"◉", title:"You document proof", body:"Log every sign in ProofOS. Link it to the audio. Watch the pattern become undeniable. It is done." },
          ].map((s,i) => (
            <div key={i} style={{ display:"flex", flex:1 }}>
              <div style={{ background:T.cardBg, border:T.border, flex:1, padding:"28px 26px", borderLeft:i>0?"none":undefined, borderTopLeftRadius:i===0?14:0, borderBottomLeftRadius:i===0?14:0, borderTopRightRadius:i===3?14:0, borderBottomRightRadius:i===3?14:0, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${T.champagne}${['55','44','33','22'][i]},transparent)` }} />
                <div style={{ fontSize:"clamp(52px,8vw,86px)", fontWeight:900, color:"rgba(215,185,130,0.07)", lineHeight:1, marginBottom:10, fontFamily:"monospace" }}>{s.n}</div>
                <div style={{ fontSize:28, marginBottom:12 }}>{s.icon}</div>
                <div style={{ fontSize:20, fontWeight:700, color:T.champagne, marginBottom:12 }}>{s.title}</div>
                <div style={{ fontSize:16, color:T.textMuted, lineHeight:1.8 }}>{s.body}</div>
              </div>
              {i<3 && <div style={{ display:"flex", alignItems:"center", color:"rgba(215,185,130,0.25)", fontSize:20, padding:"0 6px", flexShrink:0 }}>→</div>}
            </div>
          ))}
        </div>

        {/* WHY DESIRE DOESN'T MANIFEST */}
        <div style={{ background: "linear-gradient(135deg,#0a0700,#0d0800)", border: `1px solid ${T.gold}33`, borderRadius: 20, padding: "44px 40px", marginBottom: 70 }}>
          <div style={{ fontSize: 12, color: T.textFaint, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 16, fontWeight: 700 }}>The real reason</div>
          <h2 className="wm" style={{ fontSize: "clamp(26px,4vw,48px)", color: T.textPrimary, marginBottom: 28, lineHeight: 1.2 }}>
            Why desire doesn't manifest.<br/>
            <span style={{ background: `linear-gradient(90deg,${T.champagne},${T.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>And what does.</span>
          </h2>
          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36 }}>
            {[
              { title: "Why it hasn't worked", color: T.danger, items: ["Desire lives in the conscious mind. The conscious mind doesn't create reality.", "Affirmations are rejected by a subconscious that holds the opposite belief.", "Visualisation without identity shift is just imagination — the subconscious knows.", "Willpower requires constant effort. The subconscious always wins."], icon: "✗" },
              { title: "What actually works", color: T.champagne, items: ["The subconscious accepts new beliefs in theta and delta states — at the edge of sleep.", "Repetition installs the new self-concept below the threshold of conscious resistance.", "Once the subconscious holds the new identity as true, reality rearranges to match it.", "Passive. No effort. No force. The subconscious does the work while you rest."], icon: "✦" },
            ].map((col, ci) => (
              <div key={ci}>
                <div style={{ fontSize: 13, color: col.color, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>{col.title}</div>
                {col.items.map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                    <span style={{ color: col.color, fontSize: ci === 0 ? 18 : 16, flexShrink: 0, marginTop: 2 }}>{col.icon}</span>
                    <span style={{ fontSize: 16, color: ci === 0 ? "#8a6060" : T.textSecondary, lineHeight: 1.75 }}>{t}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* TECHNOLOGY TABLE */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 12, color: T.textFaint, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 14, fontWeight: 700 }}>The technology</div>
          <h2 className="wm" style={{ fontSize: "clamp(26px,4vw,48px)", color: T.textPrimary, marginBottom: 12 }}>What's inside every audio.</h2>
          <p style={{ fontSize: 17, color: T.textMuted, maxWidth: 600, margin: "0 auto" }}>Every track is layered with multiple technologies working simultaneously to activate your ideal brainwave state and install the new self-concept at depth.</p>
        </div>
        <div style={{ background: "#0a0800", border: "1px solid #1e1608", borderRadius: 16, overflow: "hidden", marginBottom: 70 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr 2fr 1.5fr", background: "#0f0b01", borderBottom: "1px solid #1e1608" }}>
            {["Technology", "What it is", "What it does", "When it activates"].map((h, i) => (
              <div key={i} style={{ padding: "13px 18px", fontSize: 12, color: T.champagne, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", borderRight: i < 3 ? "1px solid #1e1608" : "none" }}>{h}</div>
            ))}
          </div>
          {TECH_ROWS.map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr 2fr 1.5fr", borderBottom: i < TECH_ROWS.length-1 ? "1px solid rgba(215,185,130,0.05)" : "none" }}>
              <div style={{ padding: "15px 18px", fontSize: 15, fontWeight: 700, color: T.champSoft, borderRight: "1px solid rgba(215,185,130,0.06)" }}>{row.t}</div>
              <div style={{ padding: "15px 18px", fontSize: 13, color: T.textMuted, borderRight: "1px solid rgba(215,185,130,0.06)", lineHeight: 1.6 }}>{row.w}</div>
              <div style={{ padding: "15px 18px", fontSize: 13, color: T.textSecondary, borderRight: "1px solid rgba(215,185,130,0.06)", lineHeight: 1.6 }}>{row.d}</div>
              <div style={{ padding: "15px 18px", fontSize: 12, color: T.textFaint, fontStyle: "italic", lineHeight: 1.6 }}>{row.when}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RESULTS SECTION */}
      <div style={{ padding: "0 24px 80px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 12, color: T.textFaint, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 16, fontWeight: 700 }}>The results</div>
          <h2 className="wm" style={{ fontSize: "clamp(36px,6vw,70px)", color: T.textPrimary, lineHeight: 1.1 }}>
            WHAT SHIFTS<br/>
            <span style={{ background: `linear-gradient(90deg,${T.champagne},${T.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>WHEN YOUR SELF-CONCEPT SHIFTS.</span>
          </h2>
        </div>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {[
            { cat: "Lovemaxxing", color: T.rose, bgHdr: "#0d0508", before: { label: "Old assumption", text: "I am not enough. He leaves. I chase.", msgs: [{txt:"Hey are you there?",sent:true},{txt:"Can we talk?",sent:true},{txt:"8 days · No reply",center:true}] }, after: { label: "New assumption", text: "He comes back. Of course he does.", msgs: [{txt:"I miss you. Been thinking about you constantly.",green:true},{txt:"✓✓ Read",small:true,green:true}] } },
            { cat: "Moneymaxxing", color: T.champagne, bgHdr: "#090d08", before: { label: "Old assumption", text: "There is never enough. I am always behind.", amount: "€247", dim: true }, after: { label: "New assumption", text: "I receive unexpectedly. Always.", amount: "€10,000", transfer: true } },
            { cat: "Beautymaxxing", color: T.champSoft, bgHdr: "#0d0c08", before: { label: "Old assumption", text: "I need to fix myself.", mirror: true }, after: { label: "New assumption", text: "They notice before you do.", msgs: [{txt:"What are you doing differently?? You're GLOWING",from:"Sarah"},{txt:"Your skin is actually shifting omg",from:"Mia"}] } },
          ].map((item, idx) => (
            <div key={idx} style={{ background: T.cardBg, border: T.border, borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "12px 18px", borderBottom: "1px solid rgba(215,185,130,0.06)", background: item.bgHdr }}>
                <div style={{ fontSize: 12, color: item.color, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>{item.cat}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
                {[item.before, item.after].map((side, si) => (
                  <div key={si} style={{ padding: 14, borderRight: si === 0 ? "1px solid rgba(215,185,130,0.06)" : "none" }}>
                    <div style={{ fontSize: 10, color: si === 0 ? T.danger : T.champagne, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>{side.label}</div>
                    <div style={{ background: si === 0 ? "rgba(15,5,8,0.8)" : "rgba(8,14,8,0.8)", borderRadius: 10, padding: 10, marginBottom: 8, minHeight: 70, border: si === 1 ? "1px solid rgba(141,175,122,0.15)" : "none" }}>
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
                    <div style={{ fontSize: 12, color: si === 0 ? "#6a4a4a" : T.textSecondary, fontStyle: "italic", lineHeight: 1.5 }}>{side.text}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRICING */}
      <div style={{ padding: "0 24px 80px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 12, color: T.textFaint, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 14, fontWeight: 700 }}>Pricing</div>
          <h2 className="wm" style={{ fontSize: "clamp(28px,4vw,50px)", color: T.textPrimary, marginBottom: 20 }}>Choose your tier</h2>
          <div style={{ display: "inline-flex", background: "rgba(31,12,24,0.86)", border: T.border, borderRadius: 12, padding: 4, gap: 4 }}>
            {["monthly", "annual"].map(b => (
              <button key={b} onClick={() => setBilling(b)} style={{ padding: "9px 20px", borderRadius: 9, background: billing === b ? `linear-gradient(90deg,${T.gold},${T.rose})` : "transparent", border: "none", color: billing === b ? "#000" : T.textMuted, fontSize: 14, fontWeight: 700, cursor: "pointer", minHeight: 40 }}>
                {b === "annual" ? "Annual — save 20%" : "Monthly"}
              </button>
            ))}
          </div>
        </div>

        {/* 3-column table */}
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr 1fr", background: T.cardBg, borderRadius: 18, overflow: "hidden", border: T.border }}>
          <div style={{ padding: "20px 22px", borderBottom: "1px solid rgba(215,185,130,0.08)", borderRight: "1px solid rgba(215,185,130,0.06)" }} />
          {[
            { name: "Audio Tier", price: billing === "monthly" ? "€19" : "€192", period: billing === "monthly" ? "/mo" : "/yr", color: T.textSecondary, cta: "Join Audio", id: "audio" },
            { name: "Goddess Tier", price: billing === "monthly" ? "€33" : "€317", period: billing === "monthly" ? "/mo" : "/yr", color: T.champagne, popular: true, cta: "Become Goddess", id: "goddess" },
            { name: "Founder Lifetime", price: "€500", period: "once", color: T.rose, cta: "Claim Founder", id: "founder", sub: "Original price · First 1,000 members only" },
          ].map((col, ci) => (
            <div key={ci} style={{ padding: "20px 18px 16px", borderBottom: "1px solid rgba(215,185,130,0.08)", borderRight: ci < 2 ? "1px solid rgba(215,185,130,0.06)" : "none", background: col.popular ? "rgba(42,18,33,0.4)" : "none", position: "relative", textAlign: "center" }}>
              {col.popular && <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", background: `linear-gradient(90deg,${T.gold},${T.rose})`, color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 12px", borderRadius: "0 0 8px 8px", whiteSpace: "nowrap", letterSpacing: "0.08em" }}>MOST POPULAR</div>}
              <div style={{ fontSize: 15, fontWeight: 700, color: col.color, marginBottom: 5 }}>{col.name}</div>
              {col.sub && <div style={{ fontSize: 11, color: T.textFaint, marginBottom: 6 }}>{col.sub}</div>}
              <div style={{ display: "flex", alignItems: "baseline", gap: 2, justifyContent: "center", marginBottom: 14 }}>
                <span style={{ fontSize: 32, fontWeight: 800, color: col.color }}>{col.price}</span>
                <span style={{ fontSize: 12, color: T.textMuted }}>{col.period}</span>
              </div>
              <Btn size="sm" full variant={col.popular ? "champagne" : "ghost"} onClick={() => onJoin(col.id)}>{col.cta}</Btn>
            </div>
          ))}
          {[
            { label: "Full audio library — 50+ tracks", a: true, g: true, f: true },
            { label: "All 6 desire categories", a: true, g: true, f: true },
            { label: "4 new tracks every week", a: true, g: true, f: true },
            { label: "Loop player + sleep timer", a: true, g: true, f: true },
            { label: "Plays in background like Spotify", a: true, g: true, f: true },
            { label: "No ads · No interruptions · Ever", a: true, g: true, f: true },
            { label: "ProofOS manifestation tracker ✦", a: false, g: true, f: true },
            { label: "Early access — 48hrs before everyone", a: false, g: true, f: true },
            { label: "Monthly ritual audio", a: false, g: true, f: true },
            { label: "1 GB private evidence vault", a: false, g: true, f: true },
            { label: "All future features forever", a: false, g: false, f: true },
            { label: "25 GB evidence vault", a: false, g: false, f: true },
            { label: "Founder's seal ✦", a: false, g: false, f: true },
          ].map((row, ri) => (
            <div key={ri} style={{ display: "contents" }}>
              <div style={{ padding: "13px 22px", borderBottom: "1px solid rgba(215,185,130,0.04)", borderRight: "1px solid rgba(215,185,130,0.06)", fontSize: 14, color: T.textSecondary, lineHeight: 1.45, display: "flex", alignItems: "center" }}>{row.label}</div>
              {[row.a, row.g, row.f].map((has, ci) => (
                <div key={ci} style={{ padding: "13px 18px", borderBottom: "1px solid rgba(215,185,130,0.04)", borderRight: ci < 2 ? "1px solid rgba(215,185,130,0.06)" : "none", textAlign: "center", background: ci === 1 ? "#0d0a00" : "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {has ? <span style={{ fontSize: 20, color: T.success }}>✓</span> : <span style={{ fontSize: 16, color: "rgba(215,185,130,0.1)" }}>—</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: T.textFaint, lineHeight: 1.9 }}>No refunds after 14 days · Cancel before renewal · Web app · iPhone: Add to Home Screen</div>
      </div>

      {/* FAQ */}
      <div style={{ padding: "0 24px 80px", maxWidth: 720, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h2 className="wm" style={{ fontSize: "clamp(26px,4vw,44px)", color: T.textPrimary }}>Common questions</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ background: "#0a0800", border: "1px solid #1e1608", borderRadius: 14, overflow: "hidden" }}>
              <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px", background: "none", border: "none", cursor: "pointer", gap: 12, textAlign: "left" }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: T.textPrimary, lineHeight: 1.4 }}>{f.q}</span>
                <span style={{ color: T.champSoft, fontSize: 18, flexShrink: 0 }}>{faqOpen === i ? "−" : "+"}</span>
              </button>
              {faqOpen === i && <div style={{ padding: "0 22px 18px", fontSize: 15, color: T.textMuted, lineHeight: 1.8 }}>{f.a}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* FINAL CTA */}
      <div style={{ position: "relative", padding: "80px 24px", textAlign: "center", overflow: "hidden", borderTop: "1px solid #1e1608" }}>
        <Rings count={4} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="wm" style={{ fontSize: "clamp(30px,5vw,60px)", color: T.textPrimary, lineHeight: 1.2, marginBottom: 24 }}>
            Wake up knowing.<br />
            <span style={{ background: `linear-gradient(90deg,${T.champagne},${T.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Not hoping. Knowing.</span>
          </div>
          <Btn variant="champagne" size="lg" onClick={() => onJoin("audio")}>Start your shift — €19/month</Btn>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: "1px solid #1e1608", padding: "36px 24px", textAlign: "center" }}>
        <div className="wm" style={{ fontSize: 22, display: "block", marginBottom: 16, background: `linear-gradient(90deg,${T.champagne},${T.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Self Hypnosis Goddess</div>
        <div style={{ display: "flex", gap: 28, justifyContent: "center", marginBottom: 16 }}>
          {[["YouTube", "https://www.youtube.com/@Reshma.Oracle"], ["Instagram", "https://www.instagram.com/reshma.oracle/"]].map(([l, u]) => (
            <a key={l} href={u} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, color: T.textMuted, textDecoration: "none" }}>{l} →</a>
          ))}
        </div>
        <div style={{ fontSize: 12, color: T.textFaint }}>© 2026 Reshma Oracle · All rights reserved</div>
      </div>
    </div>
  );
}

/* ── ONBOARD ───────────────────────────────────────────────────────────────── */
function Onboard({ tier, onSuccess, onBack }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [billing, setBilling] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const tierName = tier === "goddess" ? "Goddess Tier" : tier === "founder" ? "Founder Lifetime" : "Audio Tier";
  const price = tier === "founder" ? "€500" : tier === "goddess" ? (billing === "monthly" ? "€33" : "€317") : (billing === "monthly" ? "€19" : "€192");
  const next = () => {
    if (step === 3) { setLoading(true); setTimeout(() => { setLoading(false); onSuccess(tier); }, 1400); }
    else setStep(s => s + 1);
  };
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 20px", background: "#000000" }} className="fade">
      {step < 4 && <button onClick={onBack} style={{ position: "fixed", top: 20, left: 20, background: "none", border: "none", color: T.textMuted, fontSize: 15, cursor: "pointer" }}>← Back</button>}
      <div className="wm" style={{ fontSize: 22, marginBottom: 32, background: `linear-gradient(90deg,${T.champagne},${T.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Self Hypnosis Goddess</div>
      {step < 4 && (
        <div style={{ display: "flex", gap: 0, marginBottom: 40 }}>
          {[1, 2, 3].map(n => (
            <div key={n} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: n <= step ? `linear-gradient(135deg,${T.gold},${T.rose})` : "#0a0800", border: `1.5px solid ${n <= step ? T.gold : "#1e1608"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: n <= step ? "#fff" : T.textMuted }}>{n < step ? "✓" : n}</div>
              {n < 3 && <div style={{ width: 48, height: 1, background: n < step ? T.rose : "rgba(215,185,130,0.1)" }} />}
            </div>
          ))}
        </div>
      )}
      <div style={{ width: "100%", maxWidth: 460 }}>
        {step === 1 && (
          <div className="fade">
            <div style={{ fontSize: 22, fontWeight: 700, color: T.textPrimary, marginBottom: 6 }}>Create your account</div>
            <div style={{ fontSize: 15, color: T.textMuted, marginBottom: 28 }}>Joining: {tierName}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              <input placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input placeholder="Email address" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              <input placeholder="Password (min 8 characters)" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <Btn full variant="champagne" onClick={next} disabled={!form.email || form.password.length < 8}>Continue →</Btn>
            <div style={{ textAlign: "center", marginTop: 14, fontSize: 14, color: T.textMuted }}>Already a member? <span style={{ color: T.champSoft, cursor: "pointer" }} onClick={onBack}>Sign in</span></div>
          </div>
        )}
        {step === 2 && (
          <div className="fade">
            <div style={{ fontSize: 22, fontWeight: 700, color: T.textPrimary, marginBottom: 24 }}>Confirm your plan</div>
            {tier !== "founder" && (
              <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
                {["monthly", "annual"].map(b => (
                  <button key={b} onClick={() => setBilling(b)} style={{ flex: 1, padding: 16, background: billing === b ? "#0f0b01" : "#0a0800", border: `${billing === b ? "2px" : "1px"} solid ${billing === b ? T.gold + "88" : "#1e1608"}`, borderRadius: 12, cursor: "pointer", textAlign: "left" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: billing === b ? T.champagne : T.textSecondary, marginBottom: 3 }}>{b === "monthly" ? "Monthly" : "Annual"}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: billing === b ? T.champagne : T.textSecondary }}>{tier === "goddess" ? (b === "monthly" ? "€33" : "€317") : (b === "monthly" ? "€19" : "€192")}<span style={{ fontSize: 13, color: T.textMuted }}>/{b === "monthly" ? "mo" : "yr"}</span></div>
                    {b === "annual" && <div style={{ fontSize: 12, color: T.rose, marginTop: 4, fontWeight: 600 }}>Save 20% · 2 months free</div>}
                  </button>
                ))}
              </div>
            )}
            <Btn full variant="champagne" onClick={next}>Continue to payment →</Btn>
          </div>
        )}
        {step === 3 && (
          <div className="fade">
            <div style={{ fontSize: 22, fontWeight: 700, color: T.textPrimary, marginBottom: 24 }}>Secure checkout</div>
            <div style={{ background: "#0a0800", border: `1px solid ${T.gold}55`, borderRadius: 12, padding: 20, marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.textPrimary }}>{tierName}</div>
                <div style={{ fontSize: 13, color: T.textMuted }}>{tier === "founder" ? "One-time" : `Billed ${billing}`}</div>
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: T.champagne }}>{price}</div>
            </div>
            <div style={{ background: "#0a0800", border: "1px solid #1e1608", borderRadius: 12, padding: 16, marginBottom: 18, fontSize: 14, color: T.textFaint, lineHeight: 1.75 }}>Stripe secure checkout · SSL encrypted · No refunds after 14 days</div>
            <Btn full variant="champagne" onClick={next} disabled={loading}>{loading ? "Processing..." : "Pay with Stripe →"}</Btn>
          </div>
        )}
      </div>
    </div>
  );
}


