import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

const _sb = createClient(
  "https://qtwvslrwmreazmrdktsn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0d3ZzbHJ3bXJlYXptcmRrdHNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMDY4MDIsImV4cCI6MjA1ODU4MjgwMn0.JNLDGl3690fKBdXOtTOPMi8f2xN0jfRWCeaekCv3tHo"
);

const LG = "linear-gradient(135deg,#F5E0A0 0%,#E8B870 20%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | saving | done | error
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const em = email.trim();
    if (!em || !em.includes("@")) { setStatus("error"); return; }
    setStatus("saving");
    const { error } = await _sb.from("waitlist").insert({ email: em, source: "waitlist_page" });
    if (error && !error.message?.includes("duplicate")) { setStatus("error"); return; }
    setStatus("done");
  };

  return (
    <div style={{ minHeight:"100vh", background:"#000", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 24px", fontFamily:"'Jost',sans-serif" }}>

      {/* Logo */}
      <div onClick={() => navigate("/")} style={{ cursor:"pointer", marginBottom:48 }}>
        <svg viewBox="0 0 100 102" width={52} height={52}>
          <defs>
            <linearGradient id="wlg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#F5E0A0"/>
              <stop offset="20%"  stopColor="#E8B870"/>
              <stop offset="52%"  stopColor="#BFA5D8"/>
              <stop offset="78%"  stopColor="#2CB7A7"/>
              <stop offset="100%" stopColor="#167A6B"/>
            </linearGradient>
          </defs>
          <circle cx="35" cy="35" r="16" fill="none" stroke="url(#wlg)" strokeWidth="2"/>
          <circle cx="65" cy="35" r="16" fill="none" stroke="url(#wlg)" strokeWidth="2"/>
          <circle cx="35" cy="65" r="16" fill="none" stroke="url(#wlg)" strokeWidth="2"/>
          <circle cx="65" cy="65" r="16" fill="none" stroke="url(#wlg)" strokeWidth="2"/>
        </svg>
      </div>

      {status === "done" ? (
        /* SUCCESS STATE */
        <div style={{ textAlign:"center", maxWidth:480 }}>
          <div style={{ fontSize:48, marginBottom:20 }}>✦</div>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"clamp(32px,6vw,52px)", color:"#f2ece4", lineHeight:1.1, marginBottom:16 }}>
            Of course, obviously.
          </div>
          <div style={{ fontSize:16, color:"rgba(242,236,228,0.55)", lineHeight:1.75, marginBottom:40 }}>
            You're in. You'll hear from me before anyone else when the audio library opens.
          </div>
          <button
            onClick={() => navigate("/")}
            style={{ background:"none", border:"1px solid rgba(255,255,255,0.15)", borderRadius:30, padding:"12px 32px", color:"rgba(242,236,228,0.5)", fontSize:13, cursor:"pointer", fontFamily:"'Jost',sans-serif", letterSpacing:"0.1em" }}
          >
            ← Back to site
          </button>
        </div>
      ) : (
        /* FORM STATE */
        <div style={{ textAlign:"center", maxWidth:520, width:"100%" }}>

          {/* Label */}
          <div style={{ fontSize:11, letterSpacing:"0.28em", textTransform:"uppercase", color:"rgba(242,236,228,0.35)", marginBottom:24 }}>
            Self Hypnosis Goddess
          </div>

          {/* Headline */}
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"clamp(36px,7vw,64px)", color:"#f2ece4", lineHeight:1.05, marginBottom:16 }}>
            Manifest your dream reality.
          </div>

          {/* Sub */}
          <div style={{ fontSize:16, color:"rgba(242,236,228,0.5)", lineHeight:1.75, marginBottom:12, maxWidth:400, margin:"0 auto 12px" }}>
            The audio membership that reprograms your subconscious while you sleep.
          </div>
          <div style={{ fontSize:12, color:"rgba(242,236,228,0.25)", letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:48 }}>
            Hypnosis · Subliminals · EMDR · Binaural Beats · Melodic House
          </div>

          {/* Form */}
          <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14, width:"100%" }}>
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={e => { setEmail(e.target.value); setStatus("idle"); }}
              style={{
                width:"100%", maxWidth:400,
                background:"rgba(255,255,255,0.05)",
                border: status === "error" ? "1px solid #B76E79" : "1px solid rgba(255,255,255,0.12)",
                borderRadius:14, padding:"16px 20px",
                color:"#f2ece4", fontSize:16,
                fontFamily:"'Jost',sans-serif",
                outline:"none",
                textAlign:"center",
              }}
            />
            {status === "error" && (
              <div style={{ fontSize:12, color:"#B76E79", fontFamily:"'Jost',sans-serif" }}>
                Please enter a valid email address.
              </div>
            )}
            <button
              type="submit"
              disabled={status === "saving"}
              style={{
                background: LG, border:"none", borderRadius:40,
                padding:"18px 56px", color:"#000",
                fontSize:16, fontWeight:400,
                fontFamily:"'Jost',sans-serif", letterSpacing:"0.04em",
                cursor: status === "saving" ? "default" : "pointer",
                opacity: status === "saving" ? 0.7 : 1,
                width:"100%", maxWidth:400,
              }}
            >
              {status === "saving" ? "Saving..." : "Join the waitlist →"}
            </button>
          </form>

          {/* Reassurance */}
          <div style={{ marginTop:28, fontSize:12, color:"rgba(242,236,228,0.2)", letterSpacing:"0.06em" }}>
            No spam. First to know when we open.
          </div>

          {/* Back link */}
          <div style={{ marginTop:48 }}>
            <span
              onClick={() => navigate("/")}
              style={{ fontSize:12, color:"rgba(242,236,228,0.25)", cursor:"pointer", letterSpacing:"0.1em", textTransform:"uppercase" }}
            >
              ← reshmaoracle.com
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
