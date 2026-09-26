#!/usr/bin/env python3
"""Оптимизация фотографий работ: исходники -> WebP (max 1600px, q78).
Обрабатывает все папки проектов из _source/remont-img."""

import os
import subprocess

SRC = "_source/remont-img"
OUT = "public/images/projects"

SLUGS = {
    "Бутово дмитрия донского косметический ремонт": ("butovo-cosmetic", 6),
    "Лыткарино колхозная косметический ремонт": ("lytkarino-kolhoznaya", 8),
    "Лыткарино,  старый фонд финские домики": ("lytkarino-finskie-domiki", 6),
    "Лыткарино, 3-й квартал черновая": ("lytkarino-chernovaya", 10),
    "Лыткарино, Песчаная д.8 новостройка": ("lytkarino-peschannaya", 10),
    "Лыткарино, коммунистическая 53": ("lytkarino-kommunisticheskaya-53", 6),
    "Лыткарино, ремонт комнаты": ("lytkarino-komnata", 6),
    "Люберцы, 116-й квартал": ("lyubertsy-116-kvartal", 8),
    "Люберцы, 8 марта ремонт под ключ": ("lyubertsy-8-marta", 10),
    "Люберцы, Рождественская ремонт под ключ": ("lyubertsy-rozhdestvenskaya", 16),
    "Мытищи, сан узел ремонт": ("mytishchi-sanuzel", 10),
    "Рублевское шоссе частный дом": ("rublevskoe-dom", 10),
    "выхино ремонт квартиры вторичка": ("vykhino-vtorichka", 8),
    "коммунарка переделка после частников плесень": ("kommunarka-posle-chastnikov", 8),
    "косметика частный дом": ("kosmetika-chastnyi-dom", 6),
    "косметический ремонт квартиры выхино": ("vykhino-cosmetic", 8),
    "лыткарино ремонт в магазине косметика по быстрому": ("lytkarino-magazin", 6),
    "лыткарино, 6-й микрорайон ремонт студии под ключ": ("lytkarino-6-mkr", 8),
    "лыткарино, коммунистическая д.55 общежитие": ("lytkarino-obshchezhitie", 6),
    "лыткарино, косметический ремонт маленькой кухни": ("lytkarino-kuhnya", 6),
    "москва ферганская косметический ремонт кухни": ("moskva-ferganskaya-kuhnya", 6),
    "новостройка по реновации": ("novostroyka-renovaciya", 8),
    "сан узел и ремонт кухни фитаревская": ("fitarevskaya-sanuzel", 8),
}

EXTS = {".jpg", ".jpeg", ".png", ".webp"}

for folder, (slug, limit) in SLUGS.items():
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
            continue
        r = subprocess.run(
            ["cwebp", "-quiet", "-q", "78", tmp, "-o", out_path],
            capture_output=True,
        )
        if r.returncode == 0:
            os.remove(tmp)

print("DONE")
