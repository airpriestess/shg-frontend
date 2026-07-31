// Export carousel slides as 1080×1440 PNGs
// Usage: node export-slides.js carousels/<slug>/index.html

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const SLIDE_W = 420;
const SLIDE_H = 560;
const EXPORT_W = 1080;
const EXPORT_H = 1440;
const SCALE = EXPORT_W / SLIDE_W; // 2.5714…

async function exportSlides(htmlFile) {
  const absolutePath = path.resolve(htmlFile);

  if (!fs.existsSync(absolutePath)) {
    console.error(`File not found: ${absolutePath}`);
    process.exit(1);
  }

  const slidesDir = path.join(path.dirname(absolutePath), 'slides');
  if (!fs.existsSync(slidesDir)) fs.mkdirSync(slidesDir, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: SLIDE_W, height: SLIDE_H },
    deviceScaleFactor: SCALE,
  });
  const page = await context.newPage();

  await page.goto(`file://${absolutePath}`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(800); // let fonts paint

  const slideCount = await page.evaluate(
    () => document.querySelectorAll('[data-slide]').length
  );

  if (slideCount === 0) {
    console.error('No [data-slide] elements found. Check the HTML template.');
    await browser.close();
    process.exit(1);
  }

  console.log(`\nExporting ${slideCount} slides → ${EXPORT_W}×${EXPORT_H}px`);
  console.log(`Output: ${slidesDir}\n`);

  for (let i = 0; i < slideCount; i++) {
    await page.evaluate((idx) => window.goToSlide(idx), i);
    await page.waitForTimeout(120);

    const slideNum = String(i + 1).padStart(2, '0');
    const outPath = path.join(slidesDir, `slide-${slideNum}.png`);

    await page.screenshot({
      path: outPath,
      clip: { x: 0, y: 0, width: SLIDE_W, height: SLIDE_H },
    });

    console.log(`  ✓ slide-${slideNum}.png`);
  }

  await browser.close();
  console.log(`\nDone. Open ${slidesDir} to grab your PNGs.\n`);
}

const file = process.argv[2];
if (!file) {
  console.error('Usage: node export-slides.js <path/to/carousel/index.html>');
  process.exit(1);
}

exportSlides(file).catch((err) => {
  console.error(err);
  process.exit(1);
});
