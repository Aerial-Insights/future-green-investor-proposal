import { useCalculations } from '../../../hooks/useCalculations'
import { useAssumptionsStore } from '../../../store/useAssumptionsStore'
import { DIVISION_COLORS } from '../../../theme/chartTheme'
import { formatCurrency } from '../../../utils/formatCurrency'
import { formatNumber } from '../../../utils/formatNumber'
import MetricStrip from '../../data-display/MetricStrip'
import ChartCard from '../../data-display/ChartCard'
import RevenueLineChart from '../../charts/RevenueLineChart'
import AreaChartComponent from '../../charts/AreaChartComponent'
import SliderInput from '../../interactive/SliderInput'
import NumberInput from '../../interactive/NumberInput'

export default function AerialProjections() {
  const years = useCalculations()
  const y1 = years[0]
  const y5 = years[4]
  const { assumptions, setAssumption } = useAssumptionsStore()
  const aerial = assumptions.aerial

  const arrData = years.map((y) => ({
    name: `Year ${y.year}`,
    arr: y.aerial.totalARR,
  }))

  const userGrowthData = years.map((y) => ({
    name: `Year ${y.year}`,
    users: y.aerial.activeUsers,
  }))

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display font-bold text-text-primary text-2xl mb-2">Projections</h2>
        <p className="text-text-secondary text-sm max-w-2xl">
          Model the growth of Aerial Insights by adjusting subscription pricing and growth parameters. All outputs update in real time.
        </p>
      </div>

      {/* ── CONTROLS ───────────────────────────────────────────────────── */}
      <div className="luxury-card">
        <h3 className="font-display font-semibold text-text-primary text-base mb-5">Growth Controls</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Pricing */}
          <div className="space-y-4">
            <div className="text-text-secondary text-xs font-medium uppercase tracking-wider">Pricing</div>
            <NumberInput
              label="Monthly Subscription"
              value={aerial.subscriptionMonthly}
              min={500}
              max={3000}
              step={50}
              onChange={(v) => setAssumption('aerial', 'subscriptionMonthly', v)}
              prefix="$"
              suffix="/mo"
            />
          </div>

          {/* Growth parameters */}
          <div className="space-y-4">
            <div className="text-text-secondary text-xs font-medium uppercase tracking-wider">Growth</div>
            <SliderInput
              label="Monthly Growth Rate"
              value={aerial.monthlyGrowthRate}
              min={0.05}
              max={0.25}
              step={0.01}
              onChange={(v) => setAssumption('aerial', 'monthlyGrowthRate', v)}
              format={(v) => `${Math.round(v * 100)}%`}
            />
            <SliderInput
              label="Monthly Churn Rate"
              value={aerial.churnRate}
              min={0.01}
              max={0.10}
              step={0.005}
              onChange={(v) => setAssumption('aerial', 'churnRate', v)}
              format={(v) => `${(v * 100).toFixed(1)}%`}
            />
          </div>
        </div>
      </div>

      {/* ── METRICS ────────────────────────────────────────────────────── */}
      <MetricStrip
        metrics={[
          { label: 'Y1 ARR', value: y1.aerial.totalARR, format: 'currency' },
          { label: 'Y5 ARR', value: y5.aerial.totalARR, format: 'currency' },
          { label: 'Y5 Users', value: y5.aerial.activeUsers, format: 'number' },
          { label: 'Y5 MRR', value: y5.aerial.totalMRR, format: 'currency' },
        ]}
        columns={4}
      />

      {/* ── CHARTS ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="ARR Trajectory" subtitle="5-year annual recurring revenue">
          <RevenueLineChart
            data={arrData}
            lines={[{ key: 'arr', label: 'ARR', color: DIVISION_COLORS.aerialInsights }]}
            height={320}
          />
        </ChartCard>
        <ChartCard title="User Growth" subtitle="Active subscribers over time">
          <AreaChartComponent
            data={userGrowthData}
            dataKey="users"
            label="Active Users"
            color={DIVISION_COLORS.aerialInsights}
            height={320}
            formatValue={(v) => formatNumber(v)}
          />
        </ChartCard>
      </div>

      {/* ── YEAR-BY-YEAR TABLE ─────────────────────────────────────────── */}
      <div className="luxury-card overflow-x-auto">
        <h3 className="font-display font-semibold text-text-primary text-lg mb-4">Year-by-Year Summary</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border">
              <th className="text-left text-text-muted font-medium py-3 pr-4">Metric</th>
              {years.map((y) => (
                <th key={y.year} className="text-right text-text-muted font-medium py-3 px-3">Year {y.year}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-surface-border/50">
              <td className="text-text-secondary py-3 pr-4">Active Users</td>
              {years.map((y) => (
                <td key={y.year} className="text-right text-text-primary font-medium py-3 px-3">{y.aerial.activeUsers.toLocaleString()}</td>
              ))}
            </tr>
            <tr className="border-b border-surface-border/50">
              <td className="text-text-secondary py-3 pr-4">MRR</td>
              {years.map((y) => (
                <td key={y.year} className="text-right text-text-primary font-medium py-3 px-3">{formatCurrency(y.aerial.totalMRR)}</td>
              ))}
            </tr>
            <tr>
              <td className="text-text-secondary py-3 pr-4 font-medium">ARR</td>
              {years.map((y) => (
                <td key={y.year} className="text-right text-accent-gold font-display font-semibold py-3 px-3">{formatCurrency(y.aerial.totalARR)}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
