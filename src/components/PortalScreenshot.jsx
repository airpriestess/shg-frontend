/* PortalScreenshot — static pixel-perfect phone mockup for the landing page
   Shows the Spotify-style SHG portal immediately after Lifetime Access section
   4-tab nav: Home | Search | Library | ProofOS
   All sizes scale with the container width */

const BG="#121212", BG2="#181818", BG3="#282828", BG4="#2a2a2a";
const R="#B76E79", P="#d4a090", CR="#ffffff", MU="#b3b3b3", DIM="#727272";
const PLAYER_BG = "linear-gradient(135deg,#f5e0a0 0%,#e8b870 22%,#d4a090 48%,#c4789a 72%,#B76E79 100%)";

const ART = {
  "Spoilt Goddess":           ["#c87890","#8a3060","♡"],
  "He Finds His Way Back":    ["#4060b0","#6080d0","✉"],
  "Money Finds Me First":     ["#306040","#50a070","✦"],
  "While I Sleep I Manifest": ["#483878","#6858a8","☽"],
  "Gorgeous Is My Default":   ["#b06840","#d4a060","◎"],
  "Lucky Girl Summer":        ["#808020","#c0c040","★"],
};

function Thumb({ title, s, r=4 }) {
  const d = ART[title] || ["#483060","#604880","✦"];
  return (
    <div style={{ width:s, height:s, borderRadius:r, flexShrink:0, overflow:"hidden",
      background:`linear-gradient(135deg,${d[0]},${d[1]})`,
      display:"flex", alignItems:"center", justifyContent:"center" }}>
      <span style={{ fontSize:s*0.38, color:"rgba(255,255,255,0.5)", lineHeight:1, userSelect:"none" }}>{d[2]}</span>
    </div>
  );
}

const RECENT = ["Spoilt Goddess","He Finds His Way Back","Money Finds Me First",
                "While I Sleep I Manifest","Gorgeous Is My Default","Lucky Girl Summer"];

export default function PortalScreenshot() {
  // Fills whatever container it's in
  return (
    <div style={{ position:"relative", width:"100%", maxWidth:320, margin:"0 auto", aspectRatio:"390/844",
      background:BG, borderRadius:38, overflow:"hidden", fontFamily:"'Jost',sans-serif", color:CR,
      boxShadow:"0 32px 80px rgba(0,0,0,0.7), 0 0 0 8px #1a1a1a, 0 0 0 9px #333" }}>

      {/* STATUS BAR */}
      <div style={{ height:"5.2%", display:"flex", alignItems:"flex-end", justifyContent:"space-between",
        padding:"0 5.5% 1.5%" }}>
        <span style={{ fontSize:"3.3vw", fontWeight:700, maxWidth:"none" }}>9:41</span>
        <div style={{ display:"flex", gap:"1.2%", alignItems:"center", fontSize:"2.8vw" }}>
          <span>●●</span><span>100%</span>
        </div>
      </div>

      {/* NOTCH */}
      <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)",
        width:"28%", height:"3.8%", background:BG, borderRadius:"0 0 14px 14px", zIndex:50 }}/>

      {/* HEADER */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"2% 4% 3%" }}>
        <span style={{ fontSize:"4.8vw", fontWeight:700 }}>Good evening</span>
        <div style={{ width:"8%", aspectRatio:"1/1", borderRadius:"50%",
          background:`linear-gradient(135deg,${P},${R})`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:"2.8vw", fontWeight:800, color:"#000" }}>R</div>
      </div>

      {/* 2×3 RECENTLY PLAYED GRID */}
      <div style={{ padding:"0 4% 4%", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"2%" }}>
        {RECENT.map((title,i)=>(
          <div key={i} style={{ background:BG3, borderRadius:"6px", display:"flex",
            alignItems:"center", overflow:"hidden", height:"12vw", maxHeight:50 }}>
            <Thumb title={title} s={50} r={0}/>
            <span style={{ fontSize:"2.5vw", fontWeight:700, padding:"0 2.5%", lineHeight:1.3,
              overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>{title}</span>
          </div>
        ))}
      </div>

      {/* JUMP BACK IN */}
      <div style={{ padding:"0 4% 1.5%", display:"flex", justifyContent:"space-between" }}>
        <span style={{ fontSize:"3.6vw", fontWeight:700 }}>Jump back in</span>
        <span style={{ fontSize:"2.5vw", color:MU }}>Show all</span>
      </div>
      <div style={{ display:"flex", gap:"3%", padding:"0 4% 4%", overflowX:"hidden" }}>
        {["Spoilt Goddess","Money Finds Me First","Lucky Girl Summer"].map((title,i)=>(
          <div key={i} style={{ flexShrink:0, width:"24%" }}>
            <Thumb title={title} s={72} r={6}/>
            <div style={{ fontSize:"2.4vw", fontWeight:600, marginTop:"4%",
              overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{title}</div>
            <div style={{ fontSize:"2.2vw", color:MU }}>Reshma Oracle</div>
          </div>
        ))}
      </div>

      {/* NOW-PLAYING MINI BAR */}
      <div style={{ position:"absolute", bottom:"8%", left:"2%", right:"2%",
        background:BG4, borderRadius:"8px", padding:"2% 2.5%",
        display:"flex", alignItems:"center", gap:"2.5%" }}>
        <Thumb title="Spoilt Goddess" s={42} r={4}/>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:"3vw", fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>Spoilt Goddess</div>
          <div style={{ fontSize:"2.5vw", color:MU }}>Reshma Oracle</div>
        </div>
        <span style={{ fontSize:"3.5vw", color:R }}>♡</span>
        <div style={{ width:"8%", aspectRatio:"1/1", borderRadius:"50%", background:CR,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="55%" height="55%" viewBox="0 0 24 24" fill={BG}>
            <rect x="6" y="4" width="4" height="16" rx="1.5"/>
            <rect x="14" y="4" width="4" height="16" rx="1.5"/>
          </svg>
        </div>
        {/* Ombre progress */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2,
          background:"#444", borderRadius:"0 0 8px 8px" }}>
          <div style={{ width:"42%", height:"100%", background:PLAYER_BG,
            borderRadius:"0 0 0 8px", backgroundSize:"200%", backgroundPosition:"left" }}/>
        </div>
      </div>

      {/* 4-TAB BOTTOM NAV — Home | Search | Library | ProofOS */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"8%",
        background:"#0a0a0a", borderTop:`0.5px solid ${BG3}`, display:"flex", alignItems:"center" }}>
        {[
          { label:"Home",    active:true,  color:CR,
            icon:<svg width="22" height="22" viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" fill={CR}/></svg> },
          { label:"Search",  active:false, color:DIM,
            icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={DIM} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
          { label:"Library", active:false, color:DIM,
            icon:<svg width="22" height="22" viewBox="0 0 24 24" fill={DIM}><path d="M3 3h4v18H3zM9 3h2v18H9zM14 3l7 2.5v13L14 21z"/></svg> },
          { label:"ProofOS", active:false, color:R,
            icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={R} strokeWidth="1.8" strokeLinecap="round"><path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h9"/></svg> },
        ].map((n,i)=>(
          <div key={i} style={{ flex:1, display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"center", gap:"3%", paddingBottom:"1%" }}>
            {n.icon}
            <span style={{ fontSize:"2.2vw", fontWeight:n.active?700:400, color:n.color }}>{n.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
