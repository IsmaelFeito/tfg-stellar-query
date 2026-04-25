// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
// })

         // CONFIG POR TESTEAR -> ENLAZAR CON API SPB -> BBDD
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
     proxy: {
      // Todas las llamadas a /api desde el front se redirigen al backend
      // El front usa baseURL: '/api' en api.ts → Vite lo reescribe a http://localhost:8080/api
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // Si en algún momento quieres que el back escuche en /v1/api en vez de /api,
        // descomenta esto para reescribir el prefijo:
        // rewrite: (path) => path.replace(/^\/api/, '/v1/api'),
      },
    },
  },
})