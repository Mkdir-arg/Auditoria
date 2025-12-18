import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { colors, spacing, fontSize, borderRadius } from '../styles/theme';

export function DetalleVisitaScreen({ route, navigation }: any) {
  const { visitaId } = route.params;
  const [visita, setVisita] = useState<any>(null);
  const [platos, setPlatos] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nombrePlato, setNombrePlato] = useState('');
  const [descripcionPlato, setDescripcionPlato] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const visitasData = await AsyncStorage.getItem('@visitas');
    if (visitasData) {
      const visitas = JSON.parse(visitasData);
      const v = visitas.find((vis: any) => vis.id === visitaId);
      setVisita(v);
    }

    const platosData = await AsyncStorage.getItem('@platos');
    if (platosData) {
      const allPlatos = JSON.parse(platosData);
      setPlatos(allPlatos.filter((p: any) => p.visita_id === visitaId));
    }
  };

  const handleAgregarPlato = async () => {
    if (!nombrePlato.trim()) {
      Alert.alert('Error', 'Ingrese el nombre del plato');
      return;
    }

    const plato = {
      id: Date.now(),
      visita_id: visitaId,
      nombre: nombrePlato,
      descripcion: descripcionPlato,
      synced: false,
    };

    const platosData = await AsyncStorage.getItem('@platos');
    const allPlatos = platosData ? JSON.parse(platosData) : [];
    allPlatos.push(plato);
    await AsyncStorage.setItem('@platos', JSON.stringify(allPlatos));

    setNombrePlato('');
    setDescripcionPlato('');
    setModalVisible(false);
    loadData();
  };

  if (!visita) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle de Visita</Text>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.infoCard}>
          <Text style={styles.label}>Fecha</Text>
          <Text style={styles.value}>{new Date(visita.fecha).toLocaleDateString('es-AR')}</Text>

          <Text style={styles.label}>Tipo de Comida</Text>
          <Text style={styles.value}>{visita.tipo_comida}</Text>

          {visita.observaciones && (
            <>
              <Text style={styles.label}>Observaciones</Text>
              <Text style={styles.value}>{visita.observaciones}</Text>
            </>
          )}
        </Card>

        <View style={styles.platosSection}>
          <View style={styles.platosSectionHeader}>
            <Text style={styles.sectionTitle}>🍽️ Platos Observados</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.addButtonText}>+ Agregar</Text>
            </TouchableOpacity>
          </View>

          {platos.length === 0 ? (
            <Text style={styles.emptyText}>No hay platos registrados</Text>
          ) : (
            platos.map((plato) => (
              <TouchableOpacity
                key={plato.id}
                onPress={() => navigation.navigate('Ingredientes', { platoId: plato.id })}
              >
                <Card style={styles.platoCard}>
                  <View style={styles.platoHeader}>
                    <Text style={styles.platoNombre}>{plato.nombre}</Text>
                    <Text style={styles.platoArrow}>→</Text>
                  </View>
                  {plato.descripcion && (
                    <Text style={styles.platoDescripcion}>{plato.descripcion}</Text>
                  )}
                  <Text style={styles.platoHint}>Toca para agregar ingredientes</Text>
                </Card>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Plato</Text>

            <Input
              placeholder="Nombre del plato *"
              value={nombrePlato}
              onChangeText={setNombrePlato}
              style={styles.modalInput}
            />

            <Input
              placeholder="Descripción"
              value={descripcionPlato}
              onChangeText={setDescripcionPlato}
              multiline
              numberOfLines={3}
              style={styles.modalInput}
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
    backgroundColor: colors.gray[100],
  },
  header: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  backButton: {
    color: colors.primary,
    fontSize: fontSize.base,
    marginBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  content: {
    flex: 1,
  },
  infoCard: {
    margin: spacing.lg,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: fontSize.base,
    color: colors.gray[900],
    fontWeight: '500',
  },
  platosSection: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  platosSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.gray[900],
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  platoCard: {
    marginBottom: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  platoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  platoNombre: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.xs,
    flex: 1,
  },
  platoArrow: {
    fontSize: fontSize.xl,
    color: colors.primary,
  },
  platoDescripcion: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  platoHint: {
    fontSize: fontSize.xs,
    color: colors.gray[400],
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    color: colors.gray[400],
    marginTop: spacing.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: spacing.lg,
  },
  modalInput: {
    marginBottom: spacing.md,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  modalButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: colors.gray[200],
  },
  modalButtonSave: {
    backgroundColor: colors.primary,
  },
  modalButtonTextCancel: {
    color: colors.gray[700],
    fontWeight: '600',
  },
  modalButtonTextSave: {
    color: colors.white,
    fontWeight: '600',
  },
});
