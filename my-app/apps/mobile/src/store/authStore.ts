import AsyncStorage from '@react-native-async-storage/async-storage'

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
}

class AuthStore {
  private state: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
  }

  async login(tokens: { access: string; refresh: string }, user: User) {
    await AsyncStorage.setItem('access_token', tokens.access)
    await AsyncStorage.setItem('refresh_token', tokens.refresh)
    await AsyncStorage.setItem('@user_data', JSON.stringify(user))
    this.state = {
      user,
      accessToken: tokens.access,
      refreshToken: tokens.refresh,
      isAuthenticated: true,
    }
  }

  async logout() {
    await AsyncStorage.removeItem('access_token')
    await AsyncStorage.removeItem('refresh_token')
    await AsyncStorage.removeItem('@user_data')
    this.state = {
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    }
  }

  async loadTokens() {
    const accessToken = await AsyncStorage.getItem('access_token')
    const refreshToken = await AsyncStorage.getItem('refresh_token')
    const userData = await AsyncStorage.getItem('@user_data')
    
    if (accessToken && refreshToken) {
      this.state = {
        user: userData ? JSON.parse(userData) : null,
        accessToken,
        refreshToken,
        isAuthenticated: true,
      }
    }
  }

  getState() {
    return this.state
  }
}

export const authStore = new AuthStore()