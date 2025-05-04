import React from 'react';
import BlobShader from './BlobShader';

interface LoaderProps {
  isLoading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-500">
      {/* Blob background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ zIndex: 0 }}>
        <BlobShader size={35} opacity={0.7} position="hero" fixed={true} />
      </div>
      
      {/* Modern minimalist loader */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="loader"></div>
        <p className="text-xs text-gray-500 mt-4 tracking-widest">LOADING</p>
      </div>
    </div>
  );
};

export default Loader; 