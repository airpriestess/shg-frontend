import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { BetaAuth } from "../components/Onboarding";

// Reshma's private inbox for "Ask Reshma a question". Only admin emails can load it.
const API = "https://shg-auth-worker.airpriestess.workers.dev";
const G = "linear-gradient(110deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";
const paper = {
  backgroundColor: "#F2ECE4",
  backgroundImage: "linear-gradient(rgba(0,0,0,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.08) 1px,transparent 1px)",
  backgroundSize: "22px 22px",
};

export default function Answers() {
  const { isAuthenticated, loading, token } = useAuth();
  const [qs, setQs] = useState(null);
  const [err, setErr] = useState("");
  const [drafts, setDrafts] = useState({});
  const [filter, setFilter] = useState("open");

  async function load() {
    const res = await fetch(`${API}/admin/questions`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.status === 403) { setErr("This inbox is only for Reshma's account."); return; }
    const data = await res.json();
    setQs(data.questions || []);
  }
  useEffect(() => { if (token) load().catch(() => setErr("Could not load questions.")); }, [token]);

  async function send(id) {
    const answer = (drafts[id] || "").trim();
    if (!answer) return;
    const res = await fetch(`${API}/admin/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, answer }),
    });
    if (!res.ok) { setErr("Could not send, please try again."); return; }
    setDrafts((d) => ({ ...d, [id]: "" }));
    load();
  }

  if (loading) return null;
  if (!isAuthenticated) return <BetaAuth onAuthed={() => window.location.reload()} />;

  const shown = (qs || []).filter((q) => (filter === "open" ? !q.answer : !!q.answer));
  const fmt = (d) => new Date(d).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <div style={{ ...paper, minHeight: "100vh", color: "#000", fontFamily: "'Jost',sans-serif", fontWeight: 300, padding: "calc(env(safe-area-inset-top) + 20px) 16px 40px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
        <h1 style={{ fontWeight: 300, fontSize: 28, margin: 0, textAlign: "center" }}>Questions for Reshma</h1>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          {[["open", "To answer"], ["done", "Answered"]].map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)} style={{ padding: "8px 16px", borderRadius: 30, border: "1px solid #000", background: filter === k ? G : "#fff", fontFamily: "inherit", fontWeight: 300, fontSize: 14, cursor: "pointer" }}>{l}</button>
          ))}
        </div>
        {err && <div role="alert" style={{ textAlign: "center" }}>{err}</div>}
        {qs && !shown.length && <div style={{ textAlign: "center" }}>{filter === "open" ? "All answered ✓" : "Nothing answered yet."}</div>}
        {shown.map((q) => (
          <div key={q.id} style={{ background: "#fff", border: "1px solid #000", borderRadius: 16, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 13 }}>{q.name || "No name"} · {q.email || "no email (preview visitor)"} · {fmt(q.created_at)}</div>
            {q.onboarding && (q.onboarding.goals || q.onboarding.specific || q.onboarding.block) && (
              <div style={{ fontSize: 13 }}>
                Manifesting: {[].concat(q.onboarding.goals || []).join(", ")}{q.onboarding.specific ? ` · ${q.onboarding.specific}` : ""}{q.onboarding.block ? ` · Block: ${q.onboarding.block}` : ""}
              </div>
            )}
            <div style={{ fontSize: 17 }}>{q.question}</div>
            {q.answer ? (
              <div style={{ fontSize: 15, borderTop: "1px solid #000", paddingTop: 8, whiteSpace: "pre-wrap" }}>Your answer ({fmt(q.answered_at)}): {q.answer}</div>
            ) : q.email ? (
              <>
                <textarea id={`ans-${q.id}`} rows={4} value={drafts[q.id] || ""} onChange={(e) => setDrafts((d) => ({ ...d, [q.id]: e.target.value }))} placeholder="Write your answer…"
                  style={{ width: "100%", boxSizing: "border-box", padding: 12, borderRadius: 12, border: "1px solid #000", fontFamily: "inherit", fontWeight: 300, fontSize: 15, resize: "vertical" }} />
                <button onClick={() => send(q.id)} style={{ alignSelf: "flex-end", padding: "10px 22px", borderRadius: 30, border: "none", background: G, fontFamily: "inherit", fontWeight: 400, fontSize: 14, cursor: "pointer" }}>Send answer</button>
              </>
            ) : <div style={{ fontSize: 13 }}>Sent from the preview without an account, so there's no way to reply.</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
