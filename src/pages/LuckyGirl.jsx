import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HamburgerMenu from "../components/HamburgerMenu.jsx";

const LG = "linear-gradient(110deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";
const CREAM = "#fdf0e8";
const INK = "#0a0906";

// Visual moods for each option — emoji + short punchy label
const QUESTIONS = [
  { q: "You just got upgraded to first class. Out of nowhere. Your gut says...", opts: [
    { icon: "✦", mood: "Obviously.", sub: "This is just how my life goes.", c: "identity" },
    { icon: "⏳", mood: "Enjoy it now.", sub: "It probably won't happen again.", c: "money" },
    { icon: "👁", mood: "Do I belong here?", sub: "I hope no one can tell.", c: "love" },
    { icon: "🪞", mood: "I wish I'd worn something better.", sub: "Not quite ready for this moment.", c: "body" }
  ]},
  { q: "$10,000 arrives unexpectedly. You feel...", opts: [
    { icon: "😮‍💨", mood: "Relieved. Then scared.", sub: "Waiting for it to disappear.", c: "money" },
    { icon: "😳", mood: "Shocked.", sub: "I didn't do anything to deserve this.", c: "identity" },
    { icon: "💝", mood: "Who can I help?", sub: "Already thinking about everyone else.", c: "love" },
    { icon: "✨", mood: "Finally.", sub: "Now I can fix what I've been putting off.", c: "body" }
  ]},
  { q: "Someone gorgeous, successful, and emotionally available wants you. You think...", opts: [
    { icon: "🎭", mood: "What's the catch?", sub: "People like that don't just choose me.", c: "love" },
    { icon: "⌛", mood: "How long until they see?", sub: "The real me they haven't met yet.", c: "identity" },
    { icon: "🧊", mood: "Can't need them too much.", sub: "Keep the distance. Stay safe.", c: "love" },
    { icon: "🌸", mood: "Once I sort myself out.", sub: "Then I'll be ready for this.", c: "body" }
  ]},
  { q: "Getting ready for the most important night of your life. You feel...", opts: [
    { icon: "📏", mood: "One fix away.", sub: "One size, one treatment, one thing.", c: "body" },
    { icon: "💭", mood: "Beautiful — then not.", sub: "Second-guessing the moment I leave.", c: "body" },
    { icon: "🚪", mood: "Do I belong in that room?", sub: "Excited, then that question arrives.", c: "identity" },
    { icon: "🌩", mood: "Waiting for it to fall apart.", sub: "Ready, but bracing for it.", c: "money" }
  ]},
  { q: "Life just gave you exactly what you asked for. Your first thought...", opts: [
    { icon: "🕳", mood: "Something's about to go wrong.", sub: "Always too good to be true.", c: "money" },
    { icon: "🏆", mood: "I must have done something right.", sub: "For once.", c: "identity" },
    { icon: "🤍", mood: "Will this make people feel bad?", sub: "I hope this doesn't create distance.", c: "love" },
    { icon: "🔮", mood: "I'll enjoy it when I'm ready.", sub: "Once I feel better about myself.", c: "body" }
  ]},
  { q: "She has the money, the love, the body, the life. The difference between her and you...", opts: [
    { icon: "👑", mood: "She believes she deserves it.", sub: "I'm still working on that.", c: "identity" },
    { icon: "🌊", mood: "She doesn't panic.", sub: "When good things arrive, she holds them.", c: "money" },
    { icon: "🌹", mood: "She lets people love her.", sub: "Without testing it first.", c: "love" },
    { icon: "🦋", mood: "She's comfortable being seen.", sub: "I'm not there yet.", c: "body" }
  ]},
  { q: "Your dream life is trying to reach you right now. What's blocking it?", opts: [
    { icon: "🔁", mood: "I self-sabotage.", sub: "The moment things get good.", c: "money" },
    { icon: "🚧", mood: "I don't believe I'm her.", sub: "The woman who gets that life.", c: "identity" },
    { icon: "🫂", mood: "I'm scared to change.", sub: "Scared of losing people I love.", c: "love" },
    { icon: "⏰", mood: "I'm waiting.", sub: "Until I look like the version who deserves it.", c: "body" }
  ]},
  { q: "In your Lucky Girl era — right place, right time, always. The area that still feels hardest to believe...", opts: [
    { icon: "💸", mood: "Money.", sub: "The lucky break always goes to someone else.", c: "money" },
    { icon: "💜", mood: "Love.", sub: "Being chosen freely, for no reason. That.", c: "love" },
    { icon: "🌙", mood: "My body.", sub: "Can't feel lucky in a body I'm still fighting.", c: "body" },
    { icon: "⭐", mood: "My identity.", sub: "I don't fully feel like her yet.", c: "identity" }
  ]}
];

const RESULTS = {
  money: {
    block: "The RichGirl Block",
    old: "Good things don't last for people like me. Money is temporary. I have to work hard for every penny. Abundance is for other people.",
    new: "I am the woman money finds. Of course I am.",
    track: "Money Maxxing",
    why: "Your subconscious is wired to reject abundance before it can leave you. The RichGirl tracks rewire the panic response — the moment money arrives, your nervous system learns to hold it."
  },
  love: {
    block: "The Earning Loop",
    old: "I have to earn love through what I do. I'm lovable when I'm useful. Being chosen freely — just for being me — feels too good to be true.",
    new: "He chooses me. Every time. Obviously.",
    track: "Love Maxxing",
    why: "You've built a nervous system that expects love to be conditional. The Love Maxxing tracks install the assumption that you are chosen, fully, without earning it — until it stops feeling impossible."
  },
  body: {
    block: "The Conditional Beauty Block",
    old: "I have to fix myself before I'm allowed to feel beautiful. Gorgeous is something I'm working towards, not something I already am.",
    new: "Gorgeous is my default. Always has been.",
    track: "Body Maxxing",
    why: "You've been postponing confidence until some future version of you arrives. The Body Maxxing tracks dissolve the condition — you stop waiting and start occupying the body you already have."
  },
  identity: {
    block: "The Not-Yet Trap",
    old: "I have to become a different version of myself before I'm allowed to have the life I want. The person I am now isn't quite the woman who gets that.",
    new: "I am the upgraded version. She is here now.",
    track: "Identity Maxxing",
    why: "You keep pushing your life to a future self who never quite arrives. The Identity Maxxing tracks collapse the gap — you stop being the woman waiting to become her and start being her."
  }
};

const RITUAL = "Say your new assumption out loud right before sleep — that's the theta window, when your subconscious stops arguing with it. Two minutes. Every night. 21 nights. That's the install window.";

function SHGNav() {
  const navigate = useNavigate();
  return (
    <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 20px", height:54, borderBottom:"1px solid rgba(255,255,255,0.08)", background:"rgba(10,9,6,0.97)", backdropFilter:"blur(20px)" }}>
      <div onClick={()=>navigate("/")} style={{ display:"flex", alignItems:"center", gap:9, cursor:"pointer" }}>
        <img src="/logo_transparent_cropped.png" alt="Self Hypnosis Goddess" width="38" height="38" style={{flexShrink:0, objectFit:"contain"}} />
        <span style={{ fontFamily:"'Jost',sans-serif", fontWeight:300, fontSize:"clamp(11px,3.2vw,14px)", letterSpacing:"0.02em", color:CREAM, whiteSpace:"nowrap" }}>Self Hypnosis Goddess</span>
      </div>
      <HamburgerMenu/>
    </nav>
  );
}

// Visual option card
function OptCard({ icon, mood, sub, isHovered, onClick, onEnter, onLeave }) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onTouchStart={onEnter}
      onTouchEnd={onLeave}
      style={{
        background: isHovered ? LG : "rgba(253,240,232,0.06)",
        border: `1px solid ${isHovered ? "transparent" : "rgba(253,240,232,0.13)"}`,
        borderRadius: 20,
        padding: "32px 20px 28px",
        color: isHovered ? INK : CREAM,
        fontFamily: "'Jost', sans-serif",
        textAlign: "center",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        transition: "all 0.18s ease",
        WebkitTapHighlightColor: "transparent",
        width: "100%",
        minHeight: 160,
        justifyContent: "center",
      }}>
      <span style={{ fontSize: 36, lineHeight: 1, display: "block" }}>{icon}</span>
      <span style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.3, display: "block", letterSpacing: "-.01em" }}>{mood}</span>
      <span style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.5, display: "block", opacity: isHovered ? 0.7 : 0.55, maxWidth: 180 }}>{sub}</span>
    </button>
  );
}

export default function LuckyGirl() {
  const [phase, setPhase]           = useState("landing");
  const [name, setName]             = useState("");
  const [email, setEmail]           = useState("");
  const [emailError, setEmailError] = useState("");
  const [step, setStep]             = useState(0);
  const [scores, setScores]         = useState({});
  const [result, setResult]         = useState(null);
  const [hoveredOpt, setHoveredOpt] = useState(null);

  async function saveLead(n, e, cat) {
    try {
      await fetch("https://shg-quiz-worker.airpriestess.workers.dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: n, email: e, result_category: cat || null, source: "luckygirl" })
      });
    } catch {}
    try {
      await fetch("https://hooks.zapier.com/hooks/catch/28404567/46bqizc/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: n, email: e, result_category: cat || null, source: "luckygirl" })
      });
    } catch {}
  }

  function submitEmail(e) {
    e && e.preventDefault();
    if (!name.trim()) { setEmailError("Just need your first name."); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setEmailError("That email doesn't look right."); return; }
    setEmailError("");
    saveLead(name, email, null);
    setPhase("intro");
    window.scrollTo(0, 0);
  }

  function pickAnswer(code) {
    const newScores = { ...scores, [code]: (scores[code] || 0) + 1 };
    setScores(newScores);
    setHoveredOpt(null);
    const nextStep = step + 1;
    if (nextStep < QUESTIONS.length) {
      setStep(nextStep);
      window.scrollTo(0, 0);
    } else {
      const topCode = Object.entries(newScores).sort((a, b) => b[1] - a[1])[0][0];
      const r = RESULTS[topCode];
      setResult(r);
      saveLead(name, email, topCode);
      setPhase("result");
      window.scrollTo(0, 0);
    }
  }

  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)",
    borderRadius: 14, padding: "18px 22px", color: INK,
    fontFamily: "'Jost', sans-serif", fontSize: 16, fontWeight: 400,
    outline: "none", marginBottom: 12, display: "block",
    WebkitAppearance: "none"
  };

  return (
    <div style={{ background: INK, color: CREAM, fontFamily: "'Jost', sans-serif", fontWeight: 300, minHeight: "100vh", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300;1,400&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet"/>

      <SHGNav/>

      {/* ── LANDING ── */}
      {phase === "landing" && (
        <div style={{ background: LG, minHeight: "calc(100vh - 54px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 24px 80px", textAlign: "center" }}>
          <div style={{ fontSize: 10, letterSpacing: ".3em", textTransform: "uppercase", marginBottom: 24, color: INK, fontWeight: 600 }}>Free diagnostic</div>
          <h1 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: "clamp(36px,7vw,76px)", lineHeight: 1.05, color: INK, marginBottom: 18, letterSpacing: "-.02em", maxWidth: 700, textWrap: "balance" }}>
            What's blocking your Lucky Girl era?
          </h1>
          <p style={{ fontSize: 17, color: INK, lineHeight: 1.75, maxWidth: 420, margin: "0 auto 48px", fontWeight: 300 }}>
            8 questions. Your invisible block — named, and replaced with the assumption that actually gets her there.
          </p>
          <form onSubmit={submitEmail} style={{ maxWidth: 440, width: "100%" }}>
            <input style={inputStyle} placeholder="First name" value={name} onChange={e => setName(e.target.value)} autoComplete="given-name"/>
            <input style={inputStyle} placeholder="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email"/>
            {emailError && <p style={{ color: INK, fontSize: 13, marginBottom: 10, fontWeight: 400 }}>{emailError}</p>}
            <button type="submit" style={{ width: "100%", border: "none", borderRadius: 40, padding: "20px 20px", fontFamily: "'Jost', sans-serif", fontSize: 17, fontWeight: 500, letterSpacing: ".06em", textTransform: "uppercase", cursor: "pointer", color: CREAM, background: INK, display: "block" }}>
              Find my block →
            </button>
            <p style={{ fontSize: 12, color: INK, marginTop: 14, fontWeight: 300, opacity: 0.7 }}>No spam. You'll join the SHG list and can unsubscribe any time.</p>
          </form>
        </div>
      )}

      {/* ── INTRO ── */}
      {phase === "intro" && (
        <div style={{ background: INK, minHeight: "calc(100vh - 54px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px 64px", textAlign: "center" }}>
          <div style={{ marginBottom: 40 }}>
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <defs><linearGradient id="lgq" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#F5E0A0"/><stop offset="52%" stopColor="#BFA5D8"/><stop offset="100%" stopColor="#167A6B"/></linearGradient></defs>
              <circle cx="28" cy="28" r="27" stroke="url(#lgq)" strokeWidth="1.5" fill="none"/>
              <path d="M28 14 C20 14 14 20 14 28 C14 36 20 42 28 42 C36 42 42 36 42 28 C42 20 36 14 28 14Z" stroke="url(#lgq)" strokeWidth="1" fill="none"/>
              <line x1="14" y1="28" x2="42" y2="28" stroke="url(#lgq)" strokeWidth="1"/>
              <line x1="28" y1="14" x2="28" y2="42" stroke="url(#lgq)" strokeWidth="1"/>
            </svg>
          </div>
          <h2 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: "clamp(26px,5vw,42px)", color: CREAM, marginBottom: 18, letterSpacing: "-.01em", lineHeight: 1.15, maxWidth: 480, textWrap: "balance" }}>
            Two women. Same world.<br/><span style={{ background: LG, WebkitBackgroundClip:"text", backgroundClip:"text", color:"transparent", fontWeight: 500 }}>Different operating system.</span>
          </h2>
          <p style={{ fontSize: 16, color: CREAM, maxWidth: 400, lineHeight: 1.8, marginBottom: 44, opacity: 0.8 }}>
            Lucky Girl isn't luck. It's a subconscious setting. This quiz finds which one of yours is still set to the old version.
          </p>
          <button
            onClick={() => { setPhase("quiz"); window.scrollTo(0, 0); }}
            style={{ border: "none", borderRadius: 40, padding: "20px 56px", fontFamily: "'Jost', sans-serif", fontSize: 16, fontWeight: 500, letterSpacing: ".08em", textTransform: "uppercase", cursor: "pointer", color: INK, background: LG }}>
            Start the quiz →
          </button>
        </div>
      )}

      {/* ── QUIZ ── */}
      {phase === "quiz" && (
        <div style={{ background: INK, minHeight: "calc(100vh - 54px)", display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 20px 80px" }}>
          <div style={{ maxWidth: 620, width: "100%" }}>

            {/* Progress */}
            <div style={{ display: "flex", gap: 4, marginBottom: 40 }}>
              {QUESTIONS.map((_, i) => (
                <div key={i} style={{
                  height: 3, borderRadius: 2, flex: 1,
                  background: i < step ? LG : i === step ? "rgba(253,240,232,0.35)" : "rgba(253,240,232,0.1)",
                  transition: "background .3s"
                }}/>
              ))}
            </div>

            <div style={{ fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(253,240,232,0.4)", textAlign: "center", marginBottom: 28, fontWeight: 400 }}>
              {step + 1} of {QUESTIONS.length}
            </div>

            <div style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: "clamp(20px,3.2vw,28px)", textAlign: "center", marginBottom: 40, color: CREAM, lineHeight: 1.5, textWrap: "balance", maxWidth: 520, margin: "0 auto 40px" }}>
              {QUESTIONS[step].q}
            </div>

            {/* 2×2 visual grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
              {QUESTIONS[step].opts.map((opt, i) => (
                <OptCard
                  key={i}
                  icon={opt.icon}
                  mood={opt.mood}
                  sub={opt.sub}
                  isHovered={hoveredOpt === i}
                  onClick={() => pickAnswer(opt.c)}
                  onEnter={() => setHoveredOpt(i)}
                  onLeave={() => setHoveredOpt(null)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── RESULT ── */}
      {phase === "result" && result && (
        <div style={{ background: INK }}>
          <div style={{ background: LG, padding: "72px 24px 56px", textAlign: "center" }}>
            <div style={{ fontSize: 10, letterSpacing: ".3em", textTransform: "uppercase", color: INK, marginBottom: 18, fontWeight: 600 }}>Your Lucky Girl block</div>
            <h2 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: "clamp(40px,8vw,76px)", lineHeight: 1.0, color: INK, letterSpacing: "-.02em", marginBottom: 0 }}>{result.block}</h2>
          </div>

          <div style={{ maxWidth: 580, margin: "0 auto", padding: "48px 24px 80px" }}>

            <div style={{ background: "rgba(253,240,232,0.05)", border: "1px solid rgba(253,240,232,0.12)", borderRadius: 16, padding: "28px 28px", marginBottom: 14 }}>
              <div style={{ fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "#E8B870", marginBottom: 14, fontWeight: 600 }}>The assumption running your life</div>
              <div style={{ fontSize: 18, color: CREAM, fontStyle: "italic", lineHeight: 1.85, fontWeight: 300, opacity: 0.75 }}>"{result.old}"</div>
            </div>

            <div style={{ borderRadius: 16, padding: "36px 28px", marginBottom: 14, textAlign: "center", background: LG }}>
              <div style={{ fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: INK, marginBottom: 18, fontWeight: 600 }}>Your new assumption</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(28px,5.5vw,46px)", color: INK, fontWeight: 400, lineHeight: 1.2 }}>{result.new}</div>
            </div>

            <div style={{ background: "rgba(253,240,232,0.05)", border: "1px solid rgba(253,240,232,0.12)", borderRadius: 16, padding: "28px 28px", marginBottom: 36 }}>
              <div style={{ fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "#2CB7A7", marginBottom: 14, fontWeight: 600 }}>Your 21-night ritual</div>
              <div style={{ fontSize: 17, color: CREAM, lineHeight: 1.85, fontWeight: 300 }}>{RITUAL}</div>
            </div>

            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div style={{ fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", color: "rgba(253,240,232,0.45)", marginBottom: 16, fontWeight: 500 }}>Why hypnosis works where willpower doesn't</div>
              <p style={{ fontSize: 17, color: CREAM, lineHeight: 1.85, fontWeight: 300, maxWidth: 480, margin: "0 auto" }}>{result.why}</p>
            </div>

            <div style={{ background: LG, borderRadius: 20, padding: "40px 28px", marginBottom: 14, textAlign: "center" }}>
              <div style={{ fontSize: 10, letterSpacing: ".24em", textTransform: "uppercase", color: INK, marginBottom: 14, fontWeight: 600 }}>The next step</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(28px,5vw,46px)", color: INK, fontWeight: 400, lineHeight: 1.1, marginBottom: 10 }}>Lucky Girl Maxxing</div>
              <div style={{ fontSize: 16, color: INK, lineHeight: 1.7, fontWeight: 300, marginBottom: 6 }}>21 days to become the woman good things happen to.</div>
              <div style={{ fontSize: 22, color: INK, fontWeight: 600, marginBottom: 6 }}>$19 <span style={{ fontSize: 14, fontWeight: 300, textDecoration: "line-through", opacity: 0.5 }}>$49</span></div>
              <div style={{ fontSize: 14, color: INK, lineHeight: 1.7, fontWeight: 300, marginBottom: 28, maxWidth: 360, margin: "0 auto 28px" }}>
                The workbook that turns your diagnosis into a daily identity practice. Assumption architecture. 21 days. Every room opens.
              </div>
              <a href="https://shop.beacons.ai/reshmaoracle/765f9e37-68f6-4d14-bc86-c952a2ca565f" target="_blank" rel="noreferrer"
                style={{ display: "inline-block", background: INK, border: "none", borderRadius: 40, padding: "18px 48px", color: CREAM, fontFamily: "'Jost', sans-serif", fontSize: 16, fontWeight: 500, letterSpacing: ".06em", textTransform: "uppercase", cursor: "pointer", textDecoration: "none" }}>
                Get the workbook — $19
              </a>
            </div>

            <div style={{ border: "1px solid rgba(253,240,232,0.12)", borderRadius: 16, padding: "28px 28px", textAlign: "center" }}>
              <div style={{ fontSize: 14, color: CREAM, lineHeight: 1.75, marginBottom: 18, fontWeight: 300 }}>
                Want the audio that rewires this assumption while you sleep?<br/>
                <span style={{ opacity: 0.6, fontSize: 13 }}>Hypnosis + binaural beats + subliminals, layered into music. Theta state. Every night.</span>
              </div>
              <a href="/" style={{ display: "inline-block", background: LG, borderRadius: 40, padding: "16px 36px", color: INK, fontFamily: "'Jost', sans-serif", fontSize: 15, fontWeight: 500, letterSpacing: ".06em", textTransform: "uppercase", cursor: "pointer", textDecoration: "none" }}>
                Explore Self Hypnosis Goddess
              </a>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
