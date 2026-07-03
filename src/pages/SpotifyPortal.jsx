import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   SHG PORTAL — Spotify-style layout
   Props:
     isPreview={true}  → all tracks locked, show upgrade prompt
     onSignOut         → sign out handler
   Theme toggle lives inside the portal header
   ═══════════════════════════════════════════════════════════════════════ */

const THEMES = {
  dark:  { bg:"#0f0f0f", bg2:"#181818", bg3:"#282828", bg4:"#2a2a2a", nav:"#0a0a0a", cr:"#ffffff", mu:"#b3b3b3", dim:"#727272", border:"#333", inputBg:"#333", inputCr:"#fff" },
  light: { bg:"#fdf0e8", bg2:"#ffffff", bg3:"rgba(0,0,0,0.07)", bg4:"rgba(0,0,0,0.1)", nav:"rgba(255,255,255,0.97)", cr:"#111111", mu:"#6a5048", dim:"#a08878", border:"rgba(0,0,0,0.1)", inputBg:"rgba(0,0,0,0.07)", inputCr:"#111" },
};

const R="#B76E79", P="#d4a090";
const OMBRE="linear-gradient(135deg,#f5e0a0 0%,#e8b870 22%,#d4a090 48%,#c4789a 72%,#B76E79 100%)";

// Unsplash stock images for each track
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
    <div style={{ width:size, height:size, borderRadius:radius, flexShrink:0, overflow:"hidden",
      background:`linear-gradient(135deg,${d.g})`, position:"relative" }}>
      {d.url && <img src={d.url} alt={title} style={{ position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover" }} onError={e=>e.target.style.display="none"}/>}
    </div>
  );
}

const TRACKS = [
  { id:1, title:"Spoilt Goddess",           artist:"Reshma Oracle", dur:"4:32",  cat:"Identity",  tier:"audio",   isNew:true  },
  { id:2, title:"He Finds His Way Back",    artist:"Reshma Oracle", dur:"30:00", cat:"SP & Love", tier:"audio"               },
  { id:3, title:"Money Finds Me First",     artist:"Reshma Oracle", dur:"25:00", cat:"Money",     tier:"audio",   isNew:true  },
  { id:4, title:"While I Sleep I Manifest", artist:"Reshma Oracle", dur:"60:00", cat:"Sleep",     tier:"audio"               },
  { id:5, title:"Gorgeous Is My Default",   artist:"Reshma Oracle", dur:"35:00", cat:"Beauty",    tier:"audio"               },
  { id:6, title:"DNA Activation Ceremony",  artist:"Reshma Oracle", dur:"45:00", cat:"DNA",       tier:"goddess"             },
  { id:7, title:"Lucky Girl Summer",        artist:"Reshma Oracle", dur:"22:00", cat:"Identity",  tier:"audio",   isNew:true  },
  { id:8, title:"10 Years Into One Hour",   artist:"Reshma Oracle", dur:"58:00", cat:"Identity",  tier:"audio"               },
  { id:9, title:"Highest Timeline",         artist:"Reshma Oracle", dur:"28:00", cat:"Identity",  tier:"goddess"             },
];

const RECENT = ["Spoilt Goddess","He Finds His Way Back","Money Finds Me First","While I Sleep I Manifest","Gorgeous Is My Default","Lucky Girl Summer"];

const THREADS = [
  { id:1, desire:"He texts me first",    days:14, done:true,  signs:3, track:"He Finds His Way Back" },
  { id:2, desire:"£5,000 arrives",       days:6,  done:false, signs:2, track:"Money Finds Me First"  },
  { id:3, desire:"Skin visibly glowing", days:3,  done:false, signs:1, track:"Gorgeous Is My Default" },
];

// SVG icons
const Ico = {
  Home:   ({a,c})=><svg width="22" height="22" viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" fill={a?c||"#fff":"none"} stroke={a?c||"#fff":"#727272"} strokeWidth="1.8"/></svg>,
  Search: ({c})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c||"#727272"} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Lib:    ({a,c})=><svg width="22" height="22" viewBox="0 0 24 24" fill={a?c||"#fff":"#727272"}><path d="M3 3h4v18H3zM9 3h2v18H9zM14 3l7 2.5v13L14 21z"/></svg>,
  Shop:   ({a,c})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?c||"#fff":"#727272"} strokeWidth="1.8" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
  Proof:  ({a,c})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?R:"#727272"} strokeWidth="1.8" strokeLinecap="round"><path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h9"/></svg>,
  Play:   ({dark})=><svg width="18" height="18" viewBox="0 0 24 24" fill={dark?"#000":"#fff"}><polygon points="6 3 20 12 6 21"/></svg>,
  Pause:  ({dark})=><svg width="18" height="18" viewBox="0 0 24 24" fill={dark?"#000":"#fff"}><rect x="6" y="4" width="4" height="16" rx="1.5"/><rect x="14" y="4" width="4" height="16" rx="1.5"/></svg>,
  Heart:  ({on})=><svg width="18" height="18" viewBox="0 0 24 24" fill={on?R:"none"} stroke={on?R:"#727272"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l7.84-7.84 1.06-1.06a5.5 5.5 0 000-7.72z"/></svg>,
  Lock:   ()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B76E79" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  Sun:    ()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Moon:   ()=><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
};

export default function SpotifyPortal({ onSignOut, isPreview=false }) {
  const [tab, setTab]     = useState("home");
  const [track, setTrack] = useState(TRACKS[0]);
  const [playing, setPlay]= useState(true);
  const [liked, setLiked] = useState(new Set([1,3]));
  const [fullP, setFullP] = useState(false);
  const [prog, setProg]   = useState(34);
  const [searchQ, setQ]   = useState("");
  const [libCat, setLibCat]=useState("All");
  const [threads, setThreads]=useState(THREADS);
  const [portalTheme, setPortalTheme]=useState("dark");

  const C = THEMES[portalTheme] || THEMES.dark;

  const hour=new Date().getHours();
  const greet=hour<12?"Good morning":hour<17?"Good afternoon":"Good evening";

  const play = (t) => {
    if(isPreview) return; // locked in preview
    setTrack(t); setPlay(true); setFullP(false);
  };
  const toggleLike=(id,e)=>{e?.stopPropagation();setLiked(s=>{const n=new Set(s);n.has(id)?n.delete(id):n.add(id);return n;});};
  const nextTrack=()=>{const i=TRACKS.findIndex(t=>t.id===track.id);setTrack(TRACKS[(i+1)%TRACKS.length]);};
  const prevTrack=()=>{const i=TRACKS.findIndex(t=>t.id===track.id);setTrack(TRACKS[(i-1+TRACKS.length)%TRACKS.length]);};

  const [isDesktop,setDesktop]=useState(typeof window!=="undefined"&&window.innerWidth>768);
  useEffect(()=>{const h=()=>setDesktop(window.innerWidth>768);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h);},[]);

  // Theme toggle button (rendered in sidebar / header)
  const ThemeToggle=()=>(
    <button onClick={()=>setPortalTheme(t=>t==="dark"?"light":"dark")}
      style={{ display:"flex",alignItems:"center",gap:6,padding:"6px 12px",background:C.bg3,border:`0.5px solid ${C.border}`,borderRadius:20,color:C.mu,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'Jost',sans-serif",WebkitTapHighlightColor:"transparent" }}>
      <span style={{ color:C.cr }}>{portalTheme==="dark"?<Ico.Sun/>:<Ico.Moon/>}</span>
      {portalTheme==="dark"?"Light mode":"Dark mode"}
    </button>
  );

  // Preview locked banner
  const PreviewBanner=()=>(
    <div style={{ background:OMBRE,backgroundSize:"200%",backgroundPosition:"left",padding:"10px 16px",textAlign:"center",flexShrink:0 }}>
      <span style={{ fontSize:12,fontWeight:700,color:"#000",fontFamily:"'Jost',sans-serif" }}>
        🔒 Preview mode — <a href="#pricing" onClick={onSignOut} style={{ color:"#000",textDecoration:"underline",cursor:"pointer" }}>Join to unlock all tracks</a>
      </span>
    </div>
  );

  const tabs=[
    {id:"home",    label:"Home",    I:Ico.Home  },
    {id:"library", label:"Library", I:Ico.Lib   },
    {id:"shop",    label:"Shop",    I:Ico.Shop  },
    {id:"proof",   label:"ProofOS", I:Ico.Proof },
  ];

  const tabContent=(
    <>
      {tab==="home"    && <HomeTab greet={greet} track={track} play={play} liked={liked} toggleLike={toggleLike} playing={playing} isPreview={isPreview} C={C}/>}
      {tab==="library" && <LibraryTab tracks={TRACKS} cat={libCat} setCat={setLibCat} play={play} track={track} liked={liked} toggleLike={toggleLike} playing={playing} isPreview={isPreview} C={C} searchQ={searchQ} setQ={setQ}/>}
      {tab==="shop"    && <ShopTab C={C}/>}
      {tab==="proof"   && <ProofTab threads={threads} setThreads={setThreads} isPreview={isPreview} C={C}/>}
    </>
  );

  // ── DESKTOP ─────────────────────────────────────────────────────────────────
  if(isDesktop) return(
    <div style={{width:"100%",height:"100%",background:C.bg,display:"flex",flexDirection:"column",fontFamily:"'Jost',sans-serif",color:C.cr,overflow:"hidden"}}>
      {isPreview && <PreviewBanner/>}
      <div style={{flex:1,display:"flex",overflow:"hidden"}}>
        {/* Sidebar */}
        <div style={{width:220,background:C.bg,display:"flex",flexDirection:"column",padding:"24px 0 8px",flexShrink:0,borderRight:`1px solid ${C.border}`}}>
          <div style={{padding:"0 20px 24px",fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:18,fontWeight:500,background:"linear-gradient(90deg,#d4a090,#B76E79)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
            Self Hypnosis Goddess
          </div>
          {tabs.map(n=>(
            <button key={n.id} onClick={()=>setTab(n.id)}
              style={{display:"flex",alignItems:"center",gap:14,padding:"8px 20px",background:tab===n.id?C.bg3:"none",border:"none",color:tab===n.id?C.cr:n.id==="proof"?R:C.mu,fontSize:13,fontWeight:600,cursor:"pointer",textAlign:"left",width:"100%",fontFamily:"'Jost',sans-serif",transition:"color 0.15s"}}
              onMouseEnter={e=>e.currentTarget.style.color=n.id==="proof"?R:C.cr}
              onMouseLeave={e=>{if(tab!==n.id)e.currentTarget.style.color=n.id==="proof"?R:C.mu;}}>
              <n.I a={tab===n.id} c={C.cr}/> {n.label}
            </button>
          ))}
          <div style={{height:1,background:C.border,margin:"16px"}}/>
          <div style={{padding:"0 20px 6px",fontSize:11,fontWeight:700,color:C.dim,letterSpacing:"0.12em",textTransform:"uppercase"}}>Recently played</div>
          {TRACKS.slice(0,5).map(t=>(
            <button key={t.id} onClick={()=>play(t)}
              style={{display:"flex",alignItems:"center",gap:10,padding:"5px 20px",background:"none",border:"none",color:track.id===t.id?C.cr:C.mu,fontSize:12,cursor:isPreview?"not-allowed":"pointer",width:"100%",textAlign:"left",fontFamily:"'Jost',sans-serif"}}
              onMouseEnter={e=>e.currentTarget.style.color=C.cr}
              onMouseLeave={e=>{if(track.id!==t.id)e.currentTarget.style.color=C.mu;}}>
              <div style={{position:"relative"}}>
                <Thumb title={t.title} size={28} radius={2}/>
                {isPreview&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center"}}><Ico.Lock/></div>}
              </div>
              <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontSize:12}}>{t.title}</span>
            </button>
          ))}
          <div style={{flex:1}}/>
          {/* Theme toggle in sidebar */}
          <div style={{padding:"8px 16px"}}><ThemeToggle/></div>
          <button onClick={onSignOut} style={{margin:"4px 16px 4px",padding:"8px 0",background:"none",border:`0.5px solid ${C.border}`,borderRadius:6,color:C.dim,fontSize:11,cursor:"pointer"}}>
            {isPreview?"← Back to site":"Sign out"}
          </button>
        </div>
        {/* Main */}
        <div style={{flex:1,overflowY:"auto",background:C.bg2,paddingBottom:20}}>{tabContent}</div>
      </div>
      {/* Player bar */}
      {!isPreview && <DesktopPlayer track={track} playing={playing} setPlay={setPlay} liked={liked} toggleLike={toggleLike} prog={prog} setProg={setProg} prevTrack={prevTrack} nextTrack={nextTrack} C={C}/>}
    </div>
  );

  // ── MOBILE ────────────────────────────────────────────────────────────────
  return(
    <div style={{width:"100%",height:"100%",background:C.bg,display:"flex",flexDirection:"column",fontFamily:"'Jost',sans-serif",color:C.cr,overflow:"hidden",position:"relative"}}>
      {isPreview && <PreviewBanner/>}
      {/* Mobile header with theme toggle */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"44px 16px 8px",flexShrink:0}}>
        <span style={{fontSize:13,fontWeight:700,color:C.cr}}>9:41</span>
        <ThemeToggle/>
        <span style={{fontSize:11,color:C.cr}}>●● 100%</span>
      </div>
      <div style={{flex:1,overflowY:"auto",paddingBottom:isPreview?80:130,WebkitOverflowScrolling:"touch"}}>{tabContent}</div>
      {/* Mini player */}
      {!isPreview && !fullP && (
        <div onClick={()=>setFullP(true)} style={{position:"absolute",bottom:68,left:8,right:8,zIndex:50,background:C.bg4,borderRadius:8,display:"flex",alignItems:"center",gap:10,padding:"8px 10px",cursor:"pointer",boxShadow:`0 -4px 24px rgba(0,0,0,0.4)`}}>
          <Thumb title={track.title} size={42} radius={4}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:C.cr}}>{track.title}</div>
            <div style={{fontSize:11,color:C.mu}}>{track.artist}</div>
          </div>
          <button onClick={e=>{e.stopPropagation();toggleLike(track.id,e);}} style={{background:"none",border:"none",padding:6,lineHeight:0}}><Ico.Heart on={liked.has(track.id)}/></button>
          <button onClick={e=>{e.stopPropagation();setPlay(p=>!p);}} style={{width:34,height:34,borderRadius:"50%",background:C.cr,border:"none",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:0}}>
            {playing?<Ico.Pause dark={portalTheme==="light"}/>:<Ico.Play dark={portalTheme==="light"}/>}
          </button>
          <div style={{position:"absolute",bottom:0,left:0,right:0,height:2,background:"#444",borderRadius:"0 0 8px 8px"}}>
            <div style={{width:`${prog}%`,height:"100%",background:OMBRE,borderRadius:"0 0 0 8px",backgroundSize:"200%",backgroundPosition:"left"}}/>
          </div>
        </div>
      )}
      {!isPreview && fullP && <MobilePlayer track={track} playing={playing} setPlay={setPlay} liked={liked} toggleLike={toggleLike} prog={prog} setProg={setProg} prevTrack={prevTrack} nextTrack={nextTrack} onClose={()=>setFullP(false)} C={C}/>}
      {/* Bottom 4-tab nav */}
      {!fullP && (
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:isPreview?60:68,background:C.nav,borderTop:`0.5px solid ${C.border}`,display:"flex",zIndex:60}}>
          {tabs.map(n=>(
            <button key={n.id} onClick={()=>setTab(n.id)} style={{flex:1,background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,paddingBottom:6,cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
              <n.I a={tab===n.id} c={tab===n.id?(n.id==="proof"?R:C.cr):C.dim}/>
              <span style={{fontSize:10,fontWeight:tab===n.id?700:400,color:tab===n.id?(n.id==="proof"?R:C.cr):C.dim}}>{n.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── DESKTOP PLAYER ────────────────────────────────────────────────────────────
function DesktopPlayer({track,playing,setPlay,liked,toggleLike,prog,setProg,prevTrack,nextTrack,C}){
  return(
    <div style={{height:88,background:C.nav,borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",padding:"0 16px",gap:0,flexShrink:0}}>
      <div style={{width:220,display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
        <Thumb title={track.title} size={52} radius={4}/>
        <div style={{minWidth:0}}>
          <div style={{fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2,color:C.cr}}>{track.title}</div>
          <div style={{fontSize:11,color:C.mu}}>Reshma Oracle</div>
        </div>
        <button onClick={e=>toggleLike(track.id,e)} style={{background:"none",border:"none",lineHeight:0,padding:8}}><Ico.Heart on={liked.has(track.id)}/></button>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
        <div style={{display:"flex",alignItems:"center",gap:20}}>
          <span style={{fontSize:16,color:C.dim,cursor:"pointer"}}>⇄</span>
          <button onClick={prevTrack} style={{background:"none",border:"none",lineHeight:0,cursor:"pointer"}}><svg width="22" height="22" viewBox="0 0 24 24" fill={C.mu}><path d="M19 20L9 12l10-8v16z"/><rect x="5" y="4" width="2.5" height="16" rx="1" fill={C.mu}/></svg></button>
          <button onClick={()=>setPlay(p=>!p)} style={{width:36,height:36,borderRadius:"50%",background:OMBRE,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",backgroundSize:"200%",backgroundPosition:"left",boxShadow:"0 2px 12px rgba(212,160,144,0.5)"}}>
            {playing?<Ico.Pause dark/>:<Ico.Play dark/>}
          </button>
          <button onClick={nextTrack} style={{background:"none",border:"none",lineHeight:0,cursor:"pointer"}}><svg width="22" height="22" viewBox="0 0 24 24" fill={C.mu}><path d="M5 4l10 8-10 8V4z"/><rect x="16.5" y="4" width="2.5" height="16" rx="1" fill={C.mu}/></svg></button>
          <span style={{fontSize:16,color:R,cursor:"pointer"}}>↻</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,width:"100%",maxWidth:520}}>
          <span style={{fontSize:11,color:C.dim,width:32,textAlign:"right"}}>1:24</span>
          <div style={{flex:1,height:4,background:C.border,borderRadius:2,cursor:"pointer"}} onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setProg(Math.round(((e.clientX-r.left)/r.width)*100));}}>
            <div style={{width:`${prog}%`,height:"100%",background:OMBRE,borderRadius:2,backgroundSize:"200%",backgroundPosition:"left"}}/>
          </div>
          <span style={{fontSize:11,color:C.dim,width:32}}>{track.dur}</span>
        </div>
      </div>
      <div style={{width:160,display:"flex",alignItems:"center",gap:8,justifyContent:"flex-end",flexShrink:0}}>
        <span style={{fontSize:14,color:C.dim}}>🔊</span>
        <div style={{width:80,height:4,background:C.border,borderRadius:2}}><div style={{width:"70%",height:"100%",background:C.cr,borderRadius:2}}/></div>
      </div>
    </div>
  );
}

// ── MOBILE FULL PLAYER ────────────────────────────────────────────────────────
function MobilePlayer({track,playing,setPlay,liked,toggleLike,prog,setProg,prevTrack,nextTrack,onClose,C}){
  const d=IMGS[track.title]||{g:"#483060,#604880"};
  return(
    <div style={{position:"absolute",inset:0,background:`linear-gradient(180deg,${d.g.split(",")[0]}cc 0%,${C.bg} 40%)`,zIndex:200,display:"flex",flexDirection:"column",alignItems:"center",padding:"0 28px",overflowY:"auto"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",paddingTop:52,marginBottom:24}}>
        <button onClick={onClose} style={{background:"none",border:"none",lineHeight:0,cursor:"pointer"}}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.cr} strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg></button>
        <span style={{fontSize:12,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",color:C.cr}}>Now Playing</span>
        <div style={{width:22}}/>
      </div>
      <Thumb title={track.title} size={280} radius={14}/>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",marginTop:24,marginBottom:20}}>
        <div>
          <div style={{fontSize:22,fontWeight:800,marginBottom:4,color:C.cr}}>{track.title}</div>
          <div style={{fontSize:14,color:C.mu}}>{track.artist}</div>
        </div>
        <button onClick={e=>toggleLike(track.id,e)} style={{background:"none",border:"none",lineHeight:0}}><Ico.Heart on={liked.has(track.id)}/></button>
      </div>
      <div style={{width:"100%",marginBottom:8}}>
        <div style={{height:4,background:"#4a4a4a",borderRadius:2,cursor:"pointer"}} onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setProg(Math.round(((e.clientX-r.left)/r.width)*100));}}>
          <div style={{width:`${prog}%`,height:"100%",background:OMBRE,borderRadius:2,backgroundSize:"200%",backgroundPosition:"left",position:"relative"}}>
            <div style={{position:"absolute",right:-6,top:"50%",transform:"translateY(-50%)",width:13,height:13,borderRadius:"50%",background:C.cr}}/>
          </div>
        </div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",width:"100%",marginBottom:32}}>
        <span style={{fontSize:11,color:C.dim}}>1:24</span><span style={{fontSize:11,color:C.dim}}>{track.dur}</span>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%"}}>
        <span style={{fontSize:18,color:C.dim,cursor:"pointer"}}>⇄</span>
        <button onClick={prevTrack} style={{background:"none",border:"none",lineHeight:0,cursor:"pointer"}}><svg width="24" height="24" viewBox="0 0 24 24" fill={C.cr}><path d="M19 20L9 12l10-8v16z"/><rect x="5" y="4" width="2.5" height="16" rx="1" fill={C.cr}/></svg></button>
        <button onClick={()=>setPlay(p=>!p)} style={{width:64,height:64,borderRadius:"50%",background:OMBRE,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",backgroundSize:"200%",backgroundPosition:"left",boxShadow:"0 4px 28px rgba(212,160,144,0.5)"}}>
          {playing?<Ico.Pause dark/>:<Ico.Play dark/>}
        </button>
        <button onClick={nextTrack} style={{background:"none",border:"none",lineHeight:0,cursor:"pointer"}}><svg width="24" height="24" viewBox="0 0 24 24" fill={C.cr}><path d="M5 4l10 8-10 8V4z"/><rect x="16.5" y="4" width="2.5" height="16" rx="1" fill={C.cr}/></svg></button>
        <span style={{fontSize:18,color:R,cursor:"pointer"}}>↻</span>
      </div>
    </div>
  );
}

// ── HOME TAB ──────────────────────────────────────────────────────────────────
function HomeTab({greet,track,play,liked,toggleLike,playing,isPreview,C}){
  return(
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 16px 16px"}}>
        <span style={{fontSize:20,fontWeight:700,color:C.cr}}>{greet}</span>
        <div style={{width:32,height:32,borderRadius:"50%",background:OMBRE,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:"#000",backgroundSize:"200%",backgroundPosition:"left"}}>R</div>
      </div>
      {isPreview && (
        <div style={{margin:"0 16px 16px",padding:"12px 14px",background:"rgba(183,110,121,0.1)",border:"1px solid rgba(183,110,121,0.3)",borderRadius:10}}>
          <div style={{fontSize:13,fontWeight:700,color:R,marginBottom:4}}>Preview mode</div>
          <div style={{fontSize:12,color:C.mu}}>You're seeing the full dashboard experience. All tracks are locked until you join.</div>
        </div>
      )}
      {/* 2×3 recently played grid */}
      <div style={{padding:"0 16px 24px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {RECENT.map((title,i)=>(
          <button key={i} onClick={()=>play(TRACKS.find(t=>t.title===title)||TRACKS[i])}
            style={{background:C.bg3,borderRadius:6,display:"flex",alignItems:"center",overflow:"hidden",height:52,cursor:isPreview?"not-allowed":"pointer",border:"none",textAlign:"left",width:"100%",position:"relative"}}>
            <Thumb title={title} size={52} radius={0}/>
            {isPreview && <div style={{position:"absolute",left:0,top:0,width:52,height:52,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center"}}><Ico.Lock/></div>}
            <span style={{fontSize:12,fontWeight:700,padding:"0 10px",lineHeight:1.3,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",color:C.cr}}>{title}</span>
          </button>
        ))}
      </div>
      {/* New this week */}
      <Sec title="New this week" C={C}>
        <HRow>
          {TRACKS.filter(t=>t.isNew).map(t=><TCard key={t.id} track={t} current={track} play={play} playing={playing} isPreview={isPreview} C={C}/>)}
        </HRow>
      </Sec>
      {/* Jump back in */}
      <Sec title="Jump back in" C={C}>
        <HRow>
          {TRACKS.slice(0,5).map(t=><TCard key={t.id} track={t} current={track} play={play} playing={playing} isPreview={isPreview} C={C}/>)}
        </HRow>
      </Sec>
      {/* Categories */}
      <Sec title="Browse by desire" C={C}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,padding:"0 16px"}}>
          {[["SP & Love","#c87890","#8a3060"],["Money","#306040","#508060"],["Beauty","#b06840","#d4a060"],["Sleep","#304870","#4060a0"],["DNA","#604080","#9060b0"],["Identity","#802050","#c04080"]].map(([l,c1,c2],i)=>(
            <div key={i} style={{height:64,borderRadius:8,overflow:"hidden",position:"relative",cursor:"pointer",background:`linear-gradient(135deg,${c1},${c2})`}}>
              <span style={{position:"absolute",bottom:10,left:12,fontSize:13,fontWeight:700,color:"#fff"}}>{l}</span>
            </div>
          ))}
        </div>
      </Sec>
    </div>
  );
}

// ── LIBRARY TAB ───────────────────────────────────────────────────────────────
function LibraryTab({tracks,cat,setCat,play,track:cur,liked,toggleLike,playing,isPreview,C,searchQ,setQ}){
  const cats=["All","SP & Love","Money","Beauty","Sleep","DNA","Identity"];
  const shown=(cat==="All"?tracks:tracks.filter(t=>t.cat===cat)).filter(t=>!searchQ||t.title.toLowerCase().includes(searchQ.toLowerCase()));
  return(
    <div>
      <div style={{padding:"20px 16px 12px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontSize:20,fontWeight:700,color:C.cr}}>Your Library</span>
      </div>
      {/* Search */}
      <div style={{padding:"0 16px 12px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,background:C.inputBg,borderRadius:8,padding:"10px 14px"}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.dim} strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={searchQ} onChange={e=>setQ(e.target.value)} placeholder="Search tracks…"
            style={{border:"none",background:"transparent",flex:1,fontSize:14,color:C.inputCr,outline:"none",fontFamily:"'Jost',sans-serif"}}/>
        </div>
      </div>
      {/* Filter chips */}
      <div style={{display:"flex",gap:8,padding:"0 16px 16px",overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
        {cats.map(c=>(
          <button key={c} onClick={()=>setCat(c)} style={{flexShrink:0,padding:"6px 14px",borderRadius:20,background:cat===c?C.cr:C.bg3,border:"none",color:cat===c?"#000":C.cr,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'Jost',sans-serif"}}>{c}</button>
        ))}
      </div>
      {/* Track list */}
      <div style={{padding:"0 16px"}}>
        {shown.map(t=>(
          <div key={t.id} onClick={()=>play(t)} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:`0.5px solid ${C.border}`,cursor:isPreview?"not-allowed":"pointer"}}>
            <div style={{position:"relative",flexShrink:0}}>
              <Thumb title={t.title} size={50} radius={4}/>
              {isPreview ? (
                <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.55)",borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center"}}><Ico.Lock/></div>
              ) : (cur?.id===t.id&&playing&&(
                <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <div style={{display:"flex",alignItems:"flex-end",gap:2}}>{[8,14,10,14,8].map((h,i)=><div key={i} style={{width:2,height:h,background:R,borderRadius:1}}/>)}</div>
                </div>
              ))}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:14,fontWeight:600,color:(!isPreview&&cur?.id===t.id)?R:C.cr,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2}}>
                {t.title}{t.isNew&&<span style={{marginLeft:6,fontSize:9,background:`${R}22`,color:R,padding:"1px 5px",borderRadius:8,fontWeight:700,verticalAlign:"middle"}}>NEW</span>}
              </div>
              <div style={{fontSize:11,color:C.mu}}>{t.tier==="goddess"&&<span style={{color:R}}>✦ </span>}{t.artist} · {t.cat} · {t.dur}</div>
            </div>
            {!isPreview&&<button onClick={e=>{e.stopPropagation();toggleLike(t.id,e);}} style={{background:"none",border:"none",padding:8,lineHeight:0}}><Ico.Heart on={liked.has(t.id)}/></button>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SHOP TAB ──────────────────────────────────────────────────────────────────
function ShopTab({C}){
  const products=[
    { name:"SP Ritual Bundle",     price:"£29", desc:"3-day SP activation script + audio guide + intention journal pages", tag:"Digital download", img:"https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=300&h=300&fit=crop&auto=format" },
    { name:"Money Frequency Kit",  price:"£19", desc:"Abundance affirmation deck + 528hz playlist curation guide", tag:"Digital download", img:"https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=300&h=300&fit=crop&auto=format" },
    { name:"Identity Workbook",    price:"£24", desc:"30-day self-concept shift workbook with daily listening prompts", tag:"PDF workbook", img:"https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=300&h=300&fit=crop&auto=format" },
    { name:"Beauty Reset Protocol",price:"£22", desc:"14-day glow protocol — subliminal pairing + mirror work guide", tag:"Digital download", img:"https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=300&h=300&fit=crop&auto=format" },
  ];
  return(
    <div style={{padding:"20px 16px 40px"}}>
      <div style={{fontSize:20,fontWeight:700,color:C.cr,marginBottom:4}}>Shop</div>
      <div style={{fontSize:13,color:C.mu,marginBottom:20}}>Digital rituals & resources · Instant download</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {products.map((p,i)=>(
          <div key={i} style={{background:C.bg2,border:`0.5px solid ${C.border}`,borderRadius:12,overflow:"hidden",cursor:"pointer"}}
            onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
            onMouseLeave={e=>e.currentTarget.style.transform="none"}
            style={{background:C.bg2,border:`0.5px solid ${C.border}`,borderRadius:12,overflow:"hidden",cursor:"pointer",transition:"transform 0.2s"}}>
            {/* Product image */}
            <div style={{height:100,overflow:"hidden",position:"relative",background:`linear-gradient(135deg,#1a0a14,#2a1020)`}}>
              <img src={p.img} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover",opacity:0.7}} onError={e=>e.target.style.display="none"}/>
              <div style={{position:"absolute",top:8,left:8,padding:"2px 7px",background:"rgba(0,0,0,0.6)",borderRadius:20,fontSize:9,fontWeight:700,color:"#fff",letterSpacing:"0.08em"}}>{p.tag}</div>
            </div>
            <div style={{padding:"10px 12px"}}>
              <div style={{fontSize:12,fontWeight:700,color:C.cr,marginBottom:3,lineHeight:1.3}}>{p.name}</div>
              <div style={{fontSize:11,color:C.mu,marginBottom:8,lineHeight:1.4}}>{p.desc}</div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{fontSize:15,fontWeight:800,color:R}}>{p.price}</span>
                <button style={{padding:"5px 10px",background:OMBRE,backgroundSize:"200%",backgroundPosition:"left",border:"none",borderRadius:8,color:"#000",fontSize:10,fontWeight:800,cursor:"pointer",fontFamily:"'Jost',sans-serif"}}>Buy →</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{marginTop:16,padding:"12px 14px",background:C.bg3,border:`0.5px solid ${C.border}`,borderRadius:10,textAlign:"center"}}>
        <div style={{fontSize:12,color:C.mu}}>All purchases are one-time · Delivered instantly · No subscription required</div>
      </div>
    </div>
  );
}

// ── PROOFOS TAB ───────────────────────────────────────────────────────────────
function ProofTab({threads,setThreads,isPreview,C}){
  const [newD,setD]=useState("");
  const [adding,setAdding]=useState(false);
  if(isPreview) return(
    <div style={{padding:"40px 20px",textAlign:"center"}}>
      <div style={{fontSize:36,marginBottom:16}}>✦</div>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:26,color:C.cr,marginBottom:10}}>ProofOS</div>
      <div style={{fontSize:14,color:C.mu,lineHeight:1.8,marginBottom:24,maxWidth:300,margin:"0 auto 24px"}}>
        Track every desire. Log every sign. Watch the proof accumulate. Included in Goddess Tier.
      </div>
      <button style={{padding:"12px 24px",background:OMBRE,backgroundSize:"200%",backgroundPosition:"left",border:"none",borderRadius:12,color:"#000",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"'Jost',sans-serif"}}>
        Upgrade to Goddess — £33/mo
      </button>
    </div>
  );
  return(
    <div style={{padding:"20px 16px 0"}}>
      <div style={{fontSize:20,fontWeight:700,marginBottom:4,color:C.cr}}>ProofOS <span style={{color:R}}>✦</span></div>
      <div style={{fontSize:13,color:C.mu,marginBottom:20}}>Your manifestation ledger</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:20}}>
        {[[threads.length,"Desires",C.cr],[threads.filter(t=>t.done).length,"Manifested",R],["14d","Streak",P]].map(([v,l,c],i)=>(
          <div key={i} style={{background:C.bg3,borderRadius:10,padding:"12px 8px",textAlign:"center"}}>
            <div style={{fontSize:22,fontWeight:800,color:c}}>{v}</div>
            <div style={{fontSize:10,color:C.mu,fontWeight:600,letterSpacing:"0.08em"}}>{l}</div>
          </div>
        ))}
      </div>
      <button onClick={()=>setAdding(a=>!a)} style={{width:"100%",padding:12,background:C.bg3,border:`1px solid ${R}44`,borderRadius:10,color:C.cr,fontSize:13,fontWeight:600,marginBottom:12,cursor:"pointer",fontFamily:"'Jost',sans-serif"}}>+ New Proof Thread</button>
      {adding&&(
        <div style={{background:C.bg3,borderRadius:10,padding:14,marginBottom:14}}>
          <input value={newD} onChange={e=>setD(e.target.value)} placeholder="State your desire in present tense…"
            style={{width:"100%",background:C.inputBg,border:"none",color:C.inputCr,borderRadius:8,padding:"10px 12px",fontSize:13,marginBottom:10,outline:"none",fontFamily:"'Jost',sans-serif",boxSizing:"border-box"}}/>
          <button onClick={()=>{if(!newD.trim())return;setThreads([{id:Date.now(),desire:newD,days:0,done:false,signs:0,track:null},...threads]);setD("");setAdding(false);}}
            style={{padding:"9px 20px",background:OMBRE,backgroundSize:"200%",backgroundPosition:"left",border:"none",borderRadius:8,color:"#000",fontSize:12,fontWeight:700,cursor:"pointer"}}>Add Thread</button>
        </div>
      )}
      {threads.map(d=>(
        <div key={d.id} style={{background:C.bg2,border:`0.5px solid ${d.done?"#2a4a2a55":C.border}`,borderRadius:12,padding:"14px 16px",marginBottom:10}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:600,marginBottom:4,color:C.cr}}>{d.desire}</div>
              {d.track&&<div style={{fontSize:11,color:C.mu}}>Listening: {d.track}</div>}
              <div style={{fontSize:11,color:C.dim,marginTop:2}}>{d.days>0?`${d.days} days · `:""}{d.signs} sign{d.signs!==1?"s":""} logged</div>
            </div>
            {d.done
              ?<span style={{fontSize:10,padding:"3px 10px",background:"#1a3a1a",color:"#5ab06a",borderRadius:20,fontWeight:700,flexShrink:0}}>✓ done</span>
              :<button onClick={()=>setThreads(threads.map(x=>x.id===d.id?{...x,done:true}:x))} style={{fontSize:10,padding:"3px 10px",background:"none",border:`1px solid ${R}55`,borderRadius:20,color:R,fontWeight:700,flexShrink:0,cursor:"pointer",fontFamily:"'Jost',sans-serif"}}>mark ✓</button>
            }
          </div>
          <div style={{marginTop:10,height:2,background:C.border,borderRadius:1}}>
            <div style={{width:`${Math.min(d.days*5,100)}%`,height:"100%",background:OMBRE,borderRadius:1,backgroundSize:"200%",backgroundPosition:"left"}}/>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── HELPERS ────────────────────────────────────────────────────────────────────
function Sec({title,children,C}){
  return(
    <div style={{marginBottom:24}}>
      <div style={{padding:"0 16px 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:16,fontWeight:700,color:C.cr}}>{title}</span>
        <span style={{fontSize:11,fontWeight:600,color:C.mu}}>Show all</span>
      </div>
      {children}
    </div>
  );
}
function HRow({children}){return <div style={{display:"flex",gap:12,padding:"0 16px",overflowX:"auto",WebkitOverflowScrolling:"touch",scrollbarWidth:"none"}}>{children}</div>;}
function TCard({track:t,current,play,playing,isPreview,C}){
  const isP=current?.id===t.id;
  return(
    <div onClick={()=>play(t)} style={{flexShrink:0,width:140,cursor:isPreview?"not-allowed":"pointer"}}>
      <div style={{position:"relative",marginBottom:8}}>
        <Thumb title={t.title} size={140} radius={6}/>
        {isPreview?(
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.55)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center"}}><Ico.Lock/></div>
        ):(isP&&playing&&(
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <div style={{display:"flex",alignItems:"flex-end",gap:2}}>{[10,18,12,18,10].map((h,i)=><div key={i} style={{width:3,height:h,background:R,borderRadius:1}}/>)}</div>
          </div>
        ))}
      </div>
      <div style={{fontSize:13,fontWeight:600,color:(!isPreview&&isP)?R:C.cr,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2}}>{t.title}</div>
      <div style={{fontSize:11,color:C.mu}}>{t.cat} · {t.dur}</div>
    </div>
  );
}
