import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { database } from '../database';
import { Visita } from '../database/models/Visita';
import { useOfflineSync } from '../hooks/useOfflineSync';

const TIPOS_COMIDA = ['Desayuno', 'Almuerzo', 'Merienda', 'Cena', 'Vianda'];

export function NuevaVisitaScreen({ route, navigation }: any) {
  const { institucionId } = route.params;
  const [tipoComida, setTipoComida] = useState('Almuerzo');
  const [observaciones, setObservaciones] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToQueue } = useOfflineSync();

  const handleGuardar = async () => {
    if (!tipoComida) {
      Alert.alert('Error', 'Seleccione un tipo de comida');
      return;
    }

    setLoading(true);

    try {
      await database.write(async () => {
        const visita = await database.get<Visita>('visitas').create((v: any) => {
          v.institucionId = institucionId;
          v.fecha = Date.now();
          v.tipoComida = tipoComida;
          v.observaciones = observaciones;
          v.synced = false;
        });

        // Agregar a cola de sincronización
        await addToQueue({
          type: 'CREATE',
          entity: 'visitas',
          data: {
            institucion: institucionId,
            fecha: new Date(visita.fecha).toISOString().split('T')[0],
            tipo_comida: visita.tipoComida,
            observaciones: visita.observaciones,
          },
        });
      });

      Alert.alert('Éxito', 'Visita creada correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error creando visita:', error);
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

      <View style={styles.form}>
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
        <TextInput
          style={styles.textArea}
          placeholder="Ingrese observaciones generales..."
          value={observaciones}
          onChangeText={setObservaciones}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleGuardar}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Guardando...' : 'Guardar Visita'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    color: '#3b82f6',
    fontSize: 16,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
  },
  chipSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  chipText: {
    color: '#374151',
    fontSize: 14,
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 100,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
