import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from '../components/Card';
import { colors, spacing, fontSize, borderRadius } from '../styles/theme';

export function InstitucionDetalleScreen({ route, navigation }: any) {
  const { institucionId } = route.params;
  const [institucion, setInstitucion] = useState<any>(null);
  const [visitas, setVisitas] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const instituciones = await AsyncStorage.getItem('@instituciones');
    if (instituciones) {
      const instArray = JSON.parse(instituciones);
      const inst = Array.isArray(instArray) ? instArray.find((i: any) => i.id === institucionId) : null;
      setInstitucion(inst);
    }

    const visitasData = await AsyncStorage.getItem('@visitas');
    if (visitasData) {
      const allVisitas = JSON.parse(visitasData);
      const filtered = Array.isArray(allVisitas) ? allVisitas.filter((v: any) => v.institucion_id === institucionId) : [];
      setVisitas(filtered);
    }
  };

  const getTipoIcon = (tipo: string) => {
    const icons: any = {
      escuela: '🏫',
      cdi: '🏬',
      hogar: '🏠',
      geriatrico: '🏛️',
    };
    return icons[tipo] || '🏭';
  };

  if (!institucion) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle Institución</Text>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.mainCard}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{getTipoIcon(institucion.tipo)}</Text>
          </View>
          <Text style={styles.nombre}>{institucion.nombre}</Text>
          <Text style={styles.tipo}>{institucion.tipo.toUpperCase()}</Text>
          <View style={[styles.badge, institucion.activo ? styles.badgeActive : styles.badgeInactive]}>
            <Text style={styles.badgeText}>{institucion.activo ? 'Activa' : 'Inactiva'}</Text>
          </View>
        </Card>

        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>📋 Información</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Código:</Text>
            <Text style={styles.infoValue}>{institucion.codigo}</Text>
          </View>

          {institucion.direccion && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Dirección:</Text>
              <Text style={styles.infoValue}>{institucion.direccion}</Text>
            </View>
          )}

          {institucion.barrio && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Barrio:</Text>
              <Text style={styles.infoValue}>{institucion.barrio}</Text>
            </View>
          )}

          {institucion.comuna && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Comuna:</Text>
              <Text style={styles.infoValue}>{institucion.comuna}</Text>
            </View>
          )}
        </Card>

        <Card style={styles.visitasCard}>
          <View style={styles.visitasHeader}>
            <Text style={styles.sectionTitle}>📊 Visitas ({visitas.length})</Text>
            <TouchableOpacity
              style={styles.addVisitaButton}
              onPress={() => navigation.navigate('NuevaVisita', { institucionId })}
            >
              <Text style={styles.addVisitaText}>+ Nueva</Text>
            </TouchableOpacity>
          </View>

          {visitas.length === 0 ? (
            <Text style={styles.emptyText}>No hay visitas registradas</Text>
          ) : (
            visitas.map((visita) => (
              <TouchableOpacity
                key={visita.id}
                style={styles.visitaItem}
                onPress={() => navigation.navigate('DetalleVisita', { visitaId: visita.id })}
              >
                <Text style={styles.visitaFecha}>
                  {new Date(visita.fecha).toLocaleDateString('es-AR')}
                </Text>
                <Text style={styles.visitaTipo}>{visita.tipo_comida}</Text>
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
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  mainCard: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.blue[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  icon: {
    fontSize: 40,
  },
  nombre: {
    fontSize: fontSize['2xl'],
    fontWeight: 'bold',
    color: colors.gray[900],
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  tipo: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  badge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  badgeActive: {
    backgroundColor: '#dcfce7',
  },
  badgeInactive: {
    backgroundColor: '#fee2e2',
  },
  badgeText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.gray[900],
  },
  infoCard: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  infoLabel: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
  },
  infoValue: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.gray[900],
    flex: 1,
    textAlign: 'right',
  },
  visitasCard: {
    marginBottom: spacing.lg,
  },
  visitasHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  addVisitaButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  addVisitaText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  visitaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  visitaFecha: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.gray[900],
  },
  visitaTipo: {
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
