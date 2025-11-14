import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/MaxApp/',
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        // Если бэкенд отдаёт Location-заголовки или нужно точное соответствие хоста
        // secure: false,  // если используешь HTTPS (не нужно в dev)
        // rewrite: (path) => path, // опционально, если нужно изменить путь
      },
    },
  },
});