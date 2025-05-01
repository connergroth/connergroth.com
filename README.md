# Conner Groth Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS.

## Features

- Responsive design that works on all devices
- Dark/light mode with system preference detection
- Modern UI with smooth animations and transitions
- Project showcase with detailed descriptions
- Skills and experience sections
- Contact information
- Optimized performance with modern frontend practices

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Framer Motion for animations
- Vite for fast development and optimized builds

## Project Structure

```
portfolio-website/
├── src/                     # Source files
│   ├── assets/              # Images and other static files
│   ├── components/          # Reusable UI components
│   │   ├── Loader.tsx       # Loading screen component
│   │   └── SectionHeading.tsx # Section header component
│   ├── features/            # Feature-specific components
│   │   ├── about/           # About section components
│   │   ├── contact/         # Contact section components
│   │   ├── home/            # Home section components
│   │   └── projects/        # Projects section components
│   ├── hooks/               # Custom React hooks
│   │   └── useTheme.ts      # Theme management hook
│   ├── layouts/             # Layout components
│   │   └── RootLayout.tsx   # Main layout with header and footer
│   ├── lib/                 # Utility libraries
│   │   └── utils.ts         # Utility functions
│   ├── pages/               # Page components
│   │   └── Home.tsx         # Home page
│   ├── styles/              # Global styles
│   │   └── globals.css      # Global CSS with Tailwind
│   ├── utils/               # Helper utilities
│   ├── App.tsx              # Main App component
│   └── main.tsx             # Entry point
├── public/                  # Public assets
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
```

## Future Enhancements

- Blog section with MDX support
- More interactive project demonstrations
- Animation optimizations for performance
- Integration with a headless CMS for easier content management

## License

MIT
