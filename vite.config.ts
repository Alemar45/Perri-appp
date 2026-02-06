
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  },
  // Fixed: 'historyApiFallback' is not a valid property in Vite's server configuration.
  // Vite dev server handles SPA routing by default, serving index.html for unknown paths.
  server: {
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    sourcemap: false
  }
});
