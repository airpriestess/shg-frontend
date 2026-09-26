import { useEffect, useRef, useState } from "react";

// Talk (or upload journal pages) and the AI sorts it into intentions, signs,
// arrivals and bucket list wishes. She checks the list, then it is saved.
const WORKER = "https://shg-quiz-worker.airpriestess.workers.dev";
const TYPES = { intention: "Intention", sign: "Sign", arrived: "Arrived", bucket: "Bucket list" };
const G = "linear-gradient(90deg,#F5E0A0,#E8B870 22%,#BFA5D8 52%,#2CB7A7 80%,#167A6B)";

const shortDate = (iso) => new Date(iso || Date.now()).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
const newId = () => Date.now() + Math.random().toString(36).slice(2, 8);

async function post(path, token, body, method = "POST") {
  const res = await fetch(`${WORKER}${path}`, {
    method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// Shrink photos before sending: journal pages stay readable at 1600px.
const toJpeg = (file) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => {
    const k = Math.min(1, 1600 / Math.max(img.width, img.height));
    const c = document.createElement("canvas");
    c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    URL.revokeObjectURL(img.src);
    resolve(c.toDataURL("image/jpeg", 0.82));
  };
  img.onerror = reject;
  img.src = URL.createObjectURL(file);
});

// Preview has no account, so no AI: split what she said into separate
// intentions with plain rules, so she still sees her own words sorted.
function localItems(text) {
  const cleaned = text
    .replace(/^\s*(hey|hi|hello|ok|okay)[,!.\s]+/i, "")
    .replace(/^(what\s+)?i\s+(really\s+)?(want|would like|wish)\s+(to\s+(manifest|call in|attract))?\s*(right now\s+)?(is|are)?\s*/i, "")
    .replace(/^(add this intention|add|please add)[,:\s]+/i, "");
  // Speech has no commas, so also break before common new wishes ("a husband", "a house"...).
  const spoken = cleaned.replace(/\s+(?=(?:a|an|my)\s+(?:husband|wife|partner|boyfriend|girlfriend|house|home|flat|apartment|car|job|career|baby|business|trip|holiday|body|glow)\b)/gi, ", ");
  return spoken
    .split(/\s*(?:[.;!?\n]+|,\s*(?:and\s+)?|\band\b(?=\s+(?:a|an|my|the|i|to)\b))\s*/i)
    .map(t => t.trim().replace(/^(and|also|then)\s+/i, "").replace(/\s+(and|also)$/i, ""))
    .filter(t => t.length > 3)
    .slice(0, 12)
    .map(t => ({ type: /\b(saw|noticed|happened|today|yesterday|got|received|texted|called)\b/i.test(t) ? "sign" : "intention",
      text: t.charAt(0).toUpperCase() + t.slice(1), category: "", thread_id: null, date: null, date_label: null }));
}

export default function SpeakToProof({ C, isDark, threads = [], setThreads, token, isPreview, firstName }) {
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [items, setItems] = useState(null);
  const [note, setNote] = useState("");
  const rec = useRef(null);
  const base = useRef("");
  const Speech = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => () => rec.current?.stop(), []);

  const startTalking = () => {
    setOpen(true); setItems(null); setNote("");
    if (!Speech) { setNote("Voice isn't available in this browser. Type it instead, or use your keyboard's microphone."); return; }
    const r = new Speech();
    r.lang = "en-US"; r.continuous = true; r.interimResults = true;
    base.current = text ? text.trim() + " " : "";
    r.onresult = (e) => {
      let finalText = "", interim = "";
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalText += e.results[i][0].transcript; else interim += e.results[i][0].transcript;
      }
      setText(base.current + finalText + interim);
    };
    r.onerror = (e) => { if (e.error === "not-allowed" || e.error === "service-not-allowed") setNote("Your browser blocked the microphone. Tap the lock icon next to the web address, allow Microphone, then try again. Or type, or use your keyboard's microphone."); setListening(false); };
    r.onend = () => setListening(false);
    rec.current = r; r.start(); setListening(true);
  };
  const stopTalking = () => { rec.current?.stop(); setListening(false); };

  const addPhotos = async (files) => {
    setOpen(true); setItems(null);
    const list = await Promise.all([...files].slice(0, 6).map(toJpeg));
    setImages((prev) => [...prev, ...list].slice(0, 6));
  };

  const organize = async () => {
    stopTalking();
    if (!text.trim() && !images.length) return;
    setBusy(true); setNote("");
    try {
      const list = isPreview || !token
        ? localItems(text)
        : (await post("/organize", token, { text, images, threads: threads.map(t => ({ id: t.id, desire: t.desire })) })).items;
      setItems(list.map(i => ({ ...i, keep: true, detail: "" })));
      if (!list.length) setNote("Nothing to add found. Try saying it another way.");
    } catch {
      setNote("That didn't go through. Check your connection and try again.");
    } finally { setBusy(false); }
  };

  const save = async () => {
    const chosen = (items || []).filter(i => i.keep);
    let next = [...threads];
    const jobs = [];
    const makeThread = (i, extra = {}) => {
      const id = newId();
      if (i.detail && i.detail.trim()) i = { ...i, text: `${i.text}. ${i.detail.trim()}` };
      const createdAt = i.date ? new Date(i.date).toISOString() : new Date().toISOString();
      next.push({ id, desire: i.text, category: i.category || "", track: "", oldBelief: "", feelBefore: "", feelAfter: "", days: 0, done: false, isBucket: i.type === "bucket", createdAt, manifestedAt: null, signs: [], ...extra });
      if (!isPreview && token) jobs.push(post("/threads", token, { id, desire: i.text, category: i.category || "", is_bucket: i.type === "bucket" }));
      return id;
    };
    for (const i of chosen) {
      if (i.type === "intention" || i.type === "bucket") makeThread(i);
      else if (i.type === "sign") {
        const id = i.thread_id ?? makeThread({ ...i, type: "intention" });
        const date = shortDate(i.date);
        next = next.map(t => t.id === id ? { ...t, signs: [...(t.signs || []), { text: i.text, date, _sid: Date.now() + Math.random() }] } : t);
        if (!isPreview && token) jobs.push(post(`/threads/${id}/signs`, token, { text: i.text, date }));
      } else if (i.type === "arrived") {
        const when = i.date ? new Date(i.date).toISOString() : new Date().toISOString();
        const id = i.thread_id ?? makeThread(i);
        next = next.map(t => t.id === id ? { ...t, done: true, manifestedAt: shortDate(when) } : t);
        if (!isPreview && token) jobs.push(Promise.all(jobs).then(() => post(`/threads/${id}`, token, { done: true, manifested_at: when }, "PATCH")));
      }
    }
    setThreads(next);
    await Promise.allSettled(jobs);
    setItems(null); setText(""); setImages([]); setOpen(false);
    setNote(`${chosen.length} added to proofOS.`);
    setTimeout(() => setNote(""), 3000);
  };

  const cr = C?.cr || "#F2ECE4";
  const card = isDark ? "#0E0E0E" : "#FBF8F4";
  const chip = { fontSize: 11, letterSpacing: ".14em", padding: "3px 9px", borderRadius: 999, background: G, color: "#000", whiteSpace: "nowrap" };
  const btn = { border: "none", borderRadius: 999, minHeight: 44, padding: "0 18px", fontSize: 14, fontFamily: "inherit", cursor: "pointer" };

  return (
    <div className="shg-paper" style={{ margin: "0 16px 16px", borderRadius: 20, padding: 20, color: "#000", textAlign: "center" }}>
      <div style={{ fontSize: 11, letterSpacing: ".3em", marginBottom: 8 }}>TALK TO PROOFOS</div>
      <div style={{ fontSize: 20, lineHeight: 1.3, marginBottom: 6 }}>{firstName ? `${firstName}, what's` : "What's"} happening in your world?</div>
      <div style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 14 }}>Say your intentions, signs and synchronicities out loud, or upload your journal pages. We sort it all for you.</div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={listening ? stopTalking : startTalking} aria-pressed={listening} style={{ ...btn, background: G, color: "#000", flex: "1 1 160px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: listening ? "0 0 0 4px rgba(191,165,216,.35)" : "none" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.6" strokeLinecap="round"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>
          {listening ? "● Listening  ■ Stop" : "Tap and talk"}
        </button>
        <label style={{ ...btn, background: "#000", color: "#F2ECE4", border: "none", borderRadius: 999, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, flex: "1 1 140px", justifyContent: "center" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 17l-6-6-8 8"/></svg>
          Journal pages
          <input type="file" accept="image/*" multiple hidden onChange={(e) => { if (e.target.files?.length) addPhotos(e.target.files); e.target.value = ""; }} />
        </label>
      </div>

      {open && !items && (
        <div style={{ marginTop: 14 }}>
          <textarea id="speak-to-proof" value={text} onChange={(e) => setText(e.target.value)} rows={4}
            placeholder="Hi, add this intention… I saw 111 today… last year I wrote I'd go to Bali and I went…"
            style={{ width: "100%", boxSizing: "border-box", borderRadius: 14, padding: 12, fontSize: 14, lineHeight: 1.5, fontFamily: "inherit", border: `1px solid ${cr}`, background: "transparent", color: cr, resize: "vertical" }} />
          {images.length > 0 && (
            <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
              {images.map((src, n) => (
                <button key={n} onClick={() => setImages(images.filter((_, k) => k !== n))} aria-label="Remove photo" style={{ padding: 0, border: "none", background: "none", position: "relative", cursor: "pointer" }}>
                  <img src={src} alt={`Journal page ${n + 1}`} style={{ width: 54, height: 54, objectFit: "cover", borderRadius: 8, display: "block" }} />
                  <span style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", background: "#000", color: "#F2ECE4", fontSize: 11, lineHeight: "18px" }}>×</span>
                </button>
              ))}
            </div>
          )}
          <button onClick={organize} disabled={busy || (!text.trim() && !images.length)} style={{ ...btn, marginTop: 10, width: "100%", background: G, color: "#000", opacity: busy || (!text.trim() && !images.length) ? 0.6 : 1 }}>
            {busy ? "Sorting it for you…" : "Sort it into proofOS"}
          </button>
        </div>
      )}

      {items && items.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 11, letterSpacing: ".26em", marginBottom: 6 }}>CHECK AND SAVE</div>
          <div style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 8 }}>The more specific, the stronger. Not "a job", but "a job I love paying $200,000 a year, remote, starting by spring".</div>
          {items.map((i, n) => {
            const linked = threads.find(t => t.id === i.thread_id);
            return (
              <div key={n} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0", borderBottom: `1px solid ${isDark ? "#222" : "rgba(0,0,0,.12)"}` }}>
                <input type="checkbox" checked={i.keep} aria-label={`Keep ${i.text}`} onChange={() => setItems(items.map((x, k) => k === n ? { ...x, keep: !x.keep } : x))} style={{ marginTop: 4, width: 18, height: 18, accentColor: "#BFA5D8" }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, lineHeight: 1.4 }}>{i.text}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginTop: 6, fontSize: 12 }}>
                    <select value={i.type} aria-label="Type" onChange={(e) => setItems(items.map((x, k) => k === n ? { ...x, type: e.target.value } : x))}
                      style={{ ...chip, border: "none", fontFamily: "inherit", appearance: "none", WebkitAppearance: "none", cursor: "pointer", width: "auto", height: 24, minHeight: 0, flex: "none", padding: "0 10px", margin: 0 }}>
                      {Object.entries(TYPES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                    {linked && <span>for “{linked.desire}”</span>}
                    {i.date_label && <span>· {i.date_label}</span>}
                  </div>
                  {(i.type === "intention" || i.type === "bucket") && (
                    <input value={i.detail} aria-label={`Details for ${i.text}`} onChange={(e) => setItems(items.map((x, k) => k === n ? { ...x, detail: e.target.value } : x))}
                      placeholder="Make it specific: how much, where, when, how it feels"
                      style={{ marginTop: 8, width: "100%", boxSizing: "border-box", borderRadius: 10, padding: "8px 10px", fontSize: 13, fontFamily: "inherit", border: `1px solid ${cr}`, background: "transparent", color: cr }} />
                  )}
                </div>
              </div>
            );
          })}
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button onClick={() => setItems(null)} style={{ ...btn, background: "transparent", color: cr, border: `1px solid ${cr}` }}>Back</button>
            <button onClick={save} style={{ ...btn, flex: 1, background: G, color: "#000" }}>Save {items.filter(i => i.keep).length} to proofOS</button>
          </div>
        </div>
      )}
      {note && <div role="status" style={{ marginTop: 10, fontSize: 13 }}>{note}</div>}
    </div>
  );
}
