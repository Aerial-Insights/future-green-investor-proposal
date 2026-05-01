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
  ResponsiveContainer,
} from 'recharts'
import { useChartTheme, DIVISION_COLORS, CHART_ANIMATION } from '../../../theme/chartTheme'
import { formatCurrency } from '../../../utils/formatCurrency'
import { formatPercent } from '../../../utils/formatPercent'
import { ValuationMathPanel } from '../../../components/financial/PartnershipPositionValue'
import type { PartnershipPositionValueSummary } from '../../../data/investorPortal/formulas/types'

// ─── PARTNERSHIP POSITION VALUE OVER TIME ─────────────────────────────────
// Investor-facing milestone view for the Financials page. Shows:
//   • A stacked-bar timeline of platform enterprise value (HS / RE / Aerial)
//     across Y5 / Y10 / Y15 / Y20, with the investor's position highlighted
//     as an overlay line.
//   • A detail table with sector EVs, total platform value, ownership %,
//     and Low / Base / High investor position ranges.
//   • The same shared ValuationMathPanel used in the Assumptions Lab so the
//     math is identical across surfaces.

interface Props {
  summary: PartnershipPositionValueSummary
}

export default function PartnershipPositionValueOverTime({ summary }: Props) {
  const { axisStyle, tooltipStyle, gridStyle, legendStyle } = useChartTheme()

  if (summary.milestones.length === 0) return null

  const horizon = summary.milestones[summary.milestones.length - 1]

  // Chart data — one row per milestone, base-case sector EVs stacked
  const chartData = summary.milestones.map((m) => ({
    name: `Year ${m.year}`,
    'Home Services': m.homeServices.enterpriseValue.base,
    'Real Estate': m.realEstate.enterpriseValue.base,
    'Aerial Insights': m.aerialInsights.enterpriseValue.base,
    'Investor Position': m.investorPositionValue.base,
  }))

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
      aria-labelledby="position-value-over-time-heading"
    >
      {/* Header card */}
      <div className="luxury-card p-6 md:p-8">
        <div className="flex items-baseline justify-between gap-4 flex-wrap mb-4">
          <h3
            id="position-value-over-time-heading"
            className="font-display font-bold text-text-primary text-xl md:text-2xl"
          >
            Partnership Position Value Over Time
          </h3>
          <span className="text-text-muted text-xs">
            Illustrative · planning ranges · not an appraisal
          </span>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed mb-2 max-w-3xl">
          Because the partnership structure creates a permanent ownership position, the investor's
          return profile is not limited to annual cash distributions. As each division scales, the
          investor also participates in the estimated enterprise value created across Home
          Services, Real Estate, and Aerial Insights.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-6 max-w-3xl">
          Home Services and Real Estate are valued using conservative EBITDA multiple ranges,
          while Aerial Insights is valued using a revenue-based SaaS multiple range. These
          valuation ranges are illustrative and are intended to show how the investor's ownership
          position may compound over time if the platform reaches its operating targets.
        </p>

        {/* Headline metric strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {summary.milestones.map((m, idx) => {
            const isFinal = idx === summary.milestones.length - 1
            return (
              <div
                key={m.year}
                className={`rounded-xl p-4 border ${
                  isFinal
                    ? 'bg-accent-gold/10 border-accent-gold/40'
                    : 'bg-surface/40 border-surface-border/50'
                }`}
              >
                <p className="text-text-muted text-[10px] uppercase tracking-wider mb-1">
                  Year {m.year} · Investor Position
                </p>
                <p
                  className={`font-display font-bold text-lg ${
                    isFinal ? 'text-accent-gold' : 'text-text-primary'
                  }`}
                >
                  {formatCurrency(m.investorPositionValue.base)}
                </p>
                <p className="text-text-secondary text-[10px] mt-0.5">
                  {formatCurrency(m.investorPositionValue.low)} –{' '}
                  {formatCurrency(m.investorPositionValue.high)}
                </p>
                <p className="text-text-muted text-[9px] mt-1">
                  Platform: {formatCurrency(m.totalPlatformValue.base)}
                </p>
              </div>
            )
          })}
        </div>

        {/* Stacked-bar timeline */}
        <div className="rounded-lg bg-surface/40 border border-surface-border/40 p-3">
          <ResponsiveContainer width="100%" height={360}>
            <ComposedChart data={chartData} margin={{ top: 16, right: 24, left: 8, bottom: 0 }}>
              <CartesianGrid {...gridStyle} />
              <XAxis dataKey="name" {...axisStyle} />
              <YAxis
                yAxisId="left"
                {...axisStyle}
                tickFormatter={(v: number) => formatCurrency(v)}
                label={{
                  value: 'Estimated Enterprise Value',
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
                  value: 'Investor Position',
                  angle: 90,
                  position: 'insideRight',
                  style: { fill: axisStyle.fill, fontSize: 10 },
                }}
              />
              <Tooltip {...tooltipStyle} formatter={(value: number) => formatCurrency(value, false)} />
              <Legend wrapperStyle={legendStyle} />
              <Bar
                yAxisId="left"
                dataKey="Home Services"
                stackId="platform"
                fill={DIVISION_COLORS.homeServices}
                animationDuration={CHART_ANIMATION.duration}
              />
              <Bar
                yAxisId="left"
                dataKey="Real Estate"
                stackId="platform"
                fill={DIVISION_COLORS.realEstate}
                animationDuration={CHART_ANIMATION.duration}
              />
              <Bar
                yAxisId="left"
                dataKey="Aerial Insights"
                stackId="platform"
                fill={DIVISION_COLORS.aerialInsights}
                radius={[4, 4, 0, 0]}
                animationDuration={CHART_ANIMATION.duration}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="Investor Position"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 5, stroke: '#064e3b', strokeWidth: 2 }}
                activeDot={{ r: 7 }}
                animationDuration={CHART_ANIMATION.duration}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <p className="text-text-dim text-[10px] italic mt-4">
          Bars stack the estimated enterprise value across Home Services, Real Estate (incl. Solar
          Operations), and Aerial Insights at base-case multiples. The green line overlays the
          investor's estimated position value at each milestone.
        </p>
      </div>

      {/* Detail table */}
      <div className="luxury-card p-6 md:p-8">
        <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
          <h4 className="font-display font-semibold text-text-primary text-base">
            Detail by Milestone Year
          </h4>
          <span className="text-text-muted text-xs">
            Driven live by the operating model · adjust assumptions to update
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ minWidth: 920 }}>
            <thead>
              <tr className="border-b-2 border-surface-border">
                <th className="text-left py-3 pl-2 pr-4 text-text-muted text-xs uppercase tracking-wider font-semibold">
                  Year
                </th>
                <th className="text-right py-3 px-2 text-text-muted text-xs uppercase tracking-wider font-semibold">
                  Home Services
                </th>
                <th className="text-right py-3 px-2 text-text-muted text-xs uppercase tracking-wider font-semibold">
                  Real Estate
                </th>
                <th className="text-right py-3 px-2 text-text-muted text-xs uppercase tracking-wider font-semibold">
                  Aerial Insights
                </th>
                <th className="text-right py-3 px-2 text-text-muted text-xs uppercase tracking-wider font-semibold">
                  Total Platform
                </th>
                <th className="text-right py-3 px-2 text-text-muted text-xs uppercase tracking-wider font-semibold">
                  Ownership
                </th>
                <th className="text-right py-3 pl-2 pr-2 text-text-muted text-xs uppercase tracking-wider font-semibold">
                  Investor Position (Low – Base – High)
                </th>
              </tr>
            </thead>
            <tbody>
              {summary.milestones.map((m, idx) => {
                const isFinal = idx === summary.milestones.length - 1
                return (
                  <tr
                    key={m.year}
                    className={`border-b ${
                      isFinal ? 'border-accent-gold/30 bg-accent-gold/[0.04]' : 'border-surface-border/40'
                    }`}
                  >
                    <td className="py-3 pl-2 pr-4">
                      <span className="text-text-primary font-display font-semibold">
                        Year {m.year}
                      </span>
                    </td>
                    <td className="text-right py-3 px-2 text-text-primary">
                      {formatCurrency(m.homeServices.enterpriseValue.base)}
                    </td>
                    <td className="text-right py-3 px-2 text-text-primary">
                      {formatCurrency(m.realEstate.enterpriseValue.base)}
                    </td>
                    <td className="text-right py-3 px-2 text-text-primary">
                      {formatCurrency(m.aerialInsights.enterpriseValue.base)}
                    </td>
                    <td className="text-right py-3 px-2 text-text-primary font-display font-semibold">
                      {formatCurrency(m.totalPlatformValue.base)}
                    </td>
                    <td className="text-right py-3 px-2 text-text-secondary">
                      {formatPercent(m.blendedOwnershipPercent.base)}
                    </td>
                    <td className="text-right py-3 pl-2 pr-2 text-emerald-300 font-display font-bold">
                      {formatCurrency(m.investorPositionValue.low)} ·{' '}
                      <span className="text-emerald-200">
                        {formatCurrency(m.investorPositionValue.base)}
                      </span>{' '}
                      · {formatCurrency(m.investorPositionValue.high)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-accent-gold/30">
                <td colSpan={4} className="py-3 pl-2 pr-2 text-text-muted text-[11px] italic">
                  By Year {horizon.year}, estimated platform value reaches{' '}
                  <span className="text-text-primary font-semibold">
                    {formatCurrency(horizon.totalPlatformValue.base)}
                  </span>{' '}
                  (base case)
                </td>
                <td className="text-right py-3 px-2 text-accent-gold font-display font-bold">
                  {formatCurrency(horizon.totalPlatformValue.base)}
                </td>
                <td className="text-right py-3 px-2 text-text-secondary">
                  {formatPercent(horizon.blendedOwnershipPercent.base)}
                </td>
                <td className="text-right py-3 pl-2 pr-2 text-emerald-300 font-display font-bold">
                  {formatCurrency(horizon.investorPositionValue.low)} –{' '}
                  {formatCurrency(horizon.investorPositionValue.high)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="text-text-dim text-[10px] italic mt-4">
          Estimated values use the same assumptions shown in the Assumptions Lab. They reflect
          potential position value based on current model assumptions and are not guaranteed.
        </p>
      </div>

      {/* Shared valuation math drawer (collapsible) */}
      <div className="luxury-card p-6 md:p-8">
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer list-none">
            <div>
              <p className="text-accent-gold text-xs uppercase tracking-[0.15em] font-semibold mb-1">
                Valuation Methodology & Math
              </p>
              <p className="text-text-secondary text-xs">
                Division-by-division derivation, multiple ranges, and ownership applied
              </p>
            </div>
            <span className="text-accent-gold text-xs font-semibold uppercase tracking-wider group-open:hidden">
              ▼ Show
            </span>
            <span className="text-accent-gold text-xs font-semibold uppercase tracking-wider hidden group-open:inline">
              ▲ Hide
            </span>
          </summary>
          <div className="mt-5 pt-5 border-t border-surface-border/40">
            <ValuationMathPanel summary={summary} />
          </div>
        </details>
      </div>
    </motion.section>
  )
}
