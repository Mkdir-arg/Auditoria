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
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold">
                {user?.first_name?.[0] || user?.username?.[0] || 'U'}
              </span>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {user?.first_name || user?.username || 'Usuario'}
              </div>
              <div className="text-xs text-gray-500">Administrador</div>
            </div>
          </div>
          
          <Button variant="ghost" onClick={logout} className="hover:bg-red-50 hover:text-red-600">
            Cerrar sesión
          </Button>
        </div>
      </div>
    </header>
  )
}