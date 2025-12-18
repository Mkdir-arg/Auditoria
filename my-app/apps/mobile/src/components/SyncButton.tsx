import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import { colors, spacing } from '../styles/theme';

// Para EMULADOR Android: http://10.0.2.2:8000/api
// Para CELULAR FÍSICO: http://192.168.1.204:8000/api
const API_URL = 'http://192.168.1.204:8000/api';

export function SyncButton() {
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    checkPendingData();
    
    // Verificar cada 5 segundos si hay datos pendientes
    const interval = setInterval(checkPendingData, 5000);
    
    // Listener de conexión
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = state.isConnected || false;
      setIsOnline(connected);
    });
    
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const checkPendingData = async () => {
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
      
      setPendingCount(count);
    } catch (error) {
      console.error('Error checking pending data:', error);
    }
  };

  const syncData = async (silent = false) => {
    if (syncing) return;

    try {
      setSyncing(true);
      
      // Verificar conexión real al backend
      try {
        await axios.get(`${API_URL}/`, { timeout: 3000 });
      } catch (err) {
        if (!silent) console.log('⚠️ Backend no disponible');
        setSyncing(false);
        return;
      }
      
      const token = await AsyncStorage.getItem('@auth_token');
      if (!token) {
        setSyncing(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      let synced = 0;
      const idMapInst: any = {};
      const idMapVis: any = {};
      const idMapPlatos: any = {};

      console.log('🔄 Iniciando sincronización...');

      // Limpiar duplicados
      const cleanDuplicates = (items: any[]) => {
        const seen = new Set();
        return items.filter(item => {
          if (seen.has(item.id)) return false;
          seen.add(item.id);
          return true;
        });
      };

      // 1. Instituciones
      const inst = await AsyncStorage.getItem('@instituciones');
      if (inst) {
        let instituciones = JSON.parse(inst);
        if (Array.isArray(instituciones)) {
          instituciones = cleanDuplicates(instituciones);
          const pendingInst = instituciones.filter((i: any) => !i.synced);
          console.log(`📍 [1/4] Instituciones pendientes: ${pendingInst.length}`);
          for (const item of pendingInst) {
            const oldId = item.id;
            try {
              console.log(`  → Sincronizando institución: ${item.nombre} (ID temp: ${oldId})`);
              const res = await axios.post(`${API_URL}/auditoria/instituciones/`, {
                codigo: item.codigo,
                nombre: item.nombre,
                tipo: item.tipo,
                direccion: item.direccion || '',
                barrio: item.barrio || '',
                comuna: item.comuna || '',
                activo: item.activo ?? true,
              }, { headers, timeout: 10000 });
              item.id = res.data.id;
              item.synced = true;
              idMapInst[oldId] = res.data.id;
              console.log(`  ✅ Institución creada: ID ${oldId} → ${res.data.id}`);
              synced++;
            } catch (err: any) {
              if (err.response?.status === 400 && err.response?.data?.codigo?.[0]?.includes('already exists')) {
                try {
                  const search = await axios.get(`${API_URL}/auditoria/instituciones/?codigo=${item.codigo}`, { headers });
                  if (search.data.results?.[0]) {
                    item.id = search.data.results[0].id;
                    item.synced = true;
                    idMapInst[oldId] = search.data.results[0].id;
                    console.log(`  ⚠️ Institución ya existe: ID ${oldId} → ${search.data.results[0].id}`);
                  }
                } catch {}
              }
              item.synced = true;
            }
          }
          await AsyncStorage.setItem('@instituciones', JSON.stringify(instituciones));
        }
      }

      // 2. Visitas
      const vis = await AsyncStorage.getItem('@visitas');
      if (vis) {
        let visitas = JSON.parse(vis);
        if (Array.isArray(visitas)) {
          visitas = cleanDuplicates(visitas);
          const pendingVis = visitas.filter((v: any) => !v.synced);
          console.log(`📍 [2/4] Visitas pendientes: ${pendingVis.length}`);
          for (const item of pendingVis) {
            const oldId = item.id;
            const instId = idMapInst[item.institucion_id] || item.institucion_id;
            console.log(`  → Sincronizando visita: ${item.fecha} (ID temp: ${oldId}, depende de inst: ${item.institucion_id} → ${instId})`);
            try {
              const res = await axios.post(`${API_URL}/auditoria/visitas/`, {
                institucion: instId,
                fecha: item.fecha,
                tipo_comida: item.tipo_comida?.toLowerCase(),
                observaciones: item.observaciones || '',
              }, { headers, timeout: 10000 });
              item.id = res.data.id;
              item.institucion_id = instId;
              item.synced = true;
              idMapVis[oldId] = res.data.id;
              console.log(`  ✅ Visita creada: ID ${oldId} → ${res.data.id}`);
              synced++;
            } catch (err: any) {
              console.log(`  ❌ Error visita:`, err.response?.data || err.message);
              item.synced = true;
            }
          }
          await AsyncStorage.setItem('@visitas', JSON.stringify(visitas));
        }
      }

      // 3. Platos
      const pl = await AsyncStorage.getItem('@platos');
      if (pl) {
        let platos = JSON.parse(pl);
        if (Array.isArray(platos)) {
          platos = cleanDuplicates(platos);
          const pendingPlatos = platos.filter((p: any) => !p.synced);
          console.log(`📍 [3/4] Platos pendientes: ${pendingPlatos.length}`);
          for (const item of pendingPlatos) {
            const oldId = item.id;
            const visitaId = idMapVis[item.visita_id] || item.visita_id;
            console.log(`  → Sincronizando plato: ${item.nombre} (ID temp: ${oldId}, depende de visita: ${item.visita_id} → ${visitaId})`);
            try {
              const res = await axios.post(`${API_URL}/auditoria/platos/`, {
                visita: visitaId,
                nombre: item.nombre,
                notas: item.descripcion || '',
              }, { headers, timeout: 10000 });
              item.id = res.data.id;
              item.visita_id = visitaId;
              item.synced = true;
              idMapPlatos[oldId] = res.data.id;
              console.log(`  ✅ Plato creado: ID ${oldId} → ${res.data.id}`);
              synced++;
            } catch (err: any) {
              console.log(`  ❌ Error plato:`, err.response?.data || err.message);
              item.synced = true;
            }
          }
          await AsyncStorage.setItem('@platos', JSON.stringify(platos));
        }
      }

      // 4. Ingredientes
      const ing = await AsyncStorage.getItem('@ingredientes');
      if (ing) {
        let ingredientes = JSON.parse(ing);
        if (Array.isArray(ingredientes)) {
          ingredientes = cleanDuplicates(ingredientes);
          const pendingIng = ingredientes.filter((i: any) => !i.synced);
          console.log(`📍 [4/4] Ingredientes pendientes: ${pendingIng.length}`);
          for (const item of pendingIng) {
            const platoId = idMapPlatos[item.plato_id] || item.plato_id;
            console.log(`  → Sincronizando ingrediente: alimento ${item.alimento_id} (depende de plato: ${item.plato_id} → ${platoId})`);
            try {
              await axios.post(`${API_URL}/auditoria/ingredientes/`, {
                plato: platoId,
                alimento: item.alimento_id,
                cantidad: item.cantidad,
                unidad: item.unidad || 'g',
              }, { headers, timeout: 10000 });
              item.plato_id = platoId;
              item.synced = true;
              console.log(`  ✅ Ingrediente creado`);
              synced++;
            } catch (err: any) {
              console.log(`  ❌ Error ingrediente:`, err.response?.data || err.message);
              item.synced = true;
            }
          }
          await AsyncStorage.setItem('@ingredientes', JSON.stringify(ingredientes));
        }
      }

      await checkPendingData();
      console.log(`✅ Sincronización completa: ${synced} items`);
      console.log(`📊 Mapeo IDs - Inst: ${Object.keys(idMapInst).length}, Vis: ${Object.keys(idMapVis).length}, Platos: ${Object.keys(idMapPlatos).length}`);
      
      if (!silent && synced > 0) {
        console.log(`✅ Total sincronizados: ${synced}`);
      }
    } catch (error) {
      console.error('Error syncing:', error);
    } finally {
      setSyncing(false);
    }
  };

  // Mostrar botón solo si hay datos pendientes
  if (pendingCount === 0 && !syncing) return null;

  return (
    <TouchableOpacity
      style={[styles.button, syncing && styles.buttonSyncing]}
      onPress={() => syncData(false)}
      disabled={syncing}
    >
      {syncing ? (
        <ActivityIndicator size="small" color={colors.white} />
      ) : (
        <>
          <Text style={styles.icon}>☁️</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{pendingCount}</Text>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.warning,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonSyncing: {
    backgroundColor: colors.primary,
  },
  icon: {
    fontSize: 24,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.danger,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});
