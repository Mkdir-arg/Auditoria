import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { colors, spacing, fontSize } from '../styles/theme';

const API_URL = 'http://192.168.1.204:8000/api';

export function LoginScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Complete todos los campos');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/login/`, {
        username,
        password,
      });

      await AsyncStorage.setItem('@auth_token', response.data.access);
      await AsyncStorage.setItem('@user_data', JSON.stringify(response.data.user));

      navigation.replace('Home');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.detail || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.title}>Auditoría Nutricional</Text>
          <Text style={styles.subtitle}>Iniciar Sesión</Text>

          <Input
            placeholder="Usuario"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            style={styles.input}
          />

          <Input
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />

          <Button
            title="Ingresar"
            onPress={handleLogin}
            loading={loading}
          />
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100],
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    marginHorizontal: spacing.md,
  },
  title: {
    fontSize: fontSize['2xl'],
    fontWeight: 'bold',
    color: colors.gray[900],
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.base,
    color: colors.gray[500],
    textAlign: 'center',
    marginBottom: spacing['2xl'],
  },
  input: {
    marginBottom: spacing.lg,
  },
});
