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

## Setup and Development

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/connergroth/portfolio-website.git
   cd portfolio-website
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be located in the `dist` directory.

## Future Enhancements

- Blog section with MDX support
- More interactive project demonstrations
- Animation optimizations for performance
- Integration with a headless CMS for easier content management

## License

MIT
