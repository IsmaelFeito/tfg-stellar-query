import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { authService } from '../services/authService'
import type { LoginRequest, RegisterRequest } from '../services/authService'

/**
 * Hook que encapsula las acciones de autenticación (login, register, logout)
 * y expone el estado del store de forma conveniente.
 */
export function useAuth() {
  const navigate = useNavigate()
  const { token, user, setAuth, logout: storeLogout } = useAuthStore()

  const isAuthenticated = !!token

  const login = useCallback(
    async (credentials: LoginRequest) => {
      const { data } = await authService.login(credentials)
      setAuth(data.token, data.user)
      navigate('/hub', { replace: true })
    },
    [setAuth, navigate],
  )

  const register = useCallback(
    async (payload: RegisterRequest) => {
      const { data } = await authService.register(payload)
      setAuth(data.token, data.user)
      navigate('/hub', { replace: true })
    },
    [setAuth, navigate],
  )

  const logout = useCallback(() => {
    storeLogout()
    navigate('/', { replace: true })
  }, [storeLogout, navigate])

  return { token, user, isAuthenticated, login, register, logout }
}