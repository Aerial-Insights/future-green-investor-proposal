import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { CHART_COLORS, AXIS_STYLE, TOOLTIP_STYLE, GRID_STYLE, CHART_ANIMATION } from '../../theme/chartTheme'
import { formatCurrency } from '../../utils/formatCurrency'

interface DataPoint {
  name: string
  [key: string]: number | string
}

interface LineConfig {
  key: string
  label: string
  color?: string
}

interface RevenueLineChartProps {
  data: DataPoint[]
  lines: LineConfig[]
  height?: number
}

export default function RevenueLineChart({ data, lines, height = 300 }: RevenueLineChartProps) {
  const colorArray = [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.tertiary, CHART_COLORS.quaternary, CHART_COLORS.quinary]

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid {...GRID_STYLE} />
        <XAxis dataKey="name" {...AXIS_STYLE} />
        <YAxis {...AXIS_STYLE} tickFormatter={(v) => formatCurrency(v)} />
        <Tooltip {...TOOLTIP_STYLE} formatter={(value: number) => formatCurrency(value, false)} />
        {lines.length > 1 && <Legend wrapperStyle={{ fontSize: 12, color: '#a3a3a3' }} />}
        {lines.map((line, i) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            name={line.label}
            stroke={line.color ?? colorArray[i % colorArray.length]}
            strokeWidth={2}
            dot={{ fill: line.color ?? colorArray[i % colorArray.length], r: 4 }}
            activeDot={{ r: 6 }}
            animationDuration={CHART_ANIMATION.duration}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
