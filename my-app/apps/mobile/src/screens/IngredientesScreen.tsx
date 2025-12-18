import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from '../components/Card';
import { colors, spacing, fontSize, borderRadius } from '../styles/theme';

export function IngredientesScreen({ route, navigation }: any) {
  const { platoId } = route.params;
  const [plato, setPlato] = useState<any>(null);
  const [ingredientes, setIngredientes] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const platosData = await AsyncStorage.getItem('@platos');
    if (platosData) {
      const platos = JSON.parse(platosData);
      const p = platos.find((pl: any) => pl.id === platoId);
      setPlato(p);
    }

    const ingredientesData = await AsyncStorage.getItem('@ingredientes');
    if (ingredientesData) {
      const allIngredientes = JSON.parse(ingredientesData);
      setIngredientes(allIngredientes.filter((i: any) => i.plato_id === platoId));
    }
  };

  const handleEliminar = async (id: number) => {
    Alert.alert(
      'Confirmar',
      '¿Eliminar este ingrediente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const ingredientesData = await AsyncStorage.getItem('@ingredientes');
            if (ingredientesData) {
              const allIngredientes = JSON.parse(ingredientesData);
              const filtered = allIngredientes.filter((i: any) => i.id !== id);
              await AsyncStorage.setItem('@ingredientes', JSON.stringify(filtered));
              loadData();
            }
          },
        },
      ]
    );
  };

  const calcularTotales = () => {
    const totales = {
      energia: 0,
      proteinas: 0,
      grasas: 0,
      carbohidratos: 0,
    };

    ingredientes.forEach((ing) => {
      totales.energia += ing.energia_kcal || 0;
      totales.proteinas += ing.proteinas_g || 0;
      totales.grasas += ing.grasas_totales_g || 0;
      totales.carbohidratos += ing.carbohidratos_g || 0;
    });

    return totales;
  };

  const totales = calcularTotales();

  if (!plato) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{plato.nombre}</Text>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.totalesCard}>
          <Text style={styles.totalesTitle}>📊 Valores Nutricionales Totales</Text>
          <View style={styles.totalesGrid}>
            <View style={styles.totalItem}>
              <Text style={styles.totalValue}>{totales.energia.toFixed(1)}</Text>
              <Text style={styles.totalLabel}>kcal</Text>
            </View>
            <View style={styles.totalItem}>
              <Text style={styles.totalValue}>{totales.proteinas.toFixed(1)}</Text>
              <Text style={styles.totalLabel}>Proteínas (g)</Text>
            </View>
            <View style={styles.totalItem}>
              <Text style={styles.totalValue}>{totales.grasas.toFixed(1)}</Text>
              <Text style={styles.totalLabel}>Grasas (g)</Text>
            </View>
            <View style={styles.totalItem}>
              <Text style={styles.totalValue}>{totales.carbohidratos.toFixed(1)}</Text>
              <Text style={styles.totalLabel}>Carbohidratos (g)</Text>
            </View>
          </View>
        </Card>

        <View style={styles.ingredientesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🥗 Ingredientes ({ingredientes.length})</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('BuscadorAlimentos', { platoId })}
            >
              <Text style={styles.addButtonText}>+ Agregar</Text>
            </TouchableOpacity>
          </View>

          {ingredientes.length === 0 ? (
            <Text style={styles.emptyText}>No hay ingredientes. Agrega el primero.</Text>
          ) : (
            ingredientes.map((ing) => (
              <Card key={ing.id} style={styles.ingredienteCard}>
                <View style={styles.ingredienteHeader}>
                  <Text style={styles.ingredienteNombre}>{ing.alimento_nombre}</Text>
                  <TouchableOpacity onPress={() => handleEliminar(ing.id)}>
                    <Text style={styles.deleteButton}>🗑️</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.ingredienteCantidad}>
                  {ing.cantidad} {ing.unidad}
                </Text>
                <View style={styles.nutrientesRow}>
                  <Text style={styles.nutriente}>⚡ {ing.energia_kcal?.toFixed(1)} kcal</Text>
                  <Text style={styles.nutriente}>🥩 {ing.proteinas_g?.toFixed(1)}g</Text>
                  <Text style={styles.nutriente}>🧈 {ing.grasas_totales_g?.toFixed(1)}g</Text>
                  <Text style={styles.nutriente}>🍞 {ing.carbohidratos_g?.toFixed(1)}g</Text>
                </View>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
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
  totalesCard: {
    margin: spacing.lg,
    backgroundColor: colors.blue[50],
    borderColor: colors.blue[200],
  },
  totalesTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  totalesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  totalItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
  },
  totalValue: {
    fontSize: fontSize['2xl'],
    fontWeight: 'bold',
    color: colors.primary,
  },
  totalLabel: {
    fontSize: fontSize.xs,
    color: colors.gray[600],
    marginTop: spacing.xs,
  },
  ingredientesSection: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  sectionHeader: {
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
  ingredienteCard: {
    marginBottom: spacing.md,
  },
  ingredienteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  ingredienteNombre: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.gray[900],
    flex: 1,
  },
  deleteButton: {
    fontSize: fontSize.xl,
  },
  ingredienteCantidad: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    marginBottom: spacing.sm,
  },
  nutrientesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
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
});
