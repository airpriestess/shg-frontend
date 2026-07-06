import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";

const R = "#B76E79", P = "#d4a090", CH = "#e8b870";

export default function AuthGate({ onSuccess }) {
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState("signin"); // signin | signup | reset
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "reset") {
        await resetPassword(email);
        setResetSent(true);
      } else if (mode === "signup") {
        await signUp(email, password, name);
        if (onSuccess) onSuccess();
      } else {
        await signIn(email, password);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%", padding: "12px 16px", background: "#0a0700",
    border: `1px solid ${error ? "#c84040" : "rgba(183,110,121,0.25)"}`,
    borderRadius: 10, color: "#f2ece4", fontSize: 14, fontFamily: "'Jost',sans-serif",
    outline: "none", marginBottom: 12,
  };

  const btnStyle = {
    width: "100%", padding: "13px", background: `linear-gradient(90deg,${CH},${P},${R})`,
    border: "none", borderRadius: 10, color: "#000", fontSize: 14, fontWeight: 700,
    fontFamily: "'Jost',sans-serif", cursor: loading ? "wait" : "pointer",
    opacity: loading ? 0.7 : 1, letterSpacing: "0.04em",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#000", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400, textAlign: "center" }}>
        {/* Logo */}
        <div className="wm wm-shimmer" style={{ fontSize: 28, marginBottom: 6 }}>Self Hypnosis Goddess</div>
        <div style={{ fontSize: 12, color: "#8a6858", fontFamily: "'Jost',sans-serif", letterSpacing: "0.15em", marginBottom: 36 }}>
          {mode === "signin" ? "Welcome back" : mode === "signup" ? "Create your account" : "Reset password"}
        </div>

        {resetSent ? (
          <div style={{ padding: 20, background: "rgba(106,176,106,0.1)", border: "1px solid rgba(106,176,106,0.3)", borderRadius: 12, color: "#6ab06a", fontSize: 14, lineHeight: 1.7 }}>
            Check your email for a password reset link.
            <button onClick={() => { setMode("signin"); setResetSent(false); }} style={{ display: "block", margin: "16px auto 0", background: "none", border: "none", color: R, fontSize: 13, cursor: "pointer", fontFamily: "'Jost',sans-serif" }}>
              Back to sign in
            </button>
          </div>
        ) : (
          <div>
            {mode === "signup" && (
              <input style={inputStyle} placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
            )}
            <input style={inputStyle} placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            {mode !== "reset" && (
              <input style={inputStyle} placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            )}

            {error && (
              <div style={{ padding: "10px 14px", background: "rgba(200,64,64,0.1)", border: "1px solid rgba(200,64,64,0.3)", borderRadius: 8, color: "#c88080", fontSize: 13, marginBottom: 12, textAlign: "left" }}>
                {error}
              </div>
            )}

            <button style={btnStyle} onClick={handleSubmit} disabled={loading}>
              {loading ? "..." : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
            </button>

            <div style={{ marginTop: 16, fontSize: 13, color: "#8a6858", fontFamily: "'Jost',sans-serif" }}>
              {mode === "signin" && (
                <>
                  <span style={{ cursor: "pointer", color: R }} onClick={() => setMode("reset")}>Forgot password?</span>
                  <span style={{ margin: "0 8px" }}>·</span>
                  <span style={{ cursor: "pointer", color: P }} onClick={() => setMode("signup")}>Create account</span>
                </>
              )}
              {mode === "signup" && (
                <span>Already have an account? <span style={{ cursor: "pointer", color: R }} onClick={() => setMode("signin")}>Sign in</span></span>
              )}
              {mode === "reset" && (
                <span style={{ cursor: "pointer", color: R }} onClick={() => setMode("signin")}>Back to sign in</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
