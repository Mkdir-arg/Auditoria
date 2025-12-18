// Hook deshabilitado - sync manual con AsyncStorage
export const useSync = () => {
  return {
    sync: async () => {},
    isSyncing: false,
  };
};
