import { useState } from "react";

const LG = "linear-gradient(110deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";
const SUPABASE_URL = "https://qtwvslrwmreazmrdktsn.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0d3ZzbHJ3bXJlYXptcmRrdHNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4MzA0MDAsImV4cCI6MjAyNTQwNjQwMH0.example";

// Mixed questions across all 4 categories — diagnoses the primary block
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
  money: {
    block: "The Scarcity Loop",
    old: '"Good things don\'t last for people like me. Money is temporary. I have to work hard for every pound I receive."',
    new: "Money finds me first. Of course it does.",
    track: "Money Finds Me First"
  },
  love: {
    block: "The Earning Loop",
    old: '"I have to earn love through what I do. I\'m lovable when I\'m useful. Being chosen freely feels too good to be true."',
    new: "He chooses me. Every time. Obviously.",
    track: "He Finds Me"
  },
  body: {
    block: "The Conditional Beauty Block",
    old: '"I have to fix myself before I\'m allowed to feel beautiful. Gorgeous is something I\'m working towards, not something I already am."',
    new: "Gorgeous is my default. Always has been.",
    track: "Beautymaxxing"
  },
  identity: {
    block: "The Not-Yet Trap",
    old: '"I have to become a different version of myself before I\'m allowed to have the life I want. The person I am now isn\'t quite the person who gets to have that."',
    new: "I am the upgraded version. She is here now.",
    track: "Lucky Girl"
  }
};

const RITUAL = "Say your new assumption aloud right before sleep — that's the theta window, when your subconscious stops arguing with it. Two minutes. Every night. 21 nights. That's the install window.";

const s = {
  page: { background: "#000", color: "#f2ece4", fontFamily: "'Jost', sans-serif", fontWeight: 300, minHeight: "100vh" },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 28px", borderBottom: "1px solid #111" },
  navLeft: { display: "flex", alignItems: "center", gap: 10 },
  navName: { fontSize: 13, letterSpacing: ".1em", color: "#f2ece4" },
  hero: { textAlign: "center", padding: "64px 24px 48px" },
  tag: { display: "inline-block", fontSize: 11, letterSpacing: ".28em", textTransform: "uppercase", marginBottom: 32, background: LG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" },
  heading: { fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: "clamp(42px,8vw,80px)", lineHeight: 1.05, color: "#f2ece4", marginBottom: 12, letterSpacing: "-.02em" },
  sub: { fontSize: 17, color: "#7a6e68", lineHeight: 1.7, maxWidth: 440, margin: "24px auto 48px" },
  emailWrap: { maxWidth: 480, margin: "0 auto", padding: "0 24px" },
  input: { width: "100%", background: "#0a0a0a", border: "1px solid #1e1e1e", borderRadius: 14, padding: "20px 22px", color: "#f2ece4", fontFamily: "'Jost', sans-serif", fontSize: 17, fontWeight: 300, outline: "none", marginBottom: 14, display: "block" },
  ctaBtn: { width: "100%", border: "none", borderRadius: 40, padding: "22px 20px", fontFamily: "'Jost', sans-serif", fontSize: 17, fontWeight: 400, letterSpacing: ".04em", cursor: "pointer", color: "#000", background: LG, display: "block" },
  wrap: { maxWidth: 520, margin: "0 auto", padding: "48px 24px 80px" },
  progRow: { display: "flex", gap: 5, justifyContent: "center", marginBottom: 28 },
  progBar: (done) => ({ height: 2, borderRadius: 2, background: done ? "#E8B870" : "#1a1a1a", flex: 1, maxWidth: 40, transition: "background .3s" }),
  counter: { fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "#6a6058", textAlign: "center", marginBottom: 20 },
  qText: { fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(26px,5vw,38px)", fontWeight: 400, textAlign: "center", marginBottom: 40, color: "#f2ece4", lineHeight: 1.35 },
  opts: { display: "flex", flexDirection: "column", gap: 10 },
  opt: { background: "#080808", border: "1px solid #1c1c1c", borderRadius: 14, padding: "22px 24px", color: "#dcc8b8", fontFamily: "'Jost', sans-serif", fontSize: 16, fontWeight: 300, textAlign: "left", cursor: "pointer", lineHeight: 1.6 },
  resultWrap: { maxWidth: 520, margin: "0 auto", padding: "0 24px 80px", textAlign: "center" },
  oldCard: { background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 14, padding: 24, marginBottom: 16, textAlign: "left" },
  oldLabel: { fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", color: "#5a5048", marginBottom: 10 },
  oldText: { fontSize: 15, color: "#b09888", fontStyle: "italic", lineHeight: 1.7 },
  newCard: { borderRadius: 14, padding: 28, marginBottom: 16, textAlign: "center", background: LG },
  newLabel: { fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(0,0,0,0.45)", marginBottom: 12 },
  newText: { fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(20px,3.5vw,28px)", color: "#000", fontWeight: 400, lineHeight: 1.4 },
  ritualCard: { border: "1px solid #1a1a1a", borderRadius: 14, padding: 22, marginBottom: 28, textAlign: "left" },
  ritualLabel: { fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", background: LG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", marginBottom: 10, display: "inline-block" },
  ritualText: { fontSize: 14, color: "#b09888", lineHeight: 1.8 },
  finalNote: { fontSize: 13, color: "#7a6e68", marginBottom: 16, lineHeight: 1.6 },
  outlineBtn: { display: "inline-block", border: "1px solid #2CB7A7", borderRadius: 30, padding: "13px 28px", color: "#2CB7A7", fontFamily: "'Jost', sans-serif", fontSize: 13, letterSpacing: ".04em", cursor: "pointer", background: "none", textDecoration: "none" }
};

function LogoMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
      <defs>
        <linearGradient id="lgm2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5E0A0"/>
          <stop offset="22%" stopColor="#E8B870"/>
          <stop offset="52%" stopColor="#BFA5D8"/>
          <stop offset="78%" stopColor="#2CB7A7"/>
          <stop offset="100%" stopColor="#167A6B"/>
        </linearGradient>
      </defs>
      <circle cx="10" cy="10" r="7" stroke="url(#lgm2)" strokeWidth="1.5" fill="none"/>
      <circle cx="18" cy="10" r="7" stroke="url(#lgm2)" strokeWidth="1.5" fill="none"/>
      <circle cx="10" cy="18" r="7" stroke="url(#lgm2)" strokeWidth="1.5" fill="none"/>
      <circle cx="18" cy="18" r="7" stroke="url(#lgm2)" strokeWidth="1.5" fill="none"/>
    </svg>
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

  return (
    <div style={s.page}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet"/>
      <nav style={s.nav}>
        <div style={s.navLeft}>
          <LogoMark/>
          <span style={s.navName}>Reshma Oracle</span>
        </div>
        {phase !== "landing" && (
          <button
            onClick={() => { setPhase("landing"); setStep(0); setScores({}); setResult(null); window.scrollTo(0,0); }}
            style={{ background: "none", border: "1px solid #1e1e1e", borderRadius: 30, padding: "10px 20px", color: "#7a6e68", fontFamily: "'Jost', sans-serif", fontSize: 13, letterSpacing: ".05em", cursor: "pointer" }}>
            ← Back
          </button>
        )}
      </nav>

      {phase === "landing" && (
        <div style={s.hero}>
          <div style={s.tag}>✦ Free diagnostic ✦</div>
          <h1 style={s.heading}>What's blocking your<br/>Lucky Girl era?</h1>
          <p style={s.sub}>8 questions. Your invisible block — named, and replaced.</p>
          <div style={s.emailWrap}>
            <input style={s.input} placeholder="First name" value={name} onChange={e => setName(e.target.value)}/>
            <input style={s.input} placeholder="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)}/>
            {emailError && <p style={{ color: "#BFA5D8", fontSize: 13, marginBottom: 8 }}>{emailError}</p>}
            <button style={s.ctaBtn} onClick={submitEmail}>Find my block</button>
          </div>
        </div>
      )}

      {phase === "quiz" && (
        <div style={s.wrap}>
          <div style={s.progRow}>
            {QUESTIONS.map((_, i) => <div key={i} style={s.progBar(i < step)}/>)}
          </div>
          <div style={s.counter}>{step + 1} of {QUESTIONS.length}</div>
          <div style={s.qText}>{QUESTIONS[step].q}</div>
          <div style={s.opts}>
            {QUESTIONS[step].opts.map((opt, i) => (
              <button key={i} style={s.opt} onClick={() => pickAnswer(opt.c)}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#2CB7A7"; e.currentTarget.style.background = "#0d0d0d"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#1c1c1c"; e.currentTarget.style.background = "#080808"; }}>
                {opt.t}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "result" && result && (
        <>
          <div style={{ padding: "48px 0 0", textAlign: "center" }}>
            <div style={s.tag}>✦ Your Lucky Girl block ✦</div>
          </div>
          <div style={s.resultWrap}>
            <h2 style={{ ...s.heading, fontSize: "clamp(24px,4vw,40px)", marginBottom: 32 }}>{result.block}</h2>
            <div style={s.oldCard}>
              <div style={s.oldLabel}>The assumption running your life</div>
              <div style={s.oldText}>{result.old}</div>
            </div>
            <div style={s.newCard}>
              <div style={s.newLabel}>Your new assumption</div>
              <div style={s.newText}>{result.new}</div>
            </div>
            <div style={s.ritualCard}>
              <div style={s.ritualLabel}>Your install ritual</div>
              <div style={s.ritualText}>{RITUAL}</div>
            </div>
            <p style={s.finalNote}>This is exactly what your SHG audio installs — hypnosis, subliminals, and binaural beats that replace this assumption while you sleep, until your nervous system accepts it as fact.</p>
            <a href="/" style={s.outlineBtn}>Explore Self Hypnosis Goddess</a>
          </div>
        </>
      )}
    </div>
  );
}
