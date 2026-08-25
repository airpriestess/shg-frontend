import { useNavigate } from "react-router-dom";
import HamburgerMenu from "../components/HamburgerMenu.jsx";

const LG = "linear-gradient(135deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";

function SHGNav() {
  const navigate = useNavigate();
  return (
    <nav onClick={()=>navigate("/")} style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, padding:"18px 32px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"#000000", backdropFilter:"blur(24px)", borderBottom:"1px solid rgba(255,255,255,0.04)", cursor:"pointer" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <img src="/logo_transparent_cropped.png" alt="Self Hypnosis Goddess" width="38" height="38" style={{flexShrink:0, objectFit:"contain", display:"block"}} />
        <span style={{ fontFamily:"'Jost',sans-serif", fontWeight:300, fontSize:15, letterSpacing:"0.02em", color:"#fdf0e8" }}>Self Hypnosis Goddess</span>
      </div>
      <div onClick={(e)=>e.stopPropagation()}>
        <HamburgerMenu/>
      </div>
    </nav>
  );
}

const BLOCKS = [
  {
    key: "money",
    name: "RichGirl Maxxing",
    slogan: "Right place. Right time. Right people. Mine.",
    desc: "Find what's stopping money from finding you.",
    what: ["Why money feels hard to keep", "Why the same ceiling keeps appearing", "Why you're not visible to the people who would pay you"],
    assumption: "Money finds me first. Of course it does.",
    badge: "linear-gradient(160deg,#E8B870,#F5E0A0)",
    color: "#E8B870",
    url: "/blocks/money"
  },
  {
    key: "love",
    name: "Lovemaxxing",
    slogan: "Right person. Right time. Right choice. Mine.",
    desc: "Find what's keeping you from being chosen easily.",
    what: ["Why love feels conditional or earned", "Why you're waiting to be chosen", "Why you compare yourself to other women"],
    assumption: "He chooses me. Every time. Obviously.",
    badge: "linear-gradient(160deg,#BFA5D8,#2CB7A7)",
    color: "#BFA5D8",
    url: "/blocks/love"
  },
  {
    key: "beauty",
    name: "Beautymaxxing",
    slogan: "Right now. Right here. Right as I am. Mine.",
    desc: "Find what's keeping you from feeling gorgeous now.",
    what: ["Why gorgeous feels conditional on fixing something", "Why you compare your body to others", "Why being seen feels uncomfortable"],
    assumption: "Gorgeous is my default. Always has been.",
    badge: "linear-gradient(160deg,#F5E0A0,#E8B870)",
    color: "#F5E0A0",
    url: "/blocks/beauty"
  },
  {
    key: "self",
    name: "Selfmaxxing",
    slogan: "Right room. Right time. Right version. Mine.",
    desc: "Find what's keeping the upgraded version of you waiting.",
    what: ["Why you feel not ready yet", "Why you shrink in rooms that were always yours", "Why the upgraded version of you feels far away"],
    assumption: "I am the upgraded version. She is here now.",
    badge: "linear-gradient(160deg,#2CB7A7,#167A6B)",
    color: "#2CB7A7",
    url: "/blocks/self"
  },
];

export default function Blocks() {
  const navigate = useNavigate();

  return (
    <div style={{ background: "#000", color: "#fdf0e8", fontFamily: "'Jost', sans-serif", fontWeight: 300, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Jost:wght@200;300;400;500;600;700&family=Cormorant+Garamond:ital,wght@1,400&display=swap" rel="stylesheet"/>
      <style>{`
        @keyframes lgGlow {
          0% { box-shadow: 0 0 20px rgba(245,224,160,0.3), 0 0 40px rgba(245,224,160,0.1); }
          33% { box-shadow: 0 0 20px rgba(191,165,216,0.4), 0 0 60px rgba(191,165,216,0.15); }
          66% { box-shadow: 0 0 20px rgba(44,183,167,0.4), 0 0 60px rgba(44,183,167,0.15); }
          100% { box-shadow: 0 0 20px rgba(245,224,160,0.3), 0 0 40px rgba(245,224,160,0.1); }
        }
        .block-card { transition: transform .3s ease; cursor: pointer; }
        .block-card:hover { transform: translateY(-4px); }
      `}</style>
      <SHGNav/>

      {/* HERO */}
      <div style={{ background: LG, padding: "120px 48px 80px", textAlign: "center" }}>
        <div style={{ fontSize: 11, letterSpacing: ".28em", textTransform: "uppercase", color: "#000000", marginBottom: 20 }}> Free diagnostics </div>
        <h1 style={{ fontSize: "clamp(48px,8vw,96px)", fontWeight: 700, color: "#000", letterSpacing: "-.04em", lineHeight: 1, marginBottom: 20 }}>Find your block.</h1>
        <p style={{ fontSize: "clamp(16px,2vw,20px)", color: "#000000", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
          8 questions. Your invisible block, named, and replaced.
        </p>
      </div>

      {/* BLOCKS */}
      <div style={{ padding: "80px 32px", maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
        {BLOCKS.map((block, i) => (
          <div key={i} className="block-card" onClick={() => navigate(block.url)}
            style={{ background: "#fdf0e8", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, overflow: "hidden", animation: "lgGlow 6s ease-in-out infinite", animationDelay: `${i * 1.5}s` }}>
            <div style={{ display: "grid", gridTemplateColumns: "6px 1fr", minHeight: 160 }}>
              {/* Color bar */}
              <div style={{ background: block.badge }}/>
              {/* Content */}
              <div style={{ padding: "36px 40px", display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: 24 }}>
                <div>
                  <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: block.color, marginBottom: 10, fontWeight: 600 }}>{block.name}</div>
                  <h2 style={{ fontSize: "clamp(22px,3vw,36px)", fontWeight: 700, color: "#fdf0e8", letterSpacing: "-.02em", lineHeight: 1.1, marginBottom: 10 }}>{block.slogan}</h2>
                  <p style={{ fontSize: 14, color: "#fdf0e8", lineHeight: 1.6, marginBottom: 20 }}>{block.desc}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {block.what.map((w, j) => (
                      <div key={j} style={{ fontSize: 13, color: "#fdf0e8", display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ color: block.color, fontSize: 10 }}></span> {w}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: "center", minWidth: 140 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(13px,1.5vw,16px)", color: block.color, lineHeight: 1.5, marginBottom: 20, maxWidth: 140 }}>{block.assumption}</div>
                  <div style={{ background: LG, borderRadius: 30, padding: "12px 20px", fontSize: 12, fontWeight: 600, color: "#000", letterSpacing: ".04em", textTransform: "uppercase" }}>
                    Find my block →
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM CTA */}
      <div style={{ padding: "60px 32px 100px", textAlign: "center" }}>
        <p style={{ fontSize: 16, color: "#fdf0e8", lineHeight: 1.7, maxWidth: 400, margin: "0 auto 32px" }}>
          Not sure which one? Take the Lucky Girl quiz, it diagnoses your primary block across all four areas.
        </p>
        <div onClick={() => navigate("/luckygirl")}
          style={{ display: "inline-block", background: LG, borderRadius: 40, padding: "18px 40px", fontSize: 16, fontWeight: 600, color: "#000", cursor: "pointer", letterSpacing: ".03em" }}>
          Take the Lucky Girl quiz
        </div>
      </div>
    </div>
  );
}
