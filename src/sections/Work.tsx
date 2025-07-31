import React from 'react';

// Helper function to map technology names to skill icons
const getSkillIcon = (tech: string): string | null => {
  const iconMap: { [key: string]: string } = {
    'React': 'react',
    'TypeScript': 'ts',
    'Python': 'python',
    'FastAPI': 'fastapi',
    'AWS': 'aws',
    'Flask': 'flask',
    'HTML': 'html',
    'CSS': 'css',
    'JavaScript': 'js',
    'UI/UX': 'figma',
    'APIs': 'postman',
    'Agile': 'github',
    'Next.js': 'nextjs',
    'React Native': 'react',
    'Supabase': 'supabase'
  };
  return iconMap[tech] || null;
};

interface WorkProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

const Work: React.FC<WorkProps> = ({ id = 'work', className = '', style }) => {
  const workExperiences = [
    {
      title: "AI Software Engineer Intern",
      company: "Soaper LLC",
      location: "Remote",
      date: "July 2025 – Present",
      description: "Building secure patient and clinician interfaces for an EMR platform with biometric authentication and scalable backend APIs.",
      tags: ["React", "TypeScript", "Python", "FastAPI", "AWS", "Full-Stack Development"]
    },
    {
      title: "Founding Software Engineer Intern",
      company: "Mili Llama",
      location: "Remote",
      date: "July 2025 – August",
      description: "Built an AI-first recruiting assistant for student-athletes as the sole engineer, focusing on NCAA compliance and intelligent school matching.",
      tags: ["Next.js", "FastAPI", "Supabase", "TypeScript", "Full-Stack Development", "AI Workflows"]
    },
    {
      title: "Undergraduate Researcher - Software Engineering",
      company: "University of Colorado Boulder – Genetic Logic Lab",
      location: "Boulder, CO",
      date: "May 2025 – Present",
      description: "Developing full-stack research software for biological data processing with React frontend and Python backend integrations.",
      tags: ["Python", "Flask", "React", "APIs", "Data Pipelines", "UI/UX", "Agile", "Full-Stack Development"]
    },
    {
      title: "Software Engineer Intern",
      company: "Ryno Industries",
      location: "Erie, CO",
      date: "May 2023 – Aug 2023",
      description: "Redesigned company website with responsive components, improving user engagement by 20%.",
      tags: ["HTML", "CSS", "JavaScript", "UI/UX"]
    },
  ];

  const leadershipExperiences = [
    {
      title: "Software Engineer Team Lead",
      company: "Blueprint Boulder",
      location: "Boulder, CO",
      date: "March 2025 – Present",
      description: "Leading full-stack development team for a nonprofit web application, managing client relations and system architecture.",
      tags: ["Leadership", "Client Liaison", "System Architecture", "Sprint Management", "Full-Stack Development", "Agile", "Team Communication"]
    },
    {
      title: "Co-Founder & AI Software Engineer",
      company: "Fly on the Wall",
      location: "Boulder, CO",
      date: "May 2025 – Present",
      description: "Co-founded startup building AI productivity tools for students, leading product development and mobile app launch.",
      tags: ["Leadership", "Product Strategy", "Brand Development", "Full-Stack Development", "React Native", "Next.js", "Supabase", "AI Workflows"]
    },
  ];

  const renderCard = (exp: {
    title: string;
    company: string;
    location: string;
    date: string;
    description: string;
    tags: string[];
  }, index: number) => (
    <div 
      key={index} 
      className="card p-6" 
      style={{ borderRadius: '0.9rem' }}
    >
      <div className="flex flex-col gap-4">
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">{exp.title}</h2>
          <h3 className="text-lg text-primary">
            {exp.company.includes('Genetic Logic Lab') ? (
              <>
                University of Colorado Boulder – Genetic Logic Lab
              </>
            ) : (
              exp.company
            )}
          </h3>
          <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {exp.location}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {exp.date}
            </span>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-gray-300 leading-relaxed">{exp.description}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {exp.tags.map((tag, tagIndex) => {
            const iconName = getSkillIcon(tag);
            return iconName ? (
              <div key={tagIndex} className="flex items-center gap-1 bg-[#2563eb]/10 text-[#60a5fa] px-3 py-1.5 rounded-full text-sm font-medium">
                <img 
                  src={`/assets/icons/${iconName}.svg?v=${Date.now()}`} 
                  alt={tag}
                  className="w-4 h-4"
                />
                <span>{tag}</span>
              </div>
            ) : (
              <span 
                key={tagIndex}
                className="bg-[#2563eb]/10 text-[#60a5fa] px-3 py-1.5 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <section 
      id={id}
      className={`custom-transition opacity-0 ${className}`}
      style={style}
    >
      <h1 className="font-serif font-bold sm:text-6xl text-4xl"><span style={{ letterSpacing: '-0.08em' }}>W</span>ork <span style={{ letterSpacing: '0.05em' }}>E</span><span style={{ letterSpacing: '0.06em' }}>x</span><span style={{ letterSpacing: '0.01em' }}>p</span><span style={{ letterSpacing: '0.03em' }}>e</span><span style={{ letterSpacing: '0.03em' }}>r</span>ien<span style={{ letterSpacing: '0.03em' }}>c</span>e</h1>
      
      <h2 className="mt-12 font-serif font-bold sm:text-3xl text-2xl">Professional Experience &rarr;</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {workExperiences.map((exp, index) => renderCard(exp, index))}
      </div>
      
      <h2 className="mt-12 font-serif font-bold sm:text-3xl text-2xl">Leadership Experience &rarr;</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {leadershipExperiences.map((exp, index) => renderCard(exp, index))}
      </div>
    </section>
  );
};

export default Work; 