import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const GRAD = "linear-gradient(135deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";

const CATEGORIES = [
  { id: "money",    label: "Money",    icon: "💰" },
  { id: "love",     label: "Love",     icon: "💜" },
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

export default function LogSignModal({ onClose, onSaved, userId, token, apiUrl, isDark, activeIntentions = [] }) {
  const [step, setStep]         = useState("input"); // input | confirm | saved
  const [text, setText]         = useState("");
  const [listening, setListening] = useState(false);
  const [parsed, setParsed]     = useState(null);   // {matched_intention_id, category, summary}
  const [parsing, setParsing]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [savedCount, setSavedCount] = useState(null);
  const recognitionRef          = useRef(null);
  const textareaRef             = useRef(null);

  const C = isDark
    ? { bg: "#0e0c0a", surface: "#1a1714", text: "#fdf0e8", mu: "rgba(253,240,232,0.45)", border: "rgba(253,240,232,0.1)" }
    : { bg: "#fdf0e8", surface: "#fff",    text: "#0a0906", mu: "rgba(10,9,6,0.45)",      border: "rgba(10,9,6,0.12)" };

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
    if (!text.trim()) return;
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
      // Preview mode — just show success
      setStep("saved");
      setSavedCount(1);
      setTimeout(onClose, 2000);
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
      onSaved?.(data);
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
        background: C.surface,
        borderRadius: "20px 20px 0 0",
        padding: "8px 0 0",
        maxHeight: "90vh",
        overflowY: "auto",
        animation: "sheetUp 0.3s ease",
        fontFamily: "'Jost',sans-serif",
      }}>
        <style>{`
          @keyframes sheetUp { from { transform:translateY(100%); } to { transform:translateY(0); } }
        `}</style>

        {/* Drag handle */}
        <div style={{ width: 40, height: 4, borderRadius: 2, background: C.border, margin: "0 auto 20px" }} />

        <div style={{ padding: "0 24px 40px" }}>

          {/* ── STEP: INPUT ── */}
          {step === "input" && (
            <>
              <div style={{ marginBottom: 20 }}>
                <div style={{
                  fontSize: 11, fontWeight: 600, letterSpacing: "0.14em",
                  textTransform: "uppercase", color: "rgba(44,183,167,0.9)",
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
                  background: isDark ? "rgba(253,240,232,0.04)" : "rgba(10,9,6,0.04)",
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
                color: listening ? "#2CB7A7" : C.mu,
                fontSize: 13, fontWeight: 500, cursor: "pointer",
                marginTop: 10, transition: "all 0.15s",
              }}>
                <span style={{ fontSize: 16 }}>{listening ? "⏹" : "🎙"}</span>
                {listening ? "Stop recording…" : "Speak instead"}
              </button>

              {/* Actions */}
              <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                <button onClick={onClose} style={{
                  flex: 1, padding: "14px", borderRadius: 12,
                  background: "transparent", border: `1px solid ${C.border}`,
                  color: C.mu, fontSize: 15, cursor: "pointer", fontFamily: "'Jost',sans-serif",
                }}>Cancel</button>
                <button onClick={handleParse} disabled={!text.trim() || parsing} style={{
                  flex: 2, padding: "14px", borderRadius: 12,
                  background: text.trim() ? GRAD : C.border,
                  border: "none", color: text.trim() ? "#0a0906" : C.mu,
                  fontSize: 15, fontWeight: 600, cursor: text.trim() ? "pointer" : "default",
                  fontFamily: "'Jost',sans-serif", transition: "opacity 0.15s",
                  opacity: parsing ? 0.7 : 1,
                }}>
                  {parsing ? "Reading sign…" : "Next →"}
                </button>
              </div>
            </>
          )}

          {/* ── STEP: CONFIRM ── */}
          {step === "confirm" && parsed && (
            <>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(44,183,167,0.9)", marginBottom: 8 }}>
                  Confirm sign ✦
                </div>
                <div style={{ fontSize: 18, fontWeight: 300, color: C.text, lineHeight: 1.4, marginBottom: 16 }}>
                  "{text}"
                </div>
              </div>

              {/* Category */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.mu, marginBottom: 10 }}>Category</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {CATEGORIES.map(cat => (
                    <button key={cat.id} onClick={() => setParsed(p => ({ ...p, category: cat.id }))} style={{
                      padding: "7px 14px", borderRadius: 100, fontSize: 13, fontWeight: 500,
                      border: parsed.category === cat.id ? "none" : `1px solid ${C.border}`,
                      background: parsed.category === cat.id ? GRAD : "transparent",
                      color: parsed.category === cat.id ? "#0a0906" : C.mu,
                      cursor: "pointer", fontFamily: "'Jost',sans-serif",
                    }}>
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Matched intention */}
              {activeIntentions.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: C.mu, marginBottom: 10 }}>
                    Linked intention
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <button onClick={() => setParsed(p => ({ ...p, matched_intention_id: null }))} style={{
                      padding: "10px 14px", borderRadius: 10, textAlign: "left", fontSize: 13, fontWeight: 400,
                      background: !parsed.matched_intention_id ? "rgba(44,183,167,0.12)" : "transparent",
                      border: !parsed.matched_intention_id ? "1px solid rgba(44,183,167,0.4)" : `1px solid ${C.border}`,
                      color: !parsed.matched_intention_id ? "#2CB7A7" : C.mu,
                      cursor: "pointer", fontFamily: "'Jost',sans-serif",
                    }}>
                      No specific intention
                    </button>
                    {activeIntentions.map(intention => (
                      <button key={intention.id} onClick={() => setParsed(p => ({ ...p, matched_intention_id: intention.id }))} style={{
                        padding: "10px 14px", borderRadius: 10, textAlign: "left", fontSize: 13, fontWeight: 400,
                        background: parsed.matched_intention_id === intention.id ? "rgba(44,183,167,0.12)" : "transparent",
                        border: parsed.matched_intention_id === intention.id ? "1px solid rgba(44,183,167,0.4)" : `1px solid ${C.border}`,
                        color: parsed.matched_intention_id === intention.id ? "#2CB7A7" : C.text,
                        cursor: "pointer", fontFamily: "'Jost',sans-serif",
                      }}>
                        ✦ {intention.desire}
                      </button>
                    ))}
                  </div>
                </div>
              )}

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
