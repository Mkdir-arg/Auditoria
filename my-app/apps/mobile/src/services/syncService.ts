import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SYNC_QUEUE_KEY = '@sync_queue';
const LAST_SYNC_KEY = '@last_sync';

interface SyncOperation {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  entity: string;
  data: any;
  timestamp: number;
}

class SyncService {
  private isOnline: boolean = true;
  private syncQueue: SyncOperation[] = [];

  async init() {
    // Cargar cola pendiente
    await this.loadQueue();
    
    // Escuchar cambios de conexión
    NetInfo.addEventListener(state => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected ?? false;
      
      // Si volvió internet, sincronizar
      if (wasOffline && this.isOnline) {
        this.syncPendingOperations();
      }
    });
  }

  async addToQueue(operation: Omit<SyncOperation, 'id' | 'timestamp'>) {
    const syncOp: SyncOperation = {
      ...operation,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    this.syncQueue.push(syncOp);
    await this.saveQueue();

    // Si hay internet, sincronizar inmediatamente
    if (this.isOnline) {
      await this.syncPendingOperations();
    }
  }

  private async syncPendingOperations() {
    if (this.syncQueue.length === 0) return;

    console.log(`Sincronizando ${this.syncQueue.length} operaciones...`);

    const operations = [...this.syncQueue];
    
    for (const op of operations) {
      try {
        await this.syncOperation(op);
        // Remover de la cola si fue exitoso
        this.syncQueue = this.syncQueue.filter(o => o.id !== op.id);
      } catch (error) {
        console.error('Error sincronizando:', error);
        // Mantener en la cola para reintentar
      }
    }

    await this.saveQueue();
    await AsyncStorage.setItem(LAST_SYNC_KEY, Date.now().toString());
  }

  private async syncOperation(op: SyncOperation) {
    const baseUrl = 'http://192.168.1.2:8000/api';
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    
    let url = `${baseUrl}/auditoria/${op.entity}/`;
    let method = 'POST';

    if (op.type === 'UPDATE') {
      url += `${op.data.id}/`;
      method = 'PUT';
    } else if (op.type === 'DELETE') {
      url += `${op.data.id}/`;
      method = 'DELETE';
    }

    const token = await AsyncStorage.getItem('@auth_token');

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: op.type !== 'DELETE' ? JSON.stringify(op.data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.status}`);
    }

    return response.json();
  }

  private async loadQueue() {
    try {
      const data = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
      this.syncQueue = data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error cargando cola:', error);
      this.syncQueue = [];
    }
  }

  private async saveQueue() {
    try {
      await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('Error guardando cola:', error);
    }
  }

  getQueueSize() {
    return this.syncQueue.length;
  }

  isConnected() {
    return this.isOnline;
  }
}

export const syncService = new SyncService();
