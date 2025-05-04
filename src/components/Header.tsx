import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../lib/utils';

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
  const { theme, toggleTheme } = useTheme();
  const isScrolled = useHeaderShrink();
  const [logoSrc, setLogoSrc] = useState('/assets/logos/handwrittendark.png');

  useEffect(() => {
    setLogoSrc(theme === 'dark' ? '/assets/logos/handwritten.png' : '/assets/logos/handwrittendark.png');
  }, [theme]);

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 h-16 z-50 transition-all duration-300',
        'flex items-center justify-between px-4 md:px-8 lg:px-12',
        isScrolled ? 'backdrop-blur-md bg-base-900/80 dark:bg-base-900/80' : 'bg-transparent'
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
      
      <nav className="hidden md:flex items-center space-x-6">
        <a 
          href="#work" 
          className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
        >
          Work
        </a>
        <a 
          href="#about" 
          className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
        >
          About
        </a>
        <a 
          href="#contact" 
          className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
        >
          Contact
        </a>
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-foreground/10 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </nav>
      
      <div className="md:hidden flex items-center">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-foreground/10 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
};

export default Header; 