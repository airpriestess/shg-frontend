/* LandingProofWall — clean white cards, black text, Jost throughout */

const OMBRE_BG = "#000000";
const PC = { text:"#f2ece4", mu:"#9a8878" };

const WALL = [
  {
    desire: "He always texts me first and initiates plans.",
    category: "Lovemaxxing", days: 5, signs: 5,
    track: "a Lovemaxxing track", feel: "He's not chasing me. He's remembering me.",
    log: [
      "Day 1: Started listening to a Lovemaxxing track.",
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
      "Day 1: Started listening to a Businessmaxxing track.",
      "Week 1: £1,000 in a day for the first time — screenshot saved.",
      "Week 2: £2,000 in a day. Same store, same offer, nothing changed but me.",
      "Week 3: £3,500 in a day — a launch that shouldn't have worked, worked.",
      "Week 4: £5,000 in a day. Then again. Then it became normal.",
    ]
  },
  {
    desire: "Glowing skin — compliments every single day.",
    category: "Beautymaxxing", days: 9, signs: 3,
    track: "a Beautymaxxing track", feel: "I catch myself in mirrors now.",
    log: [
      "Day 1: Started listening to a Beautymaxxing track.",
      "Day 3: A stranger stopped me to ask what I use on my skin.",
      "Day 6: My sister said I looked different — \"lit from inside.\"",
      "Day 9: Someone guessed my age five years younger, unprompted.",
    ]
  },
  {
    desire: "£1,800 refund out of nowhere.",
    category: "Moneymaxxing", days: 4, signs: 2,
    track: "a Moneymaxxing track", feel: "Money really does find me first.",
    log: [
      "Day 1: Started listening to a Moneymaxxing track.",
      "Day 2: An old invoice I'd forgotten about got settled — £1,800, no chasing.",
      "Day 4: Marked manifested.",
    ]
  },
  {
    desire: "Everything just works out for me, every single time.",
    category: "Luckygirlmaxxing", days: 7, signs: 4,
    track: "a Luckygirlmaxxing track", feel: "Things stopped being a fight. They just... aligned.",
    log: [
      "Day 1: Started listening to a Luckygirlmaxxing track.",
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
      "Day 1: Started listening to a Careermaxxing track.",
      "Day 6: My manager asked me to lead the project I'd been quietly wanting.",
      "Day 18: Offered the promotion. They said it was 'obvious' I was ready.",
    ]
  },
  {
    desire: "I finally lost the last 20 pounds I'd been stuck on for three years.",
    category: "Skinnymaxxing", days: 21, signs: 3,
    track: "a Skinnymaxxing track", feel: "The old belief was that discipline alone wasn't enough for my body. It was never about willpower — I'd tried everything and stayed stuck on the exact same 20 pounds.",
    log: [
      "Day 1: Started listening to a Skinnymaxxing track. Wrote down 'I've tried so hard to lose the last 20 pounds' — the belief I was actually working against.",
      "Day 9: Cravings that used to run my evenings just... quieted down.",
      "Day 21: Down 6 pounds without changing my diet. Jeans I'd kept 'for motivation' finally fit.",
    ]
  },
  {
    desire: "People stop and stare when I walk into a room now.",
    category: "Bodymaxxing", days: 14, signs: 2,
    track: "a Bodymaxxing track", feel: "I used to slouch to disappear. I don't anymore.",
    log: [
      "Day 1: Started listening to a Bodymaxxing track.",
      "Day 8: Caught myself standing taller without deciding to.",
      "Day 14: A stranger complimented my posture. Never happened before.",
    ]
  },
  {
    desire: "I stopped shrinking myself to make other people comfortable.",
    category: "Selfmaxxing", days: 12, signs: 3,
    track: "a Selfmaxxing track", feel: "I used to over-explain every boundary. Now I just don't.",
    log: [
      "Day 1: Started listening to a Selfmaxxing track.",
      "Day 5: Said no to something without the usual guilt spiral.",
      "Day 12: A friend said 'you seem different — more you.'",
    ]
  },
  {
    desire: "I am confident, magnetic, and fully present in the bedroom.",
    category: "Erosmaxxing", days: 16, signs: 2,
    track: "an Erosmaxxing track", feel: "The belief underneath it was 'I'm not good enough in the bedroom.' That's what actually shifted.",
    log: [
      "Day 1: Started listening to an Erosmaxxing track. The old belief was clear once I wrote it down.",
      "Day 9: Stopped performing confidence and started actually feeling it.",
      "Day 16: My partner asked what changed. I didn't have to explain — I just knew.",
    ]
  },
  {
    desire: "My nervous system finally feels safe, not just managed.",
    category: "Healmaxxing", days: 24, signs: 2,
    track: "a Healmaxxing track", feel: "I stopped bracing for the next thing to go wrong.",
    log: [
      "Day 1: Started listening to a Healmaxxing track.",
      "Day 11: Noticed I hadn't checked my phone anxiously in days.",
      "Day 24: A hard conversation happened and I stayed regulated. That never used to be possible.",
    ]
  },
  {
    desire: "100% on my exam. The belief was I was never smart enough.",
    category: "Studymaxxing", days: 10, signs: 2,
    track: "a Studymaxxing track", feel: "The old belief was 'I'm not smart enough.' I didn't even realise how loud it was until it went quiet.",
    log: [
      "Day 1: Started listening to a Studymaxxing track. Wrote the old belief down to let it go.",
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
          <div style={{ fontSize:13, color:"#e8b870", fontWeight:500, letterSpacing:"0.3em", textTransform:"uppercase", marginBottom:16 }}>ProofOS ✦</div>
          <div style={{ fontSize: isMobile?"clamp(44px,13vw,64px)":"clamp(56px,8vw,80px)", color:"#f2ece4", fontFamily:"'Jost',sans-serif", fontWeight:400, letterSpacing:"-0.03em", lineHeight:0.95, marginBottom:20 }}>
            The Proof Thread.
          </div>
          <p style={{ fontSize: isMobile?16:19, color:"#f2ece4", lineHeight:1.8, maxWidth:480, margin:"0 auto", fontWeight:400 }}>
            Track every manifestation in one place — for the rest of your life. Never lose your desires in a dusty journal again.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:20 }}>
          {[["6","Intentions"],["6","Manifested"],["18","Signs logged"]].map(([v,l],i)=>(
            <div key={i} style={{ background:"rgba(255,255,255,0.06)", borderRadius:12, padding:"14px 6px", textAlign:"center" }}>
              <div style={{ fontSize:24, fontWeight:400, color:"#f2ece4" }}>{v}</div>
              <div style={{ fontSize:10, color:"#9a8878", fontWeight:400, letterSpacing:"0.1em", textTransform:"uppercase", marginTop:4 }}>{l}</div>
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

        <div style={{ textAlign:"center", marginTop:24, fontSize:13, color:"#9a8878", fontWeight:400 }}>Included in Goddess Tier ✦ · Your evidence, forever</div>
      </div>
    </div>
  );
}
