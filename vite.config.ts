import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// ⚠️ IMPORTANT: Set this to your GitHub repository name — currently set to 'quran'.
// e.g., if your repo is 'https://github.com/username/my-quran', set base: '/my-quran/'
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
