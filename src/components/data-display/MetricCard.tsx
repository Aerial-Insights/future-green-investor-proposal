import { motion } from 'framer-motion'
import { useAnimatedNumber } from '../../hooks/useAnimatedNumber'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatPercent } from '../../utils/formatPercent'
import { formatNumber } from '../../utils/formatNumber'
import InfoIcon from '../explanation/InfoIcon'

interface MetricCardProps {
  label: string
  value: number
  format?: 'currency' | 'percent' | 'number' | 'compact'
  prefix?: string
  suffix?: string
  delta?: number
  explanationKey?: string
  compact?: boolean
  highlighted?: boolean
  className?: string
  style?: React.CSSProperties
}

export default function MetricCard({
  label,
  value,
  format = 'currency',
  prefix = '',
  suffix = '',
  delta,
  explanationKey,
  compact = false,
  highlighted = false,
  className = '',
  style,
}: MetricCardProps) {
  const animatedValue = useAnimatedNumber(value)

  function formatValue(v: number): string {
    switch (format) {
      case 'currency':
        return formatCurrency(v)
      case 'percent':
        return formatPercent(v)
      case 'number':
        return formatNumber(v)
      case 'compact':
        return formatNumber(v, true)
      default:
        return v.toLocaleString()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`luxury-card ${compact ? 'p-4' : 'p-6'} ${highlighted ? 'luxury-card-highlighted' : ''} ${className}`}
      style={style}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-text-secondary text-xs font-medium uppercase tracking-wider">{label}</p>
        {explanationKey && <InfoIcon explanationKey={explanationKey} />}
      </div>
      <p className={`font-display font-bold mt-2 ${compact ? 'text-xl' : 'text-2xl sm:text-3xl'} ${highlighted ? 'gold-gradient-text' : 'text-text-primary'}`}>
        {prefix}{formatValue(animatedValue)}{suffix}
      </p>
      {delta !== undefined && (
        <div className="mt-2 flex items-center gap-1">
          <span className={`text-xs font-medium ${delta >= 0 ? 'text-accent-green-light' : 'text-red-400'}`}>
            {delta >= 0 ? '+' : ''}{formatPercent(delta)}
          </span>
          <span className="text-text-dim text-xs">vs prior year</span>
        </div>
      )}
    </motion.div>
  )
}
