import React from 'react';
import { Github, Linkedin } from 'lucide-react';

interface FlyOnTheWallProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

const FlyOnTheWall: React.FC<FlyOnTheWallProps> = ({ id = 'fly-on-the-wall', className = '', style }) => {
  return (
    <section 
      id={id}
      className={`custom-transition opacity-0 ${className}`}
      style={style}
    >
      <h1 className="font-serif font-bold sm:text-6xl text-4xl">
      <span style={{ letterSpacing: '0.03em' }}>F</span><span style={{ letterSpacing: '0.04em' }}>l</span>y on <span style={{ letterSpacing: '0.04em' }}>t</span>he <span style={{ letterSpacing: '-0.08em' }}>W</span><span style={{ letterSpacing: '0.02em' }}>a</span><span style={{ letterSpacing: '0.005em' }}>l</span>l
      </h1>
      
      <div className="mt-8">
        <p className="text-lg sm:text-xl font-normal">
          My roommates and I co-founded Fly on the Wall, a student-led software startup building thoughtful, AI-powered tools with personality and purpose. We design intuitive, beautifully crafted products that improve daily life.
        </p>
        
        <div className="mt-6">
          <p className="text-lg mb-4">
            Our first product is <strong>PulsePlan</strong>, an intelligent academic planner.
          </p>
          
          <a 
            href="https://pulseplan.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 hover:scale-105 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 mb-6 group"
          >
            View PulsePlan
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
          
          <p className="text-gray-400">
            Learn more at{' '}
            <a 
              href="https://flyonthewalldev.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors underline"
            >
              flyonthewalldev.com
            </a>
          </p>
        </div>

        <div className="card mt-8" style={{ borderRadius: '0.9rem' }}>
          <a href="https://github.com/flyonthewalldev" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4">
            <Github className="w-6 h-6 text-gray-300" />
            <div>
              <h2>GitHub Organization</h2>
              <p>Check out our startup projects</p>
            </div>
          </a>
        </div>
        <div className="card mt-8" style={{ borderRadius: '0.9rem' }}>
          <a href="https://linkedin.com/company/flyonthewalldev" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4">
            <Linkedin className="w-6 h-6 text-gray-300" />
            <div>
              <h2>LinkedIn Company Page</h2>
              <p>Connect with us!</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FlyOnTheWall; 