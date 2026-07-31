# SHG Carousel Generator

Generates Instagram carousels for Self Hypnosis Goddess.
Output: swipeable 420×560 HTML preview → 1080×1440 PNG export.

---

## Design rule — read this first

From `SHG_App_Brain.md §Design decisions — locked`:

> **Maxxing carousel: PEACH/ROSE GOLD background with BLACK text (not dark bg with light text)**
> Each carousel category gets its own unique peach/rose shade.
> Preview strip below carousel: dark (#000) background with peach text.

**This overrides the colour system in the instagram-carousel skill.**
All slides (01–09) use a peach/rose background with `color: #000`.
Slide 10 (CTA) uses the dark surface `#06040c` with cream `#f2ece4` text.

---

## Step 1 — always load the content skill first

```
/instagram-carousel
```

That skill owns all content rules: categories, affirmation writing, hook formulas, caption formula, and hashtag bank. Load it before writing any copy.

---

## Step 2 — lock copy with the user

Confirm before building:
- Category
- Hook line (slide 01)
- 8 affirmations (slides 02–09)
- Which shade from the table below

---

## SHG slide background reference

| Category | CSS value | Text |
|----------|-----------|------|
| Lovemaxxing | `#F2C8C0` | `#000` |
| Beautymaxxing | `#F0D0C8` | `#000` |
| Facemaxxing | `#F0C0C8` | `#000` |
| Erosmaxxing | `#E8B8C8` | `#000` |
| Stylemaxxing | `#E8D0D8` | `#000` |
| Moneymaxxing | `#E8D8B0` | `#000` |
| Businessmaxxing | `#E0D0B0` | `#000` |
| Desiresmaxxing | `#E8C0B8` | `#000` |
| Bodymaxxing | `#E0D0C0` | `#000` |
| Skinnymaxxing | `#EAD8D0` | `#000` |
| Wellnessmaxxing | `#D8E0D8` | `#000` |
| Healmaxxing | `#D4E8E4` | `#000` |
| Selfmaxxing | `#D8C8E0` | `#000` |
| Sovereignmaxxing | `#D0B8B0` | `#000` |
| Confidencemaxxing | `#D8B8B0` | `#000` |
| Lifemaxxing | `#E0C8C0` | `#000` |
| Singlemaxxing | `#E4D4C4` | `#000` |
| Friendmaxxing | `#D8E8E0` | `#000` |
| Intuitionmaxxing | `#D4C8E8` | `#000` |
| Studymaxxing | `#D8DCF0` | `#000` |
| Peacemaxxing | `#D8E4F0` | `#000` |
| Sleepmaxxing | `#C8CCE8` | `#000` |
| DNAmaxxing | `#CCE4E8` | `#000` |
| Luckygirlmaxxing | `linear-gradient(135deg, #F0D8C0, #E0A8A0)` | `#000` |
| **CTA (slide 10)** | `#06040c` | `#f2ece4` |

---

## Step 3 — build the HTML

Create: `carousels/<kebab-slug>/index.html`

Slug format: `<category>-<short-topic>` e.g. `lovemaxxing-he-chooses-me`

Use the template below. Only change slide backgrounds and text content.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=420">
<title>CAROUSEL_TITLE — SHG</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700;800&family=Cormorant+Garamond:ital,wght@1,400;1,500;1,600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:#000;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:'Jost',sans-serif;user-select:none}

/* ── Frame ── */
.frame{width:420px;background:#06040c;border-radius:14px;overflow:hidden;box-shadow:0 0 0 1px #1c1828}

/* ── Viewport + track ── */
.viewport{width:420px;height:560px;overflow:hidden;position:relative}
.track{display:flex;height:560px;transition:transform .28s cubic-bezier(.4,0,.2,1);will-change:transform}

/* ── Slide canvas ── */
.slide{width:420px;height:560px;flex-shrink:0;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:52px 36px 72px;text-align:center;overflow:hidden}

/* ── SHG logo mark (place assets/logo-mark.svg for it to appear) ── */
.slide::after{content:'';position:absolute;bottom:20px;left:50%;transform:translateX(-50%);width:44px;height:44px;opacity:.25;background:url('../../assets/logo-mark.svg') center/contain no-repeat}

/* ── Typography ── */
.hook{font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;font-size:28px;line-height:1.25;font-weight:500;letter-spacing:.01em}
.affirmation{font-family:'Jost',sans-serif;font-size:23px;font-weight:600;line-height:1.3;letter-spacing:.02em}
.cta-headline{font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;font-size:26px;font-weight:500;line-height:1.3;margin-bottom:14px}
.cta-url{font-family:'Jost',sans-serif;font-size:14px;font-weight:400;opacity:.65;letter-spacing:.1em;text-transform:lowercase}

/* ── Arrows ── */
.arrow{position:absolute;top:50%;transform:translateY(-50%);background:rgba(0,0,0,.15);border:none;color:#000;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;z-index:10;transition:background .15s}
.arrow:hover{background:rgba(0,0,0,.3)}
.arrow-prev{left:10px}
.arrow-next{right:10px}

/* ── Dots ── */
.dots{display:flex;gap:5px;justify-content:center;align-items:center;padding:9px 0;background:#000}
.dot{width:6px;height:6px;border-radius:50%;background:#786860;transition:all .2s;cursor:pointer}
.dot.active{background:#d4a090;width:8px;height:8px}

/* ── Thumbnail strip ── */
.strip{background:#000;padding:10px 12px;display:flex;gap:6px;overflow-x:auto;border-top:1px solid #1c1828;scrollbar-width:none}
.strip::-webkit-scrollbar{display:none}

/* ── Keyboard hint ── */
.hint{color:#786860;font-size:11px;font-family:'Jost',sans-serif;margin-top:10px;letter-spacing:.04em}
</style>
</head>
<body>

<div class="frame">
  <div class="viewport">
    <div class="track" id="track">

      <!-- ══════════════════════════════════════════
           SLIDES
           · Slides 01–09: peach/rose bg, color:#000
           · Slide 10 (CTA): bg:#06040c, color:#f2ece4
           ══════════════════════════════════════════ -->

      <!-- SLIDE 01: Hook -->
      <div class="slide" data-slide="0" style="background:CATEGORY_COLOR;color:#000;">
        <p class="hook">HOOK LINE</p>
      </div>

      <!-- SLIDE 02 -->
      <div class="slide" data-slide="1" style="background:CATEGORY_COLOR;color:#000;">
        <p class="affirmation">AFFIRMATION</p>
      </div>

      <!-- SLIDE 03 -->
      <div class="slide" data-slide="2" style="background:CATEGORY_COLOR;color:#000;">
        <p class="affirmation">AFFIRMATION</p>
      </div>

      <!-- SLIDE 04 -->
      <div class="slide" data-slide="3" style="background:CATEGORY_COLOR;color:#000;">
        <p class="affirmation">AFFIRMATION</p>
      </div>

      <!-- SLIDE 05 -->
      <div class="slide" data-slide="4" style="background:CATEGORY_COLOR;color:#000;">
        <p class="affirmation">AFFIRMATION</p>
      </div>

      <!-- SLIDE 06 -->
      <div class="slide" data-slide="5" style="background:CATEGORY_COLOR;color:#000;">
        <p class="affirmation">AFFIRMATION</p>
      </div>

      <!-- SLIDE 07 -->
      <div class="slide" data-slide="6" style="background:CATEGORY_COLOR;color:#000;">
        <p class="affirmation">AFFIRMATION</p>
      </div>

      <!-- SLIDE 08 -->
      <div class="slide" data-slide="7" style="background:CATEGORY_COLOR;color:#000;">
        <p class="affirmation">AFFIRMATION</p>
      </div>

      <!-- SLIDE 09 -->
      <div class="slide" data-slide="8" style="background:CATEGORY_COLOR;color:#000;">
        <p class="affirmation">AFFIRMATION</p>
      </div>

      <!-- SLIDE 10: CTA — always dark bg + cream text -->
      <div class="slide" data-slide="9" style="background:#06040c;color:#f2ece4;">
        <p class="cta-headline">Save this.<br>Listen tonight.</p>
        <p class="cta-url">reshmaoracle.com</p>
      </div>

    </div><!-- /track -->
    <button class="arrow arrow-prev" onclick="move(-1)">&#8249;</button>
    <button class="arrow arrow-next" onclick="move(1)">&#8250;</button>
  </div><!-- /viewport -->

  <div class="dots" id="dots"></div>
  <div class="strip" id="strip"></div>
</div>

<p class="hint">&#8592; &#8594; arrow keys &nbsp;|&nbsp; click thumbnails</p>

<script>
const slides = document.querySelectorAll('[data-slide]');
const N = slides.length;
let cur = 0;

const track = document.getElementById('track');
const dotsEl = document.getElementById('dots');
const stripEl = document.getElementById('strip');

// Build dots
for (let i = 0; i < N; i++) {
  const d = document.createElement('div');
  d.className = 'dot' + (i === 0 ? ' active' : '');
  d.onclick = () => goTo(i);
  dotsEl.appendChild(d);
}

// Build thumbnail strip — scale-down clone of each slide
slides.forEach((slide, i) => {
  const S = 50 / 420;
  const wrap = document.createElement('div');
  wrap.style.cssText = `width:50px;height:${Math.round(560*S)}px;flex-shrink:0;border-radius:3px;overflow:hidden;cursor:pointer;opacity:${i===0?'1':'.45'};border:${i===0?'1.5px solid #d4a090':'1.5px solid transparent'};transition:all .2s`;
  const mini = slide.cloneNode(true);
  mini.style.cssText = `width:420px;height:560px;transform-origin:top left;transform:scale(${S});pointer-events:none;flex-shrink:0;`;
  wrap.appendChild(mini);
  wrap.onclick = () => goTo(i);
  stripEl.appendChild(wrap);
});

function goTo(i) {
  cur = Math.max(0, Math.min(N - 1, i));
  track.style.transform = `translateX(${-cur * 420}px)`;
  document.querySelectorAll('.dot').forEach((d, j) => d.classList.toggle('active', j === cur));
  Array.from(stripEl.children).forEach((c, j) => {
    c.style.opacity = j === cur ? '1' : '.45';
    c.style.borderColor = j === cur ? '#d4a090' : 'transparent';
  });
  stripEl.children[cur]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

function move(dir) { goTo(cur + dir); }

// Called by export scripts
window.goToSlide = goTo;

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); move(1); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1); }
});
</script>
</body>
</html>
```

---

## Step 4 — export to PNG

```bash
node export-slides.js carousels/<slug>/index.html
```

Python fallback:

```bash
python3 export-slides.py carousels/<slug>/index.html
```

PNGs land in `carousels/<slug>/slides/slide-01.png` … `slide-10.png` at 1080×1440.

If Playwright isn't installed:

```bash
npm install playwright
npx playwright install chromium
```

---

## Notes

- Always 10 slides. Never 8, never 12.
- Slide 10 is always dark (`#06040c`) with cream text and the reshmaoracle.com CTA.
- Drop your logo SVG at `assets/logo-mark.svg` — it appears on every slide automatically.
- Drop your photo at `assets/reshma.jpg` for use on the hook slide.
- The thumbnail strip is generated automatically from the slides.
- What you see at 420px in the browser is exactly what exports at 1080×1440.
