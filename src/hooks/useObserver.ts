import { useState, useEffect, RefObject } from 'react';

interface UseObserverProps {
  threshold?: number;
  rootMargin?: string;
}

export function useObserver<T extends HTMLElement>({
  threshold = 0.1,
  rootMargin = "0px"
}: UseObserverProps = {}) {
  const [ref, setRef] = useState<RefObject<T> | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref?.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once it's visible, we can stop observing
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin }
    );
    
    observer.observe(ref.current);
    
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref, threshold, rootMargin]);

  return { ref: setRef, isVisible };
} 