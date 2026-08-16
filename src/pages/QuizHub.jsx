import { useNavigate } from "react-router-dom";

const LG = "linear-gradient(110deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";

function SHGNav() {
  const navigate = useNavigate();
  return (
    <nav onClick={()=>navigate("/")} style={{ display:"flex", alignItems:"center", padding:"0 20px", height:54, borderBottom:"1px solid rgba(0,0,0,0.1)", background:"rgba(0,0,0,0.97)", backdropFilter:"blur(20px)", gap:9, position:"sticky", top:0, zIndex:100, cursor:"pointer" }}>
      <img src="/logo_black_bg.png" alt="Self Hypnosis Goddess" width="24" height="24" style={{flexShrink:0, objectFit:"contain", display:"block"}} />
      <span style={{ fontFamily:"'Jost',sans-serif", fontWeight:300, fontSize:"clamp(11px,3.2vw,14px)", letterSpacing:"0.02em", color:"#f2ece4" }}>Self Hypnosis Goddess</span>
    </nav>
  );
}

const QUIZZES = [
  {
    name: "Lucky Girl",
    slogan: "Right place. Right time. Right outcome. Mine.",
    desc: "Find what's keeping you out of your Lucky Girl era.",
    color: "#E8B870",
    url: "/luckygirl"
  },
  {
    name: "RichGirl",
    slogan: "Right place. Right time. Right people. Mine.",
    desc: "Find what's stopping money from finding you.",
    color: "#E8B870",
    url: "/blocks/money"
  },
  {
    name: "Lovemaxxing",
    slogan: "Right person. Right time. Right choice. Mine.",
    desc: "Find what's keeping you from being chosen.",
    color: "#BFA5D8",
    url: "/blocks/love"
  },
  {
    name: "Beautymaxxing",
    slogan: "Right now. Right here. Right as I am. Mine.",
    desc: "Find what's keeping you from feeling gorgeous now.",
    color: "#F5E0A0",
    url: "/blocks/beauty"
  },
  {
    name: "Selfmaxxing",
    slogan: "Right room. Right time. Right version. Mine.",
    desc: "Find what's keeping the upgraded version of you waiting.",
    color: "#2CB7A7",
    url: "/blocks/self"
  }
];

export default function QuizHub() {
  const navigate = useNavigate();

  return (
    <div style={{ background: LG, minHeight: "100vh", fontFamily: "'Jost', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,400&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet"/>
      <SHGNav/>

      <div style={{ textAlign: "center", padding: "64px 24px 48px" }}>
        <div style={{ fontSize: 11, letterSpacing: ".28em", textTransform: "uppercase", color: "rgba(0,0,0,0.5)", marginBottom: 20 }}>✦ Free diagnostics ✦</div>
        <h1 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 600, fontSize: "clamp(36px,7vw,72px)", color: "#000", lineHeight: 1.05, letterSpacing: "-.02em", marginBottom: 16 }}>
          Find your block.
        </h1>
        <p style={{ fontSize: 18, color: "rgba(0,0,0,0.65)", lineHeight: 1.7, maxWidth: 420, margin: "0 auto" }}>
          8 questions. Your invisible block — named, and replaced.
        </p>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 20px 80px", display: "flex", flexDirection: "column", gap: 14 }}>
        {QUIZZES.map((q, i) => (
          <div key={i}
            onClick={() => navigate(q.url)}
            style={{ background: "rgba(255,255,255,0.85)", borderRadius: 20, padding: "28px 24px", cursor: "pointer", transition: "all .2s", border: "2px solid transparent" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "scale(1.02)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.85)"; e.currentTarget.style.transform = "scale(1)"; }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase", color: q.color, marginBottom: 8, fontWeight: 500 }}>
                  {q.name}
                </div>
                <div style={{ fontSize: "clamp(18px,3vw,24px)", fontWeight: 600, color: "#000", marginBottom: 6, letterSpacing: "-.01em" }}>
                  {q.slogan}
                </div>
                <div style={{ fontSize: 14, color: "rgba(0,0,0,0.55)", lineHeight: 1.5 }}>
                  {q.desc}
                </div>
              </div>
              <div style={{ fontSize: 24, color: "rgba(0,0,0,0.25)", marginLeft: 16, flexShrink: 0 }}>→</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
