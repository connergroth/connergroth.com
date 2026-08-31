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

      python3 scripts/make_strip.py <photo.jpg> public/assets/images/flatirons-riso.png [top] [thresh] [p1,p2,p3]

  - `top` — fraction cropped off the top of the photo before the banner crop. Raise it
    until the sky mask stops reading haze as ridgeline.
  - `thresh` — colour distance from the top-6-rows sky reference that counts as terrain.
    Raise it for a hazy or gradient sky.
  - `p1,p2,p3` — luminance percentiles for the shadow/tree/rock plate splits. Lower them
    to pull the black plate back and let rock and cream through.

  Wants a snow-free, sky-visible shot with the ridgeline clear across the full width.
  Snow washes every plate to cream; a stormy sky breaks the mask outright.

## Header photo credit

`public/assets/images/flatirons-riso.png` is a four-colour derivative of
[The Flatirons in autumn](https://commons.wikimedia.org/wiki/File:The_Flatirons_in_autumn..JPG)
by Eddyl via Wikimedia Commons, licensed **CC BY-SA 3.0**. Built with
`make_strip.py autumn.jpg … 0.18 75 18,48,76`.
