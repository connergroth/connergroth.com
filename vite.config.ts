import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  base: './',  // Set base path for GitHub Pages
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    // Use esbuild minifier instead of terser (esbuild is built-in)
    minify: 'esbuild',
    // Don't split chunks to reduce complexity
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // Force .js extension and simplify naming
        entryFileNames: 'assets/app.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
        // Use AMD format which works better with GitHub Pages
        format: 'umd',
        // No code splitting for simpler structure
        manualChunks: undefined,
        // Expose globals to prevent module resolution issues
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
}); 