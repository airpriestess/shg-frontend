/* ── REUSABLE PROOF PLACEHOLDER ASSETS ───────────────────────────────────────
   Used across Dashboard, ProofThreads, Archive, AudioVault, ProofWall.
   Each returns a styled div that looks like a real captured screenshot.
──────────────────────────────────────────────────────────────────────────────*/

const G = "linear-gradient(90deg,#C8A050,#C8956A)";
const RG = "#C8A050";

export const PROOF_ASSETS = [
  {
    id: "bank",
    label: "Bank Notification",
    type: "Photo Proof",
    icon: null,
    color: "#3a7a4a",
    thread: "I receive £5,000 from an unexpected source",
    audio: "Money Finds Me First",
    date: "2026-07-01",
    render: (size = 56) => ({
      bg: "linear-gradient(135deg,#0a1a0e,#081208)",
      border: "#2a5a3a",
      content: [
        { text: "✦ TRANSFER RECEIVED", size: 9, color: "#4a9a5a", bold: true, spacing: "0.15em" },
        { text: "£5,000.00", size: size > 48 ? 22 : 14, color: "#f4ead8", bold: true },
        { text: "Reshma Oracle", size: 10, color: "#4a6a4a" },
      ]
    })
  },
  {
    id: "message",
    label: "Message Screenshot",
    type: "Photo Proof",
    color: "#C8956A",
    thread: "He sends me a loving message and asks to see me",
    audio: "He Is Already On His Way Back",
    date: "2026-06-30",
    render: (size = 56) => ({
      bg: "linear-gradient(135deg,#1a0e0a,#120a08)",
      border: "#3a2a1a",
      content: [
        { text: "I miss you.", size: size > 48 ? 13 : 10, color: "#f4ead8" },
        { text: "Been thinking about you", size: size > 48 ? 12 : 9, color: "#f4ead8" },
        { text: "Can we talk?", size: size > 48 ? 12 : 9, color: "#f4ead8" },
      ]
    })
  },
  {
    id: "mirror",
    label: "Mirror Photo",
    type: "Photo Proof",
    color: "#C8956A",
    thread: "My skin looks clear, smooth, and luminous",
    audio: "Gorgeous Is My Default Setting",
    date: "2026-06-29",
    render: (size = 56) => ({
      bg: "linear-gradient(135deg,#1a0e14,#0e0810)",
      border: "#3a1e2a",
      content: [
        { text: "🪞", size: size > 48 ? 24 : 16, color: "#f4ead8" },
        { text: "Day 14", size: 10, color: "#C8956A", bold: true },
      ]
    })
  },
  {
    id: "angel",
    label: "Angel Number",
    type: "Sign",
    color: "#C8A050",
    thread: "I receive £5,000 from an unexpected source",
    audio: "Money Finds Me First",
    date: "2026-06-27",
    render: (size = 56) => ({
      bg: "linear-gradient(135deg,#1a1400,#0e0e00)",
      border: "#3a3000",
      content: [
        { text: "5:55", size: size > 48 ? 20 : 13, color: "#C8A050", bold: true },
        { text: "AM", size: 9, color: "#8a7848" },
        { text: "◈ ◈ ◈", size: 9, color: "#C8A050" },
      ]
    })
  },
  {
    id: "email",
    label: "Email Confirmation",
    type: "Photo Proof",
    color: "#2CB7A7",
    thread: "I receive £5,000 from an unexpected source",
    audio: "Money Finds Me First",
    date: "2026-06-26",
    render: (size = 56) => ({
      bg: "linear-gradient(135deg,#0a0e14,#080810)",
      border: "#1a2030",
      content: [
        { text: "📧", size: size > 48 ? 20 : 13 },
        { text: "Payment confirmed", size: 9, color: "#2CB7A7" },
      ]
    })
  },
  {
    id: "calendar",
    label: "Calendar Invite",
    type: "Photo Proof",
    color: "#5B8DB8",
    thread: "I receive £5,000 from an unexpected source",
    audio: "I Have Always Been The Prize",
    date: "2026-06-25",
    render: (size = 56) => ({
      bg: "linear-gradient(135deg,#0a0e18,#080812)",
      border: "#1a2040",
      content: [
        { text: "📅", size: size > 48 ? 20 : 13 },
        { text: "Jul 7 · Meeting", size: 9, color: "#5B8DB8" },
      ]
    })
  },
  {
    id: "receipt",
    label: "Receipt",
    type: "Photo Proof",
    color: "#4a9a5a",
    thread: "I receive £5,000 from an unexpected source",
    audio: "Money Finds Me First",
    date: "2026-06-24",
    render: () => ({
      bg: "linear-gradient(135deg,#0a140a,#081008)",
      border: "#1a401a",
      content: [
        { text: "RECEIPT", size: 9, color: "#4a9a5a", bold: true, spacing: "0.15em" },
        { text: "£5,000.00", size: 14, color: "#f4ead8", bold: true },
      ]
    })
  },
  {
    id: "skin",
    label: "Skin Progress",
    type: "Photo Proof",
    color: "#C8956A",
    thread: "My skin looks clear, smooth, and luminous",
    audio: "Gorgeous Is My Default Setting",
    date: "2026-06-22",
    render: (size = 56) => ({
      bg: "linear-gradient(135deg,#1a100e,#0e0808)",
      border: "#3a2018",
      content: [
        { text: "✦", size: size > 48 ? 20 : 13, color: "#C8956A" },
        { text: "Day 21 · Glow", size: 9, color: "#C8956A", bold: true },
      ]
    })
  },
];

// Render a proof photo card (mini or full)
export function ProofCard({ asset, size = 56, radius = 8, showLabel = false }) {
  const { bg, border, content } = asset.render(size);
  return (
    <div style={{
      width: size, height: size, borderRadius: radius, flexShrink: 0,
      background: bg, border: `1px solid ${border}`,
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: 2, overflow: "hidden", padding: 4,
    }}>
      {content.map((line, i) => (
        <div key={i} style={{
          fontSize: line.size || 10, color: line.color || "#f4ead8",
          fontWeight: line.bold ? 700 : 400,
          letterSpacing: line.spacing || "normal",
          textAlign: "center", lineHeight: 1.2,
          fontFamily: line.bold ? "Inter, sans-serif" : "Inter, sans-serif",
        }}>{line.text}</div>
      ))}
    </div>
  );
}

// Mini thumbnail stack (3 small cards overlapping)
export function ProofThumbnailStack({ assets = [], size = 28 }) {
  const shown = assets.slice(0, 3);
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {shown.map((a, i) => (
        <div key={a.id} style={{ marginLeft: i > 0 ? -8 : 0, zIndex: shown.length - i }}>
          <ProofCard asset={a} size={size} radius={5} />
        </div>
      ))}
    </div>
  );
}
