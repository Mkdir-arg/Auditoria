import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'

export function Topbar() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Panel</h1>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.first_name?.[0] || user?.username?.[0] || 'U'}
              </span>
            </div>
            <span className="text-sm text-gray-700">
              {user?.first_name || user?.username || 'Usuario'}
            </span>
          </div>
          
          <Button variant="ghost" onClick={logout}>
            Cerrar sesión
          </Button>
        </div>
      </div>
    </header>
  )
}