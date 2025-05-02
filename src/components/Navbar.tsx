import React, { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun, ChevronRight } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../lib/utils';

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHidden, setIsHidden] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if scrolled down past threshold
      if (currentScrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      // Hide/show navbar based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = !mobileMenuOpen ? 'hidden' : 'auto';
  };

  const closeMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleNavClick = (sectionId: string) => {
    closeMenu();
    const element = document.getElementById(sectionId);
    if (element) {
      // Smooth scroll to section
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Desktop & Mobile Navbar */}
      <nav 
        className={cn(
          'sticky-header transition-transform duration-300 py-4 px-6 md:px-12 flex items-center justify-between',
          isScrolled ? 'shadow-sm' : '',
          isHidden ? 'header-hidden' : ''
        )}
      >
        <a 
          href="#" 
          className="text-2xl font-bold text-gradient"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          Conner Groth
        </a>
        
        <div className="flex items-center gap-4">
          {/* Desktop Nav Links - Hidden on Mobile */}
          <ul className="hidden md:flex items-center gap-6">
            {['about', 'experience', 'skills', 'projects', 'contact'].map((item) => (
              <li key={item}>
                <button 
                  onClick={() => handleNavClick(item)}
                  className="text-foreground/80 hover:text-foreground transition-colors capitalize px-2 py-1"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
          
          {/* Theme Toggle */}
          <button 
            className="p-2 rounded-full hover:bg-muted transition-colors"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {/* Mobile Menu Button - Hidden on Desktop */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-muted transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
      
      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : 'closed'}`}>
        <div className="h-full flex flex-col justify-center items-center p-8">
          <ul className="flex flex-col items-center gap-8 text-2xl">
            {['about', 'experience', 'skills', 'projects', 'contact'].map((item) => (
              <li key={item} className="w-full">
                <button 
                  onClick={() => handleNavClick(item)}
                  className="flex items-center justify-between w-full py-2 group"
                >
                  <span className="capitalize">{item}</span>
                  <ChevronRight 
                    size={20} 
                    className="transform transition-transform group-hover:translate-x-1"
                  />
                </button>
              </li>
            ))}
          </ul>
          
          <div className="flex gap-6 mt-12">
            <a 
              href="https://linkedin.com/in/connergroth"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn Profile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a 
              href="https://github.com/connergroth"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors"
              aria-label="GitHub Profile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar; 