import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.txt'], // Add support for importing .txt files
  server: {
    host: true, // Needed for proper WebSocket connection
    strictPort: true,
    port: 5173,
    hmr: {
      clientPort: 443 // Force client to use SSL port
    }
  }
})