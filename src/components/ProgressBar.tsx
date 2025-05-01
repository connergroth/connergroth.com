import React, { useEffect, useState } from 'react';

const ProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateScrollProgress = () => {
      const windowHeight = 
        document.documentElement.scrollHeight - 
        document.documentElement.clientHeight;
      
      const scrolled = window.scrollY / windowHeight;
      
      setProgress(scrolled * 100);
    };

    window.addEventListener('scroll', calculateScrollProgress);
    return () => window.removeEventListener('scroll', calculateScrollProgress);
  }, []);

  return <div id="progress-bar" style={{ width: `${progress}%` }}></div>;
};

export default ProgressBar;