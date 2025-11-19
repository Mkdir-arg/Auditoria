import apiClient from './apiClient'

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
}

export const nutricionService = {
  async getAlimentos(params?: { search?: string }) {
    const response = await apiClient.get('/nutricion/alimentos/', { params })
    return response.data
  },
}
