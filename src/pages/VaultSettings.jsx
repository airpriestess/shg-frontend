import { useState } from "react";
import { T } from "../design/tokens.js";
import { Btn, Card, Label, ProgressBar } from "../components/UI.jsx";
import { USER, STORAGE } from "../data/sample.js";
import { requestNotificationPermission, scheduleReminders, cancelReminders } from "../utils/notifications.js";

const G = "linear-gradient(90deg,#d4a090,#B76E79)";
const RG = "#B76E79";

export default function VaultSettings({ userTier, onSignOut, onUpgrade }) {
  const limit     = userTier === "founder" ? 25600 : userTier === "goddess" ? 5120 : 1024;
  const planLabel = userTier === "founder" ? "Founder · Lifetime" : userTier === "goddess" ? "Goddess Tier · £33/month" : "Audio Tier · £19/month";

  const [notifStatus, setNotifStatus] = useState(
    typeof Notification !== "undefined" ? Notification.permission : "unsupported"
  );
  const [remindersOn, setRemindersOn] = useState(
    !!localStorage.getItem("shg_timers")
  );

  const toggleNotifications = async () => {
    if (remindersOn) {
      cancelReminders();
      setRemindersOn(false);
    } else {
      if (typeof Notification === "undefined") return;
      const perm = await requestNotificationPermission();
      setNotifStatus(perm);
      if (perm === "granted") {
        scheduleReminders();
        setRemindersOn(true);
      }
    }
  };

  const Row = ({ label, value }) => (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid #161228" }}>
      <span style={{ fontSize: 14, color: T.textMuted }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary }}>{value}</span>
    </div>
  );

  return (
    <div style={{ padding: "28px 24px", overflowY: "auto", height: "100%", maxWidth: 660, margin: "0 auto" }} className="mob-pb fade">

      {/* Heading */}
      <div style={{ marginBottom: 28 }}>
        <h1 className="wm" style={{ fontSize: "clamp(32px,4vw,46px)", background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 6 }}>
          Vault Settings
        </h1>
        <p style={{ fontSize: 15, color: T.textMuted }}>Account, subscription, storage, and listening preferences.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

        {/* ── ACCOUNT ── */}
        <div style={{ background: "#000000", border: "1px solid #161228", borderRadius: 14, padding: "22px 22px" }}>
          <div style={{ fontSize: 11, color: "#B76E79", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 16 }}>Account</div>
          <Row label="Name"  value={USER.name} />
          <Row label="Email" value={USER.email} />
          <Row label="Plan"  value={planLabel} />
          <Row label="Member since" value={USER.joinedAt} />
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            <Btn size="sm" variant="ghost" onClick={() => window.open("https://billing.stripe.com/p/login/test_reshmaoracle", "_blank")}>Manage billing ↗</Btn>
            {userTier !== "founder" && <Btn size="sm" variant="ghost" onClick={() => { if (window.confirm("To cancel your subscription, you will be taken to the billing portal. Your access continues until the end of your current billing period.")) window.open("https://billing.stripe.com/p/login/test_reshmaoracle", "_blank"); }}>Cancel subscription</Btn>}
          </div>
        </div>

        {/* ── STORAGE ── */}
        <div style={{ background: "#000000", border: "1px solid #161228", borderRadius: 14, padding: "22px 22px" }}>
          <div style={{ fontSize: 11, color: "#B76E79", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 16 }}>Evidence Vault Storage</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 15, color: T.textPrimary, fontWeight: 600 }}>Used</span>
            <span style={{ fontSize: 14, color: "#B76E79", fontWeight: 700 }}>{USER.storageUsedMb} MB <span style={{ color: T.textMuted, fontWeight: 400 }}>of {limit.toLocaleString()} MB</span></span>
          </div>
          <div style={{ height: 6, background: "#161228", borderRadius: 3, marginBottom: 12 }}>
            <div style={{ width: `${Math.min((USER.storageUsedMb/limit)*100, 100)}%`, height: "100%", background: G, borderRadius: 3 }} />
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            <span style={{ fontSize: 13, color: T.textMuted }}>📷 {STORAGE.photoCount} photo proofs</span>
            <span style={{ fontSize: 13, color: T.textMuted }}>🎙 {STORAGE.voiceCount} voice proofs</span>
          </div>
          {userTier !== "founder" && (
            <div style={{ marginTop: 14 }}>
              <Btn size="sm" variant="ghost" onClick={onUpgrade}>Upgrade for more storage →</Btn>
            </div>
          )}
        </div>

        {/* ── LISTENING REMINDERS ── */}
        <div style={{ background: "#000000", border: "1px solid #161228", borderRadius: 14, padding: "22px 22px" }}>
          <div style={{ fontSize: 11, color: "#B76E79", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 16 }}>Listening Reminders</div>
          <p style={{ fontSize: 14, color: T.textMuted, lineHeight: 1.75, marginBottom: 18 }}>
            Reshma reminds you to listen at 8am and 9pm every day. Works in Chrome and Edge on desktop and Android. On iPhone, add this app to your Home Screen first (tap Share → Add to Home Screen), then enable here.
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary, marginBottom: 3 }}>
                {remindersOn ? "Reminders on ✦" : "Daily reminders"}
              </div>
              <div style={{ fontSize: 12, color: T.textMuted }}>8:00 am · 9:00 pm daily</div>
            </div>
            {notifStatus === "denied" ? (
              <div style={{ fontSize: 12, color: T.textMuted, maxWidth: 220, textAlign: "right", lineHeight: 1.6 }}>
                Blocked in browser settings. Allow notifications for reshmaoracle.com to enable.
              </div>
            ) : notifStatus === "unsupported" ? (
              <div style={{ fontSize: 12, color: T.textMuted }}>Add to Home Screen first (iPhone)</div>
            ) : (
              <button onClick={toggleNotifications} style={{
                width: 52, height: 28, borderRadius: 14, border: "none", cursor: "pointer",
                background: remindersOn ? G : "#161228",
                position: "relative", transition: "background 0.2s", flexShrink: 0,
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", background: "#fff",
                  position: "absolute", top: 3,
                  left: remindersOn ? 27 : 3,
                  transition: "left 0.2s",
                }} />
              </button>
            )}
          </div>
        </div>

        {/* ── HOW TO LISTEN ── */}
        <div style={{ background: "#000000", border: "1px solid #161228", borderRadius: 14, padding: "22px 22px" }}>
          <div style={{ fontSize: 11, color: "#B76E79", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 16 }}>How to Listen</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              { t: "Best time", b: "First thing on waking or last thing at night. Your subconscious is most receptive at the threshold of sleep." },
              { t: "How often", b: "Daily. Consistency is the installation. Think of it as a daily practice — the more you return, the deeper the shift." },
              { t: "SATs — State Akin to Sleep", b: "The most powerful state for reprogramming. At the edge of sleep your critical mind is offline and the new self-concept installs deepest." },
              { t: "Headphones", b: "Required for binaural beats and bilateral EMDR tracks. Speakers work for subliminals. Check each track." },
              { t: "Melodic house versions", b: "Some audios are available with melodic house music layered beneath Reshma's voice. This is a unique sound design choice — the frequency of the music reinforces the subconscious installation." },
            ].map((g, i, arr) => (
              <div key={i} style={{ padding: "14px 0", borderBottom: i < arr.length-1 ? "1px solid #161228" : "none" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#B76E79", marginBottom: 5 }}>{g.t}</div>
                <div style={{ fontSize: 14, color: T.textMuted, lineHeight: 1.75 }}>{g.b}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── UPGRADE ── */}
        {userTier === "audio" && (
          <div style={{ background: "linear-gradient(135deg,#0f0d02,#000000)", border: `1px solid #B76E7944`, borderRadius: 14, padding: "22px 22px", cursor: "pointer" }} onClick={onUpgrade}>
            <div style={{ fontSize: 11, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 10 }}>Upgrade</div>
            <div className="wm" style={{ fontSize: 26, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 6 }}>Goddess Tier</div>
            <div style={{ fontSize: 14, color: T.textMuted, marginBottom: 16, lineHeight: 1.7 }}>Deeper audios · 5 GB evidence vault · Full ProofOS access · Priority releases</div>
            <Btn size="sm" variant="champagne">Unlock Goddess Vault</Btn>
          </div>
        )}

        {/* ── INSTALL ── */}
        <div style={{ background: "#000000", border: "1px solid #161228", borderRadius: 14, padding: "22px 22px" }}>
          <div style={{ fontSize: 11, color: "#B76E79", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 14 }}>Install the App</div>
          <div style={{ fontSize: 14, color: T.textMuted, lineHeight: 1.9 }}>
            <strong style={{ color: T.textPrimary }}>iPhone:</strong> Tap Share → "Add to Home Screen"<br />
            <strong style={{ color: T.textPrimary }}>Android:</strong> Tap Menu → "Add to Home Screen"<br />
            Plays in background like Spotify when screen is locked.<br />
            No App Store download needed.
          </div>
        </div>

        {/* ── SOCIAL ── */}
        <div style={{ display: "flex", gap: 10 }}>
          {[["YouTube", "https://www.youtube.com/@Reshma.Oracle"], ["Instagram", "https://www.instagram.com/reshma.oracle/"]].map(([l, u]) => (
            <a key={l} href={u} target="_blank" rel="noopener noreferrer"
              style={{ flex: 1, padding: "14px 0", background: "#000000", border: "1px solid #161228", borderRadius: 12, color: T.textMuted, fontSize: 14, textAlign: "center", textDecoration: "none" }}>
              {l} ↗
            </a>
          ))}
        </div>

        <Btn full variant="ghost" onClick={onSignOut} style={{ marginTop: 4 }}>Sign out</Btn>
        <div style={{ fontSize: 12, color: T.textFaint, textAlign: "center" }}>© 2026 Reshma Oracle · Self Hypnosis Goddess</div>
      </div>
    </div>
  );
}
