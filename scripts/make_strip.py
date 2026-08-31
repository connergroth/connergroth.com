#!/usr/bin/env python3
"""photo -> the shipped 1800x150 sandstone ridge strip.

Same separation as riso_web.py (median flatten -> sky mask -> luminance percentile
plates -> bayer), but emits the actual site asset: a 4-colour RGBA cutout, binary
alpha, squashed ~12:1 with nearest-neighbour so the plate edges stay hard.

  python3 make_strip.py <photo.jpg> <out.png> [top] [thresh] [p1,p2,p3] [x0,y0,x1,y1]

The last argument is an optional fractional crop applied BEFORE anything else, which
is how you pick the framing: a wide shot of the whole range vs. a zoomed, angled read
on the slabs. Everything downstream (top, sky mask, plates) works on the crop.
"""
import sys
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

SRC = sys.argv[1]
OUT = sys.argv[2]
TOP = float(sys.argv[3]) if len(sys.argv) > 3 else 0.06
THRESH = float(sys.argv[4]) if len(sys.argv) > 4 else 46.0
PCT = [float(x) for x in sys.argv[5].split(",")] if len(sys.argv) > 5 else [30, 58, 82]
CROP = [float(x) for x in sys.argv[6].split(",")] if len(sys.argv) > 6 else None

W, H = 2400, 780
BAND = 200                      # 2400x200 -> 1800x150, the shipped 12:1
OUT_W, OUT_H = 1800, 150

# sandstone, shipped 8/5 as 1487eb0 (shadow, trees, rock, highlight)
PALETTE = [(36, 26, 22), (92, 107, 60), (201, 138, 82), (242, 232, 213)]
BLACK, GREEN, RUST, CREAM = (np.array(c, dtype=np.uint8) for c in PALETTE)
BAYER = np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]) / 16.0 - 0.5

# ---- 1. frame the shot, then crop to a banner that keeps the ridgeline ----
im = Image.open(SRC).convert("RGB")
if CROP:
    fw, fh = im.size
    im = im.crop((int(fw * CROP[0]), int(fh * CROP[1]), int(fw * CROP[2]), int(fh * CROP[3])))
iw, ih = im.size
crop_h = int(iw * H / W)
top = int(ih * TOP)
im = im.crop((0, top, iw, min(ih, top + crop_h))).resize((W, H), Image.LANCZOS)

# ---- 2. sky mask: walk down each column, 8 consecutive terrain px = real ridge ----
a = np.asarray(im).astype(np.int16)
sky_ref = a[0:6].reshape(-1, 3).mean(axis=0)
is_terrain = np.sqrt(((a - sky_ref) ** 2).sum(axis=2)) > THRESH
ridge = np.full(W, H, dtype=np.int32)
for x in range(W):
    for y in np.where(is_terrain[:, x])[0]:
        if y + 8 < H and is_terrain[y:y + 8, x].all():
            ridge[x] = y
            break
k = 9
pad = np.pad(ridge.astype(float), k, mode="edge")
ridge = np.convolve(pad, np.ones(2 * k + 1) / (2 * k + 1), "same")[k:-k].astype(int)
terrain_mask = np.arange(H)[:, None] >= ridge[None, :]

# ---- 3. flatten to poster regions, then separate into 4 plates ----
t = im.copy()
for r in (9, 9, 7, 7):
    t = t.filter(ImageFilter.MedianFilter(r))
t = ImageEnhance.Color(t).enhance(2.6)
t = ImageEnhance.Contrast(t).enhance(1.5)
t = t.filter(ImageFilter.SMOOTH_MORE)
ta = np.asarray(t).astype(np.int16)
ta = np.clip(ta + np.tile(BAYER, (H // 4 + 1, W // 4 + 1))[:H, :W][:, :, None] * 16, 0, 255)

lum = ta[:, :, 0] * 0.299 + ta[:, :, 1] * 0.587 + ta[:, :, 2] * 0.114
greenness = ta[:, :, 1] - (ta[:, :, 0] + ta[:, :, 2]) / 2
p30, p58, p82 = np.percentile(lum[terrain_mask], PCT)

plate = np.zeros((H, W, 3), dtype=np.uint8)
plate[:] = CREAM
plate[lum < p82] = RUST
plate[lum < p58] = GREEN
plate[lum < p30] = BLACK
plate[(greenness > 4) & (lum >= p30)] = GREEN

rgba = np.dstack([plate, np.where(terrain_mask, 255, 0).astype(np.uint8)])

# ---- 4. cut the ridge band and squash it 12:1 ----
y0 = max(0, int(ridge.min()) - 8)
y1 = min(H, int(ridge.max()) + 130)
if y1 - y0 < BAND:
    y1 = min(H, y0 + BAND)
band = Image.fromarray(rgba[y0:y1], "RGBA").resize((OUT_W, OUT_H), Image.NEAREST)
band.save(OUT)
print(f"{OUT}  src={SRC} top={TOP} ridge min/mean/max={ridge.min()}/{int(ridge.mean())}/{ridge.max()}")
