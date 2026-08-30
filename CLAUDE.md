# SHG Frontend — Rules for Claude

## Brand rules (always in force)
- Colors: ONLY black (#000/#0a0a0a), cream (#fdf0e8), and the LG gradient
  `linear-gradient(135deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)`.
  No grey, no solid brown/mauve, no other colors on text or backgrounds.
- **SOLID (non-gradient, non-black, non-cream) colors are completely banned on this
  site and in the app.** Never introduce a flat/solid accent color (a plain teal,
  purple, gold, red, etc. used by itself) anywhere — buttons, badges, headings,
  icons, borders. If something needs an accent, it is either the LG gradient, or
  black, or cream. This includes accidental solid colors caused by a bug — see the
  gradient-text pitfall below.
- **Gradient-text pitfall (a real bug that shipped and had to be fixed):** applying
  the LG gradient to *short* text via `backgroundSize:"300% 300%"` + an animated
  `background-position` drift can render as a near-solid flat color at certain
  points in the animation cycle — because a 300%-wide gradient viewed through a
  narrow (short-text) window only shows a thin slice of the spectrum at any given
  moment, and that slice can land entirely on one or two adjacent stops (e.g. all
  teal). This is NOT an acceptable multi-hue gradient, it just looks like a solid
  color bug. For short headline/emphasis text (a few words), use a STATIC
  full-spectrum gradient instead: `backgroundSize:"100% 100%"` with no animation,
  which guarantees the complete 5-stop spectrum is always visible across the text.
  Reserve the animated drift (`backgroundSize:"300% 300%"` + `animation`) for
  either long-running text (a full sentence/headline that's wide enough to always
  show multiple stops) or full-width bars/backgrounds (the announcement banner),
  where the width guarantees the whole spectrum reads at any animation phase.
- Font: `'Jost',sans-serif` everywhere. No Cormorant Garamond, no italics, no Futura/Century Gothic.
- Text is always cream or LG gradient — never grey.

## One shared header, everywhere — do not fork this again
Every page must use `src/components/SiteHeader.jsx` (banner + nav, with the
Join Waitlist CTA and Claim Free Gift CTA) — this is the ONLY banner/nav
implementation on the site. It was previously reinvented per-page (About had
a stale two-line banner with no CTA button; Science/Library used a bare sticky
nav with no banner at all; Events/Shop had their own inline `SHGNav`), which is
exactly how the site drifted out of sync with itself and caused a real user
complaint ("it doesn't align with the homepage or any of the other pages").
When adding a new page, import and render `<SiteHeader isMobile={isMobile}/>`
at the top — never write a new banner or nav from scratch. If the shared
header itself needs to change, change `SiteHeader.jsx` once; every page picks
it up automatically. Pages using it must reserve top space with padding of
`calc(${isMobile?"44px":"48px"} + 54px + ...your own spacing... + env(safe-area-inset-top,0px))`
since the banner+nav are `position:fixed`.

## SECURITY — hard rule, no exceptions
`workers/shg-auth-worker.js` GO_LINKS must NEVER be modified.

## Mobile is not an afterthought — it is a second deliverable

Every visual change to `App.jsx` or any page component touches **two layouts**:
the desktop nav/hero flow and the compressed mobile one driven by the
`isMobile` flag. A change is not finished until both have been checked —
"looks right on my desktop preview" is not a completion signal.

### Rules for any change involving fixed-position bars, nav, or banners
1. Never rely on `whiteSpace:"nowrap"` + long copy at a fixed/auto width on
   mobile. Long uppercase tracked text (e.g. announcement banners) WILL
   overflow narrow viewports. Either:
   - shorten the copy conditionally (`isMobile ? "short" : "long"`), or
   - let it wrap, or
   - constrain width and ellipsis it.
2. Any element inside a fixed-height, fixed-position bar (banner, nav) must
   fit at **320px** viewport width (iPhone SE / smallest common phone) with
   zero horizontal overflow and zero clipped buttons. 375px and 390px are
   not sufficient test widths — 320px is the floor.
3. Buttons/pills/CTAs inside those bars need mobile-specific `padding`,
   `fontSize`, and `letterSpacing` — desktop values are almost always too
   large to fit two buttons + a logo + a hamburger on a 320–375px screen.

### Mandatory verification before saying a UI change is "done"
Do NOT tell the user a layout/UI fix is complete without actually rendering
it. The steps:
1. `npm run build` (catch build errors, not just visual guesses).
2. `npx vite preview --port <port>` in the background.
3. Screenshot at **320px width** (mobile floor) and **desktop width (≥1280px)**
   using Playwright (`/opt/pw-browsers/chromium` is preinstalled — see below
   for the working invocation, since `npx playwright` is not installed as a
   local dependency in this repo).
4. Actually look at both screenshots. Check for: clipped/cut-off text,
   overlapping elements, buttons running off-screen, wrong font rendering.
5. Only after visually confirming both screenshots are clean should you
   report the fix as done. If you can't screenshot (no browser access, no
   dev server), say so explicitly instead of claiming it's verified.

### KNOWN LANDMINE — the "nuclear mobile override" in `src/design/tokens.js`
Around line 154, inside `@media(max-width:680px)`, there is:
```css
body [style*="grid-template-columns"]{display:flex!important;flex-direction:column!important;flex-wrap:nowrap!important;}
```
This rule forcibly collapses **any** element anywhere in the app that has an
inline `grid-template-columns` style into a single column below 680px width —
no exceptions, no opt-out. It was almost certainly added to firefight one
specific broken grid and now silently wrecks every other inline CSS grid on
mobile (this is what broke the 2-column ProofOS stat tiles — they had
`display:"grid", gridTemplateColumns:"repeat(2,1fr)"` inline and got stomped
into a single stacked column despite the JSX being correct).
**Rule: never use an inline `style={{ display:"grid", gridTemplateColumns:... }}`
for anything that needs to keep more than 1 column below 680px.** Use flexbox
instead (`display:"flex", flexWrap:"wrap"` with each child sized via
`flex:"1 1 calc(50% - Npx)"`), which this override does not match. If a grid
layout is genuinely required, it must use a class name (not inline style) so
it doesn't match `[style*="grid-template-columns"]` — but check the
`.grid-2/.grid-3/.grid-4` class rules in the same file first, since those are
ALSO forced to `display:flex` on mobile by design (lines ~105-108) and may
need their own review.

### Working Playwright invocation in this environment
```bash
node -e "
const {chromium} = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage({ viewport: { width: 320, height: 700 } });
  await page.goto('http://localhost:<port>', { waitUntil: 'networkidle' });
  await page.screenshot({ path: '/path/to/screenshot.png' });
  await browser.close();
})();
"
```
(`import 'playwright'` via ESM fails here — package isn't resolvable as a
project dependency. Use `require()` with the absolute path above.)

## Git hygiene
- Never commit `dist/` build artifacts as part of a source change — they
  cause spurious merge conflicts. `git checkout -- dist/ && git clean -fd dist/`
  before committing if `npm run build` was run locally.
- Cloudflare Pages auto-deploys from `main` on push — no manual deploy step.
