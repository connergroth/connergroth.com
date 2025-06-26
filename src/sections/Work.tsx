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
      description: "Contributing to full-stack development using React, Python (Flask), and modern web technologies while debugging and optimizing data pipelines for complex structured biological data. Implementing backend integrations with external APIs and third-party libraries, enhancing frontend state management, component design, and UI/UX workflows, and collaborating in an agile environment to deliver production-level research software.",
      tags: ["Python", "Flask", "React", "APIs", "Data Pipelines", "UI/UX", "Agile", "Full-Stack Development"]
    },
    {
      title: "Software Engineer Intern",
      company: "Ryno Industries",
      location: "Erie, CO",
      date: "May 2023 – Aug 2023",
      description: "Developed and optimized the company website to enhance usability, aesthetic appeal, and performance, resulting in a 20% increase in user engagement. Built responsive components using HTML, CSS, and JavaScript, ensuring cross-device compatibility. Worked closely with leadership to translate business goals into visual updates and interactive features.",
      tags: ["HTML", "CSS", "JavaScript", "UI/UX"]
    },
  ];

  const leadershipExperiences = [
    {
      title: "Software Engineer Team Lead",
      company: "Blueprint Boulder",
      location: "Boulder, CO",
      date: "March 2025 – Present",
      description: "Leading a software engineering team in building a production-grade web application for Need Project, a non-profit company providing care for special needs children while acting as primary liaison between engineering and client stakeholders to translate requirements into technical specifications. Overseeing system architecture, feature planning, and sprint management to ensure on-time delivery, contributing to full-stack development across frontend, backend, and database systems, and managing agile development cycles, technical team communication, and project delivery.",
      tags: ["Leadership", "Client Liaison", "System Architecture", "Sprint Management", "Full-Stack Development", "Agile", "Team Communication"]
    },
    {
      title: "Co-Founder & AI Software Engineer",
      company: "Fly on the Wall",
      location: "Boulder, CO",
      date: "May 2025 – Present",
      description: "Founded and currently lead an early-stage tech startup focused on building AI-powered productivity tools while defining product vision, user experience strategy, and growth roadmap for student-focused applications. Building and launching branding, landing pages, and onboarding systems to begin early user acquisition and testing, managing product planning, cross-functional workflows, and lean execution while handling design, development, and deployment. Developing backend and mobile applications using FastAPI, React Native, Supabase, and AI agent workflows to support product goals.",
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
      <br />
      
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