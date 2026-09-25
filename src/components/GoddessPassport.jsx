import { useEffect, useState } from "react";

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
    <svg viewBox="0 0 200 200" role="img" aria-label={`${s.top} ${mid} ${s.bottom}`} style={{ width: "100%", display: "block", transform: `rotate(${s.earned ? [-8, 6, -3, 9, -6, 4][i % 6] : 0}deg)`, opacity: s.earned ? 1 : 0.35 }}>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E8B870" /><stop offset=".45" stopColor="#BFA5D8" /><stop offset=".8" stopColor="#2CB7A7" /><stop offset="1" stopColor="#167A6B" />
        </linearGradient>
        <filter id={`${id}f`}>
          <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed={i + 3} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" result="d" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.7" result="m" />
          <feComposite in="d" in2="m" operator="in" />
        </filter>
        <path id={`${id}t`} d="M 30 100 A 70 70 0 0 1 170 100" />
        <path id={`${id}b`} d="M 26 100 A 74 74 0 0 0 174 100" />
      </defs>
      <g filter={s.earned ? `url(#${id}f)` : undefined} fill="none" stroke={ink} strokeDasharray={s.earned ? undefined : "4 5"}>
        <circle cx="100" cy="100" r="94" strokeWidth="4" />
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

export default function GoddessPassport({ onClose, userId, firstName, email, threads = [], listenCount = 0, isPreview, tierLabel, isDark, actions }) {
  const key = `shg_passport_${userId || (isPreview ? "preview" : "guest")}`;
  const [p, setP] = useState(() => load(key) || (isPreview
    ? { name: "Reshma", goddessName: "The Lucky One", colours: ["#F5E0A0", "#BFA5D8", "#2CB7A7", "#000000"], words: ["chosen", "magnetic", "abundant", "soft"], belief: "Everything is always working out for me.", photo: null, entered: "2026-09-25" }
    : { name: firstName && firstName !== "you" ? firstName : "", goddessName: "", colours: [], words: [], belief: "", photo: null, entered: new Date().toISOString().slice(0, 10) }));
  const [opened, setOpened] = useState(false);
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState(false);
  const [customWord, setCustomWord] = useState("");

  useEffect(() => { store(key, p); }, [key, p]);
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

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
    { top: "ENTERED", mid: "The Portal", bottom: enteredLabel.toUpperCase(), earned: true },
    { top: "PASSPORT", mid: "Built", bottom: "IDENTITY", earned: !!(p.goddessName && p.words.length && p.colours.length) },
    { top: "FIRST", mid: "Intention", bottom: "WRITTEN", earned: threads.length > 0 },
    { top: "FIRST SIGN", mid: "Logged", bottom: `${signs} SO FAR`, earned: signs > 0 },
    { top: "LISTENED", mid: "10 times", bottom: "RITUAL", earned: listenCount >= 10 },
    { top: "LISTENED", mid: "100 times", bottom: "DEVOTION", earned: listenCount >= 100 },
    ...arrived.slice(0, 6).map((t) => ({ top: "ARRIVED", mid: t.desire, bottom: t.days ? `${t.days} DAYS` : "WITH PROOF", earned: true })),
    { top: "NEXT", mid: "Arrival", bottom: "LOCKED", earned: arrived.length > 0 ? null : false },
  ].filter((s) => s.earned !== null);

  const mrz = `P<SHG<${(p.name || "GODDESS").toUpperCase().replace(/[^A-Z]/g, "")}<<${(p.goddessName || "").toUpperCase().replace(/[^A-Z]+/g, "<")}`.padEnd(40, "<").slice(0, 40)
    + "\n" + `${callingIn.toUpperCase().replace(/[^A-Z]+/g, "<")}<<${p.entered.slice(0, 4)}<<PROOF<${String(signs).padStart(3, "0")}`.padEnd(40, "<").slice(0, 40);

  const shell = { position: "fixed", inset: 0, zIndex: 1200, background: "#000", color: "#F2ECE4", overflowY: "auto", fontFamily: "'Futura','Jost',sans-serif" };
  const inner = { maxWidth: 920, margin: "0 auto", padding: "calc(env(safe-area-inset-top,0px) + 18px) 18px 40px" };
  const pill = { border: "none", borderRadius: 999, minHeight: 44, padding: "0 18px", fontSize: 14, fontFamily: "inherit", cursor: "pointer" };
  const field = { width: "100%", boxSizing: "border-box", border: "1px solid #000", borderRadius: 10, padding: "10px 12px", fontSize: 14, fontFamily: "inherit", background: "#fff", color: "#000" };
  const tabs = ["Identity", "Stamps", "Ritual", "Settings"];

  return (
    <div role="dialog" aria-modal="true" aria-label="Goddess Passport" style={shell}>
      <div style={inner}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 10, letterSpacing: ".32em" }}>GODDESS PASSPORT</div>
          <button onClick={onClose} aria-label="Close passport" style={{ ...pill, minHeight: 36, padding: "0 14px", background: "transparent", color: "#F2ECE4", border: "1px solid #F2ECE4" }}>Close</button>
        </div>

        {!opened ? (
          <>
            <button onClick={() => setOpened(true)} aria-label="Open passport" style={{ all: "unset", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22, width: "100%", boxSizing: "border-box", height: "min(560px,68vh)", borderRadius: "14px 26px 26px 14px", border: "1px solid transparent", background: `linear-gradient(#060606,#060606) padding-box,${G} border-box`, textAlign: "center", position: "relative" }}>
              <span style={{ position: "absolute", left: 18, top: 0, bottom: 0, width: 1, background: "#1e1e1e" }} />
              <span style={{ fontSize: 10, letterSpacing: ".32em" }}>SELF HYPNOSIS GODDESS</span>
              <img src="/logo_transparent_cropped.png" alt="" style={{ width: 110, filter: "drop-shadow(-6px -4px 14px rgba(245,224,160,.5)) drop-shadow(6px 6px 16px rgba(44,183,167,.45))" }} />
              <span style={{ fontSize: 24, letterSpacing: ".24em" }}>PASSPORT</span>
              <span style={{ fontSize: 10, letterSpacing: ".32em", background: G, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>UNIVERSE OF RESHMA ORACLE</span>
            </button>
            <button onClick={() => { setOpened(true); if (!p.goddessName) setEditing(true); }} style={{ ...pill, width: "100%", marginTop: 18, background: G, color: "#000", fontWeight: 500 }}>
              {p.goddessName ? "Open my passport" : "Build my passport"}
            </button>
          </>
        ) : (
          <div style={{ animation: "shg-pp-open .5s cubic-bezier(.2,.8,.2,1) both" }}>
            <div role="tablist" style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
              {tabs.map((t, i) => (
                <button key={t} role="tab" aria-selected={page === i} onClick={() => { setPage(i); setEditing(false); }}
                  style={{ ...pill, minHeight: 36, padding: "0 14px", fontSize: 13, background: page === i ? G : "#161616", color: page === i ? "#000" : "#F2ECE4" }}>{t}</button>
              ))}
            </div>

            {page === 0 && (
              <div style={{ ...PAPER, borderRadius: 18, padding: 18 }}>
                <div style={{ display: "flex", gap: 14 }}>
                  <label style={{ width: 108, height: 136, borderRadius: 10, flexShrink: 0, overflow: "hidden", cursor: "pointer", display: "grid", placeItems: "center", background: p.photo ? "#000" : G, fontSize: 11 }}>
                    {p.photo ? <img src={p.photo} alt="Your passport photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "+ Add photo"}
                    <input type="file" accept="image/*" hidden onChange={async (e) => { const f = e.target.files?.[0]; if (f) set({ photo: await toAvatar(f) }); e.target.value = ""; }} />
                  </label>
                  <div style={{ flex: 1, minWidth: 0, display: "grid", gap: 8, alignContent: "start" }}>
                    <div><Label>NAME</Label>{editing ? <input id="pp-name" style={field} value={p.name} onChange={(e) => set({ name: e.target.value })} /> : <div style={{ fontSize: 15 }}>{p.name || "Add your name"}</div>}</div>
                    <div><Label>GODDESS NAME</Label>{editing ? <input id="pp-goddess" style={field} placeholder="The Lucky One" value={p.goddessName} onChange={(e) => set({ goddessName: e.target.value })} /> : <div style={{ fontSize: 15 }}>{p.goddessName || "Choose one"}</div>}</div>
                    <div><Label>CALLING IN</Label><div style={{ fontSize: 14 }}>{callingIn.charAt(0).toUpperCase() + callingIn.slice(1)}</div></div>
                    <div><Label>ENTERED</Label><div style={{ fontSize: 14 }}>{enteredLabel}</div></div>
                  </div>
                </div>

                <div style={{ marginTop: 14 }}><Label>HER COLOURS {editing && "· pick up to 4"}</Label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {(editing ? COLOURS : p.colours).map((c) => (
                      <button key={c} disabled={!editing} onClick={() => toggle("colours", c, 4)} aria-label={`Colour ${c}`} aria-pressed={p.colours.includes(c)}
                        style={{ width: 26, height: 26, borderRadius: "50%", background: c, cursor: editing ? "pointer" : "default", border: "1px solid rgba(0,0,0,.25)", boxShadow: editing && p.colours.includes(c) ? "0 0 0 2px #F2ECE4,0 0 0 3.5px #000" : "none", padding: 0 }} />
                    ))}
                    {!editing && !p.colours.length && <span style={{ fontSize: 13 }}>Not chosen yet</span>}
                  </div>
                </div>

                <div style={{ marginTop: 12 }}><Label>HER WORDS {editing && "· pick up to 5"}</Label>
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

                <div style={{ marginTop: 12 }}><Label>SHE BELIEVES</Label>
                  {editing ? <input id="pp-belief" style={field} placeholder="Everything is always working out for me." value={p.belief} onChange={(e) => set({ belief: e.target.value })} /> : <div style={{ fontSize: 14 }}>{p.belief || "Write your affirmation"}</div>}
                </div>

                <pre style={{ fontFamily: "ui-monospace,Menlo,monospace", fontSize: 10.5, letterSpacing: ".1em", margin: "16px 0 0", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{mrz}</pre>
                <button onClick={() => setEditing(!editing)} style={{ ...pill, width: "100%", marginTop: 14, background: editing ? G : "#000", color: editing ? "#000" : "#F2ECE4" }}>{editing ? "Save my passport" : "Edit my passport"}</button>
              </div>
            )}

            {page === 1 && (
              <div style={{ ...PAPER, borderRadius: 18, padding: 18 }}>
                <Label>EARNED IN THE UNIVERSE · {stamps.filter((s) => s.earned).length}</Label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 18, marginTop: 12 }}>
                  {stamps.map((s, i) => (
                    <div key={i}><Stamp s={s} i={i} /></div>
                  ))}
                </div>
              </div>
            )}

            {page === 2 && (
              <div style={{ ...PAPER, borderRadius: 18, padding: 18, display: "grid", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, textAlign: "center" }}>
                  {[[listenCount, "listens"], [signs, "signs"], [arrived.length, "arrived"]].map(([v, l]) => (
                    <div key={l} style={{ border: "1px solid #000", borderRadius: 12, padding: "10px 4px" }}><div style={{ fontSize: 22 }}>{v}</div><div style={{ fontSize: 11 }}>{l}</div></div>
                  ))}
                </div>
                <div><Label>HOW YOU LISTEN</Label><div style={{ fontSize: 14, lineHeight: 1.6 }}>Headphones on. Never while driving. Avoid if you have epilepsy. Best before sleep or first thing in the morning.</div></div>
                <button onClick={actions.guide} style={{ ...pill, background: "#000", color: "#F2ECE4" }}>Open the listening guide</button>
                <button onClick={actions.liked} style={{ ...pill, background: "transparent", color: "#000", border: "1px solid #000" }}>My favourite tracks</button>
                <button onClick={actions.shop} style={{ ...pill, background: "transparent", color: "#000", border: "1px solid #000" }}>Shop workbooks and guides</button>
              </div>
            )}

            {page === 3 && (
              <div style={{ ...PAPER, borderRadius: 18, padding: 10, display: "grid", gap: 4, color: "#000" }}>
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
      <style>{`[aria-label="Goddess Passport"] input::placeholder{color:#000!important;opacity:.45!important}
@keyframes shg-pp-open{from{opacity:0;transform:perspective(900px) rotateY(-14deg) translateX(-10px)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){[aria-label="Goddess Passport"] *{animation:none!important}}`}</style>
    </div>
  );
}
