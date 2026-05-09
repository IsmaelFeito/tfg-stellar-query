// src/mocks/misiones.mock.ts
// Datos mockeados de las misiones para desarrollo del front
// sin necesidad de tener el back arrancado.
// Estructura idéntica a la que devuelve GET /api/game/misiones

// src/mocks/misiones.mock.ts
// Datos mockeados de las misiones para desarrollo del front
// sin necesidad de tener el back arrancado.
// Estructura idéntica a la que devuelve GET /api/game/misiones
import type { Mision } from '../services/gameService'

export const MISIONS_MOCK: Mision[] = [
  {
    id: 1,
    titulo: 'Tripulación completa',
    descripcion:
      'Los registros de la flota están dispersos. Necesitamos un censo completo de toda la tripulación para comenzar la misión.',
    enunciado: 'Obtén el nombre y estado de todos los tripulantes.',
    nivel: 'basico',
    xpReward: 80,
    orden: 1,
  },
  {
    id: 2,
    titulo: 'Tripulantes activos',
    descripcion:
      'Solo los tripulantes activos pueden participar en la misión de rescate. Identifícalos.',
    enunciado: 'Obtén todos los datos de los tripulantes cuyo estado sea activo.',
    nivel: 'basico',
    xpReward: 100,
    orden: 2,
  },
  {
    id: 3,
    titulo: 'Oficiales de alto rango',
    descripcion:
      'La reparación del reactor requiere oficiales experimentados. Necesitamos a los de mayor rango.',
    enunciado:
      'Obtén el nombre y rango de los tripulantes con rango mayor a 3, ordenados de mayor a menor rango.',
    nivel: 'basico',
    xpReward: 120,
    orden: 3,
  },
  {
    id: 4,
    titulo: 'Naves de la flota',
    descripcion:
      'El mapa de navegación está corrupto. Recupera el inventario completo de naves disponibles.',
    enunciado:
      'Obtén el nombre y descripción de todas las naves, ordenadas alfabéticamente por nombre.',
    nivel: 'basico',
    xpReward: 100,
    orden: 4,
  },
  {
    id: 5,
    titulo: 'Tripulantes heridos o inactivos',
    descripcion:
      'Necesitamos localizar al personal no operativo para evacuar a la enfermería.',
    enunciado:
      'Obtén el nombre y estado de los tripulantes cuyo estado sea herido o inactivo.',
    nivel: 'basico',
    xpReward: 120,
    orden: 5,
  },
  {
    id: 6,
    titulo: 'Tripulantes de la Nebula-7',
    descripcion:
      'El manifiesto de la nave principal está corrupto. Necesitamos saber quién va a bordo.',
    enunciado:
      'Lista el nombre de cada tripulante junto con el nombre de su nave, solo para los de la Nebula-7.',
    nivel: 'intermedio',
    xpReward: 180,
    orden: 6,
  },
  {
    id: 7,
    titulo: 'Personal por departamento',
    descripcion:
      'El sistema de recursos humanos necesita un recuento de efectivos por área para asignar las tareas de reparación.',
    enunciado:
      'Obtén el nombre de cada departamento y el número de tripulantes que tiene, ordenado de mayor a menor.',
    nivel: 'intermedio',
    xpReward: 200,
    orden: 7,
  },
  {
    id: 8,
    titulo: 'Nave y departamento de cada tripulante',
    descripcion:
      'El coordinador de la misión necesita saber en qué nave y área trabaja cada miembro activo.',
    enunciado:
      'Lista el nombre del tripulante, el nombre de su nave y el nombre de su departamento, solo para tripulantes activos.',
    nivel: 'intermedio',
    xpReward: 220,
    orden: 8,
  },
  {
    id: 9,
    titulo: 'Naves con más de un tripulante activo',
    descripcion:
      'Solo las naves con suficiente personal operativo pueden ser despachadas. Identifica cuáles están listas.',
    enunciado:
      'Obtén el nombre de las naves que tienen más de 1 tripulante en estado activo, junto con el recuento.',
    nivel: 'avanzado',
    xpReward: 280,
    orden: 9,
  },
  {
    id: 10,
    titulo: 'El oficial de mayor rango por nave',
    descripcion:
      'Cada nave necesita un comandante. Identifica al tripulante de mayor rango en cada nave.',
    enunciado:
      'Obtén el nombre de la nave y el nombre del tripulante con mayor rango en esa nave.',
    nivel: 'avanzado',
    xpReward: 320,
    orden: 10,
  },
]

// Helpers útiles para filtrar en la UI sin llamar al back
export const getMisionById   = (id: number)     => MISIONS_MOCK.find(m => m.id === id)
export const getMisionesByNivel = (nivel: string) => MISIONS_MOCK.filter(m => m.nivel === nivel)