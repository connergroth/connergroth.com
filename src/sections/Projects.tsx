import React from 'react';
// ProjectCard is imported but not used in this file
// import ProjectCard from '../components/ProjectCard';

interface Project {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
}

interface ProjectsProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

const programmingProjects: Project[] = [
  {
    title: "MovieMate",
    description: "A full-featured social platform for movie lovers to connect, rate films, and discover trending releases — all powered by real-time messaging and movie data APIs.",
    image: "/assets/images/moviemate.PNG",
    technologies: ["Node.js", "JavaScript", "Express", "Socket.io", "PostgreSQL", "Handlebars", "Bootstrap"],
    liveUrl: "https://csci3308-moviemate.onrender.com",
    githubUrl: "https://github.com/Joe-Z-School/CSCI3308-MovieMate"
  },
  {
    title: "TailorIQ",
    description: "An AI-powered resume builder that instantly generates polished, ATS-optimized resumes tailored to specific job descriptions.",
    image: "/assets/images/tailoriqdemo.PNG",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Firebase", "OpenAI API", "Express", "Puppeteer"],
    liveUrl: "https://tailoriq.onrender.com/",
    githubUrl: "https://github.com/connergroth/tailoriq"
  }
];

const devopsProjects: Project[] = [
  {
    title: "AOTY API",
    description: "A high-performance, unofficial REST API for albumoftheyear.org that provides comprehensive album data, ratings, and user profiles with intelligent caching and robust rate limiting.",
    image: "/assets/images/AOTY API Logo.png",
    technologies: ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker", "AWS"],
    githubUrl: "https://github.com/connergroth/aoty-api"
  },
  {
    title: "Strim",
    description: "A powerful tool for trimming Strava activities and editing metadata with automatic deletion and reupload using the Strava API.",
    image: "/assets/images/strimDemoImage.PNG",
    technologies: ["Python", "Flask", "JavaScript", "HTML", "CSS"],
    liveUrl: "https://strimrun.vercel.app",
    githubUrl: "https://github.com/connergroth/Strim"
  }
];

const mlProjects: Project[] = [
  {
    title: "Tensoe",
    description: "A hybrid music recommendation engine powered by collaborative filtering, content-based analysis, and user ratings from Spotify, Last.fm, and Albumoftheyear.org.",
    image: "/assets/images/tensoe.png",
    technologies: ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker", "Spotify API"],
    liveUrl: "https://tensoe.com",
    githubUrl: "https://github.com/connergroth/Tensoe"
  },
  {
    title: "EcoVision",
    description: "An intelligent recycling assistant leveraging computer vision and AI to identify recyclable items in real-time with personalized disposal instructions.",
    image: "/assets/images/EcoVisionDemoImage.jpg",
    technologies: ["PyTorch", "Next.js", "React", "OpenAI API", "TypeScript", "Tailwind CSS", "Python", "FastAPI", "Docker"],
    liveUrl: "https://ecovisionlive.vercel.app",
    githubUrl: "https://github.com/connergroth/EcoVision"
  }
];

const studioProjects: Project[] = [
  {
    title: "PulsePlan",
    description: "An AI-powered academic planner that intelligently manages your time based on energy levels, due dates, and preferences. Features seamless Canvas and Google Calendar integration.",
    image: "/assets/images/pulseplan.jpg",
    technologies: ["React", "TypeScript", "GPT-4", "Custom ML", "Canvas API", "Google Calendar API"],
    liveUrl: "https://pulseplan.app",
    githubUrl: "https://github.com/flyonthewalldev/pulseplan"
  },
];

const ProjectCategory: React.FC<{ 
  title: string | React.ReactNode, 
  projects: Project[],
  subheading?: string | React.ReactNode 
}> = ({ title, projects, subheading }) => (
  <>
    <h2 className="mt-24 font-serif font-bold sm:text-3xl text-2xl">
      {title} →
    </h2>
    {subheading && (
      <p className="mt-2 text-gray-400 text-lg">
        {subheading}
      </p>
    )}
    
    <div className="projects-container">
      <div className="project-list flex flex-col md:flex-row overflow-x-auto no-scrollbar md:gap-8">
        {projects.map((project, index) => (
          <article 
            key={index} 
            className="flex mx-2 md:mx-0 my-10 rounded-lg bg-[#070a0d] bg-opacity-60 shadow cursor-pointer hover:bg-opacity-70 transition-all duration-300 select-none"
            draggable="false"
          >
            <div className="flex flex-col md:w-[22rem]">
              <img 
                src={project.image} 
                className="aspect-video object-cover rounded-t-lg pointer-events-none w-full" 
                alt={project.title}
                style={{ imageRendering: 'auto', maxHeight: '250px' }}
              />
              <div className="p-4 flex flex-col grow justify-between">
                <div>
                  <h3 className="text-xl font-medium text-gray-100">{project.title}</h3>
                  <p className="mt-1 text-gray-300">{project.description}</p>
                </div>
                
                <div>
                  <div className="my-4 flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="tag bg-[#2563eb]/10 text-[#60a5fa] text-xs px-2.5 py-1 whitespace-nowrap">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex flex-row justify-between">
                    {project.liveUrl && (
                      <a className="learn-more-btn text-xs py-1.5 cursor-pointer" href={project.liveUrl} target="_blank" rel="noopener noreferer">
                        <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                          <path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" />
                        </svg>
                        <span className="ml-1.5 font-bold">Try it!</span>
                      </a>
                    )}
                    
                    {project.githubUrl && (
                      <a className="learn-more-btn text-xs py-1.5 cursor-pointer" href={project.githubUrl} target="_blank" rel="noopener noreferer">
                        <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                          <title>GitHub</title>
                          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                        </svg>
                        <span className="ml-1.5">Repo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </>
);

const Projects: React.FC<ProjectsProps> = ({ id = 'projects', className = '', style }) => {
  return (
    <section 
      id={id}
      className={`custom-transition opacity-0 ${className}`}
      style={style}
    >
      <h1 className="font-serif font-bold sm:text-6xl text-4xl"><span style={{ letterSpacing: '-0.01em' }}>M</span>y Work</h1>
      
      <ProjectCategory title="ML Projects" projects={mlProjects} />

      {/* Fly on the Wall Header */}
      <div className="mt-24">
        <h2 className="font-serif font-bold sm:text-3xl text-2xl">
          Fl<span style={{ letterSpacing: '0.01em' }}>y</span> on the Wall →
        </h2>
        <p className="mt-4 text-gray-300 text-lg">
          My roommates and I co-founded Fly on the Wall, a student-led software studio focused on building thoughtful, AI-powered products with personality.
        </p>
        <ul className="mt-2 text-gray-400 text-lg list-disc list-inside">
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
      </div>

      <ProjectCategory 
        title="Studio Projects"
        subheading="Apps built under Fly on the Wall"
        projects={studioProjects}
      />

      <ProjectCategory title="Programming Projects" projects={programmingProjects} />
      <ProjectCategory 
        title={
          <>
            De<span style={{ letterSpacing: '0.03em' }}>v</span><span style={{ letterSpacing: '0.01em' }}>O</span>ps Projects
          </>
        } 
        projects={devopsProjects} 
      />
    </section>
  );
};

export default Projects; 