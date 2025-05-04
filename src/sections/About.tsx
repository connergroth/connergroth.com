import React from 'react';
import { Code, Cpu, Brain } from 'lucide-react';

interface AboutProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

const About: React.FC<AboutProps> = ({ id = 'about', className = '', style }) => {
  return (
    <section 
      id={id}
      className={`custom-transition opacity-0 ${className}`}
      style={style}
    >
      <h1 className="font-serif font-bold sm:text-6xl text-4xl">About Me</h1>
      <br />
      <h2 className="font-serif font-bold sm:text-3xl text-xl">
        I'm a Computer Science Student, Software Engineer, and Research Assistant based in Boulder, CO. I am passionate about building elegant and thoughtful web applications and exploring machine learning.
      </h2>
      
      {/* Badges row */}
      <ul className="flex flex-wrap gap-3 mt-8 mb-6">
        {['Python', 'C++', 'React', 'JavaScript', 'Next.js', 'PostgreSQL']
          .map(tag => (
            <li key={tag} className="bg-gray-800 hover:bg-gray-700 transition-colors duration-300 text-gray-300 px-3 py-1 rounded-full text-sm">
              {tag}
            </li>
         ))}
      </ul>
      
      <div className="card mb-8" style={{ borderRadius: '0.9rem' }}>
        <a href="https://github.com/connergroth" target="_blank" rel="noopener noreferrer">
          <h2>Open Source Projects</h2>
          <p>Check out my GitHub for my open source projects and contributions</p>
        </a>
      </div>
      
      {/* <div className="lg:hidden md:hidden block flex justify-between text-center p-4 mt-2">
        <div>
          <div className="text-3xl font-bold">3+</div>
          <div className="text-lg text-gray-500">Years Experience</div>
        </div>
        <div>
          <div className="text-3xl font-bold">20+</div>
          <div className="text-lg text-gray-500">Projects</div>
        </div>
        <div>
          <div className="text-3xl font-bold">10+</div>
          <div className="text-lg text-gray-500">Technologies</div>
        </div>
      </div>
    */}
    </section>
  );
};

export default About; 