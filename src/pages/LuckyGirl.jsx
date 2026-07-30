import { useState } from "react";

const LG = "linear-gradient(110deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";

const SUPABASE_URL = "https://qtwvslrwmreazmrdktsn.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0d3ZzbHJ3bXJlYXptcmRrdHNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4MzA0MDAsImV4cCI6MjAyNTQwNjQwMH0.example";

const QUESTIONS = {
  money: [
    { q: "Money arrives unexpectedly. The quiet thought underneath the relief is...", opts: [
      { t: "This is temporary — something will take it away", c: "scarcity" },
      { t: "I got lucky. I didn't really earn this", c: "worthiness" },
      { t: "I need to spend it wisely or people will judge me", c: "visibility" },
      { t: "I wonder if it'll keep coming", c: "consistency" }
    ]},
    { q: "When you imagine having everything you want financially, what shows up first?", opts: [
      { t: "Excitement, then a quiet 'but will it last?'", c: "consistency" },
      { t: "Joy, then wondering if I deserve it", c: "worthiness" },
      { t: "Relief, then fear it could all disappear", c: "scarcity" },
      { t: "Happiness, then worry about what others will think", c: "visibility" }
    ]},
    { q: "Your relationship with receiving money feels...", opts: [
      { t: "Effortful — I have to work hard for every pound", c: "worthiness" },
      { t: "Uncertain — it comes and goes without explanation", c: "scarcity" },
      { t: "Tense — I never feel like I have enough", c: "scarcity" },
      { t: "Conditional — it comes when I'm in hustle mode", c: "worthiness" }
    ]},
    { q: "When you spend money on yourself, you feel...", opts: [
      { t: "Guilty — like I should be saving instead", c: "worthiness" },
      { t: "Anxious — what if I need it later?", c: "scarcity" },
      { t: "Watched — like someone will judge the choice", c: "visibility" },
      { t: "Fine in the moment, then regretful", c: "consistency" }
    ]},
    { q: "The unlucky girl version of you around money says...", opts: [
      { t: "'Money avoids me.'", c: "scarcity" },
      { t: "'I always have to struggle for it.'", c: "worthiness" },
      { t: "'Things never work out financially.'", c: "consistency" },
      { t: "'People will judge me if I have too much.'", c: "visibility" }
    ]},
    { q: "When a big financial opportunity appears, your first instinct is...", opts: [
      { t: "Excitement, then 'what's the catch?'", c: "consistency" },
      { t: "Hope, then 'am I really the right person for this?'", c: "worthiness" },
      { t: "Interest, then 'what if it doesn't work out?'", c: "scarcity" },
      { t: "Desire, then 'what will people think if I go for it?'", c: "visibility" }
    ]},
    { q: "Money flowing to you with ease feels...", opts: [
      { t: "Suspicious — there must be a cost somewhere", c: "scarcity" },
      { t: "Unlikely — I'd have to do something to deserve it", c: "worthiness" },
      { t: "Possible, but I can't quite picture it as my reality", c: "consistency" },
      { t: "Uncomfortable — I'd feel exposed having it", c: "visibility" }
    ]},
    { q: "The Lucky Girl version of you around money assumes...", opts: [
      { t: "Money finds me first — of course it does", c: "scarcity" },
      { t: "I am someone money flows to easily and stays with", c: "worthiness" },
      { t: "My income only goes up from here", c: "consistency" },
      { t: "I receive abundantly and unapologetically", c: "visibility" }
    ]}
  ],
  love: [
    { q: "In relationships, you tend to...", opts: [
      { t: "Give more than you receive, and call it love", c: "worthiness" },
      { t: "Wait to be chosen rather than choose first", c: "safety" },
      { t: "Worry that being 'too much' will push them away", c: "visibility" },
      { t: "Stay a little guarded, just in case", c: "safety" }
    ]},
    { q: "When someone chooses you, your first reaction is...", opts: [
      { t: "Warmth, then quietly wondering what they want from me", c: "worthiness" },
      { t: "Joy, then checking if it's too good to be true", c: "safety" },
      { t: "Happiness, then wondering how long it will last", c: "consistency" },
      { t: "Pleasure, then feeling exposed being seen that clearly", c: "visibility" }
    ]},
    { q: "Your unlucky girl story around love says...", opts: [
      { t: "'Nobody chooses me.'", c: "worthiness" },
      { t: "'There are no good men.'", c: "safety" },
      { t: "'Love always ends.'", c: "consistency" },
      { t: "'Nobody really sees me.'", c: "visibility" }
    ]},
    { q: "Receiving love without earning it feels...", opts: [
      { t: "Too good — I must be missing something", c: "safety" },
      { t: "Undeserved — what did I do to warrant this?", c: "worthiness" },
      { t: "Temporary — I keep waiting for it to change", c: "consistency" },
      { t: "Uncomfortable — being loved fully feels exposing", c: "visibility" }
    ]},
    { q: "In your relationships, attention from a partner makes you feel...", opts: [
      { t: "Warm, but I wonder when it will shift", c: "consistency" },
      { t: "Good, but I wonder if I truly deserve it", c: "worthiness" },
      { t: "Seen, but slightly nervous about what comes next", c: "safety" },
      { t: "Cared for, but uncomfortably visible", c: "visibility" }
    ]},
    { q: "The block that keeps love from feeling easy is...", opts: [
      { t: "I don't feel worthy of being loved just as I am", c: "worthiness" },
      { t: "I'm afraid of being hurt if I trust too much", c: "safety" },
      { t: "I believe love always runs out eventually", c: "consistency" },
      { t: "I'm afraid of being truly seen and rejected", c: "visibility" }
    ]},
    { q: "Love arriving easily and staying would mean...", opts: [
      { t: "Something must be wrong — it's not usually this simple", c: "safety" },
      { t: "I must have finally done enough to deserve it", c: "worthiness" },
      { t: "I'd spend energy waiting for it to end", c: "consistency" },
      { t: "I'd feel too exposed and vulnerable", c: "visibility" }
    ]},
    { q: "Your Lucky Girl assumption about love is...", opts: [
      { t: "He chooses me. Every time. Obviously.", c: "worthiness" },
      { t: "Love is safe and it stays with me", c: "safety" },
      { t: "The right person finds me right when they should", c: "consistency" },
      { t: "Being fully seen is what makes me magnetic", c: "visibility" }
    ]}
  ],
  beauty: [
    { q: "When you catch yourself in the mirror, the first thought is...", opts: [
      { t: "Cataloguing what still needs to change", c: "acceptance" },
      { t: "Comparing to how I looked before or want to look", c: "comparison" },
      { t: "Checking if I'm 'enough' today", c: "worthiness" },
      { t: "Moving on quickly without really seeing myself", c: "avoidance" }
    ]},
    { q: "Feeling beautiful in your body right now, as you are, feels...", opts: [
      { t: "Conditional — I'll feel it when I hit my goal", c: "acceptance" },
      { t: "Unlikely — others always look better", c: "comparison" },
      { t: "Possible, but I haven't quite earned it yet", c: "worthiness" },
      { t: "Uncomfortable — I don't like thinking about my body", c: "avoidance" }
    ]},
    { q: "Your unlucky girl story about your body or beauty says...", opts: [
      { t: "'I need to fix this before I can feel good.'", c: "acceptance" },
      { t: "'She looks better than me.'", c: "comparison" },
      { t: "'I'm not naturally pretty.'", c: "worthiness" },
      { t: "'Nobody notices me.'", c: "avoidance" }
    ]},
    { q: "When someone calls you beautiful, you...", opts: [
      { t: "Deflect or minimise it — they're just being kind", c: "worthiness" },
      { t: "Accept it, then immediately compare myself to others", c: "comparison" },
      { t: "Feel it briefly, then think of what still needs work", c: "acceptance" },
      { t: "Feel uncomfortable being looked at that way", c: "avoidance" }
    ]},
    { q: "Getting dressed or ready in the morning feels...", opts: [
      { t: "Like a problem to solve — how do I hide what I don't like", c: "acceptance" },
      { t: "Like a comparison game before I leave the house", c: "comparison" },
      { t: "Like I'm trying to get to a standard I haven't reached yet", c: "worthiness" },
      { t: "Neutral — I do it quickly and don't think about it", c: "avoidance" }
    ]},
    { q: "The thing keeping you from feeling gorgeous right now is...", opts: [
      { t: "I'm waiting until my body looks a certain way", c: "acceptance" },
      { t: "There's always someone who looks better", c: "comparison" },
      { t: "I don't feel like I was born naturally beautiful", c: "worthiness" },
      { t: "I don't let myself focus on how I look", c: "avoidance" }
    ]},
    { q: "If gorgeous was your default, right now, you'd feel...", opts: [
      { t: "Like a fraud — I haven't done the work to get there yet", c: "acceptance" },
      { t: "Good, until I saw someone who made me doubt it", c: "comparison" },
      { t: "Surprised — it doesn't feel available to me", c: "worthiness" },
      { t: "Exposed and uncomfortable being seen that way", c: "avoidance" }
    ]},
    { q: "Your Lucky Girl assumption about beauty is...", opts: [
      { t: "Gorgeous is my default. Always has been.", c: "acceptance" },
      { t: "I am the most beautiful version of myself right now", c: "worthiness" },
      { t: "I don't compare — I'm in a category of my own", c: "comparison" },
      { t: "Being seen is safe. I glow and I let people notice.", c: "avoidance" }
    ]}
  ],
  self: [
    { q: "When you picture the upgraded version of you, she feels...", opts: [
      { t: "Real, but far away — like I still have so much to do first", c: "readiness" },
      { t: "Possible, but I worry I'll never quite get there", c: "worthiness" },
      { t: "Exciting, but I'm afraid of what changes when she arrives", c: "safety" },
      { t: "Clear, but I don't know if people will accept her", c: "visibility" }
    ]},
    { q: "When something great happens to you, your first instinct is...", opts: [
      { t: "Wait for the other shoe to drop", c: "safety" },
      { t: "Wonder if I actually deserve it", c: "worthiness" },
      { t: "Feel it briefly, then doubt if it's really 'for me'", c: "readiness" },
      { t: "Minimise it so others don't feel bad", c: "visibility" }
    ]},
    { q: "The upgraded version of you — what does she have that you feel you don't yet?", opts: [
      { t: "Permission to take up space fully", c: "visibility" },
      { t: "Certainty that she's enough, exactly as she is", c: "worthiness" },
      { t: "The feeling that she's finally ready", c: "readiness" },
      { t: "Safety to be herself without consequence", c: "safety" }
    ]},
    { q: "Your unlucky girl story about yourself says...", opts: [
      { t: "'I'm not there yet.'", c: "readiness" },
      { t: "'I'm not the kind of person who gets that.'", c: "worthiness" },
      { t: "'Good things don't stay for people like me.'", c: "safety" },
      { t: "'People don't really see or value me.'", c: "visibility" }
    ]},
    { q: "When you imagine stepping fully into your dream life, what holds you back?", opts: [
      { t: "I don't feel ready yet — I need to do more first", c: "readiness" },
      { t: "I'm not sure I'm worthy of that version of life", c: "worthiness" },
      { t: "I'm afraid of what I might lose or what might change", c: "safety" },
      { t: "I worry about standing out or being judged", c: "visibility" }
    ]},
    { q: "Choosing yourself — your desires, your pace, your standards — feels...", opts: [
      { t: "Premature — I'll do that when I've earned the right", c: "readiness" },
      { t: "Selfish — I haven't done enough to justify it yet", c: "worthiness" },
      { t: "Risky — I might upset people or lose them", c: "safety" },
      { t: "Exposing — I'd have to be fully visible to do it", c: "visibility" }
    ]},
    { q: "If the upgraded version of you arrived today, you'd feel...", opts: [
      { t: "Like a fraud — I haven't done enough to be her yet", c: "readiness" },
      { t: "Surprised — I don't feel worthy of that identity", c: "worthiness" },
      { t: "Anxious — what if it doesn't stick or I lose it?", c: "safety" },
      { t: "Exposed — she's a lot more visible than I'm used to being", c: "visibility" }
    ]},
    { q: "Your Lucky Girl assumption about yourself is...", opts: [
      { t: "I am the upgraded version. She is here now.", c: "readiness" },
      { t: "I am exactly worthy of everything I desire", c: "worthiness" },
      { t: "Good things are safe with me. They stay.", c: "safety" },
      { t: "Being fully seen is my superpower", c: "visibility" }
    ]}
  ]
};

const RESULTS = {
  money: {
    scarcity: { block: "The Scarcity Loop", old: '"Money avoids me. There\'s never enough and what arrives always leaves."', new: "Money finds me first. Of course it does." },
    worthiness: { block: "The Earning Trap", old: '"I have to work hard for every pound. Receiving without effort feels wrong."', new: "I am someone money flows to easily and stays with." },
    consistency: { block: "The Feast or Famine Pattern", old: '"Money comes and goes. I can never count on it staying."', new: "My income only goes up from here." },
    visibility: { block: "The Visibility Block", old: '"Having money makes me a target. It\'s safer to stay under the radar."', new: "I receive abundantly and unapologetically." }
  },
  love: {
    worthiness: { block: "The Earning Loop", old: '"I have to earn love through what I do. Being chosen freely feels too good to be true."', new: "He chooses me. Every time. Obviously." },
    safety: { block: "The Guarded Heart", old: '"Love is dangerous. If I trust fully, I\'ll get hurt."', new: "Love is safe and it stays with me." },
    consistency: { block: "The Expiry Fear", old: '"Love always ends. I spend relationships waiting for it to run out."', new: "The right person finds me right when they should." },
    visibility: { block: "The Hiding Pattern", old: '"Being fully seen means being fully rejected. I stay small to stay safe."', new: "Being fully seen is what makes me magnetic." }
  },
  beauty: {
    acceptance: { block: "The Conditional Beauty Block", old: '"I\'ll feel beautiful when I fix this. Gorgeous is something I\'m working towards, not something I am."', new: "Gorgeous is my default. Always has been." },
    comparison: { block: "The Comparison Trap", old: '"There\'s always someone who looks better. My beauty only counts if it wins."', new: "I don\'t compare — I\'m in a category of my own." },
    worthiness: { block: "The Born-With-It Block", old: '"I wasn\'t born naturally beautiful. Beauty isn\'t really available to me."', new: "I am the most beautiful version of myself right now." },
    avoidance: { block: "The Invisibility Pattern", old: '"Being noticed for how I look feels unsafe. I don\'t let myself be seen."', new: "Being seen is safe. I glow and I let people notice." }
  },
  self: {
    readiness: { block: "The Not-Yet Trap", old: '"I\'m not ready yet. I need to do more, become more, before I can be her."', new: "I am the upgraded version. She is here now." },
    worthiness: { block: "The Worthiness Wall", old: '"I\'m not the kind of person who gets to have that. I haven\'t earned it yet."', new: "I am exactly worthy of everything I desire." },
    safety: { block: "The Good Things Leave Pattern", old: '"Good things don\'t last for people like me. When life gets too good, something always takes it away."', new: "Good things are safe with me. They stay." },
    visibility: { block: "The Shrinking Pattern", old: '"Standing out is dangerous. I stay small so I don\'t get judged or lose people."', new: "Being fully seen is my superpower." }
  }
};

const CATEGORIES = [
  { key: "money", name: "Moneymaxxing", desc: "Why money keeps slipping through your hands", color: "#E8B870" },
  { key: "love", name: "Lovemaxxing", desc: "Why love feels conditional or hard to keep", color: "#BFA5D8" },
  { key: "beauty", name: "Beautymaxxing", desc: "Why gorgeous feels like something you're still working towards", color: "#F5E0A0" },
  { key: "self", name: "Selfmaxxing", desc: "Why the upgraded version of you feels just out of reach", color: "#2CB7A7" }
];

const RITUAL = "Say your new assumption aloud right before sleep — theta state is when your subconscious stops arguing with it. Two minutes. Every night. 21 nights. That's the install window.";

const s = {
  page: { background: "#000", color: "#f2ece4", fontFamily: "'Jost', sans-serif", fontWeight: 300, minHeight: "100vh" },
  nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 28px", borderBottom: "1px solid #111" },
  navLeft: { display: "flex", alignItems: "center", gap: 10 },
  navName: { fontSize: 13, letterSpacing: ".1em", color: "#f2ece4" },
  hero: { textAlign: "center", padding: "64px 24px 48px" },
  freeTag: { display: "inline-block", fontSize: 10, letterSpacing: ".28em", textTransform: "uppercase", marginBottom: 28, background: LG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" },
  heading: { fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: "clamp(32px,6vw,60px)", lineHeight: 1.08, color: "#f2ece4", marginBottom: 8, letterSpacing: "-.01em" },
  lgWord: { background: LG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" },
  sub: { fontSize: 15, color: "#7a6e68", lineHeight: 1.7, maxWidth: 400, margin: "20px auto 0" },
  divider: { width: 60, height: 1, margin: "32px auto", background: "linear-gradient(90deg,transparent,#2CB7A7,transparent)" },
  grid: { display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, maxWidth: 500, margin: "0 auto", padding: "0 24px" },
  card: { background: "#080808", border: "1px solid #1a1a1a", borderRadius: 14, padding: "24px 20px", textAlign: "center", cursor: "pointer", transition: "border-color .2s" },
  catName: { fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6, background: LG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" },
  catDesc: { fontSize: 12, color: "#5a5048", lineHeight: 1.5 },
  wrap: { maxWidth: 520, margin: "0 auto", padding: "0 24px 80px" },
  progRow: { display: "flex", gap: 5, justifyContent: "center", marginBottom: 28 },
  progBar: (done) => ({ height: 2, borderRadius: 2, background: done ? "#E8B870" : "#1a1a1a", flex: 1, maxWidth: 40, transition: "background .3s" }),
  counter: { fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "#6a6058", textAlign: "center", marginBottom: 20 },
  qText: { fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(22px,4vw,30px)", fontWeight: 400, textAlign: "center", marginBottom: 36, color: "#f2ece4", lineHeight: 1.4 },
  opts: { display: "flex", flexDirection: "column", gap: 10 },
  opt: { background: "#080808", border: "1px solid #1c1c1c", borderRadius: 12, padding: "17px 20px", color: "#dcc8b8", fontFamily: "'Jost', sans-serif", fontSize: 14, fontWeight: 300, textAlign: "left", cursor: "pointer", lineHeight: 1.5 },
  emailWrap: { maxWidth: 420, margin: "0 auto", padding: "0 24px 60px" },
  input: { width: "100%", background: "#0a0a0a", border: "1px solid #1e1e1e", borderRadius: 10, padding: "16px 18px", color: "#f2ece4", fontFamily: "'Jost', sans-serif", fontSize: 15, fontWeight: 300, outline: "none", marginBottom: 12, display: "block" },
  ctaBtn: { width: "100%", border: "none", borderRadius: 30, padding: "17px 20px", fontFamily: "'Jost', sans-serif", fontSize: 15, fontWeight: 400, letterSpacing: ".04em", cursor: "pointer", color: "#000", background: LG, display: "block" },
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
  outlineBtn: { display: "inline-block", border: "1px solid #2CB7A7", borderRadius: 30, padding: "13px 28px", color: "#2CB7A7", fontFamily: "'Jost', sans-serif", fontSize: 13, letterSpacing: ".04em", cursor: "pointer", background: "none" }
};

function LogoMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
      <defs>
        <linearGradient id="lgm" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5E0A0"/>
          <stop offset="22%" stopColor="#E8B870"/>
          <stop offset="52%" stopColor="#BFA5D8"/>
          <stop offset="78%" stopColor="#2CB7A7"/>
          <stop offset="100%" stopColor="#167A6B"/>
        </linearGradient>
      </defs>
      <circle cx="10" cy="10" r="7" stroke="url(#lgm)" strokeWidth="1.5" fill="none"/>
      <circle cx="18" cy="10" r="7" stroke="url(#lgm)" strokeWidth="1.5" fill="none"/>
      <circle cx="10" cy="18" r="7" stroke="url(#lgm)" strokeWidth="1.5" fill="none"/>
      <circle cx="18" cy="18" r="7" stroke="url(#lgm)" strokeWidth="1.5" fill="none"/>
    </svg>
  );
}

export default function LuckyGirl() {
  const [phase, setPhase] = useState("landing"); // landing | email | quiz | result
  const [category, setCategory] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({});
  const [result, setResult] = useState(null);

  function pickCategory(key) {
    setCategory(key);
    setScores({});
    setStep(0);
    setPhase("email");
    window.scrollTo(0, 0);
  }

  function submitEmail(e) {
    e.preventDefault();
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
    const qs = QUESTIONS[category];
    if (nextStep < qs.length) {
      setStep(nextStep);
    } else {
      const topCode = Object.entries(newScores).sort((a, b) => b[1] - a[1])[0][0];
      const r = RESULTS[category][topCode];
      setResult(r);
      saveToSupabase(name, email, category, topCode, r);
      setPhase("result");
      window.scrollTo(0, 0);
    }
  }

  async function saveToSupabase(n, e, cat, block, r) {
    try {
      await fetch(SUPABASE_URL + "/rest/v1/quiz_leads", {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": SUPABASE_ANON, "Authorization": "Bearer " + SUPABASE_ANON },
        body: JSON.stringify({ name: n, email: e, result_category: cat, answers: { block }, source: "luckygirl" })
      });
    } catch (_) {}
  }

  const qs = category ? QUESTIONS[category] : [];

  return (
    <div style={s.page}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet"/>

      <nav style={s.nav}>
        <div style={s.navLeft}>
          <LogoMark/>
          <span style={s.navName}>Reshma Oracle</span>
        </div>
      </nav>

      {phase === "landing" && (
        <>
          <div style={s.hero}>
            <div style={s.freeTag}>✦ Free diagnostic ✦</div>
            <h1 style={s.heading}>
              What's blocking your<br/>
              <span style={s.lgWord}>Lucky Girl era?</span>
            </h1>
            <p style={s.sub}>Pick your category. 8 questions. Your invisible block — named, and replaced.</p>
            <div style={s.divider}/>
          </div>
          <div style={s.grid}>
            {CATEGORIES.map(cat => (
              <div key={cat.key} style={s.card} onClick={() => pickCategory(cat.key)}
                onMouseEnter={e => e.currentTarget.style.borderColor = cat.color}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#1a1a1a"}>
                <div style={{ fontSize: 20, color: cat.color, marginBottom: 10 }}>✦</div>
                <div style={s.catName}>{cat.name}</div>
                <div style={s.catDesc}>{cat.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ height: 60 }}/>
        </>
      )}

      {phase === "email" && (
        <div style={s.hero}>
          <div style={s.freeTag}>✦ {CATEGORIES.find(c => c.key === category)?.name} ✦</div>
          <h2 style={{ ...s.heading, fontSize: "clamp(26px,4vw,42px)", marginBottom: 8 }}>
            Where should I<br/><span style={s.lgWord}>send your result?</span>
          </h2>
          <p style={{ ...s.sub, marginBottom: 40 }}>Your block revealed after 8 questions.</p>
          <form onSubmit={submitEmail} style={s.emailWrap}>
            <input style={s.input} placeholder="First name" value={name} onChange={e => setName(e.target.value)}/>
            <input style={s.input} placeholder="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)}/>
            {emailError && <p style={{ color: "#BFA5D8", fontSize: 13, marginBottom: 8 }}>{emailError}</p>}
            <button type="submit" style={s.ctaBtn}>Start my diagnostic</button>
          </form>
        </div>
      )}

      {phase === "quiz" && category && (
        <div style={s.wrap}>
          <div style={{ height: 48 }}/>
          <div style={s.progRow}>
            {qs.map((_, i) => <div key={i} style={s.progBar(i < step)}/>)}
          </div>
          <div style={s.counter}>{step + 1} of {qs.length}</div>
          <div style={s.qText}>{qs[step].q}</div>
          <div style={s.opts}>
            {qs[step].opts.map((opt, i) => (
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
            <div style={s.freeTag}>✦ Your Lucky Girl block ✦</div>
          </div>
          <div style={s.resultWrap}>
            <h2 style={{ ...s.heading, fontSize: "clamp(24px,4vw,36px)", marginBottom: 32 }}>
              {result.block}
            </h2>
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
            <a href="/" style={{ ...s.outlineBtn, textDecoration: "none" }}>Explore Self Hypnosis Goddess</a>
          </div>
        </>
      )}
    </div>
  );
}
