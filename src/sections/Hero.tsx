import React from 'react';
import BlobShader from '../components/BlobShader';
import SideBars from '../components/SideBars';
import { Github, Linkedin, Mail } from 'lucide-react';

interface HeroProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

const Hero: React.FC<HeroProps> = ({ id = 'home', className = '', style }) => {
  const socialLinks = [
    { href: "https://github.com/connergroth", label: "GitHub", icon: <Github className="w-6 h-6" /> },
    { href: "https://linkedin.com/in/connergroth", label: "LinkedIn", icon: <Linkedin className="w-6 h-6" /> },
    { href: "mailto:connergroth@gmail.com", label: "Email", icon: <Mail className="w-6 h-6" /> }
  ];

  return (
    <section 
      id={id}
      className={`relative min-h-screen flex flex-col justify-center pt-32 pb-24 ${className}`}
      style={style}
    >
      {/* Blob container positioned absolutely within the hero section with extended height */}
      <div className="absolute inset-0 w-full h-[150vh] overflow-visible" style={{ zIndex: 0 }}>
        <BlobShader size={30} opacity={0.7} position="hero" fixed={false} extend={true} />
      </div>
      
      <SideBars />
      
      {/* Content with proper z-index to appear above the blob */}
      <div className="relative z-10">
        <div className="max-w-4xl">
          <h1 className="hero-title font-serif font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl custom-fade-in tracking-tight whitespace-nowrap w-full text-balance">
            <span style={{ letterSpacing: '0.01em' }}>C</span>o<span style={{ letterSpacing: '0.0005em' }}>n</span>n<span style={{ letterSpacing: '0.01em' }}>e</span>r Gro<span style={{ letterSpacing: '0.03em' }}>th</span>
          </h1>
          <p className="hero-subtitle mt-4 text-lg sm:text-xl md:text-2xl custom-fade-in anim-delay-400">
            Software Engineer | CS Student | Undergraduate Researcher
          </p>
          
          {/* Social Media icons for mobile */}
          <div className="md:hidden flex gap-4 mt-4">
            {socialLinks.map((link, index) => (
              <a 
                key={link.label}
                href={link.href}
                className="text-gray-300 hover:text-primary transition-colors"
                style={{ 
                  opacity: 0,
                  animation: `fadeIn 0.8s ease-out ${1.2 + (index * 0.1)}s forwards`
                }}
                target="_blank"
                rel="noreferrer"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
        
        <div className="mt-12">
        </div>
      </div>
    </section>
  );
};

export default Hero;