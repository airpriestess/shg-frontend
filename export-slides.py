#!/usr/bin/env python3
# Export carousel slides as 1080×1440 PNGs (Python / Playwright fallback)
# Usage: python3 export-slides.py carousels/<slug>/index.html
#
# Install once:
#   pip3 install playwright          (add --break-system-packages if pip refuses)
#   python3 -m playwright install chromium

import sys
import os
from pathlib import Path

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("Playwright not found. Run: pip3 install playwright && python3 -m playwright install chromium")
    sys.exit(1)

SLIDE_W, SLIDE_H = 420, 560
EXPORT_W, EXPORT_H = 1080, 1440
SCALE = EXPORT_W / SLIDE_W  # 2.5714…


def export_slides(html_file: str):
    html_path = Path(html_file).resolve()

    if not html_path.exists():
        print(f"File not found: {html_path}")
        sys.exit(1)

    slides_dir = html_path.parent / "slides"
    slides_dir.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(
            viewport={"width": SLIDE_W, "height": SLIDE_H},
            device_scale_factor=SCALE,
        )
        page = context.new_page()
        page.goto(f"file://{html_path}")
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(800)

        slide_count = page.evaluate(
            "document.querySelectorAll('[data-slide]').length"
        )

        if slide_count == 0:
            print("No [data-slide] elements found. Check the HTML template.")
            browser.close()
            sys.exit(1)

        print(f"\nExporting {slide_count} slides → {EXPORT_W}×{EXPORT_H}px")
        print(f"Output: {slides_dir}\n")

        for i in range(slide_count):
            page.evaluate(f"window.goToSlide({i})")
            page.wait_for_timeout(120)

            slide_num = str(i + 1).zfill(2)
            out_path = str(slides_dir / f"slide-{slide_num}.png")

            page.screenshot(
                path=out_path,
                clip={"x": 0, "y": 0, "width": SLIDE_W, "height": SLIDE_H},
            )
            print(f"  ✓ slide-{slide_num}.png")

        browser.close()
        print(f"\nDone. Open {slides_dir} to grab your PNGs.\n")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 export-slides.py <path/to/carousel/index.html>")
        sys.exit(1)
    export_slides(sys.argv[1])
