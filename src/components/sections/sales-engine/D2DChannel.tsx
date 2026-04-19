import MetricStrip from '../../data-display/MetricStrip'
import ChartCard from '../../data-display/ChartCard'
import FunnelDiagram from '../../charts/FunnelDiagram'
import RevenueLineChart from '../../charts/RevenueLineChart'
import { SALES_ENGINE_CHANNELS } from '../../../data/investorPortal/content'
import { DIVISION_COLORS } from '../../../theme/chartTheme'
import type { YearlyOutputs } from '../../../data/investorPortal/formulas/types'

interface Props {
  years: YearlyOutputs[]
}

const channel = SALES_ENGINE_CHANNELS.d2d

export default function D2DChannel({ years }: Props) {
  const y1 = years[0]

  const profitByYear = years.map((y) => ({
    name: `Year ${y.year}`,
    profit: y.homeServices.d2d.totalProfitAnnual,
  }))

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-display font-bold text-text-primary text-xl mb-2">{channel.title}</h3>
        <p className="text-text-secondary text-sm">{channel.subtitle}</p>
      </div>

      <MetricStrip
        metrics={[
          { label: 'Doors/Month', value: y1.homeServices.d2d.doorsPerMonth, format: 'number' },
          { label: 'Roofing Jobs/Month', value: y1.homeServices.d2d.roofingJobsPerMonth, format: 'number' },
          { label: 'Monthly Profit', value: y1.homeServices.d2d.totalProfitMonthly, format: 'currency' },
          { label: 'Annual Profit (Y1)', value: y1.homeServices.d2d.totalProfitAnnual, format: 'currency' },
        ]}
        columns={4}
      />

      <div className="luxury-card">
        <h4 className="font-display font-semibold text-text-primary text-lg mb-3">Channel Strategy</h4>
        <p className="text-text-secondary text-sm leading-relaxed">{channel.strategy}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Conversion Funnel" subtitle="Monthly doors to deals (Year 1)">
          <FunnelDiagram
            steps={[
              { label: 'Doors/Month', value: y1.homeServices.d2d.doorsPerMonth },
              { label: 'Roofing Jobs', value: y1.homeServices.d2d.roofingJobsPerMonth },
            ]}
          />
        </ChartCard>
        <ChartCard title="5-Year Profit Trajectory" subtitle="Annual profit scaling with rep growth">
          <RevenueLineChart
            data={profitByYear}
            lines={[{ key: 'profit', label: 'D2D Profit', color: DIVISION_COLORS.homeServices }]}
          />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="luxury-card">
          <h4 className="font-display font-semibold text-text-primary text-lg mb-3">Activity Metrics</h4>
          <div className="space-y-2">
            {channel.metrics.map((m) => (
              <div key={m.label} className="flex justify-between py-2 border-b border-surface-border">
                <span className="text-text-secondary text-sm">{m.label}</span>
                <span className="text-text-primary text-sm font-medium">{m.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="luxury-card">
          <h4 className="font-display font-semibold text-text-primary text-lg mb-3">Why This Channel Scales</h4>
          <p className="text-text-secondary text-sm leading-relaxed">{channel.whyScalable}</p>
        </div>
      </div>
    </div>
  )
}
