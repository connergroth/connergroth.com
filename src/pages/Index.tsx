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
            <div className="h-screen snap-y snap-mandatory overflow-y-scroll">
              <Hero className="snap-start" />
              <Projects className="snap-start" />
              <About className="snap-start" />
              <Contact className="snap-start" />
              <Footer className="snap-end" />
            </div>
          </>
        )}
      </main>
    </ThemeProvider>
  );
};

export default Index; 