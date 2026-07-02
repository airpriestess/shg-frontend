import { useState } from "react";
import { T } from "../design/tokens.js";
import { Btn } from "../components/UI.jsx";
import { PROOF_THREADS, AUDIOS, USER } from "../data/sample.js";

const RG = "#C8956A"; // rose gold — single accent

const STATUS_LABEL = {
  "Active": { label: "Active", color: "#d8c8a0" },
  "Evidence Appearing": { label: "Evidence", color: RG },
  "Manifested": { label: "Manifested", color: "#4a9a5a" },
  "Paused": { label: "Paused", color: "#555" },
};

const TIMELINE = [
  { day: "Day 1", event: "First listen",     detail: "Money Finds Me First — Proof Thread opened.",             icon: "🎧", photo: false },
  { day: "Day 2", event: "Voice proof",      detail: "I felt calmer and more certain after listening.",          icon: "🎙", photo: false },
  { day: "Day 3", event: "Sign noticed",     detail: "Saw 555 three times. A phrase from the audio appeared.",  icon: "◈",  photo: false },
  { day: "Day 5", event: "Photo proof",      detail: "Bank notification screenshot captured.",                   icon: "📷", photo: true  },
  { day: "Day 8", event: "Manifested ★",    detail: "€5,000 received. Thread closed.",                          icon: "★",  photo: true  },
];

const RECENT_PROOF = [
  { icon: "💰", label: "Bank Notification",  thread: "I receive €5,000 unexpectedly",   date: "Jul 1"  },
  { icon: "💬", label: "Message Screenshot", thread: "He sends me a loving message",     date: "Jun 30" },
  { icon: "🪞", label: "Mirror Photo",       thread: "My skin looks clear and luminous", date: "Jun 29" },
  { icon: "555",label: "Angel Number",       thread: "I receive €5,000 unexpectedly",   date: "Jun 27" },
  { icon: "📧", label: "Email Confirmation", thread: "He sends me a loving message",     date: "Jun 26" },
  { icon: "📅", label: "Calendar Invite",    thread: "I receive €5,000 unexpectedly",   date: "Jun 25" },
];

// ── Small stat number card ────────────────────────────────────────────────────
function StatCard({ value, label }) {
  return (
    <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 14, padding: "20px 16px", textAlign: "center" }}>
      <div style={{ fontSize: 32, fontWeight: 800, color: RG, lineHeight: 1, marginBottom: 6 }}>{value}</div>
      <div style={{ fontSize: 11, color: "#555", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────
function SectionHead({ children, action, onAction }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
      <div style={{ fontSize: 12, color: RG, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase" }}>{children}</div>
      {action && <button onClick={onAction} style={{ background: "none", border: "none", color: "#555", fontSize: 12, cursor: "pointer" }}>{action} →</button>}
    </div>
  );
}

// ── Tab switcher (Member / User Types / User Trends style) ───────────────────
function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #1a1a1a", marginBottom: 20 }}>
      {tabs.map(t => (
        <button key={t} onClick={() => onChange(t)} style={{
          padding: "10px 18px", background: "none", border: "none",
          color: active === t ? T.textPrimary : "#444",
          fontSize: 13, fontWeight: active === t ? 700 : 400, cursor: "pointer",
          borderBottom: active === t ? `2px solid ${RG}` : "2px solid transparent",
          marginBottom: -1, transition: "color 0.15s",
        }}>{t}</button>
      ))}
    </div>
  );
}

export default function Dashboard({ userTier, onNavigate, onAddProof, onCreateThread }) {
  const [activeTab, setActiveTab] = useState("Overview");

  const manifested   = PROOF_THREADS.filter(t => t.status === "Manifested");
  const active       = PROOF_THREADS.filter(t => t.status !== "Manifested");
  const currentAudio = AUDIOS.find(a => a.lastListenedAt === "2026-07-01");
  const currentThread = PROOF_THREADS.find(t => t.linkedAudioId === currentAudio?.id && t.status !== "Manifested");
  const avgDays      = manifested.length ? Math.round(manifested.reduce((s, t) => s + t.daysActive, 0) / manifested.length) : null;
  const rate         = PROOF_THREADS.length ? Math.round((manifested.length / PROOF_THREADS.length) * 100) : 0;
  const storageLimit = userTier === "founder" ? 25600 : userTier === "goddess" ? 5120 : 1024;
  const storagePct   = Math.round((USER.storageUsedMb / storageLimit) * 100);

  return (
    <div style={{ height: "100%", overflowY: "auto", background: "#000", color: T.textPrimary }} className="mob-pb">
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "28px 24px" }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <div className="wm" style={{ fontSize: 16, color: RG, fontWeight: 500, letterSpacing: "0.04em", marginBottom: 6, fontStyle: "italic" }}>ProofOS</div>
            <h1 className="wm" style={{ fontSize: "clamp(32px,4vw,48px)", fontWeight: 600, margin: 0, lineHeight: 1.1, background: "linear-gradient(90deg,#C8A050,#C8956A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {USER.name}'s Vault
            </h1>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn size="sm" variant="champagne" onClick={() => onAddProof("Photo Proof")}>📷 Add Proof</Btn>
            <Btn size="sm" variant="ghost" onClick={onCreateThread}>+ Intention</Btn>
          </div>
        </div>

        {/* ── TABS ── */}
        <Tabs tabs={["Overview", "Proof Threads", "Timeline"]} active={activeTab} onChange={setActiveTab} />

        {activeTab === "Overview" && (
          <>
            {/* ── STATS ROW ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 24 }} className="grid-4">
              <StatCard value={PROOF_THREADS.length} label="Intentions" />
              <StatCard value={manifested.length}    label="Manifested" />
              <StatCard value={avgDays ? `${avgDays}d` : "—"} label="Avg Days" />
              <StatCard value={`${rate}%`}           label="Rate" />
            </div>

            {/* ── CURRENT RITUAL + PHOTO PROOF side by side ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }} className="grid-2">

              {/* Current Ritual */}
              <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 16, padding: "20px" }}>
                <SectionHead>Current Ritual</SectionHead>
                {currentAudio ? (
                  <>
                    <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 14 }}>
                      <div style={{ width: 52, height: 52, borderRadius: 10, background: `${RG}18`, border: `1px solid ${RG}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>🎧</div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: T.textPrimary, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentAudio.title}</div>
                        {currentThread && <div style={{ fontSize: 12, color: RG, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>🧵 {currentThread.intentionTitle}</div>}
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: 10 }}>
                        <span style={{ fontSize: 12, color: "#555" }}>🔥 {USER.listeningStreak}d streak</span>
                        <span style={{ fontSize: 12, color: "#555" }}>{currentAudio.lastListenedAt}</span>
                      </div>
                      <Btn size="sm" variant="primary" onClick={() => onNavigate("audio-vault")}>▶ Resume</Btn>
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: 13, color: "#444", padding: "20px 0" }}>No active ritual. Start an audio to begin.</div>
                )}
              </div>

              {/* Quick Capture */}
              <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 16, padding: "20px" }}>
                <SectionHead>Quick Capture</SectionHead>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { label: "📷 Add Photo Proof",    type: "Photo Proof",   primary: true },
                    { label: "🎙 Record Voice Proof",  type: "Voice Proof" },
                    { label: "◈ Log Sign",             type: "Sign" },
                  ].map((a, i) => (
                    <button key={i} onClick={() => onAddProof(a.type)} style={{
                      padding: "11px 14px", borderRadius: 10, textAlign: "left",
                      background: a.primary ? `${RG}18` : "transparent",
                      border: `1px solid ${a.primary ? RG + "44" : "#1a1a1a"}`,
                      color: a.primary ? RG : "#666", fontSize: 13, fontWeight: 600,
                      cursor: "pointer", transition: "all 0.15s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = RG + "66"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = a.primary ? RG + "44" : "#1a1a1a"}
                    >{a.label}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RECENT PHOTO PROOF GRID ── */}
            <div style={{ marginBottom: 24 }}>
              <SectionHead action="View all" onAction={() => onNavigate("proof-threads")}>Recent Photo Proof</SectionHead>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }} className="grid-3">
                {RECENT_PROOF.map((p, i) => (
                  <div key={i} style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "border-color 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = RG + "44"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "#1a1a1a"}
                  >
                    <div style={{ height: 68, background: `${RG}0e`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, borderBottom: "1px solid #1a1a1a" }}>{p.icon}</div>
                    <div style={{ padding: "10px 12px" }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: RG, marginBottom: 2 }}>{p.label}</div>
                      <div style={{ fontSize: 11, color: "#444", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.thread}</div>
                      <div style={{ fontSize: 10, color: "#333" }}>{p.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── MANIFESTED THIS MONTH ── */}
            {manifested.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <SectionHead action="Proof Wall" onAction={() => onNavigate("proof-wall")}>Manifested</SectionHead>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {manifested.map(t => (
                    <div key={t.id} style={{ background: "#0d0d0d", border: "1px solid #1a3a1a", borderRadius: 12, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.intentionTitle}</div>
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <span style={{ fontSize: 12, color: "#555" }}>🎧 {t.linkedAudioTitle}</span>
                          <span style={{ fontSize: 12, color: "#555" }}>{t.daysActive}d</span>
                          {[...Array(Math.min(t.photoProofCount, 3))].map((_, i) => (
                            <div key={i} style={{ width: 22, height: 22, borderRadius: 4, background: "#4a9a5a18", border: "1px solid #4a9a5a33", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>📷</div>
                          ))}
                        </div>
                      </div>
                      <div style={{ fontSize: 20, color: "#4a9a5a" }}>★</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── STORAGE ── */}
            <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 14, padding: "16px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em" }}>Storage</span>
                <span style={{ fontSize: 12, color: RG, fontWeight: 700 }}>{USER.storageUsedMb} / {storageLimit} MB</span>
              </div>
              <div style={{ height: 4, background: "#1a1a1a", borderRadius: 2, marginBottom: 10 }}>
                <div style={{ width: `${storagePct}%`, height: "100%", background: `linear-gradient(90deg,${RG},#C8956A)`, borderRadius: 2 }} />
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <span style={{ fontSize: 11, color: "#444" }}>📷 {PROOF_THREADS.reduce((s,t) => s+(t.photoProofCount||0),0)} photos</span>
                <span style={{ fontSize: 11, color: "#444" }}>🎙 {PROOF_THREADS.reduce((s,t) => s+(t.voiceProofCount||0),0)} voice notes</span>
              </div>
            </div>
          </>
        )}

        {activeTab === "Proof Threads" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {PROOF_THREADS.map(t => {
              const sc = STATUS_LABEL[t.status] || { label: t.status, color: "#555" };
              return (
                <div key={t.id} style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 14, padding: "18px 20px",
                  transition: "border-color 0.15s", cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = RG + "44"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#1a1a1a"}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: T.textPrimary, marginBottom: 4, lineHeight: 1.3 }}>{t.intentionTitle}</div>
                      <div style={{ fontSize: 12, color: RG }}>🎧 {t.linkedAudioTitle}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 11, color: sc.color, fontWeight: 700, marginBottom: 3 }}>{sc.label}</div>
                      <div style={{ fontSize: 11, color: "#444" }}>{t.daysActive}d</div>
                    </div>
                  </div>
                  {/* Photo thumbnails */}
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 12 }}>
                    {[...Array(Math.min(t.photoProofCount||0, 4))].map((_, i) => (
                      <div key={i} style={{ width: 30, height: 30, borderRadius: 6, background: `${RG}14`, border: `1px solid ${RG}2a`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>📷</div>
                    ))}
                    {(t.photoProofCount||0) > 4 && <span style={{ fontSize: 11, color: "#444" }}>+{t.photoProofCount-4}</span>}
                    {(t.voiceProofCount||0) > 0 && <span style={{ fontSize: 12, color: "#555", marginLeft: 4 }}>🎙 {t.voiceProofCount}</span>}
                    {(t.signCount||0) > 0 && <span style={{ fontSize: 12, color: "#555" }}>◈ {t.signCount}</span>}
                  </div>
                  {t.mood_before && t.mood_after && (
                    <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 12 }}>
                      <span style={{ fontSize: 11, padding: "2px 8px", background: "#111", border: "1px solid #222", borderRadius: 20, color: "#555" }}>{t.mood_before}</span>
                      <span style={{ fontSize: 11, color: "#333" }}>→</span>
                      <span style={{ fontSize: 11, padding: "2px 8px", background: `${RG}14`, border: `1px solid ${RG}2a`, borderRadius: 20, color: RG }}>{t.mood_after}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn size="sm" variant="ghost" onClick={() => onNavigate("proof-threads")}>Open Thread</Btn>
                    <Btn size="sm" variant="champagne" onClick={() => onAddProof("Photo Proof", t.id)}>📷 Add Proof</Btn>
                  </div>
                </div>
              );
            })}
            <Btn variant="ghost" full onClick={onCreateThread}>+ New Intention</Btn>
          </div>
        )}

        {activeTab === "Timeline" && (
          <div>
            <div style={{ fontSize: 13, color: "#555", marginBottom: 24, lineHeight: 1.7 }}>
              First listen to final manifestation. Every step logged.
            </div>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", top: 20, bottom: 20, left: 19, width: 1, background: `linear-gradient(180deg,${RG}66,${RG}22)` }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {TIMELINE.map((item, i) => {
                  const isManifested = item.icon === "★";
                  const col = isManifested ? "#4a9a5a" : RG;
                  return (
                    <div key={i} style={{ display: "flex", gap: 16 }}>
                      <div style={{ width: 40, flexShrink: 0, display: "flex", justifyContent: "center", paddingTop: 14 }}>
                        <div style={{ width: 22, height: 22, borderRadius: "50%", background: `${col}18`, border: `1.5px solid ${col}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, zIndex: 1, position: "relative" }}>{item.icon}</div>
                      </div>
                      <div style={{ flex: 1, background: "#0d0d0d", border: `1px solid ${col}22`, borderRadius: 12, padding: "14px 16px", marginBottom: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                          <div>
                            <span style={{ fontSize: 11, color: col, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>{item.day}</span>
                            <span style={{ fontSize: 11, color: "#444", marginLeft: 8 }}>{item.event}</span>
                          </div>
                          {item.photo && (
                            <div style={{ width: 32, height: 32, borderRadius: 6, background: `${col}14`, border: `1px solid ${col}2a`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
                              {isManifested ? "★" : "📷"}
                            </div>
                          )}
                        </div>
                        <div style={{ fontSize: 13, color: "#666", lineHeight: 1.55, marginTop: 6 }}>{item.detail}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
