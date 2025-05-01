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
    outDir: 'dist',
    // Ensure ES modules are properly output
    target: 'es2015',
    minify: 'esbuild',
    // Don't split chunks to reduce complexity
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // Use more standard naming pattern with hash for better caching
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
        // Standard ES modules for maximum compatibility
        format: 'es',
        // No code splitting for simpler structure
        manualChunks: undefined
      }
    }
  },
  server: {
    headers: {
      // Set correct MIME types for JavaScript and TypeScript modules
      'Content-Type': 'application/javascript; charset=utf-8'
    }
  },
  preview: {
    headers: {
      // Also apply headers to preview server
      'Content-Type': 'application/javascript; charset=utf-8'
    }
  }
});