import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { CHART_COLORS, AXIS_STYLE, TOOLTIP_STYLE, GRID_STYLE, CHART_ANIMATION } from '../../theme/chartTheme'
import { formatCurrency } from '../../utils/formatCurrency'

interface AreaChartProps {
  data: Record<string, number | string>[]
  dataKey: string
  label?: string
  color?: string
  height?: number
  formatValue?: (v: number) => string
}

export default function AreaChartComponent({
  data,
  dataKey,
  label,
  color = CHART_COLORS.primary,
  height = 300,
  formatValue = (v) => formatCurrency(v),
}: AreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <defs>
          <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid {...GRID_STYLE} />
        <XAxis dataKey="name" {...AXIS_STYLE} />
        <YAxis {...AXIS_STYLE} tickFormatter={formatValue} />
        <Tooltip {...TOOLTIP_STYLE} formatter={(value: number) => formatValue(value)} />
        <Area
          type="monotone"
          dataKey={dataKey}
          name={label ?? dataKey}
          stroke={color}
          strokeWidth={2}
          fill={`url(#gradient-${dataKey})`}
          animationDuration={CHART_ANIMATION.duration}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
