import React from 'react';

interface WorkProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

const Work: React.FC<WorkProps> = ({ id = 'work', className = '', style }) => {
  const workExperiences = [
    {
      title: "Undergraduate Researcher - Software Engineering",
      company: "University of Colorado Boulder – Genetic Logic Lab",
      location: "Boulder, CO",
      date: "May 2025 – Present",
      description: "Contributing to full-stack development of research software using React and Python (Flask), with a focus on structured biological data. Enhancing backend integrations, data pipelines, and frontend state management while collaborating in an agile environment to deliver production-ready tools for the lab.",
      tags: ["Python", "Flask", "React", "APIs", "Data Pipelines", "UI/UX", "Agile", "Full-Stack Development"]
    },
    {
      title: "Software Engineer Intern",
      company: "Ryno Industries",
      location: "Erie, CO",
      date: "May 2023 – Aug 2023",
      description: "Redesigned and optimized the company website for usability, performance, and visual appeal—boosting user engagement by 20%. Built responsive components with HTML, CSS, and JavaScript in close collaboration with leadership.",
      tags: ["HTML", "CSS", "JavaScript", "UI/UX"]
    },
  ];

  const leadershipExperiences = [
    {
      title: "Software Engineer Team Lead",
      company: "Blueprint Boulder",
      location: "Boulder, CO",
      date: "March 2025 – Present",
      description: "Leading full-stack development for a production-grade web app for Need Project, a nonprofit serving special needs families. Acting as the primary liaison between engineering and stakeholders, overseeing system architecture, sprint planning, and agile delivery.",
      tags: ["Leadership", "Client Liaison", "System Architecture", "Sprint Management", "Full-Stack Development", "Agile", "Team Communication"]
    },
    {
      title: "Co-Founder & AI Software Engineer",
      company: "Fly on the Wall",
      location: "Boulder, CO",
      date: "May 2025 – Present",
      description: "Founder of an early-stage startup building AI-powered productivity tools for students. Leading product vision, branding, and growth strategy while developing and launching mobile and backend systems using FastAPI, React Native, and Supabase.",
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
          {exp.tags.map((tag, tagIndex) => (
            <span 
              key={tagIndex}
              className="bg-[#2563eb]/10 text-[#60a5fa] px-3 py-1.5 rounded-full text-sm font-medium"
            >
              {tag}
            </span>
          ))}
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
      <div className="grid gap-6 mt-8">
        {workExperiences.map((exp, index) => renderCard(exp, index))}
      </div>
      
      <h2 className="mt-12 font-serif font-bold sm:text-3xl text-2xl">Leadership Experience &rarr;</h2>
      <div className="grid gap-6 mt-8">
        {leadershipExperiences.map((exp, index) => renderCard(exp, index))}
      </div>
    </section>
  );
};

export default Work; 