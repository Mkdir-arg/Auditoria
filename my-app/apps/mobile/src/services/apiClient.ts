import axios from 'axios'
import { authStore } from '../store/authStore'

// Para emulador Android: http://10.0.2.2:8000/api
// Para celular físico: http://TU_IP_LOCAL:8000/api (ejemplo: http://192.168.1.100:8000/api)
const apiClient = axios.create({
  baseURL: 'http://192.168.1.204:8000/api',
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