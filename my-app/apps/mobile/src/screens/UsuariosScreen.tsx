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
import { Card } from '../components/Card';
import { colors, spacing, fontSize, borderRadius } from '../styles/theme';

export function UsuariosScreen({ navigation }: any) {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = async () => {
    try {
      setLoading(true);
      // Simulación - en producción usar API
      const mockUsuarios = [
        { id: 1, username: 'admin', email: 'admin@example.com', first_name: 'Admin', last_name: 'Sistema', is_active: true },
        { id: 2, username: 'auditor1', email: 'auditor1@example.com', first_name: 'Juan', last_name: 'Pérez', is_active: true },
        { id: 3, username: 'auditor2', email: 'auditor2@example.com', first_name: 'María', last_name: 'González', is_active: false },
      ];
      setUsuarios(mockUsuarios);
    } catch (error) {
      console.error('Error loading usuarios:', error);
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
        <Text style={styles.headerTitle}>Gestión de Usuarios</Text>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.infoCard}>
          <Text style={styles.infoText}>👥 {usuarios.length} usuarios registrados</Text>
        </Card>

        {usuarios.map((user) => (
          <Card key={user.id} style={styles.userCard}>
            <View style={styles.userHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user.first_name?.[0]}{user.last_name?.[0]}
                </Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.first_name} {user.last_name}</Text>
                <Text style={styles.userUsername}>@{user.username}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>
              <View style={[styles.badge, user.is_active ? styles.badgeActive : styles.badgeInactive]}>
                <Text style={styles.badgeText}>{user.is_active ? 'Activo' : 'Inactivo'}</Text>
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
  userCard: {
    marginBottom: spacing.md,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  userUsername: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: fontSize.xs,
    color: colors.gray[500],
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  badgeActive: {
    backgroundColor: '#dcfce7',
  },
  badgeInactive: {
    backgroundColor: '#fee2e2',
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
});
