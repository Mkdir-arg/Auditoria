import { useAuth } from '../hooks/useAuth'
import { Card } from '../components/ui/Card'

export function HomePage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Bienvenido, {user?.first_name || user?.username || 'Usuario'}
        </h2>
        <p className="text-gray-600">
          Panel de control principal del sistema de auditoría
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Métricas Generales</h3>
          <p className="text-gray-600">Resumen de actividades del sistema</p>
          <div className="mt-4 text-3xl font-bold text-blue-600">--</div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Auditorías Activas</h3>
          <p className="text-gray-600">Procesos en curso</p>
          <div className="mt-4 text-3xl font-bold text-green-600">--</div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Reportes Pendientes</h3>
          <p className="text-gray-600">Documentos por revisar</p>
          <div className="mt-4 text-3xl font-bold text-orange-600">--</div>
        </Card>
      </div>
    </div>
  )
}