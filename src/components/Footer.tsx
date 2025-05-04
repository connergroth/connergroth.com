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
      
      {/* Large blob surrounding the footer content */}
      <div className="relative mx-auto mb-16 overflow-hidden" style={{ width: '90%', maxWidth: '800px', height: '300px', zIndex: 10 }}>
        <BlobShader size={50} opacity={0.4} position="footer" fixed={false} />
      </div>
      
      {/* Footer content */}
      <div className="relative z-20 py-16 mx-auto max-w-xl">
        <p className="text-[#60a5fa]">
          Built with React &amp; Tailwind - <a href="https://github.com/connergroth/PortfolioWebsite" target="_blank" rel="noopener noreferer" className="underline hover:opacity-80 transition-opacity">See inside!</a>
        </p>
        <p className="text-gray-300 mt-2">
          © Conner Groth {new Date().getFullYear()}. All rights reserved.
        </p>
        <div className="h-10" aria-hidden="true"></div>
      </div>
    </footer>
  );
};

export default Footer; 