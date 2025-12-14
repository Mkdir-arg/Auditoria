import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Card } from './components/Card'
import { Button } from './components/Button'
import Logger from './utils/logger'
import axios from './utils/api-interceptor'
import { usePerformanceLogger } from './hooks/usePerformanceLogger'

interface Item {
  id: number
  name: string
  description: string
  created_at: string
}

const fetchItems = async (): Promise<Item[]> => {
  const { data } = await axios.get('/api/items/')
  return data.results || data
}

function App() {
  const { data: items, isLoading, error } = useQuery({
    queryKey: ['items'],
    queryFn: fetchItems,
  })

  // Hook para logging de performance
  usePerformanceLogger()

  useEffect(() => {
    // Log inicial de la aplicación
    Logger.info('Aplicación iniciada', {
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    })

    // Log de navegación
    const handleNavigation = () => {
      Logger.info('Navegación detectada', {
        url: window.location.href,
        referrer: document.referrer
      })
    }

    window.addEventListener('popstate', handleNavigation)
    return () => window.removeEventListener('popstate', handleNavigation)
  }, [])

  useEffect(() => {
    if (items) {
      Logger.info('Datos cargados exitosamente', {
        itemCount: items.length,
        action: 'data_loaded'
      })
    }
  }, [items])

  useEffect(() => {
    if (error) {
      Logger.error('Error al cargar datos', {
        error: error,
        action: 'data_load_failed'
      })
    }
  }, [error])

  if (isLoading) return <div className="p-8">Cargando...</div>
  if (error) return <div className="p-8 text-red-500">Error al cargar datos</div>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Auditoria</h1>
        
        <div className="mb-6">
          <Button 
            onClick={() => {
              Logger.userAction('Botón clickeado', 'nuevo-item', {
                action: 'button_click',
                buttonText: 'Nuevo Item'
              })
            }}
          >
            Nuevo Item
          </Button>
        </div>

        <div className="grid gap-4">
          {items?.map((item) => (
            <Card key={item.id}>
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-gray-600">{item.description}</p>
              <p className="text-sm text-gray-400 mt-2">
                {new Date(item.created_at).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App