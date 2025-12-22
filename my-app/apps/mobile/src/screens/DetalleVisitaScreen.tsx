import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
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
  const [tipoPlato, setTipoPlato] = useState('principal');
  const [porcionesServidas, setPorcionesServidas] = useState('');
  const [imagenUri, setImagenUri] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [visitaId])
  );

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

  const tomarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita acceso a la cámara');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImagenUri(result.assets[0].uri);
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
      tipo_plato: tipoPlato,
      porciones_servidas: porcionesServidas ? Number(porcionesServidas) : null,
      imagen: imagenUri,
      synced: false,
    };

    const platosData = await AsyncStorage.getItem('@platos');
    const allPlatos = platosData ? JSON.parse(platosData) : [];
    allPlatos.push(plato);
    await AsyncStorage.setItem('@platos', JSON.stringify(allPlatos));

    setNombrePlato('');
    setDescripcionPlato('');
    setTipoPlato('principal');
    setPorcionesServidas('');
    setImagenUri(null);
    setModalVisible(false);
    loadData();
  };

  const handleEliminarPlato = async (platoId: number) => {
    Alert.alert(
      'Eliminar Plato',
      '¿Está seguro de eliminar este plato?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const platosData = await AsyncStorage.getItem('@platos');
            if (platosData) {
              const allPlatos = JSON.parse(platosData);
              const filtered = allPlatos.filter((p: any) => p.id !== platoId);
              await AsyncStorage.setItem('@platos', JSON.stringify(filtered));
              loadData();
            }
          },
        },
      ]
    );
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

        <View style={styles.formularioSection}>
          <TouchableOpacity
            style={styles.formularioButton}
            onPress={() => navigation.navigate('Formulario', { visitaId })}
          >
            <Text style={styles.formularioIcon}>📋</Text>
            <View style={styles.formularioTextContainer}>
              <Text style={styles.formularioTitle}>Formulario de Relevamiento</Text>
              <Text style={styles.formularioSubtitle}>
                {visita.formulario_completado ? '✅ Completado' : '⏳ Pendiente'}
              </Text>
            </View>
            <Text style={styles.formularioArrow}>→</Text>
          </TouchableOpacity>
        </View>

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
              <Card key={plato.id} style={styles.platoCard}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Ingredientes', { platoId: plato.id })}
                >
                  <View style={styles.platoHeader}>
                    <View style={styles.platoTitleContainer}>
                      <Text style={styles.platoNombre}>{plato.nombre}</Text>
                      {plato.tipo_plato && (
                        <View style={styles.tipoBadge}>
                          <Text style={styles.tipoBadgeText}>{plato.tipo_plato}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.platoArrow}>→</Text>
                  </View>
                  {plato.porciones_servidas && (
                    <Text style={styles.platoPorciones}>🍽️ {plato.porciones_servidas} porciones</Text>
                  )}
                  {plato.descripcion && (
                    <Text style={styles.platoDescripcion}>{plato.descripcion}</Text>
                  )}
                  <Text style={styles.platoHint}>Toca para agregar ingredientes</Text>
                </TouchableOpacity>
                
                {plato.imagen && (
                  <Image source={{ uri: plato.imagen }} style={styles.platoImagen} />
                )}
                
                <View style={styles.platoActions}>
                  <TouchableOpacity
                    style={styles.cameraButtonSmall}
                    onPress={async () => {
                      const { status } = await ImagePicker.requestCameraPermissionsAsync();
                      if (status !== 'granted') {
                        Alert.alert('Permiso denegado', 'Se necesita acceso a la cámara');
                        return;
                      }
                      const result = await ImagePicker.launchCameraAsync({
                        allowsEditing: true,
                        aspect: [4, 3],
                        quality: 0.5,
                      });
                      if (!result.canceled) {
                        plato.imagen = result.assets[0].uri;
                        const platosData = await AsyncStorage.getItem('@platos');
                        if (platosData) {
                          const allPlatos = JSON.parse(platosData);
                          await AsyncStorage.setItem('@platos', JSON.stringify(allPlatos));
                          loadData();
                        }
                      }
                    }}
                  >
                    <Text style={styles.cameraButtonSmallText}>📷 Foto</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleEliminarPlato(plato.id)}
                  >
                    <Text style={styles.deleteButtonText}>🗑️ Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </Card>
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

            {/* Botón de Cámara */}
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={tomarFoto}
            >
              <Text style={styles.cameraIcon}>📷</Text>
              <Text style={styles.cameraText}>
                {imagenUri ? 'Cambiar foto' : 'Tomar foto del plato'}
              </Text>
            </TouchableOpacity>
            {imagenUri && (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: imagenUri }} style={styles.imagePreview} />
                <Text style={styles.imagePreviewText}>✅ Foto capturada</Text>
              </View>
            )}

            <View style={styles.modalInput}>
              <Text style={styles.modalLabel}>Tipo de Plato</Text>
              <View style={styles.tipoGrid}>
                {[
                  { value: 'principal', label: 'Principal', icon: '🍲' },
                  { value: 'guarnicion', label: 'Guarnición', icon: '🥗' },
                  { value: 'postre', label: 'Postre', icon: '🍰' },
                  { value: 'bebida', label: 'Bebida', icon: '🥤' },
                  { value: 'otro', label: 'Otro', icon: '🍽️' },
                ].map((tipo) => (
                  <TouchableOpacity
                    key={tipo.value}
                    style={[
                      styles.tipoChip,
                      tipoPlato === tipo.value && styles.tipoChipActive,
                    ]}
                    onPress={() => setTipoPlato(tipo.value)}
                  >
                    <Text style={styles.tipoIcon}>{tipo.icon}</Text>
                    <Text
                      style={[
                        styles.tipoText,
                        tipoPlato === tipo.value && styles.tipoTextActive,
                      ]}
                    >
                      {tipo.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Input
              placeholder="Porciones servidas"
              value={porcionesServidas}
              onChangeText={setPorcionesServidas}
              keyboardType="numeric"
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
    alignItems: 'flex-start',
  },
  platoTitleContainer: {
    flex: 1,
  },
  platoNombre: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  tipoBadge: {
    backgroundColor: colors.blue[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: spacing.xs,
  },
  tipoBadgeText: {
    fontSize: fontSize.xs,
    color: colors.blue[700],
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  platoPorciones: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    marginBottom: spacing.xs,
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
  platoActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  cameraButtonSmall: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  cameraButtonSmallText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.danger,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: colors.gray[400],
    marginTop: spacing.xl,
  },
  formularioSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  formularioButton: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formularioIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  formularioTextContainer: {
    flex: 1,
  },
  formularioTitle: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  formularioSubtitle: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
  },
  formularioArrow: {
    fontSize: fontSize.xl,
    color: colors.primary,
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
  modalLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: spacing.sm,
  },
  tipoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tipoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.gray[200],
  },
  tipoChipActive: {
    backgroundColor: colors.blue[50],
    borderColor: colors.primary,
  },
  tipoIcon: {
    fontSize: 18,
    marginRight: spacing.xs,
  },
  tipoText: {
    fontSize: fontSize.xs,
    color: colors.gray[700],
    fontWeight: '500',
  },
  tipoTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue[50],
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  cameraIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  cameraText: {
    fontSize: fontSize.base,
    color: colors.primary,
    fontWeight: '600',
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  imagePreview: {
    width: 200,
    height: 150,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  imagePreviewText: {
    fontSize: fontSize.sm,
    color: colors.success,
  },
  platoImagen: {
    width: '100%',
    height: 150,
    borderRadius: borderRadius.lg,
    marginTop: spacing.sm,
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
