# Conner Groth Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS featuring interactive WebGL shader effects.

## Features

- Responsive design that works on all devices
- WebGL shader-based interactive blob animations
- Mobile-friendly UI with hamburger menu navigation
- Modern UI with smooth animations and transitions
- Project showcase with detailed descriptions
- Skills and experience sections
- Contact form with validation
- Optimized performance with modern frontend practices

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- p5.js for WebGL shader effects
- Vite for fast development and optimized builds

## Project Structure

```
PortfolioWebsite/
├── src/                          # Source files
│   ├── components/               # Reusable UI components
│   │   ├── BlobShader.tsx        # WebGL shader component for blob effects
│   │   ├── ContactForm.tsx       # Form component with validation
│   │   ├── Footer.tsx            # Footer component
│   │   ├── Header.tsx            # Navigation header with mobile menu
│   │   ├── Loader.tsx            # Loading screen component
│   │   ├── SectionHeading.tsx    # Section heading component
│   │   ├── SEO.tsx               # SEO meta tags component
│   │   ├── SideBars.tsx          # Side navigation and social links
│   │   ├── SocialRow.tsx         # Social media links component
│   │   ├── StructuredData.tsx    # JSON-LD structured data
│   │   └── ui/                   # UI utility components
│   │       ├── sonner.tsx        # Toast notification component
│   │       ├── toaster.tsx       # Toast container component
│   │       └── tooltip.tsx       # Tooltip component
│   ├── hooks/                    # Custom React hooks
│   │   ├── use-toast.ts          # Toast notification hook
│   │   ├── useObserver.ts        # Intersection observer hook
│   │   └── useTheme.tsx          # Theme management hook
│   ├── lib/                      # Utility libraries
│   │   └── utils.ts              # General utility functions
│   ├── pages/                    # Page components
│   │   ├── Index.tsx             # Main page component
│   │   └── NotFound.tsx          # 404 page component
│   ├── sections/                 # Main content sections
│   │   ├── About.tsx             # About section with tech stack
│   │   ├── Contact.tsx           # Contact section
│   │   ├── FlyOnTheWall.tsx      # Startup section
│   │   ├── Hero.tsx              # Hero section with main blob effect
│   │   ├── Projects.tsx          # Projects showcase section
│   │   └── Work.tsx              # Work experience section
│   ├── shaders/                  # GLSL shader files
│   │   ├── shader.frag           # Fragment shader for blob animation
│   │   └── shader.vert           # Vertex shader
│   ├── styles/                   # Global styles
│   │   └── globals.css           # Global CSS with Tailwind
│   ├── types/                    # TypeScript type definitions
│   │   └── env.d.ts              # Environment type definitions
│   ├── utils/                    # Helper utilities
│   │   └── revealOnScroll.ts     # Scroll reveal animations
│   ├── App.tsx                   # Main App component
│   └── main.tsx                  # Entry point
├── public/                       # Public assets
│   ├── assets/                   # Static assets
│   │   ├── documents/            # PDF documents (resume, etc.)
│   │   ├── icons/                # Technology and social icons
│   │   ├── images/               # Project screenshots and photos
│   │   ├── logos/                # Brand logos
│   │   ├── photos/               # Personal photos
│   │   └── textures/             # Background textures
│   ├── CNAME                     # Custom domain configuration
│   ├── favicon.svg               # Favicon
│   ├── robots.txt                # Search engine crawling rules
│   ├── sitemap.xml               # Site structure for SEO
│   └── _headers                  # Netlify headers configuration
├── scripts/                      # Build and utility scripts
│   └── generateSitemap.cjs       # Sitemap generation script
├── index.html                    # HTML template
├── package.json                  # Dependencies and scripts
├── postcss.config.cjs            # PostCSS configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── tsconfig.node.json            # Node-specific TypeScript config
├── vercel.json                   # Vercel deployment configuration
└── vite.config.ts                # Vite configuration
```

## Future Enhancements

- Blog section with MDX support
- More interactive project demonstrations
- Animation optimizations for performance
- Integration with a headless CMS for easier content management
