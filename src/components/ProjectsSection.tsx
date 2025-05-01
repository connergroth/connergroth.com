import React, { useState } from 'react';
import SectionHeading from './SectionHeading';
import { Github, ExternalLink, Play, X, CheckCircle, Clock } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  detailedDescription: string;
  highlights: string[];
  image: string;
  technologies: string[];
  github?: string;
  demo?: string;
  video?: string;
  status: 'complete' | 'in-progress';
  year: string;
  projectType: 'Hackathon' | 'Group Project' | 'Personal Project';
  featured?: boolean;
  isLive?: boolean;
}

const ProjectsSection: React.FC = () => {
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const projects: Project[] = [
    {
      id: "ecovision",
      title: "EcoVision",
      description: "An intelligent recycling assistant leveraging computer vision and AI to identify recyclable items in real-time with personalized disposal instructions.",
      detailedDescription: "EcoVision is an intelligent recycling assistant that uses computer vision and AI to identify recyclable items in real-time. The application provides personalized disposal instructions based on local recycling guidelines.",
      highlights: [
        "Real-time object detection with 95%+ accuracy",
        "Personalized recycling instructions based on location",
        "Environmental impact tracking and statistics",
        "Mobile-friendly responsive design"
      ],
      image: "./assets/EcoVisionDemoImage.jpg",
      technologies: ["PyTorch-Dark.svg", "TensorFlow-Dark.svg", "NextJS-Dark.svg", "React-Dark.svg", "OpenAI.svg", "TypeScript.svg", "TailwindCSS-Dark.svg", "Python-Dark.svg", "FastAPI.svg", "Docker.svg"],
      github: "https://github.com/connergroth/EcoVision",
      demo: "https://ecovisionlive.vercel.app",
      video: "https://vimeo.com/1062545282",
      status: "complete",
      year: "2025",
      projectType: "Hackathon",
      isLive: true
    },
    {
      id: "aoty-api",
      title: "AOTY API",
      description: "A high-performance, unofficial REST API for albumoftheyear.org that provides comprehensive album data, ratings, and user profiles with intelligent caching and robust rate limiting.",
      detailedDescription: "The AOTY API is a FastAPI-powered service that scrapes and provides structured access to album information, reviews, and user data from albumoftheyear.org. It features intelligent caching with Redis, detailed metrics tracking, and comprehensive error handling.",
      highlights: [
        "RESTful endpoints for albums, similar albums, user profiles, and search",
        "Efficient data scraping with Playwright for accurate results",
        "Redis-backed caching system with fallback to in-memory storage",
        "Rate limiting to prevent abuse and ensure service stability",
        "Detailed API documentation with interactive examples"
      ],
      image: "./assets/AOTY API Logo.png",
      technologies: ["Python-Dark.svg", "FastAPI.svg", "PostgreSQL-Dark.svg", "Redis-Dark.svg", "Docker.svg", "AWS-Dark.svg"],
      github: "https://github.com/connergroth/aoty-api",
      status: "complete",
      year: "2025",
      projectType: "Personal Project",
      isLive: true
    },
    {
      id: "strim",
      title: "Strim",
      description: "A powerful tool for trimming Strava activities and editing metadata with automatic deletion and reupload using the Strava API.",
      detailedDescription: "Strim is a specialized tool for Strava users that allows precise editing of activity data. It enables users to trim unwanted portions of their activities and edit metadata before automatically reuploading to Strava.",
      highlights: [
        "Seamless Strava API integration",
        "Visual activity data editing",
        "Automatic deletion and reupload",
        "Batch processing capabilities"
      ],
      image: "./assets/strimDemoImage.PNG",
      technologies: ["Python-Dark.svg", "Flask-Dark.svg", "JavaScript.svg", "HTML.svg", "CSS.svg"],
      github: "https://github.com/connergroth/Strim",
      demo: "https://strimrun.vercel.app",
      status: "complete",
      year: "2025",
      projectType: "Personal Project",
      isLive: true
    },
    {
      id: "moviemate",
      title: "MovieMate",
      description: "A full-featured social platform for movie lovers to connect, rate films, and discover trending releases — all powered by real-time messaging and movie data APIs.",
      detailedDescription: "MovieMate is a social media platform for film enthusiasts. Users can create profiles, follow friends, write reviews, manage watchlists, and explore trending movies using data from OMDb and YouTube APIs. Built with Node.js, Express, PostgreSQL, and Handlebars, the platform includes real-time chat via Socket.IO, authentication, and Docker-based deployment.",
      highlights: [
        "Movie reviews, watchlists, and social profiles",
        "Explore trending, new, and top-rated movies with smart search",
        "Real-time messaging and interactive news feed",
        "OMDb and YouTube API integration for trailers and metadata",
        "Secure login and session-based authentication with PostgreSQL backend"
      ],
      image: "./assets/moviemate.PNG",
      technologies: ["NodeJS.svg",
      "JavaScript.svg",
      "Express.svg",
      "PostgreSQL-Dark.svg",
      "Bootstrap.svg"],
      github: "https://github.com/Joe-Z-School/CSCI3308-MovieMate",
      demo: "https://csci3308-moviemate.onrender.com",
      video: "https://vimeo.com/1078150699?share=copy",
      status: "complete",
      year: "2025",
      projectType: "Group Project",
      featured: true,
      isLive: true
    },
    {
      id: "tailoriq",
      title: "TailorIQ",
      description: "An AI-powered resume builder that instantly generates polished, ATS-optimized resumes tailored to specific job descriptions.",
      detailedDescription: "TailorIQ streamlines resume creation using AI and automation. Users enter their experience through a dynamic multi-step form, then receive tailored resumes that align with job descriptions. Features include multiple templates, PDF export via Puppeteer, OpenAI-powered bullet optimization, and Google authentication — all built with a modern React + TypeScript frontend and an Express.js backend.",
      highlights: [
        "AI-generated bullet points and resume structure tailored to job descriptions",
        "Modern and customizable LaTeX-styled resume templates",
        "Secure Google Authentication via Firebase",
        "PDF export using Puppeteer",
        "End-to-end full-stack architecture with live deployment"
      ],
      image: "./assets/tailoriq.png",
      technologies: [
        "React-Dark.svg",
        "TypeScript.svg",
        "TailwindCSS-Dark.svg",
        "Firebase-Dark.svg",
        "OpenAI.svg",
        "Express.svg"
      ],
      github: "https://github.com/connergroth/tailoriq",
      demo: "https://tailoriq.onrender.com/",
      status: "complete",
      year: "2025",
      projectType: "Hackathon",
      featured: true,
      isLive: true
    },
    {
      id: "sonance",
      title: "Sonance",
      description: "A hybrid music recommendation engine powered by collaborative filtering, content-based analysis, and user ratings from Spotify, Last.fm, and Albumoftheyear.org.",
      detailedDescription: "A music discovery platform combining data from Spotify, Last.fm and AOTY using hybrid recommendations. Features collaborative filtering via matrix factorization and content-based filtering with genres, moods and ratings.",
      highlights: [
        "Hybrid recommendation system: collaborative + content-based filtering",
        "Integrates Spotify, Last.fm, and Albumoftheyear.org (AOTY) data",
        "Uses NMF for user-song matrix decomposition",
        "TF-IDF + cosine similarity for content-based recommendations",
        "Automatic playlist creation with Spotify API integration",
        "Redis caching for scalable performance",
        "User ratings and mood/genre-based filtering"
      ],
      image: "./assets/sonance.png",
      technologies: [
        "Python-Dark.svg",
        "FastAPI.svg",
        "PostgreSQL-Dark.svg",
        "Redis-Dark.svg",
        "Docker.svg",
        "Spotify.svg",
      ],
      github: "https://github.com/connergroth/sonance",
      demo: "", // Add once deployed
      status: "in-progress",
      year: "2025",
      projectType: "Personal Project",
      featured: true,
      isLive: false
    }
  ];

  const handleFlipToBack = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFlippedCards(prev => ({
      ...prev,
      [id]: true
    }));
  };

  const handleFlipToFront = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFlippedCards(prev => ({
      ...prev,
      [id]: false
    }));
  };

  return (
    <section id="projects" className="section-padding bg-accent-1 bg-grid bg-noise">
      <div className="container mx-auto">
        <SectionHeading subtitle="Browse My Recent" title="Projects" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-16">
          {projects.map((project, index) => (
            <div 
              key={project.id} 
              className={`reveal ${index > 0 ? `reveal-delay-${index * 150}` : ''}`}
            >
              <div className="relative h-[550px] md:h-[580px] card-container">
                <div 
                  className={`
                    absolute w-full h-full transition-transform duration-500 transform-style-3d 
                    ${flippedCards[project.id] ? 'rotate-y-180' : ''} project-card
                  `}
                >
                  {/* Front of card */}
                  <div className="bg-card rounded-2xl border border-[hsl(var(--border))]/50 shadow-sm overflow-hidden
                    absolute w-full h-full inset-0 backface-hidden card-hover-outline">
                    <div className="h-48 overflow-hidden project-card-image">
                      <img 
                        src={project.image} 
                        alt={`${project.title} project`}
                        className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5 h-[calc(100%-12rem)] flex flex-col project-card-content">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{project.title}</h3>
                        {project.isLive && (
                          <span className="text-xs font-medium bg-green-500/10 text-green-500 px-2 py-1 rounded-full border border-green-500/20">
                            Live
                          </span>
                        )}
                      </div>
                      <p className="text-foreground/80 text-sm mb-3">
                        {project.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech, techIndex) => (
                          <img 
                            key={techIndex} 
                            src={`./assets/${tech}`} 
                            alt={tech.split('.')[0]}
                            title={tech.split('.')[0].split('-')[0]}
                            className="w-6 h-6 object-contain hover:scale-110 transition-transform"
                          />
                        ))}
                      </div>
                      
                      <div className="mt-auto">
                        <div className="mb-3">
                          {project.status === 'complete' ? (
                            <div className="flex items-center gap-2 mb-1.5">
                              <CheckCircle size={16} className="text-green-500" />
                              <span className="text-xs font-medium">Completed</span>
                            </div>
                          ) : (
                            <div className="mb-1.5">
                              <div className="flex items-center gap-2 mb-1.5">
                                <Clock size={16} className="text-amber-500" />
                                <span className="text-xs font-medium">In Progress</span>
                              </div>
                              <div className="w-full h-1.5 bg-secondary/50 rounded-full">
                                <div className="h-full bg-amber-500 rounded-full" style={{ width: '60%' }}></div>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                              {project.projectType}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {project.year}
                            </span>
                          </div>
                        </div>
                        
                        <button 
                          onClick={(e) => handleFlipToBack(project.id, e)}
                          className="view-details-btn w-full justify-center py-1.5 border border-primary/20 rounded-md hover:bg-primary/5"
                        >
                          View Details
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Back of card */}
                  <div className="bg-card rounded-2xl border border-[hsl(var(--border))]/50 shadow-sm
                    absolute w-full h-full inset-0 backface-hidden rotate-y-180 flex flex-col">
                    <div className="p-4 flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{project.title}</h3>
                        <button
                          onClick={(e) => handleFlipToFront(project.id, e)}
                          className="btn-icon p-1.5 text-foreground/60 hover:text-foreground"
                          aria-label="Close details"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      
                      <div className="project-details">
                        <p className="text-foreground/90 mb-3 text-sm">
                          {project.detailedDescription}
                        </p>
                        
                        <div className="mb-3">
                          <h4 className="text-sm font-semibold mb-1 uppercase text-muted-foreground">Key Features:</h4>
                          <ul className="grid grid-cols-1 gap-0.5">
                            {project.highlights.map((highlight, hIndex) => (
                              <li key={hIndex} className="flex items-start gap-1 text-sm">
                                <span className="text-primary mt-0.5">•</span>
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-semibold mb-1 uppercase text-muted-foreground">Tech Stack:</h4>
                          <div className="flex flex-wrap gap-1">
                            {project.technologies.map((tech, techIndex) => (
                              <div 
                                key={techIndex}
                                className="flex items-center gap-1 bg-secondary/50 px-1.5 py-0.5 rounded-md"
                              >
                                <img 
                                  src={`./assets/${tech}`} 
                                  alt={tech.split('.')[0]}
                                  className="w-4 h-4 object-contain"
                                />
                                <span className="text-xs font-medium">
                                  {tech.split('.')[0].split('-')[0]}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-[hsl(var(--border))]/30 p-3">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {project.github && (
                          <a 
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn flex items-center gap-1.5 px-3 py-1.5 text-sm bg-secondary rounded-md hover:bg-secondary/70 project-action-btn"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Github size={14} />
                            GitHub
                          </a>
                        )}
                        {project.demo && (
                          <a 
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md project-action-btn"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink size={14} />
                            Live App
                          </a>
                        )}
                        {project.video && (
                          <a 
                            href={project.video}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn flex items-center gap-1.5 px-3 py-1.5 text-sm bg-accent text-white rounded-md hover:bg-accent/90 project-action-btn"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Play size={14} />
                            Video
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection; 