#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from PIL import Image
import os
import sys

# Fix encoding on Windows
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Mapping of downloaded filenames to group slugs
files_mapping = {
    "Вентиляция.png": "ventilatsiya",
    "Перфорированный крепеж.png": "perfo",
    "НЕРЖАВЕЮЩИЙ КРЕПЕЖ.png": "nerzhaveyushchiy",
    "ТАКЕЛАЖ.png": "takelazh",
    "КАНАТЫ И ТРОСЫ.png": "kanaty",
    "СВАРОЧНЫЕ ЭЛЕКТРОДЫ.png": "elektrody",
    "ШЛАНГИ.png": "shlangi",
}

downloads_dir = r"C:\Users\sales\Downloads"
output_dir = r"C:\Users\sales\projects\metizopt\public\images\groups"

# Create output directory if it doesn't exist
os.makedirs(output_dir, exist_ok=True)

print("[*] Optimizing images...")

for filename, slug in files_mapping.items():
    input_path = os.path.join(downloads_dir, filename)
    output_path = os.path.join(output_dir, f"{slug}.jpg")

    if not os.path.exists(input_path):
        print(f"[!] Not found: {filename}")
        continue

    try:
        # Open image
        img = Image.open(input_path)

        # Get original size
        original_size = os.path.getsize(input_path) / (1024 * 1024)

        # Convert RGBA to RGB with white background
        if img.mode == 'RGBA':
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[3])  # Use alpha channel as mask
            img = background

        # Resize to optimal width while maintaining aspect ratio
        # Target: 1920px width max
        if img.width > 1920:
            ratio = 1920 / img.width
            new_height = int(img.height * ratio)
            img = img.resize((1920, new_height), Image.Resampling.LANCZOS)

        # Save as JPEG with quality 70-75%
        img.save(output_path, "JPEG", quality=72, optimize=True)

        # Get optimized size
        optimized_size = os.path.getsize(output_path) / (1024 * 1024)
        compression = ((original_size - optimized_size) / original_size) * 100

        print(f"[OK] {slug:20} | {original_size:.2f}MB -> {optimized_size:.2f}MB ({compression:.0f}% compressed)")

    except Exception as e:
        print(f"[!] Error processing {filename}: {e}")

print(f"\n[OK] Done! Images saved to {output_dir}")
