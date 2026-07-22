import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LG = "linear-gradient(135deg,#F5E0A0 0%,#E8B870 20%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";

export default function HamburgerMenu({ onSignIn }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const go = (fn) => { fn(); setOpen(false); };

  const items = [
    ["Home",               () => navigate("/")],
    ["About Reshma",       () => navigate("/about")],
    ["The Science",        () => navigate("/science")],
    ["The Library",        () => navigate("/library")],
    ["Shop Maxxing Guides",() => window.open("https://beacons.ai/reshmaoracle","_blank")],
    ["YouTube",            () => window.open("https://youtube.com/@reshmaoracle","_blank")],
  ];

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(true)}
        style={{ width:44,height:44,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:5,padding:0,WebkitTapHighlightColor:"transparent" }}
        aria-label="Open menu">
        <div style={{ width:22,height:2,background:"#f2ece4",borderRadius:1 }}/>
        <div style={{ width:22,height:2,background:"#f2ece4",borderRadius:1 }}/>
        <div style={{ width:22,height:2,background:"#f2ece4",borderRadius:1 }}/>
      </button>

      {/* Full-screen menu */}
      {open && (
        <div style={{ position:"fixed",inset:0,zIndex:999,background:"#000",display:"flex",flexDirection:"column",padding:"0 32px 48px" }}>
          {/* Top bar */}
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",height:"calc(98px + env(safe-area-inset-top,0px))",paddingTop:"env(safe-area-inset-top,0px)" }}>
            <span onClick={()=>go(()=>navigate("/"))} style={{ fontFamily:"'Jost',sans-serif",fontWeight:300,fontSize:18,letterSpacing:"0.02em",color:"#f2ece4",cursor:"pointer" }}>
              Self Hypnosis Goddess
            </span>
            <button onClick={()=>setOpen(false)} style={{ background:"none",border:"none",cursor:"pointer",padding:8,color:"#f2ece4",WebkitTapHighlightColor:"transparent" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="4" y1="4" x2="20" y2="20"/><line x1="20" y1="4" x2="4" y2="20"/>
              </svg>
            </button>
          </div>

          {/* Nav items */}
          <div style={{ flex:1,display:"flex",flexDirection:"column",justifyContent:"center",gap:0 }}>
            {items.map(([label, fn], i) => (
              <button key={i} onClick={()=>go(fn)}
                style={{ display:"block",width:"100%",textAlign:"left",padding:"10px 0",background:"none",border:"none",borderBottom:"1px solid rgba(44,183,167,0.12)",color:"#f2ece4",fontSize:"clamp(24px,6vw,38px)",fontWeight:300,letterSpacing:"0.02em",cursor:"pointer",fontFamily:"'Jost',sans-serif",WebkitTapHighlightColor:"transparent",lineHeight:1.15 }}>
                {label}
              </button>
            ))}
          </div>

          {/* Bottom CTAs */}
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            <button onClick={()=>go(()=>navigate("/"))} style={{ width:"100%",padding:"16px",background:LG,border:"none",borderRadius:12,color:"#000",fontSize:16,fontWeight:500,cursor:"pointer",fontFamily:"'Jost',sans-serif",letterSpacing:"0.06em",WebkitTapHighlightColor:"transparent" }}>
              Join Now ✦
            </button>
            {onSignIn && (
              <button onClick={()=>go(onSignIn)} style={{ width:"100%",padding:"16px",background:"none",border:"1px solid rgba(44,183,167,0.4)",borderRadius:12,color:"#f2ece4",fontSize:16,fontWeight:400,cursor:"pointer",fontFamily:"'Jost',sans-serif",letterSpacing:"0.06em",WebkitTapHighlightColor:"transparent" }}>
                Sign in
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
