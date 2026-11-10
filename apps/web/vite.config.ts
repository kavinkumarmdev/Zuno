import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'cloudflare-spa-fallback',
      closeBundle() {
        const distPath = path.resolve(__dirname, 'dist');
        const indexPath = path.resolve(distPath, 'index.html');
        if (fs.existsSync(indexPath)) {
          fs.copyFileSync(indexPath, path.resolve(distPath, '200.html'));
          fs.copyFileSync(indexPath, path.resolve(distPath, '404.html'));
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@zuno/shared-types': path.resolve(__dirname, '../../packages/shared-types/src'),
      '@zuno/shared-validation': path.resolve(__dirname, '../../packages/shared-validation/src'),
      '@zuno/ui': path.resolve(__dirname, '../../packages/ui/src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-charts': ['recharts'],
          'vendor-icons': ['lucide-react'],
        },
      },
    },
  },
});

