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
    trialNote: "3-day free trial, then £19/mo",
    features: ["Full exclusive audio vault","All 6 formats — Melodic House, Subliminal, EMDR, Calm, 528hz, Reiki","Loop player + sleep timer","New tracks every week","All desire categories","No ads. Ever."],
    cta: (annual)=> annual ? "Join Audio — £143/year" : "Start 3-Day Free Trial",
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

        <div style={{padding:"20px 24px 28px",display:"flex",flexDirection:"column",gap:12,overflow:"visible"}}>

          {/* AUDIO TIER */}
          <div style={{background:"linear-gradient(135deg,#fdf0e8,#f5e0d0)",border:"1.5px solid #B76E7955",borderRadius:16,padding:"18px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div>
                <div style={{fontSize:16,fontWeight:800,color:"#2a1210",marginBottom:2}}>Audio Tier</div>
                <div style={{fontSize:11,color:"#8a7268",fontWeight:600,letterSpacing:"0.06em"}}>The full vault</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:26,fontWeight:900,color:"#B76E79",lineHeight:1}}>{isAnnual?TIERS.audio.annual:TIERS.audio.monthly}</div>
                <div style={{fontSize:11,color:"#d4a090"}}>{isAnnual?"/year":"/month"}</div>
                {isAnnual && <div style={{fontSize:10,color:"#d4a090"}}>£11.92/mo · billed once</div>}
              </div>
            </div>
            <div style={{marginBottom:12}}>
              {["Full audio vault — all desire categories","New tracks every week","Loop player · sleep timer · background play","Sleep subliminals · binaural · Reiki frequencies","No ads. Ever."].map((f,i)=>(
                <div key={i} style={{fontSize:12,color:"#4a2820",marginBottom:5,paddingLeft:12,position:"relative",lineHeight:1.5}}>
                  <span style={{position:"absolute",left:0,color:"#B76E79"}}>·</span>{f}
                </div>
              ))}
            </div>
            <button onClick={()=>goStripe("audio")} className="cta-shake" style={{width:"100%",padding:"12px",background:"linear-gradient(135deg,#e8b870,#d4a090)",border:"none",borderRadius:10,color:"#000",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"'Jost',sans-serif",letterSpacing:"0.04em",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:7}}>
              {TIERS.audio.cta(isAnnual)}<ArrowIcon/>
            </button>
          </div>

          {/* GODDESS TIER */}
          <div style={{background:"linear-gradient(135deg,#fce8f0,#f8d8e8)",border:"2px solid #B76E79",borderRadius:16,padding:"22px 18px 18px",marginTop:16,position:"relative",overflow:"visible"}}>
            <div style={{position:"absolute",top:10,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(90deg,#d4a090,#B76E79)",borderRadius:20,padding:"4px 16px",fontSize:10,fontWeight:800,color:"#000",letterSpacing:"0.1em",whiteSpace:"nowrap",zIndex:5}}>✦ MOST POPULAR</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,marginTop:18}}>
              <div>
                <div style={{fontSize:16,fontWeight:800,color:"#8a6020",marginBottom:2}}>Goddess Tier</div>
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
          <div style={{background:"#000",border:"1.5px solid #e8b87066",borderRadius:16,padding:"18px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div>
                <div style={{fontSize:16,fontWeight:800,color:"#f5e0a0",marginBottom:2}}>Lifetime Access</div>
                <div style={{fontSize:11,color:"#c8a870",fontWeight:600,letterSpacing:"0.06em"}}>Once. Forever.</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:26,fontWeight:900,color:"#f5e0a0",lineHeight:1}}>{TIERS.lifetime.monthly}</div>
                <div style={{fontSize:11,color:"#c8a870"}}>one time</div>
              </div>
            </div>
            <div style={{marginBottom:12}}>
              {["Full vault + ProofOS for life","Every future audio ever released","Every future feature · No subscription","1,000 spots only"].map((f,i)=>(
                <div key={i} style={{fontSize:12,color:"#e8dcc8",marginBottom:5,paddingLeft:12,position:"relative",lineHeight:1.5}}>
                  <span style={{position:"absolute",left:0,color:"#e8b870"}}>·</span>{f}
                </div>
              ))}
            </div>
            <button onClick={()=>goStripe("lifetime")} className="cta-shake" style={{width:"100%",padding:"12px",background:"linear-gradient(135deg,#f5e0a0,#e8b870,#d4a090,#B76E79)",border:"none",borderRadius:10,color:"#000",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"'Jost',sans-serif",boxShadow:"0 4px 20px rgba(232,184,112,0.25)",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:7}}>{TIERS.lifetime.cta()}<ArrowIcon/></button>
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
    { id: "audio", name: TIERS.audio.name, price: isAnnual ? TIERS.audio.annual : TIERS.audio.monthly, note: isAnnual ? TIERS.audio.annualNote : TIERS.audio.trialNote, features: TIERS.audio.features, cta: TIERS.audio.cta(isAnnual), bg: "#0a0a0a", border: "#B76E7955", nameColor: "#2a1210", muteColor: "#8a7268", priceColor: "#B76E79", periodColor: "#d4a090", featureColor: "#4a2820", dot: "#B76E79", ctaBg: "linear-gradient(135deg,#e8b870,#d4a090)", ctaColor: "#000" },
    { id: "goddess", name: TIERS.goddess.name, price: isAnnual ? TIERS.goddess.annual : TIERS.goddess.monthly, note: isAnnual ? TIERS.goddess.annualNote : null, features: TIERS.goddess.features, cta: TIERS.goddess.cta(isAnnual), bg: "linear-gradient(160deg,#fce4c0,#f5d9a8)", border: "#e8a860", nameColor: "#2a1a08", muteColor: "#c9963a", priceColor: "#c9963a", periodColor: "#8a7268", featureColor: "#5a4020", dot: "#e8a860", ctaBg: "linear-gradient(135deg,#fce4c0,#e8a860,#c9963a)", ctaColor: "#000", popular: true },
    { id: "lifetime", name: TIERS.lifetime.name, price: TIERS.lifetime.monthly, note: TIERS.lifetime.annualNote, features: TIERS.lifetime.features, cta: TIERS.lifetime.cta(), bg: "#000", border: "#e8b87066", nameColor: "#f5e0a0", muteColor: "#c8a870", priceColor: "#f5e0a0", periodColor: "#c8a870", featureColor: "#e8dcc8", dot: "#e8b870", ctaBg: "linear-gradient(135deg,#f5e0a0,#e8b870,#d4a090,#B76E79)", ctaColor: "#000" },
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

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 16, overflow: "visible" }}>
          {cards.map(c => (
            <div key={c.id} style={{ background: c.bg.startsWith("linear") || c.bg === "#000" ? undefined : c.bg, backgroundImage: c.bg.startsWith("linear") ? c.bg : undefined, backgroundColor: c.bg === "#000" ? "#000" : undefined, border: `${c.popular ? "2px" : "1px"} solid ${c.border}`, borderRadius: 18, padding: c.popular ? "38px 22px 24px" : "24px 22px", marginTop: c.popular ? 14 : 0, position: "relative", overflow: "visible", boxShadow: c.popular ? "0 8px 32px rgba(183,110,121,0.18)" : "0 4px 20px rgba(0,0,0,0.04)" }}>
              {c.popular && <div style={{ position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(90deg,#f5e0a0,#B76E79)", color: "#000", fontSize: 10, fontWeight: 800, padding: "4px 14px", borderRadius: 20, letterSpacing: "0.1em", whiteSpace: "nowrap", zIndex: 5 }}>MOST POPULAR</div>}
              <div style={{ fontSize: 16, fontWeight: 700, color: c.nameColor, marginBottom: 4, fontFamily: "'Jost',sans-serif" }}>{c.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                <span style={{ fontSize: 32, fontWeight: 900, color: c.priceColor }}>{c.price}</span>
                <span style={{ fontSize: 13, color: c.periodColor }}>{c.id === "lifetime" ? "one time" : isAnnual ? "/year" : "/month"}</span>
              </div>
              {c.note && <div style={{ fontSize: 11, color: c.muteColor, marginBottom: 14 }}>{c.note}</div>}
              {!c.note && <div style={{ marginBottom: 14 }} />}
              <div style={{ marginBottom: 18 }}>
                {c.features.map((f, i) => (
                  <div key={i} style={{ fontSize: 12.5, color: f.includes("✦") ? c.priceColor : c.featureColor, marginBottom: 7, paddingLeft: 14, position: "relative", lineHeight: 1.5, fontWeight: f.includes("✦") ? 700 : 400 }}>
                    <span style={{ position: "absolute", left: 0, color: c.dot }}>·</span>{f}
                  </div>
                ))}
              </div>
              <button onClick={() => goStripe(c.id)} className="cta-shake" style={{ width: "100%", padding: "13px", backgroundImage: c.ctaBg, border: "none", borderRadius: 10, color: c.ctaColor, fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "'Jost',sans-serif", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
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
  {t:"My DNA is shifting. Right now.",c:"#e8b870"},{t:"My highest timeline. Activated.",c:"#c8a870"},{t:"He's obsessed. Of course he is.",c:"#B76E79"},
  {t:"My skin is porcelain. Always.",c:"#d4a090"},{t:"I shift while I sleep.",c:"#d4a090"},{t:"Money arrives unexpectedly.",c:"#c8a870"},
  {t:"My bloodline is being rewritten.",c:"#e8b870"},{t:"He comes back. Every time.",c:"#B76E79"},{t:"My waist is always snatched.",c:"#d4a090"},
  {t:"£10,000 months are my baseline.",c:"#c8a870"},{t:"I receive. Constantly. Effortlessly.",c:"#B76E79"},{t:"My self-concept is permanent now.",c:"#e8b870"},
  {t:"He can't stop thinking about me.",c:"#B76E79"},{t:"I am radiant without trying.",c:"#d4a090"},{t:"My skin glows. Everyone sees it.",c:"#d4a090"},
  {t:"He chose me. Again.",c:"#B76E79"},{t:"Abundance is my default state.",c:"#c8a870"},{t:"My beauty is effortless.",c:"#d4a090"},
  {t:"He's already mine.",c:"#B76E79"},{t:"Money loves me. Of course it does.",c:"#c8a870"},{t:"I am the woman he keeps coming back to.",c:"#B76E79"},
  {t:"My cells hold my new identity.",c:"#e8b870"},{t:"My glow is undeniable.",c:"#d4a090"},{t:"Six figures is just the start.",c:"#c8a870"},
  {t:"He finds his way back. Every time.",c:"#B76E79"},{t:"My subconscious knows. It delivers.",c:"#e8b870"},{t:"I am paid just for existing.",c:"#c8a870"},
  {t:"My face is symmetrical and clear.",c:"#d4a090"},{t:"Of course it worked out. It always does.",c:"#c8a870"},{t:"He's devoted. Obviously.",c:"#B76E79"},
  {t:"My identity upgrades in my sleep.",c:"#e8b870"},{t:"I am magnetic. Naturally.",c:"#d4a090"},{t:"My wealth expands while I sleep.",c:"#c8a870"},
  {t:"He reaches out first. Always.",c:"#B76E79"},{t:"I embody my dream self. Naturally.",c:"#e8b870"},{t:"My energy is intoxicating.",c:"#d4a090"},
  {t:"My income is limitless.",c:"#c8a870"},{t:"I am the upgraded version. Now.",c:"#e8b870"},{t:"He misses me and he's saying it.",c:"#B76E79"},
  {t:"My bank account grows daily.",c:"#c8a870"},{t:"My nervous system knows who I am.",c:"#e8b870"},{t:"I look better every single day.",c:"#d4a090"},
  {t:"Love finds me. It always does.",c:"#B76E79"},{t:"I am always in the right place.",c:"#c8a870"},{t:"My body reflects my beliefs.",c:"#d4a090"},
  {t:"My SP is devoted. Obviously.",c:"#B76E79"},{t:"The installation is complete.",c:"#e8b870"},{t:"I receive in my sleep. Obviously.",c:"#d4a090"},
  {t:"I am stunning. It's obvious.",c:"#d4a090"},{t:"My financial reality is effortless.",c:"#c8a870"},{t:"He can't get me out of his head.",c:"#B76E79"},
  {t:"My highest self is my only self.",c:"#e8b870"},{t:"People notice. They can't help it.",c:"#d4a090"},{t:"My lineage shifts with me.",c:"#e8b870"},
  {t:"I am a money magnet. Obviously.",c:"#c8a870"},{t:"He's on his way back. Of course.",c:"#B76E79"},{t:"I wake up transformed.",c:"#d4a090"},
  {t:"My life is effortless luxury.",c:"#c8a870"},{t:"My subconscious is now on my side.",c:"#e8b870"},{t:"My skin is flawless. Obviously.",c:"#d4a090"},
  {t:"Everything works out for me. Always.",c:"#c8a870"},{t:"He's never leaving. I'm that girl.",c:"#B76E79"},{t:"My DNA reflects my desires.",c:"#e8b870"},
  {t:"I am chosen. Every single time.",c:"#B76E79"},{t:"Thirty days changes everything.",c:"#d4a090"},{t:"My frequency is locked in.",c:"#e8b870"},
  {t:"I am the most beautiful version of me.",c:"#d4a090"},{t:"The universe is obsessed with me.",c:"#c8a870"},{t:"My parallel reality is now.",c:"#e8b870"},
  {t:"He's constantly thinking of me.",c:"#B76E79"},{t:"My love life is effortless.",c:"#B76E79"},{t:"I am on the frequency of receiving.",c:"#c8a870"},
  {t:"Every listen deepens the install.",c:"#d4a090"},{t:"I am becoming her daily.",c:"#e8b870"},{t:"My reality bends to my self-concept.",c:"#e8b870"},
  {t:"Unexpected income is normal for me.",c:"#c8a870"},{t:"My sleep is doing the work.",c:"#d4a090"},{t:"I am irresistible. Obviously.",c:"#d4a090"},
  {t:"He comes back. Of course he does.",c:"#B76E79"},{t:"I exist on the frequency of abundance.",c:"#c8a870"},{t:"My cells shift with every listen.",c:"#e8b870"},
  {t:"Beauty is who I am.",c:"#d4a090"},{t:"Life is happening for me. Always.",c:"#c8a870"},{t:"My manifestations arrive fast.",c:"#c8a870"},
  {t:"My theta state holds my desires.",c:"#d4a090"},{t:"The new me is permanent now.",c:"#e8b870"},{t:"I attract what I want. Effortlessly.",c:"#c8a870"},
  {t:"My aura is undeniable.",c:"#d4a090"},{t:"Money comes from everywhere.",c:"#c8a870"},{t:"The shift is already done.",c:"#e8b870"},
  {t:"I am reprogramming daily.",c:"#d4a090"},{t:"He's obsessed with who I am.",c:"#B76E79"},{t:"Every night I become her more.",c:"#d4a090"},
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
            style={{ padding:"7px 18px", borderRadius:20, background:view===id?"#f2ece4":"transparent", border:"none",
              color:view===id?"#1a1210":"#ffffff", fontSize:12, fontWeight:700, cursor:"pointer",
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
          style={{ width:44, height:24, borderRadius:12, background:theme==="light"?"#e8a860":"#333",
            border:"none", cursor:"pointer", position:"relative", transition:"background 0.25s", padding:0 }}>
          <div style={{ width:18, height:18, borderRadius:"50%", background:"#fff",
            position:"absolute", top:3, left:theme==="light"?23:3, transition:"left 0.25s" }}/>
        </button>
        <span style={{ fontSize:11, color:"#ffffff", fontFamily:"'Jost',sans-serif" }}>Light</span>
      </div>

      <div style={{ fontSize:12, color:"rgba(232,168,96,0.8)", fontFamily:"'Jost',sans-serif", letterSpacing:"0.08em", textAlign:"center", fontWeight:600 }}>
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

  // One locked ombre, everywhere — no per-category hue variation
  const OMBRE = "linear-gradient(135deg,#f5e0a0 0%,#e8b870 22%,#d4a090 48%,#c4789a 72%,#B76E79 100%)";
  const bgs = [OMBRE, OMBRE, OMBRE, OMBRE, OMBRE, OMBRE];
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
  {q:"What categories are in the vault?",a:"A growing library — right now it includes Lovemaxxing, Beautymaxxing, Facemaxxing, Bodymaxxing, Skinnymaxxing, Moneymaxxing, Businessmaxxing, Careermaxxing, DNAmaxxing, Selfmaxxing, Erosmaxxing, Singlemaxxing, Wellnessmaxxing, Sleepmaxxing, Studymaxxing, Friendmaxxing, Peacemaxxing, Confidencemaxxing, Stylemaxxing, Healmaxxing, Intuitionmaxxing, Lifemaxxing, Luckygirlmaxxing, and Sovereignmaxxing. New categories and tracks added weekly."},
  {q:"What are subliminals?",a:"Affirmations recorded below the threshold of conscious hearing, layered underneath the music and spoken hypnosis. Your conscious mind doesn't register them as words — but your subconscious does. They bypass the part of you that would normally argue back with a new belief."},
  {q:"How do the different elements combine in one track?",a:"Each audio layers four things at once: spoken hypnosis (guiding you into the state), subliminal affirmations (below hearing threshold), binaural beats (two slightly different frequencies, one per ear, syncing both brain hemispheres into theta), and original melodic house music (so it's something you actually want to listen to, not just tolerate). All four play simultaneously, not in sequence."},
  {q:"Who is Reshma Oracle?",a:"The person recording every track in this vault. No agency, no outsourced voice work — every hypnosis session, every affirmation, every frequency choice is hers. Self Hypnosis Goddess exists because she noticed everyone in this space consumes content and no one actually installs a new identity — so she built something designed for daily repetition, not one-off inspiration."},
  {q:"Is there a mobile app?",a:"The portal is a web app that works on any device in any browser. On iPhone: tap Share → Add to Home Screen. A dedicated iOS and Android app is in development."},
];
function FAQSection() {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ background:"linear-gradient(160deg,#fdf0e8 0%,#f2ece4 50%,#fdf0e8 100%)", padding:"0 0 0 0" }}>
      <div style={{ padding:"60px clamp(16px,4vw,24px) 80px",maxWidth:760,margin:"0 auto" }}>
      <div style={{ textAlign:"center",marginBottom:40 }}>
        <div style={{ fontSize:11,color:"#B76E79",letterSpacing:"0.25em",textTransform:"uppercase",fontWeight:700,marginBottom:14,fontFamily:"'Jost',sans-serif" }}>Everything you need to know</div>
        <h2 className="wm" style={{ fontSize:"clamp(28px,4.5vw,52px)",color:"#1a0818",lineHeight:1.2 }}>FAQs</h2>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
        {FAQS.map((faq,i) => (
          <div key={i} style={{ background:open===i?"rgba(255,255,255,0.95)":"rgba(255,255,255,0.7)",border:"1px solid",borderColor:open===i?"rgba(183,110,121,0.35)":"rgba(183,110,121,0.15)",borderRadius:14,overflow:"hidden",transition:"all 0.2s",boxShadow:open===i?"0 4px 20px rgba(183,110,121,0.12)":"none" }}>
            <button onClick={() => setOpen(open===i?null:i)} style={{ width:"100%",padding:"20px 22px",background:"none",border:"none",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",gap:16 }}>
              <span style={{ fontSize:15,fontWeight:600,color:"#1a0818",textAlign:"left",lineHeight:1.4 }}>{faq.q}</span>
              <span style={{ fontSize:20,color:"#B76E79",flexShrink:0,transform:open===i?"rotate(45deg)":"none",transition:"transform 0.2s" }}>+</span>
            </button>
            {open===i && <div style={{ padding:"0 22px 22px" }}><div style={{ height:1,background:"rgba(183,110,121,0.15)",marginBottom:16 }}/><p style={{ fontSize:14,color:"#4a2820",lineHeight:1.85,margin:0 }}>{faq.a}</p></div>}
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
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState("idle"); // idle | saving | done | error

  const submitWaitlist = async (e) => {
    e?.preventDefault();
    const email = waitlistEmail.trim();
    if (!email || !email.includes("@")) { setWaitlistStatus("error"); return; }
    setWaitlistStatus("saving");
    const { error } = await _sb.from("waitlist").insert({ email, source: "landing_page_banner" });
    if (error) { setWaitlistStatus("error"); return; }
    setWaitlistStatus("done");
  };
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
    { title: "He Finds His Way Back",    sub: "Lovemaxxing · No contact",                freq: "432hz · EMDR",          url: null },
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
    { label: "DNA Shifting", tagline: "My bloodline remembers.", color: "#e8b870" },
    { label: "Sleep Shifting", tagline: "I shift while I sleep.", color: "#000000" },
  ];

  // Comparison section heading explanation is added in JSX below
  const compRows = [
    { old: "I have to work hard to receive money.", neu: "Money found me without effort.", proof: "£2,000 refund arrived out of nowhere. Day 6.", cat: "Money" },
    { old: "He has moved on. I need to accept it.", neu: "He is already on his way back.", proof: "He texted first after 3 weeks of silence. Day 9.", cat: "Lovemaxxing" },
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
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 400, height: isMobile ? 36 : 40, paddingTop: "env(safe-area-inset-top,0px)", paddingLeft: "14px", paddingRight: "14px", paddingBottom: 0, boxSizing: "border-box", background: "linear-gradient(90deg,#f5e0a0 0%,#e8b870 45%,#c9963a 100%)", display: "flex", alignItems: "center", justifyContent: "center", gap: isMobile ? 8 : 14, overflow: "hidden" }}>
          <span style={{ fontFamily: "'Jost',sans-serif", fontSize: isMobile ? 10 : 12, fontWeight: 700, color: "#000", letterSpacing: isMobile ? "0.06em" : "0.14em", whiteSpace: "nowrap", textTransform: "uppercase" }}>
            {isMobile ? "✦ Coming Soon · Join the Waitlist" : "✦  COMING SOON  ·  Self Hypnosis Goddess launches soon  ·  Join the waitlist"}
          </span>
          <button onClick={() => setWaitlistOpen(true)} style={{ padding: "3px 10px", background: "rgba(0,0,0,0.18)", border: "1px solid rgba(0,0,0,0.25)", borderRadius: 20, color: "#000", fontSize: isMobile ? 10 : 11, fontWeight: 800, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}>
            Join Waitlist
          </button>
        </div>
      )}

      {/* NAV */}
      <nav style={{ position: "fixed", top: isMobile ? 36 : 40, left: 0, right: 0, zIndex: 300, height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", background: "rgba(0,0,0,0.97)", borderBottom: "1px solid #1c1828", backdropFilter: "blur(20px)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:9, flex: isMobile ? "0 0 auto" : "1 1 0" }}>
            <svg viewBox="0 0 64 64" width="24" height="24" style={{flexShrink:0}}>
              <defs><linearGradient id="navmark" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f5e0a0"/><stop offset="22%" stopColor="#e8b870"/><stop offset="48%" stopColor="#d4a090"/><stop offset="72%" stopColor="#c4789a"/><stop offset="100%" stopColor="#B76E79"/></linearGradient></defs>
              <path d="M32 10 A22 22 0 0 0 32 54 Z" fill="url(#navmark)" opacity="0.92"/>
              <path d="M32 10 A22 22 0 0 1 32 54 Z" fill="none" stroke="url(#navmark)" strokeWidth="2.6"/>
              <line x1="32" y1="8" x2="32" y2="56" stroke="url(#navmark)" strokeWidth="1.2" opacity="0.6"/>
            </svg>
            <span className="wm wm-shimmer" style={{ fontSize: "clamp(14px,4.2vw,18px)", fontWeight: 500, letterSpacing: "0.02em", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", maxWidth: isMobile ? "68vw" : "none" }} onClick={() => window.scrollTo({top:0,behavior:"smooth"})}>Self Hypnosis Goddess</span>
          </div>

          {/* Desktop nav — centered, equal weight, none singled out */}
          {!isMobile && (
            <div style={{ display:"flex", gap:28, alignItems:"center", justifyContent:"center", flex:"0 0 auto" }}>
              <button onClick={()=>document.getElementById("pricing")?.scrollIntoView({behavior:"smooth"})} style={{ padding:"8px 0",background:"none",border:"none",color:"#c8c0bc",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>Pricing</button>
              <button onClick={()=>document.getElementById("proofos")?.scrollIntoView({behavior:"smooth"})} style={{ padding:"8px 0",background:"none",border:"none",color:"#c8c0bc",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>ProofOS</button>
              <button onClick={onDemo} style={{ padding:"8px 0",background:"none",border:"none",color:"#c8c0bc",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>Preview</button>
              <button onClick={()=>setShopOpen(true)} style={{ padding:"8px 0",background:"none",border:"none",color:"#c8c0bc",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>Shop</button>
            </div>
          )}

        <div style={{ display: "flex", gap: 8, alignItems: "center", flex: isMobile ? "0 0 auto" : "1 1 0", justifyContent:"flex-end" }}>
          {/* Desktop CTAs */}
          {!isMobile && (<>
            <button onClick={onSignIn||onDemo} style={{ padding:"10px 18px",background:"none",border:"1px solid #B76E7944",borderRadius:22,color:"#B76E79",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>Sign in</button>
            <button onClick={onJoin} style={{ padding:"11px 22px",background:"linear-gradient(135deg,#fce4c0,#e8a860)",border:"none",borderRadius:22,color:"#000",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"'Jost',sans-serif",textTransform:"uppercase" }}>Join ✦</button>
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
              ["Shop", ()=>{setShopOpen(true);setMenuOpen(false);}, true],
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
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "clamp(52px,8vw,80px) clamp(20px,5vw,32px) clamp(52px,8vw,80px)", maxWidth: 800, margin: "0 auto", width: "100%" }}>
          <HeroMarquee />

          {/* TITLE */}
          <div style={{ fontSize: "clamp(11px,1.4vw,13px)", letterSpacing: "0.35em", textTransform: "uppercase", color: "#e8a860", marginBottom: 14, fontFamily: "'Jost',sans-serif", fontWeight: 500 }}>Self Hypnosis Goddess</div>
          <h1 className="wm" style={{ lineHeight: 1.15, marginBottom: 12 }}>
            <span className="wm-shimmer" style={{ fontSize: "clamp(38px,8vw,80px)", display: "block" }}>Audio Library</span>
            <span style={{ fontFamily: "'Jost',sans-serif", fontStyle: "normal", fontSize: "clamp(14px,2.2vw,18px)", color: "rgba(253,240,232,0.55)", fontWeight: 400, letterSpacing: "0.25em", textTransform: "uppercase", display: "block", marginTop: 12 }}>+ ProofOS</span>
          </h1>

          {/* SPOTIFY TAGLINE */}
          <div style={{ fontSize: "clamp(13px,1.5vw,15px)", color: "#e8a860", letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700, marginBottom: 14, fontFamily: "'Jost',sans-serif" }}>
            Spotify for your subconscious mind
          </div>

          {/* TAGLINE */}
          <div style={{ fontSize: "clamp(13px,1.5vw,16px)", color: "#ffffff", fontWeight: 400, marginBottom: 8, letterSpacing: "0.01em", whiteSpace: isMobile ? "normal" : "nowrap" }}>
            Brainwash yourself every day to manifest your desires — and unlock every piece of evidence to prove it's true. To prove it as <span style={{ fontWeight: 800 }}>FACT</span>.
          </div>

          {/* WAKE UP KNOWING */}
          <div style={{ fontSize: "clamp(13px,1.5vw,16px)", color: "#ffffff", marginBottom: 28, lineHeight: 1.6, whiteSpace: isMobile ? "normal" : "nowrap" }}>
            Wake up knowing. Not hoping. <span style={{ color: "#f5e0a0", fontWeight: 600 }}>Knowing.</span>
          </div>
          {/* SPOTIFY-STYLE PLAYER */}
          <div style={{ background: "linear-gradient(135deg,#fce4c0 0%,#e8a860 100%)", border: "none", borderRadius: 18, padding: isMobile ? "18px" : "22px 26px", maxWidth: 520, margin: "0 auto 36px", boxShadow: "0 12px 60px rgba(180,104,48,0.35)" }}>
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
              {playing ? "✦ Playing — continues in background" : "Tap play to listen — free preview"}
            </div>
          </div>

          {/* PAIN POINT */}
          {/* SKIMMABLE BENEFIT CHIPS */}
          <div style={{ fontSize: 12, color: "#8a7868", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, textAlign: "center", marginBottom: 12 }}>What listening actually does for you</div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, maxWidth: 620, margin: "0 auto 28px" }}>
            {[
              "Become a Spoiled Goddess",
              "Make him beg for you — you're the dream girl",
              "Live your delusional reality",
              "Become the lucky girl, every single second",
              "An ever-growing library of thousands of audios — for life",
              "Track every desire. Prove every manifestation.",
              "For your gym, your hot girl walk, your morning routine, your commute, right before bed",
              "Romanticize your entire life",
              "Elevate your look. Upgrade your circle.",
              "Blow up your business — subconsciously",
              "Break your money ceiling. Expand your capacity.",
            ].map((line, i) => (
              <span key={i} style={{ fontSize: isMobile ? 12 : 13, color: "#f2ece4", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 20, padding: "7px 14px", fontFamily: "'Jost',sans-serif", fontWeight: 500 }}>
                {line}
              </span>
            ))}
          </div>
                    {/* HERO CTA BUTTONS */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 16, flexDirection: isMobile ? "column" : "row", alignItems: "stretch", maxWidth: isMobile ? 340 : "none", margin: isMobile ? "0 auto 16px" : "0 0 16px" }}>
            <button onClick={onJoin} className="cta-pulse cta-shake" style={{ padding: "16px 40px", background: "linear-gradient(135deg,#fce4c0,#e8a860)", border: "none", borderRadius: 14, color: "#000", fontSize: 16, fontWeight: 800, cursor: "pointer", letterSpacing: "0.1em", fontFamily: "'Jost',sans-serif", textTransform: "uppercase", width: isMobile ? "100%" : "auto" }}>
              START LISTENING ✦
            </button>
            <button onClick={() => { const el = document.getElementById("pricing"); el ? el.scrollIntoView({behavior:"smooth"}) : window.open("https://buy.stripe.com/00w8wP2tbgaG3pffdu7AI02","_blank"); }} style={{ padding: "16px 32px", width: isMobile ? "100%" : "auto", background: "transparent", border: "1.5px solid #e8a86066", borderRadius: 14, color: "#e8a860", fontSize: 16, fontWeight: 300, cursor: "pointer", letterSpacing: "0.1em", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              LIFETIME ACCESS<ArrowIcon size={14}/>
            </button>
          </div>
          <div style={{ fontSize: 14, color: "#f2ece4", fontWeight: 600, textAlign: "center", marginBottom: 20, whiteSpace: isMobile ? "normal" : "nowrap" }}>{`Audio Tier ${TIERS.audio.monthly}/mo · Goddess Tier ${TIERS.goddess.monthly}/mo · Cancel anytime`}</div>

          {/* PREVIEW DASHBOARD — prominent on both mobile and desktop */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <button onClick={onDemo} style={{ padding: "14px 36px", background: "#000", border: "2px solid #e8a86066", borderRadius: 40, color: "#e8a860", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Jost',sans-serif", letterSpacing: "0.08em", display: "inline-flex", alignItems: "center", gap: 10, transition: "all 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#e8a860"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="#e8a86066"}>
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
        <div style={{ fontSize:11, fontWeight:900, color:"#c9963a", letterSpacing:"0.28em", textTransform:"uppercase", marginBottom:14 }}>The purpose</div>
        <h2 className="wm" style={{ fontSize:"clamp(28px,4.5vw,52px)", color:"#000", lineHeight:1.12, marginBottom:20 }}>
          Shift into the state of<br/>
          <span style={{ background:"linear-gradient(90deg,#fce4c0,#e8a860)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>your dream reality.</span>
        </h2>
        <p style={{ fontSize:"clamp(15px,1.85vw,17px)", color:"#000", lineHeight:1.85, maxWidth:600, margin:"0 auto 16px" }}>
          You feel the gap — between your current self and the dream self you're aspiring to become, between where you are and the dream reality you want to shift into. I'm here to close that gap.
        </p>
        <p style={{ fontSize:"clamp(15px,1.85vw,17px)", color:"#000", lineHeight:1.85, maxWidth:600, margin:"0 auto 16px" }}>
          My self-hypnosis and subliminal audios shift you into that state while you rest, while you play, while you're at the gym. You automatically start acting from that version of you — without even trying.
        </p>
        <p style={{ fontSize:"clamp(15px,1.85vw,17px)", color:"#000", lineHeight:1.85, maxWidth:620, margin:"0 auto" }}>
          And reality mirrors that back to you.
        </p>
      </div>


      {/* HOW IT WORKS — JOURNEY TIMELINE */}
      <div style={{ padding: isMobile?"48px 18px":"80px 24px", background: "linear-gradient(160deg,#fdf0e8 0%,#f9dfc8 50%,#f0c8a0 100%)", position:"relative", overflow:"hidden" }}>
        {/* Ombre orb */}
        <div style={{ position:"absolute", top:"20%", left:"50%", transform:"translateX(-50%)", width:600, height:600, background:"radial-gradient(ellipse,rgba(212,160,144,0.15) 0%,rgba(183,110,121,0.08) 40%,transparent 70%)", pointerEvents:"none", borderRadius:"50%" }}/>

        <div style={{ maxWidth:860, margin:"0 auto", position:"relative", zIndex:1 }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <div style={{ fontSize:isMobile?24:36, color:"#B76E79", letterSpacing:"0.18em", textTransform:"uppercase", fontWeight:900, marginBottom:18, fontFamily:"'Jost',sans-serif" }}>How it works</div>
            <h2 className="wm" style={{ fontSize:"clamp(28px,4.5vw,52px)", lineHeight:1, marginBottom:16, color:"#1a0818" }}>
              Set intention.<br/>
              <span style={{ background:"linear-gradient(90deg,#e8b870,#d4a090,#c4789a,#B76E79)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Watch reality bend.</span>
            </h2>
            <p style={{ fontSize:isMobile?15:17, color:"#6a4858", lineHeight:1.8, maxWidth:560, margin:"0 auto" }}>This is not inspiration content. This is a daily practice that rewires you while you sleep, rest, and go about your life.</p>
          </div>

          {/* JOURNEY STEPS — ombre cards */}
          <div style={{ display:"flex", flexDirection:"column", gap:0, position:"relative" }}>
            {/* Vertical line */}
            {!isMobile && <div style={{ position:"absolute", left:40, top:0, bottom:0, width:2, background:"linear-gradient(180deg,#e8b870,#d4a090,#c4789a,#B76E79)", borderRadius:1, opacity:0.3 }}/>}

            {[
              { step:"01", label:"Set your intention", body:"Choose your desire. State it in present tense. Be specific — love, money, appearance, business. Write it in ProofOS. This is the anchor everything links back to.", bg:"linear-gradient(135deg,#fff8f0,#fceedd)", border:"#e8b87066", num:"#e8b870", text:"#5a3810" },
              { step:"02", label:"Listen to your audio", body:"Press play. Daily. First thing in the morning or last thing at night — when your brain is in theta. Melodic house as the foundation. Reshma's voice beneath it. Let it wash over you. No effort needed.", bg:"linear-gradient(135deg,#fdf0f0,#fce8e4)", border:"#d4a09066", num:"#d4a090", text:"#5a2818" },
              { step:"03", label:"Log signs and synchronicities", body:"Something shifts. He messages. Money arrives from somewhere you forgot. Your skin looks different in the mirror. A friend says your name first. Log it in ProofOS immediately — voice note, screenshot, written sign.", bg:"linear-gradient(135deg,#fdf0f5,#fce8f0)", border:"#c4789a66", num:"#c4789a", text:"#5a1030" },
              { step:"04", label:"Mark it manifested", body:"The moment the full desire lands — mark it. ProofOS records the date, the days of listening, the audio, the signs that preceded it. Your personal proof. Undeniable and documented forever.", bg:"linear-gradient(135deg,#fdf0e8,#f5e0d0)", border:"#B76E7966", num:"#B76E79", text:"#5a1418" },
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
              <div style={{ width:isMobile?48:56, height:isMobile?48:56, borderRadius:"50%", background:"linear-gradient(135deg,#fce4c0,#e8a860,#c9963a)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"0 8px 32px rgba(232,168,96,0.4)" }}>
                <span style={{ fontSize:isMobile?18:22 }}>✓</span>
              </div>
              <div style={{ flex:1, background:"#0a0a0a", border:"2px solid rgba(232,168,96,0.4)", borderRadius:16, padding:"24px 24px", boxShadow:"0 8px 40px rgba(0,0,0,0.4)" }}>
                <div style={{ fontSize:isMobile?18:24, fontWeight:900, background:"linear-gradient(90deg,#fce4c0,#e8a860)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:8, fontFamily:"'Jost',sans-serif" }}>Manifested.</div>
                <div style={{ fontSize:isMobile?13:15, color:"#d4c0a8", lineHeight:1.75 }}>The proof thread closes. The date is recorded. The evidence was there the whole time. You close the loop and open the next one.</div>
              </div>
            </div>
          </div>
        </div>
      </div>



      <div id="proofos" style={{ padding: isMobile ? "48px 18px" : "70px 24px", background: "#000000" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 12, color: "#f5e0a0", letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 800, marginBottom: 12, opacity: 0.75 }}>Goddess Tier · Included</div>
            <h2 className="wm" style={{ fontSize: "clamp(28px,4.5vw,52px)", lineHeight: 1.1, marginBottom: 16 }}>
              <span style={{ color: "#f5e0a0" }}>Introducing </span>
              <span style={{ background: "linear-gradient(90deg,#fce4c0,#e8a860)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ProofOS</span>
            </h2>
            <p style={{ fontSize: "clamp(16px,2vw,20px)", color: "#e8d4c0", lineHeight: 1.8, maxWidth: 560, margin: "0 auto" }}>
              The system that links every audio you listen to with real evidence of what shifts. Not journaling. Not affirmations. <strong style={{ color: "#f5e0a0" }}>Proof.</strong>
            </p>
            <p style={{ fontSize: "clamp(15px,1.9vw,19px)", color: "#f5e0a0", lineHeight: 1.75, maxWidth: 540, margin: "14px auto 0", fontWeight: 700 }}>
              Your manifestation tracker for life. Your proof wall for life. Every sign, every synchronicity, every screenshot — captured in one place for the rest of your life.
            </p>
            <p style={{ fontSize: "clamp(14px,1.7vw,17px)", color: "#e8d4c0", lineHeight: 1.8, maxWidth: 560, margin: "20px auto 0" }}>
              Here's why that matters: doubt doesn't ask nicely. It shows up at 2am asking if any of this is actually working. Belief alone can't answer that — it just argues back. Proof can. A dated, logged list of things that actually happened is the one thing doubt can't talk you out of. That's the whole point of ProofOS — not another journal, your evidence.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { num: "01", title: "Listen", body: "Press play. Sleep with it on. Let the audio do the work while your conscious mind rests.", bg: "#0a0a0a", icon: (
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <path d="M12 32 A18 18 0 0 1 48 32" stroke="#e8a860" strokeWidth="3" strokeLinecap="round"/>
                  <rect x="8" y="30" width="10" height="16" rx="3" fill="#e8a860"/>
                  <rect x="42" y="30" width="10" height="16" rx="3" fill="#e8a860"/>
                </svg>
              )},
              { num: "02", title: "Link", body: "Open a Proof Thread for your specific desire. Link it to the audio that's working on it.", bg: "#0a0a0a", icon: (
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <rect x="10" y="22" width="22" height="16" rx="8" stroke="#e8a860" strokeWidth="3" fill="none" transform="rotate(-20 21 30)"/>
                  <rect x="28" y="22" width="22" height="16" rx="8" stroke="#e8a860" strokeWidth="3" fill="none" transform="rotate(20 39 30)"/>
                </svg>
              )},
              { num: "03", title: "Capture", body: "Log signs, synchronicities, photo proof, voice notes. Anything that arrives — capture it here.", bg: "#0a0a0a", icon: (
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <rect x="10" y="16" width="40" height="30" rx="5" stroke="#e8a860" strokeWidth="3" fill="none"/>
                  <path d="M22 16 L25 10 L35 10 L38 16" stroke="#e8a860" strokeWidth="3" strokeLinecap="round" fill="none"/>
                  <circle cx="30" cy="31" r="8" stroke="#e8a860" strokeWidth="3" fill="none"/>
                </svg>
              )},
              { num: "04", title: "Watch it stack up", body: "Every sign you log sits on your Proof Wall, dated. Come back and watch the evidence grow — it stops feeling random fast.", bg: "#0a0a0a", icon: (
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <rect x="12" y="34" width="10" height="16" rx="2" fill="none" stroke="#e8a860" strokeWidth="3"/>
                  <rect x="25" y="24" width="10" height="26" rx="2" fill="none" stroke="#e8a860" strokeWidth="3"/>
                  <rect x="38" y="14" width="10" height="36" rx="2" fill="none" stroke="#e8a860" strokeWidth="3"/>
                </svg>
              )},
              { num: "05", title: "Mark manifested", body: "When it arrives, mark it. See exactly how many days it took and which audio preceded it.", bg: "#0a0a0a", icon: (
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <circle cx="30" cy="30" r="20" stroke="#e8a860" strokeWidth="3" fill="none"/>
                  <path d="M21 30 L27 36 L40 22" stroke="#e8a860" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              )},
            ].map((s, i) => (
              <div key={i} style={{ background: "#141414", border: "1px solid rgba(232,168,96,0.25)", borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 18px rgba(0,0,0,0.4)", display: "flex", flexDirection: isMobile ? "column" : "row" }}>
                {/* SVG icon */}
                <div style={{ width: isMobile ? "100%" : 180, height: isMobile ? 120 : "auto", minHeight: 110, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, borderBottom: isMobile ? "1px solid rgba(183,110,121,0.15)" : "none", borderRight: isMobile ? "none" : "1px solid rgba(183,110,121,0.15)" }}>
                  {s.icon}
                </div>
                <div style={{ padding: "20px 22px", flex: 1 }}>
                  <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: "#f5e0a0", marginBottom: 8, fontFamily: "'Jost',sans-serif", lineHeight: 1.1 }}>{s.title}</div>
                  <div style={{ fontSize: 14, color: "#f5e0a0", lineHeight: 1.75 }}>{s.body}</div>
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
                <span style={{ fontSize:11, color:proofTheme==="dark"?"#f5e0a0":"#8a7868", fontFamily:"'Jost',sans-serif", fontWeight:600, letterSpacing:"0.05em" }}>Dark</span>
                <button onClick={()=>setProofTheme(t=>t==="dark"?"light":"dark")}
                  style={{ width:44, height:24, borderRadius:12, background:proofTheme==="light"?"#e8a860":"#3a3020", border:"1px solid rgba(232,168,96,0.3)", cursor:"pointer", position:"relative", transition:"background 0.25s", padding:0 }}>
                  <div style={{ width:18, height:18, borderRadius:"50%", background:"#fff", position:"absolute", top:2, left:proofTheme==="light"?23:3, transition:"left 0.25s", boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }}/>
                </button>
                <span style={{ fontSize:11, color:proofTheme==="light"?"#f5e0a0":"#8a7868", fontFamily:"'Jost',sans-serif", fontWeight:600, letterSpacing:"0.05em" }}>Light</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: "#f5e0a0", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 800, marginBottom: 14, opacity: 0.75 }}>How the tracking actually works</div>
              <div style={{ fontSize: isMobile?16:18, fontWeight: 700, color: "#f5e0a0", marginBottom: 12, lineHeight: 1.3 }}>Every desire gets its own thread. Every thread links to a track.</div>
              <p style={{ fontSize: 14, color: "#d4c0a8", lineHeight: 1.85, marginBottom: 12 }}>
                Say your desire out loud: "£5,000 arrives unexpectedly." Log it in ProofOS. Choose the audio you're pairing it with — Money Finds Me First, say. Now every time you play that track, ProofOS quietly counts the day.
              </p>
              <p style={{ fontSize: 14, color: "#d4c0a8", lineHeight: 1.85, marginBottom: 12 }}>
                As signs show up — an unexpected refund, a client paying early, a random win — you log them against that thread. Each sign stacks as evidence. You watch the pile grow, day by day, listen by listen.
              </p>
              <p style={{ fontSize: 14, color: "#d4c0a8", lineHeight: 1.85 }}>
                The moment it lands, you mark it manifested. ProofOS timestamps it — desire, track, days it took, signs logged along the way. That record never disappears. It becomes your evidence that this works, in your own data, not someone else's testimonial.
              </p>
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid rgba(232,168,96,0.2)" }}>
                <div style={{ fontSize: 12, color: "#f5e0a0", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 800, marginBottom: 16, opacity: 0.75 }}>Before every intention: the Hawkins Scale</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 16, maxWidth: 420 }}>
                  {[
                    { n: "Enlightenment", v: 700, c: "#5a4ab0" }, { n: "Peace", v: 600, c: "#8a6ac0" }, { n: "Joy", v: 540, c: "#f5d090" },
                    { n: "Love", v: 500, c: "#e8b870" }, { n: "Reason", v: 400, c: "#48a898" }, { n: "Acceptance", v: 350, c: "#78b078" },
                    { n: "Courage", v: 200, c: "#d4a028" }, { n: "Pride", v: 175, c: "#c68830" }, { n: "Anger", v: 150, c: "#b47030" },
                    { n: "Fear", v: 100, c: "#8a5030" }, { n: "Grief", v: 75, c: "#6a4030" }, { n: "Shame", v: 20, c: "#3a1a1a" },
                  ].map((lvl, i, arr) => (
                    <div key={lvl.n} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ height: 16, width: `${30 + (arr.length - i) * 6}%`, background: lvl.c, borderRadius: 3, transition: "width 0.2s" }}/>
                      <span style={{ fontSize: 10.5, color: "#d4c0a8", fontWeight: 600, whiteSpace: "nowrap" }}>{lvl.n} · {lvl.v}</span>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: "#8a7868", marginBottom: 16 }}>Below 200 drains you. 200 and above builds. Courage is the tipping point.</p>
                <p style={{ fontSize: 14, color: "#d4c0a8", lineHeight: 1.85 }}>
                  Before you log a new desire, you log how you actually feel right now — on the Hawkins Scale, a 17-level map of emotional states from Shame up to Enlightenment. Not what you think you should feel. What's actually true in your body.
                </p>
                <p style={{ fontSize: 14, color: "#d4c0a8", lineHeight: 1.85, marginTop: 12 }}>
                  ProofOS tracks that number over time — your average emotional state across days, weeks, a month. That average is the real predictor. Manifestation isn't random: a higher, more expansive emotional state is a higher-frequency state, and a higher-frequency state is what your reality actually reorganises around. Your Hawkins average tells you exactly where you sit on that scale — and exactly what's realistic to expect next.
                </p>
                <p style={{ fontSize: 14, color: "#d4c0a8", lineHeight: 1.85, marginTop: 12 }}>
                  You can write your intention in present tense or past tense, as if it's already happened — both work, since your subconscious doesn't distinguish between the two the way your conscious mind does. All the detail on why, and everything else — is inside The Guide once you're in.
                </p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 28 }}>
            <span style={{ fontSize: 14, color: "#f5e0a0", fontWeight: 700, opacity: 0.75 }}>Included in Goddess Tier · £33/mo</span>
          </div>
        </div>
      </div>

            {/* MELODIC HOUSE USP — cream background, locked palette */}
      <div style={{ padding: isMobile ? "48px 18px" : "70px clamp(16px,4vw,24px)", background: "linear-gradient(160deg,#fdf0e8 0%,#f5d8dc 50%,#d89aa4 100%)", width: "100%" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ background: "transparent", border: "none", borderRadius: 20, padding: isMobile?"28px 0":"36px 0", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 12, color: "#c9963a", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 14, textAlign: "center" }}>What makes this different</div>
            <h2 className="wm" style={{ fontSize: "clamp(28px,4.5vw,52px)", lineHeight: 1.1, marginBottom: 16, background: "linear-gradient(90deg,#fce4c0,#e8a860)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", textAlign: "center" }}>
              Hypnosis layered beneath<br/>melodic house music.
            </h2>
            <p style={{ fontSize: "clamp(15px,1.85vw,17px)", color: "#2a1210", lineHeight: 1.85, marginBottom: 16, maxWidth: 680, textAlign: "center", margin: "0 auto 16px" }}>
              Reshma's audios are produced with melodic house music as the sonic foundation. This is not background noise. The music is chosen and layered at specific frequencies to keep the body in a receptive, open state — so Reshma's voice can reach deeper.
            </p>
            <p style={{ fontSize: "clamp(15px,1.85vw,17px)", color: "#5a3830", lineHeight: 1.85, marginBottom: 28, maxWidth: 680, textAlign: "center", margin: "0 auto 28px" }}>
              You will not find this anywhere else. Most hypnosis is voice-only or layered with generic ambient sound. This is a different experience — one that makes listening feel like a ritual, not a task.
            </p>

            {/* THREE FORMATS */}
            <div style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(183,110,121,0.2)", borderRadius: 14, padding: "18px 24px", marginBottom: 28, maxWidth: 560, margin: "0 auto 28px" }}>
              <div style={{ fontSize: 11, color: "#c9963a", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>Six formats — each does something different</div>
              {[
                { icon: "🎵", label: "Melodic House", body: "Reshma's voice layered beneath original melodic house music. You listen like you would a song — and it rewires you beneath the surface." },
                { icon: "🌊", label: "Melodic Calm", body: "Slower, softer melodic layers for winding down. The same encoding — delivered at the pace your nervous system needs at night." },
                { icon: "🌙", label: "Subliminal", body: "Pure music. No audible voice. Affirmations encoded beneath the frequency. Works while you sleep, rest, or go about your day." },
                { icon: "◈", label: "EMDR Hypnosis", body: "Bilateral audio stimulation dissolves old identity blocks at their root. Deep identity reset in a single session." },
                { icon: "🎼", label: "528hz Frequency", body: "The 'love frequency' — tuned to promote repair and coherence at the cellular level while you rest." },
                { icon: "✋", label: "Reiki Encoded", body: "Tracks channelled with Reiki energy during recording. Frequency healing layered directly into the audio you sleep to." },
              ].map((f,i)=>(
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", paddingBottom: i<5?12:0, marginBottom: i<5?12:0, borderBottom: i<5?"1px solid rgba(183,110,121,0.12)":"none" }}>
                  <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{f.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#2a1210", marginBottom: 3 }}>{f.label}</div>
                    <div style={{ fontSize: 13, color: "#5a3830", lineHeight: 1.65 }}>{f.body}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* INFINITY DIAGRAM — the addiction loop */}
            <div style={{ background:"#000000", border:"1px solid rgba(232,168,96,0.25)", borderRadius:20, padding: isMobile?"32px 18px":"48px 40px", marginBottom: 24, boxShadow:"0 12px 60px rgba(0,0,0,0.5)" }}>
              <div style={{ textAlign:"center", marginBottom: 44, position:"relative", zIndex:2 }}>
                <div style={{ fontSize:isMobile?14:16, letterSpacing:"0.25em", color:"#e8a860", textTransform:"uppercase", fontWeight:800, fontFamily:"'Jost',sans-serif" }}>The addiction loop</div>
                <div style={{ fontSize:isMobile?15:18, color:"#f5e0a0", marginTop:10, fontFamily:"'Jost',sans-serif", fontWeight:500 }}>Music installs the state. You come back. The state deepens.</div>
              </div>
              <svg viewBox="0 0 800 285" style={{ width:"100%", aspectRatio:"800/285", height:"auto", display:"block", maxWidth:600, margin:"20px auto 0", position:"relative", zIndex:1 }}>
                <defs>
                  <linearGradient id="infA" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#f5e0a0"/><stop offset="1" stopColor="#e8a860"/>
                  </linearGradient>
                  <linearGradient id="infB" x1="1" y1="0" x2="0" y2="0">
                    <stop offset="0" stopColor="#e8a860"/><stop offset="1" stopColor="#e08aa8"/>
                  </linearGradient>
                  <linearGradient id="infC" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0" stopColor="#e08aa8"/><stop offset="1" stopColor="#f5e0a0"/>
                  </linearGradient>
                  <radialGradient id="nodeA"><stop offset="0" stopColor="#f5e0a0"/><stop offset="1" stopColor="#c9963a"/></radialGradient>
                  <radialGradient id="nodeB"><stop offset="0" stopColor="#f2b8cc"/><stop offset="1" stopColor="#b8547a"/></radialGradient>
                  <radialGradient id="nodeC"><stop offset="0" stopColor="#f5e0a0"/><stop offset="1" stopColor="#c9963a"/></radialGradient>
                </defs>
                {/* Three arcs forming a continuous circular loop: Music (top) -> Ritual (bottom right) -> Receptivity (bottom left) -> Music */}
                <path d="M 400 45 A 130 130 0 0 1 512 210" stroke="url(#infA)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                <path d="M 512 210 A 130 130 0 0 1 288 210" stroke="url(#infB)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                <path d="M 288 210 A 130 130 0 0 1 400 45" stroke="url(#infC)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
                {/* Soft glow rings behind nodes */}
                <circle cx="400" cy="45" r="40" fill="url(#nodeA)" opacity="0.10"/>
                <circle cx="512" cy="210" r="40" fill="url(#nodeB)" opacity="0.10"/>
                <circle cx="288" cy="210" r="40" fill="url(#nodeC)" opacity="0.10"/>
                {/* Node dots */}
                <circle cx="400" cy="45" r="12" fill="url(#nodeA)"/>
                <circle cx="512" cy="210" r="12" fill="url(#nodeB)"/>
                <circle cx="288" cy="210" r="12" fill="url(#nodeC)"/>
                {/* Node labels */}
                <text x="400" y="18" textAnchor="middle" fill="#f5e0a0" fontSize="17" fontFamily="Jost,sans-serif" fontWeight="800" letterSpacing="2">01 · MUSIC</text>
                <text x="400" y="70" textAnchor="middle" fill="#d4c0a0" fontSize="11" fontFamily="Jost,sans-serif">Holds the frequency</text>
                <text x="530" y="245" textAnchor="middle" fill="#f2b8cc" fontSize="17" fontFamily="Jost,sans-serif" fontWeight="800" letterSpacing="2">03 · RITUAL</text>
                <text x="530" y="262" textAnchor="middle" fill="#d4c0a0" fontSize="11" fontFamily="Jost,sans-serif">You return. It deepens.</text>
                <text x="270" y="245" textAnchor="middle" fill="#f5e0a0" fontSize="17" fontFamily="Jost,sans-serif" fontWeight="800" letterSpacing="2">02 · RECEPTIVITY</text>
                <text x="270" y="262" textAnchor="middle" fill="#d4c0a0" fontSize="11" fontFamily="Jost,sans-serif">You open. Identity installs.</text>
                {/* Directional arrows showing the loop direction */}
                <polygon points="0,-5 10,0 0,5" fill="#e8a860" transform="translate(465,90) rotate(50)"/>
                <polygon points="0,-5 10,0 0,5" fill="#e08aa8" transform="translate(400,215) rotate(180)"/>
                <polygon points="0,-5 10,0 0,5" fill="#f5e0a0" transform="translate(335,90) rotate(230)"/>
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

      {/* HEMI-SYNC — how the audio actually shifts the brain */}
      <div style={{ padding: isMobile?"56px clamp(16px,4vw,24px) 24px":"80px clamp(16px,4vw,24px) 24px", maxWidth: 760, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "#c9963a", letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700, marginBottom: 10, fontFamily: "'Jost',sans-serif" }}>How the audio actually works</div>
          <h3 className="wm" style={{ fontSize: "clamp(24px,3.6vw,38px)", color: "#1a0818", lineHeight: 1.2, marginBottom: 12 }}>Hemi-sync: both sides of your brain, one frequency.</h3>
          <p style={{ fontSize: "clamp(15px,1.85vw,17px)", color:"#3a2018", lineHeight:1.85, maxWidth:560, margin:"0 auto" }}>
            Your subconscious mind creates your entire reality — but you can only reach it when both hemispheres of your brain fall into the same rhythm. Awake and scrolling, your left and right hemispheres run slightly out of sync, in beta. Reshma's audio layers two close frequencies — one in each ear — so your brain naturally bends both sides into a single matching wave: hemi-sync. That's the exact moment the subconscious opens and a new belief can install.
          </p>
        </div>
        <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(232,168,96,0.3)", background: "#000000", padding: isMobile ? "32px 20px" : "48px 40px", position: "relative" }}>
          <div style={{ display:"flex", justifyContent:"center", gap: isMobile?28:64, position:"relative", flexWrap:"wrap", alignItems:"center" }}>
            {/* BEFORE — beta, unsynced: fast, tight, erratic oscillation */}
            <div style={{ textAlign:"center" }}>
              <svg width={isMobile?140:170} height={90} viewBox="0 0 170 90">
                <path d="M10 30 Q14 20 18 30 T26 30 T34 30 T42 30 T50 30 T58 30 T66 30 T74 30 T82 30 T90 30 T98 30 T106 30 T114 30 T122 30 T130 30 T138 30 T146 30 T154 30 T160 30" fill="none" stroke="#c9963a" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
                <path d="M10 60 Q13 52 16 60 T22 60 T28 60 T34 60 T40 60 T46 60 T52 60 T58 60 T64 60 T70 60 T76 60 T82 60 T88 60 T94 60 T100 60 T106 60 T112 60 T118 60 T124 60 T130 60 T136 60 T142 60 T148 60 T154 60 T160 60" fill="none" stroke="#8a6838" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
              </svg>
              <div style={{ fontSize:11, color:"#c9963a", fontWeight:800, letterSpacing:"0.15em", textTransform:"uppercase", marginTop:10 }}>Beta · Awake</div>
              <div style={{ fontSize:10.5, color:"#8a7868", marginTop:2 }}>13–30Hz · fast, hemispheres out of sync</div>
            </div>
            {/* TRANSITION LABEL — clearer than an abstract arrow */}
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
              <span style={{ fontSize:20, color:"#e8a860" }}>→</span>
              <span style={{ fontSize:9, color:"#8a7868", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>becomes</span>
            </div>
            {/* AFTER — theta, hemi-synced: slow, wide, one matched wave */}
            <div style={{ textAlign:"center" }}>
              <svg width={isMobile?140:170} height={90} viewBox="0 0 170 90">
                <defs><linearGradient id="syncWave" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fce4c0"/><stop offset="1" stopColor="#e8a860"/></linearGradient></defs>
                <path d="M10 45 Q42 12 74 45 T138 45" fill="none" stroke="url(#syncWave)" strokeWidth="4" strokeLinecap="round"/>
                <circle cx="74" cy="45" r="4.5" fill="#fce4c0"/>
              </svg>
              <div style={{ fontSize:11, color:"#e8a860", fontWeight:800, letterSpacing:"0.15em", textTransform:"uppercase", marginTop:10 }}>Theta · 4–8Hz</div>
              <div style={{ fontSize:10.5, color:"#d4c0a8", marginTop:2 }}>Slow, wide · hemi-synced · one wave</div>
            </div>
          </div>
        </div>
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

      {/* WHAT'S INSIDE — CATEGORY SHOWCASE */}
      <div style={{ padding: isMobile ? "48px 18px" : "80px 24px", background: "#fdf0e8", width: "100%" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: isMobile ? 28 : 44 }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: "#B76E79", letterSpacing: "0.28em", textTransform: "uppercase", marginBottom: 14 }}>What's Inside</div>
            <h2 style={{ fontSize: "clamp(28px,4.5vw,52px)", color: "#1a1210", fontWeight: 700, marginBottom: 12 }}>Whatever it is, it's covered.</h2>
            <p style={{ fontSize: 15, color: "#5a4a40", maxWidth: 640, margin: "0 auto", whiteSpace: isMobile ? "normal" : "nowrap" }}>A growing library of categories. Real tracks for the exact thing that's actually keeping you up.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: isMobile ? 10 : 16 }}>
            {[
              { name: "Lovemaxxing", pain: "Him, obsessed. You, unbothered.", accent: "#a85a42",
                icon: <path d="M30 52 C14 42 10 30 18 24 C24 19 30 23 30 30 C30 23 36 19 42 24 C50 30 46 42 30 52 Z" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round"/> },
              { name: "Beautymaxxing", pain: "The face in the mirror, finally the one you manifested", accent: "#b8547a",
                icon: <><path d="M30 20 C24 20 20 24 20 29 C20 33 23 36 27 36 C24 38 23 42 25 46 C22 44 20 40 21 35 C16 34 13 30 13 25 C13 19 18 14 24 14 C27 14 29 15.5 30 17 C31 15.5 33 14 36 14 C42 14 47 19 47 25 C47 30 44 34 39 35 C40 40 38 44 35 46 C37 42 36 38 33 36 C37 36 40 33 40 29 C40 24 36 20 30 20 Z" fill="currentColor" opacity="0.9"/><path d="M30 46 L30 54 M25 50 Q30 48 35 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/></> },
              { name: "Facemaxxing", pain: "Skin so good they ask what you use", accent: "#a85a42",
                icon: <><ellipse cx="30" cy="30" rx="16" ry="20" fill="none" stroke="currentColor" strokeWidth="3"/><circle cx="24" cy="26" r="2" fill="currentColor"/><circle cx="36" cy="26" r="2" fill="currentColor"/><path d="M24 38 Q30 42 36 38" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></> },
              { name: "Bodymaxxing", pain: "The body that makes a room stop", accent: "#B76E79",
                icon: <><circle cx="30" cy="14" r="6" fill="none" stroke="currentColor" strokeWidth="3"/><path d="M30 20 L30 38 M20 26 L40 26 M30 38 L22 50 M30 38 L38 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></> },
              { name: "Moneymaxxing", pain: "The next zero on your bank statement", accent: "#c9963a",
                icon: <><circle cx="30" cy="30" r="17" fill="none" stroke="currentColor" strokeWidth="3"/><path d="M30 20 L30 40 M25 24 Q25 20 30 20 Q35 20 35 24 Q35 28 30 28 Q25 28 25 32 Q25 36 30 36 Q35 36 35 32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></> },
              { name: "Businessmaxxing", pain: "The empire everyone said was unrealistic", accent: "#c9963a",
                icon: <><rect x="14" y="24" width="32" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="3"/><path d="M22 24 L22 18 Q22 15 25 15 L35 15 Q38 15 38 18 L38 24" fill="none" stroke="currentColor" strokeWidth="3"/></> },
              { name: "DNAmaxxing", pain: "Ageless. Radiant. Undeniable.", accent: "#8a3050",
                icon: <><path d="M20 12 Q30 20 20 28 Q10 36 20 44 Q30 52 20 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" transform="translate(10,0)"/><path d="M40 12 Q30 20 40 28 Q50 36 40 44 Q30 52 40 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" transform="translate(-10,0)"/><path d="M18 18 L42 18 M16 30 L44 30 M18 42 L42 42" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/></> },
              { name: "Selfmaxxing", pain: "The woman you were always meant to be", accent: "#8a6838",
                icon: <><circle cx="30" cy="30" r="18" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4"/><circle cx="30" cy="30" r="8" fill="currentColor"/></> },
              { name: "Erosmaxxing", pain: "Magnetic enough to stop a room", accent: "#a8506a",
                icon: <path d="M30 46 C30 46 14 36 14 22 C14 15 20 12 25 15 C28 17 30 21 30 21 C30 21 32 17 35 15 C40 12 46 15 46 22 C46 36 30 46 30 46 Z" fill="currentColor" opacity="0.85"/> },
              { name: "Lifemaxxing", pain: "Every area of your life, upgrading at once", accent: "#e0a868",
                icon: <><circle cx="30" cy="30" r="10" fill="currentColor"/><path d="M30 10 L30 4 M30 56 L30 50 M10 30 L4 30 M56 30 L50 30 M16 16 L12 12 M44 16 L48 12 M16 44 L12 48 M44 44 L48 48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></> },
              { name: "Luckygirlmaxxing", pain: "Everything just works out for you now", accent: "#e8b870",
                icon: <><path d="M30 30 C30 30 22 22 16 24 C11 26 11 32 16 34 C22 36 30 30 30 30 C30 30 38 22 44 24 C49 26 49 32 44 34 C38 36 30 30 30 30" fill="none" stroke="currentColor" strokeWidth="2.5"/><circle cx="30" cy="30" r="3" fill="currentColor"/></> },
              { name: "Sovereignmaxxing", pain: "Answering to absolutely no one", accent: "#6a2840",
                icon: <path d="M14 40 L14 24 L22 32 L30 16 L38 32 L46 24 L46 40 Z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/> },
              { name: "Skinnymaxxing", pain: "The number on the scale, finally moving", accent: "#B76E79",
                icon: <><path d="M22 14 Q30 10 38 14 L36 26 Q30 22 24 26 Z" fill="none" stroke="currentColor" strokeWidth="2.5"/><path d="M24 26 Q22 38 26 48 L34 48 Q38 38 36 26" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></> },
              { name: "Singlemaxxing", pain: "Too full of yourself to settle", accent: "#a8506a",
                icon: <><circle cx="30" cy="24" r="10" fill="none" stroke="currentColor" strokeWidth="3"/><path d="M30 34 L30 48" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><circle cx="30" cy="24" r="3" fill="currentColor"/></> },
              { name: "Wellnessmaxxing", pain: "Your body and mind, finally in sync", accent: "#6a8a5a",
                icon: <><path d="M30 46 C16 36 12 24 20 18 C25 14 30 18 30 24 C30 18 35 14 40 18 C48 24 44 36 30 46 Z" fill="none" stroke="currentColor" strokeWidth="3"/><path d="M22 26 L27 26 L29 20 L32 32 L34 26 L38 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/></> },
              { name: "Studymaxxing", pain: "The grades everyone said were out of reach", accent: "#c9963a",
                icon: <><path d="M14 22 L30 14 L46 22 L30 30 Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/><path d="M14 22 L14 34 M46 22 L46 34" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M22 26 L22 36 Q30 40 38 36 L38 26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></> },
              { name: "Friendmaxxing", pain: "A circle that actually deserves you", accent: "#d4917a",
                icon: <><circle cx="22" cy="26" r="7" fill="none" stroke="currentColor" strokeWidth="2.5"/><circle cx="38" cy="26" r="7" fill="none" stroke="currentColor" strokeWidth="2.5"/><path d="M12 44 Q12 34 22 34 Q26 34 28 37 Q30 34 34 34 Q44 34 44 44" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></> },
              { name: "Peacemaxxing", pain: "Nothing rattles you anymore", accent: "#8a6aa8",
                icon: <><circle cx="30" cy="30" r="18" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/><path d="M18 30 Q30 20 42 30 Q30 40 18 30" fill="none" stroke="currentColor" strokeWidth="2.5"/><circle cx="30" cy="30" r="4" fill="currentColor"/></> },
              { name: "Confidencemaxxing", pain: "Walk in like you already own the room", accent: "#B76E79",
                icon: <><path d="M30 12 L36 24 L48 26 L39 34 L42 46 L30 40 L18 46 L21 34 L12 26 L24 24 Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/></> },
              { name: "Stylemaxxing", pain: "Dressed like the girl who already made it", accent: "#a85a42",
                icon: <><path d="M22 16 L26 20 L30 16 L34 20 L38 16 L38 22 L34 24 L34 46 L26 46 L26 24 L22 22 Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"/></> },
              { name: "Healmaxxing", pain: "Physical pain, emotional pain — gone, not just managed", accent: "#a8506a",
                icon: <><path d="M30 44 C30 44 16 34 16 22 C16 15 22 12 27 15 C29 16.5 30 19 30 19 C30 19 31 16.5 33 15 C38 12 44 15 44 22 C44 34 30 44 30 44 Z" fill="none" stroke="currentColor" strokeWidth="2.5"/><path d="M22 20 Q24 24 22 28 Q26 30 26 34" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" strokeLinecap="round"/><path d="M38 20 Q36 24 38 28 Q34 30 34 34" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" strokeLinecap="round"/></> },
              { name: "Careermaxxing", pain: "The promotion you keep almost getting", accent: "#c9963a",
                icon: <><path d="M16 44 L16 32 L24 32 L24 44 M28 44 L28 24 L36 24 L36 44 M40 44 L40 16 L48 16 L48 44" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></> },
              { name: "Intuitionmaxxing", pain: "The gut feeling you keep talking yourself out of", accent: "#8a6aa8",
                icon: <><circle cx="30" cy="30" r="16" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.35"/><circle cx="30" cy="30" r="9" fill="none" stroke="currentColor" strokeWidth="2.5"/><circle cx="30" cy="30" r="3" fill="currentColor"/></> },
            ].map((cat, i) => (
              <div key={i} style={{ background: "#fff", border: `1px solid ${cat.accent}33`, borderRadius: 16, padding: isMobile ? "18px 12px" : "24px 18px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", transition: "transform 0.2s" }}>
                <svg width={isMobile ? 34 : 40} height={isMobile ? 34 : 40} viewBox="0 0 60 60" style={{ color: cat.accent, marginBottom: 12 }}>{cat.icon}</svg>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: isMobile ? 16 : 19, fontWeight: 600, color: "#1a1210", marginBottom: 6 }}>{cat.name}</div>
                <div style={{ fontSize: isMobile ? 11 : 12, color: "#7a6a60", lineHeight: 1.4 }}>{cat.pain}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* OLD ASSUMPTION → NEW ASSUMPTION */}
      <div style={{ padding: isMobile?"48px 0":"70px 0", background: "linear-gradient(160deg,#fdf0e8 0%,#d8dce8 50%,#a8b0c8 100%)", width: "100%" }}>
        <div style={{ padding: isMobile?"0 18px":"0 24px", maxWidth: 860, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontSize: 12, color: "#B76E79", letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 800, marginBottom: 14 }}>The mechanism</div>
            <h2 className="wm" style={{ fontSize: "clamp(28px,4.5vw,52px)", color: "#000", lineHeight: 1.12, marginBottom: 16 }}>
              Every audio replaces<br/>
              <span style={{ background: "linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>an old assumption with a new one.</span>
            </h2>
            <p style={{ fontSize: "clamp(15px,1.9vw,18px)", color: "#000", lineHeight: 1.85, maxWidth: 560, margin: "0 auto 14px" }}>
              Your reality runs on assumptions — what you quietly hold as true about yourself. Installed in theta, the new assumption becomes the default. Then your reality reorganises to match it.
            </p>
            <p style={{ fontSize: "clamp(14px,1.7vw,16px)", color: "#2a1810", lineHeight: 1.8, maxWidth: 560, margin: "0 auto" }}>
              This runs both directions. Assume you're not the one he chooses, and you won't be. Assume you can't make money, and you won't. The audio isn't wishing on your behalf — it's replacing the assumption underneath, so what reflects back actually changes.
            </p>
            <p style={{ fontSize: "clamp(14px,1.7vw,16px)", color: "#2a1810", lineHeight: 1.8, maxWidth: 560, margin: "14px auto 0" }}>
              Once your assumption changes, your reality starts mirroring it back — small, specific, undeniable. That's not a metaphor. It's exactly what ProofOS is built to track: the dated, logged proof that the mirror is real.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: isMobile?26:32 }}>
            {[
              ["I'm never the one he chooses.", "I am chosen. I'm his dream girl.", "He texts first, out of nowhere, after weeks of silence."],
              ["Dating apps are impossible. I have to look hard to find the man of my dreams.", "The right person finds me when I'm not looking. I don't have to search.", "You meet him doing something completely unrelated to finding him — and it's obvious immediately."],
              ["Some women are just born with it. I wasn't.", "Gorgeous is my default. My bloodline remembers.", "A stranger stops you to say your skin is glowing."],
              ["My face just is what it is.", "My face reflects exactly who I'm becoming.", "Someone says you look different — softer, brighter."],
              ["My body and I are at war.", "My body and I are in perfect agreement.", "Your body starts craving what's actually good for it — no willpower required."],
              ["It's so hard to lose the last 20 pounds.", "Skinny is my natural body weight. I've always been naturally skinny.", "Your body drops the last weight without you trying or dieting. It happens through the mind."],
              ["It's impossible to make real money as an entrepreneur.", "Money comes to me through unexpected ways, not just my business.", "A random refund lands, a friend sends you money out of nowhere, you win something you didn't enter."],
              ["I have to force this business to work.", "My business is easy. It grows because I do.", "A stranger refers you, unprompted, out of nowhere."],
              ["I have to wait my turn to be recognised.", "I'm recognised before I even ask.", "Your manager mentions the promotion before you bring it up."],
              ["Everything takes ages. I always end up waiting.", "I'm always first in line. I get seen fast. I jump the queue.", "You get called up early, out of turn, no explanation given."],
              ["I'm afraid of aging.", "I am aging backwards. I see it in the mirror.", "You see exactly that — the mirror shows it before anyone has to tell you."],
              ["I don't fully know who I am yet. I can't decide. I never know what to choose.", "I always make the best decisions.", "Every decision feels like a full-body yes."],
              ["I have to try so hard to be noticed.", "I'm magnetic to exactly the people I desire.", "The person you're attracted to can't stop looking at you."],
              ["Being single means something's wrong with me.", "I romanticise my day and love every moment of my own company.", "You catch yourself genuinely enjoying being alone — no ache, no waiting for someone else to start your life."],
              ["I have to consciously fix myself.", "I install while I'm unconscious.", "You wake up and the anxious loop from last night is just gone."],
              ["I'm just not a good student.", "Information sticks. I retain what I need.", "A concept clicks instantly that used to take hours."],
              ["I always end up in one-sided friendships.", "All my relationships are equal — give and take.", "A friend reaches out first, checks in on you, before you even think to."],
              ["I'm always on edge.", "My nervous system is regulated. Nothing throws me off anymore.", "A situation that used to spiral just doesn't."],
              ["I have to earn the right to take up space.", "I already belong in every room I walk into.", "You speak up in a meeting without rehearsing it first."],
              ["I don't identify with my clothes anymore.", "I'm always the best dressed in the room.", "Someone asks where you got that from."],
              ["This pain is just part of who I am now.", "My body and mind release what they no longer need.", "A pain you've carried for years quietly fades."],
              ["I'll never actually get a visa to move to this country.", "The path is already clearing for me, even if I can't see how yet.", "The visa comes through — randomly, faster than anyone said was possible."],
              ["There's nothing in my budget, in my area. I'm never gonna find a home.", "My home is already looking for me. It's just a matter of time.", "The exact flat appears — right budget, right area, right when you'd stopped checking."],
              ["Nothing in my life moves at the same time.", "Every area of my life levels up together.", "Multiple good things land in the same week."],
              ["Good things happen to other people.", "I'm the luckiest girl I know.", "You get the exact parking spot, the exact table, the exact timing."],
              ["I need permission to do what I want.", "I answer to no one but myself.", "You make a decision and it just feels final — no second-guessing."],
              ["I can't trust my own gut.", "My first instinct is always right.", "You get a hunch, act on it, and it's confirmed within days."],
            ].map(([o,nw,reality],i)=>(
              <div key={i} style={{ position: "relative" }}>
              <div style={{ fontSize: isMobile?18:22, fontWeight: 900, color: "#c9963a", fontFamily: "'Jost',sans-serif", letterSpacing: "0.1em", marginBottom: 10 }}>{String(i+1).padStart(2,"0")}</div>
              <div style={{ display: "flex", flexDirection: isMobile?"column":"row", gap: isMobile?8:14, alignItems: "stretch" }}>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.8)", border: "1px solid rgba(120,120,120,0.25)", borderRadius: 14, padding: "16px 18px" }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: "#7a6a5a", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 6 }}>✗ Old assumption</div>
                  <div style={{ fontSize: isMobile?14:16, color: "#000", fontWeight: 500, lineHeight: 1.5 }}>{o}</div>
                </div>
                <div style={{ alignSelf: "center", transform: isMobile?"rotate(90deg)":"none" }}><ArrowIcon size={18} color="#e8a860"/></div>
                <div style={{ flex: 1, background: "linear-gradient(135deg,#fff4e4,#fce4c0)", border: "1.5px solid rgba(232,168,96,0.4)", borderRadius: 14, padding: "16px 18px" }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: "#c9963a", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 6 }}>✦ New assumption</div>
                  <div style={{ fontSize: isMobile?14:16, color: "#000", fontWeight: 700, lineHeight: 1.5 }}>{nw}</div>
                </div>
                <div style={{ alignSelf: "center", transform: isMobile?"rotate(90deg)":"none" }}><ArrowIcon size={18} color="#0a0a0a"/></div>
                <div style={{ flex: 1, background: "#0a0a0a", border: "1.5px solid rgba(232,168,96,0.3)", borderRadius: 14, padding: "16px 18px" }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: "#f5e0a0", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 6 }}>→ New reality</div>
                  <div style={{ fontSize: isMobile?14:16, color: "#e8d4c0", fontWeight: 600, lineHeight: 1.5 }}>{reality}</div>
                </div>
              </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MAXXING CAROUSEL */}
      <MaxxingCarousel cats={cats} />


      {/* THE PROBLEM SECTION — full-bleed peach */}
      <div style={{ padding: isMobile ? "48px 0" : "80px 0", background: "linear-gradient(160deg,#fdf0e8 0%,#fce0e8 50%,#f5c8d8 100%)", width: "100%" }}>
      <div style={{ padding: isMobile ? "0 18px" : "0 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 12, color: "#B76E79", letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>Read this if you're stuck</div>
          <h2 className="wm" style={{ fontSize: "clamp(28px,4.5vw,52px)", color: "#000000", lineHeight: 1.1, marginBottom: 20 }}>
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
            <p style={{ fontSize: "clamp(15px,1.85vw,17px)", color: "#000", lineHeight: 1.85, margin: "0 0 14px" }}>
              Self-hypnosis is the same practice as hypnotherapy — the same depth, the same direct access to the subconscious. The difference: no therapist, no appointments, no waiting a week between sessions. You reprogram your own subconscious mind through daily practice, on your own. My voice guides you into the state — you just press play. And because you can do it every single day, you get the one thing a session with a therapist can never give you: repetition. That's what makes it permanent.
            </p>
            <p style={{ fontSize: "clamp(15px,1.85vw,17px)", color: "#000", lineHeight: 1.85, margin: "0 0 14px", fontWeight: 600 }}>
              My audios shift you into the state — theta, where the subconscious actually opens. The new assumption installs while you rest. You start acting from that state without trying.
            </p>
            <p style={{ fontSize: "clamp(15px,1.85vw,17px)", color: "#000", lineHeight: 1.85, margin: 0, fontWeight: 700 }}>
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

      {/* WHY I BUILT THIS — BLACK */}
      <div style={{ background: "#000", padding: isMobile?"56px 18px":"90px 24px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"30%", left:"50%", transform:"translateX(-50%)", width:500, height:500, background:"radial-gradient(ellipse,rgba(183,110,121,0.06) 0%,transparent 70%)", pointerEvents:"none", borderRadius:"50%" }}/>
        <div style={{ maxWidth:760, margin:"0 auto", position:"relative", zIndex:1 }}>
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <div style={{ fontSize:11, color:"#B76E79", letterSpacing:"0.28em", textTransform:"uppercase", fontWeight:700, marginBottom:20, fontFamily:"'Jost',sans-serif" }}>Reshma Oracle · Why I built this</div>
            <h2 className="wm" style={{ fontSize:"clamp(28px,4.5vw,52px)", color:"#f2ece4", lineHeight:1.15, marginBottom:24, fontWeight:400 }}>
              The world is bingeing<br/>
              <span style={{ background:"linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>on manifestation content.</span>
            </h2>
          </div>
          <div style={{ maxWidth:680, margin:"0 auto", display:"flex", flexDirection:"column", gap:20 }}>
            <p style={{ fontSize:isMobile?18:22, color:"#f2ece4", lineHeight:1.7, fontFamily:"'Jost',sans-serif", fontWeight:400, letterSpacing:"0.01em" }}>
              "Everyone is consuming. And no one is installing. That's why I built this."
            </p>
            <p style={{ fontSize:isMobile?15:17, color:"#c8c0bc", lineHeight:1.85 }}>
              I press play. My subconscious receives it. A new version of me begins to build — quietly, underneath everything else I'm doing.
            </p>
            <p style={{ fontSize:isMobile?15:17, color:"#c8c0bc", lineHeight:1.85 }}>
              Not another thing to consume. A practice you repeat every single day, passively — while you sleep, rest, go to the gym, commute. You build evidence. The proof becomes impossible to ignore.
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
      <div style={{ padding: isMobile ? "60px 18px" : "90px 24px", background: "linear-gradient(160deg,#fdf0e8 0%,#e8f0d8 50%,#c8dcb0 100%)", position: "relative", overflow: "hidden" }}>
        {/* Background glow */}
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width: 600, height: 600, background: "radial-gradient(ellipse,rgba(183,110,121,0.06) 0%,transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* Eyebrow */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, color: "#B76E79", fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 16, fontFamily: "'Jost',sans-serif" }}>
              963hz · DNA Activation
            </div>
            <h2 className="wm" style={{ fontSize: "clamp(28px,4.5vw,52px)", color: "#000", lineHeight: 1.15, marginBottom: 20 }}>
              We don't stop at the surface.<br/>
              <span style={{ background: "linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>We go all the way down.</span>
            </h2>
            <p style={{ fontSize: isMobile ? 15 : 17, color: "#2a1210", lineHeight: 1.8, maxWidth: 580, margin: "0 auto", fontWeight: 400 }}>
              Most audios work on thought patterns. Ours go deeper — to the cellular level. To the part of you that holds the pattern before the thought even forms.
            </p>
          </div>

          {/* Two column — passion statement left, what this means right */}
          <div style={{ display: isMobile ? "flex" : "grid", flexDirection: "column", gridTemplateColumns: "1fr 1fr", gap: isMobile ? 24 : 40, marginBottom: 48 }}>

            {/* Left — Reshma's voice */}
            <div style={{ borderLeft: "3px solid #B76E79", paddingLeft: 28 }}>
              <div style={{ fontSize: 11, color: "#B76E79", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16, fontFamily: "'Jost',sans-serif" }}>Why I built this</div>
              <p style={{ fontSize: isMobile ? 16 : 18, color: "#1a1210", lineHeight: 1.8, fontFamily: "'Jost',sans-serif", fontWeight: 500, marginBottom: 16 }}>
                "I got obsessed with the science of why some people shift fast and others stay stuck for years. The answer wasn't mindset. It wasn't effort. It was depth.
              </p>
              <p style={{ fontSize: isMobile ? 16 : 18, color: "#1a1210", lineHeight: 1.8, fontFamily: "'Jost',sans-serif", fontWeight: 500, marginBottom: 16 }}>
                The subconscious doesn't respond to the words. It responds to the frequency, the state, and the repetition. When you combine theta brainwaves with 963hz and EMDR — you're not just changing a thought. You're changing the signal your cells are running on.
              </p>
              <p style={{ fontSize: isMobile ? 16 : 18, color: "#1a1210", lineHeight: 1.8, fontFamily: "'Jost',sans-serif", fontWeight: 500 }}>
                That's why this works when everything else didn't."
              </p>
              <div style={{ marginTop: 20, fontSize: 13, color: "#c9963a", fontWeight: 700, fontFamily: "'Jost',sans-serif" }}>— RESHMA ORACLE</div>
            </div>

            {/* Right — the three levels */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { level: "Level 01", title: "Mind", body: "Theta brainwaves (4–8 Hz) bypass the conscious filter entirely. New beliefs install without resistance. This is where hypnosis, subliminals, and hemi-sync operate.", color: "#e8a860" },
                { level: "Level 02", title: "Identity", body: "EMDR bilateral stimulation and Reiki frequency encoding dissolve the old self-concept at its root — the assumption formed before you had the words for it.", color: "#e8a860" },
                { level: "Level 03", title: "DNA", body: "963hz activates what researchers call the 'God frequency' — the cellular resonance that governs your energetic blueprint. Where the deepest patterns live, and where they can be permanently rewritten.", color: "#e8a860" },
              ].map((item, i) => (
                <div key={i} style={{ background: "#0a0a0a", border: `1px solid ${item.color}44`, borderRadius: 12, padding: "20px 22px" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: 10, color: item.color, fontWeight: 800, letterSpacing: "0.2em", fontFamily: "'Jost',sans-serif" }}>{item.level}</span>
                    <span style={{ fontSize: isMobile ? 18 : 20, fontWeight: 800, color: "#f5e0a0", fontFamily: "'Jost',sans-serif" }}>{item.title}</span>
                  </div>
                  <div style={{ fontSize: 14, color: "#d4c0a8", lineHeight: 1.75 }}>{item.body}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom — the passive daily practice promise */}
          <div style={{ background: "linear-gradient(135deg,#fdf0e8,#f2ece4)", border: "1px solid rgba(183,110,121,0.25)", borderRadius: 18, padding: isMobile ? "28px 22px" : "36px 44px", textAlign: "center", position: "relative", overflow: "hidden" }}>
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

      {/* SCIENCE — cream, one colour throughout */}
      <div style={{ padding: "70px 0", background: "#fdf0e8", width: "100%" }}>
      <div style={{ padding: "0 24px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ fontSize: 12, color: "#B76E79", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 16, fontWeight: 700 }}>The science</div>
          <h2 className="wm" style={{ fontSize: "clamp(28px,4.5vw,52px)", color: "#000000", lineHeight: 1.15, marginBottom: 22 }}>
            Your subconscious mind<br />
            <span style={{ background: `linear-gradient(90deg,${T.champagne},${T.rose})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>creates your entire reality.</span>
          </h2>
          <p style={{ fontSize: 16, color: "#2a1210", lineHeight: 1.85, maxWidth: 700, margin: "0 auto 16px" }}>
            Neuroscience confirms 95% of your thoughts, beliefs and behaviours are subconscious. Your self-concept — what you assume to be true about yourself, down to a DNA level — determines everything you experience. Not your desires. Your assumptions.
          </p>
          <p style={{ fontSize: 16, color: "#111111", lineHeight: 1.9, maxWidth: 700, margin: "0 auto" }}>
            You can read every book. Study Neville Goddard. Understand every theory. But theory without installation changes nothing. These audios install it — passively, at depth, while your conscious mind rests.
          </p>
        </div>

        {/* AUDIO SAMPLES */}
      <div style={{ padding: "0 clamp(16px,4vw,24px) 70px", maxWidth: 720, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 12, color: "#B76E79", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 14 }}>Inside the vault</div>
          <h2 className="wm" style={{ fontSize: "clamp(28px,4.5vw,52px)", color: "#000000", lineHeight: 1.15, marginBottom: 14 }}>
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
            { title: "While I Sleep I Manifest", format: "Subliminal · Music Only · No Voice", freq: "Delta", badge: "Subliminal", badgeColor: "#d4a090", icon: "🌙", desc: "Pure frequency. No voice. Affirmations beneath melodic house — works while you sleep." },
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
              }} style={{ width: 36, height: 36, borderRadius: "50%", background: a.url ? "linear-gradient(135deg,#fce4c0,#e8a860)" : "#1a1614", border: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, cursor: a.url ? "pointer" : "default", color: "#000" }}>
                {a.url ? (
                  vaultPlaying === i ? (
                    <svg width="14" height="14" viewBox="0 0 14 14"><rect x="2" y="1" width="4" height="12" rx="1" fill="#000"/><rect x="8" y="1" width="4" height="12" rx="1" fill="#000"/></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 1 L12 7 L2 13 Z" fill="#000"/></svg>
                  )
                ) : (
                  <svg width="14" height="14" viewBox="0 0 14 14"><rect x="3" y="6" width="8" height="7" rx="1.5" fill="none" stroke="#8a7868" strokeWidth="1.3"/><path d="M4.5 6 L4.5 4 A2.5 2.5 0 0 1 9.5 4 L9.5 6" fill="none" stroke="#8a7868" strokeWidth="1.3"/></svg>
                )}
              </button>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 14, fontSize: 13, color: "#111111" }}>Sample previews · Full tracks unlock in the vault</div>
      </div>

        {/* TECHNOLOGY TABLE */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 13, color: "#000000", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 14, fontWeight: 700 }}>The technology</div>
          <h2 className="wm" style={{ fontSize: "clamp(28px,4.5vw,52px)", color: "#000000", marginBottom: 12 }}>What's inside every audio.</h2>
          <p style={{ fontSize: isMobile?15:17, color: "#000000", maxWidth: 600, margin: "0 auto", lineHeight: 1.7 }}>Every track is layered with multiple technologies working simultaneously to activate your brainwave state and install the new self-concept at depth.</p>
        </div>
        {isMobile ? (
          /* MOBILE — stacked cards */
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 56 }}>
            {TECH_ROWS.map((row, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.88)", border: "1px solid rgba(183,110,121,0.15)", borderRadius: 14, padding: "16px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#B76E79" }}>{row.t}</div>
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
                <div style={{ padding: "15px 18px", fontSize: 14, fontWeight: 700, color: "#B76E79", borderRight: "1px solid rgba(183,110,121,0.08)" }}>{row.t}</div>
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
      <div style={{ padding: isMobile?"48px 18px 60px":"70px 24px", background:"linear-gradient(160deg,#fdf6ee 0%,#f0e4f5 50%,#dcc4e8 100%)" }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ fontSize: isMobile?13:14, fontWeight:700, color:"#B76E79", letterSpacing:"0.3em", textTransform:"uppercase", marginBottom:16, fontFamily:"'Jost',sans-serif" }}>Real results from real members</div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:isMobile?"clamp(40px,10vw,56px)":"clamp(48px,6vw,72px)", fontWeight:400, color:"#1a0818", letterSpacing:"-0.01em", lineHeight:1 }}>
              Wall of <span style={{ background:"linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Love</span>
            </h2>
          </div>
          <div style={{...GPRICE(isMobile)}}>
            {[
              { quote: "I listened on day 1 and felt something shift. By day 5 he texted. I didn't even look for it.", name: "Sarah, 29", cat: "Lovemaxxing" },
              { quote: "£1,800 came back as a refund I had forgotten about. Three days after starting Money Finds Me First.", name: "Priya, 33", cat: "Money" },
              { quote: "I look the same and feel completely different about my face. The glow is internal first.", name: "Maya, 26", cat: "Beauty" },
              { quote: "I've tried every subliminal channel. This is the only one where I actually feel it working in real time.", name: "Jade, 31", cat: "Identity" },
              { quote: "Woke up knowing he was coming back. No logical reason. He called that afternoon.", name: "Layla, 28", cat: "Lovemaxxing" },
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
      <div style={{ position: "relative", padding: "80px 24px", textAlign: "center", overflow: "hidden", borderTop: T.border, background: "#000000" }}>
        <Rings count={3} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 className="wm" style={{ fontSize: "clamp(28px,4.5vw,52px)", color: "#f2ece4", lineHeight: 1.2, marginBottom: 24 }}>
            Wake up knowing.<br />
            <span style={{ background: "linear-gradient(90deg,#e8a860,#e08aa8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Not hoping. Knowing.</span>
          </h2>
          <p style={{ fontSize: 17, color: "#d4c0a8", marginBottom: 32, lineHeight: 1.7, maxWidth: 500, margin: "0 auto 32px" }}>
            In that state, reality shows you the proof of what you already know.
          </p>
          <button onClick={onJoin} className="cta-shake" style={{ padding: "18px 52px", background: "linear-gradient(135deg,#fce4c0,#e8a860)", boxShadow: "0 0 40px rgba(232,168,96,0.4)", border: "none", borderRadius: 14, color: "#000", fontSize: 17, fontWeight: 800, cursor: "pointer", minHeight: 56, fontFamily: "'Jost',sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10 }}>Start your shift<ArrowIcon size={16}/></button>
          <div style={{ marginTop: 12, fontSize: 14, color: "#8a7868" }}>Cancel anytime · No download · Any device</div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: T.border, padding: "28px 24px", textAlign: "center" }}>
        <span className="wm wm-shimmer" style={{ fontSize: 22, display: "block", marginBottom: 8 }}>Self Hypnosis Goddess</span>
        <div style={{ fontSize: 13, color: "#8a7868", marginBottom: 6 }}>Reshma Oracle · reshmaoracle.com · Not on YouTube</div>
        <div style={{ fontSize: 11, color: T.borderGlow, letterSpacing: "0.03em", maxWidth: 560, margin: "0 auto 14px", lineHeight: 1.6, opacity: 0.75 }}>
          Self Hypnosis Goddess is a self-hypnosis and manifestation audio product. It is not therapy, medical treatment, or a substitute for professional mental health care. If you're experiencing a mental health crisis, please contact a licensed professional or emergency services.
        </div>
        <div style={{ fontSize: 12, color: T.borderGlow, letterSpacing: "0.15em" }}>© 2026 RESHMA ORACLE · ALL RIGHTS RESERVED</div>
      </div>

      {/* SHOP MODAL — embedded Beacons, stays on-site */}
      {shopOpen && (
        <div onClick={()=>setShopOpen(false)} style={{ position:"fixed", inset:0, zIndex:2000, background:"rgba(0,0,0,0.85)", display:"flex", alignItems:"center", justifyContent:"center", padding: isMobile?0:20 }}>
          <div onClick={e=>e.stopPropagation()} style={{ width:"100%", height: isMobile?"100%":"90vh", maxWidth:900, background:"#0a0a0a", borderRadius: isMobile?0:20, overflow:"hidden", display:"flex", flexDirection:"column", border:"1px solid rgba(232,168,96,0.3)" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 18px", borderBottom:"1px solid rgba(232,168,96,0.2)", flexShrink:0 }}>
              <span className="wm wm-shimmer" style={{ fontSize:16 }}>Shop</span>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <a href="https://beacons.ai/reshmaoracle" target="_blank" rel="noopener noreferrer" style={{ fontSize:12, color:"#8a7868", textDecoration:"none" }}>Open in new tab ↗</a>
                <button onClick={()=>setShopOpen(false)} style={{ background:"none", border:"none", color:"#f2ece4", fontSize:22, cursor:"pointer", lineHeight:1, padding:4 }}>×</button>
              </div>
            </div>
            <iframe src="https://beacons.ai/reshmaoracle" title="SHG Shop" style={{ flex:1, border:"none", width:"100%", background:"#fff" }} />
          </div>
        </div>
      )}

      {/* WAITLIST MODAL */}
      {waitlistOpen && (
        <div onClick={()=>{setWaitlistOpen(false); setWaitlistStatus("idle"); setWaitlistEmail("");}} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:900, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:"#000", border:"1.5px solid #e8b87055", borderRadius:20, padding:"36px 28px", maxWidth:400, width:"100%", textAlign:"center" }}>
            {waitlistStatus === "done" ? (
              <>
                <div style={{ fontSize:32, marginBottom:12 }}>✦</div>
                <div style={{ fontSize:20, fontWeight:700, color:"#f2ece4", marginBottom:8, fontFamily:"'Jost',sans-serif" }}>You're on the list.</div>
                <div style={{ fontSize:14, color:"#c8c0bc", marginBottom:24, lineHeight:1.6 }}>We'll email you the moment Self Hypnosis Goddess opens.</div>
                <button onClick={()=>{setWaitlistOpen(false); setWaitlistStatus("idle"); setWaitlistEmail("");}} style={{ padding:"12px 28px", background:"linear-gradient(135deg,#f5e0a0,#e8b870,#c9963a)", border:"none", borderRadius:14, color:"#000", fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"'Jost',sans-serif" }}>Close</button>
              </>
            ) : (
              <>
                <div className="wm wm-shimmer" style={{ fontSize:20, marginBottom:8 }}>Join the Waitlist</div>
                <div style={{ fontSize:14, color:"#c8c0bc", marginBottom:22, lineHeight:1.6 }}>We're not live yet — get first access the moment it opens.</div>
                <form onSubmit={submitWaitlist}>
                  <input
                    type="email"
                    required
                    value={waitlistEmail}
                    onChange={e=>{setWaitlistEmail(e.target.value); if(waitlistStatus==="error") setWaitlistStatus("idle");}}
                    placeholder="your@email.com"
                    style={{ width:"100%", padding:"14px 16px", background:"#0a0a0a", border:`1.5px solid ${waitlistStatus==="error"?"#B76E79":"#2a2a2a"}`, borderRadius:12, color:"#f2ece4", fontSize:15, fontFamily:"'Jost',sans-serif", outline:"none", marginBottom:12 }}
                  />
                  {waitlistStatus === "error" && <div style={{ fontSize:12, color:"#e8a860", marginBottom:12 }}>Please enter a valid email.</div>}
                  <button type="submit" disabled={waitlistStatus==="saving"} style={{ width:"100%", padding:"14px", background:"linear-gradient(135deg,#f5e0a0,#e8b870,#c9963a)", border:"none", borderRadius:12, color:"#000", fontSize:14, fontWeight:800, cursor:waitlistStatus==="saving"?"default":"pointer", fontFamily:"'Jost',sans-serif", opacity:waitlistStatus==="saving"?0.6:1 }}>
                    {waitlistStatus === "saving" ? "Joining..." : "Join Waitlist"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
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
