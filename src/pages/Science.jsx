/* Science — Why this works, how it works, how I built it */
import { useState, useEffect, useRef } from "react";

const LG  = "linear-gradient(135deg,#F5E0A0 0%,#E8B870 20%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";
const LG2 = "linear-gradient(110deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";
const TEAL  = "#2CB7A7";
const LAV   = "#BFA5D8";
const GOLD  = "#E8B870";
const CHAMP = "#F5E0A0";
const DTEAL = "#167A6B";
const CR    = "#f2ece4";
const MU    = "#c8bfb8";
const DIM   = "#666666";

// Reusable components
const Lbl = ({c,children})=><div style={{fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",color:c||TEAL,marginBottom:14,fontFamily:"'Jost',sans-serif",fontWeight:500,textAlign:"center"}}>{children}</div>;
const H2  = ({children})=><h2 style={{fontFamily:"'Jost',sans-serif",fontStyle:"normal",fontSize:"clamp(28px,4.5vw,48px)",color:CR,fontWeight:400,marginBottom:18,lineHeight:1.15,textAlign:"center"}}>{children}</h2>;
const H3  = ({c,children})=><h3 style={{fontFamily:"'Jost',sans-serif",fontSize:"clamp(17px,2vw,22px)",color:c||CR,fontWeight:500,marginBottom:12,lineHeight:1.3,textAlign:"center"}}>{children}</h3>;
const P   = ({c,children})=><p style={{fontSize:18,color:c||MU,lineHeight:1.9,marginBottom:20,fontFamily:"'Jost',sans-serif",textAlign:"left"}}>{children}</p>;
const Div = ()=><div style={{height:1,background:"linear-gradient(90deg,transparent,rgba(44,183,167,0.25),transparent)",margin:"56px 0"}}/>;
const Box = ({children,c,glow})=>(
  <div style={{padding:"22px 20px",background:glow?`${c||TEAL}08`:"rgba(255,255,255,0.03)",border:`1px solid ${c||TEAL}22`,borderRadius:14,marginBottom:0,boxShadow:glow?`0 0 30px ${c||TEAL}18`:"none"}}>
    {children}
  </div>
);
const GradText = ({size,children,weight})=>(
  <span style={{color:CR,fontSize:size||16,fontWeight:weight||400,fontFamily:"'Jost',sans-serif"}}>{children}</span>
);

const WAVES = [
  {s:"Delta",hz:"0.5–4 Hz",c:DTEAL,h:28,desc:"Deep sleep. Cellular repair. Consciousness offline. Subliminals continue working here."},
  {s:"Theta",hz:"4–8 Hz", c:TEAL, h:70,desc:"The installation window. Critical resistance drops. New identity goes in. SHG targets this state in every track.",active:true},
  {s:"Alpha",hz:"8–14 Hz",c:LAV,  h:50,desc:"Relaxed awareness. The bridge. Receptive but not fully open. Good daytime listening state."},
  {s:"Beta", hz:"14–40 Hz",c:"#666",h:38,desc:"Your current waking state. Alert, analytical, sceptical. The critical mind is fully active here — which is exactly why affirmations bounce off. You can't argue your way past a belief from the same level it was installed."},
  {s:"Gamma",hz:"40+ Hz", c:DIM,  h:20,desc:"Peak coherence. Observed in advanced meditators. Emerges naturally from deep theta practice."},
];

const FORMULA_PARTS = [
  {term:"Hypnosis",color:CHAMP,   note:"Spoken guidance that takes you into theta and delivers the new identity directly to the subconscious — with the critical mind fully bypassed."},
  {term:"+",color:"rgba(255,255,255,0.3)",note:null},
  {term:"Subliminals",color:GOLD, note:"Affirmations embedded below the threshold of conscious awareness. The filter never engages. The belief lands without resistance."},
  {term:"+",color:"rgba(255,255,255,0.3)",note:null},
  {term:"Melodic House",color:LAV,note:"The music that elevates your emotional state before the installation begins. Heart coherence rises. The brain opens."},
  {term:"+",color:TEAL,           note:null},
  {term:"EMDR",color:TEAL,        note:"Left-right bilateral audio synchronises both hemispheres. Resistance drops at a neurological level. Processing deepens."},
  {term:"+",color:"rgba(255,255,255,0.3)",note:null},
  {term:"Binaural Beats",color:DTEAL,note:"Two tones, one per ear. The brain generates the difference — and entrains to theta within minutes. No willpower required."},
  {term:"=",color:"rgba(255,255,255,0.3)",note:null},
  {term:"Theta on demand.",color:"#fff",note:"The only state where the subconscious opens. The only state where new beliefs install without the conscious mind arguing back. On demand.",result:true},
];

export default function Science({ onBack }) {
  const [isMobile, setIsMobile] = useState(typeof window!=="undefined"&&window.innerWidth<=768);
  const topRef = useRef(null);
  useEffect(()=>{
    if(topRef.current) topRef.current.scrollIntoView({behavior:"instant"});
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({top:0,left:0,behavior:"instant"});
    const h=()=>setIsMobile(window.innerWidth<=768);
    window.addEventListener("resize",h);
    return ()=>window.removeEventListener("resize",h);
  },[]);

  return (
    <div ref={topRef} style={{minHeight:"100vh",background:"#000",color:CR,fontFamily:"'Jost',sans-serif"}}>

      {/* NAV */}
      <div style={{position:"sticky",top:0,background:"rgba(0,0,0,0.97)",borderBottom:"1px solid rgba(44,183,167,0.12)",padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",zIndex:100}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:TEAL,cursor:"pointer",fontSize:14,fontFamily:"'Jost',sans-serif",padding:0}}>← Back</button>
        <div style={{fontSize:12,color:MU,letterSpacing:"0.1em"}}>The Science · reshmaoracle.com</div>
        <div style={{width:60}}/>
      </div>

      <div style={{maxWidth:840,margin:"0 auto",padding:isMobile?"0 18px 80px":"0 24px 100px"}}>

        {/* ═══ HERO ═══ */}
        {/* Full-bleed LG gradient hero banner */}
        <div style={{width:"100vw",position:"relative",left:"50%",transform:"translateX(-50%)",background:LG,padding:isMobile?"48px 20px 52px":"72px 24px 80px",textAlign:"center",marginBottom:64}}>

          {/* Logo mark — large, black stroke on gradient bg */}
          <div style={{display:"flex",justifyContent:"center",marginBottom:20}}>
            <svg viewBox="0 0 100 102" width={isMobile?72:96} height={isMobile?72:96} fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="35" cy="35" r="18" fill="none" stroke="#000" strokeWidth="4"/>
              <circle cx="65" cy="35" r="18" fill="none" stroke="#000" strokeWidth="4"/>
              <circle cx="35" cy="65" r="18" fill="none" stroke="#000" strokeWidth="4"/>
              <circle cx="65" cy="65" r="18" fill="none" stroke="#000" strokeWidth="4"/>
              <line x1="50" y1="80" x2="50" y2="96" stroke="#000" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Wordmark */}
          <div style={{fontFamily:"'Jost',sans-serif",fontWeight:400,fontSize:isMobile?"clamp(14px,4vw,18px)":"clamp(16px,1.6vw,20px)",color:"#000",letterSpacing:"0.16em",marginBottom:24,opacity:0.75}}>Self Hypnosis Goddess</div>

          {/* Big headline — black on gradient */}
          <h1 style={{fontFamily:"'Jost',sans-serif",fontStyle:"normal",fontSize:isMobile?"clamp(32px,8vw,52px)":"clamp(44px,5vw,68px)",fontWeight:400,lineHeight:1.1,marginBottom:16,color:"#000"}}>
            The science behind the shift.
          </h1>
          <div style={{fontSize:isMobile?16:20,color:"rgba(0,0,0,0.6)",fontFamily:"'Jost',sans-serif",fontWeight:300}}>Why this works when nothing else has.</div>
        </div>

        {/* Three concept cards — sit below the gradient hero */}
        <div style={{marginBottom:64}}>
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr 1fr",gap:16}}>

  
            {[
              {
                icon:(
                  <svg viewBox="0 0 60 60" width={44} height={44} fill="none">
                    <defs><linearGradient id="c1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#F5E0A0"/><stop offset="100%" stopColor="#E8B870"/></linearGradient></defs>
                    {/* Brain wave */}
                    <path d="M4,30 C12,14 20,46 28,30 C36,14 44,46 52,30 C54,26 56,28 58,30" fill="none" stroke="url(#c1)" strokeWidth="2.5" strokeLinecap="round"/>
                    <circle cx="30" cy="30" r="22" fill="none" stroke="#E8B870" strokeWidth="1" opacity="0.2"/>
                  </svg>
                ),
                title:"Theta State",
                body:"The only brainwave state where new beliefs install without resistance. SHG gets you there on demand."
              },
              {
                icon:(
                  <svg viewBox="0 0 60 60" width={44} height={44} fill="none">
                    <defs><linearGradient id="c2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#E8B870"/><stop offset="100%" stopColor="#BFA5D8"/></linearGradient></defs>
                    {/* Heart */}
                    <path d="M30,48 C10,34 6,20 10,12 C14,4 22,4 26,10 C28,14 30,16 30,16 C30,16 32,14 34,10 C38,4 46,4 50,12 C54,20 50,34 30,48 Z" fill="none" stroke="url(#c2)" strokeWidth="2.5" strokeLinejoin="round"/>
                    {/* pulse */}
                    <path d="M16,28 C20,28 22,20 26,36 C28,24 30,30 32,26 C34,22 36,32 40,28" fill="none" stroke="#BFA5D8" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
                  </svg>
                ),
                title:"Heart Coherence",
                body:"The heart has its own brain — 40,000 neurons. When it's coherent, the cranial brain opens. The installation goes deeper."
              },
              {
                icon:(
                  <svg viewBox="0 0 60 60" width={44} height={44} fill="none">
                    <defs><linearGradient id="c3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#BFA5D8"/><stop offset="100%" stopColor="#2CB7A7"/></linearGradient></defs>
                    {/* L/R arrows for EMDR */}
                    <circle cx="18" cy="30" r="12" fill="none" stroke="url(#c3)" strokeWidth="2"/>
                    <circle cx="42" cy="30" r="12" fill="none" stroke="url(#c3)" strokeWidth="2"/>
                    <path d="M30,22 L38,30 L30,38" fill="none" stroke="#2CB7A7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M30,22 L22,30 L30,38" fill="none" stroke="#BFA5D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                title:"Bilateral Sync",
                body:"EMDR audio synchronises both brain hemispheres. Defences drop. Both sides process together. The new identity lands."
              },
            ].map((card,i)=>(
              <div key={i} style={{
                padding:isMobile?"24px 20px":"32px 24px",
                background:"rgba(255,255,255,0.03)",
                border:"1px solid rgba(232,184,112,0.18)",
                borderRadius:18,
                textAlign:"center",
                display:"flex",
                flexDirection:"column",
                alignItems:"center",
                gap:14,
              }}>
                {card.icon}
                <div style={{fontSize:isMobile?17:20,fontWeight:500,color:CR,fontFamily:"'Jost',sans-serif"}}>{card.title}</div>
                <div style={{fontSize:16,color:MU,lineHeight:1.7,fontFamily:"'Jost',sans-serif"}}>{card.body}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ ORIGIN — WHY I BUILT THIS ═══ */}
        <section style={{marginBottom:64,textAlign:"center"}}>
          <Lbl c={LAV}>The origin</Lbl>
          <H2>Why I built this</H2>
          <P>I spent years doing everything right on the surface. Reading the books. Going to therapy. Journalling. Meditating. Saying affirmations in the mirror that I didn't believe and could feel myself not believing as I said them.</P>
          <P>None of it touched the thing underneath. The belief that ran the program — about what I deserved in love, about my relationship with money, about what my body could be — stayed exactly where it was. Because I was trying to change it from the wrong level.</P>
          <P>The beliefs that run your life don't live in your conscious thoughts. They were installed before you were 7 years old, in a brainwave state where there was no critical mind to filter them. They live in the subconscious. And the subconscious only opens in one state.</P>
          <div style={{padding:isMobile?"24px 20px":"32px 40px",background:"rgba(44,183,167,0.06)",border:"1px solid rgba(44,183,167,0.2)",borderRadius:16,margin:"28px 0",textAlign:"center"}}>
            <div style={{fontFamily:"'Jost',sans-serif",fontStyle:"normal",fontSize:isMobile?"clamp(20px,5vw,26px)":"clamp(22px,2.8vw,30px)",color:CR,lineHeight:1.5,marginBottom:12}}>
              "I didn't find a system that worked the way I knew it needed to work. So I built one."
            </div>
            <div style={{fontSize:13,color:TEAL,letterSpacing:"0.1em"}}>— Reshma Oracle</div>
          </div>
          <P>Self Hypnosis Goddess is the result of combining everything I learned about the subconscious, brainwave states, heart coherence, EMDR, and sound frequencies — into one audio system that anyone can press play on. No training. No meditation background. No belief required. Just headphones and the decision to stop trying to change from the wrong level.</P>
        </section>

        <Div/>

        {/* ═══ THE FORMULA — annotated ═══ */}
        <section style={{marginBottom:64,textAlign:"center"}}>
          <Lbl>The formula</Lbl>
          <H2>Every track is built from this.</H2>
          <P>This is not a playlist. Every SHG track layers five elements simultaneously. Each one targets a different layer of the mechanism. Together they create a condition that no single approach can produce alone.</P>

          {/* Formula box */}
          <div style={{padding:isMobile?"28px 20px":"40px 48px",border:`1px solid rgba(232,184,112,0.3)`,borderRadius:20,background:"rgba(0,0,0,0.6)",margin:"32px 0"}}>
            <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:isMobile?"6px 4px":"8px 0",justifyContent:"center"}}>
              {FORMULA_PARTS.map((p,i)=>(
                <span key={i} style={{
                  fontSize:isMobile?"clamp(18px,5vw,24px)":"clamp(22px,2.4vw,34px)",
                  fontWeight:400,
                  fontFamily:"'Jost',sans-serif",
                  color:p.result?"#fff":p.color,
                  background:p.result?LG:undefined,
                  WebkitBackgroundClip:p.result?"text":undefined,
                  WebkitTextFillColor:p.result?"transparent":undefined,
                  backgroundClip:p.result?"text":undefined,
                }}>{p.term}</span>
              ))}
            </div>
          </div>

          {/* Annotated breakdown with connecting lines */}
          <div style={{position:"relative",margin:"48px 0 16px"}}>
            <div style={{fontSize:12,color:DIM,fontFamily:"'Jost',sans-serif",letterSpacing:"0.1em",marginBottom:20,textAlign:"center"}}>WHAT EACH ELEMENT DOES</div>
            <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:12}}>
              {FORMULA_PARTS.filter(p=>p.note&&p.term!=="=").map((p,i)=>(
                <div key={i} style={{
                  display:"flex",gap:14,padding:"18px 16px",
                  background:`${p.color}08`,
                  border:`1px solid ${p.color}25`,
                  borderRadius:12,
                  alignItems:"flex-start"
                }}>
                  {/* Colour tag */}
                  <div style={{width:4,minHeight:48,borderRadius:2,background:p.result?LG:p.color,flexShrink:0,marginTop:2}}/>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:p.result?"#fff":p.color,fontFamily:"'Jost',sans-serif",marginBottom:6,letterSpacing:"0.04em"}}>{p.term}</div>
                    <div style={{fontSize:13,color:MU,lineHeight:1.7,fontFamily:"'Jost',sans-serif"}}>{p.note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Div/>

        {/* ═══ BRAINWAVE STATES ═══ */}
        <section style={{marginBottom:64,textAlign:"center"}}>
          <Lbl>Section 01</Lbl>
          <H2>Brainwave states — where change actually lives</H2>
          <P>Your brain produces electrical activity that oscillates at different speeds depending on what you're doing and feeling. These frequencies determine what your mind is capable of in that moment — including whether new beliefs can install or bounce off.</P>

          {/* Frequency bars */}
          <div style={{margin:"36px 0"}}>
            <div style={{display:"flex",gap:6,alignItems:"flex-end",height:100,marginBottom:12}}>
              {WAVES.map((w,i)=>(
                <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:0}}>
                  <div style={{
                    width:"100%",height:w.h,
                    background:w.active?LG:w.c,
                    borderRadius:"4px 4px 0 0",
                    opacity:w.active?1:0.35,
                    boxShadow:w.active?"0 0 24px rgba(44,183,167,0.5)":"none",
                    transition:"all 0.3s"
                  }}/>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:6}}>
              {WAVES.map((w,i)=>(
                <div key={i} style={{flex:1,textAlign:"center"}}>
                  <div style={{fontSize:11,color:w.active?TEAL:DIM,fontFamily:"'Jost',sans-serif",fontWeight:w.active?600:400,letterSpacing:"0.04em"}}>{w.s}</div>
                  <div style={{fontSize:9,color:DIM,fontFamily:"monospace",marginTop:2}}>{w.hz}</div>
                </div>
              ))}
            </div>
            <div style={{textAlign:"center",marginTop:14,fontSize:12,color:TEAL,fontFamily:"'Jost',sans-serif",letterSpacing:"0.06em"}}>↑ SHG targets theta. Every track is built to get you here.</div>
          </div>

          {/* Wave cards */}
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:10}}>
            {WAVES.map((w,i)=>(
              <Box key={i} c={w.c} glow={w.active}>
                <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:10}}>
                  <span style={{fontSize:18,fontWeight:500,color:w.c,fontFamily:"'Jost',sans-serif"}}>{w.s}</span>
                  <span style={{fontSize:10,color:DIM,fontFamily:"monospace"}}>{w.hz}</span>
                </div>
                {/* Mini waveform SVG */}
                <svg viewBox="0 0 120 24" width="100%" height={24} style={{marginBottom:10,display:"block"}}>
                  {w.s==="Beta"
                    ? <polyline points="0,12 8,4 14,20 20,8 26,16 32,12 40,6 46,18 52,10 58,14 64,12 72,5 78,19 84,9 90,15 96,12 104,7 110,17 116,11 120,12"
                        fill="none" stroke={w.c} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
                    : w.s==="Alpha"
                    ? <path d="M0,12 C20,2 40,22 60,12 C80,2 100,22 120,12" fill="none" stroke={w.c} strokeWidth="1.5" opacity="0.7"/>
                    : <path d="M0,12 C30,0 60,24 90,12 C105,6 115,16 120,12" fill="none" stroke={TEAL} strokeWidth="2" opacity="1"/>
                  }
                </svg>
                <div style={{fontSize:12,color:MU,lineHeight:1.6,fontFamily:"'Jost',sans-serif"}}>{w.desc}</div>
              </Box>
            ))}
          </div>

          <div style={{margin:"28px 0",padding:"22px 24px",background:"rgba(44,183,167,0.06)",border:"1px solid rgba(44,183,167,0.18)",borderRadius:14}}>
            <P c={CR}>Children under 7 spend most of their waking hours in theta and delta — which is why everything they observe downloads directly as belief, with no critical filter to argue back. That is how your original programming was installed. That same window reopens every night as you drift to sleep, and every morning as you rise. SHG gets you there on demand.</P>
          </div>
        </section>

        <Div/>

        {/* ═══ HEART-BRAIN ═══ */}
        <section style={{marginBottom:64,textAlign:"center"}}>
          <Lbl c={LAV}>Section 02</Lbl>
          <H2>The heart-brain — it was never just the mind</H2>

          {/* Lucky Girl gradient visual — decorative SVG */}
          <div style={{display:"flex",justifyContent:"center",margin:"36px 0 40px"}}>
            <svg viewBox="0 0 440 200" width={isMobile?"100%":520} style={{maxWidth:"100%",overflow:"visible"}}>
              <defs>
                <linearGradient id="sclg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F5E0A0"/>
                  <stop offset="20%" stopColor="#E8B870"/>
                  <stop offset="52%" stopColor="#BFA5D8"/>
                  <stop offset="78%" stopColor="#2CB7A7"/>
                  <stop offset="100%" stopColor="#167A6B"/>
                </linearGradient>
                <radialGradient id="hgl" cx="35%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#E8B870" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#E8B870" stopOpacity="0"/>
                </radialGradient>
                <radialGradient id="bgl" cx="65%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#BFA5D8" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#BFA5D8" stopOpacity="0"/>
                </radialGradient>
                <filter id="glow2"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>
              {/* Glows */}
              <ellipse cx="130" cy="100" rx="90" ry="75" fill="url(#hgl)"/>
              <ellipse cx="310" cy="100" rx="90" ry="75" fill="url(#bgl)"/>
              {/* Heart */}
              <g transform="translate(130,100)" filter="url(#glow2)">
                <path d="M0,-42 C4,-54 14,-68 32,-68 C52,-68 66,-50 66,-32 C66,-6 42,18 0,52 C-42,18 -66,-6 -66,-32 C-66,-50 -52,-68 -32,-68 C-14,-68 -4,-54 0,-42 Z" fill="none" stroke="url(#sclg)" strokeWidth="2.5" strokeLinejoin="round"/>
                <path d="M-46,0 C-36,0 -30,-18 -22,14 C-16,-8 -8,12 0,0 C8,-12 14,18 22,-2 C28,-14 36,2 46,0" fill="none" stroke="url(#sclg)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.75"/>
              </g>
              {/* Connection arc */}
              <path d="M196,80 C230,40 250,40 284,68 C300,82 314,86 330,78" fill="none" stroke="url(#sclg)" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.5"/>
              {/* Signal dots */}
              {[[210,66],[238,48],[268,46],[298,66],[320,74]].map(([x,y],i)=>(
                <circle key={i} cx={x} cy={y} r={i%2===0?2.5:2} fill={[CHAMP,GOLD,LAV,TEAL,DTEAL][i]} opacity="0.85"/>
              ))}
              {/* Brain */}
              <g transform="translate(310,100)" filter="url(#glow2)">
                <path d="M0,-56 C20,-64 46,-56 54,-38 C64,-16 52,6 40,18 C50,32 48,54 32,62 C18,68 4,58 0,50 C-4,58 -18,68 -32,62 C-48,54 -50,32 -40,18 C-52,6 -64,-16 -54,-38 C-46,-56 -20,-64 0,-56 Z" fill="none" stroke="url(#sclg)" strokeWidth="2.5" strokeLinejoin="round"/>
                <path d="M0,-28 C10,-16 10,0 4,12" fill="none" stroke="url(#sclg)" strokeWidth="1.5" opacity="0.45" strokeLinecap="round"/>
                <path d="M-8,-18 C-18,-6 -14,8 -4,16" fill="none" stroke="url(#sclg)" strokeWidth="1.5" opacity="0.45" strokeLinecap="round"/>
                <path d="M12,8 C20,20 18,36 8,44" fill="none" stroke="url(#sclg)" strokeWidth="1.5" opacity="0.45" strokeLinecap="round"/>
              </g>
              {/* Coherent wave below */}
              <path d="M44,170 C80,144 116,196 152,170 C188,144 224,196 260,170 C296,144 332,196 368,170 C388,156 400,162 396,170" fill="none" stroke="url(#sclg)" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
            </svg>
          </div>

          {/* Stat cards */}
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"1fr 1fr 1fr 1fr",gap:12,marginBottom:32}}>
            {[
              {n:"40,000+",l:"Neurons in the heart",c:GOLD},
              {n:"60×",l:"Stronger EM field than the brain",c:LAV},
              {n:"4 ways",l:"Heart-to-brain signal pathways",c:TEAL},
              {n:"5,000×",l:"Stronger magnetically",c:CHAMP},
            ].map((s,i)=>(
              <div key={i} style={{textAlign:"center",padding:"18px 12px",background:"rgba(255,255,255,0.03)",border:`1px solid ${s.c}20`,borderRadius:12}}>
                <div style={{fontSize:isMobile?22:28,fontWeight:300,color:s.c,fontFamily:"'Jost',sans-serif",lineHeight:1,marginBottom:6}}>{s.n}</div>
                <div style={{fontSize:11,color:MU,fontFamily:"'Jost',sans-serif",lineHeight:1.5}}>{s.l}</div>
              </div>
            ))}
          </div>

          <P>The heart is not just a pump. It contains over 40,000 neurons — its own nervous system, capable of sensing, processing information, and making decisions independently of the cranial brain. Scientists call this the heart-brain.</P>
          <P>The heart communicates with the cranial brain through four simultaneous pathways — neurological, biochemical, biophysical, and electromagnetic. And the direction of the dominant signal is predominantly from heart to head. What the heart broadcasts, the brain receives. What the brain then accepts as belief, the body acts out as reality.</P>

          {/* 4 pathways */}
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:12,margin:"24px 0"}}>
            {[
              {p:"Neurological",c:CHAMP,d:"The vagus nerve carries signals continuously from heart to brain stem, amygdala, and thalamus — the structures governing emotion, memory, and threat response."},
              {p:"Biochemical",c:GOLD,d:"The heart produces and secretes hormones including oxytocin — the bonding hormone — which travel through the bloodstream and directly influence brain function and emotional state."},
              {p:"Biophysical",c:LAV,d:"Every heartbeat generates pressure waves through the vascular system that influence brain activity. The rhythm of these waves — coherent or incoherent — affects cognition and emotional regulation."},
              {p:"Electromagnetic",c:TEAL,d:"The heart's electromagnetic field radiates several feet outside the body. Your emotional state affects the people around you before you speak a word."},
            ].map((p,i)=>(
              <div key={i} style={{display:"flex",gap:12,padding:"16px",background:"rgba(255,255,255,0.02)",border:`1px solid ${p.c}20`,borderRadius:12}}>
                <div style={{width:4,background:p.c,borderRadius:2,flexShrink:0}}/>
                <div>
                  <div style={{fontSize:13,fontWeight:500,color:p.c,fontFamily:"'Jost',sans-serif",marginBottom:6}}>{p.p}</div>
                  <div style={{fontSize:13,color:MU,lineHeight:1.65,fontFamily:"'Jost',sans-serif"}}>{p.d}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Div/>

        {/* ═══ HEART COHERENCE ═══ */}
        <section style={{marginBottom:64,textAlign:"center"}}>
          <Lbl c={TEAL}>Section 03</Lbl>
          <H2>Heart coherence — the state that opens the door</H2>
          <P>Heart rate variability (HRV) — the variation in time between heartbeats — is the measure of your heart's rhythmic pattern. An erratic, disordered pattern reflects a contracted emotional state. A smooth, rhythmic pattern reflects coherence.</P>
          <P>These patterns travel to the brain and determine what the brain is capable of. In an incoherent state, the brain locks down. Old patterns reinforce. Nothing new can install. In a coherent state, the brain opens — cognitive function improves, resistance drops, and new information lands at a deeper level.</P>

          {/* Incoherent vs Coherent */}
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:16,margin:"28px 0"}}>
            {[
              {s:"Incoherent",c:"#555",items:["Erratic heart rhythm","Stress hormones elevated","Brain locks old beliefs in","Critical faculty on high alert","New information bounces off"]},
              {s:"Coherent",c:TEAL,items:["Smooth rhythmic heart rhythm","Stress hormones reduce","Brain becomes receptive","Critical faculty quietens","New identity can install"],glow:true},
            ].map((col,i)=>(
              <Box key={i} c={col.c} glow={col.glow}>
                <H3 c={col.c}>{col.s}</H3>
                <svg viewBox="0 0 200 36" width="100%" height={36} style={{marginBottom:14,display:"block"}}>
                  {i===0
                    ? <polyline points="0,18 12,5 18,30 26,8 34,24 40,18 52,10 60,26 68,14 74,22 84,18 96,8 104,28 110,12 118,22 126,18 136,8 144,26 152,14 160,20 168,18 178,10 186,24 194,14 200,18"
                        fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round"/>
                    : <path d="M0,18 C25,-2 50,38 75,18 C100,-2 125,38 150,18 C175,-2 188,8 200,18" fill="none" stroke={TEAL} strokeWidth="2" strokeLinecap="round"/>
                  }
                </svg>
                {col.items.map((item,j)=>(
                  <div key={j} style={{display:"flex",gap:8,marginBottom:7,alignItems:"flex-start"}}>
                    <span style={{color:col.c,flexShrink:0,fontSize:11,marginTop:3}}>{i===0?"–":"✦"}</span>
                    <span style={{fontSize:13,color:MU,lineHeight:1.6,fontFamily:"'Jost',sans-serif"}}>{item}</span>
                  </div>
                ))}
              </Box>
            ))}
          </div>

          <div style={{padding:"22px 24px",background:"rgba(191,165,216,0.07)",border:"1px solid rgba(191,165,216,0.2)",borderRadius:14,margin:"8px 0"}}>
            <P c={CR}>The research finding that changed everything: sincere feelings of appreciation, care, or love create measurable increases in heart coherence — and that coherence produced 25% improvements in cognitive performance in study participants. Emotional state is not a byproduct of circumstance. It is something that can be deliberately generated. The SHG tracks generate it through music and frequency — before the installation begins.</P>
          </div>
        </section>

        <Div/>

        {/* ═══ SUBLIMINALS ═══ */}
        <section style={{marginBottom:64,textAlign:"center"}}>
          <Lbl c={GOLD}>Section 04</Lbl>
          <H2>Why subliminals work where affirmations don't</H2>
          <P>An affirmation is a conscious statement. It is heard, evaluated by the critical faculty, and checked against existing belief. If it contradicts what you already believe — which it usually does, or you wouldn't need to say it — it is rejected. Every time.</P>
          <P>A subliminal is delivered below the threshold of conscious awareness. The ear receives it. The critical faculty never engages. The belief lands directly into the subconscious without the filter of evaluation.</P>

          <div style={{margin:"32px 0"}}>
            {[
              {n:"01",c:CHAMP,t:"Below the threshold",b:"Subliminals are embedded at a volume the conscious mind cannot clearly register. The ear receives them. The critical faculty — which rejects anything contradicting existing belief — does not engage."},
              {n:"02",c:GOLD,t:"Processed by the subconscious directly",b:"While the conscious mind is occupied with the music and hypnosis, the subconscious receives the embedded statements as information — without running them through the belief filter."},
              {n:"03",c:LAV,t:"Repetition creates installation",b:"Delivered repeatedly during the theta state, subliminals create new neural pathways. The statement moves from foreign to familiar to default. The identity shifts."},
              {n:"04",c:TEAL,t:"Behaviour changes without effort",b:"Once a belief is installed subconsciously, the behaviour that matches it becomes what you simply do. Not forced. Not disciplined. Just the natural expression of who you now believe you are."},
            ].map((s,i)=>(
              <div key={i} style={{display:"flex",gap:18,marginBottom:20,alignItems:"flex-start"}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:s.c,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{fontSize:11,fontWeight:700,color:"#000",fontFamily:"'Jost',sans-serif"}}>{s.n}</span>
                </div>
                <div>
                  <H3 c={s.c}>{s.t}</H3>
                  <P>{s.b}</P>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Div/>

        {/* ═══ EMDR ═══ */}
        <section style={{marginBottom:64,textAlign:"center"}}>
          <Lbl c={LAV}>Section 05</Lbl>
          <H2>EMDR — why both hemispheres matter</H2>
          <P>EMDR (Eye Movement Desensitisation and Reprocessing) was originally developed for trauma. The bilateral stimulation — alternating left-right input — was found to allow the brain to process difficult material without the usual emotional resistance. Both hemispheres synchronise. Defences drop. Processing deepens.</P>
          <P>In audio form, the left-right alternation happens through sound — a tone, a beat, or a pulse that alternates between the left and right ears through headphones.</P>

          {/* Hemisphere diagram */}
          <div style={{display:"flex",justifyContent:"center",margin:"32px 0"}}>
            <svg viewBox="0 0 360 120" width={isMobile?"100%":420} style={{maxWidth:"100%"}}>
              <defs>
                <linearGradient id="elg" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#E8B870"/>
                  <stop offset="100%" stopColor="#BFA5D8"/>
                </linearGradient>
              </defs>
              {/* Left hemisphere */}
              <ellipse cx="90" cy="60" rx="70" ry="50" fill="none" stroke="#E8B870" strokeWidth="2" opacity="0.8"/>
              <text x="90" y="55" textAnchor="middle" fontFamily="Jost,sans-serif" fontSize="10" fill="#E8B870">LEFT</text>
              <text x="90" y="70" textAnchor="middle" fontFamily="Jost,sans-serif" fontSize="9" fill="#888">logic · language</text>
              {/* Right hemisphere */}
              <ellipse cx="270" cy="60" rx="70" ry="50" fill="none" stroke="#BFA5D8" strokeWidth="2" opacity="0.8"/>
              <text x="270" y="55" textAnchor="middle" fontFamily="Jost,sans-serif" fontSize="10" fill="#BFA5D8">RIGHT</text>
              <text x="270" y="70" textAnchor="middle" fontFamily="Jost,sans-serif" fontSize="9" fill="#888">intuition · emotion</text>
              {/* Connecting arc */}
              <path d="M160,40 C180,20 180,20 200,40" fill="none" stroke="url(#elg)" strokeWidth="2" strokeDasharray="4 3"/>
              <path d="M160,80 C180,100 180,100 200,80" fill="none" stroke="url(#elg)" strokeWidth="2" strokeDasharray="4 3"/>
              <text x="180" y="65" textAnchor="middle" fontFamily="Jost,sans-serif" fontSize="9" fill={TEAL}>sync</text>
            </svg>
          </div>

          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:12}}>
            {[
              {c:GOLD,t:"Left ear → Right hemisphere",b:"The tone entering the left ear stimulates the right hemisphere — associated with creativity, intuition, pattern recognition, and emotional processing."},
              {c:LAV,t:"Right ear → Left hemisphere",b:"The tone entering the right ear stimulates the left hemisphere — associated with logical processing, language, and analytical function."},
              {c:TEAL,t:"Bilateral synchronisation",b:"Both hemispheres receive and process simultaneously. They synchronise. The brain moves into a state of bilateral coherence — unified, receptive, ready for deep processing.",glow:true},
              {c:CHAMP,t:"Why this installs identity",b:"EMDR was originally used for trauma because bilateral stimulation allows the brain to process difficult material without resistance. The same mechanism makes it ideal for identity installation — the fight drops away, and the new belief lands.",glow:true},
            ].map((p,i)=>(
              <Box key={i} c={p.c} glow={p.glow}>
                <H3 c={p.c}>{p.t}</H3>
                <P>{p.b}</P>
              </Box>
            ))}
          </div>
        </section>

        <Div/>

        {/* ═══ THE FULL SYSTEM ═══ */}
        <section style={{marginBottom:64,textAlign:"center"}}>
          <Lbl>Section 06</Lbl>
          <H2>How it all combines — the complete system</H2>
          <P>No single element does what all five do together. The music raises coherence. The binaural beats open theta. The EMDR synchronises both hemispheres. The hypnosis delivers the identity. The subliminals embed it below conscious awareness. In sequence, in one track, simultaneously.</P>

          <div style={{margin:"32px 0"}}>
            {[
              {l:"Layer 1",e:"Melodic House Music",c:GOLD,w:"Elevates emotional state. Raises heart coherence before anything else starts. The brain receives a signal: something good is happening. It opens slightly."},
              {l:"Layer 2",e:"Binaural Beats",c:LAV,w:"Entrains the brain from beta to theta within minutes. The critical faculty stands down. The installation window opens."},
              {l:"Layer 3",e:"EMDR Bilateral Audio",c:TEAL,w:"Synchronises both hemispheres. Resistance drops neurologically. The brain is now unified, receptive, and processing with its full capacity."},
              {l:"Layer 4",e:"Vocal Hypnosis",c:CHAMP,w:"The specific identity — delivered directly. Spoken, guided, embodied. No filter. No evaluation. The subconscious receives it as instruction."},
              {l:"Layer 5",e:"Subliminals",c:DTEAL,w:"The same beliefs embedded below conscious awareness. Stacked with the hypnosis. Repeated. The new neural pathway builds."},
            ].map((l,i)=>(
              <div key={i} style={{display:"flex",gap:0,marginBottom:2,overflow:"hidden",borderRadius:i===0?"12px 12px 0 0":i===4?"0 0 12px 12px":"0"}}>
                <div style={{width:6,background:l.c,flexShrink:0}}/>
                <div style={{flex:1,display:"grid",gridTemplateColumns:isMobile?"1fr":"100px 160px 1fr",gap:isMobile?6:0,padding:"16px 18px",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderLeft:"none",alignItems:"center"}}>
                  <div style={{fontSize:10,color:DIM,fontFamily:"'Jost',sans-serif",letterSpacing:"0.1em"}}>{l.l}</div>
                  <div style={{fontSize:14,fontWeight:500,color:l.c,fontFamily:"'Jost',sans-serif"}}>{l.e}</div>
                  <div style={{fontSize:13,color:MU,lineHeight:1.6,fontFamily:"'Jost',sans-serif"}}>{l.w}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Formula conclusion */}
          <div style={{padding:isMobile?"36px 20px":"56px 56px",background:LG,borderRadius:20,textAlign:"center",marginTop:48}}>
            <div style={{fontSize:isMobile?15:20,fontWeight:400,color:"#000",fontFamily:"'Jost',sans-serif",lineHeight:1.7,marginBottom:14}}>
              Hypnosis + Subliminals + Melodic House + EMDR + Binaural Beats
            </div>
            <div style={{fontSize:isMobile?26:42,fontWeight:400,color:"#000",fontFamily:"'Jost',sans-serif",fontStyle:"normal",lineHeight:1.2}}>
              = Theta on demand. Identity installed.
            </div>
            <div style={{fontSize:15,color:"rgba(0,0,0,0.6)",fontFamily:"'Jost',sans-serif",marginTop:16,letterSpacing:"0.06em"}}>This is the formula. This is Self Hypnosis Goddess.</div>
          </div>
        </section>

        {/* BACK CTA */}
        <div style={{textAlign:"center",paddingTop:24}}>
          <button onClick={onBack} style={{padding:"14px 40px",background:LG,border:"none",borderRadius:40,fontSize:15,fontWeight:500,color:"#000",cursor:"pointer",fontFamily:"'Jost',sans-serif",letterSpacing:"0.04em"}}>Back to reshmaoracle.com</button>
        </div>

      </div>
    </div>
  );
}
