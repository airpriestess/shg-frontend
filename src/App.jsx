import { useState, useRef, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { CSS, T } from "./design/tokens.js";
import { Btn, Card, Rings, WaveForm, Pill, Modal, FormField, Label, ProgressBar, ArrowIcon, ExternalArrowIcon } from "./components/UI.jsx";
import AudioVault from "./pages/AudioVault.jsx";
import ProofThreads from "./pages/ProofThreads.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import VaultSettings from "./pages/VaultSettings.jsx";
import ProofWall from "./pages/ProofWall.jsx";
import ListeningGuide from "./pages/ListeningGuide.jsx";
import SpotifyPortal from "./pages/SpotifyPortal.jsx";
import Legal from "./pages/Legal.jsx";
import Science from "./pages/Science.jsx";
import About from "./pages/About.jsx";
import Library from "./pages/Library.jsx";
import Events from "./pages/Events.jsx";
import Shop from "./pages/Shop.jsx";
import LuckyGirl from "./pages/LuckyGirl.jsx";
import RichGirl from "./pages/RichGirl.jsx";
import Blocks from "./pages/Blocks.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import LandingProofWall from "./components/LandingProofWall.jsx";
import CreateThreadModal from "./components/CreateThreadModal.jsx";
import { PhotoProofModal, VoiceProofModal } from "./components/ProofUpload.jsx";
import { requestNotificationPermission, scheduleReminders } from "./utils/notifications.js";
import { useAuth } from "./contexts/AuthContext.jsx";
import AuthGate from "./components/AuthGate.jsx";

const FREE_TRACK_URL = "https://shg-audio-worker.airpriestess.workers.dev/DROP%20THE%20TENSION%20HYPNOSIS%205MIN%2002.06.2026.WAV";


function PricingRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/", { replace: true });
    setTimeout(() => {
      const el = document.getElementById("pricing");
      if (el) {
        const y = el.getBoundingClientRect().top + window.pageYOffset - 40;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 300);
  }, []);
  return (
    <div style={{ minHeight:"100vh", background:"#000", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <span style={{ fontFamily:"'Jost',sans-serif", color:"#fdf0e8", fontSize:16, opacity:0.5 }}>Loading pricing…</span>
    </div>
  );
}

/* ── PROOFOS BANNER ── auto-cycling full-width step ticker ─────────────────── */
function ProofOSBanner({ isMobile }) {
  const STEPS = [
    { num:"01", label:"Set your intention", body:"Write the desire. State the old belief underneath it.", col:"#F5E0A0" },
    { num:"02", label:"Press play", body:"Theta opens. Your subconscious accepts the new identity.", col:"#E8B870" },
    { num:"03", label:"Signs arrive", body:"Synchronicities. Shifts. People change. Money moves.", col:"#BFA5D8" },
    { num:"04", label:"Log every sign", body:"Date it. Photo it. Voice note it. The evidence is real.", col:"#2CB7A7" },
    { num:"05", label:"Mark it manifested ✦", body:"It arrived. Dated. Permanent. Your Proof Wall builds.", col:"#167A6B" },
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i+1) % STEPS.length), 2800);
    return () => clearInterval(t);
  }, []);
  const s = STEPS[idx];
  return (
    <div id="proofos" style={{ background:"#000", width:"100%", paddingTop: isMobile?"48px":"64px", paddingBottom: isMobile?"48px":"64px" }}>
      {/* Heading */}
      <div style={{ textAlign:"center", marginBottom: isMobile?28:36, padding:"0 24px" }}>
        <div style={{ fontSize:11, letterSpacing:"0.28em", textTransform:"uppercase", background:"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", WebkitBackgroundClip:"text", backgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:16, fontFamily:"'Jost',sans-serif", display:"inline-block" }}>Goddess Tier ✦</div>
        <div style={{ fontSize: isMobile?"clamp(36px,9vw,52px)":"clamp(48px,5vw,68px)", fontWeight:400, color:"#f2ece4", fontFamily:"'Jost',sans-serif", letterSpacing:"-0.02em", lineHeight:1.0, marginBottom:14 }}>ProofOS.</div>
        <div style={{ fontSize: isMobile?15:18, color:"#f2ece4", fontFamily:"'Jost',sans-serif", lineHeight:1.7, maxWidth:480, margin:"0 auto" }}>
          Every desire. Every sign. Every moment it arrived. Logged, dated, permanent.
        </div>
      </div>

      {/* Full-width cycling banner */}
      <div style={{ background:"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", width:"100%", padding: isMobile?"22px 24px":"28px 48px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:24, minHeight: isMobile?90:96 }}>
        <div style={{ fontSize: isMobile?48:72, fontWeight:300, color:"rgba(0,0,0,0.35)", fontFamily:"'Jost',sans-serif", lineHeight:1, flexShrink:0, minWidth: isMobile?60:80 }}>{s.num}</div>
        <div style={{ flex:1, textAlign: isMobile?"left":"center" }}>
          <div style={{ fontSize: isMobile?"clamp(18px,5vw,26px)":"clamp(22px,2.5vw,36px)", fontWeight:400, color:"#000", fontFamily:"'Jost',sans-serif", lineHeight:1.15, marginBottom:6 }}>{s.label}</div>
          <div style={{ fontSize: isMobile?13:16, color:"rgba(0,0,0,0.6)", fontFamily:"'Jost',sans-serif", lineHeight:1.5 }}>{s.body}</div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:6, flexShrink:0 }}>
          {STEPS.map((_,i)=>(
            <div key={i} onClick={()=>setIdx(i)} style={{ width:6, height: i===idx?24:6, borderRadius:3, background: i===idx?"rgba(0,0,0,0.5)":"rgba(0,0,0,0.2)", cursor:"pointer", transition:"height 0.3s" }}/>
          ))}
        </div>
      </div>

      {/* Step pills */}
      <div style={{ display:"flex", justifyContent:"center", gap: isMobile?6:12, marginTop:20, padding:"0 24px", flexWrap:"wrap" }}>
        {STEPS.map((st,i)=>(
          <button key={i} onClick={()=>setIdx(i)} style={{ padding: isMobile?"6px 12px":"8px 18px", borderRadius:20, border:"none", background: i===idx?"linear-gradient(135deg,#F5E0A0,#E8B870,#BFA5D8,#2CB7A7,#167A6B)":"rgba(255,255,255,0.06)", color: i===idx?"#000":"rgba(242,236,228,0.4)", fontSize: isMobile?11:13, fontFamily:"'Jost',sans-serif", cursor:"pointer", fontWeight: i===idx?500:400, transition:"all 0.2s" }}>
            {st.num} {st.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── LIBRARY BANNER ────────────────────────────────────────────────────────── */
function LibraryBanner({ isMobile, onLegal }) {
  const LGb = "linear-gradient(135deg,#F5E0A0,#E8B870,#BFA5D8,#2CB7A7,#167A6B)";
  const CATS = [
    { name:"Lovemaxxing",       affirmation:"He chooses me. Every time. Obviously.",              col:"#F5E0A0",
      icon:<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M30 52 C14 42 10 30 18 24 C24 19 30 23 30 30 C30 23 36 19 42 24 C50 30 46 42 30 52 Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/></svg> },
    { name:"Richgirlmaxxing",      affirmation:"Money finds me first. Of course it does.",            col:"#E8B870",
      icon:<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="30" r="17" stroke="currentColor" strokeWidth="3"/><path d="M30 20 L30 40 M25 24 Q25 20 30 20 Q35 20 35 24 Q35 28 30 28 Q25 28 25 32 Q25 36 30 36 Q35 36 35 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg> },
    { name:"Beautymaxxing",     affirmation:"Gorgeous is my default. Always has been.",           col:"#BFA5D8",
      icon:<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M30 20 C24 20 20 24 20 29 C20 33 23 36 27 36 C24 38 23 42 25 46 C22 44 20 40 21 35 C16 34 13 30 13 25 C13 19 18 14 24 14 C27 14 29 16 30 17 C31 16 33 14 36 14 C42 14 47 19 47 25 C47 30 44 34 39 35 C40 40 38 44 35 46 C37 42 36 38 33 36 C37 36 40 33 40 29 C40 24 36 20 30 20 Z" fill="currentColor" opacity="0.85"/></svg> },
    { name:"Businessmaxxing",   affirmation:"The empire is already built in my mind.",             col:"#2CB7A7",
      icon:<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="14" y="24" width="32" height="20" rx="3" stroke="currentColor" strokeWidth="3"/><path d="M22 24 L22 18 Q22 15 25 15 L35 15 Q38 15 38 18 L38 24" stroke="currentColor" strokeWidth="3"/></svg> },
    { name:"DNAmaxxing",        affirmation:"My cells hold my new identity. It is done.",          col:"#167A6B",
      icon:<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 12 Q30 20 20 28 Q10 36 20 44 Q30 52 20 48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><path d="M40 12 Q30 20 40 28 Q50 36 40 44 Q30 52 40 48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><path d="M18 22 L42 22 M16 30 L44 30 M18 38 L42 38" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/></svg> },
    { name:"Selfmaxxing",       affirmation:"I am the upgraded version. She is here now.",         col:"#F5E0A0",
      icon:<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="30" r="18" stroke="currentColor" strokeWidth="2" opacity="0.4"/><circle cx="30" cy="30" r="8" fill="currentColor"/></svg> },
    { name:"Luckygirlmaxxing",  affirmation:"Everything works out for me. It always does.",        col:"#E8B870",
      icon:<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M30 12 L36 24 L48 26 L39 34 L42 46 L30 40 L18 46 L21 34 L12 26 L24 24 Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/></svg> },
    { name:"Sleepmaxxing",      affirmation:"I manifest while I sleep. Obviously.",                col:"#BFA5D8",
      icon:<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M38 16 A16 16 0 1 0 38 44 A12 12 0 0 1 38 16" fill="currentColor"/></svg> },
    { name:"Skinnymaxxing",     affirmation:"My body reflects my beliefs. Effortlessly.",          col:"#2CB7A7",
      icon:<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 14 Q30 10 38 14 L36 26 Q30 22 24 26 Z" stroke="currentColor" strokeWidth="2.5"/><path d="M24 26 Q22 38 26 48 L34 48 Q38 38 36 26" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg> },
    { name:"Desiresmaxxing",    affirmation:"My desires arrive. Constantly. Effortlessly.",        col:"#167A6B",
      icon:<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 44 L16 32 L24 32 L24 44 M28 44 L28 24 L36 24 L36 44 M40 44 L40 16 L48 16 L48 44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { name:"Sovereignmaxxing",  affirmation:"I answer to no one. I choose everything.",            col:"#F5E0A0",
      icon:<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 40 L14 24 L22 32 L30 16 L38 32 L46 24 L46 40 Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"/></svg> },
    { name:"Confidencemaxxing", affirmation:"I walk in like I already own the room.",              col:"#E8B870",
      icon:<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="20" r="8" stroke="currentColor" strokeWidth="2.5"/><path d="M16 46 Q16 34 30 34 Q44 34 44 46" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg> },
    { name:"Peacemaxxing",      affirmation:"Nothing rattles me. I am permanently calm.",          col:"#BFA5D8",
      icon:<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="30" r="16" stroke="currentColor" strokeWidth="2.5"/><path d="M30 14 L30 46 M16 38 L44 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg> },
    { name:"Bodymaxxing",       affirmation:"The body that makes a room stop. Mine.",              col:"#2CB7A7",
      icon:<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="14" r="6" stroke="currentColor" strokeWidth="2.5"/><path d="M30 20 L30 38 M20 26 L40 26 M30 38 L22 50 M30 38 L38 50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg> },
    { name:"Wellnessmaxxing",   affirmation:"My body and mind are finally in sync.",               col:"#167A6B",
      icon:<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M30 46 C16 36 12 24 20 18 C25 14 30 18 30 24 C30 18 35 14 40 18 C48 24 44 36 30 46 Z" stroke="currentColor" strokeWidth="2.5"/><path d="M22 26 L27 26 L29 20 L32 32 L34 26 L38 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
    { name:"Healthmaxxing",       affirmation:"Pain is leaving my body. For good.",                  col:"#F5E0A0",
      icon:<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 30 L28 30 L30 24 L32 36 L34 30 L38 30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><rect x="12" y="16" width="36" height="28" rx="8" stroke="currentColor" strokeWidth="2.5"/></svg> },
    { name:"Studymaxxing",      affirmation:"My mind absorbs everything. Effortlessly.",           col:"#E8B870",
      icon:<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 22 L30 14 L46 22 L30 30 Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/><path d="M22 26 L22 36 Q30 40 38 36 L38 26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg> },
    { name:"Intuitionmaxxing",  affirmation:"My gut is always right. I trust it completely.",      col:"#BFA5D8",
      icon:<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="30" r="16" stroke="currentColor" strokeWidth="2" opacity="0.35"/><circle cx="30" cy="30" r="9" stroke="currentColor" strokeWidth="2.5"/><circle cx="30" cy="30" r="3" fill="currentColor"/></svg> },
    { name:"Friendmaxxing",     affirmation:"My circle actually deserves me. Finally.",            col:"#2CB7A7",
      icon:<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="22" cy="24" r="7" stroke="currentColor" strokeWidth="2.5"/><circle cx="38" cy="24" r="7" stroke="currentColor" strokeWidth="2.5"/><path d="M12 44 Q12 34 22 34 Q26 34 28 37 Q30 34 34 34 Q44 34 44 44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg> },
    { name:"Stylemaxxing",      affirmation:"Dressed like the girl who already made it.",          col:"#167A6B",
      icon:<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 16 L26 20 L30 16 L34 20 L38 16 L38 22 L34 24 L34 46 L26 46 L26 24 L22 22 Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"/></svg> },
    { name:"Erosmaxxing",       affirmation:"I am magnetic enough to stop a room.",                col:"#F5E0A0",
      icon:<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M30 46 C30 46 14 36 14 22 C14 15 20 12 25 15 C28 17 30 21 30 21 C30 21 32 17 35 15 C40 12 46 15 46 22 C46 36 30 46 30 46 Z" fill="currentColor" opacity="0.85"/></svg> },
    { name:"Singlemaxxing",     affirmation:"Too full of myself to settle. Obviously.",            col:"#E8B870",
      icon:<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="22" r="10" stroke="currentColor" strokeWidth="2.5"/><path d="M30 32 L30 48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><circle cx="30" cy="22" r="3" fill="currentColor"/></svg> },
    { name:"Lifemaxxing",       affirmation:"Every area of my life is upgrading at once.",         col:"#BFA5D8",
      icon:<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="30" r="10" fill="currentColor"/><path d="M30 10 L30 4 M30 56 L30 50 M10 30 L4 30 M56 30 L50 30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg> },
    { name:"Facemaxxing",       affirmation:"My skin is porcelain. Everyone notices.",             col:"#2CB7A7",
      icon:<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="30" rx="16" ry="20" stroke="currentColor" strokeWidth="2.5"/><circle cx="24" cy="26" r="2" fill="currentColor"/><circle cx="36" cy="26" r="2" fill="currentColor"/><path d="M24 38 Q30 42 36 38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg> },
  ];

  const [idx, setIdx] = useState(0);
  const intervalRef = useRef(null);

  const startTimer = () => {
    intervalRef.current = setInterval(() => setIdx(i => (i + 1) % CATS.length), 2800);
  };
  const stopTimer = () => clearInterval(intervalRef.current);

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, []);

  const cat = CATS[idx];

  return (
    <div>
      {/* Full-width cycling banner */}
      <div
        onMouseEnter={stopTimer}
        onMouseLeave={startTimer}
        onTouchStart={stopTimer}
        onTouchEnd={startTimer}
        style={{ width:"100%", padding: isMobile?"32px 24px":"48px 64px", background:LGb, display:"flex", alignItems:"center", justifyContent:"center", gap: isMobile?20:48, minHeight: isMobile?140:160, cursor:"pointer" }}
      >
        {/* Text, centered, black on Lucky Girl gradient background */}
        <div style={{ flex:1, maxWidth:720, textAlign:"center" }}>
          <div style={{ fontSize: isMobile?11:12, fontWeight:400, letterSpacing:"0.22em", textTransform:"uppercase", color:"#000", fontFamily:"'Jost',sans-serif", marginBottom:8 }}>{cat.name}</div>
          <div style={{ fontSize: isMobile?"clamp(20px,5.5vw,28px)":"clamp(24px,2.5vw,36px)", fontWeight:400, color:"#000", fontFamily:"'Jost',sans-serif", lineHeight:1.2, letterSpacing:"-0.01em" }}>{cat.affirmation}</div>
        </div>

        {/* Progress dots */}
        <div style={{ display:"flex", flexDirection:"column", gap:5, flexShrink:0 }}>
          {CATS.map((_,i) => (
            <div key={i} onClick={()=>setIdx(i)} style={{ width:4, height: i===idx?18:4, borderRadius:2, background: i===idx?"#000":"rgba(0,0,0,0.2)", cursor:"pointer", transition:"height 0.3s, background 0.4s" }}/>
          ))}
        </div>
      </div>

      {/* Category pills, alternate black and cream */}
      <div style={{ display:"flex", justifyContent:"center", gap:8, padding: isMobile?"14px 16px":"16px 24px", flexWrap:"wrap", background:"#000", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        {CATS.map((ct,i) => {
          const isActive = i === idx;
          const isEven = i % 2 === 0;
          const idleBg = isEven ? "#000" : "#f2ece4";
          const idleColor = isEven ? "rgba(242,236,228,0.5)" : "rgba(0,0,0,0.5)";
          return (
            <button key={i} onClick={()=>setIdx(i)} style={{ padding: isMobile?"6px 14px":"7px 18px", borderRadius:20, border: isActive?"none":`1px solid ${isEven?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.1)"}`, background: isActive?LGb:idleBg, color: isActive?"#000":idleColor, fontSize: isMobile?12:13, fontFamily:"'Jost',sans-serif", cursor:"pointer", fontWeight:400, transition:"all 0.25s", whiteSpace:"nowrap" }}>
              {ct.name}
            </button>
          );
        })}
      </div>

      {/* CTA */}
      <div style={{ textAlign:"center", padding:"28px 24px 0", background:"#000" }}>
        <button onClick={()=>onLegal&&onLegal("library")} style={{ background:LGb, border:"none", borderRadius:40, padding: isMobile?"16px 40px":"18px 52px", color:"#000", fontSize: isMobile?15:17, fontFamily:"'Jost',sans-serif", fontWeight:400, cursor:"pointer" }}>
          Explore the full library
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const authCtx = useAuth();
  const { isAuthenticated, profile } = authCtx;
  const navigate = useNavigate();
  const location = useLocation();
  const [legalPage, setLegalPage] = useState("tos");
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
    navigate("/portal");
    setPortalTab("dashboard");
    // Request notification permission and schedule reminders
    try {
      const perm = await requestNotificationPermission();
      if (perm === "granted") scheduleReminders();
    } catch(e) { /* silent, notifications not critical */ }
  };
  const openCreateThread = (audioId) => { setPreselectedAudioId(audioId || null); setCreateThreadModal(true); };
  const openAddProof = (type, threadId) => { setAddProofType(type); setAddProofThreadId(threadId || null); };
  const playAudio = (a) => { setCurrentAudio(a); setPlayingId(a.id); };
  const goTab = (tab) => setPortalTab(tab);

  return (
    <>
      <style>{CSS}</style>
<Routes>
        <Route path="/" element={<><Landing onJoin={() => setCheckoutModal(true)} onDemo={() => goPortal("goddess")} onSignIn={() => navigate("/auth")} onLegal={(p)=>navigate("/"+p)}/>{checkoutModal && <CheckoutModal onClose={() => setCheckoutModal(false)} onDemo={() => { setCheckoutModal(false); goPortal("goddess"); }} />}</>} />
        <Route path="/shop" element={<Shop/>} />
        <Route path="/pricing" element={<PricingRedirect/>} />
        <Route path="/about"   element={<About   onBack={()=>navigate("/")}/>} />
        <Route path="/library" element={<Library onBack={()=>navigate("/")}/>} />
        <Route path="/science" element={<Science  onBack={()=>navigate("/")}/>} />
        <Route path="/events"  element={<Events/>} />

        <Route path="/luckygirl" element={<LuckyGirl/>} />
        <Route path="/richgirl" element={<RichGirl/>} />
        <Route path="/guide/richgirl" element={<RichGirl/>} />
        <Route path="/blocks" element={<><script dangerouslySetInnerHTML={{__html:"window.location.replace('/blocks')"}} /></>} />

        <Route path="/tos"     element={<Legal page="tos"     onBack={()=>navigate("/")}/>} />
        <Route path="/privacy" element={<Legal page="privacy" onBack={()=>navigate("/")}/>} />
        <Route path="/refunds" element={<Legal page="refunds" onBack={()=>navigate("/")}/>} />
        <Route path="/auth"    element={<AuthGate onSuccess={() => goPortal()} />} />
        <Route path="/portal"  element={
          authCtx.loading
            ? <div style={{minHeight:"100vh",background:"#000",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <img src="/logo_transparent_cropped.png" alt="Self Hypnosis Goddess" width="38" height="38" style={{flexShrink:0, objectFit:"contain", display:"block"}} />
                  <span style={{fontFamily:"'Jost',sans-serif",fontWeight:300,fontSize:"clamp(11px,3.2vw,14px)",color:"#f2ece4",letterSpacing:"0.02em"}}>Self Hypnosis Goddess</span>
                </div>
              </div>
            : <ErrorBoundary><SpotifyPortal onHome={() => navigate("/")} onSignOut={() => { authCtx.signOut(); navigate("/"); }} isPreview={new URLSearchParams(window.location.search).get("preview")==="1" ? true : (!authCtx.isAuthenticated ? true : undefined)} initialTab={new URLSearchParams(window.location.search).get("tab") || "home"} forceTheme={new URLSearchParams(window.location.search).get("theme") || null} userTier={profile?.tier || (authCtx.isAuthenticated ? "audio" : userTier)} userName={authCtx.user?.full_name || authCtx.user?.email?.split("@")[0] || "you"} /></ErrorBoundary>
        } />
        <Route path="/waitlist" element={<Landing forceWaitlist={true} onJoin={()=>setCheckoutModal(true)} onDemo={()=>goPortal("goddess")} onSignIn={()=>navigate("/auth")} onLegal={(p)=>navigate("/"+p)} />} />
        <Route path="*" element={<Landing onJoin={() => setCheckoutModal(true)} onDemo={() => goPortal("goddess")} onSignIn={() => navigate("/auth")} onLegal={(p)=>navigate("/"+p)}/>} />
      </Routes>
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
    { id: "proof-threads", icon: "🧵", label: "Proof Wall" },
    { id: "proof-wall", icon: "📷", label: "Proof Wall" },
    { id: "listening-guide", icon: "📖", label: "Listening Guide" },
    { id: "vault-settings", icon: "⚙", label: "Vault Settings" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      {/* TOP NAV */}
      <header style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", background: "rgba(0,0,0,0.96)", borderBottom: "1px solid #1c1828", flexShrink: 0, zIndex: 50 }}>
        <button onClick={onSignOut} style={{ background: "none", border: "none", cursor: "pointer" }} title="Back to homepage">
          <span style={{ fontFamily:"'Jost',sans-serif", fontSize: "clamp(11px,3.2vw,14px)", fontWeight: 300, cursor: "pointer", letterSpacing: "0.02em", color:"#f2ece4" }} onClick={() => window.scrollTo({top:0,behavior:"smooth"})}>Self Hypnosis Goddess</span>
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
            <div style={{ height: 60, background: "rgba(0,0,0,0.97)", borderTop: "1px solid #2CB7A733", display: "flex", alignItems: "center", padding: "0 20px", gap: 16, flexShrink: 0 }}>
              <WaveForm playing color={T.champagne} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#2CB7A7", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentAudio.title}</div>
                <div style={{ fontSize: 12, color: "#ddd0c8" }}>{(currentAudio.audioFormats || []).join(' · ')}{currentAudio.frequency ? ` · ${currentAudio.frequency}` : ''}</div>
              </div>
              <button onClick={onStopPlay} style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${T.blood}, ${T.rose})`, border: "none", color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>⏸</button>
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
      <h1 style={{ fontSize: 28, fontWeight: 400, color: "#000000", marginBottom: 8 }}>Manifested Archive</h1>
      <p style={{ fontSize: 19, color: "#000000", marginBottom: 24 }}>Every completed intention lives here. Your permanent Proof Wall.</p>
      <div style={{ textAlign: "center", padding: "60px 24px" }}>
        <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.4 }}>✦</div>
        <div style={{ fontSize: 18, color: "#000000" }}>Manifested threads will appear here.</div>
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

// ═══ SINGLE SOURCE OF TRUTH, every price, feature list, CTA everywhere reads from here ═══
const TIERS = {
  audio: {
    name: "Audio Tier", emoji: "🔊",
    monthly: "$49", annual: "$470", annualPerMonth: "$39", annualNote: "$470 billed annually",
    usd: "$49/mo", usdAnnual: "$470/yr",
    features: ["Full exclusive audio vault","All 6 formats, Melodic House, Voice Only, Sleep & Rest, Subliminal, EMDR, Binaural","Loop player + sleep timer","New tracks every week","All desire categories","No ads. Ever."],
    cta: (annual)=> annual ? "Join Audio, $39/month" : "Join Audio, $49/month",
  },
  goddess: {
    name: "Goddess Tier", emoji: "✦",
    monthly: "$79", annual: "$758", annualPerMonth: "$63", annualNote: "$758 billed annually",
    usd: "$79/mo", usdAnnual: "$758/yr",
    features: ["Everything in Audio Tier","ProofOS, manifestation tracker for life ✦","Signs & synchronicity log on every desire","Your Proof Wall, every win, forever","Early access drops, 48hrs ahead","Analytics board, watch your evidence build"],
    cta: (annual)=> annual ? "Activate Goddess, $63/month" : "Activate Goddess Tier, $79/month",
  },
  lifetime: {
    name: "Lifetime Access", emoji: "♾",
    monthly: "$1000", annual: "$1000", annualNote: "One payment. Forever.",
    usd: "$1000", usdAnnual: "$1000",
    features: ["Everything in Goddess Tier","Every future audio ever released","Every future feature, included","No monthly billing, ever","1,000 spots only"],
    cta: ()=> "Claim Lifetime Access, $1000",
  },
};

function CheckoutModal({ onClose, onDemo }) {
  const theme = "dark";
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
        <div style={{background:"linear-gradient(135deg,rgba(191,165,216,0.08),rgba(44,183,167,0.08))",padding:"28px 24px 20px",borderRadius:"24px 24px 0 0"}}>
          <div style={{fontFamily:"'Jost',sans-serif",fontSize:10,color:"#2CB7A7",letterSpacing:"0.28em",textTransform:"uppercase",fontWeight:400,marginBottom:8}}>Start your shift today</div>
          <h3 style={{fontFamily:"'Jost',sans-serif",fontSize:"clamp(22px,4vw,30px)",color:"#1a1218",fontWeight:400,lineHeight:1.2,marginBottom:4,textAlign:"center"}}>Choose your membership.</h3>
          <p style={{fontSize:13,color:"#2a2a2a",lineHeight:1.5,marginBottom:16}}>Full access from day one. No downloads needed.</p>

          {/* MONTHLY / ANNUAL TOGGLE */}
          <div style={{display:"flex",background:"rgba(0,0,0,0.06)",borderRadius:50,padding:3,width:"fit-content"}}>
            {["monthly","annual"].map(b => (
              <button key={b} onClick={()=>setBilling(b)} style={{
                padding:"8px 20px",borderRadius:50,border:"none",cursor:"pointer",
                fontSize:12,fontWeight:400,letterSpacing:"0.06em",textTransform:"uppercase",
                background:billing===b?"#fff":"transparent",
                color:billing===b?"#2CB7A7":"#888888",
                boxShadow:billing===b?"0 2px 8px rgba(0,0,0,0.12)":"none",
                transition:"all 0.2s",display:"flex",alignItems:"center",gap:6
              }}>
                {b==="monthly"?"Monthly":<><span>Annual</span><span style={{background:"linear-gradient(90deg,#2CB7A7,#2CB7A7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontSize:10,fontWeight:700}}>SAVE 20%</span></>}
              </button>
            ))}
          </div>
          {isAnnual && <div style={{marginTop:10,fontSize:12,color:"#167A6B",background:"rgba(44,183,167,0.1)",borderRadius:8,padding:"6px 12px",lineHeight:1.5}}>⚠ Annual plans are paid upfront and <strong>cannot be cancelled</strong> once purchased.</div>}
        </div>

        <div style={{padding:"20px 24px 28px",display:"flex",flexDirection:"column",gap:12,overflow:"visible"}}>

          {/* AUDIO TIER */}
          <div style={{background:"linear-gradient(135deg,#0a1a18,#0d2825)",border:"1.5px solid #2CB7A755",borderRadius:16,padding:"18px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div>
                <div style={{fontSize:16,fontWeight:400,color:"#000000",marginBottom:2}}>Audio Tier</div>
                <div style={{fontSize:11,color:"#8a7268",fontWeight:400,letterSpacing:"0.06em"}}>The full vault</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:26,fontWeight:400,color:"#2CB7A7",lineHeight:1}}>{isAnnual?TIERS.audio.annualPerMonth:TIERS.audio.monthly}</div>
                <div style={{fontSize:11,color:"#2CB7A7"}}>/month</div>
                {isAnnual && <div style={{fontSize:10,color:"#2CB7A7"}}>{TIERS.audio.annualNote}</div>}
                <div style={{fontSize:9,fontWeight:500,color:"#E8B870",letterSpacing:"0.1em",marginTop:4,textTransform:"uppercase"}}>Coming Soon</div>
              </div>
            </div>
            <div style={{marginBottom:12}}>
              {["Full audio vault, all desire categories","New tracks every week","Loop player · sleep timer · background play","Sleep subliminals · binaural · Reiki frequencies","No ads. Ever."].map((f,i)=>(
                <div key={i} style={{fontSize:12,color:"#000000",marginBottom:5,paddingLeft:12,position:"relative",lineHeight:1.5}}>
                  <span style={{position:"absolute",left:0,color:"#2CB7A7"}}>·</span>{f}
                </div>
              ))}
            </div>
            <button onClick={()=>goStripe("audio")} className="cta-shake" style={{width:"100%",padding:"12px",background:"linear-gradient(135deg,#E8B870,#2CB7A7)",border:"none",borderRadius:10,color:"#000",fontSize:13,fontWeight:400,cursor:"pointer",fontFamily:"'Jost',sans-serif",letterSpacing:"0.04em",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:7}}>
              {TIERS.audio.cta(isAnnual)}<ArrowIcon/>
            </button>
          </div>

          {/* GODDESS TIER */}
          <div style={{background:"linear-gradient(135deg,#0a1a18,#0d2825)",border:"2px solid #2CB7A7",borderRadius:16,padding:"28px 18px 18px",marginTop:52,position:"relative",overflow:"visible"}}>
            <div style={{position:"absolute",top:-16,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)",borderRadius:20,padding:"5px 18px",fontSize:10,fontWeight:500,color:"#000",letterSpacing:"0.12em",whiteSpace:"nowrap",zIndex:10}}>✦ MOST POPULAR</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,marginTop:18}}>
              <div>
                <div style={{fontSize:16,fontWeight:400,color:"#2CB7A7",marginBottom:2}}>Goddess Tier</div>
                <div style={{fontSize:11,color:"#2CB7A7",fontWeight:400,letterSpacing:"0.06em"}}>Everything + ProofOS ✦</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:26,fontWeight:400,color:"#2CB7A7",lineHeight:1}}>{isAnnual?TIERS.goddess.annualPerMonth:TIERS.goddess.monthly}</div>
                <div style={{fontSize:11,color:"#2CB7A7"}}>/month</div>
                {isAnnual && <div style={{fontSize:10,color:"#c08090"}}>{TIERS.goddess.annualNote}</div>}
                <div style={{fontSize:9,fontWeight:500,color:"#F5E0A0",letterSpacing:"0.1em",marginTop:4,textTransform:"uppercase"}}>Coming Soon</div>
              </div>
            </div>
            <div style={{marginBottom:12}}>
              {["Everything in Audio Tier","ProofOS manifestation tracker ✦","Log intentions · link audios · capture every sign","Early access drops, 48hrs before everyone","Monthly ritual audio included"].map((f,i)=>(
                <div key={i} style={{fontSize:12,color:f.includes("✦")?"#2CB7A7":"#167A6B",marginBottom:5,paddingLeft:12,position:"relative",lineHeight:1.5,fontWeight:f.includes("✦")?700:400}}>
                  <span style={{position:"absolute",left:0,color:"#2CB7A7"}}>·</span>{f}
                </div>
              ))}
            </div>
            <button onClick={()=>goStripe("goddess")} className="cta-shake" style={{width:"100%",padding:"14px",background:"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)",border:"none",borderRadius:10,color:"#000",fontSize:13,fontWeight:400,cursor:"pointer",fontFamily:"'Jost',sans-serif",boxShadow:"0 4px 20px rgba(44,183,167,0.4)",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:7}}>
              {TIERS.goddess.cta(isAnnual)}<ArrowIcon/>
            </button>
          </div>

          {/* LIFETIME */}
          <div style={{background:"#000",border:"1.5px solid #E8B87066",borderRadius:16,padding:"18px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div>
                <div style={{fontSize:16,fontWeight:400,color:"#F5E0A0",marginBottom:2}}>Lifetime Access</div>
                <div style={{fontSize:11,color:"#2CB7A7",fontWeight:400,letterSpacing:"0.06em"}}>Once. Forever.</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:26,fontWeight:400,color:"#F5E0A0",lineHeight:1}}>{TIERS.lifetime.monthly}</div>
                <div style={{fontSize:11,color:"#2CB7A7"}}>one time</div>
                <div style={{fontSize:9,fontWeight:500,color:"#F5E0A0",letterSpacing:"0.1em",marginTop:4,textTransform:"uppercase"}}>Coming Soon</div>
              </div>
            </div>
            <div style={{marginBottom:12}}>
              {["Full vault + ProofOS for life","Every future audio ever released","Every future feature · No subscription","1,000 spots only"].map((f,i)=>(
                <div key={i} style={{fontSize:12,color:theme==="dark"?"#e8e0d8":"#000000",marginBottom:5,paddingLeft:12,position:"relative",lineHeight:1.5}}>
                  <span style={{position:"absolute",left:0,color:"#2CB7A7"}}>·</span>{f}
                </div>
              ))}
            </div>
            <button onClick={()=>goStripe("lifetime")} className="cta-shake" style={{width:"100%",padding:"12px",background:"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)",border:"none",borderRadius:10,color:"#000",fontSize:13,fontWeight:400,cursor:"pointer",fontFamily:"'Jost',sans-serif",boxShadow:"0 4px 20px rgba(44,183,167,0.25)",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:7}}>{TIERS.lifetime.cta()}<ArrowIcon/></button>
          </div>

          <button onClick={onDemo} style={{background:"none",border:"none",color:"#2CB7A7",fontSize:13,cursor:"pointer",textDecoration:"underline",fontFamily:"'Jost',sans-serif",padding:"4px 0"}}>👁 Preview the portal first, no signup needed</button>
          <div style={{textAlign:"center",fontSize:11,color:"#a0909a",lineHeight:1.7}}>Monthly: cancel anytime · Annual: non-refundable, paid upfront · Stripe secure checkout</div>
        </div>
      </div>
    </div>
  );
}


/* ── PRICING SECTION, lives on the page itself, not just inside the modal ──── */
function PricingSection({ onJoin }) {
  const isMobile = useMobile();
  const theme = "dark";
  const [billing, setBilling] = useState("monthly");
  const isAnnual = billing === "annual";
  const goStripe = (tier) => {
    const key = isAnnual && tier !== "lifetime" ? tier + "_annual" : tier;
    window.open(STRIPE[key] || STRIPE[tier], "_blank");
  };

  const cards = [
    { id: "audio",    name: TIERS.audio.name,    price: isAnnual ? TIERS.audio.annualPerMonth    : TIERS.audio.monthly,    note: isAnnual ? TIERS.audio.annualNote : null,                              features: TIERS.audio.features,    cta: TIERS.audio.cta(isAnnual),    bg: "#111",  border: "rgba(44,183,167,0.2)",  nameColor: "#f2ece4", muteColor: theme==="dark"?"#e8e0d8":"#000000", priceColor: "#2CB7A7", periodColor: theme==="dark"?"#e8e0d8":"#000000", featureColor: "#ddd0c8", dot: "#2CB7A7", ctaBg: "linear-gradient(135deg,#F5E0A0 0%,#BFA5D8 52%,#2CB7A7 100%)", ctaColor: "#000" },
    { id: "goddess",  name: TIERS.goddess.name,  price: isAnnual ? TIERS.goddess.annualPerMonth  : TIERS.goddess.monthly,  note: isAnnual ? TIERS.goddess.annualNote : null,          features: TIERS.goddess.features,  cta: TIERS.goddess.cta(isAnnual),  bg: "#000",  border: "rgba(44,183,167,0.5)",  nameColor: "#f2ece4", muteColor: "#2CB7A7", priceColor: "#2CB7A7", periodColor: theme==="dark"?"#e8e0d8":"#000000", featureColor: "#ddd0c8", dot: "#2CB7A7", ctaBg: "linear-gradient(135deg,#F5E0A0 0%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)", ctaColor: "#000", popular: true },
    { id: "lifetime", name: TIERS.lifetime.name, price: TIERS.lifetime.monthly,           note: TIERS.lifetime.annualNote,                                                     features: TIERS.lifetime.features, cta: TIERS.lifetime.cta(),         bg: "#0a0a0a", border: "rgba(44,183,167,0.35)", nameColor: "#F5E0A0", muteColor: "#2CB7A7", priceColor: "#F5E0A0", periodColor: "#2CB7A7", featureColor: theme==="dark"?"#e8e0d8":"#000000", dot: "#2CB7A7", ctaBg: "linear-gradient(135deg,#F5E0A0 0%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)", ctaColor: "#000" },
  ];

  return (
    <div id="pricing" style={{ padding: isMobile ? "56px 18px" : "80px 24px", background: "#000", width: "100%", scrollMarginTop: isMobile ? 24 : 0 }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 400, color: theme==="dark"?"#e8e0d8":"#000000", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 14, fontFamily: "'Jost',sans-serif" }}>Choose your membership</div>
          <h2 style={{ fontFamily: "'Jost',sans-serif", fontSize: isMobile ? "clamp(28px,8vw,40px)" : "clamp(32px,4vw,48px)", fontWeight: 400, color: "#f2ece4", lineHeight: 1.1, letterSpacing: "-0.01em" }}>
            Full access. No download needed.
          </h2>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 36 }}>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.07)", borderRadius: 50, padding: 3, border: "1px solid rgba(255,255,255,0.1)" }}>
            {["monthly", "annual"].map(b => (
              <button key={b} onClick={() => setBilling(b)} style={{
                padding: "9px 24px", borderRadius: 50, border: "none", cursor: "pointer",
                fontSize: 12, fontWeight: 400, letterSpacing: "0.06em",
                background: billing === b ? "#f2ece4" : "transparent",
                color: billing === b ? "#000" : theme==="dark"?"#e8e0d8":"#000000",
                fontFamily: "'Jost',sans-serif", display: "flex", alignItems: "center", gap: 8,
                transition: "all 0.2s",
              }}>
                {b === "monthly" ? "Monthly" : <><span>Annual</span><span style={{ fontSize: 10, color: billing === b ? "#2CB7A7" : "#2CB7A7", letterSpacing: "0.1em" }}>SAVE 20%</span></>}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: isMobile ? 52 : 16, overflow: "visible", paddingTop: isMobile ? 8 : 0 }}>
          {cards.map(c => (
            <div key={c.id} style={{ background: c.bg, border: `${c.popular ? "2px" : "1px"} solid ${c.border}`, borderRadius: 20, padding: c.popular ? (isMobile ? "64px 20px 28px" : "56px 24px 28px") : "28px 20px", marginTop: isMobile ? (c.popular ? 20 : 0) : (c.popular ? -12 : 0), position: "relative", overflow: "visible", boxShadow: c.popular ? "0 0 40px rgba(44,183,167,0.2)" : "none" }}>
              {c.popular && <div style={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", color: "#000", fontSize: 10, fontWeight: 500, padding: "6px 20px", borderRadius: 20, letterSpacing: "0.14em", whiteSpace: "nowrap", fontFamily: "'Jost',sans-serif", textTransform: "uppercase", zIndex: 10 }}>✦ Most Popular</div>}
              <div style={{ fontSize: 13, fontWeight: 400, color: c.muteColor, marginBottom: 6, fontFamily: "'Jost',sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>{c.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                <span style={{ fontSize: 52, fontWeight: 400, background: "linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "'Jost',sans-serif", display: "inline-block" }}>{c.price}</span>
                <span style={{ fontSize: 13, color: c.periodColor, fontFamily: "'Jost',sans-serif" }}>{c.id === "lifetime" ? " one time" : "/month"}</span>
              </div>
              <div style={{ fontSize: 10, fontWeight: 500, color: "#E8B870", letterSpacing: "0.1em", marginBottom: 8, fontFamily: "'Jost',sans-serif", textTransform: "uppercase" }}>Coming Soon</div>
              {c.note && <div style={{ fontSize: 11, color: c.muteColor, marginBottom: 20, fontFamily: "'Jost',sans-serif" }}>{c.note}</div>}
              {!c.note && <div style={{ marginBottom: 20 }} />}
              <div style={{ marginBottom: 24, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
                {c.features.map((f, i) => (
                  <div key={i} style={{ fontSize: 13, color: f.includes("✦") ? c.dot : c.featureColor, marginBottom: 9, paddingLeft: 16, position: "relative", lineHeight: 1.5, fontFamily: "'Jost',sans-serif", fontWeight: 400 }}>
                    <span style={{ position: "absolute", left: 0, color: c.dot }}>·</span>{f}
                  </div>
                ))}
              </div>
              <button onClick={() => goStripe(c.id)} style={{ width: "100%", padding: "14px", background: c.ctaBg, border: "none", borderRadius: 12, color: c.ctaColor, fontSize: 13, fontWeight: 400, cursor: "pointer", fontFamily: "'Jost',sans-serif", letterSpacing: "0.08em", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                {c.cta}<ArrowIcon size={12} />
              </button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 28, textAlign: "center", fontSize: 12, color: theme==="dark"?"#e8e0d8":"#000000", lineHeight: 1.9, fontFamily: "'Jost',sans-serif" }}>
          Monthly: cancel anytime · Annual: paid upfront · Stripe secure checkout<br />
          No app to download, works in any browser, iPhone, Android
        </div>

        {/* THE GUARANTEE */}
        <div style={{ marginTop: 64, padding: isMobile ? "48px 24px" : "72px 56px", borderRadius: 24, background: "linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", textAlign: "center", maxWidth: 820, marginLeft: "auto", marginRight: "auto" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "#000", opacity: 0.6, marginBottom: 24, fontFamily: "'Jost',sans-serif", fontWeight: 500 }}>The Guarantee</div>
          <div style={{ fontFamily: "'Jost',sans-serif", fontSize: isMobile ? "clamp(22px,6vw,30px)" : "clamp(26px,3vw,38px)", fontWeight: 400, color: "#000", lineHeight: 1.5, letterSpacing: "-0.01em" }}>
            What I promise:<br/><br/>
            A brain rewired to expect your desired outcome.<br/><br/>
            Belief that things work out for you, even when the evidence hasn't arrived yet.<br/><br/>
            Assumptions rewired. Mood rewired. Identity rewired. Reality shifted.<br/><br/>
            That's manifestation.
          </div>
        </div>
      </div>
    </div>
  );
}


const MARQUEE_ITEMS = [
  {t:"He texts me first. Obviously.",c:"#2CB7A7"},{t:"Money finds me first.",c:"#2CB7A7"},{t:"Gorgeous is my default.",c:"#2CB7A7"},
  {t:"My DNA is shifting. Right now.",c:"#2CB7A7"},{t:"My highest timeline. Activated.",c:"#2CB7A7"},{t:"He's obsessed. Of course he is.",c:"#2CB7A7"},
  {t:"My skin is porcelain. Always.",c:"#2CB7A7"},{t:"I shift while I sleep.",c:"#2CB7A7"},{t:"Money arrives unexpectedly.",c:"#2CB7A7"},
  {t:"My bloodline is being rewritten.",c:"#2CB7A7"},{t:"He comes back. Every time.",c:"#2CB7A7"},{t:"My waist is always snatched.",c:"#2CB7A7"},
  {t:"$10,000 months are my baseline.",c:"#2CB7A7"},{t:"I receive. Constantly. Effortlessly.",c:"#2CB7A7"},{t:"My self-concept is permanent now.",c:"#2CB7A7"},
  {t:"He can't stop thinking about me.",c:"#2CB7A7"},{t:"I am radiant without trying.",c:"#2CB7A7"},{t:"My skin glows. Everyone sees it.",c:"#2CB7A7"},
  {t:"He chose me. Again.",c:"#2CB7A7"},{t:"Abundance is my default state.",c:"#2CB7A7"},{t:"My beauty is effortless.",c:"#2CB7A7"},
  {t:"He's already mine.",c:"#2CB7A7"},{t:"Money loves me. Of course it does.",c:"#2CB7A7"},{t:"I am the woman he keeps coming back to.",c:"#2CB7A7"},
  {t:"My cells hold my new identity.",c:"#2CB7A7"},{t:"My glow is undeniable.",c:"#2CB7A7"},{t:"Six figures is just the start.",c:"#2CB7A7"},
  {t:"He finds his way back. Every time.",c:"#2CB7A7"},{t:"My subconscious knows. It delivers.",c:"#2CB7A7"},{t:"I am paid just for existing.",c:"#2CB7A7"},
  {t:"My face is symmetrical and clear.",c:"#2CB7A7"},{t:"Of course it worked out. It always does.",c:"#2CB7A7"},{t:"He's devoted. Obviously.",c:"#2CB7A7"},
  {t:"My identity upgrades in my sleep.",c:"#2CB7A7"},{t:"I am magnetic. Naturally.",c:"#2CB7A7"},{t:"My wealth expands while I sleep.",c:"#2CB7A7"},
  {t:"He reaches out first. Always.",c:"#2CB7A7"},{t:"I embody my dream self. Naturally.",c:"#2CB7A7"},{t:"My energy is intoxicating.",c:"#2CB7A7"},
  {t:"My income is limitless.",c:"#2CB7A7"},{t:"I am the upgraded version. Now.",c:"#2CB7A7"},{t:"He misses me and he's saying it.",c:"#2CB7A7"},
  {t:"My bank account grows daily.",c:"#2CB7A7"},{t:"My nervous system knows who I am.",c:"#2CB7A7"},{t:"I look better every single day.",c:"#2CB7A7"},
  {t:"Love finds me. It always does.",c:"#2CB7A7"},{t:"I am always in the right place.",c:"#2CB7A7"},{t:"My body reflects my beliefs.",c:"#2CB7A7"},
  {t:"My SP is devoted. Obviously.",c:"#2CB7A7"},{t:"The installation is complete.",c:"#2CB7A7"},{t:"I receive in my sleep. Obviously.",c:"#2CB7A7"},
  {t:"I am stunning. It's obvious.",c:"#2CB7A7"},{t:"My financial reality is effortless.",c:"#2CB7A7"},{t:"He can't get me out of his head.",c:"#2CB7A7"},
  {t:"My highest self is my only self.",c:"#2CB7A7"},{t:"People notice. They can't help it.",c:"#2CB7A7"},{t:"My lineage shifts with me.",c:"#2CB7A7"},
  {t:"I am a money magnet. Obviously.",c:"#2CB7A7"},{t:"He's on his way back. Of course.",c:"#2CB7A7"},{t:"I wake up transformed.",c:"#2CB7A7"},
  {t:"My life is effortless luxury.",c:"#2CB7A7"},{t:"My subconscious is now on my side.",c:"#2CB7A7"},{t:"My skin is flawless. Obviously.",c:"#2CB7A7"},
  {t:"Everything works out for me. Always.",c:"#2CB7A7"},{t:"He's never leaving. I'm that girl.",c:"#2CB7A7"},{t:"My DNA reflects my desires.",c:"#2CB7A7"},
  {t:"I am chosen. Every single time.",c:"#2CB7A7"},{t:"Thirty days changes everything.",c:"#2CB7A7"},{t:"My frequency is locked in.",c:"#2CB7A7"},
  {t:"I am the most beautiful version of me.",c:"#2CB7A7"},{t:"The universe is obsessed with me.",c:"#2CB7A7"},{t:"My parallel reality is now.",c:"#2CB7A7"},
  {t:"He's constantly thinking of me.",c:"#2CB7A7"},{t:"My love life is effortless.",c:"#2CB7A7"},{t:"I am on the frequency of receiving.",c:"#2CB7A7"},
  {t:"Every listen deepens the install.",c:"#2CB7A7"},{t:"I am becoming her daily.",c:"#2CB7A7"},{t:"My reality bends to my self-concept.",c:"#2CB7A7"},
  {t:"Unexpected income is normal for me.",c:"#2CB7A7"},{t:"My sleep is doing the work.",c:"#2CB7A7"},{t:"I am irresistible. Obviously.",c:"#2CB7A7"},
  {t:"He comes back. Of course he does.",c:"#2CB7A7"},{t:"I exist on the frequency of abundance.",c:"#2CB7A7"},{t:"My cells shift with every listen.",c:"#2CB7A7"},
  {t:"Beauty is who I am.",c:"#2CB7A7"},{t:"Life is happening for me. Always.",c:"#2CB7A7"},{t:"My manifestations arrive fast.",c:"#2CB7A7"},
  {t:"My theta state holds my desires.",c:"#2CB7A7"},{t:"The new me is permanent now.",c:"#2CB7A7"},{t:"I attract what I want. Effortlessly.",c:"#2CB7A7"},
  {t:"My aura is undeniable.",c:"#2CB7A7"},{t:"Money comes from everywhere.",c:"#2CB7A7"},{t:"The shift is already done.",c:"#2CB7A7"},
  {t:"I am reprogramming daily.",c:"#2CB7A7"},{t:"He's obsessed with who I am.",c:"#2CB7A7"},{t:"Every night I become her more.",c:"#2CB7A7"},
];
// ── PHONE SHELL, hoisted to top level so it's a stable component type across renders (was nested, causing iframe remount/flash) ──
function PhoneShell({ w=200, theme, view }) {
  const br = Math.round(w * 0.21);
  const pad = Math.round(w * 0.025);
  return (
    <div style={{ position:"relative", width:w, background:"#1a1a1a", borderRadius:br, padding:`${Math.round(w*0.055)}px ${pad}px`, boxShadow:"0 0 0 2px #3a3a3a, 0 0 0 4px #1a1a1a, 0 0 0 6px #3a3a3a, 0 28px 56px rgba(0,0,0,0.85)" }}>
      <div style={{ position:"absolute", left:-3, top:"22%", width:3, height:"10%", background:"#3a3a3a", borderRadius:"2px 0 0 2px" }}/>
      <div style={{ position:"absolute", left:-3, top:"35%", width:3, height:"16%", background:"#3a3a3a", borderRadius:"2px 0 0 2px" }}/>
      <div style={{ position:"absolute", left:-3, top:"54%", width:3, height:"16%", background:"#3a3a3a", borderRadius:"2px 0 0 2px" }}/>
      <div style={{ position:"absolute", right:-3, top:"38%", width:3, height:"22%", background:"#3a3a3a", borderRadius:"0 2px 2px 0" }}/>
      <div style={{ borderRadius:Math.round(br*0.82), overflow:"hidden", position:"relative" }}>
        <div style={{ position:"absolute", top:Math.round(w*0.033), left:"50%", transform:"translateX(-50%)", width:Math.round(w*0.38), height:Math.round(w*0.077), background:"#000", borderRadius:20, zIndex:10 }}/>
        {view==="dashboard" && (
          <div style={{ width:w - pad*2, height:Math.round((w-pad*2)*844/390), overflow:"hidden", position:"relative", background:"#000" }}>
            <div style={{ width:390, height:844, transform:`scale(${(w-pad*2)/390})`, transformOrigin:"top left" }}>
              <iframe
                src={`/portal?preview=1&theme=${theme}`}
                title="Self Hypnosis Goddess mobile dashboard preview"
                width="390"
                height="844"
                style={{ border:"none", display:"block" }}
              />
            </div>
          </div>
        )}
        {view==="proof" && (
          <div style={{ width:w - pad*2, height:Math.round((w-pad*2)*844/390), overflow:"hidden", position:"relative", background:"#000" }}>
            <div style={{ width:390, height:844, transform:`scale(${(w-pad*2)/390})`, transformOrigin:"top left" }}>
              <iframe
                src={`/portal?preview=1&theme=${theme}&tab=proof`}
                title="Self Hypnosis Goddess mobile ProofOS preview"
                width="390"
                height="844"
                style={{ border:"none", display:"block" }}
              />
            </div>
          </div>
        )}
        {view==="analytics" && (
          <div style={{ width:w - pad*2, height:Math.round((w-pad*2)*844/390), overflow:"hidden", position:"relative", background:"#000" }}>
            <div style={{ width:390, height:844, transform:`scale(${(w-pad*2)/390})`, transformOrigin:"top left" }}>
              <iframe
                src={`/portal?preview=1&theme=${theme}&tab=analytics`}
                title="Self Hypnosis Goddess mobile Analytics preview"
                width="390"
                height="844"
                style={{ border:"none", display:"block" }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── APP PREVIEW SECTION, dashboard + proofos with theme toggle ──────────────
function AppPreviewSection({ isMobile }) {
  const [theme, setTheme] = useState("light");
  const [view,  setView]  = useState("dashboard");

  /* ── Desktop panel content (changes per tab), computed inline, not a nested component, to avoid remounting the iframe on every render ── */
  const desktopPanelContent = (() => {
    if (view === "dashboard") return (
      <div style={{ width:460, height:Math.round(460*0.65), borderRadius:16, overflow:"hidden", boxShadow:"0 18px 50px rgba(0,0,0,0.55)", border:"1px solid rgba(232,184,112,0.2)", background:"#000" }}>
        <div style={{ width:838, height:544, transform:"scale(0.546)", transformOrigin:"top left" }}>
          <iframe
            src={`/portal?preview=1&theme=${theme}`}
            title="Self Hypnosis Goddess dashboard preview"
            width="838"
            height="544"
            style={{ border:"none", display:"block" }}
          />
        </div>
      </div>
    );
    if (view === "proof") return (
      <div style={{ width:460, height:Math.round(460*0.65), borderRadius:16, overflow:"hidden", boxShadow:"0 18px 50px rgba(0,0,0,0.55)", border:"1px solid rgba(232,184,112,0.2)", background:"#000" }}>
        <div style={{ width:838, height:544, transform:"scale(0.546)", transformOrigin:"top left" }}>
          <iframe
            src={`/portal?preview=1&theme=${theme}&tab=proof`}
            title="Self Hypnosis Goddess ProofOS preview"
            width="838"
            height="544"
            style={{ border:"none", display:"block" }}
          />
        </div>
      </div>
    );
    if (view === "analytics") return (
      <div style={{ width:460, height:Math.round(460*0.65), borderRadius:16, overflow:"hidden", boxShadow:"0 18px 50px rgba(0,0,0,0.55)", border:"1px solid rgba(232,184,112,0.18)", background:"#000" }}>
        <div style={{ width:838, height:544, transform:"scale(0.546)", transformOrigin:"top left" }}>
          <iframe
            src={`/portal?preview=1&theme=${theme}&tab=analytics`}
            title="Self Hypnosis Goddess Analytics preview"
            width="838"
            height="544"
            style={{ border:"none", display:"block" }}
          />
        </div>
      </div>
    );
    return null;
  })();

  /* ── iPhone shell ── */
  return (
    <div style={{ width:"100%", background:"#000", padding:isMobile?"36px 0 44px":"56px 0 64px", display:"flex", flexDirection:"column", alignItems:"center", gap:24 }}>

      {/* Heading */}
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:11, color:"#E8B870", letterSpacing:"0.22em", textTransform:"uppercase", fontFamily:"'Jost',sans-serif", marginBottom:8 }}>Live preview</div>
        <div style={{ fontSize:isMobile?22:28, color:"#f2ece4", fontFamily:"'Jost',sans-serif", fontWeight:400, letterSpacing:"-0.01em" }}>
          {isMobile ? "See inside the platform." : "Desktop and iPhone. No download needed."}
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{ display:"flex", gap:0, background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.13)", borderRadius:24, padding:4 }}>
        {[["dashboard","Dashboard"],["proof","ProofOS ✦"],["analytics","Analytics"]].map(([id,l])=>(
          <button key={id} onClick={()=>setView(id)}
            style={{ padding:"8px 20px", borderRadius:20, background:view===id?"#f2ece4":"transparent", border:"none",
              color:view===id?"#000":"#fff", fontSize:12, fontWeight:400, cursor:"pointer",
              fontFamily:"'Jost',sans-serif", transition:"all 0.2s", letterSpacing:"0.04em" }}>
            {l}
          </button>
        ))}
      </div>

      {/* Mockups row */}
      {isMobile ? (
        /* Mobile: just the phone, centred */
        <PhoneShell w={200} theme={theme} view={view}/>
      ) : (
        /* Desktop: browser mockup left, iPhone right, always both visible */
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"center", gap:40, padding:"0 32px", maxWidth:1100, width:"100%" }}>
          {/* Desktop panel */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10, flex:"0 0 auto" }}>
            <div style={{ fontSize:10, color:"#E8B870", letterSpacing:"0.2em", textTransform:"uppercase", fontFamily:"'Jost',sans-serif" }}>Desktop · works in any browser</div>
            {desktopPanelContent}
          </div>
          {/* iPhone */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10, flex:"0 0 auto" }}>
            <div style={{ fontSize:10, color:"#E8B870", letterSpacing:"0.2em", textTransform:"uppercase", fontFamily:"'Jost',sans-serif" }}>iPhone · Android</div>
            <PhoneShell w={210} theme={theme} view={view}/>
          </div>
        </div>
      )}

      {/* Dark / Light toggle */}
      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <span style={{ fontSize:11, color:theme==="dark"?"#E8B870":"#8a8a8a", fontFamily:"'Jost',sans-serif" }}>Dark</span>
        <button onClick={()=>setTheme(t=>t==="dark"?"light":"dark")}
          style={{ width:44, height:24, borderRadius:12, background:theme==="dark"?"linear-gradient(90deg,#F5E0A0,#E8B870,#BFA5D8,#2CB7A7)":"#2a2a2a", border:"none", cursor:"pointer", position:"relative", transition:"background 0.25s", padding:0 }}>
          <div style={{ width:18, height:18, borderRadius:"50%", background:"#fff", position:"absolute", top:3, left:theme==="dark"?3:23, transition:"left 0.25s" }}/>
        </button>
        <span style={{ fontSize:11, color:theme==="dark"?"#8a8a8a":"#E8B870", fontFamily:"'Jost',sans-serif" }}>Light</span>
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
          <span style={{marginRight:6,opacity:0.7}}>{item.t.toLowerCase().includes("money")||item.t.toLowerCase().includes("$")||item.t.toLowerCase().includes("income")||item.t.toLowerCase().includes("wealth")||item.t.toLowerCase().includes("financial")?"💰":item.t.toLowerCase().includes("skin")||item.t.toLowerCase().includes("face")||item.t.toLowerCase().includes("beauty")||item.t.toLowerCase().includes("glow")||item.t.toLowerCase().includes("gorgeous")||item.t.toLowerCase().includes("radiant")||item.t.toLowerCase().includes("stunning")?"✦":item.t.toLowerCase().includes("he ")||item.t.toLowerCase().includes("him")||item.t.toLowerCase().includes("sp ")||item.t.toLowerCase().includes("love")||item.t.toLowerCase().includes("devoted")?"♡":item.t.toLowerCase().includes("sleep")||item.t.toLowerCase().includes("dna")||item.t.toLowerCase().includes("cell")||item.t.toLowerCase().includes("blood")?"◐":"✦"}</span>{item.t}</span>
        );})}
      </div>
    </div>
  );
}

/* ── MAXXING CAROUSEL, Lucky Girl gradient bg, BLACK text ────────────────────── */
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

  const OMBRE = "linear-gradient(135deg,#F5E0A0 0%,#E8B870 22%,#2CB7A7 48%,#BFA5D8 72%,#2CB7A7 100%)";
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
        <div style={{
          fontSize:"clamp(30px,6vw,72px)", lineHeight:1.05, color:"#000",
          fontFamily:"'Jost',sans-serif", fontWeight:300, letterSpacing:"-0.01em"
        }}>{current.tagline}</div>
      </div>
      <div style={{ display:"flex", background:"#000", borderTop:"1px solid #1c1828", borderBottom:"1px solid #1c1828" }}>
        {[next1,next2,next3].map((cat,i) => (
          <div key={i}
            onClick={() => { setFlash(true); setTimeout(()=>{setIdx((idx+i+1)%cats.length);setFlash(false);},200); }}
            style={{ flex:1, padding:"16px 18px", cursor:"pointer", borderRight:i<2?"1px solid #1c1828":"none", transition:"background 0.2s" }}
            onMouseEnter={e=>e.currentTarget.style.background="#0a0a0a"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{ fontSize:9, color:"#f2ece4", fontWeight:500, letterSpacing:"0.22em", textTransform:"uppercase", marginBottom:5, fontFamily:"'Jost',sans-serif" }}>{cat.label}</div>
            <div style={{ fontSize:12, color:"#f2ece4", lineHeight:1.5, fontFamily:"'Jost',sans-serif" }}>{cat.tagline}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", justifyContent:"center", gap:7, padding:"16px 0", background:"#000" }}>
        {cats.map((_,i) => (
          <div key={i}
            onClick={()=>{setFlash(true);setTimeout(()=>{setIdx(i);setFlash(false);},200);}}
            style={{ width:i===idx?20:6, height:6, borderRadius:3, background:i===idx?"#2CB7A7":"#1c1828", transition:"all 0.3s", cursor:"pointer" }}/>
        ))}
      </div>
    </div>
  );
}

/* ── IDENTITY CAROUSEL, six accent ombres, rotates through brand colours ──── */
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
    // Carousel only, full palette including warm pink + hot blue accent tiles
    "Richgirlmaxxing":     "linear-gradient(135deg,#0A4A8A,#2CB7A7,#2CB7A7)",  // navy → deep blue → turquoise
    "Luckygirlmaxxing": "linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)",  // full Lucky Girl ombre
    "Beautymaxxing":    "linear-gradient(135deg,#F5E0A0,#F5E0A0)",        // blush → soft rose
    "Lovemaxxing":      "linear-gradient(135deg,#F5E0A0,#E07898)",        // pale blush → warm rose
    "DNAmaxxing":       "linear-gradient(135deg,#2CB7A7,#2CB7A7)",        // hot blue → teal
    "Lifemaxxing":      "linear-gradient(135deg,#E8B870,#E8B870)",        // amber gold
    "Bodymaxxing":      "linear-gradient(135deg,#167A6B,#2CB7A7)",        // deep teal
    "Selfmaxxing":      "linear-gradient(135deg,#BFA5D8,#2CB7A7)",        // lilac → teal
    "Erosmaxxing":      "linear-gradient(135deg,#F5E0A0,#F5E0A0)",        // warm rose → blush
    "Businessmaxxing":  "linear-gradient(135deg,#2CB7A7,#E8B870)",        // hot blue → gold
    "Singlemaxxing":    "linear-gradient(135deg,#F5E0A0,#D4889A)",        // blush → dusty rose
    "Skinnymaxxing":    "linear-gradient(135deg,#2CB7A7,#167A6B)",        // teal
    "Sleepmaxxing":     "linear-gradient(135deg,#1A4A8A,#2CB7A7)",        // deep blue → hot blue
    "Facemaxxing":      "linear-gradient(135deg,#E8B870,#F5E0A0)",        // gold → blush
    "Desiresmaxxing":    "linear-gradient(135deg,#E8B870,#BFA5D8)",        // hot blue → lilac
    "Wellnessmaxxing":  "linear-gradient(135deg,#2CB7A7,#BFA5D8)",        // teal → lilac
    "Confidencemaxxing":"linear-gradient(135deg,#F5E0A0,#E8B870)",        // blush → gold
    "Stylemaxxing":     "linear-gradient(135deg,#E8B870,#F5E0A0)",        // gold → soft pink
    "Healthmaxxing":      "linear-gradient(135deg,#F5E0A0,#F5E0A0)",        // pale pink → warm rose
    "Peacemaxxing":     "linear-gradient(135deg,#2CB7A7,#2CB7A7)",        // teal → hot blue
    "Friendmaxxing":    "linear-gradient(135deg,#2CB7A7,#2CB7A7)",        // hot blue → teal
    "Studymaxxing":     "linear-gradient(135deg,#2CB7A7,#BFA5D8)",        // hot blue → lilac
    "Intuitionmaxxing": "linear-gradient(135deg,#F5E0A0,#F5E0A0)",        // warm rose → blush
    "Sovereignmaxxing": "linear-gradient(135deg,#E8B870,#2CB7A7)",        // gold → hot blue
  };
  const FALLBACK = "linear-gradient(135deg,#2CB7A7,#2CB7A7)";
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
          fontSize: fullscreen ? 11 : 10, fontWeight:500, letterSpacing:"0.28em", textTransform:"uppercase",
          marginBottom:20, fontFamily:"'Jost',sans-serif", color:"#000"
        }}>{current.label} ✦</div>
        <div style={{
          fontSize: fullscreen ? "clamp(28px,5.5vw,56px)" : "clamp(20px,3.5vw,42px)", lineHeight:1.12, color:"#000",
          fontFamily:"'Jost',sans-serif", fontWeight:300, letterSpacing:"-0.01em"
        }}>{current.tagline}</div>
      </div>
      <div style={{ display:"flex", background:"#000", borderTop:"1px solid #1c1828", borderBottom:"1px solid #1c1828" }}>
        {[next1,next2,next3].map((cat,i) => (
          <div key={i}
            onClick={() => { setFlash(true); setTimeout(()=>{setIdx((idx+i+1)%cats.length);setFlash(false);},200); }}
            style={{ flex:1, padding:"16px 18px", cursor:"pointer", borderRight:i<2?"1px solid #1c1828":"none", transition:"background 0.2s" }}
            onMouseEnter={e=>e.currentTarget.style.background="#0a0a0a"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{ fontSize:9, color:"#f2ece4", fontWeight:500, letterSpacing:"0.22em", textTransform:"uppercase", marginBottom:5, fontFamily:"'Jost',sans-serif" }}>{cat.label}</div>
            <div style={{ fontSize:12, color:"#f2ece4", lineHeight:1.5, fontFamily:"'Jost',sans-serif" }}>{cat.tagline}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", justifyContent:"center", gap:7, padding:"16px 0", background:"#000" }}>
        {cats.map((_,i) => (
          <div key={i}
            onClick={()=>{setFlash(true);setTimeout(()=>{setIdx(i);setFlash(false);},200);}}
            style={{ width:i===idx?20:6, height:6, borderRadius:3, background:i===idx?"#BFA5D8":"#1c1828", transition:"all 0.3s", cursor:"pointer" }}/>
        ))}
      </div>
    </div>
  );
}

/* ── FAQ SECTION ───────────────────────────────────────────────────────────── */
const FAQS = [
  {q:"What exactly is Self Hypnosis Goddess?",a:"A private audio membership of original hypnosis tracks produced by Reshma Oracle. Each audio is layered with EMDR, binaural beats, and melodic house music to guide your brain into theta state, where the subconscious accepts new beliefs. No app download needed. Access everything through a web portal that plays like Spotify."},
  {q:"How is this different from YouTube hypnosis?",a:"The YouTube audios are free and public. The vault contains originals never published, longer, deeper, produced specifically to rewire the subconscious around specific desires. No ads at 3am. No algorithm deciding what you hear next."},
  {q:"Is this for all genders?",a:"Yes. Depending on the track. The love and SP tracks are written with female listeners in mind by default, but the money, identity, beauty, DNA, and sleep tracks apply to anyone. More gender-neutral tracks are being added regularly."},
  {q:"Do I need headphones?",a:"Headphones maximise the binaural effect and are strongly recommended. The EMDR bilateral element works through left-right audio stimulation. AirPods, earbuds, over-ear, any pair works."},
  {q:"How long until I notice something shifting?",a:"Most members report something noticeable within 3 to 7 days, a small sign, a shift in how they feel about the desire, or a change in the obsessive loop. The install deepens with repetition. 30 days of consistent listening typically closes the old identity completely."},
  {q:"Can I listen while I sleep?",a:"Yes. This is one of the most effective ways to use the audios. Your conscious resistance is off. The subconscious is in delta and receives the installation without filtering. Several tracks are designed specifically for sleep listening."},
  {q:"What is ProofOS?",a:"ProofOS is the manifestation tracking system included in Goddess Tier. Log your desires, link them to the audio you listened to, capture signs as they arrive, and mark when it manifests. It creates a personal record of evidence so you can see the pattern building."},
  {q:"What's the difference between Audio and Goddess Tier?",a:`Audio Tier (${TIERS.audio.monthly}/mo): full vault, all categories, new tracks weekly, loop player, sleep timer. Goddess Tier (${TIERS.goddess.monthly}/mo): everything in Audio plus ProofOS tracking, early access drops 48hrs before everyone else, and monthly ritual audio.`},
  {q:"What is Lifetime Access?",a:`A one-time payment of ${TIERS.lifetime.monthly} that gives you everything in Goddess Tier, forever, no monthly or annual billing, ever again. That includes every track already in the vault, every future audio ever released, every future feature added to ProofOS or the portal, and early access to new drops before anyone else. It's the same tier, permanently unlocked with one payment instead of a recurring one. Limited to 1,000 spots total, once they're gone, Lifetime Access closes and the option reverts to Audio or Goddess subscriptions only.`},
  {q:"Is my Proof Wall permanent?",a:"Yes, your Proof Wall is for life. Every manifestation you log stays there forever, dated, with exactly how long it took from the day you set the intention to the day it manifested. Most people manifest things constantly and never realise it, because they don't write it down and the evidence gets lost. This replaces that gap entirely: never lose a single manifestation again."},
  {q:"How do I know how to listen, what do I actually do?",a:"Every account includes access to the in-app Guide, a full walkthrough covering exactly how to use the vault: which format to pick and when, best times of day to listen, how often, what headphones setup works best, how the different elements (hypnosis, subliminal, binaural, music) combine, and how to use ProofOS to track what happens. It answers every question about the process in one place, so you're never guessing. You'll find it inside the portal from your first login."},
  {q:"Can I cancel anytime?",a:"Yes. Cancel before your next renewal date and you will not be charged again. No refunds after 14 days from payment date."},
  {q:"Does this work if other subliminals didn't?",a:"Most subliminals fail because they use generic voices, poor production, or deliver affirmations to a conscious mind in beta state. SHG uses binaural beats and EMDR to bypass the conscious filter entirely, reaching the subconscious where belief actually lives."},
  {q:"What categories are in the vault?",a:"A growing library, right now it includes Lovemaxxing, Beautymaxxing, Facemaxxing, Bodymaxxing, Skinnymaxxing, Richgirlmaxxing, Businessmaxxing, Desiresmaxxing, DNAmaxxing, Selfmaxxing, Erosmaxxing, Singlemaxxing, Wellnessmaxxing, Sleepmaxxing, Studymaxxing, Friendmaxxing, Peacemaxxing, Confidencemaxxing, Stylemaxxing, Healthmaxxing, Intuitionmaxxing, Lifemaxxing, Luckygirlmaxxing, and Sovereignmaxxing. New categories and tracks added weekly."},
  {q:"What are subliminals?",a:"Affirmations recorded below the threshold of conscious hearing, layered underneath the music and spoken hypnosis. Your conscious mind doesn't register them as words, but your subconscious does. They bypass the part of you that would normally argue back with a new belief."},
  {q:"How do the different elements combine in one track?",a:"Each audio layers four things at once: spoken hypnosis (guiding you into the state), subliminal affirmations (below hearing threshold), binaural beats (two slightly different frequencies, one per ear, syncing both brain hemispheres into theta), and original melodic house music (so it's something you actually want to listen to, not just tolerate). All four play simultaneously, not in sequence."},
  {q:"Who is Reshma Oracle?",a:"The person recording every track in this vault. No agency, no outsourced voice work, every hypnosis session, every affirmation, every frequency choice is hers. Self Hypnosis Goddess exists because she noticed everyone in this space consumes content and no one actually installs a new identity, so she built something designed for daily repetition, not one-off inspiration."},
  {q:"Is there a mobile app?",a:"The portal is a web app that works on any device in any browser. On iPhone: tap Share → Add to Home Screen. A dedicated iOS and Android app is in development."},
];
function FAQSection() {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ background:"#fdf6ee", padding:"0 0 0 0" }}>
      <div style={{ padding:"60px clamp(16px,4vw,24px) 80px",maxWidth:760,margin:"0 auto" }}>
      <div style={{ textAlign:"center",marginBottom:40 }}>
        <div style={{ fontSize:11,color:"#2CB7A7",letterSpacing:"0.25em",textTransform:"uppercase",fontWeight:400,marginBottom:14,fontFamily:"'Jost',sans-serif" }}>Everything you need to know</div>
        <h2 className="wm" style={{ fontSize:"clamp(28px,4.5vw,52px)",color:"#0a0a0a",lineHeight:1.2 }}>FAQs</h2>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
        {FAQS.map((faq,i) => (
          <div key={i} style={{ background:open===i?"rgba(255,255,255,0.95)":"rgba(255,255,255,0.7)",border:"1px solid",borderColor:open===i?"rgba(44,183,167,0.35)":"rgba(44,183,167,0.15)",borderRadius:14,overflow:"hidden",transition:"all 0.2s",boxShadow:open===i?"0 4px 20px rgba(44,183,167,0.12)":"none" }}>
            <button onClick={() => setOpen(open===i?null:i)} style={{ width:"100%",padding:"20px 22px",background:"none",border:"none",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",gap:16 }}>
              <span style={{ fontSize:15,fontWeight:400,color:"#0a0a0a",textAlign:"left",lineHeight:1.4 }}>{faq.q}</span>
              <span style={{ fontSize:20,color:"#2CB7A7",flexShrink:0,transform:open===i?"rotate(45deg)":"none",transition:"transform 0.2s" }}>+</span>
            </button>
            {open===i && <div style={{ padding:"0 22px 22px" }}><div style={{ height:1,background:"rgba(44,183,167,0.15)",marginBottom:16 }}/><p style={{ fontSize:15,color:"#1a1a1a",lineHeight:1.85,margin:0 }}>{faq.a}</p></div>}
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

/* ── LANDING PAGE ─────────────────────────────────────────────────────────── */
/* ── MOBILE HOOK, bypasses all CSS specificity issues ── */
function useMobile() {
  const [m, setM] = useState(() => typeof window !== "undefined" ? window.innerWidth <= 680 : false);
  useEffect(() => {
    const h = () => setM(window.innerWidth <= 680);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return m;
}
/* Grid helper, returns inline style that works on ALL devices */
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

function LuckyGirlTimeline({ isMobile }) {
  const [active, setActive] = useState(0);
  const G = "linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)";
  const items = [
    { title:"Right place. Right time. Right outcome. Mine.", tag:"Luckygirlmaxxing" },
    { title:"Infinite cash streams. Always arriving.", tag:"Richgirlmaxxing" },
    { title:"Perfect body. Perfect health. No effort required.", tag:"Beautymaxxing" },
    { title:"The perfect man. He finds her first.", tag:"Lovemaxxing" },
    { title:"Always loved by the right people.", tag:"Lovemaxxing" },
    { title:"Always attracting the right people.", tag:"Luckygirlmaxxing" },
    { title:"Unlimited access. Unlimited experiences. No ceiling.", tag:"Sovereignmaxxing" },
    { title:"Perfect timing. Every single time.", tag:"Luckygirlmaxxing" },
    { title:"Synchronicities. Signs. She notices all of them.", tag:"ProofOS" },
    { title:"Always the most successful version of herself.", tag:"Selfmaxxing" },
    { title:"She has it all. Not more. All. All at once.", tag:"The identity" },
  ];

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % items.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background:G, width:"100%", padding: isMobile?"72px 20px 88px":"104px 80px 120px" }}>
      <div style={{ maxWidth:900, margin:"0 auto" }}>
        {/* ONE LINE heading — no line break */}
        <h2 style={{ textAlign:"center", fontSize: isMobile?"clamp(48px,11vw,72px)":"clamp(64px,8vw,96px)", fontWeight:300, color:"#000", letterSpacing:"-.03em", lineHeight:.95, marginBottom:16, whiteSpace: isMobile?"normal":"nowrap" }}>Lucky Girl Timeline.</h2>
        <div style={{ textAlign:"center", fontSize: isMobile?"clamp(20px,5vw,28px)":"clamp(24px,2.8vw,34px)", fontWeight:300, color:"#000", letterSpacing:"-.01em", lineHeight:1.2, marginBottom:10 }}>She gets to have it all. All of it. All at once.</div>
        <div style={{ textAlign:"center", fontSize: isMobile?16:18, color:"#000", fontWeight:400, marginBottom: isMobile?56:80, fontFamily:"'Jost',sans-serif", lineHeight:1.5 }}>This isn't a wish list. This is what runs automatically when the identity is installed.</div>

        {/* Timeline */}
        <div style={{ position:"relative" }}>
          <div style={{ position:"absolute", left:"50%", top:0, bottom:0, width:2, background:"rgba(0,0,0,.2)", transform:"translateX(-50%)", borderRadius:2 }} />
          {items.map((item, i) => {
            const isLeft = i % 2 === 0;
            const isActive = active === i;
            return (
              <div key={i} style={{ display:"flex", flexDirection: isLeft ? "row" : "row-reverse", alignItems:"center", marginBottom: isMobile?14:18, position:"relative", minHeight: isMobile?60:70 }}>
                {/* Box — always first child, direction controls which side */}
                <div style={{ width:"46%", flexShrink:0 }}>
                  <div style={{ padding: isMobile?"14px 16px":"18px 24px", borderRadius:14, background:"#fff", opacity: isActive?1:.8, transform: isActive?"scale(1)":"scale(.97)", transition:"all .4s", textAlign: isLeft?"right":"left", boxShadow: isActive?"0 8px 32px rgba(0,0,0,.12)":"none" }}>
                    <div style={{ fontSize: isMobile?14:16, fontWeight:400, color:"#000", lineHeight:1.4 }}>{item.title}</div>
                    {isActive && <div style={{ fontSize:10, letterSpacing:".15em", textTransform:"uppercase", color:"#000", opacity:.5, marginTop:6 }}>✦ {item.tag}</div>}
                  </div>
                </div>
                {/* Spacer pushes box to correct side */}
                <div style={{ flex:1 }} />
                {/* Centre dot */}
                <div style={{ position:"absolute", left:"50%", top:"50%", transform:"translate(-50%,-50%)", width: isActive?16:12, height: isActive?16:12, borderRadius:"50%", background: isActive?"#000":"rgba(0,0,0,.3)", border:"2px solid rgba(255,255,255,.8)", transition:"all .4s", zIndex:2 }} />
                {/* Connector */}
                <div style={{ position:"absolute", top:"50%", height:2, background:"rgba(0,0,0,.15)", width:"4%", left: isLeft?"auto":"50%", right: isLeft?"50%":"auto", transform:"translateY(-50%)" }} />
              </div>
            );
          })}
        </div>

        {/* BRIDGE — how the audio gets you there */}
        <div style={{ marginTop: isMobile?56:72, textAlign:"center", borderTop:"1px solid rgba(0,0,0,.12)", paddingTop: isMobile?40:56 }}>
          <div style={{ fontSize:13, letterSpacing:".2em", textTransform:"uppercase", color:"#000", fontWeight:600, marginBottom:16, fontFamily:"'Jost',sans-serif" }}>How she gets there</div>
          <div style={{ fontSize: isMobile?"clamp(22px,5vw,28px)":"clamp(26px,2.8vw,34px)", fontWeight:300, color:"#000", lineHeight:1.4, maxWidth:640, margin:"0 auto", marginBottom:20 }}>The Self Hypnosis Goddess audio library installs this identity. One track at a time. While you live your life.</div>
          <div style={{ fontSize:14, color:"#000", maxWidth:500, margin:"0 auto" }}>Luckygirlmaxxing. Richgirlmaxxing. Beautymaxxing. Lovemaxxing. All 24 categories. The complete operating system upgrade.</div>
        </div>
      </div>
    </div>
  );
}

function HowItWorksAccordion({ isMobile }) {
  const [open, setOpen] = useState(0);
  const G = "linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)";
  const timerRef = useRef(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setOpen(prev => (prev + 1) % 8);
    }, 10000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer]);

  const handleClick = (i) => {
    setOpen(open === i ? -1 : i);
    startTimer();
  };

  const steps = [
    { n:"01", title:"Choose a track. Press play. Anytime.", body:"Browse 24 categories — Luckygirlmaxxing, Richgirlmaxxing, Lovemaxxing, Beautymaxxing, Selfmaxxing and more. Whatever area of your life you want to shift, there is a track built specifically for that identity upgrade. Pick it. Press play. No ritual required, no perfect timing, no need to be relaxed first. In the car, in the gym, while you cook, while you fall asleep. The audio works in any environment. The one non-negotiable: repetition. Listen at least twice a day. The subconscious doesn't install on one exposure. It installs through consistent repetition, the same way your old beliefs were installed. Keep going even if you don't feel it working yet. That's the point — it works below conscious awareness." },
    { n:"02", title:"Theta state — your subconscious opens.", body:"Theta is a brainwave state between 4 and 8Hz, the state you pass through every night just before sleep, and the only state where your subconscious mind becomes fully receptive to new beliefs. The binaural beats in every SHG track put you there within minutes. How: one frequency plays in your left ear, a slightly different frequency plays in your right ear. Your brain detects the difference and creates a third tone, following it down into theta automatically. You don't have to do anything. You just listen. In theta, the gatekeeper goes offline. The critical, doubting, filtering conscious mind steps back. What's left is pure subconscious, open and ready for the install." },
    { n:"03", title:"The hypnosis script installs the new identity.", body:"While you're in theta, Reshma's voice delivers a direct hypnosis script built around your chosen identity. Not affirmations you repeat out loud hoping to believe them. An actual hypnosis session that speaks to your subconscious as the authority it recognises. The language is precise. The delivery is intentional. Every word is chosen to bypass the part of your mind that says 'I don't believe this yet' and land in the part that simply receives and installs. This is why the tracks feel different to guided meditations. This is hypnosis, not inspiration." },
    { n:"04", title:"Subliminals reinforce every second.", body:"Here is what a subliminal actually is. Affirmations recorded at a volume your conscious mind cannot detect, but your subconscious receives clearly. While you listen to the music and the hypnosis voice, a second layer of identity statements plays underneath, just below the threshold of conscious hearing. You cannot make out the words. You are not meant to. Your conscious mind hears music. Your subconscious hears every word, receiving the same identity statements hundreds of times per session, with zero interference from the part of your mind that usually argues, doubts, or says 'I don't believe this.' This is why subliminals work where willpower fails. Willpower requires your conscious mind to fight your subconscious. Subliminals bypass the fight entirely and go straight to the source. No belief required. No effort required. Just repetition, at a frequency your subconscious cannot ignore." },
    { n:"05", title:"Melodic house locks you in state.", body:"Every track is built on melodic house — a specific tempo and frequency range chosen because it keeps the nervous system elevated without pulling you out of theta. This is not background music. The music is structural. It holds the binaural frequency stable, maintains emotional engagement so you stay present rather than drifting, and creates the feeling state that matches the identity you're installing. When you feel the energy lift as the track plays, that's not a side effect. That's the mechanism. Identity installs fastest when the emotional and neurological state match the belief." },
    { n:"06", title:"Your beliefs change. Automatically.", body:"You won't necessarily notice the moment it happens. That's normal. The subconscious doesn't send you a confirmation email. What you'll notice instead is that the old thought doesn't fire as automatically as it used to. The doubt is quieter. The assumption shifts. You catch yourself thinking from the new identity without trying. This is because the neural pathway underneath the old belief has been weakened through disuse, and the pathway underneath the new one has been strengthened through repetition. Neuroscience calls this neuroplasticity. In this context it means your mind is genuinely different from the one you started with." },
    { n:"07", title:"Reality reflects the new identity.", body:"When the identity changes, behaviour changes. When behaviour changes, decisions change. When decisions change, outcomes change. This is the mechanism behind manifestation — not magical thinking, but identity-level change producing different actions, different energy, different signals to the people and situations around you. The lucky girl who gets upgraded at the airport isn't lucky. She's walking through the world as someone who expects good things, and that expectation is visible, readable, and magnetising. You won't need to remind yourself to act differently. The new identity acts on its own." },
    { n:"08", title:"Log every sign in ProofOS.", body:"The moment things start shifting, you'll notice signs: a synchronicity, an unexpected call, a number that keeps appearing, something arriving that you'd been holding in your mind. Log every one. ProofOS is your evidence wall — date stamped, searchable, permanent. The reason logging matters is neurological, not motivational. Every time you record a sign, you are training your Reticular Activating System to notice more of the same. You are also building a body of evidence that keeps you in the emotional state that generates further manifestation. The proof wall fills. The state deepens. The loop accelerates.", badge:true },
  ];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
      {steps.map((s,i) => (
        <div key={i}>
          <div
            onClick={() => handleClick(i)}
            style={{ display:"flex", alignItems:"center", gap:20, padding: isMobile?"16px 20px":"20px 28px", cursor:"pointer", background: open===i ? G : "#f2ece4", borderRadius: open===i ? "14px 14px 0 0" : 14, border:"1px solid rgba(0,0,0,.06)", transition:"all .25s" }}
          >
            <span style={{ fontSize:11, letterSpacing:"0.2em", color: open===i ? "rgba(0,0,0,.5)" : "#888", fontWeight:500, flexShrink:0, width:28, fontFamily:"'Jost',sans-serif" }}>{s.n}</span>
            <span style={{ fontSize: isMobile?16:18, fontWeight:400, color:"#000", flex:1, fontFamily:"'Jost',sans-serif", letterSpacing:"-0.01em" }}>{s.title}</span>
            {s.badge && open===i && <span style={{ background:"#000", borderRadius:20, padding:"4px 12px", fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:"#f2ece4", fontFamily:"'Jost',sans-serif", flexShrink:0, fontWeight:500 }}>Goddess Tier ✦</span>}
            <span style={{ fontSize:20, color:"#888", flexShrink:0, transform: open===i ? "rotate(45deg)" : "none", transition:"transform .3s", fontWeight:300 }}>+</span>
          </div>
          {open===i && (
            <div style={{ background:G, borderRadius:"0 0 14px 14px", padding: isMobile?"16px 20px 24px":"20px 28px 28px" }}>
              <p style={{ fontSize: isMobile?14:15, fontWeight:400, color:"#000", lineHeight:1.85, fontFamily:"'Jost',sans-serif", paddingLeft: isMobile?36:48 }}>{s.body}</p>
            </div>
          )}
          {i < 7 && (
            <div style={{ textAlign:"center", padding:"8px 0" }}>
              <span style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:28, height:28, borderRadius:"50%", background:"rgba(0,0,0,.06)", fontSize:13, color:"#2CB7A7" }}>↓</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Landing({ onJoin, onDemo, onSignIn, onLegal, forceWaitlist=false }) {
  const [proofTheme, setProofTheme] = useState("dark");
  const theme = "dark";
  const isMobile = useMobile();
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [billing, setBilling] = useState("monthly");
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnnual, setMenuAnnual] = useState(false);
  const location = useLocation();
  const [waitlistOpen, setWaitlistOpen] = useState(() => {
    if (forceWaitlist) return true;
    const params = new URLSearchParams(window.location.search);
    return params.get("waitlist") === "1";
  });
  const [waitlistRefSource] = useState(() => {
    return new URLSearchParams(window.location.search).get("ref") || "landing_page_banner";
  });
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("waitlist") === "1") {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      // wait a tick for the page to fully render before measuring position
      const t = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      return () => clearTimeout(t);
    }
  }, [location.pathname, location.hash]);
  const [shopOpen, setShopOpen] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState("idle"); // idle | saving | done | error

  const submitWaitlist = async (e) => {
    e?.preventDefault();
    // strip ALL whitespace AND invisible unicode chars (nbsp, zero-width, BOM) that autofill sometimes injects
    const email = waitlistEmail.replace(/[\s\u00A0\u200B\uFEFF]+/g, "");
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !EMAIL_RE.test(email)) { setWaitlistStatus("error"); return; }
    setWaitlistStatus("saving");
    try {
      const res = await fetch("https://shg-quiz-worker.airpriestess.workers.dev/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: waitlistRefSource }),
      });
      // Worker returns success:true even for duplicate emails (already on the list)
      if (!res.ok) { setWaitlistStatus("error"); return; }
      setWaitlistStatus("done");
    } catch (err) {
      setWaitlistStatus("error");
    }
  };
  const [faqOpen, setFaqOpen] = useState(null);
  const audioRef = useRef(null);
  const vaultRef = useRef(null);
  const [vaultPlaying, setVaultPlaying] = useState(null);

  // ── HERO PLAYLIST ─────────────────────────────────────────────────────────
  const PLAYLIST = [
    { title: "I Am The Luckiest Woman In This Universe",     sub: "Luckygirlmaxxing",  freq: "Hypnosis · 528hz",                          url: "https://shg-audio-worker.airpriestess.workers.dev/LUCKIEST%20GIRL%20UNIVERSE%20HYPNOSIS%2012MINS%2014.08.2026.WAV" },
    { title: "Drop The Tension",                             sub: "Peacemaxxing",      freq: "Hypnosis · Melodic House",                  url: "https://shg-audio-worker.airpriestess.workers.dev/DROP%20THE%20TENSION%20HYPNOSIS%205MIN%2002.06.2026.WAV" },
    { title: "Spoilt",                                       sub: "Goddessmaxxing",    freq: "Hypnosis · 528hz",                          url: "https://shg-audio-worker.airpriestess.workers.dev/SPOILT%20BEACONS%20%20HYPNOSIS%209MIN%2013.04.2026.WAV" },
    { title: "100 Years of Beauty Sleep",                    sub: "Beautymaxxing",     freq: "Hypnosis · Sleep · 432hz",                  url: "https://shg-audio-worker.airpriestess.workers.dev/100%20YEARS%20OF%20BEAUTY%20SLEEP%20HYPNOSIS%206MIN%2020.04.WAV" },
    { title: "Lifetime of Luck",                             sub: "Luckygirlmaxxing",  freq: "Hypnosis · Melodic House",                  url: "https://shg-audio-worker.airpriestess.workers.dev/LIFETIME%20OF%20LUCK%20HYPNOSIS%209MIN%2023.04.2026.WAV" },
    { title: "Monica Face",                                  sub: "Facemaxxing",       freq: "Hypnosis · 528hz",                          url: "https://shg-audio-worker.airpriestess.workers.dev/MONICA%20FACE%20HYPNOSIS%209MIN%2006.05.2026.WAV" },
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
    if (!currentTrack.url) return; // preview tracks, no audio yet
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
    { label: "Richgirlmaxxing", tagline: "Money finds me first. Obviously.", color: "#2CB7A7" },
    { label: "Beautymaxxing", tagline: "Gorgeous is my default.", color: T.champSoft },
    { label: "Lifemaxxing", tagline: "Highest timeline. Activated.", color: "#e8e0d0" },
    { label: "DNA Shifting", tagline: "My bloodline remembers.", color: "#2CB7A7" },
    { label: "Sleep Shifting", tagline: "I shift while I sleep.", color: "#000000" },
  ];

  // Comparison section heading explanation is added in JSX below
  const compRows = [
    { old: "I have to work hard to receive money.", neu: "Money found me without effort.", proof: "$2,000 refund arrived out of nowhere. Day 6.", cat: "Rich Girl" },
    { old: "He has moved on. I need to accept it.", neu: "He is already on his way back.", proof: "He texted first after 3 weeks of silence. Day 9.", cat: "Lovemaxxing" },
    { old: "I don't feel beautiful unless someone tells me.", neu: "I feel gorgeous from the inside. The mirror confirmed it.", proof: "Woke up and felt it before I even looked. Day 4.", cat: "Beauty" },
    { old: "I've tried scripting, affirmations, vision boards. Nothing sticks.", neu: "I stopped trying. The subconscious installed it while I slept.", proof: "Stopped forcing it. It arrived anyway.", cat: "Identity" },
    { old: "I've been visualising for months. Still waiting.", neu: "One listen changed how I felt about it. Then it moved.", proof: "Felt the shift after the first audio. Evidence followed.", cat: "Identity" },
  ];

  const faqs = [
    { q: "What is self hypnosis?", a: "Hypnosis bypasses the critical conscious mind and speaks directly to the subconscious. In a deeply relaxed theta state, your subconscious accepts new beliefs as true, at the identity level. Reshma's voice guides you into that state. The reprogramming happens while you are in it." },
    { q: "What is a subliminal?", a: "Subliminal audios layer affirmations beneath music or sound at a frequency your conscious mind cannot detect, but your subconscious hears clearly. No mental resistance. No filtering. The new belief goes straight in. Most effective when listened to repeatedly, especially during sleep." },
    { q: "Why include both?", a: "Some self hypnosis tracks include subliminal layers beneath the voice, working on two levels simultaneously. The hypnosis creates the open channel. The subliminals reinforce the new identity beneath it. Together, they reprogram faster and more deeply than either alone." },
    { q: "How often should I listen?", a: "Daily is ideal. First thing on waking or last thing at night, when your subconscious is most receptive in alpha and theta states. Results depend on your belief system and how consistently you listen. Some shift in days. Some in weeks. Every person and every topic is different." },
    { q: "What is SATs?", a: "State Akin to Sleep, the threshold between waking and sleep. Your critical mind is offline. The subconscious is fully open. This is the most powerful state for identity installation. The sleep tracks are designed to work in this state." },
    { q: "Does it play in background?", a: "Yes. Add to Home Screen on iPhone or Android and it plays in background like Spotify. No app download needed. No ads. No interruptions at 3am." },
  ];

  const TECH_ROWS = [
    { t: "Self Hypnosis", w: "Guided induction, Reshma's voice", d: "Bypasses conscious resistance. Opens the subconscious.", when: "Theta state · 4–8 Hz" },
    { t: "Subliminals", w: "Affirmations layered beneath sound", d: "Delivers the new self-concept without conscious filtering.", when: "Any state · most powerful during sleep" },
    { t: "Binaural Beats", w: "Two frequencies, one per ear", d: "Entrains the brain to theta or delta, full receptivity.", when: "Headphones required · begins within minutes" },
    { t: "EMDR (bilateral)", w: "Bilateral audio stimulation", d: "Dissolves old beliefs and identity blocks at depth.", when: "During the audio session" },
    { t: "Reiki / Energy", w: "Encoded energetic frequency", d: "Raises the energetic vibration, activates alignment.", when: "Present throughout every track" },
    { t: "Solfeggio", w: "432hz · 528hz · 963hz", d: "432hz: harmony · 528hz: DNA repair · 963hz: activation", when: "Stated per track" },
  ];

  return (
    <div className="hypno-bg" style={{ background: "#000000", minHeight: "100vh" }}>
      <audio ref={audioRef} src={PLAYLIST[0].url} preload="none" onEnded={nextTrack} />
      <audio ref={vaultRef} preload="none" />

      {/* ANNOUNCEMENT BANNER, fixed height so nav never overlaps it */}
      {!menuOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 400, height: isMobile ? 44 : 48, paddingTop: "env(safe-area-inset-top,0px)", paddingLeft: "14px", paddingRight: "14px", paddingBottom: 0, boxSizing: "border-box", background: "linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", display: "flex", alignItems: "center", justifyContent: "center", gap: isMobile ? 10 : 16, overflow: "hidden" }}>
          <span style={{ fontFamily: "'Jost',sans-serif", fontSize: isMobile ? 14 : 12, fontWeight: 400, color: "#000", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
            Of course, obviously. ✦
          </span>
          <button onClick={() => setWaitlistOpen(true)} style={{ padding: isMobile?"6px 16px":"6px 18px", background: "rgba(0,0,0,0.15)", border: "1px solid rgba(0,0,0,0.2)", borderRadius: 20, color: "#000", fontSize: isMobile ? 14 : 12, fontWeight: 400, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap", fontFamily: "'Jost',sans-serif", letterSpacing: "0.06em" }}>
            Join the waitlist →
          </button>
        </div>
      )}

      {/* NAV */}
      <nav style={{ position: "fixed", top: `calc(${isMobile ? "44px" : "48px"} + env(safe-area-inset-top,0px))`, left: 0, right: 0, zIndex: 300, height: 54, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", background: "rgba(0,0,0,0.97)", borderBottom: "1px solid #1c1828", backdropFilter: "blur(20px)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:9, flex: isMobile ? "0 0 auto" : "1 1 0" }}>
            <img src="/logo_transparent_cropped.png" alt="Self Hypnosis Goddess" width="38" height="38" style={{flexShrink:0, objectFit:"contain", display:"block"}} />
            <span style={{ fontFamily:"'Jost',sans-serif", fontWeight:300, fontSize: "clamp(11px,3.2vw,14px)", letterSpacing: "0.02em", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", maxWidth: isMobile ? "68vw" : "none", color:"#f2ece4" }} onClick={() => window.scrollTo({top:0,behavior:"smooth"})}>Self Hypnosis Goddess</span>
          </div>



        <div style={{ display: "flex", gap: 8, alignItems: "center", flex: "0 0 auto", justifyContent:"flex-end" }}>
          {/* Hamburger, both mobile and desktop */}
          <button onClick={()=>setMenuOpen(m=>!m)} style={{ width:44,height:44,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:5,padding:0,WebkitTapHighlightColor:"transparent",touchAction:"manipulation" }} aria-label="Open menu">
            <div style={{ width:22,height:2,background:"#ffffff",borderRadius:1,transition:"transform 0.2s,opacity 0.2s",transform:menuOpen?"rotate(45deg) translate(5px,5px)":"none" }}/>
            <div style={{ width:22,height:2,background:"#ffffff",borderRadius:1,transition:"opacity 0.2s",opacity:menuOpen?0:1 }}/>
            <div style={{ width:22,height:2,background:"#ffffff",borderRadius:1,transition:"transform 0.2s",transform:menuOpen?"rotate(-45deg) translate(5px,-5px)":"none" }}/>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU, full screen takeover like Steven Bartlett */}
      {menuOpen && (
        <div style={{ position:"fixed",inset:0,zIndex:999,background:"#000",display:"flex",flexDirection:"column",padding:"0 32px 48px" }}>
          {/* Top bar, logo + close */}
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",height:`calc(${isMobile?"98px":"102px"} + env(safe-area-inset-top,0px))`,paddingTop:"env(safe-area-inset-top,0px)" }}>
            <span onClick={()=>{setMenuOpen(false); window.scrollTo({top:0,behavior:"smooth"});}} style={{ fontFamily:"'Jost',sans-serif", fontWeight:300, fontSize:18, letterSpacing:"0.02em", color:"#f2ece4", cursor:"pointer" }}>Self Hypnosis Goddess</span>
            <button onClick={()=>setMenuOpen(false)} style={{ background:"none",border:"none",cursor:"pointer",padding:8,color:"#f2ece4",WebkitTapHighlightColor:"transparent" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="4" y1="4" x2="20" y2="20"/><line x1="20" y1="4" x2="4" y2="20"/></svg>
            </button>
          </div>

          {/* Main nav items, massive */}
          <div style={{ flex:1,display:"flex",flexDirection:"column",justifyContent:"center",gap:0 }}>
            {[
              ["About Reshma",        ()=>{ onLegal?.("about"); setMenuOpen(false); }],
              ["The Science",         ()=>{ onLegal?.("science"); setMenuOpen(false); }],
              ["Preview SHG",         ()=>{ onDemo?.(); setMenuOpen(false); }],
              ["The Library",         ()=>{ onLegal?.("library"); setMenuOpen(false); }],
              ["Pricing",             ()=>{ (() => { const el = document.getElementById("pricing"); if (el) { const y = el.getBoundingClientRect().top + window.pageYOffset - 40; window.scrollTo({top:y, behavior:"smooth"}); } })(); setMenuOpen(false); }],
              ["Blog",                ()=>{ window.location.href="/blog"; setMenuOpen(false); }],
              ["Guides",              ()=>{ window.location.href="/guides"; setMenuOpen(false); }],
              ["Blocks",              ()=>{ window.location.href="/blocks"; setMenuOpen(false); }],
              ["Shop Maxxing Guides", ()=>{ window.open("https://beacons.ai/reshmaoracle","_blank"); setMenuOpen(false); }],
              ["Events · Coming Soon", ()=>{ window.location.href="/events"; setMenuOpen(false); }],
            ].map(([l,fn],i)=>(
              <button key={i} onClick={fn} style={{ display:"block",width:"100%",textAlign:"left",padding:"7px 0",background:"none",border:"none",borderBottom:"1px solid rgba(44,183,167,0.12)",color:"#f2ece4",fontSize:"clamp(17px,4.2vw,26px)",fontWeight:300,letterSpacing:"0.02em",cursor:"pointer",fontFamily:"'Jost',sans-serif",WebkitTapHighlightColor:"transparent",lineHeight:1.15 }}>{l}</button>
            ))}
          </div>

          {/* Bottom, join + sign in */}
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <button onClick={()=>{(() => { const el = document.getElementById("pricing"); if (el) { const y = el.getBoundingClientRect().top + window.pageYOffset - 40; window.scrollTo({top:y, behavior:"smooth"}); } })();setMenuOpen(false);}} style={{ width:"100%",padding:"16px",background:"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)",border:"none",borderRadius:12,color:"#000",fontSize:16,fontWeight:500,cursor:"pointer",fontFamily:"'Jost',sans-serif",letterSpacing:"0.06em",WebkitTapHighlightColor:"transparent" }}>
              Join Now ✦
            </button>
            <button onClick={()=>{onSignIn?.();setMenuOpen(false);}} style={{ width:"100%",padding:"16px",background:"none",border:"1px solid rgba(44,183,167,0.4)",borderRadius:12,color:"#f2ece4",fontSize:16,fontWeight:400,cursor:"pointer",fontFamily:"'Jost',sans-serif",letterSpacing:"0.06em",WebkitTapHighlightColor:"transparent" }}>
              Sign in
            </button>
          </div>
        </div>
      )}

      {/* HERO, full viewport carousel, then player */}
      <div style={{ marginTop: `calc(${isMobile ? "98px" : "102px"} + env(safe-area-inset-top,0px))` }}>

        {/* FULL SCREEN CAROUSEL */}
        <div style={{ height: `calc(100vh - ${isMobile?"98px":"102px"} - env(safe-area-inset-top,0px))`, minHeight: isMobile?480:560, display:"flex", flexDirection:"column", background:"#000" }}>
          <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center" }}>
            <IdentityCarousel cats={[
              { label:"Luckygirlmaxxing",   tagline:"Lucky girl? That's just who I am." },
              { label:"Richgirlmaxxing",       tagline:"I make billions in my sleep." },
              { label:"Lifemaxxing",        tagline:"My highest self is my only self." },
              { label:"Beautymaxxing",      tagline:"Gorgeous is my default." },
              { label:"Lovemaxxing",        tagline:"He only has eyes for me." },
              { label:"Selfmaxxing",        tagline:"I am the main character. Obviously." },
              { label:"Erosmaxxing",        tagline:"I am a goddess in the bedroom." },
              { label:"Bodymaxxing",        tagline:"My body is snatched. Obviously." },
              { label:"Richgirlmaxxing",       tagline:"Billions are my birthright." },
              { label:"Luckygirlmaxxing",   tagline:"Everything always works out for me." },
              { label:"Lovemaxxing",        tagline:"My person finds their way back. Always." },
              { label:"Beautymaxxing",      tagline:"My face is iconic and original." },
              { label:"Bodymaxxing",        tagline:"I am snatched, toned and radiant." },
              { label:"DNAmaxxing",         tagline:"My bloodline remembers." },
              { label:"Sleepmaxxing",       tagline:"I install a new identity every night." },
              { label:"Businessmaxxing",    tagline:"My business is booked, banked and busy." },
              { label:"Singlemaxxing",      tagline:"I am whole. I am enough. I am it." },
              { label:"Facemaxxing",        tagline:"I am the most gorgeous woman in the multiverse." },
              { label:"Selfmaxxing",        tagline:"My energy is magnetic. People know it." },
              { label:"Richgirlmaxxing",       tagline:"I make billions in my sleep." },
              { label:"Lifemaxxing",        tagline:"Highest timeline. Activated." },
              { label:"DNAmaxxing",         tagline:"My cells are rewriting themselves right now." },
              { label:"Beautymaxxing",      tagline:"People stare. I understand. Obviously." },
              { label:"Businessmaxxing",    tagline:"My income is embarrassing. In the best way. Obviously." },
              { label:"Lovemaxxing",        tagline:"He dreams about me. He can't help it." },
              { label:"Selfmaxxing",        tagline:"Luxury is the only standard I know." },
              { label:"Skinnymaxxing",      tagline:"I am snatched, toned and radiant." },
              { label:"Luckygirlmaxxing",   tagline:"I win things I didn't even enter for." },
              { label:"Singlemaxxing",      tagline:"I am so full I don't need anyone to complete me." },
              { label:"Lifemaxxing",        tagline:"I am living my dream reality right now." },
              { label:"Confidencemaxxing",  tagline:"Confidence looks good on me in every room." },
              { label:"Wellnessmaxxing",    tagline:"My body and mind are finally in sync." },
              { label:"Businessmaxxing",    tagline:"The empire everyone said was unrealistic, built." },
              { label:"Luckygirlmaxxing",   tagline:"I'm always in the right place at the right time." },
              { label:"Lovemaxxing",        tagline:"I am the love story I used to only dream about." },
              { label:"Singlemaxxing",      tagline:"I am the prize. I stopped auditioning for it." },
              { label:"Richgirlmaxxing",       tagline:"I'm making $100k a day. Obviously." },
              { label:"Lovemaxxing",        tagline:"He can't imagine his life without me." },
              { label:"Bodymaxxing",        tagline:"My reflection finally matches how I feel inside." },
              { label:"Facemaxxing",        tagline:"My face is my proof of concept." },
              { label:"Sleepmaxxing",       tagline:"I fall asleep her and wake up more her." },
              { label:"Wellnessmaxxing",    tagline:"My nervous system finally feels like home." },
              { label:"Businessmaxxing",    tagline:"Clients chase me now. I don't chase them." },
              { label:"Stylemaxxing",       tagline:"Dressed like the woman who already made it." },
              { label:"Lovemaxxing",        tagline:"The love I asked for found its way to me." },
              { label:"Beautymaxxing",      tagline:"I turn heads without asking for it." },
              { label:"Sovereignmaxxing",   tagline:"I answer to no one but myself." },
              { label:"Businessmaxxing",    tagline:"My empire built itself while I slept." },
              { label:"Lifemaxxing",        tagline:"My whole life feels like it's finally catching up to me." },
              { label:"Richgirlmaxxing",       tagline:"Opportunities pay me to show up." },
              { label:"DNAmaxxing",         tagline:"Ageless. Radiant. Undeniable." },
              { label:"Lovemaxxing",        tagline:"He remembers me even when I'm not there." },
              { label:"DNAmaxxing",         tagline:"My bloodline stops repeating itself, starting with me." },
              { label:"Sleepmaxxing",       tagline:"Every night is another install." },
              { label:"Confidencemaxxing",  tagline:"I don't shrink. I never did." },
              { label:"Healthmaxxing",        tagline:"I healed the version of me that needed this most." },
              { label:"Confidencemaxxing",  tagline:"I walk in like I already own the room." },
              { label:"Richgirlmaxxing",       tagline:"Wealth is just who I am now." },
              { label:"Erosmaxxing",        tagline:"I know my own power in the bedroom." },
              { label:"Peacemaxxing",       tagline:"I am the calm in every room I enter." },
              { label:"Skinnymaxxing",      tagline:"I trust my body to know what it's doing." },
              { label:"Selfmaxxing",        tagline:"I stopped shrinking. I don't fit in boxes anymore." },
              { label:"Sleepmaxxing",       tagline:"I do my best manifesting unconscious." },
              { label:"Stylemaxxing",       tagline:"Every outfit says I already know." },
              { label:"Beautymaxxing",      tagline:"Compliments find me without me asking." },
              { label:"Sleepmaxxing",       tagline:"I manifest more in eight hours than most do all day." },
              { label:"Luckygirlmaxxing",   tagline:"Doors open before I even knock." },
              { label:"Richgirlmaxxing",       tagline:"Money finds me out of thin air." },
              { label:"Beautymaxxing",      tagline:"I became the face I used to manifest." },
              { label:"Intuitionmaxxing",   tagline:"I trust myself before anyone else." },
              { label:"Richgirlmaxxing",       tagline:"I am a magnet for unexpected income." },
              { label:"Luckygirlmaxxing",   tagline:"I win things I didn't even enter for." },
              { label:"Singlemaxxing",      tagline:"I fell in love with my own company." },
              { label:"Richgirlmaxxing",       tagline:"I'm making $5k a day and it's only the beginning." },
              { label:"Friendmaxxing",      tagline:"My circle finally deserves me." },
              { label:"Richgirlmaxxing",       tagline:"Six figures. Then seven. Then I stopped counting." },
              { label:"Erosmaxxing",        tagline:"I am irresistible. I know it. He knows it." },
              { label:"Desiresmaxxing",      tagline:"My desires are already done deals." },
              { label:"Bodymaxxing",        tagline:"Strong, lean, undeniable." },
              { label:"Desiresmaxxing",      tagline:"Everything I want is rushing toward me." },
              { label:"Healthmaxxing",        tagline:"What used to hurt doesn't run me anymore." },
              { label:"Lovemaxxing",        tagline:"He chooses me. Every single day." },
              { label:"Singlemaxxing",      tagline:"I'm dating myself first. Everyone else can wait." },
              { label:"Peacemaxxing",       tagline:"Nothing shakes me anymore." },
              { label:"Selfmaxxing",        tagline:"I am the standard other women measure against." },
              { label:"Lovemaxxing",        tagline:"He shows up exactly when I need him to." },
              { label:"Bodymaxxing",        tagline:"My body listens to me now." },
              { label:"Sleepmaxxing",       tagline:"My reality shifts while I dream." },
              { label:"Erosmaxxing",        tagline:"Seduction is second nature to me now." },
              { label:"Beautymaxxing",      tagline:"My skin glows without trying." },
              { label:"Studymaxxing",       tagline:"I know it before I've even revised it." },
              { label:"Singlemaxxing",      tagline:"Peace found me when I stopped looking for it." },
              { label:"Erosmaxxing",        tagline:"He can't stop thinking about last night." },
              { label:"Desiresmaxxing",      tagline:"Desired. Received. Obviously." },
              { label:"Selfmaxxing",        tagline:"I am the version of me I used to pray for." },
              { label:"Richgirlmaxxing",       tagline:"I open my banking app and smile. Every time." },
              { label:"Erosmaxxing",        tagline:"I know exactly what I want in the bedroom." },
              { label:"Skinnymaxxing",      tagline:"The weight came off like it was never mine to keep." },
                        ]} fullscreen={true} />
          </div>
        </div>

        {/* TWO LINES ABOVE PLAYER */}
        <div style={{ background:"#000", paddingTop: isMobile?24:32, paddingBottom:0, textAlign:"center", width:"100%" }}>
          <div style={{ fontSize: isMobile?"clamp(28px,8vw,48px)":"clamp(36px,4.5vw,72px)", color:"#f2ece4", fontFamily:"'Jost',sans-serif", fontWeight:300, letterSpacing:"-0.01em", lineHeight:1.05, marginBottom:16, padding: isMobile?"0 16px":"0 20px", width:"100%" }}>Spotify for your subconscious mind.</div>
          {/* GRADIENT BOX */}
          <div style={{ margin:"0 auto 12px", padding: isMobile?"14px 24px":"18px 40px", background:"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", borderRadius:40, width: isMobile?"90%":"100%", maxWidth:"100%" }}>
            <div style={{ fontSize: isMobile?"clamp(18px,5vw,28px)":"clamp(22px,2.8vw,36px)", fontFamily:"'Jost',sans-serif", fontWeight:300, letterSpacing:"-0.01em", lineHeight:1.2, color:"#000" }}>Reprogram your mind from stuck to unstoppable.</div>
            <div style={{ fontSize: isMobile?13:15, fontFamily:"'Jost',sans-serif", fontWeight:300, marginTop:8, color:"#000" }}>Shift your identity. Shift your reality.</div>
          </div>
        </div>

        {/* SPOTIFY-STYLE PLAYER */}
        <div style={{ background:"#000", padding: isMobile?"12px 14px 20px":"32px 24px 48px" }}>
          <div style={{ background: "#0a0a0a", border: "1px solid rgba(42,168,154,0.35)", borderRadius: isMobile?14:22, padding: isMobile ? "16px" : "36px 44px", maxWidth: isMobile?"100%":780, margin: "0 auto", boxShadow: "0 12px 60px rgba(0,0,0,0.5)", overflow: "visible" }}>
            {/* Top row, track info + waveform */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ width:isMobile?52:88, height:isMobile?52:88, borderRadius:isMobile?10:16, background:"#0a0a0a", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", border:"1px solid rgba(42,168,154,0.15)" }}>
                <img src="/logo_transparent_cropped.png" alt="Self Hypnosis Goddess" width={isMobile?34:64} height={isMobile?34:64} style={{flexShrink:0, objectFit:"contain", display:"block"}} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: isMobile ? 15 : 24, fontWeight: 400, color: "#f2ece4", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentTrack?.title || "I Am The Luckiest Woman In This Universe"}</div>
                <div style={{ fontSize: isMobile?12:16, color: "#2CB7A7", fontFamily: "'Jost',sans-serif", fontWeight: 400, letterSpacing: "0.06em" }}>Reshma Oracle</div>
                <div style={{ fontSize: 12, color: "#ddd0c8", fontFamily: "'Jost',sans-serif", marginTop: 2 }}>{currentTrack?.sub}{currentTrack?.sub && currentTrack?.freq ? " · " : ""}{currentTrack?.freq || "Hypnosis · 528hz"}</div>
              </div>
              {playing && (
                <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(42,168,154,0.12)", border: "1px solid rgba(42,168,154,0.3)", borderRadius: 20, padding: "4px 10px", flexShrink: 0 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2CB7A7", animation: "pulse 1.2s ease-in-out infinite" }}/>
                  <span style={{ fontSize: 11, color: "#2CB7A7", fontFamily: "'Jost',sans-serif", fontWeight: 700 }}>LIVE</span>
                </div>
              )}
            </div>
            {/* Logo mark, replaces progress bar */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14, gap:12 }}>
              <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.06)" }}/>
              <img src="/logo_transparent_cropped.png" alt="Self Hypnosis Goddess" width={44} height={44} style={{ opacity: playing ? 1 : 0.6, transition:"opacity 0.4s", objectFit:"contain", display:"block"}} />
              <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.06)" }}/>
            </div>
            {/* Controls */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"4px 4px 0", overflow:"visible" }}>
              <button title="Share (coming soon)" style={{ background:"none", border:"none", cursor:"default", padding:8, opacity:0.3, lineHeight:0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2CB7A7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg>
              </button>
              <button onClick={prevTrack} title="Previous track" style={{ background:"rgba(44,183,167,0.1)", border:"none", borderRadius:"50%", width:40, height:40, cursor:"pointer", padding:8, lineHeight:0, display:"flex", alignItems:"center", justifyContent:"center", transition:"background 0.15s" }} onMouseEnter={e=>e.currentTarget.style.background="rgba(44,183,167,0.22)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(44,183,167,0.1)"}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#2CB7A7"><path d="M19 20L9 12l10-8v16z"/><rect x="5" y="4" width="2.5" height="16" rx="1" fill="#2CB7A7"/></svg>
              </button>
              <button onClick={togglePlay} title={playing ? "Pause" : "Play"} style={{ width:50, height:50, borderRadius:"50%", background:"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 24px rgba(42,168,154,0.45)", flexShrink:0, lineHeight:0, overflow:"visible", transition:"transform 0.15s" }} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.06)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
                {playing
                  ? <svg width="20" height="20" viewBox="0 0 24 24" fill="#000"><rect x="6" y="4" width="4" height="16" rx="1.5"/><rect x="14" y="4" width="4" height="16" rx="1.5"/></svg>
                  : <svg width="20" height="20" viewBox="0 0 24 24" fill="#000"><polygon points="7 3 21 12 7 21 7 3"/></svg>
                }
              </button>
              <button onClick={nextTrack} title="Next track" style={{ background:"rgba(44,183,167,0.1)", border:"none", borderRadius:"50%", width:40, height:40, cursor:"pointer", padding:8, lineHeight:0, display:"flex", alignItems:"center", justifyContent:"center", transition:"background 0.15s" }} onMouseEnter={e=>e.currentTarget.style.background="rgba(44,183,167,0.22)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(44,183,167,0.1)"}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#2CB7A7"><path d="M5 4l10 8-10 8V4z"/><rect x="16.5" y="4" width="2.5" height="16" rx="1" fill="#2CB7A7"/></svg>
              </button>
              <button title="Repeat (coming soon)" style={{ background:"none", border:"none", cursor:"default", padding:8, opacity:0.3, lineHeight:0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2CB7A7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
              </button>
            </div>
            {/* Track dots */}
            <div style={{ display:"flex", justifyContent:"center", gap:6, marginTop:12 }}>
              {PLAYLIST.map((_,i) => (
                <button key={i} onClick={()=>loadTrack(i)} style={{ width: i===trackIdx?18:6, height:6, borderRadius:3, background: i===trackIdx?"#2CB7A7":"rgba(42,168,154,0.2)", border:"none", cursor:"pointer", padding:0, transition:"all 0.25s" }}/>
              ))}
            </div>
            <div style={{ textAlign:"center", marginTop:12, fontSize:11, color:"#ddd0c8", fontFamily:"'Jost',sans-serif" }}>
              {playing ? "✦ Playing, continues in background" : "Tap play to listen, free preview"}
            </div>
          </div>
        </div>
      </div>

      {/* LOGO, mark above Self Hypnosis Goddess / Audio Library */}
      <div style={{ background:"#000", paddingTop: isMobile?32:48, display:"flex", justifyContent:"center", alignItems:"center" }}>
        <img src="/logo_transparent_cropped.png" alt="Self Hypnosis Goddess" width={isMobile?100:140} height={isMobile?100:140} style={{flexShrink:0, objectFit:"contain", display:"block"}} />
      </div>

      {/* BRAND BLOCK, immediately after player, so people know what this IS before we explain how it works */}
      <div id="audio-library" style={{ background:"#000", padding: isMobile?"40px 24px":"56px 48px", textAlign:"center" }}>
        <div style={{ fontSize: isMobile?"clamp(32px,9vw,44px)":"clamp(44px,5.5vw,64px)", color:"#ffffff", lineHeight:1.0, fontFamily:"'Jost',sans-serif", fontWeight:300, letterSpacing:"0em", marginBottom:16 }}>
          Self Hypnosis Goddess
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
          <div style={{ fontSize: isMobile?24:36, letterSpacing:"0.12em", textTransform:"uppercase", background:"linear-gradient(110deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)", WebkitBackgroundClip:"text", backgroundClip:"text", WebkitTextFillColor:"transparent", fontFamily:"'Jost',sans-serif", fontWeight:400, display:"inline-block", textAlign:"center" }}>Audio Library</div>
          <div style={{ fontSize: isMobile?13:16, letterSpacing:"0.2em", textTransform:"uppercase", background:"linear-gradient(110deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)", WebkitBackgroundClip:"text", backgroundClip:"text", WebkitTextFillColor:"transparent", fontFamily:"'Jost',sans-serif", fontWeight:400, display:"inline-block", textAlign:"center" }}>+ ProofOS ✦</div>
        </div>
      </div>

      {/* DELULU IS THE SOLULU */}
      <div style={{ background:"#000", padding: isMobile?"48px 24px 56px":"56px 48px 64px", textAlign:"center" }}>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize: isMobile?"clamp(28px,8vw,40px)":"clamp(36px,4.5vw,52px)", background:"linear-gradient(110deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)", WebkitBackgroundClip:"text", backgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"-0.01em" }}>
          Delulu is the solulu.
        </div>
      </div>

      {/* APP PREVIEW, dashboard mockup with dark/light toggle */}
      <AppPreviewSection isMobile={isMobile} />

      {/* FORMULA */}
      <div style={{ background:"#000", padding: isMobile?"0 20px 56px":"12px 48px 64px", textAlign:"center" }}>
        {/* Lucky Girl gradient border via padding trick */}
        <div style={{ display:"inline-block", background:"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", borderRadius:16, padding:"2px" }}>
          <div style={{ background:"#000", borderRadius:14, padding: isMobile?"20px 20px":"28px 48px" }}>
        <div style={{ fontSize: isMobile?"clamp(12px,3.2vw,16px)":"clamp(16px,1.6vw,22px)", fontWeight:400, fontFamily:"'Jost',sans-serif", letterSpacing:"0em", lineHeight:1.5, display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"center", gap: isMobile?"6px 6px":"0 10px" }}>
          {[
            { t:"Hypnosis",        c:"#F5E0A0" },
            { t:"+",               c:"rgba(232,224,216,0.35)", op:true },
            { t:"Subliminals",     c:"#E8B870" },
            { t:"+",               c:"rgba(232,224,216,0.35)", op:true },
            { t:"Melodic House",   c:"#BFA5D8" },
            { t:"+",               c:"rgba(232,224,216,0.35)", op:true },
            { t:"EMDR",            c:"#2CB7A7" },
            { t:"+",               c:"rgba(232,224,216,0.35)", op:true },
            { t:"Binaural Beats",  c:"#2CB7A7" },
            { t:"=",               c:"rgba(232,224,216,0.35)", op:true },
            { t:"Theta on demand.", c:"#fff", result:true },
          ].map((item,i)=>(
            item.op
              ? <span key={i} style={{ color:item.c, fontWeight:300 }}>{item.t}</span>
              : item.result
              ? <span key={i} style={{ background:"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", WebkitBackgroundClip:"text", backgroundClip:"text", WebkitTextFillColor:"transparent", fontWeight:400 }}>{item.t}</span>
              : <span key={i} style={{ color:item.c }}>{item.t}</span>
          ))}
        </div>
          </div>
        </div>
      </div>

            {/* THREE CTAs, Preview / Join Now / Lifetime, all in one place */}
      <div style={{ background:"#000", padding: isMobile?"48px 24px 56px":"64px 48px 72px", display:"flex", flexDirection:"column", alignItems:"center", gap:16 }}>
        <button onClick={onDemo} style={{ display:"inline-block", padding: isMobile?"18px 40px":"22px 56px", background:"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", border:"none", borderRadius:40, color:"#000", fontSize: isMobile?"clamp(16px,5vw,20px)":"clamp(18px,2vw,22px)", fontFamily:"'Jost',sans-serif", fontWeight:400, letterSpacing:"0.02em", cursor:"pointer" }}>
          👁 Preview Audio Library
        </button>
        <div style={{ fontSize:11, color:"rgba(232,184,112,0.85)", letterSpacing:"0.1em", textTransform:"uppercase", marginTop:-6 }}>Beta, still being built</div>
        <button onClick={()=>onLegal?.("science")} style={{ display:"inline-block", padding: isMobile?"14px 36px":"18px 48px", background:"linear-gradient(135deg,rgba(245,224,160,0.55) 0%,rgba(232,184,112,0.55) 20%,rgba(191,165,216,0.55) 52%,rgba(44,183,167,0.55) 78%,rgba(22,122,107,0.55) 100%)", border:"none", borderRadius:40, color:"rgba(253,240,232,0.9)", fontSize: isMobile?"clamp(17px,5vw,20px)":"clamp(18px,2vw,22px)", fontFamily:"'Jost',sans-serif", fontWeight:400, cursor:"pointer", letterSpacing:"0.02em" }}>Read the science behind this →</button>
        <div style={{ display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center" }}>
          <button onClick={()=>(() => { const el = document.getElementById("pricing"); if (el) { const y = el.getBoundingClientRect().top + window.pageYOffset - 40; window.scrollTo({top:y, behavior:"smooth"}); } })()} style={{ padding:"14px 30px", background:"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", border:"none", borderRadius:30, color:"#000", fontSize:14, fontFamily:"'Jost',sans-serif", fontWeight:500, letterSpacing:"0.04em", cursor:"pointer" }}>
            Join Now ✦
          </button>
          <button onClick={()=>(() => { const el = document.getElementById("pricing"); if (el) { const y = el.getBoundingClientRect().top + window.pageYOffset - 40; window.scrollTo({top:y, behavior:"smooth"}); } })()} style={{ padding:"14px 30px", background:"none", border:"1.5px solid #2CB7A7", borderRadius:30, color:"#f2ece4", fontSize:14, fontFamily:"'Jost',sans-serif", fontWeight:400, letterSpacing:"0.04em", cursor:"pointer" }}>
            Lifetime Access
          </button>
        </div>
      </div>

      {/* HOW IT WORKS, LG gradient background getting darker, white boxes */}
      <div style={{ background:"linear-gradient(180deg,#F5E0A0 0%,#E8B870 25%,#BFA5D8 55%,#2CB7A7 80%,#167A6B 100%)", width:"100%", padding: isMobile?"72px 20px 88px":"104px 80px 120px" }}>
        <div style={{ maxWidth:720, margin:"0 auto" }}>

          {/* Heading, centered, dark text on light gradient top */}
          <div style={{ marginBottom: isMobile?48:72, textAlign:"center", width:"100%" }}>
            <div style={{ fontSize:"clamp(36px,5vw,64px)", letterSpacing:"-0.02em", color:"#000", marginBottom:16, fontFamily:"'Jost',sans-serif", textAlign:"center", fontWeight:300, lineHeight:1 }}>The Method.</div>
            <div style={{ fontSize: isMobile?14:15, fontWeight:400, color:"#000", fontFamily:"'Jost',sans-serif", letterSpacing:"0.02em", lineHeight:1.6, marginBottom:20, textAlign:"center", opacity:.7 }}>Your beliefs are running on old programming. Self hypnosis replaces them at the source, in theta, where the subconscious accepts the upgrade without resistance.</div>
            <div style={{ fontSize: isMobile?"clamp(32px,8vw,48px)":"clamp(44px,4.5vw,64px)", fontWeight:400, color:"#000", fontFamily:"'Jost',sans-serif", letterSpacing:"-0.02em", lineHeight:1.05, marginBottom:12, textAlign:"center" }}>Theta state doesn't require sleep. Press play and you're there in minutes.</div>
            <div style={{ fontSize: isMobile?15:17, color:"#000", fontFamily:"'Jost',sans-serif", textAlign:"center" }}>No waiting for bedtime. No perfect conditions. Here's exactly what happens when you press play.</div>
          </div>

          {/* Beta → Theta → Identity boxes */}
          <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr":"1fr auto 1fr auto 1fr", alignItems:"center", gap: isMobile?12:0, marginBottom: isMobile?48:72 }}>

            {/* BETA, solid dark grey, white text fully readable */}
            <div style={{ background:"#2a2a2a", border:"1px solid rgba(255,255,255,0.12)", borderRadius:20, padding: isMobile?"28px 16px":"40px 28px", textAlign:"center" }}>
              <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#ffffff", marginBottom:10, fontFamily:"'Jost',sans-serif" }}>Where you start</div>
              <div style={{ fontSize: isMobile?32:44, fontWeight:500, color:"#ffffff", fontFamily:"'Jost',sans-serif", marginBottom:6 }}>Beta</div>
              <div style={{ fontSize:13, color:"#ffffff", fontFamily:"'Jost',sans-serif", marginBottom:12 }}>13–40 Hz</div>
              <div style={{ fontSize:14, color:"#ffffff", fontFamily:"'Jost',sans-serif", lineHeight:1.65 }}>The critical mind is active. Affirmations bounce off. Nothing installs here.</div>
            </div>

            <div style={{ fontSize: isMobile?28:34, color:"#000", textAlign:"center", padding: isMobile?"8px 0":"0 16px", fontWeight:700 }}>{isMobile?"↓":"→"}</div>

            {/* THETA, green/teal, bold, clearly transitioning */}
            <div style={{ background:"linear-gradient(135deg,#0d3b35 0%,#134f47 50%,#1a6b60 100%)", border:"2px solid #2CB7A7", borderRadius:20, padding: isMobile?"28px 16px":"40px 28px", textAlign:"center" }}>
              <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#ffffff", marginBottom:10, fontFamily:"'Jost',sans-serif" }}>SHG gets you here</div>
              <div style={{ fontSize: isMobile?32:44, fontWeight:500, color:"#ffffff", fontFamily:"'Jost',sans-serif", marginBottom:6 }}>Theta</div>
              <div style={{ fontSize:13, color:"#ffffff", fontFamily:"'Jost',sans-serif", marginBottom:12 }}>4–8 Hz</div>
              <div style={{ fontSize:14, color:"#ffffff", fontFamily:"'Jost',sans-serif", lineHeight:1.65 }}>The subconscious opens. New beliefs install without resistance.</div>
            </div>

            <div style={{ fontSize: isMobile?28:34, color:"#000", textAlign:"center", padding: isMobile?"8px 0":"0 16px", fontWeight:700 }}>{isMobile?"↓":"→"}</div>

            {/* IDENTITY, full LG gradient, maximum brightness, thick bold text */}
            <div style={{ background:"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", borderRadius:20, padding: isMobile?"28px 16px":"40px 28px", textAlign:"center", boxShadow:"0 16px 64px rgba(44,183,167,0.45), 0 4px 20px rgba(245,224,160,0.3)" }}>
              <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#000", marginBottom:10, fontFamily:"'Jost',sans-serif" }}>The result</div>
              <div style={{ fontSize: isMobile?36:52, fontWeight:400, color:"#000", fontFamily:"'Jost',sans-serif", marginBottom:6, letterSpacing:"-0.02em" }}>Identity</div>
              <div style={{ fontSize:13, color:"#000", fontFamily:"'Jost',sans-serif", marginBottom:12 }}>Installed. ✦</div>
              <div style={{ fontSize:15, color:"#000", fontFamily:"'Jost',sans-serif", lineHeight:1.65, fontWeight:600 }}>Your new self-concept runs automatically. Reality follows. Of course, obviously.</div>
            </div>

          </div>

          {/* HOW IT WORKS — accordion redesign */}
          <div style={{ textAlign:"center", margin: isMobile?"48px 0 40px":"72px 0 56px" }}>
            <div style={{ fontSize: isMobile?"clamp(48px,10vw,72px)":"clamp(56px,7vw,88px)", fontWeight:300, color:"#000", fontFamily:"'Jost',sans-serif", letterSpacing:"-0.03em", lineHeight:1.0, background:"linear-gradient(135deg,#1a1a1a,#2a2a2a)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>How it works.</div>
            <div style={{ fontSize: isMobile?15:17, color:"#000", fontFamily:"'Jost',sans-serif", marginTop:12, opacity:.65 }}>Here's exactly what happens inside every session.</div>
          </div>

          {/* Accordion */}
          <HowItWorksAccordion isMobile={isMobile} />

        </div>
      </div>

      {/* LUCKY GIRL TIMELINE */}
      <LuckyGirlTimeline isMobile={isMobile} />

      {/* PROOFOS INTRO */}
      <ProofOSBanner isMobile={isMobile}/>

      {/* LANDING PROOF WALL, exact mirror of the live dashboard */}
      <LandingProofWall isMobile={isMobile}/>


      {/* MELODIC HOUSE USP, LG gradient background */}
      <div style={{ padding: isMobile ? "72px 20px" : "104px 60px", background: "linear-gradient(180deg,#F5E0A0 0%,#E8B870 25%,#BFA5D8 55%,#2CB7A7 80%,#167A6B 100%)", width: "100%" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ background: "transparent", border: "none", borderRadius: 20, padding: isMobile?"28px 0":"36px 0", position: "relative" }}>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 13, color: "#000", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 14, textAlign: "center", fontFamily:"'Jost',sans-serif", fontWeight:600 }}>What makes this different</div>
            <h2 style={{ fontSize: isMobile?"clamp(32px,9vw,52px)":"clamp(44px,5.5vw,72px)", lineHeight: 1.05, marginBottom: 20, color: "#0a0a0a", textAlign: "center", fontFamily:"'Jost',sans-serif", fontWeight:400, letterSpacing:"-0.02em" }}>
              Most hypnosis is boring.<br/>This is different.
            </h2>
            <p style={{ fontSize: isMobile?17:21, color: "#000", lineHeight: 1.85, marginBottom: 16, maxWidth: 680, textAlign: "center", margin: "0 auto 16px", fontFamily:"'Jost',sans-serif", fontWeight:400 }}>
              Monotone voice. Generic ambient sound. You fall asleep in two minutes and nothing changes. Most hypnosis feels like a task, not a ritual.
            </p>
            <p style={{ fontSize: isMobile?17:21, color: "#000", lineHeight: 1.85, marginBottom: 16, maxWidth: 680, textAlign: "center", margin: "0 auto 16px", fontFamily:"'Jost',sans-serif", fontWeight:400 }}>
              This is the only one that makes listening feel like a daily ritual. Hypnosis and subliminals layered beneath melodic house music, EMDR and binaural beats, produced to keep you coming back.
            </p>
            <p style={{ fontSize: isMobile?18:22, color: "#0a0a0a", lineHeight: 1.7, marginBottom: 28, maxWidth: 680, textAlign: "center", margin: "0 auto 28px", fontFamily:"'Jost',sans-serif", fontWeight:400 }}>
              Save yourself thousands in therapy sessions.
            </p>

                        {/* SIX FORMATS, clean white card, 2-col grid, no overlapping visuals */}
            <div style={{ background:"#ffffff", borderRadius:20, padding: isMobile?"28px 20px":"48px 48px", maxWidth:760, margin:"0 auto 40px", border:"none" }}>
              <div style={{ fontSize:12, letterSpacing:"0.28em", textTransform:"uppercase", color:"#000", marginBottom:12, textAlign:"center", fontFamily:"'Jost',sans-serif", fontWeight:600 }}>Six formats</div>
              <div style={{ fontSize: isMobile?"clamp(28px,7vw,36px)":"clamp(32px,3.5vw,44px)", color:"#000", fontFamily:"'Jost',sans-serif", fontWeight:400, textAlign:"center", marginBottom: isMobile?28:36, letterSpacing:"-0.02em", lineHeight:1.1 }}>Each does something different.</div>
              <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr":"1fr 1fr", gap: isMobile?16:20 }}>
                {[
                  { label:"Melodic House",     sub:"Reshma's voice layered beneath original melodic house music. You listen like a song, it rewires you beneath the surface.", color:"#2CB7A7", dot:"#2CB7A7" },
                  { label:"Voice Only",       sub:"Pure vocal hypnosis, no music. Just Reshma's voice, speaking directly to your subconscious. Raw and immersive.", color:"#E8B870", dot:"#E8B870" },
                  { label:"Sleep & Rest",     sub:"Calm audio for winding down or sleeping, ambient, white noise, or soft sound. Subliminals layered throughout. Designed to run all night.", color:"#BFA5D8", dot:"#BFA5D8" },
                  { label:"Subliminal",       sub:"No audible voice. Affirmations encoded beneath the sound. Works while you sleep, rest, or move through your day.", color:"#2CB7A7", dot:"#2CB7A7" },
                  { label:"EMDR Hypnosis",    sub:"Bilateral audio stimulation dissolves old identity blocks at their root. Deep identity reset in a single session.", color:"#167A6B", dot:"#167A6B" },
                  { label:"Binaural / Reiki", sub:"Two tones syncing both hemispheres into theta, layered with Solfeggio frequencies and Reiki-encoded energy.", color:"#BFA5D8", dot:"#BFA5D8" },
                ].map((f,i)=>(
                  <div key={i} style={{ display:"flex", gap:14, alignItems:"flex-start", padding:"20px 22px", background:"#ffffff", borderRadius:14, border:"1px solid rgba(0,0,0,0.06)", borderLeft:`3px solid ${f.dot}`, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:f.dot, flexShrink:0, marginTop:6 }}/>
                    <div>
                      <div style={{ fontSize: isMobile?17:20, fontWeight:600, color:"#000", marginBottom:8, fontFamily:"'Jost',sans-serif" }}>{f.label}</div>
                      <div style={{ fontSize: isMobile?14:16, color:"#444", lineHeight:1.7, fontFamily:"'Jost',sans-serif" }}>{f.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FREQUENCIES, white card, clean horizontal bars */}
            <div style={{ background:"#ffffff", borderRadius:20, padding: isMobile?"28px 20px":"48px 48px", maxWidth:760, margin:"0 auto", boxShadow:"0 4px 32px rgba(0,0,0,0.12)" }}>
              <div style={{ fontSize:12, letterSpacing:"0.28em", textTransform:"uppercase", color:"#000", marginBottom:12, textAlign:"center", fontFamily:"'Jost',sans-serif", fontWeight:600 }}>Solfeggio Frequencies</div>
              <div style={{ fontSize: isMobile?"clamp(28px,7vw,36px)":"clamp(32px,3.5vw,44px)", color:"#000", fontFamily:"'Jost',sans-serif", fontWeight:400, textAlign:"center", marginBottom: isMobile?28:36, letterSpacing:"-0.02em", lineHeight:1.1 }}>Every track is tuned to a frequency.</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {[
                  { hz:"963hz", name:"Activation",    assoc:"Pineal gland activation · higher connection",  pct:100 },
                  { hz:"852hz", name:"Intuition",      assoc:"Returning to spiritual order",                 pct:90 },
                  { hz:"741hz", name:"Expression",     assoc:"Awakening intuition · problem solving",        pct:80 },
                  { hz:"639hz", name:"Connection",     assoc:"Relationships · harmonising with others",      pct:70 },
                  { hz:"528hz", name:"Transformation", assoc:"The love frequency, repair · DNA · abundance",pct:62 },
                  { hz:"432hz", name:"Harmony",        assoc:"Natural tuning · calm · coherence",            pct:54 },
                  { hz:"417hz", name:"Change",         assoc:"Undoing situations · facilitating change",     pct:46 },
                  { hz:"396hz", name:"Liberation",     assoc:"Releasing fear and guilt",                     pct:38 },
                  { hz:"285hz", name:"Restoration",    assoc:"Tissue and energy field repair",               pct:28 },
                  { hz:"174hz", name:"Foundation",     assoc:"Pain relief · safety · grounding",             pct:18 },
                ].map((row,i)=>{
                  const LGb = "linear-gradient(90deg,#167A6B 0%,#2CB7A7 25%,#BFA5D8 50%,#E8B870 75%,#F5E0A0 100%)";
                  return (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap: isMobile?10:16 }}>
                    <div style={{ fontSize: isMobile?13:16, fontWeight:700, color:"#000", width: isMobile?52:72, flexShrink:0, fontFamily:"'Jost',sans-serif" }}>{row.hz}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                        <div style={{ fontSize: isMobile?14:17, fontWeight:600, color:"#000", fontFamily:"'Jost',sans-serif" }}>{row.name}</div>
                        <div style={{ fontSize: isMobile?12:14, color:"#555", fontFamily:"'Jost',sans-serif" }}>{row.assoc}</div>
                      </div>
                      <div style={{ height:6, background:"#f0f0f0", borderRadius:3, overflow:"hidden" }}>
                        <div style={{ width:`${row.pct}%`, height:"100%", background:LGb, borderRadius:3 }}/>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
              <p style={{ fontSize:12, color:"#555", textAlign:"center", marginTop:24, lineHeight:1.6, fontFamily:"'Jost',sans-serif" }}>
                Binaural beats layered beneath every track sync both hemispheres into theta, where the reprogramming begins.
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* HAWKINS SCALE, measurement tool shown in the dashboard */}
      <div style={{ padding: isMobile?"56px 18px":"88px 24px", background:"#000", width:"100%" }}>
        <div style={{ maxWidth: 720, margin:"0 auto", textAlign:"center" }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 20, background:"linear-gradient(135deg,#F5E0A0,#E8B870,#BFA5D8)", WebkitBackgroundClip:"text", backgroundClip:"text", WebkitTextFillColor:"transparent", display:"inline-block" }}>Your emotional state, measured</div>
          <h2 style={{ fontFamily:"'Jost',sans-serif", fontStyle:"normal", fontSize: isMobile?"clamp(36px,9vw,52px)":"clamp(48px,5vw,68px)", color:"#f2ece4", fontWeight:400, marginBottom:24, lineHeight:1.05, textAlign:"center" }}>
            The Hawkins Scale.
          </h2>
          <p style={{ fontSize: isMobile?16:19, color:theme==="dark"?"#e8e0d8":"#000000", lineHeight:1.85, maxWidth:600, margin:"0 auto 12px", fontFamily:"'Jost',sans-serif" }}>
            Your emotional state is not a feeling, it's a frequency. And your heart broadcasts it. Every intention you log in ProofOS gets tagged against this 17-level scale. As you listen, your baseline climbs. Your heart rhythm shifts. Your brain follows. Watch the evidence build, not just in what arrives, but in where you are when it does.
          </p>
          <p style={{ fontSize: isMobile?"clamp(22px,5.5vw,28px)":"clamp(26px,2.8vw,36px)", color:"#f2ece4", lineHeight:1.4, maxWidth:580, margin:"0 auto 40px", fontFamily:"'Jost',sans-serif", fontWeight:400, letterSpacing:"-0.01em" }}>
            SHG doesn't just install beliefs. It shifts the state you broadcast from.
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:4, maxWidth:520, margin:"0 auto 32px" }}>
            {[
              {n:"Enlightenment",v:700, c:"#F5E0A0"},
              {n:"Peace",       v:600, c:"#F5E0A0"},
              {n:"Joy",         v:540, c:"#F5E0A0"},
              {n:"Love",        v:500, c:"#F5E0A0"},
              {n:"Reason",      v:400, c:"#2CB7A7"},
              {n:"Acceptance",  v:350, c:"#2CB7A7"},
              {n:"Willingness", v:310, c:"#BFA5D8"},
              {n:"Neutrality",  v:250, c:"#BFA5D8"},
              {n:"Courage",     v:200, c:"#E8B870"},
              {n:"Pride",       v:175, c:"#E8B870"},
              {n:"Anger",       v:150, c:"#c94040"},
              {n:"Desire",      v:125, c:"#d0812f"},
              {n:"Fear",        v:100, c:"#c66a2e"},
              {n:"Grief",       v:75,  c:"#b8562f"},
              {n:"Apathy",      v:50,  c:"#a8432a"},
              {n:"Guilt",       v:30,  c:"#9c2b2b"},
              {n:"Shame",       v:20,  c:"#7a1f1f"},
            ].map((h,i)=>{
              return (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"6px 4px" }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:h.c, flexShrink:0, boxShadow:h.v>=600?`0 0 10px ${h.c}, 0 0 20px ${h.c}66`:h.v>=200?`0 0 6px ${h.c}88`:"none" }}/>
                <div style={{ flex:1, height:6, borderRadius:3, background:"rgba(255,255,255,0.08)", overflow:"hidden" }}>
                  <div style={{ width:`${(h.v/700)*100}%`, height:"100%", background:h.c, opacity:h.v>=600?1:h.v>=200?0.85:0.65, boxShadow:h.v>=600?`0 0 8px ${h.c}`:"none" }}/>
                </div>
                <span style={{ fontSize:12, color: h.v>=200?"#f2ece4":theme==="dark"?"#e8e0d8":"#000000", width:100, textAlign:"left", fontFamily:"'Jost',sans-serif" }}>{h.n}</span>
                <span style={{ fontSize:11, color:theme==="dark"?"#e8e0d8":"#000000", width:32, textAlign:"right" }}>{h.v}</span>
              </div>
              );
            })}
          </div>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"8px 18px", background:"rgba(232,184,112,0.1)", border:"1px solid rgba(232,184,112,0.3)", borderRadius:20 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:"#E8B870" }}/>
            <span style={{ fontSize:12, color:"#f2ece4" }}>200, Courage, is the line. Below it, you're contracting. Above it, you're expanding.</span>
          </div>
        </div>
      </div>

      {/* WHAT'S INSIDE, CATEGORY SHOWCASE */}
      <div style={{ padding: isMobile ? "56px 0 48px" : "88px 0 72px", background: "#000", width: "100%" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px", textAlign: "center", marginBottom: isMobile?36:52 }}>
          <div style={{ fontSize:13, fontWeight:500, letterSpacing:"0.28em", textTransform:"uppercase", marginBottom:20, fontFamily:"'Jost',sans-serif", background:"linear-gradient(135deg,#F5E0A0,#E8B870,#BFA5D8)", WebkitBackgroundClip:"text", backgroundClip:"text", WebkitTextFillColor:"transparent", display:"inline-block" }}>A growing library</div>
          <div style={{ fontSize: isMobile?"clamp(36px,9vw,52px)":"clamp(48px,5vw,68px)", color:"#f2ece4", fontFamily:"'Jost',sans-serif", fontWeight:400, letterSpacing:"-0.03em", lineHeight:1.0, marginBottom:24 }}>24 categories.<br/>All of them me.</div>
          <p style={{ fontSize: isMobile?16:19, color:"#c8bfb8", lineHeight:1.85, maxWidth:560, margin:"0 auto 16px", fontFamily:"'Jost',sans-serif" }}>
            Every track in this library is recorded by me, Reshma. One voice. One vision. Built track by track, category by category, from scratch.
          </p>
          <p style={{ fontSize: isMobile?16:19, color:"#c8bfb8", lineHeight:1.85, maxWidth:560, margin:"0 auto", fontFamily:"'Jost',sans-serif" }}>
            This is a new project and I am still building it. What you see here is growing, four new tracks every week, across every desire you've been sitting on.
          </p>
        </div>

        {/* Auto-cycling category banner */}
        <LibraryBanner isMobile={isMobile} onLegal={onLegal}/>
      </div>
      {/* BOTTOM CAROUSEL, same ombre style as top, different affirmations */}
      <IdentityCarousel cats={[
        { label:"Richgirlmaxxing",     tagline:"Money finds me first. Obviously." },
        { label:"Lovemaxxing",      tagline:"He's obsessed. Of course he is." },
        { label:"Beautymaxxing",    tagline:"Gorgeous is my default. Always." },
        { label:"Selfmaxxing",      tagline:"I am the upgraded version. Now." },
        { label:"Sovereignmaxxing", tagline:"I receive. Constantly. Effortlessly." },
        { label:"Wellnessmaxxing",  tagline:"My body reflects my beliefs." },
      ]} />


      
      {/* ─── Section divider ─── */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16, padding:"8px 0", background:"#000" }}>
        <div style={{ flex:1, height:"1px", background:"linear-gradient(90deg,transparent,rgba(44,183,167,0.2))", maxWidth:200 }}/>
        <img src="/logo_transparent_cropped.png" alt="Self Hypnosis Goddess" width={22} height={22} style={{opacity:0.5, objectFit:"contain", display:"block"}} />
        <div style={{ flex:1, height:"1px", background:"linear-gradient(90deg,rgba(44,183,167,0.2),transparent)", maxWidth:200 }}/>
      </div>
      {/* PROOFOS INTRO, MASSIVE STATEMENT */}
      <div id="proofos" style={{ padding: isMobile?"48px 20px":"80px 24px", textAlign:"center", maxWidth:820, margin:"0 auto" }}>
        <p style={{ fontSize: isMobile?"clamp(26px,7vw,36px)":"clamp(36px,4.5vw,58px)", color:"#f2ece4", lineHeight:1.3, fontWeight:400, letterSpacing:"-0.02em", fontFamily:"'Jost',sans-serif", margin:0 }}>
          Every track links to a desire. Every sign you receive gets logged in <span style={{ background:"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", WebkitBackgroundClip:"text", backgroundClip:"text", WebkitTextFillColor:"transparent" }}>ProofOS ✦</span>, dated, stacked, permanent. Your proof wall builds itself while you sleep.
        </p>
      </div>
      
      {/* ─── Section divider ─── */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16, padding:"8px 0", background:"#000" }}>
        <div style={{ flex:1, height:"1px", background:"linear-gradient(90deg,transparent,rgba(44,183,167,0.2))", maxWidth:200 }}/>
        <img src="/logo_transparent_cropped.png" alt="Self Hypnosis Goddess" width={18} height={18} style={{opacity:0.5, objectFit:"contain", display:"block"}} />
        <div style={{ flex:1, height:"1px", background:"linear-gradient(90deg,rgba(44,183,167,0.2),transparent)", maxWidth:200 }}/>
      </div>
      {/* WALL OF LOVE */}
      <div style={{ padding: isMobile?"48px 18px 60px":"70px 24px", background:"#fdf6ee" }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ fontSize: isMobile?13:14, fontWeight:400, color:"#7a7a7a", letterSpacing:"0.3em", textTransform:"uppercase", marginBottom:16, fontFamily:"'Jost',sans-serif" }}>Real results from real members</div>
            <h2 style={{ fontFamily:"'Jost',sans-serif", fontSize:isMobile?"clamp(32px,8vw,48px)":"clamp(40px,5vw,60px)", fontWeight:400, color:"#0a0a0a", letterSpacing:"0em", lineHeight:1.1, textAlign:"center" }}>
              Wall of Love
            </h2>
          </div>
          <div style={{...GPRICE(isMobile)}}>
            {[
              { quote: "I listened on day 1 and felt something shift. By day 5 he texted. I didn't even look for it.", name: "Sarah, 29", cat: "Lovemaxxing" },
              { quote: "$1,800 came back as a refund I had forgotten about. Three days after starting Money Finds Me First.", name: "Priya, 33", cat: "Richgirlmaxxing" },
              { quote: "I look the same and feel completely different about my face. The glow is internal first.", name: "Maya, 26", cat: "Beautymaxxing" },
              { quote: "I've tried every subliminal channel. This is the only one where I actually feel it working in real time.", name: "Jade, 31", cat: "Selfmaxxing" },
              { quote: "I genuinely thought he was about to break up with me. I kept listening anyway. He proposed three weeks later.", name: "Ellie, 30", cat: "Lovemaxxing" },
              { quote: "I wrote down five desires. Within 30 days all five had either arrived or were clearly on their way.", name: "Freya, 27", cat: "Desiresmaxxing" },
              { quote: "I was so sure my business was about to crash. A client came out of nowhere and it turned everything around.", name: "Nadia, 34", cat: "Businessmaxxing" },
              { quote: "People offer to buy me a coffee or a drink now, genuinely, 90% of the time I go out. It never used to happen.", name: "Bella, 28", cat: "Erosmaxxing" },
              { quote: "I found €50 on the street one day, out of nowhere, while I had Money Finds Me First on repeat. Then it happened again. Then again. It just keeps happening.", name: "Camille, 25", cat: "Luckygirlmaxxing" },
              { quote: "Woke up knowing he was coming back. No logical reason. He called that afternoon.", name: "Layla, 28", cat: "Lovemaxxing" },
              { quote: "The sleep subliminal changed my dreams. I woke up feeling like money was already mine.", name: "Chloe, 35", cat: "Richgirlmaxxing" },
              { quote: "I used to check my phone every five minutes waiting for him to text. Now I forget to check, and that's exactly when he does.", name: "Amara, 30", cat: "Lovemaxxing" },
            ].map((t, i) => (
              <div key={i} style={{ background:"#fff", border:"1px solid rgba(44,183,167,0.1)", borderRadius:16, padding:"22px 20px", display:"flex", flexDirection:"column", gap:12, boxShadow:"0 4px 24px rgba(0,0,0,0.15)" }}>
                <div style={{ width:32, height:24, opacity:0.25 }}>
                  <svg viewBox="0 0 32 24" fill="#ccc"><path d="M0 24V14.4C0 10.24 1.12 6.72 3.36 3.84 5.6.96 8.64.16 12.48 0L13.44 2.4C10.88 3.04 8.96 4.16 7.68 5.76 6.4 7.36 5.76 9.28 5.76 11.52H11.52V24H0zm20.48 0V14.4c0-4.16 1.12-7.68 3.36-10.56C26.08.96 29.12.16 32.96 0L33.92 2.4C31.36 3.04 29.44 4.16 28.16 5.76c-1.28 1.6-1.92 3.52-1.92 5.76h5.76V24H20.48z"/></svg>
                </div>
                <p style={{ fontSize:isMobile?16:18, color:"#0a0a0a", lineHeight:1.7, fontFamily:"'Jost',sans-serif", fontWeight:400, flex:1 }}>{t.quote}</p>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontSize:12, fontWeight:400, color:"#6a6a6a", fontFamily:"'Jost',sans-serif" }}>{t.name}</span>
                  <span style={{ fontSize:11, padding:"3px 10px", background:"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", borderRadius:20, color:"#000", fontWeight:400, letterSpacing:"0.06em", fontFamily:"'Jost',sans-serif" }}>{t.cat}</span>
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

      {/* INSTAGRAM */}
      <div style={{ background:"#000", padding: isMobile?"56px 24px":"80px 24px", textAlign:"center" }}>
        <div style={{ maxWidth:560, margin:"0 auto" }}>
          <div style={{ fontSize:11, letterSpacing:"0.3em", textTransform:"uppercase", color:"#2CB7A7", fontFamily:"'Jost',sans-serif", marginBottom:20 }}>Follow along</div>
          <div style={{ fontSize: isMobile?"clamp(32px,8vw,48px)":"clamp(44px,5vw,64px)", fontWeight:300, color:"#f2ece4", fontFamily:"'Jost',sans-serif", letterSpacing:"-0.02em", lineHeight:1.05, marginBottom:32 }}>
            @selfhypnosisgoddess
          </div>
          <a href="https://www.instagram.com/selfhypnosisgoddess/" target="_blank" rel="noopener noreferrer"
            style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"16px 36px", background:"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", borderRadius:40, color:"#000", fontSize:15, fontFamily:"'Jost',sans-serif", fontWeight:500, letterSpacing:"0.04em", textDecoration:"none" }}>
            Follow on Instagram ✦
          </a>
        </div>
      </div>

            {/* FINAL CTA */}
      <div style={{ background: "#000", padding: isMobile?"64px 24px":"80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase", color: "#E8B870", fontFamily: "'Jost',sans-serif", fontWeight:400, marginBottom: 16 }}>Coming soon</div>
          <h2 style={{ fontSize: "clamp(26px,3.6vw,42px)", color: "#f2ece4", lineHeight: 1.1, marginBottom: 20, fontWeight: 400, fontFamily: "'Jost',sans-serif", whiteSpace: isMobile?"normal":"nowrap" }}>
            Thank you for being here.
          </h2>
          <p style={{ fontSize: isMobile?16:19, color: theme==="dark"?"#e8e0d8":"#000000", marginBottom: 32, lineHeight: 1.75, maxWidth: 420, margin: "0 auto 32px", fontFamily: "'Jost',sans-serif" }}>
            You can join the waitlist and be the first to know when the audio library opens.
          </p>
          <button onClick={()=>setWaitlistOpen(true)} style={{ padding: "22px 64px", background: "linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", border: "none", borderRadius: 40, color: "#000", fontSize: isMobile?22:26, fontWeight: 400, cursor: "pointer", fontFamily: "'Jost',sans-serif", letterSpacing: "0.04em" }}>
            Join the waitlist →
          </button>
          <div style={{ marginTop: 14, fontSize: 13, color: theme==="dark"?"#e8e0d8":"#000000", fontWeight:400, fontFamily: "'Jost',sans-serif" }}>No spam. Just the launch date.</div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: T.border, padding: "64px 24px 28px", textAlign: "center" }}>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:20 }}>
          <img src="/logo_transparent_cropped.png" alt="Self Hypnosis Goddess" width={72} height={72} style={{flexShrink:0, objectFit:"contain", display:"block"}} />
        </div>
        <div style={{ marginBottom:16 }}>
          <span style={{ fontFamily:"'Jost',sans-serif", fontWeight:300, fontSize:22, color:"#f2ece4", letterSpacing:"0.02em" }}>Self Hypnosis Goddess</span>
        </div>
        <div style={{ fontSize: 13, color: theme==="dark"?"#e8e0d8":"#000000", marginBottom: 6 }}>Reshma Oracle · reshmaoracle.com</div>
        <div style={{ fontSize: 11, color: T.borderGlow, letterSpacing: "0.03em", maxWidth: 560, margin: "0 auto 14px", lineHeight: 1.6, opacity: 0.75 }}>
          Self Hypnosis Goddess is a self-hypnosis and manifestation audio product. It is not therapy, medical treatment, or a substitute for professional mental health care. If you're experiencing a mental health crisis, please contact a licensed professional or emergency services.
        </div>
        <div style={{ display:"flex", gap:20, justifyContent:"center", marginBottom:14, flexWrap:"wrap" }}>
          {[["About Reshma","about"],["Terms of Service","tos"],["Privacy Policy","privacy"],["Refund Policy","refunds"]].map(([l,s])=>(
            <button key={s} onClick={()=>onLegal?.(s)} style={{ background:"none", border:"none", color:theme==="dark"?"#e8e0d8":"#000000", fontSize:12, cursor:"pointer", fontFamily:"'Jost',sans-serif", textDecoration:"underline", textUnderlineOffset:3 }}>{l}</button>
          ))}
        </div>
        <div style={{ fontSize: 12, color: T.borderGlow, letterSpacing: "0.15em" }}>© 2026 RESHMA ORACLE · ALL RIGHTS RESERVED</div>
      </div>

      {/* SHOP MODAL, embedded Beacons, stays on-site */}
      {shopOpen && (
        <div onClick={()=>setShopOpen(false)} style={{ position:"fixed", inset:0, zIndex:2000, background:"rgba(0,0,0,0.85)", display:"flex", alignItems:"center", justifyContent:"center", padding: isMobile?0:20 }}>
          <div onClick={e=>e.stopPropagation()} style={{ width:"100%", height: isMobile?"100%":"90vh", maxWidth:900, background:"#0a0a0a", borderRadius: isMobile?0:20, overflow:"hidden", display:"flex", flexDirection:"column", border:"1px solid rgba(42,168,154,0.3)" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 18px", borderBottom:"1px solid rgba(42,168,154,0.2)", flexShrink:0 }}>
              <span style={{ fontFamily:"'Jost',sans-serif", fontSize:13, color:"#c8bcb0", letterSpacing:"0.1em", textTransform:"uppercase" }}>Shop</span>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <a href="https://beacons.ai/reshmaoracle" target="_blank" rel="noopener noreferrer" style={{ fontSize:12, color:theme==="dark"?"#e8e0d8":"#000000", textDecoration:"none" }}>Open in new tab ↗</a>
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
          <div onClick={e=>e.stopPropagation()} style={{ background:"#000", border:"1.5px solid #E8B87055", borderRadius:20, padding:"36px 28px", maxWidth:400, width:"100%", textAlign:"center" }}>
            {waitlistStatus === "done" ? (
              <>
                <div style={{ fontSize:32, marginBottom:12 }}>✦</div>
                <div style={{ fontSize:20, fontWeight:400, color:"#f2ece4", marginBottom:8, fontFamily:"'Jost',sans-serif" }}>You're on the list.</div>
                <div style={{ fontSize:14, color:"#c8c0bc", marginBottom:24, lineHeight:1.6 }}>We'll email you the moment Self Hypnosis Goddess opens.</div>
                <button onClick={()=>{setWaitlistOpen(false); setWaitlistStatus("idle"); setWaitlistEmail("");}} style={{ padding:"12px 28px", background:"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", border:"none", borderRadius:14, color:"#000", fontSize:14, fontWeight:400, cursor:"pointer", fontFamily:"'Jost',sans-serif" }}>Close</button>
              </>
            ) : (
              <>
                <div style={{ fontFamily:"'Jost',sans-serif", fontSize:34, fontWeight:300, color:"#f2ece4", marginBottom:10, letterSpacing:"-0.01em" }}>Join the Waitlist</div>
                <div style={{ fontSize:14, color:"#c8c0bc", marginBottom:22, lineHeight:1.6 }}>We're not live yet, get first access the moment it opens.</div>
                <form onSubmit={submitWaitlist}>
                  <input
                    type="email"
                    required
                    value={waitlistEmail}
                    onChange={e=>{setWaitlistEmail(e.target.value); if(waitlistStatus==="error") setWaitlistStatus("idle");}}
                    placeholder="your@email.com"
                    style={{ width:"100%", padding:"14px 16px", background:"#0a0a0a", border:`1.5px solid ${waitlistStatus==="error"?"#2CB7A7":"#2a2a2a"}`, borderRadius:12, color:theme==="dark"?"#e8e0d8":"#000000", fontSize:15, fontFamily:"'Jost',sans-serif", outline:"none", marginBottom:12 }}
                  />
                  {waitlistStatus === "error" && <div style={{ fontSize:12, color:"#2CB7A7", marginBottom:12 }}>Please enter a valid email.</div>}
                  <button type="submit" disabled={waitlistStatus==="saving"} style={{ width:"100%", padding:"14px", background:"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", border:"none", borderRadius:12, color:"#000", fontSize:14, fontWeight:400, cursor:waitlistStatus==="saving"?"default":"pointer", fontFamily:"'Jost',sans-serif", opacity:waitlistStatus==="saving"?0.6:1 }}>
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

const SIGN_SUGGESTIONS = {
  Sign: ["Saw 111 · 222 · 333 · 555", "Someone mentioned it unexpectedly", "Dreamed about it clearly", "Felt sudden calm certainty", "Received a surprise message"],
  Synchronicity: ["His name appeared three times today", "The exact thing I wanted appeared", "A stranger confirmed my intention"],
  Symptom: ["Body felt warm and certain after listening", "Chest felt open and relaxed", "Sudden peace for no reason", "Woke up knowing before anything happened"],
};

function SignModal({ open, type, onClose, threadId }) {
  const { token } = useAuth();
  const [val, setVal] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const save = async () => {
    if (!val.trim()) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("type", type || "Sign");
      formData.append("caption", val);
      if (threadId) formData.append("thread_id", threadId);
      await fetch("https://shg-proof-worker.airpriestess.workers.dev/proof-entries/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
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
          <div style={{ fontSize: 18, fontWeight: 700, color: "#000000", marginBottom: 20 }}>Logged.</div>
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
