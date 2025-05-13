import React, { useEffect } from 'react';
import { ThemeProvider } from '../hooks/useTheme';
import Header from '../components/Header';
import Hero from '../sections/Hero';
import Projects from '../sections/Projects';
import About from '../sections/About';
import Contact from '../sections/Contact';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import SEO from '../components/SEO';
import { PersonSchema, WebsiteSchema } from '../components/StructuredData';
import { setupRevealAnimation, setupSectionAnimations } from '../utils/revealOnScroll';

const Index = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Initialize animations once loading is complete
  useEffect(() => {
    if (!isLoading) {
      // Wait a small amount of time for the DOM to fully render
      setTimeout(() => {
        setupRevealAnimation();
        setupSectionAnimations();
      }, 100);
    }
  }, [isLoading]);
  
  const Spacer = () => (
    <div className="sm:mt-[30vh] mt-[20vh]" aria-hidden="true">
      <div></div>
    </div>
  );
  
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
          <main className="absolute top-0 left-0 z-10 w-full h-full">
            <div className="md:max-w-7xl 2xl:mx-auto xl:mx-32 lg:mx-32 md:mx-24 sm:mx-16 mx-10">
              <Hero />
              <Spacer />
              <About />
              <Spacer />
              <Projects />
              <div className="mt-[18vh]" aria-hidden="true">
                <div></div>
              </div>
              <Contact />
              <Footer />
            </div>
          </main>
        </>
      )}
    </ThemeProvider>
  );
};

export default Index; 