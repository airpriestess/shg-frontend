/* KnowledgeGuide, comprehensive listening guide covering every question */
import { useEffect, useState } from "react";
import { WorkWithReshma, PRODUCTS } from "./ShopGrid.jsx";

const GRAD = "linear-gradient(110deg,#F5E0A0,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B)";
const goShop = (onClose) => { try { onClose?.(); } catch {} window.dispatchEvent(new Event("shg-go-shop")); };

// A small form: saved on this device and sent to Reshma (fire-and-forget).
function AskReshma() {
  const [q, setQ] = useState("");
  const [sent, setSent] = useState(false);
  const send = () => {
    const question = q.trim(); if (!question) return;
    let email = ""; try { email = localStorage.getItem("shg_email") || ""; } catch {}
    try { const l = JSON.parse(localStorage.getItem("shg_questions") || "[]"); l.push({ question, date:new Date().toISOString() }); localStorage.setItem("shg_questions", JSON.stringify(l.slice(-200))); } catch {}
    try { fetch("https://shg-auth-worker.airpriestess.workers.dev/ask", { method:"POST", headers:{ "Content-Type":"application/json" }, body:JSON.stringify(email ? { question, email } : { question }) }).catch(() => {}); } catch {}
    setQ(""); setSent(true);
  };
  if (sent) return <div style={{ marginTop:12, padding:"12px 14px", borderRadius:12, background:"#000", color:"#F2ECE4", fontSize:15, fontWeight:300 }}>Sent. Reshma will answer you here soon.</div>;
  return (
    <div style={{ marginTop:12, display:"grid", gap:8 }}>
      <textarea id="shg-ask-q" rows={4} value={q} onChange={e=>setQ(e.target.value)} placeholder="Your question…" style={{ width:"100%", boxSizing:"border-box", border:"1px solid #000", borderRadius:12, padding:12, fontSize:15, fontFamily:"'Jost',sans-serif", fontWeight:300, background:"#fff", color:"#000", resize:"vertical" }}/>
      <button onClick={send} style={{ justifySelf:"start", background:"#000", color:"#F2ECE4", border:"none", borderRadius:999, padding:"10px 20px", fontSize:15, fontWeight:300, cursor:"pointer", fontFamily:"'Jost',sans-serif" }}>Send</button>
    </div>
  );
}

const OMBRE = "linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)";

const SECTIONS = [
  { k:"bucket-how", icon:"◈", title:"How to write your bucket list",
    body:"Write anything you want, ever. Big, small, silly, serious. A number in your account, a trip, a bag, a feeling, a person, a view from your window.\n\nKeep each one short, one line is enough. You're not setting an intention yet, you're releasing a wish.\n\nThe habit is the magic: add 10 ideas a day. The more you release, the more your brain starts noticing them around you, and some will arrive so fast it will shock you." },
  { k:"bucket-detail", icon:"◉", title:"Do I need to add lots of detail?",
    body:"No. Your bucket list is for speed, not detail. One line per wish is perfect.\n\nDetail belongs to intentions. When a wish becomes important enough to focus on, move it into Intentions, and there you describe exactly what you want in \"Add more about it\": where, who, how it feels, the details." },
  { k:"bucket-often", icon:"◐", title:"How often should I add to my bucket list?",
    body:"Every day, if you can. The goal is 10 ideas a day, and Home shows how many you've added today.\n\nIt takes two minutes: in the queue, before bed, on the train. Don't judge your ideas. Repeats are fine, and wishes can change.\n\nOnce a week, scroll back through your list. Anything that has already arrived? Mark it manifested. Anything you want to focus on? Move it to Intentions." },
  { k:"bucket-signs", icon:"✧", title:"How do I add a sign to a bucket list wish?",
    body:"Signs are logged against intentions, so if you start seeing signs for a bucket list wish, that's your cue: move it into Intentions. Then every sign you log can be linked to it.\n\nIf a bucket list wish simply arrives, open proofOS › Bucket List and mark it manifested. It goes straight to your Proof Wall, even without signs." },
  { k:"forgot-sign", icon:"◈", title:"What if I forget to log a sign?",
    body:"It's never too late. Log it when you remember and write when it happened, for example \"On Tuesday I saw…\". A late sign is still evidence.\n\nTo remember in the moment: keep the ✦ button on your Home screen, use voice so it takes five seconds, or take a photo and add it later.\n\nA nice habit: before bed, ask yourself \"What did I notice today?\" and log anything that comes up." },
  { k:"who-reshma", icon:"✦", title:"Who is Reshma Oracle?",
    body:"I'm Reshma Oracle, the founder of Self Hypnosis Goddess and the voice on every track.\n\nI'm a psychic, healer and channel. I created this brand to bring together self hypnosis, subliminals, energy work and a way to track your proof, so you don't just hope it's working, you can see it.\n\nEverything in this app, the tracks, the workbooks, the guidebook and proofOS, comes from my method." },
  { k:"reshma-psychic", icon:"◉", title:"What are Reshma's gifts?",
    body:"Claircognizant: I know things before they happen.\nClairvoyant: I see what is around you.\nRemote sensing: I feel people and places from far away.\nEnergy healer: I clear what is stuck and detox your energy.\nA channel: every track comes through me, from Source.\n\nThese are spiritual gifts, not medical or professional advice." },
  { k:"reshma-channel", icon:"◈", title:"What does \"channelled\" mean?",
    body:"The words in my tracks aren't written like a script from a template. They come through me, from Source, for the desire each track is made for.\n\nI then add the layers that help them go in: EMDR, binaural beats and isochronic tones, subliminals and Reiki." },
  { k:"reshma-youtube", icon:"▶", title:"Where else can I find Reshma?",
    body:"On my YouTube channel, where I share free tracks and videos about manifestation and self hypnosis. Many members first found me there.\n\nThe full library, proofOS and everything in this app are only here, for members." },
  { k:"why-built", icon:"◈", title:"Why did Reshma build this app?",
    body:"Because the method worked for her and for the women she worked with, and she wanted it in one place: the tracks to shift the belief, and proofOS to collect the evidence that it's working. Most people give up on manifesting because they can't see it happening. This app makes it visible." },
  { k:"reshma-approach", icon:"◐", title:"What is Reshma's approach?",
    body:"Belief first, then evidence. The tracks work on the subconscious while you relax or sleep. Then you train your attention: write the intention, notice the signs, log them, and mark what arrives. Intuition and energy work sit alongside the science, never instead of it." },
  { k:"personal-track", icon:"≈", title:"What is a Personalised Track?", shop:true,
    body:"A track made only for you. You tell me exactly what you want and what's in your way, and I create a self hypnosis track written in your words and recorded in my voice.\n\nIt's the most powerful option if your desire is very specific, or if general tracks haven't reached the belief underneath it." },
  { k:"one-to-one", icon:"◐", title:"What happens in a 1:1 session?", shop:true,
    body:"One live session with me, focused on your goals. We look at what you want, what's blocking it and what to do next. I use my intuition and energy work alongside the method in this app.\n\nYou leave with a clear plan, and you can keep tracking everything in proofOS." },
  { k:"email-coaching", icon:"✉", title:"What is Email Coaching?", shop:true,
    body:"Ongoing support from me by email. You share what's happening, your wins, your blocks and your questions, and I reply with guidance and next steps.\n\nIt's ideal if you want support over a longer stretch without booking live sessions. You'll see the current details in the Shop." },
  { k:"how-to-book", icon:"›", title:"How do I book or buy?", shop:true,
    body:"Tap the service you want in the Shop tab. Checkout happens inside the app, and you'll see the details for each option there before you pay." },
  { k:"ask-reshma", icon:"?", title:"Ask Reshma a question", ask:true,
    body:"Write your question below and send it to me. I answer inside the app. For anything deeper, a 1:1 session or Email Coaching is the best way to work with me." },
  { k:"not-medical", icon:"!", title:"Is this medical or professional advice?",
    body:"No. My tracks and guidance are spiritual support. They're not a replacement for medical, psychological or financial advice. If you're struggling, please reach out to a professional or a local support line." },

  { k:"what-hypnosis", icon:"◈", title:"What is self hypnosis?",
    body:"Hypnosis is a natural, relaxed state where your attention narrows and your critical mind steps back. You pass through it every night as you fall asleep and every morning as you wake.\n\nIn that state, your subconscious accepts new ideas without arguing. That's why a sentence like \"I am chosen\" can feel impossible when you're wide awake, but can settle in when you're relaxed.\n\nSelf hypnosis means you choose what goes in. My voice guides you into the state, then speaks the new identity as if it's already true. You stay in control the whole time. You can't get stuck, and you can open your eyes whenever you like." },
  { k:"binaural", icon:"≈", title:"What are binaural beats?",
    body:"Two tones, one in each ear, set at slightly different frequencies. Your brain hears the difference between them as a third, slow rhythm, and gradually matches it.\n\nFor example: 200 Hz in the left ear and 206 Hz in the right creates a 6 Hz rhythm, right in the theta range, the state where your guard is down.\n\nBinaural beats only work with headphones, because each ear needs its own tone." },
  { k:"isochronic", icon:"▮", title:"What are isochronic tones?",
    body:"A single tone that pulses on and off, fast and evenly. Your brain follows the pulse. It's the main tone I use, at 6.4 Hz, right in theta.\n\nUnlike binaural beats, isochronic tones work with or without headphones, which makes them great for subliminals playing in the background.\n\nAvoid tones like these if you have epilepsy." },
  { k:"solfeggio", icon:"◉", title:"What are solfeggio frequencies?",
    body:"A set of tones traditionally linked to different kinds of healing. I match each track to the frequency that fits its subject:\n\n396 Hz: releasing fear\n528 Hz: love and repair\n639 Hz: connection and relationships\n741 Hz: clarity\n852 Hz: intuition\n\nThink of them as the emotional colour of the track, working underneath everything else." },
  { k:"reiki-energy", icon:"✦", title:"What is Reiki energy in the tracks?",
    body:"Reiki is energy healing. I record almost every track with Reiki intention, so the audio carries a calm, safe energy.\n\nIts job is simple: to hold you calm while the new belief settles in. When your body feels safe, it stops resisting change.\n\nYou don't need to believe in Reiki for the track to work. Most people just notice they feel softer and lighter afterwards." },

  { k:"listen-plan", icon:"◈", title:"Your weekly listening plan",
    body:"Pick one main desire for the week. That track is your anchor.\n\nNight (main): the hypnosis version of your anchor track, as you fall asleep. Theta is strongest here, and you can loop it all night.\n\nMorning (support): the subliminal version while you get ready. Your conscious mind is busy, your subconscious is still open.\n\nDaytime (optional): subliminals for up to two other desires, in the background while you work, walk or cook.\n\nEvery day: log any sign under the intention it belongs to.\n\nAfter 7 days: look at your signs. Lots of movement? Keep going. Ready for the next desire? Make a new anchor and keep the old one as a daytime subliminal." },
  { k:"listen-multi", icon:"⇄", title:"Can I listen to several tracks at once?",
    body:"Yes, and the method matters more than the number.\n\nOne anchor at a time: one hypnosis track at night for 7 days in a row, for your most important desire. Hypnosis asks your full attention, so one is best.\n\nSubliminals can stack: they work in the background, so you can play two or three for different desires during the day.\n\nDon't switch every day: switching your night track daily means none of them gets the repetition it needs. Commit for 7 days, then decide.\n\nIf two desires are linked, for example love and self worth, you can alternate nights, but keep each one for at least 3 nights in a row." },
  { k:"hyp-sub-when", icon:"◐", title:"Hypnosis or subliminal: which, and when?",
    body:"Hypnosis: my voice guides you into a relaxed state and speaks the new identity directly. Best at night or the first 20 minutes after waking, lying down, with headphones.\n\nSubliminal: the affirmations sit under the music, below conscious hearing. Best during the day, in the background, while you do other things. You can play it at a low volume.\n\nThe simple rule: hypnosis when you can relax, subliminal when you can't." },

  { k:"listen-ritual", icon:"◈", title:"Your listening ritual, step by step",
    body:"1. Headphones on. The sound moves left to right, and your brain needs both ears to follow it.\n\n2. Pick your window. Just before sleep or the first 20 minutes after waking are best, because you're already drifting into theta.\n\n3. Get comfortable. Lie down or sit back, somewhere you won't be interrupted. Never while driving.\n\n4. Set your intention. Before you press play, think of the one desire this track is for. You don't need to force it, just name it.\n\n5. Press play and let go. You don't have to concentrate. If your mind wanders, or you fall asleep, it still works.\n\n6. Afterwards, notice. Over the next days, write down any sign, however small, in proofOS.\n\n7. Repeat for 21 days. Repetition is the method. The subconscious learns by hearing the same thing again and again, not by effort." },

  { k:"formula", icon:"◈", title:"The formula in every SHG audio",
    body:"Every track combines two things at once. My spoken self-hypnosis, the new identity, spoken as if it's already yours and subliminals layered beneath the music at a volume your conscious mind cannot hear, but your subconscious receives clearly. On top of that: melodic house, EMDR bilateral stimulation, 528hz or whichever frequency the track needs. You're not listening to a track. You're being installed with a new self-concept while you enjoy music." },

  { k:"when", icon:"◐", title:"When to listen, the best windows",
    body:"Two windows are gold. First: the hour just before sleep, you're already sliding into theta, subliminals absorb effortlessly and keep working through the night. Second: the twenty minutes just after waking, before you touch your phone, you're still in theta and completely receptive.\n\nAny other time also works: your hot girl walk, the gym, cooking, commuting. The rule is simple, press play. Your subconscious is listening even when you're not consciously focused." },

  { k:"how-long-session", icon:"⏱", title:"How long should each listening session be?",
    body:"A minimum of 20-30 minutes per session gives the audio enough time to move you through alpha and into theta. Longer is better, most tracks are 20-60 minutes by design.\n\nLooping a track all night while you sleep is one of the most effective things you can do. There is no upper limit. You cannot overdose on identity installation. The subconscious learns by repetition, not intensity." },

  { k:"how-often", icon:"◑", title:"How often to listen, daily minimum",
    body:"Once a day at minimum. Twice is better. Seven consecutive nights on the same track is the accelerated protocol.\n\nThe subconscious learns by repetition, not by occasional intensity. Thirty days of daily listening beats three hours once a week. Consistency is the entire mechanism. Think of it like brushing teeth, daily, brief, non-negotiable." },

  { k:"how-many-tracks", icon:"⇄", title:"Can I mix between tracks? How many at once?",
    body:"Yes. You can listen to different tracks on different days or at different times of day. There is no conflict.\n\nA practical approach: use one track per desire category as your primary and layer in others. For example: Money Finds Me First overnight, Spoilt Goddess in the morning. They don't cancel each other out, your subconscious is processing all of it.\n\nWhat to avoid: switching tracks constantly without giving any single one enough repetitions to take hold. Give each track at least 7 consecutive days before you assess whether it's shifting something." },

  { k:"multiple-intentions", icon:"", title:"Can I have multiple intentions at once?",
    body:"Yes. You can hold multiple desires simultaneously, love, money, appearance, business, all at once. The subconscious is not linear. It does not process one thing at a time.\n\nIn ProofOS, open a separate thread for each desire. Each thread links to its own audio. You can listen to different tracks for different desires and log signs separately for each one.\n\nThe only caution: if you're new, start with your most burning desire first. Give it weight. Then add others. Not because multiple desires conflict, they don't, but because your emotional investment needs to be real for the installation to take hold." },

  { k:"same-track-multiple", icon:"◉", title:"Can I use one track for multiple intentions?",
    body:"Yes. A track like Money Finds Me First installs a money identity, but that identity bleeds into everything. Confidence, self-worth, authority. You don't need a separate track for every nuance of the same category.\n\nYou can also set multiple desires in ProofOS that all link to the same audio if they're in the same category. The track's core identity upgrade covers all of them." },

  { k:"results", icon:"↑", title:"When can I expect to see results?",
    body:"Signs typically begin within 3-7 days. Not the full manifestation, signs. A text out of nowhere. Money arriving from somewhere unexpected. A compliment about something you were just listening about. These are evidence the identity is shifting.\n\nThe full manifestation timeline varies. Some desires arrive in days. Some take 30-90 days. The ones that take longer are usually bigger identity gaps, the distance between who you currently believe you are and who the track is installing.\n\nThe variable is not the audio. The variable is how often you listen and whether you log signs as they arrive. Signs logged = subconscious confirmation that the shift is real = faster movement." },

  { k:"working", icon:"◊", title:"How do I know it's working?",
    body:"In order of reliability:\n\n1. Signs and synchronicities, things appearing that match your intention before it has fully arrived. Log these immediately.\n2. Emotional shift, you stop feeling desperate about the desire. It starts feeling like it's already on its way.\n3. Behavioural shift, you act differently without deciding to. You speak differently. You stop checking your phone waiting for him to text.\n4. External confirmation, people comment on something different about you. Opportunities arrive.\n5. The desire feels boring, this sounds counterintuitive but it's the biggest indicator. When something stops feeling urgent and starts feeling like a given, it's installed.\n\nIf you feel nothing and see nothing after 14 days of daily listening: increase frequency and check whether you're actually in a relaxed state when you listen." },

  { k:"stop", icon:"◈", title:"When to stop listening to a track",
    body:"Never stop a track because you're bored of it. Boredom is your conscious mind, your subconscious is still receiving.\n\nStop a track, or retire it, when the desire has fully manifested and been logged in ProofOS. Even then, some people keep the track running as maintenance.\n\nIf a track triggers emotional resistance, not boredom, but actual discomfort, that's actually a sign it's hitting a real block. Don't stop. Lean in. The resistance is where the old belief is sitting." },

  { k:"sats", icon:"✧", title:"What is SATS, State Akin To Sleep?",
    body:"SATS is a term from Neville Goddard's work. It stands for State Akin To Sleep, the hypnagogic threshold between waking and sleep where the subconscious is most receptive.\n\nIn SATS, your conscious mind relaxes its guard. New beliefs, scenes and identities bypass the critical faculty and go directly into the subconscious as accepted fact.\n\nEvery SHG audio is designed to be listened to in SATS, the moment you're dropping into sleep, or just after you wake. This is why the nighttime protocol is so effective. The audio carries you into SATS and installs while you're there. You don't need to do anything else. Just press play and close your eyes." },

  { k:"combine", icon:"⇌", title:"Can I combine SHG with other methods?",
    body:"Yes. SHG is not exclusive. You can combine with:\n\n, Scripting / journalling (writing in present tense as if it's done)\n, Visualisation (seeing and feeling the end result)\n, Affirmations (especially right after listening when you're still in theta)\n, The 369 method, 555 method, or any other protocol\n, Therapy, coaching, or other personal development work\n\nThe audio accelerates everything else because it operates at the subconscious level, the level everything else is trying to reach. It's not in competition with other methods. It's the deepest layer they all sit on top of." },

  { k:"brainwaves", icon:"◒", title:"Brainwave states, plain English",
    body:"Beta (14-30 Hz): awake, thinking, scrolling. Critical faculty is fully active. Hard to install new beliefs here.\n\nAlpha (8-13 Hz): relaxed, daydreaming, right after you close your eyes. First layer of receptivity.\n\nTheta (4-8 Hz): the doorway to the subconscious, the state just before sleep and just after waking. This is where installation happens. Your critical faculty is offline. New beliefs are accepted as fact.\n\nDelta (0.5-4 Hz): deep sleep, subliminals keep working here. This is why overnight listening is so powerful.\n\nSHG audios are designed to guide you from alpha into theta and hold you there." },

  { k:"hyp-vs-sub", icon:"◈", title:"Hypnosis vs subliminal, the difference",
    body:"Hypnosis: my voice speaking directly to you at volume, guiding you into theta and installing new identity statements consciously and subconsciously at the same time.\n\nSubliminal: affirmations recorded beneath the music, below the threshold of conscious hearing. Your ears pick them up. Your subconscious accepts them without your conscious mind arguing.\n\nIn SHG audios both run simultaneously, that's why you don't need to 'try' to believe the statements. The conscious layer hears the music. The subconscious receives the installation. You just have to play it." },

  { k:"frequencies", icon:"◊", title:"528hz, EMDR, binaural, what each does",
    body:"528hz: the repair frequency, tuned to promote cellular coherence and DNA-level alignment while you rest.\n\nEMDR bilateral audio: pans left-right in a slow rhythm, mirroring REM eye movement and dissolving stuck patterns and old beliefs at the root. This is the same mechanism used in trauma therapy.\n\nBinaural beats: two slightly different tones in each ear, your brain generates a third tone that pulls it into theta or delta. Requires headphones.\n\nReiki-encoded: tracks recorded with healing intention embedded in the audio itself, raising the energetic frequency of the file.\n\n963hz (where used): the frequency of activation, used in DNA and sovereignty tracks." },

  { k:"state", icon:"◉", title:"How to get yourself into the right state",
    body:"You don't need to try. Press play. Get comfortable. Close your eyes if you want.\n\nIf your mind wanders, let it, the audio does the work regardless of whether you're consciously following it. Fighting your thoughts keeps you in beta. Letting them pass drops you into theta.\n\nThe music is specifically designed to carry you down. You don't earn the results by concentrating harder. You earn them by pressing play more often." },

  { k:"signs", icon:"✧", title:"Capturing signs and synchronicities",
    body:"A sign is anything that catches your attention twice in a short window, or once, in a way that stops you. Seeing his name, hearing your amount, spotting the number, a dream, a random compliment, someone using your exact affirmation as a phrase, a refund, a text out of nowhere.\n\nIf it made you pause, log it. Screenshot it. Voice-note it. Don't filter for 'relevant.'\n\nWhy logging matters: every sign you log is evidence the shift is happening. Evidence rewires the subconscious faster than any affirmation. Come back and log one thing today, even if it seems small. The accumulation is the proof." },

  { k:"hawkins", icon:"↑", title:"The Hawkins scale, your point of attraction",
    body:"Dr David Hawkins mapped consciousness onto a numerical scale from 20 to 700+. Your dominant emotional state is your point of attraction, it determines what your reality reorganises itself to match.\n\nBelow 200 is contractive energy. Above 200 is expansive. The line between them is Courage.\n\n, Shame (20): the heaviest state. Deep self-rejection. Reality confirms worthlessness.\n, Guilt (30): self-punishment. Living in the past. Manifests more things to feel guilty about.\n, Apathy (50): the grey flatness. Nothing feels possible. The hardest state to move from because there's no energy to change with.\n, Grief (75): loss, sadness, regret. Heavy but has more energy than apathy, the sadness means something still matters.\n, Fear (100): anxiety, worry, constant threat-scanning. Manifests the thing being feared.\n, Desire (125): wanting, craving, neediness. The paradox: needy desire repels what it wants. This is why chasing doesn't work.\n, Anger (150): more energy than fear. Anger can be fuel, but reality keeps delivering things to be angry about.\n, Pride (175): false confidence, ego, defensiveness. Close to the line but still contractive.\n\n, Courage (200): the switch flips here. You can face life as it is. This is where creation begins.\n, Neutrality (250): detachment. Things are fine either way. First real freedom from outcome.\n, Willingness (310): open, optimistic, ready to grow. Things start arriving more easily here.\n, Acceptance (350): life is happening for you, not to you. Identity manifestation accelerates here.\n, Reason (400): clarity, understanding, intellect. Powerful but can overthink and block.\n, Love (500): unconditional, expansive, magnetic. The state Spoilt Goddess is calibrated to. Things arrive without effort.\n, Joy (540): bliss, serenity, effortless flow. Desires feel inevitable. Manifestation is instant here.\n, Peace (600): transcendent stillness. Beyond personal desire, everything is perfect as it is.\n, Enlightenment (700+): pure consciousness. Rare. Beyond manifestation into being.\n\nYour Analytics tab tracks your dominant state over time. Watch it climb. That IS the work.  See Guidebook for the daily practice." },

  { k:"hawkins-how", icon:"↑", title:"How to actually use the Hawkins scale",
    body:"Before you log a new desire in ProofOS, pause and check in honestly. Not how you want to feel, how you actually feel right now, in your body.\n\nFind the Hawkins level that matches your genuine state. You don't need to be precise, a rough match is enough. Log it in the emotion tracker.\n\nThen listen to your audio.\n\nAfter seven days, check in again. Log your current state. Over time, your Analytics tab shows the average and that average is your actual point of attraction. Not your mood today. Your dominant operating frequency.\n\nThe practical use: if you're manifesting from Fear (100) or Desire (125), the audio is doing the heavy lifting of pulling you up. If you're logging from Courage (200) or above, your manifestations move faster because you're already in expansive energy.\n\nYou cannot fake the scale into giving you a better result. Log honestly. The shift happens through the audios, not through pretending." },

  { k:"emdr", icon:"⇄", title:"What is EMDR?",
    body:"EMDR stands for Eye Movement Desensitisation and Reprocessing. It was originally developed as a therapy for trauma, where a therapist guides a patient's eyes left and right while they recall a painful memory. The bilateral movement activates both hemispheres of the brain simultaneously, which disrupts the emotional charge attached to the memory and allows it to be reprocessed as neutral information.\n\nIn SHG audios, EMDR is replicated through bilateral audio, sound that pans left to right in a slow, rhythmic pattern through your headphones. You don't see anything. You just hear the audio moving from ear to ear. The effect is the same: both brain hemispheres activate together, old identity blocks dissolve and the new belief installs more cleanly into the space left behind.\n\nHeadphones are required for EMDR tracks to work properly. One earbud means one hemisphere, the bilateral effect disappears." },

  { k:"reiki", icon:"◊", title:"What is Reiki in the audios?",
    body:"Reiki is an energy healing modality based on the principle that the practitioner can channel healing intention through focus and intention, which then transfers into whatever they're working on, a person, a space, or in this case, an audio recording.\n\nReshma encodes specific tracks with Reiki during the recording process. The intention is embedded in the file itself, not added as a separate layer you can hear. When you play a Reiki-encoded track, the energetic frequency of the recording is already carrying the healing intention, it transmits through the audio regardless of where you are or what device you're using.\n\nYou don't need to believe in Reiki for it to work any more than you need to believe in electricity for a light to come on. The encoding is in the file." },

  { k:"frequencies-types", icon:"◊", title:"What are the different frequencies, 432hz, 528hz, 963hz?",
    body:"These are Solfeggio frequencies, ancient tones used historically in sacred music, each associated with a specific quality of healing or activation.\n\n432hz: the harmony frequency. Said to be mathematically consistent with the natural world. Many listeners find it calming and grounding compared to standard 440hz tuning. Used in tracks focused on peace, flow and SP/Love.\n\n528hz: the repair frequency. Known as the 'miracle tone', associated with DNA repair, cellular coherence and transformation at a biological level. Used in beauty, body and identity tracks.\n\n963hz: the activation frequency. Associated with the crown chakra, awakening and connection to higher consciousness. Used in DNAmaxxing and Sovereignmaxxing tracks where the work is at an identity or spiritual level.\n\nThe stated frequency on each track tells you what that track is tuned to. You don't need to do anything differently, the frequency is already in the audio." },

  { k:"subliminals-what", icon:"", title:"What are subliminals?",
    body:"Subliminals are affirmations, identity statements spoken in first person, present tense, recorded at a volume below the threshold of conscious hearing. They are layered into the music so your conscious mind registers only the sound, while your subconscious picks up the statements underneath.\n\nExamples of what might be running beneath a track: 'I am chosen. I am his first choice. Money flows to me easily. My face is my best feature. I am the version of me who already has this.'\n\nBecause the critical faculty, the part of your conscious mind that evaluates and argues with new beliefs, never registers the statements, it cannot reject them. They go in directly as accepted information. Repeated daily, they overwrite the old identity." },

  { k:"subliminals-all", icon:"◈", title:"Are subliminals in all of the tracks?",
    body:"Yes. Every SHG track contains a subliminal layer, regardless of format. The melodic house tracks have them, the calm tracks have them, the Reiki tracks have them. The subliminal layer is the constant across the entire library.\n\nWhat changes is the other layers added on top, the spoken hypnosis, the binaural beats, the EMDR, the frequency. But subliminals are present in every single track, every single time you press play." },

  { k:"music-only", icon:"◐", title:"Why are some tracks music only, no vocals?",
    body:"The music-only format is the pure subliminal version. There is no spoken voice on top, just the music, with the subliminal affirmations running beneath it at sub-audible volume.\n\nThis format is ideal for: background listening while you work, study, cook, or go on your hot girl walk, no voice to follow or that might distract you. The installation happens entirely through the subliminal layer while your conscious mind focuses on whatever else it's doing.\n\nIt's also the format to loop all night, no voice waking you up, just silent installation while you sleep." },

  { k:"vocals-only", icon:"◉", title:"Why do some tracks have only vocals?",
    body:"The vocal-only format is the pure hypnosis version, Reshma's voice guiding you into theta and speaking the new identity directly to you, without the melodic house production underneath.\n\nThis format is for: deep, intentional sessions where you want the full hypnotic induction without musical distraction. Best used when you can close your eyes and give it your full attention, first thing in the morning, before sleep, or during a meditation session.\n\nThe vocal version tends to be more emotionally activating because the voice is at full volume and directed entirely at you." },

  { k:"hypno-vs-sub-versions", icon:"⇌", title:"How to use the same track in both hypnosis and subliminal version",
    body:"Each desire category has tracks in different formats. Here is how to use them together for maximum effect:\n\nMorning protocol: play the vocal/hypnosis version. You've just woken up, you're in theta, your brain is fully receptive. Let the voice guide you into the new identity while you're in the most receptive state of the day. 20-30 minutes.\n\nDaytime or background: switch to the music-only version. Play it while you work, exercise, cook. Your conscious mind focuses on the task. Your subconscious keeps receiving the subliminal layer.\n\nNight protocol: loop the music-only version all night. No voice to wake you. Pure subliminal installation through delta sleep.\n\nUsing both formats for the same desire means your subconscious is receiving installation at every stage of consciousness, theta, beta and delta. This is the accelerated protocol." },

  { k:"proof-wall-forever", icon:"", title:"Your Proof Wall is for life, never lose a manifestation again", isNew:true,
    body:"Every manifestation you log stays on your Proof Wall permanently, not for a month, not until you clear your history, forever. This is the whole point.\n\nMost people manifest things constantly and never realise it, because they don't write it down. A win happens, life moves on and a few months later when doubt creeps back in, there's nothing to point to. The evidence existed, it just wasn't kept anywhere.\n\nYour Proof Wall replaces that gap entirely. Every intention shows exactly when you added it and exactly when it manifested, so you can see, in black and white, how long it actually took. Some things take two days. Some take months. There's no average that means anything, because it depends entirely on the desire, but seeing your own real timeline, across everything you've ever manifested, is the actual point. It becomes undeniable. This isn't a journal you'll lose or a note you'll forget to reread. It's permanent, dated proof that this works, built by you, for you, for as long as you use the app." },

  { k:"bucket-vs-active", icon:"◈", title:"Bucket list vs active intentions", isNew:true,
    body:"ProofOS has two different lists and they're not the same thing.\n\nYour Bucket List is everything you want to manifest, ever, no limit, no pressure. Write something down the second it occurs to you. No category needed, no audio needed, no commitment. It's just a place to capture desires before you forget them, the way you'd jot something in your notes app. A holiday, a number in your bank account, a relationship, a body you want, a job, all of it goes here first.\n\nActive is different. This is where you're actually focusing your energy right now, the desires you've chosen to work on deliberately, with audio, with a Hawkins state logged before and after, with signs being tracked. We recommend keeping this list to around 5-10 at a time. Not because there's a hard limit, but because trying to actively manifest fifty things at once spreads your energy so thin that none of them get the focus they need. Depth beats breadth here.\n\nHere's the method: keep adding to your Bucket List constantly, with no filter. Then, when you're ready to actually focus, open your Bucket List and promote a handful of items into Active, that's when you pick a category and get a track suggested. Everything else stays in your Bucket List, waiting, still valid, still yours. Nothing is lost by not focusing on it yet.\n\nAnd here's the part most people miss: you can mark a Bucket List item as manifested without it ever becoming Active. Sometimes the act of writing a desire down clearly, once, is enough, you don't always need the audio to manifest something. If it happens, mark it. Your Proof Wall doesn't care which list it came from." },

  { k:"how-to-write-intention", icon:"✧", title:"How to write a good intention in ProofOS",
    body:"A good intention is specific, present-tense and describes the outcome, not the process of getting there.\n\nWeak: \"I want to feel better about money.\"\nStrong: \"Money finds me easily and consistently, without me having to chase it.\"\n\nWeak: \"I hope he texts me.\"\nStrong: \"He texts me first, consistently, without me reaching out.\"\n\nThree things every good intention has: it names the exact outcome you want, it's written as if it's already becoming true rather than something you're waiting for and it's specific enough that you'd actually recognise it when it happens. Vague intentions get vague evidence. Specific intentions get specific proof." },

  { k:"choosing-your-emotion", icon:"◑", title:"How to choose your emotional state when logging an intention",
    body:"When you log a new intention, you're asked how you're feeling right now, this uses the Hawkins scale (see the sections above on what it is and how to use it).\n\nBe honest, not aspirational. If you're anxious, log anxious, don't log \"peace\" because that's what you're aiming for. The whole point of tracking is to see the real starting point so the shift is actually visible later. There's no wrong answer here. Contractive states (below 200) aren't a failure, they're just where you're starting from and the audio is built to move you out of them.\n\nIf you genuinely don't know what you're feeling, pick the closest match rather than skipping it. A rough guess logged consistently is more useful than a perfect answer logged never." },

  { k:"spotting-signs", icon:"", title:"How to spot a sign or synchronicity worth logging", isNew:true,
    body:"A sign is anything that feels like a nudge toward your intention, even a small one. You don't need to wait for the full manifestation to log something.\n\nWhat counts: a coincidence that's slightly too on-the-nose to ignore, a conversation that circles back to your exact desire, a number or name showing up repeatedly, a feeling of \"that's strange\" when something lines up with what you asked for, a small version of the thing itself arriving before the whole thing does.\n\nDon't overthink it, if it made you pause, log it. The habit of noticing and logging is what trains you to actually see the evidence building, instead of missing it because you weren't looking. Signs add up. That's the entire mechanism behind the Proof Wall." },


  { k:"headphones", icon:"🎧", title:"Do I need headphones?",
    body:"For binaural beats and EMDR tracks: yes, headphones are required. Both effects depend on each ear receiving a different signal, one earbud removes the bilateral effect entirely.\n\nFor subliminal and melodic house tracks without binaural: speakers work fine. The subliminals are embedded in the audio itself and don't rely on stereo separation.\n\nA simple rule: if the track is labelled Binaural or EMDR, put both headphones in. For everything else, do whatever's comfortable." },

  { k:"focus", icon:"◐", title:"Do I need to focus or pay attention while listening?",
    body:"No. You don't need to concentrate, follow the words, or try to believe anything. The audio does the work whether or not your conscious mind is engaged.\n\nIn fact, trying too hard to listen keeps you in beta, the alert, analytical state, which is exactly what you want to move out of. The most receptive sessions are the ones where you've half-forgotten you're listening. Let your mind wander. Let yourself drift. That's theta." },

  { k:"fell-asleep", icon:"◑", title:"What if I fall asleep while listening?",
    body:"Good. That's the protocol.\n\nWhen you cross from theta into delta (deep sleep), your conscious mind switches off completely and the subliminals keep running. Your subconscious doesn't sleep. It processes everything it hears all night. Falling asleep while listening is not a waste of the session, it's the deepest version of it.\n\nIf you consistently fall asleep before the track ends, loop it. Let it play all night. That's not too much. That's the accelerated protocol." },

  { k:"believe", icon:"", title:"Do I need to believe it will work?",
    body:"No. That's the entire point of subliminals and hypnosis, they bypass the part of your mind that decides what to believe.\n\nAffirmations fail for most people because the conscious mind rejects them the moment they're said out loud. 'I am rich' while checking a negative balance, the critical faculty laughs and the affirmation bounces off.\n\nWith SHG, the installation happens below that layer. You don't need to agree with the statement for your subconscious to receive it. You don't need to feel it yet. The only requirement is pressing play." },

  { k:"therapy", icon:"◊", title:"Can I use this alongside therapy or medication?",
    body:"Yes and it's designed to complement both, not replace them.\n\nSHG operates at the identity and belief level. Therapy operates at the processing and insight level. Medication supports neurochemistry. None of these conflict with each other. If anything, the audio accelerates therapy by doing the subconscious installation between sessions that therapy often can't reach in the session itself.\n\nIf you're under the care of a mental health professional, keep going. SHG is not a substitute for professional mental health support. It's an additional layer and for many people, a significant one." },

  { k:"emotional", icon:"↑", title:"What if listening makes me emotional?",
    body:"That's completely normal and usually a good sign.\n\nWhen a track reaches a place that carries an old wound, it can bring up grief, anger, or unexpected sadness. This is not the audio hurting you. This is it hitting a real block, the old belief that needs to dissolve before the new one can take hold.\n\nLet it come up. Don't stop the track. Cry if you need to. The emotion is the old identity releasing. What comes after it, usually within the same session or the day after, is often a noticeable lightness and a faster movement toward the desire.\n\nIf you're finding certain tracks consistently activating in a way that feels too much, try the subliminal-only version of the same category first. Less direct, same installation." },

  { k:"visualization", icon:"✧", title:"Can I do visualisation while listening?",
    body:"Yes and it amplifies the installation significantly.\n\nThe ideal sequence: press play, close your eyes, let the audio carry you into theta and once you feel relaxed (usually 5-10 minutes in), bring up the end result of your desire as an image or a feeling. Don't watch it like a movie, be inside it. Feel it as if it's already done.\n\nYou don't need to maintain the visualisation for the whole session. Even 2-3 minutes of clear, felt end-result imagery while in theta is far more effective than the same visualisation attempted in beta while sitting at a desk.\n\nIf your mind wanders from the image, let it. The subliminals and audio are still working. The visualisation is an add-on, not a requirement." },

  { k:"one-method", icon:"◈", title:"Should I stick to one method or combine everything?",
    body:"SHG is designed to be a complete system on its own. You don't need to add anything else for it to work.\n\nIf you want to layer in other practices, journalling, scripting, visualisation, affirmations, go ahead. They don't conflict. But if you're already doing SHG daily and trying to do five other methods alongside it, you may be overcomplicating something that works better when you trust it and leave it alone.\n\nThe most effective approach for most people: one track per desire, daily, consistently. Everything else is optional." },

  { k:"tell-anyone", icon:"◉", title:"Should I tell anyone what I'm manifesting?",
    body:"No.\n\nThis is not superstition, it's psychology. The moment you verbalise a desire to someone else, your brain starts managing their reaction to it instead of moving toward the outcome. If they doubt you, you absorb that doubt. If they ask questions, you go into explanation mode. If they dismiss it, you spend energy defending something that didn't need defending.\n\nThe more uncertain you feel about a desire, the bigger the identity gap between who you are now and who you'd have to be to have it, the more important it is to keep it private. Silence is protection. It keeps your belief intact.\n\nThe rule: the more delusional the desire feels, the fewer people who should know about it. Your most audacious intentions are the ones to hold closest. Only share a desire once it's manifested and then only with people who can celebrate it without needing to understand how it happened.\n\nTell the Proof Wall. Not the group chat." },

  { k:"not-working", icon:"↑", title:"What if nothing is happening after a week?",
    body:"First question: are you listening every day? Not most days, every day. A week of daily listening is genuinely the minimum before drawing conclusions.\n\nSecond question: are you logging signs? If you're not logging, you're not noticing. Signs arrive before the full manifestation and they're easy to dismiss as coincidence. Start logging everything that pauses you, even slightly.\n\nThird question: what does your dominant emotional state look like? If you're logging signs from Fear or Desire (below 200), the audio is lifting you but the contractive energy is slowing the movement. That's not a reason to stop, it's a reason to keep going.\n\nFourth question: are you attached to the outcome arriving in a specific way or by a specific time? Attachment keeps the energy locked in your hands. The shift from wanting to knowing is the real movement. Listen daily. Log honestly. Let go of the timeline." },

  { k:"multiple-desires", icon:"⇄", title:"Should I focus on one desire or work on several?",
    body:"Both work. Here is the practical framework:\n\nIf you're new, start with one. Your most burning desire, the one you feel the most about. Give it everything for 30 days. Build the habit. Build the evidence. Then add more.\n\nIf you have multiple desires across different categories, love, money, appearance, they don't compete with each other. Your subconscious is not single-threaded. You can listen to one track in the morning and another at night and both install separately.\n\nThe mistake to avoid: rotating through 10 different tracks with no consistency on any of them. Pick 2-3 at most for any given month, rotate the listening windows (morning/night) and give each track enough repetitions to take hold." },

  { k:"proofos-not-journal", icon:"◈", title:"Is ProofOS a journal?",
    body:"No and that's intentional.\n\nA journal is for processing. ProofOS is for evidence. The difference is significant.\n\nJournalling is valuable but it's not what ProofOS is for. ProofOS is a structured record of: what you want, the signs that it's coming and the proof when it arrives. It's a receipts system, not a feelings system.\n\nYou don't write about your day in ProofOS. You don't process your emotions in ProofOS (that's what the Hawkins log is for, brief, honest, one-line). You log intentions, you log signs, you log manifestations. Short, specific, dated.\n\nThe reason ProofOS isn't a journal is because journals become something to maintain. A record of receipts becomes something you can't stop adding to, because you keep getting evidence." },

  { k:"knowing-manifested", icon:"↑", title:"How to know when something has actually manifested",
    body:"Mark an intention as manifested when the actual outcome has happened, not a sign pointing toward it, the real thing. If your intention was \"he texts me first,\" the manifestation is the text arriving, not the dream about him or the feeling that it's close.\n\nIt's fine to have multiple signs logged under an intention for weeks before it manifests, that's normal and expected. The signs are the trail, the manifestation is the destination. When you mark something manifested, you're also asked how you feel now, this is what lets you see your own before/after, side by side, permanently, on your Proof Wall." },

];


// Elegant line icons in the workbook style: soft ombre halo, dotted gradient
// ring, thin gradient strokes. One per Guidebook topic.
const GI = {
  listen: '<path d="M30 56v-6a20 20 0 0 1 40 0v6"/><rect x="26" y="54" width="10" height="16" rx="4"/><rect x="64" y="54" width="10" height="16" rx="4"/>',
  intentions: '<circle cx="50" cy="50" r="18"/><circle cx="50" cy="50" r="8"/><path d="M50 24v8M50 68v8M24 50h8M68 50h8"/>',
  signs: '<path d="M50 28 C52 44 56 48 72 50 C56 52 52 56 50 72 C48 56 44 52 28 50 C44 48 48 44 50 28 Z"/><path d="M70 30l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/>',
  proof: '<rect x="32" y="28" width="36" height="44" rx="4"/><path d="M41 52l6 6 12-13"/>',
  bucket: '<path d="M36 34h28l-3 38H39z"/><path d="M32 34h36"/><path d="M43 46h14M43 55h14M43 64h8"/>',
  start: '<circle cx="50" cy="50" r="20"/><path d="M58 42l-5 12-11 4 5-12z"/>',
  tracks: '<path d="M30 50v0M36 44v12M42 38v24M48 32v36M54 40v20M60 36v28M66 44v12M72 48v4"/>',
  mechanism: '<path d="M50 30c-10 0-16 6-16 14 0 5 3 8 3 12s-3 6-3 10h32c0-4-3-6-3-10s3-7 3-12c0-8-6-14-16-14z"/><path d="M50 30v36"/>',
  results: '<path d="M30 70h40"/><rect x="34" y="54" width="7" height="16" rx="2"/><rect x="46.5" y="44" width="7" height="26" rx="2"/><rect x="59" y="32" width="7" height="38" rx="2"/>',
  hawkins: '<path d="M36 72V28M36 34h24M36 46h20M36 58h14"/><circle cx="64" cy="34" r="3"/>',
  guide: '<path d="M50 34c-6-4-14-5-20-4v36c6-1 14 0 20 4 6-4 14-5 20-4V30c-6-1-14 0-20 4z"/><path d="M50 34v36"/>',
};
export function GuideIcon({ size = 64 }) {
  // One elegant icon for every topic: the two circles from the 1:1 Session cover.
  return <img src="/icons/session.webp" alt="" aria-hidden="true" width={size} height={size} style={{ flexShrink:0, display:"block", borderRadius:"50%" }}/>;
}
const CAT_ICON = { "About Reshma":"guide","Extra support":"guide", "How to listen":"listen","Intentions":"intentions","Signs & synchronicities":"signs","Proof":"proof","Bucket List":"bucket","Getting started":"start","Tracks & listening":"tracks","The mechanism":"mechanism","Results & troubleshooting":"results","The Hawkins Scale":"hawkins" };

// Slides from the Inside Your Brain method deck, shown above each topic's answers.
const SLIDES = {
  "How to listen": ["when-to-listen","twice-a-day","short-tracks","repetition","every-listen"],
  "The mechanism": ["audio-formula","brainwaves","hypnosis-brain","affirmation-brain","emdr","tones","subliminals","reiki","identity-shift"],
  "Intentions": ["intention-to-manifestation","intention-list"],
  "Signs & synchronicities": ["signs-synchronicity","what-counts","signs-stories","why-222","read-a-sign","ask-for-sign","signs-build"],
  "Proof": ["hope-or-evidence","why-track","listen-notice-log","what-you-track","proof-chart"],
  "Bucket List": ["bucket-list"],
  "Extra support": ["path-with-me","why-work","track-for-you"],
  "The Hawkins Scale": ["hawkins-scale"],
};

const CATEGORIES = [
  { label:"How to listen", keys:["listen-ritual","listen-plan","listen-multi","hyp-sub-when","headphones","when","how-long-session","how-often","focus","fell-asleep","stop"] },
  { label:"Intentions", keys:["how-to-write-intention","choosing-your-emotion","multiple-intentions","multiple-desires","same-track-multiple"] },
  { label:"Signs & synchronicities", keys:["spotting-signs","signs","forgot-sign"] },
  { label:"Proof", keys:["knowing-manifested","proof-wall-forever","proofos-not-journal"] },
  { label:"Bucket List", keys:["bucket-how","bucket-vs-active","bucket-detail","bucket-often","bucket-signs"] },
  { label:"Getting started", keys:["formula","believe","state"] },
  { label:"Tracks & listening", keys:["how-many-tracks","hyp-vs-sub","music-only","vocals-only","hypno-vs-sub-versions","frequencies","frequencies-types","reiki"] },
  { label:"The mechanism", keys:["what-hypnosis","brainwaves","binaural","isochronic","solfeggio","reiki-energy","sats","emdr","subliminals-what","subliminals-all","visualization","one-method","therapy","emotional"] },
  { label:"Results & troubleshooting", keys:["results","working","not-working","tell-anyone"] },
  { label:"The Hawkins Scale", keys:["hawkins","hawkins-how"] },
  { label:"About Reshma", keys:["who-reshma","why-built","reshma-approach","reshma-psychic","reshma-channel","reshma-youtube","not-medical"] },
  { label:"Extra support", keys:["personal-track","one-to-one","email-coaching","how-to-book","ask-reshma"] },
];

export default function KnowledgeGuide({ onClose, start = null }) {
  // Home screen: one big block per topic. Tapping a block opens that topic on its own page.
  const [cat, setCat] = useState(start?.key ? (CATEGORIES.find(c => c.keys.includes(start.key))?.label || null) : (start?.cat || null));
  const [open, setOpen] = useState(start?.key || null);
  const PAPER = { backgroundColor:"#F2ECE4", backgroundImage:"linear-gradient(rgba(191,165,216,.35) 1px,transparent 1px),linear-gradient(90deg,rgba(191,165,216,.35) 1px,transparent 1px)", backgroundSize:"22px 22px", color:"#000" };
  const visibleSections = SECTIONS.filter(s => CATEGORIES.find(c => c.label === cat)?.keys.includes(s.k));

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label="Guidebook" className="shg-no-paper" style={{ position:"fixed", inset:0, zIndex:1300, background:"#000", color:"#F2ECE4", overflowY:"auto", WebkitOverflowScrolling:"touch", overscrollBehavior:"contain", fontFamily:"'Jost',sans-serif", fontWeight:300 }}>
      <div style={{ maxWidth:720, margin:"0 auto", padding:"calc(env(safe-area-inset-top,0px) + 16px) 16px 60px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          {cat
            ? <button onClick={()=>{ setCat(null); setOpen(null); }} style={{ background:"none", border:"1px solid #F2ECE4", color:"#F2ECE4", borderRadius:999, padding:"8px 16px", fontSize:15, cursor:"pointer", fontFamily:"inherit" }}>‹ Guidebook</button>
            : <span style={{ fontSize:28, fontWeight:400 }}>Guidebook</span>}
          <button onClick={onClose} aria-label="Close guidebook" style={{ background:"none", border:"1px solid #F2ECE4", color:"#F2ECE4", borderRadius:999, padding:"8px 16px", fontSize:15, cursor:"pointer", fontFamily:"inherit" }}>Close</button>
        </div>

        {!cat ? (
          <><style>{`body .shg-kg.shg-kg{display:grid!important;flex-direction:initial!important;grid-template-columns:1fr 1fr!important;gap:10px}@media(min-width:700px){body .shg-kg.shg-kg{grid-template-columns:repeat(3,1fr)!important}}`}</style><div className="shg-kg">
            {CATEGORIES.map(c => (
              <button key={c.label} onClick={()=>setCat(c.label)} style={{ background:"#000", color:"#F2ECE4", border:"1px solid transparent", boxShadow:"0 0 18px rgba(191,165,216,.25)", backgroundImage:"linear-gradient(#000,#000),linear-gradient(110deg,#F5E0A0,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B)", backgroundOrigin:"border-box", backgroundClip:"padding-box,border-box", borderRadius:16, minHeight:72, textAlign:"center", alignItems:"center", padding:"14px 12px", cursor:"pointer", fontFamily:"inherit", display:"flex", flexDirection:"column", justifyContent:"center" }}>
                <GuideIcon k={CAT_ICON[c.label]} size={60}/><span style={{ fontSize:15, fontWeight:300, letterSpacing:".03em", lineHeight:1.25, marginTop:8, background:"linear-gradient(90deg,#F5E0A0,#E8B870 22%,#BFA5D8 52%,#2CB7A7 80%,#167A6B)", WebkitBackgroundClip:"text", backgroundClip:"text", color:"transparent" }}>{c.label}</span>
                
              </button>
            ))}
          </div></>
        ) : (
          <>
            <div style={{ fontSize:26, fontWeight:400, marginBottom:16 }}>{cat}</div>
            {(SLIDES[cat] || []).length > 0 && (
              <div style={{ display:"grid", gap:12, marginBottom:18 }}>
                {SLIDES[cat].map(n => <img key={n} src={`/deck/${n}.webp`} alt="" loading="lazy" style={{ width:"100%", aspectRatio:"16/9", borderRadius:14, display:"block", border:"1px solid rgba(242,236,228,0.18)" }}/>)}
              </div>
            )}
            {cat === "Extra support" && <div style={{ marginBottom:14 }}><WorkWithReshma/></div>}
            {cat === "Extra support" && (
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:13, fontWeight:400, letterSpacing:".3em", textAlign:"center", margin:"4px 0 12px" }}>WORKBOOKS</div>
                <style>{`body .shg-kg-wb.shg-kg-wb{display:grid!important;flex-direction:initial!important;grid-template-columns:repeat(3,1fr)!important;gap:10px}`}</style>
                <div className="shg-kg-wb">
                  {PRODUCTS.filter(p => p.kind === "Workbook").map(p => (
                    <button key={p.name} onClick={()=>{ goShop(onClose); setTimeout(()=>{ const el = document.getElementById("shg-shop-Workbook"); if (el) el.scrollIntoView({ behavior:"smooth", block:"start" }); }, 400); }} style={{ background:"#000", border:"1px solid rgba(242,236,228,0.18)", borderRadius:14, overflow:"hidden", padding:0, cursor:"pointer", fontFamily:"inherit", color:"#F2ECE4" }}>
                      <img src={p.img} alt={p.name} loading="lazy" style={{ width:"100%", aspectRatio:"1", objectFit:"cover", display:"block" }}/>
                      <div style={{ fontSize:12, fontWeight:300, padding:"8px 4px 10px", lineHeight:1.3 }}>{p.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div style={{ display:"grid", gap:10 }}>
              {visibleSections.map(s => (
                <div key={s.k} style={{ ...PAPER, borderRadius:16, overflow:"hidden" }}>
                  <button onClick={()=>setOpen(open===s.k?null:s.k)} aria-expanded={open===s.k} style={{ width:"100%", padding:"16px", background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, fontFamily:"inherit", color:"#000", textAlign:"left" }}>
                    <span style={{ fontSize:17, fontWeight:400, lineHeight:1.35 }}>{s.title}</span>
                    <span style={{ fontSize:20, transform:open===s.k?"rotate(180deg)":"none", transition:"transform .2s" }}>⌄</span>
                  </button>
                  {open===s.k && <div style={{ padding:"0 16px 18px", fontSize:16, fontWeight:300, lineHeight:1.75, whiteSpace:"pre-line", color:"#000" }}>{s.body}
                    {s.shop && <div><button onClick={()=>goShop(onClose)} style={{ marginTop:12, background:GRAD, color:"#000", border:"none", borderRadius:999, padding:"10px 20px", fontSize:15, fontWeight:300, cursor:"pointer", fontFamily:"'Jost',sans-serif" }}>Open the Shop ›</button></div>}
                    {s.ask && <AskReshma/>}
                  </div>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// A whole Guidebook topic (slides + Q&As) as a collapsible block on graph paper, for use inside proofOS.
export function GuideBlock({ cat, title }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState(null);
  const c = CATEGORIES.find(x => x.label === cat);
  if (!c) return null;
  const secs = c.keys.map(k => SECTIONS.find(s => s.k === k)).filter(Boolean);
  const PAPER = { backgroundColor:"#F2ECE4", backgroundImage:"linear-gradient(rgba(191,165,216,.35) 1px,transparent 1px),linear-gradient(90deg,rgba(191,165,216,.35) 1px,transparent 1px)", backgroundSize:"20px 20px" };
  return (
    <div style={{ ...PAPER, borderRadius:18, padding:"14px 14px", margin:"0 0 14px", color:"#000", fontFamily:"'Jost',sans-serif", fontWeight:300 }}>
      <button onClick={()=>setOpen(o=>!o)} aria-expanded={open} style={{ all:"unset", display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%", cursor:"pointer", fontSize:16, fontWeight:300 }}>
        <span>{title || `The ${cat} guide`}</span><span style={{ fontSize:14 }}>{open ? "Close ⌃" : "Open ›"}</span>
      </button>
      {open && (
        <div style={{ marginTop:12, display:"grid", gap:10 }}>
          {(SLIDES[cat] || []).map(n => <img key={n} src={`/deck/${n}.webp`} alt="" loading="lazy" style={{ width:"100%", aspectRatio:"16/9", borderRadius:12, display:"block", objectFit:"cover" }}/>)}
          {secs.map(s => (
            <div key={s.k} style={{ background:"#fff", border:"1px solid #000", borderRadius:12 }}>
              <button onClick={()=>setQ(q===s.k?null:s.k)} style={{ all:"unset", display:"flex", justifyContent:"space-between", gap:8, width:"100%", boxSizing:"border-box", padding:"12px 14px", cursor:"pointer", fontSize:15, fontWeight:300 }}>
                <span>{s.title}</span><span>{q===s.k ? "⌃" : "⌄"}</span>
              </button>
              {q===s.k && <div style={{ padding:"0 14px 14px", fontSize:15, fontWeight:300, lineHeight:1.7, whiteSpace:"pre-line" }}>{s.body}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
