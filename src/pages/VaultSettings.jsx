import { T } from "../design/tokens.js";
import { Btn, Card, Label, ProgressBar, Divider } from "../components/UI.jsx";
import { USER, STORAGE } from "../data/sample.js";

export default function VaultSettings({ userTier, onSignOut, onUpgrade }) {
  const limit = userTier === "founder" ? 25600 : userTier === "goddess" ? 5120 : 1024;
  const planLabel = userTier === "founder" ? "Founder · Lifetime" : userTier === "goddess" ? "Goddess Tier · €33/month" : "Audio Tier · €19/month";

  return (
    <div style={{ padding: "28px 24px", overflowY: "auto", height: "100%", maxWidth: 680, margin: "0 auto" }} className="mob-pb fade">
      <h1 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, color: T.textPrimary, marginBottom: 6 }}>Vault Settings</h1>
      <p style={{ fontSize: 15, color: T.textMuted, marginBottom: 28 }}>Your account, subscription, and storage.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Account */}
        <Card style={{ padding: "22px 22px" }}>
          <Label style={{ marginBottom: 14 }}>Account</Label>
          <div style={{ fontSize: 17, fontWeight: 700, color: T.textPrimary, marginBottom: 4 }}>{USER.name}</div>
          <div style={{ fontSize: 14, color: T.textMuted, marginBottom: 16 }}>{USER.email}</div>
          <div style={{ fontSize: 11, color: T.rose, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Plan</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.champagne, marginBottom: 14 }}>{planLabel}</div>
          <div style={{ fontSize: 14, color: T.textFaint, lineHeight: 1.7, marginBottom: 18 }}>No refunds after 14 days · Cancel before renewal date</div>
          <Btn size="sm" variant="ghost" onClick={() => {}}>Manage billing ↗</Btn>
        </Card>

        {/* Storage */}
        <Card style={{ padding: "22px 22px" }}>
          <Label style={{ marginBottom: 14 }}>Evidence Vault Storage</Label>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: T.textSecondary }}>Used</span>
            <span style={{ fontSize: 14, color: T.textMuted }}>{USER.storageUsedMb} MB / {limit.toLocaleString()} MB</span>
          </div>
          <ProgressBar value={USER.storageUsedMb} max={limit} height={7} />
          <div style={{ display: "flex", gap: 18, marginTop: 14 }}>
            <span style={{ fontSize: 13, color: T.textMuted }}>📷 {STORAGE.photoCount} photo proofs</span>
            <span style={{ fontSize: 13, color: T.textMuted }}>🎙 {STORAGE.voiceCount} voice proofs</span>
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
              <div key={i} style={{ background: "rgba(23,9,18,0.6)", borderRadius: 10, padding: 14, border: "1px solid rgba(215,185,130,0.08)" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.champSoft, marginBottom: 6 }}>{g.t}</div>
                <div style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.7 }}>{g.b}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upgrade */}
        {userTier === "audio" && (
          <Card premium style={{ padding: "22px 22px" }} onClick={onUpgrade}>
            <div style={{ fontSize: 12, color: T.rose, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Upgrade</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.textPrimary, marginBottom: 6 }}>Goddess Tier — €33/month</div>
            <div style={{ fontSize: 14, color: T.textMuted, marginBottom: 16 }}>Deeper audios · 5 GB storage · ProofOS full access</div>
            <Btn size="sm" variant="champagne">Unlock Goddess Vault</Btn>
          </Card>
        )}

        {/* Install */}
        <Card style={{ padding: "22px 22px" }}>
          <Label style={{ marginBottom: 10 }}>Install the App</Label>
          <div style={{ fontSize: 14, color: T.textMuted, lineHeight: 1.85 }}>
            iPhone: tap Share → "Add to Home Screen"<br />
            Android: tap Menu → "Add to Home Screen"<br />
            Plays in background like Spotify when screen is locked<br />
            No App Store download needed
          </div>
        </Card>

        {/* Social */}
        <div style={{ display: "flex", gap: 12 }}>
          {[["YouTube", "https://www.youtube.com/@Reshma.Oracle"], ["Instagram", "https://www.instagram.com/reshma.oracle/"]].map(([l, u]) => (
            <a key={l} href={u} target="_blank" rel="noopener noreferrer" style={{ flex: 1, padding: 16, background: T.cardBg, border: T.border, borderRadius: 12, color: T.textMuted, fontSize: 14, textAlign: "center", textDecoration: "none" }}>{l} ↗</a>
          ))}
        </div>

        <Btn full variant="soft" onClick={onSignOut}>Sign out</Btn>
        <div style={{ fontSize: 12, color: T.textFaint, textAlign: "center" }}>© 2026 Reshma Oracle · Self Hypnosis Goddess</div>
      </div>
    </div>
  );
}
