import React from 'react';
import BlobShader from './BlobShader';

interface FooterProps {
  className?: string;
  style?: React.CSSProperties;
}

function Footer({ className = '', style }: FooterProps) {
  return (
    <footer 
      className={`mt-[15vh] relative z-10 pt-10 ${className}`}
      style={style}
      id="footer-anchor"
    >
      {/* Blob background for footer */}
      <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ zIndex: 0 }}>
        <BlobShader size={40} opacity={0.5} position="footer" fixed={false} />
      </div>
      
      <div className="relative z-10 py-10 mx-auto max-w-xl text-center">
        <p className="text-primary text-sm">
          Built with React &amp; Tailwind - <a href="https://github.com/connergroth/PortfolioWebsite" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80 transition-opacity">See inside!</a>
        </p>
        <p className="text-gray-300 mt-2 text-sm">
          © Conner Groth {new Date().getFullYear()}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;