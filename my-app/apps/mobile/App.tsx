import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from './src/screens/LoginScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { VisitasScreen } from './src/screens/VisitasScreen';
import { NuevaVisitaScreen } from './src/screens/NuevaVisitaScreen';
import { DetalleVisitaScreen } from './src/screens/DetalleVisitaScreen';
import { syncService } from './src/services/syncService';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    syncService.init();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Visitas" component={VisitasScreen} />
        <Stack.Screen name="NuevaVisita" component={NuevaVisitaScreen} />
        <Stack.Screen name="DetalleVisita" component={DetalleVisitaScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
