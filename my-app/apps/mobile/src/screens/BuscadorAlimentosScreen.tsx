import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { nutricionService } from '../services/nutricionService';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { colors, spacing, fontSize, borderRadius } from '../styles/theme';

export function BuscadorAlimentosScreen({ route, navigation }: any) {
  const { platoId } = route.params;
  const [search, setSearch] = useState('');
  const [alimentos, setAlimentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAlimento, setSelectedAlimento] = useState<any>(null);
  const [cantidad, setCantidad] = useState('100');

  useEffect(() => {
    loadAlimentos();
  }, []);

  const loadAlimentos = async () => {
    try {
      setLoading(true);
      const data = await nutricionService.getAlimentos({ search });
      setAlimentos(data.results || data);
    } catch (error) {
      console.error('Error loading alimentos:', error);
      Alert.alert('Error', 'No se pudieron cargar los alimentos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadAlimentos();
  };

  const handleSelectAlimento = (alimento: any) => {
    setSelectedAlimento(alimento);
    setCantidad('100');
    setModalVisible(true);
  };

  const handleAgregarIngrediente = async () => {
    if (!cantidad || parseFloat(cantidad) <= 0) {
      Alert.alert('Error', 'Ingrese una cantidad válida');
      return;
    }

    const cantidadNum = parseFloat(cantidad);
    const factor = cantidadNum / 100;

    const ingrediente = {
      id: Date.now(),
      plato_id: platoId,
      alimento_id: selectedAlimento.id,
      alimento_nombre: selectedAlimento.nombre,
      cantidad: cantidadNum,
      unidad: 'g',
      energia_kcal: (selectedAlimento.energia_kcal || 0) * factor,
      proteinas_g: (selectedAlimento.proteinas_g || 0) * factor,
      grasas_totales_g: (selectedAlimento.grasas_totales_g || 0) * factor,
      carbohidratos_g: (selectedAlimento.carbohidratos_totales_g || 0) * factor,
      synced: false,
    };

    const ingredientesData = await AsyncStorage.getItem('@ingredientes');
    const allIngredientes = ingredientesData ? JSON.parse(ingredientesData) : [];
    allIngredientes.push(ingrediente);
    await AsyncStorage.setItem('@ingredientes', JSON.stringify(allIngredientes));

    setModalVisible(false);
    Alert.alert('Éxito', 'Ingrediente agregado', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buscar Alimentos</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre..."
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {alimentos.length === 0 ? (
            <Text style={styles.emptyText}>
              {search ? 'No se encontraron alimentos' : 'Ingrese un término de búsqueda'}
            </Text>
          ) : (
            alimentos.map((alimento) => (
              <TouchableOpacity
                key={alimento.id}
                onPress={() => handleSelectAlimento(alimento)}
              >
                <Card style={styles.alimentoCard}>
                  <Text style={styles.alimentoNombre}>{alimento.nombre}</Text>
                  <Text style={styles.alimentoCategoria}>{alimento.categoria_nombre}</Text>
                  <View style={styles.nutrientesRow}>
                    <Text style={styles.nutriente}>⚡ {alimento.energia_kcal || 0} kcal</Text>
                    <Text style={styles.nutriente}>🥩 {alimento.proteinas_g || 0}g</Text>
                    <Text style={styles.nutriente}>🧈 {alimento.grasas_totales_g || 0}g</Text>
                    <Text style={styles.nutriente}>🍞 {alimento.carbohidratos_totales_g || 0}g</Text>
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar Ingrediente</Text>

            {selectedAlimento && (
              <>
                <Text style={styles.modalAlimento}>{selectedAlimento.nombre}</Text>

                <Input
                  placeholder="Cantidad (gramos)"
                  value={cantidad}
                  onChangeText={setCantidad}
                  keyboardType="numeric"
                  style={styles.modalInput}
                />

                <View style={styles.previewCard}>
                  <Text style={styles.previewTitle}>Vista previa (por {cantidad}g):</Text>
                  <Text style={styles.previewText}>
                    ⚡ {((selectedAlimento.energia_kcal || 0) * parseFloat(cantidad || '0') / 100).toFixed(1)} kcal
                  </Text>
                  <Text style={styles.previewText}>
                    🥩 {((selectedAlimento.proteinas_g || 0) * parseFloat(cantidad || '0') / 100).toFixed(1)}g proteínas
                  </Text>
                  <Text style={styles.previewText}>
                    🧈 {((selectedAlimento.grasas_totales_g || 0) * parseFloat(cantidad || '0') / 100).toFixed(1)}g grasas
                  </Text>
                  <Text style={styles.previewText}>
                    🍞 {((selectedAlimento.carbohidratos_totales_g || 0) * parseFloat(cantidad || '0') / 100).toFixed(1)}g carbohidratos
                  </Text>
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonCancel]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonSave]}
                    onPress={handleAgregarIngrediente}
                  >
                    <Text style={styles.modalButtonTextSave}>Agregar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
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
  searchContainer: {
    flexDirection: 'row',
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    gap: spacing.md,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: fontSize.base,
  },
  searchButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
  },
  searchButtonText: {
    fontSize: fontSize.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  alimentoCard: {
    marginBottom: spacing.md,
  },
  alimentoNombre: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  alimentoCategoria: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    marginBottom: spacing.sm,
  },
  nutrientesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  nutriente: {
    fontSize: fontSize.xs,
    color: colors.gray[700],
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
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
    marginBottom: spacing.md,
  },
  modalAlimento: {
    fontSize: fontSize.base,
    color: colors.gray[700],
    marginBottom: spacing.lg,
  },
  modalInput: {
    marginBottom: spacing.md,
  },
  previewCard: {
    backgroundColor: colors.blue[50],
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  previewTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },
  previewText: {
    fontSize: fontSize.sm,
    color: colors.gray[700],
    marginBottom: spacing.xs,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.md,
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
