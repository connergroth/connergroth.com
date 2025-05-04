import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Menu, X, Github, Linkedin, Mail } from 'lucide-react';

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
  const [logoSrc] = useState('/assets/logos/handwritten.png');
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
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#projects", label: "Projects" },
    { href: "#contact", label: "Contact" }
  ];

  const socialLinks = [
    { href: "https://github.com/connergroth", label: "GitHub", icon: <Github className="w-6 h-6" /> },
    { href: "https://linkedin.com/in/connergroth", label: "LinkedIn", icon: <Linkedin className="w-6 h-6" /> },
    { href: "mailto:connergroth@gmail.com", label: "Email", icon: <Mail className="w-6 h-6" /> }
  ];

  return (
    <>
      <header 
        className={cn(
          'fixed top-0 left-0 right-0 h-16 z-50 transition-all duration-300',
          'flex items-center justify-between px-4 md:px-8 lg:px-12',
          isScrolled ? 'bg-[#000]' : 'bg-transparent'
        )}
      >
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img 
              src={logoSrc} 
              alt="Conner Groth" 
              className="h-10 w-auto object-contain"
            />
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <a 
              key={link.label}
              href={link.href} 
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
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
                className="text-xl font-medium text-white hover:text-primary transition-colors"
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
                  className="text-gray-400 hover:text-white transition-colors"
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                  onClick={closeMobileMenu}
                >
                  {link.icon}
                </a>
              ))}
            </div>
            
            {/* Mobile email display */}
            <p className="text-gray-500 text-sm mt-4">connergroth@gmail.com</p>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header; 