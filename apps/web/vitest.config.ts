import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@zuno/shared-types': path.resolve(__dirname, '../../packages/shared-types/src'),
      '@zuno/shared-validation': path.resolve(__dirname, '../../packages/shared-validation/src'),
      '@zuno/ui': path.resolve(__dirname, '../../packages/ui/src'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,tsx}', 'test/**/*.{test,spec}.{ts,tsx}'],
  },
});

