import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { HomeScreen } from '../screens/HomeScreen'
import { InstitucionesScreen } from '../screens/InstitucionesScreen'
import { VisitasScreen } from '../screens/VisitasScreen'
import { VisitaDetalleScreen } from '../screens/VisitaDetalleScreen'
import { DashboardScreen } from '../screens/DashboardScreen'

const Drawer = createDrawerNavigator()

export const MainDrawer = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Drawer.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
      <Drawer.Screen name="Instituciones" component={InstitucionesScreen} />
      <Drawer.Screen name="Visitas" component={VisitasScreen} />
      <Drawer.Screen 
        name="VisitaDetalle" 
        component={VisitaDetalleScreen} 
        options={{ title: 'Detalle de Visita', drawerItemStyle: { display: 'none' } }}
      />
    </Drawer.Navigator>
  )
}
