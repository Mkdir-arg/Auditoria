import AsyncStorage from '@react-native-async-storage/async-storage';

export async function clearInstituciones() {
  await AsyncStorage.removeItem('@instituciones');
  console.log('✅ Instituciones limpiadas');
}

export async function clearAllData() {
  await AsyncStorage.multiRemove([
    '@instituciones',
    '@visitas',
    '@platos',
    '@ingredientes',
  ]);
  console.log('✅ Todos los datos offline limpiados');
}
