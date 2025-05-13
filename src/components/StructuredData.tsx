import React from 'react';
import { Helmet } from 'react-helmet-async';

interface PersonProps {
  name: string;
  jobTitle: string;
  url: string;
  imageUrl?: string;
  description?: string;
  sameAs?: string[];
}

export const PersonSchema: React.FC<PersonProps> = ({
  name,
  jobTitle,
  url,
  imageUrl,
  description,
  sameAs = []
}) => {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle,
    url,
    ...(imageUrl && { image: imageUrl }),
    ...(description && { description }),
    ...(sameAs.length > 0 && { sameAs })
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(personSchema)}
      </script>
    </Helmet>
  );
};

interface WebsiteProps {
  name: string;
  url: string;
  description?: string;
  author?: string;
}

export const WebsiteSchema: React.FC<WebsiteProps> = ({
  name,
  url,
  description,
  author
}) => {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    ...(description && { description }),
    ...(author && { author: {
      '@type': 'Person',
      name: author
    }})
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
    </Helmet>
  );
};

interface BreadcrumbProps {
  items: Array<{
    name: string;
    item: string;
  }>;
}

export const BreadcrumbSchema: React.FC<BreadcrumbProps> = ({ items }) => {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
}; 