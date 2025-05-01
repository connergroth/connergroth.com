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

export const setupProjectCardFlip = (): void => {
  // This function is now a no-op (empty) since we're handling card flipping with React state
  // We're keeping the function to avoid breaking imports, but it doesn't do anything
  return;
}; 