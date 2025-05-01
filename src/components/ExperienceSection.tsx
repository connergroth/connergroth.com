import React from 'react';
import SectionHeading from './SectionHeading';

interface TimelineItem {
  period: string;
  title: string;
  company: string;
  description: string;
  tags: string[];
}

const ExperienceSection: React.FC = () => {
  const timelineItems: TimelineItem[] = [
    {
      period: "August 2025 - Present",
      title: "Software Engineer Team Lead",
      company: "Blueprint Boulder",
      description: "Leading a team of developers to build a scheduling and resource management platform for a nonprofit supporting families with special needs. Responsible for project planning, technical guidance, and full-stack development.",
      tags: ["React", "Node.js", "Express", "PostgreSQL"]
    },
    {
      period: "May 2025 - Present",
      title: "Software Research Assistant – Synthetic Biology Data Curation Tools",
      company: "Genetic Logic Lab",
      description: "Contributing to tools for FAIR-compliant genetic data curation in synthetic biology. Supporting backend development and infrastructure for sequence submission and search using platforms like SeqImprove and SynBioHub.",
      tags: ["Python", "FastAPI", "React", "Java"]
    }
  ];

  return (
    <section id="experience" className="section-padding bg-grid">
      <div className="container mx-auto">
        <SectionHeading subtitle="My Professional" title="Experience" />
        
        <div className="max-w-4xl mx-auto mt-16 relative">
          <div className="timeline-container">
            {timelineItems.map((item, index) => (
              <div 
                key={index} 
                className={`mb-16 last:mb-0 reveal ${index > 0 ? `reveal-delay-${index * 200}` : ''}`}
              >
                <div className="timeline-dot"></div>
                <div className="flex flex-col md:flex-row md:items-center mb-2 gap-2">
                  <span className="text-sm font-medium bg-primary/10 text-primary px-4 py-1.5 rounded-full inline-block backdrop-blur-sm">
                    {item.period}
                  </span>
                </div>
                <div className="bg-card/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-[hsl(var(--border))]/50 hover:border-primary/20 transition-all duration-300 hover:shadow-primary/5">
                  <h3 className="text-2xl font-bold mb-1">{item.title}</h3>
                  <h4 className="text-primary font-medium mb-4">{item.company}</h4>
                  <p className="text-foreground/80 mb-6">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, tagIndex) => (
                      <span 
                        key={tagIndex} 
                        className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full transition-all duration-300 hover:bg-primary/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection; 