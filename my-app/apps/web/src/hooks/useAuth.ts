import { useAuthStore } from '../store/authStore'
import { authService } from '../services/authService'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useAuth = () => {
  const { user, isAuthenticated, login, logout } = useAuthStore()

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async (tokens) => {
      try {
        const userData = await authService.getMe()
        login(tokens, userData)
      } catch (error) {
        console.error('Failed to get user data:', error)
      }
    },
  })

  const { data: userData } = useQuery({
    queryKey: ['me'],
    queryFn: authService.getMe,
    enabled: isAuthenticated && !user,
  })

  return {
    user: user || userData,
    isAuthenticated,
    login: loginMutation.mutate,
    logout,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
  }
}