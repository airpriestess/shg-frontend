import { useState, useEffect, useRef } from "react";

/* ── SHG Spotify Portal — exact Spotify home layout ─────────────────────────
   #121212 base · Jost font · Rose gold accent · Album art thumbnails
   Bottom nav: Home | Search | Library (exact Spotify 3-tab)
*/

const BG   = "#121212";
const BG2  = "#181818";
const BG3  = "#282828";
const R    = "#B76E79";
const P    = "#d4a090";
const CR   = "#ffffff";
const MU   = "#b3b3b3";
const DIM  = "#727272";

// ── Album art thumbnails — gradient squares per track ─────────────────────────
const THUMBS = {
  "Spoilt Goddess":           { g: ["#c87890","#8a3060"], sym: "♡" },
  "He Finds His Way Back":    { g: ["#4060b0","#8090d0"], sym: "✉" },
  "Money Finds Me First":     { g: ["#306040","#60a870"], sym: "✦" },
  "While I Sleep I Manifest": { g: ["#483878","#7060a8"], sym: "☽" },
  "Gorgeous Is My Default":   { g: ["#b06840","#d4a060"], sym: "◎" },
  "DNA Activation Ceremony":  { g: ["#604080","#a060b0"], sym: "✺" },
  "Lucky Girl Summer":        { g: ["#a0b030","#d4d060"], sym: "★" },
  "10 Years Into One Hour":   { g: ["#305070","#4080a0"], sym: "⟳" },
  "Highest Timeline":         { g: ["#80304a","#c04070"], sym: "↑" },
  "SP & Love Mix":            { g: ["#c87890","#903060"], sym: "♡" },
  "Money Mix":                { g: ["#306040","#508060"], sym: "✦" },
  "Sleep Shifting Mix":       { g: ["#303060","#504880"], sym: "☽" },
};

function Thumb({ title, size=48, radius=4 }) {
  const t = THUMBS[title] || { g:["#483060","#604880"], sym:"✦" };
  return (
    <div style={{ width:size, height:size, borderRadius:radius, flexShrink:0, position:"relative", overflow:"hidden",
      background:`linear-gradient(135deg,${t.g[0]},${t.g[1]})` }}>
      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:size*0.38, color:"rgba(255,255,255,0.55)", lineHeight:1 }}>{t.sym}</div>
    </div>
  );
}

// ── TRACKS DATA ───────────────────────────────────────────────────────────────
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
const PLAYLISTS = [
  { title:"SP & Love Mix",      sub:"6 tracks · 3h", cat:"SP & Love" },
  { title:"Money Mix",          sub:"5 tracks · 2h", cat:"Money"     },
  { title:"Sleep Shifting Mix", sub:"4 tracks · 4h", cat:"Sleep"     },
];
const CATS = ["All","SP & Love","Money","Beauty","Sleep","DNA","Identity"];

// ── SVG ICONS ─────────────────────────────────────────────────────────────────
const HomeIcon  = ({a}) => <svg width="24" height="24" viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" fill={a?CR:"none"} stroke={a?CR:DIM} strokeWidth="2"/></svg>;
const SearchIcon= ({a}) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a?CR:DIM} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const LibIcon   = ({a}) => <svg width="24" height="24" viewBox="0 0 24 24" fill={a?CR:DIM}><path d="M3 3h4v18H3zM9 3h2v18H9zM14 3l7 2.5v13L14 21z"/></svg>;
const PlayIcon  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill={BG}><polygon points="6 3 20 12 6 21"/></svg>;
const PauseIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill={BG}><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>;
const PrevIcon  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill={CR}><path d="M19 20L9 12l10-8v16z"/><rect x="5" y="4" width="2.5" height="16" rx="1" fill={CR}/></svg>;
const NextIcon  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill={CR}><path d="M5 4l10 8-10 8V4z"/><rect x="16.5" y="4" width="2.5" height="16" rx="1" fill={CR}/></svg>;
const HeartIcon = ({on}) => <svg width="16" height="16" viewBox="0 0 24 24" fill={on?R:"none"} stroke={on?R:DIM} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l7.84-7.84 1.06-1.06a5.5 5.5 0 000-7.72z"/></svg>;

// ── MAIN EXPORT ───────────────────────────────────────────────────────────────
export default function SpotifyPortal({ onSignOut, userTier="goddess" }) {
  const [tab, setTab]       = useState("home");
  const [nowPlaying, setNow]= useState(TRACKS[0]);
  const [isPlaying, setPlay]= useState(true);
  const [liked, setLiked]   = useState(new Set([1,3]));
  const [fullPlayer, setFull]= useState(false);
  const [prog, setProg]     = useState(38);
  const [libFilter, setLibF]= useState("All");
  const [searchQ, setSearchQ]= useState("");

  const hour = new Date().getHours();
  const greet = hour<12?"Good morning":hour<17?"Good afternoon":"Good evening";

  const play = (t) => { setNow(t); setPlay(true); };
  const toggleLike = (id, e) => { e?.stopPropagation(); setLiked(s => { const n=new Set(s); n.has(id)?n.delete(id):n.add(id); return n; }); };

  return (
    <div style={{ width:"100%", height:"100%", background:BG, display:"flex", flexDirection:"column",
      fontFamily:"'Jost',sans-serif", color:CR, overflow:"hidden", position:"relative" }}>

      {/* STATUS BAR */}
      <div style={{ height:44, display:"flex", alignItems:"flex-end", justifyContent:"space-between",
        padding:"0 22px 7px", flexShrink:0, background:BG }}>
        <span style={{ fontSize:13, fontWeight:700 }}>9:41</span>
        <div style={{ display:"flex", gap:5, alignItems:"center" }}>
          <svg width="16" height="12" viewBox="0 0 16 12" fill={CR}><rect x="0" y="4" width="3" height="8" rx="1"/><rect x="4.5" y="2.5" width="3" height="9.5" rx="1"/><rect x="9" y="1" width="3" height="11" rx="1"/><rect x="13.5" y="0" width="2.5" height="12" rx="1"/></svg>
          <svg width="16" height="12" viewBox="0 0 24 17" fill={CR}><path d="M12 3.5C8.5 3.5 5.4 4.9 3.1 7.2L0 4.1C3.1 1.5 7.4 0 12 0s8.9 1.5 12 4.1l-3.1 3.1C18.6 4.9 15.5 3.5 12 3.5z"/><path d="M12 10.5c-1.9 0-3.6.8-4.8 2L4 9.3C6.1 7.2 8.9 6 12 6s5.9 1.2 8 3.3l-3.2 3.2c-1.2-1.2-2.9-2-4.8-2z"/><circle cx="12" cy="17" r="2.5"/></svg>
          <span style={{ fontSize:13, fontWeight:700 }}>100%</span>
        </div>
      </div>

      {/* SCREEN */}
      <div style={{ flex:1, overflowY:"auto", overflowX:"hidden", paddingBottom:130, WebkitOverflowScrolling:"touch" }}>
        {tab==="home"   && <HomeTab greet={greet} nowPlaying={nowPlaying} play={play} liked={liked} toggleLike={toggleLike} isPlaying={isPlaying}/>}
        {tab==="search" && <SearchTab tracks={TRACKS} searchQ={searchQ} setSearchQ={setSearchQ} play={play} nowPlaying={nowPlaying} liked={liked} toggleLike={toggleLike}/>}
        {tab==="library"&& <LibraryTab tracks={TRACKS} filter={libFilter} setFilter={setLibF} play={play} nowPlaying={nowPlaying} liked={liked} toggleLike={toggleLike} isPlaying={isPlaying}/>}
      </div>

      {/* NOW PLAYING MINI BAR */}
      {!fullPlayer && nowPlaying && (
        <div onClick={()=>setFull(true)} style={{
          position:"absolute", bottom:64, left:8, right:8, zIndex:50,
          background:"#2a2a2a", borderRadius:8,
          display:"flex", alignItems:"center", gap:10, padding:"8px 10px",
          cursor:"pointer", boxShadow:"0 -4px 20px rgba(0,0,0,0.5)"
        }}>
          <Thumb title={nowPlaying.title} size={42} radius={4}/>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:600, color:CR, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{nowPlaying.title}</div>
            <div style={{ fontSize:11, color:MU }}>{nowPlaying.artist}</div>
          </div>
          <button onClick={e=>{e.stopPropagation();toggleLike(nowPlaying.id,e);}} style={{ background:"none",border:"none",padding:6,lineHeight:0 }}>
            <HeartIcon on={liked.has(nowPlaying.id)}/>
          </button>
          <button onClick={e=>{e.stopPropagation();setPlay(p=>!p);}} style={{ width:32,height:32,borderRadius:"50%",background:CR,border:"none",display:"flex",alignItems:"center",justifyContent:"center" }}>
            {isPlaying?<PauseIcon/>:<PlayIcon/>}
          </button>
          {/* mini progress */}
          <div style={{ position:"absolute",bottom:0,left:0,right:0,height:2,background:"#444",borderRadius:"0 0 8px 8px" }}>
            <div style={{ width:`${prog}%`,height:"100%",background:CR,borderRadius:"0 0 0 8px" }}/>
          </div>
        </div>
      )}

      {/* FULL PLAYER */}
      {fullPlayer && <FullPlayer track={nowPlaying} isPlaying={isPlaying} setPlay={setPlay}
        liked={liked} toggleLike={toggleLike} prog={prog} setProg={setProg}
        onClose={()=>setFull(false)} onPrev={()=>setNow(TRACKS[(TRACKS.findIndex(t=>t.id===nowPlaying.id)-1+TRACKS.length)%TRACKS.length])}
        onNext={()=>setNow(TRACKS[(TRACKS.findIndex(t=>t.id===nowPlaying.id)+1)%TRACKS.length])}/>}

      {/* BOTTOM NAV — exact Spotify 3-tab */}
      {!fullPlayer && (
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:64, background:"#0a0a0a",
          borderTop:"0.5px solid #282828", display:"flex", zIndex:60 }}>
          {[
            { id:"home",    label:"Home",    I:HomeIcon   },
            { id:"search",  label:"Search",  I:SearchIcon },
            { id:"library", label:"Library", I:LibIcon    },
          ].map(n=>(
            <button key={n.id} onClick={()=>setTab(n.id)} style={{ flex:1,background:"none",border:"none",
              display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,paddingBottom:6 }}>
              <n.I a={tab===n.id}/>
              <span style={{ fontSize:10,fontWeight:tab===n.id?700:400,color:tab===n.id?CR:DIM,letterSpacing:"0.02em" }}>{n.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── HOME TAB ──────────────────────────────────────────────────────────────────
function HomeTab({ greet, nowPlaying, play, liked, toggleLike, isPlaying }) {
  return (
    <div style={{ padding:"16px 0 0" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 16px 16px" }}>
        <span style={{ fontSize:20, fontWeight:700 }}>{greet}</span>
        <div style={{ display:"flex", gap:16, alignItems:"center" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={CR} strokeWidth="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
          <div style={{ width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${P},${R})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:"#000" }}>R</div>
        </div>
      </div>

      {/* Recently played — 2×3 grid, Spotify-style */}
      <div style={{ padding:"0 16px 24px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {RECENT.map((title,i)=>(
            <button key={i} onClick={()=>play(TRACKS.find(t=>t.title===title)||TRACKS[i])}
              style={{ background:BG3, borderRadius:6, display:"flex", alignItems:"center",
                gap:0, overflow:"hidden", height:48, cursor:"pointer", border:"none", textAlign:"left", transition:"background 0.15s" }}
              onMouseEnter={e=>e.currentTarget.style.background="#333"}
              onMouseLeave={e=>e.currentTarget.style.background=BG3}>
              <Thumb title={title} size={48} radius={0}/>
              <span style={{ fontSize:12,fontWeight:700,color:CR,padding:"0 10px",lineHeight:1.25,overflow:"hidden",
                display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical" }}>{title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Jump back in */}
      <Section title="Jump back in">
        <HScroll>
          {TRACKS.slice(0,6).map(t=>(
            <TrackCard key={t.id} track={t} nowPlaying={nowPlaying} play={play} isPlaying={isPlaying}/>
          ))}
        </HScroll>
      </Section>

      {/* Your mixes */}
      <Section title="Your mixes">
        <HScroll>
          {PLAYLISTS.map((pl,i)=>(
            <div key={i} style={{ flexShrink:0, width:140, cursor:"pointer" }}>
              <Thumb title={pl.title} size={140} radius={8}/>
              <div style={{ fontSize:13,fontWeight:600,color:CR,marginTop:8,marginBottom:2 }}>{pl.title}</div>
              <div style={{ fontSize:11,color:MU }}>{pl.sub}</div>
            </div>
          ))}
        </HScroll>
      </Section>

      {/* New releases */}
      <Section title="New this week">
        <HScroll>
          {TRACKS.filter(t=>t.isNew).map(t=>(
            <TrackCard key={t.id} track={t} nowPlaying={nowPlaying} play={play} isPlaying={isPlaying}/>
          ))}
        </HScroll>
      </Section>

      {/* Categories */}
      <Section title="Browse categories">
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, padding:"0 16px" }}>
          {[
            { label:"SP & Love",  c1:"#c87890", c2:"8a3060" },
            { label:"Money",      c1:"#306040", c2:"508060" },
            { label:"Beauty",     c1:"#b06840", c2:"d4a060" },
            { label:"Sleep",      c1:"#304870", c2:"4060a0" },
            { label:"DNA",        c1:"#604080", c2:"9060b0" },
            { label:"Identity",   c1:"#804060", c2:"b06090" },
          ].map((cat,i)=>(
            <div key={i} style={{ height:60, borderRadius:8, overflow:"hidden", position:"relative", cursor:"pointer",
              background:`linear-gradient(135deg,${cat.c1},#${cat.c2})` }}>
              <span style={{ position:"absolute",bottom:8,left:10,fontSize:13,fontWeight:700,color:CR }}>{cat.label}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ── SEARCH TAB ────────────────────────────────────────────────────────────────
function SearchTab({ tracks, searchQ, setSearchQ, play, nowPlaying, liked, toggleLike }) {
  const filtered = searchQ.length>1 ? tracks.filter(t=>t.title.toLowerCase().includes(searchQ.toLowerCase())||t.cat.toLowerCase().includes(searchQ.toLowerCase())) : tracks;
  return (
    <div style={{ padding:"16px 16px 0" }}>
      <div style={{ fontSize:20,fontWeight:700,marginBottom:16 }}>Search</div>
      {/* Search bar */}
      <div style={{ display:"flex", alignItems:"center", gap:10, background:CR, borderRadius:6, padding:"10px 14px", marginBottom:20 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} placeholder="Artists, tracks, desires..."
          style={{ border:"none",background:"transparent",flex:1,fontSize:14,fontWeight:500,color:"#000",outline:"none" }}/>
      </div>
      {/* Track list */}
      {filtered.map((t,i)=>(
        <div key={t.id} onClick={()=>play(t)} style={{ display:"flex",alignItems:"center",gap:12,padding:"7px 0",
          borderBottom:"0.5px solid #282828",cursor:"pointer" }}>
          <Thumb title={t.title} size={46} radius={4}/>
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ fontSize:13,fontWeight:600,color:nowPlaying?.id===t.id?R:CR,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{t.title}</div>
            <div style={{ fontSize:11,color:MU }}>{t.artist} · {t.cat}</div>
          </div>
          <span style={{ fontSize:11,color:DIM }}>{t.dur}</span>
        </div>
      ))}
    </div>
  );
}

// ── LIBRARY TAB ───────────────────────────────────────────────────────────────
function LibraryTab({ tracks, filter, setFilter, play, nowPlaying, liked, toggleLike, isPlaying }) {
  const cats = ["All","SP & Love","Money","Beauty","Sleep","DNA","Identity"];
  const shown = filter==="All" ? tracks : tracks.filter(t=>t.cat===filter);
  return (
    <div style={{ padding:"16px 0 0" }}>
      <div style={{ padding:"0 16px 12px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <span style={{ fontSize:20,fontWeight:700 }}>Your Library</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={CR} strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </div>
      {/* Filter pills */}
      <div style={{ display:"flex",gap:8,padding:"0 16px 14px",overflowX:"auto",WebkitOverflowScrolling:"touch" }}>
        {cats.map(c=>(
          <button key={c} onClick={()=>setFilter(c)} style={{ flexShrink:0,padding:"6px 14px",borderRadius:20,
            background:filter===c?CR:BG3,border:"none",color:filter===c?"#000":CR,fontSize:12,fontWeight:600,cursor:"pointer" }}>{c}</button>
        ))}
      </div>
      {/* Track rows */}
      <div style={{ padding:"0 16px" }}>
        {shown.map(t=>(
          <div key={t.id} onClick={()=>play(t)} style={{ display:"flex",alignItems:"center",gap:12,padding:"8px 0",cursor:"pointer" }}>
            <div style={{ position:"relative",flexShrink:0 }}>
              <Thumb title={t.title} size={50} radius={4}/>
              {nowPlaying?.id===t.id && isPlaying && (
                <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <div style={{ display:"flex",alignItems:"flex-end",gap:2 }}>
                    {[8,14,10,14,8].map((h,i)=>(
                      <div key={i} style={{ width:2,borderRadius:1,background:CR,height:h }}/>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ fontSize:14,fontWeight:600,color:nowPlaying?.id===t.id?R:CR,
                overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2 }}>
                {t.title}
                {t.isNew && <span style={{ marginLeft:6,fontSize:9,background:`${R}22`,color:R,padding:"1px 5px",borderRadius:8,fontWeight:700,verticalAlign:"middle" }}>NEW</span>}
              </div>
              <div style={{ fontSize:11,color:MU }}>{t.tier==="goddess"&&<span style={{ color:R,marginRight:4 }}>✦</span>}{t.artist} · {t.cat} · {t.dur}</div>
            </div>
            <button onClick={e=>toggleLike(t.id,e)} style={{ background:"none",border:"none",padding:8,lineHeight:0 }}>
              <HeartIcon on={liked.has(t.id)}/>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── FULL PLAYER ───────────────────────────────────────────────────────────────
function FullPlayer({ track, isPlaying, setPlay, liked, toggleLike, prog, setProg, onClose, onPrev, onNext }) {
  return (
    <div style={{ position:"absolute",inset:0,background:`linear-gradient(180deg,${THUMBS[track.title]?.g[0]||"#282828"} 0%,${BG} 35%)`,
      zIndex:200,display:"flex",flexDirection:"column",padding:"0 28px" }}>
      {/* Handle */}
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:52,marginBottom:28 }}>
        <button onClick={onClose} style={{ background:"none",border:"none",lineHeight:0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={CR} strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:11,fontWeight:700,color:CR,letterSpacing:"0.2em",textTransform:"uppercase" }}>Now Playing</div>
        </div>
        <button style={{ background:"none",border:"none",lineHeight:0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={CR} strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
        </button>
      </div>
      {/* Big art */}
      <Thumb title={track.title} size={280} radius={12}/>
      <div style={{ flex:1, marginTop:28 }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24 }}>
          <div>
            <div style={{ fontSize:22,fontWeight:800,color:CR,marginBottom:4 }}>{track.title}</div>
            <div style={{ fontSize:14,color:MU }}>{track.artist}</div>
          </div>
          <button onClick={e=>toggleLike(track.id,e)} style={{ background:"none",border:"none",lineHeight:0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill={liked.has(track.id)?R:"none"} stroke={liked.has(track.id)?R:MU} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l7.84-7.84 1.06-1.06a5.5 5.5 0 000-7.72z"/></svg>
          </button>
        </div>
        {/* Scrubber */}
        <div style={{ height:4,background:"#4a4a4a",borderRadius:2,marginBottom:6,cursor:"pointer",position:"relative" }}
          onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setProg(Math.round(((e.clientX-r.left)/r.width)*100));}}>
          <div style={{ width:`${prog}%`,height:"100%",background:CR,borderRadius:2,position:"relative" }}>
            <div style={{ position:"absolute",right:-5,top:"50%",transform:"translateY(-50%)",width:12,height:12,borderRadius:"50%",background:CR }}/>
          </div>
        </div>
        <div style={{ display:"flex",justifyContent:"space-between",marginBottom:28 }}>
          <span style={{ fontSize:11,color:DIM }}>1:24</span>
          <span style={{ fontSize:11,color:DIM }}>{track.dur}</span>
        </div>
        {/* Controls */}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <button style={{ background:"none",border:"none",lineHeight:0,opacity:0.5 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={CR} strokeWidth="2" strokeLinecap="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg>
          </button>
          <button onClick={onPrev} style={{ background:"none",border:"none",lineHeight:0 }}><PrevIcon/></button>
          <button onClick={()=>setPlay(p=>!p)} style={{ width:64,height:64,borderRadius:"50%",background:CR,border:"none",display:"flex",alignItems:"center",justifyContent:"center" }}>
            {isPlaying?<PauseIcon/>:<PlayIcon/>}
          </button>
          <button onClick={onNext} style={{ background:"none",border:"none",lineHeight:0 }}><NextIcon/></button>
          <button style={{ background:"none",border:"none",lineHeight:0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={R} strokeWidth="2" strokeLinecap="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div style={{ marginBottom:24 }}>
      <div style={{ padding:"0 16px 12px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <span style={{ fontSize:16,fontWeight:700,color:CR }}>{title}</span>
        <span style={{ fontSize:11,fontWeight:600,color:MU }}>Show all</span>
      </div>
      {children}
    </div>
  );
}

function HScroll({ children }) {
  return (
    <div style={{ display:"flex",gap:12,padding:"0 16px",overflowX:"auto",WebkitOverflowScrolling:"touch",scrollbarWidth:"none" }}>
      {children}
    </div>
  );
}

function TrackCard({ track, nowPlaying, play, isPlaying }) {
  const isP = nowPlaying?.id===track.id;
  return (
    <div onClick={()=>play(track)} style={{ flexShrink:0,width:140,cursor:"pointer" }}>
      <div style={{ position:"relative",marginBottom:8 }}>
        <Thumb title={track.title} size={140} radius={6}/>
        {isP && isPlaying && (
          <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.45)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center" }}>
            <div style={{ display:"flex",alignItems:"flex-end",gap:2 }}>
              {[10,18,12,18,10].map((h,i)=><div key={i} style={{ width:3,borderRadius:1,background:CR,height:h }}/>)}
            </div>
          </div>
        )}
        {!isP && (
          <div style={{ position:"absolute",bottom:8,right:8,width:36,height:36,borderRadius:"50%",background:CR,
            display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(0,0,0,0.5)",opacity:0,transition:"opacity 0.15s" }}
            onMouseEnter={e=>e.currentTarget.style.opacity=1}
            onMouseLeave={e=>e.currentTarget.style.opacity=0}>
            <PlayIcon/>
          </div>
        )}
      </div>
      <div style={{ fontSize:13,fontWeight:600,color:isP?R:CR,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2 }}>{track.title}</div>
      <div style={{ fontSize:11,color:MU }}>{track.cat} · {track.dur}</div>
    </div>
  );
}
