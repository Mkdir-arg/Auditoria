import React, { useState, useEffect } from 'react'
import { ArrowLeftIcon, TrophyIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { reportesService, RankingInstitucion } from '../services/reportesService'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

export const RankingPage: React.FC = () => {
  const navigate = useNavigate()
  const [ranking, setRanking] = useState<RankingInstitucion[]>([])
  const [loading, setLoading] = useState(true)
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')

  useEffect(() => {
    loadRanking()
  }, [])

  const loadRanking = async () => {
    try {
      setLoading(true)
      const data = await reportesService.getRankingInstituciones({
        fecha_inicio: fechaInicio || undefined,
        fecha_fin: fechaFin || undefined,
        limit: 20,
      })
      setRanking(data)
    } catch (error) {
      console.error('Error loading ranking:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMedalColor = (index: number) => {
    if (index === 0) return 'text-yellow-500'
    if (index === 1) return 'text-gray-400'
    if (index === 2) return 'text-orange-600'
    return 'text-gray-300'
  }

  return (
    <div className="p-6">
      <Button onClick={() => navigate('/dashboard')} className="mb-4 bg-gray-500 hover:bg-gray-600">
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Volver
      </Button>

      <h1 className="text-2xl font-bold mb-6">Ranking de Instituciones</h1>

      <Card className="mb-6">
        <h3 className="font-semibold mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <Button onClick={loadRanking} className="w-full">
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </Card>

      {loading ? (
        <p>Cargando ranking...</p>
      ) : (
        <Card>
          <div className="space-y-3">
            {ranking.map((item, index) => (
              <div
                key={item.institucion__id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10">
                    {index < 3 ? (
                      <TrophyIcon className={`w-8 h-8 ${getMedalColor(index)}`} />
                    ) : (
                      <span className="text-xl font-bold text-gray-400">#{index + 1}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{item.institucion__nombre}</h3>
                    <p className="text-sm text-gray-600 capitalize">{item.institucion__tipo}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{item.total_visitas}</p>
                  <p className="text-sm text-gray-600">visitas</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
