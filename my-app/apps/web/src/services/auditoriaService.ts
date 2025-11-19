import apiClient from './apiClient'

export interface Institucion {
  id: number
  codigo: string
  nombre: string
  tipo: string
  direccion?: string
  barrio?: string
  comuna?: string
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
  notas?: string
  energia_kcal_total?: number
  proteinas_g_total?: number
  grasas_totales_g_total?: number
  carbohidratos_g_total?: number
  fibra_g_total?: number
  sodio_mg_total?: number
  ingredientes?: IngredientePlato[]
}

export interface IngredientePlato {
  id: number
  plato: number
  alimento: number
  alimento_nombre?: string
  cantidad: number
  unidad: string
  orden?: number
  energia_kcal?: number
  proteinas_g?: number
  grasas_totales_g?: number
  carbohidratos_g?: number
  fibra_g?: number
  sodio_mg?: number
}

export const auditoriaService = {
  // Instituciones
  async getInstituciones(params?: { search?: string; tipo?: string }) {
    const response = await apiClient.get<{ results: Institucion[] }>('/auditoria/instituciones/', { params })
    return response.data
  },

  async getInstitucion(id: number) {
    const response = await apiClient.get<Institucion>(`/auditoria/instituciones/${id}/`)
    return response.data
  },

  async createInstitucion(data: Partial<Institucion>) {
    const response = await apiClient.post<Institucion>('/auditoria/instituciones/', data)
    return response.data
  },

  async updateInstitucion(id: number, data: Partial<Institucion>) {
    const response = await apiClient.put<Institucion>(`/auditoria/instituciones/${id}/`, data)
    return response.data
  },

  async deleteInstitucion(id: number) {
    await apiClient.delete(`/auditoria/instituciones/${id}/`)
  },

  // Visitas
  async getVisitas(params?: { institucion?: number; tipo_comida?: string; fecha?: string }) {
    const response = await apiClient.get<{ results: VisitaAuditoria[] }>('/auditoria/visitas/', { params })
    return response.data
  },

  async getVisita(id: number) {
    const response = await apiClient.get<VisitaAuditoria>(`/auditoria/visitas/${id}/`)
    return response.data
  },

  async createVisita(data: Partial<VisitaAuditoria>) {
    const response = await apiClient.post<VisitaAuditoria>('/auditoria/visitas/', data)
    return response.data
  },

  async updateVisita(id: number, data: Partial<VisitaAuditoria>) {
    const response = await apiClient.put<VisitaAuditoria>(`/auditoria/visitas/${id}/`, data)
    return response.data
  },

  async deleteVisita(id: number) {
    await apiClient.delete(`/auditoria/visitas/${id}/`)
  },

  // Platos
  async getPlatos(params?: { visita?: number }) {
    const response = await apiClient.get<{ results: PlatoObservado[] }>('/auditoria/platos/', { params })
    return response.data
  },

  async getPlato(id: number) {
    const response = await apiClient.get<PlatoObservado>(`/auditoria/platos/${id}/`)
    return response.data
  },

  async createPlato(data: Partial<PlatoObservado>) {
    const response = await apiClient.post<PlatoObservado>('/auditoria/platos/', data)
    return response.data
  },

  async updatePlato(id: number, data: Partial<PlatoObservado>) {
    const response = await apiClient.put<PlatoObservado>(`/auditoria/platos/${id}/`, data)
    return response.data
  },

  async deletePlato(id: number) {
    await apiClient.delete(`/auditoria/platos/${id}/`)
  },

  async recalcularPlato(id: number) {
    const response = await apiClient.post(`/auditoria/platos/${id}/recalcular/`)
    return response.data
  },

  // Ingredientes
  async getIngredientes(params?: { plato?: number }) {
    const response = await apiClient.get<{ results: IngredientePlato[] }>('/auditoria/ingredientes/', { params })
    return response.data
  },

  async createIngrediente(data: Partial<IngredientePlato>) {
    const response = await apiClient.post<IngredientePlato>('/auditoria/ingredientes/', data)
    return response.data
  },

  async updateIngrediente(id: number, data: Partial<IngredientePlato>) {
    const response = await apiClient.put<IngredientePlato>(`/auditoria/ingredientes/${id}/`, data)
    return response.data
  },

  async deleteIngrediente(id: number) {
    await apiClient.delete(`/auditoria/ingredientes/${id}/`)
  },
}
