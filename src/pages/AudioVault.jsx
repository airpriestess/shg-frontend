import { useState } from "react";
import { T } from "../design/tokens.js";
import { Btn, Card, Pill, WaveForm, LockCard, Label, EmptyState } from "../components/UI.jsx";
import { AUDIOS, PROOF_THREADS } from "../data/sample.js";

const CAT_COLOR = {
  Money: "#C8A050", Beauty: "#C8956A", Love: "#C8956A",
  Identity: "#c8a870", Sleep: "#6a8ad0", Body: "#C8A050",
};

const FORMAT_SHORT = {
  "Spoken Hypnosis": "Hypnosis",
  "Subliminal": "Subliminal",
  "Sleep Subliminal": "Sleep",
  "EMDR Hypnosis": "EMDR",
  "Binaural Audio": "Binaural",
  "Hybrid": "Hybrid",
};

function AccessBadge({ audio, userTier }) {
  const canAccess = !audio.isLocked || userTier === "goddess" || userTier === "founder";
  if (userTier === "founder") return <span style={{ fontSize: 10, padding: "2px 8px", background: "#C8A05022", border: "1px solid #C8A05044", borderRadius: 20, color: "#C8A050", fontWeight: 700 }}>Founder</span>;
  if (audio.isLocked && !canAccess) return <span style={{ fontSize: 10, padding: "2px 8px", background: "#1e1c0a", border: "1px solid #504020", borderRadius: 20, color: T.textMuted, fontWeight: 700 }}>🔒 Goddess</span>;
  if (audio.isLocked && canAccess) return <span style={{ fontSize: 10, padding: "2px 8px", background: "#C8956A22", border: "1px solid #C8956A44", borderRadius: 20, color: "#C8956A", fontWeight: 700 }}>Goddess</span>;
  return <span style={{ fontSize: 10, padding: "2px 8px", background: "#C8A05018", border: "1px solid #C8A05033", borderRadius: 20, color: "#C8A050", fontWeight: 700 }}>Audio Tier</span>;
}

export default function AudioVault({ userTier, onCreateThread, onPlayAudio, playingId, onUpgrade }) {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const cats = ["All", "Money", "Beauty", "Love", "Identity", "Sleep", "Body"];
  const canPlay = a => !a.isLocked || userTier === "goddess" || userTier === "founder";

  // Deduplicate by id, then filter
  const seen = new Set();
  const filtered = AUDIOS
    .filter(a => { if (seen.has(a.id)) return false; seen.add(a.id); return true; })
    .filter(a =>
      (filter === "All" || a.category === filter) &&
      (!search || a.title.toLowerCase().includes(search.toLowerCase()))
    );

  const unlockedCount = AUDIOS.filter(a => canPlay(a)).length;
  const totalThreads = PROOF_THREADS.length;
  const totalManifested = PROOF_THREADS.filter(t => t.status === "Manifested").length;

  const sel = AUDIOS.find(a => a.id === selected);

  return (
    <div style={{ display: "flex", height: "100%", minHeight: 0 }}>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px", minWidth: 0 }} className="mob-pb">

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "#C8956A", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>Self Hypnosis Goddess</div>
          <h1 className="wm" style={{ fontSize: "clamp(28px,4vw,42px)", color: T.textPrimary, marginBottom: 8, lineHeight: 1.1 }}>Your Audio Vault</h1>
          <p style={{ fontSize: 14, color: T.textMuted, lineHeight: 1.7, maxWidth: 520, marginBottom: 16 }}>
            Choose the audio you are working with. Link it to a Proof Thread. Capture what follows.
          </p>
          <p style={{ fontSize: 12, color: T.textFaint, lineHeight: 1.6, maxWidth: 480, marginBottom: 20 }}>
            Your vault grows as new audios are released. Each audio can be linked to an active intention inside ProofOS.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Btn onClick={onCreateThread} variant="champagne" size="sm">+ New Intention</Btn>
            {playingId && <Btn variant="ghost" size="sm">▶ Continue Listening</Btn>}
          </div>
        </div>

        {/* Stats */}
        <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 20 }}>
          {[
            { v: unlockedCount, l: "Audios Unlocked", c: "#C8A050" },
            { v: totalThreads, l: "Active Intentions", c: "#C8956A" },
            { v: totalManifested, l: "Manifested", c: "#4a9a5a" },
            { v: "14d", l: "Listening Streak", c: "#C8A050" },
          ].map((s, i) => (
            <div key={i} style={{ background: "#0a0800", border: "1px solid #1e1c0a", borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.c, lineHeight: 1, marginBottom: 4 }}>{s.v}</div>
              <div style={{ fontSize: 11, color: T.textMuted }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Search + filter */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search your vault..."
            style={{ flex: 1, minWidth: 160 }}
          />
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {cats.map(c => (
              <button key={c} onClick={() => setFilter(c)} style={{
                padding: "7px 14px", borderRadius: 20, minHeight: 36,
                border: `1.5px solid ${filter === c ? "#C8956A88" : "#1e1c0a"}`,
                background: filter === c ? "#C8956A18" : "transparent",
                color: filter === c ? "#C8956A" : T.textMuted,
                fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
              }}>{c}</button>
            ))}
          </div>
        </div>

        {/* Audio list */}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: T.textMuted }}>No audios found.</div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(a => (
            <AudioCard
              key={a.id} audio={a}
              isSelected={selected === a.id}
              isPlaying={playingId === a.id}
              canPlay={canPlay(a)}
              userTier={userTier}
              onSelect={() => setSelected(selected === a.id ? null : a.id)}
              onPlay={() => canPlay(a) && onPlayAudio(a)}
              onCreateThread={() => onCreateThread(a.id)}
              onUpgrade={onUpgrade}
            />
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="hide-mob" style={{ width: 320, borderLeft: "1px solid #1e1c0a", background: "#060400", overflowY: "auto", padding: "24px 18px", flexShrink: 0 }}>
        {!sel ? (
          <div style={{ padding: "60px 0", textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 12, opacity: 0.3 }}>◈</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary, marginBottom: 8 }}>Select an audio</div>
            <div style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.65 }}>Select an audio to see its Proof Threads, receipts, and listening history.</div>
          </div>
        ) : (
          <SelectedPanel audio={sel} userTier={userTier} onCreateThread={onCreateThread} onPlay={() => onPlayAudio(sel)} isPlaying={playingId === sel.id} canPlay={canPlay(sel)} onUpgrade={onUpgrade} />
        )}
      </div>
    </div>
  );
}

function AudioCard({ audio: a, isSelected, isPlaying, canPlay, userTier, onSelect, onPlay, onCreateThread, onUpgrade }) {
  const linked = PROOF_THREADS.filter(t => t.linkedAudioId === a.id);
  const catCol = CAT_COLOR[a.category] || "#c8a870";

  return (
    <div onClick={onSelect} style={{
      background: isSelected ? "#0f0b02" : "#0a0800",
      border: `1px solid ${isSelected ? "#C8A05066" : "#1e1c0a"}`,
      borderRadius: 14, padding: "16px 18px", cursor: "pointer",
      transition: "border-color 0.2s",
      opacity: a.isLocked && !canPlay ? 0.65 : 1,
    }}
      onMouseEnter={e => !isSelected && (e.currentTarget.style.borderColor = "#504020")}
      onMouseLeave={e => !isSelected && (e.currentTarget.style.borderColor = "#1e1c0a")}
    >
      {/* Row 1 — title + access badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T.textPrimary, lineHeight: 1.3, flex: 1 }}>
          {a.isLocked && !canPlay && <span style={{ opacity: 0.35 }}>🔒 </span>}
          {a.title}
        </div>
        <AccessBadge audio={a} userTier={userTier} />
      </div>

      {/* Row 2 — category + formats */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10, alignItems: "center" }}>
        <span style={{ fontSize: 11, padding: "2px 8px", background: catCol + "22", border: `1px solid ${catCol}44`, borderRadius: 20, color: catCol, fontWeight: 700 }}>{a.category}</span>
        {(a.audioFormats || []).map((f, i) => (
          <span key={i} style={{ fontSize: 11, color: T.textFaint, fontWeight: 500 }}>{FORMAT_SHORT[f] || f}{i < a.audioFormats.length - 1 ? " ·" : ""}</span>
        ))}
        {a.frequency && <span style={{ fontSize: 11, color: T.textFaint }}>· {a.frequency}</span>}
      </div>

      {/* Row 3 — proof stats */}
      {(linked.length > 0 || a.manifestedCount > 0) && (
        <div style={{ display: "flex", gap: 14, marginBottom: 12, flexWrap: "wrap" }}>
          {linked.length > 0 && <span style={{ fontSize: 12, color: "#C8956A" }}>🧵 {linked.length} intention{linked.length !== 1 ? "s" : ""}</span>}
          {a.manifestedCount > 0 && <span style={{ fontSize: 12, color: "#4a9a5a" }}>✦ {a.manifestedCount} manifested</span>}
          {a.lastProofAt && <span style={{ fontSize: 12, color: T.textFaint }}>Last proof {a.lastProofAt}</span>}
        </div>
      )}

      {/* Row 4 — last listened */}
      {a.lastListenedAt && (
        <div style={{ fontSize: 11, color: T.textFaint, marginBottom: 12 }}>Last listened {a.lastListenedAt}</div>
      )}

      {/* Playing indicator */}
      {isPlaying && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
            {[6, 14, 20, 10, 16].map((h, j) => (
              <div key={j} style={{ width: 2, height: h, borderRadius: 1, background: "#C8A050", opacity: 0.8 }} />
            ))}
          </div>
          <span style={{ fontSize: 12, color: "#C8A050", fontWeight: 600 }}>Now playing</span>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }} onClick={e => e.stopPropagation()}>
        {canPlay ? (
          <>
            <Btn size="sm" variant={isPlaying ? "soft" : "primary"} onClick={onPlay}>
              {isPlaying ? "⏸ Pause" : "▶ Play"}
            </Btn>
            <Btn size="sm" variant="ghost" onClick={() => onCreateThread(a.id)}>+ Intention</Btn>
            {linked.length > 0 && (
              <Btn size="sm" variant="soft">View Proof ({linked.length})</Btn>
            )}
          </>
        ) : (
          <Btn size="sm" variant="champagne" onClick={onUpgrade}>Unlock Goddess Vault</Btn>
        )}
      </div>
    </div>
  );
}

function SelectedPanel({ audio: a, userTier, onCreateThread, onPlay, isPlaying, canPlay, onUpgrade }) {
  const linked = PROOF_THREADS.filter(t => t.linkedAudioId === a.id);
  const manifested = linked.filter(t => t.status === "Manifested");
  const catCol = CAT_COLOR[a.category] || "#c8a870";

  return (
    <div className="fade">
      {/* Title + badges */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: T.textFaint, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>Selected Audio</div>
        <div style={{ fontSize: 17, fontWeight: 700, color: T.textPrimary, lineHeight: 1.3, marginBottom: 10 }}>{a.title}</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          <span style={{ fontSize: 11, padding: "2px 8px", background: catCol + "22", border: `1px solid ${catCol}44`, borderRadius: 20, color: catCol, fontWeight: 700 }}>{a.category}</span>
          <AccessBadge audio={a} userTier={userTier} />
          {a.frequency && <span style={{ fontSize: 11, padding: "2px 7px", background: "#1e1c0a", borderRadius: 20, color: T.textMuted }}>{a.frequency}</span>}
        </div>

        {/* Formats */}
        {(a.audioFormats || []).length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: T.textFaint, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Ritual Type</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {a.audioFormats.map((f, i) => (
                <span key={i} style={{ fontSize: 12, padding: "3px 10px", background: "#0f0b02", border: "1px solid #1e1c0a", borderRadius: 20, color: T.textMuted }}>{f}</span>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <p style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.7, marginBottom: 14 }}>{a.description}</p>

        {a.lastListenedAt && (
          <div style={{ fontSize: 12, color: T.textFaint, marginBottom: 14 }}>Last listened · {a.lastListenedAt}</div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {canPlay ? (
          <Btn full size="sm" variant={isPlaying ? "soft" : "primary"} onClick={onPlay}>
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </Btn>
        ) : (
          <Btn full size="sm" variant="champagne" onClick={onUpgrade}>Unlock Goddess Vault</Btn>
        )}
        <Btn full size="sm" variant="ghost" onClick={() => onCreateThread(a.id)}>+ Create Intention</Btn>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#1e1c0a", margin: "0 0 18px" }} />

      {/* Linked proof threads */}
      <div>
        <div style={{ fontSize: 11, color: T.textFaint, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
          Linked Intentions · {linked.length}
        </div>

        {linked.length === 0 ? (
          <div style={{ fontSize: 13, color: T.textFaint, lineHeight: 1.7 }}>
            No intentions linked yet. Start one from this audio and let your proof build.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {linked.map(t => {
              const statusColor = t.status === "Manifested" ? "#4a9a5a" : t.status === "Evidence Appearing" ? "#C8A050" : T.textMuted;
              return (
                <div key={t.id} style={{ background: "#0a0800", border: "1px solid #1e1c0a", borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary, marginBottom: 6, lineHeight: 1.35 }}>{t.intentionTitle}</div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: t.mood_before ? 8 : 0 }}>
                    <span style={{ fontSize: 11, color: statusColor, fontWeight: 700 }}>{t.status}</span>
                    <span style={{ fontSize: 11, color: T.textFaint }}>{t.daysActive}d</span>
                    {t.photoProofCount > 0 && <span style={{ fontSize: 11, color: T.textFaint }}>📷 {t.photoProofCount}</span>}
                    {t.voiceProofCount > 0 && <span style={{ fontSize: 11, color: T.textFaint }}>🎙 {t.voiceProofCount}</span>}
                  </div>
                  {t.mood_before && t.mood_after && (
                    <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 4 }}>
                      <span style={{ fontSize: 10, padding: "2px 7px", background: "#0a0a0a", border: "1px solid #1e1c0a", borderRadius: 20, color: T.textFaint }}>{t.mood_before}</span>
                      <span style={{ fontSize: 10, color: T.textFaint }}>→</span>
                      <span style={{ fontSize: 10, padding: "2px 7px", background: "#C8A05018", border: "1px solid #C8A05033", borderRadius: 20, color: "#C8A050" }}>{t.mood_after}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Manifested summary */}
        {manifested.length > 0 && (
          <div style={{ marginTop: 14, padding: "10px 14px", background: "#0a1a0a", border: "1px solid #2a4a2a55", borderRadius: 10 }}>
            <div style={{ fontSize: 12, color: "#4a9a5a", fontWeight: 700 }}>✦ {manifested.length} manifested from this audio</div>
          </div>
        )}
      </div>
    </div>
  );
}
