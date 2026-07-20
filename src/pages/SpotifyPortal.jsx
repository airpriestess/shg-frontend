import { useState, useEffect, useRef } from "react";
import AnalyticsBoard, { DEMO_ANALYTICS } from "../components/AnalyticsBoard.jsx";
import KnowledgeGuide from "../components/KnowledgeGuide.jsx";
import { ArrowIcon } from "../components/UI.jsx";
import { PushNotificationToggle, PushPromptBanner } from "../components/PushNotifications.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { supabase } from "../lib/supabase.js";

// Full Hawkins scale — 20 (Shame) → 700+ (Enlightenment)
const HAWKINS = [
  {n:"Shame",       v:20,  c:"#2a0a0a"}, // near black-red
  {n:"Guilt",       v:30,  c:"#5a0f0f"}, // deep crimson
  {n:"Apathy",      v:50,  c:"#6b6b6b"}, // flat grey
  {n:"Grief",       v:75,  c:"#4a3060"}, // deep purple-grey
  {n:"Fear",        v:100, c:"#7b3f00"}, // dark amber-brown
  {n:"Desire",      v:125, c:"#c0392b"}, // burnt red-orange
  {n:"Anger",       v:150, c:"#e67e22"}, // orange
  {n:"Pride",       v:175, c:"#f1c40f"}, // yellow
  {n:"Courage",     v:200, c:"#2ecc71"}, // green — the line
  {n:"Neutrality",  v:250, c:"#1abc9c"}, // teal-green
  {n:"Willingness", v:310, c:"#3498db"}, // sky blue
  {n:"Acceptance",  v:350, c:"#2980b9"}, // deeper blue
  {n:"Reason",      v:400, c:"#9b59b6"}, // purple
  {n:"Love",        v:500, c:"#e8b870"}, // gold — SHG brand
  {n:"Joy",         v:540, c:"#f5d090"}, // champagne
  {n:"Peace",       v:600, c:"#fdf0e8"}, // cream-white
  {n:"Enlightenment",v:700,c:"#ffffff"}, // pure white
];
const dominant = (log,days) => {
  const cutoff = Date.now() - days*86400000;
  const recent = log.filter(e=>new Date(e.date).getTime()>=cutoff);
  if (!recent.length) return null;
  const avg = recent.reduce((s,e)=>s+(HAWKINS.find(h=>h.n===e.level)?.v||0),0)/recent.length;
  return HAWKINS.reduce((best,h)=>Math.abs(h.v-avg)<Math.abs(best.v-avg)?h:best,HAWKINS[0]);
};

/* ═══════════════════════════════════════════════════════════════════════
   SHG PORTAL — Full Spotify-style with:
   · Real Supabase audio playback
   · Proof threads linked to tracks + undo/edit
   · Favorites section
   · Profile avatar → stats/settings panel
   · Home win summary dashboard
   · Shop → Beacons.ai
   · Light/dark theme toggle
   ═══════════════════════════════════════════════════════════════════════ */

// ── SUPABASE AUDIO URLS ──────────────────────────────────────────────────────
const BASE = "https://qtwvslrwmreazmrdktsn.supabase.co/storage/v1/object/public/tracks/";
const AUDIO_URLS = {
  "Spoilt Goddess":           BASE + "SPOILT%20INSTAGRAM%2013.04.2026.WAV",
  "Money Finds Me First":     BASE + "29.06.2026-6.mp3",
  "10 Years Into One Hour":   BASE + "COMPRESS%2010%20YEARS%20OF%20DELAY%20INTO%20ONE%20HOUR%20EMDR%20THEN%20ECHO%2007.04.2026.mp3",
};

// ── BEACONS STORE ────────────────────────────────────────────────────────────
const BEACONS = "https://beacons.ai/reshmaoracle"; // update with exact URL

// ── THEMES ───────────────────────────────────────────────────────────────────
const THEMES = {
  dark:  { bg:"#080808", bg2:"#111111", bg3:"rgba(232,168,96,0.08)", bg4:"rgba(232,168,96,0.12)", nav:"#050505", cr:"#f2ece4", mu:"#9a8878", dim:"#5a4a40", border:"rgba(232,168,96,0.12)", inputBg:"#1a1a1a", inputCr:"#f2ece4" },
  light: { bg:"#fdf8f2", bg2:"#fffcf8", bg3:"rgba(232,168,96,0.12)", bg4:"rgba(232,168,96,0.22)", nav:"rgba(253,248,242,0.97)", cr:"#1a1008", mu:"#8a6840", dim:"#b89060", border:"rgba(180,104,48,0.18)", inputBg:"rgba(180,104,48,0.08)", inputCr:"#1a1008" },
};

const R = "#e8b870", P = "#d4a090";
const OMBRE = "linear-gradient(135deg,#f5e0a0 0%,#e8b870 22%,#d4a090 48%,#c4789a 72%,#B76E79 100%)";

// Per-tab subtle wash — black/gold "color experience," varying only by gold intensity per tab. No pink or rose on the dashboard.
// Dark theme: near-black fading to a faint gold tint, so content stays readable.
// Light theme: cream fading to a soft champagne pastel.
const TAB_WASH = {
  home:    { dark: "linear-gradient(180deg,#0f0f0f 0%,#1a1710 55%,#0f0f0f 100%)",  light: "#fdf8f2" },
  search:  { dark: "linear-gradient(180deg,#0f0f0f 0%,#181510 55%,#0f0f0f 100%)",  light: "#fdf8f2" },
  library: { dark: "linear-gradient(180deg,#0f0f0f 0%,#1c180e 55%,#0f0f0f 100%)",  light: "#fdf8f2" },
  proof:   { dark: "linear-gradient(180deg,#0f0f0f 0%,#1e190f 55%,#0f0f0f 100%)",  light: "#fdf8f2" },
  shop:    { dark: "linear-gradient(180deg,#0f0f0f 0%,#191510 55%,#0f0f0f 100%)",  light: "#fdf8f2" },
};

// ── STOCK IMAGES ─────────────────────────────────────────────────────────────
const IMGS = {
  "Spoilt Goddess":           { url:"https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&h=200&fit=crop&auto=format", g:"#fce4c0,#e8a860" },
  "He Finds His Way Back":    { url:"https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=200&h=200&fit=crop&auto=format", g:"#fce4c0,#e8a860" },
  "Money Finds Me First":     { url:"https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=200&h=200&fit=crop&auto=format", g:"#fce4c0,#e8a860" },
  "While I Sleep I Manifest": { url:"https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=200&h=200&fit=crop&auto=format", g:"#fce4c0,#e8a860" },
  "Gorgeous Is My Default":   { url:"https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=200&h=200&fit=crop&auto=format", g:"#fce4c0,#e8a860" },
  "DNA Activation Ceremony":  { url:"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=200&h=200&fit=crop&auto=format", g:"#fce4c0,#e8a860" },
  "Lucky Girl Summer":        { url:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&auto=format", g:"#fce4c0,#e8a860" },
  "10 Years Into One Hour":   { url:"https://images.unsplash.com/photo-1496715976403-f5c7c1a1d064?w=200&h=200&fit=crop&auto=format", g:"#fce4c0,#e8a860" },
  "Highest Timeline":         { url:"https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=200&h=200&fit=crop&auto=format", g:"#fce4c0,#e8a860" },
};

const CAT_ICONS = {
  Lovemaxxing: { accent:"#c4789a", icon:'<path d="M30 52 C14 42 10 30 18 24 C24 19 30 23 30 30 C30 23 36 19 42 24 C50 30 46 42 30 52 Z" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linejoin="round"/>' },
  Beautymaxxing: { accent:"#f5e0a0", icon:'<path d="M30 20 C24 20 20 24 20 29 C20 33 23 36 27 36 C24 38 23 42 25 46 C22 44 20 40 21 35 C16 34 13 30 13 25 C13 19 18 14 24 14 C27 14 29 15.5 30 17 C31 15.5 33 14 36 14 C42 14 47 19 47 25 C47 30 44 34 39 35 C40 40 38 44 35 46 C37 42 36 38 33 36 C37 36 40 33 40 29 C40 24 36 20 30 20 Z" fill="currentColor" opacity="0.9"/><path d="M30 46 L30 54 M25 50 Q30 48 35 50" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>' },
  Facemaxxing: { accent:"#e8c088", icon:'<ellipse cx="30" cy="30" rx="16" ry="20" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="24" cy="26" r="2" fill="currentColor"/><circle cx="36" cy="26" r="2" fill="currentColor"/><path d="M24 38 Q30 42 36 38" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>' },
  Bodymaxxing: { accent:"#e8b870", icon:'<circle cx="30" cy="14" r="6" fill="none" stroke="currentColor" stroke-width="3"/><path d="M30 20 L30 38 M20 26 L40 26 M30 38 L22 50 M30 38 L38 50" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' },
  Skinnymaxxing: { accent:"#e8a860", icon:'<path d="M22 14 Q30 10 38 14 L36 26 Q30 22 24 26 Z" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M24 26 Q22 38 26 48 L34 48 Q38 38 36 26" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>' },
  Moneymaxxing: { accent:"#e8b870", icon:'<circle cx="30" cy="30" r="17" fill="none" stroke="currentColor" stroke-width="3"/><path d="M30 20 L30 40 M25 24 Q25 20 30 20 Q35 20 35 24 Q35 28 30 28 Q25 28 25 32 Q25 36 30 36 Q35 36 35 32" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>' },
  Businessmaxxing: { accent:"#e8b870", icon:'<rect x="14" y="24" width="32" height="20" rx="3" fill="none" stroke="currentColor" stroke-width="3"/><path d="M22 24 L22 18 Q22 15 25 15 L35 15 Q38 15 38 18 L38 24" fill="none" stroke="currentColor" stroke-width="3"/>' },
  Careermaxxing: { accent:"#e8b870", icon:'<path d="M16 44 L16 32 L24 32 L24 44 M28 44 L28 24 L36 24 L36 44 M40 44 L40 16 L48 16 L48 44" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' },
  DNAmaxxing: { accent:"#d4a090", icon:'<path d="M20 12 Q30 20 20 28 Q10 36 20 44 Q30 52 20 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" transform="translate(10,0)"/><path d="M40 12 Q30 20 40 28 Q50 36 40 44 Q30 52 40 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" transform="translate(-10,0)"/>' },
  Selfmaxxing: { accent:"#e8b870", icon:'<circle cx="30" cy="30" r="18" fill="none" stroke="currentColor" stroke-width="2" opacity="0.4"/><circle cx="30" cy="30" r="8" fill="currentColor"/>' },
  Erosmaxxing: { accent:"#c4789a", icon:'<path d="M30 46 C30 46 14 36 14 22 C14 15 20 12 25 15 C28 17 30 21 30 21 C30 21 32 17 35 15 C40 12 46 15 46 22 C46 36 30 46 30 46 Z" fill="currentColor" opacity="0.85"/>' },
  Singlemaxxing: { accent:"#e8b870", icon:'<circle cx="30" cy="24" r="10" fill="none" stroke="currentColor" stroke-width="3"/><path d="M30 34 L30 48" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="30" cy="24" r="3" fill="currentColor"/>' },
  Wellnessmaxxing: { accent:"#e0c090", icon:'<path d="M30 46 C16 36 12 24 20 18 C25 14 30 18 30 24 C30 18 35 14 40 18 C48 24 44 36 30 46 Z" fill="none" stroke="currentColor" stroke-width="3"/>' },
  Sleepmaxxing: { accent:"#f5e0a0", icon:'<path d="M38 16 A16 16 0 1 0 38 44 A12 12 0 0 1 38 16" fill="currentColor"/>' },
  Studymaxxing: { accent:"#e8b870", icon:'<path d="M14 22 L30 14 L46 22 L30 30 Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M14 22 L14 34 M46 22 L46 34" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' },
  Friendmaxxing: { accent:"#e8b870", icon:'<circle cx="22" cy="26" r="7" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="38" cy="26" r="7" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M12 44 Q12 34 22 34 Q26 34 28 37 Q30 34 34 34 Q44 34 44 44" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>' },
  Peacemaxxing: { accent:"#c8a870", icon:'<circle cx="30" cy="30" r="18" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3"/><path d="M18 30 Q30 20 42 30 Q30 40 18 30" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="30" cy="30" r="4" fill="currentColor"/>' },
  Confidencemaxxing: { accent:"#e8a860", icon:'<path d="M30 12 L36 24 L48 26 L39 34 L42 46 L30 40 L18 46 L21 34 L12 26 L24 24 Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>' },
  Stylemaxxing: { accent:"#e0c090", icon:'<path d="M22 16 L26 20 L30 16 L34 20 L38 16 L38 22 L34 24 L34 46 L26 46 L26 24 L22 22 Z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/>' },
  Healmaxxing: { accent:"#c4789a", icon:'<path d="M30 44 C30 44 16 34 16 22 C16 15 22 12 27 15 C29 16.5 30 19 30 19 C30 19 31 16.5 33 15 C38 12 44 15 44 22 C44 34 30 44 30 44 Z" fill="none" stroke="currentColor" stroke-width="2.5"/>' },
  Intuitionmaxxing: { accent:"#c8a870", icon:'<circle cx="30" cy="30" r="16" fill="none" stroke="currentColor" stroke-width="2" opacity="0.35"/><circle cx="30" cy="30" r="9" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="30" cy="30" r="3" fill="currentColor"/>' },
  Lifemaxxing: { accent:"#e0a868", icon:'<circle cx="30" cy="30" r="10" fill="currentColor"/><path d="M30 10 L30 4 M30 56 L30 50 M10 30 L4 30 M56 30 L50 30" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>' },
  Luckygirlmaxxing: { accent:"#e8b870", icon:'<path d="M30 30 C30 30 22 22 16 24 C11 26 11 32 16 34 C22 36 30 30 30 30 C30 30 38 22 44 24 C49 26 49 32 44 34 C38 36 30 30 30 30" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="30" cy="30" r="3" fill="currentColor"/>' },
  Sovereignmaxxing: { accent:"#e8b870", icon:'<path d="M14 40 L14 24 L22 32 L30 16 L38 32 L46 24 L46 40 Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>' },
};

function Thumb({ title, cat, size=48, radius=4 }) {
  const c = CAT_ICONS[cat] || { accent:"#e8a860", icon:'<circle cx="30" cy="30" r="14" fill="none" stroke="currentColor" stroke-width="3"/>' };
  return (
    <div style={{ width:size, height:size, borderRadius:radius, flexShrink:0, overflow:"hidden", background:"#000", position:"relative", display:"flex", alignItems:"center", justifyContent:"center", color:c.accent }}>
      <svg width={Math.round(size*0.55)} height={Math.round(size*0.55)} viewBox="0 0 60 60" dangerouslySetInnerHTML={{ __html: c.icon }} />
    </div>
  );
}

// ── TRACK DATA ────────────────────────────────────────────────────────────────
// Category-level shift/benefit templates — used as a fallback description for tracks
// that don't have a hand-written desc yet. Not unique per track, but genuinely tailored
// per category so it's honest content, not generic filler repeated everywhere.
// Guide names per category, shown as "Related guide" in each track's description.
// SHOP_URL is the general storefront for now — swap in real per-product URLs here
// once individual guide listings exist (e.g. GUIDE_URLS["Moneymaxxing"] = "https://...").
const SHOP_URL = "https://beacons.ai/reshmaoracle";
const CAT_GUIDE = {
  Lovemaxxing:"Lovemaxxing Guide", Selfmaxxing:"Selfmaxxing Guide", Moneymaxxing:"Moneymaxxing Guide",
  Sleepmaxxing:"Sleepmaxxing Guide", Beautymaxxing:"Beautymaxxing Guide", DNAmaxxing:"DNAmaxxing Guide",
  Luckygirlmaxxing:"Luckygirlmaxxing Guide", Healmaxxing:"Healmaxxing Guide", Sovereignmaxxing:"Sovereignmaxxing Guide",
  Lifemaxxing:"Lifemaxxing Guide", Erosmaxxing:"Erosmaxxing Guide", Bodymaxxing:"Bodymaxxing Guide",
  Facemaxxing:"Facemaxxing Guide", Businessmaxxing:"Businessmaxxing Guide", Skinnymaxxing:"Skinnymaxxing Guide",
  Wellnessmaxxing:"Wellnessmaxxing Guide", Studymaxxing:"Studymaxxing Guide", Friendmaxxing:"Friendmaxxing Guide",
  Peacemaxxing:"Peacemaxxing Guide", Confidencemaxxing:"Confidencemaxxing Guide", Stylemaxxing:"Stylemaxxing Guide",
  Intuitionmaxxing:"Intuitionmaxxing Guide", Careermaxxing:"Careermaxxing Guide",
};
const CAT_DESC = {
  Lovemaxxing: { shift:"This shifts you from feeling like you have to chase, prove, or wonder where you stand — into feeling like the security you want is already yours.",
    benefits:["Stop checking your phone for reassurance","Release anxious attachment patterns","Feel chosen without needing constant proof"] },
  Selfmaxxing: { shift:"This shifts you from shrinking to fit into rooms, into taking up the space you were always allowed to take.",
    benefits:["Stop over-explaining your boundaries","Build quiet, unshakeable self-trust","Feel like yourself even under pressure"] },
  Moneymaxxing: { shift:"This shifts you from feeling like money is something you have to fight for, into feeling like it's already looking for you.",
    benefits:["Loosen the grip of financial anxiety","Notice unexpected income without shock","Build the identity of someone money flows toward"] },
  Sleepmaxxing: { shift:"This shifts you from feeling like manifestation takes constant conscious effort, into feeling like your reality rebuilds itself while you're unconscious.",
    benefits:["Turn sleep into productive reprogramming time","Reduce pressure to 'do the work' every waking hour","Wake up already closer to who you're becoming"] },
  Beautymaxxing: { shift:"This shifts you from picking yourself apart in the mirror, into actually seeing what other people already see.",
    benefits:["Quiet the inner critic before it starts","Stop comparing your reflection to old photos","Let compliments land instead of deflecting them"] },
  DNAmaxxing: { shift:"This shifts you from feeling like ageing and genetics are happening to you, into feeling like your body is listening to what you tell it.",
    benefits:["Support your body's natural repair rhythms","Shift the belief that decline is inevitable","Feel more at home in your own skin"] },
  Luckygirlmaxxing: { shift:"This shifts you from feeling like good things happen to other people, into expecting things to work out for you by default.",
    benefits:["Notice small wins you'd normally dismiss","Stop bracing for the worst-case outcome","Build the identity of someone things go right for"] },
  Healmaxxing: { shift:"This shifts you from carrying old pain as part of your identity, into feeling like the version of you that's already moved through it.",
    benefits:["Process without having to relive every detail","Loosen the grip of stories that no longer serve you","Feel lighter without needing a reason why"] },
  Sovereignmaxxing: { shift:"This shifts you from seeking approval before you act, into trusting your own judgement as enough.",
    benefits:["Stop outsourcing decisions that are yours to make","Feel settled being disliked by the wrong people","Build a quieter, steadier inner authority"] },
  Lifemaxxing: { shift:"This shifts you from waiting for your life to start, into feeling like you're already living the version you used to dream about.",
    benefits:["Notice how far you've already come","Stop postponing joy for 'someday'","Feel present in a life that's actually yours"] },
  Erosmaxxing: { shift:"This shifts you from performing confidence, into actually feeling it — especially in the moments that used to make you shrink.",
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
  Careermaxxing: { shift:"This shifts you from waiting to be picked, into feeling like the promotion is already yours to claim.",
    benefits:["Reduce the anxiety of being overlooked","Speak up for what you're actually worth","Feel confident taking up space in the room"] },
};
function getDesc(track) {
  return track.desc || CAT_DESC[track.cat] || { shift:"This track is designed to shift the belief underneath the desire it's tied to.", benefits:["Reprogram the belief, not just the behaviour","Listen passively — no active effort required","Track the shift in ProofOS as signs come in"] };
}

const TRACKS = [
  { id:1,  title:"Spoilt Goddess",           artist:"Reshma Oracle", dur:"4:32",  cat:"Selfmaxxing", format:"Melodic House", tier:"audio",   isNew:true,  hasAudio:true,
    desc:{ shift:"This shifts you from feeling like you have to earn good things happening to you, into feeling like you're already the woman everyone wants to spoil.",
      benefits:["Stop over-giving to feel worthy of receiving","Let people show up for you without guilt","Feel deserving of ease, not just effort"] } },
  { id:2,  title:"He Finds His Way Back",    artist:"Reshma Oracle", dur:"30:00", cat:"Lovemaxxing", format:"Subliminal",    tier:"audio",   isNew:false, hasAudio:false,
    desc:{ shift:"This shifts you from feeling like you have to chase, check your phone, or wonder if he still thinks about you — into feeling secure that he's already finding his way back.",
      benefits:["Stop the anxious phone-checking loop","Release the need to initiate contact first","Feel settled in the outcome instead of controlling it"] } },
  { id:3,  title:"Money Finds Me First",     artist:"Reshma Oracle", dur:"25:00", cat:"Moneymaxxing", format:"Melodic House", tier:"audio",   isNew:true,  hasAudio:true,
    desc:{ shift:"This shifts you from feeling like you have to hustle for every pound, into feeling like money is already looking for you.",
      benefits:["Loosen the grip of financial anxiety","Notice unexpected income without shock","Build the identity of someone money flows toward"] } },
  { id:4,  title:"While I Sleep I Manifest", artist:"Reshma Oracle", dur:"60:00", cat:"Sleepmaxxing", format:"Melodic Calm",  tier:"audio",   isNew:false, hasAudio:false,
    desc:{ shift:"This shifts you from feeling like manifestation requires constant conscious effort, into feeling like your reality can rebuild itself while you're unconscious.",
      benefits:["Turn sleep into productive reprogramming time","Reduce the pressure to 'do the work' every waking hour","Wake up already closer to who you're becoming"] } },
  { id:5,  title:"Gorgeous Is My Default",   artist:"Reshma Oracle", dur:"35:00", cat:"Beautymaxxing", format:"528hz",         tier:"audio",   isNew:false, hasAudio:false },
  { id:6,  title:"DNA Activation Ceremony",  artist:"Reshma Oracle", dur:"45:00", cat:"DNAmaxxing", format:"Reiki",         tier:"goddess", isNew:false, hasAudio:false },
  { id:7,  title:"Lucky Girl Summer",        artist:"Reshma Oracle", dur:"22:00", cat:"Luckygirlmaxxing", format:"Subliminal", tier:"audio", isNew:true,  hasAudio:false },
  { id:8,  title:"10 Years Into One Hour",   artist:"Reshma Oracle", dur:"58:00", cat:"Healmaxxing", format:"EMDR",          tier:"audio",   isNew:false, hasAudio:true  },
  { id:9,  title:"Highest Timeline",         artist:"Reshma Oracle", dur:"28:00", cat:"Sovereignmaxxing", format:"Reiki",         tier:"goddess", isNew:false, hasAudio:false },
  { id:10, title:"My face is his favourite view", artist:"Reshma Oracle", dur:"20:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:11, title:"Even my details are exquisite", artist:"Reshma Oracle", dur:"15:00", cat:"Beautymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:12, title:"My mornings open like a film I star in", artist:"Reshma Oracle", dur:"15:00", cat:"Lifemaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:13, title:"Youth keeps renewing its lease in my body", artist:"Reshma Oracle", dur:"15:00", cat:"DNAmaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:14, title:"His eyes follow me around the room", artist:"Reshma Oracle", dur:"15:00", cat:"Erosmaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:15, title:"I make rich decisions on instinct", artist:"Reshma Oracle", dur:"15:00", cat:"Moneymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:16, title:"I chose me first and he followed", artist:"Reshma Oracle", dur:"20:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:17, title:"I take up space like it was saved for me", artist:"Reshma Oracle", dur:"15:00", cat:"Selfmaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:18, title:"Every season of my life outdoes the last", artist:"Reshma Oracle", dur:"15:00", cat:"Lifemaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:19, title:"I am the vision board breathing", artist:"Reshma Oracle", dur:"15:00", cat:"Lifemaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:20, title:"Loving me is the easiest thing he does", artist:"Reshma Oracle", dur:"15:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:21, title:"My body and I are in perfect agreement", artist:"Reshma Oracle", dur:"15:00", cat:"Bodymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:22, title:"Barefaced is my boldest look", artist:"Reshma Oracle", dur:"15:00", cat:"Beautymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:23, title:"My skin is clear calm and committed", artist:"Reshma Oracle", dur:"15:00", cat:"Facemaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:24, title:"Every day is a payday somewhere in my life", artist:"Reshma Oracle", dur:"15:00", cat:"Moneymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:25, title:"Peace is my personality now", artist:"Reshma Oracle", dur:"15:00", cat:"Selfmaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:26, title:"His actions and his words tell the same story", artist:"Reshma Oracle", dur:"15:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:27, title:"The right audience found me and keeps growing", artist:"Reshma Oracle", dur:"20:00", cat:"Businessmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:28, title:"My name gets drawn from every hat", artist:"Reshma Oracle", dur:"15:00", cat:"Luckygirlmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:29, title:"My biology takes orders from my imagination", artist:"Reshma Oracle", dur:"15:00", cat:"DNAmaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:30, title:"My face belongs in campaigns and it knows it", artist:"Reshma Oracle", dur:"15:00", cat:"Facemaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:31, title:"My body is the outfit and everything else is accessories", artist:"Reshma Oracle", dur:"15:00", cat:"Bodymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:32, title:"Love and money arrived holding hands", artist:"Reshma Oracle", dur:"20:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:33, title:"Every area of my life said yes at the same time", artist:"Reshma Oracle", dur:"15:00", cat:"Lifemaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:34, title:"Another zero joined my account balance", artist:"Reshma Oracle", dur:"15:00", cat:"Moneymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
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
  { id:47, title:"My standards raised and money rose to meet them", artist:"Reshma Oracle", dur:"15:00", cat:"Moneymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:48, title:"Compliments follow me like perfume", artist:"Reshma Oracle", dur:"15:00", cat:"Beautymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:49, title:"My cells drink light like champagne", artist:"Reshma Oracle", dur:"15:00", cat:"DNAmaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:50, title:"I live in the home I once screenshotted", artist:"Reshma Oracle", dur:"15:00", cat:"Moneymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:51, title:"He looks at me like I hung the moon", artist:"Reshma Oracle", dur:"15:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:52, title:"First class is my natural habitat", artist:"Reshma Oracle", dur:"15:00", cat:"Moneymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:53, title:"My empire pays me in freedom", artist:"Reshma Oracle", dur:"20:00", cat:"Businessmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:54, title:"I am the muse and the masterpiece", artist:"Reshma Oracle", dur:"20:00", cat:"Beautymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:55, title:"My body sculpts itself while I rest", artist:"Reshma Oracle", dur:"15:00", cat:"Bodymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:56, title:"My face is my fortune and it keeps appreciating", artist:"Reshma Oracle", dur:"20:00", cat:"Facemaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:57, title:"Every cell in me is tuned to gorgeous", artist:"Reshma Oracle", dur:"15:00", cat:"DNAmaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:58, title:"Wealth is written into my name", artist:"Reshma Oracle", dur:"15:00", cat:"Moneymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:59, title:"He looks at me like I hung the moon", artist:"Reshma Oracle", dur:"15:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:60, title:"My inner world is a luxury residence", artist:"Reshma Oracle", dur:"15:00", cat:"Selfmaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:61, title:"I fall asleep loved and wake up chosen", artist:"Reshma Oracle", dur:"20:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:62, title:"I am lucky in love specifically", artist:"Reshma Oracle", dur:"20:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:63, title:"My side profile is a masterpiece", artist:"Reshma Oracle", dur:"15:00", cat:"Facemaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:64, title:"My whole life entered its golden era", artist:"Reshma Oracle", dur:"15:00", cat:"Lifemaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:65, title:"I am the CEO of a business that adores me", artist:"Reshma Oracle", dur:"20:00", cat:"Businessmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:66, title:"The best outcomes are reserved under my name", artist:"Reshma Oracle", dur:"15:00", cat:"Luckygirlmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:67, title:"I am the woman I answer to", artist:"Reshma Oracle", dur:"15:00", cat:"Selfmaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:68, title:"I am on the payroll of the universe", artist:"Reshma Oracle", dur:"15:00", cat:"Moneymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:69, title:"Golden hour follows me around", artist:"Reshma Oracle", dur:"15:00", cat:"Beautymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:70, title:"My curves arrived exactly as ordered", artist:"Reshma Oracle", dur:"15:00", cat:"Bodymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:71, title:"I am his peace and his favourite place", artist:"Reshma Oracle", dur:"15:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:72, title:"Money multiplies the moment it reaches my hands", artist:"Reshma Oracle", dur:"15:00", cat:"Moneymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:73, title:"Vitality pours through every cell of me", artist:"Reshma Oracle", dur:"15:00", cat:"DNAmaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:74, title:"My body speaks a language everyone wants to learn", artist:"Reshma Oracle", dur:"15:00", cat:"Erosmaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:75, title:"My body moves like it knows it is admired", artist:"Reshma Oracle", dur:"15:00", cat:"Bodymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:76, title:"My eyes are the first thing people fall for", artist:"Reshma Oracle", dur:"15:00", cat:"Beautymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:77, title:"He closes the distance and comes back to me", artist:"Reshma Oracle", dur:"20:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:78, title:"He spoils me because he adores me", artist:"Reshma Oracle", dur:"15:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:79, title:"I am the name they put on the waitlist for", artist:"Reshma Oracle", dur:"20:00", cat:"Businessmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:80, title:"I wake up inside the life I used to dream about", artist:"Reshma Oracle", dur:"15:00", cat:"Lifemaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:81, title:"The universe treats me like its favourite", artist:"Reshma Oracle", dur:"15:00", cat:"Luckygirlmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:82, title:"Money is calm and safe in my life now", artist:"Reshma Oracle", dur:"15:00", cat:"Moneymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:83, title:"A large sum is already on its way to me", artist:"Reshma Oracle", dur:"15:00", cat:"Moneymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:84, title:"My face looks lifted sculpted and snatched", artist:"Reshma Oracle", dur:"15:00", cat:"Facemaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:85, title:"He wants forever and he says so out loud", artist:"Reshma Oracle", dur:"20:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:86, title:"My phone lights up and it is always him", artist:"Reshma Oracle", dur:"15:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:87, title:"Certainty is my natural state now", artist:"Reshma Oracle", dur:"15:00", cat:"Selfmaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:88, title:"My body runs light and burns bright", artist:"Reshma Oracle", dur:"15:00", cat:"Bodymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:89, title:"I won the genetic lottery and it shows", artist:"Reshma Oracle", dur:"15:00", cat:"DNAmaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:90, title:"Every light turns green when I arrive", artist:"Reshma Oracle", dur:"15:00", cat:"Luckygirlmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:91, title:"Every room notices the moment I walk in", artist:"Reshma Oracle", dur:"15:00", cat:"Beautymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:92, title:"I am the rich woman I decided to become", artist:"Reshma Oracle", dur:"20:00", cat:"Moneymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:93, title:"I wake up prettier than the day before", artist:"Reshma Oracle", dur:"15:00", cat:"Facemaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:94, title:"He cannot get me out of his head", artist:"Reshma Oracle", dur:"15:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:95, title:"I glow up and he falls deeper", artist:"Reshma Oracle", dur:"20:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:96, title:"Unexpected money keeps finding me", artist:"Reshma Oracle", dur:"15:00", cat:"Moneymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:97, title:"My hair is thick and my glow is loud", artist:"Reshma Oracle", dur:"15:00", cat:"Beautymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:98, title:"I am my own favourite person", artist:"Reshma Oracle", dur:"15:00", cat:"Selfmaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:99, title:"Good things chase me down", artist:"Reshma Oracle", dur:"15:00", cat:"Luckygirlmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:100, title:"Money comes to me for being exactly who I am", artist:"Reshma Oracle", dur:"20:00", cat:"Businessmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:101, title:"Everything I touch turns golden", artist:"Reshma Oracle", dur:"15:00", cat:"Lifemaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:102, title:"Nothing outside me decides how I feel about me", artist:"Reshma Oracle", dur:"15:00", cat:"Selfmaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:103, title:"My body is becoming its most beautiful shape", artist:"Reshma Oracle", dur:"15:00", cat:"Bodymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:104, title:"Everything works out in my favour without exception", artist:"Reshma Oracle", dur:"15:00", cat:"Luckygirlmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:105, title:"He is obsessed with coming home to me", artist:"Reshma Oracle", dur:"15:00", cat:"Lovemaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
  { id:106, title:"My business is scaling while I sleep", artist:"Reshma Oracle", dur:"20:00", cat:"Businessmaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:107, title:"My face is rearranging itself into perfection", artist:"Reshma Oracle", dur:"15:00", cat:"Facemaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:108, title:"I glow like I am lit from the inside", artist:"Reshma Oracle", dur:"15:00", cat:"Beautymaxxing", format:"Self Hypnosis", freq:"528hz", tier:"audio", isNew:false, hasAudio:false },
  { id:109, title:"My cells are rewriting me younger every night", artist:"Reshma Oracle", dur:"15:00", cat:"DNAmaxxing", format:"Self Hypnosis", freq:"432hz", tier:"audio", isNew:false, hasAudio:false },
];
const FORMATS = ["All","Subliminal","Hypnosis","Melodic Hypnosis","Melodic Subliminal","Calm Hypnosis","Calm Subliminal"];

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

const INIT_THREADS = [
  { id:1, desire:"He texts me first",     days:14, done:true,  track:"He Finds His Way Back", category:"Lovemaxxing",
    feelBefore:"Anxious. Checking my phone constantly.", feelAfter:"Calm. It was always inevitable.",
    signs:[ {text:"Saw his name 3 times in one day",date:"12 Jun"}, {text:"Dreamt we were talking",date:"15 Jun"}, {text:"Screenshot — the text arrived",date:"19 Jun",img:"https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop&auto=format"}, {text:"Voice note — the moment I found out",date:"20 Jun",audio:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"} ], manifestedAt:"20 Jun" },
  { id:2, desire:"£5,000 arrives",        days:6,  done:false, track:"Money Finds Me First",  category:"Money",
    feelBefore:"Tight and worried about money.", feelAfter:"",
    signs:[ {text:"Got a random refund £180",date:"28 Jun",img:"https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=400&fit=crop&auto=format"}, {text:"Found £20 in my coat pocket",date:"1 Jul"} ] },
  { id:3, desire:"10k per day business",  days:9,  done:false, track:"Spoilt Goddess",        category:"Money",
    feelBefore:"Doubtful but hopeful.", feelAfter:"",
    signs:[ {text:"Two new enquiries the same day",date:"30 Jun"} ] },
  { id:4, desire:"Skin visibly glowing",  days:3,  done:false, track:"Gorgeous Is My Default",category:"Beauty",
    feelBefore:"Self-conscious without makeup.", feelAfter:"",
    signs:[ {text:"Colleague asked what I changed",date:"2 Jul"} ] },
];

// Category → proof wall colours (matches landing Proof Wall)
const CAT_GRAD = { "Lovemaxxing":"linear-gradient(135deg,#f5e0a0,#e8b870)", "Money":"linear-gradient(135deg,#e8b870,#d4a090)", "Beauty":"linear-gradient(135deg,#f5e0a0,#e8b870)", "Identity":"linear-gradient(135deg,#e8b870,#c4789a)", "DNA":"linear-gradient(135deg,#d4a090,#c4789a)", "Sleep":"linear-gradient(135deg,#c4789a,#B76E79)" };
const CAT_COLOR = { "Lovemaxxing":"#e8b870", "Money":"#e8b870", "Beauty":"#e8b870", "Identity":"#c4789a", "DNA":"#c4789a", "Sleep":"#B76E79", "Beautymaxxing":"#e8b870", "Facemaxxing":"#d4a090", "Bodymaxxing":"#e8b870", "Moneymaxxing":"#e8b870", "Businessmaxxing":"#d4a090", "DNAmaxxing":"#c4789a", "Selfmaxxing":"#c4789a", "Erosmaxxing":"#B76E79", "Lifemaxxing":"#e8b870", "Luckygirlmaxxing":"#e8b870", "Sovereignmaxxing":"#B76E79" };

// ── SVG ICONS ────────────────────────────────────────────────────────────────
const Ico = {
  Home:   ({a,c})=><svg width="22" height="22" viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" fill={a?c||"#fff":"none"} stroke={a?c||"#fff":"#727272"} strokeWidth="1.8"/></svg>,
  Search: ({a,c})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?c||"#fff":"#727272"} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Lib:    ({a,c})=><svg width="22" height="22" viewBox="0 0 24 24" fill={a?c||"#fff":"#727272"}><path d="M3 3h4v18H3zM9 3h2v18H9zM14 3l7 2.5v13L14 21z"/></svg>,
  Proof:  ({a})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?R:"#727272"} strokeWidth="1.8" strokeLinecap="round"><path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2h9"/></svg>,
  Play:   ({dark})=><svg width="18" height="18" viewBox="0 0 24 24" fill={dark?"#000":"#fff"}><polygon points="6 3 20 12 6 21"/></svg>,
  Pause:  ({dark})=><svg width="18" height="18" viewBox="0 0 24 24" fill={dark?"#000":"#fff"}><rect x="6" y="4" width="4" height="16" rx="1.5"/><rect x="14" y="4" width="4" height="16" rx="1.5"/></svg>,
  Heart:  ({on})=><svg width="18" height="18" viewBox="0 0 24 24" fill={on?R:"none"} stroke={on?R:"#727272"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l7.84-7.84 1.06-1.06a5.5 5.5 0 000-7.72z"/></svg>,
  Lock:   ()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={R} strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  Edit:   ({c})=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||"#727272"} strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Undo:   ({c})=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c||"#727272"} strokeWidth="2" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>,
  Star:   ({on,c})=><svg width="16" height="16" viewBox="0 0 24 24" fill={on?P:"none"} stroke={on?P:c||"#727272"} strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Cog:    ({c})=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c||"#727272"} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  Book:   ({c})=><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c||"#727272"} strokeWidth="1.8" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
  Shop:   ({a,c})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?c||"#fff":"#727272"} strokeWidth="1.8" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
  Stats:  ({a,c})=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?c||"#fff":"#727272"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
};

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function SpotifyPortal({ onSignOut, isPreview=false, forceMode=null, forceTheme=null, initialTab="home", userTier="audio", userName="you" }) {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const [pushDismissed, setPushDismissed] = useState(false);
  const [tab, setTab]         = useState(initialTab);
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
  const [prog, setProg]       = useState(0);
  const [searchQ, setQ]       = useState("");
  const [libCat, setLibCat]   = useState("All");
  const [libFormat, setLibFormat] = useState("All");
  const [threads, setThreads] = useState(INIT_THREADS);
  const [theme, setTheme]     = useState(forceTheme || "dark");
  const [profileOpen, setProfileOpen] = useState(false);
  const [listenCount, setListenCount] = useState(47);
  // Seeded 30-day emotional log — dominant state trends upward on Hawkins scale
  const [emoLog, setEmoLog] = useState(()=>{
    const arr=[]; const now=Date.now();
    const path=["Fear","Fear","Desire","Anger","Pride","Pride","Courage","Neutrality","Willingness","Courage","Willingness","Acceptance","Reason","Acceptance","Love","Willingness","Acceptance","Love","Joy","Reason","Love","Love","Peace","Joy","Love","Peace","Joy","Peace","Love","Love"];
    for (let i=29;i>=0;i--) arr.push({date:new Date(now-i*86400000).toISOString().slice(0,10),level:path[29-i]});
    return arr;
  });
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

  useEffect(() => { if (forceTheme) setTheme(forceTheme); }, [forceTheme]);

  const C = THEMES[theme];
  const isDark = theme === "dark";
  const hour = new Date().getHours();
  const firstName = userName ? userName.charAt(0).toUpperCase() + userName.slice(1).split(" ")[0] : "you";
  const greet = (hour<12?"Good morning":"Good evening") + (isPreview ? "" : `, ${firstName}`);

  // ── AUDIO PLAYBACK ───────────────────────────────────────────────────────
  const play = (t) => {
    if (track.id === t.id) {
      if (!isPreview) setPlay(p => !p);
      return;
    }
    setTrack(t);
    if (!isPreview) { setPlay(true); setListenCount(n=>n+1); }
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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const update = () => {
      if (audio.duration) setProg(Math.round((audio.currentTime/audio.duration)*100));
    };
    audio.addEventListener("timeupdate", update);
    const handleEnded = () => {
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

  const [isDesktop, setDesktop] = useState(forceMode ? forceMode==="desktop" : (typeof window!=="undefined" && window.innerWidth>768));
  useEffect(()=>{
    if (forceMode) { setDesktop(forceMode==="desktop"); return; }
    const h=()=>setDesktop(window.innerWidth>768); window.addEventListener("resize",h); return()=>window.removeEventListener("resize",h);
  },[forceMode]);

  // ── PROFILE PANEL ────────────────────────────────────────────────────────
  const manifestedCount = threads.filter(t=>t.done).length;
  const thisMonth = threads.filter(t=>t.done).length; // simplified
  const [billingOpen, setBillingOpen] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [proofFilter, setProofFilter] = useState("all"); // "all" | "manifested" | "inProgress"

  const openStripePortal = async () => {
    if (isPreview) { alert("Sign up to manage your subscription."); return; }
    setPortalLoading(true);
    try {
      const { data: { session: s } } = await supabase.auth.getSession();
      const res = await fetch("https://qtwvslrwmreazmrdktsn.supabase.co/functions/v1/create-portal-session", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${s?.access_token}` },
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
      <div style={{ position:"fixed",inset:0,zIndex:998,background:"rgba(0,0,0,0.6)" }} onClick={()=>setBillingOpen(false)}/>
      <div style={{ position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:isMobile?"90%":380,maxWidth:380,background:C.bg2,border:`1px solid ${C.border}`,borderRadius:18,zIndex:999,padding:"26px 24px",fontFamily:"'Jost',sans-serif" }}>
        <div style={{ fontSize:11,color:C.mu,letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:16 }}>Your subscription</div>
        <div style={{ background:C.bg3,borderRadius:12,padding:"14px 16px",marginBottom:16 }}>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
            <span style={{ fontSize:12,color:C.mu }}>Current plan</span>
            <span style={{ fontSize:13,color:userTier==="goddess"?R:C.cr }}>{userTier==="goddess"?"Goddess Tier ✦":userTier==="lifetime"?"Lifetime ♾":"Audio Tier"}</span>
          </div>
          <div style={{ display:"flex",justifyContent:"space-between" }}>
            <span style={{ fontSize:12,color:C.mu }}>Monthly rate</span>
            <span style={{ fontSize:13,color:C.cr }}>{userTier==="goddess"?"£33/mo":userTier==="lifetime"?"£500 one-time":"£19/mo"}</span>
          </div>
        </div>
        {userTier==="audio" && (
          <div style={{ background:`${R}18`,border:`1px solid ${R}44`,borderRadius:12,padding:"14px 16px",marginBottom:14 }}>
            <div style={{ fontSize:12,color:C.cr,marginBottom:8 }}>Upgrade to Goddess Tier ✦ to unlock ProofOS and Analytics.</div>
            <div style={{ fontSize:11,color:C.mu,marginBottom:12 }}>£33/month · cancel anytime · your card on file will be charged the difference immediately</div>
            <button onClick={openStripePortal} disabled={portalLoading} style={{ width:"100%",padding:"12px",background:`linear-gradient(135deg,${OMBRE})`,border:"none",borderRadius:10,color:"#000",fontSize:13,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>
              {portalLoading ? "Opening..." : "Upgrade now — instant access ✦"}
            </button>
          </div>
        )}
        <button onClick={openStripePortal} disabled={portalLoading} style={{ width:"100%",padding:"11px",background:"none",border:`1px solid ${C.border}`,borderRadius:10,color:C.mu,fontSize:12,cursor:"pointer",fontFamily:"'Jost',sans-serif",marginBottom:8 }}>
          {portalLoading ? "Opening..." : "Manage billing, cancel or change plan →"}
        </button>
        <div style={{ fontSize:10,color:C.dim,textAlign:"center",marginBottom:12 }}>Managed securely by Stripe · your card is already saved</div>
        <button onClick={()=>setBillingOpen(false)} style={{ width:"100%",padding:"11px",background:"none",border:`1px solid ${C.border}`,borderRadius:10,color:C.mu,fontSize:13,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>Close</button>
      </div>
    </>
  );

  const ProfilePanel = () => (
    <>
      <div style={{ position:"fixed",inset:0,zIndex:998,background:"rgba(0,0,0,0.5)" }} onClick={()=>setProfileOpen(false)}/>
      <div style={{ position:"fixed",top:isMobile?0:"auto",right:0,bottom:0,width:isMobile?"100%":320,background:C.bg2,borderLeft:`1px solid ${C.border}`,zIndex:999,display:"flex",flexDirection:"column",fontFamily:"'Jost',sans-serif",overflow:"hidden" }}>
        {/* Header */}
        <div style={{ padding:"24px 20px 16px",borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:16 }}>
            <div style={{ width:56,height:56,borderRadius:"50%",background:OMBRE,backgroundSize:"200%",backgroundPosition:"left",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:400,color:"#000",flexShrink:0 }}>R</div>
            <div>
              <div style={{ fontSize:16,fontWeight:400,color:C.cr }}>Reshma Oracle</div>
              <div style={{ fontSize:12,color:C.mu }}>Goddess Tier</div>
              <div style={{ fontSize:11,color:R,fontWeight:400,marginTop:2 }}>reshma@reshmaoracle.com</div>
            </div>
          </div>
          {/* Stats row */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8 }}>
            {[[manifestedCount,"Manifested",R],[listenCount,"Listens",P],[threads.length,"Intentions",C.cr]].map(([v,l,c],i)=>(
              <div key={i} style={{ background:C.bg3,borderRadius:8,padding:"10px 6px",textAlign:"center" }}>
                <div style={{ fontSize:18,fontWeight:400,color:c }}>{v}</div>
                <div style={{ fontSize:10,color:C.mu }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Menu items */}
        <div style={{ flex:1,overflowY:"auto",padding:"8px 0" }}>
          {[
            { icon:<Ico.Book c={C.mu}/>, label:"Listening Guide", action:()=>{setShowGuide(true);setProfileOpen(false);} },
            { icon:<Ico.Edit c={C.mu}/>, label:"Edit profile", action:()=>alert("Edit profile — connect to Supabase auth") },
            { icon:<Ico.Star c={C.mu}/>, label:"Liked tracks", action:()=>{setTab("library");setLibCat("Liked");setProfileOpen(false);} },
            { icon:<Ico.Shop c={C.mu}/>, label:"Shop", action:()=>{setTab("shop");setProfileOpen(false);} },
            { icon:<Ico.Cog c={C.mu}/>, label:"Listening reminders", action:()=>alert("Coming soon: daily push reminders.\n\nThis requires the app to be installed to your home screen (iPhone: Share → Add to Home Screen) so your browser can send notifications even when SHG isn't open. We'll prompt you to enable this once it's live.") },
            { icon:<Ico.Cog c={C.mu}/>, label:"Manage subscription", action:()=>{setProfileOpen(false);setBillingOpen(true);} },
            { icon:isDark?<Ico.Cog c={C.mu}/>:<Ico.Cog c={C.mu}/>, label:`Switch to ${isDark?"light":"dark"} mode`, action:()=>{setTheme(t=>t==="dark"?"light":"dark");setProfileOpen(false);} },
          ].map((item,i)=>(
            <button key={i} onClick={item.action} style={{ display:"flex",alignItems:"center",gap:14,width:"100%",padding:"14px 20px",background:"none",border:"none",color:C.cr,fontSize:14,fontWeight:400,cursor:"pointer",textAlign:"left",fontFamily:"'Jost',sans-serif",transition:"background 0.1s" }}
              onMouseEnter={e=>e.currentTarget.style.background=C.bg3}
              onMouseLeave={e=>e.currentTarget.style.background="none"}>
              {item.icon} {item.label}
            </button>
          ))}
          <div style={{ height:1,background:C.border,margin:"8px 20px" }}/>
          <PushNotificationToggle userId={userId} C={C}/>
          <button onClick={onSignOut} style={{ display:"flex",alignItems:"center",gap:14,width:"100%",padding:"14px 20px",background:"none",border:"none",color:C.mu,fontSize:14,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>
            Sign out
          </button>
        </div>
        <button onClick={()=>setProfileOpen(false)} style={{ padding:"16px",background:"none",border:`1px solid ${C.border}`,margin:"12px 16px",borderRadius:10,color:C.mu,fontSize:13,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>Close</button>
      </div>
    </>
  );

  // ── NAV TABS ────────────────────────────────────────────────────────────
  const tabs = [
    { id:"home",      label:"Home",      I:Ico.Home   },
    { id:"search",    label:"Search",    I:Ico.Search },
    { id:"library",   label:"Library",   I:Ico.Lib    },
    { id:"proof",     label:"ProofOS",   I:Ico.Proof  },
    { id:"analytics", label:"Analytics", I:Ico.Stats  },
  ];

  const openPlayer = () => { if (isDesktop) setShowDesc(true); else setFullP(true); };
  const tabContent = (
    <>
      {tab==="home"    && <HomeTab greet={greet} firstName={firstName} track={track} play={play} liked={liked} toggleLike={toggleLike} playing={playing} isPreview={isPreview} C={C} threads={threads} listenCount={listenCount} setTab={setTab} setLibCat={setLibCat} openProfile={()=>setProfileOpen(true)} emoLog={emoLog} openGuide={()=>setShowGuide(true)} openEmoLog={()=>setShowEmoLog(true)} userTier={userTier} onUpgradeClick={()=>setBillingOpen(true)} userId={userId} pushDismissed={pushDismissed} onDismissPush={()=>setPushDismissed(true)} openPlayer={openPlayer}/>}
      {tab==="search"  && <SearchTab tracks={TRACKS} searchQ={searchQ} setQ={setQ} play={play} track={track} playing={playing} liked={liked} toggleLike={toggleLike} isPreview={isPreview} C={C} openPlayer={openPlayer}/>}
      {tab==="library" && <LibraryTab tracks={TRACKS} cat={libCat} setCat={setLibCat} libFormat={libFormat} setLibFormat={setLibFormat} play={play} track={track} liked={liked} toggleLike={toggleLike} playing={playing} isPreview={isPreview} C={C} openPlayer={openPlayer}/>}
      {tab==="proof"   && (userTier === "audio" && !isPreview ? <ProofLockedScreen C={C} onUpgrade={()=>setBillingOpen(true)} feature="ProofOS"/> : <ProofTab threads={threads} setThreads={setThreads} isPreview={isPreview} C={C} currentTrack={track} userTier={userTier} onUpgrade={()=>setBillingOpen(true)} proofFilter={proofFilter} setProofFilter={setProofFilter}/>)}
      {tab==="analytics" && (userTier === "audio" && !isPreview ? <ProofLockedScreen C={C} onUpgrade={()=>setBillingOpen(true)} feature="Analytics"/> : <AnalyticsTab threads={threads} listenCount={listenCount} isPreview={isPreview} C={C} setTab={setTab} emoLog={emoLog} theme={theme} onDrillDown={(filter)=>{ setProofFilter(filter); setTab("proof"); }} openGuide={()=>setShowGuide(true)}/>)}
      {tab==="shop"    && <ShopTab C={C}/>}
    </>
  );

  const isMobile = !isDesktop;

  // ── DESKTOP ──────────────────────────────────────────────────────────────
  if (isDesktop) return (
    <div style={{ width:"100%",height:"100vh",background:C.bg,display:"flex",flexDirection:"column",fontFamily:"'Jost',sans-serif",color:C.cr,overflow:"hidden" }}>
      <audio ref={audioRef} preload="none"/>
      {profileOpen && <ProfilePanel/>}
      {billingOpen && <BillingPanel/>}
      {showGuide && <KnowledgeGuide onClose={()=>setShowGuide(false)} C={C}/>}
      {showEmoLog && (
        <>
          <div style={{ position:"fixed",inset:0,zIndex:1000,background:"rgba(0,0,0,0.7)" }} onClick={()=>setShowEmoLog(false)}/>
          <div style={{ position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"90%",maxWidth:400,background:C.bg2,border:`1px solid ${C.border}`,borderRadius:18,zIndex:1001,padding:"22px 20px",fontFamily:"'Jost',sans-serif",maxHeight:"85vh",display:"flex",flexDirection:"column",overflow:"hidden" }}>
            <div style={{ fontSize:11,color:"#e8b870",letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:4 }}>How are you feeling right now?</div>
            <div style={{ fontSize:11,color:C.mu,marginBottom:12,lineHeight:1.6 }}>
              Select your state on the Hawkins scale.{" "}
              <span onClick={()=>{setShowEmoLog(false);setShowGuide(true);}} style={{ color:"#e8b870",cursor:"pointer",textDecoration:"underline" }}>See Guidebook ✦</span>
            </div>
            <div style={{ fontSize:9,color:"#2ecc71",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:6 }}>200+ · Expansive · Creates ✦</div>
            <div style={{ overflowY:"auto",marginBottom:10,maxHeight:190 }}>
              {HAWKINS.filter(h=>h.v>=200).slice().reverse().map(h=>(
                <div key={h.n} onClick={()=>logEmotion(h.n)}
                  style={{ display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:10,marginBottom:3,cursor:"pointer",
                    background:quickFeel===h.n?`${h.c}22`:"transparent",
                    border:`1px solid ${quickFeel===h.n?h.c:"rgba(255,255,255,0.04)"}` }}>
                  <div style={{ width:12,height:12,borderRadius:"50%",background:h.c,flexShrink:0,boxShadow:`0 0 6px ${h.c}99` }}/>
                  <span style={{ fontSize:13,color:h.c,flex:1 }}>{h.n}</span>
                  <span style={{ fontSize:11,color:C.mu }}>{h.v}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize:9,color:"#e67e22",letterSpacing:"0.2em",textTransform:"uppercase",marginBottom:6 }}>Below 200 · Contractive · Drains</div>
            <div style={{ overflowY:"auto",maxHeight:170,marginBottom:12 }}>
              {HAWKINS.filter(h=>h.v<200).slice().reverse().map(h=>(
                <div key={h.n} onClick={()=>logEmotion(h.n)}
                  style={{ display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:10,marginBottom:3,cursor:"pointer",
                    background:quickFeel===h.n?`${h.c}33`:"transparent",
                    border:`1px solid ${quickFeel===h.n?h.c:"rgba(255,255,255,0.04)"}` }}>
                  <div style={{ width:12,height:12,borderRadius:"50%",background:h.c,flexShrink:0 }}/>
                  <span style={{ fontSize:13,color:h.v>=600?"#1a1008":h.v<=30?"#9a8878":h.c,flex:1 }}>{h.n}</span>
                  <span style={{ fontSize:11,color:C.mu }}>{h.v}</span>
                </div>
              ))}
            </div>
            {quickFeel && (()=>{
              const h = HAWKINS.find(x=>x.n===quickFeel);
              return h ? (
                <div style={{ padding:"10px 14px",borderRadius:10,marginBottom:12,display:"flex",alignItems:"center",gap:10,background:`${h.c}22`,border:`1px solid ${h.c}66` }}>
                  <div style={{ width:14,height:14,borderRadius:"50%",background:h.c,flexShrink:0,boxShadow:`0 0 8px ${h.c}` }}/>
                  <div>
                    <div style={{ fontSize:13,color:C.cr }}>{h.n} · {h.v}</div>
                    <div style={{ fontSize:11,color:C.mu }}>{h.v>=200?"Expansive energy — you're creating from above the line":"Contractive energy — the audio will help lift you"}</div>
                  </div>
                </div>
              ) : null;
            })()}
            <button onClick={()=>setShowEmoLog(false)} style={{ width:"100%",padding:"11px",background:"none",border:`1px solid ${C.border}`,borderRadius:10,color:C.mu,fontSize:13,cursor:"pointer",fontFamily:"'Jost',sans-serif",flexShrink:0 }}>Close</button>
          </div>
        </>
      )}
      {showUpgradeReminder && userTier === "audio" && !isPreview && (
        <div onClick={()=>setShowUpgradeReminder(false)} style={{ position:"fixed",inset:0,zIndex:1050,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
          <div onClick={e=>e.stopPropagation()} style={{ maxWidth:380,width:"100%",borderRadius:20,padding:"28px 24px",background:"linear-gradient(135deg,#f5e0a0 0%,#e8b870 22%,#d4a090 48%,#c4789a 72%,#B76E79 100%)",textAlign:"center" }}>
            <div style={{ fontSize:11,fontWeight:400,color:"#000",letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:10,opacity:0.7 }}>Member-Exclusive · Not Open To The Public</div>
            <div style={{ fontSize:19,fontWeight:400,color:"#000",marginBottom:8 }}>10% off Goddess Tier — this once</div>
            <div style={{ fontSize:13,color:"#000",opacity:0.8,marginBottom:20,lineHeight:1.5 }}>This offer only exists because you're already a member. ProofOS, early access, and the full Guide — unlocked.</div>
            <button onClick={()=>{setShowUpgradeReminder(false); setBillingOpen(true);}} style={{ width:"100%",padding:"13px",background:"#000",border:"none",borderRadius:12,color:"#fff",fontSize:14,fontWeight:400,cursor:"pointer",fontFamily:"'Jost',sans-serif",marginBottom:10 }}>Claim 10% Off</button>
            <button onClick={()=>setShowUpgradeReminder(false)} style={{ width:"100%",padding:"8px",background:"none",border:"none",color:"#000",opacity:0.6,fontSize:12,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>Maybe later</button>
          </div>
        </div>
      )}
      {isPreview && <PreviewBanner onSignOut={onSignOut} C={C}/>}
      <div style={{ flex:1,display:"flex",overflow:"hidden" }}>
        {/* Sidebar */}
        <div style={{ width:220,background:C.bg,display:"flex",flexDirection:"column",padding:"20px 0 8px",flexShrink:0,borderRight:`1px solid ${C.border}` }}>
          <div style={{ padding:"0 20px 20px",display:"flex",alignItems:"center",gap:8 }}>
            <svg viewBox="0 0 100 100" width="22" height="22" style={{flexShrink:0}}>
              <path d="M50 20 A30 30 0 0 0 50 80" fill="none" stroke="#B76E79" strokeWidth="5" strokeLinecap="round"/>
              <path d="M50 20 A30 30 0 0 1 50 80" fill="none" stroke="#e8b870" strokeWidth="5" strokeLinecap="round"/>
            </svg>
            <span style={{fontFamily:"'Jost',sans-serif",fontStyle:"normal",fontWeight:300,fontSize:16,color:C.text}}>
              Self Hypnosis Goddess
            </span>
          </div>
          {[...tabs,{id:"shop",label:"Shop",I:Ico.Shop}].map(n=>(
            <button key={n.id} onClick={()=>setTab(n.id)}
              style={{ display:"flex",alignItems:"center",gap:14,padding:"8px 20px",background:"none",border:"none",borderLeft:tab===n.id?"2px solid #B76E79":"2px solid transparent",color:tab===n.id?"#B76E79":n.id==="proof"?"#B76E79":C.mu,fontSize:13,fontWeight:400,cursor:"pointer",textAlign:"left",width:"100%",fontFamily:"'Jost',sans-serif",transition:"color 0.15s" }}
              onMouseEnter={e=>e.currentTarget.style.color="#B76E79"}
              onMouseLeave={e=>{if(tab!==n.id)e.currentTarget.style.color=n.id==="proof"?"#B76E79":C.mu;}}>
              <n.I a={tab===n.id} c={C.cr}/> {n.label}
            </button>
          ))}
          <div style={{ height:1,background:C.border,margin:"8px 16px" }}/>
          <button onClick={()=>setShowGuide(true)} style={{ display:"flex",alignItems:"center",gap:14,padding:"8px 20px",background:"none",border:"none",borderLeft:"2px solid transparent",color:C.mu,fontSize:13,cursor:"pointer",textAlign:"left",width:"100%",fontFamily:"'Jost',sans-serif" }}
            onMouseEnter={e=>e.currentTarget.style.color="#B76E79"}
            onMouseLeave={e=>e.currentTarget.style.color=C.mu}>
            <Ico.Book c={C.mu}/> Listening Guide
          </button>
          <div style={{ height:1,background:C.border,margin:"8px 16px" }}/>
          <div style={{ padding:"0 20px 6px",fontSize:11,fontWeight:400,color:C.dim,letterSpacing:"0.12em",textTransform:"uppercase" }}>Recently played</div>
          {TRACKS.slice(0,5).map(t=>(
            <button key={t.id} onClick={()=>{play(t); setShowDesc(true);}}
              style={{ display:"flex",alignItems:"center",gap:10,padding:"5px 20px",background:"none",border:"none",color:track.id===t.id?C.cr:C.mu,fontSize:12,cursor:"pointer",width:"100%",textAlign:"left",fontFamily:"'Jost',sans-serif" }}
              onMouseEnter={e=>e.currentTarget.style.color=C.cr}
              onMouseLeave={e=>{if(track.id!==t.id)e.currentTarget.style.color=C.mu;}}>
              <div style={{ position:"relative" }}><Thumb title={t.title} cat={t.cat} size={28} radius={2}/>{isPreview&&<div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center" }}><Ico.Lock/></div>}</div>
              <span style={{ overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{t.title}</span>
            </button>
          ))}
          <div style={{ flex:1 }}/>
          <div style={{ padding:"8px 16px",display:"flex",gap:8 }}>
            <button onClick={()=>setTheme(t=>t==="dark"?"light":"dark")} style={{ flex:1,padding:"7px",background:C.bg3,border:`0.5px solid ${C.border}`,borderRadius:8,color:C.mu,fontSize:11,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>
              {isDark?"☀ Light":"☾ Dark"}
            </button>
          </div>
          <button onClick={()=>setProfileOpen(true)} style={{ margin:"0 16px 8px",padding:"8px 12px",background:C.bg3,border:`0.5px solid ${C.border}`,borderRadius:8,color:C.cr,fontSize:12,cursor:"pointer",fontFamily:"'Jost',sans-serif",display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:24,height:24,borderRadius:"50%",background:OMBRE,backgroundSize:"200%",backgroundPosition:"left",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:400,color:"#000" }}>R</div>
            Profile & Settings
          </button>
        </div>
        {/* Main */}
        <div style={{ flex:1,overflowY:"auto",background:TAB_WASH[tab]?.[isDark?"dark":"light"]||C.bg2,paddingBottom:20 }}>
          <div style={{ position:"sticky",top:0,zIndex:50,padding:"16px 24px 12px",background:C.bg2 }}>
            <div style={{ maxWidth:360,position:"relative" }}>
              <span style={{ position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:14,color:C.dim }}>⌕</span>
              <input
                value={searchQ}
                onChange={e=>{setQ(e.target.value); setTab("search");}}
                placeholder="What do you want to play?"
                style={{ width:"100%",padding:"11px 14px 11px 36px",borderRadius:24,background:C.bg3,border:`1px solid ${C.border}`,color:C.cr,fontSize:14,fontFamily:"'Jost',sans-serif",outline:"none" }}
              />
            </div>
          </div>
          {tabContent}
        </div>
      </div>
      <DesktopPlayer track={track} playing={playing} setPlay={setPlay} liked={liked} toggleLike={toggleLike} prog={prog} seekTo={seekTo} prevTrack={prevTrack} nextTrack={nextTrack} isLooping={isLooping} setLooping={setLooping} C={C} isDark={isDark} showDesc={showDesc} setShowDesc={setShowDesc}/>
    </div>
  );

  // ── MOBILE ───────────────────────────────────────────────────────────────
  return (
    <div style={{ width:"100%",height:"100vh",background:C.bg,display:"flex",flexDirection:"column",fontFamily:"'Jost',sans-serif",color:C.cr,overflow:"hidden",position:"relative" }}>
      <audio ref={audioRef} preload="none"/>
      {profileOpen && <ProfilePanel/>}
      {billingOpen && <BillingPanel/>}
      {showGuide && <KnowledgeGuide onClose={()=>setShowGuide(false)} C={C}/>}
      {isPreview && <PreviewBanner onSignOut={onSignOut} C={C}/>}
      {showUpgradeReminder && userTier === "audio" && !isPreview && (
        <div onClick={()=>setShowUpgradeReminder(false)} style={{ position:"fixed",inset:0,zIndex:1050,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}>
          <div onClick={e=>e.stopPropagation()} style={{ maxWidth:380,width:"100%",borderRadius:20,padding:"28px 24px",background:"linear-gradient(135deg,#f5e0a0 0%,#e8b870 22%,#d4a090 48%,#c4789a 72%,#B76E79 100%)",textAlign:"center" }}>
            <div style={{ fontSize:11,fontWeight:400,color:"#000",letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:10,opacity:0.7 }}>Member-Exclusive · Not Open To The Public</div>
            <div style={{ fontSize:19,fontWeight:400,color:"#000",marginBottom:8 }}>10% off Goddess Tier — this once</div>
            <div style={{ fontSize:13,color:"#000",opacity:0.8,marginBottom:20,lineHeight:1.5 }}>This offer only exists because you're already a member. ProofOS, early access, and the full Guide — unlocked.</div>
            <button onClick={()=>{setShowUpgradeReminder(false); setBillingOpen(true);}} style={{ width:"100%",padding:"13px",background:"#000",border:"none",borderRadius:12,color:"#fff",fontSize:14,fontWeight:400,cursor:"pointer",fontFamily:"'Jost',sans-serif",marginBottom:10 }}>Claim 10% Off</button>
            <button onClick={()=>setShowUpgradeReminder(false)} style={{ width:"100%",padding:"8px",background:"none",border:"none",color:"#000",opacity:0.6,fontSize:12,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>Maybe later</button>
          </div>
        </div>
      )}
      <div style={{ height:52,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px",flexShrink:0,borderBottom:`0.5px solid ${C.border}` }}>
        <span style={{ fontSize:13,fontWeight:400,color:C.cr }}>9:41</span>
        <span style={{ fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:15,fontWeight:400,background:"linear-gradient(90deg,#fce4c0,#e8a860)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>SHG</span>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <button onClick={()=>setTheme(t=>t==="dark"?"light":"dark")} style={{ width:30,height:30,borderRadius:"50%",background:"none",border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,cursor:"pointer",WebkitTapHighlightColor:"transparent" }}>{C.cr==="#ffffff"?"☀️":"🌙"}</button>
          <button onClick={()=>setProfileOpen(true)} style={{ width:34,height:34,borderRadius:"50%",background:OMBRE,backgroundSize:"200%",backgroundPosition:"left",border:"none",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:400,color:"#000",cursor:"pointer",WebkitTapHighlightColor:"transparent" }}>R</button>
        </div>
      </div>
      {/* Screen */}
      <div style={{ flex:1,overflowY:"auto",paddingBottom:!isPreview?130:60,WebkitOverflowScrolling:"touch",background:TAB_WASH[tab]?.[isDark?"dark":"light"]||"none" }}>{tabContent}</div>
      {/* Mini player */}
      {!isPreview && !fullP && (
        <div onClick={()=>setFullP(true)} style={{ position:"absolute",bottom:68,left:8,right:8,zIndex:50,background:C.bg4,borderRadius:10,display:"flex",alignItems:"center",gap:10,padding:"8px 10px",cursor:"pointer",boxShadow:`0 -4px 24px rgba(0,0,0,0.4)` }}>
          <Thumb title={track.title} cat={track.cat} size={42} radius={6}/>
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ fontSize:13,fontWeight:400,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:C.cr }}>{track.title}</div>
            <div style={{ fontSize:11,color:C.mu }}>{AUDIO_URLS[track.title]?"● Live audio":"○ Coming soon"}</div>
          </div>
          <button onClick={e=>{e.stopPropagation();toggleLike(track.id,e);}} style={{ background:"none",border:"none",padding:6,lineHeight:0 }}><Ico.Heart on={liked.has(track.id)}/></button>
          <button onClick={e=>{e.stopPropagation();setPlay(p=>!p);}} style={{ width:36,height:36,borderRadius:"50%",background:C.cr,border:"none",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:0,flexShrink:0 }}>
            {playing?<Ico.Pause dark={!isDark}/>:<Ico.Play dark={!isDark}/>}
          </button>
          <div style={{ position:"absolute",bottom:0,left:0,right:0,height:2,background:C.border,borderRadius:"0 0 10px 10px" }}>
            <div style={{ width:`${prog}%`,height:"100%",background:OMBRE,borderRadius:"0 0 0 10px",backgroundSize:"200%",backgroundPosition:"left",transition:"width 0.3s" }}/>
          </div>
        </div>
      )}
      {fullP && <MobilePlayer track={track} playing={playing} setPlay={setPlay} liked={liked} toggleLike={toggleLike} prog={prog} seekTo={seekTo} prevTrack={prevTrack} nextTrack={nextTrack} isLooping={isLooping} setLooping={setLooping} onClose={()=>setFullP(false)} C={C} isDark={isDark} hasAudio={!!AUDIO_URLS[track.title]} isPreview={isPreview}/>}
      {/* Bottom nav */}
      {!fullP && (
        <div style={{ position:"absolute",bottom:0,left:0,right:0,height:isPreview?52:68,paddingBottom:"env(safe-area-inset-bottom,0px)",boxSizing:"content-box",background:C.nav,borderTop:`0.5px solid ${C.border}`,display:"flex",zIndex:60 }}>
          {tabs.map(n=>(
            <button key={n.id} onClick={()=>setTab(n.id)} style={{ flex:1,background:"none",border:"none",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,paddingBottom:isPreview?4:6,cursor:"pointer",WebkitTapHighlightColor:"transparent" }}>
              <n.I a={tab===n.id} c={tab===n.id?"#B76E79":C.dim}/>
              <span style={{ fontSize:9,fontWeight:400,color:tab===n.id?"#B76E79":C.dim }}>{n.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── PREVIEW BANNER ────────────────────────────────────────────────────────────
function PreviewBanner({ onSignOut, C }) {
  return (
    <div style={{ background:OMBRE,backgroundSize:"200%",backgroundPosition:"left",padding:"9px 16px",textAlign:"center",flexShrink:0 }}>
      <span style={{ fontSize:12,fontWeight:400,color:"#000",fontFamily:"'Jost',sans-serif" }}>
        🔒 Preview mode — <span onClick={onSignOut} style={{ textDecoration:"underline",cursor:"pointer" }}>join to unlock all tracks</span>
      </span>
    </div>
  );
}

// ── DESKTOP PLAYER ─────────────────────────────────────────────────────────────
function DesktopPlayer({ track, playing, setPlay, liked, toggleLike, prog, seekTo, prevTrack, nextTrack, isLooping, setLooping, C, isDark, showDesc, setShowDesc }) {
  const d = getDesc(track);
  return (
    <>
    {showDesc && (
      <div style={{ position:"fixed",inset:0,zIndex:1000,background:C.bg,display:"flex",flexDirection:"column",fontFamily:"'Jost',sans-serif" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"24px 48px" }}>
          <button onClick={()=>setShowDesc(false)} style={{ background:"none",border:"none",cursor:"pointer",color:C.cr,display:"flex",alignItems:"center",gap:8,fontSize:13,fontFamily:"'Jost',sans-serif" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.cr} strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg> Back
          </button>
          <span style={{ fontSize:12,fontWeight:400,letterSpacing:"0.18em",textTransform:"uppercase",color:C.cr }}>Now Playing</span>
          <div style={{ width:60 }}/>
        </div>
        <div style={{ flex:1,overflowY:"auto",display:"flex",justifyContent:"center",padding:"20px 48px 60px" }}>
          <div style={{ display:"flex",gap:56,maxWidth:900,width:"100%",alignItems:"flex-start" }}>
            <div style={{ flexShrink:0 }}>
              <Thumb title={track.title} cat={track.cat} size={260} radius={16}/>
            </div>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ fontSize:32,fontWeight:400,color:"#f5f0e8",marginBottom:6 }}>{track.title}</div>
              <div style={{ fontSize:14,color:C.mu,marginBottom:32 }}>Reshma Oracle</div>
              <div style={{ fontSize:12,color:"#e8b870",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10 }}>The shift</div>
              <div style={{ fontSize:19,lineHeight:1.75,color:"#f5f0e8",fontWeight:400,marginBottom:32,maxWidth:560 }}>{d.shift}</div>
              <div style={{ fontSize:12,color:"#e8b870",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10 }}>Benefits</div>
              <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:32 }}>
                {d.benefits.map((b,i)=>(
                  <div key={i} style={{ display:"flex",gap:10,alignItems:"flex-start" }}>
                    <span style={{ color:"#e8b870",fontSize:15,marginTop:2 }}>✦</span>
                    <span style={{ fontSize:16,lineHeight:1.65,color:"#f5f0e8" }}>{b}</span>
                  </div>
                ))}
              </div>
              {CAT_GUIDE[track.cat] && (
                <a href={SHOP_URL} target="_blank" rel="noopener noreferrer" style={{ display:"inline-flex",alignItems:"center",gap:10,padding:"14px 22px",background:"none",border:"1px solid rgba(232,168,96,0.4)",borderRadius:12,textDecoration:"none",maxWidth:400 }}>
                  <span style={{ fontSize:20 }}>📖</span>
                  <div>
                    <div style={{ fontSize:10,color:C.mu,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:2 }}>Related guide</div>
                    <div style={{ fontSize:14,color:"#f5f0e8",fontWeight:400 }}>{CAT_GUIDE[track.cat]} →</div>
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    )}
    <div style={{ height:88,background:C.nav,borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",padding:"0 16px",gap:0,flexShrink:0 }}>
      <div style={{ width:220,display:"flex",alignItems:"center",gap:12,flexShrink:0 }}>
        <div onClick={()=>setShowDesc(true)} style={{ cursor:"pointer" }}><Thumb title={track.title} cat={track.cat} size={52} radius={4}/></div>
        <div style={{ minWidth:0, cursor:"pointer" }} onClick={()=>setShowDesc(true)}>
          <div style={{ fontSize:13,fontWeight:400,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2,color:C.cr }}>{track.title}</div>
          <div style={{ fontSize:11,color:C.mu }}>Reshma Oracle</div>
        </div>
        <button onClick={()=>setShowDesc(true)} style={{ background:"none",border:"none",lineHeight:0,padding:6,cursor:"pointer" }} title="About this track">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.mu} strokeWidth="2"><circle cx="12" cy="12" r="9"/><line x1="12" y1="16" x2="12" y2="11"/><circle cx="12" cy="8" r="0.5" fill={C.mu}/></svg>
        </button>
        <button onClick={e=>toggleLike(track.id,e)} style={{ background:"none",border:"none",lineHeight:0,padding:8 }}><Ico.Heart on={liked.has(track.id)}/></button>
      </div>
      <div style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6 }}>
        <div style={{ display:"flex",alignItems:"center",gap:20 }}>
          <span style={{ fontSize:14,color:C.dim,cursor:"pointer" }}>⇄</span>
          <button onClick={prevTrack} style={{ background:"none",border:"none",lineHeight:0,cursor:"pointer" }}><svg width="22" height="22" viewBox="0 0 24 24" fill={C.mu}><path d="M19 20L9 12l10-8v16z"/><rect x="5" y="4" width="2.5" height="16" rx="1" fill={C.mu}/></svg></button>
          <button onClick={()=>setPlay(p=>!p)} style={{ width:36,height:36,borderRadius:"50%",background:OMBRE,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",backgroundSize:"200%",backgroundPosition:"left",boxShadow:"0 2px 12px rgba(212,160,144,0.5)" }}>
            {playing?<Ico.Pause dark/>:<Ico.Play dark/>}
          </button>
          <button onClick={nextTrack} style={{ background:"none",border:"none",lineHeight:0,cursor:"pointer" }}><svg width="22" height="22" viewBox="0 0 24 24" fill={C.mu}><path d="M5 4l10 8-10 8V4z"/><rect x="16.5" y="4" width="2.5" height="16" rx="1" fill={C.mu}/></svg></button>
          <button onClick={()=>setLooping(l=>!l)} style={{ background:isLooping?"rgba(232,184,112,0.25)":"none",border:"none",borderRadius:"50%",width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:14,color:isLooping?"#e8b870":R }} aria-label="Loop" title={isLooping?"Loop on":"Loop off"}>↻</button>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:8,width:"100%",maxWidth:520 }}>
          <span style={{ fontSize:11,color:C.dim,width:32,textAlign:"right" }}>—</span>
          <div style={{ flex:1,height:4,background:C.border,borderRadius:2,cursor:"pointer" }} onClick={e=>{const r=e.currentTarget.getBoundingClientRect();seekTo(Math.round(((e.clientX-r.left)/r.width)*100),e);}}>
            <div style={{ width:`${prog}%`,height:"100%",background:OMBRE,borderRadius:2,backgroundSize:"200%",backgroundPosition:"left",transition:"width 0.3s" }}/>
          </div>
          <span style={{ fontSize:11,color:C.dim,width:32 }}>{track.dur}</span>
        </div>
      </div>
      <div style={{ width:160,display:"flex",alignItems:"center",gap:8,justifyContent:"flex-end",flexShrink:0 }}>
        <span style={{ fontSize:14,color:C.dim }}>🔊</span>
        <div style={{ width:80,height:4,background:C.border,borderRadius:2 }}><div style={{ width:"70%",height:"100%",background:C.cr,borderRadius:2 }}/></div>
      </div>
    </div>
    </>
  );
}

// ── MOBILE FULL PLAYER ────────────────────────────────────────────────────────
function MobilePlayer({ track, playing, setPlay, liked, toggleLike, prog, seekTo, prevTrack, nextTrack, isLooping, setLooping, onClose, C, isDark, hasAudio }) {
  const [view, setView] = useState("desc"); // cover | script | desc
  return (
    <div style={{ position:"absolute",inset:0,background:C.bg,zIndex:200,display:"flex",flexDirection:"column",alignItems:"center",padding:"0 28px",overflowY:"auto" }}>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",paddingTop:52,marginBottom:24 }}>
        <button onClick={onClose} style={{ background:"none",border:"none",lineHeight:0,cursor:"pointer" }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.cr} strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg></button>
        <span style={{ fontSize:12,fontWeight:400,letterSpacing:"0.18em",textTransform:"uppercase",color:C.cr }}>Now Playing</span>
        <div style={{ display:"flex",gap:10 }}>
          <button onClick={()=>setView(v=>v==="desc"?"cover":"desc")} style={{ background:"none",border:"none",lineHeight:0,cursor:"pointer" }} aria-label="About this track" title="About this track">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={view==="desc"?"#e8b870":C.cr} strokeWidth="2"><circle cx="12" cy="12" r="9"/><line x1="12" y1="16" x2="12" y2="11"/><circle cx="12" cy="8" r="0.5" fill={view==="desc"?"#e8b870":C.cr}/></svg>
          </button>
          <button onClick={()=>setView(v=>v==="script"?"cover":"script")} style={{ background:"none",border:"none",lineHeight:0,cursor:"pointer" }} aria-label="Read along" title="Read along">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={view==="script"?"#e8b870":C.cr} strokeWidth="2"><path d="M4 5h16M4 12h16M4 19h10"/></svg>
          </button>
        </div>
      </div>
      {view==="desc" ? (
        <div style={{ width:"100%",flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"20px 0" }}>
          <div style={{ fontSize:22,fontWeight:400,marginBottom:4,color:C.cr,textAlign:"center" }}>{track.title}</div>
          <div style={{ fontSize:13,color:C.mu,marginBottom:24,letterSpacing:"0.1em",textTransform:"uppercase" }}>About this track</div>
          {(() => { const d = getDesc(track); return (
            <div style={{ width:"100%",paddingBottom:40 }}>
              <div style={{ fontSize:11,color:"#e8b870",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:8 }}>The shift</div>
              <div style={{ fontSize:17,lineHeight:1.75,color:C.cr,fontWeight:400,marginBottom:24 }}>{d.shift}</div>
              <div style={{ fontSize:11,color:"#e8b870",letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:8 }}>Benefits</div>
              <div style={{ display:"flex",flexDirection:"column",gap:8,marginBottom:28 }}>
                {d.benefits.map((b,i)=>(
                  <div key={i} style={{ display:"flex",gap:10,alignItems:"flex-start" }}>
                    <span style={{ color:"#e8b870",fontSize:14,marginTop:2 }}>✦</span>
                    <span style={{ fontSize:15,lineHeight:1.6,color:C.cr }}>{b}</span>
                  </div>
                ))}
              </div>
              {CAT_GUIDE[track.cat] && (
                <a href={SHOP_URL} target="_blank" rel="noopener noreferrer" style={{ display:"flex",alignItems:"center",gap:10,padding:"14px 16px",background:"none",border:"1px solid rgba(232,168,96,0.4)",borderRadius:12,textDecoration:"none" }}>
                  <span style={{ fontSize:18 }}>📖</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:10,color:C.mu,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:2 }}>Related guide</div>
                    <div style={{ fontSize:13,color:C.cr,fontWeight:400 }}>{CAT_GUIDE[track.cat]} →</div>
                  </div>
                </a>
              )}
            </div>
          ); })()}
        </div>
      ) : view==="script" ? (
        <div style={{ width:"100%",flex:1,display:"flex",flexDirection:"column",alignItems:"center",padding:"20px 0" }}>
          <div style={{ fontSize:22,fontWeight:400,marginBottom:4,color:C.cr,textAlign:"center" }}>{track.title}</div>
          <div style={{ fontSize:13,color:C.mu,marginBottom:24 }}>Read along</div>
          <div style={{ width:"100%",fontSize:19,lineHeight:1.9,color:C.cr,fontWeight:400,textAlign:"center",whiteSpace:"pre-line",paddingBottom:40 }}>
            {track.script || "Script coming soon — this affirmation script hasn't been added yet."}
          </div>
        </div>
      ) : (
      <>
      <Thumb title={track.title} cat={track.cat} size={270} radius={14}/>
      {!hasAudio && <div style={{ marginTop:8,fontSize:11,color:C.mu,background:C.bg3,borderRadius:20,padding:"4px 12px" }}>Audio coming soon</div>}
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",marginTop:24,marginBottom:20 }}>
        <div>
          <div style={{ fontSize:22,fontWeight:400,marginBottom:4,color:C.cr }}>{track.title}</div>
          <div style={{ fontSize:14,color:C.mu }}>Reshma Oracle</div>
        </div>
        <button onClick={e=>toggleLike(track.id,e)} style={{ background:"none",border:"none",lineHeight:0 }}><Ico.Heart on={liked.has(track.id)}/></button>
      </div>
      </>
      )}
      <div style={{ width:"100%",marginBottom:8 }}>
        <div style={{ height:4,background:"#4a4a4a",borderRadius:2,cursor:"pointer" }} onClick={e=>{const r=e.currentTarget.getBoundingClientRect();seekTo(Math.round(((e.clientX-r.left)/r.width)*100),e);}}>
          <div style={{ width:`${prog}%`,height:"100%",background:OMBRE,borderRadius:2,backgroundSize:"200%",backgroundPosition:"left",position:"relative",transition:"width 0.3s" }}>
            <div style={{ position:"absolute",right:-6,top:"50%",transform:"translateY(-50%)",width:13,height:13,borderRadius:"50%",background:C.cr }}/>
          </div>
        </div>
      </div>
      <div style={{ display:"flex",justifyContent:"space-between",width:"100%",marginBottom:32 }}>
        <span style={{ fontSize:11,color:C.dim }}>—</span><span style={{ fontSize:11,color:C.dim }}>{track.dur}</span>
      </div>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%" }}>
        <span style={{ fontSize:18,color:C.dim,cursor:"pointer" }}>⇄</span>
        <button onClick={prevTrack} style={{ background:"none",border:"none",lineHeight:0,cursor:"pointer" }}><svg width="24" height="24" viewBox="0 0 24 24" fill={C.cr}><path d="M19 20L9 12l10-8v16z"/><rect x="5" y="4" width="2.5" height="16" rx="1" fill={C.cr}/></svg></button>
        <button onClick={()=>setPlay(p=>!p)} style={{ width:64,height:64,borderRadius:"50%",background:OMBRE,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",backgroundSize:"200%",backgroundPosition:"left",boxShadow:"0 4px 28px rgba(212,160,144,0.5)" }}>
          {playing?<Ico.Pause dark/>:<Ico.Play dark/>}
        </button>
        <button onClick={nextTrack} style={{ background:"none",border:"none",lineHeight:0,cursor:"pointer" }}><svg width="24" height="24" viewBox="0 0 24 24" fill={C.cr}><path d="M5 4l10 8-10 8V4z"/><rect x="16.5" y="4" width="2.5" height="16" rx="1" fill={C.cr}/></svg></button>
        <button onClick={()=>setLooping(l=>!l)} style={{ background:isLooping?"rgba(232,184,112,0.25)":"none",border:"none",borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:18,color:isLooping?"#e8b870":R }} aria-label="Loop" title={isLooping?"Loop on":"Loop off"}>↻</button>
      </div>
    </div>
  );
}

// ── HOME TAB ──────────────────────────────────────────────────────────────────
function HomeTab({ greet, firstName, track, play, liked, toggleLike, playing, isPreview, C, threads, listenCount, setTab, setLibCat, openProfile, emoLog=[], openGuide, openEmoLog, userTier="audio", onUpgradeClick, userId, pushDismissed, onDismissPush, openPlayer }) {

  const isDark = C?.bg?.startsWith("#0") || C?.bg?.startsWith("#1") || !C?.bg?.startsWith("#f");  const FEATURED_CATS = ["Lovemaxxing","Moneymaxxing","Beautymaxxing","Selfmaxxing","Luckygirlmaxxing","Businessmaxxing"];
  return (
    <div style={{ paddingBottom:80 }}>
      {/* HEADER */}
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 16px 6px" }}>
        <div>
          <div style={{ fontSize:11,color:C.mu,fontWeight:400,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:2 }}>Welcome back</div>
          <span onClick={openProfile} style={{ fontSize:22,fontWeight:400,color:C.cr,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:8,fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic" }}>
            {isPreview?"Goddess":firstName}
            <span style={{ width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#fce4c0,#e8a860)",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:400,color:"#000",fontFamily:"'Jost',sans-serif",fontStyle:"normal" }}>
              {isPreview?"G":(firstName?.[0]||"R").toUpperCase()}
            </span>
          </span>
        </div>
        <button onClick={()=>setTab("shop")} style={{ width:36,height:36,borderRadius:"50%",background:"none",border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0 }} aria-label="Shop">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.cr} strokeWidth="1.8" strokeLinecap="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        </button>
      </div>

      {/* UPGRADE BANNER */}
      {userTier==="audio"&&!isPreview&&(
        <div onClick={onUpgradeClick} style={{ margin:"12px 16px",padding:"14px 18px",borderRadius:14,background:"linear-gradient(135deg,#f5e0a0 0%,#e8b870 22%,#d4a090 48%,#c4789a 72%,#B76E79 100%)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12 }}>
          <div>
            <div style={{ fontSize:10,fontWeight:400,color:"#000",letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:3,opacity:0.7 }}>Goddess offer</div>
            <div style={{ fontSize:14,fontWeight:400,color:"#000" }}>Unlock ProofOS + Analytics — 10% off</div>
          </div>
          <div style={{ fontSize:18,color:"#000",flexShrink:0 }}>→</div>
        </div>
      )}

      {/* PUSH PROMPT */}
      {!isPreview&&!pushDismissed&&<PushPromptBanner userId={userId} C={C} onDismiss={onDismissPush}/>}

      {/* KNOWLEDGE GUIDE — all tiers */}
      <div style={{ margin:"12px 16px 4px" }}>
        <button onClick={openGuide} style={{ width:"100%", padding:"14px 16px", background:C.bg2, border:`1px solid rgba(232,184,112,0.25)`, borderRadius:14, cursor:"pointer", display:"flex", alignItems:"center", gap:12, fontFamily:"'Jost',sans-serif", textAlign:"left" }}>
          <span style={{ fontSize:20, flexShrink:0 }}>📖</span>
          <span style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:400, color:C.cr }}>Guidebook ✦</div>
            <div style={{ fontSize:11, color:C.mu, marginTop:2 }}>Hawkins scale, brainwaves, EMDR, subliminals — all explained.</div>
          </span>
          <span style={{ fontSize:18, color:"#e8b870" }}>›</span>
        </button>
      </div>

      {/* JUMP BACK IN */}
      <Sec title="Jump back in" C={C} onShowAll={()=>{setLibCat("All");setTab("library");}}>
        <HRow>
          {TRACKS.slice(0,6).map(t=><TCard key={t.id} track={t} current={track} play={play} playing={playing} isPreview={isPreview} C={C} liked={liked} toggleLike={toggleLike} openPlayer={openPlayer}/>)}
        </HRow>
      </Sec>

      {/* MADE FOR YOU */}
      <div style={{ padding:"0 16px 8px" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
          <span style={{ fontSize:16,fontWeight:400,color:C.cr }}>Made for you</span>
          <button onClick={()=>setTab("library")} style={{ fontSize:12,color:C.mu,background:"none",border:"none",cursor:"pointer",fontFamily:"'Jost',sans-serif",fontWeight:400 }}>See all</button>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
          {FEATURED_CATS.map(cat=>{
            const c=CAT_ICONS[cat]||{accent:"#e8a860",icon:''};
            const n=TRACKS.filter(t=>t.cat===cat).length;
            return(
              <button key={cat} onClick={()=>{setLibCat(cat);setTab("library");}} style={{ background:`linear-gradient(135deg,${isDark?"#0a0a0a":C.bg2} 0%,${c.accent}20 100%)`,border:`1px solid ${c.accent}33`,borderRadius:12,padding:"12px",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:10,fontFamily:"'Jost',sans-serif" }}>
                <div style={{ width:38,height:38,borderRadius:8,background:`linear-gradient(135deg,${c.accent}33,${c.accent}66)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:c.accent }}>
                  <svg width="20" height="20" viewBox="0 0 60 60" dangerouslySetInnerHTML={{__html:c.icon}}/>
                </div>
                <div>
                  <div style={{ fontSize:12,fontWeight:400,color:C.cr,lineHeight:1.2 }}>{cat.replace("maxxing","")}</div>
                  <div style={{ fontSize:10,color:C.mu,marginTop:2 }}>{n} tracks</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* YOUR FAVOURITES */}
      <Sec title="Your favourites ♡" C={C} onShowAll={()=>{setLibCat("Liked");setTab("library");}}>
        {TRACKS.filter(t=>liked.has(t.id)).length===0
          ?<div style={{ padding:"14px 16px",background:C.bg3,borderRadius:12,fontSize:12,color:C.mu,fontWeight:400 }}>Tap the ♡ on any track — it lives here.</div>
          :<HRow>{TRACKS.filter(t=>liked.has(t.id)).map(t=><TCard key={t.id} track={t} current={track} play={play} playing={playing} isPreview={isPreview} C={C} liked={liked} toggleLike={toggleLike} openPlayer={openPlayer}/>)}</HRow>}
      </Sec>

      {/* NEW THIS WEEK */}
      <Sec title="New this week ✦" C={C} onShowAll={()=>{setLibCat("All");setTab("library");}}>
        <HRow>
          {TRACKS.filter(t=>t.isNew).map(t=><TCard key={t.id} track={t} current={track} play={play} playing={playing} isPreview={isPreview} C={C} liked={liked} toggleLike={toggleLike} openPlayer={openPlayer}/>)}
        </HRow>
      </Sec>

      {/* BY DESIRE */}
      <Sec title="By desire" C={C} onShowAll={()=>setTab("library")}>
        <HRow>
          {Object.keys(CAT_ICONS).map(cat=>{
            const c=CAT_ICONS[cat]||{accent:"#e8a860",icon:''};
            return(
              <button key={cat} onClick={()=>{setLibCat(cat);setTab("library");}} style={{ flexShrink:0,width:80,background:"none",border:"none",cursor:"pointer",padding:0,fontFamily:"'Jost',sans-serif",textAlign:"center" }}>
                <div style={{ width:80,height:80,borderRadius:14,background:`linear-gradient(135deg,${isDark?"#111":C.bg2} 0%,${c.accent}55 100%)`,border:`1.5px solid ${c.accent}44`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:6,color:c.accent }}>
                  <svg width="36" height="36" viewBox="0 0 60 60" dangerouslySetInnerHTML={{__html:c.icon}}/>
                </div>
                <div style={{ fontSize:10,fontWeight:400,color:C.mu,lineHeight:1.3 }}>{cat.replace("maxxing","")}</div>
              </button>
            );
          })}
        </HRow>
      </Sec>

    </div>
  );
}

// ── ANALYTICS TAB — dominant emotional state + full analytics board, its own destination ──
function AnalyticsTab({ threads, listenCount, isPreview, C, setTab, emoLog=[], theme="dark", onDrillDown, openGuide }) {
  const domToday = dominant(emoLog,1), dom7 = dominant(emoLog,7), dom30 = dominant(emoLog,30);
  const manifested = threads.filter(t=>t.done).length;
  const inProgress = threads.filter(t=>!t.done).length;
  return (
    <div>
      <div style={{ padding:"20px 16px 12px" }}>
        <span style={{ fontSize:24,fontWeight:400,color:C.cr }}>Analytics</span>
      </div>

      {/* EMOTIONAL PATTERN — dominant state today / 7d / 30d */}
      <div style={{ margin:"0 16px 14px", padding:"18px 16px", borderRadius:16, background:C.bg2, border:`1px solid ${C.border}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <span style={{ fontSize:11, fontWeight:400, color:"#e8b870", letterSpacing:"0.18em", textTransform:"uppercase" }}>Your dominant state</span>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
          {[["Today",domToday],["Last 7 days",dom7],["Last 30 days",dom30]].map(([l,d],i)=>(
            <div key={i} style={{ background:C.card2, borderRadius:12, padding:"16px 10px", textAlign:"center" }}>
              <div style={{ fontSize:11, color:C.mu, fontWeight:400, letterSpacing:"0.05em", textTransform:"uppercase", marginBottom:8 }}>{l}</div>
              <div style={{ fontSize:20, fontWeight:400, color:C.text, lineHeight:1.15 }}>{d?.n||"—"}</div>
              <div style={{ fontSize:13, color:C.mu, fontWeight:400, marginTop:4 }}>{d?.v||""}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize:12, color:C.mu, marginTop:14, textAlign:"center", fontWeight:400 }}>
          {dom7&&dom30 ? (dom7.v>dom30.v ? `✦ You're climbing. +${dom7.v-dom30.v} points this week.` : dom7.v<dom30.v ? "Log where you are today — the audios pull you back up." : "Steady. Keep listening.") : "Log how you're feeling to see the pattern."}
        </div>
      </div>

      {/* FULL ANALYTICS BOARD */}
      <div style={{ margin:"0 16px 20px" }}>
        <AnalyticsBoard
          theme={theme}
          data={isPreview ? DEMO_ANALYTICS : {
            manifested, inProgress,
            signs: threads.reduce((a,t)=>a+(t.signs?.length||0),0),
            listens: listenCount,
            streakDays: 14,
            week: [2,4,3,6,5,4,Math.max(1,listenCount%7)],
            topCats: Object.entries(threads.reduce((m,t)=>{m[t.category]=(m[t.category]||0)+1;return m;},{}))
              .sort((a,b)=>b[1]-a[1]).slice(0,3)
              .map(([name,n])=>[name,({"Lovemaxxing":"#e8a860","Money":"#e8b870","Beauty":"#e8b870","Identity":"#e8a860","DNA":"#e8a860","Sleep":"#e8b870"})[name]||"#e8a860",n]),
          }}
          onViewProof={isPreview?null:()=>setTab("proof")}
          onDrillDown={isPreview?null:onDrillDown}
        />
      </div>

      {/* KNOWLEDGE GUIDE — available to all tiers */}
      <div style={{ margin:"0 16px 20px" }}>
        <button onClick={openGuide} style={{ width:"100%", padding:"18px 18px", background:C.bg2, border:`1px solid rgba(232,184,112,0.3)`, borderRadius:16, cursor:"pointer", display:"flex", alignItems:"center", gap:14, fontFamily:"'Jost',sans-serif", textAlign:"left" }}>
          <span style={{ width:48, height:48, borderRadius:14, background:"rgba(232,184,112,0.12)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>📖</span>
          <span style={{ flex:1 }}>
            <div style={{ fontSize:15, fontWeight:400, color:C.cr }}>Guidebook ✦</div>
            <div style={{ fontSize:12, color:C.mu, fontWeight:400, marginTop:3, lineHeight:1.4 }}>How the audios work, brainwaves, Hawkins scale, EMDR, subliminals — everything explained.</div>
          </span>
          <span style={{ fontSize:20, color:"#e8b870", flexShrink:0 }}>›</span>
        </button>
      </div>
    </div>
  );
}

// ── SEARCH TAB ────────────────────────────────────────────────────────────────
function SearchTab({ tracks, searchQ, setQ, play, track:cur, playing, liked, toggleLike, isPreview, C, openPlayer }) {
  const res = searchQ.length>1 ? tracks.filter(t=>{
    const q = searchQ.toLowerCase();
    if (t.title.toLowerCase().includes(q) || t.cat.toLowerCase().includes(q)) return true;
    const d = getDesc(t);
    const descText = (d.shift + " " + d.benefits.join(" ")).toLowerCase();
    return descText.includes(q);
  }) : tracks;
  return (
    <div style={{ padding:"16px 16px 0" }}>
      <div style={{ fontSize:20,fontWeight:400,marginBottom:14,color:C.cr }}>Search</div>
      <div style={{ display:"flex",alignItems:"center",gap:10,background:C.inputBg,borderRadius:10,padding:"10px 14px",marginBottom:16 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.dim} strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input value={searchQ} onChange={e=>setQ(e.target.value)} placeholder="Tracks, categories, desires…"
          style={{ border:"none",background:"transparent",flex:1,fontSize:14,color:C.inputCr,outline:"none",fontFamily:"'Jost',sans-serif"}}/>
        {searchQ && <button onClick={()=>setQ("")} style={{ background:"none",border:"none",color:C.dim,fontSize:16,cursor:"pointer",lineHeight:1 }}>✕</button>}
      </div>
      {res.map(t=>{
        const isP = cur?.id===t.id;
        return (
        <div key={t.id} onClick={()=>{play(t); openPlayer?.();}} style={{ display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:`0.5px solid ${C.border}`,cursor:isPreview?"not-allowed":"pointer" }}>
          <div style={{ position:"relative",flexShrink:0 }}>
            <Thumb title={t.title} cat={t.cat} size={48} radius={6}/>
            {isPreview&&<div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center" }}><Ico.Lock/></div>}
          </div>
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ fontSize:13,fontWeight:400,color:isP?R:C.cr,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2 }}>{t.title}</div>
            <div style={{ fontSize:11,color:C.mu }}>{t.artist} · {t.cat} · {t.dur}</div>
          </div>
          {t.isNew&&<span style={{ fontSize:9,padding:"2px 7px",background:OMBRE,color:"#000",borderRadius:20,fontWeight:400,flexShrink:0 }}>NEW</span>}
          {!isPreview && (
            <>
              <button onClick={e=>{e.stopPropagation();toggleLike(t.id,e);}} style={{ background:"none",border:"none",padding:6,lineHeight:0,flexShrink:0 }}><Ico.Heart on={liked.has(t.id)}/></button>
              <button onClick={e=>{e.stopPropagation();play(t);}} style={{ width:32,height:32,borderRadius:"50%",background:isP?R:C.bg3,border:"none",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer",padding:0 }}>
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
function LibraryTab({ tracks, cat, setCat, libFormat, setLibFormat, play, track:cur, liked, toggleLike, playing, isPreview, C, openPlayer }) {
  const isDark = C?.bg?.startsWith("#0") || C?.bg?.startsWith("#1") || C?.bg === "#080808";
  const cats = ["All","Liked","Lovemaxxing","Beautymaxxing","Facemaxxing","Bodymaxxing","Skinnymaxxing","Moneymaxxing","Businessmaxxing","Careermaxxing","DNAmaxxing","Selfmaxxing","Erosmaxxing","Singlemaxxing","Wellnessmaxxing","Sleepmaxxing","Studymaxxing","Friendmaxxing","Peacemaxxing","Confidencemaxxing","Stylemaxxing","Healmaxxing","Intuitionmaxxing","Lifemaxxing","Luckygirlmaxxing","Sovereignmaxxing"];
  const byCat = cat==="Liked" ? tracks.filter(t=>liked.has(t.id)) : (cat==="All" ? tracks : tracks.filter(t=>t.cat===cat));
  const shown = libFormat==="All" ? byCat : byCat.filter(t=>t.format===libFormat);
  const [catOpen, setCatOpen] = useState(false);
  const [dropRect, setDropRect] = useState(null);
  const catRef = useRef(null);
  const btnRef = useRef(null);
  useEffect(() => {
    const onClick = e => { if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);
  const openDropdown = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setDropRect(r);
    }
    setCatOpen(o=>!o);
  };
  const catLabel = cat==="All" ? "All categories" : (cat==="Liked" ? "Liked ♡" : cat);
  const catOptions = ["All","Liked",...cats.filter(c=>c!=="All"&&c!=="Liked")];
  return (
    <div>
      <div style={{ padding:"16px 16px 10px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <span style={{ fontSize:20,fontWeight:400,color:C.cr }}>Browse by Desire</span>
        {cat!=="All" && <button onClick={()=>setCat("All")} style={{ fontSize:12,color:R,background:"none",border:"none",cursor:"pointer",fontFamily:"'Jost',sans-serif",fontWeight:400 }}>Clear ✕</button>}
      </div>
      <div style={{ padding:"0 16px 14px" }}>
        <div ref={catRef} style={{ position:"relative" }}>
          <button
            ref={btnRef}
            onClick={openDropdown}
            style={{
              width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
              background:"#000", border:`1px solid ${R}66`, borderRadius:12,
              padding:"14px 16px", fontSize:14, fontWeight:400, color:R,
              fontFamily:"'Jost',sans-serif", cursor:"pointer"
            }}
          >
            <span>{catLabel}</span>
            <span style={{ fontSize:11, transform:catOpen?"rotate(180deg)":"none", transition:"transform 0.15s" }}>▾</span>
          </button>
          {catOpen && dropRect && (
            <>
            <div onClick={()=>setCatOpen(false)} style={{ position:"fixed", inset:0, zIndex:9998, background:"transparent" }}/>
            <div style={{
              position:"fixed",
              top: dropRect.bottom + 6,
              left: dropRect.left,
              width: dropRect.width,
              zIndex:9999,
              background:"#0a0a0a", border:`1px solid ${R}66`, borderRadius:12,
              maxHeight:320, overflowY:"auto", boxShadow:"0 12px 40px rgba(0,0,0,0.95)"
            }}>
              {catOptions.map(c=>{
                const label = c==="All" ? "All categories" : (c==="Liked" ? "Liked ♡" : c);
                const active = cat===c;
                const catColor = CAT_ICONS[c]?.accent || R;
                return (
                  <div key={c} onClick={()=>{setCat(c);setCatOpen(false);}}
                    style={{
                      padding:"11px 16px", fontSize:14, fontWeight:400, display:"flex", alignItems:"center", gap:10,
                      color:active?catColor:"#f2ece4", background:active?`${catColor}1c`:"#0a0a0a",
                      cursor:"pointer", fontFamily:"'Jost',sans-serif",
                      borderBottom:"1px solid rgba(255,255,255,0.06)", borderLeft:active?`3px solid ${catColor}`:"3px solid transparent"
                    }}
                    onMouseEnter={e=>{ if(!active) e.currentTarget.style.background = `${catColor}14`; }}
                    onMouseLeave={e=>{ if(!active) e.currentTarget.style.background = "#0a0a0a"; }}
                  >
                    {(c!=="All"&&c!=="Liked") ? (
                      <div style={{ width:10, height:10, borderRadius:"50%", background:catColor, flexShrink:0, boxShadow:`0 0 5px ${catColor}99` }}/>
                    ) : c==="Liked" ? (
                      <div style={{ width:10, height:10, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", color:R, fontSize:11 }}>♡</div>
                    ) : (
                      <div style={{ width:10, height:10, borderRadius:"50%", background:"linear-gradient(135deg,#f5e0a0,#e8b870,#d4a090,#c4789a,#B76E79)", flexShrink:0 }}/>
                    )}
                    <span>{c==="All"?"All categories":(c==="Liked"?"Liked":label)}</span>
                  </div>
                );
              })}
            </div>
            </>
          )}
        </div>
      </div>
      {/* FORMAT FILTER — Subliminal / Hypnosis / Melodic / Reiki / 528hz */}
      <div style={{ display:"flex",gap:6,padding:"0 16px 14px",overflowX:"auto",WebkitOverflowScrolling:"touch" }}>
        {FORMATS.map(fm=>(
          <button key={fm} onClick={()=>setLibFormat(fm)} style={{ flexShrink:0,padding:"4px 12px",borderRadius:20,background:libFormat===fm?R:"none",border:`1px solid ${libFormat===fm?R:C.border}`,color:libFormat===fm?"#000":C.mu,fontSize:11,fontWeight:400,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>{fm==="All"?"All formats":fm}</button>
        ))}
      </div>
      {shown.length===0 && cat==="Liked" && (
        <div style={{ padding:"40px 20px",textAlign:"center",color:C.mu }}>
          <div style={{ fontSize:32,marginBottom:12 }}>♡</div>
          <div style={{ fontSize:14 }}>Tap the heart on any track to save it here.</div>
        </div>
      )}
      <div style={{ padding:"0 16px" }}>
        {shown.map(t=>(
          <div key={t.id} onClick={()=>{play(t); openPlayer?.();}} style={{ display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:`0.5px solid ${C.border}`,cursor:isPreview?"not-allowed":"pointer" }}>
            <div style={{ position:"relative",flexShrink:0 }}>
              <Thumb title={t.title} cat={t.cat} size={50} radius={6}/>
              {isPreview&&<div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center" }}><Ico.Lock/></div>}
              {!isPreview&&cur?.id===t.id&&playing&&(
                <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <div style={{ display:"flex",alignItems:"flex-end",gap:2 }}>{[8,14,10,14,8].map((h,i)=><div key={i} style={{ width:2,height:h,background:"#B76E79",borderRadius:1 }}/>)}</div>
                </div>
              )}
            </div>
            <div style={{ flex:1,minWidth:0 }}>
              <div style={{ fontSize:14,fontWeight:400,color:(!isPreview&&cur?.id===t.id)?R:(isDark?"#f2ece4":"#1a1008"),overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2 }}>
                {t.title}{t.isNew&&<span style={{ marginLeft:6,fontSize:9,background:OMBRE,color:"#000",padding:"1px 5px",borderRadius:8,fontWeight:400,verticalAlign:"middle" }}>NEW</span>}
              </div>
              <div style={{ fontSize:11,color:isDark?"#9a8878":"#6a5030" }}>{t.tier==="goddess"&&<span style={{ color:R }}>✦ </span>}{t.artist} · {t.cat} · {t.format} · {t.dur}</div>
            </div>
            {!isPreview&&(
              <>
                <button onClick={e=>{e.stopPropagation();toggleLike(t.id,e);}} style={{ background:"none",border:"none",padding:8,lineHeight:0 }}>
                  <Ico.Heart on={liked.has(t.id)}/>
                </button>
                <button onClick={e=>{e.stopPropagation();play(t);}} style={{ width:30,height:30,borderRadius:"50%",background:cur?.id===t.id?R:C.bg3,border:"none",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,cursor:"pointer",padding:0 }}>
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
function ProofLockedScreen({ C, onUpgrade, feature="ProofOS" }) {
  return (
    <div style={{ padding:"48px 24px", textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", gap:14, minHeight:400, justifyContent:"center" }}>
      <div style={{ width:72, height:72, borderRadius:22, background:"rgba(232,168,96,0.08)", border:"1px solid rgba(232,168,96,0.25)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:30 }}>🔒</div>
      <div style={{ fontSize:18, color:C.cr }}>{feature} is a Goddess Tier feature</div>
      <div style={{ fontSize:13, color:C.mu, maxWidth:300, lineHeight:1.7 }}>
        {feature === "ProofOS"
          ? "Log your desires, capture signs and synchronicities, and mark each manifestation as it lands. Everything, documented forever."
          : "Track your dominant emotional state, listening streaks, and the evidence building over time."}
      </div>
      <div style={{ background:"rgba(232,168,96,0.08)", border:"1px solid rgba(232,168,96,0.2)", borderRadius:14, padding:"14px 20px", maxWidth:280 }}>
        <div style={{ fontSize:11, color:C.mu, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8 }}>Upgrade to Goddess Tier</div>
        <div style={{ fontSize:22, color:"#e8a860", marginBottom:4 }}>£33<span style={{ fontSize:13, color:C.mu }}>/month</span></div>
        <div style={{ fontSize:11, color:C.mu }}>You pay the difference from your current plan — no re-entering card details</div>
      </div>
      <button onClick={onUpgrade} style={{ padding:"14px 36px", background:"linear-gradient(135deg,#f5e0a0 0%,#e8b870 22%,#d4a090 48%,#c4789a 72%,#B76E79 100%)", border:"none", borderRadius:14, color:"#000", fontSize:14, cursor:"pointer", fontFamily:"'Jost',sans-serif" }}>
        Unlock {feature} — upgrade now ✦
      </button>
      <div style={{ fontSize:11, color:C.dim }}>Managed by Stripe · your card is already saved · instant access</div>
    </div>
  );
}

function ProofTab({ threads, setThreads, isPreview, C, currentTrack, userTier="goddess", onUpgrade, proofFilter="all", setProofFilter }) {
  const [newD, setD]       = useState("");
  const [newBelief, setNewBelief] = useState("");
  const [newCat, setNewCat]   = useState("Moneymaxxing");
  const [linkedTrack, setLinked] = useState(currentTrack?.title || "");
  const [newFeel, setFeel] = useState("");
  const [newFeelText, setFeelText] = useState("");
  const [adding, setAdding] = useState(false);
  const [view, setView] = useState("threads"); // threads | wall | bucket
  const [signInput, setSignInput] = useState({}); // {threadId: text}
  const [finishing, setFinishing] = useState(null); // threadId being marked done
  const [feelAfterInput, setFeelAfterInput] = useState("");
  const [feelAfterLevel, setFeelAfterLevel] = useState("");

  // ProofOS now respects the real app theme instead of being locked to the gold ombre
  const isDark = C?.bg?.startsWith("#0") || C?.bg?.startsWith("#1") || C?.bg === "#080808";
  const PC = isDark
    ? { card:"#111111", cardSolid:"#111111", text:"#f2ece4", mu:"#9a8878", dim:"#5a4a40", border:"rgba(232,168,96,0.14)", inputBg:"#1a1a1a" }
    : { card:"#fffcf8", cardSolid:"#fffcf8", text:"#1a1008", mu:"#8a6840", dim:"#b89060", border:"rgba(180,104,48,0.16)", inputBg:"rgba(180,104,48,0.06)" };
  const PAGE_BG = isDark ? "#080808" : "#fdf8f2";

  if (isPreview) return (
    <div style={{ padding:"40px 20px",textAlign:"center",background:PAGE_BG,minHeight:"100%" }}>
      <div style={{ fontSize:36,marginBottom:16,color:"#e8b870" }}>✦</div>
      <div style={{ fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:28,fontWeight:400,color:PC.text,marginBottom:10 }}>ProofOS</div>
      <div style={{ fontSize:14,color:PC.mu,lineHeight:1.8,marginBottom:24,maxWidth:300,margin:"0 auto 24px",fontWeight:400 }}>
        Your manifestation tracker for life. Log desires, capture every sign, build your proof wall. Included in Goddess Tier.
      </div>
      <button style={{ padding:"12px 24px",background:"linear-gradient(135deg,#f5e0a0 0%,#e8b870 22%,#d4a090 48%,#c4789a 72%,#B76E79 100%)",border:"none",borderRadius:12,color:"#000",fontSize:14,fontWeight:400,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>
        Upgrade to Goddess — £33/mo
      </button>
    </div>
  );

  const manifested = threads.filter(t=>t.done);
  const inProgress = threads.filter(t=>!t.done);
  const bucketItems = threads.filter(t=>t.isBucket && !t.done);
  const activeThreads = threads.filter(t=>!t.isBucket);
  const displayedThreads = proofFilter==="manifested" ? manifested.filter(t=>!t.isBucket) : proofFilter==="inProgress" ? inProgress.filter(t=>!t.isBucket) : activeThreads;
  const totalSigns = threads.reduce((a,t)=>a+(t.signs?.length||0),0);
  const [bucketText, setBucketText] = useState("");
  const [promotingId, setPromotingId] = useState(null);
  const [trackPickerOpen, setTrackPickerOpen] = useState(false);
  const [promoCatOpen, setPromoCatOpen] = useState(null);

  const startFinish = (id) => { setFinishing(id); setFeelAfterInput(""); };
  const confirmFinish = (id) => {
    const after = [feelAfterLevel, feelAfterInput].filter(Boolean).join(" — ");
    setThreads(threads.map(t=>t.id===id?{...t,done:true,feelAfter:after||t.feelAfter,manifestedAt:new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short"})}:t));
    setFinishing(null); setFeelAfterInput(""); setFeelAfterLevel("");
  };
  const undoMarkDone = (id) => setThreads(threads.map(t=>t.id===id?{...t,done:false,manifestedAt:null}:t));
  const deleteThread = (id) => { if(window.confirm("Delete this thread?")) setThreads(threads.filter(t=>t.id!==id)); };
  const addSign = (id) => {
    const text = (signInput[id]||"").trim();
    if(!text) return;
    const date = new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short"});
    setThreads(threads.map(t=>t.id===id?{...t,signs:[...(t.signs||[]),{text,date}]}:t));
    setSignInput({...signInput,[id]:""});
  };
  const addMediaSign = (id, media) => {
    const date = new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short"});
    setThreads(ts=>ts.map(t=>t.id===id?{...t,signs:[...(t.signs||[]),{...media,date}]}:t));
  };
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const saveEdit = (id) => { if(editText.trim()) setThreads(ts=>ts.map(t=>t.id===id?{...t,desire:editText.trim()}:t)); setEditId(null); };
  const [recId, setRecId] = useState(null);
  const recRef = useRef(null);
  const toggleRec = async (id) => {
    if (recId === id) { recRef.current?.stop(); return; }
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
      };
      mr.start(); recRef.current = mr; setRecId(id);
    } catch { alert("Microphone access needed for voice notes."); }
  };

  return (
    <div style={{ padding:"16px 16px 24px", background:PAGE_BG, minHeight:"100%" }}>
      <div style={{ fontSize:22,fontWeight:400,marginBottom:2,color:PC.text }}>ProofOS <span style={{ color:"#000" }}>✦</span></div>
      <div style={{ fontSize:13,color:PC.mu,marginBottom:14,fontWeight:400 }}>Your manifestation tracker for life. Every sign captured — forever.</div>

      {/* Filter banner — shown when drilled in from Analytics */}
      {proofFilter!=="all" && (
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",background:"#000",borderRadius:12,padding:"10px 14px",marginBottom:14 }}>
          <span style={{ fontSize:12,color:"#f2ece4",fontFamily:"'Jost',sans-serif" }}>
            {proofFilter==="manifested" ? `Showing ${manifested.length} manifested ✓` : `Showing ${inProgress.length} in progress`}
          </span>
          <button onClick={()=>setProofFilter?.("all")} style={{ background:"none",border:"1px solid rgba(255,255,255,0.2)",borderRadius:8,color:"#9a8878",fontSize:11,padding:"4px 10px",cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>Show all</button>
        </div>
      )}

      {/* Stats */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14 }}>
        {[[threads.length,"Intentions"],[manifested.length,"Manifested"],[totalSigns,"Signs logged"]].map(([v,l],i)=>(
          <div key={i} style={{ background:PC.card,borderRadius:12,padding:"12px 6px",textAlign:"center" }}>
            <div style={{ fontSize:22,fontWeight:400,color:PC.text }}>{v}</div>
            <div style={{ fontSize:10,color:PC.mu,fontWeight:400 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* View toggle: Bucket List | Active | Proof Wall */}
      <div style={{ display:"flex",gap:6,marginBottom:15 }}>
        {[["bucket",`Bucket List (${bucketItems.length})`],["threads","Active"],["wall",`Proof Wall (${manifested.length})`]].map(([k,l])=>(
          <button key={k} onClick={()=>setView(k)} style={{ flex:1,padding:"11px 6px",borderRadius:10,
            background:view===k?"linear-gradient(135deg,#f5e0a0 0%,#e8b870 22%,#d4a090 48%,#c4789a 72%,#B76E79 100%)":"none",
            border:`1px solid ${view===k?"transparent":"#B76E79"}`,
            color:view===k?"#000":"#B76E79", fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>{l}</button>
        ))}
      </div>

      {view==="bucket" ? (
        /* ═══ BUCKET LIST — capture everything, no commitment required ═══ */
        <div>
          <div style={{ background:PC.card,borderRadius:14,padding:16,marginBottom:14 }}>
            <div style={{ fontSize:12,color:"#e8b870",fontWeight:500,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:10 }}>✦ What's the difference?</div>
            <div style={{ fontSize:13,color:PC.text,lineHeight:1.75,marginBottom:12 }}>
              <b style={{fontWeight:600}}>Bucket List</b> is everything you want to manifest, ever — no limit, no category, no audio required. Write something down the moment it occurs to you, the way you'd jot a note. Nothing here is a commitment.
            </div>
            <div style={{ fontSize:13,color:PC.text,lineHeight:1.75,marginBottom:12 }}>
              <b style={{fontWeight:600}}>Active</b> is different — it's what you're actually focusing on right now, with audio, with your emotional state tracked before and after. We recommend keeping this to around 5–10 at a time, so your energy stays focused instead of spread thin.
            </div>
            <div style={{ fontSize:13,color:PC.text,lineHeight:1.75 }}>
              Add to your Bucket List constantly. When you're ready to actually focus on something, promote it into Active — pick a category, get a track suggested. Everything else just waits, still valid. And sometimes writing something down clearly is enough on its own — <b style={{fontWeight:600}}>you can mark a Bucket List item manifested without ever linking it to an audio.</b> Your Proof Wall doesn't care which list it came from.
            </div>
          </div>

          <div style={{ background:PC.card,borderRadius:14,padding:14,marginBottom:14 }}>
            <div style={{ fontSize:11,color:PC.mu,fontWeight:400,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8 }}>Add to your bucket list</div>
            <div style={{ display:"flex", gap:8 }}>
              <input value={bucketText} onChange={e=>setBucketText(e.target.value)} placeholder="A holiday to... A new car... Whatever it is"
                style={{ flex:1, padding:"11px 13px", borderRadius:8, border:`1px solid ${PC.border}`, background:PC.inputBg, color:PC.text, fontSize:14, fontFamily:"'Jost',sans-serif", outline:"none" }}/>
              <button onClick={()=>{
                if(!bucketText.trim()) return;
                setThreads([{id:Date.now(),desire:bucketText,days:0,done:false,signs:[],track:"",category:"",feelBefore:"",feelAfter:"",oldBelief:"",isBucket:true},...threads]);
                setBucketText("");
              }} style={{ padding:"11px 18px", background:isDark?"#000":"#1a0a04", border:"none", borderRadius:8, color:"#f2ece4", fontSize:13, fontWeight:400, cursor:"pointer", fontFamily:"'Jost',sans-serif" }}>+ Add</button>
            </div>
          </div>

          {activeThreads.filter(t=>!t.done).length >= 5 && (
            <div style={{ fontSize:11, color:"#e8b870", background:`${R}14`, border:`1px solid ${R}33`, borderRadius:10, padding:"10px 14px", marginBottom:14, lineHeight:1.5 }}>
              ✦ You've got {activeThreads.filter(t=>!t.done).length} active intentions. We recommend focusing on 5–10 at once — more than that and it's easy to spread your energy too thin. Not a hard rule, just a nudge.
            </div>
          )}

          {bucketItems.length===0 ? (
            <div style={{ background:PC.card,borderRadius:14,padding:"28px 18px",textAlign:"center" }}>
              <div style={{ fontSize:26,marginBottom:8 }}>✦</div>
              <div style={{ fontSize:13,color:PC.mu,lineHeight:1.7,fontWeight:400 }}>Your bucket list is empty.<br/>Add anything you want to manifest — big or small.</div>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {bucketItems.map(item=>(
                <div key={item.id} style={{ background:PC.card, borderRadius:12, padding:"15px 16px" }}>
                  <div style={{ fontSize:15, color:PC.text, marginBottom:11, lineHeight:1.5 }}>{item.desire}</div>
                  {promotingId===item.id ? (
                    <div style={{ marginBottom:11, position:"relative" }}>
                      <div style={{ fontSize:11, color:PC.mu, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:7 }}>Choose a category to promote this</div>
                      <div onClick={()=>setPromoCatOpen(o=>o===item.id?null:item.id)} style={{ width:"100%",background:PC.inputBg,border:`1px solid ${PC.border}`,color:PC.mu,borderRadius:8,padding:"11px 13px",fontSize:14,fontFamily:"'Jost',sans-serif",boxSizing:"border-box",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                        <span>— Select a category —</span>
                        <span style={{ fontSize:11, color:PC.mu, transform:promoCatOpen===item.id?"rotate(180deg)":"none", transition:"transform 0.15s" }}>▾</span>
                      </div>
                      {promoCatOpen===item.id && (
                        <>
                        <div onClick={()=>setPromoCatOpen(null)} style={{ position:"fixed", inset:0, zIndex:998 }}/>
                        <div style={{ position:"absolute", top:"calc(100% + 6px)", left:0, right:0, zIndex:999, background:isDark?"#0a0a0a":"#fffcf8", border:`1px solid ${PC.border}`, borderRadius:10, maxHeight:260, overflowY:"auto", boxShadow:"0 12px 40px rgba(0,0,0,0.5)" }}>
                          {Object.keys(CAT_ICONS).map(c=>{
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
                                <span style={{ fontSize:13, color:PC.text }}>{c}</span>
                              </div>
                            );
                          })}
                        </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={()=>setPromotingId(item.id)} style={{ flex:1, padding:"8px 12px", background:"none", border:`1px solid ${PC.border}`, borderRadius:8, color:PC.text, fontSize:12, cursor:"pointer", fontFamily:"'Jost',sans-serif" }}>
                        Focus on this now
                      </button>
                      <button onClick={()=>setThreads(ts => ts.map(t => t.id===item.id ? {...t, done:true} : t))} style={{ flex:1, padding:"8px 12px", background:`${R}18`, border:`1px solid ${R}44`, borderRadius:8, color:R, fontSize:12, cursor:"pointer", fontFamily:"'Jost',sans-serif" }}>
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
        /* ═══ PROOF WALL — your wins, forever ═══ */
        <div>
          <div style={{ fontSize:11,color:PC.mu,fontWeight:400,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:10 }}>✓ Your proof wall</div>
          {manifested.length===0 ? (
            <div style={{ background:PC.card,borderRadius:14,padding:"28px 18px",textAlign:"center" }}>
              <div style={{ fontSize:26,marginBottom:8 }}>✦</div>
              <div style={{ fontSize:13,color:PC.mu,lineHeight:1.7,fontWeight:400 }}>Nothing manifested yet.<br/>Your first win lands here — and stays here for life.</div>
            </div>
          ) : (
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
              {manifested.map(d=>(
                <div key={d.id} style={{ background:CAT_GRAD[d.category]||CAT_GRAD.Identity, borderRadius:12, padding:"12px 12px", position:"relative" }}>
                  <span style={{ fontSize:9,padding:"2px 8px",background:"rgba(255,255,255,0.65)",color:CAT_COLOR[d.category]||"#000",borderRadius:20,fontWeight:400 }}>✓ {d.category}</span>
                  <div style={{ fontSize:13,fontWeight:400,color:"#000",marginTop:6,lineHeight:1.3 }}>{d.desire}</div>
                  <div style={{ fontSize:10,color:C.cr,fontWeight:400,marginTop:4 }}>{d.days}d · {d.signs?.length||0} signs{(d.signs||[]).some(s=>s.img)?" · 📷":""}{(d.signs||[]).some(s=>s.audio)?" · 🎤":""} · {d.manifestedAt||""}</div>
                  {d.feelAfter && <div style={{ fontSize:10,color:C.cr,marginTop:5,lineHeight:1.45 }}>"{d.feelAfter}"</div>}
                  <button onClick={()=>undoMarkDone(d.id)} style={{ position:"absolute",top:8,right:8,fontSize:9,background:"rgba(255,255,255,0.55)",border:"none",borderRadius:10,padding:"2px 7px",color:"#000",cursor:"pointer",fontWeight:400,fontFamily:"'Jost',sans-serif" }}>undo</button>
                </div>
              ))}
              <div style={{ background:PC.card,border:`1px dashed ${PC.border}`,borderRadius:12,padding:12,display:"flex",alignItems:"center",justifyContent:"center",minHeight:80 }}>
                <span style={{ fontSize:11,color:PC.mu,textAlign:"center",fontWeight:400,lineHeight:1.4 }}>Your next<br/>manifestation</span>
              </div>
              <div style={{ gridColumn:"1/-1" }}>
              <div style={{ fontSize:11,fontWeight:400,color:PC.mu,letterSpacing:"0.15em",textTransform:"uppercase",margin:"18px 0 8px" }}>All captured proof · newest last</div>
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(90px,1fr))",gap:8 }}>
                {threads.flatMap(t=>(t.signs||[]).filter(s=>s.img||s.audio).map((s,ix)=>({...s,desire:t.desire,key:t.id+"-"+ix}))).map(s=>(
                  <div key={s.key} style={{ background:"rgba(255,255,255,0.85)",borderRadius:10,padding:6,border:"1px solid rgba(0,0,0,0.12)" }}>
                    {s.img && <img src={s.img} alt="proof" style={{ width:"100%",height:72,objectFit:"cover",borderRadius:7 }}/>}
                    {s.audio && <div style={{ height:72,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4 }}><span style={{fontSize:22}}>🎤</span><audio src={s.audio} controls style={{ width:"100%",height:24 }}/></div>}
                    <div style={{ fontSize:8.5,fontWeight:400,color:C.mu,marginTop:4,lineHeight:1.3,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical" }}>{s.desire} · {s.date}</div>
                  </div>
                ))}
              </div>
              </div>
            </div>
          )}
        </div>
      ) : (
      <>
      {/* ADD NEW THREAD */}
      <button onClick={()=>setAdding(a=>!a)} style={{ width:"100%",padding:12,background:adding?PC.card:(isDark?"#000":"#1a0a04"),border:"none",borderRadius:12,color:adding?PC.text:"#f2ece4",fontSize:13,fontWeight:400,marginBottom:12,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>
        {adding?"✕ Cancel":"+ New Intention"}
      </button>
      {adding && (
        <div style={{ background:PC.cardSolid,borderRadius:14,padding:16,marginBottom:14 }}>
          <div style={{ fontSize:12,color:PC.mu,fontWeight:400,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:8 }}>State your desire</div>
          <input value={newD} onChange={e=>setD(e.target.value)} placeholder="I receive… I am… I have…"
            style={{ width:"100%",background:PC.inputBg,border:`1px solid ${PC.border}`,color:PC.text,borderRadius:8,padding:"11px 13px",fontSize:14,marginBottom:11,outline:"none",fontFamily:"'Jost',sans-serif",boxSizing:"border-box" }}/>
          <div style={{ fontSize:12,color:PC.mu,fontWeight:400,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6 }}>Current belief about this</div>
          <input value={newBelief} onChange={e=>setNewBelief(e.target.value)} placeholder="What do you actually believe about this right now? e.g. 'It's never worked out for me before'"
            style={{ width:"100%",background:PC.inputBg,border:`1px solid ${PC.border}`,color:PC.text,borderRadius:8,padding:"11px 13px",fontSize:14,marginBottom:11,outline:"none",fontFamily:"'Jost',sans-serif",boxSizing:"border-box" }}/>
          <div style={{ fontSize:12,color:PC.mu,fontWeight:400,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6 }}>Link to audio</div>
          <div style={{ position:"relative", marginBottom:11 }}>
            <div onClick={()=>setTrackPickerOpen(o=>!o)} style={{ width:"100%",background:PC.inputBg,border:`1px solid ${PC.border}`,color:linkedTrack?PC.text:PC.mu,borderRadius:8,padding:"11px 13px",fontSize:14,fontFamily:"'Jost',sans-serif",boxSizing:"border-box",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <span>{linkedTrack || "— Select a track —"}</span>
              <span style={{ fontSize:11, color:PC.mu, transform:trackPickerOpen?"rotate(180deg)":"none", transition:"transform 0.15s" }}>▾</span>
            </div>
            {trackPickerOpen && (
              <>
              <div onClick={()=>setTrackPickerOpen(false)} style={{ position:"fixed", inset:0, zIndex:998 }}/>
              <div style={{ position:"absolute", top:"calc(100% + 6px)", left:0, right:0, zIndex:999, background:isDark?"#0a0a0a":"#fffcf8", border:`1px solid ${PC.border}`, borderRadius:10, maxHeight:260, overflowY:"auto", boxShadow:"0 12px 40px rgba(0,0,0,0.5)" }}>
                {TRACKS.map(t=>{
                  const catColor = CAT_ICONS[t.cat]?.accent || R;
                  return (
                    <div key={t.id} onClick={()=>{setLinked(t.title); setTrackPickerOpen(false);}}
                      style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 13px", cursor:"pointer",
                        background:linkedTrack===t.title?`${catColor}1c`:"transparent", borderBottom:`1px solid ${PC.border}` }}
                      onMouseEnter={e=>{if(linkedTrack!==t.title)e.currentTarget.style.background=`${catColor}14`;}}
                      onMouseLeave={e=>{if(linkedTrack!==t.title)e.currentTarget.style.background="transparent";}}>
                      <div style={{ width:9, height:9, borderRadius:"50%", background:catColor, flexShrink:0 }}/>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:13, color:PC.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.title}</div>
                        <div style={{ fontSize:11, color:PC.mu }}>{t.cat}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              </>
            )}
          </div>
          <div style={{ fontSize:12,color:PC.mu,fontWeight:400,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6 }}>Category</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:15 }}>
            {["Lovemaxxing","Moneymaxxing","Beautymaxxing","Facemaxxing","Bodymaxxing","Skinnymaxxing","DNAmaxxing","Selfmaxxing","Erosmaxxing","Singlemaxxing","Sleepmaxxing","Businessmaxxing","Careermaxxing","Lifemaxxing","Luckygirlmaxxing","Sovereignmaxxing","Confidencemaxxing","Wellnessmaxxing","Studymaxxing","Friendmaxxing","Peacemaxxing","Stylemaxxing","Healmaxxing","Intuitionmaxxing"].map(c=>{
              const catColor = CAT_ICONS[c]?.accent || R;
              const active = newCat===c;
              return (
                <button key={c} onClick={()=>setNewCat(c)}
                  style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 13px", borderRadius:20,
                    background:active?`${catColor}22`:PC.inputBg, border:`1px solid ${active?catColor:PC.border}`,
                    color:active?catColor:PC.text, fontSize:13, fontFamily:"'Jost',sans-serif", cursor:"pointer" }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:catColor, flexShrink:0, boxShadow:active?`0 0 4px ${catColor}99`:"none" }}/>
                  {c}
                </button>
              );
            })}
          </div>
          <div style={{ fontSize:12,color:PC.mu,fontWeight:400,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8 }}>How am I feeling right now?</div>
          <div style={{ overflowY:"auto",marginBottom:10,maxHeight:220,border:`1px solid ${PC.border}`,borderRadius:10 }}>
            {HAWKINS.slice().reverse().map(h=>(
              <div key={h.n} onClick={()=>setFeel(h.n)}
                style={{ display:"flex",alignItems:"center",gap:11,padding:"10px 13px",cursor:"pointer",
                  background:newFeel===h.n?`${h.c}22`:"transparent",borderBottom:`1px solid ${PC.border}` }}>
                <div style={{ width:11,height:11,borderRadius:"50%",background:h.c,flexShrink:0,boxShadow:`0 0 5px ${h.c}99` }}/>
                <span style={{ fontSize:14,color:h.c,flex:1,fontFamily:"'Jost',sans-serif" }}>{h.n}</span>
                <span style={{ fontSize:12,color:PC.mu }}>{h.v}</span>
              </div>
            ))}
          </div>
          {newFeel && (() => { const h = HAWKINS.find(x=>x.n===newFeel); return h ? (
            <div style={{ display:"flex",alignItems:"center",gap:8,padding:"9px 13px",borderRadius:8,background:`${h.c}22`,border:`1px solid ${h.c}55`,marginBottom:11 }}>
              <div style={{ width:11,height:11,borderRadius:"50%",background:h.c,flexShrink:0 }}/>
              <span style={{ fontSize:12,color:PC.text,fontFamily:"'Jost',sans-serif" }}>{h.v >= 200 ? "Expansive — you're above the line ✦" : "Contractive — the audio will lift you"}</span>
            </div>
          ) : null; })()}
          <input value={newFeelText} onChange={e=>setFeelText(e.target.value)} placeholder="In your own words — e.g. 'I'm feeling anxious about this'"
            style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:`1px solid ${PC.border}`, background:PC.inputBg, color:PC.text, fontSize:13, fontFamily:"'Jost',sans-serif", marginBottom:12, outline:"none" }}/>
          <button onClick={()=>{
            if(!newD.trim()) return;
            if(userTier === "audio" && !isPreview) {
              onUpgrade?.();
              return;
            }
            const before = [newFeel, newFeelText].filter(Boolean).join(" — ");
            setThreads([{id:Date.now(),desire:newD,days:0,done:false,signs:[],track:linkedTrack,category:newCat,feelBefore:before,feelAfter:"",oldBelief:newBelief},...threads]);
            setD(""); setLinked(""); setFeel(""); setFeelText(""); setNewCat("Moneymaxxing"); setNewBelief(""); setAdding(false);
          }} style={{ padding:"11px 22px",background:isDark?"#000":"#1a0a04",border:"none",borderRadius:10,color:"#f2ece4",fontSize:13,fontWeight:400,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>
            {userTier === "audio" && !isPreview ? "Add to Proof Thread — Upgrade to Goddess ✦" : "Add Proof Thread"}
          </button>
          {userTier === "audio" && !isPreview && (
            <div style={{ fontSize:11,color:"#9a8878",marginTop:8,lineHeight:1.5 }}>
              You're on Audio Tier. Log your desire — then upgrade to Goddess to save it to your Proof Thread and track every sign.
            </div>
          )}
        </div>
      )}

      {/* THREAD LIST */}
      {displayedThreads.length===0 && proofFilter!=="all" && (
        <div style={{ background:PC.card,borderRadius:14,padding:"28px 18px",textAlign:"center",marginBottom:10 }}>
          <div style={{ fontSize:13,color:PC.text,fontFamily:"'Jost',sans-serif" }}>No {proofFilter==="manifested"?"manifested":"in progress"} intentions yet.</div>
        </div>
      )}
      {displayedThreads.map(d=>(
        <div key={d.id} onTouchStart={e=>{window.__sx=e.touches[0].clientX;}} onTouchEnd={e=>{if(window.__sx-e.changedTouches[0].clientX>90)deleteThread(d.id);}} style={{ background:PC.cardSolid,borderRadius:14,padding:"14px 14px",marginBottom:10,position:"relative" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10 }}>
            <div style={{ flex:1,minWidth:0 }}>
              {editId===d.id
                ? <div style={{ display:"flex",gap:6,marginBottom:4 }}>
                    <input autoFocus value={editText} onChange={e=>setEditText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&saveEdit(d.id)} style={{ flex:1,background:"#fff",border:"1.5px solid #e8a860",color:"#000",borderRadius:8,padding:"7px 10px",fontSize:14,fontWeight:400,outline:"none",fontFamily:"'Jost',sans-serif" }}/>
                    <button onClick={()=>saveEdit(d.id)} style={{ padding:"7px 12px",background:"#000",border:"none",borderRadius:8,color:"#fff",fontSize:11,fontWeight:400,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>Save</button>
                  </div>
                : <div onClick={()=>{setEditId(d.id);setEditText(d.desire);}} style={{ fontSize:15,fontWeight:400,marginBottom:4,color:PC.text,cursor:"pointer" }}>{d.desire} <span style={{ fontSize:11,opacity:0.45 }}>✎</span></div>}
              <div style={{ display:"flex",alignItems:"center",gap:6,flexWrap:"wrap" }}>
                {d.category && <span style={{ fontSize:10,padding:"2px 9px",background:CAT_GRAD[d.category]||CAT_GRAD.Identity,color:"#000",borderRadius:20,fontWeight:400 }}>{d.category}</span>}
                {d.track && <span style={{ fontSize:11,color:PC.mu,fontWeight:400 }}>♪ {d.track}</span>}
              </div>
              {d.feelBefore && <div style={{ fontSize:11,color:PC.dim,marginTop:6,lineHeight:1.5 }}><b style={{color:PC.mu}}>Before:</b> "{d.feelBefore}"</div>}
              {d.done && d.feelAfter && <div style={{ fontSize:11,color:"#B76E79",marginTop:2,lineHeight:1.5,fontWeight:400 }}><b>After:</b> "{d.feelAfter}"</div>}
            </div>
            <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6,flexShrink:0 }}>
              <button onClick={()=>deleteThread(d.id)} title="Delete" style={{ fontSize:12,width:22,height:22,background:"none",border:"none",color:PC.dim,cursor:"pointer",lineHeight:1 }}>✕</button>
              {d.done
                ? <>
                    <label onClick={()=>undoMarkDone(d.id)} style={{ display:"flex",alignItems:"center",gap:7,cursor:"pointer" }}>
                      <span style={{ width:21,height:21,borderRadius:6,background:"linear-gradient(135deg,#f5e0a0 0%,#e8b870 22%,#d4a090 48%,#c4789a 72%,#B76E79 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:400,color:"#000",boxShadow:"0 0 12px rgba(232,184,112,0.9)" }}>✓</span>
                      <span style={{ fontSize:11,fontWeight:400,color:"#000" }}>Manifested</span>
                    </label>
                    <span style={{ fontSize:9,color:PC.dim,fontWeight:400 }}>tap to undo</span>
                  </>
                : <label onClick={()=>startFinish(d.id)} style={{ display:"flex",alignItems:"center",gap:7,cursor:"pointer" }}>
                    <span style={{ width:21,height:21,borderRadius:6,background:"#fff",border:"2px solid #000",boxShadow:"0 0 10px rgba(232,184,112,0.55)" }}/>
                    <span style={{ fontSize:11,fontWeight:400,color:"#000" }}>Manifested</span>
                  </label>
              }
            </div>
          </div>

          {/* Marking manifested — capture feelAfter */}
          {finishing===d.id && (
            <div style={{ marginTop:10,background:"rgba(200,236,200,0.5)",borderRadius:10,padding:"10px 12px" }}>
              <div style={{ fontSize:11,color:"#B76E79",fontWeight:400,marginBottom:6 }}>IT ARRIVED ✓ — how are you feeling now?</div>
              <div style={{ display:"flex", gap:5, overflowX:"auto", marginBottom:8, paddingBottom:2, WebkitOverflowScrolling:"touch" }}>
                {HAWKINS.slice().reverse().map(h=>(
                  <button key={h.n} onClick={()=>setFeelAfterLevel(h.n)}
                    style={{ flexShrink:0, padding:"5px 10px", borderRadius:14, background:feelAfterLevel===h.n?h.c:"transparent", border:`1px solid ${h.c}`, color:feelAfterLevel===h.n?"#fff":h.c, fontSize:10.5, fontWeight:400, cursor:"pointer", fontFamily:"'Jost',sans-serif", whiteSpace:"nowrap" }}>{h.n}</button>
                ))}
              </div>
              <div style={{ display:"flex",gap:6 }}>
                <input autoFocus value={feelAfterInput} onChange={e=>setFeelAfterInput(e.target.value)} placeholder="Capture this moment, in your own words"
                  onKeyDown={e=>e.key==="Enter"&&confirmFinish(d.id)}
                  style={{ flex:1,background:"#fff",border:"1px solid rgba(26,112,48,0.3)",color:"#000",borderRadius:8,padding:"9px 10px",fontSize:12,outline:"none",fontFamily:"'Jost',sans-serif" }}/>
                <button onClick={()=>confirmFinish(d.id)} style={{ padding:"9px 14px",background:"#B76E79",border:"none",borderRadius:8,color:"#fff",fontSize:11,fontWeight:400,cursor:"pointer",fontFamily:"'Jost',sans-serif" }}>Save ✓</button>
              </div>
            </div>
          )}

          {/* ═══ SIGNS & SYNCHRONICITY LOG — the heart of ProofOS ═══ */}
          <div style={{ marginTop:12,paddingTop:10,borderTop:`1px solid ${PC.border}` }}>
            <div style={{ fontSize:10,color:PC.mu,fontWeight:400,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:6 }}>Signs & synchronicities · {d.signs?.length||0}</div>
            {(d.signs||[]).map((sg,si)=>(
              <div key={si} style={{ display:"flex",alignItems:"flex-start",gap:8,marginBottom:5 }}>
                <span style={{ fontSize:11,color:CAT_COLOR[d.category]||"#e8a860",flexShrink:0,marginTop:1 }}>{sg.img?"📷":sg.audio?"🎤":"✦"}</span>
                <span style={{ fontSize:12,color:C.cr,lineHeight:1.5,flex:1 }}>
                  {sg.text}
                  {sg.img && <img src={sg.img} alt="proof" style={{ display:"block",width:64,height:64,objectFit:"cover",borderRadius:8,marginTop:5,border:"1px solid rgba(0,0,0,0.15)" }}/>}
                  {sg.audio && <audio src={sg.audio} controls style={{ display:"block",width:"100%",maxWidth:220,height:30,marginTop:5 }}/>}
                </span>
                <span style={{ fontSize:10,color:PC.dim,flexShrink:0,fontWeight:400 }}>{sg.date}</span>
              </div>
            ))}
            {!d.done && (
              <div style={{ display:"flex",gap:6,marginTop:8 }}>
                <input value={signInput[d.id]||""} onChange={e=>setSignInput({...signInput,[d.id]:e.target.value})} placeholder="Log a sign, a synchronicity, a shift…"
                  onKeyDown={e=>e.key==="Enter"&&addSign(d.id)}
                  style={{ flex:1,background:PC.inputBg,border:`1px solid ${PC.border}`,color:"#000",borderRadius:8,padding:"9px 10px",fontSize:12,outline:"none",fontFamily:"'Jost',sans-serif" }}/>
                <button onClick={()=>addSign(d.id)} style={{ padding:"9px 14px",background:isDark?"#000":"#1a0a04",border:"none",borderRadius:8,color:"#f2ece4",fontSize:11,fontWeight:400,cursor:"pointer",fontFamily:"'Jost',sans-serif",whiteSpace:"nowrap" }}>+ Add</button>
                <label style={{ padding:"9px 10px",background:"rgba(0,0,0,0.08)",border:"1px solid rgba(0,0,0,0.15)",borderRadius:8,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center" }}>📷
                  <input type="file" accept="image/*" style={{ display:"none" }} onChange={e=>{ const f=e.target.files?.[0]; if(f) addMediaSign(d.id,{img:URL.createObjectURL(f),text:"Photo proof"}); e.target.value=""; }}/>
                </label>
                <button onClick={()=>toggleRec(d.id)} style={{ padding:"9px 10px",background:recId===d.id?"#b03030":"rgba(0,0,0,0.08)",border:"1px solid rgba(0,0,0,0.15)",borderRadius:8,fontSize:13,cursor:"pointer",color:recId===d.id?"#fff":"#000" }}>{recId===d.id?"⏹":"🎤"}</button>
              </div>
            )}
          </div>

          {/* Progress + delete */}
          <div style={{ marginTop:10,height:3,background:"rgba(0,0,0,0.1)",borderRadius:2 }}>
            <div style={{ width:`${Math.min((d.days||0)*5+((d.signs?.length||0)*8),100)}%`,height:"100%",background:"#000",borderRadius:2 }}/>
          </div>
          <button onClick={()=>deleteThread(d.id)} style={{ fontSize:10,color:"#8a2030",background:"none",border:"none",cursor:"pointer",padding:0,fontFamily:"'Jost',sans-serif",marginTop:8,fontWeight:400 }}>Remove thread</button>
        </div>
      ))}
      </>
      )}
    </div>
  );
}

// ── SHOP TAB ──────────────────────────────────────────────────────────────────
function ShopTab({ C }) {
  const products = [
    { name:"Lovemaxxing Guide",      price:"£19", desc:"The specific person, or how you show up in love", cat:"Lovemaxxing" },
    { name:"Moneymaxxing Guide",     price:"£19", desc:"Belief work underneath receiving and earning",     cat:"Moneymaxxing" },
    { name:"Luckygirlmaxxing Guide", price:"£19", desc:"General good-fortune installation",                 cat:"Luckygirlmaxxing" },
    { name:"Sovereignmaxxing Guide", price:"£19", desc:"Answering to no one but you",                       cat:"Sovereignmaxxing" },
    { name:"Confidencemaxxing Guide",price:"£19", desc:"Walking in like you already belong there",          cat:"Confidencemaxxing" },
    { name:"Beautymaxxing Guide",    price:"£19", desc:"The mirror gap, closed",                             cat:"Beautymaxxing" },
    { name:"Healmaxxing Guide",      price:"£19", desc:"Physical or emotional pain, released",               cat:"Healmaxxing" },
    { name:"Sleepmaxxing Guide",     price:"£19", desc:"The overnight identity-install track",               cat:"Sleepmaxxing" },
    { name:"Businessmaxxing Guide",  price:"£19", desc:"Entrepreneur-specific belief work",                  cat:"Businessmaxxing" },
    { name:"Peacemaxxing Guide",     price:"£19", desc:"Nervous system, regulated",                          cat:"Peacemaxxing" },
  ];
  return (
    <div style={{ padding:"16px 16px 40px" }}>
      <div style={{ fontSize:20,fontWeight:400,color:C.cr,marginBottom:4 }}>Shop</div>
      <div style={{ fontSize:13,color:C.mu,marginBottom:20 }}>Digital rituals & resources · One-time purchase</div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
        {products.map((p,i)=>(
          <div key={i} onClick={()=>window.open(BEACONS,"_blank")}
            style={{ background:C.bg2,border:`0.5px solid ${C.border}`,borderRadius:12,overflow:"hidden",cursor:"pointer",transition:"transform 0.15s" }}
            onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
            onMouseLeave={e=>e.currentTarget.style.transform="none"}>
            <div style={{ height:100,overflow:"hidden",position:"relative",display:"flex",alignItems:"center",justifyContent:"center",background:"#000" }}>
              <Thumb title={p.name} cat={p.cat} size={64} radius={12}/>
            </div>
            <div style={{ padding:"10px 12px" }}>
              <div style={{ fontSize:12,fontWeight:400,color:C.cr,marginBottom:3,lineHeight:1.3 }}>{p.name}</div>
              <div style={{ fontSize:11,color:C.mu,marginBottom:8,lineHeight:1.4 }}>{p.desc}</div>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                <span style={{ fontSize:15,fontWeight:400,color:R }}>{p.price}</span>
                <span style={{ padding:"4px 10px",background:OMBRE,backgroundSize:"200%",backgroundPosition:"left",borderRadius:8,color:"#000",fontSize:10,fontWeight:400,fontFamily:"'Jost',sans-serif",display:"inline-flex",alignItems:"center",gap:4 }}>{p.stripe?"Buy now · Stripe":"Buy on Beacons"}<ArrowIcon size={10}/></span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop:14,padding:"12px 14px",background:C.bg3,border:`0.5px solid ${C.border}`,borderRadius:10,textAlign:"center" }}>
        <div style={{ fontSize:12,color:C.mu }}>All products are delivered instantly via Beacons.ai · One-time payment · No subscription required</div>
      </div>
    </div>
  );
}

// ── HELPERS ────────────────────────────────────────────────────────────────────
function Sec({ title, children, C, onShowAll }) {
  return (
    <div style={{ marginBottom:24 }}>
      <div style={{ padding:"0 16px 10px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <span style={{ fontSize:18,fontWeight:400,color:C.cr }}>{title}</span>
        {onShowAll && <button onClick={onShowAll} style={{ fontSize:12,fontWeight:400,color:R,background:"none",border:"none",cursor:"pointer",fontFamily:"'Jost',sans-serif",padding:"6px 4px" }}>Show all</button>}
      </div>
      {children}
    </div>
  );
}
function HRow({ children }) {
  return <div style={{ display:"flex",gap:12,padding:"0 16px",overflowX:"auto",WebkitOverflowScrolling:"touch",scrollbarWidth:"none" }}>{children}</div>;
}
function TCard({ track:t, current, play, playing, isPreview, C, liked, toggleLike, openPlayer }) {
  const isP = current?.id===t.id;
  return (
    <div style={{ flexShrink:0,width:140 }}>
      <div onClick={()=>{play(t); openPlayer?.();}} style={{ position:"relative",marginBottom:8,cursor:isPreview?"not-allowed":"pointer" }}>
        <Thumb title={t.title} cat={t.cat} size={140} radius={8}/>
        {isPreview&&(
          <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.55)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center" }}><Ico.Lock/></div>
        )}
        {!isPreview&&isP&&playing&&(
          <div style={{ position:"absolute",inset:0,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.45)" }}>
            <div style={{ display:"flex",alignItems:"flex-end",gap:2 }}>{[10,18,12,18,10].map((h,i)=><div key={i} style={{ width:3,height:h,background:"#B76E79",borderRadius:1 }}/>)}</div>
          </div>
        )}
        {t.isNew&&<div style={{ position:"absolute",top:6,right:6,padding:"2px 7px",background:OMBRE,color:"#000",borderRadius:20,fontSize:9,fontWeight:400 }}>NEW</div>}
        {!isPreview && (
          <button onClick={e=>{e.stopPropagation();toggleLike(t.id,e);}} style={{ position:"absolute",bottom:6,right:6,width:26,height:26,borderRadius:"50%",background:"rgba(0,0,0,0.55)",border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",padding:0 }}>
            <Ico.Heart on={liked?.has(t.id)}/>
          </button>
        )}
      </div>
      <div onClick={()=>{play(t); openPlayer?.();}} style={{ fontSize:14,fontWeight:400,color:C.cr,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2,cursor:isPreview?"not-allowed":"pointer" }}>{t.title}</div>
      <div style={{ fontSize:12,color:C.mu }}>{t.cat} · {t.dur}</div>
    </div>
  );
}
