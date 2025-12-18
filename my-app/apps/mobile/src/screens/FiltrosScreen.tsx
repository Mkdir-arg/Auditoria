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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auditoriaService } from '../services/auditoriaService';
import { Card } from '../components/Card';
import { colors, spacing, fontSize, borderRadius } from '../styles/theme';

export function FiltrosScreen({ navigation }: any) {
  const [instituciones, setInstituciones] = useState<any[]>([]);
  const [visitas, setVisitas] = useState<any[]>([]);
  const [filteredVisitas, setFilteredVisitas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [tipoInstitucion, setTipoInstitucion] = useState<string | null>(null);
  const [tipoComida, setTipoComida] = useState<string | null>(null);
  const [institucionId, setInstitucionId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tipoInstitucion, tipoComida, institucionId, visitas]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [instData, visitasData] = await Promise.all([
        auditoriaService.getInstituciones(),
        auditoriaService.getVisitas(),
      ]);
      setInstituciones(Array.isArray(instData?.results) ? instData.results : Array.isArray(instData) ? instData : []);
      setVisitas(Array.isArray(visitasData?.results) ? visitasData.results : Array.isArray(visitasData) ? visitasData : []);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = Array.isArray(visitas) ? [...visitas] : [];

    if (tipoInstitucion && Array.isArray(instituciones)) {
      const institucionesFiltered = instituciones
        .filter((i) => i.tipo === tipoInstitucion)
        .map((i) => i.id);
      filtered = filtered.filter((v) => institucionesFiltered.includes(v.institucion));
    }

    if (tipoComida) {
      filtered = filtered.filter((v) => v.tipo_comida === tipoComida);
    }

    if (institucionId) {
      filtered = filtered.filter((v) => v.institucion === institucionId);
    }

    setFilteredVisitas(filtered);
  };

  const clearFilters = () => {
    setTipoInstitucion(null);
    setTipoComida(null);
    setInstitucionId(null);
  };

  const tiposInstitucion = ['escuela', 'cdi', 'hogar', 'geriatrico'];
  const tiposComida = ['desayuno', 'almuerzo', 'merienda', 'cena', 'vianda'];

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
        <Text style={styles.headerTitle}>Filtros Avanzados</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Resultados */}
        <Card style={styles.resultsCard}>
          <Text style={styles.resultsText}>
            📊 {filteredVisitas.length} visita{filteredVisitas.length !== 1 ? 's' : ''} encontrada{filteredVisitas.length !== 1 ? 's' : ''}
          </Text>
          {(tipoInstitucion || tipoComida || institucionId) && (
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>Limpiar filtros</Text>
            </TouchableOpacity>
          )}
        </Card>

        {/* Tipo de Institución */}
        <Card style={styles.filterCard}>
          <Text style={styles.filterTitle}>🏢 Tipo de Institución</Text>
          <View style={styles.chipsContainer}>
            {tiposInstitucion.map((tipo) => (
              <TouchableOpacity
                key={tipo}
                style={[
                  styles.chip,
                  tipoInstitucion === tipo && styles.chipActive,
                ]}
                onPress={() => setTipoInstitucion(tipoInstitucion === tipo ? null : tipo)}
              >
                <Text
                  style={[
                    styles.chipText,
                    tipoInstitucion === tipo && styles.chipTextActive,
                  ]}
                >
                  {tipo}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Tipo de Comida */}
        <Card style={styles.filterCard}>
          <Text style={styles.filterTitle}>🍽️ Tipo de Comida</Text>
          <View style={styles.chipsContainer}>
            {tiposComida.map((tipo) => (
              <TouchableOpacity
                key={tipo}
                style={[
                  styles.chip,
                  tipoComida === tipo && styles.chipActive,
                ]}
                onPress={() => setTipoComida(tipoComida === tipo ? null : tipo)}
              >
                <Text
                  style={[
                    styles.chipText,
                    tipoComida === tipo && styles.chipTextActive,
                  ]}
                >
                  {tipo}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Institución Específica */}
        <Card style={styles.filterCard}>
          <Text style={styles.filterTitle}>🎯 Institución Específica</Text>
          <ScrollView style={styles.institucionesScroll}>
            {instituciones.map((inst) => (
              <TouchableOpacity
                key={inst.id}
                style={[
                  styles.institucionItem,
                  institucionId === inst.id && styles.institucionItemActive,
                ]}
                onPress={() => setInstitucionId(institucionId === inst.id ? null : inst.id)}
              >
                <Text
                  style={[
                    styles.institucionName,
                    institucionId === inst.id && styles.institucionNameActive,
                  ]}
                >
                  {inst.nombre}
                </Text>
                <Text style={styles.institucionType}>{inst.tipo}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Card>

        {/* Resultados */}
        <Card style={styles.resultsListCard}>
          <Text style={styles.resultsListTitle}>📋 Resultados</Text>
          {filteredVisitas.length === 0 ? (
            <Text style={styles.emptyText}>No hay visitas que coincidan con los filtros</Text>
          ) : (
            filteredVisitas.map((visita) => (
              <TouchableOpacity
                key={visita.id}
                style={styles.visitaItem}
                onPress={() => navigation.navigate('DetalleVisita', { visitaId: visita.id })}
              >
                <Text style={styles.visitaInstitucion}>{visita.institucion_nombre}</Text>
                <Text style={styles.visitaInfo}>
                  {new Date(visita.fecha).toLocaleDateString('es-AR')} • {visita.tipo_comida}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </Card>
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
  resultsCard: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    borderWidth: 1,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultsText: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.gray[900],
  },
  clearButton: {
    backgroundColor: colors.danger,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  clearButtonText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  filterCard: {
    marginBottom: spacing.lg,
  },
  filterTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.gray[700],
    fontSize: fontSize.sm,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  chipTextActive: {
    color: colors.white,
  },
  institucionesScroll: {
    maxHeight: 200,
  },
  institucionItem: {
    padding: spacing.md,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  institucionItemActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  institucionName: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  institucionNameActive: {
    color: colors.white,
  },
  institucionType: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    textTransform: 'capitalize',
  },
  resultsListCard: {
    marginBottom: spacing.lg,
  },
  resultsListTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  visitaItem: {
    padding: spacing.md,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  visitaInstitucion: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  visitaInfo: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    textTransform: 'capitalize',
  },
  emptyText: {
    textAlign: 'center',
    color: colors.gray[400],
    marginTop: spacing.md,
  },
});
