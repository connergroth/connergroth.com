import React, { useState, useEffect, useCallback } from 'react';

interface LoaderProps {
  isLoading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isLoading }) => {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  // Counter runs on mount, independent of isLoading
  useEffect(() => {
    const duration = 850;
    const steps = 100;
    const interval = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      const progress = current / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.min(Math.round(eased * 100), 100));

      if (current >= steps) {
        setCount(100);
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Fade out once both counter is done AND parent says loading is done
  useEffect(() => {
    if (!isLoading && count === 100) {
      setTimeout(() => setFading(true), 150);
      setTimeout(() => setVisible(false), 650);
    }
  }, [isLoading, count]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-500 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <span className="font-serif font-bold text-[20vw] leading-none tracking-tighter text-black/90 select-none tabular-nums">
        {count}
      </span>
    </div>
  );
};

export default Loader;
