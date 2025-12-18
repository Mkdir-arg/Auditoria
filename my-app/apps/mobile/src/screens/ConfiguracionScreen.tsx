import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from '../components/Card';
import { colors, spacing, fontSize, borderRadius } from '../styles/theme';

export function ConfiguracionScreen({ navigation }: any) {
  const [notificaciones, setNotificaciones] = useState(true);
  const [sincronizacionAuto, setSincronizacionAuto] = useState(true);
  const [modoOffline, setModoOffline] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const config = await AsyncStorage.getItem('@config');
      if (config) {
        const parsed = JSON.parse(config);
        setNotificaciones(parsed.notificaciones ?? true);
        setSincronizacionAuto(parsed.sincronizacionAuto ?? true);
        setModoOffline(parsed.modoOffline ?? false);
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
  };

  const saveConfig = async (key: string, value: boolean) => {
    try {
      const config = await AsyncStorage.getItem('@config');
      const parsed = config ? JSON.parse(config) : {};
      parsed[key] = value;
      await AsyncStorage.setItem('@config', JSON.stringify(parsed));
    } catch (error) {
      console.error('Error saving config:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Limpiar Caché',
      'Esto eliminará datos temporales. ¿Continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpiar',
          onPress: () => Alert.alert('Éxito', 'Caché limpiado correctamente'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configuración</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Perfil */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Perfil</Text>
          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate('Perfil')}
          >
            <Text style={styles.optionText}>Mi Perfil</Text>
            <Text style={styles.optionArrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>Cambiar Contraseña</Text>
            <Text style={styles.optionArrow}>→</Text>
          </TouchableOpacity>
        </Card>

        {/* Preferencias */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Preferencias</Text>
          <View style={styles.option}>
            <Text style={styles.optionText}>Notificaciones</Text>
            <Switch
              value={notificaciones}
              onValueChange={(val) => {
                setNotificaciones(val);
                saveConfig('notificaciones', val);
              }}
            />
          </View>
          <View style={styles.option}>
            <Text style={styles.optionText}>Sincronización Automática</Text>
            <Switch
              value={sincronizacionAuto}
              onValueChange={(val) => {
                setSincronizacionAuto(val);
                saveConfig('sincronizacionAuto', val);
              }}
            />
          </View>
          <View style={styles.option}>
            <Text style={styles.optionText}>Modo Offline</Text>
            <Switch
              value={modoOffline}
              onValueChange={(val) => {
                setModoOffline(val);
                saveConfig('modoOffline', val);
              }}
            />
          </View>
        </Card>

        {/* Datos */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>💾 Datos</Text>
          <TouchableOpacity style={styles.option} onPress={handleClearCache}>
            <Text style={styles.optionText}>Limpiar Caché</Text>
            <Text style={styles.optionArrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>Sincronizar Ahora</Text>
            <Text style={styles.optionArrow}>→</Text>
          </TouchableOpacity>
        </Card>

        {/* Información */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ Información</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Versión</Text>
            <Text style={styles.infoValue}>2.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Build</Text>
            <Text style={styles.infoValue}>100</Text>
          </View>
        </Card>

        {/* Sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Cerrar Sesión</Text>
        </TouchableOpacity>
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
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  optionText: {
    fontSize: fontSize.base,
    color: colors.gray[700],
  },
  optionArrow: {
    fontSize: fontSize.xl,
    color: colors.gray[400],
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
  },
  infoValue: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.gray[900],
  },
  logoutButton: {
    backgroundColor: colors.danger,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoutText: {
    color: colors.white,
    fontSize: fontSize.base,
    fontWeight: '600',
  },
});
