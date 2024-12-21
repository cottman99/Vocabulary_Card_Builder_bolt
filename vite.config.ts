import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // 你可以将端口号改为你需要的端口
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
