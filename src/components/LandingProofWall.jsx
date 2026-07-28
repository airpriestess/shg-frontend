/* LandingProofWall — auto-scrolling carousel, alternating black/white/LG cards */
import { useEffect, useRef, useState } from "react";

const LG = "linear-gradient(135deg,#F5E0A0 0%,#E8B870 20%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";

const WALL = [
  {
    desire: "He always texts me first and initiates plans.",
    category: "Lovemaxxing", days: 5, signs: 5,
    track: "a Lovemaxxing track", feel: "He's not chasing me. He's remembering me.",
    log: [
      "Day 1: Old belief — \"I've never been chosen. He'll never choose me first.\" Started listening.",
      "Day 2: He texted first — \"thinking about you.\"",
      "Day 3: He asked to see me this weekend, unprompted.",
      "Day 4: He texted first again, no gap, no waiting.",
      "Day 5: He planned the whole date — time, place, all of it.",
    ]
  },
  {
    desire: "I am now making £5,000 a day from my business.",
    category: "Businessmaxxing", days: 31, signs: 4,
    track: "a Businessmaxxing track", feel: "The number kept moving and I stopped being shocked by it.",
    log: [
      "Day 1: Old belief — \"It's impossible for me to make the income I actually want.\"",
      "Week 1: £1,000 in a day for the first time.",
      "Week 2: £2,000 in a day. Same store, same offer, nothing changed but me.",
      "Week 4: £5,000 in a day. Then again. Then it became normal.",
    ]
  },
  {
    desire: "Clear, calm skin — no more hiding under makeup.",
    category: "Beautymaxxing", days: 9, signs: 3,
    track: "a Beautymaxxing track", feel: "I catch myself in mirrors now instead of avoiding them.",
    log: [
      "Day 1: Old belief — \"My skin will always be a problem I have to cover up.\"",
      "Day 3: A stranger stopped me to ask what I use on my skin.",
      "Day 6: My sister said I looked different — \"lit from inside.\"",
      "Day 9: First time in years I left the house with no makeup on, on purpose.",
    ]
  },
  {
    desire: "£1,800 refund out of nowhere.",
    category: "Moneymaxxing", days: 4, signs: 2,
    track: "a Moneymaxxing track", feel: "Money really does find me first.",
    log: [
      "Day 1: Old belief — \"It's so hard to attract money out of thin air.\"",
      "Day 2: £1,800 landed in my account as a refund. Still don't know what it was for.",
      "Day 4: Marked manifested.",
    ]
  },
  {
    desire: "Everything just works out for me, every single time.",
    category: "Luckygirlmaxxing", days: 7, signs: 4,
    track: "a Luckygirlmaxxing track", feel: "Things stopped being a fight. They just... aligned.",
    log: [
      "Day 1: Old belief — \"Everyone else is lucky. Never me.\"",
      "Day 2: Flight got cancelled — rebooked me business class, no charge.",
      "Day 4: The exact parking spot, every single day this week.",
      "Day 7: Got picked for something I forgot I'd even applied for.",
    ]
  },
  {
    desire: "Promoted to the role I actually wanted.",
    category: "Desiresmaxxing", days: 18, signs: 3,
    track: "a Desiresmaxxing track", feel: "I stopped shrinking myself in meetings. People noticed before I said anything.",
    log: [
      "Day 1: Old belief — \"I have to overwork just to be seen as good enough.\"",
      "Day 6: My manager asked me to lead the project I'd been quietly wanting.",
      "Day 18: Offered the promotion. They said it was 'obvious' I was ready.",
    ]
  },
  {
    desire: "I finally lost the last 20 pounds I'd been stuck on for three years.",
    category: "Skinnymaxxing", days: 21, signs: 3,
    track: "a Skinnymaxxing track", feel: "It was never about willpower.",
    log: [
      "Day 1: Old belief — \"I've tried so hard to lose the last 20 pounds and nothing works.\"",
      "Day 9: Cravings that used to run my evenings just... quieted down.",
      "Day 21: Down 6 pounds without changing my diet.",
    ]
  },
  {
    desire: "I stopped shrinking myself to make other people comfortable.",
    category: "Selfmaxxing", days: 12, signs: 3,
    track: "a Selfmaxxing track", feel: "I used to over-explain every boundary. Now I just don't.",
    log: [
      "Day 1: Old belief — \"Putting myself first makes me selfish.\"",
      "Day 5: Said no to something without the usual guilt spiral.",
      "Day 12: A friend said 'you seem different — more you.'",
    ]
  },
];

// Card style cycles: black → white → LG gradient → black → ...
function getCardStyle(i) {
  const cycle = i % 3;
  if (cycle === 0) return { bg: "#000", text: "#f2ece4", mu: "#e8e0d8", logBg: "#111", badgeBg: "rgba(255,255,255,0.1)", badgeColor: "#E8B870", feelColor: "#ddd0c8" };
  if (cycle === 1) return { bg: "#ffffff", text: "#000", mu: "#444", logBg: "#f5f5f5", badgeBg: "#f0f0f0", badgeColor: "#000", feelColor: "#555" };
  return { bg: LG, text: "#000", mu: "#000", logBg: "rgba(0,0,0,0.1)", badgeBg: "rgba(0,0,0,0.12)", badgeColor: "#000", feelColor: "#1a1a1a" };
}

export default function LandingProofWall({ isMobile }) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const CARD_W = isMobile ? 300 : 420;
  const GAP = 16;
  const total = WALL.length;

  // Auto-advance every 3.5s
  useEffect(() => {
    const id = setInterval(() => {
      setActive(a => {
        const next = (a + 1) % total;
        trackRef.current?.scrollTo({ left: next * (CARD_W + GAP), behavior: "smooth" });
        return next;
      });
    }, 3500);
    return () => clearInterval(id);
  }, [total, CARD_W, GAP]);

  // Sync dot on manual scroll
  const onScroll = () => {
    if (!trackRef.current) return;
    const idx = Math.round(trackRef.current.scrollLeft / (CARD_W + GAP));
    setActive(Math.min(Math.max(idx, 0), total - 1));
  };

  const goTo = (i) => {
    setActive(i);
    trackRef.current?.scrollTo({ left: i * (CARD_W + GAP), behavior: "smooth" });
  };

  return (
    <div style={{ padding: isMobile ? "48px 0 56px" : "70px 0 80px", background: "#000", width: "100%" }}>

      {/* Heading */}
      <div style={{ textAlign: "center", marginBottom: 32, padding: "0 24px" }}>
        <div style={{ fontSize: 13, color: "#E8B870", fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 16, fontFamily: "'Jost',sans-serif" }}>ProofOS ✦</div>
        <div style={{ fontSize: isMobile ? "clamp(44px,13vw,64px)" : "clamp(56px,6vw,80px)", color: "#f2ece4", fontFamily: "'Jost',sans-serif", fontWeight: 400, letterSpacing: "-0.03em", lineHeight: 0.95, marginBottom: 20 }}>
          The Proof Wall.
        </div>
        <p style={{ fontSize: isMobile ? 16 : 19, color: "#f2ece4", lineHeight: 1.8, maxWidth: 480, margin: "0 auto", fontWeight: 400, fontFamily: "'Jost',sans-serif" }}>
          Every desire. Every sign. Every moment it arrived. Logged, dated, permanent.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 28, padding: "0 24px", maxWidth: 640, margin: "0 auto 28px" }}>
        {[["100","Intentions set","#F5E0A0"],["20","Manifested","#BFA5D8"],["200","Signs logged","#2CB7A7"]].map(([v,l,col],i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "18px 8px", textAlign: "center", border: `1px solid ${col}44` }}>
            <div style={{ fontSize: 42, fontWeight: 300, background: `linear-gradient(135deg,${col} 0%,#E8B870 60%,${col} 100%)`, WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "'Jost',sans-serif", lineHeight: 1 }}>{v}</div>
            <div style={{ fontSize: 10, fontWeight: 500, color: col, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 8, fontFamily: "'Jost',sans-serif", opacity: 0.85 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Carousel track */}
      <div style={{ position: "relative" }}>
        <div
          ref={trackRef}
          onScroll={onScroll}
          style={{
            display: "flex",
            gap: GAP,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            padding: isMobile ? `0 24px ${GAP}px` : `0 calc((100vw - ${CARD_W}px) / 2) ${GAP}px`,
          }}
        >
          {WALL.map((d, i) => {
            const s = getCardStyle(i);
            return (
              <div
                key={i}
                style={{
                  flexShrink: 0,
                  width: CARD_W,
                  borderRadius: 20,
                  padding: "28px 24px",
                  background: s.bg,
                  scrollSnapAlign: "center",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
                }}
              >
                {/* Badge + days */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <span style={{ fontSize: 11, padding: "4px 12px", background: s.badgeBg, color: s.badgeColor, borderRadius: 20, fontWeight: 500, fontFamily: "'Jost',sans-serif", letterSpacing: "0.06em" }}>✓ {d.category}</span>
                  <span style={{ fontSize: 11, color: s.mu, fontWeight: 400, fontFamily: "'Jost',sans-serif" }}>{d.days}d · {d.signs} signs</span>
                </div>

                {/* Desire */}
                <div style={{ fontSize: 18, fontWeight: 400, color: s.text, marginBottom: 8, lineHeight: 1.4, fontFamily: "'Jost',sans-serif" }}>{d.desire}</div>
                <div style={{ fontSize: 12, color: s.mu, marginBottom: 16, fontFamily: "'Jost',sans-serif" }}>♪ {d.track}</div>

                {/* Log */}
                <div style={{ background: s.logBg, borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
                  {d.log.map((line, li) => (
                    <div key={li} style={{ fontSize: 13, color: s.text, lineHeight: 1.7, marginBottom: li === d.log.length - 1 ? 0 : 6, fontFamily: "'Jost',sans-serif" }}>{line}</div>
                  ))}
                </div>

                {/* Feel */}
                <div style={{ fontSize: 13, color: s.feelColor, lineHeight: 1.5, fontFamily: "'Jost',sans-serif", fontStyle: "italic" }}>"{d.feel}"</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dot indicators */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
        {WALL.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === active ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background: i === active ? LG : "rgba(255,255,255,0.25)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "width 0.3s, background 0.3s",
            }}
          />
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#e8e0d8", fontWeight: 400, fontFamily: "'Jost',sans-serif" }}>
        Included in Goddess Tier ✦ · Your evidence, forever
      </div>
    </div>
  );
}
