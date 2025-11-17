import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'

export function LoginPage() {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [rememberMe, setRememberMe] = useState(false)
  const { login, isLoading, error, isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/home" replace />
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(credentials)
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="flex items-center justify-center w-full">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Auditoria</h1>
            <p className="text-xl opacity-90">Sistema de gestión integral</p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Iniciar sesión</h2>
            <p className="text-gray-600 mt-2">Accede a tu cuenta</p>
          </div>

          <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usuario
                </label>
                <Input
                  type="text"
                  placeholder="Ingresa tu usuario"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <Input
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Recordar contraseña
                </label>
              </div>

              {error && (
                <div className="text-red-600 text-sm">
                  Error al iniciar sesión. Verifica tus credenciales.
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}