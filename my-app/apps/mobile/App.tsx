import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from './src/screens/LoginScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { InstitucionesScreen } from './src/screens/InstitucionesScreen';
import { VisitasScreen } from './src/screens/VisitasScreen';
import { NuevaVisitaScreen } from './src/screens/NuevaVisitaScreen';
import { DetalleVisitaScreen } from './src/screens/DetalleVisitaScreen';
import { IngredientesScreen } from './src/screens/IngredientesScreen';
import { BuscadorAlimentosScreen } from './src/screens/BuscadorAlimentosScreen';
import { AlimentosScreen } from './src/screens/AlimentosScreen';
import { ReportesScreen } from './src/screens/ReportesScreen';
import { RankingScreen } from './src/screens/RankingScreen';
import { FiltrosScreen } from './src/screens/FiltrosScreen';
import { UsuariosScreen } from './src/screens/UsuariosScreen';
import { CategoriasScreen } from './src/screens/CategoriasScreen';
import { ConfiguracionScreen } from './src/screens/ConfiguracionScreen';
import { PerfilScreen } from './src/screens/PerfilScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Instituciones" component={InstitucionesScreen} />
        <Stack.Screen name="Visitas" component={VisitasScreen} />
        <Stack.Screen name="NuevaVisita" component={NuevaVisitaScreen} />
        <Stack.Screen name="DetalleVisita" component={DetalleVisitaScreen} />
        <Stack.Screen name="Ingredientes" component={IngredientesScreen} />
        <Stack.Screen name="BuscadorAlimentos" component={BuscadorAlimentosScreen} />
        <Stack.Screen name="Alimentos" component={AlimentosScreen} />
        <Stack.Screen name="Reportes" component={ReportesScreen} />
        <Stack.Screen name="Ranking" component={RankingScreen} />
        <Stack.Screen name="Filtros" component={FiltrosScreen} />
        <Stack.Screen name="Usuarios" component={UsuariosScreen} />
        <Stack.Screen name="Categorias" component={CategoriasScreen} />
        <Stack.Screen name="Configuracion" component={ConfiguracionScreen} />
        <Stack.Screen name="Perfil" component={PerfilScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
