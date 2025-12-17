import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import { Card } from '../components/Card';
import { colors, spacing, fontSize } from '../styles/theme';

const API_URL = 'http://192.168.1.2:8000/api';

export function HomeScreen({ navigation }: any) {
  const [instituciones, setInstituciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    loadInstituciones();
    
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  const loadInstituciones = async () => {
    try {
      // Cargar desde storage local
      const cached = await AsyncStorage.getItem('@instituciones');
      if (cached) {
        setInstituciones(JSON.parse(cached));
      }

      // Si hay internet, sincronizar
      const netInfo = await NetInfo.fetch();
      if (netInfo.isConnected) {
        await syncFromServer();
      }
    } catch (error) {
      console.error('Error cargando instituciones:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const syncFromServer = async () => {
    try {
      const token = await AsyncStorage.getItem('@auth_token');
      const response = await axios.get(`${API_URL}/auditoria/instituciones/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await AsyncStorage.setItem('@instituciones', JSON.stringify(response.data));
      setInstituciones(response.data);
    } catch (error) {
      console.error('Error sincronizando:', error);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Login');
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Visitas', { institucionId: item.id })}
    >
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>{item.nombre}</Text>
        <Text style={styles.cardSubtitle}>{item.tipo}</Text>
        <Text style={styles.cardText}>{item.direccion}</Text>
        {item.comuna && <Text style={styles.cardText}>Comuna: {item.comuna}</Text>}
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Instituciones</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      </View>

      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>⚠️ Modo offline</Text>
        </View>
      )}

      <FlatList
        data={instituciones}
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
          <Text style={styles.emptyText}>No hay instituciones registradas</Text>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: colors.white,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
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
  offlineBanner: {
    backgroundColor: '#fef3c7',
    padding: spacing.md,
  },
  offlineText: {
    color: '#92400e',
    textAlign: 'center',
    fontWeight: '600',
  },
  list: {
    padding: spacing.lg,
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
    marginBottom: spacing.xs,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.gray[400],
    marginTop: spacing['3xl'],
    fontSize: fontSize.base,
  },
});
