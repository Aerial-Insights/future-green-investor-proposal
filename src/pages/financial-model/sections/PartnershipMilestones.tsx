import { motion } from 'framer-motion'
import { formatCurrency } from '../../../utils/formatCurrency'
import type { PartnershipReturnSummary } from '../../../data/investorPortal/formulas/types'

interface Props {
  summary: PartnershipReturnSummary
}

export default function PartnershipMilestones({ summary }: Props) {
  if (summary.milestones.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
    >
      <div className="luxury-card p-6 md:p-8">
        <div className="flex items-baseline justify-between mb-5">
          <h3 className="font-display font-bold text-text-primary text-xl">Milestone Earnings</h3>
          <span className="text-text-muted text-xs">Cumulative investor earnings on a {formatCurrency(summary.totalCapital)} investment</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {summary.milestones.map((m, idx) => {
            const isFinal = idx === summary.milestones.length - 1
            const phaseLabel =
              m.activePhase === 'initial'
                ? 'Initial Phase'
                : m.activePhase === 'permanent'
                  ? 'Permanent Phase'
                  : 'Threshold Year'
            const phasePillClass =
              m.activePhase === 'permanent'
                ? 'text-emerald-300 border-emerald-500/40 bg-emerald-700/10'
                : m.activePhase === 'threshold-year'
                  ? 'text-amber-100 border-amber-400/40 bg-amber-700/30'
                  : 'text-accent-gold border-accent-gold/30 bg-accent-gold/[0.08]'
            return (
              <div
                key={m.year}
                className={`rounded-xl p-5 text-center border ${
                  isFinal
                    ? 'bg-accent-gold/10 border-accent-gold/40'
                    : 'bg-surface/40 border-surface-border/50'
                }`}
              >
                <p className="text-text-muted text-[10px] uppercase tracking-wider mb-2">Year {m.year}</p>
                <p
                  className={`font-display font-bold text-2xl mb-1 ${
                    isFinal ? 'text-accent-gold' : 'text-text-primary'
                  }`}
                >
                  {formatCurrency(m.cumulativeEarnings)}
                </p>
                <p
                  className={`font-display font-semibold text-xs ${
                    isFinal ? 'text-accent-gold' : 'text-text-secondary'
                  }`}
                >
                  {m.roiMultiple.toFixed(2)}x ROI multiple
                </p>
                <p className="mt-2">
                  <span className={`inline-block text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full border ${phasePillClass}`}>
                    {phaseLabel}
                  </span>
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
