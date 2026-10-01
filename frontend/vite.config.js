import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const apiTarget = process.env.VITE_API_TARGET || 'http://localhost:3001'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    watch: { usePolling: true }, // makes hot reload work inside Docker
    proxy: {
      '/api': { target: apiTarget, changeOrigin: true },
    },
  },
})