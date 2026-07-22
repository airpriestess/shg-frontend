/* PortalScreenshot — mobile phone mockup, matches real dashboard exactly */

const THEMES = {
  dark:  { bg:"#080808", bg2:"#111111", bg3:"rgba(44,183,167,0.08)", nav:"#050505", cr:"#f2ece4", mu:"#c8bfb8", dim:"#e8e0d8", border:"rgba(44,183,167,0.15)" },
  light: { bg:"#f8fbfb", bg2:"#f0f8f7", bg3:"rgba(44,183,167,0.08)", nav:"rgba(248,251,251,0.97)", cr:"#0a0a0a", mu:"#3a3028", dim:"#2a2a2a", border:"rgba(44,183,167,0.2)" },
};

const OMBRE = "linear-gradient(135deg,#F5E0A0 0%,#E8B870 20%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";
const TEAL  = "#2CB7A7";

// All accents in LG palette only — no blue, no pink, no brown
const CAT = {
  Lovemaxxing:      { accent:"#167A6B" },
  Beautymaxxing:    { accent:"#BFA5D8" },
  Moneymaxxing:     { accent:"#E8B870" },
  Sleepmaxxing:     { accent:"#2CB7A7" },
  Selfmaxxing:      { accent:"#BFA5D8" },
  Luckygirlmaxxing: { accent:"#2CB7A7" },
  Businessmaxxing:  { accent:"#E8B870" },
  DNAmaxxing:       { accent:"#167A6B" },
  Desiresmaxxing:   { accent:"#E8B870" },
  Skinnymaxxing:    { accent:"#2CB7A7" },
};

// Real tracks matching AUDIO_URLS in portal
const TRACKS = [
  { title:"I'm a Living Breathing Masterpiece", cat:"Beautymaxxing" },
  { title:"My Desires Are Obsessed With Me",    cat:"Desiresmaxxing" },
  { title:"Seduced Focus",                      cat:"Selfmaxxing" },
  { title:"Money Finds Me First",               cat:"Moneymaxxing" },
  { title:"Spoilt Goddess",                     cat:"Selfmaxxing" },
  { title:"10 Years Into One Hour",             cat:"Sleepmaxxing" },
];

const FEATURED_CATS = ["Lovemaxxing","Moneymaxxing","Beautymaxxing","Selfmaxxing","Luckygirlmaxxing","Businessmaxxing","DNAmaxxing","Desiresmaxxing"];

function Thumb({ cat, size, radius=4 }) {
  const c = CAT[cat] || { accent: TEAL };
  return (
    <div style={{ width:size, height:size, borderRadius:radius, flexShrink:0,
      background:`linear-gradient(135deg,${c.accent}40 0%,${c.accent}18 50%,#000 100%)`,
      border:`1px solid ${c.accent}40`,
      display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
      {/* Clover logo mark */}
      <svg viewBox="0 0 100 102" width={size*0.44} height={size*0.44} fill="none">
        <defs>
          <linearGradient id="thlg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5E0A0"/>
            <stop offset="52%" stopColor="#BFA5D8"/>
            <stop offset="100%" stopColor="#167A6B"/>
          </linearGradient>
        </defs>
        <circle cx="35" cy="35" r="18" fill="none" stroke="url(#thlg)" strokeWidth="5"/>
        <circle cx="65" cy="35" r="18" fill="none" stroke="url(#thlg)" strokeWidth="5"/>
        <circle cx="35" cy="65" r="18" fill="none" stroke="url(#thlg)" strokeWidth="5"/>
        <circle cx="65" cy="65" r="18" fill="none" stroke="url(#thlg)" strokeWidth="5"/>
        <line x1="50" y1="80" x2="50" y2="96" stroke="url(#thlg)" strokeWidth="5" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

export default function PortalScreenshot({ width=260, theme="dark" }) {
  const C = THEMES[theme] || THEMES.dark;
  const h = Math.round(width * (844/390));
  const s = width / 390;
  const f = {
    xs: Math.max(6,  Math.round(9*s)),
    sm: Math.max(7,  Math.round(11*s)),
    md: Math.max(8,  Math.round(13*s)),
    lg: Math.max(10, Math.round(16*s)),
  };
  const pad = Math.round(14*s), r24 = Math.round(24*s), r8 = Math.round(8*s);
  const thumbCard = Math.round(78*s);

  return (
    <div style={{ width, height:h, background:C.bg, borderRadius:r24, overflow:"hidden",
      fontFamily:"'Jost',sans-serif", color:C.cr, position:"relative", flexShrink:0,
      boxShadow:`0 ${Math.round(24*s)}px ${Math.round(60*s)}px rgba(44,183,167,0.25), 0 0 0 ${Math.round(6*s)}px rgba(44,183,167,0.3)` }}>

      {/* STATUS BAR */}
      <div style={{ height:Math.round(38*s), display:"flex", alignItems:"flex-end",
        justifyContent:"space-between", padding:`0 ${pad}px ${Math.round(6*s)}px` }}>
        <span style={{ fontSize:f.sm, color:TEAL }}>9:41</span>
        <span style={{ fontSize:f.xs, color:C.mu }}>●● 100%</span>
      </div>
      <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)",
        width:Math.round(90*s), height:Math.round(26*s), background:C.bg,
        borderRadius:`0 0 ${Math.round(12*s)}px ${Math.round(12*s)}px`, zIndex:50 }}/>

      {/* HEADER */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:`${Math.round(4*s)}px ${pad}px ${Math.round(8*s)}px` }}>
        <div>
          <div style={{ fontSize:f.xs, color:C.mu, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:1 }}>Welcome back</div>
          <span style={{ fontSize:f.lg, color:C.cr, fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic" }}>Goddess</span>
        </div>
        {/* Avatar — clover mark */}
        <div style={{ width:Math.round(28*s), height:Math.round(28*s), borderRadius:"50%",
          background:OMBRE, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg viewBox="0 0 100 102" width={Math.round(16*s)} height={Math.round(16*s)} fill="none">
            <circle cx="35" cy="35" r="18" fill="none" stroke="#000" strokeWidth="8"/>
            <circle cx="65" cy="35" r="18" fill="none" stroke="#000" strokeWidth="8"/>
            <circle cx="35" cy="65" r="18" fill="none" stroke="#000" strokeWidth="8"/>
            <circle cx="65" cy="65" r="18" fill="none" stroke="#000" strokeWidth="8"/>
            <line x1="50" y1="80" x2="50" y2="96" stroke="#000" strokeWidth="8" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* NEW THIS WEEK label */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
        padding:`0 ${pad}px ${Math.round(5*s)}px` }}>
        <span style={{ fontSize:f.sm, color:C.cr }}>New this week</span>
        <span style={{ fontSize:f.xs, padding:`${Math.round(2*s)}px ${Math.round(7*s)}px`,
          background:OMBRE, borderRadius:20, color:"#000" }}>NEW</span>
      </div>

      {/* TRACK CARDS — horizontal scroll */}
      <div style={{ display:"flex", gap:Math.round(8*s), padding:`0 ${pad}px ${Math.round(10*s)}px`, overflowX:"hidden" }}>
        {TRACKS.slice(0,4).map((t,i)=>(
          <div key={i} style={{ flexShrink:0 }}>
            <Thumb cat={t.cat} size={thumbCard} radius={Math.round(6*s)}/>
            <div style={{ fontSize:f.xs, color:i===0?TEAL:C.cr, marginTop:Math.round(3*s),
              width:thumbCard, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.title}</div>
            <div style={{ fontSize:f.xs-1, color:C.mu }}>Reshma Oracle</div>
          </div>
        ))}
      </div>

      {/* CATEGORIES 2×2 */}
      <div style={{ padding:`0 ${pad}px ${Math.round(8*s)}px` }}>
        <div style={{ fontSize:f.sm, color:C.cr, marginBottom:Math.round(6*s) }}>Browse categories</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:Math.round(5*s) }}>
          {FEATURED_CATS.slice(0,6).map((cat,i)=>{
            const c = CAT[cat] || { accent:TEAL };
            return (
              <div key={i} style={{ background:`linear-gradient(135deg,${C.bg2} 0%,${c.accent}14 100%)`,
                border:`1px solid ${c.accent}28`, borderRadius:r8,
                padding:Math.round(8*s), display:"flex", alignItems:"center", gap:Math.round(6*s) }}>
                <div style={{ width:Math.round(8*s), height:Math.round(8*s), borderRadius:"50%",
                  background:c.accent, flexShrink:0 }}/>
                <div style={{ fontSize:f.xs, color:C.cr, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {cat.replace("maxxing","").replace("girlmaxxing","girl")}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* NOW PLAYING BAR */}
      <div style={{ position:"absolute", bottom:Math.round(56*s)+2, left:Math.round(6*s), right:Math.round(6*s),
        background:C.bg2, border:`1px solid ${C.border}`, borderRadius:Math.round(7*s),
        padding:`${Math.round(6*s)}px ${Math.round(8*s)}px`, display:"flex", alignItems:"center", gap:Math.round(8*s) }}>
        <Thumb cat="Beautymaxxing" size={Math.round(36*s)} radius={Math.round(4*s)}/>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:f.sm, color:C.cr, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>I'm a Living Breathing Masterpiece</div>
          <div style={{ fontSize:f.xs, color:C.mu }}>Reshma Oracle</div>
        </div>
        <div style={{ width:Math.round(26*s), height:Math.round(26*s), borderRadius:"50%",
          background:OMBRE, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width={Math.round(9*s)} height={Math.round(9*s)} viewBox="0 0 24 24" fill="#000">
            <rect x="6" y="4" width="4" height="16" rx="1.5"/><rect x="14" y="4" width="4" height="16" rx="1.5"/>
          </svg>
        </div>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:C.border,
          borderRadius:`0 0 ${Math.round(7*s)}px ${Math.round(7*s)}px` }}>
          <div style={{ width:"45%", height:"100%", background:OMBRE, borderRadius:`0 0 0 ${Math.round(7*s)}px` }}/>
        </div>
      </div>

      {/* BOTTOM NAV */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:Math.round(56*s),
        background:C.nav, borderTop:`0.5px solid ${C.border}`, display:"flex", alignItems:"center" }}>
        {[
          { label:"Home",      active:true  },
          { label:"Search",    active:false },
          { label:"Library",   active:false },
          { label:"ProofOS ✦", active:false },
          { label:"Analytics", active:false },
        ].map((n,i)=>(
          <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center",
            justifyContent:"center", gap:Math.round(2*s), paddingBottom:Math.round(4*s) }}>
            <div style={{ width:Math.round(4*s), height:Math.round(4*s), borderRadius:"50%",
              background: n.active ? TEAL : "transparent",
              border: n.active ? "none" : `1px solid ${C.border}` }}/>
            <span style={{ fontSize:Math.max(5,Math.round(8*s)), color:n.active?TEAL:C.mu,
              whiteSpace:"nowrap" }}>{n.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
