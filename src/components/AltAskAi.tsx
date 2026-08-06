import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FileText } from 'lucide-react';
import { OpenAIIcon, ClaudeIcon } from './BrandIcons';

/**
 * "Ask an AI about me" — a text link that opens a small three-choice popover.
 *
 * Deliberately NOT the command palette: on this page there is no palette to
 * open, and this is three links, so it gets three links in a card rather than a
 * full-page search UI. Each one hands the reader's own assistant the llms.txt
 * URL; nothing is proxied through this site.
 *
 * The card is PORTALED to <body> rather than living next to the trigger. The
 * trigger sits inside the prompt row's "closed" layer, which fades its opacity
 * when the row switches to the input — and an opacity on an ancestor multiplies
 * into everything under it, so an in-place card renders half-see-through (and
 * ghosts through the row) for the length of that fade. Portaling takes the card
 * out of that subtree entirely, so its own opacity is the only one that applies
 * and no ancestor can ever create a stacking context around it.
 */

const LLMS_URL = 'https://connergroth.com/llms.txt';
const PROMPT = `Read ${LLMS_URL} and tell me about Conner Groth`;

const CARD_WIDTH = 230;
const GUTTER = 16;

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
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Anchor the fixed card under the trigger, clamped inside the viewport so it
  // can't hang off the right edge on a phone — at 393px the old absolute card
  // ran 4px past the screen. If there's no room below the link it flips above,
  // which is the difference between a usable menu and one opening into the fold.
  const place = useCallback(() => {
    const t = triggerRef.current;
    if (!t) return;
    const r = t.getBoundingClientRect();
    const h = cardRef.current?.offsetHeight || 110;
    const maxLeft = window.innerWidth - CARD_WIDTH - GUTTER;
    const below = r.bottom + 8;
    const flip = below + h + GUTTER > window.innerHeight && r.top - h - 8 > GUTTER;
    setPos({
      top: flip ? r.top - h - 8 : below,
      left: Math.max(GUTTER, Math.min(r.left, maxLeft)),
    });
  }, []);

  useLayoutEffect(() => {
    if (open) place();
  }, [open, place]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    // The card is portaled, so "outside" has to mean outside BOTH nodes.
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (cardRef.current?.contains(target)) return;
      setOpen(false);
    };
    // Fixed positioning doesn't follow the page, so a scroll dismisses rather
    // than letting the card drift off its link.
    const onScroll = () => setOpen(false);
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', place);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', place);
    };
  }, [open, place]);

  const card = (
    /* Stays mounted so it can animate BOTH ways — unmounting on close makes the
       card vanish on a frame boundary instead of fading. `visibility` is in the
       transition list on purpose: it flips discretely at the END of the
       fade-out, which keeps these links out of the tab order while closed
       without cutting the animation short. Origin is top-left so the card grows
       out of the link rather than out of its own middle. */
    <div
      ref={cardRef}
      role="menu"
      aria-hidden={!open}
      style={{ top: pos.top, left: pos.left, width: CARD_WIDTH }}
      className={`fixed z-50 origin-top-left overflow-hidden rounded-md border border-stone-300/80 bg-white p-1 shadow-[0_6px_20px_rgba(28,25,23,0.12),0_1px_2px_rgba(28,25,23,0.06)] transition-[opacity,transform,visibility] duration-150 ease-out motion-reduce:transition-none ${
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
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="text-stone-500 underline decoration-stone-300 decoration-1 underline-offset-4 transition-colors hover:text-stone-900 hover:decoration-stone-500"
      >
        Or ask an AI about me.
      </button>
      {typeof document === 'undefined' ? null : createPortal(card, document.body)}
    </>
  );
};

export default AltAskAi;
