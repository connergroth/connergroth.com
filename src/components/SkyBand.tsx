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

/* Snow on the ridge: the same plate swap, all four plates. Off real photos of
   the Flatirons under snow: nothing stays warm. The slabs go white, the rock
   between them a pale blue, the frosted pines slate blue instead of green,
   and the shadows deep navy, so the whole ridge reads blue and white against
   the sky. One palette per RIDGE_KEYS entry, so the snow is lit by the same
   clock as everything else: moonlit blue-grey at night, never white. */
const RIDGE_SNOW: Palette[] = [
  [[10, 12, 24], [22, 30, 52], [62, 74, 108], [148, 162, 198]],     // night
  [[24, 26, 44], [54, 64, 94], [138, 144, 176], [226, 216, 224]],   // dawn
  [[28, 36, 60], [66, 86, 120], [160, 180, 212], [240, 242, 246]],  // morning
  [[28, 38, 62], [68, 90, 124], [158, 180, 212], [236, 241, 248]],  // midday — a shade under the page's paper, so the band keeps its bottom edge
  [[28, 32, 56], [66, 78, 110], [170, 170, 196], [255, 242, 218]],  // golden
  [[20, 18, 40], [44, 48, 82], [114, 104, 144], [228, 180, 166]],   // dusk — alpenglow on the snow
  [[10, 12, 24], [22, 30, 52], [62, 74, 108], [148, 162, 198]],     // night
  [[10, 12, 24], [22, 30, 52], [62, 74, 108], [148, 162, 198]],
];
const RIDGE_SNOW_KEYS = RIDGE_KEYS.map((k, i) => ({ h: k.h, p: RIDGE_SNOW[i] }));

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

/* The same clock under a closed sky: no blue, the three sky plates go to
   cloud-white and grey, and the light plate cools from cream to an off-white
   a shade under the page's paper (at night it stays put, so the moon and
   stars keep their ink). CLOSED_WET is the same
   sky with something falling out of it, a heavier grey. */
const CLOSED_KEYS: { h: number; p: Palette }[] = [
  { h: 0.0, p: [[20, 22, 34], [34, 38, 56], [58, 64, 86], [242, 232, 213]] },
  { h: 5.2, p: [[92, 92, 108], [134, 130, 142], [182, 172, 172], [218, 200, 192]] },
  { h: 7.4, p: [[156, 163, 176], [190, 195, 204], [210, 214, 220], [236, 235, 232]] },
  { h: 12.0, p: [[170, 178, 191], [200, 206, 215], [208, 213, 220], [236, 237, 237]] },
  { h: 18.2, p: [[152, 156, 170], [186, 186, 196], [206, 200, 200], [236, 228, 218]] },
  { h: 20.0, p: [[72, 66, 90], [116, 100, 114], [150, 126, 126], [198, 170, 160]] },
  { h: 21.6, p: [[20, 22, 34], [34, 38, 56], [58, 64, 86], [242, 232, 213]] },
  { h: 24.0, p: [[20, 22, 34], [34, 38, 56], [58, 64, 86], [242, 232, 213]] },
];
const WET = [0.62, 0.72, 0.8, 1];
const CLOSED_WET_KEYS = CLOSED_KEYS.map((k) => ({
  h: k.h,
  p: k.p.map((c, i) => c.map((v) => Math.round(v * WET[i]))) as Palette,
}));

/* closed: 0 open sky … 1 fully closed; wet: 0 dry … 1 raining or snowing */
function paletteAt(hour: number, sky: Sky, closed = 0, wet = 0): Palette {
  const kh = keyHour(hour, sky);
  const open = lerpKeys(KEYS, kh);
  if (closed <= 0) return open;
  const dry = lerpKeys(CLOSED_KEYS, kh), rainy = lerpKeys(CLOSED_WET_KEYS, kh);
  return open.map((c, i) => c.map((v, k) => {
    const to = dry[i][k] + (rainy[i][k] - dry[i][k]) * wet;
    return Math.round(v + (to - v) * closed);
  })) as Palette;
}
const ridgePaletteAt = (hour: number, sky: Sky, snow: boolean) =>
  lerpKeys(snow ? RIDGE_SNOW_KEYS : RIDGE_KEYS, keyHour(hour, sky));

/* The year's real meteor showers: the morning their peak falls on, how strong
   (1 = the big two) and where along the band their radiant sits. A night
   counts toward the morning it ends on, and a shower tails off over a couple
   of nights either side of its peak. ?shower=geminids forces one at its peak. */
const SHOWERS: { name: string; m: number; d: number; rate: number; radiant: number }[] = [
  { name: 'quadrantids', m: 1, d: 4, rate: 0.8, radiant: 0.7 },
  { name: 'lyrids', m: 4, d: 22, rate: 0.45, radiant: 0.3 },
  { name: 'eta-aquariids', m: 5, d: 6, rate: 0.5, radiant: 0.15 },
  { name: 'perseids', m: 8, d: 13, rate: 1, radiant: 0.75 },
  { name: 'orionids', m: 10, d: 21, rate: 0.45, radiant: 0.25 },
  { name: 'leonids', m: 11, d: 17, rate: 0.4, radiant: 0.2 },
  { name: 'geminids', m: 12, d: 14, rate: 1, radiant: 0.6 },
  { name: 'ursids', m: 12, d: 22, rate: 0.35, radiant: 0.85 },
];
function showerTonight(hour: number): { name: string; strength: number; radiant: number } | null {
  const forced = new URLSearchParams(window.location.search).get('shower');
  if (forced) {
    const f = SHOWERS.find((x) => x.name === forced);
    return f ? { name: f.name, strength: f.rate, radiant: f.radiant } : null;
  }
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: HOME.tz, year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(new Date());
  const get = (t: string) => Number(parts.find((x) => x.type === t)?.value ?? 0);
  // the morning this night ends on
  const night = Date.UTC(get('year'), get('month') - 1, get('day') + (hour >= 12 ? 1 : 0));
  let best: { name: string; strength: number; radiant: number } | null = null;
  for (const sh of SHOWERS) {
    for (const yr of [get('year') - 1, get('year'), get('year') + 1]) {
      const off = Math.abs(night - Date.UTC(yr, sh.m - 1, sh.d)) / 86400000;
      const strength = sh.rate * Math.max(0, 1 - off / 2.5);
      if (strength > 0 && (!best || strength > best.strength)) best = { name: sh.name, strength, radiant: sh.radiant };
    }
  }
  return best;
}

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

/* The one colour family outside the sky's own plates: the cool light blue of
   a star glint and a meteor's burn. Core, body, fading tip. */
const ICE_CORE: [number, number, number] = [236, 246, 255];
const ICE: [number, number, number] = [158, 206, 255];
const ICE_DEEP: [number, number, number] = [96, 146, 226];
const CROSS = [[1, 0], [-1, 0], [0, 1], [0, -1]] as const;

/* Bird sprites, 'x' = ink. The hawk soars on long flat wings with upturned
   tips; the flock birds are the classic flapping silhouette in three poses
   (up, arched glide, down), plus 3-wide versions for when they're far off. */
const HAWK = [
  'xx.........xx',
  '..xxx...xxx..',
  '....xxxxx....',
  '.....xxx.....',
  '......x......',
] as const;
const HAWK_FLAP = [
  '.............',
  '.............',
  '....xxxxx....',
  '..xx.xxx.xx..',
  'xx....x....xx',
] as const;
const BIRD = [
  ['x...x', '.x.x.', '..x..'],
  ['.x.x.', 'x.x.x', '.....'],
  ['.....', '.x.x.', 'x.x.x'],
] as const;
const BIRD_FAR = [
  ['x.x', '.x.'],
  ['xxx', '...'],
  ['...', 'x.x'],
] as const;

/* 4x4 Bayer, centred on zero — same matrix the build-time script uses on the
   mountains, which is what makes the two layers read as one print. */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => v / 16 - 0.5);

interface Sky { sunrise: number; sunset: number }

/* What it's doing outside at HOME right now. */
interface Weather {
  cloud: number;                      // 0-100, total cover, thin high cloud included
  opaque: number;                     // 0-100, the cover that actually hides the blue
  tempF: number | null;
  falling: 'none' | 'rain' | 'snow';
  rate: number;                       // 0-1, how hard it's coming down
  fog: boolean;
  ground: boolean;                    // snow lying on the ground
  slant: number;                      // -1..1, wind across the view, + blows left to right
  wind: number;                       // 0-1 gustiness: 0 under ~20 mph gusts, 1 at ~45+
  live: boolean;                      // real (or forced) data, not the pre-fetch default
  thunder: boolean;                   // lightning in the area
  windKnown: boolean;                 // slant is off the network, so a cirrus can ride it without jumping when it lands
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
  cloud: 25, opaque: 15, tempF: null, falling: 'none', rate: 0, fog: false, ground: false, slant: 0.3, wind: 0, live: false, windKnown: false, thunder: false,
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
    `&current=cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,temperature_2m,precipitation,rain,snowfall,weather_code,snow_depth,` +
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

  // Total cover counts a veil of cirrus as 100% while the sky is still blue
  // and the sun still casts shadows. What whites the sky out is low and mid
  // cloud, so weigh the layers: low and mid in full, high at well under half.
  // If the layers are missing, fall back on the total with the WMO code
  // (3 = overcast) as the tiebreak.
  const total = typeof c.cloud_cover === 'number' ? c.cloud_cover : FALLBACK.cloud;
  const layered = typeof c.cloud_cover_low === 'number' && typeof c.cloud_cover_mid === 'number';
  const opaque = layered
    ? 100 * (1 - (1 - num(c.cloud_cover_low) / 100) * (1 - num(c.cloud_cover_mid) / 100) * (1 - 0.4 * num(c.cloud_cover_high) / 100))
    : code === 3 ? Math.max(total, 90) : total * 0.8;

  return {
    cloud: total,
    opaque: WMO_FOG.includes(code) ? 100 : opaque,
    tempF: typeof c.temperature_2m === 'number' ? c.temperature_2m : null,
    falling: snowing ? 'snow' : raining ? 'rain' : 'none',
    rate: snowing || raining ? Math.min(1, Math.max(0.15, measured, WMO_RATE[code] ?? 0)) : 0,
    fog: WMO_FOG.includes(code),
    ground: num(c.snow_depth) > 0,
    slant: Math.min(1, Math.max(-1, across / 30)),
    wind: Math.min(1, Math.max(0, (gustMph - 20) / 25)),
    live: true,
    windKnown: true,
    thunder: [95, 96, 99].includes(code),
  };
}

/* Force a state for eyeballing, next to ?sky= and ?moon=:
     ?wx=clear|partly|overcast|fog|rain|snow|storm   what the sky is doing
     ?rate=0..1                                how hard the rain/snow falls
     ?snow=1|0                                 snow on the ridge or not
     ?temp=34                                  the caption's temperature, in F
     ?wind=0..1                                how gusty (0 calm, 1 ~45 mph gusts)
   Anything not forced stays real. */
const FORCED_WX: Record<string, Partial<Weather>> = {
  clear: { thunder: false, cloud: 5, opaque: 5, falling: 'none', rate: 0, fog: false },
  partly: { thunder: false, cloud: 50, opaque: 35, falling: 'none', rate: 0, fog: false },
  overcast: { thunder: false, cloud: 95, opaque: 95, falling: 'none', rate: 0, fog: false },
  fog: { thunder: false, cloud: 95, opaque: 100, falling: 'none', rate: 0, fog: true },
  rain: { thunder: false, cloud: 95, opaque: 95, falling: 'rain', rate: 0.5, fog: false },
  snow: { thunder: false, cloud: 95, opaque: 95, falling: 'snow', rate: 0.5, fog: false },
  storm: { thunder: true, cloud: 100, opaque: 100, falling: 'rain', rate: 0.9, fog: false },
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
/* The mountain's weather, off the same figures the sky closes on. Rain and
   snow wait for the real wind like they do in the sky, so the rock doesn't go
   wet before anything is falling. */
function ridgeLookFor(w: Weather): Look {
  const falling = w.windKnown && w.falling !== 'none';
  const cu = falling || w.fog ? 1 : Math.min(1, Math.max(0, (w.opaque - 55) / 35));
  return [snowy(w) ? 1 : 0, cu * cu * (3 - 2 * cu), falling ? (w.thunder ? 1.4 : 1) : 0, w.fog ? 1 : 0];
}

/* The ambient layer, so a calm clear sky still has something alive in it. Per
   time of day, one thing you'd notice moving plus at most one quiet one:
     day    cumulus drifting on the real wind (always on, see the cloud pass)
     dusk   a small flock heading in toward the ridge; stars come out one by one
     night  a shooting star every 20-40s, over a few stars twinkling
   Rain or snow is the motion when it's falling, so the layer stands down.
   Everything is a pure function of the wall clock and seeded hashes, so a
   re-run (weather landing, resize) picks up mid-flight instead of jumping.
     ?amb=hawk|flock|meteor   force that one in, whatever the hour or weather
     ?amb=wisp|twinkle        just the quiet one, on its own
     ?amb=off                 none of it
   Reduced motion gets none of it: still stars, no birds, no meteors. */
type Loud = 'hawk' | 'flock' | 'meteor' | '';
type Quiet = 'wisp' | 'twinkle' | '';
const AMB_EPOCH = Date.UTC(2026, 0, 1);   // keeps the clock's seconds small enough to hash cleanly
function ambientFor(hour: number, { sunset }: Sky, isDay: boolean, calm: boolean, forced: string): { loud: Loud; quiet: Quiet } {
  // dusk runs from half an hour before sunset to a bit over an hour after
  const sinceSet = (((hour - sunset) % 24) + 24) % 24;
  const tod = sinceSet >= 23.5 || sinceSet < 1.2 ? 'dusk' : isDay ? 'day' : 'night';
  // day belongs to the clouds; the hawk and the wisp only come out when forced
  let loud: Loud = !calm ? '' : tod === 'day' ? '' : tod === 'dusk' ? 'flock' : 'meteor';
  let quiet: Quiet = !calm ? '' : tod === 'night' ? 'twinkle' : '';
  if (forced === 'hawk' || forced === 'flock' || forced === 'meteor') loud = forced;
  else if (forced === 'wisp' || forced === 'twinkle') { loud = ''; quiet = forced; }
  else if (forced === 'off') { loud = ''; quiet = ''; }
  return { loud, quiet };
}

/* The line under the band. Just the place until there's something real to say. */
function captionFor(w: Weather): string {
  if (!w.live) return HOME.label;
  // wind takes over from the cloud word, but rides along with rain or snow
  const windy = w.wind > 0;
  const cond =
    w.falling === 'snow' ? (windy ? 'snowing and windy' : 'snowing')
    : w.falling === 'rain' && w.thunder ? 'storming'
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
      dawn, sunrise: dawn + 1, alpenglow: dawn + 1.12, morning, noon, golden, sunset, dusk: sunset + 0.4, night: sunset + 3.5,
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
/* The ridge's skyline, per source column: how far down its strip (0-1) the rock
   starts. The sky reads it so weather can fall in front of the mountain, mist
   can drape over its shape, and lightning can land on it. */
let ridgeLine: Float32Array | null = null;

/* How the weather lights the mountain, on top of the clock. Each 0-1:
     snow    snow lying on it (the plate swap above)
     closed  no direct sun: colour drains, the sunlit faces go dull and the
             shadows fill in, so the whole ridge flattens
     wet     rain or snow falling: wet rock and trees go darker
     fog     the ridge sinks toward the colour of the air in front of it
   Same four plates, only relit, so the dither edges stay hard. */
type Look = [snow: number, closed: number, wet: number, fog: number];
function ridgeLook(hour: number, sky: Sky, [snow, closed, wet, fog]: Look): Palette {
  const bare = ridgePaletteAt(hour, sky, false);
  let pal = snow <= 0 ? bare : ridgePaletteAt(hour, sky, true).map((c, i) =>
    c.map((v, k) => v + (bare[i][k] - v) * (1 - snow))) as Palette;
  if (closed > 0 || wet > 0 || fog > 0) {
    const mean = [0, 1, 2].map((k) => (pal[0][k] + pal[1][k] + pal[2][k] + pal[3][k]) / 4);
    const air = paletteAt(hour, sky, 1, Math.min(1, wet))[2];
    // the lit faces lose the most without sun; the shadow plate barely moves
    const dull = [0.96, 0.9, 0.86, 0.8], soak = [0.9, 0.8, 0.8, 0.84], haze = [0.22, 0.3, 0.36, 0.4];
    pal = pal.map((c, i) => {
      const lum = 0.3 * c[0] + 0.59 * c[1] + 0.11 * c[2];
      return c.map((v, k) => {
        let o = v + (lum - v) * 0.4 * closed;                 // drained
        o += (mean[k] - o) * 0.14 * closed;                   // flattened
        o *= 1 - (1 - dull[i]) * closed;                      // no sun on it
        o *= k === 0 ? 1 - 0.03 * closed : k === 2 ? 1 + 0.04 * closed : 1;   // skylight is cool
        o *= 1 - (1 - soak[i]) * wet;                         // wet
        return o + (air[k] - o) * haze[i] * fog;              // fogged
      });
    }) as Palette;
  }
  return pal.map((c) => c.map((v) => Math.max(0, Math.min(255, Math.round(v))))) as Palette;
}

/* First light. The Flatirons face east, so at sunrise the slabs catch the sun
   before anything around them does: the summit goes pink-orange first and the
   lit line comes down the ridge over about a quarter of an hour, while the
   ground below is still in the cold of dawn. For the half hour before that
   the whole ridge carries a faint rose from the sky. The colour cools into
   the ordinary morning light over the next hour. Needs sun, so a closed sky
   gets none of it. Returns the lit plates and how far down the light has come
   (0 summit … 1 the foot), or null outside the window.
   ?sky=alpenglow jumps to it. */
const GLOW: Palette = [[60, 30, 46], [112, 72, 54], [234, 114, 78], [255, 178, 128]];
const GLOW_SNOW: Palette = [[48, 36, 72], [104, 88, 124], [238, 150, 150], [255, 200, 180]];
const ROSE: Palette = [[40, 28, 50], [78, 66, 86], [170, 114, 114], [228, 180, 178]];
const ROSE_SNOW: Palette = [[34, 30, 58], [72, 70, 104], [160, 132, 164], [232, 196, 204]];
const ease = (t: number) => { const c = Math.min(1, Math.max(0, t)); return c * c * (3 - 2 * c); };
const mixPal = (a: Palette, b: Palette, t: number) =>
  a.map((c, i) => c.map((v, k) => Math.round(v + (b[i][k] - v) * t))) as Palette;
function firstLight(hour: number, sky: Sky, look: Look, base: Palette): { unlit: Palette; lit: Palette; down: number } | null {
  const d = hour - sky.sunrise, open = 1 - look[1];
  if (d < -0.5 || d > 1 || open < 0.03) return null;
  const snow = look[0];
  const rose = mixPal(ROSE, ROSE_SNOW, snow), glow = mixPal(GLOW, GLOW_SNOW, snow);
  const pre = (d < 0 ? ease((d + 0.5) / 0.5) : 1 - ease(d / 0.35)) * 0.45 * open;
  const hot = d < 0 ? 0 : (1 - ease(d / 0.95)) * 0.9 * open;
  return { unlit: mixPal(base, rose, pre), lit: mixPal(base, glow, hot), down: d < 0 ? -1 : d / 0.27 };
}

function Ridge({ look, sky }: { look: Look; sky: Sky }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  // What's on the mountain now. Right from the first frame if it's already
  // known; when the weather lands (or changes) it crosses over about a second
  // instead of swapping in one frame.
  const lookRef = useRef<Look>(look);
  const paintRef = useRef<(() => void) | null>(null);
  const [l0, l1, l2, l3] = look;

  useEffect(() => {
    const to: Look = [l0, l1, l2, l3], from = lookRef.current;
    if (from.every((v, i) => v === to[i])) return;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t0 = performance.now();
    let raf = 0;
    const step = () => {
      const k = still ? 1 : Math.min(1, (performance.now() - t0) / 1200);
      lookRef.current = from.map((v, i) => v + (to[i] - v) * k) as Look;
      paintRef.current?.();
      if (k < 1) raf = requestAnimationFrame(step);
    };
    step();
    return () => cancelAnimationFrame(raf);
  }, [l0, l1, l2, l3]);

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
      if (!ridgeLine) {
        const line = new Float32Array(w);
        for (let x = 0; x < w; x++) {
          let y = 0;
          while (y < h && plate[y * w + x] === 255) y++;
          line[x] = y / h;
        }
        ridgeLine = line;
        window.dispatchEvent(new Event('ridge-line'));
      }

      // the summit: the highest the ridge reaches, as a fraction of the image
      let top = 1;
      for (let x = 0; x < w; x++) { let y = 0; while (y < h && plate[y * w + x] === 255) y++; if (y / h < top) top = y / h; }

      let lastKey = '';
      const paint = () => {
        const hr = homeHour();
        const base = ridgeLook(hr, sky, lookRef.current);
        const fl = firstLight(hr, sky, lookRef.current, base);
        const pal = fl ? fl.unlit : base, lit = fl ? fl.lit : base;
        // the row the light has come down to, summit first; dithered so the
        // edge of the light is a few rows of the same print, not a ruled line
        const edge = fl && fl.down >= 0 ? (top + fl.down * (1 - top) * 1.05) * h : -1e6;
        const key = pal.join('|') + (fl ? '/' + lit.join('|') + '/' + Math.round(edge) : '');
        if (key === lastKey) return;
        lastKey = key;
        for (let i = 0; i < n; i++) {
          const p = plate[i];
          if (p === 255) continue;
          const y = (i / w) | 0, x = i - y * w;
          const c = (y + BAYER[(y & 3) * 4 + (x & 3)] * 10 < edge ? lit : pal)[p], o = i * 4;
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
  // what the sky is showing right now of the things that would otherwise snap
  // when the weather lands; each frame walks them toward the real figures
  const easeRef = useRef<{ closed: number; wet: number; murk: number; cloud: number; t: number } | null>(null);

  useEffect(() => {
    let alive = true;
    fetchWeather()
      .then((w) => { if (alive) setWeather(withForced(w)); })
      // no weather: the fallback sky is the sky, so let its clouds drift
      .catch(() => { if (alive) setWeather((w) => ({ ...w, windKnown: true })); });
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
    // pixel index → that star's own seeded 0-1 (its turn at dusk, its twinkle schedule)
    let starAt: Map<number, number> = new Map();
    // the stars high enough to be clear of the ridge: the only ones that sparkle
    let glints: number[] = [];
    const forcedAmb = new URLSearchParams(window.location.search).get('amb') ?? '';
    // this run is the one the weather just landed on; the wisp fades in from here
    const ranAt = performance.now();
    let plateAt: Uint8Array | null = null, fall: Float32Array | null = null;
    // the nearest snowflakes fall in front of the ridge — stars never do, which
    // is the surest tell between the two. their own transparent layer over the
    // ridge, same resolution as the sky, only ever touched while it snows
    const front = frontRef.current;
    const fctx = front?.getContext('2d') ?? null;
    let frontImg: ImageData | null = null;
    // where the ridge's skyline sits in this canvas, per column (h = no rock),
    // and the same line smoothed, for mist to follow
    let skyl = new Float32Array(0), skys = new Float32Array(0);
    const measure = () => {
      skyl = new Float32Array(w).fill(h); skys = new Float32Array(w).fill(h);
      const el = canvas.parentElement?.querySelector('canvas[role="img"]');
      if (!el || !ridgeLine) return;
      const br = (canvas.parentElement ?? canvas).getBoundingClientRect(), rr = el.getBoundingClientRect();
      const top = (rr.top - br.top) / SCALE, rh = rr.height / SCALE, n = ridgeLine.length;
      for (let x = 0; x < w; x++) skyl[x] = top + ridgeLine[Math.min(n - 1, Math.floor(((x + 0.5) / w) * n))] * rh;
      const k = Math.max(2, Math.round(h * 0.14));
      for (let x = 0; x < w; x++) {
        let sum = 0, c = 0;
        for (let j = Math.max(0, x - k); j <= Math.min(w - 1, x + k); j++) { sum += skyl[j]; c++; }
        skys[x] = sum / c;
      }
    };

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
      starAt = new Map();
      glints = [];
      const n = Math.round(w * h * 0.004);
      // placed as fractions of the band, so a resize keeps each star where it was
      const starRng = mulberry(1214);
      // a stream of its own, so the positions above come out exactly as before
      const starOrd = mulberry(1215);
      for (let i = 0; i < n; i++) {
        const sx = Math.floor(starRng() * w);
        const sy = Math.floor(starRng() * h * 0.82);
        starAt.set(sy * w + sx, starOrd());
        if (sy < h * 0.5) glints.push(sy * w + sx);
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
      const { rate, slant } = weather;
      // Nothing that moves with the wind is drawn until the real wind is in:
      // rain, snow and gusts started on a guessed direction would swing round
      // a beat after the page loads. They dither in once it lands instead.
      const falling = weather.windKnown ? weather.falling : 'none';
      const wind = weather.windKnown ? weather.wind : 0;
      const hour = homeHour();
      // how closed the sky is: blue up to broken cloud, paling through
      // mostly-cloudy, white-grey once it's overcast. Anything falling or fog
      // closes it outright.
      const shut = falling !== 'none' || weather.fog;
      const cu = shut ? 1 : Math.min(1, Math.max(0, (weather.opaque - 55) / 35));
      const sunFrac = (hour - skyRef.current.sunrise) / Math.max(0.5, skyRef.current.sunset - skyRef.current.sunrise);
      const want = {
        closed: cu * cu * (3 - 2 * cu),
        wet: falling !== 'none' ? 1 : 0,
        // a night with something falling is cloud-lit, not black (used below)
        murk: (sunFrac < 0 || sunFrac > 1) && falling !== 'none' ? 0.6 * (weather.cloud / 100) : 0,
        cloud: weather.cloud,
      };
      // the sky's colour and banding walk to the real figures over most of a
      // second instead of jumping the frame the weather lands
      const nowMs = performance.now();
      let ez = easeRef.current;
      if (!ez || reduced) ez = easeRef.current = { ...want, t: nowMs };
      else {
        const step = Math.min(1, (nowMs - ez.t) / 900);
        const walk = (v: number, to: number, full: number) => v + Math.max(-step * full, Math.min(step * full, to - v));
        ez = easeRef.current = {
          closed: walk(ez.closed, want.closed, 1), wet: walk(ez.wet, want.wet, 1),
          murk: walk(ez.murk, want.murk, 0.6), cloud: walk(ez.cloud, want.cloud, 100), t: nowMs,
        };
      }
      const closed = ez.closed, cloud = ez.cloud;
      const pal = paletteAt(hour, skyRef.current, closed, ez.wet);
      const data = img.data;
      // the layer in front of the ridge, wiped every frame
      const fd = frontImg ? frontImg.data : null;
      if (fd) fd.fill(0);
      const front = (x: number, y: number, c: Palette[number]) => {
        if (!fd || x < 0 || x >= w || y < 0 || y >= h) return;
        const o = (y * w + x) * 4;
        fd[o] = c[0]; fd[o + 1] = c[1]; fd[o + 2] = c[2]; fd[o + 3] = 255;
      };

      // sun/moon: 0→1 across the band between sunrise and sunset, arc for height
      const dayFrac = (hour - sunrise) / Math.max(0.5, sunset - sunrise);
      const isDay = dayFrac >= 0 && dayFrac <= 1;
      // at night, run the moon across on the same arc using the night's span
      // the real moon tonight: which side is lit and how much. cos(2πp) is the
      // terminator's projected half-width — +1 new, 0 quarter, −1 full. waxing
      // (p<.5) lights the right limb, waning the left, matching the northern sky.
      const mp = moonPhase();
      const term = Math.cos(2 * Math.PI * mp);
      const illum = (1 - term) / 2;
      // ...and when it's actually up, which the phase decides: a new moon rises
      // and sets with the sun, a first quarter is up from midday to midnight, a
      // full moon rises at sunset and sets at sunrise. So some nights have no
      // moon at all, a waxing moon hangs pale in the afternoon sky, and the
      // full moon comes up over the ridge as the sun goes down. Good to within
      // an hour or so, which is a few pixels here.
      const dayLen = sunset - sunrise, full = 1 - Math.abs(2 * mp - 1);
      const moonrise = mp < 0.5 ? sunrise + dayLen * (mp / 0.5) : sunset + (24 - dayLen) * ((mp - 0.5) / 0.5);
      const moonUpFor = dayLen + (24 - 2 * dayLen) * full;
      const moonFrac = ((((hour - moonrise) % 24) + 24) % 24) / Math.max(0.5, moonUpFor);
      const moonUp = moonFrac <= 1 && illum > 0.03;
      const arcY = (f: number) => horizon * (1.0 - 0.82 * Math.sin(Math.PI * Math.min(1, Math.max(0, f))));
      // a full moon near the skyline reads bigger, the way it does
      const moonRad = Math.max(3, horizon * 0.10) * (1 + 0.3 * illum ** 4 * (1 - Math.sin(Math.PI * Math.min(1, moonFrac))));
      const frac = isDay ? dayFrac : moonFrac;
      // no moon up tonight: park the body off the canvas so nothing dodges it
      const cx = isDay || moonUp ? frac * w : -1e6;
      const rad = isDay ? Math.max(3, horizon * 0.17) : moonRad;
      // the day moon: up while the sun is, a pale disc a plate off the sky
      const dayMoon = isDay && moonUp && illum > 0.12;
      const dmx = moonFrac * w, dmy = Math.max(moonRad * 1.15, arcY(moonFrac)), dmr2 = moonRad * moonRad;
      // keep the whole disc inside the band — on a short band the noon arc would
      // otherwise put the centre less than a radius from the top edge and clip it
      const cy = Math.max(rad * 1.15, arcY(frac));

      const phase = reduced ? 0 : (tMs / 1000) * 0.055;
      const amp = 0.22 + (cloud / 100) * 0.85;   // overcast = more, heavier bands
      // stars only once the sun is actually down, and not through weather
      const stars = !isDay && closed < 1;
      // ...and at dusk they come out one at a time: each star's seeded order
      // against how far past sunset it is, all of them out by 1.5h after
      const sinceSet = (((hour - sunset) % 24) + 24) % 24;
      // ...and go the same way before dawn, the last ones just ahead of the sun
      const toRise = (((sunrise - hour) % 24) + 24) % 24;
      const starsOut = Math.min(1, sinceSet / 1.5, Math.max(0, (toRise - 0.15) / 1.1));

      const { loud, quiet } = reduced
        ? { loud: '' as Loud, quiet: '' as Quiet }
        : ambientFor(hour, skyRef.current, isDay, falling === 'none', forcedAmb);
      const at = (Date.now() - AMB_EPOCH) / 1000;   // the ambient clock, s
      // twinkle, kept calm. the field: every 7s each star has a ~1-in-30 chance
      // of dipping to the dim plate for a beat, a rare flicker rather than a
      // shimmer. the sparkles: two slots on their own slow cycles, each picking
      // one star to flare into a cool-white pixel cross, so there are never
      // more than two going and usually one or none (drawn after the sky, below).
      const TW = 7;
      const twinkleAt = (s: number) => {
        const tt = at + s * 1000;
        const k = Math.floor(tt / TW);
        if (hash(s * 1000, k) > 0.035) return 0;
        const u = (tt - k * TW) / 0.5;
        return u > 1 ? 0 : 1;
      };
      // a night with something falling is cloud-lit, not black: lift the ramp
      // so flakes fall through murk instead of sitting on a clear starry sky
      // (weighted to the top, so the horizon doesn't wash up into the light plate)
      const murk = ez.murk;

      // a soft glow that brightens toward the body and fades to nothing at
      // `reach`, so the dither breaks it up with no edge to find. a near-new
      // moon barely glows.
      const glow = (isDay ? 0.9 : 0.9 * (0.25 + 0.75 * illum)) * (1 - 0.85 * closed);
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

      const lean = slant < 0 ? -1 : 1, across = Math.abs(slant);

      // Cirrus wisp: a thin fibrous streak high up, drifting across on the real
      // wind (faster when it's blowing harder), then a gap before the next one.
      // It's only a small lift on the sky's value, so the dither breaks it into a
      // sparse one-plate-lighter streak: very low alpha, in the same inks.
      // Waits for the real wind so its place never jumps when the fetch lands.
      let wHalf = 0, wx = 0, wy = 0, wSlope = 0, wSeed = 0, wA = 0, wy0 = 0, wy1 = -1;

      if (quiet === 'wisp' && weather.windKnown) {
        const cross = 260 - 170 * across, every = forcedAmb === 'wisp' ? cross : cross * 1.6;
        const k = Math.floor(at / every), p = (at - k * every) / cross;
        if (p <= 1) {
          wHalf = w * (0.15 + 0.08 * hash(k, 1.3));
          wx = lean > 0 ? -wHalf + (w + 2 * wHalf) * p : w + wHalf - (w + 2 * wHalf) * p;
          wy = h * (0.1 + 0.18 * hash(k, 2.9));
          wSlope = (hash(k, 4.1) - 0.5) * 0.08;
          wSeed = hash(k, 5.7) * 6.28;
          wA = 0.55 * Math.min(1, (performance.now() - ranAt) / 4000);
          wy0 = Math.floor(wy - Math.abs(wSlope) * wHalf - 5);
          wy1 = Math.ceil(wy + Math.abs(wSlope) * wHalf + 5);
        }
      }

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          let f = base[y] + s1[x] * g1[y] + s2[x] * g2[y] + s3[x] * g3[y];

          if (y >= wy0 && y <= wy1 && x >= wx - wHalf && x <= wx + wHalf) {
            const a = (x - wx) / wHalf;                    // -1..1 along the streak
            const off = y - wy - wSlope * (x - wx) - Math.sin(a * 2.4 + wSeed) * 1.2;
            f += wA * (1 - a * a) * Math.exp(-(off * off) / 3)
              * (0.6 + 0.4 * Math.sin((x - wx) * 0.45 + off * 1.3));   // the fibres
          }

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
          if (dayMoon) {
            const mdx = x - dmx, mdy = y - dmy;
            if (mdx * mdx + mdy * mdy < dmr2) {
              const u = mdx / moonRad, v = mdy / moonRad, rr = Math.sqrt(Math.max(0, 1 - v * v));
              if (mp < 0.5 ? u > term * rr : u < -term * rr) idx = idx < 2 ? 2 : 3;
            }
          }
          let [r, g, b] = pal[idx];

          plateAt[i] = idx;

          // flat star dots; a twinkling one steps down a plate, then out, then back
          if (stars && idx <= 1) {
            const s = starAt.get(i);
            // a closing sky takes them a few at a time, same order they came out in
            if (s !== undefined && s < starsOut * (1 - closed)) {
              const tw = quiet === 'twinkle' ? twinkleAt(s) : 0;
              const c = pal[tw === 0 ? 3 : 2]; r = c[0]; g = c[1]; b = c[2];
            }
          }

          const o = i * 4;
          data[o] = r; data[o + 1] = g; data[o + 2] = b; data[o + 3] = 255;
        }
      }

      // Clouds: real cumulus shapes, a row of overlapping puffs on a flat base,
      // lit plate on top and a dithered shadow plate along the belly. How many
      // follows the real cloud cover: a few small ones on a clear day, a broken
      // field when it's partly cloudy, and a stacked deck that all but closes the
      // sky when it's overcast. They ride the real wind, the bigger (nearer)
      // ones faster. Waits for the live weather and dithers in, so nothing
      // jumps when the fetch lands.
      if (weather.windKnown && forcedAmb !== 'off') {
        // rain and snow fall out of a closed deck, whatever the cover figure says
        const over = weather.opaque >= 85 || shut;
        const perBand = cloud < 25 ? 3 : cloud < 60 ? 5 : 7;
        // an even count, split over two lanes
        const n = 2 * Math.max(1, Math.round(perBand * Math.max(1, w / 240) / 2));
        // bright by day and through the afterglow, dim at night, and a storm
        // deck is grey: a plate down whenever something is falling out of it
        const bright = (isDay || sinceSet < 1.2 || sinceSet > 23) && falling === 'none';
        const lit = pal[bright ? 3 : 2];
        const shade = pal[bright ? 2 : 1];
        const litIdx = lit === pal[3] ? 3 : 2;
        const fadeIn = Math.min(1, (performance.now() - ranAt) / 1500);
        const atc = reduced ? 0 : at;
        const m = h * 1.2, span = w + 2 * m;
        // Overcast is one merged deck, not a crowd of separate clouds: three
        // banks of billows stacked from overhead down to the horizon, bigger
        // up top and smaller with distance. Each bank is an uneven run of
        // puff tops, lit all the way down, with its shadow gathering only
        // where it tucks in behind the billows of the bank in front. No flat
        // bases and no cut-off shapes; blue only shows between the highest tops.
        if (over) {
          const ROWS = [
            { cy: 0.20, R: 0.25, sp: 1 },
            { cy: 0.52, R: 0.21, sp: 0.78 },
            { cy: 0.82, R: 0.17, sp: 0.6 },
          ];
          const tops = ROWS.map(() => new Float32Array(w).fill(1e9));
          for (let r = 0; r < ROWS.length; r++) {
            const row = ROWS[r], top = tops[r];
            const R = Math.max(3, h * row.R);
            const m2 = R * 2.5, span2 = w + 2 * m2;
            const nr = Math.max(4, Math.round(span2 / (R * 0.85)));
            const drift = lean * (1.5 + 5 * across) * row.sp * (h / 60) * atc;
            for (let k = 0; k < nr; k++) {
              // big billows and small ones side by side, crests at uneven heights
              const pr = R * (0.5 + 0.95 * hash(k, r + 1.1) ** 1.5);
              const raw = ((k + (hash(k, r + 2.2) - 0.5) * 0.5) / nr) * span2 + drift;
              const pcx = ((raw % span2) + span2) % span2 - m2;
              const pcy = h * row.cy + R * 0.55 * (hash(k, r + 3.3) - 0.5);
              const xa = Math.max(0, Math.ceil(pcx - pr)), xb = Math.min(w - 1, Math.floor(pcx + pr));
              for (let x = xa; x <= xb; x++) {
                const dxp = x - pcx, t2 = pcy - Math.sqrt(pr * pr - dxp * dxp);
                if (t2 < top[x]) top[x] = t2;
              }
            }
            // the bank is solid under its puffs: where two small neighbours
            // don't quite meet, the crest bottoms out here instead of leaving
            // an open column for the bank behind to show through
            const floor = h * row.cy + R * 0.3;
            for (let x = 0; x < w; x++) if (top[x] > floor) top[x] = floor;
          }
          // each bank's crest line smoothed out: where the shadow of the bank
          // behind it settles, so it pools in the dips between billows and
          // thins to a sliver over the crests
          const soft = tops.map((top, r) => {
            const out = new Float32Array(w), k = Math.max(2, Math.round(h * ROWS[r].R * 1.1));
            let sum = 0, cnt = 0;
            for (let x = -k; x < w + k; x++) {
              if (x + k < w) { sum += Math.min(h, top[Math.max(0, x + k)]); cnt++; }
              if (x - k - 1 >= 0) { sum -= Math.min(h, top[x - k - 1]); cnt--; }
              if (x >= 0 && x < w) out[x] = sum / cnt;
            }
            return out;
          });
          for (let x = 0; x < w; x++) {
            for (let r = 0; r < ROWS.length; r++) {
              // this bank shows from its own crest down to the nearest crest in front
              let next = h + h * 0.12, nR = h * 0.17, pool = h * 0.92;
              for (let q = ROWS.length - 1; q > r; q--) if (tops[q][x] < next) { next = tops[q][x]; nR = h * ROWS[q].R; pool = soft[q][x] - nR * 0.28; }
              const y1 = Math.min(h, Math.round(next));
              for (let y = Math.max(0, Math.round(tops[r][x])); y < y1; y++) {
                const bay = BAYER[(y & 3) * 4 + (x & 3)];
                if (fadeIn < 1 && fadeIn < bay + 0.5) continue;
                const dark = (next - y) / nR < 0.16 + bay * 0.2 || (y - pool) / nR > bay * 0.5;
                const c = dark ? shade : lit, i2 = y * w + x, o = i2 * 4;
                data[o] = c[0]; data[o + 1] = c[1]; data[o + 2] = c[2];
                plateAt[i2] = dark ? litIdx - 1 : litIdx;
              }
            }
          }
          // Low cloud hanging on the mountain: under a closed sky, scarves of
          // mist sit IN FRONT of the ridge, each one bent to the smoothed shape
          // of the skyline it's lying on, some up at the crest and some lower
          // down the face, sliding along it with the wind. More of it in rain
          // and snow, most in fog. Dithered at the edges so it thins to nothing.
          if (fd) {
            const amount = weather.fog ? 1 : falling !== 'none' ? 0.7 : 0.45;
            const nm = Math.max(2, Math.round((w / 60) * amount));
            const mm = h * 1.5, spanM = w + 2 * mm;
            const driftM = lean * (1.5 + 5 * across) * 0.4 * (h / 60) * atc;
            for (let j = 0; j < nm; j++) {
              const L = h * (0.32 + 0.45 * hash(j, 21.1)), T = Math.max(2.5, h * (0.07 + 0.06 * hash(j, 22.2)) * (0.8 + 0.4 * amount));
              const raw = ((j + (hash(j, 23.3) - 0.5) * 0.6) / nm) * spanM + driftM * (0.7 + 0.6 * hash(j, 24.4));
              const mx = ((raw % spanM) + spanM) % spanM - mm;
              const down = h * (0.02 + 0.22 * hash(j, 25.5));       // how far below the crest it lies
              const xa = Math.max(0, Math.ceil(mx - L)), xb = Math.min(w - 1, Math.floor(mx + L));
              for (let x = xa; x <= xb; x++) {
                if (skys[x] >= h) continue;
                const a = (x - mx) / L, body = 1 - a * a;
                // follows the mountain's shape, eased toward level so it reads as cloud, not paint
                const yc = skys[x] * 0.75 + skys[Math.max(0, Math.min(w - 1, Math.round(mx)))] * 0.25 + down
                  + Math.sin(a * 5 + j * 1.7) * T * 0.25;
                // billowed along the top like the deck above it, flatter underneath
                const up = T * body * (0.55 + 0.6 * Math.abs(Math.sin(a * 6.5 + j * 2.3))), dn = T * 0.45 * body;
                for (let y = Math.max(0, Math.floor(yc - up)); y <= Math.min(h - 1, Math.ceil(yc + dn)); y++) {
                  const v = y < yc ? (y - yc) / (up + 0.001) : (y - yc) / (dn + 0.001), bay = BAYER[(y & 3) * 4 + (x & 3)];
                  if (body * (1 - v * v) * 2.6 < bay + 0.62) continue;
                  if (fadeIn < 1 && fadeIn < bay + 0.5) continue;
                  front(x, y, v > 0.1 + bay * 0.5 ? shade : lit);
                }
              }
            }
          }
        } else
        for (let j = 0; j < n; j++) {
          // two lanes, a high one and a low one, each cloud in its own slot
          // along its lane and every cloud in a lane moving at the lane's
          // speed: no two clouds ever touch or overlap
          const lane = j % 2, slot = span / (n / 2);
          // the high lane is the near one, almost overhead: bigger clouds
          // crossing faster. the low lane is far off toward the horizon:
          // smaller and slower, the way distance looks
          const sz = (lane ? 0.6 : 0.85) + 0.45 * hash(j, 1.1);
          const R = Math.min(Math.max(3, h * 0.085 * sz), slot / 8);
          const np = 3 + Math.floor(hash(j, 2.2) * 3);
          const speed = (1.5 + 5 * across) * (lane ? 0.6 : 1) * (h / 60);
          // spread evenly along the band, then jittered, so they never all bunch up
          const raw = (((j >> 1) + 0.5 * lane + 0.5) * slot) + (hash(j, 5.5) - 0.5) * Math.max(0, slot - 7.4 * R) + lean * speed * atc;
          const ccx = ((raw % span) + span) % span - m;
          const by = Math.round(h * ((lane ? 0.56 : 0.27) + 0.04 * (hash(j, 6.6) - 0.5)));
          const pxs: number[] = [], pys: number[] = [], prs: number[] = [];
          let half = 0, top = by;
          for (let i = 0; i < np; i++) {
            const bump = Math.sin(Math.PI * (i + 0.5) / np) + (hash(j, i + 3.3) - 0.5) * 0.35;
            const pr = R * (0.7 + 0.6 * bump);
            const ox = (i - (np - 1) / 2) * R * 1.05;
            pxs.push(ccx + ox); pys.push(by - pr * 0.5); prs.push(pr);
            half = Math.max(half, Math.abs(ox) + pr);
            top = Math.min(top, by - pr * 1.5);
          }
          const x0 = Math.max(0, Math.floor(ccx - half)), x1 = Math.min(w - 1, Math.ceil(ccx + half));
          if (x1 < 0 || x0 >= w) continue;
          for (let y = Math.max(0, Math.floor(top)); y <= by && y < h; y++) {
            for (let x = x0; x <= x1; x++) {
              let inside = false;
              for (let i = 0; i < np; i++) {
                const ddx = x - pxs[i], ddy = y - pys[i];
                if (ddx * ddx + ddy * ddy <= prs[i] * prs[i]) { inside = true; break; }
              }
              if (!inside) continue;
              const bay = BAYER[(y & 3) * 4 + (x & 3)];
              if (fadeIn < 1 && fadeIn < bay + 0.5) continue;
              // belly shadow: solid along the base, dithering up into the lit top
              const up = (by - y) / (R * 0.95);
              const dark = up < 0.42 + bay * 0.5;
              const c = dark ? shade : lit, i2 = y * w + x, o = i2 * 4;
              data[o] = c[0]; data[o + 1] = c[1]; data[o + 2] = c[2];
              plateAt[i2] = dark ? litIdx - 1 : litIdx;
            }
          }
        }
      }

      // Lightning: in a thunderstorm, a strike most cycles of a few seconds.
      // The whole sky jumps a plate lighter for two quick flickers while a
      // jagged bolt drops out of the deck and behind the ridge, forking once
      // on the way; the bolt outlasts the flash by a beat, the way it burns
      // into your eye. Off the wall clock like the rest; none under reduced motion.
      if (weather.thunder && falling === 'rain' && !reduced) {
        const every = 6.5, k = Math.floor(at / every);
        const u = at - k * every - hash(k, 9.1) * (every - 1);
        if (hash(k, 8.2) < 0.8 && u >= 0 && u < 0.42) {
          if (u < 0.08 || (u > 0.15 && u < 0.24)) {
            for (let i = 0, o = 0; i < plateAt.length; i++, o += 4) {
              const pl = plateAt[i] < 3 ? plateAt[i] + 1 : 3, c = pal[pl];
              data[o] = c[0]; data[o + 1] = c[1]; data[o + 2] = c[2];
              plateAt[i] = pl;
            }
          }
          const put = (x: number, y: number) => {
            if (x < 0 || x >= w || y < 0 || y >= h) return;
            const o = (y * w + x) * 4;
            data[o] = 255; data[o + 1] = 255; data[o + 2] = 255;
          };
          // short straight runs that kink every few rows, always working down
          const walk = (x: number, y0: number, y1: number, seed: number, thick: boolean) => {
            for (let y = y0; y < y1; y++) {
              const dir = hash(k + seed, Math.floor(y / 4) + 10.5) < 0.5 ? -1 : 1;
              if (hash(k + seed, y + 50.5) < 0.75) x += dir;
              // the main bolt lands on the mountain: it stops where it meets
              // the rock, with a hot pixel or two on the strike point
              if (seed === 0 && x >= 0 && x < w && y >= skyl[x]) {
                for (let dx = -1; dx <= 1; dx++) front(x + dx, y, [255, 255, 255]);
                front(x, y + 1, [255, 255, 255]);
                break;
              }
              put(x, y); if (thick) put(x + 1, y);
              if (y === forkY && seed === 0) forkX = x;
            }
          };
          const y0 = Math.round(h * 0.06), forkY = Math.round(h * (0.25 + 0.2 * hash(k, 6.6)));
          let forkX = -1;
          walk(Math.round(w * (0.08 + 0.84 * hash(k, 3.3))), y0, h, 0, h > 70);
          if (forkX >= 0) walk(forkX, forkY, Math.min(h, forkY + Math.round(h * 0.28)), 17, false);
        }
      }

      const t = reduced ? 0 : tMs / 1000;

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
        // thickens in over a second from the moment the weather landed
        const count = Math.round((fall.length / 4) * rate * (reduced ? 0.5 : Math.min(1, (performance.now() - ranAt) / 1100)));
        // a flake pixel: the lightest plate, or a dim one on the third plate
        // (the second where the sky already is the third) — on the dark night
        // plates a one-step shift would vanish
        const plates = plateAt;
        const flake = (x: number, y: number, dim: boolean) => {
          if (y < 0 || y >= h) return;
          const i = y * w + (x % w), o = i * 4;
          const c = dim ? pal[plates[i] === 2 ? 3 : 2] : pal[3];
          data[o] = c[0]; data[o + 1] = c[1]; data[o + 2] = c[2];
          // the mountain is the far thing: snow falls between it and you
          if (y >= skyl[x % w]) front(x % w, y, dim ? pal[2] : pal[3]);
        };
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
              // rain falls in front of the mountain too: every other streak
              // carries on down across the rock, a touch dimmer
              if (y >= skyl[x] && (k & 1) === 0) front(x, y, pal[2]);
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
              if (yy >= skyl[x]) front(x, yy, pal[2]);
            }
          }
        }
      }

      // Birds are inked in the ridge's own shadow plate, the darkest ink in the
      // print. They go into the sky buffer, so the ridge canvas covers them
      // wherever they dip below its line.
      const ink = ridgePaletteAt(hour, skyRef.current, false)[0];
      const dot = (x: number, y: number, c: Palette[number]) => {
        if (x < 0 || x >= w || y < 0 || y >= h) return;
        const o = (y * w + x) * 4;
        data[o] = c[0]; data[o + 1] = c[1]; data[o + 2] = c[2];
      };
      // stamps a pixel sprite centred on (x, y); slope tips it into a bank
      const sprite = (rows: readonly string[], x: number, y: number, c: Palette[number], slope: number) => {
        const cxs = (rows[0].length - 1) / 2;
        for (let r = 0; r < rows.length; r++) {
          const row = rows[r];
          for (let q = 0; q < row.length; q++) {
            if (row[q] !== 'x') continue;
            dot(x + q - Math.round(cxs), y + r - 1 + Math.round((q - cxs) * slope), c);
          }
        }
      };

      // Hawk: wide thermal circles (seen at a slant, so an ellipse) around a
      // centre that drifts across in ~2 min; as one leaves, the next comes in.
      // Three pixels, a shallow V that banks toward the middle of its circle at
      // the turns and flattens out on the straights.
      if (loud === 'hawk') {
        const every = 110, k = Math.floor(at / every), p = at / every - k;
        const dir = hash(k, 7.7) < 0.5 ? -1 : 1, spin = hash(k, 9.9) < 0.5 ? 1 : -1;
        const R = Math.max(6, Math.min(18, h * 0.22));
        const span = w + 4 * R;
        const ox = dir > 0 ? -2 * R + span * p : w + 2 * R - span * p;
        const oy = h * (0.2 + 0.12 * hash(k, 8.1)) + Math.sin(at * 0.07 + k) * h * 0.03;
        const th = spin * at * 2 * Math.PI / (13 + 4 * hash(k, 9.2)) + 6.28 * hash(k, 3.4);
        const hx = Math.round(ox + R * Math.cos(th)), hy = Math.round(oy + R * 0.32 * Math.sin(th));
        // a soaring hawk from below: long broad wings with the tips turned up,
        // a short fanned tail. it banks into the turn by dropping the inside wing.
        // now and then a couple of slow wingbeats between glides
        const flap = Math.sin(at * 0.9 + k) > 0.93 && Math.sin(at * 9) > 0;
        sprite(flap ? HAWK_FLAP : HAWK, hx, hy, ink, 0);
      }

      // Flock: every so often 4-7 birds in a loose V or a ragged line come in
      // off one edge and glide down toward the ridge, closing up and
      // shrinking to single pixels as they go, the stragglers dropping out
      // last. Wingbeats flick each bird between 2px (wings out) and 1px.
      if (loud === 'flock') {
        const fly = 18, every = forcedAmb === 'flock' ? fly + 2 : 42;
        const k = Math.floor(at / every);
        const age = (at - k * every - (forcedAmb === 'flock' ? 0 : hash(k, 1.1) * (every - fly))) / fly;
        if (age >= 0 && age <= 1) {
          const n = 4 + Math.floor(hash(k, 2.2) * 4);
          const dir = hash(k, 3.3) < 0.5 ? -1 : 1, vee = hash(k, 4.4) < 0.55;
          const lx = (dir > 0 ? -8 : w + 8) + dir * w * (0.6 + 0.3 * hash(k, 5.5)) * age;
          // in the afterglow band, where the dark ink reads, not the near-night top
          const y0 = h * (0.42 + 0.1 * hash(k, 6.6)), y1 = h * 0.78;
          const ly = y0 + (y1 - y0) * age * age;
          const near = 1 - age, gap = 4 + 4 * near;
          for (let j = 0; j < n; j++) {
            if (age > 0.7 && hash(k, j + 0.9) < (age - 0.7) / 0.3) continue;
            const rank = vee ? Math.ceil(j / 2) : j, side = j % 2 ? -1 : 1;
            const bx = Math.round(lx - dir * rank * gap * (vee ? 1 : 1.1) + Math.sin(at * 0.7 + j * 2.1) * 0.6);
            const by = Math.round(ly + (vee ? side * rank * gap * 0.55 : (hash(k, j + 0.5) - 0.5) * gap * 1.2 + j * 0.3)
              + Math.sin(at * 0.9 + j * 1.3) * 0.5);
            // the classic flapping bird: wings up, arched glide, wings down, glide.
            // close in it's the 5-wide shape, far off the 3-wide one
            const beat = (at * (2.4 + 0.6 * hash(k, j)) + hash(k, j + 3.7)) % 4;
            const f = beat < 1 ? 0 : beat < 2 || beat >= 3 ? 1 : 2;
            sprite(near > 0.4 ? BIRD[f] : BIRD_FAR[f], bx, by, ink, 0);
          }
        }
      }

      // Sparkles: the classic pixel star glint. Core goes cool white, then a
      // light-blue cross grows out one pixel, then two (the outer tips a deeper
      // blue), and folds back in. Skips anything near the moon.
      if (quiet === 'twinkle' && stars) {
        const SLOTS = [[4.6, 0], [7.3, 2.9]], SPD = 1.8;
        for (let sl = 0; sl < SLOTS.length && glints.length; sl++) {
          const tt = at + SLOTS[sl][1], k = Math.floor(tt / SLOTS[sl][0]);
          const u = (tt - k * SLOTS[sl][0]) / SPD;
          if (u > 1) continue;
          const i = glints[Math.floor(hash(sl + 0.5, k) * glints.length) % glints.length];
          // only a star that's showing: a cloud passing in front hides it
          if ((starAt.get(i) ?? 1) >= starsOut || data[i * 4] !== pal[3][0] || data[i * 4 + 1] !== pal[3][1] || data[i * 4 + 2] !== pal[3][2]) continue;
          const f = Math.sin(Math.PI * u);
          if (f < 0.12) continue;
          const x = i % w, y = (i / w) | 0;
          if ((x - cx) ** 2 + (y - cy) ** 2 < (rad + 4) ** 2) continue;
          dot(x, y, f > 0.3 ? ICE_CORE : pal[3]);
          if (f > 0.4) for (const [dx, dy] of CROSS) dot(x + dx, y + dy, ICE);
          if (f > 0.78) for (const [dx, dy] of CROSS) dot(x + 2 * dx, y + 2 * dy, ICE_DEEP);
        }
      }

      // Shooting star: one every 20-40s (every 3s when forced), a bright head
      // with a dithered tail crossing a small patch of sky in under a second,
      // dithering out as it burns up. Passes behind the moon.
      // (never under a closed deck: a shooting star can't cross in front of cloud)
      // On the real nights of a meteor shower there are more of them, up to one
      // every 7s at the peak of the Geminids or Perseids, and most streak away
      // from the same point above the band, the way a shower fans out from its
      // radiant.
      if (loud === 'meteor' && (weather.opaque < 85 || forcedAmb === 'meteor')) {
        const sh = showerTonight(hour);
        const every = forcedAmb === 'meteor' ? 3 : 30 / (1 + 3.3 * (sh ? sh.strength : 0));
        const k = Math.floor(at / every);
        const dur = 0.45 + 0.3 * hash(k, 2.3);
        const age = (at - k * every - (forcedAmb === 'meteor' ? 0 : hash(k, 1.7) * every / 3)) / dur;
        if (age >= 0 && age <= 1) {
          const x0 = w * (0.1 + 0.8 * hash(k, 3.1)), y0 = h * (0.04 + 0.3 * hash(k, 4.2));
          let ang = 0.35 + 0.45 * hash(k, 6.4), dir = hash(k, 5.3) < 0.5 ? -1 : 1;
          if (sh && hash(k, 8.6) < 0.35 + 0.6 * sh.strength) {
            const rx = w * sh.radiant - x0, ry = -h * 0.9 - y0;
            dir = rx > 0 ? -1 : 1;
            ang = Math.atan2(-ry, Math.abs(rx));
          }
          const ux = dir * Math.cos(ang), uy = Math.sin(ang);
          const head = Math.min(w * 0.18, 26 + 16 * hash(k, 7.5)) * age;
          const tail = Math.min(13, head), fade = age > 0.7 ? (age - 0.7) / 0.3 : 0;
          for (let s = 0; s <= tail; s += 0.5) {
            const x = Math.floor(x0 + ux * (head - s)), y = Math.floor(y0 + uy * (head - s));
            const q = tail > 0 ? s / tail : 0;
            // solid up front, dithering out down the back half (and all of it as it burns out)
            if (Math.max(0, q - 0.45) * 2.2 + fade * 1.2 > BAYER[(y & 3) * 4 + (x & 3)] + 0.5 + (s < 1 ? 0.6 : 0)) continue;
            if ((x - cx) ** 2 + (y - cy) ** 2 < rad * rad) continue;
            dot(x, y, s < 1 ? ICE_CORE : q < 0.5 ? ICE : ICE_DEEP);
          }
        }
      }

      ctx.putImageData(img, 0, 0);
      if (fctx && frontImg) fctx.putImageData(frontImg, 0, 0);
    };

    let raf = 0, last = 0;
    const loop = (t: number) => {
      if (t - last > 33) { draw(t); last = t; }       // 30fps ceiling
      raf = requestAnimationFrame(loop);
    };

    resize();
    measure();
    draw(performance.now());
    if (!reduced) raf = requestAnimationFrame(loop);

    const ro = new ResizeObserver(() => { resize(); measure(); draw(performance.now()); });
    ro.observe(band);
    const onLine = () => { measure(); draw(performance.now()); };
    window.addEventListener('ridge-line', onLine);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener('ridge-line', onLine); };
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
        <Ridge look={ridgeLookFor(weather)} sky={skyRef.current} />
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
