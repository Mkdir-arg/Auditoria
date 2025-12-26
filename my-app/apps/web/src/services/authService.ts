import apiClient from './apiClient'

export const authService = {
  async login(credentials: { username: string; password: string }) {
    const response = await apiClient.post('/token/', credentials)
    return response.data
  },

  async getMe() {
    const response = await apiClient.get('/me/')
    return response.data
  },

  async refreshToken(refreshToken: string) {
    const response = await apiClient.post('/token/refresh/', { refresh: refreshToken })
    return response.data
  },
}
