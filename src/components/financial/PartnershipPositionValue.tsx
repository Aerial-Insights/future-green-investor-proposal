import { useState } from 'react'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatPercent } from '../../utils/formatPercent'
import { DIVISION_COLORS } from '../../theme/chartTheme'
import type {
  PartnershipPositionValueSummary,
  PartnershipPositionValueMilestone,
  PositionSectorValuation,
  ValuationMultipleRange,
} from '../../data/investorPortal/formulas/types'

// ─── PARTNERSHIP POSITION VALUE — ASSUMPTIONS LAB CARD VIEW ────────────────
// Compact, milestone-driven view of the *enterprise value* of the investor's
// permanent ownership position. Designed to slot inside the partnership panel
// in the lab. Pairs four milestone cards (Y5 / Y10 / Y15 / Y20) with a
// collapsible "View Valuation Math" drawer that exposes division-by-division
// derivation (driver × multiple × ownership) for full transparency.

const SECTOR_META = [
  { key: 'homeServices' as const, label: 'Home Services', color: DIVISION_COLORS.homeServices },
  { key: 'realEstate' as const, label: 'Real Estate', color: DIVISION_COLORS.realEstate },
  { key: 'aerialInsights' as const, label: 'Aerial Insights', color: DIVISION_COLORS.aerialInsights },
]

interface Props {
  summary: PartnershipPositionValueSummary
  /** Heading for the section. Override per surface for context. */
  heading?: string
}

export default function PartnershipPositionValue({
  summary,
  heading = 'Estimated Value of Partnership Position',
}: Props) {
  const [mathOpen, setMathOpen] = useState(false)

  if (summary.milestones.length === 0) return null

  const horizon = summary.milestones[summary.milestones.length - 1]

  return (
    <div className="luxury-card p-6 border border-surface-border/60">
      {/* Header */}
      <div
        className="rounded-xl p-5 mb-5"
        style={{
          background: 'linear-gradient(135deg, #064e3b, #065f46)',
          border: '1px solid #10b981',
        }}
      >
        <p className="text-emerald-200 text-xs uppercase tracking-[0.15em] font-semibold mb-1">
          {heading}
        </p>
        <p className="text-emerald-50 text-[12px] leading-relaxed">
          Because the partnership creates a permanent ownership position, the investor's return
          profile is not limited to annual cash distributions. The estimates below illustrate how
          the investor's stake may compound across Home Services, Real Estate, and Aerial Insights
          if the platform reaches its operating targets — these are planning ranges, not
          guaranteed sale values or appraisals.
        </p>
      </div>

      {/* Milestone cards — Y5 / Y10 / Y15 / Y20 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {summary.milestones.map((m, idx) => {
          const isFinal = idx === summary.milestones.length - 1
          return <MilestoneCard key={m.year} milestone={m} highlighted={isFinal} />
        })}
      </div>

      {/* Footer summary line */}
      <p className="text-text-dim text-[10px] italic mb-4 text-center">
        By Year {horizon.year}, the investor's estimated position value ranges from{' '}
        <span className="text-emerald-300 font-semibold not-italic">
          {formatCurrency(horizon.investorPositionValue.low)}
        </span>{' '}
        to{' '}
        <span className="text-emerald-300 font-semibold not-italic">
          {formatCurrency(horizon.investorPositionValue.high)}
        </span>{' '}
        based on current model assumptions.
      </p>

      {/* View Valuation Math toggle */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setMathOpen((open) => !open)}
          className="inline-flex items-center gap-2 rounded-full border border-accent-gold/30 bg-accent-gold/[0.06] hover:bg-accent-gold/[0.12] hover:border-accent-gold/50 transition-colors duration-200 px-4 py-2"
          aria-expanded={mathOpen}
          aria-controls="position-value-math"
        >
          <span className="text-accent-gold text-xs font-semibold uppercase tracking-wider">
            {mathOpen ? 'Hide Valuation Math' : 'View Valuation Math'}
          </span>
          <span className="text-accent-gold text-xs">{mathOpen ? '▲' : '▼'}</span>
        </button>
      </div>

      {mathOpen && (
        <div id="position-value-math" className="mt-5 pt-5 border-t border-surface-border/40">
          <ValuationMathPanel summary={summary} />
        </div>
      )}
    </div>
  )
}

// ─── MILESTONE CARD ────────────────────────────────────────────────────────

function MilestoneCard({
  milestone,
  highlighted,
}: {
  milestone: PartnershipPositionValueMilestone
  highlighted: boolean
}) {
  const cardStyle = highlighted
    ? {
        background: 'linear-gradient(135deg, #78620a, #a17f1a)',
        borderColor: '#c9a84c',
      }
    : {
        background: 'linear-gradient(135deg, #1e3a5f, #1e4976)',
        borderColor: '#60a5fa',
      }
  const labelClass = highlighted ? 'text-amber-100' : 'text-blue-200'
  const investorClass = highlighted ? 'text-white' : 'text-white'
  const sectors: { label: string; value: number; color: string }[] = [
    { label: 'HS', value: milestone.homeServices.enterpriseValue.base, color: DIVISION_COLORS.homeServices },
    { label: 'RE', value: milestone.realEstate.enterpriseValue.base, color: DIVISION_COLORS.realEstate },
    { label: 'AI', value: milestone.aerialInsights.enterpriseValue.base, color: DIVISION_COLORS.aerialInsights },
  ]
  const totalBase = milestone.totalPlatformValue.base

  return (
    <div
      className="rounded-xl p-4 border text-center flex flex-col gap-2"
      style={cardStyle}
    >
      <p className={`${labelClass} text-[10px] uppercase tracking-wider font-semibold`}>
        Year {milestone.year}
      </p>
      <div>
        <p className={`${labelClass} text-[10px] uppercase tracking-wider mb-0.5`}>
          Total Platform Value
        </p>
        <p className="text-white font-display font-bold text-lg leading-tight">
          {formatCurrency(milestone.totalPlatformValue.base)}
        </p>
        <p className={`${labelClass} text-[10px] mt-0.5`}>
          {formatCurrency(milestone.totalPlatformValue.low)} – {formatCurrency(milestone.totalPlatformValue.high)}
        </p>
      </div>

      {/* Sector breakdown bar */}
      <div className="mt-1">
        <div className="h-1.5 w-full rounded-full overflow-hidden flex bg-black/30">
          {sectors.map((s) => {
            const pct = totalBase > 0 ? (s.value / totalBase) * 100 : 0
            return (
              <div
                key={s.label}
                style={{ width: `${pct}%`, backgroundColor: s.color }}
                title={`${s.label}: ${formatCurrency(s.value)}`}
              />
            )
          })}
        </div>
        <div className={`flex justify-between mt-1 text-[9px] ${labelClass} font-medium`}>
          {sectors.map((s) => (
            <span key={s.label} className="flex items-center gap-1">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Investor position value */}
      <div className="mt-1 pt-2 border-t border-white/15">
        <p className={`${labelClass} text-[10px] uppercase tracking-wider mb-0.5`}>
          Investor Position
        </p>
        <p className={`${investorClass} font-display font-bold text-base leading-tight`}>
          {formatCurrency(milestone.investorPositionValue.base)}
        </p>
        <p className={`${labelClass} text-[10px] mt-0.5`}>
          {formatCurrency(milestone.investorPositionValue.low)} – {formatCurrency(milestone.investorPositionValue.high)}
        </p>
      </div>
    </div>
  )
}

// ─── VALUATION MATH (DETAIL DRAWER) ────────────────────────────────────────

function ValuationMathPanel({ summary }: { summary: PartnershipPositionValueSummary }) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-2">
          Valuation Formula
        </p>
        <div className="rounded-lg bg-surface/50 border border-surface-border/40 p-3 space-y-1.5">
          <FormulaLine
            sector="Home Services"
            color={DIVISION_COLORS.homeServices}
            text="EBITDA × 2.0 – 4.0×"
          />
          <FormulaLine
            sector="Real Estate"
            color={DIVISION_COLORS.realEstate}
            text="EBITDA × 2.0 – 3.0×  (includes Solar Operations)"
          />
          <FormulaLine
            sector="Aerial Insights"
            color={DIVISION_COLORS.aerialInsights}
            text="Annual Revenue / ARR × 5.0 – 7.0×  (SaaS multiple)"
          />
          <p className="text-text-muted text-[11px] pt-1.5 border-t border-surface-border/30 mt-1">
            Total Platform Value = Σ Enterprise Values · Investor Position Value =
            Σ (Sector EV × Sector Ownership %)
          </p>
        </div>
      </div>

      {/* Per-milestone math tables */}
      <div className="space-y-4">
        {summary.milestones.map((m) => (
          <MilestoneMathTable key={m.year} milestone={m} />
        ))}
      </div>

      <p className="text-text-dim text-[10px] italic">
        Operating profit is used as an EBITDA proxy in the underlying model. Multiples are
        illustrative planning ranges drawn from typical small-mid-cap home services, real estate,
        and SaaS comparables; they are not appraisals or guaranteed sale values.
      </p>
    </div>
  )
}

function FormulaLine({
  sector,
  color,
  text,
}: {
  sector: string
  color: string
  text: string
}) {
  return (
    <p className="text-text-secondary text-[11px] flex items-center gap-2">
      <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-text-primary font-semibold">{sector}:</span> {text}
    </p>
  )
}

function MilestoneMathTable({ milestone }: { milestone: PartnershipPositionValueMilestone }) {
  const rows: { meta: typeof SECTOR_META[number]; sector: PositionSectorValuation }[] = [
    { meta: SECTOR_META[0], sector: milestone.homeServices },
    { meta: SECTOR_META[1], sector: milestone.realEstate },
    { meta: SECTOR_META[2], sector: milestone.aerialInsights },
  ]

  return (
    <div className="rounded-lg bg-surface/30 border border-surface-border/40 p-3">
      <div className="flex items-baseline justify-between mb-2">
        <p className="text-text-primary text-sm font-display font-semibold">Year {milestone.year}</p>
        <p className="text-text-muted text-[10px]">
          Blended ownership ≈{' '}
          <span className="text-accent-gold font-semibold">
            {formatPercent(milestone.blendedOwnershipPercent.base)}
          </span>
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-surface-border/40">
              <th className="text-left py-1.5 px-2 text-text-muted font-medium">Sector</th>
              <th className="text-right py-1.5 px-2 text-text-muted font-medium">Driver</th>
              <th className="text-right py-1.5 px-2 text-text-muted font-medium">Multiple</th>
              <th className="text-right py-1.5 px-2 text-text-muted font-medium">EV (Base)</th>
              <th className="text-right py-1.5 px-2 text-text-muted font-medium">Ownership</th>
              <th className="text-right py-1.5 px-2 text-text-muted font-medium">
                Investor Value (Low – High)
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ meta, sector }) => (
              <tr key={meta.key} className="border-b border-surface-border/20">
                <td className="py-1.5 px-2">
                  <span className="flex items-center gap-2 text-text-primary">
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ backgroundColor: meta.color }}
                    />
                    <span className="font-medium">{meta.label}</span>
                  </span>
                </td>
                <td className="text-right py-1.5 px-2 text-text-secondary">
                  {formatCurrency(sector.driver)}{' '}
                  <span className="text-text-dim text-[9px]">{sector.driverLabel}</span>
                </td>
                <td className="text-right py-1.5 px-2 text-text-secondary">
                  {sector.multiple.low.toFixed(1)} – {sector.multiple.high.toFixed(1)}×
                </td>
                <td className="text-right py-1.5 px-2 text-text-primary font-medium">
                  {formatCurrency(sector.enterpriseValue.base)}
                </td>
                <td className="text-right py-1.5 px-2 text-text-secondary">
                  {formatPercent(sector.ownershipShare)}
                </td>
                <td className="text-right py-1.5 px-2 text-emerald-300 font-display font-semibold">
                  {formatCurrency(sector.investorPositionValue.low)} –{' '}
                  {formatCurrency(sector.investorPositionValue.high)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-accent-gold/30">
              <td className="py-2 px-2 text-accent-gold font-display font-semibold">Total</td>
              <td colSpan={2} className="py-2 px-2 text-right text-text-muted text-[10px]">
                Platform value range
              </td>
              <td className="text-right py-2 px-2 text-text-primary font-display font-bold">
                {formatCurrency(milestone.totalPlatformValue.base)}
              </td>
              <td className="text-right py-2 px-2 text-text-muted text-[10px]">
                {formatPercent(milestone.blendedOwnershipPercent.base)}
              </td>
              <td className="text-right py-2 px-2 text-emerald-300 font-display font-bold">
                {formatCurrency(milestone.investorPositionValue.low)} –{' '}
                {formatCurrency(milestone.investorPositionValue.high)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

// Re-export the math panel for surfaces that want to embed it standalone
export { ValuationMathPanel }
export type { ValuationMultipleRange }
