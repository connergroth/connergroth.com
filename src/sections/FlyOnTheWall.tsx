import React from 'react';
import { Github } from 'lucide-react';

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
          My roommates and I co-founded Fly on the Wall, a student-led software studio focused on building thoughtful, AI-powered products with personality & purpose.
        </p>
        <ul className="mt-4 text-gray-400 text-lg list-disc list-inside">
          <li>We move fast, design intentionally, and build tools that solve real problems—starting with PulsePlan, our intelligent academic planner.</li>
          <li>
            <a 
              href="https://flyonthewalldev.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Explore at flyonthewalldev.com
            </a>
          </li>
        </ul>

        <div className="card mt-8" style={{ borderRadius: '0.9rem' }}>
          <a href="https://github.com/flyonthewalldev" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4">
            <Github className="w-6 h-6 text-gray-300" />
            <div>
              <h2>GitHub Organization</h2>
              <p>Check out our studio projects</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FlyOnTheWall; 