import AltTellMe from '@/components/AltTellMe';
import AltAskAi from '@/components/AltAskAi';
import SEO from '../components/SEO';
import SkyBand from '../components/SkyBand';
import NowPlaying from '../components/NowPlaying';

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

export default function AltIndex() {
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
      <SkyBand className="h-[clamp(104px,calc(100vw/12+40px),190px)]" />

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
            primary. The AI link is a CHILD of the field rather than a sibling,
            so opening the field cross-fades the whole row as one thing instead
            of unmounting the link out from under it. */}
        <div className="mt-4 text-[0.94rem] leading-[1.75]">
          <AltTellMe>
            <AltAskAi />
          </AltTellMe>
        </div>

        <NowPlaying />

      </main>
    </>
  );
}
