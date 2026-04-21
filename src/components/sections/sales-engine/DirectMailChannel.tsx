import { useState } from 'react'
import ChartCard from '../../data-display/ChartCard'
import ChannelFinancialTable from '../../data-display/ChannelFinancialTable'
import MetricCard from '../../data-display/MetricCard'
import RevenueLineChart from '../../charts/RevenueLineChart'
import StackedBarChart from '../../charts/StackedBarChart'
import AreaChartComponent from '../../charts/AreaChartComponent'
import SliderInput from '../../interactive/SliderInput'
import NumberInput from '../../interactive/NumberInput'
import YearSelector from './YearSelector'
import { SALES_ENGINE_CHANNELS } from '../../../data/investorPortal/content'
import { useAssumptionsStore } from '../../../store/useAssumptionsStore'
import { formatCurrency } from '../../../utils/formatCurrency'
import type { YearlyOutputs } from '../../../data/investorPortal/formulas/types'

interface Props {
  years: YearlyOutputs[]
}

type ChartMode = 'volume' | 'leads' | 'profit'

const channel = SALES_ENGINE_CHANNELS.directMail

export default function DirectMailChannel({ years }: Props) {
  const [selectedYear, setSelectedYear] = useState(0)
  const [chartMode, setChartMode] = useState<ChartMode>('profit')
  const { assumptions, setAssumption } = useAssumptionsStore()
  const s = assumptions.sales

  const sel = years[selectedYear].homeServices.directMail

  // Chart data
  const volumeData = years.map((y, i) => ({
    name: `Y${i + 1}`,
    volume: y.homeServices.directMail.piecesPerMonth,
  }))

  const leadsData = years.map((y, i) => ({
    name: `Y${i + 1}`,
    leads: y.homeServices.directMail.leadsPerMonth,
  }))

  const profitData = years.map((y, i) => ({
    name: `Y${i + 1}`,
    profit: y.homeServices.directMail.totalProfitAnnual,
  }))

  const profitComposition = years.map((y, i) => ({
    name: `Y${i + 1}`,
    'Roofing Profit': y.homeServices.directMail.roofingProfitMonthly * 12,
    'Upsell Profit': y.homeServices.directMail.upsellProfitMonthly * 12,
  }))

  // ROI calculations
  const costPerJob = sel.roofingJobsPerMonth > 0
    ? sel.costPerMonth / sel.roofingJobsPerMonth
    : 0
  const roiMultiple = sel.costPerMonth > 0
    ? sel.totalProfitMonthly / sel.costPerMonth
    : 0

  const chartModes: { key: ChartMode; label: string }[] = [
    { key: 'volume', label: 'Mail Volume' },
    { key: 'leads', label: 'Leads' },
    { key: 'profit', label: 'Annual Profit' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="font-display font-bold text-text-primary text-xl mb-1">{channel.title}</h3>
        <p className="text-text-secondary text-sm">{channel.subtitle}</p>
      </div>

      {/* Strategy */}
      <div className="luxury-card-highlighted">
        <h4 className="font-display font-semibold text-text-primary text-lg mb-3">Targeting Strategy</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{channel.strategy}</p>
        <div className="flex items-center gap-3 pt-3 border-t border-accent-gold/20">
          <span className="text-accent-gold text-xs font-medium px-2.5 py-1 rounded-full bg-accent-gold/10">
            ~{Math.round(roiMultiple)}:1 ROI on marketing spend
          </span>
          <span className="text-text-muted text-xs">
            {formatCurrency(costPerJob)} cost per acquired roofing job
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="luxury-card">
        <h4 className="font-display font-semibold text-text-primary text-lg mb-5">Campaign Assumptions</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          <NumberInput
            label="Letters / Month"
            value={s.directMailPiecesPerMonth}
            min={5000}
            max={100000}
            step={1000}
            onChange={(v) => setAssumption('sales', 'directMailPiecesPerMonth', v)}
            suffix="letters"
          />
          <SliderInput
            label="Cost Per Piece"
            value={s.directMailCostPerPiece}
            min={0.50}
            max={3.00}
            step={0.01}
            onChange={(v) => setAssumption('sales', 'directMailCostPerPiece', v)}
            format={(v) => `$${v.toFixed(2)}`}
          />
          <SliderInput
            label="Response Rate (Mail to Lead)"
            value={s.directMailLeadConversion}
            min={0.001}
            max={0.02}
            step={0.001}
            onChange={(v) => setAssumption('sales', 'directMailLeadConversion', v)}
            format={(v) => `${(v * 100).toFixed(1)}%`}
          />
          <SliderInput
            label="Lead-to-Job Conversion"
            value={s.directMailLeadToJob}
            min={0.20}
            max={0.80}
            step={0.05}
            onChange={(v) => setAssumption('sales', 'directMailLeadToJob', v)}
            format={(v) => `${(v * 100).toFixed(0)}%`}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Switchable chart */}
        <ChartCard
          title={chartMode === 'volume' ? 'Mail Volume / Month' : chartMode === 'leads' ? 'Leads Generated / Month' : '5-Year Annual Profit'}
          subtitle="Toggle metric view"
        >
          <div className="flex gap-1 mb-4">
            {chartModes.map((m) => (
              <button
                key={m.key}
                onClick={() => setChartMode(m.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  chartMode === m.key
                    ? 'bg-accent-gold/15 text-accent-gold border border-accent-gold/30'
                    : 'text-text-muted hover:text-text-secondary hover:bg-surface-hover border border-transparent'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
          {chartMode === 'volume' && (
            <AreaChartComponent
              data={volumeData}
              dataKey="volume"
              label="Pieces / Month"
              color="#40916c"
              formatValue={(v) => `${(v / 1000).toFixed(0)}K`}
            />
          )}
          {chartMode === 'leads' && (
            <AreaChartComponent
              data={leadsData}
              dataKey="leads"
              label="Leads / Month"
              color="#40916c"
              formatValue={(v) => Math.round(v).toString()}
            />
          )}
          {chartMode === 'profit' && (
            <RevenueLineChart
              data={profitData}
              lines={[{ key: 'profit', label: 'Annual Profit', color: '#40916c' }]}
            />
          )}
        </ChartCard>

        {/* Profit composition - service expansion visibility */}
        <ChartCard title="Profit Composition" subtitle="Roofing revenue vs. cross-sell expansion">
          <StackedBarChart
            data={profitComposition}
            bars={[
              { key: 'Roofing Profit', label: 'Roofing Profit', color: '#40916c' },
              { key: 'Upsell Profit', label: 'Service Expansion', color: '#95d5b2' },
            ]}
          />
        </ChartCard>
      </div>

      {/* Cost vs Profit */}
      <ChartCard title="Cost vs. Profit — 5 Year Projection" subtitle="Annual mail spend compared to annual profit generated">
        <StackedBarChart
          data={years.map((y, i) => ({
            name: `Y${i + 1}`,
            Cost: y.homeServices.directMail.totalCostAnnual,
            Profit: y.homeServices.directMail.totalProfitAnnual,
          }))}
          bars={[
            { key: 'Cost', label: 'Total Cost', color: '#ef4444' },
            { key: 'Profit', label: 'Total Profit', color: '#c9a84c' },
          ]}
          stacked={false}
        />
      </ChartCard>

      {/* 5-Year Financial Summary Table */}
      <ChannelFinancialTable
        data={years.map((y, i) => ({
          year: i + 1,
          cost: y.homeServices.directMail.totalCostAnnual,
          revenue: y.homeServices.directMail.totalRevenueAnnual,
          profit: y.homeServices.directMail.totalProfitAnnual,
        }))}
        highlightYear={selectedYear + 1}
      />

      {/* Service Expansion Callout */}
      <div className="luxury-card-highlighted">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h4 className="font-display font-semibold text-text-primary text-sm mb-2">Service Expansion Value</h4>
            <p className="text-text-secondary text-xs leading-relaxed">
              Every roofing customer acquired through direct mail opens cross-sell pathways into HVAC, insulation, water heaters, air sealing, and solar.
              In Year {selectedYear + 1}, upsell revenue adds {formatCurrency(sel.upsellProfitMonthly * 12)} annually on top of base roofing profit —
              a {sel.roofingProfitMonthly > 0 ? Math.round((sel.upsellProfitMonthly / sel.roofingProfitMonthly) * 100) : 0}% profit increase from cross-sell alone.
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-text-muted text-xs mb-0.5">Upsell Profit (Y{selectedYear + 1})</p>
            <p className="font-display font-bold gold-gradient-text text-xl">{formatCurrency(sel.upsellProfitMonthly * 12)}</p>
          </div>
        </div>
      </div>

      {/* ROI Economics */}
      <div className="luxury-card">
        <h4 className="font-display font-semibold text-text-primary text-lg mb-4">ROI Economics (Year {selectedYear + 1})</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 rounded-lg bg-surface">
            <p className="text-text-muted text-xs mb-1">Cost / Piece</p>
            <p className="font-display font-semibold text-text-primary text-sm">${s.directMailCostPerPiece.toFixed(2)}</p>
          </div>
          <div className="p-3 rounded-lg bg-surface">
            <p className="text-text-muted text-xs mb-1">Cost / Acquired Job</p>
            <p className="font-display font-semibold text-text-primary text-sm">{formatCurrency(costPerJob)}</p>
          </div>
          <div className="p-3 rounded-lg bg-surface">
            <p className="text-text-muted text-xs mb-1">Monthly Mail Cost</p>
            <p className="font-display font-semibold text-text-primary text-sm">{formatCurrency(sel.costPerMonth)}</p>
          </div>
          <div className="p-3 rounded-lg bg-surface">
            <p className="text-text-muted text-xs mb-1">ROI Multiple</p>
            <p className="font-display font-semibold text-accent-gold text-sm">{roiMultiple.toFixed(1)}x</p>
          </div>
        </div>
      </div>

      {/* Year Detail */}
      <div className="luxury-card">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-display font-semibold text-text-primary text-lg">Year Detail</h4>
          <YearSelector selectedYear={selectedYear} onSelect={setSelectedYear} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <MetricCard label="Pieces / Month" value={sel.piecesPerMonth} format="compact" />
          <MetricCard label="Mail Cost / Month" value={sel.costPerMonth} format="currency" />
          <MetricCard label="Leads / Month" value={sel.leadsPerMonth} format="number" />
          <MetricCard label="Roofing Jobs / Mo" value={sel.roofingJobsPerMonth} format="number" />
          <MetricCard label="Monthly Profit" value={sel.totalProfitMonthly} format="currency" highlighted />
          <MetricCard label="Annual Profit" value={sel.totalProfitAnnual} format="currency" highlighted />
        </div>
      </div>
    </div>
  )
}
