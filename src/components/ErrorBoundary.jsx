import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, err: null }; }
  static getDerivedStateFromError(err) { return { hasError: true, err }; }
  componentDidCatch(err, info) { console.error("SHG portal crash:", err, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#C8960A 0%,#C8860A 25%,#5B8DB8 55%,#167A6B 80%,#2CB7A7 100%)", display:"flex", alignItems:"center", justifyContent:"center", padding:24, fontFamily:"'Jost',sans-serif" }}>
          <div style={{ maxWidth:440, background:"#fff8f4", borderRadius:20, padding:"32px 28px", textAlign:"center", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ fontSize:36, marginBottom:12 }}>✦</div>
            <div style={{ fontSize:11, fontWeight:900, color:"#2CB7A7", letterSpacing:"0.22em", textTransform:"uppercase", marginBottom:10 }}>Something interrupted the shift</div>
            <div style={{ fontSize:18, fontWeight:800, color:"#000", marginBottom:14, fontFamily:"'Cormorant Garamond',serif" }}>Dashboard hit a snag loading.</div>
            <div style={{ fontSize:13, color:"#4a3028", lineHeight:1.7, marginBottom:20 }}>Usually a stale cached file. Try one of these — in order — and tell Reshma if none work.</div>
            <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
              <button onClick={()=>{ window.location.reload(); }} style={{ padding:"12px", background:"linear-gradient(90deg,#C8860A,#2CB7A7)", border:"none", borderRadius:10, color:"#000", fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"'Jost',sans-serif" }}>Reload</button>
              <button onClick={()=>{ if("caches" in window) caches.keys().then(k=>k.forEach(x=>caches.delete(x))); localStorage.clear(); sessionStorage.clear(); window.location.reload(); }} style={{ padding:"12px", background:"#000", border:"none", borderRadius:10, color:"#fff", fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"'Jost',sans-serif" }}>Clear cache + reload</button>
              <button onClick={()=>{ window.location.href="/"; }} style={{ padding:"12px", background:"none", border:"1px solid rgba(0,0,0,0.2)", borderRadius:10, color:"#4a3028", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"'Jost',sans-serif" }}>Back to landing page</button>
            </div>
            {this.state.err && <details style={{ marginTop:10, textAlign:"left", fontSize:10, color:"#7a5a48", background:"rgba(0,0,0,0.04)", padding:"8px 10px", borderRadius:8 }}>
              <summary style={{ cursor:"pointer", fontWeight:700 }}>Technical details (send to support)</summary>
              <div style={{ marginTop:6, fontFamily:"monospace", wordBreak:"break-word" }}>{String(this.state.err?.message || this.state.err)}</div>
            </details>}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
