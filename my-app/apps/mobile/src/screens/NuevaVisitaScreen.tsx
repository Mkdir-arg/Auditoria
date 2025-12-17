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
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { colors, spacing, fontSize, borderRadius } from '../styles/theme';

const TIPOS_COMIDA = ['Desayuno', 'Almuerzo', 'Merienda', 'Cena', 'Vianda'];

export function NuevaVisitaScreen({ route, navigation }: any) {
  const { institucionId } = route.params;
  const [tipoComida, setTipoComida] = useState('Almuerzo');
  const [observaciones, setObservaciones] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGuardar = async () => {
    if (!tipoComida) {
      Alert.alert('Error', 'Seleccione un tipo de comida');
      return;
    }

    setLoading(true);

    try {
      const visita = {
        id: Date.now(),
        institucion_id: institucionId,
        fecha: new Date().toISOString().split('T')[0],
        tipo_comida: tipoComida,
        observaciones,
        synced: false,
      };

      const visitasData = await AsyncStorage.getItem('@visitas');
      const visitas = visitasData ? JSON.parse(visitasData) : [];
      visitas.push(visita);
      await AsyncStorage.setItem('@visitas', JSON.stringify(visitas));

      // Agregar a cola de sincronización
      const syncQueue = await AsyncStorage.getItem('@sync_queue');
      const queue = syncQueue ? JSON.parse(syncQueue) : [];
      queue.push({
        type: 'CREATE',
        entity: 'visitas',
        data: visita,
      });
      await AsyncStorage.setItem('@sync_queue', JSON.stringify(queue));

      Alert.alert('Éxito', 'Visita creada correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear la visita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Cancelar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nueva Visita</Text>
      </View>

      <Card style={styles.card}>
        <Text style={styles.label}>Tipo de Comida *</Text>
        <View style={styles.chipContainer}>
          {TIPOS_COMIDA.map((tipo) => (
            <TouchableOpacity
              key={tipo}
              style={[
                styles.chip,
                tipoComida === tipo && styles.chipSelected,
              ]}
              onPress={() => setTipoComida(tipo)}
            >
              <Text
                style={[
                  styles.chipText,
                  tipoComida === tipo && styles.chipTextSelected,
                ]}
              >
                {tipo}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Observaciones</Text>
        <Input
          placeholder="Ingrese observaciones generales..."
          value={observaciones}
          onChangeText={setObservaciones}
          multiline
          numberOfLines={4}
          style={styles.textArea}
        />

        <Button
          title="Guardar Visita"
          onPress={handleGuardar}
          loading={loading}
        />
      </Card>
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
  card: {
    margin: spacing.lg,
  },
  label: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.gray[300],
    backgroundColor: colors.white,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.gray[700],
    fontSize: fontSize.sm,
  },
  chipTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: spacing.lg,
  },
});
