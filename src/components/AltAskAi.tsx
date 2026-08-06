import React, { useEffect, useRef, useState } from 'react';
import { FileText } from 'lucide-react';
import { OpenAIIcon, ClaudeIcon } from './BrandIcons';

/**
 * "Ask an AI about me" — a text link that opens a small three-choice popover.
 *
 * Deliberately NOT the command palette: on /alt there is no palette to open,
 * and this is three links, so it gets three links in a card rather than a
 * full-page search UI. Each one hands the reader's own assistant the llms.txt
 * URL; nothing is proxied through this site.
 */

const LLMS_URL = 'https://connergroth.com/llms.txt';
const PROMPT = `Read ${LLMS_URL} and tell me about Conner Groth`;

const OPTIONS = [
  {
    id: 'chatgpt',
    label: 'ChatGPT',
    icon: <OpenAIIcon />,
    href: `https://chatgpt.com/?hints=search&q=${encodeURIComponent(PROMPT)}`,
  },
  {
    id: 'claude',
    label: 'Claude',
    icon: <ClaudeIcon />,
    href: `https://claude.ai/new?q=${encodeURIComponent(PROMPT)}`,
  },
  {
    id: 'markdown',
    label: 'Read the raw markdown',
    icon: <FileText size={14} />,
    href: '/llms.txt',
  },
];

const AltAskAi: React.FC = () => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on Esc or on a click anywhere outside the card. Both listeners are
  // only mounted while open so the page costs nothing when it's closed.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="text-stone-500 underline decoration-stone-300 decoration-1 underline-offset-4 transition-colors hover:text-stone-900 hover:decoration-stone-500"
      >
        Or ask an AI about me.
      </button>

      {/* Stays mounted so it can animate BOTH ways — unmounting on close makes
          the card vanish on a frame boundary instead of fading. `visibility` is
          in the transition list on purpose: it flips discretely at the END of
          the fade-out, which keeps these links out of the tab order while
          closed without cutting the animation short. Origin is top-left so the
          card grows out of the link rather than out of its own middle. */}
      <div
        role="menu"
        aria-hidden={!open}
        className={`absolute left-0 z-20 mt-2 w-[230px] origin-top-left overflow-hidden rounded-md border border-stone-200 bg-white p-1 shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-[opacity,transform,visibility] duration-150 ease-out motion-reduce:transition-none ${
          open
            ? 'visible translate-y-0 scale-100 opacity-100'
            : 'invisible -translate-y-1 scale-[0.97] opacity-0'
        }`}
      >
        {OPTIONS.map((o) => (
          <a
            key={o.id}
            href={o.href}
            target="_blank"
            rel="noreferrer"
            role="menuitem"
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-[3px] px-2.5 py-2 font-mono text-[0.7rem] text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
          >
            <span className="shrink-0 text-stone-500">{o.icon}</span>
            {o.label}
          </a>
        ))}
      </div>
    </div>
  );
};

export default AltAskAi;
