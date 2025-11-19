import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusIcon, EyeIcon } from '@heroicons/react/24/outline'
import { auditoriaService, VisitaAuditoria, Institucion } from '../services/auditoriaService'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Card } from '../components/ui/Card'

export const VisitasPage: React.FC = () => {
  const navigate = useNavigate()
  const [visitas, setVisitas] = useState<VisitaAuditoria[]>([])
  const [instituciones, setInstituciones] = useState<Institucion[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<VisitaAuditoria>>({
    institucion: 0,
    fecha: new Date().toISOString().split('T')[0],
    tipo_comida: 'almuerzo',
    observaciones: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [visitasData, instData] = await Promise.all([
        auditoriaService.getVisitas(),
        auditoriaService.getInstituciones(),
      ])
      setVisitas(visitasData.results)
      setInstituciones(instData.results)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const newVisita = await auditoriaService.createVisita(formData)
      setIsModalOpen(false)
      navigate(`/visitas/${newVisita.id}`)
    } catch (error) {
      console.error('Error creating visita:', error)
    }
  }

  const tipoComidaOptions = [
    { value: 'desayuno', label: 'Desayuno' },
    { value: 'almuerzo', label: 'Almuerzo' },
    { value: 'merienda', label: 'Merienda' },
    { value: 'cena', label: 'Cena' },
    { value: 'vianda', label: 'Vianda' },
  ]

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Visitas de Auditoría</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusIcon className="w-5 h-5 mr-2" />
          Nueva Visita
        </Button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visitas.map((visita) => (
            <Card key={visita.id}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{visita.institucion_nombre}</h3>
                  <p className="text-sm text-gray-600">{visita.fecha}</p>
                </div>
                <button
                  onClick={() => navigate(`/visitas/${visita.id}`)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <EyeIcon className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-medium">Tipo:</span> {visita.tipo_comida}
              </p>
              {visita.observaciones && (
                <p className="text-sm text-gray-600 italic">{visita.observaciones}</p>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nueva Visita"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Institución"
            required
            options={[
              { value: 0, label: 'Seleccione...' },
              ...instituciones.map((i) => ({ value: i.id, label: i.nombre })),
            ]}
            value={formData.institucion}
            onChange={(e) => setFormData({ ...formData, institucion: Number(e.target.value) })}
          />
          <Input
            label="Fecha"
            type="date"
            required
            value={formData.fecha}
            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
          />
          <Select
            label="Tipo de Comida"
            required
            options={tipoComidaOptions}
            value={formData.tipo_comida}
            onChange={(e) => setFormData({ ...formData, tipo_comida: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              value={formData.observaciones}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-500 hover:bg-gray-600"
            >
              Cancelar
            </Button>
            <Button type="submit">Crear y Agregar Platos</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
