export const AUDIOS = [
  { id: 1, title: "Money finds me first", category: "Money", frequency: "528hz", audioType: "Subliminal", duration: "28:00", durationSec: 1680, isLocked: false, isFeatured: true, linkedProofThreadCount: 3, manifestedCount: 2, lastListenedAt: "2026-06-30", lastProofAt: "2026-06-29", description: "Subconscious reprogramming for receiving — money, opportunities, unexpected income. Layered with 528hz transformation frequency and bilateral subliminal affirmations." },
  { id: 2, title: "Gorgeous is my default setting", category: "Beauty", frequency: "432hz", audioType: "Self Hypnosis", duration: "35:00", durationSec: 2100, isLocked: false, isFeatured: true, linkedProofThreadCount: 2, manifestedCount: 1, lastListenedAt: "2026-07-01", lastProofAt: "2026-07-01", description: "Deep identity installation for beauty, radiance, and self-image. Guided hypnosis with Reshma's voice into theta state, followed by subliminal beauty affirmations." },
  { id: 3, title: "He is already on his way back", category: "Love", frequency: "432hz", audioType: "Self Hypnosis + Subliminal", duration: "30:00", durationSec: 1800, isLocked: false, isFeatured: false, linkedProofThreadCount: 4, manifestedCount: 3, lastListenedAt: "2026-06-28", lastProofAt: "2026-06-30", description: "SP return and reconnection. Theta state induction, bilateral EMDR to release attachment, subliminal installation of the new self-concept as chosen and worthy." },
  { id: 4, title: "I have always been the prize", category: "Identity", frequency: "963hz", audioType: "Self Hypnosis", duration: "33:00", durationSec: 1980, isLocked: false, isFeatured: false, linkedProofThreadCount: 1, manifestedCount: 0, lastListenedAt: "2026-06-25", lastProofAt: null, description: "Core identity reprogramming. 963hz activation, deep theta induction, self-concept installation at the identity level. For anyone who has ever felt not enough." },
  { id: 5, title: "I manifest while I sleep", category: "Sleep", frequency: "Delta", audioType: "Sleep Subliminal", duration: "8hrs", durationSec: 28800, isLocked: false, isFeatured: true, linkedProofThreadCount: 2, manifestedCount: 1, lastListenedAt: "2026-07-01", lastProofAt: "2026-06-27", description: "8-hour overnight subliminal. Delta wave entrainment. Plays silently beneath sleep sounds while your subconscious installs the new reality. All categories layered." },
  { id: 6, title: "Reality rearranges for me", category: "Identity", frequency: "963hz", audioType: "Frequency + Subliminal", duration: "40:00", durationSec: 2400, isLocked: true, isFeatured: false, linkedProofThreadCount: 0, manifestedCount: 0, lastListenedAt: null, lastProofAt: null, description: "Advanced reality shifting. 963hz pineal activation, EMDR bilateral processing, deep subliminal installation of quantum shift beliefs. Goddess Tier." },
  { id: 7, title: "My body becomes the vision", category: "Body", frequency: "528hz", audioType: "Self Hypnosis", duration: "38:00", durationSec: 2280, isLocked: true, isFeatured: false, linkedProofThreadCount: 0, manifestedCount: 0, lastListenedAt: null, lastProofAt: null, description: "Body image and physical transformation. 528hz DNA repair frequency, body scan hypnosis, subliminal installation of your ideal physical self-concept. Goddess Tier." },
  { id: 8, title: "I wake up chosen", category: "Love", frequency: "432hz", audioType: "Sleep Subliminal", duration: "60:00", durationSec: 3600, isLocked: true, isFeatured: false, linkedProofThreadCount: 0, manifestedCount: 0, lastListenedAt: null, lastProofAt: null, description: "Sleep subliminal for love, being chosen, and desired. 432hz harmony frequency. Plays for one hour at the threshold of sleep when subconscious is most receptive. Goddess Tier." },
];

export const PROOF_THREADS = [
  {
    id: 1, intentionTitle: "I receive €5,000 from an unexpected source", linkedAudioId: 1, linkedAudioTitle: "Money finds me first",
    category: "Money", status: "Evidence Appearing", daysActive: 9, firstListenAt: "2026-06-23",
    manifestedAt: null, proofEntryCount: 4, photoProofCount: 1, voiceProofCount: 1, signCount: 2, lastProofAt: "2026-07-01",
    emotionalCertaintyScore: 8, listeningMode: "Night",
    entries: [
      { id: 101, type: "Sign", stage: "Evidence Appearing", title: "Saw 555 three times in one hour", description: "On my phone, a receipt, and a door number. All within an hour of waking.", happenedAt: "2026-06-24", noticedAt: "2026-06-24", dayNumber: 1 },
      { id: 102, type: "Voice Proof", stage: "Evidence Appearing", title: "I woke up feeling certain before anything happened", description: "Recorded this first thing. No reason to feel this certain. But I did.", happenedAt: "2026-06-26", noticedAt: "2026-06-26", dayNumber: 3, durationSec: 47 },
      { id: 103, type: "Partial Proof", stage: "Evidence Appearing", title: "A client asked for the exact offer I had been visualising", description: "She asked unprompted. I had not mentioned it. The number was close.", happenedAt: "2026-06-29", noticedAt: "2026-06-29", dayNumber: 6 },
      { id: 104, type: "Photo Proof", stage: "Evidence Appearing", title: "Bank notification arrived this morning", description: "Transfer from someone I hadn't spoken to in months. Not €5k but movement is happening.", happenedAt: "2026-07-01", noticedAt: "2026-07-01", dayNumber: 8 },
    ]
  },
  {
    id: 2, intentionTitle: "My skin looks clear, smooth, and luminous", linkedAudioId: 2, linkedAudioTitle: "Gorgeous is my default setting",
    category: "Beauty", status: "Manifested", daysActive: 21, firstListenAt: "2026-06-10",
    manifestedAt: "2026-07-01", proofEntryCount: 6, photoProofCount: 3, voiceProofCount: 1, signCount: 2, lastProofAt: "2026-07-01",
    emotionalCertaintyScore: 10, listeningMode: "Sleep",
    entries: [
      { id: 201, type: "Symptom", stage: "Evidence Appearing", title: "My body felt warm and calm after the night audio", description: "A physical warmth I can only describe as recognition. Like my cells agreed.", happenedAt: "2026-06-12", noticedAt: "2026-06-12", dayNumber: 2 },
      { id: 202, type: "Sign", stage: "Evidence Appearing", title: "Someone asked what I was doing differently", description: "Sarah asked unprompted during coffee. She said I looked different. Glowing.", happenedAt: "2026-06-18", noticedAt: "2026-06-18", dayNumber: 8 },
      { id: 203, type: "Photo Proof", stage: "Evidence Appearing", title: "Comparison photo — week 1 vs week 2", description: "I can see it myself now.", happenedAt: "2026-06-22", noticedAt: "2026-06-22", dayNumber: 12 },
      { id: 204, type: "Final Manifestation", stage: "Final Proof", title: "Three separate people commented in one day", description: "A stranger, my sister, and someone from work. All on the same day. It is done.", happenedAt: "2026-07-01", noticedAt: "2026-07-01", dayNumber: 21, isFinal: true },
    ]
  },
  {
    id: 3, intentionTitle: "He sends me a loving message and asks to see me", linkedAudioId: 3, linkedAudioTitle: "He is already on his way back",
    category: "Love", status: "Active", daysActive: 5, firstListenAt: "2026-06-27",
    manifestedAt: null, proofEntryCount: 2, photoProofCount: 0, voiceProofCount: 1, signCount: 1, lastProofAt: "2026-06-30",
    emotionalCertaintyScore: 7, listeningMode: "Sleep",
    entries: [
      { id: 301, type: "Synchronicity", stage: "Before Manifestation", title: "His name appeared three times in one hour", description: "On a playlist recommendation, a friend mentioned someone with his name, then I saw it on a sign.", happenedAt: "2026-06-28", noticedAt: "2026-06-28", dayNumber: 1 },
      { id: 302, type: "Voice Proof", stage: "Evidence Appearing", title: "Recorded after the session — I feel ready", description: "Something shifted. I stopped wanting and started knowing.", happenedAt: "2026-06-30", noticedAt: "2026-06-30", dayNumber: 3, durationSec: 63 },
    ]
  },
];

export const STORAGE = { usedMb: 124, limitMb: 1024, photoCount: 8, voiceCount: 5, plan: "audio" };

export const USER = {
  name: "Reshma", email: "reshma@reshmaoracle.com", tier: "goddess",
  listeningStreak: 14, totalListens: 47, joinedAt: "2026-05-01",
  storageLimitMb: 5120, storageUsedMb: 124,
};
