import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import ExperienceSection from '../components/ExperienceSection';
import SkillsSection from '../components/SkillsSection';
import ProjectsSection from '../components/ProjectsSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import ProgressBar from '../components/ProgressBar';
import { setupRevealAnimation, setupProjectCardFlip } from '../utils/revealOnScroll';
import { ThemeProvider } from '../hooks/useTheme';

const Index = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (!isLoading) {
      setupRevealAnimation();
      setupProjectCardFlip();
    }
  }, [isLoading]);
  
  return (
    <ThemeProvider>
      <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <Loader isLoading={isLoading} />
        <ProgressBar />
        
        {!isLoading && (
          <>
            <Navbar />
            <HeroSection />
            <AboutSection />
            <ExperienceSection />
            <SkillsSection />
            <ProjectsSection />
            <ContactSection />
            <Footer />
          </>
        )}
      </main>
    </ThemeProvider>
  );
};

export default Index; 