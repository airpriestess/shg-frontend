import { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";

const G = "linear-gradient(110deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";
const CREAM = "#F2ECE4";
const AREAS = ["Luck", "Money", "Love", "Beauty", "Confidence", "Career", "Health", "Peace"];

const shell = { position: "fixed", inset: 0, zIndex: 2000, background: "#000", color: CREAM, fontFamily: "'Futura','Jost',sans-serif", fontWeight: 300, overflowY: "auto", display: "flex", justifyContent: "center", padding: "calc(env(safe-area-inset-top) + 20px) 18px calc(env(safe-area-inset-bottom) + 24px)" };
const col = { width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", gap: 16 };
const field = { width: "100%", boxSizing: "border-box", padding: "14px 16px", borderRadius: 14, border: "1px solid rgba(242,236,228,0.35)", background: "#000", color: CREAM, fontFamily: "inherit", fontWeight: 300, fontSize: 16 };
const btn = { padding: "15px 20px", border: "none", borderRadius: 40, background: G, color: "#000", fontFamily: "inherit", fontWeight: 400, fontSize: 14, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer" };
const link = { background: "none", border: "none", color: CREAM, fontFamily: "inherit", fontWeight: 300, fontSize: 13, textDecoration: "underline", cursor: "pointer", padding: 8 };
const eyebrow = { fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", background: G, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", textAlign: "center" };
const h1 = { fontWeight: 300, fontSize: 28, lineHeight: 1.2, margin: 0, textAlign: "center" };

function Logo() {
  return <img src="/logo_transparent_cropped.png" alt="" width={56} height={56} style={{ margin: "0 auto", display: "block", objectFit: "contain" }} />;
}

// Step 0 for /beta: create an account or sign in.
export function BetaAuth({ onAuthed }) {
  const { signUp, signIn } = useAuth();
  const [mode, setMode] = useState("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault(); setErr(""); setBusy(true);
    try {
      mode === "signup" ? await signUp(email.trim(), password, name.trim()) : await signIn(email.trim(), password);
      onAuthed?.();
    } catch (x) { setErr(x.message); } finally { setBusy(false); }
  }
  return (
    <div style={shell}>
      <form style={col} onSubmit={submit}>
        <Logo />
        <div style={eyebrow}>Self Hypnosis Goddess · Beta</div>
        <h1 style={h1}>{mode === "signup" ? "Create your account" : "Welcome back"}</h1>
        {mode === "signup" && <input id="ob-name" style={field} placeholder="First name" autoComplete="given-name" value={name} onChange={(e) => setName(e.target.value)} required />}
        <input id="ob-email" style={field} type="email" placeholder="Email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input id="ob-password" style={field} type="password" placeholder={mode === "signup" ? "Password (8+ characters)" : "Password"} autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
        {err && <div role="alert" style={{ fontSize: 14, textAlign: "center" }}>{err}</div>}
        <button style={btn} disabled={busy}>{busy ? "One moment…" : mode === "signup" ? "Create account" : "Sign in"}</button>
        <button type="button" style={link} onClick={() => { setErr(""); setMode(mode === "signup" ? "signin" : "signup"); }}>
          {mode === "signup" ? "Already have an account? Sign in" : "New here? Create an account"}
        </button>
      </form>
    </div>
  );
}

// The onboarding questions. preview = investor/demo mode (Skip allowed, nothing saved to the server).
export default function Onboarding({ initialName = "", preview = false, onDone, onSkip }) {
  const [step, setStep] = useState(0);
  const [a, setA] = useState({ name: initialName, birthday: "", areas: [], desire: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [listening, setListening] = useState(false);
  const rec = useRef(null);
  const set = (patch) => setA((x) => ({ ...x, ...patch }));
  const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

  function speak() {
    if (listening) { rec.current?.stop(); return; }
    const r = new SR(); rec.current = r;
    r.lang = "en-GB"; r.interimResults = false; r.continuous = false;
    r.onresult = (e) => set({ desire: (a.desire ? a.desire + " " : "") + e.results[0][0].transcript });
    r.onend = () => setListening(false);
    setListening(true); r.start();
  }

  async function finish() {
    setBusy(true); setErr("");
    try { await onDone?.({ ...a, completed_at: new Date().toISOString() }); }
    catch (x) { setErr(x.message || "Could not save, please try again"); setBusy(false); }
  }

  const steps = [
    { q: "What should we call you?", ok: a.name.trim(), body: <input id="ob-q-name" style={field} placeholder="Your name" value={a.name} onChange={(e) => set({ name: e.target.value })} /> },
    { q: "When is your birthday?", note: "So we can celebrate you.", ok: true, body: <input id="ob-q-birthday" style={field} type="date" value={a.birthday} onChange={(e) => set({ birthday: e.target.value })} /> },
    { q: "What are you manifesting?", note: "Pick as many as you like.", ok: a.areas.length, body: (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
        {AREAS.map((x) => {
          const on = a.areas.includes(x);
          return <button key={x} type="button" aria-pressed={on} onClick={() => set({ areas: on ? a.areas.filter((y) => y !== x) : [...a.areas, x] })}
            style={{ padding: "11px 18px", borderRadius: 30, fontFamily: "inherit", fontWeight: 300, fontSize: 15, cursor: "pointer", border: on ? "1px solid transparent" : "1px solid rgba(242,236,228,0.4)", background: on ? G : "#000", color: on ? "#000" : CREAM }}>{x}</button>;
        })}
      </div>) },
    { q: "In your own words, what do you want to happen?", note: "Type it or tap the mic and say it.", ok: a.desire.trim(), body: (
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <textarea id="ob-q-desire" rows={5} style={{ ...field, resize: "none", lineHeight: 1.5 }} placeholder="I want to…" value={a.desire} onChange={(e) => set({ desire: e.target.value })} />
        {SR && <button type="button" onClick={speak} style={{ ...link, textDecoration: "none", border: "1px solid rgba(242,236,228,0.4)", borderRadius: 30, padding: "10px 16px", alignSelf: "center" }}>{listening ? "Listening… tap to stop" : "🎙  Speak it"}</button>}
      </div>) },
  ];
  const s = steps[step];
  const last = step === steps.length - 1;

  return (
    <div style={shell}>
      <div style={col}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: 36 }}>
          {step > 0 ? <button style={link} onClick={() => setStep(step - 1)}>‹ Back</button> : <span />}
          {preview && <button style={link} onClick={onSkip}>Skip</button>}
        </div>
        <Logo />
        <div style={eyebrow}>Step {step + 1} of {steps.length}</div>
        <div style={{ height: 2, borderRadius: 2, background: "rgba(242,236,228,0.15)" }}><div style={{ height: "100%", width: `${((step + 1) / steps.length) * 100}%`, background: G, borderRadius: 2, transition: "width .3s" }} /></div>
        <h1 style={h1}>{s.q}</h1>
        {s.note && <div style={{ textAlign: "center", fontSize: 14 }}>{s.note}</div>}
        {s.body}
        {err && <div role="alert" style={{ fontSize: 14, textAlign: "center" }}>{err}</div>}
        <button style={{ ...btn, opacity: s.ok ? 1 : 0.4 }} disabled={!s.ok || busy} onClick={() => (last ? finish() : setStep(step + 1))}>
          {last ? (busy ? "Saving…" : "Open my app") : "Next"}
        </button>
        {step === 1 && <button style={link} onClick={() => setStep(2)}>Skip this one</button>}
      </div>
    </div>
  );
}
