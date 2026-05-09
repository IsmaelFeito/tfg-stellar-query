// Axios: librería que hace peticiones HTTP

import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axios.create({
  baseURL: '/api', //base de la ruta de las llamadas de la api
  headers: { 
    'Content-Type': 'application/json' 
  },
})

// Interceptor de peticiones
// Añade el JWT a cada petición automáticamente
api.interceptors.request.use(config => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor de respuestas
// Backend ret 401 => cierra sesión (token expired)
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/'
    }
    return Promise.reject(err)
  }
)

export default api