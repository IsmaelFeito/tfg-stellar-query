import api from './api'

export interface LoginRequest    { username: string; password: string }
export interface RegisterRequest { username: string; email: string; password: string }
export interface AuthResponse    { token: string; user: { id: number; username: string; email: string } }

export const authService = {
  login:    (data: LoginRequest)    => api.post<AuthResponse>('/auth/login', data),
  register: (data: RegisterRequest) => api.post<AuthResponse>('/auth/register', data),
  me:       ()                      => api.get('/auth/me'),
}