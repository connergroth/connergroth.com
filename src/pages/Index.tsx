import React, { useEffect } from 'react';
import { ThemeProvider } from '../hooks/useTheme';
import Header from '../components/Header';
import Hero from '../sections/Hero';
import Loader from '../components/Loader';
import SEO from '../components/SEO';
import { PersonSchema, WebsiteSchema } from '../components/StructuredData';

const Index = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <SEO
        title="Home"
        description="Conner Groth - Software Engineer and CS Student passionate about building innovative solutions. View my portfolio, projects, and skills."
        keywords="Conner Groth, software engineer, portfolio, web development, CS student, projects, programming"
      />
      <PersonSchema
        name="Conner Groth"
        jobTitle="Software Engineer"
        url="https://connergroth.com"
        imageUrl="/assets/images/favicon.png"
        description="Software Engineer and CS Student specializing in AI, web development, and data-driven applications."
        sameAs={[
          "https://github.com/ConnerGroth",
          "https://linkedin.com/in/connergroth"
        ]}
      />
      <WebsiteSchema
        name="Conner Groth - Portfolio"
        url="https://connergroth.com"
        description="Personal portfolio website of Conner Groth, a Software Engineer and CS Student"
        author="Conner Groth"
      />
      <Loader isLoading={isLoading} />

      {!isLoading && (
        <>
          <Header />
          <main className="absolute top-0 left-0 z-10 w-full h-screen bg-white overflow-hidden">
            <div className="md:max-w-7xl 2xl:mx-auto xl:mx-32 lg:mx-32 md:mx-24 sm:mx-16 mx-10 ">
              <Hero />
            </div>
          </main>
        </>
      )}
    </ThemeProvider>
  );
};

export default Index;
