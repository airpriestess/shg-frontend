/* DesktopMockup — browser frame, dark/light, matches real dashboard */

const THEMES = {
  dark: {
    browser:"#1a1a1a", browserBorder:"#2a2a2a", urlBar:"#222", urlText:"#5a4a40",
    bg:"#080808", bg2:"#111111", bg3:"rgba(232,168,96,0.08)", nav:"#050505",
    cr:"#f2ece4", mu:"#9a8878", dim:"#5a4a40", border:"rgba(232,168,96,0.12)", scrubBg:"#2a2a2a",
  },
  light: {
    browser:"#ede8e0", browserBorder:"#d8d0c4", urlBar:"#f5f0e8", urlText:"#8a7860",
    bg:"#faf7f2", bg2:"#ffffff", bg3:"rgba(232,168,96,0.10)", nav:"rgba(250,247,242,0.97)",
    cr:"#1a1410", mu:"#7a6858", dim:"#a89888", border:"rgba(200,168,120,0.2)", scrubBg:"#e0d8cc",
  },
};

const GOLD = "#e8a860";
const OMBRE = "linear-gradient(135deg,#f5e0a0 0%,#e8b870 22%,#d4a090 48%,#c4789a 72%,#B76E79 100%)";

const CAT_ICONS = {
  Lovemaxxing: { accent:"#a85a42", icon:'<path d="M30 52 C14 42 10 30 18 24 C24 19 30 23 30 30 C30 23 36 19 42 24 C50 30 46 42 30 52 Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>' },
  Beautymaxxing: { accent:"#f5e0a0", icon:'<path d="M30 20 C24 20 20 24 20 29 C20 33 23 36 27 36 C24 38 23 42 25 46 C22 44 20 40 21 35 C16 34 13 30 13 25 C13 19 18 14 24 14 C27 14 29 15.5 30 17 C31 15.5 33 14 36 14 C42 14 47 19 47 25 C47 30 44 34 39 35 C40 40 38 44 35 46 C37 42 36 38 33 36 C37 36 40 33 40 29 C40 24 36 20 30 20 Z" fill="currentColor" opacity="0.9"/>' },
  Facemaxxing: { accent:"#e8c088", icon:'<ellipse cx="30" cy="30" rx="16" ry="20" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="24" cy="26" r="2" fill="currentColor"/><circle cx="36" cy="26" r="2" fill="currentColor"/>' },
  Bodymaxxing: { accent:"#e8a860", icon:'<circle cx="30" cy="14" r="6" fill="none" stroke="currentColor" stroke-width="3"/><path d="M30 20 L30 38 M20 26 L40 26 M30 38 L22 50 M30 38 L38 50" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' },
  Skinnymaxxing: { accent:"#e8a860", icon:'<path d="M22 14 Q30 10 38 14 L36 26 Q30 22 24 26 Z" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M24 26 Q22 38 26 48 L34 48 Q38 38 36 26" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' },
  Moneymaxxing: { accent:"#e8b870", icon:'<circle cx="30" cy="30" r="17" fill="none" stroke="currentColor" stroke-width="3"/><path d="M30 20 L30 40 M25 24 Q25 20 30 20 Q35 20 35 24 Q35 28 30 28 Q25 28 25 32 Q25 36 30 36 Q35 36 35 32" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>' },
  Businessmaxxing: { accent:"#e8b870", icon:'<rect x="14" y="24" width="32" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="3"/><path d="M22 24 L22 18 Q22 15 25 15 L35 15 Q38 15 38 18 L38 24" fill="none" stroke="currentColor" stroke-width="3"/>' },
  Careermaxxing: { accent:"#e8b870", icon:'<path d="M16 44 L16 32 L24 32 L24 44 M28 44 L28 24 L36 24 L36 44 M40 44 L40 16 L48 16 L48 44" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' },
  DNAmaxxing: { accent:"#b8934a", icon:'<path d="M20 12 Q30 20 20 28 Q10 36 20 44 Q30 52 20 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" transform="translate(10,0)"/><path d="M40 12 Q30 20 40 28 Q50 36 40 44 Q30 52 40 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" transform="translate(-10,0)"/>' },
  Selfmaxxing: { accent:"#e8b870", icon:'<circle cx="30" cy="30" r="18" fill="none" stroke="currentColor" stroke-width="2" opacity="0.4"/><circle cx="30" cy="30" r="8" fill="currentColor"/>' },
  Erosmaxxing: { accent:"#d4a028", icon:'<path d="M30 46 C30 46 14 36 14 22 C14 15 20 12 25 15 C28 17 30 21 30 21 C30 21 32 17 35 15 C40 12 46 15 46 22 C46 36 30 46 30 46 Z" fill="currentColor" opacity="0.85"/>' },
  Singlemaxxing: { accent:"#d4a028", icon:'<circle cx="30" cy="24" r="10" fill="none" stroke="currentColor" stroke-width="3"/><path d="M30 34 L30 48" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="30" cy="24" r="3" fill="currentColor"/>' },
  Wellnessmaxxing: { accent:"#e0c090", icon:'<path d="M30 46 C16 36 12 24 20 18 C25 14 30 18 30 24 C30 18 35 14 40 18 C48 24 44 36 30 46 Z" fill="none" stroke="currentColor" stroke-width="3"/>' },
  Sleepmaxxing: { accent:"#f5e0a0", icon:'<path d="M38 16 A16 16 0 1 0 38 44 A12 12 0 0 1 38 16" fill="currentColor"/>' },
  Studymaxxing: { accent:"#e8b870", icon:'<path d="M14 22 L30 14 L46 22 L30 30 Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>' },
  Friendmaxxing: { accent:"#e8b870", icon:'<circle cx="22" cy="26" r="7" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="38" cy="26" r="7" fill="none" stroke="currentColor" stroke-width="2.5"/>' },
  Peacemaxxing: { accent:"#c8a870", icon:'<circle cx="30" cy="30" r="18" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3"/><path d="M18 30 Q30 20 42 30 Q30 40 18 30" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="30" cy="30" r="4" fill="currentColor"/>' },
  Confidencemaxxing: { accent:"#e8a860", icon:'<path d="M30 12 L36 24 L48 26 L39 34 L42 46 L30 40 L18 46 L21 34 L12 26 L24 24 Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>' },
  Stylemaxxing: { accent:"#e0c090", icon:'<path d="M22 16 L26 20 L30 16 L34 20 L38 16 L38 22 L34 24 L34 46 L26 46 L26 24 L22 22 Z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/>' },
  Healmaxxing: { accent:"#d4a028", icon:'<path d="M30 44 C30 44 16 34 16 22 C16 15 22 12 27 15 C29 16.5 30 19 30 19 C30 19 31 16.5 33 15 C38 12 44 15 44 22 C44 34 30 44 30 44 Z" fill="none" stroke="currentColor" stroke-width="2.5"/>' },
  Intuitionmaxxing: { accent:"#c8a870", icon:'<circle cx="30" cy="30" r="16" fill="none" stroke="currentColor" stroke-width="2" opacity="0.35"/><circle cx="30" cy="30" r="9" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="30" cy="30" r="3" fill="currentColor"/>' },
  Lifemaxxing: { accent:"#e0a868", icon:'<circle cx="30" cy="30" r="10" fill="currentColor"/><path d="M30 10 L30 4 M30 56 L30 50 M10 30 L4 30 M56 30 L50 30" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>' },
  Luckygirlmaxxing: { accent:"#e8b870", icon:'<path d="M30 30 C30 30 22 22 16 24 C11 26 11 32 16 34 C22 36 30 30 30 30 C30 30 38 22 44 24 C49 26 49 32 44 34 C38 36 30 30 30 30" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="30" cy="30" r="3" fill="currentColor"/>' },
  Sovereignmaxxing: { accent:"#b8934a", icon:'<path d="M14 40 L14 24 L22 32 L30 16 L38 32 L46 24 L46 40 Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>' },
};

const TRACKS = [
  { title:"Spoilt Goddess",           cat:"Selfmaxxing" },
  { title:"He Finds His Way Back",    cat:"Lovemaxxing" },
  { title:"Money Finds Me First",     cat:"Moneymaxxing" },
  { title:"While I Sleep I Manifest", cat:"Sleepmaxxing" },
  { title:"Gorgeous Is My Default",   cat:"Beautymaxxing" },
  { title:"Lucky Girl Summer",        cat:"Luckygirlmaxxing" },
];

const FEATURED_CATS = ["Lovemaxxing","Moneymaxxing","Beautymaxxing","Selfmaxxing","Luckygirlmaxxing","Businessmaxxing","DNAmaxxing","Erosmaxxing","Sovereignmaxxing"];
const NAV_ITEMS = [["Home","●",true],["Search","○",false],["Library","☰",false],["ProofOS ✦","✓",false],["Analytics","▦",false]];

function Thumb({ cat, size }) {
  const c = CAT_ICONS[cat] || { accent:GOLD, icon:'<circle cx="30" cy="30" r="14" fill="none" stroke="currentColor" stroke-width="3"/>' };
  const r = Math.round(size * 0.12);
  return (
    <div style={{ width:size, height:size, borderRadius:r, flexShrink:0, overflow:"hidden",
      background:`radial-gradient(circle at 32% 28%, ${c.accent}55, #000 78%)`, position:"relative", display:"flex", alignItems:"center", justifyContent:"center", color:c.accent }}>
      <div style={{ position:"absolute", inset:0, background:`linear-gradient(155deg, ${c.accent}22 0%, transparent 55%)` }}/>
      <svg width={Math.round(size*0.5)} height={Math.round(size*0.5)} viewBox="0 0 60 60"
        dangerouslySetInnerHTML={{ __html: c.icon }} style={{ position:"relative" }}/>
    </div>
  );
}

export default function DesktopMockup({ width=480, theme="dark" }) {
  const C = THEMES[theme] || THEMES.dark;
  const h = Math.round(width * 0.65);
  const s = width / 480;
  const f = {
    xs: Math.max(5, Math.round(8*s)),
    sm: Math.max(6, Math.round(10*s)),
    md: Math.max(7, Math.round(12*s)),
    lg: Math.max(9, Math.round(15*s)),
  };
  const sidebar = Math.round(148*s), player = Math.round(56*s), browser = Math.round(28*s);
  const pad = Math.round(12*s), gap = Math.round(6*s), r6 = Math.round(6*s), r14 = Math.round(14*s);

  return (
    <div style={{ width, height:h+browser, fontFamily:"'Jost',sans-serif", borderRadius:r14,
      overflow:"hidden", flexShrink:0,
      boxShadow:`0 ${Math.round(20*s)}px ${Math.round(50*s)}px rgba(0,0,0,0.7), 0 0 0 ${Math.round(1*s)}px ${C.browserBorder}` }}>

      {/* Browser chrome */}
      <div style={{ height:browser, background:C.browser, display:"flex", alignItems:"center",
        padding:`0 ${pad}px`, gap:Math.round(6*s), borderBottom:`1px solid ${C.browserBorder}` }}>
        <div style={{ display:"flex", gap:Math.round(4*s) }}>
          {["#ff5f57","#febc2e","#28c840"].map((c,i)=>(
            <div key={i} style={{ width:Math.round(8*s), height:Math.round(8*s), borderRadius:"50%", background:c }}/>
          ))}
        </div>
        <div style={{ flex:1, height:Math.round(14*s), background:C.urlBar, borderRadius:Math.round(4*s),
          border:`0.5px solid ${C.browserBorder}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontSize:f.xs, color:C.urlText }}>reshmaoracle.com</span>
        </div>
      </div>

      {/* App shell */}
      <div style={{ height:h, display:"flex", flexDirection:"column", background:C.bg }}>
        <div style={{ flex:1, display:"flex", overflow:"hidden" }}>

          {/* Sidebar */}
          <div style={{ width:sidebar, background:C.bg, display:"flex", flexDirection:"column",
            padding:`${Math.round(pad*1.5)}px 0 ${pad}px`, flexShrink:0, borderRight:`0.5px solid ${C.border}` }}>

            {/* Wordmark */}
            <div style={{ padding:`0 ${Math.round(10*s)}px ${Math.round(14*s)}px`,
              fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:f.sm,
              background:"linear-gradient(135deg,#fce4c0,#e8a860,#c9963a)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", lineHeight:1.3 }}>
              Self Hypnosis Goddess
            </div>

            {/* Nav items */}
            {NAV_ITEMS.map(([l,ic,active],i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:Math.round(7*s),
                padding:`${Math.round(5*s)}px ${Math.round(10*s)}px`,
                borderLeft:active?`2px solid ${GOLD}`:"2px solid transparent",
                color:active?GOLD:C.mu, fontSize:f.xs }}>
                <span style={{ fontSize:f.sm, color:active?GOLD:C.dim }}>{ic}</span>{l}
              </div>
            ))}

            <div style={{ height:0.5, background:C.border, margin:`${Math.round(6*s)}px ${Math.round(8*s)}px` }}/>

            {/* Recently played */}
            <div style={{ padding:`0 ${Math.round(10*s)}px ${Math.round(4*s)}px`,
              fontSize:Math.max(5,Math.round(7*s)), color:C.dim, letterSpacing:"0.1em", textTransform:"uppercase" }}>
              Recently played
            </div>
            {TRACKS.slice(0,4).map((t,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:Math.round(6*s),
                padding:`${Math.round(3*s)}px ${Math.round(10*s)}px` }}>
                <Thumb cat={t.cat} size={Math.round(20*s)}/>
                <span style={{ fontSize:f.xs, color:i===0?GOLD:C.mu, overflow:"hidden",
                  textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.title}</span>
              </div>
            ))}
          </div>

          {/* Main content */}
          <div style={{ flex:1, background:C.bg2, overflow:"hidden", padding:pad }}>

            {/* Welcome back */}
            <div style={{ marginBottom:Math.round(8*s) }}>
              <div style={{ fontSize:Math.max(5,Math.round(7*s)), color:C.mu,
                letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:2 }}>Welcome back</div>
              <div style={{ fontSize:f.lg, color:C.cr,
                fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic" }}>Goddess</div>
            </div>

            {/* Jump back in */}
            <div style={{ fontSize:f.sm, color:C.cr, marginBottom:gap }}>Jump back in</div>
            <div style={{ display:"flex", gap, overflow:"hidden", marginBottom:Math.round(10*s) }}>
              {TRACKS.slice(0,4).map((t,i)=>(
                <div key={i} style={{ flexShrink:0, width:Math.round(68*s) }}>
                  <Thumb cat={t.cat} size={Math.round(68*s)}/>
                  <div style={{ fontSize:f.xs, color:i===0?GOLD:C.mu, marginTop:Math.round(3*s),
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.title}</div>
                </div>
              ))}
            </div>

            {/* Made for you — 2×3 category grid */}
            <div style={{ fontSize:f.sm, color:C.cr, marginBottom:gap }}>Made for you</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:Math.round(4*s) }}>
              {FEATURED_CATS.slice(0,9).map((cat,i)=>{
                const c = CAT_ICONS[cat] || { accent:GOLD };
                return (
                  <div key={i} style={{ background:`linear-gradient(135deg,${C.bg} 0%,${c.accent}18 100%)`,
                    border:`1px solid ${c.accent}28`, borderRadius:r6,
                    padding:Math.round(5*s), display:"flex", alignItems:"center", gap:Math.round(5*s) }}>
                    <div style={{ width:Math.round(22*s), height:Math.round(22*s), borderRadius:Math.round(4*s),
                      background:`${c.accent}33`, display:"flex", alignItems:"center",
                      justifyContent:"center", color:c.accent, flexShrink:0 }}>
                      <svg width={Math.round(12*s)} height={Math.round(12*s)} viewBox="0 0 60 60"
                        dangerouslySetInnerHTML={{ __html: c.icon }}/>
                    </div>
                    <span style={{ fontSize:Math.max(5,Math.round(7.5*s)), color:C.cr,
                      overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {cat.replace("maxxing","")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Player bar */}
        <div style={{ height:player, background:C.nav, borderTop:`0.5px solid ${C.border}`,
          display:"flex", alignItems:"center", padding:`0 ${pad}px`, gap:Math.round(8*s), flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:Math.round(7*s), width:sidebar-Math.round(10*s), flexShrink:0 }}>
            <Thumb cat="Selfmaxxing" size={Math.round(30*s)}/>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:f.sm, color:C.cr, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>Spoilt Goddess</div>
              <div style={{ fontSize:f.xs, color:C.mu }}>Reshma Oracle</div>
            </div>
            <span style={{ fontSize:f.md, color:GOLD, marginLeft:Math.round(4*s) }}>♡</span>
          </div>
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:Math.round(4*s) }}>
            <div style={{ display:"flex", alignItems:"center", gap:Math.round(10*s) }}>
              <span style={{ fontSize:f.md, color:C.dim }}>⇄</span>
              <span style={{ fontSize:f.md, color:C.mu }}>⏮</span>
              <div style={{ width:Math.round(22*s), height:Math.round(22*s), borderRadius:"50%",
                background:OMBRE, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width={Math.round(8*s)} height={Math.round(8*s)} viewBox="0 0 24 24" fill="#000">
                  <rect x="6" y="4" width="4" height="16" rx="1.5"/><rect x="14" y="4" width="4" height="16" rx="1.5"/>
                </svg>
              </div>
              <span style={{ fontSize:f.md, color:C.mu }}>⏭</span>
              <span style={{ fontSize:f.md, color:GOLD }}>↻</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:Math.round(5*s), width:"100%" }}>
              <span style={{ fontSize:f.xs, color:C.dim }}>1:24</span>
              <div style={{ flex:1, height:Math.round(2.5*s), background:C.scrubBg, borderRadius:1 }}>
                <div style={{ width:"38%", height:"100%", background:OMBRE, borderRadius:1 }}/>
              </div>
              <span style={{ fontSize:f.xs, color:C.dim }}>4:32</span>
            </div>
          </div>
          <div style={{ width:Math.round(70*s), display:"flex", alignItems:"center", gap:Math.round(5*s) }}>
            <span style={{ fontSize:f.sm, color:C.dim }}>🔊</span>
            <div style={{ flex:1, height:Math.round(2.5*s), background:C.scrubBg, borderRadius:1 }}>
              <div style={{ width:"70%", height:"100%", background:GOLD, borderRadius:1 }}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
