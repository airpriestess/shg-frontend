/* ProofWallScreenshot — static phone showing the ProofOS / Proof Wall tab
   Same scale system as PortalScreenshot — pure px, no vw */

const DARK  = { bg:"#121212", bg2:"#1a1a1a", bg3:"#282828", bg4:"#2a2a2a", cr:"#ffffff", mu:"#b3b3b3", dim:"#727272", nav:"#0a0a0a" };
const LIGHT = { bg:"#fdf0e8", bg2:"rgba(255,255,255,0.85)", bg3:"rgba(0,0,0,0.06)", bg4:"rgba(0,0,0,0.08)", cr:"#111111", mu:"#6a5048", dim:"#a08878", nav:"#fff" };

const R="#B76E79", P="#d4a090";
const OMBRE="linear-gradient(135deg,#f5e0a0 0%,#e8b870 22%,#d4a090 48%,#c4789a 72%,#B76E79 100%)";
const G_GREEN="linear-gradient(135deg,#1a3a1a,#0d2a0d)";

const THREADS = [
  { desire:"He texts me first — I feel it clearly", cat:"Love", catColor:"#c87890", catBg:"#2a0a14", days:14, done:true,  signs:3, track:"He Finds His Way Back" },
  { desire:"£5,000 arrives this month",             cat:"Money",catColor:"#50a070", catBg:"#0a1a0a", days:6,  done:false, signs:2, track:"Money Finds Me First"  },
  { desire:"My skin visibly glows",                 cat:"Appearance",catColor:"#d4a060",catBg:"#1a1208",days:3,done:false,signs:1, track:"Gorgeous Is My Default"},
];

export default function ProofWallScreenshot({ width=260, theme="dark" }) {
  const T = theme==="light" ? LIGHT : DARK;
  const h = Math.round(width * (844/390));
  const s = width / 390;

  const f = {
    xs:  Math.max(6,  Math.round(9  * s)),
    sm:  Math.max(7,  Math.round(11 * s)),
    md:  Math.max(8,  Math.round(13 * s)),
    lg:  Math.max(10, Math.round(16 * s)),
  };

  const pad  = Math.round(14 * s);
  const r8   = Math.round(8  * s);
  const r20  = Math.round(20 * s);
  const r24  = Math.round(24 * s);
  const gap  = Math.round(6  * s);

  return (
    <div style={{
      width, height: h, background: T.bg, borderRadius: r24,
      overflow:"hidden", fontFamily:"'Jost',sans-serif", color: T.cr,
      position:"relative", flexShrink:0,
      boxShadow:`0 ${Math.round(24*s)}px ${Math.round(60*s)}px rgba(0,0,0,0.8), 0 0 0 ${Math.round(7*s)}px #1c1c1c, 0 0 0 ${Math.round(8*s)}px #2a2a2a`
    }}>

      {/* STATUS BAR */}
      <div style={{ height:Math.round(38*s), display:"flex", alignItems:"flex-end",
        justifyContent:"space-between", padding:`0 ${pad}px ${Math.round(6*s)}px` }}>
        <span style={{ fontSize:f.sm, fontWeight:700, color:T.cr }}>9:41</span>
        <span style={{ fontSize:f.xs, color:T.cr }}>●● 100%</span>
      </div>

      {/* NOTCH */}
      <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)",
        width:Math.round(90*s), height:Math.round(26*s), background:T.bg,
        borderRadius:`0 0 ${Math.round(12*s)}px ${Math.round(12*s)}px`, zIndex:50 }}/>

      {/* HEADER */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:`${Math.round(6*s)}px ${pad}px ${Math.round(6*s)}px` }}>
        <div>
          <span style={{ fontSize:f.lg, fontWeight:700, color:T.cr }}>ProofOS </span>
          <span style={{ color:R }}>✦</span>
        </div>
        <div style={{ padding:`${Math.round(2*s)}px ${Math.round(8*s)}px`, background:OMBRE,
          borderRadius:r20, fontSize:f.xs, fontWeight:700, color:"#000",
          backgroundSize:"200%", backgroundPosition:"left" }}>+ New</div>
      </div>

      {/* STATS ROW */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:Math.round(4*s),
        padding:`0 ${pad}px ${Math.round(10*s)}px` }}>
        {[[3,"Desires",T.cr],[1,"Manifested",R],["14d","Streak",P]].map(([v,l,c],i)=>(
          <div key={i} style={{ background:T.bg3, borderRadius:r8, padding:`${Math.round(8*s)}px ${Math.round(4*s)}px`, textAlign:"center" }}>
            <div style={{ fontSize:f.lg, fontWeight:800, color:c }}>{v}</div>
            <div style={{ fontSize:f.xs-1, color:T.mu, fontWeight:600 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* IN PROGRESS LABEL */}
      <div style={{ padding:`0 ${pad}px ${Math.round(4*s)}px`,
        fontSize:f.xs, color:T.mu, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" }}>
        In progress
      </div>

      {/* THREAD CARDS */}
      {THREADS.filter(t=>!t.done).map((d,i)=>(
        <div key={i} style={{ margin:`0 ${pad}px ${Math.round(5*s)}px`, background:T.bg2,
          border:`0.5px solid ${T.bg3}`, borderRadius:r8, padding:`${Math.round(8*s)}px ${Math.round(10*s)}px` }}>
          <div style={{ display:"flex", alignItems:"center", gap:Math.round(5*s), marginBottom:Math.round(3*s) }}>
            <span style={{ fontSize:f.xs-1, padding:`${Math.round(1*s)}px ${Math.round(6*s)}px`,
              background:d.catBg, color:d.catColor, borderRadius:r20, fontWeight:700, letterSpacing:"0.08em" }}>{d.cat}</span>
            <span style={{ fontSize:f.xs-1, color:T.dim }}>Day {d.days}</span>
          </div>
          <div style={{ fontSize:f.sm, fontWeight:600, color:T.cr, lineHeight:1.3, marginBottom:Math.round(4*s) }}>{d.desire}</div>
          <div style={{ height:Math.round(2*s), background:T.bg3, borderRadius:1 }}>
            <div style={{ width:`${Math.min(d.signs*15,100)}%`, height:"100%", background:OMBRE,
              backgroundSize:"200%", backgroundPosition:"left", borderRadius:1 }}/>
          </div>
          <div style={{ fontSize:f.xs-1, color:T.dim, marginTop:Math.round(3*s) }}>{d.signs} signs · ♪ {d.track}</div>
        </div>
      ))}

      {/* PROOF WALL */}
      <div style={{ padding:`${Math.round(6*s)}px ${pad}px ${Math.round(4*s)}px`,
        fontSize:f.xs, color:"#5ab06a", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" }}>
        ✓ Proof Wall
      </div>

      {/* MANIFESTED GRID */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:Math.round(4*s),
        padding:`0 ${pad}px` }}>
        {THREADS.filter(t=>t.done).map((d,i)=>(
          <div key={i} style={{ background:"#0d1f0d", border:"0.5px solid #2a4a2a",
            borderRadius:r8, padding:`${Math.round(8*s)}px ${Math.round(8*s)}px` }}>
            <span style={{ fontSize:f.xs-1, padding:`1px ${Math.round(5*s)}px`,
              background:"#1a3a1a", color:"#5ab06a", borderRadius:r20, fontWeight:700 }}>✓ {d.cat}</span>
            <div style={{ fontSize:f.xs, fontWeight:600, color:"#c8e0c8", marginTop:Math.round(4*s), lineHeight:1.35 }}>{d.desire}</div>
            <div style={{ fontSize:f.xs-1, color:"#5ab06a", marginTop:Math.round(3*s) }}>{d.days}d · {d.signs} signs</div>
          </div>
        ))}
        {/* Placeholder empty proof card */}
        <div style={{ background:T.bg2, border:`0.5px dashed ${T.bg3}`,
          borderRadius:r8, padding:`${Math.round(8*s)}px`, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontSize:f.xs-1, color:T.dim, textAlign:"center", lineHeight:1.4 }}>Your next manifestation</span>
        </div>
      </div>

      {/* BOTTOM 4-TAB NAV */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:Math.round(56*s),
        background:T.nav, borderTop:`0.5px solid ${T.bg3}`, display:"flex", alignItems:"center" }}>
        {[
          { label:"Home",    active:false, color:DARK.dim,
            icon:<svg width={Math.round(20*s)} height={Math.round(20*s)} viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" fill={T.dim} stroke={T.dim} strokeWidth="0.5"/></svg> },
          { label:"Search",  active:false, color:T.dim,
            icon:<svg width={Math.round(20*s)} height={Math.round(20*s)} viewBox="0 0 24 24" fill="none" stroke={T.dim} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
          { label:"Library", active:false, color:T.dim,
            icon:<svg width={Math.round(20*s)} height={Math.round(20*s)} viewBox="0 0 24 24" fill={T.dim}><path d="M3 3h4v18H3zM9 3h2v18H9zM14 3l7 2.5v13L14 21z"/></svg> },
          { label:"ProofOS", active:true,  color:R,
            icon:<svg width={Math.round(20*s)} height={Math.round(20*s)} viewBox="0 0 24 24" fill="none" stroke={R} strokeWidth="1.8" strokeLinecap="round"><path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h9"/></svg> },
        ].map((n,i)=>(
          <div key={i} style={{ flex:1, display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"center", gap:Math.round(2*s), paddingBottom:Math.round(4*s) }}>
            {n.icon}
            <span style={{ fontSize:f.xs-1, fontWeight:n.active?700:400, color:n.color }}>{n.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
