/* About page — Reshma Oracle */
import { useState, useEffect } from "react";

const GOLD = "#e8b870";
const CR = "#f2ece4";
const MU = "#9a8878";
const ROSE = "#B76E79";
const OMBRE = "linear-gradient(135deg,#f5e0a0 0%,#e8b870 22%,#d4a090 48%,#c4789a 72%,#B76E79 100%)";

export default function About({ onBack }) {
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth <= 768);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return (
    <div style={{ minHeight:"100vh", background:"#000", color:CR, fontFamily:"'Jost',sans-serif" }}>
      <div style={{ maxWidth:820, margin:"0 auto", padding: isMobile?"40px 20px 80px":"56px 24px 100px" }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:MU, fontSize:13, cursor:"pointer", marginBottom:32, display:"flex", alignItems:"center", gap:8, fontFamily:"'Jost',sans-serif" }}>
          ← Back
        </button>

        <div style={{ fontSize:11, color:GOLD, letterSpacing:"0.25em", textTransform:"uppercase", marginBottom:16, textAlign:"center" }}>About</div>

        {/* Photo placeholder — swap this div for a real <img> once a photo is supplied */}
        <div style={{ width: isMobile?140:180, height: isMobile?140:180, borderRadius:"50%", margin:"0 auto 28px", background:OMBRE, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
          <div style={{ width:"92%", height:"92%", borderRadius:"50%", background:"#000", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="24" height="24" viewBox="0 0 100 100">
              <path d="M50 20 A30 30 0 0 0 50 80" fill="none" stroke="#B76E79" strokeWidth="5" strokeLinecap="round"/>
              <path d="M50 20 A30 30 0 0 1 50 80" fill="none" stroke="#e8b870" strokeWidth="5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        <h1 style={{ fontSize: isMobile?"clamp(32px,9vw,42px)":"clamp(40px,4.5vw,54px)", fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", color:CR, marginBottom:6, lineHeight:1.15, textAlign:"center", fontWeight:400 }}>
          Reshma Oracle
        </h1>
        <div style={{ fontSize:14, color:MU, marginBottom:48, textAlign:"center", letterSpacing:"0.05em" }}>
          Creator of Self Hypnosis Goddess
        </div>

        <div style={{ fontSize: isMobile?16:17, lineHeight:1.95, color:"#e0d4c8" }}>
          <p style={{ marginBottom:26 }}>
            I'm an entrepreneur first — and this app exists because of a problem I couldn't solve for myself for years before I ever thought about solving it for anyone else.
          </p>
          <p style={{ marginBottom:26 }}>
            Staying in a stable, positive emotional state was genuinely hard for me. Not for a week, not through one bad season — consistently. I could have a good day and lose it by lunchtime. I'd have moments of real clarity and then watch them slip through my fingers within hours, back into the same old thought loops.
          </p>
          <p style={{ marginBottom:26 }}>
            When I found manifestation work, something shifted. Not overnight, and not because of one video or one affirmation — but because I finally had language and tools for what I'd been missing: the idea that my emotional state wasn't just something that happened to me, it was something I could actually work on, deliberately, every day.
          </p>
          <p style={{ marginBottom:26 }}>
            But here's what I ran into next: there was nothing built to actually help with the maintaining part. Plenty of content teaches you the theory once. Almost nothing helps you hold a stable vibrational state day after day, in a way that's structured enough to actually stick.
          </p>
          <p style={{ marginBottom:26 }}>
            YouTube wasn't built for that either. It's where I'd been sharing what I was learning, but YouTube is random by design — unorganised, algorithm-driven, impossible to build a daily practice around. You can't return to "the video that worked" easily. You can't track what you've listened to, what shifted, what's still unresolved. It's built for discovery, not for repetition.
          </p>
          <p style={{ marginBottom:26 }}>
            So I built the thing I actually needed: one place, with everything organised by what you're actually working on — love, money, identity, whatever it is — where you can listen daily, track what's shifting, and actually see the proof accumulate instead of just hoping something's working.
          </p>
          <p style={{ marginBottom:0 }}>
            Self Hypnosis Goddess isn't content I made for an audience. It's the tool I wished existed when I needed it — built properly, finally, so you don't have to go looking for it the way I did.
          </p>
        </div>

        <div style={{ marginTop:56, paddingTop:32, borderTop:"1px solid rgba(232,168,96,0.15)", textAlign:"center" }}>
          <div style={{ fontSize:11, color:MU, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:16 }}>Find me elsewhere</div>
          <div style={{ fontSize:14, color:GOLD }}>
            YouTube link coming soon
          </div>
        </div>
      </div>
    </div>
  );
}
