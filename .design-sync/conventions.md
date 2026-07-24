# Self Hypnosis Goddess — design system conventions

A **dark, editorial** design system for the SHG membership app (React). Screens
sit on near-black (`#000`) with warm cream text and a "Lucky Girl" gold → teal
palette. Two typefaces: **Jost** (all UI text, weights 300–800) and **Cormorant
Garamond italic** for elegant display/wordmark headings.

## Setup

- **No provider is required for styling.** Component styles are self-contained
  (inline styles compiled into the bundle) plus a global stylesheet of utility
  classes and `@font-face`. Just import from the library and render.
- A few components read React context at runtime, not for styling: routing
  (`react-router`) and auth. When you build a full app, wrap it in a router and
  the app's `AuthProvider`; individual components render without them.
- The global stylesheet ships the fonts and the utility classes below — read it
  before styling your own layout glue: `_ds/<folder>/styles.css` and its imports.

## The styling idiom — inline styles + a small utility-class set

This DS does **not** use a CSS-class-per-component system and does **not** theme
through props. Components carry their own look; for your **own layout glue**,
match the system by using these exact hex tokens in inline styles, plus the
shipped utility classes. Do not invent new class names — only these exist.

**Color tokens** (use these literal values):

| Role | Value |
|---|---|
| Page background | `#000000` (soft: `#050505`, raised card: `#0a0a0a`) |
| Text primary / secondary / muted / faint | `#f2ece4` / `#dcc8b8` / `#b09888` / `#786860` |
| Gold (primary accent) | `#C8860A` (warm amber `#C8960A`) |
| Teal-green (the "rose"/accent) | `#2CB7A7` |
| Lavender-blue | `#5B8DB8` |
| Deep teal | `#167A6B` |
| Success | `#4a9a5a` |
| Borders | `1px solid #1e1e1e` (accent border `rgba(44,183,167,0.15)`) |
| Signature gradient | `linear-gradient(110deg,#C8960A,#5B8DB8,#167A6B)` |
| Button/CTA gradient | `linear-gradient(135deg,#5B8DB8,#2CB7A7)` (text `#000`) |

**Utility classes** (from the global stylesheet — real names, use as-is):

| Class | Purpose |
|---|---|
| `.wm` | Cormorant Garamond italic — display/wordmark headings |
| `.wm-shimmer` | gradient-filled (clipped) text for the wordmark |
| `.fade` | fade-in-up entrance |
| `.section-wrap` | centered max-width (1200px) section container with responsive padding |
| `.grid-2` / `.grid-3` / `.grid-4` | responsive grids (collapse to a column ≤680px) |
| `.price-grid` / `.proof-grid` | 3-up pricing / proof thumbnail grids |
| `.ring` | breathing-ring animation (used by `Rings`) |

Typography: set `fontFamily:"'Jost',sans-serif"` for UI text (it's the default on
`body`); use `className="wm"` for Cormorant italic display text. Uppercase
letter-spaced eyebrows (`Label`) use `fontSize:11, fontWeight:700,
letterSpacing:"0.1em", textTransform:"uppercase"`.

## Build with the library components, not raw elements

Reach for these before hand-rolling markup (see each component's `.d.ts` +
`.prompt.md` for the full API):

- **`Btn`** — `variant`: `primary` | `champagne` (both gradient) | `ghost` |
  `soft` | `danger`; `size`: `sm` | `md` | `lg`; `full`; `disabled`.
- **`Card`** — surface container; `premium` (raised gradient), `hover`, `onClick`.
- **`Pill`** — status/tag chip; `color`: `rose` | `champagne` | `success` |
  `danger` | `muted` | `blood`.
- **`StatCard`** (`icon/value/label/sub/color`), **`ProgressBar`**
  (`value/max/color`), **`EmptyState`** (`icon/title/body/cta/onCta`),
  **`Modal`** (`open/title/onClose/width`), **`LockCard`** (upsell),
  **`FormField`** + **`Label`**, **`Divider`**, **`WaveForm`** (`playing`),
  **`ArrowIcon`** / **`ExternalArrowIcon`** (`size/color`).

### Idiomatic snippet

```jsx
import { Card, Pill, Btn } from '<library>';

<Card style={{ padding: 24 }}>
  <Pill color="champagne">528hz</Pill>
  <div style={{ fontSize: 20, fontWeight: 700, color: '#f2ece4', margin: '12px 0 6px' }}>
    Money Finds Me First
  </div>
  <div style={{ fontSize: 14, color: '#b09888', lineHeight: 1.7 }}>
    Subconscious reprogramming for receiving — layered with 528hz frequency.
  </div>
  <Btn variant="champagne" size="sm" style={{ marginTop: 16 }}>Play</Btn>
</Card>
```

Larger app screens (Dashboard, AudioVault, ProofThreads, SpotifyPortal, the
`*Screenshot` mockups) ship as whole components — compose them directly rather
than rebuilding their internals.
