import { useState } from "react";

const LG = "linear-gradient(110deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";

function SHGNav() {
  return (
    <nav style={{ display:"flex", alignItems:"center", padding:"0 20px", height:54, borderBottom:"1px solid rgba(255,255,255,0.1)", background:"rgba(0,0,0,0.97)", backdropFilter:"blur(20px)", gap:9, position:"sticky", top:0, zIndex:100 }}>
      <svg viewBox="0 0 100 100" width="24" height="24" style={{flexShrink:0}}>
        <defs><linearGradient id="shgnav" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#F5E0A0"/><stop offset="20%" stopColor="#E8B870"/><stop offset="52%" stopColor="#BFA5D8"/><stop offset="78%" stopColor="#2CB7A7"/><stop offset="100%" stopColor="#167A6B"/></linearGradient></defs>
        <circle cx="35" cy="35" r="18" fill="none" stroke="url(#shgnav)" strokeWidth="2"/>
        <circle cx="65" cy="35" r="18" fill="none" stroke="url(#shgnav)" strokeWidth="2"/>
        <circle cx="35" cy="65" r="18" fill="none" stroke="url(#shgnav)" strokeWidth="2"/>
        <circle cx="65" cy="65" r="18" fill="none" stroke="url(#shgnav)" strokeWidth="2"/>
        <line x1="50" y1="80" x2="50" y2="96" stroke="url(#shgnav)" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <span style={{ fontFamily:"'Jost',sans-serif", fontWeight:300, fontSize:"clamp(11px,3.2vw,14px)", letterSpacing:"0.02em", color:"#f2ece4", whiteSpace:"nowrap" }}>Self Hypnosis Goddess</span>
    </nav>
  );
}

const VACCINE = [
  {
    name: "RichGirl",
    assumption: "Money finds me first. Of course it does.",
    block: "You're not in the wrong mindset. You're in the wrong room.",
    identity: "I am the woman money finds. Right place. Right time. Right people.",
    old: "Why does it work for everyone else? I'm doing everything right.",
    new: "I am always where money is moving. It finds me there.",
    color: "rgba(0,0,0,0.6)"
  },
  {
    name: "LoveMaxxing",
    assumption: "He chooses me. Every time. Obviously.",
    block: "You're not unlovable. You're performing instead of being.",
    identity: "I am the woman who is chosen. Without trying. Without competing.",
    old: "I keep giving everything and still waiting to be chosen.",
    new: "Being chosen is my default. I stopped auditioning.",
    color: "#BFA5D8"
  },
  {
    name: "BeautyMaxxing",
    assumption: "Gorgeous is my default. Always has been.",
    block: "You're not ugly. You're waiting for permission you don't need.",
    identity: "I am the woman who is seen. Now. Not when she's fixed.",
    old: "I'll feel beautiful when I've sorted this, lost that, fixed the other.",
    new: "Gorgeous isn't earned. It's assumed. I assumed it.",
    color: "#F5E0A0"
  },
  {
    name: "SelfMaxxing",
    assumption: "I am the upgraded version. She is here now.",
    block: "You're not behind. You're shrinking in rooms that were always yours.",
    identity: "I am the woman who takes up space. Fully. Without apology.",
    old: "I'm not ready yet. When I've done more, achieved more, become more.",
    new: "The room was always mine. I just walked in.",
    color: "#2CB7A7"
  }
];

export default function RichGirl() {
  const [activeVaccine, setActiveVaccine] = useState(0);

  return (
    <div style={{ background: "#000", color: "#000", fontFamily: "'Jost', sans-serif", fontWeight: 300, minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet"/>
      <SHGNav/>

      {/* HERO */}
      <div style={{ background: LG, padding: "80px 24px 72px", textAlign: "center" }}>
        <div style={{ fontSize: 11, letterSpacing: ".28em", textTransform: "uppercase", color: "#000", marginBottom: 24, opacity: 0.6 }}>✦ Self Hypnosis Goddess ✦</div>
        <h1 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 600, fontSize: "clamp(44px,9vw,100px)", lineHeight: 1.0, color: "#000", marginBottom: 24, letterSpacing: "-.03em" }}>
          RichGirl
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(22px,4vw,36px)", color: "#000", lineHeight: 1.4, maxWidth: 600, margin: "0 auto 32px" }}>
          Right place. Right time. Right people.
        </p>
        <div style={{ width: 60, height: 2, background: "rgba(0,0,0,0.3)", margin: "0 auto" }}/>
      </div>

      {/* THE CALL OUT */}
      <div style={{ background: LG, padding: "72px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <p style={{ fontSize: "clamp(20px,3.5vw,28px)", color: "#000", lineHeight: 1.7, marginBottom: 32, fontWeight: 300 }}>
            Let's be honest.
          </p>
          <p style={{ fontSize: "clamp(18px,3vw,24px)", color: "#000", lineHeight: 1.8, marginBottom: 24, fontWeight: 300 }}>
            You don't have a worthiness block about money.<br/>
            You're not broken. You don't need to cry about your childhood.<br/>
            You don't need another limiting belief clearing session.
          </p>
          <div style={{ background: "linear-gradient(110deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)", borderRadius: 16, padding: "32px 28px", marginBottom: 32 }}>
            <p style={{ fontSize: "clamp(22px,4vw,36px)", color: "#000", fontWeight: 600, letterSpacing: "-.02em", lineHeight: 1.3 }}>
              You're not in the wrong mindset.<br/>You're not visible to the right people yet.
            </p>
          </div>
          <p style={{ fontSize: "clamp(16px,2.5vw,20px)", color: "#000", lineHeight: 1.8, fontWeight: 300 }}>
            The RichGirl isn't smarter than you. She didn't clear more trauma. She didn't do more journaling. She moved rooms. She became reachable. She showed up where money was already moving — and she assumed it was coming for her.
          </p>
        </div>
      </div>

      {/* THE FRAMEWORK */}
      <div style={{ padding: "72px 24px", background: "#050505" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 11, letterSpacing: ".28em", textTransform: "uppercase", background: LG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", marginBottom: 24 }}>The RichGirl Framework</div>
          <h2 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 600, fontSize: "clamp(32px,6vw,60px)", color: "#000", marginBottom: 48, letterSpacing: "-.02em", lineHeight: 1.05 }}>
            Why money isn't finding you yet
          </h2>

          {[
            { problem: "Nobody's buying", old: "You have a worthiness block", shg: "You're not visible to the people who would pay you. Change where you show up." },
            { problem: "Money keeps disappearing", old: "You have a financial thermostat from childhood", shg: "Your identity hasn't expanded to hold it. The old you keeps giving it back." },
            { problem: "Keep hitting the same ceiling", old: "Subconscious programming from your past", shg: "Your nervous system expects this number. It filters out everything above it. Install a new one." },
            { problem: "Doing everything right but nothing moves", old: "You need to clear more beliefs", shg: "Right offer, wrong audience. Right content, wrong platform. Right energy, wrong people. Reposition." },
            { problem: "It works for everyone else", old: "They have better mindset work than you", shg: "She's in the right place, at the right time, with the right people. That's not luck. That's a rehearsed assumption." },
          ].map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12, textAlign: "left" }}>
              <div style={{ background: "rgba(0,0,0,0.12)", border: "1px solid rgba(0,0,0,0.15)", borderRadius: 12, padding: "20px 18px" }}>
                <div style={{ fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: 8 }}>Everyone else says</div>
                <div style={{ fontSize: 14, color: "rgba(0,0,0,0.45)", lineHeight: 1.6, fontStyle: "italic" }}>"{row.old}"</div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.7)", border: "2px solid #000", borderRadius: 12, padding: "20px 18px" }}>
                <div style={{ fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", color: "#000", marginBottom: 8 }}>SHG says</div>
                <div style={{ fontSize: 14, color: "#000", lineHeight: 1.6 }}>{row.shg}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* THE RICHGIRL IDENTITY */}
      <div style={{ background: LG, padding: "72px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: ".28em", textTransform: "uppercase", background: LG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", marginBottom: 24 }}>The Identity</div>
          <h2 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 600, fontSize: "clamp(28px,5vw,52px)", color: "#000", marginBottom: 40, letterSpacing: "-.02em", lineHeight: 1.1 }}>
            RichGirl doesn't hustle harder.<br/>She moves differently.
          </h2>

          {[
            { label: "She is", text: "Confident as fuck. Loves herself. Knows her worth — not from therapy, from identity." },
            { label: "She expects", text: "Money to find her. Opportunities to chase her. The right people to appear at the right moment." },
            { label: "She assumes", text: "She is always in the right place at the right time. That's not arrogance. That's her operating system." },
            { label: "She installs", text: "The assumption before the evidence. She doesn't wait to feel worthy. She assumes it and moves." },
            { label: "She moves", text: "Into rooms where money is already flowing. She becomes reachable. Life can find her there." },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 20, marginBottom: 24, textAlign: "left", alignItems: "flex-start" }}>
              <div style={{ minWidth: 90, fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(0,0,0,0.6)", paddingTop: 3 }}>{item.label}</div>
              <div style={{ fontSize: "clamp(16px,2.5vw,19px)", color: "#000", lineHeight: 1.7, flex: 1 }}>{item.text}</div>
            </div>
          ))}

          <div style={{ background: LG, borderRadius: 20, padding: "40px 32px", marginTop: 48 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(26px,5vw,44px)", color: "#000", fontWeight: 400, lineHeight: 1.3, marginBottom: 16 }}>
              "Money finds me first.<br/>Of course it does."
            </div>
            <div style={{ fontSize: 13, letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(0,0,0,0.5)" }}>The RichGirl assumption</div>
          </div>
        </div>
      </div>

      {/* THE FOUR VACCINES */}
      <div style={{ background: LG, padding: "72px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 11, letterSpacing: ".28em", textTransform: "uppercase", background: LG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", marginBottom: 16 }}>The SHG Identity Vaccines</div>
            <h2 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 600, fontSize: "clamp(28px,5vw,48px)", color: "#000", letterSpacing: "-.02em", lineHeight: 1.1, marginBottom: 16 }}>
              One assumption.<br/>Installed while you sleep.
            </h2>
            <p style={{ fontSize: 17, color: "#000", lineHeight: 1.7, maxWidth: 480, margin: "0 auto" }}>
              Each SHG audio track is a vaccine against one specific identity block. You don't clear it. You replace it.
            </p>
          </div>

          {/* Vaccine selector */}
          <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap", justifyContent: "center" }}>
            {VACCINE.map((v, i) => (
              <button key={i} onClick={() => setActiveVaccine(i)}
                style={{ background: activeVaccine === i ? LG : "#0a0a0a", border: activeVaccine === i ? "none" : "1px solid #1a1a1a", borderRadius: 30, padding: "12px 20px", color: activeVaccine === i ? "#000" : "#f2ece4", fontFamily: "'Jost', sans-serif", fontSize: 14, fontWeight: activeVaccine === i ? 500 : 300, cursor: "pointer", letterSpacing: ".03em" }}>
                {v.name}
              </button>
            ))}
          </div>

          {/* Active vaccine */}
          <div style={{ background: "rgba(255,255,255,0.7)", border: "none", borderRadius: 20, overflow: "hidden" }}>
            <div style={{ background: LG, padding: "32px 28px" }}>
              <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#000", opacity: 0.5, marginBottom: 12 }}>The {VACCINE[activeVaccine].name} Vaccine</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(22px,4vw,34px)", color: "#000", lineHeight: 1.3 }}>{VACCINE[activeVaccine].assumption}</div>
            </div>
            <div style={{ padding: "28px 28px 32px" }}>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(0,0,0,0.6)", marginBottom: 10 }}>The real block</div>
                <div style={{ fontSize: 17, color: "#000", lineHeight: 1.7 }}>{VACCINE[activeVaccine].block}</div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(0,0,0,0.6)", marginBottom: 10 }}>The old assumption</div>
                <div style={{ fontSize: 16, color: "rgba(0,0,0,0.45)", fontStyle: "italic", lineHeight: 1.7 }}>"{VACCINE[activeVaccine].old}"</div>
              </div>
              <div style={{ background: "rgba(0,0,0,0.1)", border: "1px solid rgba(0,0,0,0.15)", borderRadius: 12, padding: "20px 20px" }}>
                <div style={{ fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase", color: "#2CB7A7", marginBottom: 10 }}>After the vaccine</div>
                <div style={{ fontSize: 16, color: "#000", lineHeight: 1.7 }}>"{VACCINE[activeVaccine].new}"</div>
              </div>
              <div style={{ marginTop: 24 }}>
                <div style={{ fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(0,0,0,0.6)", marginBottom: 10 }}>The identity</div>
                <div style={{ fontSize: 17, color: "#000", lineHeight: 1.7, fontWeight: 400 }}>{VACCINE[activeVaccine].identity}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ background: LG, padding: "72px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ fontSize: 11, letterSpacing: ".28em", textTransform: "uppercase", background: LG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", marginBottom: 24 }}>How SHG installs it</div>
          <h2 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 600, fontSize: "clamp(28px,5vw,48px)", color: "#000", marginBottom: 40, letterSpacing: "-.02em", lineHeight: 1.1 }}>
            While you sleep.<br/>Every night.<br/>21 nights.
          </h2>
          <p style={{ fontSize: "clamp(16px,2.5vw,19px)", color: "#000", lineHeight: 1.8, marginBottom: 24 }}>
            The subconscious accepts new identity at theta state — 4 to 8Hz — the exact frequency your brain enters right before sleep.
          </p>
          <p style={{ fontSize: "clamp(16px,2.5vw,19px)", color: "#000", lineHeight: 1.8, marginBottom: 40 }}>
            That's when it stops arguing. That's when the vaccine goes in. Hypnosis, subliminals, binaural beats — all layered into one track, designed for that exact window.
          </p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(20px,3.5vw,28px)", color: "rgba(0,0,0,0.6)", lineHeight: 1.5, marginBottom: 56 }}>
            You don't convince your subconscious.<br/>You repeat until it stops disagreeing.
          </p>

          <a href="/" style={{ display: "inline-block", background: LG, border: "none", borderRadius: 40, padding: "22px 56px", color: "#000", fontFamily: "'Jost', sans-serif", fontSize: 18, fontWeight: 600, letterSpacing: ".04em", cursor: "pointer", textDecoration: "none", marginBottom: 16 }}>
            Explore Self Hypnosis Goddess
          </a>
          <div style={{ fontSize: 13, color: "rgba(0,0,0,0.45)", marginTop: 16 }}>
            Spotify for your subconscious mind.
          </div>
        </div>
      </div>

    </div>
  );
}
