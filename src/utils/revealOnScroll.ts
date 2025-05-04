export const setupRevealAnimation = (): void => {
  const handleIntersection: IntersectionObserverCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once revealed, no need to observe anymore
        observer.unobserve(entry.target);
      }
    });
  };

  // Configure the observer
  const observer = new IntersectionObserver(handleIntersection, {
    threshold: 0.15,
    rootMargin: '0px'
  });

  // Select all elements with the reveal class
  const elementsToReveal = document.querySelectorAll('.reveal');
  elementsToReveal.forEach(element => {
    observer.observe(element);
  });
};

export const setupSectionAnimations = (): void => {
  const handleSectionIntersection: IntersectionObserverCallback = (entries) => {
    entries.forEach(entry => {
      // When section comes into view, make it visible
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        // When section leaves view, make it invisible again
        // Note: commenting this out will make sections stay visible once they appear
        // entry.target.classList.remove('visible');
      }
    });
  };

  // Configure the observer with appropriate threshold and margin
  const observer = new IntersectionObserver(handleSectionIntersection, {
    threshold: 0.1, // Trigger when at least 10% of the section is visible
    rootMargin: '0px'
  });

  // Select all sections with the custom-transition class
  const sectionsToAnimate = document.querySelectorAll('section.custom-transition');
  sectionsToAnimate.forEach(section => {
    observer.observe(section);
  });
};

export const setupProjectCardFlip = (): void => {
  // This function is now a no-op (empty) since we're handling card flipping with React state
  // We're keeping the function to avoid breaking imports, but it doesn't do anything
  return;
}; 