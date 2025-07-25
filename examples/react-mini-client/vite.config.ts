import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // All node_modules go into vendor chunk
          if (id.includes('node_modules/')) {
            return 'vendor';
          }
          // Everything else stays in the app chunk
        },
      },
    },
  },
});
