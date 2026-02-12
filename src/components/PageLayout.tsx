import React, { useEffect } from 'react';
import { ThemeProvider } from '../hooks/useTheme';
import Header from './Header';
import Footer from './Footer';
import SEO from './SEO';
import { setupRevealAnimation, setupSectionAnimations } from '../utils/revealOnScroll';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, title, description }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setupRevealAnimation();
      setupSectionAnimations();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <SEO
        title={title}
        description={description || `Conner Groth - ${title}`}
      />
      <Header />
      <main className="absolute top-0 left-0 z-10 w-full h-full bg-black">
        <div className="md:max-w-7xl 2xl:mx-auto xl:mx-32 lg:mx-32 md:mx-24 sm:mx-16 mx-10">
          {children}
          <Footer />
        </div>
      </main>
    </ThemeProvider>
  );
};

export default PageLayout;
