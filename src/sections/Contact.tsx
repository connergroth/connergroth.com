import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin } from 'lucide-react';

interface ContactProps {
  id?: string;
  className?: string;
}

const Contact: React.FC<ContactProps> = ({ id = 'contact', className = '' }) => {
  return (
    <section 
      id={id}
      className={`min-h-screen flex flex-col justify-center px-4 md:px-8 lg:px-16 py-24 snap-start ${className}`}
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          className="text-4xl md:text-5xl font-semibold leading-tight font-heading mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          Contact
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut', delay: 0.1 }}
          >
            <p className="text-base-700/90 dark:text-base-300/90 mb-8 leading-relaxed">
              Have a question or want to work together? Feel free to reach out through any of the channels below.
            </p>
            
            <div className="space-y-5">
              <a 
                href="mailto:connergroth@gmail.com" 
                className="flex items-center gap-3 group"
              >
                <div className="p-3 rounded-full bg-accent-100/20 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 group-hover:bg-accent-100 dark:group-hover:bg-accent-900/30 transition-colors">
                  <Mail size={20} />
                </div>
                <span className="font-medium group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">connergroth@gmail.com</span>
              </a>
              
              <a 
                href="https://github.com/connergroth" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
              >
                <div className="p-3 rounded-full bg-accent-100/20 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 group-hover:bg-accent-100 dark:group-hover:bg-accent-900/30 transition-colors">
                  <Github size={20} />
                </div>
                <span className="font-medium group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">github.com/connergroth</span>
              </a>
              
              <a 
                href="https://linkedin.com/in/connergroth" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
              >
                <div className="p-3 rounded-full bg-accent-100/20 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 group-hover:bg-accent-100 dark:group-hover:bg-accent-900/30 transition-colors">
                  <Linkedin size={20} />
                </div>
                <span className="font-medium group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">linkedin.com/in/connergroth</span>
              </a>
            </div>
          </motion.div>
          
          <motion.div
            className="hidden md:block"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut', delay: 0.2 }}
          >
            <div className="w-full h-full rounded-lg border border-base-200 dark:border-base-800 overflow-hidden">
              <iframe 
                src="https://calendly.com/connergroth/30min" 
                width="100%" 
                height="600" 
                frameBorder="0"
                title="Calendly scheduling embed"
                className="w-full h-full"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact; 