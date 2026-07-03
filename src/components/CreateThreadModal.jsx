import { useState } from "react";
import { T } from "../design/tokens.js";
import { Btn, Modal, FormField, Label } from "./UI.jsx";
import { AUDIOS } from "../data/sample.js";

const CATEGORIES = ["Money", "Beauty", "Body", "Love", "Career", "Home", "Protection", "Identity", "Health", "Custom"];
const LISTENING_MODES = ["Morning", "Day", "Night", "Sleep", "Loop", "Custom"];
const EXAMPLES = [
  "I receive £5,000 from an unexpected source.",
  "My skin looks clear, smooth, and luminous.",
  "He sends me a loving message and asks to see me.",
  "My body looks softer, slimmer, and more feminine.",
  "My business receives three aligned buyers this week.",
  "My desired person appears with clear romantic interest.",
];

export default function CreateThreadModal({ open, onClose, preselectedAudioId }) {
  const [form, setForm] = useState({
    intentionTitle: "", intentionDetails: "", desiredCategory: "Money",
    linkedAudioId: preselectedAudioId || 1, listeningMode: "Night",
    firstListenDate: new Date().toISOString().split("T")[0],
    emotionalCertaintyScore: 7, bodySignalAfterListening: "", optionalVisualizationNote: "",
  });
  const set = k => v => setForm(f => ({ ...f, [k]: v }));

  return (
    <Modal open={open} onClose={onClose} title="Create Proof Thread" width={580}>
      <div>
        <p style={{ fontSize: 14, color: T.textMuted, marginBottom: 20, lineHeight: 1.65 }}>
          Be specific enough that your future proof is obvious.
        </p>

        {/* Examples */}
        <div style={{ marginBottom: 20 }}>
          <Label style={{ marginBottom: 8 }}>Examples</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {EXAMPLES.map((e, i) => (
              <button key={i} onClick={() => set("intentionTitle")(e)} style={{ textAlign: "left", padding: "9px 14px", background: form.intentionTitle === e ? "rgba(215,185,130,0.08)" : "rgba(23,9,18,0.5)", border: `1px solid ${form.intentionTitle === e ? "rgba(215,185,130,0.3)" : "rgba(215,185,130,0.1)"}`, borderRadius: 8, color: form.intentionTitle === e ? T.champagne : T.textMuted, fontSize: 13, cursor: "pointer", lineHeight: 1.4 }}>{e}</button>
            ))}
          </div>
        </div>

        <FormField label="Your specific intention *">
          <input value={form.intentionTitle} onChange={e => set("intentionTitle")(e.target.value)} placeholder="I receive £5,000 from an unexpected source." />
        </FormField>

        <FormField label="Details (optional)">
          <textarea value={form.intentionDetails} onChange={e => set("intentionDetails")(e.target.value)} placeholder="Add any details about this desire — timing, person, amount, specifics..." rows={2} style={{ resize: "vertical" }} />
        </FormField>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <FormField label="Category *">
            <select value={form.desiredCategory} onChange={e => set("desiredCategory")(e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </FormField>

          <FormField label="Linked Audio *">
            <select value={form.linkedAudioId} onChange={e => set("linkedAudioId")(Number(e.target.value))}>
              {AUDIOS.filter(a => !a.isLocked).map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
            </select>
          </FormField>

          <FormField label="Listening Mode">
            <select value={form.listeningMode} onChange={e => set("listeningMode")(e.target.value)}>
              {LISTENING_MODES.map(m => <option key={m}>{m}</option>)}
            </select>
          </FormField>

          <FormField label="First Listen Date">
            <input type="date" value={form.firstListenDate} onChange={e => set("firstListenDate")(e.target.value)} />
          </FormField>
        </div>

        <FormField label={`Emotional certainty score: ${form.emotionalCertaintyScore}/10`}>
          <input type="range" min={1} max={10} value={form.emotionalCertaintyScore} onChange={e => set("emotionalCertaintyScore")(Number(e.target.value))} style={{ background: "none", border: "none", padding: "8px 0", cursor: "pointer" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.textFaint }}>
            <span>Uncertain</span><span>Completely certain</span>
          </div>
        </FormField>

        <FormField label="Body signal after first listen (optional)">
          <input value={form.bodySignalAfterListening} onChange={e => set("bodySignalAfterListening")(e.target.value)} placeholder="Warmth in chest · Calm · Tingling · Sudden clarity..." />
        </FormField>

        <div style={{ display: "flex", gap: 10, paddingTop: 8 }}>
          <Btn full variant="champagne" onClick={onClose} disabled={!form.intentionTitle.trim()}>Create Proof Thread</Btn>
          <Btn variant="soft" onClick={onClose}>Cancel</Btn>
        </div>
      </div>
    </Modal>
  );
}
