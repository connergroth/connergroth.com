export const config = { runtime: 'edge' };

export default async function handler() {
  const apiKey = process.env.LASTFM_API_KEY;
  const user = process.env.LASTFM_USER || 'connergroth';

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Missing LASTFM_API_KEY' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const res = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&api_key=${apiKey}&format=json&limit=1`,
      { headers: { 'User-Agent': 'connergroth.com' } }
    );
    const data = await res.json();
    const track = data?.recenttracks?.track?.[0];

    if (!track) {
      return new Response(JSON.stringify({ track: null }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({
        track: {
          name: track.name,
          artist: track.artist?.['#text'] || '',
          url: track.url,
          nowPlaying: track['@attr']?.nowplaying === 'true',
          playedAt: track.date?.uts ? Number(track.date.uts) * 1000 : null,
        },
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 's-maxage=60, stale-while-revalidate=120',
        },
      }
    );
  } catch {
    return new Response(JSON.stringify({ track: null }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
