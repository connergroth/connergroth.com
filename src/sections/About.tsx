import React from 'react';

interface AboutProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

const About: React.FC<AboutProps> = ({ id = 'about', className = '', style }) => {
  return (
    <section
      id={id}
      className={`custom-transition opacity-0 ${className}`}
      style={style}
    >
      <h1 className="font-serif font-bold sm:text-6xl text-4xl"><span style={{ letterSpacing: '0.01em' }}>A</span>bout</h1>

      <p className="font-sans font-normal text-xl sm:text-2xl md:text-3xl leading-relaxed mt-8 max-w-3xl">
        I build software that sits at the intersection of AI and real human problems — voice systems that feel natural, tools that make researchers faster, products that people actually want to use. Based in Boulder, studying CS at CU, and always looking for the next thing worth building.
      </p>

      <a
        href="/assets/documents/Conner Groth Resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mt-10 text-lg"
      >
        Resume &rarr;
      </a>
    </section>
  );
};

export default About;
