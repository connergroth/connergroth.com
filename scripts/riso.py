#!/usr/bin/env python3
"""Riso/screenprint pipeline mockup: photo -> posterized 4-colour cutout -> composited
over a flat procedural sky at N times of day. Proves the build-time step + the runtime layer."""
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

SRC = "sunrise.jpg"
W, H = 1600, 520          # banner band, roughly the header strip at 2x

# ---------- 1. load + crop to a banner that keeps the ridgeline ----------
im = Image.open(SRC).convert("RGB")
iw, ih = im.size
# keep the mountains, drop some foreground trees
crop_h = int(iw * H / W)
top = int(ih * 0.06)
im = im.crop((0, top, iw, min(ih, top + crop_h))).resize((W, H), Image.LANCZOS)

# ---------- 2. sky mask: walk down each column from the top ----------
a = np.asarray(im).astype(np.int16)
sky_ref = a[0:6].reshape(-1, 3).mean(axis=0)
# per-column: distance from the sky reference colour
dist = np.sqrt(((a - sky_ref) ** 2).sum(axis=2))
is_terrain = dist > 46
ridge = np.full(W, H, dtype=np.int32)
for x in range(W):
    col = np.where(is_terrain[:, x])[0]
    if len(col):
        # first row with 8 consecutive terrain pixels = real ridge, not a cloud edge
        for y in col:
            if y + 8 < H and is_terrain[y:y + 8, x].all():
                ridge[x] = y
                break
# smooth the ridgeline so noise doesn't make it jagged
k = 9
pad = np.pad(ridge.astype(float), k, mode="edge")
ridge = np.convolve(pad, np.ones(2 * k + 1) / (2 * k + 1), "same")[k:-k].astype(int)

yy = np.arange(H)[:, None]
terrain_mask = (yy >= ridge[None, :])

# headroom: a header band wants the ridgeline low and lots of sky above it, so grow the
# canvas upward and push the photo down. the extra rows are pure procedural sky.
PAD = 210

# ---------- 3. posterize the terrain to a hard 4-colour print palette ----------
TERRAIN_PALETTE = [
    (0x1a, 0x1a, 0x22),   # near-black
    (0x1f, 0x4d, 0x2e),   # deep forest green
    (0xd6, 0x4f, 0x2a),   # rust / flatiron sandstone
    (0xf2, 0xe8, 0xd5),   # cream
]

def quantize(arr, palette):
    pal = np.array(palette, dtype=np.int16)
    d = ((arr[:, :, None, :] - pal[None, None, :, :]) ** 2).sum(axis=3)
    return pal[d.argmin(axis=2)].astype(np.uint8)

BAYER = np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]) / 16.0 - 0.5

t = im.copy()
# flatten the photo into poster regions BEFORE quantizing: median kills the pebble
# detail but keeps the ridgeline, which is what makes it read as cut paper not a photo
for r in (9, 9, 7, 7):
    t = t.filter(ImageFilter.MedianFilter(r))
t = ImageEnhance.Color(t).enhance(2.6)      # crank saturation like the reference
t = ImageEnhance.Contrast(t).enhance(1.5)
t = t.filter(ImageFilter.SMOOTH_MORE)
ta = np.asarray(t).astype(np.int16)
tile = np.tile(BAYER, (H // 4 + 1, W // 4 + 1))[:H, :W][:, :, None]
ta = np.clip(ta + tile * 16, 0, 255).astype(np.int16)   # light dither = broken print edge

# proper riso separation: don't nearest-colour match (a snowy photo would go all cream).
# split by greenness for the forest plate, then a luminance ramp for the rock plates.
BLACK, GREEN, RUST, CREAM = (np.array(c, dtype=np.uint8) for c in TERRAIN_PALETTE)
lum = (ta[:, :, 0] * 0.299 + ta[:, :, 1] * 0.587 + ta[:, :, 2] * 0.114)
greenness = ta[:, :, 1] - (ta[:, :, 0].astype(np.int16) + ta[:, :, 2]) / 2
inside = lum[terrain_mask]
p30, p58, p82 = np.percentile(inside, [30, 58, 82])

plate = np.zeros((H, W, 3), dtype=np.uint8)
plate[:] = CREAM
plate[lum < p82] = RUST
plate[lum < p58] = GREEN
plate[lum < p30] = BLACK
plate[(greenness > 4) & (lum >= p30)] = GREEN     # trees stay trees
terrain_rgb = plate

terrain = np.dstack([terrain_rgb, np.where(terrain_mask, 255, 0).astype(np.uint8)])
Image.fromarray(terrain, "RGBA").save("flatirons-cutout.png")

# shift everything down into the padded canvas
H = H + PAD
ridge = ridge + PAD
_t = np.zeros((H, W, 3), dtype=np.uint8); _t[PAD:] = terrain_rgb; terrain_rgb = _t
_m = np.zeros((H, W), dtype=bool); _m[PAD:] = terrain_mask; terrain_mask = _m

# ---------- 4. flat procedural sky, one per time of day ----------
SKIES = {
    "1-day":   [(0x1d, 0x3f, 0xd6), (0x35, 0x5c, 0xe8), (0x8f, 0xb5, 0xf5), (0xf2, 0xe8, 0xd5)],
    "2-dusk":  [(0x2b, 0x1e, 0x5c), (0xc4, 0x3d, 0x63), (0xf0, 0x7c, 0x3f), (0xf7, 0xd0, 0x87)],
    "3-night": [(0x08, 0x0a, 0x1e), (0x11, 0x18, 0x40), (0x22, 0x2e, 0x66), (0xf2, 0xe8, 0xd5)],
}
# sun/moon: x, y as 0..1 of the band, radius px. kept clear of the big right-hand peak
SUN = {"1-day": (0.44, 0.26, 40), "2-dusk": (0.22, 0.62, 48), "3-night": (0.50, 0.24, 24)}
SKY_H = max(float(ridge.min()), 1.0) + 0.55 * (ridge.mean() - ridge.min())

def make_sky(name, cols, phase=0.0):
    pal = np.array(cols, dtype=np.int16)
    gy, gx = np.mgrid[0:H, 0:W].astype(np.float32)
    v = np.clip(gy / SKY_H, 0, 1)      # spread the palette over the VISIBLE sky only
    u = gx / W
    # vertical field + three slow sine cloud bands. phase is the animated term.
    f = v * 2.5
    f += 0.55 * np.sin(u * 6.0 + phase) * np.exp(-((v - 0.55) ** 2) / 0.035)
    f += 0.40 * np.sin(u * 3.1 - phase * 0.6 + 1.3) * np.exp(-((v - 0.80) ** 2) / 0.030)
    f += 0.25 * np.sin(u * 11.0 + phase * 1.7) * np.exp(-((v - 0.33) ** 2) / 0.018)
    # sun / moon disc
    sx, sy, r = SUN[name]
    d = np.sqrt((gx - sx * W) ** 2 + (gy - sy * SKY_H) ** 2)
    f = np.where((d >= r) & (d < r * 2.4), f - 0.7, f)    # halo, drawn first
    f = np.where(d < r, 3.9, f)
    # ordered dither so the bands break up into print texture instead of hard edges
    f = f + np.tile(BAYER, (H // 4 + 1, W // 4 + 1))[:H, :W] * 0.45
    idx = np.clip((f / 3.9 * len(pal)).astype(int), 0, len(pal) - 1)
    sky = pal[idx].astype(np.uint8)
    if name == "3-night":                                   # flat star dots
        rng = np.random.default_rng(7)
        for _ in range(90):
            x, y = rng.integers(0, W), rng.integers(0, int(H * 0.7))
            sky[max(0, y - 1):y + 2, max(0, x - 1):x + 2] = pal[3]
    return sky

# ---------- 5. composite + grain ----------
def grain(arr, amount=17, seed=3):
    rng = np.random.default_rng(seed)
    n = rng.normal(0, amount, arr.shape[:2])[:, :, None]
    n = n + rng.normal(0, amount * 0.55, arr.shape)          # per-channel speckle
    return np.clip(arr.astype(np.float32) + n, 0, 255).astype(np.uint8)

for name, cols in SKIES.items():
    sky = make_sky(name, cols, phase=0.0)
    out = np.where(terrain_mask[:, :, None], terrain_rgb, sky)
    out = grain(out)
    img = Image.fromarray(out, "RGB")
    # very slight chromatic misregistration, like an off-register screen print
    r, g, b = img.split()
    r = r.transform(img.size, Image.AFFINE, (1, 0, -1.2, 0, 1, 0))
    b = b.transform(img.size, Image.AFFINE, (1, 0, 1.2, 0, 1, 0.6))
    img = Image.merge("RGB", (r, g, b))
    img.save(f"sky-{name}.png")
    print("wrote", f"sky-{name}.png")
