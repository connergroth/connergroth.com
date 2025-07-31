import React from 'react';
import { Github, FileDown, Wrench } from 'lucide-react';

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
      <h1 className="font-serif font-bold sm:text-6xl text-4xl"><span style={{ letterSpacing: '0.01em' }}>A</span>bout Me</h1>
      <br />
      <p className="font-sans font-normal text-lg sm:text-xl md:text-2xl">
        I'm a Computer Science Student, Software Engineer, and Undergraduate Researcher based in Boulder, CO. I am passionate about building elegant and thoughtful web applications and exploring machine learning. 
      </p>
      <p className="font-sans font-normal text-lg sm:text-xl md:text-2xl mt-4">
        Currently, I am working on Synthetic Biology software tools such as SeqImprove at the <a 
          href="https://geneticlogiclab.org/#about" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-green-400 hover:text-green-300 transition-colors duration-200"
        >
          Genetic Logic Lab
        </a>. I am also building <a 
          href="https://pulseplan.app" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
        >
          PulsePlan
        </a>, an AI powered academic planning app.
      </p>
      
      {/* Tech Stack Section */}
      <div className="card mt-12 mb-8" style={{ borderRadius: '0.9rem' }}>
        <div className="flex items-start gap-4">
          <Wrench className="w-6 h-6 text-gray-300 mt-1" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-6">Tech Stack Overview</h2>

            <div className="w-full">
              {/* Tech Stack Icons */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {['python', 'js', 'ts', 'cpp', 'c', 'html', 'css', 'react', 'nextjs', 'nodejs', 'flask', 'fastapi', 'pytorch', 'postgres', 'supabase', 'redis', 'firebase', 'docker', 'git', 'github', 'aws'].map((tech, index) => {
                  const iconMap: { [key: string]: string } = {
                    'cpp': 'cpp-icon',
                    'c': 'c-icon',
                    'html': 'html-icon',
                    'css': 'css-icon',
                    'nodejs': 'nodejs-icon',
                    'flask': 'flask-icon',
                    'fastapi': 'fastapi-icon',
                    'pytorch': 'pytorch-icon',
                    'firebase': 'firebase-icon',
                    'git': 'git-icon'
                  };
                  
                  const iconName = iconMap[tech] || tech;
                  
                  return (
                    <img 
                      key={index}
                      src={`/assets/icons/${iconName}.svg`} 
                      alt={tech}
                      className="hover:scale-110 transition-transform duration-300 w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12"
                      onError={(e) => {
                        console.log(`Failed to load icon: ${iconName}.svg`);
                        e.currentTarget.style.border = '1px solid red';
                        e.currentTarget.style.display = 'block';
                      }}
                      onLoad={() => console.log(`Successfully loaded: ${iconName}.svg`)}
                    />
                  );
                })}
              </div>
              
              {/* Category Labels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <div className="bg-[#0a0e13]/30 p-4 rounded-lg">
                  <h4 className="text-gray-300 font-semibold mb-3 text-lg">Languages</h4>
                  <p className="text-gray-400 leading-relaxed">Python, JavaScript, TypeScript, C++, C</p>
                </div>
                <div className="bg-[#0a0e13]/30 p-4 rounded-lg">
                  <h4 className="text-gray-300 font-semibold mb-3 text-lg">Frontend</h4>
                  <p className="text-gray-400 leading-relaxed">React, Next.js, HTML, CSS</p>
                </div>
                <div className="bg-[#0a0e13]/30 p-4 rounded-lg">
                  <h4 className="text-gray-300 font-semibold mb-3 text-lg">Backend</h4>
                  <p className="text-gray-400 leading-relaxed">Node.js, Flask, FastAPI, PyTorch</p>
                </div>
                <div className="bg-[#0a0e13]/30 p-4 rounded-lg">
                  <h4 className="text-gray-300 font-semibold mb-3 text-lg">Tools & Cloud</h4>
                  <p className="text-gray-400 leading-relaxed">Docker, Git, AWS, PostgreSQL, Redis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="card flex-1" style={{ borderRadius: '0.9rem' }}>
          <a href="https://github.com/connergroth" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4">
            <Github className="w-6 h-6 text-gray-300" />
            <div>
              <h2>Github Profile</h2>
              <p>Check out my projects and contributions</p>
            </div>
          </a>
        </div>

        <div className="card flex-1" style={{ borderRadius: '0.9rem' }}>
          <a href="/assets/documents/Conner Groth Resume.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4">
            <FileDown className="w-6 h-6 text-gray-300" />
            <div>
              <h2>Resume</h2>
              <p>Download my resume</p>
            </div>
          </a>
        </div>
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