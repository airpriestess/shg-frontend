import { useState, useEffect, useRef } from "react";
import { T } from "../design/tokens.js";
import { Btn } from "../components/UI.jsx";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  "https://qtwvslrwmreazmrdktsn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0d3ZzbHJ3bXJlYXptcmRrdHNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MzIwMjAsImV4cCI6MjA5ODMwODAyMH0.FjfHRNOjnmbiYMjA9eKT1hexvwCN2ERtTyBOqY2cj-8"
);

const G = "linear-gradient(90deg,#BFA5D8,#2CB7A7)";
const RG = "#2CB7A7";

const TYPE_LABEL = {
  "Photo Proof":     { icon: "📷", color: "#2CB7A7" },
  "Voice Proof":     { icon: "🎙", color: "#2CB7A7" },
  "Sign":            { icon: "◈",  color: "#2CB7A7" },
  "Synchronicity":   { icon: "✦",  color: "#2CB7A7" },
  "Final Manifestation": { icon: "★", color: "#4a9a5a" },
};

function VoicePlayer({ url }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const a = new Audio(url);
    audioRef.current = a;
    a.onloadedmetadata = () => setDuration(a.duration);
    a.ontimeupdate    = () => setProgress((a.currentTime / a.duration) * 100 || 0);
    a.onended         = () => { setPlaying(false); setProgress(0); };
    return () => { a.pause(); };
  }, [url]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play(); setPlaying(true); }
  };

  const fmt = s => `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`;

  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, background:"#0c0b08", border:`1px solid ${RG}33`, borderRadius:10, padding:"10px 14px" }}>
      <button onClick={toggle} style={{ width:34, height:34, borderRadius:"50%", background: playing ? G : "transparent", border:`1.5px solid ${RG}66`, color: playing ? "#000" : RG, fontSize:12, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        {playing ? "⏸" : "▶"}
      </button>
      {/* Waveform bars */}
      <div style={{ display:"flex", gap:2, alignItems:"center", flex:1 }}>
        {[6,12,18,10,16,8,14,20,12,16,8,14,10,18,6].map((h,i) => (
          <div key={i} style={{ width:2, height: playing ? h : h*0.5, borderRadius:1, background: playing ? `linear-gradient(180deg,#C8A050,#C8956A)` : "#242014", transition:"height 0.3s", opacity: playing ? 0.9 : 0.4 }} />
        ))}
      </div>
      <div style={{ fontSize:11, color:T.textMuted, flexShrink:0 }}>{fmt(duration || 0)}</div>
    </div>
  );
}

function ImageLightbox({ url, caption, onClose }) {
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.92)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div onClick={e => e.stopPropagation()} style={{ maxWidth:680, width:"100%", background:"#0c0b08", border:"1px solid #242014", borderRadius:16, overflow:"hidden" }}>
        <img src={url} alt={caption} style={{ width:"100%", maxHeight:"70vh", objectFit:"contain", display:"block", background:"#000" }} />
        {caption && <div style={{ padding:"12px 18px", fontSize:14, color:T.textMuted }}>{caption}</div>}
        <div style={{ padding:"0 18px 14px", display:"flex", justifyContent:"flex-end" }}>
          <Btn size="sm" variant="ghost" onClick={onClose}>Close</Btn>
        </div>
      </div>
    </div>
  );
}

export default function ProofWall({ onAddProof }) {
  const [entries, setEntries]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("All");
  const [lightbox, setLightbox] = useState(null); // { url, caption }
  const [error, setError]       = useState(null);

  const filters = ["All", "Photo Proof", "Voice Proof", "Sign", "Synchronicity", "Final Manifestation"];

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await sb
        .from("proof_entries")
        .select("*")
        .order("happened_at", { ascending: false })
        .limit(100);

      if (err) throw err;
      setEntries(data || []);
    } catch (e) {
      console.error(e);
      setError("Could not load proof entries. " + (e.message || ""));
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === "All" ? entries : entries.filter(e => e.type === filter);
  const photos = entries.filter(e => e.photo_url);
  const voices = entries.filter(e => e.voice_url);

  return (
    <div style={{ height:"100%", overflowY:"auto", background:"#000" }} className="mob-pb">
      {lightbox && <ImageLightbox url={lightbox.url} caption={lightbox.caption} onClose={() => setLightbox(null)} />}

      <div style={{ maxWidth:960, margin:"0 auto", padding:"28px 20px" }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24, flexWrap:"wrap", gap:12 }}>
          <div>
            <h1 className="wm" style={{ fontSize:"clamp(32px,4vw,48px)", background:G, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:6 }}>
              Proof Wall
            </h1>
            <p style={{ fontSize:15, color:T.textMuted, lineHeight:1.6 }}>
              Every photo, voice note, sign, and synchronicity you have captured. Your evidence vault.
            </p>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <Btn size="sm" variant="champagne" onClick={() => onAddProof("Photo Proof")}>📷 Add Photo</Btn>
            <Btn size="sm" variant="ghost"     onClick={() => onAddProof("Voice Proof")}>🎙 Record</Btn>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:24 }} className="grid-4">
          {[
            { v: entries.length, l:"Total proof", c: RG },
            { v: photos.length,  l:"Photo proof", c: RG },
            { v: voices.length,  l:"Voice notes", c:"#2CB7A7" },
            { v: entries.filter(e=>e.type==="Final Manifestation").length, l:"Manifested", c:"#4a9a5a" },
          ].map((s,i) => (
            <div key={i} style={{ background:"#0c0b08", border:"1px solid #242014", borderRadius:12, padding:"14px 12px", textAlign:"center" }}>
              <div style={{ fontSize:28, fontWeight:800, color:s.c, lineHeight:1, marginBottom:4 }}>{s.v}</div>
              <div style={{ fontSize:11, color:T.textMuted }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Photo grid — masonry style */}
        {photos.length > 0 && (
          <div style={{ marginBottom:32 }}>
            <div style={{ fontSize:11, color:RG, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", marginBottom:14 }}>Photo Proof</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }} className="grid-3">
              {photos.map(entry => (
                <div key={entry.id} onClick={() => setLightbox({ url:entry.photo_url, caption:entry.caption })}
                  style={{ background:"#0c0b08", border:"1px solid #242014", borderRadius:12, overflow:"hidden", cursor:"pointer", transition:"border-color 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#2CB7A766"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#242014"}
                >
                  <img src={entry.photo_url} alt={entry.caption || "Proof"} style={{ width:"100%", height:140, objectFit:"cover", display:"block" }}
                    onError={e => { e.target.style.display="none"; }} />
                  <div style={{ padding:"10px 12px" }}>
                    {entry.caption && <div style={{ fontSize:13, color:T.textPrimary, fontWeight:600, marginBottom:3, lineHeight:1.35 }}>{entry.caption}</div>}
                    {entry.audio_title && <div style={{ fontSize:11, color:RG, marginBottom:2 }}>🎧 {entry.audio_title}</div>}
                    <div style={{ fontSize:10, color:T.textFaint }}>{entry.happened_at ? new Date(entry.happened_at).toLocaleDateString("en-GB") : ""}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Voice notes */}
        {voices.length > 0 && (
          <div style={{ marginBottom:32 }}>
            <div style={{ fontSize:11, color:"#2CB7A7", fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", marginBottom:14 }}>Voice Proof</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {voices.map(entry => (
                <div key={entry.id} style={{ background:"#0c0b08", border:"1px solid #2CB7A733", borderRadius:14, padding:"14px 16px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                    <div>
                      {entry.caption && <div style={{ fontSize:14, fontWeight:600, color:T.textPrimary, marginBottom:3 }}>{entry.caption}</div>}
                      <div style={{ display:"flex", gap:10 }}>
                        {entry.audio_title && <span style={{ fontSize:12, color:RG }}>🎧 {entry.audio_title}</span>}
                        {entry.duration_sec && <span style={{ fontSize:12, color:T.textMuted }}>{Math.floor(entry.duration_sec/60)}:{String(entry.duration_sec%60).padStart(2,"0")}</span>}
                        <span style={{ fontSize:11, color:T.textFaint }}>{entry.happened_at ? new Date(entry.happened_at).toLocaleDateString("en-GB") : ""}</span>
                      </div>
                    </div>
                  </div>
                  <VoicePlayer url={entry.voice_url} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding:"6px 14px", borderRadius:20, border:`1.5px solid ${filter===f ? "#2CB7A788" : "#242014"}`,
              background: filter===f ? "#2CB7A718" : "transparent",
              color: filter===f ? RG : T.textMuted, fontSize:12, fontWeight:600, cursor:"pointer"
            }}>{f}</button>
          ))}
        </div>

        {/* All entries list */}
        <div style={{ fontSize:11, color:T.textMuted, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase", marginBottom:14 }}>
          All Proof {filtered.length > 0 ? `· ${filtered.length}` : ""}
        </div>

        {loading && (
          <div style={{ textAlign:"center", padding:"40px 0" }}>
            <div style={{ fontSize:14, color:T.textMuted }}>Loading your vault...</div>
          </div>
        )}

        {error && (
          <div style={{ background:"#1a0a0a", border:"1px solid #C8906A44", borderRadius:12, padding:"16px 18px", marginBottom:16 }}>
            <div style={{ fontSize:14, color:"#2CB7A7", marginBottom:6 }}>Could not load from vault</div>
            <div style={{ fontSize:13, color:T.textMuted, marginBottom:12 }}>{error}</div>
            <Btn size="sm" variant="ghost" onClick={loadEntries}>Retry</Btn>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div style={{ textAlign:"center", padding:"60px 20px" }}>
            <div style={{ fontSize:36, marginBottom:16, opacity:0.3 }}>◈</div>
            <div style={{ fontSize:18, fontWeight:600, color:T.textPrimary, marginBottom:8 }}>No proof yet</div>
            <div style={{ fontSize:14, color:T.textMuted, lineHeight:1.7, marginBottom:24, maxWidth:340, margin:"0 auto 24px" }}>
              Your evidence vault is empty. Start capturing — upload a photo, record your voice, or log a sign.
            </div>
            <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
              <Btn variant="champagne" onClick={() => onAddProof("Photo Proof")}>📷 Add Photo Proof</Btn>
              <Btn variant="ghost"     onClick={() => onAddProof("Voice Proof")}>🎙 Record Voice Proof</Btn>
            </div>
          </div>
        )}

        {!loading && filtered.map(entry => {
          const meta = TYPE_LABEL[entry.type] || { icon:"◈", color:RG };
          return (
            <div key={entry.id} style={{ background:"#0c0b08", border:`1px solid ${meta.color}22`, borderRadius:14, padding:"14px 16px", marginBottom:10 }}>
              <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                {/* Type icon */}
                <div style={{ width:38, height:38, borderRadius:9, background:`${meta.color}18`, border:`1px solid ${meta.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>
                  {meta.icon}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, marginBottom:4 }}>
                    <div>
                      <span style={{ fontSize:11, color:meta.color, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>{entry.type}</span>
                      {entry.audio_title && <span style={{ fontSize:11, color:T.textMuted, marginLeft:8 }}>· {entry.audio_title}</span>}
                    </div>
                    <span style={{ fontSize:11, color:T.textFaint, flexShrink:0 }}>{entry.happened_at ? new Date(entry.happened_at).toLocaleDateString("en-GB") : ""}</span>
                  </div>
                  {entry.caption && <div style={{ fontSize:14, color:T.textPrimary, lineHeight:1.6, marginBottom:entry.photo_url||entry.voice_url ? 10 : 0 }}>{entry.caption}</div>}
                  {entry.photo_url && (
                    <img src={entry.photo_url} alt={entry.caption||"proof"} onClick={() => setLightbox({url:entry.photo_url,caption:entry.caption})}
                      style={{ maxWidth:240, maxHeight:160, objectFit:"cover", borderRadius:8, cursor:"pointer", border:"1px solid #242014", display:"block", marginTop:8 }}
                      onError={e => e.target.style.display="none"} />
                  )}
                  {entry.voice_url && (
                    <div style={{ marginTop:8 }}>
                      <VoicePlayer url={entry.voice_url} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Load more */}
        {!loading && filtered.length >= 100 && (
          <div style={{ textAlign:"center", padding:"20px 0" }}>
            <Btn variant="ghost" onClick={loadEntries}>Load more</Btn>
          </div>
        )}

      </div>
    </div>
  );
}
