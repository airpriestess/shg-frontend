/* DesktopMockup — mini browser + Spotify-style SHG portal
   Shows sidebar, main content grid, bottom player
   All sizes derived from width prop — no vw units */

const BG="#0f0f0f", BG2="#181818", BG3="#282828", BG4="#2a2a2a";
const R="#B76E79", P="#d4a090", CR="#ffffff", MU="#b3b3b3", DIM="#727272";
const OMBRE="linear-gradient(135deg,#f5e0a0 0%,#e8b870 22%,#d4a090 48%,#c4789a 72%,#B76E79 100%)";

const ART = {
  "Spoilt Goddess":           ["#c87890","#8a3060","♡"],
  "He Finds His Way Back":    ["#4060b0","#6080d0","✉"],
  "Money Finds Me First":     ["#306040","#50a070","✦"],
  "While I Sleep I Manifest": ["#483878","#6858a8","☽"],
  "Gorgeous Is My Default":   ["#b06840","#d4a060","◎"],
  "Lucky Girl Summer":        ["#808020","#c0c040","★"],
};

function T({ title, size }) {
  const d = ART[title] || ["#483060","#604880","✦"];
  return (
    <div style={{ width:size, height:size, borderRadius:Math.round(size*0.08), flexShrink:0,
      background:`linear-gradient(135deg,${d[0]},${d[1]})`,
      display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
      <span style={{ fontSize:size*0.42, color:"rgba(255,255,255,0.5)", lineHeight:1 }}>{d[2]}</span>
    </div>
  );
}

const TRACKS = [
  "Spoilt Goddess","He Finds His Way Back","Money Finds Me First",
  "While I Sleep I Manifest","Gorgeous Is My Default","Lucky Girl Summer",
];

export default function DesktopMockup({ width=480 }) {
  const h = Math.round(width * 0.65); // 16:10ish ratio
  const s = width / 480;

  const f = {
    xs:  Math.max(5, Math.round(8*s)),
    sm:  Math.max(6, Math.round(10*s)),
    md:  Math.max(7, Math.round(12*s)),
    lg:  Math.max(9, Math.round(15*s)),
  };

  const sidebar = Math.round(140*s);
  const player  = Math.round(56*s);
  const browser = Math.round(28*s);
  const pad     = Math.round(12*s);
  const gap     = Math.round(6*s);
  const r6      = Math.round(6*s);
  const r14     = Math.round(14*s);

  return (
    <div style={{
      width, height: h + browser, fontFamily:"'Jost',sans-serif",
      borderRadius: r14, overflow:"hidden", flexShrink:0,
      boxShadow:`0 ${Math.round(20*s)}px ${Math.round(50*s)}px rgba(0,0,0,0.85), 0 0 0 ${Math.round(1*s)}px #333`
    }}>
      {/* Browser chrome bar */}
      <div style={{ height:browser, background:"#1e1e1e", display:"flex", alignItems:"center",
        padding:`0 ${pad}px`, gap:Math.round(6*s), borderBottom:`1px solid #2a2a2a` }}>
        <div style={{ display:"flex", gap:Math.round(4*s) }}>
          {["#ff5f57","#febc2e","#28c840"].map((c,i)=>(
            <div key={i} style={{ width:Math.round(8*s), height:Math.round(8*s), borderRadius:"50%", background:c, flexShrink:0 }}/>
          ))}
        </div>
        <div style={{ flex:1, height:Math.round(14*s), background:"#2a2a2a", borderRadius:Math.round(4*s),
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontSize:f.xs, color:DIM }}>reshmaoracle.com</span>
        </div>
      </div>

      {/* App shell */}
      <div style={{ height:h, display:"flex", flexDirection:"column", background:"#000" }}>
        <div style={{ flex:1, display:"flex", overflow:"hidden" }}>

          {/* Left sidebar */}
          <div style={{ width:sidebar, background:BG, display:"flex", flexDirection:"column",
            padding:`${pad}px 0`, flexShrink:0, borderRight:`0.5px solid ${BG3}` }}>
            {/* Wordmark */}
            <div style={{ padding:`0 ${Math.round(10*s)}px ${Math.round(12*s)}px`,
              fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic",
              fontSize:f.sm, fontWeight:500,
              background:`linear-gradient(90deg,${P},${R})`,
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              lineHeight:1.3 }}>
              Self Hypnosis<br/>Goddess
            </div>
            {/* Nav */}
            {[["Home","●"],["Search","○"],["Library","☰"],["ProofOS ✦","✓"]].map(([l,ic],i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:Math.round(7*s),
                padding:`${Math.round(5*s)}px ${Math.round(10*s)}px`,
                background:i===0?BG3:"none",
                color:i===0?CR:i===3?R:MU, fontSize:f.xs, fontWeight:i===0?700:500 }}>
                <span style={{ fontSize:f.sm }}>{ic}</span>{l}
              </div>
            ))}
            <div style={{ height:0.5, background:BG3, margin:`${Math.round(8*s)}px ${Math.round(8*s)}px` }}/>
            {/* Recent tracks */}
            {TRACKS.slice(0,4).map((title,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:Math.round(6*s),
                padding:`${Math.round(3*s)}px ${Math.round(10*s)}px` }}>
                <T title={title} size={Math.round(20*s)}/>
                <span style={{ fontSize:f.xs, color:i===0?CR:MU, overflow:"hidden",
                  textOverflow:"ellipsis", whiteSpace:"nowrap",
                  fontWeight:i===0?600:400 }}>{title}</span>
              </div>
            ))}
          </div>

          {/* Main content */}
          <div style={{ flex:1, background:BG2, overflow:"hidden", padding:pad }}>
            {/* Greeting */}
            <div style={{ fontSize:f.lg, fontWeight:700, color:CR, marginBottom:Math.round(8*s) }}>Good evening</div>
            {/* 2-col grid */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:gap, marginBottom:Math.round(10*s) }}>
              {TRACKS.slice(0,4).map((title,i)=>(
                <div key={i} style={{ background:BG3, borderRadius:r6, display:"flex",
                  alignItems:"center", overflow:"hidden", height:Math.round(34*s) }}>
                  <T title={title} size={Math.round(34*s)}/>
                  <span style={{ fontSize:f.xs, fontWeight:700, color:CR,
                    padding:`0 ${Math.round(7*s)}px`, overflow:"hidden",
                    textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{title}</span>
                </div>
              ))}
            </div>
            {/* Section label */}
            <div style={{ fontSize:f.sm, fontWeight:700, color:CR, marginBottom:gap }}>Jump back in</div>
            {/* Horizontal scroll row */}
            <div style={{ display:"flex", gap:gap, overflow:"hidden" }}>
              {TRACKS.slice(0,4).map((title,i)=>(
                <div key={i} style={{ flexShrink:0, width:Math.round(72*s) }}>
                  <T title={title} size={Math.round(72*s)}/>
                  <div style={{ fontSize:f.xs, color:i===0?R:MU, marginTop:Math.round(3*s),
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                    fontWeight:i===0?600:400 }}>{title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom player bar */}
        <div style={{ height:player, background:"#0a0a0a", borderTop:`0.5px solid ${BG3}`,
          display:"flex", alignItems:"center", padding:`0 ${pad}px`, gap:Math.round(8*s), flexShrink:0 }}>
          {/* Left — now playing */}
          <div style={{ display:"flex", alignItems:"center", gap:Math.round(7*s), width:sidebar, flexShrink:0 }}>
            <T title="Spoilt Goddess" size={Math.round(32*s)}/>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:f.sm, fontWeight:600, color:CR, overflow:"hidden",
                textOverflow:"ellipsis", whiteSpace:"nowrap" }}>Spoilt Goddess</div>
              <div style={{ fontSize:f.xs, color:MU }}>Reshma Oracle</div>
            </div>
            <span style={{ fontSize:f.md, color:R, marginLeft:Math.round(4*s) }}>♡</span>
          </div>
          {/* Center — controls + scrubber */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:Math.round(4*s) }}>
            <div style={{ display:"flex", alignItems:"center", gap:Math.round(12*s) }}>
              <span style={{ fontSize:f.md, color:DIM }}>⇄</span>
              <span style={{ fontSize:f.md, color:MU }}>⏮</span>
              <div style={{ width:Math.round(24*s), height:Math.round(24*s), borderRadius:"50%",
                background:OMBRE, display:"flex", alignItems:"center", justifyContent:"center",
                backgroundSize:"200%", backgroundPosition:"left" }}>
                <svg width={Math.round(9*s)} height={Math.round(9*s)} viewBox="0 0 24 24" fill="#000"><rect x="6" y="4" width="4" height="16" rx="1.5"/><rect x="14" y="4" width="4" height="16" rx="1.5"/></svg>
              </div>
              <span style={{ fontSize:f.md, color:MU }}>⏭</span>
              <span style={{ fontSize:f.md, color:R }}>↻</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:Math.round(5*s), width:"100%" }}>
              <span style={{ fontSize:f.xs, color:DIM }}>1:24</span>
              <div style={{ flex:1, height:Math.round(2.5*s), background:"#4a4a4a", borderRadius:1 }}>
                <div style={{ width:"38%", height:"100%", background:OMBRE, backgroundSize:"200%", backgroundPosition:"left", borderRadius:1 }}/>
              </div>
              <span style={{ fontSize:f.xs, color:DIM }}>4:32</span>
            </div>
          </div>
          {/* Right — volume */}
          <div style={{ width:Math.round(80*s), display:"flex", alignItems:"center", gap:Math.round(5*s) }}>
            <span style={{ fontSize:f.sm, color:DIM }}>🔊</span>
            <div style={{ flex:1, height:Math.round(2.5*s), background:"#4a4a4a", borderRadius:1 }}>
              <div style={{ width:"70%", height:"100%", background:CR, borderRadius:1 }}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
