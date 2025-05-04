import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail } from 'lucide-react';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={`py-8 px-4 md:px-8 lg:px-16 border-t border-base-200 dark:border-base-800 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="text-xl font-heading font-medium">Conner Groth</h3>
            <p className="text-sm text-base-500 dark:text-base-400">Software Engineer & CS Student</p>
          </div>
          
          <div className="flex gap-4 items-center">
            <a 
              href="https://github.com/connergroth"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:text-accent-500 dark:hover:text-accent-400 transition-colors"
              aria-label="GitHub Profile"
            >
              <Github size={20} />
            </a>
            <a 
              href="https://linkedin.com/in/connergroth"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:text-accent-500 dark:hover:text-accent-400 transition-colors"
              aria-label="LinkedIn Profile"
            >
              <Linkedin size={20} />
            </a>
            <a 
              href="mailto:connergroth@gmail.com"
              className="p-2 hover:text-accent-500 dark:hover:text-accent-400 transition-colors"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-base-200/60 dark:border-base-800/60 text-center">
          <p className="text-xs text-base-500 dark:text-base-400">
            &copy; {new Date().getFullYear()} Conner Groth. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 