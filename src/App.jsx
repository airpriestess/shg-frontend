import { useState, useRef, useEffect } from "react";

const C = {
  black: "#000000",
  card: "#0a0800",
  card2: "#0f0c01",
  border: "#1e1608",
  border2: "#140f05",
  gold: "#C8892A",
  rose: "#C4365A",
  text: "#e8e0d0",
  text2: "#c8a870",
  muted: "#5a4a2a",
  dim: "#2a1e0a",
  green: "#3a8a4a",
};

const FREE_TRACK_URL = "https://qtwvslrwmreazmrdktsn.supabase.co/storage/v1/object/public/tracks/COMPRESS%2010%20YEARS%20OF%20DELAY%20INTO%20ONE%20HOUR%20EMDR%20THEN%20ECHO%2007.04.2026.mp3";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300;1,400;1,600&family=Inter:wght@300;400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:#000;color:#e8e0d0;font-family:'Inter',sans-serif;overflow-x:hidden}
button,input{font-family:'Inter',sans-serif}
input{background:#080600;border:1px solid #1e1608;color:#e8e0d0;border-radius:10px;padding:14px 18px;font-size:16px;width:100%;outline:none;transition:border-color 0.2s}
input:focus{border-color:#C8892A66}
::-webkit-scrollbar{width:2px}
::-webkit-scrollbar-thumb{background:#1e1608}
.wm{font-family:'Cormorant Garamond',serif;font-style:italic}

/* Sacred geometry rings */
.orb{position:absolute;border-radius:50%;pointer-events:none}
.ring{position:absolute;border-radius:50%;border:1px solid;pointer-events:none;animation:breathe 6s ease-in-out infinite}
@keyframes breathe{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:var(--op)}50%{transform:translate(-50%,-50%) scale(1.06);opacity:calc(var(--op)*2)}}

/* Audio player pulse */
.pulse{animation:pulse-ring 2s ease-out infinite}
@keyframes pulse-ring{0%{box-shadow:0 0 0 0 #C8892A44}70%{box-shadow:0 0 0 20px #C8892A00}100%{box-shadow:0 0 0 0 #C8892A00}}

/* Wave */
.wave span{display:inline-block;width:3px;background:#C8892A;border-radius:2px;margin:0 1.5px;animation:wv 1s ease-in-out infinite}
.wave span:nth-child(1){height:6px;animation-delay:0s}
.wave span:nth-child(2){height:14px;animation-delay:.1s}
.wave span:nth-child(3){height:20px;animation-delay:.2s}
.wave span:nth-child(4){height:11px;animation-delay:.15s}
.wave span:nth-child(5){height:16px;animation-delay:.25s}
@keyframes wv{0%,100%{transform:scaleY(0.4)}50%{transform:scaleY(1)}}

.fade{animation:fi 0.4s ease}
@keyframes fi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

/* Mobile */
@media(max-width:768px){
  .hide-mobile{display:none!important}
  .mobile-only{display:block!important}
  .grid-2{grid-template-columns:1fr!important}
  .grid-3{grid-template-columns:1fr!important}
  .price-grid{grid-template-columns:1fr!important}
  .hero-title{font-size:clamp(36px,9vw,52px)!important}
  .section-inner{padding:48px 20px!important}
  .step-row{flex-direction:column!important}
  .mobile-nav{display:flex!important}
  .desktop-tabs{display:none!important}
  .portal-pad{padding-bottom:80px!important}
  .sidebar{display:none!important}
}
.mobile-only{display:none}
.mobile-nav{display:none}
`;

function Btn({ children, onClick, full, outline, small, disabled, rose }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: full ? "100%" : "auto",
      padding: small ? "10px 20px" : "16px 32px",
      background: disabled ? "#1a1208" : outline ? "transparent"
        : rose ? `linear-gradient(90deg,${C.rose},#8a1a3a)`
        : `linear-gradient(90deg,${C.gold},${C.rose})`,
      border: outline ? `1.5px solid ${C.gold}88` : "none",
      borderRadius: 12, color: disabled ? C.dim : outline ? C.gold : "#000",
      fontSize: small ? 14 : 16, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      gap: 8, transition: "transform 0.15s", minHeight: 48, letterSpacing: "0.02em",
    }}
      onMouseEnter={e => !disabled && (e.currentTarget.style.transform = "translateY(-2px)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
    >{children}</button>
  );
}

// Sacred geometry background component
function SacredBg({ rose }) {
  const color = rose ? C.rose : C.gold;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {/* Gradient orb */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, background: `radial-gradient(circle,${rose ? C.rose : C.gold}08 0%,transparent 65%)`, borderRadius: "50%" }} />
      {/* Rings */}
      {[160, 280, 420, 580, 750].map((size, i) => (
        <div key={i} className="ring" style={{
          width: size, height: size,
          top: "50%", left: "50%",
          borderColor: `${color}${['18','10','08','05','03'][i]}`,
          "--op": [0.12, 0.08, 0.05, 0.03, 0.02][i],
          animationDelay: `${i * 0.8}s`,
        }} />
      ))}
    </div>
  );
}

// Fake phone mockup for before/after
function PhoneMockup({ children }) {
  return (
    <div style={{ background: "#0a0a0a", borderRadius: 32, padding: "10px 8px", border: "2px solid #2a2a2a", width: "100%", maxWidth: 200, margin: "0 auto", boxShadow: "0 20px 60px rgba(0,0,0,0.8)" }}>
      <div style={{ background: "#111", borderRadius: 4, height: 4, width: 40, margin: "0 auto 8px" }} />
      {children}
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [tier, setTier] = useState("audio");
  const [userTier, setUserTier] = useState("goddess");
  const go = (s, t) => { if (t) setTier(t); setScreen(s); window.scrollTo(0, 0); };
  return (
    <>
      <style>{css}</style>
      {screen === "landing" && <Landing onJoin={t => go("onboard", t)} onProofOS={() => go("proofos")} onDemo={() => { setUserTier("goddess"); go("portal"); }} />}
      {screen === "proofos" && <ProofOSPage onBack={() => go("landing")} onJoin={t => go("onboard", t)} />}
      {screen === "onboard" && <Onboard tier={tier} onSuccess={() => { setUserTier(tier === "goddess" ? "goddess" : "audio"); go("portal"); }} onBack={() => go("landing")} />}
      {screen === "portal" && <Portal userTier={userTier} onSignOut={() => go("landing")} onUpgrade={() => go("proofos")} />}
    </>
  );
}

// ═══════════════════════════════════════════════════════
// LANDING PAGE
// ═══════════════════════════════════════════════════════
function Landing({ onJoin, onProofOS, onDemo }) {
  const [billing, setBilling] = useState("monthly");
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeMenu, setActiveMenu] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play(); setPlaying(true); }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const update = () => setProgress((audio.currentTime / audio.duration) * 100 || 0);
    audio.addEventListener("timeupdate", update);
    audio.addEventListener("ended", () => { setPlaying(false); setProgress(0); });
    return () => audio.removeEventListener("timeupdate", update);
  }, []);

  const cats = [
    { id: "sp", label: "SP & Love", tagline: "No contact. He comes back first.", color: "#c4365a",
      tracks: ["He's already on his way back","He's obsessed and he knows it","I never chase — he catches up","No contact — he comes back first"] },
    { id: "money", label: "Money", tagline: "Money behaves around me.", color: "#6ab05a",
      tracks: ["Money finds me first","Unexpected income · always","I am a money magnet","Overflow is my baseline"] },
    { id: "beauty", label: "Beauty", tagline: "Gorgeous is my default.", color: "#c8892a",
      tracks: ["Gorgeous is my default setting","I get prettier every single day","Everyone notices — I don't try","My face is shifting"] },
    { id: "identity", label: "Identity", tagline: "I was born the exception.", color: "#9a7ad0",
      tracks: ["I've always been the prize","Reality rearranges for me","I said so, therefore it is","She version of me"] },
    { id: "dna", label: "DNA", tagline: "My blood remembers who I am.", color: "#7a9ad0",
      tracks: ["DNA activation ceremony","I override what I inherited","Cellular regeneration","Ancient codes unlocked"] },
    { id: "sleep", label: "Sleep", tagline: "I wake up as her.", color: "#6a8ad0",
      tracks: ["I manifest while I sleep","I wake up as her","Overnight identity shift","Deep sleep · deep reprogramming"] },
  ];
  const [activeCat, setActiveCat] = useState("sp");
  const cat = cats.find(c => c.id === activeCat);

  return (
    <div style={{ minHeight: "100vh", background: C.black }}>
      <audio ref={audioRef} src={FREE_TRACK_URL} preload="none" />

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, padding: "0 20px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,0,0.95)", borderBottom: `1px solid ${C.border}`, backdropFilter: "blur(20px)" }}>
        <button onClick={() => window.scrollTo(0,0)} style={{ background:"none",border:"none",cursor:"pointer" }}>
          <span className="wm" style={{ fontSize: 18, background: `linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Self Hypnosis Goddess</span>
        </button>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <button onClick={onProofOS} className="hide-mobile" style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:8, padding:"7px 14px", color:C.muted, fontSize:13, cursor:"pointer" }}>ProofOS ✦</button>
          <button onClick={onDemo} className="hide-mobile" style={{ background:"none", border:"none", color:C.muted, fontSize:13, cursor:"pointer" }}>Dashboard</button>
          <Btn small onClick={() => onJoin("audio")}>Join now</Btn>
          {/* Hamburger */}
          <button onClick={() => setActiveMenu(!activeMenu)} style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:8, padding:"7px 10px", color:C.muted, cursor:"pointer", display:"flex", flexDirection:"column", gap:4 }}>
            {[0,1,2].map(i => <div key={i} style={{ width:18, height:1.5, background:C.muted }} />)}
          </button>
        </div>
        {/* Menu dropdown */}
        {activeMenu && (
          <div style={{ position:"absolute", top:58, right:20, background:"#0a0800", border:`1px solid ${C.border}`, borderRadius:12, padding:16, minWidth:200, zIndex:300 }}>
            {[
              { label:"Audio Library", action:() => { setActiveMenu(false); } },
              { label:"ProofOS ✦", action:() => { setActiveMenu(false); onProofOS(); } },
              { label:"Preview Dashboard", action:() => { setActiveMenu(false); onDemo(); } },
              { label:"YouTube →", action:() => window.open("https://www.youtube.com/@Reshma.Oracle","_blank") },
              { label:"Instagram →", action:() => window.open("https://www.instagram.com/reshma.oracle/","_blank") },
            ].map((item,i) => (
              <button key={i} onClick={item.action} style={{ display:"block", width:"100%", textAlign:"left", padding:"10px 12px", background:"none", border:"none", color:C.text2, fontSize:14, cursor:"pointer", borderRadius:8 }}
                onMouseEnter={e => e.currentTarget.style.background = C.dim}
                onMouseLeave={e => e.currentTarget.style.background = "none"}>
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <div style={{ position:"relative", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", paddingTop:58, overflow:"hidden" }}>
        <SacredBg />
        <div style={{ position:"relative", zIndex:1, textAlign:"center", padding:"60px 20px", maxWidth:680, margin:"0 auto", width:"100%" }}>
          {/* Eyebrow */}
          <div style={{ fontSize:11, letterSpacing:"0.35em", textTransform:"uppercase", color:C.muted, marginBottom:24, fontWeight:600 }}>
            Reshma Oracle · Audio Library
          </div>

          {/* Main headline */}
          <h1 className="wm hero-title" style={{ fontSize:"clamp(40px,8vw,68px)", lineHeight:1.1, marginBottom:24, color:C.text }}>
            Self Hypnosis<br />
            <span style={{ background:`linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Goddess</span>
          </h1>

          {/* Sub */}
          <p style={{ fontSize:"clamp(16px,3vw,20px)", color:"#8a7a5a", lineHeight:1.8, marginBottom:8, maxWidth:520, margin:"0 auto 8px" }}>
            Self hypnosis and subliminal audio tracks that reprogram your subconscious mind for identity shifting and manifestation.
          </p>
          <p style={{ fontSize:15, color:C.muted, marginBottom:16 }}>Not on YouTube. No ads. Real voice. Original tracks.</p>
          <p style={{ fontSize:13, color:C.dim, marginBottom:40 }}>50+ tracks · Self hypnosis · Subliminals · Frequencies · 4 new tracks every week</p>

          {/* FREE TRACK PLAYER */}
          <div style={{ background:"#0a0800", border:`1px solid ${C.gold}44`, borderRadius:16, padding:"20px 24px", maxWidth:420, margin:"0 auto 32px" }}>
            <div style={{ fontSize:11, color:C.gold, letterSpacing:"0.2em", textTransform:"uppercase", fontWeight:700, marginBottom:12 }}>Free track — listen now</div>
            <div style={{ fontSize:15, fontWeight:600, color:C.text2, marginBottom:4 }}>10 Years of Delay Into One Hour</div>
            <div style={{ fontSize:12, color:C.muted, marginBottom:16 }}>EMDR · Self hypnosis · 9 min</div>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <button onClick={togglePlay} className={playing ? "pulse" : ""} style={{ width:48, height:48, borderRadius:"50%", background:`linear-gradient(135deg,${C.gold},${C.rose})`, border:"none", color:"#000", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {playing ? "⏸" : "▶"}
              </button>
              <div style={{ flex:1 }}>
                <div style={{ height:3, background:C.border, borderRadius:2, marginBottom:6, cursor:"pointer" }}
                  onClick={e => { const r=e.target.getBoundingClientRect(); const pct=(e.clientX-r.left)/r.width; if(audioRef.current) audioRef.current.currentTime=pct*audioRef.current.duration; }}>
                  <div style={{ width:`${progress}%`, height:"100%", background:`linear-gradient(90deg,${C.gold},${C.rose})`, borderRadius:2 }} />
                </div>
                <div style={{ fontSize:11, color:C.dim }}>{playing ? "Playing..." : "Tap to preview"}</div>
              </div>
              {playing && <div className="wave"><span/><span/><span/><span/><span/></div>}
            </div>
          </div>

          {/* CTA */}
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap", marginBottom:16 }}>
            <Btn onClick={() => onJoin("audio")}>Start listening — €19.99/month</Btn>
            <Btn outline onClick={onDemo}>See the dashboard</Btn>
          </div>
          <div style={{ fontSize:13, color:C.dim }}>Cancel anytime · Stripe · No download · Any device</div>
        </div>
      </div>

      {/* PRICING — right after hero */}
      <div className="section-inner" style={{ padding:"60px 20px", maxWidth:860, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontSize:11, color:C.muted, letterSpacing:"0.25em", textTransform:"uppercase", marginBottom:12 }}>Choose your tier</div>
          <h2 className="wm" style={{ fontSize:"clamp(28px,5vw,44px)", color:C.text, marginBottom:8 }}>Full access. No ads. Ever.</h2>
          <div style={{ fontSize:15, color:C.muted }}>Start with Audio. Upgrade to Goddess for ProofOS.</div>
        </div>
        {/* Billing toggle */}
        <div style={{ display:"flex", justifyContent:"center", marginBottom:28 }}>
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:4, display:"flex", gap:4 }}>
            {["monthly","annual"].map(b => (
              <button key={b} onClick={() => setBilling(b)} style={{ padding:"9px 20px", borderRadius:9, background:billing===b?`linear-gradient(90deg,${C.gold},${C.rose})`:"transparent", border:"none", color:billing===b?"#000":C.muted, fontSize:14, fontWeight:700, cursor:"pointer", minHeight:40 }}>
                {b==="annual"?"Annual — save 20%":"Monthly"}
              </button>
            ))}
          </div>
        </div>
        {/* Tier cards */}
        <div className="price-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
          {[
            { id:"audio", name:"Audio Tier",
              price:billing==="monthly"?"€19.99":"€192",
              period:billing==="monthly"?"/month":"/year",
              sub:billing==="annual"?"€16/mo · 2 months free":null,
              features:["Full self hypnosis audio library","50+ subliminals and frequency tracks","All 6 desire categories","4 new tracks every week","Loop player + sleep timer","No ads. Ever.","Any device — no download needed"],
              cta:"Join Audio Tier" },
            { id:"goddess", name:"Goddess Tier", popular:true,
              price:billing==="monthly"?"€33":"€317",
              period:billing==="monthly"?"/month":"/year",
              sub:billing==="annual"?"€26.40/mo · 2 months free":null,
              features:["Everything in Audio Tier","ProofOS manifestation tracker ✦ coming soon","Log desires · link to your audio · capture proof","Early access — new tracks 48hrs ahead","Monthly ritual audio included","Goddess community"],
              proofos:true,
              cta:"Become Goddess" },
          ].map(p => (
            <div key={p.id} style={{ background:C.card, border:`${p.popular?"2px":"1px"} solid ${p.popular?C.gold+"66":C.border}`, borderRadius:16, padding:24, position:"relative" }}>
              {p.popular && <div style={{ position:"absolute", top:-13, left:"50%", transform:"translateX(-50%)", background:`linear-gradient(90deg,${C.gold},${C.rose})`, color:"#000", fontSize:11, fontWeight:800, padding:"3px 16px", borderRadius:20, whiteSpace:"nowrap", letterSpacing:"0.08em" }}>MOST POPULAR</div>}
              <div style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:4 }}>{p.name}</div>
              {p.sub && <div style={{ fontSize:13, color:C.muted, marginBottom:8 }}>{p.sub}</div>}
              <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:20 }}>
                <span style={{ fontSize:42, fontWeight:800, color:p.popular?C.rose:C.gold, lineHeight:1 }}>{p.price}</span>
                <span style={{ fontSize:14, color:C.muted }}>{p.period}</span>
              </div>
              {p.features.map((f,i) => (
                <div key={i} style={{ fontSize:14, color:f.includes("✦")?C.gold:"#8a7050", marginBottom:8, paddingLeft:16, position:"relative", lineHeight:1.5 }}>
                  <span style={{ position:"absolute", left:0, color:C.gold }}>·</span>{f}
                </div>
              ))}
              {p.proofos && (
                <button onClick={onProofOS} style={{ background:"none", border:"none", color:C.rose, fontSize:13, cursor:"pointer", padding:"4px 0", textDecoration:"underline" }}>Find out more about ProofOS →</button>
              )}
              <div style={{ marginTop:20 }}>
                <Btn full outline={!p.popular} onClick={() => onJoin(p.id)}>{p.cta}</Btn>
              </div>
            </div>
          ))}
        </div>
        {/* Founder */}
        <div style={{ background:"linear-gradient(135deg,#0d0900,#160b01)", border:`2px solid ${C.gold}44`, borderRadius:16, padding:28 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:20, alignItems:"center" }} className="grid-2">
            <div>
              <div style={{ fontSize:11, color:C.gold, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:10 }}>First 1,000 only · Lifetime access</div>
              <div className="wm" style={{ fontSize:"clamp(22px,4vw,32px)", color:C.text, marginBottom:8 }}>Founder Lifetime</div>
              <div style={{ display:"flex", alignItems:"baseline", gap:6, marginBottom:14 }}>
                <span style={{ fontSize:44, fontWeight:800, color:C.gold }}>€500</span>
                <span style={{ fontSize:14, color:C.muted }}>once · never pay again</span>
              </div>
              <div style={{ fontSize:14, color:"#7a6a4a", lineHeight:1.75, marginBottom:16 }}>Full vault + ProofOS + every future feature + 1 GB evidence vault — forever. The €500 price closes when the first 1,000 members join.</div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
                {["Full vault for life","ProofOS for life","1 GB evidence vault","All future features","Founder's seal ✦"].map((f,i) => (
                  <span key={i} style={{ padding:"4px 12px", background:C.gold+"18", border:`1px solid ${C.gold}33`, borderRadius:20, fontSize:12, color:C.gold, fontWeight:600 }}>{f}</span>
                ))}
              </div>
              <Btn onClick={() => onJoin("founder")}>Claim lifetime access — €500</Btn>
            </div>
          </div>
        </div>
        <div style={{ textAlign:"center", marginTop:16, fontSize:13, color:C.dim, lineHeight:1.9 }}>
          No refunds after 14 days · Cancel before renewal · Web app · iPhone: Add to Home Screen
        </div>
      </div>

      {/* BEFORE & AFTER — phone mockups */}
      <div className="section-inner" style={{ padding:"60px 20px", maxWidth:1000, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:48 }}>
          <div style={{ fontSize:11, color:C.muted, letterSpacing:"0.25em", textTransform:"uppercase", marginBottom:12 }}>What changes</div>
          <h2 className="wm" style={{ fontSize:"clamp(28px,5vw,44px)", color:C.text }}>The shift is real.</h2>
        </div>
        <div className="grid-3" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:20 }}>

          {/* SP & Love */}
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden" }}>
            <div style={{ padding:"14px 16px", borderBottom:`1px solid ${C.border}`, background:"#0d0508" }}>
              <div style={{ fontSize:11, color:"#c4365a", fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase" }}>SP & Love</div>
              <div style={{ fontSize:13, color:C.muted, marginTop:2 }}>No contact. He comes back first.</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:0 }}>
              <div style={{ padding:14, borderRight:`1px solid ${C.border}` }}>
                <div style={{ fontSize:10, color:"#5a3a3a", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:10 }}>Before</div>
                {/* Fake WhatsApp - before */}
                <div style={{ background:"#111", borderRadius:12, padding:10, fontSize:11 }}>
                  <div style={{ fontSize:10, color:"#4a4a4a", marginBottom:6 }}>Messages · 6 days ago</div>
                  <div style={{ background:"#1a1a1a", borderRadius:8, padding:"7px 9px", marginBottom:4 }}>
                    <div style={{ color:"#666", fontSize:11 }}>Hey, are you there?</div>
                    <div style={{ color:"#333", fontSize:10, textAlign:"right", marginTop:2 }}>✓</div>
                  </div>
                  <div style={{ background:"#1a1a1a", borderRadius:8, padding:"7px 9px", marginBottom:4 }}>
                    <div style={{ color:"#555", fontSize:11 }}>Can we talk?</div>
                    <div style={{ color:"#333", fontSize:10, textAlign:"right", marginTop:2 }}>✓</div>
                  </div>
                  <div style={{ color:"#3a3a3a", fontSize:10, textAlign:"center", marginTop:6 }}>No reply · 6 days</div>
                </div>
                <div style={{ fontSize:12, color:"#5a4a4a", marginTop:8, lineHeight:1.5, fontStyle:"italic" }}>Checking. Waiting. Desperate.</div>
              </div>
              <div style={{ padding:14 }}>
                <div style={{ fontSize:10, color:C.gold, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:10 }}>After</div>
                {/* Fake WhatsApp - after */}
                <div style={{ background:"#0a0f0a", borderRadius:12, padding:10, fontSize:11, border:`1px solid #1a2a1a` }}>
                  <div style={{ fontSize:10, color:"#3a5a3a", marginBottom:6 }}>Messages · Today</div>
                  <div style={{ background:"#0f2a0f", borderRadius:8, padding:"7px 9px", marginBottom:4, border:`1px solid #1a3a1a` }}>
                    <div style={{ color:"#7ab07a", fontSize:11 }}>Hey... been thinking about you</div>
                    <div style={{ color:"#3a5a3a", fontSize:10, marginTop:2 }}>11:43pm · ✓✓</div>
                  </div>
                  <div style={{ color:"#3a6a3a", fontSize:10, textAlign:"center", marginTop:6 }}>You had stopped waiting ✦</div>
                </div>
                <div style={{ fontSize:12, color:C.text2, marginTop:8, lineHeight:1.5, fontStyle:"italic" }}>You had already moved on.</div>
              </div>
            </div>
          </div>

          {/* Money */}
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden" }}>
            <div style={{ padding:"14px 16px", borderBottom:`1px solid ${C.border}`, background:"#080d08" }}>
              <div style={{ fontSize:11, color:"#6ab05a", fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase" }}>Money</div>
              <div style={{ fontSize:13, color:C.muted, marginTop:2 }}>Money behaves around me.</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:0 }}>
              <div style={{ padding:14, borderRight:`1px solid ${C.border}` }}>
                <div style={{ fontSize:10, color:"#5a3a3a", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:10 }}>Before</div>
                <div style={{ background:"#111", borderRadius:12, padding:10 }}>
                  <div style={{ fontSize:10, color:"#4a4a4a", marginBottom:6 }}>Chase Bank</div>
                  <div style={{ fontSize:18, fontWeight:700, color:"#5a5a5a", marginBottom:8 }}>€247.83</div>
                  {[["Rent","-€900"],["Groceries","-€84"],["Phone","-€45"]].map(([k,v]) => (
                    <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#3a3a3a", marginBottom:3 }}>
                      <span>{k}</span><span style={{ color:"#5a2a2a" }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize:12, color:"#5a4a4a", marginTop:8, lineHeight:1.5, fontStyle:"italic" }}>Counting what's left.</div>
              </div>
              <div style={{ padding:14 }}>
                <div style={{ fontSize:10, color:C.gold, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:10 }}>After</div>
                <div style={{ background:"#080f08", borderRadius:12, padding:10, border:`1px solid #1a2a1a` }}>
                  <div style={{ fontSize:10, color:"#3a5a3a", marginBottom:6 }}>Chase Bank · New transfer</div>
                  <div style={{ background:"#0a1f0a", borderRadius:8, padding:"8px 10px", border:`1px solid #1a3a1a` }}>
                    <div style={{ fontSize:10, color:"#4a8a4a", marginBottom:2 }}>✓ Payment received</div>
                    <div style={{ fontSize:22, fontWeight:800, color:"#6ab06a" }}>€10,000</div>
                    <div style={{ fontSize:10, color:"#2a4a2a", marginTop:2 }}>Unexpected · Source hidden</div>
                  </div>
                </div>
                <div style={{ fontSize:12, color:C.text2, marginTop:8, lineHeight:1.5, fontStyle:"italic" }}>Unexpected. As asked.</div>
              </div>
            </div>
          </div>

          {/* Beauty */}
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden" }}>
            <div style={{ padding:"14px 16px", borderBottom:`1px solid ${C.border}`, background:"#0d0c08" }}>
              <div style={{ fontSize:11, color:C.gold, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase" }}>Beauty & Identity</div>
              <div style={{ fontSize:13, color:C.muted, marginTop:2 }}>Gorgeous is my default.</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:0 }}>
              <div style={{ padding:14, borderRight:`1px solid ${C.border}` }}>
                <div style={{ fontSize:10, color:"#5a3a3a", fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:10 }}>Before</div>
                <div style={{ background:"#111", borderRadius:12, padding:10 }}>
                  <div style={{ width:48, height:48, borderRadius:"50%", background:"#1a1a1a", border:"2px solid #2a2a2a", margin:"0 auto 8px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, filter:"grayscale(1) opacity(0.3)" }}>🪞</div>
                  <div style={{ fontSize:10, color:"#4a3a3a", textAlign:"center", lineHeight:1.5 }}>Looking for what's wrong.<br/>Every. Single. Morning.</div>
                </div>
                <div style={{ fontSize:12, color:"#5a4a4a", marginTop:8, lineHeight:1.5, fontStyle:"italic" }}>Picking apart every detail.</div>
              </div>
              <div style={{ padding:14 }}>
                <div style={{ fontSize:10, color:C.gold, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:10 }}>After</div>
                <div style={{ background:"#0a0900", borderRadius:12, padding:10, border:`1px solid #2a1e08` }}>
                  <div style={{ fontSize:10, color:"#4a3a1a", marginBottom:6 }}>Messages</div>
                  {[
                    {from:"Sarah",msg:"What are you doing differently? You're GLOWING"},
                    {from:"Mia",msg:"Seriously what's your secret 😭"},
                  ].map((m,i) => (
                    <div key={i} style={{ background:"#140f02", borderRadius:8, padding:"6px 8px", marginBottom:4, border:`1px solid #2a1e08` }}>
                      <div style={{ fontSize:9, color:C.muted, marginBottom:2 }}>{m.from}</div>
                      <div style={{ fontSize:11, color:C.text2 }}>{m.msg}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize:12, color:C.text2, marginTop:8, lineHeight:1.5, fontStyle:"italic" }}>They notice before you do.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AUDIO LIBRARY */}
      <div className="section-inner" style={{ padding:"60px 20px", maxWidth:900, margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontSize:11, color:C.muted, letterSpacing:"0.25em", textTransform:"uppercase", marginBottom:12 }}>The vault</div>
          <h2 className="wm" style={{ fontSize:"clamp(28px,5vw,44px)", color:C.text, marginBottom:8 }}>Every desire has its own track.</h2>
          <div style={{ fontSize:15, color:C.muted }}>An ever-expanding library. 4 new tracks every week. Never on YouTube.</div>
        </div>
        {/* Category tabs */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", marginBottom:20 }}>
          {cats.map(c => (
            <button key={c.id} onClick={() => setActiveCat(c.id)} style={{ padding:"8px 18px", borderRadius:24, border:`1.5px solid ${activeCat===c.id?c.color:C.border}`, background:activeCat===c.id?c.color+"22":"none", color:activeCat===c.id?c.color:C.muted, fontSize:14, fontWeight:600, cursor:"pointer", minHeight:40, transition:"all 0.2s" }}>
              {c.label}
            </button>
          ))}
        </div>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden" }}>
          <div style={{ padding:"16px 20px 14px", borderBottom:`1px solid ${C.border}` }}>
            <div style={{ fontSize:12, color:cat.color, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>{cat.label}</div>
            <div className="wm" style={{ fontSize:22, color:C.text }}>{cat.tagline}</div>
          </div>
          {cat.tracks.map((t,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 20px", borderBottom:i<cat.tracks.length-1?`1px solid ${C.border2}`:"none" }}>
              <div style={{ width:38, height:38, borderRadius:"50%", background:i===0?cat.color+"22":"#080600", border:`1.5px solid ${i===0?cat.color:C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>
                {i===0?"▶":"🔒"}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:15, fontWeight:600, color:i===0?cat.color:C.text2, marginBottom:2 }}>{t}</div>
                <div style={{ fontSize:12, color:C.dim }}>Self hypnosis · Subliminal · {20+i*5} min</div>
              </div>
              {i===0 && <span style={{ fontSize:12, padding:"3px 10px", background:cat.color+"22", color:cat.color, borderRadius:12, fontWeight:700 }}>FREE</span>}
            </div>
          ))}
        </div>
        <div style={{ textAlign:"center", marginTop:14, fontSize:14, color:C.muted }}>First track in every category is free · Full library from €19.99/month</div>
      </div>

      {/* PROOFOS TEASER */}
      <div className="section-inner" style={{ padding:"0 20px 60px", maxWidth:900, margin:"0 auto" }}>
        <div style={{ position:"relative", background:"linear-gradient(135deg,#0a0700,#12080a)", border:`2px solid ${C.gold}44`, borderRadius:20, padding:32, overflow:"hidden", cursor:"pointer" }} onClick={onProofOS}>
          <SacredBg rose />
          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{ fontSize:11, color:C.rose, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:12 }}>Goddess Tier · Coming soon</div>
            <div className="wm" style={{ fontSize:"clamp(36px,7vw,60px)", lineHeight:0.95, marginBottom:10, background:`linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>ProofOS ✦</div>
            <div style={{ fontSize:15, color:C.muted, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:20 }}>The manifestation ledger</div>
            <div style={{ fontSize:16, color:"#8a7a5a", lineHeight:1.8, marginBottom:24, maxWidth:500 }}>
              Log your desire. Link it to the exact audio you listened to. Capture the signs as they arrive. Watch the pattern become undeniable — and see exactly how many days it took.
            </div>
            <span style={{ fontSize:15, color:C.gold, fontWeight:600 }}>Find out more about ProofOS →</span>
          </div>
        </div>
      </div>

      {/* VIDEO/VOICE PLACEHOLDER */}
      <div className="section-inner" style={{ padding:"0 20px 60px", maxWidth:700, margin:"0 auto" }}>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:32, textAlign:"center" }}>
          <div style={{ fontSize:11, color:C.muted, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:12 }}>From Reshma Oracle</div>
          <div style={{ width:80, height:80, borderRadius:"50%", background:C.dim, border:`2px solid ${C.border}`, margin:"0 auto 16px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32 }}>▶</div>
          <div className="wm" style={{ fontSize:22, color:C.text, marginBottom:8 }}>Hear it in her own voice.</div>
          <div style={{ fontSize:14, color:C.muted }}>Video message coming soon.</div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop:`1px solid ${C.border}`, padding:"32px 20px", textAlign:"center" }}>
        <div className="wm" style={{ fontSize:20, display:"block", marginBottom:12, background:`linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Self Hypnosis Goddess</div>
        <div style={{ display:"flex", gap:20, justifyContent:"center", marginBottom:16 }}>
          {[["YouTube","https://www.youtube.com/@Reshma.Oracle"],["Instagram","https://www.instagram.com/reshma.oracle/"]].map(([l,u]) => (
            <a key={l} href={u} target="_blank" rel="noopener noreferrer" style={{ fontSize:13, color:C.muted, textDecoration:"none" }}>{l} →</a>
          ))}
        </div>
        <div style={{ fontSize:12, color:C.dim }}>© 2026 Reshma Oracle · All rights reserved</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// PROOFOS PAGE
// ═══════════════════════════════════════════════════════
function ProofOSPage({ onBack, onJoin }) {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  return (
    <div style={{ minHeight:"100vh", background:C.black }} className="fade">
      <nav style={{ position:"sticky", top:0, zIndex:100, padding:"0 20px", height:58, display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(0,0,0,0.96)", borderBottom:`1px solid ${C.border}` }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:C.muted, fontSize:15, cursor:"pointer" }}>← Back</button>
        <span className="wm" style={{ fontSize:17, background:`linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Self Hypnosis Goddess</span>
        <div style={{ width:60 }} />
      </nav>
      <div style={{ position:"relative", padding:"70px 20px 56px", textAlign:"center", overflow:"hidden" }}>
        <SacredBg rose />
        <div style={{ position:"relative", zIndex:1, maxWidth:600, margin:"0 auto" }}>
          <div style={{ fontSize:11, color:C.rose, fontWeight:700, letterSpacing:"0.25em", textTransform:"uppercase", marginBottom:16 }}>Goddess Tier Exclusive · Coming Soon</div>
          <div className="wm" style={{ fontSize:"clamp(60px,14vw,100px)", lineHeight:0.9, marginBottom:14, background:`linear-gradient(135deg,${C.gold},${C.rose})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>ProofOS</div>
          <div style={{ fontSize:14, color:C.muted, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:24 }}>The Manifestation Ledger</div>
          <div style={{ fontSize:"clamp(18px,3vw,24px)", fontWeight:600, color:C.text, lineHeight:1.6, marginBottom:12 }}>You've been manifesting.<br />Now watch it prove itself.</div>
          <div style={{ fontSize:15, color:"#7a6a4a", lineHeight:1.8, marginBottom:36 }}>ProofOS links every desire you set to the exact audio you listened to. It captures the signs. Records the proof. Shows you exactly how many days it took from first listen to final result.</div>
          {!joined ? (
            <div style={{ maxWidth:380, margin:"0 auto" }}>
              <div style={{ display:"flex", gap:10 }}>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" type="email" />
                <Btn onClick={() => { if(email.includes("@")) setJoined(true); }}>Join waitlist</Btn>
              </div>
              <div style={{ fontSize:13, color:C.dim, marginTop:8 }}>Goddess Tier members get first access · No spam</div>
            </div>
          ) : (
            <div style={{ padding:"16px 24px", background:"#0a1a0a", border:`1px solid #2a4a2a`, borderRadius:12, maxWidth:380, margin:"0 auto", fontSize:15, color:C.green, fontWeight:500 }}>✓ You're on the list. First access when ProofOS launches.</div>
          )}
        </div>
      </div>
      {/* How it works - horizontal */}
      <div className="section-inner" style={{ padding:"0 20px 60px", maxWidth:1000, margin:"0 auto" }}>
        <h2 style={{ textAlign:"center", fontSize:"clamp(22px,4vw,34px)", fontWeight:700, color:C.text, marginBottom:36 }}>How ProofOS works</h2>
        <div className="step-row" style={{ display:"flex", gap:0, alignItems:"stretch" }}>
          {[
            { n:"01", icon:"✦", title:"Set your intention", body:"State exactly what you want. Specific. Present tense. This becomes your active proof thread." },
            { n:"02", icon:"🎧", title:"Listen with purpose", body:"Every track you play links automatically to your active threads. Every session is dated and recorded." },
            { n:"03", icon:"◈", title:"Capture the proof", body:"Signs, synchronicities, results. A screenshot. A voice note. You log them as they arrive." },
            { n:"04", icon:"✓", title:"Mark it manifested", body:"The moment it arrives — you mark it. ProofOS shows days from first listen to final proof." },
          ].map((s,i) => (
            <div key={i} style={{ display:"flex", alignItems:"stretch", flex:1 }}>
              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:0, flex:1, borderLeft:i>0?"none":undefined, borderTopLeftRadius:i===0?14:0, borderBottomLeftRadius:i===0?14:0, borderTopRightRadius:i===3?14:0, borderBottomRightRadius:i===3?14:0, padding:20 }}>
                <div style={{ fontSize:11, color:C.muted, fontWeight:700, marginBottom:8, fontFamily:"monospace" }}>{s.n}</div>
                <div style={{ fontSize:24, color:C.gold, marginBottom:12 }}>{s.icon}</div>
                <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:8 }}>{s.title}</div>
                <div style={{ fontSize:13, color:C.muted, lineHeight:1.65 }}>{s.body}</div>
              </div>
              {i<3 && <div className="step-row" style={{ display:"flex", alignItems:"center", padding:"0 4px", color:C.gold, fontSize:20, flexShrink:0 }}>→</div>}
            </div>
          ))}
        </div>
      </div>
      {/* Proof thread */}
      <div className="section-inner" style={{ padding:"0 20px 60px", maxWidth:640, margin:"0 auto" }}>
        <h2 style={{ textAlign:"center", fontSize:"clamp(20px,4vw,30px)", fontWeight:700, color:C.text, marginBottom:8 }}>A real proof thread</h2>
        <div style={{ textAlign:"center", fontSize:15, color:C.muted, marginBottom:28 }}>This is what your evidence looks like inside ProofOS</div>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, overflow:"hidden" }}>
          <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:13, color:C.muted, marginBottom:4 }}>Proof Thread · 9 days</div>
              <div style={{ fontSize:16, fontWeight:700, color:C.text2 }}>I receive €5,000 from an unexpected source</div>
            </div>
            <span style={{ padding:"5px 12px", background:"#0a1a0a", color:C.green, borderRadius:20, fontSize:12, fontWeight:700, flexShrink:0 }}>✓ Manifested</span>
          </div>
          <div style={{ padding:"12px 20px", borderBottom:`1px solid ${C.border2}`, background:"#080600" }}>
            <div style={{ fontSize:12, color:C.muted, marginBottom:4 }}>Linked audio</div>
            <div style={{ fontSize:14, fontWeight:600, color:C.gold }}>🎧 Money finds me first · 528hz · Self hypnosis · 9 sessions</div>
          </div>
          {[
            { day:"Day 1", icon:"🎧", label:"First listen", detail:"Night mode. Set intention before sleeping.", c:C.muted },
            { day:"Day 3", icon:"🎙", label:"Voice note", detail:'"Felt something shift on third listen. Stopped needing it." — 0:47', c:C.text2 },
            { day:"Day 5", icon:"✦", label:"Sign noticed", detail:"Found €20 in a jacket. Third \'coincidence\' this week.", c:C.gold },
            { day:"Day 9", icon:"✓", label:"Manifested — €5,000", detail:"Client I had forgotten. Paid in full.", c:C.green, final:true },
          ].map((e,i) => (
            <div key={i} style={{ display:"flex", gap:14, padding:"12px 20px", borderBottom:i<3?`1px solid ${C.border2}`:"none", background:e.final?"#080f08":"none" }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:e.final?C.green+"22":"#0a0800", border:`1.5px solid ${e.final?C.green:C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>{e.icon}</div>
              <div>
                <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:3 }}>
                  <span style={{ fontSize:11, color:C.dim, fontWeight:600 }}>{e.day}</span>
                  <span style={{ fontSize:14, fontWeight:600, color:e.c }}>{e.label}</span>
                </div>
                <div style={{ fontSize:13, color:C.muted }}>{e.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="section-inner" style={{ padding:"0 20px 80px", textAlign:"center", maxWidth:500, margin:"0 auto" }}>
        <div className="wm" style={{ fontSize:"clamp(22px,4vw,34px)", color:C.text, marginBottom:14 }}>Ready to begin?</div>
        <div style={{ fontSize:15, color:C.muted, marginBottom:28, lineHeight:1.75 }}>ProofOS is included in the Goddess Tier.<br />Start with the audio library now. The tracker unlocks when it launches.</div>
        <Btn full onClick={() => onJoin("goddess")}>Join Goddess Tier — €33/month</Btn>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// ONBOARDING
// ═══════════════════════════════════════════════════════
function Onboard({ tier, onSuccess, onBack }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [billing, setBilling] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const tierName = tier==="goddess"?"Goddess Tier":tier==="founder"?"Founder Lifetime":"Audio Tier";
  const price = tier==="founder"?"€500":tier==="goddess"?(billing==="monthly"?"€33":"€317"):(billing==="monthly"?"€19.99":"€192");
  const next = () => {
    if(step===3){setLoading(true);setTimeout(()=>{setLoading(false);setStep(4);},1400);}
    else if(step===4) onSuccess();
    else setStep(s=>s+1);
  };
  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px 20px", background:C.black }} className="fade">
      {step<4 && <button onClick={onBack} style={{ position:"fixed", top:20, left:20, background:"none", border:"none", color:C.muted, fontSize:15, cursor:"pointer" }}>← Back</button>}
      {step<4 && (
        <div style={{ display:"flex", gap:0, marginBottom:40 }}>
          {[1,2,3].map(n => (
            <div key={n} style={{ display:"flex", alignItems:"center" }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:n<=step?`linear-gradient(135deg,${C.gold},${C.rose})`:C.card, border:`1.5px solid ${n<=step?C.gold:C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:n<=step?"#000":C.muted }}>
                {n<step?"✓":n}
              </div>
              {n<3 && <div style={{ width:48, height:"1px", background:n<step?C.gold:C.border }} />}
            </div>
          ))}
        </div>
      )}
      <div style={{ width:"100%", maxWidth:460 }}>
        {step===1 && (
          <div className="fade">
            <div className="wm" style={{ fontSize:24, display:"block", marginBottom:6, background:`linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Self Hypnosis Goddess</div>
            <div style={{ fontSize:20, fontWeight:700, color:C.text, marginBottom:4 }}>Create your account</div>
            <div style={{ fontSize:15, color:C.muted, marginBottom:28 }}>Joining: {tierName}</div>
            <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:20 }}>
              <input placeholder="Your name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
              <input placeholder="Email address" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
              <input placeholder="Password (min 8 characters)" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
            </div>
            <Btn full onClick={next} disabled={!form.email||form.password.length<8}>Continue →</Btn>
            <div style={{ textAlign:"center", marginTop:14, fontSize:14, color:C.muted }}>Already a member? <span style={{ color:C.gold, cursor:"pointer" }} onClick={onBack}>Sign in</span></div>
          </div>
        )}
        {step===2 && (
          <div className="fade">
            <div style={{ fontSize:20, fontWeight:700, color:C.text, marginBottom:4 }}>Confirm your plan</div>
            <div style={{ fontSize:15, color:C.muted, marginBottom:24 }}>You chose: {tierName}</div>
            {tier!=="founder" && (
              <div style={{ display:"flex", gap:10, marginBottom:16 }}>
                {["monthly","annual"].map(b => (
                  <button key={b} onClick={()=>setBilling(b)} style={{ flex:1, padding:16, background:billing===b?C.card2:C.card, border:`${billing===b?"2px":"1px"} solid ${billing===b?C.gold+"88":C.border}`, borderRadius:12, cursor:"pointer", textAlign:"left" }}>
                    <div style={{ fontSize:14, fontWeight:700, color:billing===b?C.gold:C.text, marginBottom:2 }}>{b==="monthly"?"Monthly":"Annual"}</div>
                    <div style={{ fontSize:22, fontWeight:800, color:billing===b?C.gold:C.text }}>{tier==="goddess"?(b==="monthly"?"€33":"€317"):(b==="monthly"?"€19.99":"€192")}<span style={{ fontSize:12, color:C.muted }}>/{b==="monthly"?"mo":"yr"}</span></div>
                    {b==="annual"&&<div style={{ fontSize:12, color:C.rose, marginTop:4, fontWeight:600 }}>Save 20% · 2 months free</div>}
                  </button>
                ))}
              </div>
            )}
            <div style={{ background:C.card, border:`1px solid ${C.gold}44`, borderRadius:12, padding:16, marginBottom:16 }}>
              {(tier==="goddess"?["Full self hypnosis audio library","4 new tracks every week","ProofOS tracker coming soon","Early access + monthly ritual"]:
                tier==="founder"?["Full vault forever","ProofOS for life","1 GB evidence vault","All future features","Founder's seal ✦"]:
                ["Full self hypnosis audio library","4 new tracks every week","Loop player + sleep timer","No ads. Ever."]).map((f,i) => (
                <div key={i} style={{ fontSize:14, color:C.text2, paddingLeft:14, position:"relative", marginBottom:6 }}>
                  <span style={{ position:"absolute", left:0, color:C.gold, fontWeight:700 }}>·</span>{f}
                </div>
              ))}
            </div>
            <Btn full onClick={next}>Continue to payment →</Btn>
          </div>
        )}
        {step===3 && (
          <div className="fade">
            <div style={{ fontSize:20, fontWeight:700, color:C.text, marginBottom:24 }}>Secure checkout</div>
            <div style={{ background:C.card, border:`1.5px solid ${C.gold}55`, borderRadius:12, padding:18, marginBottom:14, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontSize:15, fontWeight:700, color:C.text }}>{tierName}</div>
                <div style={{ fontSize:13, color:C.muted }}>{tier==="founder"?"One-time payment":`Billed ${billing}`}</div>
              </div>
              <div style={{ fontSize:30, fontWeight:800, color:C.gold }}>{price}</div>
            </div>
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:16, marginBottom:16, fontSize:14, color:"#6a5a3a", lineHeight:1.75 }}>
              <div style={{ fontSize:11, color:C.muted, marginBottom:8, letterSpacing:"0.15em", textTransform:"uppercase", fontWeight:600 }}>Stripe secure checkout</div>
              You'll be redirected to Stripe's secure payment page.<br/>
              No card data stored by us · SSL encrypted<br/>
              No refunds after 14 days from payment date
            </div>
            <Btn full onClick={next} disabled={loading}>{loading?"Processing...":"Pay with Stripe →"}</Btn>
          </div>
        )}
        {step===4 && (
          <div style={{ textAlign:"center" }} className="fade">
            <div style={{ fontSize:60, marginBottom:20 }}>✦</div>
            <div className="wm" style={{ fontSize:40, display:"block", marginBottom:10, background:`linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Welcome.</div>
            <div style={{ fontSize:16, color:C.muted, marginBottom:36, lineHeight:1.75 }}>
              Your portal is ready.<br/>
              {tier==="goddess"&&"ProofOS tracker activates when it launches."}
              {tier==="founder"&&"Your Founder seal is locked in forever."}
            </div>
            <Btn full onClick={next}>Enter the portal →</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// PORTAL
// ═══════════════════════════════════════════════════════
function Portal({ userTier, onSignOut, onUpgrade }) {
  const [tab, setTab] = useState("audios");
  const [playing, setPlaying] = useState(null);
  const [activeCat, setActiveCat] = useState("all");
  const [loop, setLoop] = useState(true);
  const [sleep, setSleep] = useState(60);
  const [progress, setProgress] = useState(38);
  const [search, setSearch] = useState("");
  const [desires, setDesires] = useState([
    { id:1, desire:"He texts me first", status:"manifested", track:"He's already on his way back", trackCat:"sp", days:14, signs:["Got a like on Instagram","Mutual friend mentioned me"] },
    { id:2, desire:"€5,000 arrives unexpectedly", status:"in_progress", track:"Money finds me first", trackCat:"money", days:6, signs:["Found €20 in old jacket"] },
    { id:3, desire:"Glowing skin visible to others", status:"in_progress", track:"Gorgeous is my default setting", trackCat:"beauty", days:3, signs:[] },
  ]);
  const [newDesire, setNewDesire] = useState("");
  const [newSign, setNewSign] = useState({});
  const [expanded, setExpanded] = useState(null);

  const catColors = { sp:"#c4365a", money:"#6ab05a", beauty:"#c8892a", sleep:"#6a8ad0", dna:"#9a7ad0", identity:"#c07070", all:C.gold };

  const tracks = [
    { id:1, title:"He's already on his way back", cat:"sp", tag:"SP & Love", freq:"432hz", type:"Self hypnosis", dur:"30:00", tier:"audio", isNew:true },
    { id:2, title:"Money finds me first", cat:"money", tag:"Money", freq:"528hz", type:"Subliminal", dur:"25:00", tier:"audio", isNew:true },
    { id:3, title:"Gorgeous is my default setting", cat:"beauty", tag:"Beauty", freq:"432hz", type:"Self hypnosis", dur:"35:00", tier:"audio" },
    { id:4, title:"I've always been the prize", cat:"identity", tag:"Identity", freq:"LOA", type:"Subliminal", dur:"30:00", tier:"audio" },
    { id:5, title:"DNA activation ceremony", cat:"dna", tag:"DNA", freq:"963hz", type:"Frequency", dur:"45:00", tier:"goddess" },
    { id:6, title:"I manifest while I sleep", cat:"sleep", tag:"Sleep", freq:"Delta", type:"Sleep subliminal", dur:"60:00", tier:"audio" },
    { id:7, title:"He's obsessed and he knows it", cat:"sp", tag:"SP & Love", freq:"432hz", type:"Subliminal", dur:"28:00", tier:"audio" },
    { id:8, title:"Reality rearranges for me", cat:"identity", tag:"Identity", freq:"963hz", type:"Frequency", dur:"33:00", tier:"goddess" },
    { id:9, title:"I get prettier every single day", cat:"beauty", tag:"Beauty", freq:"432hz", type:"Self hypnosis", dur:"25:00", tier:"audio", isNew:true },
    { id:10, title:"Unexpected money · always", cat:"money", tag:"Money", freq:"528hz", type:"Subliminal", dur:"22:00", tier:"audio", isNew:true },
  ];

  const cats = [{id:"all",label:"All tracks"},{id:"sp",label:"SP & Love"},{id:"money",label:"Money"},{id:"beauty",label:"Beauty"},{id:"sleep",label:"Sleep"},{id:"dna",label:"DNA"},{id:"identity",label:"Identity"}];
  const canPlay = t => t.tier==="audio"||userTier==="goddess";
  const ct = tracks.find(t=>t.id===playing);
  const filtered = tracks.filter(t=>(activeCat==="all"||t.cat===activeCat)&&(!search||t.title.toLowerCase().includes(search.toLowerCase())));
  const manifested = desires.filter(d=>d.status==="manifested").length;

  const addDesire = () => { if(!newDesire.trim())return; setDesires([{id:Date.now(),desire:newDesire,status:"in_progress",track:ct?.title||null,trackCat:ct?.cat||null,days:0,signs:[]},...desires]); setNewDesire(""); };
  const addSign = (id,sign) => { if(!sign.trim())return; setDesires(desires.map(d=>d.id===id?{...d,signs:[...d.signs,sign]}:d)); setNewSign(p=>({...p,[id]:""})); };
  const markManifested = id => setDesires(desires.map(d=>d.id===id?{...d,status:"manifested"}:d));
  const undoManifested = id => setDesires(desires.map(d=>d.id===id?{...d,status:"in_progress"}:d));

  const signSuggestions = ["Saw a number sequence","Dreamed about it","Someone mentioned it","Found money unexpectedly","Received a surprise message","Felt calm certainty","Overheard a conversation about it","Something shifted in my body"];

  const tabs = [{id:"audios",icon:"▶",label:"Audios"},{id:"tracker",icon:"✦",label:"Tracker"},{id:"account",icon:"◎",label:"Account"}];

  return (
    <div style={{ minHeight:"100vh", background:C.black }} className="fade">
      {/* Header */}
      <div style={{ borderBottom:`1px solid ${C.border}`, padding:"0 16px", height:56, display:"flex", alignItems:"center", justifyContent:"space-between", background:"#030200", position:"sticky", top:0, zIndex:50 }}>
        <button onClick={onSignOut} style={{ background:"none", border:"none", cursor:"pointer" }}>
          <span className="wm" style={{ fontSize:17, background:`linear-gradient(90deg,${C.gold},${C.rose})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Self Hypnosis Goddess</span>
        </button>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {userTier==="goddess"
            ?<div style={{ padding:"4px 12px", background:"#1a0a04", border:`1px solid ${C.gold}44`, borderRadius:20, fontSize:12, color:C.gold, fontWeight:700 }}>Goddess ✦</div>
            :<button onClick={onUpgrade} style={{ padding:"4px 12px", background:"none", border:`1px solid ${C.rose}44`, borderRadius:20, fontSize:12, color:C.rose, fontWeight:700, cursor:"pointer" }}>Upgrade ↑</button>
          }
        </div>
      </div>
      {/* Desktop tabs */}
      <div className="desktop-tabs" style={{ display:"flex", borderBottom:`1px solid ${C.border}`, background:"#050300", position:"sticky", top:56, zIndex:49 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1, padding:"13px 8px", background:"none", border:"none", borderBottom:`2px solid ${tab===t.id?C.gold:"transparent"}`, color:tab===t.id?C.gold:C.muted, fontSize:13, fontWeight:600, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer" }}>{t.label}</button>
        ))}
      </div>
      {/* Stats */}
      <div style={{ display:"flex", borderBottom:`1px solid ${C.border}`, background:"#080500" }}>
        {[{v:tracks.filter(t=>canPlay(t)).length,l:"Tracks",c:C.text},{v:desires.length,l:"Intentions",c:C.gold},{v:manifested,l:"Manifested",c:C.rose},{v:"14d",l:"Streak",c:C.green}].map((s,i) => (
          <div key={i} style={{ flex:1, padding:"10px 8px", textAlign:"center", borderRight:i<3?`1px solid ${C.border}`:"none" }}>
            <div style={{ fontSize:18, fontWeight:800, color:s.c, lineHeight:1 }}>{s.v}</div>
            <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", minHeight:"calc(100vh - 140px)" }}>
        {/* Sidebar */}
        <div className="sidebar" style={{ width:200, borderRight:`1px solid ${C.border}`, background:"#040200", flexShrink:0, position:"sticky", top:112, height:"calc(100vh - 112px)", overflowY:"auto", padding:"12px 8px" }}>
          {cats.map(c => (
            <button key={c.id} onClick={()=>{setActiveCat(c.id);setTab("audios");}} style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:10, border:"none", background:activeCat===c.id&&tab==="audios"?(catColors[c.id]||C.gold)+"18":"none", cursor:"pointer", marginBottom:4, textAlign:"left" }}>
              <div style={{ width:10, height:10, borderRadius:"50%", background:catColors[c.id]||C.gold, flexShrink:0, opacity:activeCat===c.id&&tab==="audios"?1:0.3 }} />
              <span style={{ fontSize:13, fontWeight:600, color:activeCat===c.id&&tab==="audios"?catColors[c.id]||C.gold:C.muted }}>{c.label}</span>
            </button>
          ))}
          <div style={{ height:1, background:C.border, margin:"10px 0" }} />
          {tabs.filter(t=>t.id!=="audios").map(t => (
            <button key={t.id} onClick={()=>setTab(t.id)} style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"9px 12px", borderRadius:10, border:"none", background:tab===t.id&&activeCat!=="all"?C.gold+"18":"none", cursor:"pointer", marginBottom:4 }}>
              <span style={{ fontSize:16 }}>{t.icon}</span>
              <span style={{ fontSize:13, fontWeight:600, color:tab===t.id?C.gold:C.muted }}>{t.label}</span>
            </button>
          ))}
        </div>
        {/* Main */}
        <div className="portal-pad" style={{ flex:1, padding:"18px 16px 32px", maxWidth:700, overflowX:"hidden" }}>
          {/* AUDIOS */}
          {tab==="audios" && (
            <div className="fade">
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tracks..." style={{ marginBottom:14 }} />
              <div style={{ display:"flex", gap:6, flexWrap:"nowrap", overflowX:"auto", marginBottom:16, paddingBottom:4 }}>
                {cats.map(c => (
                  <button key={c.id} onClick={()=>setActiveCat(c.id)} style={{ padding:"6px 14px", borderRadius:20, border:`1.5px solid ${activeCat===c.id?catColors[c.id]||C.gold:C.border}`, background:activeCat===c.id?(catColors[c.id]||C.gold)+"18":"none", color:activeCat===c.id?catColors[c.id]||C.gold:C.muted, fontSize:13, cursor:"pointer", whiteSpace:"nowrap", minHeight:36, fontWeight:600 }}>{c.label}</button>
                ))}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {filtered.map(t => {
                  const isP=playing===t.id;
                  const can=canPlay(t);
                  const color=catColors[t.cat]||C.gold;
                  return (
                    <div key={t.id} onClick={()=>can&&setPlaying(isP?null:t.id)}
                      style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 14px", background:isP?C.card2:C.card, border:`1px solid ${isP?color+"66":C.border}`, borderRadius:12, cursor:can?"pointer":"default", opacity:can?1:0.4, transition:"all 0.2s" }}
                      onMouseEnter={e=>can&&!isP&&(e.currentTarget.style.borderColor=color+"44")}
                      onMouseLeave={e=>can&&!isP&&(e.currentTarget.style.borderColor=C.border)}>
                      <div style={{ width:10, height:10, borderRadius:"50%", background:color, flexShrink:0, opacity:0.7 }} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                          <span style={{ fontSize:14, fontWeight:600, color:isP?color:C.text2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.title}</span>
                          {t.isNew&&<span style={{ fontSize:10, padding:"1px 7px", background:C.rose+"22", color:C.rose, borderRadius:10, fontWeight:700, flexShrink:0 }}>NEW</span>}
                        </div>
                        <div style={{ fontSize:12, color:C.dim }}>{t.freq} · {t.type}{!can?" · Goddess only":""} · {t.dur}</div>
                      </div>
                      <div style={{ width:36, height:36, borderRadius:"50%", background:isP?color+"22":"#080600", border:`1.5px solid ${isP?color:C.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        {!can?<span>🔒</span>:isP?<div className="wave"><span/><span/><span/><span/><span/></div>:<span style={{ fontSize:13, color:C.muted }}>▶</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {/* TRACKER */}
          {tab==="tracker" && (
            <div className="fade">
              {userTier!=="goddess"?(
                <div style={{ textAlign:"center", padding:"60px 20px" }}>
                  <div style={{ fontSize:48, marginBottom:16 }}>✦</div>
                  <div className="wm" style={{ fontSize:28, color:C.text, marginBottom:10 }}>ProofOS</div>
                  <div style={{ fontSize:16, color:C.muted, marginBottom:24, lineHeight:1.7 }}>Log your desires. Link them to your listening.<br/>Watch the proof accumulate.</div>
                  <Btn onClick={onUpgrade}>Upgrade to Goddess — €33/month</Btn>
                </div>
              ):(
                <div>
                  <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:16, marginBottom:14 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                      <span style={{ fontSize:14, fontWeight:600, color:C.text }}>Manifestation rate</span>
                      <span style={{ fontSize:14, color:C.gold, fontWeight:700 }}>{manifested}/{desires.length}</span>
                    </div>
                    <div style={{ height:6, background:C.border, borderRadius:3 }}>
                      <div style={{ width:`${(manifested/desires.length)*100}%`, height:"100%", background:`linear-gradient(90deg,${C.gold},${C.rose})`, borderRadius:3, transition:"width 0.5s" }} />
                    </div>
                  </div>
                  <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:16, marginBottom:14 }}>
                    <div style={{ fontSize:12, color:C.muted, letterSpacing:"0.15em", textTransform:"uppercase", fontWeight:600, marginBottom:10 }}>Log a new intention</div>
                    <input value={newDesire} onChange={e=>setNewDesire(e.target.value)} placeholder="State it in present tense — I am, I have, I receive..." style={{ marginBottom:10 }} onKeyDown={e=>e.key==="Enter"&&addDesire()} />
                    {ct&&<div style={{ fontSize:13, color:C.muted, marginBottom:10 }}>Will link to: <span style={{ color:C.gold, fontWeight:600 }}>{ct.title}</span></div>}
                    <Btn full small onClick={addDesire} disabled={!newDesire.trim()}>Add intention +</Btn>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {desires.map(d => {
                      const color=catColors[d.trackCat]||C.gold;
                      return (
                        <div key={d.id} style={{ background:C.card, border:`1px solid ${d.status==="manifested"?"#2a4a2a88":C.border}`, borderRadius:12, overflow:"hidden" }}>
                          <div style={{ padding:"14px 16px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10 }} onClick={()=>setExpanded(expanded===d.id?null:d.id)}>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ fontSize:15, fontWeight:600, color:C.text2, marginBottom:4 }}>{d.desire}</div>
                              {d.track&&<div style={{ display:"flex", alignItems:"center", gap:6 }}><span style={{ fontSize:12 }}>🎧</span><span style={{ fontSize:12, color:color, fontWeight:500 }}>{d.track}</span>{d.days>0&&<span style={{ fontSize:12, color:C.dim }}>· {d.days} days</span>}</div>}
                              {d.signs.length>0&&<div style={{ fontSize:12, color:C.muted, marginTop:4 }}>✦ {d.signs.length} sign{d.signs.length!==1?"s":""} logged</div>}
                            </div>
                            <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8, flexShrink:0 }}>
                              {d.status==="manifested"?(
                                <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                                  <span style={{ padding:"4px 10px", background:"#1a3a1a", color:C.green, borderRadius:20, fontSize:12, fontWeight:700 }}>✓ manifested</span>
                                  <button onClick={e=>{e.stopPropagation();undoManifested(d.id);}} style={{ padding:"4px 8px", background:"none", border:`1px solid ${C.border}`, borderRadius:8, color:C.dim, fontSize:11, cursor:"pointer" }}>undo</button>
                                </div>
                              ):(
                                <button onClick={e=>{e.stopPropagation();markManifested(d.id);}} style={{ padding:"4px 12px", background:"none", border:`1px solid ${C.gold}55`, borderRadius:20, color:C.gold, fontSize:12, fontWeight:700, cursor:"pointer" }}>mark done ✓</button>
                              )}
                              <span style={{ fontSize:12, color:C.dim }}>{expanded===d.id?"▲":"▼ signs"}</span>
                            </div>
                          </div>
                          {expanded===d.id&&(
                            <div style={{ borderTop:`1px solid ${C.border2}`, padding:"14px 16px", background:"#060400" }}>
                              <div style={{ fontSize:12, color:C.muted, letterSpacing:"0.15em", textTransform:"uppercase", fontWeight:600, marginBottom:10 }}>Signs & synchronicities</div>
                              {d.signs.length===0&&<div style={{ fontSize:14, color:C.dim, marginBottom:12 }}>No signs logged yet.</div>}
                              {d.signs.map((s,i)=>(
                                <div key={i} style={{ fontSize:14, color:C.muted, paddingLeft:14, position:"relative", marginBottom:6 }}>
                                  <span style={{ position:"absolute", left:0, color:C.gold }}>·</span>{s}
                                </div>
                              ))}
                              {d.status!=="manifested"&&(
                                <div style={{ marginTop:12 }}>
                                  <div style={{ fontSize:12, color:C.muted, marginBottom:8 }}>Quick add:</div>
                                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:10 }}>
                                    {signSuggestions.slice(0,4).map((s,i)=>(
                                      <button key={i} onClick={()=>addSign(d.id,s)} style={{ padding:"4px 10px", background:"none", border:`1px solid ${C.border}`, borderRadius:20, color:C.muted, fontSize:11, cursor:"pointer" }}>{s}</button>
                                    ))}
                                  </div>
                                  <div style={{ display:"flex", gap:8 }}>
                                    <input value={newSign[d.id]||""} onChange={e=>setNewSign(p=>({...p,[d.id]:e.target.value}))} placeholder="Or write your own sign..." style={{ flex:1 }} onKeyDown={e=>e.key==="Enter"&&addSign(d.id,newSign[d.id]||"")} />
                                    <Btn small onClick={()=>addSign(d.id,newSign[d.id]||"")} disabled={!newSign[d.id]?.trim()}>Add</Btn>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
          {/* ACCOUNT */}
          {tab==="account" && (
            <div className="fade" style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:18 }}>
                <div style={{ fontSize:12, color:C.muted, letterSpacing:"0.15em", textTransform:"uppercase", fontWeight:600, marginBottom:14 }}>Your account</div>
                <div style={{ fontSize:13, color:C.muted, marginBottom:3 }}>Signed in as</div>
                <div style={{ fontSize:15, fontWeight:600, color:C.text, marginBottom:14 }}>member@reshmaoracle.com</div>
                <div style={{ fontSize:13, color:C.muted, marginBottom:3 }}>Current plan</div>
                <div style={{ fontSize:15, fontWeight:700, color:userTier==="goddess"?C.gold:C.text2 }}>{userTier==="goddess"?"Goddess Tier · €33/month":"Audio Tier · €19.99/month"}</div>
              </div>
              {userTier==="audio"&&(
                <div onClick={onUpgrade} style={{ background:"#0a0500", border:`1.5px solid ${C.gold}44`, borderRadius:12, padding:18, cursor:"pointer" }}>
                  <div style={{ fontSize:11, color:C.rose, letterSpacing:"0.15em", textTransform:"uppercase", fontWeight:700, marginBottom:6 }}>Upgrade available</div>
                  <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:4 }}>Goddess Tier — €33/month</div>
                  <div style={{ fontSize:13, color:C.muted }}>Unlock ProofOS tracker + early access →</div>
                </div>
              )}
              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:18 }}>
                <div style={{ fontSize:12, color:C.muted, letterSpacing:"0.15em", textTransform:"uppercase", fontWeight:600, marginBottom:14 }}>Subscription</div>
                <div style={{ fontSize:14, color:"#7a6a4a", lineHeight:1.85, marginBottom:14 }}>Next billing: 29 July 2026<br/>No refunds after 14 days<br/>Cancel before renewal to avoid next charge</div>
                <Btn small outline onClick={()=>{}}>Manage billing ↗</Btn>
              </div>
              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:18 }}>
                <div style={{ fontSize:12, color:C.muted, letterSpacing:"0.15em", textTransform:"uppercase", fontWeight:600, marginBottom:14 }}>Access</div>
                <div style={{ fontSize:14, color:"#7a6a4a", lineHeight:1.85 }}>Any browser · iPhone: tap Share → "Add to Home Screen"<br/>Android: tap menu → "Add to Home Screen"<br/>No App Store download needed</div>
              </div>
              <div style={{ display:"flex", gap:12 }}>
                <a href="https://www.youtube.com/@Reshma.Oracle" target="_blank" rel="noopener noreferrer" style={{ flex:1, padding:14, background:C.card, border:`1px solid ${C.border}`, borderRadius:10, color:C.muted, fontSize:13, cursor:"pointer", textAlign:"center", textDecoration:"none" }}>YouTube →</a>
                <a href="https://www.instagram.com/reshma.oracle/" target="_blank" rel="noopener noreferrer" style={{ flex:1, padding:14, background:C.card, border:`1px solid ${C.border}`, borderRadius:10, color:C.muted, fontSize:13, cursor:"pointer", textAlign:"center", textDecoration:"none" }}>Instagram →</a>
              </div>
              <button onClick={onSignOut} style={{ padding:14, background:"none", border:`1px solid ${C.border}`, borderRadius:10, color:C.muted, fontSize:15, cursor:"pointer", minHeight:48 }}>Sign out</button>
            </div>
          )}
        </div>
      </div>
      {/* Mobile bottom nav */}
      <div className="mobile-nav" style={{ position:"fixed", bottom:0, left:0, right:0, background:"#050300", borderTop:`1px solid ${C.border}`, zIndex:200, paddingBottom:"env(safe-area-inset-bottom,8px)" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1, padding:"10px 8px", background:"none", border:"none", color:tab===t.id?C.gold:C.muted, fontSize:10, fontWeight:600, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4, minHeight:56, letterSpacing:"0.08em", textTransform:"uppercase" }}>
            <span style={{ fontSize:18 }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>
      {/* Player */}
      {playing&&ct&&(
        <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"#060400", borderTop:`1px solid ${C.gold}44`, padding:"10px 16px", zIndex:100 }}>
          <div style={{ maxWidth:900, margin:"0 auto" }}>
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:8 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:catColors[ct.cat]||C.gold, flexShrink:0 }} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:600, color:C.gold, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{ct.title}</div>
                <div style={{ fontSize:11, color:C.dim }}>{ct.freq} · {ct.type} · {loop?"Loop on":"Loop off"} · Sleep: {sleep?`${sleep}m`:"off"}</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
                <button onClick={()=>setLoop(!loop)} style={{ background:"none", border:"none", fontSize:18, color:loop?C.gold:C.dim, cursor:"pointer", minWidth:32, minHeight:32 }}>↻</button>
                <button onClick={()=>setPlaying(null)} style={{ width:40, height:40, borderRadius:"50%", background:`linear-gradient(135deg,${C.gold},${C.rose})`, border:"none", color:"#000", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>⏸</button>
                <button onClick={()=>setSleep(s=>s===60?30:s===30?0:60)} style={{ background:"none", border:`1px solid ${C.border}`, borderRadius:8, padding:"5px 10px", color:sleep?C.gold:C.dim, fontSize:12, cursor:"pointer" }}>{sleep?`${sleep}m`:"∞"}</button>
              </div>
            </div>
            <div style={{ height:3, background:C.border, borderRadius:2, cursor:"pointer" }} onClick={e=>{const r=e.target.getBoundingClientRect();setProgress(Math.round(((e.clientX-r.left)/r.width)*100));}}>
              <div style={{ width:`${progress}%`, height:"100%", background:`linear-gradient(90deg,${C.gold},${C.rose})`, borderRadius:2 }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
