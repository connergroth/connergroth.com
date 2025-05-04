import React from 'react';

interface FooterProps {
  className?: string;
  style?: React.CSSProperties;
}

function Footer({ className = '', style }: FooterProps) {
  return (
    <footer 
      className={`mt-[40vh] relative z-10 pt-20 ${className}`}
      style={style}
      id="footer-anchor"
    >
      <div className="relative z-10 py-10 mx-auto max-w-xl text-center">
        <p className="text-[#60a5fa]">
          Built with React &amp; Tailwind - <a href="https://github.com/connergroth/PortfolioWebsite" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80 transition-opacity">See inside!</a>
        </p>
        <p className="text-gray-300 mt-2">
          © Conner Groth {new Date().getFullYear()}. All rights reserved.
        </p>
        <div className="h-10" aria-hidden="true"></div>
      </div>
    </footer>
  );
}

export default Footer;