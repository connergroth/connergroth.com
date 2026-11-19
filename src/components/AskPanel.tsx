import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';

/**
 * "Ask an AI about me", as a page of its own. Opening it fades the rest of the
 * page out and this in over the same space, so the page never gets taller and
 * nothing else is in view while someone is asking. The sky and the name stay.
 *
 * The question goes to /api/ask and the answer streams in under the field, in
 * the body font, a word at a time. One question and one answer are on screen
 * at once; asking again replaces them. No bubbles and no thread.
 */

const ASK_ENDPOINT = '/api/ask';
const MAX_QUESTION = 300;

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

type Turn = { q: string; a: string };

const FIELD =
  'w-full bg-transparent text-[0.94rem] leading-[1.75] text-stone-800 placeholder:text-stone-400 focus:outline-none';
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
        continue;
      }
      // A bare address the model wrote out: linked, shown without the scheme.
      const url = /^(https?:\/\/[^\s]*?[\w/])([.,;:!?)]*)$/.exec(w);
      if (url) {
        out.push({ text: url[1].replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''), href: url[1] });
        if (url[2]) out.push({ text: url[2] });
        continue;
      }
      out.push({ text: w });
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

export type AskHandle = { focus: () => void };

const AskPanel = forwardRef<AskHandle, { open: boolean; onClose: () => void }>(({ open, onClose }, ref) => {
  const [question, setQuestion] = useState('');
  const [asked, setAsked] = useState('');
  const [answer, setAnswer] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  // A starter question was tapped: the list and the field's hint fade out
  // before the question takes their place, instead of swapping in one frame.
  const [leaving, setLeaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const history = useRef<Turn[]>([]);
  const abort = useRef<AbortController | null>(null);

  // Called inside the tap that opens the page, so a phone raises its keyboard.
  useImperativeHandle(ref, () => ({ focus: () => inputRef.current?.focus({ preventScroll: true }) }), []);

  useEffect(() => () => abort.current?.abort(), []);

  function close() {
    abort.current?.abort();
    setQuestion('');
    setBusy(false);
    inputRef.current?.blur();
    onClose();
    // Cleared once it has faded, so the answer doesn't blink out first.
    setTimeout(() => {
      setAsked('');
      setAnswer('');
      setNote('');
    }, 260);
  }

  // Esc closes from anywhere on the page, not only from inside the field.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function ask(preset?: string) {
    const q = (preset ?? question).trim();
    if (!q || busy || leaving) return;
    if (preset && !asked) {
      setLeaving(true);
      await new Promise((r) => setTimeout(r, 170));
      setLeaving(false);
    }
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

  return (
    <div
      aria-hidden={!open}
      className={`absolute inset-x-0 top-0 pt-7 text-[0.94rem] leading-[1.75] transition-opacity ease-out motion-reduce:transition-none motion-reduce:delay-0 ${
        open ? 'opacity-100 duration-300 delay-[200ms]' : 'pointer-events-none opacity-0 duration-150'
      }`}
    >
      <div className="relative flex items-center gap-3 pb-1">
        {/* The rule wipes in from the left, the same way the "Tell me something" field does. */}
        <span
          className={`absolute inset-x-0 bottom-0 h-px origin-left bg-stone-300 transition-transform ease-out motion-reduce:transition-none motion-reduce:delay-0 ${
            open ? 'scale-x-100 duration-500 delay-[240ms]' : 'scale-x-0 duration-150'
          }`}
        />
        <input
          ref={inputRef}
          value={question}
          maxLength={MAX_QUESTION}
          tabIndex={open ? 0 : -1}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              void ask();
            }
          }}
          placeholder={asked ? 'Ask another.' : 'Ask anything about Conner.'}
          aria-label="Ask a question about Conner"
          enterKeyHint="send"
          className={`${FIELD} placeholder:transition-opacity placeholder:duration-150 ${leaving ? 'placeholder:opacity-0' : ''}`}
        />
        <div className="flex shrink-0 items-center gap-3 font-mono text-[0.65rem] text-stone-400">
          <button type="button" tabIndex={open ? 0 : -1} onClick={close} className="transition-colors hover:text-stone-600">
            back
          </button>
          <button
            type="button"
            tabIndex={open ? 0 : -1}
            onClick={() => void ask()}
            disabled={!question.trim() || busy}
            className="transition-colors hover:text-stone-800 disabled:opacity-40"
          >
            ask ↵
          </button>
        </div>
      </div>

      {asked ? (
        <div>
          <p key={`q-${asked}`} className="ask-word pt-4 text-[0.8rem] leading-[1.6] text-stone-400">
            {asked}
          </p>
          <p aria-live="polite" className={`pt-1 ${note ? 'text-stone-500' : 'text-stone-700'}`}>
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
      ) : (
        /* An empty page with one field is a hard place to start, so it opens
           with a few things worth asking. They go once a question is asked. */
        <ul
          className={`pt-4 space-y-1 text-[0.8rem] leading-[1.6] text-stone-400 transition-opacity duration-150 ease-out motion-reduce:transition-none ${
            leaving ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {HINTS.map((h) => (
            <li key={h}>
              <button
                type="button"
                tabIndex={open ? 0 : -1}
                onClick={() => void ask(h)}
                className="text-left transition-colors hover:text-stone-700"
              >
                {h}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
AskPanel.displayName = 'AskPanel';

export default AskPanel;
