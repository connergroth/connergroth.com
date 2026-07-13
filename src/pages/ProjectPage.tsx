import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import SEO from '../components/SEO';
import { projects } from '../data/projects';

const ProjectPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);

  if (!project) return <Navigate to="/work" replace />;

  return (
    <>
      <SEO
        title={`${project.title} — Conner Groth`}
        description={project.longDescription}
        keywords={`Conner Groth, ${project.title}, ${project.meta.find((m) => m.label === 'stack')?.value || ''}`}
      />

      <Header />

      <main className="max-w-[680px] mx-auto px-6 project-expand">
        <section className="pt-36 md:pt-44 pb-24 md:pb-32">
          <Link
            to="/work"
            className="text-[0.85rem] text-stone-400 hover:text-stone-900 transition-colors"
          >
            &larr; work
          </Link>

          <h1 className="mt-8 font-serif text-[clamp(2.25rem,5vw,3.25rem)] leading-none tracking-[-0.02em] text-stone-900">
            {project.title}.
          </h1>

          <p className="mt-6 text-[1.05rem] text-stone-600 leading-relaxed">
            {project.longDescription}
          </p>

          <figure className="mt-12">
            <div className="rounded-lg overflow-hidden bg-white border border-stone-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-auto object-contain"
              />
            </div>
            <figcaption className="text-[0.8rem] text-stone-400 mt-4 leading-relaxed">
              {project.figCaption}
            </figcaption>
          </figure>

          <div className="mt-12 space-y-2">
            {project.meta.map(({ label, value }) => (
              <div key={label} className="flex gap-5 text-[0.85rem]">
                <span className="text-stone-400 w-14 shrink-0">{label}</span>
                <span className="text-stone-600">
                  {label === 'site' && project.url ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-500 hover:decoration-2 transition-colors"
                    >
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </span>
              </div>
            ))}
          </div>

          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-10 text-[0.85rem] text-stone-400 hover:text-stone-900 transition-colors"
            >
              view source &rarr;
            </a>
          )}
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

export default ProjectPage;
