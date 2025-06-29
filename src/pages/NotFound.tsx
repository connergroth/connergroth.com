import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';
import { BreadcrumbSchema } from '../components/StructuredData';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <SEO 
        title="Page Not Found"
        description="The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."
        keywords="404, not found, error page"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "https://connergroth.com" },
          { name: "Page Not Found", item: window.location.href }
        ]}
      />
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6 text-gray-200">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <Link 
          to="/" 
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 hover:scale-105 text-white rounded-lg font-medium transition-all duration-300 group"
        >
          <ArrowLeft size={18} className="transition-transform duration-300 group-hover:-translate-x-1" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound; 