import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   SHG PORTAL — mirrors Spotify layout exactly
   Mobile: bottom 4-tab nav (Home | Search | Library | ProofOS)
   Desktop: left sidebar + main content + bottom player bar (Spotify desktop)
   Player: ombre gold→rose coloring, same controls as Spotify
   ═══════════════════════════════════════════════════════════════════════════ */

const BG  = "#0f0f0f";
const BG2 = "#181818";
const BG3 = "#242424";
const BG4 = "#2a2a2a";
const R   = "#B76E79";
const P   = "#d4a090";
const CR  = "#ffffff";
const MU  = "#b3b3b3";
const DIM = "#727272";

// Ombre gradient for player (gold→peach→rose)
const PLAYER_BG = "linear-gradient(135deg,#f5e0a0 0%,#e8b870 22%,#d4a090 48%,#c4789a 72%,#B76E79 100%)";
const PLAYER_ON_DARK = "#000";   // text on ombre background

// ── THUMBNAIL PALETTE ────────────────────────────────────────────────────────
const ART = {
  "Spoilt Goddess":           ["#c87890","#8a3060","♡"],
  "He Finds His Way Back":    ["#4060b0","#6080d0","✉"],
  "Money Finds Me First":     ["#306040","#50a070","✦"],
  "While I Sleep I Manifest": ["#483878","#6858a8","☽"],
  "Gorgeous Is My Default":   ["#b06840","#d4a060","◎"],
  "DNA Activation Ceremony":  ["#604080","#9060b0","✺"],
  "Lucky Girl Summer":        ["#808020","#c0c040","★"],
  "10 Years Into One Hour":   ["#305070","#4080a0","⟳"],
  "Highest Timeline":         ["#802050","#c04080","↑"],
  "SP & Love Mix":            ["#c87890","#903060","♡"],
  "Money Mix":                ["#306040","#508060","✦"],
  "Sleep Shifting Mix":       ["#303060","#504880","☽"],
};

function Thumb({ title, size=48, radius=4, style={} }) {
  const d = ART[title] || ["#483060","#604880","✦"];
  return (
    <div style={{ width:size, height:size, borderRadius:radius, flexShrink:0,
      background:`linear-gradient(135deg,${d[0]},${d[1]})`,
      display:"flex", alignItems:"center", justifyContent:"center",
      position:"relative", overflow:"hidden", ...style }}>
      <span style={{ fontSize:size*0.38, color:"rgba(255,255,255,0.5)", lineHeight:1, userSelect:"none" }}>{d[2]}</span>
    </div>
  );
}

// ── DATA ─────────────────────────────────────────────────────────────────────
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
  { id:1, desire:"He texts me first",  days:14, done:true,  signs:3, track:"He Finds His Way Back" },
  { id:2, desire:"£5,000 arrives",     days:6,  done:false, signs:2, track:"Money Finds Me First"  },
  { id:3, desire:"Skin visibly glowing",days:3, done:false, signs:1, track:"Gorgeous Is My Default" },
];

// ── SVG ICONS (Spotify style) ────────────────────────────────────────────────
const Ico = {
  Home:   ({a})=><svg width="24" height="24" viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" fill={a?CR:"none"} stroke={a?CR:DIM} strokeWidth="1.8"/></svg>,
  Search: ({a})=><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a?CR:DIM} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Lib:    ({a})=><svg width="24" height="24" viewBox="0 0 24 24" fill={a?CR:DIM}><path d="M3 3h4v18H3zM9 3h2v18H9zM14 3l7 2.5v13L14 21z"/></svg>,
  Proof:  ({a})=><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a?R:DIM} strokeWidth="1.8" strokeLinecap="round"><path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h9"/></svg>,
  Play:   ()=><svg width="20" height="20" viewBox="0 0 24 24" fill={PLAYER_ON_DARK}><polygon points="6 3 20 12 6 21"/></svg>,
  Pause:  ()=><svg width="20" height="20" viewBox="0 0 24 24" fill={PLAYER_ON_DARK}><rect x="6" y="4" width="4" height="16" rx="1.5"/><rect x="14" y="4" width="4" height="16" rx="1.5"/></svg>,
  Prev:   ({c=CR})=><svg width="22" height="22" viewBox="0 0 24 24" fill={c}><path d="M19 20L9 12l10-8v16z"/><rect x="5" y="4" width="2.5" height="16" rx="1" fill={c}/></svg>,
  Next:   ({c=CR})=><svg width="22" height="22" viewBox="0 0 24 24" fill={c}><path d="M5 4l10 8-10 8V4z"/><rect x="16.5" y="4" width="2.5" height="16" rx="1" fill={c}/></svg>,
  Shuf:   ({c=DIM})=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg>,
  Rep:    ({c=DIM})=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>,
  Heart:  ({on})=><svg width="18" height="18" viewBox="0 0 24 24" fill={on?R:"none"} stroke={on?R:DIM} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l7.84-7.84 1.06-1.06a5.5 5.5 0 000-7.72z"/></svg>,
  Vol:    ()=><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={DIM} strokeWidth="2" strokeLinecap="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 010 7.07"/><path d="M19.07 4.93a10 10 0 010 14.14"/></svg>,
};

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function SpotifyPortal({ onSignOut }) {
  const [tab, setTab]      = useState("home");
  const [track, setTrack]  = useState(TRACKS[0]);
  const [playing, setPlay] = useState(true);
  const [liked, setLiked]  = useState(new Set([1,3]));
  const [fullP, setFullP]  = useState(false);
  const [prog, setProg]    = useState(34);
  const [searchQ, setQ]    = useState("");
  const [libCat, setLibCat]= useState("All");
  const [threads, setThreads] = useState(THREADS);

  const hour = new Date().getHours();
  const greet = hour<12?"Good morning":hour<17?"Good afternoon":"Good evening";

  const play = (t) => { setTrack(t); setPlay(true); setFullP(false); };
  const toggleLike = (id, e) => { e?.stopPropagation(); setLiked(s => { const n=new Set(s); n.has(id)?n.delete(id):n.add(id); return n; }); };
  const nextTrack  = () => { const i=TRACKS.findIndex(t=>t.id===track.id); setTrack(TRACKS[(i+1)%TRACKS.length]); };
  const prevTrack  = () => { const i=TRACKS.findIndex(t=>t.id===track.id); setTrack(TRACKS[(i-1+TRACKS.length)%TRACKS.length]); };

  // Detect if desktop (>768px)
  const [isDesktop, setDesktop] = useState(typeof window!=="undefined" && window.innerWidth>768);
  useEffect(()=>{
    const h=()=>setDesktop(window.innerWidth>768);
    window.addEventListener("resize",h);
    return ()=>window.removeEventListener("resize",h);
  },[]);

  const tabContent = (
    <>
      {tab==="home"    && <HomeTab    greet={greet} track={track} play={play} liked={liked} toggleLike={toggleLike} playing={playing}/>}
      {tab==="search"  && <SearchTab  tracks={TRACKS} searchQ={searchQ} setQ={setQ} play={play} track={track} liked={liked} toggleLike={toggleLike}/>}
      {tab==="library" && <LibraryTab tracks={TRACKS} cat={libCat} setCat={setLibCat} play={play} track={track} liked={liked} toggleLike={toggleLike} playing={playing}/>}
      {tab==="proof"   && <ProofTab   threads={threads} setThreads={setThreads}/>}
    </>
  );

  // ── DESKTOP LAYOUT ─────────────────────────────────────────────────────────
  if (isDesktop) return (
    <div style={{ width:"100%", height:"100%", background:"#000", display:"flex", flexDirection:"column", fontFamily:"'Jost',sans-serif", color:CR, overflow:"hidden" }}>
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>

        {/* LEFT SIDEBAR */}
        <div style={{ width:220, background:BG, display:"flex", flexDirection:"column", padding:"24px 0 8px", flexShrink:0, borderRight:`1px solid ${BG3}` }}>
          {/* Logo */}
          <div style={{ padding:"0 20px 28px", fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:18, fontWeight:500, background:"linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            Self Hypnosis Goddess
          </div>
          {/* Nav links */}
          {[
            { id:"home",    label:"Home",     I:Ico.Home   },
            { id:"search",  label:"Search",   I:Ico.Search },
            { id:"library", label:"Library",  I:Ico.Lib    },
            { id:"proof",   label:"ProofOS ✦",I:Ico.Proof  },
          ].map(n=>(
            <button key={n.id} onClick={()=>setTab(n.id)} style={{ display:"flex", alignItems:"center", gap:14, padding:"8px 20px", background:tab===n.id?BG3:"none", border:"none", color:tab===n.id?CR:MU, fontSize:13, fontWeight:600, cursor:"pointer", textAlign:"left", borderRadius:0, width:"100%", transition:"color 0.15s", fontFamily:"'Jost',sans-serif" }}
              onMouseEnter={e=>e.currentTarget.style.color=CR}
              onMouseLeave={e=>{ if(tab!==n.id) e.currentTarget.style.color=MU; }}>
              <n.I a={tab===n.id}/> {n.label}
            </button>
          ))}
          <div style={{ height:1, background:BG3, margin:"16px 16px" }}/>
          {/* Recent playlists */}
          <div style={{ padding:"0 20px 8px", fontSize:11, fontWeight:700, color:DIM, letterSpacing:"0.12em", textTransform:"uppercase" }}>Recently played</div>
          {TRACKS.slice(0,5).map(t=>(
            <button key={t.id} onClick={()=>play(t)} style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 20px", background:"none", border:"none", color:track.id===t.id?CR:MU, fontSize:12, cursor:"pointer", width:"100%", textAlign:"left", fontFamily:"'Jost',sans-serif" }}
              onMouseEnter={e=>e.currentTarget.style.color=CR}
              onMouseLeave={e=>{ if(track.id!==t.id) e.currentTarget.style.color=MU; }}>
              <Thumb title={t.title} size={28} radius={2}/>
              <div style={{ minWidth:0 }}>
                <div style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontSize:12, fontWeight:track.id===t.id?600:400 }}>{t.title}</div>
              </div>
            </button>
          ))}
          <div style={{ flex:1 }}/>
          <button onClick={onSignOut} style={{ margin:"0 16px", padding:"8px 0", background:"none", border:"0.5px solid #333", borderRadius:6, color:DIM, fontSize:11, cursor:"pointer", fontFamily:"'Jost',sans-serif" }}>Sign out</button>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ flex:1, overflowY:"auto", background:BG2, paddingBottom:20 }}>
          {tabContent}
        </div>
      </div>

      {/* BOTTOM PLAYER BAR — desktop Spotify style */}
      <DesktopPlayer track={track} playing={playing} setPlay={setPlay} liked={liked} toggleLike={toggleLike} prog={prog} setProg={setProg} prevTrack={prevTrack} nextTrack={nextTrack}/>
    </div>
  );

  // ── MOBILE LAYOUT ──────────────────────────────────────────────────────────
  return (
    <div style={{ width:"100%", height:"100%", background:BG, display:"flex", flexDirection:"column", fontFamily:"'Jost',sans-serif", color:CR, overflow:"hidden", position:"relative" }}>
      {/* Status bar */}
      <div style={{ height:44, display:"flex", alignItems:"flex-end", justifyContent:"space-between", padding:"0 22px 7px", flexShrink:0 }}>
        <span style={{ fontSize:13, fontWeight:700 }}>9:41</span>
        <div style={{ display:"flex", gap:5, alignItems:"center" }}>
          <span style={{ fontSize:11 }}>●●●</span>
          <span style={{ fontSize:11 }}>100%</span>
        </div>
      </div>

      {/* Screen */}
      <div style={{ flex:1, overflowY:"auto", paddingBottom:130, WebkitOverflowScrolling:"touch" }}>
        {tabContent}
      </div>

      {/* Mini player */}
      {!fullP && (
        <div onClick={()=>setFullP(true)} style={{ position:"absolute", bottom:68, left:8, right:8, zIndex:50,
          background:BG4, borderRadius:8, display:"flex", alignItems:"center", gap:10, padding:"8px 10px",
          cursor:"pointer", boxShadow:"0 -4px 24px rgba(0,0,0,0.6)" }}>
          <Thumb title={track.title} size={42} radius={4}/>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{track.title}</div>
            <div style={{ fontSize:11, color:MU }}>{track.artist}</div>
          </div>
          <button onClick={e=>{e.stopPropagation();toggleLike(track.id,e);}} style={{ background:"none", border:"none", padding:6, lineHeight:0 }}><Ico.Heart on={liked.has(track.id)}/></button>
          <button onClick={e=>{e.stopPropagation();setPlay(p=>!p);}} style={{ width:34, height:34, borderRadius:"50%", background:CR, border:"none", display:"flex", alignItems:"center", justifyContent:"center", lineHeight:0 }}>
            {playing?<Ico.Pause/>:<Ico.Play/>}
          </button>
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:"#444", borderRadius:"0 0 8px 8px" }}>
            <div style={{ width:`${prog}%`, height:"100%", background:PLAYER_BG, borderRadius:"0 0 0 8px", backgroundSize:"200%", backgroundPosition:"left" }}/>
          </div>
        </div>
      )}

      {/* Full player */}
      {fullP && <MobilePlayer track={track} playing={playing} setPlay={setPlay} liked={liked} toggleLike={toggleLike} prog={prog} setProg={setProg} prevTrack={prevTrack} nextTrack={nextTrack} onClose={()=>setFullP(false)}/>}

      {/* Bottom nav — 4 tabs like Spotify+ProofOS */}
      {!fullP && (
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:68, background:"#0a0a0a", borderTop:`0.5px solid ${BG3}`, display:"flex", zIndex:60 }}>
          {[
            { id:"home",    label:"Home",    I:Ico.Home   },
            { id:"search",  label:"Search",  I:Ico.Search },
            { id:"library", label:"Library", I:Ico.Lib    },
            { id:"proof",   label:"ProofOS", I:Ico.Proof  },
          ].map(n=>(
            <button key={n.id} onClick={()=>setTab(n.id)} style={{ flex:1, background:"none", border:"none", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3, paddingBottom:6, cursor:"pointer" }}>
              <n.I a={tab===n.id}/>
              <span style={{ fontSize:10, fontWeight:tab===n.id?700:400, color:tab===n.id?(n.id==="proof"?R:CR):DIM, letterSpacing:"0.02em" }}>{n.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── DESKTOP PLAYER BAR ───────────────────────────────────────────────────────
function DesktopPlayer({ track, playing, setPlay, liked, toggleLike, prog, setProg, prevTrack, nextTrack }) {
  return (
    <div style={{ height:88, background:"#0a0a0a", borderTop:`1px solid ${BG3}`, display:"flex", alignItems:"center", padding:"0 16px", gap:0, flexShrink:0 }}>
      {/* Left — track info */}
      <div style={{ width:220, display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
        <Thumb title={track.title} size={52} radius={4}/>
        <div style={{ minWidth:0 }}>
          <div style={{ fontSize:13, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:2 }}>{track.title}</div>
          <div style={{ fontSize:11, color:MU }}>Reshma Oracle</div>
        </div>
        <button onClick={e=>toggleLike(track.id,e)} style={{ background:"none", border:"none", lineHeight:0, padding:8, marginLeft:4 }}>
          <Ico.Heart on={liked.has(track.id)}/>
        </button>
      </div>

      {/* Center — controls + scrubber */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
        {/* Controls */}
        <div style={{ display:"flex", alignItems:"center", gap:20 }}>
          <button style={{ background:"none", border:"none", lineHeight:0, opacity:0.6 }}><Ico.Shuf/></button>
          <button onClick={prevTrack} style={{ background:"none", border:"none", lineHeight:0 }}><Ico.Prev c={MU}/></button>
          {/* Play button — ombre */}
          <button onClick={()=>setPlay(p=>!p)} style={{ width:36, height:36, borderRadius:"50%", background:PLAYER_BG, border:"none", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"transform 0.1s, box-shadow 0.1s", boxShadow:"0 2px 12px rgba(212,160,144,0.5)" }}
            onMouseEnter={e=>e.currentTarget.style.transform="scale(1.06)"}
            onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
            {playing?<Ico.Pause/>:<Ico.Play/>}
          </button>
          <button onClick={nextTrack} style={{ background:"none", border:"none", lineHeight:0 }}><Ico.Next c={MU}/></button>
          <button style={{ background:"none", border:"none", lineHeight:0, opacity:0.6 }}><Ico.Rep c={R}/></button>
        </div>
        {/* Scrubber */}
        <div style={{ display:"flex", alignItems:"center", gap:8, width:"100%", maxWidth:520 }}>
          <span style={{ fontSize:11, color:DIM, width:32, textAlign:"right" }}>1:24</span>
          <div style={{ flex:1, height:4, background:"#4a4a4a", borderRadius:2, cursor:"pointer", position:"relative" }}
            onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setProg(Math.round(((e.clientX-r.left)/r.width)*100));}}>
            <div style={{ width:`${prog}%`, height:"100%", background:PLAYER_BG, borderRadius:2, backgroundSize:"200%", backgroundPosition:"left", position:"relative" }}>
              <div style={{ position:"absolute", right:-5, top:"50%", transform:"translateY(-50%)", width:12, height:12, borderRadius:"50%", background:CR, display:"none" }}/>
            </div>
          </div>
          <span style={{ fontSize:11, color:DIM, width:32 }}>{track.dur}</span>
        </div>
      </div>

      {/* Right — volume */}
      <div style={{ width:160, display:"flex", alignItems:"center", gap:8, justifyContent:"flex-end", flexShrink:0 }}>
        <Ico.Vol/>
        <div style={{ width:80, height:4, background:"#4a4a4a", borderRadius:2 }}>
          <div style={{ width:"70%", height:"100%", background:CR, borderRadius:2 }}/>
        </div>
      </div>
    </div>
  );
}

// ── MOBILE FULL PLAYER ───────────────────────────────────────────────────────
function MobilePlayer({ track, playing, setPlay, liked, toggleLike, prog, setProg, prevTrack, nextTrack, onClose }) {
  const art = ART[track.title] || ["#483060","#604880","✦"];
  return (
    <div style={{ position:"absolute", inset:0, background:`linear-gradient(180deg,${art[0]}cc 0%,${BG} 40%)`, zIndex:200, display:"flex", flexDirection:"column", alignItems:"center", padding:"0 28px", overflowY:"auto" }}>
      {/* Handle */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", paddingTop:52, marginBottom:24 }}>
        <button onClick={onClose} style={{ background:"none", border:"none", lineHeight:0, cursor:"pointer" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={CR} strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <span style={{ fontSize:12, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:CR }}>Now Playing</span>
        <button style={{ background:"none", border:"none", lineHeight:0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={CR} strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
        </button>
      </div>

      {/* Big album art */}
      <Thumb title={track.title} size={280} radius={14} style={{ boxShadow:`0 24px 80px ${art[0]}66`, marginBottom:32 }}/>

      {/* Track info + heart */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", marginBottom:24 }}>
        <div>
          <div style={{ fontSize:22, fontWeight:800, marginBottom:4 }}>{track.title}</div>
          <div style={{ fontSize:14, color:MU }}>{track.artist}</div>
        </div>
        <button onClick={e=>toggleLike(track.id,e)} style={{ background:"none", border:"none", lineHeight:0 }}>
          <Ico.Heart on={liked.has(track.id)}/>
        </button>
      </div>

      {/* Scrubber */}
      <div style={{ width:"100%", marginBottom:8 }}>
        <div style={{ height:4, background:"#4a4a4a", borderRadius:2, cursor:"pointer", position:"relative" }}
          onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setProg(Math.round(((e.clientX-r.left)/r.width)*100));}}>
          {/* Ombre progress bar */}
          <div style={{ width:`${prog}%`, height:"100%", background:PLAYER_BG, borderRadius:2, backgroundSize:"200%", backgroundPosition:"left", position:"relative" }}>
            <div style={{ position:"absolute", right:-6, top:"50%", transform:"translateY(-50%)", width:13, height:13, borderRadius:"50%", background:CR, boxShadow:`0 0 6px ${P}` }}/>
          </div>
        </div>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", width:"100%", marginBottom:32 }}>
        <span style={{ fontSize:11, color:DIM }}>1:24</span>
        <span style={{ fontSize:11, color:DIM }}>{track.dur}</span>
      </div>

      {/* Controls */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%" }}>
        <button style={{ background:"none", border:"none", lineHeight:0 }}><Ico.Shuf/></button>
        <button onClick={prevTrack} style={{ background:"none", border:"none", lineHeight:0 }}><Ico.Prev/></button>
        {/* OMBRE PLAY BUTTON */}
        <button onClick={()=>setPlay(p=>!p)} style={{ width:64, height:64, borderRadius:"50%", background:PLAYER_BG, border:"none", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", boxShadow:`0 4px 28px ${P}66`, backgroundSize:"200%", backgroundPosition:"left" }}>
          {playing?<Ico.Pause/>:<Ico.Play/>}
        </button>
        <button onClick={nextTrack} style={{ background:"none", border:"none", lineHeight:0 }}><Ico.Next/></button>
        <button style={{ background:"none", border:"none", lineHeight:0 }}><Ico.Rep c={R}/></button>
      </div>
    </div>
  );
}

// ── HOME TAB ─────────────────────────────────────────────────────────────────
function HomeTab({ greet, track, play, liked, toggleLike, playing }) {
  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 16px 16px" }}>
        <span style={{ fontSize:20, fontWeight:700 }}>{greet}</span>
        <div style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${P},${R})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:"#000" }}>R</div>
      </div>

      {/* Recently played 2×3 grid */}
      <div style={{ padding:"0 16px 24px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        {RECENT.map((title,i)=>(
          <button key={i} onClick={()=>play(TRACKS.find(t=>t.title===title)||TRACKS[i])}
            style={{ background:BG3, borderRadius:6, display:"flex", alignItems:"center", overflow:"hidden", height:52, cursor:"pointer", border:"none", textAlign:"left", width:"100%", transition:"background 0.15s" }}
            onMouseEnter={e=>e.currentTarget.style.background="#303030"}
            onMouseLeave={e=>e.currentTarget.style.background=BG3}>
            <Thumb title={title} size={52} radius={0}/>
            <span style={{ fontSize:12, fontWeight:700, padding:"0 10px", lineHeight:1.3, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>{title}</span>
          </button>
        ))}
      </div>

      {/* Jump back in */}
      <Sec title="Jump back in">
        <HRow>
          {TRACKS.slice(0,5).map(t=><TCard key={t.id} track={t} current={track} play={play} playing={playing}/>)}
        </HRow>
      </Sec>

      {/* New releases */}
      <Sec title="New this week">
        <HRow>
          {TRACKS.filter(t=>t.isNew).map(t=><TCard key={t.id} track={t} current={track} play={play} playing={playing}/>)}
        </HRow>
      </Sec>

      {/* Categories */}
      <Sec title="Browse by desire">
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, padding:"0 16px" }}>
          {[["SP & Love","#c87890","#8a3060"],["Money","#306040","#508060"],["Beauty","#b06840","#d4a060"],
            ["Sleep","#304870","#4060a0"],["DNA","#604080","#9060b0"],["Identity","#802050","#c04080"]].map(([l,c1,c2],i)=>(
            <div key={i} style={{ height:64, borderRadius:8, overflow:"hidden", position:"relative", cursor:"pointer",
              background:`linear-gradient(135deg,${c1},${c2})` }}>
              <span style={{ position:"absolute", bottom:10, left:12, fontSize:13, fontWeight:700 }}>{l}</span>
            </div>
          ))}
        </div>
      </Sec>
    </div>
  );
}

// ── SEARCH TAB ───────────────────────────────────────────────────────────────
function SearchTab({ tracks, searchQ, setQ, play, track: cur, liked, toggleLike }) {
  const res = searchQ.length>1 ? tracks.filter(t=>t.title.toLowerCase().includes(searchQ.toLowerCase())||t.cat.toLowerCase().includes(searchQ.toLowerCase())) : tracks;
  return (
    <div style={{ padding:"20px 16px 0" }}>
      <div style={{ fontSize:20, fontWeight:700, marginBottom:16 }}>Search</div>
      <div style={{ display:"flex", alignItems:"center", gap:10, background:CR, borderRadius:6, padding:"10px 14px", marginBottom:20 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input value={searchQ} onChange={e=>setQ(e.target.value)} placeholder="Tracks, categories, desires…"
          style={{ border:"none", background:"transparent", flex:1, fontSize:14, fontWeight:500, color:"#000", outline:"none", fontFamily:"'Jost',sans-serif" }}/>
      </div>
      {res.map(t=>(
        <div key={t.id} onClick={()=>play(t)} style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 0", borderBottom:`0.5px solid ${BG3}`, cursor:"pointer" }}>
          <Thumb title={t.title} size={46} radius={4}/>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:600, color:cur?.id===t.id?R:CR, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:2 }}>{t.title}</div>
            <div style={{ fontSize:11, color:MU }}>{t.artist} · {t.cat}</div>
          </div>
          <span style={{ fontSize:11, color:DIM }}>{t.dur}</span>
        </div>
      ))}
    </div>
  );
}

// ── LIBRARY TAB ──────────────────────────────────────────────────────────────
function LibraryTab({ tracks, cat, setCat, play, track: cur, liked, toggleLike, playing }) {
  const cats = ["All","SP & Love","Money","Beauty","Sleep","DNA","Identity"];
  const shown = cat==="All" ? tracks : tracks.filter(t=>t.cat===cat);
  return (
    <div>
      <div style={{ padding:"20px 16px 12px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <span style={{ fontSize:20, fontWeight:700 }}>Your Library</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={CR} strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </div>
      <div style={{ display:"flex", gap:8, padding:"0 16px 16px", overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
        {cats.map(c=>(
          <button key={c} onClick={()=>setCat(c)} style={{ flexShrink:0, padding:"6px 14px", borderRadius:20,
            background:cat===c?CR:BG3, border:"none", color:cat===c?"#000":CR, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"'Jost',sans-serif" }}>{c}</button>
        ))}
      </div>
      <div style={{ padding:"0 16px" }}>
        {shown.map(t=>(
          <div key={t.id} onClick={()=>play(t)} style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 0", cursor:"pointer" }}>
            <div style={{ position:"relative", flexShrink:0 }}>
              <Thumb title={t.title} size={50} radius={4}/>
              {cur?.id===t.id && playing && (
                <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.5)", borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <div style={{ display:"flex", alignItems:"flex-end", gap:2 }}>
                    {[8,14,10,14,8].map((h,i)=><div key={i} style={{ width:2, height:h, background:R, borderRadius:1 }}/>)}
                  </div>
                </div>
              )}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:14, fontWeight:600, color:cur?.id===t.id?R:CR, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:2 }}>
                {t.title}{t.isNew && <span style={{ marginLeft:6, fontSize:9, background:`${R}22`, color:R, padding:"1px 5px", borderRadius:8, fontWeight:700, verticalAlign:"middle" }}>NEW</span>}
              </div>
              <div style={{ fontSize:11, color:MU }}>{t.tier==="goddess"&&<span style={{ color:R }}>✦ </span>}{t.artist} · {t.cat} · {t.dur}</div>
            </div>
            <button onClick={e=>{e.stopPropagation();toggleLike(t.id,e);}} style={{ background:"none", border:"none", padding:8, lineHeight:0 }}>
              <Ico.Heart on={liked.has(t.id)}/>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PROOFOS TAB ──────────────────────────────────────────────────────────────
function ProofTab({ threads, setThreads }) {
  const [newD, setD] = useState("");
  const [adding, setAdding] = useState(false);
  return (
    <div style={{ padding:"20px 16px 0" }}>
      <div style={{ fontSize:20, fontWeight:700, marginBottom:4 }}>ProofOS <span style={{ color:R }}>✦</span></div>
      <div style={{ fontSize:13, color:MU, marginBottom:20 }}>Your manifestation ledger</div>
      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:20 }}>
        {[[threads.length,"Desires",CR],[threads.filter(t=>t.done).length,"Manifested",R],["14d","Streak",P]].map(([v,l,c],i)=>(
          <div key={i} style={{ background:BG3, borderRadius:10, padding:"12px 8px", textAlign:"center" }}>
            <div style={{ fontSize:22, fontWeight:800, color:c }}>{v}</div>
            <div style={{ fontSize:10, color:MU, fontWeight:600, letterSpacing:"0.08em" }}>{l}</div>
          </div>
        ))}
      </div>
      {/* Add */}
      <button onClick={()=>setAdding(a=>!a)} style={{ width:"100%", padding:12, background:BG3, border:`1px solid ${R}44`, borderRadius:10, color:CR, fontSize:13, fontWeight:600, marginBottom:12, cursor:"pointer", fontFamily:"'Jost',sans-serif" }}>
        + New Proof Thread
      </button>
      {adding && (
        <div style={{ background:BG3, borderRadius:10, padding:14, marginBottom:14 }}>
          <input value={newD} onChange={e=>setD(e.target.value)} placeholder="State your desire…"
            style={{ width:"100%", background:"#333", border:"none", color:CR, borderRadius:8, padding:"10px 12px", fontSize:13, marginBottom:10, outline:"none", fontFamily:"'Jost',sans-serif", boxSizing:"border-box" }}/>
          <button onClick={()=>{if(!newD.trim())return;setThreads([{id:Date.now(),desire:newD,days:0,done:false,signs:0,track:null},...threads]);setD("");setAdding(false);}}
            style={{ padding:"9px 20px", background:PLAYER_BG, border:"none", borderRadius:8, color:"#000", fontSize:12, fontWeight:700, cursor:"pointer", backgroundSize:"200%", backgroundPosition:"left" }}>Add Thread</button>
        </div>
      )}
      {/* Threads */}
      {threads.map(d=>(
        <div key={d.id} style={{ background:"#1a1a1a", border:`0.5px solid ${d.done?"#2a4a2a":BG3}`, borderRadius:12, padding:"14px 16px", marginBottom:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:600, marginBottom:4 }}>{d.desire}</div>
              {d.track && <div style={{ fontSize:11, color:MU }}>Listening: {d.track}</div>}
              <div style={{ fontSize:11, color:DIM, marginTop:2 }}>{d.days>0?`${d.days} days · `:""}{d.signs} sign{d.signs!==1?"s":""} logged</div>
            </div>
            {d.done
              ? <span style={{ fontSize:10, padding:"3px 10px", background:"#1a3a1a", color:"#5ab06a", borderRadius:20, fontWeight:700, flexShrink:0 }}>✓ done</span>
              : <button onClick={()=>setThreads(threads.map(x=>x.id===d.id?{...x,done:true}:x))}
                  style={{ fontSize:10, padding:"3px 10px", background:"none", border:`1px solid ${R}55`, borderRadius:20, color:R, fontWeight:700, flexShrink:0, cursor:"pointer", fontFamily:"'Jost',sans-serif" }}>mark ✓</button>
            }
          </div>
          <div style={{ marginTop:10, height:2, background:"#333", borderRadius:1 }}>
            <div style={{ width:`${Math.min(d.days*5,100)}%`, height:"100%", background:PLAYER_BG, borderRadius:1, backgroundSize:"200%", backgroundPosition:"left" }}/>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── HELPERS ──────────────────────────────────────────────────────────────────
function Sec({ title, children }) {
  return (
    <div style={{ marginBottom:24 }}>
      <div style={{ padding:"0 16px 10px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:16, fontWeight:700 }}>{title}</span>
        <span style={{ fontSize:11, fontWeight:600, color:MU }}>Show all</span>
      </div>
      {children}
    </div>
  );
}

function HRow({ children }) {
  return <div style={{ display:"flex", gap:12, padding:"0 16px", overflowX:"auto", WebkitOverflowScrolling:"touch", scrollbarWidth:"none" }}>{children}</div>;
}

function TCard({ track: t, current, play, playing }) {
  const isP = current?.id===t.id;
  return (
    <div onClick={()=>play(t)} style={{ flexShrink:0, width:140, cursor:"pointer" }}>
      <div style={{ position:"relative", marginBottom:8 }}>
        <Thumb title={t.title} size={140} radius={6}/>
        {isP && playing && (
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.5)", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ display:"flex", alignItems:"flex-end", gap:2 }}>
              {[10,18,12,18,10].map((h,i)=><div key={i} style={{ width:3, height:h, background:R, borderRadius:1 }}/>)}
            </div>
          </div>
        )}
      </div>
      <div style={{ fontSize:13, fontWeight:600, color:isP?R:CR, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:2 }}>{t.title}</div>
      <div style={{ fontSize:11, color:MU }}>{t.cat} · {t.dur}</div>
    </div>
  );
}
