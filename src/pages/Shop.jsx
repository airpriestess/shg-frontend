import { useNavigate } from "react-router-dom";
import HamburgerMenu from "../components/HamburgerMenu.jsx";

const LG = "linear-gradient(110deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";

const WORKBOOKS = [
  {
    key: "luckygirl", name: "LuckyGirl Workbook",
    desc: "The Recognition Filter. Timing Windows. The Domino Effect. 21 pieces of evidence. The full operating system, installed in 21 days.",
    price: "$29", was: "$49",
    cta: "Install the LuckyGirl operating system →",
    url: "https://shop.beacons.ai/reshmaoracle/765f9e37-68f6-4d14-bc86-c952a2ca565f",
    available: true,
  },
  {
    key: "lovemaxxing", name: "Lovemaxxing Workbook",
    desc: "The Four Chambers. The Attraction Compass. The Repulsion Map. The Selection Code, installed in 21 days.",
    price: "$29", was: "$49",
    cta: "Install the Lovemaxxing operating system →",
    url: "https://shop.beacons.ai/reshmaoracle/4386c71b-1ba1-4e6c-8b34-c6b8468615db",
    available: true,
  },
  {
    key: "richgirl", name: "RichGirl Workbook",
    desc: "The RAS Filter. The Identity Loop. The Money Ladder. Right mind. Right identity. Right operating system.",
    price: "$29", was: "$49",
    cta: "Install the RichGirl operating system →",
    url: "https://shop.beacons.ai/reshmaoracle/dca30200-5c07-4d43-94e7-a41d86267ca3",
    available: true,
  },
  {
    key: "beautymaxxing", name: "Beautymaxxing Workbook",
    desc: "The mirror gap, closed. Right mirror. Right identity. Right frequency.",
    price: null, was: null,
    cta: "Coming Soon",
    url: null,
    available: false,
  },
  {
    key: "selfmaxxing", name: "Selfmaxxing Workbook",
    desc: "I am the main character. Obviously. The identity install for everything else.",
    price: null, was: null,
    cta: "Coming Soon",
    url: null,
    available: false,
  },
];

function SHGNav() {
  const navigate = useNavigate();
  return (
    <nav onClick={()=>navigate("/")} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 20px", height:54, borderBottom:"1px solid rgba(255,255,255,0.08)", background:"rgba(0,0,0,0.97)", backdropFilter:"blur(20px)", position:"sticky", top:0, zIndex:100, cursor:"pointer" }}>
      <div style={{ display:"flex", alignItems:"center", gap:9 }}>
        <img src="/logo_transparent_cropped.png" alt="Self Hypnosis Goddess" width="38" height="38" style={{flexShrink:0, objectFit:"contain", display:"block"}} />
        <span style={{ fontFamily:"'Jost',sans-serif", fontWeight:300, fontSize:14, letterSpacing:"0.02em", color:"#fdf0e8" }}>Self Hypnosis Goddess</span>
      </div>
      <div onClick={(e)=>e.stopPropagation()}>
        <HamburgerMenu/>
      </div>
    </nav>
  );
}

function WorkbookCard({ w }) {
  return (
    <div style={{
      background:"#000", borderRadius:20, border:"1px solid rgba(255,255,255,0.08)",
      overflow:"hidden", opacity: w.available ? 1 : 0.55,
    }}>
      <div style={{ padding:"40px 28px 32px", textAlign:"center" }}>
        <div style={{ fontSize:11, letterSpacing:".3em", textTransform:"uppercase", color:"#2CB7A7", marginBottom:20 }}>
          {w.available ? "Instant Access" : "Coming Soon"}
        </div>
        <div style={{ fontSize:"clamp(30px,4vw,42px)", fontWeight:400, color:"#fdf0e8", lineHeight:1.1, marginBottom:24 }}>
          {w.name.replace(" Workbook", "")}<br/>Workbook
        </div>
        <div style={{ width:60, height:2, background:LG, margin:"0 auto 24px" }}/>
        {w.available ? (
          <div style={{ fontSize:26, fontWeight:600, color:"#fdf0e8" }}>
            <span style={{ textDecoration:"line-through", opacity:0.4, fontWeight:400, fontSize:18, marginRight:10 }}>{w.was}</span>
            {w.price}
          </div>
        ) : (
          <div style={{ fontSize:16, color:"#8a7d72" }}>Not available yet</div>
        )}
      </div>

      <div style={{ borderTop:"1px solid rgba(255,255,255,0.08)", padding:"32px 28px 28px" }}>
        <div style={{ fontSize:11, letterSpacing:".3em", textTransform:"uppercase", background:LG, WebkitBackgroundClip:"text", backgroundClip:"text", color:"transparent", textAlign:"center", marginBottom:18 }}>
          What's Inside
        </div>
        <div style={{ display:"flex", gap:12, marginBottom:28 }}>
          <div style={{ width:22, height:22, borderRadius:"50%", background:LG, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:"#000", marginTop:2 }}>✓</div>
          <p style={{ fontSize:15, color:"#c8bcb0", lineHeight:1.6, margin:0 }}>{w.desc}</p>
        </div>
        {w.available ? (
          <a href={w.url} target="_blank" rel="noopener noreferrer" style={{
            display:"block", textAlign:"center", padding:"18px 20px", borderRadius:12, background:LG,
            color:"#000", fontSize:13, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase",
            textDecoration:"none",
          }}>
            {w.cta}
          </a>
        ) : (
          <div style={{
            display:"block", textAlign:"center", padding:"18px 20px", borderRadius:12,
            border:"1px solid rgba(255,255,255,0.15)", color:"#8a7d72", fontSize:13, fontWeight:500,
            letterSpacing:"0.08em", textTransform:"uppercase",
          }}>
            {w.cta}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Shop() {
  return (
    <div style={{ background:"#000", minHeight:"100vh", color:"#fdf0e8", fontFamily:"'Jost',sans-serif" }}>
      <SHGNav/>

      <div style={{ textAlign:"center", padding:"64px 24px 48px" }}>
        <div style={{ display:"inline-block", fontSize:10, letterSpacing:".28em", textTransform:"uppercase", marginBottom:20, background:LG, WebkitBackgroundClip:"text", backgroundClip:"text", color:"transparent" }}>
          ✦ Shop ✦
        </div>
        <h1 style={{ fontSize:"clamp(40px,7vw,72px)", fontWeight:400, letterSpacing:"-0.02em", lineHeight:1.05, margin:"0 0 20px" }}>
          The Workbooks
        </h1>
        <p style={{ fontSize:17, color:"#c8bcb0", maxWidth:480, margin:"0 auto", lineHeight:1.7 }}>
          Every identity, broken down. Pick your install.
        </p>
      </div>

      <div style={{
        maxWidth:1100, margin:"0 auto", padding:"0 24px 100px",
        display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))", gap:24,
      }}>
        {WORKBOOKS.map(w => <WorkbookCard key={w.key} w={w}/>)}
      </div>
    </div>
  );
}
