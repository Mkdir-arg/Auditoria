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
import { SyncButton } from '../components/SyncButton';
import { colors, spacing, fontSize, borderRadius } from '../styles/theme';

export function HomeScreen({ navigation }: any) {
  const [username, setUsername] = useState('Usuario');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userData = await AsyncStorage.getItem('@user_data');
    if (userData) {
      const user = JSON.parse(userData);
      setUsername(user.first_name || user.username || 'Usuario');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Login');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Panel Principal</Text>
        <View style={styles.headerActions}>
          <SyncButton />
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Salir</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {/* Welcome Section */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>¡Bienvenido, {username}! 👋</Text>
          <Text style={styles.welcomeSubtitle}>
            Panel de control principal del sistema de auditoría
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              Último acceso: {new Date().toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <Card style={[styles.statCard, styles.blueCard]}>
            <Text style={styles.statEmoji}>📊</Text>
            <Text style={styles.statTitle}>Métricas Generales</Text>
            <Text style={styles.statSubtitle}>Resumen de actividades</Text>
            <Text style={styles.statNumber}>125</Text>
          </Card>

          <Card style={[styles.statCard, styles.greenCard]}>
            <Text style={styles.statEmoji}>✅</Text>
            <Text style={styles.statTitle}>Auditorías Activas</Text>
            <Text style={styles.statSubtitle}>Procesos en curso</Text>
            <Text style={styles.statNumber}>8</Text>
          </Card>

          <Card style={[styles.statCard, styles.orangeCard]}>
            <Text style={styles.statEmoji}>📋</Text>
            <Text style={styles.statTitle}>Reportes Pendientes</Text>
            <Text style={styles.statSubtitle}>Documentos por revisar</Text>
            <Text style={styles.statNumber}>3</Text>
          </Card>
        </View>

        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Text style={styles.sectionTitle}>🚀 Acciones Rápidas</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={[styles.actionButton, styles.blueAction]}
              onPress={() => navigation.navigate('Visitas', { institucionId: 1 })}
            >
              <Text style={styles.actionEmoji}>📝</Text>
              <Text style={styles.actionTitle}>Nueva Visita</Text>
              <Text style={styles.actionSubtitle}>Registrar auditoría</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.greenAction]}
              onPress={() => navigation.navigate('Instituciones')}
            >
              <Text style={styles.actionEmoji}>🏢</Text>
              <Text style={styles.actionTitle}>Instituciones</Text>
              <Text style={styles.actionSubtitle}>Gestionar instituciones</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.purpleAction]}
              onPress={() => navigation.navigate('Usuarios')}
            >
              <Text style={styles.actionEmoji}>👥</Text>
              <Text style={styles.actionTitle}>Usuarios</Text>
              <Text style={styles.actionSubtitle}>Administrar accesos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.grayAction]}
              onPress={() => navigation.navigate('Reportes')}
            >
              <Text style={styles.actionEmoji}>📊</Text>
              <Text style={styles.actionTitle}>Reportes</Text>
              <Text style={styles.actionSubtitle}>Ver estadísticas</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Administration */}
        <Card style={styles.actionsCard}>
          <Text style={styles.sectionTitle}>⚙️ Administración</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={[styles.actionButton, styles.amberAction]}
              onPress={() => navigation.navigate('Categorias')}
            >
              <Text style={styles.actionEmoji}>🏷️</Text>
              <Text style={styles.actionTitle}>Categorías</Text>
              <Text style={styles.actionSubtitle}>Gestionar categorías</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.tealAction]}
              onPress={() => navigation.navigate('Alimentos')}
            >
              <Text style={styles.actionEmoji}>🍎</Text>
              <Text style={styles.actionTitle}>Alimentos</Text>
              <Text style={styles.actionSubtitle}>Catálogo Argenfood</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.slateAction]}
              onPress={() => navigation.navigate('Configuracion')}
            >
              <Text style={styles.actionEmoji}>🔧</Text>
              <Text style={styles.actionTitle}>Configuración</Text>
              <Text style={styles.actionSubtitle}>Ajustes del sistema</Text>
            </TouchableOpacity>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100],
  },
  header: {
    backgroundColor: colors.white,
    paddingTop: spacing['3xl'],
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  logoutButton: {
    marginLeft: spacing.sm,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  logoutText: {
    color: colors.danger,
    fontWeight: '600',
  },
  content: {
    padding: spacing.lg,
  },
  welcomeCard: {
    backgroundColor: '#eff6ff',
    borderRadius: borderRadius.xl,
    padding: spacing['2xl'],
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginBottom: spacing.lg,
  },
  welcomeTitle: {
    fontSize: fontSize['2xl'],
    fontWeight: 'bold',
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },
  welcomeSubtitle: {
    fontSize: fontSize.base,
    color: colors.gray[700],
    marginBottom: spacing.lg,
  },
  badge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: fontSize.sm,
    color: '#1d4ed8',
  },
  statsGrid: {
    marginBottom: spacing.lg,
  },
  statCard: {
    marginBottom: spacing.md,
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
  orangeCard: {
    backgroundColor: '#fff7ed',
    borderColor: '#fed7aa',
    borderWidth: 1,
  },
  statEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  statTitle: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  statSubtitle: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    marginBottom: spacing.md,
  },
  statNumber: {
    fontSize: fontSize['3xl'],
    fontWeight: 'bold',
    color: colors.primary,
  },
  actionsCard: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.lg,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  blueAction: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
  },
  greenAction: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  purpleAction: {
    backgroundColor: '#faf5ff',
    borderColor: '#e9d5ff',
  },
  grayAction: {
    backgroundColor: '#f9fafb',
    borderColor: '#e5e7eb',
  },
  amberAction: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  tealAction: {
    backgroundColor: '#f0fdfa',
    borderColor: '#99f6e4',
  },
  slateAction: {
    backgroundColor: '#f8fafc',
    borderColor: '#e2e8f0',
  },
  actionEmoji: {
    fontSize: 24,
    marginBottom: spacing.sm,
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
});
