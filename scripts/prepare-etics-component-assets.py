#!/usr/bin/env python3
"""Normalize the five approved ETICS component images onto one neutral canvas."""

from pathlib import Path

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ASSET_DIR = ROOT / "public" / "assets" / "technical-library" / "etics"
CANVAS_SIZE = (1200, 900)
CANVAS_COLOUR = (246, 248, 244)
TARGET_BOXES = {
    "component-1-corner-profile.png": (990, 760),
    "component-2-mounting-block.png": (760, 700),
    "component-3-recessed-fixing.png": (900, 620),
    "component-4-window-profile.png": (1020, 720),
    "component-5-starter-profile.png": (860, 750),
}


def content_crop(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    pixels = np.asarray(rgba)
    rgb = pixels[:, :, :3].astype(np.int16)
    alpha = pixels[:, :, 3]

    if alpha.min() < 255:
        mask = alpha > 8
        composite = Image.new("RGB", rgba.size, CANVAS_COLOUR)
        composite.paste(rgba, mask=rgba.getchannel("A"))
    else:
        channel_range = rgb.max(axis=2) - rgb.min(axis=2)
        brightness = rgb.mean(axis=2)
        checkerboard = (channel_range <= 12) & (brightness >= 228)
        cleaned = rgb.copy()
        cleaned[checkerboard] = CANVAS_COLOUR
        composite = Image.fromarray(cleaned.astype(np.uint8), "RGB")
        mask = (channel_range > 12) | (brightness < 225)

    ys, xs = np.where(mask)
    if not len(xs):
        raise ValueError("No component content detected")
    pad_x = max(8, round((xs.max() - xs.min()) * 0.035))
    pad_y = max(8, round((ys.max() - ys.min()) * 0.035))
    box = (
        max(0, int(xs.min()) - pad_x),
        max(0, int(ys.min()) - pad_y),
        min(composite.width, int(xs.max()) + pad_x + 1),
        min(composite.height, int(ys.max()) + pad_y + 1),
    )
    return composite.crop(box)


def normalize(path: Path, target_box: tuple[int, int]) -> None:
    product = content_crop(Image.open(path))
    product.thumbnail(target_box, Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", CANVAS_SIZE, CANVAS_COLOUR)
    x = (CANVAS_SIZE[0] - product.width) // 2
    y = (CANVAS_SIZE[1] - product.height) // 2
    canvas.paste(product, (x, y))
    canvas.save(path, optimize=True)


def main() -> None:
    for filename, target_box in TARGET_BOXES.items():
        normalize(ASSET_DIR / filename, target_box)
        print(f"Normalized {filename}")


if __name__ == "__main__":
    main()
