import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { nutricionService } from '../services/nutricionService';
import { Card } from '../components/Card';
import { colors, spacing, fontSize, borderRadius } from '../styles/theme';

export function CategoriasScreen({ navigation }: any) {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      setLoading(true);
      const data = await nutricionService.getCategorias();
      const cats = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
      setCategorias(cats);
    } catch (error) {
      console.error('Error loading categorias:', error);
      Alert.alert('Error', 'No se pudieron cargar las categorías');
      setCategorias([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Categorías de Alimentos</Text>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.infoCard}>
          <Text style={styles.infoText}>🏷️ {categorias.length} categorías disponibles</Text>
        </Card>

        {categorias.map((cat) => (
          <Card key={cat.id} style={styles.categoriaCard}>
            <View style={styles.categoriaHeader}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>📁</Text>
              </View>
              <View style={styles.categoriaInfo}>
                <Text style={styles.categoriaNombre}>{cat.nombre}</Text>
                <Text style={styles.categoriaCodigo}>Código: {cat.codigo}</Text>
                {cat.descripcion && (
                  <Text style={styles.categoriaDescripcion}>{cat.descripcion}</Text>
                )}
              </View>
            </View>
          </Card>
        ))}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  infoCard: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    borderWidth: 1,
    marginBottom: spacing.lg,
  },
  infoText: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.gray[900],
    textAlign: 'center',
  },
  categoriaCard: {
    marginBottom: spacing.md,
  },
  categoriaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 24,
  },
  categoriaInfo: {
    flex: 1,
  },
  categoriaNombre: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  categoriaCodigo: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  categoriaDescripcion: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
  },
});
