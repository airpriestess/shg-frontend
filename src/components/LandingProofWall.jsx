/* LandingProofWall — EXACT mirror of the live dashboard Proof Wall (ProofTab wall view).
   Same gold ombre, same category gradient cards, same media grid. Static demo data. */

const OMBRE_BG = "linear-gradient(165deg,#f5e0a0 0%,#e8b870 20%,#d4a090 45%,#c4789a 72%,#B76E79 100%)";
const CAT_GRAD = { "SP & Love":"linear-gradient(135deg,#ffc8e0,#f8a8c8)", "Money":"linear-gradient(135deg,#c8ecc8,#a0d8a0)", "Beauty":"linear-gradient(135deg,#fff8a0,#f8e860)", "Identity":"linear-gradient(135deg,#d8c8ff,#c0a8f0)", "Sleep":"linear-gradient(135deg,#cfe8ff,#a8d0f8)" };
const CAT_COLOR = { "SP & Love":"#c84880", "Money":"#1a7030", "Beauty":"#9a7800", "Identity":"#6030a0", "Sleep":"#0a5090" };
const PC = { card:"rgba(255,248,240,0.92)", text:"#1a1218", mu:"#3a2830", dim:"#5a4048" };

const WALL = [
  { desire:"He texts me first", category:"SP & Love", days:14, signs:5, media:"📷 · 🎤", date:"20 Jun", feel:"Calm. It was always inevitable." },
  { desire:"Glowing skin — compliments daily", category:"Beauty", days:9, signs:3, media:"📷", date:"21 Jun", feel:"I catch myself in mirrors now." },
  { desire:"£180 refund out of nowhere", category:"Money", days:4, signs:2, media:"📷", date:"28 Jun", feel:"Money really does find me first." },
];

const MEDIA = [
  { img:"https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop&auto=format", label:"He texts me first · 19 Jun" },
  { img:"https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=400&fit=crop&auto=format", label:"£180 refund · 28 Jun" },
  { audio:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", label:"Voice note · 20 Jun" },
  { img:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&auto=format", label:"The sign I asked for · 1 Jul" },
];

export default function LandingProofWall({ isMobile }) {
  return (
    <div style={{ padding: isMobile?"48px 0":"70px 0", background: OMBRE_BG, width:"100%" }}>
      <div style={{ padding: isMobile?"0 18px":"0 24px", maxWidth: 640, margin:"0 auto", fontFamily:"'Jost',sans-serif" }}>

        <div style={{ textAlign:"center", marginBottom:22 }}>
          <div style={{ fontSize:12, color:"#000", fontWeight:800, letterSpacing:"0.22em", textTransform:"uppercase", marginBottom:12 }}>ProofOS · Real evidence</div>
          <h2 className="wm" style={{ fontSize:"clamp(30px,4.5vw,52px)", color:"#000", lineHeight:1.1, marginBottom:10 }}>This is your Proof Wall.</h2>
          <p style={{ fontSize:isMobile?14:16, color:"#1a0a08", lineHeight:1.8, maxWidth:480, margin:"0 auto", fontWeight:500 }}>
            Exactly as it looks inside the app. Every manifested intention. Every screenshot, every voice note — captured for life.
          </p>
        </div>

        {/* Header — mirrors the app */}
        <div style={{ fontSize:22, fontWeight:800, marginBottom:2, color:PC.text }}>ProofOS <span style={{ color:"#000" }}>✦</span></div>
        <div style={{ fontSize:13, color:PC.mu, marginBottom:14, fontWeight:600 }}>Your manifestation tracker for life. Every sign captured — forever.</div>

        {/* Stats — mirrors the app */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
          {[["5","Intentions"],["3","Manifested"],["13","Signs logged"]].map(([v,l],i)=>(
            <div key={i} style={{ background:PC.card, borderRadius:12, padding:"12px 6px", textAlign:"center" }}>
              <div style={{ fontSize:22, fontWeight:800, color:PC.text }}>{v}</div>
              <div style={{ fontSize:10, color:PC.dim, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Manifested grid — mirrors the app */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {WALL.map((d,i)=>(
            <div key={i} style={{ background:CAT_GRAD[d.category], borderRadius:12, padding:"12px 12px" }}>
              <span style={{ fontSize:9, padding:"2px 8px", background:"rgba(255,255,255,0.65)", color:CAT_COLOR[d.category], borderRadius:20, fontWeight:800 }}>✓ {d.category}</span>
              <div style={{ fontSize:13, fontWeight:800, color:"#000", marginTop:6, lineHeight:1.3 }}>{d.desire}</div>
              <div style={{ fontSize:10, color:"#1a1a1a", fontWeight:700, marginTop:4 }}>{d.days}d · {d.signs} signs · {d.media} · {d.date}</div>
              <div style={{ fontSize:10, color:"#1a1a1a", marginTop:5, lineHeight:1.45 }}>"{d.feel}"</div>
            </div>
          ))}
          <div style={{ background:"rgba(255,255,255,0.35)", border:"1px dashed rgba(0,0,0,0.3)", borderRadius:12, padding:12, display:"flex", alignItems:"center", justifyContent:"center", minHeight:80 }}>
            <span style={{ fontSize:11, color:"#1a0a10", textAlign:"center", fontWeight:700, lineHeight:1.4 }}>Your next<br/>manifestation</span>
          </div>
        </div>

        {/* All captured proof — mirrors the app */}
        <div style={{ fontSize:11, fontWeight:900, color:"#000", letterSpacing:"0.15em", textTransform:"uppercase", margin:"18px 0 8px" }}>All captured proof · newest last</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(90px,1fr))", gap:8 }}>
          {MEDIA.map((m,i)=>(
            <div key={i} style={{ background:"rgba(255,255,255,0.85)", borderRadius:10, padding:6, border:"1px solid rgba(0,0,0,0.12)" }}>
              {m.img && <img src={m.img} alt="proof" style={{ width:"100%", height:72, objectFit:"cover", borderRadius:7 }}/>}
              {m.audio && <div style={{ height:72, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4 }}><span style={{ fontSize:22 }}>🎤</span><audio src={m.audio} controls style={{ width:"100%", height:24 }}/></div>}
              <div style={{ fontSize:8.5, fontWeight:700, color:"#333", marginTop:4, lineHeight:1.3 }}>{m.label}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign:"center", marginTop:22, fontSize:12, color:"#1a0a08", fontWeight:700 }}>Included in Goddess Tier ✦ · Your evidence, for life</div>
      </div>
    </div>
  );
}
