import React from 'react';
import BlobShader from '../components/BlobShader';

interface FooterProps {
  className?: string;
  style?: React.CSSProperties;
}

const Footer: React.FC<FooterProps> = ({ className = '', style }) => {
  return (
    <footer 
      className={`mt-[40vh] text-center text-sm relative z-10 pt-20 ${className}`}
      style={style}
      id="footer-anchor"
    >
      {/* Footer Blob - positioned absolutely within the footer */}
      <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ zIndex: -1 }}>
        <BlobShader size={30} opacity={0.6} position="footer" fixed={false} />
      </div>
      
      {/* A standalone mini blob styled like the project tech tags */}
      <div className="relative mx-auto w-64 h-64 mb-16 bg-[#2563eb]/10 rounded-full flex items-center justify-center" style={{ zIndex: 20 }}>
        <div className="w-56 h-56 rounded-full overflow-hidden">
          <BlobShader size={100} opacity={0.9} position="hero" fixed={false} />
        </div>
      </div>
      
      {/* Footer content with mini blob surrounding it */}
      <div className="relative z-10 py-16 bg-black bg-opacity-50 rounded-lg mx-auto max-w-xl">
        {/* Content appears on top of the mini blob */}
        <div className="relative z-10">
          <p className="text-[#60a5fa]">
            Built with React &amp; Tailwind - <a href="https://github.com/connergroth/PortfolioWebsite" target="_blank" rel="noopener noreferer" className="underline hover:opacity-80 transition-opacity">See inside!</a>
          </p>
          <p className="text-gray-300 mt-2">
            © Conner Groth {new Date().getFullYear()}. All rights reserved.
          </p>
          <div className="h-10" aria-hidden="true"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 