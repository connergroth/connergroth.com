import React from 'react';

interface ScrollHintProps {
  className?: string;
}

const ScrollHint: React.FC<ScrollHintProps> = ({ className = '' }) => {
  return (
    <div className={`scroll-msg text-center mt-12 font-light text-sm ${className}`}>
      scroll to see more
      <br />
      <svg className="animate-bounce h-5 w-5 mx-auto mt-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12 14.975q-.2 0-.375-.062T11.3 14.7l-4.6-4.6q-.275-.275-.275-.7t.275-.7q.275-.275.7-.275t.7.275l3.9 3.9l3.9-3.9q.275-.275.7-.275t.7.275q.275.275.275.7t-.275.7l-4.6 4.6q-.15.15-.325.213t-.375.062Z" />
      </svg>
    </div>
  );
};

export default ScrollHint; 