import React from 'react';
import { motion } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';

interface ProjectsProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

const Projects: React.FC<ProjectsProps> = ({ id = 'projects', className = '', style }) => {
  return (
    <section 
      id={id}
      className={`min-h-screen flex flex-col justify-center items-center px-4 md:px-8 lg:px-16 py-24 ${className}`}
      style={style}
    >
      <div className="w-full max-w-7xl mx-auto">
        <motion.h2 
          className="text-4xl md:text-5xl font-semibold leading-tight font-heading mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          Work
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut', delay: 0.1 }}
        >
          {/* Project cards would be rendered here */}
          {/* This is a placeholder for where your existing ProjectCard components would be placed */}
          {/* 
            Example usage:
            <ProjectCard 
              title="Project Name"
              description="Project description"
              image="/path/to/image.jpg"
              technologies={["React", "TypeScript", "Tailwind"]}
              liveUrl="https://example.com"
              githubUrl="https://github.com/username/repo"
            />
          */}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects; 