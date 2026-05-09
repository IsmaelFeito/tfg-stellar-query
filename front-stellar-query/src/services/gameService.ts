import api from './api'


//misma lógica que authService.ts
export interface QueryRequest  { query: string; misionId: number }

// Define response de GameService de Java(back)
export interface QueryResponse {
  success:   boolean
  rows?:     Record<string, unknown>[]
  columns?:  string[]
  message?:  string
  xp?:       number
  feedback?: string
}

export interface Mision {
  id:          number
  titulo:      string
  descripcion: string
  enunciado:   string
  nivel:       string
  xpReward:    number
  orden:       number
}

export interface Progreso {
  misionId:    number
  completada:  boolean
  intentos:    number
  xpGanado:    number
}

export const gameService = {
  getMisiones:   ()                       => api.get<Mision[]>('/game/misiones'),
  getMision:     (id: number)             => api.get<Mision>(`/game/misiones/${id}`),
  executeQuery:  (data: QueryRequest)     => api.post<QueryResponse>('/game/query', data),
  getProgreso:   ()                       => api.get<Progreso[]>('/game/progreso'),
}