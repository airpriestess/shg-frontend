import { T } from "../design/tokens.js";

const RG = "#B76E79";
const G = "linear-gradient(90deg,#d4a090,#B76E79)";

const SECTIONS = [
  {
    heading: "When to listen",
    content: [
      { title: "Morning — first thing on waking", body: "Before you check your phone. Before the day's identity kicks back in. Your subconscious has been active all night and is still in a soft, receptive state. This is the most powerful window for installation." },
      { title: "Evening — last thing before sleep", body: "The threshold of sleep is a theta state — the same brainwave state hypnosis targets. What you feed your subconscious at this moment is what it works on through the night. Make it Reshma's voice." },
      { title: "Between tasks — in the gap", body: "Not always possible, but if you have 20–30 minutes between calls, on a lunch break, or in the car — use it. Your nervous system softens faster when it has been conditioned through repeated use." },
      { title: "After meditation", body: "If you meditate already, play a track immediately after. Your brainwaves are already slowed. The hypnosis installs faster." },
    ]
  },
  {
    heading: "How to listen",
    content: [
      { title: "Use headphones", body: "Required for binaural beats and EMDR tracks. The bilateral audio is designed to stimulate both hemispheres simultaneously — this only works with one ear on each side. Speakers will not deliver the same effect." },
      { title: "Lie down if possible", body: "The body reads lying down as safe. Safety drops cortisol. When cortisol drops, the critical conscious mind relaxes and the subconscious becomes more open. Sitting works too — but lying down deepens it." },
      { title: "Eyes closed", body: "The visual cortex is one of the most active parts of the brain. Closing your eyes redirects that energy inward and makes it significantly easier to enter a hypnotic state." },
      { title: "Do not try to make it happen", body: "The fastest way to resist hypnosis is to try to force it. Your only job is to listen and follow Reshma's voice. The installation happens below the level of your awareness. You do not need to feel anything for it to work." },
      { title: "If you fall asleep", body: "That is the goal. Falling asleep during the track means your conscious mind has stepped aside completely. The subliminal layer continues installing while you sleep. This is a feature, not a failure." },
    ]
  },
  {
    heading: "How often",
    content: [
      { title: "Daily is ideal", body: "Repetition is how the subconscious installs new programming. Think of each listen as adding one layer. A single listen creates awareness. Thirty consecutive listens creates a new identity. Consistency is the practice." },
      { title: "One desire at a time", body: "Choose one Proof Thread. Listen to one audio. Build the installation in one direction before opening another. Spreading across five desires simultaneously slows all of them." },
      { title: "Minimum effective dose", body: "Even 20 minutes daily, consistently, will shift something. The full-length tracks (45–60 min) offer deeper sessions but are not required every time. The shorter tracks are specifically designed for daily maintenance." },
      { title: "How long until results", body: "Most members notice something within 3–7 days. Not always the desire itself — often a feeling of certainty, a shift in mood, or a small sign appearing. The desire typically follows. Average time from first listen to final manifestation across current members is 9–21 days." },
    ]
  },
  {
    heading: "Understanding the formats",
    content: [
      { title: "Spoken Hypnosis", body: "Reshma's voice guides you through a full induction — progressive relaxation, deepening, identity installation, and emergence. You follow along consciously at first, then drift into theta. The most active form of hypnosis. Best for identity-level shifts and specific desires." },
      { title: "Subliminal", body: "Affirmations and identity statements are layered beneath music at a volume your conscious mind cannot clearly hear — but your subconscious can process. You do not need to focus. Play it while you rest, work, or sleep. Your conscious mind does not resist what it cannot fully hear." },
      { title: "Sleep Subliminal", body: "Designed to play all night. The subliminals are embedded beneath sleep sounds, rain, or ambient frequency music. Set it as your sleep audio. The installation happens across 6–8 hours of sleep. Extremely effective for deep identity rewiring." },
      { title: "EMDR Hypnosis", body: "Eye Movement Desensitisation and Reprocessing, adapted for audio. Bilateral beats alternate left and right in your headphones, stimulating both hemispheres the way eye movement does in traditional EMDR. This unlocks emotional blocks and outdated beliefs that standard hypnosis cannot always reach. Use when resistance is high or the desire has emotional charge." },
      { title: "Binaural Audio", body: "Two separate tones — one in each ear — that your brain blends into a third perceived frequency. This third frequency matches the target brainwave state: theta for hypnosis and deep relaxation, delta for sleep, alpha for soft focus. Works only with headphones." },
      { title: "Melodic House — Reshma's signature format", body: "Hypnosis layered beneath melodic house music. This is unique to Self Hypnosis Goddess. The music holds your nervous system in a state of pleasurable engagement while Reshma's voice works on the subconscious level. You are not just listening — you are in a ritual. The music is specifically selected to reinforce the frequency of the desire being installed." },
    ]
  },
  {
    heading: "Working with Proof Threads",
    content: [
      { title: "Open a Proof Thread before you listen", body: "Each Proof Thread holds all the evidence connected to one specific desire. Open the thread, state the desire in present tense, link the audio, then press play. This anchors the session. Your subconscious works with specificity — a named desire and a linked audio is stronger than open listening." },
      { title: "Capture proof immediately after", body: "The moments immediately after a session are when shifts surface. A feeling. A thought. A change in certainty. Record it. Tap voice proof. Say it out loud. This trains your nervous system to notice evidence and reinforces the new self-concept faster." },
      { title: "Log signs when they appear", body: "You will start to notice things. Repeated numbers. Phrases appearing. Unexpected conversations. Opportunities shifting. Log them immediately in your Proof Thread. Do not wait until later. The act of logging a sign is itself part of the installation — it tells your subconscious: this is real, this is working." },
      { title: "Mark it manifested when it arrives", body: "When your desire appears — in full or in form — mark it manifested. Note the date, the days active, the final proof. This is not just record-keeping. It closes a loop in your subconscious and opens space for the next desire to install." },
    ]
  },
  {
    heading: "Common questions",
    content: [
      { title: "Can I listen to multiple audios?", body: "Yes — but work on one desire at a time per listening session. You can rotate across desires day to day, but within one session, stay focused on one thread." },
      { title: "What if I cannot relax?", body: "Start with the Sleep Subliminal format. You do not need to relax for it to work — it bypasses the need for conscious participation. Over time, returning to the same voice daily will make relaxation faster and easier." },
      { title: "I fell asleep and felt nothing", body: "That is a successful session. Feeling nothing consciously means your critical mind was fully out of the way. The installation happened." },
      { title: "How do I know if it's working?", body: "Look for shifts in feeling before shifts in circumstance. You will notice you stop thinking about the desire the same anxious way. You will feel more certain. The physical reality follows the internal shift — usually within days to weeks of that feeling changing." },
      { title: "What if I have resistance?", body: "Resistance means the new belief is bumping against an old one. This is normal and is part of the process. Switch to an EMDR track. Log the resistance in your Proof Thread. Continue listening. Resistance always dissolves before the desire arrives." },
    ]
  },
];

export default function ListeningGuide() {
  return (
    <div style={{ height: "100%", overflowY: "auto", background: "#000" }} className="mob-pb fade">
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "36px 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, color: RG, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 14 }}>Self Hypnosis Goddess</div>
          <h1 className="wm" style={{ fontSize: "clamp(36px,5vw,58px)", background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.15, marginBottom: 16 }}>
            Listening Guide
          </h1>
          <p style={{ fontSize: 18, color: T.textMuted, lineHeight: 1.85, maxWidth: 580 }}>
            Everything you need to listen effectively, build your Proof Thread, and shift into the identity where your desires are already real.
          </p>
          <div style={{ height: 1, background: "linear-gradient(90deg,#B76E7944,transparent)", marginTop: 32 }} />
        </div>

        {/* Sections */}
        {SECTIONS.map((section, si) => (
          <div key={si} style={{ marginBottom: 56 }}>
            <h2 className="wm" style={{ fontSize: "clamp(24px,3vw,36px)", background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 28, lineHeight: 1.2 }}>
              {section.heading}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {section.content.map((item, ii) => (
                <div key={ii} style={{ borderLeft: `2px solid ${ii === 0 ? "#B76E79" : "#1c1828"}`, paddingLeft: 24, paddingBottom: 28, marginLeft: 8, transition: "border-color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderLeftColor = "#B76E79"}
                  onMouseLeave={e => e.currentTarget.style.borderLeftColor = ii === 0 ? "#B76E79" : "#1c1828"}
                >
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#B76E79", marginLeft: -29, marginBottom: 12, position: "relative", zIndex: 1 }} />
                  <div style={{ fontSize: 16, fontWeight: 700, color: T.textPrimary, marginBottom: 10, lineHeight: 1.3 }}>{item.title}</div>
                  <div style={{ fontSize: 15, color: T.textMuted, lineHeight: 1.85 }}>{item.body}</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Footer note */}
        <div style={{ background: "#000000", border: "1px solid #B76E7933", borderRadius: 16, padding: "28px 32px", textAlign: "center" }}>
          <div className="wm" style={{ fontSize: 28, background: G, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 12 }}>
            This guide is always here.
          </div>
          <p style={{ fontSize: 15, color: T.textMuted, lineHeight: 1.8 }}>
            Return to it whenever you need a reminder, when resistance appears, or when you want to deepen your practice. Reshma updates it as the vault grows.
          </p>
        </div>

      </div>
    </div>
  );
}
