import React, { useState, useEffect } from 'react'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { reportesService, ReporteInstitucion } from '../services/reportesService'
import { auditoriaService, Institucion } from '../services/auditoriaService'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Button } from '../components/ui/Button'

export const ReporteInstitucionPage: React.FC = () => {
  const navigate = useNavigate()
  const [instituciones, setInstituciones] = useState<Institucion[]>([])
  const [selectedInstitucion, setSelectedInstitucion] = useState<number>(0)
  const [reporte, setReporte] = useState<ReporteInstitucion | null>(null)
  const [loading, setLoading] = useState(false)
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')

  useEffect(() => {
    loadInstituciones()
  }, [])

  const loadInstituciones = async () => {
    try {
      const data = await auditoriaService.getInstituciones()
      setInstituciones(data.results)
    } catch (error) {
      console.error('Error loading instituciones:', error)
    }
  }

  const loadReporte = async () => {
    if (!selectedInstitucion) return

    try {
      setLoading(true)
      const data = await reportesService.getReporteInstitucion(selectedInstitucion, {
        fecha_inicio: fechaInicio || undefined,
        fecha_fin: fechaFin || undefined,
      })
      setReporte(data)
    } catch (error) {
      console.error('Error loading reporte:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <Button onClick={() => navigate('/dashboard')} className="mb-4 bg-gray-500 hover:bg-gray-600">
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Volver
      </Button>

      <h1 className="text-2xl font-bold mb-6">Reporte por Institución</h1>

      <Card className="mb-6">
        <h3 className="font-semibold mb-4">Seleccionar Institución</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            label="Institución"
            options={[
              { value: 0, label: 'Seleccione...' },
              ...instituciones.map((i) => ({ value: i.id, label: i.nombre })),
            ]}
            value={selectedInstitucion}
            onChange={(e) => setSelectedInstitucion(Number(e.target.value))}
          />
          <Input
            label="Fecha Inicio"
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
          <Input
            label="Fecha Fin"
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
          <div className="flex items-end">
            <Button onClick={loadReporte} disabled={!selectedInstitucion} className="w-full">
              Generar Reporte
            </Button>
          </div>
        </div>
      </Card>

      {loading && <p>Cargando reporte...</p>}

      {reporte && (
        <div className="space-y-6">
          {/* Info Institución */}
          <Card>
            <h3 className="text-xl font-bold mb-2">{reporte.institucion.nombre}</h3>
            <p className="text-gray-600">
              Código: {reporte.institucion.codigo} | Tipo: {reporte.institucion.tipo}
            </p>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h4 className="font-semibold mb-4">Resumen</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Visitas:</span>
                  <span className="font-bold">{reporte.total_visitas}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Platos:</span>
                  <span className="font-bold">{reporte.total_platos}</span>
                </div>
              </div>
            </Card>

            <Card>
              <h4 className="font-semibold mb-4">Visitas por Tipo de Comida</h4>
              <div className="space-y-2">
                {reporte.visitas_por_tipo_comida.map((item) => (
                  <div key={item.tipo_comida} className="flex justify-between">
                    <span className="capitalize">{item.tipo_comida}:</span>
                    <span className="font-bold">{item.count}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Promedios Nutricionales */}
          <Card>
            <h4 className="font-semibold mb-4">Promedios Nutricionales por Plato</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Energía</p>
                <p className="text-2xl font-bold text-blue-900">
                  {reporte.promedios_nutricionales.energia_promedio?.toFixed(1) || 0} kcal
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Proteínas</p>
                <p className="text-2xl font-bold text-green-900">
                  {reporte.promedios_nutricionales.proteinas_promedio?.toFixed(1) || 0} g
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-orange-600">Grasas</p>
                <p className="text-2xl font-bold text-orange-900">
                  {reporte.promedios_nutricionales.grasas_promedio?.toFixed(1) || 0} g
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600">Carbohidratos</p>
                <p className="text-2xl font-bold text-purple-900">
                  {reporte.promedios_nutricionales.carbohidratos_promedio?.toFixed(1) || 0} g
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-600">Fibra</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {reporte.promedios_nutricionales.fibra_promedio?.toFixed(1) || 0} g
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-600">Sodio</p>
                <p className="text-2xl font-bold text-red-900">
                  {reporte.promedios_nutricionales.sodio_promedio?.toFixed(1) || 0} mg
                </p>
              </div>
            </div>
          </Card>

          {/* Últimas Visitas */}
          <Card>
            <h4 className="font-semibold mb-4">Últimas Visitas</h4>
            <div className="space-y-2">
              {reporte.ultimas_visitas.map((visita) => (
                <div key={visita.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{visita.fecha}</span>
                    <span className="text-gray-600 ml-2 capitalize">- {visita.tipo_comida}</span>
                  </div>
                  <Button
                    onClick={() => navigate(`/visitas/${visita.id}`)}
                    className="text-sm"
                  >
                    Ver Detalle
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
