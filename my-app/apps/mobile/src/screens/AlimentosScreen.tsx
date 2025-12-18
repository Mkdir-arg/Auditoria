import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { nutricionService } from '../services/nutricionService';
import { Card } from '../components/Card';
import { colors, spacing, fontSize, borderRadius } from '../styles/theme';

export function AlimentosScreen({ navigation }: any) {
  const [search, setSearch] = useState('');
  const [alimentos, setAlimentos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategorias();
    loadAlimentos();
  }, []);

  const loadCategorias = async () => {
    try {
      const data = await nutricionService.getCategorias();
      const cats = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
      setCategorias(cats);
    } catch (error) {
      console.error('Error loading categorias:', error);
      setCategorias([]);
    }
  };

  const loadAlimentos = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (search) params.search = search;
      if (categoriaSeleccionada) params.categoria = categoriaSeleccionada;

      const data = await nutricionService.getAlimentos(params);
      const alims = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
      setAlimentos(alims);
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

  const handleCategoriaFilter = (categoriaId: number | null) => {
    setCategoriaSeleccionada(categoriaId);
    setTimeout(() => loadAlimentos(), 100);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Catálogo de Alimentos</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar alimentos..."
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
        <TouchableOpacity
          style={[styles.categoryChip, !categoriaSeleccionada && styles.categoryChipActive]}
          onPress={() => handleCategoriaFilter(null)}
        >
          <Text style={[styles.categoryChipText, !categoriaSeleccionada && styles.categoryChipTextActive]}>
            Todas
          </Text>
        </TouchableOpacity>
        {categorias.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.categoryChip, categoriaSeleccionada === cat.id && styles.categoryChipActive]}
            onPress={() => handleCategoriaFilter(cat.id)}
          >
            <Text style={[styles.categoryChipText, categoriaSeleccionada === cat.id && styles.categoryChipTextActive]}>
              {cat.nombre}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView style={styles.content}>
          <Text style={styles.resultCount}>
            {alimentos.length} alimento{alimentos.length !== 1 ? 's' : ''} encontrado{alimentos.length !== 1 ? 's' : ''}
          </Text>

          {alimentos.length === 0 ? (
            <Text style={styles.emptyText}>No se encontraron alimentos</Text>
          ) : (
            alimentos.map((alimento) => (
              <Card key={alimento.id} style={styles.alimentoCard}>
                <View style={styles.alimentoHeader}>
                  <View style={styles.alimentoInfo}>
                    <Text style={styles.alimentoNombre}>{alimento.nombre}</Text>
                    <Text style={styles.alimentoCategoria}>{alimento.categoria_nombre}</Text>
                    <Text style={styles.alimentoCodigo}>Código: {alimento.codigo_argenfood}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <Text style={styles.nutrientesTitle}>Valores nutricionales (por 100g):</Text>
                <View style={styles.nutrientesGrid}>
                  <View style={styles.nutrienteItem}>
                    <Text style={styles.nutrienteValue}>{alimento.energia_kcal || 0}</Text>
                    <Text style={styles.nutrienteLabel}>kcal</Text>
                  </View>
                  <View style={styles.nutrienteItem}>
                    <Text style={styles.nutrienteValue}>{alimento.proteinas_g || 0}</Text>
                    <Text style={styles.nutrienteLabel}>Proteínas (g)</Text>
                  </View>
                  <View style={styles.nutrienteItem}>
                    <Text style={styles.nutrienteValue}>{alimento.grasas_totales_g || 0}</Text>
                    <Text style={styles.nutrienteLabel}>Grasas (g)</Text>
                  </View>
                  <View style={styles.nutrienteItem}>
                    <Text style={styles.nutrienteValue}>{alimento.carbohidratos_totales_g || 0}</Text>
                    <Text style={styles.nutrienteLabel}>Carbohidratos (g)</Text>
                  </View>
                </View>
              </Card>
            ))
          )}
        </ScrollView>
      )}
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
  categoriesScroll: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  categoryChip: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
  },
  categoryChipText: {
    color: colors.gray[700],
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: colors.white,
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
  resultCount: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    marginBottom: spacing.md,
  },
  alimentoCard: {
    marginBottom: spacing.md,
  },
  alimentoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  alimentoInfo: {
    flex: 1,
  },
  alimentoNombre: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  alimentoCategoria: {
    fontSize: fontSize.sm,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  alimentoCodigo: {
    fontSize: fontSize.xs,
    color: colors.gray[500],
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginVertical: spacing.md,
  },
  nutrientesTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: spacing.sm,
  },
  nutrientesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  nutrienteItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.gray[50],
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  nutrienteValue: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.primary,
  },
  nutrienteLabel: {
    fontSize: fontSize.xs,
    color: colors.gray[600],
    marginTop: spacing.xs,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.gray[400],
    marginTop: spacing.xl,
  },
});
