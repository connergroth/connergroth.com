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

    // Last.fm serves a grey placeholder star when it has no art for a release.
    // Treat that as "no cover" instead of rendering the asterisk.
    const PLACEHOLDER = '2a96cdd108f4';
    const images: { size?: string; '#text'?: string }[] = Array.isArray(track.image) ? track.image : [];
    const bySize = (size: string) => images.find((i) => i.size === size)?.['#text'] || '';
    const rawCover = bySize('extralarge') || bySize('large') || bySize('medium') || '';
    const cover = rawCover && !rawCover.includes(PLACEHOLDER) ? rawCover : null;

    return new Response(
      JSON.stringify({
        track: {
          name: track.name,
          artist: track.artist?.['#text'] || '',
          album: track.album?.['#text'] || '',
          cover,
          url: track.url,
          nowPlaying: track['@attr']?.nowplaying === 'true',
          playedAt: track.date?.uts ? Number(track.date.uts) * 1000 : null,
        },
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          // The strip is supposed to read as live, and s-maxage=60 + swr=120
          // meant a visitor could sit on a track up to three minutes stale.
          // Ten seconds still collapses every visitor into ~6 upstream calls a
          // minute (Last.fm's own now-playing push isn't faster than that
          // anyway), and max-age=0 stops the browser from holding a second copy
          // on top of the edge's.
          'Cache-Control': 'public, max-age=0, s-maxage=10, stale-while-revalidate=30',
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
