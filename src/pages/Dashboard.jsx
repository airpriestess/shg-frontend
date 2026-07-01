import { T } from "../design/tokens.js";
import { Btn, Card, Pill, StatCard, ProgressBar, LockCard, Label, Divider } from "../components/UI.jsx";
import { PROOF_THREADS, AUDIOS, STORAGE, USER } from "../data/sample.js";

const STATUS_COLOR = { "Active": "muted", "Evidence Appearing": "champagne", "Manifested": "success", "Paused": "muted" };
const TYPE_ICON = { "Sign": "◈", "Synchronicity": "✦", "Symptom": "◉", "Photo Proof": "📷", "Voice Proof": "🎙", "Partial Proof": "◐", "Final Manifestation": "★" };

export default function Dashboard({ userTier, onNavigate, onAddProof, onCreateThread }) {
  const activeThreads = PROOF_THREADS.filter(t => t.status !== "Manifested");
  const manifested = PROOF_THREADS.filter(t => t.status === "Manifested");
  const currentAudio = AUDIOS.find(a => a.lastListenedAt === "2026-07-01");
  const currentThread = PROOF_THREADS.find(t => t.linkedAudioId === currentAudio?.id && t.status !== "Manifested");
  const allEntries = PROOF_THREADS.flatMap(t => (t.entries || []).map(e => ({ ...e, threadTitle: t.intentionTitle, audioTitle: t.linkedAudioTitle })));
  const storageUsedPct = (USER.storageUsedMb / (userTier === "founder" ? 25600 : userTier === "goddess" ? 5120 : 1024)) * 100;

  return (
    <div style={{ padding: "28px 24px", overflowY: "auto", height: "100%", maxWidth: 960, margin: "0 auto" }} className="mob-pb fade">
      {/* Hero */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, color: T.rose, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Welcome back, {USER.name}</div>
        <h1 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, color: T.textPrimary, marginBottom: 8, lineHeight: 1.3 }}>Your hypnosis practice is creating proof.</h1>
        <p style={{ fontSize: 15, color: T.textMuted, lineHeight: 1.7, maxWidth: 560, marginBottom: 20 }}>Track what you listened to, what shifted, what appeared, and when the final proof arrived.</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Btn onClick={onCreateThread} variant="champagne" size="sm">+ Create Proof Thread</Btn>
          <Btn onClick={() => onAddProof("Photo Proof")} variant="ghost" size="sm">📷 Add Proof</Btn>
        </div>
      </div>

      {/* Current Ritual */}
      {currentAudio && (
        <div style={{ marginBottom: 20 }}>
          <Label style={{ marginBottom: 10 }}>Current Ritual</Label>
          <Card premium style={{ padding: "20px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: T.champSoft, marginBottom: 4 }}>🎧 {currentAudio.title}</div>
                {currentThread && <div style={{ fontSize: 14, fontWeight: 600, color: T.textSecondary, marginBottom: 8 }}>🧵 {currentThread.intentionTitle}</div>}
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13, color: T.textMuted }}>🔥 {USER.listeningStreak} day streak</span>
                  <span style={{ fontSize: 13, color: T.textMuted }}>Last: {currentAudio.lastListenedAt}</span>
                </div>
              </div>
              <Btn size="sm" variant="primary" onClick={() => onNavigate("audio-vault")}>▶ Resume</Btn>
            </div>
          </Card>
        </div>
      )}

      {/* Quick Capture */}
      <div style={{ marginBottom: 24 }}>
        <Label style={{ marginBottom: 10 }}>Quick Capture</Label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {[
            { label: "📷 Add Photo Proof", type: "Photo Proof", variant: "champagne" },
            { label: "🎙 Record Voice Proof", type: "Voice Proof", variant: "ghost" },
            { label: "◈ Log Sign", type: "Sign", variant: "ghost" },
          ].map((a, i) => (
            <Btn key={i} size="sm" variant={a.variant} onClick={() => onAddProof(a.type)}>{a.label}</Btn>
          ))}
        </div>
      </div>

      {/* Active Proof Threads */}
      {activeThreads.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Label>Active Proof Threads</Label>
            <button onClick={() => onNavigate("proof-threads")} style={{ background: "none", border: "none", color: T.champSoft, fontSize: 13, cursor: "pointer" }}>View all →</button>
          </div>
          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {activeThreads.slice(0, 4).map(t => (
              <Card key={t.id} hover style={{ padding: "16px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary, lineHeight: 1.35, flex: 1 }}>{t.intentionTitle}</div>
                  <Pill color={STATUS_COLOR[t.status] || "muted"}>{t.status}</Pill>
                </div>
                <div style={{ fontSize: 12, color: T.champSoft, marginBottom: 10 }}>🎧 {t.linkedAudioTitle}</div>
                <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, color: T.textMuted }}>{t.daysActive}d</span>
                  <span style={{ fontSize: 12, color: T.textMuted }}>📎 {t.proofEntryCount}</span>
                  {t.photoProofCount > 0 && <span style={{ fontSize: 12, color: T.textMuted }}>📷 {t.photoProofCount}</span>}
                  {t.voiceProofCount > 0 && <span style={{ fontSize: 12, color: T.textMuted }}>🎙 {t.voiceProofCount}</span>}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn size="sm" variant="soft" onClick={() => onNavigate("proof-threads")}>Open</Btn>
                  <Btn size="sm" variant="ghost" onClick={() => onAddProof("Sign")}>+ Proof</Btn>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recent Proof Captures */}
      {allEntries.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Label>Recent Proof Captures</Label>
          </div>
          <Card style={{ overflow: "hidden" }}>
            {allEntries.slice(-5).reverse().map((e, i) => (
              <div key={e.id}>
                <div style={{ padding: "14px 16px", display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(42,18,33,0.8)", border: "1px solid rgba(215,185,130,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{TYPE_ICON[e.type] || "·"}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary, marginBottom: 3 }}>{e.title}</div>
                    <div style={{ fontSize: 12, color: T.textMuted }}>🧵 {e.threadTitle} · {e.happenedAt}</div>
                  </div>
                  <Pill color="muted">{e.type}</Pill>
                </div>
                {i < Math.min(allEntries.length - 1, 4) && <Divider />}
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* Audio Results Snapshot */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <Label>Audio Results Snapshot</Label>
          <button onClick={() => onNavigate("audio-vault")} style={{ background: "none", border: "none", color: T.champSoft, fontSize: 13, cursor: "pointer" }}>View vault →</button>
        </div>
        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { label: "Most Linked", audio: AUDIOS.sort((a, b) => b.linkedProofThreadCount - a.linkedProofThreadCount)[0], stat: `${AUDIOS[0].linkedProofThreadCount} threads`, icon: "🧵" },
            { label: "Most Manifested", audio: AUDIOS.sort((a, b) => b.manifestedCount - a.manifestedCount)[0], stat: `${AUDIOS[0].manifestedCount} results`, icon: "✦" },
          ].map((c, i) => (
            <Card key={i} hover onClick={() => onNavigate("audio-vault")} style={{ padding: "16px 18px" }}>
              <div style={{ fontSize: 11, color: T.textFaint, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>{c.icon} {c.label}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.textPrimary, marginBottom: 4, lineHeight: 1.3 }}>{c.audio.title}</div>
              <div style={{ fontSize: 13, color: T.champSoft }}>{c.stat}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Manifested This Month */}
      {manifested.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <Label style={{ marginBottom: 12 }}>Manifested This Month</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {manifested.map(t => (
              <Card key={t.id} style={{ padding: "16px 18px", background: "linear-gradient(135deg, rgba(141,175,122,0.07), rgba(42,18,33,0.7))", border: "1px solid rgba(141,175,122,0.2)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: T.textPrimary, marginBottom: 4 }}>{t.intentionTitle}</div>
                    <div style={{ fontSize: 13, color: T.champSoft, marginBottom: 6 }}>🎧 {t.linkedAudioTitle}</div>
                    <div style={{ fontSize: 13, color: T.success }}>✦ {t.daysActive} days from first listen to final proof</div>
                  </div>
                  <Pill color="success">Manifested</Pill>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Storage */}
      <div style={{ marginBottom: 24 }}>
        <Label style={{ marginBottom: 10 }}>Storage</Label>
        <Card style={{ padding: "18px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: T.textSecondary }}>Evidence Vault</span>
            <span style={{ fontSize: 13, color: T.textMuted }}>{USER.storageUsedMb} MB / {userTier === "goddess" ? "5,120" : "1,024"} MB</span>
          </div>
          <ProgressBar value={USER.storageUsedMb} max={userTier === "goddess" ? 5120 : 1024} />
          <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
            <span style={{ fontSize: 12, color: T.textMuted }}>📷 {STORAGE.photoCount} photos</span>
            <span style={{ fontSize: 12, color: T.textMuted }}>🎙 {STORAGE.voiceCount} voice notes</span>
          </div>
        </Card>
      </div>

      {/* Proof Intelligence locked */}
      <div style={{ marginBottom: 24 }}>
        <Label style={{ marginBottom: 10 }}>Proof Intelligence</Label>
        <Card premium style={{ padding: "24px 22px", textAlign: "center" }}>
          <div style={{ fontSize: 24, marginBottom: 12 }}>◎</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.textPrimary, marginBottom: 8 }}>Proof Intelligence · Coming Soon</div>
          <p style={{ fontSize: 14, color: T.textMuted, lineHeight: 1.7, maxWidth: 360, margin: "0 auto 18px" }}>Soon Proof OS will reveal which audios, times, categories, and rituals create your fastest proof.</p>
          <Btn size="sm" variant="ghost">Join Founder Access</Btn>
        </Card>
      </div>
    </div>
  );
}
