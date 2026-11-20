// Pinned east: from Vercel's sfo1 edge the call to Open-Meteo hangs until it
// times out, while iad1 gets an answer in well under a second. The response is
// cached at every edge, so where it runs only matters on a refresh.
export const config = { runtime: 'edge', regions: ['iad1'] };

/* Boulder's current weather for the header sky, fetched here so every visitor
   gets a copy that's already sitting at the edge instead of waiting on their
   own call to Open-Meteo. The fields and the place are fixed: this takes no
   input, so there's nothing for a caller to steer. SkyBand.tsx reads the same
   `current` block either way and falls back to calling Open-Meteo itself if
   this ever fails. */
const URL_ =
  'https://api.open-meteo.com/v1/forecast?latitude=40.015&longitude=-105.2705' +
  '&current=cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,temperature_2m,precipitation,rain,snowfall,weather_code,snow_depth,' +
  'wind_speed_10m,wind_direction_10m,wind_gusts_10m&temperature_unit=fahrenheit&timezone=auto&forecast_days=1';

const fail = (status: number) =>
  new Response('{"error":"sky"}', {
    status,
    // never let a miss sit in the cache in place of the weather
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

export default async function handler() {
  try {
    const r = await fetch(URL_, { signal: AbortSignal.timeout(4000) });
    if (!r.ok) return fail(502);
    const current = (await r.json())?.current;
    if (!current || typeof current !== 'object') return fail(502);
    return new Response(JSON.stringify({ current }), {
      headers: {
        'Content-Type': 'application/json',
        // Open-Meteo's "current" moves every 15 minutes. Five minutes fresh,
        // then up to half an hour served as-is while the edge refetches behind
        // it, so a visitor almost never waits on the upstream call. Nothing is
        // held in the browser.
        'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=1800',
      },
    });
  } catch {
    return fail(502);
  }
}
