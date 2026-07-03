// Pixel-perfect static Spotify-layout screenshot for the landing page

const BG="#121212", BG2="#181818", BG3="#282828", R="#B76E79", P="#d4a090", CR="#ffffff", MU="#b3b3b3", DIM="#727272";

const THUMBS = {
  "Spoilt Goddess":           ["#c87890","#8a3060","♡"],
  "He Finds His Way Back":    ["#4060b0","#8090d0","✉"],
  "Money Finds Me First":     ["#306040","#60a870","✦"],
  "While I Sleep I Manifest": ["#483878","#7060a8","☽"],
  "Gorgeous Is My Default":   ["#b06840","#d4a060","◎"],
  "Lucky Girl Summer":        ["#a0b030","#d4d060","★"],
};

function T({ title, size=48, r=4 }) {
  const d = THUMBS[title] || ["#483060","#604880","✦"];
  return (
    <div style={{ width:size,height:size,borderRadius:r,flexShrink:0,overflow:"hidden",
      background:`linear-gradient(135deg,${d[0]},${d[1]})`,position:"relative",display:"flex",alignItems:"center",justifyContent:"center" }}>
      <span style={{ fontSize:size*0.38,color:"rgba(255,255,255,0.5)",lineHeight:1 }}>{d[2]}</span>
    </div>
  );
}

const RECENT = ["Spoilt Goddess","He Finds His Way Back","Money Finds Me First","While I Sleep I Manifest","Gorgeous Is My Default","Lucky Girl Summer"];

export default function PortalScreenshot({ width=390 }) {
  const h = Math.round(width*2.16);
  const s = width/390; // scale factor for text

  return (
    <div style={{ width,height:h,background:BG,borderRadius:44,overflow:"hidden",fontFamily:"'Jost',sans-serif",position:"relative",color:CR }}>

      {/* Status bar */}
      <div style={{ height:44,display:"flex",alignItems:"flex-end",justifyContent:"space-between",padding:`0 ${22*s}px ${7*s}px`,background:BG }}>
        <span style={{ fontSize:13*s,fontWeight:700 }}>9:41</span>
        <div style={{ display:"flex",gap:5*s,alignItems:"center" }}>
          <span style={{ fontSize:11*s,color:CR }}>●●●</span>
          <span style={{ fontSize:11*s,color:CR }}>100%</span>
        </div>
      </div>

      {/* Notch */}
      <div style={{ position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:110*s,height:32*s,background:BG,borderRadius:`0 0 ${18*s}px ${18*s}px`,zIndex:50 }}/>

      {/* Header */}
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:`${12*s}px ${16*s}px ${14*s}px` }}>
        <span style={{ fontSize:20*s,fontWeight:700 }}>Good evening</span>
        <div style={{ width:30*s,height:30*s,borderRadius:"50%",background:`linear-gradient(135deg,${P},${R})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12*s,fontWeight:800,color:"#000" }}>R</div>
      </div>

      {/* Recently played 2×3 grid */}
      <div style={{ padding:`0 ${16*s}px ${20*s}px`,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8*s }}>
        {RECENT.map((title,i)=>(
          <div key={i} style={{ background:BG3,borderRadius:6*s,display:"flex",alignItems:"center",gap:0,overflow:"hidden",height:48*s }}>
            <T title={title} size={48*s} r={0}/>
            <span style={{ fontSize:11*s,fontWeight:700,color:CR,padding:`0 ${8*s}px`,lineHeight:1.25,overflow:"hidden",
              display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical" }}>{title}</span>
          </div>
        ))}
      </div>

      {/* Jump back in */}
      <div style={{ padding:`0 ${16*s}px ${8*s}px`,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <span style={{ fontSize:15*s,fontWeight:700 }}>Jump back in</span>
        <span style={{ fontSize:10*s,color:MU }}>Show all</span>
      </div>
      <div style={{ display:"flex",gap:12*s,padding:`0 ${16*s}px ${20*s}px`,overflow:"hidden" }}>
        {["Spoilt Goddess","Money Finds Me First","DNA Activation Ceremony"].map((title,i)=>(
          <div key={i} style={{ flexShrink:0,width:100*s }}>
            <T title={title} size={100*s} r={6*s}/>
            <div style={{ fontSize:11*s,fontWeight:600,color:CR,marginTop:6*s,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{title}</div>
            <div style={{ fontSize:10*s,color:MU }}>Reshma Oracle</div>
          </div>
        ))}
      </div>

      {/* Now playing bar */}
      <div style={{ position:"absolute",bottom:64*s,left:8*s,right:8*s,background:"#2a2a2a",borderRadius:8*s,
        padding:`${8*s}px ${10*s}px`,display:"flex",alignItems:"center",gap:10*s }}>
        <T title="Spoilt Goddess" size={42*s} r={4*s}/>
        <div style={{ flex:1,minWidth:0 }}>
          <div style={{ fontSize:13*s,fontWeight:600,color:CR,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>Spoilt Goddess</div>
          <div style={{ fontSize:11*s,color:MU }}>Reshma Oracle</div>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:10*s }}>
          <span style={{ fontSize:14*s,color:R }}>♡</span>
          <div style={{ width:32*s,height:32*s,borderRadius:"50%",background:CR,display:"flex",alignItems:"center",justifyContent:"center" }}>
            <svg width={14*s} height={14*s} viewBox="0 0 24 24" fill="#000"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
          </div>
        </div>
        {/* Progress */}
        <div style={{ position:"absolute",bottom:0,left:0,right:0,height:2*s,background:"#444",borderRadius:`0 0 ${8*s}px ${8*s}px` }}>
          <div style={{ width:"42%",height:"100%",background:CR,borderRadius:`0 0 0 ${8*s}px` }}/>
        </div>
      </div>

      {/* Bottom nav — Home | Search | Library */}
      <div style={{ position:"absolute",bottom:0,left:0,right:0,height:64*s,background:"#0a0a0a",
        borderTop:`0.5px solid #282828`,display:"flex" }}>
        {[
          { label:"Home", active:true, icon:<svg width={24*s} height={24*s} viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" fill={CR}/></svg> },
          { label:"Search", active:false, icon:<svg width={24*s} height={24*s} viewBox="0 0 24 24" fill="none" stroke={DIM} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
          { label:"Library", active:false, icon:<svg width={24*s} height={24*s} viewBox="0 0 24 24" fill={DIM}><path d="M3 3h4v18H3zM9 3h2v18H9zM14 3l7 2.5v13L14 21z"/></svg> },
        ].map((n,i)=>(
          <div key={i} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3*s,paddingBottom:6*s }}>
            {n.icon}
            <span style={{ fontSize:10*s,fontWeight:n.active?700:400,color:n.active?CR:DIM }}>{n.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
