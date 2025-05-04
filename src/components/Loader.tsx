import React from 'react';
import BlobShader from './BlobShader';

interface LoaderProps {
  isLoading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-500">
      {/* Blob background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ zIndex: 0 }}>
        <BlobShader size={35} opacity={0.7} position="hero" fixed={true} />
      </div>
      
      {/* Just a clean loading circle */}
      <div className="relative z-10">
        <div className="loader"></div>
      </div>
    </div>
  );
};

export default Loader; 