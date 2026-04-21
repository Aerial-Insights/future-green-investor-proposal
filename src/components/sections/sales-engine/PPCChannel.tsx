import { useState } from 'react'
import ChartCard from '../../data-display/ChartCard'
import ChannelFinancialTable from '../../data-display/ChannelFinancialTable'
import MetricCard from '../../data-display/MetricCard'
import RevenueLineChart from '../../charts/RevenueLineChart'
import StackedBarChart from '../../charts/StackedBarChart'
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

const channel = SALES_ENGINE_CHANNELS.ppc

export default function PPCChannel({ years }: Props) {
  const [selectedYear, setSelectedYear] = useState(0)
  const { assumptions, setAssumption } = useAssumptionsStore()
  const s = assumptions.sales

  const sel = years[selectedYear].homeServices.energyGrants

  // Chart data
  const serviceBreakdown = years.map((y, i) => ({
    name: `Y${i + 1}`,
    'HVAC': y.homeServices.energyGrants.hvacProfit * 12,
    'Insulation': y.homeServices.energyGrants.insulationProfit * 12,
    'Water Heater': y.homeServices.energyGrants.waterHeaterProfit * 12,
  }))

  const profitLines = years.map((y, i) => ({
    name: `Y${i + 1}`,
    'Total Profit': y.homeServices.energyGrants.totalProfitAnnual,
    'Base Profit': y.homeServices.energyGrants.baseProfitMonthly * 12,
    'Upsell Profit': y.homeServices.energyGrants.upsellProfitMonthly * 12,
  }))

  const totalJobs = sel.hvacJobs + sel.insulationJobs + sel.waterHeaterJobs

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="font-display font-bold text-text-primary text-xl mb-1">{channel.title}</h3>
        <p className="text-text-secondary text-sm">{channel.subtitle}</p>
      </div>

      {/* Strategy + Grant Integration */}
      <div className="luxury-card-highlighted">
        <h4 className="font-display font-semibold text-text-primary text-lg mb-3">Channel Strategy</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{channel.strategy}</p>
        <div className="pt-4 border-t border-accent-gold/20">
          <h5 className="font-display font-semibold text-text-primary text-sm mb-2">Grant + Rebate Integration</h5>
          <p className="text-text-secondary text-xs leading-relaxed">{channel.grantIntegration}</p>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-accent-gold text-xs font-medium px-2.5 py-1 rounded-full bg-accent-gold/10">
              ~60% grant eligibility
            </span>
            <span className="text-accent-gold text-xs font-medium px-2.5 py-1 rounded-full bg-accent-gold/10">
              ~30% cost coverage
            </span>
            <span className="text-accent-gold text-xs font-medium px-2.5 py-1 rounded-full bg-accent-gold/10">
              1.3-1.5x profit multiplier
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="luxury-card">
        <h4 className="font-display font-semibold text-text-primary text-lg mb-5">PPC Assumptions</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
          <NumberInput
            label="Monthly PPC Spend"
            value={s.grantsPPCSpendMonthly}
            min={5000}
            max={100000}
            step={5000}
            onChange={(v) => setAssumption('sales', 'grantsPPCSpendMonthly', v)}
            prefix="$"
          />
          <SliderInput
            label="HVAC Allocation"
            value={s.hvacPPCDiversion}
            min={0.10}
            max={0.70}
            step={0.05}
            onChange={(v) => setAssumption('sales', 'hvacPPCDiversion', v)}
            format={(v) => `${(v * 100).toFixed(0)}%`}
          />
          <SliderInput
            label="Insulation Allocation"
            value={s.insulationPPCDiversion}
            min={0.10}
            max={0.50}
            step={0.05}
            onChange={(v) => setAssumption('sales', 'insulationPPCDiversion', v)}
            format={(v) => `${(v * 100).toFixed(0)}%`}
          />
          <SliderInput
            label="Water Heater Allocation"
            value={s.waterHeaterPPCDiversion}
            min={0.10}
            max={0.50}
            step={0.05}
            onChange={(v) => setAssumption('sales', 'waterHeaterPPCDiversion', v)}
            format={(v) => `${(v * 100).toFixed(0)}%`}
          />
          <SliderInput
            label="Cost Per Lead"
            value={s.grantsPPCCostPerLead}
            min={20}
            max={150}
            step={5}
            onChange={(v) => setAssumption('sales', 'grantsPPCCostPerLead', v)}
            format={(v) => `$${v}`}
          />
          <SliderInput
            label="Lead Conversion Rate"
            value={s.grantsPPCLeadConversion}
            min={0.10}
            max={0.50}
            step={0.01}
            onChange={(v) => setAssumption('sales', 'grantsPPCLeadConversion', v)}
            format={(v) => `${(v * 100).toFixed(0)}%`}
          />
        </div>
      </div>

      {/* Spend → Jobs → Profit Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="luxury-card text-center">
          <p className="text-text-muted text-xs uppercase tracking-wider mb-2">Monthly Ad Spend</p>
          <p className="font-display font-bold text-text-primary text-2xl">{formatCurrency(sel.adSpendMonthly)}</p>
          <p className="text-text-muted text-xs mt-1">Year {selectedYear + 1}</p>
        </div>
        <div className="luxury-card text-center">
          <p className="text-text-muted text-xs uppercase tracking-wider mb-2">Jobs Generated / Mo</p>
          <p className="font-display font-bold text-text-primary text-2xl">{totalJobs.toFixed(1)}</p>
          <div className="flex justify-center gap-3 mt-2">
            <span className="text-text-muted text-xs">HVAC {sel.hvacJobs.toFixed(1)}</span>
            <span className="text-text-muted text-xs">Insul. {sel.insulationJobs.toFixed(1)}</span>
            <span className="text-text-muted text-xs">WH {sel.waterHeaterJobs.toFixed(1)}</span>
          </div>
        </div>
        <div className="luxury-card text-center">
          <p className="text-text-muted text-xs uppercase tracking-wider mb-2">Monthly Profit</p>
          <p className="font-display font-bold gold-gradient-text text-2xl">{formatCurrency(sel.totalProfitMonthly)}</p>
          <div className="flex justify-center gap-3 mt-2">
            <span className="text-text-muted text-xs">Base {formatCurrency(sel.baseProfitMonthly)}</span>
            <span className="text-accent-gold text-xs">+ Upsell {formatCurrency(sel.upsellProfitMonthly)}</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Annual Profit by Service" subtitle="HVAC, insulation, and water heater base profit">
          <StackedBarChart
            data={serviceBreakdown}
            bars={[
              { key: 'HVAC', label: 'HVAC', color: '#1b4332' },
              { key: 'Insulation', label: 'Insulation', color: '#2d6a4f' },
              { key: 'Water Heater', label: 'Water Heater', color: '#52b788' },
            ]}
          />
        </ChartCard>
        <ChartCard title="Profit Trajectory" subtitle="Total, base, and upsell annual profit">
          <RevenueLineChart
            data={profitLines}
            lines={[
              { key: 'Total Profit', label: 'Total Profit', color: '#1b4332' },
              { key: 'Base Profit', label: 'Base Profit', color: '#40916c' },
              { key: 'Upsell Profit', label: 'Upsell Profit', color: '#95d5b2' },
            ]}
          />
        </ChartCard>
      </div>

      {/* Cost vs Profit */}
      <ChartCard title="Cost vs. Profit — 5 Year Projection" subtitle="Annual PPC ad spend compared to annual profit generated">
        <StackedBarChart
          data={years.map((y, i) => ({
            name: `Y${i + 1}`,
            Cost: y.homeServices.energyGrants.totalCostAnnual,
            Profit: y.homeServices.energyGrants.totalProfitAnnual,
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
          cost: y.homeServices.energyGrants.totalCostAnnual,
          revenue: y.homeServices.energyGrants.totalRevenueAnnual,
          profit: y.homeServices.energyGrants.totalProfitAnnual,
        }))}
        highlightYear={selectedYear + 1}
      />

      {/* Grant Impact */}
      <div className="luxury-card-highlighted">
        <h4 className="font-display font-semibold text-text-primary text-sm mb-3">Grant Impact on Unit Economics</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-text-muted text-xs mb-1">Rebate Eligibility</p>
            <p className="font-display font-semibold text-accent-gold text-sm">{(assumptions.grants.rebateEligibilityRate * 100).toFixed(0)}%</p>
          </div>
          <div>
            <p className="text-text-muted text-xs mb-1">Avg Rebate / Deal</p>
            <p className="font-display font-semibold text-accent-gold text-sm">{formatCurrency(assumptions.grants.avgResidentialRebatePerDeal)}</p>
          </div>
          <div>
            <p className="text-text-muted text-xs mb-1">Grant Coverage</p>
            <p className="font-display font-semibold text-accent-gold text-sm">{(assumptions.grants.avgGrantCoveragePercent * 100).toFixed(0)}%</p>
          </div>
          <div>
            <p className="text-text-muted text-xs mb-1">Close Rate Uplift</p>
            <p className="font-display font-semibold text-accent-gold text-sm">+{(assumptions.grants.grantCloseRateUplift * 100).toFixed(0)}%</p>
          </div>
        </div>
      </div>

      {/* Year Detail */}
      <div className="luxury-card">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-display font-semibold text-text-primary text-lg">Year Detail</h4>
          <YearSelector selectedYear={selectedYear} onSelect={setSelectedYear} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          <MetricCard label="Ad Spend / Mo" value={sel.adSpendMonthly} format="currency" />
          <MetricCard label="HVAC Jobs / Mo" value={sel.hvacJobs} format="number" />
          <MetricCard label="Insulation Jobs" value={sel.insulationJobs} format="number" />
          <MetricCard label="WH Jobs / Mo" value={sel.waterHeaterJobs} format="number" />
          <MetricCard label="Base Profit / Mo" value={sel.baseProfitMonthly} format="currency" />
          <MetricCard label="Upsell Profit / Mo" value={sel.upsellProfitMonthly} format="currency" />
          <MetricCard label="Monthly Profit" value={sel.totalProfitMonthly} format="currency" highlighted />
          <MetricCard label="Annual Profit" value={sel.totalProfitAnnual} format="currency" highlighted />
        </div>
      </div>
    </div>
  )
}
