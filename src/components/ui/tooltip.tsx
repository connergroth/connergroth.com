import React from 'react';

interface TooltipProps {
  children: React.ReactNode;
}

export const TooltipProvider: React.FC<TooltipProps> = ({ children }) => {
  // This is a minimal implementation to fix the import error
  return <>{children}</>;
}; 