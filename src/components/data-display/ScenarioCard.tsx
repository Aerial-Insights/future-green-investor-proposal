import { formatCurrency } from '../../utils/formatCurrency'

interface ScenarioMetric {
  label: string
  value: number
}

interface ScenarioCardProps {
  name: string
  description: string
  metrics: ScenarioMetric[]
  isActive?: boolean
  onClick?: () => void
}

export default function ScenarioCard({ name, description, metrics, isActive, onClick }: ScenarioCardProps) {
  return (
    <button
      onClick={onClick}
      className={`text-left w-full luxury-card transition-all duration-300 ${
        isActive ? 'border-accent-gold shadow-glow' : 'hover:border-surface-light'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-accent-gold' : 'bg-surface-border'}`} />
        <h4 className="font-display font-semibold text-text-primary text-sm">{name}</h4>
      </div>
      <p className="text-text-muted text-xs mb-3">{description}</p>
      <div className="space-y-2">
        {metrics.map((m) => (
          <div key={m.label} className="flex justify-between items-baseline">
            <span className="text-text-secondary text-xs">{m.label}</span>
            <span className="font-display font-semibold text-text-primary text-sm">{formatCurrency(m.value)}</span>
          </div>
        ))}
      </div>
    </button>
  )
}
