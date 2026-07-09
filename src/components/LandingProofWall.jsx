/* LandingProofWall — EXACT mirror of the live dashboard Proof Wall (ProofTab wall view).
   Same gold ombre, same category gradient cards, same media grid. Static demo data. */

const OMBRE_BG = "linear-gradient(160deg,#fdf6ee 0%,#f0e4f5 50%,#dcc4e8 100%)";
const CAT_GRAD = { "Lovemaxxing":"linear-gradient(135deg,#fce4c0,#e8a860)", "Moneymaxxing":"linear-gradient(135deg,#e8a860,#c9963a)", "Beautymaxxing":"linear-gradient(135deg,#fce4c0,#e8a860)", "Bodymaxxing":"linear-gradient(135deg,#e8a860,#c9963a)", "Luckygirlmaxxing":"linear-gradient(135deg,#fce4c0,#c9963a)", "Sovereignmaxxing":"linear-gradient(135deg,#e8a860,#8a6020)" };
const CAT_COLOR = { "Lovemaxxing":"#e8a860", "Moneymaxxing":"#c9963a", "Beautymaxxing":"#e8a860", "Bodymaxxing":"#c9963a", "Luckygirlmaxxing":"#c9963a", "Sovereignmaxxing":"#8a6020" };
const PC = { card:"rgba(255,248,240,0.92)", text:"#1a1218", mu:"#3a2830", dim:"#5a4048" };

const WALL = [
  {
    desire: "He always texts me first and initiates plans.",
    category: "Lovemaxxing", days: 5, signs: 5, media: "📷 · 📷 · 📷", date: "Day 5",
    track: "He Finds His Way Back", feel: "He's not chasing me. He's remembering me.",
    log: [
      "Day 1: Started listening to He Finds His Way Back.",
      "Day 2: He texted first — \"thinking about you.\"",
      "Day 3: He asked to see me this weekend, unprompted.",
      "Day 4: He texted first again, no gap, no waiting.",
      "Day 5: He planned the whole date — time, place, all of it."
    ]
  },
  {
    desire: "I am now making £5,000 a day from my business.",
    category: "Moneymaxxing", days: 31, signs: 4, media: "📷 · 📷 · 📷 · 📷", date: "Day 31",
    track: "Money Finds Me First", feel: "The number kept moving and I stopped being shocked by it.",
    log: [
      "Week 1: £1,000 in a day for the first time — screenshot saved.",
      "Week 2: £2,000 in a day. Same store, same offer, nothing changed but me.",
      "Week 3: £3,500 in a day — a launch that shouldn't have worked, worked.",
      "Week 4: £5,000 in a day. Then again. Then it became normal."
    ]
  },
  {
    desire: "Glowing skin — compliments daily.",
    category: "Beautymaxxing", days: 9, signs: 3, media: "📷", date: "Day 9",
    track: "Gorgeous Is My Default", feel: "I catch myself in mirrors now.",
    log: [
      "Day 3: A stranger stopped me to ask what I use on my skin.",
      "Day 6: My sister said I looked different — \"lit from inside.\"",
      "Day 9: Someone guessed my age five years younger, unprompted."
    ]
  },
  {
    desire: "£1,800 refund out of nowhere.",
    category: "Moneymaxxing", days: 4, signs: 2, media: "📷", date: "Day 4",
    track: "Money Finds Me First", feel: "Money really does find me first.",
    log: [
      "Day 2: An old invoice I'd forgotten about got settled — £1,800, no chasing.",
      "Day 4: Marked manifested."
    ]
  },
  {
    desire: "I win something I didn't even enter for.",
    category: "Luckygirlmaxxing", days: 11, signs: 2, media: "📷", date: "Day 11",
    track: "Lucky Girl Summer", feel: "Things just started going my way, for no reason I could point to.",
    log: [
      "Day 6: Won a giveaway I didn't remember entering.",
      "Day 11: Randomly selected for an upgrade at check-in — no upsell, just given."
    ]
  },
  {
    desire: "I'm invited somewhere I'd never invite myself to.",
    category: "Sovereignmaxxing", days: 18, signs: 2, media: "📷 · 🎤", date: "Day 18",
    track: "Highest Timeline", feel: "I didn't ask. I was just already someone people wanted there.",
    log: [
      "Day 12: A friend mentioned a trip to Majorca, casually — \"you're coming, right?\"",
      "Day 18: Flights booked. I never once had to ask to be included."
    ]
  },
];

const MEDIA = [
  { img:"https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop&auto=format", label:"He texts me first · 19 Jun" },
  { img:"https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=400&fit=crop&auto=format", label:"£1,800 refund · 28 Jun" },
  { audio:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", label:"Voice note · 20 Jun" },
  { img:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&auto=format", label:"The sign I asked for · 1 Jul" },
];

export default function LandingProofWall({ isMobile }) {
  return (
    <div style={{ padding: isMobile?"48px 0":"70px 0", background: OMBRE_BG, width:"100%" }}>
      <div style={{ padding: isMobile?"0 18px":"0 24px", maxWidth: 640, margin:"0 auto", fontFamily:"'Jost',sans-serif" }}>

        <div style={{ textAlign:"center", marginBottom:22 }}>
          <div style={{ fontSize:12, color:"#000", fontWeight:800, letterSpacing:"0.22em", textTransform:"uppercase", marginBottom:12 }}>ProofOS · Real evidence</div>
          <h2 className="wm" style={{ fontSize:"clamp(30px,4.5vw,52px)", color:"#000", lineHeight:1.1, marginBottom:10 }}>This is your Proof Wall.</h2>
          <p style={{ fontSize:isMobile?14:16, color:"#1a0a08", lineHeight:1.8, maxWidth:480, margin:"0 auto", fontWeight:500 }}>
            Exactly as it looks inside the app. Every manifested intention. Every screenshot, every voice note — captured for life.
          </p>
        </div>

        {/* Header — mirrors the app */}
        <div style={{ fontSize:22, fontWeight:800, marginBottom:2, color:PC.text }}>ProofOS <span style={{ color:"#000" }}>✦</span></div>
        <div style={{ fontSize:13, color:PC.mu, marginBottom:14, fontWeight:600 }}>Your manifestation tracker for life. Every sign captured — forever.</div>

        {/* Stats — mirrors the app */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
          {[["6","Intentions"],["6","Manifested"],["18","Signs logged"]].map(([v,l],i)=>(
            <div key={i} style={{ background:PC.card, borderRadius:12, padding:"12px 6px", textAlign:"center" }}>
              <div style={{ fontSize:22, fontWeight:800, color:PC.text }}>{v}</div>
              <div style={{ fontSize:10, color:PC.dim, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Manifested wall — mirrors the app, full evidence shown */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {WALL.map((d,i)=>(
            <div key={i} style={{ background:CAT_GRAD[d.category], borderRadius:14, padding:"16px 18px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, marginBottom:8 }}>
                <span style={{ fontSize:9, padding:"3px 9px", background:"rgba(255,255,255,0.7)", color:CAT_COLOR[d.category], borderRadius:20, fontWeight:800, flexShrink:0 }}>✓ {d.category}</span>
                <span style={{ fontSize:10, color:"#1a1a1a", fontWeight:700, textAlign:"right" }}>{d.days}d · {d.signs} signs</span>
              </div>
              <div style={{ fontSize:15, fontWeight:800, color:"#000", marginBottom:4, lineHeight:1.3 }}>{d.desire}</div>
              <div style={{ fontSize:10.5, color:"#3a2a10", fontWeight:700, marginBottom:10 }}>♪ Linked to: {d.track}</div>
              <div style={{ background:"rgba(255,255,255,0.55)", borderRadius:10, padding:"10px 12px", marginBottom:10 }}>
                {d.log.map((line,li)=>(
                  <div key={li} style={{ fontSize:10.5, color:"#1a1a1a", lineHeight:1.6, marginBottom: li===d.log.length-1?0:4 }}>{line}</div>
                ))}
              </div>
              <div style={{ fontSize:11, color:"#1a1a1a", fontStyle:"italic", lineHeight:1.5 }}>"{d.feel}"</div>
            </div>
          ))}
          <div style={{ background:"rgba(255,255,255,0.35)", border:"1px dashed rgba(0,0,0,0.3)", borderRadius:14, padding:20, display:"flex", alignItems:"center", justifyContent:"center", minHeight:70 }}>
            <span style={{ fontSize:12, color:"#1a0a10", textAlign:"center", fontWeight:700 }}>Your next manifestation goes here.</span>
          </div>
        </div>

        {/* All captured proof — mirrors the app */}
        <div style={{ fontSize:11, fontWeight:900, color:"#000", letterSpacing:"0.15em", textTransform:"uppercase", margin:"18px 0 8px" }}>All captured proof · newest last</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(90px,1fr))", gap:8 }}>
          {MEDIA.map((m,i)=>(
            <div key={i} style={{ background:"rgba(255,255,255,0.85)", borderRadius:10, padding:6, border:"1px solid rgba(0,0,0,0.12)" }}>
              {m.img && <img src={m.img} alt="proof" style={{ width:"100%", height:72, objectFit:"cover", borderRadius:7 }}/>}
              {m.audio && <div style={{ height:72, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4 }}><span style={{ fontSize:22 }}>🎤</span><audio src={m.audio} controls style={{ width:"100%", height:24 }}/></div>}
              <div style={{ fontSize:8.5, fontWeight:700, color:"#333", marginTop:4, lineHeight:1.3 }}>{m.label}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign:"center", marginTop:22, fontSize:12, color:"#1a0a08", fontWeight:700 }}>Included in Goddess Tier ✦ · Your evidence, for life</div>
      </div>
    </div>
  );
}
