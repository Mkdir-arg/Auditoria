import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { storageService } from '../services/storageService';
import { useOfflineSync } from '../hooks/useOfflineSync';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.205:8000/api';

export function HomeScreen({ navigation }: any) {
  const [instituciones, setInstituciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { isOnline, pendingOps } = useOfflineSync();

  useEffect(() => {
    loadInstituciones();
  }, []);

  const loadInstituciones = async () => {
    try {
      // Cargar desde storage local
      const localData = await storageService.getInstituciones();
      setInstituciones(localData);

      // Si hay internet, sincronizar con servidor
      if (isOnline) {
        await syncFromServer();
      }
    } catch (error) {
      console.error('Error cargando instituciones:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const syncFromServer = async () => {
    try {
      const token = await AsyncStorage.getItem('@auth_token');
      const response = await fetch(`${API_URL}/auditoria/instituciones/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) return;

      const serverData = await response.json();

      // Actualizar storage local
      const instituciones = serverData.map((item: any) => ({
        id: item.id.toString(),
        nombre: item.nombre,
        tipo: item.tipo,
        direccion: item.direccion,
        comuna: item.comuna,
        barrio: item.barrio,
        serverId: item.id,
        synced: true,
      }));

      await storageService.updateInstituciones(instituciones);
      setInstituciones(instituciones);
    } catch (error) {
      console.error('Error sincronizando:', error);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Login');
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Visitas', { institucionId: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.nombre}</Text>
        {!item.synced && <View style={styles.unsyncedBadge} />}
      </View>
      <Text style={styles.cardSubtitle}>{item.tipo}</Text>
      <Text style={styles.cardText}>{item.direccion}</Text>
      {item.comuna && <Text style={styles.cardText}>Comuna: {item.comuna}</Text>}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Instituciones</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>
            ⚠️ Modo offline - {pendingOps} operaciones pendientes
          </Text>
        </View>
      )}

      <FlatList
        data={instituciones}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => {
            setRefreshing(true);
            loadInstituciones();
          }} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay instituciones registradas</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  logoutText: {
    color: '#ef4444',
    fontWeight: '600',
  },
  offlineBanner: {
    backgroundColor: '#fef3c7',
    padding: 12,
  },
  offlineText: {
    color: '#92400e',
    textAlign: 'center',
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  unsyncedBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f59e0b',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 32,
    fontSize: 16,
  },
});
