import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Menu, X, Github, Linkedin, Instagram } from 'lucide-react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/work", label: "Work" },
    { href: "/projects", label: "Projects" },
    // { href: "/startup", label: "Startup" },
    { href: "/contact", label: "Contact" }
  ];

  const socialLinks = [
    { href: "https://github.com/connergroth", label: "GitHub", icon: <Github className="w-5 h-5" /> },
    { href: "https://linkedin.com/in/connergroth", label: "LinkedIn", icon: <Linkedin className="w-5 h-5" /> },
    { href: "https://instagram.com/connergroth", label: "Instagram", icon: <Instagram className="w-5 h-5" /> }
  ];

  return (
    <>
      {/* Desktop Header */}
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50',
          'hidden md:flex items-start justify-between px-8 lg:px-12 pt-6',
          'bg-transparent'
        )}
      >
        {/* CG Branding - top left */}
        <Link to="/" className="flex items-center">
          <span className={cn(
            'font-serif font-bold text-2xl tracking-tight transition-colors',
            isHome ? 'text-black/70 hover:text-black' : 'text-gray-300 hover:text-primary'
          )}>
            <span style={{ letterSpacing: '0.01em' }}>C</span>G
          </span>
        </Link>

        {/* Nav Links + Socials - stacked vertically in top right */}
        <div className="flex flex-col items-end gap-1 py-2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={cn(
                'text-sm font-medium transition-colors leading-tight',
                location.pathname === link.href
                  ? 'text-primary'
                  : isHome
                    ? 'text-black/40 hover:text-black'
                    : 'text-gray-400 hover:text-primary'
              )}
            >
              {link.label.toUpperCase()}
            </Link>
          ))}
          <div className="flex items-center gap-3 mt-3">
            <a href="https://linkedin.com/in/connergroth" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <img src={isHome ? '/assets/links/linkedinblack.png' : '/assets/links/linkedin-app-white-icon.webp'} alt="LinkedIn" className={cn('object-contain transition-opacity', isHome ? 'w-5 h-5 opacity-30 hover:opacity-70' : 'w-3 h-3 opacity-60 hover:opacity-100')} />
            </a>
            <a href="https://github.com/connergroth" target="_blank" rel="noreferrer" aria-label="GitHub">
              <img src={isHome ? '/assets/links/githubblack.png' : '/assets/links/github.png'} alt="GitHub" className={cn('object-contain transition-opacity', isHome ? 'w-3 h-3 opacity-30 hover:opacity-70' : 'w-4 h-4 opacity-60 hover:opacity-100')} />
            </a>
            <a href="https://x.com/connergroth1" target="_blank" rel="noreferrer" aria-label="X">
              <svg className={cn('w-3.5 h-3.5 transition-opacity', isHome ? 'opacity-30 hover:opacity-70' : 'opacity-60 hover:opacity-100')} viewBox="0 0 24 24" fill={isHome ? 'black' : 'white'}>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Header Bar */}
      <header
        className={cn(
          'md:hidden fixed top-0 left-0 right-0 h-16 z-50',
          'flex items-center justify-between px-4',
          'transition-all duration-300',
          scrolled ? (isHome ? 'bg-white/70 backdrop-blur-sm' : 'bg-black/70 backdrop-blur-sm') : 'bg-transparent'
        )}
      >
        <Link to="/" className="flex items-center">
          <span className={cn(
            'font-serif font-bold text-2xl tracking-tight transition-colors',
            isHome ? 'text-black/70' : 'text-white'
          )}>
            <span style={{ letterSpacing: '0.01em' }}>C</span>G
          </span>
        </Link>

        <button
          onClick={toggleMobileMenu}
          className={cn(
            'flex items-center justify-center p-2 rounded-md focus:outline-none transition-colors',
            isHome ? 'text-black/70' : 'text-white hover:text-primary'
          )}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu */}
      <div
        className={`md:hidden mobile-menu ${mobileMenuOpen ? 'open' : 'closed'}`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="flex flex-col h-full justify-center items-center">
          <nav className="flex flex-col space-y-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={cn(
                  'text-xl font-medium transition-colors',
                  location.pathname === link.href
                    ? 'text-primary'
                    : 'text-gray-300 hover:text-primary'
                )}
                onClick={closeMobileMenu}
              >
                {link.label}
              </Link>
            ))}

            {/* Social Links in Mobile Menu */}
            <div className="pt-8 flex justify-center items-center gap-6 mt-4 border-t border-gray-800 w-64">
              <a href="https://linkedin.com/in/connergroth" target="_blank" rel="noreferrer" aria-label="LinkedIn" onClick={closeMobileMenu}>
                <img src="/assets/links/linkedin-app-white-icon.webp" alt="LinkedIn" className="w-5 h-5 object-contain opacity-60 hover:opacity-100 transition-opacity" />
              </a>
              <a href="https://github.com/connergroth" target="_blank" rel="noreferrer" aria-label="GitHub" onClick={closeMobileMenu}>
                <img src="/assets/links/github.png" alt="GitHub" className="w-6 h-6 object-contain opacity-60 hover:opacity-100 transition-opacity" />
              </a>
              <a href="https://x.com/connergroth1" target="_blank" rel="noreferrer" aria-label="X" onClick={closeMobileMenu}>
                <svg className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="white">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>

            <a href="mailto:conner@connergroth.com" className="text-gray-300 hover:text-primary text-sm mt-4 transition-colors">conner@connergroth.com</a>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;
