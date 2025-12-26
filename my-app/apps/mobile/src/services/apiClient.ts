import axios from 'axios'
import { authStore } from '../store/authStore'
import { API_URL } from '../config/api'

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

apiClient.interceptors.request.use((config) => {
  const token = authStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await authStore.logout()
    }
    return Promise.reject(error)
  }
)

export default apiClient
