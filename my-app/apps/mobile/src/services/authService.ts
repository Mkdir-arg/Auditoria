import axios from 'axios'
import apiClient from './apiClient'

interface LoginCredentials {
  username: string
  password: string
}

interface LoginResponse {
  access: string
  refresh: string
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await axios.post('http://localhost:8000/api/token/', credentials)
    return response.data
  },

  async getMe() {
    const response = await apiClient.get('/me/')
    return response.data
  },

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await axios.post('http://localhost:8000/api/token/refresh/', {
      refresh: refreshToken,
    })
    return response.data
  },
}