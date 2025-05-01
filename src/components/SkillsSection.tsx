import React from 'react';
import SectionHeading from './SectionHeading';

interface SkillCategory {
  title: string;
  icon: string;
  skills: {
    name: string;
    icon: string;
  }[];
}

const SkillsSection: React.FC = () => {
  const skillCategories: SkillCategory[] = [
    {
      title: "Languages",
      icon: "code",
      skills: [
        { name: "Python", icon: "./assets/Python-Dark.svg" },
        { name: "C++", icon: "./assets/CPP.svg" },
        { name: "C", icon: "./assets/C.svg" },
        { name: "JavaScript", icon: "./assets/JavaScript.svg" },
        { name: "HTML", icon: "./assets/HTML.svg" },
        { name: "CSS", icon: "./assets/CSS.svg" }
      ]
    },
    {
      title: "AI & Data",
      icon: "brain",
      skills: [
        { name: "PyTorch", icon: "./assets/PyTorch-Dark.svg" },
        { name: "PostgreSQL", icon: "./assets/PostgreSQL-Dark.svg" },
        { name: "Redis", icon: "./assets/Redis-Dark.svg" }
      ]
    },
    {
      title: "Web & Backend",
      icon: "server",
      skills: [
        { name: "React", icon: "./assets/React-Dark.svg" },
        { name: "FastAPI", icon: "./assets/FastAPI.svg" },
        { name: "Docker", icon: "./assets/Docker.svg" },
        { name: "AWS", icon: "./assets/AWS-Dark.svg" }
      ]
    },
    {
      title: "Tools & Design",
      icon: "pencil",
      skills: [
        { name: "Git", icon: "./assets/Git.svg" },
        { name: "Postman", icon: "./assets/Postman.svg" },
        { name: "Figma", icon: "./assets/Figma-Dark.svg" }
      ]
    }
  ];

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'code':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
        );
      case 'brain':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path></svg>
        );
      case 'server':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect><rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect><line x1="6" x2="6.01" y1="6" y2="6"></line><line x1="6" x2="6.01" y1="18" y2="18"></line></svg>
        );
      case 'pencil':
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>
        );
    }
  };

  return (
    <section id="skills" className="section-padding bg-accent-2/20 relative overflow-hidden">
      {/* Background pattern removed for cleaner look */}
      <div className="container mx-auto relative z-10">
        <SectionHeading subtitle="Explore My" title="Skills" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {skillCategories.map((category, categoryIndex) => (
            <div 
              key={categoryIndex} 
              className={`reveal card-hover-outline bg-card/80 backdrop-blur-sm rounded-2xl p-6 ${categoryIndex > 0 ? `reveal-delay-${categoryIndex * 100}` : ''}`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  {getCategoryIcon(category.icon)}
                </div>
                <h3 className="text-xl font-bold text-gradient">{category.title}</h3>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {category.skills.map((skill, skillIndex) => (
                  <div 
                    key={skillIndex} 
                    className="flex flex-col items-center gap-3 p-3 rounded-lg relative card-hover-outline bg-secondary/10"
                  >
                    <div className="w-12 h-12 bg-card rounded-lg flex items-center justify-center shadow-sm">
                      <img 
                        src={skill.icon} 
                        alt={`${skill.name} icon`} 
                        className="w-7 h-7 object-contain"
                      />
                    </div>
                    <span className="text-sm font-medium text-center">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection; 