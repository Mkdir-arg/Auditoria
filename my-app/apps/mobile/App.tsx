import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import { syncService } from './src/services/syncService';
import { useOfflineSync } from './src/hooks/useOfflineSync';

const WEB_URL = 'http://192.168.1.205:3001';

function OfflineBanner({ isOnline, pendingOps }: any) {
  if (isOnline) return null;
  
  return (
    <View style={styles.offlineBanner}>
      <Text style={styles.offlineText}>
        ⚠️ Sin conexión - {pendingOps} operaciones pendientes
      </Text>
    </View>
  );
}

export default function App() {
  const { isOnline, pendingOps } = useOfflineSync();

  useEffect(() => {
    syncService.init();
  }, []);

  // Interceptar requests para guardar offline
  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'SYNC_OPERATION') {
        syncService.addToQueue({
          type: data.operation,
          entity: data.entity,
          data: data.payload,
        });
      }
    } catch (error) {
      console.error('Error procesando mensaje:', error);
    }
  };

  // JavaScript para inyectar en la web
  const injectedJS = `
    (function() {
      const originalFetch = window.fetch;
      window.fetch = function(...args) {
        const [url, options] = args;
        
        if (!navigator.onLine && options?.method !== 'GET') {
          const operation = {
            type: 'SYNC_OPERATION',
            operation: options.method === 'POST' ? 'CREATE' : 
                      options.method === 'PUT' ? 'UPDATE' : 'DELETE',
            entity: url.split('/').filter(Boolean).pop(),
            payload: options.body ? JSON.parse(options.body) : null,
          };
          
          window.ReactNativeWebView.postMessage(JSON.stringify(operation));
          
          return Promise.resolve(new Response(
            JSON.stringify({ offline: true, queued: true }),
            { status: 200 }
          ));
        }
        
        return originalFetch.apply(this, args);
      };
    })();
    true;
  `;

  return (
    <SafeAreaView style={styles.container}>
      <OfflineBanner isOnline={isOnline} pendingOps={pendingOps} />
      <WebView
        source={{ uri: WEB_URL }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        cacheEnabled={true}
        cacheMode="LOAD_CACHE_ELSE_NETWORK"
        startInLoadingState={true}
        injectedJavaScript={injectedJS}
        onMessage={handleMessage}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  offlineBanner: {
    backgroundColor: '#fef3c7',
    padding: 12,
  },
  offlineText: {
    color: '#92400e',
    textAlign: 'center',
    fontWeight: '600',
  },
});
