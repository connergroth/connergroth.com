import React from 'react';

interface SectionHeadingProps {
  subtitle: string;
  title: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ subtitle, title }) => {
  return (
    <div className="text-center mb-10 md:mb-16">
      <p className="text-sm md:text-base font-medium text-muted-foreground mb-2 tracking-wide font-sans">{subtitle}</p>
      <h2 className="text-3xl md:text-4xl font-bold text-gradient inline-block leading-tight font-heading">{title}</h2>
      <div className="w-20 h-1 bg-primary/30 mx-auto mt-4"></div>
    </div>
  );
};

export default SectionHeading;