import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

const PROJECTS: { name: string; href?: string; to?: string; blurb: string }[] = [
  { name: 'spot', href: 'https://textspot.app', blurb: 'a calorie tracker you text instead of an app' },
  { name: 'sift', to: '/work/sift', blurb: 'an AI academic assistant that lived inside Canvas' },
  { name: 'seqimprove', to: '/work/seqimprove', blurb: 'curation tooling for synthetic biology at the Genetic Logic Lab' },
  { name: 'lucence', href: 'https://lucence.so', blurb: 'the studio everything above sits under' },
];

const link =
  'text-stone-900 underline decoration-stone-300 underline-offset-[3px] hover:decoration-stone-600 transition-colors';

function useLastPush() {
  const [s, setS] = useState<string | null>(null);
  useEffect(() => {
    fetch('/api/github')
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!j?.latestCommit) return;
        const repo = j.latestCommit.repo.split('/').slice(1).join('/').replace(/\/main$/, '');
        const mins = Math.floor((Date.now() - new Date(j.latestCommit.createdAt).getTime()) / 60000);
        const ago =
          mins < 60 ? `${mins}m` : mins < 1440 ? `${Math.floor(mins / 60)}h` : `${Math.floor(mins / 1440)}d`;
        setS(`pushed ${ago} ago → ${repo}`);
      })
      .catch(() => {});
  }, []);
  return s;
}

export default function AltIndex() {
  const push = useLastPush();

  return (
    <>
      <SEO
        title="Conner Groth"
        description="Software engineer — CS at CU Boulder, SWE intern at Apple on the Screen Time team."
        keywords="Conner Groth, software engineer, Apple, Lucence, portfolio"
      />

      {/* Height = the ridge asset's own rendered height (it's 1800x210, so
          100vw/8.571) plus a thin slab of sky above it. That way the peak
          always clears the top edge instead of getting cropped. */}
      <SkyBand className="h-[clamp(112px,calc(100vw/8.571+52px),248px)]" />

      <main className="mx-auto w-full max-w-[520px] px-6 pt-16 pb-24">
        <h1 className="font-serif text-[1.15rem] tracking-[-0.01em] text-stone-900">
          Conner Groth
        </h1>

        <div className="mt-7 space-y-4 text-[0.94rem] leading-[1.75] text-stone-700">
          <p>
            I&rsquo;m a CS student at CU Boulder, graduating May 2027. This summer
            I&rsquo;m a software engineering intern at Apple on the Screen Time team,
            where I build agents that turn feature specs into passing tests.
          </p>
        </div>

        <p className="mt-7 text-[0.94rem] leading-[1.75] text-stone-700">
          A few things I&rsquo;ve built:
        </p>
        <ul className="mt-2 space-y-1.5 pl-5 list-disc marker:text-stone-400 text-[0.94rem] leading-[1.75] text-stone-700">
          {PROJECTS.map((p) => (
            <li key={p.name}>
              {p.to ? (
                <Link to={p.to} className={link}>{p.name}</Link>
              ) : (
                <a href={p.href} target="_blank" rel="noreferrer" className={link}>{p.name}</a>
              )}
              {' '}&mdash; {p.blurb}
            </li>
          ))}
        </ul>

        <p className="mt-7 text-[0.94rem] leading-[1.75] text-stone-700">
          Tell me something.
        </p>

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

        <p className="mt-16 font-mono text-[0.68rem] text-stone-400 flex flex-wrap gap-x-4 gap-y-1">
          <span>boulder &rarr; san diego</span>
          {push && <span>{push}</span>}
        </p>
      </main>
    </>
  );
}
