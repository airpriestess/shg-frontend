import { useState } from "react";
import { T } from "../design/tokens.js";
import { Btn, Card, Pill, StatCard, EmptyState, WaveForm, LockCard, Label } from "../components/UI.jsx";
import { AUDIOS } from "../data/sample.js";

const CAT_COLORS = { Money: "champagne", Beauty: "rose", Love: "blood", Identity: "muted", Sleep: "muted", Body: "rose", Career: "muted" };

export default function AudioVault({ userTier, onCreateThread, onPlayAudio, playingId, onUpgrade }) {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const cats = ["All", "Money", "Beauty", "Love", "Identity", "Sleep", "Body"];
  const filtered = AUDIOS.filter(a =>
    (filter === "All" || a.category === filter) &&
    (!search || a.title.toLowerCase().includes(search.toLowerCase()))
  );
  const sel = AUDIOS.find(a => a.id === selected);
  const canPlay = a => !a.isLocked || userTier === "goddess" || userTier === "founder";

  return (
    <div style={{ display: "flex", height: "100%", minHeight: 0 }}>
      {/* MAIN */}
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 24px", minWidth: 0 }} className="mob-pb">

        {/* Hero */}
        <div style={{ position: "relative", background: T.premiumCard, border: T.border, borderRadius: 18, padding: "32px 32px 28px", marginBottom: 24, overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "50%", left: "60%", transform: "translate(-50%,-50%)", width: 400, height: 400, background: `radial-gradient(circle, rgba(185,130,142,0.08) 0%, transparent 70%)`, borderRadius: "50%", pointerEvents: "none" }} />
          {/* soft waveform BG */}
          <div style={{ position: "absolute", bottom: 16, right: 32, opacity: 0.15 }}>
            <WaveForm playing color={T.champagne} />
          </div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: T.rose, marginBottom: 10 }}>Self Hypnosis Goddess</div>
            <h1 className="wm" style={{ fontSize: "clamp(32px,4vw,48px)", color: T.textPrimary, marginBottom: 10, lineHeight: 1.1 }}>Audio Vault</h1>
            <p style={{ fontSize: 15, color: T.textMuted, lineHeight: 1.7, maxWidth: 480, marginBottom: 24 }}>
              Choose the hypnosis audio you are working with, link it to a Proof Thread, and capture the photo or voice proof that follows.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Btn onClick={onCreateThread} variant="champagne" size="sm">+ Create Proof Thread</Btn>
              {playingId && <Btn variant="ghost" size="sm" onClick={() => {}}>▶ Continue Listening</Btn>}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
          <StatCard icon="🎧" value={AUDIOS.filter(a => canPlay(a)).length} label="Audios Unlocked" sub="3 new this week" color={T.champagne} />
          <StatCard icon="🧵" value={AUDIOS.reduce((s, a) => s + a.linkedProofThreadCount, 0)} label="Active Proof Threads" sub="2 showing evidence" color={T.rose} />
          <StatCard icon="✦" value={AUDIOS.reduce((s, a) => s + a.manifestedCount, 0)} label="Manifested Results" sub="Final proof captured" color={T.success} />
          <StatCard icon="🔥" value="14d" label="Listening Streak" sub="Current ritual active" color={T.warning} />
        </div>

        {/* Search + Filter */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search audios..." style={{ flex: 1, minWidth: 180 }} />
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
            {cats.map(c => (
              <button key={c} onClick={() => setFilter(c)} style={{ padding: "8px 16px", borderRadius: 20, border: `1.5px solid ${filter === c ? T.champagne + "88" : "rgba(215,185,130,0.14)"}`, background: filter === c ? "rgba(215,185,130,0.1)" : "transparent", color: filter === c ? T.champagne : T.textMuted, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", minHeight: 36 }}>{c}</button>
            ))}
          </div>
        </div>

        {/* Audio Grid */}
        {filtered.length === 0 && <EmptyState icon="🎧" title="No audios found" body="Try a different search or category." />}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(a => (
            <AudioCard key={a.id} audio={a} isSelected={selected === a.id} isPlaying={playingId === a.id}
              canPlay={canPlay(a)} onSelect={() => setSelected(selected === a.id ? null : a.id)}
              onPlay={() => canPlay(a) && onPlayAudio(a)} onCreateThread={() => onCreateThread(a.id)}
              onUpgrade={onUpgrade} />
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="hide-mob" style={{ width: 340, borderLeft: "1px solid rgba(215,185,130,0.08)", background: "rgba(23,9,18,0.5)", overflowY: "auto", padding: "24px 20px", flexShrink: 0 }}>
        {!sel ? (
          <EmptyState icon="◈" title="Select an audio" body="Select an audio to see its Proof Threads, receipts, and listening history." />
        ) : (
          <SelectedAudioPanel audio={sel} onCreateThread={onCreateThread} onPlay={() => onPlayAudio(sel)} isPlaying={playingId === sel.id} canPlay={canPlay(sel)} onUpgrade={onUpgrade} />
        )}
      </div>
    </div>
  );
}

function AudioCard({ audio: a, isSelected, isPlaying, canPlay, onSelect, onPlay, onCreateThread, onUpgrade }) {
  const catColor = CAT_COLORS[a.category] || "muted";
  return (
    <div onClick={onSelect} style={{
      background: isSelected ? "rgba(42,18,33,0.95)" : T.cardBg,
      border: `1px solid ${isSelected ? "rgba(215,185,130,0.3)" : "rgba(215,185,130,0.14)"}`,
      borderRadius: 14, padding: "16px 18px", cursor: "pointer",
      transition: "all 0.2s",
      boxShadow: isSelected ? "0 0 30px rgba(185,130,142,0.1)" : T.glow,
      opacity: a.isLocked && !canPlay ? 0.7 : 1,
    }}>
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <Pill color={catColor}>{a.category}</Pill>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {a.isFeatured && <Pill color="champagne">Featured</Pill>}
          {a.isLocked ? <Pill color="muted">🔒 Goddess</Pill> : null}
        </div>
      </div>

      {/* Title */}
      <div style={{ fontSize: 16, fontWeight: 700, color: T.textPrimary, marginBottom: 6, lineHeight: 1.35 }}>
        {a.isLocked && !canPlay && <span style={{ opacity: 0.4 }}>🔒 </span>}
        {a.title}
      </div>

      {/* Metadata */}
      <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
        {[a.frequency, a.audioType, a.duration].map((m, i) => (
          <span key={i} style={{ fontSize: 12, color: T.textMuted }}>{m}</span>
        ))}
      </div>

      {/* Proof stats */}
      {(a.linkedProofThreadCount > 0 || a.manifestedCount > 0) && (
        <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
          {a.linkedProofThreadCount > 0 && <span style={{ fontSize: 12, color: T.rose }}>🧵 {a.linkedProofThreadCount} thread{a.linkedProofThreadCount !== 1 ? "s" : ""}</span>}
          {a.manifestedCount > 0 && <span style={{ fontSize: 12, color: T.success }}>✦ {a.manifestedCount} manifested</span>}
          {a.lastProofAt && <span style={{ fontSize: 12, color: T.textFaint }}>Last proof {a.lastProofAt}</span>}
        </div>
      )}

      {/* Playing indicator */}
      {isPlaying && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <WaveForm playing color={T.champagne} />
          <span style={{ fontSize: 12, color: T.champagne, fontWeight: 600 }}>Now playing</span>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }} onClick={e => e.stopPropagation()}>
        {canPlay ? (
          <>
            <Btn size="sm" variant={isPlaying ? "soft" : "primary"} onClick={onPlay}>{isPlaying ? "⏸ Pause" : "▶ Play"}</Btn>
            <Btn size="sm" variant="ghost" onClick={() => onCreateThread(a.id)}>+ Proof Thread</Btn>
          </>
        ) : (
          <Btn size="sm" variant="champagne" onClick={onUpgrade}>Unlock Goddess Vault</Btn>
        )}
      </div>
    </div>
  );
}

function SelectedAudioPanel({ audio: a, onCreateThread, onPlay, isPlaying, canPlay, onUpgrade }) {
  const PROOF_THREADS = [
    { id:1, linkedAudioId:1, intentionTitle:"I receive €5,000 from an unexpected source", status:"Evidence Appearing", daysActive:9, proofEntryCount:4 },
    { id:2, linkedAudioId:2, intentionTitle:"My skin looks clear, smooth, and luminous", status:"Manifested", daysActive:21, proofEntryCount:6 },
    { id:3, linkedAudioId:3, intentionTitle:"He sends me a loving message and asks to see me", status:"Active", daysActive:5, proofEntryCount:2 },
  ];
  const linked = PROOF_THREADS.filter(t => t.linkedAudioId === a.id);
  return (
    <div className="fade">
      <div style={{ marginBottom: 20 }}>
        <Label style={{ marginBottom: 10 }}>Selected Audio</Label>
        <div style={{ fontSize: 18, fontWeight: 700, color: T.textPrimary, marginBottom: 6, lineHeight: 1.35 }}>{a.title}</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          <Pill color={CAT_COLORS[a.category] || "muted"}>{a.category}</Pill>
          <Pill color="muted">{a.frequency}</Pill>
          <Pill color="muted">{a.duration}</Pill>
        </div>
        <p style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.7, marginBottom: 16 }}>{a.description}</p>

        {a.lastListenedAt && (
          <div style={{ fontSize: 12, color: T.textFaint, marginBottom: 16 }}>Last listened: {a.lastListenedAt}</div>
        )}

        <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
          {canPlay ? (
            <Btn size="sm" full variant={isPlaying ? "soft" : "primary"} onClick={onPlay}>{isPlaying ? "⏸ Pause" : "▶ Play"}</Btn>
          ) : (
            <Btn size="sm" full variant="champagne" onClick={onUpgrade}>Unlock Goddess Vault</Btn>
          )}
        </div>
        <Btn size="sm" full variant="ghost" onClick={() => onCreateThread(a.id)}>+ Create Proof Thread</Btn>
      </div>

      <div style={{ height: 1, background: "rgba(215,185,130,0.08)", margin: "20px 0" }} />

      <div>
        <Label style={{ marginBottom: 12 }}>Linked Proof Threads ({linked.length})</Label>
        {linked.length === 0 ? (
          <div style={{ fontSize: 13, color: T.textFaint, lineHeight: 1.7 }}>No Proof Threads yet. Start one from this audio and let your receipts build.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {linked.slice(0, 3).map(t => (
              <Card key={t.id} style={{ padding: "12px 14px" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.textSecondary, marginBottom: 5, lineHeight: 1.4 }}>{t.intentionTitle}</div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Pill color={t.status === "Manifested" ? "success" : t.status === "Evidence Appearing" ? "champagne" : "muted"}>{t.status}</Pill>
                  <span style={{ fontSize: 11, color: T.textFaint }}>{t.daysActive}d active</span>
                  <span style={{ fontSize: 11, color: T.textFaint }}>📎 {t.proofEntryCount} proof</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


