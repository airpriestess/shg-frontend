# SHG App Brain — Session 2+ (CORRECT VERSION)

> ⚠️ The Session 1 doc with #C8892A gold, Inter font, €14.99, white text is WRONG and outdated. Ignore it entirely. This is the source of truth.

---

## Brand — LOCKED

| Token | Value |
|-------|-------|
| Background | #000000 pure black |
| Rose gold | #B76E79 |
| Peach | #d4a090 |
| Peach light | #e8c0a8 |
| Cream text | #f2ece4 |
| Muted text | #786860 |
| Card surface | #06040c |
| Border | #1c1828 |
| Font UI | Jost 300–800 |
| Font wordmark/headlines | Cormorant Garamond italic |

**Never use:** #C8892A (old gold) · brown · orange · warm grey · Inter · white (#ffffff) as text on dark · euros

---

## Pricing — LOCKED (GBP only, never euros)

| Tier | Price | Stripe |
|------|-------|--------|
| Audio Tier | £19/mo | https://buy.stripe.com/8x2bJ1c3L2jQ2lb5CU7AI00 |
| Goddess Tier | £33/mo | https://buy.stripe.com/6oUfZh3xfcYu5xn4yQ7AI01 |
| Lifetime Access | £500 once | https://buy.stripe.com/00w8wP2tbgaG3pffdu7AI02 |

---

## Tech stack

> Verified against the running code on 17 Sept 2026. Supabase and Vercel were
> listed here but are NOT used anywhere live — see "Not used" below.

- Frontend: React + Vite — inline JSX styles only, NO Tailwind, NO CSS modules
- CSS: export const CSS in tokens.js → <style>{CSS}</style> in App.jsx
- Hosting: Cloudflare Pages (auto-deploys from `main`)
- Backend: Cloudflare Workers
  - `shg-auth-worker` — signup / login / logout / me
  - `shg-quiz-worker` — quiz scoring, uses the Anthropic API
  - `shg-audio-worker` — serves the track files
- Database: Cloudflare D1 (bound as `env.DB` in the workers)
- Audio: served by `shg-audio-worker.airpriestess.workers.dev`
- Email: Nitrosend (`api.nitrosend.com`) for transactional
- Shop: Beacons.ai
- Payments: Stripe payment links
- One Zapier webhook: LuckyGirl quiz capture (`src/pages/LuckyGirl.jsx`)
- Code: GitHub (`airpriestess/shg-frontend`, public)

## Not used — do not reintroduce
- **Supabase.** Never deployed. `shg-backend` is written against it but was
  never switched on. The real database is D1.
- **Vercel.** Hosting is Cloudflare Pages.

---

## Live audio files

- Spoilt Goddess (Melodic House · EMDR · 528hz): SPOILT INSTAGRAM 13.04.2026.WAV
- Subliminal (music only · Delta): 29.06.2026-6.mp3

Base URL: https://shg-audio-worker.airpriestess.workers.dev/

---

## Design decisions — locked

- Maxxing carousel: PEACH/ROSE GOLD background with BLACK text (not dark bg with light text)
- Each carousel category gets its own unique peach/rose shade
- Preview strip below carousel: dark (#000) background with peach text
- Wordmark "Self Hypnosis Goddess": ombre shimmer peach→rose gold, animates every 3.5s
- Announcement banner: linear-gradient peach→rose gold left to right
- Section alternating: black → visible rose-dark (#130818) → black
- Hero title: 3 lines — "Self Hypnosis Goddess" (ombre) / "Audio Library" (cream) / "(+ ProofOS)" (rose)
- Tagline: "The Spotify for your subconscious mind"

---

## Mobile rules — CRITICAL

1. useMobile() hook: window.innerWidth <= 680
2. Grid helpers: G2/G3/G4/GPRICE/GPROOF — NEVER use inline gridTemplateColumns on sections
3. Nuclear CSS: body [style*="grid-template-columns"] { display:flex!important; flex-direction:column!important; } at ≤680px
4. ProofOS 4 steps: 2×2 grid on mobile (not 4 columns)
5. Mobile layout still needs investigation — grids may not all be stacking

---

## CSS pattern

```js
export const CSS = `...`; // tokens.js
<style>{CSS}</style>      // App.jsx — NEVER document.createElement
```

---

## Pending

- [ ] Mobile grid stacking — still broken on phones
- [ ] Real images replacing placeholders (hero, problem cards, proof wall, reshma photo)
- [ ] Conscious/subconscious mind branded diagram
- [ ] Stripe webhook → D1 (not built)
- [x] Real auth — shg-auth-worker + D1, live
- [ ] Email automation — Nitrosend sequences
- [ ] 5-email welcome sequence
- [ ] Formats section — visual
- [ ] DNA activation mention on landing
- [ ] ProofOS worked example copy
