import React from 'react';
import BlobShader from './BlobShader';

interface FooterProps {
  className?: string;
  style?: React.CSSProperties;
}

const Footer: React.FC<FooterProps> = ({ className = '', style }) => {
  return (
    <footer 
      className={`mt-[40vh] relative z-10 pt-20 ${className}`}
      style={style}
      id="footer-anchor"
    >
      {/* Footer Blob - positioned absolutely within the footer */}
      <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ zIndex: -1 }}>
        <BlobShader size={30} opacity={0.6} position="footer" fixed={false} />
      </div>
      
      {/* Footer content with centered mini blob */}
      <div className="relative text-center">
        {/* Enhanced mini blob container with better visibility */}
        <div className="relative mx-auto w-80 h-80 mb-8 rounded-full overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-full"></div>
          <div className="relative w-full h-full">
            <BlobShader 
              size={120} 
              opacity={0.95} 
              position="mini" 
              fixed={false} 
              extend={false}
            />
          </div>
        </div>
        
        {/* Footer content on top of the mini blob */}
        <div className="relative z-10 py-10 mx-auto max-w-xl">
          <p className="text-[#60a5fa]">
            Built with React &amp; Tailwind - <a href="https://github.com/connergroth/PortfolioWebsite" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80 transition-opacity">See inside!</a>
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