import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Custom domain (mp3quran.cam) — base must be '/'
// Only use '/quran/' if serving from https://nasyaldnya.github.io/quran/
export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          query: ['@tanstack/react-query', 'axios'],
          audio: ['howler', 'zustand'],
          animation: ['framer-motion'],
        },
      },
    },
  },
})
