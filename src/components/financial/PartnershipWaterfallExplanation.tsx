import { motion } from 'framer-motion'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatPercent } from '../../utils/formatPercent'
import type { PartnershipReturnSummary } from '../../data/investorPortal/formulas/types'
import type { PartnershipOptionConfig } from '../../data/investorPortal/baseAssumptions'

// ─── PARTNERSHIP RETURN WATERFALL — INVESTOR-FACING CALLOUT ─────────────────
// Single shared explanation surface used on both the Financial Model page and
// the Assumptions Lab. Reads exclusively from PartnershipReturnSummary so the
// numbers always reconcile to the milestone cards, charts, and tables.

interface Props {
  summary: PartnershipReturnSummary
  config: PartnershipOptionConfig
  /** Optional heading override — default: "Partnership Return Waterfall". */
  heading?: string
  /** Render a slimmer variant inside the assumptions lab right column. */
  compact?: boolean
}

export default function PartnershipWaterfallExplanation({
  summary,
  config,
  heading = 'Partnership Return Waterfall',
  compact = false,
}: Props) {
  const horizonRow = summary.annualReturns[summary.annualReturns.length - 1]
  const horizonYear = horizonRow?.year ?? config.timeHorizonYears
  const cumulativePostThreshold = summary.postThresholdTotals.total

  const thresholdYearLabel = summary.thresholdYear
    ? summary.thresholdYearFractional !== null && summary.thresholdYearFractional !== summary.thresholdYear
      ? `Year ${summary.thresholdYear} (mid-year crossing at ~${summary.thresholdYearFractional.toFixed(1)})`
      : `Year ${summary.thresholdYear}`
    : `Beyond Year ${horizonYear}`

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      aria-labelledby="partnership-waterfall-heading"
    >
      <div className={`luxury-card ${compact ? 'p-5' : 'p-6 md:p-8'} border border-accent-gold/20`}>
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
          <div>
            <p className="text-accent-gold text-xs uppercase tracking-[0.15em] font-semibold mb-1">
              Two-Phase Return Structure
            </p>
            <h3
              id="partnership-waterfall-heading"
              className={`font-display font-bold text-text-primary ${compact ? 'text-lg' : 'text-xl md:text-2xl'}`}
            >
              {heading}
            </h3>
          </div>
          <span className="text-text-muted text-xs">
            All figures live — driven by current model inputs
          </span>
        </div>

        <p className={`text-text-secondary leading-relaxed mb-6 max-w-3xl ${compact ? 'text-xs' : 'text-sm'}`}>
          The partnership option is structured with an initial return phase and a permanent ownership phase.
          During the initial phase, the investor participates at the primary partnership percentage until the
          target return threshold is reached. After the threshold is achieved, the partnership converts to a
          permanent long-term profit-share position across the operating platform.
        </p>

        {/* Phase definitions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Initial phase */}
          <div className="rounded-xl p-5 border border-accent-gold/30 bg-gradient-to-br from-amber-900/15 via-surface/40 to-surface/40">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-accent-gold" />
              <p className="text-accent-gold text-[11px] uppercase tracking-[0.15em] font-semibold">
                Initial Return Phase
              </p>
            </div>
            <p className="text-text-secondary text-xs leading-relaxed mb-4">
              Applies until the target return threshold of{' '}
              <span className="text-text-primary font-semibold">
                {summary.returnThresholdMultiple.toFixed(2)}x
              </span>{' '}
              ({formatCurrency(summary.thresholdTarget)}) is reached.
            </p>
            <div className="space-y-2">
              <PhaseRow label="Home Services" value={formatPercent(config.homeServicesShare)} />
              <PhaseRow label="Real Estate (Solar + RE)" value={formatPercent(config.realEstateShare)} />
              <PhaseRow label="Aerial Insights" value={formatPercent(config.aerialInsightsShare)} />
            </div>
          </div>

          {/* Permanent phase */}
          <div className="rounded-xl p-5 border border-surface-border/60 bg-surface/40">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <p className="text-emerald-300 text-[11px] uppercase tracking-[0.15em] font-semibold">
                Permanent Long-Term Phase
              </p>
            </div>
            <p className="text-text-secondary text-xs leading-relaxed mb-4">
              Begins after the threshold is reached and continues for the remainder of the {horizonYear}-year
              partnership horizon as a permanent long-term profit share.
            </p>
            <div className="space-y-2">
              <PhaseRow
                label="Home Services"
                value={formatPercent(config.postThresholdHomeServicesShare)}
                muted
              />
              <PhaseRow
                label="Real Estate (Solar + RE)"
                value={formatPercent(config.postThresholdRealEstateShare)}
                muted
              />
              <PhaseRow
                label="Aerial Insights"
                value={formatPercent(config.postThresholdAerialInsightsShare)}
                muted
              />
            </div>
          </div>
        </div>

        {/* Modeled outcomes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <OutcomeTile
            label="Estimated Threshold Year"
            value={thresholdYearLabel}
            primary
          />
          <OutcomeTile
            label="Total Return at Threshold"
            value={formatCurrency(summary.thresholdReturnAmount)}
            sub={
              summary.thresholdReached
                ? `${summary.returnThresholdMultiple.toFixed(2)}x of ${formatCurrency(summary.totalCapital)}`
                : 'Threshold not modeled within horizon'
            }
          />
          <OutcomeTile
            label="Post-Threshold Annual Share"
            value={
              summary.postThresholdAnnualEstimate > 0
                ? formatCurrency(summary.postThresholdAnnualEstimate)
                : '—'
            }
            sub="First full permanent-phase year"
          />
          <OutcomeTile
            label="Post-Threshold Cumulative"
            value={formatCurrency(cumulativePostThreshold)}
            sub={`Through Year ${horizonYear}`}
          />
        </div>

        <p className="text-text-dim text-[10px] italic mt-5">
          Modeled return only — not a guarantee. The threshold trigger and step-down percentages are editable in
          the unlocked assumptions panel and update every chart, table, and milestone in real time.
        </p>
      </div>
    </motion.section>
  )
}

function PhaseRow({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-text-secondary">{label}</span>
      <span className={`font-display font-semibold ${muted ? 'text-emerald-300' : 'text-accent-gold'}`}>
        {value}
      </span>
    </div>
  )
}

function OutcomeTile({
  label,
  value,
  sub,
  primary,
}: {
  label: string
  value: string
  sub?: string
  primary?: boolean
}) {
  return (
    <div
      className={`rounded-xl p-4 border ${
        primary ? 'bg-accent-gold/10 border-accent-gold/40' : 'bg-surface/40 border-surface-border/50'
      }`}
    >
      <p className="text-text-muted text-[10px] uppercase tracking-wider mb-1.5">{label}</p>
      <p
        className={`font-display font-bold text-base leading-tight ${
          primary ? 'text-accent-gold' : 'text-text-primary'
        }`}
      >
        {value}
      </p>
      {sub && <p className="text-text-dim text-[10px] mt-1 leading-snug">{sub}</p>}
    </div>
  )
}
