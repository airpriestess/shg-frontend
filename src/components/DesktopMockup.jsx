const TILE_OMBRES = [
  "#f4ede4",
];
/* DesktopMockup — mini browser frame with full theme support (dark/light)
   Pass theme="dark" | theme="light"
   All px, no vw — pure scaled layout */

const THEMES = {
  dark: {
    browser:"#1e1e1e", browserBorder:"#2a2a2a", urlBar:"#2a2a2a", urlText:"#727272",
    bg:"#0f0f0f", bg2:"#181818", bg3:"#282828", nav:"#0a0a0a",
    cr:"#ffffff", mu:"#b3b3b3", dim:"#727272", border:"#333",
    sidebar:"#0f0f0f", scrubBg:"#4a4a4a",
  },
  light: {
    browser:"#ecdde0", browserBorder:"#ddd0d0", urlBar:"#fdf0e8", urlText:"#8a7060",
    bg:"#fdf0e8", bg2:"#fff8f4", bg3:"rgba(183,110,121,0.08)", nav:"rgba(253,240,232,0.97)",
    cr:"#000000", mu:"#4a3028", dim:"#7a5a48", border:"rgba(183,110,121,0.12)",
    sidebar:"rgba(253,240,232,0.98)", scrubBg:"#e0c8c0",
  },
};

const R="#B76E79", P="$d4a090";
const OMBRE="linear-gradient(135deg,#f5e0a0 0%,#e8b870 22%,#d4a090 48%,#c4789a 72%,#B76E79 100%)";

// Unsplash images (same as PortalScreenshot)
const IMGS = {
  "Spoilt Goddess":           "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=120&h=120&fit=crop&auto=format",
  "He Finds His Way Back":    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=120&h=120&fit=crop&auto=format",
  "Money Finds Me First":     "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=120&h=120&fit=crop&auto=format",
  "While I Sleep I Manifest": "https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=120&h=120&fit=crop&auto=format",
  "Gorgeous Is My Default":   "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=120&h=120&fit=crop&auto=format",
  "Lucky Girl Summer":        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&h=120&fit=crop&auto=format",
};
const GRAD_FALLBACK = {
  "Spoilt Goddess":"#e8b870,#B76E79","He Finds His Way Back":"#e8b870,#B76E79",
  "Money Finds Me First":"#e8b870,#B76E79","While I Sleep I Manifest":"#e8b870,#B76E79",
  "Gorgeous Is My Default":"#e8b870,#B76E79","Lucky Girl Summer":"#e8b870,#B76E79",
};

const TITLE_TO_CAT = {
  "Spoilt Goddess":"Selfmaxxing","He Finds His Way Back":"Lovemaxxing",
  "Money Finds Me First":"Moneymaxxing","While I Sleep I Manifest":"Sleepmaxxing",
  "Gorgeous Is My Default":"Beautymaxxing","Lucky Girl Summer":"Luckygirlmaxxing",
};
const CAT_ICONS = {
  Lovemaxxing:{accent:"#a85a42",icon:'<path d="M30 52 C14 42 10 30 18 24 C24 19 30 23 30 30 C30 23 36 19 42 24 C50 30 46 42 30 52 Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>'},
  Beautymaxxing:{accent:"#b8547a",icon:'<path d="M30 20 C24 20 20 24 20 29 C20 33 23 36 27 36 C24 38 23 42 25 46 C22 44 20 40 21 35 C16 34 13 30 13 25 C13 19 18 14 24 14 C27 14 29 15.5 30 17 C31 15.5 33 14 36 14 C42 14 47 19 47 25 C47 30 44 34 39 35 C40 40 38 44 35 46 C37 42 36 38 33 36 C37 36 40 33 40 29 C40 24 36 20 30 20 Z" fill="currentColor" opacity="0.9"/><path d="M30 46 L30 54 M25 50 Q30 48 35 50" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>'},
  Moneymaxxing:{accent:"#c9963a",icon:'<circle cx="30" cy="30" r="17" fill="none" stroke="currentColor" stroke-width="3"/><path d="M30 20 L30 40 M25 24 Q25 20 30 20 Q35 20 35 24 Q35 28 30 28 Q25 28 25 32 Q25 36 30 36 Q35 36 35 32" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>'},
  Sleepmaxxing:{accent:"#2a2e58",icon:'<path d="M38 16 A16 16 0 1 0 38 44 A12 12 0 0 1 38 16" fill="currentColor"/>'},
  Selfmaxxing:{accent:"#8a5068",icon:'<circle cx="30" cy="30" r="18" fill="none" stroke="currentColor" stroke-width="2" opacity="0.4"/><circle cx="30" cy="30" r="8" fill="currentColor"/>'},
  Luckygirlmaxxing:{accent:"#e8b870",icon:'<path d="M30 30 C30 30 22 22 16 24 C11 26 11 32 16 34 C22 36 30 30 30 30 C30 30 38 22 44 24 C49 26 49 32 44 34 C38 36 30 30 30 30" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="30" cy="30" r="3" fill="currentColor"/>'},
};

function Thumb({ title, size }) {
  const cat = TITLE_TO_CAT[title];
  const c = CAT_ICONS[cat] || { accent:"#B76E79", icon:'<circle cx="30" cy="30" r="14" fill="none" stroke="currentColor" stroke-width="3"/>' };
  const r = Math.round(size * 0.1);
  return (
    <div style={{ width:size, height:size, borderRadius:r, flexShrink:0, overflow:"hidden",
      background:"#000", position:"relative", display:"flex", alignItems:"center", justifyContent:"center", color:c.accent }}>
      <svg width={Math.round(size*0.55)} height={Math.round(size*0.55)} viewBox="0 0 60 60" dangerouslySetInnerHTML={{ __html: c.icon }} />
    </div>
  );
}


const TRACKS = ["Spoilt Goddess","He Finds His Way Back","Money Finds Me First","While I Sleep I Manifest","Gorgeous Is My Default","Lucky Girl Summer"];

export default function DesktopMockup({ width=480, theme="dark" }) {
  const C = THEMES[theme] || THEMES.dark;
  const h = Math.round(width * 0.65);
  const s = width / 480;
  const f = {
    xs: Math.max(5,Math.round(8*s)),
    sm: Math.max(6,Math.round(10*s)),
    md: Math.max(7,Math.round(12*s)),
    lg: Math.max(9,Math.round(15*s)),
  };
  const sidebar=Math.round(140*s), player=Math.round(56*s), browser=Math.round(28*s);
  const pad=Math.round(12*s), gap=Math.round(6*s), r6=Math.round(6*s), r14=Math.round(14*s);

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
          <div style={{ width:sidebar, background:C.sidebar, display:"flex", flexDirection:"column",
            padding:`${Math.round(pad*1.8)}px 0 ${pad}px`, flexShrink:0, borderRight:`0.5px solid ${C.border}` }}>
            <div style={{ padding:`0 ${Math.round(10*s)}px ${Math.round(12*s)}px`,
              fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:f.sm, fontWeight:500,
              background:"linear-gradient(90deg,#d4a090,#B76E79)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", lineHeight:1.3 }}>
              Self Hypnosis<br/>Goddess
            </div>
            {[["Home","●",true],["Search","○",false],["Library","☰",false],["ProofOS ✦","✓",false]].map(([l,ic,active],i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:Math.round(7*s),
                padding:`${Math.round(5*s)}px ${Math.round(10*s)}px`,
                background:active?C.bg3:"none",
                color:active?C.cr:i===3?"#B76E79":C.mu, fontSize:f.xs, fontWeight:active?700:500 }}>
                <span style={{ fontSize:f.sm }}>{ic}</span>{l}
              </div>
            ))}
            <div style={{ height:0.5, background:C.border, margin:`${Math.round(8*s)}px` }}/>
            {TRACKS.slice(0,4).map((title,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:Math.round(6*s),
                padding:`${Math.round(3*s)}px ${Math.round(10*s)}px` }}>
                <Thumb title={title} size={Math.round(20*s)}/>
                <span style={{ fontSize:f.xs, color:i===0?C.cr:C.mu, overflow:"hidden",
                  textOverflow:"ellipsis", whiteSpace:"nowrap", fontWeight:i===0?600:400 }}>{title}</span>
              </div>
            ))}
          </div>

          {/* Main */}
          <div style={{ flex:1, background:C.bg2, overflow:"hidden", padding:pad }}>
            <div style={{ fontSize:f.lg, fontWeight:700, color:C.cr, marginBottom:Math.round(8*s) }}>Good evening</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap, marginBottom:Math.round(10*s) }}>
              {TRACKS.slice(0,4).map((title,i)=>(
                <div key={i} style={{ background:TILE_OMBRES[i%TILE_OMBRES.length], borderRadius:r6, display:"flex",
                  alignItems:"center", overflow:"hidden", height:Math.round(34*s) }}>
                  <Thumb title={title} size={Math.round(34*s)}/>
                  <span style={{ fontSize:f.xs, fontWeight:700, color:"#000",
                    padding:`0 ${Math.round(7*s)}px`, overflow:"hidden",
                    textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{title}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize:f.sm, fontWeight:700, color:C.cr, marginBottom:gap }}>Jump back in</div>
            <div style={{ display:"flex", gap, overflow:"hidden" }}>
              {TRACKS.slice(0,4).map((title,i)=>(
                <div key={i} style={{ flexShrink:0, width:Math.round(72*s) }}>
                  <Thumb title={title} size={Math.round(72*s)}/>
                  <div style={{ fontSize:f.xs, color:i===0?"#B76E79":C.mu, marginTop:Math.round(3*s),
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontWeight:i===0?600:400 }}>{title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Player bar */}
        <div style={{ height:player, background:C.nav, borderTop:`0.5px solid ${C.border}`,
          display:"flex", alignItems:"center", padding:`0 ${pad}px`, gap:Math.round(8*s), flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:Math.round(7*s), width:sidebar, flexShrink:0 }}>
            <Thumb title="Spoilt Goddess" size={Math.round(32*s)}/>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:f.sm, fontWeight:600, color:C.cr, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>Spoilt Goddess</div>
              <div style={{ fontSize:f.xs, color:C.mu }}>Reshma Oracle</div>
            </div>
            <span style={{ fontSize:f.md, color:"#B76E79", marginLeft:Math.round(4*s) }}>♡</span>
          </div>
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:Math.round(4*s) }}>
            <div style={{ display:"flex", alignItems:"center", gap:Math.round(12*s) }}>
              <span style={{ fontSize:f.md, color:C.dim }}>⇄</span>
              <span style={{ fontSize:f.md, color:C.mu }}>⏮</span>
              <div style={{ width:Math.round(24*s), height:Math.round(24*s), borderRadius:"50%",
                background:OMBRE, display:"flex", alignItems:"center", justifyContent:"center",
                backgroundSize:"200%", backgroundPosition:"left" }}>
                <svg width={Math.round(9*s)} height={Math.round(9*s)} viewBox="0 0 24 24" fill={theme==="light"?"#000":"#000"}><rect x="6" y="4" width="4" height="16" rx="1.5"/><rect x="14" y="4" width="4" height="16" rx="1.5"/></svg>
              </div>
              <span style={{ fontSize:f.md, color:C.mu }}>⏭</span>
              <span style={{ fontSize:f.md, color:"#B76E79" }}>↻</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:Math.round(5*s), width:"100%" }}>
              <span style={{ fontSize:f.xs, color:C.dim }}>1:24</span>
              <div style={{ flex:1, height:Math.round(2.5*s), background:C.scrubBg, borderRadius:1 }}>
                <div style={{ width:"38%", height:"100%", background:OMBRE, backgroundSize:"200%", backgroundPosition:"left", borderRadius:1 }}/>
              </div>
              <span style={{ fontSize:f.xs, color:C.dim }}>4:32</span>
            </div>
          </div>
          <div style={{ width:Math.round(80*s), display:"flex", alignItems:"center", gap:Math.round(5*s) }}>
            <span style={{ fontSize:f.sm, color:C.dim }}>🔊</span>
            <div style={{ flex:1, height:Math.round(2.5*s), background:C.scrubBg, borderRadius:1 }}>
              <div style={{ width:"70%", height:"100%", background:C.cr, borderRadius:1 }}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
