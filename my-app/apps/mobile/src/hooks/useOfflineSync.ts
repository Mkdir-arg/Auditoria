import { useEffect, useState } from 'react';
import { syncService } from '../services/syncService';

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingOps, setPendingOps] = useState(0);

  useEffect(() => {
    syncService.init();

    const interval = setInterval(() => {
      setIsOnline(syncService.isConnected());
      setPendingOps(syncService.getQueueSize());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    isOnline,
    pendingOps,
    addToQueue: syncService.addToQueue.bind(syncService),
  };
}
