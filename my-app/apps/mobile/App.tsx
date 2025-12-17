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
      // Interceptar fetch para offline
      const originalFetch = window.fetch;
      window.fetch = function(...args) {
        const [url, options] = args;
        
        // Si no hay internet y es una operación de escritura
        if (!navigator.onLine && options?.method && options.method !== 'GET') {
          // Guardar en localStorage
          const syncQueue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
          const operation = {
            id: Date.now(),
            method: options.method,
            url: url,
            body: options.body,
            timestamp: Date.now()
          };
          syncQueue.push(operation);
          localStorage.setItem('syncQueue', JSON.stringify(syncQueue));
          
          // Notificar a React Native
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'SYNC_OPERATION',
            operation: options.method,
            entity: url.split('/').filter(Boolean).pop(),
            payload: options.body ? JSON.parse(options.body) : null,
          }));
          
          return Promise.resolve(new Response(
            JSON.stringify({ offline: true, queued: true, id: operation.id }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          ));
        }
        
        // Si hay internet, ejecutar fetch normal
        return originalFetch.apply(this, args).then(response => {
          // Si la respuesta es exitosa y hay cola pendiente, sincronizar
          if (response.ok && navigator.onLine) {
            const syncQueue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
            if (syncQueue.length > 0) {
              // Procesar cola en background
              setTimeout(() => {
                syncQueue.forEach(op => {
                  originalFetch(op.url, {
                    method: op.method,
                    headers: { 'Content-Type': 'application/json' },
                    body: op.body
                  }).then(() => {
                    // Remover de la cola
                    const queue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
                    const newQueue = queue.filter(q => q.id !== op.id);
                    localStorage.setItem('syncQueue', JSON.stringify(newQueue));
                  });
                });
              }, 1000);
            }
          }
          return response;
        });
      };
      
      // Guardar datos en localStorage cuando se cargan
      const originalJSON = Response.prototype.json;
      Response.prototype.json = function() {
        return originalJSON.call(this).then(data => {
          // Guardar instituciones, visitas, etc. en localStorage
          if (this.url.includes('/instituciones')) {
            localStorage.setItem('instituciones', JSON.stringify(data));
          } else if (this.url.includes('/visitas')) {
            localStorage.setItem('visitas', JSON.stringify(data));
          }
          return data;
        });
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
