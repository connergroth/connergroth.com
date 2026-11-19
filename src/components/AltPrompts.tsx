import React, { useEffect, useRef, useState } from 'react';

/**
 * The page's closing row: "Tell me something." and "Or ask an AI about me."
 *
 * Tell is a line of prose that IS its input: click it and the sentence is
 * replaced in place by a single underlined field; no modal, no popover.
 * Anonymous, one line, posts to the same Formspree endpoint the main site's
 * contact form uses. Nothing but the message body is collected.
 *
 * Ask hands off to the page (AskPanel), which fades everything else out.
 *
 * Every state of the row is mounted at once and stacked in a single grid cell,
 * so switching between them is a fade with no mount flash and no reflow.
 */

const ENDPOINT = 'https://formspree.io/f/xgvarknn';

type Mode = 'closed' | 'tell' | 'sending' | 'sent';

/**
 * Fade THROUGH, not cross-dissolve. The layers sit in the same grid cell, so
 * overlapping their fades double-exposes two lines of text on top of each
 * other for ~100ms, which reads as a flash. The outgoing layer clears out fast
 * and the incoming one only starts after it's gone.
 */
const LAYER =
  'col-start-1 row-start-1 transition-[opacity,transform] ease-out motion-reduce:transition-none motion-reduce:delay-0';
const HIDDEN = 'pointer-events-none opacity-0 translate-y-[2px] duration-100';
const SHOWN = 'opacity-100 translate-y-0 duration-150 delay-[110ms]';

const FIELD =
  'w-full bg-transparent text-[0.94rem] leading-[1.75] text-stone-800 placeholder:text-stone-400 read-only:opacity-50 focus:outline-none';

const AltPrompts: React.FC<{ onAsk: () => void }> = ({ onAsk }) => {
  const [mode, setMode] = useState<Mode>('closed');
  const [value, setValue] = useState('');
  const tellRef = useRef<HTMLInputElement>(null);

  const isClosed = mode === 'closed';
  const isTell = mode === 'tell' || mode === 'sending';
  const isSent = mode === 'sent';

  // Focus lands a frame after the fade starts so the caret doesn't appear
  // before the field it belongs to.
  useEffect(() => {
    if (mode !== 'tell' || !tellRef.current) return;
    const el = tellRef.current;
    const t = requestAnimationFrame(() => el.focus());
    return () => cancelAnimationFrame(t);
  }, [mode]);

  // "sent" is a transient confirmation: it falls back to the original sentence
  // so the page doesn't keep a receipt on screen forever.
  useEffect(() => {
    if (!isSent) return;
    const t = setTimeout(() => {
      setMode('closed');
      setValue('');
    }, 3200);
    return () => clearTimeout(t);
  }, [isSent]);

  function close() {
    setMode('closed');
    setValue('');
    tellRef.current?.blur();
  }

  async function send() {
    const message = value.trim();
    if (!message || mode === 'sending') return;
    setMode('sending');
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
    setMode('sent');
  }

  const rule = (on: boolean) => (
    /* The rule wipes in from the left rather than appearing all at once, which
       is what sells it as the sentence turning into an input. */
    <span
      className={`absolute inset-x-0 bottom-0 h-px origin-left bg-stone-300 transition-transform ease-out motion-reduce:transition-none motion-reduce:delay-0 ${
        on ? 'scale-x-100 duration-300 delay-[110ms]' : 'scale-x-0 duration-150'
      }`}
    />
  );

  return (
    <div>
      <div className="grid w-full items-center">
        {/* Closed: the two sentences. The AI one stays a shade quieter so the
            line still has a primary. */}
        <div
          className={`${LAYER} flex flex-wrap items-baseline gap-x-3 gap-y-1 ${isClosed ? SHOWN : HIDDEN}`}
          aria-hidden={!isClosed}
        >
          <button
            type="button"
            tabIndex={isClosed ? 0 : -1}
            onClick={() => setMode('tell')}
            className="text-stone-700 underline decoration-stone-300 decoration-1 underline-offset-4 transition-colors hover:decoration-stone-500"
          >
            Tell me something.
          </button>
          <button
            type="button"
            tabIndex={isClosed ? 0 : -1}
            onClick={onAsk}
            className="text-stone-500 underline decoration-stone-300 decoration-1 underline-offset-4 transition-colors hover:text-stone-900 hover:decoration-stone-500"
          >
            Or ask an AI about me.
          </button>
        </div>

        {/* Tell: the field. */}
        <div className={`${LAYER} ${isTell ? SHOWN : HIDDEN}`} aria-hidden={!isTell}>
          <div className="relative flex items-center gap-3 pb-1">
            {rule(isTell)}
            <input
              ref={tellRef}
              value={value}
              tabIndex={isTell ? 0 : -1}
              readOnly={mode === 'sending'}
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
              className={FIELD}
            />
            <div className="flex shrink-0 items-center gap-3 font-mono text-[0.65rem] text-stone-400">
              <button type="button" tabIndex={isTell ? 0 : -1} onClick={close} className="transition-colors hover:text-stone-600">
                esc
              </button>
              <button
                type="button"
                tabIndex={isTell ? 0 : -1}
                onClick={() => void send()}
                disabled={!value.trim() || mode === 'sending'}
                className="transition-colors hover:text-stone-800 disabled:opacity-40"
              >
                {mode === 'sending' ? 'sending' : 'send ↵'}
              </button>
            </div>
          </div>
        </div>

        {/* Sent: the receipt. */}
        <div className={`${LAYER} ${isSent ? SHOWN : HIDDEN}`} aria-hidden={!isSent}>
          <span className="text-stone-500">Got it. Thanks.</span>
        </div>
      </div>
    </div>
  );
};

export default AltPrompts;
