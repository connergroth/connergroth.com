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
portfolio-website/
├── src/                     # Source files
│   ├── components/          # Reusable UI components
│   │   ├── BlobShader.tsx   # WebGL shader component for blob effects
│   │   ├── ContactForm.tsx  # Form component with validation
│   │   ├── Footer.tsx       # Footer component
│   │   ├── Header.tsx       # Navigation header with mobile menu
│   │   ├── Loader.tsx       # Loading screen component
│   │   └── SideBars.tsx     # Side navigation and social links
│   ├── hooks/               # Custom React hooks
│   │   └── useTheme.ts      # Theme management hook
│   ├── lib/                 # Utility libraries
│   ├── pages/               # Page components
│   │   └── Index.tsx        # Main page component
│   ├── sections/            # Main content sections
│   │   ├── About.tsx        # About section
│   │   ├── Contact.tsx      # Contact section
│   │   ├── Hero.tsx         # Hero section with main blob effect
│   │   └── Projects.tsx     # Projects showcase section
│   ├── shaders/             # GLSL shader files
│   │   ├── shader.frag      # Fragment shader for blob animation
│   │   └── shader.vert      # Vertex shader
│   ├── styles/              # Global styles
│   │   └── globals.css      # Global CSS with Tailwind
│   ├── utils/               # Helper utilities
│   ├── App.tsx              # Main App component
│   └── main.tsx             # Entry point
├── public/                  # Public assets
│   └── assets/              # Images and static files
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
```

## Future Enhancements

- Blog section with MDX support
- More interactive project demonstrations
- Animation optimizations for performance
- Integration with a headless CMS for easier content management