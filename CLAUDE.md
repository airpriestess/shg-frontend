# SHG Frontend — Rules for Claude

## Brand rules (always in force)
- Colors: ONLY black (#000/#0a0a0a), cream (#fdf0e8), and the LG gradient
  `linear-gradient(135deg,#F5E0A0 0%,#E8B870 22%,#BFA5D8 52%,#2CB7A7 78%,#167A6B 100%)`.
  No grey, no solid brown/mauve, no other colors on text or backgrounds.
- Font: `'Jost',sans-serif` everywhere. No Cormorant Garamond, no italics, no Futura/Century Gothic.
- Text is always cream or LG gradient — never grey.

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
