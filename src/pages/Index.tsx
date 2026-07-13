import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import SEO from '../components/SEO';
import { PersonSchema, WebsiteSchema } from '../components/StructuredData';

/* ── Helpers ──────────────────────────────────────────── */

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface GitHubActivity {
  latestCommit: { repo: string; time: string } | null;
  history: { days: number[]; total: number; startDate: Date; endDate: Date } | null;
}

async function fetchFromPublicAPI() {
  const [p1, p2] = await Promise.all(
    [1, 2].map((page) =>
      fetch(`https://api.github.com/users/connergroth/events/public?per_page=100&page=${page}`)
        .then((r) => r.json())
        .catch(() => [])
    )
  );
  const events = [...(Array.isArray(p1) ? p1 : []), ...(Array.isArray(p2) ? p2 : [])];

  let latestCommit = null;
  const push = events.find((e: any) => e.type === 'PushEvent');
  if (push) {
    latestCommit = {
      repo: `${push.repo.name.replace('connergroth/', '')}/${(push.payload?.ref || '').replace('refs/heads/', '') || 'main'}`,
      createdAt: push.created_at,
    };
  }

  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 29);
  start.setHours(0, 0, 0, 0);
  const days = new Array(30).fill(0);
  let total = 0;

  for (const ev of events) {
    if (ev.type !== 'PushEvent') continue;
    const d = new Date(ev.created_at);
    if (d < start) continue;
    const idx = Math.floor((d.getTime() - start.getTime()) / 86_400_000);
    if (idx >= 0 && idx < 30) {
      const n = ev.payload?.size || ev.payload?.commits?.length || 1;
      days[idx] += n;
      total += n;
    }
  }

  return { latestCommit, history: { days, total, startDate: start.toISOString(), endDate: now.toISOString() } };
}

interface Track {
  name: string;
  artist: string;
  url: string;
  nowPlaying: boolean;
  playedAt: number | null;
}

function loadCache<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function saveCache(key: string, value: any) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function useLastFm(): Track | null {
  const [track, setTrack] = useState<Track | null>(() =>
    loadCache<Track>('cache:lastfm')
  );

  useEffect(() => {
    fetch('/api/lastfm')
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (json?.track) {
          setTrack(json.track);
          saveCache('cache:lastfm', json.track);
        }
      })
      .catch(() => {});
  }, []);

  return track;
}

interface RawGitHubData {
  latestCommit: { repo: string; createdAt: string } | null;
  history: { days: number[]; total: number; startDate: string; endDate: string } | null;
}

function useGitHubActivity(): GitHubActivity {
  const [data, setData] = useState<GitHubActivity>(() => {
    const cached = loadCache<RawGitHubData>('cache:github');
    if (!cached) return { latestCommit: null, history: null };
    return {
      latestCommit: cached.latestCommit
        ? { repo: cached.latestCommit.repo, time: timeAgo(new Date(cached.latestCommit.createdAt)) }
        : null,
      history: cached.history
        ? { ...cached.history, startDate: new Date(cached.history.startDate), endDate: new Date(cached.history.endDate) }
        : null,
    };
  });

  useEffect(() => {
    (async () => {
      let json;
      try {
        const res = await fetch('/api/github');
        if (res.ok) json = await res.json();
      } catch {}

      const serverEmpty = !json || (!json.latestCommit && (json.history?.total ?? 0) === 0);
      if (serverEmpty) {
        try { json = await fetchFromPublicAPI(); } catch { return; }
      }

      if (!json) return;

      saveCache('cache:github', { latestCommit: json.latestCommit, history: json.history });

      setData({
        latestCommit: json.latestCommit
          ? { repo: json.latestCommit.repo, time: timeAgo(new Date(json.latestCommit.createdAt)) }
          : null,
        history: json.history
          ? { ...json.history, startDate: new Date(json.history.startDate), endDate: new Date(json.history.endDate) }
          : null,
      });
    })();
  }, []);

  return data;
}

/* ── Inline components ────────────────────────────────── */

/* Apple mark as an inline glyph — SVG (not U+F8FF, which breaks off-Apple),
   sized and baseline-tuned to sit in running text like a character. */
const AppleMark = () => (
  <svg
    viewBox="0 0 24 24.2"
    fill="currentColor"
    aria-hidden="true"
    className="inline-block w-[0.85em] h-[0.85em] mr-[0.18em] overflow-visible"
    style={{ verticalAlign: '-0.07em' }}
  >
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.033 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
  </svg>
);

/* Tiny equalizer — simulated audio-reactive bars while listening, static
   when idle. Runs at 60fps via rAF; each bar sums two sine waves at
   unrelated frequencies, so the motion is smooth, musical, and never
   visibly repeats. DOM is mutated directly — no re-renders. */
const EQ_BARS = [
  { f1: 5.1, f2: 11.3, p1: 0.0, p2: 2.1, idle: 45 },
  { f1: 7.3, f2: 9.1, p1: 1.4, p2: 0.6, idle: 75 },
  { f1: 6.2, f2: 13.7, p1: 2.7, p2: 4.2, idle: 55 },
  { f1: 8.4, f2: 10.9, p1: 4.1, p2: 1.8, idle: 65 },
];

const Waveform = ({ playing }: { playing: boolean }) => {
  const bars = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    if (!playing) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf: number;
    const tick = () => {
      const t = performance.now() / 1000;
      EQ_BARS.forEach((b, i) => {
        const el = bars.current[i];
        if (!el) return;
        const v =
          0.52 +
          0.3 * Math.sin(t * b.f1 + b.p1) +
          0.2 * Math.sin(t * b.f2 + b.p2);
        el.style.height = `${Math.max(0.12, Math.min(1, v)) * 100}%`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      EQ_BARS.forEach((b, i) => {
        const el = bars.current[i];
        if (el) el.style.height = `${b.idle}%`;
      });
    };
  }, [playing]);

  return (
    <span
      className="inline-flex items-end gap-[2px] h-[0.7em] mr-[0.5em]"
      aria-hidden="true"
    >
      {EQ_BARS.map((b, i) => (
        <span
          key={i}
          ref={(el) => {
            bars.current[i] = el;
          }}
          className={`w-[2px] rounded-full ${
            playing ? 'bg-green-500' : 'bg-stone-400'
          }`}
          style={{ height: `${b.idle}%` }}
        />
      ))}
    </span>
  );
};

/* Trim commit refs for display: drop the org prefix and the default branch.
   "lucencelabs/lucence.so/main" → "lucence.so" */
function shortRepo(ref: string): string {
  const parts = ref.split('/');
  const rest = parts.length > 2 ? parts.slice(1) : parts;
  return rest.join('/').replace(/\/main$/, '');
}

/* ── Page ─────────────────────────────────────────────── */

const Index = () => {
  const { latestCommit } = useGitHubActivity();
  const track = useLastFm();

  return (
    <>
      <SEO
        title="Conner Groth"
        description="Software engineer — CS at CU Boulder, SWE intern at Apple on the Screen Time team. Currently building Spot, an AI gym coach in iMessage."
        keywords="Conner Groth, software engineer, Spot, Lucence, Apple, AI, portfolio"
      />
      <PersonSchema
        name="Conner Groth"
        jobTitle="Software Engineer"
        url="https://connergroth.com"
        imageUrl="/assets/images/favicon.png"
        description="Software engineer — SWE intern at Apple, building Spot under Lucence."
        sameAs={[
          'https://github.com/connergroth',
          'https://linkedin.com/in/connergroth',
        ]}
      />
      <WebsiteSchema
        name="Conner Groth"
        url="https://connergroth.com"
        description="Personal site of Conner Groth"
        author="Conner Groth"
      />

      <Header />

      <main className="page-enter">
        {/* One composed viewport: name → intro → meta → contact,
            with the live status line pinned at the bottom. */}
        <section
          id="index"
          className="min-h-[calc(100svh-1rem)] md:min-h-[calc(100svh-1.5rem)] max-w-[680px] mx-auto px-6 flex flex-col"
        >
          <div className="flex-1 flex flex-col justify-center pt-20 pb-10">
            <h1 className="font-serif text-[clamp(2.75rem,7vw,4.25rem)] leading-none tracking-[-0.02em] text-stone-900">
              conner groth.
            </h1>

            <p className="mt-8 text-[1.02rem] leading-relaxed text-stone-600 max-w-[54ch]">
              Software engineer and CS student at CU Boulder, currently
              interning at{' '}
              <span className="text-stone-900 whitespace-nowrap">
                <AppleMark />
                Apple
              </span>{' '}
              on the Screen Time team, where I build AI agents that turn
              feature specs into passing tests.
            </p>

            <p className="mt-4 text-[1.02rem] leading-relaxed text-stone-600 max-w-[54ch]">
              Right now I&rsquo;m building{' '}
              <a
                href="https://spot-black-gamma.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-500 hover:decoration-2 transition-colors"
              >
                Spot
              </a>
              , a gym coach that lives in your texts. Before that:{' '}
              <Link
                to="/work/sift"
                className="text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-500 hover:decoration-2 transition-colors"
              >
                Sift
              </Link>
              , an AI academic assistant in iMessage, and{' '}
              <Link
                to="/work/seqimprove"
                className="text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-500 hover:decoration-2 transition-colors"
              >
                research tools
              </Link>{' '}
              for synthetic biology.
            </p>

            <Link
              to="/work"
              className="mt-5 inline-block self-start text-[0.9rem] text-stone-500 hover:text-stone-900 transition-colors"
            >
              view all work &rarr;
            </Link>

            <div id="contact" className="mt-14">
              <a
                href="mailto:conner@lucence.so"
                className="text-[0.95rem] text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-500 hover:decoration-2 transition-colors"
              >
                conner@lucence.so
              </a>
              <div className="flex items-center gap-5 mt-4">
                <a
                  href="https://github.com/connergroth"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[0.85rem] text-stone-400 hover:text-stone-900 active:translate-y-px transition-colors"
                >
                  github
                </a>
                <a
                  href="https://linkedin.com/in/connergroth"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[0.85rem] text-stone-400 hover:text-stone-900 active:translate-y-px transition-colors"
                >
                  linkedin
                </a>
                <a
                  href="https://x.com/connermgroth"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[0.85rem] text-stone-400 hover:text-stone-900 active:translate-y-px transition-colors"
                >
                  x
                </a>
                <a
                  href="https://lucence.so"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[0.85rem] text-stone-400 hover:text-stone-900 active:translate-y-px transition-colors"
                >
                  lucence
                </a>
                <a
                  href="/assets/documents/Conner-Groth-Resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[0.85rem] text-stone-400 hover:text-stone-900 active:translate-y-px transition-colors"
                >
                  resume
                </a>
              </div>
            </div>
          </div>

          {/* Live status + ask-ai — the machine layer, pinned at the fold */}
          <div className="pb-8 min-h-[3rem] flex items-center justify-between gap-5">
            <p className="flex-1 min-w-0 font-mono text-[0.7rem] text-stone-400 leading-relaxed flex flex-wrap items-baseline gap-x-5 gap-y-1.5">
              <span className="whitespace-nowrap">boulder &rarr; san diego</span>
              {latestCommit && (
                <span className="whitespace-nowrap">
                  pushed <span className="text-stone-500">{latestCommit.time}</span>{' '}
                  &rarr;{' '}
                  <span className="text-stone-500">
                    {shortRepo(latestCommit.repo)}
                  </span>
                </span>
              )}
              {track && (
                <span className="whitespace-nowrap">
                  <Waveform playing={track.nowPlaying} />
                  <a
                    href={track.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-stone-500 hover:text-stone-900 transition-colors inline-block max-w-[11rem] truncate align-bottom"
                  >
                    {track.name}
                  </a>{' '}
                  — {track.artist}
                </span>
              )}
            </p>
            <button
              onClick={() => window.dispatchEvent(new Event('cmdk:open'))}
              className="shrink-0 whitespace-nowrap font-mono text-[0.7rem] text-stone-500 hover:text-stone-900 bg-white border border-stone-200 rounded-md px-2.5 py-1 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.07)] hover:border-stone-300 active:translate-y-px active:shadow-none transition-all"
            >
              ask ai about me &rarr;
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200/80 py-8 px-6">
        <div className="max-w-[680px] mx-auto flex justify-between items-center">
          <span className="text-[0.75rem] text-stone-400">
            &copy; {new Date().getFullYear()} Conner Groth
          </span>
          <a
            href="https://github.com/connergroth/connergroth.com"
            target="_blank"
            rel="noreferrer"
            className="text-[0.75rem] text-stone-400 hover:text-stone-600 transition-colors"
          >
            view source
          </a>
        </div>
      </footer>
    </>
  );
};

export default Index;
