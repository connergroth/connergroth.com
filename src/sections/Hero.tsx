import React from 'react';
import BlobShader from '../components/BlobShader';
import ScrollHint from '../components/ScrollHint';
import SideBars from '../components/SideBars';

interface HeroProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

const Hero: React.FC<HeroProps> = ({ id = 'home', className = '', style }) => {
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
          <h1 className="hero-title font-serif font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl custom-fade-in">
            Conner Groth
          </h1>
          <p className="hero-subtitle mt-4 text-lg sm:text-xl md:text-2xl custom-fade-in anim-delay-400">
            Software Engineer | CS Student | Research Assistant
          </p>
          <p className="hero-subbertitle mt-2 text-base md:text-lg custom-fade-in anim-delay-800">
            <a href="https://connergroth.com" className="hover:text-primary transition-colors">
              connergroth.com
            </a>
          </p>
        </div>
        
        <div className="mt-12">
        </div>
      </div>
    </section>
  );
};

export default Hero;