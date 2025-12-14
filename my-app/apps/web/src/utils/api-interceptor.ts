import axios from 'axios'
import Logger from './logger'

// Interceptor para requests
axios.interceptors.request.use(
  (config) => {
    const startTime = Date.now()
    config.metadata = { startTime }
    
    Logger.info(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      method: config.method?.toUpperCase(),
      url: config.url,
      action: 'api_request_start'
    })
    
    return config
  },
  (error) => {
    Logger.error('API Request Error', {
      error: error.message,
      action: 'api_request_error'
    })
    return Promise.reject(error)
  }
)

// Interceptor para responses
axios.interceptors.response.use(
  (response) => {
    const endTime = Date.now()
    const startTime = response.config.metadata?.startTime || endTime
    const duration = endTime - startTime
    
    Logger.apiCall(
      response.config.method?.toUpperCase() || 'GET',
      response.config.url || '',
      duration,
      response.status,
      {
        action: 'api_response_success',
        responseSize: JSON.stringify(response.data).length
      }
    )
    
    return response
  },
  (error) => {
    const endTime = Date.now()
    const startTime = error.config?.metadata?.startTime || endTime
    const duration = endTime - startTime
    
    Logger.apiCall(
      error.config?.method?.toUpperCase() || 'GET',
      error.config?.url || '',
      duration,
      error.response?.status || 0,
      {
        action: 'api_response_error',
        errorMessage: error.message,
        errorCode: error.code
      }
    )
    
    return Promise.reject(error)
  }
)

export default axios