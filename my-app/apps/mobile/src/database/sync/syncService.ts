import NetInfo from '@react-native-community/netinfo'
import { database } from '../index'
import { Q } from '@nozbe/watermelondb'
import apiClient from '../../services/apiClient'
import AsyncStorage from '@react-native-async-storage/async-storage'

class SyncService {
  private isSyncing = false

  async checkConnection(): Promise<boolean> {
    const state = await NetInfo.fetch()
    return state.isConnected ?? false
  }

  async sync() {
    if (this.isSyncing) return
    
    const isOnline = await this.checkConnection()
    if (!isOnline) {
      console.log('Sin conexión')
      return
    }

    this.isSyncing = true
    try {
      await this.pullFromServer()
      await this.pushToServer()
      await AsyncStorage.setItem('last_sync', new Date().toISOString())
    } catch (error) {
      console.error('Error sync:', error)
    } finally {
      this.isSyncing = false
    }
  }

  private async pullFromServer() {
    // Descargar alimentos si no existen
    const alimentosCount = await database.get('alimentos').query().fetchCount()
    if (alimentosCount === 0) {
      const { data } = await apiClient.get('/nutricion/alimentos/?page_size=10000')
      await this.importAlimentos(data.results || data)
    }

    // Descargar instituciones
    const { data: instData } = await apiClient.get('/auditoria/instituciones/')
    await this.importInstituciones(instData.results || instData)

    // Descargar visitas
    const { data: visitasData } = await apiClient.get('/auditoria/visitas/')
    await this.importVisitas(visitasData.results || visitasData)
  }

  private async pushToServer() {
    // Instituciones no sincronizadas
    const institucionesNoSync = await database.get('instituciones')
      .query(Q.where('synced', false))
      .fetch()

    for (const inst of institucionesNoSync) {
      try {
        const response = await apiClient.post('/auditoria/instituciones/', {
          codigo: inst.codigo,
          nombre: inst.nombre,
          tipo: inst.tipo,
          direccion: inst.direccion,
          barrio: inst.barrio,
          comuna: inst.comuna,
        })
        
        await database.write(async () => {
          await inst.update((record: any) => {
            record.synced = true
            record.serverId = response.data.id
          })
        })
      } catch (error) {
        console.error('Error sync institución:', error)
      }
    }

    // Visitas no sincronizadas
    const visitasNoSync = await database.get('visitas')
      .query(Q.where('synced', false))
      .fetch()

    for (const visita of visitasNoSync) {
      try {
        const institucion = await visita.institucion.fetch()
        const response = await apiClient.post('/auditoria/visitas/', {
          institucion: institucion.serverId,
          fecha: new Date(visita.fecha).toISOString().split('T')[0],
          tipo_comida: visita.tipoComida,
          observaciones: visita.observaciones,
          formulario_respuestas: visita.formularioRespuestas,
        })
        
        await database.write(async () => {
          await visita.update((record: any) => {
            record.synced = true
            record.serverId = response.data.id
          })
        })

        await this.syncPlatosDeVisita(visita, response.data.id)
      } catch (error) {
        console.error('Error sync visita:', error)
      }
    }
  }

  private async syncPlatosDeVisita(visita: any, visitaServerId: number) {
    const platos = await visita.platos.fetch()
    
    for (const plato of platos) {
      if (!plato.synced) {
        try {
          const response = await apiClient.post('/auditoria/platos/', {
            visita: visitaServerId,
            nombre: plato.nombre,
            tipo_plato: plato.tipoPlato,
            porciones_servidas: plato.porcionesServidas,
          })
          
          await database.write(async () => {
            await plato.update((record: any) => {
              record.synced = true
              record.serverId = response.data.id
            })
          })

          await this.syncIngredientesDeP lato(plato, response.data.id)
        } catch (error) {
          console.error('Error sync plato:', error)
        }
      }
    }
  }

  private async syncIngredientesDeP lato(plato: any, platoServerId: number) {
    const ingredientes = await plato.ingredientes.fetch()
    
    for (const ing of ingredientes) {
      if (!ing.synced) {
        try {
          const alimento = await ing.alimento.fetch()
          await apiClient.post('/auditoria/ingredientes/', {
            plato: platoServerId,
            alimento: alimento.codigoArgenfood,
            cantidad: ing.cantidad,
            unidad: ing.unidad,
          })
          
          await database.write(async () => {
            await ing.update((record: any) => {
              record.synced = true
            })
          })
        } catch (error) {
          console.error('Error sync ingrediente:', error)
        }
      }
    }
  }

  private async importAlimentos(alimentos: any[]) {
    await database.write(async () => {
      const alimentosCollection = database.get('alimentos')
      for (const alim of alimentos) {
        try {
          await alimentosCollection.create((record: any) => {
            record.codigoArgenfood = alim.codigo_argenfood
            record.nombre = alim.nombre
            record.categoriaId = alim.categoria || 0
            record.energiaKcal = alim.energia_kcal || 0
            record.proteinasG = alim.proteinas_g || 0
            record.grasasTotalesG = alim.grasas_totales_g || 0
            record.carbohidratosG = alim.carbohidratos_disponibles_g || alim.carbohidratos_totales_g || 0
            record.fibraG = alim.fibra_g || 0
            record.sodioMg = alim.sodio_mg || 0
            record.calcioMg = alim.calcio_mg || 0
            record.hierroMg = alim.hierro_mg || 0
            record.zincMg = alim.zinc_mg || 0
            record.vitaminaCMg = alim.vitamina_c_mg || 0
          })
        } catch (error) {
          console.error('Error importando alimento:', error)
        }
      }
    })
  }

  private async importInstituciones(instituciones: any[]) {
    await database.write(async () => {
      const institucionesCollection = database.get('instituciones')
      for (const inst of instituciones) {
        try {
          const existing = await institucionesCollection
            .query(Q.where('server_id', inst.id))
            .fetch()
          
          if (existing.length === 0) {
            await institucionesCollection.create((record: any) => {
              record.codigo = inst.codigo
              record.nombre = inst.nombre
              record.tipo = inst.tipo
              record.direccion = inst.direccion || ''
              record.barrio = inst.barrio || ''
              record.comuna = inst.comuna || ''
              record.activo = inst.activo
              record.synced = true
              record.serverId = inst.id
            })
          }
        } catch (error) {
          console.error('Error importando institución:', error)
        }
      }
    })
  }

  private async importVisitas(visitas: any[]) {
    await database.write(async () => {
      const visitasCollection = database.get('visitas')
      for (const vis of visitas) {
        try {
          const existing = await visitasCollection
            .query(Q.where('server_id', vis.id))
            .fetch()
          
          if (existing.length === 0) {
            const institucion = await database.get('instituciones')
              .query(Q.where('server_id', vis.institucion))
              .fetch()
            
            if (institucion.length > 0) {
              await visitasCollection.create((record: any) => {
                record.institucionId = institucion[0].id
                record.fecha = new Date(vis.fecha).getTime()
                record.tipoComida = vis.tipo_comida
                record.observaciones = vis.observaciones || ''
                record.formularioCompletado = vis.formulario_completado || false
                record.formularioRespuestas = vis.formulario_respuestas || {}
                record.synced = true
                record.serverId = vis.id
              })
            }
          }
        } catch (error) {
          console.error('Error importando visita:', error)
        }
      }
    })
  }

  async getLastSync(): Promise<string | null> {
    return await AsyncStorage.getItem('last_sync')
  }

  async getPendingCount(): Promise<number> {
    const instituciones = await database.get('instituciones')
      .query(Q.where('synced', false))
      .fetchCount()
    
    const visitas = await database.get('visitas')
      .query(Q.where('synced', false))
      .fetchCount()
    
    return instituciones + visitas
  }
}

export default new SyncService()
