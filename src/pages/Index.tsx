import React, { useEffect } from 'react';
import { ThemeProvider } from '../hooks/useTheme';
import Header from '../components/Header';
import Hero from '../sections/Hero';
import Projects from '../sections/Projects';
import About from '../sections/About';
import Contact from '../sections/Contact';
import Footer from '../components/Footer';
import Loader from '../components/Loader';

const Index = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <ThemeProvider>
      <main className="min-h-screen text-foreground">
        <Loader isLoading={isLoading} />
        
        {!isLoading && (
          <>
            <Header />
            <div className="h-screen overflow-y-scroll scroll-smooth" style={{ scrollSnapType: 'y mandatory' }}>
              <Hero className="scroll-mt-16" style={{ scrollSnapAlign: 'start' }} />
              <Projects className="scroll-mt-16" style={{ scrollSnapAlign: 'start' }} />
              <About className="scroll-mt-16" style={{ scrollSnapAlign: 'start' }} />
              <Contact className="scroll-mt-16" style={{ scrollSnapAlign: 'start' }} />
              <Footer style={{ scrollSnapAlign: 'end' }} />
            </div>
          </>
        )}
      </main>
    </ThemeProvider>
  );
};

export default Index; 