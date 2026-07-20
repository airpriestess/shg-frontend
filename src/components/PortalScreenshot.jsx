/* PortalScreenshot — mobile phone mockup, dark/light, matches real dashboard */

const THEMES = {
  dark:  { bg:"#080808", bg2:"#111111", bg3:"rgba(44,183,167,0.08)", nav:"#050505", cr:"#f2ece4", mu:"#e8e0d8", dim:"#e8e0d8", border:"rgba(44,183,167,0.12)" },
  light: { bg:"#fdf8f2", bg2:"#fffcf8", bg3:"rgba(44,183,167,0.12)", nav:"rgba(253,248,242,0.97)", cr:"#1a1008", mu:"#8a6840", dim:"#b89060", border:"rgba(180,104,48,0.18)" },
};

const GOLD = "#2CB7A7";
const OMBRE = "linear-gradient(135deg,#F5E0A0 0%,#E8B870 20%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";

const CAT_ICONS = {
  Lovemaxxing: { accent:"#167A6B", icon:'<path d="M30 52 C14 42 10 30 18 24 C24 19 30 23 30 30 C30 23 36 19 42 24 C50 30 46 42 30 52 Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>' },
  Beautymaxxing: { accent:"#F2C4CE", icon:'<path d="M30 20 C24 20 20 24 20 29 C20 33 23 36 27 36 C24 38 23 42 25 46 C22 44 20 40 21 35 C16 34 13 30 13 25 C13 19 18 14 24 14 C27 14 29 15.5 30 17 C31 15.5 33 14 36 14 C42 14 47 19 47 25 C47 30 44 34 39 35 C40 40 38 44 35 46 C37 42 36 38 33 36 C37 36 40 33 40 29 C40 24 36 20 30 20 Z" fill="currentColor" opacity="0.9"/>' },
  Moneymaxxing: { accent:"#E8B870", icon:'<circle cx="30" cy="30" r="17" fill="none" stroke="currentColor" stroke-width="3"/><path d="M30 20 L30 40 M25 24 Q25 20 30 20 Q35 20 35 24 Q35 28 30 28 Q25 28 25 32 Q25 36 30 36 Q35 36 35 32" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>' },
  Sleepmaxxing: { accent:"#5B8DB8", icon:'<path d="M38 16 A16 16 0 1 0 38 44 A12 12 0 0 1 38 16" fill="currentColor"/>' },
  Selfmaxxing: { accent:"#BFA5D8", icon:'<circle cx="30" cy="30" r="18" fill="none" stroke="currentColor" stroke-width="2" opacity="0.4"/><circle cx="30" cy="30" r="8" fill="currentColor"/>' },
  Luckygirlmaxxing: { accent:"#2CB7A7", icon:'<path d="M30 30 C30 30 22 22 16 24 C11 26 11 32 16 34 C22 36 30 30 30 30 C30 30 38 22 44 24 C49 26 49 32 44 34 C38 36 30 30 30 30" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="30" cy="30" r="3" fill="currentColor"/>' },
  Businessmaxxing: { accent:"#5B8DB8", icon:'<rect x="14" y="24" width="32" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="3"/><path d="M22 24 L22 18 Q22 15 25 15 L35 15 Q38 15 38 18 L38 24" fill="none" stroke="currentColor" stroke-width="3"/>' },
  DNAmaxxing: { accent:"#5B8DB8", icon:'<path d="M20 12 Q30 20 20 28 Q10 36 20 44 Q30 52 20 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" transform="translate(10,0)"/><path d="M40 12 Q30 20 40 28 Q50 36 40 44 Q30 52 40 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" transform="translate(-10,0)"/>' },
};

const TRACKS = [
  { title:"Spoilt Goddess",           cat:"Selfmaxxing" },
  { title:"He Finds His Way Back",    cat:"Lovemaxxing" },
  { title:"Money Finds Me First",     cat:"Moneymaxxing" },
  { title:"While I Sleep I Manifest", cat:"Sleepmaxxing" },
  { title:"Gorgeous Is My Default",   cat:"Beautymaxxing" },
  { title:"Lucky Girl Summer",        cat:"Luckygirlmaxxing" },
];

const FEATURED_CATS = ["Lovemaxxing","Moneymaxxing","Beautymaxxing","Selfmaxxing","Luckygirlmaxxing","Businessmaxxing","DNAmaxxing","Erosmaxxing"];

function Thumb({ cat, size, radius=3 }) {
  const c = CAT_ICONS[cat] || { accent: GOLD, icon:'<circle cx="30" cy="30" r="14" fill="none" stroke="currentColor" stroke-width="3"/>' };
  return (
    <div style={{ width:size, height:size, borderRadius:radius, flexShrink:0, background:`radial-gradient(circle at 32% 28%, ${c.accent}55, #000 78%)`,
      display:"flex", alignItems:"center", justifyContent:"center", color:c.accent, overflow:"hidden", position:"relative" }}>
      <div style={{ position:"absolute", inset:0, background:`linear-gradient(155deg, ${c.accent}22 0%, transparent 55%)` }}/>
      <svg width={Math.round(size*0.5)} height={Math.round(size*0.5)} viewBox="0 0 60 60"
        dangerouslySetInnerHTML={{ __html: c.icon }} style={{ position:"relative" }}/>
    </div>
  );
}

export default function PortalScreenshot({ width=260, theme="dark" }) {
  const C = THEMES[theme] || THEMES.dark;
  const h = Math.round(width * (844/390));
  const s = width / 390;
  const f = {
    xs: Math.max(6, Math.round(9*s)),
    sm: Math.max(7, Math.round(11*s)),
    md: Math.max(8, Math.round(13*s)),
    lg: Math.max(10, Math.round(16*s)),
  };
  const pad = Math.round(14*s), r24 = Math.round(24*s), r8 = Math.round(8*s);
  const thumb = Math.round(46*s), thumbCard = Math.round(78*s);

  return (
    <div style={{ width, height:h, background:C.bg, borderRadius:r24, overflow:"hidden",
      fontFamily:"'Jost',sans-serif", color:C.cr, position:"relative", flexShrink:0,
      boxShadow:`0 ${Math.round(24*s)}px ${Math.round(60*s)}px rgba(232,168,112,0.35), 0 0 0 ${Math.round(7*s)}px #C8860A, 0 0 0 ${Math.round(8*s)}px #5B8DB8` }}>

      {/* STATUS BAR */}
      <div style={{ height:Math.round(38*s), display:"flex", alignItems:"flex-end",
        justifyContent:"space-between", padding:`0 ${pad}px ${Math.round(6*s)}px` }}>
        <span style={{ fontSize:f.sm, color:GOLD }}>9:41</span>
        <span style={{ fontSize:f.xs, color:C.mu }}>●● 100%</span>
      </div>
      <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)",
        width:Math.round(90*s), height:Math.round(26*s), background:C.bg,
        borderRadius:`0 0 ${Math.round(12*s)}px ${Math.round(12*s)}px`, zIndex:50 }}/>

      {/* HEADER — Welcome back */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:`${Math.round(4*s)}px ${pad}px ${Math.round(8*s)}px` }}>
        <div>
          <div style={{ fontSize:f.xs, color:C.mu, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:1 }}>Welcome back</div>
          <span style={{ fontSize:f.lg, color:C.cr, fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic" }}>
            Goddess
          </span>
        </div>
        <div style={{ width:Math.round(26*s), height:Math.round(26*s), borderRadius:"50%",
          background:OMBRE, display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:f.xs, color:"#000" }}>G</div>
      </div>

      {/* JUMP BACK IN */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
        padding:`0 ${pad}px ${Math.round(5*s)}px` }}>
        <span style={{ fontSize:f.sm, color:C.cr }}>Jump back in</span>
        <span style={{ fontSize:f.xs, color:C.mu }}>Show all</span>
      </div>
      <div style={{ display:"flex", gap:Math.round(8*s), padding:`0 ${pad}px ${Math.round(10*s)}px`, overflowX:"hidden" }}>
        {TRACKS.slice(0,4).map((t,i)=>(
          <div key={i} style={{ flexShrink:0 }}>
            <Thumb cat={t.cat} size={thumbCard} radius={Math.round(5*s)}/>
            <div style={{ fontSize:f.xs, color:i===0?GOLD:C.cr, marginTop:Math.round(3*s),
              width:thumbCard, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.title}</div>
            <div style={{ fontSize:f.xs-1, color:C.mu }}>Reshma Oracle</div>
          </div>
        ))}
      </div>

      {/* MADE FOR YOU — 2×2 category grid */}
      <div style={{ padding:`0 ${pad}px ${Math.round(8*s)}px` }}>
        <div style={{ fontSize:f.sm, color:C.cr, marginBottom:Math.round(6*s) }}>Made for you</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:Math.round(5*s) }}>
          {FEATURED_CATS.map((cat,i)=>{
            const c = CAT_ICONS[cat] || { accent:GOLD };
            return (
              <div key={i} style={{ background:`linear-gradient(135deg,${C.bg2} 0%,${c.accent}18 100%)`,
                border:`1px solid ${c.accent}30`, borderRadius:r8,
                padding:Math.round(8*s), display:"flex", alignItems:"center", gap:Math.round(6*s) }}>
                <div style={{ width:Math.round(28*s), height:Math.round(28*s), borderRadius:Math.round(5*s),
                  background:`${c.accent}40`,
                  display:"flex", alignItems:"center", justifyContent:"center", color:c.accent, flexShrink:0 }}>
                  <svg width={Math.round(14*s)} height={Math.round(14*s)} viewBox="0 0 60 60"
                    dangerouslySetInnerHTML={{ __html: c.icon }}/>
                </div>
                <div style={{ fontSize:f.xs, color:C.cr, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {cat.replace("maxxing","")}
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
        <Thumb cat="Selfmaxxing" size={Math.round(36*s)} radius={Math.round(3*s)}/>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:f.sm, color:C.cr, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>Spoilt Goddess</div>
          <div style={{ fontSize:f.xs, color:C.mu }}>Reshma Oracle</div>
        </div>
        <span style={{ fontSize:f.md, color:GOLD }}>♡</span>
        <div style={{ width:Math.round(28*s), height:Math.round(28*s), borderRadius:"50%",
          background:OMBRE, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width={Math.round(10*s)} height={Math.round(10*s)} viewBox="0 0 24 24" fill="#000">
            <rect x="6" y="4" width="4" height="16" rx="1.5"/><rect x="14" y="4" width="4" height="16" rx="1.5"/>
          </svg>
        </div>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:C.border,
          borderRadius:`0 0 ${Math.round(7*s)}px ${Math.round(7*s)}px` }}>
          <div style={{ width:"38%", height:"100%", background:OMBRE, borderRadius:`0 0 0 ${Math.round(7*s)}px` }}/>
        </div>
      </div>

      {/* BOTTOM NAV — 5 tabs */}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:Math.round(56*s),
        background:C.nav, borderTop:`0.5px solid ${C.border}`, display:"flex", alignItems:"center" }}>
        {[
          { label:"Home",      active:true,  icon:<svg width={Math.round(20*s)} height={Math.round(20*s)} viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" fill={GOLD}/></svg> },
          { label:"Search",    active:false, icon:<svg width={Math.round(20*s)} height={Math.round(20*s)} viewBox="0 0 24 24" fill="none" stroke={C.dim} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
          { label:"Library",   active:false, icon:<svg width={Math.round(20*s)} height={Math.round(20*s)} viewBox="0 0 24 24" fill={C.dim}><path d="M3 3h4v18H3zM9 3h2v18H9zM14 3l7 2.5v13L14 21z"/></svg> },
          { label:"ProofOS",   active:false, icon:<svg width={Math.round(20*s)} height={Math.round(20*s)} viewBox="0 0 24 24" fill="none" stroke={C.dim} strokeWidth="1.8" strokeLinecap="round"><path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h9"/></svg> },
          { label:"Analytics", active:false, icon:<svg width={Math.round(20*s)} height={Math.round(20*s)} viewBox="0 0 24 24" fill="none" stroke={C.dim} strokeWidth="1.8" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
        ].map((n,i)=>(
          <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center",
            justifyContent:"center", gap:Math.round(2*s), paddingBottom:Math.round(4*s) }}>
            {n.icon}
            <span style={{ fontSize:f.xs-1, color:n.active?GOLD:C.dim }}>{n.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
