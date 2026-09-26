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
  { name:"Inside your brain",  kind:"Method deck", price:"",    img:"/shop/method-deck.png",         link:`https://shop.beacons.ai/reshmaoracle/e787f0e8-83b9-45a2-9cae-4fc70decae25?${UTM}&utm_campaign=brain_guide` },
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

export default function ShopGrid() {
  const [busy, setBusy] = useState("");
  return (
    <>
      <style>{`body .shg-shop-grid.shg-shop-grid{display:grid!important;flex-direction:initial!important;grid-template-columns:repeat(auto-fill,minmax(210px,1fr))!important;gap:12px}@media(max-width:700px){body .shg-shop-grid.shg-shop-grid{grid-template-columns:1fr 1fr!important}}`}</style>
      <div className="shg-shop-grid shg-no-paper">
        {PRODUCTS.map(p => (
          <button key={p.name} onClick={async () => { setBusy(p.name); await buyProduct(p); setBusy(""); }}
            style={{ background:"#000", border:"1px solid rgba(242,236,228,0.18)", borderRadius:16, overflow:"hidden", padding:0, cursor:"pointer", textAlign:"left", fontFamily:"inherit", display:"flex", flexDirection:"column" }}>
            <img src={p.img} alt={p.name} loading="lazy" style={{ width:"100%", aspectRatio:"1", objectFit:"cover", display:"block" }}/>
            <div style={{ padding:"10px 12px 12px", display:"flex", flexDirection:"column", gap:8, flex:1 }}>
              <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#F2ECE4" }}>{p.kind}</div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, marginTop:"auto" }}>
                <span style={{ fontSize:17, color:"#F2ECE4" }}>{p.price}</span>
                <span style={{ padding:"7px 14px", background:G, borderRadius:999, color:"#000", fontSize:13 }}>{busy===p.name ? "Opening…" : p.price ? "Buy" : "View"}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
