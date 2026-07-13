import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import CommandPalette from './CommandPalette';

const navLinks = [
  { href: '/work', label: 'work' },
];

const Header = () => {
  const [cmdOpen, setCmdOpen] = useState(false);
  const location = useLocation();

  // ⌘K / Ctrl+K global shortcut + on-page triggers
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    };
    const openHandler = () => setCmdOpen(true);
    window.addEventListener('keydown', handler);
    window.addEventListener('cmdk:open', openHandler);
    return () => {
      window.removeEventListener('keydown', handler);
      window.removeEventListener('cmdk:open', openHandler);
    };
  }, []);

  const isActive = (href: string) => {
    if (href === '/work') return location.pathname.startsWith('/work');
    return false;
  };

  return (
    <>
      <header className="fixed top-2 left-2 right-2 md:top-3 md:left-3 md:right-3 z-50 rounded-t-xl md:rounded-t-2xl bg-[#FBFBFA]/85 backdrop-blur-md border-b border-stone-200/70" style={{ willChange: 'auto' }}>
        <div className="max-w-[680px] mx-auto flex items-center justify-between px-6 py-3.5">
          <Link
            to="/"
            className="text-[0.8rem] text-stone-500 hover:text-stone-900 transition-colors"
          >
            conner groth
          </Link>

          {/* Nav + search trigger */}
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-[0.8rem] active:translate-y-px transition-colors duration-200 ${
                  isActive(link.href)
                    ? 'text-stone-900'
                    : 'text-stone-400 hover:text-stone-900'
                }`}
              >
                {link.label}
              </a>
            ))}

            <button
              onClick={() => setCmdOpen(true)}
              aria-label="Open command palette"
              className="flex items-center gap-1.5 pl-2.5 pr-2.5 sm:pr-[5px] py-[5px] bg-white border border-stone-200 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_5px_rgba(0,0,0,0.07)] active:translate-y-px active:shadow-none transition-all ml-2"
            >
              <Search size={13} strokeWidth={2.5} className="text-stone-500" />
              <span className="hidden sm:flex items-center gap-1">
                <kbd className="flex h-[19px] w-[19px] items-center justify-center rounded-[6px] bg-gradient-to-b from-white to-stone-100 font-sans text-[0.72rem] leading-none text-stone-500 shadow-[0_1px_2px_rgba(28,25,23,0.16),inset_0_1px_0_#fff]">
                  ⌘
                </kbd>
                <kbd className="flex h-[19px] w-[19px] items-center justify-center rounded-[6px] bg-gradient-to-b from-white to-stone-100 font-sans text-[0.68rem] leading-none text-stone-500 shadow-[0_1px_2px_rgba(28,25,23,0.16),inset_0_1px_0_#fff]">
                  K
                </kbd>
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* Command palette */}
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </>
  );
};

export default Header;
