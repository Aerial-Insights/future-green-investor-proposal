import { motion } from 'framer-motion'
import { MEMO } from '../../../data/investorPortal/memoContent'
import { useCalculations } from '../../../hooks/useCalculations'
import { formatCurrency } from '../../../utils/formatCurrency'
import ChartCard from '../../../components/data-display/ChartCard'
import RevenueLineChart from '../../../components/charts/RevenueLineChart'
import StackedBarChart from '../../../components/charts/StackedBarChart'
import DonutChart from '../../../components/charts/DonutChart'
import { DIVISION_COLORS } from '../../../theme/chartTheme'
import SectionHeader from '../components/SectionHeader'
import MetricBlock, { MetricGrid } from '../components/MetricBlock'

export default function FinancialProjections() {
  const years = useCalculations()
  const y1 = years[0]
  const y5 = years[4]

  // Profit trajectory data
  const profitLineData = years.map((y) => ({
    name: `Year ${y.year}`,
    totalProfit: y.portfolio.totalProfit,
  }))

  // Division stacked bar data
  const divisionBarData = years.map((y) => ({
    name: `Y${y.year}`,
    'Home Services': y.portfolio.homeServicesProfit,
    'Solar Ops': y.portfolio.solarOperationsProfit,
    'Real Estate': y.portfolio.realEstateProfit,
    'Aerial Insights': y.portfolio.aerialProfit,
  }))

  // Y5 profit mix donut
  const profitMixData = [
    { name: 'Home Services', value: y5.portfolio.homeServicesProfit, color: DIVISION_COLORS.homeServices },
    { name: 'Solar Operations', value: y5.portfolio.solarOperationsProfit, color: DIVISION_COLORS.solar },
    { name: 'Real Estate', value: y5.portfolio.realEstateProfit, color: DIVISION_COLORS.realEstate },
    { name: 'Aerial Insights', value: y5.portfolio.aerialProfit, color: DIVISION_COLORS.aerialInsights },
  ].filter((d) => d.value > 0)

  // 5-year totals
  const totalProfit5yr = years.reduce((s, y) => s + y.portfolio.totalProfit, 0)

  return (
    <section id="projections" className="py-24 border-t border-surface-border/60">
      <SectionHeader
        number="XI"
        eyebrow="Projections"
        title="Five-Year Financial Projections"
        subtitle="Portfolio-level outputs from simultaneous scaling across all four divisions"
      />

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="text-text-secondary leading-[1.8] text-[15px] sm:text-[15.5px] mb-12"
      >
        {MEMO.financialProjectionsNarrative}
      </motion.p>

      <div className="mb-12">
        <MetricGrid cols={4}>
          <MetricBlock label="Y1 Portfolio Profit" value={formatCurrency(y1.portfolio.totalProfit)} delay={0} />
          <MetricBlock label="Y5 Portfolio Profit" value={formatCurrency(y5.portfolio.totalProfit)} accent delay={0.08} />
          <MetricBlock label="5-Year Total Profit" value={formatCurrency(totalProfit5yr)} delay={0.16} />
          <MetricBlock label="Growth Multiple" value={y1.portfolio.totalProfit > 0 ? `${(y5.portfolio.totalProfit / y1.portfolio.totalProfit).toFixed(1)}x` : '—'} delay={0.24} />
        </MetricGrid>
      </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          <ChartCard title="Profit Trajectory" subtitle="Total portfolio profit, Years 1–5">
            <RevenueLineChart
              data={profitLineData}
              lines={[{ key: 'totalProfit', label: 'Total Profit', color: '#c9a84c' }]}
              height={260}
            />
          </ChartCard>
          <ChartCard title="Year 5 Profit Composition" subtitle="Division contribution at full scale">
            <DonutChart
              data={profitMixData}
              height={260}
              innerRadius={60}
              outerRadius={100}
            />
          </ChartCard>
        </div>

        <ChartCard title="Profit by Division" subtitle="Annual contribution per business line, Years 1–5">
          <StackedBarChart
            data={divisionBarData}
            bars={[
              { key: 'Home Services', label: 'Home Services', color: DIVISION_COLORS.homeServices },
              { key: 'Solar Ops', label: 'Solar Ops', color: DIVISION_COLORS.solar },
              { key: 'Real Estate', label: 'Real Estate', color: DIVISION_COLORS.realEstate },
              { key: 'Aerial Insights', label: 'Aerial Insights', color: DIVISION_COLORS.aerialInsights },
            ]}
            height={280}
          />
        </ChartCard>

        {/* Year-by-year summary table */}
        <div className="mt-10 luxury-card p-6 overflow-x-auto">
          <h4 className="font-display font-semibold text-text-primary text-[15px] mb-4">Five-year profit schedule by division</h4>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="text-left text-text-muted uppercase tracking-wider py-2 pr-4">Division</th>
                {years.map((y) => (
                  <th key={y.year} className="text-right text-text-muted uppercase tracking-wider py-2 px-2">Y{y.year}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Home Services', key: 'homeServicesProfit' as const },
                { label: 'Solar Operations', key: 'solarOperationsProfit' as const },
                { label: 'Real Estate', key: 'realEstateProfit' as const },
                { label: 'Aerial Insights', key: 'aerialProfit' as const },
              ].map((row) => (
                <tr key={row.key} className="border-b border-surface-border/50">
                  <td className="text-text-secondary py-2 pr-4">{row.label}</td>
                  {years.map((y) => (
                    <td key={y.year} className="text-right text-text-primary py-2 px-2 font-medium">
                      {formatCurrency(y.portfolio[row.key])}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t-2 border-accent-gold/30">
                <td className="text-text-primary font-semibold py-2 pr-4">Total</td>
                {years.map((y) => (
                  <td key={y.year} className="text-right text-accent-gold py-2 px-2 font-bold">
                    {formatCurrency(y.portfolio.totalProfit)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
    </section>
  )
}
