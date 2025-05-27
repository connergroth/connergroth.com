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
        Currently, I am working on Synthetic Biology software tools such as SeqImprove at the Genetic Logic Lab. I am also building Tensoe, a machine learning powered music recommendation system.
      </p>
      
      {/* Tech Stack Section */}
      <div className="mt-12 mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Wrench className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Tech Stack Overview</h2>
        </div>

        {/* Languages */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Languages</h3>
          <ul className="flex flex-wrap gap-3">
            {['Python', 'C++', 'C', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'SQL'].map(tag => (
              <li key={tag} className="bg-[#2563eb]/10 text-[#60a5fa] hover:bg-[#2563eb]/20 transition-colors duration-300 px-3 py-1 rounded-full text-sm">
                {tag}
              </li>
            ))}
          </ul>
        </div>

        {/* Frameworks & Libraries */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Frameworks & Libraries</h3>
          <ul className="flex flex-wrap gap-3">
            {['React', 'Next.js', 'React Native', 'FastAPI', 'Flask', 'PyTorch', 'TensorFlow', 'Hugging Face'].map(tag => (
              <li key={tag} className="bg-[#2563eb]/10 text-[#60a5fa] hover:bg-[#2563eb]/20 transition-colors duration-300 px-3 py-1 rounded-full text-sm">
                {tag}
              </li>
            ))}
          </ul>
        </div>

        {/* Database & Storage */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Database & Storage</h3>
          <ul className="flex flex-wrap gap-3">
            {['PostgreSQL', 'Redis', 'Supabase', 'Firebase'].map(tag => (
              <li key={tag} className="bg-[#2563eb]/10 text-[#60a5fa] hover:bg-[#2563eb]/20 transition-colors duration-300 px-3 py-1 rounded-full text-sm">
                {tag}
              </li>
            ))}
          </ul>
        </div>

        {/* Machine Learning & Data */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Machine Learning & Data</h3>
          <ul className="flex flex-wrap gap-3">
            {['PyTorch', 'TensorFlow', 'OpenAI API', 'Hugging Face', 'Pandas', 'NumPy'].map(tag => (
              <li key={tag} className="bg-[#2563eb]/10 text-[#60a5fa] hover:bg-[#2563eb]/20 transition-colors duration-300 px-3 py-1 rounded-full text-sm">
                {tag}
              </li>
            ))}
          </ul>
        </div>

        {/* DevOps & Tools */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-3">DevOps & Tools</h3>
          <ul className="flex flex-wrap gap-3">
            {['Docker', 'Git', 'GitHub', 'Bash', 'VSCode', 'AWS'].map(tag => (
              <li key={tag} className="bg-[#2563eb]/10 text-[#60a5fa] hover:bg-[#2563eb]/20 transition-colors duration-300 px-3 py-1 rounded-full text-sm">
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card mb-8" style={{ borderRadius: '0.9rem' }}>
        <a href="https://github.com/connergroth" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4">
          <Github className="w-6 h-6 text-gray-300" />
          <div>
            <h2>Github Profile</h2>
            <p>Check out my projects and contributions</p>
          </div>
        </a>
      </div>

      <div className="card" style={{ borderRadius: '0.9rem' }}>
        <a href="/assets/documents/Conner Groth Resume.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4">
          <FileDown className="w-6 h-6 text-gray-300" />
          <div>
            <h2>Resume</h2>
            <p>Download my resume</p>
          </div>
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