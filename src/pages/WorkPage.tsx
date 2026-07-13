import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import SEO from '../components/SEO';
import DitheredImage from '../components/DitheredImage';
import { projects } from '../data/projects';

const WorkPage = () => {
  return (
    <>
      <SEO
        title="Work — Conner Groth"
        description="Projects by Conner Groth — ML recommenders, research tools, and AI products."
        keywords="Conner Groth, projects, AI, ML, software engineering"
      />

      <Header />

      <main className="max-w-[680px] mx-auto px-6 page-enter">
        <section className="pt-36 md:pt-44 pb-24 md:pb-32">
          <h1 className="font-serif text-[clamp(2.25rem,5vw,3.25rem)] leading-none tracking-[-0.02em] text-stone-900 mb-12 md:mb-16">
            selected projects.
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <Link
                key={project.slug}
                to={`/work/${project.slug}`}
                className="group block rounded-lg overflow-hidden bg-white border border-stone-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-stone-300 hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgba(0,0,0,0.04),0_8px_20px_-8px_rgba(28,25,23,0.14)] active:translate-y-0 active:shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all duration-200"
              >
                <div className="relative aspect-video overflow-hidden bg-stone-100 border-b border-stone-100">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
                  />
                  {/* Dithered veil — resolves to full color on hover */}
                  <DitheredImage
                    src={project.image}
                    className="absolute inset-0 w-full h-full opacity-100 group-hover:opacity-0 transition-opacity duration-300"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-stone-900 font-medium">
                    {project.title}
                  </h3>
                  <p className="text-sm text-stone-500 mt-1.5 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200/80 py-8 px-6">
        <div className="max-w-[680px] mx-auto flex justify-between items-center">
          <span className="text-[0.75rem] text-stone-400">
            &copy; {new Date().getFullYear()} Conner Groth
          </span>
          <a
            href="https://github.com/connergroth/connergroth.com"
            target="_blank"
            rel="noreferrer"
            className="text-[0.75rem] text-stone-400 hover:text-stone-600 transition-colors"
          >
            view source
          </a>
        </div>
      </footer>
    </>
  );
};

export default WorkPage;
