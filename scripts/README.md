# scripts

- `generateSitemap.cjs` — runs on every `npm run build`; the site is one page, so
  the sitemap is one `<url>`.
- `riso.py` / `riso_web.py` — the build-time pipeline that turns a Flatirons photo
  into `public/assets/images/flatirons-riso.png`: median-filter the pebble detail
  away, separate into exactly 4 flat plates by luminance percentile + a greenness
  test, bayer-dither the edges, grain, then a 1px channel offset so it reads
  off-register like a screen print. The runtime canvas (`src/components/SkyBand.tsx`)
  reads those same 4 plate colours, which is what makes the ridge and the sky read
  as one print instead of a PNG on a gradient.

  `riso_web.py` renders the mockups (`sky-*.png`) plus the full-size cutout, and is
  where to tune the separation by eye. Needs `pillow` + `numpy`.

- `make_strip.py` — photo → the actual shipped asset, in one command. Same separation
  as `riso_web.py`, but it also cuts the ridge band and squashes it ~12:1 with
  nearest-neighbour (so the plate edges stay hard), writing the 1800×150 RGBA cutout
  in the shipped sandstone palette:

      python3 scripts/make_strip.py <photo.jpg> public/assets/images/flatirons-riso.png [top] [thresh] [p1,p2,p3] [x0,y0,x1,y1]

  - `top` — fraction cropped off the top of the photo before the banner crop. Raise it
    until the sky mask stops reading haze as ridgeline.
  - `thresh` — colour distance from the top-6-rows sky reference that counts as terrain.
    Raise it for a hazy or gradient sky.
  - `p1,p2,p3` — luminance percentiles for the shadow/tree/rock plate splits. Lower them
    to pull the black plate back and let rock and cream through. Raise `p3` to shrink the
    cream plate, which is what makes lit rock stop reading as snow.
  - `x0,y0,x1,y1` — optional fractional crop applied before everything else. This is the
    framing dial: the whole range edge to edge vs. a zoomed, angled read on the slabs.
    Everything downstream operates on the crop, so `top` is relative to it.

  Wants a snow-free, sky-visible shot. Snow washes every plate to cream; a stormy sky
  breaks the mask outright. The ridgeline only has to run the full width of the *crop*.

## Header photo credit

`public/assets/images/flatirons-riso.png` is a four-colour derivative of
[The Flatirons in autumn](https://commons.wikimedia.org/wiki/File:The_Flatirons_in_autumn..JPG)
by Eddyl via Wikimedia Commons, licensed **CC BY-SA 3.0**. Built with
`make_strip.py <photo> … 0.10 75 12,42,72 0.14,0.05,0.90,0.55` — the whole range,
cropped in about 1.3× so it reads as mountains rather than a distant horizon line.
Source photos kept at `~/Archives/site-sources/connergroth.com/`.
