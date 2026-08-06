import React, { useEffect, useRef, useState } from 'react';

/**
 * "Tell me something." — a line of prose that IS the input.
 *
 * Click it and the sentence is replaced in place by a single underlined field;
 * no modal, no layout jump. Esc closes, Enter sends. Anonymous by design:
 * nothing but the message body is collected.
 *
 * All three states (closed / open / sent) are mounted at once and stacked in a
 * single grid cell, so switching between them is a pure cross-fade — no
 * mount-unmount flash, and no reflow, because the row's height is always the
 * tallest state. The sibling link that shares this row is passed in as
 * `children` and lives INSIDE the closed layer, so it fades out with the
 * sentence instead of vanishing a frame early.
 *
 * Posts to the same Formspree endpoint the main site's contact form uses.
 */

const ENDPOINT = 'https://formspree.io/f/xgvarknn';

type State = 'closed' | 'open' | 'sending' | 'sent';

/**
 * Fade THROUGH, not cross-dissolve. The layers sit in the same grid cell, so
 * overlapping their fades double-exposes two lines of text on top of each
 * other for ~100ms — which reads as a flash, not a transition. Instead the
 * outgoing layer clears out fast and the incoming one only starts after it's
 * gone, so there is never a frame with two sentences in it.
 */
const LAYER =
  'col-start-1 row-start-1 transition-[opacity,transform] ease-out motion-reduce:transition-none motion-reduce:delay-0';
const HIDDEN = 'pointer-events-none opacity-0 translate-y-[2px] duration-100';
const SHOWN = 'opacity-100 translate-y-0 duration-150 delay-[110ms]';

const AltTellMe: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<State>('closed');
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const isClosed = state === 'closed';
  const isSent = state === 'sent';
  const isOpen = state === 'open' || state === 'sending';

  // Focus lands a frame after the fade starts so the caret doesn't appear
  // before the field it belongs to.
  useEffect(() => {
    if (state !== 'open') return;
    const t = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(t);
  }, [state]);

  // "sent" is a transient confirmation, not a dead end — it falls back to the
  // original sentence so the page doesn't keep a receipt on screen forever.
  useEffect(() => {
    if (!isSent) return;
    const t = setTimeout(() => {
      setState('closed');
      setValue('');
    }, 3200);
    return () => clearTimeout(t);
  }, [isSent]);

  function close() {
    setState('closed');
    setValue('');
    inputRef.current?.blur();
  }

  async function send() {
    const message = value.trim();
    if (!message || state === 'sending') return;
    setState('sending');
    try {
      await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, source: 'connergroth.com — anonymous' }),
      });
    } catch {
      // Swallowed on purpose. A failed send here is not worth an error state on
      // a page like this; the message is one line and the sender can retry.
    }
    setState('sent');
  }

  return (
    <div className="grid w-full items-center">
      {/* Closed — the sentence, plus whatever shares its row. */}
      <div
        className={`${LAYER} flex flex-wrap items-baseline gap-x-3 gap-y-1 ${
          isClosed ? SHOWN : HIDDEN
        }`}
        aria-hidden={!isClosed}
      >
        <button
          type="button"
          tabIndex={isClosed ? 0 : -1}
          onClick={() => setState('open')}
          className="text-stone-700 underline decoration-stone-300 decoration-1 underline-offset-4 transition-colors hover:decoration-stone-500"
        >
          Tell me something.
        </button>
        {children}
      </div>

      {/* Open — the field. The rule under it wipes in from the left rather than
          appearing all at once, which is what sells it as the sentence turning
          into an input instead of one element swapping for another. */}
      <div className={`${LAYER} ${isOpen ? SHOWN : HIDDEN}`} aria-hidden={!isOpen}>
        <div className="relative flex items-center gap-3 pb-1">
          <span
            className={`absolute inset-x-0 bottom-0 h-px origin-left bg-stone-300 transition-transform ease-out motion-reduce:transition-none motion-reduce:delay-0 ${
              isOpen ? 'scale-x-100 duration-300 delay-[110ms]' : 'scale-x-0 duration-150'
            }`}
          />
          <input
            ref={inputRef}
            value={value}
            tabIndex={isOpen ? 0 : -1}
            readOnly={state === 'sending'}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') close();
              if (e.key === 'Enter') {
                e.preventDefault();
                void send();
              }
            }}
            placeholder="Responses are anonymous."
            aria-label="Tell me something (anonymous)"
            className="w-full bg-transparent text-[0.94rem] leading-[1.75] text-stone-800 placeholder:text-stone-400 read-only:opacity-50 focus:outline-none"
          />
          <div className="flex shrink-0 items-center gap-3 font-mono text-[0.65rem] text-stone-400">
            <button
              type="button"
              tabIndex={isOpen ? 0 : -1}
              onClick={close}
              className="transition-colors hover:text-stone-600"
            >
              esc
            </button>
            <button
              type="button"
              tabIndex={isOpen ? 0 : -1}
              onClick={() => void send()}
              disabled={!value.trim() || state === 'sending'}
              className="transition-colors hover:text-stone-800 disabled:opacity-40"
            >
              {state === 'sending' ? 'sending' : 'send ↵'}
            </button>
          </div>
        </div>
      </div>

      {/* Sent — the receipt. */}
      <div className={`${LAYER} ${isSent ? SHOWN : HIDDEN}`} aria-hidden={!isSent}>
        <span className="text-stone-500">Got it. Thanks.</span>
      </div>
    </div>
  );
};

export default AltTellMe;
