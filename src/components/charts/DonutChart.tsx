import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { CHART_COLOR_ARRAY, useChartTheme, CHART_ANIMATION } from '../../theme/chartTheme'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatPercentRaw } from '../../utils/formatPercent'

interface DonutEntry {
  name: string
  value: number
  color?: string
}

interface DonutChartProps {
  data: DonutEntry[]
  height?: number
  innerRadius?: number
  outerRadius?: number
  showLegend?: boolean
  formatAs?: 'currency' | 'percent'
  centerLabel?: string
  centerValue?: string
}

export default function DonutChart({
  data,
  height = 300,
  innerRadius = 70,
  outerRadius = 110,
  showLegend = true,
  formatAs = 'currency',
  centerLabel,
  centerValue,
}: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const { tooltipStyle, legendStyle, textSecondary, textPrimary } = useChartTheme()

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={2}
          dataKey="value"
          animationDuration={CHART_ANIMATION.duration}
          stroke="none"
        >
          {data.map((entry, i) => (
            <Cell key={entry.name} fill={entry.color ?? CHART_COLOR_ARRAY[i % CHART_COLOR_ARRAY.length]} />
          ))}
        </Pie>
        <Tooltip
          {...tooltipStyle}
          formatter={(value: number) => {
            if (formatAs === 'percent') {
              const pct = total > 0 ? (value / total) * 100 : 0
              return formatPercentRaw(pct, 1)
            }
            return formatCurrency(value, false)
          }}
        />
        {showLegend && <Legend wrapperStyle={legendStyle} />}
        {/* Center text rendered via SVG */}
        {centerLabel && (
          <>
            <text x="50%" y="46%" textAnchor="middle" style={{ fill: textSecondary }} fontSize={11}>
              {centerLabel}
            </text>
            <text x="50%" y="56%" textAnchor="middle" style={{ fill: textPrimary }} fontSize={18} fontWeight={700} fontFamily="Sora, sans-serif">
              {centerValue}
            </text>
          </>
        )}
      </PieChart>
    </ResponsiveContainer>
  )
}
