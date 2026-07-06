import { useState, useRef, useEffect } from "react";
import { CSS, T } from "./design/tokens.js";
import { Btn, Card, Rings, WaveForm, Pill, Modal, FormField, Label, ProgressBar, ArrowIcon, ExternalArrowIcon } from "./components/UI.jsx";
import AudioVault from "./pages/AudioVault.jsx";
import ProofThreads from "./pages/ProofThreads.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import VaultSettings from "./pages/VaultSettings.jsx";
import ProofWall from "./pages/ProofWall.jsx";
import ListeningGuide from "./pages/ListeningGuide.jsx";
import SpotifyPortal from "./pages/SpotifyPortal.jsx";
import PortalScreenshot from "./components/PortalScreenshot.jsx";
import AnalyticsBoard from "./components/AnalyticsBoard.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import LandingProofWall from "./components/LandingProofWall.jsx";
import DesktopMockup from "./components/DesktopMockup.jsx";
import ProofWallScreenshot from "./components/ProofWallScreenshot.jsx";
import CreateThreadModal from "./components/CreateThreadModal.jsx";
import { PhotoProofModal, VoiceProofModal } from "./components/ProofUpload.jsx";
import { requestNotificationPermission, scheduleReminders } from "./utils/notifications.js";
import { createClient as _sbClient } from "@supabase/supabase-js";
import AuthGate from "./components/AuthGate.jsx";
import { useAuth } from "./contexts/AuthContext.jsx";

const FREE_TRACK_URL = "https://qtwvslrwmreazmrdktsn.supabase.co/storage/v1/object/public/tracks/COMPRESS%2010%20YEARS%20OF%20DELAY%20INTO%20ONE%20HOUR%20EMDR%20THEN%20ECHO%2007.04.2026.mp3";

export default function App() {
  const authCtx = useAuth();
  const { isAuthenticated, profile } = authCtx;
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
      {screen === "landing" && <Landing onJoin={() => setCheckoutModal(true)} onDemo={() => goPortal("goddess")} onSignIn={() => setScreen("auth")} />}
    {checkoutModal && <CheckoutModal onClose={() => setCheckoutModal(false)} onDemo={() => { setCheckoutModal(false); goPortal("goddess"); }} />}
      {screen === "auth" && <AuthGate onSuccess={() => goPortal()} />}
      {screen === "portal" && (
        <ErrorBoundary><SpotifyPortal onSignOut={() => { authCtx.signOut(); setScreen("landing"); }} userTier={profile?.tier || userTier} /></ErrorBoundary>
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
          {userTier === "goddess" || userTier === "lifetime"
            ? <Pill color="champagne">{userTier === "lifetime" ? "Lifetime ✦" : "Goddess ✦"}</Pill>
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
                <div style={{ fontSize: 14, fontWeight: 700, color: "#B76E79", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentAudio.title}</div>
                <div style={{ fontSize: 12, color: "#111111" }}>{(currentAudio.audioFormats || []).join(' · ')}{currentAudio.frequency ? ` · ${currentAudio.frequency}` : ''}</div>
              </div>
              <button onClick={onStopPlay} style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${T.blood}, ${T.rose})`, border: "none", color: "#fff", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>⏸</button>
            </div>
          )}
        </main>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <nav className="mob-nav" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.97)", borderTop: "1px solid #1c1828", zIndex: 200, paddingBottom: "env(safe-area-inset-bottom,8px)", display: "none" }}>
        {NAV.filter(n => n.id !== "proof-wall" && n.id !== "vault-settings").concat({ id: "vault-settings", icon: "⚙", label: "Settings" }).map(n => (
          <button key={n.id} onClick={() => setTab(n.id)} style={{ flex: 1, padding: "9px 4px", background: "none", border: "none", color: tab === n.id ? T.gold : T.textMuted, fontSize: 11, fontWeight: 300, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minHeight: 52, letterSpacing: "0.12em", textTransform: "uppercase" }}>
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
      <h1 style={{ fontSize: 28, fontWeight: 700, color: "#000000", marginBottom: 8 }}>Manifested Archive</h1>
      <p style={{ fontSize: 15, color: "#000000", marginBottom: 24 }}>Every completed Proof Thread lives here. Your permanent record of proof.</p>
      <div style={{ textAlign: "center", padding: "60px 24px" }}>
        <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.4 }}>✦</div>
        <div style={{ fontSize: 16, color: "#000000" }}>Manifested threads will appear here.</div>
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

// ═══ SINGLE SOURCE OF TRUTH — every price, feature list, CTA everywhere reads from here ═══
const TIERS = {
  audio: {
    name: "Audio Tier", emoji: "🔊",
    monthly: "£19", annual: "£143", annualNote: "≈ £11.99/mo · 2 months free",
    features: ["Full exclusive audio vault","All 6 formats — Melodic House, Subliminal, EMDR, Calm, 528hz, Reiki","Loop player + sleep timer","4 new tracks every week","All desire categories","No ads. Ever."],
    cta: (annual)=> annual ? "Join Audio — £143/year" : "Join Audio Tier — £19/month",
  },
  goddess: {
    name: "Goddess Tier", emoji: "✦",
    monthly: "£33", annual: "£317", annualNote: "≈ £26.40/mo · 2 months free",
    features: ["Everything in Audio Tier","ProofOS — manifestation tracker for life ✦","Signs & synchronicity log on every desire","Your Proof Wall — every win, forever","Early access drops — 48hrs ahead","Analytics board — watch your evidence build"],
    cta: (annual)=> annual ? "Activate Goddess — £317/year" : "Activate Goddess Tier — £33/month",
  },
  lifetime: {
    name: "Lifetime Access", emoji: "♾",
    monthly: "£500", annual: "£500", annualNote: "One payment. Forever.",
    features: ["Everything in Goddess Tier","Every future audio ever released","Every future feature — included","No monthly billing, ever","1,000 spots only"],
    cta: ()=> "Claim Lifetime Access — £500",
  },
};

function CheckoutModal({ onClose, onDemo }) {
  const [billing, setBilling] = useState("monthly");
  const isAnnual = billing === "annual";
  const goStripe = (tier) => {
    const key = isAnnual && tier !== "lifetime" ? tier + "_annual" : tier;
    window.open(STRIPE[key] || STRIPE[tier], "_blank");
    onClose();
  };
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:2000,display:"flex",alignItems:"flex-end",justifyContent:"center" }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ background:"#fff",overflowY:"auto",maxHeight:"94vh",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:540,position:"relative",boxShadow:"0 -20px 80px rgba(0,0,0,0.5)" }}>
        <button onClick={onClose} style={{position:"absolute",top:16,right:16,background:"rgba(0,0,0,0.08)",border:"none",borderRadius:"50%",width:32,height:32,fontSize:16,cursor:"pointer",lineHeight:"32px",zIndex:10}}>✕</button>

        {/* HEADER */}
        <div style={{background:"linear-gradient(135deg,#fceedd,#f8e0f0)",padding:"28px 24px 20px",borderRadius:"24px 24px 0 0"}}>
          <div style={{fontFamily:"'Jost',sans-serif",fontSize:10,color:"#B76E79",letterSpacing:"0.28em",textTransform:"uppercase",fontWeight:700,marginBottom:8}}>Start your shift today</div>
          <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(24px,5vw,34px)",color:"#1a1218",fontWeight:400,lineHeight:1.2,marginBottom:4}}>Choose your membership.</h3>
          <p style={{fontSize:13,color:"#6a4858",lineHeight:1.5,marginBottom:16}}>Full access from day one. No downloads needed.</p>

          {/* MONTHLY / ANNUAL TOGGLE */}
          <div style={{display:"flex",background:"rgba(0,0,0,0.06)",borderRadius:50,padding:3,width:"fit-content"}}>
            {["monthly","annual"].map(b => (
              <button key={b} onClick={()=>setBilling(b)} style={{
                padding:"8px 20px",borderRadius:50,border:"none",cursor:"pointer",
                fontSize:12,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",
                background:billing===b?"#fff":"transparent",
                color:billing===b?"#8a2050":"#a09098",
                boxShadow:billing===b?"0 2px 8px rgba(0,0,0,0.12)":"none",
                transition:"all 0.2s",display:"flex",alignItems:"center",gap:6
              }}>
                {b==="monthly"?"Monthly":<><span>Annual</span><span style={{background:"linear-gradient(90deg,#d4a090,#B76E79)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontSize:10,fontWeight:800}}>SAVE 25%</span></>}
              </button>
            ))}
          </div>
          {isAnnual && <div style={{marginTop:10,fontSize:12,color:"#8a3060",background:"rgba(183,110,121,0.1)",borderRadius:8,padding:"6px 12px",lineHeight:1.5}}>⚠ Annual plans are paid upfront and <strong>cannot be cancelled</strong> once purchased.</div>}
        </div>

        <div style={{padding:"20px 24px 28px",display:"flex",flexDirection:"column",gap:12}}>

          {/* AUDIO TIER */}
          <div style={{background:"linear-gradient(135deg,#f0eaff,#e8e0ff)",border:"1.5px solid #9060c066",borderRadius:16,padding:"18px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div>
                <div style={{fontSize:16,fontWeight:800,color:"#4020a0",marginBottom:2}}>Audio Tier</div>
                <div style={{fontSize:11,color:"#7050b0",fontWeight:600,letterSpacing:"0.06em"}}>The full vault</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:26,fontWeight:900,color:"#6040b0",lineHeight:1}}>{isAnnual?TIERS.audio.annual:TIERS.audio.monthly}</div>
                <div style={{fontSize:11,color:"#9070c0"}}>{isAnnual?"/year":"/month"}</div>
                {isAnnual && <div style={{fontSize:10,color:"#8060c0"}}>£11.92/mo · billed once</div>}
              </div>
            </div>
            <div style={{marginBottom:12}}>
              {["Full audio vault — all desire categories","4+ new tracks every week","Loop player · sleep timer · background play","Sleep subliminals · binaural · Reiki frequencies","No ads. Ever."].map((f,i)=>(
                <div key={i} style={{fontSize:12,color:"#5040a0",marginBottom:5,paddingLeft:12,position:"relative",lineHeight:1.5}}>
                  <span style={{position:"absolute",left:0,color:"#7050b0"}}>·</span>{f}
                </div>
              ))}
            </div>
            <button onClick={()=>goStripe("audio")} className="cta-shake" style={{width:"100%",padding:"12px",background:"linear-gradient(135deg,#ede8ff,#d4c8ff)",border:"none",borderRadius:10,color:"#3a1a80",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"'Jost',sans-serif",letterSpacing:"0.04em",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:7}}>
              {TIERS.audio.cta(isAnnual)}<ArrowIcon/>
            </button>
          </div>

          {/* GODDESS TIER */}
          <div style={{background:"linear-gradient(135deg,#fce8f0,#f8d8e8)",border:"2px solid #B76E79",borderRadius:16,padding:"18px",position:"relative"}}>
            <div style={{position:"absolute",top:-12,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(90deg,#d4a090,#B76E79)",borderRadius:20,padding:"4px 16px",fontSize:10,fontWeight:800,color:"#000",letterSpacing:"0.12em",whiteSpace:"nowrap"}}>✦ MOST POPULAR</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div>
                <div style={{fontSize:16,fontWeight:800,color:"#8a2050",marginBottom:2}}>Goddess Tier</div>
                <div style={{fontSize:11,color:"#B76E79",fontWeight:600,letterSpacing:"0.06em"}}>Everything + ProofOS ✦</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:26,fontWeight:900,color:"#B76E79",lineHeight:1}}>{isAnnual?TIERS.goddess.annual:TIERS.goddess.monthly}</div>
                <div style={{fontSize:11,color:"#d4a090"}}>{isAnnual?"/year":"/month"}</div>
                {isAnnual && <div style={{fontSize:10,color:"#c08090"}}>£26.42/mo · billed once</div>}
              </div>
            </div>
            <div style={{marginBottom:12}}>
              {["Everything in Audio Tier","ProofOS manifestation tracker ✦","Log intentions · link audios · capture every sign","Early access drops — 48hrs before everyone","Monthly ritual audio included"].map((f,i)=>(
                <div key={i} style={{fontSize:12,color:f.includes("✦")?"#B76E79":"#6a2848",marginBottom:5,paddingLeft:12,position:"relative",lineHeight:1.5,fontWeight:f.includes("✦")?700:400}}>
                  <span style={{position:"absolute",left:0,color:"#B76E79"}}>·</span>{f}
                </div>
              ))}
            </div>
            <button onClick={()=>goStripe("goddess")} className="cta-shake" style={{width:"100%",padding:"14px",background:"linear-gradient(135deg,#f0cdb8,#d4a090,#B76E79)",border:"none",borderRadius:10,color:"#000",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"'Jost',sans-serif",boxShadow:"0 4px 20px rgba(183,110,121,0.4)",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:7}}>
              {TIERS.goddess.cta(isAnnual)}<ArrowIcon/>
            </button>
          </div>

          {/* LIFETIME */}
          <div style={{background:"linear-gradient(135deg,#fffde8,#fff8cc)",border:"1.5px solid #c8a87066",borderRadius:16,padding:"18px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div>
                <div style={{fontSize:16,fontWeight:800,color:"#7a6010",marginBottom:2}}>Lifetime Access</div>
                <div style={{fontSize:11,color:"#a08020",fontWeight:600,letterSpacing:"0.06em"}}>Once. Forever.</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:26,fontWeight:900,color:"#b08000",lineHeight:1}}>{TIERS.lifetime.monthly}</div>
                <div style={{fontSize:11,color:"#c0a030"}}>one time</div>
              </div>
            </div>
            <div style={{marginBottom:12}}>
              {["Full vault + ProofOS for life","Every future audio ever released","Every future feature · No subscription","1,000 spots only"].map((f,i)=>(
                <div key={i} style={{fontSize:12,color:"#7a6010",marginBottom:5,paddingLeft:12,position:"relative",lineHeight:1.5}}>
                  <span style={{position:"absolute",left:0,color:"#c8a830"}}>·</span>{f}
                </div>
              ))}
            </div>
            <button onClick={()=>goStripe("lifetime")} className="cta-shake" style={{width:"100%",padding:"12px",background:"linear-gradient(90deg,#b8860b,#d4a017,#f0c030,#d4a017,#b8860b)",backgroundSize:"300%",backgroundPosition:"center",border:"none",borderRadius:10,color:"#000",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"'Jost',sans-serif",boxShadow:"0 4px 20px rgba(200,160,0,0.35)",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:7}}>{TIERS.lifetime.cta()}<ArrowIcon/></button>
          </div>

          <button onClick={onDemo} style={{background:"none",border:"none",color:"#B76E79",fontSize:13,cursor:"pointer",textDecoration:"underline",fontFamily:"'Jost',sans-serif",padding:"4px 0"}}>👁 Preview the portal first — no signup needed</button>
          <div style={{textAlign:"center",fontSize:11,color:"#a0909a",lineHeight:1.7}}>Monthly: cancel anytime · Annual: non-refundable, paid upfront · Stripe secure checkout</div>
        </div>
      </div>
    </div>
  );
}


/* ── PRICING SECTION — lives on the page itself, not just inside the modal ──── */
function PricingSection({ onJoin }) {
  const isMobile = useMobile();
  const [billing, setBilling] = useState("monthly");
  const isAnnual = billing === "annual";
  const goStripe = (tier) => {
    const key = isAnnual && tier !== "lifetime" ? tier + "_annual" : tier;
    window.open(STRIPE[key] || STRIPE[tier], "_blank");
  };

  const cards = [
    { id: "audio", name: TIERS.audio.name, price: isAnnual ? TIERS.audio.annual : TIERS.audio.monthly, note: isAnnual ? TIERS.audio.annualNote : null, features: TIERS.audio.features, cta: TIERS.audio.cta(isAnnual), bg: "#fff", border: "rgba(183,110,121,0.3)", priceColor: "#B76E79", ctaBg: "linear-gradient(135deg,#fdf0e8,#f5e0d0)", ctaColor: "#7a3020" },
    { id: "goddess", name: TIERS.goddess.name, price: isAnnual ? TIERS.goddess.annual : TIERS.goddess.monthly, note: isAnnual ? TIERS.goddess.annualNote : null, features: TIERS.goddess.features, cta: TIERS.goddess.cta(isAnnual), bg: "linear-gradient(160deg,#fff4e4,#ffe8dc)", border: "#B76E79", priceColor: "#B76E79", ctaBg: "linear-gradient(135deg,#f0cdb8,#d4a090,#B76E79)", ctaColor: "#000", popular: true },
    { id: "lifetime", name: TIERS.lifetime.name, price: TIERS.lifetime.monthly, note: TIERS.lifetime.annualNote, features: TIERS.lifetime.features, cta: TIERS.lifetime.cta(), bg: "linear-gradient(160deg,#fffde8,#fff8cc)", border: "#c8a87066", priceColor: "#a08020", ctaBg: "linear-gradient(90deg,#b8860b,#d4a017,#f0c030,#d4a017,#b8860b)", ctaColor: "#000" },
  ];

  return (
    <div id="pricing" style={{ padding: isMobile ? "56px 18px" : "80px 24px", background: "#fdf0e8", width: "100%" }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: isMobile ? 12 : 13, fontWeight: 700, color: "#B76E79", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 14, fontFamily: "'Jost',sans-serif" }}>Choose your membership</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? "clamp(32px,8vw,44px)" : "clamp(40px,5vw,56px)", fontWeight: 400, color: "#1a0818", lineHeight: 1.1 }}>
            Full access. <span style={{ background: "linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>No download needed.</span>
          </h2>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <div style={{ display: "flex", background: "rgba(0,0,0,0.06)", borderRadius: 50, padding: 3 }}>
            {["monthly", "annual"].map(b => (
              <button key={b} onClick={() => setBilling(b)} style={{
                padding: "9px 22px", borderRadius: 50, border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 700, letterSpacing: "0.04em",
                background: billing === b ? "#fff" : "transparent",
                color: billing === b ? "#8a2050" : "#a09098",
                boxShadow: billing === b ? "0 2px 8px rgba(0,0,0,0.12)" : "none",
                fontFamily: "'Jost',sans-serif", display: "flex", alignItems: "center", gap: 6,
              }}>
                {b === "monthly" ? "Monthly" : <><span>Annual</span><span style={{ background: "linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: 11, fontWeight: 800 }}>SAVE 25%</span></>}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 16 }}>
          {cards.map(c => (
            <div key={c.id} style={{ background: c.bg.startsWith("linear") ? undefined : c.bg, backgroundImage: c.bg.startsWith("linear") ? c.bg : undefined, border: `${c.popular ? "2px" : "1px"} solid ${c.border}`, borderRadius: 18, padding: "24px 22px", position: "relative", boxShadow: c.popular ? "0 8px 32px rgba(183,110,121,0.18)" : "0 4px 20px rgba(0,0,0,0.04)" }}>
              {c.popular && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(90deg,#f5e0a0,#B76E79)", color: "#000", fontSize: 10, fontWeight: 800, padding: "4px 14px", borderRadius: 20, letterSpacing: "0.1em", whiteSpace: "nowrap" }}>MOST POPULAR</div>}
              <div style={{ fontSize: 16, fontWeight: 700, color: "#1a0818", marginBottom: 4, fontFamily: "'Jost',sans-serif" }}>{c.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                <span style={{ fontSize: 32, fontWeight: 900, color: c.priceColor }}>{c.price}</span>
                <span style={{ fontSize: 13, color: "#8a7268" }}>{c.id === "lifetime" ? "one time" : isAnnual ? "/year" : "/month"}</span>
              </div>
              {c.note && <div style={{ fontSize: 11, color: "#a08868", marginBottom: 14 }}>{c.note}</div>}
              {!c.note && <div style={{ marginBottom: 14 }} />}
              <div style={{ marginBottom: 18 }}>
                {c.features.map((f, i) => (
                  <div key={i} style={{ fontSize: 12.5, color: f.includes("✦") ? "#B76E79" : "#4a3830", marginBottom: 7, paddingLeft: 14, position: "relative", lineHeight: 1.5, fontWeight: f.includes("✦") ? 700 : 400 }}>
                    <span style={{ position: "absolute", left: 0, color: "#B76E79" }}>·</span>{f}
                  </div>
                ))}
              </div>
              <button onClick={() => goStripe(c.id)} className="cta-shake" style={{ width: "100%", padding: "13px", backgroundImage: c.ctaBg, backgroundSize: c.id === "lifetime" ? "300%" : undefined, backgroundPosition: c.id === "lifetime" ? "center" : undefined, border: "none", borderRadius: 10, color: c.ctaColor, fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "'Jost',sans-serif", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                {c.cta}<ArrowIcon size={13} />
              </button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, textAlign: "center", fontSize: 12, color: "#8a7268", lineHeight: 1.8 }}>
          Monthly: cancel anytime · Annual: paid upfront, non-refundable · Stripe secure checkout<br />
          No app to download — works in any browser, on any device
        </div>
      </div>
    </div>
  );
}


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
// ── APP PREVIEW SECTION — dashboard + proofos with theme toggle ──────────────
function AppPreviewSection({ isMobile }) {
  const [theme, setTheme] = useState("light");
  const [view,  setView]  = useState("dashboard"); // "dashboard" | "proof"

  return (
    <div style={{ width:"100%", display:"flex", flexDirection:"column", alignItems:"center", gap:20, marginBottom:16 }}>

      {/* Headline copy */}
      <div style={{ textAlign:"center", maxWidth:500 }}>
        <div style={{ fontSize: isMobile?17:21, fontWeight: 800, color: "#ffffff", fontFamily: "'Jost',sans-serif", letterSpacing: "0.04em", marginBottom: 6 }}>👇 This is what's inside</div>
        <div style={{ fontSize: isMobile?12:13, fontWeight: 600, color: "#e8b4a0", fontFamily: "'Jost',sans-serif", letterSpacing: "0.06em" }}>Tap Dashboard · ProofOS ✦ · Analytics below to explore each screen</div>
        <div style={{ fontSize:isMobile?16:18, fontWeight:700, color:"#000", marginBottom:8, lineHeight:1.4 }}>
          Your dashboard. Your audio vault. Your proof.
        </div>
        <div style={{ fontSize:isMobile?13:14, color:"#4a3830", lineHeight:1.75, fontFamily:"'Jost',sans-serif" }}>
          On mobile it looks like Spotify. On desktop, the same experience — full sidebar, player bar, everything. Switch between the <span style={{ color:"#B76E79", fontWeight:600 }}>audio dashboard</span> and your <span style={{ color:"#B76E79", fontWeight:600 }}>ProofOS wall</span> below.
        </div>
      </div>

      {/* Tab switcher — Dashboard / ProofOS */}
      <div style={{ display:"flex", gap:0, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:24, padding:4 }}>
        {[["dashboard","Dashboard"],["proof","ProofOS ✦"],["analytics","Analytics"]].map(([id,l])=>(
          <button key={id} onClick={()=>setView(id)}
            style={{ padding:"7px 18px", borderRadius:20, background:view===id?"linear-gradient(90deg,#d4a090,#B76E79)":"transparent", border:"none",
              color:view===id?"#000":"#ffffff", fontSize:12, fontWeight:700, cursor:"pointer",
              fontFamily:"'Jost',sans-serif", transition:"all 0.25s", letterSpacing:"0.04em" }}>
            {l}
          </button>
        ))}
      </div>

      {/* Mockups */}
      <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"center", gap:isMobile?12:28, flexWrap:isMobile?"wrap":"nowrap", width:"100%" }}>

        {/* Desktop (hidden on mobile) */}
        {!isMobile && view==="dashboard" && (
          <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
            <div style={{ fontSize:10, color:"rgba(183,110,121,0.45)", letterSpacing:"0.2em", textTransform:"uppercase", fontFamily:"'Jost',sans-serif" }}>Desktop</div>
            <DesktopMockup theme={theme}/>
          </div>
        )}
        {!isMobile && view==="analytics" && (
          <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:8, width:400 }}>
            <div style={{ fontSize:10, color:"rgba(183,110,121,0.45)", letterSpacing:"0.2em", textTransform:"uppercase", fontFamily:"'Jost',sans-serif" }}>Your evidence, visualised</div>
            <div style={{ width:"100%", borderRadius:18, overflow:"hidden", boxShadow:"0 18px 50px rgba(0,0,0,0.5)" }}>
              <AnalyticsBoard theme={theme}/>
            </div>
          </div>
        )}

        {/* Mobile phone */}
        <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
          <div style={{ fontSize:10, color:"rgba(183,110,121,0.45)", letterSpacing:"0.2em", textTransform:"uppercase", fontFamily:"'Jost',sans-serif" }}>
            {isMobile?"Preview":"Mobile"}
          </div>
          {view==="dashboard" && <PortalScreenshot width={isMobile?240:190} theme={theme}/>}
          {view==="proof" && <ProofWallScreenshot width={isMobile?240:190} theme={theme}/>}
          {view==="analytics" && (
            <div style={{ width:isMobile?260:230, borderRadius:24, overflow:"hidden", boxShadow:"0 24px 60px rgba(140,100,40,0.45), 0 0 0 7px #b8934a, 0 0 0 8px #d4b06a", background:theme==="dark"?"#121212":"#fdf0e8", padding:"14px 10px" }}>
              <AnalyticsBoard theme={theme} compact/>
            </div>
          )}
        </div>
      </div>

      {/* Dark / Light toggle */}
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <span style={{ fontSize:11, color:"#ffffff", fontFamily:"'Jost',sans-serif" }}>Dark</span>
        <button onClick={()=>setTheme(t=>t==="dark"?"light":"dark")}
          style={{ width:44, height:24, borderRadius:12, background:theme==="light"?"#B76E79":"#333",
            border:"none", cursor:"pointer", position:"relative", transition:"background 0.25s", padding:0 }}>
          <div style={{ width:18, height:18, borderRadius:"50%", background:"#fff",
            position:"absolute", top:3, left:theme==="light"?23:3, transition:"left 0.25s" }}/>
        </button>
        <span style={{ fontSize:11, color:"#ffffff", fontFamily:"'Jost',sans-serif" }}>Light</span>
      </div>

      <div style={{ fontSize:12, color:"rgba(183,110,121,0.7)", fontFamily:"'Jost',sans-serif", letterSpacing:"0.08em", textAlign:"center", fontWeight:600 }}>
        Works in any browser · iPhone · Android · No download needed
      </div>
    </div>
  );
}

function HeroMarquee() {
  const [lit, setLit] = useState(-1);
  const doubled = [...MARQUEE_ITEMS,...MARQUEE_ITEMS,...MARQUEE_ITEMS];
  useEffect(() => { const t = setInterval(() => setLit(Math.floor(Math.random()*MARQUEE_ITEMS.length)), 8000); return () => clearInterval(t); }, []);
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

/* ── MAXXING CAROUSEL — peach/rose gold bg, BLACK text ────────────────────── */
function MaxxingCarousel({ cats }) {
  const [idx, setIdx] = useState(0);
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => { setFlash(true); setTimeout(() => { setIdx(i => (i+1)%cats.length); setFlash(false); }, 250); }, 2800);
    return () => clearInterval(timer);
  }, [cats.length]);
  const current = cats[idx];
  const next1 = cats[(idx+1)%cats.length];
  const next2 = cats[(idx+2)%cats.length];
  const next3 = cats[(idx+3)%cats.length];

  // Each category gets its own peach/rose shade so it feels alive
  const bgs = [
    "linear-gradient(135deg,#ffd6e7,#ffb3cc)",  // Lovemaxxing — bright pink
    "linear-gradient(135deg,#d4f4d4,#a8e6a8)",   // Moneymaxxing — fresh green
    "linear-gradient(135deg,#e8d0ff,#d4a8ff)",   // Beautymaxxing — lilac
    "linear-gradient(135deg,#dca8b8,#c47898)",   // DNAMaxxing — rose
    "linear-gradient(135deg,#edc0a8,#d49880)",   // Lifemaxxing — golden peach
    "linear-gradient(135deg,#c8b8d8,#a898c0)",   // SleepMaxxing — soft lavender-rose
  ];
  const bg = bgs[idx % bgs.length];

  return (
    <div style={{ overflow:"hidden" }}>
      {/* MAIN HERO CARD — full peach/rose background, black text */}
      <div style={{
        transition:"opacity 0.25s, transform 0.25s",
        opacity: flash ? 0 : 1,
        transform: flash ? "scale(0.98)" : "scale(1)",
        background: bg,
        padding:"clamp(44px,8vw,80px) clamp(20px,5vw,60px)",
        textAlign:"center",
        position:"relative",
        overflow:"hidden",
      }}>
        {/* Soft radial overlay for depth */}
        <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 100%,rgba(0,0,0,0.08),transparent 70%)",pointerEvents:"none" }}/>
        {/* Category eyebrow */}
        <div style={{
          fontSize:10, fontWeight:800, letterSpacing:"0.35em", textTransform:"uppercase",
          marginBottom:20, fontFamily:"'Jost',sans-serif", color:"rgba(0,0,0,0.5)"
        }}>{current.label} ✦</div>
        {/* BIG tagline — black text, Cormorant */}
        <div className="wm" style={{
          fontSize:"clamp(30px,6vw,72px)", lineHeight:1.05, color:"#000",
          fontWeight:400, letterSpacing:"-0.01em"
        }}>{current.tagline}</div>
      </div>

      {/* PREVIEW STRIP — 3 upcoming, dark bg, peach text */}
      <div style={{ display:"flex", background:"#000", borderTop:"1px solid #1c1828", borderBottom:"1px solid #1c1828" }}>
        {[next1,next2,next3].map((cat,i) => (
          <div key={i}
            onClick={() => { setFlash(true); setTimeout(()=>{setIdx((idx+i+1)%cats.length);setFlash(false);},200); }}
            style={{ flex:1, padding:"16px 18px", cursor:"pointer", borderRight:i<2?"1px solid #1c1828":"none", transition:"background 0.2s" }}
            onMouseEnter={e=>e.currentTarget.style.background="#0c0814"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{ fontSize:9, color:"#d4a090", fontWeight:800, letterSpacing:"0.22em", textTransform:"uppercase", marginBottom:5, fontFamily:"'Jost',sans-serif" }}>{cat.label}</div>
            <div style={{ fontSize:12, color:"#a08878", lineHeight:1.5, fontFamily:"'Cormorant Garamond',serif" }}>{cat.tagline}</div>
          </div>
        ))}
      </div>

      {/* DOTS */}
      <div style={{ display:"flex", justifyContent:"center", gap:7, padding:"16px 0", background:"#000" }}>
        {cats.map((_,i) => (
          <div key={i}
            onClick={()=>{setFlash(true);setTimeout(()=>{setIdx(i);setFlash(false);},200);}}
            style={{ width:i===idx?20:6, height:6, borderRadius:3, background:i===idx?"#d4a090":"#1c1828", transition:"all 0.3s", cursor:"pointer" }}/>
        ))}
      </div>
    </div>
  );
}

/* ── FAQ SECTION ───────────────────────────────────────────────────────────── */
const FAQS = [
  {q:"What exactly is Self Hypnosis Goddess?",a:"A private audio membership of original hypnosis tracks produced by Reshma Oracle. Each audio is layered with EMDR, binaural beats, and melodic house music to guide your brain into theta state — where the subconscious accepts new beliefs. No app download needed. Access everything through a web portal that plays like Spotify."},
  {q:"How is this different from YouTube hypnosis?",a:"The YouTube audios are free and public. The vault contains originals never published — longer, deeper, produced specifically to rewire the subconscious around specific desires. No ads at 3am. No algorithm deciding what you hear next."},
  {q:"Is this for all genders?",a:"Yes. Depending on the track. The love and SP tracks are written with female listeners in mind by default, but the money, identity, beauty, DNA, and sleep tracks apply to anyone. More gender-neutral tracks are being added regularly."},
  {q:"Do I need headphones?",a:"Headphones maximise the binaural effect and are strongly recommended. The EMDR bilateral element works through left-right audio stimulation. AirPods, earbuds, over-ear — any pair works."},
  {q:"How long until I notice something shifting?",a:"Most members report something noticeable within 3 to 7 days — a small sign, a shift in how they feel about the desire, or a change in the obsessive loop. The install deepens with repetition. 30 days of consistent listening typically closes the old identity completely."},
  {q:"Can I listen while I sleep?",a:"Yes. This is one of the most effective ways to use the audios. Your conscious resistance is off. The subconscious is in delta and receives the installation without filtering. Several tracks are designed specifically for sleep listening."},
  {q:"What is ProofOS?",a:"ProofOS is the manifestation tracking system included in Goddess Tier. Log your desires, link them to the audio you listened to, capture signs as they arrive, and mark when it manifests. It creates a personal record of evidence so you can see the pattern building."},
  {q:"What's the difference between Audio and Goddess Tier?",a:`Audio Tier (${TIERS.audio.monthly}/mo): full vault, all categories, new tracks weekly, loop player, sleep timer. Goddess Tier (${TIERS.goddess.monthly}/mo): everything in Audio plus ProofOS tracking, early access drops 48hrs before everyone else, and monthly ritual audio.`},
  {q:"What is Lifetime Access?",a:`A one-time payment of ${TIERS.lifetime.monthly} that gives you everything in Goddess Tier, every future audio ever released, every future feature, and no monthly billing. 1,000 spots only.`},
  {q:"Can I cancel anytime?",a:"Yes. Cancel before your next renewal date and you will not be charged again. No refunds after 14 days from payment date."},
  {q:"Does this work if other subliminals didn't?",a:"Most subliminals fail because they use generic voices, poor production, or deliver affirmations to a conscious mind in beta state. SHG uses binaural beats and EMDR to bypass the conscious filter entirely — reaching the subconscious where belief actually lives."},
  {q:"What categories are in the vault?",a:"SP & Love · Money · Beauty · DNA Activation · Sleep Shifting · Identity · Lifemaxxing. New categories added based on member requests."},
  {q:"Is there a mobile app?",a:"The portal is a web app that works on any device in any browser. On iPhone: tap Share → Add to Home Screen. A dedicated iOS and Android app is in development."},
];
function FAQSection() {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ background:"linear-gradient(160deg,#f0f8ff 0%,#e8f4fc 50%,#f0f8ff 100%)", padding:"0 0 0 0" }}>
      <div style={{ padding:"60px clamp(16px,4vw,24px) 80px",maxWidth:760,margin:"0 auto" }}>
      <div style={{ textAlign:"center",marginBottom:40 }}>
        <div style={{ fontSize:11,color:"#0060a0",letterSpacing:"0.25em",textTransform:"uppercase",fontWeight:700,marginBottom:14,fontFamily:"'Jost',sans-serif" }}>Everything you need to know</div>
        <h2 className="wm" style={{ fontSize:"clamp(28px,4vw,48px)",color:"#0a2040",lineHeight:1.2 }}>FAQs</h2>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
        {FAQS.map((faq,i) => (
          <div key={i} style={{ background:open===i?"rgba(255,255,255,0.95)":"rgba(255,255,255,0.7)",border:"1px solid",borderColor:open===i?"rgba(0,80,180,0.3)":"rgba(0,80,180,0.12)",borderRadius:14,overflow:"hidden",transition:"all 0.2s",boxShadow:open===i?"0 4px 20px rgba(0,80,180,0.1)":"none" }}>
            <button onClick={() => setOpen(open===i?null:i)} style={{ width:"100%",padding:"20px 22px",background:"none",border:"none",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",gap:16 }}>
              <span style={{ fontSize:15,fontWeight:600,color:"#0a2040",textAlign:"left",lineHeight:1.4 }}>{faq.q}</span>
              <span style={{ fontSize:20,color:"#0060a0",flexShrink:0,transform:open===i?"rotate(45deg)":"none",transition:"transform 0.2s" }}>+</span>
            </button>
            {open===i && <div style={{ padding:"0 22px 22px" }}><div style={{ height:1,background:"rgba(0,80,180,0.12)",marginBottom:16 }}/><p style={{ fontSize:14,color:"#2a4060",lineHeight:1.85,margin:0 }}>{faq.a}</p></div>}
          </div>
        ))}
      </div>
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
  const [proofTheme, setProofTheme] = useState("dark");
  const isMobile = useMobile();
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [billing, setBilling] = useState("monthly");
  const [menuOpen, setMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);
  const audioRef = useRef(null);
  const vaultRef = useRef(null);
  const [vaultPlaying, setVaultPlaying] = useState(null);

  // ── HERO PLAYLIST ─────────────────────────────────────────────────────────
  const PLAYLIST = [
    { title: "Spoilt Goddess",           sub: "Identity · Self-concept · Receiving",   freq: "Melodic House · 528hz", url: "https://qtwvslrwmreazmrdktsn.supabase.co/storage/v1/object/public/tracks/SPOILT%20INSTAGRAM%2013.04.2026.WAV" },
    { title: "While I Sleep I Manifest", sub: "Subliminal · Music only · No voice",    freq: "Delta · Sleep shifting", url: "https://qtwvslrwmreazmrdktsn.supabase.co/storage/v1/object/public/tracks/29.06.2026-6.mp3" },
    { title: "10 Years Into One Hour",   sub: "EMDR · Deep identity reset",            freq: "Theta · 432hz",         url: "https://qtwvslrwmreazmrdktsn.supabase.co/storage/v1/object/public/tracks/COMPRESS%2010%20YEARS%20OF%20DELAY%20INTO%20ONE%20HOUR%20EMDR%20THEN%20ECHO%2007.04.2026.mp3" },
    { title: "Money Finds Me First",     sub: "Wealth · Receiving · Abundance",        freq: "528hz · Spoken hypnosis",url: "https://qtwvslrwmreazmrdktsn.supabase.co/storage/v1/object/public/tracks/29.06.2026-6.mp3" },
    { title: "He Finds His Way Back",    sub: "SP & Love · No contact",                freq: "432hz · EMDR",          url: null },
    { title: "Gorgeous Is My Default",   sub: "Beauty · Glow · Self-image",            freq: "432hz · Binaural",      url: null },
  ];
  const [trackIdx, setTrackIdx] = useState(0);
  const currentTrack = PLAYLIST[trackIdx];

  const loadTrack = (idx) => {
    const t = PLAYLIST[idx];
    setTrackIdx(idx);
    setProgress(0);
    setPlaying(false);
    if (audioRef.current) {
      if (t.url) { audioRef.current.src = t.url; audioRef.current.load(); }
      else { audioRef.current.src = ""; }
    }
  };

  const nextTrack = () => {
    const next = (trackIdx + 1) % PLAYLIST.length;
    loadTrack(next);
    // auto-play next if current was playing
    setTimeout(() => {
      const t = PLAYLIST[next];
      if (t.url && audioRef.current) { audioRef.current.play().catch(()=>{}); setPlaying(true); }
    }, 100);
  };

  const prevTrack = () => loadTrack((trackIdx - 1 + PLAYLIST.length) % PLAYLIST.length);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (!currentTrack.url) return; // preview tracks — no audio yet
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play().catch(() => {}); setPlaying(true); }
  };

  useEffect(() => {
    const a = audioRef.current; if (!a) return;
    const upd = () => setProgress((a.currentTime / a.duration) * 100 || 0);
    const end = () => { nextTrack(); }; // auto-advance on end
    a.addEventListener("timeupdate", upd); a.addEventListener("ended", end);
    return () => { a.removeEventListener("timeupdate", upd); a.removeEventListener("ended", end); };
  }, [trackIdx]);

  const cats = [
    { label: "Lovemaxxing", tagline: "He's obsessed. Of course he is.", color: T.rose },
    { label: "Moneymaxxing", tagline: "Money finds me first. Obviously.", color: "#B76E79" },
    { label: "Beautymaxxing", tagline: "Gorgeous is my default.", color: T.champSoft },
    { label: "Lifemaxxing", tagline: "Highest timeline. Activated.", color: "#e8e0d0" },
    { label: "DNA Shifting", tagline: "My bloodline remembers.", color: "#9a8ad0" },
    { label: "Sleep Shifting", tagline: "I shift while I sleep.", color: "#000000" },
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
    <div className="hypno-bg" style={{ background: "linear-gradient(180deg,#fce8f0 0%,#f8e0ec 12%,#f5d8e8 22%,#f8e8d8 35%,#fdf4ee 50%)", minHeight: "100vh" }}>
      <audio ref={audioRef} src="https://qtwvslrwmreazmrdktsn.supabase.co/storage/v1/object/public/tracks/SPOILT%20INSTAGRAM%2013.04.2026.WAV" preload="none" onEnded={nextTrack} />
      <audio ref={vaultRef} preload="none" />

      {/* ANNOUNCEMENT BANNER — fixed height so nav never overlaps it */}
      {!menuOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 400, height: isMobile ? 36 : 40, background: "linear-gradient(90deg,#f5e0a0 0%,#e8b870 25%,#d4a090 50%,#c4789a 75%,#B76E79 100%)", display: "flex", alignItems: "center", justifyContent: "center", gap: isMobile ? 8 : 14, padding: "0 14px", overflow: "hidden" }}>
          <span style={{ fontFamily: "'Jost',sans-serif", fontSize: isMobile ? 10 : 12, fontWeight: 700, color: "#000", letterSpacing: isMobile ? "0.06em" : "0.14em", whiteSpace: "nowrap", textTransform: "uppercase" }}>
            {isMobile ? "✦ Lifetime · £500 · 1,000 spots only" : "✦  LIFETIME ACCESS  ·  £500 once, forever  ·  Only 1,000 spots"}
          </span>
          <button onClick={() => { const el = document.getElementById("pricing"); el ? el.scrollIntoView({behavior:"smooth"}) : onJoin("lifetime"); }} style={{ padding: "3px 10px", background: "rgba(0,0,0,0.18)", border: "1px solid rgba(0,0,0,0.25)", borderRadius: 20, color: "#000", fontSize: isMobile ? 10 : 11, fontWeight: 800, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}>
            Claim
          </button>
        </div>
      )}

      {/* NAV */}
      <nav style={{ position: "fixed", top: isMobile ? 36 : 40, left: 0, right: 0, zIndex: 300, height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", background: "rgba(0,0,0,0.97)", borderBottom: "1px solid #1c1828", backdropFilter: "blur(20px)" }}>
        <span className="wm wm-shimmer" style={{ fontSize: 18, fontWeight: 500, letterSpacing: "0.02em", cursor: "pointer", whiteSpace: "nowrap" }}>Self Hypnosis Goddess</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* Desktop nav */}
          {!isMobile && (<>
            <button onClick={()=>document.getElementById("pricing")?.scrollIntoView({behavior:"smooth"})} style={{ padding:"8px 12px",background:"none",border:"none",color:"#c8c0bc",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>Pricing</button>
            <button onClick={()=>document.getElementById("proofos")?.scrollIntoView({behavior:"smooth"})} style={{ padding:"8px 12px",background:"none",border:"none",color:"#c8c0bc",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>ProofOS</button>
            <button onClick={onDemo} style={{ padding:"8px 12px",background:"none",border:"none",color:"#B76E79",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>👁 Preview</button>
            <button onClick={onSignIn||onDemo} style={{ padding:"10px 18px",background:"none",border:"1px solid #B76E7944",borderRadius:22,color:"#B76E79",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>Sign in</button>
            <button onClick={onJoin} style={{ padding:"11px 22px",background:"linear-gradient(135deg,#d4a090,#B76E79)",border:"none",borderRadius:22,color:"#000",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"'Jost',sans-serif",textTransform:"uppercase" }}>Join ✦</button>
          </>)}
          {/* Mobile hamburger — white bars, animates to X */}
          {isMobile && (
            <button onClick={()=>setMenuOpen(m=>!m)} style={{ width:44,height:44,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:5,padding:0,WebkitTapHighlightColor:"transparent",touchAction:"manipulation" }} aria-label="Open menu">
              <div style={{ width:22,height:2,background:"#ffffff",borderRadius:1,transition:"transform 0.2s,opacity 0.2s",transform:menuOpen?"rotate(45deg) translate(5px,5px)":"none" }}/>
              <div style={{ width:22,height:2,background:"#ffffff",borderRadius:1,transition:"opacity 0.2s",opacity:menuOpen?0:1 }}/>
              <div style={{ width:22,height:2,background:"#ffffff",borderRadius:1,transition:"transform 0.2s",transform:menuOpen?"rotate(-45deg) translate(5px,-5px)":"none" }}/>
            </button>
          )}
        </div>
      </nav>

      {/* MOBILE MENU — rendered outside nav, truly fixed */}
      {menuOpen && isMobile && (
        <>
          <div style={{ position:"fixed",inset:0,zIndex:998,background:"rgba(0,0,0,0.65)" }} onClick={()=>setMenuOpen(false)}/>
          <div style={{ position:"fixed",top:90,left:12,right:12,zIndex:999,background:"#0a0612",border:"1px solid rgba(183,110,121,0.35)",borderRadius:18,padding:14,boxShadow:"0 24px 60px rgba(0,0,0,0.99)" }}>
            <button onClick={()=>{onDemo?.();setMenuOpen(false);}} style={{ display:"block",width:"100%",padding:"15px 16px",background:"linear-gradient(135deg,#d4a090,#B76E79)",border:"none",borderRadius:12,color:"#000",fontSize:15,fontWeight:800,cursor:"pointer",textAlign:"center",marginBottom:10,fontFamily:"'Jost',sans-serif",WebkitTapHighlightColor:"transparent" }}>
              👁 Preview the Dashboard
            </button>
            <button onClick={()=>{onSignIn?.();setMenuOpen(false);}} style={{ display:"flex",width:"100%",padding:"12px 16px",background:"rgba(183,110,121,0.1)",border:"1px solid rgba(183,110,121,0.25)",borderRadius:10,color:"#f2ece4",fontSize:14,fontWeight:600,cursor:"pointer",marginBottom:8,alignItems:"center",justifyContent:"center",gap:6,fontFamily:"'Jost',sans-serif",WebkitTapHighlightColor:"transparent" }}>
              Sign in<ArrowIcon size={12}/>
            </button>
            <div style={{ height:"0.5px",background:"rgba(183,110,121,0.18)",margin:"10px 0" }}/>
            {[
              [`${TIERS.audio.emoji} ${TIERS.audio.name} · ${TIERS.audio.monthly}/mo`,  ()=>{onJoin?.("audio");setMenuOpen(false);}],
              [`${TIERS.goddess.emoji} ${TIERS.goddess.name} · ${TIERS.goddess.monthly}/mo`, ()=>{onJoin?.("goddess");setMenuOpen(false);}],
              [`${TIERS.lifetime.emoji} ${TIERS.lifetime.name} · ${TIERS.lifetime.monthly}`, ()=>{onJoin?.("lifetime");setMenuOpen(false);}],
            ].map(([l,fn],i)=>(
              <button key={i} onClick={fn} style={{ display:"block",width:"100%",textAlign:"left",padding:"13px 14px",background:"none",border:"none",color:"#f2ece4",fontSize:14,fontWeight:600,cursor:"pointer",borderRadius:10,fontFamily:"'Jost',sans-serif",WebkitTapHighlightColor:"transparent" }}>{l}</button>
            ))}
            <div style={{ height:"0.5px",background:"rgba(183,110,121,0.18)",margin:"10px 0" }}/>
            {[
              ["Pricing", ()=>{document.getElementById("pricing")?.scrollIntoView({behavior:"smooth"});setMenuOpen(false);}, false],
              ["ProofOS ✦", ()=>{document.getElementById("proofos")?.scrollIntoView({behavior:"smooth"});setMenuOpen(false);}, false],
              ["YouTube", ()=>{window.open("https://www.youtube.com/@Reshma.Oracle","_blank");setMenuOpen(false);}, true],
            ].map(([l,fn,ext],i)=>(
              <button key={i} onClick={fn} style={{ display:"flex",width:"100%",textAlign:"left",padding:"11px 14px",background:"none",border:"none",color:"#c8c0bc",fontSize:13,fontWeight:500,cursor:"pointer",borderRadius:10,alignItems:"center",gap:6,fontFamily:"'Jost',sans-serif",WebkitTapHighlightColor:"transparent" }}>{l}{ext && <ExternalArrowIcon size={11}/>}</button>
            ))}
          </div>
        </>
      )}

      {/* HERO — DARK goddess energy */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 0, overflow: "hidden", minHeight: isMobile ? "auto" : "100vh", marginTop: isMobile ? 90 : 94, background: "#000000" }}>
        <Rings count={5} />
        {/* Dot grid overlay */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: "radial-gradient(circle, rgba(232,184,112,0.28) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)",
        }} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "clamp(52px,8vw,80px) clamp(20px,5vw,32px) clamp(52px,8vw,80px)", maxWidth: 800, margin: "0 auto", width: "100%" }}>
          <HeroMarquee />

          {/* TITLE */}
          <h1 className="wm" style={{ lineHeight: 1.05, marginBottom: 12 }}>
            <span style={{ fontSize: "clamp(30px,8vw,72px)", background: "linear-gradient(135deg,#e8c4a0 0%,#d4a090 35%,#c49090 60%,#B76E79 85%,#e8c4a0 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "block", }}>Self Hypnosis Goddess</span>
            <span style={{ fontSize: "clamp(22px,5.5vw,52px)", color: "#ffffff", fontWeight: 300, letterSpacing: "0.03em", display: "block", marginTop: 4 }}>Audio Library</span>
            <span style={{ fontSize: "clamp(14px,2.5vw,22px)", color: "#B76E79", fontWeight: 400, letterSpacing: "0.08em", display: "block", marginTop: 2 }}>(+ ProofOS)</span>
          </h1>

          {/* SPOTIFY TAGLINE */}
          <div style={{ fontSize: "clamp(13px,1.5vw,15px)", color: "#ffffff", letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700, marginBottom: 14, fontFamily: "'Jost',sans-serif" }}>
            Spotify for your subconscious mind
          </div>

          {/* TAGLINE */}
          <div style={{ fontSize: "clamp(20px,2.7vw,26px)", color: "#ffffff", fontWeight: 600, marginBottom: 10, letterSpacing: "0.01em" }}>
            Shift into your dream reality.
          </div>

          {/* WAKE UP KNOWING */}
          <div style={{ fontSize: "clamp(16px,2vw,20px)", color: "#ffffff", marginBottom: 32, lineHeight: 1.7 }}>
            Wake up knowing. Not hoping. <span style={{ color: "#f5e0a0", fontWeight: 600 }}>Knowing.</span>
          </div>
          {/* SPOTIFY-STYLE PLAYER */}
          <div style={{ background: "linear-gradient(135deg,#f5e0a0 0%,#e8b870 25%,#d4a090 55%,#c8789a 80%,#B76E79 100%)", border: "none", borderRadius: 18, padding: isMobile ? "18px" : "22px 26px", maxWidth: 520, margin: "0 auto 36px", boxShadow: "0 12px 60px rgba(212,160,144,0.4)" }}>
            {/* Top row — track info + waveform */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              {/* Album art */}
              <div style={{ width:56, height:56, borderRadius:10, background:"linear-gradient(135deg,#d4a090,#B76E79)", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 20px rgba(183,110,121,0.4)", overflow:"hidden", position:"relative" }}>
                <div style={{ display:"flex", alignItems:"flex-end", gap:2, height:28, position:"relative", zIndex:1 }}>
                  {[12,20,14,24,18,10,22,16].map((h,i)=>(
                    <div key={i} style={{ width:3, borderRadius:2, background:"rgba(0,0,0,0.6)", height:h, animation:`wave ${0.8+i*0.1}s ease-in-out infinite`, animationDelay:`${i*0.08}s` }}/>
                  ))}
                </div>
              </div>
              {/* Track info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: isMobile ? 15 : 17, fontWeight: 800, color: "#000", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Spoilt Goddess</div>
                <div style={{ fontSize: 13, color: "rgba(0,0,0,0.65)", fontFamily: "'Jost',sans-serif", fontWeight: 600, letterSpacing: "0.06em" }}>Reshma Oracle</div>
                <div style={{ fontSize: 12, color: "#111111", fontFamily: "'Jost',sans-serif", marginTop: 2 }}>Melodic House · EMDR · 528hz</div>
              </div>
              {/* Live badge */}
              {playing && (
                <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(0,0,0,0.15)", border: "1px solid rgba(0,0,0,0.25)", borderRadius: 20, padding: "4px 10px", flexShrink: 0 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(0,0,0,0.5)", animation: "pulse 1.2s ease-in-out infinite" }}/>
                  <span style={{ fontSize: 11, color: "rgba(0,0,0,0.75)", fontFamily: "'Jost',sans-serif", fontWeight: 700 }}>LIVE</span>
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ height: 4, background: "rgba(0,0,0,0.2)", borderRadius: 2, cursor: "pointer", position: "relative" }}
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

            {/* Controls row — Apple Music / Spotify style */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 4px" }}>
              {/* Shuffle */}
              <button style={{ background:"none", border:"none", cursor:"pointer", padding:8, opacity:0.45, lineHeight:0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg>
              </button>
              {/* Prev */}
              <button onClick={prevTrack} style={{ background:"none", border:"none", cursor:"pointer", padding:8, lineHeight:0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="rgba(0,0,0,0.7)"><path d="M19 20L9 12l10-8v16z"/><rect x="5" y="4" width="2.5" height="16" rx="1" fill="rgba(0,0,0,0.7)"/></svg>
              </button>
              {/* Play/Pause — big circle */}
              <button onClick={togglePlay} style={{ width:46, height:46, borderRadius:"50%", background:"rgba(0,0,0,0.75)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 24px rgba(183,110,121,0.45)", flexShrink:0, lineHeight:0, transition:"transform 0.15s, box-shadow 0.15s" }}
                onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.07)";e.currentTarget.style.boxShadow="0 6px 32px rgba(183,110,121,0.65)"}}
                onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="0 4px 24px rgba(183,110,121,0.45)"}}>
                {playing
                  ? <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><rect x="6" y="4" width="4" height="16" rx="1.5"/><rect x="14" y="4" width="4" height="16" rx="1.5"/></svg>
                  : <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><polygon points="7 3 21 12 7 21 7 3"/></svg>
                }
              </button>
              {/* Next */}
              <button onClick={nextTrack} style={{ background:"none", border:"none", cursor:"pointer", padding:8, lineHeight:0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="rgba(0,0,0,0.7)"><path d="M5 4l10 8-10 8V4z"/><rect x="16.5" y="4" width="2.5" height="16" rx="1" fill="rgba(0,0,0,0.7)"/></svg>
              </button>
              {/* Repeat */}
              <button style={{ background:"none", border:"none", cursor:"pointer", padding:8, lineHeight:0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.7)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
              </button>
            </div>

            {/* Track dots — playlist indicator */}
            <div style={{ display:"flex", justifyContent:"center", gap:6, marginTop:12 }}>
              {PLAYLIST.map((_,i) => (
                <button key={i} onClick={()=>loadTrack(i)} style={{ width: i===trackIdx?18:6, height:6, borderRadius:3, background: i===trackIdx?"rgba(0,0,0,0.6)":"rgba(0,0,0,0.2)", border:"none", cursor:"pointer", padding:0, transition:"all 0.25s" }}/>
              ))}
            </div>
            {/* Preview label for tracks without audio */}
            {!currentTrack.url && (
              <div style={{ textAlign:"center", marginTop:8, fontSize:11, color:"rgba(0,0,0,0.45)", fontFamily:"'Jost',sans-serif", letterSpacing:"0.15em" }}>
                FULL TRACK · INSIDE THE VAULT
              </div>
            )}
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
            <button onClick={() => { window.open("https://buy.stripe.com/00w8wP2tbgaG3pffdu7AI02","_blank"); }} style={{ padding: "16px 32px", width: isMobile ? "100%" : "auto", background: "transparent", border: "1.5px solid #B76E7966", borderRadius: 14, color: "#B76E79", fontSize: 16, fontWeight: 300, cursor: "pointer", letterSpacing: "0.1em", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              LIFETIME ACCESS<ArrowIcon size={14}/>
            </button>
          </div>
          <div style={{ fontSize: 14, color: "#000000", fontWeight: 600, textAlign: "center", marginBottom: 20 }}>{`Audio Tier ${TIERS.audio.monthly}/mo · Goddess Tier ${TIERS.goddess.monthly}/mo · Cancel anytime`}</div>

          {/* PREVIEW DASHBOARD — prominent on both mobile and desktop */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <button onClick={onDemo} style={{ padding: "14px 36px", background: "#000", border: "2px solid #B76E7966", borderRadius: 40, color: "#B76E79", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Jost',sans-serif", letterSpacing: "0.08em", display: "inline-flex", alignItems: "center", gap: 10, transition: "all 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#B76E79"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="#B76E7966"}>
              <span style={{ fontSize: 16 }}>👁</span>
              Preview Dashboard
            </button>
            <div style={{ fontSize: 11, color: "rgba(183,110,121,0.5)", marginTop: 8, fontFamily: "'Jost',sans-serif" }}>See exactly what members see — no signup needed</div>
          </div>

          {/* ── APP PREVIEW — right after CTAs ─────────────────────────── */}
          <AppPreviewSection isMobile={isMobile}/>

        </div>
      </div>

      {/* PURPOSE — what this is for, said first */}
      <div style={{ padding: isMobile?"48px 18px 24px":"64px 24px 32px", maxWidth: 780, margin: "0 auto", textAlign:"center" }}>
        <div style={{ fontSize:11, fontWeight:900, color:"#B76E79", letterSpacing:"0.28em", textTransform:"uppercase", marginBottom:14 }}>The purpose</div>
        <h2 className="wm" style={{ fontSize:"clamp(30px,4.6vw,54px)", color:"#000", lineHeight:1.12, marginBottom:20 }}>
          Shift into the state of<br/>
          <span style={{ background:"linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>your dream reality.</span>
        </h2>
        <p style={{ fontSize:"clamp(16px,2vw,20px)", color:"#000", lineHeight:1.8, maxWidth:600, margin:"0 auto 16px", fontWeight:600 }}>
          If you're reading this, you're probably stuck. You feel the gap — between your dream reality and your current one. I'm here to close that gap.
        </p>
        <p style={{ fontSize:"clamp(16px,2vw,20px)", color:"#000", lineHeight:1.8, maxWidth:600, margin:"0 auto 16px", fontWeight:600 }}>
          Your subconscious mind creates your entire reality. Your reality reorganizes to match who you become.
        </p>
        <p style={{ fontSize:"clamp(15px,1.85vw,17px)", color:"#000", lineHeight:1.85, maxWidth:620, margin:"0 auto" }}>
          The version of you who already has it — she has a different state. That's the only real gap. My audios shift you into her state while you rest. You start acting from her. Reality reorganizes around it.
        </p>
      </div>


      {/* THE MECHANISM — how it does that */}
      <div style={{ padding: isMobile?"20px 18px 40px":"20px 24px 56px", maxWidth: 780, margin: "0 auto", textAlign:"center" }}>
        <div style={{ fontSize:11, fontWeight:900, color:"#B76E79", letterSpacing:"0.28em", textTransform:"uppercase", marginBottom:14 }}>How</div>
        <p style={{ fontSize:"clamp(15px,1.9vw,18px)", color:"#000", lineHeight:1.85, maxWidth:640, margin:"0 auto 22px" }}>
          Every SHG track combines two things at once. My spoken self-hypnosis on top — the new self-concept, spoken as if it's already yours. Subliminals beneath the music, at a volume your subconscious receives clearly. You listen like you would a song. You're being installed while you enjoy it.
        </p>
        <div style={{ display:"flex", gap:10, flexWrap:"wrap", justifyContent:"center" }}>
          {[["🎙","Spoken hypnosis on top"],["♪","Subliminals underneath"],["◈","Music · EMDR · 528hz"]].map(([e,l],i)=>(
            <div key={i} style={{ padding:"10px 16px", background:"rgba(183,110,121,0.08)", border:"1px solid rgba(183,110,121,0.25)", borderRadius:24, fontSize:13, fontWeight:700, color:"#000", fontFamily:"'Jost',sans-serif" }}>{e} {l}</div>
          ))}
        </div>
        <p style={{ fontSize:12.5, color:"#666", marginTop:16 }}>Full breakdown lives inside the app · under The Guide ✦</p>
      </div>


      {/* HOW IT WORKS — JOURNEY TIMELINE */}
      <div style={{ padding: isMobile?"48px 18px":"80px 24px", background: "linear-gradient(160deg,#fdf0e8 0%,#fce8f0 40%,#f0e8fc 70%,#e8f0fc 100%)", position:"relative", overflow:"hidden" }}>
        {/* Ombre orb */}
        <div style={{ position:"absolute", top:"20%", left:"50%", transform:"translateX(-50%)", width:600, height:600, background:"radial-gradient(ellipse,rgba(212,160,144,0.15) 0%,rgba(183,110,121,0.08) 40%,transparent 70%)", pointerEvents:"none", borderRadius:"50%" }}/>

        <div style={{ maxWidth:860, margin:"0 auto", position:"relative", zIndex:1 }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <div style={{ fontSize:isMobile?24:36, color:"#B76E79", letterSpacing:"0.18em", textTransform:"uppercase", fontWeight:900, marginBottom:18, fontFamily:"'Jost',sans-serif" }}>How it works</div>
            <h2 className="wm" style={{ fontSize:"clamp(32px,5vw,64px)", lineHeight:1, marginBottom:16, color:"#1a0818" }}>
              Set intention.<br/>
              <span style={{ background:"linear-gradient(90deg,#e8b870,#d4a090,#c4789a,#B76E79)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Watch reality bend.</span>
            </h2>
            <p style={{ fontSize:isMobile?15:17, color:"#6a4858", lineHeight:1.8, maxWidth:560, margin:"0 auto" }}>This is not inspiration content. This is a daily practice that rewires you while you sleep, rest, and go about your life.</p>
          </div>

          {/* JOURNEY STEPS — ombre cards */}
          <div style={{ display:"flex", flexDirection:"column", gap:0, position:"relative" }}>
            {/* Vertical line */}
            {!isMobile && <div style={{ position:"absolute", left:40, top:0, bottom:0, width:2, background:"linear-gradient(180deg,#e8b870,#d4a090,#c4789a,#B76E79,#9060b0)", borderRadius:1, opacity:0.3 }}/>}

            {[
              { step:"01", label:"Set your intention", body:"Choose your desire. State it in present tense. Be specific — love, money, appearance, business. Write it in ProofOS. This is the anchor everything links back to.", bg:"linear-gradient(135deg,#fff8f0,#fceedd)", border:"#e8b87066", num:"#e8b870", text:"#5a3810" },
              { step:"02", label:"Listen to your audio", body:"Press play. Daily. First thing in the morning or last thing at night — when your brain is in theta. Melodic house as the foundation. Reshma's voice beneath it. Let it wash over you. No effort needed.", bg:"linear-gradient(135deg,#fdf0f0,#fce8e4)", border:"#d4a09066", num:"#d4a090", text:"#5a2818" },
              { step:"03", label:"Log signs and synchronicities", body:"Something shifts. He messages. Money arrives from somewhere you forgot. Your skin looks different in the mirror. A friend says your name first. Log it in ProofOS immediately — voice note, screenshot, written sign.", bg:"linear-gradient(135deg,#fdf0f5,#fce8f0)", border:"#c4789a66", num:"#c4789a", text:"#5a1030" },
              { step:"04", label:"Mark it manifested", body:"The moment the full desire lands — mark it. ProofOS records the date, the days of listening, the audio, the signs that preceded it. Your personal proof. Undeniable and documented forever.", bg:"linear-gradient(135deg,#f8f0fc,#f0e8f8)", border:"#9060b066", num:"#9060b0", text:"#3a1050" },
            ].map((s,i)=>(
              <div key={i} style={{ display:"flex", gap:isMobile?14:24, marginBottom:16, alignItems:"flex-start" }}>
                {/* Step number circle */}
                <div style={{ width:isMobile?48:56, height:isMobile?48:56, borderRadius:"50%", background:"linear-gradient(135deg,#fff,rgba(255,255,255,0.8))", border:`2px solid ${s.num}66`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:`0 4px 20px ${s.num}22` }}>
                  <span style={{ fontSize:isMobile?14:16, fontWeight:900, color:s.num, fontFamily:"'Jost',sans-serif" }}>{s.step}</span>
                </div>
                {/* Card */}
                <div style={{ flex:1, background:s.bg, border:`1px solid ${s.border}`, borderRadius:16, padding:"20px 22px", boxShadow:`0 4px 24px ${s.num}14` }}>
                  <div style={{ fontSize:isMobile?16:20, fontWeight:800, color:s.text, marginBottom:8, fontFamily:"'Jost',sans-serif" }}>{s.label}</div>
                  <div style={{ fontSize:isMobile?13:15, color:s.text, lineHeight:1.75, opacity:0.85 }}>{s.body}</div>
                </div>
              </div>
            ))}

            {/* MANIFESTED — final celebration */}
            <div style={{ display:"flex", gap:isMobile?14:24, alignItems:"flex-start" }}>
              <div style={{ width:isMobile?48:56, height:isMobile?48:56, borderRadius:"50%", background:"linear-gradient(135deg,#f5e0a0,#d4a090,#B76E79)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 8px 32px rgba(183,110,121,0.4)" }}>
                <span style={{ fontSize:isMobile?18:22 }}>✓</span>
              </div>
              <div style={{ flex:1, background:"linear-gradient(135deg,#fceedd,#f8d8f0,#ede0fc)", border:"2px solid rgba(183,110,121,0.4)", borderRadius:16, padding:"24px 24px", boxShadow:"0 8px 40px rgba(183,110,121,0.2)" }}>
                <div style={{ fontSize:isMobile?18:24, fontWeight:900, background:"linear-gradient(90deg,#e8b870,#d4a090,#B76E79)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:8, fontFamily:"'Jost',sans-serif" }}>Manifested.</div>
                <div style={{ fontSize:isMobile?13:15, color:"#6a3050", lineHeight:1.75 }}>The proof thread closes. The date is recorded. The evidence was there the whole time. You close the loop and open the next one.</div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* OLD ASSUMPTION → NEW ASSUMPTION */}
      <div style={{ padding: isMobile?"48px 0":"70px 0", background: "#fdf0e8", width: "100%" }}>
        <div style={{ padding: isMobile?"0 18px":"0 24px", maxWidth: 860, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontSize: 12, color: "#B76E79", letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 800, marginBottom: 14 }}>The mechanism</div>
            <h2 className="wm" style={{ fontSize: "clamp(28px,4vw,52px)", color: "#000", lineHeight: 1.12, marginBottom: 16 }}>
              Every audio replaces<br/>
              <span style={{ background: "linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>an old assumption with a new one.</span>
            </h2>
            <p style={{ fontSize: "clamp(15px,1.9vw,18px)", color: "#000", lineHeight: 1.85, maxWidth: 560, margin: "0 auto" }}>
              Your reality runs on assumptions — what you quietly hold as true about yourself. Installed in theta, the new assumption becomes the default. Then your reality reorganises to match it.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: isMobile?26:32 }}>
            {[
              ["I'm never the one he chooses.", "I am chosen. I'm his dream girl."],
              ["Money comes from grinding harder.", "Money finds me first — effortlessly."],
              ["Some women are just born with it. I wasn't.", "Gorgeous is my default. My bloodline remembers."],
            ].map(([o,nw],i)=>(
              <div key={i} style={{ position: "relative" }}>
              <div style={{ fontSize: isMobile?18:22, fontWeight: 900, color: "#B76E79", fontFamily: "'Jost',sans-serif", letterSpacing: "0.1em", marginBottom: 10 }}>{String(i+1).padStart(2,"0")}</div>
              <div style={{ display: "flex", flexDirection: isMobile?"column":"row", gap: isMobile?8:14, alignItems: "stretch" }}>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.8)", border: "1px solid rgba(180,60,60,0.25)", borderRadius: 14, padding: "16px 18px" }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: "#a04040", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 6 }}>✗ Old assumption</div>
                  <div style={{ fontSize: isMobile?14:16, color: "#000", fontWeight: 500, lineHeight: 1.5 }}>{o}</div>
                </div>
                <div style={{ alignSelf: "center", transform: isMobile?"rotate(90deg)":"none" }}><ArrowIcon size={18} color="#B76E79"/></div>
                <div style={{ flex: 1, background: "linear-gradient(135deg,#fff4e4,#ffe8dc)", border: "1.5px solid rgba(183,110,121,0.4)", borderRadius: 14, padding: "16px 18px" }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: "#B76E79", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 6 }}>✦ New assumption</div>
                  <div style={{ fontSize: isMobile?14:16, color: "#000", fontWeight: 700, lineHeight: 1.5 }}>{nw}</div>
                </div>
              </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAXXING CAROUSEL */}
      <MaxxingCarousel cats={cats} />


      {/* IMAGE PLACEHOLDER — brain state visual */}
      <div style={{ padding: "0 clamp(16px,4vw,24px) 24px", maxWidth: 760, margin: "0 auto" }}>
        <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(183,110,121,0.3)", background: "linear-gradient(135deg,#fde8f0,#f8dde8)", height: isMobile ? 220 : 320, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 30%,#B76E7910,transparent 70%)", pointerEvents: "none" }}/>
          <div style={{ fontSize: isMobile ? 40 : 56 }}>🧠</div>
          <div style={{ fontSize: isMobile ? 14 : 16, color: "#B76E79", fontWeight: 600, fontFamily: "'Jost',sans-serif", letterSpacing: "0.15em", textTransform: "uppercase" }}>Theta state · 4–8 Hz</div>
          <div style={{ fontSize: isMobile ? 12 : 14, color: "#111111", textAlign: "center", maxWidth: 360, lineHeight: 1.6 }}>The subconscious is only accessible in theta.<br/>This is where the install happens.</div>
          <div style={{ fontSize: 11, color: "#3a2a1a", marginTop: 8, fontFamily: "'Jost',sans-serif", letterSpacing: "0.15em" }}>[ BRAND IMAGE — replace with brain scan visual ]</div>
        </div>
      </div>
      {/* THE PROBLEM SECTION — full-bleed peach */}
      <div style={{ padding: isMobile ? "48px 0" : "80px 0", background: "linear-gradient(160deg,#fce4d0 0%,#fbd8c2 50%,#fce4d0 100%)", width: "100%" }}>
      <div style={{ padding: isMobile ? "0 18px" : "0 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 12, color: "#B76E79", letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>Read this if you're stuck</div>
          <h2 className="wm" style={{ fontSize: "clamp(28px,4vw,54px)", color: "#000000", lineHeight: 1.1, marginBottom: 20 }}>
            There's a reason<br />
            it hasn't clicked yet.<br />
            <span style={{ background: "linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>And it's not your effort.</span>
          </h2>
          <p style={{ fontSize: "clamp(16px,2vw,20px)", color: "#000000", lineHeight: 1.9, maxWidth: 620, margin: "0 auto" }}>
            You've watched the videos at 2am. Saved the affirmations. Scripted for three days straight. Journaled until your hand hurt. Made the vision board and looked at it every morning.
          </p>
          <p style={{ fontSize: "clamp(16px,2vw,20px)", color: "#000000", lineHeight: 1.9, maxWidth: 620, margin: "16px auto 0" }}>
            And you're still refreshing your phone for the text that doesn't come. Still checking the bank balance that won't move. Still watching other women receive the exact thing you've been asking for — with half your effort.
          </p>
          <p style={{ fontSize: "clamp(16px,2vw,20px)", color: "#000000", lineHeight: 1.9, maxWidth: 620, margin: "16px auto 0" }}>
            So you've started to quietly wonder if you're the problem. If you're blocked. If it works for everyone except you.
          </p>
          <p style={{ fontSize: "clamp(18px,2.2vw,23px)", color: "#000000", lineHeight: 1.7, maxWidth: 560, margin: "24px auto 0", fontFamily: "'Jost',sans-serif", fontWeight: 700 }}>
            It's not the effort that's the problem.<br/>
            It's the state you're acting from.
          </p>
          <p style={{ fontSize: "clamp(15px,1.8vw,18px)", color: "#000000", lineHeight: 1.9, maxWidth: 600, margin: "16px auto 0" }}>
            Your current actions lead to your current outcome. The version of you who already has what you want — she has a completely different identity. Different thoughts. Different ideas. Different actions that feel natural to her. You cannot know her actions until you become her. There is no other way.
          </p>
          <div style={{ background: "rgba(255,255,255,0.85)", border: "2px solid rgba(183,110,121,0.35)", borderRadius: 18, padding: isMobile?"22px 20px":"30px 34px", maxWidth: 640, margin: "32px auto 0" }}>
            <div style={{ fontSize: 12, color: "#B76E79", letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 800, marginBottom: 12 }}>This is where self-hypnosis comes in</div>
            <p style={{ fontSize: "clamp(15px,1.9vw,18px)", color: "#000", lineHeight: 1.85, margin: "0 0 14px" }}>
              Self-hypnosis is the same practice as hypnotherapy — the same depth, the same direct access to the subconscious. The difference: no therapist, no appointments, no waiting a week between sessions. You reprogram your own subconscious mind through daily practice, on your own. My voice guides you into the state — you just press play. And because you can do it every single day, you get the one thing a session with a therapist can never give you: repetition. That's what makes it permanent.
            </p>
            <p style={{ fontSize: "clamp(16px,2vw,20px)", color: "#000", lineHeight: 1.8, margin: 0, fontWeight: 600 }}>
              My audios shift you into the state — theta, where the subconscious actually opens. The new assumption installs while you rest. You start acting from her state without trying.
            </p>
            <p style={{ fontSize: "clamp(17px,2.1vw,22px)", color: "#000", lineHeight: 1.7, margin: "14px 0 0", fontWeight: 800 }}>
              You shift into your dream reality because you shifted into the state first.
            </p>
          </div>
        </div>
        <div style={{ ...G3(isMobile), gap: 20 }}>
          {[
            {
              num: "01",
              title: "It's all happening at the conscious level",
              body: "Scripting, visualising, affirming — everything you've been doing is conscious. It operates at beta frequency. But your beliefs, your identity, the patterns that create your reality? Those live in the subconscious. And the subconscious is only accessible in theta state (4–8 Hz). You've been knocking on a door that's been locked the whole time.",
              fix: "SHG audios guide your brain into theta using binaural beats and EMDR — within minutes of pressing play."
            },
            {
              num: "02",
              title: "The wiring underneath hasn't changed",
              body: "You can repeat 'I am abundant' a thousand times. But if the subconscious is still running 'money is hard' — the conscious affirmation doesn't stand a chance. The old belief isn't wrong because you haven't tried hard enough. It's wrong because it was installed before you had the words for it, at a cellular level, through experience. You need to go that deep to change it.",
              fix: "Reshma's voice + EMDR bilateral stimulation dissolves the old belief at its root — not just the surface thought."
            },
            {
              num: "03",
              title: "You stopped before the rewire was complete",
              body: "Most people give up at day 9. The shift was happening on day 14. Without a way to see the evidence building — the sign, the synchronicity, the unexpected thing that arrived — you assume nothing's working. You stop. And you miss it. The pattern was already in motion.",
              fix: "ProofOS captures every sign as it arrives. You see the evidence building in real time. You don't stop early."
            }
          ].map((p, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.82)", border: "1px solid rgba(183,110,121,0.22)", borderRadius: 16, padding: 28, borderTop: "2px solid #B76E79", boxShadow: "0 2px 18px rgba(183,110,121,0.07)" }}>
              <div style={{ fontSize: 12, color: "#B76E7966", fontWeight: 700, letterSpacing: "0.2em", marginBottom: 14 }}>{p.num}</div>
              <div style={{ fontSize: "clamp(18px,2vw,22px)", fontWeight: 800, color: "#000000", marginBottom: 12, lineHeight: 1.2, fontFamily: "'Jost',sans-serif" }}>{p.title}</div>
              <p style={{ fontSize: 15, color: "#000000", lineHeight: 1.9, marginBottom: 16 }}>{p.body}</p>
              <div style={{ fontSize: 14, color: "#B76E79", fontWeight: 600, paddingTop: 14, borderTop: "1px solid rgba(183,110,121,0.2)" }}>✦ {p.fix}</div>
            </div>
          ))}
        </div>
        {/* IMAGE PLACEHOLDER — after the three reasons */}
        <div style={{ marginTop: 32, borderRadius: 20, overflow: "hidden", border: "1px solid rgba(183,110,121,0.3)", background: "linear-gradient(135deg,#2a1020,#180a18)", padding: isMobile?"24px 16px":"36px 32px" }}>
          <svg viewBox="0 0 800 220" style={{ width:"100%", height:"auto", display:"block" }}>
            <defs>
              <linearGradient id="betaG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#8a6a70"/><stop offset="1" stopColor="#a08088"/></linearGradient>
              <linearGradient id="thetaG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#f5e0a0"/><stop offset="0.5" stopColor="#d4a090"/><stop offset="1" stopColor="#B76E79"/></linearGradient>
            </defs>
            <text x="20" y="40" fill="#a08088" fontSize="15" fontFamily="Jost,sans-serif" fontWeight="700" letterSpacing="2">BETA — AWAKE, GUARDED</text>
            <path d="M20 75 Q30 55 40 75 Q50 95 60 75 Q70 55 80 75 Q90 95 100 75 Q110 55 120 75 Q130 95 140 75 Q150 55 160 75 Q170 95 180 75 Q190 55 200 75 Q210 95 220 75 Q230 55 240 75 Q250 95 260 75 Q270 55 280 75 Q290 95 300 75 Q310 55 320 75 Q330 95 340 75 Q350 55 360 75 Q370 95 380 75 Q390 55 400 75 Q410 95 420 75 Q430 55 440 75 Q450 95 460 75 Q470 55 480 75 Q490 95 500 75 Q510 55 520 75 Q530 95 540 75 Q550 55 560 75 Q570 95 580 75 Q590 55 600 75 Q610 95 620 75 Q630 55 640 75 Q650 95 660 75 Q670 55 680 75 Q690 95 700 75 Q710 55 720 75 Q730 95 740 75 Q750 55 760 75 Q770 95 780 75" stroke="url(#betaG)" strokeWidth="2.5" fill="none" opacity="0.85"/>
            <text x="20" y="145" fill="#f5e0a0" fontSize="15" fontFamily="Jost,sans-serif" fontWeight="700" letterSpacing="2">THETA — WHERE MY AUDIOS TAKE YOU</text>
            <path d="M20 185 Q65 140 110 185 Q155 230 200 185 Q245 140 290 185 Q335 230 380 185 Q425 140 470 185 Q515 230 560 185 Q605 140 650 185 Q695 230 740 185 Q762 163 780 176" stroke="url(#thetaG)" strokeWidth="4" fill="none" strokeLinecap="round"/>
          </svg>
          <div style={{ fontSize: 12, color: "#d8ccc0", fontFamily: "'Jost',sans-serif", letterSpacing: "0.12em", textAlign:"center", marginTop:14 }}>Fast, defended brainwaves — vs the slow, open state where the new identity installs</div>
        </div>
      </div>
      </div>



      {/* PROOFOS INTRO — peach section */}
      <div id="proofos" style={{ padding: isMobile ? "48px 18px" : "70px 24px", background: "linear-gradient(160deg,#fce4d4 0%,#f5cfc0 30%,#eab8ac 60%,#d9a2a0 80%,#c98d96 100%)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 12, color: "#B76E79", letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>Goddess Tier · Included</div>
            <h2 className="wm" style={{ fontSize: "clamp(28px,4vw,52px)", lineHeight: 1.1, marginBottom: 16 }}>
              <span style={{ color: "#000000" }}>Introducing </span>
              <span style={{ background: "linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ProofOS</span>
            </h2>
            <p style={{ fontSize: "clamp(16px,2vw,20px)", color: "#111111", lineHeight: 1.8, maxWidth: 560, margin: "0 auto" }}>
              The system that links every audio you listen to with real evidence of what shifts. Not journaling. Not affirmations. <strong style={{ color: "#000000" }}>Proof.</strong>
            </p>
            <p style={{ fontSize: "clamp(15px,1.9vw,19px)", color: "#000", lineHeight: 1.75, maxWidth: 540, margin: "14px auto 0", fontWeight: 700 }}>
              Your manifestation tracker for life. Your proof wall for life. Every sign, every synchronicity, every screenshot — captured in one place for the rest of your life.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { num: "01", title: "Listen", body: "Press play. Sleep with it on. Let the audio do the work while your conscious mind rests.", bg: "linear-gradient(135deg,#fde8f0,#f8d8e8)", icon: (
                <svg width="70" height="70" viewBox="0 0 100 100" fill="none">
                  <defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d4a090"/><stop offset="1" stopColor="#B76E79"/></linearGradient></defs>
                  <path d="M25 55 Q25 30 50 30 Q75 30 75 55" stroke="url(#g1)" strokeWidth="3" strokeLinecap="round" fill="none"/>
                  <rect x="18" y="52" width="14" height="22" rx="4" fill="url(#g1)"/>
                  <rect x="68" y="52" width="14" height="22" rx="4" fill="url(#g1)"/>
                  <path d="M15 40 Q10 45 15 50" stroke="#B76E79" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"/>
                  <path d="M85 40 Q90 45 85 50" stroke="#B76E79" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"/>
                  <path d="M10 35 Q3 45 10 55" stroke="#B76E79" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3"/>
                  <path d="M90 35 Q97 45 90 55" stroke="#B76E79" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.3"/>
                </svg>
              )},
              { num: "02", title: "Link", body: "Open a Proof Thread for your specific desire. Link it to the audio that's working on it.", bg: "linear-gradient(135deg,#f0ddf8,#e8d0f0)", icon: (
                <svg width="70" height="70" viewBox="0 0 100 100" fill="none">
                  <defs><linearGradient id="g2a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e8b870"/><stop offset="1" stopColor="#d4a090"/></linearGradient><linearGradient id="g2b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d4a090"/><stop offset="1" stopColor="#B76E79"/></linearGradient></defs>
                  <ellipse cx="38" cy="50" rx="20" ry="14" stroke="url(#g2a)" strokeWidth="4" fill="none" transform="rotate(-25 38 50)"/>
                  <ellipse cx="62" cy="50" rx="20" ry="14" stroke="url(#g2b)" strokeWidth="4" fill="none" transform="rotate(25 62 50)"/>
                  <circle cx="50" cy="50" r="2" fill="#B76E79"/>
                </svg>
              )},
              { num: "03", title: "Capture", body: "Log signs, synchronicities, photo proof, voice notes. Anything that arrives — capture it here.", bg: "linear-gradient(135deg,#fceedd,#f8e4cc)", icon: (
                <svg width="70" height="70" viewBox="0 0 100 100" fill="none">
                  <defs><linearGradient id="g3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e8b870"/><stop offset="1" stopColor="#B76E79"/></linearGradient></defs>
                  <rect x="30" y="18" width="40" height="64" rx="6" stroke="url(#g3)" strokeWidth="3" fill="rgba(255,255,255,0.5)"/>
                  <path d="M50 35 L52 42 L59 42 L53 46 L55 53 L50 49 L45 53 L47 46 L41 42 L48 42 Z" fill="url(#g3)"/>
                  <circle cx="40" cy="62" r="1.5" fill="#B76E79" opacity="0.7"/>
                  <circle cx="60" cy="60" r="1.5" fill="#e8b870" opacity="0.7"/>
                  <circle cx="50" cy="70" r="1.5" fill="#d4a090" opacity="0.7"/>
                  <circle cx="45" cy="55" r="1" fill="#B76E79" opacity="0.5"/>
                  <circle cx="55" cy="66" r="1" fill="#e8b870" opacity="0.5"/>
                </svg>
              )},
              { num: "04", title: "Mark manifested", body: "When it arrives, mark it. See exactly how many days it took and which audio preceded it.", bg: "linear-gradient(135deg,#f8e0e8,#f0d0dc)", icon: (
                <svg width="70" height="70" viewBox="0 0 100 100" fill="none">
                  <defs><linearGradient id="g4" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f5e0a0"/><stop offset="0.5" stopColor="#d4a090"/><stop offset="1" stopColor="#B76E79"/></linearGradient><radialGradient id="g4b"><stop offset="0" stopColor="#f5e0a0" stopOpacity="0.4"/><stop offset="1" stopColor="#B76E79" stopOpacity="0"/></radialGradient></defs>
                  <circle cx="50" cy="50" r="40" fill="url(#g4b)"/>
                  <circle cx="50" cy="50" r="26" stroke="url(#g4)" strokeWidth="3" fill="rgba(255,255,255,0.6)"/>
                  <path d="M38 50 L46 58 L62 42" stroke="url(#g4)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <line x1="50" y1="10" x2="50" y2="16" stroke="#e8b870" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
                  <line x1="50" y1="84" x2="50" y2="90" stroke="#B76E79" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
                  <line x1="10" y1="50" x2="16" y2="50" stroke="#d4a090" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
                  <line x1="84" y1="50" x2="90" y2="50" stroke="#d4a090" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
                  <line x1="22" y1="22" x2="26" y2="26" stroke="#e8b870" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                  <line x1="74" y1="74" x2="78" y2="78" stroke="#B76E79" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                  <line x1="22" y1="78" x2="26" y2="74" stroke="#d4a090" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                  <line x1="74" y1="26" x2="78" y2="22" stroke="#e8b870" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                </svg>
              )},
            ].map((s, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.9)", border: "1px solid rgba(183,110,121,0.22)", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 18px rgba(183,110,121,0.07)", display: "flex", flexDirection: isMobile ? "column" : "row" }}>
                {/* SVG icon */}
                <div style={{ width: isMobile ? "100%" : 180, height: isMobile ? 120 : "auto", minHeight: 110, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, borderBottom: isMobile ? "1px solid rgba(183,110,121,0.15)" : "none", borderRight: isMobile ? "none" : "1px solid rgba(183,110,121,0.15)" }}>
                  {s.icon}
                </div>
                <div style={{ padding: "20px 22px", flex: 1 }}>
                  <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: "#000000", marginBottom: 8, fontFamily: "'Jost',sans-serif", lineHeight: 1.1 }}>{s.title}</div>
                  <div style={{ fontSize: 14, color: "#000000", lineHeight: 1.75 }}>{s.body}</div>
                </div>
              </div>
            ))}
          </div>

          {/* REAL PROOFOS SCREENSHOT */}
          <div style={{ display: "flex", flexDirection: isMobile?"column":"row", alignItems: "center", gap: isMobile?28:48, marginTop: 48 }}>
            <div style={{ flex: isMobile?"none":"0 0 auto", display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
              <ProofWallScreenshot width={isMobile?260:230} theme={proofTheme}/>
              {/* Dark/Light toggle — matches hero style */}
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:11, color:proofTheme==="dark"?"#1a0a10":"#5a4060", fontFamily:"'Jost',sans-serif", fontWeight:600, letterSpacing:"0.05em" }}>Dark</span>
                <button onClick={()=>setProofTheme(t=>t==="dark"?"light":"dark")}
                  style={{ width:44, height:24, borderRadius:12, background:proofTheme==="light"?"#B76E79":"#1a0a10", border:"1px solid rgba(0,0,0,0.15)", cursor:"pointer", position:"relative", transition:"background 0.25s", padding:0 }}>
                  <div style={{ width:18, height:18, borderRadius:"50%", background:"#fff", position:"absolute", top:2, left:proofTheme==="light"?23:3, transition:"left 0.25s", boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }}/>
                </button>
                <span style={{ fontSize:11, color:proofTheme==="light"?"#1a0a10":"#5a4060", fontFamily:"'Jost',sans-serif", fontWeight:600, letterSpacing:"0.05em" }}>Light</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: "#B76E79", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>How the tracking actually works</div>
              <div style={{ fontSize: isMobile?16:18, fontWeight: 700, color: "#000", marginBottom: 12, lineHeight: 1.3 }}>Every desire gets its own thread. Every thread links to a track.</div>
              <p style={{ fontSize: 14, color: "#1a1218", lineHeight: 1.85, marginBottom: 12 }}>
                Say your desire out loud: "£5,000 arrives unexpectedly." Log it in ProofOS. Choose the audio you're pairing it with — Money Finds Me First, say. Now every time you play that track, ProofOS quietly counts the day.
              </p>
              <p style={{ fontSize: 14, color: "#1a1218", lineHeight: 1.85, marginBottom: 12 }}>
                As signs show up — an unexpected refund, a client paying early, a random win — you log them against that thread. Each sign stacks as evidence. You watch the pile grow, day by day, listen by listen.
              </p>
              <p style={{ fontSize: 14, color: "#1a1218", lineHeight: 1.85 }}>
                The moment it lands, you mark it manifested. ProofOS timestamps it — desire, track, days it took, signs logged along the way. That record never disappears. It becomes your evidence that this works, in your own data, not someone else's testimonial.
              </p>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 28 }}>
            <span style={{ fontSize: 14, color: "#B76E79", fontWeight: 500 }}>Included in Goddess Tier · £33/mo</span>
          </div>
        </div>
      </div>

            {/* MELODIC HOUSE USP — light yellow background */}
      <div style={{ padding: isMobile ? "48px 18px" : "70px clamp(16px,4vw,24px)", background: "linear-gradient(160deg,#fffde8 0%,#fff9cc 40%,#fffde8 80%,#fff8d0 100%)", width: "100%" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ background: "transparent", border: "none", borderRadius: 20, padding: isMobile?"28px 0":"36px 0", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 12, color: "#9060c0", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 14, textAlign: "center" }}>What makes this different</div>
            <h2 className="wm" style={{ fontSize: "clamp(32px,5vw,60px)", lineHeight: 1.1, marginBottom: 16, background: "linear-gradient(90deg,#6040b0,#9060c0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textAlign: "center" }}>
              Hypnosis layered beneath<br/>melodic house music.
            </h2>
            <p style={{ fontSize: "clamp(16px,2vw,19px)", color: "#3a2a60", lineHeight: 1.85, marginBottom: 16, maxWidth: 680, textAlign: "center", margin: "0 auto 16px" }}>
              Reshma's audios are produced with melodic house music as the sonic foundation. This is not background noise. The music is chosen and layered at specific frequencies to keep the body in a receptive, open state — so Reshma's voice can reach deeper.
            </p>
            <p style={{ fontSize: "clamp(15px,1.8vw,17px)", color: "#5a4880", lineHeight: 1.85, marginBottom: 28, maxWidth: 680, textAlign: "center", margin: "0 auto 28px" }}>
              You will not find this anywhere else. Most hypnosis is voice-only or layered with generic ambient sound. This is a different experience — one that makes listening feel like a ritual, not a task.
            </p>

            {/* THREE FORMATS */}
            <div style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(144,96,192,0.2)", borderRadius: 14, padding: "18px 24px", marginBottom: 28, maxWidth: 560, margin: "0 auto 28px" }}>
              <div style={{ fontSize: 11, color: "#7040a0", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>Six formats — each does something different</div>
              {[
                { icon: "🎵", label: "Melodic House", body: "Reshma's voice layered beneath original melodic house music. You listen like you would a song — and it rewires you beneath the surface." },
                { icon: "🌊", label: "Melodic Calm", body: "Slower, softer melodic layers for winding down. The same encoding — delivered at the pace your nervous system needs at night." },
                { icon: "🌙", label: "Subliminal", body: "Pure music. No audible voice. Affirmations encoded beneath the frequency. Works while you sleep, rest, or go about your day." },
                { icon: "◈", label: "EMDR Hypnosis", body: "Bilateral audio stimulation dissolves old identity blocks at their root. Deep identity reset in a single session." },
                { icon: "🎼", label: "528hz Frequency", body: "The 'love frequency' — tuned to promote repair and coherence at the cellular level while you rest." },
                { icon: "✋", label: "Reiki Encoded", body: "Tracks channelled with Reiki energy during recording. Frequency healing layered directly into the audio you sleep to." },
              ].map((f,i)=>(
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", paddingBottom: i<5?12:0, marginBottom: i<5?12:0, borderBottom: i<5?"1px solid rgba(144,96,192,0.12)":"none" }}>
                  <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{f.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#2a1a50", marginBottom: 3 }}>{f.label}</div>
                    <div style={{ fontSize: 13, color: "#5a4060", lineHeight: 1.65 }}>{f.body}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* INFINITY DIAGRAM — the addiction loop */}
            <div style={{ background:"linear-gradient(135deg,#0a0508,#1a0a15,#0a0508)", border:"1px solid rgba(183,110,121,0.25)", borderRadius:20, padding: isMobile?"32px 18px":"48px 40px", marginBottom: 24, boxShadow:"0 12px 60px rgba(183,110,121,0.15)" }}>
              <div style={{ textAlign:"center", marginBottom: 24 }}>
                <div style={{ fontSize:11, letterSpacing:"0.25em", color:"#B76E79", textTransform:"uppercase", fontWeight:800, fontFamily:"'Jost',sans-serif" }}>The addiction loop</div>
                <div style={{ fontSize:isMobile?15:18, color:"#f5e0a0", marginTop:8, fontFamily:"'Jost',sans-serif", fontWeight:500 }}>Music installs the state. You come back. The state deepens.</div>
              </div>
              <svg viewBox="0 0 800 260" style={{ width:"100%", height:"auto", display:"block", maxWidth:720, margin:"0 auto" }}>
                <defs>
                  <linearGradient id="infA" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#f5e0a0"/><stop offset="0.5" stopColor="#d4a090"/><stop offset="1" stopColor="#B76E79"/>
                  </linearGradient>
                  <linearGradient id="infB" x1="1" y1="0" x2="0" y2="0">
                    <stop offset="0" stopColor="#f5e0a0"/><stop offset="0.5" stopColor="#d4a090"/><stop offset="1" stopColor="#B76E79"/>
                  </linearGradient>
                  <radialGradient id="nodeA"><stop offset="0" stopColor="#f5e0a0"/><stop offset="1" stopColor="#e8b870"/></radialGradient>
                  <radialGradient id="nodeB"><stop offset="0" stopColor="#f0d0c0" stopOpacity="1"/><stop offset="1" stopColor="#d4a090"/></radialGradient>
                  <radialGradient id="nodeC"><stop offset="0" stopColor="#e89aa8"/><stop offset="1" stopColor="#B76E79"/></radialGradient>
                </defs>
                {/* Left lobe — arcs from music node up + around to receptivity center */}
                <path d="M 400 130 C 380 40, 220 40, 160 130 C 100 220, 260 220, 400 130" stroke="url(#infA)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                {/* Right lobe — from center out to ritual and back */}
                <path d="M 400 130 C 420 40, 580 40, 640 130 C 700 220, 540 220, 400 130" stroke="url(#infB)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                {/* Soft glow rings behind nodes */}
                <circle cx="160" cy="130" r="42" fill="url(#nodeA)" opacity="0.08"/>
                <circle cx="400" cy="130" r="48" fill="url(#nodeB)" opacity="0.10"/>
                <circle cx="640" cy="130" r="42" fill="url(#nodeC)" opacity="0.08"/>
                {/* Node dots */}
                <circle cx="160" cy="130" r="11" fill="url(#nodeA)"/>
                <circle cx="400" cy="130" r="14" fill="url(#nodeB)"/>
                <circle cx="640" cy="130" r="11" fill="url(#nodeC)"/>
                {/* Node labels */}
                <text x="160" y="80" textAnchor="middle" fill="#f5e0a0" fontSize="17" fontFamily="Jost,sans-serif" fontWeight="800" letterSpacing="2">01 · MUSIC</text>
                <text x="160" y="185" textAnchor="middle" fill="#c8b8a0" fontSize="11" fontFamily="Jost,sans-serif">Holds the frequency</text>
                <text x="400" y="80" textAnchor="middle" fill="#e8c4a8" fontSize="17" fontFamily="Jost,sans-serif" fontWeight="800" letterSpacing="2">02 · RECEPTIVITY</text>
                <text x="400" y="185" textAnchor="middle" fill="#c8b8a0" fontSize="11" fontFamily="Jost,sans-serif">You open. Identity installs.</text>
                <text x="640" y="80" textAnchor="middle" fill="#e89aa8" fontSize="17" fontFamily="Jost,sans-serif" fontWeight="800" letterSpacing="2">03 · RITUAL</text>
                <text x="640" y="185" textAnchor="middle" fill="#c8b8a0" fontSize="11" fontFamily="Jost,sans-serif">You return. It deepens.</text>
                {/* Directional arrows on the path */}
                <polygon points="0,-5 10,0 0,5" fill="#f5e0a0" transform="translate(240,50) rotate(180)"/>
                <polygon points="0,-5 10,0 0,5" fill="#B76E79" transform="translate(560,50)"/>
              </svg>
              <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr":"1fr 1fr 1fr", gap: 14, marginTop: 24 }}>
                {[
                  { n:"01", title:"Music as frequency", body:"Melodic house holds a specific energetic state throughout the session. You're not analysing — you're bathing in it.", accent:"#f5e0a0" },
                  { n:"02", title:"Deeper receptivity", body:"Body relaxes. Subconscious opens. Reshma's voice installs the version of you who already has it — while you enjoy the track.", accent:"#d4a090" },
                  { n:"03", title:"Ritual, not content", body:"The music is so good you come back. Every return installs the identity deeper. The addiction becomes the transformation.", accent:"#B76E79" },
                ].map((c,i)=>(
                  <div key={i} style={{ padding: 16, background:"rgba(245,224,160,0.04)", border:`1px solid ${c.accent}33`, borderRadius: 12 }}>
                    <div style={{ fontSize:10, letterSpacing:"0.15em", color:c.accent, fontWeight:800, fontFamily:"'Jost',sans-serif", marginBottom:6 }}>{c.n}</div>
                    <div style={{ fontSize:14, fontWeight:700, color:"#f5e0a0", fontFamily:"'Jost',sans-serif", marginBottom:6 }}>{c.title}</div>
                    <div style={{ fontSize:12.5, color:"#c8b8a0", lineHeight:1.7 }}>{c.body}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      {/* LANDING PROOF WALL — exact mirror of the live dashboard */}
      <LandingProofWall isMobile={isMobile}/>

      {/* WHY I BUILT THIS — BLACK */}
      <div style={{ background: "#000", padding: isMobile?"56px 18px":"90px 24px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"30%", left:"50%", transform:"translateX(-50%)", width:500, height:500, background:"radial-gradient(ellipse,rgba(183,110,121,0.06) 0%,transparent 70%)", pointerEvents:"none", borderRadius:"50%" }}/>
        <div style={{ maxWidth:760, margin:"0 auto", position:"relative", zIndex:1 }}>
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <div style={{ fontSize:11, color:"#B76E79", letterSpacing:"0.28em", textTransform:"uppercase", fontWeight:700, marginBottom:20, fontFamily:"'Jost',sans-serif" }}>Reshma Oracle · Why I built this</div>
            <h2 className="wm" style={{ fontSize:"clamp(28px,4.2vw,52px)", color:"#f2ece4", lineHeight:1.15, marginBottom:24, fontWeight:400 }}>
              The world is bingeing<br/>
              <span style={{ background:"linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>on manifestation content.</span>
            </h2>
          </div>
          <div style={{ maxWidth:680, margin:"0 auto", display:"flex", flexDirection:"column", gap:20 }}>
            <p style={{ fontSize:isMobile?18:22, color:"#f2ece4", lineHeight:1.7, fontFamily:"'Jost',sans-serif", fontWeight:400, letterSpacing:"0.01em" }}>
              "Everyone is consuming. And no one is installing. That's why I built this."
            </p>
            <p style={{ fontSize:isMobile?15:17, color:"#c8c0bc", lineHeight:1.85 }}>
              I press play. My subconscious received it. And a new version of me was starting to be born.
            </p>
            <p style={{ fontSize:isMobile?15:17, color:"#c8c0bc", lineHeight:1.85 }}>
              That's why I built this. Not another thing to consume. A practice you repeat every single day, passively — while you sleep, rest, go to the gym, commute. You build evidence. The proof becomes impossible to ignore.
            </p>
            <div style={{ background:"linear-gradient(135deg,#f5e0a0 0%,#e8b870 22%,#d4a090 48%,#c4789a 72%,#B76E79 100%)", backgroundSize:"250%", backgroundPosition:"left", borderRadius:16, padding:isMobile?"24px 22px":"32px 32px", marginTop:8 }}>
              <p style={{ fontSize:isMobile?13:14, color:"#000", lineHeight:1.8, fontFamily:"'Jost',sans-serif", fontWeight:500, margin:0 }}>
                "I needed something I could do every single day — that happened while I lived my life. That installed me without needing me to try."
              </p>
              <div style={{ fontSize:11, fontWeight:700, color:"#000", marginTop:10, fontFamily:"'Jost',sans-serif", letterSpacing:"0.08em" }}>— RESHMA ORACLE</div>
            </div>
          </div>
        </div>
      </div>

      {/* DNA ACTIVATION SECTION */}
      <div style={{ padding: isMobile ? "60px 18px" : "90px 24px", background: "linear-gradient(160deg,#dbeeff 0%,#c8e4fb 35%,#d4ecff 70%,#c0e0fa 100%)", position: "relative", overflow: "hidden" }}>
        {/* Background glow */}
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width: 600, height: 600, background: "radial-gradient(ellipse,rgba(183,110,121,0.06) 0%,transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* Eyebrow */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, color: "#0a5090", fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 16, fontFamily: "'Jost',sans-serif" }}>
              963hz · DNA Activation
            </div>
            <h2 className="wm" style={{ fontSize: "clamp(34px,5.5vw,64px)", color: "#000", lineHeight: 1.1, marginBottom: 20 }}>
              We don't stop at the surface.<br/>
              <span style={{ background: "linear-gradient(90deg,#0a5090,#B76E79)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>We go all the way down.</span>
            </h2>
            <p style={{ fontSize: isMobile ? 17 : 19, color: "#000", lineHeight: 1.85, maxWidth: 580, margin: "0 auto", fontWeight: 500 }}>
              Most audios work on thought patterns. Ours go deeper — to the cellular level. To the part of you that holds the pattern before the thought even forms.
            </p>
          </div>

          {/* Two column — passion statement left, what this means right */}
          <div style={{ display: isMobile ? "flex" : "grid", flexDirection: "column", gridTemplateColumns: "1fr 1fr", gap: isMobile ? 24 : 40, marginBottom: 48 }}>

            {/* Left — Reshma's voice */}
            <div style={{ borderLeft: "3px solid #B76E79", paddingLeft: 28 }}>
              <div style={{ fontSize: 11, color: "#B76E79", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16, fontFamily: "'Jost',sans-serif" }}>Why I built this</div>
              <p style={{ fontSize: isMobile ? 16 : 18, color: "#0a1a30", lineHeight: 1.8, fontFamily: "'Jost',sans-serif", fontWeight: 500, marginBottom: 16 }}>
                "I got obsessed with the science of why some people shift fast and others stay stuck for years. The answer wasn't mindset. It wasn't effort. It was depth.
              </p>
              <p style={{ fontSize: isMobile ? 16 : 18, color: "#0a1a30", lineHeight: 1.8, fontFamily: "'Jost',sans-serif", fontWeight: 500, marginBottom: 16 }}>
                The subconscious doesn't respond to the words. It responds to the frequency, the state, and the repetition. When you combine theta brainwaves with 963hz and EMDR — you're not just changing a thought. You're changing the signal your cells are running on.
              </p>
              <p style={{ fontSize: isMobile ? 16 : 18, color: "#0a1a30", lineHeight: 1.8, fontFamily: "'Jost',sans-serif", fontWeight: 500 }}>
                That's why this works when everything else didn't."
              </p>
              <div style={{ marginTop: 20, fontSize: 13, color: "#B76E79", fontWeight: 700, fontFamily: "'Jost',sans-serif" }}>— RESHMA ORACLE</div>
            </div>

            {/* Right — the three levels */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { level: "Level 01", title: "Mind", body: "Theta brainwaves (4–8 Hz) bypass the conscious filter entirely. New beliefs install without resistance. This is where hypnosis, subliminals, and hemi-sync operate.", color: "#0a5090", bg: "linear-gradient(135deg,#cfe8ff,#a8d0f8)" },
                { level: "Level 02", title: "Identity", body: "EMDR bilateral stimulation and Reiki frequency encoding dissolve the old self-concept at its root — the assumption formed before you had the words for it.", color: "#1a7030", bg: "linear-gradient(135deg,#d0f4d0,#a8e8a8)" },
                { level: "Level 03", title: "DNA", body: "963hz activates what researchers call the 'God frequency' — the cellular resonance that governs your energetic blueprint. Where the deepest patterns live, and where they can be permanently rewritten.", color: "#7030a0", bg: "linear-gradient(135deg,#ecdcff,#d4b8f8)" },
              ].map((item, i) => (
                <div key={i} style={{ background: item.bg, border: `1px solid ${item.color}33`, borderRadius: 12, padding: "20px 22px" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: 10, color: item.color, fontWeight: 800, letterSpacing: "0.2em", fontFamily: "'Jost',sans-serif" }}>{item.level}</span>
                    <span style={{ fontSize: isMobile ? 18 : 20, fontWeight: 800, color: "#000", fontFamily: "'Jost',sans-serif" }}>{item.title}</span>
                  </div>
                  <div style={{ fontSize: 14, color: "#1a1a1a", lineHeight: 1.75 }}>{item.body}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom — the passive daily practice promise */}
          <div style={{ background: "linear-gradient(135deg,#e8f8f4,#f4e8f8)", border: "1px solid rgba(183,110,121,0.25)", borderRadius: 18, padding: isMobile ? "28px 22px" : "36px 44px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 100%,rgba(183,110,121,0.08),transparent 70%)", pointerEvents: "none" }}/>
            <div style={{ position: "relative", zIndex: 1 }}>
              <h3 className="wm" style={{ fontSize: "clamp(22px,3.5vw,36px)", color: "#1a1018", marginBottom: 14, lineHeight: 1.2 }}>
                Something you do every day.<br/>
                <span style={{ color: "#B76E79" }}>Passively. For the rest of your life.</span>
              </h3>
              <p style={{ fontSize: 16, color: "#5a3848", lineHeight: 1.85, maxWidth: 540, margin: "0 auto 24px" }}>
                You are not wasting time anymore. You are not hoping something might stick. You press play — and the reprogramming happens. In your sleep. In the background. Every single day. Building the version of you that already has everything.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
                {["Sleep while it installs", "No effort required", "Works every session", "Deeper every time"].map((tag, i) => (
                  <span key={i} style={{ padding: "7px 16px", background: "rgba(183,110,121,0.12)", border: "1px solid rgba(183,110,121,0.3)", borderRadius: 20, fontSize: 12, color: "#d4a090", fontWeight: 600, fontFamily: "'Jost',sans-serif" }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* IMAGE PLACEHOLDER — after bloodline remembers */}
      <div style={{ marginTop: 32, borderRadius: 20, overflow: "hidden", border: "1px solid rgba(183,110,121,0.3)", background: "linear-gradient(135deg,#180a18,#2a1020)", padding: isMobile?"20px 16px":"32px", display:"flex", justifyContent:"center" }}>
          <svg viewBox="0 0 600 200" style={{ width:"100%", maxWidth:560, height:"auto" }}>
            <defs><linearGradient id="dnaG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#f5e0a0"/><stop offset="0.35" stopColor="#e8b870"/><stop offset="0.7" stopColor="#d4a090"/><stop offset="1" stopColor="#B76E79"/></linearGradient></defs>
            <path d="M30 40 Q105 160 180 40 Q255 -80 330 40 Q405 160 480 40 Q530 -40 570 40" stroke="url(#dnaG)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            <path d="M30 160 Q105 40 180 160 Q255 280 330 160 Q405 40 480 160 Q530 240 570 160" stroke="url(#dnaG)" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.75"/>
            <line x1="68" y1="72" x2="68" y2="128" stroke="#d4a090" strokeWidth="2" opacity="0.6"/>
            <line x1="105" y1="95" x2="105" y2="105" stroke="#e8b870" strokeWidth="2" opacity="0.7"/>
            <line x1="142" y1="72" x2="142" y2="128" stroke="#d4a090" strokeWidth="2" opacity="0.6"/>
            <line x1="180" y1="52" x2="180" y2="148" stroke="#B76E79" strokeWidth="2" opacity="0.55"/>
            <line x1="218" y1="72" x2="218" y2="128" stroke="#d4a090" strokeWidth="2" opacity="0.6"/>
            <line x1="255" y1="95" x2="255" y2="105" stroke="#e8b870" strokeWidth="2" opacity="0.7"/>
            <line x1="292" y1="72" x2="292" y2="128" stroke="#d4a090" strokeWidth="2" opacity="0.6"/>
            <line x1="330" y1="52" x2="330" y2="148" stroke="#B76E79" strokeWidth="2" opacity="0.55"/>
            <line x1="368" y1="72" x2="368" y2="128" stroke="#d4a090" strokeWidth="2" opacity="0.6"/>
            <line x1="405" y1="95" x2="405" y2="105" stroke="#e8b870" strokeWidth="2" opacity="0.7"/>
            <line x1="442" y1="72" x2="442" y2="128" stroke="#d4a090" strokeWidth="2" opacity="0.6"/>
            <line x1="480" y1="52" x2="480" y2="148" stroke="#B76E79" strokeWidth="2" opacity="0.55"/>
            <line x1="518" y1="72" x2="518" y2="128" stroke="#d4a090" strokeWidth="2" opacity="0.6"/>
            <circle cx="30" cy="40" r="5" fill="#f5e0a0"/><circle cx="30" cy="160" r="5" fill="#f5e0a0" opacity="0.75"/>
            <circle cx="180" cy="40" r="5" fill="#e8b870"/><circle cx="180" cy="160" r="5" fill="#e8b870" opacity="0.75"/>
            <circle cx="330" cy="40" r="5" fill="#d4a090"/><circle cx="330" cy="160" r="5" fill="#d4a090" opacity="0.75"/>
            <circle cx="480" cy="40" r="5" fill="#B76E79"/><circle cx="480" cy="160" r="5" fill="#B76E79" opacity="0.75"/>
          </svg>
        </div>

      {/* SCIENCE — cream, one colour throughout */}
      <div style={{ padding: "70px 0", background: "#fdf0e8", width: "100%" }}>
      <div style={{ padding: "0 24px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 13, color: "#000000", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 16, fontWeight: 700 }}>The science</div>
          <h2 className="wm" style={{ fontSize: "clamp(36px,6vw,68px)", color: "#000000", lineHeight: 1.1, marginBottom: 22 }}>
            Your subconscious mind<br />
            <span style={{ background: `linear-gradient(90deg,${T.champagne},${T.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>creates your entire reality.</span>
          </h2>
          <p style={{ fontSize: 19, color: "#111111", lineHeight: 1.9, maxWidth: 700, margin: "0 auto 16px" }}>
            Neuroscience confirms 95% of your thoughts, beliefs and behaviours are subconscious. Your self-concept — what you assume to be true about yourself, down to a DNA level — determines everything you experience. Not your desires. Your assumptions.
          </p>
          <p style={{ fontSize: 19, color: "#111111", lineHeight: 1.9, maxWidth: 700, margin: "0 auto" }}>
            You can read every book. Study Neville Goddard. Understand every theory. But theory without installation changes nothing. These audios install it — passively, at depth, while your conscious mind rests.
          </p>
        </div>

        {/* AUDIO SAMPLES */}
      <div style={{ padding: "0 clamp(16px,4vw,24px) 70px", maxWidth: 720, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 12, color: "#B76E79", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 14 }}>Inside the vault</div>
          <h2 className="wm" style={{ fontSize: "clamp(28px,4vw,44px)", color: "#000000", lineHeight: 1.15, marginBottom: 14 }}>
            Three formats.<br />
            <span style={{ background: "linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>One voice. Your subconscious.</span>
          </h2>
          <p style={{ fontSize: 15, color: "#000000", lineHeight: 1.8, maxWidth: 480, margin: "0 auto" }}>
            Melodic house for deep receptivity. Sleep subliminals for overnight installation. Vocals only for pure hypnotic induction. Reshma decides the format for each desire.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { title: "Spoilt Goddess", format: "Melodic House · EMDR · 528hz", freq: "528hz", badge: "▶ Free Preview", badgeColor: "#B76E79", icon: "🎵", desc: "Self-concept. Receiving. Identity. Reshma's voice layered beneath melodic house music.", url: "https://qtwvslrwmreazmrdktsn.supabase.co/storage/v1/object/public/tracks/SPOILT%20INSTAGRAM%2013.04.2026.WAV" },
            { title: "Money Finds Me First", format: "Spoken Hypnosis · 528hz", freq: "528hz", badge: "In the vault", badgeColor: "#1a7030", icon: "💰", desc: "Wealth. Receiving. Abundance. One of the tracks waiting inside.", url: "https://qtwvslrwmreazmrdktsn.supabase.co/storage/v1/object/public/tracks/29.06.2026-6.mp3" },
            { title: "While I Sleep I Manifest", format: "Subliminal · Music Only · No Voice", freq: "Delta", badge: "Subliminal", badgeColor: "#7a9ab0", icon: "🌙", desc: "Pure frequency. No voice. Affirmations beneath melodic house — works while you sleep." },
          ].map((a, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.82)", border: "1px solid rgba(183,110,121,0.2)", borderRadius: 14, padding: "16px 20px", display: "flex", gap: 14, alignItems: "center" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#B76E7944"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#1c1828"}
            >
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "linear-gradient(135deg,#d4a09018,#B76E7918)", border: "1px solid #B76E7933", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{a.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#000000", marginBottom: 3 }}>{a.title}</div>
                <div style={{ fontSize: 13, color: "#000000" }}>{a.format} · {a.freq}</div>
              </div>
              <span style={{ fontSize: 11, padding: "3px 10px", background: a.badgeColor + "18", border: `1px solid ${a.badgeColor}44`, borderRadius: 20, color: a.badgeColor, fontWeight: 600, letterSpacing: "0.08em", flexShrink: 0, whiteSpace: "nowrap" }}>{a.badge}</span>
              <button onClick={() => {
                if (!a.url) return;
                if (vaultPlaying === i) {
                  vaultRef.current?.pause(); setVaultPlaying(null);
                } else {
                  if (playing) { audioRef.current?.pause(); setPlaying(false); }
                  if (vaultRef.current) { vaultRef.current.src = a.url; vaultRef.current.play().catch(()=>{}); }
                  setVaultPlaying(i);
                }
              }} style={{ width: 36, height: 36, borderRadius: "50%", background: a.url ? "linear-gradient(135deg,#d4a090,#B76E79)" : "#1a1614", border: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, cursor: a.url ? "pointer" : "default", color: "#000" }}>
                {a.url ? (vaultPlaying === i ? "⏸" : "▶") : "🔒"}
              </button>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: "#111111" }}>Sample previews · Full tracks unlock in the vault</div>
      </div>

        {/* TECHNOLOGY TABLE */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 13, color: "#000000", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 14, fontWeight: 700 }}>The technology</div>
          <h2 className="wm" style={{ fontSize: "clamp(24px,4vw,48px)", color: "#000000", marginBottom: 12 }}>What's inside every audio.</h2>
          <p style={{ fontSize: isMobile?15:17, color: "#000000", maxWidth: 600, margin: "0 auto", lineHeight: 1.7 }}>Every track is layered with multiple technologies working simultaneously to activate your brainwave state and install the new self-concept at depth.</p>
        </div>
        {isMobile ? (
          /* MOBILE — stacked cards */
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 56 }}>
            {TECH_ROWS.map((row, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.88)", border: "1px solid rgba(183,110,121,0.15)", borderRadius: 14, padding: "16px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#6040b0" }}>{row.t}</div>
                  <div style={{ fontSize: 11, color: "#B76E79", textAlign: "right", maxWidth: "45%", lineHeight: 1.4 }}>{row.when}</div>
                </div>
                <div style={{ fontSize: 13, color: "#333", lineHeight: 1.6, marginBottom: 4 }}><strong style={{color:"#000"}}>{row.w}</strong></div>
                <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>{row.d}</div>
              </div>
            ))}
          </div>
        ) : (
          /* DESKTOP — grid table */
          <div style={{ background: "rgba(255,255,255,0.82)", border: "1px solid rgba(183,110,121,0.2)", borderRadius: 16, overflow: "hidden", marginBottom: 70 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1.8fr 2fr 1.6fr", background: "#0f0b01", borderBottom: "1px solid #1c1828" }}>
              {["Technology", "What it is", "What it does", "When it activates"].map((h, i) => (
                <div key={i} style={{ padding: "13px 18px", fontSize: 12, color: "#B76E79", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", borderRight: i < 3 ? "1px solid #1c1828" : "none" }}>{h}</div>
              ))}
            </div>
            {TECH_ROWS.map((row, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1.3fr 1.8fr 2fr 1.6fr", borderBottom: i < TECH_ROWS.length-1 ? "1px solid rgba(183,110,121,0.08)" : "none" }}>
                <div style={{ padding: "15px 18px", fontSize: 14, fontWeight: 700, color: "#5040a0", borderRight: "1px solid rgba(183,110,121,0.08)" }}>{row.t}</div>
                <div style={{ padding: "15px 18px", fontSize: 13, color: "#1a0a1a", borderRight: "1px solid rgba(183,110,121,0.08)", lineHeight: 1.6 }}>{row.w}</div>
                <div style={{ padding: "15px 18px", fontSize: 13, color: "#2a1a2a", borderRight: "1px solid rgba(183,110,121,0.08)", lineHeight: 1.6 }}>{row.d}</div>
                <div style={{ padding: "15px 18px", fontSize: 12, color: "#B76E79", lineHeight: 1.6 }}>{row.when}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      </div>
      {/* WALL OF LOVE */}
      <div style={{ padding: isMobile?"48px 18px 60px":"70px 24px", background:"linear-gradient(160deg,#fff6f8 0%,#fef0f5 50%,#fff6f8 100%)" }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ fontSize: isMobile?13:14, fontWeight:700, color:"#B76E79", letterSpacing:"0.3em", textTransform:"uppercase", marginBottom:16, fontFamily:"'Jost',sans-serif" }}>Real results from real members</div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:isMobile?"clamp(40px,10vw,56px)":"clamp(48px,6vw,72px)", fontWeight:400, color:"#1a0818", letterSpacing:"-0.01em", lineHeight:1 }}>
              Wall of <span style={{ background:"linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Love</span>
            </h2>
          </div>
          <div style={{...GPRICE(isMobile)}}>
            {[
              { quote: "I listened on day 1 and felt something shift. By day 5 he texted. I didn't even look for it.", name: "Sarah, 29", cat: "SP & Love" },
              { quote: "£1,800 came back as a refund I had forgotten about. Three days after starting Money Finds Me First.", name: "Priya, 33", cat: "Money" },
              { quote: "I look the same and feel completely different about my face. The glow is internal first.", name: "Maya, 26", cat: "Beauty" },
              { quote: "I've tried every subliminal channel. This is the only one where I actually feel it working in real time.", name: "Jade, 31", cat: "Identity" },
              { quote: "Woke up knowing he was coming back. No logical reason. He called that afternoon.", name: "Layla, 28", cat: "SP & Love" },
              { quote: "The sleep subliminal changed my dreams. I woke up feeling like money was already mine.", name: "Chloe, 35", cat: "Money" },
            ].map((t, i) => (
              <div key={i} style={{ background:"#fff", border:"1px solid rgba(183,110,121,0.2)", borderRadius:16, padding:"22px 20px", display:"flex", flexDirection:"column", gap:12, boxShadow:"0 4px 24px rgba(183,110,121,0.08)" }}>
                <div style={{ width:32, height:24, opacity:0.25 }}>
                  <svg viewBox="0 0 32 24" fill="#B76E79"><path d="M0 24V14.4C0 10.24 1.12 6.72 3.36 3.84 5.6.96 8.64.16 12.48 0L13.44 2.4C10.88 3.04 8.96 4.16 7.68 5.76 6.4 7.36 5.76 9.28 5.76 11.52H11.52V24H0zm20.48 0V14.4c0-4.16 1.12-7.68 3.36-10.56C26.08.96 29.12.16 32.96 0L33.92 2.4C31.36 3.04 29.44 4.16 28.16 5.76c-1.28 1.6-1.92 3.52-1.92 5.76h5.76V24H20.48z"/></svg>
                </div>
                <p style={{ fontSize:isMobile?15:17, color:"#2a1020", lineHeight:1.85, fontFamily:"'Cormorant Garamond',serif", flex:1 }}>{t.quote}</p>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontSize:12, fontWeight:700, color:"#7a5060", fontFamily:"'Jost',sans-serif" }}>{t.name}</span>
                  <span style={{ fontSize:11, padding:"3px 10px", background:"rgba(183,110,121,0.1)", border:"1px solid rgba(183,110,121,0.25)", borderRadius:20, color:"#B76E79", fontWeight:700, letterSpacing:"0.06em", fontFamily:"'Jost',sans-serif" }}>{t.cat}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRICING */}
      <PricingSection onJoin={onJoin} />

      {/* FAQ */}
      <FAQSection />

      {/* FINAL CTA */}
      <div style={{ position: "relative", padding: "80px 24px", textAlign: "center", overflow: "hidden", borderTop: T.border }}>
        <Rings count={3} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 className="wm" style={{ fontSize: "clamp(28px,5vw,52px)", color: "#000000", lineHeight: 1.2, marginBottom: 24 }}>
            Wake up knowing.<br />
            <span style={{ background: "linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Not hoping. Knowing.</span>
          </h2>
          <p style={{ fontSize: 17, color: "#000000", marginBottom: 32, lineHeight: 1.7, maxWidth: 500, margin: "0 auto 32px" }}>
            In that state, reality shows you the proof of what you already know.
          </p>
          <button onClick={onJoin} className="cta-shake" style={{ padding: "18px 52px", background: "linear-gradient(135deg,#d4a090,#B76E79)", boxShadow: "0 0 40px rgba(183,110,121,0.4)", border: "none", borderRadius: 14, color: "#000", fontSize: 17, fontWeight: 800, cursor: "pointer", minHeight: 56, fontFamily: "'Jost',sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10 }}>Start your shift<ArrowIcon size={16}/></button>
          <div style={{ marginTop: 12, fontSize: 14, color: "#111111" }}>Cancel anytime · No download · Any device</div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: T.border, padding: "28px 24px", textAlign: "center" }}>
        <span className="wm wm-shimmer" style={{ fontSize: 22, display: "block", marginBottom: 8 }}>Self Hypnosis Goddess</span>
        <div style={{ fontSize: 13, color: "#111111", marginBottom: 6 }}>Reshma Oracle · reshmaoracle.com · Not on YouTube</div>
        <div style={{ fontSize: 12, color: T.borderGlow, letterSpacing: "0.15em" }}>© 2026 RESHMA ORACLE · ALL RIGHTS RESERVED</div>
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
          <div style={{ fontSize: 16, fontWeight: 700, color: "#000000", marginBottom: 20 }}>Logged.</div>
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
              <button key={i} onClick={() => setVal(s)} style={{ padding: "5px 12px", background: "none", border: "1px solid #1c1828", borderRadius: 20, color: "#000000", fontSize: 13, cursor: "pointer" }}>{s}</button>
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
