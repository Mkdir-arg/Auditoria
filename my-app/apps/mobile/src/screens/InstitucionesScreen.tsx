import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  RefreshControl,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors, spacing, fontSize, borderRadius } from '../styles/theme';

const API_URL = 'http://192.168.1.204:8000/api';

export function InstitucionesScreen({ navigation }: any) {
  const [instituciones, setInstituciones] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadInstituciones();
  }, []);

  const loadInstituciones = async () => {
    try {
      const cached = await AsyncStorage.getItem('@instituciones');
      if (cached) {
        setInstituciones(JSON.parse(cached));
      }

      const token = await AsyncStorage.getItem('@auth_token');
      const response = await axios.get(`${API_URL}/auditoria/instituciones/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await AsyncStorage.setItem('@instituciones', JSON.stringify(response.data));
      setInstituciones(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getTipoIcon = (tipo: string) => {
    const icons: any = {
      escuela: '🏫',
      cdi: '🏬',
      hogar: '🏠',
      geriatrico: '🏛️',
    };
    return icons[tipo] || '🏭';
  };

  const getTipoColor = (tipo: string) => {
    const colors: any = {
      escuela: '#eff6ff',
      cdi: '#faf5ff',
      hogar: '#f0fdf4',
      geriatrico: '#fff7ed',
    };
    return colors[tipo] || '#f9fafb';
  };

  const filteredData = instituciones.filter(inst =>
    inst.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inst.codigo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Visitas', { institucionId: item.id })}
    >
      <Card style={[styles.card, { backgroundColor: getTipoColor(item.tipo) }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.emoji}>{getTipoIcon(item.tipo)}</Text>
          <View style={styles.cardHeaderText}>
            <Text style={styles.tipoText}>{item.tipo.toUpperCase()}</Text>
            <Text style={styles.nombreText} numberOfLines={2}>{item.nombre}</Text>
          </View>
          <View style={[styles.badge, item.activo ? styles.badgeActive : styles.badgeInactive]}>
            <Text style={styles.badgeText}>{item.activo ? '✓' : '✕'}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          {item.codigo && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>🔢</Text>
              <Text style={styles.infoText}>{item.codigo}</Text>
            </View>
          )}
          {item.direccion && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📍</Text>
              <Text style={styles.infoText} numberOfLines={2}>{item.direccion}</Text>
            </View>
          )}
          <View style={styles.tags}>
            {item.barrio && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>🏘️ {item.barrio}</Text>
              </View>
            )}
            {item.comuna && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>🗺️ Comuna {item.comuna}</Text>
              </View>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>🏫 Instituciones</Text>
          <Text style={styles.headerSubtitle}>
            {filteredData.length} instituciones
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Volver</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre, código..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor={colors.gray[400]}
        />
      </View>

      {/* List */}
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadInstituciones();
            }}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📁</Text>
            <Text style={styles.emptyText}>No se encontraron instituciones</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[100],
  },
  header: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: fontSize['2xl'],
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
    color: '#e0e7ff',
  },
  backButton: {
    color: colors.white,
    fontSize: fontSize.base,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    margin: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.gray[200],
  },
  searchIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: fontSize.base,
    color: colors.gray[900],
  },
  list: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  card: {
    marginBottom: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  emoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  cardHeaderText: {
    flex: 1,
  },
  tipoText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  nombreText: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.gray[900],
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeActive: {
    backgroundColor: '#10b981',
  },
  badgeInactive: {
    backgroundColor: colors.gray[400],
  },
  badgeText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: 'bold',
  },
  cardBody: {
    gap: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  infoText: {
    fontSize: fontSize.sm,
    color: colors.gray[700],
    flex: 1,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  tag: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  tagText: {
    fontSize: fontSize.xs,
    color: '#1e40af',
    fontWeight: '600',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyText: {
    fontSize: fontSize.base,
    color: colors.gray[500],
  },
});
