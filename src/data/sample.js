// Real tracks matching D1 database exactly
export const SAMPLE_TRACKS = [
  {
    id: "t3",
    title: "Spoilt",
    category: "Goddessmaxxing",
    tier: "audio",
    duration: 540,
    frequency: "Hypnosis · 9min · Theta",
    description: "For the woman who is done shrinking. Subconscious installation of goddess-level identity. Listened first thing, last thing, or any time you need to remember who you are.",
    tags: ["identity", "goddess", "theta"],
    isNew: true,
  },
  {
    id: "t5",
    title: "Lifetime of Luck",
    category: "Luckygirlmaxxing",
    tier: "audio",
    duration: 540,
    frequency: "Hypnosis · 9min · 528hz",
    description: "Subconscious reprogramming for a lifetime of luck. Binaural beats with 528hz transformation frequency. Bilateral subliminal affirmations layered beneath. Listen at night for deepest receptivity.",
    tags: ["luck", "abundance", "528hz"],
  },
  {
    id: "t1",
    title: "I Am The Luckiest Woman In This Universe",
    category: "Luckygirlmaxxing",
    tier: "audio",
    duration: 720,
    frequency: "Hypnosis · 12min · 528hz",
    description: "The complete Luckygirlmaxxing installation. 12 minutes of deep theta hypnosis with 528hz frequency. Your new operating system: right place, right time, right outcome, every time.",
    tags: ["luck", "identity", "528hz"],
    isNew: true,
  },
  {
    id: "t2",
    title: "Drop The Tension",
    category: "Peacemaxxing",
    tier: "audio",
    duration: 300,
    frequency: "Hypnosis · 5min · Melodic House",
    description: "A 5-minute reset. Drop the tension, drop the story, drop the resistance. Melodic house backdrop with theta induction. For the middle of the day when you need to return to yourself.",
    tags: ["peace", "reset", "tension"],
  },
  {
    id: "t6",
    title: "Monica Face",
    category: "Facemaxxing",
    tier: "audio",
    duration: 540,
    frequency: "Hypnosis · 9min · 432hz",
    description: "Beauty identity installation for your face. 432hz harmony frequency. Your face, your symmetry, your radiance — installed as your new automatic assumption.",
    tags: ["beauty", "face", "432hz"],
  },
  {
    id: "t4",
    title: "100 Years of Beauty Sleep",
    category: "Beautymaxxing",
    tier: "audio",
    duration: 360,
    frequency: "Hypnosis · Sleep · 432hz",
    description: "8-hour sleep subliminal for beauty, radiance, and self-image. 432hz harmony frequency. Plays throughout the night while your subconscious installs the new self-concept.",
    tags: ["beauty", "sleep", "subliminal"],
  },
];

export const SAMPLE_DESIRES = [
  {
    id: "d1",
    title: "Manifest £10,000 this month",
    category: "Richgirlmaxxing",
    intention: "I am a money magnet. Wealth flows to me effortlessly from expected and unexpected sources.",
    startDate: "2026-06-24",
    dayNumber: 26,
    isFulfilled: false,
    proofEntries: [
      { id: 101, type: "Sign", stage: "Evidence Appearing", title: "Saw 555 three times in one hour", description: "On my phone, a receipt, and a door number. All within an hour of waking.", happenedAt: "2026-06-24", noticedAt: "2026-06-24", dayNumber: 1 },
      { id: 102, type: "Voice Proof", stage: "Evidence Appearing", title: "I woke up feeling certain before anything happened", description: "Recorded this first thing. No reason to feel this certain. But I did.", happenedAt: "2026-06-26", noticedAt: "2026-06-26", dayNumber: 3 },
      { id: 103, type: "Partial Proof", stage: "Evidence Appearing", title: "A client asked for the exact offer I had been visualising", description: "She asked unprompted. I had not mentioned it. The number was close.", happenedAt: "2026-06-29", noticedAt: "2026-06-29", dayNumber: 6 },
      { id: 104, type: "Photo Proof", stage: "Evidence Appearing", title: "Bank notification arrived this morning", description: "Transfer from someone I hadn't spoken to in months.", happenedAt: "2026-07-01", noticedAt: "2026-07-01", dayNumber: 8 },
    ],
  },
  {
    id: "d2",
    title: "Glow era — skin, body, presence",
    category: "Beautymaxxing",
    intention: "I am the most beautiful, radiant version of myself. My body reflects my new identity.",
    startDate: "2026-06-12",
    dayNumber: 38,
    isFulfilled: false,
    proofEntries: [
      { id: 201, type: "Symptom", stage: "Evidence Appearing", title: "My body felt warm and calm after the night audio", description: "A physical warmth I can only describe as recognition. Like my cells agreed.", happenedAt: "2026-06-12", noticedAt: "2026-06-12", dayNumber: 2 },
      { id: 202, type: "Sign", stage: "Evidence Appearing", title: "Someone asked what I was doing differently", description: "Sarah asked unprompted during coffee. She said I looked different. Glowing.", happenedAt: "2026-06-18", noticedAt: "2026-06-18", dayNumber: 8 },
      { id: 203, type: "Photo Proof", stage: "Evidence Appearing", title: "Comparison photo, week 1 vs week 2", description: "I can see it myself now.", happenedAt: "2026-06-22", noticedAt: "2026-06-22", dayNumber: 12 },
      { id: 204, type: "Final Manifestation", stage: "Final Proof", title: "Three separate people commented in one day", description: "A stranger, my sister, and someone from work. All on the same day. It is done.", happenedAt: "2026-07-01", noticedAt: "2026-07-01", dayNumber: 21, isFinal: true },
    ],
  },
  {
    id: "d3",
    title: "He comes back. My way.",
    category: "Lovemaxxing",
    intention: "He is already on his way back. I am the one who got away and he knows it.",
    startDate: "2026-06-28",
    dayNumber: 22,
    isFulfilled: false,
    proofEntries: [
      { id: 301, type: "Synchronicity", stage: "Before Manifestation", title: "His name appeared three times in one hour", description: "On a playlist, a friend mentioned someone with his name, then I saw it on a sign.", happenedAt: "2026-06-28", noticedAt: "2026-06-28", dayNumber: 1 },
      { id: 302, type: "Voice Proof", stage: "Evidence Appearing", title: "Recorded after the session, I feel ready", description: "Something shifted. I stopped wanting and started knowing.", happenedAt: "2026-06-30", noticedAt: "2026-06-30", dayNumber: 3 },
    ],
  },
];

// Legacy exports — kept for compatibility with existing components
export const AUDIOS = SAMPLE_TRACKS;
export const PROOF_THREADS = SAMPLE_DESIRES;
export const USER = {
  name: "Reshma",
  tier: "goddess",
  email: "reshma@reshmaoracle.com",
  joinedAt: "2026-06-01",
};
export const STORAGE = {
  used: 240,
  total: 1000,
  unit: "MB",
};
