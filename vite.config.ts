import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      // Force Rollup to use the JS implementation
      context: 'globalThis',
    }
  },
  optimizeDeps: {
    // Force Vite to use WASM version of Rollup
    needsInterop: ['rollup']
  }
});