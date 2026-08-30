/* SiteHeader — the ONE banner+nav used on every page. Never fork this again per-page. */
import { useNavigate } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu.jsx";

export default function SiteHeader({ isMobile }) {
  const navigate = useNavigate();
  return (
    <>
      {/* ANNOUNCEMENT BANNER */}
      <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:400, height: isMobile?48:44, paddingTop:"env(safe-area-inset-top,0px)", boxSizing:"border-box", display:"flex", alignItems:"center", justifyContent:"center", gap: isMobile?8:20, overflow:"hidden", padding: isMobile?"0 10px":"0 20px", background:"linear-gradient(90deg,#F5E0A0,#E8B870,#BFA5D8,#2CB7A7,#167A6B,#2CB7A7,#BFA5D8,#E8B870,#F5E0A0)", backgroundSize:"300% 100%", animation:"drift 5s ease-in-out infinite", boxShadow:"0 0 24px rgba(232,184,112,0.4), 0 0 48px rgba(44,183,167,0.2)" }}>
        <span style={{ fontFamily:"'Jost',sans-serif", fontSize: isMobile?10:12, fontWeight:600, letterSpacing: isMobile?"0.06em":"0.18em", whiteSpace:"nowrap", textTransform:"uppercase", color:"#000", overflow:"hidden", textOverflow:"ellipsis", minWidth:0 }}>
          {isMobile ? "Hot Mess to Goddess." : "From Hot Mess to Goddess (of course, obviously.)"}
        </span>
        <button onClick={()=>navigate("/waitlist")} style={{ padding: isMobile?"5px 10px":"5px 16px", background:"rgba(0,0,0,0.18)", border:"1px solid rgba(0,0,0,0.35)", borderRadius:20, color:"#000", fontSize: isMobile?10:11, fontWeight:600, cursor:"pointer", flexShrink:0, whiteSpace:"nowrap", fontFamily:"'Jost',sans-serif", letterSpacing: isMobile?"0.04em":"0.1em", textTransform:"uppercase" }}>
          {isMobile ? "Join Waitlist →" : "Join the Waitlist →"}
        </button>
      </div>

      {/* NAV */}
      <nav style={{ position:"fixed", top:`calc(${isMobile?"44px":"48px"} + env(safe-area-inset-top,0px))`, left:0, right:0, zIndex:300, height:54, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 20px", background:"rgba(0,0,0,0.97)", borderBottom:"1px solid #1c1828", backdropFilter:"blur(20px)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:9, flex: isMobile?"0 0 auto":"1 1 0" }}>
          <img src="/logo_transparent_cropped.png" alt="Self Hypnosis Goddess" width="38" height="38" style={{flexShrink:0, objectFit:"contain", display:"block"}} onClick={()=>navigate("/")} />
          <span style={{ fontFamily:"'Jost',sans-serif", fontWeight:300, fontSize:"clamp(11px,3.2vw,14px)", letterSpacing:"0.02em", cursor:"pointer", whiteSpace:"nowrap", flexShrink:1, minWidth:0, overflow:"hidden", textOverflow:"ellipsis", maxWidth: isMobile?"68vw":"none", color:"#fdf0e8" }} onClick={()=>navigate("/")}>Self Hypnosis Goddess</span>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center", flex:"0 0 auto", justifyContent:"flex-end" }}>
          <a href="/gift?utm_source=site&utm_medium=nav_cta&utm_campaign=free_gift" style={{ padding: isMobile?"7px 12px":"8px 16px", background:"linear-gradient(135deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)", borderRadius:40, color:"#000", fontSize: isMobile?9:11, fontWeight:600, letterSpacing: isMobile?"0.06em":"0.14em", textTransform:"uppercase", textDecoration:"none", whiteSpace:"nowrap", flexShrink:0 }}>
            {isMobile ? "Free Gift" : "Claim Free Gift"}
          </a>
          <HamburgerMenu/>
        </div>
      </nav>
    </>
  );
}
