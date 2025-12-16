import { Institucion, VisitaAuditoria, PlatoObservado, IngredientePlato } from '../types'

export const createAuditoriaService = (apiClient: any) => ({
  // Instituciones
  async getInstituciones(params?: { search?: string; tipo?: string }) {
    const response = await apiClient.get('/auditoria/instituciones/', { params })
    return response.data
  },

  async getInstitucion(id: number) {
    const response = await apiClient.get(`/auditoria/instituciones/${id}/`)
    return response.data
  },

  async createInstitucion(data: Partial<Institucion>) {
    const response = await apiClient.post('/auditoria/instituciones/', data)
    return response.data
  },

  async updateInstitucion(id: number, data: Partial<Institucion>) {
    const response = await apiClient.put(`/auditoria/instituciones/${id}/`, data)
    return response.data
  },

  async deleteInstitucion(id: number) {
    await apiClient.delete(`/auditoria/instituciones/${id}/`)
  },

  // Visitas
  async getVisitas(params?: { institucion?: number; tipo_comida?: string; fecha?: string }) {
    const response = await apiClient.get('/auditoria/visitas/', { params })
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

  async updateVisita(id: number, data: Partial<VisitaAuditoria>) {
    const response = await apiClient.put(`/auditoria/visitas/${id}/`, data)
    return response.data
  },

  async deleteVisita(id: number) {
    await apiClient.delete(`/auditoria/visitas/${id}/`)
  },

  // Platos
  async getPlatos(params?: { visita?: number }) {
    const response = await apiClient.get('/auditoria/platos/', { params })
    return response.data
  },

  async getPlato(id: number) {
    const response = await apiClient.get(`/auditoria/platos/${id}/`)
    return response.data
  },

  async createPlato(data: Partial<PlatoObservado>) {
    const response = await apiClient.post('/auditoria/platos/', data)
    return response.data
  },

  async updatePlato(id: number, data: Partial<PlatoObservado>) {
    const response = await apiClient.put(`/auditoria/platos/${id}/`, data)
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
    const response = await apiClient.get('/auditoria/ingredientes/', { params })
    return response.data
  },

  async createIngrediente(data: Partial<IngredientePlato>) {
    const response = await apiClient.post('/auditoria/ingredientes/', data)
    return response.data
  },

  async updateIngrediente(id: number, data: Partial<IngredientePlato>) {
    const response = await apiClient.put(`/auditoria/ingredientes/${id}/`, data)
    return response.data
  },

  async deleteIngrediente(id: number) {
    await apiClient.delete(`/auditoria/ingredientes/${id}/`)
  },
})
