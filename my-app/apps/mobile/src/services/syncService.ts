import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://10.0.2.2:8000/api';

interface SyncResult {
  success: boolean;
  synced: number;
  failed: number;
  errors: string[];
}

export const syncService = {
  async syncAll(): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      synced: 0,
      failed: 0,
      errors: [],
    };

    try {
      const token = await AsyncStorage.getItem('@auth_token');
      if (!token) {
        result.success = false;
        result.errors.push('No hay token de autenticación');
        return result;
      }

      const headers = { Authorization: `Bearer ${token}` };

      // 1. Sincronizar instituciones primero (para obtener IDs reales)
      const instResult = await this.syncInstituciones(headers);
      result.synced += instResult.synced;
      result.failed += instResult.failed;
      result.errors.push(...instResult.errors);

      // 2. Sincronizar visitas (necesitan IDs reales de instituciones)
      const visitasResult = await this.syncVisitas(headers);
      result.synced += visitasResult.synced;
      result.failed += visitasResult.failed;
      result.errors.push(...visitasResult.errors);

      // 3. Sincronizar platos (necesitan IDs reales de visitas)
      const platosResult = await this.syncPlatos(headers);
      result.synced += platosResult.synced;
      result.failed += platosResult.failed;
      result.errors.push(...platosResult.errors);

      // 4. Sincronizar ingredientes (necesitan IDs reales de platos)
      const ingredientesResult = await this.syncIngredientes(headers);
      result.synced += ingredientesResult.synced;
      result.failed += ingredientesResult.failed;
      result.errors.push(...ingredientesResult.errors);

      result.success = result.failed === 0;
    } catch (error: any) {
      result.success = false;
      result.errors.push(error.message || 'Error desconocido');
    }

    return result;
  },

  async syncInstituciones(headers: any): Promise<SyncResult> {
    const result: SyncResult = { success: true, synced: 0, failed: 0, errors: [] };

    try {
      const data = await AsyncStorage.getItem('@instituciones');
      if (!data) return result;

      const instituciones = JSON.parse(data);
      if (!Array.isArray(instituciones)) return result;

      const pending = instituciones.filter((i: any) => i.synced === false);

      for (const item of pending) {
        try {
          const response = await axios.post(
            `${API_URL}/auditoria/instituciones/`,
            {
              codigo: item.codigo,
              nombre: item.nombre,
              tipo: item.tipo,
              direccion: item.direccion,
              barrio: item.barrio,
              comuna: item.comuna,
              activo: item.activo,
            },
            { headers, timeout: 10000 }
          );

          // Guardar mapeo de ID local → ID servidor
          const oldId = item.id;
          const newId = response.data.id;
          await this.saveIdMapping('institucion', oldId, newId);

          item.id = newId;
          item.synced = true;
          result.synced++;
        } catch (err: any) {
          result.failed++;
          result.errors.push(`Institución ${item.nombre}: ${err.message}`);
        }
      }

      await AsyncStorage.setItem('@instituciones', JSON.stringify(instituciones));
    } catch (error: any) {
      result.errors.push(`Error instituciones: ${error.message}`);
    }

    return result;
  },

  async syncVisitas(headers: any): Promise<SyncResult> {
    const result: SyncResult = { success: true, synced: 0, failed: 0, errors: [] };

    try {
      const data = await AsyncStorage.getItem('@visitas');
      if (!data) return result;

      const visitas = JSON.parse(data);
      if (!Array.isArray(visitas)) return result;

      const pending = visitas.filter((v: any) => v.synced === false);

      for (const item of pending) {
        try {
          // Obtener ID real de institución
          const realInstitucionId = await this.getIdMapping('institucion', item.institucion_id);

          const response = await axios.post(
            `${API_URL}/auditoria/visitas/`,
            {
              institucion: realInstitucionId || item.institucion_id,
              fecha: item.fecha,
              tipo_comida: item.tipo_comida,
              observaciones: item.observaciones,
            },
            { headers, timeout: 10000 }
          );

          const oldId = item.id;
          const newId = response.data.id;
          await this.saveIdMapping('visita', oldId, newId);

          item.id = newId;
          item.synced = true;
          result.synced++;
        } catch (err: any) {
          result.failed++;
          result.errors.push(`Visita: ${err.message}`);
        }
      }

      await AsyncStorage.setItem('@visitas', JSON.stringify(visitas));
    } catch (error: any) {
      result.errors.push(`Error visitas: ${error.message}`);
    }

    return result;
  },

  async syncPlatos(headers: any): Promise<SyncResult> {
    const result: SyncResult = { success: true, synced: 0, failed: 0, errors: [] };

    try {
      const data = await AsyncStorage.getItem('@platos');
      if (!data) return result;

      const platos = JSON.parse(data);
      if (!Array.isArray(platos)) return result;

      const pending = platos.filter((p: any) => p.synced === false);

      for (const item of pending) {
        try {
          const realVisitaId = await this.getIdMapping('visita', item.visita_id);

          const response = await axios.post(
            `${API_URL}/auditoria/platos/`,
            {
              visita: realVisitaId || item.visita_id,
              nombre: item.nombre,
              descripcion: item.descripcion,
            },
            { headers, timeout: 10000 }
          );

          const oldId = item.id;
          const newId = response.data.id;
          await this.saveIdMapping('plato', oldId, newId);

          item.id = newId;
          item.synced = true;
          result.synced++;
        } catch (err: any) {
          result.failed++;
          result.errors.push(`Plato ${item.nombre}: ${err.message}`);
        }
      }

      await AsyncStorage.setItem('@platos', JSON.stringify(platos));
    } catch (error: any) {
      result.errors.push(`Error platos: ${error.message}`);
    }

    return result;
  },

  async syncIngredientes(headers: any): Promise<SyncResult> {
    const result: SyncResult = { success: true, synced: 0, failed: 0, errors: [] };

    try {
      const data = await AsyncStorage.getItem('@ingredientes');
      if (!data) return result;

      const ingredientes = JSON.parse(data);
      if (!Array.isArray(ingredientes)) return result;

      const pending = ingredientes.filter((i: any) => i.synced === false);

      for (const item of pending) {
        try {
          const realPlatoId = await this.getIdMapping('plato', item.plato_id);

          await axios.post(
            `${API_URL}/auditoria/ingredientes/`,
            {
              plato: realPlatoId || item.plato_id,
              alimento: item.alimento_id,
              cantidad: item.cantidad,
              unidad: item.unidad,
            },
            { headers, timeout: 10000 }
          );

          item.synced = true;
          result.synced++;
        } catch (err: any) {
          result.failed++;
          result.errors.push(`Ingrediente: ${err.message}`);
        }
      }

      await AsyncStorage.setItem('@ingredientes', JSON.stringify(ingredientes));
    } catch (error: any) {
      result.errors.push(`Error ingredientes: ${error.message}`);
    }

    return result;
  },

  async saveIdMapping(type: string, localId: number, serverId: number) {
    try {
      const key = `@id_mapping_${type}`;
      const data = await AsyncStorage.getItem(key);
      const mappings = data ? JSON.parse(data) : {};
      mappings[localId] = serverId;
      await AsyncStorage.setItem(key, JSON.stringify(mappings));
    } catch (error) {
      console.error('Error saving ID mapping:', error);
    }
  },

  async getIdMapping(type: string, localId: number): Promise<number | null> {
    try {
      const key = `@id_mapping_${type}`;
      const data = await AsyncStorage.getItem(key);
      if (!data) return null;
      const mappings = JSON.parse(data);
      return mappings[localId] || null;
    } catch (error) {
      console.error('Error getting ID mapping:', error);
      return null;
    }
  },

  async getPendingCount(): Promise<number> {
    try {
      let count = 0;

      const keys = ['@instituciones', '@visitas', '@platos', '@ingredientes'];

      for (const key of keys) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          const items = JSON.parse(data);
          if (Array.isArray(items)) {
            count += items.filter((i: any) => i.synced === false).length;
          }
        }
      }

      return count;
    } catch (error) {
      console.error('Error getting pending count:', error);
      return 0;
    }
  },
};
