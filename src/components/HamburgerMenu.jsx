import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

const LG = "linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)";

export default function HamburgerMenu({ onSignIn }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const go = (fn) => { fn(); setOpen(false); };

  const items = [
    ["Home",               () => navigate("/")],
    ["Free Gift",          () => { window.location.href = "/gift?utm_source=site&utm_medium=hamburger&utm_campaign=free_gift"; }],
    ["About Reshma",       () => navigate("/about")],
    ["The Library",        () => navigate("/library")],
    ["Journal",            () => { window.location.href = "/blog"; }],
    ["Guides",             () => { window.location.href = "/guides"; }],
    ["Find your block",    () => { window.location.href = "/blocks"; }],
    ["The Science",        () => navigate("/science")],
    ["Preview the Portal", () => navigate("/portal?preview=1&theme=dark")],
  ];

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(true)}
        style={{ width:44,height:44,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:5,padding:0,WebkitTapHighlightColor:"transparent" }}
        aria-label="Open menu">
        <div style={{ width:22,height:2,background:"#fdf0e8",borderRadius:1 }}/>
        <div style={{ width:22,height:2,background:"#fdf0e8",borderRadius:1 }}/>
        <div style={{ width:22,height:2,background:"#fdf0e8",borderRadius:1 }}/>
      </button>

      {/* Full-screen menu, rendered via portal to escape any ancestor backdrop-filter/transform that would break position:fixed */}
      {open && createPortal(
        <div style={{ position:"fixed",inset:0,zIndex:9999,backgroundColor:"#000000",opacity:1,isolation:"isolate",display:"flex",flexDirection:"column",padding:"0 32px 48px" }}>
          {/* Top bar */}
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",height:"calc(98px + env(safe-area-inset-top,0px))",paddingTop:"env(safe-area-inset-top,0px)" }}>
            <span onClick={()=>go(()=>navigate("/"))} style={{ fontFamily:"'Jost',sans-serif",fontWeight:300,fontSize:18,letterSpacing:"0.02em",color:"#fdf0e8",cursor:"pointer" }}>
              Self Hypnosis Goddess
            </span>
            <button onClick={()=>setOpen(false)} style={{ background:"none",border:"none",cursor:"pointer",padding:8,color:"#fdf0e8",WebkitTapHighlightColor:"transparent" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="4" y1="4" x2="20" y2="20"/><line x1="20" y1="4" x2="4" y2="20"/>
              </svg>
            </button>
          </div>

          {/* Nav items */}
          <div style={{ flex:1,display:"flex",flexDirection:"column",justifyContent:"center",gap:0 }}>
            {items.map(([label, fn], i) => (
              <button key={i} onClick={()=>go(fn)}
                style={{ display:"block",width:"100%",textAlign:"left",padding:"10px 0",background:"none",border:"none",borderBottom:"1px solid rgba(44,183,167,0.12)",color:"#fdf0e8",fontSize:"clamp(18px,4vw,26px)",fontWeight:300,letterSpacing:"0.02em",cursor:"pointer",fontFamily:"'Jost',sans-serif",WebkitTapHighlightColor:"transparent",lineHeight:1.15 }}>
                {label}
              </button>
            ))}
          </div>

          {/* Bottom CTAs */}
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            <button onClick={()=>go(()=>{ navigate("/"); setTimeout(()=>{ const e=new CustomEvent("openWaitlist"); window.dispatchEvent(e); },300); })} style={{ width:"100%",padding:"16px",background:LG,border:"none",borderRadius:12,color:"#000",fontSize:16,fontWeight:500,cursor:"pointer",fontFamily:"'Jost',sans-serif",letterSpacing:"0.08em",textTransform:"uppercase",WebkitTapHighlightColor:"transparent" }}>
              Join Waitlist
            </button>
            {onSignIn && (
              <button onClick={()=>go(onSignIn)} style={{ width:"100%",padding:"16px",background:"none",border:"1px solid rgba(44,183,167,0.4)",borderRadius:12,color:"#fdf0e8",fontSize:16,fontWeight:400,cursor:"pointer",fontFamily:"'Jost',sans-serif",letterSpacing:"0.06em",WebkitTapHighlightColor:"transparent" }}>
                Sign in
              </button>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
