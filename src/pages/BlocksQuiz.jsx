import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const LG = "linear-gradient(110deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";
const SUPABASE_URL = "https://qtwvslrwmreazmrdktsn.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0d3ZzbHJ3bXJlYXptcmRrdHNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4MzA0MDAsImV4cCI6MjAyNTQwNjQwMH0.example";

const CATEGORIES = {
  money: { name: "RichGirlMaxxing", color: "#E8B870", label: "RichGirl block" },
  love:  { name: "Lovemaxxing",  color: "#BFA5D8", label: "Love block"  },
  beauty:{ name: "Beautymaxxing",color: "#F5E0A0", label: "Beauty block"},
  self:  { name: "Selfmaxxing",  color: "#2CB7A7", label: "Self block"  }
};

const QUESTIONS = {
  money: [
    { q: "Money arrives unexpectedly. The quiet thought underneath the relief is...", opts: [
      { t: "This is temporary — something will take it away", c: "scarcity" },
      { t: "I got lucky. I didn't really earn this", c: "worthiness" },
      { t: "I need to spend it carefully or it'll be gone", c: "scarcity" },
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
      { t: "Uncertain — it comes and goes without explanation", c: "consistency" },
      { t: "Tense — I never feel like I have enough", c: "scarcity" },
      { t: "Uncomfortable — I feel exposed having it", c: "visibility" }
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
      { t: "Uncomfortable — I'd feel too exposed having it", c: "visibility" }
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
    { q: "Attention from a partner makes you feel...", opts: [
      { t: "Warm, but I wonder when it will shift", c: "consistency" },
      { t: "Good, but I wonder if I truly deserve it", c: "worthiness" },
      { t: "Seen, but slightly nervous about what comes next", c: "safety" },
      { t: "Cared for, but uncomfortably visible", c: "visibility" }
    ]},
    { q: "The block that keeps love from feeling easy is...", opts: [
      { t: "I don't feel worthy of being loved just as I am", c: "worthiness" },
      { t: "I'm afraid of being hurt if I trust too much", c: "safety" },
      { t: "I believe love always runs out eventually", c: "consistency" },
      { t: "I'm afraid of being truly seen and then rejected", c: "visibility" }
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
      { t: "Uncomfortable — I don't like focusing on my body", c: "avoidance" }
    ]},
    { q: "Your unlucky girl story about your body or beauty says...", opts: [
      { t: "'I need to fix this before I can feel good.'", c: "acceptance" },
      { t: "'She looks better than me.'", c: "comparison" },
      { t: "'I'm not naturally pretty.'", c: "worthiness" },
      { t: "'Nobody notices me.'", c: "avoidance" }
    ]},
    { q: "When someone calls you beautiful, you...", opts: [
      { t: "Deflect or minimise it — they're just being kind", c: "worthiness" },
      { t: "Accept it, then immediately compare to someone else", c: "comparison" },
      { t: "Feel it briefly, then think of what still needs work", c: "acceptance" },
      { t: "Feel uncomfortable being looked at that way", c: "avoidance" }
    ]},
    { q: "Getting dressed or ready in the morning feels...", opts: [
      { t: "Like a problem to solve — how do I hide what I don't like", c: "acceptance" },
      { t: "Like a comparison game before I leave the house", c: "comparison" },
      { t: "Like I'm trying to reach a standard I haven't hit yet", c: "worthiness" },
      { t: "Neutral — I do it quickly and don't think about it", c: "avoidance" }
    ]},
    { q: "The thing keeping you from feeling gorgeous right now is...", opts: [
      { t: "I'm waiting until my body looks a certain way", c: "acceptance" },
      { t: "There's always someone who looks better", c: "comparison" },
      { t: "I don't feel like I was born naturally beautiful", c: "worthiness" },
      { t: "I don't let myself focus on how I look", c: "avoidance" }
    ]},
    { q: "If gorgeous was your default right now, you'd feel...", opts: [
      { t: "Like a fraud — I haven't done the work to get there", c: "acceptance" },
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
      { t: "Real, but far away — I still have so much to do first", c: "readiness" },
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
      { t: "Certainty that she's enough exactly as she is", c: "worthiness" },
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
      { t: "Exposed — she's a lot more visible than I'm used to", c: "visibility" }
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
    scarcity:    { block: "The Scarcity Loop",         old: '"Money avoids me. There\'s never enough, and what arrives always leaves."',                                        new: "Money finds me first. Of course it does." },
    worthiness:  { block: "The Earning Trap",          old: '"I have to work hard for every pound. Receiving without effort feels wrong."',                                     new: "I am someone money flows to easily and stays with." },
    consistency: { block: "The Feast or Famine Pattern", old: '"Money comes and goes. I can never count on it staying."',                                                       new: "My income only goes up from here." },
    visibility:  { block: "The Visibility Block",      old: '"Having money makes me a target. It\'s safer to stay under the radar."',                                           new: "I receive abundantly and unapologetically." }
  },
  love: {
    worthiness:  { block: "The Earning Loop",          old: '"I have to earn love through what I do. Being chosen freely feels too good to be true."',                         new: "He chooses me. Every time. Obviously." },
    safety:      { block: "The Guarded Heart",         old: '"Love is dangerous. If I trust fully, I\'ll get hurt."',                                                           new: "Love is safe and it stays with me." },
    consistency: { block: "The Expiry Fear",           old: '"Love always ends. I spend relationships waiting for it to run out."',                                             new: "The right person finds me right when they should." },
    visibility:  { block: "The Hiding Pattern",        old: '"Being fully seen means being fully rejected. I stay small to stay safe."',                                        new: "Being fully seen is what makes me magnetic." }
  },
  beauty: {
    acceptance:  { block: "The Conditional Beauty Block", old: '"I\'ll feel beautiful when I fix this. Gorgeous is something I\'m working towards, not something I already am."', new: "Gorgeous is my default. Always has been." },
    comparison:  { block: "The Comparison Trap",       old: '"There\'s always someone who looks better. My beauty only counts if it wins."',                                    new: "I don\'t compare — I\'m in a category of my own." },
    worthiness:  { block: "The Born-With-It Block",    old: '"I wasn\'t born naturally beautiful. Beauty isn\'t really available to me."',                                      new: "I am the most beautiful version of myself right now." },
    avoidance:   { block: "The Invisibility Pattern",  old: '"Being noticed for how I look feels unsafe. I don\'t let myself be seen."',                                        new: "Being seen is safe. I glow and I let people notice." }
  },
  self: {
    readiness:   { block: "The Not-Yet Trap",          old: '"I\'m not ready yet. I need to do more, become more, before I can be her."',                                       new: "I am the upgraded version. She is here now." },
    worthiness:  { block: "The Worthiness Wall",       old: '"I\'m not the kind of person who gets to have that. I haven\'t earned it yet."',                                   new: "I am exactly worthy of everything I desire." },
    safety:      { block: "The Good Things Leave Pattern", old: '"Good things don\'t last for people like me. When life gets too good, something always takes it away."',        new: "Good things are safe with me. They stay." },
    visibility:  { block: "The Shrinking Pattern",     old: '"Standing out is dangerous. I stay small so I don\'t get judged or lose people."',                                 new: "Being fully seen is my superpower." }
  }
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

export default function BlocksQuiz() {
  const { category } = useParams();
  const navigate = useNavigate();
  const cat = CATEGORIES[category];

  const [phase, setPhase] = useState("landing");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({});
  const [result, setResult] = useState(null);

  if (!cat) {
    navigate("/blocks");
    return null;
  }

  const qs = QUESTIONS[category];

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
    if (nextStep < qs.length) {
      setStep(nextStep);
      window.scrollTo(0, 0);
    } else {
      const topCode = Object.entries(newScores).sort((a, b) => b[1] - a[1])[0][0];
      const r = RESULTS[category][topCode];
      setResult(r);
      saveToSupabase(name, email, category, topCode);
      setPhase("result");
      window.scrollTo(0, 0);
    }
  }

  async function saveToSupabase(n, e, c, block) {
    try {
      await fetch(SUPABASE_URL + "/rest/v1/quiz_leads", {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": SUPABASE_ANON, "Authorization": "Bearer " + SUPABASE_ANON },
        body: JSON.stringify({ name: n, email: e, result_category: c, answers: { block }, source: "blocks/" + c })
      });
    } catch (_) {}
  }

  const base = { background: "linear-gradient(110deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)", color: "#000", fontFamily: "'Jost', sans-serif", fontWeight: 400, minHeight: "100vh" };
  const inputStyle = { width: "100%", background: "rgba(255,255,255,0.9)", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 14, padding: "20px 22px", color: "#000", fontFamily: "'Jost', sans-serif", fontSize: 17, fontWeight: 300, outline: "none", marginBottom: 14, display: "block" };
  const btnStyle = { width: "100%", border: "none", borderRadius: 40, padding: "22px 20px", fontFamily: "'Jost', sans-serif", fontSize: 17, fontWeight: 400, letterSpacing: ".04em", cursor: "pointer", color: "#000", background: LG, display: "block" };
  const optStyle = { background: "rgba(255,255,255,0.85)", border: "2px solid transparent", borderRadius: 14, padding: "22px 24px", color: "#000", fontFamily: "'Jost', sans-serif", fontSize: 17, fontWeight: 400, textAlign: "left", cursor: "pointer", lineHeight: 1.6, width: "100%", marginBottom: 12, transition: "all 0.2s" };

  return (
    <div style={base}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet"/>

      <SHGNav/>

      {phase === "landing" && (
        <div style={{ textAlign: "center", padding: "64px 24px 48px", background: "linear-gradient(110deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)" }}>
          <div style={{ display: "inline-block", fontSize: 11, letterSpacing: ".28em", textTransform: "uppercase", marginBottom: 28, background: LG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
            ✦ {cat.label} ✦
          </div>
          <h1 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: "clamp(40px,7vw,76px)", lineHeight: 1.05, color: "#000", marginBottom: 16, letterSpacing: "-.02em" }}>
            What's blocking your<br/>{cat.name} era?
          </h1>
          <p style={{ fontSize: 17, color: "rgba(0,0,0,0.65)", lineHeight: 1.7, maxWidth: 420, margin: "20px auto 48px" }}>
            8 questions. Your invisible block — named, and replaced.
          </p>
          <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 24px" }}>
            <input style={inputStyle} placeholder="First name" value={name} onChange={e => setName(e.target.value)}/>
            <input style={inputStyle} placeholder="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)}/>
            {emailError && <p style={{ color: "#BFA5D8", fontSize: 13, marginBottom: 10 }}>{emailError}</p>}
            <button style={btnStyle} onClick={submitEmail}>Find my block</button>
          </div>
        </div>
      )}

      {phase === "quiz" && (
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "48px 24px 80px" }}>
          <div style={{ display: "flex", gap: 5, justifyContent: "center", marginBottom: 28 }}>
            {qs.map((_, i) => (
              <div key={i} style={{ height: 2, borderRadius: 2, background: i < step ? "#000" : "rgba(0,0,0,0.2)", flex: 1, maxWidth: 48, transition: "background .3s" }}/>
            ))}
          </div>
          <div style={{ fontSize: 10, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(0,0,0,0.5)", textAlign: "center", marginBottom: 24 }}>{step + 1} of {qs.length}</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(26px,5vw,38px)", fontWeight: 400, textAlign: "center", marginBottom: 40, color: "#000", lineHeight: 1.35 }}>
            {qs[step].q}
          </div>
          <div>
            {qs[step].opts.map((opt, i) => (
              <button key={i} style={optStyle} onClick={() => pickAnswer(opt.c)}
                onMouseEnter={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.border = "2px solid #000"; e.currentTarget.style.transform = "scale(1.01)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.85)"; e.currentTarget.style.border = "2px solid transparent"; e.currentTarget.style.transform = "scale(1)"; }}>
                {opt.t}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "result" && result && (
        <>
          <div style={{ padding: "48px 0 0", textAlign: "center" }}>
            <div style={{ display: "inline-block", fontSize: 11, letterSpacing: ".28em", textTransform: "uppercase", marginBottom: 16, background: LG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
              ✦ Your {cat.label} ✦
            </div>
          </div>
          <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 24px 80px", textAlign: "center" }}>
            <h2 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: "clamp(28px,5vw,48px)", lineHeight: 1.1, color: "#f2ece4", marginBottom: 36, letterSpacing: "-.01em" }}>{result.block}</h2>
            <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 16, padding: 28, marginBottom: 16, textAlign: "left" }}>
              <div style={{ fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", color: "#9a8e88", marginBottom: 12 }}>The assumption running your life</div>
              <div style={{ fontSize: 16, color: "#b09888", fontStyle: "italic", lineHeight: 1.7 }}>{result.old}</div>
            </div>
            <div style={{ borderRadius: 16, padding: 32, marginBottom: 16, textAlign: "center", background: LG }}>
              <div style={{ fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(0,0,0,0.45)", marginBottom: 14 }}>Your new assumption</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(22px,4vw,32px)", color: "#000", fontWeight: 400, lineHeight: 1.35 }}>{result.new}</div>
            </div>
            <div style={{ border: "1px solid #1a1a1a", borderRadius: 16, padding: 28, marginBottom: 32, textAlign: "left" }}>
              <div style={{ fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase", background: LG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", marginBottom: 12, display: "inline-block" }}>Your install ritual</div>
              <div style={{ fontSize: 15, color: "#b09888", lineHeight: 1.8 }}>{RITUAL}</div>
            </div>
            <p style={{ fontSize: 14, color: "#c8beb8", marginBottom: 20, lineHeight: 1.7 }}>This is exactly what your SHG audio installs — hypnosis, subliminals, and binaural beats that replace this assumption while you sleep, until your nervous system accepts it as fact.</p>
            <div style={{ background: "rgba(0,0,0,0.08)", border: "2px dashed rgba(0,0,0,0.2)", borderRadius: 20, padding: "36px 28px", textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: 12 }}>✦ Coming soon ✦</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(24px,4vw,36px)", color: "#000", fontWeight: 400, lineHeight: 1.2, marginBottom: 12 }}>RichGirl Maxxing</div>
              <div style={{ fontSize: 15, color: "rgba(0,0,0,0.6)", lineHeight: 1.7 }}>The workbook, audio, and 21-day practice for this specific block. Coming very soon.</div>
            </div>
            <a href="/" style={{ display: "inline-block", border: "2px solid #000", borderRadius: 40, padding: "18px 40px", color: "#000", fontFamily: "'Jost', sans-serif", fontSize: 16, fontWeight: 500, letterSpacing: ".04em", cursor: "pointer", textDecoration: "none" }}>Explore Self Hypnosis Goddess</a>
          </div>
        </>
      )}
    </div>
  );
}
