import { useEffect } from 'react'
import Logger from '../utils/logger'

export const usePerformanceLogger = () => {
  useEffect(() => {
    // Log de métricas de performance cuando la página se carga
    const logPerformanceMetrics = () => {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        
        if (navigation) {
          Logger.performance('Page Load Time', navigation.loadEventEnd - navigation.fetchStart)
          Logger.performance('DOM Content Loaded', navigation.domContentLoadedEventEnd - navigation.fetchStart)
          Logger.performance('First Paint', navigation.responseEnd - navigation.fetchStart)
        }
        
        // Log de métricas de memoria si está disponible
        if ('memory' in performance) {
          const memory = (performance as any).memory
          Logger.performance('Memory Used', memory.usedJSHeapSize, 'bytes')
          Logger.performance('Memory Limit', memory.jsHeapSizeLimit, 'bytes')
        }
      }
    }

    // Ejecutar después de que la página se haya cargado completamente
    if (document.readyState === 'complete') {
      setTimeout(logPerformanceMetrics, 1000)
    } else {
      window.addEventListener('load', () => {
        setTimeout(logPerformanceMetrics, 1000)
      })
    }

    // Log de visibilidad de la página
    const handleVisibilityChange = () => {
      Logger.info(`Página ${document.hidden ? 'oculta' : 'visible'}`, {
        action: 'page_visibility_change',
        hidden: document.hidden
      })
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])
}