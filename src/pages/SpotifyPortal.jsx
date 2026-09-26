import ShgSplash from "../components/ShgSplash.jsx";
import SpeakToProof from "../components/SpeakToProof.jsx";
import GoddessPassport from "../components/GoddessPassport.jsx";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import AnalyticsBoard, { DEMO_ANALYTICS } from "../components/AnalyticsBoard.jsx";
import KnowledgeGuide, { GuideIcon } from "../components/KnowledgeGuide.jsx";
import { ArrowIcon } from "../components/UI.jsx";
import { PushNotificationToggle, PushPromptBanner } from "../components/PushNotifications.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import LogSignModal, { ManifestCelebration } from "../components/LogSignModal.jsx";
import { usePushNotifications } from "../components/PushNotifications.jsx";
import ShopGrid, { PRODUCTS, buyProduct, WorkWithReshma } from "../components/ShopGrid.jsx";

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
  "The Universe Supports Me": "https://shg-audio-worker.airpriestess.workers.dev/UNIVERS%20SUPPORTS%20ME%20HYPNOSIS%2010MIN%2023.08.2026.WAV",
  "The Universe Supports Me (Subliminal)": "https://shg-audio-worker.airpriestess.workers.dev/UNIVERS%20SUPPORTS%20ME%20SUBLIMINAL%2010MIN%2023.08.2026.WAV",
  "I Am The Luckiest Woman In This Universe (Subliminal)": "https://shg-audio-worker.airpriestess.workers.dev/LUCKIEST%20GIRL%20UNIVERSE%20SUBLIMIN%2012MINS%2016.08.2026.WAV",
  // Real tracks - titles match D1 database exactly
  "Spoilt Goddess":                             "https://shg-audio-worker.airpriestess.workers.dev/SPOILT%20BEACONS%20%20HYPNOSIS%209MIN%2013.04.2026.WAV",
  "Lifetime of Luck":                           "https://shg-audio-worker.airpriestess.workers.dev/LIFETIME%20OF%20LUCK%20HYPNOSIS%209MIN%2023.04.2026.WAV",
  "Drop The Tension":                           "https://shg-audio-worker.airpriestess.workers.dev/DROP%20THE%20TENSION%20HYPNOSIS%205MIN%2002.06.2026.WAV",
  "Monica Face":                                "https://shg-audio-worker.airpriestess.workers.dev/MONICA%20FACE%20HYPNOSIS%209MIN%2006.05.2026.WAV",
  "I Am The Luckiest Woman In This Universe":   "https://shg-audio-worker.airpriestess.workers.dev/LUCKIEST%20GIRL%20UNIVERSE%20HYPNOSIS%2012MINS%2014.08.2026.WAV",
  "100 Years of Beauty Sleep":                  "https://shg-audio-worker.airpriestess.workers.dev/100%20YEARS%20OF%20BEAUTY%20SLEEP%20HYPNOSIS%206MIN%2020.04.WAV",
  "Confidence In My Luck":                      "https://shg-audio-worker.airpriestess.workers.dev/CONFIDENCE%20IN%20MY%20LUCK%20HYPNOSIS%2002.09.2026.WAV",
  "Attract Opportunities":                      "https://shg-audio-worker.airpriestess.workers.dev/ATRACT%20OPPORTUNITIES%20HYPNOSIS%2024.08.2026.WAV",
  "I Align What Serves Me":                     "https://shg-audio-worker.airpriestess.workers.dev/I%20ALIGN%20WHAT%20SERVES%20ME%20HYPNOSIS%2001.09.2026.WAV",
  "Luck Accelerates Everything":                "https://shg-audio-worker.airpriestess.workers.dev/LUCK%20ACCELERATES%20EVERYTHING%20IG%2030.08.2026.WAV",
  "Luck Finds Me Everywhere":                   "https://shg-audio-worker.airpriestess.workers.dev/LUCK%20FINDS%20ME%20EVERYWHERE%20HYPNOSIS%2011MIN%2017.08.2026.WAV",
  "Luck Finds Me Everywhere (Subliminal)":      "https://shg-audio-worker.airpriestess.workers.dev/LUCK%20FINDS%20EVERYWHERE%20SUBLIMINAL%2011MIN%2017.08.2026.WAV",
  "My Mind Is a Luck Creator":                  "https://shg-audio-worker.airpriestess.workers.dev/MY%20MIND%20IS%20A%20LUCK%20CREATOR%20SUBLIMINAL%2002.09.2026.WAV",
  "My Pace Is My Superpower":                   "https://shg-audio-worker.airpriestess.workers.dev/MY%20PACE%20IS%20MY%20SUPERPOWER%20SUBLIMINAL%2031.08.2026.WAV",
  "New Chapters Bring Blessings":               "https://shg-audio-worker.airpriestess.workers.dev/NEW%20CHAPTERS%20BRING%20BLESSINGS%20SUBLIMINAL%2001.09.2026.WAV",
};

// ── BEACONS STORE ────────────────────────────────────────────────────────────
const BEACONS = "https://beacons.ai/reshmaoracle"; // update with exact URL
// Workbooks sold in the app. Categories without a PDF yet go to the in-app Shop tab.
async function buyWorkbook(cat) {
  const p = PRODUCTS.find(x => x.name === cat);
  if (!p) { window.dispatchEvent(new Event("shg-go-shop")); return; }
  await buyProduct(p);
}

// ── THEMES ───────────────────────────────────────────────────────────────────
const THEMES = {
  // ── DARK MODE: the deck and workbook system. Black page, cream text, no grey,
  // gradient only as accent. Surfaces still step up (bg → bg2 → bg3 → bg4) so a
  // card reads as its own object — that was the real legibility problem, not the
  // cream. Hierarchy comes from size and weight, never from greying text down.
  dark: {
    bg:      "#000000",
    bg2:     "#141414",   // --card in docs/design/shg-app-design.html
    bg3:     "#1a1a1a",
    bg4:     "#242424",
    nav:     "#000000",
    cr:      "#F2ECE4",
    mu:      "#F2ECE4",
    dim:     "#F2ECE4",
    border:  "rgba(242,236,228,0.22)",  // cream rule, as on the deck's cards
    inputBg: "#0d0d0d",
    inputCr: "#F2ECE4",
    // LG accent colours for labels, icons, active tabs, never backgrounds
    accentGold: "#E8B870",
    accentLav:  "#BFA5D8",
    accentTeal: "#2CB7A7",
    accentChamp:"#F5E0A0",
    accentDeep: "#167A6B",
  },
  // ── LIGHT MODE: full LG gradient wall to wall, solid cream cards on top ──
  // Cards stay opaque (#fdf0e8) so the gradient never bleeds through and text
  // keeps its contrast; the gradient reads as the room, the cards as the paper.
  light: {
    bg:      "#F2ECE4",
    bg2:     "#F2ECE4",
    bg3:     "#F2ECE4",
    bg4:     "#F2ECE4",
    nav:     "#F2ECE4",
    cr:      "#000000",
    mu:      "#000000",
    dim:     "#000000",
    border:  "#000000",
    inputBg: "#F2ECE4",
    inputCr: "#000000",
    accentGold: "#000000",
    accentLav:  "#000000",
    accentTeal: "#000000",
    accentChamp:"#8a6010",
    accentDeep: "#0f5248",
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
  Richgirlmaxxing: { accent:"#E8B870", icon:'<g fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M18 16 H42 L52 27 L30 52 L8 27 Z"/><path d="M8 27 H52 M22 16 L26 27 L30 52 L34 27 L38 16"/></g>' },
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
  Luckygirlmaxxing: { accent:"#F5E0A0", icon:'<g fill="none" stroke="currentColor" stroke-width="3"><circle cx="23" cy="23" r="11"/><circle cx="37" cy="23" r="11"/><circle cx="23" cy="37" r="11"/><circle cx="37" cy="37" r="11"/></g>' },
  Sovereignmaxxing: { accent:"#BFA5D8", icon:'<path d="M14 40 L14 24 L22 32 L30 16 L38 32 L46 24 L46 40 Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>' },
};

// Artwork gradient per accent, kept inside the SHG palette. The icon sits dark on
// top so tiles read the same on a cream page and a black one.
const THUMB_GRADS = {
  "#E8B870": ["#F5E0A0","#E8B870","#BFA5D8"],
  "#BFA5D8": ["#BFA5D8","#E8B870","#F5E0A0"],
  "#2CB7A7": ["#2CB7A7","#167A6B","#BFA5D8"],
  "#F5E0A0": ["#F5E0A0","#2CB7A7","#167A6B"],
};

// Track and category art: a crop of the matching cover (heart, diamond, clover),
// so tracks, Library tiles and the category list all share one icon set.
const CAT_COVER = { Lovemaxxing:"/shop/lovemaxxing.webp", Richgirlmaxxing:"/shop/richgirlmaxxing.webp", Luckygirlmaxxing:"/shop/luckygirlmaxxing.webp" };
// Category art: the icon discs extracted from Reshma's own covers.
const CAT_ICON_IMG = { Lovemaxxing:"/icons/love.webp", Richgirlmaxxing:"/icons/money.webp", Luckygirlmaxxing:"/icons/lucky.webp", Selfmaxxing:"/icons/session.webp", Lifemaxxing:"/icons/track.webp" };
function Thumb({ cat, size=48, radius=4 }) {
  return (
    <div aria-hidden="true" style={{ width:size, height:size, borderRadius:radius, flexShrink:0, overflow:"hidden", position:"relative", background:"#000" }}>
      <img src={CAT_ICON_IMG[cat] || "/icons/lucky.webp"} alt="" loading="lazy" style={{ position:"absolute", inset:"12%", width:"76%", height:"76%", objectFit:"cover", display:"block", borderRadius:"50%" }}/>
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
    benefits:["Stop over-explaining your boundaries","Build calm, unshakeable self-trust","Feel like yourself even under pressure"] },
  Richgirlmaxxing: { shift:"This shifts you from feeling like money is something you have to fight for, into feeling like it's already looking for you.",
    benefits:["Loosen the grip of financial anxiety","Notice unexpected income without shock","Build the identity of someone money flows toward"] },
  Sleepmaxxing: { shift:"This shifts you from feeling like manifestation takes constant conscious effort, into feeling like your reality rebuilds itself while you're unconscious.",
    benefits:["Turn sleep into productive reprogramming time","Reduce pressure to 'do the work' every waking hour","Wake up already closer to who you're becoming"] },
  Beautymaxxing: { shift:"This shifts you from picking yourself apart in the mirror, into actually seeing what other people already see.",
    benefits:["Quiet the inner critic before it starts","Stop comparing your reflection to old photos","Let compliments in instead of deflecting them"] },
  DNAmaxxing: { shift:"This shifts you from feeling like ageing and genetics are happening to you, into feeling like your body is listening to what you tell it.",
    benefits:["Support your body's natural repair rhythms","Shift the belief that decline is inevitable","Feel more at home in your own skin"] },
  Luckygirlmaxxing: { shift:"This shifts you from feeling like good things happen to other people, into expecting things to work out for you by default.",
    benefits:["Notice small wins you'd normally dismiss","Stop expecting the worst","Build the identity of someone things go right for"] },
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
  return track.desc || CAT_DESC[track.cat] || { shift:"This track is designed to shift the belief underneath the desire it's tied to.", benefits:["Reprogram the belief, not just the behaviour","Listen passively, no active effort required","Track the shift in proofOS as signs come in"] };
}

const ALL_TRACKS = [
  // ── NEW TRACKS (Sept 2026) ──────────────────────────────────────────────────
  { id:201, title:"Confidence In My Luck",              artist:"Reshma Oracle", dur:"10:00", cat:"Luckygirlmaxxing", format:"Hypnosis",   freq:"528hz",   tier:"audio", isNew:true, hasAudio:true },
  { id:202, title:"Attract Opportunities",              artist:"Reshma Oracle", dur:"10:00", cat:"Luckygirlmaxxing", format:"Hypnosis",   freq:"528hz",   tier:"audio", isNew:true, hasAudio:true },
  { id:203, title:"Luck Finds Me Everywhere",           artist:"Reshma Oracle", dur:"11:00", cat:"Luckygirlmaxxing", format:"Hypnosis",   freq:"528hz",   tier:"audio", isNew:true, hasAudio:true },
  { id:204, title:"Luck Finds Me Everywhere (Subliminal)", artist:"Reshma Oracle", dur:"11:00", cat:"Luckygirlmaxxing", format:"Subliminal", freq:"528hz", tier:"audio", isNew:true, hasAudio:true },
  { id:205, title:"Luck Accelerates Everything",        artist:"Reshma Oracle", dur:"5:00",  cat:"Luckygirlmaxxing", format:"Hypnosis",   freq:"528hz",   tier:"audio", isNew:true, hasAudio:true },
  { id:206, title:"My Mind Is a Luck Creator",          artist:"Reshma Oracle", dur:"10:00", cat:"Luckygirlmaxxing", format:"Subliminal", freq:"528hz",   tier:"audio", isNew:true, hasAudio:true },
  { id:207, title:"I Align What Serves Me",             artist:"Reshma Oracle", dur:"10:00", cat:"Selfmaxxing",      format:"Hypnosis",   freq:"432hz",   tier:"audio", isNew:true, hasAudio:true },
  { id:208, title:"My Pace Is My Superpower",           artist:"Reshma Oracle", dur:"10:00", cat:"Selfmaxxing",      format:"Subliminal", freq:"432hz",   tier:"audio", isNew:true, hasAudio:true },
  { id:209, title:"New Chapters Bring Blessings",       artist:"Reshma Oracle", dur:"10:00", cat:"Lifemaxxing",      format:"Subliminal", freq:"528hz",   tier:"audio", isNew:true, hasAudio:true },
  { id:210, title:"The Universe Supports Me",          artist:"Reshma Oracle", dur:"10:00", cat:"Lifemaxxing",      format:"Hypnosis",   freq:"528hz",   tier:"audio", isNew:true, hasAudio:true },
  { id:211, title:"The Universe Supports Me (Subliminal)", artist:"Reshma Oracle", dur:"10:00", cat:"Lifemaxxing",   format:"Subliminal", freq:"528hz",   tier:"audio", isNew:true, hasAudio:true },
  { id:212, title:"I Am The Luckiest Woman In This Universe (Subliminal)", artist:"Reshma Oracle", dur:"12:00", cat:"Luckygirlmaxxing", format:"Subliminal", freq:"528hz", tier:"audio", isNew:true, hasAudio:true },
  // ── EXISTING TRACKS ─────────────────────────────────────────────────────────
  { id:101, title:"I'm a Living Breathing Masterpiece", artist:"Reshma Oracle", dur:"20:00", cat:"Beautymaxxing",  format:"Melodic House", freq:"528hz",   tier:"audio", isNew:true, hasAudio:true },
  { id:102, title:"My Desires Are Obsessed With Me",    artist:"Reshma Oracle", dur:"20:00", cat:"Desiresmaxxing", format:"Melodic House", freq:"EMDR",    tier:"audio", isNew:true, hasAudio:true },
  { id:103, title:"Seduced Focus",                      artist:"Reshma Oracle", dur:"20:00", cat:"Selfmaxxing",    format:"Melodic House", freq:"Binaural", tier:"audio", isNew:true, hasAudio:true },
  { id:1,  title:"Spoilt Goddess",           artist:"Reshma Oracle", dur:"4:32",  cat:"Lovemaxxing", format:"Melodic House", tier:"audio",   isNew:true,  hasAudio:true,
    desc:{ shift:"This shifts you from feeling like you have to earn good things happening to you, into feeling like you're already the woman everyone wants to spoil.",
      benefits:["Stop over-giving to feel worthy of receiving","Let people show up for you without guilt","Feel deserving of ease, not just effort"] } },
  { id:2,  title:"He Finds His Way Back",    artist:"Reshma Oracle", dur:"30:00", cat:"Lovemaxxing", format:"Subliminal",    tier:"audio",   isNew:false, hasAudio:false,
    desc:{ shift:"This shifts you from feeling like you have to chase, check your phone, or wonder if he still thinks about you, into feeling secure that he's already finding his way back.",
      benefits:["Stop the anxious phone-checking loop","Release the need to initiate contact first","Feel settled in the outcome instead of controlling it"] } },
  { id:3,  title:"Money Finds Me First",     artist:"Reshma Oracle", dur:"25:00", cat:"Richgirlmaxxing", format:"Melodic House", tier:"audio",   isNew:true,  hasAudio:true,
    desc:{ shift:"This shifts you from feeling like you have to hustle for every pound, into feeling like money is already looking for you.",
      benefits:["Loosen the grip of financial anxiety","Notice unexpected income without shock","Build the identity of someone money flows toward"] } },
  { id:4,  title:"While I Sleep I Manifest", artist:"Reshma Oracle", dur:"60:00", cat:"Sleepmaxxing", format:"Sleep & Rest",  tier:"audio",   isNew:false, hasAudio:false,
    desc:{ shift:"This shifts you from feeling like manifestation requires constant conscious effort, into feeling like your reality can rebuild itself while you're unconscious.",
      benefits:["Turn sleep into productive reprogramming time","Reduce the pressure to 'do the work' every waking hour","Wake up already closer to who you're becoming"] } },
  { id:5,  title:"Gorgeous Is My Default",   artist:"Reshma Oracle", dur:"35:00", cat:"Beautymaxxing", format:"528hz",         tier:"audio",   isNew:false, hasAudio:false },
  { id:6,  title:"DNA Activation Ceremony",  artist:"Reshma Oracle", dur:"45:00", cat:"DNAmaxxing", format:"Reiki",         tier:"goddess", isNew:false, hasAudio:false },
  { id:7,  title:"Lucky Girl Summer",        artist:"Reshma Oracle", dur:"22:00", cat:"Luckygirlmaxxing", format:"Subliminal", tier:"audio", isNew:true,  hasAudio:false },
  { id:8,  title:"10 Years Into One Hour",   artist:"Reshma Oracle", dur:"58:00", cat:"Healthmaxxing", format:"EMDR",          tier:"audio",   isNew:false, hasAudio:true  },
  { id:9,  title:"Highest Timeline",         artist:"Reshma Oracle", dur:"28:00", cat:"Sovereignmaxxing", format:"Reiki",         tier:"goddess", isNew:false, hasAudio:false },
  { id:10, title:"My face is his favourite view", artist:"Reshma Oracle", dur:"20:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:11, title:"Even my details are exquisite", artist:"Reshma Oracle", dur:"15:00", cat:"Beautymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:12, title:"My mornings open like a film I star in", artist:"Reshma Oracle", dur:"15:00", cat:"Lifemaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:13, title:"Youth keeps renewing its lease in my body", artist:"Reshma Oracle", dur:"15:00", cat:"DNAmaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:14, title:"His eyes follow me around the room", artist:"Reshma Oracle", dur:"15:00", cat:"Erosmaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:15, title:"I make rich decisions on instinct", artist:"Reshma Oracle", dur:"15:00", cat:"Richgirlmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:16, title:"I chose me first and he followed", artist:"Reshma Oracle", dur:"20:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:17, title:"I take up space like it was saved for me", artist:"Reshma Oracle", dur:"15:00", cat:"Selfmaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:18, title:"Every season of my life outdoes the last", artist:"Reshma Oracle", dur:"15:00", cat:"Lifemaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:19, title:"I am the vision board breathing", artist:"Reshma Oracle", dur:"15:00", cat:"Lifemaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:20, title:"Loving me is the easiest thing he does", artist:"Reshma Oracle", dur:"15:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:21, title:"My body and I are in perfect agreement", artist:"Reshma Oracle", dur:"15:00", cat:"Bodymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:22, title:"Barefaced is my boldest look", artist:"Reshma Oracle", dur:"15:00", cat:"Beautymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:23, title:"My skin is clear calm and committed", artist:"Reshma Oracle", dur:"15:00", cat:"Facemaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:24, title:"Every day is a payday somewhere in my life", artist:"Reshma Oracle", dur:"15:00", cat:"Richgirlmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:25, title:"Peace is my personality now", artist:"Reshma Oracle", dur:"15:00", cat:"Selfmaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:26, title:"His actions and his words tell the same story", artist:"Reshma Oracle", dur:"15:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:27, title:"The right audience found me and keeps growing", artist:"Reshma Oracle", dur:"20:00", cat:"Businessmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:28, title:"My name gets drawn from every hat", artist:"Reshma Oracle", dur:"15:00", cat:"Luckygirlmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:29, title:"My biology takes orders from my imagination", artist:"Reshma Oracle", dur:"15:00", cat:"DNAmaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:30, title:"My face belongs in campaigns and it knows it", artist:"Reshma Oracle", dur:"15:00", cat:"Facemaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:31, title:"My body is the outfit and everything else is accessories", artist:"Reshma Oracle", dur:"15:00", cat:"Bodymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:32, title:"Love and money arrived holding hands", artist:"Reshma Oracle", dur:"20:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:33, title:"Every area of my life said yes at the same time", artist:"Reshma Oracle", dur:"15:00", cat:"Lifemaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:34, title:"Another zero joined my account balance", artist:"Reshma Oracle", dur:"15:00", cat:"Richgirlmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:35, title:"He plans our future in present tense", artist:"Reshma Oracle", dur:"20:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:36, title:"I negotiate like a woman with options", artist:"Reshma Oracle", dur:"20:00", cat:"Businessmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:37, title:"Life keeps slipping gifts into my pockets", artist:"Reshma Oracle", dur:"15:00", cat:"Luckygirlmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:38, title:"My beauty deepens like a vintage year", artist:"Reshma Oracle", dur:"15:00", cat:"Beautymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:39, title:"I became my own dream girl", artist:"Reshma Oracle", dur:"15:00", cat:"Selfmaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:40, title:"My face belongs in campaigns and it knows it", artist:"Reshma Oracle", dur:"15:00", cat:"Facemaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:41, title:"He speaks my love language fluently", artist:"Reshma Oracle", dur:"15:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:42, title:"My smile is my most expensive feature", artist:"Reshma Oracle", dur:"15:00", cat:"Facemaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:43, title:"I stumble into blessings on ordinary errands", artist:"Reshma Oracle", dur:"15:00", cat:"Luckygirlmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:44, title:"My calendar fills with dream clients", artist:"Reshma Oracle", dur:"20:00", cat:"Businessmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:45, title:"I am the centre of his world and he built it that way", artist:"Reshma Oracle", dur:"15:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:46, title:"Strength looks stunning on me", artist:"Reshma Oracle", dur:"15:00", cat:"Bodymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:47, title:"My standards raised and money rose to meet them", artist:"Reshma Oracle", dur:"15:00", cat:"Richgirlmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:48, title:"Compliments follow me like perfume", artist:"Reshma Oracle", dur:"15:00", cat:"Beautymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:49, title:"My cells drink light like champagne", artist:"Reshma Oracle", dur:"15:00", cat:"DNAmaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:50, title:"I live in the home I once screenshotted", artist:"Reshma Oracle", dur:"15:00", cat:"Richgirlmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:51, title:"He looks at me like I hung the moon", artist:"Reshma Oracle", dur:"15:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:52, title:"First class is my natural habitat", artist:"Reshma Oracle", dur:"15:00", cat:"Richgirlmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:53, title:"My empire pays me in freedom", artist:"Reshma Oracle", dur:"20:00", cat:"Businessmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:54, title:"I am the muse and the masterpiece", artist:"Reshma Oracle", dur:"20:00", cat:"Beautymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:55, title:"My body sculpts itself while I rest", artist:"Reshma Oracle", dur:"15:00", cat:"Bodymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:56, title:"My face is my fortune and it keeps appreciating", artist:"Reshma Oracle", dur:"20:00", cat:"Facemaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:57, title:"Every cell in me is tuned to gorgeous", artist:"Reshma Oracle", dur:"15:00", cat:"DNAmaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:58, title:"Wealth is written into my name", artist:"Reshma Oracle", dur:"15:00", cat:"Richgirlmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:59, title:"He looks at me like I hung the moon", artist:"Reshma Oracle", dur:"15:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:60, title:"My inner world is a luxury residence", artist:"Reshma Oracle", dur:"15:00", cat:"Selfmaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:61, title:"I fall asleep loved and wake up chosen", artist:"Reshma Oracle", dur:"20:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:62, title:"I am lucky in love specifically", artist:"Reshma Oracle", dur:"20:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:63, title:"My side profile is a masterpiece", artist:"Reshma Oracle", dur:"15:00", cat:"Facemaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:64, title:"My whole life entered its golden era", artist:"Reshma Oracle", dur:"15:00", cat:"Lifemaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:65, title:"I am the CEO of a business that adores me", artist:"Reshma Oracle", dur:"20:00", cat:"Businessmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:66, title:"The best outcomes are reserved under my name", artist:"Reshma Oracle", dur:"15:00", cat:"Luckygirlmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:67, title:"I am the woman I answer to", artist:"Reshma Oracle", dur:"15:00", cat:"Selfmaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:68, title:"I am on the payroll of the universe", artist:"Reshma Oracle", dur:"15:00", cat:"Richgirlmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:69, title:"Golden hour follows me around", artist:"Reshma Oracle", dur:"15:00", cat:"Beautymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:70, title:"My curves arrived exactly as ordered", artist:"Reshma Oracle", dur:"15:00", cat:"Bodymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:71, title:"I am his peace and his favourite place", artist:"Reshma Oracle", dur:"15:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:72, title:"Money multiplies the moment it reaches my hands", artist:"Reshma Oracle", dur:"15:00", cat:"Richgirlmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:73, title:"Vitality pours through every cell of me", artist:"Reshma Oracle", dur:"15:00", cat:"DNAmaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:74, title:"My body speaks a language everyone wants to learn", artist:"Reshma Oracle", dur:"15:00", cat:"Erosmaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:75, title:"My body moves like it knows it is admired", artist:"Reshma Oracle", dur:"15:00", cat:"Bodymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:76, title:"My eyes are the first thing people fall for", artist:"Reshma Oracle", dur:"15:00", cat:"Beautymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:77, title:"He closes the distance and comes back to me", artist:"Reshma Oracle", dur:"20:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:78, title:"He spoils me because he adores me", artist:"Reshma Oracle", dur:"15:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:79, title:"I am the name they put on the waitlist for", artist:"Reshma Oracle", dur:"20:00", cat:"Businessmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:80, title:"I wake up inside the life I used to dream about", artist:"Reshma Oracle", dur:"15:00", cat:"Lifemaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:81, title:"The universe treats me like its favourite", artist:"Reshma Oracle", dur:"15:00", cat:"Luckygirlmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:82, title:"Money is calm and safe in my life now", artist:"Reshma Oracle", dur:"15:00", cat:"Richgirlmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:83, title:"A large sum is already on its way to me", artist:"Reshma Oracle", dur:"15:00", cat:"Richgirlmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:84, title:"My face looks lifted sculpted and snatched", artist:"Reshma Oracle", dur:"15:00", cat:"Facemaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:85, title:"He wants forever and he says so out loud", artist:"Reshma Oracle", dur:"20:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:86, title:"My phone lights up and it is always him", artist:"Reshma Oracle", dur:"15:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:87, title:"Certainty is my natural state now", artist:"Reshma Oracle", dur:"15:00", cat:"Selfmaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:88, title:"My body runs light and burns bright", artist:"Reshma Oracle", dur:"15:00", cat:"Bodymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:89, title:"I won the genetic lottery and it shows", artist:"Reshma Oracle", dur:"15:00", cat:"DNAmaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:90, title:"Every light turns green when I arrive", artist:"Reshma Oracle", dur:"15:00", cat:"Luckygirlmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:91, title:"Every room notices the moment I walk in", artist:"Reshma Oracle", dur:"15:00", cat:"Beautymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:92, title:"I am the rich woman I decided to become", artist:"Reshma Oracle", dur:"20:00", cat:"Richgirlmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:93, title:"I wake up prettier than the day before", artist:"Reshma Oracle", dur:"15:00", cat:"Facemaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:94, title:"He cannot get me out of his head", artist:"Reshma Oracle", dur:"15:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:95, title:"I glow up and he falls deeper", artist:"Reshma Oracle", dur:"20:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:96, title:"Unexpected money keeps finding me", artist:"Reshma Oracle", dur:"15:00", cat:"Richgirlmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:97, title:"My hair is thick and my glow is loud", artist:"Reshma Oracle", dur:"15:00", cat:"Beautymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:98, title:"I am my own favourite person", artist:"Reshma Oracle", dur:"15:00", cat:"Selfmaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:99, title:"Good things chase me down", artist:"Reshma Oracle", dur:"15:00", cat:"Luckygirlmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:100, title:"Money comes to me for being exactly who I am", artist:"Reshma Oracle", dur:"20:00", cat:"Businessmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },

  { id:104, title:"Everything works out in my favour without exception", artist:"Reshma Oracle", dur:"15:00", cat:"Luckygirlmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:105, title:"He is obsessed with coming home to me", artist:"Reshma Oracle", dur:"15:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:106, title:"My business is scaling while I sleep", artist:"Reshma Oracle", dur:"20:00", cat:"Businessmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:107, title:"My face is rearranging itself into perfection", artist:"Reshma Oracle", dur:"15:00", cat:"Facemaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:108, title:"I glow like I am lit from the inside", artist:"Reshma Oracle", dur:"15:00", cat:"Beautymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:109, title:"My cells are rewriting me younger every night", artist:"Reshma Oracle", dur:"15:00", cat:"DNAmaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
];
// Only tracks that can actually be played. Nothing unavailable is shown.
const TRACKS = ALL_TRACKS.filter(t => AUDIO_URLS[t.title]);
const LIVE_CATS = new Set(TRACKS.map(t => t.cat));
const FORMATS = ["All","Hypnosis","Subliminal"];

// Suggests the best-matching track for a saved intention: category match is required,
// then ranks by keyword overlap between the intention text and the track title.
const STOPWORDS = new Set(["i","a","the","to","my","me","am","is","are","that","this","of","in","on","for","and","with","it","be","have","has"]);
function suggestTrack(desireText, category) {
  const candidates = TRACKS.filter(t => t.cat === category);
  if (candidates.length === 0) return null;
  const words = (desireText||"").toLowerCase().match(/[a-z']+/g) || [];
  const keywords = words.filter(w => w.length > 2 && !STOPWORDS.has(w));
  if (keywords.length === 0) return candidates[0];
  let best = candidates[0], bestScore = -1;
  for (const t of candidates) {
    const titleWords = t.title.toLowerCase().match(/[a-z']+/g) || [];
    const score = keywords.reduce((acc,kw) => acc + (titleWords.some(tw => tw.includes(kw) || kw.includes(tw)) ? 1 : 0), 0);
    if (score > bestScore) { bestScore = score; best = t; }
  }
  return best;
}

const RECENT = TRACKS.slice(0,6).map(t=>t.title);

// Strip format suffixes from display titles — format is shown as a tag, not in the title
const FORMAT_SUFFIXES = /\s*\((Subliminal|Hypnosis|Melodic Hypnosis|Melodic Subliminal|Calm Hypnosis|Calm Subliminal|Self Hypnosis|Sleep & Rest|Reiki|EMDR|528hz|432hz)\)\s*$/i;
const displayTitle = (title) => title.replace(FORMAT_SUFFIXES, "").trim();

const INIT_THREADS = [
  { id:1, desire:"He texts me first",     days:14, done:true,  track:"The Universe Supports Me", category:"Lovemaxxing",
    feelBefore:"Anxious. Checking my phone constantly.", feelAfter:"Calm. It was always inevitable.",
    createdAt:"6 Jun 2026",
    signs:[ {text:"Saw his name 3 times in one day",date:"12 Jun"}, {text:"Dreamt we were talking",date:"15 Jun"}, {text:"Screenshot, the text arrived",date:"19 Jun",img:"https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop&auto=format"}, {text:"Voice note, the moment I found out",date:"20 Jun",audio:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"} ], manifestedAt:"20 Jun 2026" },
  { id:2, desire:"$5,000 arrives",        days:6,  done:false, track:"Money Finds Me First",  category:"Rich Girl",
    feelBefore:"Tight and worried about money.", feelAfter:"",
    createdAt:"22 Jun 2026",
    signs:[ {text:"Got a random refund $180",date:"28 Jun",img:"https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=400&fit=crop&auto=format"}, {text:"Found $20 in my coat pocket",date:"1 Jul"} ] },
  { id:3, desire:"10k per day business",  days:9,  done:false, track:"Spoilt Goddess",        category:"Rich Girl",
    feelBefore:"Doubtful but hopeful.", feelAfter:"",
    createdAt:"21 Jun 2026",
    signs:[ {text:"Two new enquiries the same day",date:"30 Jun"} ] },
  { id:4, desire:"Skin visibly glowing",  days:3,  done:false, track:"Gorgeous Is My Default",category:"Beauty",
    feelBefore:"Self-conscious without makeup.", feelAfter:"",
    createdAt:"29 Jun 2026",
    signs:[ {text:"Colleague asked what I changed",date:"2 Jul"} ] },
  { id:5, desire:"Fully paid trip to Bali", days:31, done:true, track:"Lucky Girl Summer", category:"Luckygirlmaxxing",
    feelBefore:"Convinced holidays like this only happened to other people.", feelAfter:"Still processing that this actually happened to me.",
    createdAt:"14 Feb 2026",
    signs:[ {text:"Friend mentioned a trip out of nowhere",date:"2 Mar"}, {text:"Won a giveaway I forgot I entered",date:"9 Mar"}, {text:"Screenshot, flights confirmed, fully paid",date:"17 Mar",img:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop&auto=format"} ], manifestedAt:"17 Mar 2026" },
  { id:6, desire:"All 5 desires manifested",     days:22, done:true,  track:"My Desires Are Obsessed With Me", category:"Desiresmaxxing",
    feelBefore:"Overworked and overlooked. Tired of proving myself.", feelAfter:"Relief. Like I could finally exhale.",
    createdAt:"3 Nov 2025",
    signs:[ {text:"Manager asked to lead the project I wanted",date:"14 Nov"}, {text:"Offer letter arrived",date:"25 Nov"} ], manifestedAt:"25 Nov 2025" },
  { id:7, desire:"Won $850 on a scratch card", days:2, done:true, track:"Money Finds Me First", category:"Rich Girl",
    feelBefore:"Skeptical this stuff even works.", feelAfter:"Shocked. Genuinely shocked.",
    createdAt:"8 Sep 2025",
    signs:[ {text:"Bought it on a whim",date:"9 Sep"}, {text:"Screenshot, the win",date:"10 Sep",img:"https://images.unsplash.com/photo-1518183214770-9cffbec72538?w=400&h=400&fit=crop&auto=format"} ], manifestedAt:"10 Sep 2025" },
  { id:8, desire:"Best friend reached out first", days:45, done:true, track:"Friendmaxxing Guide", category:"Friendmaxxing",
    feelBefore:"Grieving a friendship I thought was over.", feelAfter:"Full circle. Grateful.",
    createdAt:"19 Jan 2026",
    signs:[ {text:"Saw an old photo of us randomly",date:"14 Feb"}, {text:"She texted, 'I miss you'",date:"5 Mar"} ], manifestedAt:"5 Mar 2026" },
];

// Category → proof wall colours (matches landing Proof Wall)
const CAT_GRAD = { "Lovemaxxing":"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", "Rich Girl":"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", "Beauty":"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", "Identity":"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", "DNA":"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", "Sleep":"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", "Lovemaxxing2":"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", "Desiresmaxxing":"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", "Beautymaxxing":"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", "Facemaxxing":"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", "Bodymaxxing":"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", "Richgirlmaxxing":"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", "Businessmaxxing":"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", "DNAmaxxing":"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", "Selfmaxxing":"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", "Erosmaxxing":"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", "Lifemaxxing":"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", "Luckygirlmaxxing":"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", "Sovereignmaxxing":"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", "Healthmaxxing":"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", "Peacemaxxing":"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", "Wellnessmaxxing":"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", "Confidencemaxxing":"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", "Skinnymaxxing":"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", "Singlemaxxing":"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", "Friendmaxxing":"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)" };
// Lucky Girl gradient stops, cycled in fixed order so category badges read as a deliberate spectrum, not a random clash
const LG_STOPS = ["#F5E0A0", "#E8B870", "#BFA5D8", "#2CB7A7", "#167A6B"];
const CAT_COLOR = { "Lovemaxxing":"#F5E0A0", "Rich Girl":"#E8B870", "Beauty":"#BFA5D8", "Identity":"#2CB7A7", "DNA":"#167A6B", "Sleep":"#F5E0A0", "Beautymaxxing":"#E8B870", "Facemaxxing":"#BFA5D8", "Bodymaxxing":"#2CB7A7", "Richgirlmaxxing":"#167A6B", "Businessmaxxing":"#F5E0A0", "DNAmaxxing":"#E8B870", "Selfmaxxing":"#BFA5D8", "Erosmaxxing":"#2CB7A7", "Lifemaxxing":"#167A6B", "Luckygirlmaxxing":"#F5E0A0", "Sovereignmaxxing":"#E8B870", "Healthmaxxing":"#BFA5D8", "Peacemaxxing":"#2CB7A7", "Wellnessmaxxing":"#167A6B", "Confidencemaxxing":"#F5E0A0", "Skinnymaxxing":"#E8B870", "Singlemaxxing":"#BFA5D8" };

// ── SVG ICONS ────────────────────────────────────────────────────────────────
const Ico = {
  Community: ({a,c})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?c||"#fff":(c||"rgba(253,240,232,0.45)")} strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="8" r="3.2"/><circle cx="5" cy="10" r="2.4"/><circle cx="19" cy="10" r="2.4"/><path d="M6.5 20c0-3 2.5-5.5 5.5-5.5s5.5 2.5 5.5 5.5M1.5 18.5c.3-2 1.8-3.6 3.8-3.9M22.5 18.5c-.3-2-1.8-3.6-3.8-3.9"/></svg>,
  Home:   ({a,c})=><svg width="22" height="22" viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" fill={a?c||"#fff":"none"} stroke={a?c||"#fff":(c||"rgba(253,240,232,0.45)")} strokeWidth="1.8"/></svg>,
  Search: ({a,c})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?c||"#fff":(c||"rgba(253,240,232,0.45)")} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Lib:    ({a,c})=><svg width="22" height="22" viewBox="0 0 24 24" fill={a?c||"#fff":(c||"rgba(253,240,232,0.45)")}><path d="M3 3h4v18H3zM9 3h2v18H9zM14 3l7 2.5v13L14 21z"/></svg>,
  Proof:  ({a,c})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?R:(c||"rgba(253,240,232,0.45)")} strokeWidth="1.8" strokeLinecap="round"><path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h9"/></svg>,
  Play:   ({dark})=><svg width="18" height="18" viewBox="0 0 24 24" fill={dark?"#000":"#fff"}><polygon points="6 3 20 12 6 21"/></svg>,
  Pause:  ({dark})=><svg width="18" height="18" viewBox="0 0 24 24" fill={dark?"#000":"#fff"}><rect x="6" y="4" width="4" height="16" rx="1.5"/><rect x="14" y="4" width="4" height="16" rx="1.5"/></svg>,
  Heart:  ({on})=><svg width="18" height="18" viewBox="0 0 24 24" fill={on?R:"none"} stroke={on?R:"rgba(253,240,232,0.45)"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l7.84-7.84 1.06-1.06a5.5 5.5 0 000-7.72z"/></svg>,
  Lock:   ()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F2ECE4" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  Edit:   ({c})=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||(c||"rgba(253,240,232,0.45)")} strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Undo:   ({c})=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||(c||"rgba(253,240,232,0.45)")} strokeWidth="2" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>,
  Star:   ({on,c})=><svg width="16" height="16" viewBox="0 0 24 24" fill={on?P:"none"} stroke={on?P:c||(c||"rgba(253,240,232,0.45)")} strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Cog:    ({c})=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c||(c||"rgba(253,240,232,0.45)")} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  Book:   ({c})=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c||(c||"rgba(253,240,232,0.45)")} strokeWidth="1.8" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
  Shop:   ({a,c})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?c||"#fff":(c||"rgba(253,240,232,0.45)")} strokeWidth="1.8" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
  Stats:  ({a,c})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?c||"#fff":(c||"rgba(253,240,232,0.45)")} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
};

// ── MAIN ─────────────────────────────────────────────────────────────────────
function SpotifyPortalInner({ onHome, onSignOut, isPreview=false, forceMode=null, forceTheme=null, initialTab="home", userTier="audio", userName="you" }) {
  const { session, token } = useAuth();
  const userId = session?.user?.id;
  const [pushDismissed, setPushDismissed] = useState(false);
  const [tab, setTab]         = useState(initialTab);
  // Every dark card in the main area becomes cream graph paper, so the whole
  // portal reads the same way. Runs after each render of the current tab.
  useEffect(() => {
    const dark = /rgb\((1[0-9]|2[0-4]), (1[0-9]|2[0-4]), (1[0-9]|2[0-4])\)/;
    const paint = () => document.querySelectorAll('[data-portal-theme] div, [data-portal-theme] button').forEach(el => {
      if (el.classList.contains('shg-paper') || el.closest('.shg-no-paper')) return;
      const cs = getComputedStyle(el); if (parseFloat(cs.borderTopLeftRadius) < 10) return;
      const r = el.getBoundingClientRect(); if (r.width < 150 || r.height < 56) return;
      if (window.innerWidth > 900 && r.right < 300) return;
      // Skip the player bar and other small fixed strips, not the full-screen shell.
      for (let a = el; a && a !== document.body; a = a.parentElement) { if (getComputedStyle(a).position === 'fixed') return; }
      if (dark.test(cs.backgroundColor) || dark.test(cs.backgroundImage)) el.classList.add('shg-paper');
    });
    paint(); const mo = new MutationObserver(() => requestAnimationFrame(paint));
    mo.observe(document.body, { childList:true, subtree:true });
    return () => mo.disconnect();
  }, [tab]);
  const [track, setTrack]     = useState(TRACKS[0]);
  const [playing, setPlay]    = useState(false);
  const [isLooping, setLooping] = useState(false);
  const [showUpgradeReminder, setShowUpgradeReminder] = useState(false);
  useEffect(() => {
    if (userTier === "audio" && !isPreview) {
      const t = setTimeout(() => setShowUpgradeReminder(true), 4000);
      return () => clearTimeout(t);
    }
  }, [userTier, isPreview]);
  const [liked, setLiked]     = useState(new Set([1,3,7]));
  const [fullP, setFullP]     = useState(false);
  const [showDesc, setShowDesc] = useState(false);
  // Every track has its own address: /portal/track/<name>. Opening the player sets it,
  // and visiting it opens that track straight in the player.
  const slugOf = (t) => (t?.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  useEffect(() => {
    const m = window.location.pathname.match(/^\/portal\/track\/([^/?#]+)/);
    if (!m) return;
    const found = TRACKS.find(t => slugOf(t) === decodeURIComponent(m[1]));
    if (!found) return;
    setTrack(found);
    if (window.innerWidth > 768) setShowDesc(true); else setFullP(true);
  }, []);
  useEffect(() => {
    const open = showDesc || fullP;
    const want = open ? `/portal/track/${slugOf(track)}` : "/portal";
    if (window.location.pathname !== want) window.history.replaceState(null, "", want + window.location.search);
  }, [showDesc, fullP, track]);
  const [prog, setProg]       = useState(0);
  const [searchQ, setQ]       = useState("");
  const [libCat, setLibCat]   = useState("All");
  const [libFormat, setLibFormat] = useState("All");
  const threadsCacheKey = `shg_threads_cache_${userId || "guest"}`;
  const [threads, setThreads] = useState(() => { if (!isPreview) { try { const c = JSON.parse(localStorage.getItem(threadsCacheKey) || "null"); if (Array.isArray(c)) return c; } catch {} return []; } try { const saved = JSON.parse(localStorage.getItem("shg_preview_threads") || "null"); if (Array.isArray(saved) && saved.length) return saved; } catch {} return INIT_THREADS; });
  // The beta keeps what you add on this device, so a new intention doesn't vanish when you move around.
  useEffect(() => { if (!isPreview) return; try { localStorage.setItem("shg_preview_threads", JSON.stringify(threads.map(t => ({ ...t, signs: (t.signs || []).map(sg => ({ ...sg, img: sg.img && sg.img.startsWith("blob:") ? null : sg.img, audio: sg.audio && sg.audio.startsWith("blob:") ? null : sg.audio })) })))); } catch {} }, [threads, isPreview]);
  const [threadsLoaded, setThreadsLoaded] = useState(isPreview);
  useEffect(() => {
    const goBucket = () => { setProofFilter?.("all"); setTab("proof"); setTimeout(()=>window.dispatchEvent(new Event("shg-view-bucket")),50); };
    window.addEventListener("shg-go-bucket", goBucket);
    const goWall = () => { setProofFilter?.("all"); setTab("proof"); setTimeout(()=>window.dispatchEvent(new Event("shg-view-wall")),50); };
    window.addEventListener("shg-go-wall", goWall);
    return () => { window.removeEventListener("shg-go-wall", goWall); window.removeEventListener("shg-go-bucket", goBucket); };
  }, []);
  useEffect(() => {
    const openPp = () => { setFullP(false); setPassportPage(0); setProfileOpen(true); };
    window.addEventListener("shg-open-passport", openPp);
    return () => window.removeEventListener("shg-open-passport", openPp);
  }, []);
  useEffect(() => {
    const goShop = () => { setFullP(false); setTab("shop"); };
    window.addEventListener("shg-go-shop", goShop);
    return () => window.removeEventListener("shg-go-shop", goShop);
  }, []);
  useEffect(() => {
    const onGuide = e => setShowGuide(e.detail || true);
    window.addEventListener("shg-open-guide", onGuide);
    return () => window.removeEventListener("shg-open-guide", onGuide);
  }, []);
  // The mini player appears the first time a track plays and then stays, even when paused.
  const [everPlayed, setEverPlayed] = useState(false);
  useEffect(() => { if (playing) setEverPlayed(true); }, [playing]);
  const [logSignOpen, setLogSignOpen] = useState(false);
  const [hideFab, setHideFab] = useState(() => { try { return localStorage.getItem("shg_hide_fab") === "1"; } catch { return false; } });
  useEffect(() => {
    const show = () => { try { localStorage.removeItem("shg_hide_fab"); } catch {} setHideFab(false); };
    window.addEventListener("shg-show-fab", show);
    return () => window.removeEventListener("shg-show-fab", show);
  }, []);
  const [celebThread, setCelebThread] = useState(null);
  useEffect(() => {
    if (isPreview || !userId || !token) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await quizApi("/threads", token, { method: "GET" });
        if (cancelled) return;
        const mapped = (data.threads || []).map(t => ({
          id: t.id,
          desire: t.desire,
          category: t.category || "",
          track: t.track || "",
          oldBelief: t.old_belief || "",
          feelBefore: t.feel_before || "",
          feelAfter: t.feel_after || "",
          days: t.created_at ? Math.floor((Date.now() - new Date(t.created_at)) / 86400000) : 0,
          done: !!t.done,
          isBucket: !!t.is_bucket,
          createdAt: t.created_at,
          manifestedAt: t.manifested_at || null,
          signs: (t.signs || []).map(s => ({ _sid: s.id, text: s.text || "", date: s.date || "", img: s.img || null, audio: s.audio || null })),
        }));
        // Keep the local copy if the server has nothing yet (e.g. saves made offline).
        setThreads(prev => (mapped.length || !prev.length) ? mapped : prev);
      } catch (err) {
        console.error("Failed to load threads:", err);
      } finally {
        if (!cancelled) setThreadsLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, [userId, isPreview, token]);
  const [passportPage, setPassportPage] = useState(null);
  const [theme, setTheme]     = useState(() => { try { return forceTheme || localStorage.getItem("shg_theme") || "dark"; } catch { return forceTheme || "dark"; } });
  useEffect(() => { try { localStorage.setItem("shg_theme", theme); } catch {} }, [theme]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [listenCount, setListenCount] = useState(() => { if (isPreview) return 127; try { return (JSON.parse(localStorage.getItem("shg_listen_log") || "[]")).length; } catch { return 0; } });
  // Local copy of real intentions so Analytics has data even offline or before the server answers.
  useEffect(() => { if (isPreview) return; try { localStorage.setItem(threadsCacheKey, JSON.stringify(threads.map(t => ({ ...t, signs:(t.signs||[]).map(sg => ({ ...sg, img: sg.img && String(sg.img).startsWith("data:") ? undefined : sg.img, audio: sg.audio && String(sg.audio).startsWith("data:") ? undefined : sg.audio })) })))); } catch {} }, [threads, isPreview, threadsCacheKey]);
  // Seeded 30-day emotional log — Reshma's real arc: started in anxiety, shifted decisively to Love/Peace
  const [emoLog, setEmoLog] = useState(()=>{
    // Real members start empty; only the preview shows a sample 30-day arc.
    if (!isPreview) return [];
    const arr=[]; const now=Date.now();
    const path=["Fear","Desire","Anger","Desire","Pride","Courage","Neutrality","Courage","Willingness","Acceptance","Willingness","Acceptance","Reason","Acceptance","Love","Acceptance","Love","Love","Joy","Love","Love","Peace","Love","Peace","Joy","Peace","Love","Peace","Love","Peace"];
    for (let i=29;i>=0;i--) arr.push({date:new Date(now-i*86400000).toISOString().slice(0,10),level:path[29-i]});
    return arr;
  });
  const emoKey = userId ? `shg_emo_${userId}` : null;
  useEffect(() => { if (isPreview || !emoKey) return; try { const saved = JSON.parse(localStorage.getItem(emoKey) || "[]"); if (Array.isArray(saved)) setEmoLog(saved); } catch {} }, [emoKey, isPreview]);
  useEffect(() => { if (isPreview || !emoKey) return; try { localStorage.setItem(emoKey, JSON.stringify(emoLog)); } catch {} }, [emoLog, emoKey, isPreview]);
  useEffect(() => {
    if (isPreview || !userId || !token) return;
    quizApi("/listen-history", token, { method: "GET" }).then(d => setListenCount(n => Math.max(n, (d.events || []).length))).catch(() => {});
  }, [userId, token, isPreview]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onbStep, setOnbStep] = useState(0);
  const [onbGoals, setOnbGoals] = useState([]);
  const [onbWhere, setOnbWhere] = useState("");
  const [onbFreq, setOnbFreq] = useState("");
  useEffect(() => {
    // ?onboarding=1 forces the quiz open, so the flow can be demoed from a
    // preview link. Preview otherwise skips it — a cold visitor shouldn't hit
    // ten questions before seeing anything.
    const forced = new URLSearchParams(window.location.search).get("onboarding") === "1";
    if (forced) { setShowOnboarding(true); return; }
    if (isPreview || !userId || !threadsLoaded) return;
    const key = `shg_onboarded_${userId}`;
    try { if (localStorage.getItem(key)) return; } catch {}
    setShowOnboarding(true);
  }, [userId, isPreview, threadsLoaded]);
  const finishOnboarding = async (answers = {}) => {
    const key = `shg_onboarded_${userId}`;
    try { localStorage.setItem(key, "1"); } catch {}
    setShowOnboarding(false);
    const email = session?.user?.email;
    if (email) {
      try {
        await quizApi("/", null, {
          method: "POST",
          body: JSON.stringify({
            email,
            name: userName !== "you" ? userName : undefined,
            result_category: onbGoals.join(", "),
            source: "onboarding_quiz",
          }),
        });
      } catch {}
    }
    // The quiz asks ten questions; only the goal list used to survive it. Keep
    // the rest so analytics can answer a member with their own words later.
    if (token && answers.specific) {
      try {
        await fetch(`${import.meta.env.VITE_API_URL || "https://shg-backend.reshmaoracle.com"}/onboarding/intention`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            desire: answers.specific,
            category: (answers.goals || onbGoals)[0] || null,
            block: answers.block || null,
            timeline: answers.timeline || null,
            tried_before: answers.tried || null,
            listen_time: answers.listenTime || null,
            listen_freq: answers.listenFreq || null,
            bucket_list: answers.bucket || null,
          }),
        });
      } catch {}
    }
  };
  const [showGuide, setShowGuide] = useState(false);
  const [showEmoLog, setShowEmoLog] = useState(false);
  const [quickFeel, setQuickFeel] = useState("");
  const logEmotion = (level) => {
    const today = new Date().toISOString().slice(0,10);
    setEmoLog(l=>[...l.filter(e=>e.date!==today),{date:today,level}]);
    setQuickFeel(level); setTimeout(()=>setShowEmoLog(false),700);
  };
  const audioRef = useRef(null);
  const intervalRef = useRef(null);
  const playStartRef = useRef(null);
  const playTrackRef = useRef(null);

  useEffect(() => { if (forceTheme) setTheme(forceTheme); }, [forceTheme]);

  const C = THEMES[theme];
  const isDark = theme === "dark";
  const hour = new Date().getHours();
  const firstName = userName ? userName.charAt(0).toUpperCase() + userName.slice(1).split(" ")[0] : "you";
  const greet = (hour<12?"Good morning":"Good evening") + (isPreview ? "" : `, ${firstName}`);

  // ── AUDIO PLAYBACK ───────────────────────────────────────────────────────
  const logPlay = async (trackObj) => {
    if (isPreview || !userId) return;
    const trackTitle = typeof trackObj === "string" ? trackObj : trackObj?.title;
    const trackCat = typeof trackObj === "object" ? trackObj?.cat : "";
    playStartRef.current = Date.now();
    playTrackRef.current = { title: trackTitle, cat: trackCat };
    try {
      await fetch(`${QUIZ_WORKER_URL}/log-listen`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: trackTitle, category: trackCat, duration_seconds: 0, completed: false }),
      });
    } catch (e) { /* non-blocking */ }
  };

  const logListenComplete = async (completed = false) => {
    if (isPreview || !userId || !playStartRef.current || !playTrackRef.current) return;
    const dur = Math.round((Date.now() - playStartRef.current) / 1000);
    const { title, cat } = playTrackRef.current;
    playStartRef.current = null;
    playTrackRef.current = null;
    try {
      await fetch(`${QUIZ_WORKER_URL}/log-listen`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, category: cat, duration_seconds: dur, completed }),
      });
    } catch (e) { /* non-blocking */ }
  };
  const play = (t) => {
    const hasUrl = !!AUDIO_URLS[t.title];
    if (track.id === t.id) {
      if (hasUrl) setPlay(p => !p);
      return;
    }
    setTrack(t);
    if (hasUrl) { setPlay(true); if (!isPreview) { setListenCount(n=>n+1); logPlay(t); try { const l = JSON.parse(localStorage.getItem("shg_listen_log") || "[]"); l.push({ d:new Date().toISOString(), title:t.title, cat:t.cat }); localStorage.setItem("shg_listen_log", JSON.stringify(l.slice(-2000))); } catch {} } }
    setProg(0);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const url = AUDIO_URLS[track.title];
    if (url && audio.src !== url) {
      audio.src = url;
      audio.load();
    }
    if (playing && url) {
      audio.play().catch(()=>{});
    } else {
      audio.pause();
    }
  }, [playing, track]);

  // Tell her when a track can't load or is still buffering, instead of sitting at 0:00.
  const [audioState, setAudioState] = useState("");
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setAudioState("");
    const onErr = () => setAudioState("error");
    const onWait = () => setAudioState(s => s === "error" ? s : "loading");
    const onPlay = () => setAudioState("");
    audio.addEventListener("error", onErr);
    audio.addEventListener("waiting", onWait);
    audio.addEventListener("playing", onPlay);
    return () => { audio.removeEventListener("error", onErr); audio.removeEventListener("waiting", onWait); audio.removeEventListener("playing", onPlay); };
  }, [track]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const update = () => {
      if (audio.duration) setProg(Math.round((audio.currentTime/audio.duration)*100));
    };
    audio.addEventListener("timeupdate", update);
    const handleEnded = () => {
      logListenComplete(true);
      if (isLooping) {
        audio.currentTime = 0;
        audio.play().catch(()=>{});
      } else {
        nextTrack();
      }
    };
    audio.addEventListener("ended", handleEnded);
    return () => { audio.removeEventListener("timeupdate", update); audio.removeEventListener("ended", handleEnded); };
  }, [track, isLooping]);

  const seekTo = (pct, e) => {
    e?.stopPropagation();
    const audio = audioRef.current;
    if (audio && audio.duration) audio.currentTime = (pct/100)*audio.duration;
    setProg(pct);
  };

  const toggleLike = (id, e) => {
    e?.stopPropagation();
    setLiked(s=>{const n=new Set(s); n.has(id)?n.delete(id):n.add(id); return n;});
  };
  const nextTrack = () => { const i=TRACKS.findIndex(t=>t.id===track.id); setTrack(TRACKS[(i+1)%TRACKS.length]); setProg(0); };
  const prevTrack = () => { const i=TRACKS.findIndex(t=>t.id===track.id); setTrack(TRACKS[(i-1+TRACKS.length)%TRACKS.length]); setProg(0); };
  // Lock screen and Control Centre: cover art, track name and controls, like Spotify.
  const nextRef = useRef(nextTrack); nextRef.current = nextTrack;
  const prevRef = useRef(prevTrack); prevRef.current = prevTrack;
  useEffect(() => {
    if (!("mediaSession" in navigator) || !track) return;
    const art = new URL(CAT_COVER[track.cat] || "/shop/method-deck.png", window.location.origin).href;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: displayTitle(track.title),
        artist: "Reshma Oracle",
        album: `Self Hypnosis Goddess · ${String(track.cat||"").replace("maxxing","maxxing")}`,
        artwork: [{ src: art, sizes: "512x512" }, { src: art, sizes: "1024x1024" }],
      });
      navigator.mediaSession.setActionHandler("play", () => setPlay(true));
      navigator.mediaSession.setActionHandler("pause", () => setPlay(false));
      navigator.mediaSession.setActionHandler("nexttrack", () => nextRef.current());
      navigator.mediaSession.setActionHandler("previoustrack", () => prevRef.current());
      navigator.mediaSession.setActionHandler("seekbackward", null);
      navigator.mediaSession.setActionHandler("seekforward", null);
    } catch {}
  }, [track]);
  useEffect(() => { if ("mediaSession" in navigator) navigator.mediaSession.playbackState = playing ? "playing" : "paused"; }, [playing]);

  const [isDesktop, setDesktop] = useState(forceMode ? forceMode==="desktop" : (typeof window!=="undefined" && window.innerWidth>768));
  useEffect(()=>{
    if (forceMode) { setDesktop(forceMode==="desktop"); return; }
    const h=()=>setDesktop(window.innerWidth>768); window.addEventListener("resize",h); return()=>window.removeEventListener("resize",h);
  },[forceMode]);

  // ── PROFILE PANEL ────────────────────────────────────────────────────────
  const manifestedCount = threads.filter(t=>t.done).length;
  const thisMonth = threads.filter(t=>t.done).length; // simplified
  const [billingOpen, setBillingOpen] = useState(false);
  // Pull down from the top of the page to refresh (touch only, never over the player or a popup).
  const ptrRef = useRef({ y0:null, dy:0 });
  const [ptrPull, setPtrPull] = useState(0);
  const [ptrBusy, setPtrBusy] = useState(false);
  const ptrScrollRef = useRef(null);
  const ptrState = useRef({});
  ptrState.current = { blocked: fullP || profileOpen || showGuide || showEmoLog || billingOpen || logSignOpen, busy: ptrBusy };
  useEffect(() => {
    // Native listeners on the document (passive:false) so iPhone Safari reports every move.
    const atTop = () => { const el = ptrScrollRef.current; return (!el || el.scrollTop <= 0) && (window.scrollY || document.documentElement.scrollTop || 0) <= 0; };
    const inPopup = (t) => !!(t && t.closest && t.closest('[role="dialog"],[aria-modal="true"],input,textarea,select,.shg-mp'));
    const start = (e) => { const st = ptrState.current; if (st.busy || st.blocked || e.touches.length !== 1 || !atTop() || inPopup(e.target)) { ptrRef.current = { y0:null, dy:0 }; return; } ptrRef.current = { y0:e.touches[0].clientY, dy:0 }; };
    const move = (e) => { const r = ptrRef.current; if (r.y0 == null) return; const dy = e.touches[0].clientY - r.y0; if (dy <= 0 || !atTop()) { r.dy = 0; setPtrPull(0); return; } r.dy = dy; if (e.cancelable && dy > 8) e.preventDefault(); setPtrPull(Math.min(dy * 0.5, 60)); };
    const end = () => { const r = ptrRef.current; if (r.y0 == null) return; const go = r.dy > 70; ptrRef.current = { y0:null, dy:0 }; if (go) { setPtrBusy(true); setPtrPull(44); setTimeout(() => window.location.reload(), 350); } else setPtrPull(0); };
    document.addEventListener("touchstart", start, { passive:true });
    document.addEventListener("touchmove", move, { passive:false });
    document.addEventListener("touchend", end, { passive:true });
    document.addEventListener("touchcancel", end, { passive:true });
    return () => { document.removeEventListener("touchstart", start); document.removeEventListener("touchmove", move); document.removeEventListener("touchend", end); document.removeEventListener("touchcancel", end); };
  }, []);
  const [portalLoading, setPortalLoading] = useState(false);
  const [proofFilter, setProofFilter] = useState("all"); // "all" | "manifested" | "inProgress"

  const openStripePortal = async () => {
    if (isPreview) { alert("Sign up to manage your subscription."); return; }
    setPortalLoading(true);
    try {
      const res = await fetch("https://shg-billing-worker.airpriestess.workers.dev/create-portal-session", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ return_url: window.location.href }),
      });
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch (err) {
      console.error("Portal error:", err);
      alert("Could not open billing portal. Please try again.");
    } finally {
      setPortalLoading(false);
    }
  };

  const BillingPanel = () => (
    <>
      <div style={{ position:"fixed",inset:0,zIndex:1398,background:"rgba(0,0,0,.85)" }} onClick={()=>setBillingOpen(false)}/>
      <div style={{ position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:isMobile?"90%":380,maxWidth:380,background:C.bg2,border:`1px solid ${C.border}`,borderRadius:18,zIndex:1399,padding:"26px 24px",fontFamily:"'Jost',sans-serif" }}>
        <div style={{ fontSize:13,color:C.mu,letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:16 }}>Your subscription</div>
        <div style={{ background:C.bg3,borderRadius:12,padding:"14px 16px",marginBottom:16 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
            <span style={{ fontSize:14,color:C.mu }}>Current plan</span>
            <span style={{ fontSize:15,color:userTier==="goddess"?R:C.cr }}>{userTier==="goddess"?"Goddess Tier ":userTier==="lifetime"?"Lifetime ♾":"Audio Tier"}</span>
          </div>
          <div style={{ display:"flex",justifyContent:"space-between" }}>
            <span style={{ fontSize:14,color:C.mu }}>Monthly rate</span>
            <span style={{ fontSize:15,color:C.cr }}>{userTier==="goddess"?"$49/mo":userTier==="lifetime"?"$1000 one-time":"$29/mo"}</span>
          </div>
        </div>
        {userTier==="audio" && (
          <div style={{ background:`${R}18`,border:`1px solid ${R}44`,borderRadius:12,padding:"14px 16px",marginBottom:14 }}>
            <div style={{ fontSize:14,color:C.cr,marginBottom:8 }}>Upgrade to Goddess Tier  to unlock proofOS and Analytics.</div>
            <div style={{ fontSize:13,color:C.mu,marginBottom:12 }}>$49/month · cancel anytime · your card on file will be charged the difference immediately</div>
            <button onClick={openStripePortal} disabled={portalLoading} style={{ width:"100%",padding:"12px",background:`linear-gradient(135deg,${OMBRE})`,border:"none",borderRadius:10,color:"#000",fontSize:15,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>
              {portalLoading ? "Opening..." : "Upgrade now, instant access "}
            </button>
          </div>
        )}
        <button onClick={openStripePortal} disabled={portalLoading} style={{ width:"100%",padding:"11px",background:"none",border:`1px solid ${C.border}`,borderRadius:10,color:C.mu,fontSize:14,cursor:"pointer",fontFamily:"'Jost',sans-serif",marginBottom:8 }}>
          {portalLoading ? "Opening..." : "Manage billing, cancel or change plan →"}
        </button>
        <div style={{ fontSize:12,color:C.dim,textAlign:"center",marginBottom:12 }}>Managed securely by Stripe · your card is already saved</div>
        <button onClick={()=>setBillingOpen(false)} style={{ width:"100%",padding:"11px",background:"none",border:`1px solid ${C.border}`,borderRadius:10,color:C.mu,fontSize:15,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>Close</button>
      </div>
    </>
  );

  const ProfilePanel = () => (
    <>
      <div style={{ position:"fixed",inset:0,zIndex:998,background:"rgba(0,0,0,0.5)" }} onClick={()=>setProfileOpen(false)}/>
      <div style={{ position:"fixed",top:isMobile?0:0,left:0,bottom:0,width:isMobile?"100%":280,background:isDark?"#0a0a0a":"#fdf0e8",borderRight:`1px solid ${C.border}`,zIndex:999,display:"flex",flexDirection:"column",fontFamily:"'Jost',sans-serif",overflow:"hidden" }}>
        {/* Header */}
        <div style={{ padding:"24px 20px 16px",borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:16 }}>
            <a href="https://reshmaoracle.com" style={{ display:"flex",alignItems:"center",justifyContent:"center",width:56,height:56,flexShrink:0,borderRadius:12,background:"none",overflow:"hidden" }}>
              <img src="/logo_transparent_cropped.png" alt="Reshma Oracle" width="48" height="48" style={{ objectFit:"contain", display:"block", background:"#000", borderRadius:"50%", padding:3, boxSizing:"border-box" }} />
            </a>
            <div>
              <div style={{ fontSize:18,fontWeight:400,color:C.cr }}>Reshma Oracle</div>
              <div style={{ fontSize:14,color:C.mu }}>Goddess Tier</div>
              <div style={{ fontSize:13,color:R,fontWeight:400,marginTop:2 }}>reshma@reshmaoracle.com</div>
            </div>
          </div>
          {/* Stats row */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8 }}>
            {[[manifestedCount,"Manifested",R],[listenCount,"Listens",P],[threads.length,"Desires",C.cr]].map(([v,l,c],i)=>(
              <div key={i} style={{ background:isDark?"#111111":"#fdf0e8",borderRadius:8,padding:"10px 6px",textAlign:"center" }}>
                <div style={{ fontSize:18,fontWeight:400,color:c }}>{v}</div>
                <div style={{ fontSize:12,color:C.mu }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu items */}
        <div style={{ flex:1,overflowY:"auto",padding:"8px 0" }}>
          {[
            { icon:<Ico.Book c={C.mu}/>, label:"Listening Guide", action:()=>{setShowGuide(true);setProfileOpen(false);} },
            { icon:<Ico.Edit c={C.mu}/>, label:"Edit profile", action:()=>alert("Edit profile coming soon") },
            { icon:<Ico.Star c={C.mu}/>, label:"Liked tracks", action:()=>{setTab("library");setLibCat("Liked");setProfileOpen(false);} },
            { icon:<Ico.Shop c={C.mu}/>, label:"Shop", action:()=>{setTab("shop");setProfileOpen(false);} },
            { icon:<Ico.Cog c={C.mu}/>, label:"Listening reminders", action:()=>alert("Coming soon: daily push reminders.\n\nThis requires the app to be installed to your home screen (iPhone: Share → Add to Home Screen) so your browser can send notifications even when SHG isn't open. We'll prompt you to enable this once it's live.") },
            { icon:<Ico.Cog c={C.mu}/>, label:"Manage subscription", action:()=>{setProfileOpen(false);setBillingOpen(true);} },
            { icon:isDark?<Ico.Cog c={C.mu}/>:<Ico.Cog c={C.mu}/>, label:`Switch to ${isDark?"light":"dark"} mode`, action:()=>{setTheme(t=>t==="dark"?"light":"dark");setProfileOpen(false);} },
          ].map((item,i)=>(
            <button key={i} onClick={item.action} style={{ display:"flex",alignItems:"center",gap:14,width:"100%",padding:"14px 20px",background:"none",border:"none",color:C.cr,fontSize:16,fontWeight:400,cursor:"pointer",textAlign:"left",fontFamily:"'Jost',sans-serif",transition:"background 0.1s" }}
              onMouseEnter={e=>e.currentTarget.style.background=C.bg3}
              onMouseLeave={e=>e.currentTarget.style.background="none"}>
              {item.icon} {item.label}
            </button>
          ))}
          <div style={{ height:1,background:C.border,margin:"8px 20px" }}/>
          <PushNotificationToggle userId={userId} token={token} C={C}/>
          <button onClick={onHome} style={{ display:"flex",alignItems:"center",gap:14,width:"100%",padding:"14px 20px",background:"none",border:"none",color:C.mu,fontSize:16,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>
            ← Back to site
          </button>
          <button onClick={onSignOut} style={{ display:"flex",alignItems:"center",gap:14,width:"100%",padding:"14px 20px",background:"none",border:"none",color:C.mu,fontSize:16,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>
            Sign out
          </button>
        </div>
        <button onClick={()=>setProfileOpen(false)} style={{ padding:"16px",background:"none",border:`1px solid ${C.border}`,margin:"12px 16px",borderRadius:10,color:C.mu,fontSize:15,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>Close</button>
      </div>
    </>
  );

  // ── NAV TABS ────────────────────────────────────────────────────────────
  const tabs = [
    { id:"home",      label:"Home",      I:Ico.Home   },
    { id:"library",   label:"Library",   I:Ico.Lib    },
    { id:"community", label:"Community", I:Ico.Community },
    { id:"proof",     label:"proofOS",   I:Ico.Proof  },
    { id:"analytics", label:"Analytics", I:Ico.Stats  },
  ];

  const openPlayer = () => { if (isDesktop) setShowDesc(true); else setFullP(true); };
  const tabContent = (
    <>
      {tab==="home"    && <HomeTab greet={greet} firstName={firstName} track={track} play={play} liked={liked} toggleLike={toggleLike} playing={playing} isPreview={isPreview} C={C} threads={threads} setThreads={setThreads} listenCount={listenCount} setTab={setTab} setLibCat={setLibCat} openProfile={(pg)=>{setPassportPage(typeof pg==="number"?pg:null);setProfileOpen(true);}} emoLog={emoLog} openGuide={()=>setShowGuide(true)} openEmoLog={()=>setShowEmoLog(true)} userTier={userTier} onUpgradeClick={()=>setBillingOpen(true)} userId={userId} token={token} pushDismissed={pushDismissed} onDismissPush={()=>setPushDismissed(true)} openPlayer={openPlayer}/>}
      {tab==="search"  && <div className="shg-tab-glow" style={{zoom:1}}><SearchTab tracks={TRACKS} searchQ={searchQ} setQ={setQ} play={play} track={track} playing={playing} liked={liked} toggleLike={toggleLike} isPreview={isPreview} C={C} openPlayer={openPlayer}/></div>}
      {tab==="community" && <div className="shg-tab-glow" style={{zoom:1}}><CommunityTab C={C} isPreview={isPreview}/></div>}
      {tab==="library" && <div className="shg-tab-glow" style={{zoom:1}}><LibraryTab threads={threads} searchQ={searchQ} setQ={setQ} tracks={TRACKS} cat={libCat} setCat={setLibCat} libFormat={libFormat} setLibFormat={setLibFormat} play={play} track={track} liked={liked} toggleLike={toggleLike} playing={playing} isPreview={isPreview} C={C} openPlayer={openPlayer}/></div>}
      {tab==="proof"   && <div className="shg-tab-glow" style={{zoom:1}}>{(userTier === "audio" && !isPreview ? <ProofLockedScreen C={C} onUpgrade={()=>setBillingOpen(true)} feature="proofOS"/> : <ProofTab threads={threads} setThreads={setThreads} isPreview={isPreview} C={C} currentTrack={track} userTier={userTier} onUpgrade={()=>setBillingOpen(true)} proofFilter={proofFilter} setProofFilter={setProofFilter} userId={userId} token={token} onManifested={(t)=>setCelebThread(t)}/>)}</div>}
      {tab==="analytics" && (userTier === "audio" && !isPreview ? <ProofLockedScreen C={C} onUpgrade={()=>setBillingOpen(true)} feature="Analytics"/> : <AnalyticsTab threads={threads} listenCount={listenCount} isPreview={isPreview} C={C} setTab={setTab} emoLog={emoLog} theme={theme} onDrillDown={(filter)=>{ setProofFilter(filter); setTab("proof"); }} openGuide={()=>setShowGuide(true)} userId={userId} token={token} userTier={userTier} userEmail={session?.user?.email} userName={userName} apiUrl={import.meta.env.VITE_API_URL || "https://shg-backend.reshmaoracle.com"}/>)}
      {tab==="shop"    && <div className="shg-tab-glow" style={{zoom:1}}><ShopTab C={C}/></div>}
    </>
  );

  const isMobile = !isDesktop;

  // ── DESKTOP ──────────────────────────────────────────────────────────────
  if (isDesktop) return (
    <div data-portal-theme={theme} style={{ width:"100%",height:"100vh",background:C.bg,display:"flex",flexDirection:"column",fontFamily:"'Jost',sans-serif",color:C.cr,overflow:"hidden" }}>
      <audio ref={audioRef} preload="none"/>
      {profileOpen && <GoddessPassport startPage={passportPage} onClose={()=>{setProfileOpen(false);setPassportPage(null);}} userId={userId} firstName={firstName} email={session?.user?.email} threads={threads} listenCount={listenCount} isPreview={isPreview} isDark={isDark} tierLabel={userTier==="goddess"?"Goddess membership":"Audio membership"} actions={{ guide:()=>setShowGuide(true), liked:()=>{setProfileOpen(false);setTab("library");setLibCat("Liked");}, shop:()=>{setProfileOpen(false);setTab("shop");}, billing:()=>setBillingOpen(true), theme:()=>setTheme(t=>t==="dark"?"light":"dark"), site:()=>{ if(onHome) onHome(); else window.location.href="/"; }, signOut:()=>{ setProfileOpen(false); if (isPreview) { try { localStorage.removeItem("shg_preview_onboarded"); } catch {} window.location.href="/beta"; return; } try { onSignOut?.(); } catch {} try { localStorage.removeItem("shg_auth_token"); } catch {} setTimeout(()=>{ if (window.location.pathname.startsWith("/portal")) window.location.href="/beta"; }, 400); } }}/>}
      {billingOpen && <BillingPanel/>}
      {showGuide && <KnowledgeGuide onClose={()=>setShowGuide(false)} C={C} start={typeof showGuide==="object"?showGuide:null}/>}
      {showEmoLog && (
        <>
          <div style={{ position:"fixed",inset:0,zIndex:1000,background:"#000000" }} onClick={()=>setShowEmoLog(false)}/>
          <div style={{ position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"90%",maxWidth:400,background:C.bg2,border:`1px solid ${C.border}`,borderRadius:18,zIndex:1001,padding:"22px 20px",fontFamily:"'Jost',sans-serif",maxHeight:"85vh",display:"flex",flexDirection:"column",overflow:"hidden" }}>
            <div style={{ fontSize:13,color:"#E8B870",letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:4 }}>How are you feeling right now?</div>
            <div style={{ fontSize:13,color:C.mu,marginBottom:12,lineHeight:1.6 }}>
              Select your state on the Hawkins scale.{" "}
              <span onClick={()=>{setShowEmoLog(false);setShowGuide(true);}} style={{ color:"#E8B870",cursor:"pointer",textDecoration:"underline" }}>See Guidebook </span>
            </div>
            <div style={{ fontSize:11,color:"#BFA5D8",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:6 }}>200+ · Expansive · Creates </div>
            <div style={{ overflowY:"auto",marginBottom:10,maxHeight:190 }}>
              {HAWKINS.filter(h=>h.v>=200).slice().reverse().map(h=>(
                <div key={h.n} onClick={()=>logEmotion(h.n)}
                  style={{ display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:10,marginBottom:3,cursor:"pointer",
                    background:quickFeel===h.n?`${h.c}22`:"transparent",
                    border:`1px solid ${quickFeel===h.n?h.c:"#fdf0e8"}` }}>
                  <div style={{ width:12,height:12,borderRadius:"50%",background:h.c,flexShrink:0,boxShadow:`0 0 6px ${h.c}99` }}/>
                  <span style={{ fontSize:15,color:h.c,flex:1 }}>{h.n}</span>
                  <span style={{ fontSize:13,color:C.mu }}>{h.v}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize:11,color:"rgba(191,165,216,0.8)",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:6 }}>Below 200 · Contractive · Drains</div>
            <div style={{ overflowY:"auto",maxHeight:170,marginBottom:12 }}>
              {HAWKINS.filter(h=>h.v<200).slice().reverse().map(h=>(
                <div key={h.n} onClick={()=>logEmotion(h.n)}
                  style={{ display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:10,marginBottom:3,cursor:"pointer",
                    background:quickFeel===h.n?`${h.c}33`:"transparent",
                    border:`1px solid ${quickFeel===h.n?h.c:"#fdf0e8"}` }}>
                  <div style={{ width:12,height:12,borderRadius:"50%",background:h.c,flexShrink:0 }}/>
                  <span style={{ fontSize:15,color:isDark?(h.v>=600?"#F5E0A0":h.v<=30?"#fdf0e8":h.c):"#000000",flex:1 }}>{h.n}</span>
                  <span style={{ fontSize:13,color:C.mu }}>{h.v}</span>
                </div>
              ))}
            </div>
            {quickFeel && (()=>{
              const h = HAWKINS.find(x=>x.n===quickFeel);
              return h ? (
                <div style={{ padding:"10px 14px",borderRadius:10,marginBottom:12,display:"flex",alignItems:"center",gap:10,background:`${h.c}22`,border:`1px solid ${h.c}66` }}>
                  <div style={{ width:14,height:14,borderRadius:"50%",background:h.c,flexShrink:0,boxShadow:`0 0 8px ${h.c}` }}/>
                  <div>
                    <div style={{ fontSize:15,color:C.cr }}>{h.n} · {h.v}</div>
                    <div style={{ fontSize:13,color:C.mu }}>{h.v>=200?"Expansive energy, you're creating from above the line":"Contractive energy, the audio will help lift you"}</div>
                  </div>
                </div>
              ) : null;
            })()}
            <button onClick={()=>setShowEmoLog(false)} style={{ width:"100%",padding:"11px",background:"none",border:`1px solid ${C.border}`,borderRadius:10,color:C.mu,fontSize:15,cursor:"pointer",fontFamily:"'Jost',sans-serif",flexShrink:0 }}>Close</button>
          </div>
        </>
      )}
      {showUpgradeReminder && userTier === "audio" && !isPreview && (
        <div onClick={()=>setShowUpgradeReminder(false)} style={{ position:"fixed",inset:0,zIndex:1050,background:"#000000",display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
          <div onClick={e=>e.stopPropagation()} style={{ maxWidth:380,width:"100%",borderRadius:20,padding:"28px 24px",background:"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)",textAlign:"center" }}>
            <div style={{ fontSize:13,fontWeight:400,color:"#000",letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:10, }}>Member-Exclusive · Not Open To The Public</div>
            <div style={{ fontSize:19,fontWeight:400,color:"#000",marginBottom:8 }}>10% off Goddess Tier, this once</div>
            <div style={{ fontSize:15,color:"#000",marginBottom:20,lineHeight:1.5 }}>This offer only exists because you're already a member. proofOS, early access and the full Guide, unlocked.</div>
            <button onClick={()=>{setShowUpgradeReminder(false); setBillingOpen(true);}} style={{ width:"100%",padding:"13px",background:"#000",border:"none",borderRadius:12,color:"#fff",fontSize:16,fontWeight:400,cursor:"pointer",fontFamily:"'Jost',sans-serif",marginBottom:10 }}>Claim 10% Off</button>
            <button onClick={()=>setShowUpgradeReminder(false)} style={{ width:"100%",padding:"8px",background:"none",border:"none",color:"#000",fontSize:14,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>Maybe later</button>
          </div>
        </div>
      )}
      {showOnboarding && <OnboardingQuiz
        step={onbStep} setStep={setOnbStep}
        goals={onbGoals} setGoals={setOnbGoals}
        where={onbWhere} setWhere={setOnbWhere}
        freq={onbFreq} setFreq={setOnbFreq}
        onDone={finishOnboarding}
        isDark={isDark} C={C}
      />}
      {isPreview && <PreviewBanner onSignOut={onSignOut} C={C}/>}
      <div style={{ flex:1,display:"flex",overflow:"hidden" }}>
        {/* Sidebar */}
        <div style={{ width:220,background:C.bg,display:"flex",flexDirection:"column",padding:"20px 0 8px",paddingBottom:96,flexShrink:0,borderRight:`1px solid ${C.border}`,overflowY:"auto" }}>
          <div style={{ padding:"0 20px 20px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
            <a href="https://reshmaoracle.com" style={{ display:"flex",alignItems:"center",justifyContent:"center",width:40,height:40,borderRadius:10,background:"none",overflow:"hidden",flexShrink:0 }}>
              <img src="/logo_transparent_cropped.png" alt="Reshma Oracle" width="36" height="36" style={{ objectFit:"contain", display:"block", background:"#000", borderRadius:"50%", padding:3, boxSizing:"border-box" }} />
            </a>
            {isDark ? (
              <span style={{ fontSize:13,fontWeight:700,letterSpacing:"0.14em",padding:"5px 14px",borderRadius:20,fontFamily:"'Jost',sans-serif",flexShrink:0,color:"#000",background:"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)" }}>BETA</span>
            ) : (
              <span style={{ fontSize:13,fontWeight:700,letterSpacing:"0.14em",padding:"5px 14px",borderRadius:20,fontFamily:"'Jost',sans-serif",flexShrink:0,background:"#000",display:"inline-block" }}>
                <span style={{ backgroundImage:"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", backgroundClip:"text", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", color:"transparent" }}>BETA</span>
              </span>
            )}
          </div>
          {[...tabs,{id:"shop",label:"Shop",I:Ico.Shop}].map(n=>(
            <button key={n.id} onClick={()=>setTab(n.id)}
              style={{ display:"flex",alignItems:"center",gap:11,padding:"6px 18px",margin:tab===n.id?"0 8px":0,width:tab===n.id?"calc(100% - 16px)":"100%",background:tab===n.id?(isDark?"rgba(242,236,228,0.10)":"#000000"):"none",border:"none",borderRadius:tab===n.id?8:0,borderLeft:tab===n.id&&!isDark?"none":tab===n.id?"3px solid #E8B870":"3px solid transparent",color:tab===n.id?(isDark?"#F2ECE4":"#F5E0A0"):isDark?"#F2ECE4":"#000000",fontSize:13,fontWeight:400,cursor:"pointer",textAlign:"left",fontFamily:"'Jost',sans-serif",transition:"color 0.15s" }}
              onMouseEnter={e=>{if(tab!==n.id)e.currentTarget.style.color="#E8B870";}}
              onMouseLeave={e=>{if(tab!==n.id)e.currentTarget.style.color=C.mu;}}>
              <n.I a={tab===n.id} c={tab===n.id?(isDark?"#E8B870":"#F5E0A0"):C.cr}/> {n.label}
            </button>
          ))}
          <div style={{ height:1,background:C.border,margin:"6px 16px" }}/>
          <button onClick={()=>setShowGuide(true)} style={{ display:"flex",alignItems:"center",gap:11,padding:"6px 18px",background:"none",border:"none",borderLeft:"2px solid transparent",color:C.mu,fontSize:13,cursor:"pointer",textAlign:"left",width:"100%",fontFamily:"'Jost',sans-serif" }}
            onMouseEnter={e=>e.currentTarget.style.color="#E8B870"}
            onMouseLeave={e=>e.currentTarget.style.color=C.mu}>
            <Ico.Book c={C.mu}/> Listening Guide
          </button>
          <div style={{ padding:"2px 18px 6px",fontSize:11,lineHeight:1.4,color:C.cr }}>Headphones on. Never while driving. Avoid if you have epilepsy.</div>
          <div style={{ height:1,background:C.border,margin:"6px 16px" }}/>
          <div style={{ padding:"0 18px 4px",fontSize:11,fontWeight:400,color:C.dim,letterSpacing:"0.12em",textTransform:"uppercase" }}>Recently played</div>
          {TRACKS.slice(0,5).map(t=>(
            <button key={t.id} onClick={()=>{play(t); setShowDesc(true);}}
              style={{ display:"flex",alignItems:"center",gap:9,padding:"4px 18px",background:"none",border:"none",color:track.id===t.id?C.cr:C.mu,fontSize:13,cursor:"pointer",width:"100%",textAlign:"left",fontFamily:"'Jost',sans-serif" }}
              onMouseEnter={e=>e.currentTarget.style.color=C.cr}
              onMouseLeave={e=>{if(track.id!==t.id)e.currentTarget.style.color=C.mu;}}>
              <div style={{ position:"relative" }}><Thumb title={t.title} cat={t.cat} size={24} radius={2}/></div>
              <span style={{ overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{displayTitle(t.title)}</span>
            </button>
          ))}
          <div style={{ flex:1 }}/>
          <div style={{ padding:"6px 14px",display:"flex",gap:6 }}>
            <button onClick={()=>setTheme(t=>t==="dark"?"light":"dark")} style={{ flex:1,padding:"6px",background:C.bg3,border:`0.5px solid ${C.border}`,borderRadius:8,color:C.mu,fontSize:12,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>
              {isDark?"☀ Light":"☾ Dark"}
            </button>
          </div>
          <button onClick={()=>setProfileOpen(true)} style={{ margin:"0 14px 6px",padding:"6px 10px",background:C.bg3,border:`0.5px solid ${C.border}`,borderRadius:8,color:C.cr,fontSize:13,cursor:"pointer",fontFamily:"'Jost',sans-serif",display:"flex",alignItems:"center",gap:9 }}>
            <div style={{
              width:24,height:24,borderRadius:"50%",
              background:OMBRE,backgroundSize:"200%",backgroundPosition:"left",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:13,fontWeight:400,color:"#000"
            }}>R</div>
            Profile & Settings
          </button>
        </div>
        {/* Main */}
        <div style={{ flex:1,overflowY:"auto",background:isDark?(TAB_WASH[tab]?.dark||C.bg):C.bg,paddingBottom:20,backgroundImage:isDark?"none":LG_FADE_LIGHT }}>
          <div style={{ position:"sticky",top:0,zIndex:50,padding:"16px 24px 12px",background:C.bg2 }}>
            <style>{`.shg-home-search::placeholder{color:${C.cr};opacity:0.55;}`}</style>
            <div style={{ maxWidth:360,position:"relative" }}>
              <span style={{ position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:16,color:C.dim }}>⌕</span>
              <input
                className="shg-home-search"
                value={searchQ}
                onChange={e=>{setQ(e.target.value); setTab("library");}}
                placeholder="What do you want to play?"
                style={{ width:"100%",padding:"11px 14px 11px 36px",borderRadius:24,background:C.bg3,border:`1px solid ${C.border}`,color:C.cr,fontSize:16,fontFamily:"'Jost',sans-serif",outline:"none" }}
              />
            </div>
          </div>
          {tabContent}
        </div>
      </div>
      <DesktopPlayer track={track} playing={playing} setPlay={setPlay} liked={liked} toggleLike={toggleLike} prog={prog} seekTo={seekTo} prevTrack={prevTrack} nextTrack={nextTrack} isLooping={isLooping} setLooping={setLooping} C={C} isDark={isDark} showDesc={showDesc} setShowDesc={setShowDesc} onLogSign={()=>{setShowDesc(false);setTab("proof");}} audioState={audioState}/>
    </div>
  );

  // ── MOBILE ───────────────────────────────────────────────────────────────
  return (
    <div data-portal-theme={theme} style={{ width:"100%",height:"100vh",background:C.bg,display:"flex",flexDirection:"column",fontFamily:"'Jost',sans-serif",color:C.cr,overflow:"hidden" }}>
      <audio ref={audioRef} preload="none"/>
      {profileOpen && <GoddessPassport startPage={passportPage} onClose={()=>{setProfileOpen(false);setPassportPage(null);}} userId={userId} firstName={firstName} email={session?.user?.email} threads={threads} listenCount={listenCount} isPreview={isPreview} isDark={isDark} tierLabel={userTier==="goddess"?"Goddess membership":"Audio membership"} actions={{ guide:()=>setShowGuide(true), liked:()=>{setProfileOpen(false);setTab("library");setLibCat("Liked");}, shop:()=>{setProfileOpen(false);setTab("shop");}, billing:()=>setBillingOpen(true), theme:()=>setTheme(t=>t==="dark"?"light":"dark"), site:()=>{ if(onHome) onHome(); else window.location.href="/"; }, signOut:()=>{ setProfileOpen(false); if (isPreview) { try { localStorage.removeItem("shg_preview_onboarded"); } catch {} window.location.href="/beta"; return; } try { onSignOut?.(); } catch {} try { localStorage.removeItem("shg_auth_token"); } catch {} setTimeout(()=>{ if (window.location.pathname.startsWith("/portal")) window.location.href="/beta"; }, 400); } }}/>}
      {billingOpen && <BillingPanel/>}
      {showGuide && <KnowledgeGuide onClose={()=>setShowGuide(false)} C={C} start={typeof showGuide==="object"?showGuide:null}/>}
      {showOnboarding && <OnboardingQuiz
        step={onbStep} setStep={setOnbStep}
        goals={onbGoals} setGoals={setOnbGoals}
        where={onbWhere} setWhere={setOnbWhere}
        freq={onbFreq} setFreq={setOnbFreq}
        onDone={finishOnboarding}
        isDark={isDark} C={C}
      />}
      {isPreview && <PreviewBanner onSignOut={onSignOut} C={C}/>}
      <BetaBanner C={C} isDark={isDark}/>
      {showUpgradeReminder && userTier === "audio" && !isPreview && (
        <div onClick={()=>setShowUpgradeReminder(false)} style={{ position:"fixed",inset:0,zIndex:1050,background:"#000000",display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
          <div onClick={e=>e.stopPropagation()} style={{ maxWidth:380,width:"100%",borderRadius:20,padding:"28px 24px",background:"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)",textAlign:"center" }}>
            <div style={{ fontSize:13,fontWeight:400,color:"#000",letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:10, }}>Member-Exclusive · Not Open To The Public</div>
            <div style={{ fontSize:19,fontWeight:400,color:"#000",marginBottom:8 }}>10% off Goddess Tier, this once</div>
            <div style={{ fontSize:15,color:"#000",marginBottom:20,lineHeight:1.5 }}>This offer only exists because you're already a member. proofOS, early access and the full Guide, unlocked.</div>
            <button onClick={()=>{setShowUpgradeReminder(false); setBillingOpen(true);}} style={{ width:"100%",padding:"13px",background:"#000",border:"none",borderRadius:12,color:"#fff",fontSize:16,fontWeight:400,cursor:"pointer",fontFamily:"'Jost',sans-serif",marginBottom:10 }}>Claim 10% Off</button>
            <button onClick={()=>setShowUpgradeReminder(false)} style={{ width:"100%",padding:"8px",background:"none",border:"none",color:"#000",fontSize:14,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>Maybe later</button>
          </div>
        </div>
      )}
      <div style={{ height:46,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px",flexShrink:0,borderBottom:`0.5px solid ${C.border}` }}>
        <a href="https://reshmaoracle.com" style={{ display:"flex",alignItems:"center",justifyContent:"center",width:38,height:38,borderRadius:9,background:"none",overflow:"hidden",flexShrink:0 }}>
          <img src="/logo_transparent_cropped.png" alt="Reshma Oracle" width="34" height="34" style={{ objectFit:"contain", display:"block", background:"#000", borderRadius:"50%", padding:3, boxSizing:"border-box" }} />
        </a>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <button onClick={()=>setTheme(t=>t==="dark"?"light":"dark")} style={{ width:30,height:30,borderRadius:"50%",background:"none",border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,cursor:"pointer",WebkitTapHighlightColor:"transparent",color:C.cr }}>{isDark?"☀":"🌙"}</button>
          <button onClick={()=>setProfileOpen(true)} style={{
            width:34,height:34,borderRadius:"50%",
            background:OMBRE,border:"none",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:16,fontWeight:400,color:"#000",
            cursor:"pointer",WebkitTapHighlightColor:"transparent"
          }}>R</button>
        </div>
      </div>
      {/* Screen */}
      <div ref={ptrScrollRef} style={{ flex:1,overflowY:"auto",paddingBottom:150,WebkitOverflowScrolling:"touch",overscrollBehaviorY:"contain",position:"relative",background:TAB_WASH[tab]?.[isDark?"dark":"light"]||"none" }}>
        {(ptrPull > 0 || ptrBusy) && (
          <div aria-live="polite" aria-label={ptrBusy ? "Refreshing" : "Pull to refresh"} style={{ height:ptrPull,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",transition:ptrRef.current.y0==null?"height .2s":"none" }}>
            <style>{`@keyframes shg-ptr{to{transform:rotate(360deg)}}`}</style>
            <span style={{ width:26,height:26,borderRadius:"50%",background:"conic-gradient(#F5E0A0,#E8B870,#BFA5D8,#2CB7A7,#167A6B,#F5E0A0)",WebkitMask:"radial-gradient(circle,transparent 8px,#000 9px)",mask:"radial-gradient(circle,transparent 8px,#000 9px)",transform:`rotate(${ptrPull*6}deg)`,animation:ptrBusy?"shg-ptr .8s linear infinite":"none",opacity:Math.min(1,ptrPull/35) }}/>
          </div>
        )}
        {tabContent}
      </div>
      {/* Mini player */}
      {!fullP && everPlayed && (
        <div onClick={()=>setFullP(true)} style={{ position:"fixed",bottom:isPreview?60:76,left:8,right:8,zIndex:50,background:"linear-gradient(90deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 80%,#167A6B 100%)",borderRadius:10,display:"flex",alignItems:"center",gap:10,padding:"8px 10px",cursor:"pointer",boxShadow:`0 -4px 24px rgba(0,0,0,0.4)` }}>
          <Thumb title={track.title} cat={track.cat} size={42} radius={6}/>
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ fontSize:15,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:"#000000" }}>{displayTitle(track.title)}</div>
            <div style={{ fontSize:13,color:"#000000" }}>{AUDIO_URLS[track.title]?"● Live audio":"○ Coming soon"}</div>
          </div>
          <button onClick={e=>{e.stopPropagation();toggleLike(track.id,e);}} style={{ background:"none",border:"none",padding:6,lineHeight:0 }}><Ico.Heart on={liked.has(track.id)}/></button>
          <button onClick={e=>{e.stopPropagation();setPlay(p=>!p);}} style={{ width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)",border:"none",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:0,flexShrink:0 }}>
            {playing?<Ico.Pause dark={!isDark}/>:<Ico.Play dark={!isDark}/>}
          </button>
          <div style={{ position:"absolute",bottom:0,left:0,right:0,height:2,background:C.border,borderRadius:"0 0 10px 10px" }}>
            <div style={{ width:`${prog}%`,height:"100%",background:OMBRE,borderRadius:"0 0 0 10px",backgroundSize:"200%",backgroundPosition:"left",transition:"width 0.3s" }}/>
          </div>
        </div>
      )}
      {fullP && <MobilePlayer track={track} playing={playing} setPlay={setPlay} liked={liked} toggleLike={toggleLike} prog={prog} seekTo={seekTo} prevTrack={prevTrack} nextTrack={nextTrack} isLooping={isLooping} setLooping={setLooping} onClose={()=>setFullP(false)} onLogSign={()=>setTab("proof")} C={C} isDark={isDark} hasAudio={!!AUDIO_URLS[track.title]} isPreview={isPreview}/>}
      {/* Bottom nav */}
      {/* Floating log-a-sign button */}
      {!fullP && !hideFab && tab==="home" && (
        <button
          onClick={() => setLogSignOpen(true)}
          style={{ position:"fixed",bottom:everPlayed?(isPreview?130:146):(isPreview?66:84),right:14,zIndex:70,width:46,height:46,borderRadius:"50%",background:"linear-gradient(135deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(0,0,0,0.45)",fontSize:22,color:"#0a0906",fontFamily:"'Jost',sans-serif" }}
          aria-label="Log a sign"
        >✦</button>
      )}
      {!fullP && (
        <div style={{ position:"fixed",bottom:0,left:0,right:0,height:isPreview?52:68,paddingBottom:"env(safe-area-inset-bottom,0px)",boxSizing:"content-box",background:isDark?"#000000":"#F2ECE4",borderTop:`1px solid ${isDark?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.1)"}`,display:"flex",zIndex:60 }}>
          {[...tabs,{id:"shop",label:"Shop",I:Ico.Shop}].map(n=>(
            <button key={n.id} onClick={()=>setTab(n.id)} style={{ flex:1,background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,paddingBottom:isPreview?4:6,cursor:"pointer",WebkitTapHighlightColor:"transparent" }}>
              <n.I a={tab===n.id} c={tab===n.id?(isDark?"#F2ECE4":"#000000"):(isDark?"#F2ECE4":"#000000")}/>
              <span style={{ fontSize:11,fontWeight:tab===n.id?600:400,color:tab===n.id?(isDark?"#F2ECE4":"#000000"):(isDark?"#F2ECE4":"#000000") }}>{n.label}</span>
            </button>
          ))}
        </div>
      )}
      {/* Log Sign Modal */}
      {logSignOpen && (
        <LogSignModal
          onClose={() => setLogSignOpen(false)}
          onHideButton={() => { try { localStorage.setItem("shg_hide_fab","1"); } catch {} setHideFab(true); setLogSignOpen(false); }}
          onSaved={(sign) => {
            const entry = { text: sign.content, img: sign.img || undefined, audio: sign.audio || undefined, date: new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short"}), cats: sign.categories };
            if (sign?.manifestation_id != null) {
              setThreads(ts => ts.map(t => String(t.id) === String(sign.manifestation_id) ? { ...t, signs: [...(t.signs||[]), entry] } : t));
            } else {
              // Signs with no intention still belong in proofOS › Signs
              try { const loose = JSON.parse(localStorage.getItem("shg_loose_signs") || "[]"); localStorage.setItem("shg_loose_signs", JSON.stringify([...loose, entry].slice(-500))); } catch {}
            }
            setTimeout(() => setLogSignOpen(false), 1600);
          }}
          userId={userId}
          token={token}
          apiUrl={import.meta.env.VITE_API_URL || "https://shg-backend.reshmaoracle.com"}
          isDark={isDark}
          activeIntentions={threads.filter(t => !t.done && !t.isBucket).map(t => ({ id: t.id, desire: t.desire, signCount: (t.signs||[]).length }))}
        />
      )}
      {/* Manifest Celebration */}
      {celebThread && (
        <ManifestCelebration
          desire={celebThread.desire}
          signCount={(celebThread.signs||[]).length}
          onClose={() => setCelebThread(null)}
        />
      )}
    </div>
  );
}

// ── PREVIEW BANNER ────────────────────────────────────────────────────────────
function PreviewBanner({ onSignOut, C }) {
  return (
    <div style={{ background:"#000",borderTop:"4px solid transparent",borderImage:"linear-gradient(90deg,#F5E0A0,#E8B870 22%,#BFA5D8 52%,#2CB7A7 80%,#167A6B) 1",padding:"8px 16px",textAlign:"center",flexShrink:0 }}>
      <span style={{ fontSize:14,fontWeight:400,color:"#F2ECE4",fontFamily:"'Jost',sans-serif" }}>
        Preview mode
      </span>
    </div>
  );
}

function BetaBanner({ C, isDark }) {
  const [dismissed, setDismissed] = useState(() => {
    try { return sessionStorage.getItem("shg_beta_dismissed") === "1"; } catch { return false; }
  });
  if (dismissed) return null;
  const close = () => {
    setDismissed(true);
    try { sessionStorage.setItem("shg_beta_dismissed", "1"); } catch {}
  };
  return (
    <div style={{ background:"#000000",borderBottom:`1px solid ${C.border}`,padding:"6px 36px 6px 16px",textAlign:"center",flexShrink:0,position:"relative" }}>
      <span style={{ fontSize:12,fontWeight:400,color:"#F2ECE4",fontFamily:"'Jost',sans-serif",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",display:"block" }}>
        <span className="shg-gt" style={{ fontWeight:500,letterSpacing:"0.08em" }}>BETA</span>, some tracks may not work yet.
      </span>
      <button onClick={close} aria-label="Dismiss" style={{ position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",width:22,height:22,borderRadius:"50%",background:"none",border:"none",color:"#F2ECE4",fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",WebkitTapHighlightColor:"transparent" }}>✕</button>
    </div>
  );
}

// ── DESKTOP PLAYER ─────────────────────────────────────────────────────────────
// Time helpers: "10:00" or "12 min" to seconds and elapsed time from progress %.
const durSecs = (d) => { const m = String(d||"").match(/(\d+):(\d{2})/); if (m) return (+m[1])*60 + (+m[2]); const n = String(d||"").match(/(\d+)/); return n ? (+n[1])*60 : 0; };
const mmss = (s) => `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,"0")}`;
const elapsed = (d, p) => mmss(durSecs(d) * (p||0) / 100);

// ── FULL PLAYER (desktop, opened from the player bar) ─────────────────────────
// A real player on the left, the track's story and her own notes on the right.
function FullPlayer({ track, playing, setPlay, liked, toggleLike, prog, seekTo, prevTrack, nextTrack, isLooping, setLooping, C, isDark, onClose, onLogSign, audioState }) {
  const d = getDesc(track);
  const [pane, setPane] = useState("about");
  const key = `shg_notes_${track.id}`;
  const [notes, setNotes] = useState(() => { try { return JSON.parse(localStorage.getItem(key) || "[]"); } catch { return []; } });
  const [draft, setDraft] = useState("");
  const rKey = `shg_rating_${track.id}`;
  const [rating, setRating] = useState(() => { try { return +localStorage.getItem(rKey) || 0; } catch { return 0; } });
  useEffect(() => { try { setRating(+localStorage.getItem(rKey) || 0); } catch { setRating(0); } }, [rKey]);
  const rate = (n) => { setRating(n); try { localStorage.setItem(rKey, String(n)); } catch {} };
  useEffect(() => { try { setNotes(JSON.parse(localStorage.getItem(key) || "[]")); } catch { setNotes([]); } }, [key]);
  useEffect(() => { const k = (e) => { if (e.key === "Escape") onClose(); }; window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [onClose]);
  const saveNotes = (list) => { setNotes(list); try { localStorage.setItem(key, JSON.stringify(list)); } catch {} };
  const addNote = () => { const t = draft.trim(); if (!t) return; saveNotes([{ t, at: new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short"}), pos: elapsed(track.dur, prog) }, ...notes]); setDraft(""); };
  const G = "linear-gradient(90deg,#F5E0A0,#E8B870 22%,#BFA5D8 52%,#2CB7A7 80%,#167A6B)";
  const ink = C.cr, line = isDark ? "#222" : "rgba(0,0,0,.14)";
  const iconBtn = { background:"none", border:"none", cursor:"pointer", lineHeight:0, padding:8, color:ink };
  const tab = (id, label) => (
    <button role="tab" aria-selected={pane===id} onClick={()=>setPane(id)} style={{ background:pane===id?G:"transparent", color:pane===id?"#000":ink, border:pane===id?"none":`1px solid ${line}`, borderRadius:999, padding:"8px 16px", fontSize:13, cursor:"pointer", fontFamily:"inherit" }}>{label}</button>
  );
  return (
    <div role="dialog" aria-modal="true" aria-label="Now playing" style={{ position:"fixed",inset:0,zIndex:1000,background:C.bg,display:"flex",flexDirection:"column",color:ink }}>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"22px 40px" }}>
        <button onClick={onClose} style={{ ...iconBtn, display:"flex", alignItems:"center", gap:8, fontSize:15, lineHeight:1, fontFamily:"inherit" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><polyline points="15 18 9 12 15 6"/></svg> Back
        </button>
        <span style={{ fontSize:11,letterSpacing:".3em" }}>NOW PLAYING</span>
        <div style={{ width:70 }}/>
      </div>
      <div style={{ flex:1,overflowY:"auto",padding:"8px 40px 48px" }}>
        <div style={{ display:"flex",gap:56,maxWidth:1040,margin:"0 auto",alignItems:"flex-start",flexWrap:"wrap" }}>
          {/* PLAYER */}
          <div style={{ flex:"0 0 380px",maxWidth:"100%",textAlign:"center" }}>
            <div style={{ width:"100%",aspectRatio:"1",borderRadius:24,background:G,display:"grid",placeItems:"center",boxShadow:playing?"0 0 26px rgba(44,183,167,.35),0 0 40px rgba(191,165,216,.25)":"none",transition:"box-shadow .6s" }}>
              <img src="/logo_transparent_cropped.png" alt="" style={{ width:"42%",animation:playing?"shg-fp-breathe 4.5s ease-in-out infinite":"none" }}/>
            </div>
            <div style={{ fontSize:24,marginTop:22 }}>{displayTitle(track.title)}</div>
            <div style={{ fontSize:13,marginTop:6 }}>{[track.cat, track.format, track.dur].filter(Boolean).join(" · ")}</div>
            {!AUDIO_URLS[track.title] && <div role="status" style={{ fontSize:13,marginTop:10 }}>This track is coming soon.</div>}
            {AUDIO_URLS[track.title] && audioState==="loading" && playing && <div role="status" style={{ fontSize:13,marginTop:10 }}>Loading the track…</div>}
            {audioState==="error" && <div role="alert" style={{ fontSize:13,marginTop:10 }}>This track couldn't load. Check your connection and press play again.</div>}
            <div style={{ display:"flex",alignItems:"center",gap:10,marginTop:20 }}>
              <span style={{ fontSize:12,width:40,textAlign:"right" }}>{elapsed(track.dur, prog)}</span>
              <div role="slider" aria-label="Position" aria-valuenow={Math.round(prog)} aria-valuemin={0} aria-valuemax={100} tabIndex={0}
                onKeyDown={e=>{ if(e.key==="ArrowRight") seekTo(Math.min(100,prog+2),e); if(e.key==="ArrowLeft") seekTo(Math.max(0,prog-2),e); }}
                onClick={e=>{const r=e.currentTarget.getBoundingClientRect();seekTo(Math.round(((e.clientX-r.left)/r.width)*100),e);}}
                style={{ flex:1,height:4,borderRadius:4,background:line,cursor:"pointer",position:"relative" }}>
                <div style={{ width:`${prog}%`,height:"100%",borderRadius:4,background:G }}/>
              </div>
              <span style={{ fontSize:12,width:40,textAlign:"left" }}>{track.dur}</span>
            </div>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:26,marginTop:18 }}>
              <button onClick={()=>setLooping(l=>!l)} aria-pressed={isLooping} aria-label="Repeat" style={{ ...iconBtn, opacity:isLooping?1:.55 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 2l3 3-3 3"/><path d="M4 11V9a4 4 0 0 1 4-4h12"/><path d="M7 22l-3-3 3-3"/><path d="M20 13v2a4 4 0 0 1-4 4H4"/></svg>
              </button>
              <button onClick={prevTrack} aria-label="Previous" style={iconBtn}><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 20L9 12l10-8v16z"/><rect x="5" y="4" width="2" height="16" rx="1"/></svg></button>
              <button onClick={()=>setPlay(p=>!p)} aria-label={playing?"Pause":"Play"} style={{ width:68,height:68,borderRadius:"50%",border:"none",background:G,display:"grid",placeItems:"center",cursor:"pointer",boxShadow:"0 0 18px rgba(44,183,167,.35)" }}>
                {playing?<Ico.Pause dark/>:<Ico.Play dark/>}
              </button>
              <button onClick={nextTrack} aria-label="Next" style={iconBtn}><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M5 4l10 8-10 8V4z"/><rect x="17" y="4" width="2" height="16" rx="1"/></svg></button>
              <button onClick={e=>toggleLike(track.id,e)} aria-label="Favourite" style={iconBtn}><Ico.Heart on={liked.has(track.id)}/></button>
            </div>
            <div style={{ display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap",marginTop:18 }}>
              {["Affirmations","EMDR","Theta","Subliminal","Reiki"].map(t=><span key={t} className="shg-tag">{t}</span>)}
            </div>
            <button className="shg-cta" onClick={onLogSign} style={{ marginTop:20 }}>Log a sign in proofOS</button>
            <div style={{ fontSize:12,marginTop:12 }}>Headphones on. Never while driving. Avoid if you have epilepsy.</div>
          </div>
          {/* STORY + NOTES */}
          <div style={{ flex:"1 1 360px",minWidth:0 }}>
            <div role="tablist" style={{ display:"flex",gap:8,marginBottom:22 }}>{tab("about","About this track")}{tab("notes",`My notes${notes.length?` · ${notes.length}`:""}`)}</div>
            {pane==="about" ? (
              <>
                <div style={{ fontSize:11,letterSpacing:".26em",marginBottom:10 }}>THE SHIFT</div>
                <div style={{ fontSize:18,lineHeight:1.7,marginBottom:28,maxWidth:560 }}>{d.shift}</div>
                <div style={{ fontSize:11,letterSpacing:".26em",marginBottom:10 }}>WHAT CHANGES</div>
                <div style={{ display:"grid",gap:10,marginBottom:28 }}>
                  {d.benefits.map((b,i)=>(<div key={i} style={{ display:"flex",gap:12,alignItems:"baseline",fontSize:16,lineHeight:1.6 }}><span style={{ width:8,height:8,borderRadius:"50%",background:G,flexShrink:0,transform:"translateY(-1px)" }}/>{b}</div>))}
                </div>
                <div style={{ fontSize:11,letterSpacing:".26em",marginBottom:10 }}>FIVE LAYERS IN THIS TRACK</div>
                <div style={{ fontSize:14,lineHeight:1.7,marginBottom:28,maxWidth:560 }}>Specific affirmations in Reshma's voice, EMDR bilateral sound, binaural beats for the theta state, subliminals and Reiki.</div>
                {CAT_GUIDE[track.cat] && (GUIDES_AVAILABLE.has(track.cat)
                  ? <a href="#" onClick={e=>{e.preventDefault();buyWorkbook(track.cat);}} className="shg-gb" style={{ display:"inline-flex",flexDirection:"column",gap:2,padding:"14px 20px",borderRadius:16,textDecoration:"none",color:ink }}><span style={{ fontSize:10,letterSpacing:".24em" }}>RELATED GUIDE</span><span style={{ fontSize:16 }}>{CAT_GUIDE[track.cat]} →</span></a>
                  : <div style={{ display:"inline-flex",flexDirection:"column",gap:2,padding:"14px 20px",borderRadius:16,border:`1px dashed ${line}` }}><span style={{ fontSize:10,letterSpacing:".24em" }}>RELATED GUIDE</span><span style={{ fontSize:15 }}>{CAT_GUIDE[track.cat]}, coming soon</span></div>)}
              </>
            ) : (
              <>
                <div style={{ fontSize:11,letterSpacing:".26em",marginBottom:8 }}>HOW DID IT FEEL?</div>
                <div role="radiogroup" aria-label="Rate this track" style={{ display:"flex",gap:6,marginBottom:22 }}>
                  {[1,2,3,4,5].map(n=>(
                    <button key={n} role="radio" aria-checked={rating===n} aria-label={`${n} of 5`} onClick={()=>rate(n)} style={{ ...iconBtn, padding:2 }}>
                      <svg width="26" height="26" viewBox="0 0 24 24" fill={n<=rating?"url(#fpstar)":"none"} stroke="currentColor" strokeWidth="1"><defs><linearGradient id="fpstar" x1="0" x2="1"><stop offset="0" stopColor="#F5E0A0"/><stop offset=".5" stopColor="#BFA5D8"/><stop offset="1" stopColor="#2CB7A7"/></linearGradient></defs><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>
                    </button>
                  ))}
                </div>
                <div style={{ fontSize:14,lineHeight:1.6,marginBottom:12 }}>What came up while you listened? A feeling, an image, a word. Only you can see these.</div>
                <textarea id="fp-note" value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter"&&(e.metaKey||e.ctrlKey)) addNote(); }} rows={4} placeholder="I felt lighter at the part about…"
                  style={{ width:"100%",boxSizing:"border-box",borderRadius:14,padding:14,fontSize:15,lineHeight:1.5,fontFamily:"inherit",border:`1px solid ${ink}`,background:"transparent",color:ink,resize:"vertical" }}/>
                <button className={draft.trim()?"shg-cta":"shg-cta2"} onClick={addNote} disabled={!draft.trim()} style={{ marginTop:10, color:draft.trim()?"#000":ink, background:draft.trim()?undefined:`linear-gradient(${C.bg},${C.bg}) padding-box,linear-gradient(90deg,#F5E0A0,#BFA5D8,#2CB7A7) border-box` }}>Save note at {elapsed(track.dur, prog)}</button>
                <div style={{ marginTop:22 }}>
                  {notes.length===0 && <div style={{ fontSize:14 }}>No notes yet for this track.</div>}
                  {notes.map((n,i)=>(
                    <div key={i} style={{ display:"flex",gap:12,alignItems:"flex-start",padding:"12px 0",borderBottom:`1px solid ${line}` }}>
                      <div style={{ flex:1 }}><div style={{ fontSize:11,letterSpacing:".16em",marginBottom:4 }}>{n.at.toUpperCase()} · AT {n.pos}</div><div style={{ fontSize:15,lineHeight:1.55 }}>{n.t}</div></div>
                      <button onClick={()=>saveNotes(notes.filter((_,k)=>k!==i))} aria-label="Delete note" style={{ ...iconBtn, padding:4, fontSize:16, lineHeight:1 }}>×</button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes shg-fp-breathe{50%{transform:scale(1.05)}}@media(prefers-reduced-motion:reduce){[aria-label="Now playing"] *{animation:none!important}}`}</style>
    </div>
  );
}

function DesktopPlayer({ track, playing, setPlay, liked, toggleLike, prog, seekTo, prevTrack, nextTrack, isLooping, setLooping, C, isDark, showDesc, setShowDesc, onLogSign, audioState }) {
  const d = getDesc(track);
  // On teal nav bar, text must always be cream regardless of theme
  const navCr = C.cr;
  const navMu = C.cr;
  return (
    <>
    {showDesc && <FullPlayer track={track} playing={playing} setPlay={setPlay} liked={liked} toggleLike={toggleLike} prog={prog} seekTo={seekTo} prevTrack={prevTrack} nextTrack={nextTrack} isLooping={isLooping} setLooping={setLooping} C={C} isDark={isDark} onClose={()=>setShowDesc(false)} onLogSign={onLogSign} audioState={audioState}/>}
    <div style={{ height:88,background:C.nav,borderTop:"none",display:"flex",alignItems:"center",padding:"0 16px",gap:0,flexShrink:0 }}>
      <div style={{ width:220,display:"flex",alignItems:"center",gap:12,flexShrink:0 }}>
        <div onClick={()=>setShowDesc(true)} style={{ cursor:"pointer" }}><Thumb title={track.title} cat={track.cat} size={52} radius={4}/></div>
        <div style={{ minWidth:0, cursor:"pointer" }} onClick={()=>setShowDesc(true)}>
          <div style={{ fontSize:15,fontWeight:400,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2,color:navCr }}>{displayTitle(track.title)}</div>
          <div style={{ fontSize:13,color:navMu }}>Reshma Oracle</div>
        </div>
        <button onClick={()=>setShowDesc(true)} style={{ background:"none",border:"none",lineHeight:0,padding:6,cursor:"pointer" }} title="About this track">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={navMu} strokeWidth="2"><circle cx="12" cy="12" r="9"/><line x1="12" y1="16" x2="12" y2="11"/><circle cx="12" cy="8" r="0.5" fill={navMu}/></svg>
        </button>
        <button onClick={e=>toggleLike(track.id,e)} style={{ background:"none",border:"none",lineHeight:0,padding:8 }}><Ico.Heart on={liked.has(track.id)}/></button>
      </div>
      <div style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6 }}>
        <div style={{ display:"flex",alignItems:"center",gap:20 }}>
          <span style={{ fontSize:16,color:navMu,cursor:"pointer" }}>⇄</span>
          <button onClick={prevTrack} style={{ background:"none",border:"none",lineHeight:0,cursor:"pointer" }}><svg width="22" height="22" viewBox="0 0 24 24" fill={navMu}><path d="M19 20L9 12l10-8v16z"/><rect x="5" y="4" width="2.5" height="16" rx="1" fill={navMu}/></svg></button>
          <button onClick={()=>setPlay(p=>!p)} style={{ width:36,height:36,borderRadius:"50%",background:OMBRE,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",backgroundSize:"200%",backgroundPosition:"left",boxShadow:"0 2px 12px rgba(232,184,112,0.35)" }}>
            {playing?<Ico.Pause dark/>:<Ico.Play dark/>}
          </button>
          <button onClick={nextTrack} style={{ background:"none",border:"none",lineHeight:0,cursor:"pointer" }}><svg width="22" height="22" viewBox="0 0 24 24" fill={navMu}><path d="M5 4l10 8-10 8V4z"/><rect x="16.5" y="4" width="2.5" height="16" rx="1" fill={navMu}/></svg></button>
          <button onClick={()=>setLooping(l=>!l)} style={{ background:isLooping?"rgba(232,184,112,0.2)":"none",border:"none",borderRadius:"50%",width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16,color:isLooping?"#E8B870":navMu }} aria-label="Loop" title={isLooping?"Loop on":"Loop off"}>↻</button>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:8,width:"100%",maxWidth:520 }}>
          <span style={{ fontSize:13,color:navMu,width:36,textAlign:"right" }}>{elapsed(track.dur,prog)}</span>
          <div style={{ flex:1,height:4,background:"rgba(253,240,232,0.25)",borderRadius:2,cursor:"pointer" }} onClick={e=>{const r=e.currentTarget.getBoundingClientRect();seekTo(Math.round(((e.clientX-r.left)/r.width)*100),e);}}>
            <div style={{ width:`${prog}%`,height:"100%",background:OMBRE,borderRadius:2,backgroundSize:"200%",backgroundPosition:"left",transition:"width 0.3s" }}/>
          </div>
          <span style={{ fontSize:13,color:navMu,width:32 }}>{track.dur}</span>
        </div>
      </div>
      <div style={{ width:160,display:"flex",alignItems:"center",gap:8,justifyContent:"flex-end",flexShrink:0 }}>
        <span style={{ fontSize:16,color:C.dim }}>🔊</span>
        <div style={{ width:80,height:4,background:C.border,borderRadius:2 }}><div style={{ width:"70%",height:"100%",background:C.cr,borderRadius:2 }}/></div>
      </div>
    </div>
    </>
  );
}

// ── TRACK GUIDE ─────────────────────────────────────────────────────────────
// Full page behind the ⓘ button: the shift, benefits, how it works, how to
// listen, what's inside and the companion workbook. Built from each track's
// data, so it works for every track without designing pages by hand.
const HOW_IT_WORKS = [
  ["Self hypnosis","My voice speaks the new identity to you as if it's already true, while you're relaxed enough to accept it."],
  ["Theta brainwaves","The music guides your brain toward theta, the state just before sleep where your subconscious is most open to change."],
  ["EMDR","Sound moving left to right helps your brain process old beliefs so they stop running the show."],
  ["Subliminals","Affirmations sit under the music, below conscious hearing, so your subconscious takes them in without your inner critic arguing."],
  ["Binaural beats","Two slightly different tones, one in each ear, that your brain blends into a third rhythm. It gently slows you into the relaxed state where change happens."],
  ["Reiki energy","Each track is recorded with Reiki intention, so it carries a calm, healing energy while you listen."],
];
const EXTRA_SHIFTS = [
  "You notice more signs and coincidences",
  "Old doubts lose their grip",
  "You act like it's already yours",
  "You sleep calmer, wake clearer",
];
function TrackGuide({ track, onBack, onLogSign }) {
  const d = getDesc(track);
  const area = String(track.cat||"").replace("maxxing","");
  const wb = PRODUCTS.find(p => p.name === track.cat);
  const lines = String(track.script||"").split("\n").map(l=>l.trim()).filter(Boolean).slice(0,8);
  const H = ({ children }) => <div style={{ fontSize:12,letterSpacing:".28em",textTransform:"uppercase",margin:"0 0 10px",textAlign:"center" }}>{children}</div>;
  return (
    <div style={{ position:"fixed",inset:0,zIndex:400,background:"#000",overflowY:"auto",WebkitOverflowScrolling:"touch",padding:"calc(env(safe-area-inset-top,0px) + 20px) 20px 48px",textAlign:"center",fontFamily:"'Jost',sans-serif" }}>
      <div style={{ maxWidth:560,margin:"0 auto" }}>
      <button onClick={onBack} style={{ display:"block",margin:"0 auto 16px",background:"none",border:"1px solid #F2ECE4",color:"#F2ECE4",borderRadius:999,padding:"7px 16px",fontSize:14,cursor:"pointer",fontFamily:"inherit" }}>‹ Back to the player</button>
      <div style={{ width:140,margin:"0 auto 14px" }}><Thumb cat={track.cat} size={140} radius={20}/></div>
      <div style={{ fontSize:24,color:"#F2ECE4",lineHeight:1.25 }}>{displayTitle(track.title)}</div>
      <div style={{ fontSize:14,color:"#F2ECE4",margin:"6px 0 20px" }}>{[area, track.format, track.dur].filter(Boolean).join(" · ")}</div>
      <div style={{ display:"grid",gap:14 }}>
        {/* WHAT YOU'RE INSTALLING: the script itself */}
        <div className="shg-paper" style={{ borderRadius:20,padding:"20px 18px" }}>
          <H>What you're installing</H>
          {lines.length ? lines.map((l,i)=><div key={i} style={{ fontSize:16,fontWeight:300,lineHeight:1.5,padding:"6px 0" }}>{l}</div>)
            : <div style={{ fontSize:15,fontWeight:300 }}>The script for this track is coming soon.</div>}
        </div>
        {/* THE SHIFT: from → to */}
        {(()=>{ const m = String(d.shift).match(/from (.*?),? into (.*?)\.?$/i); const from = m ? m[1] : "the old belief"; const to = m ? m[2] : d.shift; return (
          <div className="shg-paper" style={{ borderRadius:20,padding:"20px 18px" }}>
            <H>The shift</H>
            <div style={{ display:"grid",gap:8 }}>
              <div style={{ border:"1px solid #000",borderRadius:14,padding:"12px",fontSize:15,fontWeight:300,lineHeight:1.45,textDecoration:"line-through",textDecorationThickness:1 }}>{from.charAt(0).toUpperCase()+from.slice(1)}</div>
              <div style={{ fontSize:22 }}>↓</div>
              <div style={{ background:OMBRE,borderRadius:14,padding:"12px",fontSize:15,fontWeight:400,lineHeight:1.45 }}>{to.charAt(0).toUpperCase()+to.slice(1)}</div>
            </div>
          </div>
        ); })()}
        {/* SHIFTS YOU'LL NOTICE: one line each */}
        <div className="shg-paper" style={{ borderRadius:20,padding:"20px 18px" }}>
          <H>Shifts you'll notice</H>
          {[...d.benefits, ...EXTRA_SHIFTS].slice(0,5).map((b,i,arr)=>(
            <div key={i} style={{ padding:"8px 0",borderBottom:i<arr.length-1?"1px solid rgba(191,165,216,.55)":"none",fontSize:15,fontWeight:300,lineHeight:1.4 }}>✦ {b}</div>
          ))}
        </div>
        {/* HOW THIS TRACK WORKS: the audio formula slide */}
        <div className="shg-paper" style={{ borderRadius:20,padding:"16px" }}>
          <H>How this track works</H>
          <img src="/deck/audio-formula.webp" alt="The SHG audio formula: channelled words, EMDR bilateral, binaural beats, subliminals and Reiki, all playing at once." style={{ width:"100%",aspectRatio:"16/9",borderRadius:12,display:"block" }}/>
          <button onClick={()=>window.dispatchEvent(new CustomEvent("shg-open-guide",{ detail:{ key:"brainwaves" } }))} style={{ marginTop:12,background:"#000",color:"#F2ECE4",border:"none",borderRadius:999,padding:"9px 16px",fontSize:14,cursor:"pointer",fontFamily:"inherit" }}>Find out more ›</button>
        </div>
        {/* HOW TO LISTEN: the when-to-listen slide */}
        <div className="shg-paper" style={{ borderRadius:20,padding:"16px" }}>
          <H>How to listen</H>
          <img src="/deck/when-to-listen.webp" alt="When to listen: morning and night, 7 to 20 minutes, headphones on, never while driving." style={{ width:"100%",aspectRatio:"16/9",borderRadius:12,display:"block" }}/>
          <button onClick={()=>window.dispatchEvent(new CustomEvent("shg-open-guide",{ detail:{ key:"listen-ritual" } }))} style={{ marginTop:12,background:"#000",color:"#F2ECE4",border:"none",borderRadius:999,padding:"9px 16px",fontSize:14,cursor:"pointer",fontFamily:"inherit" }}>The full listening guide ›</button>
        </div>
        {/* OTHER TRACKS: visual day plan */}
        <div className="shg-paper" style={{ borderRadius:20,padding:"20px 16px" }}>
          <H>Can I listen to other tracks too?</H>
          <div style={{ fontSize:15,fontWeight:300,marginBottom:14 }}>Yes. Make this your main track for 7 days.</div>
          <div style={{ display:"flex",gap:8 }}>
            {[["☀","Morning","Subliminal"],["◐","Daytime","Other desires"],["☾","Night","This track"]].map(([ic,h,t])=>(
              <div key={h} style={{ flex:1,borderRadius:14,padding:"12px 6px",background:h==="Night"?OMBRE:"transparent",border:h==="Night"?"none":"1px solid #000" }}>
                <div style={{ fontSize:22 }}>{ic}</div>
                <div style={{ fontSize:14,fontWeight:500,marginTop:4 }}>{h}</div>
                <div style={{ fontSize:13,fontWeight:300,marginTop:2 }}>{t}</div>
              </div>
            ))}
          </div>
          <button onClick={()=>window.dispatchEvent(new CustomEvent("shg-open-guide",{ detail:{ key:"listen-multi" } }))} style={{ marginTop:14,background:"#000",color:"#F2ECE4",border:"none",borderRadius:999,padding:"9px 16px",fontSize:14,cursor:"pointer",fontFamily:"inherit" }}>How to combine tracks ›</button>
        </div>
        {wb && (
          <div className="shg-no-paper" style={{ background:"#000",borderRadius:20,padding:"18px",border:"1px solid rgba(242,236,228,.2)" }}>
            <div style={{ fontSize:12,letterSpacing:".28em",color:"#F2ECE4",marginBottom:12 }}>THE COMPANION WORKBOOK</div>
            <img src={wb.img} alt={wb.name} style={{ width:"70%",maxWidth:240,aspectRatio:"1",objectFit:"cover",borderRadius:14,display:"block",margin:"0 auto" }}/>
            <div style={{ fontSize:18,color:"#F2ECE4",margin:"12px 0 10px" }}>{wb.name} · {wb.price}</div>
            <button onClick={()=>buyProduct(wb)} style={{ background:OMBRE,color:"#000",border:"none",borderRadius:999,padding:"11px 24px",fontSize:15,cursor:"pointer",fontFamily:"inherit" }}>Get the workbook</button>
          </div>
        )}
        <button onClick={onLogSign} style={{ background:OMBRE,color:"#000",border:"none",borderRadius:999,padding:"14px",fontSize:16,cursor:"pointer",fontFamily:"inherit" }}>Log a sign in proofOS</button>
      </div>
      </div>
    </div>
  );
}

// ── MOBILE FULL PLAYER ────────────────────────────────────────────────────────
function MobilePlayer({ track, playing, setPlay, liked, toggleLike, prog, seekTo, prevTrack, nextTrack, isLooping, setLooping, onClose, onLogSign, C, isDark, hasAudio }) {
  const [savedTick, setSavedTick] = useState(0);
  const isSaved = (()=>{ try { return JSON.parse(localStorage.getItem("shg_saved")||"[]").includes(track.id); } catch { return false; } })();
  const [view, setView] = useState("cover"); // cover | script | desc
  return (
    <div className="shg-mp" style={{ position:"fixed",inset:0,background:C.bg,zIndex:300,display:"flex",flexDirection:"column",alignItems:"center",padding:"0 28px",overflowY:"auto",WebkitOverflowScrolling:"touch" }}>
      <div className="shg-mp-head" style={{ display:"grid",gridTemplateColumns:"1fr auto 1fr",alignItems:"center",width:"100%",paddingTop:"calc(env(safe-area-inset-top,0px) + 26px)",marginBottom:10,position:"relative",zIndex:5 }}>
        <button onClick={onClose} aria-label="Close player" style={{ background:"none",border:"none",lineHeight:0,cursor:"pointer",minWidth:44,minHeight:44,marginLeft:-11,display:"flex",alignItems:"center",justifyContent:"center",touchAction:"manipulation",WebkitTapHighlightColor:"transparent",position:"relative",zIndex:6 }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.cr} strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg></button>
        <span style={{ fontSize:14,fontWeight:400,letterSpacing:"0.18em",textTransform:"uppercase",color:C.cr }}>Now Playing</span>
        <div style={{ display:"flex",gap:10,justifySelf:"end",alignItems:"center" }}>
          <button onClick={()=>setView(v=>v==="desc"?"cover":"desc")} aria-label="Open everything about this track" style={{ background:OMBRE,color:"#000",border:"none",borderRadius:999,padding:"0 12px",minHeight:36,fontSize:12,whiteSpace:"nowrap",cursor:"pointer",touchAction:"manipulation",position:"relative",zIndex:6,fontFamily:"'Jost',sans-serif" }}>Open me</button>
          <button onClick={()=>setView(v=>v==="script"?"cover":"script")} style={{ background:"none",border:"none",lineHeight:0,cursor:"pointer" }} aria-label="Read along" title="Read along">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={view==="script"?"#E8B870":C.cr} strokeWidth="2"><path d="M4 5h16M4 12h16M4 19h10"/></svg>
          </button>
        </div>
      </div>
      {view==="desc" ? (
        <TrackGuide track={track} onBack={()=>setView("cover")} onLogSign={onLogSign}/>
      ) : view==="script" ? (
        <div style={{ width:"100%",flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"20px 0" }}>
          <div style={{ fontSize:22,fontWeight:400,marginBottom:4,color:C.cr,textAlign:"center" }}>{displayTitle(track.title)}</div>
          <div style={{ fontSize:15,color:C.mu,marginBottom:24 }}>Read along</div>
          <div className="shg-paper" style={{ width:"100%",borderRadius:20,padding:"22px 18px",marginBottom:40,textAlign:"center" }}>
            {(track.script || "Script coming soon.").split("\n").map(l=>l.trim()).filter(Boolean).map((l,i)=>(
              <div key={i} style={{ fontSize:18,lineHeight:1.5,padding:"10px 0",borderBottom:"1px solid rgba(191,165,216,.55)" }}>{l}</div>
            ))}
          </div>
        </div>
      ) : (
      <>
      <div style={{ width:"min(62vw, 30svh, 280px)",aspectRatio:"1" }}><Thumb cat={track.cat} size="100%" radius={24}/></div>
      {!hasAudio && <div style={{ marginTop:8,fontSize:13,color:C.mu,background:C.bg3,borderRadius:20,padding:"4px 12px" }}>Audio coming soon</div>}
      <div style={{ width:"100%",marginTop:12,marginBottom:8,textAlign:"center" }}>
        <div style={{ fontSize:21,fontWeight:400,marginBottom:6,color:C.cr }}>{displayTitle(track.title)}</div>
        <div style={{ fontSize:14,color:C.cr }}>{[track.cat, track.format, track.dur].filter(Boolean).join(" · ")}</div>
      </div>
      <div style={{ display:"flex",justifyContent:"space-around",width:"100%",marginBottom:10,paddingBottom:10,borderBottom:`1px solid ${isDark?"#fdf0e8":"#000000"}` }}>
        <button onClick={e=>toggleLike(track.id,e)} style={{ background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer",color:liked.has(track.id)?"#E8B870":C.mu }}>
          <Ico.Heart on={liked.has(track.id)}/>
          <span style={{ fontSize:11,fontFamily:"'Jost',sans-serif" }}>Like</span>
        </button>
        <button onClick={()=>{ let l=[]; try{ l=JSON.parse(localStorage.getItem("shg_saved")||"[]"); }catch{} l = l.includes(track.id) ? l.filter(x=>x!==track.id) : [track.id,...l]; try{ localStorage.setItem("shg_saved",JSON.stringify(l)); }catch{} setSavedTick(t=>t+1); }} aria-pressed={isSaved} style={{ background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer",color:isSaved?"#E8B870":C.mu }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill={isSaved?"currentColor":"none"} stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          <span style={{ fontSize:11,fontFamily:"'Jost',sans-serif" }}>{isSaved?"Saved":"Save"}</span>
        </button>
        <button onClick={async ()=>{ const url = `${window.location.origin}/portal/track/${track.id}`; const text = `Listen to ${displayTitle(track.title)} on Self Hypnosis Goddess`; if(navigator.share){ navigator.share({ title:displayTitle(track.title), text, url }).catch(()=>{}); } else { try { await navigator.clipboard.writeText(`${text}: ${url}`); alert("Link copied. Send it to a friend and they can listen to this track."); } catch { prompt("Copy this link:", url); } } }} style={{ background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer",color:C.mu }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/></svg>
          <span style={{ fontSize:11,fontFamily:"'Jost',sans-serif" }}>Share</span>
        </button>
      </div>
      </>
      )}
      <div style={{ width:"100%",marginBottom:8 }}>
        <div style={{ height:4,background:isDark?"#333333":"#000000",borderRadius:2,cursor:"pointer" }} onClick={e=>{const r=e.currentTarget.getBoundingClientRect();seekTo(Math.round(((e.clientX-r.left)/r.width)*100),e);}}>
          <div style={{ width:`${prog}%`,height:"100%",background:OMBRE,borderRadius:2,backgroundSize:"200%",backgroundPosition:"left",position:"relative",transition:"width 0.3s" }}>
            <div style={{ position:"absolute",right:-6,top:"50%",transform:"translateY(-50%)",width:13,height:13,borderRadius:"50%",background:C.cr }}/>
          </div>
        </div>
      </div>
      <div style={{ display:"flex",justifyContent:"space-between",width:"100%",marginBottom:32 }}>
        <span style={{ fontSize:13,color:C.dim }}>,</span><span style={{ fontSize:13,color:C.dim }}>{track.dur}</span>
      </div>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%" }}>
        <span style={{ fontSize:18,color:C.dim,cursor:"pointer" }}>⇄</span>
        <button onClick={prevTrack} style={{ background:"none",border:"none",lineHeight:0,cursor:"pointer" }}><svg width="24" height="24" viewBox="0 0 24 24" fill={C.cr}><path d="M19 20L9 12l10-8v16z"/><rect x="5" y="4" width="2.5" height="16" rx="1" fill={C.cr}/></svg></button>
        <button onClick={()=>setPlay(p=>!p)} style={{ width:64,height:64,borderRadius:"50%",background:OMBRE,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",backgroundSize:"200%",backgroundPosition:"left",boxShadow:"0 4px 28px rgba(232,184,112,0.35)" }}>
          {playing?<Ico.Pause dark/>:<Ico.Play dark/>}
        </button>
        <button onClick={nextTrack} style={{ background:"none",border:"none",lineHeight:0,cursor:"pointer" }}><svg width="24" height="24" viewBox="0 0 24 24" fill={C.cr}><path d="M5 4l10 8-10 8V4z"/><rect x="16.5" y="4" width="2.5" height="16" rx="1" fill={C.cr}/></svg></button>
        <button onClick={()=>setLooping(l=>!l)} style={{ background:isLooping?"rgba(232,184,112,0.2)":"none",border:"none",borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:18,color:isLooping?"#E8B870":C.mu }} aria-label="Loop" title={isLooping?"Loop on":"Loop off"}>↻</button>
      </div>
      {/* The five-layer method, visible on every track. */}
      <div style={{ display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap",margin:"10px 0 10px",color:C.cr }}>
        {["EMDR","Theta","Subliminal","Reiki"].map(l=><span key={l} className="shg-tag">{l}</span>)}
      </div>
      <button className="shg-cta" onClick={()=>{ onClose?.(); onLogSign?.(); }} style={{ marginBottom:6,padding:"12px",fontSize:15 }}>Log a sign in proofOS</button>
          <div style={{ textAlign:"center",fontSize:11,marginTop:4,marginBottom:10,color:C.cr }}>Headphones on. Never while driving. Avoid if you have epilepsy.</div>
    </div>
  );
}

// ── HOME TAB ──────────────────────────────────────────────────────────────────
function HomeTab({ greet, firstName, track, play, liked, toggleLike, playing, isPreview, C, threads, setThreads, listenCount, setTab, setLibCat, openProfile, emoLog=[], openGuide, openEmoLog, userTier="audio", onUpgradeClick, userId, token, pushDismissed, onDismissPush, openPlayer }) {

  const isDark = C?.cr !== "#000000";
  const FEATURED_CATS = ["Lovemaxxing","Richgirlmaxxing","Beautymaxxing","Selfmaxxing","Luckygirlmaxxing","Businessmaxxing"];
  const [quickDesire, setQuickDesire] = useState("");
  const [quickListening, setQuickListening] = useState(false);
  const [quickSaved, setQuickSaved] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const voiceRef = useRef(null);

  const saveQuickDesire = () => {
    if (!quickDesire.trim()) return;
    const id = Date.now();
    setThreads(ts => [{ id, desire: quickDesire.trim(), days: 0, done: false, signs: [], track: track?.title || "", category: "", feelBefore: "", feelAfter: "", oldBelief: "", isBucket: false }, ...ts]);
    setQuickDesire("");
    setQuickSaved(true);
    setTimeout(() => setQuickSaved(false), 2000);
  };

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setVoiceError("Voice not supported — use Chrome or Safari"); return; }
    if (quickListening) {
      if (voiceRef.current) { try { voiceRef.current.stop(); } catch(e){} voiceRef.current = null; }
      setQuickListening(false);
      return;
    }
    setVoiceError("");
    const r = new SR();
    r.lang = "en-US";
    r.interimResults = true;
    r.continuous = true;
    r.maxAlternatives = 1;
    voiceRef.current = r;
    let aggregated = "";
    setQuickListening(true);
    r.onresult = e => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) { aggregated += (aggregated ? " " : "") + t.trim(); }
        else { interim = t; }
      }
      setQuickDesire(aggregated + (interim ? " " + interim : ""));
    };
    r.onerror = ev => {
      setQuickListening(false);
      voiceRef.current = null;
      if (ev.error === "not-allowed") setVoiceError("Microphone access denied — check browser permissions");
      else if (ev.error === "no-speech") setVoiceError("No speech detected — try again");
      else setVoiceError("Voice error: " + ev.error);
    };
    r.onend = () => { setQuickListening(false); voiceRef.current = null; };
    try { r.start(); } catch(e) { setQuickListening(false); voiceRef.current = null; setVoiceError("Could not start microphone"); }
  };
  // Her name from the passport (first name, else her goddess name), live.
  const ppKey = `shg_passport_${userId || (isPreview ? "preview" : "guest")}`;
  const readPassportName = () => { try { const p = JSON.parse(localStorage.getItem(ppKey) || "null"); const nm = (p?.name || "").trim(); if (nm) return nm.split(/\s+/)[0]; return (p?.goddessName || "").trim(); } catch { return ""; } };
  const readPassportPhoto = () => { try { return JSON.parse(localStorage.getItem(ppKey) || "null")?.photo || null; } catch { return null; } };
  const [passportName, setPassportName] = useState(readPassportName);
  const [quick, setQuick] = useState(null);
  const [passportPhoto, setPassportPhoto] = useState(readPassportPhoto);
  useEffect(() => {
    const upd = () => { setPassportName(readPassportName()); setPassportPhoto(readPassportPhoto()); };
    upd();
    window.addEventListener("shg-passport-updated", upd);
    window.addEventListener("storage", upd);
    return () => { window.removeEventListener("shg-passport-updated", upd); window.removeEventListener("storage", upd); };
  }, [ppKey]);
  return (
    <div className="shg-tab-glow shg-home" style={{ paddingBottom:80, zoom:1 }}>
      {/* HEADER — same glowing greeting as Analytics, so the app opens on her. */}
      <style>{`@keyframes shg-lucky{0%{background-position:0% 50%;box-shadow:0 0 24px rgba(245,224,160,.55),0 0 60px rgba(191,165,216,.35)}50%{background-position:100% 50%;box-shadow:0 0 40px rgba(44,183,167,.6),0 0 90px rgba(232,184,112,.45)}100%{background-position:0% 50%;box-shadow:0 0 24px rgba(245,224,160,.55),0 0 60px rgba(191,165,216,.35)}}@media(prefers-reduced-motion:reduce){.shg-lucky{animation:none!important}}`}</style>
      <div className="shg-hero shg-lucky shg-no-paper" style={{ background:"linear-gradient(110deg,#F5E0A0,#E8B870,#BFA5D8,#2CB7A7,#167A6B,#BFA5D8,#F5E0A0)", backgroundSize:"300% 300%", animation:"shg-lucky 6s ease-in-out infinite", margin:"20px 16px 18px", padding:"26px 20px", borderRadius:20, display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, position:"relative", overflow:"hidden" }}>
        <img src="/logo_transparent_cropped.png" alt="" aria-hidden="true" className="shg-hero-clover" style={{ position:"absolute", right:72, top:"50%", transform:"translateY(-50%)", width:120, height:120, opacity:.9, pointerEvents:"none" }}/>
        <div onClick={()=>openPlayer?.()} style={{ cursor:"pointer", position:"relative" }}>
          <div style={{ fontSize:12, letterSpacing:".4em", fontWeight:500, color:"#000", marginBottom:10 }}>WELCOME BACK</div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>{passportPhoto && <img src={passportPhoto} alt="" style={{ width:48, height:48, borderRadius:"50%", objectFit:"cover", border:"2px solid #000", flexShrink:0 }}/>}<div style={{ color:"#000", fontSize:34, fontWeight:400, lineHeight:1.2, display:"inline-block", paddingRight:"0.15em", paddingBottom:"0.08em" }}>Hello, {passportName || (isPreview ? "Reshma" : firstName)}</div></div>
          <div style={{ fontSize:16, fontWeight:300, color:"#000", marginTop:8 }}>Pick up where you left off.</div>
        </div>

      </div>

      {/* OPEN YOUR PASSPORT: a small passport, drawn as a banner */}
      <button onClick={openProfile} aria-label="Open your passport" className="shg-no-paper" style={{ display:"flex",alignItems:"center",gap:14,width:"calc(100% - 32px)",margin:"0 16px 12px",padding:"12px 16px",borderRadius:"6px 16px 16px 6px",cursor:"pointer",textAlign:"left",fontFamily:"'Jost',sans-serif",backgroundColor:"#000",backgroundImage:"linear-gradient(rgba(191,165,216,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(191,165,216,.2) 1px,transparent 1px)",backgroundSize:"16px 16px",border:"1px solid #E8B870",boxShadow:"inset 8px 0 10px -8px rgba(0,0,0,.9),0 0 18px rgba(191,165,216,.35)" }}>
        <img src="/logo_transparent_cropped.png" alt="" style={{ width:44,height:44,flexShrink:0 }}/>
        <span style={{ flex:1 }}>
          <span className="shg-gt" style={{ display:"block",fontSize:17,letterSpacing:".3em" }}>PASSPORT</span>
          <span style={{ display:"block",fontSize:11,letterSpacing:".2em",color:"#F2ECE4",marginTop:3 }}>SELF HYPNOSIS GODDESS</span>
        </span>
        <span style={{ fontSize:13,color:"#F2ECE4",whiteSpace:"nowrap" }}>Tap to open ›</span>
      </button>

      {/* TODAY'S REMINDER: tap to spin it open, one specific note a day */}
      <DailyReminder userId={userId} token={token}/>

      {/* BUCKET LIST BAND: ten ideas a day */}
      <BucketBand threads={threads} setThreads={setThreads} isPreview={isPreview} userId={userId} token={token}/>

      {/* WEEKLY NUDGE: prompt to update intentions */}
      {(()=>{ const last = Math.max(0,...threads.map(t=>t.createdTs||0)); const stale = !isPreview && (threads.length && last && Date.now()-last > 7*86400000); const open = threads.filter(t=>!t.done).length; return stale ? (
        <button onClick={()=>setTab("proof")} className="shg-paper" style={{ display:"block",width:"calc(100% - 32px)",margin:"0 16px 12px",padding:"12px 16px",borderRadius:20,cursor:"pointer",textAlign:"center",fontFamily:"'Jost',sans-serif",color:"#000" }}>
          <span style={{ display:"block",fontSize:15 }}>Has anything arrived? Update proofOS ›</span>
        </button>) : null; })()}

      {/* TELL ME ABOUT YOU: uploads that build her profile */}

      {/* TALK TO PROOFOS: voice or journal photos, sorted by AI */}
      <FoldCard title={`${isPreview ? "Reshma" : firstName}, what's happening?`} sub="Talk, journal or add anything you want me to know">
      <SpeakToProof C={C} isDark={C?.cr !== "#000000"} threads={threads} setThreads={setThreads} token={token} isPreview={isPreview} firstName={isPreview ? "Reshma" : firstName}/>
        <KeepAdding userId={userId} isPreview={isPreview}/>
      </FoldCard>

      {/* UPGRADE BANNER */}
      {userTier==="audio"&&!isPreview&&(
        <div onClick={onUpgradeClick} style={{ margin:"12px 16px",padding:"14px 18px",borderRadius:14,background:"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12 }}>
          <div>
            <div style={{ fontSize:12,fontWeight:400,color:"#000",letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:3, }}>Goddess offer</div>
            <div style={{ fontSize:16,fontWeight:400,color:"#000" }}>Unlock proofOS + Analytics, 10% off</div>
          </div>
          <div style={{ fontSize:18,color:"#000",flexShrink:0 }}>→</div>
        </div>
      )}

      {/* PUSH PROMPT */}
      {!isPreview&&!pushDismissed&&<PushPromptBanner userId={userId} token={token} C={C} onDismiss={onDismissPush}/>}

      {/* QUICK DESIRE CAPTURE */}
      <FoldCard title="State a desire" sub="Say it in the present tense and save it">
      <div style={{ margin:"12px 16px 4px", background:C.bg2, border:`1px solid rgba(232,184,112,0.3)`, borderRadius:14, padding:"16px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
          <div style={{ fontSize:22, fontWeight:500, color:C.cr }}>State a desire</div>
          <button onClick={()=>setTab("proof")} style={{ fontSize:12, color:C.mu, background:"none", border:"none", cursor:"pointer", fontFamily:"'Jost',sans-serif" }}>See all in proofOS →</button>
        </div>
        <style>{`.qd-input::placeholder{color:${isDark?"rgba(253,240,232,0.4)":"rgba(26,16,8,0.4)"}!important}`}</style>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <input className="qd-input" value={quickDesire} onChange={e=>setQuickDesire(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter") saveQuickDesire(); }}
            placeholder="I receive… I am… I have…"
            style={{ flex:1, background:C.inputBg, border:"1px solid rgba(232,184,112,0.4)", color:C.inputCr, borderRadius:8, padding:"11px 13px", fontSize:15, outline:"none", fontFamily:"'Jost',sans-serif", boxSizing:"border-box" }}/>
          <button onClick={startVoice} title="Speak your desire"
            style={{ flexShrink:0, width:42, height:42, borderRadius:"50%", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:19,
              background: quickListening ? "#E8B870" : "transparent",
              boxShadow: quickListening ? "0 0 14px rgba(232,184,112,0.7)" : "none",
              transition:"all 0.2s" }}>
            {quickListening ? "⏹" : "🎙"}
          </button>
          <button onClick={saveQuickDesire}
            className="shg-gfill" style={{ padding:"0 24px",minHeight:44,borderRadius:999,border:"none",color:"#000",fontSize:15,fontWeight:500,cursor:"pointer" }}>
            {quickSaved ? "✓ Saved" : "Add"}
          </button>
        </div>
        {quickListening && <div style={{ marginTop:6, fontSize:11, color:"#E8B870" }}>🎙 Listening… tap ⏹ when done.</div>}
        {voiceError && voiceError !== "Microphone access denied — check browser permissions" && (
          <div style={{ marginTop:6, fontSize:11, color:"#E87070" }}>{voiceError}</div>
        )}
        {threads.filter(t=>!t.done).length > 0 && (
          <div style={{ marginTop:10, fontSize:12, color:C.mu }}>
            {threads.filter(t=>!t.done).length} active desire{threads.filter(t=>!t.done).length!==1?"s":""} · {threads.filter(t=>t.done).length} manifested
          </div>
        )}
      </div>
      </FoldCard>

      {/* KNOWLEDGE GUIDE, all tiers */}
      <div style={{ margin:"12px 16px 4px" }}>
        <button onClick={()=>openGuide()} className="shg-no-paper" style={{ display:"flex", alignItems:"center", gap:14, width:"100%", padding:"12px 16px", borderRadius:16, cursor:"pointer", fontFamily:"'Jost',sans-serif", background:"#000", border:"1px solid rgba(242,236,228,0.18)", textAlign:"left" }}>
          <GuideIcon k="guide" size={52}/>
          <span style={{ flex:1 }}><span style={{ display:"block", fontSize:16, color:"#F2ECE4" }}>Guidebook</span><span style={{ display:"block", fontSize:13, color:"#F2ECE4", marginTop:2 }}>Tap me to open ›</span></span>
        </button>
        <button onClick={()=>window.dispatchEvent(new CustomEvent("shg-open-guide",{ detail:{ key:"ask-reshma" } }))} style={{ display:"block", margin:"8px auto 0", background:"none", border:"none", color:"#F2ECE4", fontSize:14, fontWeight:300, cursor:"pointer", fontFamily:"'Jost',sans-serif", textDecoration:"underline", textUnderlineOffset:3 }}>Ask Reshma a question ›</button>
      </div>

      {/* PROOFOS GUIDES: four square blocks with Reshma's icons, like the Library tiles */}
      <div style={{ padding:"4px 16px 14px" }}>
        <style>{`body .shg-howto.shg-howto{display:grid!important;flex-direction:initial!important;grid-template-columns:1fr 1fr!important;gap:12px}@media(min-width:900px){body .shg-howto.shg-howto{grid-template-columns:repeat(4,1fr)!important}}`}</style>
        <div className="shg-howto">
          {[["Intentions","how-to-write-intention","lucky"],["Bucket List","bucket-vs-active","money"],["Signs","spotting-signs","track"],["Evidence","proof-wall-forever","session"]].map(([t,k,ic])=>(
            <button key={k} onClick={()=>{ if (t==="Intentions") setQuick(q=>q==="intention"?null:"intention"); else if (t==="Bucket List") setQuick(q=>q==="bucket"?null:"bucket"); else window.dispatchEvent(new CustomEvent("shg-open-guide",{ detail:{ key:k } })); }} className="shg-no-paper" style={{ position:"relative",aspectRatio:"1",background:"#000",border:"1px solid rgba(242,236,228,0.18)",borderRadius:16,overflow:"hidden",cursor:"pointer",padding:0,fontFamily:"'Jost',sans-serif" }}>
              <img src={`/icons/${ic}.webp`} alt="" style={{ position:"absolute",left:"22%",top:"10%",width:"56%",height:"56%",objectFit:"cover",borderRadius:"50%" }}/>
              <span style={{ position:"absolute",left:0,right:0,bottom:14,textAlign:"center",fontSize:16,fontWeight:300,color:"#F2ECE4" }}>{t}</span>
            </button>
          ))}
        </div>
        {quick && <QuickAdd key={quick} kind={quick} threads={threads} setThreads={setThreads} isPreview={isPreview} userId={userId} token={token} onClose={()=>setQuick(null)}/>}
      </div>





    </div>
  );
}

// ── MANIFESTATION TIMELINE ──
const DEMO_TIMELINE = [
  { month:"Jan 26", set:18, manifested:11, listens:42, avgDays:8,  cats:{Lovemaxxing:6,Richgirlmaxxing:5,Beautymaxxing:4,Selfmaxxing:3} },
  { month:"Feb 26", set:22, manifested:15, listens:58, avgDays:6,  cats:{Lovemaxxing:8,Richgirlmaxxing:6,Beautymaxxing:4,Luckygirlmaxxing:4} },
  { month:"Mar 26", set:19, manifested:14, listens:63, avgDays:7,  cats:{Richgirlmaxxing:7,Selfmaxxing:5,Lovemaxxing:4,Businessmaxxing:3} },
  { month:"Apr 26", set:24, manifested:18, listens:71, avgDays:5,  cats:{Lovemaxxing:9,Luckygirlmaxxing:7,Richgirlmaxxing:5,Beautymaxxing:3} },
  { month:"May 26", set:21, manifested:17, listens:80, avgDays:4,  cats:{Richgirlmaxxing:8,Lovemaxxing:6,Businessmaxxing:4,Selfmaxxing:3} },
  { month:"Jun 26", set:26, manifested:21, listens:88, avgDays:4,  cats:{Lovemaxxing:10,Richgirlmaxxing:8,Luckygirlmaxxing:5,Beautymaxxing:3} },
  { month:"Jul 26", set:28, manifested:23, listens:95, avgDays:3,  cats:{Richgirlmaxxing:11,Lovemaxxing:8,Businessmaxxing:5,Selfmaxxing:4} },
  { month:"Aug 26", set:14, manifested:12, listens:52, avgDays:3,  cats:{Lovemaxxing:5,Richgirlmaxxing:4,Selfmaxxing:3,Beautymaxxing:2} },
];
const DEMO_CAT_STATS = [
  { cat:"Lovemaxxing",  total:56, manifested:41, avgDays:5, color:"#167A6B" },
  { cat:"Richgirl",     total:54, manifested:38, avgDays:4, color:"#E8B870" },
  { cat:"Luckygirl",    total:16, manifested:14, avgDays:3, color:"#BFA5D8" },
  { cat:"Beauty",       total:16, manifested:10, avgDays:7, color:"#2CB7A7" },
  { cat:"Business",     total:12, manifested:8,  avgDays:9, color:"#BFA5D8" },
  { cat:"Self",         total:15, manifested:9,  avgDays:6, color:"#F5E0A0" },
];

function ManifestationTimeline({ threads, listenCount, isPreview, C }) {
  const isDark = C?.cr !== "#000000";

  // Build real data from threads when not in preview
  const months = isPreview ? DEMO_TIMELINE : (() => {
    const map = {};
    threads.forEach(t => {
      if (t.isBucket) return;
      let d = t.createdTs ? new Date(t.createdTs) : (t.createdAt ? new Date(String(t.createdAt).replace("Sept","Sep")) : new Date());
      if (isNaN(d)) d = new Date();
      const key = d.toLocaleString("en-GB",{month:"short",year:"2-digit"});
      if (!map[key]) map[key] = { month:key, set:0, manifested:0, listens:0, avgDays:0, cats:{} };
      map[key].set++;
      if (t.done) map[key].manifested++;
      (t.category||"Other").split(",").forEach(c => { map[key].cats[c.trim()] = (map[key].cats[c.trim()]||0)+1; });
    });
    return Object.values(map).slice(-8);
  })();

  const catStats = isPreview ? DEMO_CAT_STATS : (() => {
    const map = {};
    threads.filter(t => !t.isBucket).forEach(t => {
      const cat = t.category || "Other";
      if (!map[cat]) map[cat] = { cat, total:0, manifested:0, totalDays:0, color:"#BFA5D8" };
      map[cat].total++;
      if (t.done) { map[cat].manifested++; map[cat].totalDays += (t.days||0); }
    });
    return Object.values(map).sort((a,b)=>b.manifested-a.manifested).slice(0,6).map((r,i) => ({
      ...r, avgDays: r.manifested ? Math.round(r.totalDays/r.manifested) : 0,
      color: ["#167A6B","#E8B870","#BFA5D8","#2CB7A7","#BFA5D8","#F5E0A0"][i],
    }));
  })();

  const totalSet = months.reduce((s,m)=>s+m.set,0);
  const totalManifested = months.reduce((s,m)=>s+m.manifested,0);
  const overallRate = totalSet ? Math.round((totalManifested/totalSet)*100) : 0;
  const avgDaysAll = isPreview ? 5 : (catStats.reduce((s,c)=>s+c.avgDays*c.manifested,0) / Math.max(catStats.reduce((s,c)=>s+c.manifested,0),1)) || 0;
  const maxSet = Math.max(...months.map(m=>m.set), 1);

  return (
    <div style={{ margin:"0 16px 20px", fontFamily:"'Jost',sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom:12, background:C.bg2, border:`1px solid ${C.border}`, borderRadius:14, padding:"14px 16px" }}>
        <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:6 }}><Thumb cat="Luckygirlmaxxing" size={48} radius={12}/><div className="shg-gt" style={{ fontSize:22, fontWeight:500, display:"inline-block" }}>Manifestation history</div>{isPreview && <span style={{ marginLeft:"auto",fontSize:11,letterSpacing:".2em",padding:"3px 10px",border:`1px solid ${C.cr}`,borderRadius:999,color:C.cr }}>SAMPLE</span>}</div>
        <div style={{ fontSize:14, color:C.mu, lineHeight:1.5 }}>
          {isPreview ? "A record that compounds. The longer you log, the more your patterns emerge." : "Your full manifestation record — every intention, every win, every pattern."}
        </div>
      </div>

      {/* Top-line stats */}
      <style>{`body .shg-g4.shg-g4{display:grid!important;flex-direction:initial!important;grid-template-columns:repeat(4,1fr)!important;gap:8px;margin-bottom:16px}@media(max-width:700px){body .shg-g4.shg-g4{grid-template-columns:1fr 1fr!important}}body .shg-g3.shg-g3{display:grid!important;flex-direction:initial!important;grid-template-columns:1fr auto 1fr!important;gap:10px;align-items:center;text-align:center}`}</style><div className="shg-g4">
        {[
          [totalSet, "Intentions set", C.accentGold],
          [totalManifested, "Manifested", C.accentTeal],
          [`${overallRate}%`, "Success rate", C.accentLav],
          [`${Math.round(avgDaysAll)}d`, "Avg to manifest", C.accentDeep],
        ].map(([v,l,col])=>(
          <div key={l} className="shg-paper" style={{ borderRadius:12, padding:"12px 8px", textAlign:"center" }}>
            <div className="shg-gt" style={{ fontSize:22, fontWeight:600, lineHeight:1, display:"inline-block" }}>{v}</div>
            <div style={{ fontSize:11, fontWeight:500, color:C.cr, marginTop:6, lineHeight:1.3 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* HOW IT STARTED vs WHERE YOU ARE NOW */}
      {months.length > 1 && (()=>{ const f = months[0], l = months[months.length-1]; return (
        <div className="shg-paper shg-glowedge" style={{ borderRadius:16, padding:"18px 16px", marginBottom:14 }}>
          <div style={{ fontSize:13, fontWeight:500, color:C.cr, letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:14 }}>How it started · where you are now</div>
          <div className="shg-g3">
            <div><div style={{ fontSize:13, color:C.cr }}>{f.month}</div><div style={{ fontSize:28, fontWeight:600, color:C.cr }}>{f.manifested}</div><div style={{ fontSize:13, color:C.cr }}>manifested · {f.listens} listens</div></div>
            <div className="shg-gt" style={{ fontSize:28 }}>→</div>
            <div><div style={{ fontSize:13, color:C.cr }}>{l.month}</div><div className="shg-gt" style={{ fontSize:28, fontWeight:600, display:"inline-block" }}>{l.manifested}</div><div style={{ fontSize:13, color:C.cr }}>manifested · {l.listens} listens</div></div>
          </div>
        </div>
      ); })()}

      {/* Monthly bar chart */}
      <div style={{ background:C.bg2, borderRadius:16, padding:"18px 16px", marginBottom:14, border:`1px solid ${C.border}` }}>
        <div style={{ fontSize:12, fontWeight:600, color:C.cr, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:14 }}>Intentions set vs manifested per month</div>
        <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:90 }}>
          {months.map((m,i)=>{
            const setPct = (m.set/maxSet)*100;
            const manPct = (m.manifested/maxSet)*100;
            return (
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2, height:"100%", justifyContent:"flex-end" }}>
                <div style={{ width:"100%", position:"relative", display:"flex", flexDirection:"column", justifyContent:"flex-end", height:"100%" }}>
                  <div style={{ width:"100%", borderRadius:"3px 3px 0 0", background:"rgba(191,165,216,0.35)", height:`${setPct}%`, position:"absolute", bottom:0, left:0 }}/>
                  <div className="shg-bar-v" style={{ width:"100%", borderRadius:"3px 3px 0 0", background:"linear-gradient(0deg,#2CB7A7,#BFA5D8,#F5E0A0)", height:`${manPct}%`, position:"absolute", bottom:0, left:0, animationDelay:`${i*50}ms` }}/>
                </div>
                <div style={{ fontSize:9, color:C.cr, marginTop:4, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", width:"100%", textAlign:"center" }}>{m.month}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display:"flex", gap:14, marginTop:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:10, height:10, borderRadius:2, background:"rgba(191,165,216,0.5)" }}/>
            <span style={{ fontSize:11, color:C.cr }}>Set</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:10, height:10, borderRadius:2, background:"linear-gradient(0deg,#2CB7A7,#BFA5D8,#F5E0A0)" }}/>
            <span style={{ fontSize:11, color:C.cr }}>Manifested</span>
          </div>
        </div>
      </div>

      {/* Category breakdown — avg days to manifest */}
      <div style={{ background:C.bg2, borderRadius:16, padding:"18px 16px", marginBottom:14, border:`1px solid ${C.border}` }}>
        <div style={{ fontSize:12, fontWeight:600, color:C.cr, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:14 }}>By life area — time to manifest</div>
        {catStats.map((r,i) => {
          const rate = r.total ? Math.round((r.manifested/r.total)*100) : 0;
          const barPct = Math.min(rate, 100);
          return (
            <div key={i} style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:5 }}>
                <span style={{ fontSize:13, color:C.cr, fontWeight:400 }}>{r.cat}</span>
                <div style={{ display:"flex", gap:10, alignItems:"baseline" }}>
                  <span style={{ fontSize:11, color:C.mu }}>{r.manifested}/{r.total}</span>
                  {r.avgDays > 0 && <span style={{ fontSize:11, color:C.cr, fontWeight:600 }}>{r.avgDays}d avg</span>}
                </div>
              </div>
              <div style={{ height:6, borderRadius:3, background:`${r.color}22`, overflow:"hidden" }}>
                <div className="shg-bar-h" style={{ height:"100%", width:`${barPct}%`, borderRadius:3, background:"linear-gradient(90deg,#F5E0A0,#E8B870,#BFA5D8,#2CB7A7)" }}/>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fastest + most active callouts */}
      <div style={{ display:"flex", gap:10, marginBottom:14 }}>
        {[["Fastest area", (catStats.filter(c=>c.avgDays>0).sort((a,b)=>a.avgDays-b.avgDays)[0])?.cat, `${(catStats.filter(c=>c.avgDays>0).sort((a,b)=>a.avgDays-b.avgDays)[0])?.avgDays || "—"} days average`],["Most active area", (catStats.slice().sort((a,b)=>b.total-a.total)[0])?.cat, `${(catStats.slice().sort((a,b)=>b.total-a.total)[0])?.total || "—"} intentions`]].map(([h,v,sub])=>(
          <div key={h} className="shg-paper shg-glowedge" style={{ flex:1, borderRadius:16, padding:"16px 10px", textAlign:"center" }}>
            <div style={{ fontSize:11, letterSpacing:".2em", textTransform:"uppercase" }}>{h}</div>
            <div style={{ fontSize:20, fontWeight:500, margin:"6px 0 2px" }}>{String(v||"—").replace("maxxing","")}</div>
            <div style={{ fontSize:14 }}>{sub}</div>
          </div>
        ))}
      </div>

    </div>
  );
}

// ── STAT CAROUSEL — full-width snap-scroll cards with massive numbers ──
function StatCarousel({ slides }) {
  const scrollRef = useRef(null);
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);

  const scrollTo = (i) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.offsetWidth, behavior: "smooth" });
    setIdx(i);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setIdx(prev => {
        const next = (prev + 1) % slides.length;
        const el = scrollRef.current;
        if (el) el.scrollTo({ left: next * el.offsetWidth, behavior: "smooth" });
        return next;
      });
    }, 3200);
  };

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [slides.length]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.offsetWidth);
    if (i !== idx) { setIdx(i); resetTimer(); }
  };

  return (
    <div style={{ marginTop:4 }}>
      <style>{`
        .shg-stat-scroll { scrollbar-width:none; }
        .shg-stat-scroll::-webkit-scrollbar { display:none; }
      `}</style>
      {/* Snap-scroll track */}
      <div
        ref={scrollRef}
        className="shg-stat-scroll"
        onScroll={onScroll}
        style={{ display:"flex", overflowX:"auto", scrollSnapType:"x mandatory", gap:0,
          borderRadius:20, overflow:"hidden" }}
      >
        {slides.map((s, i) => (
          <div key={i} style={{ minWidth:"100%", scrollSnapAlign:"start", flexShrink:0,
            background:"linear-gradient(135deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)",
            backgroundSize:"300% 300%", animation:"shg-drift 8s ease-in-out infinite",
            padding:"28px 24px 24px", boxSizing:"border-box",
            display:"flex", flexDirection:"column", justifyContent:"center", minHeight:160 }}>
            <div style={{ fontSize:13, color:"#0a0906", letterSpacing:"0.22em", textTransform:"uppercase", fontWeight:700, opacity:0.6, marginBottom:8 }}>{s.sub}</div>
            <div style={{ fontSize:80, fontWeight:300, color:"#0a0906", lineHeight:1, letterSpacing:"-4px", marginBottom:8 }}>{s.value}</div>
            <div style={{ fontSize:16, color:"#0a0906", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.14em", opacity:0.8 }}>{s.label}</div>
          </div>
        ))}
      </div>
      {/* Dot indicators */}
      <div style={{ display:"flex", justifyContent:"center", gap:6, marginTop:8 }}>
        {slides.map((_,i) => (
          <button key={i} onClick={()=>{ scrollTo(i); resetTimer(); }}
            style={{ width: i===idx ? 22 : 7, height:7, borderRadius:4, border:"none", cursor:"pointer", padding:0,
              background: i===idx ? "#0a0906" : "rgba(10,9,6,0.25)", transition:"all 0.3s ease" }}/>
        ))}
      </div>
    </div>
  );
}

// ── ANALYTICS TAB, dominant emotional state + full analytics board, its own destination ──
function AnalyticsTab({ threads, listenCount, isPreview, C, setTab, emoLog=[], theme="dark", onDrillDown, openGuide, userId, token, userTier="audio", userEmail, userName, apiUrl="https://shg-backend.reshmaoracle.com" }) {
  // Replay the bar and card animations each time they scroll into view.
  useEffect(() => {
    const els = document.querySelectorAll(".shg-bar-h,.shg-bar-v,.shg-stat,.shg-pop");
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { const el = e.target; el.style.animation = "none"; void el.offsetWidth; el.style.animation = ""; } }), { threshold: 0.4 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });
  const domToday = dominant(emoLog,1), dom7 = dominant(emoLog,7), dom30 = dominant(emoLog,30);
  const manifested = threads.filter(t=>t.done).length;
  const inProgress = threads.filter(t=>!t.done).length;

  const [recommendation, setRecommendation] = useState(null);
  const [recLoading, setRecLoading] = useState(false);
  const [streakDays, setStreakDays] = useState([]);
  const [catCounts, setCatCounts] = useState({});
  // Listening calendar from this device (or a sample in preview); the server's copy replaces it when it arrives.
  useEffect(() => {
    const today = new Date(); const cal = [];
    let days;
    if (isPreview) days = new Set([...Array(30)].map((_,i)=>i).filter(i => i < 21 || i % 3 === 0).map(i => { const d = new Date(today); d.setDate(today.getDate()-i); return d.toISOString().slice(0,10); }));
    else { let l = []; try { l = JSON.parse(localStorage.getItem("shg_listen_log") || "[]"); } catch {} days = new Set(l.map(e => String(e.d||"").slice(0,10))); }
    for (let i = 29; i >= 0; i--) { const d = new Date(today); d.setDate(today.getDate()-i); const k = d.toISOString().slice(0,10); cal.push({ date:k, listened:days.has(k) }); }
    if (cal.some(d => d.listened)) setStreakDays(cal);
  }, [isPreview]);
  const [reminderSent, setReminderSent] = useState(false);
  const [listenEvents, setListenEvents] = useState([]);

  // ── REAL BACKEND ANALYTICS ──
  const [analyticsData, setAnalyticsData] = useState(null);
  const [weeklyInsight, setWeeklyInsight] = useState(null);

  useEffect(() => {
    if (isPreview || !userId || !token) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${apiUrl}/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setAnalyticsData(data);
        }
      } catch (e) { /* non-blocking */ }
    })();
    return () => { cancelled = true; };
  }, [userId, isPreview, token, apiUrl]);

  useEffect(() => {
    if (isPreview || !userId || !token) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${apiUrl}/insight/weekly`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && data.insight) setWeeklyInsight(data.insight);
        }
      } catch (e) { /* non-blocking */ }
    })();
    return () => { cancelled = true; };
  }, [userId, isPreview, token, apiUrl]);

  const fetchRecommendation = async () => {
    if (isPreview || !userId || !token) return;
    setRecLoading(true);
    try {
      const res = await fetch(`${QUIZ_WORKER_URL}/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ tracks: TRACKS.map(t=>({title:t.title,cat:t.cat})), recentPlays: listenEvents }),
      });
      const data = await res.json();
      if (data.recommendation) setRecommendation(data.recommendation);
    } catch (e) { /* non-blocking */ }
    setRecLoading(false);
  };

  const sendReminder = async () => {
    if (isPreview || !userId || !token) return;
    try {
      await fetch(`${QUIZ_WORKER_URL}/reminder`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reminder_time: "20:00" }),
      });
      setReminderSent(true);
    } catch (e) { /* non-blocking */ }
  };

  // ── PATTERNS: real listen counts per category/track, correlated with manifested desires ──
  const [patterns, setPatterns] = useState(null); // null = loading/no data yet
  const [realListens, setRealListens] = useState({ total:0, week:[0,0,0,0,0,0,0] });
  useEffect(() => {
    if (isPreview || !userId) { setPatterns([]); return; }
    let cancelled = false;
    (async () => {
      let plays, playsErr;
      try {
        const data = await quizApi("/listen-history", token);
        plays = data.events;
      } catch (e) {
        playsErr = e;
      }
      if (cancelled) return;
      if (playsErr || !plays || plays.length === 0) { setPatterns([]); setRealListens({ total:0, week:[0,0,0,0,0,0,0] }); return; }

      // Real weekly play counts (Mon-Sun) from actual played_at timestamps
      const now = new Date();
      const dayOfWeek = (now.getDay()+6)%7; // 0=Mon ... 6=Sun
      const monday = new Date(now); monday.setDate(now.getDate()-dayOfWeek); monday.setHours(0,0,0,0);
      const weekCounts = [0,0,0,0,0,0,0];
      plays.forEach(p => {
        const d = new Date(p.played_at);
        const diffDays = Math.floor((d - monday) / 86400000);
        if (diffDays >= 0 && diffDays < 7) weekCounts[diffDays]++;
      });
      setRealListens({ total: plays.length, week: weekCounts });

      // Aggregate listens per category and per track
      const byCategory = {}; // category -> {count, trackTitles:Set}
      const byTrack = {}; // title -> {count, category}
      plays.forEach(p => {
        const cat = p.category;
        const title = p.title;
        if (cat) { byCategory[cat] = byCategory[cat] || {count:0}; byCategory[cat].count++; }
        if (title) { byTrack[title] = byTrack[title] || {count:0, category:cat}; byTrack[title].count++; }
      });

      // Manifested desires with a category, grouped
      const manifestedByCategory = {};
      threads.filter(t=>t.done && t.category).forEach(t => {
        manifestedByCategory[t.category] = (manifestedByCategory[t.category]||0) + 1;
      });

      const catInsights = Object.entries(byCategory)
        .map(([cat,v]) => ({ type:"category", name:cat, listens:v.count, manifestedCount: manifestedByCategory[cat]||0 }))
        .filter(i => i.manifestedCount > 0)
        .sort((a,b)=>b.manifestedCount-a.manifestedCount || b.listens-a.listens);

      const trackInsights = Object.entries(byTrack)
        .map(([title,v]) => ({ type:"track", name:title, listens:v.count, manifestedCount: manifestedByCategory[v.category]||0 }))
        .filter(i => i.manifestedCount > 0)
        .sort((a,b)=>b.manifestedCount-a.manifestedCount || b.listens-a.listens);

      setPatterns([...catInsights.slice(0,2), ...trackInsights.slice(0,2)].slice(0,3));
    })();
    return () => { cancelled = true; };
  }, [userId, isPreview, threads]);

  // Fetch listening events from quiz worker for streak + category radar + recommendations
  useEffect(() => {
    if (isPreview || !userId || !token) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${QUIZ_WORKER_URL}/listen-history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        const events = data.events || [];
        if (cancelled) return;
        setListenEvents(events);

        // Streak: consecutive days with at least one listen
        const days = new Set(events.map(e => e.played_at?.slice(0,10)));
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 60; i++) {
          const d = new Date(today); d.setDate(today.getDate() - i);
          const key = d.toISOString().slice(0,10);
          if (days.has(key)) streak++;
          else if (i > 0) break;
        }
        // Last 30 days for calendar
        const cal = [];
        for (let i = 29; i >= 0; i--) {
          const d = new Date(today); d.setDate(today.getDate() - i);
          cal.push({ date: d.toISOString().slice(0,10), listened: days.has(d.toISOString().slice(0,10)) });
        }
        setStreakDays(cal);

        // Category counts
        const cc = {};
        events.forEach(e => { if (e.category) cc[e.category] = (cc[e.category]||0) + 1; });
        setCatCounts(cc);
      } catch (e) { /* non-blocking */ }
    })();
    return () => { cancelled = true; };
  }, [userId, isPreview, token]);

  return (
    <div>
      {/* Greeting: the board opens on her, not on a page title. */}
      <div className="shg-gb shg-hero" style={{ margin:"16px 16px 14px", padding:"16px 18px", borderRadius:18 }}>
        <div style={{ fontSize:11, letterSpacing:".3em", fontWeight:400, color:C.cr, marginBottom:6 }}>YOUR INSIGHTS</div><div className="shg-gt" style={{ fontSize:20, fontWeight:400, lineHeight:1.1, display:"inline-block" }}>Hello, {isPreview ? "Reshma" : ((userName && userName !== "you") ? userName.split(" ")[0] : "beautiful")}</div>
        <div style={{ fontSize:14, fontWeight:300, color:C.cr, marginTop:4 }}>{isPreview ? "Preview: these are sample numbers." : "Here are today's insights."}</div>
      </div>

      {/* IMAGINE IT IS 2030 — live chart: bars rise, a light sweeps across them, sparks drift up */}
      <div className="shg-no-paper shg-2030" style={{ margin:"0 16px 14px", background:"#000", borderRadius:18, padding:"14px 14px 12px", border:"1px solid rgba(242,236,228,.18)", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <style>{`.shg-2030 .bar{position:relative;overflow:hidden;transform-origin:bottom;animation:shg-rise 1.4s cubic-bezier(.2,.8,.2,1) both}.shg-2030 .bar::after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.55) 50%,transparent 70%);transform:translateX(-120%);animation:shg-sweep 3.2s ease-in-out 1.4s infinite}.shg-2030 .spark{position:absolute;bottom:14px;width:4px;height:4px;border-radius:50%;background:#F5E0A0;box-shadow:0 0 8px #F5E0A0;opacity:0;animation:shg-spark 3.6s ease-in infinite}@keyframes shg-rise{from{transform:scaleY(0)}to{transform:scaleY(1)}}@keyframes shg-sweep{0%{transform:translateX(-120%)}60%,100%{transform:translateX(120%)}}@keyframes shg-spark{0%{opacity:0;transform:translateY(0)}15%{opacity:1}100%{opacity:0;transform:translateY(-120px)}}@media(prefers-reduced-motion:reduce){.shg-2030 .bar,.shg-2030 .bar::after,.shg-2030 .spark{animation:none}}`}</style>
        {[12,30,52,71,88].map((l,i)=><span key={i} className="spark" style={{ left:`${l}%`, animationDelay:`${i*0.7}s` }}/>)}
        <div className="shg-gt" style={{ fontSize:13, fontWeight:400, letterSpacing:".3em", display:"inline-block" }}>IMAGINE IT IS 2030</div>
        <div style={{ fontSize:13, fontWeight:300, color:"#F2ECE4", margin:"4px 0 12px" }}>You joined in 2026.<br/>Look how much proof you're holding now.</div>
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:8, height:120 }}>
          {[["2026",900],["2027",1900],["2028",3000],["2029",4200],["2030",5500]].map(([y,v],i)=>(
            <div key={y} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-end", height:"100%" }}>
              <div style={{ fontSize:12, color:"#F2ECE4", marginBottom:4 }}>{v.toLocaleString()}</div>
              <div className="bar" style={{ width:"100%", height:`${(v/5500)*84}px`, borderRadius:8, background:"linear-gradient(90deg,#F5E0A0,#E8B870,#BFA5D8,#2CB7A7)", animationDelay:`${i*150}ms` }}/>
              <div className="shg-gt" style={{ fontSize:12, marginTop:4, display:"inline-block" }}>{y}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize:13, fontWeight:300, color:"#F2ECE4", marginTop:10 }}>Doubt kills manifestation. We kill the doubt. Keep going.</div>
      </div>

      {/* PROGRESS — the reference's Progress screen (docs/design/shg-app-design.html) */}
      {(() => {
        const proofs = isPreview ? 142 : threads.reduce((a,t)=>a+(t.signs?.length||0),0) + manifested;
        const done = isPreview ? 12 : manifested;
        const weeks = isPreview ? [25,35,42,40,55,62,60,75,88,100] : (() => {
          // Signs are stored with short dates like "12 Jun"; read them as this year (or last year if that is in the future).
          const now = Date.now(), counts = Array(10).fill(0);
          threads.forEach(t => (t.signs||[]).forEach(sg => {
            let d = new Date(`${sg.date} ${new Date().getFullYear()}`);
            if (isNaN(d)) return;
            if (d.getTime() > now + 86400000) d.setFullYear(d.getFullYear() - 1);
            const w = Math.floor((now - d.getTime()) / (7*86400000));
            if (w >= 0 && w < 10) counts[9 - w]++;
          }));
          const max = Math.max(...counts);
          return max ? counts.map(c => Math.max(4, Math.round(c / max * 100))) : null;
        })();
        const hawk = isPreview ? { pct:72, label:"Courage to Love, 200 to 500" } : (() => {
          // Her own check-ins: first and latest level in the last 30 days.
          const recent = (emoLog||[]).filter(e => Date.now() - new Date(e.date).getTime() < 30*86400000);
          if (!recent.length) return null;
          const val = n => (HAWKINS.find(h => h.n === n) || {}).v;
          const a = recent[0].level, b = recent[recent.length-1].level, vb = val(b), va = val(a);
          if (!vb) return null;
          return { pct: Math.min(100, Math.round(vb / 1000 * 100)), label: a === b ? `${b}, ${vb}` : `${a} to ${b}, ${va} to ${vb}` };
        })();
        const fast = isPreview ? { area:"Luck", note:"about 3 days per sign" } : (analyticsData?.category_speed?.[0] ? { area:analyticsData.category_speed[0].category.replace("maxxing",""), note:`about ${analyticsData.category_speed[0].avg_days} days to manifest` } : null);
        return (
          <div className="shg-gb shg-paper" style={{ margin:"0 16px 18px",borderRadius:22,padding:"24px 22px" }}>
            <div className="shg-gt" style={{ fontSize:22,fontWeight:500,marginBottom:14,display:"inline-block" }}>Progress</div>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20 }}>
              <div className="shg-paper shg-glowedge" style={{ borderRadius:18,padding:"16px",textAlign:"center" }}><div style={{ fontSize:26,fontWeight:500,lineHeight:1.1 }}>{proofs}</div><div style={{ fontSize:14 }}>signs and wins logged in total</div></div>
              <div className="shg-gb shg-paper" style={{ borderRadius:18,padding:"16px",textAlign:"center",color:C.cr }}><div className="shg-gt" style={{ fontSize:26,fontWeight:500,lineHeight:1.1 }}>{done}</div><div style={{ fontSize:14 }}>desires manifested so far</div></div>
            </div>
            {!weeks && !isPreview && <div style={{ fontSize:16,color:C.cr,marginBottom:18 }}>Log your first sign in proofOS and your weeks start filling in here.</div>}
            {weeks && <>
              <div className="shg-gt" style={{ fontSize:13,letterSpacing:"0.18em",marginBottom:10 }}>SIGNS PER WEEK · LAST 10 WEEKS</div>
              <div style={{ display:"flex",alignItems:"flex-end",gap:8,height:130,marginBottom:20 }}>
                {weeks.map((h,i)=><i key={i} className="shg-gfill shg-bar-v" style={{ flex:1,borderRadius:6,height:`${h}%`,animationDelay:`${i*60}ms` }}/>)}
              </div>
            </>}
            {hawk && <>
              <div className="shg-gt" style={{ fontSize:15,letterSpacing:"0.18em",marginBottom:10 }}>HAWKINS LEVEL</div>
              <div style={{ height:14,borderRadius:8,background:"#2a2a2a",marginBottom:8,overflow:"hidden" }}><div className="shg-gfill shg-bar-h" style={{ height:"100%",width:`${hawk.pct}%`,borderRadius:8 }}/></div>
              <div style={{ fontSize:16,color:C.cr,marginBottom:6 }}>{hawk.label}</div>
              <button onClick={()=>window.dispatchEvent(new CustomEvent("shg-open-guide",{ detail:{ key:"hawkins" } }))} style={{ background:"#000",color:"#F2ECE4",border:"none",borderRadius:999,padding:"7px 14px",fontSize:13,cursor:"pointer",marginBottom:18,fontFamily:"'Jost',sans-serif" }}>What is the Hawkins scale? ›</button>
            </>}
            {fast && <div className="shg-paper shg-glowedge shg-pop" style={{ borderRadius:18,padding:"16px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12 }}><div><div style={{ fontSize:12,letterSpacing:".22em" }}>YOUR FASTEST AREA</div><div style={{ fontSize:26,fontWeight:500,marginTop:4 }}>{fast.area}</div></div><div style={{ textAlign:"right" }}><div style={{ fontSize:26,fontWeight:500,lineHeight:1 }}>{(fast.note.match(/\d+/)||["?"])[0]}</div><div style={{ fontSize:13 }}>days on average</div></div></div>}
            <div style={{ fontSize:15,textAlign:"center",marginTop:18,color:C.cr }}>The more you log, the more the AI learns.</div>
          </div>
        );
      })()}

      {/* PROGRESS OVER TIME — the reason to come back: each period against the
          one before it. Preview shows sample figures; real members see it once
          the backend returns period totals. */}
      {(() => {
        const periods = isPreview ? {
          week:  { label:"This week vs last week",   rows:[["Signs logged",13,8],["Desires manifested",2,1],["Belief shift (avg /10)",7.4,6.1],["Emotional level (Hawkins)",420,310]] },
          month: { label:"This month vs last month", rows:[["Signs logged",41,29],["Desires manifested",6,4],["Belief shift (avg /10)",7.1,5.8],["Emotional level (Hawkins)",400,290]] },
          year:  { label:"This year vs last year",   rows:[["Signs logged",200,64],["Desires manifested",100,31],["Belief shift (avg /10)",6.9,4.2],["Emotional level (Hawkins)",380,175]] },
        } : (analyticsData?.periods || (() => {
          // Built from what's saved on this device.
          const ts = v => { if (!v) return 0; if (typeof v === "number") return v; const d = new Date(String(v).replace("Sept","Sep")); return isNaN(d) ? 0 : d.getTime(); };
          let log = []; try { log = JSON.parse(localStorage.getItem("shg_listen_log") || "[]"); } catch {}
          const real = threads.filter(t => !t.isBucket);
          const now = Date.now(), span = { week:7*86400000, month:30*86400000, year:365*86400000 };
          const count = (arr, get, from, to) => arr.filter(x => { const v = get(x); return v >= from && v < to; }).length;
          const mk = (k, label) => { const L = span[k]; const row = (name, arr, get) => [name, count(arr, get, now-L, now+1), count(arr, get, now-2*L, now-L)];
            return { label, rows:[row("Intentions set", real, t => t.createdTs || ts(t.createdAt)), row("Desires manifested", real.filter(t=>t.done), t => ts(t.manifestedAt)), row("Listens", log, e => ts(e.d))] }; };
          const p = { week:mk("week","This week vs last week"), month:mk("month","This month vs last month"), year:mk("year","This year vs last year") };
          return Object.values(p).some(x => x.rows.some(r => r[1] || r[2])) ? p : null;
        })());
        if (!periods) return null;
        return (
          <div className="shg-paper shg-glowedge" style={{ margin:"0 16px 18px", padding:"22px 20px", borderRadius:22 }}>
            <div style={{ fontSize:13, fontWeight:500, letterSpacing:"0.18em", textTransform:"uppercase", color:C.cr, marginBottom:20 }}>Your progress over time</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:16 }}>
              {["week","month","year"].map(k => periods[k] && (
                <div key={k} style={{ flex:"1 1 260px", minWidth:0 }}>
                  <div style={{ fontSize:16, fontWeight:500, color:C.cr, marginBottom:14 }}>{periods[k].label}</div>
                  {periods[k].rows.map(([name, now, before]) => {
                    const max = Math.max(now, before) || 1;
                    return (
                      <div key={name} style={{ marginBottom:14 }}>
                        <div style={{ fontSize:14, color:C.cr, marginBottom:6 }}>{name}</div>
                        {[[`Last ${k}`,before,false],[`This ${k}`,now,true]].map(([lab,v,hi])=>(
                          <div key={lab} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                            <span style={{ fontSize:12, color:C.cr, width:74, flexShrink:0 }}>{lab}</span>
                            <div style={{ flex:1, height:12, borderRadius:6, background:"rgba(0,0,0,.08)", overflow:"hidden" }}><div className={hi?"shg-bar-h":""} style={{ height:"100%", width:`${(v/max)*100}%`, borderRadius:6, background: hi ? "linear-gradient(90deg,#F5E0A0,#E8B870,#BFA5D8,#2CB7A7)" : "rgba(0,0,0,.25)" }}/></div>
                            <span style={{ fontSize:14, fontWeight:hi?600:400, color:C.cr, width:44, textAlign:"right", flexShrink:0 }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* MANIFESTATION HERO — the whole point of the app */}
      <style>{`
        .shg-glowedge{border:1.5px solid #BFA5D8!important;animation:shg-bg-pulse 4s ease-in-out infinite}
        .shg-inview .shg-bar-h,.shg-inview .shg-bar-v,.shg-inview.shg-pop{animation-play-state:running}
        .shg-pop{animation:shg-pop .9s cubic-bezier(.2,.8,.2,1) both,shg-bg-pulse 4s ease-in-out .9s infinite}
        @keyframes shg-pop{from{transform:scale(.94);opacity:.4}to{transform:none;opacity:1}}
        @keyframes shg-bg-pulse{0%,100%{box-shadow:0 0 22px rgba(232,184,112,.45),0 0 50px rgba(191,165,216,.25)}50%{box-shadow:0 0 36px rgba(44,183,167,.6),0 0 80px rgba(191,165,216,.4)}}
        @keyframes shg-lucky{0%{background-position:0% 50%;box-shadow:0 0 18px rgba(245,224,160,.5)}50%{background-position:100% 50%;box-shadow:0 0 32px rgba(44,183,167,.55)}100%{background-position:0% 50%;box-shadow:0 0 18px rgba(245,224,160,.5)}}
        .shg-bar-h{transform-origin:left center;animation:shg-grow-x 1.2s cubic-bezier(.2,.8,.2,1) both,shg-bar-glow 2.6s ease-in-out 1.2s infinite}
        .shg-bar-v{transform-origin:bottom center;animation:shg-grow-y 1s cubic-bezier(.2,.8,.2,1) both,shg-bar-glow 2.6s ease-in-out 1s infinite}
        @keyframes shg-grow-x{from{transform:scaleX(0)}to{transform:scaleX(1)}}
        @keyframes shg-grow-y{from{transform:scaleY(0)}to{transform:scaleY(1)}}
        @keyframes shg-bar-glow{0%,100%{box-shadow:0 0 6px rgba(232,184,112,.6)}50%{box-shadow:0 0 16px rgba(44,183,167,.9)}}
        @media (prefers-reduced-motion: reduce){.shg-glowedge,.shg-pop,.shg-bar-h,.shg-bar-v{animation:none!important}}
        @keyframes shg-drift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shg-count-in { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
        @keyframes shg-glow-pulse {
          0%,100% { box-shadow: 0 0 32px rgba(232,184,112,0.5), 0 4px 60px rgba(44,183,167,0.25); }
          50%      { box-shadow: 0 0 56px rgba(191,165,216,0.6), 0 4px 80px rgba(44,183,167,0.4); }
        }
      `}</style>

      {/* PROOF SNAPSHOT — the four numbers stay on screen together. The carousel
          above rotates, so on its own no single stat is ever reliably visible. */}
      {(() => {
        const signsTotal = isPreview ? 200 : (analyticsData?.total_signs ?? threads.reduce((a,t)=>a+(t.signs?.length||0),0));
        const mDone = isPreview ? 100 : manifested;
        const mOpen = isPreview ? 10 : inProgress;
        const proofTotal = mDone + signsTotal;
        const tiles = [
          [mDone,      "Manifested since you joined",  C.accentGold],
          [mOpen,      "Intentions in progress now",   C.accentLav],
          [signsTotal, "Signs logged since you joined",  C.cr],
          [isPreview ? "4.2h" : `${((analyticsData?.weekly_minutes ?? 0)/60).toFixed(1)}h`, "Listening this week", C.accentTeal],
        ];
        return (
          <>
            <div style={{ display:"flex", flexWrap:"wrap", gap:12, margin:"0 16px 18px" }}>
              {tiles.map(([v,l,col],i)=>(
                <div key={i} className="shg-paper shg-glowedge shg-stat" style={{ flex:"1 1 calc(50% - 6px)", minWidth:0, borderRadius:20, padding:"26px 22px", animationDelay:`${i*0.4}s` }}>
                  <div className="shg-gt" style={{ fontSize:26, fontWeight:500, lineHeight:1, marginBottom:8, display:"inline-block" }}>{v}</div>
                  <div style={{ fontSize:14, color:C.cr, fontWeight:300, lineHeight:1.35 }}>{l}</div>
                </div>
              ))}
            </div>

            {/* PROOF COMPOUNDS — every logged sign and win is one more piece of
                evidence. This is the method deck's year-one argument, live. */}
            {proofTotal > 0 && (
              <div className="shg-paper shg-glowedge" style={{ margin:"0 16px 18px", padding:"22px 20px", borderRadius:22 }}>
                <div style={{ fontSize:13, fontWeight:500, letterSpacing:"0.18em", textTransform:"uppercase", color:C.cr, marginBottom:14 }}>Your proof is compounding</div>
                <div style={{ textAlign:"center", marginBottom:12 }}>
                  <div style={{ fontSize:26, fontWeight:500, lineHeight:1, color:C.cr }}>{proofTotal}</div>
                  <div style={{ fontSize:14, color:C.cr, marginTop:4 }}>pieces of proof</div>
                </div>
                <div className="shg-paper" style={{ height:14, borderRadius:8, background:C.bg4, overflow:"hidden", marginBottom:12 }}>
                  <div className="shg-bar-h" style={{ height:"100%", borderRadius:5, width:`${Math.min(100,(proofTotal/365)*100)}%`, minWidth:6, background:OMBRE }}/>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, color:C.cr }}><span>0</span><span>{proofTotal >= 365 ? "A year of evidence ✦" : `${365-proofTotal} to a year of evidence`}</span><span>365</span></div>
              </div>
            )}

            {/* HOW FAST EACH AREA MOVES — the comparison is the insight. Knowing
                you manifest love in 21 days and money in 44 tells you something
                a listen count never will. */}
            {(() => {
              const speeds = isPreview
                ? [["Lovemaxxing",21],["Luckygirlmaxxing",29],["Beautymaxxing",38],["Richgirlmaxxing",44]]
                : (analyticsData?.category_speed || []).map(c=>[c.category,c.avg_days]).filter(([,d])=>d!=null);
              if (!speeds.length) return null;
              const slowest = Math.max(...speeds.map(s=>s[1]));
              return (
                <div className="shg-paper shg-glowedge" style={{ margin:"0 16px 18px", padding:"22px 20px", borderRadius:22 }}>
                  <div style={{ fontSize:13, fontWeight:500, letterSpacing:"0.18em", textTransform:"uppercase", color:C.cr, marginBottom:6 }}>How fast each area shifts</div>
                  <div style={{ fontSize:14, fontWeight:300, color:C.cr, marginBottom:14 }}>Average days from setting a desire to logging it manifested.</div>
                  {speeds.map(([cat,days],i)=>(
                    <div key={cat} style={{ display:"flex", alignItems:"center", gap:14, marginBottom:i===speeds.length-1?0:16 }}>
                      <div style={{ fontSize:14, fontWeight:400, color:C.cr, width:90, flexShrink:0 }}>{cat.replace("maxxing","")}</div>
                      <div className="shg-paper" style={{ flex:1, height:10, background:C.bg4, borderRadius:8, overflow:"hidden" }}>
                        <div className="shg-bar-h" style={{ height:"100%", borderRadius:4, width:`${Math.max(8,(days/slowest)*100)}%`, background: OMBRE }}/>
                      </div>
                      <div style={{ fontSize:22, fontWeight:500, color:C.cr, width:64, textAlign:"right", fontVariantNumeric:"tabular-nums" }}>{days}d</div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* WHAT YOU SAID WAS STOPPING YOU — their own onboarding answer,
                answered back with what they have actually done since. */}
            {(() => {
              const blockText = isPreview ? "I keep getting close, then it slips" : (analyticsData?.onboarding_block || null);
              if (!blockText) return null;
              return (
                <div className="shg-paper shg-glowedge" style={{ margin:"0 16px 18px", padding:"22px 20px", borderRadius:22 }}>
                  <div style={{ fontSize:13, fontWeight:500, letterSpacing:"0.18em", textTransform:"uppercase", color:C.cr, marginBottom:12 }}>What you said was stopping you</div>
                  <div style={{ fontSize:19, fontWeight:400, color:C.cr, lineHeight:1.35, textAlign:"center", textDecoration:"line-through", textDecorationThickness:1, marginBottom:16 }}>“{blockText}”</div>
                  <div style={{ display:"flex", gap:10 }}>
                    {[[signsTotal,"signs logged","track"],[mDone,"manifested","lucky"]].map(([v,l,ic])=>(
                      <div key={l} style={{ flex:1, textAlign:"center" }}>
                        <img src={`/icons/${ic}.webp`} alt="" style={{ width:54, height:54, borderRadius:"50%", display:"block", margin:"0 auto 6px" }}/>
                        <div style={{ fontSize:26, fontWeight:500, color:C.cr, lineHeight:1 }}>{v}</div>
                        <div style={{ fontSize:13, color:C.cr, marginTop:3 }}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize:14, color:C.cr, textAlign:"center", marginTop:12 }}>The evidence against it.</div>
                </div>
              );
            })()}
          </>
        );
      })()}

      {/* WEEKLY AI INSIGHT */}
      {(isPreview || weeklyInsight || analyticsData?.fastest_category) && (
        <div className="shg-paper shg-glowedge" style={{ margin:"0 16px 18px", padding:"22px 20px", borderRadius:22 }}>
          <div style={{ fontSize:13, fontWeight:500, color:C.cr, letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:14 }}>This week's insight ✦</div>
          {isPreview ? (
            <div style={{ display:"flex", gap:10 }}>
              {[["love","3×","more Love listens"],["track","5","signs for love"],["session","2","love desires open"]].map(([ic,v,l])=>(
                <div key={l} style={{ flex:1, textAlign:"center" }}>
                  <img src={`/icons/${ic}.webp`} alt="" style={{ width:50, height:50, borderRadius:"50%", display:"block", margin:"0 auto 6px" }}/>
                  <div style={{ fontSize:24, fontWeight:500, color:C.cr, lineHeight:1 }}>{v}</div>
                  <div style={{ fontSize:13, color:C.cr, marginTop:3, lineHeight:1.3 }}>{l}</div>
                </div>
              ))}
            </div>
          ) : weeklyInsight ? (
            <div style={{ fontSize:17, color:C.cr, lineHeight:1.55 }}>"{weeklyInsight}"</div>
          ) : analyticsData?.fastest_category ? (
            <div style={{ fontSize:17, color:C.cr, lineHeight:1.55 }}>
              Your fastest-manifesting area is <span style={{ color:C.accentGold, fontWeight:500 }}>{analyticsData.fastest_category}</span>.
              {analyticsData.avg_days_to_manifest != null && ` Average time to manifest: ${analyticsData.avg_days_to_manifest} days.`}
              {analyticsData.momentum_score != null && ` Momentum score: ${analyticsData.momentum_score}.`}
            </div>
          ) : null}
        </div>
      )}

      {/* PATTERN RECOGNITION — what's actually moving the needle */}
      {(isPreview || (patterns && patterns.length > 0)) && (
        <div className="shg-paper shg-glowedge" style={{ margin:"0 16px 18px", padding:"20px 18px", borderRadius:22 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <span style={{ fontSize:13, fontWeight:500, color:C.cr, letterSpacing:"0.18em", textTransform:"uppercase" }}>Pattern recognition</span>
            {isPreview && <span style={{ fontSize:15, color:C.accentGold, fontWeight:500 }}>preview data</span>}
          </div>
          {isPreview ? (
            // Patterns join what she does (signs, belief ratings, listening
            // time) to what happens. Illustrative in preview; each one is a
            // comparison her own logged data can support once it exists.
            [
              ["Signs come before wins", "Average week", 2, "Week before a win", 6, " signs"],
              ["Belief rises after you log", "Day without a sign", 5.1, "Day after a sign", 7.1, "/10"],
              ["Night listening is faster", "Morning only", 31, "Listened at night", 18, " days"],
              ["Your block is loosening", "Before", 1, "Last 5 desires", 4, " manifested"],
            ].map(([head, la, lv, ra, rv, unit], i) => {
              const max = Math.max(lv, rv);
              return (
                <div key={i} style={{ padding:"12px 0" }}>
                  <div style={{ fontSize:15, fontWeight:500, color:C.cr, marginBottom:8 }}>✦ {head}</div>
                  {[[la,lv,false],[ra,rv,true]].map(([lab,v,hi])=>(
                    <div key={lab} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                      <span style={{ fontSize:13, color:C.cr, width:104, flexShrink:0 }}>{lab}</span>
                      <div style={{ flex:1, height:12, borderRadius:6, background:"rgba(0,0,0,.08)", overflow:"hidden" }}><div className={hi?"shg-bar-h":""} style={{ height:"100%", width:`${(v/max)*100}%`, borderRadius:6, background: hi ? "linear-gradient(90deg,#F5E0A0,#E8B870,#BFA5D8,#2CB7A7)" : "rgba(0,0,0,.28)" }}/></div>
                      <span style={{ fontSize:14, fontWeight:hi?600:400, color:C.cr, textAlign:"right", width:84, flexShrink:0 }}>{v}{unit}</span>
                    </div>
                  ))}
                </div>
              );
            })
          ) : patterns.map((p,i,arr) => {
            const convRate = Math.round((p.manifestedCount / Math.max(p.listens,1)) * 100);
            return (
              <div key={i} style={{ padding:"14px 0", borderBottom: i<arr.length-1 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ fontSize:16, fontWeight:500, color:C.cr, marginBottom:4 }}>✦ {p.name}</div>
                <div style={{ fontSize:16, color:C.cr, lineHeight:1.5 }}>
                  {p.manifestedCount} desire{p.manifestedCount!==1?"s":""} manifested across {p.listens} listens — {convRate}% of listens ended in a win.
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI RECOMMENDATION CARD */}
      <div className="shg-paper shg-glowedge" style={{ margin:"0 16px 18px", padding:"18px 16px", borderRadius:22 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <span style={{ fontSize:13, fontWeight:500, color:C.cr, letterSpacing:"0.18em", textTransform:"uppercase" }}>Your next recommended listen ✦</span>
          {!isPreview && (
            <button onClick={fetchRecommendation} disabled={recLoading} style={{ fontSize:15, color:C.accentLav, background:"rgba(191,165,216,0.1)", border:"1px solid rgba(191,165,216,0.3)", borderRadius:8, padding:"4px 10px", cursor:"pointer", fontFamily:"'Jost',sans-serif" }}>
              {recLoading ? "thinking…" : recommendation ? "refresh" : "ask AI"}
            </button>
          )}
        </div>
        {isPreview ? (()=>{ const t = TRACKS.find(x=>x.cat==="Luckygirlmaxxing") || TRACKS[0]; return (
          <div style={{ display:"flex", gap:14, alignItems:"center" }}>
            <Thumb cat={t.cat} size={88} radius={14}/>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:18, fontWeight:500, color:C.cr, lineHeight:1.3 }}>{displayTitle(t.title)}</div>
              <div style={{ fontSize:14, color:C.cr, marginTop:4 }}>{t.cat.replace("maxxing","")} · {t.format} · {t.dur}</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:8 }}>
                {["Your fastest area","Best at night","3 open intentions"].map(x=><span key={x} style={{ fontSize:12, padding:"3px 10px", border:"1px solid #000", borderRadius:999 }}>{x}</span>)}
              </div>
            </div>
          </div>
        ); })()
        : recommendation ? (
          <div>
            <div style={{ fontSize:16, color:C.cr, fontWeight:400 }}>{displayTitle(recommendation.title)}</div>
            <div style={{ fontSize:15, color:C.accentLav, marginTop:4 }}>{recommendation.category}</div>
            <div style={{ fontSize:15, color:C.mu, marginTop:8, lineHeight:1.5, fontStyle:"italic" }}>"{recommendation.reason}"</div>
          </div>
        ) : (
          <div style={{ fontSize:16, color:C.mu }}>Tap "ask AI" and the algorithm learns your patterns to suggest what to listen to next.</div>
        )}
      </div>

      {/* STREAK CALENDAR */}
      {streakDays.length > 0 && (
        <div className="shg-paper" style={{ margin:"0 16px 14px", padding:"18px 16px", borderRadius:16, background:C.bg2, border:`1px solid ${C.border}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <span style={{ fontSize:15, fontWeight:400, color:C.accentGold, letterSpacing:"0.18em", textTransform:"uppercase" }}>Listening streak{isPreview ? " · sample" : ""}</span>
            <span style={{ fontSize:15, color:C.accentGold }}>{streakDays.filter(d=>d.listened).length} days</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(10,1fr)", gap:4 }}>
            {streakDays.map((d,i) => (
              <div key={i} title={d.date} style={{ width:"100%", paddingBottom:"100%", position:"relative", borderRadius:4, background: d.listened ? "#E8B870" : "rgba(232,184,112,0.1)" }}/>
            ))}
          </div>
          <div style={{ fontSize:15, color:C.mu, marginTop:8 }}>Last 30 days - gold = listened</div>
        </div>
      )}

      {/* CATEGORY RADAR */}
      {!isPreview && Object.keys(catCounts).length > 0 && (
        <div className="shg-paper" style={{ margin:"0 16px 14px", padding:"18px 16px", borderRadius:16, background:C.bg2, border:`1px solid ${C.border}` }}>
          <div style={{ fontSize:15, fontWeight:400, color:C.accentTeal, letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:12 }}>Desire areas</div>
          {Object.entries(catCounts).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([cat,n],i,arr) => {
            const max = arr[0][1];
            const pct = Math.round((n/max)*100);
            const colors = {"Lovemaxxing":"#167A6B","Rich Girl":"#E8B870","Beauty":"#BFA5D8","Identity":"#F5E0A0","DNA":"#2CB7A7","Sleep":"#167A6B"};
            const col = colors[cat] || "#BFA5D8";
            return (
              <div key={cat} style={{ marginBottom:8 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:15, color:C.cr }}>{cat}</span>
                  <span style={{ fontSize:15, color:C.mu }}>{n} listen{n!==1?"s":""}</span>
                </div>
                <div style={{ height:6, borderRadius:3, background:"rgba(255,255,255,0.05)", overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${pct}%`, borderRadius:3, background:col, transition:"width 0.6s ease" }}/>
                </div>
              </div>
            );
          })}
        </div>
      )}


      {/* DESIRE NUDGE moved to Home */}
      {!isPreview && (
        <div className="shg-paper" style={{ margin:"0 16px 14px", padding:"16px 16px", borderRadius:16, background:C.bg2, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:14 }}>
          <span style={{ fontSize:26, flexShrink:0 }}>🔔</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15, color:C.cr, fontWeight:400 }}>Daily reminder</div>
            <div style={{ fontSize:15, color:C.mu, marginTop:2 }}>Get a nudge at 8pm to listen</div>
          </div>
          <button onClick={reminderSent ? undefined : sendReminder} style={{ fontSize:15, color: reminderSent ? "#2CB7A7" : C.cr, background: reminderSent ? "rgba(44,183,167,0.1)" : "rgba(0,0,0,0.06)", border:`1px solid ${reminderSent?"rgba(44,183,167,0.3)":C.border}`, borderRadius:10, padding:"8px 14px", cursor: reminderSent ? "default" : "pointer", fontFamily:"'Jost',sans-serif", whiteSpace:"nowrap" }}>
            {reminderSent ? "✓ set" : "remind me"}
          </button>
        </div>
      )}

      {/* ASK RESHMA — Goddess tier only */}
      {!isPreview && <AskReshmaCard C={C} userId={userId} token={token} userTier={userTier} userEmail={userEmail}/>}

      {/* MANIFESTATION TIMELINE */}
      <ManifestationTimeline threads={threads} listenCount={listenCount} isPreview={isPreview} C={C} />

      {/* KNOWLEDGE GUIDE, available to all tiers */}
      <div style={{ margin:"0 16px 20px" }}>
        <button onClick={()=>openGuide()} className="shg-no-paper" style={{ display:"flex", alignItems:"center", gap:14, width:"100%", padding:"12px 16px", borderRadius:16, cursor:"pointer", fontFamily:"'Jost',sans-serif", background:"#000", border:"1px solid rgba(242,236,228,0.18)", textAlign:"left" }}>
          <GuideIcon k="guide" size={52}/>
          <span style={{ flex:1 }}><span style={{ display:"block", fontSize:16, color:"#F2ECE4" }}>Guidebook</span><span style={{ display:"block", fontSize:13, color:"#F2ECE4", marginTop:2 }}>Tap me to open ›</span></span>
        </button>
      </div>
    </div>
  );
}

// ── ASK RESHMA CARD ───────────────────────────────────────────────────────────
function AskReshmaCard({ C, userId, token, userTier, userEmail }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState(null);
  const isGoddess = userTier === "goddess";
  const isDark = C?.cr !== "#000000";

  useEffect(() => {
    if (!open || !isGoddess || !userId || !token) return;
    (async () => {
      try {
        const data = await quizApi("/ask", token, { method: "GET" });
        setHistory(data.questions || []);
      } catch {}
    })();
  }, [open, isGoddess, userId, token]);

  const submit = async () => {
    if (!q.trim() || sending) return;
    setSending(true);
    try {
      await quizApi("/ask", token, {
        method: "POST",
        body: JSON.stringify({ question: q.trim(), email: userEmail }),
      });
      setSent(true);
      setQ("");
      setHistory(h => [{ id: Date.now(), question: q.trim(), status:"pending", answer:null, created_at: new Date().toISOString() }, ...(h||[])]);
    } catch {}
    setSending(false);
  };

  const grad = "linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)";

  return (
    <div style={{ margin:"0 16px 14px" }}>
      {/* Teaser card always visible */}
      <div style={{ padding:"18px 16px", borderRadius:16, background: isGoddess ? C.bg2 : "rgba(232,184,112,0.06)", border:`1px solid ${isGoddess?"rgba(232,184,112,0.35)":"rgba(232,184,112,0.2)"}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom: open&&isGoddess ? 16 : 0 }}>
          <div style={{ width:46,height:46,borderRadius:14,background:"rgba(232,184,112,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>✉️</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15,fontWeight:500,color:C.cr }}>Ask Reshma directly</div>
            <div style={{ fontSize:15,color:C.mu,marginTop:2,lineHeight:1.4 }}>
              {isGoddess
                ? "Drop a question — about the tracks, hypnosis, or your journey. Answered personally, not by AI."
                : "Goddess members get direct Q&A with Reshma — answered personally within the app."}
            </div>
          </div>
          {isGoddess ? (
            <button onClick={()=>setOpen(o=>!o)} style={{ fontSize:15,color:"#E8B870",background:"rgba(232,184,112,0.12)",border:"1px solid rgba(232,184,112,0.3)",borderRadius:10,padding:"7px 13px",cursor:"pointer",fontFamily:"'Jost',sans-serif",flexShrink:0 }}>
              {open ? "close" : "ask"}
            </button>
          ) : (
            <span style={{ fontSize:13,padding:"4px 10px",borderRadius:20,background:grad,color:"#000",fontWeight:600,flexShrink:0,whiteSpace:"nowrap" }}>Goddess</span>
          )}
        </div>

        {/* Expanded panel for Goddess members */}
        {open && isGoddess && (
          <div>
            <div style={{ fontSize:15,color:C.mu,marginBottom:10,padding:"8px 12px",borderRadius:8,background:isDark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.04)",lineHeight:1.5 }}>
              💫 Not live — Reshma answers personally, typically within a few days. Your question stays private.
            </div>
            {sent && (
              <div style={{ fontSize:16,color:"#2CB7A7",marginBottom:12,textAlign:"center",padding:"10px",borderRadius:8,background:"rgba(44,183,167,0.08)",border:"1px solid rgba(44,183,167,0.2)" }}>
                ✓ Question sent. Reshma will answer you here soon.
              </div>
            )}
            <textarea
              value={q}
              onChange={e=>{ setQ(e.target.value); setSent(false); }}
              placeholder="What would you like to ask?"
              maxLength={1000}
              rows={4}
              style={{ width:"100%",boxSizing:"border-box",padding:"12px 14px",borderRadius:10,border:`1px solid ${C.border}`,background:isDark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.04)",color:C.cr,fontSize:16,fontFamily:"'Jost',sans-serif",resize:"none",outline:"none",lineHeight:1.5,marginBottom:4 }}
            />
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
              <span style={{ fontSize:15,color:C.mu }}>{q.length}/1000</span>
              <button onClick={submit} disabled={!q.trim()||sending} style={{ padding:"9px 20px",borderRadius:10,border:"none",background:q.trim()&&!sending?grad:"rgba(128,128,128,0.2)",color:q.trim()&&!sending?"#000":"#888",fontSize:16,fontWeight:600,cursor:q.trim()&&!sending?"pointer":"not-allowed",fontFamily:"'Jost',sans-serif",transition:"all 0.2s" }}>
                {sending ? "sending…" : "Send question"}
              </button>
            </div>

            {/* Previous questions */}
            {history && history.length > 0 && (
              <div>
                <div style={{ fontSize:15,color:C.mu,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8 }}>Your questions</div>
                {history.slice(0,5).map((item,i) => (
                  <div key={item.id||i} style={{ marginBottom:10,padding:"12px 14px",borderRadius:10,background:isDark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.03)",border:`1px solid ${C.border}` }}>
                    <div style={{ fontSize:15,color:C.cr,marginBottom:4 }}>{item.question}</div>
                    {item.answer ? (
                      <div style={{ fontSize:15,color:"#2CB7A7",marginTop:6,paddingTop:6,borderTop:`1px solid ${C.border}`,lineHeight:1.5 }}>
                        <span style={{ fontWeight:600 }}>Reshma: </span>{item.answer}
                      </div>
                    ) : (
                      <div style={{ fontSize:15,color:C.mu,fontStyle:"italic" }}>Awaiting answer…</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── SEARCH TAB ────────────────────────────────────────────────────────────────
function SearchTab({ embedded=false, tracks, searchQ, setQ, play, track:cur, playing, liked, toggleLike, isPreview, C, openPlayer }) {
  const res = searchQ.length>1 ? tracks.filter(t=>{
    const q = searchQ.toLowerCase();
    if (t.title.toLowerCase().includes(q) || t.cat.toLowerCase().includes(q)) return true;
    const d = getDesc(t);
    const descText = (d.shift + " " + d.benefits.join(" ")).toLowerCase();
    return descText.includes(q);
  }) : tracks;
  return (
    <div style={{ padding:"16px 16px 0" }}>
      <style>{`.shg-search-input::placeholder{color:${C.inputCr};opacity:0.55;}`}</style>
      {!embedded && (<><div style={{ fontSize:20,fontWeight:400,marginBottom:14,color:C.cr }}>Search</div>
      <div style={{ display:"flex",alignItems:"center",gap:10,background:C.inputBg,borderRadius:10,padding:"10px 14px",marginBottom:16 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.dim} strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input className="shg-search-input" value={searchQ} onChange={e=>setQ(e.target.value)} placeholder="Tracks, categories, desires…"
          style={{ border:"none",background:"transparent",flex:1,fontSize:16,color:C.inputCr,outline:"none",fontFamily:"'Jost',sans-serif"}}/>
        {searchQ && <button onClick={()=>setQ("")} style={{ background:"none",border:"none",color:C.dim,fontSize:18,cursor:"pointer",lineHeight:1 }}>✕</button>}
      </div>
      <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginBottom:16 }}>
        {(searchQ
          ? [...new Set(tracks.flatMap(t=>[displayTitle(t.title),t.cat]).filter(x=>x&&x.toLowerCase().includes(searchQ.toLowerCase())&&x.toLowerCase()!==searchQ.toLowerCase()))].slice(0,6)
          : ["Luck","Money","Love","Confidence","Opportunities","Sleep","Hypnosis","Subliminal"]
        ).map(sug=>(
          <button key={sug} onClick={()=>setQ(sug)} style={{ background:"#F2ECE4",color:"#000",border:"none",borderRadius:999,padding:"8px 14px",fontSize:14,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>{sug}</button>
        ))}
      </div>
</>)}
      {res.map(t=>{
        const isP = cur?.id===t.id;
        return (
        <div key={t.id} onClick={()=>{play(t); openPlayer?.();}} style={{ display:"flex",alignItems:"center",gap:12,padding:10,borderRadius:16,marginBottom:10,backgroundColor:"#F2ECE4",backgroundImage:"linear-gradient(rgba(191,165,216,.35) 1px,transparent 1px),linear-gradient(90deg,rgba(191,165,216,.35) 1px,transparent 1px)",backgroundSize:"22px 22px",color:"#000",border:"1px solid #BFA5D8",outline:isP?"2px solid #BFA5D8":"none",cursor:AUDIO_URLS[t.title]?"pointer":"not-allowed" }}>
          <div style={{ position:"relative",flexShrink:0 }}>
            <Thumb title={t.title} cat={t.cat} size={48} radius={6}/>
            
          </div>
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ fontSize:15,fontWeight:400,color:"#000",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2 }}>{displayTitle(t.title)}</div>
            <div style={{ fontSize:13,color:"#000" }}>{t.artist} · {t.cat} · {t.format} · {t.dur}</div>
          </div>
          {t.isNew&&<span style={{ fontSize:11,padding:"2px 7px",background:OMBRE,color:"#000",borderRadius:20,fontWeight:400,flexShrink:0 }}>NEW</span>}
          {!isPreview && (
            <>
              <button onClick={e=>{e.stopPropagation();toggleLike(t.id,e);}} style={{ background:"none",border:"none",padding:6,lineHeight:0,flexShrink:0 }}><Ico.Heart on={liked.has(t.id)}/></button>
              <button onClick={e=>{e.stopPropagation();play(t);}} style={{ width:32,height:32,borderRadius:"50%",background:isP?"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)":"rgba(232,184,112,0.15)",border:isP?"none":"1px solid rgba(232,184,112,0.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer",padding:0 }}>
                {isP&&playing?<Ico.Pause dark={isP}/>:<Ico.Play dark={isP}/>}
              </button>
            </>
          )}
        </div>
      );})}
    </div>
  );
}

// ── LIBRARY TAB ───────────────────────────────────────────────────────────────
function LibraryTab({ threads=[], searchQ="", setQ=()=>{}, tracks, cat, setCat, libFormat, setLibFormat, play, track:cur, liked, toggleLike, playing, isPreview, C, openPlayer }) {
  const isDark = C?.cr !== "#000000";
  const cats = (["All","Liked","Lovemaxxing","Beautymaxxing","Facemaxxing","Bodymaxxing","Skinnymaxxing","Richgirlmaxxing","Businessmaxxing","Desiresmaxxing","DNAmaxxing","Selfmaxxing","Erosmaxxing","Singlemaxxing","Wellnessmaxxing","Sleepmaxxing","Studymaxxing","Friendmaxxing","Peacemaxxing","Confidencemaxxing","Stylemaxxing","Healthmaxxing","Intuitionmaxxing","Lifemaxxing","Luckygirlmaxxing","Sovereignmaxxing"]).filter(c=>c==="All"||c==="Liked"||c==="Lovemaxxing"||c==="Richgirlmaxxing"||LIVE_CATS.has(c));
  const byCat = cat==="Liked" ? tracks.filter(t=>liked.has(t.id)) : (cat==="All" ? tracks : tracks.filter(t=>t.cat===cat));
  const shown = libFormat==="All" ? byCat : byCat.filter(t=>String(t.format||"").includes(libFormat));
  const [catOpen, setCatOpen] = useState(false);
  const [dropPos, setDropPos] = useState(null);
  const catRef = useRef(null);
  const btnRef = useRef(null);
  const measureDropdown = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setDropPos({ top: r.bottom + 6, left: r.left, width: r.width });
    }
  };
  useEffect(() => {
    const onClick = e => { if (e.target.closest && e.target.closest("[data-cat-drop]")) return; if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("touchstart", onClick, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("touchstart", onClick);
    };
  }, []);
  useEffect(() => {
    if (!catOpen) return;
    measureDropdown();
    const onReposition = () => measureDropdown();
    window.addEventListener("scroll", onReposition, { passive: true, capture: true });
    window.addEventListener("resize", onReposition, { passive: true });
    return () => {
      window.removeEventListener("scroll", onReposition, { capture: true });
      window.removeEventListener("resize", onReposition);
    };
  }, [catOpen]);
  const openDropdown = () => {
    measureDropdown();
    setCatOpen(o=>!o);
  };
  const catLabel = cat==="All" ? "All categories" : (cat==="Liked" ? "Liked ♡" : cat);
  const catOptions = ["All","Liked",...cats.filter(c=>c!=="All"&&c!=="Liked")];
  return (
    <div>
      <div style={{ padding:"18px 16px 12px" }}>
        <div className="shg-gt" style={{ fontSize:28,fontWeight:500,marginBottom:14,display:"inline-block" }}>My Library</div>
        <div style={{ display:"flex",alignItems:"center",gap:10,background:"#fff",borderRadius:999,padding:"12px 16px",marginBottom:14 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <style>{`#shg-lib-search{background:transparent!important;color:#000!important;-webkit-text-fill-color:#000!important;border:none!important}#shg-lib-search::placeholder{color:#000!important;opacity:.5}`}</style>
          <input id="shg-lib-search" value={searchQ} onChange={e=>setQ(e.target.value)} placeholder="Search tracks, desires…" style={{ border:"none",background:"transparent",flex:1,fontSize:16,color:"#000",outline:"none",fontFamily:"'Jost',sans-serif" }}/>
          {searchQ && <button onClick={()=>setQ("")} aria-label="Clear search" style={{ background:"none",border:"none",fontSize:16,cursor:"pointer",color:"#000" }}>✕</button>}
        </div>
        {searchQ && <div style={{ margin:"0 -16px" }}><SearchTab embedded tracks={tracks} searchQ={searchQ} setQ={setQ} play={play} track={cur} playing={playing} liked={liked} toggleLike={toggleLike} isPreview={isPreview} C={C} openPlayer={openPlayer}/></div>}
        <div className="shg-lucky" style={{ borderRadius:20,padding:"16px 20px",display:"flex",justifyContent:"space-between",color:"#000",background:"linear-gradient(110deg,#F5E0A0,#E8B870,#BFA5D8,#2CB7A7,#167A6B,#BFA5D8,#F5E0A0)",backgroundSize:"300% 300%",animation:"shg-lucky 6s ease-in-out infinite" }}>
          <div><div style={{ fontSize:34,fontWeight:500,lineHeight:1 }}>{isPreview?21:tracks.filter(t=>liked.has(t.id)).length}</div><div style={{ fontSize:13 }}>{isPreview?"day streak":"favourites"}</div></div>
          <div style={{ textAlign:"right" }}><div style={{ fontSize:34,fontWeight:500,lineHeight:1 }}>{isPreview?127:tracks.length}</div><div style={{ fontSize:13 }}>{isPreview?"listens":"tracks"}</div></div>
        </div>
      </div>
      <style>{`body .shg-four.shg-four{display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;gap:10px;padding:4px 16px 18px!important;overflow-x:auto!important;overflow-y:hidden;-webkit-overflow-scrolling:touch;scrollbar-width:none;touch-action:pan-x pan-y}body .shg-four.shg-four::-webkit-scrollbar{display:none}body .shg-four.shg-four>*{flex:0 0 calc((100vw - 62px) / 4.4)!important;max-width:120px}`}</style>
      <div style={{ padding:"0 16px 10px",fontSize:18,color:C.cr }}>Browse by category</div>
      <div className="shg-four hscroll-ok" style={{ padding:"4px 16px 18px" }}>
        {[["Lovemaxxing","Love"],["Richgirlmaxxing","Money"],["Luckygirlmaxxing","Lucky Girl"],["Selfmaxxing","Self"],["Lifemaxxing","Life"]].map(([c,name])=>(
          <button key={c} onClick={()=>{setCat(c);setLibFormat("All");setTimeout(()=>document.getElementById("shg-browse")?.scrollIntoView({behavior:"smooth",block:"start"}),60);}} className="shg-no-paper" style={{ padding:0,border:"none",background:"none",cursor:"pointer",fontFamily:"'Jost',sans-serif",textAlign:"center" }}>
            <div style={{ borderRadius:14,overflow:"hidden",aspectRatio:"1" }}><Thumb cat={c} size="100%" radius={14}/></div>
            <div style={{ marginTop:8,fontSize:15,color:C.cr }}>{name}</div>
          </button>
        ))}
      </div>
      {/* JUMP BACK IN */}
      <Sec title="Jump back in" C={C}>
        <div className="shg-nw shg-nw-scroll hscroll-ok" style={{ padding:"0 16px" }}>
          {TRACKS.slice(0,8).map(t=><TCard key={t.id} track={t} current={cur} play={play} playing={playing} isPreview={isPreview} C={C} liked={liked} toggleLike={toggleLike} openPlayer={openPlayer}/>)}
        </div>
      </Sec>

      {/* NEW THIS WEEK */}
      <Sec title="New this week " C={C}>
        <div className="shg-nw" style={{ padding:"0 16px" }}><style>{`body .shg-nw.shg-nw{display:grid!important;flex-direction:initial!important;grid-template-columns:repeat(4,1fr)!important;gap:10px;max-width:560px;padding-top:3px!important}body .shg-nw.shg-nw>div{width:auto!important}body .shg-nw.shg-nw>div>div:nth-child(2){font-size:12px!important}body .shg-nw.shg-nw>div>div:nth-child(3){display:none!important}body .shg-nw.shg-nw.shg-nw-scroll{display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;overflow-x:auto!important;overflow-y:hidden;-webkit-overflow-scrolling:touch;scrollbar-width:none;max-width:none;padding:3px 16px 6px!important;touch-action:pan-x pan-y}body .shg-nw.shg-nw.shg-nw-scroll>div{flex:0 0 calc((100vw - 62px) / 4.4)!important;max-width:130px}body .shg-nw-scroll::-webkit-scrollbar{display:none}`}</style>
          {TRACKS.filter(t=>t.isNew).slice(0,4).map(t=><TCard key={t.id} track={t} current={cur} play={play} playing={playing} isPreview={isPreview} C={C} liked={liked} toggleLike={toggleLike} openPlayer={openPlayer}/>)}
        </div>
      </Sec>

      {/* RECOMMENDED FOR YOU: tracks in the categories of her open intentions */}
      {(()=>{ const cats = new Set(threads.filter(t=>!t.done).flatMap(t=>t.categories||[t.category])); const recs = TRACKS.filter(t=>cats.has(t.cat)).slice(0,10); return recs.length ? (
        <Sec title="Made for you" C={C}>
          <HRow>{recs.map(t=><TCard key={t.id} track={t} current={cur} play={play} playing={playing} isPreview={isPreview} C={C} liked={liked} toggleLike={toggleLike} openPlayer={openPlayer}/>)}</HRow>
        </Sec>) : null; })()}
      {/* SAVED FOR LATER */}
      {(()=>{ let ids=[]; try{ ids=JSON.parse(localStorage.getItem("shg_saved")||"[]"); }catch{} const saved = ids.map(id=>TRACKS.find(t=>t.id===id)).filter(Boolean); return saved.length ? (
        <Sec title="Saved for later" C={C}><HRow>{saved.map(t=><TCard key={t.id} track={t} current={cur} play={play} playing={playing} isPreview={isPreview} C={C} liked={liked} toggleLike={toggleLike} openPlayer={openPlayer}/>)}</HRow></Sec>) : null; })()}
      {/* YOUR FAVOURITES */}
      <Sec title="Your favourites ♡" C={C}>
        {TRACKS.filter(t=>liked.has(t.id)).length===0
          ?<div style={{ padding:"14px 16px",background:C.bg3,borderRadius:12,fontSize:14,color:C.mu,fontWeight:400 }}>Tap the ♡ on any track, it lives here.</div>
          :<HRow>{TRACKS.filter(t=>liked.has(t.id)).map(t=><TCard key={t.id} track={t} current={cur} play={play} playing={playing} isPreview={isPreview} C={C} liked={liked} toggleLike={toggleLike} openPlayer={openPlayer}/>)}</HRow>}
      </Sec>
      <div style={{ padding:"4px 16px 10px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <span id="shg-browse" style={{ fontSize:20,fontWeight:400,color:C.cr,scrollMarginTop:90 }}>Browse by desire</span>
        {cat!=="All" && <button onClick={()=>setCat("All")} style={{ fontSize:14,color:C.mu,background:"none",border:"none",cursor:"pointer",fontFamily:"'Jost',sans-serif",fontWeight:400 }}>Clear ✕</button>}
      </div>
      <div style={{ padding:"0 16px 14px" }}>
        <select id="shg-lib-cat" aria-label="Browse by desire" value={cat} onChange={e=>{setCat(e.target.value);setLibFormat("All");}}
          style={{ width:"100%",padding:"14px 16px",borderRadius:12,border:"1.5px solid #000",background:"#F2ECE4",color:"#000",fontSize:17,fontFamily:"'Jost',sans-serif" }}>
          {catOptions.map(c=><option key={c} value={c}>{c==="All"?"All categories":c==="Liked"?"Liked ♡":c}</option>)}
        </select>
      </div>
      {catOpen && createPortal(
        <div onClick={()=>setCatOpen(false)} style={{ position:"fixed", inset:0, zIndex:999998, background:"transparent" }}/>,
        document.body
      )}
      {/* FORMAT FILTER, Subliminal / Hypnosis / Melodic / Reiki / 528hz */}
      <div style={{ display:"flex",gap:6,padding:"0 16px 14px",overflowX:"auto",WebkitOverflowScrolling:"touch" }}>
        {FORMATS.map(fm=>(
          <button key={fm} onClick={()=>setLibFormat(fm)} style={{ flexShrink:0,padding:"4px 12px",borderRadius:20,background:libFormat===fm?"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)":"none",border:`1px solid ${libFormat===fm?"transparent":C.border}`,color:libFormat===fm?"#000":C.mu,fontSize:13,fontWeight:400,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>{fm==="All"?"All":fm}</button>
        ))}
      </div>
      {shown.length===0 && cat!=="Liked" && (
        <div style={{ margin:"0 16px 16px",padding:"18px",borderRadius:16,background:"#F2ECE4",color:"#000",fontSize:15,lineHeight:1.5 }}>{cat.replace("maxxing","maxxing ")}tracks are being recorded now. They'll appear here as soon as they're live.</div>
      )}
      {shown.length===0 && cat==="Liked" && (
        <div style={{ padding:"40px 20px",textAlign:"center",color:C.mu }}>
          <div style={{ fontSize:32,marginBottom:12 }}>♡</div>
          <div style={{ fontSize:16 }}>Tap the heart on any track to save it here.</div>
        </div>
      )}
      <div style={{ padding:"0 16px" }}>
        {shown.map(t=>(
          <div key={t.id} onClick={()=>{play(t); openPlayer?.();}} style={{ display:"flex",alignItems:"center",gap:12,padding:10,borderRadius:16,marginBottom:10,backgroundColor:"#F2ECE4",backgroundImage:"linear-gradient(rgba(191,165,216,.35) 1px,transparent 1px),linear-gradient(90deg,rgba(191,165,216,.35) 1px,transparent 1px)",backgroundSize:"22px 22px",color:"#000",border:"1px solid #BFA5D8",cursor:AUDIO_URLS[t.title]?"pointer":"not-allowed" }}>
            <div style={{ position:"relative",flexShrink:0 }}>
              <Thumb title={t.title} cat={t.cat} size={50} radius={6}/>
              
              {!isPreview&&cur?.id===t.id&&playing&&(
                <div style={{ position:"absolute",inset:0,background:"#000000",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <div style={{ display:"flex",alignItems:"flex-end",gap:2 }}>{[8,14,10,14,8].map((h,i)=><div key={i} style={{ width:2,height:h,background:["#F5E0A0","#E8B870","#BFA5D8","#2CB7A7","#167A6B"][i],borderRadius:1 }}/>)}</div>
                </div>
              )}
            </div>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ fontSize:16,fontWeight:500,color:"#000",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2 }}>
                {displayTitle(t.title)}{t.isNew&&<span style={{ marginLeft:6,fontSize:11,background:OMBRE,color:"#000",padding:"1px 5px",borderRadius:8,fontWeight:400,verticalAlign:"middle" }}>NEW</span>}
              </div>
              <div style={{ fontSize:13,color:"#000" }}>{t.cat}</div>
            </div>
            <div className="shg-gfill" aria-hidden="true" style={{ width:30,height:30,borderRadius:"50%",flexShrink:0,display:"grid",placeItems:"center",fontSize:11 }}>▶</div>
            {!isPreview&&(
              <>
                <button onClick={e=>{e.stopPropagation();toggleLike(t.id,e);}} style={{ background:"none",border:"none",padding:8,lineHeight:0 }}>
                  <Ico.Heart on={liked.has(t.id)}/>
                </button>
                <button onClick={e=>{e.stopPropagation();play(t);}} style={{ width:30,height:30,borderRadius:"50%",background:cur?.id===t.id?"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)":"rgba(232,184,112,0.15)",border:cur?.id===t.id?"none":"1px solid rgba(232,184,112,0.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer",padding:0 }}>
                  {cur?.id===t.id&&playing?<Ico.Pause dark={cur?.id===t.id}/>:<Ico.Play dark={cur?.id===t.id}/>}
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PROOFOS TAB ────────────────────────────────────────────────────────────────
function ProofLockedScreen({ C, onUpgrade, feature="proofOS" }) {
  return (
    <div style={{ padding:"48px 24px", textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", gap:14, minHeight:400, justifyContent:"center" }}>
      <div style={{ width:72, height:72, borderRadius:22, background:"rgba(44,183,167,0.08)", border:"1px solid rgba(44,183,167,0.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:30 }}>🔒</div>
      <div style={{ fontSize:18, color:C.cr }}>{feature} is a Goddess Tier feature</div>
      <div style={{ fontSize:15, color:C.mu, maxWidth:300, lineHeight:1.7 }}>
        {feature === "proofOS"
          ? "Log your desires, capture signs and synchronicities and mark each manifestation as it arrives. Everything, documented forever."
          : "Track your dominant emotional state, listening streaks and the evidence building over time. Plus direct Q&A with Reshma — ask anything about the tracks, hypnosis, or your journey."}
      </div>
      <div style={{ background:"rgba(44,183,167,0.08)", border:"1px solid rgba(44,183,167,0.2)", borderRadius:14, padding:"14px 20px", maxWidth:280 }}>
        <div style={{ fontSize:13, color:C.mu, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8 }}>Upgrade to Goddess Tier</div>
        <div style={{ fontSize:22, color:"#E8B870", marginBottom:4 }}>$49<span style={{ fontSize:15, color:C.mu }}>/month</span></div>
        <div style={{ fontSize:13, color:C.mu }}>You pay the difference from your current plan, no re-entering card details</div>
      </div>
      <button onClick={onUpgrade} style={{ padding:"14px 36px", background:"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)", border:"none", borderRadius:14, color:"#000", fontSize:16, cursor:"pointer", fontFamily:"'Jost',sans-serif" }}>
        Unlock {feature}, upgrade now 
      </button>
      <div style={{ fontSize:13, color:C.dim }}>Managed by Stripe · your card is already saved · instant access</div>
    </div>
  );
}

function ProofTab({ threads, setThreads, isPreview, C, currentTrack, userTier="goddess", onUpgrade, proofFilter="all", setProofFilter, userId, token, onManifested }) {
  const [newD, setD]       = useState("");
  const [newBelief, setNewBelief] = useState("");
  const [newDetails, setNewDetails] = useState("");
  const [newCat, setNewCat]   = useState("Richgirlmaxxing");
  const [newCats, setNewCats] = useState([]);
  const [linkedTrack, setLinked] = useState(currentTrack?.title || "");
  const [newFeel, setFeel] = useState("");
  const [newFeelText, setFeelText] = useState("");
  const [adding, setAdding] = useState(false);
  const [listening, setListening] = useState(false);
  const [view, setView] = useState("threads"); // threads | wall | bucket
  useEffect(() => { const f = () => setView("wall"); window.addEventListener("shg-view-wall", f); return () => window.removeEventListener("shg-view-wall", f); }, []);
  useEffect(() => { const f = () => setView("bucket"); window.addEventListener("shg-view-bucket", f); return () => window.removeEventListener("shg-view-bucket", f); }, []);
  const [hiddenGuides, setHiddenGuides] = useState(() => { try { return JSON.parse(localStorage.getItem("shg_hidden_guides") || "{}"); } catch { return {}; } });
  const toggleGuide = v => setHiddenGuides(h => { const n = { ...h, [v]: !h[v] }; try { localStorage.setItem("shg_hidden_guides", JSON.stringify(n)); } catch {} return n; });
  const [signInput, setSignInput] = useState({}); // {threadId: text}
  const [finishing, setFinishing] = useState(null); // threadId being marked done
  const [feelAfterInput, setFeelAfterInput] = useState("");
  const [feelAfterLevel, setFeelAfterLevel] = useState("");

  // ProofOS, always LG gradient background, white cards, black text
  // Follow the portal theme: black cards and cream text in dark, like the deck.
  const isDark = C?.cr !== "#000000";
  const PC = isDark
    ? { card:"#0d0d0d", cardSolid:"#0d0d0d", text:"#F2ECE4", mu:"#F2ECE4", dim:"#F2ECE4", border:"rgba(242,236,228,0.22)", inputBg:"#0d0d0d" }
    : { card:"#ffffff", cardSolid:"#ffffff", text:"#000000", mu:"#000000", dim:"#111", border:"#000000", inputBg:"rgba(255,255,255,0.9)" };
  const PAGE_BG = isDark ? "#000000" : "linear-gradient(135deg,#EEE8F8 0%,#BFA5D8 28%,#2CB7A7 62%,#167A6B 100%)";

  const manifested = threads.filter(t=>t.done);
  const inProgress = threads.filter(t=>!t.done);
  const bucketItems = threads.filter(t=>t.isBucket && !t.done);
  const activeThreads = threads.filter(t=>!t.isBucket);
  const displayedThreads = proofFilter==="manifested" ? manifested.filter(t=>!t.isBucket) : proofFilter==="inProgress" ? inProgress.filter(t=>!t.isBucket) : activeThreads;
  const totalSigns = threads.reduce((a,t)=>a+(t.signs?.length||0),0);
  const [bucketText, setBucketText] = useState("");
  const [promotingId, setPromotingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [trackPickerOpen, setTrackPickerOpen] = useState(false);
  const [catPickerOpen, setCatPickerOpen] = useState(false);
  const [feelPickerOpen, setFeelPickerOpen] = useState(false);
  const [promoCatOpen, setPromoCatOpen] = useState(null);

  const startFinish = (id) => { setFinishing(id); setFeelAfterInput(""); };
  const confirmFinish = async (id) => {
    const after = [feelAfterLevel, feelAfterInput].filter(Boolean).join(", ");
    const thread = threads.find(t=>t.id===id);
    setThreads(threads.map(t=>t.id===id?{...t,done:true,days:t.createdTs?Math.max(1,Math.round((Date.now()-t.createdTs)/86400000)):(t.days||1),feelAfter:after||t.feelAfter,createdAt:t.createdAt||new Date(Date.now()-t.days*86400000).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}),manifestedAt:new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}:t));
    if (thread && onManifested) onManifested(thread);
    setFinishing(null); setFeelAfterInput(""); setFeelAfterLevel("");
    if (!isPreview && userId) {
      try {
        await quizApi(`/threads/${id}`, token, {
          method: "PATCH",
          body: JSON.stringify({ done: true, manifested_at: new Date().toISOString(), feel_after: after || undefined }),
        });
      } catch (err) { console.error("Failed to mark manifested:", err); }
    }
  };
  const undoMarkDone = async (id) => {
    setThreads(threads.map(t=>t.id===id?{...t,done:false,manifestedAt:null}:t));
    if (!isPreview && userId) {
      try {
        await quizApi(`/threads/${id}`, token, {
          method: "PATCH",
          body: JSON.stringify({ done: false, manifested_at: null }),
        });
      } catch (err) { console.error("Failed to undo manifested:", err); }
    }
  };
  const deleteThread = (id) => { setConfirmDeleteId(id); };
  const confirmDeleteNow = async (id) => {
    setThreads(threads.filter(t=>t.id!==id));
    setConfirmDeleteId(null);
    if (!isPreview && userId) {
      try {
        await quizApi(`/threads/${id}`, token, { method: "DELETE" });
      } catch (err) { console.error("Failed to delete desire:", err); }
    }
  };
  const addSign = async (id) => {
    const text = (signInput[id]||"").trim();
    if(!text) return;
    const date = new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short"});
    const tempSid = Date.now()+Math.random();
    setThreads(threads.map(t=>t.id===id?{...t,signs:[...(t.signs||[]),{text,date,_sid:tempSid}]}:t));
    setSignInput({...signInput,[id]:""});
    if (!isPreview && userId) {
      try {
        const res = await quizApi(`/threads/${id}/signs`, token, {
          method: "POST",
          body: JSON.stringify({ text, date }),
        });
        // Replace temp _sid with real DB id
        if (res.id) setThreads(ts=>ts.map(t=>t.id===id?{...t,signs:(t.signs||[]).map(s=>s._sid===tempSid?{...s,_sid:res.id}:s)}:t));
      } catch (err) { console.error("Failed to save sign:", err); }
    }
  };
  const addMediaSign = (id, media) => {
    const date = new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short"});
    setThreads(ts=>ts.map(t=>t.id===id?{...t,signs:[...(t.signs||[]),{...media,date,_sid:Date.now()+Math.random()}]}:t));
    if (!isPreview && userId) {
      quizApi(`/threads/${id}/signs`, token, {
        method: "POST",
        body: JSON.stringify({ text: media.text || null, date, img: media.img || null, audio: media.audio || null }),
      }).catch(err => console.error("Failed to save media sign:", err));
    }
  };
  const deleteSign = (threadId, signKey) => {
    setThreads(ts=>ts.map(t=>t.id===threadId?{...t,signs:(t.signs||[]).filter(s=>(s._sid??s) !== signKey)}:t));
    if (!isPreview && userId && typeof signKey === "number") {
      quizApi(`/threads/${threadId}/signs/${signKey}`, token, { method: "DELETE" })
        .catch(err => console.error("Failed to delete sign:", err));
    }
  };
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const saveEdit = (id) => { if(editText.trim()) setThreads(ts=>ts.map(t=>t.id===id?{...t,desire:editText.trim()}:t)); setEditId(null); };
  const [recId, setRecId] = useState(null);
  const [recSecs, setRecSecs] = useState(0);
  const recRef = useRef(null);
  const recTimerRef = useRef(null);
  useEffect(()=>()=>clearInterval(recTimerRef.current), []);
  const toggleRec = async (id) => {
    if (recId === id) { recRef.current?.stop(); clearInterval(recTimerRef.current); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio:true });
      const mr = new MediaRecorder(stream);
      const chunks = [];
      mr.ondataavailable = e => chunks.push(e.data);
      mr.onstop = () => {
        const url = URL.createObjectURL(new Blob(chunks,{type:mr.mimeType||"audio/mp4"}));
        addMediaSign(id,{audio:url,text:"Voice note"});
        stream.getTracks().forEach(t=>t.stop());
        setRecId(null);
        setRecSecs(0);
        clearInterval(recTimerRef.current);
      };
      mr.start(); recRef.current = mr; setRecId(id); setRecSecs(0);
      recTimerRef.current = setInterval(()=>setRecSecs(s=>s+1), 1000);
    } catch { alert("Microphone access needed for voice notes."); }
  };

  return (
    <div style={{ padding:"16px 16px 120px", background:PAGE_BG, minHeight:"100%", overflowY:"auto" }}>
      <style>{`@keyframes shgRecPulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.4;transform:scale(0.8);}}@keyframes shgRecButtonPulse{0%,100%{box-shadow:0 0 0 0 rgba(192,57,43,0.5);}50%{box-shadow:0 0 0 6px rgba(192,57,43,0);}}`}</style>
      {confirmDeleteId!==null && (
        <div onClick={()=>setConfirmDeleteId(null)} style={{ position:"fixed",inset:0,zIndex:1100,background:"#000000",display:"flex",alignItems:"center",justifyContent:"center",padding:24 }}>
          <div onClick={e=>e.stopPropagation()} style={{ maxWidth:340,width:"100%",borderRadius:16,padding:"24px 22px",background:"#fdf0e8",border:`1px solid ${PC.border}` }}>
            <div style={{ fontSize:18,fontWeight:400,color:"#000",marginBottom:8,fontFamily:"'Jost',sans-serif" }}>Delete this thread?</div>
            <div style={{ fontSize:14,color:"#000",marginBottom:20,lineHeight:1.5,fontFamily:"'Jost',sans-serif" }}>This removes the desire and every sign you logged for it. This can't be undone.</div>
            <div style={{ display:"flex",gap:10 }}>
              <button onClick={()=>setConfirmDeleteId(null)} style={{ flex:1,padding:"12px",background:"none",border:`1px solid ${PC.border}`,borderRadius:10,color:"#000",fontSize:15,fontWeight:400,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>Cancel</button>
              <button onClick={()=>confirmDeleteNow(confirmDeleteId)} style={{ flex:1,padding:"12px",background:"#8a2030",border:"none",borderRadius:10,color:"#fff",fontSize:15,fontWeight:400,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>Delete</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ fontSize:22,fontWeight:400,marginBottom:14,color:PC.text }}><span style={{ fontSize:"0.85em" }}>proof</span>OS · <span style={{ fontWeight:300 }}>the evidence tracker</span></div>

      {/* Filter banner, shown when drilled in from Analytics */}
      {proofFilter!=="all" && (
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",background:"#000",borderRadius:12,padding:"10px 14px",marginBottom:14 }}>
          <span style={{ fontSize:14,color:"#fdf0e8",fontFamily:"'Jost',sans-serif" }}>
            {proofFilter==="manifested" ? `Showing ${manifested.length} manifested ✓` : `Showing ${inProgress.length} in progress`}
          </span>
          <button onClick={()=>setProofFilter?.("all")} style={{ background:"none",border:"1px solid rgba(255,255,255,0.2)",borderRadius:8,color:"#fdf0e8",fontSize:13,padding:"4px 10px",cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>Show all</button>
        </div>
      )}

      {/* FOUR BLOCKS: Intentions | Signs | Proof Wall | Bucket List */}
      <style>{`body .shg-p4.shg-p4{display:grid!important;flex-direction:initial!important;grid-template-columns:1fr 1fr!important;gap:12px;margin-bottom:14px}`}</style>
      <div className="shg-p4">
        {[["threads","Intentions",inProgress.length,"lucky"],["signs","Signs",totalSigns,"track"],["wall","Proof Wall",manifested.length,"session"],["bucket","Bucket List",bucketItems.length,"money"]].map(([k,l,n,ic])=>{
          const on = view===k;
          return (
            <button key={k} onClick={()=>{ setView(k); setAdding(false); }} aria-pressed={on} className="shg-no-paper"
              style={{ position:"relative",aspectRatio:"1",borderRadius:20,cursor:"pointer",padding:0,overflow:"hidden",fontFamily:"'Jost',sans-serif",border:on?"2px solid transparent":"1px solid transparent",background:"linear-gradient(#000,#000) padding-box, linear-gradient(110deg,#F5E0A0,#E8B870,#BFA5D8,#2CB7A7,#167A6B) border-box",boxShadow:on?"0 0 22px rgba(191,165,216,.55)":"none" }}>
              <img src={`/icons/${ic}.webp`} alt="" style={{ position:"absolute",left:"24%",top:"10%",width:"52%",height:"52%",objectFit:"cover",borderRadius:"50%" }}/>
              <span style={{ position:"absolute",top:10,right:14,fontSize:18,fontWeight:300,color:"#F2ECE4" }}>{n}</span>
              <span style={{ position:"absolute",left:0,right:0,bottom:14,textAlign:"center",fontSize:16,fontWeight:300,color:"#F2ECE4" }}>{l}</span>
            </button>
          );
        })}
      </div>

      {(()=>{
        const G = {
          threads:{ t:"How to set an intention", steps:["Write it in the present tense, never the future: \"I live in my home by the sea\", not \"I will\". Past tense can work too, but for most people faking that it already happened creates conflict.","Pick the category and how you honestly feel right now. Your emotions are what make the tracking meaningful.","Play the suggested track daily, then log every sign under that intention."], key:"how-to-write-intention", img:"intention-list" },
          signs:{ t:"How to spot a sign", steps:["A sign is a coincidence that answers your desire: a word, a song, a stranger, an exact amount.","Ask for something rare and personal, not 111. Then watch for it.","Log it the moment it happens, with a photo, a voice note or a line of text, and link it to its intention."], key:"spotting-signs", img:"ask-for-sign" },
          wall:{ t:"Your Proof Wall is your evidence log", steps:["When the real outcome arrives, open the intention and mark it manifested.","Add a screenshot or photo as proof.","It stays here forever, dated, with how many days it took.","Tap Share with my name or Share anonymously to post it to Community wins."], key:"proof-wall-forever", img:"hope-or-evidence" },
          bucket:{ t:"How the Bucket List works", steps:["Write down anything you want, as much as you want, as many times a day as you like.","Make it a daily habit. The more you release random desires, the more some of them arrive so fast it will shock you.","Some things manifest by themselves, no hypnosis needed. When one arrives, mark it manifested straight from here.","When you're ready to focus on one, move it into Intentions."], key:"bucket-vs-active", img:"bucket-list" },
        }[view];
        if (!G || view === "bucket") return null;
        if (hiddenGuides[view]) return <button onClick={()=>toggleGuide(view)} style={{ background:"none",border:"1px solid #F2ECE4",color:"#F2ECE4",borderRadius:999,padding:"8px 16px",fontSize:14,marginBottom:14,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>Show: {G.t}</button>;
        return (
          <div style={{ background:"#F2ECE4",color:"#000",borderRadius:18,padding:"16px 18px",marginBottom:14 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,marginBottom:10 }}>
              <div style={{ fontSize:17,fontWeight:500 }}>{G.t}</div>
              <button onClick={()=>toggleGuide(view)} aria-label="Hide this guide" style={{ background:"none",border:"1px solid #000",borderRadius:999,padding:"4px 12px",fontSize:13,cursor:"pointer",color:"#000",flexShrink:0,fontFamily:"'Jost',sans-serif" }}>Hide ✕</button>
            </div>
            {G.img && <img src={`/deck/${G.img}.webp`} alt="" loading="lazy" style={{ width:"100%",aspectRatio:"16/9",borderRadius:12,display:"block",marginBottom:12 }}/>}
            <ol style={{ margin:0,paddingLeft:20,display:"grid",gap:6,fontSize:15,lineHeight:1.5 }}>{G.steps.map(x=><li key={x}>{x}</li>)}</ol>
            <button onClick={()=>window.dispatchEvent(new CustomEvent("shg-open-guide",{ detail:{ cat:"ProofOS", key:G.key } }))} style={{ marginTop:12,background:"#000",color:"#F2ECE4",border:"none",borderRadius:999,padding:"9px 16px",fontSize:14,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>Read more in the Guidebook ›</button>
          </div>
        );
      })()}
      {view!=="bucket" && <button className="shg-cta" onClick={()=>{ setView("threads"); setAdding(a=>!a); }} style={{ marginBottom:18 }}>
        {adding?"✕ Cancel":"+ Add a new intention"}
      </button>}

      {view==="signs" ? (
        <div>
          {(()=>{ try { return localStorage.getItem("shg_hide_fab")==="1"; } catch { return false; } })() && <button onClick={e=>{ window.dispatchEvent(new Event("shg-show-fab")); e.currentTarget.remove(); }} style={{ background:"#000",color:"#F2ECE4",border:"none",borderRadius:999,padding:"10px 18px",fontSize:14,marginBottom:12,cursor:"pointer",fontFamily:"inherit" }}>✦ Show the sign button again</button>}
          {threads.every(t=>!(t.signs||[]).length) && !(()=>{ try { return JSON.parse(localStorage.getItem("shg_loose_signs")||"[]").length; } catch { return 0; } })() && <div style={{ fontSize:15,color:PC.text,padding:"8px 2px" }}>No signs yet. Open an intention and tap "Log a sign".</div>}
          {(()=>{ let loose=[]; try { loose = JSON.parse(localStorage.getItem("shg_loose_signs")||"[]"); } catch {} return [...threads.flatMap(t => (t.signs||[]).map(sg => ({ sg, t }))), ...loose.map(sg=>({ sg, t:{ desire:"No specific intention" } }))]; })().reverse().map(({sg,t},i)=>(
            <div key={i} className="shg-gb" style={{ borderRadius:18,padding:"14px 16px",marginBottom:10 }}>
              <div style={{ fontSize:16,color:PC.text }}>{sg.text}</div>
              {sg.img && <img src={sg.img} alt="" style={{ marginTop:8,maxWidth:160,borderRadius:10,display:"block" }}/>}
              {sg.audio && <audio src={sg.audio} controls style={{ marginTop:8,height:32 }}/>}
              <div style={{ fontSize:13,color:PC.text,marginTop:4 }}>For: {t.desire}{sg.date?` · ${sg.date}`:""}</div>
            </div>
          ))}
          <button className="shg-cta2" onClick={()=>setView("threads")} style={{ marginTop:8 }}>+ Log a sign on an intention</button>
        </div>
      ) : view==="bucket" ? (
        /* ═══ BUCKET LIST, capture everything, no commitment required ═══ */
        <div>
          <div style={{ background:PC.card,borderRadius:14,padding:14,marginBottom:14 }}>
            <div style={{ fontSize:20,fontWeight:400,color:PC.text,marginBottom:10 }}>Bucket List</div>
            <div style={{ display:"flex", gap:8 }}>
              <input value={bucketText} onChange={e=>setBucketText(e.target.value)} id="shg-bucket-add" placeholder="Add to your bucket list" onKeyDown={e=>{ if(e.key==="Enter"){ e.preventDefault(); e.currentTarget.nextSibling?.click(); } }}
                style={{ flex:1, padding:"11px 13px", borderRadius:8, border:`1px solid ${PC.border}`, background:PC.inputBg, color:PC.text, fontSize:16, fontFamily:"'Jost',sans-serif", outline:"none" }}/>
              <button onClick={async ()=>{
                if(!bucketText.trim()) return;
                const localId = Date.now()+Math.random().toString(36).slice(2,8);
                setThreads([{id:localId,desire:bucketText,days:0,done:false,signs:[],track:"",category:"",feelBefore:"",feelAfter:"",oldBelief:"",isBucket:true},...threads]);
                setBucketText("");
                if (!isPreview && userId) {
                  try {
                    await quizApi("/threads", token, {
                      method: "POST",
                      body: JSON.stringify({ id: localId, desire: bucketText, is_bucket: true }),
                    });
                  } catch (err) {
                    console.error("Failed to save bucket item:", err);
                  }
                }
              }} style={{ padding:"11px 18px", background:"linear-gradient(90deg,#F5E0A0,#E8B870 22%,#BFA5D8 52%,#2CB7A7 80%,#167A6B)", border:"none", borderRadius:999, color:"#000", fontSize:15, fontWeight:400, cursor:"pointer", fontFamily:"'Jost',sans-serif" }}>+ Add</button>
            </div>
            <details style={{ marginTop:10,color:PC.text }}>
              <summary style={{ cursor:"pointer",fontSize:14,fontWeight:300,textDecoration:"underline",textUnderlineOffset:3,listStyle:"none" }}>How the bucket list works ›</summary>
              <ol style={{ margin:"12px 0",paddingLeft:20,display:"grid",gap:6,fontSize:15,fontWeight:300,lineHeight:1.5 }}>
                <li>Write down anything you want, as much as you want, as many times a day as you like.</li>
                <li>Make it a daily habit. The more you release, the more some of them arrive on their own.</li>
                <li>When one arrives, mark it manifested. When you want to focus on one, promote it to an intention.</li>
              </ol>
              <div style={{ borderRadius:14,paddingTop:4 }}>
            <div style={{ fontSize:14,color:"#E8B870",fontWeight:400,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:10 }}> What's the difference?</div>
            <div style={{ fontSize:15,color:PC.text,lineHeight:1.75,marginBottom:12 }}>
              <span>Bucket List</span> is everything you want to manifest, ever, no limit, no category, no audio required. Write something down the moment it occurs to you, the way you'd jot a note. Nothing here is a commitment.
            </div>
            <div style={{ fontSize:15,color:PC.text,lineHeight:1.75,marginBottom:12 }}>
              <span>Active</span> is different, it's what you're actually focusing on right now, with audio, with your emotional state tracked before and after. We recommend keeping this to around 5-10 at a time, so your energy stays focused instead of spread thin.
            </div>
            <div style={{ fontSize:15,color:PC.text,lineHeight:1.75 }}>
              Add to your Bucket List constantly. When you're ready to actually focus on something, promote it into Active, pick a category, get a track suggested. Everything else just waits, still valid. And sometimes writing something down clearly is enough on its own, <span>you can mark a Bucket List item manifested without ever linking it to an audio.</span> Your Proof Wall doesn't care which list it came from.
            </div>
          </div>

            </details>
          </div>

          {activeThreads.filter(t=>!t.done).length >= 5 && (
            <div style={{ fontSize:13, color:"#E8B870", background:"rgba(232,184,112,0.08)", border:"1px solid rgba(232,184,112,0.2)", borderRadius:10, padding:"10px 14px", marginBottom:14, lineHeight:1.5 }}>
               You've got {activeThreads.filter(t=>!t.done).length} active desires. We recommend focusing on 5-10 at once, more than that and it's easy to spread your energy too thin. Not a hard rule, just a nudge.
            </div>
          )}

          {bucketItems.length===0 ? (
            <div style={{ background:PC.card,borderRadius:14,padding:"28px 18px",textAlign:"center" }}>
              <div style={{ fontSize:26,marginBottom:8 }}></div>
              <div style={{ fontSize:15,color:PC.mu,lineHeight:1.7,fontWeight:400 }}>Your bucket list is empty.<br/>Add anything you want to manifest, big or small.</div>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {bucketItems.map(item=>(
                <div key={item.id} style={{ background:PC.card, borderRadius:12, padding:"15px 16px" }}>
                  <div style={{ fontSize:17, color:PC.text, marginBottom:11, lineHeight:1.5 }}>{item.desire}</div>
                  {promotingId===item.id ? (
                    <div style={{ marginBottom:11, position:"relative" }}>
                      <div style={{ fontSize:13, color:PC.mu, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:7 }}>Choose a category to promote this</div>
                      <div onClick={()=>setPromoCatOpen(o=>o===item.id?null:item.id)} style={{ width:"100%",background:PC.inputBg,border:`1px solid ${PC.border}`,color:PC.mu,borderRadius:8,padding:"11px 13px",fontSize:16,fontFamily:"'Jost',sans-serif",boxSizing:"border-box",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                        <span>, Select a category,</span>
                        <span style={{ fontSize:13, color:PC.mu, transform:promoCatOpen===item.id?"rotate(180deg)":"none", transition:"transform 0.15s" }}>▾</span>
                      </div>
                      {promoCatOpen===item.id && (
                        <>
                        <div onClick={()=>setPromoCatOpen(null)} style={{ position:"fixed", inset:0, zIndex:9998 }}/>
                        <div style={{ position:"fixed", top:"auto", left:"5%", right:"5%", zIndex:9999, background:isDark?"#141414":"#F2ECE4", border:`1px solid ${PC.border}`, borderRadius:10, maxHeight:260, overflowY:"auto", WebkitOverflowScrolling:"touch", overscrollBehavior:"contain", touchAction:"pan-y", boxShadow:"0 12px 40px rgba(0,0,0,0.5)" }}>
                          {Object.keys(CAT_ICONS).filter(c=>LIVE_CATS.has(c)).map(c=>{
                            const catColor = CAT_ICONS[c].accent;
                            return (
                              <div key={c} onClick={()=>{
                                const suggested = suggestTrack(item.desire, c);
                                setThreads(ts => ts.map(t => t.id===item.id ? {...t, isBucket:false, category:c, track:suggested?.title||""} : t));
                                setPromotingId(null);
                                setPromoCatOpen(null);
                              }} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 13px", cursor:"pointer", borderBottom:`1px solid ${PC.border}` }}
                                onMouseEnter={e=>e.currentTarget.style.background=`${catColor}14`}
                                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                                <div style={{ width:9, height:9, borderRadius:"50%", background:catColor, flexShrink:0 }}/>
                                <span style={{ fontSize:15, color:PC.text }}>{c}</span>
                              </div>
                            );
                          })}
                        </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={()=>setPromotingId(item.id)} style={{ flex:1, padding:"10px 12px", background:"#000", border:"none", borderRadius:999, color:"#F2ECE4", fontSize:14, cursor:"pointer", fontFamily:"'Jost',sans-serif" }}>
                        Focus on this now
                      </button>
                      <button onClick={async ()=>{
                        setThreads(ts => ts.map(t => t.id===item.id ? {...t, done:true, days:t.createdTs?Math.max(1,Math.round((Date.now()-t.createdTs)/86400000)):(t.days||1), manifestedAt:new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})} : t));
                        if (!isPreview && userId) {
                          try {
                            await quizApi(`/threads/${item.id}`, token, {
                              method: "PATCH",
                              body: JSON.stringify({ done: true, manifested_at: new Date().toISOString() }),
                            });
                          } catch (err) { console.error("Failed to mark manifested:", err); }
                        }
                      }} style={{ flex:1, padding:"10px 12px", background:OMBRE, border:"none", borderRadius:999, color:"#000", fontSize:14, fontWeight:500, cursor:"pointer", fontFamily:"'Jost',sans-serif" }}>
                        ✓ Already manifested
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : view==="wall" ? (
        /* ═══ PROOF WALL, your wins, forever ═══ */
        <div>
          <div style={{ fontSize:13,color:PC.mu,fontWeight:400,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:6 }}>✓ Your proof wall</div>
          <div style={{ fontSize:14,color:PC.mu,lineHeight:1.6,marginBottom:14 }}>Your proof wall for life. Never lose a single manifestation again.</div>
          {manifested.length===0 ? (
            <div style={{ background:PC.card,borderRadius:14,padding:"28px 18px",textAlign:"center" }}>
              <div style={{ fontSize:26,marginBottom:8 }}></div>
              <div style={{ fontSize:15,color:PC.mu,lineHeight:1.7,fontWeight:400 }}>Nothing manifested yet.<br/>Your first win shows up here and stays here for life.</div>
            </div>
          ) : (
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
              {manifested.map(d=>(
                <div key={d.id} style={{ background:CAT_GRAD[d.category]||CAT_GRAD.Identity, borderRadius:12, padding:"12px 12px", position:"relative" }}>
                  <span style={{ display:"flex",flexWrap:"wrap",gap:4,paddingRight:44 }}>{(d.categories||[d.category]).filter(Boolean).map(c=><span key={c} style={{ fontSize:11,padding:"2px 8px",background:"#fdf0e8",color:"#000",borderRadius:20 }}>✓ {String(c).replace("maxxing","")}</span>)}</span>
                  <div style={{ fontSize:15,fontWeight:400,color:"#000",marginTop:6,lineHeight:1.3 }}>{d.desire}</div>
                  <div style={{ fontSize:12,color:"#000",fontWeight:400,marginTop:4 }}>{d.signs?.length||0} signs{(d.signs||[]).some(s=>s.img)?" · 📷":""}{(d.signs||[]).some(s=>s.audio)?" · 🎤":""}</div>
                  <div style={{ fontSize:12,color:"#000",fontWeight:600,marginTop:5, }}>{d.createdAt?`${d.createdAt} → `:""}{d.manifestedAt||""}{` · Took ${d.days||1} day${(d.days||1)===1?"":"s"}`}</div>
                  {d.feelAfter && <div style={{ fontSize:12,color:"#000",marginTop:5,lineHeight:1.45 }}>"{d.feelAfter}"</div>}
                  {d.shared ? <div style={{ marginTop:8,fontSize:12,fontWeight:600 }}>Shared with the community ✓</div> : (
                    <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginTop:8 }}>
                      <ShareWinOptions d={d} userId={userId} isPreview={isPreview} onShared={()=>setThreads(ts=>ts.map(t=>t.id===d.id?{...t,shared:true}:t))}/>
                    </div>
                  )}
                  <button onClick={()=>undoMarkDone(d.id)} style={{ position:"absolute",top:8,right:8,fontSize:11,background:"#fdf0e8",border:"none",borderRadius:10,padding:"2px 7px",color:"#000",cursor:"pointer",fontWeight:400,fontFamily:"'Jost',sans-serif" }}>undo</button>
                </div>
              ))}
              <div style={{ background:PC.card,border:`1px dashed ${PC.border}`,borderRadius:12,padding:12,display:"flex",alignItems:"center",justifyContent:"center",minHeight:80 }}>
                <span style={{ fontSize:13,color:PC.mu,textAlign:"center",fontWeight:400,lineHeight:1.4 }}>Your next<br/>manifestation</span>
              </div>
              <div style={{ gridColumn:"1/-1" }}>
              <div style={{ fontSize:13,fontWeight:400,color:PC.mu,letterSpacing:"0.15em",textTransform:"uppercase",margin:"18px 0 8px" }}>All captured proof · newest last</div>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12 }}>
                {threads.flatMap(t=>(t.signs||[]).filter(s=>s.img||s.audio).map((s,ix)=>({...s,desire:t.desire,key:t.id+"-"+ix}))).map(s=>(
                  <div key={s.key} style={{ background:"#F2ECE4",borderRadius:10,padding:6,border:"1px solid #000" }}>
                    {s.img && <img src={s.img} alt="proof" style={{ width:"100%",height:"auto",maxHeight:320,objectFit:"cover",borderRadius:7,display:"block" }}/>}
                    {s.audio && <div style={{ height:72,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4 }}><span style={{fontSize:22}}>🎤</span><audio src={s.audio} controls style={{ width:"100%",height:24 }}/></div>}
                    <div style={{ fontSize:13,fontWeight:400,color:"#000",marginTop:6,lineHeight:1.4 }}>{s.text ? <b style={{ fontWeight:500 }}>{s.text}</b> : null}{s.text?<br/>:null}{s.desire} · {s.date}</div>
                  </div>
                ))}
              </div>
              </div>
            </div>
          )}
        </div>
      ) : (
      <>
      {adding && (
        <div style={{ background:PC.cardSolid,borderRadius:14,padding:16,marginBottom:14 }}>
          <div style={{ fontSize:14,color:PC.mu,fontWeight:400,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:4 }}>Your intention, in 6 words or less</div>
          <div style={{ fontSize:13,color:PC.mu,marginBottom:8 }}>Short and present tense. {newD.trim() ? `${newD.trim().split(/\s+/).length} word${newD.trim().split(/\s+/).length===1?"":"s"}` : ""}</div>
          <div style={{ display:"flex",gap:8,marginBottom:11,alignItems:"center" }}>
            <input value={newD} onChange={e=>setD(e.target.value)} enterKeyHint="done" onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();document.getElementById("shg-save-intent")?.click();}}} placeholder="I live by the sea"
              maxLength={60}
              style={{ flex:1,background:PC.inputBg,border:`1px solid ${PC.border}`,color:PC.text,borderRadius:8,padding:"11px 13px",fontSize:16,outline:"none",fontFamily:"'Jost',sans-serif",boxSizing:"border-box" }}/>
            <button onClick={()=>document.getElementById("shg-save-intent")?.click()} aria-label="Save intention" style={{ width:44,height:44,flexShrink:0,borderRadius:"50%",border:"none",background:"#000",color:"#F2ECE4",fontSize:20,cursor:"pointer" }}>✓</button>
            <button onClick={()=>{
              const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
              if(!SR){ alert("Voice input isn't supported in this browser. Try Chrome or Safari."); return; }
              if(listening){ setListening(false); return; }
              const r = new SR(); r.lang="en-US"; r.interimResults=false; r.maxAlternatives=1;
              setListening(true);
              r.onresult = e => { setD(e.results[0][0].transcript); setListening(false); };
              r.onerror = () => setListening(false);
              r.onend = () => setListening(false);
              r.start();
            }} title="Speak your desire" style={{ flexShrink:0,width:44,height:44,borderRadius:"50%",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,background:listening?"#E8B870":"transparent",boxShadow:listening?"0 0 14px rgba(232,184,112,0.6)":"none",transition:"all 0.2s" }}>
              {listening ? "⏹" : "🎙"}
            </button>
          </div>
          <label htmlFor="shg-int-details" style={{ display:"block",fontSize:14,color:PC.mu,fontWeight:400,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6 }}>Add more about it</label>
          <textarea id="shg-int-details" rows={4} value={newDetails} onChange={e=>setNewDetails(e.target.value)} placeholder="Describe exactly what you want, like a journal entry: where, who, how it feels, the details. The more specific, the better."
            style={{ width:"100%",background:PC.inputBg,border:`1px solid ${PC.border}`,color:PC.text,borderRadius:8,padding:"11px 13px",fontSize:15,marginBottom:11,outline:"none",fontFamily:"'Jost',sans-serif",boxSizing:"border-box",resize:"vertical",lineHeight:1.5 }}/>
          <div style={{ fontSize:14,color:PC.mu,fontWeight:400,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6 }}>Current belief about this</div>
          <input value={newBelief} onChange={e=>setNewBelief(e.target.value)} placeholder="What do you actually believe about this right now? e.g. 'It's never worked out for me before'"
            style={{ width:"100%",background:PC.inputBg,border:`1px solid ${PC.border}`,color:PC.text,borderRadius:8,padding:"11px 13px",fontSize:16,marginBottom:11,outline:"none",fontFamily:"'Jost',sans-serif",boxSizing:"border-box" }}/>
          {/* Native pickers: they scroll properly on phones and never get cut off */}
          <label htmlFor="shg-int-track" style={{ display:"block",fontSize:14,color:"#000",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6 }}>Link to audio (optional)</label>
          <select id="shg-int-track" value={linkedTrack} onChange={e=>setLinked(e.target.value)} style={{ width:"100%",background:"#fff",border:"1.5px solid #000",color:"#000",borderRadius:10,padding:"12px",fontSize:16,marginBottom:14,fontFamily:"'Jost',sans-serif" }}>
            <option value="">No track yet</option>
            {TRACKS.map(t=><option key={t.id} value={t.title}>{displayTitle(t.title)} · {t.cat.replace("maxxing","")} · {t.format}</option>)}
          </select>
          <div style={{ fontSize:14,color:"#000",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8 }}>Categories (pick any)</div>
          <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginBottom:16 }}>
            {[["Lovemaxxing","Love"],["Richgirlmaxxing","Money"],["Luckygirlmaxxing","Lucky Girl"],["Selfmaxxing","Self"],["Homemaxxing","Home"],["Beautymaxxing","Beauty"],["Bodymaxxing","Body"],["Businessmaxxing","Business"],["Healthmaxxing","Health"],["Confidencemaxxing","Confidence"],["Peacemaxxing","Peace"],["Lifemaxxing","Life"]].map(([c,l])=>{
              const on = newCats.includes(c);
              return <button key={c} type="button" aria-pressed={on} onClick={()=>setNewCats(cs=>{ const n = on ? cs.filter(x=>x!==c) : [...cs,c]; if (n.length) setNewCat(n[0]); return n; })} style={{ padding:"9px 14px",borderRadius:999,border:"1px solid #000",background:on?"#000":"transparent",color:on?"#F2ECE4":"#000",fontSize:15,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>{l}</button>;
            })}
          </div>
          <label htmlFor="shg-int-feel" style={{ display:"block",fontSize:14,color:"#000",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6 }}>How am I feeling right now?</label>
          <select id="shg-int-feel" value={newFeel} onChange={e=>setFeel(e.target.value)} style={{ width:"100%",background:"#fff",border:"1.5px solid #000",color:"#000",borderRadius:10,padding:"12px",fontSize:16,marginBottom:12,fontFamily:"'Jost',sans-serif" }}>
            <option value="">Choose the closest feeling</option>
            {HAWKINS.slice().reverse().map(h=><option key={h.n} value={h.n}>{h.n} ({h.v})</option>)}
          </select>
          {newFeel && (() => { const h = HAWKINS.find(x=>x.n===newFeel); return h ? (
            <div style={{ display:"flex",alignItems:"center",gap:8,padding:"9px 13px",borderRadius:8,background:`${h.c}22`,border:`1px solid ${h.c}55`,marginBottom:11 }}>
              <div style={{ width:11,height:11,borderRadius:"50%",background:h.c,flexShrink:0 }}/>
              <span style={{ fontSize:14,color:PC.text,fontFamily:"'Jost',sans-serif" }}>{h.v >= 200 ? "Expansive, you're above the line " : "Contractive, the audio will lift you"}</span>
            </div>
          ) : null; })()}
          <input value={newFeelText} onChange={e=>setFeelText(e.target.value)} placeholder="In your own words, e.g. 'I'm feeling anxious about this'"
            style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:`1px solid ${PC.border}`, background:PC.inputBg, color:PC.text, fontSize:15, fontFamily:"'Jost',sans-serif", marginBottom:12, outline:"none" }}/>
          <button onClick={async ()=>{
            if(!newD.trim()) return;
            if(userTier === "audio" && !isPreview) {
              onUpgrade?.();
              return;
            }
            const before = [newFeel, newFeelText].filter(Boolean).join(", ");
            const localId = Date.now()+Math.random().toString(36).slice(2,8);
            const optimistic = {id:localId,createdTs:Date.now(),createdAt:new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}),desire:newD,days:0,done:false,signs:[],track:linkedTrack,category:newCats[0]||newCat,categories:newCats.length?newCats:[newCat],feelBefore:before,feelAfter:"",oldBelief:newBelief,details:newDetails.trim()};
            setThreads([optimistic,...threads]);
            setD(""); setLinked(""); setFeel(""); setFeelText(""); setNewCat("Richgirlmaxxing"); setNewCats([]); setNewBelief(""); setNewDetails(""); setAdding(false);
            if (!isPreview && userId) {
              try {
                await quizApi("/threads", token, {
                  method: "POST",
                  body: JSON.stringify({ id: localId, desire: newD, category: newCats[0]||newCat, categories: newCats, track: linkedTrack, old_belief: newBelief, feel_before: before }),
                });
              } catch (err) {
                console.error("Failed to save desire:", err);
              }
            }
          }} id="shg-save-intent" style={{ width:"100%",padding:"16px 22px",background:"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)",border:"none",borderRadius:999,color:"#000",fontSize:17,fontWeight:500,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>
            {userTier === "audio" && !isPreview ? "✓ Save intention, upgrade to Goddess" : "✓ Save intention"}
          </button>
          {userTier === "audio" && !isPreview && (
            <div style={{ fontSize:13,color:"#fdf0e8",marginTop:8,lineHeight:1.5 }}>
              You're on Audio Tier. Log your desire, then upgrade to Goddess to save it to your Proof Thread and track every sign.
            </div>
          )}
        </div>
      )}

      {/* THREAD LIST */}
      {displayedThreads.length===0 && proofFilter!=="all" && (
        <div style={{ background:PC.card,borderRadius:14,padding:"28px 18px",textAlign:"center",marginBottom:10 }}>
          <div style={{ fontSize:15,color:PC.text,fontFamily:"'Jost',sans-serif" }}>No {proofFilter==="manifested"?"manifested":"in progress"} desires yet.</div>
        </div>
      )}
      {displayedThreads.map(d=>(
        <div key={d.id} className="shg-paper" onTouchStart={e=>{window.__sx=e.touches[0].clientX;}} onTouchEnd={e=>{if(window.__sx-e.changedTouches[0].clientX>90)deleteThread(d.id);}} style={{ background:PC.cardSolid,borderRadius:14,padding:"14px 14px",marginBottom:10,position:"relative" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10 }}>
            <div style={{ flex:1,minWidth:0 }}>
              {editId===d.id
                ? <div style={{ display:"flex",gap:6,marginBottom:4 }}>
                    <input autoFocus value={editText} onChange={e=>setEditText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveEdit(d.id)} style={{ flex:1,background:"#fff",border:"1.5px solid #2CB7A7",color:"#000",borderRadius:8,padding:"7px 10px",fontSize:16,fontWeight:400,outline:"none",fontFamily:"'Jost',sans-serif" }}/>
                    <button onClick={()=>saveEdit(d.id)} style={{ padding:"7px 12px",background:"#000",border:"none",borderRadius:8,color:"#fff",fontSize:13,fontWeight:400,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>Save</button>
                  </div>
                : <div onClick={()=>{setEditId(d.id);setEditText(d.desire);}} style={{ fontSize:17,fontWeight:400,marginBottom:4,color:PC.text,cursor:"pointer" }}>{d.desire} <span style={{ fontSize:13 }} aria-label="Edit">✎</span></div>}
              <div style={{ display:"flex",alignItems:"center",gap:6,flexWrap:"wrap" }}>
                {d.category && <span style={{ fontSize:12,padding:"2px 9px",background:CAT_GRAD[d.category]||CAT_GRAD.Identity,color:"#000",borderRadius:20,fontWeight:400 }}>{d.category}</span>}
                {d.track && <span style={{ fontSize:13,color:PC.mu,fontWeight:400 }}>♪ {d.track}</span>}
              </div>
              {d.details && (
                <details style={{ marginTop:6 }}>
                  <summary style={{ fontSize:13,color:PC.text,cursor:"pointer" }}>Read more ›</summary>
                  <div style={{ fontSize:14,color:PC.text,lineHeight:1.6,marginTop:6,whiteSpace:"pre-line" }}>{d.details}</div>
                </details>
              )}
              {d.feelBefore && <div style={{ fontSize:13,color:PC.dim,marginTop:6,lineHeight:1.5 }}><b style={{color:PC.mu}}>Before:</b> "{d.feelBefore}"</div>}
              {d.done && d.feelAfter && <div style={{ fontSize:13,color:"#2CB7A7",marginTop:2,lineHeight:1.5,fontWeight:400 }}><b>After:</b> "{d.feelAfter}"</div>}
            </div>
            <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6,flexShrink:0 }}>
              <button onClick={()=>deleteThread(d.id)} title="Delete" style={{ fontSize:14,width:22,height:22,background:"none",border:"none",color:PC.dim,cursor:"pointer",lineHeight:1 }}>✕</button>
              {d.done
                ? <>
                    <label onClick={()=>undoMarkDone(d.id)} style={{ display:"flex",alignItems:"center",gap:7,cursor:"pointer" }}>
                      <span style={{ width:21,height:21,borderRadius:6,background:"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:400,color:"#000",boxShadow:"0 0 12px rgba(44,183,167,0.9)" }}>✓</span>
                      <span style={{ fontSize:13,fontWeight:400,color:PC.text }}>Manifested</span>
                    </label>
                    <span style={{ fontSize:11,color:PC.dim,fontWeight:400 }}>tap to undo</span>
                  </>
                : <label onClick={()=>startFinish(d.id)} style={{ display:"flex",alignItems:"center",gap:7,cursor:"pointer" }}>
                    <span style={{ width:21,height:21,borderRadius:6,background:PC.card,border:`2px solid ${PC.border}`,boxShadow:"0 0 10px rgba(44,183,167,0.35)" }}/>
                    <span style={{ fontSize:13,fontWeight:400,color:PC.text }}>Manifested</span>
                  </label>
              }
            </div>
          </div>

          {/* Marking manifested, capture feelAfter */}
          {finishing===d.id && (
            <div style={{ marginTop:10,background:PC.card,border:`1px solid ${PC.border}`,borderRadius:10,padding:"12px 14px" }}>
              <div style={{ fontSize:14,color:"#E8B870",fontWeight:500,marginBottom:8 }}>IT ARRIVED ✓, how are you feeling now?</div>
              <div style={{ display:"flex", gap:6, overflowX:"auto", marginBottom:10, paddingBottom:2, WebkitOverflowScrolling:"touch" }}>
                {HAWKINS.slice().reverse().map(h=>(
                  <button key={h.n} onClick={()=>setFeelAfterLevel(h.n)}
                    style={{ flexShrink:0, padding:"6px 11px", borderRadius:14, background:feelAfterLevel===h.n?h.c:"transparent", border:`1.5px solid ${h.c}`, color:feelAfterLevel===h.n?"#000":h.c, fontSize:14, fontWeight:500, cursor:"pointer", fontFamily:"'Jost',sans-serif", whiteSpace:"nowrap" }}>{h.n}</button>
                ))}
              </div>
              <div style={{ display:"flex",gap:6 }}>
                <input autoFocus value={feelAfterInput} onChange={e=>setFeelAfterInput(e.target.value)} placeholder="Capture this moment, in your own words"
                  onKeyDown={e=>e.key==="Enter"&&confirmFinish(d.id)}
                  style={{ flex:1,background:PC.inputBg,border:`1px solid ${PC.border}`,color:PC.text,borderRadius:8,padding:"10px 12px",fontSize:15,outline:"none",fontFamily:"'Jost',sans-serif" }}/>
                <button onClick={()=>confirmFinish(d.id)} style={{ padding:"10px 16px",background:"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)",border:"none",borderRadius:8,color:"#000",fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>Save ✓</button>
              </div>
            </div>
          )}

          {/* ═══ SIGNS & SYNCHRONICITY LOG, the heart of ProofOS ═══ */}
          <div style={{ marginTop:12,paddingTop:10,borderTop:`1px solid ${PC.border}` }}>
            <div style={{ fontSize:12,color:PC.mu,fontWeight:400,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:6 }}>Signs & synchronicities · {d.signs?.length||0}</div>
            {(d.signs||[]).map((sg,si)=>(
              <div key={sg._sid??si} style={{ display:"flex",alignItems:"flex-start",gap:8,marginBottom:5 }}>
                <span style={{ fontSize:13,color:CAT_COLOR[d.category]||"#E8B870",flexShrink:0,marginTop:1 }}>{sg.img?"📷":sg.audio?"🎤":""}</span>
                <span style={{ fontSize:14,color:PC.text,lineHeight:1.5,flex:1 }}>
                  {sg.text}
                  {sg.img && <img src={sg.img} alt="proof" style={{ display:"block",width:64,height:64,objectFit:"cover",borderRadius:8,marginTop:5,border:"1px solid rgba(0,0,0,0.15)" }}/>}
                  {sg.audio && <audio src={sg.audio} controls style={{ display:"block",width:"100%",maxWidth:220,height:30,marginTop:5 }}/>}
                </span>
                <span style={{ fontSize:12,color:PC.dim,flexShrink:0,fontWeight:400 }}>{sg.date}</span>
                <button onClick={()=>deleteSign(d.id,sg._sid??si)} style={{ background:"none",border:"none",color:PC.dim,cursor:"pointer",fontSize:14,padding:"0 0 0 4px",flexShrink:0,lineHeight:1,marginTop:2, }} title="Remove sign">✕</button>
              </div>
            ))}
            {!d.done && (
              <>
              {recId===d.id && (
                <div style={{ display:"flex",alignItems:"center",gap:6,marginTop:8,marginBottom:2 }}>
                  <span style={{ width:8,height:8,borderRadius:"50%",background:"#c0392b",animation:"shgRecPulse 1s ease-in-out infinite" }}/>
                  <span style={{ fontSize:12,color:"#c0392b",fontWeight:500,fontFamily:"'Jost',sans-serif" }}>Recording… {Math.floor(recSecs/60)}:{String(recSecs%60).padStart(2,"0")}</span>
                </div>
              )}
              <div style={{ display:"flex",gap:6,marginTop:8 }}>
                <input value={signInput[d.id]||""} onChange={e=>setSignInput({...signInput,[d.id]:e.target.value})} placeholder="Log a sign, a synchronicity, a shift…"
                  onKeyDown={e=>e.key==="Enter"&&addSign(d.id)}
                  style={{ flex:1,background:PC.inputBg,border:`1px solid ${PC.border}`,color:PC.text,borderRadius:8,padding:"9px 10px",fontSize:14,outline:"none",fontFamily:"'Jost',sans-serif" }}/>
                <button onClick={()=>addSign(d.id)} style={{ padding:"9px 16px",background:"linear-gradient(90deg,#F5E0A0,#E8B870 22%,#BFA5D8 52%,#2CB7A7 80%,#167A6B)",border:"none",borderRadius:999,color:"#000",fontSize:13,fontWeight:400,cursor:"pointer",fontFamily:"'Jost',sans-serif",whiteSpace:"nowrap" }}>+ Add</button>
                <label style={{ padding:"9px 10px",background:PC.inputBg,border:`1px solid ${PC.border}`,borderRadius:8,fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",color:PC.text }}>📷
                  <input type="file" accept="image/*" style={{ display:"none" }} onChange={e=>{ const f=e.target.files?.[0]; if(f) addMediaSign(d.id,{img:URL.createObjectURL(f),text:"Photo proof"}); e.target.value=""; }}/>
                </label>
                <button onClick={()=>toggleRec(d.id)} style={{ padding:"9px 10px",background:recId===d.id?"#c0392b":PC.inputBg,border:`1px solid ${recId===d.id?"#c0392b":PC.border}`,borderRadius:8,fontSize:15,cursor:"pointer",color:recId===d.id?"#fff":PC.text,animation:recId===d.id?"shgRecButtonPulse 1s ease-in-out infinite":"none" }}>{recId===d.id?"⏹":"🎤"}</button>
              </div>
              </>
            )}
          </div>

          {/* Progress + delete */}
          <div style={{ marginTop:10,height:3,background:"#000000",borderRadius:2 }}>
            <div style={{ width:`${Math.min((d.days||0)*5+((d.signs?.length||0)*8),100)}%`,height:"100%",background:"linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)",backgroundSize:"200%",backgroundPosition:"left",borderRadius:2 }}/>
          </div>
          <button onClick={()=>deleteThread(d.id)} style={{ fontSize:13,color:PC.text,background:"none",border:"none",cursor:"pointer",padding:"8px 0",fontFamily:"'Jost',sans-serif",marginTop:4,fontWeight:400,textDecoration:"underline",textUnderlineOffset:3 }}>Remove desire</button>
        </div>
      ))}
      </>
      )}
    </div>
  );
}

// ── COMMUNITY TAB ─────────────────────────────────────────────────────────────
// Members' wins, shared from the Proof Wall. Until the shared feed is live on the
// server, a member sees the wins she has shared from this phone; preview adds
// clearly-labelled examples so the page shows how it will look.
const EXAMPLE_WINS = [
  { name:"Maya", desire:"He texts me first, consistently, without me reaching out.", belief:"I always have to chase.", track:"He Finds His Way Back", cats:["Lovemaxxing"], days:9, feelBefore:"Fear (100)", feelAfter:"Love (500)", manifestedAt:"14 Sept 2026",
    signs:[{ text:"Heard our song in a café I'd never been to", date:"7 Sept" },{ text:"His name came up twice in one day", date:"9 Sept" },{ text:"Dreamt we were laughing on a beach", date:"11 Sept" },{ text:"Saw a couple with our exact initials on a cake", date:"12 Sept" },{ text:"He texted: 'I've been thinking about you'", date:"14 Sept" }] },
  { name:"", anon:true, desire:"I receive $5,000 in one day.", belief:"Money only comes from hard work.", track:"Money Finds Me First", cats:["Richgirlmaxxing"], days:31, feelBefore:"Desire (125)", feelAfter:"Joy (540)", manifestedAt:"2 Sept 2026",
    signs:[{ text:"Found £20 in an old coat", date:"5 Aug" },{ text:"Kept seeing 5000 on receipts", date:"12 Aug" },{ text:"An old client asked about my rates", date:"20 Aug" },{ text:"Invoice paid, $5,200, same day", date:"2 Sept" }] },
];

// ── SHARING WINS ───────────────────────────────────────────────────────────
function readPassportFor(userId, isPreview) { try { return JSON.parse(localStorage.getItem(`shg_passport_${userId || (isPreview ? "preview" : "guest")}`) || "null") || {}; } catch { return {}; } }
function downscaleImg(src, max = 160) {
  return new Promise(res => { if (!src) return res(null); const img = new Image(); img.onload = () => { const s = Math.min(img.width, img.height), c = document.createElement("canvas"); c.width = c.height = Math.min(max, s); c.getContext("2d").drawImage(img, (img.width-s)/2, (img.height-s)/2, s, s, 0, 0, c.width, c.height); try { res(c.toDataURL("image/jpeg", 0.7)); } catch { res(null); } }; img.onerror = () => res(null); img.src = src; });
}
function ShareWinOptions({ d, userId, isPreview, onShared }) {
  const pp = readPassportFor(userId, isPreview);
  const name = (pp.name || "").trim().split(/\s+/)[0] || (isPreview ? "Reshma" : "");
  const [noPhoto, setNoPhoto] = useState(false);
  const share = async (display) => {
    if (display === "face" && !pp.photo) { setNoPhoto(true); return; }
    const photo = display === "face" ? await downscaleImg(pp.photo, 160) : null;
    try {
      const l = JSON.parse(localStorage.getItem("shg_shared_wins") || "[]");
      if (!l.some(w => w.id === d.id)) {
        l.push({ id:d.id, display, anon: display === "anon", name: display === "anon" ? "" : name, photo, desire:d.desire, details:d.details||"", belief:d.oldBelief||"", track:d.track||"", cat:(d.categories||[d.category])[0], cats:d.categories||[d.category], days:d.days||1, feelBefore:d.feelBefore||"", feelAfter:d.feelAfter||"", signs:(d.signs||[]).map(x=>({ text:x.text, date:x.date })), manifestedAt:d.manifestedAt||"", date:new Date().toISOString() });
        localStorage.setItem("shg_shared_wins", JSON.stringify(l));
      }
    } catch {}
    onShared?.();
  };
  const btn = { background:"#000",color:"#F2ECE4",border:"none",borderRadius:999,padding:"6px 12px",fontSize:12,fontWeight:300,cursor:"pointer",fontFamily:"'Jost',sans-serif" };
  return (
    <>
      {[["Name and face","face"],["Name only","name"],["Anonymous","anon"]].map(([lab,v]) => <button key={v} onClick={()=>share(v)} style={btn}>{lab}</button>)}
      {noPhoto && <button onClick={()=>window.dispatchEvent(new Event("shg-open-passport"))} style={{ ...btn, background:"transparent", color:"#000", border:"1px solid #000" }}>Add a photo in your passport first ›</button>}
    </>
  );
}
// Draw a shared win as a 1080x1350 image in the brand style.
async function renderWinImage(w) {
  try { await document.fonts?.load?.("300 40px Jost"); await document.fonts?.load?.("400 40px Jost"); } catch {}
  const W = 1080, H = 1350, c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d");
  const grad = (x0,y0,x1,y1) => { const g = x.createLinearGradient(x0,y0,x1,y1); [["0","#F5E0A0"],[".25","#E8B870"],[".5","#BFA5D8"],[".78","#2CB7A7"],["1","#167A6B"]].forEach(([o,col])=>g.addColorStop(+o,col)); return g; };
  x.fillStyle = "#000"; x.fillRect(0,0,W,H);
  x.lineWidth = 10; x.strokeStyle = grad(0,0,W,H); x.beginPath(); x.roundRect ? x.roundRect(40,40,W-80,H-80,48) : x.rect(40,40,W-80,H-80); x.stroke();
  x.textAlign = "center"; x.fillStyle = grad(200,0,880,0); x.font = "400 34px Jost, sans-serif";
  const spaced = "S E L F   H Y P N O S I S   G O D D E S S"; x.fillText(spaced, W/2, 150);
  x.fillStyle = "#F2ECE4"; x.font = "300 30px Jost, sans-serif"; x.fillText("MANIFESTED" + (w.manifestedAt ? " · " + String(w.manifestedAt).toUpperCase() : ""), W/2, 215);
  // Wrap the win text
  x.font = "300 64px Jost, sans-serif"; const words = `\u201C${w.desire}\u201D`.split(" "); const lines = []; let line = "";
  words.forEach(wd => { const t = line ? line + " " + wd : wd; if (x.measureText(t).width > W - 220) { lines.push(line); line = wd; } else line = t; }); if (line) lines.push(line);
  const shown = lines.slice(0, 8); const lh = 84; let y = 560 - (shown.length * lh) / 2 + 60;
  shown.forEach(l => { x.fillText(l, W/2, y); y += lh; });
  x.font = "300 32px Jost, sans-serif"; x.fillText(`Took ${w.days||1} day${(w.days||1)===1?"":"s"} · ${(w.signs||[]).length} signs logged`, W/2, y + 30);
  // Who
  const who = w.display === "anon" || w.anon ? "Anonymous" : (w.name || "A member");
  let py = 1060;
  if ((w.display === "face") && w.photo) {
    const img = await new Promise(r => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = w.photo; });
    if (img) { x.save(); x.beginPath(); x.arc(W/2, py - 70, 70, 0, Math.PI*2); x.clip(); x.drawImage(img, W/2-70, py-140, 140, 140); x.restore(); x.lineWidth = 5; x.strokeStyle = grad(W/2-70,0,W/2+70,0); x.beginPath(); x.arc(W/2, py-70, 72, 0, Math.PI*2); x.stroke(); py += 40; }
  }
  x.fillStyle = "#F2ECE4"; x.font = "400 44px Jost, sans-serif"; x.fillText(who, W/2, py + 20);
  x.fillStyle = grad(360,0,720,0); x.font = "300 34px Jost, sans-serif"; x.fillText("reshmaoracle.com", W/2, H - 110);
  return await new Promise(r => c.toBlob(b => r(b), "image/png"));
}
function ShareInstagram({ w }) {
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState(null);
  const go = async () => {
    setBusy(true);
    try {
      const blob = await renderWinImage(w);
      const file = new File([blob], "my-win.png", { type:"image/png" });
      if (navigator.canShare && navigator.canShare({ files:[file] })) { try { await navigator.share({ files:[file], title:"My win" }); setBusy(false); return; } catch (e) { if (e && e.name === "AbortError") { setBusy(false); return; } } }
      setUrl(URL.createObjectURL(blob));
    } catch {}
    setBusy(false);
  };
  return (
    <>
      <button onClick={go} className="shg-ig-share" style={{ background:"linear-gradient(110deg,#F5E0A0,#E8B870,#BFA5D8,#2CB7A7,#167A6B)",color:"#000",border:"none",borderRadius:999,padding:"8px 14px",fontSize:13,fontWeight:300,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>{busy ? "Making your image…" : "Share to Instagram"}</button>
      {url && (
        <div role="dialog" aria-modal="true" aria-label="Your win image" onClick={()=>{ URL.revokeObjectURL(url); setUrl(null); }} style={{ position:"fixed",inset:0,zIndex:1500,background:"rgba(0,0,0,.94)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px 16px",gap:14,fontFamily:"'Jost',sans-serif" }}>
          <img src={url} alt="Your win, ready to share" onClick={e=>e.stopPropagation()} style={{ maxWidth:"100%",maxHeight:"70vh",borderRadius:12,WebkitTouchCallout:"default" }}/>
          <div style={{ color:"#F2ECE4",fontSize:15,fontWeight:300,textAlign:"center",lineHeight:1.5 }}>Press and hold the image to save it, then post it on Instagram.</div>
          <button onClick={()=>{ URL.revokeObjectURL(url); setUrl(null); }} style={{ background:"none",border:"1px solid #F2ECE4",color:"#F2ECE4",borderRadius:999,padding:"8px 20px",fontSize:15,fontWeight:300,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>Close ×</button>
        </div>
      )}
    </>
  );
}
function WinCard({ w, mine }) {
  const [open, setOpen] = useState(false);
  const [cheered, setCheered] = useState(false);
  return (
    <div className="shg-paper" style={{ borderRadius:18,padding:16 }}>
      <div style={{ display:"flex",gap:12,alignItems:"center" }}>
        {w.display === "face" && w.photo ? <img src={w.photo} alt="" style={{ width:56,height:56,borderRadius:"50%",objectFit:"cover",flexShrink:0,border:"2px solid #000" }}/> : <Thumb cat={(w.cats||[w.cat])[0]} size={56} radius={10}/>}
        <div style={{ flex:1,minWidth:0 }}>
          <div style={{ fontSize:13,letterSpacing:".12em",textTransform:"uppercase" }}>{mine?(w.display==="anon"||(!w.display&&w.anon)?"You · anonymous":`You${w.name?` (${w.name})`:""}`):w.anon?"Anonymous":w.name} · manifested{w.manifestedAt?` ${w.manifestedAt}`:""}</div>
          <div style={{ fontSize:17,fontWeight:400,lineHeight:1.35,marginTop:4 }}>"{w.desire}"</div>
        </div>
      </div>
      <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginTop:12 }}>
        {(w.cats||[w.cat]).filter(Boolean).map(c=><span key={c} style={{ fontSize:12,padding:"3px 10px",border:"1px solid #000",borderRadius:999 }}>{String(c).replace("maxxing","")}</span>)}
        <span style={{ fontSize:12,padding:"3px 10px",background:"#000",color:"#F2ECE4",borderRadius:999 }}>Took {w.days||1} day{(w.days||1)===1?"":"s"}</span>
        <span style={{ fontSize:12,padding:"3px 10px",border:"1px solid #000",borderRadius:999 }}>{(w.signs||[]).length} signs</span>
      </div>
      {w.track && <div style={{ fontSize:14,marginTop:10 }}>Listened to <span style={{ fontWeight:400 }}>{w.track}</span></div>}
      {(w.feelBefore||w.feelAfter) && <div style={{ fontSize:14,marginTop:4 }}>Felt {w.feelBefore||"?"} → {w.feelAfter||"?"}</div>}
      {w.belief && <div style={{ fontSize:14,marginTop:4 }}>Old belief: "{w.belief}"</div>}
      {open && (
        <div style={{ marginTop:12,borderTop:"1px solid #000",paddingTop:10 }}>
          {w.details && <div style={{ fontSize:14,lineHeight:1.6,marginBottom:12,whiteSpace:"pre-line" }}>{w.details}</div>}
          <div style={{ fontSize:12,letterSpacing:".2em",marginBottom:6 }}>SIGNS SHE LOGGED</div>
          {(w.signs||[]).map((sg,i)=><div key={i} style={{ fontSize:14,lineHeight:1.5,padding:"4px 0" }}>✦ {sg.text} <span style={{ fontSize:12 }}>· {sg.date}</span></div>)}
        </div>
      )}
      <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginTop:12 }}>
        <button onClick={()=>setOpen(o=>!o)} style={{ background:"#000",color:"#F2ECE4",border:"none",borderRadius:999,padding:"8px 14px",fontSize:13,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>{open?"Hide the signs":"See every sign"}</button>
        <ShareInstagram w={w}/>
        {!mine && <button onClick={()=>setCheered(true)} style={{ background:"transparent",color:"#000",border:"1px solid #000",borderRadius:999,padding:"8px 14px",fontSize:13,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>{cheered?"Sent ✦":"Send love ✦"}</button>}
        {!mine && <button onClick={()=>alert("Connecting with members is coming soon. You'll be able to message each other anonymously.")} style={{ background:"transparent",color:"#000",border:"1px solid #000",borderRadius:999,padding:"8px 14px",fontSize:13,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>Connect</button>}
      </div>
    </div>
  );
}
function CommunityTab({ C, isPreview }) {
  let mine = []; try { const raw = JSON.parse(localStorage.getItem("shg_shared_wins") || "[]"); mine = Array.isArray(raw) ? raw.filter(w => w && w.desire) : []; } catch {}
  const [step, setStep] = useState(null);
  const steps = [
    ["Set it","Write your intention in proofOS, in the present tense, as if it's already done. Pick its categories and how you honestly feel. That feeling is your starting point, and it's what makes the change visible later."],
    ["Track it","Every sign goes under that intention the moment it happens: a word, a song, a stranger, an exact amount. Add a photo or a voice note. The trail of signs is what turns hope into evidence."],
    ["Receive it","When the real outcome arrives, open the intention and mark it manifested. The date, the days it took, the track you listened to and every sign are saved together, forever."],
    ["Share it","On your Proof Wall, tap Share. Choose your first name or stay anonymous. Your whole proof is shared exactly as you logged it, and nobody can edit it. Someone scrolling tonight needs to see that it's possible."],
  ];
  const PAPER_DARK = { backgroundColor:"#000", backgroundImage:"linear-gradient(rgba(191,165,216,.18) 1px,transparent 1px),linear-gradient(90deg,rgba(191,165,216,.18) 1px,transparent 1px)", backgroundSize:"22px 22px" };
  return (
    <div className="shg-no-paper" style={{ padding:"16px 16px 40px",maxWidth:900,margin:"0 auto",textAlign:"center" }}>
      <div className="shg-gt" style={{ fontSize:28,fontWeight:500,display:"inline-block" }}>Community wins</div>
      <div style={{ fontSize:15,fontWeight:300,color:C.cr,margin:"6px 0 16px",lineHeight:1.5,WebkitTextStroke:0 }}>Real proof from real members. When hers arrives, you see what's possible for you.</div>
      <button onClick={()=>setStep(step===null?0:null)} aria-expanded={step!==null} className="shg-paper" style={{ display:"block",width:"100%",borderRadius:18,padding:"20px 12px",marginBottom:14,cursor:"pointer",fontFamily:"'Jost',sans-serif",color:"#000" }}>
        <div style={{ fontSize:13,fontWeight:500,letterSpacing:".3em",marginBottom:16 }}>HOW COMMUNITY WINS WORK</div>
        <style>{`body .shg-cw.shg-cw{display:grid!important;flex-direction:initial!important;grid-template-columns:repeat(4,1fr)!important;gap:6px}`}</style>
        <div className="shg-cw">
          {steps.map(([t],i)=>(
            <div key={t}>
              <div style={{ width:52,height:52,margin:"0 auto 8px",borderRadius:"50%",display:"grid",placeItems:"center",fontSize:22,color:"#000",background:"linear-gradient(135deg,#F5E0A0,#E8B870,#BFA5D8,#2CB7A7)" }}>{i+1}</div>
              <div style={{ fontSize:15,fontWeight:500 }}>{t}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize:14,marginTop:14 }}>{step===null ? "Tap me to see how it works ›" : "Tap to close ⌃"}</div>
        {step!==null && (
          <div style={{ marginTop:22,textAlign:"left",animation:"shg-spin-in .5s both" }}>
            {steps.map(([t,d],i)=>(
              <div key={t} style={{ marginBottom:16 }}>
                <div style={{ fontSize:15,fontWeight:500,marginBottom:4 }}>{i+1}. {t}</div>
                <div style={{ fontSize:15,fontWeight:300,lineHeight:1.6 }}>{d}</div>
              </div>
            ))}
          </div>
        )}
      </button>
      <button onClick={()=>window.dispatchEvent(new Event("shg-go-wall"))} style={{ display:"block",margin:"0 auto 20px",background:OMBRE,color:"#000",border:"none",borderRadius:999,padding:"12px 24px",fontSize:15,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>Share my win ›</button>
      <div style={{ display:"grid",gap:14,textAlign:"left" }}>
        {mine.slice().reverse().map((w,i)=><WinCard key={"m"+i} w={w} mine/>)}
        {EXAMPLE_WINS.map((w,i)=><WinCard key={"e"+i} w={w}/>)}
      </div>
      <div style={{ fontSize:13,fontWeight:300,color:C.cr,marginTop:12 }}>{mine.length ? "Your shared wins are at the top, followed by example wins." : "These are example wins. Yours appear at the top when you share one."}</div>
    </div>
  );
}

// Soft pulsing glow for the Guidebook entry.
if (typeof document !== "undefined" && !document.getElementById("shg-guide-glow-css")) { const st = document.createElement("style"); st.id = "shg-guide-glow-css"; st.textContent = `body .shg-mp-head.shg-mp-head{display:grid!important;grid-template-columns:1fr auto 1fr!important;flex-direction:initial!important}.shg-mp-head>:first-child{justify-self:start}.shg-mp>*{flex-shrink:0}.shg-home :is(div,button).shg-paper.shg-paper.shg-paper.shg-paper.shg-paper.shg-paper{border-width:1px!important}@keyframes shg-lucky{0%{background-position:0% 50%;box-shadow:0 0 18px rgba(245,224,160,.5)}50%{background-position:100% 50%;box-shadow:0 0 32px rgba(44,183,167,.55)}100%{background-position:0% 50%;box-shadow:0 0 18px rgba(245,224,160,.5)}}@keyframes shg-spin-in{from{transform:rotateY(-90deg);opacity:0}to{transform:none;opacity:1}}.shg-guide-glow{animation:shg-gg 3.6s ease-in-out infinite}@keyframes shg-gg{0%,100%{box-shadow:0 0 16px rgba(232,184,112,.35),0 0 40px rgba(191,165,216,.2)}50%{box-shadow:0 0 28px rgba(44,183,167,.5),0 0 64px rgba(191,165,216,.35)}}@media(prefers-reduced-motion:reduce){.shg-guide-glow{animation:none}}`; document.head.appendChild(st); }

const CloseX = ({ onClick, dark=false, style }) => <button onClick={e=>{ e.stopPropagation(); onClick(); }} aria-label="Close" style={{ position:"absolute",top:8,right:8,zIndex:3,width:34,height:34,borderRadius:"50%",border:`1px solid ${dark?"#F2ECE4":"#000"}`,background:dark?"#000":"#F2ECE4",color:dark?"#F2ECE4":"#000",fontSize:20,lineHeight:"30px",textAlign:"center",padding:0,cursor:"pointer",fontFamily:"'Jost',sans-serif",fontWeight:300,...style }}>×</button>;
// A home card that shows only its title until tapped, then spins open.
function FoldCard({ title, sub, children }) {
  const [open, setOpen] = useState(false);
  if (!open) return (
    <button onClick={()=>setOpen(true)} className="shg-paper" style={{ display:"block",width:"calc(100% - 32px)",margin:"0 16px 12px",padding:"12px 16px",borderRadius:18,cursor:"pointer",textAlign:"center",fontFamily:"'Jost',sans-serif",color:"#000" }}>
      <span style={{ display:"block",fontSize:16,fontWeight:500 }}>{title}</span>{sub && <span style={{ display:"block",fontSize:13,marginTop:2 }}>{sub}</span>}
      <span style={{ display:"block",fontSize:13,marginTop:4 }}>Tap me to open ›</span>
    </button>
  );
  return (
    <div style={{ animation:"shg-spin-in .6s cubic-bezier(.2,.8,.2,1) both",marginBottom:16,position:"relative" }}>
      <button onClick={()=>setOpen(false)} aria-expanded="true" className="shg-paper" style={{ display:"block",width:"calc(100% - 32px)",margin:"0 16px 10px",padding:"10px 16px",borderRadius:18,cursor:"pointer",textAlign:"center",fontFamily:"'Jost',sans-serif",color:"#000" }}>
        <span style={{ display:"block",fontSize:16,fontWeight:400 }}>{title}</span>
        <span style={{ display:"block",fontSize:13,fontWeight:300,marginTop:2 }}>Tap to close ⌃</span>
      </button>
      {children}
      <button onClick={()=>setOpen(false)} style={{ display:"block",margin:"-6px auto 0",background:"none",border:"1px solid #F2ECE4",color:"#F2ECE4",borderRadius:999,padding:"6px 16px",fontSize:13,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>Close ⌃</button>
    </div>
  );
}

// Speak into a text box (Web Speech API), same pattern as SpeakToProof.
function useMic(onText) {
  const [on, setOn] = useState(false); const ref = useRef(null);
  const toggle = () => {
    if (on) { ref.current?.stop(); setOn(false); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Voice isn't supported in this browser. Try Safari or Chrome."); return; }
    const r = new SR(); r.lang = "en-GB"; r.interimResults = false; r.continuous = false;
    r.onresult = e => onText(Array.from(e.results).map(x => x[0].transcript).join(" ").trim());
    r.onend = () => setOn(false); r.onerror = () => setOn(false);
    ref.current = r; try { r.start(); setOn(true); } catch { setOn(false); }
  };
  return [on, toggle];
}
const saveThread = ({ v, bucket, setThreads, isPreview, userId, token }) => {
  const id = Date.now()+Math.random().toString(36).slice(2,6);
  if (!isPreview && userId && token) quizApi("/threads", token, { method:"POST", body: JSON.stringify(bucket ? { id, desire:v, is_bucket:true } : { id, desire:v }) }).catch(() => {});
  setThreads(ts => [{ id, desire:v, days:0, done:false, signs:[], track:"", category:"", feelBefore:"", feelAfter:"", oldBelief:"", isBucket:!!bucket, addedOn:new Date().toDateString(), createdTs:Date.now(), createdAt:new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}) }, ...ts]);
};
// Home action panel for the Intentions / Bucket List tiles.
function QuickAdd({ kind, threads, setThreads, isPreview, userId, token, onClose }) {
  const bucket = kind === "bucket";
  const [text, setText] = useState("");
  const [mic, toggleMic] = useMic(t => setText(x => (x ? x + " " : "") + t));
  const recent = threads.filter(t => bucket ? t.isBucket && !t.done : !t.isBucket && !t.done).slice(0, 5);
  const add = () => { const v = text.trim(); if (!v) return; saveThread({ v, bucket, setThreads, isPreview, userId, token }); setText(""); };
  return (
    <div className="shg-no-paper" style={{ position:"relative",marginTop:12,padding:"16px 14px",borderRadius:18,background:"#000",border:"1px solid rgba(242,236,228,.25)",color:"#F2ECE4",fontFamily:"'Jost',sans-serif" }}>
      <CloseX onClick={onClose} dark/>
      <div style={{ fontSize:18,fontWeight:300,marginBottom:10 }}>{bucket ? "Add to your bucket list" : "Add an intention"}</div>
      <input id="shg-quick-add" value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter"){ e.preventDefault(); add(); } }} placeholder={bucket ? "Anything you want, ever" : "Write it as if it's already done"} style={{ width:"100%",boxSizing:"border-box",background:"#fff",color:"#000",border:"none",borderRadius:12,padding:"12px",fontSize:16,fontFamily:"inherit",fontWeight:300 }}/>
      <div style={{ display:"flex",gap:8,marginTop:8 }}>
        <button onClick={toggleMic} style={{ flex:1,background:"transparent",color:"#F2ECE4",border:"1px solid #F2ECE4",borderRadius:999,padding:"10px",fontSize:14,fontWeight:300,cursor:"pointer",fontFamily:"inherit" }}>{mic ? "Listening… tap to stop" : "🎙 Speak it"}</button>
        <button onClick={add} style={{ flex:1,background:OMBRE,color:"#000",border:"none",borderRadius:999,padding:"10px",fontSize:15,fontWeight:300,cursor:"pointer",fontFamily:"inherit" }}>Add</button>
      </div>
      {recent.length > 0 && <div style={{ marginTop:12,display:"grid",gap:6 }}>{recent.map(t => <div key={t.id} style={{ fontSize:14,fontWeight:300,padding:"8px 12px",borderRadius:10,border:"1px solid rgba(242,236,228,.2)" }}>✦ {t.desire}</div>)}</div>}
      <details style={{ marginTop:12 }}>
        <summary style={{ cursor:"pointer",fontSize:14,fontWeight:300,textDecoration:"underline",textUnderlineOffset:3,listStyle:"none" }}>How it works ›</summary>
        <div style={{ fontSize:14,fontWeight:300,lineHeight:1.6,marginTop:8 }}>{bucket ? "Write anything you want, ever. One line is enough. Aim for ten a day. When one arrives, mark it manifested in proofOS. When you want to focus on one, promote it to an intention." : "Write it in the present tense, as if it's already done: \"I live in my home by the sea.\" Then log every sign under it in proofOS, and mark it manifested when it arrives."}</div>
        <button onClick={()=>window.dispatchEvent(new CustomEvent("shg-open-guide",{ detail:{ key: bucket ? "bucket-how" : "how-to-write-intention" } }))} style={{ marginTop:8,background:"none",border:"1px solid #F2ECE4",color:"#F2ECE4",borderRadius:999,padding:"6px 14px",fontSize:13,fontWeight:300,cursor:"pointer",fontFamily:"inherit" }}>Read more in the Guidebook ›</button>
      </details>
    </div>
  );
}

// ── BUCKET LIST BAND ────────────────────────────────────────────────────────
// Encourages ten bucket-list ideas a day, added right from Home.
function BucketBand({ threads, setThreads, isPreview, userId, token }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [mic, toggleMic] = useMic(t => setText(x => (x ? x + " " : "") + t));
  const todayKey = new Date().toDateString();
  const todayItems = threads.filter(t => t.isBucket && t.addedOn === todayKey);
  const todayCount = todayItems.length;
  const add = () => {
    const v = text.trim(); if (!v) return;
    const id = Date.now()+Math.random().toString(36).slice(2,6);
    void 0;
    // Same store proofOS uses: local threads, plus the account when signed in.
    if (!isPreview && userId && token) quizApi("/threads", token, { method:"POST", body: JSON.stringify({ id, desire: v, is_bucket: true }) }).catch(() => {});
    setThreads(ts => [{ id, desire:v, days:0, done:false, signs:[], track:"", category:"", feelBefore:"", feelAfter:"", oldBelief:"", isBucket:true, addedOn:todayKey, createdTs:Date.now() }, ...ts]);
    setText("");
  };
  return (
    <div className="shg-no-paper" style={{ margin:"0 16px 14px",background:"linear-gradient(#000,#000) padding-box, linear-gradient(110deg,#F5E0A0,#E8B870,#BFA5D8,#2CB7A7,#167A6B) border-box",borderRadius:22,border:"1px solid transparent",padding:"34px 18px",fontFamily:"'Jost',sans-serif",color:"#F2ECE4",boxShadow:"0 0 22px rgba(191,165,216,.22)",position:"relative" }}>
      {open && <CloseX onClick={()=>setOpen(false)} dark/>}
      <button onClick={()=>setOpen(o=>!o)} aria-expanded={open} style={{ all:"unset",display:"flex",alignItems:"center",gap:16,width:"100%",cursor:"pointer" }}>
        <img src="/icons/lucky.webp" alt="" style={{ width:72,height:72,borderRadius:"50%",flexShrink:0,boxShadow:"0 0 18px rgba(245,224,160,.35)" }}/>
        <span style={{ flex:1,minWidth:0 }}>
          <span style={{ display:"block",fontSize:11,letterSpacing:".28em",fontWeight:400,color:"#F2ECE4",marginBottom:6 }}>BUCKET LIST</span>
          <span style={{ display:"block",fontSize:20,fontWeight:300,lineHeight:1.25,color:"#F2ECE4" }}>Add 10 ideas to your bucket list today</span>
          <span style={{ display:"flex",alignItems:"center",gap:10,marginTop:10 }}>
            <span style={{ flex:1,height:4,borderRadius:2,background:"rgba(242,236,228,.15)",overflow:"hidden" }}><span style={{ display:"block",height:"100%",width:`${Math.min(100,todayCount*10)}%`,background:OMBRE }}/></span>
            <span style={{ fontSize:14,fontWeight:300,color:"#F2ECE4",whiteSpace:"nowrap" }}>{todayCount}/10</span>
          </span>
          <span style={{ display:"inline-block",fontSize:15,fontWeight:300,color:"#000",background:OMBRE,borderRadius:999,padding:"8px 16px",marginTop:12 }}>{open ? "Tap to close ⌃" : "Tap to add to your bucket list ›"}</span>
        </span>
      </button>
      {open && (
        <div style={{ marginTop:14 }}>
          <div style={{ display:"flex",gap:8 }}>
            <input id="shg-bucket-quick" value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter"){ e.preventDefault(); add(); } }} placeholder="Anything you want, ever" style={{ flex:1,minWidth:0,background:"#fff",color:"#000",border:"none",borderRadius:12,padding:"11px 12px",fontSize:15,fontFamily:"inherit" }}/>
            <button onClick={add} style={{ background:OMBRE,color:"#000",border:"none",borderRadius:12,padding:"0 16px",fontSize:15,cursor:"pointer",fontFamily:"inherit" }}>Add</button>
          </div>
          <button onClick={toggleMic} style={{ marginTop:8,width:"100%",background:"transparent",color:"#F2ECE4",border:"1px solid #F2ECE4",borderRadius:999,padding:"10px",fontSize:14,fontWeight:300,cursor:"pointer",fontFamily:"inherit" }}>{mic ? "Listening… tap to stop" : "🎙 Speak it"}</button>
          {todayItems.length > 0 && <div style={{ marginTop:12,display:"grid",gap:6 }}>{todayItems.map(t => <div key={t.id} style={{ fontSize:15,fontWeight:300,padding:"8px 12px",borderRadius:10,border:"1px solid rgba(242,236,228,.2)" }}>✦ {t.desire}</div>)}</div>}
          <button onClick={()=>window.dispatchEvent(new Event("shg-go-bucket"))} style={{ marginTop:10,background:"none",border:"none",color:"#F2ECE4",fontSize:14,fontWeight:300,textDecoration:"underline",textUnderlineOffset:3,cursor:"pointer",fontFamily:"inherit",padding:0 }}>See my whole bucket list in proofOS ›</button>
          <div style={{ fontSize:13,fontWeight:300,marginTop:10,lineHeight:1.5 }}>No rules, no pressure. Short is fine. The more you release, the faster some of them arrive. They're saved in proofOS › Bucket List.</div>
        </div>
      )}
    </div>
  );
}

// ── KEEP ADDING ─────────────────────────────────────────────────────────────
// Anything she wants the app to learn: a note, a journal page, a ChatGPT or
// Claude summary. Saved into her passport (My Life › My uploads) with the date,
// so the history builds up without opening the passport.
function KeepAdding({ userId, isPreview }) {
  const key = `shg_passport_${userId || (isPreview ? "preview" : "guest")}`;
  const read = () => { try { return JSON.parse(localStorage.getItem(key) || "null") || {}; } catch { return {}; } };
  const [note, setNote] = useState("");
  const [items, setItems] = useState(() => (read().life?.uploads || []).slice(0, 5));
  const today = () => new Date().toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" });
  const save = (added) => {
    const p = read(); const life = { ...(p.life || {}) };
    life.uploads = [...added, ...(life.uploads || [])].slice(0, 50);
    try { localStorage.setItem(key, JSON.stringify({ ...p, life })); } catch {}
    setItems(life.uploads.slice(0, 5));
  };
  return (
    <div className="shg-paper" style={{ margin:"0 16px 16px",padding:"14px 14px 16px",borderRadius:18,textAlign:"center" }}>
      <div style={{ fontSize:16,fontWeight:400 }}>Keep adding</div>
      <div style={{ fontSize:13,fontWeight:300,lineHeight:1.5,margin:"4px 0 10px" }}>Anything that helps me know you: a thought, a journal page, a goal. Tip: ask ChatGPT or Claude "Summarise everything you know about me, my goals and my blocks" and paste it here.</div>
      <textarea id="shg-keep-note" rows={2} value={note} onChange={e=>setNote(e.target.value)} placeholder="Write or paste anything…" style={{ width:"100%",boxSizing:"border-box",border:"1px solid #000",borderRadius:12,padding:"12px",fontSize:15,fontFamily:"'Jost',sans-serif",background:"#fff",color:"#000",resize:"vertical" }}/>
      <div style={{ display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginTop:10 }}>
        <button onClick={()=>{ if(!note.trim()) return; save([{ name:"Note", type:"text/plain", date:today(), text:note.trim() }]); setNote(""); }} style={{ background:"#000",color:"#F2ECE4",border:"none",borderRadius:999,padding:"10px 18px",fontSize:14,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>Save</button>
        <label style={{ background:"transparent",color:"#000",border:"1px solid #000",borderRadius:999,padding:"10px 18px",fontSize:14,cursor:"pointer" }}>
          + Upload a file or photo
          <input type="file" multiple accept="image/*,.txt,.md,.pdf,.doc,.docx" hidden onChange={async e=>{ const files=[...(e.target.files||[])]; const added=await Promise.all(files.map(async f=>({ name:f.name, type:f.type, date:today(), text:/^text\//.test(f.type)||/\.(txt|md)$/i.test(f.name) ? (await f.text()).slice(0,20000) : "" }))); save(added); e.target.value=""; }}/>
        </label>
      </div>
      {items.length > 0 && (
        <div style={{ marginTop:14,textAlign:"left" }}>
          <div style={{ fontSize:12,letterSpacing:".22em",textAlign:"center",marginBottom:6 }}>RECENTLY ADDED</div>
          {items.map((u,i)=><div key={i} style={{ fontSize:14,padding:"6px 0",borderBottom:"1px solid rgba(191,165,216,.55)",display:"flex",justifyContent:"space-between",gap:10 }}><span style={{ overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{u.text ? u.text.slice(0,60) : u.name}</span><span style={{ flexShrink:0 }}>{u.date}</span></div>)}
          <div style={{ fontSize:13,textAlign:"center",marginTop:8 }}>Everything is kept in your passport, with its date.</div>
        </div>
      )}
    </div>
  );
}

// ── DAILY REMINDER ────────────────────────────────────────────────────────────
const REMINDERS = [
  { eq:"Clarity + Calm = Magnetism", body:[
    ["What it means","Magnetism isn't a personality trait. It's what happens when you know exactly what you want and you're not panicking about it. Clarity tells the universe, and your brain, precisely what to look for. Calm tells your nervous system it's safe to receive it. Put the two together and you stop pushing things away without realising."],
    ["Why clarity comes first","A vague desire gives your brain nothing to lock onto. \"I want more money\" could mean anything. \"I receive $3,000 from a new client this month\" gives your reticular activating system a target. The filter that decides what you notice switches on. Suddenly you see the opportunity that was always there."],
    ["Why calm is the multiplier","When you want something desperately, your body reads the wanting as lack. Lack makes you grip, check, chase and over-explain. Calm is the signal that says: this is already mine, I don't need to force it. People, money and chances move toward calm energy the same way you move toward a calm person in a room."],
    ["Do this today","Rewrite one intention so it's specific: a number, a name, a feeling, a date. Read it once, out loud. Then put it down. Play your track and let the calm part happen while you listen."],
    ["Sign to watch for","Someone reaches out first today: a message, an offer, a reply that came fast. That's the pull. Log it in proofOS."],
  ]},
  { eq:"Expectation + Attention = Evidence", body:[
    ["What it means","Evidence doesn't appear because you finally deserve it. It appears because you expected it and then looked for it. Expectation sets the direction. Attention catches what arrives. Evidence is the result, and evidence is what kills doubt."],
    ["The science part","Your brain filters out most of what's around you. It keeps only what it's been told matters. When you expect good things, the filter starts flagging them: the parking space, the discount, the compliment, the perfect-timing call. They were always there. Now you can see them."],
    ["Why most people miss it","They expect the big thing all at once, so they ignore the small signs on the way. Then they decide it isn't working. The small signs are the proof that it is."],
    ["Do this today","Before you leave the house, say: \"Today things go my way.\" Then count every small win until bedtime. Write down three, however tiny."],
    ["Sign to watch for","A coincidence that makes you laugh out loud. That one goes straight into proofOS."],
  ]},
  { eq:"Decision + Repetition = Identity", body:[
    ["What it means","You don't become her by wishing. You become her by deciding once and repeating until your subconscious stops arguing. Decision is the moment you choose. Repetition is how the new identity becomes the default."],
    ["Why repetition works","Your subconscious learns the way you learned to drive: through repetition, not effort. Every listen is another vote for the new version of you. Thirty days of ten minutes beats one hour once."],
    ["The trap","Deciding again every morning. \"Maybe this time it'll work.\" That's not a decision, it's a question. Decide once. Then just press play."],
    ["Do this today","Do one small thing the new you would do without thinking: book it, wear it, say it, send it. Your behaviour tells your brain who you are."],
    ["Sign to watch for","Someone treats you like the version of you you're becoming. Log how it felt."],
  ]},
  { eq:"Less Grip + More Space = Arrival", body:[
    ["What it means","Things arrive faster when you stop squeezing them. Grip is checking, chasing, over-planning, needing to know how. Space is room in your day, your mind and your life for the thing to actually arrive."],
    ["Why letting go works","Grip keeps your body in survival mode. In survival mode you can only see threats, not opportunities. Letting go isn't giving up. It's trusting enough to stop blocking the door."],
    ["What space looks like","A cleared evening. An empty drawer for the new clothes. A saved seat. A calendar with room in it. Space is a physical message: I'm ready for this."],
    ["Do this today","Clear one small space for your desire to arrive into, in your calendar, your inbox or your home. Then do something that has nothing to do with it."],
    ["Sign to watch for","It shows up in a form you didn't expect. Say yes anyway, and log it."],
  ]},
  { eq:"Noticing + Logging = More Luck", body:[
    ["What it means","Lucky people aren't luckier. They notice more, so they act on more. Logging turns each lucky moment into proof, and proof makes you expect more luck. It's a loop, and it compounds."],
    ["Why logging matters","Your memory keeps the disappointments and forgets the wins. Without a record, you'll swear nothing ever works out. With a record, you can scroll back and see it has been working the whole time."],
    ["The luck loop","Notice a small win, log it, feel it, expect the next one, notice sooner. By month three the loop runs without you trying."],
    ["Do this today","Say yes to one random invitation or detour. Luck needs a door to walk through."],
    ["Sign to watch for","Something you'd almost forgotten about turns up again. Log it with today's date."],
  ]},
  { eq:"Trust + Detour = Divine Timing", body:[
    ["What it means","The detour isn't a mistake. It's the route. When plans change, when you're late, when the thing you wanted falls through, trust says: I'm being moved somewhere better."],
    ["Why timing feels wrong","You can only see this week. Your desire is arriving on a longer timeline, lined up with people and moments you can't see yet. Trust fills the gap between what you can see and what's coming."],
    ["How to tell the difference","A detour feels irritating at first and makes sense later. Keep notes. In a month, look back and you'll see why it happened."],
    ["Do this today","The next time something changes plan, say out loud: \"Thank you, this is taking me somewhere better.\" Then watch."],
    ["Sign to watch for","A conversation you overhear, or a stranger who knows exactly the person you needed. Log it."],
  ]},
];
// The equation as a loop: its parts feed the result, which feeds noticing again.
function EqLoop({ eq }) {
  const [lhs, rhs] = String(eq).split("=").map(x => x.trim());
  const parts = (lhs || "").split("+").map(x => x.trim()).filter(Boolean);
  const nodes = [...parts, rhs, "Believe it more"].slice(0, 4);
  const pos = [[110,24],[196,96],[110,168],[24,96]];
  return (
    <div style={{ margin:"4px 0 14px" }}>
      <div style={{ fontSize:11,letterSpacing:".22em",marginBottom:6 }}>THE LOOP</div>
      <svg viewBox="-34 0 288 192" width="100%" style={{ maxWidth:340,display:"block",margin:"0 auto" }} role="img" aria-label={`Loop: ${nodes.join(" then ")}, then again`}>
        <defs>
          <linearGradient id="eqg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#F5E0A0"/><stop offset=".3" stopColor="#E8B870"/><stop offset=".6" stopColor="#BFA5D8"/><stop offset=".85" stopColor="#2CB7A7"/><stop offset="1" stopColor="#167A6B"/></linearGradient>
          <marker id="eqa" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#167A6B"/></marker>
        </defs>
        {[[-68,-22],[22,68],[112,158],[202,248]].map(([a0,a1],i)=>{ const P = a => [110+72*Math.cos(a*Math.PI/180), 96+72*Math.sin(a*Math.PI/180)]; const [x0,y0]=P(a0), [x1,y1]=P(a1); return <path key={i} d={`M${x0.toFixed(1)} ${y0.toFixed(1)} A72 72 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`} fill="none" stroke="url(#eqg)" strokeWidth="2.5" markerEnd="url(#eqa)"/>; })}
        {nodes.map((n,i)=>(
          <g key={i}>
            <rect x={pos[i][0]-44} y={pos[i][1]-15} width="88" height="30" rx="15" fill="#000"/>
            <text x={pos[i][0]} y={pos[i][1]+4} textAnchor="middle" fill="#F2ECE4" fontSize={n.length>12?9:10.5} fontFamily="Jost,sans-serif" fontWeight="300">{n}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
// What logging does over time: signs noticed per day rise as the habit builds.
function EqChart() {
  const v = [1,1,2,2,3,3,4,5,5,6,7,8,9,10];
  return (
    <div style={{ margin:"4px 0 14px",padding:"12px 14px",borderRadius:14,border:"1px solid #000",background:"#fff",textAlign:"left" }}>
      <div style={{ fontSize:11,letterSpacing:".22em",marginBottom:8 }}>WHEN YOU LOG EVERY DAY</div>
      <div style={{ display:"flex",alignItems:"flex-end",gap:3,height:70 }}>
        {v.map((x,i)=><div key={i} style={{ flex:1,height:`${x*10}%`,borderRadius:3,background:"linear-gradient(180deg,#2CB7A7,#BFA5D8,#E8B870,#F5E0A0)" }}/>)}
      </div>
      <div style={{ display:"flex",justifyContent:"space-between",fontSize:12,fontWeight:300,marginTop:6 }}><span>Day 1</span><span>Day 14</span></div>
      <div style={{ fontSize:13,fontWeight:300,lineHeight:1.5,marginTop:6 }}>Signs noticed per day, a typical first two weeks. The more you log, the more you see. Two minutes a day keeps the loop running.</div>
    </div>
  );
}
function DailyReminder({ userId, token }) {
  const push = usePushNotifications(userId, token);
  const standalone = typeof window !== "undefined" && (window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone);
  const [open, setOpen] = useState(false);
  const r = REMINDERS[Math.floor(Date.now()/86400000) % REMINDERS.length];
  return (
    <div className="shg-no-paper shg-eq" style={{ margin:"0 16px 14px",padding:"16px 16px",borderRadius:20,textAlign:"center",fontFamily:"'Jost',sans-serif",color:"#000",position:"relative",border:"1.5px solid transparent",background:"linear-gradient(#F2ECE4,#F2ECE4) padding-box, linear-gradient(110deg,#F5E0A0,#E8B870,#BFA5D8,#2CB7A7,#167A6B) border-box",boxShadow:"0 0 20px rgba(191,165,216,.3)" }}>
      {open && <CloseX onClick={()=>setOpen(false)}/>}
      <button onClick={()=>setOpen(o=>!o)} aria-expanded={open} style={{ all:"unset",display:"block",width:"100%",cursor:"pointer" }}>
        <div style={{ fontSize:11,letterSpacing:".3em",marginBottom:6 }}>TODAY'S EQUATION</div>
        <div style={{ fontSize:"clamp(15px,4.4vw,19px)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{r.eq}</div>
        <div style={{ fontSize:13,marginTop:6 }}>{open ? "Tap to close ⌃" : "Tap me to open ›"}</div>
      </button>
      {open && (
        <div style={{ marginTop:14,textAlign:"center",maxHeight:"55vh",overflowY:"auto",WebkitOverflowScrolling:"touch",animation:"shg-spin-in .6s cubic-bezier(.2,.8,.2,1) both",paddingRight:4 }}>
          <EqLoop eq={r.eq}/>
          {r.body.map(([h,t])=>(
            <div key={h} style={{ marginBottom:10,padding:"12px 14px",borderRadius:14,border:"1px solid #000",background:"#fff",textAlign:"left" }}>
              <div style={{ fontSize:11,letterSpacing:".22em",textTransform:"uppercase",marginBottom:4 }}>{h}</div>
              <div style={{ fontSize:15,fontWeight:300,lineHeight:1.6 }}>{t}</div>
            </div>
          ))}
          <EqChart/>
          <div style={{ textAlign:"center",marginTop:4,paddingTop:14,borderTop:"1px solid rgba(191,165,216,.55)" }}>
            {push.subscribed ? <div style={{ fontSize:14 }}>🔔 You'll receive your equation every morning</div>
              : !standalone && /iPhone|iPad/.test(navigator.userAgent) ? <div style={{ fontSize:14,lineHeight:1.5 }}>🔔 To receive your equation every day, add this app to your Home Screen first (Share › Add to Home Screen), then open it from there and tap here again.</div>
              : <button onClick={e=>{ e.stopPropagation(); if (!userId) { alert("Sign in to receive your daily equation."); return; } push.subscribe(); }} style={{ background:"#000",color:"#F2ECE4",border:"none",borderRadius:999,padding:"10px 18px",fontSize:14,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>{push.loading?"Turning on…":"🔔 Receive your equation every day"}</button>}
          </div>
        </div>
      )}
      <style>{`@keyframes shg-spin-in{from{transform:rotateY(-90deg);opacity:0}to{transform:none;opacity:1}}`}</style>
    </div>
  );
}

// ── SHOP TAB ──────────────────────────────────────────────────────────────────
function ShopTab({ C }) {
  const purchase = new URLSearchParams(window.location.search).get("purchase");
  return (
    <div className="shg-no-paper" style={{ padding:"16px 16px 40px",maxWidth:1100,margin:"0 auto" }}>
      <div style={{ fontSize:22,fontWeight:400,color:C.cr,marginBottom:4 }}>Shop</div>
      <div style={{ fontSize:15,color:C.cr,marginBottom:20 }}>Workbooks, freebies and working with me</div>
      {purchase && (
        <div style={{ background:"#F2ECE4",color:"#000",borderRadius:16,padding:"16px 18px",marginBottom:18 }}>
          <div style={{ fontSize:17,marginBottom:6 }}>Thank you, it's yours ✦</div>
          <div style={{ fontSize:14,marginBottom:12 }}>Your receipt is in your email. Download your workbook here.</div>
          <a href={"/shop/download?session_id="+encodeURIComponent(purchase)} style={{ display:"inline-block",background:"#000",color:"#F2ECE4",borderRadius:999,padding:"10px 18px",fontSize:14,textDecoration:"none" }}>Download PDF</a>
        </div>
      )}
      <ShopGrid/>
      <WorkWithReshma/>
    </div>
  );
}

// ── HELPERS ────────────────────────────────────────────────────────────────────
function Sec({ title, children, C, onShowAll }) {
  return (
    <div style={{ marginBottom:24 }}>
      <div style={{ padding:"0 16px 10px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <span style={{ fontSize:18,fontWeight:400,color:C.cr }}>{title}</span>
        {onShowAll && <button onClick={onShowAll} style={{ fontSize:14,fontWeight:400,color:R,background:"none",border:"none",cursor:"pointer",fontFamily:"'Jost',sans-serif",padding:"6px 4px" }}>Show all</button>}
      </div>
      {children}
    </div>
  );
}
function HRow({ children }) {
  return <div className="hscroll-ok" style={{ display:"flex",gap:12,padding:"3px 16px 6px",overflowX:"auto",WebkitOverflowScrolling:"touch",scrollbarWidth:"none" }}>{children}</div>;
}
function TCard({ track:t, current, play, playing, isPreview, C, liked, toggleLike, openPlayer, big=false }) {
  const isP = current?.id===t.id;
  const hasAudio = !!AUDIO_URLS[t.title];
  const unavail = !hasAudio && !isPreview;
  return (
    <div style={{ flexShrink:0,width:big?"min(calc(50vw - 22px),200px)":112, opacity:unavail?0.5:1, transition:"opacity 0.2s" }}>
      <div onClick={()=>{if(hasAudio){play(t); openPlayer?.();}}} style={{ position:"relative",marginBottom:8,cursor:hasAudio?"pointer":"not-allowed",borderRadius:8,boxShadow:`0 0 0 1px ${C.border}`,fontSize:0 }}>
        <div style={{ width:"100%",aspectRatio:"1" }}><Thumb title={t.title} cat={t.cat} size="100%" radius={big?16:8}/></div>
        {unavail&&(
          <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.6)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"#fdf0e8",fontWeight:500,fontFamily:"'Jost',sans-serif",textAlign:"center",padding:"8px" }}>Coming soon</div>
        )}
        {!isPreview&&isP&&playing&&!unavail&&(
          <div style={{ position:"absolute",inset:0,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.5)" }}>
            <div style={{ display:"flex",alignItems:"flex-end",gap:2 }}>{[10,18,12,18,10].map((h,i)=><div key={i} style={{ width:3,height:h,background:["#F5E0A0","#E8B870","#BFA5D8","#2CB7A7","#167A6B"][i],borderRadius:1 }}/>)}</div>
          </div>
        )}
        {!isPreview && hasAudio && (
          <button onClick={e=>{e.stopPropagation();toggleLike(t.id,e);}} style={{ position:"absolute",bottom:6,right:6,width:26,height:26,borderRadius:"50%",background:"#000000",border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",padding:0 }}>
            <Ico.Heart on={liked?.has(t.id)}/>
          </button>
        )}
      </div>
      <div onClick={()=>{if(hasAudio){play(t); openPlayer?.();}}} style={{ fontSize:14,fontWeight:500,lineHeight:1.3,color:unavail?C.mu:C.cr,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden",minHeight:"2.6em",marginBottom:2,cursor:hasAudio?"pointer":"not-allowed" }}>{t.title}</div>
      <div style={{ fontSize:14,color:C.mu,display:"flex",alignItems:"center",gap:6 }}>{t.cat.replace("maxxing","")} · {t.dur}</div>
    </div>
  );
}

// ── ONBOARDING QUIZ ────────────────────────────────────────────────────────────
const OB_GOALS = [
  { label:"Luck & Magnetism",    cat:"Luckygirlmaxxing" },
  { label:"Love & Attraction",   cat:"Lovemaxxing" },
  { label:"Money & Abundance",   cat:"Richgirlmaxxing" },
  { label:"Confidence",          cat:"Selfmaxxing" },
  { label:"Beauty & Glow",       cat:"Beautymaxxing" },
  { label:"Sleep & Rest",        cat:"Sleepmaxxing" },
  { label:"Anxiety & Peace",     cat:"Selfmaxxing" },
  { label:"Body & Health",       cat:"Bodymaxxing" },
  { label:"Business & Purpose",  cat:"Businessmaxxing" },
  { label:"Identity Shift",      cat:"Sovereignmaxxing" },
];
const OB_SPECIFIC = [
  { label:"A specific person texting / coming back",      cat:"Lovemaxxing" },
  { label:"A sum of money arriving",                      cat:"Richgirlmaxxing" },
  { label:"A job, raise or client",                       cat:"Businessmaxxing" },
  { label:"A glow-up — skin, body, energy",               cat:"Beautymaxxing" },
  { label:"Something lucky happening out of nowhere",     cat:"Luckygirlmaxxing" },
  { label:"Peace, clarity and emotional reset",           cat:"Selfmaxxing" },
  { label:"A house, trip or material thing",              cat:"Richgirlmaxxing" },
  { label:"Becoming someone new entirely",                cat:"Sovereignmaxxing" },
  { label:"I have a list — I want all of it",             cat:"Luckygirlmaxxing" },
];
const OB_BLOCK = [
  { label:"I don't believe it's possible for me" },
  { label:"I self-sabotage when things get good" },
  { label:"I know what to do but can't make myself do it" },
  { label:"I feel like I'm behind everyone else" },
  { label:"I keep attracting the same patterns" },
  { label:"Nothing seems to stick" },
  { label:"I believe it, but I rush and cancel it out" },
  { label:"I'm consistent but nothing's moved yet" },
];
const OB_WHERE = [
  { label:"🌑 Rock bottom — starting from scratch" },
  { label:"🌒 Stuck and overwhelmed" },
  { label:"🌓 Making progress but plateaued" },
  { label:"🌔 Ready to go all in right now" },
  { label:"🌕 Already in my era, just accelerating" },
];
const OB_TIMELINE = [
  { label:"I need a shift this week",          sub:"Urgent — I'm ready" },
  { label:"Within the next 30 days",           sub:"Building steadily" },
  { label:"This is a 90-day transformation",   sub:"I'm in it for real" },
  { label:"I'm playing a long game",           sub:"Identity-level rewire" },
];
const OB_LISTEN = [
  { label:"Morning ritual ☀️",       sub:"Start the day aligned" },
  { label:"Before sleep 🌙",          sub:"Reprogram while you rest" },
  { label:"Throughout the day 🔁",    sub:"Background field shift" },
  { label:"When I need a reset ⚡",   sub:"On-demand support" },
  { label:"Multiple times a day",     sub:"I'm going all in" },
];
const OB_FORMAT = [
  { label:"Hypnosis",    sub:"Guided deep-state sessions — high impact" },
  { label:"Subliminal",  sub:"Silent or music-backed affirmations" },
  { label:"Melodic",     sub:"Music that shifts your frequency" },
  { label:"Sleep audio", sub:"Works while I rest" },
  { label:"Mix it up",   sub:"Surprise me — I trust the algorithm" },
];
const OB_FREQ = [
  { label:"Once a day" },
  { label:"2–3 times a day" },
  { label:"On loop in the background" },
  { label:"Whenever I feel called" },
];
const OB_TRIED = [
  { label:"Total beginner — never done this before" },
  { label:"I've tried affirmations but not hypnosis" },
  { label:"I've tried subliminals on YouTube" },
  { label:"I've used hypnosis apps before" },
  { label:"I'm experienced — I just want better content" },
];
const OB_BUCKET = [
  { label:"Yes — walk me through it now",      sub:"I'll add my desires before I start" },
  { label:"Maybe later — just start me",       sub:"I'll add desires as I go" },
  { label:"I already know what I want",        sub:"I'll add them myself in proofOS" },
];

function OnboardingQuiz({ step, setStep, goals, setGoals, where, setWhere, freq, setFreq, onDone, isDark, C }) {
  const [specific, setSpecific]     = useState("");
  const [block, setBlock]           = useState("");
  const [timeline, setTimeline]     = useState("");
  const [listenTime, setListenTime] = useState("");
  const [format, setFormat]         = useState("");
  const [listenFreq, setListenFreq] = useState("");
  const [tried, setTried]           = useState("");
  const [bucket, setBucket]         = useState("");
  const [voiceNote, setVoiceNote]   = useState("");
  const [recording, setRecording]   = useState(false);
  const [recDone, setRecDone]       = useState(false);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);

  const toggleGoal = (g) => setGoals(prev => prev.includes(g) ? prev.filter(x=>x!==g) : prev.length<3 ? [...prev,g] : prev);
  const TOTAL = 10;
  const grad = "linear-gradient(135deg,#F5E0A0 0%,#E8B870 14%,#BFA5D8 34%,#2CB7A7 62%,#167A6B 100%)";
  const bg   = isDark ? "#0d0d0d" : "#fff";
  const text = isDark ? "#FDF0E8" : "#111";
  const dim  = isDark ? "rgba(253,240,232,0.55)" : "#777";

  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = e => chunksRef.current.push(e.data);
      mr.onstop = () => { setRecDone(true); setRecording(false); stream.getTracks().forEach(t=>t.stop()); };
      mr.start();
      setRecording(true);
    } catch { setVoiceNote("mic_denied"); }
  };
  const stopRec = () => { if (mediaRef.current) mediaRef.current.stop(); };

  // big tappable chip for mobile
  const chip = (label, active, onClick, sub) => (
    <button key={label} onClick={onClick} style={{
      padding: sub ? "15px 18px" : "15px 18px",
      borderRadius:16, fontSize:15, fontFamily:"'Jost',sans-serif",
      cursor:"pointer", border: active ? "none" : `1px solid ${isDark?"rgba(255,255,255,0.18)":"#e0d8d0"}`,
      background: active ? grad : isDark ? "rgba(255,255,255,0.04)" : "#f8f6f3",
      color: active ? "#000" : text,
      fontWeight: active ? 600 : 400, transition:"all 0.15s",
      textAlign:"left", width:"100%", minHeight:54,
    }}>
      {label}
      {sub && <div style={{ fontSize:13, marginTop:4, opacity:0.7, fontWeight:400 }}>{sub}</div>}
    </button>
  );

  // pill wrap row for multi-select
  const pillRow = (items, selected, toggle) => (
    <div style={{ display:"flex",flexWrap:"wrap",gap:10 }}>
      {items.map(g => (
        <button key={g.label} onClick={()=>toggle(g.label)} style={{
          padding:"12px 16px", borderRadius:22, fontSize:14, fontFamily:"'Jost',sans-serif",
          cursor:"pointer", border: selected.includes(g.label) ? "none" : `1px solid ${isDark?"rgba(255,255,255,0.18)":"#e0d8d0"}`,
          background: selected.includes(g.label) ? grad : isDark ? "rgba(255,255,255,0.04)" : "#f8f6f3",
          color: selected.includes(g.label) ? "#000" : text, fontWeight: selected.includes(g.label) ? 600 : 400,
          transition:"all 0.15s", minHeight:46,
        }}>{g.label}</button>
      ))}
    </div>
  );

  const voiceStep = (
    <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
      {!recDone && !recording && voiceNote !== "mic_denied" && (
        <button onClick={startRec} style={{
          display:"flex",alignItems:"center",justifyContent:"center",gap:12,
          padding:"20px",borderRadius:18,border:"none",cursor:"pointer",
          background:grad,color:"#000",fontSize:16,fontWeight:700,fontFamily:"'Jost',sans-serif",minHeight:64,
        }}>
          <span style={{ fontSize:22 }}>🎙</span> Hold to record
        </button>
      )}
      {recording && (
        <button onClick={stopRec} style={{
          display:"flex",alignItems:"center",justifyContent:"center",gap:12,
          padding:"20px",borderRadius:18,border:"none",cursor:"pointer",
          background:"#cc3333",color:"#fff",fontSize:16,fontWeight:700,fontFamily:"'Jost',sans-serif",minHeight:64,
          animation:"pulse 1s ease-in-out infinite",
        }}>
          <span style={{ fontSize:22 }}>⏹</span> Recording… tap to stop
        </button>
      )}
      {recDone && (
        <div style={{ padding:"16px",borderRadius:14,background:isDark?"rgba(44,183,167,0.12)":"rgba(22,122,107,0.08)",border:"1px solid #2CB7A7",color:text,fontSize:14,fontFamily:"'Jost',sans-serif" }}>
          ✓ Voice note saved — we'll use this to personalise your experience.
          <button onClick={()=>{setRecDone(false);setRecording(false);}} style={{ display:"block",marginTop:8,background:"none",border:"none",color:"#2CB7A7",fontSize:13,cursor:"pointer",fontFamily:"'Jost',sans-serif",padding:0 }}>Re-record</button>
        </div>
      )}
      {voiceNote === "mic_denied" && (
        <div style={{ padding:"14px",borderRadius:14,background:isDark?"rgba(255,255,255,0.05)":"#f2ede7",color:dim,fontSize:14,fontFamily:"'Jost',sans-serif" }}>
          Mic not available — you can type it instead:
        </div>
      )}
      <textarea
        value={voiceNote === "mic_denied" ? "" : voiceNote}
        onChange={e=>setVoiceNote(e.target.value)}
        placeholder="Or type anything else you want the app to know — your dreams, what you're working through, what you really want…"
        rows={4}
        style={{
          width:"100%",padding:"14px",borderRadius:14,border:`1px solid ${isDark?"rgba(255,255,255,0.15)":"#e0d8d0"}`,
          background:isDark?"rgba(255,255,255,0.04)":"#f8f6f3",color:text,fontSize:14,
          fontFamily:"'Jost',sans-serif",resize:"none",outline:"none",lineHeight:1.6,
        }}
      />
    </div>
  );

  const steps = [
    {
      q: 1,
      title: "What's the biggest thing you're manifesting?",
      sub: "Pick up to 3. Your whole experience will be built around this.",
      content: pillRow(OB_GOALS, goals, toggleGoal),
      canNext: goals.length > 0,
      next: () => setStep(1),
    },
    {
      q: 2,
      title: "Is there something specific you're going for?",
      sub: "The more specific you are, the better we can match you.",
      content: <div style={{ display:"flex",flexDirection:"column",gap:10 }}>{OB_SPECIFIC.map(b => chip(b.label, specific===b.label, ()=>setSpecific(b.label)))}</div>,
      canNext: !!specific,
      next: () => setStep(2),
    },
    {
      q: 3,
      title: "What's your biggest block right now?",
      sub: "This is between you and the app. No judgement.",
      content: <div style={{ display:"flex",flexDirection:"column",gap:10 }}>{OB_BLOCK.map(b => chip(b.label, block===b.label, ()=>setBlock(b.label)))}</div>,
      canNext: !!block,
      next: () => setStep(3),
    },
    {
      q: 4,
      title: "Where are you right now, honestly?",
      sub: "No right answer.",
      content: <div style={{ display:"flex",flexDirection:"column",gap:10 }}>{OB_WHERE.map(w => chip(w.label, where===w.label, ()=>setWhere(w.label)))}</div>,
      canNext: !!where,
      next: () => setStep(4),
    },
    {
      q: 5,
      title: "What's your timeline?",
      sub: "This sets how we pace your tracks and intentions.",
      content: <div style={{ display:"flex",flexDirection:"column",gap:10 }}>{OB_TIMELINE.map(t => chip(t.label, timeline===t.label, ()=>setTimeline(t.label), t.sub))}</div>,
      canNext: !!timeline,
      next: () => setStep(5),
    },
    {
      q: 6,
      title: "Have you done this before?",
      sub: "Helps us calibrate what to give you first.",
      content: <div style={{ display:"flex",flexDirection:"column",gap:10 }}>{OB_TRIED.map(t => chip(t.label, tried===t.label, ()=>setTried(t.label)))}</div>,
      canNext: !!tried,
      next: () => setStep(6),
    },
    {
      q: 7,
      title: "Which format do you want to start with?",
      sub: "You can always change this in the Library.",
      content: <div style={{ display:"flex",flexDirection:"column",gap:10 }}>{OB_FORMAT.map(f => chip(f.label, format===f.label, ()=>setFormat(f.label), f.sub))}</div>,
      canNext: !!format,
      next: () => setStep(7),
    },
    {
      q: 8,
      title: "When do you want to listen?",
      sub: "We'll build your ritual around this.",
      content: <div style={{ display:"flex",flexDirection:"column",gap:10 }}>{OB_LISTEN.map(l => chip(l.label, listenTime===l.label, ()=>setListenTime(l.label), l.sub))}</div>,
      canNext: !!listenTime,
      next: () => setStep(8),
    },
    {
      q: 9,
      title: "Do you want to set up your desire list now?",
      sub: "Women who use the List Method manifest 3× faster. You can always do this later in proofOS.",
      content: <div style={{ display:"flex",flexDirection:"column",gap:10 }}>{OB_BUCKET.map(b => chip(b.label, bucket===b.label, ()=>setBucket(b.label), b.sub))}</div>,
      canNext: !!bucket,
      next: () => setStep(9),
    },
    {
      q: 10,
      title: "Anything else you want us to know?",
      sub: "Voice record your dreams, what you're working through, or what you really want. This stays private.",
      content: voiceStep,
      canNext: true,
      next: () => onDone({ specific, block, timeline, listenTime, format, listenFreq, tried, bucket, voiceNote, goals, where, freq }),
    },
  ];

  const s = steps[step];

  return (
    <div style={{ position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,0.82)",display:"flex",alignItems:"flex-end",justifyContent:"center",padding:0 }}>
      <div style={{ maxWidth:500,width:"100%",borderRadius:"24px 24px 0 0",padding:"24px 20px 40px",background:bg,boxShadow:"0 -20px 60px rgba(0,0,0,0.5)",maxHeight:"92vh",overflowY:"auto" }}>
        <div style={{ display:"flex",gap:3,marginBottom:20 }}>
          {steps.map((_,i) => (
            <div key={i} style={{ flex:1,height:3,borderRadius:2,background:i<=step?OMBRE:isDark?"rgba(255,255,255,0.12)":"#eee" }}/>
          ))}
        </div>
        <div style={{ fontSize:11,letterSpacing:"0.18em",textTransform:"uppercase",color:dim,marginBottom:8 }}>{s.q} of {TOTAL}</div>
        <div style={{ fontSize:21,fontWeight:500,color:text,marginBottom:6,lineHeight:1.3 }}>{s.title}</div>
        <div style={{ fontSize:14,color:dim,marginBottom:20,lineHeight:1.5 }}>{s.sub}</div>
        <div style={{ marginBottom:24 }}>{s.content}</div>
        <button
          onClick={s.canNext ? s.next : undefined}
          style={{
            width:"100%",padding:"18px",border:"none",borderRadius:16,fontSize:17,
            fontFamily:"'Jost',sans-serif",cursor:s.canNext?"pointer":"not-allowed",
            background:s.canNext?grad:"rgba(128,128,128,0.15)",
            color:s.canNext?"#000":"#888",fontWeight:s.canNext?700:400,transition:"all 0.2s",minHeight:58,
          }}
        >{step < TOTAL-1 ? "Continue →" : "Build my playlist →"}</button>
        {step === 0 && (
          <button onClick={onDone} style={{ display:"block",width:"100%",marginTop:14,padding:"10px",background:"none",border:"none",color:dim,fontSize:14,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
}

export default function SpotifyPortal(props) {
  let theme = props.forceTheme || "dark";
  try { theme = props.forceTheme || localStorage.getItem("shg_theme") || "dark"; } catch {}
  return (<><ShgSplash theme={theme}/><SpotifyPortalInner {...props}/></>);
}
