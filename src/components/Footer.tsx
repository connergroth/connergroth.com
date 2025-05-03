import React from 'react';
import { ArrowUp } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Footer: React.FC = () => {
  const location = useLocation();
  
  // Direct scroll to top function that uses vanilla JS
  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    
    try {
      // Method 1: Most direct method
      window.scrollTo({
        top: 0,
        behavior: 'auto' // Force auto behavior
      });
      
      // Method 2: Fallback using direct DOM manipulation
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0; // For Safari
      
      // Method 3: Using requestAnimationFrame for smoother experience
      const scrollToTopGradually = () => {
        const currentPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        
        if (currentPosition > 0) {
          // Jump directly to top - no smooth scrolling
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }
      };
      
      // Execute scroll
      requestAnimationFrame(scrollToTopGradually);
      
      console.log("Scrolling to top!");
    } catch (err) {
      console.error("Error scrolling to top:", err);
    }
  };

  return (
    <footer className="bg-[hsl(var(--background))] border-t border-[hsl(var(--border))] py-8">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-gradient">Conner Groth</h2>
            <p className="mt-2 text-muted-foreground text-sm">Software Engineer & CS Student</p>
          </div>
          
          <ul className="flex flex-wrap justify-center gap-4 md:gap-6 mb-6 md:mb-0">
            {/* Direct HTML links - different based on current page */}
            {location.pathname === '/' ? (
              // On home page - use direct anchor links
              <>
                <li>
                  <a 
                    href="#about"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors capitalize"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a 
                    href="#experience"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors capitalize"
                  >
                    Experience
                  </a>
                </li>
                <li>
                  <a 
                    href="#skills"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors capitalize"
                  >
                    Skills
                  </a>
                </li>
                <li>
                  <a 
                    href="#projects"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors capitalize"
                  >
                    Projects
                  </a>
                </li>
                <li>
                  <a 
                    href="#contact"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors capitalize"
                  >
                    Contact
                  </a>
                </li>
              </>
            ) : (
              // Not on home page - link to home with hash
              <>
                <li>
                  <a 
                    href="/#about"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors capitalize"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a 
                    href="/#experience"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors capitalize"
                  >
                    Experience
                  </a>
                </li>
                <li>
                  <a 
                    href="/#skills"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors capitalize"
                  >
                    Skills
                  </a>
                </li>
                <li>
                  <a 
                    href="/#projects"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors capitalize"
                  >
                    Projects
                  </a>
                </li>
                <li>
                  <a 
                    href="/#contact"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors capitalize"
                  >
                    Contact
                  </a>
                </li>
              </>
            )}
            <li>
              <Link 
                to="/photography"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors capitalize"
              >
                Photography
              </Link>
            </li>
          </ul>
          
          {/* Scroll to top button with reverted styling */}
          <a 
            href="#"
            onClick={handleScrollToTop}
            className="btn-icon-outline flex items-center justify-center hover:text-primary"
            aria-label="Scroll to top"
            role="button"
            title="Scroll to top"
          >
            <ArrowUp size={18} />
          </a>
        </div>
        
        <div className="mt-8 pt-6 border-t border-[hsl(var(--border))]/60 text-center">
          <div className="flex justify-center gap-6 mb-4">
            <a 
              href="https://linkedin.com/in/connergroth"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn Profile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a 
              href="https://github.com/connergroth"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors"
              aria-label="GitHub Profile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            </a>
            <a 
              href="mailto:connergroth@gmail.com"
              className="text-foreground hover:text-primary transition-colors"
              aria-label="Email"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </a>
          </div>
          <p className="text-sm text-muted-foreground">Copyright &copy; {new Date().getFullYear()} Conner Groth. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 