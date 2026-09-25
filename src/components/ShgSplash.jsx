import { useEffect, useState } from "react";

// Opening screen: her logo and a fresh affirmation every time the app loads.
// Stored in the app, so it costs nothing per open.
const AFFIRMATIONS = [
  "Everything is always working out for me.",
  "I am the luckiest girl in the world.",
  "Money finds me first.",
  "He chooses me, every single day.",
  "I am chosen first, always.",
  "My desires are already on their way.",
  "Life conspires in my favour.",
  "I receive with ease.",
  "Every sign is proof. I notice them all.",
  "I am magnetic to what I want.",
  "Beauty is my default.",
  "I get paid to exist.",
  "What is meant for me cannot miss me.",
  "I sleep, and I manifest.",
  "Today, something wonderful finds me.",
  "I am already her.",
  "Doubt leaves. Proof stays.",
  "I am worthy of all of it.",
];

export default function ShgSplash({ theme = "dark" }) {
  const [phase, setPhase] = useState(() => {
    try { return sessionStorage.getItem("shg_splash_seen") ? "done" : "in"; } catch { return "in"; }
  });
  const [line] = useState(() => AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]);

  useEffect(() => {
    if (phase === "done") return;
    try { sessionStorage.setItem("shg_splash_seen", "1"); } catch {}
    const t1 = setTimeout(() => setPhase("out"), 2600);
    const t2 = setTimeout(() => setPhase("done"), 3300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (phase === "done") return null;
  const dark = theme !== "light";
  return (
    <div className="shg-splash" onClick={() => setPhase("out")} style={{
      position: "fixed", inset: 0, zIndex: 10000, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 28, padding: "0 32px", textAlign: "center",
      background: dark ? "#000" : "#F2ECE4", color: dark ? "#F2ECE4" : "#000",
      opacity: phase === "out" ? 0 : 1, transition: "opacity .7s ease", cursor: "pointer",
    }}>
      <div style={{ position: "absolute", width: 360, height: 360, borderRadius: "50%", filter: "blur(60px)",
        background: "radial-gradient(circle at 35% 40%,rgba(245,224,160,.18),transparent 55%),radial-gradient(circle at 65% 60%,rgba(44,183,167,.30),transparent 60%),radial-gradient(circle at 50% 50%,rgba(191,165,216,.35),transparent 70%)",
        animation: "shg-splash-breathe 3s ease-in-out infinite" }} />
      <img src="/logo_transparent_cropped.png" alt="Self Hypnosis Goddess" style={{ position: "relative", width: 96, height: 96, animation: "shg-splash-breathe 3s ease-in-out infinite" }} />
      <div style={{ position: "relative", fontSize: 18, lineHeight: 1.5, fontWeight: 400, maxWidth: 320, animation: "shg-splash-rise 1.2s ease .4s both" }}>{line}</div>
      <div style={{ position: "relative", fontSize: 10, letterSpacing: ".4em", animation: "shg-splash-rise 1.2s ease .8s both" }}>SELF HYPNOSIS GODDESS</div>
      <style>{`@keyframes shg-splash-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
@keyframes shg-splash-rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){.shg-splash *{animation:none!important}}`}</style>
    </div>
  );
}
