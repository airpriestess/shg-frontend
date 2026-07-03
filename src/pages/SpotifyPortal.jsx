import { useState, useEffect, useRef } from "react";

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
  light: { bg:"#fdf0e8", bg2:"#fff8f4", bg3:"rgba(183,110,121,0.08)", bg4:"rgba(183,110,121,0.12)", nav:"rgba(253,240,232,0.97)", cr:"#111111", mu:"#6a5048", dim:"#a08878", border:"rgba(183,110,121,0.12)", inputBg:"rgba(0,0,0,0.07)", inputCr:"#111" },
};

const R = "#B76E79", P = "#d4a090";
const OMBRE = "linear-gradient(135deg,#f5e0a0 0%,#e8b870 22%,#d4a090 48%,#c4789a 72%,#B76E79 100%)";

// ── STOCK IMAGES ─────────────────────────────────────────────────────────────
const IMGS = {
  "Spoilt Goddess":           { url:"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&h=200&fit=crop&auto=format", g:"#c87890,#8a3060" },
  "He Finds His Way Back":    { url:"https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=200&h=200&fit=crop&auto=format", g:"#4060b0,#6080d0" },
  "Money Finds Me First":     { url:"https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=200&h=200&fit=crop&auto=format", g:"#306040,#50a070" },
  "While I Sleep I Manifest": { url:"https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=200&h=200&fit=crop&auto=format", g:"#483878,#6858a8" },
  "Gorgeous Is My Default":   { url:"https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=200&h=200&fit=crop&auto=format", g:"#b06840,#d4a060" },
  "DNA Activation Ceremony":  { url:"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=200&h=200&fit=crop&auto=format", g:"#604080,#9060b0" },
  "Lucky Girl Summer":        { url:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&auto=format", g:"#808020,#c0c040" },
  "10 Years Into One Hour":   { url:"https://images.unsplash.com/photo-1496715976403-f5c7c1a1d064?w=200&h=200&fit=crop&auto=format", g:"#305070,#4080a0" },
  "Highest Timeline":         { url:"https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=200&h=200&fit=crop&auto=format", g:"#802050,#c04080" },
};

function Thumb({ title, size=48, radius=4 }) {
  const d = IMGS[title] || { url:null, g:"#483060,#604880" };
  return (
    <div style={{ width:size, height:size, borderRadius:radius, flexShrink:0, overflow:"hidden", background:`linear-gradient(135deg,${d.g})`, position:"relative" }}>
      {d.url && <img src={d.url} alt={title} style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover" }} onError={e=>e.target.style.display="none"}/>}
    </div>
  );
}

// ── TRACK DATA ────────────────────────────────────────────────────────────────
const TRACKS = [
  { id:1,  title:"Spoilt Goddess",           artist:"Reshma Oracle", dur:"4:32",  cat:"Identity",  tier:"audio",   isNew:true,  hasAudio:true  },
  { id:2,  title:"He Finds His Way Back",    artist:"Reshma Oracle", dur:"30:00", cat:"SP & Love", tier:"audio",   isNew:false, hasAudio:false },
  { id:3,  title:"Money Finds Me First",     artist:"Reshma Oracle", dur:"25:00", cat:"Money",     tier:"audio",   isNew:true,  hasAudio:true  },
  { id:4,  title:"While I Sleep I Manifest", artist:"Reshma Oracle", dur:"60:00", cat:"Sleep",     tier:"audio",   isNew:false, hasAudio:false },
  { id:5,  title:"Gorgeous Is My Default",   artist:"Reshma Oracle", dur:"35:00", cat:"Beauty",    tier:"audio",   isNew:false, hasAudio:false },
  { id:6,  title:"DNA Activation Ceremony",  artist:"Reshma Oracle", dur:"45:00", cat:"DNA",       tier:"goddess", isNew:false, hasAudio:false },
  { id:7,  title:"Lucky Girl Summer",        artist:"Reshma Oracle", dur:"22:00", cat:"Identity",  tier:"audio",   isNew:true,  hasAudio:false },
  { id:8,  title:"10 Years Into One Hour",   artist:"Reshma Oracle", dur:"58:00", cat:"Identity",  tier:"audio",   isNew:false, hasAudio:true  },
  { id:9,  title:"Highest Timeline",         artist:"Reshma Oracle", dur:"28:00", cat:"Identity",  tier:"goddess", isNew:false, hasAudio:false },
];

const RECENT = TRACKS.slice(0,6).map(t=>t.title);

const INIT_THREADS = [
  { id:1, desire:"He texts me first",     days:14, done:true,  signs:3, track:"He Finds His Way Back", category:"SP & Love", notes:"" },
  { id:2, desire:"£5,000 arrives",        days:6,  done:false, signs:2, track:"Money Finds Me First",  category:"Money",     notes:"Got a random refund £180" },
  { id:3, desire:"10k per day business",  days:9,  done:false, signs:1, track:"Spoilt Goddess",        category:"Money",     notes:"" },
  { id:4, desire:"Skin visibly glowing",  days:3,  done:false, signs:1, track:"Gorgeous Is My Default",category:"Beauty",    notes:"" },
];

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
export default function SpotifyPortal({ onSignOut, isPreview=false }) {
  const [tab, setTab]         = useState("home");
  const [track, setTrack]     = useState(TRACKS[0]);
  const [playing, setPlay]    = useState(false);
  const [liked, setLiked]     = useState(new Set([1,3,7]));
  const [fullP, setFullP]     = useState(false);
  const [prog, setProg]       = useState(0);
  const [searchQ, setQ]       = useState("");
  const [libCat, setLibCat]   = useState("All");
  const [threads, setThreads] = useState(INIT_THREADS);
  const [theme, setTheme]     = useState("dark");
  const [profileOpen, setProfileOpen] = useState(false);
  const [listenCount, setListenCount] = useState(47);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

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

  const [isDesktop, setDesktop] = useState(typeof window!=="undefined" && window.innerWidth>768);
  useEffect(()=>{const h=()=>setDesktop(window.innerWidth>768); window.addEventListener("resize",h); return()=>window.removeEventListener("resize",h);},[]);

  // ── PROFILE PANEL ────────────────────────────────────────────────────────
  const manifestedCount = threads.filter(t=>t.done).length;
  const thisMonth = threads.filter(t=>t.done).length; // simplified

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
            { icon:<Ico.Cog c={C.mu}/>, label:"Listening reminders", action:()=>alert("Push notifications — requires PWA/native app") },
            { icon:<Ico.Cog c={C.mu}/>, label:"Manage subscription", action:()=>window.open("https://billing.stripe.com","_blank") },
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
      {tab==="home"    && <HomeTab greet={greet} track={track} play={play} liked={liked} toggleLike={toggleLike} playing={playing} isPreview={isPreview} C={C} threads={threads} listenCount={listenCount} setTab={setTab}/>}
      {tab==="search"  && <SearchTab tracks={TRACKS} searchQ={searchQ} setQ={setQ} play={play} track={track} liked={liked} toggleLike={toggleLike} isPreview={isPreview} C={C}/>}
      {tab==="library" && <LibraryTab tracks={TRACKS} cat={libCat} setCat={setLibCat} play={play} track={track} liked={liked} toggleLike={toggleLike} playing={playing} isPreview={isPreview} C={C}/>}
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
      {isPreview && <PreviewBanner onSignOut={onSignOut} C={C}/>}
      <div style={{ flex:1,display:"flex",overflow:"hidden" }}>
        {/* Sidebar */}
        <div style={{ width:220,background:C.bg,display:"flex",flexDirection:"column",padding:"20px 0 8px",flexShrink:0,borderRight:`1px solid ${C.border}` }}>
          <div style={{ padding:"0 20px 20px",fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:18,fontWeight:500,background:"linear-gradient(90deg,#d4a090,#B76E79)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>
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
      {isPreview && <PreviewBanner onSignOut={onSignOut} C={C}/>}
      {/* Status bar with avatar */}
      <div style={{ height:52,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px",flexShrink:0,borderBottom:`0.5px solid ${C.border}` }}>
        <span style={{ fontSize:13,fontWeight:700,color:C.cr }}>9:41</span>
        <span style={{ fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:15,fontWeight:500,background:"linear-gradient(90deg,#d4a090,#B76E79)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>SHG</span>
        <button onClick={()=>setProfileOpen(true)} style={{ width:34,height:34,borderRadius:"50%",background:OMBRE,backgroundSize:"200%",backgroundPosition:"left",border:"none",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"#000",cursor:"pointer",WebkitTapHighlightColor:"transparent" }}>R</button>
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
  const d = IMGS[track.title] || { g:"#483060,#604880" };
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
function HomeTab({ greet, track, play, liked, toggleLike, playing, isPreview, C, threads, listenCount, setTab }) {
  const manifested = threads.filter(t=>t.done).length;
  const inProgress = threads.filter(t=>!t.done).length;
  return (
    <div>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 16px 12px" }}>
        <span style={{ fontSize:20,fontWeight:700,color:C.cr }}>{greet}</span>
      </div>

      {/* WIN SUMMARY DASHBOARD */}
      {!isPreview && (
        <div style={{ margin:"0 16px 20px",background:C.bg3,borderRadius:14,padding:"14px 16px",border:`0.5px solid ${C.border}` }}>
          <div style={{ fontSize:11,fontWeight:700,color:R,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10 }}>Your wins this month ✦</div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8 }}>
            {[[manifested,"Manifested",R],[inProgress,"In progress",P],[listenCount,"Times listened",C.cr]].map(([v,l,c],i)=>(
              <div key={i} style={{ textAlign:"center" }}>
                <div style={{ fontSize:24,fontWeight:800,color:c,lineHeight:1 }}>{v}</div>
                <div style={{ fontSize:10,color:C.mu,marginTop:2,lineHeight:1.3 }}>{l}</div>
              </div>
            ))}
          </div>
          {manifested > 0 && (
            <div style={{ marginTop:10,padding:"8px 10px",background:"rgba(90,176,106,0.1)",border:"0.5px solid #2a4a2a",borderRadius:8 }}>
              <span style={{ fontSize:12,color:"#5ab06a",fontWeight:600 }}>✓ {manifested} desire{manifested!==1?"s":""} manifested</span>
              <span onClick={()=>setTab("proof")} style={{ fontSize:11,color:R,marginLeft:8,cursor:"pointer",textDecoration:"underline" }}>View proof →</span>
            </div>
          )}
        </div>
      )}

      {/* 2×3 RECENTLY PLAYED */}
      <div style={{ padding:"0 16px 20px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
        {TRACKS.slice(0,6).map((t,i)=>(
          <button key={i} onClick={()=>play(t)}
            style={{ background:C.bg3,borderRadius:8,display:"flex",alignItems:"center",overflow:"hidden",height:52,cursor:isPreview?"not-allowed":"pointer",border:"none",textAlign:"left",width:"100%",position:"relative" }}>
            <Thumb title={t.title} size={52} radius={0}/>
            {isPreview&&<div style={{ position:"absolute",left:0,top:0,width:52,height:52,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center" }}><Ico.Lock/></div>}
            <span style={{ fontSize:12,fontWeight:700,padding:"0 10px",lineHeight:1.3,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",color:C.cr }}>{t.title}</span>
          </button>
        ))}
      </div>

      {/* NEW THIS WEEK */}
      <Sec title="New this week ✦" C={C}>
        <HRow>
          {TRACKS.filter(t=>t.isNew).map(t=><TCard key={t.id} track={t} current={track} play={play} playing={playing} isPreview={isPreview} C={C}/>)}
        </HRow>
      </Sec>

      {/* JUMP BACK IN */}
      <Sec title="Jump back in" C={C}>
        <HRow>
          {TRACKS.slice(0,5).map(t=><TCard key={t.id} track={t} current={track} play={play} playing={playing} isPreview={isPreview} C={C}/>)}
        </HRow>
      </Sec>

      {/* LISTENING GUIDE */}
      <Sec title="Listening guide" C={C}>
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
            <div key={i} style={{ height:64,borderRadius:10,overflow:"hidden",position:"relative",cursor:"pointer",background:`linear-gradient(135deg,${c1},${c2})` }}>
              <span style={{ position:"absolute",bottom:10,left:12,fontSize:13,fontWeight:800,color:"#000" }}>{l}</span>
            </div>
          ))}
        </div>
      </Sec>
    </div>
  );
}

// ── SEARCH TAB ────────────────────────────────────────────────────────────────
function SearchTab({ tracks, searchQ, setQ, play, track:cur, liked, toggleLike, isPreview, C }) {
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
      {res.map(t=>(
        <div key={t.id} onClick={()=>play(t)} style={{ display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:`0.5px solid ${C.border}`,cursor:isPreview?"not-allowed":"pointer" }}>
          <div style={{ position:"relative",flexShrink:0 }}>
            <Thumb title={t.title} size={48} radius={6}/>
            {isPreview&&<div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center" }}><Ico.Lock/></div>}
          </div>
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ fontSize:13,fontWeight:600,color:cur?.id===t.id?R:C.cr,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2 }}>{t.title}</div>
            <div style={{ fontSize:11,color:C.mu }}>{t.artist} · {t.cat} · {t.dur}</div>
          </div>
          {t.isNew&&<span style={{ fontSize:9,padding:"2px 7px",background:`${R}22`,color:R,borderRadius:20,fontWeight:700,flexShrink:0 }}>NEW</span>}
        </div>
      ))}
    </div>
  );
}

// ── LIBRARY TAB ───────────────────────────────────────────────────────────────
function LibraryTab({ tracks, cat, setCat, play, track:cur, liked, toggleLike, playing, isPreview, C }) {
  const cats = ["All","Liked","SP & Love","Money","Beauty","Sleep","DNA","Identity"];
  const shown = cat==="Liked" ? tracks.filter(t=>liked.has(t.id)) : (cat==="All" ? tracks : tracks.filter(t=>t.cat===cat));
  return (
    <div>
      <div style={{ padding:"16px 16px 10px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <span style={{ fontSize:20,fontWeight:700,color:C.cr }}>Your Library</span>
      </div>
      <div style={{ display:"flex",gap:8,padding:"0 16px 14px",overflowX:"auto",WebkitOverflowScrolling:"touch" }}>
        {cats.map(c=>(
          <button key={c} onClick={()=>setCat(c)} style={{ flexShrink:0,padding:"6px 14px",borderRadius:20,background:cat===c?C.cr:C.bg3,border:"none",color:cat===c?"#000":C.cr,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>{c}</button>
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
              <div style={{ fontSize:11,color:C.mu }}>{t.tier==="goddess"&&<span style={{ color:R }}>✦ </span>}{t.artist} · {t.cat} · {t.dur}</div>
            </div>
            {!isPreview&&(
              <button onClick={e=>{e.stopPropagation();toggleLike(t.id,e);}} style={{ background:"none",border:"none",padding:8,lineHeight:0 }}>
                <Ico.Heart on={liked.has(t.id)}/>
              </button>
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
  const [adding, setAdding] = useState(false);
  const [editing, setEditing]= useState(null); // id of thread being edited
  const [editNote, setEditNote]=useState("");

  if (isPreview) return (
    <div style={{ padding:"40px 20px",textAlign:"center" }}>
      <div style={{ fontSize:36,marginBottom:16 }}>✦</div>
      <div style={{ fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:26,color:C.cr,marginBottom:10 }}>ProofOS</div>
      <div style={{ fontSize:14,color:C.mu,lineHeight:1.8,marginBottom:24,maxWidth:300,margin:"0 auto 24px" }}>
        Log desires. Link audios. Watch proof build. Included in Goddess Tier.
      </div>
      <button style={{ padding:"12px 24px",background:OMBRE,backgroundSize:"200%",backgroundPosition:"left",border:"none",borderRadius:12,color:"#000",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>
        Upgrade to Goddess — £33/mo
      </button>
    </div>
  );

  const manifested = threads.filter(t=>t.done).length;

  const markDone = (id) => setThreads(threads.map(t=>t.id===id?{...t,done:true,manifestedAt:new Date().toLocaleDateString()}:t));
  const undoMarkDone = (id) => setThreads(threads.map(t=>t.id===id?{...t,done:false,manifestedAt:null}:t));
  const deleteThread = (id) => { if(window.confirm("Delete this thread?")) setThreads(threads.filter(t=>t.id!==id)); };
  const saveEdit = (id) => { setThreads(threads.map(t=>t.id===id?{...t,notes:editNote}:t)); setEditing(null); };

  return (
    <div style={{ padding:"16px 16px 0" }}>
      <div style={{ fontSize:20,fontWeight:700,marginBottom:4,color:C.cr }}>ProofOS <span style={{ color:R }}>✦</span></div>
      <div style={{ fontSize:13,color:C.mu,marginBottom:16 }}>Your manifestation ledger</div>
      {/* Stats */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16 }}>
        {[[threads.length,"Desires",C.cr],[manifested,"Manifested",R],["14d","Streak",P]].map(([v,l,c],i)=>(
          <div key={i} style={{ background:C.bg3,borderRadius:10,padding:"12px 6px",textAlign:"center" }}>
            <div style={{ fontSize:22,fontWeight:800,color:c }}>{v}</div>
            <div style={{ fontSize:10,color:C.mu,fontWeight:600 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* ADD NEW THREAD */}
      <button onClick={()=>setAdding(a=>!a)} style={{ width:"100%",padding:12,background:C.bg3,border:`1px solid ${R}55`,borderRadius:10,color:C.cr,fontSize:13,fontWeight:600,marginBottom:12,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>
        {adding?"✕ Cancel":"+ New Proof Thread"}
      </button>
      {adding && (
        <div style={{ background:C.bg3,borderRadius:12,padding:14,marginBottom:14,border:`0.5px solid ${C.border}` }}>
          <div style={{ fontSize:11,color:C.mu,fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:8 }}>State your desire</div>
          <input value={newD} onChange={e=>setD(e.target.value)} placeholder="I receive… I am… I have…"
            style={{ width:"100%",background:C.inputBg,border:"none",color:C.inputCr,borderRadius:8,padding:"10px 12px",fontSize:13,marginBottom:10,outline:"none",fontFamily:"'Jost',sans-serif",boxSizing:"border-box" }}/>
          {/* Link to audio */}
          <div style={{ fontSize:11,color:C.mu,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6 }}>Link to audio</div>
          <select value={linkedTrack} onChange={e=>setLinked(e.target.value)}
            style={{ width:"100%",background:C.inputBg,border:`0.5px solid ${C.border}`,color:C.inputCr,borderRadius:8,padding:"10px 12px",fontSize:13,marginBottom:10,fontFamily:"'Jost',sans-serif",outline:"none",boxSizing:"border-box" }}>
            <option value="">— Select a track —</option>
            {TRACKS.map(t=><option key={t.id} value={t.title}>{t.title} · {t.cat}</option>)}
          </select>
          {/* Category */}
          <div style={{ fontSize:11,color:C.mu,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6 }}>Category</div>
          <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:12 }}>
            {["SP & Love","Money","Beauty","Identity","DNA","Sleep"].map(c=>(
              <button key={c} onClick={()=>setCat(c)} style={{ padding:"5px 12px",borderRadius:20,background:newCat===c?R:"none",border:`0.5px solid ${newCat===c?R:C.border}`,color:newCat===c?"#000":C.mu,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>{c}</button>
            ))}
          </div>
          <button onClick={()=>{
            if(!newD.trim()) return;
            setThreads([{id:Date.now(),desire:newD,days:0,done:false,signs:0,track:linkedTrack,category:newCat,notes:""},...threads]);
            setD(""); setLinked(""); setAdding(false);
          }} style={{ padding:"10px 20px",background:OMBRE,backgroundSize:"200%",backgroundPosition:"left",border:"none",borderRadius:10,color:"#000",fontSize:13,fontWeight:800,cursor:"pointer" }}>
            Add Proof Thread
          </button>
        </div>
      )}

      {/* THREAD LIST */}
      {threads.map(d=>(
        <div key={d.id} style={{ background:C.bg2,border:`0.5px solid ${d.done?"#2a4a2a55":C.border}`,borderRadius:12,padding:"12px 14px",marginBottom:10,position:"relative" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10 }}>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ fontSize:14,fontWeight:600,marginBottom:3,color:C.cr }}>{d.desire}</div>
              {d.category && <span style={{ fontSize:10,padding:"2px 8px",background:C.bg3,color:R,borderRadius:20,fontWeight:700,marginRight:6 }}>{d.category}</span>}
              {d.track && <div style={{ fontSize:11,color:C.mu,marginTop:4 }}>🎵 {d.track}</div>}
              {d.days>0 && <div style={{ fontSize:11,color:C.dim,marginTop:2 }}>{d.days} days · {d.signs} sign{d.signs!==1?"s":""} logged</div>}
              {d.notes && <div style={{ fontSize:12,color:C.mu,marginTop:4,fontStyle:"italic" }}>"{d.notes}"</div>}
            </div>
            <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6,flexShrink:0 }}>
              {d.done
                ? <>
                    <span style={{ fontSize:10,padding:"3px 10px",background:"#1a3a1a",color:"#5ab06a",borderRadius:20,fontWeight:700 }}>✓ manifested</span>
                    <button onClick={()=>undoMarkDone(d.id)} style={{ display:"flex",alignItems:"center",gap:4,fontSize:10,padding:"2px 8px",background:"none",border:`0.5px solid ${C.border}`,borderRadius:20,color:C.mu,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>
                      <Ico.Undo c={C.mu}/> Undo
                    </button>
                  </>
                : <button onClick={()=>markDone(d.id)} style={{ fontSize:10,padding:"3px 10px",background:"none",border:`1px solid ${R}55`,borderRadius:20,color:R,fontWeight:700,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>mark ✓</button>
              }
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ marginTop:10,height:2,background:C.border,borderRadius:1 }}>
            <div style={{ width:`${Math.min(d.days*5,100)}%`,height:"100%",background:OMBRE,borderRadius:1,backgroundSize:"200%",backgroundPosition:"left" }}/>
          </div>
          {/* Edit / Delete */}
          <div style={{ display:"flex",gap:8,marginTop:8 }}>
            <button onClick={()=>{setEditing(d.id);setEditNote(d.notes||"");}} style={{ fontSize:11,color:C.mu,background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:4,padding:0,fontFamily:"'Jost',sans-serif" }}>
              <Ico.Edit c={C.dim}/> Add note
            </button>
            <button onClick={()=>deleteThread(d.id)} style={{ fontSize:11,color:"#a04040",background:"none",border:"none",cursor:"pointer",padding:0,fontFamily:"'Jost',sans-serif",marginLeft:"auto" }}>
              Remove
            </button>
          </div>
          {editing===d.id && (
            <div style={{ marginTop:8,display:"flex",gap:8 }}>
              <input value={editNote} onChange={e=>setEditNote(e.target.value)} placeholder="Log a sign, synchronicity…"
                style={{ flex:1,background:C.inputBg,border:"none",color:C.inputCr,borderRadius:8,padding:"8px 10px",fontSize:12,outline:"none",fontFamily:"'Jost',sans-serif" }}
                onKeyDown={e=>e.key==="Enter"&&saveEdit(d.id)}/>
              <button onClick={()=>saveEdit(d.id)} style={{ padding:"8px 12px",background:OMBRE,backgroundSize:"200%",backgroundPosition:"left",border:"none",borderRadius:8,color:"#000",fontSize:11,fontWeight:700,cursor:"pointer" }}>Save</button>
            </div>
          )}
        </div>
      ))}
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
          <div key={i} onClick={()=>window.open(p.link,"_blank")}
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
                <span style={{ padding:"4px 10px",background:OMBRE,backgroundSize:"200%",backgroundPosition:"left",borderRadius:8,color:"#000",fontSize:10,fontWeight:800,fontFamily:"'Jost',sans-serif" }}>Buy on Beacons →</span>
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
function Sec({ title, children, C }) {
  return (
    <div style={{ marginBottom:24 }}>
      <div style={{ padding:"0 16px 10px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <span style={{ fontSize:16,fontWeight:700,color:C.cr }}>{title}</span>
        <span style={{ fontSize:11,fontWeight:600,color:C.mu }}>Show all</span>
      </div>
      {children}
    </div>
  );
}
function HRow({ children }) {
  return <div style={{ display:"flex",gap:12,padding:"0 16px",overflowX:"auto",WebkitOverflowScrolling:"touch",scrollbarWidth:"none" }}>{children}</div>;
}
function TCard({ track:t, current, play, playing, isPreview, C }) {
  const isP = current?.id===t.id;
  return (
    <div onClick={()=>play(t)} style={{ flexShrink:0,width:140,cursor:isPreview?"not-allowed":"pointer" }}>
      <div style={{ position:"relative",marginBottom:8 }}>
        <Thumb title={t.title} size={140} radius={8}/>
        {isPreview?(
          <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.55)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center" }}><Ico.Lock/></div>
        ):(isP&&playing&&(
          <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center" }}>
            <div style={{ display:"flex",alignItems:"flex-end",gap:2 }}>{[10,18,12,18,10].map((h,i)=><div key={i} style={{ width:3,height:h,background:R,borderRadius:1 }}/>)}</div>
          </div>
        ))}
        {t.isNew&&<div style={{ position:"absolute",top:6,right:6,padding:"2px 7px",background:R,color:"#000",borderRadius:20,fontSize:9,fontWeight:800 }}>NEW</div>}
      </div>
      <div style={{ fontSize:13,fontWeight:600,color:(!isPreview&&isP)?R:C.cr,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2 }}>{t.title}</div>
      <div style={{ fontSize:11,color:C.mu }}>{t.cat} · {t.dur}</div>
    </div>
  );
}
