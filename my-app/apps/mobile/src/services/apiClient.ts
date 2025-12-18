import axios from 'axios'
import { authStore } from '../store/authStore'

const apiClient = axios.create({
  baseURL: 'http://10.0.2.2:8000/api',
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