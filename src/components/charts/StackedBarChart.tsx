import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { AXIS_STYLE, TOOLTIP_STYLE, GRID_STYLE, CHART_ANIMATION, CHART_COLOR_ARRAY } from '../../theme/chartTheme'
import { formatCurrency } from '../../utils/formatCurrency'

interface BarConfig {
  key: string
  label: string
  color?: string
}

interface StackedBarChartProps {
  data: Record<string, number | string>[]
  bars: BarConfig[]
  height?: number
  stacked?: boolean
}

export default function StackedBarChart({ data, bars, height = 300, stacked = true }: StackedBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid {...GRID_STYLE} />
        <XAxis dataKey="name" {...AXIS_STYLE} />
        <YAxis {...AXIS_STYLE} tickFormatter={(v) => formatCurrency(v)} />
        <Tooltip {...TOOLTIP_STYLE} formatter={(value: number) => formatCurrency(value, false)} />
        {bars.length > 1 && <Legend wrapperStyle={{ fontSize: 12, color: '#a3a3a3' }} />}
        {bars.map((bar, i) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            name={bar.label}
            stackId={stacked ? 'stack' : undefined}
            fill={bar.color ?? CHART_COLOR_ARRAY[i % CHART_COLOR_ARRAY.length]}
            radius={stacked && i === bars.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
            animationDuration={CHART_ANIMATION.duration}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
