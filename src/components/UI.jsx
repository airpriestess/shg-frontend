import { T } from "../design/tokens.js";

export function Btn({ children, onClick, variant = "primary", size = "md", full, disabled, style: extra }) {
  const sizes = { sm: { padding: "8px 16px", fontSize: 13 }, md: { padding: "11px 22px", fontSize: 14 }, lg: { padding: "14px 28px", fontSize: 15 } };
  const variants = {
    primary: { background: "linear-gradient(135deg,#C8892A,#B76E79)", color: "#000", border: "none" },
    champagne: { background: "linear-gradient(135deg,#C8892A,#B76E79)", color: "#000", border: "none" },
    ghost: { background: "transparent", color: "#B76E79", border: "1px solid #B76E7966" },
    soft: { background: "#0a0800", color: T.textMuted, border: `1px solid #1e1608` },
    danger: { background: "transparent", color: T.rose, border: `1px solid ${T.rose}44` },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...sizes[size], ...variants[variant],
      width: full ? "100%" : "auto",
      borderRadius: 10, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      gap: 7, opacity: disabled ? 0.4 : 1, transition: "all 0.18s",
      letterSpacing: "0.01em", minHeight: size === "lg" ? 48 : size === "sm" ? 34 : 40,
      flexShrink: 0, whiteSpace: "nowrap", ...extra,
    }}
      onMouseEnter={e => !disabled && (e.currentTarget.style.transform = "translateY(-1px)", e.currentTarget.style.boxShadow = "0 6px 20px rgba(124,38,63,0.3)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "", e.currentTarget.style.boxShadow = "")}
    >{children}</button>
  );
}

export function Card({ children, style, premium, onClick, hover }) {
  return (
    <div onClick={onClick} style={{
      background: premium ? T.premiumCard : T.cardBg,
      border: T.border,
      borderRadius: 14,
      boxShadow: T.glow,
      cursor: onClick ? "pointer" : "default",
      transition: hover || onClick ? "all 0.2s" : "none",
      ...style,
    }}
      onMouseEnter={e => (hover || onClick) && (e.currentTarget.style.borderColor = T.gold + "66", e.currentTarget.style.boxShadow = "0 0 30px rgba(200,137,42,0.1)")}
      onMouseLeave={e => (hover || onClick) && (e.currentTarget.style.borderColor = "#1e1608", e.currentTarget.style.boxShadow = T.glow)}
    >{children}</div>
  );
}

export function Pill({ children, color, style }) {
  const colors = {
    rose: { bg: "#B76E7922", text: "#B76E79" },
    champagne: { bg: "#B76E7922", text: "#B76E79" },
    success: { bg: T.success + "22", text: T.success },
    danger: { bg: T.rose + "22", text: T.rose },
    muted: { bg: "#0a0800", text: T.textMuted },
    blood: { bg: T.rose + "18", text: "#d06080" },
  };
  const c = colors[color] || colors.muted;
  return (
    <span style={{ padding: "3px 10px", background: c.bg, color: c.text, borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap", ...style }}>{children}</span>
  );
}

export function Divider({ style }) {
  return <div style={{ height: 1, background: "rgba(215,185,130,0.08)", ...style }} />;
}

export function StatCard({ icon, value, label, sub, color }) {
  return (
    <Card style={{ padding: "20px 18px" }}>
      <div style={{ fontSize: 20, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontSize: 30, fontWeight: 700, color: color || T.champagne, lineHeight: 1, marginBottom: 5 }}>{value}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: T.textSecondary, marginBottom: 3 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color: T.textMuted }}>{sub}</div>}
    </Card>
  );
}

export function EmptyState({ icon, title, body, cta, onCta }) {
  return (
    <div style={{ textAlign: "center", padding: "52px 24px" }}>
      <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.5 }}>{icon}</div>
      <div style={{ fontSize: 17, fontWeight: 600, color: T.textSecondary, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 14, color: T.textMuted, lineHeight: 1.7, marginBottom: cta ? 24 : 0, maxWidth: 320, margin: "0 auto 24px" }}>{body}</div>
      {cta && <Btn onClick={onCta} variant="ghost" size="sm">{cta}</Btn>}
    </div>
  );
}

export function Modal({ open, onClose, title, children, width = 520 }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(9,4,7,0.85)", backdropFilter: "blur(8px)" }} />
      <div className="fade" style={{ position: "relative", width: "100%", maxWidth: width, background: T.surfaceRaised, border: T.border, borderRadius: 18, boxShadow: "0 24px 80px rgba(0,0,0,0.6)", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(215,185,130,0.1)" }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: T.textPrimary }}>{title}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: T.textMuted, fontSize: 20, cursor: "pointer", lineHeight: 1, padding: "2px 6px" }}>×</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

export function ProgressBar({ value, max, color, height = 5 }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ height, background: "rgba(255,255,255,0.06)", borderRadius: height, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color || `linear-gradient(90deg, ${T.gold}, ${T.rose})` , borderRadius: height, transition: "width 0.6s ease" }} />
    </div>
  );
}

export function WaveForm({ playing, color }) {
  return (
    <div className="wave" style={{ display: "flex", alignItems: "center", gap: 2, height: 28 }}>
      {[12, 22, 16, 28, 20, 24, 14, 26, 18, 22].map((h, i) => (
        <span key={i} style={{ height: playing ? h : 6, animationDelay: `${i * 0.1}s`, background: color || `linear-gradient(180deg, ${T.champagne}, ${T.rose})`, animationPlayState: playing ? "running" : "paused" }} />
      ))}
    </div>
  );
}

export function Rings({ count = 4, color }) {
  const sizes = [280, 460, 640, 840, 1080];
  const ops = [0.15, 0.09, 0.05, 0.03, 0.02];
  const c = color || T.gold;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {sizes.slice(0, count).map((s, i) => (
        <div key={i} className="ring" style={{ width: s, height: s, borderColor: `${c}${["28", "18", "10", "08", "05"][i]}`, "--op": ops[i], animationDelay: `${i * 1.1}s` }} />
      ))}
    </div>
  );
}

export function LockCard({ onUpgrade }) {
  return (
    <Card premium style={{ padding: "28px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ fontSize: 28, marginBottom: 12 }}>🔒</div>
      <div style={{ fontSize: 17, fontWeight: 700, color: T.textPrimary, marginBottom: 8 }}>Unlock Goddess Vault</div>
      <div style={{ fontSize: 14, color: T.textMuted, lineHeight: 1.7, marginBottom: 20, maxWidth: 280, margin: "0 auto 20px" }}>
        Access deeper audios, more storage, and the full evidence vault.
      </div>
      <Btn onClick={onUpgrade} variant="champagne" size="sm">Upgrade</Btn>
    </Card>
  );
}

export function Label({ children, style }) {
  return <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textFaint, marginBottom: 6, ...style }}>{children}</div>;
}

export function FormField({ label, children, style }) {
  return (
    <div style={{ marginBottom: 16, ...style }}>
      {label && <Label>{label}</Label>}
      {children}
    </div>
  );
}
