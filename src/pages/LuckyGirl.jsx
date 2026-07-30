import { useState } from "react";

const LG = "linear-gradient(110deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";
const SUPABASE_URL = "https://qtwvslrwmreazmrdktsn.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0d3ZzbHJ3bXJlYXptcmRrdHNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4MzA0MDAsImV4cCI6MjAyNTQwNjQwMH0.example";

const QUESTIONS = [
  { q: "You just got upgraded to first class. Out of nowhere. Your gut says...", opts: [
    { t: "Of course — this is just how my life goes", c: "identity" },
    { t: "Enjoy it now, it probably won't happen again", c: "money" },
    { t: "I hope the person next to me doesn't think I don't belong here", c: "love" },
    { t: "I wish I'd worn something better", c: "body" }
  ]},
  { q: "£10,000 arrives unexpectedly. You feel...", opts: [
    { t: "Relieved — but already nervous about it running out", c: "money" },
    { t: "Shocked — I didn't do anything to deserve this", c: "identity" },
    { t: "Happy — then immediately thinking about who else needs some", c: "love" },
    { t: "Good — now I can finally fix the things I've been putting off", c: "body" }
  ]},
  { q: "Someone gorgeous, successful, and emotionally available wants you. You think...", opts: [
    { t: "What's the catch — people like that don't just choose me", c: "love" },
    { t: "I wonder how long before they see who I really am", c: "identity" },
    { t: "I need to make sure I don't need them too much", c: "love" },
    { t: "I'd feel so much more confident once I've sorted myself out", c: "body" }
  ]},
  { q: "You're getting ready for the most important night of your life. You feel...", opts: [
    { t: "Like I'm still one dress size, one treatment, one fix away", c: "body" },
    { t: "Beautiful — then second-guessing it the second I leave the door", c: "body" },
    { t: "Excited — then wondering if I actually belong in the room", c: "identity" },
    { t: "Ready — but quietly waiting for something to go wrong", c: "money" }
  ]},
  { q: "Life just gave you exactly what you asked for. Your first thought is...", opts: [
    { t: "Something's about to go wrong — it's always too good to be true", c: "money" },
    { t: "I must have done something right for once", c: "identity" },
    { t: "I hope this doesn't make people around me feel bad", c: "love" },
    { t: "I'll fully enjoy it once I feel better about myself", c: "body" }
  ]},
  { q: "She has it all — the money, the love, the body, the life. The difference between her and you is...", opts: [
    { t: "She just believes she deserves it. I'm still working on that.", c: "identity" },
    { t: "She doesn't panic when good things arrive. I always do.", c: "money" },
    { t: "She lets people love her without testing it. I can't.", c: "love" },
    { t: "She's comfortable being seen. I'm not there yet.", c: "body" }
  ]},
  { q: "Your dream life is trying to reach you right now. What's in the way?", opts: [
    { t: "I keep self-sabotaging the moment things get good", c: "money" },
    { t: "I don't fully believe I'm the woman who gets that life", c: "identity" },
    { t: "I'm scared of losing the people I love if I change too much", c: "love" },
    { t: "I'm waiting until I look like the version of me who deserves it", c: "body" }
  ]},
  { q: "In your Lucky Girl era, every day feels lucky — right place, right time. The area where that's still hardest to believe is...", opts: [
    { t: "Money — I never get the lucky break, it always goes to someone else", c: "money" },
    { t: "Love — being chosen freely still feels too good to be true", c: "love" },
    { t: "My body — I can't feel lucky in a body I'm still fighting", c: "body" },
    { t: "My identity — I don't fully feel like her yet", c: "identity" }
  ]}
];

const RESULTS = {
  money:    { block: "The RichGirl Block",           old: '"Good things don\'t last for people like me. Money is temporary. I have to work hard for every pound I receive."',                                                            new: "I am the woman money finds. Of course I am." },
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
    setPhase("intro");
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
    try {
      await fetch("https://hooks.zapier.com/hooks/catch/28404567/46bqizc/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    background: "#fff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 14,
    padding: "26px 28px", color: "#000", fontFamily: "'Jost', sans-serif",
    fontSize: 19, fontWeight: 400, textAlign: "left", cursor: "pointer",
    lineHeight: 1.6, width: "100%", marginBottom: 12, display: "block"
  };

  return (
    <div style={{ background: "#000", color: "#f2ece4", fontFamily: "'Jost', sans-serif", fontWeight: 300, minHeight: "100vh", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet"/>

      {/* NAV */}
      <SHGNav/>

      {/* LANDING — full LG gradient background */}
      {phase === "landing" && (
        <div style={{ background: LG, minHeight: "calc(100vh - 61px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 24px 80px", textAlign: "center" }}>
          <div style={{ fontSize: 11, letterSpacing: ".28em", textTransform: "uppercase", marginBottom: 28, color: "#000" }}>
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


      {/* INTRO — unlucky vs lucky definition */}
      {phase === "intro" && (
        <div style={{ background: "#000", minHeight: "calc(100vh - 54px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px 80px" }}>
          <div style={{ fontSize: 11, letterSpacing: ".28em", textTransform: "uppercase", color: "#E8B870", marginBottom: 32, textAlign: "center" }}>✦ Before we begin ✦</div>
          <h2 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: "clamp(28px,5vw,44px)", color: "#f2ece4", textAlign: "center", marginBottom: 48, letterSpacing: "-.01em", lineHeight: 1.1 }}>Two women. Same world.<br/>Different operating system.</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 640, width: "100%", marginBottom: 48 }}>
            {/* Unlucky Girl */}
            <div style={{ background: "#080808", border: "1px solid #1a1a1a", borderRadius: 16, padding: "28px 20px" }}>
              <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#f2ece4", marginBottom: 16 }}>Her unlucky universe</div>
              {["Nobody chooses me.", "Money avoids me.", "Things never work out.", "I'm always too late.", "I never win.", "People forget me."].map((t, i) => (
                <div key={i} style={{ fontSize: 17, color: "#f2ece4", fontStyle: "normal", lineHeight: 2, fontFamily: "'Jost', sans-serif", fontWeight: 300 }}>"{t}"</div>
              ))}
            </div>

            {/* Lucky Girl */}
            <div style={{ background: "linear-gradient(110deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)", borderRadius: 16, padding: "28px 20px" }}>
              <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#000", marginBottom: 16 }}>Her lucky universe</div>
              {["I always get upgraded.", "Money finds me.", "The universe rushes to meet me.", "I arrive at the perfect time.", "Opportunities chase me.", "People adore helping me."].map((t, i) => (
                <div key={i} style={{ fontSize: 17, color: "#000", fontStyle: "normal", lineHeight: 2, fontFamily: "'Jost', sans-serif", fontWeight: 300 }}>"{t}"</div>
              ))}
            </div>
          </div>

          <p style={{ fontSize: 17, color: "#f2ece4", textAlign: "center", maxWidth: 480, lineHeight: 1.7, marginBottom: 12 }}>
            A Lucky Girl isn't luckier. Her subconscious just expects different things.
          </p>
          <p style={{ fontSize: 15, color: "#E8B870", textAlign: "center", maxWidth: 440, lineHeight: 1.7, marginBottom: 40 }}>
            This quiz finds the assumption blocking yours.
          </p>

          <button
            onClick={() => { setPhase("quiz"); window.scrollTo(0, 0); }}
            style={{ border: "none", borderRadius: 40, padding: "22px 56px", fontFamily: "'Jost', sans-serif", fontSize: 18, fontWeight: 500, letterSpacing: ".04em", cursor: "pointer", color: "#000", background: "linear-gradient(110deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)" }}>
            Find my block
          </button>
        </div>
      )}

      {/* QUIZ — black background */}
      {phase === "quiz" && (
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "48px 24px 80px", background: "#000" }}>
          <div style={{ display: "flex", gap: 5, justifyContent: "center", marginBottom: 28 }}>
            {QUESTIONS.map((_, i) => (
              <div key={i} style={{ height: 3, borderRadius: 2, background: i < step ? "#E8B870" : "#1a1a1a", flex: 1, maxWidth: 48, transition: "background .3s" }}/>
            ))}
          </div>
          <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#f2ece4", textAlign: "center", marginBottom: 24 }}>{step + 1} of {QUESTIONS.length}</div>
          <div style={{ fontFamily: "'Jost', sans-serif", fontStyle: "normal", fontSize: "clamp(24px,4vw,36px)", fontWeight: 400, textAlign: "center", marginBottom: 44, color: "#fff", lineHeight: 1.4 }}>
            {QUESTIONS[step].q}
          </div>
          <div>
            {QUESTIONS[step].opts.map((opt, i) => (
              <button key={i} style={optStyle} onClick={() => pickAnswer(opt.c)}
                onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(110deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)"; e.currentTarget.style.color = "#000"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#000"; }}>
                {opt.t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* RESULT */}
      {phase === "result" && result && (
        <>
          <div style={{ background: LG, padding: "72px 24px 56px", textAlign: "center" }}>
            <div style={{ fontSize: 11, letterSpacing: ".28em", textTransform: "uppercase", color: "#000", marginBottom: 20 }}>✦ Your Lucky Girl block ✦</div>
            <h2 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 400, fontSize: "clamp(44px,8vw,80px)", lineHeight: 1.0, color: "#000", letterSpacing: "-.02em" }}>{result.block}</h2>
          </div>
          <div style={{ maxWidth: 560, margin: "0 auto", padding: "40px 24px 80px", textAlign: "center" }}>
            <div style={{ background: "#0a0a0a", border: "1px solid #222", borderRadius: 16, padding: 28, marginBottom: 16, textAlign: "left" }}>
              <div style={{ fontSize: 12, letterSpacing: ".15em", textTransform: "uppercase", color: "#E8B870", marginBottom: 14 }}>The assumption running your life</div>
              <div style={{ fontSize: 20, color: "#f2ece4", fontStyle: "italic", lineHeight: 1.8 }}>{result.old}</div>
            </div>
            <div style={{ borderRadius: 16, padding: 36, marginBottom: 16, textAlign: "center", background: LG }}>
              <div style={{ fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase", color: "#000", marginBottom: 16 }}>Your new assumption</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(30px,5.5vw,48px)", color: "#000", fontWeight: 400, lineHeight: 1.2 }}>{result.new}</div>
            </div>
            <div style={{ background: "#0a0a0a", border: "1px solid #222", borderRadius: 16, padding: 28, marginBottom: 32, textAlign: "left" }}>
              <div style={{ fontSize: 12, letterSpacing: ".15em", textTransform: "uppercase", color: "#E8B870", marginBottom: 14 }}>Your 21-night ritual</div>
              <div style={{ fontSize: 19, color: "#f2ece4", lineHeight: 1.85 }}>{RITUAL}</div>
            </div>
            <p style={{ fontSize: 18, color: "#f2ece4", marginBottom: 28, lineHeight: 1.8 }}>This is exactly what your SHG audio is built for — hypnosis, subliminals, and binaural beats that rewire this assumption while you sleep, until your nervous system accepts it as fact.</p>
            <div style={{ marginBottom: 16 }}>
              <div style={{ background: LG, borderRadius: "20px 20px 0 0", padding: "28px 28px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#000", marginBottom: 12 }}>✦ The next step ✦</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "clamp(26px,5vw,40px)", color: "#000", fontWeight: 400, lineHeight: 1.2, marginBottom: 10 }}>Lucky Girl Maxxing</div>
                <div style={{ fontSize: 15, color: "#000", lineHeight: 1.6 }}>21 days to become the woman good things happen to.</div>
              </div>
              <iframe
                src="https://shop.beacons.ai/reshmaoracle/765f9e37-68f6-4d14-bc86-c952a2ca565f"
                title="Lucky Girl Maxxing Workbook"
                style={{ width: "100%", height: 520, border: "none", borderRadius: "0 0 20px 20px", display: "block" }}
                loading="lazy"
              />
            </div>
            <div style={{ border: "1px solid #222", borderRadius: 16, padding: "24px 28px", textAlign: "center" }}>
              <div style={{ fontSize: 14, color: "#f2ece4", lineHeight: 1.7, marginBottom: 16 }}>Want the audio that rewires this assumption while you sleep?</div>
              <a href="/" style={{ display: "inline-block", border: "1px solid #E8B870", borderRadius: 40, padding: "16px 36px", color: "#E8B870", fontFamily: "'Jost', sans-serif", fontSize: 15, fontWeight: 400, letterSpacing: ".04em", cursor: "pointer", textDecoration: "none" }}>
                Explore Self Hypnosis Goddess
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
