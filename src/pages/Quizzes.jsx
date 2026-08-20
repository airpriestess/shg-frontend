import { useNavigate } from "react-router-dom";

const LG = "linear-gradient(110deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";

const QUIZZES = [
  { key: "assumption", name: "The Assumption Quiz", desc: "What's the assumption running your life?", tag: "8 questions", color: "#BFA5D8", url: "/quiz" },
  { key: "luckygirl",  name: "Lucky Girl Block",     desc: "What's blocking your Lucky Girl era?",     tag: "8 questions", color: "#2CB7A7", url: "/luckygirl" },
  { key: "richgirl",   name: "RichGirl",             desc: "Right place. Right time. Right people.",   tag: "Quiz",        color: "#E8B870", url: "/richgirl" },
  { key: "blocks",     name: "Pick Your Block",      desc: "Which area of your life feels stuck?",      tag: "4 categories", color: "#F5E0A0", url: "/blocks" },
];

function SHGNav() {
  const navigate = useNavigate();
  return (
    <nav style={{ display:"flex", alignItems:"center", padding:"0 20px", height:54, borderBottom:"1px solid #1c1828", background:"rgba(0,0,0,0.97)", backdropFilter:"blur(20px)", gap:9, cursor:"pointer" }} onClick={()=>navigate("/")}>
      <img src="/logo_transparent_cropped.png" alt="Self Hypnosis Goddess" width="38" height="38" style={{flexShrink:0, objectFit:"contain", display:"block"}} />
      <span style={{ fontFamily:"'Jost',sans-serif", fontWeight:300, fontSize:"clamp(11px,3.2vw,14px)", letterSpacing:"0.02em", color:"#fdf0e8", whiteSpace:"nowrap" }}>Self Hypnosis Goddess</span>
    </nav>
  );
}

export default function Quizzes() {
  const navigate = useNavigate();

  return (
    <div style={{ background: LG, color: "#000", fontFamily: "'Jost', sans-serif", fontWeight: 300, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet"/>

      <SHGNav/>

      <div style={{ textAlign: "center", padding: "64px 24px 40px" }}>
        <div style={{ display: "inline-block", fontSize: 10, letterSpacing: ".28em", textTransform: "uppercase", marginBottom: 28, color: "#000000" }}>
          ✦ Find your block ✦
        </div>
        <h1 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: "clamp(40px,7vw,76px)", lineHeight: 1.05, color: "#000", marginBottom: 20, letterSpacing: "-.02em" }}>
          Which quiz calls you?
        </h1>
        <p style={{ fontSize: 17, color: "#000000", lineHeight: 1.7, maxWidth: 460, margin: "0 auto" }}>
          Every quiz finds one thing: the invisible belief that's been running the show. Pick where it's showing up loudest.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 20, maxWidth: 720, margin: "0 auto 80px", padding: "0 24px" }}>
        {QUIZZES.map(q => (
          <div
            key={q.key}
            onClick={() => navigate(q.url)}
            style={{ background: "#fdf0e8", border: "2px solid transparent", borderRadius: 24, padding: "40px 24px", textAlign: "center", cursor: "pointer", transition: "all .2s", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.15)"; e.currentTarget.style.borderColor = q.color; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fdf0e8"; e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.08)"; e.currentTarget.style.borderColor = "transparent"; }}
          >
            <div style={{ fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase", color: q.color, marginBottom: 12, fontWeight: 500 }}>{q.tag}</div>
            <div style={{ fontSize: 21, fontWeight: 500, color: "#000", marginBottom: 10, fontFamily: "'Jost',sans-serif" }}>{q.name}</div>
            <div style={{ fontSize: 14, color: "#000000", lineHeight: 1.6 }}>{q.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
