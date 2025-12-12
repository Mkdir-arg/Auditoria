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
      
      // Cargar formulario desde localStorage
      const formularioGuardado = localStorage.getItem(`formulario_visita_${id}`)
      if (formularioGuardado) {
        visitaData.formulario_completado = true
        visitaData.formulario_respuestas = JSON.parse(formularioGuardado)
      }
      
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
    <div className="space-y-4 sm:space-y-6">
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-white shadow-xl">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3 sm:gap-4 md:gap-6">
            <div className="p-3 sm:p-4 md:p-5 bg-white/20 rounded-xl sm:rounded-2xl backdrop-blur-sm flex-shrink-0">
              <span className="text-3xl sm:text-4xl md:text-5xl">🍽️</span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 break-words">{visita?.institucion_nombre}</h1>
              <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm md:text-base">
                <span className="flex items-center gap-1 sm:gap-2 bg-white/10 px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-lg backdrop-blur-sm">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="truncate">{visita?.fecha}</span>
                </span>
                <span className="flex items-center gap-1 sm:gap-2 bg-white/10 px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-lg backdrop-blur-sm">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="truncate">{visita?.tipo_comida}</span>
                </span>
              </div>
              {visita?.observaciones && (
                <p className="mt-3 sm:mt-4 text-blue-50 bg-white/10 rounded-lg p-3 sm:p-4 backdrop-blur-sm text-xs sm:text-sm md:text-base">{visita.observaciones}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button onClick={() => navigate(`/visitas/${id}/formulario`)} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold shadow-lg text-sm sm:text-base">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Completar Formulario
            </Button>
            <Button onClick={() => navigate('/visitas')} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/30 text-white text-sm sm:text-base">
              <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </div>

      {/* Tabla de Platos */}
      <Card className="overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 border-b-2 border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
              <span className="text-3xl sm:text-4xl">🍲</span> Platos Observados
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2 ml-0 sm:ml-1">{platos.length} plato{platos.length !== 1 ? 's' : ''} registrado{platos.length !== 1 ? 's' : ''}</p>
          </div>
          <Button onClick={() => setIsPlatoModalOpen(true)} className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base md:text-lg">
            <PlusIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            Agregar Plato
          </Button>
        </div>

        {platos.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🍽️</div>
            <p className="text-gray-500 text-base sm:text-lg">No hay platos registrados</p>
            <p className="text-gray-400 text-xs sm:text-sm mt-2">Comienza agregando un plato a esta visita</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Plato</th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tipo</th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Porciones</th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Ingredientes</th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Energía</th>
                  <th className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {platos.map((plato) => (
                  <React.Fragment key={plato.id}>
                  <tr className="hover:bg-gray-50 transition-colors bg-white">
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">{plato.nombre}</div>
                      {plato.notas && <div className="text-xs text-gray-500 mt-1">{plato.notas}</div>}
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                      <span className="px-2 sm:px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 whitespace-nowrap">
                        {plato.tipo_plato}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center">
                      <span className="font-semibold text-gray-700 text-sm sm:text-base">{plato.porciones_servidas || '-'}</span>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center">
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs sm:text-sm font-medium">
                        {plato.ingredientes?.length || 0}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center">
                      <span className="font-bold text-orange-600 text-sm sm:text-base">{plato.energia_kcal_total ? Number(plato.energia_kcal_total).toFixed(0) : 0}</span>
                      <span className="text-xs text-gray-500 ml-1">kcal</span>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedPlato(plato.id)
                            setIsIngredienteModalOpen(true)
                          }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Agregar ingrediente"
                        >
                          <PlusIcon className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeletePlato(plato.id)} 
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar plato"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {plato.ingredientes && plato.ingredientes.length > 0 && (
                    <tr className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-4 sm:border-b-8 border-indigo-300">
                      <td colSpan={6} className="px-3 sm:px-4 md:px-6 py-4 sm:py-6">
                        <div className="space-y-2 sm:space-y-3">
                          <h4 className="font-semibold text-gray-700 flex items-center gap-2 text-sm sm:text-base">
                            <span>🧂</span> Ingredientes:
                          </h4>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                            {plato.ingredientes.map((ing) => (
                              <div key={ing.id} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200">
                                <span className="text-sm font-medium text-gray-700">
                                  {ing.alimento_nombre}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                    {ing.cantidad}{ing.unidad}
                                  </span>
                                  <button
                                    onClick={() => handleDeleteIngrediente(ing.id)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 sm:p-4 rounded-lg border border-blue-200">
                            <h5 className="font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                              <span>📊</span> Totales Nutricionales
                            </h5>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
                              {/* Campos comunes */}
                              <div className="bg-white p-2 rounded text-center">
                                <div className="text-xs text-gray-600">Energía</div>
                                <div className="font-bold text-orange-600">{plato.energia_kcal_total ? Number(plato.energia_kcal_total).toFixed(1) : 0}</div>
                                <div className="text-xs text-gray-500">kcal</div>
                              </div>
                              <div className="bg-white p-2 rounded text-center">
                                <div className="text-xs text-gray-600">Proteínas</div>
                                <div className="font-bold text-red-600">{plato.proteinas_g_total ? Number(plato.proteinas_g_total).toFixed(1) : 0}</div>
                                <div className="text-xs text-gray-500">g</div>
                              </div>
                              <div className="bg-white p-2 rounded text-center">
                                <div className="text-xs text-gray-600">Grasas</div>
                                <div className="font-bold text-yellow-600">{plato.grasas_totales_g_total ? Number(plato.grasas_totales_g_total).toFixed(1) : 0}</div>
                                <div className="text-xs text-gray-500">g</div>
                              </div>
                              <div className="bg-white p-2 rounded text-center">
                                <div className="text-xs text-gray-600">Carbohidratos</div>
                                <div className="font-bold text-blue-600">{plato.carbohidratos_g_total ? Number(plato.carbohidratos_g_total).toFixed(1) : 0}</div>
                                <div className="text-xs text-gray-500">g</div>
                              </div>
                              
                              {/* Campos adicionales - solo mostrar si tienen valor > 0 */}
                              {plato.agua_g_total && Number(plato.agua_g_total) > 0 && (
                                <div className="bg-white p-2 rounded text-center">
                                  <div className="text-xs text-gray-600">Agua</div>
                                  <div className="font-bold text-cyan-600">{Number(plato.agua_g_total).toFixed(1)}</div>
                                  <div className="text-xs text-gray-500">g</div>
                                </div>
                              )}
                              {plato.fibra_g_total && Number(plato.fibra_g_total) > 0 && (
                                <div className="bg-white p-2 rounded text-center">
                                  <div className="text-xs text-gray-600">Fibra</div>
                                  <div className="font-bold text-green-600">{Number(plato.fibra_g_total).toFixed(1)}</div>
                                  <div className="text-xs text-gray-500">g</div>
                                </div>
                              )}
                              {plato.sodio_mg_total && Number(plato.sodio_mg_total) > 0 && (
                                <div className="bg-white p-2 rounded text-center">
                                  <div className="text-xs text-gray-600">Sodio</div>
                                  <div className="font-bold text-purple-600">{Number(plato.sodio_mg_total).toFixed(1)}</div>
                                  <div className="text-xs text-gray-500">mg</div>
                                </div>
                              )}
                              {plato.calcio_mg_total && Number(plato.calcio_mg_total) > 0 && (
                                <div className="bg-white p-2 rounded text-center">
                                  <div className="text-xs text-gray-600">Calcio</div>
                                  <div className="font-bold text-indigo-600">{Number(plato.calcio_mg_total).toFixed(1)}</div>
                                  <div className="text-xs text-gray-500">mg</div>
                                </div>
                              )}
                              {plato.hierro_mg_total && Number(plato.hierro_mg_total) > 0 && (
                                <div className="bg-white p-2 rounded text-center">
                                  <div className="text-xs text-gray-600">Hierro</div>
                                  <div className="font-bold text-red-700">{Number(plato.hierro_mg_total).toFixed(1)}</div>
                                  <div className="text-xs text-gray-500">mg</div>
                                </div>
                              )}
                              {plato.zinc_mg_total && Number(plato.zinc_mg_total) > 0 && (
                                <div className="bg-white p-2 rounded text-center">
                                  <div className="text-xs text-gray-600">Zinc</div>
                                  <div className="font-bold text-gray-600">{Number(plato.zinc_mg_total).toFixed(1)}</div>
                                  <div className="text-xs text-gray-500">mg</div>
                                </div>
                              )}
                              {plato.vitamina_c_mg_total && Number(plato.vitamina_c_mg_total) > 0 && (
                                <div className="bg-white p-2 rounded text-center">
                                  <div className="text-xs text-gray-600">Vitamina C</div>
                                  <div className="font-bold text-yellow-500">{Number(plato.vitamina_c_mg_total).toFixed(1)}</div>
                                  <div className="text-xs text-gray-500">mg</div>
                                </div>
                              )}
                              {plato.potasio_mg_total && Number(plato.potasio_mg_total) > 0 && (
                                <div className="bg-white p-2 rounded text-center">
                                  <div className="text-xs text-gray-600">Potasio</div>
                                  <div className="font-bold text-pink-600">{Number(plato.potasio_mg_total).toFixed(1)}</div>
                                  <div className="text-xs text-gray-500">mg</div>
                                </div>
                              )}
                              {plato.fosforo_mg_total && Number(plato.fosforo_mg_total) > 0 && (
                                <div className="bg-white p-2 rounded text-center">
                                  <div className="text-xs text-gray-600">Fósforo</div>
                                  <div className="font-bold text-teal-600">{Number(plato.fosforo_mg_total).toFixed(1)}</div>
                                  <div className="text-xs text-gray-500">mg</div>
                                </div>
                              )}
                              {plato.grasas_saturadas_g_total && Number(plato.grasas_saturadas_g_total) > 0 && (
                                <div className="bg-white p-2 rounded text-center">
                                  <div className="text-xs text-gray-600">Grasas sat.</div>
                                  <div className="font-bold text-red-500">{Number(plato.grasas_saturadas_g_total).toFixed(1)}</div>
                                  <div className="text-xs text-gray-500">g</div>
                                </div>
                              )}
                              {plato.grasas_monoinsat_g_total && Number(plato.grasas_monoinsat_g_total) > 0 && (
                                <div className="bg-white p-2 rounded text-center">
                                  <div className="text-xs text-gray-600">Grasas mono.</div>
                                  <div className="font-bold text-amber-600">{Number(plato.grasas_monoinsat_g_total).toFixed(1)}</div>
                                  <div className="text-xs text-gray-500">g</div>
                                </div>
                              )}
                              {plato.grasas_poliinsat_g_total && Number(plato.grasas_poliinsat_g_total) > 0 && (
                                <div className="bg-white p-2 rounded text-center">
                                  <div className="text-xs text-gray-600">Grasas poli.</div>
                                  <div className="font-bold text-lime-600">{Number(plato.grasas_poliinsat_g_total).toFixed(1)}</div>
                                  <div className="text-xs text-gray-500">g</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Resumen del Formulario de Relevamiento */}
      {visita?.formulario_completado && (
        <Card className="overflow-hidden shadow-lg">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-8 py-6 border-b-2 border-indigo-200">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <span className="text-4xl">📋</span> Formulario de Relevamiento
            </h2>
            <p className="text-base text-gray-600 mt-2 ml-1">Completado el {new Date().toLocaleDateString()}</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(visita.formulario_respuestas || {}).map(([seccion, respuestas]: [string, any]) => (
                <div key={seccion} className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-bold text-lg text-indigo-700 mb-3 capitalize">
                    {seccion.replace('_', ' ')}
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(respuestas).map(([pregunta, valor]: [string, any]) => (
                      <div key={pregunta} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 capitalize">{pregunta.replace('_', ' ')}:</span>
                        <span className="font-semibold text-gray-900">
                          {typeof valor === 'boolean' ? (valor ? '✓ Sí' : '✗ No') : valor}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

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
