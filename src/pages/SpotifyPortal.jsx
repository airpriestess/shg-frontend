import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import AnalyticsBoard, { DEMO_ANALYTICS } from "../components/AnalyticsBoard.jsx";
import KnowledgeGuide from "../components/KnowledgeGuide.jsx";
import { ArrowIcon } from "../components/UI.jsx";
import { PushNotificationToggle, PushPromptBanner } from "../components/PushNotifications.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import LogSignModal, { ManifestCelebration } from "../components/LogSignModal.jsx";

const QUIZ_WORKER_URL = "https://shg-quiz-worker.airpriestess.workers.dev";

async function quizApi(path, token, options = {}) {
  const res = await fetch(`${QUIZ_WORKER_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// Full Hawkins scale, 20 (Shame) → 700+ (Enlightenment)
const HAWKINS = [
  {n:"Shame",       v:20,  c:"#7a1f1f"}, // deep red
  {n:"Guilt",       v:30,  c:"#9c2b2b"}, // red
  {n:"Apathy",      v:50,  c:"#a8432a"}, // red-orange
  {n:"Grief",       v:75,  c:"#b8562f"}, // burnt orange
  {n:"Fear",        v:100, c:"#c66a2e"}, // orange
  {n:"Desire",      v:125, c:"#d0812f"}, // amber-orange
  {n:"Anger",       v:150, c:"#c94040"}, // red (spike, anger reads hot, not warm-fading)
  {n:"Pride",       v:175, c:"#E8B870"}, // gold, transition begins
  {n:"Courage",     v:200, c:"#E8B870"}, // gold, the line
  {n:"Neutrality",  v:250, c:"#BFA5D8"}, // lilac
  {n:"Willingness", v:310, c:"#BFA5D8"}, // lilac
  {n:"Acceptance",  v:350, c:"#2CB7A7"}, // teal
  {n:"Reason",      v:400, c:"#2CB7A7"}, // teal
  {n:"Love",        v:500, c:"#F5E0A0"}, // champagne
  {n:"Joy",         v:540, c:"#F5E0A0"}, // champagne
  {n:"Peace",       v:600, c:"#F5E0A0"}, // champagne
  {n:"Enlightenment",v:700,c:"#F5E0A0"}, // champagne, brightest
];
const dominant = (log,days) => {
  const cutoff = Date.now() - days*86400000;
  const recent = log.filter(e=>new Date(e.date).getTime()>=cutoff);
  if (!recent.length) return null;
  const avg = recent.reduce((s,e)=>s+(HAWKINS.find(h=>h.n===e.level)?.v||0),0)/recent.length;
  return HAWKINS.reduce((best,h)=>Math.abs(h.v-avg)<Math.abs(best.v-avg)?h:best,HAWKINS[0]);
};

/* ═══════════════════════════════════════════════════════════════════════
   SHG PORTAL, Full Spotify-style with:
   · Real audio playback via Cloudflare Workers
   · Proof threads linked to tracks + undo/edit
   · Favorites section
   · Profile avatar → stats/settings panel
   · Home win summary dashboard
   · Shop → Beacons.ai
   · Light/dark theme toggle
   ═══════════════════════════════════════════════════════════════════════ */

// ── SUPABASE AUDIO URLS ──────────────────────────────────────────────────────
const AUDIO_URLS = {
  // Real tracks - titles match D1 database exactly
  "Spoilt Goddess":                             "https://shg-audio-worker.airpriestess.workers.dev/SPOILT%20BEACONS%20%20HYPNOSIS%209MIN%2013.04.2026.WAV",
  "Lifetime of Luck":                           "https://shg-audio-worker.airpriestess.workers.dev/LIFETIME%20OF%20LUCK%20HYPNOSIS%209MIN%2023.04.2026.WAV",
  "Drop The Tension":                           "https://shg-audio-worker.airpriestess.workers.dev/DROP%20THE%20TENSION%20HYPNOSIS%205MIN%2002.06.2026.WAV",
  "Monica Face":                                "https://shg-audio-worker.airpriestess.workers.dev/MONICA%20FACE%20HYPNOSIS%209MIN%2006.05.2026.WAV",
  "I Am The Luckiest Woman In This Universe":   "https://shg-audio-worker.airpriestess.workers.dev/LUCKIEST%20GIRL%20UNIVERSE%20HYPNOSIS%2012MINS%2014.08.2026.WAV",
  "100 Years of Beauty Sleep":                  "https://shg-audio-worker.airpriestess.workers.dev/100%20YEARS%20OF%20BEAUTY%20SLEEP%20HYPNOSIS%206MIN%2020.04.WAV",
  "Confidence In My Luck":                      "https://shg-audio-worker.airpriestess.workers.dev/CONFIDENCE%20IN%20MY%20LUCK%20HYPNOSIS%2002.09.2026.WAV",
  "Attract Opportunities":                      "https://shg-audio-worker.airpriestess.workers.dev/ATTRACT%20OPPORTUNITIES%20HYPNOSIS%2002.09.2026.WAV",
  "I Align What Serves Me":                     "https://shg-audio-worker.airpriestess.workers.dev/I%20ALIGN%20WHAT%20SERVES%20ME%20HYPNOSIS%2002.09.2026.WAV",
  "Luck Accelerates Everything":                "https://shg-audio-worker.airpriestess.workers.dev/LUCK%20ACCELERATES%20EVERYTHING%20IG%2002.09.2026.WAV",
  "Luck Finds Me Everywhere":                   "https://shg-audio-worker.airpriestess.workers.dev/LUCK%20FINDS%20ME%20EVERYWHERE%20HYPNOSIS%2002.09.2026.WAV",
  "Luck Finds Me Everywhere (Subliminal)":      "https://shg-audio-worker.airpriestess.workers.dev/LUCK%20FINDS%20EVERYWHERE%20SUBLIMINAL%2002.09.2026.WAV",
  "My Mind Is a Luck Creator":                  "https://shg-audio-worker.airpriestess.workers.dev/MY%20MIND%20IS%20A%20LUCK%20CREATOR%2002.09.2026.WAV",
  "My Pace Is My Superpower":                   "https://shg-audio-worker.airpriestess.workers.dev/MY%20PACE%20IS%20MY%20SUPERPOWER%2002.09.2026.WAV",
  "New Chapters Bring Blessings":               "https://shg-audio-worker.airpriestess.workers.dev/NEW%20CHAPTERS%20BRING%20BLESSINGS%2002.09.2026.WAV",
};

// ── BEACONS STORE ────────────────────────────────────────────────────────────
const BEACONS = "https://beacons.ai/reshmaoracle"; // update with exact URL

// ── THEMES ───────────────────────────────────────────────────────────────────
const THEMES = {
  // ── DARK MODE: pure black, LG colours on accents only ──────────────────
  dark: {
    bg:      "#000000",
    bg2:     "#0a0a0a",
    bg3:     "#111111",
    bg4:     "#161616",
    nav:     "#050505",
    cr:      "#fdf0e8",   // primary text, warm cream
    mu:      "#fdf0e8",   // muted text, now same as primary, no grey
    dim:     "#fdf0e8",   // faint text, still near-white, no grey/brown
    border:  "rgba(232,184,112,0.15)",  // gold-tinted border
    inputBg: "#1a1a1a",
    inputCr: "#fdf0e8",
    // LG accent colours for labels, icons, active tabs, never backgrounds
    accentGold: "#E8B870",
    accentLav:  "#BFA5D8",
    accentTeal: "#2CB7A7",
    accentChamp:"#F5E0A0",
    accentDeep: "#167A6B",
  },
  // ── LIGHT MODE: full LG gradient wall to wall, ALL TEXT BLACK ────────────
  light: {
    bg:      "linear-gradient(135deg,#EEE8F8 0%,#BFA5D8 28%,#2CB7A7 62%,#167A6B 100%)",
    bg2:     "#fdf0e8",  // frosted glass cards
    bg3:     "#fdf0e8",  // raised cards
    bg4:     "#fdf0e8",  // highest surface
    nav:     "#167A6B",  // nav bar, deep teal
    cr:      "#000000",   // primary text, black
    mu:      "#000000",   // muted text, also black (no grey in light mode)
    dim:     "#000000",   // faint text, also black
    border:  "#fdf0e8",
    inputBg: "#fdf0e8",
    inputCr: "#000000",
    accentGold: "#000000",
    accentLav:  "#000000",
    accentTeal: "#000000",
    accentChamp:"#000000",
    accentDeep: "#000000",
  },
};

const R = "#E8B870", P = "#BFA5D8";
const OMBRE = "linear-gradient(135deg,#EEE8F8 0%,#BFA5D8 28%,#2CB7A7 62%,#167A6B 100%)";

// Per-tab subtle wash, black/gold "color experience," varying only by gold intensity per tab. No pink or rose on the dashboard.
// Dark theme: near-black fading to a faint gold tint, so content stays readable.
// Light theme: cream fading to a soft champagne pastel.
// TAB_WASH: dark = pure black per tab. light = undefined (LG gradient is the bg, set via THEMES.light.bg).
const TAB_WASH = {
  home:    { dark: "#000000", light: undefined },
  search:  { dark: "#000000", light: undefined },
  library: { dark: "#000000", light: undefined },
  proof:   { dark: "#000000", light: undefined },
  shop:    { dark: "#000000", light: undefined },
};
// LG fade overlay for dark mode top wash
const LG_FADE_LIGHT = "linear-gradient(180deg,rgba(245,224,160,0.18) 0%,rgba(191,165,216,0.08) 50%,transparent 100%)";
// LG gradient top fade shown on every tab
const LG_FADE = "linear-gradient(180deg,rgba(245,224,160,0.07) 0%,rgba(191,165,216,0.04) 40%,transparent 100%)";

// ── STOCK IMAGES ─────────────────────────────────────────────────────────────
const IMGS = {
  "Spoilt Goddess":           { url:"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&h=200&fit=crop&auto=format", g:"#F5E0A0,#2CB7A7" },
  "He Finds His Way Back":    { url:"https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=200&h=200&fit=crop&auto=format", g:"#F5E0A0,#2CB7A7" },
  "Money Finds Me First":     { url:"https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=200&h=200&fit=crop&auto=format", g:"#F5E0A0,#2CB7A7" },
  "While I Sleep I Manifest": { url:"https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=200&h=200&fit=crop&auto=format", g:"#F5E0A0,#2CB7A7" },
  "Gorgeous Is My Default":   { url:"https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=200&h=200&fit=crop&auto=format", g:"#F5E0A0,#2CB7A7" },
  "DNA Activation Ceremony":  { url:"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=200&h=200&fit=crop&auto=format", g:"#F5E0A0,#2CB7A7" },
  "Lucky Girl Summer":        { url:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&auto=format", g:"#F5E0A0,#2CB7A7" },
  "10 Years Into One Hour":   { url:"https://images.unsplash.com/photo-1496715976403-f5c7c1a1d064?w=200&h=200&fit=crop&auto=format", g:"#F5E0A0,#2CB7A7" },
  "Highest Timeline":         { url:"https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=200&h=200&fit=crop&auto=format", g:"#F5E0A0,#2CB7A7" },
};

const CAT_ICONS = {
  Lovemaxxing: { accent:"#E8B870", icon:'<path d="M30 52 C14 42 10 30 18 24 C24 19 30 23 30 30 C30 23 36 19 42 24 C50 30 46 42 30 52 Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>' },
  Beautymaxxing: { accent:"#BFA5D8", icon:'<path d="M30 20 C24 20 20 24 20 29 C20 33 23 36 27 36 C24 38 23 42 25 46 C22 44 20 40 21 35 C16 34 13 30 13 25 C13 19 18 14 24 14 C27 14 29 15.5 30 17 C31 15.5 33 14 36 14 C42 14 47 19 47 25 C47 30 44 34 39 35 C40 40 38 44 35 46 C37 42 36 38 33 36 C37 36 40 33 40 29 C40 24 36 20 30 20 Z" fill="currentColor" opacity="0.9"/><path d="M30 46 L30 54 M25 50 Q30 48 35 50" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>' },
  Facemaxxing: { accent:"#E8B870", icon:'<ellipse cx="30" cy="30" rx="16" ry="20" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="24" cy="26" r="2" fill="currentColor"/><circle cx="36" cy="26" r="2" fill="currentColor"/><path d="M24 38 Q30 42 36 38" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>' },
  Bodymaxxing: { accent:"#2CB7A7", icon:'<circle cx="30" cy="14" r="6" fill="none" stroke="currentColor" stroke-width="3"/><path d="M30 20 L30 38 M20 26 L40 26 M30 38 L22 50 M30 38 L38 50" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' },
  Skinnymaxxing: { accent:"#2CB7A7", icon:'<path d="M22 14 Q30 10 38 14 L36 26 Q30 22 24 26 Z" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M24 26 Q22 38 26 48 L34 48 Q38 38 36 26" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' },
  Richgirlmaxxing: { accent:"#E8B870", icon:'<circle cx="30" cy="30" r="17" fill="none" stroke="currentColor" stroke-width="3"/><path d="M30 20 L30 40 M25 24 Q25 20 30 20 Q35 20 35 24 Q35 28 30 28 Q25 28 25 32 Q25 36 30 36 Q35 36 35 32" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>' },
  Businessmaxxing: { accent:"#E8B870", icon:'<rect x="14" y="24" width="32" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="3"/><path d="M22 24 L22 18 Q22 15 25 15 L35 15 Q38 15 38 18 L38 24" fill="none" stroke="currentColor" stroke-width="3"/>' },
  Desiresmaxxing: { accent:"#E8B870", icon:'<path d="M32 14 C32 14 20 22 20 32 C20 38.6 25.4 44 32 44 C38.6 44 44 38.6 44 32 C44 22 32 14 32 14Z M26 30 L32 24 L38 30" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' },
  DNAmaxxing: { accent:"#2CB7A7", icon:'<path d="M20 12 Q30 20 20 28 Q10 36 20 44 Q30 52 20 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" transform="translate(10,0)"/><path d="M40 12 Q30 20 40 28 Q50 36 40 44 Q30 52 40 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" transform="translate(-10,0)"/>' },
  Selfmaxxing: { accent:"#BFA5D8", icon:'<circle cx="30" cy="30" r="18" fill="none" stroke="currentColor" stroke-width="2" opacity="0.4"/><circle cx="30" cy="30" r="8" fill="currentColor"/>' },
  Erosmaxxing: { accent:"#F5E0A0", icon:'<path d="M30 46 C30 46 14 36 14 22 C14 15 20 12 25 15 C28 17 30 21 30 21 C30 21 32 17 35 15 C40 12 46 15 46 22 C46 36 30 46 30 46 Z" fill="currentColor" opacity="0.85"/>' },
  Singlemaxxing: { accent:"#F5E0A0", icon:'<circle cx="30" cy="24" r="10" fill="none" stroke="currentColor" stroke-width="3"/><path d="M30 34 L30 48" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="30" cy="24" r="3" fill="currentColor"/>' },
  Wellnessmaxxing: { accent:"#E8B870", icon:'<path d="M30 46 C16 36 12 24 20 18 C25 14 30 18 30 24 C30 18 35 14 40 18 C48 24 44 36 30 46 Z" fill="none" stroke="currentColor" stroke-width="3"/>' },
  Sleepmaxxing: { accent:"#2CB7A7", icon:'<path d="M38 16 A16 16 0 1 0 38 44 A12 12 0 0 1 38 16" fill="currentColor"/>' },
  Studymaxxing: { accent:"#BFA5D8", icon:'<path d="M14 22 L30 14 L46 22 L30 30 Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M14 22 L14 34 M46 22 L46 34" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' },
  Friendmaxxing: { accent:"#BFA5D8", icon:'<circle cx="22" cy="26" r="7" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="38" cy="26" r="7" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M12 44 Q12 34 22 34 Q26 34 28 37 Q30 34 34 34 Q44 34 44 44" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>' },
  Peacemaxxing: { accent:"#BFA5D8", icon:'<circle cx="30" cy="30" r="18" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3"/><path d="M18 30 Q30 20 42 30 Q30 40 18 30" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="30" cy="30" r="4" fill="currentColor"/>' },
  Confidencemaxxing: { accent:"#E8B870", icon:'<path d="M30 12 L36 24 L48 26 L39 34 L42 46 L30 40 L18 46 L21 34 L12 26 L24 24 Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>' },
  Stylemaxxing: { accent:"#E8B870", icon:'<path d="M22 16 L26 20 L30 16 L34 20 L38 16 L38 22 L34 24 L34 46 L26 46 L26 24 L22 22 Z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/>' },
  Healthmaxxing: { accent:"#F5E0A0", icon:'<path d="M30 44 C30 44 16 34 16 22 C16 15 22 12 27 15 C29 16.5 30 19 30 19 C30 19 31 16.5 33 15 C38 12 44 15 44 22 C44 34 30 44 30 44 Z" fill="none" stroke="currentColor" stroke-width="2.5"/>' },
  Intuitionmaxxing: { accent:"#BFA5D8", icon:'<circle cx="30" cy="30" r="16" fill="none" stroke="currentColor" stroke-width="2" opacity="0.35"/><circle cx="30" cy="30" r="9" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="30" cy="30" r="3" fill="currentColor"/>' },
  Lifemaxxing: { accent:"#E8B870", icon:'<circle cx="30" cy="30" r="10" fill="currentColor"/><path d="M30 10 L30 4 M30 56 L30 50 M10 30 L4 30 M56 30 L50 30" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>' },
  Luckygirlmaxxing: { accent:"#F5E0A0", icon:'<path d="M30 30 C30 30 22 22 16 24 C11 26 11 32 16 34 C22 36 30 30 30 30 C30 30 38 22 44 24 C49 26 49 32 44 34 C38 36 30 30 30 30" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="30" cy="30" r="3" fill="currentColor"/>' },
  Sovereignmaxxing: { accent:"#BFA5D8", icon:'<path d="M14 40 L14 24 L22 32 L30 16 L38 32 L46 24 L46 40 Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>' },
};

function Thumb({ title, cat, size=48, radius=4 }) {
  const c = CAT_ICONS[cat] || { accent:"#E8B870", icon:'<circle cx="30" cy="30" r="14" fill="none" stroke="currentColor" stroke-width="3"/>' };
  return (
    <div style={{ width:size, height:size, borderRadius:radius, flexShrink:0, overflow:"hidden", background:"#000", position:"relative", display:"flex", alignItems:"center", justifyContent:"center", color:c.accent }}>
      <svg width={Math.round(size*0.55)} height={Math.round(size*0.55)} viewBox="0 0 60 60" dangerouslySetInnerHTML={{ __html: c.icon }} />
    </div>
  );
}

// ── TRACK DATA ────────────────────────────────────────────────────────────────
// Category-level shift/benefit templates, used as a fallback description for tracks
// that don't have a hand-written desc yet. Not unique per track, but genuinely tailored
// per category so it's honest content, not generic filler repeated everywhere.
// Guide names per category, shown as "Related guide" in each track's description.
// SHOP_URL is the general storefront for now, swap in real per-product URLs here
// once individual guide listings exist (e.g. GUIDE_URLS["Richgirlmaxxing"] = "https://...").
const SHOP_URL = "https://beacons.ai/reshmaoracle";
const GUIDES_AVAILABLE = new Set(["Lovemaxxing","Luckygirlmaxxing"]);
const CAT_GUIDE = {
  Lovemaxxing:"Lovemaxxing Guide", Selfmaxxing:"Selfmaxxing Guide", Richgirlmaxxing:"Richgirlmaxxing Guide",
  Sleepmaxxing:"Sleepmaxxing Guide", Beautymaxxing:"Beautymaxxing Guide", DNAmaxxing:"DNAmaxxing Guide",
  Luckygirlmaxxing:"Luckygirlmaxxing Guide", Healthmaxxing:"Healthmaxxing Guide", Sovereignmaxxing:"Sovereignmaxxing Guide",
  Lifemaxxing:"Lifemaxxing Guide", Erosmaxxing:"Erosmaxxing Guide", Bodymaxxing:"Bodymaxxing Guide",
  Facemaxxing:"Facemaxxing Guide", Businessmaxxing:"Businessmaxxing Guide", Skinnymaxxing:"Skinnymaxxing Guide",
  Wellnessmaxxing:"Wellnessmaxxing Guide", Studymaxxing:"Studymaxxing Guide", Friendmaxxing:"Friendmaxxing Guide",
  Peacemaxxing:"Peacemaxxing Guide", Confidencemaxxing:"Confidencemaxxing Guide", Stylemaxxing:"Stylemaxxing Guide",
  Intuitionmaxxing:"Intuitionmaxxing Guide", Desiresmaxxing:"Desiresmaxxing Guide",
};
const CAT_DESC = {
  Lovemaxxing: { shift:"This shifts you from feeling like you have to chase, prove, or wonder where you stand, into feeling like the security you want is already yours.",
    benefits:["Stop checking your phone for reassurance","Release anxious attachment patterns","Feel chosen without needing constant proof"] },
  Selfmaxxing: { shift:"This shifts you from shrinking to fit into rooms, into taking up the space you were always allowed to take.",
    benefits:["Stop over-explaining your boundaries","Build quiet, unshakeable self-trust","Feel like yourself even under pressure"] },
  Richgirlmaxxing: { shift:"This shifts you from feeling like money is something you have to fight for, into feeling like it's already looking for you.",
    benefits:["Loosen the grip of financial anxiety","Notice unexpected income without shock","Build the identity of someone money flows toward"] },
  Sleepmaxxing: { shift:"This shifts you from feeling like manifestation takes constant conscious effort, into feeling like your reality rebuilds itself while you're unconscious.",
    benefits:["Turn sleep into productive reprogramming time","Reduce pressure to 'do the work' every waking hour","Wake up already closer to who you're becoming"] },
  Beautymaxxing: { shift:"This shifts you from picking yourself apart in the mirror, into actually seeing what other people already see.",
    benefits:["Quiet the inner critic before it starts","Stop comparing your reflection to old photos","Let compliments land instead of deflecting them"] },
  DNAmaxxing: { shift:"This shifts you from feeling like ageing and genetics are happening to you, into feeling like your body is listening to what you tell it.",
    benefits:["Support your body's natural repair rhythms","Shift the belief that decline is inevitable","Feel more at home in your own skin"] },
  Luckygirlmaxxing: { shift:"This shifts you from feeling like good things happen to other people, into expecting things to work out for you by default.",
    benefits:["Notice small wins you'd normally dismiss","Stop bracing for the worst-case outcome","Build the identity of someone things go right for"] },
  Healthmaxxing: { shift:"This shifts you from carrying old pain as part of your identity, into feeling like the version of you that's already moved through it.",
    benefits:["Process without having to relive every detail","Loosen the grip of stories that no longer serve you","Feel lighter without needing a reason why"] },
  Sovereignmaxxing: { shift:"This shifts you from seeking approval before you act, into trusting your own judgement as enough.",
    benefits:["Stop outsourcing decisions that are yours to make","Feel settled being disliked by the wrong people","Build a quieter, steadier inner authority"] },
  Lifemaxxing: { shift:"This shifts you from waiting for your life to start, into feeling like you're already living the version you used to dream about.",
    benefits:["Notice how far you've already come","Stop postponing joy for 'someday'","Feel present in a life that's actually yours"] },
  Erosmaxxing: { shift:"This shifts you from performing confidence, into actually feeling it, especially in the moments that used to make you shrink.",
    benefits:["Feel present instead of self-conscious","Release old shame around desire","Own your own magnetism without apology"] },
  Bodymaxxing: { shift:"This shifts you from fighting your body, into feeling like it's finally on your side.",
    benefits:["Reduce the mental noise around how you look","Feel strong without needing to prove it","Move through the world without shrinking"] },
  Facemaxxing: { shift:"This shifts you from scrutinising every angle, into feeling settled in how you actually look.",
    benefits:["Stop the mirror-checking spiral","Notice your face without judging it first","Let your features feel like features, not flaws"] },
  Businessmaxxing: { shift:"This shifts you from feeling like you have to force growth, into feeling like your business is already finding its people.",
    benefits:["Reduce the anxiety of inconsistent income","Attract clients without chasing them","Build the identity of someone whose work sells itself"] },
  Skinnymaxxing: { shift:"This shifts you from fighting your body through restriction, into feeling like your body already knows what it's doing.",
    benefits:["Quiet the food-anxiety spiral","Stop tying your worth to the number on a scale","Feel at ease in your body as it changes"] },
  Wellnessmaxxing: { shift:"This shifts you from running on empty and calling it normal, into feeling like your body and mind are finally working together.",
    benefits:["Reduce the background hum of overwhelm","Feel permission to actually rest","Build steadier energy without forcing it"] },
  Studymaxxing: { shift:"This shifts you from feeling like you have to grind to keep up, into feeling like the information already makes sense to you.",
    benefits:["Reduce pre-exam anxiety spirals","Retain information with less repetition","Feel confident walking into the room"] },
  Friendmaxxing: { shift:"This shifts you from settling for a circle that drains you, into attracting people who actually see you.",
    benefits:["Let go of one-sided friendships without guilt","Feel safe being fully yourself around people","Attract a circle that reflects who you're becoming"] },
  Peacemaxxing: { shift:"This shifts you from being on edge waiting for the next thing to go wrong, into feeling steady no matter what happens around you.",
    benefits:["Reduce your baseline anxiety","Stay regulated during hard conversations","Feel calm without needing everything to be perfect"] },
  Confidencemaxxing: { shift:"This shifts you from waiting to feel ready, into walking into rooms like you already belong there.",
    benefits:["Reduce the urge to over-prepare or over-apologise","Speak up without rehearsing it first","Feel steady under other people's opinions"] },
  Stylemaxxing: { shift:"This shifts you from dressing to hide, into dressing like the woman you're already becoming.",
    benefits:["Stop second-guessing your own taste","Feel like your outside matches your inside","Build a wardrobe identity that feels effortless"] },
  Intuitionmaxxing: { shift:"This shifts you from talking yourself out of what you already know, into trusting your first instinct.",
    benefits:["Stop overriding your gut with logic loops","Make decisions faster and with less regret","Feel less need for external validation"] },
  Desiresmaxxing: { shift:"This shifts you from chasing your desires into feeling like they are already chasing you back.",
    benefits:["Reduce the anxiety of being overlooked","Speak up for what you're actually worth","Feel confident taking up space in the room"] },
};
function getDesc(track) {
  return track.desc || CAT_DESC[track.cat] || { shift:"This track is designed to shift the belief underneath the desire it's tied to.", benefits:["Reprogram the belief, not just the behaviour","Listen passively, no active effort required","Track the shift in ProofOS as signs come in"] };
}

const TRACKS = [
  // Only tracks with real audio files on R2
  { id:201, title:"Confidence In My Luck",                 artist:"Reshma Oracle", dur:"10:00", cat:"Luckygirlmaxxing", format:"Hypnosis",   freq:"528hz", tier:"audio", isNew:true, hasAudio:true },
  { id:202, title:"Attract Opportunities",                 artist:"Reshma Oracle", dur:"10:00", cat:"Luckygirlmaxxing", format:"Hypnosis",   freq:"528hz", tier:"audio", isNew:true, hasAudio:true },
  { id:203, title:"Luck Finds Me Everywhere",              artist:"Reshma Oracle", dur:"10:00", cat:"Luckygirlmaxxing", format:"Hypnosis",   freq:"528hz", tier:"audio", isNew:true, hasAudio:true },
  { id:204, title:"Luck Finds Me Everywhere (Subliminal)", artist:"Reshma Oracle", dur:"10:00", cat:"Luckygirlmaxxing", format:"Subliminal", freq:"528hz", tier:"audio", isNew:true, hasAudio:true },
  { id:205, title:"Luck Accelerates Everything",           artist:"Reshma Oracle", dur:"5:00",  cat:"Luckygirlmaxxing", format:"Hypnosis",   freq:"528hz", tier:"audio", isNew:true, hasAudio:true },
  { id:206, title:"My Mind Is a Luck Creator",             artist:"Reshma Oracle", dur:"10:00", cat:"Luckygirlmaxxing", format:"Hypnosis",   freq:"528hz", tier:"audio", isNew:true, hasAudio:true },
  { id:207, title:"I Align What Serves Me",                artist:"Reshma Oracle", dur:"10:00", cat:"Selfmaxxing",      format:"Hypnosis",   freq:"432hz", tier:"audio", isNew:true, hasAudio:true },
  { id:208, title:"My Pace Is My Superpower",              artist:"Reshma Oracle", dur:"10:00", cat:"Selfmaxxing",      format:"Hypnosis",   freq:"432hz", tier:"audio", isNew:true, hasAudio:true },
  { id:209, title:"New Chapters Bring Blessings",          artist:"Reshma Oracle", dur:"10:00", cat:"Lifemaxxing",      format:"Hypnosis",   freq:"528hz", tier:"audio", isNew:true, hasAudio:true },
  { id:1,   title:"Spoilt Goddess",                        artist:"Reshma Oracle", dur:"9:00",  cat:"Selfmaxxing",      format:"Hypnosis",   freq:"528hz", tier:"audio", isNew:true,  hasAudio:true,
    desc:{ shift:"This shifts you from feeling like you have to earn good things happening to you, into feeling like you're already the woman everyone wants to spoil.",
      benefits:["Stop over-giving to feel worthy of receiving","Let people show up for you without guilt","Feel deserving of ease, not just effort"] } },
  { id:2,   title:"Lifetime of Luck",                      artist:"Reshma Oracle", dur:"9:00",  cat:"Luckygirlmaxxing", format:"Hypnosis",   freq:"528hz", tier:"audio", isNew:true,  hasAudio:true },
  { id:3,   title:"Drop The Tension",                      artist:"Reshma Oracle", dur:"5:00",  cat:"Peacemaxxing",     format:"Hypnosis",   freq:"528hz", tier:"audio", isNew:false, hasAudio:true },
  { id:4,   title:"Monica Face",                           artist:"Reshma Oracle", dur:"9:00",  cat:"Facemaxxing",      format:"Hypnosis",   freq:"528hz", tier:"audio", isNew:false, hasAudio:true },
  { id:5,   title:"I Am The Luckiest Woman In This Universe", artist:"Reshma Oracle", dur:"12:00", cat:"Luckygirlmaxxing", format:"Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:true },
  { id:6,   title:"100 Years of Beauty Sleep",             artist:"Reshma Oracle", dur:"6:00",  cat:"Beautymaxxing",    format:"Hypnosis",   freq:"432hz", tier:"audio", isNew:false, hasAudio:true },
];
