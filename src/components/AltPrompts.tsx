import React, { useEffect, useMemo, useRef, useState } from 'react';

/**
 * The page's closing row: "Tell me something." and "Or ask an AI about me."
 * Each is a line of prose that IS its input. Click one and the sentence is
 * replaced in place by a single underlined field; no modal, no popover.
 *
 * Tell: anonymous, one line, posts to the same Formspree endpoint the main
 * site's contact form uses. Nothing but the message body is collected.
 *
 * Ask: the question goes to /api/ask and the answer streams in under the
 * field, in the body font, a word at a time. One question and one answer are
 * on screen at once; asking again replaces them. No bubbles and no thread, so
 * the page never turns into a chat window.
 *
 * Every state of the row is mounted at once and stacked in a single grid cell,
 * so switching between them is a fade with no mount flash and no reflow.
 */

const ENDPOINT = 'https://formspree.io/f/xgvarknn';
const ASK_ENDPOINT = '/api/ask';
const MAX_QUESTION = 400;

const HINTS = [
  'What did he do at Apple?',
  'What is he looking for?',
  'What is fig?',
  'What has he built with voice agents?',
];

const NOTES: Record<string, string> = {
  slow: 'One at a time. Give it a few seconds.',
  limit: "That's all for today. Email works too: conner@lucence.so",
  blocked: 'Not taking more questions right now.',
  fail: "Couldn't get an answer just now. Try again in a bit.",
};

type Mode = 'closed' | 'tell' | 'sending' | 'sent' | 'ask';
type Turn = { q: string; a: string };

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
const LINK =
  'text-stone-900 underline decoration-stone-300 underline-offset-[3px] transition-colors hover:decoration-stone-600';

type Piece = { text: string; href?: string };

/** Answer text to pieces: words, plus the links the model is allowed to write. */
function pieces(raw: string): Piece[] {
  // A link still arriving shows as its plain text until the closing paren lands.
  const text = raw.replace(/\[([^\]]*)(\]\([^)]*)?$/, '$1');
  const out: Piece[] = [];
  const words = (s: string) => {
    for (const w of s.split(/(\s+)/)) {
      if (!w) continue;
      const mail = /^([\w.+-]+@[\w-]+\.[\w.-]*\w)(\W*)$/.exec(w);
      if (mail) {
        out.push({ text: mail[1], href: `mailto:${mail[1]}` });
        if (mail[2]) out.push({ text: mail[2] });
      } else out.push({ text: w });
    }
  };
  const re = /\[([^\]]+)\]\(((?:https?:\/\/|mailto:)[^)\s]+)\)/g;
  let last = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    words(text.slice(last, m.index));
    out.push({ text: m[1], href: m[2] });
    last = m.index + m[0].length;
  }
  words(text.slice(last));
  return out;
}

const AltPrompts: React.FC = () => {
  const [mode, setMode] = useState<Mode>('closed');
  const [value, setValue] = useState('');
  const [question, setQuestion] = useState('');
  const [asked, setAsked] = useState('');
  const [answer, setAnswer] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState(0);
  const tellRef = useRef<HTMLInputElement>(null);
  const askRef = useRef<HTMLInputElement>(null);
  const history = useRef<Turn[]>([]);
  const abort = useRef<AbortController | null>(null);

  const isClosed = mode === 'closed';
  const isTell = mode === 'tell' || mode === 'sending';
  const isSent = mode === 'sent';
  const isAsk = mode === 'ask';
  const showAnswer = isAsk && !!asked;

  // Focus lands a frame after the fade starts so the caret doesn't appear
  // before the field it belongs to.
  useEffect(() => {
    const el = mode === 'tell' ? tellRef.current : mode === 'ask' ? askRef.current : null;
    if (!el) return;
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

  useEffect(() => () => abort.current?.abort(), []);

  function close() {
    abort.current?.abort();
    setMode('closed');
    setValue('');
    setQuestion('');
    setBusy(false);
    tellRef.current?.blur();
    askRef.current?.blur();
    // The answer is cleared after it has faded, so it doesn't blink out.
    setTimeout(() => {
      setAsked('');
      setAnswer('');
      setNote('');
    }, 200);
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

  async function ask() {
    const q = question.trim();
    if (!q || busy) return;
    abort.current?.abort();
    const ctl = new AbortController();
    abort.current = ctl;
    setBusy(true);
    setAsked(q);
    setAnswer('');
    setNote('');
    setQuestion('');
    let text = '';
    try {
      const res = await fetch(ASK_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q, history: history.current }),
        signal: ctl.signal,
      });
      if (!res.ok || !res.body) {
        const code = await res.json().then((j) => j.code as string).catch(() => '');
        setNote(NOTES[code] || NOTES.fail);
      } else {
        const reader = res.body.getReader();
        const dec = new TextDecoder();
        for (;;) {
          const { done, value: chunk } = await reader.read();
          if (done) break;
          text += dec.decode(chunk, { stream: true });
          setAnswer(text);
        }
        if (text.trim()) history.current = [...history.current, { q, a: text }].slice(-3);
        else setNote(NOTES.fail);
      }
    } catch {
      if (ctl.signal.aborted) return;
      if (!text) setNote(NOTES.fail);
    }
    setBusy(false);
  }

  const shown = useMemo(() => pieces(note || answer), [note, answer]);

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
            onClick={() => {
              setHint((h) => (h + 1) % HINTS.length);
              setMode('ask');
            }}
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

        {/* Ask: the same field, a different destination. */}
        <div className={`${LAYER} ${isAsk ? SHOWN : HIDDEN}`} aria-hidden={!isAsk}>
          <div className="relative flex items-center gap-3 pb-1">
            {rule(isAsk)}
            <input
              ref={askRef}
              value={question}
              maxLength={MAX_QUESTION}
              tabIndex={isAsk ? 0 : -1}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') close();
                if (e.key === 'Enter') {
                  e.preventDefault();
                  void ask();
                }
              }}
              placeholder={asked ? 'Ask another.' : HINTS[hint]}
              aria-label="Ask a question about Conner"
              enterKeyHint="send"
              className={FIELD}
            />
            <div className="flex shrink-0 items-center gap-3 font-mono text-[0.65rem] text-stone-400">
              <button type="button" tabIndex={isAsk ? 0 : -1} onClick={close} className="transition-colors hover:text-stone-600">
                esc
              </button>
              <button
                type="button"
                tabIndex={isAsk ? 0 : -1}
                onClick={() => void ask()}
                disabled={!question.trim() || busy}
                className="transition-colors hover:text-stone-800 disabled:opacity-40"
              >
                ask ↵
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* The answer. The 0fr → 1fr row is what lets the space open and close
          smoothly without knowing the answer's height; after that it simply
          grows a line at a time as the words arrive. */}
      <div
        className={`grid transition-[grid-template-rows,opacity] ease-out motion-reduce:transition-none ${
          showAnswer ? 'grid-rows-[1fr] opacity-100 duration-300' : 'grid-rows-[0fr] opacity-0 duration-150'
        }`}
      >
        <div className="overflow-hidden">
          <p key={`q-${asked}`} className="ask-word pt-3 text-[0.8rem] leading-[1.6] text-stone-400">
            {asked}
          </p>
          <p aria-live="polite" className={`pt-0.5 ${note ? 'text-stone-500' : 'text-stone-700'}`}>
            {shown.map((p, i) =>
              p.href ? (
                <a
                  key={`${asked}-${i}`}
                  href={p.href}
                  target={p.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noreferrer"
                  className={`ask-word ${LINK}`}
                >
                  {p.text}
                </a>
              ) : /^\s+$/.test(p.text) ? (
                ' '
              ) : (
                <span key={`${asked}-${i}`} className="ask-word">
                  {p.text}
                </span>
              )
            )}
            {/* Holds the line open in the half second before the first word. */}
            {!shown.length && <span className="invisible">.</span>}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AltPrompts;
