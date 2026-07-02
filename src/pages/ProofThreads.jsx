import { useState } from "react";
import { T } from "../design/tokens.js";
import { Btn, Card, Pill, Modal, EmptyState, WaveForm, Label, FormField, ProgressBar } from "../components/UI.jsx";
import { PROOF_THREADS, AUDIOS } from "../data/sample.js";

const STATUS_COLOR = { "Active": "muted", "Evidence Appearing": "champagne", "Manifested": "success", "Paused": "muted" };
const TYPE_ICON = { "Sign": "◈", "Synchronicity": "✦", "Symptom": "◉", "Photo Proof": "📷", "Voice Proof": "🎙", "Partial Proof": "◐", "Final Manifestation": "★" };

export default function ProofThreads({ onAddProof, onCreateThread }) {
  const [threads, setThreads] = useState(PROOF_THREADS.map(t => ({
    ...t,
    mood_before: t.mood_before || "",
    mood_after: t.mood_after || "",
  })));
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("newest");
  const [addProofModal, setAddProofModal] = useState(null); // { threadId, type }
  const [newSign, setNewSign] = useState("");
  const [expandedEntry, setExpandedEntry] = useState(null);
  const [moodEdit, setMoodEdit] = useState({}); // { threadId: { before, after } }

  const statuses = ["All", "Active", "Evidence Appearing", "Manifested", "Paused"];
  const selThread = threads.find(t => t.id === selected);

  const sorted = [...threads]
    .filter(t => filter === "All" || t.status === filter)
    .sort((a, b) => {
      if (sort === "newest") return new Date(b.firstListenAt) - new Date(a.firstListenAt);
      if (sort === "most-proof") return b.proofEntryCount - a.proofEntryCount;
      if (sort === "manifested") return (b.manifestedAt ? 1 : 0) - (a.manifestedAt ? 1 : 0);
      return 0;
    });

  const markManifested = (id) => setThreads(ts => ts.map(t => t.id === id ? { ...t, status: "Manifested", manifestedAt: new Date().toISOString().split("T")[0] } : t));
  const saveMood = (threadId, field, val) => {
    setThreads(ts => ts.map(t => t.id === threadId ? { ...t, [field]: val } : t));
    setMoodEdit(prev => ({ ...prev, [threadId]: { ...prev[threadId], [field]: undefined } }));
  };

  const addSign = (threadId, sign) => {
    setThreads(ts => ts.map(t => t.id === threadId ? {
      ...t, signCount: t.signCount + 1, proofEntryCount: t.proofEntryCount + 1, lastProofAt: new Date().toISOString().split("T")[0],
      entries: [...(t.entries || []), { id: Date.now(), type: "Sign", stage: "Evidence Appearing", title: sign, happenedAt: new Date().toISOString().split("T")[0], noticedAt: new Date().toISOString().split("T")[0], dayNumber: t.daysActive }]
    } : t));
    setNewSign(""); setAddProofModal(null);
  };

  if (selected && selThread) {
    return <ProofThreadDetail thread={selThread} onBack={() => setSelected(null)} onMarkManifested={markManifested} onAddProof={(type) => setAddProofModal({ threadId: selThread.id, type })} addProofModal={addProofModal} onCloseModal={() => setAddProofModal(null)} newSign={newSign} setNewSign={setNewSign} onAddSign={addSign} expandedEntry={expandedEntry} setExpandedEntry={setExpandedEntry} moodEdit={moodEdit[selThread?.id] || {}} onMoodChange={(field,val) => setMoodEdit(prev => ({...prev,[selThread.id]:{...prev[selThread.id],[field]:val}}))} onSaveMood={(field,val) => saveMood(selThread.id, field, val)} />;
  }

  return (
    <div style={{ padding: "28px 24px", maxWidth: 880, overflowY: "auto", height: "100%" }} className="mob-pb">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: "clamp(24px,3vw,32px)", fontWeight: 700, color: "#e8e0d0", marginBottom: 6 }}>Proof Threads</h1>
        <p style={{ fontSize: 15, color: T.textMuted, marginBottom: 20, lineHeight: 1.65 }}>Every desire gets its own thread, linked to the audio that started the shift.</p>
        <Btn onClick={onCreateThread} variant="champagne" size="sm">+ Create Proof Thread</Btn>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {statuses.map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: "7px 14px", borderRadius: 20, border: `1.5px solid ${filter === s ? "#C8956A88" : "#1e1c0a"}`, background: filter === s ? "#C8956A18" : "transparent", color: filter === s ? "#C8956A" : T.textMuted, fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>{s}</button>
          ))}
        </div>
        <select value={sort} onChange={e => setSort(e.target.value)} style={{ maxWidth: 180 }}>
          <option value="newest">Newest first</option>
          <option value="most-proof">Most proof</option>
          <option value="manifested">Manifested</option>
        </select>
      </div>

      {/* Threads */}
      {sorted.length === 0 && <EmptyState icon="🧵" title="No threads yet" body="Create your first Proof Thread and link it to an audio." cta="+ Create Proof Thread" onCta={onCreateThread} />}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {sorted.map(t => (
          <Card key={t.id} hover onClick={() => setSelected(t.id)} style={{ padding: "18px 20px" }}>
            {/* Top */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#e8e0d0", marginBottom: 5, lineHeight: 1.4 }}>{t.intentionTitle}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#C8A050" }}>
                  <span>🎧</span><span>{t.linkedAudioTitle}</span>
                </div>
              </div>
              <Pill color={STATUS_COLOR[t.status] || "muted"}>{t.status}</Pill>
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
              <Stat label={`${t.daysActive}d active`} />
              <Stat label={`📎 ${t.proofEntryCount} proof entries`} />
              {t.photoProofCount > 0 && <Stat label={`📷 ${t.photoProofCount} photo`} />}
              {t.voiceProofCount > 0 && <Stat label={`🎙 ${t.voiceProofCount} voice`} />}
              {t.lastProofAt && <Stat label={`Last ${t.lastProofAt}`} />}
            </div>

            {t.manifestedAt && (
              <div style={{ fontSize: 13, color: T.success, marginBottom: 10 }}>✦ Manifested {t.manifestedAt} · {t.daysActive} days from first listen</div>
            )}

            <div style={{ display: "flex", gap: 8 }} onClick={e => e.stopPropagation()}>
              <Btn size="sm" variant="ghost" onClick={() => setSelected(t.id)}>Open thread →</Btn>
              {t.status !== "Manifested" && <Btn size="sm" variant="soft" onClick={() => { setSelected(t.id); setAddProofModal({ threadId: t.id, type: "Sign" }); }}>+ Add proof</Btn>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Stat({ label }) {
  return <span style={{ fontSize: 12, color: T.textMuted }}>{label}</span>;
}

function ProofThreadDetail({ thread: t, onBack, onMarkManifested, onAddProof, addProofModal, onCloseModal, newSign, setNewSign, onAddSign, expandedEntry, setExpandedEntry, moodEdit, onMoodChange, onSaveMood }) {
  const [localMoodBefore, setLocalMoodBefore] = useState(t.mood_before || "");
  const [localMoodAfter, setLocalMoodAfter] = useState(t.mood_after || "");

  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "24px 24px" }} className="mob-pb fade">
      <button onClick={onBack} style={{ background: "none", border: "none", color: T.textMuted, fontSize: 14, cursor: "pointer", marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>← Proof Threads</button>

      {/* Summary card */}
      <Card premium style={{ padding: "24px 24px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: T.textPrimary, lineHeight: 1.35, marginBottom: 6 }}>{t.intentionTitle}</div>
            <div style={{ fontSize: 13, color: "#C8A050", marginBottom: 12 }}>🎧 {t.linkedAudioTitle}</div>
          </div>
          <Pill color={STATUS_COLOR[t.status] || "muted"}>{t.status}</Pill>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
          {[{ v: t.daysActive, l: "Days active", c: "#C8A050" }, { v: t.proofEntryCount, l: "Proof entries", c: "#C8A050" }, { v: t.photoProofCount, l: "Photo proof", c: "#C8956A" }, { v: t.voiceProofCount, l: "Voice proof", c: "#C8956A" }].map((s, i) => (
            <div key={i} style={{ textAlign: "center", padding: "12px 8px", background: "#060400", borderRadius: 10, border: "1px solid #1e1c0a" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.c, lineHeight: 1, marginBottom: 3 }}>{s.v}</div>
              <div style={{ fontSize: 11, color: T.textMuted }}>{s.l}</div>
            </div>
          ))}
        </div>
        {t.manifestedAt && <div style={{ padding: "10px 14px", background: "rgba(58,138,74,0.08)", border: "1px solid rgba(58,138,74,0.2)", borderRadius: 10, fontSize: 14, color: T.success }}>✦ Manifested {t.manifestedAt} · {t.daysActive} days from first listen to final proof</div>}
      </Card>

      {/* MOOD BEFORE / AFTER CAPTURE */}
      <div style={{ background: "#0a0800", border: "1.5px solid #C8956A44", borderRadius: 14, padding: "18px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#C8956A", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14 }}>How are you feeling?</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: T.textFaint, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Before listening</div>
            <textarea
              value={localMoodBefore}
              onChange={e => setLocalMoodBefore(e.target.value)}
              placeholder="e.g. anxious about money, stressed, doubtful..."
              rows={2}
              style={{ width: "100%", background: "#060400", border: "1px solid #1e1c0a", borderRadius: 8, padding: "10px 12px", color: T.textPrimary, fontSize: 13, resize: "none", fontFamily: "Inter,sans-serif", outline: "none" }}
            />
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#C8A050", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>After listening</div>
            <textarea
              value={localMoodAfter}
              onChange={e => setLocalMoodAfter(e.target.value)}
              placeholder="e.g. more relaxed, certain, calm, detached..."
              rows={2}
              style={{ width: "100%", background: "#060400", border: "1px solid #C8A05033", borderRadius: 8, padding: "10px 12px", color: T.textPrimary, fontSize: 13, resize: "none", fontFamily: "Inter,sans-serif", outline: "none" }}
            />
          </div>
        </div>
        {(localMoodBefore !== t.mood_before || localMoodAfter !== t.mood_after) && (
          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            <button onClick={() => { onSaveMood("mood_before", localMoodBefore); onSaveMood("mood_after", localMoodAfter); }}
              style={{ padding: "7px 16px", background: "linear-gradient(90deg,#C8A050,#C8956A)", border: "none", borderRadius: 8, color: "#000", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Save</button>
            <button onClick={() => { setLocalMoodBefore(t.mood_before || ""); setLocalMoodAfter(t.mood_after || ""); }}
              style={{ padding: "7px 14px", background: "none", border: "1px solid #1e1c0a", borderRadius: 8, color: T.textMuted, fontSize: 13, cursor: "pointer" }}>Cancel</button>
          </div>
        )}
        {t.mood_before && t.mood_after && (
          <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12, padding: "3px 10px", background: "#0a0a0a", border: "1px solid #1e1c0a", borderRadius: 20, color: T.textFaint }}>Before: {t.mood_before}</span>
            <span style={{ fontSize: 12, color: T.textFaint }}>→</span>
            <span style={{ fontSize: 12, padding: "3px 10px", background: "#C8A05018", border: "1px solid #C8A05033", borderRadius: 20, color: "#C8A050" }}>After: {t.mood_after}</span>
          </div>
        )}
      </div>

      {/* Quick capture actions */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        <Btn size="sm" variant="champagne" onClick={() => onAddProof("Photo Proof")}>📷 Add Photo Proof</Btn>
        <Btn size="sm" variant="ghost" onClick={() => onAddProof("Voice Proof")}>🎙 Record Voice Proof</Btn>
        <Btn size="sm" variant="ghost" onClick={() => onAddProof("Sign")}>◈ Log Sign</Btn>
        <Btn size="sm" variant="ghost" onClick={() => onAddProof("Synchronicity")}>✦ Synchronicity</Btn>
        <Btn size="sm" variant="ghost" onClick={() => onAddProof("Symptom")}>◉ Symptom</Btn>
        {t.status !== "Manifested" && <Btn size="sm" variant="soft" onClick={() => onMarkManifested(t.id)}>★ Mark Manifested</Btn>}
      </div>

      {/* Timeline */}
      <div>
        <Label style={{ marginBottom: 16 }}>Timeline · {t.proofEntryCount} entries</Label>
        {(!t.entries || t.entries.length === 0) && <EmptyState icon="◈" title="No proof yet" body="Add your first sign, photo proof, or voice note." />}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {(t.entries || []).map((e, idx) => (
            <div key={e.id} style={{ display: "flex", gap: 0 }}>
              {/* Timeline line */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: 16, flexShrink: 0 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: e.isFinal ? `linear-gradient(135deg, ${T.success}, ${T.gold})` : "#0f0b01", border: `2px solid ${e.isFinal ? T.success : "#504020"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, zIndex: 1 }}>{TYPE_ICON[e.type] || "·"}</div>
                {idx < (t.entries || []).length - 1 && <div style={{ width: 1, flex: 1, background: "#1e1c0a", minHeight: 20, margin: "4px 0" }} />}
              </div>
              {/* Entry card */}
              <Card onClick={() => setExpandedEntry(expandedEntry === e.id ? null : e.id)} style={{ flex: 1, padding: "14px 16px", marginBottom: 10, cursor: "pointer", background: e.isFinal ? "linear-gradient(135deg, rgba(141,175,122,0.1), #140f04)" : "#0a0800", border: e.isFinal ? "1px solid rgba(141,175,122,0.25)" : "1px solid #1e1c0a" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                      <Pill color={e.isFinal ? "success" : e.type === "Photo Proof" || e.type === "Voice Proof" ? "champagne" : "muted"}>{e.type}</Pill>
                      <span style={{ fontSize: 11, color: "#504020" }}>Day {e.dayNumber}</span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "#e8e0d0", lineHeight: 1.35 }}>{e.title}</div>
                  </div>
                  <span style={{ fontSize: 12, color: "#504020", flexShrink: 0 }}>{e.happenedAt}</span>
                </div>
                {expandedEntry === e.id && e.description && (
                  <div style={{ fontSize: 14, color: T.textMuted, lineHeight: 1.7, marginTop: 8, paddingTop: 10, borderTop: "1px solid #1e1c0a" }}>{e.description}</div>
                )}
                {e.type === "Voice Proof" && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                    <button style={{ width: 30, height: 30, borderRadius: "50%", background: `linear-gradient(135deg, ${T.rose}, ${T.rose})`, border: "none", color: "#fff", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>▶</button>
                    <WaveForm playing={false} />
                    <span style={{ fontSize: 11, color: "#504020" }}>{e.durationSec}s</span>
                  </div>
                )}
                {e.isFinal && <div style={{ marginTop: 10, fontSize: 13, color: T.success, fontWeight: 600 }}>★ Final Manifestation Proof</div>}
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Quick add sign modal */}
      <Modal open={addProofModal?.type === "Sign"} onClose={onCloseModal} title="Log a Sign">
        <FormField label="What sign did you notice?">
          <input value={newSign} onChange={e => setNewSign(e.target.value)} placeholder="Describe the sign or synchronicity..." onKeyDown={e => e.key === "Enter" && onAddSign(t.id, newSign)} />
        </FormField>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {["Saw a number sequence", "Dreamed about it", "Someone mentioned it unexpectedly", "Felt calm certainty", "Overheard a relevant conversation", "Received a surprise message"].map((s, i) => (
            <button key={i} onClick={() => setNewSign(s)} style={{ padding: "5px 12px", background: "none", border: "1px solid #1e1c0a", borderRadius: 20, color: T.textMuted, fontSize: 12, cursor: "pointer" }}>{s}</button>
          ))}
        </div>
        <Btn full variant="champagne" onClick={() => onAddSign(t.id, newSign)} disabled={!newSign.trim()}>Log Sign</Btn>
      </Modal>

      <Modal open={addProofModal?.type === "Photo Proof"} onClose={onCloseModal} title="Add Photo Proof">
        <PhotoProofForm threadId={t.id} onClose={onCloseModal} />
      </Modal>

      <Modal open={addProofModal?.type === "Voice Proof"} onClose={onCloseModal} title="Record Voice Proof">
        <VoiceProofRecorder threadId={t.id} onClose={onCloseModal} />
      </Modal>
    </div>
  );
}

function PhotoProofForm({ threadId, onClose }) {
  const [form, setForm] = useState({ title: "", description: "", proofType: "Photo Proof", proofStage: "Evidence Appearing", happenedAt: "", noticedAt: "" });
  const [file, setFile] = useState(null);
  const proofTypes = ["Photo Proof", "Sign", "Symptom", "Synchronicity", "Partial Proof", "Final Manifestation"];
  const proofStages = ["Before Manifestation", "Evidence Appearing", "Final Proof", "After Manifestation"];
  return (
    <div>
      <div style={{ border: "2px dashed #504020", borderRadius: 12, padding: "28px 20px", textAlign: "center", marginBottom: 16, cursor: "pointer", background: "#060400" }}
        onClick={() => document.getElementById("photo-upload").click()}>
        <input id="photo-upload" type="file" accept=".jpg,.jpeg,.png,.webp,.heic" style={{ display: "none" }} onChange={e => setFile(e.target.files[0])} />
        {file ? <div style={{ color: T.success, fontSize: 14, fontWeight: 600 }}>📷 {file.name}</div> : <div><div style={{ fontSize: 28, marginBottom: 8 }}>📷</div><div style={{ fontSize: 14, color: T.textMuted }}>Tap to upload photo proof</div><div style={{ fontSize: 12, color: "#504020", marginTop: 4 }}>JPG · PNG · WEBP · HEIC</div></div>}
      </div>
      <FormField label="Title"><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Bank notification arrived · He texted · Skin shifted..." /></FormField>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <FormField label="Proof Type"><select value={form.proofType} onChange={e => setForm({ ...form, proofType: e.target.value })}>{proofTypes.map(p => <option key={p}>{p}</option>)}</select></FormField>
        <FormField label="Proof Stage"><select value={form.proofStage} onChange={e => setForm({ ...form, proofStage: e.target.value })}>{proofStages.map(p => <option key={p}>{p}</option>)}</select></FormField>
        <FormField label="When it happened"><input type="date" value={form.happenedAt} onChange={e => setForm({ ...form, happenedAt: e.target.value })} /></FormField>
        <FormField label="When you noticed"><input type="date" value={form.noticedAt} onChange={e => setForm({ ...form, noticedAt: e.target.value })} /></FormField>
      </div>
      <FormField label="Description"><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe what happened..." rows={3} style={{ resize: "vertical" }} /></FormField>
      <div style={{ display: "flex", gap: 10 }}>
        <Btn full variant="champagne" onClick={onClose} disabled={!form.title}>Save Photo Proof</Btn>
        <Btn variant="soft" onClick={onClose}>Cancel</Btn>
      </div>
    </div>
  );
}

function VoiceProofRecorder({ threadId, onClose }) {
  const [state, setState] = useState("idle"); // idle, recording, recorded
  const [seconds, setSeconds] = useState(0);
  const [form, setForm] = useState({ title: "", proofType: "Voice Proof", proofStage: "Evidence Appearing", happenedAt: "" });

  const startRec = () => { setState("recording"); const iv = setInterval(() => setSeconds(s => s + 1), 1000); setTimeout(() => { clearInterval(iv); setState("recorded"); }, 120000); };
  const stopRec = () => setState("recorded");

  return (
    <div>
      <div style={{ textAlign: "center", padding: "28px 20px", background: "#060400", borderRadius: 14, marginBottom: 20, border: "1px solid #1e1c0a" }}>
        {state === "idle" && <div><div style={{ fontSize: 40, marginBottom: 12 }}>🎙</div><div style={{ fontSize: 15, color: T.textMuted, marginBottom: 16 }}>Press record and speak your proof. How does it feel? What shifted?</div><Btn variant="primary" onClick={startRec}>● Start Recording</Btn></div>}
        {state === "recording" && <div><WaveForm playing /><div style={{ fontSize: 28, fontWeight: 700, color: T.rose, margin: "16px 0", fontFamily: "monospace" }}>{String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}</div><div style={{ fontSize: 13, color: T.textMuted, marginBottom: 16 }}>Recording...</div><Btn variant="danger" onClick={stopRec}>■ Stop</Btn></div>}
        {state === "recorded" && <div><div style={{ fontSize: 13, color: T.success, marginBottom: 12, fontWeight: 600 }}>✓ Recorded · {seconds}s</div><div style={{ display: "flex", gap: 10, justifyContent: "center" }}><Btn size="sm" variant="ghost" onClick={() => { setState("idle"); setSeconds(0); }}>Re-record</Btn><Btn size="sm" variant="ghost" onClick={startRec}>▶ Play back</Btn></div></div>}
      </div>
      {state === "recorded" && (
        <>
          <FormField label="Title"><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="I woke up feeling certain before anything happened..." /></FormField>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormField label="Proof Type"><select value={form.proofType} onChange={e => setForm({ ...form, proofType: e.target.value })}>{["Voice Proof", "Sign", "Symptom", "Final Manifestation"].map(p => <option key={p}>{p}</option>)}</select></FormField>
            <FormField label="When it happened"><input type="date" value={form.happenedAt} onChange={e => setForm({ ...form, happenedAt: e.target.value })} /></FormField>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn full variant="champagne" onClick={onClose} disabled={!form.title}>Save Voice Proof</Btn>
            <Btn variant="soft" onClick={onClose}>Cancel</Btn>
          </div>
        </>
      )}
    </div>
  );
}
