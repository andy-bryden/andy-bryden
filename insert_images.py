#!/usr/bin/env python3
"""
Insert chXX.YY.webp images into the-fall-of-lorch.html.

XX = chapter number, YY = Nth text paragraph after the chapter header.
Only <p> lines count; <p class="scene-break"> lines and char-guide divs are skipped.
Image is placed AFTER paragraph YY.

Usage:
  python insert_images.py                 # dry run (report only)
  python insert_images.py --write         # writes html (backup saved as .bak)
"""
import argparse, re, shutil
from collections import defaultdict
from pathlib import Path

ap = argparse.ArgumentParser()
ap.add_argument("--html", default="the-fall-of-lorch.html")
ap.add_argument("--dir", default="images/the-fall-of-lorch")
ap.add_argument("--write", action="store_true")
a = ap.parse_args()

try:
    from PIL import Image
except ImportError:
    Image = None

html_path = Path(a.html)
img_dir = Path(a.dir)

# Collect images: chXX.YY.webp
imgs = defaultdict(list)
for f in sorted(img_dir.glob("*.webp")):
    m = re.fullmatch(r"ch(\d+)\.(\d+)[a-z]?\.webp", f.name, re.I)
    if m:
        imgs[(int(m[1]), int(m[2]))].append(f)
    else:
        print(f"SKIP (name doesn't match): {f.name}")

def figure(ch, f):
    size = ""
    if Image:
        try:
            with Image.open(f) as im:
                size = f' width="{im.width}" height="{im.height}"'
        except Exception:
            pass
    src = f"{a.dir.rstrip('/')}/{f.name}"
    return (f'<figure class="scene-img"><img src="{src}" '
            f'alt="The Fall of Lorch, chapter {ch}" loading="lazy" decoding="async"{size}></figure>')

HDR = re.compile(r'<div class="section-header" id="([^"]+)">')
PARA = re.compile(r'^\s*<p(?:\s[^>]*)?>')

lines = html_path.read_text(encoding="utf-8").split("\n")
out, ch, count, placed = [], None, 0, set()

for line in lines:
    h = HDR.search(line)
    if h:
        m = re.fullmatch(r"ch-(\d+)", h[1])
        ch = int(m[1]) if m else None
        count = 0
    out.append(line)
    if ch is None or h:
        continue
    if PARA.match(line) and "scene-break" not in line:
        count += 1
        for f in imgs.get((ch, count), []):
            out.append(figure(ch, f))
            placed.add(f.name)

# Report
all_names = {f.name for fs in imgs.values() for f in fs}
missed = sorted(all_names - placed)
print(f"Images found: {len(all_names)}  placed: {len(placed)}")
if missed:
    print("NOT PLACED (paragraph number out of range or chapter missing):")
    for n in missed:
        print("  ", n)

# CSS (once)
css = """
 /* Scene images */
 figure.scene-img { margin: 24px 0; text-align: center; }
 figure.scene-img img { display: block; max-width: 100%; height: auto; margin: 0 auto;
   border: 2px solid var(--rust); border-radius: 12px; }
"""
text = "\n".join(out)
if "figure.scene-img" not in text:
    text = text.replace("</style>", css + "</style>", 1)

if a.write:
    shutil.copy(html_path, html_path.with_suffix(".html.bak"))
    html_path.write_text(text, encoding="utf-8")
    print(f"Written {html_path} (backup: {html_path.with_suffix('.html.bak').name})")
else:
    print("Dry run. Re-run with --write to apply.")