import { useEffect, useState } from 'react';
import AltTellMe from '@/components/AltTellMe';
import AltAskAi from '@/components/AltAskAi';
import SEO from '../components/SEO';
import SkyBand from '../components/SkyBand';

/* ── Alt layout ───────────────────────────────────────────
   Freeman-Jiang structure: full-bleed band, then one narrow left-aligned
   column and nothing else. No nav, no wordmark, no command palette, no
   sheet border. The band is the only ornament, and it's alive.
   ───────────────────────────────────────────────────────── */

const LINKS = [
  { label: 'GitHub', href: 'https://github.com/connergroth' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/connergroth' },
  { label: 'X', href: 'https://x.com/connermgroth' },
  { label: 'Email', href: 'mailto:conner@lucence.so' },
  { label: 'Resume', href: '/assets/documents/Conner-Groth-Resume.pdf' },
];

/* Every project points at the real thing, not a case-study page on this site.
   One page, and the links leave. */
const PROJECTS: { name: string; href: string; blurb: string }[] = [
  { name: 'spot', href: 'https://textspot.app', blurb: 'a calorie tracker you text instead of an app' },
  { name: 'sift', href: 'https://usesift.app', blurb: 'an AI iMessage assistant for school' },
  { name: 'seqimprove', href: 'https://seqimprove.synbiohub.org', blurb: 'AI-assisted sequence annotation for synthetic biology' },
  { name: 'lucence', href: 'https://lucence.so', blurb: 'the studio everything above sits under' },
];

const link =
  'text-stone-900 underline decoration-stone-300 underline-offset-[3px] hover:decoration-stone-600 transition-colors';

interface Track {
  name: string;
  artist: string;
  album: string;
  cover: string | null;
  url: string;
  nowPlaying: boolean;
}

/* Last.fm's most recent scrobble. Cached in localStorage so a repeat visit
   paints the strip immediately instead of popping in a second later. */
function useLastFm(): Track | null {
  const [track, setTrack] = useState<Track | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem('cache:lastfm:alt');
      return raw ? (JSON.parse(raw) as Track) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    fetch('/api/lastfm')
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!j?.track) return;
        setTrack(j.track);
        try {
          localStorage.setItem('cache:lastfm:alt', JSON.stringify(j.track));
        } catch {}
      })
      .catch(() => {});
  }, []);

  return track;
}

export default function AltIndex() {
  const track = useLastFm();
  const [tellMeOpen, setTellMeOpen] = useState(false);

  return (
    <>
      <SEO
        title="Conner Groth"
        description="Software engineer — CS at CU Boulder, most recently SWE at Apple on the Screen Time team."
        keywords="Conner Groth, software engineer, Apple, Lucence, portfolio"
      />

      {/* Height = the ridge asset's own rendered height (it's 1800x150, so
          100vw/12) plus a thin slab of sky above it. That way the peak
          always clears the top edge instead of getting cropped. */}
      <SkyBand className="h-[clamp(84px,calc(100vw/12+40px),190px)]" />

      <main className="mx-auto w-full max-w-[520px] px-6 pt-8 sm:pt-10 pb-24">
        <h1 className="font-serif text-[1.55rem] font-medium tracking-[-0.01em] text-stone-900">
          Conner Groth
        </h1>

        {/* Tense is deliberately past-and-durable: the internship ends Aug 7,
            2026, and "most recently" stays true until the next role instead of
            needing an edit on a specific day. */}
        <div className="mt-7 space-y-4 text-[0.94rem] leading-[1.75] text-stone-700">
          <p>
            I&rsquo;m a software engineer and CS student at CU Boulder, graduating
            May 2027. Most recently I was at Apple on the Screen Time team, where
            I built agents that turn feature specs into passing tests.
          </p>
        </div>

        <p className="mt-7 text-[0.94rem] leading-[1.75] text-stone-700">
          A few things I&rsquo;ve built:
        </p>
        <ul className="mt-2 space-y-1.5 pl-5 list-disc marker:text-stone-400 text-[0.94rem] leading-[1.75] text-stone-700">
          {PROJECTS.map((p) => (
            <li key={p.name}>
              <a href={p.href} target="_blank" rel="noreferrer" className={link}>{p.name}</a>
              {' '}&mdash; {p.blurb}
            </li>
          ))}
        </ul>

        <nav className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[0.94rem]">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noreferrer"
              className={link}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* One row, two separate controls — the human invitation and the machine
            one. They sit on the same line so the page ends in three rows instead
            of four; the AI link stays a shade quieter so the line still has a
            primary. While the field is open it owns the row. */}
        <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[0.94rem] leading-[1.75]">
          <AltTellMe onExpandedChange={setTellMeOpen} />
          {!tellMeOpen && <AltAskAi />}
        </div>

        {/* Last.fm — album art instead of a waveform. min-h holds the space so
            the page doesn't jump when the fetch lands on a cold visit. */}
        <div className="mt-16 min-h-[1.75rem]">
          {track && (
            <a
              href={track.url}
              target="_blank"
              rel="noreferrer"
              className="group flex w-fit max-w-full items-center gap-2.5"
            >
              {track.cover ? (
                <img
                  src={track.cover}
                  alt={track.album || track.name}
                  loading="lazy"
                  /* The site sends COEP: require-corp, so a cross-origin image
                     is blocked unless it's fetched in CORS mode. Last.fm's CDN
                     serves Access-Control-Allow-Origin: *, so this is enough. */
                  crossOrigin="anonymous"
                  className="h-7 w-7 shrink-0 rounded-[2px] object-cover opacity-90 shadow-[0_1px_2px_rgba(0,0,0,0.10)] transition-opacity group-hover:opacity-100"
                />
              ) : (
                <span className="h-7 w-7 shrink-0 rounded-[2px] bg-stone-200" />
              )}
              <span className="min-w-0 font-mono text-[0.63rem] leading-[1.4]">
                <span className="block text-stone-400">
                  {track.nowPlaying ? 'now playing' : 'last played'}
                </span>
                <span className="block truncate text-stone-500 transition-colors group-hover:text-stone-900">
                  {track.name} &mdash; {track.artist}
                </span>
              </span>
            </a>
          )}
        </div>
      </main>
    </>
  );
}
