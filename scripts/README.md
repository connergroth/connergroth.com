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

  To swap in a new photo: point `SRC` at it, run `python3 scripts/riso_web.py`, and
  drop the output over the asset. Wants a summer, sky-visible shot — snow washes
  every plate to cream. Needs `pillow` + `numpy`.
