import { useEffect, useState } from "react";

// A member's questions to Reshma and her answers. Opening it marks answers as read.
const API = "https://shg-auth-worker.airpriestess.workers.dev";
const G = "linear-gradient(110deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";
const tokenOf = () => { try { return localStorage.getItem("shg_auth_token"); } catch { return null; } };

export async function fetchMyQuestions() {
  const token = tokenOf();
  if (!token) return [];
  try {
    const res = await fetch(`${API}/questions`, { headers: { Authorization: `Bearer ${token}` } });
    return res.ok ? (await res.json()).questions || [] : [];
  } catch { return []; }
}

export const unreadCount = (qs) => qs.filter((q) => q.answer && !q.read_at).length;

export default function MyQuestions({ questions, onRead }) {
  const [qs, setQs] = useState(questions || null);
  useEffect(() => { if (!questions) fetchMyQuestions().then(setQs); }, [questions]);
  useEffect(() => {
    if (!qs || !unreadCount(qs)) return;
    const token = tokenOf();
    if (!token) return;
    fetch(`${API}/questions/read`, { method: "POST", headers: { Authorization: `Bearer ${token}` } })
      .then(() => onRead?.()).catch(() => {});
  }, [qs, onRead]);
  if (!qs || !qs.length) return null;
  const fmt = (d) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14, textAlign: "left" }}>
      <div style={{ fontSize: 11, letterSpacing: "0.24em", textTransform: "uppercase", textAlign: "center" }}>My questions</div>
      {qs.map((q) => (
        <div key={q.id} style={{ background: "#fff", border: "1px solid #000", borderRadius: 14, padding: "12px 14px", fontWeight: 300, color: "#000" }}>
          <div style={{ fontSize: 12 }}>{fmt(q.created_at)}</div>
          <div style={{ fontSize: 15, marginTop: 4 }}>{q.question}</div>
          {q.answer
            ? <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid transparent", borderImage: `${G} 1` }}>
                <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" }}>Reshma {!q.read_at && "· new"}</div>
                <div style={{ fontSize: 15, marginTop: 4, whiteSpace: "pre-wrap" }}>{q.answer}</div>
              </div>
            : <div style={{ fontSize: 13, marginTop: 8 }}>Waiting for Reshma's answer…</div>}
        </div>
      ))}
    </div>
  );
}
