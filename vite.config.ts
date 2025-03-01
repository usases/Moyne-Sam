import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5173,  // Можно поменять на другой порт, если 5173 занят
    open: true,  // Открывает браузер при запуске
    strictPort: true, // Если порт занят, сервер не стартует (будет ошибка)
  }
});
