import React, { useState, useEffect, useRef, useCallback } from 'react';
import { OpenAIIcon, ClaudeIcon } from './BrandIcons';
import {
  Search,
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  FileText,
} from 'lucide-react';



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
