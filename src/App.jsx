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
import { TermsOfService, PrivacyPolicy, RefundPolicy } from "./pages/Legal.jsx";
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
      {screen === "tos"     && <TermsOfService   onBack={()=>setScreen("landing")}/> }
      {screen === "privacy" && <PrivacyPolicy     onBack={()=>setScreen("landing")}/> }
      {screen === "refunds" && <RefundPolicy      onBack={()=>setScreen("landing")}/> }
      {screen === "landing" && <Landing onJoin={() => setCheckoutModal(true)} onDemo={() => goPortal("goddess")} onSignIn={() => setScreen("auth")} onLegal={(p)=>setScreen(p)}/>}
    {checkoutModal && <CheckoutModal onClose={() => setCheckoutModal(false)} onDemo={() => { setCheckoutModal(false); goPortal("goddess"); }} />}
      {screen === "auth" && <AuthGate onSuccess={() => goPortal()} />}
      {screen === "portal" && (
        <ErrorBoundary><SpotifyPortal onSignOut={() => { authCtx.signOut(); setScreen("landing"); }} userTier={profile?.tier || userTier} userName={authCtx.session?.user?.user_metadata?.full_name || authCtx.session?.user?.email?.split("@")[0] || "you"} /></ErrorBoundary>
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
                <div style={{ fontSize: 12, color: "#b09888" }}>{(currentAudio.audioFormats || []).join(' · ')}{currentAudio.frequency ? ` · ${currentAudio.frequency}` : ''}</div>
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
  audio:          "https://buy.stripe.com/8x2bJ1c3L2jQ2lb5CU7AI00",
  goddess:        "https://buy.stripe.com/6oUfZh3xfcYu5xn4yQ7AI01",
  lifetime:       "https://buy.stripe.com/00w8wP2tbgaG3pffdu7AI02",
  audio_annual:   "https://buy.stripe.com/eVq4gz5Fn4rY8Jz8P67AI03",
  goddess_annual: "https://buy.stripe.com/5kQ3cvgk17Ea1h7aXe7AI04",
};

// ═══ SINGLE SOURCE OF TRUTH — every price, feature list, CTA everywhere reads from here ═══
const TIERS = {
  audio: {
    name: "Audio Tier", emoji: "🔊",
    monthly: "£19", annual: "£182", annualNote: "£15.17/mo, billed annually",
    features: ["Full exclusive audio vault","All 6 formats — Melodic House, Subliminal, EMDR, Calm, 528hz, Reiki","Loop player + sleep timer","New tracks every week","All desire categories","No ads. Ever."],
    cta: (annual)=> annual ? "Join Audio — £228/year" : "Join Audio — £19/month",
  },
  goddess: {
    name: "Goddess Tier", emoji: "✦",
    monthly: "£33", annual: "£317", annualNote: "£26.42/mo, billed annually",
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
          <div style={{fontFamily:"'Jost',sans-serif",fontSize:10,color:"#B76E79",letterSpacing:"0.28em",textTransform:"uppercase",fontWeight:400,marginBottom:8}}>Start your shift today</div>
          <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(24px,5vw,34px)",color:"#1a1218",fontWeight:400,lineHeight:1.2,marginBottom:4}}>Choose your membership.</h3>
          <p style={{fontSize:13,color:"#6a4858",lineHeight:1.5,marginBottom:16}}>Full access from day one. No downloads needed.</p>

          {/* MONTHLY / ANNUAL TOGGLE */}
          <div style={{display:"flex",background:"rgba(0,0,0,0.06)",borderRadius:50,padding:3,width:"fit-content"}}>
            {["monthly","annual"].map(b => (
              <button key={b} onClick={()=>setBilling(b)} style={{
                padding:"8px 20px",borderRadius:50,border:"none",cursor:"pointer",
                fontSize:12,fontWeight:400,letterSpacing:"0.06em",textTransform:"uppercase",
                background:billing===b?"#fff":"transparent",
                color:billing===b?"#8a2050":"#a09098",
                boxShadow:billing===b?"0 2px 8px rgba(0,0,0,0.12)":"none",
                transition:"all 0.2s",display:"flex",alignItems:"center",gap:6
              }}>
                {b==="monthly"?"Monthly":<><span>Annual</span><span style={{background:"linear-gradient(90deg,#d4a090,#B76E79)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontSize:10,fontWeight:700}}>SAVE 20%</span></>}
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
                <div style={{fontSize:16,fontWeight:400,color:"#000000",marginBottom:2}}>Audio Tier</div>
                <div style={{fontSize:11,color:"#8a7268",fontWeight:400,letterSpacing:"0.06em"}}>The full vault</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:26,fontWeight:400,color:"#B76E79",lineHeight:1}}>{isAnnual?TIERS.audio.annual:TIERS.audio.monthly}</div>
                <div style={{fontSize:11,color:"#d4a090"}}>{isAnnual?"/year":"/month"}</div>
                {isAnnual && <div style={{fontSize:10,color:"#d4a090"}}>£11.92/mo · billed once</div>}
              </div>
            </div>
            <div style={{marginBottom:12}}>
              {["Full audio vault — all desire categories","New tracks every week","Loop player · sleep timer · background play","Sleep subliminals · binaural · Reiki frequencies","No ads. Ever."].map((f,i)=>(
                <div key={i} style={{fontSize:12,color:"#000000",marginBottom:5,paddingLeft:12,position:"relative",lineHeight:1.5}}>
                  <span style={{position:"absolute",left:0,color:"#B76E79"}}>·</span>{f}
                </div>
              ))}
            </div>
            <button onClick={()=>goStripe("audio")} className="cta-shake" style={{width:"100%",padding:"12px",background:"linear-gradient(135deg,#e8b870,#d4a090)",border:"none",borderRadius:10,color:"#000",fontSize:13,fontWeight:400,cursor:"pointer",fontFamily:"'Jost',sans-serif",letterSpacing:"0.04em",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:7}}>
              {TIERS.audio.cta(isAnnual)}<ArrowIcon/>
            </button>
          </div>

          {/* GODDESS TIER */}
          <div style={{background:"linear-gradient(135deg,#fce8f0,#f8d8e8)",border:"2px solid #B76E79",borderRadius:16,padding:"22px 18px 18px",marginTop:16,position:"relative",overflow:"visible"}}>
            <div style={{position:"absolute",top:10,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(90deg,#d4a090,#B76E79)",borderRadius:20,padding:"4px 16px",fontSize:10,fontWeight:400,color:"#000",letterSpacing:"0.1em",whiteSpace:"nowrap",zIndex:5}}>✦ MOST POPULAR</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,marginTop:18}}>
              <div>
                <div style={{fontSize:16,fontWeight:400,color:"#B76E79",marginBottom:2}}>Goddess Tier</div>
                <div style={{fontSize:11,color:"#B76E79",fontWeight:400,letterSpacing:"0.06em"}}>Everything + ProofOS ✦</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:26,fontWeight:400,color:"#B76E79",lineHeight:1}}>{isAnnual?TIERS.goddess.annual:TIERS.goddess.monthly}</div>
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
            <button onClick={()=>goStripe("goddess")} className="cta-shake" style={{width:"100%",padding:"14px",background:"linear-gradient(135deg,#f0cdb8,#d4a090,#B76E79)",border:"none",borderRadius:10,color:"#000",fontSize:13,fontWeight:400,cursor:"pointer",fontFamily:"'Jost',sans-serif",boxShadow:"0 4px 20px rgba(183,110,121,0.4)",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:7}}>
              {TIERS.goddess.cta(isAnnual)}<ArrowIcon/>
            </button>
          </div>

          {/* LIFETIME */}
          <div style={{background:"#000",border:"1.5px solid #e8b87066",borderRadius:16,padding:"18px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div>
                <div style={{fontSize:16,fontWeight:400,color:"#f5e0a0",marginBottom:2}}>Lifetime Access</div>
                <div style={{fontSize:11,color:"#c8a870",fontWeight:400,letterSpacing:"0.06em"}}>Once. Forever.</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:26,fontWeight:400,color:"#f5e0a0",lineHeight:1}}>{TIERS.lifetime.monthly}</div>
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
            <button onClick={()=>goStripe("lifetime")} className="cta-shake" style={{width:"100%",padding:"12px",background:"linear-gradient(135deg,#f5e0a0,#e8b870,#d4a090,#B76E79)",border:"none",borderRadius:10,color:"#000",fontSize:13,fontWeight:400,cursor:"pointer",fontFamily:"'Jost',sans-serif",boxShadow:"0 4px 20px rgba(232,184,112,0.25)",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:7}}>{TIERS.lifetime.cta()}<ArrowIcon/></button>
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
    { id: "audio", name: TIERS.audio.name, price: isAnnual ? TIERS.audio.annual : TIERS.audio.monthly, note: TIERS.audio.annualNote, features: TIERS.audio.features, cta: TIERS.audio.cta(isAnnual), bg: "#0a0a0a", border: "#e8a86055", nameColor: "#000000", muteColor: "#8a7268", priceColor: "#e8a860", periodColor: "#d4a090", featureColor: "#000000", dot: "#e8a860", ctaBg: "linear-gradient(135deg,#e8b870,#e8a860)", ctaColor: "#000" },
    { id: "goddess", name: TIERS.goddess.name, price: isAnnual ? TIERS.goddess.annual : TIERS.goddess.monthly, note: isAnnual ? TIERS.goddess.annualNote : null, features: TIERS.goddess.features, cta: TIERS.goddess.cta(isAnnual), bg: "linear-gradient(160deg,#fce4c0,#f5d9a8)", border: "#e8a860", nameColor: "#2a1a08", muteColor: "#c9963a", priceColor: "#c9963a", periodColor: "#8a7268", featureColor: "#000000", dot: "#e8a860", ctaBg: "linear-gradient(135deg,#fce4c0,#e8a860,#c9963a)", ctaColor: "#000", popular: true },
    { id: "lifetime", name: TIERS.lifetime.name, price: TIERS.lifetime.monthly, note: TIERS.lifetime.annualNote, features: TIERS.lifetime.features, cta: TIERS.lifetime.cta(), bg: "#000", border: "#e8b87066", nameColor: "#f5e0a0", muteColor: "#c8a870", priceColor: "#f5e0a0", periodColor: "#c8a870", featureColor: "#e8dcc8", dot: "#e8b870", ctaBg: "linear-gradient(135deg,#f5e0a0,#e8b870,#d4a090,#B76E79)", ctaColor: "#000" },
  ];

  return (
    <div id="pricing" style={{ padding: isMobile ? "56px 18px" : "80px 24px", background: "linear-gradient(160deg,#fce4c0 0%,#f0d4a8 40%,#ece8d8 100%)", width: "100%" }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: isMobile ? 12 : 13, fontWeight: 700, color: "#B76E79", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 14, fontFamily: "'Jost',sans-serif" }}>Choose your membership</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? "clamp(32px,8vw,44px)" : "clamp(40px,5vw,56px)", fontWeight: 400, color: "#2a1a0a", lineHeight: 1.1 }}>
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
                {b === "monthly" ? "Monthly" : <><span>Annual</span><span style={{ background: "linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: 11, fontWeight: 800 }}>BEST VALUE</span></>}
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
              <button onClick={() => goStripe(c.id)} className="cta-shake" style={{ width: "100%", padding: "13px", backgroundImage: c.ctaBg, border: "none", borderRadius: 10, color: c.ctaColor, fontSize: 14, fontWeight: 400, cursor: "pointer", fontFamily: "'Jost',sans-serif", letterSpacing: "0.06em", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
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
  {t:"He texts me first. Obviously.",c:"#d4789a"},{t:"Money finds me first.",c:"#c8a870"},{t:"Gorgeous is my default.",c:"#d4a090"},
  {t:"My DNA is shifting. Right now.",c:"#e8b870"},{t:"My highest timeline. Activated.",c:"#c8a870"},{t:"He's obsessed. Of course he is.",c:"#d4789a"},
  {t:"My skin is porcelain. Always.",c:"#d4a090"},{t:"I shift while I sleep.",c:"#d4a090"},{t:"Money arrives unexpectedly.",c:"#c8a870"},
  {t:"My bloodline is being rewritten.",c:"#e8b870"},{t:"He comes back. Every time.",c:"#d4789a"},{t:"My waist is always snatched.",c:"#d4a090"},
  {t:"£10,000 months are my baseline.",c:"#c8a870"},{t:"I receive. Constantly. Effortlessly.",c:"#d4789a"},{t:"My self-concept is permanent now.",c:"#e8b870"},
  {t:"He can't stop thinking about me.",c:"#d4789a"},{t:"I am radiant without trying.",c:"#d4a090"},{t:"My skin glows. Everyone sees it.",c:"#d4a090"},
  {t:"He chose me. Again.",c:"#d4789a"},{t:"Abundance is my default state.",c:"#c8a870"},{t:"My beauty is effortless.",c:"#d4a090"},
  {t:"He's already mine.",c:"#d4789a"},{t:"Money loves me. Of course it does.",c:"#c8a870"},{t:"I am the woman he keeps coming back to.",c:"#d4789a"},
  {t:"My cells hold my new identity.",c:"#e8b870"},{t:"My glow is undeniable.",c:"#d4a090"},{t:"Six figures is just the start.",c:"#c8a870"},
  {t:"He finds his way back. Every time.",c:"#d4789a"},{t:"My subconscious knows. It delivers.",c:"#e8b870"},{t:"I am paid just for existing.",c:"#c8a870"},
  {t:"My face is symmetrical and clear.",c:"#d4a090"},{t:"Of course it worked out. It always does.",c:"#c8a870"},{t:"He's devoted. Obviously.",c:"#d4789a"},
  {t:"My identity upgrades in my sleep.",c:"#e8b870"},{t:"I am magnetic. Naturally.",c:"#d4a090"},{t:"My wealth expands while I sleep.",c:"#c8a870"},
  {t:"He reaches out first. Always.",c:"#d4789a"},{t:"I embody my dream self. Naturally.",c:"#e8b870"},{t:"My energy is intoxicating.",c:"#d4a090"},
  {t:"My income is limitless.",c:"#c8a870"},{t:"I am the upgraded version. Now.",c:"#e8b870"},{t:"He misses me and he's saying it.",c:"#d4789a"},
  {t:"My bank account grows daily.",c:"#c8a870"},{t:"My nervous system knows who I am.",c:"#e8b870"},{t:"I look better every single day.",c:"#d4a090"},
  {t:"Love finds me. It always does.",c:"#d4789a"},{t:"I am always in the right place.",c:"#c8a870"},{t:"My body reflects my beliefs.",c:"#d4a090"},
  {t:"My SP is devoted. Obviously.",c:"#d4789a"},{t:"The installation is complete.",c:"#e8b870"},{t:"I receive in my sleep. Obviously.",c:"#d4a090"},
  {t:"I am stunning. It's obvious.",c:"#d4a090"},{t:"My financial reality is effortless.",c:"#c8a870"},{t:"He can't get me out of his head.",c:"#d4789a"},
  {t:"My highest self is my only self.",c:"#e8b870"},{t:"People notice. They can't help it.",c:"#d4a090"},{t:"My lineage shifts with me.",c:"#e8b870"},
  {t:"I am a money magnet. Obviously.",c:"#c8a870"},{t:"He's on his way back. Of course.",c:"#d4789a"},{t:"I wake up transformed.",c:"#d4a090"},
  {t:"My life is effortless luxury.",c:"#c8a870"},{t:"My subconscious is now on my side.",c:"#e8b870"},{t:"My skin is flawless. Obviously.",c:"#d4a090"},
  {t:"Everything works out for me. Always.",c:"#c8a870"},{t:"He's never leaving. I'm that girl.",c:"#d4789a"},{t:"My DNA reflects my desires.",c:"#e8b870"},
  {t:"I am chosen. Every single time.",c:"#d4789a"},{t:"Thirty days changes everything.",c:"#d4a090"},{t:"My frequency is locked in.",c:"#e8b870"},
  {t:"I am the most beautiful version of me.",c:"#d4a090"},{t:"The universe is obsessed with me.",c:"#c8a870"},{t:"My parallel reality is now.",c:"#e8b870"},
  {t:"He's constantly thinking of me.",c:"#d4789a"},{t:"My love life is effortless.",c:"#d4789a"},{t:"I am on the frequency of receiving.",c:"#c8a870"},
  {t:"Every listen deepens the install.",c:"#d4a090"},{t:"I am becoming her daily.",c:"#e8b870"},{t:"My reality bends to my self-concept.",c:"#e8b870"},
  {t:"Unexpected income is normal for me.",c:"#c8a870"},{t:"My sleep is doing the work.",c:"#d4a090"},{t:"I am irresistible. Obviously.",c:"#d4a090"},
  {t:"He comes back. Of course he does.",c:"#d4789a"},{t:"I exist on the frequency of abundance.",c:"#c8a870"},{t:"My cells shift with every listen.",c:"#e8b870"},
  {t:"Beauty is who I am.",c:"#d4a090"},{t:"Life is happening for me. Always.",c:"#c8a870"},{t:"My manifestations arrive fast.",c:"#c8a870"},
  {t:"My theta state holds my desires.",c:"#d4a090"},{t:"The new me is permanent now.",c:"#e8b870"},{t:"I attract what I want. Effortlessly.",c:"#c8a870"},
  {t:"My aura is undeniable.",c:"#d4a090"},{t:"Money comes from everywhere.",c:"#c8a870"},{t:"The shift is already done.",c:"#e8b870"},
  {t:"I am reprogramming daily.",c:"#d4a090"},{t:"He's obsessed with who I am.",c:"#d4789a"},{t:"Every night I become her more.",c:"#d4a090"},
];
// ── APP PREVIEW SECTION — dashboard + proofos with theme toggle ──────────────
function AppPreviewSection({ isMobile }) {
  const [theme, setTheme] = useState("light"); // default light — user can toggle dark
  const [view,  setView]  = useState("dashboard");

  return (
    <div style={{ width:"100%", display:"flex", flexDirection:"column", alignItems:"center", gap:20, marginBottom:16 }}>

      {/* Tap-to-explore hint only — duplicate copy removed */}
      <div style={{ textAlign:"center", maxWidth:560 }}>
        <p style={{ fontSize:13, color:"#c8bcb0", fontFamily:"'Jost',sans-serif", letterSpacing:"0.02em" }}>
          Tap Dashboard · ProofOS ✦ · Analytics to explore each screen
        </p>
      </div>

      {/* Tab switcher */}
      <div style={{ display:"flex", gap:0, background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", borderRadius:24, padding:4 }}>
        {[["dashboard","Dashboard"],["proof","ProofOS ✦"],["analytics","Analytics"]].map(([id,l])=>(
          <button key={id} onClick={()=>setView(id)}
            style={{ padding:"7px 18px", borderRadius:20, background:view===id?"#f2ece4":"transparent", border:"none",
              color:view===id?"#000000":"#ffffff", fontSize:12, fontWeight:400, cursor:"pointer",
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
            <div style={{ fontSize:10, color:"#9a8878", letterSpacing:"0.2em", textTransform:"uppercase", fontFamily:"'Jost',sans-serif" }}>Desktop</div>
            <DesktopMockup theme={theme}/>
          </div>
        )}
        {!isMobile && view==="proof" && (
          <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:8, maxWidth:420 }}>
            <div style={{ fontSize:10, color:"#9a8878", letterSpacing:"0.2em", textTransform:"uppercase", fontFamily:"'Jost',sans-serif" }}>Desktop</div>
            <div style={{ width:420, borderRadius:18, overflow:"hidden", boxShadow:"0 18px 50px rgba(0,0,0,0.5)", border:"1px solid rgba(232,168,96,0.15)" }}>
              <div style={{ background:theme==="dark"?"#080808":"#fdf8f2", padding:"20px 24px" }}>
                <div style={{ fontSize:14, color:"#e8a860", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:16 }}>ProofOS ✦</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:16 }}>
                  {[["3","Desires"],["1","Manifested"],["14d","Streak"]].map(([v,l],i)=>(
                    <div key={i} style={{ background:theme==="dark"?"rgba(232,168,96,0.08)":"rgba(232,168,96,0.12)", borderRadius:10, padding:"12px 8px", textAlign:"center" }}>
                      <div style={{ fontSize:20, color:"#e8a860" }}>{v}</div>
                      <div style={{ fontSize:9, color:theme==="dark"?"#9a8878":"#8a6840", letterSpacing:"0.08em", textTransform:"uppercase" }}>{l}</div>
                    </div>
                  ))}
                </div>
                {[
                  { desire:"He texts me first", cat:"Lovemaxxing", days:14, signs:3, track:"He Finds His Way Back" },
                  { desire:"£1,800 received. Paid by client.", cat:"Moneymaxxing", days:6, signs:2, track:"Money Finds Me First" },
                ].map((d,i)=>(
                  <div key={i} style={{ background:theme==="dark"?"#111111":"#ffffff", border:`1px solid ${theme==="dark"?"rgba(232,168,96,0.1)":"rgba(180,104,48,0.15)"}`, borderRadius:10, padding:"12px 14px", marginBottom:8 }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
                      <span style={{ fontSize:9, padding:"2px 8px", background:"rgba(232,168,96,0.12)", color:"#e8a860", borderRadius:12 }}>{d.cat}</span>
                      <span style={{ fontSize:9, color:theme==="dark"?"#5a4a40":"#b89060" }}>Day {d.days} · {d.signs} signs</span>
                    </div>
                    <div style={{ fontSize:12, color:theme==="dark"?"#f2ece4":"#1a1008", lineHeight:1.4 }}>{d.desire}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {!isMobile && view==="analytics" && (
          <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:8, width:400 }}>
            <div style={{ fontSize:10, color:"#9a8878", letterSpacing:"0.2em", textTransform:"uppercase", fontFamily:"'Jost',sans-serif" }}>Your evidence, visualised</div>
            <div style={{ width:"100%", borderRadius:18, overflow:"hidden", boxShadow:"0 18px 50px rgba(0,0,0,0.5)" }}>
              <AnalyticsBoard theme={theme}/>
            </div>
          </div>
        )}

        {/* iPhone frame — mobile preview */}
        <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
          <div style={{ fontSize:10, color:"#9a8878", letterSpacing:"0.2em", textTransform:"uppercase", fontFamily:"'Jost',sans-serif" }}>
            {isMobile?"Preview":"iPhone"}
          </div>
          {/* iPhone shell */}
          <div style={{
            position:"relative",
            width: isMobile?252:202,
            background:"#1a1a1a",
            borderRadius: isMobile?48:42,
            padding: isMobile?"14px 6px":"12px 5px",
            boxShadow:"0 0 0 2px #3a3a3a, 0 0 0 4px #1a1a1a, 0 0 0 6px #3a3a3a, 0 30px 60px rgba(0,0,0,0.8)",
          }}>
            {/* Side buttons */}
            <div style={{ position:"absolute", left:-3, top:80, width:3, height:30, background:"#3a3a3a", borderRadius:"2px 0 0 2px" }}/>
            <div style={{ position:"absolute", left:-3, top:120, width:3, height:50, background:"#3a3a3a", borderRadius:"2px 0 0 2px" }}/>
            <div style={{ position:"absolute", left:-3, top:180, width:3, height:50, background:"#3a3a3a", borderRadius:"2px 0 0 2px" }}/>
            <div style={{ position:"absolute", right:-3, top:120, width:3, height:70, background:"#3a3a3a", borderRadius:"0 2px 2px 0" }}/>
            {/* Screen */}
            <div style={{ borderRadius: isMobile?38:34, overflow:"hidden", position:"relative" }}>
              {/* Dynamic island */}
              <div style={{ position:"absolute", top:8, left:"50%", transform:"translateX(-50%)", width:isMobile?90:72, height:isMobile?22:18, background:"#000", borderRadius:20, zIndex:10 }}/>
              {view==="dashboard" && <PortalScreenshot width={isMobile?240:190} theme={theme}/>}
              {view==="proof" && <ProofWallScreenshot width={isMobile?240:190} theme={theme}/>}
              {view==="analytics" && (
                <div style={{ width:isMobile?240:190, background:theme==="dark"?"#080808":"#fdf8f2", padding:"14px 10px" }}>
                  <AnalyticsBoard theme={theme} compact/>
                </div>
              )}
            </div>
          </div>
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

      <div style={{ fontSize:12, color:"rgba(232,168,96,0.8)", fontFamily:"'Jost',sans-serif", letterSpacing:"0.08em", textAlign:"center" }}>
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
          <span key={i} style={{ fontSize:11, fontWeight:400, letterSpacing:"0.15em", textTransform:"uppercase", color:isLit?"#fff":item.c, whiteSpace:"nowrap", fontFamily:"'Jost',sans-serif", transition:"color 0.12s, text-shadow 0.12s", textShadow:isLit?`0 0 18px ${item.c},0 0 36px ${item.c}66`:"none" }}>
          <span style={{marginRight:6,opacity:0.7}}>{item.t.toLowerCase().includes("money")||item.t.toLowerCase().includes("£")||item.t.toLowerCase().includes("income")||item.t.toLowerCase().includes("wealth")||item.t.toLowerCase().includes("financial")?"💰":item.t.toLowerCase().includes("skin")||item.t.toLowerCase().includes("face")||item.t.toLowerCase().includes("beauty")||item.t.toLowerCase().includes("glow")||item.t.toLowerCase().includes("gorgeous")||item.t.toLowerCase().includes("radiant")||item.t.toLowerCase().includes("stunning")?"✦":item.t.toLowerCase().includes("he ")||item.t.toLowerCase().includes("him")||item.t.toLowerCase().includes("sp ")||item.t.toLowerCase().includes("love")||item.t.toLowerCase().includes("devoted")?"♡":item.t.toLowerCase().includes("sleep")||item.t.toLowerCase().includes("dna")||item.t.toLowerCase().includes("cell")||item.t.toLowerCase().includes("blood")?"◐":"✦"}</span>{item.t}</span>
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

  const OMBRE = "linear-gradient(135deg,#f5e0a0 0%,#e8b870 22%,#d4a090 48%,#c4789a 72%,#B76E79 100%)";
  const bgs = [OMBRE, OMBRE, OMBRE, OMBRE, OMBRE, OMBRE];
  const bg = bgs[idx % bgs.length];

  return (
    <div style={{ overflow:"hidden" }}>
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
        <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 100%,rgba(0,0,0,0.08),transparent 70%)",pointerEvents:"none" }}/>
        <div style={{
          fontSize:13, fontWeight:600, letterSpacing:"0.3em", textTransform:"uppercase",
          marginBottom:20, fontFamily:"'Jost',sans-serif", color:"#000"
        }}>{current.label} ✦</div>
        <div className="wm" style={{
          fontSize:"clamp(30px,6vw,72px)", lineHeight:1.05, color:"#000",
          fontWeight:400, letterSpacing:"-0.01em"
        }}>{current.tagline}</div>
      </div>
      <div style={{ display:"flex", background:"#000", borderTop:"1px solid #1c1828", borderBottom:"1px solid #1c1828" }}>
        {[next1,next2,next3].map((cat,i) => (
          <div key={i}
            onClick={() => { setFlash(true); setTimeout(()=>{setIdx((idx+i+1)%cats.length);setFlash(false);},200); }}
            style={{ flex:1, padding:"16px 18px", cursor:"pointer", borderRight:i<2?"1px solid #1c1828":"none", transition:"background 0.2s" }}
            onMouseEnter={e=>e.currentTarget.style.background="#0c0814"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{ fontSize:9, color:"#d4a090", fontWeight:400, letterSpacing:"0.22em", textTransform:"uppercase", marginBottom:5, fontFamily:"'Jost',sans-serif" }}>{cat.label}</div>
            <div style={{ fontSize:12, color:"#a08878", lineHeight:1.5, fontFamily:"'Cormorant Garamond',serif" }}>{cat.tagline}</div>
          </div>
        ))}
      </div>
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

/* ── IDENTITY CAROUSEL — six accent ombres, rotates through brand colours ──── */
function IdentityCarousel({ cats, fullscreen=false }) {
  const [idx, setIdx] = useState(0);
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => { setFlash(true); setTimeout(() => { setIdx(i => (i+1)%cats.length); setFlash(false); }, 200); }, 2000);
    return () => clearInterval(timer);
  }, [cats.length]);
  const current = cats[idx];
  const next1 = cats[(idx+1)%cats.length];
  const next2 = cats[(idx+2)%cats.length];
  const next3 = cats[(idx+3)%cats.length];

  // Category-specific colours
  const CAT_COLOURS = {
    "Moneymaxxing":     "linear-gradient(135deg,#c8d8f0 0%,#8aaad8 40%,#5a7ab8 100%)",
    "Luckygirlmaxxing": "linear-gradient(135deg,#c0e8e4 0%,#80ccc4 40%,#4aa8a0 100%)",
    "Beautymaxxing":    "linear-gradient(135deg,#f8d0e8 0%,#e898c4 40%,#d4689a 100%)",
    "Lovemaxxing":      "linear-gradient(135deg,#f0d0dc 0%,#e098b0 40%,#c4607a 100%)",
    "DNAmaxxing":       "linear-gradient(135deg,#e0d0f0 0%,#b898d8 40%,#9068b8 100%)",
    "Lifemaxxing":      "linear-gradient(135deg,#fce4c0 0%,#e8b870 40%,#c9963a 100%)",
    "Bodymaxxing":      "linear-gradient(135deg,#d0e8d4 0%,#a0c8a8 40%,#6a9870 100%)",
    "Selfmaxxing":      "linear-gradient(135deg,#e8d0f0 0%,#c4a8d8 40%,#9b87c4 100%)",
    "Erosmaxxing":      "linear-gradient(135deg,#f0c8d8 0%,#d88098 40%,#b85068 100%)",
    "Businessmaxxing":  "linear-gradient(135deg,#c8d8f0 0%,#8aaad8 40%,#5a7ab8 100%)",
    "Singlemaxxing":    "linear-gradient(135deg,#e4d0f0 0%,#c0a0d8 40%,#a070c0 100%)",
    "Skinnymaxxing":    "linear-gradient(135deg,#d8f0d8 0%,#a8d8a8 40%,#78b878 100%)",
    "Sleepmaxxing":     "linear-gradient(135deg,#c8d4e8 0%,#8a9ec8 40%,#6b7db3 100%)",
    "Facemaxxing":      "linear-gradient(135deg,#f0dcd0 0%,#d8b098 40%,#c08870 100%)",
  };
  const FALLBACK = "linear-gradient(135deg,#e8d0f0 0%,#c4a8d8 40%,#9b87c4 100%)";
  const bg = CAT_COLOURS[current.label] || FALLBACK;

  return (
    <div style={{ overflow:"hidden", display:"flex", flexDirection:"column", ...(fullscreen?{flex:1}:{}) }}>
      <div style={{
        transition:"opacity 0.25s, transform 0.25s",
        opacity: flash ? 0 : 1,
        transform: flash ? "scale(0.98)" : "scale(1)",
        background: bg,
        padding: fullscreen ? "0 clamp(20px,5vw,60px)" : "clamp(44px,8vw,80px) clamp(20px,5vw,60px)",
        textAlign:"center",
        position:"relative",
        overflow:"hidden",
        ...(fullscreen ? {flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"} : {}),
      }}>
        <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 0%,rgba(255,255,255,0.15),transparent 70%)",pointerEvents:"none" }}/>
        <div style={{
          fontSize: fullscreen ? 15 : 13, fontWeight:600, letterSpacing:"0.3em", textTransform:"uppercase",
          marginBottom:20, fontFamily:"'Jost',sans-serif", color:"#000"
        }}>{current.label} ✦</div>
        <div className="wm" style={{
          fontSize: fullscreen ? "clamp(48px,10vw,110px)" : "clamp(28px,5.5vw,68px)", lineHeight:1.08, color:"#000",
          fontWeight:400, letterSpacing:"-0.01em"
        }}>{current.tagline}</div>
      </div>
      <div style={{ display:"flex", background:"#000", borderTop:"1px solid #1c1828", borderBottom:"1px solid #1c1828" }}>
        {[next1,next2,next3].map((cat,i) => (
          <div key={i}
            onClick={() => { setFlash(true); setTimeout(()=>{setIdx((idx+i+1)%cats.length);setFlash(false);},200); }}
            style={{ flex:1, padding:"16px 18px", cursor:"pointer", borderRight:i<2?"1px solid #1c1828":"none", transition:"background 0.2s" }}
            onMouseEnter={e=>e.currentTarget.style.background="#0c0814"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{ fontSize:9, color:"#9b87c4", fontWeight:400, letterSpacing:"0.22em", textTransform:"uppercase", marginBottom:5, fontFamily:"'Jost',sans-serif" }}>{cat.label}</div>
            <div style={{ fontSize:12, color:"#a08878", lineHeight:1.5, fontFamily:"'Cormorant Garamond',serif" }}>{cat.tagline}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", justifyContent:"center", gap:7, padding:"16px 0", background:"#000" }}>
        {cats.map((_,i) => (
          <div key={i}
            onClick={()=>{setFlash(true);setTimeout(()=>{setIdx(i);setFlash(false);},200);}}
            style={{ width:i===idx?20:6, height:6, borderRadius:3, background:i===idx?"#9b87c4":"#1c1828", transition:"all 0.3s", cursor:"pointer" }}/>
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
    <div style={{ background:"linear-gradient(160deg,#cdeae6 0%,#a8d8d2 50%,#7ec3ba 100%)", padding:"0 0 0 0" }}>
      <div style={{ padding:"60px clamp(16px,4vw,24px) 80px",maxWidth:760,margin:"0 auto" }}>
      <div style={{ textAlign:"center",marginBottom:40 }}>
        <div style={{ fontSize:11,color:"#b46830",letterSpacing:"0.25em",textTransform:"uppercase",fontWeight:400,marginBottom:14,fontFamily:"'Jost',sans-serif" }}>Everything you need to know</div>
        <h2 className="wm" style={{ fontSize:"clamp(28px,4.5vw,52px)",color:"#1a0a04",lineHeight:1.2 }}>FAQs</h2>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
        {FAQS.map((faq,i) => (
          <div key={i} style={{ background:open===i?"rgba(255,255,255,0.95)":"rgba(255,255,255,0.7)",border:"1px solid",borderColor:open===i?"rgba(183,110,121,0.35)":"rgba(183,110,121,0.15)",borderRadius:14,overflow:"hidden",transition:"all 0.2s",boxShadow:open===i?"0 4px 20px rgba(183,110,121,0.12)":"none" }}>
            <button onClick={() => setOpen(open===i?null:i)} style={{ width:"100%",padding:"20px 22px",background:"none",border:"none",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",gap:16 }}>
              <span style={{ fontSize:15,fontWeight:400,color:"#1a0a04",textAlign:"left",lineHeight:1.4 }}>{faq.q}</span>
              <span style={{ fontSize:20,color:"#B76E79",flexShrink:0,transform:open===i?"rotate(45deg)":"none",transition:"transform 0.2s" }}>+</span>
            </button>
            {open===i && <div style={{ padding:"0 22px 22px" }}><div style={{ height:1,background:"rgba(183,110,121,0.15)",marginBottom:16 }}/><p style={{ fontSize:14,color:"#2a1a0a",lineHeight:1.85,margin:0 }}>{faq.a}</p></div>}
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

function Landing({ onJoin, onDemo, onSignIn, onLegal }) {
  const [proofTheme, setProofTheme] = useState("dark");
  const isMobile = useMobile();
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [billing, setBilling] = useState("monthly");
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnnual, setMenuAnnual] = useState(false);
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
    if (error && !error.message?.includes("duplicate")) { setWaitlistStatus("error"); return; }
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
    <div className="hypno-bg" style={{ background: "#000000", minHeight: "100vh" }}>
      <audio ref={audioRef} src="https://qtwvslrwmreazmrdktsn.supabase.co/storage/v1/object/public/tracks/SPOILT%20INSTAGRAM%2013.04.2026.WAV" preload="none" onEnded={nextTrack} />
      <audio ref={vaultRef} preload="none" />

      {/* ANNOUNCEMENT BANNER — fixed height so nav never overlaps it */}
      {!menuOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 400, height: isMobile ? 44 : 48, paddingTop: "env(safe-area-inset-top,0px)", paddingLeft: "14px", paddingRight: "14px", paddingBottom: 0, boxSizing: "border-box", background: "linear-gradient(90deg,#f5e0a0 0%,#e8b870 45%,#c9963a 100%)", display: "flex", alignItems: "center", justifyContent: "center", gap: isMobile ? 10 : 16, overflow: "hidden" }}>
          <span style={{ fontFamily: "'Jost',sans-serif", fontSize: isMobile ? 13 : 15, fontWeight: 400, color: "#000", letterSpacing: isMobile ? "0.04em" : "0.08em", whiteSpace: "nowrap" }}>
            COMING SOON
          </span>
          <button onClick={() => setWaitlistOpen(true)} style={{ padding: isMobile?"6px 14px":"7px 18px", background: "#000", border: "none", borderRadius: 20, color: "#e8b870", fontSize: isMobile ? 12 : 13, fontWeight: 400, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap", fontFamily: "'Jost',sans-serif", letterSpacing: "0.06em" }}>
            Join Waitlist
          </button>
        </div>
      )}

      {/* NAV */}
      <nav style={{ position: "fixed", top: `calc(${isMobile ? "44px" : "48px"} + env(safe-area-inset-top,0px))`, left: 0, right: 0, zIndex: 300, height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", background: "rgba(0,0,0,0.97)", borderBottom: "1px solid #1c1828", backdropFilter: "blur(20px)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:9, flex: isMobile ? "0 0 auto" : "1 1 0" }}>
            <svg viewBox="0 0 64 64" width="24" height="24" style={{flexShrink:0}}>
              <defs><linearGradient id="navmark" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f5e0a0"/><stop offset="22%" stopColor="#e8b870"/><stop offset="48%" stopColor="#d4a090"/><stop offset="72%" stopColor="#c4789a"/><stop offset="100%" stopColor="#B76E79"/></linearGradient></defs>
              <path d="M32 10 A22 22 0 0 0 32 54 Z" fill="url(#navmark)" opacity="0.92"/>
              <path d="M32 10 A22 22 0 0 1 32 54 Z" fill="none" stroke="url(#navmark)" strokeWidth="2.6"/>
              <line x1="32" y1="8" x2="32" y2="56" stroke="url(#navmark)" strokeWidth="1.2" opacity="0.6"/>
            </svg>
            <span className="wm wm-shimmer" style={{ fontSize: "clamp(14px,4.2vw,18px)", fontWeight: 500, letterSpacing: "0.02em", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", maxWidth: isMobile ? "68vw" : "none" }} onClick={() => window.scrollTo({top:0,behavior:"smooth"})}>Self Hypnosis Goddess</span>
          </div>



        <div style={{ display: "flex", gap: 8, alignItems: "center", flex: "0 0 auto", justifyContent:"flex-end" }}>
          {/* Hamburger — both mobile and desktop */}
          <button onClick={()=>setMenuOpen(m=>!m)} style={{ width:44,height:44,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:5,padding:0,WebkitTapHighlightColor:"transparent",touchAction:"manipulation" }} aria-label="Open menu">
            <div style={{ width:22,height:2,background:"#ffffff",borderRadius:1,transition:"transform 0.2s,opacity 0.2s",transform:menuOpen?"rotate(45deg) translate(5px,5px)":"none" }}/>
            <div style={{ width:22,height:2,background:"#ffffff",borderRadius:1,transition:"opacity 0.2s",opacity:menuOpen?0:1 }}/>
            <div style={{ width:22,height:2,background:"#ffffff",borderRadius:1,transition:"transform 0.2s",transform:menuOpen?"rotate(-45deg) translate(5px,-5px)":"none" }}/>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU — full screen takeover like Steven Bartlett */}
      {menuOpen && (
        <div style={{ position:"fixed",inset:0,zIndex:999,background:"#e8a860",display:"flex",flexDirection:"column",padding:"0 32px 48px" }}>
          {/* Top bar — logo + close */}
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",height:`calc(${isMobile?"98px":"102px"} + env(safe-area-inset-top,0px))`,paddingTop:"env(safe-area-inset-top,0px)" }}>
            <span style={{ fontSize:15,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"#000",fontFamily:"'Jost',sans-serif" }}>Self Hypnosis Goddess</span>
            <button onClick={()=>setMenuOpen(false)} style={{ background:"none",border:"none",cursor:"pointer",padding:8,color:"#000",WebkitTapHighlightColor:"transparent" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="4" y1="4" x2="20" y2="20"/><line x1="20" y1="4" x2="4" y2="20"/></svg>
            </button>
          </div>

          {/* Main nav items — massive */}
          <div style={{ flex:1,display:"flex",flexDirection:"column",justifyContent:"center",gap:0 }}>
            {[
              ["Audio Library", ()=>{ document.getElementById("audio-library")?.scrollIntoView({behavior:"smooth"}); setMenuOpen(false); }],
              ["Pricing",       ()=>{ onJoin?.(); setMenuOpen(false); }],
              ["ProofOS",       ()=>{ document.getElementById("proofos")?.scrollIntoView({behavior:"smooth"}); setMenuOpen(false); }],
              ["Preview",       ()=>{ onDemo?.(); setMenuOpen(false); }],
              ["Shop",          ()=>{ setShopOpen(true); setMenuOpen(false); }],
              ["YouTube",       ()=>{ window.open("https://www.youtube.com/@Reshma.Oracle","_blank"); setMenuOpen(false); }],
            ].map(([l,fn],i)=>(
              <button key={i} onClick={fn} style={{ display:"block",width:"100%",textAlign:"left",padding:"10px 0",background:"none",border:"none",borderBottom:"1px solid rgba(0,0,0,0.12)",color:"#000",fontSize:"clamp(24px,6vw,38px)",fontWeight:400,letterSpacing:"0.04em",cursor:"pointer",fontFamily:"'Jost',sans-serif",WebkitTapHighlightColor:"transparent",lineHeight:1.15 }}>{l}</button>
            ))}
          </div>

          {/* Bottom — join + sign in */}
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <button onClick={()=>{onJoin?.();setMenuOpen(false);}} style={{ width:"100%",padding:"16px",background:"#000",border:"none",borderRadius:12,color:"#e8a860",fontSize:16,fontWeight:500,cursor:"pointer",fontFamily:"'Jost',sans-serif",letterSpacing:"0.06em",WebkitTapHighlightColor:"transparent" }}>
              Join Now ✦
            </button>
            <button onClick={()=>{onSignIn?.();setMenuOpen(false);}} style={{ width:"100%",padding:"16px",background:"none",border:"1px solid rgba(0,0,0,0.25)",borderRadius:12,color:"#000",fontSize:16,fontWeight:400,cursor:"pointer",fontFamily:"'Jost',sans-serif",letterSpacing:"0.06em",WebkitTapHighlightColor:"transparent" }}>
              Sign in
            </button>
          </div>
        </div>
      )}

      {/* HERO — full viewport carousel, then player */}
      <div style={{ marginTop: `calc(${isMobile ? "98px" : "102px"} + env(safe-area-inset-top,0px))` }}>

        {/* FULL SCREEN CAROUSEL */}
        <div style={{ height: `calc(100vh - ${isMobile?"98px":"102px"} - env(safe-area-inset-top,0px))`, minHeight: isMobile?480:560, display:"flex", flexDirection:"column", background:"#000" }}>
          <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center" }}>
            <IdentityCarousel cats={[
              { label:"Moneymaxxing",      tagline:"I manifest billions. Obviously." },
              { label:"Luckygirlmaxxing",  tagline:"Lucky girl? That's just who I am." },
              { label:"Lifemaxxing",       tagline:"My highest self is my only self." },
              { label:"Beautymaxxing",     tagline:"Gorgeous is my default." },
              { label:"Lovemaxxing",       tagline:"He only has eyes for me." },
              { label:"Selfmaxxing",       tagline:"I am the main character. Obviously." },
              { label:"Erosmaxxing",       tagline:"I am a goddess in the bedroom." },
              { label:"Bodymaxxing",       tagline:"My body is snatched. Obviously." },
              { label:"Moneymaxxing",      tagline:"Billions are my birthright." },
              { label:"Luckygirlmaxxing",  tagline:"Everything always works out for me." },
              { label:"Lovemaxxing",       tagline:"My person finds their way back. Always." },
              { label:"Beautymaxxing",     tagline:"My face is getting better every day." },
              { label:"Bodymaxxing",       tagline:"I am snatched, toned and radiant." },
              { label:"DNAmaxxing",        tagline:"My bloodline remembers." },
              { label:"Sleepmaxxing",      tagline:"I install a new identity every night." },
              { label:"Businessmaxxing",   tagline:"My business is booked, banked and busy." },
              { label:"Singlemaxxing",     tagline:"I am whole. I am enough. I am it." },
              { label:"Facemaxxing",       tagline:"I am the most gorgeous woman in the multiverse." },
              { label:"Erosmaxxing",       tagline:"My energy is magnetic. People know it." },
              { label:"Moneymaxxing",      tagline:"I make billions in my sleep." },
              { label:"Lifemaxxing",       tagline:"Highest timeline. Activated." },
              { label:"DNAmaxxing",        tagline:"My cells are rewriting themselves right now." },
              { label:"Beautymaxxing",     tagline:"People stare. I understand. Obviously." },
              { label:"Businessmaxxing",   tagline:"My income is embarrassing. In the best way. Obviously." },
              { label:"Lovemaxxing",       tagline:"He dreams about me. He can't help it." },
              { label:"Selfmaxxing",       tagline:"Luxury is the only standard I know." },
              { label:"Skinnymaxxing",     tagline:"I am snatched, toned and radiant." },
              { label:"Luckygirlmaxxing",  tagline:"I win things I didn't even enter for." },
              { label:"Singlemaxxing",     tagline:"I am so full I don't need anyone to complete me." },
              { label:"Lifemaxxing",       tagline:"I am living my dream reality right now." },
            ]} fullscreen={true} />
          </div>
        </div>

        {/* TWO LINES ABOVE PLAYER */}
        <div style={{ background:"#000", paddingTop: isMobile?24:32, paddingBottom:0, textAlign:"center", width:"100%" }}>
          <div style={{ fontSize: isMobile?"clamp(28px,8vw,40px)":"clamp(36px,5.2vw,84px)", color:"#f2ece4", fontFamily:"'Jost',sans-serif", fontWeight:300, letterSpacing:"-0.01em", lineHeight:1.05, marginBottom:14, whiteSpace: isMobile?"normal":"nowrap", padding: isMobile?"0 16px":"0 20px", width:"100%" }}>Spotify for your subconscious mind</div>
          <div style={{ fontSize: isMobile?13:15, color:"#f2ece4", fontFamily:"'Jost',sans-serif", fontWeight:400, letterSpacing:"0.25em", textTransform:"uppercase", marginBottom:24 }}>Manifest your dream reality</div>
        </div>

        {/* SPOTIFY-STYLE PLAYER */}
        <div style={{ background:"#000", padding: isMobile?"16px 18px 24px":"20px 24px 32px" }}>
          <div style={{ background: "#0a0a0a", border: "1px solid rgba(232,168,96,0.35)", borderRadius: 18, padding: isMobile ? "18px" : "22px 26px", maxWidth: 520, margin: "0 auto", boxShadow: "0 12px 60px rgba(0,0,0,0.5)", overflow: "visible" }}>
            {/* Top row — track info + waveform */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ width:56, height:56, borderRadius:10, background:"#000", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", border:"1px solid rgba(232,168,96,0.2)", overflow:"hidden" }}>
                <div style={{ display:"flex", alignItems:"center", gap:2, height:36 }}>
                  {[6,14,22,18,28,12,24,20,16,10,26,8,22,18,14].map((h,i)=>(
                    <div key={i} style={{ width:2.5, borderRadius:2, background: playing ? `linear-gradient(to top, #e8a860, #fce4c0)` : "rgba(232,168,96,0.3)", height: playing ? h : Math.max(4, h*0.4), transition:"height 0.3s" }}/>
                  ))}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: isMobile ? 16 : 17, fontWeight: 400, color: "#f2ece4", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentTrack?.title || "Spoilt Goddess"}</div>
                <div style={{ fontSize: 13, color: "#e8a860", fontFamily: "'Jost',sans-serif", fontWeight: 400, letterSpacing: "0.06em" }}>Reshma Oracle</div>
                <div style={{ fontSize: 12, color: "#b09888", fontFamily: "'Jost',sans-serif", marginTop: 2 }}>{currentTrack?.freq || "Melodic House · EMDR · 528hz"}</div>
              </div>
              {playing && (
                <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(232,168,96,0.12)", border: "1px solid rgba(232,168,96,0.3)", borderRadius: 20, padding: "4px 10px", flexShrink: 0 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#e8a860", animation: "pulse 1.2s ease-in-out infinite" }}/>
                  <span style={{ fontSize: 11, color: "#e8a860", fontFamily: "'Jost',sans-serif", fontWeight: 700 }}>LIVE</span>
                </div>
              )}
            </div>
            {/* Progress bar */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2, position: "relative" }}>
                <div style={{ width:`${progress}%`, height:"100%", background:"linear-gradient(90deg,#e8b870,#e8a860)", borderRadius:2, position:"relative" }}>
                  <div style={{ position:"absolute", right:-4, top:"50%", transform:"translateY(-50%)", width:10, height:10, borderRadius:"50%", background:"#f5e0a0", opacity: playing ? 1 : 0 }}/>
                </div>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
                <span style={{ fontSize:10, color:"#7a6a60", fontFamily:"'Jost',sans-serif" }}>0:00</span>
                <span style={{ fontSize:10, color:"#7a6a60", fontFamily:"'Jost',sans-serif" }}>4:32</span>
              </div>
            </div>
            {/* Controls */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"4px 4px 0", overflow:"visible" }}>
              <button style={{ background:"none", border:"none", cursor:"pointer", padding:8, opacity:0.45, lineHeight:0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e8a860" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg>
              </button>
              <button onClick={prevTrack} style={{ background:"none", border:"none", cursor:"pointer", padding:8, lineHeight:0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#e8a860"><path d="M19 20L9 12l10-8v16z"/><rect x="5" y="4" width="2.5" height="16" rx="1" fill="#e8a860"/></svg>
              </button>
              <button onClick={togglePlay} style={{ width:46, height:46, borderRadius:"50%", background:"linear-gradient(135deg,#e8b870,#e8a860)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 24px rgba(232,168,96,0.45)", flexShrink:0, lineHeight:0, overflow:"visible" }}>
                {playing
                  ? <svg width="20" height="20" viewBox="0 0 24 24" fill="#000"><rect x="6" y="4" width="4" height="16" rx="1.5"/><rect x="14" y="4" width="4" height="16" rx="1.5"/></svg>
                  : <svg width="20" height="20" viewBox="0 0 24 24" fill="#000"><polygon points="7 3 21 12 7 21 7 3"/></svg>
                }
              </button>
              <button onClick={nextTrack} style={{ background:"none", border:"none", cursor:"pointer", padding:8, lineHeight:0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#e8a860"><path d="M5 4l10 8-10 8V4z"/><rect x="16.5" y="4" width="2.5" height="16" rx="1" fill="#e8a860"/></svg>
              </button>
              <button style={{ background:"none", border:"none", cursor:"pointer", padding:8, lineHeight:0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e8a860" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
              </button>
            </div>
            {/* Track dots */}
            <div style={{ display:"flex", justifyContent:"center", gap:6, marginTop:12 }}>
              {PLAYLIST.map((_,i) => (
                <button key={i} onClick={()=>loadTrack(i)} style={{ width: i===trackIdx?18:6, height:6, borderRadius:3, background: i===trackIdx?"#e8a860":"rgba(232,168,96,0.2)", border:"none", cursor:"pointer", padding:0, transition:"all 0.25s" }}/>
              ))}
            </div>
            <div style={{ textAlign:"center", marginTop:12, fontSize:11, color:"#786860", fontFamily:"'Jost',sans-serif" }}>
              {playing ? "✦ Playing — continues in background" : "Tap play to listen — free preview"}
            </div>
          </div>
        </div>
      </div>
      {/* LOGO — drop in here */}
      <div style={{ background:"#000", paddingTop: isMobile?32:48, display:"flex", justifyContent:"center", alignItems:"center" }}>
        {/* logo goes here */}
      </div>

      {/* BRAND BLOCK — below player */}
      <div id="audio-library" style={{ background:"#000", padding: isMobile?"40px 24px":"56px 48px", textAlign:"center" }}>
        <div style={{ fontSize: isMobile?"clamp(36px,10vw,52px)":"clamp(52px,6.5vw,84px)", color:"#f2ece4", lineHeight:1.0, fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", letterSpacing:"-0.01em", marginBottom:16 }}>
          Self Hypnosis Goddess
        </div>
        <div style={{ fontSize: isMobile?26:36, letterSpacing:"0.12em", textTransform:"uppercase", color:"#e8a860", fontFamily:"'Jost',sans-serif", fontWeight:400, marginBottom:10 }}>Audio Library</div>
        <div style={{ fontSize: isMobile?14:16, letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(232,168,96,0.6)", fontFamily:"'Jost',sans-serif", fontWeight:400 }}>+ ProofOS ✦</div>
      </div>

      {/* SEGMENT 3 — What's inside, cream */}
      <div style={{ background:"#fdf0e8", padding: isMobile?"48px 24px":"64px 48px", textAlign:"center" }}>
        <div style={{ maxWidth:680, margin:"0 auto" }}>
          <div style={{ fontSize: isMobile?"clamp(32px,9vw,44px)":"clamp(44px,6vw,64px)", color:"#1a0a04", fontFamily:"'Jost',sans-serif", fontWeight:400, letterSpacing:"-0.03em", lineHeight:0.95, marginBottom:28 }}>
            Inside the Library.
          </div>
          <p style={{ fontSize: isMobile?18:21, color:"#3a2010", lineHeight:1.85, marginBottom:20, fontFamily:"'Jost',sans-serif", fontWeight:400 }}>
            A growing library of hypnosis and subliminal audios — layered beneath melodic house music, EMDR and binaural beats — designed to shift your identity and manifest every single desire you have ever dreamed of.
          </p>
          <p style={{ fontSize: isMobile?17:20, color:"#3a2010", lineHeight:1.85, marginBottom:20, fontFamily:"'Jost',sans-serif", fontWeight:400 }}>
            No one will ever know you're reprogramming your subconscious while you listen to music. Repeat, repeat, repeat.
          </p>
          <p style={{ fontSize: isMobile?17:20, color:"#3a2010", lineHeight:1.85, marginBottom:20, fontFamily:"'Jost',sans-serif", fontWeight:400 }}>
            Watch your reality bend right in front of your eyes.
          </p>
          <p style={{ fontSize: isMobile?16:18, color:"#6a4028", lineHeight:1.8, marginBottom:16, fontFamily:"'Jost',sans-serif", fontWeight:400 }}>
            Log and track every single manifestation you receive with <span style={{ color:"#c9963a" }}>ProofOS</span>. Keep a record. Build your evidence. See your patterns. Forever.
          </p>
        </div>
      </div>

      {/* APP PREVIEW */}
      <AppPreviewSection isMobile={isMobile}/>





      {/* HOW IT WORKS — 5 massive steps in ombre colours */}
      <div style={{ background:"#fdf0e8", padding: isMobile?"28px 24px 0":"36px 48px 0", textAlign:"center" }}>
        <div style={{ fontSize:11, color:"#b46830", letterSpacing:"0.3em", textTransform:"uppercase", fontFamily:"'Jost',sans-serif", fontWeight:400, marginBottom:12 }}>How it works</div>
        <div style={{ fontSize: isMobile?"clamp(36px,10vw,56px)":"clamp(48px,6vw,72px)", color:"#1a0a04", fontFamily:"'Jost',sans-serif", fontWeight:400, letterSpacing:"-0.02em", lineHeight:1.0, paddingBottom:28 }}>Five steps.</div>
      </div>
      <div style={{ background:"#000" }}>
        {[
          { n:"01", icon:"✦", title:"Set your intention", body:"Choose your desire. Be specific. Log it in ProofOS.", bg:"linear-gradient(135deg,#fce4c0,#f5d4a0)" },
          { n:"02", icon:"▶", title:"Press play", body:"Listen while you sleep, on your hot girl walk, at the gym. Daily.", bg:"linear-gradient(135deg,#f5d4a0,#e8b870)" },
          { n:"03", icon:"◎", title:"Let it install", body:"Your subconscious receives it. No effort. No forcing. Just repeat.", bg:"linear-gradient(135deg,#e8b870,#d4a090)" },
          { n:"04", icon:"📷", title:"Log every sign", body:"A text. A refund. A compliment. A coincidence. Screenshot it. Log it.", bg:"linear-gradient(135deg,#d4a090,#c4789a)" },
          { n:"05", icon:"✓", title:"Mark it manifested", body:"When it arrives — close the thread. Your proof is permanent. Forever.", bg:"linear-gradient(135deg,#c4789a,#B76E79)" },
        ].map(({n,icon,title,body,bg},i)=>(
          <div key={i} style={{ background:bg, padding: isMobile?"32px 24px":"48px 64px", display:"flex", flexDirection: isMobile?"column":"row", alignItems: isMobile?"flex-start":"center", gap: isMobile?12:48 }}>
            <div style={{ fontSize: isMobile?"clamp(64px,20vw,100px)":"clamp(80px,10vw,120px)", color:"rgba(0,0,0,0.15)", fontFamily:"'Jost',sans-serif", fontWeight:700, lineHeight:1, flexShrink:0, letterSpacing:"-0.04em" }}>{n}</div>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                <span style={{ fontSize: isMobile?24:28, lineHeight:1 }}>{icon}</span>
                <div style={{ fontSize: isMobile?"clamp(28px,8vw,44px)":"clamp(32px,4vw,52px)", color:"#000", fontFamily:"'Jost',sans-serif", fontWeight:400, letterSpacing:"-0.02em", lineHeight:1.1 }}>{title}</div>
              </div>
              <div style={{ fontSize: isMobile?16:19, color:"rgba(0,0,0,0.6)", fontFamily:"'Jost',sans-serif", fontWeight:400, lineHeight:1.7 }}>{body}</div>
            </div>
          </div>
        ))}
      </div>

      {/* MELODIC HOUSE USP — cream background, locked palette */}
      <div style={{ padding: isMobile ? "48px 18px" : "70px clamp(16px,4vw,24px)", background: "linear-gradient(160deg,#fce4c0 0%,#f5d8a8 40%,#ece8d8 100%)", width: "100%" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ background: "transparent", border: "none", borderRadius: 20, padding: isMobile?"28px 0":"36px 0", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 12, color: "#b46830", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 14, textAlign: "center" }}>What makes this different</div>
            <h2 style={{ fontSize: isMobile?"clamp(32px,9vw,52px)":"clamp(44px,5.5vw,72px)", lineHeight: 1.05, marginBottom: 20, color: "#1a0a04", textAlign: "center", fontFamily:"'Jost',sans-serif", fontWeight:400, letterSpacing:"-0.02em" }}>
              Most hypnosis is boring.<br/>This is different.
            </h2>
            <p style={{ fontSize: isMobile?17:20, color: "#3a2010", lineHeight: 1.85, marginBottom: 16, maxWidth: 680, textAlign: "center", margin: "0 auto 16px", fontFamily:"'Jost',sans-serif", fontWeight:400 }}>
              Monotone voice. Generic ambient sound. You fall asleep in two minutes and nothing changes. Most hypnosis feels like a task, not a ritual.
            </p>
            <p style={{ fontSize: isMobile?17:20, color: "#3a2010", lineHeight: 1.85, marginBottom: 16, maxWidth: 680, textAlign: "center", margin: "0 auto 16px", fontFamily:"'Jost',sans-serif", fontWeight:400 }}>
              This is the only one that makes listening feel like a daily ritual. Hypnosis and subliminals layered beneath melodic house music, EMDR and binaural beats — produced to keep you coming back.
            </p>
            <p style={{ fontSize: isMobile?18:22, color: "#1a0a04", lineHeight: 1.7, marginBottom: 28, maxWidth: 680, textAlign: "center", margin: "0 auto 28px", fontFamily:"'Jost',sans-serif", fontWeight:400 }}>
              Save yourself thousands in therapy sessions.
            </p>

            {/* THREE FORMATS */}
            <div style={{ background: "rgba(232,168,96,0.06)", border: "1px solid rgba(232,168,96,0.15)", borderRadius: 14, padding: "18px 24px", marginBottom: 28, maxWidth: 560, margin: "0 auto 28px" }}>
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
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#000000", marginBottom: 3 }}>{f.label}</div>
                    <div style={{ fontSize: 13, color: "#000000", lineHeight: 1.65 }}>{f.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* LANDING PROOF WALL — exact mirror of the live dashboard */}
      <LandingProofWall isMobile={isMobile}/>

      {/* WHAT'S INSIDE — CATEGORY SHOWCASE */}
      <div style={{ padding: isMobile ? "48px 18px" : "80px 24px", background: "linear-gradient(160deg,#f5ede0 0%,#ece0cc 50%,#e8d4b4 100%)", width: "100%" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: isMobile ? 28 : 44 }}>
            <div style={{ fontSize: isMobile?"clamp(36px,10vw,48px)":"clamp(48px,6vw,68px)", color:"#1a0a04", fontFamily:"'Jost',sans-serif", fontWeight:400, letterSpacing:"-0.03em", lineHeight:1.0, marginBottom:20 }}>The Library.</div>
            <div style={{ fontSize: 11, fontWeight: 400, color: "#B76E79", letterSpacing: "0.28em", textTransform: "uppercase", marginBottom: 14, fontFamily:"'Jost',sans-serif" }}>What's Inside</div>
            <h2 style={{ fontSize: "clamp(28px,4.5vw,44px)", color: "#000000", fontWeight: 400, marginBottom: 12, fontFamily:"'Jost',sans-serif", letterSpacing:"-0.02em" }}>Whatever it is, it's covered.</h2>
            <p style={{ fontSize: 15, color: "#5a4a40", maxWidth: 640, margin: "0 auto", whiteSpace: isMobile ? "normal" : "nowrap", fontFamily:"'Jost',sans-serif" }}>A growing library of categories. Real tracks for the exact thing that's actually keeping you up.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: isMobile ? 10 : 16 }}>
            {[
              { name: "Lovemaxxing", pain: "Him, obsessed. You, unbothered.", accent: "#B76E79",
                icon: <path d="M30 52 C14 42 10 30 18 24 C24 19 30 23 30 30 C30 23 36 19 42 24 C50 30 46 42 30 52 Z" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round"/> },
              { name: "Beautymaxxing", pain: "The face in the mirror, finally the one you manifested", accent: "#b8547a",
                icon: <><path d="M30 20 C24 20 20 24 20 29 C20 33 23 36 27 36 C24 38 23 42 25 46 C22 44 20 40 21 35 C16 34 13 30 13 25 C13 19 18 14 24 14 C27 14 29 15.5 30 17 C31 15.5 33 14 36 14 C42 14 47 19 47 25 C47 30 44 34 39 35 C40 40 38 44 35 46 C37 42 36 38 33 36 C37 36 40 33 40 29 C40 24 36 20 30 20 Z" fill="currentColor" opacity="0.9"/><path d="M30 46 L30 54 M25 50 Q30 48 35 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/></> },
              { name: "Facemaxxing", pain: "Skin so good they ask what you use", accent: "#c4789a",
                icon: <><ellipse cx="30" cy="30" rx="16" ry="20" fill="none" stroke="currentColor" strokeWidth="3"/><circle cx="24" cy="26" r="2" fill="currentColor"/><circle cx="36" cy="26" r="2" fill="currentColor"/><path d="M24 38 Q30 42 36 38" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></> },
              { name: "Bodymaxxing", pain: "The body that makes a room stop", accent: "#B76E79",
                icon: <><circle cx="30" cy="14" r="6" fill="none" stroke="currentColor" strokeWidth="3"/><path d="M30 20 L30 38 M20 26 L40 26 M30 38 L22 50 M30 38 L38 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></> },
              { name: "Moneymaxxing", pain: "The next zero on your bank statement", accent: "#c9963a",
                icon: <><circle cx="30" cy="30" r="17" fill="none" stroke="currentColor" strokeWidth="3"/><path d="M30 20 L30 40 M25 24 Q25 20 30 20 Q35 20 35 24 Q35 28 30 28 Q25 28 25 32 Q25 36 30 36 Q35 36 35 32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></> },
              { name: "Businessmaxxing", pain: "The empire everyone said was unrealistic", accent: "#c9963a",
                icon: <><rect x="14" y="24" width="32" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="3"/><path d="M22 24 L22 18 Q22 15 25 15 L35 15 Q38 15 38 18 L38 24" fill="none" stroke="currentColor" strokeWidth="3"/></> },
              { name: "DNAmaxxing", pain: "Ageless. Radiant. Undeniable.", accent: "#8a3050",
                icon: <><path d="M20 12 Q30 20 20 28 Q10 36 20 44 Q30 52 20 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" transform="translate(10,0)"/><path d="M40 12 Q30 20 40 28 Q50 36 40 44 Q30 52 40 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" transform="translate(-10,0)"/><path d="M18 18 L42 18 M16 30 L44 30 M18 42 L42 42" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/></> },
              { name: "Selfmaxxing", pain: "The woman you were always meant to be", accent: "#e8b870",
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
              { name: "Wellnessmaxxing", pain: "Your body and mind, finally in sync", accent: "#c4789a",
                icon: <><path d="M30 46 C16 36 12 24 20 18 C25 14 30 18 30 24 C30 18 35 14 40 18 C48 24 44 36 30 46 Z" fill="none" stroke="currentColor" strokeWidth="3"/><path d="M22 26 L27 26 L29 20 L32 32 L34 26 L38 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/></> },
              { name: "Sleepmaxxing", pain: "Manifesting while you're unconscious", accent: "#f5e0a0",
                icon: <path d="M38 16 A16 16 0 1 0 38 44 A12 12 0 0 1 38 16" fill="currentColor"/> },
              { name: "Studymaxxing", pain: "The grades everyone said were out of reach", accent: "#c9963a",
                icon: <><path d="M14 22 L30 14 L46 22 L30 30 Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/><path d="M14 22 L14 34 M46 22 L46 34" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M22 26 L22 36 Q30 40 38 36 L38 26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></> },
              { name: "Friendmaxxing", pain: "A circle that actually deserves you", accent: "#d4917a",
                icon: <><circle cx="22" cy="26" r="7" fill="none" stroke="currentColor" strokeWidth="2.5"/><circle cx="38" cy="26" r="7" fill="none" stroke="currentColor" strokeWidth="2.5"/><path d="M12 44 Q12 34 22 34 Q26 34 28 37 Q30 34 34 34 Q44 34 44 44" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></> },
              { name: "Peacemaxxing", pain: "Nothing rattles you anymore", accent: "#8a6aa8",
                icon: <><circle cx="30" cy="30" r="18" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/><path d="M18 30 Q30 20 42 30 Q30 40 18 30" fill="none" stroke="currentColor" strokeWidth="2.5"/><circle cx="30" cy="30" r="4" fill="currentColor"/></> },
              { name: "Confidencemaxxing", pain: "Walk in like you already own the room", accent: "#B76E79",
                icon: <><path d="M30 12 L36 24 L48 26 L39 34 L42 46 L30 40 L18 46 L21 34 L12 26 L24 24 Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/></> },
              { name: "Stylemaxxing", pain: "Dressed like the girl who already made it", accent: "#d4a090",
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
                <div style={{ fontFamily: "'Jost',sans-serif", letterSpacing: "0.06em", fontSize: isMobile ? 16 : 19, fontWeight: 600, color: "#000000", marginBottom: 6 }}>{cat.name}</div>
                <div style={{ fontSize: isMobile ? 11 : 12, color: "#7a6a60", lineHeight: 1.4 }}>{cat.pain}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      
      {/* BOTTOM CAROUSEL — same ombre style as top, different affirmations */}
      <IdentityCarousel cats={[
        { label:"Moneymaxxing",     tagline:"Money finds me first. Obviously." },
        { label:"Lovemaxxing",      tagline:"He's obsessed. Of course he is." },
        { label:"Beautymaxxing",    tagline:"Gorgeous is my default. Always." },
        { label:"Selfmaxxing",      tagline:"I am the upgraded version. Now." },
        { label:"Sovereignmaxxing", tagline:"I receive. Constantly. Effortlessly." },
        { label:"Wellnessmaxxing",  tagline:"My body reflects my beliefs." },
      ]} />


      {/* PROOFOS INTRO — brief 2 sentence version */}
      <div style={{ padding: isMobile?"32px 18px":"48px 24px", textAlign:"center", maxWidth:680, margin:"0 auto" }}>
        <p style={{ fontSize:"clamp(15px,1.85vw,17px)", color:"#c8bcb0", lineHeight:1.85 }}>
          Every track links to a desire. Every sign you receive gets logged in <span style={{ color:"#e8a860" }}>ProofOS ✦</span> — dated, stacked, permanent. Your proof wall builds itself while you sleep.
        </p>
      </div>
      {/* WALL OF LOVE */}
      <div style={{ padding: isMobile?"48px 18px 60px":"70px 24px", background:"linear-gradient(160deg,#2a0f18 0%,#1a0810 50%,#000000 100%)" }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ fontSize: isMobile?13:14, fontWeight:400, color:"#B76E79", letterSpacing:"0.3em", textTransform:"uppercase", marginBottom:16, fontFamily:"'Jost',sans-serif" }}>Real results from real members</div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:isMobile?"clamp(40px,10vw,56px)":"clamp(48px,6vw,72px)", fontWeight:400, color:"#f2ece4", letterSpacing:"-0.01em", lineHeight:1 }}>
              Wall of <span style={{ background:"linear-gradient(90deg,#e8a8bc,#B76E79)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Love</span>
            </h2>
          </div>
          <div style={{...GPRICE(isMobile)}}>
            {[
              { quote: "I listened on day 1 and felt something shift. By day 5 he texted. I didn't even look for it.", name: "Sarah, 29", cat: "Lovemaxxing" },
              { quote: "£1,800 came back as a refund I had forgotten about. Three days after starting Money Finds Me First.", name: "Priya, 33", cat: "Moneymaxxing" },
              { quote: "I look the same and feel completely different about my face. The glow is internal first.", name: "Maya, 26", cat: "Beautymaxxing" },
              { quote: "I've tried every subliminal channel. This is the only one where I actually feel it working in real time.", name: "Jade, 31", cat: "Selfmaxxing" },
              { quote: "I genuinely thought he was about to break up with me. I kept listening anyway. He proposed three weeks later.", name: "Ellie, 30", cat: "Lovemaxxing" },
              { quote: "I was convinced I was about to lose my job. Instead I got a promotion I hadn't even applied for.", name: "Freya, 27", cat: "Careermaxxing" },
              { quote: "I was so sure my business was about to crash. A client came out of nowhere and it turned everything around.", name: "Nadia, 34", cat: "Businessmaxxing" },
              { quote: "People offer to buy me a coffee or a drink now — genuinely, 90% of the time I go out. It never used to happen.", name: "Bella, 28", cat: "Erosmaxxing" },
              { quote: "I found €50 on the street one day, out of nowhere, while I had Money Finds Me First on repeat. Then it happened again. Then again. It just keeps happening.", name: "Camille, 25", cat: "Luckygirlmaxxing" },
              { quote: "Woke up knowing he was coming back. No logical reason. He called that afternoon.", name: "Layla, 28", cat: "Lovemaxxing" },
              { quote: "The sleep subliminal changed my dreams. I woke up feeling like money was already mine.", name: "Chloe, 35", cat: "Moneymaxxing" },
              { quote: "I used to check my phone every five minutes waiting for him to text. Now I forget to check, and that's exactly when he does.", name: "Amara, 30", cat: "Lovemaxxing" },
            ].map((t, i) => (
              <div key={i} style={{ background:"#fff", border:"1px solid rgba(183,110,121,0.25)", borderRadius:16, padding:"22px 20px", display:"flex", flexDirection:"column", gap:12, boxShadow:"0 4px 24px rgba(183,110,121,0.12)" }}>
                <div style={{ width:32, height:24, opacity:0.25 }}>
                  <svg viewBox="0 0 32 24" fill="#B76E79"><path d="M0 24V14.4C0 10.24 1.12 6.72 3.36 3.84 5.6.96 8.64.16 12.48 0L13.44 2.4C10.88 3.04 8.96 4.16 7.68 5.76 6.4 7.36 5.76 9.28 5.76 11.52H11.52V24H0zm20.48 0V14.4c0-4.16 1.12-7.68 3.36-10.56C26.08.96 29.12.16 32.96 0L33.92 2.4C31.36 3.04 29.44 4.16 28.16 5.76c-1.28 1.6-1.92 3.52-1.92 5.76h5.76V24H20.48z"/></svg>
                </div>
                <p style={{ fontSize:isMobile?15:17, color:"#1a1410", lineHeight:1.85, fontFamily:"'Cormorant Garamond',serif", flex:1 }}>{t.quote}</p>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontSize:12, fontWeight:400, color:"#000000", fontFamily:"'Jost',sans-serif" }}>{t.name}</span>
                  <span style={{ fontSize:11, padding:"3px 10px", background:"rgba(183,110,121,0.12)", border:"1px solid rgba(183,110,121,0.3)", borderRadius:20, color:"#B76E79", fontWeight:400, letterSpacing:"0.06em", fontFamily:"'Jost',sans-serif" }}>{t.cat}</span>
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
      <div style={{ background: "linear-gradient(135deg,#e8d0f0 0%,#c4a8d8 35%,#9b87c4 65%,#7a6aaa 100%)", padding: isMobile?"64px 24px":"80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(0,0,0,0.45)", fontFamily: "'Jost',sans-serif", marginBottom: 16 }}>Coming soon</div>
          <h2 className="wm" style={{ fontSize: "clamp(32px,5vw,58px)", color: "#000", lineHeight: 1.1, marginBottom: 20, fontWeight: 400 }}>
            Let's stay<br/>connected.
          </h2>
          <p style={{ fontSize: isMobile?15:17, color: "rgba(0,0,0,0.6)", marginBottom: 32, lineHeight: 1.75, maxWidth: 420, margin: "0 auto 32px", fontFamily: "'Jost',sans-serif" }}>
            Join the waitlist and be the first to know when the audio library opens.
          </p>
          <button onClick={()=>setWaitlistOpen(true)} style={{ padding: "16px 48px", background: "#000", border: "none", borderRadius: 40, color: "#e8a860", fontSize: 15, fontWeight: 400, cursor: "pointer", fontFamily: "'Jost',sans-serif", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Join Waitlist
          </button>
          <div style={{ marginTop: 14, fontSize: 12, color: "rgba(0,0,0,0.4)", fontFamily: "'Jost',sans-serif" }}>No spam. Just the launch date.</div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: T.border, padding: "28px 24px", textAlign: "center" }}>
        <span className="wm wm-shimmer" style={{ fontSize: 22, display: "block", marginBottom: 8 }}>Self Hypnosis Goddess</span>
        <div style={{ fontSize: 13, color: "#8a7868", marginBottom: 6 }}>Reshma Oracle · reshmaoracle.com · Not on YouTube</div>
        <div style={{ fontSize: 11, color: T.borderGlow, letterSpacing: "0.03em", maxWidth: 560, margin: "0 auto 14px", lineHeight: 1.6, opacity: 0.75 }}>
          Self Hypnosis Goddess is a self-hypnosis and manifestation audio product. It is not therapy, medical treatment, or a substitute for professional mental health care. If you're experiencing a mental health crisis, please contact a licensed professional or emergency services.
        </div>
        <div style={{ display:"flex", gap:20, justifyContent:"center", marginBottom:14, flexWrap:"wrap" }}>
          {[["Terms of Service","tos"],["Privacy Policy","privacy"],["Refund Policy","refunds"]].map(([l,s])=>(
            <button key={s} onClick={()=>onLegal?.(s)} style={{ background:"none", border:"none", color:"#7a6858", fontSize:12, cursor:"pointer", fontFamily:"'Jost',sans-serif", textDecoration:"underline", textUnderlineOffset:3 }}>{l}</button>
          ))}
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
                <div style={{ fontSize:20, fontWeight:400, color:"#f2ece4", marginBottom:8, fontFamily:"'Jost',sans-serif" }}>You're on the list.</div>
                <div style={{ fontSize:14, color:"#c8c0bc", marginBottom:24, lineHeight:1.6 }}>We'll email you the moment Self Hypnosis Goddess opens.</div>
                <button onClick={()=>{setWaitlistOpen(false); setWaitlistStatus("idle"); setWaitlistEmail("");}} style={{ padding:"12px 28px", background:"linear-gradient(135deg,#f5e0a0,#e8b870,#c9963a)", border:"none", borderRadius:14, color:"#000", fontSize:14, fontWeight:400, cursor:"pointer", fontFamily:"'Jost',sans-serif" }}>Close</button>
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
                    style={{ width:"100%", padding:"14px 16px", background:"#0a0a0a", border:`1.5px solid ${waitlistStatus==="error"?"#B76E79":"#2a2a2a"}`, borderRadius:12, color:"#2a1a0a", fontSize:15, fontFamily:"'Jost',sans-serif", outline:"none", marginBottom:12 }}
                  />
                  {waitlistStatus === "error" && <div style={{ fontSize:12, color:"#e8a860", marginBottom:12 }}>Please enter a valid email.</div>}
                  <button type="submit" disabled={waitlistStatus==="saving"} style={{ width:"100%", padding:"14px", background:"linear-gradient(135deg,#f5e0a0,#e8b870,#c9963a)", border:"none", borderRadius:12, color:"#000", fontSize:14, fontWeight:400, cursor:waitlistStatus==="saving"?"default":"pointer", fontFamily:"'Jost',sans-serif", opacity:waitlistStatus==="saving"?0.6:1 }}>
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
