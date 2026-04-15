#!/usr/bin/env python3
"""
Rebuild crest assets from a flat JPG/PNG (logo on near-white background).

  python3 scripts/sync-crest-logo.py
  python3 scripts/sync-crest-logo.py path/to/your-logo.jpg

Writes:
  public/brand/ar-crest-hd.png       — RGBA, transparent outside, cropped to ink
  public/brand/ar-crest-gold-hd.png  — same ink, pre-tinted gold (navbar: avoids CSS filter blur)
  public/brand/ar-crest-white-hd.png — legacy helper (site uses ar-crest-hd + CSS invert for light)
  public/brand/ar-crest-mask.png     — small white mask for app/icon.svg

Then paste the printed CREST_INK_W / CREST_INK_H into components/brand/crest-meta.ts
and set Navbar aspectRatio + Loader crest height calc to match (script prints hints).
"""

from __future__ import annotations

import argparse
import os
import sys
from collections import deque

from PIL import Image


def write_gold_hd_png(path: str, cropped: Image.Image) -> None:
    """Full-res gold tint from ink luminance — keeps fine lines; no browser filter at 56px."""
    cw, ch = cropped.size
    out = Image.new("RGBA", (cw, ch))
    op, cp = out.load(), cropped.load()
    dark = (58, 42, 18)
    mid = (165, 132, 62)
    bright = (235, 214, 152)
    for y in range(ch):
        for x in range(cw):
            r, g, b, a = cp[x, y]
            if a < 8:
                op[x, y] = (0, 0, 0, 0)
                continue
            lum = max(r, g, b) / 255.0
            if lum < 0.0:
                lum = 0.0
            elif lum > 1.0:
                lum = 1.0
            rr = int(dark[0] * (1.0 - lum) + bright[0] * lum)
            gg = int(dark[1] * (1.0 - lum) + bright[1] * lum)
            bb = int(dark[2] * (1.0 - lum) + bright[2] * lum)
            rr = int(rr * 0.92 + mid[0] * 0.08)
            gg = int(gg * 0.92 + mid[1] * 0.08)
            bb = int(bb * 0.92 + mid[2] * 0.08)
            op[x, y] = (rr, gg, bb, a)


def main() -> None:
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    default = os.path.join(root, "public", "images", "logi(1).jpg")
    ap = argparse.ArgumentParser()
    ap.add_argument("source", nargs="?", default=default, help="Logo file (JPG/PNG on white)")
    args = ap.parse_args()
    src = os.path.normpath(args.source)
    if not os.path.isfile(src):
        print("Missing file:", src, file=sys.stderr)
        sys.exit(1)

    im = Image.open(src).convert("RGBA")
    w, h = im.size
    px = im.load()

    def is_outer_white(x: int, y: int) -> bool:
        r, g, b, a = px[x, y]
        return r > 248 and g > 248 and b > 248 and a > 200

    visited = [[False] * h for _ in range(w)]
    q: deque[tuple[int, int]] = deque()

    def push(x: int, y: int) -> None:
        if 0 <= x < w and 0 <= y < h and not visited[x][y] and is_outer_white(x, y):
            visited[x][y] = True
            q.append((x, y))

    for x in range(w):
        push(x, 0)
        push(x, h - 1)
    for y in range(h):
        push(0, y)
        push(w - 1, y)

    while q:
        x, y = q.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            push(nx, ny)

    out = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    op = out.load()
    for y in range(h):
        for x in range(w):
            if visited[x][y]:
                op[x, y] = (0, 0, 0, 0)
            else:
                op[x, y] = px[x, y]

    bbox = out.getbbox()
    if not bbox:
        print("No ink left after background removal — loosen is_outer_white?", file=sys.stderr)
        sys.exit(2)
    cropped = out.crop(bbox)
    cw, ch = cropped.size

    brand = os.path.join(root, "public", "brand")
    os.makedirs(brand, exist_ok=True)
    cropped.save(os.path.join(brand, "ar-crest-hd.png"), optimize=True, compress_level=6)

    gold_path = os.path.join(brand, "ar-crest-gold-hd.png")
    write_gold_hd_png(gold_path, cropped)
    print("OK:", gold_path)

    wim = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
    wp, cp = wim.load(), cropped.load()
    for y in range(ch):
        for x in range(cw):
            r, g, b, a = cp[x, y]
            if a > 30:
                wp[x, y] = (255, 255, 255, a)
    wim.save(os.path.join(brand, "ar-crest-white-hd.png"), optimize=True, compress_level=6)

    # Larger mask = smoother displacement silhouette in the loader (still a small PNG).
    mw = min(1024, cw)
    mh = int(mw * ch / cw)
    wim.resize((mw, mh), Image.Resampling.LANCZOS).save(
        os.path.join(brand, "ar-crest-mask.png"), optimize=True
    )

    print("OK:", os.path.join(brand, "ar-crest-hd.png"), f"({cw}×{ch})")
    print()
    print("Update components/brand/crest-meta.ts:")
    print(f"  export const CREST_INK_W = {cw}")
    print(f"  export const CREST_INK_H = {ch}")
    print()
    print("Navbar aspectRatio style string:")
    print(f"  aspectRatio: '{cw} / {ch}'")
    print()
    print("Loader crestH calc fragment:")
    print(f"  calc({{crestW}} * {ch} / {cw})")


if __name__ == "__main__":
    main()
