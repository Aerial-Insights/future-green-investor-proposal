import { motion } from 'framer-motion'
import { MEMO } from '../../../data/investorPortal/memoContent'
import { useMemoScenarios } from '../../../hooks/useMemoScenarios'
import { formatCurrency } from '../../../utils/formatCurrency'
import ChartCard from '../../../components/data-display/ChartCard'
import StackedBarChart from '../../../components/charts/StackedBarChart'
import SectionHeader from '../components/SectionHeader'

const SCENARIO_COLORS: Record<string, string> = {
  conservative: '#737373',
  base: '#c9a84c',
  growth: '#2d6a4f',
  aggressive: '#6366f1',
}

export default function ScenarioAnalysis() {
  const scenarios = useMemoScenarios()
  const order = ['conservative', 'base', 'growth', 'aggressive'] as const

  // Grouped bar data: Y5 metrics per scenario
  const comparisonData = [
    {
      name: 'Y5 Portfolio Profit',
      ...Object.fromEntries(order.map((k) => [scenarios[k].label, scenarios[k].years[4].portfolio.totalProfit])),
    },
    {
      name: 'Total Distributed',
      ...Object.fromEntries(order.map((k) => [scenarios[k].label, scenarios[k].returns.totalDistributed])),
    },
  ]

  return (
    <section id="scenarios" className="py-24 border-t border-surface-border/60">
      <SectionHeader
        number="XII"
        eyebrow="Stress Test"
        title="Scenario Analysis"
        subtitle="Threshold clears in all four cases — only the timeline to threshold varies"
      />

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="text-text-secondary leading-[1.8] text-[15px] sm:text-[15.5px] mb-12"
      >
        {MEMO.scenarioNarrative}
      </motion.p>

        {/* Scenario cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          {order.map((key) => {
            const s = scenarios[key]
            const y5 = s.years[4]
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="luxury-card p-5 border-t-2"
                style={{ borderTopColor: SCENARIO_COLORS[key] }}
              >
                <h4 className="font-display font-semibold text-text-primary text-sm mb-1">{s.label}</h4>
                <p className="text-text-dim text-[10px] mb-4">{s.description}</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-text-dim text-[10px] uppercase tracking-wider">Y5 Profit</p>
                    <p className="font-display font-bold text-base text-text-primary">{formatCurrency(y5.portfolio.totalProfit)}</p>
                  </div>
                  <div>
                    <p className="text-text-dim text-[10px] uppercase tracking-wider">Total Distributed</p>
                    <p className="font-display font-bold text-base text-text-primary">{formatCurrency(s.returns.totalDistributed)}</p>
                  </div>
                  <div>
                    <p className="text-text-dim text-[10px] uppercase tracking-wider">Threshold Timeline</p>
                    <p className="font-display font-semibold text-sm text-text-primary">
                      {s.returns.monthsToThreshold ? `~${s.returns.monthsToThreshold} months` : 'Projected'}
                    </p>
                  </div>
                  <div>
                    <p className="text-text-dim text-[10px] uppercase tracking-wider">Threshold Met</p>
                    <p className="font-display font-semibold text-sm" style={{ color: s.returns.isThresholdMet ? '#40916c' : '#f59e0b' }}>
                      {s.returns.isThresholdMet ? `Year ${s.returns.thresholdYear}` : 'Post Year 5'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Comparison chart */}
        <ChartCard title="Scenario Comparison" subtitle="Year 5 portfolio profit and five-year investor distributions, all four cases">
          <StackedBarChart
            data={comparisonData}
            bars={order.map((k) => ({
              key: scenarios[k].label,
              label: scenarios[k].label,
              color: SCENARIO_COLORS[k],
            }))}
            height={280}
            stacked={false}
          />
        </ChartCard>
    </section>
  )
}
