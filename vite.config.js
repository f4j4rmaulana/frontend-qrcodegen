import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy requests starting with /api to your backend
      '/api': {
        target: 'http://192.168.210.103:3001', // Replace with your backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
