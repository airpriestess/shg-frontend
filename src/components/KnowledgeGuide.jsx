/* KnowledgeGuide — comprehensive listening guide covering every question */
import { useState } from "react";

const OMBRE = "linear-gradient(135deg,#F5E0A0 0%,#E8B870 20%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)";

const SECTIONS = [
  { k:"formula", icon:"◈", title:"The formula in every SHG audio",
    body:"Every track combines two things at once. My spoken self-hypnosis — the new identity, spoken as if it's already yours — and subliminals layered beneath the music at a volume your conscious mind cannot hear, but your subconscious receives clearly. On top of that: melodic house, EMDR bilateral stimulation, 528hz or whichever frequency the track needs. You're not listening to a track. You're being installed with a new self-concept while you enjoy music." },

  { k:"when", icon:"◐", title:"When to listen — the best windows",
    body:"Two windows are gold. First: the hour just before sleep — you're already sliding into theta, subliminals absorb effortlessly and keep working through the night. Second: the twenty minutes just after waking, before you touch your phone — you're still in theta and completely receptive.\n\nAny other time also works: your hot girl walk, the gym, cooking, commuting. The rule is simple — press play. Your subconscious is listening even when you're not consciously focused." },

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
    body:"Dr David Hawkins mapped consciousness onto a numerical scale from 20 to 700+. Your dominant emotional state is your point of attraction — it determines what your reality reorganises itself to match.\n\nBelow 200 is contractive energy. Above 200 is expansive. The line between them is Courage.\n\n— Shame (20): the heaviest state. Deep self-rejection. Reality confirms worthlessness.\n— Guilt (30): self-punishment. Living in the past. Manifests more things to feel guilty about.\n— Apathy (50): the grey flatness. Nothing feels possible. The hardest state to move from because there's no energy to change with.\n— Grief (75): loss, sadness, regret. Heavy but has more energy than apathy — the sadness means something still matters.\n— Fear (100): anxiety, worry, constant threat-scanning. Manifests the thing being feared.\n— Desire (125): wanting, craving, neediness. The paradox: needy desire repels what it wants. This is why chasing doesn't work.\n— Anger (150): more energy than fear. Anger can be fuel — but reality keeps delivering things to be angry about.\n— Pride (175): false confidence, ego, defensiveness. Close to the line but still contractive.\n\n— Courage (200): the switch flips here. You can face life as it is. This is where creation begins.\n— Neutrality (250): detachment. Things are fine either way. First real freedom from outcome.\n— Willingness (310): open, optimistic, ready to grow. Things start arriving more easily here.\n— Acceptance (350): life is happening for you, not to you. Identity manifestation accelerates here.\n— Reason (400): clarity, understanding, intellect. Powerful but can overthink and block.\n— Love (500): unconditional, expansive, magnetic. The state Spoilt Goddess is calibrated to. Things arrive without effort.\n— Joy (540): bliss, serenity, effortless flow. Desires feel inevitable. Manifestation is instant here.\n— Peace (600): transcendent stillness. Beyond personal desire — everything is perfect as it is.\n— Enlightenment (700+): pure consciousness. Rare. Beyond manifestation into being.\n\nYour Analytics tab tracks your dominant state over time. Watch it climb. That IS the work. ✦ See Guidebook for the daily practice." },

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
    body:"The music-only format is the pure subliminal version. There is no spoken voice on top — just the music, with the subliminal affirmations running beneath it at sub-audible volume.\n\nThis format is ideal for: background listening while you work, study, cook, or go on your hot girl walk — no voice to follow or that might distract you. The installation happens entirely through the subliminal layer while your conscious mind focuses on whatever else it's doing.\n\nIt's also the format to loop all night — no voice waking you up, just silent installation while you sleep." },

  { k:"vocals-only", icon:"◉", title:"Why do some tracks have only vocals?",
    body:"The vocal-only format is the pure hypnosis version — Reshma's voice guiding you into theta and speaking the new identity directly to you, without the melodic house production underneath.\n\nThis format is for: deep, intentional sessions where you want the full hypnotic induction without musical distraction. Best used when you can close your eyes and give it your full attention — first thing in the morning, before sleep, or during a meditation session.\n\nThe vocal version tends to be more emotionally activating because the voice is at full volume and directed entirely at you." },

  { k:"hypno-vs-sub-versions", icon:"⇌", title:"How to use the same track in both hypnosis and subliminal version",
    body:"Each desire category has tracks in different formats. Here is how to use them together for maximum effect:\n\nMorning protocol: play the vocal/hypnosis version. You've just woken up, you're in theta, your brain is fully receptive. Let the voice guide you into the new identity while you're in the most receptive state of the day. 20–30 minutes.\n\nDaytime or background: switch to the music-only version. Play it while you work, exercise, cook. Your conscious mind focuses on the task. Your subconscious keeps receiving the subliminal layer.\n\nNight protocol: loop the music-only version all night. No voice to wake you. Pure subliminal installation through delta sleep.\n\nUsing both formats for the same desire means your subconscious is receiving installation at every stage of consciousness — theta, beta, and delta. This is the accelerated protocol." },

  { k:"proof-wall-forever", icon:"✦", title:"Your Proof Wall is for life — never lose a manifestation again", isNew:true,
    body:"Every manifestation you log stays on your Proof Wall permanently — not for a month, not until you clear your history, forever. This is the whole point.\n\nMost people manifest things constantly and never realise it, because they don't write it down. A win happens, life moves on, and a few months later when doubt creeps back in, there's nothing to point to. The evidence existed, it just wasn't kept anywhere.\n\nYour Proof Wall replaces that gap entirely. Every intention shows exactly when you added it and exactly when it manifested — so you can see, in black and white, how long it actually took. Some things take two days. Some take months. There's no average that means anything, because it depends entirely on the desire — but seeing your own real timeline, across everything you've ever manifested, is the actual point. It becomes undeniable. This isn't a journal you'll lose or a note you'll forget to reread. It's permanent, dated proof that this works, built by you, for you, for as long as you use the app." },

  { k:"bucket-vs-active", icon:"◈", title:"Bucket List vs Active — how the two work together", isNew:true,
    body:"ProofOS has two different lists, and they're not the same thing.\n\nYour Bucket List is everything you want to manifest, ever — no limit, no pressure. Write something down the second it occurs to you. No category needed, no audio needed, no commitment. It's just a place to capture desires before you forget them, the way you'd jot something in your notes app. A holiday, a number in your bank account, a relationship, a body you want, a job — all of it goes here first.\n\nActive is different. This is where you're actually focusing your energy right now — the desires you've chosen to work on deliberately, with audio, with a Hawkins state logged before and after, with signs being tracked. We recommend keeping this list to around 5–10 at a time. Not because there's a hard limit, but because trying to actively manifest fifty things at once spreads your energy so thin that none of them get the focus they need. Depth beats breadth here.\n\nHere's the method: keep adding to your Bucket List constantly, with no filter. Then, when you're ready to actually focus, open your Bucket List and promote a handful of items into Active — that's when you pick a category and get a track suggested. Everything else stays in your Bucket List, waiting, still valid, still yours. Nothing is lost by not focusing on it yet.\n\nAnd here's the part most people miss: you can mark a Bucket List item as manifested without it ever becoming Active. Sometimes the act of writing a desire down clearly, once, is enough — you don't always need the audio to manifest something. If it happens, mark it. Your Proof Wall doesn't care which list it came from." },

  { k:"how-to-write-intention", icon:"✧", title:"How to write a good intention in ProofOS",
    body:"A good intention is specific, present-tense, and describes the outcome — not the process of getting there.\n\nWeak: \"I want to feel better about money.\"\nStrong: \"Money finds me easily and consistently, without me having to chase it.\"\n\nWeak: \"I hope he texts me.\"\nStrong: \"He texts me first, consistently, without me reaching out.\"\n\nThree things every good intention has: it names the exact outcome you want, it's written as if it's already becoming true rather than something you're waiting for, and it's specific enough that you'd actually recognise it when it happens. Vague intentions get vague evidence. Specific intentions get specific proof." },

  { k:"choosing-your-emotion", icon:"◑", title:"How to choose your emotional state when logging an intention",
    body:"When you log a new intention, you're asked how you're feeling right now — this uses the Hawkins scale (see the sections above on what it is and how to use it).\n\nBe honest, not aspirational. If you're anxious, log anxious — don't log \"peace\" because that's what you're aiming for. The whole point of tracking is to see the real starting point so the shift is actually visible later. There's no wrong answer here. Contractive states (below 200) aren't a failure — they're just where you're starting from, and the audio is built to move you out of them.\n\nIf you genuinely don't know what you're feeling, pick the closest match rather than skipping it. A rough guess logged consistently is more useful than a perfect answer logged never." },

  { k:"spotting-signs", icon:"✦", title:"How to spot a sign or synchronicity worth logging", isNew:true,
    body:"A sign is anything that feels like a nudge toward your intention — even a small one. You don't need to wait for the full manifestation to log something.\n\nWhat counts: a coincidence that's slightly too on-the-nose to ignore, a conversation that circles back to your exact desire, a number or name showing up repeatedly, a feeling of \"that's strange\" when something lines up with what you asked for, a small version of the thing itself arriving before the whole thing does.\n\nDon't overthink it — if it made you pause, log it. The habit of noticing and logging is what trains you to actually see the evidence building, instead of missing it because you weren't looking. Signs add up. That's the entire mechanism behind the Proof Wall." },


  { k:"headphones", icon:"🎧", title:"Do I need headphones?",
    body:"For binaural beats and EMDR tracks: yes, headphones are required. Both effects depend on each ear receiving a different signal — one earbud removes the bilateral effect entirely.\n\nFor subliminal and melodic house tracks without binaural: speakers work fine. The subliminals are embedded in the audio itself and don't rely on stereo separation.\n\nA simple rule: if the track is labelled Binaural or EMDR, put both headphones in. For everything else, do whatever's comfortable." },

  { k:"focus", icon:"◐", title:"Do I need to focus or pay attention while listening?",
    body:"No. You don't need to concentrate, follow the words, or try to believe anything. The audio does the work whether or not your conscious mind is engaged.\n\nIn fact, trying too hard to listen keeps you in beta — the alert, analytical state — which is exactly what you want to move out of. The most receptive sessions are the ones where you've half-forgotten you're listening. Let your mind wander. Let yourself drift. That's theta." },

  { k:"fell-asleep", icon:"◑", title:"What if I fall asleep while listening?",
    body:"Good. That's the protocol.\n\nWhen you cross from theta into delta (deep sleep), your conscious mind switches off completely — and the subliminals keep running. Your subconscious doesn't sleep. It processes everything it hears all night. Falling asleep while listening is not a waste of the session, it's the deepest version of it.\n\nIf you consistently fall asleep before the track ends, loop it. Let it play all night. That's not too much. That's the accelerated protocol." },

  { k:"believe", icon:"✦", title:"Do I need to believe it will work?",
    body:"No. That's the entire point of subliminals and hypnosis — they bypass the part of your mind that decides what to believe.\n\nAffirmations fail for most people because the conscious mind rejects them the moment they're said out loud. 'I am rich' while checking a negative balance — the critical faculty laughs and the affirmation bounces off.\n\nWith SHG, the installation happens below that layer. You don't need to agree with the statement for your subconscious to receive it. You don't need to feel it yet. The only requirement is pressing play." },

  { k:"therapy", icon:"◊", title:"Can I use this alongside therapy or medication?",
    body:"Yes — and it's designed to complement both, not replace them.\n\nSHG operates at the identity and belief level. Therapy operates at the processing and insight level. Medication supports neurochemistry. None of these conflict with each other. If anything, the audio accelerates therapy by doing the subconscious installation between sessions that therapy often can't reach in the session itself.\n\nIf you're under the care of a mental health professional, keep going. SHG is not a substitute for professional mental health support. It's an additional layer — and for many people, a significant one." },

  { k:"emotional", icon:"↑", title:"What if listening makes me emotional?",
    body:"That's completely normal — and usually a good sign.\n\nWhen a track lands in a place that carries an old wound, it can bring up grief, anger, or unexpected sadness. This is not the audio hurting you. This is it hitting a real block — the old belief that needs to dissolve before the new one can land.\n\nLet it come up. Don't stop the track. Cry if you need to. The emotion is the old identity releasing. What comes after it — usually within the same session or the day after — is often a noticeable lightness, and a faster movement toward the desire.\n\nIf you're finding certain tracks consistently activating in a way that feels too much, try the subliminal-only version of the same category first. Less direct, same installation." },

  { k:"visualization", icon:"✧", title:"Can I do visualisation while listening?",
    body:"Yes — and it amplifies the installation significantly.\n\nThe ideal sequence: press play, close your eyes, let the audio carry you into theta, and once you feel relaxed (usually 5–10 minutes in), bring up the end result of your desire as an image or a feeling. Don't watch it like a movie — be inside it. Feel it as if it's already done.\n\nYou don't need to maintain the visualisation for the whole session. Even 2–3 minutes of clear, felt end-result imagery while in theta is far more effective than the same visualisation attempted in beta while sitting at a desk.\n\nIf your mind wanders from the image, let it. The subliminals and audio are still working. The visualisation is an add-on, not a requirement." },

  { k:"one-method", icon:"◈", title:"Should I stick to one method or combine everything?",
    body:"SHG is designed to be a complete system on its own. You don't need to add anything else for it to work.\n\nIf you want to layer in other practices — journalling, scripting, visualisation, affirmations — go ahead. They don't conflict. But if you're already doing SHG daily and trying to do five other methods alongside it, you may be overcomplicating something that works better when you trust it and leave it alone.\n\nThe most effective approach for most people: one track per desire, daily, consistently. Everything else is optional." },

  { k:"tell-anyone", icon:"◉", title:"Should I tell anyone what I'm manifesting?",
    body:"No.\n\nThis is not superstition — it's psychology. The moment you verbalise a desire to someone else, your brain starts managing their reaction to it instead of moving toward the outcome. If they doubt you, you absorb that doubt. If they ask questions, you go into explanation mode. If they dismiss it, you spend energy defending something that didn't need defending.\n\nThe more uncertain you feel about a desire — the bigger the identity gap between who you are now and who you'd have to be to have it — the more important it is to keep it private. Silence is protection. It keeps your belief intact.\n\nThe rule: the more delusional the desire feels, the fewer people who should know about it. Your most audacious intentions are the ones to hold closest. Only share a desire once it's manifested — and then only with people who can celebrate it without needing to understand how it happened.\n\nTell the Proof Wall. Not the group chat." },

  { k:"not-working", icon:"↑", title:"What if nothing is happening after a week?",
    body:"First question: are you listening every day? Not most days — every day. A week of daily listening is genuinely the minimum before drawing conclusions.\n\nSecond question: are you logging signs? If you're not logging, you're not noticing. Signs arrive before the full manifestation and they're easy to dismiss as coincidence. Start logging everything that pauses you, even slightly.\n\nThird question: what does your dominant emotional state look like? If you're logging signs from Fear or Desire (below 200), the audio is lifting you but the contractive energy is slowing the movement. That's not a reason to stop — it's a reason to keep going.\n\nFourth question: are you attached to the outcome arriving in a specific way or by a specific time? Attachment keeps the energy locked in your hands. The shift from wanting to knowing is the real movement. Listen daily. Log honestly. Let go of the timeline." },

  { k:"multiple-desires", icon:"⇄", title:"Should I focus on one desire or work on several?",
    body:"Both work. Here is the practical framework:\n\nIf you're new, start with one. Your most burning desire — the one you feel the most about. Give it everything for 30 days. Build the habit. Build the evidence. Then add more.\n\nIf you have multiple desires across different categories — love, money, appearance — they don't compete with each other. Your subconscious is not single-threaded. You can listen to one track in the morning and another at night and both install separately.\n\nThe mistake to avoid: rotating through 10 different tracks with no consistency on any of them. Pick 2–3 at most for any given month, rotate the listening windows (morning/night), and give each track enough repetitions to land." },

  { k:"proofos-not-journal", icon:"◈", title:"Is ProofOS a journal?",
    body:"No — and that's intentional.\n\nA journal is for processing. ProofOS is for evidence. The difference is significant.\n\nJournalling is valuable but it's not what ProofOS is for. ProofOS is a structured record of: what you want, the signs that it's coming, and the proof when it arrives. It's a receipts system, not a feelings system.\n\nYou don't write about your day in ProofOS. You don't process your emotions in ProofOS (that's what the Hawkins log is for — brief, honest, one-line). You log intentions, you log signs, you log manifestations. Short, specific, dated.\n\nThe reason ProofOS isn't a journal is because journals become something to maintain. A record of receipts becomes something you can't stop adding to — because you keep getting evidence." },

  { k:"knowing-manifested", icon:"↑", title:"How to know when something has actually manifested",
    body:"Mark an intention as manifested when the actual outcome has happened — not a sign pointing toward it, the real thing. If your intention was \"he texts me first,\" the manifestation is the text arriving, not the dream about him or the feeling that it's close.\n\nIt's fine to have multiple signs logged under an intention for weeks before it manifests — that's normal and expected. The signs are the trail, the manifestation is the destination. When you mark something manifested, you're also asked how you feel now — this is what lets you see your own before/after, side by side, permanently, on your Proof Wall." },

];

const CATEGORIES = [
  { label:"Getting started", keys:["formula","when","how-long-session","how-often","headphones","focus","fell-asleep","believe","state"] },
  { label:"The mechanism", keys:["brainwaves","sats","emdr","subliminals-what","subliminals-all","visualization","one-method","therapy","emotional"] },
  { label:"Tracks & listening", keys:["how-many-tracks","multiple-intentions","same-track-multiple","multiple-desires","stop","hyp-vs-sub","music-only","vocals-only","hypno-vs-sub-versions","frequencies","frequencies-types","reiki"] },
  { label:"ProofOS", keys:["bucket-vs-active","how-to-write-intention","choosing-your-emotion","spotting-signs","signs","knowing-manifested","proof-wall-forever","proofos-not-journal"] },
  { label:"Results & troubleshooting", keys:["results","working","not-working","tell-anyone"] },
  { label:"The Hawkins Scale", keys:["hawkins","hawkins-how"] },
];

export default function KnowledgeGuide({ onClose, C }) {
  const [open, setOpen] = useState(null);
  const [cat, setCat] = useState("Getting started");

  const isDark = C?.bg === "#080808" || C?.bg === "#0f0f0f" || !C?.bg?.startsWith("#f");
  const bg = isDark ? "#0a0a0a" : "#fdf8f2";
  const bg2 = isDark ? "#111111" : "#ffffff";
  const cr = isDark ? "#f2ece4" : "#1a1008";
  const mu = isDark ? "#c8bfb8" : "#3a3028";
  const border = isDark ? "rgba(44,183,167,0.15)" : "rgba(180,104,48,0.18)";

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
              <div style={{ fontSize:12, color:"#2CB7A7", letterSpacing:"0.22em", textTransform:"uppercase", marginBottom:4 }}>Guidebook ✦</div>
              <div style={{ fontSize:18, color:cr, fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic" }}>Everything you need to know</div>
              <div style={{ fontSize:14, color:cr, marginTop:4, opacity:0.6 }}>{SECTIONS.length} questions answered</div>
            </div>
            <button onClick={onClose} style={{ background:"none", border:"none", fontSize:20, cursor:"pointer", color:mu, padding:4 }}>✕</button>
          </div>

          {/* Category pills */}
          <div style={{ display:"flex", gap:6, marginTop:14, overflowX:"auto", paddingBottom:2 }}>
            {CATEGORIES.map(c=>(
              <button key={c.label} onClick={()=>{setCat(c.label);setOpen(null);}}
                style={{ flexShrink:0, padding:"6px 14px", borderRadius:20, border:`1px solid ${cat===c.label?"#2CB7A7":border}`,
                  background:cat===c.label?"#2CB7A7":"none", color:cat===c.label?"#000":cr,
                  fontSize:13, cursor:"pointer", fontFamily:"'Jost',sans-serif", whiteSpace:"nowrap" }}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div style={{ padding:"12px 16px 24px" }}>
          {visibleSections.map(s=>(
            <div key={s.k} style={{ marginBottom:6, border:`1px solid ${border}`, borderRadius:12,
              overflow:"hidden", background:open===s.k?`rgba(44,183,167,0.06)`:bg2 }}>
              <button onClick={()=>setOpen(open===s.k?null:s.k)}
                style={{ width:"100%", padding:"13px 14px", background:"none", border:"none", cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, fontFamily:"'Jost',sans-serif" }}>
                <span style={{ display:"flex", alignItems:"center", gap:10, flex:1, textAlign:"left" }}>
                  <span style={{ width:28, height:28, borderRadius:7, background:OMBRE, display:"flex",
                    alignItems:"center", justifyContent:"center", fontSize:14, color:"#000", flexShrink:0 }}>{s.icon}</span>
                  <span style={{ fontSize:15, color:cr, lineHeight:1.3 }}>{s.title}</span>
                </span>
                <span style={{ fontSize:16, color:mu, flexShrink:0, transition:"transform 0.2s",
                  transform:open===s.k?"rotate(180deg)":"none" }}>⌄</span>
              </button>
              {open===s.k && (
                <div style={{ padding:"0 14px 16px 52px", fontSize:15, lineHeight:1.85, color:cr,
                  whiteSpace:"pre-line" }}>{s.body}</div>
              )}
            </div>
          ))}

          {/* Footer CTA */}
          <div style={{ marginTop:12, padding:"12px 14px", background:OMBRE, borderRadius:12,
            fontSize:14, color:"#000", textAlign:"center" }}>
            Come back to this any time — tap Guidebook on your home screen.
          </div>
        </div>
      </div>
    </>
  );
}
