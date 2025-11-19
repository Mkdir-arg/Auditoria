import React, { useState, useEffect } from 'react'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { auditoriaService, Institucion } from '../services/auditoriaService'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Card } from '../components/ui/Card'

export const InstitucionesPage: React.FC = () => {
  const [instituciones, setInstituciones] = useState<Institucion[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState<Partial<Institucion>>({
    codigo: '',
    nombre: '',
    tipo: 'escuela',
    direccion: '',
    barrio: '',
    comuna: '',
    activo: true,
  })

  useEffect(() => {
    loadInstituciones()
  }, [searchTerm])

  const loadInstituciones = async () => {
    try {
      setLoading(true)
      const data = await auditoriaService.getInstituciones({ search: searchTerm })
      setInstituciones(data.results)
    } catch (error) {
      console.error('Error loading instituciones:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await auditoriaService.updateInstitucion(editingId, formData)
      } else {
        await auditoriaService.createInstitucion(formData)
      }
      setIsModalOpen(false)
      resetForm()
      loadInstituciones()
    } catch (error) {
      console.error('Error saving institucion:', error)
    }
  }

  const handleEdit = (institucion: Institucion) => {
    setEditingId(institucion.id)
    setFormData(institucion)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('¿Está seguro de eliminar esta institución?')) {
      try {
        await auditoriaService.deleteInstitucion(id)
        loadInstituciones()
      } catch (error) {
        console.error('Error deleting institucion:', error)
      }
    }
  }

  const resetForm = () => {
    setEditingId(null)
    setFormData({
      codigo: '',
      nombre: '',
      tipo: 'escuela',
      direccion: '',
      barrio: '',
      comuna: '',
      activo: true,
    })
  }

  const tipoOptions = [
    { value: 'escuela', label: 'Escuela' },
    { value: 'cdi', label: 'CDI' },
    { value: 'hogar', label: 'Hogar' },
    { value: 'geriatrico', label: 'Geriátrico' },
    { value: 'otro', label: 'Otro' },
  ]

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Instituciones</h1>
        <Button
          onClick={() => {
            resetForm()
            setIsModalOpen(true)
          }}
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Nueva Institución
        </Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Buscar instituciones..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {instituciones.map((inst) => (
            <Card key={inst.id}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{inst.nombre}</h3>
                  <p className="text-sm text-gray-600">{inst.codigo}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(inst)} className="text-blue-600 hover:text-blue-800">
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(inst.id)} className="text-red-600 hover:text-red-800">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-1">
                <span className="font-medium">Tipo:</span> {inst.tipo}
              </p>
              {inst.direccion && (
                <p className="text-sm text-gray-700 mb-1">{inst.direccion}</p>
              )}
              {inst.barrio && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Barrio:</span> {inst.barrio}
                </p>
              )}
              {inst.comuna && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Comuna:</span> {inst.comuna}
                </p>
              )}
              <div className="mt-2">
                <span className={`text-xs px-2 py-1 rounded ${inst.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {inst.activo ? 'Activa' : 'Inactiva'}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          resetForm()
        }}
        title={editingId ? 'Editar Institución' : 'Nueva Institución'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Código"
            required
            value={formData.codigo}
            onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
          />
          <Input
            label="Nombre"
            required
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          />
          <Select
            label="Tipo"
            required
            options={tipoOptions}
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
          />
          <Input
            label="Dirección"
            value={formData.direccion}
            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
          />
          <Input
            label="Barrio"
            value={formData.barrio}
            onChange={(e) => setFormData({ ...formData, barrio: e.target.value })}
          />
          <Input
            label="Comuna"
            value={formData.comuna}
            onChange={(e) => setFormData({ ...formData, comuna: e.target.value })}
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              id="activo"
              checked={formData.activo}
              onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="activo">Activa</label>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              onClick={() => {
                setIsModalOpen(false)
                resetForm()
              }}
              className="bg-gray-500 hover:bg-gray-600"
            >
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
