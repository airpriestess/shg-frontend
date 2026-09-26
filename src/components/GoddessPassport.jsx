import { useEffect, useRef, useState } from "react";
import ShopGrid, { WorkWithReshma } from "./ShopGrid.jsx";

// The Goddess Passport replaces the profile. She builds it (photo, Goddess
// name, colours, words, belief) and collects stamps as she moves through the
// app. Details are kept on this device for now.
const G = "linear-gradient(90deg,#F5E0A0,#E8B870 22%,#BFA5D8 52%,#2CB7A7 80%,#167A6B)";
const PAPER = {
  backgroundColor: "#F2ECE4", color: "#000",
  backgroundImage: "linear-gradient(rgba(191,165,216,.28) 1px,transparent 1px),linear-gradient(90deg,rgba(191,165,216,.28) 1px,transparent 1px)",
  backgroundSize: "20px 20px",
};
const COLOURS = ["#F5E0A0", "#E8B870", "#BFA5D8", "#2CB7A7", "#167A6B", "#000000", "#F2ECE4", "#E9B7C4", "#9DB8E0", "#C9A27E"];
const WORDS = ["chosen", "magnetic", "abundant", "soft", "radiant", "lucky", "adored", "powerful", "calm", "limitless", "safe", "wealthy", "free", "worthy"];
const CATEGORY_NAMES = { Luckygirlmaxxing: "Luck", Lovemaxxing: "Love", Richgirlmaxxing: "Money", "Rich Girl": "Money", Beautymaxxing: "Beauty", Selfmaxxing: "Becoming her", Sleepmaxxing: "Sleep", Healthmaxxing: "Health", Friendmaxxing: "Friendship", Businessmaxxing: "Business" };

const load = (key) => { try { return JSON.parse(localStorage.getItem(key) || "null"); } catch { return null; } };
const store = (key, v) => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} };

// Small photo: square crop at 360px so it fits in local storage.
const toAvatar = (file) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => {
    const s = Math.min(img.width, img.height), c = document.createElement("canvas");
    c.width = c.height = 360;
    c.getContext("2d").drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 360, 360);
    URL.revokeObjectURL(img.src);
    resolve(c.toDataURL("image/jpeg", 0.8));
  };
  img.onerror = reject;
  img.src = URL.createObjectURL(file);
});

const Label = ({ children }) => <div style={{ fontSize: 9, letterSpacing: ".24em", marginBottom: 4 }}>{children}</div>;


// A passport stamp: double ring, words set around the rim, the SHG clover in
// the middle, gradient ink with a slightly worn edge like a real rubber stamp.
function Stamp({ s, i }) {
  const id = `st${i}`;
  const ink = s.earned ? `url(#${id}g)` : "#000";
  const mid = String(s.mid);
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={`${s.top} ${mid} ${s.bottom}`} style={{ width: "100%", display: "block", transform: `rotate(${s.earned ? [-8, 6, -3, 9, -6, 4][i % 6] : 0}deg)`, opacity: s.earned ? 1 : 0.22, filter: s.earned ? "saturate(1.3) brightness(.85)" : "grayscale(1)" }}>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E8B870" /><stop offset=".45" stopColor="#BFA5D8" /><stop offset=".8" stopColor="#2CB7A7" /><stop offset="1" stopColor="#167A6B" />
        </linearGradient>
        <filter id={`${id}f`}>
          <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed={i + 3} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.2" result="d" />

        </filter>
        <path id={`${id}t`} d="M 30 100 A 70 70 0 0 1 170 100" />
        <path id={`${id}b`} d="M 26 100 A 74 74 0 0 0 174 100" />
      </defs>
      <g filter={s.earned ? `url(#${id}f)` : undefined} fill="none" stroke={ink} strokeDasharray={s.earned ? undefined : "4 5"}>
        <circle cx="100" cy="100" r="94" strokeWidth={s.earned ? 6 : 3} />
        <circle cx="100" cy="100" r="86" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="54" strokeWidth="1.5" />
        <g transform="translate(78 62) scale(1.1)" strokeWidth="2.6">
          <circle cx="14" cy="14" r="8" /><circle cx="26" cy="14" r="8" /><circle cx="14" cy="26" r="8" /><circle cx="26" cy="26" r="8" />
        </g>
        <g fill={ink} stroke="none" style={{ fontFamily: "'Futura','Jost',sans-serif" }}>
          <text fontSize="13" letterSpacing="3" textAnchor="middle"><textPath href={`#${id}t`} startOffset="50%">{s.top} ★</textPath></text>
          <text fontSize="11" letterSpacing="3" textAnchor="middle" dominantBaseline="hanging"><textPath href={`#${id}b`} startOffset="50%">{s.bottom}</textPath></text>
          <text x="100" y="124" fontSize={mid.length > 14 ? 10 : 14} fontWeight="600" textAnchor="middle">{mid.length > 22 ? mid.slice(0, 21) + "…" : mid}</text>
          <text x="100" y="140" fontSize="7" letterSpacing="2.5" textAnchor="middle">S H G</text>
        </g>
      </g>
    </svg>
  );
}

export default function GoddessPassport({ onClose, userId, firstName, email, threads = [], listenCount = 0, isPreview, tierLabel, isDark, actions, startPage = null }) {
  const key = `shg_passport_${userId || (isPreview ? "preview" : "guest")}`;
  const [p, setP] = useState(() => load(key) || (isPreview
    ? { name: "Reshma", goddessName: "The Lucky One", words: ["chosen", "magnetic", "abundant", "soft"], belief: "Everything is always working out for me.", photo: null, entered: "2026-09-25" }
    : { name: firstName && firstName !== "you" ? firstName : "", goddessName: "", colours: [], words: [], belief: "", photo: null, entered: new Date().toISOString().slice(0, 10) }));
  const [opened, setOpened] = useState(startPage !== null);
  const [page, setPage] = useState(startPage ?? 0);
  const [editing, setEditing] = useState(false);
  const [customWord, setCustomWord] = useState("");

  useEffect(() => { store(key, p); }, [key, p]);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const today = () => new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const set = (patch) => setP((prev) => ({ ...prev, ...patch }));
  const toggle = (field, v, max) => setP((prev) => {
    const has = prev[field].includes(v);
    return { ...prev, [field]: has ? prev[field].filter((x) => x !== v) : [...prev[field], v].slice(-max) };
  });

  // Where she is calling in from: her most used categories.
  const counts = {};
  threads.forEach((t) => { const n = CATEGORY_NAMES[t.category] || null; if (n) counts[n] = (counts[n] || 0) + 1; });
  const callingIn = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([n]) => n).join(", then ").toLowerCase() || "not chosen yet";
  const signs = threads.reduce((a, t) => a + (t.signs?.length || 0), 0);
  const arrived = threads.filter((t) => t.done);
  const enteredLabel = new Date(p.entered).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  const stamps = [
    { k: "entered", top: "ENTERED", mid: "The Portal", bottom: enteredLabel.toUpperCase(), earned: true },
    { k: "built", top: "PASSPORT", mid: "Built", bottom: "IDENTITY", earned: !!(p.goddessName && p.words.length) },
    { k: "intention", top: "FIRST", mid: "Intention", bottom: "WRITTEN", earned: threads.length > 0 },
    { k: "sign", top: "FIRST SIGN", mid: "Logged", bottom: `${signs} SO FAR`, earned: signs > 0 },
    { k: "l10", top: "LISTENED", mid: "10 times", bottom: "RITUAL", earned: listenCount >= 10 },
    { k: "l100", top: "LISTENED", mid: "100 times", bottom: "DEVOTION", earned: listenCount >= 100 },
    ...arrived.slice(0, 6).map((t) => ({ top: "ARRIVED", mid: t.desire, bottom: t.days ? `${t.days} DAYS` : "WITH PROOF", earned: true })),
    { top: "NEXT", mid: "Arrival", bottom: "LOCKED", earned: arrived.length > 0 ? null : false },
  ].filter((s) => s.earned !== null);
  // The first time a stamp is earned, remember the date so it can be printed on it.
  const stampDates = { entered: enteredLabel, ...(p.stampDates || {}) };
  const newlyEarned = stamps.filter((s) => s.k && s.earned && !stampDates[s.k]).map((s) => s.k).join(",");
  useEffect(() => {
    if (!newlyEarned) return;
    setP((prev) => ({ ...prev, stampDates: { ...(prev.stampDates || {}), ...Object.fromEntries(newlyEarned.split(",").map((k) => [k, today()])) } }));
  }, [newlyEarned]);

  const mrz = `P<SHG<${(p.name || "GODDESS").toUpperCase().replace(/[^A-Z]/g, "")}<<${(p.goddessName || "").toUpperCase().replace(/[^A-Z]+/g, "<")}`.padEnd(40, "<").slice(0, 40)
    + "\n" + `${callingIn.toUpperCase().replace(/[^A-Z]+/g, "<")}<<${p.entered.slice(0, 4)}<<PROOF<${String(signs).padStart(3, "0")}`.padEnd(40, "<").slice(0, 40);

  const shell = { position: "fixed", inset: 0, zIndex: 1200, background: "#000", color: "#F2ECE4", overflowY: "auto", fontFamily: "'Futura','Jost',sans-serif" };
  const inner = { maxWidth: 920, margin: "0 auto", padding: "calc(env(safe-area-inset-top,0px) + 18px) 18px 40px" };
  const pill = { border: "none", borderRadius: 999, minHeight: 44, padding: "0 18px", fontSize: 14, fontFamily: "inherit", cursor: "pointer" };
  const field = { width: "100%", boxSizing: "border-box", border: "1px solid #000", borderRadius: 10, padding: "10px 12px", fontSize: 14, fontFamily: "inherit", background: "#fff", color: "#000" };
  const tabs = ["Identity", "My Life", "Stamps", "Shop", "Settings"];
  const life = { want: "", desires: "", blocks: "", needs: "", becoming: "", uploads: [], log: {}, ...(p.life || {}) };
  // Every saved answer is kept with its date, so changes over time are visible (and usable for patterns).
  const saveEntry = (k) => { const v = (life[k] || "").trim(); const prev = (life.log && life.log[k]) || []; if (!v || (prev[0] && prev[0].text === v)) return; setLife({ log: { ...(life.log || {}), [k]: [{ date: today(), ts: Date.now(), text: v }, ...prev].slice(0, 100) } }); };
  // Voice: speak an answer and it is written into the field.
  const [dictating, setDictating] = useState(null);
  const recogRef = useRef(null);
  const dictate = (k) => {
    if (dictating) { recogRef.current?.stop(); setDictating(null); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Voice isn't supported in this browser. Try Safari or Chrome."); return; }
    const r = new SR(); r.lang = "en-GB"; r.continuous = true; r.interimResults = false;
    r.onresult = (e) => { const t = Array.from(e.results).slice(e.resultIndex).map((x) => x[0].transcript).join(" "); setP((prev) => { const l = { want: "", desires: "", blocks: "", needs: "", becoming: "", ...(prev.life || {}) }; return { ...prev, life: { ...l, [k]: ((l[k] || "") + " " + t).trim() } }; }); };
    r.onend = () => setDictating(null);
    recogRef.current = r; r.start(); setDictating(k);
  };
  const setLife = (patch) => set({ life: { ...life, ...patch } });

  return (
    <div role="dialog" aria-modal="true" aria-label="Goddess Passport" style={shell}>
      <div style={inner}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <span />
          <button onClick={onClose} aria-label="Close passport" style={{ ...pill, minHeight: 36, padding: "0 14px", background: "transparent", color: "#F2ECE4", border: "1px solid #F2ECE4" }}>Close</button>
        </div>

        {!opened ? (
          <>
            <button onClick={() => { setOpened(true); if (!p.goddessName) setEditing(true); }} aria-label="Open your passport" className="pp-cover" style={{ animation: "pp-float 3.2s ease-in-out infinite, pp-glow 3.2s ease-in-out infinite", border: "2px solid transparent", backgroundClip: "padding-box", outline: "2px solid #BFA5D8", outlineOffset: -2, all: "unset", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", width: "min(360px,82vw)", aspectRatio: "0.71", margin: "0 auto", boxSizing: "border-box", padding: "46px 26px 34px", borderRadius: "6px 18px 18px 6px", background: "radial-gradient(120% 90% at 30% 20%,#1b1b1b,#070707 70%)", boxShadow: "inset 10px 0 14px -8px rgba(0,0,0,.9), 0 0 0 1px #E8B870, 0 0 26px rgba(191,165,216,.55), 0 0 60px rgba(44,183,167,.3)", textAlign: "center", position: "relative" }}>
              <span aria-hidden="true" style={{ position: "absolute", left: 14, top: 10, bottom: 10, width: 1, background: "rgba(242,236,228,.08)" }} />
              <span style={{ fontSize: 11, letterSpacing: ".38em", paddingLeft: ".38em", background: G, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>UNIVERSE OF RESHMA ORACLE</span>
              <span style={{ display: "grid", justifyItems: "center", gap: 18 }}>
                <img src="/logo_transparent_cropped.png" alt="" style={{ width: 120 }} />
                <span style={{ fontSize: 13, letterSpacing: ".42em", paddingLeft: ".42em", background: G, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>SELF HYPNOSIS GODDESS</span>
                <span style={{ fontSize: 34, letterSpacing: ".3em", paddingLeft: ".3em", fontWeight: 500, background: G, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>PASSPORT</span>
              </span>
              <span style={{ display: "grid", justifyItems: "center", gap: 14 }}><svg aria-hidden="true" width="44" height="30" viewBox="0 0 44 30" fill="none" stroke="#E8B870" strokeWidth="1.4"><rect x="1" y="1" width="42" height="28" rx="5" /><circle cx="22" cy="15" r="7" /><path d="M1 15h14M29 15h14" /></svg><span className="pp-tap" style={{ fontSize: 11, letterSpacing: ".3em", paddingLeft: ".3em", color: "#F2ECE4" }}>TAP TO OPEN</span></span>
            </button>
            <button onClick={() => { setOpened(true); setPage(4); }} style={{ ...pill, display: "block", margin: "10px auto 0", background: "transparent", color: "#F2ECE4", textDecoration: "underline", textUnderlineOffset: 3 }}>Settings</button>
          </>
        ) : (
          <div style={{ animation: "shg-pp-open .8s cubic-bezier(.2,.8,.2,1) both", transformOrigin: "left center" }}>
            <div role="tablist" style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
              {tabs.map((t, i) => (
                <button key={t} role="tab" aria-selected={page === i} onClick={() => { setPage(i); setEditing(false); }}
                  style={{ ...pill, minHeight: 36, padding: "0 14px", fontSize: 13, background: page === i ? G : "#161616", color: page === i ? "#000" : "#F2ECE4" }}>{t}</button>
              ))}
            </div>

            {page === 0 && (
              <div className="pp-page" data-page="01 · IDENTITY" style={{ ...PAPER, borderRadius: 18, padding: 18 }}>
                <div style={{ display: "flex", gap: 14 }}>
                  <label style={{ width: 108, height: 136, borderRadius: 10, flexShrink: 0, overflow: "hidden", cursor: "pointer", display: "grid", placeItems: "center", background: p.photo ? "#000" : G, fontSize: 11 }}>
                    {p.photo ? <img src={p.photo} alt="Your passport photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "+ Add photo"}
                    <input type="file" accept="image/*" hidden onChange={async (e) => { const f = e.target.files?.[0]; if (f) set({ photo: await toAvatar(f) }); e.target.value = ""; }} />
                  </label>
                  <div style={{ flex: 1, minWidth: 0, display: "grid", gap: 8, alignContent: "start" }}>
                    <div><Label>NAME</Label>{editing ? <input id="pp-name" style={field} value={p.name} onChange={(e) => set({ name: e.target.value })} /> : <div style={{ fontSize: 15 }}>{p.name || "Add your name"}</div>}</div>
                    <div><Label>GOD OR GODDESS NAME</Label>{editing ? <input id="pp-goddess" style={field} placeholder="The Lucky One" value={p.goddessName} onChange={(e) => set({ goddessName: e.target.value })} /> : <div style={{ fontSize: 15 }}>{p.goddessName || "Choose one"}</div>}</div>
                    <div><Label>I IDENTIFY AS</Label>{editing
                      ? <select id="pp-identity" style={field} value={p.identity || ""} onChange={(e) => set({ identity: e.target.value })}>
                          <option value="">Choose</option><option>Woman</option><option>Man</option><option>Non-binary</option><option>Prefer to self-describe</option><option>Prefer not to say</option>
                        </select>
                      : <div style={{ fontSize: 15 }}>{p.identity || "Not chosen yet"}</div>}</div>
                    <div><Label>CALLING IN</Label><div style={{ fontSize: 14 }}>{callingIn.charAt(0).toUpperCase() + callingIn.slice(1)}</div></div>
                    <div><Label>ENTERED</Label><div style={{ fontSize: 14 }}>{enteredLabel}</div></div>
                  </div>
                </div>

                <div style={{ marginTop: 12 }}><Label>YOUR WORDS {editing && "· pick up to 5"}</Label>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {(editing ? [...new Set([...WORDS, ...p.words])] : p.words).map((w) => (
                      <button key={w} disabled={!editing} onClick={() => toggle("words", w, 5)} aria-pressed={p.words.includes(w)}
                        style={{ fontSize: 12, borderRadius: 999, padding: "5px 11px", fontFamily: "inherit", cursor: editing ? "pointer" : "default", border: "1px solid #000", background: p.words.includes(w) ? "#000" : "transparent", color: p.words.includes(w) ? "#F2ECE4" : "#000" }}>{w}</button>
                    ))}
                    {!editing && !p.words.length && <span style={{ fontSize: 13 }}>Not chosen yet</span>}
                  </div>
                  {editing && (
                    <form onSubmit={(e) => { e.preventDefault(); const w = customWord.trim().toLowerCase(); if (w) { toggle("words", w, 5); setCustomWord(""); } }} style={{ display: "flex", gap: 6, marginTop: 8 }}>
                      <input id="pp-word" style={field} placeholder="Your own word" value={customWord} onChange={(e) => setCustomWord(e.target.value)} />
                      <button style={{ ...pill, minHeight: 40, background: "#000", color: "#F2ECE4" }}>Add</button>
                    </form>
                  )}
                </div>

                {[["favourites","YOUR FAVOURITES","Anything you love: places, people, songs, rituals, one per line"],["thisYear",`${new Date().getFullYear()} INTENTIONS`,"What you're calling in this year, one per line"]].map(([k, l, ph]) => (
                  <div key={k} style={{ marginTop: 12 }}><Label>{l}</Label>
                    {editing
                      ? <textarea id={`pp-${k}`} rows={4} style={{ ...field, resize: "vertical" }} placeholder={ph} value={p[k] || ""} onChange={(e) => set({ [k]: e.target.value })} />
                      : (p[k] ? <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.6 }}>{p[k].split("\n").filter(Boolean).map((x, i) => <li key={i}>{x}</li>)}</ul> : <div style={{ fontSize: 13 }}>Not added yet</div>)}
                  </div>
                ))}

                <div style={{ marginTop: 12 }}><Label>YOU BELIEVE</Label>
                  {editing ? <input id="pp-belief" style={field} placeholder="Everything is always working out for me." value={p.belief} onChange={(e) => set({ belief: e.target.value })} /> : <div style={{ fontSize: 14 }}>{p.belief || "Write your affirmation"}</div>}
                </div>

                <pre style={{ fontFamily: "ui-monospace,Menlo,monospace", fontSize: 10.5, letterSpacing: ".1em", margin: "16px 0 0", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{mrz}</pre>
                <button onClick={() => setEditing(!editing)} style={{ ...pill, width: "100%", marginTop: 14, background: editing ? G : "#000", color: editing ? "#000" : "#F2ECE4" }}>{editing ? "Save my passport" : "Edit my passport"}</button>
              </div>
            )}

            {page === 1 && (
              <div className="pp-page" data-page="02 · MY LIFE" style={{ ...PAPER, borderRadius: 18, padding: 18, display: "grid", gap: 14 }}>
                {(() => {
                  const all = Object.values(life.log || {}).flat();
                  const last = Math.max(0, ...all.map((e) => e.ts || 0));
                  const msg = !all.length ? "Save each answer below to make it your first entry. Your history starts today."
                    : last && Date.now() - last > 30 * 86400000 ? "It's been a month. Update your answers so you can see how far you've come."
                    : "Update this every month. Every saved answer is kept with its date.";
                  return <div style={{ background: "#000", color: "#F2ECE4", borderRadius: 12, padding: "12px 14px", fontSize: 14, lineHeight: 1.5 }}>{msg}</div>;
                })()}
                <div style={{ fontSize: 15, lineHeight: 1.6 }}>Tell me about you. The more you share, the more I learn about you every day: your needs, your desires, your blocks. Edit it whenever you like.</div>
                {[["want", "WHAT I WANT FROM LIFE", "Love, money, body, home, career, freedom…"], ["desires", "MY DESIRES RIGHT NOW", "What I'm calling in this season"], ["blocks", "MY BLOCKS", "What gets in my way, the stories I tell myself"], ["needs", "MY NEEDS", "What I need to feel safe, loved and supported"], ["becoming", "WHO I'M BECOMING", "Her habits, her style, her life"]].map(([k, l, ph]) => (
                  <div key={k}><Label>{l}</Label><textarea id={`pp-life-${k}`} rows={3} style={{ ...field, resize: "vertical", lineHeight: 1.5 }} placeholder={ph} value={life[k]} onChange={(e) => setLife({ [k]: e.target.value })} />
                    <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <button onClick={() => saveEntry(k)} style={{ ...pill, minHeight: 34, marginTop: 6, background: "#000", color: "#F2ECE4", fontSize: 13 }}>Save entry</button>
                      <button onClick={() => dictate(k)} style={{ ...pill, minHeight: 34, marginTop: 6, background: dictating === k ? "#000" : "transparent", color: dictating === k ? "#F2ECE4" : "#000", border: "1px solid #000", fontSize: 13 }}>{dictating === k ? "Listening… tap to stop" : "🎙 Speak it"}</button>
                    </span>
                    {((life.log || {})[k] || []).length > 0 && (
                      <details style={{ marginTop: 8, fontSize: 13 }}><summary style={{ cursor: "pointer" }}>My entries over time ({life.log[k].length})</summary>
                        {life.log[k].map((e, i) => <div key={i} style={{ padding: "6px 0", borderBottom: "1px solid rgba(0,0,0,.15)" }}><b style={{ fontWeight: 500 }}>{e.date}</b> · {e.text}</div>)}
                      </details>
                    )}
                  </div>
                ))}
                <div>
                  <Label>MY UPLOADS</Label>
                  <div style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 10 }}>Upload anything that helps me know you: journal pages, notes, goals. <b style={{ fontWeight: 500 }}>Tip:</b> ask ChatGPT or Claude <i>"Summarise everything you know about me, my dreams, my desires and my blocks"</i>, save the answer and upload it here. Add more whenever you like.</div>
                  <label style={{ ...pill, display: "flex", alignItems: "center", justifyContent: "center", background: "#000", color: "#F2ECE4", cursor: "pointer" }}>
                    + Upload about me
                    <input type="file" multiple accept="image/*,.txt,.md,.pdf,.doc,.docx" hidden onChange={async (e) => {
                      const files = [...(e.target.files || [])];
                      const added = await Promise.all(files.map(async (f) => ({ name: f.name, type: f.type, date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }), text: /^text\//.test(f.type) || /\.(txt|md)$/i.test(f.name) ? (await f.text()).slice(0, 5000) : "" })));
                      setLife({ uploads: [...added, ...(life.uploads || [])].slice(0, 50) }); e.target.value = "";
                    }} />
                  </label>
                  {(life.uploads || []).map((u, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 13, padding: "8px 2px", borderBottom: "1px solid rgba(0,0,0,.2)" }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</span>
                      <span style={{ display: "flex", gap: 10, flexShrink: 0 }}>{u.date}<button onClick={() => setLife({ uploads: life.uploads.filter((_, j) => j !== i) })} aria-label={`Remove ${u.name}`} style={{ all: "unset", cursor: "pointer" }}>✕</button></span>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 12, lineHeight: 1.5 }}>Saved on this device for now. Only you can see it.</div>
              </div>
            )}

            {page === 2 && (
              <div className="pp-page" data-page="03 · VISAS & STAMPS" style={{ ...PAPER, borderRadius: 18, padding: 18 }}>
                <Label>EARNED IN THE UNIVERSE · {stamps.filter((s) => s.earned).length}</Label>
                <style>{`body .pp-stamps.pp-stamps{display:grid!important;flex-direction:initial!important;grid-template-columns:repeat(auto-fill,minmax(140px,1fr))!important;gap:18px;margin-top:12px}@media(max-width:700px){body .pp-stamps.pp-stamps{grid-template-columns:1fr 1fr!important}}`}</style><div className="pp-stamps">
                  {stamps.map((s0, i) => { const s = s0.earned && s0.k && stampDates[s0.k] ? { ...s0, bottom: String(stampDates[s0.k]).toUpperCase() } : s0; return (
                    <div key={i} style={{ textAlign: "center" }}>
                      <Stamp s={s} i={i} />
                      {!s.earned && <div style={{ marginTop: 8, fontSize: 13, color: "#000" }}>Not yet</div>}
                    </div>
                  ); })}
                </div>
              </div>
            )}

            {page === 3 && (
              <div className="pp-page" data-page="04 · SHOP" style={{ ...PAPER, borderRadius: 18, padding: 18, display: "grid", gap: 12 }}>
                <div style={{ fontSize: 15, lineHeight: 1.6 }}>Workbooks, the method deck and working with me.</div>
                <div style={{ background: "#000", borderRadius: 14, padding: 10 }}><ShopGrid /></div>
                <WorkWithReshma />
              </div>
            )}

            {page === 4 && (
              <div className="pp-page" data-page="05 · SETTINGS" style={{ ...PAPER, borderRadius: 18, padding: 10, display: "grid", gap: 4, color: "#000" }}>
                <div style={{ fontSize: 13, padding: "8px 10px" }}>{tierLabel}{email ? ` · ${email}` : ""}</div>
                {[
                  ["Manage membership", actions.billing],
                  [`Switch to ${isDark ? "light" : "dark"} mode`, actions.theme],
                  ["Listening guide", actions.guide],
                  ["Back to the website", actions.site],
                  ["Sign out", actions.signOut],
                ].map(([l, fn]) => (
                  <button key={l} onClick={fn} style={{ all: "unset", cursor: "pointer", padding: "14px 10px", fontSize: 15, color: "#000", borderBottom: "1px solid #000" }}>{l}</button>
                ))}
                <div style={{ fontSize: 12, padding: "12px 10px", lineHeight: 1.5 }}>Your passport is saved on this device.</div>
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`[data-portal-theme] [aria-label="Goddess Passport"] input,[data-portal-theme] [aria-label="Goddess Passport"] textarea{background:#fff!important;color:#000!important;-webkit-text-fill-color:#000!important;border-color:#000!important}
[aria-label="Goddess Passport"] input::placeholder,[aria-label="Goddess Passport"] textarea::placeholder{color:#000!important;opacity:.45!important}

.pp-page{position:relative;border-radius:6px 16px 16px 6px!important;padding-top:46px!important;padding-bottom:40px!important;box-shadow:inset 14px 0 18px -14px rgba(0,0,0,.45),0 18px 40px rgba(0,0,0,.5);outline:1px solid rgba(0,0,0,.15);outline-offset:-10px}
.pp-page::before{content:"SELF HYPNOSIS GODDESS  ·  PASSPORT  ·  PASSEPORT";position:absolute;left:0;right:0;top:14px;text-align:center;font-size:9px;letter-spacing:.32em;color:#000;opacity:.7}
.pp-page::after{content:attr(data-page);position:absolute;left:0;right:0;bottom:14px;text-align:center;font-size:9px;letter-spacing:.3em;color:#000;opacity:.7}
.pp-page{background-image:linear-gradient(rgba(191,165,216,.28) 1px,transparent 1px),linear-gradient(90deg,rgba(191,165,216,.28) 1px,transparent 1px),repeating-radial-gradient(circle at 50% 120%,transparent 0 14px,rgba(44,183,167,.10) 14px 15px)!important;background-size:20px 20px,20px 20px,auto!important}
@keyframes pp-float{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-8px) rotate(1deg)}}
.pp-tap{animation:pp-blink 1.6s ease-in-out infinite}@keyframes pp-blink{50%{opacity:.35}}
@keyframes shg-pp-open{from{opacity:0;transform:perspective(1200px) rotateY(-70deg);transform-origin:left center}to{opacity:1;transform:none;transform-origin:left center}}
@keyframes pp-glow{0%,100%{filter:drop-shadow(0 0 6px rgba(232,184,112,.55))}50%{filter:drop-shadow(0 0 18px rgba(44,183,167,.7))}}
@media(prefers-reduced-motion:reduce){[aria-label="Goddess Passport"] *{animation:none!important}}`}</style>
    </div>
  );
}
