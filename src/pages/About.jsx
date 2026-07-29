/* About — Reshma Oracle */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HamburgerMenu from "../components/HamburgerMenu.jsx";

const LG = "linear-gradient(135deg,#F5E0A0 0%,#E8B870 20%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";
const CREAM = "#fdf0e8";
const BLACK = "#000000";
const ROSE  = "#B76E79";

export default function About({ onBack }) {
  const navigate = useNavigate();
  const topRef = useRef(null);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth <= 768);

  useEffect(() => {
    if (topRef.current) topRef.current.scrollIntoView({ behavior: "instant" });
    document.documentElement.scrollTop = 0;
    window.scrollTo(0, 0);
    const h = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const PHOTO_URL = "https://qtwvslrwmreazmrdktsn.supabase.co/storage/v1/object/public/tracks/reshma-about.jpg";

  return (
    <div ref={topRef} style={{ minHeight:"100vh", background:BLACK, color:CREAM, fontFamily:"'Jost',sans-serif" }}>

      {/* ── NAV ── */}
      <div style={{ position:"sticky", top:0, zIndex:50, background:"rgba(0,0,0,0.92)", backdropFilter:"blur(12px)", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"0 24px", height:52, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:"rgba(242,236,228,0.5)", fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontFamily:"'Jost',sans-serif", letterSpacing:"0.04em" }}>
          ← Back
        </button>
        <span style={{ fontSize:12, color:"rgba(242,236,228,0.4)", letterSpacing:"0.18em", textTransform:"uppercase" }}>reshmaoracle.com</span>
        <HamburgerMenu/>
      </div>

      {/* ── HERO — LG gradient, photo + headline ── */}
      <div style={{ width:"100%", background:LG, padding: isMobile?"72px 24px 64px":"96px 24px 80px", textAlign:"center" }}>
        {/* Photo */}
        <div style={{ display:"flex", justifyContent:"center", marginBottom:32 }}>
          <div style={{
            width: isMobile?120:148,
            height: isMobile?120:148,
            borderRadius:"50%",
            overflow:"hidden",
            border:"3px solid rgba(0,0,0,0.15)",
            boxShadow:"0 8px 40px rgba(0,0,0,0.2)",
            flexShrink:0,
          }}>
            <img
              src={PHOTO_URL}
              alt="Reshma"
              onError={e => {
                e.target.style.display = "none";
                e.target.parentElement.style.background = "linear-gradient(135deg,#F5E0A0,#BFA5D8)";
                e.target.parentElement.innerHTML = "<span style='display:flex;align-items:center;justify-content:center;height:100%;font-size:48px;'>✦</span>";
              }}
              style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center top" }}
            />
          </div>
        </div>

        <div style={{ fontFamily:"'Jost',sans-serif", fontSize:11, letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(0,0,0,0.5)", marginBottom:16 }}>Self Hypnosis Goddess</div>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize: isMobile?"clamp(36px,10vw,52px)":"clamp(48px,5vw,68px)", color:BLACK, margin:"0 0 20px", lineHeight:1.1, fontWeight:400 }}>
          I built what I couldn't find.
        </h1>
        <p style={{ fontSize: isMobile?16:18, color:"rgba(0,0,0,0.65)", maxWidth:500, margin:"0 auto", lineHeight:1.7, fontWeight:400 }}>
          Ten years of searching for something that actually worked. This is what came from the other side.
        </p>
      </div>

      {/* ── THE STRUGGLE — black ── */}
      <div style={{ background:BLACK, padding: isMobile?"64px 24px":"80px 24px" }}>
        <div style={{ maxWidth:660, margin:"0 auto" }}>
                    <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize: isMobile?"clamp(28px,7vw,40px)":"clamp(34px,3.5vw,50px)", color:CREAM, lineHeight:1.25, fontWeight:400, marginBottom:28 }}>
            I was struggling with my belief system. All of it.
          </h2>
          <p style={{ fontSize: isMobile?16:17, color:"rgba(242,236,228,0.8)", lineHeight:1.85, marginBottom:20 }}>
            Bullied. Never chosen. Always looking for my place — in rooms, in jobs, in my own skin. The kind of early life that leaves a mark on how you see yourself, and how you think the world sees you back.
          </p>
          <p style={{ fontSize: isMobile?16:17, color:"rgba(242,236,228,0.8)", lineHeight:1.85, marginBottom:20 }}>
            Love. Beauty. Body. My relationship with myself. I couldn't find anything that helped me keep my consciousness consistently stable — not therapy, not tools, not habits. Something would work for a day and then collapse the next. Nothing stuck.
          </p>
          <p style={{ fontSize: isMobile?16:17, color:"rgba(242,236,228,0.8)", lineHeight:1.85 }}>
            This went on for ten years.
          </p>
        </div>
      </div>

      {/* ── THE TURN — cream ── */}
      <div style={{ background:CREAM, padding: isMobile?"64px 24px":"80px 24px" }}>
        <div style={{ maxWidth:660, margin:"0 auto" }}>
                    <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize: isMobile?"clamp(28px,7vw,40px)":"clamp(34px,3.5vw,50px)", color:BLACK, lineHeight:1.25, fontWeight:400, marginBottom:28 }}>
            Then I found manifestation. Then I found self-hypnosis. Then everything changed.
          </h2>
          <p style={{ fontSize: isMobile?16:17, color:"rgba(0,0,0,0.7)", lineHeight:1.85, marginBottom:20 }}>
            I realised I could train my brain every single day — for how I wanted to think, feel, and act. Not hope. Not try. Train. And the results started shifting in ways that felt genuinely crazy. Manifestations I couldn't explain. Messages from people I'd never met. Things arriving before I felt ready for them.
          </p>
          <p style={{ fontSize: isMobile?16:17, color:"rgba(0,0,0,0.7)", lineHeight:1.85 }}>
            I started creating audios for myself. That was it — nothing more than that. Just for me.
          </p>
        </div>
      </div>

      {/* ── THE BUILD — black, two-col on desktop ── */}
      <div style={{ background:BLACK, padding: isMobile?"64px 24px":"80px 24px" }}>
        <div style={{ maxWidth:860, margin:"0 auto" }}>
          <h2 style={{ fontFamily:"'Jost',sans-serif", fontSize: isMobile?"clamp(52px,14vw,80px)":"clamp(72px,8vw,120px)", fontWeight:800, color:"#ffffff", lineHeight:0.92, letterSpacing:"-0.03em", marginBottom:56, textAlign:"center", textTransform:"uppercase" }}>Why this<br/>exists</h2>

          <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr":"1fr 1fr", gap: isMobile?16:20 }}>
            {[
              {
                accent:"#E8B870",
                year:"2019 — 2024",
                head:"Live meditations. Real scripts. Real rooms.",
                body:"Before SHG existed, I was writing hypnosis scripts and running live meditations for people. It worked. But it only worked while I was there — in the room, on the call. The moment the session ended, it ended.",
              },
              {
                accent:"#BFA5D8",
                year:"The question",
                head:"What if the track stayed in someone's system — forever?",
                body:"That one question changed everything. Not dependent on a live session. Not a moment. Something that could rewire the subconscious repeatedly, daily, on their own time. That's when SHG was born.",
              },
              {
                accent:"#2CB7A7",
                year:"The gap",
                head:"I couldn't find anything real.",
                body:"Everything out there felt fake or AI-generated. Nothing had genuine EMDR, genuine binaural beats, a real human voice that felt authentic. People kept telling me my voice was calm. That it actually felt like something. So I used it.",
              },
              {
                accent:"#F5E0A0",
                year:"The proof",
                head:"I watched myself shift in a year and a half.",
                body:"Creating the channel changed me before it changed anyone else. I looked back at where I was and I couldn't believe it. That's when I knew: I have to go deeper. And I need a place where every single manifestation gets tracked — hence ProofOS.",
              },
            ].map(({ accent, year, head, body }, i) => (
              <div key={i} style={{ borderRadius:16, padding:"32px 28px", borderLeft:`3px solid ${accent}`, borderTop:"1px solid rgba(255,255,255,0.07)", borderRight:"1px solid rgba(255,255,255,0.07)", borderBottom:"1px solid rgba(255,255,255,0.07)", background:"rgba(255,255,255,0.03)" }}>
                <div style={{ fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase", color:accent, marginBottom:12 }}>{year}</div>
                <div style={{ fontSize: isMobile?17:19, fontWeight:500, color:"#ffffff", marginBottom:14, lineHeight:1.3 }}>{head}</div>
                <p style={{ fontSize:14, color:"rgba(242,236,228,0.55)", lineHeight:1.75, margin:0 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── THE PHILOSOPHY — LG gradient ── */}
      <div style={{ background:LG, padding: isMobile?"64px 24px":"80px 24px", textAlign:"center" }}>
        <div style={{ maxWidth:640, margin:"0 auto" }}>
          <h2 style={{ fontFamily:"'Jost',sans-serif", fontSize: isMobile?"clamp(36px,10vw,52px)":"clamp(44px,5vw,64px)", fontWeight:800, color:BLACK, lineHeight:1, letterSpacing:"-0.02em", textTransform:"uppercase", marginBottom:36 }}>What I actually believe</h2>
          <blockquote style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize: isMobile?"clamp(24px,6.5vw,34px)":"clamp(28px,3vw,40px)", color:BLACK, lineHeight:1.4, fontWeight:400, margin:"0 0 32px" }}>
            "I am delusional about everything.<br/>And I am proud of it."
          </blockquote>
          <p style={{ fontSize: isMobile?16:17, color:"rgba(0,0,0,0.65)", lineHeight:1.8, marginBottom:20 }}>
            I don't care how logical the world is. I choose to live in my magical version of it — and that is exactly how I am able to manifest the things I manifest.
          </p>
          <p style={{ fontSize: isMobile?16:17, color:"rgba(0,0,0,0.65)", lineHeight:1.8, marginBottom:20 }}>
            SHG exists to help you stay in the magic. To keep your mind calibrated to what you want — not what you fear. Every audio, every track, every tool inside is built to do one thing: help you stay in your version of reality long enough for it to become the real one.
          </p>
          <p style={{ fontSize: isMobile?16:18, color:BLACK, lineHeight:1.7, fontWeight:500 }}>
            I don't have to deal with the BS anymore. I'm the only boss in my life. That's what this is about — for me, and for you.
          </p>
        </div>
      </div>

      {/* ── WHAT I MAKE — black ── */}
      <div style={{ background:BLACK, padding: isMobile?"64px 24px":"80px 24px" }}>
        <div style={{ maxWidth:660, margin:"0 auto", textAlign:"center" }}>
          <h2 style={{ fontFamily:"'Jost',sans-serif", fontSize: isMobile?"clamp(36px,10vw,52px)":"clamp(44px,5vw,64px)", fontWeight:800, color:"#ffffff", lineHeight:1, letterSpacing:"-0.02em", textTransform:"uppercase", marginBottom:20 }}>What's inside</h2>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize: isMobile?"clamp(26px,7vw,38px)":"clamp(30px,3vw,44px)", color:CREAM, lineHeight:1.25, fontWeight:400, marginBottom:20 }}>
            Every audio in this library is my voice. Written and recorded by me.
          </h2>
          <p style={{ fontSize: isMobile?15:16, color:"rgba(242,236,228,0.6)", lineHeight:1.8, marginBottom:40 }}>
            Full voice hypnosis. Subliminals. 528hz. EMDR. Binaural beats. Melodic house. Theta induction. Every format I've found that actually works — layered into tracks you can loop while you sleep, work, or exist.
          </p>

          <div style={{ display:"flex", flexWrap:"wrap", gap:10, justifyContent:"center" }}>
            {["Self hypnosis","Subliminals","EMDR","528hz","Binaural beats","Theta induction","Melodic house","ProofOS tracking","Hawkins scale","24 categories"].map((t, i) => (
              <div key={i} style={{
                padding:"9px 18px",
                borderRadius:40,
                background: i % 4 === 0 ? LG : "transparent",
                border: i % 4 === 0 ? "none" : "1px solid rgba(242,236,228,0.15)",
                color: i % 4 === 0 ? BLACK : "rgba(242,236,228,0.6)",
                fontSize:13,
                letterSpacing:"0.02em",
              }}>{t}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={{ background:LG, padding: isMobile?"64px 24px 80px":"80px 24px 100px", textAlign:"center" }}>
                <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize: isMobile?"clamp(28px,8vw,44px)":"clamp(36px,4vw,52px)", color:BLACK, lineHeight:1.2, fontWeight:400, marginBottom:40 }}>
          Press play. Feel the shift.
        </h2>
        <button onClick={()=>{ navigate("/"); setTimeout(()=>{ const el=document.getElementById("pricing"); if(el) el.scrollIntoView({behavior:"smooth"}); },300); }} style={{ background:BLACK, border:"none", borderRadius:40, padding: isMobile?"18px 44px":"22px 60px", color:CREAM, fontSize: isMobile?16:18, fontFamily:"'Jost',sans-serif", fontWeight:400, cursor:"pointer", letterSpacing:"0.02em" }}>
          Join Self Hypnosis Goddess →
        </button>
      </div>

    </div>
  );
}
