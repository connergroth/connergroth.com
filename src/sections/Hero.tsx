import React from 'react';
import BlobShader from '../components/BlobShader';

interface HeroProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

const Hero: React.FC<HeroProps> = ({ id = 'home', className = '', style }) => {
  return (
    <section
      id={id}
      className={`relative min-h-screen ${className}`}
      style={style}
    >
      {/* Dark blob */}
      <div className="absolute inset-0 w-full h-[150vh] overflow-visible" style={{ zIndex: 0 }}>
        <BlobShader size={100} opacity={1.0} position="hero" fixed={false} extend={true} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen pt-24 pb-12 pl-[5vw]">
        {/* Name + tagline */}
        <div>
          <h1 className="hero-title font-serif font-bold custom-fade-in tracking-tighter leading-[0.85] text-white w-full text-[18vw] sm:text-[13vw] select-none">
            conner<br />groth
          </h1>
          <p className="font-sans text-2xl sm:text-2xl md:text-3xl text-white/50 mt-12 custom-fade-in anim-delay-400 select-none">
            AI &amp; Software Engineering
          </p>
        </div>
      </div>

    </section>
  );
};

export default Hero;
