import React, { useEffect } from 'react';
import { Download } from 'lucide-react';

const HeroSection: React.FC = () => {
  useEffect(() => {
    const handleScroll = () => {
      const scrollIndicator = document.getElementById('scroll-indicator');
      if (scrollIndicator) {
        const heroSection = document.getElementById('profile');
        if (heroSection) {
          const heroHeight = heroSection.offsetHeight;
          if (window.scrollY > heroHeight * 0.5) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.visibility = 'hidden';
          } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.visibility = 'visible';
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section id="profile" className="min-h-screen flex flex-col justify-center items-center pt-16 pb-20 px-4 bg-grid bg-noise">
      <div className="container mx-auto flex flex-col items-center relative z-10">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-center md:justify-between gap-12">
          <div className="order-2 md:order-1 w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="mb-2 inline-block">
              <p className="text-sm md:text-base font-medium text-muted-foreground tracking-wide" style={{ animation: 'fadeIn 0.8s ease-out forwards' }}>
                Hello, I'm
              </p>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-3 leading-tight overflow-hidden">
              <span className="typing-effect typing-medium text-gradient font-inter font-extrabold tracking-tighter">Conner Groth</span>
            </h1>
            <div className="w-20 h-1 bg-primary mb-6 animate-scale-in" style={{ animationDelay: '2s' }}></div>
            <p className="text-xl md:text-2xl font-light mb-8 max-w-lg leading-relaxed" style={{ opacity: 0, animation: 'fadeIn 1s ease-out 2.2s forwards' }}>
              Software Engineer Team Lead | Software Research Assistant | CS @ CU Boulder
            </p>

            <div className="flex flex-wrap gap-4 mb-10" style={{ opacity: 0, animation: 'fadeIn 1s ease-out 2.5s forwards' }}>
              <button 
                onClick={() => window.open('./assets/Conner Groth Resume.pdf')}
                className="btn-outline-hero download-btn"
              >
                <Download size={18} />
                <span>Download CV</span>
              </button>
              <a 
                href="#contact"
                className="btn-outline-hero"
              >
                <span>Contact Info</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            </div>

            <div className="flex gap-5" style={{ opacity: 0, animation: 'fadeIn 1s ease-out 2.7s forwards' }}>
              <a 
                href="https://linkedin.com/in/connergroth"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-icon-outline"
                aria-label="LinkedIn Profile"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a 
                href="https://github.com/connergroth"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-icon-outline"
                aria-label="GitHub Profile"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              </a>
            </div>
          </div>

          <div className="order-1 md:order-2 w-full md:w-2/5 flex justify-center animate-float">
            <div className="relative">
              {/* Background glow effect */}
              <div className="absolute top-1/2 left-1/2 w-64 h-64 md:w-[22rem] md:h-[22rem] bg-gradient-to-br from-primary/50 to-accent/50 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 z-0"></div>
              
              <img 
                src="./assets/connerpfp.png" 
                alt="Conner Groth profile" 
                className="relative w-72 h-72 md:w-96 md:h-96 object-cover z-10"
              />
            </div>
          </div>
        </div>
        
        <div id="scroll-indicator" className="fixed bottom-5 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-pulse animation-delay-3000 z-20 transition-opacity duration-500">
          <span className="text-sm text-muted-foreground mb-2 backdrop-blur-sm bg-background/30 px-3 py-1 rounded-full">Scroll Down</span>
          <div className="w-6 h-9 border-2 border-[hsl(var(--border))] rounded-full flex items-start justify-center p-1 bg-background/50 backdrop-blur-sm">
            <div className="w-1 h-2 bg-primary rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;