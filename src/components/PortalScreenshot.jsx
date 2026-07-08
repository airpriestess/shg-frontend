/* PortalScreenshot — pure px sizing, dark/light theme, real stock images */
const THEMES = {
  dark:  { bg:"#121212", bg2:"#1a1a1a", bg3:"#282828", bg4:"#d4b06a", cr:"#ffffff", mu:"#b3b3b3", dim:"#727272", nav:"#0a0a0a" },
  light: { bg:"#fdf0e8", bg2:"rgba(255,255,255,0.9)", bg3:"rgba(0,0,0,0.07)", bg4:"rgba(0,0,0,0.1)", cr:"#000000", mu:"#4a3028", dim:"#7a5a48", nav:"rgba(255,255,255,0.97)" },
};
const TILE_OMBRES = [
  "#f4ede4",
];
const R="#B76E79", P="#d4a090";
const OMBRE="linear-gradient(135deg,#f5e0a0 0%,#e8b870 22%,#d4a090 48%,#c4789a 72%,#B76E79 100%)";

// Unsplash stock image URLs for each track category
const IMGS = {
  "Spoilt Goddess":           { url:"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&h=200&fit=crop&auto=format", g:"#e8b870,#B76E79" },
  "He Finds His Way Back":    { url:"https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=200&h=200&fit=crop&auto=format", g:"#e8b870,#B76E79" },
  "Money Finds Me First":     { url:"https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=200&h=200&fit=crop&auto=format", g:"#e8b870,#B76E79" },
  "While I Sleep I Manifest": { url:"https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=200&h=200&fit=crop&auto=format", g:"#e8b870,#B76E79" },
  "Gorgeous Is My Default":   { url:"https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=200&h=200&fit=crop&auto=format", g:"#e8b870,#B76E79" },
  "Lucky Girl Summer":        { url:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&auto=format", g:"#e8b870,#B76E79" },
  "DNA Activation Ceremony":  { url:"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=200&h=200&fit=crop&auto=format", g:"#e8b870,#B76E79" },
  "10 Years Into One Hour":   { url:"https://images.unsplash.com/photo-1496715976403-f5c7c1a1d064?w=200&h=200&fit=crop&auto=format", g:"#e8b870,#B76E79" },
};

const RECENT = ["Spoilt Goddess","He Finds His Way Back","Money Finds Me First","While I Sleep I Manifest","Gorgeous Is My Default","Lucky Girl Summer"];

const TITLE_TO_CAT = {
  "Spoilt Goddess":"Selfmaxxing","He Finds His Way Back":"Lovemaxxing",
  "Money Finds Me First":"Moneymaxxing","While I Sleep I Manifest":"Sleepmaxxing",
  "Gorgeous Is My Default":"Beautymaxxing","Lucky Girl Summer":"Luckygirlmaxxing",
  "DNA Activation Ceremony":"DNAmaxxing","10 Years Into One Hour":"Healmaxxing",
};
const CAT_ICONS = {
  Lovemaxxing:{accent:"#a85a42",icon:'<path d="M30 52 C14 42 10 30 18 24 C24 19 30 23 30 30 C30 23 36 19 42 24 C50 30 46 42 30 52 Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>'},
  Beautymaxxing:{accent:"#b8547a",icon:'<circle cx="30" cy="30" r="14" fill="none" stroke="currentColor" stroke-width="3"/><path d="M30 16 L30 10 M30 44 L30 50 M16 30 L10 30 M44 30 L50 30" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>'},
  Moneymaxxing:{accent:"#c9963a",icon:'<circle cx="30" cy="30" r="17" fill="none" stroke="currentColor" stroke-width="3"/><path d="M30 20 L30 40 M25 24 Q25 20 30 20 Q35 20 35 24 Q35 28 30 28 Q25 28 25 32 Q25 36 30 36 Q35 36 35 32" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>'},
  Sleepmaxxing:{accent:"#2a2e58",icon:'<path d="M38 16 A16 16 0 1 0 38 44 A12 12 0 0 1 38 16" fill="currentColor"/>'},
  Selfmaxxing:{accent:"#8a5068",icon:'<circle cx="30" cy="30" r="18" fill="none" stroke="currentColor" stroke-width="2" opacity="0.4"/><circle cx="30" cy="30" r="8" fill="currentColor"/>'},
  Luckygirlmaxxing:{accent:"#e8b870",icon:'<path d="M30 30 C30 30 22 22 16 24 C11 26 11 32 16 34 C22 36 30 30 30 30 C30 30 38 22 44 24 C49 26 49 32 44 34 C38 36 30 30 30 30" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="30" cy="30" r="3" fill="currentColor"/>'},
  DNAmaxxing:{accent:"#8a3050",icon:'<path d="M20 12 Q30 20 20 28 Q10 36 20 44 Q30 52 20 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" transform="translate(10,0)"/><path d="M40 12 Q30 20 40 28 Q50 36 40 44 Q30 52 40 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" transform="translate(-10,0)"/>'},
  Healmaxxing:{accent:"#a8506a",icon:'<path d="M30 44 C30 44 16 34 16 22 C16 15 22 12 27 15 C29 16.5 30 19 30 19 C30 19 31 16.5 33 15 C38 12 44 15 44 22 C44 34 30 44 30 44 Z" fill="none" stroke="currentColor" stroke-width="2.5"/>'},
};

function Thumb({ title, size, r=3 }) {
  const cat = TITLE_TO_CAT[title];
  const c = CAT_ICONS[cat] || { accent:"#B76E79", icon:'<circle cx="30" cy="30" r="14" fill="none" stroke="currentColor" stroke-width="3"/>' };
  return (
    <div style={{ width:size, height:size, borderRadius:r, flexShrink:0, overflow:"hidden",
      background:"#000", position:"relative", display:"flex", alignItems:"center", justifyContent:"center", color:c.accent }}>
      <svg width={Math.round(size*0.55)} height={Math.round(size*0.55)} viewBox="0 0 60 60" dangerouslySetInnerHTML={{ __html: c.icon }} />
    </div>
  );
}

export default function PortalScreenshot({ width=260, theme="dark" }) {
  const C = THEMES[theme] || THEMES.dark;
  const h = Math.round(width * (844/390));
  const s = width / 390;
  const f = { xs:Math.max(6,Math.round(9*s)), sm:Math.max(7,Math.round(11*s)), md:Math.max(8,Math.round(13*s)), lg:Math.max(10,Math.round(16*s)) };
  const thumb=Math.round(46*s), thumbCard=Math.round(80*s), pad=Math.round(14*s);
  const r8=Math.round(8*s), r24=Math.round(24*s);

  return (
    <div style={{ width, height:h, background:C.bg, borderRadius:r24, overflow:"hidden",
      fontFamily:"'Jost',sans-serif", color:C.cr, position:"relative", flexShrink:0,
      boxShadow:`0 ${Math.round(24*s)}px ${Math.round(60*s)}px rgba(140,100,40,0.45), 0 0 0 ${Math.round(7*s)}px #b8934a, 0 0 0 ${Math.round(8*s)}px #d4b06a` }}>

      {/* STATUS BAR */}
      <div style={{ height:Math.round(38*s), display:"flex", alignItems:"flex-end", justifyContent:"space-between", padding:`0 ${pad}px ${Math.round(6*s)}px` }}>
        <span style={{ fontSize:f.sm, fontWeight:700, color:C.cr }}>9:41</span>
        <span style={{ fontSize:f.xs, color:C.cr }}>●● 100%</span>
      </div>
      <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:Math.round(90*s), height:Math.round(26*s), background:C.bg, borderRadius:`0 0 ${Math.round(12*s)}px ${Math.round(12*s)}px`, zIndex:50 }}/>

      {/* GREETING */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:`${Math.round(6*s)}px ${pad}px ${Math.round(10*s)}px` }}>
        <span style={{ fontSize:f.lg, fontWeight:700, color:C.cr }}>Good evening</span>
        <div style={{ width:Math.round(26*s), height:Math.round(26*s), borderRadius:"50%", background:OMBRE, display:"flex", alignItems:"center", justifyContent:"center", fontSize:f.xs, fontWeight:800, color:"#000", backgroundSize:"200%", backgroundPosition:"left" }}>R</div>
      </div>

      {/* 2×3 RECENTLY PLAYED */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:Math.round(4*s), padding:`0 ${pad}px ${Math.round(12*s)}px` }}>
        {RECENT.map((title,i)=>(
          <div key={i} style={{ background:TILE_OMBRES[i%TILE_OMBRES.length], borderRadius:Math.round(5*s), display:"flex", alignItems:"center", overflow:"hidden", height:thumb }}>
            <Thumb title={title} size={thumb} r={0}/>
            <span style={{ fontSize:f.xs, fontWeight:700, color:"#000", padding:`0 ${Math.round(6*s)}px`, lineHeight:1.25, overflow:"hidden", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" }}>{title}</span>
          </div>
        ))}
      </div>

      {/* JUMP BACK IN */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:`0 ${pad}px ${Math.round(6*s)}px` }}>
        <span style={{ fontSize:f.md, fontWeight:700, color:C.cr }}>Jump back in</span>
        <span style={{ fontSize:f.xs, color:C.mu }}>Show all</span>
      </div>
      <div style={{ display:"flex", gap:Math.round(8*s), padding:`0 ${pad}px ${Math.round(12*s)}px`, overflow:"hidden" }}>
        {["Spoilt Goddess","Money Finds Me First","Lucky Girl Summer"].map((title,i)=>(
          <div key={i} style={{ flexShrink:0 }}>
            <Thumb title={title} size={thumbCard} r={Math.round(5*s)}/>
            <div style={{ fontSize:f.xs, fontWeight:600, color:C.cr, marginTop:Math.round(4*s), width:thumbCard, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{title}</div>
            <div style={{ fontSize:f.xs-1, color:C.mu }}>Reshma Oracle</div>
          </div>
        ))}
      </div>

      {/* NOW PLAYING MINI BAR */}
      <div style={{ position:"absolute", bottom:Math.round(56*s)+2, left:Math.round(6*s), right:Math.round(6*s), background:C.bg4, borderRadius:Math.round(7*s), padding:`${Math.round(6*s)}px ${Math.round(8*s)}px`, display:"flex", alignItems:"center", gap:Math.round(8*s) }}>
        <Thumb title="Spoilt Goddess" size={Math.round(36*s)} r={Math.round(3*s)}/>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:f.sm, fontWeight:600, color:C.cr, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>Spoilt Goddess</div>
          <div style={{ fontSize:f.xs, color:C.mu }}>Reshma Oracle</div>
        </div>
        <span style={{ fontSize:f.md, color:R }}>♡</span>
        <div style={{ width:Math.round(28*s), height:Math.round(28*s), borderRadius:"50%", background:C.cr, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width={Math.round(12*s)} height={Math.round(12*s)} viewBox="0 0 24 24" fill={C.bg}>
            <rect x="6" y="4" width="4" height="16" rx="1.5"/><rect x="14" y="4" width="4" height="16" rx="1.5"/>
          </svg>
        </div>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:"#444", borderRadius:`0 0 ${Math.round(7*s)}px ${Math.round(7*s)}px` }}>
          <div style={{ width:"40%", height:"100%", background:OMBRE, backgroundSize:"200%", backgroundPosition:"left", borderRadius:`0 0 0 ${Math.round(7*s)}px` }}/>
        </div>
      </div>

      {/* 4-TAB NAV */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:Math.round(56*s), background:C.nav, borderTop:`0.5px solid ${C.bg3}`, display:"flex", alignItems:"center" }}>
        {[
          { label:"Home", active:true, color:C.cr, icon:<svg width={Math.round(20*s)} height={Math.round(20*s)} viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" fill={C.cr}/></svg> },
          { label:"Search", active:false, color:C.dim, icon:<svg width={Math.round(20*s)} height={Math.round(20*s)} viewBox="0 0 24 24" fill="none" stroke={C.dim} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
          { label:"Library", active:false, color:C.dim, icon:<svg width={Math.round(20*s)} height={Math.round(20*s)} viewBox="0 0 24 24" fill={C.dim}><path d="M3 3h4v18H3zM9 3h2v18H9zM14 3l7 2.5v13L14 21z"/></svg> },
          { label:"ProofOS", active:false, color:R, icon:<svg width={Math.round(20*s)} height={Math.round(20*s)} viewBox="0 0 24 24" fill="none" stroke={R} strokeWidth="1.8" strokeLinecap="round"><path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h9"/></svg> },
        ].map((n,i)=>(
          <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:Math.round(2*s), paddingBottom:Math.round(4*s) }}>
            {n.icon}
            <span style={{ fontSize:f.xs, fontWeight:n.active?700:400, color:n.color }}>{n.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
