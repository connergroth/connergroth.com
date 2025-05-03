import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ThemeProvider, useTheme } from '../hooks/useTheme';
import '../styles/photography.css'; // Import the CSS instead of using style jsx

// Photo metadata for manual ordering and display
interface PhotoData {
  src: string;
  title: string;
  location: string;
}

const PhotographyContent = () => {
  // State for photos, loading status, and selected photo for expanded view
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const { theme } = useTheme();
  const [logoSrc, setLogoSrc] = useState('/assets/logos/handwrittendark.png');

  // Update logo when theme changes
  useEffect(() => {
    setLogoSrc(theme === 'dark' ? '/assets/logos/handwritten.png' : '/assets/logos/handwrittendark.png');
  }, [theme]);

  // Manually ordered photo data - rearrange these to change the display order
  const photoData: PhotoData[] = [
    // Balanced mix of horizontal and vertical photos for best layout
    {
      src: '/assets/photos/maroonbells.JPG',
      title: 'Maroon Bells',
      location: 'Aspen, Colorado'
    },
    {
      src: '/assets/photos/worldtrade.JPG',
      title: 'World Trade Center',
      location: 'New York City, NY'
    },
    {
      src: '/assets/photos/fox.JPG',
      title: 'Arctic Fox',
      location: 'Wildlife Reserve'
    },
    {
      src: '/assets/photos/waterfall.JPG',
      title: 'Waterfall',
      location: 'Kauai, Hawaii'
    },
    {
      src: '/assets/photos/centralpark.JPG',
      title: 'Central Park',
      location: 'New York City, NY'
    },
    {
      src: '/assets/photos/grenade.JPG',
      title: 'Grenade Falls',
      location: 'Montana'
    },
    {
      src: '/assets/photos/napali.JPG',
      title: 'Na Pali Coast',
      location: 'Kauai, Hawaii'
    },
    {
      src: '/assets/photos/thevessel.JPG',
      title: 'The Vessel',
      location: 'New York City, NY'
    },
    {
      src: '/assets/photos/flatirons.JPG',
      title: 'Flatirons',
      location: 'Boulder, Colorado'
    },
    {
      src: '/assets/photos/kauaiaribnb.JPG',
      title: 'Kauai View',
      location: 'Kauai, Hawaii'
    },
    {
      src: '/assets/photos/waves.JPG',
      title: 'Ocean Waves',
      location: 'Kauai, Hawaii'
    },
    {
      src: '/assets/photos/skyline.JPG',
      title: 'City Skyline',
      location: 'New York City, NY'
    },
    {
      src: '/assets/photos/sunrise.JPG',
      title: 'Sunrise',
      location: 'Rocky Mountain National Park'
    },
    {
      src: '/assets/photos/palm.JPG',
      title: 'Palm Beach',
      location: 'Hawaii'
    },
    {
      src: '/assets/photos/lights.JPG',
      title: 'City Lights',
      location: 'Manhattan, NY'
    }
  ];

  // Load photos
  useEffect(() => {
    try {
      setPhotos(photoData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading photos:', error);
      setLoading(false);
    }
  }, []);

  // Function to handle photo click for expanded view
  const handlePhotoClick = (photoSrc: string) => {
    setSelectedPhoto(photoSrc);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  // Function to close expanded view
  const closeExpandedView = () => {
    setSelectedPhoto(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="max-w-[1920px] mx-auto px-1 md:px-2">
        {/* Logo */}
        <div className="mb-12 flex justify-center px-4">
          <img 
            src={logoSrc} 
            alt="Conner Groth Photography" 
            className="h-32 md:h-48 lg:h-56 w-auto object-contain"
          />
        </div>
        
        {/* Page title - visually hidden but good for SEO and accessibility */}
        <h1 className="sr-only">Photography Portfolio</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : photos.length > 0 ? (
          <div className="masonry-grid">
            {photos.map((photo, index) => (
              <div 
                key={index}
                className="masonry-item cursor-pointer"
                onClick={() => handlePhotoClick(photo.src)}
              >
                <img 
                  src={photo.src} 
                  alt={photo.title}
                  loading="lazy"
                />
                <div className="absolute bg-black/0 group-hover:bg-black/30 transition-all duration-300 opacity-0 hover:opacity-100">
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <h3 className="text-white font-bold">{photo.title}</h3>
                    <p className="text-white/80 text-sm">{photo.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-lg text-muted-foreground mb-2">No photos found</p>
            <p className="text-sm text-muted-foreground">Add photos to the public/assets/photos directory to display them here.</p>
          </div>
        )}
      </div>
      
      {/* Full-screen photo modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeExpandedView}
        >
          <button 
            className="absolute top-6 right-6 text-white hover:text-gray-300 z-10"
            onClick={closeExpandedView}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            <span className="sr-only">Close</span>
          </button>
          <img 
            src={selectedPhoto} 
            alt="Expanded view" 
            className="max-h-[95vh] max-w-[95vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
      
      <Footer />
    </main>
  );
};

const Photography = () => {
  return (
    <ThemeProvider>
      <PhotographyContent />
    </ThemeProvider>
  );
};

export default Photography; 