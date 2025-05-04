import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  const isScrolled = useHeaderShrink();
  const [logoSrc] = useState('/assets/logos/handwritten.png');

  return (
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
      </nav>
      
      <div className="md:hidden flex items-center">
        {/* Mobile menu button could go here if needed */}
      </div>
    </header>
  );
};

export default Header; 