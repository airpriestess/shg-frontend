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
            I tried therapy. It didn't help — not because nothing helps, but because it wasn't built for the moment I actually needed help in: the spiral. The moment you're stuck, spinning, and every tool you own suddenly feels useless because you can't access any of them from where you are.
          </p>
          <p style={{ marginBottom:26 }}>
            When I found manifestation work, something shifted. Not overnight, and not because of one video or one affirmation — but because I finally had language and tools for what I'd been missing: the idea that my emotional state wasn't just something that happened to me, it was something I could actually work on, deliberately, every day.
          </p>
          <p style={{ marginBottom:26 }}>
            But here's what I ran into next: there was nothing built to actually help with the maintaining part. Plenty of content teaches you the theory once. Almost nothing helps you hold a stable vibrational state day after day, in a way that's structured enough to actually stick — and nothing was built for the exact moment the spiral starts, when you need something that works immediately, not a technique you have to remember and apply from scratch.
          </p>
          <p style={{ marginBottom:26 }}>
            That's what these audios are. One listen — genuinely one — and you feel the shift. Not eventually. Not after weeks of practice. You put it on, and by the end you feel different than when you started. That's the whole point: when you're in the spiral, you don't need a five-step framework, you need something that works the moment you press play.
          </p>
          <p style={{ marginBottom:26 }}>
            But the real transformation isn't the one listen — it's what happens when you keep going. It's exponential, not linear. Each time you shift your state, you're reinforcing a new baseline. The gap between where you are and where you want to be gets smaller every time, and eventually what used to take real effort becomes who you just are.
          </p>
          <p style={{ marginBottom:26 }}>
            The cost of this is nothing compared to what you get from it. A daily emotional shift, every single day, that you feel on the inside first — and then watch show up in your actual life. Not managing the spiral. Ending it.
          </p>
          <p style={{ marginBottom:26 }}>
            YouTube wasn't built for that either. It's where I'd been sharing what I was learning, but YouTube is random by design — unorganised, algorithm-driven, impossible to build a daily practice around. You can't return to "the audio that worked" easily. You can't track what you've listened to, what shifted, what's still unresolved. It's built for discovery, not repetition — and repetition is the entire mechanism.
          </p>
          <p style={{ marginBottom:26 }}>
            So I built the thing I actually needed: one place, organised by what you're actually working on — love, money, body, identity, whatever it is — where you can listen daily and actually track what's shifting.
          </p>
          <p style={{ marginBottom:26 }}>
            That's where ProofOS came from. I used to manifest things and then completely forget I'd manifested them — I'd lose track, and the next time I felt low, I had nothing to point to. No evidence. So of course the doubt crept back in. The moment I started actually keeping a record, everything changed, because now when I feel like nothing's working, I have proof directly in front of me that it already has. That's not a nice-to-have feature — that's the mechanism. The Proof Wall is what forces the belief to hold: of course it's coming, look, I already have evidence it does.
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
