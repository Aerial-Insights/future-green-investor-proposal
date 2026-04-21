import { useState } from 'react'
import { motion } from 'framer-motion'
import ChartCard from '../../data-display/ChartCard'
import ChannelFinancialTable from '../../data-display/ChannelFinancialTable'
import MetricCard from '../../data-display/MetricCard'
import RevenueLineChart from '../../charts/RevenueLineChart'
import StackedBarChart from '../../charts/StackedBarChart'
import SliderInput from '../../interactive/SliderInput'
import YearSelector from './YearSelector'
import { SALES_ENGINE_CHANNELS } from '../../../data/investorPortal/content'
import { DIVISION_COLORS } from '../../../theme/chartTheme'
import { useAssumptionsStore } from '../../../store/useAssumptionsStore'
import type { YearlyOutputs } from '../../../data/investorPortal/formulas/types'

interface Props {
  years: YearlyOutputs[]
}

const channel = SALES_ENGINE_CHANNELS.d2d

export default function D2DChannel({ years }: Props) {
  const [selectedYear, setSelectedYear] = useState(0)
  const { assumptions, setAssumption } = useAssumptionsStore()
  const s = assumptions.sales

  const sel = years[selectedYear].homeServices.d2d

  // Chart data
  const profitByYear = years.map((y, i) => ({
    name: `Y${i + 1}`,
    'Roofing Profit': y.homeServices.d2d.roofingProfitMonthly * 12,
    'Upsell Profit': y.homeServices.d2d.upsellProfitMonthly * 12,
  }))

  const scalingData = years.map((y, i) => ({
    name: `Y${i + 1}`,
    reps: y.homeServices.d2d.reps,
    profit: y.homeServices.d2d.totalProfitAnnual,
  }))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="font-display font-bold text-text-primary text-xl mb-1">{channel.title}</h3>
        <p className="text-text-secondary text-sm">{channel.subtitle}</p>
      </div>

      {/* Strategy + Team Scaling */}
      <div className="luxury-card-highlighted">
        <h4 className="font-display font-semibold text-text-primary text-lg mb-3">Channel Strategy</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-6">{channel.strategy}</p>

        <div className="border-t border-accent-gold/20 pt-5">
          <div className="flex items-center justify-between mb-4">
            <h5 className="font-display font-semibold text-text-primary text-sm">Team Scaling Trajectory</h5>
            <span className="text-accent-gold text-xs font-medium px-2.5 py-1 rounded-full bg-accent-gold/10">
              Targeting 100-150+ reps at full scale
            </span>
          </div>

          <div className="flex items-end gap-1 sm:gap-2">
            {years.map((y, i) => {
              const reps = y.homeServices.d2d.reps
              const maxReps = years[4].homeServices.d2d.reps
              const heightPct = Math.max(20, (reps / maxReps) * 100)
              return (
                <motion.div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className="text-accent-gold font-display font-bold text-sm">{reps}</span>
                  <div
                    className="w-full rounded-t-lg transition-all duration-500"
                    style={{
                      height: `${heightPct}px`,
                      background: `linear-gradient(to top, ${DIVISION_COLORS.homeServices}40, ${DIVISION_COLORS.homeServices})`,
                    }}
                  />
                  <span className="text-text-muted text-xs">Y{i + 1}</span>
                </motion.div>
              )
            })}
          </div>
          <p className="text-text-muted text-xs mt-3 text-center">
            Active sales representatives by year (base model). Growth path extends to 100-150+ reps as market penetration deepens.
          </p>
        </div>
      </div>

      {/* Operating Assumptions / Controls */}
      <div className="luxury-card">
        <h4 className="font-display font-semibold text-text-primary text-lg mb-5">Operating Assumptions</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
          <SliderInput
            label="Starting Reps"
            value={s.reps}
            min={5}
            max={50}
            step={1}
            onChange={(v) => setAssumption('sales', 'reps', v)}
            format={(v) => `${v} reps`}
          />
          <SliderInput
            label="Doors Per Rep Per Day"
            value={s.doorsPerRepPerDay}
            min={10}
            max={60}
            step={5}
            onChange={(v) => setAssumption('sales', 'doorsPerRepPerDay', v)}
            format={(v) => `${v} doors`}
          />
          <SliderInput
            label="Working Days / Week"
            value={s.workingDaysPerWeek}
            min={3}
            max={6}
            step={1}
            onChange={(v) => setAssumption('sales', 'workingDaysPerWeek', v)}
            format={(v) => `${v} days`}
          />
          <SliderInput
            label="Conversion Rate (Doors to Jobs)"
            value={s.d2dConversionRate}
            min={0.005}
            max={0.04}
            step={0.001}
            onChange={(v) => setAssumption('sales', 'd2dConversionRate', v)}
            format={(v) => `${(v * 100).toFixed(1)}%`}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="5-Year Profit Trajectory" subtitle="Annual profit by rep growth multiplier">
          <RevenueLineChart
            data={scalingData}
            lines={[{ key: 'profit', label: 'Total Annual Profit', color: DIVISION_COLORS.homeServices }]}
          />
        </ChartCard>
        <ChartCard title="Profit Composition" subtitle="Roofing revenue vs. cross-sell upsell revenue">
          <StackedBarChart
            data={profitByYear}
            bars={[
              { key: 'Roofing Profit', label: 'Roofing Profit', color: DIVISION_COLORS.homeServices },
              { key: 'Upsell Profit', label: 'Upsell Profit', color: '#d4a843' },
            ]}
          />
        </ChartCard>
      </div>

      {/* Cost vs Profit */}
      <ChartCard title="Cost vs. Profit — 5 Year Projection" subtitle="Annual operating cost (rep salaries + overhead) compared to annual profit">
        <StackedBarChart
          data={years.map((y, i) => ({
            name: `Y${i + 1}`,
            Cost: y.homeServices.d2d.totalCostAnnual,
            Profit: y.homeServices.d2d.totalProfitAnnual,
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
          cost: y.homeServices.d2d.totalCostAnnual,
          revenue: y.homeServices.d2d.totalRevenueAnnual,
          profit: y.homeServices.d2d.totalProfitAnnual,
        }))}
        highlightYear={selectedYear + 1}
      />

      {/* Year Detail */}
      <div className="luxury-card">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-display font-semibold text-text-primary text-lg">Year Detail</h4>
          <YearSelector selectedYear={selectedYear} onSelect={setSelectedYear} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <MetricCard label="Active Reps" value={sel.reps} format="number" />
          <MetricCard label="Doors / Month" value={sel.doorsPerMonth} format="compact" />
          <MetricCard label="Roofing Jobs / Mo" value={sel.roofingJobsPerMonth} format="number" />
          <MetricCard label="Conversion Rate" value={s.d2dConversionRate} format="percent" />
          <MetricCard label="Monthly Profit" value={sel.totalProfitMonthly} format="currency" highlighted />
          <MetricCard label="Annual Profit" value={sel.totalProfitAnnual} format="currency" highlighted />
        </div>
      </div>

      {/* Why This Scales */}
      <div className="luxury-card">
        <h4 className="font-display font-semibold text-text-primary text-lg mb-3">Why This Channel Scales</h4>
        <p className="text-text-secondary text-sm leading-relaxed">{channel.whyScalable}</p>
      </div>
    </div>
  )
}
