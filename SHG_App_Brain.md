# SHG App Brain — Session 2+ (CORRECT VERSION)

> ⚠️ The Session 1 doc with #C8892A gold, Inter font, €14.99, white text is WRONG and outdated. Ignore it entirely. This is the source of truth.

---

## Brand — verified against src/design/tokens.js, 17 Sept 2026

| Token | Value |
|-------|-------|
| Background | #000000 pure black |
| Surface raised | #0a0a0a |
| Border | #1e1e1e |
| Text | #fdf0e8 cream |
| Text secondary | #dcc8b8 |
| Text muted | #b09888 |
| Accent | the LG gradient only — never a solid |

**The LG gradient (the only accent that exists):**
`linear-gradient(135deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)`

Its five stops: `#F5E0A0` champagne · `#E8B870` gold · `#BFA5D8` lilac ·
`#2CB7A7` teal · `#167A6B` deep teal. Use the whole ramp, never one stop alone.

**Font:** `'Jost', sans-serif` everywhere. Weights carry hierarchy.

See CLAUDE.md for the full banned list. This table previously described a
rose-gold and peach system with a serif display face; that system is dead and
must not come back.

---

## Pricing — verified against src/App.jsx, 17 Sept 2026

| Tier | Monthly | Annual |
|------|---------|--------|
| Audio Tier | $49/mo | $470/yr ($39/mo) |
| Goddess Tier | $79/mo | $758/yr ($63/mo) |
| Lifetime Access | $1,000 once | — |

See `SHG_Business_Brain.md` for the Stripe links. If a document disagrees with
`src/App.jsx`, the code is right.

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

## Design decisions — current

- Maxxing carousel: see the carousel skills for the current system
- Preview strip below carousel: black background, cream text
- Wordmark "Self Hypnosis Goddess": LG gradient, Jost
- Announcement banner: the LG gradient, full width, animated drift
- Section alternating: black → `.section-rose` / `.section-peach` (both are
  near-black gradients in tokens.js despite the legacy class names) → black
- Hero title: 3 lines — "Self Hypnosis Goddess" (LG gradient) / "Audio Library"
  (cream) / "(+ ProofOS)" (LG gradient)
- Tagline: "The Spotify for your subconscious mind"

The peach / rose-gold / Cormorant-italic descriptions that used to sit here were
from a dead system. Nothing on the site should use them.

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
