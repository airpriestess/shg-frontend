/* LandingProofWall — clean white cards, black text, Jost throughout */

const OMBRE_BG = "#000000";
const PC = { text:"#f2ece4", mu:"#9a8878" };

const WALL = [
  {
    desire: "He always texts me first and initiates plans.",
    category: "Lovemaxxing", days: 5, signs: 5,
    track: "He Finds His Way Back", feel: "He's not chasing me. He's remembering me.",
    log: [
      "Day 1: Started listening to He Finds His Way Back.",
      "Day 2: He texted first — \"thinking about you.\"",
      "Day 3: He asked to see me this weekend, unprompted.",
      "Day 4: He texted first again, no gap, no waiting.",
      "Day 5: He planned the whole date — time, place, all of it.",
    ]
  },
  {
    desire: "I am now making £5,000 a day from my business.",
    category: "Moneymaxxing", days: 31, signs: 4,
    track: "Money Finds Me First", feel: "The number kept moving and I stopped being shocked by it.",
    log: [
      "Week 1: £1,000 in a day for the first time — screenshot saved.",
      "Week 2: £2,000 in a day. Same store, same offer, nothing changed but me.",
      "Week 3: £3,500 in a day — a launch that shouldn't have worked, worked.",
      "Week 4: £5,000 in a day. Then again. Then it became normal.",
    ]
  },
  {
    desire: "Glowing skin — compliments every single day.",
    category: "Beautymaxxing", days: 9, signs: 3,
    track: "Gorgeous Is My Default", feel: "I catch myself in mirrors now.",
    log: [
      "Day 3: A stranger stopped me to ask what I use on my skin.",
      "Day 6: My sister said I looked different — \"lit from inside.\"",
      "Day 9: Someone guessed my age five years younger, unprompted.",
    ]
  },
  {
    desire: "£1,800 refund out of nowhere.",
    category: "Moneymaxxing", days: 4, signs: 2,
    track: "Money Finds Me First", feel: "Money really does find me first.",
    log: [
      "Day 2: An old invoice I'd forgotten about got settled — £1,800, no chasing.",
      "Day 4: Marked manifested.",
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
          <div style={{ fontSize:11, color:"rgba(232,168,96,0.6)", fontWeight:400, letterSpacing:"0.3em", textTransform:"uppercase", marginBottom:16 }}>ProofOS ✦</div>
          <div style={{ fontSize: isMobile?"clamp(44px,13vw,64px)":"clamp(56px,8vw,80px)", color:"#f2ece4", fontFamily:"'Jost',sans-serif", fontWeight:400, letterSpacing:"-0.03em", lineHeight:0.95, marginBottom:20 }}>
            The Proof Thread.
          </div>
          <p style={{ fontSize: isMobile?15:17, color:"#9a8878", lineHeight:1.8, maxWidth:480, margin:"0 auto", fontWeight:400 }}>
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
