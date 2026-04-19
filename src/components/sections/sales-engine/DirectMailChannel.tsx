import MetricStrip from '../../data-display/MetricStrip'
import ChartCard from '../../data-display/ChartCard'
import RevenueLineChart from '../../charts/RevenueLineChart'
import { SALES_ENGINE_CHANNELS } from '../../../data/investorPortal/content'
import { DIVISION_COLORS } from '../../../theme/chartTheme'
import type { YearlyOutputs } from '../../../data/investorPortal/formulas/types'

interface Props {
  years: YearlyOutputs[]
}

const channel = SALES_ENGINE_CHANNELS.directMail

export default function DirectMailChannel({ years }: Props) {
  const y1 = years[0]

  const profitByYear = years.map((y) => ({
    name: `Year ${y.year}`,
    profit: y.homeServices.directMail.totalProfitAnnual,
  }))

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-display font-bold text-text-primary text-xl mb-2">{channel.title}</h3>
        <p className="text-text-secondary text-sm">{channel.subtitle}</p>
      </div>

      <MetricStrip
        metrics={[
          { label: 'Pieces/Month', value: y1.homeServices.directMail.piecesPerMonth, format: 'number' },
          { label: 'Leads/Month', value: y1.homeServices.directMail.leadsPerMonth, format: 'number' },
          { label: 'Roofing Jobs/Month', value: y1.homeServices.directMail.roofingJobsPerMonth, format: 'number' },
          { label: 'Annual Profit (Y1)', value: y1.homeServices.directMail.totalProfitAnnual, format: 'currency' },
        ]}
        columns={4}
      />

      <div className="luxury-card">
        <h4 className="font-display font-semibold text-text-primary text-lg mb-3">Targeting Strategy</h4>
        <p className="text-text-secondary text-sm leading-relaxed">{channel.strategy}</p>
      </div>

      <ChartCard title="5-Year Profit Trajectory" subtitle="Annual profit scaling with mail volume growth">
        <RevenueLineChart
          data={profitByYear}
          lines={[{ key: 'profit', label: 'Direct Mail Profit', color: '#40916c' }]}
        />
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="luxury-card">
          <h4 className="font-display font-semibold text-text-primary text-lg mb-3">Response Metrics</h4>
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
          <h4 className="font-display font-semibold text-text-primary text-lg mb-3">ROI Characteristics</h4>
          <p className="text-text-secondary text-sm leading-relaxed">{channel.roiCharacteristics}</p>
        </div>
      </div>
    </div>
  )
}
