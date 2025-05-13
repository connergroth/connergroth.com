import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterCard?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description = "Conner Groth - Software Engineer, Software Research Assistant at CU Boulder",
  keywords = "software engineer, web development, portfolio, react, frontend, CS student",
  ogImage = "/assets/images/favicon.png",
  ogUrl = window.location.href,
  ogType = "website",
  twitterCard = "summary_large_image",
}) => {
  // Use "Conner Groth" as the site title without appending the page name
  const fullTitle = "Conner Groth";
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Conner Groth" />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:type" content={ogType} />
      
      {/* Twitter Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical Link */}
      <link rel="canonical" href={ogUrl} />
    </Helmet>
  );
};

export default SEO; 