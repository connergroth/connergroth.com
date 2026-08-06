import React, { useEffect, useRef, useState } from 'react';

/**
 * "Tell me something." — a line of prose that IS the input.
 *
 * Click it and the sentence is replaced in place by a single underlined field;
 * no modal, no layout jump (the closed and open states are the same height).
 * Esc closes, Enter or Cmd/Ctrl+Enter sends. Anonymous by design: nothing but
 * the message body is collected, so there is no name/email to ask for.
 *
 * Posts to the same Formspree endpoint the main site's contact form uses.
 */

const ENDPOINT = 'https://formspree.io/f/xgvarknn';

type State = 'closed' | 'open' | 'sending' | 'sent';

/**
 * `onExpandedChange` tells the parent when this owns the whole row, so the
 * sibling link sharing that line can step aside while the field is open.
 */
const AltTellMe: React.FC<{ onExpandedChange?: (expanded: boolean) => void }> = ({
  onExpandedChange,
}) => {
  const [state, setState] = useState<State>('closed');
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state === 'open') inputRef.current?.focus();
  }, [state]);

  useEffect(() => {
    onExpandedChange?.(state !== 'closed');
  }, [state, onExpandedChange]);

  // "sent" is a transient confirmation, not a dead end — it falls back to the
  // original sentence so the page doesn't keep a receipt on screen forever.
  useEffect(() => {
    if (state !== 'sent') return;
    const t = setTimeout(() => {
      setState('closed');
      setValue('');
    }, 3200);
    return () => clearTimeout(t);
  }, [state]);

  async function send() {
    const message = value.trim();
    if (!message || state === 'sending') return;
    setState('sending');
    try {
      await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, source: 'connergroth.com /alt — anonymous' }),
      });
    } catch {
      // Swallowed on purpose. A failed send here is not worth an error state on
      // a page like this; the message is one line and the sender can retry.
    }
    setState('sent');
  }

  if (state === 'closed') {
    return (
      <button
        type="button"
        onClick={() => setState('open')}
        className="text-stone-700 underline decoration-stone-300 decoration-1 underline-offset-4 transition-colors hover:decoration-stone-500"
      >
        Tell me something.
      </button>
    );
  }

  if (state === 'sent') {
    return <span className="text-stone-500">Got it. Thanks.</span>;
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 border-b border-stone-300 pb-1">
        <input
          ref={inputRef}
          value={value}
          disabled={state === 'sending'}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setState('closed');
              setValue('');
            }
            if (e.key === 'Enter') {
              e.preventDefault();
              void send();
            }
          }}
          placeholder="Responses are anonymous."
          aria-label="Tell me something (anonymous)"
          className="w-full bg-transparent text-[0.94rem] leading-[1.75] text-stone-800 placeholder:text-stone-400 focus:outline-none disabled:opacity-50"
        />
        <div className="flex shrink-0 items-center gap-3 font-mono text-[0.65rem] text-stone-400">
          <button
            type="button"
            onClick={() => {
              setState('closed');
              setValue('');
            }}
            className="transition-colors hover:text-stone-600"
          >
            esc
          </button>
          <button
            type="button"
            onClick={() => void send()}
            disabled={!value.trim() || state === 'sending'}
            className="transition-colors hover:text-stone-800 disabled:opacity-40"
          >
            {state === 'sending' ? 'sending' : 'send ↵'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AltTellMe;
