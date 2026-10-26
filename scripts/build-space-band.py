"""Builds the space theme's photographs from one source:
public/images/space/hubble-xdf-band{,-narrow}.webp, the dark theme's sky on
wide and narrow screens, and
assets/space/hubble-xdf-card.jpg, the share card's background.

Source: assets/space/hubble-xdf.jpg, the Hubble eXtreme Deep Field (NASA, ESA,
G. Illingworth, D. Magee, P. Oesch, R. Bouwens and the HUDF09 Team; public
domain under NASA's media guidelines), as bundled with scikit-image.

The page cannot fade an image with a CSS gradient (DESIGN.md §13), so the fade
is baked in: the photo is dimmed so text over it keeps its contrast, then
eased to black at the bottom and both sides. The page blends it with `screen`,
so black is the page's own sky and the band has no edge.

    python3 scripts/build-space-band.py
"""

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "assets" / "space" / "hubble-xdf.jpg"
OUTPUT = ROOT / "public" / "images" / "space" / "hubble-xdf-band.webp"
NARROW = ROOT / "public" / "images" / "space" / "hubble-xdf-band-narrow.webp"
CARD = ROOT / "assets" / "space" / "hubble-xdf-card.jpg"
WIDTH = 1600
CARD_SIZE = (1200, 630)


def smoothstep(t):
    t = np.clip(t, 0, 1)
    return t * t * (3 - 2 * t)


def main():
    photo = Image.open(SOURCE).convert("RGB")
    height = round(photo.height * WIDTH / photo.width)
    pixels = np.asarray(photo.resize((WIDTH, height), Image.LANCZOS)).astype(np.float32) / 255
    # Dim: a gentle curve pulls down the midtones, then a ceiling for contrast.
    pixels = pixels**1.15 * 0.5
    y = np.linspace(0, 1, height)[:, None]
    x = np.linspace(0, 1, WIDTH)[None, :]
    fade = (1 - smoothstep((y - 0.35) / 0.6)) * smoothstep(x / 0.2) * smoothstep((1 - x) / 0.2)
    # The band is centred on the page, so its middle is the reading column: the
    # photo drops to a third there, and keeps its full depth in the gutters.
    column = np.abs(x - 0.5) * WIDTH
    wide = fade * (0.32 + 0.68 * smoothstep((column - 330) / 220))
    # Below md the text spans the screen and there are no gutters, so the whole
    # visible middle is held at an even, slightly brighter level instead.
    narrow = fade * 0.55
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    for path, mask in ((OUTPUT, wide), (NARROW, narrow)):
        band = (pixels * mask[..., None]).clip(0, 1)
        Image.fromarray((band * 255 + 0.5).astype(np.uint8)).save(path, quality=70)
        print(f"{path.relative_to(ROOT)}: {WIDTH}x{height}, {path.stat().st_size} bytes")

    # The card: the field's centre at 1200x630, darker still under the type,
    # which runs along the left and across the middle.
    card_width, card_height = CARD_SIZE
    scaled = photo.resize((card_width, round(photo.height * card_width / photo.width)), Image.LANCZOS)
    top = (scaled.height - card_height) // 2
    pixels = np.asarray(scaled.crop((0, top, card_width, top + card_height))).astype(np.float32) / 255
    x = np.linspace(0, 1, card_width)[None, :]
    shade = 0.18 + 0.32 * smoothstep((x - 0.45) / 0.5)
    card = ((pixels**1.15) * shade[..., None]).clip(0, 1)
    Image.fromarray((card * 255 + 0.5).astype(np.uint8)).save(CARD, quality=82)
    print(f"{CARD.relative_to(ROOT)}: {card_width}x{card_height}, {CARD.stat().st_size} bytes")


if __name__ == "__main__":
    main()
