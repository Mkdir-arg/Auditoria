import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  INSTITUCIONES: '@instituciones',
  VISITAS: '@visitas',
  PLATOS: '@platos',
};

export const storageService = {
  // Instituciones
  async getInstituciones() {
    const data = await AsyncStorage.getItem(KEYS.INSTITUCIONES);
    return data ? JSON.parse(data) : [];
  },

  async saveInstitucion(institucion: any) {
    const instituciones = await this.getInstituciones();
    instituciones.push({ ...institucion, id: Date.now().toString(), synced: false });
    await AsyncStorage.setItem(KEYS.INSTITUCIONES, JSON.stringify(instituciones));
    return instituciones[instituciones.length - 1];
  },

  async updateInstituciones(instituciones: any[]) {
    await AsyncStorage.setItem(KEYS.INSTITUCIONES, JSON.stringify(instituciones));
  },

  // Visitas
  async getVisitas(institucionId?: string) {
    const data = await AsyncStorage.getItem(KEYS.VISITAS);
    const visitas = data ? JSON.parse(data) : [];
    return institucionId
      ? visitas.filter((v: any) => v.institucionId === institucionId)
      : visitas;
  },

  async saveVisita(visita: any) {
    const visitas = await this.getVisitas();
    const newVisita = { ...visita, id: Date.now().toString(), synced: false };
    visitas.push(newVisita);
    await AsyncStorage.setItem(KEYS.VISITAS, JSON.stringify(visitas));
    return newVisita;
  },

  // Platos
  async getPlatos(visitaId?: string) {
    const data = await AsyncStorage.getItem(KEYS.PLATOS);
    const platos = data ? JSON.parse(data) : [];
    return visitaId
      ? platos.filter((p: any) => p.visitaId === visitaId)
      : platos;
  },

  async savePlato(plato: any) {
    const platos = await this.getPlatos();
    const newPlato = { ...plato, id: Date.now().toString(), synced: false };
    platos.push(newPlato);
    await AsyncStorage.setItem(KEYS.PLATOS, JSON.stringify(platos));
    return newPlato;
  },

  async clear() {
    await AsyncStorage.multiRemove([KEYS.INSTITUCIONES, KEYS.VISITAS, KEYS.PLATOS]);
  },
};
