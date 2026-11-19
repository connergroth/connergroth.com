import { useEffect, useRef, useState } from 'react';

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
 * visitor's.
 */

/* Where "here" is. Swap when he moves; the sky follows. */
const HOME = { lat: 40.015, lon: -105.2705, tz: 'America/Denver', label: 'boulder' };

/* Palette keyframes, ordered top-of-sky → horizon. Interpolated by hour. */
type Palette = [number, number, number][];
const KEYS: { h: number; p: Palette }[] = [
  { h: 0.0, p: [[12, 14, 32], [24, 31, 66], [48, 58, 103], [242, 232, 213]] },     // night
  { h: 5.2, p: [[54, 55, 85], [99, 89, 127], [199, 143, 138], [255, 214, 168]] },  // dawn
  { h: 7.4, p: [[69, 96, 159], [145, 157, 198], [226, 178, 136], [255, 227, 174]] },// morning
  { h: 12.0, p: [[68, 88, 176], [90, 113, 194], [167, 189, 226], [242, 232, 213]] },// midday
  { h: 18.2, p: [[69, 93, 162], [134, 148, 196], [221, 169, 134], [255, 227, 174]] },// golden
  { h: 20.0, p: [[53, 43, 92], [184, 78, 108], [226, 135, 87], [247, 208, 135]] }, // dusk
  { h: 21.6, p: [[12, 14, 32], [24, 31, 66], [48, 58, 103], [242, 232, 213]] },    // night
  { h: 24.0, p: [[12, 14, 32], [24, 31, 66], [48, 58, 103], [242, 232, 213]] },
];

/* The ridge's four ink plates, lit by the same clock as the sky. The shipped
   PNG is exactly four flat colours, so this is an exact plate swap, not a
   filter — the dither edges stay hard and no fifth colour is ever invented.
   Midday IS the shipped asset; everything else is that asset relit. */
const RIDGE_SRC_PLATES: Palette = [
  [36, 26, 22],     // shadow
  [92, 107, 60],    // trees
  [201, 138, 82],   // rock
  [242, 232, 213],  // sunlit face
];
const RIDGE_KEYS: { h: number; p: Palette }[] = [
  { h: 0.0, p: [[12, 12, 20], [20, 28, 34], [58, 52, 66], [112, 124, 156]] },      // night — moonlit, near silhouette
  { h: 5.2, p: [[26, 22, 32], [52, 64, 54], [140, 102, 86], [214, 186, 176]] },    // dawn — cold and muted
  { h: 7.4, p: [[34, 26, 26], [86, 102, 62], [190, 134, 88], [240, 232, 220]] },   // morning
  { h: 12.0, p: [[36, 26, 22], [92, 107, 60], [201, 138, 82], [242, 232, 213]] },  // midday — the shipped asset
  { h: 18.2, p: [[30, 22, 22], [74, 86, 52], [196, 120, 66], [248, 220, 168]] },   // golden
  { h: 20.0, p: [[22, 14, 26], [38, 42, 38], [126, 70, 58], [206, 142, 102]] },    // dusk — backlit, alpenglow on the faces
  { h: 21.6, p: [[12, 12, 20], [20, 28, 34], [58, 52, 66], [112, 124, 156]] },     // night
  { h: 24.0, p: [[12, 12, 20], [20, 28, 34], [58, 52, 66], [112, 124, 156]] },
];

function lerpKeys(keys: { h: number; p: Palette }[], hour: number): Palette {
  let a = keys[0], b = keys[keys.length - 1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (hour >= keys[i].h && hour <= keys[i + 1].h) { a = keys[i]; b = keys[i + 1]; break; }
  }
  const t = b.h === a.h ? 0 : (hour - a.h) / (b.h - a.h);
  return a.p.map((c, i) =>
    c.map((v, k) => Math.round(v + (b.p[i][k] - v) * t))
  ) as Palette;
}

/* Snow on the ridge: the same plate swap with two plates changed. The sunlit
   face goes to snow and the rock goes partway to a cold pale (dusted, not
   buried); trees and shadow keep their ink. One [rock, face] pair per
   RIDGE_KEYS entry, so the snow is lit by the same clock as everything else —
   at night it's moonlit blue-grey, never white. */
const RIDGE_SNOW: [Palette[number], Palette[number]][] = [
  [[76, 84, 112], [148, 162, 198]],    // night
  [[164, 146, 152], [226, 216, 224]],  // dawn
  [[204, 190, 184], [240, 242, 244]],  // morning
  [[204, 194, 192], [236, 241, 248]],  // midday — a shade under the page's paper, so the band keeps its bottom edge
  [[218, 182, 156], [255, 242, 218]],  // golden
  [[150, 110, 120], [228, 180, 166]],  // dusk — alpenglow on the snow
  [[76, 84, 112], [148, 162, 198]],    // night
  [[76, 84, 112], [148, 162, 198]],
];
const RIDGE_SNOW_KEYS = RIDGE_KEYS.map((k, i) => ({
  h: k.h,
  p: [k.p[0], k.p[1], RIDGE_SNOW[i][0], RIDGE_SNOW[i][1]] as Palette,
}));

/* The keyframe hours above are a midsummer day (sunrise ~6:10, sunset ~7:55).
   Each one is really tied to the sun — dawn an hour before sunrise, dusk on
   the sunset — so the real clock is mapped onto that timeline piecewise,
   anchor to anchor, using today's sunrise/sunset. Palette, ridge and the
   sun's arc then agree in any season instead of dusk landing at 8pm in
   November. */
const KEY_REF = [0, 5.2, 7.4, 12.0, 18.2, 19.9, 21.6, 24];
const anchors = ({ sunrise, sunset }: Sky) =>
  [0, sunrise - 1.0, sunrise + 1.2, (sunrise + sunset) / 2, sunset - 1.7, sunset, sunset + 1.7, 24];
function keyHour(hour: number, sky: Sky): number {
  const a = anchors(sky);
  for (let i = 0; i < a.length - 1; i++) {
    if (hour >= a[i] && hour <= a[i + 1]) {
      const t = a[i + 1] === a[i] ? 0 : (hour - a[i]) / (a[i + 1] - a[i]);
      return KEY_REF[i] + (KEY_REF[i + 1] - KEY_REF[i]) * t;
    }
  }
  return hour;
}

const paletteAt = (hour: number, sky: Sky) => lerpKeys(KEYS, keyHour(hour, sky));
const ridgePaletteAt = (hour: number, sky: Sky, snow: boolean) =>
  lerpKeys(snow ? RIDGE_SNOW_KEYS : RIDGE_KEYS, keyHour(hour, sky));

/* Cheap repeatable 0-1 hash, so anything "random" per gust is a pure function
   of which gust it is and needs no state between frames. */
const hash = (a: number, b: number) => {
  const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return v - Math.floor(v);
};

/* Seeded PRNG. The sky effect re-runs when the weather lands and on every
   resize, so anything placed with Math.random (stars, grain, flakes) used to
   reshuffle mid-load and visibly jump. Same seed, same sky, every run. */
const mulberry = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/* 4x4 Bayer, centred on zero — same matrix the build-time script uses on the
   mountains, which is what makes the two layers read as one print. */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => v / 16 - 0.5);

interface Sky { sunrise: number; sunset: number }

/* What it's doing outside at HOME right now. */
interface Weather {
  cloud: number;                      // 0-100
  tempF: number | null;
  falling: 'none' | 'rain' | 'snow';
  rate: number;                       // 0-1, how hard it's coming down
  fog: boolean;
  ground: boolean;                    // snow lying on the ground
  slant: number;                      // -1..1, wind across the view, + blows left to right
  wind: number;                       // 0-1 gustiness: 0 under ~20 mph gusts, 1 at ~45+
  live: boolean;                      // real (or forced) data, not the pre-fetch default
}

/* Today's sunrise/sunset at HOME, in HOME's local hours, from the NOAA solar
   equations. Computed on the spot so the sun is in its real place on the very
   first frame; waiting on the weather fetch for these made it start wherever a
   hardcoded guess put it and then jump. Good to a couple of minutes. */
function sunTimes(): { sunrise: number; sunset: number } {
  const now = new Date();
  const start = Date.UTC(now.getUTCFullYear(), 0, 1);
  const n = Math.floor((now.getTime() - start) / 86400000);   // day of year, 0-based
  const g = (2 * Math.PI / 365) * n;
  const eq = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g)
    - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g)
    - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g)
    - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
  const lat = HOME.lat * Math.PI / 180;
  const cosHa = Math.cos(90.833 * Math.PI / 180) / (Math.cos(lat) * Math.cos(decl)) - Math.tan(lat) * Math.tan(decl);
  const ha = Math.acos(Math.min(1, Math.max(-1, cosHa))) * 180 / Math.PI;
  // HOME's UTC offset right now, DST included, read off the same zone homeHour uses
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: HOME.tz, hour: 'numeric', minute: 'numeric', hour12: false,
  }).formatToParts(now);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const local = (get('hour') % 24) + get('minute') / 60;
  const utc = now.getUTCHours() + now.getUTCMinutes() / 60;
  const off = ((local - utc + 36) % 24) - 12;
  const toLocal = (utcMin: number) => (((utcMin / 60 + off) % 24) + 24) % 24;
  return {
    sunrise: toLocal(720 - 4 * (HOME.lon + ha) - eq),
    sunset: toLocal(720 - 4 * (HOME.lon - ha) - eq),
  };
}

/* Until the fetch lands, and for good if it fails: the sky as it was before it
   knew about weather. A few clouds, nothing falling, bare rock. */
const FALLBACK: Weather = {
  cloud: 25, tempF: null, falling: 'none', rate: 0, fog: false, ground: false, slant: 0.3, wind: 0, live: false,
};

/* Real lunar phase from the synodic clock — 0 = new, 0.5 = full. Anchored to
   the Aug 12 2026 new moon (the total-eclipse one, so the instant is exactly
   known); the mean synodic month wobbles ±7h per lunation, so a nearby anchor
   keeps the error under a couple hours for years either side — invisible at
   this pixel size. ?moon=0.25 forces a phase for eyeballing. */
const SYNODIC = 29.53058867;
function moonPhase(): number {
  const forced = new URLSearchParams(window.location.search).get('moon');
  if (forced !== null && !Number.isNaN(Number(forced))) return ((Number(forced) % 1) + 1) % 1;
  const days = (Date.now() - Date.UTC(2026, 7, 12, 17, 47)) / 86400000;
  return (((days % SYNODIC) + SYNODIC) % SYNODIC) / SYNODIC;
}

/* WMO codes that mean something is falling, and roughly how hard (0-1). The
   measured amounts usually say more, but drizzle and flurries often report 0mm
   while the code still knows — so the code sets a floor. */
const WMO_RATE: Record<number, number> = {
  51: 0.2, 53: 0.4, 55: 0.6, 56: 0.2, 57: 0.6,            // drizzle
  61: 0.3, 63: 0.55, 65: 0.9, 66: 0.3, 67: 0.9,           // rain
  71: 0.3, 73: 0.55, 75: 0.9, 77: 0.3,                    // snow
  80: 0.35, 81: 0.6, 82: 1, 85: 0.4, 86: 0.9,             // showers
  95: 0.7, 96: 0.9, 99: 1,                                // thunderstorm
};
const WMO_SNOW = [71, 73, 75, 77, 85, 86];
const WMO_FOG = [45, 48];

/* Only the weather comes off the network — the sun's place never waits on it. */
async function fetchWeather(): Promise<Weather> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${HOME.lat}&longitude=${HOME.lon}` +
    `&current=cloud_cover,temperature_2m,precipitation,rain,snowfall,weather_code,snow_depth,` +
    `wind_speed_10m,wind_direction_10m,wind_gusts_10m&temperature_unit=fahrenheit&timezone=auto&forecast_days=1`;
  const r = await fetch(url);
  if (!r.ok) throw new Error('sky fetch failed');
  const c = (await r.json()).current;
  const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);

  // amounts are totals over the reporting interval (15 min); put them per hour
  const perHour = 3600 / (num(c.interval) || 900);
  const code = num(c.weather_code);
  const snowing = num(c.snowfall) > 0 || WMO_SNOW.includes(code);
  const raining = !snowing && (num(c.rain) > 0 || num(c.precipitation) > 0 || code in WMO_RATE);
  // heavy is ~4cm/h of snow or ~10mm/h of rain; past that it's just "a lot"
  const measured = snowing ? (num(c.snowfall) * perHour) / 4 : (num(c.precipitation) * perHour) / 10;
  // The band looks west at the Flatirons, so north is to the right: a south
  // wind (direction = where it comes FROM) pushes things left to right.
  const across = -Math.cos(num(c.wind_direction_10m) * Math.PI / 180) * num(c.wind_speed_10m);
  // gusts are what you notice; fall back to the sustained speed if they're missing.
  // km/h → mph, then ~20 mph is where it starts and ~45 mph is the cap
  const gustMph = Math.max(num(c.wind_gusts_10m), num(c.wind_speed_10m)) / 1.609;

  return {
    cloud: typeof c.cloud_cover === 'number' ? c.cloud_cover : FALLBACK.cloud,
    tempF: typeof c.temperature_2m === 'number' ? c.temperature_2m : null,
    falling: snowing ? 'snow' : raining ? 'rain' : 'none',
    rate: snowing || raining ? Math.min(1, Math.max(0.15, measured, WMO_RATE[code] ?? 0)) : 0,
    fog: WMO_FOG.includes(code),
    ground: num(c.snow_depth) > 0,
    slant: Math.min(1, Math.max(-1, across / 30)),
    wind: Math.min(1, Math.max(0, (gustMph - 20) / 25)),
    live: true,
  };
}

/* Force a state for eyeballing, next to ?sky= and ?moon=:
     ?wx=clear|partly|overcast|fog|rain|snow   what the sky is doing
     ?rate=0..1                                how hard the rain/snow falls
     ?snow=1|0                                 snow on the ridge or not
     ?temp=34                                  the caption's temperature, in F
     ?wind=0..1                                how gusty (0 calm, 1 ~45 mph gusts)
   Anything not forced stays real. */
const FORCED_WX: Record<string, Partial<Weather>> = {
  clear: { cloud: 5, falling: 'none', rate: 0, fog: false },
  partly: { cloud: 50, falling: 'none', rate: 0, fog: false },
  overcast: { cloud: 95, falling: 'none', rate: 0, fog: false },
  fog: { cloud: 95, falling: 'none', rate: 0, fog: true },
  rain: { cloud: 95, falling: 'rain', rate: 0.5, fog: false },
  snow: { cloud: 95, falling: 'snow', rate: 0.5, fog: false },
};
function withForced(w: Weather): Weather {
  const q = new URLSearchParams(window.location.search);
  const out = { ...w };
  const wx = FORCED_WX[q.get('wx') ?? ''];
  if (wx) Object.assign(out, wx, { live: true });
  const n = (k: string) => (q.get(k) !== null && q.get(k) !== '' && !Number.isNaN(Number(q.get(k))) ? Number(q.get(k)) : null);
  const rate = n('rate'), snow = n('snow'), temp = n('temp'), wind = n('wind');
  if (rate !== null && out.falling !== 'none') out.rate = Math.min(1, Math.max(0, rate));
  if (snow !== null) out.ground = snow > 0;
  if (temp !== null) { out.tempF = temp; out.live = true; }
  if (wind !== null) { out.wind = Math.min(1, Math.max(0, wind)); out.live = true; }
  return out;
}

/* Snow shows on the ridge when it's lying there or actively coming down. */
const snowy = (w: Weather) => w.ground || w.falling === 'snow';

/* The line under the band. Just the place until there's something real to say. */
function captionFor(w: Weather): string {
  if (!w.live) return HOME.label;
  // wind takes over from the cloud word, but rides along with rain or snow
  const windy = w.wind > 0;
  const cond =
    w.falling === 'snow' ? (windy ? 'snowing and windy' : 'snowing')
    : w.falling === 'rain' ? (windy ? 'raining and windy' : 'raining')
    : windy ? 'windy'
    : w.fog ? 'foggy'
    : w.cloud >= 85 ? 'overcast'
    : w.cloud >= 25 ? 'partly cloudy'
    : 'clear';
  return w.tempF === null ? `${HOME.label}, ${cond}` : cond.includes(' and ')
      ? `${HOME.label}, ${Math.round(w.tempF)}°, ${cond}`
      : `${HOME.label}, ${Math.round(w.tempF)}° and ${cond}`;
}

/* Local hour where HOME is, regardless of where the visitor is sitting.
   ?sky=16.75 forces a clock hour on today's date, so in November that's the
   real sunset. ?sky=dawn|sunrise|morning|noon|golden|sunset|dusk|night jumps
   to that point of today's sun, whatever the season. */
function homeHour(): number {
  const forced = new URLSearchParams(window.location.search).get('sky');
  if (forced !== null && forced !== '' && !Number.isNaN(Number(forced))) return Number(forced) % 24;
  if (forced) {
    const [, dawn, morning, noon, golden, sunset] = anchors(sunTimes());
    const named: Record<string, number> = {
      dawn, sunrise: dawn + 1, morning, noon, golden, sunset, dusk: sunset + 0.4, night: sunset + 3.5,
    };
    if (forced in named) return named[forced];
  }
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: HOME.tz,
    hour: 'numeric', minute: 'numeric', hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  return (get('hour') % 24) + get('minute') / 60;
}

/**
 * The ridge, drawn to a canvas so its four plates can be relit as the day
 * moves. It stays the asset's own 1800x150 and is scaled by CSS exactly like
 * the <img> it replaced, so nothing about the layout changes.
 *
 * The expensive part (deciding which plate every pixel belongs to) runs once on
 * load into a Uint8Array; after that a repaint is one pass of table lookups,
 * and it only fires when the interpolated palette actually moves.
 */
function Ridge({ snow, sky }: { snow: boolean; sky: Sky }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const snowRef = useRef(snow);
  const paintRef = useRef<(() => void) | null>(null);

  // snow arriving (or melting) repaints now instead of on the next 1s tick
  useEffect(() => { snowRef.current = snow; paintRef.current?.(); }, [snow]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let alive = true;
    let timer = 0;
    const img = new Image();
    img.src = '/assets/images/flatirons-riso.png';

    img.onload = () => {
      if (!alive) return;
      const w = img.naturalWidth, h = img.naturalHeight;
      canvas.width = w; canvas.height = h;
      ctx.drawImage(img, 0, 0);

      const id = ctx.getImageData(0, 0, w, h);
      const px = id.data;
      const n = w * h;

      // 255 = transparent, otherwise the index of the plate this pixel belongs
      // to. Nearest-colour rather than exact match so the few antialiased edge
      // pixels land on a plate instead of keeping their daylight colour.
      const plate = new Uint8Array(n);
      for (let i = 0; i < n; i++) {
        const o = i * 4;
        if (px[o + 3] === 0) { plate[i] = 255; continue; }
        let best = 0, bd = Infinity;
        for (let k = 0; k < 4; k++) {
          const s = RIDGE_SRC_PLATES[k];
          const d = (px[o] - s[0]) ** 2 + (px[o + 1] - s[1]) ** 2 + (px[o + 2] - s[2]) ** 2;
          if (d < bd) { bd = d; best = k; }
        }
        plate[i] = best;
      }

      let lastKey = '';
      const paint = () => {
        const pal = ridgePaletteAt(homeHour(), sky, snowRef.current);
        const key = pal.join('|');
        if (key === lastKey) return;
        lastKey = key;
        for (let i = 0; i < n; i++) {
          const p = plate[i];
          if (p === 255) continue;
          const c = pal[p], o = i * 4;
          px[o] = c[0]; px[o + 1] = c[1]; px[o + 2] = c[2];
        }
        ctx.putImageData(id, 0, 0);
      };

      paintRef.current = paint;
      paint();
      // The palette moves on the scale of minutes, so a 1s check is already far
      // finer than the eye can catch and costs a 12-int compare when nothing moved.
      timer = window.setInterval(paint, 1000);
    };

    return () => { alive = false; paintRef.current = null; window.clearInterval(timer); };
  }, [sky]);

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label="The Flatirons, Boulder"
      width={1800}
      height={150}
      /* Width-locked, bottom-anchored — but with a floor on the height. The
         asset is a 12:1 strip, so on a phone its natural height is ~33px and the
         ridge reads as a smudge. min-h stretches it vertically only (never
         crops), which is honest here: the strip was already squashed from the
         photo, so un-squashing it on narrow screens moves BACK toward the real
         proportion. Above ~770px the natural height wins and nothing stretches. */
      className="absolute inset-x-0 bottom-0 w-full h-auto min-h-[64px] select-none pointer-events-none"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}

export default function SkyBand({ className = '', onCaption }: { className?: string; onCaption?: (caption: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frontRef = useRef<HTMLCanvasElement | null>(null);
  const skyRef = useRef<Sky>(sunTimes());
  const [weather, setWeather] = useState<Weather>(() => withForced(FALLBACK));

  useEffect(() => {
    let alive = true;
    fetchWeather()
      .then((w) => { if (alive) setWeather(withForced(w)); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const caption = captionFor(weather);
  useEffect(() => { onCaption?.(caption); }, [caption, onCaption]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const SCALE = 2;                       // draw at half res, upscale hard
    let w = 0, h = 0, img: ImageData | null = null, noise: Float32Array | null = null;
    let starAt: Set<number> = new Set();
    let plateAt: Uint8Array | null = null, fall: Float32Array | null = null;
    // the nearest snowflakes fall in front of the ridge — stars never do, which
    // is the surest tell between the two. their own transparent layer over the
    // ridge, same resolution as the sky, only ever touched while it snows
    const front = frontRef.current;
    const fctx = front?.getContext('2d') ?? null;
    let frontImg: ImageData | null = null;

    // Sized off the band, never pinned in px: CSS (inset-0, w-full h-full) owns the
    // canvas's displayed size. Pinning it to the first measurement froze the sky at
    // whatever width the page had mid-load, so it covered part of the band forever.
    const band = canvas.parentElement ?? canvas;
    const resize = () => {
      const r = band.getBoundingClientRect();
      const nw = Math.max(1, Math.round(r.width / SCALE));
      const nh = Math.max(1, Math.round(r.height / SCALE));
      if (nw === w && nh === h && img) return;
      w = nw; h = nh;
      canvas.width = w; canvas.height = h;
      img = ctx.createImageData(w, h);
      // static grain field — regenerating it per frame makes the print sizzle
      noise = new Float32Array(w * h);
      const grain = mulberry(7);
      for (let i = 0; i < noise.length; i++) noise[i] = (grain() - 0.5) * 0.22;
      // stars as a flat index set so the pixel loop stays O(1) per pixel
      starAt = new Set();
      const n = Math.round(w * h * 0.004);
      // placed as fractions of the band, so a resize keeps each star where it was
      const starRng = mulberry(1214);
      for (let i = 0; i < n; i++) {
        const sx = Math.floor(starRng() * w);
        const sy = Math.floor(starRng() * h * 0.82);
        starAt.add(sy * w + sx);
      }
      // which plate each sky pixel landed on, so rain can step off it
      plateAt = new Uint8Array(w * h);
      if (front && fctx) {
        front.width = w; front.height = h;
        frontImg = fctx.createImageData(w, h);
      }
      // rain/snow: one pool per size, seeded at the densest it's ever allowed
      // to get. the live rate only decides how many of them get drawn, so a
      // downpour is capped here and can't turn the print into static.
      // per particle: x, y, speed, sway phase, all 0-1
      fall = new Float32Array(Math.round(w * h * 0.006) * 4);
      const fallRng = mulberry(42);
      for (let i = 0; i < fall.length; i++) fall[i] = fallRng();
    };

    const draw = (tMs: number) => {
      if (!img || !noise || !plateAt || !fall) return;
      // The horizon is the BOTTOM of the band, not the ridgeline — the ridge only
      // reaches the top edge at the peak, and the palette has to keep ramping in
      // the gaps beside it or the sky flattens into one slab of horizon colour.
      const horizon = h;
      const { sunrise, sunset } = skyRef.current;
      const { cloud, falling, rate, slant, wind } = weather;
      const hour = homeHour();
      const pal = paletteAt(hour, skyRef.current);
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
      // stars only once the sun is actually down, and not through weather
      const stars = !isDay && falling === 'none';
      // a night with something falling is cloud-lit, not black: lift the ramp
      // so flakes fall through murk instead of sitting on a clear starry sky
      // (weighted to the top, so the horizon doesn't wash up into the light plate)
      const murk = !isDay && falling !== 'none' ? 0.6 * (cloud / 100) : 0;

      // the real moon tonight: which side is lit and how much. cos(2πp) is the
      // terminator's projected half-width — +1 new, 0 quarter, −1 full. waxing
      // (p<.5) lights the right limb, waning the left, matching the northern sky.
      const mp = moonPhase();
      const term = Math.cos(2 * Math.PI * mp);
      const illum = (1 - term) / 2;
      // a soft glow that brightens toward the body and fades to nothing at
      // `reach`, so the dither breaks it up with no edge to find. a near-new
      // moon barely glows.
      const glow = isDay ? 0.9 : 0.9 * (0.25 + 0.75 * illum);
      const reach = rad * 3.2;

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
        base[y] = Math.min(4.2, v * 2.7 + murk * (1 - v));
        g1[y] = Math.exp(-((v - 0.26) ** 2) / 0.022);
        g2[y] = Math.exp(-((v - 0.48) ** 2) / 0.026);
        g3[y] = Math.exp(-((v - 0.70) ** 2) / 0.024);
      }

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          let f = base[y] + s1[x] * g1[y] + s2[x] * g2[y] + s3[x] * g3[y];

          const dx = x - cx, dy = y - cy;
          const d = Math.sqrt(dx * dx + dy * dy);
          let lift = 0;
          if (d < reach) { const q = 1 - d / reach; lift = glow * q * q; f += lift; }
          if (d < rad) {
            if (isDay) {
              f = 3.9;
            } else {
              // phase mask: lit where the pixel sits sunward of the terminator
              // ellipse. the dark limb drops the glow back out — a barely-there
              // disc against its own glow, like the real thing.
              const u = dx / rad, v = dy / rad;
              const rr = Math.sqrt(Math.max(0, 1 - v * v));
              const lit = mp < 0.5 ? u > term * rr : u < -term * rr;
              f = lit ? 3.9 : f - lift;
            }
          }

          const i = y * w + x;
          f += BAYER[(y & 3) * 4 + (x & 3)] * 0.38 + noise[i] * 0.5;

          let idx = Math.floor((f / 3.9) * 4);
          idx = idx < 0 ? 0 : idx > 3 ? 3 : idx;
          let [r, g, b] = pal[idx];

          plateAt[i] = idx;

          // flat star dots
          if (stars && idx <= 1 && starAt.has(i)) {
            r = pal[3][0]; g = pal[3][1]; b = pal[3][2];
          }

          const o = i * 4;
          data[o] = r; data[o + 1] = g; data[o + 2] = b; data[o + 3] = 255;
        }
      }

      const t = reduced ? 0 : tMs / 1000;
      const lean = slant < 0 ? -1 : 1, across = Math.abs(slant);

      // Gusts shove whatever's falling sideways: every few seconds a ~0.9s
      // burst of extra travel. It's the running total of those bursts, so it's
      // still a pure function of the clock. push = px travelled so far,
      // surge = 0-1, how hard this instant is being shoved.
      let push = 0, surge = 0;
      if (wind > 0 && t > 0) {
        const every = 5 - 2 * wind, amount = 5 + 14 * wind;
        const k = Math.floor(t / every), x = Math.min(1, (t - k * every) / 0.9);
        push = lean * amount * (k + x * x * (3 - 2 * x));
        surge = 4 * x * (1 - x);
      }

      // Rain and snow, into the same buffer so they're the same print. Every
      // particle's place is a pure function of the clock (no state to step), so
      // reduced motion is just the clock held at zero: a still, sparser field.
      if (falling !== 'none') {
        const count = Math.round((fall.length / 4) * rate * (reduced ? 0.5 : 1));
        // a flake pixel: the lightest plate, or a dim one on the third plate
        // (the second where the sky already is the third) — on the dark night
        // plates a one-step shift would vanish
        const plates = plateAt;
        const flake = (x: number, y: number, dim: boolean) => {
          if (y < 0 || y >= h) return;
          const i = y * w + (x % w), o = i * 4;
          const c = dim ? pal[plates[i] === 2 ? 3 : 2] : pal[3];
          data[o] = c[0]; data[o + 1] = c[1]; data[o + 2] = c[2];
        };
        const fd = falling === 'snow' && frontImg ? frontImg.data : null;
        if (fd) fd.fill(0);
        const near = (x: number, y: number, c: Palette[number]) => {
          if (!fd || y < 0 || y >= h) return;
          const o = (y * w + (x % w)) * 4;
          fd[o] = c[0]; fd[o + 1] = c[1]; fd[o + 2] = c[2]; fd[o + 3] = 255;
        };
        for (let k = 0; k < count; k++) {
          const p = k * 4;
          if (falling === 'snow') {
            // three depths, keyed off speed so nearer is faster: far flakes are a
            // dim single pixel, mid ones a bright 1x2 drop, near ones a bright
            // 2x2 under a dim row, out in front of the ridge. no star is dim,
            // taller than a pixel or over the mountains, which is what keeps a
            // still night frame from reading as a star field
            const depth = fall[p + 2];
            // falling has to dominate: a flake drifts at most ~1 px across per
            // 3 px down, and gusts reach it as a wave (delayed by its x) at a
            // fraction of the rain's shove, so the field never slides in unison.
            // each flake flutters at its own rate on top.
            const ph = fall[p + 3];
            const fallen = (10 + depth * 14) * t;
            const y = Math.floor((fall[p + 1] * h + fallen) % h);
            const lag = fall[p] * 1.2;
            const tl = Math.max(0, t - lag);
            let gust = 0;
            if (wind > 0 && tl > 0) {
              const every = 5 - 2 * wind, amount = 2 + 4 * wind;
              const k = Math.floor(tl / every), x = Math.min(1, (tl - k * every) / 1.4);
              gust = lean * amount * (k + x * x * (3 - 2 * x)) * (0.5 + 0.5 * depth);
            }
            const sx = fall[p] * w + lean * (0.04 + across * 0.25) * fallen + gust
              + Math.sin(t * (0.6 + ph * 0.9) + ph * 6.28) * (1 + depth * 1.5)
              + Math.sin(t * (1.7 + ph) + ph * 3.1) * 0.6;
            const x = ((Math.floor(sx) % w) + w) % w;
            if (depth < 0.4) {
              flake(x, y, true);
            } else if (depth < 0.75) {
              flake(x, y, false); flake(x, y + 1, false);
            } else {
              near(x, y - 1, pal[2]); near(x + 1, y - 1, pal[2]);
              near(x, y, pal[3]); near(x + 1, y, pal[3]); near(x, y + 1, pal[3]); near(x + 1, y + 1, pal[3]);
            }
          } else {
            // short streaks: each pixel steps one plate lighter than the sky
            // behind it (one darker where the sky is already the lightest), so
            // rain shows as a hard-edged shift in the same four inks. a gust
            // tips them further over while it lasts
            const len = 4 + Math.round(fall[p + 3]);
            const fallen = (70 + fall[p + 2] * 40) * t;
            const dxdy = lean * (0.5 + across * 0.3 + surge * 0.5);
            const hy = (fall[p + 1] * (h + len) + fallen) % (h + len);
            const hx = fall[p] * w + lean * (0.5 + across * 0.3) * fallen + push;
            for (let s = 0; s < len; s++) {
              const y = Math.floor(hy) - s;
              if (y < 0 || y >= h) continue;
              const x = ((Math.floor(hx - dxdy * s) % w) + w) % w;
              const i = y * w + x, c = pal[plateAt[i] < 3 ? plateAt[i] + 1 : 2], o = i * 4;
              data[o] = c[0]; data[o + 1] = c[1]; data[o + 2] = c[2];
            }
          }
        }
      }

      // Gust trails: now and then a short streak sweeps across with the wind and
      // curls into a little eddy before it goes. A few slots, each on its own
      // cycle; most cycles stay empty, so it's occasional rather than a texture.
      // Stronger wind = more of them, longer and quicker. Same lighter-plate
      // shift as the rain. Not drawn at all under reduced motion.
      if (wind > 0 && !reduced) {
        const slots = Math.max(2, Math.round(w / 180));
        const every = 7 - 3 * wind, life = 2.0;
        const tail = 9 + 12 * wind;                         // trail length, px
        for (let sl = 0; sl < slots; sl++) {
          const tt = t + hash(sl, 0.5) * every;
          const cyc = Math.floor(tt / every);
          const age = (tt - cyc * every) / life;            // 0-1 while alive
          if (age > 1 || hash(sl, cyc) > 0.3 + 0.55 * wind) continue;
          const dir = across > 0.1 ? lean : hash(sl, cyc + 0.3) < 0.5 ? -1 : 1;
          const y0 = h * (0.12 + 0.5 * hash(sl, cyc + 0.6));
          const x0 = w * hash(sl, cyc + 0.9);
          const run = 16 + 30 * wind + 10 * hash(sl, cyc + 0.15);   // straight sweep
          const r0 = 3 + 2 * wind;                                   // eddy radius
          const turn = 2 * Math.PI * 1.15, curl = turn * r0 * 0.8;
          const total = run + curl;
          // the head runs the path, easing off as it winds into the eddy, then
          // the tail catches up and it's gone
          const run01 = Math.min(1, age / 0.75);
          const head = (1 - (1 - run01) * (1 - run01)) * total;
          const from = age < 0.75 ? head - tail : total - tail * (1 - (age - 0.75) / 0.25);
          for (let a = Math.max(0, from); a <= head; a += 0.5) {
            let px: number, py: number;
            if (a < run) {
              px = x0 + dir * a;
              py = y0 - a * 0.06 + Math.sin(a * 0.3) * 0.8;
            } else {
              // tangent to the sweep, curling up and over, tightening as it goes
              const phi = (a - run) / (r0 * 0.8);
              const r = r0 * (1 - 0.4 * phi / turn);
              px = x0 + dir * (run + r * Math.sin(phi));
              py = y0 - run * 0.06 + Math.sin(run * 0.3) * 0.8 - r + r * Math.cos(phi);
            }
            const x = Math.floor(px), y = Math.floor(py);
            // dither out the back of the trail so it tapers instead of ending flat
            const k = (a - from) / tail;
            if (k * 1.8 < BAYER[(y & 3) * 4 + (x & 3)] + 0.5) continue;
            // two px thick where it's fresh, one at the tapering back
            for (let dy = 0; dy < (k > 0.45 ? 2 : 1); dy++) {
              const yy = y + dy;
              if (x < 0 || x >= w || yy < 0 || yy >= h) continue;
              if ((x - cx) ** 2 + (yy - cy) ** 2 < rad * rad) continue;   // passes behind the sun/moon
              const i = yy * w + x, c = pal[plateAt[i] < 3 ? plateAt[i] + 1 : 2], o = i * 4;
              data[o] = c[0]; data[o + 1] = c[1]; data[o + 2] = c[2];
            }
          }
        }
      }

      ctx.putImageData(img, 0, 0);
      if (falling === 'snow' && fctx && frontImg) fctx.putImageData(frontImg, 0, 0);
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
    ro.observe(band);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [weather]);

  return (
    <>
      <div className={`relative w-full overflow-hidden ${className}`}>
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full"
          style={{ imageRendering: 'pixelated' }}
        />
        {/* Full-width, bottom-anchored, natural height. The asset is a thin ridge
            strip (1800x150) so its rendered height stays under the band at every
            viewport width — no cropping, so the low left-hand ridge never vanishes. */}
        <Ridge snow={snowy(weather)} sky={skyRef.current} />
        <canvas
          ref={frontRef}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
    </>
  );
}
