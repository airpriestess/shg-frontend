/* LandingProofWall — clean white cards, black text, Jost throughout */

const OMBRE_BG = "#000000";
const PC = { text:"#f2ece4", mu:"#e8e0d8" };

const WALL = [
  {
    desire: "He always texts me first and initiates plans.",
    category: "Lovemaxxing", days: 5, signs: 5,
    track: "a Lovemaxxing track", feel: "He's not chasing me. He's remembering me.",
    log: [
      "Day 1: Old belief — \"I've never been chosen. He'll never choose me first.\" Started listening to a Lovemaxxing track.",
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
      "Day 1: Old belief — \"It's impossible for me to make the income I actually want.\" Started listening to a Businessmaxxing track.",
      "Week 1: £1,000 in a day for the first time — screenshot saved.",
      "Week 2: £2,000 in a day. Same store, same offer, nothing changed but me.",
      "Week 3: £3,500 in a day — a launch that shouldn't have worked, worked.",
      "Week 4: £5,000 in a day. Then again. Then it became normal.",
    ]
  },
  {
    desire: "Clear, calm skin — no more hiding under makeup.",
    category: "Beautymaxxing", days: 9, signs: 3,
    track: "a Beautymaxxing track", feel: "I catch myself in mirrors now instead of avoiding them.",
    log: [
      "Day 1: Old belief — \"My skin will always be a problem I have to cover up.\" Started listening to a Beautymaxxing track — I'd been dealing with breakouts and rosacea flare-ups for years.",
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
      "Day 1: Old belief — \"It's so hard to attract money out of thin air.\" Started listening to a Moneymaxxing track.",
      "Day 2: £1,800 landed in my account as a refund. I still don't know what it was for. Got paid automatically, no explanation.",
      "Day 4: Marked manifested.",
    ]
  },
  {
    desire: "Everything just works out for me, every single time.",
    category: "Luckygirlmaxxing", days: 7, signs: 4,
    track: "a Luckygirlmaxxing track", feel: "Things stopped being a fight. They just... aligned.",
    log: [
      "Day 1: Old belief — \"Everyone else is lucky. Never me.\" Started listening to a Luckygirlmaxxing track.",
      "Day 2: Flight got cancelled — rebooked me business class, no charge.",
      "Day 4: The exact parking spot, every single day this week.",
      "Day 7: Got picked for something I forgot I'd even applied for.",
    ]
  },
  {
    desire: "Promoted to the role I actually wanted, not the one I settled for.",
    category: "Careermaxxing", days: 18, signs: 3,
    track: "a Careermaxxing track", feel: "I stopped shrinking myself in meetings. People noticed before I said anything.",
    log: [
      "Day 1: Old belief — \"I have to overwork just to be seen as good enough.\" Started listening to a Careermaxxing track.",
      "Day 6: My manager asked me to lead the project I'd been quietly wanting.",
      "Day 18: Offered the promotion. They said it was 'obvious' I was ready.",
    ]
  },
  {
    desire: "I finally lost the last 20 pounds I'd been stuck on for three years.",
    category: "Skinnymaxxing", days: 21, signs: 3,
    track: "a Skinnymaxxing track", feel: "It was never about willpower — I'd tried everything and stayed stuck on the exact same 20 pounds.",
    log: [
      "Day 1: Old belief — \"I've tried so hard to lose the last 20 pounds and nothing works.\" Started listening to a Skinnymaxxing track.",
      "Day 9: Cravings that used to run my evenings just... quieted down.",
      "Day 21: Down 6 pounds without changing my diet. Jeans I'd kept 'for motivation' finally fit.",
    ]
  },
  {
    desire: "A six-pack and lean legs — the body I kept starting over for.",
    category: "Bodymaxxing", days: 14, signs: 2,
    track: "a Bodymaxxing track", feel: "I used to slouch to disappear. I don't anymore.",
    log: [
      "Day 1: Old belief — \"My body doesn't change no matter what I do.\" Started listening to a Bodymaxxing track.",
      "Day 8: Caught myself standing taller without deciding to. Definition starting to show.",
      "Day 14: A stranger complimented my legs at the gym. Never happened before.",
    ]
  },
  {
    desire: "I stopped shrinking myself to make other people comfortable.",
    category: "Selfmaxxing", days: 12, signs: 3,
    track: "a Selfmaxxing track", feel: "I used to over-explain every boundary. Now I just don't.",
    log: [
      "Day 1: Old belief — \"Putting myself first makes me selfish.\" Started listening to a Selfmaxxing track.",
      "Day 5: Said no to something without the usual guilt spiral.",
      "Day 12: A friend said 'you seem different — more you.'",
    ]
  },
  {
    desire: "I am confident, magnetic, and fully present in the bedroom.",
    category: "Erosmaxxing", days: 16, signs: 2,
    track: "an Erosmaxxing track", feel: "That's what actually shifted — not my body, the belief underneath it.",
    log: [
      "Day 1: Old belief — \"I'm not good enough in the bedroom.\" Started listening to an Erosmaxxing track — writing the belief down made it impossible to ignore.",
      "Day 9: Stopped performing confidence and started actually feeling it.",
      "Day 16: My partner asked what changed. I didn't have to explain — I just knew.",
    ]
  },
  {
    desire: "My back pain finally eased — not managed, actually eased.",
    category: "Healmaxxing", days: 24, signs: 2,
    track: "a Healmaxxing track", feel: "I didn't realise how much I was holding until it started to let go.",
    log: [
      "Day 1: Old belief — \"This pain is just something I have to live with.\" Started listening to a Healmaxxing track.",
      "Day 11: Noticed I'd gone days without reaching for painkillers.",
      "Day 24: Sat through a full day at my desk with no flare-up. First time in years.",
    ]
  },
  {
    desire: "100% on my exam.",
    category: "Studymaxxing", days: 10, signs: 2,
    track: "a Studymaxxing track", feel: "I didn't even realise how loud that belief was until it went quiet.",
    log: [
      "Day 1: Old belief — \"I'm not smart enough.\" Started listening to a Studymaxxing track. Wrote the old belief down to let it go.",
      "Day 6: Revision stopped feeling like proving myself and started feeling like just... knowing it.",
      "Day 10: 100%. Messaged my mum a screenshot before I even processed it.",
    ]
  },
];

const MEDIA = [
  { icon: "💬", label: "He texts me first · 19 Jun" },
  { icon: "💰", label: "£1,800 refund · 28 Jun" },
  { icon: "🎤", label: "Voice note · 20 Jun" },
  { icon: "✦",  label: "The sign I asked for · 1 Jul" },
];

export default function LandingProofWall({ isMobile }) {
  return (
    <div style={{ padding: isMobile?"48px 0":"70px 0", background: OMBRE_BG, width:"100%" }}>
      <div style={{ padding: isMobile?"0 18px":"0 24px", maxWidth: 640, margin:"0 auto", fontFamily:"'Jost',sans-serif" }}>

        {/* Heading */}
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontSize:13, color:"#2CB7A7", fontWeight:500, letterSpacing:"0.3em", textTransform:"uppercase", marginBottom:16 }}>ProofOS ✦</div>
          <div style={{ fontSize: isMobile?"clamp(44px,13vw,64px)":"clamp(56px,8vw,80px)", color:"#f2ece4", fontFamily:"'Jost',sans-serif", fontWeight:400, letterSpacing:"-0.03em", lineHeight:0.95, marginBottom:20 }}>
            The Proof Thread.
          </div>
          <p style={{ fontSize: isMobile?16:19, color:"#f2ece4", lineHeight:1.8, maxWidth:480, margin:"0 auto 14px", fontWeight:400 }}>
            Track every manifestation in one place — for the rest of your life. Never lose your desires in a dusty journal again.
          </p>
          <p style={{ fontSize: isMobile?14:16, color:"#ddd0c8", lineHeight:1.75, maxWidth:520, margin:"0 auto" }}>
            Every thread starts with your old assumption — the belief you're actually working against — logged the moment you start listening. As the signs come in, you watch it shift into a new assumption in real time. That's the proof: not just that something manifested, but that the belief underneath it changed first.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:20 }}>
          {[["6","Intentions"],["6","Manifested"],["18","Signs logged"]].map(([v,l],i)=>(
            <div key={i} style={{ background:"rgba(255,255,255,0.06)", borderRadius:12, padding:"14px 6px", textAlign:"center" }}>
              <div style={{ fontSize:24, fontWeight:400, color:"#f2ece4" }}>{v}</div>
              <div style={{ fontSize:10, color:"#e8e0d8", fontWeight:400, letterSpacing:"0.1em", textTransform:"uppercase", marginTop:4 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Cards — white, black text */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {WALL.map((d,i)=>(
            <div key={i} style={{ background:"#ffffff", borderRadius:14, padding:"20px 18px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                <span style={{ fontSize:11, padding:"4px 10px", background:"#f0f0f0", color:"#000", borderRadius:20, fontWeight:400, fontFamily:"'Jost',sans-serif" }}>✓ {d.category}</span>
                <span style={{ fontSize:11, color:"#000", fontWeight:400 }}>{d.days}d · {d.signs} signs</span>
              </div>
              <div style={{ fontSize: isMobile?16:17, fontWeight:400, color:"#000", marginBottom:6, lineHeight:1.4, fontFamily:"'Jost',sans-serif" }}>{d.desire}</div>
              <div style={{ fontSize:12, color:"#666", fontWeight:400, marginBottom:12, fontFamily:"'Jost',sans-serif" }}>♪ {d.track}</div>
              <div style={{ background:"#f8f8f8", borderRadius:10, padding:"12px 14px", marginBottom:12 }}>
                {d.log.map((line,li)=>(
                  <div key={li} style={{ fontSize:13, color:"#000", lineHeight:1.7, marginBottom: li===d.log.length-1?0:6, fontFamily:"'Jost',sans-serif" }}>{line}</div>
                ))}
              </div>
              <div style={{ fontSize:13, color:"#444", lineHeight:1.5, fontFamily:"'Jost',sans-serif" }}>"{d.feel}"</div>
            </div>
          ))}
        </div>

        {/* Captured proof */}
        <div style={{ fontSize:12, fontWeight:400, color:"#f2ece4", letterSpacing:"0.15em", textTransform:"uppercase", margin:"20px 0 10px" }}>All captured proof</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(90px,1fr))", gap:8 }}>
          {MEDIA.map((m,i)=>(
            <div key={i} style={{ background:"#ffffff", borderRadius:10, padding:8 }}>
              <div style={{ width:"100%", height:72, display:"flex", alignItems:"center", justifyContent:"center", borderRadius:7, background:"#f8f8f8" }}>
                <span style={{ fontSize:28 }}>{m.icon}</span>
              </div>
              <div style={{ fontSize:10, fontWeight:400, color:"#000", marginTop:6, lineHeight:1.4, fontFamily:"'Jost',sans-serif" }}>{m.label}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign:"center", marginTop:24, fontSize:13, color:"#e8e0d8", fontWeight:400 }}>Included in Goddess Tier ✦ · Your evidence, forever</div>
      </div>
    </div>
  );
}
