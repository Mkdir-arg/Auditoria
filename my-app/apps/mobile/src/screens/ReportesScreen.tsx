import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { reportesService } from '../services/reportesService';
import { Card } from '../components/Card';
import { colors, spacing, fontSize, borderRadius } from '../styles/theme';

export function ReportesScreen({ navigation }: any) {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await reportesService.getDashboard();
      setDashboard(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
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
        <Text style={styles.headerTitle}>Reportes y Estadísticas</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <Card style={[styles.statCard, styles.blueCard]}>
            <Text style={styles.statEmoji}>🏢</Text>
            <Text style={styles.statValue}>{dashboard?.total_instituciones || 0}</Text>
            <Text style={styles.statLabel}>Instituciones Activas</Text>
          </Card>

          <Card style={[styles.statCard, styles.greenCard]}>
            <Text style={styles.statEmoji}>📋</Text>
            <Text style={styles.statValue}>{dashboard?.total_visitas || 0}</Text>
            <Text style={styles.statLabel}>Total Visitas</Text>
          </Card>

          <Card style={[styles.statCard, styles.purpleCard]}>
            <Text style={styles.statEmoji}>🍽️</Text>
            <Text style={styles.statValue}>{dashboard?.total_platos || 0}</Text>
            <Text style={styles.statLabel}>Platos Registrados</Text>
          </Card>

          <Card style={[styles.statCard, styles.orangeCard]}>
            <Text style={styles.statEmoji}>📊</Text>
            <Text style={styles.statValue}>
              {dashboard?.promedio_platos_por_visita?.toFixed(1) || 0}
            </Text>
            <Text style={styles.statLabel}>Promedio Platos/Visita</Text>
          </Card>
        </View>

        {/* Visitas por Tipo */}
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>📊 Visitas por Tipo de Comida</Text>
          {dashboard?.visitas_por_tipo?.map((item: any) => (
            <View key={item.tipo_comida} style={styles.barContainer}>
              <Text style={styles.barLabel}>{item.tipo_comida}</Text>
              <View style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      width: `${(item.count / (dashboard?.total_visitas || 1)) * 100}%`,
                    },
                  ]}
                />
                <Text style={styles.barValue}>{item.count}</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Instituciones por Tipo */}
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>🏢 Instituciones por Tipo</Text>
          {dashboard?.instituciones_por_tipo?.map((item: any) => (
            <View key={item.tipo} style={styles.barContainer}>
              <Text style={styles.barLabel}>{item.tipo}</Text>
              <View style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    styles.barGreen,
                    {
                      width: `${(item.count / (dashboard?.total_instituciones || 1)) * 100}%`,
                    },
                  ]}
                />
                <Text style={styles.barValue}>{item.count}</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Text style={styles.sectionTitle}>🚀 Reportes Disponibles</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Ranking')}
          >
            <Text style={styles.actionEmoji}>🏆</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Ranking de Instituciones</Text>
              <Text style={styles.actionSubtitle}>Por cantidad de visitas</Text>
            </View>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Filtros')}
          >
            <Text style={styles.actionEmoji}>🔍</Text>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Filtros Avanzados</Text>
              <Text style={styles.actionSubtitle}>Buscar por criterios</Text>
            </View>
            <Text style={styles.actionArrow}>→</Text>
          </TouchableOpacity>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: spacing.lg,
  },
  blueCard: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    borderWidth: 1,
  },
  greenCard: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    borderWidth: 1,
  },
  purpleCard: {
    backgroundColor: '#faf5ff',
    borderColor: '#e9d5ff',
    borderWidth: 1,
  },
  orangeCard: {
    backgroundColor: '#fff7ed',
    borderColor: '#fed7aa',
    borderWidth: 1,
  },
  statEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: fontSize['3xl'],
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.gray[600],
    textAlign: 'center',
  },
  chartCard: {
    marginBottom: spacing.lg,
  },
  chartTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.lg,
  },
  barContainer: {
    marginBottom: spacing.md,
  },
  barLabel: {
    fontSize: fontSize.sm,
    color: colors.gray[700],
    marginBottom: spacing.xs,
    textTransform: 'capitalize',
  },
  barWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bar: {
    height: 24,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    minWidth: 20,
  },
  barGreen: {
    backgroundColor: colors.success,
  },
  barValue: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.gray[700],
  },
  actionsCard: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  actionEmoji: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  actionSubtitle: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
  },
  actionArrow: {
    fontSize: fontSize.xl,
    color: colors.primary,
  },
});
