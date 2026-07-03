# SHG App Brain — Instructions

You are the app brain for Self Hypnosis Goddess by Reshma Oracle.
You build and maintain reshmaoracle.com — the Goddess Portal membership web app.

> **⚠️ NOTE TO FUTURE CLAUDE:** An old version of this doc exists on Reshma's local machine with #C8892A gold, Inter font, and €14.99 pricing. That file is wrong. This GitHub version is the only source of truth. Never use the old values.

---

## Brand positioning

> **"The Spotify for your subconscious mind."**

Self Hypnosis Goddess is a private audio membership. Original hypnosis tracks layered beneath melodic house music. EMDR + binaural beats + Reshma's voice. Works while you sleep. No effort required. Just press play.

---

## ⚠️ BRAND TOKENS — LOCKED. NEVER CHANGE.

| Token | Value |
|-------|-------|
| Background | #000000 pure black |
| Rose gold (primary accent) | #B76E79 |
| Peach (secondary accent) | #d4a090 |
| Cream (body text) | #f2ece4 |
| Muted text | #786860 |
| Surface / card | #070608 |
| Border | #1e1a28 |
| Font — ALL UI (menus, buttons, labels, caps) | Jost 300–800 |
| Font — wordmark / headlines / quotes | Cormorant Garamond italic 300–500 |

**PROHIBITED COLOURS:** #C8892A (old gold — Session 1, wrong), brown, orange, warm brown, hot pink, purple, cyan, white background, Inter (removed)

---

## ⚠️ PRICING — LOCKED. GBP ONLY. NEVER EUROS.

| Tier | Price | Stripe link |
|------|-------|------------|
| Audio Tier | £19/mo | https://buy.stripe.com/8x2bJ1c3L2jQ2lb5CU7AI00 |
| Goddess Tier | £33/mo | https://buy.stripe.com/6oUfZh3xfcYu5xn4yQ7AI01 |
| Lifetime Access | £500 once | https://buy.stripe.com/00w8wP2tbgaG3pffdu7AI02 |
| Inner Circle (future) | £197/mo | not live |

**NEVER use €14.99, €33, or any euro amount.**

---

## Tech stack

| Layer | Tech |
|-------|------|
| Frontend | React + Vite |
| Styling | Inline JSX styles only. NO Tailwind. NO CSS modules. |
| CSS system | `export const CSS` in tokens.js → `<style>{CSS}</style>` in JSX |
| Backend | Node.js + Express |
| Database + Auth | Supabase (project: qtwvslrwmreazmrdktsn) |
| Payments | Stripe |
| Hosting | Vercel |
| Audio storage | Supabase Storage (bucket: tracks) |
| Emails | Beacons.ai → Zapier → Stripe webhook |

---

## GitHub repos

- Frontend: github.com/airpriestess/shg-frontend
- Backend: github.com/airpriestess/shg-backend

---

## Supabase — LIVE

- Project ID: qtwvslrwmreazmrdktsn
- Tables: profiles · tracks · subscriptions · play_history · manifestations
- RLS: enabled on all tables
- Storage bucket: tracks (public)

**Live audio files:**
- Spoilt Goddess (Melodic House · EMDR · 528hz): `SPOILT INSTAGRAM 13.04.2026.WAV`
- Subliminal (music only · Delta): `29.06.2026-6.mp3`

---

## Mobile rules — CRITICAL

1. `useMobile()` hook: `window.innerWidth <= 680`
2. Grid helpers: G2 / G3 / G4 / GPRICE / GPROOF — NEVER use inline `gridTemplateColumns` on section containers
3. Nuclear CSS in tokens.js: `body [style*="grid-template-columns"] { display:flex!important; flex-direction:column!important; }` at ≤680px
4. ⚠️ Mobile layout currently still broken — needs investigation

---

## CSS pattern — NON-NEGOTIABLE

```js
export const CSS = `...styles...`;  // in tokens.js
<style>{CSS}</style>  // in App.jsx
```

NEVER use `document.createElement`. NEVER use `src/index.css`.

---

## Naming — locked

- "Lifetime Access" (never Founder, never Early Bird)
- "ProofOS" (manifestation tracker — Goddess tier)
- CTAs: "Start listening →" / "Activate Goddess Tier →" / "Claim Lifetime Access →"
- "Proof" not "receipts"
- No exclamation marks ever

---

## Brand voice

Sovereign. First person. Present tense. No trying — just being.
Inner language: lovemaxxing · moneymaxxing · of course he did · highest timeline · delusional (compliment) · void state · shifting · EIYPO · lucky girl

---

## Landing page — current section order

1. Announcement banner (Lifetime Access £500)
2. Nav (wordmark shimmer + Sign In + Join Now shaking)
3. Hero (3-line title + "The Spotify for your subconscious mind" + audio player + CTA + image placeholder)
4. "As seen on YouTube" strip
5. Hero marquee (100 affirmation lines scrolling + random flash)
6. Problem section ("The problem isn't your effort. It's your brainwave state.")
7. Brain state image placeholder
8. ProofOS intro (4 steps: Listen → Link → Capture → Mark manifested)
9. Melodic House USP (centered, large)
10. Maxxing carousel (auto-rotates 6 categories)
11. Proof wall (6 real-looking cards: bank / text / skin / angel / voice / transfer)
12. Timeline (Day 1 / 3 / 7 / 14 / 30+ — vertical rows)
13. Before/After self-concept table (massive text, thought bubbles)
14. Audio vault preview (Spoilt plays · Subliminal plays · locked)
15. Science section
16. Testimonials (★★★★★, no names)
17. Pricing (Audio £19 / Goddess £33 / Lifetime £500 + Stripe links)
18. FAQ (12 questions, accordion)
19. Final CTA

---

## Portal (logged-in members)

- AppShell with sticky nav + bottom mobile nav
- Dashboard (ProofOS): stats, intentions, timeline, proof capture
- Audio Vault: all tracks, category filters, player
- Proof Threads: per-intention tracking
- Settings / Account: billing, tier, sign out

---

## Images needed (currently placeholders)

| # | Location | Description |
|---|----------|-------------|
| 1 | Hero | Woman with headphones sleeping, dark moody, ethereal |
| 2 | Problem card 1 | Brain theta wave / scan visual |
| 3 | Problem card 2 | Woman journaling / scripting |
| 4 | Problem card 3 | Tracker / dashboard visual |
| 5 | Proof wall | Reshma's real proof (bank transfers, messages) |
| 6 | About | Reshma photo |
| 7 | Self-concept | Conscious/subconscious mind diagram |

---

## Pending (not yet built)

- [ ] Mobile layout — grid not stacking on phones
- [ ] Real images replacing all placeholders
- [ ] Stripe webhook → Supabase (file written, not deployed)
- [ ] Real Supabase auth (currently demo mode)
- [ ] Alternating peach/black section backgrounds (visual refinement)
- [ ] Dashboard portal mockup on landing page
- [ ] Formats section — visual not text
- [ ] DNA activation mention
- [ ] ProofOS specific worked example on landing
- [ ] Beacons.ai → Zapier → Stripe email automation
- [ ] 5-email welcome sequence (structure mapped, not written)
- [ ] Conscious/subconscious mind branded diagram
- [ ] "What people are saying" — enlarge further
