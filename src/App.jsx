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
  const [checkoutModal, setCheckoutModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState("tiers"); // tiers | upsell-goddess | upsell-lifetime
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
      {screen === "landing" && <Landing onJoin={() => setCheckoutModal(true)} onDemo={() => goPortal("goddess")} onSignIn={() => goPortal("goddess")} />}
    {checkoutModal && <CheckoutModal onClose={() => setCheckoutModal(false)} onDemo={() => { setCheckoutModal(false); goPortal("goddess"); }} />}
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
      <header style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", background: "rgba(0,0,0,0.96)", borderBottom: "1px solid #1c1828", flexShrink: 0, zIndex: 50 }}>
        <button onClick={onSignOut} style={{ background: "none", border: "none", cursor: "pointer" }} title="Back to homepage">
          <span className="wm wm-shimmer" style={{ fontSize: 22, fontWeight: 500, cursor: "pointer", letterSpacing: "0.02em" }} onClick={() => window.scrollTo({top:0,behavior:"smooth"})}>Self Hypnosis Goddess</span>
        </button>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {userTier === "goddess" || userTier === "founder"
            ? <Pill color="champagne">{userTier === "founder" ? "Lifetime ✦" : "Goddess ✦"}</Pill>
            : <Btn size="sm" variant="champagne" onClick={onUpgrade}>Unlock Goddess Vault</Btn>}
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* SIDEBAR */}
        <aside className="hide-mob" style={{ width: 220, background: "#040200", borderRight: "1px solid #1c1828", padding: "20px 12px", display: "flex", flexDirection: "column", gap: 4, flexShrink: 0, overflowY: "auto" }}>
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
      <nav className="mob-nav" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.97)", borderTop: "1px solid #1c1828", zIndex: 200, paddingBottom: "env(safe-area-inset-bottom,8px)", display: "none" }}>
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

/* ── CHECKOUT MODAL ────────────────────────────────────────────────────────── */
const STRIPE = {
  audio: "https://buy.stripe.com/8x2bJ1c3L2jQ2lb5CU7AI00",
  goddess: "https://buy.stripe.com/6oUfZh3xfcYu5xn4yQ7AI01",
  lifetime: "https://buy.stripe.com/00w8wP2tbgaG3pffdu7AI02",
};

function CheckoutModal({ onClose, onDemo }) {
  const goStripe = (tier) => { window.open(STRIPE[tier],"_blank"); onClose(); };
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.94)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:"20px" }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ background:"#000000",border:"1px solid #2a1a14",borderRadius:20,padding:"36px 28px",maxWidth:480,width:"100%",position:"relative",maxHeight:"90vh",overflowY:"auto" }}>
        <button onClick={onClose} style={{position:"absolute",top:16,right:20,background:"none",border:"none",color:"#786860",fontSize:22,cursor:"pointer",lineHeight:1}}>✕</button>
        <div style={{fontFamily:"'Jost',sans-serif",fontSize:10,color:"#B76E79",letterSpacing:"0.25em",textTransform:"uppercase",fontWeight:700,marginBottom:10}}>Choose your tier</div>
        <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(24px,4vw,32px)",color:"#f2ece4",fontWeight:300,lineHeight:1.2,marginBottom:28}}>Start your shift today.</h3>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
          {/* AUDIO */}
          <div style={{background:"#0d0c0a",border:"1px solid #2a1a14",borderRadius:14,padding:"18px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4}}>
              <span style={{fontSize:16,fontWeight:700,color:"#f2ece4",fontFamily:"'Jost',sans-serif"}}>Audio Tier</span>
              <span style={{fontSize:20,fontWeight:800,color:"#c8a870"}}>£19<span style={{fontSize:12,color:"#786860",fontWeight:400}}>/mo</span></span>
            </div>
            <div style={{fontSize:13,color:"#786860",marginBottom:12,lineHeight:1.5}}>Full exclusive vault · All 6 categories · New tracks weekly · Loop player</div>
            <button onClick={() => goStripe("audio")} style={{width:"100%",padding:"12px",background:"none",border:"1.5px solid #c8a87044",borderRadius:10,color:"#c8a870",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Jost',sans-serif",letterSpacing:"0.06em"}}>Join Audio · £19/mo →</button>
          </div>
          {/* GODDESS */}
          <div style={{background:"linear-gradient(135deg,#0f0a08,#120d0a)",border:"2px solid #B76E79",borderRadius:14,padding:"18px",position:"relative"}}>
            <div style={{position:"absolute",top:-10,left:16,background:"linear-gradient(90deg,#d4a090,#B76E79)",borderRadius:20,padding:"3px 12px",fontSize:9,fontWeight:800,color:"#000",letterSpacing:"0.12em",fontFamily:"'Jost',sans-serif"}}>MOST POPULAR</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4}}>
              <span style={{fontSize:16,fontWeight:700,color:"#f2ece4",fontFamily:"'Jost',sans-serif"}}>Goddess Tier</span>
              <span style={{fontSize:20,fontWeight:800,color:"#B76E79"}}>£33<span style={{fontSize:12,color:"#786860",fontWeight:400}}>/mo</span></span>
            </div>
            <div style={{fontSize:13,color:"#d4b898",marginBottom:12,lineHeight:1.5}}>Everything in Audio + <strong style={{color:"#f2ece4"}}>ProofOS</strong> · Track every sign · Early access drops</div>
            <button onClick={() => goStripe("goddess")} className="cta-shake" style={{width:"100%",padding:"14px",background:"linear-gradient(135deg,#d4a090,#B76E79)",border:"none",borderRadius:10,color:"#000",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"'Jost',sans-serif",letterSpacing:"0.08em",textTransform:"uppercase"}}>Activate Goddess · £33/mo →</button>
          </div>
          {/* LIFETIME */}
          <div style={{background:"#080604",border:"1px solid #d4a09033",borderRadius:14,padding:"18px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4}}>
              <span style={{fontSize:16,fontWeight:700,color:"#d4a090",fontFamily:"'Jost',sans-serif"}}>Lifetime Access</span>
              <span style={{fontSize:20,fontWeight:800,color:"#d4a090"}}>£500<span style={{fontSize:12,color:"#786860",fontWeight:400}}> once</span></span>
            </div>
            <div style={{fontSize:13,color:"#786860",marginBottom:12,lineHeight:1.5}}>Everything. Forever. Every future audio. No monthly billing. 1,000 spots only.</div>
            <button onClick={() => goStripe("lifetime")} style={{width:"100%",padding:"12px",background:"none",border:"1.5px solid #d4a09044",borderRadius:10,color:"#d4a090",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Jost',sans-serif",letterSpacing:"0.06em"}}>Claim Lifetime · £500 →</button>
          </div>
        </div>
        <div style={{textAlign:"center"}}><button onClick={onDemo} style={{background:"none",border:"none",color:"#786860",fontSize:12,cursor:"pointer",textDecoration:"underline"}}>Preview the portal first</button></div>
      </div>
    </div>
  );
}


/* ── HERO MARQUEE — 100 lines, random flash ────────────────────────────────── */
const MARQUEE_ITEMS = [
  {t:"He texts me first. Obviously.",c:"#B76E79"},{t:"Money finds me first.",c:"#c8a870"},{t:"Gorgeous is my default.",c:"#d4a090"},
  {t:"My DNA is shifting. Right now.",c:"#9a8ad0"},{t:"My highest timeline. Activated.",c:"#c8a870"},{t:"He's obsessed. Of course he is.",c:"#B76E79"},
  {t:"My skin is porcelain. Always.",c:"#d4a090"},{t:"I shift while I sleep.",c:"#7a9ab0"},{t:"Money arrives unexpectedly.",c:"#c8a870"},
  {t:"My bloodline is being rewritten.",c:"#9a8ad0"},{t:"He comes back. Every time.",c:"#B76E79"},{t:"My waist is always snatched.",c:"#d4a090"},
  {t:"£10,000 months are my baseline.",c:"#c8a870"},{t:"I receive. Constantly. Effortlessly.",c:"#B76E79"},{t:"My self-concept is permanent now.",c:"#9a8ad0"},
  {t:"He can't stop thinking about me.",c:"#B76E79"},{t:"I am radiant without trying.",c:"#d4a090"},{t:"My skin glows. Everyone sees it.",c:"#d4a090"},
  {t:"He chose me. Again.",c:"#B76E79"},{t:"Abundance is my default state.",c:"#c8a870"},{t:"My beauty is effortless.",c:"#d4a090"},
  {t:"He's already mine.",c:"#B76E79"},{t:"Money loves me. Of course it does.",c:"#c8a870"},{t:"I am the woman he keeps coming back to.",c:"#B76E79"},
  {t:"My cells hold my new identity.",c:"#9a8ad0"},{t:"My glow is undeniable.",c:"#d4a090"},{t:"Six figures is just the start.",c:"#c8a870"},
  {t:"He finds his way back. Every time.",c:"#B76E79"},{t:"My subconscious knows. It delivers.",c:"#9a8ad0"},{t:"I am paid just for existing.",c:"#c8a870"},
  {t:"My face is symmetrical and clear.",c:"#d4a090"},{t:"Of course it worked out. It always does.",c:"#c8a870"},{t:"He's devoted. Obviously.",c:"#B76E79"},
  {t:"My identity upgrades in my sleep.",c:"#9a8ad0"},{t:"I am magnetic. Naturally.",c:"#d4a090"},{t:"My wealth expands while I sleep.",c:"#c8a870"},
  {t:"He reaches out first. Always.",c:"#B76E79"},{t:"I embody my dream self. Naturally.",c:"#9a8ad0"},{t:"My energy is intoxicating.",c:"#d4a090"},
  {t:"My income is limitless.",c:"#c8a870"},{t:"I am the upgraded version. Now.",c:"#9a8ad0"},{t:"He misses me and he's saying it.",c:"#B76E79"},
  {t:"My bank account grows daily.",c:"#c8a870"},{t:"My nervous system knows who I am.",c:"#9a8ad0"},{t:"I look better every single day.",c:"#d4a090"},
  {t:"Love finds me. It always does.",c:"#B76E79"},{t:"I am always in the right place.",c:"#c8a870"},{t:"My body reflects my beliefs.",c:"#d4a090"},
  {t:"My SP is devoted. Obviously.",c:"#B76E79"},{t:"The installation is complete.",c:"#9a8ad0"},{t:"I receive in my sleep. Obviously.",c:"#7a9ab0"},
  {t:"I am stunning. It's obvious.",c:"#d4a090"},{t:"My financial reality is effortless.",c:"#c8a870"},{t:"He can't get me out of his head.",c:"#B76E79"},
  {t:"My highest self is my only self.",c:"#9a8ad0"},{t:"People notice. They can't help it.",c:"#d4a090"},{t:"My lineage shifts with me.",c:"#9a8ad0"},
  {t:"I am a money magnet. Obviously.",c:"#c8a870"},{t:"He's on his way back. Of course.",c:"#B76E79"},{t:"I wake up transformed.",c:"#7a9ab0"},
  {t:"My life is effortless luxury.",c:"#c8a870"},{t:"My subconscious is now on my side.",c:"#9a8ad0"},{t:"My skin is flawless. Obviously.",c:"#d4a090"},
  {t:"Everything works out for me. Always.",c:"#c8a870"},{t:"He's never leaving. I'm that girl.",c:"#B76E79"},{t:"My DNA reflects my desires.",c:"#9a8ad0"},
  {t:"I am chosen. Every single time.",c:"#B76E79"},{t:"Thirty days changes everything.",c:"#7a9ab0"},{t:"My frequency is locked in.",c:"#9a8ad0"},
  {t:"I am the most beautiful version of me.",c:"#d4a090"},{t:"The universe is obsessed with me.",c:"#c8a870"},{t:"My parallel reality is now.",c:"#9a8ad0"},
  {t:"He's constantly thinking of me.",c:"#B76E79"},{t:"My love life is effortless.",c:"#B76E79"},{t:"I am on the frequency of receiving.",c:"#c8a870"},
  {t:"Every listen deepens the install.",c:"#7a9ab0"},{t:"I am becoming her daily.",c:"#9a8ad0"},{t:"My reality bends to my self-concept.",c:"#9a8ad0"},
  {t:"Unexpected income is normal for me.",c:"#c8a870"},{t:"My sleep is doing the work.",c:"#7a9ab0"},{t:"I am irresistible. Obviously.",c:"#d4a090"},
  {t:"He comes back. Of course he does.",c:"#B76E79"},{t:"I exist on the frequency of abundance.",c:"#c8a870"},{t:"My cells shift with every listen.",c:"#9a8ad0"},
  {t:"Beauty is who I am.",c:"#d4a090"},{t:"Life is happening for me. Always.",c:"#c8a870"},{t:"My manifestations arrive fast.",c:"#c8a870"},
  {t:"My theta state holds my desires.",c:"#7a9ab0"},{t:"The new me is permanent now.",c:"#9a8ad0"},{t:"I attract what I want. Effortlessly.",c:"#c8a870"},
  {t:"My aura is undeniable.",c:"#d4a090"},{t:"Money comes from everywhere.",c:"#c8a870"},{t:"The shift is already done.",c:"#9a8ad0"},
  {t:"I am reprogramming daily.",c:"#7a9ab0"},{t:"He's obsessed with who I am.",c:"#B76E79"},{t:"Every night I become her more.",c:"#7a9ab0"},
];
function HeroMarquee() {
  const [lit, setLit] = useState(-1);
  const doubled = [...MARQUEE_ITEMS,...MARQUEE_ITEMS,...MARQUEE_ITEMS];
  useEffect(() => { const t = setInterval(() => setLit(Math.floor(Math.random()*MARQUEE_ITEMS.length)), 5500); return () => clearInterval(t); }, []);
  return (
    <div style={{ overflow:"hidden", marginBottom:24, maskImage:"linear-gradient(90deg,transparent,black 6%,black 94%,transparent)", WebkitMaskImage:"linear-gradient(90deg,transparent,black 6%,black 94%,transparent)" }}>
      <div className="marquee-track" style={{ gap:"0 36px" }}>
        {doubled.map((item,i) => { const idx=i%MARQUEE_ITEMS.length; const isLit=idx===lit; return (
          <span key={i} style={{ fontSize:11, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:isLit?"#fff":item.c, whiteSpace:"nowrap", fontFamily:"'Jost',sans-serif", transition:"color 0.12s, text-shadow 0.12s", textShadow:isLit?`0 0 18px ${item.c},0 0 36px ${item.c}66`:"none" }}>{item.t}</span>
        );})}
      </div>
    </div>
  );
}

/* ── MAXXING CAROUSEL ──────────────────────────────────────────────────────── */
function MaxxingCarousel({ cats }) {
  const [idx, setIdx] = useState(0);
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => { setFlash(true); setTimeout(() => { setIdx(i => (i+1)%cats.length); setFlash(false); }, 220); }, 1100);
    return () => clearInterval(timer);
  }, [cats.length]);
  const current = cats[idx];
  const next1 = cats[(idx+1)%cats.length];
  const next2 = cats[(idx+2)%cats.length];
  const next3 = cats[(idx+3)%cats.length];
  return (
    <div style={{ borderTop:"1px solid #1c1828", borderBottom:"1px solid #1c1828", marginBottom:0 }}>
      <div style={{ transition:"opacity 0.28s, transform 0.28s", opacity:flash?0:1, transform:flash?"scale(0.99)":"scale(1)", background:`linear-gradient(135deg,#060410,${current.color}10)`, borderBottom:`2px solid ${current.color}22`, padding:"52px 24px 44px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 80%,${current.color}06,transparent 70%)`,pointerEvents:"none" }}/>
        <div style={{ position:"absolute",inset:0,background:current.color,opacity:flash?0.03:0,transition:"opacity 0.1s",pointerEvents:"none" }}/>
        <div style={{ fontSize:10,color:current.color,fontWeight:800,letterSpacing:"0.3em",textTransform:"uppercase",marginBottom:20,fontFamily:"'Jost',sans-serif" }}>{current.label} ✦</div>
        <div className="wm" style={{ fontSize:"clamp(28px,5vw,64px)",lineHeight:1.05,color:"#f2ece4" }}>{current.tagline}</div>
      </div>
      <div style={{ display:"flex" }}>
        {[next1,next2,next3].map((cat,i) => (
          <div key={i} onClick={() => { setFlash(true); setTimeout(()=>{setIdx((idx+i+1)%cats.length);setFlash(false);},200); }}
            style={{ flex:1,padding:"16px 18px",background:"transparent",borderRight:i<2?"1px solid #1a1816":"none",cursor:"pointer",transition:"background 0.2s" }}
            onMouseEnter={e=>e.currentTarget.style.background=`${cat.color}10`} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{ fontSize:9,color:cat.color,fontWeight:800,letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:5,fontFamily:"'Jost',sans-serif" }}>{cat.label}</div>
            <div style={{ fontSize:12,color:"#786860",lineHeight:1.5 }}>{cat.tagline}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex",justifyContent:"center",gap:7,padding:"18px 0" }}>
        {cats.map((_,i) => <div key={i} onClick={()=>{setFlash(true);setTimeout(()=>{setIdx(i);setFlash(false);},200);}} style={{ width:i===idx?18:6,height:6,borderRadius:3,background:i===idx?current.color:"#181428",transition:"all 0.3s",cursor:"pointer" }}/>)}
      </div>
    </div>
  );
}

/* ── FAQ SECTION ───────────────────────────────────────────────────────────── */
const FAQS = [
  {q:"What exactly is Self Hypnosis Goddess?",a:"A private audio membership of original hypnosis tracks produced by Reshma Oracle. Each audio is layered with EMDR, binaural beats, and melodic house music to guide your brain into theta state — where the subconscious accepts new beliefs. No app download needed. Access everything through a web portal that plays like Spotify."},
  {q:"How is this different from YouTube hypnosis?",a:"The YouTube audios are free and public. The vault contains originals never published — longer, deeper, produced specifically to rewire the subconscious around specific desires. No ads at 3am. No algorithm deciding what you hear next."},
  {q:"Do I need headphones?",a:"Headphones maximise the binaural effect and are strongly recommended. The EMDR bilateral element works through left-right audio stimulation. AirPods, earbuds, over-ear — any pair works."},
  {q:"How long until I notice something shifting?",a:"Most members report something noticeable within 3 to 7 days — a small sign, a shift in how they feel about the desire, or a change in the obsessive loop. The install deepens with repetition. 30 days of consistent listening typically closes the old identity completely."},
  {q:"Can I listen while I sleep?",a:"Yes. This is one of the most effective ways to use the audios. Your conscious resistance is off. The subconscious is in delta and receives the installation without filtering. Several tracks are designed specifically for sleep listening."},
  {q:"What is ProofOS?",a:"ProofOS is the manifestation tracking system included in Goddess Tier. Log your desires, link them to the audio you listened to, capture signs as they arrive, and mark when it manifests. It creates a personal record of evidence so you can see the pattern building."},
  {q:"What's the difference between Audio and Goddess Tier?",a:"Audio Tier (£19/mo): full vault, all categories, new tracks weekly, loop player, sleep timer. Goddess Tier (£33/mo): everything in Audio plus ProofOS tracking, early access drops 48hrs before everyone else, and monthly ritual audio."},
  {q:"What is Lifetime Access?",a:"A one-time payment of £500 that gives you everything in Goddess Tier, every future audio ever released, every future feature, and no monthly billing. 1,000 spots only."},
  {q:"Can I cancel anytime?",a:"Yes. Cancel before your next renewal date and you will not be charged again. No refunds after 14 days from payment date."},
  {q:"Does this work if other subliminals didn't?",a:"Most subliminals fail because they use generic voices, poor production, or deliver affirmations to a conscious mind in beta state. SHG uses binaural beats and EMDR to bypass the conscious filter entirely — reaching the subconscious where belief actually lives."},
  {q:"What categories are in the vault?",a:"SP & Love · Money · Beauty · DNA Activation · Sleep Shifting · Identity · Lifemaxxing. New categories added based on member requests."},
  {q:"Is there a mobile app?",a:"The portal is a web app that works on any device in any browser. On iPhone: tap Share → Add to Home Screen. A dedicated iOS and Android app is in development."},
];
function FAQSection() {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ padding:"0 clamp(16px,4vw,24px) 80px",maxWidth:760,margin:"0 auto" }}>
      <div style={{ textAlign:"center",marginBottom:40 }}>
        <div style={{ fontSize:11,color:"#B76E79",letterSpacing:"0.25em",textTransform:"uppercase",fontWeight:700,marginBottom:14,fontFamily:"'Jost',sans-serif" }}>FAQs</div>
        <h2 className="wm" style={{ fontSize:"clamp(28px,4vw,48px)",color:"#f2ece4",lineHeight:1.2 }}>Everything you need to know.</h2>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:2 }}>
        {FAQS.map((faq,i) => (
          <div key={i} style={{ background:open===i?"#0d0a08":"#080604",border:"1px solid",borderColor:open===i?"#B76E7966":"#1c1828",borderRadius:12,overflow:"hidden",transition:"all 0.2s" }}>
            <button onClick={() => setOpen(open===i?null:i)} style={{ width:"100%",padding:"20px 22px",background:"none",border:"none",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",gap:16 }}>
              <span style={{ fontSize:15,fontWeight:600,color:open===i?"#f2ece4":"#c8b898",textAlign:"left",lineHeight:1.4 }}>{faq.q}</span>
              <span style={{ fontSize:20,color:"#B76E79",flexShrink:0,transform:open===i?"rotate(45deg)":"none",transition:"transform 0.2s" }}>+</span>
            </button>
            {open===i && <div style={{ padding:"0 22px 22px" }}><div style={{ height:1,background:"#1c1828",marginBottom:16 }}/><p style={{ fontSize:14,color:"#b09888",lineHeight:1.85,margin:0 }}>{faq.a}</p></div>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── LANDING PAGE ─────────────────────────────────────────────────────────── */
/* ── MOBILE HOOK — bypasses all CSS specificity issues ── */
function useMobile() {
  const [m, setM] = useState(() => typeof window !== "undefined" ? window.innerWidth <= 680 : false);
  useEffect(() => {
    const h = () => setM(window.innerWidth <= 680);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return m;
}
/* Grid helper — returns inline style that works on ALL devices */
const G2 = (m, gap = 16) => m
  ? { display: "flex", flexDirection: "column", gap: 14 }
  : { display: "grid", gridTemplateColumns: "1fr 1fr", gap };
const G3 = (m, gap = 16) => m
  ? { display: "flex", flexDirection: "column", gap: 14 }
  : { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap };
const G4 = (m, gap = 12) => m
  ? { display: "flex", flexDirection: "column", gap: 12 }
  : { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap };
const GPRICE = (m) => m
  ? { display: "flex", flexDirection: "column", gap: 14 }
  : { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 };
const GPROOF = (m) => m
  ? { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }
  : { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 };

function Landing({ onJoin, onDemo, onSignIn }) {
  const isMobile = useMobile();
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [billing, setBilling] = useState("monthly");
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);
  const audioRef = useRef(null);
  const vaultRef = useRef(null);
  const [vaultPlaying, setVaultPlaying] = useState(null);

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
    { old: "I have to work hard to receive money.", neu: "Money found me without effort.", proof: "£2,000 refund arrived out of nowhere. Day 6.", cat: "Money" },
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
      <audio ref={audioRef} src="https://qtwvslrwmreazmrdktsn.supabase.co/storage/v1/object/public/tracks/SPOILT%20INSTAGRAM%2013.04.2026.WAV" preload="none" />
      <audio ref={vaultRef} preload="none" />

      {/* ANNOUNCEMENT BANNER */}
      {!menuOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 400, background: "linear-gradient(90deg,#f0cdb8 0%,#e0b09a 20%,#d4a090 40%,#c8889a 65%,#B76E79 100%)", padding: isMobile ? "9px 14px" : "11px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: isMobile ? 8 : 14, flexWrap: "nowrap" }}>
          <span style={{ fontFamily: "'Jost',sans-serif", fontSize: isMobile ? 11 : 13, fontWeight: 700, color: "#000", letterSpacing: isMobile ? "0.06em" : "0.12em", whiteSpace: isMobile ? "normal" : "nowrap", textAlign: "center", lineHeight: 1.4, textTransform: "uppercase" }}>
            {isMobile ? "✦ Lifetime Access · £500 once · 1,000 spots" : "✦  LIFETIME ACCESS  ·  £500 once, forever  ·  1,000 spots only"}
          </span>
          <button onClick={() => { const el = document.getElementById("pricing"); el ? el.scrollIntoView({behavior:"smooth"}) : onJoin("founder"); }} style={{ padding: isMobile ? "4px 12px" : "5px 14px", background: "#000", border: "none", borderRadius: 20, color: "#B76E79", fontSize: isMobile ? 11 : 12, fontWeight: 800, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}>
            Claim
          </button>
        </div>
      )}

      {/* NAV */}
      <nav style={{ position: "fixed", top: 40, left: 0, right: 0, zIndex: 300, height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", background: "rgba(0,0,0,0.96)", borderBottom: "1px solid #1c1828", backdropFilter: "blur(20px)" }}>
        <span className="wm wm-shimmer" style={{ fontSize: 22, fontWeight: 500, letterSpacing: "0.02em", cursor: "pointer" }}>Self Hypnosis Goddess</span>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Btn size="sm" variant="ghost" onClick={onDemo} style={{ display: "none" }}>See Dashboard</Btn>
          <div style={{ display: isMobile ? "none" : "flex", alignItems: "center", gap: 10 }}>
          <button onClick={onSignIn || onDemo} style={{ padding: "10px 20px", background: "none", border: "1px solid #B76E7944", borderRadius: 22, color: "#B76E79", fontSize: 12, fontWeight: 600, cursor: "pointer", letterSpacing: "0.08em", fontFamily: "'Jost',sans-serif" }}>Sign in</button>
          <button onClick={onJoin} className="join-pulse cta-shake" style={{ padding: "11px 24px", background: "linear-gradient(135deg,#d4a090,#B76E79)", border: "none", borderRadius: 22, color: "#000", fontSize: 12, fontWeight: 800, cursor: "pointer", letterSpacing: "0.1em", fontFamily: "'Jost',sans-serif", textTransform: "uppercase" }}>Join now ✦</button>
        </div>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "1px solid rgba(215,185,130,0.14)", borderRadius: 8, padding: "8px 10px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 3 }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 16, height: 1.5, background: T.textMuted }} />)}
          </button>
        </div>
        {menuOpen && (
          <div style={{ position: "absolute", top: 58, right: 24, background: "#000000", border: "1px solid #1c1828", borderRadius: 14, padding: 10, minWidth: 200, zIndex: 400, boxShadow: "0 24px 60px rgba(0,0,0,0.8)" }}>
            {[["Preview Dashboard", onDemo], ["YouTube ↗", () => window.open("https://www.youtube.com/@Reshma.Oracle","_blank")], ["Instagram ↗", () => window.open("https://www.instagram.com/reshma.oracle/","_blank")]].map(([l,fn],i) => (
              <button key={i} onClick={() => { fn(); setMenuOpen(false); }} style={{ display:"block",width:"100%",textAlign:"left",padding:"11px 16px",background:"none",border:"none",color:T.textSecondary,fontSize:14,cursor:"pointer",borderRadius:8 }}
                onMouseEnter={e=>e.currentTarget.style.background="#12102a"}
                onMouseLeave={e=>e.currentTarget.style.background="none"}>{l}</button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <div style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: isMobile ? 100 : 110, overflow: "hidden", minHeight: isMobile ? "auto" : "90vh" }}>
        <Rings count={5} />
        {/* Dot grid overlay */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: "radial-gradient(circle, rgba(183,110,121,0.15) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
        }} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "clamp(52px,8vw,80px) clamp(20px,5vw,32px) clamp(52px,8vw,80px)", maxWidth: 800, margin: "0 auto", width: "100%" }}>
          {/* Soundwave */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, height: 56, marginBottom: 28 }}>
            {Array.from({ length: 24 }).map((_, i) => {
              const heights = [8,18,30,22,38,26,42,20,34,16,40,24,36,28,18,42,22,32,14,26,20,36,24,30];
              return <div key={i} style={{ width: 3, borderRadius: 2, height: heights[i], background: `linear-gradient(180deg,${T.champagne},${T.rose})`, animation: `wave ${0.9+(i%5)*0.15}s ease-in-out infinite`, animationDelay: `${i*0.06}s`, opacity: 0.6+(i%3)*0.12 }} />;
            })}
          </div>


          {/* AS SEEN ON YOUTUBE */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16, marginBottom:32, flexWrap:"wrap" }}>
            <div style={{ fontSize:11, color:"#786860", letterSpacing:"0.15em", textTransform:"uppercase", fontFamily:"'Jost',sans-serif" }}>As heard on</div>
            <div style={{ display:"flex", alignItems:"center", gap:8, background:"#0d0a08", border:"1px solid #2a1a14", borderRadius:24, padding:"8px 16px", gap:10 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#ff0000"><path d="M23.8 7.2s-.2-1.7-1-2.4c-.9-1-1.9-1-2.4-1.1C17.2 3.5 12 3.5 12 3.5s-5.2 0-8.4.2c-.5.1-1.5.1-2.4 1.1-.8.7-1 2.4-1 2.4S0 9.1 0 11v1.8c0 1.9.2 3.8.2 3.8s.2 1.7 1 2.4c.9 1 2.1.9 2.6 1C5.6 20.2 12 20.2 12 20.2s5.2 0 8.4-.3c.5-.1 1.5-.1 2.4-1.1.8-.7 1-2.4 1-2.4s.2-1.9.2-3.8V11c0-1.9-.2-3.8-.2-3.8zM9.5 15.5v-7l6.5 3.5-6.5 3.5z"/></svg>
              <span style={{ fontSize:12, color:"#c8b898", fontWeight:600 }}>@Reshma.Oracle · 5,700 subscribers</span>
            </div>
            <div style={{ fontSize:11, color:"#786860" }}>· Spotify · Podcasts</div>
          </div>
          <HeroMarquee />

          {/* TITLE */}
          <h1 className="wm" style={{ lineHeight: 1.05, marginBottom: 12 }}>
            <span style={{ fontSize: "clamp(30px,8vw,72px)", background: "linear-gradient(135deg,#f2ece4 0%,#d4a090 40%,#B76E79 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "block" }}>Self Hypnosis Goddess</span>
            <span style={{ fontSize: "clamp(22px,5.5vw,52px)", color: "#f2ece4", fontWeight: 300, letterSpacing: "0.03em", display: "block", marginTop: 4 }}>Audio Library</span>
            <span style={{ fontSize: "clamp(14px,2.5vw,22px)", color: "#B76E79", fontWeight: 400, letterSpacing: "0.08em", display: "block", marginTop: 2 }}>(+ ProofOS)</span>
          </h1>

          {/* SPOTIFY TAGLINE */}
          <div style={{ fontSize: "clamp(11px,1.4vw,13px)", color: "#786860", letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700, marginBottom: 14, fontFamily: "'Jost',sans-serif" }}>
            The Spotify for your subconscious mind
          </div>

          {/* TAGLINE */}
          <div style={{ fontSize: "clamp(18px,2.5vw,24px)", color: T.roseGold, fontWeight: 600, marginBottom: 10, letterSpacing: "0.01em" }}>
            Shift into your dream reality.
          </div>

          {/* WAKE UP KNOWING */}
          <div style={{ fontSize: "clamp(15px,1.8vw,18px)", color: T.textMuted, marginBottom: 32, lineHeight: 1.7 }}>
            Wake up knowing. Not hoping. <span style={{ color: T.textPrimary, fontWeight: 600 }}>Knowing.</span>
          </div>

          {/* SPOTIFY-STYLE PLAYER */}
          <div style={{ background: "linear-gradient(160deg,#0c0810,#100a14)", border: "1px solid #B76E7933", borderRadius: 16, padding: isMobile ? "16px" : "20px 24px", maxWidth: 520, margin: "0 auto 36px", boxShadow: "0 8px 60px rgba(183,110,121,0.15)" }}>
            {/* Top row — track info + waveform */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              {/* Album art */}
              <div style={{ width: 56, height: 56, borderRadius: 10, background: "linear-gradient(135deg,#d4a090,#B76E79)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: "0 4px 20px rgba(183,110,121,0.4)" }}>✦</div>
              {/* Track info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: isMobile ? 15 : 17, fontWeight: 700, color: "#f2ece4", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Spoilt Goddess</div>
                <div style={{ fontSize: 12, color: "#B76E79", fontFamily: "'Jost',sans-serif", fontWeight: 600, letterSpacing: "0.06em" }}>Reshma Oracle</div>
                <div style={{ fontSize: 11, color: "#786860", fontFamily: "'Jost',sans-serif", marginTop: 2 }}>Melodic House · EMDR · 528hz</div>
              </div>
              {/* Live badge */}
              {playing && (
                <div style={{ display: "flex", alignItems: "center", gap: 5, background: "#B76E7918", border: "1px solid #B76E7944", borderRadius: 20, padding: "4px 10px", flexShrink: 0 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#B76E79", animation: "pulse 1.2s ease-in-out infinite" }}/>
                  <span style={{ fontSize: 10, color: "#B76E79", fontFamily: "'Jost',sans-serif", fontWeight: 700 }}>LIVE</span>
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ height: 4, background: "#1e1828", borderRadius: 2, cursor: "pointer", position: "relative" }}
                onClick={e => { const r=e.currentTarget.getBoundingClientRect(); if(audioRef.current?.duration) audioRef.current.currentTime=((e.clientX-r.left)/r.width)*audioRef.current.duration; }}
                onMouseEnter={e => e.currentTarget.children[0].style.height="6px"}
                onMouseLeave={e => e.currentTarget.children[0].style.height="4px"}>
                <div style={{ width:`${progress}%`, height:"100%", background:"linear-gradient(90deg,#d4a090,#B76E79)", borderRadius:2, transition:"height 0.1s", position:"relative" }}>
                  <div style={{ position:"absolute", right:-4, top:"50%", transform:"translateY(-50%)", width:10, height:10, borderRadius:"50%", background:"#f2ece4", boxShadow:"0 0 6px rgba(183,110,121,0.8)", opacity: playing ? 1 : 0 }}/>
                </div>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
                <span style={{ fontSize:10, color:"#786860", fontFamily:"'Jost',sans-serif" }}>{playing ? `${Math.floor((audioRef.current?.currentTime||0)/60)}:${String(Math.floor((audioRef.current?.currentTime||0)%60)).padStart(2,"0")}` : "0:00"}</span>
                <span style={{ fontSize:10, color:"#786860", fontFamily:"'Jost',sans-serif" }}>4:32</span>
              </div>
            </div>

            {/* Controls row */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              {/* Shuffle */}
              <button style={{ background:"none", border:"none", cursor:"pointer", fontSize:16, color:"#786860", padding:4 }} title="Shuffle">⇌</button>
              {/* Prev */}
              <button style={{ background:"none", border:"none", cursor:"pointer", fontSize:20, color:"#c8b898", padding:4 }} title="Previous">⏮</button>
              {/* Play/Pause — big */}
              <button onClick={togglePlay} style={{ width:52, height:52, borderRadius:"50%", background:"linear-gradient(135deg,#d4a090,#B76E79)", border:"none", color:"#000", fontSize:22, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 20px rgba(183,110,121,0.5)", transition:"transform 0.1s, box-shadow 0.1s" }}
                onMouseEnter={e=>{e.target.style.transform="scale(1.06)";e.target.style.boxShadow="0 6px 28px rgba(183,110,121,0.7)"}}
                onMouseLeave={e=>{e.target.style.transform="scale(1)";e.target.style.boxShadow="0 4px 20px rgba(183,110,121,0.5)"}}>
                {playing ? "⏸" : "▶"}
              </button>
              {/* Next */}
              <button style={{ background:"none", border:"none", cursor:"pointer", fontSize:20, color:"#c8b898", padding:4 }} title="Next">⏭</button>
              {/* Loop */}
              <button style={{ background:"none", border:"none", cursor:"pointer", fontSize:16, color:"#B76E79", padding:4 }} title="Loop">↻</button>
            </div>

            {/* Bottom — playing status */}
            <div style={{ textAlign:"center", marginTop:12, fontSize:11, color:"#786860", fontFamily:"'Jost',sans-serif" }}>
              {playing ? "✦ Playing — continues in background" : "Tap ▶ to listen — free preview"}
            </div>
          </div>

          {/* PAIN POINT */}
                    {/* HERO CTA BUTTONS */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 16, flexDirection: isMobile ? "column" : "row", alignItems: "stretch", maxWidth: isMobile ? 340 : "none", margin: isMobile ? "0 auto 16px" : "0 0 16px" }}>
            <button onClick={onJoin} className="cta-pulse cta-shake" style={{ padding: "16px 40px", background: "linear-gradient(135deg,#d4a090,#B76E79)", border: "none", borderRadius: 14, color: "#000", fontSize: 16, fontWeight: 800, cursor: "pointer", letterSpacing: "0.1em", fontFamily: "'Jost',sans-serif", textTransform: "uppercase", width: isMobile ? "100%" : "auto" }}>
              START LISTENING ✦
            </button>
            <button onClick={() => { window.open("https://buy.stripe.com/00w8wP2tbgaG3pffdu7AI02","_blank"); }} style={{ padding: "16px 32px", width: isMobile ? "100%" : "auto", background: "transparent", border: "1.5px solid #B76E7966", borderRadius: 14, color: "#B76E79", fontSize: 16, fontWeight: 300, cursor: "pointer", letterSpacing: "0.1em" }}>
              LIFETIME ACCESS →
            </button>
          </div>
          <div style={{ fontSize: 13, color: T.textFaint, textAlign: "center", marginBottom: 32 }}>Audio Tier £19/mo · Goddess Tier £33/mo · Cancel anytime</div>

          {/* HERO IMAGE PLACEHOLDER */}
          <div style={{ maxWidth: 680, margin: "0 auto 0", borderRadius: 24, overflow: "hidden", border: "1px solid #2a0a28", background: "linear-gradient(160deg,#000000,#06040c)", height: isMobile ? 260 : 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, position: "relative" }}>
            <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 40%,#B76E7912,transparent 65%)",pointerEvents:"none" }}/>
            <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at 20% 80%,#d4a09008,transparent 60%)",pointerEvents:"none" }}/>
            {/* Floating labels like ClickUp */}
            <div style={{ position:"absolute",top:isMobile?16:28,left:isMobile?16:32,background:"#0a0806",border:"1px solid #B76E7944",borderRadius:20,padding:"6px 14px",display:"flex",alignItems:"center",gap:8 }}>
              <div style={{ width:6,height:6,borderRadius:"50%",background:"#B76E79" }}/>
              <span style={{ fontSize:10,color:"#d4a090",fontWeight:700,letterSpacing:"0.12em",fontFamily:"'Jost',sans-serif",textTransform:"uppercase" }}>EMDR bilateral activation</span>
            </div>
            <div style={{ position:"absolute",top:isMobile?16:28,right:isMobile?16:32,background:"#0a0806",border:"1px solid #d4a09044",borderRadius:20,padding:"6px 14px",display:"flex",alignItems:"center",gap:8 }}>
              <div style={{ width:6,height:6,borderRadius:"50%",background:"#d4a090" }}/>
              <span style={{ fontSize:10,color:"#d4a090",fontWeight:700,letterSpacing:"0.12em",fontFamily:"'Jost',sans-serif",textTransform:"uppercase" }}>Theta state in 8 min</span>
            </div>
            <div style={{ position:"absolute",bottom:isMobile?16:28,left:isMobile?16:32,background:"#0a0806",border:"1px solid #B76E7944",borderRadius:20,padding:"6px 14px",display:"flex",alignItems:"center",gap:8 }}>
              <div style={{ width:6,height:6,borderRadius:"50%",background:"#7a9ab0" }}/>
              <span style={{ fontSize:10,color:"#b0c0d0",fontWeight:700,letterSpacing:"0.12em",fontFamily:"'Jost',sans-serif",textTransform:"uppercase" }}>528hz · 432hz · Delta</span>
            </div>
            <div style={{ position:"absolute",bottom:isMobile?16:28,right:isMobile?16:32,background:"#0a0806",border:"1px solid #d4a09044",borderRadius:20,padding:"6px 14px",display:"flex",alignItems:"center",gap:8 }}>
              <div style={{ width:6,height:6,borderRadius:"50%",background:"#B76E79" }}/>
              <span style={{ fontSize:10,color:"#d4a090",fontWeight:700,letterSpacing:"0.12em",fontFamily:"'Jost',sans-serif",textTransform:"uppercase" }}>50+ exclusive tracks</span>
            </div>
            {/* Centre */}
            <div style={{ textAlign:"center", zIndex:1 }}>
              <div style={{ fontSize:isMobile?48:72,marginBottom:12 }}>🎧</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:isMobile?18:24,color:"#f2ece4",marginBottom:6 }}>Sleeping. Listening. Shifting.</div>
              <div style={{ fontSize:11,color:"#786860",letterSpacing:"0.15em",textTransform:"uppercase",fontFamily:"'Jost',sans-serif" }}>[ Replace with brand image ]</div>
            </div>
          </div>

        </div>
      </div>

      {/* THE PROBLEM SECTION */}
      <div style={{ padding: isMobile ? "48px 18px" : "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: "#B76E79", letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>Why it hasn't worked yet</div>
          <h2 className="wm" style={{ fontSize: "clamp(28px,4vw,52px)", color: T.textPrimary, lineHeight: 1.15, marginBottom: 16 }}>
            You've done everything.<br />
            <span style={{ background: "linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Nothing's changed.</span>
          </h2>
          <p style={{ fontSize: "clamp(15px,1.8vw,18px)", color: T.textMuted, lineHeight: 1.85, maxWidth: 580, margin: "0 auto" }}>
            Scripting. Affirmations. Vision boards. You've done everything right. You're still waiting. The problem isn't your effort. <strong style={{ color: "#f2ece4" }}>It's your brainwave state.</strong>
          </p>
        </div>
        <div style={{ ...G3(isMobile), gap: 20 }}>
          {[
            {
              num: "01",
              title: "Your brain hasn't entered theta state",
              body: "Conscious effort — journaling, affirming, visualising — operates at beta frequency. The subconscious mind is only accessible in theta (4–8 Hz). Without it, you're installing nothing. You're talking to a locked door.",
              fix: "SHG audios use binaural beats and EMDR to drop you into theta within minutes."
            },
            {
              num: "02",
              title: "Generic affirmations don't resonate with your nervous system",
              body: "A stranger's voice. Generic words. No EMDR. No frequency. Your subconscious mind is pattern-matching whether this input feels true and familiar. If the voice, energy, or specificity is off — it rejects it. Nothing installs.",
              fix: "Reshma's voice is calibrated to guide your nervous system into receptivity. The specificity is what makes it land."
            },
            {
              num: "03",
              title: "You have no way to track what's shifting",
              body: "Without a system to capture signs, synchronicities, and evidence — you give up before the rewire is complete. You can't see the progress, so you assume nothing's working. You stop at day 9. It would have landed on day 14.",
              fix: "ProofOS links every audio session to real evidence. You see the pattern building in real time."
            }
          ].map((p, i) => (
            <div key={i} style={{ background: "#000000", border: "1px solid #1c1828", borderRadius: 16, padding: 28, borderTop: "2px solid #B76E79" }}>
              <div style={{ fontSize: 11, color: "#B76E7966", fontWeight: 700, letterSpacing: "0.2em", marginBottom: 14 }}>{p.num}</div>
              <div style={{ fontSize: "clamp(15px,1.6vw,18px)", fontWeight: 700, color: T.textPrimary, marginBottom: 14, lineHeight: 1.4 }}>{p.title}</div>
              <p style={{ fontSize: 14, color: T.textMuted, lineHeight: 1.85, marginBottom: 16 }}>{p.body}</p>
              <div style={{ fontSize: 13, color: "#B76E79", fontWeight: 500, paddingTop: 14, borderTop: "1px solid #1c1828" }}>✦ {p.fix}</div>
            </div>
          ))}
        </div>
      </div>


      {/* IMAGE PLACEHOLDER — brain state visual */}
      <div style={{ padding: "0 clamp(16px,4vw,24px) 24px", maxWidth: 760, margin: "0 auto" }}>
        <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid #2a1a14", background: "linear-gradient(135deg,#000000,#08060e)", height: isMobile ? 220 : 320, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 30%,#B76E7910,transparent 70%)", pointerEvents: "none" }}/>
          <div style={{ fontSize: isMobile ? 40 : 56 }}>🧠</div>
          <div style={{ fontSize: isMobile ? 14 : 16, color: "#B76E79", fontWeight: 600, fontFamily: "'Jost',sans-serif", letterSpacing: "0.15em", textTransform: "uppercase" }}>Theta state · 4–8 Hz</div>
          <div style={{ fontSize: isMobile ? 12 : 14, color: "#786860", textAlign: "center", maxWidth: 360, lineHeight: 1.6 }}>The subconscious is only accessible in theta.<br/>This is where the install happens.</div>
          <div style={{ fontSize: 10, color: "#3a2a1a", marginTop: 8, fontFamily: "'Jost',sans-serif", letterSpacing: "0.15em" }}>[ BRAND IMAGE — replace with brain scan visual ]</div>
        </div>
      </div>
      {/* PROOFOS INTRO — peach section */}
      <div style={{ padding: isMobile ? "48px 18px" : "70px 24px", background: "linear-gradient(180deg,#000 0%,#08030a 50%,#000 100%)", borderTop: "1px solid #2a0a2a", borderBottom: "1px solid #2a0a2a" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 11, color: "#B76E79", letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Goddess Tier · Included</div>
            <h2 className="wm" style={{ fontSize: "clamp(28px,4vw,52px)", lineHeight: 1.1, marginBottom: 16 }}>
              <span style={{ color: "#f2ece4" }}>Introducing </span>
              <span style={{ background: "linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ProofOS</span>
            </h2>
            <p style={{ fontSize: "clamp(15px,1.8vw,18px)", color: "#b09888", lineHeight: 1.8, maxWidth: 560, margin: "0 auto" }}>
              The system that links every audio you listen to with real evidence of what shifts. Not journaling. Not affirmations. <strong style={{ color: "#f2ece4" }}>Proof.</strong>
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 14, flexWrap: "nowrap" }}>
            {[
              { num: "01", icon: "🎧", title: "Listen", body: "Press play. Sleep with it on. Let the audio do the work while your conscious mind rests." },
              { num: "02", icon: "🧵", title: "Link", body: "Open a Proof Thread for your specific desire. Link it to the audio that's working on it." },
              { num: "03", icon: "📷", title: "Capture", body: "Log signs, synchronicities, photo proof, voice notes. Anything that arrives — capture it here." },
              { num: "04", icon: "★", title: "Mark manifested", body: "When it arrives, mark it. See exactly how many days it took and which audio preceded it." },
            ].map((s, i) => (
              <div key={i} style={{ background: "#000000", border: "1px solid #1c1828", borderRadius: 14, padding: "22px 18px", borderTop: "2px solid #B76E79" }}>
                <div style={{ fontSize: 10, color: "#B76E7955", fontWeight: 700, letterSpacing: "0.2em", marginBottom: 10 }}>{s.num}</div>
                <div style={{ fontSize: 22, marginBottom: 10 }}>{s.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#f2ece4", marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: "#786860", lineHeight: 1.7 }}>{s.body}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 28 }}>
            <span style={{ fontSize: 13, color: "#B76E79", fontWeight: 500 }}>Included in Goddess Tier · £33/mo</span>
          </div>
        </div>
      </div>

            {/* MELODIC HOUSE USP */}
      <div style={{ padding: isMobile ? "0 18px 48px" : "0 clamp(16px,4vw,24px) 70px", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ background: "#000000", border: "1px solid #B76E7933", borderRadius: 20, padding: "36px 40px", position: "relative", overflow: "hidden" }}>
          {/* Background glow */}
          <div style={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(circle,#C8A05012,transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 11, color: "#B76E79", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 14, textAlign: "center" }}>What makes this different</div>
            <h2 className="wm" style={{ fontSize: "clamp(32px,5vw,60px)", lineHeight: 1.1, marginBottom: 16, background: "linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textAlign: "center" }}>
              Hypnosis layered beneath<br />melodic house music.
            </h2>
            <p style={{ fontSize: "clamp(16px,2vw,19px)", color: "#d8c8a0", lineHeight: 1.85, marginBottom: 24, maxWidth: 680, textAlign: "center", margin: "0 auto 24px" }}>
              Reshma's audios are produced with melodic house music as the sonic foundation. This is not background noise. The music is chosen and layered at specific frequencies to keep the body in a receptive, open state — so Reshma's voice can reach deeper.
            </p>
            <p style={{ fontSize: "clamp(15px,1.8vw,17px)", color: "#b09888", lineHeight: 1.85, marginBottom: 28, maxWidth: 680, textAlign: "center", margin: "0 auto 28px" }}>
              You will not find this anywhere else. Most hypnosis is voice-only or layered with generic ambient sound. This is a different experience — one that makes listening feel like a ritual, not a task.
            </p>
            <div style={G3(isMobile)}>
              {[
                { icon: "◈", title: "Music as frequency", body: "The melodic house tracks are selected to hold a specific energetic state throughout the session." },
                { icon: "✦", title: "Deeper receptivity", body: "Music bypasses resistance. The body relaxes. The subconscious opens. Reshma's voice installs the new self-concept." },
                { icon: "★", title: "Ritual, not content", body: "Listening is not consuming content. It is a daily practice. The music makes you want to return." },
              ].map((c, i) => (
                <div key={i} style={{ background: "#0d0c02", border: "1px solid #161228", borderRadius: 14, padding: "18px 16px" }}>
                  <div style={{ fontSize: 20, background: "linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 10 }}>{c.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#f4ead8", marginBottom: 8 }}>{c.title}</div>
                  <div style={{ fontSize: 13, color: "#b09888", lineHeight: 1.7 }}>{c.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

{/* MAXXING CAROUSEL */}
      <MaxxingCarousel cats={cats} />

      {/* LANDING PROOF WALL — rose section */}
      <div style={{ padding: isMobile ? "48px 18px" : "70px clamp(16px,4vw,24px)", maxWidth: 900, margin: "0 auto", background: "linear-gradient(180deg,#000 0%,#120814 50%,#000 100%)", borderTop: "1px solid #280828", borderBottom: "1px solid #280828" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 11, color: "#B76E79", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 14 }}>ProofOS · Real evidence</div>
          <h2 className="wm" style={{ fontSize: "clamp(28px,4vw,44px)", color: T.textPrimary, lineHeight: 1.15, marginBottom: 14 }}>
            Proof Wall.<br />
            <span style={{ background: "linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>The evidence captured.</span>
          </h2>
          <p style={{ fontSize: 15, color: T.textMuted, lineHeight: 1.8, maxWidth: 520, margin: "0 auto" }}>Screenshot the bank transfer. Record the moment something shifts. Log the sign. Every piece of evidence linked to the audio that preceded it.</p>
        </div>
        <div style={{...GPROOF(isMobile), marginBottom: 12}}>
          {[
            {
              type: "bank", label: "Bank Transfer", sub: "10 days of listening · Money finds me first",
              render: () => (
                <div style={{ background: "linear-gradient(160deg,#040a08,#060e0a)", borderRadius: 12, overflow: "hidden", border: "1px solid #1a3a1a" }}>
                  <div style={{ background: "#060e0a", padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1a3a1a" }}>
                    <span style={{ fontSize: 9, color: "#4a8a4a", fontFamily: "'Jost',sans-serif", fontWeight: 700, letterSpacing: "0.15em" }}>BANKING APP · NOTIFICATION</span>
                    <span style={{ fontSize: 9, color: "#3a6a3a" }}>✓ Received</span>
                  </div>
                  <div style={{ padding: "18px 16px" }}>
                    <div style={{ fontSize: 11, color: "#4a8a4a", marginBottom: 6, fontFamily: "'Jost',sans-serif" }}>Payment received</div>
                    <div style={{ fontSize: 32, fontWeight: 800, color: "#5ab06a", fontFamily: "'Jost',sans-serif", marginBottom: 6 }}>£5,000</div>
                    <div style={{ fontSize: 10, color: "#3a6a3a" }}>Day 8 · 23:47 · Transferred in full</div>
                  </div>
                  <div style={{ padding: "10px 16px", background: "#060e08", borderTop: "1px solid #1a3a1a" }}>
                    <div style={{ fontSize: 10, color: "#B76E79", fontFamily: "'Jost',sans-serif", letterSpacing: "0.1em" }}>✦ Linked to: Money Finds Me First</div>
                  </div>
                </div>
              )
            },
            {
              type: "message", label: "Message Screenshot", sub: "3 hours after listening · He texted first",
              render: () => (
                <div style={{ background: "#06040c", borderRadius: 12, overflow: "hidden", border: "1px solid #2a1a2a" }}>
                  <div style={{ background: "#0c0612", padding: "10px 14px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #2a1a2a" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#d4a090,#B76E79)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>H</div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#f2ece4" }}>Him</div>
                      <div style={{ fontSize: 9, color: "#786860" }}>Today 14:23</div>
                    </div>
                  </div>
                  <div style={{ padding: "16px 14px" }}>
                    <div style={{ background: "#1e1220", borderRadius: "14px 14px 14px 4px", padding: "12px 16px", display: "inline-block", maxWidth: "85%" }}>
                      <div style={{ fontSize: 15, color: "#f2ece4", fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", lineHeight: 1.5 }}>I miss you. Been thinking about you constantly. Can we talk?</div>
                    </div>
                  </div>
                  <div style={{ padding: "10px 16px", background: "#0a0610", borderTop: "1px solid #2a1a2a" }}>
                    <div style={{ fontSize: 10, color: "#B76E79", fontFamily: "'Jost',sans-serif", letterSpacing: "0.1em" }}>✦ Linked to: He Finds His Way Back</div>
                  </div>
                </div>
              )
            },
            {
              type: "skin", label: "Mirror Selfie", sub: "Day 14 · They all noticed",
              render: () => (
                <div style={{ background: "linear-gradient(160deg,#080408,#0e0610)", borderRadius: 12, overflow: "hidden", border: "1px solid #2a1a18" }}>
                  <div style={{ height: 100, background: "linear-gradient(160deg,#1a0e10,#250e14)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, borderBottom: "1px solid #2a1a18", position: "relative" }}>
                    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 30%,#d4a09015,transparent 70%)" }}/>
                    <div style={{ fontSize: 11, color: "#d4a090", fontFamily: "'Jost',sans-serif", fontWeight: 700, letterSpacing: "0.2em" }}>✦ SKIN GLOW · DAY 14</div>
                    <div style={{ fontSize: 22, color: "#d4a090", letterSpacing: 4 }}>◦ ◦ ◦</div>
                    <div style={{ fontSize: 10, color: "#8a6858", fontStyle: "italic" }}>What are you doing differently?</div>
                  </div>
                  <div style={{ padding: "12px 16px" }}>
                    <div style={{ fontSize: 13, color: "#d4c0a8", fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", lineHeight: 1.65 }}>"Three people asked what I was doing differently. My skin has never looked like this."</div>
                  </div>
                  <div style={{ padding: "10px 16px", background: "#0c0608", borderTop: "1px solid #2a1a18" }}>
                    <div style={{ fontSize: 10, color: "#B76E79", fontFamily: "'Jost',sans-serif", letterSpacing: "0.1em" }}>✦ Linked to: Gorgeous Is My Default</div>
                  </div>
                </div>
              )
            },
            {
              type: "angel", label: "Angel Numbers", sub: "555 · Three times in one day",
              render: () => (
                <div style={{ background: "linear-gradient(160deg,#08060a,#0c080e)", borderRadius: 12, overflow: "hidden", border: "1px solid #2a2200" }}>
                  <div style={{ padding: "22px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: 42, fontWeight: 900, color: "#c8a840", fontFamily: "'Jost',sans-serif", letterSpacing: 8, marginBottom: 8, textShadow: "0 0 30px #c8a84044" }}>555</div>
                    <div style={{ fontSize: 11, color: "#8a8040", fontFamily: "'Jost',sans-serif", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>Angel Number · Three times today</div>
                    <div style={{ fontSize: 12, color: "#c8b878", fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", lineHeight: 1.6 }}>Clock · Number plate · Total on receipt</div>
                  </div>
                  <div style={{ padding: "10px 16px", background: "#000000", borderTop: "1px solid #2a2200" }}>
                    <div style={{ fontSize: 10, color: "#B76E79", fontFamily: "'Jost',sans-serif", letterSpacing: "0.1em" }}>✦ Linked to: Highest Timeline Activated</div>
                  </div>
                </div>
              )
            },
            {
              type: "voice", label: "Voice Note", sub: "Day 3 · Recorded in the moment",
              render: () => (
                <div style={{ background: "#000000", borderRadius: 12, overflow: "hidden", border: "1px solid #1a2030" }}>
                  <div style={{ padding: "18px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ fontSize: 11, color: "#7a9ab0", fontFamily: "'Jost',sans-serif", fontWeight: 700, letterSpacing: "0.15em" }}>VOICE PROOF · DAY 3</div>
                    <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
                      {[6,14,20,10,18,8,22,12,18,6,16,10,20,8,14,18,10,16].map((h,j) => (
                        <div key={j} style={{ width: 2, height: h, borderRadius: 1, background: `linear-gradient(180deg,#d4a090,#B76E79)`, opacity: 0.8 }}/>
                      ))}
                    </div>
                    <div style={{ fontSize: 13, color: "#c8b898", fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", lineHeight: 1.65 }}>"I woke up knowing before anything happened."</div>
                  </div>
                  <div style={{ padding: "10px 16px", background: "#050608", borderTop: "1px solid #1a2030" }}>
                    <div style={{ fontSize: 10, color: "#B76E79", fontFamily: "'Jost',sans-serif", letterSpacing: "0.1em" }}>✦ Linked to: I Am the Lucky Girl</div>
                  </div>
                </div>
              )
            },
            {
              type: "money2", label: "Transfer #2", sub: "Day 21 · Money keeps arriving",
              render: () => (
                <div style={{ background: "linear-gradient(160deg,#040a08,#060e0a)", borderRadius: 12, overflow: "hidden", border: "1px solid #1a3a1a" }}>
                  <div style={{ padding: "18px 16px" }}>
                    <div style={{ fontSize: 11, color: "#4a8a4a", marginBottom: 8, fontFamily: "'Jost',sans-serif" }}>Payment received</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: "#5ab06a", fontFamily: "'Jost',sans-serif", marginBottom: 6 }}>£2,500</div>
                    <div style={{ fontSize: 10, color: "#3a6a3a" }}>Day 21 · Second unexpected payment</div>
                    <div style={{ fontSize: 12, color: "#6ab07a", fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", marginTop: 10, lineHeight: 1.6 }}>"It just keeps coming. Of course it does."</div>
                  </div>
                  <div style={{ padding: "10px 16px", background: "#060e08", borderTop: "1px solid #1a3a1a" }}>
                    <div style={{ fontSize: 10, color: "#B76E79", fontFamily: "'Jost',sans-serif", letterSpacing: "0.1em" }}>✦ Linked to: Money Finds Me First</div>
                  </div>
                </div>
              )
            },
          ].map((p, i) => p.render())}
        </div>
        <div style={{ background: "#000000", border: "1px solid #B76E7933", borderRadius: 14, padding: "14px 18px", display: "flex", gap: 14, alignItems: "center" }}>
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
          <p style={{ fontSize: 19, color: T.textMuted, lineHeight: 1.9, maxWidth: 700, margin: "0 auto" }}>
            You can read every book. Study Neville Goddard. Understand every theory. But theory without installation changes nothing. These audios install it — passively, at depth, while your conscious mind rests.
          </p>
        </div>

        {/* AUDIO SAMPLES */}
      <div style={{ padding: "0 clamp(16px,4vw,24px) 70px", maxWidth: 720, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 11, color: "#B76E79", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 14 }}>Inside the vault</div>
          <h2 className="wm" style={{ fontSize: "clamp(28px,4vw,44px)", color: T.textPrimary, lineHeight: 1.15, marginBottom: 14 }}>
            Three formats.<br />
            <span style={{ background: "linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>One voice. Your subconscious.</span>
          </h2>
          <p style={{ fontSize: 15, color: T.textMuted, lineHeight: 1.8, maxWidth: 480, margin: "0 auto" }}>
            Melodic house for deep receptivity. Sleep subliminals for overnight installation. Vocals only for pure hypnotic induction. Reshma decides the format for each desire.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { title: "Spoilt Goddess", format: "Melodic House · EMDR · 528hz", freq: "528hz", badge: "Melodic House", badgeColor: "#d4a090", icon: "🎵", desc: "Self-concept. Receiving. Identity. Reshma's voice layered beneath melodic house music.", url: "https://qtwvslrwmreazmrdktsn.supabase.co/storage/v1/object/public/tracks/SPOILT%20INSTAGRAM%2013.04.2026.WAV" },
            { title: "While I Sleep I Manifest", format: "Subliminal · Music Only · No Voice", freq: "Delta", badge: "Subliminal", badgeColor: "#7a9ab0", icon: "🌙", desc: "Pure frequency. No voice. Affirmations beneath melodic house — works while you sleep.", url: "https://qtwvslrwmreazmrdktsn.supabase.co/storage/v1/object/public/tracks/29.06.2026-6.mp3" },
            { title: "Money Finds Me First", format: "Spoken Hypnosis · 528hz", freq: "528hz", badge: "Locked Preview", badgeColor: "#786860", icon: "🔒", desc: "Full track inside the vault. Join to unlock — plus 50+ more across every category." },
          ].map((a, i) => (
            <div key={i} style={{ background: "#000000", border: "1px solid #1c1828", borderRadius: 14, padding: "16px 20px", display: "flex", gap: 14, alignItems: "center" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#B76E7944"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#1c1828"}
            >
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(135deg,#d4a09018,#B76E7918)", border: "1px solid #B76E7933", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{a.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: T.textPrimary, marginBottom: 3 }}>{a.title}</div>
                <div style={{ fontSize: 12, color: T.textMuted }}>{a.format} · {a.freq}</div>
              </div>
              <span style={{ fontSize: 10, padding: "3px 10px", background: a.badgeColor + "18", border: `1px solid ${a.badgeColor}44`, borderRadius: 20, color: a.badgeColor, fontWeight: 600, letterSpacing: "0.08em", flexShrink: 0, whiteSpace: "nowrap" }}>{a.badge}</span>
              <button onClick={() => {
                if (!a.url) return;
                if (vaultPlaying === i) {
                  vaultRef.current?.pause(); setVaultPlaying(null);
                } else {
                  if (playing) { audioRef.current?.pause(); setPlaying(false); }
                  if (vaultRef.current) { vaultRef.current.src = a.url; vaultRef.current.play().catch(()=>{}); }
                  setVaultPlaying(i);
                }
              }} style={{ width: 36, height: 36, borderRadius: "50%", background: a.url ? "linear-gradient(135deg,#d4a090,#B76E79)" : "#1a1614", border: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0, cursor: a.url ? "pointer" : "default", color: "#000" }}>
                {a.url ? (vaultPlaying === i ? "⏸" : "▶") : "🔒"}
              </button>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 14, fontSize: 12, color: T.textFaint }}>Sample previews · Full tracks unlock in the vault</div>
      </div>

      {/* COMPARISON TABLE */}
        <div style={{ marginBottom: 70 }}>
          <div className="comp-table" style={{ marginBottom: 2 }}>
            <div style={{ background: "#0a0505", borderRadius: "14px 0 0 0", padding: "22px 30px", border: "1px solid #2a1010", borderBottom: "none", borderRight: "none" }}>
              <div style={{ fontSize: 12, color: T.danger, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>Old self-concept</div>
              <div className="wm" style={{ fontSize: "clamp(22px,3.5vw,40px)", color: "#8a5560", lineHeight: 1.1 }}>Running old<br/>programming</div>
            </div>
            <div style={{ background: "#080a08", borderRadius: "0 14px 0 0", padding: "22px 30px", border: `1px solid ${T.gold}33`, borderBottom: "none", borderLeft: "none" }}>
              <div style={{ fontSize: 12, color: T.champagne, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>New self-concept</div>
              <div className="wm" style={{ fontSize: "clamp(22px,3.5vw,40px)", color: T.textSecondary, lineHeight: 1.1 }}>Reprogrammed<br/>subconscious</div>
            </div>
          </div>
          {compRows.map((row, i) => (
            <div key={i} className="comp-table" style={{ marginBottom: 1 }}>
              <div style={{ background: "#000000", padding: "18px 24px", border: "1px solid #161228", borderRight: "none", borderBottom: "none", borderRadius: i === compRows.length-1 ? "0 0 0 14px" : 0 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ color: "#4a3030", fontSize: 16, flexShrink: 0, marginTop: 3 }}>✗</span>
                  <span style={{ fontSize: "clamp(16px,2.2vw,24px)", color: "#8a7060", lineHeight: 1.65, fontStyle: "italic", display: "block", background: "#0e0602", borderRadius: 16, padding: "20px 22px", border: "1px solid #2a1228", fontFamily: "'Cormorant Garamond',serif" }}>{row.old}</span>
                </div>
              </div>
              <div style={{ background: "#000000", padding: "18px 24px", border: "1px solid #161228", borderLeft: "none", borderBottom: "none", borderRadius: i === compRows.length-1 ? "0 0 14px 0" : 0 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
                  <span style={{ color: T.champagne, fontSize: 16, flexShrink: 0, marginTop: 2 }}>✦</span>
                  <span style={{ fontSize: "clamp(16px,2.2vw,24px)", color: "#f2ece4", lineHeight: 1.65, fontWeight: 600, display: "block", background: "#060e04", borderRadius: 16, padding: "20px 22px", border: "1px solid #2a4a10", fontFamily: "'Cormorant Garamond',serif" }}>{row.neu}</span>
                </div>
                {row.proof && <div style={{ fontSize: 12, color: T.roseGold, fontStyle: "italic", paddingLeft: 26, lineHeight: 1.6, marginBottom: 6 }}>"{row.proof}"</div>}
                {row.cat && <div style={{ paddingLeft: 26 }}><span style={{ fontSize: 10, padding: "2px 8px", background: "#B76E7915", border: "1px solid #B76E7933", borderRadius: 20, color: "#B76E79", fontWeight: 700, letterSpacing: "0.08em" }}>{row.cat}</span></div>}
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
        <div style={{ background: "linear-gradient(135deg,#000000,#0d0800)", border: `1px solid ${T.gold}33`, borderRadius: 20, padding: "44px 40px", marginBottom: 70 }}>
          <div style={{ fontSize: 12, color: T.textFaint, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 16, fontWeight: 700 }}>The real reason</div>
          <h2 className="wm" style={{ fontSize: "clamp(26px,4vw,48px)", color: T.textPrimary, marginBottom: 28, lineHeight: 1.2 }}>
            Why desire doesn't manifest.<br/>
            <span style={{ background: `linear-gradient(90deg,${T.champagne},${T.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>And what does.</span>
          </h2>
          <div style={{...G2(isMobile), gap: 36}}>
            {[
              { title: "Why it hasn't worked", color: T.danger, items: ["Desire lives in the conscious mind. The conscious mind doesn't create reality.", "Affirmations are rejected by a subconscious that holds the opposite belief.", "Visualisation without identity shift is just imagination — the subconscious knows.", "Willpower requires constant effort. The subconscious always wins."], icon: "✗" },
              { title: "What actually works", color: T.champagne, items: ["The subconscious accepts new beliefs in theta and delta states — at the edge of sleep.", "Repetition installs the new self-concept below the threshold of conscious resistance.", "Once the subconscious holds the new identity as true, reality rearranges to match it.", "Passive. No effort. No force. The subconscious does the work while you rest."], icon: "✦" },
            ].map((col, ci) => (
              <div key={ci}>
                <div style={{ fontSize: 13, color: col.color, fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 16 }}>{col.title}</div>
                {col.items.map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                    <span style={{ color: col.color, fontSize: ci === 0 ? 18 : 16, flexShrink: 0, marginTop: 2 }}>{col.icon}</span>
                    <span style={{ fontSize: 16, color: ci === 0 ? "#d8c8a0" : T.textSecondary, lineHeight: 1.75 }}>{t}</span>
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
        <div style={{ background: "#000000", border: "1px solid #1c1828", borderRadius: 16, overflow: "hidden", marginBottom: 70 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr 2fr 1.5fr", background: "#0f0b01", borderBottom: "1px solid #1c1828" }}>
            {["Technology", "What it is", "What it does", "When it activates"].map((h, i) => (
              <div key={i} style={{ padding: "13px 18px", fontSize: 12, color: T.champagne, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", borderRight: i < 3 ? "1px solid #1c1828" : "none" }}>{h}</div>
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

      {/* LISTENING TIMELINE */}
      <div style={{ padding: "0 24px 80px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: "#B76E79", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 14, fontWeight: 700 }}>What repetition does</div>
          <h2 className="wm" style={{ fontSize: "clamp(28px,4.5vw,54px)", color: T.textPrimary, lineHeight: 1.15, marginBottom: 12 }}>
            It is not one listen.<br/>
            <span style={{ background: "linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>It is repetition that rewires.</span>
          </h2>
          <p style={{ fontSize: 16, color: T.textMuted, lineHeight: 1.8, maxWidth: 600, margin: "0 auto" }}>Every time you listen, the subconscious accepts the new self-concept more deeply. The first listen opens the channel. Thirty days closes the old identity completely.</p>
        </div>

        {/* TIMELINE — vertical rows, no overflow */}
        <div style={{ marginBottom: 64, display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { day: "Day 1", icon: "🎧", label: "First listen", body: "You feel something loosen. The obsessive loop quiets. You fall asleep before the track ends.", color: "#B76E79" },
            { day: "Day 3", icon: "◈", label: "Something shifts", body: "A small sign. A message you weren't expecting. Someone mentions your name. You notice.", color: "#C0789A" },
            { day: "Day 7", icon: "✦", label: "Evidence appears", body: "Signs arrive faster. Money from somewhere forgotten. He texts. Your skin looks different.", color: "#d4a090" },
            { day: "Day 14", icon: "◉", label: "Identity updates", body: "You stop needing it. Certainty replaces desire. The old self-concept has nowhere left to live.", color: "#B76E79" },
            { day: "Day 30+", icon: "★", label: "Reality confirms", body: "What you assumed is now undeniable. The proof thread closes. Manifested.", color: "#c8a870" },
          ].map((s, i, arr) => (
            <div key={i} style={{ display: "flex", gap: 20, padding: "24px 0", borderBottom: i < arr.length-1 ? "1px solid #1a1614" : "none", alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, gap: 0 }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: `${s.color}15`, border: `1.5px solid ${s.color}66`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{s.icon}</div>
                {i < arr.length-1 && <div style={{ width: 1, height: 24, background: `${s.color}33`, marginTop: 8 }} />}
              </div>
              <div style={{ flex: 1, paddingTop: 8 }}>
                <div style={{ fontSize: 10, color: s.color, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4, fontFamily: "'Jost',sans-serif" }}>{s.day}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#f2ece4", marginBottom: 8, fontFamily: "'Jost',sans-serif" }}>{s.label}</div>
                <div style={{ fontSize: 15, color: "#b09888", lineHeight: 1.7 }}>{s.body}</div>
              </div>
            </div>
          ))}
        </div>

        {/* BEFORE / AFTER CARDS */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 11, color: "#B76E79", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 12, fontWeight: 700 }}>The results</div>
          <h2 className="wm" style={{ fontSize: "clamp(26px,4vw,48px)", color: T.textPrimary, lineHeight: 1.2 }}>
            What shifts when your<br/>
            <span style={{ background: "linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>self-concept shifts.</span>
          </h2>
        </div>
        <div style={{...G3(isMobile), gap: 16}}>
          {[
            { cat: "Lovemaxxing", color: "#B76E79", bgHdr: "#000000", before: { label: "Old assumption", text: "I am not enough. He leaves. I chase.", msgs: [{txt:"Hey are you there?",sent:true},{txt:"Can we talk?",sent:true},{txt:"8 days · No reply",center:true}] }, after: { label: "New assumption", text: "He comes back. Of course he does.", msgs: [{txt:"I miss you. Been thinking about you constantly.",green:true},{txt:"✓✓ Read",small:true,green:true}] } },
            { cat: "Moneymaxxing", color: "#B76E79", bgHdr: "#000000", before: { label: "Old assumption", text: "There is never enough. I am always behind.", amount: "£247", dim: true }, after: { label: "New assumption", text: "I receive unexpectedly. Always.", amount: "£10,000", transfer: true } },
            { cat: "Beautymaxxing", color: "#B76E79", bgHdr: "#000000", before: { label: "Old assumption", text: "I need to fix myself.", mirror: true }, after: { label: "New assumption", text: "They notice before you do.", msgs: [{txt:"What are you doing differently?? You're GLOWING",from:"Sarah"},{txt:"Your skin is actually shifting omg",from:"Mia"}] } },
          ].map((item, idx) => (
            <div key={idx} style={{ background: T.cardBg, border: T.border, borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "12px 18px", borderBottom: "1px solid #1c1828", background: "#000000" }}>
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
      <div style={{ padding: "0 24px 70px", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 11, color: "#B76E79", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 12, fontWeight: 700 }}>What you get access to</div>
          <h2 className="wm" style={{ fontSize: "clamp(28px,4.5vw,48px)", color: T.textPrimary, lineHeight: 1.2, marginBottom: 10 }}>
            Two dashboards.<br/>
            <span style={{ background: "linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>One practice.</span>
          </h2>
          <p style={{ fontSize: 15, color: T.textMuted, lineHeight: 1.7, maxWidth: 540, margin: "0 auto" }}>New audios added regularly — and a proof system that shows you exactly what is working.</p>
        </div>
        <div style={{...G2(isMobile), gap: 16}}>

          {/* AUDIO DASHBOARD PREVIEW */}
          <div style={{ background: "#000000", border: "1.5px solid #B76E7944", borderRadius: 18, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid #1c1828", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, color: "#B76E79", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 2 }}>Audio Library</div>
                <div style={{ fontSize: 13, color: T.textPrimary, fontWeight: 600 }}>Thousands of tracks. Yours.</div>
              </div>
              <span style={{ padding: "3px 10px", background: "#B76E7922", border: "1px solid #B76E7944", borderRadius: 20, fontSize: 11, color: "#B76E79", fontWeight: 700 }}>Audio Tier</span>
            </div>
            {/* Mock stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0 }}>
              {[["14d", "Streak"], ["", "Tracks"], ["3", "Active goals"]].map(([v,l],i) => (
                <div key={i} style={{ padding: "12px 14px", textAlign: "center", borderRight: i < 2 ? "1px solid #1c1828" : "none" }}>
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
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: i < 2 ? "1px solid #1c1828" : "none" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: t.playing ? "#B76E7922" : "#0f0b02", border: `1px solid ${t.playing ? "#B76E7966" : "#1c1828"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0, color: t.playing ? "#B76E79" : T.textFaint }}>
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
            <div style={{ padding: "12px 18px", borderTop: "1px solid #1c1828", textAlign: "center" }}>
              <button onClick={onDemo} style={{ background: "none", border: "1px solid #B76E7966", borderRadius: 10, padding: "8px 20px", color: "#B76E79", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Preview audio dashboard →</button>
            </div>
          </div>

          {/* PROOFOS DASHBOARD PREVIEW */}
          <div style={{ background: "#000000", border: "1.5px solid #B76E7944", borderRadius: 18, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid #1c1828", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, color: "#B76E79", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 2 }}>ProofOS ✦</div>
                <div style={{ fontSize: 13, color: T.textPrimary, fontWeight: 600 }}>Your manifestation ledger.</div>
              </div>
              <span style={{ padding: "3px 10px", background: "#B76E7922", border: "1px solid #B76E7944", borderRadius: 20, fontSize: 11, color: "#B76E79", fontWeight: 700 }}>Goddess Tier</span>
            </div>
            {/* Mock stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 0 }}>
              {[["7", "Intentions"], ["4", "Manifested"], ["11d", "Avg time"]].map(([v,l],i) => (
                <div key={i} style={{ padding: "12px 14px", textAlign: "center", borderRight: i < 2 ? "1px solid #1c1828" : "none" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: i === 1 ? "#B76E79" : "#B76E79" }}>{v}</div>
                  <div style={{ fontSize: 10, color: T.textMuted, marginTop: 1 }}>{l}</div>
                </div>
              ))}
            </div>
            {/* Proof threads preview */}
            <div style={{ padding: "10px 14px" }}>
              {[
                { title: "I receive £5,000 unexpectedly", days: 9, status: "manifested", audio: "Money finds me first", mood_before: "Anxious", mood_after: "Certain" },
                { title: "He texts me first", days: 14, status: "manifested", audio: "He is already on his way back", mood_before: "Desperate", mood_after: "Detached" },
                { title: "My skin is visibly shifting", days: 21, status: "active", audio: "Gorgeous is my default", mood_before: "Doubtful", mood_after: "Noticing" },
              ].map((t, i) => (
                <div key={i} style={{ padding: "9px 0", borderBottom: i < 2 ? "1px solid #1c1828" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: T.textPrimary, flex: 1, lineHeight: 1.35 }}>{t.title}</div>
                    <span style={{ fontSize: 10, padding: "2px 8px", background: t.status === "manifested" ? "#0a1a0a" : "#000000", color: t.status === "manifested" ? "#4a9a5a" : "#B76E79", borderRadius: 20, fontWeight: 700, flexShrink: 0, border: `1px solid ${t.status === "manifested" ? "#2a4a2a" : "#B76E7944"}` }}>
                      {t.status === "manifested" ? `✦ ${t.days}d` : `${t.days}d`}
                    </span>
                  </div>
                  <div style={{ fontSize: 10, color: T.textFaint, marginBottom: 4 }}>🎧 {t.audio}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <span style={{ fontSize: 10, padding: "2px 7px", background: "#0a0a0a", border: "1px solid #1c1828", borderRadius: 20, color: T.textFaint }}>Before: {t.mood_before}</span>
                    <span style={{ fontSize: 10 , color: T.textFaint }}>→</span>
                    <span style={{ fontSize: 10, padding: "2px 7px", background: "#B76E7918", border: "1px solid #B76E7933", borderRadius: 20, color: "#B76E79" }}>After: {t.mood_after}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "12px 18px", borderTop: "1px solid #1c1828", textAlign: "center" }}>
              <button onClick={onDemo} style={{ background: "none", border: "1px solid #B76E7966", borderRadius: 10, padding: "8px 20px", color: "#B76E79", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Preview ProofOS dashboard →</button>
            </div>
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div style={{ padding: "0 24px 70px", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 11, color: "#B76E79", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 14 }}>What people are saying</div>
          <h2 className="wm" style={{ fontSize: "clamp(28px,4vw,44px)", color: T.textPrimary, lineHeight: 1.15 }}>
            They came for the audio.<br />
            <span style={{ background: "linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>The proof arrived on its own.</span>
          </h2>
        </div>
        <div style={{...GPRICE(isMobile)}}>
          {[
            { quote: "I listened on day 1 and felt something shift. By day 5 he texted. I didn't even look for it.", handle: "@manifestingwithme", cat: "SP & Love" },
            { quote: "£1,800 came back as a refund I had forgotten about. Three days after starting Money Finds Me First.", handle: "@luckygirlenergy", cat: "Money" },
            { quote: "I look the same and feel completely different about my face. The glow is internal first.", handle: "@beautymaxxing_", cat: "Beauty" },
            { quote: "I've tried every subliminal channel. This is the only one where I actually feel it working in real time.", handle: "@shiftingjournal", cat: "Identity" },
            { quote: "Woke up knowing he was coming back. No logical reason. He called that afternoon.", handle: "@sp_manifest", cat: "SP & Love" },
            { quote: "The sleep subliminal changed my dreams. I woke up feeling like money was already mine.", handle: "@goddessmindset__", cat: "Money" },
          ].map((t, i) => (
            <div key={i} style={{ background: "#000000", border: "1px solid #1c1828", borderRadius: 14, padding: "18px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
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
      <div style={{ padding: "0 clamp(16px,4vw,24px) 70px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 11, color: "#B76E79", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 12, fontWeight: 700 }}>ProofOS ✦</div>
          <h2 className="wm" style={{ fontSize: "clamp(28px,4.5vw,48px)", color: T.textPrimary, lineHeight: 1.2, marginBottom: 12 }}>
            Your receipts,<br/>
            <span style={{ background: "linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>finally organised.</span>
          </h2>
          <p style={{ fontSize: 15, color: T.textMuted, lineHeight: 1.8, maxWidth: 560, margin: "0 auto" }}>
            Photo proof, voice notes, signs, symptoms, synchronicities, and final manifestations — all stored inside the Proof Thread connected to the audio you listened to.
          </p>
        </div>
        <div style={{...G3(isMobile)}}>
          {[
            { icon: "💬", label: "Message Screenshot",   sub: "He sent this on Day 8",         color: "#B76E79" },
            { icon: "💰", label: "Money Receipt",         sub: "£5,000 received",               color: "#B76E79" },
            { icon: "🪞", label: "Mirror Photo",          sub: "The glow. Day 14.",              color: "#B76E79" },
            { icon: "555", label: "Angel Number",          sub: "Saw it 3 times in one hour",    color: "#B76E79" },
            { icon: "📧", label: "Email Confirmation",    sub: "Arrived unexpectedly",           color: "#d8c8a0" },
            { icon: "📅", label: "Calendar Invite",       sub: "The meeting that changed it",   color: "#6a8ad0" },
          ].map((p, i) => (
            <div key={i} style={{ background: "#000000", border: `1px solid ${p.color}33`, borderRadius: 14, overflow: "hidden" }}>
              <div style={{ height: 88, background: `linear-gradient(135deg, ${p.color}18, ${p.color}06)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34 }}>{p.icon}</div>
              <div style={{ padding: "10px 14px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: p.color, marginBottom: 3 }}>{p.label}</div>
                <div style={{ fontSize: 12, color: T.textMuted }}>{p.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>



{/* PRICING */}
      <div id="pricing" style={{ padding: "0 clamp(16px,4vw,24px) 80px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 11, color: T.roseGold, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 14, fontWeight: 700 }}>Pricing</div>
          <h2 className="wm" style={{ fontSize: "clamp(32px,4.5vw,56px)", color: T.textPrimary, marginBottom: 20 }}>Choose your tier</h2>
          <div style={{ display: "inline-flex", background: T.surfaceBase, border: T.border, borderRadius: 12, padding: 4, gap: 4 }}>
            {["monthly", "annual"].map(b => (
              <button key={b} onClick={() => setBilling(b)} style={{ padding: "9px 20px", borderRadius: 9, background: billing === b ? "linear-gradient(90deg,#d4a090,#B76E79)" : "transparent", border: "none", color: billing === b ? "#000" : T.textMuted, fontSize: 14, fontWeight: 700, cursor: "pointer", minHeight: 40 }}>
                {b === "annual" ? "Annual — save 20%" : "Monthly"}
              </button>
            ))}
          </div>
        </div>

        {/* 2 tier cards */}
        <div style={{...G2(isMobile), gap: 16, marginBottom: 16}}>
          {[
            {
              id: "audio", name: "Audio Tier", cls: "price-card-audio",
              price: billing === "monthly" ? "£19" : "£144",
              period: billing === "monthly" ? "/month" : "/year",
              sub: billing === "annual" ? "£19/mo · save 20%" : null,
              color: T.textSecondary,
              features: ["An ever-expanding hypnosis library", "All 6 desire categories", "4 new tracks every week", "Loop player + sleep timer", "Plays in background like Spotify", "No ads. Ever."],
              cta: "Join Audio Tier",
            },
            {
              id: "goddess", name: "Goddess Tier", cls: "price-card-goddess", popular: true,
              price: billing === "monthly" ? "£33" : "£317",
              period: billing === "monthly" ? "/month" : "/year",
              sub: billing === "annual" ? "£33/mo · save 20%" : null,
              color: T.roseGold,
              features: ["Everything in Audio Tier", "ProofOS manifestation tracker ✦", "Log desires · link to audios · capture proof", "Early access — 48hrs before everyone", "Monthly ritual audio included", "Goddess community"],
              cta: "Activate Goddess Tier",
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
              <button onClick={onJoin} className={p.popular ? "cta-shake" : "join-pulse"} style={{ width: "100%", padding: "16px", background: p.popular ? "linear-gradient(90deg,#d4a090,#B76E79)" : "transparent", border: p.popular ? "none" : "1.5px solid #C8956A", borderRadius: 12, color: p.popular ? "#000" : "#B76E79", fontSize: 15, fontWeight: 700, cursor: "pointer", minHeight: 52, fontFamily: "'Jost',sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>{p.cta}</button>
            </div>
          ))}
        </div>

        {/* Lifetime Access card — full width */}
        <div style={{ background: "linear-gradient(135deg,#000000,#1a0d02)", border: "2px solid #B76E7955", borderRadius: 18, padding: "28px 32px" }}>
          <div style={{...G2(isMobile), gap: 32, alignItems: "center"}}>
            <div>
              <div style={{ fontSize: 11, color: "#B76E79", letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>First 1,000 only · Lifetime access</div>
              <div className="wm" style={{ fontSize: "clamp(26px,4vw,38px)", color: T.textPrimary, marginBottom: 10 }}>Lifetime Access</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 48, fontWeight: 800, color: "#B76E79", lineHeight: 1 }}>£500</span>
                <span style={{ fontSize: 15, color: T.textMuted }}>once · never pay again</span>
              </div>
              <div style={{ fontSize: 15, color: T.textMuted, lineHeight: 1.8, marginBottom: 20 }}>
                Full vault + ProofOS + every future feature — forever. No subscription can be cancelled from under you. The £500 price closes once the first 1,000 members join.
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
                {["Full vault for life", "ProofOS for life", "1 GB evidence vault", "All future features", "Lifetime seal ✦"].map((f, i) => (
                  <span key={i} style={{ padding: "5px 14px", background: "#B76E7918", border: "1px solid #B76E7944", borderRadius: 20, fontSize: 13, color: "#B76E79", fontWeight: 600 }}>{f}</span>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
                <button onClick={() => window.open("https://buy.stripe.com/00w8wP2tbgaG3pffdu7AI02","_blank")} style={{ padding: "16px 36px", background: "linear-gradient(90deg,#d4a090,#B76E79)", border: "none", borderRadius: 12, color: "#000", fontSize: 16, fontWeight: 800, cursor: "pointer", minHeight: 52, fontFamily: "'Jost',sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>Claim Lifetime Access →</button>
                <div style={{ fontSize: 12, color: T.textMuted }}>Original price · First 1,000 members only</div>
              </div>
            </div>
            <div className="hide-mob" style={{ minWidth: 220 }}>
              <div style={{ background: T.surfaceBase, border: T.border, borderRadius: 14, padding: 20, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: T.textFaint, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 12 }}>What's included</div>
                {[["Audio vault", "Lifetime"], ["ProofOS tracker", "Lifetime"], ["Evidence vault", "1 GB"], ["Future features", "All"], ["Price increase", "Never"], ["Subscription", "None"]].map(([k,v], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 5 ? "1px solid #1c1828" : "none" }}>
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

      {/* FAQ */}
      <FAQSection />

      {/* FINAL CTA */}
      <div style={{ position: "relative", padding: "80px 24px", textAlign: "center", overflow: "hidden", borderTop: T.border }}>
        <Rings count={3} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 className="wm" style={{ fontSize: "clamp(28px,5vw,52px)", color: T.textPrimary, lineHeight: 1.2, marginBottom: 24 }}>
            Wake up knowing.<br />
            <span style={{ background: "linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Not hoping. Knowing.</span>
          </h2>
          <p style={{ fontSize: 17, color: T.textMuted, marginBottom: 32, lineHeight: 1.7, maxWidth: 500, margin: "0 auto 32px" }}>
            In that state, reality shows you the proof of what you already know.
          </p>
          <button onClick={onJoin} className="cta-shake" style={{ padding: "18px 52px", background: "linear-gradient(135deg,#d4a090,#B76E79)", boxShadow: "0 0 40px rgba(183,110,121,0.4)", border: "none", borderRadius: 14, color: "#000", fontSize: 17, fontWeight: 800, cursor: "pointer", minHeight: 56, fontFamily: "'Jost',sans-serif", letterSpacing: "0.1em", textTransform: "uppercase" }}>Start your shift →</button>
          <div style={{ marginTop: 12, fontSize: 13, color: T.textFaint }}>Cancel anytime · No download · Any device</div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: T.border, padding: "28px 24px", textAlign: "center" }}>
        <span className="wm wm-shimmer" style={{ fontSize: 22, display: "block", marginBottom: 8 }}>Self Hypnosis Goddess</span>
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
              <button key={i} onClick={() => setVal(s)} style={{ padding: "5px 12px", background: "none", border: "1px solid #1c1828", borderRadius: 20, color: T.textMuted, fontSize: 12, cursor: "pointer" }}>{s}</button>
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
