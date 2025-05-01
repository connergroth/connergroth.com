import React from 'react';

interface LoaderProps {
  isLoading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500">
      <div className="loader-content text-center">
        <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full mb-6 mx-auto animate-spin"></div>
        <h2 className="text-2xl font-bold text-gradient">Conner Groth</h2>
        <p className="text-muted-foreground mt-2">Loading Portfolio...</p>
      </div>
    </div>
  );
};

export default Loader; 