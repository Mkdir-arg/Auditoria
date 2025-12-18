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

const API_URL = 'http://10.0.2.2:8000/api';

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
      
      // Auto-sync cuando se conecta
      if (connected && !syncing) {
        setTimeout(() => syncData(true), 1000);
      }
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
    if (syncing || !isOnline) return;

    try {
      setSyncing(true);
      
      // Verificar conexión real al backend
      try {
        await axios.get(`${API_URL}/`, { timeout: 3000 });
      } catch (err) {
        console.log('⚠️ Backend no disponible, reintentando después');
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

      // 1. Instituciones
      const inst = await AsyncStorage.getItem('@instituciones');
      if (inst) {
        const instituciones = JSON.parse(inst);
        if (Array.isArray(instituciones)) {
          for (const item of instituciones.filter((i: any) => !i.synced)) {
            try {
              const res = await axios.post(`${API_URL}/auditoria/instituciones/`, {
                codigo: item.codigo,
                nombre: item.nombre,
                tipo: item.tipo,
                direccion: item.direccion,
                barrio: item.barrio,
                comuna: item.comuna,
                activo: item.activo,
              }, { headers, timeout: 10000 });
              item.id = res.data.id;
              item.synced = true;
              synced++;
            } catch (err) {
              console.error('Error sync inst:', err);
            }
          }
          await AsyncStorage.setItem('@instituciones', JSON.stringify(instituciones));
        }
      }

      // 2. Visitas
      const vis = await AsyncStorage.getItem('@visitas');
      if (vis) {
        const visitas = JSON.parse(vis);
        if (Array.isArray(visitas)) {
          for (const item of visitas.filter((v: any) => !v.synced)) {
            try {
              const res = await axios.post(`${API_URL}/auditoria/visitas/`, {
                institucion: item.institucion_id,
                fecha: item.fecha,
                tipo_comida: item.tipo_comida,
                observaciones: item.observaciones,
              }, { headers, timeout: 10000 });
              item.id = res.data.id;
              item.synced = true;
              synced++;
            } catch (err) {
              console.error('Error sync visita:', err);
            }
          }
          await AsyncStorage.setItem('@visitas', JSON.stringify(visitas));
        }
      }

      // 3. Platos
      const pl = await AsyncStorage.getItem('@platos');
      if (pl) {
        const platos = JSON.parse(pl);
        if (Array.isArray(platos)) {
          for (const item of platos.filter((p: any) => !p.synced)) {
            try {
              const res = await axios.post(`${API_URL}/auditoria/platos/`, {
                visita: item.visita_id,
                nombre: item.nombre,
                descripcion: item.descripcion,
              }, { headers, timeout: 10000 });
              item.id = res.data.id;
              item.synced = true;
              synced++;
            } catch (err) {
              console.error('Error sync plato:', err);
            }
          }
          await AsyncStorage.setItem('@platos', JSON.stringify(platos));
        }
      }

      await checkPendingData();
      
      if (!silent && synced > 0) {
        console.log(`✅ Sincronizados: ${synced}`);
      }
    } catch (error) {
      console.error('Error syncing:', error);
    } finally {
      setSyncing(false);
    }
  };

  if (pendingCount === 0 && !syncing) return null;

  return (
    <TouchableOpacity
      style={[styles.button, syncing && styles.buttonSyncing]}
      onPress={() => syncData(false)}
      disabled={syncing || !isOnline}
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
