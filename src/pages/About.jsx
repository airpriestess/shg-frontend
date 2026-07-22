/* About — Reshma Oracle */
import { useState, useEffect, useRef } from "react";

const LG = "linear-gradient(135deg,#F5E0A0 0%,#E8B870 20%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";
const CREAM = "#fdf0e8";
const BLACK = "#000000";
const ROSE  = "#B76E79";
const TEAL  = "#2CB7A7";
const MU    = "#a09080";

export default function About({ onBack }) {
  const topRef = useRef(null);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth <= 768);

  useEffect(() => {
    // Scroll to top
    if (topRef.current) topRef.current.scrollIntoView({ behavior: "instant" });
    document.documentElement.scrollTop = 0;
    window.scrollTo(0, 0);
    const h = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  return (
    <div ref={topRef} style={{ minHeight:"100vh", background:BLACK, color:CREAM, fontFamily:"'Jost',sans-serif" }}>

      {/* ── NAV ── */}
      <div style={{ position:"sticky", top:0, zIndex:50, background:"rgba(0,0,0,0.92)", backdropFilter:"blur(12px)", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"0 24px", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:MU, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontFamily:"'Jost',sans-serif", letterSpacing:"0.04em" }}>
          ← Back
        </button>
        <span style={{ fontSize:12, color:MU, letterSpacing:"0.18em", textTransform:"uppercase" }}>About Reshma · reshmaoracle.com</span>
        <div style={{ width:60 }}/>
      </div>

      {/* ── HERO ── */}
      <div style={{ width:"100%", background:LG, padding: isMobile?"64px 24px 56px":"88px 24px 72px", textAlign:"center" }}>
        {/* Clover mark */}
        <div style={{ display:"flex", justifyContent:"center", marginBottom:24 }}>
          <svg viewBox="0 0 100 102" width={isMobile?56:72} height={isMobile?56:72} fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="35" cy="35" r="18" fill="none" stroke="#000" strokeWidth="3.5"/>
            <circle cx="65" cy="35" r="18" fill="none" stroke="#000" strokeWidth="3.5"/>
            <circle cx="35" cy="65" r="18" fill="none" stroke="#000" strokeWidth="3.5"/>
            <circle cx="65" cy="65" r="18" fill="none" stroke="#000" strokeWidth="3.5"/>
            <line x1="50" y1="80" x2="50" y2="97" stroke="#000" strokeWidth="3.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div style={{ fontFamily:"'Jost',sans-serif", fontSize:13, letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(0,0,0,0.55)", marginBottom:18 }}>Self Hypnosis Goddess</div>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize: isMobile?"clamp(38px,10vw,54px)":"clamp(48px,5vw,72px)", color:BLACK, margin:"0 0 20px", lineHeight:1.1, fontWeight:400 }}>
          The woman behind the shift.
        </h1>
        <p style={{ fontSize: isMobile?16:18, color:"rgba(0,0,0,0.65)", maxWidth:520, margin:"0 auto", lineHeight:1.7 }}>
          Ten years. A brain rewired. A system built from the inside out.
        </p>
      </div>

      {/* ── IDENTITY TRANSFORMATION VISUAL ── */}
      <div style={{ background:CREAM, padding: isMobile?"56px 20px":"72px 24px" }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <p style={{ fontSize:11, letterSpacing:"0.22em", textTransform:"uppercase", color:MU, textAlign:"center", marginBottom:48 }}>The transformation</p>

          <div style={{ display:"flex", alignItems:"stretch", gap: isMobile?0:0, flexDirection: isMobile?"column":"row", borderRadius:20, overflow:"hidden", boxShadow:"0 8px 48px rgba(0,0,0,0.12)" }}>

            {/* OLD SELF — grayscale */}
            <div style={{ flex:1, background:"#1a1a1a", padding: isMobile?"36px 28px":"48px 40px", display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ fontSize:10, letterSpacing:"0.25em", textTransform:"uppercase", color:"#666", marginBottom:4 }}>Then</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize: isMobile?28:36, color:"#888", lineHeight:1.2, fontWeight:400 }}>
                The version of her that searched.
              </div>
              <div style={{ width:32, height:1, background:"#444", margin:"8px 0" }}/>
              {[
                "Trying to think her way into a different life",
                "Repeating affirmations that didn't land",
                "Reading every book, starting every habit",
                "Feeling the gap but not knowing how to close it",
                "Believing change was possible — for other people",
              ].map((t, i) => (
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:"#444", marginTop:7, flexShrink:0 }}/>
                  <span style={{ fontSize:14, color:"#777", lineHeight:1.6 }}>{t}</span>
                </div>
              ))}
            </div>

            {/* DIVIDER ARROW */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", background: isMobile?"#000":"#000", padding: isMobile?"16px 24px":"0 24px", flexShrink:0 }}>
              <div style={{ fontSize: isMobile?28:36, background:LG, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", transform: isMobile?"rotate(90deg)":"none" }}>→</div>
            </div>

            {/* NEW SELF — full colour */}
            <div style={{ flex:1, background:LG, padding: isMobile?"36px 28px":"48px 40px", display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ fontSize:10, letterSpacing:"0.25em", textTransform:"uppercase", color:"rgba(0,0,0,0.45)", marginBottom:4 }}>Now</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize: isMobile?28:36, color:BLACK, lineHeight:1.2, fontWeight:400 }}>
                The version that knows how.
              </div>
              <div style={{ width:32, height:1, background:"rgba(0,0,0,0.2)", margin:"8px 0" }}/>
              {[
                "Identity built from the subconscious up",
                "Understanding how the brain actually rewires",
                "Embodying the state before the evidence arrives",
                "Closing the gap through emotion, not willpower",
                "Building a system so others don't have to wait a decade",
              ].map((t, i) => (
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:"rgba(0,0,0,0.35)", marginTop:7, flexShrink:0 }}/>
                  <span style={{ fontSize:14, color:"rgba(0,0,0,0.75)", lineHeight:1.6 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── THE GAP ── */}
      <div style={{ background:BLACK, padding: isMobile?"56px 20px":"80px 24px", textAlign:"center" }}>
        <div style={{ maxWidth:680, margin:"0 auto" }}>
          <p style={{ fontSize:11, letterSpacing:"0.22em", textTransform:"uppercase", color:MU, marginBottom:32 }}>The gap</p>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize: isMobile?"clamp(28px,8vw,44px)":"clamp(36px,4vw,52px)", color:CREAM, lineHeight:1.25, fontWeight:400, marginBottom:32 }}>
            There is a version of you that already exists.
          </h2>
          <p style={{ fontSize: isMobile?16:18, color:"rgba(253,240,232,0.65)", lineHeight:1.8, marginBottom:24 }}>
            You feel her in the ache. In the wanting. In the quiet knowing that something is supposed to be different. That feeling is not a flaw. It is gravity — two versions of you pulling toward each other.
          </p>
          <p style={{ fontSize: isMobile?16:18, color:"rgba(253,240,232,0.65)", lineHeight:1.8, marginBottom:24 }}>
            The gap between who you are and who you know you're becoming — that ache in the middle — is the universe trying to collapse the distance. The current self. The dream self. And the pull between them.
          </p>
          <p style={{ fontSize: isMobile?16:18, color:"rgba(253,240,232,0.65)", lineHeight:1.8 }}>
            You close it through feeling. Through embodiment. Through getting your nervous system to believe in what your mind already knows is true.
          </p>
        </div>
      </div>

      {/* ── THE JOURNEY — tech boxes ── */}
      <div style={{ background:CREAM, padding: isMobile?"56px 20px":"80px 24px" }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <p style={{ fontSize:11, letterSpacing:"0.22em", textTransform:"uppercase", color:MU, textAlign:"center", marginBottom:16 }}>Ten years of understanding</p>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize: isMobile?"clamp(28px,7vw,40px)":"clamp(32px,3.5vw,48px)", color:BLACK, textAlign:"center", lineHeight:1.25, fontWeight:400, marginBottom:48 }}>
            The brain rewires. Here is how.
          </h2>

          <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr":"1fr 1fr", gap:20 }}>
            {[
              { year:"Year 1–3", label:"Brainwave States", body:"Discovered that consciousness has a frequency. Theta isn't sleep — it's the one window where the subconscious takes new instructions without filtering them." },
              { year:"Year 3–5", label:"Identity & Subconscious", body:"Realised the mind doesn't change through logic. It changes through repeated emotional experience at the right depth. The subconscious runs on feeling, not reasoning." },
              { year:"Year 5–7", label:"Heart-Brain Coherence", body:"The heart has 40,000 neurons. When heart and brain synchronise, the body stops resisting change. Emotion becomes the signal that rewrites the program." },
              { year:"Year 7–9", label:"Bilateral Audio & EMDR", body:"Bilateral sound activates both hemispheres simultaneously. Defences drop. Trauma dissolves. The new identity installs without the old pattern fighting back." },
              { year:"Year 9–10", label:"The System", body:"Combined theta induction, subliminals, 528hz, EMDR, and melodic house into a single audio format. The result: identity-level change without years of work." },
              { year:"Now", label:"Self Hypnosis Goddess", body:"A membership of audio built to get you to theta and hold you there. Every track closes the gap between who you are and who you already know you're becoming.", highlight:true },
            ].map(({ year, label, body, highlight }, i) => (
              <div key={i} style={{
                background: highlight ? LG : BLACK,
                borderRadius:16,
                padding:"32px 28px",
                border: highlight ? "none" : "1px solid rgba(253,240,232,0.08)",
              }}>
                <div style={{ fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase", color: highlight ? "rgba(0,0,0,0.45)" : MU, marginBottom:10 }}>{year}</div>
                <div style={{ fontSize: isMobile?18:20, fontWeight:500, color: highlight ? BLACK : CREAM, marginBottom:14, letterSpacing:"0.01em" }}>{label}</div>
                <p style={{ fontSize:14, color: highlight ? "rgba(0,0,0,0.7)" : "rgba(253,240,232,0.6)", lineHeight:1.7, margin:0 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── WHY SHE BUILT IT ── */}
      <div style={{ background:BLACK, padding: isMobile?"56px 20px":"80px 24px" }}>
        <div style={{ maxWidth:680, margin:"0 auto" }}>
          <p style={{ fontSize:11, letterSpacing:"0.22em", textTransform:"uppercase", color:MU, textAlign:"center", marginBottom:40 }}>Why she built it</p>
          <blockquote style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize: isMobile?"clamp(22px,6vw,32px)":"clamp(26px,3vw,38px)", color:CREAM, lineHeight:1.5, fontWeight:400, margin:"0 0 32px", textAlign:"center" }}>
            "I didn't find a system that worked the way I knew it needed to work. So I built one."
          </blockquote>
          <p style={{ fontSize: isMobile?16:17, color:"rgba(253,240,232,0.6)", lineHeight:1.8, marginBottom:20, textAlign:"center" }}>
            This is not about affirmations. It is not about mindset. It is not about trying harder.
          </p>
          <p style={{ fontSize: isMobile?16:17, color:"rgba(253,240,232,0.6)", lineHeight:1.8, textAlign:"center" }}>
            It is about getting your nervous system to stop running the old identity — and giving the new one somewhere to land.
          </p>
        </div>
      </div>

      {/* ── WHAT IT CLOSES ── */}
      <div style={{ background:CREAM, padding: isMobile?"56px 20px":"80px 24px" }}>
        <div style={{ maxWidth:820, margin:"0 auto", textAlign:"center" }}>
          <p style={{ fontSize:11, letterSpacing:"0.22em", textTransform:"uppercase", color:MU, marginBottom:16 }}>Whatever your gap looks like</p>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize: isMobile?"clamp(26px,7vw,40px)":"clamp(32px,3.5vw,48px)", color:BLACK, lineHeight:1.25, fontWeight:400, marginBottom:20 }}>
            Your belief system is the only thing standing between you and it.
          </h2>
          <p style={{ fontSize: isMobile?16:17, color:"rgba(0,0,0,0.55)", lineHeight:1.8, maxWidth:560, margin:"0 auto 48px" }}>
            Not your circumstances. Not your past. Not your luck. The subconscious runs a program. The program can be changed. That is all this is.
          </p>

          <div style={{ display:"flex", flexWrap:"wrap", gap:12, justifyContent:"center" }}>
            {[
              "10k a day", "Dream relationship", "Unshakeable confidence",
              "A body you love", "Belief in yourself", "A life that looks delusional from the outside",
              "Owning it before you have it", "The version of you that isn't waiting",
            ].map((t, i) => (
              <div key={i} style={{
                padding:"10px 20px",
                borderRadius:40,
                background: i % 3 === 0 ? LG : "transparent",
                border: i % 3 === 0 ? "none" : `1px solid rgba(0,0,0,0.18)`,
                color: i % 3 === 0 ? BLACK : "rgba(0,0,0,0.65)",
                fontSize:13,
                letterSpacing:"0.02em",
              }}>{t}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ background:BLACK, padding: isMobile?"56px 20px 72px":"72px 24px 96px", textAlign:"center" }}>
        <p style={{ fontSize:11, letterSpacing:"0.22em", textTransform:"uppercase", color:MU, marginBottom:28 }}>Ready to close it</p>
        <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize: isMobile?"clamp(28px,8vw,44px)":"clamp(36px,4vw,52px)", color:CREAM, lineHeight:1.2, fontWeight:400, marginBottom:40 }}>
          Press play. Feel the shift.
        </h2>
        <button onClick={onBack} style={{ background:LG, border:"none", borderRadius:40, padding: isMobile?"18px 44px":"22px 60px", color:BLACK, fontSize: isMobile?16:18, fontFamily:"'Jost',sans-serif", fontWeight:400, cursor:"pointer", letterSpacing:"0.02em" }}>
          Join Self Hypnosis Goddess →
        </button>
      </div>

    </div>
  );
}
