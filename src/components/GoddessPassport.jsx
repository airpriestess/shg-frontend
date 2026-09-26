import { useEffect, useRef, useState } from "react";
import ShopGrid, { WorkWithReshma } from "./ShopGrid.jsx";

// The Goddess Passport replaces the profile. She builds it (photo, Goddess
// name, colours, words, belief) and collects stamps as she moves through the
// app. Saved on the device, and to her account when signed in.
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

// MY LIFE: one check-in at a time. One box (type or speak), one optional
// photo. Past check-ins, including older multi-field ones, are listed below.
const LIFE_FIELDS = [["want", "What I want from life"], ["desires", "My desires"], ["blocks", "My blocks"], ["needs", "My needs"], ["becoming", "Who I'm becoming"]];
const AI_PROMPT = "Hi, I want you to extract every single detail you know about me that defines: my current desires, what you think my blocks are in achieving these desires, my current emotional needs, and who I'm becoming. Put it under those four headings.";
const SUM_KEYS = [["desires", "Desires", /desires?/i], ["blocks", "Blocks", /blocks?/i], ["needs", "Emotional needs", /emotional\s+needs?|needs?/i], ["becoming", "Becoming", /becoming/i]];
// Split an AI answer under the four headings; else the first few sentences.
function summarise(text) {
  const out = {}; let cur = null;
  String(text || "").split(/\r?\n/).forEach((line) => {
    const clean = line.replace(/^[#*\s\d.)-]+/, "").replace(/[*:]+\s*$/, "").trim();
    const head = clean.length < 60 && SUM_KEYS.find(([, , re]) => re.test(clean) && clean.split(/\s+/).length <= 7);
    if (head) { cur = head[0]; const rest = line.split(":").slice(1).join(":").trim(); out[cur] = rest ? [rest] : []; return; }
    if (cur && line.trim()) out[cur].push(line.trim().replace(/^[-*•]\s*/, ""));
  });
  const found = Object.keys(out).filter((k) => out[k].length);
  if (found.length >= 2) return Object.fromEntries(found.map((k) => [k, out[k].join(" ")]));
  const sent = String(text || "").replace(/\s+/g, " ").match(/[^.!?]+[.!?]+/g) || [String(text || "").slice(0, 300)];
  return { overview: sent.slice(0, 3).join(" ").trim() };
}
function MyLife({ savedWhere, life, setLife, pill, field }) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [openIdx, setOpenIdx] = useState(null);
  const ai = life.aiCheckins || [];
  // Older check-ins (monthly boxes, single answers) stay readable in history.
  const older = [
    ...(life.checkins || []).map((c) => ({ ...c, _old: true })),
    ...Object.entries(life.log || {}).flatMap(([k, arr]) => (arr || []).map((e) => ({ ts: e.ts, date: e.date, _old: true, text: `${(LIFE_FIELDS.find(([x]) => x === k) || [k, k])[1]}: ${e.text}` }))),
  ];
  const all = [...ai, ...older].sort((a, b) => (b.createdAt || b.ts || 0) - (a.createdAt || a.ts || 0));
  const tileLabel = (c) => { const d = new Date(c.createdAt || c.ts || Date.now()); return `${d.toLocaleDateString("en-GB", { month: "short" })} ${String(d.getFullYear()).slice(2)} check-in`; };
  const copy = async () => { try { await navigator.clipboard.writeText(AI_PROMPT); } catch { try { const t = document.createElement("textarea"); t.value = AI_PROMPT; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove(); } catch {} } setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const onFile = async (f) => {
    if (!f) return;
    if (/\.(txt|md)$/i.test(f.name) || /^text\//.test(f.type)) { const t = (await f.text()).slice(0, 20000); setFile({ name: f.name }); setText((x) => (x ? x + "\n\n" : "") + t); }
    else setFile({ name: f.name, pdf: true });
  };
  const save = () => {
    const v = text.trim(); if (!v && !file) return;
    const now = new Date();
    const rec = { month: now.toLocaleDateString("en-GB", { month: "long", year: "numeric" }), text: v, createdAt: Date.now(), file: file ? file.name : undefined, note: file?.pdf ? "PDF saved" : undefined, summary: v ? summarise(v) : { overview: "PDF saved" } };
    setLife({ aiCheckins: [rec, ...ai].slice(0, 60) });
    try { window.dispatchEvent(new CustomEvent("shg-passport-updated")); } catch {}
    setText(""); setFile(null); setSaved(true); setTimeout(() => setSaved(false), 2500);
  };
  const cur = openIdx != null ? all[openIdx] : null;
  const boxes = cur ? (cur.summary ? Object.entries(cur.summary).map(([k, v]) => [(SUM_KEYS.find(([x]) => x === k) || [k, "Overview"])[1], v]) : cur.text ? [["Check-in", cur.text]] : LIFE_FIELDS.filter(([k]) => cur[k]).map(([k, l]) => [l, cur[k]])) : [];
  return (
    <div className="pp-page" data-page="02 · MY LIFE" style={{ ...PAPER, borderRadius: 18, padding: 18, display: "grid", gap: 14 }}>
      <div style={{ background: "#000", color: "#F2ECE4", borderRadius: 14, padding: "16px 14px", display: "grid", gap: 10 }}>
        <div style={{ fontSize: 20, fontWeight: 400 }}>Monthly AI check-in</div>
        <div style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.5 }}>Once a month, ask ChatGPT or Claude what it knows about you, then upload or paste its answer here. Share only what you want to.</div>
        <div style={{ border: "1px solid rgba(242,236,228,.35)", borderRadius: 12, padding: "12px", fontSize: 13, fontWeight: 300, lineHeight: 1.55 }}>{AI_PROMPT}</div>
        <button onClick={copy} style={{ ...pill, minHeight: 38, fontSize: 14, background: G, color: "#000" }}>{copied ? "Copied ✓" : "Copy prompt"}</button>
        <label style={{ ...pill, minHeight: 38, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", color: "#F2ECE4", border: "1px solid #F2ECE4" }}>
          {file ? `${file.name}${file.pdf ? " · PDF saved" : " ✓"}` : "Upload its answer (.txt, .md, .pdf)"}
          <input type="file" accept=".txt,.md,.pdf,text/plain,text/markdown,application/pdf" hidden onChange={async (e) => { await onFile(e.target.files?.[0]); e.target.value = ""; }} />
        </label>
        <textarea id="pp-ai-text" rows={5} style={{ ...field, resize: "vertical", lineHeight: 1.5, fontSize: 15, fontWeight: 300 }} placeholder="…or paste the answer here" value={text} onChange={(e) => setText(e.target.value)} />
        <button onClick={save} style={{ ...pill, background: "#F2ECE4", color: "#000" }}>{saved ? "Saved ✓" : "Save this month's check-in"}</button>
      </div>
      <div>
        <Label>MY CHECK-INS · {all.length}</Label>
        {!all.length && <div style={{ fontSize: 13, fontWeight: 300 }}>Your first one will show here.</div>}
        <style>{`body .pp-ci.pp-ci{display:grid!important;flex-direction:initial!important;grid-template-columns:repeat(3,1fr)!important;gap:8px}`}</style>
        <div className="pp-ci">
          {all.map((c, i) => (
            <button key={(c.createdAt || c.ts || 0) + "-" + i} onClick={() => setOpenIdx(i)} style={{ aspectRatio: "1", background: "#000", color: "#F2ECE4", border: "1px solid #E8B870", borderRadius: 14, cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 300, padding: 8, display: "grid", placeItems: "center", textAlign: "center", lineHeight: 1.3 }}>
              <span><img src="/logo_transparent_cropped.png" alt="" style={{ width: 26, display: "block", margin: "0 auto 6px" }} />{tileLabel(c)}</span>
            </button>
          ))}
        </div>
      </div>
      {cur && (
        <div style={{ position: "relative", background: "#fff", border: "1px solid #000", borderRadius: 14, padding: "40px 12px 12px", display: "grid", gap: 8 }}>
          <button onClick={() => setOpenIdx(null)} aria-label="Close" style={{ position: "absolute", top: 8, right: 8, width: 32, height: 32, borderRadius: "50%", border: "1px solid #000", background: "#F2ECE4", color: "#000", fontSize: 18, cursor: "pointer", fontFamily: "inherit" }}>×</button>
          <div style={{ position: "absolute", top: 14, left: 12, fontSize: 11, letterSpacing: ".2em" }}>{tileLabel(cur).toUpperCase()}</div>
          {cur.photo && <img src={cur.photo} alt="" style={{ width: 90, height: 90, borderRadius: 10, objectFit: "cover" }} />}
          {boxes.map(([h, v]) => (
            <div key={h} style={{ border: "1px solid rgba(0,0,0,.25)", borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, letterSpacing: ".2em", marginBottom: 4 }}>{String(h).toUpperCase()}</div>
              <div style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.5, whiteSpace: "pre-line" }}>{v}</div>
            </div>
          ))}
          {cur.file && <div style={{ fontSize: 12, fontWeight: 300 }}>File: {cur.file}{cur.note ? ` · ${cur.note}` : ""}</div>}
        </div>
      )}
      {(life.uploads || []).length > 0 && (
        <details style={{ fontSize: 13 }}><summary style={{ cursor: "pointer" }}>Earlier uploads ({life.uploads.length})</summary>
          {life.uploads.map((u, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "8px 2px", borderBottom: "1px solid rgba(0,0,0,.2)" }}>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}{u.text && u.name === "Note" ? `: ${u.text}` : ""}</span>
              <span style={{ display: "flex", gap: 10, flexShrink: 0 }}>{u.date}<button onClick={() => setLife({ uploads: life.uploads.filter((_, j) => j !== i) })} aria-label={`Remove ${u.name}`} style={{ all: "unset", cursor: "pointer" }}>✕</button></span>
            </div>
          ))}
        </details>
      )}
      <div style={{ fontSize: 12, lineHeight: 1.5 }}>{savedWhere}</div>
    </div>
  );
}

const AREAS = ["Luck", "Money", "Love", "Beauty", "Confidence", "Career", "Health", "Peace"];
const AREA_CAT = { Luck: "Luckygirlmaxxing", Money: "Richgirlmaxxing", Love: "Lovemaxxing", Beauty: "Beautymaxxing", Confidence: "Selfmaxxing", Career: "Businessmaxxing", Health: "Healthmaxxing", Peace: "Sleepmaxxing" };
const AREA_COL = ["#F5E0A0", "#E8B870", "#BFA5D8", "#2CB7A7", "#167A6B"];
// Her mix of areas: weighted by bucket list ideas per area when there are any, else equal.
function AreaDonut({ areas, threads }) {
  const bucket = threads.filter((t) => t.isBucket);
  const w = areas.map((a) => bucket.filter((t) => String(t.category || "").includes(AREA_CAT[a])).length);
  const weights = w.some(Boolean) ? w.map((x) => x + 0.25) : areas.map(() => 1);
  const total = weights.reduce((a, b) => a + b, 0);
  const R = 34, C = 2 * Math.PI * R; let off = 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 12 }}>
      <svg width="96" height="96" viewBox="0 0 96 96" aria-label="Your mix of areas" role="img" style={{ flexShrink: 0 }}>
        <circle cx="48" cy="48" r={R} fill="none" stroke="rgba(0,0,0,.08)" strokeWidth="14" />
        {areas.map((a, i) => { const len = (weights[i] / total) * C; const el = <circle key={a} cx="48" cy="48" r={R} fill="none" stroke={AREA_COL[i % AREA_COL.length]} strokeWidth="14" strokeDasharray={`${Math.max(len - 1.5, 0.5)} ${C}`} strokeDashoffset={-off} transform="rotate(-90 48 48)" />; off += len; return el; })}
      </svg>
      <div style={{ display: "grid", gap: 4 }}>
        {areas.map((a, i) => <div key={a} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 300 }}><span style={{ width: 10, height: 10, borderRadius: "50%", background: AREA_COL[i % AREA_COL.length], border: "1px solid rgba(0,0,0,.2)" }} />{a} · {Math.round((weights[i] / total) * 100)}%</div>)}
      </div>
    </div>
  );
}

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
        <g transform="translate(78 62) scale(1.1)" strokeWidth="1.2">
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
  const [themeMsg, setThemeMsg] = useState("");
  const [lifeEdit, setLifeEdit] = useState(false);
  const [pastWin, setPastWin] = useState("");
  const areas = (p.onboarding && Array.isArray(p.onboarding.areas)) ? p.onboarding.areas : [];
  const savedWhere = isPreview || !userId ? "Saved on this device. Only you can see it." : "Saved to your account. Only you can see it.";
  // Cover look: black graph paper (default) or white graph paper; ?cover=white previews the other.
  const coverStyle = (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("cover")) || "black";

  useEffect(() => { store(key, p); try { window.dispatchEvent(new CustomEvent("shg-passport-updated", { detail: { name: p.name, goddessName: p.goddessName } })); } catch {} }, [key, p]);
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
  // Listening streak (days in a row up to today) from this device's listen log.
  const streak = (() => { let l = []; try { l = JSON.parse(localStorage.getItem("shg_listen_log") || "[]"); } catch {} if (isPreview && !l.length) return 21; const days = new Set(l.map((e) => String(e.d || "").slice(0, 10))); let n = 0; const d = new Date(); while (days.has(d.toISOString().slice(0, 10))) { n++; d.setDate(d.getDate() - 1); } return n; })();
  const sharedCount = (() => { try { return (JSON.parse(localStorage.getItem("shg_shared_wins") || "[]") || []).length; } catch { return 0; } })();
  const arrived = threads.filter((t) => t.done);
  const enteredLabel = new Date(p.entered).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  const stamps = [
    { k: "entered", top: "ENTERED", mid: "The Portal", bottom: enteredLabel.toUpperCase(), earned: true },
    { k: "built", top: "PASSPORT", mid: "Built", bottom: "IDENTITY", earned: !!(p.name && areas.length), how: "Add your name and what you're manifesting" },
    { k: "intention", top: "FIRST", mid: "Intention", bottom: "WRITTEN", earned: threads.length > 0, how: "Write your first intention" },
    { k: "sign", top: "FIRST SIGN", mid: "Logged", bottom: `${signs} SO FAR`, earned: signs > 0, how: "Log your first sign" },
    { k: "l10", top: "LISTENED", mid: "10 times", bottom: "RITUAL", earned: listenCount >= 10, how: "Listen 10 times" },
    { k: "l50", g: "Listening", top: "LISTENED", mid: "50 times", bottom: "HABIT", earned: listenCount >= 50, how: "Listen 50 times" },
    { k: "i3", top: "THREE", mid: "Intentions", bottom: "SET", earned: threads.length >= 3, how: "Set 3 intentions in proofOS" },
    { k: "s10", top: "TEN SIGNS", mid: "Noticed", bottom: "LOGGED", earned: signs >= 10, how: "Log 10 signs" },
    { k: "m1", top: "FIRST", mid: "Manifested", bottom: "PROOF", earned: arrived.length >= 1, how: "Mark your first manifestation" },
    { k: "m5", top: "FIVE", mid: "Manifested", bottom: "ON THE WALL", earned: arrived.length >= 5, how: "Manifest 5 desires" },
    { k: "s50", top: "FIFTY SIGNS", mid: "Synchronicity", bottom: "FLOWING", earned: signs >= 50, how: "Log 50 signs" },
    { k: "m10", top: "TEN", mid: "Manifested", bottom: "UNSTOPPABLE", earned: arrived.length >= 10, how: "Manifest 10 desires" },
    { k: "l365", top: "LISTENED", mid: "365 times", bottom: "A YEAR OF YOU", earned: listenCount >= 365, how: "Listen 365 times" },
    { k: "l100", top: "LISTENED", mid: "100 times", bottom: "DEVOTION", earned: listenCount >= 100, how: "Listen 100 times" },
    { k: "st7", g: "Listening", top: "7-DAY", mid: "Streak", bottom: "CONSISTENT", earned: streak >= 7, how: "Listen 7 days in a row" },
    { k: "st30", g: "Listening", top: "30-DAY", mid: "Streak", bottom: "COMMITTED", earned: streak >= 30, how: "Listen 30 days in a row" },
    ...[["Money", "Richgirlmaxxing"], ["Love", "Lovemaxxing"], ["Luck", "Luckygirlmaxxing"], ["Beauty", "Beautymaxxing"], ["Confidence", "Selfmaxxing"], ["Career", "Businessmaxxing"], ["Health", "Healthmaxxing"], ["Peace", "Sleepmaxxing"]].map(([a, c]) => {
      const ts = threads.filter((t) => String(t.category || "").split(",").map((x) => x.trim()).includes(c));
      const n = ts.reduce((x, t) => x + (t.signs?.length || 0), 0);
      return { k: `sg-${a}`, g: "By area", top: "FIRST SIGN", mid: a, bottom: "LOGGED", earned: n > 0, how: `Log your first ${a} sign` };
    }),
    { k: "b10", g: "Bucket list", top: "BUCKET LIST", mid: "10 ideas", bottom: "RELEASED", earned: threads.filter((t) => t.isBucket).length >= 10, how: "Add 10 bucket list ideas" },
    { k: "b100", g: "Bucket list", top: "BUCKET LIST", mid: "100 ideas", bottom: "LIMITLESS", earned: threads.filter((t) => t.isBucket).length >= 100, how: "Add 100 bucket list ideas" },
    { k: "share1", g: "Proof", top: "FIRST PROOF", mid: "Shared", bottom: "COMMUNITY", earned: sharedCount > 0, how: "Share a win with the community" },
    { k: "ci1", g: "Passport", top: "FIRST", mid: "Check-in", bottom: "MY LIFE", earned: (((p.life && p.life.checkins) || []).length + ((p.life && p.life.aiCheckins) || []).length) > 0, how: "Save your first monthly check-in" },
    { k: "pw5", g: "Passport", top: "FIVE", mid: "Past wins", bottom: "REMEMBERED", earned: (p.pastWins || []).length >= 5, how: "Add 5 things you'd already manifested" },
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

  const shell = { position: "fixed", inset: 0, zIndex: 1200, background: "#000", color: "#F2ECE4", overflowY: "auto", fontFamily: "'Jost',sans-serif", fontWeight: 300 };
  const inner = { maxWidth: 920, margin: "0 auto", padding: "calc(env(safe-area-inset-top,0px) + 18px) 16px calc(env(safe-area-inset-bottom,0px) + 90px)", boxSizing: "border-box" };
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
            <button onClick={() => { setOpened(true); if (!p.goddessName) setEditing(true); }} aria-label="Open your passport" className="pp-cover" style={{ animation: "pp-float 3.2s ease-in-out infinite, pp-glow 3.2s ease-in-out infinite", border: "2px solid transparent", backgroundClip: "padding-box", outline: "2px solid #BFA5D8", outlineOffset: -2, all: "unset", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", width: "min(440px, 88vw, calc((100svh - 150px) * 0.71))", aspectRatio: "0.71", margin: "4vh auto 0", boxSizing: "border-box", padding: "46px 26px 34px", borderRadius: "6px 18px 18px 6px", background: coverStyle === "white" ? "#F2ECE4" : "#000", backgroundImage: coverStyle === "white" ? "linear-gradient(rgba(191,165,216,.45) 1px,transparent 1px),linear-gradient(90deg,rgba(191,165,216,.45) 1px,transparent 1px)" : "linear-gradient(rgba(191,165,216,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(191,165,216,.2) 1px,transparent 1px)", backgroundSize: "20px 20px", boxShadow: coverStyle === "white" ? "inset 10px 0 14px -8px rgba(0,0,0,.25), 0 0 0 1px #E8B870, 0 0 26px rgba(191,165,216,.55), 0 0 60px rgba(44,183,167,.3)" : "inset 10px 0 14px -8px rgba(0,0,0,.9), 0 0 0 1px #E8B870, 0 0 26px rgba(191,165,216,.55), 0 0 60px rgba(44,183,167,.3)", textAlign: "center", position: "relative" }}>
              <span aria-hidden="true" style={{ position: "absolute", left: 14, top: 10, bottom: 10, width: 1, background: "rgba(242,236,228,.08)" }} />
              <span style={{ fontSize: 11, letterSpacing: ".38em", paddingLeft: ".38em", background: G, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>UNIVERSE OF RESHMA ORACLE</span>
              <span style={{ display: "grid", justifyItems: "center", gap: 18 }}>
                <img src="/logo_transparent_cropped.png" alt="" style={{ width: 120 }} />
                <span style={{ fontSize: 13, letterSpacing: ".42em", paddingLeft: ".42em", background: G, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>SELF HYPNOSIS GODDESS</span>
                <span style={{ fontSize: 34, letterSpacing: ".3em", paddingLeft: ".3em", fontWeight: 500, background: G, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>PASSPORT</span>
              </span>
              <span style={{ display: "grid", justifyItems: "center", gap: 14 }}><svg aria-hidden="true" width="44" height="30" viewBox="0 0 44 30" fill="none" stroke="#E8B870" strokeWidth="1.4"><rect x="1" y="1" width="42" height="28" rx="5" /><circle cx="22" cy="15" r="7" /><path d="M1 15h14M29 15h14" /></svg><span className="pp-tap" style={{ fontSize: 11, letterSpacing: ".3em", paddingLeft: ".3em", color: coverStyle === "white" ? "#000" : "#F2ECE4" }}>TAP TO OPEN</span></span>
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
              <div className="pp-page" data-page="01 · IDENTITY" style={{ ...PAPER, borderRadius: 18, padding: "30px 14px 34px" }}>
                <div style={{ display: "flex", gap: 14 }}>
                  <label style={{ width: 84, height: 108, borderRadius: 10, flexShrink: 0, overflow: "hidden", cursor: "pointer", display: "grid", placeItems: "center", background: p.photo ? "#000" : G, fontSize: 11 }}>
                    {p.photo ? <img src={p.photo} alt="Your passport photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "+ Add photo"}
                    <input type="file" accept="image/*" hidden onChange={async (e) => { const f = e.target.files?.[0]; if (f) set({ photo: await toAvatar(f) }); e.target.value = ""; }} />
                  </label>
                  <div style={{ flex: 1, minWidth: 0, display: "grid", gap: 4, alignContent: "start" }}>
                    <div><Label>NAME</Label>{editing ? <input id="pp-name" style={field} value={p.name} onChange={(e) => set({ name: e.target.value })} /> : <div style={{ fontSize: 14 }}>{p.name || "Add your name"}</div>}</div>
                    <div><Label>GOD OR GODDESS NAME</Label>{editing ? <input id="pp-goddess" style={field} placeholder="The Lucky One" value={p.goddessName} onChange={(e) => set({ goddessName: e.target.value })} /> : <div style={{ fontSize: 14 }}>{p.goddessName || "Choose one"}</div>}</div>
                    <div><Label>I IDENTIFY AS</Label>{editing
                      ? <select id="pp-identity" style={field} value={p.identity || ""} onChange={(e) => set({ identity: e.target.value })}>
                          <option value="">Choose</option><option>Woman</option><option>Man</option><option>Non-binary</option><option>Prefer to self-describe</option><option>Prefer not to say</option>
                        </select>
                      : <div style={{ fontSize: 14 }}>{p.identity || "Not chosen yet"}</div>}</div>
                    <div><Label>BIRTHDAY · DAY AND MONTH</Label>{editing ? <input id="pp-birthday" type="date" style={field} value={p.birthday || ""} onChange={(e) => set({ birthday: e.target.value })} /> : <div style={{ fontSize: 14 }}>{p.birthday ? new Date(p.birthday + "T00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long" }) : "Add it so we can celebrate you"}</div>}</div>
                    <div><Label>CALLING IN</Label><div style={{ fontSize: 14 }}>{callingIn.charAt(0).toUpperCase() + callingIn.slice(1)}</div></div>
                    <div><Label>ENTERED</Label><div style={{ fontSize: 14 }}>{enteredLabel}</div></div>
                  </div>
                </div>

                <div style={{ marginTop: 12 }}><Label>WHAT I'M MANIFESTING {editing && "· tap to choose"}</Label>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {AREAS.map((w) => { const on = areas.includes(w); return (
                      <button key={w} onClick={() => set({ onboarding: { ...(p.onboarding || {}), areas: on ? areas.filter((x) => x !== w) : [...areas, w] } })} aria-pressed={on}
                        style={{ fontSize: 13, fontWeight: 300, borderRadius: 999, padding: "6px 12px", fontFamily: "inherit", cursor: "pointer", border: "1px solid #000", background: on ? "#000" : "transparent", color: on ? "#F2ECE4" : "#000" }}>{w}</button>
                    ); })}
                  </div>
                  {areas.length > 0 && <AreaDonut areas={areas} threads={threads} />}
                </div>

                <div style={{ marginTop: 14 }}><Label>ALREADY MANIFESTED · BEFORE SELF HYPNOSIS GODDESS</Label>
                  <div style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.5, marginBottom: 8 }}>Wins you'd written in a journal before the app. They count.</div>
                  <form onSubmit={(e) => { e.preventDefault(); const v = pastWin.trim(); if (!v) return; set({ pastWins: [{ text: v, ts: Date.now() }, ...(p.pastWins || [])].slice(0, 200) }); setPastWin(""); }} style={{ display: "flex", gap: 6 }}>
                    <input id="pp-pastwin" style={field} placeholder="e.g. Got the flat I wanted, 2024" value={pastWin} onChange={(e) => setPastWin(e.target.value)} />
                    <button style={{ ...pill, minHeight: 40, background: "#000", color: "#F2ECE4" }}>Add</button>
                  </form>
                  {(p.pastWins || []).map((w, i) => (
                    <div key={w.ts || i} style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 14, fontWeight: 300, padding: "8px 2px", borderBottom: "1px solid rgba(0,0,0,.2)" }}>
                      <span>✦ {w.text}</span>
                      <button onClick={() => set({ pastWins: p.pastWins.filter((_, j) => j !== i) })} aria-label={`Remove ${w.text}`} style={{ all: "unset", cursor: "pointer", flexShrink: 0 }}>✕</button>
                    </div>
                  ))}
                </div>

                <pre className="pp-mrz" style={{ fontFamily: "ui-monospace,Menlo,monospace", fontSize: 9, letterSpacing: ".06em", margin: "10px 0 0", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{mrz}</pre>
                <button onClick={() => setEditing(!editing)} style={{ ...pill, width: "100%", marginTop: 10, minHeight: 40, background: editing ? G : "#000", color: editing ? "#000" : "#F2ECE4" }}>{editing ? "Save my passport" : "Edit my passport"}</button>
              </div>
            )}

            {page === 1 && (
              <MyLife savedWhere={savedWhere} life={life} setLife={setLife} dictate={dictate} dictating={dictating} pill={pill} field={field} />
            )}

            {page === 2 && (
              <div className="pp-page" data-page="03 · VISAS & STAMPS" style={{ ...PAPER, borderRadius: 18, padding: 18 }}>
<div className="pp-earned" style={{ fontSize: 13, letterSpacing: ".3em", marginBottom: 6, background: G, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>EARNED IN THE UNIVERSE · {stamps.filter((s) => s.earned).length}</div>
                <style>{`body .pp-stamps.pp-stamps{display:grid!important;flex-direction:initial!important;grid-template-columns:repeat(auto-fill,minmax(140px,1fr))!important;gap:18px;margin-top:12px}@media(max-width:700px){body .pp-stamps.pp-stamps{grid-template-columns:1fr 1fr!important}}`}</style><div className="pp-stamps">
                  {stamps.filter(x => x.earned).map((s0, i) => { const s = s0.k && stampDates[s0.k] ? { ...s0, bottom: String(stampDates[s0.k]).toUpperCase() } : s0; return (
                    <div key={i} style={{ textAlign: "center" }}><Stamp s={s} i={i} /></div>
                  ); })}
                </div>
                <div style={{ marginTop: 22 }}><Label>MILESTONES YET TO EARN · {stamps.filter((s) => !s.earned).length}</Label></div>
                {Object.entries(stamps.filter((x) => !x.earned).reduce((m, x) => { const g = x.g || "Milestones"; (m[g] = m[g] || []).push(x); return m; }, {})).map(([g, list]) => (
                  <div key={g} style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 12, letterSpacing: ".2em", marginBottom: 6 }}>{g.toUpperCase()}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {list.map((x, i) => <span key={i} style={{ fontSize: 13, fontWeight: 300, padding: "5px 10px", border: "1px dashed #000", borderRadius: 999 }}>○ {x.how || `${x.top} ${x.mid}`}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {page === 3 && (
              <div className="pp-page" data-page="04 · SHOP" style={{ ...PAPER, borderRadius: 18, padding: 18, display: "grid", gap: 12 }}>
                <div style={{ fontSize: 15, lineHeight: 1.6 }}>Workbooks, freebies and working with me.</div>
                <div style={{ background: "#000", borderRadius: 14, padding: 10 }}><ShopGrid /></div>
                <WorkWithReshma />
              </div>
            )}

            {page === 4 && (
              <div className="pp-page" data-page="05 · SETTINGS" style={{ ...PAPER, borderRadius: 18, padding: 10, display: "grid", gap: 4, color: "#000" }}>
                <div style={{ fontSize: 13, padding: "8px 10px" }}>{tierLabel}{email ? ` · ${email}` : ""}</div>
                {[
                  ["Manage membership", actions.billing],
                  [`Switch to ${isDark ? "light" : "dark"} mode`, () => { actions.theme(); setThemeMsg(`${isDark ? "Light" : "Dark"} mode is on. You'll see it when you close your passport.`); }],
                  ["Listening guide", actions.guide],
                  ["Sign out", actions.signOut],
                ].map(([l, fn]) => (
                  <button key={l} onClick={fn} style={{ all: "unset", cursor: "pointer", padding: "14px 10px", fontSize: 15, color: "#000", borderBottom: "1px solid #000" }}>{l}</button>
                ))}
                {themeMsg && <div style={{ fontSize: 13, padding: "10px", lineHeight: 1.5 }}>{themeMsg}</div>}
                <div style={{ fontSize: 12, padding: "12px 10px", lineHeight: 1.5 }}>{savedWhere}</div>
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`[data-portal-theme] [aria-label="Goddess Passport"] input,[data-portal-theme] [aria-label="Goddess Passport"] textarea{background:#fff!important;color:#000!important;-webkit-text-fill-color:#000!important;border-color:#000!important}
[aria-label="Goddess Passport"] input::placeholder,[aria-label="Goddess Passport"] textarea::placeholder{color:#000!important;opacity:.45!important}

.pp-page{position:relative;border-radius:6px 16px 16px 6px!important;padding-top:46px!important;padding-bottom:40px!important;box-shadow:inset 14px 0 18px -14px rgba(0,0,0,.45),0 18px 40px rgba(0,0,0,.5);outline:1px solid rgba(0,0,0,.15);outline-offset:-10px}
.pp-page::before{content:"PASSPORT · PASSEPORT";position:absolute;left:0;right:0;top:14px;text-align:center;font-size:9px;letter-spacing:.18em;color:#000;opacity:.7}
.pp-page::after{content:attr(data-page);position:absolute;left:0;right:0;bottom:14px;text-align:center;font-size:9px;letter-spacing:.3em;color:#000;opacity:.7}
.pp-page{background-image:linear-gradient(rgba(191,165,216,.28) 1px,transparent 1px),linear-gradient(90deg,rgba(191,165,216,.28) 1px,transparent 1px),repeating-radial-gradient(circle at 50% 120%,transparent 0 14px,rgba(44,183,167,.10) 14px 15px)!important;background-size:20px 20px,20px 20px,auto!important}
@keyframes pp-float{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-8px) rotate(1deg)}}
.pp-tap{animation:pp-blink 1.6s ease-in-out infinite}@keyframes pp-blink{50%{opacity:.35}}
@keyframes shg-pp-open{from{opacity:0;transform:perspective(1200px) rotateY(-70deg);transform-origin:left center}to{opacity:1;transform:none;transform-origin:left center}}
@keyframes pp-glow{0%,100%{filter:drop-shadow(0 0 6px rgba(232,184,112,.55))}50%{filter:drop-shadow(0 0 18px rgba(44,183,167,.7))}}
.pp-earned{animation:pp-earned 3s ease-in-out infinite}@keyframes pp-earned{0%,100%{filter:drop-shadow(0 0 3px rgba(232,184,112,.5))}50%{filter:drop-shadow(0 0 10px rgba(191,165,216,.9)) drop-shadow(0 0 16px rgba(44,183,167,.5))}}
@media(prefers-reduced-motion:reduce){[aria-label="Goddess Passport"] *{animation:none!important}}`}</style>
    </div>
  );
}
