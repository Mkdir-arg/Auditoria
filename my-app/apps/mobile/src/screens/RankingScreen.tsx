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

export function RankingScreen({ navigation }: any) {
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRanking();
  }, []);

  const loadRanking = async () => {
    try {
      setLoading(true);
      const data = await reportesService.getRanking({ limit: 20 });
      setRanking(data);
    } catch (error) {
      console.error('Error loading ranking:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalEmoji = (position: number) => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return `${position}°`;
  };

  const getCardStyle = (position: number) => {
    if (position === 1) return styles.goldCard;
    if (position === 2) return styles.silverCard;
    if (position === 3) return styles.bronzeCard;
    return {};
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
        <Text style={styles.headerTitle}>Ranking de Instituciones</Text>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.infoCard}>
          <Text style={styles.infoText}>
            🏆 Ranking por cantidad de visitas realizadas
          </Text>
        </Card>

        {ranking.length === 0 ? (
          <Text style={styles.emptyText}>No hay datos disponibles</Text>
        ) : (
          ranking.map((item, index) => (
            <Card key={item.institucion_id} style={[styles.rankCard, getCardStyle(index + 1)]}>
              <View style={styles.rankHeader}>
                <Text style={styles.rankPosition}>{getMedalEmoji(index + 1)}</Text>
                <View style={styles.rankInfo}>
                  <Text style={styles.rankName}>{item.institucion_nombre}</Text>
                  <Text style={styles.rankType}>{item.institucion_tipo}</Text>
                  {item.institucion_comuna && (
                    <Text style={styles.rankComuna}>Comuna {item.institucion_comuna}</Text>
                  )}
                </View>
              </View>

              <View style={styles.rankStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{item.total_visitas}</Text>
                  <Text style={styles.statLabel}>Visitas</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{item.total_platos}</Text>
                  <Text style={styles.statLabel}>Platos</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {item.promedio_platos_por_visita?.toFixed(1) || 0}
                  </Text>
                  <Text style={styles.statLabel}>Promedio</Text>
                </View>
              </View>

              {item.ultima_visita && (
                <Text style={styles.lastVisit}>
                  Última visita: {new Date(item.ultima_visita).toLocaleDateString('es-AR')}
                </Text>
              )}
            </Card>
          ))
        )}
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
    color: colors.gray[700],
    textAlign: 'center',
  },
  rankCard: {
    marginBottom: spacing.md,
  },
  goldCard: {
    backgroundColor: '#fffbeb',
    borderColor: '#fbbf24',
    borderWidth: 2,
  },
  silverCard: {
    backgroundColor: '#f8fafc',
    borderColor: '#94a3b8',
    borderWidth: 2,
  },
  bronzeCard: {
    backgroundColor: '#fff7ed',
    borderColor: '#fb923c',
    borderWidth: 2,
  },
  rankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  rankPosition: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  rankInfo: {
    flex: 1,
  },
  rankName: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  rankType: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    textTransform: 'capitalize',
  },
  rankComuna: {
    fontSize: fontSize.xs,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  rankStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.gray[600],
  },
  lastVisit: {
    fontSize: fontSize.xs,
    color: colors.gray[500],
    marginTop: spacing.md,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: colors.gray[400],
    marginTop: spacing.xl,
  },
});
