import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search,
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  FileText,
} from 'lucide-react';

const OpenAIIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v3l-2.597 1.5-2.607-1.5z"/>
  </svg>
);

const ClaudeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M4.709 15.955l4.72-2.647.079-.23-.079-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.146-.103.018-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 0 1-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z"/>
  </svg>
);

interface Item {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  group: string;
}

const LLMS_URL = 'https://connergroth.com/llms.txt';

function buildItems(onClose: () => void): Item[] {
  return [
    // Navigation
    // Ask AI
    {
      id: 'chatgpt',
      label: 'Open in ChatGPT',
      icon: <OpenAIIcon />,
      group: 'Ask AI',
      action() {
        window.open(`https://chatgpt.com/?hints=search&q=${encodeURIComponent(`Read ${LLMS_URL} and tell me about Conner Groth`)}`, '_blank');
        onClose();
      },
    },
    {
      id: 'claude',
      label: 'Open in Claude',
      icon: <ClaudeIcon />,
      group: 'Ask AI',
      action() {
        window.open(
          `https://claude.ai/new?q=${encodeURIComponent(`Read ${LLMS_URL} and tell me about Conner Groth`)}`,
          '_blank'
        );
        onClose();
      },
    },
    {
      id: 'markdown',
      label: 'Open as Markdown',
      icon: <FileText size={14} />,
      group: 'Ask AI',
      action() {
        window.open('/llms.txt', '_blank');
        onClose();
      },
    },
    // Navigate
    { id: 'home', label: 'Home', icon: <ArrowRight size={14} />, group: 'Navigate', action() { window.location.href = '/'; onClose(); } },
    { id: 'work', label: 'Work', icon: <ArrowRight size={14} />, group: 'Navigate', action() { window.location.href = '/work'; onClose(); } },
    // Links
    { id: 'github', label: 'GitHub', icon: <Github size={14} />, group: 'Links', action() { window.open('https://github.com/connergroth', '_blank'); onClose(); } },
    { id: 'linkedin', label: 'LinkedIn', icon: <Linkedin size={14} />, group: 'Links', action() { window.open('https://linkedin.com/in/connergroth', '_blank'); onClose(); } },
    { id: 'email', label: 'Email', icon: <Mail size={14} />, group: 'Links', action() { window.location.href = 'mailto:conner@lucence.so'; onClose(); } },
    { id: 'resume', label: 'Resume', icon: <FileText size={14} />, group: 'Links', action() { window.open('/assets/documents/Conner-Groth-Resume.pdf', '_blank'); onClose(); } },
  ];
}

const CommandPalette = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [query, setQuery] = useState('');
  const [sel, setSel] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = buildItems(onClose);

  const filtered = query
    ? items.filter(
        (i) =>
          i.label.toLowerCase().includes(query.toLowerCase()) ||
          i.group.toLowerCase().includes(query.toLowerCase())
      )
    : items;

  const groups: Record<string, Item[]> = {};
  for (const item of filtered) {
    (groups[item.group] ??= []).push(item);
  }

  useEffect(() => {
    const lenis = (window as any).__lenis;
    if (open) {
      setMounted(true);
      setQuery('');
      setSel(0);
      lenis?.stop();
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setVisible(false);
      document.body.style.overflow = '';
      lenis?.start();
      const t = setTimeout(() => setMounted(false), 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => setSel(0), [query]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSel((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSel((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && filtered[sel]) {
        e.preventDefault();
        filtered[sel].action();
      } else if (e.key === 'Escape') {
        onClose();
      }
    },
    [filtered, sel, onClose]
  );

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[100]" onClick={onClose}>
      {/* Backdrop — fades independently */}
      <div
        className="absolute inset-0 bg-stone-900/20 transition-opacity duration-200"
        style={{ opacity: visible ? 1 : 0, backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
      />

      {/* Content container */}
      <div
        className="relative flex items-start justify-center pt-[30vh] transition-opacity duration-200"
        style={{ opacity: visible ? 1 : 0 }}
      >

      {/* Palette */}
      <div
        className="relative w-full max-w-md mx-4 bg-[#FBFBFA] border border-stone-200 rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_48px_-12px_rgba(28,25,23,0.18)] overflow-hidden transition-all duration-200"
        style={{
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.98)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-stone-200/70">
          <Search size={14} className="text-stone-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-sm text-stone-800 placeholder:text-stone-400 outline-none"
          />
          <kbd className="hidden sm:flex items-center px-1.5 py-0.5 text-[0.55rem] text-stone-400 border border-stone-200 rounded font-mono">
            esc
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[320px] overflow-y-auto overscroll-contain py-1" onWheel={(e) => e.stopPropagation()}>
          {filtered.length === 0 && (
            <p className="text-center text-sm text-stone-400 py-8">
              No results found.
            </p>
          )}

          {Object.entries(groups).map(([group, groupItems]) => (
            <div key={group}>
              <p className="px-4 pt-3 pb-1.5 text-[0.7rem] text-stone-400">
                {group}
              </p>
              {groupItems.map((item) => {
                const idx = filtered.indexOf(item);
                return (
                  <button
                    key={item.id}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors duration-100 ${
                      idx === sel
                        ? 'bg-stone-100 text-stone-900'
                        : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
                    }`}
                    onClick={item.action}
                    onMouseEnter={() => setSel(idx)}
                  >
                    <span className="text-stone-400">{item.icon}</span>
                    <span className="text-[0.85rem]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};

export default CommandPalette;
