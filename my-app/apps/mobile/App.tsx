import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RootNavigator } from './src/navigation'
import './src/utils/storage'
import 'react-native-gesture-handler'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootNavigator />
    </QueryClientProvider>
  )
}