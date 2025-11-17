import { create } from 'zustand'
import * as SecureStore from 'expo-secure-store'

interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  login: (tokens: { access: string; refresh: string }, user: User) => Promise<void>
  logout: () => Promise<void>
  loadTokens: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  
  login: async (tokens, user) => {
    await SecureStore.setItemAsync('access_token', tokens.access)
    await SecureStore.setItemAsync('refresh_token', tokens.refresh)
    set({
      user,
      accessToken: tokens.access,
      refreshToken: tokens.refresh,
      isAuthenticated: true,
    })
  },
  
  logout: async () => {
    await SecureStore.deleteItemAsync('access_token')
    await SecureStore.deleteItemAsync('refresh_token')
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    })
  },
  
  loadTokens: async () => {
    const accessToken = await SecureStore.getItemAsync('access_token')
    const refreshToken = await SecureStore.getItemAsync('refresh_token')
    
    if (accessToken && refreshToken) {
      set({
        accessToken,
        refreshToken,
        isAuthenticated: true,
      })
    }
  },
}))