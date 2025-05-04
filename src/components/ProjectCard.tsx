import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
}

const Card: React.FC<React.HTMLAttributes<HTMLDivElement> & ProjectCardProps> = ({
  title,
  description,
  image,
  technologies,
  liveUrl,
  githubUrl,
  ...props
}) => {
  return (
    <div 
      className="bg-base-100/40 dark:bg-base-900/40 backdrop-blur-sm rounded-lg border border-base-200 dark:border-base-800 overflow-hidden"
      {...props}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover object-center"
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-heading font-medium mb-2">{title}</h3>
        <p className="text-base-500 dark:text-base-400 text-sm mb-4">{description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {technologies.map((tech, index) => (
            <span 
              key={index}
              className="inline-block text-xs px-2 py-1 rounded-full bg-accent-100/20 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400"
            >
              {tech}
            </span>
          ))}
        </div>
        
        <div className="flex gap-3 mt-4">
          {githubUrl && (
            <a 
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-base-200/50 dark:bg-base-800/50 hover:bg-base-200 dark:hover:bg-base-800 transition-colors"
              aria-label={`View ${title} GitHub repository`}
            >
              <Github size={18} />
            </a>
          )}
          
          {liveUrl && (
            <a 
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-base-200/50 dark:bg-base-800/50 hover:bg-base-200 dark:hover:bg-base-800 transition-colors"
              aria-label={`View ${title} live demo`}
            >
              <ExternalLink size={18} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// Create motion version of the Card component
const MotionCard = motion(Card);

const ProjectCard: React.FC<ProjectCardProps> = (props) => {
  return (
    <MotionCard
      {...props}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
    />
  );
};

export default ProjectCard; 