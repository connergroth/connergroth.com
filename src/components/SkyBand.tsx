import React, { useEffect, useRef, useState } from 'react';

/**
 * SkyBand — a procedurally drawn, dithered sky behind a static dithered
 * Flatirons cutout.
 *
 * The mountains are a build-time asset (a photo run through a 4-colour riso
 * separation + ordered dither, saved as a transparent PNG). Nothing about them
 * moves. The sky is the live layer: same 4-colour palette language, drawn at
 * quarter resolution into an ImageData buffer and upscaled with smoothing off,
 * so the pixels stay chunky and the whole thing costs ~nothing.
 *
 * It's driven by the real time and real weather where Conner is, not the
 * visitor's — so it's the same signal as the "boulder → san diego" status line.
 */

/* Where "here" is. Swap when he moves; the sky follows. */
const HOME = { lat: 32.7157, lon: -117.1611, label: 'san diego' };

/* Palette keyframes, ordered top-of-sky → horizon. Interpolated by hour. */
type Palette = [number, number, number][];
const KEYS: { h: number; p: Palette }[] = [
  { h: 0.0, p: [[8, 10, 30], [17, 24, 64], [34, 46, 102], [242, 232, 213]] },      // night
  { h: 5.2, p: [[24, 26, 78], [80, 62, 128], [214, 118, 110], [255, 214, 168]] },  // dawn
  { h: 7.4, p: [[28, 75, 184], [122, 143, 214], [244, 162, 89], [255, 227, 174]] },// morning
  { h: 12.0, p: [[29, 63, 214], [53, 92, 232], [143, 181, 245], [242, 232, 213]] },// midday
  { h: 18.2, p: [[30, 70, 190], [109, 132, 216], [240, 150, 90], [255, 227, 174]] },// golden
  { h: 20.0, p: [[43, 30, 92], [196, 61, 99], [240, 124, 63], [247, 208, 135]] },  // dusk
  { h: 21.6, p: [[8, 10, 30], [17, 24, 64], [34, 46, 102], [242, 232, 213]] },     // night
  { h: 24.0, p: [[8, 10, 30], [17, 24, 64], [34, 46, 102], [242, 232, 213]] },
];

function paletteAt(hour: number): Palette {
  let a = KEYS[0], b = KEYS[KEYS.length - 1];
  for (let i = 0; i < KEYS.length - 1; i++) {
    if (hour >= KEYS[i].h && hour <= KEYS[i + 1].h) { a = KEYS[i]; b = KEYS[i + 1]; break; }
  }
  const t = b.h === a.h ? 0 : (hour - a.h) / (b.h - a.h);
  return a.p.map((c, i) =>
    c.map((v, k) => Math.round(v + (b.p[i][k] - v) * t))
  ) as Palette;
}

/* 4x4 Bayer, centred on zero — same matrix the build-time script uses on the
   mountains, which is what makes the two layers read as one print. */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => v / 16 - 0.5);

interface Sky { sunrise: number; sunset: number; cloud: number }
const FALLBACK: Sky = { sunrise: 6.2, sunset: 19.9, cloud: 25 };

async function fetchSky(): Promise<Sky> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${HOME.lat}&longitude=${HOME.lon}` +
    `&current=cloud_cover&daily=sunrise,sunset&timezone=auto&forecast_days=1`;
  const r = await fetch(url);
  if (!r.ok) throw new Error('sky fetch failed');
  const j = await r.json();
  const hrs = (iso: string) => {
    const d = new Date(iso);
    return d.getHours() + d.getMinutes() / 60;
  };
  return {
    sunrise: hrs(j.daily.sunrise[0]),
    sunset: hrs(j.daily.sunset[0]),
    cloud: j.current.cloud_cover ?? FALLBACK.cloud,
  };
}

/* Local hour where HOME is, regardless of where the visitor is sitting.
   ?sky=21.5 forces an hour — handy for eyeballing dusk at 2pm. */
function homeHour(): number {
  const forced = new URLSearchParams(window.location.search).get('sky');
  if (forced !== null && !Number.isNaN(Number(forced))) return Number(forced) % 24;
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    hour: 'numeric', minute: 'numeric', hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  return (get('hour') % 24) + get('minute') / 60;
}

export default function SkyBand({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const skyRef = useRef<Sky>(FALLBACK);
  const [weather, setWeather] = useState<Sky | null>(null);

  useEffect(() => {
    let alive = true;
    fetchSky()
      .then((s) => { if (alive) { skyRef.current = s; setWeather(s); } })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const SCALE = 2;                       // draw at half res, upscale hard
    let w = 0, h = 0, img: ImageData | null = null, noise: Float32Array | null = null;
    let starAt: Set<number> = new Set();

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width / SCALE));
      h = Math.max(1, Math.round(r.height / SCALE));
      canvas.width = w; canvas.height = h;
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
      img = ctx.createImageData(w, h);
      // static grain field — regenerating it per frame makes the print sizzle
      noise = new Float32Array(w * h);
      for (let i = 0; i < noise.length; i++) noise[i] = (Math.random() - 0.5) * 0.22;
      // stars as a flat index set so the pixel loop stays O(1) per pixel
      starAt = new Set();
      const n = Math.round(w * h * 0.004);
      for (let i = 0; i < n; i++) {
        const sx = Math.floor(Math.random() * w);
        const sy = Math.floor(Math.random() * h * 0.82);
        starAt.add(sy * w + sx);
      }
    };

    const draw = (tMs: number) => {
      if (!img || !noise) return;
      // The horizon is the BOTTOM of the band, not the ridgeline — the ridge only
      // reaches the top edge at the peak, and the palette has to keep ramping in
      // the gaps beside it or the sky flattens into one slab of horizon colour.
      const horizon = h;
      const { sunrise, sunset, cloud } = skyRef.current;
      const hour = homeHour();
      const pal = paletteAt(hour);
      const data = img.data;

      // sun/moon: 0→1 across the band between sunrise and sunset, arc for height
      const dayFrac = (hour - sunrise) / Math.max(0.5, sunset - sunrise);
      const isDay = dayFrac >= 0 && dayFrac <= 1;
      // at night, run the moon across on the same arc using the night's span
      const nightFrac = hour > sunset
        ? (hour - sunset) / Math.max(0.5, 24 - sunset + sunrise)
        : (hour + 24 - sunset) / Math.max(0.5, 24 - sunset + sunrise);
      const frac = isDay ? dayFrac : nightFrac;
      const cx = frac * w;
      const rad = Math.max(3, horizon * (isDay ? 0.17 : 0.10));
      // keep the whole disc inside the band — on a short band the noon arc would
      // otherwise put the centre less than a radius from the top edge and clip it
      const cy = Math.max(
        rad * 1.15,
        horizon * (1.0 - 0.82 * Math.sin(Math.PI * Math.min(1, Math.max(0, frac)))),
      );

      const phase = reduced ? 0 : (tMs / 1000) * 0.055;
      const amp = 0.22 + (cloud / 100) * 0.85;   // overcast = more, heavier bands
      const nightness = isDay ? 0 : 1;

      // the three cloud bands separate into a per-column sine and a per-row
      // gaussian, so precompute both instead of calling sin/exp per pixel
      const s1 = new Float32Array(w), s2 = new Float32Array(w), s3 = new Float32Array(w);
      for (let x = 0; x < w; x++) {
        const u = x / w;
        s1[x] = amp * 0.62 * Math.sin(u * 6.0 + phase);
        s2[x] = amp * 0.45 * Math.sin(u * 3.1 - phase * 0.6 + 1.3);
        s3[x] = amp * 0.28 * Math.sin(u * 11.0 + phase * 1.7);
      }
      const g1 = new Float32Array(h), g2 = new Float32Array(h), g3 = new Float32Array(h), base = new Float32Array(h);
      for (let y = 0; y < h; y++) {
        const v = y / horizon;                 // 0 at the top edge, 1 at the skyline
        base[y] = Math.min(4.2, v * 2.7);
        g1[y] = Math.exp(-((v - 0.26) ** 2) / 0.022);
        g2[y] = Math.exp(-((v - 0.48) ** 2) / 0.026);
        g3[y] = Math.exp(-((v - 0.70) ** 2) / 0.024);
      }

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          let f = base[y] + s1[x] * g1[y] + s2[x] * g2[y] + s3[x] * g3[y];

          const dx = x - cx, dy = y - cy;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < rad * 2.4) f -= 0.7;
          if (d < rad) f = 3.9;

          const i = y * w + x;
          f += BAYER[(y & 3) * 4 + (x & 3)] * 0.38 + noise[i] * 0.5;

          let idx = Math.floor((f / 3.9) * 4);
          idx = idx < 0 ? 0 : idx > 3 ? 3 : idx;
          let [r, g, b] = pal[idx];

          // flat star dots, only once the sun is actually down
          if (nightness > 0 && idx <= 1 && starAt.has(i)) {
            r = pal[3][0]; g = pal[3][1]; b = pal[3][2];
          }

          const o = i * 4;
          data[o] = r; data[o + 1] = g; data[o + 2] = b; data[o + 3] = 255;
        }
      }

      ctx.putImageData(img, 0, 0);
    };

    let raf = 0, last = 0;
    const loop = (t: number) => {
      if (t - last > 33) { draw(t); last = t; }       // 30fps ceiling
      raf = requestAnimationFrame(loop);
    };

    resize();
    draw(0);
    if (!reduced) raf = requestAnimationFrame(loop);

    const ro = new ResizeObserver(() => { resize(); draw(performance.now()); });
    ro.observe(canvas);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [weather]);

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full"
        style={{ imageRendering: 'pixelated' }}
      />
      {/* Full-width, bottom-anchored, natural height. The asset is a thin ridge
          strip (1800x210) so its rendered height stays under the band at every
          viewport width — no cropping, so the low left-hand ridge never vanishes. */}
      <img
        src="/assets/images/flatirons-riso.png"
        alt="The Flatirons, Boulder"
        className="absolute inset-x-0 bottom-0 w-full h-auto select-none pointer-events-none"
        style={{ imageRendering: 'pixelated' }}
        draggable={false}
      />
    </div>
  );
}
