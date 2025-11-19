import apiClient from './apiClient'

export interface Institucion {
  id: number
  codigo: string
  nombre: string
  tipo: string
  direccion?: string
  barrio?: string
  activo: boolean
}

export interface VisitaAuditoria {
  id: number
  institucion: number
  institucion_nombre?: string
  fecha: string
  tipo_comida: string
  observaciones?: string
  platos?: PlatoObservado[]
}

export interface PlatoObservado {
  id: number
  visita: number
  nombre: string
  tipo_plato?: string
  porciones_servidas?: number
  energia_kcal_total?: number
  proteinas_g_total?: number
  grasas_totales_g_total?: number
  carbohidratos_g_total?: number
  ingredientes?: IngredientePlato[]
}

export interface IngredientePlato {
  id: number
  plato: number
  alimento: number
  alimento_nombre?: string
  cantidad: number
  unidad: string
}

export const auditoriaService = {
  async getInstituciones(params?: { search?: string }) {
    const response = await apiClient.get('/auditoria/instituciones/', { params })
    return response.data
  },

  async createInstitucion(data: Partial<Institucion>) {
    const response = await apiClient.post('/auditoria/instituciones/', data)
    return response.data
  },

  async getVisitas() {
    const response = await apiClient.get('/auditoria/visitas/')
    return response.data
  },

  async getVisita(id: number) {
    const response = await apiClient.get(`/auditoria/visitas/${id}/`)
    return response.data
  },

  async createVisita(data: Partial<VisitaAuditoria>) {
    const response = await apiClient.post('/auditoria/visitas/', data)
    return response.data
  },

  async createPlato(data: Partial<PlatoObservado>) {
    const response = await apiClient.post('/auditoria/platos/', data)
    return response.data
  },

  async createIngrediente(data: Partial<IngredientePlato>) {
    const response = await apiClient.post('/auditoria/ingredientes/', data)
    return response.data
  },

  async deleteIngrediente(id: number) {
    await apiClient.delete(`/auditoria/ingredientes/${id}/`)
  },
}
