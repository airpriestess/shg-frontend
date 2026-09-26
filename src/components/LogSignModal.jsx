import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const GRAD = "linear-gradient(135deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";

const CATEGORIES = [
  { id: "money",    label: "Money",    icon: "💰" },
  { id: "love",     label: "Love",     icon: "💜" },
  { id: "home",     label: "Home",     icon: "⌂" },
  { id: "body",     label: "Body",     icon: "✨" },
  { id: "identity", label: "Identity", icon: "⭐" },
  { id: "general",  label: "General",  icon: "◈" },
];

// Animates numbers counting up
function useCountUp(target, duration = 800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    let start = 0;
    const step = Math.ceil(duration / 60);
    const timer = setInterval(() => {
      start += Math.ceil(target / 60);
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(start);
    }, step);
    return () => clearInterval(timer);
  }, [target, duration]);
  return val;
}

export function ManifestCelebration({ intention, signCount, onClose }) {
  const countedSigns = useCountUp(signCount, 1200);

  useEffect(() => {
    const t = setTimeout(onClose, 7000);
    return () => clearTimeout(t);
  }, []);

  return createPortal(
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#0a0906",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 32, textAlign: "center",
      animation: "celebIn 0.4s ease",
    }}>
      <style>{`
        @keyframes celebIn { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }
        @keyframes starPulse { 0%,100%{transform:scale(1);opacity:1;} 50%{transform:scale(1.15);opacity:0.9;} }
        @keyframes floatUp { 0%{transform:translateY(0);opacity:1;} 100%{transform:translateY(-80px);opacity:0;} }
      `}</style>

      {/* Star */}
      <div style={{ fontSize: 72, marginBottom: 28, animation: "starPulse 2s ease-in-out infinite" }}>★</div>

      {/* Gradient headline */}
      <div style={{
        fontFamily: "'Cormorant Garamond',serif",
        fontSize: "clamp(36px,8vw,60px)",
        fontWeight: 300,
        background: GRAD,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        lineHeight: 1.1,
        marginBottom: 16,
      }}>
        Manifested.
      </div>

      {/* Intention */}
      <div style={{
        fontFamily: "'Jost',sans-serif",
        fontSize: "clamp(18px,3.5vw,26px)",
        fontWeight: 300,
        color: "#fdf0e8",
        maxWidth: 480,
        lineHeight: 1.5,
        marginBottom: 32,
      }}>
        "{intention}"
      </div>

      {/* Signs stat */}
      <div style={{
        display: "flex", alignItems: "baseline", gap: 8,
        marginBottom: 40,
      }}>
        <span style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: 64,
          fontWeight: 300,
          color: "#E8B870",
          lineHeight: 1,
        }}>{countedSigns}</span>
        <span style={{
          fontFamily: "'Jost',sans-serif",
          fontSize: 16,
          color: "rgba(253,240,232,0.6)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}>signs logged</span>
      </div>

      {/* Done button */}
      <button onClick={onClose} style={{
        fontFamily: "'Jost',sans-serif",
        fontSize: 15,
        fontWeight: 500,
        color: "#0a0906",
        background: GRAD,
        border: "none",
        borderRadius: 100,
        padding: "14px 40px",
        cursor: "pointer",
        letterSpacing: "0.06em",
      }}>
        Continue ✦
      </button>

      <div style={{ marginTop: 16, fontSize: 13, color: "rgba(253,240,232,0.3)", fontFamily: "'Jost',sans-serif" }}>
        Closing automatically…
      </div>
    </div>,
    document.body
  );
}

// Keep photos small enough to save on the phone.
function shrinkImage(file, max = 900) {
  return new Promise(res => {
    const r = new FileReader();
    r.onload = () => { const im = new Image(); im.onload = () => { const k = Math.min(1, max / Math.max(im.width, im.height)); const c = document.createElement("canvas"); c.width = im.width * k; c.height = im.height * k; c.getContext("2d").drawImage(im, 0, 0, c.width, c.height); res(c.toDataURL("image/jpeg", 0.8)); }; im.src = r.result; };
    r.readAsDataURL(file);
  });
}

export default function LogSignModal({ onHideButton, onClose, onSaved, userId, token, apiUrl, isDark, activeIntentions = [] }) {
  const [step, setStep]         = useState("input"); // input | confirm | saved
  const [text, setText]         = useState("");
  const [listening, setListening] = useState(false);
  const [parsed, setParsed]     = useState(null);   // {matched_intention_id, category, summary}
  const [parsing, setParsing]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [savedCount, setSavedCount] = useState(null);
  const recognitionRef          = useRef(null);
  const [img, setImg]           = useState(null);
  const [audio, setAudio]       = useState(null);
  const [recording, setRecording] = useState(false);
  const recRef                  = useRef(null);
  const startNote = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream); const chunks = [];
      mr.ondataavailable = e => chunks.push(e.data);
      mr.onstop = () => { stream.getTracks().forEach(t => t.stop()); const r = new FileReader(); r.onload = () => setAudio(r.result); r.readAsDataURL(new Blob(chunks, { type: mr.mimeType || "audio/webm" })); };
      mr.start(); recRef.current = mr; setRecording(true);
    } catch { alert("Allow microphone access to record a voice note."); }
  };
  const stopNote = () => { recRef.current?.stop(); setRecording(false); };
  const textareaRef             = useRef(null);

  // Always cream graph paper with black text, in both themes
  const C = { bg: "#F2ECE4", surface: "#F2ECE4", text: "#000", mu: "#000", border: "rgba(0,0,0,0.25)" };

  // Auto-focus textarea
  useEffect(() => {
    setTimeout(() => textareaRef.current?.focus(), 120);
  }, []);

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Voice input not supported in this browser. Please type instead."); return; }
    const rec = new SR();
    rec.lang = "en-US";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setText(prev => (prev ? prev + " " : "") + transcript);
      setListening(false);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const handleParse = async () => {
    if (!text.trim() && !img && !audio) return;
    if (!userId || !token) {
      // No auth — go straight to confirm with manual category pick
      setParsed({ matched_intention_id: null, category: "general", summary: text.slice(0, 60) });
      setStep("confirm");
      return;
    }
    setParsing(true);
    try {
      const res = await fetch(`${apiUrl}/signs/parse`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: text.trim() }),
      });
      const data = await res.json();
      setParsed(data);
    } catch {
      setParsed({ matched_intention_id: null, category: "general", summary: text.slice(0, 60) });
    }
    setParsing(false);
    setStep("confirm");
  };

  const handleSave = async () => {
    if (!userId || !token) {
      // Preview: save on this device so it shows in proofOS straight away
      const linked = activeIntentions.find(i => i.id === parsed?.matched_intention_id);
      setSavedCount(linked ? (linked.signCount || 0) + 1 : 1);
      setStep("saved");
      onSaved?.({ content: text.trim() || (img ? "Photo sign" : "Voice note sign"), img, audio, manifestation_id: parsed?.matched_intention_id ?? null, categories: parsed?.categories || [parsed?.category || "general"] });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${apiUrl}/signs`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          content: text.trim(),
          manifestation_id: parsed?.matched_intention_id || null,
          category: parsed?.category || "general",
          categories: parsed?.categories || [parsed?.category || "general"],
        }),
      });
      const data = await res.json();
      // Get updated sign count for this intention
      if (parsed?.matched_intention_id) {
        try {
          const signsRes = await fetch(`${apiUrl}/signs?manifestation_id=${parsed.matched_intention_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const signsData = await signsRes.json();
          setSavedCount(signsData.length || 1);
        } catch { setSavedCount(1); }
      } else {
        setSavedCount(1);
      }
      setStep("saved");
      onSaved?.({ ...data, content: data?.content || text.trim(), manifestation_id: data?.manifestation_id ?? parsed?.matched_intention_id ?? null });
      setTimeout(onClose, 2000);
    } catch {
      setSaving(false);
    }
  };

  const matchedIntention = activeIntentions.find(i => i.id === parsed?.matched_intention_id);
  const categoryInfo = CATEGORIES.find(c => c.id === parsed?.category) || CATEGORIES[4];

  return createPortal(
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 8000,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
      }} />

      {/* Sheet */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 8001,
        backgroundColor: "#F2ECE4", color: "#000",
        backgroundImage: "linear-gradient(rgba(191,165,216,.35) 1px,transparent 1px),linear-gradient(90deg,rgba(191,165,216,.35) 1px,transparent 1px)",
        backgroundSize: "20px 20px",
        borderTop: "2px solid #BFA5D8",
        borderRadius: "20px 20px 0 0",
        padding: "8px 0 0",
        maxHeight: "90vh",
        overflowY: "auto",
        animation: "sheetUp 0.3s ease",
        fontFamily: "'Jost',sans-serif",
      }}>
        <style>{`
          @keyframes sheetUp { from { transform:translateY(100%); } to { transform:translateY(0); } }
          @keyframes signFlip { from { transform:perspective(900px) rotateY(-90deg); opacity:0 } to { transform:perspective(900px) rotateY(0); opacity:1 } }
          @media (prefers-reduced-motion: reduce) { .shg-sign-step { animation:none !important } }
        `}</style>

        {/* Drag handle */}
        <div style={{ width: 40, height: 4, borderRadius: 2, background: C.border, margin: "0 auto 20px" }} />

        <div key={step} className="shg-sign-step" style={{ padding: "0 24px 40px", animation: "signFlip .55s cubic-bezier(.2,.8,.2,1) both", transformOrigin: "left center" }}>

          {/* ── STEP: INPUT ── */}
          {step === "input" && (
            <>
              <div style={{ marginBottom: 20 }}>
                <div style={{
                  fontSize: 11, fontWeight: 600, letterSpacing: "0.14em",
                  textTransform: "uppercase", color: "#000",
                  marginBottom: 8,
                }}>Log a sign ✦</div>
                <div style={{ fontSize: 22, fontWeight: 300, color: C.text, lineHeight: 1.3 }}>
                  What just happened?
                </div>
              </div>

              <textarea
                ref={textareaRef}
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Describe the sign, synchronicity, or shift you noticed…"
                style={{
                  width: "100%", minHeight: 120,
                  background: "#fff",
                  border: `1px solid ${C.border}`,
                  borderRadius: 12, padding: "14px 16px",
                  color: C.text, fontSize: 16, fontFamily: "'Jost',sans-serif",
                  fontWeight: 300, lineHeight: 1.6,
                  resize: "vertical", outline: "none",
                  boxSizing: "border-box",
                }}
                onKeyDown={e => { if (e.key === "Enter" && e.metaKey) handleParse(); }}
              />

              {/* Voice button */}
              <button onClick={listening ? stopVoice : startVoice} style={{
                display: "flex", alignItems: "center", gap: 8,
                background: listening ? "rgba(44,183,167,0.15)" : "transparent",
                border: `1px solid ${listening ? "#2CB7A7" : C.border}`,
                borderRadius: 100, padding: "8px 16px",
                color: "#000",
                fontSize: 13, fontWeight: 500, cursor: "pointer",
                marginTop: 10, transition: "all 0.15s",
              }}>
                <span style={{ fontSize: 16 }}>{listening ? "⏹" : "🎙"}</span>
                {listening ? "Stop…" : "Speak it (writes it for you)"}
              </button>

              {/* Photo and voice note: add either or both, alongside the text */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid #000", borderRadius: 100, padding: "8px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer", color: "#000" }}>
                  📷 {img ? "Change photo" : "Add a photo"}
                  <input type="file" accept="image/*" hidden onChange={e => { const f = e.target.files?.[0]; if (f) shrinkImage(f).then(setImg); e.target.value = ""; }} />
                </label>
                <button onClick={recording ? stopNote : startNote} style={{ display: "flex", alignItems: "center", gap: 8, background: recording ? "#000" : "transparent", color: recording ? "#F2ECE4" : "#000", border: "1px solid #000", borderRadius: 100, padding: "8px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                  {recording ? "⏹ Stop voice note" : audio ? "🎤 Re-record voice note" : "🎤 Record a voice note"}
                </button>
              </div>
              {(img || audio) && (
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 12, flexWrap: "wrap" }}>
                  {img && <img src={img} alt="Your sign" style={{ width: 96, height: 96, objectFit: "cover", borderRadius: 10, border: "1px solid #000" }} />}
                  {audio && <audio src={audio} controls style={{ height: 36, maxWidth: "100%" }} />}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                <button onClick={onClose} style={{
                  flex: 1, padding: "14px", borderRadius: 12,
                  background: "transparent", border: `1px solid ${C.border}`,
                  color: C.mu, fontSize: 15, cursor: "pointer", fontFamily: "'Jost',sans-serif",
                }}>Cancel</button>
                <button onClick={handleParse} disabled={!(text.trim() || img || audio) || parsing} style={{
                  flex: 2, padding: "14px", borderRadius: 12,
                  background: (text.trim() || img || audio) ? GRAD : C.border,
                  border: "none", color: text.trim() ? "#0a0906" : C.mu,
                  fontSize: 15, fontWeight: 600, cursor: text.trim() ? "pointer" : "default",
                  fontFamily: "'Jost',sans-serif", transition: "opacity 0.15s",
                  opacity: parsing ? 0.7 : 1,
                }}>
                  {parsing ? "Reading sign…" : "Next →"}
                </button>
              </div>
              {onHideButton && (
                <button onClick={onHideButton} style={{ display: "block", margin: "18px auto 0", background: "none", border: "none", color: "#000", fontSize: 13, textDecoration: "underline", cursor: "pointer", fontFamily: "'Jost',sans-serif" }}>
                  Hide the ✦ button (bring it back in proofOS › Signs)
                </button>
              )}
            </>
          )}

          {/* ── STEP: CONFIRM ── */}
          {step === "confirm" && parsed && (
            <>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#000", marginBottom: 8 }}>
                  Confirm sign ✦
                </div>
                <div style={{ fontSize: 18, fontWeight: 300, color: C.text, lineHeight: 1.4, marginBottom: 16 }}>
                  "{text}"
                </div>
              </div>

              {/* Linked intention: only intentions she has added in proofOS */}
              <div style={{ marginBottom: 18 }}>
                <label htmlFor="shg-sign-intention" style={{ display: "block", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#000", marginBottom: 8 }}>Which intention is this a sign for?</label>
                <select id="shg-sign-intention" value={parsed.matched_intention_id == null ? "" : String(parsed.matched_intention_id)}
                  onChange={e => { const v = e.target.value; setParsed(p => ({ ...p, matched_intention_id: v === "" ? null : (activeIntentions.find(i => String(i.id) === v)?.id ?? v) })); }}
                  style={{ width: "100%", padding: "14px 12px", borderRadius: 12, border: "1.5px solid #000", background: "#fff", color: "#000", fontSize: 16, fontFamily: "'Jost',sans-serif" }}>
                  <option value="">No specific intention</option>
                  {activeIntentions.map(i => <option key={i.id} value={String(i.id)}>{i.desire}</option>)}
                </select>
                {activeIntentions.length === 0 && <div style={{ fontSize: 13, marginTop: 6, color: "#000" }}>Add an intention in proofOS to link signs to it.</div>}
              </div>

              {/* Categories: pick as many as fit */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#000", marginBottom: 10 }}>Categories (pick any)</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {CATEGORIES.map(cat => {
                    const on = (parsed.categories || [parsed.category]).includes(cat.id);
                    return (
                      <button key={cat.id} aria-pressed={on} onClick={() => setParsed(p => { const cur = p.categories || [p.category].filter(Boolean); const next = on ? cur.filter(x => x !== cat.id) : [...cur.filter(x => x !== "general"), cat.id]; return { ...p, categories: next.length ? next : ["general"], category: (next[0] || "general") }; })} style={{
                        padding: "8px 14px", borderRadius: 100, fontSize: 14, fontWeight: 500,
                        border: on ? "none" : "1px solid #000", background: on ? "#000" : "transparent",
                        color: on ? "#F2ECE4" : "#000", cursor: "pointer", fontFamily: "'Jost',sans-serif",
                      }}>{cat.label}</button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button onClick={() => setStep("input")} style={{
                  flex: 1, padding: "14px", borderRadius: 12,
                  background: "transparent", border: `1px solid ${C.border}`,
                  color: C.mu, fontSize: 15, cursor: "pointer", fontFamily: "'Jost',sans-serif",
                }}>← Edit</button>
                <button onClick={handleSave} disabled={saving} style={{
                  flex: 2, padding: "14px", borderRadius: 12,
                  background: GRAD, border: "none",
                  color: "#0a0906", fontSize: 15, fontWeight: 600,
                  cursor: "pointer", fontFamily: "'Jost',sans-serif",
                  opacity: saving ? 0.7 : 1,
                }}>
                  {saving ? "Saving…" : "Log sign ✦"}
                </button>
              </div>
            </>
          )}

          {/* ── STEP: SAVED ── */}
          {step === "saved" && (
            <div style={{ textAlign: "center", padding: "20px 0 10px" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✦</div>
              <div style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 32, fontWeight: 300,
                background: GRAD,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: 10,
              }}>Sign logged</div>
              <div style={{ fontSize: 15, color: C.mu, fontWeight: 300 }}>
                {matchedIntention ? `Linked to "${matchedIntention.desire}"` : "Added to your proof record"}
              </div>
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}
