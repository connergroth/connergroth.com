import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [opacity, setOpacity] = useState(1);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setOpacity(0);
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      setOpacity(1);
    }, 200);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="bg-black min-h-screen">
      <div
        style={{ opacity, transition: 'opacity 200ms ease-in-out' }}
      >
        {children}
      </div>
    </div>
  );
};

export default PageTransition;
