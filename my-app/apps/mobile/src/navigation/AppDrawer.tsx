import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { HomeScreen } from '../screens/HomeScreen'
import { UsersScreen } from '../screens/UsersScreen'

const Stack = createNativeStackNavigator()

export function AppDrawer() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTintColor: '#111827',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Panel' }}
      />
      <Stack.Screen 
        name="Users" 
        component={UsersScreen}
        options={{ title: 'Usuarios' }}
      />
    </Stack.Navigator>
  )
}