import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { Menu, X, Github, Linkedin, Instagram } from 'lucide-react';

const useHeaderShrink = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 96);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return isScrolled;
};

const Header = () => {
  const isScrolled = useHeaderShrink();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Handle body scroll lock when mobile menu is open
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

  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#work", label: "Work" },
    { href: "#projects", label: "Projects" },
    { href: "#fly-on-the-wall", label: "Studio" },
    { href: "#contact", label: "Contact" }
  ];

  const socialLinks = [
    { href: "https://github.com/connergroth", label: "GitHub", icon: <Github className="w-6 h-6" /> },
    { href: "https://linkedin.com/in/connergroth", label: "LinkedIn", icon: <Linkedin className="w-6 h-6" /> },
    { href: "https://instagram.com/connergroth", label: "Instagram", icon: <Instagram className="w-6 h-6" /> }
  ];

  return (
    <>
      <header 
        className={cn(
          'absolute top-0 left-0 right-0 h-16 z-50',
          'flex items-center justify-between px-4 md:px-8 lg:px-12',
          'bg-transparent'
        )}
      >
        <div className="flex items-center">
          <a href="#about" className="flex items-center">
            <span className="font-serif font-bold text-2xl tracking-tight text-gray-300 md:text-gray-300 text-white">
              <span style={{ letterSpacing: '0.01em' }}>C</span>G
            </span>
          </a>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <a 
              key={link.label}
              href={link.href} 
              className="text-sm font-medium text-gray-300 hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden flex items-center justify-center p-2 rounded-md text-white hover:text-primary focus:outline-none"
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
              <a 
                key={link.label}
                href={link.href} 
                className="text-xl font-medium text-gray-300 hover:text-primary transition-colors"
                onClick={closeMobileMenu}
              >
                {link.label}
              </a>
            ))}
            
            {/* Social Links in Mobile Menu */}
            <div className="pt-8 flex justify-center gap-8 mt-4 border-t border-gray-800 w-64">
              {socialLinks.map((link) => (
                <a 
                  key={link.label}
                  href={link.href}
                  className="text-gray-300 hover:text-primary transition-colors"
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                  onClick={closeMobileMenu}
                >
                  {link.icon}
                </a>
              ))}
            </div>
            
            {/* Mobile instagram handle display */}
            <p className="text-gray-300 text-sm mt-4">connergroth@gmail.com</p>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header; 