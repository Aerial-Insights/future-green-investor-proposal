import MetricStrip from '../../data-display/MetricStrip'
import ChartCard from '../../data-display/ChartCard'
import RevenueLineChart from '../../charts/RevenueLineChart'
import { SALES_ENGINE_CHANNELS } from '../../../data/investorPortal/content'
import type { YearlyOutputs } from '../../../data/investorPortal/formulas/types'

interface Props {
  years: YearlyOutputs[]
}

const channel = SALES_ENGINE_CHANNELS.commercial

export default function CommercialChannel({ years }: Props) {
  const y1 = years[0]

  const profitByYear = years.map((y) => ({
    name: `Year ${y.year}`,
    profit: y.homeServices.commercial.totalProfitAnnual,
  }))

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-display font-bold text-text-primary text-xl mb-2">{channel.title}</h3>
        <p className="text-text-secondary text-sm">{channel.subtitle}</p>
      </div>

      <MetricStrip
        metrics={[
          { label: 'Ad Spend/Month', value: y1.homeServices.commercial.adSpendMonthly, format: 'currency' },
          { label: 'Roofing Jobs/Month', value: y1.homeServices.commercial.roofingJobs, format: 'number' },
          { label: 'Solar Jobs/Month', value: y1.homeServices.commercial.solarJobs, format: 'number' },
          { label: 'Annual Profit (Y1)', value: y1.homeServices.commercial.totalProfitAnnual, format: 'currency' },
        ]}
        columns={4}
      />

      <div className="luxury-card">
        <h4 className="font-display font-semibold text-text-primary text-lg mb-3">Channel Strategy</h4>
        <p className="text-text-secondary text-sm leading-relaxed">{channel.strategy}</p>
      </div>

      <ChartCard title="5-Year Profit Trajectory" subtitle="Annual profit scaling with ad spend growth">
        <RevenueLineChart
          data={profitByYear}
          lines={[{ key: 'profit', label: 'Commercial Profit', color: '#2d6a4f' }]}
        />
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="luxury-card">
          <h4 className="font-display font-semibold text-text-primary text-lg mb-3">Lead Acquisition</h4>
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
          <h4 className="font-display font-semibold text-text-primary text-lg mb-3">Contract Characteristics</h4>
          <p className="text-text-secondary text-sm leading-relaxed">{channel.characteristics}</p>
        </div>
      </div>
    </div>
  )
}
