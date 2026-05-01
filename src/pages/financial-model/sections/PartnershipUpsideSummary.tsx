import { motion } from 'framer-motion'
import { formatCurrency } from '../../../utils/formatCurrency'
import { formatPercent } from '../../../utils/formatPercent'
import type { PartnershipReturnSummary } from '../../../data/investorPortal/formulas/types'
import type { PartnershipOptionConfig } from '../../../data/investorPortal/baseAssumptions'

interface Props {
  summary: PartnershipReturnSummary
  config: PartnershipOptionConfig
}

export default function PartnershipUpsideSummary({ summary, config }: Props) {
  const horizonYear = summary.annualReturns[summary.annualReturns.length - 1]?.year ?? config.timeHorizonYears
  const peakYear = summary.annualReturns.reduce((peak, r) => (r.totalEarnings > peak.totalEarnings ? r : peak), summary.annualReturns[0])

  const thresholdLabel = summary.thresholdYear ? `Year ${summary.thresholdYear}` : `beyond Y${horizonYear}`
  const points = [
    {
      label: 'Two-Phase Waterfall',
      detail: `Initial phase pays the higher partnership percentages until the ${summary.returnThresholdMultiple.toFixed(2)}x return threshold (${formatCurrency(summary.thresholdTarget)}) is reached — modeled at ${thresholdLabel}. Participation then steps down to a permanent long-term profit share for the rest of the horizon.`,
    },
    {
      label: `${horizonYear}-Year Horizon`,
      detail: `Cumulative earnings of ${formatCurrency(summary.totalEarnings)} across ${horizonYear} years on a ${formatCurrency(summary.totalCapital)} investment — a ${summary.roiMultiple.toFixed(2)}x modeled return.`,
    },
    {
      label: 'Compounding with Company Growth',
      detail: `Peak annual earnings of ${formatCurrency(peakYear.totalEarnings)} occur in Year ${peakYear.year}, scaling with the underlying platform across all three divisions.`,
    },
    {
      label: 'Strategic Governance',
      detail: `${config.governance.role} role plus ${config.governance.boardSeatsAppointed} board appointments embed permanent strategic oversight and alignment across both phases.`,
    },
    {
      label: 'Three Independent Engines',
      detail: `Initial phase: ${formatPercent(config.homeServicesShare)} HS · ${formatPercent(config.realEstateShare)} Solar+RE · ${formatPercent(config.aerialInsightsShare)} Aerial. Permanent phase: ${formatPercent(config.postThresholdHomeServicesShare)} · ${formatPercent(config.postThresholdRealEstateShare)} · ${formatPercent(config.postThresholdAerialInsightsShare)} respectively.`,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
    >
      <div className="luxury-card p-6 md:p-8">
        <p className="text-accent-gold text-xs uppercase tracking-[0.15em] font-semibold mb-3">
          Long-Term Upside Summary
        </p>
        <h3 className="font-display font-bold text-text-primary text-xl mb-4">
          Why the Partnership Option vs. a Capped Return
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-3xl">
          The Partnership Option is designed for long-term upside across Home Services, Real Estate, and Aerial Insights
          as the platform scales nationally. Rather than capping the investor return at a repayment threshold, this
          structure preserves permanent participation in every division's profit through the full operating life.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {points.map((p) => (
            <div key={p.label} className="flex gap-3 p-4 rounded-lg bg-surface/30 border border-surface-border/40">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-gold mt-1.5 flex-shrink-0" />
              <div>
                <p className="text-text-primary text-sm font-semibold mb-1">{p.label}</p>
                <p className="text-text-secondary text-xs leading-relaxed">{p.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
