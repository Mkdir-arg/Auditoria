import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChartBarIcon, BuildingOfficeIcon, ClipboardDocumentCheckIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { reportesService, DashboardStats } from '../services/reportesService'
import { Card } from '../components/ui/Card'

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const data = await reportesService.getDashboardStats()
      setStats(data)
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-6">Cargando estadísticas...</div>

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard de Auditoría</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Instituciones Activas</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{stats?.total_instituciones || 0}</p>
            </div>
            <BuildingOfficeIcon className="w-12 h-12 text-blue-400 opacity-50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Visitas</p>
              <p className="text-3xl font-bold text-green-900 mt-2">{stats?.total_visitas || 0}</p>
            </div>
            <ClipboardDocumentCheckIcon className="w-12 h-12 text-green-400 opacity-50" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Platos Registrados</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">{stats?.total_platos || 0}</p>
            </div>
            <DocumentTextIcon className="w-12 h-12 text-purple-400 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Visitas por Tipo de Comida */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Visitas por Tipo de Comida</h3>
          <div className="space-y-3">
            {stats?.visitas_por_tipo.map((item) => (
              <div key={item.tipo_comida}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize">{item.tipo_comida}</span>
                  <span className="font-semibold">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(item.count / (stats?.total_visitas || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Instituciones por Tipo */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Instituciones por Tipo</h3>
          <div className="space-y-3">
            {stats?.instituciones_por_tipo.map((item) => (
              <div key={item.tipo}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize">{item.tipo}</span>
                  <span className="font-semibold">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${(item.count / (stats?.total_instituciones || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold mb-4">Reportes Disponibles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/reportes/ranking')}
            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors text-left"
          >
            <ChartBarIcon className="w-8 h-8 text-blue-600 mb-2" />
            <div className="font-medium text-blue-900">Ranking de Instituciones</div>
            <div className="text-sm text-blue-700">Por cantidad de visitas</div>
          </button>

          <button
            onClick={() => navigate('/reportes/instituciones')}
            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors text-left"
          >
            <BuildingOfficeIcon className="w-8 h-8 text-green-600 mb-2" />
            <div className="font-medium text-green-900">Reporte por Institución</div>
            <div className="text-sm text-green-700">Análisis detallado</div>
          </button>

          <button
            onClick={() => navigate('/reportes/comparativa')}
            className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors text-left"
          >
            <DocumentTextIcon className="w-8 h-8 text-purple-600 mb-2" />
            <div className="font-medium text-purple-900">Comparativa Nutricional</div>
            <div className="text-sm text-purple-700">Entre instituciones</div>
          </button>
        </div>
      </Card>
    </div>
  )
}
