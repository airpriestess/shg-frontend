/* ProofWallScreenshot — phone showing ProofOS tracker */

const DARK  = { bg:"#000000", bg2:"#111111", bg3:"rgba(44,183,167,0.10)", cr:"#C8960A", mu:"#c8a870", dim:"#8a7050", nav:"rgba(0,0,0,0.97)" };
const LIGHT = { bg:"#fdf8f2", bg2:"#ffffff", bg3:"rgba(44,183,167,0.10)", cr:"#1a1008", mu:"#8a6840", dim:"#b89060", nav:"rgba(253,248,242,0.97)" };
const R="#C8960A", P="#c9963a";
const OMBRE="linear-gradient(135deg,#fce4c0 0%,#C8960A 50%,#c9963a 100%)";

const THREADS = [
  { desire:"He texts me first", cat:"Lovemaxxing", catColor:"#d4789a", catBg:"rgba(212,120,154,0.12)", days:14, done:true, signs:3, track:"He Finds His Way Back" },
  { desire:"£1,800 received. Paid by client.", cat:"Moneymaxxing", catColor:"#C8960A", catBg:"rgba(44,183,167,0.12)", days:6, done:false, signs:2, track:"Money Finds Me First" },
  { desire:"My skin is glowing", cat:"Beautymaxxing", catColor:"#c4856a", catBg:"rgba(196,133,106,0.12)", days:3, done:false, signs:1, track:"Gorgeous Is My Default" },
  { desire:"I am a lucky girl", cat:"Luckygirlmaxxing", catColor:"#9b87c4", catBg:"rgba(155,135,196,0.12)", days:7, done:true, signs:4, track:"Lucky Girl Summer" },
];

/* Elegant manifested tile — no images, just branded gradient + text */
function ManifestedTile({ d, s, C, f, pad, r8, r20 }) {
  const accent = d.catColor || "#C8960A";
  return (
    <div style={{ background:`linear-gradient(135deg,${accent}18,${accent}08)`, border:`1px solid ${accent}40`, borderRadius:r8, padding:`${Math.round(8*s)}px ${Math.round(10*s)}px` }}>
      <div style={{ fontSize:Math.max(6,Math.round(10*s)), color:accent, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:Math.round(4*s) }}>✦ {d.cat}</div>
      <div style={{ fontSize:f.sm, color:C.cr, lineHeight:1.35, marginBottom:Math.round(5*s) }}>{d.desire}</div>
      <div style={{ display:"flex", alignItems:"center", gap:Math.round(4*s) }}>
        <div style={{ fontSize:Math.max(5,f.xs-1), color:"#5ab06a" }}>✓ Manifested</div>
        <div style={{ fontSize:Math.max(5,f.xs-1), color:C.dim }}>· {d.days}d</div>
      </div>
      <div style={{ fontSize:Math.max(5,f.xs-1), color:C.dim, marginTop:Math.round(2*s) }}>♪ {d.track}</div>
    </div>
  );
}

export default function ProofWallScreenshot({ width=260, theme="light" }) {
  const C = theme==="light" ? LIGHT : DARK;
  const h = Math.round(width*(844/390));
  const s = width/390;
  const f = { xs:Math.max(6,Math.round(9*s)), sm:Math.max(7,Math.round(11*s)), md:Math.max(8,Math.round(13*s)), lg:Math.max(10,Math.round(16*s)) };
  const pad=Math.round(14*s), r8=Math.round(8*s), r20=Math.round(20*s), r24=Math.round(24*s);

  return (
    <div style={{ width, height:h, background:C.bg, borderRadius:r24, overflow:"hidden",
      fontFamily:"'Jost',sans-serif", color:C.cr, position:"relative", flexShrink:0,
      boxShadow:`0 ${Math.round(24*s)}px ${Math.round(60*s)}px rgba(0,0,0,0.3), 0 0 0 ${Math.round(1*s)}px rgba(44,183,167,0.3)` }}>

      {/* STATUS BAR */}
      <div style={{ height:Math.round(38*s), display:"flex", alignItems:"flex-end", justifyContent:"space-between", padding:`0 ${pad}px ${Math.round(6*s)}px` }}>
        <span style={{ fontSize:f.sm, fontWeight:400, color:C.mu }}>9:41</span>
        <span style={{ fontSize:f.xs, color:C.mu }}>●● 100%</span>
      </div>
      <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:Math.round(90*s), height:Math.round(26*s), background:C.bg, borderRadius:`0 0 ${Math.round(12*s)}px ${Math.round(12*s)}px`, zIndex:50 }}/>

      {/* HEADER */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:`${Math.round(6*s)}px ${pad}px ${Math.round(6*s)}px` }}>
        <div>
          <span style={{ fontSize:f.lg, fontWeight:400, color:C.cr }}>ProofOS </span>
          <span style={{ color:R }}>✦</span>
        </div>
        <div style={{ padding:`${Math.round(2*s)}px ${Math.round(8*s)}px`, background:OMBRE, borderRadius:r20, fontSize:f.xs, color:"#000" }}>+ New</div>
      </div>

      {/* STATS */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:Math.round(4*s), padding:`0 ${pad}px ${Math.round(10*s)}px` }}>
        {[[3,"Desires",C.cr],[2,"Manifested","#5ab06a"],["14d","Streak",P]].map(([v,l,c],i)=>(
          <div key={i} style={{ background:C.bg3, borderRadius:r8, padding:`${Math.round(8*s)}px ${Math.round(4*s)}px`, textAlign:"center" }}>
            <div style={{ fontSize:f.lg, color:c }}>{v}</div>
            <div style={{ fontSize:Math.max(5,f.xs-1), color:C.mu }}>{l}</div>
          </div>
        ))}
      </div>

      {/* IN PROGRESS */}
      <div style={{ padding:`0 ${pad}px ${Math.round(4*s)}px`, fontSize:f.xs, color:C.mu, letterSpacing:"0.12em", textTransform:"uppercase" }}>In progress</div>
      {THREADS.filter(t=>!t.done).slice(0,2).map((d,i)=>(
        <div key={i} style={{ margin:`0 ${pad}px ${Math.round(6*s)}px`, background:C.bg2, border:`0.5px solid ${d.catColor}30`, borderRadius:r8, padding:`${Math.round(8*s)}px ${Math.round(10*s)}px` }}>
          <div style={{ display:"flex", alignItems:"center", gap:Math.round(5*s), marginBottom:Math.round(4*s) }}>
            <span style={{ fontSize:Math.max(5,f.xs-1), padding:`${Math.round(1*s)}px ${Math.round(6*s)}px`, background:d.catBg, color:d.catColor, borderRadius:r20 }}>{d.cat}</span>
            <span style={{ fontSize:Math.max(5,f.xs-1), color:C.dim }}>Day {d.days}</span>
          </div>
          <div style={{ fontSize:f.sm, color:C.cr, lineHeight:1.3, marginBottom:Math.round(5*s) }}>{d.desire}</div>
          <div style={{ height:Math.round(2*s), background:C.bg3, borderRadius:1 }}>
            <div style={{ width:`${Math.min(d.days*8,90)}%`, height:"100%", background:OMBRE, borderRadius:1 }}/>
          </div>
          <div style={{ fontSize:Math.max(5,f.xs-1), color:C.dim, marginTop:Math.round(3*s) }}>{d.signs} signs · ♪ {d.track}</div>
        </div>
      ))}

      {/* MANIFESTED */}
      <div style={{ padding:`${Math.round(6*s)}px ${pad}px ${Math.round(4*s)}px`, fontSize:f.xs, color:"#5ab06a", letterSpacing:"0.1em", textTransform:"uppercase" }}>✓ Manifested</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:Math.round(4*s), padding:`0 ${pad}px` }}>
        {THREADS.filter(t=>t.done).slice(0,2).map((d,i)=>(
          <ManifestedTile key={i} d={d} s={s} C={C} f={f} pad={pad} r8={r8} r20={r20}/>
        ))}
      </div>

      {/* 5-TAB NAV */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, background:C.nav, borderTop:`0.5px solid ${C.bg3}`, display:"flex", padding:`${Math.round(6*s)}px 0 ${Math.round(10*s)}px` }}>
        {[["♪","Library"],["◎","Proof"],["◈","Analytics"],["◐","Sleep"],["○","Guide"]].map(([icon,l],i)=>(
          <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:Math.round(2*s) }}>
            <span style={{ fontSize:f.md, color:i===1?R:C.dim }}>{icon}</span>
            <span style={{ fontSize:Math.max(5,f.xs-1), color:i===1?R:C.dim }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
