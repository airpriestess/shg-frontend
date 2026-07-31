import { useState, useEffect } from "react";

const LG = "linear-gradient(135deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";

function SHGNav() {
  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, padding:"18px 32px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(0,0,0,0.88)", backdropFilter:"blur(24px)", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <svg viewBox="0 0 100 100" width="22" height="22">
          <defs><linearGradient id="rgnav" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#F5E0A0"/><stop offset="22%" stopColor="#E8B870"/><stop offset="52%" stopColor="#BFA5D8"/><stop offset="78%" stopColor="#2CB7A7"/><stop offset="100%" stopColor="#167A6B"/></linearGradient></defs>
          <circle cx="35" cy="35" r="18" fill="none" stroke="url(#rgnav)" strokeWidth="2"/>
          <circle cx="65" cy="35" r="18" fill="none" stroke="url(#rgnav)" strokeWidth="2"/>
          <circle cx="35" cy="65" r="18" fill="none" stroke="url(#rgnav)" strokeWidth="2"/>
          <circle cx="65" cy="65" r="18" fill="none" stroke="url(#rgnav)" strokeWidth="2"/>
          <line x1="50" y1="80" x2="50" y2="96" stroke="url(#rgnav)" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span style={{ fontFamily:"'Jost',sans-serif", fontWeight:300, fontSize:13, letterSpacing:".22em", textTransform:"uppercase", color:"#f2ece4" }}>Self Hypnosis Goddess</span>
      </div>
      <a href="/blocks/money" style={{ fontSize:11, letterSpacing:".2em", textTransform:"uppercase", fontWeight:600, color:"#000", padding:"10px 24px", borderRadius:20, background:LG, textDecoration:"none" }}>Take the quiz</a>
    </nav>
  );
}

const IDENTITY = [
  { key: "She is", val: "Delusionally certain. Confident before the proof. Her RAS is scanning for opportunity, not red flags." },
  { key: "She expects", val: "Money to find her from directions she hasn't planned. The right people to appear at the right moment." },
  { key: "She assumes", val: "She is always in the right place at the right time. That's not arrogance. That's a calibrated nervous system." },
  { key: "She installs", val: "The assumption before the evidence. In theta — the edge of sleep — where the subconscious accepts the new instruction without resistance." },
  { key: "She says", val: '"Of course. Obviously." And she means it. Because her nervous system stopped arguing.' },
];

const LADDER = [
  { level: 5, amount: "£100K a month", desc: "The level that still feels like fiction. Until you stay here long enough for it to feel like Tuesday." },
  { level: 4, amount: "£10K a day", desc: "Bigger systems, bigger visibility. Real pathways under you by now." },
  { level: 3, amount: "£1K a day", desc: "Delulu is the solulu. Same number, completely new meaning — this is what you earn in a day, not a month." },
  { level: 2, amount: "£5K a month", desc: "The first level where the nervous system starts to feel it as real. Stay here until it's boring." },
  { level: 1, amount: "£1K a month", desc: "The level your current identity already believes without blinking. Your starting point, not your ceiling." },
];

export default function RichGirl() {
  const [activeId, setActiveId] = useState(0);
  const [activeLadder, setActiveLadder] = useState(null);

  useEffect(() => {
    const t = setInterval(() => setActiveId(i => (i + 1) % IDENTITY.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: "#000", color: "#f2ece4", fontFamily: "'Jost', sans-serif", fontWeight: 300, minHeight: "100vh", overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Jost:wght@200;300;400;500;600;700&display=swap" rel="stylesheet"/>
      <SHGNav/>

      {/* HERO */}
      <div style={{ minHeight: "60vh", background: LG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "120px 48px 72px" }}>
        <h1 style={{ fontSize: "clamp(64px,10vw,120px)", fontWeight: 700, color: "#000", letterSpacing: "-.04em", lineHeight: .9, marginBottom: 20 }}>RichGirl<br/>Maxxing</h1>
        <p style={{ fontSize: "clamp(14px,1.6vw,18px)", fontWeight: 400, color: "rgba(0,0,0,0.7)", letterSpacing: ".02em" }}>Right mind. Right identity. Right operating system.</p>
      </div>

      {/* LET'S BE HONEST */}
      <div style={{ padding: "100px 48px", maxWidth: 920, margin: "0 auto" }}>
        <div style={{ fontSize: 13, letterSpacing: ".28em", textTransform: "uppercase", background: LG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", marginBottom: 20, fontWeight: 600 }}>Let's be honest</div>
        <h2 style={{ fontSize: "clamp(38px,6vw,76px)", fontWeight: 300, color: "#f2ece4", lineHeight: 1.05, letterSpacing: "-.03em", marginBottom: 28 }}>You don't have the wrong filter.<br/>You have no filter at all.</h2>
        <p style={{ fontSize: 17, lineHeight: 1.8, color: "#f2ece4", maxWidth: 680 }}>
          Your brain has a built-in focus system — the Reticular Activating System — that decides what you notice out of the millions of signals around you every day. Without a trained identity, it has no target. No focus. Money, opportunity, the right people — they're there. Your brain just isn't locked onto them yet.
        </p>

        {/* Callout grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", marginTop: 64, borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ background: "rgba(242,236,228,0.95)", padding: "52px 48px" }}>
            <div style={{ fontSize: 12, letterSpacing: ".24em", textTransform: "uppercase", color: "#000", marginBottom: 28, fontWeight: 700 }}>What they told you</div>
            {["Spend thousands on therapy", "Do the inner work", "Journal till you're blue in the face", "Want it bad enough", "Ask the universe and wait"].map((t, i) => (
              <div key={i} style={{ fontSize: 18, lineHeight: 1.5, color: "#1a0a04", padding: "16px 0", borderBottom: i < 4 ? "1px solid rgba(0,0,0,0.08)" : "none", fontWeight: 400 }}>{t}</div>
            ))}
          </div>
          <div style={{ background: LG, padding: "52px 48px" }}>
            <div style={{ fontSize: 12, letterSpacing: ".24em", textTransform: "uppercase", color: "#000", marginBottom: 28, fontWeight: 700 }}>The truth</div>
            {["Listen to self hypnosis and subliminals daily", "Hack your focus", "It's already written in your nervous system", "Stop wanting. Start knowing.", "Consistency. Of course. Obviously."].map((t, i) => (
              <div key={i} style={{ fontSize: 18, lineHeight: 1.5, color: "#000", padding: "16px 0", borderBottom: i < 4 ? "1px solid rgba(0,0,0,0.12)" : "none", fontWeight: 400 }}>{t}</div>
            ))}
          </div>
        </div>
      </div>

      {/* THE IDENTITY */}
      <div style={{ padding: "100px 48px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 920, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 13, letterSpacing: ".28em", textTransform: "uppercase", background: LG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", marginBottom: 20, fontWeight: 600 }}>The Identity</div>
          <h2 style={{ fontSize: "clamp(38px,6vw,76px)", fontWeight: 300, color: "#f2ece4", lineHeight: 1.05, letterSpacing: "-.03em", marginBottom: 12 }}>RichGirl isn't a personality type.</h2>
          <h2 style={{ fontSize: "clamp(38px,6vw,76px)", fontWeight: 300, color: "#f2ece4", lineHeight: 1.05, letterSpacing: "-.03em", marginBottom: 64 }}>It's an operating system.</h2>

          {/* Rotating identity */}
          <div style={{ minHeight: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
            {IDENTITY.map((item, i) => (
              <div key={i} style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, opacity: activeId === i ? 1 : 0, transform: activeId === i ? "translateY(0)" : "translateY(10px)", transition: "opacity .9s, transform .9s", pointerEvents: activeId === i ? "auto" : "none" }}>
                <div style={{ fontSize: "clamp(18px,2.8vw,32px)", letterSpacing: "-.01em", textTransform: "uppercase", fontWeight: 700, background: LG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", marginBottom: 20 }}>{item.key}</div>
                <div style={{ fontSize: "clamp(18px,2.4vw,26px)", fontWeight: 300, color: "#f2ece4", lineHeight: 1.5, maxWidth: 640, letterSpacing: "-.01em" }}>{item.val}</div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 40 }}>
            {IDENTITY.map((_, i) => (
              <div key={i} onClick={() => setActiveId(i)} style={{ width: 5, height: 5, borderRadius: "50%", background: activeId === i ? LG : "rgba(255,255,255,0.12)", cursor: "pointer", transition: "all .4s", transform: activeId === i ? "scale(1.5)" : "scale(1)" }}/>
            ))}
          </div>
        </div>
      </div>

      {/* THE MECHANISM */}
      <div style={{ padding: "100px 48px" }}>
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          <div style={{ fontSize: 13, letterSpacing: ".28em", textTransform: "uppercase", background: LG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", marginBottom: 20, fontWeight: 600 }}>The Mechanism</div>
          <h2 style={{ fontSize: "clamp(38px,6vw,76px)", fontWeight: 300, color: "#f2ece4", lineHeight: 1.05, letterSpacing: "-.03em", marginBottom: 12 }}>Affirmations always work.</h2>
          <h2 style={{ fontSize: "clamp(38px,6vw,76px)", fontWeight: 300, color: "#f2ece4", lineHeight: 1.05, letterSpacing: "-.03em", marginBottom: 32 }}>Just not in beta state.</h2>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: "#f2ece4", maxWidth: 680, marginBottom: 64 }}>
            In beta — wide awake — your brain argues back. In theta, the guard drops completely. The same affirmation that felt hollow at 2pm installs as identity at the edge of sleep.
          </p>

          {/* Install loop */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "56px 48px" }}>
            <div style={{ fontSize: 13, letterSpacing: ".28em", textTransform: "uppercase", background: LG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", textAlign: "center", marginBottom: 48, fontWeight: 600 }}>The RichGirl install loop</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 48 }}>
              {["Identity", "Expectation", "RAS Filter", "Attention", "Reality", "Proof"].map((node, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "20px 24px", textAlign: "center", fontSize: 14, fontWeight: 500, color: "#f2ece4", letterSpacing: ".03em" }}>{node}</div>
                  {i < 5 && <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 18 }}>→</div>}
                </div>
              ))}
            </div>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "rgba(242,236,228,0.7)", maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
              That drowsy, half-gone feeling right before you fall asleep — that's theta. Your brain is producing slow waves at 4 to 8Hz. The analytical, argumentative part of your mind has mostly switched off. Whatever you hear in that state goes directly into the subconscious, with no resistance. That is the exact window the Self Hypnosis Goddess audio library is built for.
            </p>
          </div>
        </div>
      </div>

      {/* MONEY CAPACITY LADDER */}
      <div style={{ padding: "100px 48px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          <div style={{ fontSize: 13, letterSpacing: ".28em", textTransform: "uppercase", background: LG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", marginBottom: 20, fontWeight: 600 }}>The Money Capacity Ladder</div>
          <h2 style={{ fontSize: "clamp(38px,6vw,76px)", fontWeight: 300, color: "#f2ece4", lineHeight: 1.05, letterSpacing: "-.03em", marginBottom: 16 }}>Pick the level that makes you go</h2>
          <h2 style={{ fontSize: "clamp(38px,6vw,76px)", fontWeight: 300, background: LG, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", lineHeight: 1.05, letterSpacing: "-.03em", marginBottom: 16 }}>"heaven yes — that could be me."</h2>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: "rgba(242,236,228,0.7)", maxWidth: 680, marginBottom: 64 }}>
            That nervous, excited feeling is your nervous system recognising the next level it can actually practise. Stay there until it feels normal. Then go again. There is no ceiling.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {[
              { level:5, amount:"£100K a month", note:"The level that still feels like fiction. Until you stay here long enough for it to feel like Tuesday.", badge:"linear-gradient(160deg,#2CB7A7,#167A6B)", color:"#000" },
              { level:4, amount:"£10K a day", note:"Bigger systems, bigger visibility. Real pathways under you by now.", badge:"linear-gradient(160deg,#BFA5D8,#2CB7A7)", color:"#000" },
              { level:3, amount:"£1K a day", note:"Delulu is the solulu. Same number, completely new meaning — this is what you earn in a day, not a month.", badge:"linear-gradient(160deg,#E8B870,#BFA5D8)", color:"#000" },
              { level:2, amount:"£5K a month", note:"The first level where the nervous system starts to feel it as real. Stay here until it's boring.", badge:"linear-gradient(160deg,#F5E0A0,#E8B870)", color:"#000" },
              { level:1, amount:"£1K a month", note:"The level your current identity already believes without blinking. Your starting point, not your ceiling.", badge:"linear-gradient(160deg,#f2ece4,#F5E0A0)", color:"#1a0a04" },
            ].map((rung, i) => (
              <div key={i}
                style={{ display:"grid", gridTemplateColumns:"72px 1fr", overflow:"hidden", borderRadius:10, cursor:"pointer", transition:"transform .3s", marginBottom:3 }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateX(8px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateX(0)"; }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:rung.color, background:rung.badge }}>
                  {rung.level}
                </div>
                <div style={{ padding:"24px 36px", background:"rgba(255,255,255,.025)", border:"1px solid rgba(255,255,255,.06)", borderLeft:"none", borderRadius:"0 10px 10px 0" }}>
                  <div style={{ fontSize:"clamp(32px,4.5vw,52px)", fontWeight:400, color:"#f2ece4", lineHeight:1, marginBottom:8, letterSpacing:"-.02em" }}>{rung.amount}</div>
                  <div style={{ fontSize:13, color:"#f2ece4", lineHeight:1.5 }}>{rung.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: "100px 48px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(32px,5vw,60px)", fontWeight: 300, color: "#f2ece4", lineHeight: 1.1, letterSpacing: "-.03em", marginBottom: 16 }}>Ready to install it?</h2>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: "rgba(242,236,228,0.65)", marginBottom: 56 }}>Find your level. Install it tonight.</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 64 }}>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "36px 28px" }}>
              <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>Free · 2 minutes</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: "#f2ece4", marginBottom: 8 }}>RichGirl Quiz</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 28 }}>Find your current capacity level. Identify your block. Two minutes. Free.</div>
              <a href="/blocks/money" style={{ display: "block", background: LG, border: "none", borderRadius: 30, padding: "16px 20px", color: "#000", fontFamily: "'Jost',sans-serif", fontSize: 14, fontWeight: 600, letterSpacing: ".04em", textDecoration: "none" }}>Take the quiz — free</a>
            </div>
            <div style={{ background: LG, borderRadius: 16, padding: "36px 28px" }}>
              <div style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: 16 }}>Instant access</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: "#000", marginBottom: 4 }}>RichGirl Workbook</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#000", marginBottom: 4 }}>£29 <span style={{ fontSize: 14, textDecoration: "line-through", opacity: 0.4 }}>£49</span></div>
              <div style={{ fontSize: 14, color: "rgba(0,0,0,0.65)", lineHeight: 1.6, marginBottom: 28 }}>21 days to activate your RichGirl operating system.</div>
              <a href="https://shop.beacons.ai/reshmaoracle/765f9e37-68f6-4d14-bc86-c952a2ca565f" target="_blank" rel="noreferrer" style={{ display: "block", background: "#000", border: "none", borderRadius: 30, padding: "16px 20px", color: "#f2ece4", fontFamily: "'Jost',sans-serif", fontSize: 14, fontWeight: 600, letterSpacing: ".04em", textDecoration: "none" }}>Get the RichGirl Workbook →</a>
            </div>
          </div>

          <p style={{ fontSize: "clamp(18px,2.5vw,26px)", fontWeight: 300, color: "#f2ece4", lineHeight: 1.6, maxWidth: 480, margin: "0 auto" }}>
            After this, the old version of you stops making sense. You don't go back.
          </p>
        </div>
      </div>

    </div>
  );
}
