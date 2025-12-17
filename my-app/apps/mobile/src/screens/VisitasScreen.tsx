import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { storageService } from '../services/storageService';
import { useOfflineSync } from '../hooks/useOfflineSync';

export function VisitasScreen({ route, navigation }: any) {
  const { institucionId } = route.params;
  const [visitas, setVisitas] = useState<any[]>([]);
  const [institucion, setInstitucion] = useState<any | null>(null);
  const { isOnline, addToQueue } = useOfflineSync();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const instituciones = await storageService.getInstituciones();
    const inst = instituciones.find((i: any) => i.id === institucionId);
    setInstitucion(inst);

    const visitasData = await storageService.getVisitas(institucionId);
    setVisitas(visitasData);
  };

  const handleNuevaVisita = () => {
    navigation.navigate('NuevaVisita', { institucionId });
  };

  const handleVerVisita = (visita: Visita) => {
    navigation.navigate('DetalleVisita', { visitaId: visita.id });
  };

  const formatFecha = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('es-AR');
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleVerVisita(item)}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{formatFecha(item.fecha)}</Text>
        {!item.synced && <View style={styles.unsyncedBadge} />}
      </View>
      <Text style={styles.cardSubtitle}>Tipo: {item.tipoComida}</Text>
      {item.observaciones && (
        <Text style={styles.cardText} numberOfLines={2}>
          {item.observaciones}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{institucion?.nombre}</Text>
      </View>

      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>⚠️ Modo offline</Text>
        </View>
      )}

      <TouchableOpacity style={styles.addButton} onPress={handleNuevaVisita}>
        <Text style={styles.addButtonText}>+ Nueva Visita</Text>
      </TouchableOpacity>

      <FlatList
        data={visitas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay visitas registradas</Text>
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
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    color: '#3b82f6',
    fontSize: 16,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
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
  addButton: {
    backgroundColor: '#3b82f6',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    padding: 16,
    paddingTop: 0,
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
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 32,
    fontSize: 16,
  },
});
