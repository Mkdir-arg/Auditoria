import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { syncService } from '../services/syncService';
import { colors, spacing } from '../styles/theme';

export function SyncButton() {
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    checkPendingData();
    
    // Verificar cada 5 segundos si hay datos pendientes
    const interval = setInterval(checkPendingData, 5000);
    
    // Listener de conexión
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = state.isConnected || false;
      setIsOnline(connected);
      
      // Auto-sync cuando se conecta
      if (connected && !syncing) {
        setTimeout(() => syncData(true), 1000);
      }
    });
    
    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  const checkPendingData = async () => {
    try {
      const count = await syncService.getPendingCount();
      setPendingCount(count);
    } catch (error) {
      console.error('Error checking pending data:', error);
    }
  };

  const syncData = async (silent = false) => {
    if (syncing || !isOnline) return;

    try {
      setSyncing(true);
      const result = await syncService.syncAll();
      
      await checkPendingData();
      
      // Solo mostrar mensaje si es manual (no silencioso)
      if (!silent && result.synced > 0) {
        console.log(`✅ Sincronizados: ${result.synced} elementos`);
      }
      
      if (!silent && result.failed > 0) {
        console.error(`❌ Fallaron: ${result.failed} elementos`);
      }
    } catch (error) {
      console.error('Error syncing data:', error);
    } finally {
      setSyncing(false);
    }
  };

  if (pendingCount === 0 && !syncing) return null;

  return (
    <TouchableOpacity
      style={[styles.button, syncing && styles.buttonSyncing]}
      onPress={() => syncData(false)}
      disabled={syncing || !isOnline}
    >
      {syncing ? (
        <ActivityIndicator size="small" color={colors.white} />
      ) : (
        <>
          <Text style={styles.icon}>☁️</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{pendingCount}</Text>
          </View>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.warning,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonSyncing: {
    backgroundColor: colors.primary,
  },
  icon: {
    fontSize: 24,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.danger,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});
