import { useState, useEffect, useRef } from "react";
import AnalyticsBoard, { DEMO_ANALYTICS } from "../components/AnalyticsBoard.jsx";
import KnowledgeGuide from "../components/KnowledgeGuide.jsx";
import { ArrowIcon } from "../components/UI.jsx";

// Full Hawkins scale — 20 (Shame) → 700+ (Enlightenment)
const HAWKINS = [
  {n:"Shame",v:20,c:"#3a1a1a"}, {n:"Guilt",v:30,c:"#4a2020"}, {n:"Apathy",v:50,c:"#5a3030"}, {n:"Grief",v:75,c:"#6a4030"},
  {n:"Fear",v:100,c:"#8a5030"}, {n:"Desire",v:125,c:"#a06030"}, {n:"Anger",v:150,c:"#b47030"}, {n:"Pride",v:175,c:"#c68830"},
  {n:"Courage",v:200,c:"#d4a028"}, {n:"Neutrality",v:250,c:"#c8a848"}, {n:"Willingness",v:310,c:"#a8b860"}, {n:"Acceptance",v:350,c:"#78b078"},
  {n:"Reason",v:400,c:"#48a898"}, {n:"Love",v:500,c:"#B76E79"}, {n:"Joy",v:540,c:"#c4789a"}, {n:"Peace",v:600,c:"#8a6ac0"}, {n:"Enlightenment",v:700,c:"#5a4ab0"},
];
const dominant = (log,days) => {
  const cutoff = Date.now() - days*86400000;
  const recent = log.filter(e=>new Date(e.date).getTime()>=cutoff);
  if (!recent.length) return null;
  const avg = recent.reduce((s,e)=>s+(HAWKINS.find(h=>h.n===e.level)?.v||0),0)/recent.length;
  return HAWKINS.reduce((best,h)=>Math.abs(h.v-avg)<Math.abs(best.v-avg)?h:best,HAWKINS[0]);
};

/* ═══════════════════════════════════════════════════════════════════════
   SHG PORTAL — Full Spotify-style with:
   · Real Supabase audio playback
   · Proof threads linked to tracks + undo/edit
   · Favorites section
   · Profile avatar → stats/settings panel
   · Home win summary dashboard
   · Shop → Beacons.ai
   · Light/dark theme toggle
   ═══════════════════════════════════════════════════════════════════════ */

// ── SUPABASE AUDIO URLS ──────────────────────────────────────────────────────
const BASE = "https://qtwvslrwmreazmrdktsn.supabase.co/storage/v1/object/public/tracks/";
const AUDIO_URLS = {
  "Spoilt Goddess":           BASE + "SPOILT%20INSTAGRAM%2013.04.2026.WAV",
  "Money Finds Me First":     BASE + "29.06.2026-6.mp3",
  "10 Years Into One Hour":   BASE + "COMPRESS%2010%20YEARS%20OF%20DELAY%20INTO%20ONE%20HOUR%20EMDR%20THEN%20ECHO%2007.04.2026.mp3",
};

// ── BEACONS STORE ────────────────────────────────────────────────────────────
const BEACONS = "https://beacons.ai/reshmaoracle"; // update with exact URL

// ── THEMES ───────────────────────────────────────────────────────────────────
const THEMES = {
  dark:  { bg:"#0f0f0f", bg2:"#181818", bg3:"#282828", bg4:"#2a2a2a", nav:"#0a0a0a", cr:"#ffffff", mu:"#b3b3b3", dim:"#727272", border:"#2a2a2a", inputBg:"#333", inputCr:"#fff" },
  light: { bg:"#fdf0e8", bg2:"#fff8f4", bg3:"rgba(183,110,121,0.08)", bg4:"rgba(183,110,121,0.12)", nav:"rgba(253,240,232,0.97)", cr:"#000000", mu:"#4a3028", dim:"#7a5a48", border:"rgba(183,110,121,0.12)", inputBg:"rgba(0,0,0,0.07)", inputCr:"#111" },
};

const R = "#B76E79", P = "#d4a090";
const OMBRE = "linear-gradient(135deg,#f5e0a0 0%,#e8b870 22%,#d4a090 48%,#c4789a 72%,#B76E79 100%)";

// ── STOCK IMAGES ─────────────────────────────────────────────────────────────
const IMGS = {
  "Spoilt Goddess":           { url:"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&h=200&fit=crop&auto=format", g:"#c87890,#8a3060" },
  "He Finds His Way Back":    { url:"https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=200&h=200&fit=crop&auto=format", g:"#c4789a,#B76E79" },
  "Money Finds Me First":     { url:"https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=200&h=200&fit=crop&auto=format", g:"#e8b870,#B76E79" },
  "While I Sleep I Manifest": { url:"https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=200&h=200&fit=crop&auto=format", g:"#c4789a,#6a2840" },
  "Gorgeous Is My Default":   { url:"https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=200&h=200&fit=crop&auto=format", g:"#e8b870,#d4a090" },
  "DNA Activation Ceremony":  { url:"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=200&h=200&fit=crop&auto=format", g:"#c4789a,#B76E79" },
  "Lucky Girl Summer":        { url:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&auto=format", g:"#d4a090,#e8b870" },
  "10 Years Into One Hour":   { url:"https://images.unsplash.com/photo-1496715976403-f5c7c1a1d064?w=200&h=200&fit=crop&auto=format", g:"#d4a090,#8a3050" },
  "Highest Timeline":         { url:"https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=200&h=200&fit=crop&auto=format", g:"#8a3050,#c4789a" },
};

function Thumb({ title, size=48, radius=4 }) {
  const d = IMGS[title] || { url:null, g:"#B76E79,#8a3050" };
  return (
    <div style={{ width:size, height:size, borderRadius:radius, flexShrink:0, overflow:"hidden", background:`linear-gradient(135deg,${d.g})`, position:"relative" }}>
      {d.url && <img src={d.url} alt={title} style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover" }} onError={e=>e.target.style.display="none"}/>}
    </div>
  );
}

// ── TRACK DATA ────────────────────────────────────────────────────────────────
const TRACKS = [
  { id:1,  title:"Spoilt Goddess",           artist:"Reshma Oracle", dur:"4:32",  cat:"Identity",  format:"Melodic House", tier:"audio",   isNew:true,  hasAudio:true  },
  { id:2,  title:"He Finds His Way Back",    artist:"Reshma Oracle", dur:"30:00", cat:"SP & Love", format:"Subliminal",    tier:"audio",   isNew:false, hasAudio:false },
  { id:3,  title:"Money Finds Me First",     artist:"Reshma Oracle", dur:"25:00", cat:"Money",     format:"Melodic House", tier:"audio",   isNew:true,  hasAudio:true  },
  { id:4,  title:"While I Sleep I Manifest", artist:"Reshma Oracle", dur:"60:00", cat:"Sleep",     format:"Melodic Calm",  tier:"audio",   isNew:false, hasAudio:false },
  { id:5,  title:"Gorgeous Is My Default",   artist:"Reshma Oracle", dur:"35:00", cat:"Beauty",    format:"528hz",         tier:"audio",   isNew:false, hasAudio:false },
  { id:6,  title:"DNA Activation Ceremony",  artist:"Reshma Oracle", dur:"45:00", cat:"DNA",       format:"Reiki",         tier:"goddess", isNew:false, hasAudio:false },
  { id:7,  title:"Lucky Girl Summer",        artist:"Reshma Oracle", dur:"22:00", cat:"Identity",  format:"Subliminal",    tier:"audio",   isNew:true,  hasAudio:false },
  { id:8,  title:"10 Years Into One Hour",   artist:"Reshma Oracle", dur:"58:00", cat:"Identity",  format:"EMDR",          tier:"audio",   isNew:false, hasAudio:true  },
  { id:9,  title:"Highest Timeline",         artist:"Reshma Oracle", dur:"28:00", cat:"Identity",  format:"Reiki",         tier:"goddess", isNew:false, hasAudio:false },
];
const FORMATS = ["All","Melodic House","Melodic Calm","Subliminal","EMDR","Voice Only","528hz","Reiki"];

const RECENT = TRACKS.slice(0,6).map(t=>t.title);

const INIT_THREADS = [
  { id:1, desire:"He texts me first",     days:14, done:true,  track:"He Finds His Way Back", category:"SP & Love",
    feelBefore:"Anxious. Checking my phone constantly.", feelAfter:"Calm. It was always inevitable.",
    signs:[ {text:"Saw his name 3 times in one day",date:"12 Jun"}, {text:"Dreamt we were talking",date:"15 Jun"}, {text:"Screenshot — the text arrived",date:"19 Jun",img:"https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop&auto=format"}, {text:"Voice note — the moment I found out",date:"20 Jun",audio:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"} ], manifestedAt:"20 Jun" },
  { id:2, desire:"£5,000 arrives",        days:6,  done:false, track:"Money Finds Me First",  category:"Money",
    feelBefore:"Tight and worried about money.", feelAfter:"",
    signs:[ {text:"Got a random refund £180",date:"28 Jun",img:"https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=400&fit=crop&auto=format"}, {text:"Found £20 in my coat pocket",date:"1 Jul"} ] },
  { id:3, desire:"10k per day business",  days:9,  done:false, track:"Spoilt Goddess",        category:"Money",
    feelBefore:"Doubtful but hopeful.", feelAfter:"",
    signs:[ {text:"Two new enquiries the same day",date:"30 Jun"} ] },
  { id:4, desire:"Skin visibly glowing",  days:3,  done:false, track:"Gorgeous Is My Default",category:"Beauty",
    feelBefore:"Self-conscious without makeup.", feelAfter:"",
    signs:[ {text:"Colleague asked what I changed",date:"2 Jul"} ] },
];

// Category → proof wall colours (matches landing Proof Wall)
const CAT_GRAD = { "SP & Love":"linear-gradient(135deg,#f5e0a0,#e8b870)", "Money":"linear-gradient(135deg,#e8b870,#d4a090)", "Beauty":"linear-gradient(135deg,#f5e0a0,#c4789a)", "Identity":"linear-gradient(135deg,#d4a090,#c4789a)", "DNA":"linear-gradient(135deg,#d4a090,#c4789a)", "Sleep":"linear-gradient(135deg,#c4789a,#B76E79)" };
const CAT_COLOR = { "SP & Love":"#B76E79", "Money":"#e8b870", "Beauty":"#c4789a", "Identity":"#8a3050", "DNA":"#8a3050", "Sleep":"#6a2840" };

// ── SVG ICONS ────────────────────────────────────────────────────────────────
const Ico = {
  Home:   ({a,c})=><svg width="22" height="22" viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" fill={a?c||"#fff":"none"} stroke={a?c||"#fff":"#727272"} strokeWidth="1.8"/></svg>,
  Search: ({a,c})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?c||"#fff":"#727272"} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Lib:    ({a,c})=><svg width="22" height="22" viewBox="0 0 24 24" fill={a?c||"#fff":"#727272"}><path d="M3 3h4v18H3zM9 3h2v18H9zM14 3l7 2.5v13L14 21z"/></svg>,
  Proof:  ({a})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?R:"#727272"} strokeWidth="1.8" strokeLinecap="round"><path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h9"/></svg>,
  Play:   ({dark})=><svg width="18" height="18" viewBox="0 0 24 24" fill={dark?"#000":"#fff"}><polygon points="6 3 20 12 6 21"/></svg>,
  Pause:  ({dark})=><svg width="18" height="18" viewBox="0 0 24 24" fill={dark?"#000":"#fff"}><rect x="6" y="4" width="4" height="16" rx="1.5"/><rect x="14" y="4" width="4" height="16" rx="1.5"/></svg>,
  Heart:  ({on})=><svg width="18" height="18" viewBox="0 0 24 24" fill={on?R:"none"} stroke={on?R:"#727272"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l7.84-7.84 1.06-1.06a5.5 5.5 0 000-7.72z"/></svg>,
  Lock:   ()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={R} strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  Edit:   ({c})=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||"#727272"} strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Undo:   ({c})=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||"#727272"} strokeWidth="2" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>,
  Star:   ({on,c})=><svg width="16" height="16" viewBox="0 0 24 24" fill={on?P:"none"} stroke={on?P:c||"#727272"} strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Cog:    ({c})=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c||"#727272"} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  Shop:   ({a,c})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?c||"#fff":"#727272"} strokeWidth="1.8" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
};

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function SpotifyPortal({ onSignOut, isPreview=false, forceMode=null, forceTheme=null, initialTab="home" }) {
  const [tab, setTab]         = useState(initialTab);
  const [track, setTrack]     = useState(TRACKS[0]);
  const [playing, setPlay]    = useState(false);
  const [liked, setLiked]     = useState(new Set([1,3,7]));
  const [fullP, setFullP]     = useState(false);
  const [prog, setProg]       = useState(0);
  const [searchQ, setQ]       = useState("");
  const [libCat, setLibCat]   = useState("All");
  const [libFormat, setLibFormat] = useState("All");
  const [threads, setThreads] = useState(INIT_THREADS);
  const [theme, setTheme]     = useState(forceTheme || "dark");
  const [profileOpen, setProfileOpen] = useState(false);
  const [listenCount, setListenCount] = useState(47);
  // Seeded 30-day emotional log — dominant state trends upward on Hawkins scale
  const [emoLog, setEmoLog] = useState(()=>{
    const arr=[]; const now=Date.now();
    const path=["Fear","Fear","Desire","Anger","Pride","Pride","Courage","Neutrality","Willingness","Courage","Willingness","Acceptance","Reason","Acceptance","Love","Willingness","Acceptance","Love","Joy","Reason","Love","Love","Peace","Joy","Love","Peace","Joy","Peace","Love","Love"];
    for (let i=29;i>=0;i--) arr.push({date:new Date(now-i*86400000).toISOString().slice(0,10),level:path[29-i]});
    return arr;
  });
  const [showGuide, setShowGuide] = useState(false);
  const [showEmoLog, setShowEmoLog] = useState(false);
  const [quickFeel, setQuickFeel] = useState("");
  const logEmotion = (level) => {
    const today = new Date().toISOString().slice(0,10);
    setEmoLog(l=>[...l.filter(e=>e.date!==today),{date:today,level}]);
    setQuickFeel(level); setTimeout(()=>setShowEmoLog(false),700);
  };
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => { if (forceTheme) setTheme(forceTheme); }, [forceTheme]);

  const C = THEMES[theme];
  const isDark = theme === "dark";
  const hour = new Date().getHours();
  const greet = hour<12?"Good morning":hour<17?"Good afternoon":"Good evening";

  // ── AUDIO PLAYBACK ───────────────────────────────────────────────────────
  const play = (t) => {
    if (isPreview) return;
    if (track.id === t.id) {
      setPlay(p => !p);
      return;
    }
    setTrack(t);
    setPlay(true);
    setProg(0);
    setListenCount(n=>n+1);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const url = AUDIO_URLS[track.title];
    if (url && audio.src !== url) {
      audio.src = url;
      audio.load();
    }
    if (playing && url) {
      audio.play().catch(()=>{});
    } else {
      audio.pause();
    }
  }, [playing, track]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const update = () => {
      if (audio.duration) setProg(Math.round((audio.currentTime/audio.duration)*100));
    };
    audio.addEventListener("timeupdate", update);
    audio.addEventListener("ended", nextTrack);
    return () => { audio.removeEventListener("timeupdate", update); audio.removeEventListener("ended", nextTrack); };
  }, [track]);

  const seekTo = (pct, e) => {
    e?.stopPropagation();
    const audio = audioRef.current;
    if (audio && audio.duration) audio.currentTime = (pct/100)*audio.duration;
    setProg(pct);
  };

  const toggleLike = (id, e) => {
    e?.stopPropagation();
    setLiked(s=>{const n=new Set(s); n.has(id)?n.delete(id):n.add(id); return n;});
  };
  const nextTrack = () => { const i=TRACKS.findIndex(t=>t.id===track.id); setTrack(TRACKS[(i+1)%TRACKS.length]); setProg(0); };
  const prevTrack = () => { const i=TRACKS.findIndex(t=>t.id===track.id); setTrack(TRACKS[(i-1+TRACKS.length)%TRACKS.length]); setProg(0); };

  const [isDesktop, setDesktop] = useState(forceMode ? forceMode==="desktop" : (typeof window!=="undefined" && window.innerWidth>768));
  useEffect(()=>{
    if (forceMode) { setDesktop(forceMode==="desktop"); return; }
    const h=()=>setDesktop(window.innerWidth>768); window.addEventListener("resize",h); return()=>window.removeEventListener("resize",h);
  },[forceMode]);

  // ── PROFILE PANEL ────────────────────────────────────────────────────────
  const manifestedCount = threads.filter(t=>t.done).length;
  const thisMonth = threads.filter(t=>t.done).length; // simplified
  const [billingOpen, setBillingOpen] = useState(false);
  const [planSel, setPlanSel] = useState("goddess");
  const [planMsg, setPlanMsg] = useState("");
  const [cancelReq, setCancelReq] = useState(false);
  const PLANS = [["audio","Audio","£19/mo"],["goddess","Goddess ✦","£33/mo"],["lifetime","Lifetime ♾","£500 once"]];

  const BillingPanel = () => (
    <>
      <div style={{ position:"fixed",inset:0,zIndex:998,background:"rgba(0,0,0,0.6)" }} onClick={()=>setBillingOpen(false)}/>
      <div style={{ position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:isMobile?"90%":380,maxWidth:380,background:C.bg2,border:`1px solid ${C.border}`,borderRadius:18,zIndex:999,padding:"26px 24px",fontFamily:"'Jost',sans-serif" }}>
        <div style={{ fontSize:11,fontWeight:800,color:R,letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:16 }}>Your subscription</div>
        <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:20 }}>
          <div style={{ width:44,height:44,borderRadius:"50%",background:OMBRE,backgroundSize:"200%",backgroundPosition:"left",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,color:"#000",flexShrink:0 }}>R</div>
          <div>
            <div style={{ fontSize:15,fontWeight:700,color:C.cr }}>Reshma Oracle</div>
            <div style={{ fontSize:12,color:C.mu }}>reshma@reshmaoracle.com</div>
          </div>
        </div>
        <div style={{ background:C.bg3,borderRadius:12,padding:"14px 16px",marginBottom:10 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
            <span style={{ fontSize:12,color:C.mu }}>Current plan</span>
            <span style={{ fontSize:13,fontWeight:700,color:R }}>Goddess Tier ✦</span>
          </div>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
            <span style={{ fontSize:12,color:C.mu }}>Amount paid</span>
            <span style={{ fontSize:13,fontWeight:700,color:C.cr }}>£33.00 / month</span>
          </div>
          <div style={{ display:"flex",justifyContent:"space-between" }}>
            <span style={{ fontSize:12,color:C.mu }}>Next billing date</span>
            <span style={{ fontSize:13,fontWeight:700,color:C.cr }}>29 July 2026</span>
          </div>
        </div>
        {/* CHANGE PLAN — in-app, no redirect */}
        <div style={{ fontSize:10,fontWeight:800,color:C.mu,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:8 }}>Change plan</div>
        <div style={{ display:"flex",gap:6,marginBottom:10 }}>
          {PLANS.map(([id,l,pr])=>(
            <button key={id} onClick={()=>{setPlanSel(id);setPlanMsg(`Plan updated to ${l} ✓`);setCancelReq(false);}} style={{ flex:1,padding:"9px 4px",background:planSel===id?OMBRE:C.bg3,backgroundSize:"200%",backgroundPosition:"left",border:planSel===id?"none":`1px solid ${C.border}`,borderRadius:10,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>
              <div style={{ fontSize:11,fontWeight:800,color:planSel===id?"#000":C.cr }}>{l}</div>
              <div style={{ fontSize:9,fontWeight:700,color:planSel===id?"#000":C.mu,marginTop:2 }}>{pr}</div>
            </button>
          ))}
        </div>
        {planMsg && <div style={{ fontSize:11,fontWeight:700,color:"#1a7030",marginBottom:8 }}>{planMsg}</div>}
        {!cancelReq
          ? <button onClick={()=>{ if(window.confirm("Cancel your subscription? You keep access until 29 July 2026.")) {setCancelReq(true);setPlanMsg("");} }} style={{ width:"100%",padding:"11px",background:"none",border:`1px solid ${C.border}`,borderRadius:10,color:C.mu,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Jost',sans-serif",marginBottom:8 }}>Cancel subscription</button>
          : <div style={{ fontSize:11,fontWeight:700,color:"#b03030",marginBottom:8,textAlign:"center" }}>Cancels 29 July 2026 · full access until then · <span onClick={()=>setCancelReq(false)} style={{ textDecoration:"underline",cursor:"pointer",color:C.cr }}>undo</span></div>}
        <div style={{ fontSize:11,color:C.dim,lineHeight:1.6,marginBottom:12 }}>No refunds after 14 days from payment · Changes apply from your next billing date</div>
        <div style={{ fontSize:10,color:C.dim,textAlign:"center",marginBottom:10 }}>Payments secured by Stripe</div>
        <button onClick={()=>setBillingOpen(false)} style={{ width:"100%",padding:"11px",background:"none",border:`1px solid ${C.border}`,borderRadius:10,color:C.mu,fontSize:13,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>Close</button>
      </div>
    </>
  );

  const ProfilePanel = () => (
    <>
      <div style={{ position:"fixed",inset:0,zIndex:998,background:"rgba(0,0,0,0.5)" }} onClick={()=>setProfileOpen(false)}/>
      <div style={{ position:"fixed",top:isMobile?0:"auto",right:0,bottom:0,width:isMobile?"100%":320,background:C.bg2,borderLeft:`1px solid ${C.border}`,zIndex:999,display:"flex",flexDirection:"column",fontFamily:"'Jost',sans-serif",overflow:"hidden" }}>
        {/* Header */}
        <div style={{ padding:"24px 20px 16px",borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:16 }}>
            <div style={{ width:56,height:56,borderRadius:"50%",background:OMBRE,backgroundSize:"200%",backgroundPosition:"left",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:800,color:"#000",flexShrink:0 }}>R</div>
            <div>
              <div style={{ fontSize:16,fontWeight:700,color:C.cr }}>Reshma Oracle</div>
              <div style={{ fontSize:12,color:C.mu }}>Goddess Tier</div>
              <div style={{ fontSize:11,color:R,fontWeight:600,marginTop:2 }}>reshma@reshmaoracle.com</div>
            </div>
          </div>
          {/* Stats row */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8 }}>
            {[[manifestedCount,"Manifested",R],[listenCount,"Listens",P],[threads.length,"Intentions",C.cr]].map(([v,l,c],i)=>(
              <div key={i} style={{ background:C.bg3,borderRadius:8,padding:"10px 6px",textAlign:"center" }}>
                <div style={{ fontSize:18,fontWeight:800,color:c }}>{v}</div>
                <div style={{ fontSize:10,color:C.mu }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu items */}
        <div style={{ flex:1,overflowY:"auto",padding:"8px 0" }}>
          {[
            { icon:<Ico.Edit c={C.mu}/>, label:"Edit profile", action:()=>alert("Edit profile — connect to Supabase auth") },
            { icon:<Ico.Star c={C.mu}/>, label:"Liked tracks", action:()=>{setTab("library");setLibCat("Liked");setProfileOpen(false);} },
            { icon:<Ico.Cog c={C.mu}/>, label:"Listening reminders", action:()=>alert("Coming soon: daily push reminders.\n\nThis requires the app to be installed to your home screen (iPhone: Share → Add to Home Screen) so your browser can send notifications even when SHG isn't open. We'll prompt you to enable this once it's live.") },
            { icon:<Ico.Cog c={C.mu}/>, label:"Manage subscription", action:()=>{setProfileOpen(false);setBillingOpen(true);} },
            { icon:isDark?<Ico.Cog c={C.mu}/>:<Ico.Cog c={C.mu}/>, label:`Switch to ${isDark?"light":"dark"} mode`, action:()=>{setTheme(t=>t==="dark"?"light":"dark");setProfileOpen(false);} },
          ].map((item,i)=>(
            <button key={i} onClick={item.action} style={{ display:"flex",alignItems:"center",gap:14,width:"100%",padding:"14px 20px",background:"none",border:"none",color:C.cr,fontSize:14,fontWeight:500,cursor:"pointer",textAlign:"left",fontFamily:"'Jost',sans-serif",transition:"background 0.1s" }}
              onMouseEnter={e=>e.currentTarget.style.background=C.bg3}
              onMouseLeave={e=>e.currentTarget.style.background="none"}>
              {item.icon} {item.label}
            </button>
          ))}
          <div style={{ height:1,background:C.border,margin:"8px 20px" }}/>
          <button onClick={onSignOut} style={{ display:"flex",alignItems:"center",gap:14,width:"100%",padding:"14px 20px",background:"none",border:"none",color:C.mu,fontSize:14,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>
            Sign out
          </button>
        </div>
        <button onClick={()=>setProfileOpen(false)} style={{ padding:"16px",background:"none",border:`1px solid ${C.border}`,margin:"12px 16px",borderRadius:10,color:C.mu,fontSize:13,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>Close</button>
      </div>
    </>
  );

  // ── NAV TABS ────────────────────────────────────────────────────────────
  const tabs = [
    { id:"home",    label:"Home",    I:Ico.Home   },
    { id:"search",  label:"Search",  I:Ico.Search },
    { id:"library", label:"Library", I:Ico.Lib    },
    { id:"proof",   label:"ProofOS", I:Ico.Proof  },
  ];

  const tabContent = (
    <>
      {tab==="home"    && <HomeTab greet={greet} track={track} play={play} liked={liked} toggleLike={toggleLike} playing={playing} isPreview={isPreview} C={C} threads={threads} listenCount={listenCount} setTab={setTab} setLibCat={setLibCat} openProfile={()=>setProfileOpen(true)} emoLog={emoLog} openGuide={()=>setShowGuide(true)} openEmoLog={()=>setShowEmoLog(true)}/>}
      {tab==="search"  && <SearchTab tracks={TRACKS} searchQ={searchQ} setQ={setQ} play={play} track={track} playing={playing} liked={liked} toggleLike={toggleLike} isPreview={isPreview} C={C}/>}
      {tab==="library" && <LibraryTab tracks={TRACKS} cat={libCat} setCat={setLibCat} libFormat={libFormat} setLibFormat={setLibFormat} play={play} track={track} liked={liked} toggleLike={toggleLike} playing={playing} isPreview={isPreview} C={C}/>}
      {tab==="proof"   && <ProofTab threads={threads} setThreads={setThreads} isPreview={isPreview} C={C} currentTrack={track}/>}
      {tab==="shop"    && <ShopTab C={C}/>}
    </>
  );

  const isMobile = !isDesktop;

  // ── DESKTOP ──────────────────────────────────────────────────────────────
  if (isDesktop) return (
    <div style={{ width:"100%",height:"100%",background:C.bg,display:"flex",flexDirection:"column",fontFamily:"'Jost',sans-serif",color:C.cr,overflow:"hidden" }}>
      <audio ref={audioRef} preload="none"/>
      {profileOpen && <ProfilePanel/>}
      {billingOpen && <BillingPanel/>}
      {showGuide && <KnowledgeGuide onClose={()=>setShowGuide(false)} C={C}/>}
      {showEmoLog && (
        <>
          <div style={{ position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,0.6)" }} onClick={()=>setShowEmoLog(false)}/>
          <div style={{ position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"90%",maxWidth:400,background:C.bg2,border:`1px solid ${C.border}`,borderRadius:18,zIndex:1001,padding:"22px 20px",fontFamily:"'Jost',sans-serif" }}>
            <div style={{ fontSize:11,fontWeight:900,color:"#B76E79",letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:12 }}>How are you feeling right now?</div>
            <div style={{ fontSize:11,color:C.mu,marginBottom:8,fontWeight:700 }}>Below 200 · contractive · drains energy</div>
            <div style={{ display:"flex",flexDirection:"column",gap:5,marginBottom:12 }}>
              {HAWKINS.filter(h=>h.v<200).slice().reverse().map(h=>(
                <button key={h.n} onClick={()=>logEmotion(h.n)} style={{ padding:"10px 14px",borderRadius:10,background:quickFeel===h.n?`linear-gradient(90deg,${h.c},#B76E79)`:C.bg3,border:`1px solid ${C.border}`,color:quickFeel===h.n?"#fff":C.cr,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Jost',sans-serif",display:"flex",justifyContent:"space-between",alignItems:"center",textAlign:"left" }}>
                  <span>{h.n}</span><span style={{ fontSize:11,opacity:0.7 }}>{h.v}</span>
                </button>
              ))}
            </div>
            <div style={{ fontSize:11,color:"#B76E79",marginBottom:8,fontWeight:800 }}>200 and above · expansive · creates ✦</div>
            <div style={{ display:"flex",flexDirection:"column",gap:5 }}>
              {HAWKINS.filter(h=>h.v>=200).slice().reverse().map(h=>(
                <button key={h.n} onClick={()=>logEmotion(h.n)} style={{ padding:"10px 14px",borderRadius:10,background:quickFeel===h.n?`linear-gradient(90deg,${h.c},#B76E79)`:C.bg3,border:`1px solid ${C.border}`,color:quickFeel===h.n?"#fff":C.cr,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Jost',sans-serif",display:"flex",justifyContent:"space-between",alignItems:"center",textAlign:"left" }}>
                  <span>{h.n}</span><span style={{ fontSize:11,opacity:0.7 }}>{h.v}</span>
                </button>
              ))}
            </div>
            <button onClick={()=>setShowEmoLog(false)} style={{ width:"100%",padding:"11px",background:"none",border:`1px solid ${C.border}`,marginTop:12,borderRadius:10,color:C.mu,fontSize:13,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>Close</button>
          </div>
        </>
      )}
      {isPreview && <PreviewBanner onSignOut={onSignOut} C={C}/>}
      <div style={{ flex:1,display:"flex",overflow:"hidden" }}>
        {/* Sidebar */}
        <div style={{ width:220,background:C.bg,display:"flex",flexDirection:"column",padding:"20px 0 8px",flexShrink:0,borderRight:`1px solid ${C.border}` }}>
          <div style={{ padding:"0 20px 20px",fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:18,fontWeight:500,background:"linear-gradient(135deg,#f5e0a0 0%,#e8b870 22%,#d4a090 48%,#c4789a 72%,#B76E79 100%)",WebkitBackgroundClip:"text",backgroundClip:"text",WebkitTextFillColor:"transparent",color:"transparent" }}>
            Self Hypnosis Goddess
          </div>
          {[...tabs,{id:"shop",label:"Shop",I:Ico.Shop}].map(n=>(
            <button key={n.id} onClick={()=>setTab(n.id)}
              style={{ display:"flex",alignItems:"center",gap:14,padding:"8px 20px",background:tab===n.id?C.bg3:"none",border:"none",color:tab===n.id?C.cr:n.id==="proof"?R:C.mu,fontSize:13,fontWeight:600,cursor:"pointer",textAlign:"left",width:"100%",fontFamily:"'Jost',sans-serif",transition:"color 0.15s" }}
              onMouseEnter={e=>e.currentTarget.style.color=n.id==="proof"?R:C.cr}
              onMouseLeave={e=>{if(tab!==n.id)e.currentTarget.style.color=n.id==="proof"?R:C.mu;}}>
              <n.I a={tab===n.id} c={C.cr}/> {n.label}
            </button>
          ))}
          <div style={{ height:1,background:C.border,margin:"12px 16px" }}/>
          <div style={{ padding:"0 20px 6px",fontSize:11,fontWeight:700,color:C.dim,letterSpacing:"0.12em",textTransform:"uppercase" }}>Recently played</div>
          {TRACKS.slice(0,5).map(t=>(
            <button key={t.id} onClick={()=>play(t)}
              style={{ display:"flex",alignItems:"center",gap:10,padding:"5px 20px",background:"none",border:"none",color:track.id===t.id?C.cr:C.mu,fontSize:12,cursor:"pointer",width:"100%",textAlign:"left",fontFamily:"'Jost',sans-serif" }}
              onMouseEnter={e=>e.currentTarget.style.color=C.cr}
              onMouseLeave={e=>{if(track.id!==t.id)e.currentTarget.style.color=C.mu;}}>
              <div style={{ position:"relative" }}><Thumb title={t.title} size={28} radius={2}/>{isPreview&&<div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center" }}><Ico.Lock/></div>}</div>
              <span style={{ overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{t.title}</span>
            </button>
          ))}
          <div style={{ flex:1 }}/>
          <div style={{ padding:"8px 16px",display:"flex",gap:8 }}>
            <button onClick={()=>setTheme(t=>t==="dark"?"light":"dark")} style={{ flex:1,padding:"7px",background:C.bg3,border:`0.5px solid ${C.border}`,borderRadius:8,color:C.mu,fontSize:11,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>
              {isDark?"☀ Light":"☾ Dark"}
            </button>
          </div>
          <button onClick={()=>setProfileOpen(true)} style={{ margin:"0 16px 8px",padding:"8px 12px",background:C.bg3,border:`0.5px solid ${C.border}`,borderRadius:8,color:C.cr,fontSize:12,cursor:"pointer",fontFamily:"'Jost',sans-serif",display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:24,height:24,borderRadius:"50%",background:OMBRE,backgroundSize:"200%",backgroundPosition:"left",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#000" }}>R</div>
            Profile & Settings
          </button>
        </div>
        {/* Main */}
        <div style={{ flex:1,overflowY:"auto",background:C.bg2,paddingBottom:20 }}>{tabContent}</div>
      </div>
      {!isPreview && <DesktopPlayer track={track} playing={playing} setPlay={setPlay} liked={liked} toggleLike={toggleLike} prog={prog} seekTo={seekTo} prevTrack={prevTrack} nextTrack={nextTrack} C={C} isDark={isDark}/>}
    </div>
  );

  // ── MOBILE ───────────────────────────────────────────────────────────────
  return (
    <div style={{ width:"100%",height:"100%",background:C.bg,display:"flex",flexDirection:"column",fontFamily:"'Jost',sans-serif",color:C.cr,overflow:"hidden",position:"relative" }}>
      <audio ref={audioRef} preload="none"/>
      {profileOpen && <ProfilePanel/>}
      {billingOpen && <BillingPanel/>}
      {isPreview && <PreviewBanner onSignOut={onSignOut} C={C}/>}
      {/* Status bar with avatar */}
      <div style={{ height:52,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px",flexShrink:0,borderBottom:`0.5px solid ${C.border}` }}>
        <span style={{ fontSize:13,fontWeight:700,color:C.cr }}>9:41</span>
        <span style={{ fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:15,fontWeight:500,background:"linear-gradient(90deg,#d4a090,#B76E79)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>SHG</span>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <button onClick={()=>setTheme(t=>t==="dark"?"light":"dark")} style={{ width:30,height:30,borderRadius:"50%",background:"none",border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,cursor:"pointer",WebkitTapHighlightColor:"transparent" }}>{C.cr==="#ffffff"?"☀️":"🌙"}</button>
          <button onClick={()=>setProfileOpen(true)} style={{ width:34,height:34,borderRadius:"50%",background:OMBRE,backgroundSize:"200%",backgroundPosition:"left",border:"none",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"#000",cursor:"pointer",WebkitTapHighlightColor:"transparent" }}>R</button>
        </div>
      </div>
      {/* Screen */}
      <div style={{ flex:1,overflowY:"auto",paddingBottom:!isPreview?130:60,WebkitOverflowScrolling:"touch" }}>{tabContent}</div>
      {/* Mini player */}
      {!isPreview && !fullP && (
        <div onClick={()=>setFullP(true)} style={{ position:"absolute",bottom:68,left:8,right:8,zIndex:50,background:C.bg4,borderRadius:10,display:"flex",alignItems:"center",gap:10,padding:"8px 10px",cursor:"pointer",boxShadow:`0 -4px 24px rgba(0,0,0,0.4)` }}>
          <Thumb title={track.title} size={42} radius={6}/>
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:C.cr }}>{track.title}</div>
            <div style={{ fontSize:11,color:C.mu }}>{AUDIO_URLS[track.title]?"● Live audio":"○ Coming soon"}</div>
          </div>
          <button onClick={e=>{e.stopPropagation();toggleLike(track.id,e);}} style={{ background:"none",border:"none",padding:6,lineHeight:0 }}><Ico.Heart on={liked.has(track.id)}/></button>
          <button onClick={e=>{e.stopPropagation();setPlay(p=>!p);}} style={{ width:36,height:36,borderRadius:"50%",background:C.cr,border:"none",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:0,flexShrink:0 }}>
            {playing?<Ico.Pause dark={!isDark}/>:<Ico.Play dark={!isDark}/>}
          </button>
          <div style={{ position:"absolute",bottom:0,left:0,right:0,height:2,background:C.border,borderRadius:"0 0 10px 10px" }}>
            <div style={{ width:`${prog}%`,height:"100%",background:OMBRE,borderRadius:"0 0 0 10px",backgroundSize:"200%",backgroundPosition:"left",transition:"width 0.3s" }}/>
          </div>
        </div>
      )}
      {!isPreview && fullP && <MobilePlayer track={track} playing={playing} setPlay={setPlay} liked={liked} toggleLike={toggleLike} prog={prog} seekTo={seekTo} prevTrack={prevTrack} nextTrack={nextTrack} onClose={()=>setFullP(false)} C={C} isDark={isDark} hasAudio={!!AUDIO_URLS[track.title]}/>}
      {/* Bottom nav */}
      {!fullP && (
        <div style={{ position:"absolute",bottom:0,left:0,right:0,height:isPreview?52:68,background:C.nav,borderTop:`0.5px solid ${C.border}`,display:"flex",zIndex:60 }}>
          {[...tabs,{id:"shop",label:"Shop",I:Ico.Shop}].map(n=>(
            <button key={n.id} onClick={()=>setTab(n.id)} style={{ flex:1,background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,paddingBottom:isPreview?4:6,cursor:"pointer",WebkitTapHighlightColor:"transparent" }}>
              <n.I a={tab===n.id} c={tab===n.id?(n.id==="proof"?R:C.cr):C.dim}/>
              <span style={{ fontSize:9,fontWeight:tab===n.id?700:400,color:tab===n.id?(n.id==="proof"?R:C.cr):C.dim }}>{n.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── PREVIEW BANNER ────────────────────────────────────────────────────────────
function PreviewBanner({ onSignOut, C }) {
  return (
    <div style={{ background:OMBRE,backgroundSize:"200%",backgroundPosition:"left",padding:"9px 16px",textAlign:"center",flexShrink:0 }}>
      <span style={{ fontSize:12,fontWeight:700,color:"#000",fontFamily:"'Jost',sans-serif" }}>
        🔒 Preview mode — <span onClick={onSignOut} style={{ textDecoration:"underline",cursor:"pointer" }}>join to unlock all tracks</span>
      </span>
    </div>
  );
}

// ── DESKTOP PLAYER ─────────────────────────────────────────────────────────────
function DesktopPlayer({ track, playing, setPlay, liked, toggleLike, prog, seekTo, prevTrack, nextTrack, C, isDark }) {
  return (
    <div style={{ height:88,background:C.nav,borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",padding:"0 16px",gap:0,flexShrink:0 }}>
      <div style={{ width:220,display:"flex",alignItems:"center",gap:12,flexShrink:0 }}>
        <Thumb title={track.title} size={52} radius={4}/>
        <div style={{ minWidth:0 }}>
          <div style={{ fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2,color:C.cr }}>{track.title}</div>
          <div style={{ fontSize:11,color:C.mu }}>Reshma Oracle</div>
        </div>
        <button onClick={e=>toggleLike(track.id,e)} style={{ background:"none",border:"none",lineHeight:0,padding:8 }}><Ico.Heart on={liked.has(track.id)}/></button>
      </div>
      <div style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6 }}>
        <div style={{ display:"flex",alignItems:"center",gap:20 }}>
          <span style={{ fontSize:14,color:C.dim,cursor:"pointer" }}>⇄</span>
          <button onClick={prevTrack} style={{ background:"none",border:"none",lineHeight:0,cursor:"pointer" }}><svg width="22" height="22" viewBox="0 0 24 24" fill={C.mu}><path d="M19 20L9 12l10-8v16z"/><rect x="5" y="4" width="2.5" height="16" rx="1" fill={C.mu}/></svg></button>
          <button onClick={()=>setPlay(p=>!p)} style={{ width:36,height:36,borderRadius:"50%",background:OMBRE,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",backgroundSize:"200%",backgroundPosition:"left",boxShadow:"0 2px 12px rgba(212,160,144,0.5)" }}>
            {playing?<Ico.Pause dark/>:<Ico.Play dark/>}
          </button>
          <button onClick={nextTrack} style={{ background:"none",border:"none",lineHeight:0,cursor:"pointer" }}><svg width="22" height="22" viewBox="0 0 24 24" fill={C.mu}><path d="M5 4l10 8-10 8V4z"/><rect x="16.5" y="4" width="2.5" height="16" rx="1" fill={C.mu}/></svg></button>
          <span style={{ fontSize:14,color:R,cursor:"pointer" }}>↻</span>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:8,width:"100%",maxWidth:520 }}>
          <span style={{ fontSize:11,color:C.dim,width:32,textAlign:"right" }}>—</span>
          <div style={{ flex:1,height:4,background:C.border,borderRadius:2,cursor:"pointer" }} onClick={e=>{const r=e.currentTarget.getBoundingClientRect();seekTo(Math.round(((e.clientX-r.left)/r.width)*100),e);}}>
            <div style={{ width:`${prog}%`,height:"100%",background:OMBRE,borderRadius:2,backgroundSize:"200%",backgroundPosition:"left",transition:"width 0.3s" }}/>
          </div>
          <span style={{ fontSize:11,color:C.dim,width:32 }}>{track.dur}</span>
        </div>
      </div>
      <div style={{ width:160,display:"flex",alignItems:"center",gap:8,justifyContent:"flex-end",flexShrink:0 }}>
        <span style={{ fontSize:14,color:C.dim }}>🔊</span>
        <div style={{ width:80,height:4,background:C.border,borderRadius:2 }}><div style={{ width:"70%",height:"100%",background:C.cr,borderRadius:2 }}/></div>
      </div>
    </div>
  );
}

// ── MOBILE FULL PLAYER ────────────────────────────────────────────────────────
function MobilePlayer({ track, playing, setPlay, liked, toggleLike, prog, seekTo, prevTrack, nextTrack, onClose, C, isDark, hasAudio }) {
  const d = IMGS[track.title] || { g:"#d4a090,#B76E79" };
  return (
    <div style={{ position:"absolute",inset:0,background:`linear-gradient(180deg,${d.g.split(",")[0]}cc 0%,${C.bg} 50%)`,zIndex:200,display:"flex",flexDirection:"column",alignItems:"center",padding:"0 28px",overflowY:"auto" }}>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",paddingTop:52,marginBottom:24 }}>
        <button onClick={onClose} style={{ background:"none",border:"none",lineHeight:0,cursor:"pointer" }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.cr} strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg></button>
        <span style={{ fontSize:12,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",color:C.cr }}>Now Playing</span>
        <div style={{ width:22 }}/>
      </div>
      <Thumb title={track.title} size={270} radius={14}/>
      {!hasAudio && <div style={{ marginTop:8,fontSize:11,color:C.mu,background:C.bg3,borderRadius:20,padding:"4px 12px" }}>Audio coming soon</div>}
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",marginTop:24,marginBottom:20 }}>
        <div>
          <div style={{ fontSize:22,fontWeight:800,marginBottom:4,color:C.cr }}>{track.title}</div>
          <div style={{ fontSize:14,color:C.mu }}>Reshma Oracle</div>
        </div>
        <button onClick={e=>toggleLike(track.id,e)} style={{ background:"none",border:"none",lineHeight:0 }}><Ico.Heart on={liked.has(track.id)}/></button>
      </div>
      <div style={{ width:"100%",marginBottom:8 }}>
        <div style={{ height:4,background:"#4a4a4a",borderRadius:2,cursor:"pointer" }} onClick={e=>{const r=e.currentTarget.getBoundingClientRect();seekTo(Math.round(((e.clientX-r.left)/r.width)*100),e);}}>
          <div style={{ width:`${prog}%`,height:"100%",background:OMBRE,borderRadius:2,backgroundSize:"200%",backgroundPosition:"left",position:"relative",transition:"width 0.3s" }}>
            <div style={{ position:"absolute",right:-6,top:"50%",transform:"translateY(-50%)",width:13,height:13,borderRadius:"50%",background:C.cr }}/>
          </div>
        </div>
      </div>
      <div style={{ display:"flex",justifyContent:"space-between",width:"100%",marginBottom:32 }}>
        <span style={{ fontSize:11,color:C.dim }}>—</span><span style={{ fontSize:11,color:C.dim }}>{track.dur}</span>
      </div>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%" }}>
        <span style={{ fontSize:18,color:C.dim,cursor:"pointer" }}>⇄</span>
        <button onClick={prevTrack} style={{ background:"none",border:"none",lineHeight:0,cursor:"pointer" }}><svg width="24" height="24" viewBox="0 0 24 24" fill={C.cr}><path d="M19 20L9 12l10-8v16z"/><rect x="5" y="4" width="2.5" height="16" rx="1" fill={C.cr}/></svg></button>
        <button onClick={()=>setPlay(p=>!p)} style={{ width:64,height:64,borderRadius:"50%",background:OMBRE,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",backgroundSize:"200%",backgroundPosition:"left",boxShadow:"0 4px 28px rgba(212,160,144,0.5)" }}>
          {playing?<Ico.Pause dark/>:<Ico.Play dark/>}
        </button>
        <button onClick={nextTrack} style={{ background:"none",border:"none",lineHeight:0,cursor:"pointer" }}><svg width="24" height="24" viewBox="0 0 24 24" fill={C.cr}><path d="M5 4l10 8-10 8V4z"/><rect x="16.5" y="4" width="2.5" height="16" rx="1" fill={C.cr}/></svg></button>
        <span style={{ fontSize:18,color:R,cursor:"pointer" }}>↻</span>
      </div>
    </div>
  );
}

// ── HOME TAB ──────────────────────────────────────────────────────────────────
function HomeTab({ greet, track, play, liked, toggleLike, playing, isPreview, C, threads, listenCount, setTab, setLibCat, openProfile, emoLog=[], openGuide, openEmoLog }) {
  const domToday = dominant(emoLog,1), dom7 = dominant(emoLog,7), dom30 = dominant(emoLog,30);
  const manifested = threads.filter(t=>t.done).length;
  const inProgress = threads.filter(t=>!t.done).length;
  return (
    <div>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 16px 12px" }}>
        <span onClick={openProfile} style={{ fontSize:20,fontWeight:700,color:C.cr,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:8 }}>{greet} <span style={{ width:26,height:26,borderRadius:"50%",background:"linear-gradient(135deg,#e8b870,#B76E79)",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#000" }}>R</span></span>
      </div>

      {/* ★ THE GUIDE — first, biggest, unmissable */}
      <div style={{ margin:"0 16px 14px" }}>
        <button onClick={openGuide} style={{ width:"100%", padding:"18px 18px", background:"linear-gradient(135deg,#f5e0a0 0%,#e8b870 25%,#d4a090 55%,#c4789a 80%,#B76E79 100%)", backgroundSize:"200%", backgroundPosition:"left", border:"none", borderRadius:16, cursor:"pointer", display:"flex", alignItems:"center", gap:14, fontFamily:"'Jost',sans-serif", boxShadow:"0 8px 24px rgba(183,110,121,0.35)" }}>
          <span style={{ width:48, height:48, borderRadius:14, background:"rgba(0,0,0,0.85)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, fontWeight:900, color:"#f5e0a0", flexShrink:0 }}>✦</span>
          <span style={{ flex:1, textAlign:"left" }}>
            <div style={{ fontSize:16, fontWeight:900, color:"#000" }}>Open The Guide</div>
            <div style={{ fontSize:12, color:"#000", fontWeight:700, marginTop:3, lineHeight:1.4 }}>The formula · brainwave states · Hawkins scale · how to capture signs · how often to listen</div>
          </span>
          <span style={{ fontSize:22, color:"#000", fontWeight:900, flexShrink:0 }}>›</span>
        </button>
      </div>

      {/* ★ EMOTIONAL PATTERN — dominant state today / 7d / 30d */}
      <div style={{ margin:"0 16px 14px", padding:"14px 14px 12px", borderRadius:14, background:"linear-gradient(135deg,#f5e0a0 0%,#e8b870 22%,#d4a090 48%,#c4789a 72%,#B76E79 100%)", backgroundSize:"200%", backgroundPosition:"left" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <span style={{ fontSize:10, fontWeight:900, color:"#000", letterSpacing:"0.15em", textTransform:"uppercase" }}>Your dominant state</span>
          <button onClick={openEmoLog} style={{ fontSize:10, fontWeight:800, padding:"4px 10px", borderRadius:20, background:"rgba(0,0,0,0.85)", border:"none", color:"#fff", cursor:"pointer", fontFamily:"'Jost',sans-serif" }}>Log now +</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
          {[["Today",domToday],["Last 7 days",dom7],["Last 30 days",dom30]].map(([l,d],i)=>(
            <div key={i} style={{ background:"rgba(255,255,255,0.85)", borderRadius:10, padding:"9px 8px", textAlign:"center" }}>
              <div style={{ fontSize:9, color:"#333", fontWeight:800, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:4 }}>{l}</div>
              <div style={{ fontSize:14, fontWeight:900, color:d?.c||"#000", lineHeight:1.1 }}>{d?.n||"—"}</div>
              <div style={{ fontSize:9, color:"#666", fontWeight:700, marginTop:2 }}>{d?.v||""}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize:10.5, color:"#000", marginTop:9, textAlign:"center", fontWeight:600 }}>
          {dom7&&dom30 ? (dom7.v>dom30.v ? `✦ You're climbing. +${dom7.v-dom30.v} points this week.` : dom7.v<dom30.v ? "Log where you are today — the audios pull you back up." : "Steady. Keep listening.") : "Log how you're feeling to see the pattern."}
        </div>
      </div>



      {/* ANALYTICS BOARD — first thing you see on the dashboard */}
      <div style={{ margin:"0 16px 20px" }}>
        <AnalyticsBoard
          theme={C.cr==="#ffffff"?"dark":"light"}
          data={isPreview ? DEMO_ANALYTICS : {
            manifested, inProgress,
            signs: threads.reduce((a,t)=>a+(t.signs?.length||0),0),
            listens: listenCount,
            streakDays: 14,
            week: [2,4,3,6,5,4,Math.max(1,listenCount%7)],
            topCats: Object.entries(threads.reduce((m,t)=>{m[t.category]=(m[t.category]||0)+1;return m;},{}))
              .sort((a,b)=>b[1]-a[1]).slice(0,3)
              .map(([name,n])=>[name,({"SP & Love":"#B76E79","Money":"#e8b870","Beauty":"#d4a090","Identity":"#c4789a","DNA":"#c4789a","Sleep":"#d4a090"})[name]||"#B76E79",n]),
          }}
          onViewProof={isPreview?null:()=>setTab("proof")}
        />
      </div>

      <Sec title="Your favorites ♡" C={C} onShowAll={()=>{setLibCat("Liked");setTab("library");}}>
        {TRACKS.filter(t=>liked.has(t.id)).length===0
          ? <div style={{ padding:"14px 16px",background:C.bg3,borderRadius:12,fontSize:12,color:C.mu,fontWeight:600 }}>Tap the ♡ on any track and it lives here — your personal rotation.</div>
          : <HRow>
              {TRACKS.filter(t=>liked.has(t.id)).map(t=><TCard key={t.id} track={t} current={track} play={play} playing={playing} isPreview={isPreview} C={C} liked={liked} toggleLike={toggleLike}/>)}
            </HRow>}
      </Sec>

      <Sec title="New this week ✦" C={C} onShowAll={()=>{setLibCat("All");setTab("library");}}>
        <HRow>
          {TRACKS.filter(t=>t.isNew).map(t=><TCard key={t.id} track={t} current={track} play={play} playing={playing} isPreview={isPreview} C={C} liked={liked} toggleLike={toggleLike}/>)}
        </HRow>
      </Sec>

      {/* JUMP BACK IN */}
      <Sec title="Jump back in" C={C} onShowAll={()=>{setLibCat("All");setTab("library");}}>
        <HRow>
          {TRACKS.slice(0,5).map(t=><TCard key={t.id} track={t} current={track} play={play} playing={playing} isPreview={isPreview} C={C} liked={liked} toggleLike={toggleLike}/>)}
        </HRow>
      </Sec>

      {/* LISTENING GUIDE */}
      <Sec title="Listening guide" C={C} onShowAll={openGuide}>
        <div style={{ padding:"0 16px" }}>
          {[
            { time:"Morning", tip:"Listen before getting up — your brain is in alpha. Best for identity tracks.", icon:"🌅" },
            { time:"Night",   tip:"Loop sleep tracks as you fall asleep. Brain enters theta, then delta — deepest install.", icon:"🌙" },
            { time:"Anytime", tip:"Subliminal tracks play in background while you work, cook, commute. Every listen counts.", icon:"✦" },
          ].map((g,i)=>(
            <div key={i} style={{ display:"flex",gap:12,alignItems:"flex-start",padding:"10px 0",borderBottom:i<2?`0.5px solid ${C.border}`:"none" }}>
              <span style={{ fontSize:20,flexShrink:0,marginTop:2 }}>{g.icon}</span>
              <div>
                <div style={{ fontSize:13,fontWeight:700,color:C.cr,marginBottom:2 }}>{g.time}</div>
                <div style={{ fontSize:12,color:C.mu,lineHeight:1.6 }}>{g.tip}</div>
              </div>
            </div>
          ))}
        </div>
      </Sec>

      {/* CATEGORIES */}
      <Sec title="Browse by desire" C={C}>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,padding:"0 16px" }}>
          {[["SP & Love","#ffd6e7","#ffb3cc"],["Money","#d4f4d4","#a8e6a8"],["Beauty","#e8d0ff","#d4a8ff"],["Sleep","#d0e8f8","#a8ccf0"],["DNA","#e0d0ff","#c0a8f0"],["Identity","#fde8e8","#f0b8b8"]].map(([l,c1,c2],i)=>(
            <div key={i} onClick={()=>{setLibCat(l);setTab("library");}} style={{ height:64,borderRadius:10,overflow:"hidden",position:"relative",cursor:"pointer",background:`linear-gradient(135deg,${c1},${c2})` }}>
              <span style={{ position:"absolute",bottom:10,left:12,fontSize:13,fontWeight:800,color:"#000" }}>{l}</span>
            </div>
          ))}
        </div>
      </Sec>
    </div>
  );
}

// ── SEARCH TAB ────────────────────────────────────────────────────────────────
function SearchTab({ tracks, searchQ, setQ, play, track:cur, playing, liked, toggleLike, isPreview, C }) {
  const res = searchQ.length>1 ? tracks.filter(t=>t.title.toLowerCase().includes(searchQ.toLowerCase())||t.cat.toLowerCase().includes(searchQ.toLowerCase())) : tracks;
  return (
    <div style={{ padding:"16px 16px 0" }}>
      <div style={{ fontSize:20,fontWeight:700,marginBottom:14,color:C.cr }}>Search</div>
      <div style={{ display:"flex",alignItems:"center",gap:10,background:C.inputBg,borderRadius:10,padding:"10px 14px",marginBottom:16 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.dim} strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input value={searchQ} onChange={e=>setQ(e.target.value)} placeholder="Tracks, categories, desires…"
          style={{ border:"none",background:"transparent",flex:1,fontSize:14,color:C.inputCr,outline:"none",fontFamily:"'Jost',sans-serif"}}/>
        {searchQ && <button onClick={()=>setQ("")} style={{ background:"none",border:"none",color:C.dim,fontSize:16,cursor:"pointer",lineHeight:1 }}>✕</button>}
      </div>
      {res.map(t=>{
        const isP = cur?.id===t.id;
        return (
        <div key={t.id} onClick={()=>play(t)} style={{ display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:`0.5px solid ${C.border}`,cursor:isPreview?"not-allowed":"pointer" }}>
          <div style={{ position:"relative",flexShrink:0 }}>
            <Thumb title={t.title} size={48} radius={6}/>
            {isPreview&&<div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center" }}><Ico.Lock/></div>}
          </div>
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ fontSize:13,fontWeight:600,color:isP?R:C.cr,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2 }}>{t.title}</div>
            <div style={{ fontSize:11,color:C.mu }}>{t.artist} · {t.cat} · {t.dur}</div>
          </div>
          {t.isNew&&<span style={{ fontSize:9,padding:"2px 7px",background:`${R}22`,color:R,borderRadius:20,fontWeight:700,flexShrink:0 }}>NEW</span>}
          {!isPreview && (
            <>
              <button onClick={e=>{e.stopPropagation();toggleLike(t.id,e);}} style={{ background:"none",border:"none",padding:6,lineHeight:0,flexShrink:0 }}><Ico.Heart on={liked.has(t.id)}/></button>
              <button onClick={e=>{e.stopPropagation();play(t);}} style={{ width:32,height:32,borderRadius:"50%",background:isP?R:C.bg3,border:"none",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer",padding:0 }}>
                {isP&&playing?<Ico.Pause dark={isP}/>:<Ico.Play dark={isP}/>}
              </button>
            </>
          )}
        </div>
      );})}
    </div>
  );
}

// ── LIBRARY TAB ───────────────────────────────────────────────────────────────
function LibraryTab({ tracks, cat, setCat, libFormat, setLibFormat, play, track:cur, liked, toggleLike, playing, isPreview, C }) {
  const cats = ["All","Liked","SP & Love","Money","Beauty","Sleep","DNA","Identity"];
  const byCat = cat==="Liked" ? tracks.filter(t=>liked.has(t.id)) : (cat==="All" ? tracks : tracks.filter(t=>t.cat===cat));
  const shown = libFormat==="All" ? byCat : byCat.filter(t=>t.format===libFormat);
  return (
    <div>
      <div style={{ padding:"16px 16px 10px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <span style={{ fontSize:20,fontWeight:700,color:C.cr }}>Your Library</span>
      </div>
      <div style={{ display:"flex",gap:8,padding:"0 16px 8px",overflowX:"auto",WebkitOverflowScrolling:"touch" }}>
        {cats.map(c=>(
          <button key={c} onClick={()=>setCat(c)} style={{ flexShrink:0,padding:"6px 14px",borderRadius:20,background:cat===c?C.cr:C.bg3,border:"none",color:cat===c?"#000":C.cr,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>{c}</button>
        ))}
      </div>
      {/* FORMAT FILTER — Subliminal / Hypnosis / Melodic / Reiki / 528hz */}
      <div style={{ display:"flex",gap:6,padding:"0 16px 14px",overflowX:"auto",WebkitOverflowScrolling:"touch" }}>
        {FORMATS.map(fm=>(
          <button key={fm} onClick={()=>setLibFormat(fm)} style={{ flexShrink:0,padding:"4px 12px",borderRadius:20,background:libFormat===fm?R:"none",border:`1px solid ${libFormat===fm?R:C.border}`,color:libFormat===fm?"#000":C.mu,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>{fm==="All"?"All formats":fm}</button>
        ))}
      </div>
      {shown.length===0 && cat==="Liked" && (
        <div style={{ padding:"40px 20px",textAlign:"center",color:C.mu }}>
          <div style={{ fontSize:32,marginBottom:12 }}>♡</div>
          <div style={{ fontSize:14 }}>Tap the heart on any track to save it here.</div>
        </div>
      )}
      <div style={{ padding:"0 16px" }}>
        {shown.map(t=>(
          <div key={t.id} onClick={()=>play(t)} style={{ display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:`0.5px solid ${C.border}`,cursor:isPreview?"not-allowed":"pointer" }}>
            <div style={{ position:"relative",flexShrink:0 }}>
              <Thumb title={t.title} size={50} radius={6}/>
              {isPreview&&<div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center" }}><Ico.Lock/></div>}
              {!isPreview&&cur?.id===t.id&&playing&&(
                <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <div style={{ display:"flex",alignItems:"flex-end",gap:2 }}>{[8,14,10,14,8].map((h,i)=><div key={i} style={{ width:2,height:h,background:R,borderRadius:1 }}/>)}</div>
                </div>
              )}
            </div>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ fontSize:14,fontWeight:600,color:(!isPreview&&cur?.id===t.id)?R:C.cr,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2 }}>
                {t.title}{t.isNew&&<span style={{ marginLeft:6,fontSize:9,background:`${R}22`,color:R,padding:"1px 5px",borderRadius:8,fontWeight:700,verticalAlign:"middle" }}>NEW</span>}
              </div>
              <div style={{ fontSize:11,color:C.mu }}>{t.tier==="goddess"&&<span style={{ color:R }}>✦ </span>}{t.artist} · {t.cat} · {t.format} · {t.dur}</div>
            </div>
            {!isPreview&&(
              <>
                <button onClick={e=>{e.stopPropagation();toggleLike(t.id,e);}} style={{ background:"none",border:"none",padding:8,lineHeight:0 }}>
                  <Ico.Heart on={liked.has(t.id)}/>
                </button>
                <button onClick={e=>{e.stopPropagation();play(t);}} style={{ width:30,height:30,borderRadius:"50%",background:cur?.id===t.id?R:C.bg3,border:"none",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer",padding:0 }}>
                  {cur?.id===t.id&&playing?<Ico.Pause dark={cur?.id===t.id}/>:<Ico.Play dark={cur?.id===t.id}/>}
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PROOFOS TAB ────────────────────────────────────────────────────────────────
function ProofTab({ threads, setThreads, isPreview, C, currentTrack }) {
  const [newD, setD]       = useState("");
  const [newCat, setCat]   = useState("Money");
  const [linkedTrack, setLinked] = useState(currentTrack?.title || "");
  const [newFeel, setFeel] = useState("");
  const [adding, setAdding] = useState(false);
  const [view, setView] = useState("threads"); // threads | wall
  const [signInput, setSignInput] = useState({}); // {threadId: text}
  const [finishing, setFinishing] = useState(null); // threadId being marked done
  const [feelAfterInput, setFeelAfterInput] = useState("");

  // Local palette for ombre dashboard — black text on ombre, cream cards
  const PC = { card:"rgba(255,252,248,0.88)", cardSolid:"#fffcf8", text:"#000", mu:"#4a2830", dim:"#6a4048", border:"rgba(0,0,0,0.14)", inputBg:"rgba(255,255,255,0.95)" };
  const OMBRE_BG = "linear-gradient(165deg,#f5e0a0 0%,#e8b870 20%,#d4a090 45%,#c4789a 72%,#B76E79 100%)";

  if (isPreview) return (
    <div style={{ padding:"40px 20px",textAlign:"center",background:OMBRE_BG,minHeight:"100%" }}>
      <div style={{ fontSize:36,marginBottom:16 }}>✦</div>
      <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:600,color:"#000",marginBottom:10 }}>ProofOS</div>
      <div style={{ fontSize:14,color:"#1a0a10",lineHeight:1.8,marginBottom:24,maxWidth:300,margin:"0 auto 24px",fontWeight:500 }}>
        Your manifestation tracker for life. Log desires, capture every sign, build your proof wall. Included in Goddess Tier.
      </div>
      <button style={{ padding:"12px 24px",background:"#000",border:"none",borderRadius:12,color:"#f2ece4",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>
        Upgrade to Goddess — £33/mo
      </button>
    </div>
  );

  const manifested = threads.filter(t=>t.done);
  const totalSigns = threads.reduce((a,t)=>a+(t.signs?.length||0),0);

  const startFinish = (id) => { setFinishing(id); setFeelAfterInput(""); };
  const confirmFinish = (id) => {
    setThreads(threads.map(t=>t.id===id?{...t,done:true,feelAfter:feelAfterInput||t.feelAfter,manifestedAt:new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short"})}:t));
    setFinishing(null); setFeelAfterInput("");
  };
  const undoMarkDone = (id) => setThreads(threads.map(t=>t.id===id?{...t,done:false,manifestedAt:null}:t));
  const deleteThread = (id) => { if(window.confirm("Delete this thread?")) setThreads(threads.filter(t=>t.id!==id)); };
  const addSign = (id) => {
    const text = (signInput[id]||"").trim();
    if(!text) return;
    const date = new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short"});
    setThreads(threads.map(t=>t.id===id?{...t,signs:[...(t.signs||[]),{text,date}]}:t));
    setSignInput({...signInput,[id]:""});
  };
  const addMediaSign = (id, media) => {
    const date = new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short"});
    setThreads(ts=>ts.map(t=>t.id===id?{...t,signs:[...(t.signs||[]),{...media,date}]}:t));
  };
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const saveEdit = (id) => { if(editText.trim()) setThreads(ts=>ts.map(t=>t.id===id?{...t,desire:editText.trim()}:t)); setEditId(null); };
  const [recId, setRecId] = useState(null);
  const recRef = useRef(null);
  const toggleRec = async (id) => {
    if (recId === id) { recRef.current?.stop(); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio:true });
      const mr = new MediaRecorder(stream);
      const chunks = [];
      mr.ondataavailable = e => chunks.push(e.data);
      mr.onstop = () => {
        const url = URL.createObjectURL(new Blob(chunks,{type:mr.mimeType||"audio/mp4"}));
        addMediaSign(id,{audio:url,text:"Voice note"});
        stream.getTracks().forEach(t=>t.stop());
        setRecId(null);
      };
      mr.start(); recRef.current = mr; setRecId(id);
    } catch { alert("Microphone access needed for voice notes."); }
  };

  return (
    <div style={{ padding:"16px 16px 24px", background:OMBRE_BG, minHeight:"100%" }}>
      <div style={{ fontSize:22,fontWeight:800,marginBottom:2,color:PC.text }}>ProofOS <span style={{ color:"#000" }}>✦</span></div>
      <div style={{ fontSize:13,color:PC.mu,marginBottom:14,fontWeight:600 }}>Your manifestation tracker for life. Every sign captured — forever.</div>

      {/* Stats */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14 }}>
        {[[threads.length,"Intentions"],[manifested.length,"Manifested"],[totalSigns,"Signs logged"]].map(([v,l],i)=>(
          <div key={i} style={{ background:PC.card,borderRadius:12,padding:"12px 6px",textAlign:"center" }}>
            <div style={{ fontSize:22,fontWeight:800,color:PC.text }}>{v}</div>
            <div style={{ fontSize:10,color:PC.mu,fontWeight:700 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* View toggle: Threads | Proof Wall */}
      <div style={{ display:"flex",gap:6,marginBottom:14 }}>
        {[["threads","Threads"],["wall",`Proof Wall (${manifested.length})`]].map(([k,l])=>(
          <button key={k} onClick={()=>setView(k)} style={{ flex:1,padding:"10px 8px",borderRadius:10,background:view===k?"#000":PC.card,border:"none",color:view===k?"#f2ece4":PC.text,fontSize:12,fontWeight:800,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>{l}</button>
        ))}
      </div>

      {view==="wall" ? (
        /* ═══ PROOF WALL — your wins, forever ═══ */
        <div>
          <div style={{ fontSize:11,color:"#000",fontWeight:800,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10 }}>✓ Your proof wall</div>
          {manifested.length===0 ? (
            <div style={{ background:PC.card,borderRadius:14,padding:"28px 18px",textAlign:"center" }}>
              <div style={{ fontSize:26,marginBottom:8 }}>✦</div>
              <div style={{ fontSize:13,color:PC.mu,lineHeight:1.7,fontWeight:600 }}>Nothing manifested yet.<br/>Your first win lands here — and stays here for life.</div>
            </div>
          ) : (
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
              {manifested.map(d=>(
                <div key={d.id} style={{ background:CAT_GRAD[d.category]||CAT_GRAD.Identity, borderRadius:12, padding:"12px 12px", position:"relative" }}>
                  <span style={{ fontSize:9,padding:"2px 8px",background:"rgba(255,255,255,0.65)",color:CAT_COLOR[d.category]||"#000",borderRadius:20,fontWeight:800 }}>✓ {d.category}</span>
                  <div style={{ fontSize:13,fontWeight:800,color:"#000",marginTop:6,lineHeight:1.3 }}>{d.desire}</div>
                  <div style={{ fontSize:10,color:"#1a1a1a",fontWeight:700,marginTop:4 }}>{d.days}d · {d.signs?.length||0} signs{(d.signs||[]).some(s=>s.img)?" · 📷":""}{(d.signs||[]).some(s=>s.audio)?" · 🎤":""} · {d.manifestedAt||""}</div>
                  {d.feelAfter && <div style={{ fontSize:10,color:"#1a1a1a",marginTop:5,lineHeight:1.45 }}>"{d.feelAfter}"</div>}
                  <button onClick={()=>undoMarkDone(d.id)} style={{ position:"absolute",top:8,right:8,fontSize:9,background:"rgba(255,255,255,0.55)",border:"none",borderRadius:10,padding:"2px 7px",color:"#000",cursor:"pointer",fontWeight:700,fontFamily:"'Jost',sans-serif" }}>undo</button>
                </div>
              ))}
              <div style={{ background:"rgba(255,255,255,0.35)",border:"1px dashed rgba(0,0,0,0.3)",borderRadius:12,padding:12,display:"flex",alignItems:"center",justifyContent:"center",minHeight:80 }}>
                <span style={{ fontSize:11,color:"#1a0a10",textAlign:"center",fontWeight:700,lineHeight:1.4 }}>Your next<br/>manifestation</span>
              </div>
              <div style={{ gridColumn:"1/-1" }}>
              <div style={{ fontSize:11,fontWeight:900,color:"#000",letterSpacing:"0.15em",textTransform:"uppercase",margin:"18px 0 8px" }}>All captured proof · newest last</div>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(90px,1fr))",gap:8 }}>
                {threads.flatMap(t=>(t.signs||[]).filter(s=>s.img||s.audio).map((s,ix)=>({...s,desire:t.desire,key:t.id+"-"+ix}))).map(s=>(
                  <div key={s.key} style={{ background:"rgba(255,255,255,0.85)",borderRadius:10,padding:6,border:"1px solid rgba(0,0,0,0.12)" }}>
                    {s.img && <img src={s.img} alt="proof" style={{ width:"100%",height:72,objectFit:"cover",borderRadius:7 }}/>}
                    {s.audio && <div style={{ height:72,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4 }}><span style={{fontSize:22}}>🎤</span><audio src={s.audio} controls style={{ width:"100%",height:24 }}/></div>}
                    <div style={{ fontSize:8.5,fontWeight:700,color:"#333",marginTop:4,lineHeight:1.3,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical" }}>{s.desire} · {s.date}</div>
                  </div>
                ))}
              </div>
              </div>
            </div>
          )}
        </div>
      ) : (
      <>
      {/* ADD NEW THREAD */}
      <button onClick={()=>setAdding(a=>!a)} style={{ width:"100%",padding:12,background:adding?PC.card:"#000",border:"none",borderRadius:12,color:adding?PC.text:"#f2ece4",fontSize:13,fontWeight:800,marginBottom:12,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>
        {adding?"✕ Cancel":"+ New Intention"}
      </button>
      {adding && (
        <div style={{ background:PC.cardSolid,borderRadius:14,padding:16,marginBottom:14 }}>
          <div style={{ fontSize:11,color:PC.mu,fontWeight:800,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:8 }}>State your desire</div>
          <input value={newD} onChange={e=>setD(e.target.value)} placeholder="I receive… I am… I have…"
            style={{ width:"100%",background:PC.inputBg,border:`1px solid ${PC.border}`,color:"#000",borderRadius:8,padding:"10px 12px",fontSize:13,marginBottom:10,outline:"none",fontFamily:"'Jost',sans-serif",boxSizing:"border-box" }}/>
          <div style={{ fontSize:11,color:PC.mu,fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6 }}>Link to audio</div>
          <select value={linkedTrack} onChange={e=>setLinked(e.target.value)}
            style={{ width:"100%",background:PC.inputBg,border:`1px solid ${PC.border}`,color:"#000",borderRadius:8,padding:"10px 12px",fontSize:13,marginBottom:10,fontFamily:"'Jost',sans-serif",outline:"none",boxSizing:"border-box" }}>
            <option value="">— Select a track —</option>
            {TRACKS.map(t=><option key={t.id} value={t.title}>{t.title} · {t.cat}</option>)}
          </select>
          <div style={{ fontSize:11,color:PC.mu,fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6 }}>Category</div>
          <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:12 }}>
            {["SP & Love","Money","Beauty","Identity","DNA","Sleep"].map(c=>(
              <button key={c} onClick={()=>setCat(c)} style={{ padding:"5px 12px",borderRadius:20,background:newCat===c?"#000":"none",border:`1px solid ${newCat===c?"#000":PC.border}`,color:newCat===c?"#f2ece4":PC.mu,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>{c}</button>
            ))}
          </div>
          <div style={{ fontSize:11,color:PC.mu,fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6 }}>How am I feeling right now?</div>
          <select value={newFeel} onChange={e=>setFeel(e.target.value)}
            style={{ width:"100%",padding:"11px 14px",borderRadius:10,border:`1px solid ${PC.border}`,background:newFeel?`linear-gradient(90deg,${(HAWKINS.find(h=>h.n===newFeel)||{}).c||"#B76E79"},#B76E79)`:PC.inputBg,color:newFeel?"#fff":"#000",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'Jost',sans-serif",marginBottom:12,outline:"none",appearance:"none",WebkitAppearance:"none",backgroundImage:"url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='3'><polyline points='6 9 12 15 18 9'/></svg>\")",backgroundRepeat:"no-repeat",backgroundPosition:"right 14px center",paddingRight:36 }}>
            <option value="">— Select on the Hawkins scale (Shame 20 → Enlightenment 700) —</option>
            <optgroup label="Below 200 · Contractive (drains energy)">
              {HAWKINS.filter(h=>h.v<200).map(h=><option key={h.n} value={h.n}>{h.n} · {h.v}</option>)}
            </optgroup>
            <optgroup label="200 and above · Expansive (creates)">
              {HAWKINS.filter(h=>h.v>=200).map(h=><option key={h.n} value={h.n}>{h.n} · {h.v}</option>)}
            </optgroup>
          </select>
          <button onClick={()=>{
            if(!newD.trim()) return;
            setThreads([{id:Date.now(),desire:newD,days:0,done:false,signs:[],track:linkedTrack,category:newCat,feelBefore:newFeel,feelAfter:""},...threads]);
            setD(""); setLinked(""); setFeel(""); setAdding(false);
          }} style={{ padding:"11px 22px",background:"#000",border:"none",borderRadius:10,color:"#f2ece4",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>
            Add Proof Thread
          </button>
        </div>
      )}

      {/* THREAD LIST */}
      {threads.map(d=>(
        <div key={d.id} onTouchStart={e=>{window.__sx=e.touches[0].clientX;}} onTouchEnd={e=>{if(window.__sx-e.changedTouches[0].clientX>90)deleteThread(d.id);}} style={{ background:PC.cardSolid,borderRadius:14,padding:"14px 14px",marginBottom:10,position:"relative" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10 }}>
            <div style={{ flex:1,minWidth:0 }}>
              {editId===d.id
                ? <div style={{ display:"flex",gap:6,marginBottom:4 }}>
                    <input autoFocus value={editText} onChange={e=>setEditText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveEdit(d.id)} style={{ flex:1,background:"#fff",border:"1.5px solid #B76E79",color:"#000",borderRadius:8,padding:"7px 10px",fontSize:14,fontWeight:700,outline:"none",fontFamily:"'Jost',sans-serif" }}/>
                    <button onClick={()=>saveEdit(d.id)} style={{ padding:"7px 12px",background:"#000",border:"none",borderRadius:8,color:"#fff",fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>Save</button>
                  </div>
                : <div onClick={()=>{setEditId(d.id);setEditText(d.desire);}} style={{ fontSize:15,fontWeight:800,marginBottom:4,color:"#000",cursor:"pointer" }}>{d.desire} <span style={{ fontSize:11,opacity:0.45 }}>✎</span></div>}
              <div style={{ display:"flex",alignItems:"center",gap:6,flexWrap:"wrap" }}>
                {d.category && <span style={{ fontSize:10,padding:"2px 9px",background:CAT_GRAD[d.category]||CAT_GRAD.Identity,color:"#000",borderRadius:20,fontWeight:800 }}>{d.category}</span>}
                {d.track && <span style={{ fontSize:11,color:PC.mu,fontWeight:600 }}>♪ {d.track}</span>}
              </div>
              {d.feelBefore && <div style={{ fontSize:11,color:PC.dim,marginTop:6,lineHeight:1.5 }}><b style={{color:PC.mu}}>Before:</b> "{d.feelBefore}"</div>}
              {d.done && d.feelAfter && <div style={{ fontSize:11,color:"#1a7030",marginTop:2,lineHeight:1.5,fontWeight:600 }}><b>After:</b> "{d.feelAfter}"</div>}
            </div>
            <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6,flexShrink:0 }}>
              <button onClick={()=>deleteThread(d.id)} title="Delete" style={{ fontSize:12,width:22,height:22,background:"none",border:"none",color:PC.dim,cursor:"pointer",lineHeight:1 }}>✕</button>
              {d.done
                ? <>
                    <label onClick={()=>undoMarkDone(d.id)} style={{ display:"flex",alignItems:"center",gap:7,cursor:"pointer" }}>
                      <span style={{ width:21,height:21,borderRadius:6,background:"linear-gradient(135deg,#f5e0a0,#e8b870,#B76E79)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:900,color:"#000",boxShadow:"0 0 12px rgba(232,184,112,0.9)" }}>✓</span>
                      <span style={{ fontSize:11,fontWeight:900,color:"#000" }}>Manifested</span>
                    </label>
                    <span style={{ fontSize:9,color:PC.dim,fontWeight:600 }}>tap to undo</span>
                  </>
                : <label onClick={()=>startFinish(d.id)} style={{ display:"flex",alignItems:"center",gap:7,cursor:"pointer" }}>
                    <span style={{ width:21,height:21,borderRadius:6,background:"#fff",border:"2px solid #000",boxShadow:"0 0 10px rgba(232,184,112,0.55)" }}/>
                    <span style={{ fontSize:11,fontWeight:900,color:"#000" }}>Manifested</span>
                  </label>
              }
            </div>
          </div>

          {/* Marking manifested — capture feelAfter */}
          {finishing===d.id && (
            <div style={{ marginTop:10,background:"rgba(200,236,200,0.5)",borderRadius:10,padding:"10px 12px" }}>
              <div style={{ fontSize:11,color:"#1a5028",fontWeight:800,marginBottom:6 }}>IT ARRIVED ✓ — how are you feeling now?</div>
              <div style={{ display:"flex",gap:6 }}>
                <input autoFocus value={feelAfterInput} onChange={e=>setFeelAfterInput(e.target.value)} placeholder="Capture this moment"
                  onKeyDown={e=>e.key==="Enter"&&confirmFinish(d.id)}
                  style={{ flex:1,background:"#fff",border:"1px solid rgba(26,112,48,0.3)",color:"#000",borderRadius:8,padding:"9px 10px",fontSize:12,outline:"none",fontFamily:"'Jost',sans-serif" }}/>
                <button onClick={()=>confirmFinish(d.id)} style={{ padding:"9px 14px",background:"#1a7030",border:"none",borderRadius:8,color:"#fff",fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>Save ✓</button>
              </div>
            </div>
          )}

          {/* ═══ SIGNS & SYNCHRONICITY LOG — the heart of ProofOS ═══ */}
          <div style={{ marginTop:12,paddingTop:10,borderTop:`1px solid ${PC.border}` }}>
            <div style={{ fontSize:10,color:PC.mu,fontWeight:800,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:6 }}>Signs & synchronicities · {d.signs?.length||0}</div>
            {(d.signs||[]).map((sg,si)=>(
              <div key={si} style={{ display:"flex",alignItems:"flex-start",gap:8,marginBottom:5 }}>
                <span style={{ fontSize:11,color:CAT_COLOR[d.category]||"#B76E79",flexShrink:0,marginTop:1 }}>{sg.img?"📷":sg.audio?"🎤":"✦"}</span>
                <span style={{ fontSize:12,color:"#1a1218",lineHeight:1.5,flex:1 }}>
                  {sg.text}
                  {sg.img && <img src={sg.img} alt="proof" style={{ display:"block",width:64,height:64,objectFit:"cover",borderRadius:8,marginTop:5,border:"1px solid rgba(0,0,0,0.15)" }}/>}
                  {sg.audio && <audio src={sg.audio} controls style={{ display:"block",width:"100%",maxWidth:220,height:30,marginTop:5 }}/>}
                </span>
                <span style={{ fontSize:10,color:PC.dim,flexShrink:0,fontWeight:600 }}>{sg.date}</span>
              </div>
            ))}
            {!d.done && (
              <div style={{ display:"flex",gap:6,marginTop:8 }}>
                <input value={signInput[d.id]||""} onChange={e=>setSignInput({...signInput,[d.id]:e.target.value})} placeholder="Log a sign, a synchronicity, a shift…"
                  onKeyDown={e=>e.key==="Enter"&&addSign(d.id)}
                  style={{ flex:1,background:PC.inputBg,border:`1px solid ${PC.border}`,color:"#000",borderRadius:8,padding:"9px 10px",fontSize:12,outline:"none",fontFamily:"'Jost',sans-serif" }}/>
                <button onClick={()=>addSign(d.id)} style={{ padding:"9px 14px",background:"#000",border:"none",borderRadius:8,color:"#f2ece4",fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:"'Jost',sans-serif",whiteSpace:"nowrap" }}>+ Add</button>
                <label style={{ padding:"9px 10px",background:"rgba(0,0,0,0.08)",border:"1px solid rgba(0,0,0,0.15)",borderRadius:8,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center" }}>📷
                  <input type="file" accept="image/*" style={{ display:"none" }} onChange={e=>{ const f=e.target.files?.[0]; if(f) addMediaSign(d.id,{img:URL.createObjectURL(f),text:"Photo proof"}); e.target.value=""; }}/>
                </label>
                <button onClick={()=>toggleRec(d.id)} style={{ padding:"9px 10px",background:recId===d.id?"#b03030":"rgba(0,0,0,0.08)",border:"1px solid rgba(0,0,0,0.15)",borderRadius:8,fontSize:13,cursor:"pointer",color:recId===d.id?"#fff":"#000" }}>{recId===d.id?"⏹":"🎤"}</button>
              </div>
            )}
          </div>

          {/* Progress + delete */}
          <div style={{ marginTop:10,height:3,background:"rgba(0,0,0,0.1)",borderRadius:2 }}>
            <div style={{ width:`${Math.min((d.days||0)*5+((d.signs?.length||0)*8),100)}%`,height:"100%",background:"#000",borderRadius:2 }}/>
          </div>
          <button onClick={()=>deleteThread(d.id)} style={{ fontSize:10,color:"#8a2030",background:"none",border:"none",cursor:"pointer",padding:0,fontFamily:"'Jost',sans-serif",marginTop:8,fontWeight:700 }}>Remove thread</button>
        </div>
      ))}
      </>
      )}
    </div>
  );
}

// ── SHOP TAB ──────────────────────────────────────────────────────────────────
function ShopTab({ C }) {
  const products = [
    { name:"SP Ritual Bundle",      price:"£29", desc:"3-day SP activation + audio guide + intention pages", img:"https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=300&h=300&fit=crop&auto=format", link:BEACONS },
    { name:"Money Frequency Kit",   price:"£19", desc:"Abundance affirmation deck + 528hz curation guide",  img:"https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=300&h=300&fit=crop&auto=format", link:BEACONS },
    { name:"Identity Workbook",     price:"£24", desc:"30-day self-concept workbook with listening prompts", img:"https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=300&h=300&fit=crop&auto=format", link:BEACONS },
    { name:"Beauty Reset Protocol", price:"£22", desc:"14-day glow protocol + subliminal pairing guide",    img:"https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=300&h=300&fit=crop&auto=format", link:BEACONS },
  ];
  return (
    <div style={{ padding:"16px 16px 40px" }}>
      <div style={{ fontSize:20,fontWeight:700,color:C.cr,marginBottom:4 }}>Shop</div>
      <div style={{ fontSize:13,color:C.mu,marginBottom:20 }}>Digital rituals & resources · One-time purchase</div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
        {products.map((p,i)=>(
          <div key={i} onClick={()=>window.open(p.stripe||p.link,"_blank")}
            style={{ background:C.bg2,border:`0.5px solid ${C.border}`,borderRadius:12,overflow:"hidden",cursor:"pointer",transition:"transform 0.15s" }}
            onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
            onMouseLeave={e=>e.currentTarget.style.transform="none"}>
            <div style={{ height:100,overflow:"hidden",position:"relative",background:`linear-gradient(135deg,#1a0a14,#2a1020)` }}>
              <img src={p.img} alt={p.name} style={{ width:"100%",height:"100%",objectFit:"cover",opacity:0.7 }} onError={e=>e.target.style.display="none"}/>
              <div style={{ position:"absolute",bottom:0,left:0,right:0,height:40,background:"linear-gradient(transparent,rgba(0,0,0,0.6))" }}/>
            </div>
            <div style={{ padding:"10px 12px" }}>
              <div style={{ fontSize:12,fontWeight:700,color:C.cr,marginBottom:3,lineHeight:1.3 }}>{p.name}</div>
              <div style={{ fontSize:11,color:C.mu,marginBottom:8,lineHeight:1.4 }}>{p.desc}</div>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                <span style={{ fontSize:15,fontWeight:800,color:R }}>{p.price}</span>
                <span style={{ padding:"4px 10px",background:OMBRE,backgroundSize:"200%",backgroundPosition:"left",borderRadius:8,color:"#000",fontSize:10,fontWeight:800,fontFamily:"'Jost',sans-serif",display:"inline-flex",alignItems:"center",gap:4 }}>{p.stripe?"Buy now · Stripe":"Buy on Beacons"}<ArrowIcon size={10}/></span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:14,padding:"12px 14px",background:C.bg3,border:`0.5px solid ${C.border}`,borderRadius:10,textAlign:"center" }}>
        <div style={{ fontSize:12,color:C.mu }}>All products are delivered instantly via Beacons.ai · One-time payment · No subscription required</div>
      </div>
    </div>
  );
}

// ── HELPERS ────────────────────────────────────────────────────────────────────
function Sec({ title, children, C, onShowAll }) {
  return (
    <div style={{ marginBottom:24 }}>
      <div style={{ padding:"0 16px 10px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <span style={{ fontSize:16,fontWeight:700,color:C.cr }}>{title}</span>
        {onShowAll && <button onClick={onShowAll} style={{ fontSize:11,fontWeight:700,color:R,background:"none",border:"none",cursor:"pointer",fontFamily:"'Jost',sans-serif",padding:"6px 4px" }}>Show all</button>}
      </div>
      {children}
    </div>
  );
}
function HRow({ children }) {
  return <div style={{ display:"flex",gap:12,padding:"0 16px",overflowX:"auto",WebkitOverflowScrolling:"touch",scrollbarWidth:"none" }}>{children}</div>;
}
function TCard({ track:t, current, play, playing, isPreview, C, liked, toggleLike }) {
  const isP = current?.id===t.id;
  return (
    <div style={{ flexShrink:0,width:140 }}>
      <div onClick={()=>play(t)} style={{ position:"relative",marginBottom:8,cursor:isPreview?"not-allowed":"pointer" }}>
        <Thumb title={t.title} size={140} radius={8}/>
        {isPreview?(
          <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.55)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center" }}><Ico.Lock/></div>
        ):(
          <div style={{ position:"absolute",inset:0,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",background:isP&&playing?"rgba(0,0,0,0.45)":"rgba(0,0,0,0)",transition:"background 0.15s" }}
            onMouseEnter={e=>{if(!(isP&&playing))e.currentTarget.style.background="rgba(0,0,0,0.3)";}}
            onMouseLeave={e=>{if(!(isP&&playing))e.currentTarget.style.background="rgba(0,0,0,0)";}}>
            {isP&&playing
              ? <div style={{ display:"flex",alignItems:"flex-end",gap:2 }}>{[10,18,12,18,10].map((h,i)=><div key={i} style={{ width:3,height:h,background:R,borderRadius:1 }}/>)}</div>
              : <div style={{ width:40,height:40,borderRadius:"50%",background:"rgba(255,255,255,0.92)",display:"flex",alignItems:"center",justifyContent:"center" }}><Ico.Play dark/></div>
            }
          </div>
        )}
        {t.isNew&&<div style={{ position:"absolute",top:6,right:6,padding:"2px 7px",background:R,color:"#000",borderRadius:20,fontSize:9,fontWeight:800 }}>NEW</div>}
        {!isPreview && (
          <button onClick={e=>{e.stopPropagation();toggleLike(t.id,e);}} style={{ position:"absolute",bottom:6,right:6,width:26,height:26,borderRadius:"50%",background:"rgba(0,0,0,0.55)",border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",padding:0 }}>
            <Ico.Heart on={liked?.has(t.id)}/>
          </button>
        )}
      </div>
      <div style={{ fontSize:13,fontWeight:600,color:(!isPreview&&isP)?R:C.cr,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2 }}>{t.title}</div>
      <div style={{ fontSize:11,color:C.mu }}>{t.cat} · {t.dur}</div>
    </div>
  );
}
