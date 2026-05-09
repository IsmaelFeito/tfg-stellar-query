import api from './api'

// authService: endpoint del back que se comunica con la api

// Interfaces que parametrizan los datos (props) => más facil de mantener, reutilizar y añádir implementaciones
export interface LoginRequest    { username: string; password: string }
export interface RegisterRequest { username: string; email: string; password: string }
export interface AuthResponse    { token: string; user: { id: number; username: string; email: string } }

// Const (struct) de autenticación del login doende se aplican las 
// interfaces para parametrizar el contenido y comunica con los endPts de SpBoot
export const authService = {
  login:    (data: LoginRequest)    => api.post<AuthResponse>('/auth/login', data),
  register: (data: RegisterRequest) => api.post<AuthResponse>('/auth/register', data),
  me:       ()                      => api.get('/auth/me'),
}