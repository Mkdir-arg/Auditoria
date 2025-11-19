import apiClient from './apiClient'

export interface CategoriaAlimento {
  id: number
  codigo: string
  nombre: string
}

export interface AlimentoNutricional {
  id: number
  codigo_argenfood: number
  nombre: string
  categoria: number
  categoria_nombre: string
  energia_kcal: number | null
  proteinas_g: number | null
  grasas_totales_g: number | null
  carbohidratos_disponibles_g: number | null
  fibra_g: number | null
  sodio_mg: number | null
}

export const nutricionService = {
  async getCategorias() {
    const response = await apiClient.get<CategoriaAlimento[]>('/nutricion/categorias/')
    return response.data
  },

  async getAlimentos(params?: { search?: string; categoria?: number }) {
    const response = await apiClient.get<{ results: AlimentoNutricional[] }>('/nutricion/alimentos/', { params })
    return response.data
  },

  async getAlimento(id: number) {
    const response = await apiClient.get<AlimentoNutricional>(`/nutricion/alimentos/${id}/`)
    return response.data
  },
}
