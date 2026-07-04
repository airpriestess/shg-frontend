/* KnowledgeGuide — the "money's worth" moment.
   Accordion covering formula, brainwaves, hypnosis vs subliminal,
   frequencies, when/how often to listen, capturing signs, Hawkins scale. */
import { useState } from "react";

const OMBRE = "linear-gradient(135deg,#f5e0a0 0%,#e8b870 22%,#d4a090 48%,#c4789a 72%,#B76E79 100%)";

const SECTIONS = [
  { k:"formula", icon:"◈", title:"The formula in every SHG audio", body:
    "Every track combines two things at once. First, my spoken self-hypnosis — the new identity, spoken as if it's already yours. Second, subliminals layered beneath the music at a volume your conscious mind cannot hear, but your subconscious receives clearly. On top of that: melodic house, EMDR bilateral stimulation, 528hz or the frequency the track needs. You're not listening to a track. You're being installed with the new self-concept while you enjoy music." },
  { k:"brainwaves", icon:"◉", title:"Brainwave states — plain English", body:
    "Beta (14–30 Hz): awake, thinking, scrolling. Alpha (8–13 Hz): relaxed, daydreaming, right after you close your eyes. Theta (4–8 Hz): the doorway to the subconscious — the state you drop into just before sleep and just after waking. THIS is where installation happens. Delta (0.5–4 Hz): deep sleep — subliminals keep working here. Gamma (30–100 Hz): flow states, insight. My audios guide you into theta and hold you there." },
  { k:"hyp-vs-sub", icon:"✦", title:"Hypnosis vs subliminal — the difference", body:
    "Hypnosis: my voice speaking directly to you at volume, guiding you into theta and installing new statements consciously and subconsciously at the same time. Subliminal: affirmations recorded beneath the music, below the threshold of conscious hearing. Your ears pick them up. Your subconscious accepts them without your conscious mind arguing. In SHG audios both run simultaneously — that's why you don't need to 'try' to believe them. And it's the same practice as hypnotherapy — but self-directed, daily, no therapist required." },
  { k:"frequencies", icon:"◊", title:"528hz, EMDR, binaural — what each does", body:
    "528hz: the repair frequency — tuned to promote cellular coherence while you rest. EMDR bilateral audio: pans left-right in a slow rhythm, which mirrors REM eye movement and dissolves stuck patterns at the root. Binaural beats: two slightly different tones in each ear — your brain generates a third tone that pulls it into theta or delta. Reiki-encoded: tracks channeled during recording so the healing intention is embedded in the audio itself." },
  { k:"when", icon:"◐", title:"The best times to listen", body:
    "Two windows are gold. First: the hour just before sleep — you're already sliding into theta, so subliminals absorb effortlessly and keep working through the night. Second: the twenty minutes just after waking, before you touch your phone — you're still in theta and completely receptive. Any other time works too: commute, gym, cooking, walking. The rule: play the audio. Don't force focus. Your subconscious is listening even when you're not." },
  { k:"how-often", icon:"◑", title:"How often to listen", body:
    "Once a day at minimum. Twice is better. The subconscious learns by repetition, not by intensity — thirty days of daily listening beats one long session every week. Loop a track for a full night if you want to go deep. Different tracks for different desires is fine — the identity carries across categories." },
  { k:"state", icon:"◒", title:"How to get yourself into the state", body:
    "You don't have to try. Press play. Get comfortable. Close your eyes if you want. If your mind wanders, let it — the audio does the work regardless. Fighting your thoughts keeps you in beta. Letting them pass drops you into theta. The music is designed to pull you down." },
  { k:"signs", icon:"✧", title:"Capturing signs & synchronicities", body:
    "This is where most people miss the shift. A sign is anything that catches your attention twice in a short window: seeing his name, hearing your amount, spotting the number, a dream, a random compliment, someone using your exact affirmation as a phrase, a refund, a text out of nowhere. If it made you pause — log it. Screenshot it. Voice-note it. Don't filter for 'relevant.' Every sign counts as evidence, and evidence rewires the subconscious faster than any affirmation. Come back and log one thing today, even if you think it's small." },
  { k:"hawkins", icon:"↑", title:"The Hawkins scale — where you're operating from", body:
    "Dr David Hawkins mapped human emotion onto a scale from 20 (Shame) to 700+ (Enlightenment). Everything below 200 (Shame, Guilt, Apathy, Grief, Fear, Desire, Anger, Pride) is contracting energy — you'll manifest more of what you fear. From 200 (Courage) up you start creating rather than reacting. Love sits at 500, Joy at 540, Peace at 600. Your dominant state IS your point of attraction. Log how you feel now, watch your average climb. That's the real dashboard." },
];

export default function KnowledgeGuide({ onClose, C }) {
  const [open, setOpen] = useState("formula");
  return (
    <>
      <div style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(0,0,0,0.6)" }} onClick={onClose}/>
      <div style={{ position:"fixed", top:"5%", left:"50%", transform:"translateX(-50%)", width:"92%", maxWidth:560, maxHeight:"90vh", overflowY:"auto", background:C?.bg2||"#fff8f4", border:`1px solid ${C?.border||"rgba(183,110,121,0.2)"}`, borderRadius:20, zIndex:1001, fontFamily:"'Jost',sans-serif", boxShadow:"0 30px 80px rgba(0,0,0,0.4)" }}>
        <div style={{ padding:"22px 22px 14px", position:"sticky", top:0, background:C?.bg2||"#fff8f4", borderBottom:`1px solid ${C?.border||"rgba(183,110,121,0.12)"}`, zIndex:2 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:10, fontWeight:900, color:"#B76E79", letterSpacing:"0.22em", textTransform:"uppercase" }}>The Guide ✦</div>
              <div style={{ fontSize:19, fontWeight:800, color:C?.cr||"#000", marginTop:2, fontFamily:"'Cormorant Garamond',serif" }}>Everything you need to know</div>
            </div>
            <button onClick={onClose} style={{ background:"none", border:"none", fontSize:22, cursor:"pointer", color:C?.mu||"#666", padding:4 }}>✕</button>
          </div>
        </div>
        <div style={{ padding:"14px 18px 22px" }}>
          {SECTIONS.map(s=>(
            <div key={s.k} style={{ marginBottom:8, border:`1px solid ${C?.border||"rgba(183,110,121,0.15)"}`, borderRadius:12, overflow:"hidden", background:open===s.k?"rgba(232,184,112,0.08)":(C?.bg3||"rgba(0,0,0,0.02)") }}>
              <button onClick={()=>setOpen(open===s.k?null:s.k)} style={{ width:"100%", padding:"14px 16px", background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, fontFamily:"'Jost',sans-serif" }}>
                <span style={{ display:"flex", alignItems:"center", gap:12, flex:1, textAlign:"left" }}>
                  <span style={{ width:30, height:30, borderRadius:8, background:OMBRE, backgroundSize:"200%", backgroundPosition:"left", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:900, color:"#000", flexShrink:0 }}>{s.icon}</span>
                  <span style={{ fontSize:14, fontWeight:800, color:C?.cr||"#000" }}>{s.title}</span>
                </span>
                <span style={{ fontSize:16, color:C?.mu||"#666", flexShrink:0, transition:"transform 0.2s", transform:open===s.k?"rotate(180deg)":"none" }}>⌄</span>
              </button>
              {open===s.k && (
                <div style={{ padding:"0 18px 18px 58px", fontSize:14, lineHeight:1.75, color:C?.cr||"#111" }}>{s.body}</div>
              )}
            </div>
          ))}
          <div style={{ marginTop:14, padding:"12px 14px", background:OMBRE, backgroundSize:"200%", backgroundPosition:"left", borderRadius:12, fontSize:12, fontWeight:700, color:"#000", textAlign:"center" }}>
            Come back to this any time. Tap the ✦ Guide button on your home screen.
          </div>
        </div>
      </div>
    </>
  );
}
