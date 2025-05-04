import React from 'react';
import { motion } from 'framer-motion';
import { Code, Cpu, Brain } from 'lucide-react';

interface AboutProps {
  id?: string;
  className?: string;
}

const About: React.FC<AboutProps> = ({ id = 'about', className = '' }) => {
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
          About
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut', delay: 0.1 }}
          >
            <p className="text-base-700/90 dark:text-base-300/90 mb-6 leading-relaxed">
              I'm a Software Engineer and Research Assistant based in Boulder, CO, with a passion for building performant, accessible web applications and exploring machine learning solutions.
            </p>
            <p className="text-base-700/90 dark:text-base-300/90 mb-8 leading-relaxed">
              Currently pursuing a Computer Science degree at CU Boulder, I combine academic knowledge with practical experience in modern frameworks and tools. My focus areas include full-stack development, AI/ML integration, and creating intuitive user experiences.
            </p>
            
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Code size={20} className="text-accent-500 dark:text-accent-400" />
                <span className="font-medium">Python</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu size={20} className="text-accent-500 dark:text-accent-400" />
                <span className="font-medium">React</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain size={20} className="text-accent-500 dark:text-accent-400" />
                <span className="font-medium">ML</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="flex justify-center md:justify-end"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut', delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-400/20 to-accent-600/20 rounded-full blur-xl"></div>
              <img 
                src="/assets/images/connerpfp.png" 
                alt="Conner Groth profile" 
                className="w-64 h-64 rounded-full object-cover relative z-10 border-4 border-accent-200 dark:border-accent-800"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About; 