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
              className="flex items-center gap-2 px-2.5 py-1 text-stone-400 hover:text-stone-600 bg-white border border-stone-200 rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.07)] active:translate-y-px active:shadow-none transition-all ml-2"
            >
              <Search size={12} />
              <span className="hidden sm:inline font-mono text-[0.55rem] tracking-wider">⌘K</span>
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
