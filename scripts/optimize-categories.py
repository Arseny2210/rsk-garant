#!/usr/bin/env python3
"""Оптимизация категорийных фото услуг -> WebP (max 1600px, q70).
Строгая привязка: папка = категория = слайдер услуги."""

import os
import subprocess

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
EXTS = {".jpg", ".jpeg", ".png"}

total = 0
for cat in CATS:
    d = os.path.join(ROOT, cat)
    if not os.path.isdir(d):
        print(f"SKIP: {cat}")
        continue

    # удаляем старые webp — перегенерируем заново
    for f in os.listdir(d):
        if f.lower().endswith(".webp"):
            os.remove(os.path.join(d, f))

    files = sorted(f for f in os.listdir(d) if os.path.splitext(f)[1].lower() in EXTS)

    print(f"=== {cat}: {len(files)} файлов")
    for i, name in enumerate(files, start=1):
        src = os.path.join(d, name)
        n = f"{i:02d}"
        tmp = f"/tmp/cat_{cat}_{n}.jpg"
        out = os.path.join(d, f"{n}.webp")

        r = subprocess.run(
            [
                "sips",
                "-Z",
                "1600",
                "-s",
                "format",
                "jpeg",
                "-s",
                "formatOptions",
                "80",
                src,
                "--out",
                tmp,
            ],
            capture_output=True,
        )
        if r.returncode != 0 or not os.path.exists(tmp):
            continue
        r = subprocess.run(
            ["cwebp", "-quiet", "-q", "70", tmp, "-o", out],
            capture_output=True,
        )
        if r.returncode == 0:
            os.remove(tmp)
            total += 1
        else:
            print(f"  fail: {name}")

    # чистим исходники после конвертации
    for f in os.listdir(d):
        if os.path.splitext(f)[1].lower() in EXTS:
            os.remove(os.path.join(d, f))

print(f"DONE, обработано: {total}")
