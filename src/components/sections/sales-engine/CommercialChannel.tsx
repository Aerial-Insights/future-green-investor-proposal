import { useState } from 'react'
import ChartCard from '../../data-display/ChartCard'
import ChannelFinancialTable from '../../data-display/ChannelFinancialTable'
import MetricCard from '../../data-display/MetricCard'
import RevenueLineChart from '../../charts/RevenueLineChart'
import StackedBarChart from '../../charts/StackedBarChart'
import DonutChart from '../../charts/DonutChart'
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

const channel = SALES_ENGINE_CHANNELS.commercial

export default function CommercialChannel({ years }: Props) {
  const [selectedYear, setSelectedYear] = useState(0)
  const { assumptions, setAssumption } = useAssumptionsStore()
  const s = assumptions.sales
  const se = assumptions.serviceEconomics

  const sel = years[selectedYear].homeServices.commercial

  // Chart data
  const profitByYear = years.map((y, i) => ({
    name: `Y${i + 1}`,
    profit: y.homeServices.commercial.totalProfitAnnual,
  }))

  // Donut data for selected year
  const serviceMix = [
    { name: 'Roofing', value: sel.roofingProfit * 12, color: '#2d6a4f' },
    { name: 'Solar', value: sel.solarProfit * 12, color: '#40916c' },
    { name: 'Lighting', value: sel.lightingProfit * 12, color: '#95d5b2' },
  ]

  // Service breakdown details
  const services = [
    {
      name: 'Commercial Roofing',
      jobs: sel.roofingJobs,
      profitMo: sel.roofingProfit,
      avgValue: se.commercialRoofingRevenuePerJob,
      margin: se.commercialRoofingMargin,
      cpl: s.commercialRoofingCPL,
      closeRate: s.commercialRoofingCloseRate,
      color: '#2d6a4f',
    },
    {
      name: 'Commercial Solar',
      jobs: sel.solarJobs,
      profitMo: sel.solarProfit,
      avgValue: se.commercialSolarRevenuePerJob,
      margin: se.commercialSolarMargin,
      cpl: s.commercialSolarCPL,
      closeRate: s.commercialSolarCloseRate,
      color: '#40916c',
    },
    {
      name: 'Commercial Lighting',
      jobs: sel.lightingJobs,
      profitMo: sel.lightingProfit,
      avgValue: se.commercialLightingRevenuePerJob,
      margin: se.commercialLightingMargin,
      cpl: s.commercialLightingCPL,
      closeRate: s.commercialLightingCloseRate,
      color: '#95d5b2',
    },
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
        <h4 className="font-display font-semibold text-text-primary text-lg mb-3">Channel Strategy</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{channel.strategy}</p>
        <div className="pt-3 border-t border-accent-gold/20">
          <p className="text-text-secondary text-xs leading-relaxed">{channel.characteristics}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="luxury-card">
        <h4 className="font-display font-semibold text-text-primary text-lg mb-5">Acquisition Assumptions</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          <NumberInput
            label="Monthly Ad Spend"
            value={s.commercialAdSpendMonthly}
            min={5000}
            max={100000}
            step={5000}
            onChange={(v) => setAssumption('sales', 'commercialAdSpendMonthly', v)}
            prefix="$"
          />
          <SliderInput
            label="Roofing Close Rate"
            value={s.commercialRoofingCloseRate}
            min={0.05}
            max={0.30}
            step={0.01}
            onChange={(v) => setAssumption('sales', 'commercialRoofingCloseRate', v)}
            format={(v) => `${(v * 100).toFixed(0)}%`}
          />
          <SliderInput
            label="Solar Close Rate"
            value={s.commercialSolarCloseRate}
            min={0.05}
            max={0.25}
            step={0.01}
            onChange={(v) => setAssumption('sales', 'commercialSolarCloseRate', v)}
            format={(v) => `${(v * 100).toFixed(0)}%`}
          />
          <SliderInput
            label="Lighting Close Rate"
            value={s.commercialLightingCloseRate}
            min={0.05}
            max={0.25}
            step={0.01}
            onChange={(v) => setAssumption('sales', 'commercialLightingCloseRate', v)}
            format={(v) => `${(v * 100).toFixed(0)}%`}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="5-Year Profit Trajectory" subtitle="Total commercial channel profit">
          <RevenueLineChart
            data={profitByYear}
            lines={[{ key: 'profit', label: 'Commercial Profit', color: '#2d6a4f' }]}
          />
        </ChartCard>
        <ChartCard title={`Service Profit Mix — Year ${selectedYear + 1}`} subtitle="Revenue split across commercial services">
          <DonutChart
            data={serviceMix}
            formatAs="currency"
            centerLabel="Total"
            centerValue={formatCurrency(sel.totalProfitMonthly * 12)}
          />
        </ChartCard>
      </div>

      {/* Cost vs Profit */}
      <ChartCard title="Cost vs. Profit — 5 Year Projection" subtitle="Annual ad spend compared to annual profit generated">
        <StackedBarChart
          data={years.map((y, i) => ({
            name: `Y${i + 1}`,
            Cost: y.homeServices.commercial.totalCostAnnual,
            Profit: y.homeServices.commercial.totalProfitAnnual,
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
          cost: y.homeServices.commercial.totalCostAnnual,
          revenue: y.homeServices.commercial.totalRevenueAnnual,
          profit: y.homeServices.commercial.totalProfitAnnual,
        }))}
        highlightYear={selectedYear + 1}
      />

      {/* Service Breakdown */}
      <div>
        <h4 className="font-display font-semibold text-text-primary text-lg mb-4">Service Breakdown — Year {selectedYear + 1}</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((svc) => (
            <div key={svc.name} className="luxury-card">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: svc.color }} />
                <h5 className="font-display font-semibold text-text-primary text-sm">{svc.name}</h5>
              </div>
              <div className="space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-text-muted text-xs">Jobs / Month</span>
                  <span className="text-text-primary text-xs font-medium">{svc.jobs.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted text-xs">Profit / Month</span>
                  <span className="text-accent-gold text-xs font-medium">{formatCurrency(svc.profitMo)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted text-xs">Avg Job Value</span>
                  <span className="text-text-primary text-xs font-medium">{formatCurrency(svc.avgValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted text-xs">Gross Margin</span>
                  <span className="text-text-primary text-xs font-medium">{(svc.margin * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted text-xs">Cost Per Lead</span>
                  <span className="text-text-primary text-xs font-medium">{formatCurrency(svc.cpl)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted text-xs">Close Rate</span>
                  <span className="text-text-primary text-xs font-medium">{(svc.closeRate * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Year Detail */}
      <div className="luxury-card">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-display font-semibold text-text-primary text-lg">Year Detail</h4>
          <YearSelector selectedYear={selectedYear} onSelect={setSelectedYear} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <MetricCard label="Ad Spend / Month" value={sel.adSpendMonthly} format="currency" />
          <MetricCard label="Roofing Jobs / Mo" value={sel.roofingJobs} format="number" />
          <MetricCard label="Solar Jobs / Mo" value={sel.solarJobs} format="number" />
          <MetricCard label="Lighting Jobs / Mo" value={sel.lightingJobs} format="number" />
          <MetricCard label="Monthly Profit" value={sel.totalProfitMonthly} format="currency" highlighted />
          <MetricCard label="Annual Profit" value={sel.totalProfitAnnual} format="currency" highlighted />
        </div>
      </div>
    </div>
  )
}
