import React from 'react';

interface WorkProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

const Work: React.FC<WorkProps> = ({ id = 'work', className = '', style }) => {
  const workExperiences = [
    {
      title: "Software Research Assistant",
      company: "University of Colorado Boulder – Genetic Logic Lab",
      location: "Boulder, CO",
      date: "May 2025 – Present",
      description: "Contributing to the development of SeqImprove, an open-source tool for ML-assisted curation of synthetic biology data. Writing and maintaining backend code, enhancing application performance, and refactoring legacy logic for scalability. Supporting model integration and annotation workflows while collaborating closely with researchers and engineers. Improving project documentation and tooling to support FAIR-compliant data submissions and broader adoption.",
      tags: ["Python", "React", "Machine Learning", "CI/CD", "Full-Stack Development"]
    },
    {
      title: "Frontend Web Developer",
      company: "Ryno Industries",
      location: "Erie, CO",
      date: "May 2023 – Aug 2023",
      description: "Developed and optimized the company website to enhance usability, aesthetic appeal, and performance, resulting in a 20% increase in user engagement. Built responsive components using HTML, CSS, and JavaScript, ensuring cross-device compatibility. Worked closely with leadership to translate business goals into visual updates and interactive features.",
      tags: ["HTML", "CSS", "JavaScript", "UI/UX",]
    },
  ];

  const leadershipExperiences = [
    {
      title: "Software Engineer Team Lead",
      company: "Blueprint Boulder",
      location: "Boulder, CO",
      date: "March 2025 – Present",
      description: "Leading a student software team building a trailer booking and volunteer scheduling system for Need Project, a nonprofit supporting families with special needs. Serving as the primary client liaison, translating stakeholder requirements into actionable technical features. Managing Agile workflows, running standups, and ensuring consistent delivery of milestones.",
      tags: ["Leadership", "Client Liaison", "Full-Stack Development", "Agile"]
    },
    {
      title: "Co-Founder & Engineer",
      company: "Fly on the Wall",
      location: "Boulder, CO",
      date: "May 2025 – Present",
      description: "Launched a student-led dev studio building AI-powered productivity apps published to the App Store. Led app architecture, brand strategy, and GitHub org setup under a formal LLC.",
      tags: ["Leadership", "Full-Stack Development", "App Architecture"]
    },
  ];

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
        {workExperiences.map((exp, index) => (
          <div 
            key={index} 
            className="card p-6" 
            style={{ borderRadius: '0.9rem' }}
          >
            <div className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                <h2 className="text-xl font-semibold">{exp.title}</h2>
                <span className="text-gray-400">–</span>
                <h3 className="text-lg text-primary">{exp.company}</h3>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2 text-gray-400">
                  <span className="hidden sm:inline">|</span>
                  <span>{exp.location}</span>
                  <span className="hidden sm:inline">|</span>
                  <span>{exp.date}</span>
                </div>
              </div>
              <p className="text-gray-300 mt-2">{exp.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {exp.tags.map((tag, tagIndex) => (
                  <span 
                    key={tagIndex}
                    className="bg-[#2563eb]/10 text-[#60a5fa] px-2 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <h2 className="mt-12 font-serif font-bold sm:text-3xl text-2xl">Leadership Experience &rarr;</h2>
      <div className="grid gap-6 mt-8">
        {leadershipExperiences.map((exp, index) => (
          <div 
            key={index} 
            className="card p-6" 
            style={{ borderRadius: '0.9rem' }}
          >
            <div className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                <h2 className="text-xl font-semibold">{exp.title}</h2>
                <span className="text-gray-400">–</span>
                <h3 className="text-lg text-primary">{exp.company}</h3>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2 text-gray-400">
                  <span className="hidden sm:inline">|</span>
                  <span>{exp.location}</span>
                  <span className="hidden sm:inline">|</span>
                  <span>{exp.date}</span>
                </div>
              </div>
              <p className="text-gray-300 mt-2">{exp.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {exp.tags.map((tag, tagIndex) => (
                  <span 
                    key={tagIndex}
                    className="bg-[#2563eb]/10 text-[#60a5fa] px-2 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Work; 