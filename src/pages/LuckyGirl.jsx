import { useState } from "react";

const LG = "linear-gradient(110deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";
const SUPABASE_URL = "https://qtwvslrwmreazmrdktsn.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0d3ZzbHJ3bXJlYXptcmRrdHNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4MzA0MDAsImV4cCI6MjAyNTQwNjQwMH0.example";

const QUESTIONS = [
  { q: "When you picture your dream life arriving, the first feeling that shows up is...", opts: [
    { t: "Excitement, then a quiet 'but is this really for me?'", c: "identity" },
    { t: "Joy, then immediately wondering if it'll last", c: "money" },
    { t: "Relief, then checking if the people I love approve", c: "love" },
    { t: "Happiness, then noticing what still needs fixing about me", c: "body" }
  ]},
  { q: "Money arrives unexpectedly. The quiet thought underneath the relief is...", opts: [
    { t: "This is temporary — something will take it away", c: "money" },
    { t: "I got lucky. I didn't really earn this", c: "identity" },
    { t: "I hope this doesn't change how people see me", c: "love" },
    { t: "Now I need to spend it on something that fixes me", c: "body" }
  ]},
  { q: "In love and relationships, you tend to...", opts: [
    { t: "Give more than you receive, and call it caring", c: "love" },
    { t: "Wait to be chosen rather than choose first", c: "love" },
    { t: "Stay a little guarded, just in case", c: "identity" },
    { t: "Wonder if they'd still want you if they saw all of you", c: "body" }
  ]},
  { q: "You catch yourself in the mirror. The first thought is...", opts: [
    { t: "Cataloguing what still needs to change", c: "body" },
    { t: "Comparing to how I used to look or want to look", c: "body" },
    { t: "Wondering if I'm enough today", c: "identity" },
    { t: "Moving on quickly — I don't really look", c: "money" }
  ]},
  { q: "When something great happens to you, your first instinct is...", opts: [
    { t: "Wait for the other shoe to drop", c: "money" },
    { t: "Wonder if you actually deserve it", c: "identity" },
    { t: "Check if the people close to you are okay with it", c: "love" },
    { t: "Minimise it so others don't feel bad", c: "body" }
  ]},
  { q: "The version of you living your dream life has something you feel you don't yet. It's...", opts: [
    { t: "Permission to take up space fully", c: "identity" },
    { t: "A body she's completely at peace with", c: "body" },
    { t: "Love that feels safe and easy", c: "love" },
    { t: "Money that stays", c: "money" }
  ]},
  { q: "Receiving something beautiful — love, money, recognition — with zero effort would feel...", opts: [
    { t: "Suspicious — there must be a catch somewhere", c: "money" },
    { t: "Undeserved — I haven't done enough to warrant this", c: "identity" },
    { t: "Exposing — I don't like being seen that clearly", c: "love" },
    { t: "Uncomfortable — I'm not ready to be seen like that", c: "body" }
  ]},
  { q: "The thing that keeps you from fully stepping into your Lucky Girl era is...", opts: [
    { t: "I don't fully believe it's available for someone like me", c: "identity" },
    { t: "I'm afraid of what changes when I actually have it", c: "money" },
    { t: "I don't want to outgrow the people I love", c: "love" },
    { t: "I'm waiting until I look or feel a certain way first", c: "body" }
  ]}
];

const RESULTS = {
  money:    { block: "The Scarcity Loop",           old: '"Good things don\'t last for people like me. Money is temporary. I have to work hard for every pound I receive."',                                                            new: "Money finds me first. Of course it does." },
  love:     { block: "The Earning Loop",             old: '"I have to earn love through what I do. I\'m lovable when I\'m useful. Being chosen freely feels too good to be true."',                                                     new: "He chooses me. Every time. Obviously." },
  body:     { block: "The Conditional Beauty Block", old: '"I have to fix myself before I\'m allowed to feel beautiful. Gorgeous is something I\'m working towards, not something I already am."',                                      new: "Gorgeous is my default. Always has been." },
  identity: { block: "The Not-Yet Trap",             old: '"I have to become a different version of myself before I\'m allowed to have the life I want. The person I am now isn\'t quite the person who gets to have that."',           new: "I am the upgraded version. She is here now." }
};

const RITUAL = "Say your new assumption aloud right before sleep — that's the theta window, when your subconscious stops arguing with it. Two minutes. Every night. 21 nights. That's the install window.";



function SHGNav() {
  return (
    <nav style={{ display:"flex", alignItems:"center", padding:"0 20px", height:54, borderBottom:"1px solid #1c1828", background:"rgba(0,0,0,0.97)", backdropFilter:"blur(20px)", gap:9 }}>
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

export default function LuckyGirl() {
  const [phase, setPhase] = useState("landing");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({});
  const [result, setResult] = useState(null);

  function submitEmail(e) {
    e && e.preventDefault();
    if (!name.trim()) { setEmailError("Just need your first name."); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setEmailError("That email doesn't look right."); return; }
    setEmailError("");
    setPhase("quiz");
    window.scrollTo(0, 0);
  }

  function pickAnswer(code) {
    const newScores = { ...scores, [code]: (scores[code] || 0) + 1 };
    setScores(newScores);
    const nextStep = step + 1;
    if (nextStep < QUESTIONS.length) {
      setStep(nextStep);
      window.scrollTo(0, 0);
    } else {
      const topCode = Object.entries(newScores).sort((a, b) => b[1] - a[1])[0][0];
      const r = RESULTS[topCode];
      setResult(r);
      saveToSupabase(name, email, topCode);
      setPhase("result");
      window.scrollTo(0, 0);
    }
  }

  async function saveToSupabase(n, e, cat) {
    try {
      await fetch(SUPABASE_URL + "/rest/v1/quiz_leads", {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": SUPABASE_ANON, "Authorization": "Bearer " + SUPABASE_ANON },
        body: JSON.stringify({ name: n, email: e, result_category: cat, source: "luckygirl" })
      });
    } catch (_) {}
  }

  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.85)", border: "1px solid rgba(0,0,0,0.15)",
    borderRadius: 14, padding: "20px 22px", color: "#000",
    fontFamily: "'Jost', sans-serif", fontSize: 17, fontWeight: 400,
    outline: "none", marginBottom: 14, display: "block"
  };
  const inputStyleDark = {
    width: "100%", background: "#0a0a0a", border: "1px solid #1e1e1e",
    borderRadius: 14, padding: "20px 22px", color: "#f2ece4",
    fontFamily: "'Jost', sans-serif", fontSize: 17, fontWeight: 300,
    outline: "none", marginBottom: 14, display: "block"
  };
  const optStyle = {
    background: "#080808", border: "1px solid #1c1c1c", borderRadius: 14,
    padding: "22px 24px", color: "#f2ece4", fontFamily: "'Jost', sans-serif",
    fontSize: 16, fontWeight: 300, textAlign: "left", cursor: "pointer",
    lineHeight: 1.6, width: "100%", marginBottom: 10, display: "block"
  };

  return (
    <div style={{ background: "#000", color: "#f2ece4", fontFamily: "'Jost', sans-serif", fontWeight: 300, minHeight: "100vh", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet"/>

      {/* NAV */}
      <SHGNav/>

      {/* LANDING — full LG gradient background */}
      {phase === "landing" && (
        <div style={{ background: LG, minHeight: "calc(100vh - 61px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 24px 80px", textAlign: "center" }}>
          <div style={{ fontSize: 11, letterSpacing: ".28em", textTransform: "uppercase", marginBottom: 28, color: "rgba(0,0,0,0.5)" }}>
            ✦ Free diagnostic ✦
          </div>
          <h1 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: "clamp(40px,7vw,80px)", lineHeight: 1.05, color: "#000", marginBottom: 16, letterSpacing: "-.02em", maxWidth: 700 }}>
            What's blocking your Lucky Girl era?
          </h1>
          <p style={{ fontSize: 18, color: "#000", lineHeight: 1.7, maxWidth: 440, margin: "0 auto 48px" }}>
            8 questions. Your invisible block — named, and replaced.
          </p>
          <div style={{ maxWidth: 480, width: "100%" }}>
            <input style={inputStyle} placeholder="First name" value={name} onChange={e => setName(e.target.value)}/>
            <input style={inputStyle} placeholder="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)}/>
            {emailError && <p style={{ color: "#000", fontSize: 13, marginBottom: 10, opacity: 0.7 }}>{emailError}</p>}
            <button style={{ width: "100%", border: "none", borderRadius: 40, padding: "22px 20px", fontFamily: "'Jost', sans-serif", fontSize: 17, fontWeight: 500, letterSpacing: ".04em", cursor: "pointer", color: "#fff", background: "#000", display: "block" }}
              onClick={submitEmail}>Find my block</button>
          </div>
        </div>
      )}

      {/* QUIZ — black background */}
      {phase === "quiz" && (
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "48px 24px 80px" }}>
          <div style={{ display: "flex", gap: 5, justifyContent: "center", marginBottom: 28 }}>
            {QUESTIONS.map((_, i) => (
              <div key={i} style={{ height: 3, borderRadius: 2, background: i < step ? "#E8B870" : "#1a1a1a", flex: 1, maxWidth: 48, transition: "background .3s" }}/>
            ))}
          </div>
          <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#6a6058", textAlign: "center", marginBottom: 24 }}>{step + 1} of {QUESTIONS.length}</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(26px,5vw,38px)", fontWeight: 400, textAlign: "center", marginBottom: 40, color: "#f2ece4", lineHeight: 1.35 }}>
            {QUESTIONS[step].q}
          </div>
          <div>
            {QUESTIONS[step].opts.map((opt, i) => (
              <button key={i} style={optStyle} onClick={() => pickAnswer(opt.c)}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#E8B870"; e.currentTarget.style.background = "#0d0d0d"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#1c1c1c"; e.currentTarget.style.background = "#080808"; }}>
                {opt.t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* RESULT — LG gradient reveal */}
      {phase === "result" && result && (
        <>
          <div style={{ background: LG, padding: "64px 24px 48px", textAlign: "center" }}>
            <div style={{ fontSize: 11, letterSpacing: ".28em", textTransform: "uppercase", color: "rgba(0,0,0,0.5)", marginBottom: 16 }}>✦ Your Lucky Girl block ✦</div>
            <h2 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: "clamp(32px,6vw,56px)", lineHeight: 1.1, color: "#000", letterSpacing: "-.01em" }}>{result.block}</h2>
          </div>
          <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 24px 80px", textAlign: "center" }}>
            <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 16, padding: 28, marginBottom: 16, textAlign: "left" }}>
              <div style={{ fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", color: "#5a5048", marginBottom: 12 }}>The assumption running your life</div>
              <div style={{ fontSize: 16, color: "#b09888", fontStyle: "italic", lineHeight: 1.7 }}>{result.old}</div>
            </div>
            <div style={{ borderRadius: 16, padding: 32, marginBottom: 16, textAlign: "center", background: LG }}>
              <div style={{ fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(0,0,0,0.45)", marginBottom: 14 }}>Your new assumption</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(22px,4vw,32px)", color: "#000", fontWeight: 400, lineHeight: 1.35 }}>{result.new}</div>
            </div>
            <div style={{ border: "1px solid #1a1a1a", borderRadius: 16, padding: 28, marginBottom: 32, textAlign: "left" }}>
              <div style={{ fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", background: LG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", marginBottom: 12, display: "inline-block" }}>Your install ritual</div>
              <div style={{ fontSize: 15, color: "#c8beb8", lineHeight: 1.8 }}>{RITUAL}</div>
            </div>
            <p style={{ fontSize: 14, color: "#c8beb8", marginBottom: 20, lineHeight: 1.7 }}>This is exactly what your SHG audio installs — hypnosis, subliminals, and binaural beats that replace this assumption while you sleep, until your nervous system accepts it as fact.</p>
            <a href="/" style={{ display: "inline-block", border: "none", borderRadius: 40, padding: "18px 40px", color: "#000", fontFamily: "'Jost', sans-serif", fontSize: 15, fontWeight: 500, letterSpacing: ".04em", cursor: "pointer", background: LG, textDecoration: "none" }}>Explore Self Hypnosis Goddess</a>
          </div>
        </>
      )}
    </div>
  );
}
