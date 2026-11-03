import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Puerto 5173: es el que tiene permitido el CORS del backend (mi-api/src/app.js)
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, strictPort: true },
});
