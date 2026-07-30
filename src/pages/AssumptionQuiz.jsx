import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { T } from "../design/tokens.js";

// ── Quiz data ────────────────────────────────────────────────────────────
// 8 questions, each answer tagged with a category. Whichever category gets
// the most taps determines her result. Ties break to the first matched.

const QUESTIONS = [
  {
    q: "When something good happens, your first instinct is usually:",
    options: [
      { t: "Wait for it to go wrong", cat: "money" },
      { t: "Wonder if I actually deserve it", cat: "identity" },
      { t: "Check if he/she noticed too", cat: "love" },
      { t: "Immediately think what's next", cat: "body" },
    ],
  },
  {
    q: "Money arrives. What's the quiet thought underneath the excitement?",
    options: [
      { t: "This won't last", cat: "money" },
      { t: "I should save it, not enjoy it", cat: "money" },
      { t: "I got lucky, that's all", cat: "identity" },
      { t: "Now I have to keep this up", cat: "body" },
    ],
  },
  {
    q: "In relationships, you tend to:",
    options: [
      { t: "Give more than you receive", cat: "love" },
      { t: "Wait to be chosen rather than choose", cat: "love" },
      { t: "Keep one foot out, just in case", cat: "identity" },
      { t: "Overthink what you did wrong", cat: "body" },
    ],
  },
  {
    q: "You catch yourself in the mirror. The first thought is usually about:",
    options: [
      { t: "What needs fixing", cat: "body" },
      { t: "Whether you look 'enough' today", cat: "body" },
      { t: "Comparing yourself to someone else", cat: "identity" },
      { t: "Nothing — you just move on", cat: "money" },
    ],
  },
  {
    q: "When you imagine your dream life, what shows up first?",
    options: [
      { t: "A number in a bank account", cat: "money" },
      { t: "Being chosen, loved, chased", cat: "love" },
      { t: "A version of you that finally 'made it'", cat: "identity" },
      { t: "A body/face that finally feels like home", cat: "body" },
    ],
  },
  {
    q: "What's easiest for you to believe about yourself?",
    options: [
      { t: "I work hard — that part's true", cat: "identity" },
      { t: "I'm a good friend/partner", cat: "love" },
      { t: "I'm capable, when I try", cat: "body" },
      { t: "Nothing comes easily to me", cat: "money" },
    ],
  },
  {
    q: "What's the hardest for you to believe about yourself?",
    options: [
      { t: "That I'm actually attractive", cat: "body" },
      { t: "That I'm allowed to have more", cat: "money" },
      { t: "That I'm truly, fully lovable", cat: "love" },
      { t: "That who I am is already enough", cat: "identity" },
    ],
  },
  {
    q: "If nothing changed from here, what would bother you most in five years?",
    options: [
      { t: "Still being careful with money", cat: "money" },
      { t: "Still settling in love", cat: "love" },
      { t: "Still not liking what I see", cat: "body" },
      { t: "Still being the 'almost' version of me", cat: "identity" },
    ],
  },
];

const RESULTS = {
  money: {
    label: "Moneymaxxing",
    accent: T.gold,
    old: "I have to work hard for every pound I get.",
    new: "Money finds me first. Of course it does.",
    ritual:
      "Repeat your new assumption right before sleep — theta state is when your subconscious stops arguing with it. Two minutes, every night, for 21 nights. That's the install window.",
  },
  love: {
    label: "Lovemaxxing",
    accent: T.lav,
    old: "I have to earn love by giving more than I receive.",
    new: "He chooses me. Every time. Obviously.",
    ritual:
      "Repeat your new assumption right before sleep — theta state is when your subconscious stops arguing with it. Two minutes, every night, for 21 nights. That's the install window.",
  },
  body: {
    label: "Beautymaxxing",
    accent: T.champ,
    old: "My body is something I have to fix, not something I already am.",
    new: "Gorgeous is my default. Always has been.",
    ritual:
      "Repeat your new assumption right before sleep — theta state is when your subconscious stops arguing with it. Two minutes, every night, for 21 nights. That's the install window.",
  },
  identity: {
    label: "Selfmaxxing",
    accent: T.teal,
    old: "I have to become someone else before I'm allowed to feel enough.",
    new: "I am the upgraded version. She is here now.",
    ritual:
      "Repeat your new assumption right before sleep — theta state is when your subconscious stops arguing with it. Two minutes, every night, for 21 nights. That's the install window.",
  },
};

export default function AssumptionQuiz() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0..7 questions, 8 = email gate, 9 = result
  const [answers, setAnswers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const totalQ = QUESTIONS.length;
  const isQuestion = step < totalQ;
  const isEmailGate = step === totalQ;
  const isResult = step === totalQ + 1;

  function pickAnswer(cat) {
    const next = [...answers, cat];
    setAnswers(next);
    setStep(step + 1);
  }

  function computeResultKey(list) {
    const counts = {};
    list.forEach((c) => (counts[c] = (counts[c] || 0) + 1));
    let best = list[0];
    let bestCount = 0;
    Object.entries(counts).forEach(([cat, n]) => {
      if (n > bestCount) {
        best = cat;
        bestCount = n;
      }
    });
    return best;
  }

  async function submitEmail(e) {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Just need your name first, gorgeous.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("That email doesn't look right — try again.");

    setSaving(true);
    const resultKey = computeResultKey(answers);
    try {
      await supabase.from("quiz_leads").insert([
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          result_category: resultKey,
          answers,
          source: "assumption_quiz",
        },
      ]);
    } catch (err) {
      // Non-blocking — she still gets her result even if the insert fails.
      console.error("quiz_leads insert failed", err);
    }
    setSaving(false);
    setStep(step + 1);
  }

  const resultKey = answers.length === totalQ ? computeResultKey(answers) : null;
  const result = resultKey ? RESULTS[resultKey] : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bgRoot,
        color: T.textPrimary,
        fontFamily: "'Jost', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0 20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 560, paddingTop: 48, paddingBottom: 64 }}>
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            color: T.textMuted,
            fontFamily: "'Jost', sans-serif",
            fontSize: 13,
            letterSpacing: "0.08em",
            cursor: "pointer",
            marginBottom: 32,
            padding: 0,
          }}
        >
          ← Back to reshmaoracle.com
        </button>

        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: T.gold,
              marginBottom: 12,
            }}
          >
            Assumption Diagnostic
          </div>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(28px,5vw,40px)",
              color: T.textPrimary,
              lineHeight: 1.2,
            }}
          >
            What's the assumption running your life?
          </h1>
        </div>

        {isQuestion && (
          <QuestionCard
            index={step}
            total={totalQ}
            question={QUESTIONS[step]}
            onPick={pickAnswer}
          />
        )}

        {isEmailGate && (
          <EmailGate
            name={name}
            email={email}
            setName={setName}
            setEmail={setEmail}
            error={error}
            saving={saving}
            onSubmit={submitEmail}
          />
        )}

        {isResult && result && <ResultCard result={result} name={name} />}
      </div>
    </div>
  );
}

function QuestionCard({ index, total, question, onPick }) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: 6,
          justifyContent: "center",
          marginBottom: 28,
        }}
      >
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 24,
              height: 3,
              borderRadius: 2,
              background: i <= index ? T.gold : T.borderSoft,
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>

      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: T.textMuted,
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        {index + 1} / {total}
      </div>

      <h2
        style={{
          fontSize: "clamp(20px,3.5vw,26px)",
          fontWeight: 400,
          textAlign: "center",
          marginBottom: 32,
          color: T.textPrimary,
          lineHeight: 1.4,
        }}
      >
        {question.q}
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {question.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onPick(opt.cat)}
            style={{
              background: T.surfaceRaised,
              border: `1px solid ${T.borderSoft}`,
              borderRadius: 12,
              padding: "18px 20px",
              color: T.textPrimary,
              fontFamily: "'Jost', sans-serif",
              fontSize: 15,
              fontWeight: 300,
              textAlign: "left",
              cursor: "pointer",
              transition: "border-color 0.2s, background 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = T.gold;
              e.currentTarget.style.background = T.surfaceHigh;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = T.borderSoft;
              e.currentTarget.style.background = T.surfaceRaised;
            }}
          >
            {opt.t}
          </button>
        ))}
      </div>
    </div>
  );
}

function EmailGate({ name, email, setName, setEmail, error, saving, onSubmit }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: T.gold,
          marginBottom: 16,
        }}
      >
        Your diagnosis is ready
      </div>
      <h2
        style={{
          fontSize: "clamp(20px,3.5vw,26px)",
          fontWeight: 400,
          marginBottom: 32,
          color: T.textPrimary,
          lineHeight: 1.4,
        }}
      >
        Where should I send it?
      </h2>

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          type="text"
          placeholder="First name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        {error && (
          <div style={{ color: T.lav, fontSize: 13 }}>{error}</div>
        )}
        <button
          type="submit"
          disabled={saving}
          style={{
            marginTop: 8,
            background: T.grad,
            border: "none",
            borderRadius: 30,
            padding: "16px 20px",
            color: "#000",
            fontFamily: "'Jost', sans-serif",
            fontSize: 15,
            fontWeight: 500,
            letterSpacing: "0.03em",
            cursor: saving ? "default" : "pointer",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? "Revealing..." : "Reveal my assumption"}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  background: T.inputBg,
  border: `1px solid ${T.borderSoft}`,
  borderRadius: 10,
  padding: "16px 18px",
  color: T.textPrimary,
  fontFamily: "'Jost', sans-serif",
  fontSize: 15,
  outline: "none",
};

function ResultCard({ result, name }) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: result.accent,
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        {name ? `${name}'s Result` : "Your Result"} · {result.label}
      </div>

      <div
        style={{
          background: T.surfaceRaised,
          border: `1px solid ${T.borderSoft}`,
          borderRadius: 16,
          padding: 24,
          marginBottom: 16,
        }}
      >
        <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textFaint, marginBottom: 8 }}>
          Old assumption
        </div>
        <div style={{ fontSize: 16, color: T.textSecondary, lineHeight: 1.5, fontStyle: "italic" }}>
          "{result.old}"
        </div>
      </div>

      <div
        style={{
          background: T.grad,
          borderRadius: 16,
          padding: 28,
          marginBottom: 24,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(0,0,0,0.6)", marginBottom: 10 }}>
          New assumption
        </div>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            fontSize: "clamp(22px,4vw,28px)",
            color: "#000",
            lineHeight: 1.3,
          }}
        >
          {result.new}
        </div>
      </div>

      <div
        style={{
          border: `1px solid ${T.borderSoft}`,
          borderRadius: 16,
          padding: 22,
          marginBottom: 28,
        }}
      >
        <div style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: T.gold, marginBottom: 10 }}>
          How to install it
        </div>
        <div style={{ fontSize: 14, color: T.textSecondary, lineHeight: 1.7 }}>
          {result.ritual}
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 13, color: T.textMuted, marginBottom: 16, lineHeight: 1.6 }}>
          This is the exact mechanism behind Self Hypnosis Goddess — hypnosis, subliminals and EMDR that install your new assumption while you sleep.
        </div>
        <a
          href="/"
          style={{
            display: "inline-block",
            background: "none",
            border: `1px solid ${T.gold}`,
            borderRadius: 30,
            padding: "14px 28px",
            color: T.gold,
            fontFamily: "'Jost', sans-serif",
            fontSize: 14,
            letterSpacing: "0.03em",
            textDecoration: "none",
          }}
        >
          See how it works
        </a>
      </div>
    </div>
  );
}
