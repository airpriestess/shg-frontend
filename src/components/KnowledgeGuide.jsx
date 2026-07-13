/* KnowledgeGuide — comprehensive listening guide covering every question */
import { useState } from "react";

const OMBRE = "linear-gradient(135deg,#fce4c0 0%,#e8a860 50%,#c9963a 100%)";

const SECTIONS = [
  { k:"formula", icon:"◈", title:"The formula in every SHG audio",
    body:"Every track combines two things at once. My spoken self-hypnosis — the new identity, spoken as if it's already yours — and subliminals layered beneath the music at a volume your conscious mind cannot hear, but your subconscious receives clearly. On top of that: melodic house, EMDR bilateral stimulation, 528hz or whichever frequency the track needs. You're not listening to a track. You're being installed with a new self-concept while you enjoy music." },

  { k:"when", icon:"◐", title:"When to listen — the best windows",
    body:"Two windows are gold. First: the hour just before sleep — you're already sliding into theta, subliminals absorb effortlessly and keep working through the night. Second: the twenty minutes just after waking, before you touch your phone — you're still in theta and completely receptive.\n\nAny other time also works: commute, gym, cooking, walking. The rule is simple — press play. Your subconscious is listening even when you're not consciously focused." },

  { k:"how-long-session", icon:"⏱", title:"How long should each listening session be?",
    body:"A minimum of 20–30 minutes per session gives the audio enough time to move you through alpha and into theta. Longer is better — most tracks are 20–60 minutes by design.\n\nLooping a track all night while you sleep is one of the most effective things you can do. There is no upper limit. You cannot overdose on identity installation. The subconscious learns by repetition, not intensity." },

  { k:"how-often", icon:"◑", title:"How often to listen — daily minimum",
    body:"Once a day at minimum. Twice is better. Seven consecutive nights on the same track is the accelerated protocol.\n\nThe subconscious learns by repetition, not by occasional intensity. Thirty days of daily listening beats three hours once a week. Consistency is the entire mechanism. Think of it like brushing teeth — daily, brief, non-negotiable." },

  { k:"how-many-tracks", icon:"⇄", title:"Can I mix between tracks? How many at once?",
    body:"Yes. You can listen to different tracks on different days or at different times of day. There is no conflict.\n\nA practical approach: use one track per desire category as your primary, and layer in others. For example: Money Finds Me First overnight, Spoilt Goddess in the morning. They don't cancel each other out — your subconscious is processing all of it.\n\nWhat to avoid: switching tracks constantly without giving any single one enough repetitions to land. Give each track at least 7 consecutive days before you assess whether it's shifting something." },

  { k:"multiple-intentions", icon:"✦", title:"Can I have multiple intentions at once?",
    body:"Yes. You can hold multiple desires simultaneously — love, money, appearance, business, all at once. The subconscious is not linear. It does not process one thing at a time.\n\nIn ProofOS, open a separate thread for each desire. Each thread links to its own audio. You can listen to different tracks for different desires and log signs separately for each one.\n\nThe only caution: if you're new, start with your most burning desire first. Give it weight. Then add others. Not because multiple desires conflict — they don't — but because your emotional investment needs to be real for the installation to take hold." },

  { k:"same-track-multiple", icon:"◉", title:"Can I use one track for multiple intentions?",
    body:"Yes. A track like Money Finds Me First installs a money identity — but that identity bleeds into everything. Confidence, self-worth, authority. You don't need a separate track for every nuance of the same category.\n\nYou can also set multiple desires in ProofOS that all link to the same audio if they're in the same category. The track's core identity upgrade covers all of them." },

  { k:"results", icon:"↑", title:"When can I expect to see results?",
    body:"Signs typically begin within 3–7 days. Not the full manifestation — signs. A text out of nowhere. Money arriving from somewhere unexpected. A compliment about something you were just listening about. These are evidence the identity is shifting.\n\nThe full manifestation timeline varies. Some desires land in days. Some take 30–90 days. The ones that take longer are usually bigger identity gaps — the distance between who you currently believe you are and who the track is installing.\n\nThe variable is not the audio. The variable is how often you listen and whether you log signs as they arrive. Signs logged = subconscious confirmation that the shift is real = faster movement." },

  { k:"working", icon:"◊", title:"How do I know it's working?",
    body:"In order of reliability:\n\n1. Signs and synchronicities — things appearing that match your intention before it's fully landed. Log these immediately.\n2. Emotional shift — you stop feeling desperate about the desire. It starts feeling like it's already on its way.\n3. Behavioural shift — you act differently without deciding to. You speak differently. You stop checking your phone waiting for him to text.\n4. External confirmation — people comment on something different about you. Opportunities arrive.\n5. The desire feels boring — this sounds counterintuitive but it's the biggest indicator. When something stops feeling urgent and starts feeling like a given, it's installed.\n\nIf you feel nothing and see nothing after 14 days of daily listening: increase frequency, and check whether you're actually in a relaxed state when you listen." },

  { k:"stop", icon:"◈", title:"When to stop listening to a track",
    body:"Never stop a track because you're bored of it. Boredom is your conscious mind — your subconscious is still receiving.\n\nStop a track — or retire it — when the desire has fully manifested and been logged in ProofOS. Even then, some people keep the track running as maintenance.\n\nIf a track triggers emotional resistance — not boredom, but actual discomfort — that's actually a sign it's hitting a real block. Don't stop. Lean in. The resistance is where the old belief is sitting." },

  { k:"sats", icon:"✧", title:"What is SATS — State Akin To Sleep?",
    body:"SATS is a term from Neville Goddard's work. It stands for State Akin To Sleep — the hypnagogic threshold between waking and sleep where the subconscious is most receptive.\n\nIn SATS, your conscious mind relaxes its guard. New beliefs, scenes, and identities bypass the critical faculty and land directly into the subconscious as accepted fact.\n\nEvery SHG audio is designed to be listened to in SATS — the moment you're dropping into sleep, or just after you wake. This is why the nighttime protocol is so effective. The audio carries you into SATS and installs while you're there. You don't need to do anything else. Just press play and close your eyes." },

  { k:"combine", icon:"⇌", title:"Can I combine SHG with other methods?",
    body:"Yes. SHG is not exclusive. You can combine with:\n\n— Scripting / journalling (writing in present tense as if it's done)\n— Visualisation (seeing and feeling the end result)\n— Affirmations (especially right after listening when you're still in theta)\n— The 369 method, 555 method, or any other protocol\n— Therapy, coaching, or other personal development work\n\nThe audio accelerates everything else because it operates at the subconscious level — the level everything else is trying to reach. It's not in competition with other methods. It's the deepest layer they all sit on top of." },

  { k:"brainwaves", icon:"◒", title:"Brainwave states — plain English",
    body:"Beta (14–30 Hz): awake, thinking, scrolling. Critical faculty is fully active. Hard to install new beliefs here.\n\nAlpha (8–13 Hz): relaxed, daydreaming, right after you close your eyes. First layer of receptivity.\n\nTheta (4–8 Hz): the doorway to the subconscious — the state just before sleep and just after waking. This is where installation happens. Your critical faculty is offline. New beliefs land as fact.\n\nDelta (0.5–4 Hz): deep sleep — subliminals keep working here. This is why overnight listening is so powerful.\n\nSHG audios are designed to guide you from alpha into theta and hold you there." },

  { k:"hyp-vs-sub", icon:"◈", title:"Hypnosis vs subliminal — the difference",
    body:"Hypnosis: my voice speaking directly to you at volume, guiding you into theta and installing new identity statements consciously and subconsciously at the same time.\n\nSubliminal: affirmations recorded beneath the music, below the threshold of conscious hearing. Your ears pick them up. Your subconscious accepts them without your conscious mind arguing.\n\nIn SHG audios both run simultaneously — that's why you don't need to 'try' to believe the statements. The conscious layer hears the music. The subconscious receives the installation. You just have to play it." },

  { k:"frequencies", icon:"◊", title:"528hz, EMDR, binaural — what each does",
    body:"528hz: the repair frequency — tuned to promote cellular coherence and DNA-level alignment while you rest.\n\nEMDR bilateral audio: pans left-right in a slow rhythm, mirroring REM eye movement and dissolving stuck patterns and old beliefs at the root. This is the same mechanism used in trauma therapy.\n\nBinaural beats: two slightly different tones in each ear — your brain generates a third tone that pulls it into theta or delta. Requires headphones.\n\nReiki-encoded: tracks recorded with healing intention embedded in the audio itself, raising the energetic frequency of the file.\n\n963hz (where used): the frequency of activation — used in DNA and sovereignty tracks." },

  { k:"state", icon:"◉", title:"How to get yourself into the right state",
    body:"You don't need to try. Press play. Get comfortable. Close your eyes if you want.\n\nIf your mind wanders, let it — the audio does the work regardless of whether you're consciously following it. Fighting your thoughts keeps you in beta. Letting them pass drops you into theta.\n\nThe music is specifically designed to carry you down. You don't earn the results by concentrating harder. You earn them by pressing play more often." },

  { k:"signs", icon:"✧", title:"Capturing signs and synchronicities",
    body:"A sign is anything that catches your attention twice in a short window — or once, in a way that stops you. Seeing his name, hearing your amount, spotting the number, a dream, a random compliment, someone using your exact affirmation as a phrase, a refund, a text out of nowhere.\n\nIf it made you pause — log it. Screenshot it. Voice-note it. Don't filter for 'relevant.'\n\nWhy logging matters: every sign you log is evidence the shift is happening. Evidence rewires the subconscious faster than any affirmation. Come back and log one thing today, even if it seems small. The accumulation is the proof." },

  { k:"hawkins", icon:"↑", title:"The Hawkins scale — your point of attraction",
    body:"Dr David Hawkins mapped consciousness onto a scale from 20 (Shame) to 700+ (Enlightenment). Your dominant state is your point of attraction — it decides what your reality reorganizes to match.\n\nBelow 200: contractive energy. Fear, desire, anger, pride. Everything manifested here confirms what you already fear.\n\nAt 200 (Courage): the switch flips. From here up you create instead of react.\n\n350+: Acceptance and above. This is where identity manifestation accelerates.\n500 (Love): where Spoilt Goddess lives.\n540 (Joy): effortless manifestation — things arrive without you chasing.\n\nYour Analytics tab tracks your dominant state over time. Watch it climb. That IS the manifestation work." },
];

const CATEGORIES = [
  { label:"Getting started", keys:["formula","when","how-long-session","how-often","state"] },
  { label:"Tracks and intentions", keys:["how-many-tracks","multiple-intentions","same-track-multiple","stop"] },
  { label:"Results", keys:["results","working","signs"] },
  { label:"The method", keys:["sats","combine","brainwaves","hyp-vs-sub","frequencies"] },
  { label:"The scale", keys:["hawkins"] },
];

export default function KnowledgeGuide({ onClose, C }) {
  const [open, setOpen] = useState(null);
  const [cat, setCat] = useState("Getting started");

  const isDark = C?.bg === "#080808" || C?.bg === "#0f0f0f" || !C?.bg?.startsWith("#f");
  const bg = isDark ? "#0a0a0a" : "#fdf8f2";
  const bg2 = isDark ? "#111111" : "#ffffff";
  const cr = isDark ? "#f2ece4" : "#1a1008";
  const mu = isDark ? "#9a8878" : "#8a6840";
  const border = isDark ? "rgba(232,168,96,0.15)" : "rgba(180,104,48,0.18)";

  const visibleSections = SECTIONS.filter(s =>
    CATEGORIES.find(c => c.label === cat)?.keys.includes(s.k)
  );

  return (
    <>
      <div style={{ position:"fixed", inset:0, zIndex:1000, background:"rgba(0,0,0,0.7)" }} onClick={onClose}/>
      <div style={{ position:"fixed", top:"4%", left:"50%", transform:"translateX(-50%)", width:"94%", maxWidth:580,
        maxHeight:"92vh", overflowY:"auto", background:bg, border:`1px solid ${border}`,
        borderRadius:20, zIndex:1001, fontFamily:"'Jost',sans-serif", boxShadow:"0 30px 80px rgba(0,0,0,0.6)" }}>

        {/* Header */}
        <div style={{ padding:"20px 20px 14px", position:"sticky", top:0, background:bg,
          borderBottom:`1px solid ${border}`, zIndex:2 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <div style={{ fontSize:10, color:"#e8a860", letterSpacing:"0.22em", textTransform:"uppercase", marginBottom:4 }}>Listening Guide ✦</div>
              <div style={{ fontSize:18, color:cr, fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic" }}>Everything you need to know</div>
              <div style={{ fontSize:12, color:mu, marginTop:4 }}>{SECTIONS.length} questions answered</div>
            </div>
            <button onClick={onClose} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:mu, padding:4 }}>✕</button>
          </div>

          {/* Category pills */}
          <div style={{ display:"flex", gap:6, marginTop:14, overflowX:"auto", paddingBottom:2 }}>
            {CATEGORIES.map(c=>(
              <button key={c.label} onClick={()=>{setCat(c.label);setOpen(null);}}
                style={{ flexShrink:0, padding:"6px 14px", borderRadius:20, border:`1px solid ${cat===c.label?"#e8a860":border}`,
                  background:cat===c.label?"#e8a860":"none", color:cat===c.label?"#000":mu,
                  fontSize:11, cursor:"pointer", fontFamily:"'Jost',sans-serif", whiteSpace:"nowrap" }}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div style={{ padding:"12px 16px 24px" }}>
          {visibleSections.map(s=>(
            <div key={s.k} style={{ marginBottom:6, border:`1px solid ${border}`, borderRadius:12,
              overflow:"hidden", background:open===s.k?`rgba(232,168,96,0.06)`:bg2 }}>
              <button onClick={()=>setOpen(open===s.k?null:s.k)}
                style={{ width:"100%", padding:"13px 14px", background:"none", border:"none", cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, fontFamily:"'Jost',sans-serif" }}>
                <span style={{ display:"flex", alignItems:"center", gap:10, flex:1, textAlign:"left" }}>
                  <span style={{ width:28, height:28, borderRadius:7, background:OMBRE, display:"flex",
                    alignItems:"center", justifyContent:"center", fontSize:12, color:"#000", flexShrink:0 }}>{s.icon}</span>
                  <span style={{ fontSize:13, color:cr, lineHeight:1.3 }}>{s.title}</span>
                </span>
                <span style={{ fontSize:14, color:mu, flexShrink:0, transition:"transform 0.2s",
                  transform:open===s.k?"rotate(180deg)":"none" }}>⌄</span>
              </button>
              {open===s.k && (
                <div style={{ padding:"0 14px 16px 52px", fontSize:13, lineHeight:1.85, color:mu,
                  whiteSpace:"pre-line" }}>{s.body}</div>
              )}
            </div>
          ))}

          {/* Footer CTA */}
          <div style={{ marginTop:12, padding:"12px 14px", background:OMBRE, borderRadius:12,
            fontSize:12, color:"#000", textAlign:"center" }}>
            Come back to this any time — tap the Listening Guide in the menu.
          </div>
        </div>
      </div>
    </>
  );
}
