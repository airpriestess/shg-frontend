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

## Fonts

- Cormorant Garamond + Jost load via a remote Google Fonts `@import` at the top
  of the stylesheet (`[FONT_REMOTE]`) — they load at runtime, nothing to ship.

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
