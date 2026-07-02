import { T } from "../design/tokens.js";
import { Btn, Card, Pill, ProgressBar, Label } from "../components/UI.jsx";
import { PROOF_THREADS, AUDIOS, USER } from "../data/sample.js";

const STATUS_COLOR = {
  "Active": T.textMuted,
  "Evidence Appearing": "#C8892A",
  "Manifested": "#4a9a5a",
  "Paused": T.textMuted,
};

// Photo proof placeholder — gradient box with label
function PhotoPlaceholder({ label, color = "#C8892A", size = 56, icon = "📷", radius = 8 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: radius, flexShrink: 0,
      background: `linear-gradient(135deg, ${color}18, ${color}08)`,
      border: `1px solid ${color}33`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontSize: size > 48 ? 20 : 14,
    }}>
      {icon}
    </div>
  );
}

// Proof type to icon + color
const PROOF_META = {
  "Photo Proof":        { icon: "📷", color: "#C8892A", label: "Photo Proof" },
  "Voice Proof":        { icon: "🎙", color: "#B76E79", label: "Voice Proof" },
  "Sign":               { icon: "◈",  color: "#C8892A", label: "Sign" },
  "Symptom":            { icon: "◉",  color: "#B76E79", label: "Symptom" },
  "Synchronicity":      { icon: "✦",  color: "#C8892A", label: "Synchronicity" },
  "Partial Proof":      { icon: "◐",  color: "#9a8060", label: "Partial Proof" },
  "Final Manifestation":{ icon: "★",  color: "#4a9a5a", label: "Final Proof" },
};

// Static photo proof cards for the recent grid
const PHOTO_PROOF_CARDS = [
  { id: "p1", type: "Photo Proof", icon: "💰", color: "#C8892A", label: "Bank Notification",  audio: "Money Finds Me First",          thread: "I receive €5,000 unexpectedly",      date: "2026-07-01" },
  { id: "p2", type: "Photo Proof", icon: "💬", color: "#B76E79", label: "Message Screenshot", audio: "He Is Already On His Way Back",   thread: "He sends me a loving message",       date: "2026-06-30" },
  { id: "p3", type: "Photo Proof", icon: "🪞", color: "#B76E79", label: "Mirror Photo",        audio: "Gorgeous Is My Default Setting",  thread: "My skin looks clear and luminous",    date: "2026-06-29" },
  { id: "p4", type: "Sign",        icon: "555", color: "#C8892A", label: "Angel Number",       audio: "Money Finds Me First",          thread: "I receive €5,000 unexpectedly",      date: "2026-06-27" },
  { id: "p5", type: "Photo Proof", icon: "📧", color: "#9a8060", label: "Email Confirmation",  audio: "I Wake Up Chosen",               thread: "He sends me a loving message",       date: "2026-06-26" },
  { id: "p6", type: "Photo Proof", icon: "📅", color: "#6a8ad0", label: "Calendar Invite",     audio: "I Have Always Been The Prize",   thread: "I receive €5,000 unexpectedly",      date: "2026-06-25" },
];

// Timeline of listening results
const TIMELINE = [
  { day: "Day 1", event: "First listen",        detail: "Audio linked to Proof Thread — Money Finds Me First",     type: "audio",  icon: "🎧", hasPhoto: false },
  { day: "Day 2", event: "Voice proof added",   detail: "I felt calmer and more certain about money after listening.", type: "voice",  icon: "🎙", hasPhoto: false },
  { day: "Day 3", event: "Sign noticed",         detail: "Saw 555 three times. A phrase from the audio appeared in real life.", type: "sign",   icon: "◈", hasPhoto: false },
  { day: "Day 5", event: "Photo proof added",    detail: "Screenshot of bank notification captured and linked.",   type: "photo",  icon: "📷", hasPhoto: true },
  { day: "Day 8", event: "Final proof",          detail: "€5,000 received. Manifestation marked complete.",        type: "final",  icon: "★",  hasPhoto: true },
];

export default function Dashboard({ userTier, onNavigate, onAddProof, onCreateThread }) {
  const activeThreads = PROOF_THREADS.filter(t => t.status !== "Manifested");
  const manifested    = PROOF_THREADS.filter(t => t.status === "Manifested");
  const currentAudio  = AUDIOS.find(a => a.lastListenedAt === "2026-07-01");
  const currentThread = PROOF_THREADS.find(t => t.linkedAudioId === currentAudio?.id && t.status !== "Manifested");

  const totalIntentions  = PROOF_THREADS.length;
  const manifestedCount  = manifested.length;
  const avgDays = manifestedCount > 0
    ? Math.round(manifested.reduce((s, t) => s + (t.daysActive || 0), 0) / manifestedCount)
    : null;
  const manifestedRate = totalIntentions > 0 ? Math.round((manifestedCount / totalIntentions) * 100) : 0;
  const storageLimit   = userTier === "founder" ? 25600 : userTier === "goddess" ? 5120 : 1024;
  const storagePct     = Math.round((USER.storageUsedMb / storageLimit) * 100);

  return (
    <div style={{ padding: "24px 20px", overflowY: "auto", height: "100%", maxWidth: 900, margin: "0 auto" }} className="mob-pb fade">

      {/* ① CURRENT RITUAL ─────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: "#B76E79", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>Welcome back, {USER.name}</div>
        <h1 style={{ fontSize: "clamp(19px,3vw,26px)", fontWeight: 700, color: T.textPrimary, marginBottom: 16, lineHeight: 1.3 }}>Your proof is building.</h1>
      </div>

      {currentAudio && (
        <div style={{ background: "#0f0b02", border: "1.5px solid #C8892A44", borderRadius: 16, padding: "18px 20px", marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "#C8892A", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>Current Ritual</div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
            {/* Audio artwork placeholder */}
            <div style={{ width: 56, height: 56, borderRadius: 10, background: "linear-gradient(135deg,#C8892A22,#B76E7922)", border: "1px solid #C8892A44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🎧</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.textPrimary, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentAudio.title}</div>
              {currentThread && (
                <div style={{ fontSize: 13, color: "#C8892A", marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>🧵 {currentThread.intentionTitle}</div>
              )}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: T.textMuted }}>🔥 {USER.listeningStreak} day streak</span>
                <span style={{ fontSize: 12, color: T.textMuted }}>Last: {currentAudio.lastListenedAt}</span>
                {currentThread && (
                  <div style={{ display: "flex", gap: 4 }}>
                    {[...Array(currentThread.photoProofCount)].map((_, i) => (
                      <div key={i} style={{ width: 24, height: 24, borderRadius: 4, background: "#C8892A18", border: "1px solid #C8892A33", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>📷</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <Btn size="sm" variant="primary" onClick={() => onNavigate("audio-vault")}>▶ Resume</Btn>
          </div>
        </div>
      )}

      {/* Quick Capture */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
        <Btn size="sm" variant="champagne" onClick={() => onAddProof("Photo Proof")}>📷 Add Photo Proof</Btn>
        <Btn size="sm" variant="ghost"     onClick={() => onAddProof("Voice Proof")}>🎙 Record Voice Proof</Btn>
        <Btn size="sm" variant="ghost"     onClick={() => onAddProof("Sign")}>◈ Log Sign</Btn>
        <Btn size="sm" variant="ghost"     onClick={onCreateThread}>+ New Intention</Btn>
      </div>

      {/* ② RESULTS TIMELINE ────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: "#B76E79", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 4 }}>Results Timeline</div>
            <div style={{ fontSize: 13, color: T.textMuted }}>First listen to final manifestation.</div>
          </div>
        </div>
        <div style={{ position: "relative" }}>
          {/* Vertical line */}
          <div style={{ position: "absolute", top: 20, bottom: 20, left: 20, width: 1, background: "linear-gradient(180deg,#C8892A44,#B76E7944,#C8892A22)", zIndex: 0 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {TIMELINE.map((item, i) => {
              const col = item.type === "final" ? "#4a9a5a" : item.type === "photo" ? "#C8892A" : item.type === "voice" ? "#B76E79" : "#C8892A";
              return (
                <div key={i} style={{ display: "flex", gap: 14, padding: "12px 0", position: "relative", zIndex: 1 }}>
                  {/* Node */}
                  <div style={{ width: 40, flexShrink: 0, display: "flex", justifyContent: "center", paddingTop: 2 }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: col + "22", border: `1.5px solid ${col}66`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>{item.icon}</div>
                  </div>
                  {/* Content */}
                  <div style={{ flex: 1, background: "#0a0800", border: `1px solid ${col}33`, borderRadius: 12, padding: "12px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                      <div>
                        <span style={{ fontSize: 11, color: col, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>{item.day}</span>
                        <span style={{ fontSize: 11, color: T.textFaint, marginLeft: 8 }}>· {item.event}</span>
                      </div>
                      {item.hasPhoto && (
                        <div style={{ width: 36, height: 36, borderRadius: 6, background: col + "18", border: `1px solid ${col}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                          {item.type === "final" ? "★" : "📷"}
                        </div>
                      )}
                    </div>
                    <div style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.55 }}>{item.detail}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ③ RECENT PHOTO PROOF ──────────────────────────────────────────────── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: "#B76E79", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>Recent Photo Proof</div>
          <button onClick={() => onNavigate("proof-threads")} style={{ background: "none", border: "none", color: "#C8892A", fontSize: 13, cursor: "pointer" }}>View all →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }} className="grid-3">
          {PHOTO_PROOF_CARDS.map(p => (
            <div key={p.id} style={{ background: "#0a0800", border: `1px solid ${p.color}33`, borderRadius: 12, overflow: "hidden" }}>
              {/* Photo placeholder */}
              <div style={{ height: 72, background: `linear-gradient(135deg, ${p.color}18, ${p.color}08)`, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: `1px solid ${p.color}22` }}>
                <span style={{ fontSize: 28 }}>{p.icon}</span>
              </div>
              <div style={{ padding: "10px 12px" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: p.color, marginBottom: 3 }}>{p.label}</div>
                <div style={{ fontSize: 11, color: T.textFaint, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.thread}</div>
                <div style={{ fontSize: 10, color: T.textFaint }}>{p.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ④ ACTIVE PROOF THREADS ────────────────────────────────────────────── */}
      {activeThreads.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: "#B76E79", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>Active Proof Threads</div>
            <button onClick={() => onNavigate("proof-threads")} style={{ background: "none", border: "none", color: "#C8892A", fontSize: 13, cursor: "pointer" }}>Open →</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {activeThreads.map(t => {
              const sc = STATUS_COLOR[t.status] || T.textMuted;
              const photos = t.photoProofCount || 0;
              const voices = t.voiceProofCount || 0;
              return (
                <div key={t.id} style={{ background: "#0a0800", border: `1px solid ${sc}33`, borderRadius: 14, padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: T.textPrimary, marginBottom: 4, lineHeight: 1.3 }}>{t.intentionTitle}</div>
                      <div style={{ fontSize: 12, color: "#C8892A" }}>🎧 {t.linkedAudioTitle}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 11, color: sc, fontWeight: 700 }}>{t.status}</div>
                      <div style={{ fontSize: 11, color: T.textFaint }}>{t.daysActive}d</div>
                    </div>
                  </div>

                  {/* Proof evidence row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      {[...Array(Math.min(photos, 3))].map((_, i) => (
                        <div key={i} style={{ width: 32, height: 32, borderRadius: 6, background: "#C8892A18", border: "1px solid #C8892A33", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>📷</div>
                      ))}
                      {photos > 3 && <div style={{ width: 32, height: 32, borderRadius: 6, background: "#1e1608", border: "1px solid #2a1e08", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: T.textMuted }}>+{photos - 3}</div>}
                    </div>
                    {voices > 0 && <span style={{ fontSize: 12, color: "#B76E79" }}>🎙 {voices}</span>}
                    {t.signCount > 0 && <span style={{ fontSize: 12, color: "#C8892A" }}>◈ {t.signCount} signs</span>}
                    {t.mood_before && t.mood_after && (
                      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                        <span style={{ fontSize: 10, padding: "2px 7px", background: "#0a0a0a", border: "1px solid #1e1608", borderRadius: 20, color: T.textFaint }}>{t.mood_before}</span>
                        <span style={{ fontSize: 10, color: T.textFaint }}>→</span>
                        <span style={{ fontSize: 10, padding: "2px 7px", background: "#C8892A18", border: "1px solid #C8892A33", borderRadius: 20, color: "#C8892A" }}>{t.mood_after}</span>
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn size="sm" variant="ghost" onClick={() => onNavigate("proof-threads")}>Open Thread</Btn>
                    <Btn size="sm" variant="champagne" onClick={() => onAddProof("Photo Proof")}>📷 Add Proof</Btn>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ⑤ RECENT VOICE PROOF ──────────────────────────────────────────────── */}
      {(() => {
        const voiceEntries = PROOF_THREADS.flatMap(t =>
          (t.entries || []).filter(e => e.type === "Voice Proof").map(e => ({ ...e, audioTitle: t.linkedAudioTitle, threadTitle: t.intentionTitle }))
        ).slice(0, 3);
        if (voiceEntries.length === 0) return null;
        return (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: "#B76E79", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14 }}>Recent Voice Proof</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {voiceEntries.map(e => (
                <div key={e.id} style={{ background: "#0a0800", border: "1px solid #B76E7933", borderRadius: 12, padding: "12px 14px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: "#B76E7918", border: "1px solid #B76E7944", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🎙</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.textPrimary, marginBottom: 3 }}>{e.title}</div>
                    <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.description}</div>
                    <div style={{ fontSize: 11, color: T.textFaint }}>🎧 {e.audioTitle} · Day {e.dayNumber}</div>
                  </div>
                  {/* Waveform visual */}
                  <div style={{ display: "flex", gap: 2, alignItems: "center", flexShrink: 0 }}>
                    {[5, 12, 18, 8, 14, 10, 16, 7].map((h, j) => (
                      <div key={j} style={{ width: 2, height: h, borderRadius: 1, background: "#B76E79", opacity: 0.6 }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* ⑥ MANIFESTED THIS MONTH ─────────────────────────────────────────── */}
      {manifested.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: "#B76E79", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>Manifested This Month</div>
            <button onClick={() => onNavigate("archive")} style={{ background: "none", border: "none", color: "#C8892A", fontSize: 13, cursor: "pointer" }}>Archive →</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {manifested.map(t => (
              <div key={t.id} style={{ background: "#0a1a0a", border: "1px solid #2a4a2a55", borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.textPrimary, marginBottom: 3, lineHeight: 1.3 }}>{t.intentionTitle}</div>
                    <div style={{ fontSize: 12, color: "#C8892A" }}>🎧 {t.linkedAudioTitle} · {t.daysActive} days</div>
                  </div>
                  <div style={{ fontSize: 20, color: "#4a9a5a", flexShrink: 0 }}>★</div>
                </div>
                {/* Final proof photo placeholder */}
                <div style={{ display: "flex", gap: 6 }}>
                  {[...Array(Math.min(t.photoProofCount, 4))].map((_, i) => (
                    <div key={i} style={{ width: 40, height: 40, borderRadius: 6, background: "#4a9a5a18", border: "1px solid #4a9a5a44", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                      {i === 0 ? "📷" : i === 1 ? "💰" : i === 2 ? "✉️" : "🪞"}
                    </div>
                  ))}
                  {t.mood_before && t.mood_after && (
                    <div style={{ display: "flex", gap: 4, alignItems: "center", marginLeft: 4 }}>
                      <span style={{ fontSize: 10, padding: "2px 7px", background: "#0a0a0a", border: "1px solid #1e1608", borderRadius: 20, color: T.textFaint }}>{t.mood_before}</span>
                      <span style={{ fontSize: 10, color: T.textFaint }}>→</span>
                      <span style={{ fontSize: 10, padding: "2px 7px", background: "#4a9a5a18", border: "1px solid #4a9a5a44", borderRadius: 20, color: "#4a9a5a" }}>{t.mood_after}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ⑦ STATS + STORAGE ──────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }} className="grid-2">
        {[
          { v: totalIntentions, l: "Intentions logged", c: "#C8892A" },
          { v: manifestedCount, l: "Manifested",        c: "#4a9a5a" },
          { v: avgDays ? `${avgDays}d` : "—", l: "Avg days",     c: "#C8892A" },
          { v: `${manifestedRate}%`, l: "Rate",          c: "#B76E79" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#0a0800", border: "1px solid #1e1608", borderRadius: 12, padding: "14px", textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.c, lineHeight: 1, marginBottom: 4 }}>{s.v}</div>
            <div style={{ fontSize: 11, color: T.textMuted }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Storage */}
      <div style={{ background: "#0a0800", border: "1px solid #1e1608", borderRadius: 12, padding: "14px 18px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: T.textMuted }}>Storage Usage</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#C8892A" }}>{USER.storageUsedMb} MB of {storageLimit} MB</span>
        </div>
        <div style={{ height: 5, background: "#1e1608", borderRadius: 3, marginBottom: 8 }}>
          <div style={{ width: `${storagePct}%`, height: "100%", background: "linear-gradient(90deg,#C8892A,#B76E79)", borderRadius: 3 }} />
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          <span style={{ fontSize: 12, color: T.textFaint }}>📷 {PROOF_THREADS.reduce((s, t) => s + (t.photoProofCount || 0), 0)} photo proof</span>
          <span style={{ fontSize: 12, color: T.textFaint }}>🎙 {PROOF_THREADS.reduce((s, t) => s + (t.voiceProofCount || 0), 0)} voice proof</span>
        </div>
      </div>

      {/* Proof Intelligence — locked */}
      <div style={{ background: "#0a0800", border: "1px solid #1e1608", borderRadius: 12, padding: "14px 18px", opacity: 0.6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary, marginBottom: 3 }}>🔒 Proof Intelligence</div>
            <div style={{ fontSize: 12, color: T.textMuted }}>Pattern analysis across all your threads and audios. Coming soon.</div>
          </div>
        </div>
      </div>

    </div>
  );
}
