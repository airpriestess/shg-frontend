/* ── REAL PROOF UPLOAD MODAL ─────────────────────────────────────────────────
   Handles:
   - Photo upload → Supabase Storage → saves URL to proof_entries table
   - Voice recording → MediaRecorder → Supabase Storage → saves to proof_entries
   - Sign / Symptom / Synchronicity → saves text to proof_entries
   All writes go to Supabase. Falls back gracefully if not authed.
────────────────────────────────────────────────────────────────────────────── */
import { useState, useRef, useEffect } from "react";
import { T } from "../design/tokens.js";
import { Btn, Modal, FormField } from "./UI.jsx";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://qtwvslrwmreazmrdktsn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0d3ZzbHJ3bXJlYXptcmRrdHNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MzIwMjAsImV4cCI6MjA5ODMwODAyMH0.FjfHRNOjnmbiYMjA9eKT1hexvwCN2ERtTyBOqY2cj-8";
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── PHOTO UPLOAD MODAL ────────────────────────────────────────────────────────
export function PhotoProofModal({ open, onClose, threadId, audioTitle }) {
  const [file, setFile]         = useState(null);
  const [preview, setPreview]   = useState(null);
  const [caption, setCaption]   = useState("");
  const [uploading, setUploading] = useState(false);
  const [done, setDone]         = useState(false);
  const [error, setError]       = useState(null);
  const inputRef                = useRef();

  const reset = () => { setFile(null); setPreview(null); setCaption(""); setDone(false); setError(null); };

  const handleFile = (f) => {
    if (!f) return;
    if (f.size > 20 * 1024 * 1024) { setError("File too large — maximum 20 MB."); return; }
    setFile(f);
    setError(null);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target.result);
    reader.readAsDataURL(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const save = async () => {
    if (!file) { setError("Please select a photo first."); return; }
    setUploading(true);
    setError(null);
    try {
      const ext  = file.name.split(".").pop().toLowerCase() || "jpg";
      const path = `proof/${threadId || "general"}/${Date.now()}.${ext}`;
      const { error: upErr } = await sb.storage.from("proof-uploads").upload(path, file, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });
      if (upErr) throw upErr;

      const { data: { publicUrl } } = sb.storage.from("proof-uploads").getPublicUrl(path);

      // Save entry to proof_entries table
      await sb.from("proof_entries").insert({
        thread_id:   threadId || null,
        type:        "Photo Proof",
        photo_url:   publicUrl,
        caption:     caption || null,
        audio_title: audioTitle || null,
        happened_at: new Date().toISOString(),
      });

      setDone(true);
    } catch (e) {
      console.error(e);
      // Still show success if storage worked even if table insert failed
      if (e.message?.includes("proof_entries")) {
        setDone(true);
      } else {
        setError("Upload failed — " + (e.message || "please try again."));
      }
    } finally {
      setUploading(false);
    }
  };

  if (!open) return null;

  return (
    <Modal open title="Add Photo Proof" onClose={() => { reset(); onClose(); }} width={520}>
      {done ? (
        <div style={{ textAlign: "center", padding: "32px 20px" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✦</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: T.textPrimary, marginBottom: 8 }}>Photo proof saved.</div>
          <div style={{ fontSize: 14, color: T.textMuted, marginBottom: 24 }}>Your evidence is in the vault.</div>
          <Btn variant="champagne" onClick={() => { reset(); onClose(); }}>Done</Btn>
        </div>
      ) : (
        <div>
          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
            style={{
              border: `2px dashed ${preview ? "#C8892A66" : "#1e1608"}`,
              borderRadius: 14, padding: preview ? 8 : "36px 20px",
              textAlign: "center", cursor: "pointer", marginBottom: 16,
              background: preview ? "#0a0800" : "#060400",
              transition: "border-color 0.2s",
              minHeight: preview ? 0 : 140,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <input
              ref={inputRef} type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/gif"
              style={{ display: "none" }}
              onChange={e => handleFile(e.target.files[0])}
            />
            {preview ? (
              <img src={preview} alt="preview" style={{ maxWidth: "100%", maxHeight: 260, borderRadius: 10, display: "block", margin: "0 auto" }} />
            ) : (
              <div>
                <div style={{ fontSize: 36, marginBottom: 10 }}>📷</div>
                <div style={{ fontSize: 15, color: T.textPrimary, fontWeight: 600, marginBottom: 6 }}>Tap to upload photo proof</div>
                <div style={{ fontSize: 12, color: T.textMuted }}>Bank screenshot · Message · Mirror photo · Receipt</div>
                <div style={{ fontSize: 11, color: T.textFaint, marginTop: 6 }}>JPG · PNG · WEBP · HEIC · max 20 MB</div>
              </div>
            )}
          </div>

          {preview && (
            <button onClick={() => { setFile(null); setPreview(null); }} style={{ background: "none", border: "none", color: T.textMuted, fontSize: 12, cursor: "pointer", marginBottom: 12, display: "block" }}>
              ✕ Remove photo
            </button>
          )}

          <FormField label="What does this prove?">
            <input
              value={caption} onChange={e => setCaption(e.target.value)}
              placeholder="Bank notification arrived · He texted · Skin shifted..."
              style={{ width: "100%" }}
              onKeyDown={e => e.key === "Enter" && save()}
            />
          </FormField>

          {error && <div style={{ fontSize: 13, color: "#C4365A", marginBottom: 12, padding: "8px 12px", background: "#C4365A11", borderRadius: 8 }}>{error}</div>}

          <div style={{ display: "flex", gap: 10 }}>
            <Btn full variant="champagne" onClick={save} disabled={uploading || !file}>
              {uploading ? "Uploading..." : "Save Photo Proof"}
            </Btn>
            <Btn variant="soft" onClick={() => { reset(); onClose(); }} disabled={uploading}>Cancel</Btn>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ── VOICE PROOF MODAL ─────────────────────────────────────────────────────────
export function VoiceProofModal({ open, onClose, threadId, audioTitle }) {
  const [state, setState]       = useState("idle"); // idle | recording | recorded | uploading | done
  const [duration, setDuration] = useState(0);
  const [caption, setCaption]   = useState("");
  const [error, setError]       = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl]   = useState(null);
  const mediaRef  = useRef(null);
  const chunksRef = useRef([]);
  const timerRef  = useRef(null);

  // Cleanup on unmount
  useEffect(() => () => {
    clearInterval(timerRef.current);
    mediaRef.current?.stream?.getTracks().forEach(t => t.stop());
  }, []);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      chunksRef.current = [];
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setState("recorded");
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start(100);
      mediaRef.current = mr;
      setState("recording");
      setDuration(0);
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
    } catch (e) {
      setError("Microphone access denied. Please allow microphone in your browser settings.");
    }
  };

  const stopRecording = () => {
    clearInterval(timerRef.current);
    mediaRef.current?.stop();
  };

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const save = async () => {
    if (!audioBlob) return;
    setState("uploading");
    setError(null);
    try {
      const path = `proof/${threadId || "general"}/voice_${Date.now()}.webm`;
      const { error: upErr } = await sb.storage.from("proof-uploads").upload(path, audioBlob, {
        contentType: "audio/webm",
        upsert: false,
      });
      if (upErr) throw upErr;

      const { data: { publicUrl } } = sb.storage.from("proof-uploads").getPublicUrl(path);

      await sb.from("proof_entries").insert({
        thread_id:    threadId || null,
        type:         "Voice Proof",
        voice_url:    publicUrl,
        duration_sec: duration,
        caption:      caption || null,
        audio_title:  audioTitle || null,
        happened_at:  new Date().toISOString(),
      });

      setState("done");
    } catch (e) {
      console.error(e);
      if (e.message?.includes("proof_entries")) {
        setState("done");
      } else {
        setError("Upload failed — " + (e.message || "please try again."));
        setState("recorded");
      }
    }
  };

  const reset = () => {
    clearInterval(timerRef.current);
    setAudioBlob(null);
    setAudioUrl(null);
    setCaption("");
    setDuration(0);
    setError(null);
    setState("idle");
  };

  if (!open) return null;

  return (
    <Modal open title="Record Voice Proof" onClose={() => { reset(); onClose(); }} width={480}>
      {state === "done" ? (
        <div style={{ textAlign: "center", padding: "32px 20px" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎙</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: T.textPrimary, marginBottom: 8 }}>Voice proof saved.</div>
          <div style={{ fontSize: 14, color: T.textMuted, marginBottom: 24 }}>Your recording is in the vault.</div>
          <Btn variant="champagne" onClick={() => { reset(); onClose(); }}>Done</Btn>
        </div>
      ) : (
        <div>
          {/* Recorder */}
          <div style={{ background: "#060400", border: "1px solid #1e1608", borderRadius: 14, padding: "28px 20px", textAlign: "center", marginBottom: 16 }}>
            {state === "idle" && (
              <>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎙</div>
                <div style={{ fontSize: 15, color: T.textMuted, marginBottom: 20, lineHeight: 1.6 }}>
                  How does it feel? What shifted?<br />Speak it out.
                </div>
                <Btn variant="champagne" onClick={startRecording}>● Start Recording</Btn>
              </>
            )}

            {state === "recording" && (
              <>
                {/* Live waveform bars */}
                <div style={{ display: "flex", gap: 3, alignItems: "center", justifyContent: "center", height: 48, marginBottom: 16 }}>
                  {[8,18,30,22,36,16,28,12,24,32,14,26,20,34,10].map((h, i) => (
                    <div key={i} style={{
                      width: 3, height: h, borderRadius: 2,
                      background: "linear-gradient(180deg,#C8892A,#B76E79)",
                      animation: `wave ${0.8 + (i % 5) * 0.15}s ease-in-out infinite alternate`,
                      opacity: 0.85,
                    }} />
                  ))}
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#C8892A", marginBottom: 4, letterSpacing: "0.05em" }}>{fmt(duration)}</div>
                <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 20 }}>Recording…</div>
                <Btn variant="ghost" onClick={stopRecording}>⏹ Stop</Btn>
              </>
            )}

            {(state === "recorded" || state === "uploading") && audioUrl && (
              <>
                <div style={{ fontSize: 13, color: "#B76E79", fontWeight: 700, marginBottom: 12 }}>🎙 Recording — {fmt(duration)}</div>
                <audio controls src={audioUrl} style={{ width: "100%", marginBottom: 16, borderRadius: 8 }} />
                <button onClick={reset} style={{ background: "none", border: "none", color: T.textMuted, fontSize: 12, cursor: "pointer" }}>✕ Discard and re-record</button>
              </>
            )}
          </div>

          {(state === "recorded" || state === "uploading") && (
            <FormField label="What shifted? (optional)">
              <input
                value={caption} onChange={e => setCaption(e.target.value)}
                placeholder="I felt more certain · The anxiety lifted · I just knew..."
                style={{ width: "100%" }}
              />
            </FormField>
          )}

          {error && <div style={{ fontSize: 13, color: "#C4365A", marginBottom: 12, padding: "8px 12px", background: "#C4365A11", borderRadius: 8 }}>{error}</div>}

          {(state === "recorded" || state === "uploading") && (
            <div style={{ display: "flex", gap: 10 }}>
              <Btn full variant="champagne" onClick={save} disabled={state === "uploading"}>
                {state === "uploading" ? "Saving..." : "Save Voice Proof"}
              </Btn>
              <Btn variant="soft" onClick={() => { reset(); onClose(); }} disabled={state === "uploading"}>Cancel</Btn>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
