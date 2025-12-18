import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors, spacing, fontSize } from '../styles/theme';

export function VisitasScreen({ route, navigation }: any) {
  const { institucionId } = route.params;
  const [visitas, setVisitas] = useState<any[]>([]);
  const [institucion, setInstitucion] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const instituciones = await AsyncStorage.getItem('@instituciones');
    if (instituciones) {
      const instArray = JSON.parse(instituciones);
      const inst = Array.isArray(instArray) ? instArray.find((i: any) => i.id === institucionId) : null;
      setInstitucion(inst);
    }

    const visitasData = await AsyncStorage.getItem('@visitas');
    if (visitasData) {
      const allVisitas = JSON.parse(visitasData);
      const filtered = Array.isArray(allVisitas) ? allVisitas.filter((v: any) => v.institucion_id === institucionId) : [];
      setVisitas(filtered);
    }
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-AR');
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('DetalleVisita', { visitaId: item.id })}
    >
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>{formatFecha(item.fecha)}</Text>
        <Text style={styles.cardSubtitle}>Tipo: {item.tipo_comida}</Text>
        {item.observaciones && (
          <Text style={styles.cardText} numberOfLines={2}>
            {item.observaciones}
          </Text>
        )}
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{institucion?.nombre}</Text>
      </View>

      <View style={styles.content}>
        <Button
          title="+ Nueva Visita"
          onPress={() => navigation.navigate('NuevaVisita', { institucionId })}
        />

        <FlatList
          data={visitas}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay visitas registradas</Text>
          }
        />
      </View>
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
  list: {
    marginTop: spacing.lg,
  },
  card: {
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  cardSubtitle: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
    marginBottom: spacing.sm,
  },
  cardText: {
    fontSize: fontSize.sm,
    color: colors.gray[700],
  },
  emptyText: {
    textAlign: 'center',
    color: colors.gray[400],
    marginTop: spacing['3xl'],
    fontSize: fontSize.base,
  },
});
