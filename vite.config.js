import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {

    port: 5173,
    strictPort: true,
  },
  rollupOptions: {
    input: {
      main: 'index.html'
    }
  }
})
