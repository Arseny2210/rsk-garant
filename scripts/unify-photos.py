#!/usr/bin/env python3
"""Приведение всех фото проектов к вертикальному формату 3:4 и оптимизация WebP.

Горизонтальные фото превращаются в вертикальные с размытой заливкой сверху/снизу
(ничего не обрезается). Вертикальные фото остаются как есть, но пережимаются.
Выход: 1200x1600, quality 72.
Запуск: python3 scripts/unify-photos.py
"""

import os
import sys

from PIL import Image, ImageEnhance, ImageFilter, ImageOps

ROOT = "public/images/projects"
CATS = [
    "dveri",
    "kosmet-rem",
    "laminat",
    "nat-potolki",
    "oboi",
    "plitka",
    "pod-klutch",
    "sanuzel",
]
TW, TH = 1200, 1600
QUALITY = 72


def cover_resize(img, tw, th):
    w, h = img.size
    s = max(tw / w, th / h)
    nw, nh = max(1, round(w * s)), max(1, round(h * s))
    img = img.resize((nw, nh), Image.LANCZOS)
    left, top = (nw - tw) // 2, (nh - th) // 2
    return img.crop((left, top, left + tw, top + th))


def to_vertical(src_path, out_path):
    im = Image.open(src_path)
    im = ImageOps.exif_transpose(im).convert("RGB")
    w, h = im.size

    if w > h:
        bg = cover_resize(im, TW, TH)
        bg = bg.filter(ImageFilter.GaussianBlur(60))
        bg = ImageEnhance.Brightness(bg).enhance(0.45)

        fg = im.copy()
        fg.thumbnail((TW, TH), Image.LANCZOS)
        x, y = (TW - fg.width) // 2, (TH - fg.height) // 2
        bg.paste(fg, (x, y))
        canvas = bg
    else:
        canvas = im.copy()
        canvas.thumbnail((TW, TH), Image.LANCZOS)
        if canvas.size != (TW, TH):
            pad = Image.new("RGB", (TW, TH), (24, 22, 19))
            x, y = (TW - canvas.width) // 2, (TH - canvas.height) // 2
            pad.paste(canvas, (x, y))
            canvas = pad

    canvas.save(out_path, "WEBP", quality=QUALITY, method=6)


total = 0
for cat in CATS:
    d = os.path.join(ROOT, cat)
    if not os.path.isdir(d):
        print(f"SKIP: {cat}")
        continue
    files = sorted(f for f in os.listdir(d) if f.lower().endswith(".webp"))
    for f in files:
        src = os.path.join(d, f)
        try:
            to_vertical(src, src)
            total += 1
        except Exception as e:
            print(f"  fail: {cat}/{f}: {e}")

print(f"DONE, обработано: {total}")
