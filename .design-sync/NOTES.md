# design-sync notes — SHG (shg-frontend)

This repo is a **React + Vite app**, not a packaged component library. It has no
Storybook, no TypeScript, and no library build — so the sync runs the **package
shape in synth-entry mode** (bundles straight from `src/`).

## Setup gotchas (re-sync must honor these)

- **Self-symlink required.** The converter resolves the package at
  `node_modules/<pkg>`, but this repo is the package and isn't self-installed.
  Recreate the symlink on every fresh clone before building:
  `ln -sfn "$(pwd)" node_modules/shg-frontend`
  (gitignored; the repo commits `node_modules`, so it must not be tracked).
- **`export default` barrel.** Synth-entry emits `export * from <file>`, which
  drops `default` exports. 21 of the 42 components (all `src/pages/*` plus
  `AnalyticsBoard`, `AuthGate`, `CreateThreadModal`, `DesktopMockup`,
  `ErrorBoundary`, `HamburgerMenu`, `KnowledgeGuide`, `LandingProofWall`,
  `PortalScreenshot`, `ProofWallScreenshot`) are default exports. `prep.mjs`
  regenerates `.design-sync/ds-entry.jsx` (an `extraEntry`) re-exporting each as
  a named export so they reach `window.SHG`. The `[EXPORT_COLLISION]` warning
  the build prints for these is a **false positive** — the main package's
  `export *` never actually exports those names (defaults are dropped), so the
  barrel's binding is the only one and it's the real component.
- **CSS lives in JS.** The authoritative runtime stylesheet is the `CSS` string
  exported from `src/design/tokens.js` (injected via `<style>{CSS}</style>` in
  `App.jsx`). `src/index.css` is dead (imported nowhere). `prep.mjs`
  materializes `CSS` → `.design-sync/ds-styles.css`, wired via `cfg.cssEntry`.
  Both generated files (`ds-styles.css`, `ds-entry.jsx`) are gitignored and
  reproduced by `prep.mjs` (`cfg.buildCmd`), so nothing rots on re-sync.
- **Provider.** `SHGPreviewProvider` (`.design-sync/preview-support.jsx`) wraps
  every preview in `MemoryRouter` + the real `AuthProvider`. Only `AuthGate` /
  `SpotifyPortal` read auth; several pages read router. The Supabase client is
  constructed with hardcoded creds and `AuthProvider` renders children
  unconditionally, so auth's async network calls never block a render.
- **@types/react** must be present in the repo `node_modules` for prop
  extraction (`npm i -D @types/react --no-save`; gitignored). Recreate the
  self-symlink afterward — npm prunes it as extraneous.
- **Playwright**: the pre-installed Chromium at `/opt/pw-browsers` is build
  **1194** → install `playwright@1.56.1` in `.ds-sync` (do NOT run
  `playwright install`; the browser is already there).

- **source-kit fork.** `.design-sync/overrides/source-kit.mjs` drops app-bootstrap
  files (`createRoot`/`hydrateRoot`/`ReactDOM.render`) from the synth entry.
  Without it, `src/main.jsx`'s top-level `createRoot(...).render()` runs on bundle
  load, throws (no `#root` in the smoke/preview harness), and poisons
  `window.SHG` (every component then fails `[BUNDLE_EXPORT]`). The fork imports
  `ts-morph`/`esbuild`, so a fresh clone also needs
  `ln -sfn ../.ds-sync/node_modules .design-sync/node_modules` (gitignored).

## Fonts (self-hosted)

- Cormorant Garamond + Jost are **self-hosted** in `.design-sync/fonts/` (14 latin
  woff2 + `fonts.css`), wired via `cfg.extraFonts`. `prep.mjs` strips the remote
  Google Fonts `@import` from the generated stylesheet. Reason: the render
  harness's Chromium does **not** use the proxy, so a remote font `@import` blocks
  page load and times out (~12s/preview). Self-hosting fixed the flakiness AND
  renders previews in the real brand fonts. Jost is a variable font (its 6
  weight `@font-face` rules share one woff2 — expected). The `fonts/` woff2 +
  `fonts.css` are committed (durable) — the source of truth; re-download from
  Google Fonts (browser UA, `latin` subset only) only if a weight goes missing.

## Sync-time corrections

- **WaveForm** sets its bar heights inline but no width, so the flex-child bars
  collapse to 0px and the waveform is invisible everywhere (a latent bug in the
  shipped component). `prep.mjs` appends `.wave span{width:3px;...}` to the
  stylesheet so the component renders as intended. If the upstream component
  adds its own bar width, drop this from `prep.mjs`.

## Per-component preview notes

- **PushPromptBanner** ships the floor card: it `return null`s unless the browser
  notification permission is `default` and un-subscribed — unreachable in headless
  Chromium (permission is `denied`/`unavailable`). Re-author only if the harness
  gains a way to seed notification permission.
- **HamburgerMenu** preview shows the styled trigger only; its drawer opens on
  click (no `open` prop), so the open state can't render statically.
- **SpotifyPortal** needs `initialTab="home"` (valid tabs: home/search/library/
  proof/analytics — NOT "dashboard") + `forceMode="desktop"` + `userTier="goddess"`
  to render populated content.
- **ProofWall** (live page) is Supabase-driven; with no backend it shows its
  chrome + "Loading your vault…". The rich proof-wall visuals live in the
  self-contained `ProofWallScreenshot` / `LandingProofWall` components instead.
- **Dashboard** renders in its own light-pink ProofOS theme (component design),
  unlike the otherwise dark DS — this is faithful, not a bug.
- **Modal / CreateThreadModal / PhotoProofModal / VoiceProofModal** are full-screen
  mobile sheets rendered via `cardMode:"single"`; their title bar clips slightly
  in the card frame — cosmetic, content is fully styled.
- Sample data (`AUDIOS`, `PROOF_ASSETS`, `PROOF_THREADS`, `DEMO_ANALYTICS`) is on
  `window.SHG`; previews import it from `'shg-frontend'`. Pages that take internal
  sample data render full screens from callback props alone.

## Known render warns

- `[FONT_REMOTE]` no longer expected (fonts self-hosted). If it reappears, the
  remote `@import` strip in `prep.mjs` regressed.
- Tiny/thin cards are expected and triaged-good for: PushNotificationToggle,
  ProofThumbnailStack, HamburgerMenu (see per-component notes).
- **ErrorBoundary** is flagged `bad` by the render check (`firstErr: "Something
  went sideways"`) — this is EXPECTED: the preview throws on purpose (via a
  `Boom` child) to render the error-boundary fallback, and React re-throws to
  `window.onerror` in dev. The card renders the full fallback UI correctly
  (~350KB PNG). Triaged good; do not "fix".
- **Science** uses `cfg.overrides.Science = {"cardMode":"column"}` — its 3-up
  feature grid overflowed the default card cell (`[GRID_OVERFLOW]`).

## Re-sync risks

- The DS is dark-themed: the stylesheet sets `body{background:#000}` and there
  are aggressive `@media(max-width:680px)` "nuclear" overrides that flatten any
  inline `grid-template-columns` at narrow widths — preview cards render fine at
  normal widths; watch layout if a card viewport is forced very narrow.
- Tokens are a JS object (`T` in `tokens.js`), not CSS custom properties — no
  `var(--*)`, so there's no token stylesheet to ship; token vocabulary is
  documented in the conventions header instead.
- Component prop contracts are weak by construction (plain JSX, no types) —
  `<Name>.d.ts` bodies are inferred, not authored. Add `cfg.dtsPropsFor.<Name>`
  if a specific component's API contract matters to the design agent.
