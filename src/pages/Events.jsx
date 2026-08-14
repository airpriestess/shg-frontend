import { useNavigate } from "react-router-dom";

const LG = "linear-gradient(110deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";

function SHGNav() {
  const navigate = useNavigate();
  return (
    <nav onClick={()=>navigate("/")} style={{ display:"flex", alignItems:"center", padding:"0 20px", height:54, borderBottom:"1px solid rgba(255,255,255,0.08)", background:"rgba(0,0,0,0.97)", backdropFilter:"blur(20px)", gap:9, position:"sticky", top:0, zIndex:100, cursor:"pointer" }}>
      <svg viewBox="0 0 100 100" width="24" height="24" style={{flexShrink:0}}>
        <defs><linearGradient id="navlg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#F5E0A0"/><stop offset="20%" stopColor="#E8B870"/><stop offset="52%" stopColor="#BFA5D8"/><stop offset="78%" stopColor="#2CB7A7"/><stop offset="100%" stopColor="#167A6B"/></linearGradient></defs>
        <circle cx="50" cy="33" r="18" fill="none" stroke="url(#navlg)" strokeWidth="2"/>
        <circle cx="67" cy="50" r="18" fill="none" stroke="url(#navlg)" strokeWidth="2"/>
        <circle cx="50" cy="67" r="18" fill="none" stroke="url(#navlg)" strokeWidth="2"/>
        <circle cx="33" cy="50" r="18" fill="none" stroke="url(#navlg)" strokeWidth="2"/>
      </svg>
      <span style={{ fontFamily:"'Jost',sans-serif", fontWeight:300, fontSize:14, letterSpacing:"0.02em", color:"#f2ece4" }}>Self Hypnosis Goddess</span>
    </nav>
  );
}

export default function Events() {
  // TODO: Reshma to provide her real Luma calendar/event embed URL here.
  // Luma embed docs: https://lu.ma/embed -> use the "Embed calendar" or "Embed event" snippet.
  const LUMA_EMBED_URL = "https://lu.ma/embed/calendar/REPLACE-WITH-YOUR-CALENDAR-ID/events";

  return (
    <div style={{ background:"#000", minHeight:"100vh", color:"#f2ece4", fontFamily:"'Jost',sans-serif" }}>
      <SHGNav/>

      <div style={{ textAlign:"center", padding:"64px 24px 40px" }}>
        <div style={{ display:"inline-block", fontSize:10, letterSpacing:".28em", textTransform:"uppercase", marginBottom:20, background:LG, WebkitBackgroundClip:"text", backgroundClip:"text", color:"transparent" }}>
          ✦ Coming Soon ✦
        </div>
        <h1 style={{ fontSize:"clamp(40px,7vw,72px)", fontWeight:400, letterSpacing:"-0.02em", lineHeight:1.05, margin:"0 0 20px" }}>
          Events
        </h1>
        <p style={{ fontSize:17, color:"#c8bcb0", maxWidth:480, margin:"0 auto", lineHeight:1.7 }}>
          Live sessions, workshops, and in-person gatherings — book your spot below.
        </p>
      </div>

      <div style={{ maxWidth:900, margin:"0 auto", padding:"0 24px 100px" }}>
        <div style={{ borderRadius:20, overflow:"hidden", border:"1px solid rgba(255,255,255,0.08)", background:"#0a0a0a", minHeight:600 }}>
          <iframe
            src={LUMA_EMBED_URL}
            width="100%"
            height="600"
            frameBorder="0"
            style={{ border:"none", display:"block" }}
            allow="fullscreen; payment"
            aria-hidden="false"
            title="Self Hypnosis Goddess Events"
          />
        </div>
        <p style={{ textAlign:"center", fontSize:13, color:"#8a7d72", marginTop:16 }}>
          Powered by Luma
        </p>
      </div>
    </div>
  );
}
