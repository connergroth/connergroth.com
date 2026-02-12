import React from 'react';

interface Experience {
  title: string;
  company: string;
  date: string;
  description: string;
}

interface WorkProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

const Work: React.FC<WorkProps> = ({ id = 'work', className = '', style }) => {
  const experiences: Experience[] = [
    {
      title: "Software Engineer",
      company: "IM",
      date: "Sep 2025 – Present",
      description: "Built a real-time AI dialogue system with low-latency voice and memory recall, powering 5,000+ sessions.",
    },
    {
      title: "Undergraduate Researcher",
      company: "CU Boulder – Genetic Logic Lab",
      date: "May 2025 – Present",
      description: "Lead full-stack developer on SeqImprove, an AI-assisted sequence annotation tool for synthetic biology.",
    },
{
      title: "Machine Learning Engineer Intern",
      company: "Sorcea Labs",
      date: "Sep – Dec 2025",
      description: "Built an AWS Lambda + S3 pipeline to process millions of reviews for sentiment analysis-powered recommendations.",
    },
    {
      title: "Software Engineer Intern",
      company: "Soaper",
      date: "Jun – Sep 2025",
      description: "Engineered a voice-activated LLM system and a HIPAA-compliant AI voice agent to call physicians in emergencies.",
    },
  ];

  return (
    <section
      id={id}
      className={`custom-transition opacity-0 ${className}`}
      style={style}
    >
      <h1 className="font-serif font-bold sm:text-6xl text-4xl">Experience</h1>

      <div className="mt-12 max-w-3xl">
        {experiences.map((exp, index) => (
          <div
            key={index}
            className={`py-6 ${index !== experiences.length - 1 ? 'border-b border-gray-800' : ''}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
              <h2 className="text-xl font-semibold text-gray-100">{exp.company}</h2>
              <span className="text-sm text-gray-500">{exp.date}</span>
            </div>
            <p className="text-gray-400 text-sm mt-1">{exp.title}</p>
            <p className="text-gray-300 mt-3 leading-relaxed">{exp.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Work;
