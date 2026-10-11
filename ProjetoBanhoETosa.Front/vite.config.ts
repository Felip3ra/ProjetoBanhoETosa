import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5159',
        changeOrigin: true,
        secure: false, // mantém falso caso use HTTPS em algum momento
      }
    }
  }
})
