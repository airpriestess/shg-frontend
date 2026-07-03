import { useState, useRef, useEffect } from "react";

/* ── SPOTIFY-INSPIRED SHG PORTAL ─────────────────────────────────────────────
   Dark #121212 base · Rose gold #B76E79 accent · Jost clean bold for tracks
   Layout mirrors Spotify mobile exactly: bottom nav · home · library · proof · you
*/

const SP = "#121212";   // Spotify dark
const SP2 = "#1a1a1a";  // card bg
const SP3 = "#282828";  // elevated card
const R = "#B76E79";    // rose gold (our "Spotify green")
const P = "#d4a090";    // peach
const CR = "#f2ece4";   // cream
const MU = "#a0a0a0";   // muted (Spotify grey)
const DIM = "#636363";  // dim

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300;1,400&family=Jost:wght@300;400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{background:${SP};color:${CR};font-family:'Jost',sans-serif;overflow:hidden}
button{font-family:'Jost',sans-serif;cursor:pointer}
::-webkit-scrollbar{width:0}
.wm{font-family:'Cormorant Garamond',serif;font-style:italic}
.scrollable{overflow-y:auto;-webkit-overflow-scrolling:touch}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
@keyframes bar{0%,100%{height:4px}50%{height:14px}}
.bar span{display:inline-block;width:3px;background:${R};border-radius:2px;margin:0 1px;animation:bar 1s ease-in-out infinite}
.bar span:nth-child(1){animation-delay:0s}
.bar span:nth-child(2){animation-delay:.15s}
.bar span:nth-child(3){animation-delay:.3s}
.bar span:nth-child(4){animation-delay:.15s}
.fade{animation:fadeIn .2s ease}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
`;

// ── MOCK DATA ──────────────────────────────────────────────────────────────────
const TRACKS = [
  { id:1, title:"Spoilt Goddess", artist:"Reshma Oracle", dur:"4:32", cat:"Identity", color:"#c87890", isNew:true, tier:"audio" },
  { id:2, title:"He Finds His Way Back", artist:"Reshma Oracle", dur:"30:00", cat:"SP & Love", color:"#7890c8", tier:"audio" },
  { id:3, title:"Money Finds Me First", artist:"Reshma Oracle", dur:"25:00", cat:"Money", color:"#78c890", tier:"audio", isNew:true },
  { id:4, title:"Gorgeous Is My Default", artist:"Reshma Oracle", dur:"35:00", cat:"Beauty", color:"#c8a078", tier:"audio" },
  { id:5, title:"While I Sleep I Manifest", artist:"Reshma Oracle", dur:"60:00", cat:"Sleep", color:"#9078c8", tier:"audio" },
  { id:6, title:"DNA Activation Ceremony", artist:"Reshma Oracle", dur:"45:00", cat:"DNA", color:"#c87890", tier:"goddess" },
  { id:7, title:"Lucky Girl Summer", artist:"Reshma Oracle", dur:"22:00", cat:"Money", color:"#78c890", tier:"audio", isNew:true },
  { id:8, title:"Highest Timeline Activated", artist:"Reshma Oracle", dur:"32:00", cat:"Identity", color:"#c8a078", tier:"goddess" },
];

const RECENTLY_PLAYED = [
  { title:"Spoilt Goddess", color:"#c87890" },
  { title:"He Finds His Way Back", color:"#7890c8" },
  { title:"Money Finds Me", color:"#78c890" },
  { title:"Sleep Manifest", color:"#9078c8" },
  { title:"Lucky Girl", color:"#c8d478" },
  { title:"DNA Activation", color:"#c87890" },
];

const PROOF_THREADS = [
  { id:1, desire:"He texts me first", days:14, done:true, signs:3, track:"He Finds His Way Back" },
  { id:2, desire:"£5,000 arrives", days:6, done:false, signs:2, track:"Money Finds Me First" },
  { id:3, desire:"Skin visibly glowing", days:3, done:false, signs:1, track:"Gorgeous Is My Default" },
];

// ── ALBUM ART (gradient squares) ───────────────────────────────────────────────
function Art({ color, size=48, radius=6, children }) {
  return (
    <div style={{ width:size, height:size, borderRadius:radius, flexShrink:0,
      background:`linear-gradient(135deg,${color}cc,${color}66)`,
      display:"flex", alignItems:"center", justifyContent:"center",
      boxShadow:`0 4px 16px ${color}40`, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.2)" }}/>
      {children || <span style={{ fontSize:size*0.35, position:"relative", zIndex:1 }}>✦</span>}
    </div>
  );
}

// ── SVG ICONS (Spotify-style) ──────────────────────────────────────────────────
const Icon = {
  Home: ({active}) => <svg width="24" height="24" viewBox="0 0 24 24" fill={active?CR:DIM}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"/></svg>,
  Search: ({active}) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active?CR:DIM} strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Library: ({active}) => <svg width="24" height="24" viewBox="0 0 24 24" fill={active?CR:DIM}><path d="M3 3h4v18H3zM9 3h2v18H9zM14 3l7 2.5v13L14 21z"/></svg>,
  Proof: ({active}) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active?R:DIM} strokeWidth="2" strokeLinecap="round"><path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h9"/></svg>,
  You: ({active}) => <svg width="24" height="24" viewBox="0 0 24 24" fill={active?CR:DIM}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
  Play: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="#000"><polygon points="7,3 21,12 7,21"/></svg>,
  Pause: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="#000"><rect x="6" y="4" width="4" height="16" rx="1.5"/><rect x="14" y="4" width="4" height="16" rx="1.5"/></svg>,
  Prev: () => <svg width="22" height="22" viewBox="0 0 24 24" fill={CR}><path d="M19 20L9 12l10-8v16z"/><rect x="5" y="4" width="2.5" height="16" rx="1" fill={CR}/></svg>,
  Next: () => <svg width="22" height="22" viewBox="0 0 24 24" fill={CR}><path d="M5 4l10 8-10 8V4z"/><rect x="16.5" y="4" width="2.5" height="16" rx="1" fill={CR}/></svg>,
  Shuffle: ({on}) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={on?R:DIM} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg>,
  Repeat: ({on}) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={on?R:DIM} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>,
  Heart: ({on}) => <svg width="18" height="18" viewBox="0 0 24 24" fill={on?R:"none"} stroke={on?R:DIM} strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  Chevron: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={DIM} strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
  Plus: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={CR} strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
};

export default function SpotifyPortal({ onSignOut, userTier = "goddess" }) {
  const [tab, setTab] = useState("home");
  const [playing, setPlaying] = useState(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [liked, setLiked] = useState(new Set([1,3]));
  const [expanded, setExpanded] = useState(false); // full player

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ width:"100%", maxWidth:430, margin:"0 auto", height:"100vh", background:SP, display:"flex", flexDirection:"column", position:"relative", overflow:"hidden" }}>
      <style>{css}</style>

      {/* STATUS BAR */}
      <div style={{ height:44, display:"flex", alignItems:"flex-end", justifyContent:"space-between", padding:"0 20px 6px", flexShrink:0 }}>
        <span style={{ fontSize:13, fontWeight:700, color:CR }}>9:41</span>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          {["●●●","WiFi","82%"].map((t,i)=><span key={i} style={{ fontSize:11, color:CR }}>{t}</span>)}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="scrollable" style={{ flex:1, overflowY:"auto", paddingBottom: 140 }}>
        {tab==="home"  && <HomeTab greeting={greeting} playing={playing} setPlaying={setPlaying} setIsPlaying={setIsPlaying} liked={liked} setLiked={setLiked}/>}
        {tab==="library" && <LibraryTab playing={playing} setPlaying={setPlaying} setIsPlaying={setIsPlaying} liked={liked} setLiked={setLiked}/>}
        {tab==="proof" && <ProofTab/>}
        {tab==="you"   && <YouTab/>}
      </div>

      {/* NOW PLAYING BAR */}
      {playing && !expanded && (
        <div onClick={()=>setExpanded(true)} style={{
          position:"absolute", bottom:68, left:8, right:8,
          background:"#242424", borderRadius:10,
          padding:"10px 14px 10px 10px",
          display:"flex", alignItems:"center", gap:12,
          boxShadow:`0 8px 32px rgba(0,0,0,0.6)`,
          cursor:"pointer", zIndex:50
        }}>
          <Art color={playing.color} size={44} radius={4}/>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:600, color:CR, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{playing.title}</div>
            <div style={{ fontSize:12, color:MU }}>{playing.artist}</div>
          </div>
          <button onClick={e=>{e.stopPropagation();setLiked(s=>{const n=new Set(s);n.has(playing.id)?n.delete(playing.id):n.add(playing.id);return n;})}} style={{ background:"none", border:"none", padding:6 }}>
            <Icon.Heart on={liked.has(playing.id)}/>
          </button>
          <button onClick={e=>{e.stopPropagation();setIsPlaying(p=>!p);}} style={{ width:36, height:36, borderRadius:"50%", background:CR, border:"none", display:"flex", alignItems:"center", justifyContent:"center" }}>
            {isPlaying ? <Icon.Pause/> : <Icon.Play/>}
          </button>
          {/* mini progress bar at bottom */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:"#444", borderRadius:"0 0 10px 10px" }}>
            <div style={{ width:"38%", height:"100%", background:CR, borderRadius:"0 0 0 10px" }}/>
          </div>
        </div>
      )}

      {/* FULL PLAYER (expanded) */}
      {expanded && <FullPlayer track={playing} isPlaying={isPlaying} setIsPlaying={setIsPlaying} liked={liked} setLiked={setLiked} onClose={()=>setExpanded(false)} onNext={()=>{const i=TRACKS.findIndex(t=>t.id===playing.id);setPlaying(TRACKS[(i+1)%TRACKS.length]);}} onPrev={()=>{const i=TRACKS.findIndex(t=>t.id===playing.id);setPlaying(TRACKS[(i-1+TRACKS.length)%TRACKS.length]);}}/>}

      {/* BOTTOM NAV */}
      {!expanded && (
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:68, background:"#0a0a0a", borderTop:"0.5px solid #2a2a2a", display:"flex", zIndex:60 }}>
          {[
            { id:"home",    label:"Home",    Icon:Icon.Home },
            { id:"library", label:"Library", Icon:Icon.Library },
            { id:"proof",   label:"ProofOS", Icon:Icon.Proof },
            { id:"you",     label:"You",     Icon:Icon.You },
          ].map(n => (
            <button key={n.id} onClick={()=>setTab(n.id)} style={{ flex:1, background:"none", border:"none", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4, paddingBottom:6 }}>
              <n.Icon active={tab===n.id}/>
              <span style={{ fontSize:10, fontWeight:600, color:tab===n.id?(n.id==="proof"?R:CR):DIM, letterSpacing:"0.06em" }}>{n.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── HOME TAB ────────────────────────────────────────────────────────────────────
function HomeTab({ greeting, playing, setPlaying, setIsPlaying, liked, setLiked }) {
  return (
    <div className="fade">
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 16px 8px" }}>
        <div>
          <div style={{ fontSize:22, fontWeight:800, color:CR }}>{greeting}, Goddess</div>
        </div>
        <div style={{ width:34, height:34, borderRadius:"50%", background:`linear-gradient(135deg,${P},${R})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontSize:14, color:"#000", fontWeight:700 }}>R</span>
        </div>
      </div>

      {/* Recently played grid — exactly like Spotify */}
      <div style={{ padding:"8px 16px 20px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {RECENTLY_PLAYED.map((t,i) => (
            <div key={i} style={{ background:SP3, borderRadius:6, display:"flex", alignItems:"center", gap:10, overflow:"hidden", cursor:"pointer" }}
              onClick={()=>{setPlaying(TRACKS[i]||TRACKS[0]);setIsPlaying(true);}}>
              <div style={{ width:52, height:52, background:`linear-gradient(135deg,${t.color}cc,${t.color}66)`, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:20 }}>✦</span>
              </div>
              <span style={{ fontSize:12, fontWeight:700, color:CR, lineHeight:1.3 }}>{t.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured — big card like Spotify "Jump back in" */}
      <SectionHeader title="Jump back in"/>
      <div style={{ display:"flex", gap:12, padding:"0 16px 24px", overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
        {TRACKS.slice(0,5).map(t => (
          <TrackCard key={t.id} track={t} playing={playing} setPlaying={setPlaying} setIsPlaying={setIsPlaying} liked={liked} setLiked={setLiked}/>
        ))}
      </div>

      {/* New releases */}
      <SectionHeader title="New this week" linkText="Show all"/>
      <div style={{ display:"flex", gap:12, padding:"0 16px 24px", overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
        {TRACKS.filter(t=>t.isNew).map(t => (
          <TrackCard key={t.id} track={t} playing={playing} setPlaying={setPlaying} setIsPlaying={setIsPlaying} liked={liked} setLiked={setLiked}/>
        ))}
      </div>

      {/* Category chips */}
      <SectionHeader title="Browse by desire"/>
      <div style={{ display:"flex", gap:8, padding:"0 16px 24px", overflowX:"auto", WebkitOverflowScrolling:"touch" }}>
        {["SP & Love","Money","Beauty","Sleep","DNA","Identity"].map((cat,i) => {
          const colors = ["#7890c8","#78c890","#c8a078","#9078c8","#c87890","#c8d478"];
          return (
            <div key={cat} style={{ flexShrink:0, background:`linear-gradient(135deg,${colors[i]}cc,${colors[i]}44)`, borderRadius:8, padding:"38px 16px 10px", width:120, position:"relative", cursor:"pointer" }}>
              <span style={{ fontSize:12, fontWeight:700, color:CR }}>{cat}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── LIBRARY TAB ─────────────────────────────────────────────────────────────────
function LibraryTab({ playing, setPlaying, setIsPlaying, liked, setLiked }) {
  const [filter, setFilter] = useState("all");
  const filters = ["all","sp_love","money","beauty","sleep"];
  const labels  = ["All","SP & Love","Money","Beauty","Sleep"];

  return (
    <div className="fade">
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 16px 12px" }}>
        <span style={{ fontSize:22, fontWeight:800, color:CR }}>Your Library</span>
        <div style={{ display:"flex", gap:12 }}>
          <button style={{ background:"none", border:"none", lineHeight:0 }}><Icon.Plus/></button>
        </div>
      </div>

      {/* Filter chips — Spotify style */}
      <div style={{ display:"flex", gap:8, padding:"0 16px 16px", overflowX:"auto" }}>
        {filters.map((f,i) => (
          <button key={f} onClick={()=>setFilter(f)} style={{ flexShrink:0, padding:"7px 14px", borderRadius:20, background:filter===f?CR:SP3, border:"none", color:filter===f?"#000":CR, fontSize:12, fontWeight:600 }}>{labels[i]}</button>
        ))}
      </div>

      {/* Track list — Spotify list style */}
      <div style={{ padding:"0 16px" }}>
        {TRACKS.map(t => (
          <div key={t.id} onClick={()=>{setPlaying(t);setIsPlaying(true);}}
            style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 0", borderBottom:"0.5px solid #1e1e1e", cursor:"pointer" }}>
            <div style={{ position:"relative" }}>
              <Art color={t.color} size={52} radius={4}/>
              {playing?.id===t.id && (
                <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.5)", borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <div className="bar"><span/><span/><span/><span/></div>
                </div>
              )}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:14, fontWeight:600, color:playing?.id===t.id?R:CR, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:2 }}>
                {t.title}
                {t.isNew && <span style={{ marginLeft:8, fontSize:9, background:`${R}33`, color:R, padding:"1px 6px", borderRadius:10, fontWeight:700, verticalAlign:"middle" }}>NEW</span>}
              </div>
              <div style={{ fontSize:12, color:MU }}>
                {t.tier==="goddess"&&<span style={{ color:R, fontWeight:700, marginRight:4 }}>✦ </span>}{t.artist} · {t.cat} · {t.dur}
              </div>
            </div>
            <button onClick={e=>{e.stopPropagation();setLiked(s=>{const n=new Set(s);n.has(t.id)?n.delete(t.id):n.add(t.id);return n;});}} style={{ background:"none", border:"none", padding:8, lineHeight:0 }}>
              <Icon.Heart on={liked.has(t.id)}/>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PROOFOS TAB ─────────────────────────────────────────────────────────────────
function ProofTab() {
  const [showAdd, setShowAdd] = useState(false);
  const [threads, setThreads] = useState(PROOF_THREADS);
  const [newD, setNewD] = useState("");
  const manifested = threads.filter(t=>t.done).length;

  return (
    <div className="fade">
      <div style={{ padding:"16px 16px 0" }}>
        <div style={{ fontSize:22, fontWeight:800, color:CR, marginBottom:2 }}>ProofOS</div>
        <div style={{ fontSize:13, color:MU, marginBottom:16 }}>Your manifestation ledger</div>

        {/* Stats row */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:20 }}>
          {[{v:threads.length,l:"Desires",c:CR},{v:manifested,l:"Manifested",c:R},{v:"14d",l:"Streak",c:P}].map((s,i)=>(
            <div key={i} style={{ background:SP3, borderRadius:10, padding:"14px 10px", textAlign:"center" }}>
              <div style={{ fontSize:22, fontWeight:800, color:s.c }}>{s.v}</div>
              <div style={{ fontSize:10, color:MU, fontWeight:600, letterSpacing:"0.08em" }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Add thread button */}
        <button onClick={()=>setShowAdd(!showAdd)} style={{ width:"100%", padding:"12px", background:SP3, border:`1px solid ${R}44`, borderRadius:10, color:CR, fontSize:13, fontWeight:600, marginBottom:16, display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          <Icon.Plus/> New Proof Thread
        </button>

        {showAdd && (
          <div style={{ background:SP3, borderRadius:10, padding:14, marginBottom:16 }}>
            <input value={newD} onChange={e=>setNewD(e.target.value)} placeholder="State your desire..."
              style={{ width:"100%", background:"#333", border:"none", color:CR, borderRadius:8, padding:"10px 12px", fontSize:13, marginBottom:10, outline:"none" }}/>
            <button onClick={()=>{if(!newD.trim())return;setThreads([{id:Date.now(),desire:newD,days:0,done:false,signs:0,track:null},...threads]);setNewD("");setShowAdd(false);}}
              style={{ padding:"9px 20px", background:`linear-gradient(135deg,${P},${R})`, border:"none", borderRadius:8, color:"#000", fontSize:12, fontWeight:700 }}>Add Thread</button>
          </div>
        )}

        {/* Threads */}
        {threads.map(d => (
          <div key={d.id} style={{ background:SP2, border:`0.5px solid ${d.done?"#2a4a2a":"#2a2a2a"}`, borderRadius:12, padding:"14px 16px", marginBottom:10 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:600, color:CR, marginBottom:4 }}>{d.desire}</div>
                {d.track && <div style={{ fontSize:11, color:MU }}>Listening: {d.track}</div>}
                <div style={{ fontSize:11, color:MU, marginTop:2 }}>{d.days>0?`${d.days} days · `:""}{d.signs} sign{d.signs!==1?"s":""} logged</div>
              </div>
              {d.done
                ? <span style={{ fontSize:11, padding:"4px 10px", background:"#1a3a1a", color:"#5ab06a", borderRadius:20, fontWeight:700, flexShrink:0 }}>✓ done</span>
                : <button onClick={()=>setThreads(threads.map(x=>x.id===d.id?{...x,done:true}:x))}
                    style={{ fontSize:11, padding:"4px 10px", background:"none", border:`1px solid ${R}55`, borderRadius:20, color:R, fontWeight:700, flexShrink:0, cursor:"pointer" }}>mark ✓</button>
              }
            </div>
            {/* mini progress */}
            <div style={{ marginTop:10, height:2, background:"#333", borderRadius:1 }}>
              <div style={{ width:`${Math.min(d.days*4,100)}%`, height:"100%", background:`linear-gradient(90deg,${P},${R})`, borderRadius:1 }}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── YOU TAB ─────────────────────────────────────────────────────────────────────
function YouTab() {
  return (
    <div className="fade" style={{ padding:"16px" }}>
      <div style={{ fontSize:22, fontWeight:800, color:CR, marginBottom:20 }}>You</div>

      {/* Profile card */}
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24 }}>
        <div style={{ width:60, height:60, borderRadius:"50%", background:`linear-gradient(135deg,${P},${R})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:700, color:"#000" }}>R</div>
        <div>
          <div style={{ fontSize:16, fontWeight:700, color:CR }}>Reshma Oracle</div>
          <div style={{ fontSize:12, color:R, fontWeight:600 }}>Goddess Tier ✦</div>
        </div>
      </div>

      {[
        { label:"Account & subscription", sub:"Goddess · £33/month", icon:"💳" },
        { label:"Listening history", sub:"47 sessions this month", icon:"📊" },
        { label:"Download for offline", sub:"Save audios for flights", icon:"⬇" },
        { label:"Sleep timer", sub:"Set to 60 minutes", icon:"🌙" },
        { label:"Help & support", sub:"FAQs and contact", icon:"?" },
      ].map((r,i)=>(
        <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 0", borderBottom:"0.5px solid #1e1e1e", cursor:"pointer" }}>
          <div style={{ width:40, height:40, borderRadius:8, background:SP3, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{r.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:600, color:CR }}>{r.label}</div>
            <div style={{ fontSize:12, color:MU }}>{r.sub}</div>
          </div>
          <Icon.Chevron/>
        </div>
      ))}

      <button onClick={onSignOut} style={{ width:"100%", marginTop:24, padding:14, background:"none", border:"0.5px solid #333", borderRadius:10, color:MU, fontSize:14, fontWeight:500, cursor:"pointer" }}>Sign out</button>
    </div>
  );
}

// ── FULL PLAYER ──────────────────────────────────────────────────────────────────
function FullPlayer({ track, isPlaying, setIsPlaying, liked, setLiked, onClose, onNext, onPrev }) {
  const [prog, setProg] = useState(38);

  return (
    <div style={{ position:"absolute", inset:0, background:`linear-gradient(180deg,${track.color}44 0%,${SP} 35%)`, zIndex:200, display:"flex", flexDirection:"column", padding:"0 28px" }} className="fade">
      {/* Drag handle */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingTop:52, marginBottom:32 }}>
        <button onClick={onClose} style={{ background:"none", border:"none", lineHeight:0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={CR} strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:11, fontWeight:700, color:CR, letterSpacing:"0.18em", textTransform:"uppercase" }}>Now Playing</div>
        </div>
        <button style={{ background:"none", border:"none", lineHeight:0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={CR} strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
        </button>
      </div>

      {/* BIG album art */}
      <div style={{ margin:"0 auto 32px", width:280, height:280, borderRadius:16,
        background:`linear-gradient(135deg,${track.color}cc,${track.color}55)`,
        display:"flex", alignItems:"center", justifyContent:"center",
        boxShadow:`0 24px 80px ${track.color}55` }}>
        <span style={{ fontSize:80 }}>✦</span>
      </div>

      {/* Track info + heart */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:24 }}>
        <div>
          <div style={{ fontSize:22, fontWeight:800, color:CR, marginBottom:4 }}>{track.title}</div>
          <div style={{ fontSize:14, color:MU }}>{track.artist}</div>
        </div>
        <button onClick={()=>setLiked(s=>{const n=new Set(s);n.has(track.id)?n.delete(track.id):n.add(track.id);return n;})} style={{ background:"none", border:"none", lineHeight:0 }}>
          <Icon.Heart on={liked.has(track.id)}/>
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom:8 }}>
        <div style={{ height:4, background:"#4a4a4a", borderRadius:2, position:"relative", cursor:"pointer" }}
          onClick={e=>{const r=e.target.getBoundingClientRect();setProg(Math.round(((e.clientX-r.left)/r.width)*100));}}>
          <div style={{ width:`${prog}%`, height:"100%", background:CR, borderRadius:2 }}>
            <div style={{ position:"absolute", right:-5, top:"50%", transform:"translateY(-50%)", width:12, height:12, borderRadius:"50%", background:CR }}/>
          </div>
        </div>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:28 }}>
        <span style={{ fontSize:11, color:MU }}>1:24</span>
        <span style={{ fontSize:11, color:MU }}>{track.dur}</span>
      </div>

      {/* Controls */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <button style={{ background:"none", border:"none", lineHeight:0 }}><Icon.Shuffle on/></button>
        <button onClick={onPrev} style={{ background:"none", border:"none", lineHeight:0 }}><Icon.Prev/></button>
        <button onClick={()=>setIsPlaying(p=>!p)} style={{ width:64, height:64, borderRadius:"50%", background:CR, border:"none", display:"flex", alignItems:"center", justifyContent:"center" }}>
          {isPlaying ? <Icon.Pause/> : <Icon.Play/>}
        </button>
        <button onClick={onNext} style={{ background:"none", border:"none", lineHeight:0 }}><Icon.Next/></button>
        <button style={{ background:"none", border:"none", lineHeight:0 }}><Icon.Repeat on/></button>
      </div>
    </div>
  );
}

// ── TRACK CARD (horizontal scroll) ───────────────────────────────────────────────
function TrackCard({ track, playing, setPlaying, setIsPlaying }) {
  const isP = playing?.id===track.id;
  return (
    <div onClick={()=>{setPlaying(track);setIsPlaying(true);}} style={{ flexShrink:0, width:140, cursor:"pointer" }}>
      <div style={{ position:"relative", marginBottom:8 }}>
        <Art color={track.color} size={140} radius={6}/>
        {isP && (
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.4)", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div className="bar"><span/><span/><span/><span/></div>
          </div>
        )}
        {!isP && (
          <div style={{ position:"absolute", bottom:8, right:8, width:36, height:36, borderRadius:"50%", background:CR, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 16px rgba(0,0,0,0.5)", opacity:0, transition:"opacity 0.2s" }}
            onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=0}>
            <Icon.Play/>
          </div>
        )}
      </div>
      <div style={{ fontSize:13, fontWeight:600, color:isP?R:CR, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginBottom:2 }}>{track.title}</div>
      <div style={{ fontSize:11, color:MU, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{track.cat} · {track.dur}</div>
    </div>
  );
}

function SectionHeader({ title, linkText }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 16px 12px" }}>
      <span style={{ fontSize:16, fontWeight:800, color:CR }}>{title}</span>
      {linkText && <span style={{ fontSize:12, fontWeight:600, color:MU }}>{linkText}</span>}
    </div>
  );
}
