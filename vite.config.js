import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy requests starting with /api to your backend
      '/api': {
        target: `${process.env.VITE_API_URL}`, // Replace with your backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
