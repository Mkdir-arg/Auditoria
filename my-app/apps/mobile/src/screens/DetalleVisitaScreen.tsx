import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { storageService } from '../services/storageService';
import { useOfflineSync } from '../hooks/useOfflineSync';

export function DetalleVisitaScreen({ route, navigation }: any) {
  const { visitaId } = route.params;
  const [visita, setVisita] = useState<any | null>(null);
  const [platos, setPlatos] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nombrePlato, setNombrePlato] = useState('');
  const [descripcionPlato, setDescripcionPlato] = useState('');
  const { addToQueue } = useOfflineSync();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const visitas = await storageService.getVisitas();
    const v = visitas.find((vis: any) => vis.id === visitaId);
    setVisita(v);

    const platosData = await storageService.getPlatos(visitaId);
    setPlatos(platosData);
  };

  const handleAgregarPlato = async () => {
    if (!nombrePlato.trim()) {
      Alert.alert('Error', 'Ingrese el nombre del plato');
      return;
    }

    try {
      await storageService.savePlato({
        visitaId,
        nombre: nombrePlato,
        descripcion: descripcionPlato,
      });

      await addToQueue({
        type: 'CREATE',
        entity: 'platos',
        data: {
          visita: visitaId,
          nombre: nombrePlato,
          descripcion: descripcionPlato,
        },
      });

      setNombrePlato('');
      setDescripcionPlato('');
      setModalVisible(false);
      loadData();
    } catch (error) {
      console.error('Error agregando plato:', error);
      Alert.alert('Error', 'No se pudo agregar el plato');
    }
  };

  const renderPlato = ({ item }: { item: any }) => (
    <View style={styles.platoCard}>
      <View style={styles.platoHeader}>
        <Text style={styles.platoNombre}>{item.nombre}</Text>
        {!item.synced && <View style={styles.unsyncedBadge} />}
      </View>
      {item.descripcion && (
        <Text style={styles.platoDescripcion}>{item.descripcion}</Text>
      )}
    </View>
  );

  if (!visita) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle de Visita</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Fecha</Text>
        <Text style={styles.infoValue}>
          {new Date(visita.fecha).toLocaleDateString('es-AR')}
        </Text>

        <Text style={styles.infoLabel}>Tipo de Comida</Text>
        <Text style={styles.infoValue}>{visita.tipoComida}</Text>

        {visita.observaciones && (
          <>
            <Text style={styles.infoLabel}>Observaciones</Text>
            <Text style={styles.infoValue}>{visita.observaciones}</Text>
          </>
        )}
      </View>

      <View style={styles.platosSection}>
        <View style={styles.platosSectionHeader}>
          <Text style={styles.platosSectionTitle}>Platos Observados</Text>
          <TouchableOpacity
            style={styles.addPlatoButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addPlatoButtonText}>+ Agregar</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={platos}
          renderItem={renderPlato}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay platos registrados</Text>
          }
        />
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Plato</Text>

            <TextInput
              style={styles.input}
              placeholder="Nombre del plato *"
              value={nombrePlato}
              onChangeText={setNombrePlato}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descripción"
              value={descripcionPlato}
              onChangeText={setDescripcionPlato}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={handleAgregarPlato}
              >
                <Text style={styles.modalButtonTextSave}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  infoCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  platosSection: {
    flex: 1,
    padding: 16,
    paddingTop: 0,
  },
  platosSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  platosSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  addPlatoButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addPlatoButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  platoCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  platoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  platoNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  platoDescripcion: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  unsyncedBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f59e0b',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 32,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#f3f4f6',
  },
  modalButtonSave: {
    backgroundColor: '#3b82f6',
  },
  modalButtonTextCancel: {
    color: '#374151',
    fontWeight: '600',
  },
  modalButtonTextSave: {
    color: '#fff',
    fontWeight: '600',
  },
});
