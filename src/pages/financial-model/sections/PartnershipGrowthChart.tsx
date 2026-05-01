import { motion } from 'framer-motion'
import ChartCard from '../../../components/data-display/ChartCard'
import StackedBarChart from '../../../components/charts/StackedBarChart'
import AreaChartComponent from '../../../components/charts/AreaChartComponent'
import { DIVISION_COLORS } from '../../../theme/chartTheme'
import type { PartnershipReturnSummary } from '../../../data/investorPortal/formulas/types'

interface Props {
  summary: PartnershipReturnSummary
}

export default function PartnershipGrowthChart({ summary }: Props) {
  const profitData = summary.annualReturns.map((r) => ({
    name: `Y${r.year}`,
    'Home Services': r.homeServicesProfit,
    'Solar & RE': r.solarRealEstateProfit,
    'Aerial Insights': r.aerialProfit,
  }))

  const cumulativeData = summary.annualReturns.map((r) => ({
    name: `Y${r.year}`,
    cumulative: r.cumulativeEarnings,
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Company Profit by Division"
          subtitle={`${summary.annualReturns.length}-year platform performance, by year`}
        >
          <StackedBarChart
            data={profitData}
            bars={[
              { key: 'Home Services', label: 'Home Services', color: DIVISION_COLORS.homeServices },
              { key: 'Solar & RE', label: 'Solar & Real Estate', color: DIVISION_COLORS.realEstate },
              { key: 'Aerial Insights', label: 'Aerial Insights', color: DIVISION_COLORS.aerialInsights },
            ]}
            height={380}
          />
        </ChartCard>
        <ChartCard
          title="Cumulative Investor Earnings"
          subtitle="Compounding earnings across the partnership horizon"
        >
          <AreaChartComponent data={cumulativeData} dataKey="cumulative" color="#c9a84c" height={380} />
        </ChartCard>
      </div>
    </motion.div>
  )
}
