import { requestNotificationPermission, scheduleListeningReminders, cancelReminders } from "../utils/notifications.js";
import { useState } from "react";
import { T } from "../design/tokens.js";
import { requestNotificationPermission, scheduleReminders, cancelReminders } from "../utils/notifications.js";
import { Btn, Card, Label, ProgressBar, Divider } from "../components/UI.jsx";
import { USER, STORAGE } from "../data/sample.js";

function NotificationToggle() {
  const [permission, setPermission] = React.useState(
    typeof Notification !== "undefined" ? Notification.permission : "unsupported"
  );
  const [active, setActive] = React.useState(
    !!localStorage.getItem("shg_morning_timer")
  );

  const enable = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    if (result === "granted") {
      scheduleListeningReminders();
      setActive(true);
    }
  };

  const disable = () => {
    cancelReminders();
    setActive(false);
  };

  if (permission === "unsupported") {
    return <div style={{ fontSize: 13, color: "#555" }}>Push notifications not supported in this browser. On iPhone, add to Home Screen first.</div>;
  }

  if (permission === "denied") {
    return <div style={{ fontSize: 13, color: "#555" }}>Notifications blocked. Go to browser settings → site settings → allow notifications for this site.</div>;
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <button onClick={active ? disable : enable} style={{
        width: 48, height: 26, borderRadius: 13, border: "none", cursor: "pointer",
        background: active ? "linear-gradient(90deg,#C8892A,#B76E79)" : "#1e1608",
        position: "relative", transition: "background 0.2s", flexShrink: 0,
      }}>
        <div style={{
          width: 20, height: 20, borderRadius: "50%", background: "#fff",
          position: "absolute", top: 3, left: active ? 25 : 3, transition: "left 0.2s",
        }} />
      </button>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary }}>
          {active ? "Reminders on ✦" : "Enable reminders"}
        </div>
        <div style={{ fontSize: 12, color: "#555" }}>8:00 am · 9:00 pm daily</div>
      </div>
    </div>
  );
}


export default function VaultSettings({ userTier, onSignOut, onUpgrade }) {
  const limit = userTier === "founder" ? 25600 : userTier === "goddess" ? 5120 : 1024;
  const planLabel = userTier === "founder" ? "Founder · Lifetime" : userTier === "goddess" ? "Goddess Tier · €33/month" : "Audio Tier · €19/month";

  const [notifStatus, setNotifStatus] = useState(
    window.Notification?.permission || "default"
  );

  const toggleNotifications = async () => {
    if (notifStatus === "granted") {
      cancelReminders();
      setNotifStatus("cancelled");
    } else {
      const perm = await requestNotificationPermission();
      setNotifStatus(perm);
      if (perm === "granted") scheduleReminders();
    }
  };

  return (
    <div style={{ padding: "28px 24px", overflowY: "auto", height: "100%", maxWidth: 680, margin: "0 auto" }} className="mob-pb fade">
      <h1 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, color: "#e8e0d0", marginBottom: 6 }}>Vault Settings</h1>
      <p style={{ fontSize: 15, color: "#5a4a2a", marginBottom: 28 }}>Your account, subscription, and storage.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Account */}
        <Card style={{ padding: "22px 22px" }}>
          <Label style={{ marginBottom: 14 }}>Account</Label>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#e8e0d0", marginBottom: 4 }}>{USER.name}</div>
          <div style={{ fontSize: 14, color: "#5a4a2a", marginBottom: 16 }}>{USER.email}</div>
          <div style={{ fontSize: 11, color: T.rose, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Plan</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.gold, marginBottom: 14 }}>{planLabel}</div>
          <div style={{ fontSize: 14, color: "#2a1e08", lineHeight: 1.7, marginBottom: 18 }}>No refunds after 14 days · Cancel before renewal date</div>
          <Btn size="sm" variant="ghost" onClick={() => {}}>Manage billing ↗</Btn>
        </Card>

        {/* Storage */}
        <Card style={{ padding: "22px 22px" }}>
          <Label style={{ marginBottom: 14 }}>Evidence Vault Storage</Label>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#c8a870" }}>Used</span>
            <span style={{ fontSize: 14, color: "#5a4a2a" }}>{USER.storageUsedMb} MB / {limit.toLocaleString()} MB</span>
          </div>
          <ProgressBar value={USER.storageUsedMb} max={limit} height={7} />
          <div style={{ display: "flex", gap: 18, marginTop: 14 }}>
            <span style={{ fontSize: 13, color: "#5a4a2a" }}>📷 {STORAGE.photoCount} photo proofs</span>
            <span style={{ fontSize: 13, color: "#5a4a2a" }}>🎙 {STORAGE.voiceCount} voice proofs</span>
          </div>
          {userTier !== "founder" && (
            <div style={{ marginTop: 16 }}><Btn size="sm" variant="ghost" onClick={onUpgrade}>Upgrade for more storage →</Btn></div>
          )}
        </Card>

        {/* How to listen */}
        <Card style={{ padding: "22px 22px" }}>
          <Label style={{ marginBottom: 14 }}>How to Listen</Label>
          <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { t: "Best time to listen", b: "First thing on waking or last thing at night. Your subconscious is most receptive in alpha and theta states — at the threshold of sleep." },
              { t: "How often", b: "Daily is ideal. Consistency builds the installation. Think of it as watering a seed — the more consistently you listen, the faster the shift takes hold." },
              { t: "SATs — State Akin to Sleep", b: "The most powerful state for reprogramming. At the edge of sleep, your critical conscious mind is offline. This is when the new self-concept installs deepest." },
              { t: "Headphones", b: "Required for binaural beats and bilateral EMDR tracks. Speakers work for subliminals only. Check the track description for guidance." },
            ].map((g, i) => (
              <div key={i} style={{ background: "#060400", borderRadius: 10, padding: 14, border: "1px solid #1e1608" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#b07828", marginBottom: 6 }}>{g.t}</div>
                <div style={{ fontSize: 13, color: "#5a4a2a", lineHeight: 1.7 }}>{g.b}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upgrade */}
        {userTier === "audio" && (
          <Card premium style={{ padding: "22px 22px" }} onClick={onUpgrade}>
            <div style={{ fontSize: 12, color: T.rose, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Upgrade</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#e8e0d0", marginBottom: 6 }}>Goddess Tier — €33/month</div>
            <div style={{ fontSize: 14, color: "#5a4a2a", marginBottom: 16 }}>Deeper audios · 5 GB storage · ProofOS full access</div>
            <Btn size="sm" variant="champagne">Unlock Goddess Vault</Btn>
          </Card>
        )}

        {/* Install */}
        <Card style={{ padding: "22px 22px" }}>
          <Label style={{ marginBottom: 10 }}>Install the App</Label>
          <div style={{ fontSize: 14, color: "#5a4a2a", lineHeight: 1.85 }}>
            iPhone: tap Share → "Add to Home Screen"<br />
            Android: tap Menu → "Add to Home Screen"<br />
            Plays in background like Spotify when screen is locked<br />
            No App Store download needed
          </div>
        </Card>

        {/* Social */}
        <div style={{ display: "flex", gap: 12 }}>
          {[["YouTube", "https://www.youtube.com/@Reshma.Oracle"], ["Instagram", "https://www.instagram.com/reshma.oracle/"]].map(([l, u]) => (
            <a key={l} href={u} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: 16, background: "#0a0800", border: "1px solid #1e1608", borderRadius: 12, color: "#5a4a2a", fontSize: 14, textAlign: "center", textDecoration: "none" }}>{l} ↗</a>
          ))}
        </div>


      {/* ── LISTENING REMINDERS ── */}
      <div style={{ background: "#0a0800", border: "1px solid #1e1608", borderRadius: 14, padding: "20px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: "#C8892A", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>Listening Reminders</div>
        <p style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.7, marginBottom: 16 }}>
          Get a reminder at 8am and 9pm to listen to your audio. Your subconscious is most receptive in the morning and just before sleep.
        </p>
        <NotificationToggle />
      </div>

        <Btn full variant="soft" onClick={onSignOut}>Sign out</Btn>
        <div style={{ fontSize: 12, color: "#2a1e08", textAlign: "center" }}>© 2026 Reshma Oracle · Self Hypnosis Goddess</div>
      </div>
    </div>
  );
}
