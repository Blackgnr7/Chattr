import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],  
  server:{
    proxy:{
      '/api': {
        target: 'https://chattr-16i4.onrender.com', // Altere para o URL do seu backend ou site de destino
      },
    }
  }
})
