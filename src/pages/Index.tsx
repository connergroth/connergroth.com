import { useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import AltPrompts from '@/components/AltPrompts';
import AskPanel, { type AskHandle } from '@/components/AskPanel';
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

const link =
  'text-stone-900 underline decoration-stone-300 underline-offset-[3px] hover:decoration-stone-600 transition-colors';

/* Every project points at the real thing, not a case-study page on this site.
   One page, and the links leave. */
const PROJECTS: { name: string; href: string; blurb: ReactNode }[] = [
  // The repo link goes live when the public remote flips — the entry ships now
  // because the one-liner is the pitch, and the link follows within days.
  { name: 'Fig', href: 'https://github.com/connergroth/fig', blurb: 'a personal agent with its own Mac, Apple ID, and phone number' },
  { name: 'Sift', href: 'https://usesift.app', blurb: 'an AI iMessage assistant for school' },
  {
    name: 'SeqImprove',
    href: 'https://seqimprove.synbiohub.org',
    // Attribution matters here: this is lab work, not a Lucence product. The
    // paper link replaces nothing — it gets appended once it's published.
    blurb: (
      <>
        AI-assisted sequence annotation for synthetic biology, built at CU Boulder&rsquo;s{' '}
        <a href="https://geneticlogiclab.org" target="_blank" rel="noreferrer" className={link}>
          Genetic Logic Lab
        </a>
      </>
    ),
  },
  { name: 'Lucence', href: 'https://lucence.so', blurb: 'my studio building custom AI software for small businesses' },
];

/* Stagger slot for the .reveal load-in (globals.css). */
const at = (i: number) => ({ '--i': i }) as CSSProperties;

export default function AltIndex() {
  const [asking, setAsking] = useState(false);
  const askRef = useRef<AskHandle>(null);

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
      <SkyBand
        className="reveal-sky h-[clamp(104px,calc(100vw/12+40px),190px)]"
      />

      <main className="mx-auto w-full max-w-[520px] px-6 pt-8 sm:pt-10 pb-24">
        <h1 style={at(0)} className="reveal font-serif text-[1.55rem] font-medium tracking-[-0.01em] text-stone-900">
          Conner Groth
        </h1>

        {/* Asking fades everything under the name out and the question page in
            over the same space: the page stays one screen tall and nothing else
            is in view. The faded page keeps its place, so the height never moves. */}
        <div className="relative">
          <div
            aria-hidden={asking}
            {...({ inert: asking ? '' : undefined } as object)}
            className={`transition-opacity ease-out motion-reduce:transition-none motion-reduce:delay-0 ${
              asking ? 'pointer-events-none opacity-0 duration-200' : 'opacity-100 duration-300 delay-[160ms]'
            }`}
          >
            {/* Tense is deliberately past-and-durable: the internship ends Aug 7,
                2026, and "most recently" stays true until the next role instead of
                needing an edit on a specific day. */}
            <div style={at(1)} className="reveal mt-7 space-y-4 text-[0.94rem] leading-[1.75] text-stone-700">
              <p>
                I&rsquo;m a software engineer and CS student at CU Boulder, graduating
                May 2027. Most recently I was at{' '}
                <span className="whitespace-nowrap">
                  Apple
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="ml-[0.2em] inline-block h-[0.8em] w-[0.8em] -translate-y-[0.1em] fill-current text-stone-500"
                  >
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                  </svg>
                </span>{' '}
                on the Screen Time team, where
                I built agents that turn feature specs into passing tests.
              </p>
            </div>

            <p style={at(2)} className="reveal mt-7 text-[0.94rem] leading-[1.75] text-stone-700">
              A few things I&rsquo;ve built:
            </p>
            <ul className="mt-2 space-y-1.5 pl-5 list-disc marker:text-stone-400 text-[0.94rem] leading-[1.75] text-stone-700">
              {PROJECTS.map((p, i) => (
                <li key={p.name} style={at(3 + i)} className="reveal">
                  <a href={p.href} target="_blank" rel="noreferrer" className={link}>{p.name}</a>
                  {' '}&mdash; {p.blurb}
                </li>
              ))}
            </ul>

            <nav style={at(3 + PROJECTS.length)} className="reveal mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[0.94rem]">
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
            <div style={at(4 + PROJECTS.length)} className="reveal mt-4 text-[0.94rem] leading-[1.75]">
              <AltPrompts
                onAsk={() => {
                  setAsking(true);
                  askRef.current?.focus();
                }}
              />
            </div>

            <div style={at(5 + PROJECTS.length)} className="reveal">
              <NowPlaying />
            </div>
          </div>

          <AskPanel ref={askRef} open={asking} onClose={() => setAsking(false)} />
        </div>

      </main>
    </>
  );
}
