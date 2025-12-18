import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { colors, spacing, fontSize, borderRadius } from '../styles/theme';

const API_URL = 'http://192.168.1.204:8000/api';

export function LoginScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Complete todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/token/`, {
        username,
        password,
      });

      await AsyncStorage.setItem('@auth_token', response.data.access);
      await AsyncStorage.setItem('@refresh_token', response.data.refresh);

      navigation.replace('Home');
    } catch (err: any) {
      setError('Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#3b82f6', '#9333ea']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo/Icon */}
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#6366f1', '#a855f7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconCircle}
            >
              <Text style={styles.iconEmoji}>🍎</Text>
            </LinearGradient>
          <Text style={styles.welcomeTitle}>Bienvenido</Text>
          <Text style={styles.welcomeSubtitle}>Ingresa tus credenciales para continuar</Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Username */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Usuario</Text>
            <Input
              placeholder="Ingresa tu usuario"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <Input
              placeholder="Ingresa tu contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Error Message */}
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Login Button */}
          <LinearGradient
            colors={['#3b82f6', '#9333ea']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.loginButtonGradient}
          >
            <Button
              title={loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              onPress={handleLogin}
              loading={loading}
              style={styles.buttonTransparent}
            />
          </LinearGradient>
        </View>

          {/* Footer */}
          <Text style={styles.footer}>Sistema de Auditoría Nutricional</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconEmoji: {
    fontSize: 40,
  },
  welcomeTitle: {
    fontSize: fontSize['3xl'],
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: spacing.sm,
  },
  welcomeSubtitle: {
    fontSize: fontSize.base,
    color: '#e9d5ff', // Violeta claro
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing['2xl'],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: spacing.sm,
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  errorText: {
    fontSize: fontSize.sm,
    color: '#b91c1c',
  },
  loginButtonGradient: {
    borderRadius: borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  buttonTransparent: {
    backgroundColor: 'transparent',
  },
  footer: {
    textAlign: 'center',
    fontSize: fontSize.sm,
    color: colors.gray[600],
    marginTop: spacing['2xl'],
  },
});
