# SHG Carousel Generator

Generates Instagram carousels for Self Hypnosis Goddess: a swipeable 420×560 HTML preview that exports as 1080×1440 PNGs.

---

## Step 1 — always load the content skill first

Before writing any copy, load the instagram-carousel skill:

```
/instagram-carousel
```

That skill owns all content rules: categories, affirmation writing, hook formulas, gradient choices, caption formula, and hashtag bank. Never write slides without it.

---

## Step 2 — lock copy with the user

Confirm before building HTML:
- Category and subcategory
- Hook line (slide 01)
- All 8 affirmations (slides 02–09)
- Gradient / visual choice
- Text colour (dark bg → cream `#fdf0e8`; light bg → black `#000`)

---

## Step 3 — build the HTML

Create the file at:

```
carousels/<kebab-slug>/index.html
```

Use the exact template below. Only fill in slide content — never change the layout, JS, or CSS structure.

### Naming

Slug = `<category>-<short-topic>`, e.g. `lovemaxxing-he-chooses-me`, `moneymaxxing-5k-days`.

### Gradient reference

| Category | CSS gradient |
|----------|-------------|
| Lovemaxxing | `linear-gradient(135deg, #F5E0A0, #E07898)` |
| Moneymaxxing | `linear-gradient(135deg, #0A4A8A, #2CB7A7)` |
| Luckygirlmaxxing | `linear-gradient(135deg, #F5E0A0, #E8B870, #BFA5D8, #2CB7A7, #167A6B)` |
| Beautymaxxing | `linear-gradient(135deg, #F5E0A0, #f0c8d0)` |
| Sleepmaxxing / DNAmaxxing | `linear-gradient(135deg, #1A4A8A, #2CB7A7)` |
| Confidencemaxxing / Lifemaxxing / Stylemaxxing | `linear-gradient(135deg, #E8B870, #F5E0A0)` |
| Selfmaxxing / Wellnessmaxxing / Studymaxxing | `linear-gradient(135deg, #BFA5D8, #2CB7A7)` |
| Sovereignmaxxing / Desiresmaxxing | `linear-gradient(135deg, #E8B870, #2CB7A7)` |
| Black visual | `#000000` with `color: #fdf0e8` |
| Cream visual | `#fdf0e8` with `color: #000000` |
| All others | `linear-gradient(135deg, #2CB7A7, #167A6B)` |

Text colour rule: light/champagne gradients → `#000`; dark/navy/teal gradients → `#fdf0e8`.

---

## HTML Template

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

/* Frame */
.frame{width:420px;background:#06040c;border-radius:14px;overflow:hidden;box-shadow:0 0 0 1px #1c1828}

/* Viewport + track */
.viewport{width:420px;height:560px;overflow:hidden;position:relative}
.track{display:flex;height:560px;transition:transform .28s cubic-bezier(.4,0,.2,1);will-change:transform}

/* Slides */
.slide{width:420px;height:560px;flex-shrink:0;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:52px 36px 72px;text-align:center;overflow:hidden}

/* Logo mark — place assets/logo-mark.svg or it shows nothing (graceful) */
.slide::after{content:'';position:absolute;bottom:20px;left:50%;transform:translateX(-50%);width:44px;height:44px;opacity:.35;background:url('../../assets/logo-mark.svg') center/contain no-repeat}

/* Typography */
.hook{font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;font-size:28px;line-height:1.25;font-weight:500;letter-spacing:.01em}
.affirmation{font-family:'Jost',sans-serif;font-size:23px;font-weight:600;line-height:1.3;letter-spacing:.02em}
.cta-headline{font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;font-size:26px;font-weight:500;line-height:1.3;margin-bottom:14px}
.cta-url{font-family:'Jost',sans-serif;font-size:14px;font-weight:400;opacity:.7;letter-spacing:.1em;text-transform:lowercase}

/* Arrows */
.arrow{position:absolute;top:50%;transform:translateY(-50%);background:rgba(0,0,0,.35);border:none;color:#f2ece4;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;z-index:10;transition:background .15s}
.arrow:hover{background:rgba(0,0,0,.6)}
.arrow-prev{left:10px}
.arrow-next{right:10px}

/* Dots */
.dots{display:flex;gap:5px;justify-content:center;align-items:center;padding:9px 0;background:#000}
.dot{width:6px;height:6px;border-radius:50%;background:#786860;transition:all .2s;cursor:pointer}
.dot.active{background:#d4a090;width:8px;height:8px}

/* Thumbnail strip */
.strip{background:#06040c;padding:10px 12px;display:flex;gap:6px;overflow-x:auto;border-top:1px solid #1c1828;scrollbar-width:none}
.strip::-webkit-scrollbar{display:none}

/* Keyboard hint */
.hint{color:#786860;font-size:11px;font-family:'Jost',sans-serif;margin-top:10px;letter-spacing:.04em}
</style>
</head>
<body>

<div class="frame">
  <div class="viewport" id="vp">
    <div class="track" id="track">

      <!-- ═══════════════════════════════════════
           SLIDES — edit only background + color
           and the text content inside each slide
           ═══════════════════════════════════════ -->

      <!-- SLIDE 01: Hook -->
      <div class="slide" data-slide="0" style="background:GRADIENT_OR_COLOR;color:TEXT_COLOR;">
        <p class="hook">HOOK LINE</p>
      </div>

      <!-- SLIDE 02 -->
      <div class="slide" data-slide="1" style="background:GRADIENT_OR_COLOR;color:TEXT_COLOR;">
        <p class="affirmation">AFFIRMATION</p>
      </div>

      <!-- SLIDE 03 -->
      <div class="slide" data-slide="2" style="background:GRADIENT_OR_COLOR;color:TEXT_COLOR;">
        <p class="affirmation">AFFIRMATION</p>
      </div>

      <!-- SLIDE 04 -->
      <div class="slide" data-slide="3" style="background:GRADIENT_OR_COLOR;color:TEXT_COLOR;">
        <p class="affirmation">AFFIRMATION</p>
      </div>

      <!-- SLIDE 05 -->
      <div class="slide" data-slide="4" style="background:GRADIENT_OR_COLOR;color:TEXT_COLOR;">
        <p class="affirmation">AFFIRMATION</p>
      </div>

      <!-- SLIDE 06 -->
      <div class="slide" data-slide="5" style="background:GRADIENT_OR_COLOR;color:TEXT_COLOR;">
        <p class="affirmation">AFFIRMATION</p>
      </div>

      <!-- SLIDE 07 -->
      <div class="slide" data-slide="6" style="background:GRADIENT_OR_COLOR;color:TEXT_COLOR;">
        <p class="affirmation">AFFIRMATION</p>
      </div>

      <!-- SLIDE 08 -->
      <div class="slide" data-slide="7" style="background:GRADIENT_OR_COLOR;color:TEXT_COLOR;">
        <p class="affirmation">AFFIRMATION</p>
      </div>

      <!-- SLIDE 09 -->
      <div class="slide" data-slide="8" style="background:GRADIENT_OR_COLOR;color:TEXT_COLOR;">
        <p class="affirmation">AFFIRMATION</p>
      </div>

      <!-- SLIDE 10: CTA -->
      <div class="slide" data-slide="9" style="background:GRADIENT_OR_COLOR;color:TEXT_COLOR;">
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

// Dots
for (let i = 0; i < N; i++) {
  const d = document.createElement('div');
  d.className = 'dot' + (i === 0 ? ' active' : '');
  d.onclick = () => goTo(i);
  dotsEl.appendChild(d);
}

// Thumbnails — scale-down clone of each slide
slides.forEach((slide, i) => {
  const wrap = document.createElement('div');
  const S = 50 / 420;
  wrap.style.cssText = `width:50px;height:${Math.round(560*S)}px;flex-shrink:0;border-radius:4px;overflow:hidden;cursor:pointer;opacity:${i===0?'1':'.45'};border:${i===0?'1.5px solid #d4a090':'1.5px solid transparent'};transition:all .2s`;
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

// Called by export-slides.js
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

## Step 4 — export

When the user says "export" or "save as PNGs":

```bash
node export-slides.js carousels/<slug>/index.html
```

Python fallback (if Node unavailable):

```bash
python3 export-slides.py carousels/<slug>/index.html
```

PNGs land in `carousels/<slug>/slides/slide-01.png` … `slide-10.png` at 1080×1440px.

If Playwright isn't installed yet:

```bash
npm install playwright
npx playwright install chromium
```

---

## Notes

- **Always 10 slides.** Never 8, never 12.
- Slide 10 is always the CTA: "Save this. Listen tonight." + reshmaoracle.com.
- Put your own photos in `assets/` — drop `reshma-photo.jpg`, `logo-mark.svg`, etc. there and reference them with `../../assets/filename`.
- The thumbnail strip is auto-generated from the slides — no extra work needed.
- Open `index.html` in any browser to preview. Arrow keys navigate. What you see at 420px wide is exactly what exports at 1080×1440.
