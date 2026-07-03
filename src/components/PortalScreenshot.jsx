// Static pixel-perfect App Store-style screenshot of the SHG Spotify portal
// Renders as a phone mockup showing the actual Home tab

const R = "#B76E79", P = "#d4a090", CR = "#f2ece4", MU = "#a0a0a0", SP = "#121212", SP3 = "#282828";

export default function PortalScreenshot({ width = 390, scale = 1 }) {
  const h = Math.round(width * 2.16); // iPhone 16 Pro aspect ratio

  const tracks = [
    { t: "Spoilt Goddess", c: "#c87890" },
    { t: "He Finds His Way Back", c: "#7890c8" },
    { t: "Money Finds Me First", c: "#78c890" },
    { t: "While I Sleep I Manifest", c: "#9078c8" },
    { t: "Gorgeous Is My Default", c: "#c8a078" },
    { t: "Lucky Girl Summer", c: "#c8d478" },
  ];

  const nowPlaying = { t: "Spoilt Goddess", c: "#c87890" };

  return (
    <div style={{ width, transform: `scale(${scale})`, transformOrigin: "top center", background: SP, borderRadius: 44, overflow: "hidden", fontFamily: "'Jost',sans-serif", position: "relative", height: h }}>

      {/* Status bar */}
      <div style={{ height: 44, display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 24px 6px", background: SP }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: CR }}>9:41</span>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          <span style={{ fontSize: 10, color: CR }}>●●●</span>
          <span style={{ fontSize: 10, color: CR }}>▲</span>
          <span style={{ fontSize: 10, color: CR }}>100%</span>
        </div>
      </div>

      {/* Notch */}
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 120, height: 36, background: SP, borderRadius: "0 0 20px 20px", zIndex: 50 }}/>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px 8px" }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: CR }}>Good evening, Goddess</div>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg,${P},${R})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: "#000" }}>R</div>
      </div>

      {/* Recently played — 2×3 grid */}
      <div style={{ padding: "6px 12px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {tracks.map((t, i) => (
          <div key={i} style={{ background: SP3, borderRadius: 6, display: "flex", alignItems: "center", gap: 0, overflow: "hidden", height: 48 }}>
            <div style={{ width: 48, height: 48, background: `linear-gradient(135deg,${t.c},${t.c}88)`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✦</div>
            <span style={{ fontSize: 11, fontWeight: 700, color: CR, lineHeight: 1.2, padding: "0 10px" }}>{t.t}</span>
          </div>
        ))}
      </div>

      {/* Jump back in */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px 10px" }}>
        <span style={{ fontSize: 16, fontWeight: 800, color: CR }}>Jump back in</span>
        <span style={{ fontSize: 11, color: MU }}>Show all</span>
      </div>
      <div style={{ display: "flex", gap: 12, padding: "0 20px 20px", overflowX: "hidden" }}>
        {[{ c: "#c87890", t: "Spoilt Goddess" }, { c: "#78c890", t: "Money Finds Me" }, { c: "#9078c8", t: "DNA Activation" }].map((t, i) => (
          <div key={i} style={{ flexShrink: 0, width: 110 }}>
            <div style={{ width: 110, height: 110, borderRadius: 8, background: `linear-gradient(135deg,${t.c},${t.c}66)`, marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, position: "relative" }}>
              <span>✦</span>
              {i === 0 && (
                <div style={{ position: "absolute", bottom: 6, right: 6, width: 28, height: 28, borderRadius: "50%", background: CR, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: "9px solid #000", marginLeft: 2 }}/>
                </div>
              )}
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: CR, marginBottom: 2 }}>{t.t}</div>
            <div style={{ fontSize: 10, color: MU }}>Reshma Oracle</div>
          </div>
        ))}
      </div>

      {/* ProofOS peek */}
      <div style={{ margin: "0 16px 16px", background: "#1a1a1a", borderRadius: 12, padding: "14px 16px", border: `1px solid ${R}33` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: CR }}>ProofOS ✦</span>
          <span style={{ fontSize: 11, color: R, fontWeight: 600 }}>3 active</span>
        </div>
        {[["He texts me first", "14d", true], ["£5k arrives", "6d", false]].map(([d, days, done], i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: i === 0 ? "0.5px solid #2a2a2a" : "none" }}>
            <span style={{ fontSize: 12, color: done ? "#c8c0bc" : CR }}>{d}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: MU }}>{days}</span>
              <span style={{ fontSize: 10, padding: "2px 8px", background: done ? "#1a3a1a" : `${R}18`, color: done ? "#5ab06a" : R, borderRadius: 10, fontWeight: 700 }}>{done ? "✓ done" : "active"}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Now playing bar */}
      <div style={{ position: "absolute", bottom: 60, left: 8, right: 8, background: "#242424", borderRadius: 10, padding: "8px 12px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: 6, background: `linear-gradient(135deg,${nowPlaying.c},${nowPlaying.c}66)`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✦</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: CR, marginBottom: 1 }}>{nowPlaying.t}</div>
          <div style={{ fontSize: 11, color: MU }}>Reshma Oracle</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={R} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: CR, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#000"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "#333", borderRadius: "0 0 10px 10px" }}>
          <div style={{ width: "42%", height: "100%", background: CR, borderRadius: "0 0 0 10px" }}/>
        </div>
      </div>

      {/* Bottom nav */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, background: "#0a0a0a", borderTop: "0.5px solid #2a2a2a", display: "flex" }}>
        {[
          { label: "Home", active: true, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill={CR}><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"/></svg> },
          { label: "Library", active: false, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="#636363"><path d="M3 3h4v18H3zM9 3h2v18H9zM14 3l7 2.5v13L14 21z"/></svg> },
          { label: "ProofOS", active: false, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#636363" strokeWidth="2" strokeLinecap="round"><path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h9"/></svg> },
          { label: "You", active: false, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="#636363"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg> },
        ].map((n, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, paddingBottom: 4 }}>
            {n.icon}
            <span style={{ fontSize: 9, fontWeight: 600, color: n.active ? CR : "#636363", letterSpacing: "0.04em" }}>{n.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
