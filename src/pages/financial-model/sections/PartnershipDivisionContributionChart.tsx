import { motion } from 'framer-motion'
import ChartCard from '../../../components/data-display/ChartCard'
import DonutChart from '../../../components/charts/DonutChart'
import { formatCurrency } from '../../../utils/formatCurrency'
import { DIVISION_COLORS } from '../../../theme/chartTheme'
import type { PartnershipReturnSummary } from '../../../data/investorPortal/formulas/types'

interface Props {
  summary: PartnershipReturnSummary
}

export default function PartnershipDivisionContributionChart({ summary }: Props) {
  const horizonYear = summary.annualReturns[summary.annualReturns.length - 1]?.year ?? 20
  const data = [
    { name: 'Home Services', value: summary.divisionContribution.homeServices, color: DIVISION_COLORS.homeServices },
    { name: 'Real Estate / Subdivide', value: summary.divisionContribution.realEstate, color: DIVISION_COLORS.realEstate },
    { name: 'Solar / SREC / Energy', value: summary.divisionContribution.solarEnergy, color: DIVISION_COLORS.solar },
    { name: 'Aerial Insights / SaaS', value: summary.divisionContribution.aerial, color: DIVISION_COLORS.aerialInsights },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title={`${horizonYear}-Year Division Contribution`}
          subtitle="Cumulative investor earnings split by division"
        >
          <DonutChart
            data={data}
            centerLabel={`${horizonYear}-Yr Earnings`}
            centerValue={formatCurrency(summary.totalEarnings)}
          />
        </ChartCard>
        <div className="luxury-card p-6 flex flex-col justify-center">
          <p className="text-accent-gold text-xs uppercase tracking-[0.15em] font-semibold mb-3">
            Why the Partnership Compounds
          </p>
          <div className="space-y-4">
            {[
              {
                label: 'Two-Phase Waterfall',
                detail:
                  'Investor participates at the higher initial-phase percentages until the target return threshold is reached, then steps down to a permanent long-term profit share for the rest of the horizon.',
              },
              {
                label: 'Income Tracks Company Growth',
                detail:
                  'As the operating platform scales nationally, the investor share scales with it across all three divisions through both phases.',
              },
              {
                label: 'Strategic Governance',
                detail:
                  'Chairman role plus three board appointments embed long-term oversight and alignment with the operating thesis.',
              },
              {
                label: 'Diversified Three-Engine Mix',
                detail:
                  'Home Services pays immediately, Real Estate compounds asset-backed income, Aerial Insights compounds recurring SaaS — three independent return surfaces.',
              },
            ].map((item) => (
              <div key={item.label} className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-gold mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-text-primary text-sm font-semibold mb-0.5">{item.label}</p>
                  <p className="text-text-secondary text-xs leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
