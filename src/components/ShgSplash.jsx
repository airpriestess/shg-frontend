import { useEffect, useRef, useState } from "react";

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
  // Shows on every visit to the portal (members and the beta preview alike).
  const [phase, setPhase] = useState("in");
  const [line] = useState(() => AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)]);

  useEffect(() => {
    if (phase === "done") return;
    const t1 = setTimeout(() => setPhase("out"), 4000);
    const t2 = setTimeout(() => setPhase("done"), 4700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const cv = useRef(null);
  useEffect(() => {
    const c = cv.current; if (!c) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = c.width = innerWidth * dpr, H = c.height = innerHeight * dpr;
    const ctx = c.getContext("2d"), cols = ["#F2ECE4","#F2ECE4","#F2ECE4","#F5E0A0","#2CB7A7","#BFA5D8"];
    const P = Array.from({ length: 220 }, () => ({ a: Math.random() * 6.283, r: (0.2 + Math.random()) * Math.max(W, H) * 0.7, s: 0.004 + Math.random() * 0.012, z: 0.5 + Math.random() * 1.8, c: cols[(Math.random() * 6) | 0] }));
    let raf, t0 = performance.now();
    const draw = (t) => {
      const k = Math.min((t - t0) / 2600, 1);
      ctx.clearRect(0, 0, W, H);
      for (const p of P) {
        if (!reduce) { p.r *= 1 - p.s * (0.6 + k); p.a += 0.002 + p.s * 0.3; if (p.r < 40 * dpr) p.r = Math.max(W, H) * 0.75; }
        const x = W / 2 + Math.cos(p.a) * p.r, y = H / 2 + Math.sin(p.a) * p.r;
        ctx.globalAlpha = Math.min(1, p.r / (160 * dpr));
        ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(x, y, p.z * dpr, 0, 6.283); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [phase === "done"]);

  if (phase === "done") return null;
  const dark = theme !== "light";
  return (
    <div className="shg-splash" onClick={() => setPhase("out")} style={{
      position: "fixed", inset: 0, zIndex: 10000, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 28, padding: "0 32px", textAlign: "center",
      background: dark ? "#000" : "#F2ECE4", color: dark ? "#F2ECE4" : "#000",
      opacity: phase === "out" ? 0 : 1, transition: "opacity .7s ease", cursor: "pointer",
    }}>
      <canvas ref={cv} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      <img src="/logo_transparent_cropped.png" alt="Self Hypnosis Goddess" style={{ position: "relative", width: "clamp(88px, 11vw, 170px)", height: "clamp(88px, 11vw, 170px)", filter: "drop-shadow(-6px -4px 14px rgba(245,224,160,.55)) drop-shadow(6px 6px 16px rgba(44,183,167,.5)) drop-shadow(0 0 10px rgba(191,165,216,.5))", animation: "shg-splash-breathe 3s ease-in-out infinite" }} />
      <div style={{ position: "relative", fontSize: "clamp(19px, 3.3vw, 50px)", lineHeight: 1.45, fontWeight: 400, maxWidth: "min(760px, 88vw)", textShadow: "0 0 14px #000, 0 0 4px #000", animation: "shg-splash-rise 1.2s ease .4s both" }}>{line}</div>
      <div style={{ position: "relative", fontSize: "clamp(11px, 1.55vw, 23px)", letterSpacing: ".4em", lineHeight: 1.8, maxWidth: "90vw", textShadow: "0 0 10px #000, 0 0 3px #000", animation: "shg-splash-rise 1.2s ease .8s both" }}>WELCOME TO THE SELF HYPNOSIS GODDESS UNIVERSE</div>
      <style>{`@keyframes shg-splash-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
@keyframes shg-splash-drift{to{margin-left:24px;margin-top:-18px}}
@keyframes shg-splash-rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){.shg-splash *{animation:none!important}}`}</style>
    </div>
  );
}
