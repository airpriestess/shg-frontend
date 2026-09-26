import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const G = "linear-gradient(110deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";
const CREAM = "#F2ECE4";
const AREAS = ["Luck", "Money", "Love", "Beauty", "Confidence", "Career", "Health", "Peace"];

const shell = { position: "fixed", inset: 0, zIndex: 2000, background: "#000", color: CREAM, fontFamily: "'Jost',sans-serif", fontWeight: 300, overflowY: "auto", display: "flex", justifyContent: "center", padding: "calc(env(safe-area-inset-top) + 20px) 18px calc(env(safe-area-inset-bottom) + 24px)" };
const col = { width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", gap: 16 };
const field = { width: "100%", boxSizing: "border-box", padding: "14px 16px", borderRadius: 14, border: "1px solid #F2ECE4", background: "#000", color: CREAM, fontFamily: "inherit", fontWeight: 300, fontSize: 16 };
const btn = { padding: "15px 20px", border: "none", borderRadius: 40, background: G, color: "#000", fontFamily: "inherit", fontWeight: 400, fontSize: 14, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer" };
const link = { background: "none", border: "none", color: CREAM, fontFamily: "inherit", fontWeight: 300, fontSize: 13, textDecoration: "underline", cursor: "pointer", padding: 8 };
const eyebrow = { fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", background: G, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", textAlign: "center" };
const h1 = { fontWeight: 300, fontSize: 28, lineHeight: 1.2, margin: 0, textAlign: "center" };

function Logo() {
  return <img src="/logo_transparent_cropped.png" alt="" width={56} height={56} style={{ margin: "0 auto", display: "block", objectFit: "contain" }} />;
}

// /beta: create an account or sign in, then the 10-question onboarding quiz runs in the app.
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
      <style>{`#ob-name::placeholder,#ob-email::placeholder,#ob-password::placeholder{color:#F2ECE4;opacity:.75}`}</style>
      <form style={col} onSubmit={submit}>
        <Logo />
        <div style={eyebrow}>Self Hypnosis Goddess</div>
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
