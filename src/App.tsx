import React, { useEffect, useState, useRef } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Lenis from 'lenis';
import Index from './pages/Index';
import AltIndex from './pages/AltIndex';
import WorkPage from './pages/WorkPage';
import ProjectPage from './pages/ProjectPage';

/* Routes that render edge-to-edge — no inset sheet, no rounded border. */
const BARE_ROUTES = ['/alt'];

function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    (window as any).__lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      delete (window as any).__lenis;
    };
  }, []);

  return <>{children}</>;
}

function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (BARE_ROUTES.includes(location.pathname)) {
    return (
      <div key={location.pathname} className="relative min-h-svh bg-[#FBFBFA]">
        {children}
      </div>
    );
  }

  return (
    <div key={location.pathname}>
      {/* The sheet — page content sits on a bordered panel over the grainy desk */}
      <div className="relative m-2 md:m-3 min-h-[calc(100svh-1rem)] md:min-h-[calc(100svh-1.5rem)] rounded-xl md:rounded-2xl border border-stone-200/90 bg-[#FBFBFA] shadow-[0_1px_2px_rgba(0,0,0,0.03),0_12px_32px_-16px_rgba(28,25,23,0.1)] overflow-clip">
        {children}
      </div>
    </div>
  );
}

const App = () => (
  <HelmetProvider>
    <BrowserRouter>
      <SmoothScroll>
        <PageTransition>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/alt" element={<AltIndex />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/work/:slug" element={<ProjectPage />} />
            <Route path="*" element={<Index />} />
          </Routes>
        </PageTransition>
      </SmoothScroll>
    </BrowserRouter>
    <Analytics
      beforeSend={(event) =>
        typeof window !== 'undefined' && localStorage.getItem('va-ignore')
          ? null
          : event
      }
    />
  </HelmetProvider>
);

export default App;
