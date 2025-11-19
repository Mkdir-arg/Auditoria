import { useState } from 'react'
import { HomeIcon, UsersIcon, Bars3Icon, XMarkIcon, ChartBarIcon, DocumentTextIcon, CogIcon, BuildingOfficeIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const [activeItem, setActiveItem] = useState('Inicio')
  
  const menuItems = [
    { section: 'GENERAL', items: [
      { name: 'Inicio', icon: HomeIcon, href: '/home', color: 'text-blue-400' },
      { name: 'Dashboard', icon: ChartBarIcon, href: '/dashboard', color: 'text-green-400' }
    ]},
    { section: 'AUDITORÍA', items: [
      { name: 'Instituciones', icon: BuildingOfficeIcon, href: '/instituciones', color: 'text-cyan-400' },
      { name: 'Visitas', icon: ClipboardDocumentCheckIcon, href: '/visitas', color: 'text-emerald-400' }
    ]},
    { section: 'REPORTES', items: [
      { name: 'Ranking', icon: DocumentTextIcon, href: '/reportes/ranking', color: 'text-orange-400' },
      { name: 'Por Institución', icon: ChartBarIcon, href: '/reportes/instituciones', color: 'text-yellow-400' }
    ]},
    { section: 'ADMINISTRACIÓN', items: [
      { name: 'Usuarios', icon: UsersIcon, href: '/users', color: 'text-purple-400' },
      { name: 'Configuración', icon: CogIcon, href: '/settings', color: 'text-gray-400' }
    ]}
  ]

  return (
    <div className={`bg-gradient-to-b from-slate-800 to-slate-900 text-slate-100 h-full transition-all duration-300 shadow-xl ${isCollapsed ? 'w-20' : 'w-72'}`}>
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Auditoria
              </h2>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-slate-700 transition-all duration-200 hover:scale-105"
          >
            {isCollapsed ? 
              <Bars3Icon className="w-5 h-5 text-slate-300" /> : 
              <XMarkIcon className="w-5 h-5 text-slate-300" />
            }
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3">
        {menuItems.map((section) => (
          <div key={section.section} className="mb-8">
            {!isCollapsed && (
              <h3 className="px-3 mb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center">
                <span className="w-2 h-2 bg-slate-600 rounded-full mr-2"></span>
                {section.section}
              </h3>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={() => setActiveItem(item.name)}
                    className={`group flex items-center px-3 py-3 text-sm rounded-xl transition-all duration-200 hover:bg-slate-700/50 hover:translate-x-1 ${
                      activeItem === item.name 
                        ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-r-2 border-blue-400 text-blue-300' 
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${
                      activeItem === item.name ? 'text-blue-400' : item.color
                    }`} />
                    {!isCollapsed && (
                      <span className="ml-3 font-medium group-hover:text-white transition-colors">
                        {item.name}
                      </span>
                    )}
                    {activeItem === item.name && !isCollapsed && (
                      <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full"></div>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <div className="text-xs text-slate-400 text-center">
            <div className="mb-1">Sistema v1.0</div>
            <div className="text-slate-500">© 2024 Auditoria</div>
          </div>
        </div>
      )}
    </div>
  )
}