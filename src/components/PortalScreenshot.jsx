/* PortalScreenshot — self-contained phone mockup, all sizes in px
   Pass width prop (default 260). Everything scales from that.
   NO vw / % font sizes — those blow up on desktop */

const BG="#121212", BG3="#282828", BG4="#2a2a2a";
const R="#B76E79", P="#d4a090", CR="#ffffff", MU="#b3b3b3", DIM="#727272";
const OMBRE="linear-gradient(135deg,#f5e0a0 0%,#e8b870 22%,#d4a090 48%,#c4789a 72%,#B76E79 100%)";

const ART = {
  "Spoilt Goddess":           ["#c87890","#8a3060","♡"],
  "He Finds His Way Back":    ["#4060b0","#6080d0","✉"],
  "Money Finds Me First":     ["#306040","#50a070","✦"],
  "While I Sleep I Manifest": ["#483878","#6858a8","☽"],
  "Gorgeous Is My Default":   ["#b06840","#d4a060","◎"],
  "Lucky Girl Summer":        ["#808020","#c0c040","★"],
};

const RECENT = [
  "Spoilt Goddess","He Finds His Way Back","Money Finds Me First",
  "While I Sleep I Manifest","Gorgeous Is My Default","Lucky Girl Summer",
];

function T({ title, size, r=3 }) {
  const d = ART[title] || ["#483060","#604880","✦"];
  return (
    <div style={{ width:size, height:size, borderRadius:r, flexShrink:0,
      background:`linear-gradient(135deg,${d[0]},${d[1]})`,
      display:"flex", alignItems:"center", justifyContent:"center",
      overflow:"hidden" }}>
      <span style={{ fontSize:size*0.42, color:"rgba(255,255,255,0.55)", lineHeight:1, userSelect:"none" }}>{d[2]}</span>
    </div>
  );
}

export default function PortalScreenshot({ width=260 }) {
  // All sizes derived from width so it works at any size
  const h = Math.round(width * (844/390));
  const s = width / 390; // base scale

  // Type scale — all in px
  const f = {
    xs:  Math.max(6,  Math.round(9  * s)),
    sm:  Math.max(7,  Math.round(11 * s)),
    md:  Math.max(8,  Math.round(13 * s)),
    lg:  Math.max(10, Math.round(16 * s)),
    xl:  Math.max(11, Math.round(18 * s)),
  };

  const thumb = Math.round(46 * s);
  const thumbSm = Math.round(36 * s);
  const thumbCard = Math.round(80 * s);
  const gap = Math.round(6 * s);
  const pad = Math.round(14 * s);
  const r8 = Math.round(8 * s);
  const r14 = Math.round(14 * s);
  const r24 = Math.round(24 * s);

  return (
    <div style={{
      width, height: h, background: BG, borderRadius: r24,
      overflow: "hidden", fontFamily: "'Jost',sans-serif", color: CR,
      position: "relative", flexShrink: 0,
      boxShadow: `0 ${Math.round(24*s)}px ${Math.round(60*s)}px rgba(0,0,0,0.8), 0 0 0 ${Math.round(7*s)}px #1c1c1c, 0 0 0 ${Math.round(8*s)}px #2a2a2a`
    }}>

      {/* STATUS BAR */}
      <div style={{ height: Math.round(38*s), display:"flex", alignItems:"flex-end",
        justifyContent:"space-between", padding:`0 ${pad}px ${Math.round(6*s)}px` }}>
        <span style={{ fontSize: f.sm, fontWeight: 700 }}>9:41</span>
        <span style={{ fontSize: f.xs, color: CR }}>●● 100%</span>
      </div>

      {/* NOTCH */}
      <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)",
        width: Math.round(90*s), height: Math.round(26*s), background: BG,
        borderRadius:`0 0 ${Math.round(12*s)}px ${Math.round(12*s)}px`, zIndex:50 }}/>

      {/* GREETING HEADER */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:`${Math.round(6*s)}px ${pad}px ${Math.round(10*s)}px` }}>
        <span style={{ fontSize: f.lg, fontWeight: 700 }}>Good evening</span>
        <div style={{ width: Math.round(26*s), height: Math.round(26*s), borderRadius:"50%",
          background:`linear-gradient(135deg,${P},${R})`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize: f.xs, fontWeight: 800, color:"#000" }}>R</div>
      </div>

      {/* RECENTLY PLAYED — 2×3 grid */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap: Math.round(4*s),
        padding:`0 ${pad}px ${Math.round(12*s)}px` }}>
        {RECENT.map((title, i) => (
          <div key={i} style={{ background: BG3, borderRadius: Math.round(5*s),
            display:"flex", alignItems:"center", overflow:"hidden",
            height: thumb }}>
            <T title={title} size={thumb} r={0}/>
            <span style={{ fontSize: f.xs, fontWeight: 700,
              padding: `0 ${Math.round(6*s)}px`, lineHeight: 1.25,
              overflow:"hidden", display:"-webkit-box",
              WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>{title}</span>
          </div>
        ))}
      </div>

      {/* JUMP BACK IN */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
        padding:`0 ${pad}px ${Math.round(6*s)}px` }}>
        <span style={{ fontSize: f.md, fontWeight: 700 }}>Jump back in</span>
        <span style={{ fontSize: f.xs, color: MU }}>Show all</span>
      </div>
      <div style={{ display:"flex", gap: Math.round(8*s), padding:`0 ${pad}px ${Math.round(12*s)}px`,
        overflow:"hidden" }}>
        {["Spoilt Goddess","Money Finds Me First","Lucky Girl Summer"].map((title,i)=>(
          <div key={i} style={{ flexShrink:0 }}>
            <T title={title} size={thumbCard} r={Math.round(5*s)}/>
            <div style={{ fontSize: f.xs, fontWeight: 600, marginTop: Math.round(4*s),
              width: thumbCard, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{title}</div>
            <div style={{ fontSize: f.xs - 1, color: MU }}>Reshma Oracle</div>
          </div>
        ))}
      </div>

      {/* NOW PLAYING MINI BAR */}
      <div style={{ position:"absolute", bottom: Math.round(56*s)+2, left: Math.round(6*s),
        right: Math.round(6*s), background: BG4,
        borderRadius: Math.round(7*s), padding: `${Math.round(6*s)}px ${Math.round(8*s)}px`,
        display:"flex", alignItems:"center", gap: Math.round(8*s) }}>
        <T title="Spoilt Goddess" size={Math.round(36*s)} r={Math.round(3*s)}/>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize: f.sm, fontWeight: 600,
            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>Spoilt Goddess</div>
          <div style={{ fontSize: f.xs, color: MU }}>Reshma Oracle</div>
        </div>
        <span style={{ fontSize: f.md, color: R }}>♡</span>
        <div style={{ width: Math.round(28*s), height: Math.round(28*s), borderRadius:"50%",
          background: CR, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width={Math.round(12*s)} height={Math.round(12*s)} viewBox="0 0 24 24" fill={BG}>
            <rect x="6" y="4" width="4" height="16" rx="1.5"/>
            <rect x="14" y="4" width="4" height="16" rx="1.5"/>
          </svg>
        </div>
        {/* Ombre progress bar */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2,
          background:"#444", borderRadius:`0 0 ${Math.round(7*s)}px ${Math.round(7*s)}px` }}>
          <div style={{ width:"40%", height:"100%", background: OMBRE,
            backgroundSize:"200%", backgroundPosition:"left",
            borderRadius:`0 0 0 ${Math.round(7*s)}px` }}/>
        </div>
      </div>

      {/* BOTTOM 4-TAB NAV — Home | Search | Library | ProofOS */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0,
        height: Math.round(56*s), background:"#0a0a0a",
        borderTop:`0.5px solid #282828`, display:"flex", alignItems:"center" }}>
        {[
          { label:"Home", active:true, color:CR,
            icon:<svg width={Math.round(20*s)} height={Math.round(20*s)} viewBox="0 0 24 24">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" fill={CR}/>
            </svg> },
          { label:"Search", active:false, color:DIM,
            icon:<svg width={Math.round(20*s)} height={Math.round(20*s)} viewBox="0 0 24 24" fill="none" stroke={DIM} strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg> },
          { label:"Library", active:false, color:DIM,
            icon:<svg width={Math.round(20*s)} height={Math.round(20*s)} viewBox="0 0 24 24" fill={DIM}>
              <path d="M3 3h4v18H3zM9 3h2v18H9zM14 3l7 2.5v13L14 21z"/>
            </svg> },
          { label:"ProofOS", active:false, color:R,
            icon:<svg width={Math.round(20*s)} height={Math.round(20*s)} viewBox="0 0 24 24" fill="none" stroke={R} strokeWidth="1.8" strokeLinecap="round">
              <path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h9"/>
            </svg> },
        ].map((n,i)=>(
          <div key={i} style={{ flex:1, display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"center", gap: Math.round(2*s), paddingBottom: Math.round(4*s) }}>
            {n.icon}
            <span style={{ fontSize: f.xs, fontWeight: n.active?700:400, color: n.color }}>{n.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
