/* Science page — The full mechanism explained */
import { useState, useEffect } from "react";

const LG = "linear-gradient(135deg,#F5E0A0 0%,#E8B870 20%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";
const TEAL = "#2CB7A7";
const LAV  = "#BFA5D8";
const GOLD = "#E8B870";
const CHAMP = "#F5E0A0";
const CR   = "#f2ece4";
const MU   = "#c8bfb8";
const DIM  = "#888888";
const BG2  = "#0d0d0d";

function Label({ children, color }) {
  return <div style={{ fontSize:10, letterSpacing:"0.22em", textTransform:"uppercase", color:color||TEAL, marginBottom:14, fontFamily:"'Jost',sans-serif", fontWeight:500 }}>{children}</div>;
}
function H2({ children }) {
  return <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"clamp(30px,4vw,46px)", color:CR, fontWeight:400, marginBottom:16, lineHeight:1.15 }}>{children}</h2>;
}
function H3({ children, color }) {
  return <h3 style={{ fontFamily:"'Jost',sans-serif", fontSize:"clamp(16px,2vw,20px)", color:color||CR, fontWeight:500, marginBottom:12, lineHeight:1.3 }}>{children}</h3>;
}
function P({ children, color }) {
  return <p style={{ fontSize:16, color:color||MU, lineHeight:1.9, marginBottom:20, fontFamily:"'Jost',sans-serif" }}>{children}</p>;
}
function Divider() {
  return <div style={{ height:1, background:`linear-gradient(90deg,transparent,rgba(44,183,167,0.3),transparent)`, margin:"56px 0" }}/>;
}
function Callout({ children, color }) {
  return (
    <div style={{ padding:"24px 28px", background:`${color||TEAL}09`, border:`1px solid ${color||TEAL}25`, borderRadius:14, margin:"28px 0" }}>
      <p style={{ fontSize:17, color:CR, lineHeight:1.85, margin:0, fontFamily:"'Jost',sans-serif" }}>{children}</p>
    </div>
  );
}

// Brainwave table data
const WAVES = [
  { state:"Delta", hz:"0.5 – 4 Hz", label:"Deep sleep", what:"The deepest sleep state. The brain is almost fully offline to the external world. Cellular repair, immune function, and deep restoration happen here. Consciousness is absent.", shg:"Sleep tracks guide you into delta after theta installation. The subliminals continue working." },
  { state:"Theta", hz:"4 – 8 Hz", label:"The installation window", what:"The subconscious opens here. Critical resistance drops. This is the state you move through naturally twice a day — drifting to sleep and waking up. Children under 7 live predominantly in theta, which is why early experiences install so deeply.", shg:"Every SHG track targets theta. Binaural beats entrain the brain to this frequency within minutes. The installation — new identity, new belief — goes in here.", highlight:true },
  { state:"Alpha", hz:"8 – 14 Hz", label:"Relaxed awareness", what:"Calm, present, creative. Mild daydreaming. The bridge between conscious thought and subconscious processing. Stress reduces. Intuition increases. You're receptive but not fully in the installation window.", shg:"Some SHG tracks use alpha as an entry point before deepening into theta. Good for daytime listening when you want to stay aware but receptive." },
  { state:"Beta", hz:"14 – 40 Hz", label:"Active thinking", what:"Alert, analytical, critical. The default state of everyday modern life. This is where you make lists, plan, argue with yourself, and reject ideas that don't match what you already believe. Affirmations bounce off here.", shg:"Not the target state. Beta is where old beliefs live on guard. SHG moves you out of beta deliberately — through music, frequency, and entrainment — before installation begins." },
  { state:"Gamma", hz:"40+ Hz", label:"Peak coherence", what:"High-level information processing, peak focus, heightened perception. Experienced during moments of insight and deep compassion. Associated with advanced states of consciousness reported by long-term meditators.", shg:"Gamma emerges naturally from deep theta and coherence states. Not directly targeted but observed as a downstream effect of consistent practice." },
];

// Heart-brain data
const HEART_FACTS = [
  { n:"40,000+", label:"Neurons in the heart", body:"The heart has its own intrinsic nervous system — functionally sophisticated enough to be called a heart-brain. It can sense, process information, make decisions, and demonstrate a form of memory, independently of the cranial brain." },
  { n:"60×", label:"Stronger EM field", body:"The heart's electromagnetic field is approximately 60 times greater in amplitude than the brain's electrical activity. This field radiates outside the body and can be detected several feet away." },
  { n:"4 ways", label:"Heart-to-brain communication", body:"The heart communicates with the cranial brain via four pathways: neurologically (through the nervous system), biochemically (through hormones and neurotransmitters), biophysically (through pressure waves), and energetically (through the electromagnetic field)." },
  { n:"5,000×", label:"Stronger magnetically", body:"The heart's magnetic field is roughly 5,000 times stronger than the brain's. It can be measured several feet outside the body with sensitive instruments." },
];

// Subliminal mechanism
const SUBLIMINAL_STEPS = [
  { n:"01", title:"Below the threshold of conscious awareness", body:"Subliminal audio is embedded at a volume the conscious mind cannot clearly register. The ear receives it. The critical faculty — which rejects anything that contradicts existing belief — does not engage." },
  { n:"02", title:"Processed by the subconscious directly", body:"While the conscious mind is occupied with the music, the hypnosis, or simply drifting, the subconscious is processing the embedded statements. It receives them as information without running them through the belief filter." },
  { n:"03", title:"Repetition creates installation", body:"Unlike affirmations said once in beta, subliminals delivered repeatedly during receptive states create new neural pathways. The statement moves from foreign to familiar to default." },
  { n:"04", title:"The identity shifts", body:"Once a belief is installed subconsciously, behaviour changes without effort. The woman who has genuinely installed 'I am someone money finds easily' doesn't force financial behaviour — it simply becomes what she does." },
];

// EMDR mechanism
const EMDR_STEPS = [
  { side:"L", title:"Left channel", body:"A tone, beat, or sound enters the left ear and stimulates the right hemisphere — associated with creativity, intuition, pattern recognition, and emotional processing." },
  { side:"R", title:"Right channel", body:"A slightly different tone enters the right ear and stimulates the left hemisphere — associated with logical processing, language, and analytical function." },
  { side:"∞", title:"Bilateral synchronisation", body:"When both hemispheres receive and process simultaneously, they synchronise. The brain moves into a state of bilateral coherence — unified, receptive, and ready for deep processing." },
  { side:"✦", title:"Why this matters for installation", body:"EMDR was originally developed for trauma processing because bilateral stimulation allows the brain to process difficult material without the usual emotional resistance. The same mechanism makes it ideal for identity installation — resistance drops, and new material lands without the usual fight." },
];

export default function Science({ onBack }) {
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth <= 768);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  return (
    <div style={{ minHeight:"100vh", background:"#000", color:CR, fontFamily:"'Jost',sans-serif" }}>

      {/* NAV */}
      <div style={{ position:"sticky", top:0, background:"rgba(0,0,0,0.96)", borderBottom:"1px solid rgba(44,183,167,0.12)", padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", zIndex:100 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:TEAL, cursor:"pointer", fontSize:14, fontFamily:"'Jost',sans-serif", padding:0, display:"flex", alignItems:"center", gap:8 }}>← Back</button>
        <div style={{ fontSize:12, color:MU, letterSpacing:"0.1em", fontFamily:"'Jost',sans-serif" }}>The Science</div>
        <div style={{ width:60 }}/>
      </div>

      {/* HERO */}
      <div style={{ padding: isMobile?"56px 20px 48px":"88px 24px 72px", maxWidth:820, margin:"0 auto", textAlign:"center" }}>
        <Label>reshmaoracle.com · the mechanism</Label>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize: isMobile?"clamp(36px,10vw,52px)":"clamp(44px,6vw,68px)", color:CR, fontWeight:400, marginBottom:20, lineHeight:1.1 }}>
          Why this works when nothing else has.
        </h1>
        <p style={{ fontSize: isMobile?16:19, color:MU, lineHeight:1.85, maxWidth:640, margin:"0 auto", fontFamily:"'Jost',sans-serif" }}>
          This page explains the full mechanism behind Self Hypnosis Goddess — the neuroscience of brainwave states, the intelligence of the heart-brain, why subliminals and EMDR work where affirmations don't, and how all of it connects into one system.
        </p>
      </div>

      {/* CONTENTS */}
      <div style={{ maxWidth:820, margin:"0 auto", padding: isMobile?"0 20px":"0 24px" }}>

        <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:64, justifyContent:"center" }}>
          {["Brainwave states","The theta window","The heart-brain","Heart coherence","Subliminals","EMDR","How it combines"].map((t,i)=>(
            <div key={i} style={{ padding:"7px 16px", background:"rgba(44,183,167,0.07)", border:"1px solid rgba(44,183,167,0.2)", borderRadius:20, fontSize:13, color:MU, fontFamily:"'Jost',sans-serif" }}>{t}</div>
          ))}
        </div>

        {/* ═══════════════════ 1. BRAINWAVE STATES ═══════════════════ */}
        <section>
          <Label>Section 01</Label>
          <H2>Brainwave states — what they actually are</H2>
          <P>Your brain produces electrical activity at all times. That activity oscillates at different speeds depending on what you're doing, thinking, or feeling. These oscillations — measured in hertz — fall into named bands. Each band corresponds to a distinct mode of consciousness, with a distinct relationship to belief, learning, and change.</P>
          <Callout>The frequency your brain is running when you try to install a new belief determines whether that belief lands or bounces off. Most people try to change themselves in beta. Beta is the worst possible state for it.</Callout>

          {/* Brainwave table */}
          <div style={{ overflowX:"auto", marginBottom:32 }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:"'Jost',sans-serif", fontSize: isMobile?13:15 }}>
              <thead>
                <tr style={{ borderBottom:"1px solid rgba(44,183,167,0.2)" }}>
                  {["State","Hz Range","Character","What it means for you","SHG relevance"].map(h=>(
                    <th key={h} style={{ padding:"12px 10px", textAlign:"left", color:TEAL, fontWeight:500, fontSize:11, letterSpacing:"0.1em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {WAVES.map((w,i)=>(
                  <tr key={i} style={{ borderBottom:"1px solid rgba(255,255,255,0.05)", background: w.highlight?"rgba(44,183,167,0.05)":"transparent" }}>
                    <td style={{ padding:"16px 10px", color: w.highlight?TEAL:CR, fontWeight: w.highlight?600:400, whiteSpace:"nowrap" }}>{w.state}</td>
                    <td style={{ padding:"16px 10px", color:GOLD, whiteSpace:"nowrap", fontFamily:"monospace", fontSize:13 }}>{w.hz}</td>
                    <td style={{ padding:"16px 10px", color: w.highlight?TEAL:MU, whiteSpace:"nowrap" }}>{w.label}</td>
                    <td style={{ padding:"16px 10px", color:MU, lineHeight:1.6, minWidth:200 }}>{w.what}</td>
                    <td style={{ padding:"16px 10px", color: w.highlight?CR:DIM, lineHeight:1.6, minWidth:180 }}>{w.shg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Visual frequency bar */}
          <div style={{ margin:"40px 0" }}>
            <div style={{ fontSize:12, color:DIM, fontFamily:"'Jost',sans-serif", marginBottom:12, letterSpacing:"0.08em" }}>FREQUENCY SPECTRUM</div>
            <div style={{ display:"flex", gap:3, alignItems:"flex-end", height:80 }}>
              {[
                { label:"Delta", h:30, color:"#167A6B" },
                { label:"Theta", h:65, color:TEAL, active:true },
                { label:"Alpha", h:50, color:LAV },
                { label:"Beta", h:40, color:"#888" },
                { label:"Gamma", h:20, color:DIM },
              ].map((b,i)=>(
                <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                  <div style={{ width:"100%", height:b.h, background: b.active?LG:b.color, borderRadius:"4px 4px 0 0", opacity: b.active?1:0.45, boxShadow: b.active?"0 0 20px rgba(44,183,167,0.4)":"none" }}/>
                  <div style={{ fontSize:10, color: b.active?TEAL:DIM, fontFamily:"'Jost',sans-serif", letterSpacing:"0.08em" }}>{b.label}</div>
                </div>
              ))}
            </div>
            <div style={{ height:1, background:"rgba(255,255,255,0.08)", marginTop:0 }}/>
            <div style={{ textAlign:"center", marginTop:10, fontSize:12, color:TEAL, fontFamily:"'Jost',sans-serif" }}>Theta is the target. Every SHG track is built to get you there.</div>
          </div>
        </section>

        <Divider/>

        {/* ═══════════════════ 2. THE THETA WINDOW ═══════════════════ */}
        <section>
          <Label>Section 02</Label>
          <H2>The theta window — why this state is the only one that matters</H2>
          <P>In theta, the critical faculty — the part of the mind that evaluates incoming information against existing beliefs and rejects what doesn't match — goes quiet. The gatekeeper stands down. What enters the mind in this state bypasses the filter and goes directly into the subconscious.</P>
          <P>This is why hypnosis works. This is why you can remember things in hypnosis that you've forgotten in waking life. The subconscious has a record of everything — it's simply not accessible when the critical faculty is on guard.</P>

          <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr":"1fr 1fr", gap:16, margin:"32px 0" }}>
            {[
              { title:"When you naturally enter theta", items:["Drifting to sleep — the hypnagogic state","Waking up — before full consciousness returns","Deep daydreaming","During repetitive movement (long walks, driving a familiar route)","The first 20–30 minutes of deep meditation"] },
              { title:"What becomes possible in theta", items:["New beliefs install without resistance","Emotional patterns from childhood become accessible","The body responds to suggestion more readily","Habitual thought loops can be interrupted and replaced","Identity-level change — not just behavioural change"] },
            ].map((col,i)=>(
              <div key={i} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(44,183,167,0.15)", borderRadius:14, padding:"22px 20px" }}>
                <H3 color={i===0?GOLD:TEAL}>{col.title}</H3>
                {col.items.map((item,j)=>(
                  <div key={j} style={{ display:"flex", gap:10, marginBottom:10, alignItems:"flex-start" }}>
                    <span style={{ color:TEAL, flexShrink:0, marginTop:2 }}>✦</span>
                    <span style={{ fontSize:14, color:MU, lineHeight:1.7, fontFamily:"'Jost',sans-serif" }}>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <Callout color={GOLD}>Children under the age of 7 spend most of their waking hours in theta and delta. This is why everything they observe — every message about money, love, safety, and worth — downloads directly as belief. They have no critical faculty yet. The gatekeeper isn't installed until around age 7. That programming runs your life until something intervenes at the same level it was created.</Callout>

          {/* SVG: theta access diagram */}
          <div style={{ display:"flex", justifyContent:"center", margin:"40px 0" }}>
            <svg viewBox="0 0 400 160" width={isMobile?"100%":480} style={{ maxWidth:"100%", overflow:"visible" }}>
              <defs>
                <linearGradient id="sclg" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F5E0A0"/>
                  <stop offset="52%" stopColor="#BFA5D8"/>
                  <stop offset="100%" stopColor="#167A6B"/>
                </linearGradient>
              </defs>
              {/* Timeline */}
              <line x1="20" y1="80" x2="380" y2="80" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              {/* Waking state */}
              <rect x="20" y="55" width="80" height="50" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              <text x="60" y="77" textAnchor="middle" fontFamily="Jost,sans-serif" fontSize="10" fill="#888">BETA</text>
              <text x="60" y="92" textAnchor="middle" fontFamily="Jost,sans-serif" fontSize="9" fill="#666">awake</text>
              {/* Arrow */}
              <path d="M105,80 L125,80" stroke={TEAL} strokeWidth="1.5" markerEnd="url(#arr)" opacity="0.5"/>
              {/* Theta zone */}
              <rect x="128" y="44" width="144" height="72" rx="8" fill="rgba(44,183,167,0.08)" stroke={TEAL} strokeWidth="1.5"/>
              <text x="200" y="72" textAnchor="middle" fontFamily="Jost,sans-serif" fontSize="12" fontWeight="500" fill={TEAL}>THETA</text>
              <text x="200" y="88" textAnchor="middle" fontFamily="Jost,sans-serif" fontSize="9" fill={LAV}>installation window</text>
              <text x="200" y="104" textAnchor="middle" fontFamily="Jost,sans-serif" fontSize="9" fill="#888">4 – 8 Hz</text>
              {/* Arrow */}
              <path d="M275,80 L295,80" stroke={TEAL} strokeWidth="1.5" opacity="0.5"/>
              {/* Sleep */}
              <rect x="298" y="55" width="82" height="50" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              <text x="339" y="77" textAnchor="middle" fontFamily="Jost,sans-serif" fontSize="10" fill="#888">DELTA</text>
              <text x="339" y="92" textAnchor="middle" fontFamily="Jost,sans-serif" fontSize="9" fill="#666">deep sleep</text>
              {/* SHG label below theta */}
              <text x="200" y="136" textAnchor="middle" fontFamily="Jost,sans-serif" fontSize="10" fill={TEAL}>↑ SHG gets you here on demand</text>
            </svg>
          </div>
        </section>

        <Divider/>

        {/* ═══════════════════ 3. THE HEART-BRAIN ═══════════════════ */}
        <section>
          <Label>Section 03</Label>
          <H2>The heart-brain — not a metaphor</H2>
          <P>The heart is not just a pump. It is an intelligent organ with its own nervous system, its own electromagnetic field, and its own form of memory. The science of neurocardiology — the study of the heart's neural architecture — has established this clearly.</P>

          <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr 1fr":"1fr 1fr 1fr 1fr", gap:14, margin:"32px 0" }}>
            {HEART_FACTS.map((f,i)=>(
              <div key={i} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(191,165,216,0.2)", borderRadius:14, padding:"20px 16px", textAlign:"center" }}>
                <div style={{ fontSize: isMobile?28:36, fontWeight:300, color:LAV, fontFamily:"'Jost',sans-serif", lineHeight:1, marginBottom:6 }}>{f.n}</div>
                <div style={{ fontSize:11, color:GOLD, fontFamily:"'Jost',sans-serif", marginBottom:10, letterSpacing:"0.06em" }}>{f.label}</div>
                <div style={{ fontSize:12, color:MU, lineHeight:1.6, fontFamily:"'Jost',sans-serif" }}>{f.body}</div>
              </div>
            ))}
          </div>

          <P>The heart communicates with the cranial brain through four distinct pathways simultaneously. This is not one-way — but the direction of the dominant signal is predominantly upward, from heart to head. What the heart broadcasts, the brain receives. What the brain then accepts as belief, the body acts out as reality.</P>

          {/* 4 pathways */}
          <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr":"1fr 1fr", gap:14, margin:"24px 0" }}>
            {[
              { path:"Neurological", detail:"The vagus nerve and cardiac plexus carry signals continuously from the heart to the brain stem, the amygdala, and the thalamus — structures that govern emotion, memory formation, and threat response." },
              { path:"Biochemical", detail:"The heart produces and secretes hormones and neurotransmitters — including oxytocin (known as the 'bonding hormone') — that travel through the bloodstream and directly influence brain function and emotional state." },
              { path:"Biophysical", detail:"Every heartbeat generates pressure waves that travel through the vascular system and influence brain activity. The rhythm and pattern of these waves — coherent or incoherent — affects cognitive function and emotional regulation." },
              { path:"Electromagnetic", detail:"The heart's electromagnetic field radiates beyond the body. Research has shown that this field can be detected and measured in people within several feet of each other — meaning your emotional state affects the people around you before you speak a word." },
            ].map((p,i)=>(
              <div key={i} style={{ display:"flex", gap:14, padding:"18px 16px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(44,183,167,0.12)", borderRadius:12 }}>
                <div style={{ width:8, background:LG, borderRadius:4, flexShrink:0 }}/>
                <div>
                  <div style={{ fontSize:13, fontWeight:500, color:CR, fontFamily:"'Jost',sans-serif", marginBottom:6 }}>{p.path}</div>
                  <div style={{ fontSize:13, color:MU, lineHeight:1.7, fontFamily:"'Jost',sans-serif" }}>{p.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Divider/>

        {/* ═══════════════════ 4. HEART COHERENCE ═══════════════════ */}
        <section>
          <Label>Section 04</Label>
          <H2>Heart coherence — the state that opens everything</H2>
          <P>Heart rate variability (HRV) is the measurement of the variation in time between heartbeats. An erratic, disordered HRV pattern reflects a contracted emotional state — stress, fear, frustration. A smooth, rhythmic HRV pattern reflects a coherent emotional state — calm, appreciation, love.</P>
          <P>These aren't just feelings. They're measurable physiological signals that travel from the heart to the brain and determine what the brain is capable of in that moment.</P>

          {/* Coherence comparison */}
          <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr":"1fr 1fr", gap:20, margin:"32px 0" }}>
            {[
              { state:"Incoherent state", color:"#888", items:[
                "Erratic, disordered heart rhythm",
                "Stress hormones elevated",
                "Higher brain functions impaired",
                "Critical faculty on high alert",
                "New beliefs bounce off",
                "Old patterns reinforced",
              ]},
              { state:"Coherent state", color:TEAL, items:[
                "Smooth, rhythmic heart rhythm",
                "Stress hormones reduce",
                "Cognitive function improves",
                "Critical faculty quietens",
                "New information lands",
                "Identity-level change becomes possible",
              ]},
            ].map((col,i)=>(
              <div key={i} style={{ background: i===1?"rgba(44,183,167,0.06)":"rgba(255,255,255,0.03)", border:`1px solid ${col.color}25`, borderRadius:14, padding:"22px 20px" }}>
                <H3 color={col.color}>{col.state}</H3>
                {/* Simple wave SVG */}
                <svg viewBox="0 0 200 40" width="100%" style={{ marginBottom:16, opacity:0.8 }}>
                  {i===0
                    ? <polyline points="0,20 15,8 22,32 30,4 38,28 44,20 55,10 62,30 70,15 78,25 88,20 100,12 108,28 116,8 124,32 132,18 140,24 150,20 160,10 168,28 178,14 186,26 200,20"
                        fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
                    : <path d="M0,20 C25,-4 50,44 75,20 C100,-4 125,44 150,20 C175,-4 188,10 200,20"
                        fill="none" stroke={TEAL} strokeWidth="2" strokeLinecap="round"/>
                  }
                </svg>
                {col.items.map((item,j)=>(
                  <div key={j} style={{ display:"flex", gap:8, marginBottom:8, alignItems:"flex-start" }}>
                    <span style={{ color:col.color, flexShrink:0, fontSize:12 }}>{i===0?"✗":"✦"}</span>
                    <span style={{ fontSize:13, color:MU, lineHeight:1.6, fontFamily:"'Jost',sans-serif" }}>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <Callout color={LAV}>The research finding that changed everything: sincere feelings of appreciation, care, or love create measurable increases in heart coherence and cognitive performance. This means emotional state is not a byproduct of circumstance — it is something that can be deliberately generated. And when it is, the brain opens. This is the mechanism SHG uses.</Callout>
        </section>

        <Divider/>

        {/* ═══════════════════ 5. SUBLIMINALS ═══════════════════ */}
        <section>
          <Label>Section 05</Label>
          <H2>Subliminals — how installation actually works</H2>
          <P>A subliminal is an auditory stimulus delivered below the threshold of conscious perception. The ear receives it. The critical faculty — which normally evaluates and rejects information that contradicts existing belief — does not engage because it cannot clearly perceive what is being received.</P>
          <P>This is not mysticism. It is how the auditory processing pathway works. Signals that don't rise to the level of conscious attention are still processed — and in the right conditions, stored.</P>

          <div style={{ margin:"32px 0" }}>
            {SUBLIMINAL_STEPS.map((s,i)=>(
              <div key={i} style={{ display:"flex", gap:20, marginBottom:24, alignItems:"flex-start" }}>
                <div style={{ width:40, height:40, borderRadius:"50%", background:LG, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:"#000", fontFamily:"'Jost',sans-serif" }}>{s.n}</span>
                </div>
                <div>
                  <H3 color={CR}>{s.title}</H3>
                  <P>{s.body}</P>
                </div>
              </div>
            ))}
          </div>

          <Callout>The critical difference between an affirmation and a subliminal is not the content — it's the bypass. An affirmation said aloud in beta is immediately evaluated against what you currently believe. A subliminal delivered in theta, at sub-threshold volume, is not evaluated. It is simply received.</Callout>
        </section>

        <Divider/>

        {/* ═══════════════════ 6. EMDR ═══════════════════ */}
        <section>
          <Label>Section 06</Label>
          <H2>EMDR bilateral audio — why both hemispheres matter</H2>
          <P>EMDR (Eye Movement Desensitisation and Reprocessing) was developed as a trauma therapy. The bilateral stimulation — alternating left-right input — was found to allow the brain to process difficult material without the usual emotional resistance. The two hemispheres synchronise. Defences drop. Processing deepens.</P>
          <P>In audio form, the left-right alternation happens through sound rather than eye movement — a tone, a beat, or a pulse that alternates between the left and right ears.</P>

          <div style={{ display:"grid", gridTemplateColumns: isMobile?"1fr":"1fr 1fr", gap:14, margin:"32px 0" }}>
            {EMDR_STEPS.map((s,i)=>(
              <div key={i} style={{ padding:"20px 18px", background: i>1?"rgba(44,183,167,0.06)":"rgba(255,255,255,0.03)", border:`1px solid ${i>1?TEAL+"25":"rgba(255,255,255,0.07)"}`, borderRadius:14 }}>
                <div style={{ fontSize:22, color: i===0?GOLD:i===1?LAV:i===2?TEAL:CR, marginBottom:10, fontFamily:"'Jost',sans-serif" }}>{s.side}</div>
                <H3 color={i>1?TEAL:CR}>{s.title}</H3>
                <P>{s.body}</P>
              </div>
            ))}
          </div>

          <Callout color={GOLD}>When EMDR bilateral audio is combined with theta-state brainwave entrainment, the brain is simultaneously in its most receptive state and processing with both hemispheres synchronised. This is why every SHG track includes EMDR — it is the difference between installation and suggestion.</Callout>
        </section>

        <Divider/>

        {/* ═══════════════════ 7. THE FULL SYSTEM ═══════════════════ */}
        <section>
          <Label>Section 07</Label>
          <H2>How it all combines — the SHG mechanism in full</H2>
          <P>Each element of an SHG track targets a different layer of the mechanism. Together, they create conditions that no single approach can produce alone.</P>

          <div style={{ margin:"32px 0" }}>
            {[
              { layer:"Layer 1", element:"Melodic House Music", what:"Creates a pleasurable, emotionally elevated state. Raises heart coherence. Prepares the system to receive.", color:GOLD },
              { layer:"Layer 2", element:"Binaural Beats", what:"Entrains the brain from beta to theta within minutes. Opens the installation window. The conscious critic stands down.", color:LAV },
              { layer:"Layer 3", element:"EMDR Bilateral Audio", what:"Synchronises both hemispheres. Deepens the receptive state. Reduces resistance to new information at a neurological level.", color:TEAL },
              { layer:"Layer 4", element:"Vocal Hypnosis", what:"Delivers the specific identity directly — spoken, guided, embodied. The subconscious receives it without the filter of conscious evaluation.", color:CHAMP },
              { layer:"Layer 5", element:"Subliminals", what:"Embeds the same beliefs below the threshold of conscious awareness. They stack with the hypnosis. Repetition builds the new neural pathway.", color:CR },
            ].map((l,i)=>(
              <div key={i} style={{ display:"flex", gap:0, marginBottom:2, borderRadius: i===0?"12px 12px 0 0":i===4?"0 0 12px 12px":"0", overflow:"hidden", border:"1px solid rgba(255,255,255,0.06)", borderTop: i===0?"1px solid rgba(255,255,255,0.06)":"none" }}>
                <div style={{ width:6, background:l.color, flexShrink:0 }}/>
                <div style={{ flex:1, display:"grid", gridTemplateColumns: isMobile?"1fr":"120px 160px 1fr", gap: isMobile?8:0, padding:"16px 18px", background:"rgba(255,255,255,0.02)", alignItems:"center" }}>
                  <div style={{ fontSize:11, color:DIM, fontFamily:"'Jost',sans-serif", letterSpacing:"0.1em" }}>{l.layer}</div>
                  <div style={{ fontSize:14, fontWeight:500, color:l.color, fontFamily:"'Jost',sans-serif" }}>{l.element}</div>
                  <div style={{ fontSize:13, color:MU, lineHeight:1.6, fontFamily:"'Jost',sans-serif" }}>{l.what}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding:"28px 24px", background:LG, borderRadius:16, textAlign:"center", marginTop:40 }}>
            <div style={{ fontSize: isMobile?18:22, fontWeight:400, color:"#000", fontFamily:"'Jost',sans-serif", lineHeight:1.6 }}>
              Melodic House + Binaural Beats + EMDR + Vocal Hypnosis + Subliminals
            </div>
            <div style={{ fontSize: isMobile?22:28, fontWeight:500, color:"#000", fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", marginTop:8 }}>
              = Theta on demand. Identity installed.
            </div>
          </div>
        </section>

        {/* FOOTER CTA */}
        <div style={{ textAlign:"center", padding:"72px 0 40px" }}>
          <div style={{ fontSize:13, color:MU, fontFamily:"'Jost',sans-serif", marginBottom:24 }}>Ready to experience it?</div>
          <button onClick={onBack} style={{ padding:"14px 40px", background:LG, border:"none", borderRadius:40, fontSize:15, fontWeight:500, color:"#000", cursor:"pointer", fontFamily:"'Jost',sans-serif" }}>Back to reshmaoracle.com</button>
        </div>

      </div>
    </div>
  );
}
