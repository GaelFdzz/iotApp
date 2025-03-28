import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss(), require('tailwind-scrollbar-hide')],
  server: {
    proxy: {
      '/api': {
        target: 'https://moriahmkt.com/iotapp', // URL base del servidor
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // quita /api del path final
      },
    },
  },
})
