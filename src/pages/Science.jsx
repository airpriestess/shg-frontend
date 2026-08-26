/* Science — Before / After split panels */
import { useState, useEffect, useRef } from "react";
import HamburgerMenu from "../components/HamburgerMenu.jsx";

const LG   = "linear-gradient(135deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";
const TEAL = "#2CB7A7";
const CR   = "#fdf0e8";

/* ── shared panel layout ── */
function Panel({ label, heading, sub, svg, caption, dark, animate }) {
  const bg     = dark ? "#ffffff" : LG;
  const clr    = dark ? "#000" : "#000";
  const muted  = dark ? "rgba(0,0,0,0.45)" : "rgba(0,0,0,0.5)";
  return (
    <div style={{ background:bg, padding:"72px 52px 64px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-start", gap:28 }}>
      <div style={{ fontSize:11, letterSpacing:"0.28em", textTransform:"uppercase", color:muted, fontFamily:"'Jost',sans-serif", fontWeight:600 }}>{label}</div>
      <div style={{ fontSize:"clamp(22px,3vw,34px)", fontWeight:300, color:clr, fontFamily:"'Jost',sans-serif", lineHeight:1.25, textAlign:"center" }}>
        {heading}<br/><strong style={{ fontWeight:700 }}>{sub}</strong>
      </div>
      {svg}
      {caption && (
        <div style={{ fontSize:15, fontWeight:300, color:muted, lineHeight:1.8, fontFamily:"'Jost',sans-serif", textAlign:"center", maxWidth:300 }}>{caption}</div>
      )}
    </div>
  );
}

/* ── divider ── */
function Divider() {
  return <div style={{ height:1, background:"linear-gradient(90deg,transparent,rgba(44,183,167,0.3),transparent)", margin:"0" }}/>;
}

/* ── section heading (full-bleed dark) ── */
function SectionTitle({ overline, title, body }) {
  return (
    <div style={{ background:"#000", padding:"72px 24px 56px", textAlign:"center" }}>
      <div style={{ fontSize:11, letterSpacing:"0.28em", textTransform:"uppercase", color:TEAL, marginBottom:16, fontFamily:"'Jost',sans-serif", fontWeight:600 }}>{overline}</div>
      <div style={{ fontSize:"clamp(28px,5vw,56px)", fontWeight:300, color:CR, fontFamily:"'Jost',sans-serif", lineHeight:1.15, marginBottom: body?24:0 }}>{title}</div>
      {body && <div style={{ fontSize:17, color:"rgba(253,240,232,0.7)", lineHeight:1.8, maxWidth:580, margin:"0 auto", fontFamily:"'Jost',sans-serif", fontWeight:300 }}>{body}</div>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SVG ILLUSTRATIONS
══════════════════════════════════════════════════════════ */

/* 1 — Brain filter */
const FilterBefore = (
  <svg viewBox="0 0 300 300" style={{ width:"100%", maxWidth:300 }}>
    {[30,80,130,180,230,280].map((x,i)=>(
      <g key={i}>
        <circle cx={x} cy={28} r={16} fill="none" stroke="#000" strokeWidth="2"/>
        <line x1={x} y1={44} x2={x} y2={138} stroke="#000" strokeWidth="1.5" strokeDasharray="6,5" strokeOpacity="0.2"/>
      </g>
    ))}
    <rect x={10} y={138} width={280} height={56} rx={4} fill="none" stroke="#000" strokeWidth="2"/>
    <text x={155} y={162} textAnchor="middle" fill="#000" fontSize="11" fontFamily="'Jost',sans-serif" letterSpacing="3" fontWeight="700">CRITICAL MIND</text>
    <text x={155} y={183} textAnchor="middle" fill="rgba(0,0,0,0.45)" fontSize="11" fontFamily="'Jost',sans-serif">blocks new beliefs</text>
    <line x1={105} y1={194} x2={105} y2={256} stroke="#000" strokeWidth="1.5" strokeDasharray="5,4" strokeOpacity="0.18"/>
    <line x1={205} y1={194} x2={205} y2={256} stroke="#000" strokeWidth="1.5" strokeDasharray="5,4" strokeOpacity="0.18"/>
    <circle cx={105} cy={272} r={15} fill="none" stroke="#000" strokeWidth="1.5" strokeOpacity="0.28"/>
    <circle cx={205} cy={272} r={15} fill="none" stroke="#000" strokeWidth="1.5" strokeOpacity="0.28"/>
    <text x={155} y={298} textAnchor="middle" fill="rgba(0,0,0,0.28)" fontSize="12" fontFamily="'Jost',sans-serif" letterSpacing="1">2 of 6 received</text>
  </svg>
);

const FilterAfter = (
  <svg viewBox="0 0 300 300" style={{ width:"100%", maxWidth:300 }}>
    {[30,80,130,180,230,280].map((x,i)=>(
      <g key={i}>
        <circle cx={x} cy={28} r={16} fill="#000">
          <animate attributeName="r" values="14;19;14" dur="2.2s" begin={i*0.28+"s"} repeatCount="indefinite"/>
        </circle>
        <line x1={x} y1={44} x2={x} y2={138} stroke="#000" strokeWidth="2">
          <animate attributeName="strokeOpacity" values="0.3;0.9;0.3" dur="2.2s" begin={i*0.28+"s"} repeatCount="indefinite"/>
        </line>
      </g>
    ))}
    <rect x={10} y={138} width={280} height={56} rx={4} fill="rgba(0,0,0,0.1)" stroke="#000" strokeWidth="2"/>
    <text x={155} y={162} textAnchor="middle" fill="#000" fontSize="11" fontFamily="'Jost',sans-serif" letterSpacing="3" fontWeight="700">NEW IDENTITY</text>
    <text x={155} y={183} textAnchor="middle" fill="rgba(0,0,0,0.55)" fontSize="11" fontFamily="'Jost',sans-serif">filter open · all received</text>
    {[30,80,130,180,230,280].map((x,i)=>(
      <g key={i}>
        <line x1={x} y1={194} x2={x} y2={256} stroke="#000" strokeWidth="2">
          <animate attributeName="strokeOpacity" values="0.3;1;0.3" dur="2.2s" begin={i*0.28+"s"} repeatCount="indefinite"/>
        </line>
        <circle cx={x} cy={272} r={15} fill="#000">
          <animate attributeName="r" values="13;17;13" dur="2.2s" begin={i*0.28+"s"} repeatCount="indefinite"/>
        </circle>
      </g>
    ))}
    <text x={155} y={298} textAnchor="middle" fill="rgba(0,0,0,0.55)" fontSize="12" fontFamily="'Jost',sans-serif" letterSpacing="1">6 of 6 received</text>
  </svg>
);

/* 2 — Affirmations */
const AffBefore = (
  <svg viewBox="0 0 300 260" style={{ width:"100%", maxWidth:300 }}>
    {/* Brain (awake) */}
    <ellipse cx={155} cy={80} rx={70} ry={55} fill="none" stroke="#000" strokeWidth="2"/>
    <text x={155} y={76} textAnchor="middle" fill="#000" fontSize="10" fontFamily="'Jost',sans-serif" letterSpacing="2" fontWeight="700">BETA STATE</text>
    <text x={155} y={92} textAnchor="middle" fill="rgba(0,0,0,0.45)" fontSize="10" fontFamily="'Jost',sans-serif">critical mind active</text>
    {/* Affirmation arrow bouncing off */}
    <line x1={155} y1={175} x2={155} y2={145} stroke="#000" strokeWidth="2" markerEnd="url(#arr1)" strokeOpacity="0.5"/>
    <line x1={155} y1={145} x2={220} y2={118} stroke="#000" strokeWidth="1.5" strokeDasharray="5,4" strokeOpacity="0.3"/>
    <rect x={70} y={185} width={170} height={44} rx={4} fill="none" stroke="#000" strokeWidth="1.5"/>
    <text x={155} y={205} textAnchor="middle" fill="#000" fontSize="10" fontFamily="'Jost',sans-serif" letterSpacing="1">"I am rich and worthy"</text>
    <text x={155} y={221} textAnchor="middle" fill="rgba(0,0,0,0.4)" fontSize="10" fontFamily="'Jost',sans-serif">bounces off</text>
    <defs>
      <marker id="arr1" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="#000" opacity="0.4"/>
      </marker>
    </defs>
    <text x={155} y={252} textAnchor="middle" fill="rgba(0,0,0,0.28)" fontSize="12" fontFamily="'Jost',sans-serif" letterSpacing="1">0 beliefs installed</text>
  </svg>
);

const AffAfter = (
  <svg viewBox="0 0 300 260" style={{ width:"100%", maxWidth:300 }}>
    {/* Brain (theta) */}
    <ellipse cx={155} cy={80} rx={70} ry={55} fill="#000" fillOpacity="0.12" stroke="#000" strokeWidth="2">
      <animate attributeName="rx" values="68;74;68" dur="3s" repeatCount="indefinite"/>
      <animate attributeName="ry" values="53;58;53" dur="3s" repeatCount="indefinite"/>
    </ellipse>
    <text x={155} y={76} textAnchor="middle" fill="#000" fontSize="10" fontFamily="'Jost',sans-serif" letterSpacing="2" fontWeight="700">THETA STATE</text>
    <text x={155} y={92} textAnchor="middle" fill="rgba(0,0,0,0.55)" fontSize="10" fontFamily="'Jost',sans-serif">subconscious open</text>
    {/* Affirmation going straight in */}
    <line x1={155} y1={175} x2={155} y2={142} stroke="#000" strokeWidth="2.5">
      <animate attributeName="strokeOpacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite"/>
    </line>
    <circle cx={155} cy={138} r={5} fill="#000">
      <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite"/>
    </circle>
    <rect x={70} y={185} width={170} height={44} rx={4} fill="#000" fillOpacity="0.1" stroke="#000" strokeWidth="1.5"/>
    <text x={155} y={205} textAnchor="middle" fill="#000" fontSize="10" fontFamily="'Jost',sans-serif" letterSpacing="1">"I am rich and worthy"</text>
    <text x={155} y={221} textAnchor="middle" fill="rgba(0,0,0,0.55)" fontSize="10" fontFamily="'Jost',sans-serif">lands directly</text>
    <text x={155} y={252} textAnchor="middle" fill="rgba(0,0,0,0.55)" fontSize="12" fontFamily="'Jost',sans-serif" letterSpacing="1">belief installed</text>
  </svg>
);

/* 3 — Binaural beats */
const BinBefore = (
  <svg viewBox="0 0 300 260" style={{ width:"100%", maxWidth:300 }}>
    <text x={40} y={50} fill="#000" fontSize="13" fontFamily="'Jost',sans-serif" fontWeight="600">Left ear</text>
    <text x={40} y={68} fill="rgba(0,0,0,0.45)" fontSize="11" fontFamily="'Jost',sans-serif">200 Hz</text>
    {[0,1,2,3,4,5,6,7,8].map(i=>(
      <path key={i} d={`M ${30+i*26} 100 Q ${43+i*26} ${i%2===0?80:120} ${56+i*26} 100`} fill="none" stroke="#000" strokeWidth="1.5" strokeOpacity="0.5"/>
    ))}
    <text x={40} y={160} fill="#000" fontSize="13" fontFamily="'Jost',sans-serif" fontWeight="600">Right ear</text>
    <text x={40} y={178} fill="rgba(0,0,0,0.45)" fontSize="11" fontFamily="'Jost',sans-serif">204 Hz</text>
    {[0,1,2,3,4,5,6,7,8].map(i=>(
      <path key={i} d={`M ${30+i*26} 210 Q ${43+i*26} ${i%2===0?188:232} ${56+i*26} 210`} fill="none" stroke="#000" strokeWidth="1.5" strokeOpacity="0.5"/>
    ))}
    <text x={155} y={252} textAnchor="middle" fill="rgba(0,0,0,0.28)" fontSize="12" fontFamily="'Jost',sans-serif" letterSpacing="1">two separate tones</text>
  </svg>
);

const BinAfter = (
  <svg viewBox="0 0 300 260" style={{ width:"100%", maxWidth:300 }}>
    <text x={155} y={30} textAnchor="middle" fill="#000" fontSize="13" fontFamily="'Jost',sans-serif" fontWeight="600">Brain perceives the difference</text>
    <text x={155} y={48} textAnchor="middle" fill="rgba(0,0,0,0.55)" fontSize="11" fontFamily="'Jost',sans-serif">204 − 200 = 4 Hz · theta</text>
    {/* Slow theta wave */}
    {[0,1,2].map(i=>(
      <path key={i} d={`M ${20+i*88} 130 Q ${64+i*88} ${i%2===0?90:170} ${108+i*88} 130`} fill="none" stroke="#000" strokeWidth="3">
        <animate attributeName="strokeOpacity" values="0.4;1;0.4" dur="2.5s" begin={i*0.4+"s"} repeatCount="indefinite"/>
      </path>
    ))}
    <text x={155} y={190} textAnchor="middle" fill="#000" fontSize="11" fontFamily="'Jost',sans-serif" letterSpacing="2" fontWeight="700">BRAIN ENTRAINS</text>
    <text x={155} y={208} textAnchor="middle" fill="rgba(0,0,0,0.55)" fontSize="11" fontFamily="'Jost',sans-serif">your brainwaves follow the pulse</text>
    <text x={155} y={252} textAnchor="middle" fill="rgba(0,0,0,0.55)" fontSize="12" fontFamily="'Jost',sans-serif" letterSpacing="1">theta state reached</text>
  </svg>
);

/* 4 — EMDR hemispheres */
const EmdrBefore = (
  <svg viewBox="0 0 300 240" style={{ width:"100%", maxWidth:300 }}>
    <ellipse cx={100} cy={110} rx={75} ry={85} fill="none" stroke="#000" strokeWidth="2"/>
    <text x={100} y={106} textAnchor="middle" fill="#000" fontSize="10" fontFamily="'Jost',sans-serif" fontWeight="700">LEFT</text>
    <text x={100} y={122} textAnchor="middle" fill="rgba(0,0,0,0.4)" fontSize="10" fontFamily="'Jost',sans-serif">dominant</text>
    <ellipse cx={205} cy={110} rx={75} ry={85} fill="none" stroke="#000" strokeWidth="1.5" strokeOpacity="0.3"/>
    <text x={205} y={106} textAnchor="middle" fill="rgba(0,0,0,0.35)" fontSize="10" fontFamily="'Jost',sans-serif" fontWeight="700">RIGHT</text>
    <text x={205} y={122} textAnchor="middle" fill="rgba(0,0,0,0.3)" fontSize="10" fontFamily="'Jost',sans-serif">underused</text>
    <text x={155} y={228} textAnchor="middle" fill="rgba(0,0,0,0.28)" fontSize="12" fontFamily="'Jost',sans-serif" letterSpacing="1">one hemisphere blocks the other</text>
  </svg>
);

const EmdrAfter = (
  <svg viewBox="0 0 300 240" style={{ width:"100%", maxWidth:300 }}>
    <ellipse cx={100} cy={110} rx={75} ry={85} fill="#000" fillOpacity="0.1" stroke="#000" strokeWidth="2">
      <animate attributeName="fillOpacity" values="0.08;0.18;0.08" dur="2s" repeatCount="indefinite"/>
    </ellipse>
    <text x={100} y={106} textAnchor="middle" fill="#000" fontSize="10" fontFamily="'Jost',sans-serif" fontWeight="700">LEFT</text>
    <text x={100} y={122} textAnchor="middle" fill="rgba(0,0,0,0.55)" fontSize="10" fontFamily="'Jost',sans-serif">synced</text>
    <ellipse cx={205} cy={110} rx={75} ry={85} fill="#000" fillOpacity="0.1" stroke="#000" strokeWidth="2">
      <animate attributeName="fillOpacity" values="0.18;0.08;0.18" dur="2s" repeatCount="indefinite"/>
    </ellipse>
    <text x={205} y={106} textAnchor="middle" fill="#000" fontSize="10" fontFamily="'Jost',sans-serif" fontWeight="700">RIGHT</text>
    <text x={205} y={122} textAnchor="middle" fill="rgba(0,0,0,0.55)" fontSize="10" fontFamily="'Jost',sans-serif">synced</text>
    {/* Pulses between */}
    <circle cx={155} cy={110} r={8} fill="#000">
      <animate attributeName="r" values="6;12;6" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="fillOpacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite"/>
    </circle>
    <text x={155} y={228} textAnchor="middle" fill="rgba(0,0,0,0.55)" fontSize="12" fontFamily="'Jost',sans-serif" letterSpacing="1">both hemispheres process together</text>
  </svg>
);

/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */
export default function Science({ onBack }) {
  const [isMobile, setIsMobile] = useState(typeof window!=="undefined"&&window.innerWidth<=768);
  const topRef = useRef(null);
  useEffect(()=>{
    if(topRef.current) topRef.current.scrollIntoView({behavior:"instant"});
    document.documentElement.scrollTop = 0;
    window.scrollTo({top:0,behavior:"instant"});
    const h=()=>setIsMobile(window.innerWidth<=768);
    window.addEventListener("resize",h);
    return ()=>window.removeEventListener("resize",h);
  },[]);

  const panels = [
    {
      overline:"The mechanism",
      title:"Your brain has a filter.",
      body:"Everything you believe about yourself was installed before age 7, when the critical mind didn't exist yet. It runs automatically now. You can't argue past it. But you can bypass it.",
      before:{ label:"Before", heading:"Six opportunities arrived.", sub:"You noticed two.", svg:FilterBefore, caption:"Your filter was set before age 7. It runs automatically. You never chose it." },
      after:{  label:"After · SHG Theta State", heading:"Six opportunities arrived.", sub:"You noticed all six.", svg:FilterAfter, caption:"Same life. Same opportunities. Different filter. This is what we install." },
    },
    {
      overline:"Why affirmations fail",
      title:"You can't install a new belief while the old one is defending itself.",
      body:"Affirmations work in theory. In practice, your analytical brain catches them the moment they arrive and argues back. The belief never lands. The state has to change first.",
      before:{ label:"Before · Beta state", heading:"You repeat the affirmation.", sub:"Your brain rejects it.", svg:AffBefore, caption:"The critical mind is your gatekeeper. At full alert, nothing new gets through." },
      after:{  label:"After · Theta state", heading:"You hear the affirmation.", sub:"It lands as fact.", svg:AffAfter, caption:"In theta, the gatekeeper steps aside. The subconscious accepts what it receives." },
    },
    {
      overline:"Binaural beats",
      title:"Sound alone can shift your brainwave state.",
      body:"Play 200Hz in one ear and 204Hz in the other. Your brain perceives the 4Hz difference as a pulse. It entrains to that pulse. You reach theta without trying.",
      before:{ label:"Two tones", heading:"Left ear: 200Hz.", sub:"Right ear: 204Hz.", svg:BinBefore, caption:"Two separate frequencies. Your conscious mind hears both, separately." },
      after:{  label:"What your brain creates", heading:"It perceives 4Hz.", sub:"Theta. On demand.", svg:BinAfter, caption:"The brain generates the difference and synchronises its own electrical activity to it." },
    },
    {
      overline:"EMDR bilateral audio",
      title:"When both hemispheres sync, resistance drops.",
      body:"EMDR audio alternates sound left to right. This bilateral stimulation synchronises both brain hemispheres. Old defences drop. New identity is processed by the whole brain at once.",
      before:{ label:"Unsynchronised", heading:"One hemisphere dominates.", sub:"The other blocks.", svg:EmdrBefore, caption:"Cognitive resistance lives in the gap between hemispheres." },
      after:{  label:"Synchronised · EMDR", heading:"Both hemispheres process.", sub:"Together. At once.", svg:EmdrAfter, caption:"With both sides synced, there is nothing to argue against. The new belief goes in." },
    },
  ];

  return (
    <div ref={topRef} style={{ minHeight:"100vh", background:"#000", color:CR, fontFamily:"'Jost',sans-serif" }}>

      {/* NAV */}
      <div style={{ position:"sticky", top:0, background:"rgba(0,0,0,0.97)", borderBottom:"1px solid rgba(44,183,167,0.12)", padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", zIndex:100 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:TEAL, cursor:"pointer", fontSize:14, fontFamily:"'Jost',sans-serif", padding:0 }}>← Back</button>
        <div style={{ fontSize:12, color:"rgba(253,240,232,0.5)", letterSpacing:"0.1em", textTransform:"uppercase" }}>The Science · reshmaoracle.com</div>
        <HamburgerMenu/>
      </div>

      {/* HERO */}
      <div style={{ background:LG, padding:isMobile?"64px 24px 72px":"96px 24px 104px", textAlign:"center" }}>
        <div style={{ fontSize:11, letterSpacing:"0.28em", textTransform:"uppercase", color:"rgba(0,0,0,0.45)", marginBottom:20, fontFamily:"'Jost',sans-serif", fontWeight:600 }}>Self Hypnosis Goddess · The Science</div>
        <div style={{ fontSize:isMobile?"clamp(36px,11vw,52px)":"clamp(48px,7vw,80px)", fontWeight:300, color:"#000", fontFamily:"'Jost',sans-serif", lineHeight:1.1, marginBottom:24 }}>
          This is why<br/><strong style={{ fontWeight:700 }}>it works.</strong>
        </div>
        <div style={{ fontSize:isMobile?16:19, color:"rgba(0,0,0,0.6)", lineHeight:1.8, maxWidth:520, margin:"0 auto", fontFamily:"'Jost',sans-serif", fontWeight:300 }}>
          Four mechanisms. Each one targeting a different layer of why the old belief stayed and why the new one is about to land.
        </div>
      </div>

      {/* BEFORE / AFTER PANELS */}
      {panels.map((p, pi) => (
        <div key={pi}>
          <SectionTitle overline={p.overline} title={p.title} body={p.body}/>
          <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr":"1fr 1fr" }}>
            <Panel label={p.before.label} heading={p.before.heading} sub={p.before.sub} svg={p.before.svg} caption={p.before.caption} dark={true}/>
            <Panel label={p.after.label}  heading={p.after.heading}  sub={p.after.sub}  svg={p.after.svg}  caption={p.after.caption}  dark={false}/>
          </div>
          {pi < panels.length - 1 && <Divider/>}
        </div>
      ))}

      {/* FORMULA */}
      <div style={{ background:"#000", padding:isMobile?"64px 24px":"80px 24px", textAlign:"center" }}>
        <div style={{ fontSize:11, letterSpacing:"0.28em", textTransform:"uppercase", color:TEAL, marginBottom:20, fontFamily:"'Jost',sans-serif", fontWeight:600 }}>The formula</div>
        <div style={{ fontSize:isMobile?"clamp(24px,7vw,36px)":"clamp(32px,4vw,52px)", fontWeight:300, color:CR, fontFamily:"'Jost',sans-serif", lineHeight:1.2, marginBottom:16 }}>
          Stack all four.<br/><strong style={{ fontWeight:700 }}>Theta on demand.</strong>
        </div>
        <div style={{ fontSize:16, color:"rgba(253,240,232,0.6)", lineHeight:1.8, maxWidth:520, margin:"0 auto 48px", fontFamily:"'Jost',sans-serif", fontWeight:300 }}>
          Every SHG track layers hypnosis, subliminals, melodic house, EMDR, and binaural beats simultaneously. Each targets a different layer. Together they create a condition no single approach can produce alone.
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:isMobile?8:12, justifyContent:"center", alignItems:"center", maxWidth:700, margin:"0 auto 48px" }}>
          {["Hypnosis","Subliminals","Melodic House","EMDR","Binaural Beats"].map((t,i,arr)=>(
            <>
              <span key={t} style={{ background:LG, borderRadius:40, padding:"10px 22px", fontSize:14, fontWeight:500, color:"#000", fontFamily:"'Jost',sans-serif", letterSpacing:"0.02em" }}>{t}</span>
              {i < arr.length-1 && <span key={t+"+"} style={{ color:"rgba(253,240,232,0.3)", fontSize:22, fontWeight:300 }}>+</span>}
            </>
          ))}
          <span style={{ color:"rgba(253,240,232,0.3)", fontSize:22, fontWeight:300 }}>=</span>
          <span style={{ background:LG, borderRadius:40, padding:"12px 28px", fontSize:16, fontWeight:700, color:"#000", fontFamily:"'Jost',sans-serif", letterSpacing:"0.02em" }}>Theta on demand</span>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background:LG, padding:isMobile?"64px 24px 80px":"80px 24px 100px", textAlign:"center" }}>
        <div style={{ fontSize:isMobile?"clamp(32px,9vw,52px)":"clamp(40px,5.5vw,72px)", fontWeight:300, color:"#000", fontFamily:"'Jost',sans-serif", lineHeight:1.1, marginBottom:24 }}>
          Ready to<br/><strong style={{ fontWeight:700 }}>feel the shift?</strong>
        </div>
        <div style={{ fontSize:17, color:"rgba(0,0,0,0.6)", lineHeight:1.8, marginBottom:40, fontFamily:"'Jost',sans-serif", fontWeight:300 }}>
          Your first session is free.
        </div>
        <button onClick={onBack} style={{ background:"#000", border:"none", borderRadius:40, padding:isMobile?"18px 44px":"22px 64px", color:CR, fontSize:isMobile?16:18, fontFamily:"'Jost',sans-serif", fontWeight:400, cursor:"pointer", letterSpacing:"0.02em" }}>
          Join Self Hypnosis Goddess →
        </button>
      </div>

    </div>
  );
}
