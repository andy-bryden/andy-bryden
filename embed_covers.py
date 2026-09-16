#!/usr/bin/env python3
"""
Embed cover art + chapter metadata into Opus-in-".mp3" audiobook files
(the format Smart Audiobook Player produces) without re-encoding audio.

USAGE:
    1. Put this script, your cover image, and all chapter audio files
       in the same folder (or edit the paths below).
    2. Adjust INPUT_DIR, OUTPUT_DIR, COVER_PATH, and FILENAME_PATTERN
       if your files aren't named 01.mp3, 02.mp3, ... 44.mp3.
    3. Run:  python3 embed_covers.py

Requires: ffmpeg on PATH. No other dependencies (pure Python + ffmpeg).
"""

import struct
import base64
import subprocess
import os
import re
import sys

# ---- Configuration ----------------------------------------------------

INPUT_DIR = "uploads"          # folder containing your source chapter files
OUTPUT_DIR = "outputs"         # folder to write tagged files into
COVER_PATH = "EmbeddedCover.jpg"
FILENAME_PATTERN = "{:02d}.mp3"   # 01.mp3, 02.mp3, ... adjust if needed

ALBUM = "The Fall of Lorch"
ARTIST = "ADB"

CHAPTER_TITLES = {
    1: "The Lion",
    2: "Out of Byzantium",
    3: "The Wrong Wind",
    4: "Remembering",
    5: "The Falx",
    6: "A Leader",
    7: "Old Ground",
    8: "The Cost of Silence",
    9: "The First Target",
    10: "A Silent Station",
    11: "Out of Place",
    12: "Rugii",
    13: "West",
    14: "Along the Frontier",
    15: "In Full View",
    16: "Roxolani",
    17: "South",
    18: "The Fort",
    19: "Released",
    20: "Movement in the Dark",
    21: "The Tigress of Lorch",
    22: "Between the Sentries",
    23: "Unfamiliar Ground",
    24: "The Eighth",
    25: "Not Possible",
    26: "Vanished",
    27: "The Ambush",
    28: "Captive Ignored",
    29: "Watching",
    30: "Marcellus Is Missing",
    31: "Cold Captive",
    32: "Phenomenon",
    33: "Nobody There",
    34: "Rome on Its Head",
    35: "Moguntiacum",
    36: "The Beneficiarius",
    37: "The Rider",
    38: "Seven and Eight",
    39: "Watched in Turn",
    40: "Three Sides",
    41: "Every Side",
    42: "Torches",
    43: "Seven Fires",
    44: "The Fall of Lorch",
    45: "Author's Note",
    46: "Character Index",
}

# ---- Cover picture block (METADATA_BLOCK_PICTURE, FLAC/Vorbis spec) ---

def build_metadata_block_picture(image_path, mime="image/jpeg", pic_type=3, description=""):
    with open(image_path, "rb") as f:
        data = f.read()

    width, height = get_jpeg_dimensions(data)
    depth = 24
    colors = 0
    desc_bytes = description.encode("utf-8")
    mime_bytes = mime.encode("utf-8")

    block = struct.pack(">I", pic_type)
    block += struct.pack(">I", len(mime_bytes)) + mime_bytes
    block += struct.pack(">I", len(desc_bytes)) + desc_bytes
    block += struct.pack(">I", width)
    block += struct.pack(">I", height)
    block += struct.pack(">I", depth)
    block += struct.pack(">I", colors)
    block += struct.pack(">I", len(data)) + data
    return base64.b64encode(block).decode("ascii")


def get_jpeg_dimensions(data):
    """Minimal JPEG SOF parser to avoid needing Pillow."""
    i = 2
    while i < len(data):
        if data[i] != 0xFF:
            i += 1
            continue
        marker = data[i + 1]
        if marker in (0xC0, 0xC1, 0xC2, 0xC3):
            height = struct.unpack(">H", data[i + 5:i + 7])[0]
            width = struct.unpack(">H", data[i + 7:i + 9])[0]
            return width, height
        seg_len = struct.unpack(">H", data[i + 2:i + 4])[0]
        i += 2 + seg_len
    raise ValueError("Could not determine JPEG dimensions")


def embed_one(src_path, dst_path, cover_b64, title):
    meta_path = dst_path + ".ffmeta.txt"
    with open(meta_path, "w") as f:
        f.write(";FFMETADATA1\n")
        f.write(f"title={title}\n")
        f.write(f"album={ALBUM}\n")
        f.write(f"artist={ARTIST}\n")
        f.write(f"METADATA_BLOCK_PICTURE={cover_b64}\n")

    cmd = [
        "ffmpeg", "-y",
        "-i", src_path,
        "-i", meta_path,
        "-map_metadata", "1",
        "-map", "0:a",
        "-c:a", "copy",
        "-f", "ogg",
        dst_path,
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    os.remove(meta_path)
    if result.returncode != 0:
        raise RuntimeError(f"ffmpeg failed on {src_path}:\n{result.stderr[-2000:]}")


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    if not os.path.exists(COVER_PATH):
        print(f"ERROR: cover image not found at {COVER_PATH}")
        sys.exit(1)

    print("Building cover art block once (reused for all chapters)...")
    cover_b64 = build_metadata_block_picture(COVER_PATH, description="Cover (front)")

    processed, skipped = 0, []
    for num, title in sorted(CHAPTER_TITLES.items()):
        fname = FILENAME_PATTERN.format(num)
        src = os.path.join(INPUT_DIR, fname)
        dst = os.path.join(OUTPUT_DIR, fname)

        if not os.path.exists(src):
            skipped.append(fname)
            continue

        if num <= 44:
            chapter_title = f"Chapter {num} - {title}"
        else:
            chapter_title = title  # "Author's Note", "Character Index"
        print(f"[{num:02d}/44] {fname} -> {chapter_title}")
        embed_one(src, dst, cover_b64, chapter_title)
        processed += 1

    print(f"\nDone. {processed} file(s) processed, {len(skipped)} skipped (not found).")
    if skipped:
        print("Skipped:", ", ".join(skipped))


if __name__ == "__main__":
    main()
