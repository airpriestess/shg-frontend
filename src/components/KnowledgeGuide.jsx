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
    body:"Dr David Hawkins mapped consciousness onto a numerical scale from 20 to 700+. Your dominant emotional state is your point of attraction — it determines what your reality reorganises itself to match.\n\nBelow 200 is contractive energy. Above 200 is expansive. The line between them is Courage.\n\n— Shame (20): the heaviest state. Deep self-rejection. Reality confirms worthlessness.\n— Guilt (30): self-punishment. Living in the past. Manifests more things to feel guilty about.\n— Apathy (50): the grey flatness. Nothing feels possible. The hardest state to move from because there's no energy to change with.\n— Grief (75): loss, sadness, regret. Heavy but has more energy than apathy — the sadness means something still matters.\n— Fear (100): anxiety, worry, constant threat-scanning. Manifests the thing being feared.\n— Desire (125): wanting, craving, neediness. The paradox: needy desire repels what it wants. This is why chasing doesn't work.\n— Anger (150): more energy than fear. Anger can be fuel — but reality keeps delivering things to be angry about.\n— Pride (175): false confidence, ego, defensiveness. Close to the line but still contractive.\n\n— Courage (200): the switch flips here. You can face life as it is. This is where creation begins.\n— Neutrality (250): detachment. Things are fine either way. First real freedom from outcome.\n— Willingness (310): open, optimistic, ready to grow. Things start arriving more easily here.\n— Acceptance (350): life is happening for you, not to you. Identity manifestation accelerates here.\n— Reason (400): clarity, understanding, intellect. Powerful but can overthink and block.\n— Love (500): unconditional, expansive, magnetic. The state Spoilt Goddess is calibrated to. Things arrive without effort.\n— Joy (540): bliss, serenity, effortless flow. Desires feel inevitable. Manifestation is instant here.\n— Peace (600): transcendent stillness. Beyond personal desire — everything is perfect as it is.\n— Enlightenment (700+): pure consciousness. Rare. Beyond manifestation into being.\n\nYour Analytics tab tracks your dominant state over time. Watch it climb. That IS the work. ✦ See Knowledge Guide for the daily practice." },

  { k:"hawkins-how", icon:"↑", title:"How to actually use the Hawkins scale",
    body:"Before you log a new desire in ProofOS, pause and check in honestly. Not how you want to feel — how you actually feel right now, in your body.\n\nFind the Hawkins level that matches your genuine state. You don't need to be precise — a rough match is enough. Log it in the emotion tracker.\n\nThen listen to your audio.\n\nAfter seven days, check in again. Log your current state. Over time, your Analytics tab shows the average — and that average is your actual point of attraction. Not your mood today. Your dominant operating frequency.\n\nThe practical use: if you're manifesting from Fear (100) or Desire (125), the audio is doing the heavy lifting of pulling you up. If you're logging from Courage (200) or above, your manifestations move faster because you're already in expansive energy.\n\nYou cannot fake the scale into giving you a better result. Log honestly. The shift happens through the audios, not through pretending." },

  { k:"emdr", icon:"⇄", title:"What is EMDR?",
    body:"EMDR stands for Eye Movement Desensitisation and Reprocessing. It was originally developed as a therapy for trauma, where a therapist guides a patient's eyes left and right while they recall a painful memory. The bilateral movement activates both hemispheres of the brain simultaneously, which disrupts the emotional charge attached to the memory and allows it to be reprocessed as neutral information.\n\nIn SHG audios, EMDR is replicated through bilateral audio — sound that pans left to right in a slow, rhythmic pattern through your headphones. You don't see anything. You just hear the audio moving from ear to ear. The effect is the same: both brain hemispheres activate together, old identity blocks dissolve, and the new belief installs more cleanly into the space left behind.\n\nHeadphones are required for EMDR tracks to work properly. One earbud means one hemisphere — the bilateral effect disappears." },

  { k:"reiki", icon:"◊", title:"What is Reiki in the audios?",
    body:"Reiki is an energy healing modality based on the principle that the practitioner can channel healing intention through focus and intention, which then transfers into whatever they're working on — a person, a space, or in this case, an audio recording.\n\nReshma encodes specific tracks with Reiki during the recording process. The intention is embedded in the file itself, not added as a separate layer you can hear. When you play a Reiki-encoded track, the energetic frequency of the recording is already carrying the healing intention — it transmits through the audio regardless of where you are or what device you're using.\n\nYou don't need to believe in Reiki for it to work any more than you need to believe in electricity for a light to come on. The encoding is in the file." },

  { k:"frequencies-types", icon:"◊", title:"What are the different frequencies — 432hz, 528hz, 963hz?",
    body:"These are Solfeggio frequencies — ancient tones used historically in sacred music, each associated with a specific quality of healing or activation.\n\n432hz: the harmony frequency. Said to be mathematically consistent with the natural world. Many listeners find it calming and grounding compared to standard 440hz tuning. Used in tracks focused on peace, flow, and SP/Love.\n\n528hz: the repair frequency. Known as the 'miracle tone' — associated with DNA repair, cellular coherence, and transformation at a biological level. Used in beauty, body, and identity tracks.\n\n963hz: the activation frequency. Associated with the crown chakra, awakening, and connection to higher consciousness. Used in DNAmaxxing and Sovereignmaxxing tracks where the work is at an identity or spiritual level.\n\nThe stated frequency on each track tells you what that track is tuned to. You don't need to do anything differently — the frequency is already in the audio." },

  { k:"subliminals-what", icon:"✦", title:"What are subliminals?",
    body:"Subliminals are affirmations — identity statements spoken in first person, present tense — recorded at a volume below the threshold of conscious hearing. They are layered into the music so your conscious mind registers only the sound, while your subconscious picks up the statements underneath.\n\nExamples of what might be running beneath a track: 'I am chosen. I am his first choice. Money flows to me easily. My face is my best feature. I am the version of me who already has this.'\n\nBecause the critical faculty — the part of your conscious mind that evaluates and argues with new beliefs — never registers the statements, it cannot reject them. They land directly as accepted information. Repeated daily, they overwrite the old identity." },

  { k:"subliminals-all", icon:"◈", title:"Are subliminals in all of the tracks?",
    body:"Yes. Every SHG track contains a subliminal layer, regardless of format. The melodic house tracks have them, the calm tracks have them, the Reiki tracks have them. The subliminal layer is the constant across the entire library.\n\nWhat changes is the other layers added on top — the spoken hypnosis, the binaural beats, the EMDR, the frequency. But subliminals are present in every single track, every single time you press play." },

  { k:"music-only", icon:"◐", title:"Why are some tracks music only — no vocals?",
    body:"The music-only format is the pure subliminal version. There is no spoken voice on top — just the music, with the subliminal affirmations running beneath it at sub-audible volume.\n\nThis format is ideal for: background listening while you work, study, cook, or commute, because there's no voice guiding you that you need to follow or that might distract you. The installation happens entirely through the subliminal layer while your conscious mind focuses on whatever else it's doing.\n\nIt's also the format to loop all night — no voice waking you up, just silent installation while you sleep." },

  { k:"vocals-only", icon:"◉", title:"Why do some tracks have only vocals?",
    body:"The vocal-only format is the pure hypnosis version — Reshma's voice guiding you into theta and speaking the new identity directly to you, without the melodic house production underneath.\n\nThis format is for: deep, intentional sessions where you want the full hypnotic induction without musical distraction. Best used when you can close your eyes and give it your full attention — first thing in the morning, before sleep, or during a meditation session.\n\nThe vocal version tends to be more emotionally activating because the voice is at full volume and directed entirely at you." },

  { k:"hypno-vs-sub-versions", icon:"⇌", title:"How to use the same track in both hypnosis and subliminal version",
    body:"Each desire category has tracks in different formats. Here is how to use them together for maximum effect:\n\nMorning protocol: play the vocal/hypnosis version. You've just woken up, you're in theta, your brain is fully receptive. Let the voice guide you into the new identity while you're in the most receptive state of the day. 20–30 minutes.\n\nDaytime or background: switch to the music-only version. Play it while you work, exercise, cook. Your conscious mind focuses on the task. Your subconscious keeps receiving the subliminal layer.\n\nNight protocol: loop the music-only version all night. No voice to wake you. Pure subliminal installation through delta sleep.\n\nUsing both formats for the same desire means your subconscious is receiving installation at every stage of consciousness — theta, beta, and delta. This is the accelerated protocol." },
];

const CATEGORIES = [
  { label:"Getting started", keys:["formula","when","how-long-session","how-often","state"] },
  { label:"Tracks and intentions", keys:["how-many-tracks","multiple-intentions","same-track-multiple","stop"] },
  { label:"Results", keys:["results","working","signs"] },
  { label:"The method", keys:["sats","combine","brainwaves","hyp-vs-sub","emdr","binaural","reiki","frequencies","frequencies-types"] },
  { label:"Track formats", keys:["subliminals-what","subliminals-all","music-only","vocals-only","hypno-vs-sub-versions"] },
  { label:"The scale", keys:["hawkins","hawkins-how"] },
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
