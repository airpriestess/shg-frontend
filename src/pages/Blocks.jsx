import { useNavigate } from "react-router-dom";

const LG = "linear-gradient(110deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";

const CATEGORIES = [
  { key: "money", name: "Moneymaxxing", desc: "Why money keeps slipping through your hands", color: "#E8B870", url: "/blocks/money" },
  { key: "love", name: "Lovemaxxing", desc: "Why love feels conditional or hard to keep", color: "#BFA5D8", url: "/blocks/love" },
  { key: "beauty", name: "Beautymaxxing", desc: "Why gorgeous feels like something you're still working towards", color: "#F5E0A0", url: "/blocks/beauty" },
  { key: "self", name: "Selfmaxxing", desc: "Why the upgraded version of you feels just out of reach", color: "#2CB7A7", url: "/blocks/self" }
];

function LogoMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
      <defs>
        <linearGradient id="lgmb" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5E0A0"/>
          <stop offset="22%" stopColor="#E8B870"/>
          <stop offset="52%" stopColor="#BFA5D8"/>
          <stop offset="78%" stopColor="#2CB7A7"/>
          <stop offset="100%" stopColor="#167A6B"/>
        </linearGradient>
      </defs>
      <circle cx="10" cy="10" r="7" stroke="url(#lgmb)" strokeWidth="1.5" fill="none"/>
      <circle cx="18" cy="10" r="7" stroke="url(#lgmb)" strokeWidth="1.5" fill="none"/>
      <circle cx="10" cy="18" r="7" stroke="url(#lgmb)" strokeWidth="1.5" fill="none"/>
      <circle cx="18" cy="18" r="7" stroke="url(#lgmb)" strokeWidth="1.5" fill="none"/>
    </svg>
  );
}

export default function Blocks() {
  const navigate = useNavigate();

  return (
    <div style={{ background: "#000", color: "#f2ece4", fontFamily: "'Jost', sans-serif", fontWeight: 300, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet"/>

      <nav style={{ display: "flex", alignItems: "center", padding: "18px 28px", borderBottom: "1px solid #111", gap: 10 }}>
        <LogoMark/>
        <span style={{ fontSize: 13, letterSpacing: ".1em", color: "#f2ece4" }}>Reshma Oracle</span>
      </nav>

      <div style={{ textAlign: "center", padding: "64px 24px 40px" }}>
        <div style={{ display: "inline-block", fontSize: 10, letterSpacing: ".28em", textTransform: "uppercase", marginBottom: 28, background: LG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
          ✦ Pick your block ✦
        </div>
        <h1 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: "clamp(30px,5.5vw,56px)", lineHeight: 1.1, color: "#f2ece4", marginBottom: 16, letterSpacing: "-.01em" }}>
          Which area of your life<br/>feels stuck?
        </h1>
        <p style={{ fontSize: 15, color: "#7a6e68", lineHeight: 1.7, maxWidth: 380, margin: "0 auto" }}>
          Choose a category. 8 questions. Your invisible block — named, and replaced.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, maxWidth: 520, margin: "0 auto 80px", padding: "0 24px" }}>
        {CATEGORIES.map(cat => (
          <div
            key={cat.key}
            onClick={() => navigate(cat.url)}
            style={{ background: "#080808", border: "1px solid #1a1a1a", borderRadius: 16, padding: "28px 20px", textAlign: "center", cursor: "pointer", transition: "border-color .2s, background .2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color; e.currentTarget.style.background = "#0d0d0d"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#1a1a1a"; e.currentTarget.style.background = "#080808"; }}
          >
            <div style={{ fontSize: 22, color: cat.color, marginBottom: 12 }}>✦</div>
            <div style={{ fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", background: LG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", marginBottom: 8, fontWeight: 400 }}>
              {cat.name}
            </div>
            <div style={{ fontSize: 12, color: "#5a5048", lineHeight: 1.6 }}>{cat.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
