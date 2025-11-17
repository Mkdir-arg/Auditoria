import { useState } from 'react'
import { HomeIcon, UsersIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const menuItems = [
    { section: 'GENERAL', items: [
      { name: 'Inicio', icon: HomeIcon, href: '/home' }
    ]},
    { section: 'ADMINISTRACIÓN', items: [
      { name: 'Usuarios', icon: UsersIcon, href: '/users' }
    ]}
  ]

  return (
    <div className={`bg-slate-900 text-slate-100 h-full transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-4">
        <div className="flex items-center justify-between">
          {!isCollapsed && <h2 className="text-xl font-bold">Auditoria</h2>}
          <button
            onClick={onToggle}
            className="p-2 rounded-md hover:bg-slate-800 transition-colors"
          >
            {isCollapsed ? <Bars3Icon className="w-5 h-5" /> : <XMarkIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <nav className="mt-8">
        {menuItems.map((section) => (
          <div key={section.section} className="mb-6">
            {!isCollapsed && (
              <h3 className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {section.section}
              </h3>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="flex items-center px-4 py-2 text-sm hover:bg-slate-800 transition-colors"
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && <span className="ml-3">{item.name}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  )
}