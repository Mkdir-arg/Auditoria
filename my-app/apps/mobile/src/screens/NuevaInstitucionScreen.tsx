import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { colors, spacing, fontSize, borderRadius } from '../styles/theme';

export function NuevaInstitucionScreen({ navigation }: any) {
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('escuela');
  const [direccion, setDireccion] = useState('');
  const [barrio, setBarrio] = useState('');
  const [comuna, setComuna] = useState('');

  const tipos = [
    { value: 'escuela', label: 'Escuela', icon: '🏫' },
    { value: 'cdi', label: 'CDI', icon: '🏬' },
    { value: 'hogar', label: 'Hogar', icon: '🏠' },
    { value: 'geriatrico', label: 'Geriátrico', icon: '🏛️' },
  ];

  const handleGuardar = async () => {
    if (!codigo || !nombre) {
      Alert.alert('Error', 'Complete los campos obligatorios');
      return;
    }

    const institucion = {
      id: Date.now(),
      codigo,
      nombre,
      tipo,
      direccion,
      barrio,
      comuna,
      activo: true,
      synced: false,
    };

    const instituciones = await AsyncStorage.getItem('@instituciones');
    const allInstituciones = instituciones ? JSON.parse(instituciones) : [];
    allInstituciones.push(institucion);
    await AsyncStorage.setItem('@instituciones', JSON.stringify(allInstituciones));

    Alert.alert('Éxito', 'Institución creada', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nueva Institución</Text>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.label}>Código *</Text>
          <Input
            placeholder="Ej: ESC001"
            value={codigo}
            onChangeText={setCodigo}
          />

          <Text style={styles.label}>Nombre *</Text>
          <Input
            placeholder="Nombre de la institución"
            value={nombre}
            onChangeText={setNombre}
          />

          <Text style={styles.label}>Tipo *</Text>
          <View style={styles.tiposGrid}>
            {tipos.map((t) => (
              <TouchableOpacity
                key={t.value}
                style={[
                  styles.tipoChip,
                  tipo === t.value && styles.tipoChipActive,
                ]}
                onPress={() => setTipo(t.value)}
              >
                <Text style={styles.tipoIcon}>{t.icon}</Text>
                <Text
                  style={[
                    styles.tipoText,
                    tipo === t.value && styles.tipoTextActive,
                  ]}
                >
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Dirección</Text>
          <Input
            placeholder="Dirección completa"
            value={direccion}
            onChangeText={setDireccion}
          />

          <Text style={styles.label}>Barrio</Text>
          <Input
            placeholder="Nombre del barrio"
            value={barrio}
            onChangeText={setBarrio}
          />

          <Text style={styles.label}>Comuna</Text>
          <Input
            placeholder="Número de comuna"
            value={comuna}
            onChangeText={setComuna}
            keyboardType="numeric"
          />
        </Card>

        <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
          <Text style={styles.saveButtonText}>💾 Guardar Institución</Text>
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
  card: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.gray[700],
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  tiposGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tipoChip: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.gray[200],
  },
  tipoChipActive: {
    backgroundColor: colors.blue[50],
    borderColor: colors.primary,
  },
  tipoIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  tipoText: {
    fontSize: fontSize.sm,
    color: colors.gray[700],
    fontWeight: '500',
  },
  tipoTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: fontSize.base,
    fontWeight: '600',
  },
});
