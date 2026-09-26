#!/usr/bin/env python3
"""Оптимизация фотографий работ: исходники -> WebP (max 1600px, q78)."""

import os
import shutil
import subprocess

SRC = "_source/remont-img"
OUT = "public/images/projects"

MAP = {
    "Люберцы, Рождественская ремонт под ключ": ("lyubertsy-rozhdestvenskaya", 12),
    "Мытищи, сан узел ремонт": ("mytishchi-sanuzel", 8),
    "Люберцы, 8 марта ремонт под ключ": ("lyubertsy-8-marta", 6),
    "выхино ремонт квартиры вторичка": ("vykhino-vtorichka", 6),
    "Лыткарино колхозная косметический ремонт": ("lytkarino-kolhoznaya", 6),
    "косметический ремонт квартиры выхино": ("vykhino-cosmetic", 6),
    "лыткарино, косметический ремонт маленькой кухни": ("lytkarino-kuhnya", 4),
    "сан узел и ремонт кухни фитаревская": ("fitarevskaya-sanuzel", 6),
    "Лыткарино, Песчаная д.8 новостройка": ("lytkarino-peschannaya", 8),
    "лыткарино, 6-й микрорайон ремонт студии под ключ": ("lytkarino-6-mkr", 6),
    "Рублевское шоссе частный дом": ("rublevskoe-dom", 6),
    "Лыткарино, 3-й квартал черновая": ("lytkarino-chernovaya", 8),
    "новостройка по реновации": ("novostroyka-renovaciya", 6),
}

EXTS = {".jpg", ".jpeg", ".png", ".webp"}

for folder, (slug, limit) in MAP.items():
    src_dir = os.path.join(SRC, folder)
    if not os.path.isdir(src_dir):
        print(f"SKIP (нет папки): {folder}")
        continue
    out_dir = os.path.join(OUT, slug)
    os.makedirs(out_dir, exist_ok=True)

    files = sorted(
        f for f in os.listdir(src_dir) if os.path.splitext(f)[1].lower() in EXTS
    )[:limit]

    print(f"=== {folder} -> {slug} ({len(files)})")
    for i, name in enumerate(files, start=1):
        src_path = os.path.join(src_dir, name)
        n = f"{i:02d}"
        tmp = f"/tmp/proc_{slug}_{n}.jpg"
        out_path = os.path.join(out_dir, f"{n}.webp")

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
                "82",
                src_path,
                "--out",
                tmp,
            ],
            capture_output=True,
        )
        if r.returncode != 0 or not os.path.exists(tmp):
            print(f"  skip {name} (sips)")
            continue
        r = subprocess.run(
            ["cwebp", "-quiet", "-q", "78", tmp, "-o", out_path],
            capture_output=True,
        )
        if r.returncode != 0:
            print(f"  skip {name} (cwebp)")
            continue
        os.remove(tmp)

print("DONE")
