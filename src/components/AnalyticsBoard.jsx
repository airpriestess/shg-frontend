/* AnalyticsBoard — ONE component, used in BOTH the portal dashboard (HomeTab)
   and the landing-page preview. Single source of truth for the analytics UI. */
import { ArrowIcon } from "./UI.jsx";

const R = "#B76E79", P = "#d4a090";
const OMBRE = "linear-gradient(135deg,#f5e0a0 0%,#e8b870 22%,#d4a090 48%,#c4789a 72%,#B76E79 100%)";

const PALETTES = {
  dark:  { card:"#1a1a1a", card2:"#242424", text:"#ffffff", mu:"#b3b3b3", dim:"#727272", border:"rgba(255,255,255,0.08)", track:"rgba(255,255,255,0.12)" },
  light: { card:"#fff8f4", card2:"rgba(183,110,121,0.08)", text:"#000000", mu:"#4a3028", dim:"#7a5a48", border:"rgba(183,110,121,0.15)", track:"rgba(0,0,0,0.1)" },
};

// Demo data used in preview mode / landing screenshot
export const DEMO_ANALYTICS = {
  manifested: 3, inProgress: 4, signs: 11, listens: 27, streakDays: 14,
  week: [2,4,3,6,5,4,3], // listens per day, Mon–Sun
  topCats: [ ["Money","#B76E79",5], ["SP & Love","#e8b870",4], ["Identity","#d4a090",2] ],
};

export default function AnalyticsBoard({ data=DEMO_ANALYTICS, theme="dark", compact=false, onViewProof }) {
  const C = PALETTES[theme] || PALETTES.dark;
  const { manifested, inProgress, signs, listens, streakDays, week, topCats } = data;
  const total = Math.max(manifested + inProgress, 1);
  const pct = manifested / total;
  const r2 = 26, circ = 2 * Math.PI * r2;
  const maxW = Math.max(...week, 1);
  const days = ["M","T","W","T","F","S","S"];
  const fs = compact ? 0.82 : 1;

  return (
    <div style={{ background:C.card, borderRadius:16, padding:compact?"12px 14px":"16px 16px", border:`1px solid ${C.border}`, fontFamily:"'Jost',sans-serif" }}>
      <style>{`
        @keyframes abGrow { from { transform:scaleY(0); } to { transform:scaleY(1); } }
        @keyframes abPulse { 0%,100% { filter:brightness(1); box-shadow:0 0 0 rgba(232,184,112,0); } 50% { filter:brightness(1.3); box-shadow:0 0 14px rgba(232,184,112,0.95); } }
        @keyframes abDonut { from { stroke-dasharray:0 999; } }
        @keyframes abFlash { 0%,100% { opacity:1; } 50% { opacity:0.55; } }
      `}</style>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
        <span style={{ fontSize:11*fs, fontWeight:800, color:R, letterSpacing:"0.15em", textTransform:"uppercase" }}>Your analytics ✦</span>
        <span style={{ fontSize:10*fs, fontWeight:800, padding:"3px 10px", background:OMBRE, backgroundSize:"200%", backgroundPosition:"left", borderRadius:20, color:"#000", animation:"abFlash 2.2s ease-in-out infinite" }}>{streakDays}-day streak</span>
      </div>
      <div style={{ fontSize:11.5*fs, fontWeight:800, color:C.text, marginBottom:10 }}>{manifested} of {total} intentions manifested <span style={{ color:R }}>✦</span></div>

      {/* Row 1: donut + stat tiles */}
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:12 }}>
        <svg width={72*fs} height={72*fs} viewBox="0 0 72 72" style={{ flexShrink:0, transform:"rotate(-90deg)" }}>
          <circle cx="36" cy="36" r={r2} fill="none" stroke={C.track} strokeWidth="9"/>
          <circle cx="36" cy="36" r={r2} fill="none" stroke="url(#abGrad)" strokeWidth="9" strokeLinecap="round" strokeDasharray={`${circ*pct} ${circ}`} style={{ animation:"abDonut 1.1s ease both" }}/>
          <defs><linearGradient id="abGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#e8b870"/><stop offset="100%" stopColor="#B76E79"/></linearGradient></defs>
          <text x="36" y="36" transform="rotate(90 36 36)" textAnchor="middle" dominantBaseline="central" fill={C.text} fontSize="17" fontWeight="800" fontFamily="'Jost',sans-serif">{manifested}</text>
        </svg>
        <div style={{ flex:1, display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:6 }}>
          {[[manifested,"Manifested",R],[inProgress,"In progress",P],[signs,"Signs logged",C.text],[listens,"Listens",C.text]].map(([v,l,c],i)=>(
            <div key={i} style={{ background:C.card2, borderRadius:10, padding:`${8*fs}px 4px`, textAlign:"center" }}>
              <div style={{ fontSize:18*fs, fontWeight:800, color:c, lineHeight:1 }}>{v}</div>
              <div style={{ fontSize:8.5*fs, color:C.mu, marginTop:3, lineHeight:1.2, fontWeight:600 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: 7-day listening bars */}
      <div style={{ background:C.card2, borderRadius:12, padding:`${10*fs}px ${12*fs}px`, marginBottom:10 }}>
        <div style={{ fontSize:9.5*fs, fontWeight:800, color:C.mu, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:2 }}>Plays per day — this week</div>
        <div style={{ fontSize:8.5*fs, color:C.dim, marginBottom:8 }}>Taller bar = more listens that day. Gold bar = today.</div>
        <div style={{ position:"relative" }}>
          <div style={{ position:"absolute", left:0, right:0, bottom:16*fs, height:1, background:C.border }}/>
          <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:48*fs, position:"relative" }}>
            {week.map((v,i)=>{
              const isToday = i===week.length-1;
              return (
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2, height:"100%", justifyContent:"flex-end" }}>
                <span style={{ fontSize:9*fs, fontWeight:800, color:isToday?R:C.text }}>{v}</span>
                <div style={{ width:"100%", maxWidth:24, height:`${Math.max((v/maxW)*100,8)}%`, minHeight:5, background:isToday?OMBRE:`${R}38`, border:isToday?"none":`1px solid ${R}55`, backgroundSize:"200%", backgroundPosition:"left", borderRadius:4, transformOrigin:"bottom", animation:`abGrow .7s ease both ${i*0.09}s${isToday?", abPulse 1.7s ease-in-out infinite 1s":""}` }}/>
                <span style={{ fontSize:9*fs, color:isToday?R:C.dim, fontWeight:isToday?800:700 }}>{days[i]}{isToday?" ●":""}</span>
              </div>
            );})}
          </div>
        </div>
      </div>

      {/* Row 3: category breakdown + link */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, flexWrap:"wrap" }}>
        <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
          {topCats.map(([name,color,n],i)=>(
            <span key={i} style={{ fontSize:9.5*fs, fontWeight:800, padding:"3px 9px", borderRadius:20, background:C.card2, color, border:`1px solid ${color}33` }}>{name} · {n}</span>
          ))}
        </div>
        {onViewProof && <span onClick={onViewProof} style={{ fontSize:10.5*fs, color:R, fontWeight:800, cursor:"pointer", textDecoration:"underline", whiteSpace:"nowrap", display:"inline-flex", alignItems:"center", gap:4 }}>View proof wall<ArrowIcon size={10} style={{textDecoration:"none"}}/></span>}
      </div>
    </div>
  );
}
