import { motion } from 'framer-motion'
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import { useChartTheme, DIVISION_COLORS, CHART_ANIMATION } from '../../theme/chartTheme'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatPercent } from '../../utils/formatPercent'
import type { PartnershipReturnSummary } from '../../data/investorPortal/formulas/types'

// ─── YEAR-BY-YEAR PARTNERSHIP EARNINGS ────────────────────────────────────
// Single source of truth for the year-by-year sector breakdown of partnership
// investor earnings. Used on both the Financial Model page and inside the
// Assumptions Lab dropdown so the two surfaces stay in lockstep.
//
// All values come from the existing PartnershipReturnSummary so the totals
// ALWAYS sum back to summary.totalEarnings — the chart and table are pure
// presentations of the same numbers powering the milestone cards.

interface SectorConfig {
  key: 'homeServicesEarnings' | 'realEstateEarnings' | 'solarEnergyEarnings' | 'aerialEarnings'
  label: string
  shortLabel: string
  color: string
}

const SECTORS: SectorConfig[] = [
  { key: 'homeServicesEarnings', label: 'Home Services', shortLabel: 'Home Services', color: DIVISION_COLORS.homeServices },
  { key: 'realEstateEarnings', label: 'Real Estate / Subdivide', shortLabel: 'Real Estate', color: DIVISION_COLORS.realEstate },
  { key: 'solarEnergyEarnings', label: 'Solar / SREC / Energy', shortLabel: 'Solar / Energy', color: DIVISION_COLORS.solar },
  { key: 'aerialEarnings', label: 'Aerial Insights / SaaS', shortLabel: 'Aerial Insights', color: DIVISION_COLORS.aerialInsights },
]

interface Props {
  summary: PartnershipReturnSummary
  /** Optional heading override for surfaces that already have a parent label. */
  heading?: string
  /** Optional intro override. Pass null to suppress the default intro paragraph. */
  intro?: string | null
  /** Render a slimmer chart in tighter contexts (assumptions lab dropdown). */
  compact?: boolean
}

export default function PartnershipYearlyEarnings({
  summary,
  heading = 'Year-by-Year Partnership Earnings',
  intro,
  compact = false,
}: Props) {
  const { axisStyle, tooltipStyle, gridStyle, legendStyle } = useChartTheme()

  const chartData = summary.annualReturns.map((r) => ({
    name: `Y${r.year}`,
    'Home Services': r.homeServicesEarnings,
    'Real Estate': r.realEstateEarnings,
    'Solar / Energy': r.solarEnergyEarnings,
    'Aerial Insights': r.aerialEarnings,
    Cumulative: r.cumulativeEarnings,
    activePhase: r.activePhase,
  }))

  const horizonYear = summary.annualReturns[summary.annualReturns.length - 1]?.year ?? 20
  const horizonRow = summary.annualReturns[summary.annualReturns.length - 1]

  // X-axis position for threshold marker — chart x is "Yn" (one tick per year),
  // so the closest-integer year provides a clean reference line on the bar chart.
  const thresholdMarkerYear = summary.thresholdYear
  const thresholdMarkerLabel = thresholdMarkerYear ? `Y${thresholdMarkerYear}` : null

  const introText =
    intro === null
      ? null
      : intro ??
        `The headline ${formatCurrency(summary.totalEarnings)} long-term return is built year by year across four operating sectors. ` +
          `Rather than appearing as one large unexplained figure, the breakdown below shows exactly how earnings ramp through ` +
          `Year ${horizonYear} and how each sector contributes annually and cumulatively.`

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-6"
      aria-labelledby="partnership-yearly-heading"
    >
      <div className="luxury-card p-6 md:p-8">
        <div className="flex items-baseline justify-between gap-4 flex-wrap mb-4">
          <h3
            id="partnership-yearly-heading"
            className="font-display font-bold text-text-primary text-xl md:text-2xl"
          >
            {heading}
          </h3>
          <span className="text-text-muted text-xs">
            {horizonYear}-year horizon · totals reconcile to {formatCurrency(summary.totalEarnings)}
          </span>
        </div>
        {introText && (
          <p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-3xl">
            {introText}
          </p>
        )}

        {/* Headline metric strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-surface/40 border border-surface-border/50 rounded-xl p-4">
            <p className="text-text-muted text-[10px] uppercase tracking-wider mb-1">Year 1 Earnings</p>
            <p className="text-text-primary font-display font-bold text-lg">
              {formatCurrency(summary.annualReturns[0]?.totalEarnings ?? 0)}
            </p>
          </div>
          <div className="bg-surface/40 border border-surface-border/50 rounded-xl p-4">
            <p className="text-text-muted text-[10px] uppercase tracking-wider mb-1">Year 10 Earnings</p>
            <p className="text-text-primary font-display font-bold text-lg">
              {formatCurrency(summary.annualReturns.find((r) => r.year === 10)?.totalEarnings ?? 0)}
            </p>
          </div>
          <div className="bg-surface/40 border border-surface-border/50 rounded-xl p-4">
            <p className="text-text-muted text-[10px] uppercase tracking-wider mb-1">Year {horizonYear} Earnings</p>
            <p className="text-text-primary font-display font-bold text-lg">
              {formatCurrency(horizonRow?.totalEarnings ?? 0)}
            </p>
          </div>
          <div className="bg-surface/40 border border-accent-gold/30 rounded-xl p-4">
            <p className="text-text-muted text-[10px] uppercase tracking-wider mb-1">Cumulative by Y{horizonYear}</p>
            <p className="text-accent-gold font-display font-bold text-lg">
              {formatCurrency(summary.totalEarnings)}
            </p>
          </div>
        </div>

        {/* Stacked bar (annual sector earnings) + cumulative line */}
        <div className="rounded-lg bg-surface/40 border border-surface-border/40 p-3">
          <ResponsiveContainer width="100%" height={compact ? 320 : 380}>
            <ComposedChart data={chartData} margin={{ top: 10, right: 24, left: 8, bottom: 0 }}>
              <CartesianGrid {...gridStyle} />
              <XAxis dataKey="name" {...axisStyle} />
              <YAxis
                yAxisId="left"
                {...axisStyle}
                tickFormatter={(v: number) => formatCurrency(v)}
                label={{
                  value: 'Annual Earnings',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: axisStyle.fill, fontSize: 10 },
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                {...axisStyle}
                tickFormatter={(v: number) => formatCurrency(v)}
                label={{
                  value: 'Cumulative',
                  angle: 90,
                  position: 'insideRight',
                  style: { fill: axisStyle.fill, fontSize: 10 },
                }}
              />
              <Tooltip
                {...tooltipStyle}
                formatter={(value: number) => formatCurrency(value, false)}
              />
              <Legend wrapperStyle={legendStyle} />
              {thresholdMarkerLabel && (
                <ReferenceLine
                  yAxisId="left"
                  x={thresholdMarkerLabel}
                  stroke="#10b981"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  label={{
                    value: `Threshold reached`,
                    position: 'top',
                    fill: '#10b981',
                    fontSize: 10,
                    fontWeight: 600,
                  }}
                />
              )}
              {SECTORS.map((sector, i) => (
                <Bar
                  key={sector.key}
                  yAxisId="left"
                  dataKey={sector.shortLabel}
                  name={sector.shortLabel}
                  stackId="earnings"
                  fill={sector.color}
                  radius={i === SECTORS.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                  animationDuration={CHART_ANIMATION.duration}
                />
              ))}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="Cumulative"
                stroke="#c9a84c"
                strokeWidth={2.5}
                dot={{ fill: '#c9a84c', r: 3, stroke: '#78620a', strokeWidth: 1.5 }}
                activeDot={{ r: 5 }}
                animationDuration={CHART_ANIMATION.duration}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detail table */}
      <div className="luxury-card overflow-x-auto">
        <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
          <h4 className="font-display font-semibold text-text-primary text-base">
            Annual Earnings by Sector
          </h4>
          <span className="text-text-muted text-xs">
            Phase, applied %, and earnings — all from the same waterfall calculation
          </span>
        </div>
        <table className="w-full text-sm" style={{ minWidth: 1180 }}>
          <thead>
            <tr className="border-b-2 border-surface-border">
              <th className="text-left text-text-muted font-semibold py-3 pl-2 pr-4 text-xs uppercase tracking-wider">
                Year
              </th>
              {SECTORS.map((s) => (
                <th
                  key={s.key}
                  className="text-right text-text-muted font-semibold py-3 px-2 text-xs uppercase tracking-wider"
                >
                  {s.shortLabel}
                </th>
              ))}
              <th className="text-right text-text-muted font-semibold py-3 px-2 text-xs uppercase tracking-wider">
                Annual Total
              </th>
              <th className="text-right text-text-muted font-semibold py-3 px-2 text-xs uppercase tracking-wider">
                Cumulative
              </th>
              <th className="text-left text-text-muted font-semibold py-3 px-2 text-xs uppercase tracking-wider">
                Active Phase
              </th>
              <th className="text-right text-text-muted font-semibold py-3 px-2 text-xs uppercase tracking-wider">
                HS %
              </th>
              <th className="text-right text-text-muted font-semibold py-3 px-2 text-xs uppercase tracking-wider">
                RE %
              </th>
              <th className="text-right text-text-muted font-semibold py-3 pl-2 pr-2 text-xs uppercase tracking-wider">
                AI %
              </th>
            </tr>
          </thead>
          <tbody>
            {summary.annualReturns.map((r) => {
              const isMilestone = [5, 10, 15, 20].includes(r.year)
              const phaseLabel =
                r.activePhase === 'initial'
                  ? 'Initial'
                  : r.activePhase === 'permanent'
                    ? 'Permanent'
                    : 'Threshold'
              const phaseColor =
                r.activePhase === 'initial'
                  ? 'text-accent-gold bg-accent-gold/10 border-accent-gold/30'
                  : r.activePhase === 'permanent'
                    ? 'text-emerald-300 bg-emerald-700/15 border-emerald-500/30'
                    : 'text-amber-100 bg-amber-700/30 border-amber-400/40'
              return (
                <tr
                  key={r.year}
                  className={`border-b ${
                    isMilestone
                      ? 'border-accent-gold/30 bg-accent-gold/[0.04]'
                      : 'border-surface-border/40'
                  }`}
                >
                  <td className="py-3 pl-2 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-text-primary font-display font-semibold">Year {r.year}</span>
                      {r.isExtrapolated && (
                        <span className="text-[9px] uppercase tracking-wider text-text-dim">proj.</span>
                      )}
                    </div>
                  </td>
                  <td className="text-right text-text-primary py-3 px-2 font-medium">
                    {formatCurrency(r.homeServicesEarnings)}
                  </td>
                  <td className="text-right text-text-primary py-3 px-2 font-medium">
                    {formatCurrency(r.realEstateEarnings)}
                  </td>
                  <td className="text-right text-text-primary py-3 px-2 font-medium">
                    {formatCurrency(r.solarEnergyEarnings)}
                  </td>
                  <td className="text-right text-text-primary py-3 px-2 font-medium">
                    {formatCurrency(r.aerialEarnings)}
                  </td>
                  <td className="text-right text-text-primary py-3 px-2 font-display font-semibold">
                    {formatCurrency(r.totalEarnings)}
                  </td>
                  <td className="text-right text-accent-gold py-3 px-2 font-display font-bold">
                    {formatCurrency(r.cumulativeEarnings)}
                  </td>
                  <td className="py-3 px-2">
                    <span className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${phaseColor}`}>
                      {phaseLabel}
                    </span>
                  </td>
                  <td className="text-right text-text-secondary py-3 px-2 font-medium">
                    {formatPercent(r.appliedHomeServicesShare)}
                  </td>
                  <td className="text-right text-text-secondary py-3 px-2 font-medium">
                    {formatPercent(r.appliedRealEstateShare)}
                  </td>
                  <td className="text-right text-text-secondary py-3 pl-2 pr-2 font-medium">
                    {formatPercent(r.appliedAerialInsightsShare)}
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-accent-gold/30">
              <td className="py-4 pl-2 pr-4">
                <span className="text-accent-gold font-display font-bold">Total</span>
              </td>
              <td className="text-right text-text-primary py-4 px-2 font-display font-semibold">
                {formatCurrency(summary.divisionContribution.homeServices)}
              </td>
              <td className="text-right text-text-primary py-4 px-2 font-display font-semibold">
                {formatCurrency(summary.divisionContribution.realEstate)}
              </td>
              <td className="text-right text-text-primary py-4 px-2 font-display font-semibold">
                {formatCurrency(summary.divisionContribution.solarEnergy)}
              </td>
              <td className="text-right text-text-primary py-4 px-2 font-display font-semibold">
                {formatCurrency(summary.divisionContribution.aerial)}
              </td>
              <td className="text-right text-accent-gold py-4 px-2 font-display font-bold text-lg">
                {formatCurrency(summary.totalEarnings)}
              </td>
              <td colSpan={5} />
            </tr>
          </tfoot>
        </table>
        <p className="text-text-dim text-[10px] italic mt-4">
          Annual sector earnings sum exactly to {formatCurrency(summary.totalEarnings)} cumulative — the same total shown
          on the milestone cards. Pre-threshold earnings: {formatCurrency(summary.preThresholdTotals.total)}; post-threshold
          earnings: {formatCurrency(summary.postThresholdTotals.total)}. Adjust any assumption to see all values update in real time.
        </p>
      </div>
    </motion.section>
  )
}
