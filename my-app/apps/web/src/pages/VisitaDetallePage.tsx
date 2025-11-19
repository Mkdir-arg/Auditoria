import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PlusIcon, TrashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useDebounce } from 'use-debounce'
import { auditoriaService, PlatoObservado, IngredientePlato } from '../services/auditoriaService'
import { nutricionService, AlimentoNutricional } from '../services/nutricionService'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Card } from '../components/ui/Card'

export const VisitaDetallePage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [visita, setVisita] = useState<any>(null)
  const [platos, setPlatos] = useState<PlatoObservado[]>([])
  const [loading, setLoading] = useState(true)
  const [isPlatoModalOpen, setIsPlatoModalOpen] = useState(false)
  const [isIngredienteModalOpen, setIsIngredienteModalOpen] = useState(false)
  const [selectedPlato, setSelectedPlato] = useState<number | null>(null)
  const [alimentos, setAlimentos] = useState<AlimentoNutricional[]>([])
  const [searchAlimento, setSearchAlimento] = useState('')
  const [debouncedSearch] = useDebounce(searchAlimento, 300)

  const [platoForm, setPlatoForm] = useState({
    nombre: '',
    tipo_plato: 'principal',
    porciones_servidas: '',
    notas: '',
  })

  const [ingredienteForm, setIngredienteForm] = useState({
    alimento: 0,
    cantidad: '',
    unidad: 'g',
  })

  useEffect(() => {
    loadVisita()
  }, [id])

  useEffect(() => {
    if (debouncedSearch.length > 2) {
      searchAlimentos()
    } else {
      setAlimentos([])
    }
  }, [debouncedSearch])

  const loadVisita = async () => {
    try {
      setLoading(true)
      const visitaData = await auditoriaService.getVisita(Number(id))
      setVisita(visitaData)
      if (visitaData.platos) {
        setPlatos(visitaData.platos)
      }
    } catch (error) {
      console.error('Error loading visita:', error)
    } finally {
      setLoading(false)
    }
  }

  const searchAlimentos = async () => {
    try {
      const data = await nutricionService.getAlimentos({ search: searchAlimento })
      setAlimentos(data.results)
    } catch (error) {
      console.error('Error searching alimentos:', error)
    }
  }

  const handleCreatePlato = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await auditoriaService.createPlato({
        visita: Number(id),
        ...platoForm,
        porciones_servidas: platoForm.porciones_servidas ? Number(platoForm.porciones_servidas) : undefined,
      })
      setIsPlatoModalOpen(false)
      setPlatoForm({ nombre: '', tipo_plato: 'principal', porciones_servidas: '', notas: '' })
      loadVisita()
    } catch (error) {
      console.error('Error creating plato:', error)
    }
  }

  const handleAddIngrediente = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await auditoriaService.createIngrediente({
        plato: selectedPlato!,
        alimento: ingredienteForm.alimento,
        cantidad: Number(ingredienteForm.cantidad),
        unidad: ingredienteForm.unidad,
      })
      setIsIngredienteModalOpen(false)
      setIngredienteForm({ alimento: 0, cantidad: '', unidad: 'g' })
      setSearchAlimento('')
      loadVisita()
    } catch (error) {
      console.error('Error adding ingrediente:', error)
    }
  }

  const handleDeleteIngrediente = async (ingredienteId: number) => {
    if (confirm('¿Eliminar este ingrediente?')) {
      try {
        await auditoriaService.deleteIngrediente(ingredienteId)
        loadVisita()
      } catch (error) {
        console.error('Error deleting ingrediente:', error)
      }
    }
  }

  const handleDeletePlato = async (platoId: number) => {
    if (confirm('¿Eliminar este plato?')) {
      try {
        await auditoriaService.deletePlato(platoId)
        loadVisita()
      } catch (error) {
        console.error('Error deleting plato:', error)
      }
    }
  }

  const tipoPlatoOptions = [
    { value: 'principal', label: 'Plato principal' },
    { value: 'guarnicion', label: 'Guarnición' },
    { value: 'postre', label: 'Postre' },
    { value: 'bebida', label: 'Bebida' },
    { value: 'otro', label: 'Otro' },
  ]

  if (loading) return <div className="p-6">Cargando...</div>

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button onClick={() => navigate('/visitas')} className="mb-4 bg-gray-500 hover:bg-gray-600">
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Volver
        </Button>
        <h1 className="text-2xl font-bold">{visita?.institucion_nombre}</h1>
        <p className="text-gray-600">
          {visita?.fecha} - {visita?.tipo_comida}
        </p>
        {visita?.observaciones && <p className="text-gray-700 mt-2">{visita.observaciones}</p>}
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Platos Observados</h2>
        <Button onClick={() => setIsPlatoModalOpen(true)}>
          <PlusIcon className="w-5 h-5 mr-2" />
          Agregar Plato
        </Button>
      </div>

      <div className="space-y-4">
        {platos.map((plato) => (
          <Card key={plato.id}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{plato.nombre}</h3>
                <p className="text-sm text-gray-600">
                  {plato.tipo_plato} {plato.porciones_servidas && `- ${plato.porciones_servidas} porciones`}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setSelectedPlato(plato.id)
                    setIsIngredienteModalOpen(true)
                  }}
                  className="text-sm"
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Ingrediente
                </Button>
                <button onClick={() => handleDeletePlato(plato.id)} className="text-red-600 hover:text-red-800">
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {plato.ingredientes && plato.ingredientes.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Ingredientes:</h4>
                <div className="space-y-2">
                  {plato.ingredientes.map((ing) => (
                    <div key={ing.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                      <span className="text-sm">
                        {ing.alimento_nombre} - {ing.cantidad}{ing.unidad}
                      </span>
                      <button
                        onClick={() => handleDeleteIngrediente(ing.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded">
              <h4 className="font-semibold mb-2">Totales Nutricionales</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <div>
                  <span className="font-medium">Energía:</span> {plato.energia_kcal_total?.toFixed(1) || 0} kcal
                </div>
                <div>
                  <span className="font-medium">Proteínas:</span> {plato.proteinas_g_total?.toFixed(1) || 0} g
                </div>
                <div>
                  <span className="font-medium">Grasas:</span> {plato.grasas_totales_g_total?.toFixed(1) || 0} g
                </div>
                <div>
                  <span className="font-medium">Carbohidratos:</span> {plato.carbohidratos_g_total?.toFixed(1) || 0} g
                </div>
                <div>
                  <span className="font-medium">Fibra:</span> {plato.fibra_g_total?.toFixed(1) || 0} g
                </div>
                <div>
                  <span className="font-medium">Sodio:</span> {plato.sodio_mg_total?.toFixed(1) || 0} mg
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isPlatoModalOpen} onClose={() => setIsPlatoModalOpen(false)} title="Agregar Plato">
        <form onSubmit={handleCreatePlato} className="space-y-4">
          <Input
            label="Nombre del Plato"
            required
            value={platoForm.nombre}
            onChange={(e) => setPlatoForm({ ...platoForm, nombre: e.target.value })}
          />
          <Select
            label="Tipo de Plato"
            options={tipoPlatoOptions}
            value={platoForm.tipo_plato}
            onChange={(e) => setPlatoForm({ ...platoForm, tipo_plato: e.target.value })}
          />
          <Input
            label="Porciones Servidas"
            type="number"
            value={platoForm.porciones_servidas}
            onChange={(e) => setPlatoForm({ ...platoForm, porciones_servidas: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              value={platoForm.notas}
              onChange={(e) => setPlatoForm({ ...platoForm, notas: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" onClick={() => setIsPlatoModalOpen(false)} className="bg-gray-500 hover:bg-gray-600">
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isIngredienteModalOpen} onClose={() => setIsIngredienteModalOpen(false)} title="Agregar Ingrediente">
        <form onSubmit={handleAddIngrediente} className="space-y-4">
          <div>
            <Input
              label="Buscar Alimento"
              placeholder="Escriba para buscar..."
              value={searchAlimento}
              onChange={(e) => setSearchAlimento(e.target.value)}
            />
            {alimentos.length > 0 && (
              <div className="mt-2 max-h-48 overflow-y-auto border rounded">
                {alimentos.map((alimento) => (
                  <div
                    key={alimento.id}
                    onClick={() => {
                      setIngredienteForm({ ...ingredienteForm, alimento: alimento.id })
                      setSearchAlimento(alimento.nombre)
                      setAlimentos([])
                    }}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <p className="font-medium">{alimento.nombre}</p>
                    <p className="text-xs text-gray-600">{alimento.categoria_nombre}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Input
            label="Cantidad"
            type="number"
            step="0.1"
            required
            value={ingredienteForm.cantidad}
            onChange={(e) => setIngredienteForm({ ...ingredienteForm, cantidad: e.target.value })}
          />
          <Select
            label="Unidad"
            options={[
              { value: 'g', label: 'gramos (g)' },
              { value: 'ml', label: 'mililitros (ml)' },
            ]}
            value={ingredienteForm.unidad}
            onChange={(e) => setIngredienteForm({ ...ingredienteForm, unidad: e.target.value })}
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              onClick={() => {
                setIsIngredienteModalOpen(false)
                setSearchAlimento('')
              }}
              className="bg-gray-500 hover:bg-gray-600"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!ingredienteForm.alimento}>
              Agregar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
