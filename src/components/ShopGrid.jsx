// One shop, used in the Shop tab and inside the passport, so they always match.
// Workbooks with a PDF in the app are bought in-app with Stripe. Until Stripe is
// switched on (or for items without a PDF) each card opens its own product page.
import { useState } from "react";

const G = "linear-gradient(110deg,#F5E0A0,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B)";
const BEACONS = "https://beacons.ai/reshmaoracle";
const UTM = "utm_source=app&utm_medium=shop";

export const PRODUCTS = [
  { name:"Lovemaxxing",        kind:"Workbook",    price:"$29", img:"/shop/lovemaxxing.webp",        link:`https://shop.beacons.ai/reshmaoracle/4386c71b-1ba1-4e6c-8b34-c6b8468615db?${UTM}&utm_campaign=lovemaxxing` },
  { name:"Luckygirlmaxxing",   kind:"Workbook",    price:"$29", img:"/shop/luckygirlmaxxing.webp",   sku:"luckygirlmaxxing", link:`https://shop.beacons.ai/reshmaoracle/765f9e37-68f6-4d14-bc86-c952a2ca565f?${UTM}&utm_campaign=luckygirlmaxxing` },
  { name:"Richgirlmaxxing",    kind:"Workbook",    price:"$29", img:"/shop/richgirlmaxxing.webp",    sku:"richgirlmaxxing", link:BEACONS },
  { name:"Inside your brain",  kind:"Freebie", price:"Free",    img:"/shop/method-deck.png",         link:`https://shop.beacons.ai/reshmaoracle/e787f0e8-83b9-45a2-9cae-4fc70decae25?${UTM}&utm_campaign=brain_guide` },
  { name:"Personalised Track", kind:"Service",     price:"",    img:"/shop/personalised-track.webp", link:BEACONS },
  { name:"1:1 Session",        kind:"Service",     price:"",    img:"/shop/session.webp",            link:BEACONS },
  { name:"Email Coaching",     kind:"Service",     price:"",    img:"/shop/email-coaching.webp",     link:BEACONS },
];

export async function buyProduct(p) {
  if (p.sku) {
    try {
      let tok = ""; try { tok = localStorage.getItem("shg_auth_token") || ""; } catch {}
      const r = await fetch("/shop/checkout", { method:"POST", headers:{ "Content-Type":"application/json", ...(tok?{Authorization:"Bearer "+tok}:{}) }, body:JSON.stringify({ sku:p.sku }) });
      const d = await r.json();
      if (d.url) { window.location.href = d.url; return; }
    } catch {}
  }
  window.open(p.link, "_blank", "noopener");
}

function Card({ p, busy, setBusy }) {
  return (
    <button onClick={async () => { setBusy(p.name); await buyProduct(p); setBusy(""); }}
      style={{ background:"#000", border:"1px solid rgba(242,236,228,0.18)", borderRadius:16, overflow:"hidden", padding:0, cursor:"pointer", textAlign:"left", fontFamily:"inherit", display:"flex", flexDirection:"column" }}>
      <img src={p.img} alt={p.name} loading="lazy" style={{ width:"100%", aspectRatio:"1", objectFit:"cover", display:"block" }}/>
      <div style={{ padding:"10px 12px 12px", display:"flex", flexDirection:"column", gap:8, flex:1, textAlign:"center" }}>
        <div style={{ fontSize:15, fontWeight:500, color:"#F2ECE4" }}>{p.name}</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, marginTop:"auto" }}>
          {p.price && <span style={{ fontSize:16, color:"#F2ECE4" }}>{p.price}</span>}
          <span style={{ padding:"7px 14px", background:G, borderRadius:999, color:"#000", fontSize:13 }}>{busy===p.name ? "Opening…" : p.price==="Free" ? "Get it" : p.price ? "Buy" : "View"}</span>
        </div>
      </div>
    </button>
  );
}

export default function ShopGrid() {
  const [busy, setBusy] = useState("");
  const groups = [["Workbooks","Workbook"],["Freebies","Freebie"]];
  return (
    <>
      <style>{`body .shg-shop-grid.shg-shop-grid{display:grid!important;flex-direction:initial!important;grid-template-columns:repeat(auto-fill,minmax(200px,1fr))!important;gap:12px}@media(max-width:700px){body .shg-shop-grid.shg-shop-grid{grid-template-columns:1fr 1fr!important}}.shg-shop-label{color:#F2ECE4!important}body .shg-shop-grid.shg-shop-grid[style*="max-width"]{grid-template-columns:1fr!important}`}</style>
      {groups.map(([title, kind]) => (
        <div key={kind} className="shg-no-paper" style={{ marginBottom:16, padding:"16px 12px", borderRadius:20, background:"#000", border:"1px solid transparent", backgroundImage:`linear-gradient(#000,#000),${G}`, backgroundOrigin:"border-box", backgroundClip:"padding-box, border-box" }}>
          <div className="shg-shop-label" style={{ fontSize:12, letterSpacing:".3em", textTransform:"uppercase", color:"#F2ECE4", margin:"0 0 12px", textAlign:"center" }}>{title}</div>
          <div className="shg-shop-grid shg-no-paper" style={kind==="Freebie"?{ maxWidth:220, margin:"0 auto" }:undefined}>
            {PRODUCTS.filter(p => p.kind === kind).map(p => <Card key={p.name} p={p} busy={busy} setBusy={setBusy}/>)}
          </div>
        </div>
      ))}
    </>
  );
}

// "Working with Reshma": her services, so members know she's there for them.
export function WorkWithReshma() {
  const offers = [{ name:"Workbooks", img:"/shop/lovemaxxing.webp", go:true }, ...PRODUCTS.filter(p => p.kind === "Service")];
  return (
    <div className="shg-no-paper" style={{ background:"#000", color:"#F2ECE4", borderRadius:20, padding:"20px 14px", border:"1.5px solid transparent", backgroundImage:`linear-gradient(#000,#000),${G}`, backgroundOrigin:"border-box", backgroundClip:"padding-box, border-box", boxShadow:"0 0 26px rgba(191,165,216,.35)" }}>
      <div className="shg-shop-label" style={{ fontSize:20, fontWeight:500, textAlign:"center", marginBottom:14, letterSpacing:0, textTransform:"none" }}>Stuck? I'm here for you.</div>
      <style>{`body .shg-wwr.shg-wwr{display:grid!important;flex-direction:initial!important;grid-template-columns:repeat(4,1fr)!important;gap:8px}@media(max-width:700px){body .shg-wwr.shg-wwr{grid-template-columns:1fr 1fr!important}}`}</style>
      <div className="shg-wwr">
        {offers.map(p => (
          <button key={p.name} onClick={() => p.go ? window.dispatchEvent(new Event("shg-go-shop")) : buyProduct(p)} style={{ background:"#000", border:"1px solid rgba(242,236,228,.2)", borderRadius:14, overflow:"hidden", padding:0, cursor:"pointer", fontFamily:"inherit" }}>
            <img src={p.img} alt="" loading="lazy" style={{ width:"100%", aspectRatio:"1", objectFit:"cover", display:"block" }}/>
            <div className="shg-shop-label" style={{ fontSize:13, padding:"8px 6px 10px", lineHeight:1.3, letterSpacing:0, textTransform:"none" }}>{p.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
