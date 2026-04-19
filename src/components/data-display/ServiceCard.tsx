import { formatCurrency } from '../../utils/formatCurrency'

interface ServiceCardProps {
  name: string
  description: string
  avgRevenue: number
  cycleTime: string
  grantEligible: boolean
  crossSellRelevance: string
  margin?: number
}

export default function ServiceCard({
  name,
  description,
  avgRevenue,
  cycleTime,
  grantEligible,
  crossSellRelevance,
  margin,
}: ServiceCardProps) {
  return (
    <div className="luxury-card group">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-display font-semibold text-text-primary text-lg">{name}</h3>
        {grantEligible && (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-accent-green/20 text-accent-green-light">
            Grant Eligible
          </span>
        )}
      </div>
      <p className="text-text-secondary text-sm mb-4">{description}</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-text-muted text-xs uppercase tracking-wider">Avg Revenue</p>
          <p className="font-display font-semibold text-accent-gold text-lg">{formatCurrency(avgRevenue, false)}</p>
        </div>
        <div>
          <p className="text-text-muted text-xs uppercase tracking-wider">Cycle Time</p>
          <p className="text-text-primary font-medium">{cycleTime}</p>
        </div>
        {margin !== undefined && (
          <div>
            <p className="text-text-muted text-xs uppercase tracking-wider">Gross Margin</p>
            <p className="text-text-primary font-medium">{(margin * 100).toFixed(0)}%</p>
          </div>
        )}
        <div className="col-span-2">
          <p className="text-text-muted text-xs uppercase tracking-wider">Cross-Sell</p>
          <p className="text-text-secondary text-sm">{crossSellRelevance}</p>
        </div>
      </div>
    </div>
  )
}
