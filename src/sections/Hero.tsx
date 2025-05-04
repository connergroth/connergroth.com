import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface HeroProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

const Hero: React.FC<HeroProps> = ({ id = 'hero', className = '', style }) => {
  return (
    <section 
      id={id}
      className={`min-h-screen flex flex-col justify-center items-start px-4 md:px-8 lg:px-16 ${className}`}
      style={style}
    >
      <div className="max-w-4xl">
        <motion.h1 
          className="text-6xl font-semibold leading-tight font-heading mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          Hi, I'm Conner Groth.
        </motion.h1>
        
        <motion.p
          className="text-xl text-base-500/90 dark:text-base-300/90 mb-12 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut', delay: 0.1 }}
        >
          Software Engineer Team Lead | Software Research Assistant | CS @ CU Boulder
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="mt-auto absolute bottom-12 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              repeatType: 'loop',
              ease: 'easeInOut' 
            }}
          >
            <ChevronDown 
              size={24} 
              className="text-base-400 dark:text-base-500" 
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero; 