import React, { useRef, useState } from 'react';

interface Project {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  landingPage?: string;
  appStoreUrl?: string;
  githubUrl?: string;
}

interface ProjectsProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

const mlProjects: Project[] = [
  {
    title: "PulsePlan",
    description: "An AI-powered academic planner that auto-schedules tasks using energy levels, deadlines, and personal routines. Includes smart Canvas syncing, Calendar integrations, and adaptive planning.",
    image: "/assets/images/pulseplan.PNG",
    technologies: ["React Native", "TypeScript", "Node.js", "n8n", "Supabase", "Redis", "REST APIs", "OpenAI API"],
    landingPage: "https://pulseplan.app",
    appStoreUrl: "https://apps.apple.com/us/app/pulseplan/id6754444444",
    githubUrl: "https://github.com/flyonthewalldev/pulseplan"
  },
  {
    title: "SeqImprove",
    description: "An AI-assisted sequence annotation tool to help synthetic biology researchers curate and annotate genetic designs in SBOL format.  It provides automated annotation suggestions and an intuitive interface for adding metadata to genetic designs.",
    image: "/assets/images/seqimprove.png", 
    technologies: ["React", "JavaScript", "Zustand", "Python", "Flask", "Azure", "SBOL", "SynBioHub APIs"],
    liveUrl: "https://seqimprove.synbiohub.org",
    githubUrl: "https://github.com/MyersResearchGroup/SeqImprove"
  },
  {
    title: "EcoVision",
    description: "An intelligent recycling assistant leveraging computer vision and AI to identify recyclable items in real-time with personalized disposal instructions.",
    image: "/assets/images/EcoVisionDemoImage.jpg",
    technologies: ["PyTorch", "Next.js", "React", "TypeScript", "Tailwind CSS", "Python", "FastAPI", "Docker", "OpenAI API"],
    liveUrl: "https://ecovisionlive.vercel.app",
    githubUrl: "https://github.com/connergroth/EcoVision"
  },
  {
    title: "Tensoe",
    description: "A hybrid music recommendation engine powered by collaborative filtering, content-based analysis, and user ratings from Spotify, Last.fm, and Albumoftheyear.org.",
    image: "/assets/images/tensoe.png",
    technologies: ["PyTorch", "Python", "FastAPI", "React", "PostgreSQL", "Redis", "Spotify API"],
    liveUrl: "https://tensoe.com",
    githubUrl: "https://github.com/connergroth/Tensoe"
  }
];

const programmingProjects: Project[] = [
  {
    title: "MovieMate",
    description: "A full-featured social platform for movie lovers to connect, rate films, and discover trending releases — all powered by real-time messaging and movie data APIs.",
    image: "/assets/images/moviemate.jpg",
    technologies: ["Node.js", "JavaScript", "Express", "Socket.io", "PostgreSQL", "Handlebars", "Bootstrap", "OMDB API"],
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
  },
  {
    title: "AOTY API",
    description: "A high-performance, unofficial REST API for albumoftheyear.org that provides comprehensive album data, ratings, and user profiles with intelligent caching and robust rate limiting.",
    image: "/assets/images/AOTY API Logo.png",
    technologies: ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker"],
    githubUrl: "https://github.com/connergroth/aoty-api"
  },
  {
    title: "Strim",
    description: "A powerful tool for trimming Strava activities and editing metadata with automatic deletion and reupload using the Strava API.",
    image: "/assets/images/strim.PNG",
    technologies: ["Python", "Flask", "JavaScript", "HTML", "CSS", "Strava API"],
    liveUrl: "https://strimrun.vercel.app",
    githubUrl: "https://github.com/connergroth/Strim"
  }
];

const ProjectCategory: React.FC<{ 
  title: string | React.ReactNode, 
  projects: Project[],
  subheading?: string | React.ReactNode 
}> = ({ title, projects, subheading }) => {
  // Carousel drag-to-scroll logic
  const listRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (listRef.current) {
      listRef.current.classList.add('dragging');
      setStartX(e.pageX - listRef.current.offsetLeft);
      setScrollLeft(listRef.current.scrollLeft);
    }
    document.body.style.userSelect = 'none';
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (listRef.current) {
      listRef.current.classList.remove('dragging');
    }
    document.body.style.userSelect = '';
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (listRef.current) {
      listRef.current.classList.remove('dragging');
    }
    document.body.style.userSelect = '';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !listRef.current) return;
    e.preventDefault();
    const x = e.pageX - listRef.current.offsetLeft;
    const walk = x - startX;
    listRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <>
      <h2 className="mt-12 font-serif font-bold sm:text-3xl text-2xl">
        {title} →
      </h2>
      {subheading && (
        <p className="mt-2 text-gray-400 text-lg">
          {subheading}
        </p>
      )}
      <div className="projects-container">
        <div
          ref={listRef}
          className="project-list flex flex-col md:flex-row overflow-x-auto no-scrollbar md:gap-8 scroll-smooth"
          style={{ cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none' }}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {projects.map((project, index) => (
            <article 
              key={index} 
              className="flex mx-2 md:mx-0 my-10 rounded-lg bg-[#070a0d]/60 shadow cursor-pointer hover:bg-opacity-70 transition-all duration-300 select-none"
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
                    {/* Special case: if all 3 button types exist, group them all together */}
                    {(project.liveUrl || project.landingPage) && project.appStoreUrl && project.githubUrl ? (
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {project.liveUrl && (
                          <a className="learn-more-btn text-xs py-1.5 cursor-pointer" href={project.liveUrl} target="_blank" rel="noopener noreferer">
                            <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                              <path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" />
                            </svg>
                            <span className="ml-1.5 font-bold">Try it!</span>
                          </a>
                        )}
                        {project.landingPage && (
                          <a className="learn-more-btn text-xs py-1.5 cursor-pointer" href={project.landingPage} target="_blank" rel="noopener noreferer">
                            <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                              <path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" />
                            </svg>
                            <span className="ml-1.5 font-bold">Landing Page</span>
                          </a>
                        )}
                        {project.appStoreUrl && (
                          <a className="learn-more-btn text-xs py-1.5 cursor-pointer" href={project.appStoreUrl} target="_blank" rel="noopener noreferer">
                            <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                            </svg>
                            <span className="ml-1.5 font-bold">App Store</span>
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
                    ) : (
                      /* Default case: repo button on the right */
                      <div className="flex justify-between items-start">
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                          {project.liveUrl && (
                            <a className="learn-more-btn text-xs py-1.5 cursor-pointer" href={project.liveUrl} target="_blank" rel="noopener noreferer">
                              <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" />
                              </svg>
                              <span className="ml-1.5 font-bold">Try it!</span>
                            </a>
                          )}
                          {project.landingPage && (
                            <a className="learn-more-btn text-xs py-1.5 cursor-pointer" href={project.landingPage} target="_blank" rel="noopener noreferer">
                              <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" />
                              </svg>
                              <span className="ml-1.5 font-bold">Landing Page</span>
                            </a>
                          )}
                          {project.appStoreUrl && (
                            <a className="learn-more-btn text-xs py-1.5 cursor-pointer" href={project.appStoreUrl} target="_blank" rel="noopener noreferer">
                              <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                              </svg>
                              <span className="ml-1.5 font-bold">App Store</span>
                            </a>
                          )}
                        </div>
                        {project.githubUrl && (
                          <a className="learn-more-btn text-xs py-1.5 cursor-pointer ml-2" href={project.githubUrl} target="_blank" rel="noopener noreferer">
                            <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                              <title>GitHub</title>
                              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                            </svg>
                            <span className="ml-1.5">Repo</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
};

const Projects: React.FC<ProjectsProps> = ({ id = 'projects', className = '', style }) => {
  return (
    <section 
      id={id}
      className={`custom-transition opacity-0 ${className}`}
      style={style}
    >
      <h1 className="font-serif font-bold sm:text-6xl text-4xl"><span style={{ letterSpacing: '-0.01em' }}>M</span>y Work</h1>
      
      <ProjectCategory title="AI & ML Projects" projects={mlProjects} />
      <ProjectCategory title="Programming Projects" projects={programmingProjects} />

    </section>
  );
};

export default Projects; 