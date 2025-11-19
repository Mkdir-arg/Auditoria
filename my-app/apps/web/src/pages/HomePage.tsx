import { useAuth } from '../hooks/useAuth'
import { Card } from '../components/ui/Card'

export function HomePage() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl p-8 border border-blue-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          ¡Bienvenido, {user?.first_name || user?.username || 'Usuario'}! 👋
        </h1>
        <p className="text-lg text-gray-700">
          Panel de control principal del sistema de auditoría
        </p>
        <div className="mt-4 text-sm text-blue-700 bg-blue-100 px-3 py-1 rounded-full inline-block">
          Último acceso: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">📊 Métricas Generales</h3>
              <p className="text-blue-700 text-sm">Resumen de actividades del sistema</p>
              <div className="mt-4 text-3xl font-bold text-blue-600">125</div>
            </div>
            <div className="text-4xl opacity-20">📈</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">✅ Auditorías Activas</h3>
              <p className="text-green-700 text-sm">Procesos en curso</p>
              <div className="mt-4 text-3xl font-bold text-green-600">8</div>
            </div>
            <div className="text-4xl opacity-20">🔍</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-orange-900 mb-2">📋 Reportes Pendientes</h3>
              <p className="text-orange-700 text-sm">Documentos por revisar</p>
              <div className="mt-4 text-3xl font-bold text-orange-600">3</div>
            </div>
            <div className="text-4xl opacity-20">⏳</div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">🚀 Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors text-left">
            <div className="text-2xl mb-2">📝</div>
            <div className="font-medium text-blue-900">Nueva Auditoría</div>
            <div className="text-sm text-blue-700">Crear proceso</div>
          </button>
          
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors text-left">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-medium text-green-900">Ver Reportes</div>
            <div className="text-sm text-green-700">Consultar datos</div>
          </button>
          
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors text-left">
            <div className="text-2xl mb-2">👥</div>
            <div className="font-medium text-purple-900">Gestionar Usuarios</div>
            <div className="text-sm text-purple-700">Administrar accesos</div>
          </button>
          
          <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors text-left">
            <div className="text-2xl mb-2">⚙️</div>
            <div className="font-medium text-gray-900">Configuración</div>
            <div className="text-sm text-gray-700">Ajustar sistema</div>
          </button>
        </div>
      </Card>
    </div>
  )
}