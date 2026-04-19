import MetricCard from './MetricCard'

interface Metric {
  label: string
  value: number
  format?: 'currency' | 'percent' | 'number' | 'compact'
  prefix?: string
  suffix?: string
  explanationKey?: string
}

interface MetricStripProps {
  metrics: Metric[]
  columns?: number
}

export default function MetricStrip({ metrics, columns = 3 }: MetricStripProps) {
  const gridCols =
    columns === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : columns === 4
      ? 'grid-cols-2 sm:grid-cols-4'
      : columns === 6
      ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'

  return (
    <div className={`grid ${gridCols} gap-4`}>
      {metrics.map((m) => (
        <MetricCard key={m.label} {...m} compact />
      ))}
    </div>
  )
}
