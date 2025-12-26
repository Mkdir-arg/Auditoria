import { Card } from '../components/ui/Card'

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Configuracion</h1>
      </div>

      <Card>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">Ajustes generales</h2>
          <p className="text-sm text-gray-600">
            Esta seccion esta pendiente de definicion. Indica que ajustes queres
            administrar aca y los agrego.
          </p>
        </div>
      </Card>
    </div>
  )
}
