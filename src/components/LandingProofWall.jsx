/* LandingProofWall, scrollable carousel, one example per category */
import { useEffect, useRef, useState } from "react";

const LG = "linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)";

const WALL = [
  {
    desire: "He always texts me first and initiates plans.",
    category: "Lovemaxxing", days: 5, signs: 5,
    track: "a Lovemaxxing track", feel: "He's not chasing me. He's remembering me.",
    log: [
      "Day 1: Old belief, \"I've never been chosen first.\" Started listening to a Lovemaxxing track.",
      "Day 2: He texted first, \"thinking about you.\"",
      "Day 3: He asked to see me this weekend, unprompted.",
      "Day 4: He texted first again, no gap, no waiting.",
      "Day 5: He planned the whole date, time, place, all of it.",
    ]
  },
  {
    desire: "I am now making $5,000 a day from my business.",
    category: "Businessmaxxing", days: 31, signs: 4,
    track: "a Businessmaxxing track", feel: "The number kept moving and I stopped being shocked by it.",
    log: [
      "Day 1: Old belief, \"It's impossible for me to make the income I actually want.\" Started listening to a Businessmaxxing track.",
      "Week 1: $1,000 in a day for the first time.",
      "Week 2: $2,000 in a day. Same store, same offer, nothing changed but me.",
      "Week 4: $5,000 in a day. Then again. Then it became normal.",
    ]
  },
  {
    desire: "Clear, calm skin, no more hiding under makeup.",
    category: "Beautymaxxing", days: 9, signs: 3,
    track: "a Beautymaxxing track", feel: "I catch myself in mirrors now instead of avoiding them.",
    log: [
      "Day 1: Old belief, \"My skin will always be a problem I have to cover up.\" Started listening to a Beautymaxxing track.",
      "Day 3: A stranger stopped me to ask what I use on my skin.",
      "Day 6: My sister said I looked different, \"lit from inside.\"",
      "Day 9: First time in years I left the house with no makeup on, on purpose.",
    ]
  },
  {
    desire: "$1,800 refund out of nowhere.",
    category: "Richgirlmaxxing", days: 4, signs: 2,
    track: "a Richgirlmaxxing track", feel: "Money really does find me first.",
    log: [
      "Day 1: Old belief, \"It's so hard to attract money out of thin air.\" Started listening to a Richgirlmaxxing track.",
      "Day 2: $1,800 landed in my account as a refund. Still don't know what it was for.",
      "Day 4: Marked manifested.",
    ]
  },
  {
    desire: "Everything just works out for me, every single time.",
    category: "Luckygirlmaxxing", days: 7, signs: 4,
    track: "a Luckygirlmaxxing track", feel: "Things stopped being a fight. They just... aligned.",
    log: [
      "Day 1: Old belief, \"Everyone else is lucky. Never me.\" Started listening to a Luckygirlmaxxing track.",
      "Day 2: Flight got cancelled, rebooked me business class, no charge.",
      "Day 4: The exact parking spot, every single day this week.",
      "Day 7: Got picked for something I forgot I'd even applied for.",
    ]
  },
  {
    desire: "I stopped shrinking myself to make other people comfortable.",
    category: "Selfmaxxing", days: 12, signs: 3,
    track: "a Selfmaxxing track", feel: "I used to over-explain every boundary. Now I just don't.",
    log: [
      "Day 1: Old belief, \"Putting myself first makes me selfish.\" Started listening to a Selfmaxxing track.",
      "Day 5: Said no to something without the usual guilt spiral.",
      "Day 12: A friend said 'you seem different, more you.'",
    ]
  },
  {
    desire: "Promoted to the role I actually wanted.",
    category: "Desiresmaxxing", days: 18, signs: 3,
    track: "a Desiresmaxxing track", feel: "I stopped shrinking in meetings. People noticed before I said anything.",
    log: [
      "Day 1: Old belief, \"I have to overwork just to be seen as good enough.\" Started listening to a Desiresmaxxing track.",
      "Day 6: My manager asked me to lead the project I'd been quietly wanting.",
      "Day 18: Offered the promotion. They said it was 'obvious' I was ready.",
    ]
  },
  {
    desire: "I finally lost the last 20 pounds I'd been stuck on for three years.",
    category: "Skinnymaxxing", days: 21, signs: 3,
    track: "a Skinnymaxxing track", feel: "It was never about willpower.",
    log: [
      "Day 1: Old belief, \"I've tried so hard and nothing works.\" Started listening to a Skinnymaxxing track.",
      "Day 9: Cravings that used to run my evenings just... quieted down.",
      "Day 21: Down 6 pounds without changing my diet.",
    ]
  },
  {
    desire: "My face actually looks younger than it did two years ago.",
    category: "Facemaxxing", days: 14, signs: 4,
    track: "a Facemaxxing track", feel: "I stopped checking for flaws. I started just... looking.",
    log: [
      "Day 1: Old belief, \"I've peaked. It's downhill from here.\" Started listening to a Facemaxxing track.",
      "Day 5: Noticed my jaw looks more defined.",
      "Day 10: Someone asked if I'd had work done.",
      "Day 14: My skin is doing something it hasn't done in years.",
    ]
  },
  {
    desire: "My body changed without me obsessing over it.",
    category: "Bodymaxxing", days: 30, signs: 3,
    track: "a Bodymaxxing track", feel: "My body started listening when I stopped fighting it.",
    log: [
      "Day 1: Old belief, \"My body works against me.\" Started listening to a Bodymaxxing track.",
      "Day 12: Woke up craving movement instead of dreading it.",
      "Day 30: Three people asked what I'd been doing. Nothing, that's the point.",
    ]
  },
  {
    desire: "I sleep through the night for the first time in years.",
    category: "Sleepmaxxing", days: 6, signs: 2,
    track: "a Sleepmaxxing track", feel: "I'm installing while I rest. That's the whole point.",
    log: [
      "Day 1: Old belief, \"My brain won't switch off and I can't help it.\" Started listening to a Sleepmaxxing track.",
      "Day 3: Fell asleep within 10 minutes. Woke up actually rested.",
      "Day 6: My whole morning feels different when the night was good.",
    ]
  },
  {
    desire: "I healed something I'd been carrying for 12 years.",
    category: "Healthmaxxing", days: 28, signs: 5,
    track: "a Healthmaxxing track", feel: "I didn't have to relive it to release it.",
    log: [
      "Day 1: Old belief, \"Some things just don't heal.\" Started listening to a Healthmaxxing track.",
      "Day 7: Noticed I wasn't bracing for it anymore.",
      "Day 14: The memory came up and I felt... neutral.",
      "Day 28: Talked about it to a friend without crying for the first time.",
    ]
  },
  {
    desire: "I feel genuinely at peace, not just coping.",
    category: "Peacemaxxing", days: 10, signs: 3,
    track: "a Peacemaxxing track", feel: "The baseline shifted. Calm became my default, not my goal.",
    log: [
      "Day 1: Old belief, \"I'll always be anxious. It's just who I am.\" Started listening to a Peacemaxxing track.",
      "Day 4: Hard conversation happened. I stayed regulated the whole way through.",
      "Day 10: Someone else's chaos didn't land in my body.",
    ]
  },
  {
    desire: "I passed the exam I'd failed twice before.",
    category: "Studymaxxing", days: 21, signs: 3,
    track: "a Studymaxxing track", feel: "The information started sticking instead of sliding off.",
    log: [
      "Day 1: Old belief, \"I don't have the kind of brain that retains things.\" Started listening to a Studymaxxing track.",
      "Day 9: Revised a topic once and remembered it days later.",
      "Day 21: Sat the exam. Passed with distinction.",
    ]
  },
  {
    desire: "My friend group completely changed, for the better.",
    category: "Friendmaxxing", days: 45, signs: 4,
    track: "a Friendmaxxing track", feel: "I stopped settling for people who drained me.",
    log: [
      "Day 1: Old belief, \"Real friendships are rare and I'm lucky with what I have.\" Started listening to a Friendmaxxing track.",
      "Day 14: Started declining invitations that felt obligatory.",
      "Day 30: Met someone new who felt like actual alignment.",
      "Day 45: My circle looks completely different. All chosen, all reciprocal.",
    ]
  },
  {
    desire: "I walk into rooms differently. People treat me differently.",
    category: "Confidencemaxxing", days: 11, signs: 4,
    track: "a Confidencemaxxing track", feel: "I stopped waiting to feel ready. I just walked in.",
    log: [
      "Day 1: Old belief, \"I'm confident sometimes but it always fades.\" Started listening to a Confidencemaxxing track.",
      "Day 3: Spoke up in a meeting I'd usually stay quiet in.",
      "Day 7: Someone I barely know complimented my 'presence.'",
      "Day 11: Realised I hadn't rehearsed anything in over a week.",
    ]
  },
  {
    desire: "My style finally feels like me instead of who I thought I should be.",
    category: "Stylemaxxing", days: 14, signs: 3,
    track: "a Stylemaxxing track", feel: "I stopped dressing to disappear. Now I dress to arrive.",
    log: [
      "Day 1: Old belief, \"I don't have the body or the budget for style.\" Started listening to a Stylemaxxing track.",
      "Day 5: Wore something I'd been saving for 'when I'm thinner.' Wore it now.",
      "Day 14: Three people asked where I'd been shopping. Same wardrobe, different identity.",
    ]
  },
  {
    desire: "My wellness became effortless instead of a constant fight.",
    category: "Wellnessmaxxing", days: 16, signs: 3,
    track: "a Wellnessmaxxing track", feel: "I stopped performing health and started feeling it.",
    log: [
      "Day 1: Old belief, \"I know what to do. I just can't make myself do it.\" Started listening to a Wellnessmaxxing track.",
      "Day 6: Chose the water. The walk. Not because I forced it, it just happened.",
      "Day 16: Energy baseline is higher. No supplement change. Just the identity shift.",
    ]
  },
  {
    desire: "My relationship deepened without me working for it.",
    category: "Erosmaxxing", days: 19, signs: 4,
    track: "an Erosmaxxing track", feel: "I stopped performing and started inhabiting.",
    log: [
      "Day 1: Old belief, \"Intimacy requires constant maintenance and I'm the one doing it.\" Started listening to an Erosmaxxing track.",
      "Day 5: He initiated differently. More present, less routine.",
      "Day 12: The dynamic shifted without a single conversation about it.",
      "Day 19: He said I seem different. In the best way.",
    ]
  },
  {
    desire: "My body started healing from the inside, without forcing it.",
    category: "DNAmaxxing", days: 33, signs: 5,
    track: "a DNAmaxxing track", feel: "I stopped fighting my biology and started working with it.",
    log: [
      "Day 1: Old belief, \"Genetics determined this. I can't change it.\" Started listening to a DNAmaxxing track.",
      "Day 8: Inflammation I'd had for years started reducing.",
      "Day 14: Energy levels I haven't had since my 20s.",
      "Day 33: My doctor said my bloodwork looked 'notably better.' Nothing changed but my mind.",
    ]
  },
  {
    desire: "I launched the business I'd been planning for three years.",
    category: "Sovereignmaxxing", days: 22, signs: 3,
    track: "a Sovereignmaxxing track", feel: "I stopped waiting for permission from myself.",
    log: [
      "Day 1: Old belief, \"I need more preparation before I'm ready.\" Started listening to a Sovereignmaxxing track.",
      "Day 8: Stopped editing the plan and started executing.",
      "Day 22: Live. First sale on day one.",
    ]
  },
  {
    desire: "My life started feeling like mine again.",
    category: "Lifemaxxing", days: 40, signs: 5,
    track: "a Lifemaxxing track", feel: "I stopped living someone else's version of success.",
    log: [
      "Day 1: Old belief, \"This is just what adult life feels like. You adapt.\" Started listening to a Lifemaxxing track.",
      "Day 10: Said no to a commitment I'd been dreading for months.",
      "Day 25: Booked something I'd been postponing for three years.",
      "Day 40: Woke up and thought, this is actually my life.",
    ]
  },
  {
    desire: "I started trusting my gut, and it kept being right.",
    category: "Intuitionmaxxing", days: 13, signs: 4,
    track: "an Intuitionmaxxing track", feel: "The signal was always there. I just learned to stop second-guessing it.",
    log: [
      "Day 1: Old belief, \"I overthink everything and my gut always leads me wrong.\" Started listening to an Intuitionmaxxing track.",
      "Day 4: Got a feeling about something. Followed it. It was right.",
      "Day 9: Made a decision in under a minute. Usually takes me weeks.",
      "Day 13: Four correct gut calls in two weeks. Stopped keeping count.",
    ]
  },
  {
    desire: "I'm single and it feels like a choice, not a situation.",
    category: "Singlemaxxing", days: 17, signs: 3,
    track: "a Singlemaxxing track", feel: "I stopped waiting for someone to make me feel whole.",
    log: [
      "Day 1: Old belief, \"Being single means something is wrong with me.\" Started listening to a Singlemaxxing track.",
      "Day 6: Turned down someone I'd have said yes to out of loneliness. Didn't regret it.",
      "Day 17: Genuinely prefer my own company some evenings. That's new.",
    ]
  },
];

// Card style cycles: black → cream/white → LG gradient
function getCardStyle(i) {
  const cycle = i % 3;
  if (cycle === 0) return { bg: "#000", text: "#f2ece4", mu: "#e8e0d8", logBg: "#111", badgeBg: "rgba(255,255,255,0.1)", badgeColor: "#E8B870", border: "rgba(232,184,112,0.15)" };
  if (cycle === 1) return { bg: "#ffffff", text: "#000", mu: "#444", logBg: "#f5f5f5", badgeBg: "#f0f0f0", badgeColor: "#000", border: "rgba(0,0,0,0.08)" };
  return { bg: LG, text: "#000", mu: "#000", logBg: "rgba(0,0,0,0.1)", badgeBg: "rgba(0,0,0,0.12)", badgeColor: "#000", border: "rgba(0,0,0,0.1)" };
}

export default function LandingProofWall({ isMobile }) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const CARD_W = isMobile ? 300 : 420;
  const GAP = 16;
  const total = WALL.length;

  // Auto-advance every 3.5s, pause on touch/hover
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActive(a => {
        const next = (a + 1) % total;
        trackRef.current?.scrollTo({ left: next * (CARD_W + GAP), behavior: "smooth" });
        return next;
      });
    }, 3500);
    return () => clearInterval(id);
  }, [paused, total, CARD_W, GAP]);

  // Sync dot on manual scroll, debounced so it doesn't fight touch
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let t;
    const onScroll = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const idx = Math.round(el.scrollLeft / (CARD_W + GAP));
        setActive(Math.min(Math.max(idx, 0), total - 1));
      }, 80);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => { el.removeEventListener("scroll", onScroll); clearTimeout(t); };
  }, [CARD_W, GAP, total]);

  const goTo = i => {
    setActive(i);
    trackRef.current?.scrollTo({ left: i * (CARD_W + GAP), behavior: "smooth" });
  };

  return (
    <div style={{ width: "100%", background: "#000", paddingTop: 60, paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 36, padding: "0 24px" }}>
        <div style={{ fontSize: isMobile?"clamp(36px,9vw,52px)":"clamp(48px,5vw,68px)", fontWeight:400, color:"#f2ece4", fontFamily:"'Jost',sans-serif", letterSpacing:"-0.02em", lineHeight:1.0, marginBottom:16 }}>Proof Wall</div>
        <h2 style={{ fontSize: isMobile ? 26 : 36, fontWeight: 400, color: "#f2ece4", lineHeight: 1.2, fontFamily: "'Jost',sans-serif", marginBottom: 12 }}>
          Real results. Every category.
        </h2>
        <p style={{ fontSize: isMobile ? 14 : 17, color: "#e8e0d8", lineHeight: 1.7, maxWidth: 480, margin: "0 auto", fontFamily: "'Jost',sans-serif", fontWeight: 300 }}>
          One result per category, logged inside the app, exactly as it happened.
        </p>
      </div>

      {/* Dot navigation */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 20, flexWrap: "wrap", padding: "0 24px" }}>
        {WALL.map((_, i) => (
          <button
            key={i}
            onClick={() => { setPaused(true); goTo(i); }}
            style={{
              width: active === i ? 20 : 6,
              height: 6,
              borderRadius: 3,
              background: active === i ? "#E8B870" : "rgba(255,255,255,0.2)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "width 0.25s, background 0.25s",
              flexShrink: 0,
            }}
          />
        ))}
      </div>

      {/* Scroll track */}
      <div
        ref={trackRef}
        className="hscroll-ok"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
        onPointerDown={() => setPaused(true)}
        onPointerUp={() => setPaused(false)}
        style={{
          display: "flex",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-x",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          paddingLeft: isMobile ? 20 : 40,
          paddingRight: isMobile ? 20 : 40,
          gap: GAP,
          paddingBottom: 4,
        }}
      >
        {WALL.map((entry, i) => {
          const S = getCardStyle(i);
          return (
            <div
              key={i}
              style={{
                flexShrink: 0,
                width: CARD_W,
                background: S.bg,
                borderRadius: 20,
                padding: isMobile ? "22px 20px" : "28px 26px",
                border: `1px solid ${S.border}`,
                scrollSnapAlign: "start",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {/* Category + days */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", background: S.badgeBg, color: S.badgeColor, borderRadius: 20, letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "'Jost',sans-serif" }}>
                  {entry.category}
                </span>
                <span style={{ fontSize: 10, color: S.mu, fontFamily: "'Jost',sans-serif", letterSpacing: "0.08em" }}>
                  {entry.days} days · {entry.signs} signs
                </span>
              </div>

              {/* Desire */}
              <div style={{ fontSize: isMobile ? 15 : 17, fontWeight: 400, color: S.text, lineHeight: 1.45, fontFamily: "'Jost',sans-serif" }}>
                "{entry.desire}"
              </div>

              {/* Log */}
              <div style={{ background: S.logBg, borderRadius: 10, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 7 }}>
                {entry.log.map((line, j) => (
                  <div key={j} style={{ fontSize: 12, color: S.text, lineHeight: 1.5, fontFamily: "'Jost',sans-serif", fontWeight: j === 0 ? 400 : 300 }}>
                    {line}
                  </div>
                ))}
              </div>

              {/* Feel */}
              <div style={{ fontSize: 13, color: S.mu, fontStyle: "italic", fontFamily: "'Jost',sans-serif", lineHeight: 1.5, borderTop: `1px solid ${S.border}`, paddingTop: 12 }}>
                ✦ {entry.feel}
              </div>

              {/* Manifested badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "linear-gradient(135deg,#F5E0A0,#2CB7A7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, flexShrink: 0 }}>✓</div>
                <span style={{ fontSize: 11, color: S.mu, fontFamily: "'Jost',sans-serif", letterSpacing: "0.1em", textTransform: "uppercase" }}>Manifested · tracked in ProofOS</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pause/play hint on mobile */}
      {isMobile && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 18 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8B870" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"/></svg>
          <p style={{ textAlign: "center", fontSize: 13, color: "#E8B870", fontFamily: "'Jost',sans-serif", letterSpacing: "0.04em", fontWeight: 400 }}>
            Swipe to see more results
          </p>
        </div>
      )}
    </div>
  );
}
