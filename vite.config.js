import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/FreshCart--FrontEnd/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7219',
        changeOrigin: true,
        secure: false
      }
    }
  }
})