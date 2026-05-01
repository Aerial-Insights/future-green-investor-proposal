import { motion } from 'framer-motion'
import { formatCurrency } from '../../../utils/formatCurrency'
import type { PartnershipReturnSummary } from '../../../data/investorPortal/formulas/types'
import type { PartnershipOptionConfig } from '../../../data/investorPortal/baseAssumptions'

interface Props {
  summary: PartnershipReturnSummary
  config: PartnershipOptionConfig
}

export default function PartnershipHero({ summary, config }: Props) {
  const horizonYear = summary.annualReturns[summary.annualReturns.length - 1]?.year ?? config.timeHorizonYears
  const thresholdLabel = summary.thresholdYear
    ? `Year ${summary.thresholdYear}`
    : `Beyond Y${horizonYear}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="relative overflow-hidden rounded-2xl border border-accent-gold/20 bg-gradient-to-br from-surface-elevated via-surface-elevated to-surface-hover p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-gold/[0.04] rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-gold/[0.02] rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="text-[10px] font-bold text-surface-elevated bg-accent-gold px-3 py-1.5 rounded-full uppercase tracking-wider">
              ${(summary.totalCapital / 1_000_000).toFixed(0)}M Capital Raise
            </span>
            <span className="text-accent-gold text-xs uppercase tracking-[0.2em] font-semibold">
              Long-Term Partnership Structure
            </span>
            <span className="text-[10px] font-bold text-emerald-100 bg-emerald-700/80 px-3 py-1.5 rounded-full uppercase tracking-wider">
              {config.governance.role}
            </span>
          </div>
          <h2 className="font-display font-bold text-text-primary text-4xl md:text-5xl mb-4 leading-tight">
            A two-phase return waterfall<br className="hidden md:block" /> across the operating platform.
          </h2>
          <p className="text-text-secondary text-base leading-relaxed max-w-3xl mb-10">
            The partnership option pays the higher initial-phase percentages until the target return threshold of{' '}
            <span className="text-accent-gold font-semibold">{summary.returnThresholdMultiple.toFixed(2)}x</span>{' '}
            ({formatCurrency(summary.thresholdTarget)}) is reached, then converts to a permanent long-term profit
            share for the remainder of the {horizonYear}-year horizon. The investor enters as{' '}
            <span className="text-accent-gold font-semibold">{config.governance.role}</span> with the ability to
            appoint <span className="text-accent-gold font-semibold">{config.governance.boardSeatsAppointed} board selections</span>{' '}
            across Home Services, Real Estate, and Aerial Insights.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            <div className="bg-surface/40 border border-accent-gold/30 rounded-xl p-5">
              <p className="text-text-muted text-[10px] uppercase tracking-wider mb-2">Threshold Reached</p>
              <p className="text-accent-gold font-display font-bold text-2xl">{thresholdLabel}</p>
              <p className="text-text-dim text-[10px] mt-1">
                {formatCurrency(summary.thresholdReturnAmount)} cumulative
              </p>
            </div>
            <div className="bg-surface/40 border border-accent-gold/30 rounded-xl p-5">
              <p className="text-text-muted text-[10px] uppercase tracking-wider mb-2">Total Earnings (Y{horizonYear})</p>
              <p className="text-accent-gold font-display font-bold text-2xl">{formatCurrency(summary.totalEarnings)}</p>
              <p className="text-text-dim text-[10px] mt-1">{summary.roiMultiple.toFixed(2)}x ROI multiple</p>
            </div>
            <div className="bg-surface/40 border border-surface-border/50 rounded-xl p-5">
              <p className="text-text-muted text-[10px] uppercase tracking-wider mb-2">Time Horizon</p>
              <p className="text-text-primary font-display font-bold text-2xl">{horizonYear} Years</p>
            </div>
            <div className="bg-surface/40 border border-surface-border/50 rounded-xl p-5">
              <p className="text-text-muted text-[10px] uppercase tracking-wider mb-2">Board Influence</p>
              <p className="text-text-primary font-display font-bold text-2xl">
                {config.governance.boardSeatsAppointed} <span className="text-base font-medium">seats</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
