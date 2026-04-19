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
    proxy: {
      // Redirige /api/* al backend Spring Boot (puerto 8080 por defecto)
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // Si el backend no tiene el prefijo /api, descomenta la siguiente línea:
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})