import { useState } from 'react'
import MetricCard from '../data-display/MetricCard'
import { formatCurrency } from '../../utils/formatCurrency'
import { useChartTheme } from '../../theme/chartTheme'
import type { AerialResidualSummary } from '../../data/investorPortal/formulas/types'
import {
  ComposedChart, Bar as RechartsBar, Line as RechartsLine,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

interface Props {
  residuals: AerialResidualSummary
}

export default function AerialResidualsBreakdown({ residuals }: Props) {
  const { axisStyle, tooltipStyle, gridStyle } = useChartTheme()
  const [methodologyOpen, setMethodologyOpen] = useState(false)

  const y1to5 = residuals.yearlyBreakdown.filter((y) => !y.isContinuation)
  const y6to10 = residuals.yearlyBreakdown.filter((y) => y.isContinuation)

  const totalY1to5Revenue = y1to5.reduce((s, y) => s + y.annualRevenue, 0)
  const totalY6to10Revenue = y6to10.reduce((s, y) => s + y.annualRevenue, 0)
  const totalY1to5Profit = y1to5.reduce((s, y) => s + y.aerialProfit, 0)
  const totalY6to10Profit = y6to10.reduce((s, y) => s + y.aerialProfit, 0)

  // Chart data: all 10 years
  // The line always shows the 3% residual of profit for a consistent trajectory.
  // This avoids the visual discontinuity when the rate transitions from 10% to 3%.
  const chartData = residuals.yearlyBreakdown.map((y) => ({
    name: `Y${y.year}`,
    'Annual Revenue': y.annualRevenue,
    'Investor 3% Residual': Math.max(0, y.aerialProfit * 0.03),
  }))

  const ev = residuals.exitValuation

  return (
    <div className="luxury-card p-6 border border-surface-border/60">
      {/* Header */}
      <div
        className="rounded-xl p-5 mb-5"
        style={{
          background: 'linear-gradient(135deg, #312e81, #4338ca)',
          border: '1px solid rgba(99, 102, 241, 0.4)',
        }}
      >
        <p className="text-indigo-100 text-xs uppercase tracking-[0.15em] font-semibold mb-1">
          Aerial Insights Residual Economics
        </p>
        <p className="text-indigo-200/70 text-[11px] leading-relaxed">
          Post-threshold, the investor retains a permanent 3% residual of Aerial Insights net profit
          plus 3% participation in any company sale event. The following breakdown shows the operational
          drivers, 10-year continuation economics, and projected exit valuation.
        </p>
      </div>

      {/* Hero Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <MetricCard
          label="10-Year Aerial Distributions"
          value={residuals.totalInvestor10Year}
          format="currency"
          compact
          highlighted
        />
        <MetricCard
          label="Y5 Active Accounts"
          value={residuals.y5ActiveUsers}
          format="number"
          compact
        />
        <MetricCard
          label="Year 7 Exit Value (3%)"
          value={ev.investorExitValue}
          format="currency"
          compact
          style={{
            background: 'linear-gradient(135deg, #312e81, #3730a3)',
            borderColor: '#6366f1',
          }}
          className="!text-white [&_p]:!text-white [&_p.text-text-secondary]:!text-indigo-200"
        />
        <MetricCard
          label="Peak Annual Residual"
          value={residuals.peakAnnualResidual}
          format="currency"
          compact
        />
      </div>

      {/* Year 1-5 Operational Breakdown */}
      <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-2">
        Year 1–5 Operational Breakdown
      </p>
      <div className="overflow-x-auto mb-5">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-surface-border/50">
              <th className="py-2 px-3 text-left font-medium text-text-muted">Year</th>
              <th className="py-2 px-3 text-right font-medium text-text-muted">Active Accounts</th>
              <th className="py-2 px-3 text-right font-medium text-text-muted">Annual Revenue</th>
              <th className="py-2 px-3 text-right font-medium text-text-muted">Net Profit</th>
              <th className="py-2 px-3 text-right font-medium text-text-muted">Investor 3% Share</th>
            </tr>
          </thead>
          <tbody>
            {y1to5.map((row) => (
              <tr key={row.year} className="border-b border-surface-border/20">
                <td className="py-2 px-3 text-left text-text-secondary font-medium">Year {row.year}</td>
                <td className="py-2 px-3 text-right text-text-primary">{row.activeUsers.toLocaleString()}</td>
                <td className="py-2 px-3 text-right text-text-primary">{formatCurrency(row.annualRevenue)}</td>
                <td className="py-2 px-3 text-right text-text-primary">{formatCurrency(row.aerialProfit)}</td>
                <td className="py-2 px-3 text-right text-indigo-400 font-semibold">{formatCurrency(row.investorShare)}</td>
              </tr>
            ))}
            <tr className="border-t border-indigo-400/30">
              <td className="py-2 px-3 text-left text-indigo-400 font-semibold">Total</td>
              <td className="py-2 px-3 text-right text-text-muted">—</td>
              <td className="py-2 px-3 text-right text-indigo-400 font-semibold">{formatCurrency(totalY1to5Revenue)}</td>
              <td className="py-2 px-3 text-right text-indigo-400 font-semibold">{formatCurrency(totalY1to5Profit)}</td>
              <td className="py-2 px-3 text-right text-indigo-400 font-semibold">{formatCurrency(residuals.totalInvestorY1to5)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Account Context */}
      <div className="rounded-lg bg-indigo-500/5 border border-indigo-500/15 px-4 py-3 mb-5">
        <p className="text-text-secondary text-[11px] leading-relaxed">
          <span className="text-indigo-400 font-semibold">Account Economics:</span>{' '}
          At {formatCurrency(residuals.revenuePerUser, false)}/year per account ({formatCurrency(residuals.revenuePerUser / 12, false)}/mo subscription),
          the revenue profile corresponds to approximately{' '}
          <span className="text-text-primary font-semibold">{y1to5[2]?.activeUsers.toLocaleString() ?? '—'} active accounts by Year 3</span> and{' '}
          <span className="text-text-primary font-semibold">{residuals.y5ActiveUsers.toLocaleString()} by Year 5</span>.
          During the accelerated phase (pre-threshold), the investor receives 10% of Aerial profit — higher than the 3% residual shown above.
        </p>
      </div>

      {/* Year 6-10 Continuation */}
      <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-2">
        Year 6–10 Continuation Projections
        <span className="text-text-muted font-normal ml-2">3% Perpetual Residual</span>
      </p>
      <div className="overflow-x-auto mb-5">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-surface-border/50">
              <th className="py-2 px-3 text-left font-medium text-text-muted">Year</th>
              <th className="py-2 px-3 text-right font-medium text-text-muted">Active Accounts</th>
              <th className="py-2 px-3 text-right font-medium text-text-muted">Annual Revenue</th>
              <th className="py-2 px-3 text-right font-medium text-text-muted">Net Profit</th>
              <th className="py-2 px-3 text-right font-medium text-text-muted">Investor Share (3%)</th>
            </tr>
          </thead>
          <tbody>
            {y6to10.map((row) => (
              <tr key={row.year} className="border-b border-surface-border/20">
                <td className="py-2 px-3 text-left text-text-secondary font-medium">
                  Year {row.year}
                  <span className="text-text-muted text-[10px] ml-1">projected</span>
                </td>
                <td className="py-2 px-3 text-right text-text-primary">{row.activeUsers.toLocaleString()}</td>
                <td className="py-2 px-3 text-right text-text-primary">{formatCurrency(row.annualRevenue)}</td>
                <td className="py-2 px-3 text-right text-text-primary">{formatCurrency(row.aerialProfit)}</td>
                <td className="py-2 px-3 text-right text-indigo-400 font-semibold">{formatCurrency(row.investorShare)}</td>
              </tr>
            ))}
            <tr className="border-t border-indigo-400/30">
              <td className="py-2 px-3 text-left text-indigo-400 font-semibold">Total Y6–10</td>
              <td className="py-2 px-3 text-right text-text-muted">—</td>
              <td className="py-2 px-3 text-right text-indigo-400 font-semibold">{formatCurrency(totalY6to10Revenue)}</td>
              <td className="py-2 px-3 text-right text-indigo-400 font-semibold">{formatCurrency(totalY6to10Profit)}</td>
              <td className="py-2 px-3 text-right text-indigo-400 font-semibold">{formatCurrency(residuals.totalInvestorY6to10)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 10-Year Revenue & 3% Residual Trajectory Chart */}
      <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-2">
        10-Year Revenue & 3% Residual Trajectory
      </p>
      <div className="rounded-lg bg-surface/50 p-3 mb-5">
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid {...gridStyle} />
            <XAxis dataKey="name" {...axisStyle} />
            <YAxis
              yAxisId="left"
              {...axisStyle}
              tickFormatter={(v: number) => `$${(v / 1_000_000).toFixed(0)}M`}
              label={{ value: 'Revenue', angle: -90, position: 'insideLeft', style: { fill: axisStyle.fill, fontSize: 10 } }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              {...axisStyle}
              tickFormatter={(v: number) => `$${(v / 1_000_000).toFixed(1)}M`}
              label={{ value: '3% Residual', angle: 90, position: 'insideRight', style: { fill: axisStyle.fill, fontSize: 10 } }}
            />
            <Tooltip
              {...tooltipStyle}
              formatter={(value: number, name: string) => [formatCurrency(value), name]}
            />
            <RechartsBar yAxisId="left" dataKey="Annual Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
            <RechartsLine
              yAxisId="right"
              type="monotone"
              dataKey="Investor 3% Residual"
              stroke="#a5b4fc"
              strokeWidth={2.5}
              dot={{ fill: '#a5b4fc', r: 5, stroke: '#312e81', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Exit Valuation Block */}
      <div
        className="rounded-xl p-5 mb-5"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
        }}
      >
        <p className="text-indigo-100 text-xs uppercase tracking-[0.15em] font-semibold mb-1">
          Year {ev.exitYear} Company Sale — Investor 3% Participation
        </p>
        <p className="text-indigo-200/60 text-[10px] mb-4">
          Projected ARR at Year {ev.exitYear}: {formatCurrency(ev.arrAtExit)}
        </p>

        <div className="grid grid-cols-3 gap-3">
          {/* Conservative */}
          <div className="rounded-lg bg-white/5 p-3 text-center">
            <p className="text-indigo-300/60 text-[10px] uppercase tracking-wider font-medium mb-1">Conservative</p>
            <p className="text-indigo-200/50 text-[10px]">{ev.conservativeMultiple}x ARR</p>
            <p className="text-indigo-200 font-display font-bold text-sm mt-1">{formatCurrency(ev.conservativeValuation)}</p>
            <p className="text-indigo-300/50 text-[10px] mt-0.5">Company Valuation</p>
            <div className="border-t border-indigo-500/20 mt-2 pt-2">
              <p className="text-indigo-300 font-display font-bold text-sm">{formatCurrency(ev.conservativeInvestorValue)}</p>
              <p className="text-indigo-300/50 text-[10px]">Investor 3%</p>
            </div>
          </div>

          {/* Base */}
          <div className="rounded-lg bg-indigo-500/15 border border-indigo-400/30 p-3 text-center">
            <p className="text-indigo-200 text-[10px] uppercase tracking-wider font-semibold mb-1">Base Case</p>
            <p className="text-indigo-200/70 text-[10px]">{ev.valuationMultiple}x ARR</p>
            <p className="text-white font-display font-bold text-lg mt-1">{formatCurrency(ev.companyValuation)}</p>
            <p className="text-indigo-200/60 text-[10px] mt-0.5">Company Valuation</p>
            <div className="border-t border-indigo-400/30 mt-2 pt-2">
              <p className="text-white font-display font-bold text-lg">{formatCurrency(ev.investorExitValue)}</p>
              <p className="text-indigo-200/60 text-[10px]">Investor 3%</p>
            </div>
          </div>

          {/* Optimistic */}
          <div className="rounded-lg bg-white/5 p-3 text-center">
            <p className="text-indigo-300/60 text-[10px] uppercase tracking-wider font-medium mb-1">Optimistic</p>
            <p className="text-indigo-200/50 text-[10px]">{ev.optimisticMultiple}x ARR</p>
            <p className="text-indigo-200 font-display font-bold text-sm mt-1">{formatCurrency(ev.optimisticValuation)}</p>
            <p className="text-indigo-300/50 text-[10px] mt-0.5">Company Valuation</p>
            <div className="border-t border-indigo-500/20 mt-2 pt-2">
              <p className="text-indigo-300 font-display font-bold text-sm">{formatCurrency(ev.optimisticInvestorValue)}</p>
              <p className="text-indigo-300/50 text-[10px]">Investor 3%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Methodology Collapsible */}
      <div className="luxury-card overflow-hidden">
        <button
          onClick={() => setMethodologyOpen(!methodologyOpen)}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-hover/30 transition-colors"
        >
          <div>
            <h4 className="text-text-primary text-sm font-semibold">Valuation Methodology</h4>
            <p className="text-text-muted text-xs mt-0.5">How these projections were derived</p>
          </div>
          <span className="text-text-muted text-xs font-medium">{methodologyOpen ? '▲ Collapse' : '▼ Expand'}</span>
        </button>
        {methodologyOpen && (
          <div className="px-4 pb-4 space-y-3 border-t border-surface-border/40">
            <div className="mt-3">
              <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-1">Revenue Model</p>
              <p className="text-text-muted text-[11px] leading-relaxed">
                Aerial Insights generates revenue through enterprise subscriptions at {formatCurrency(residuals.revenuePerUser / 12, false)}/month
                per account ({formatCurrency(residuals.revenuePerUser, false)}/year ARR per account). The SaaS model operates at
                75% gross margin after scan infrastructure costs ({(100).toLocaleString()} scans/account/month) and growth marketing.
              </p>
            </div>
            <div>
              <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-1">Continuation Growth Assumptions</p>
              <p className="text-text-muted text-[11px] leading-relaxed">
                Year 6–10 projections use tapering annual account growth rates: 10% → 12% → 8% → 6% → 5%.
                This reflects the natural maturation curve from rapid adoption (Y1–5 target-driven ramp)
                to sustainable organic growth as the platform reaches market penetration equilibrium.
                Marketing spend scales modestly at 10% per year beyond the deployment period.
              </p>
            </div>
            <div>
              <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-1">Exit Multiple Rationale</p>
              <p className="text-text-muted text-[11px] leading-relaxed">
                The base case uses a 6x ARR multiple, reflecting Aerial Insights' position as a profitable,
                recurring-revenue data/SaaS platform with strong unit economics. At Year 7, the platform has
                achieved significant scale with high gross margins (75%), a proprietary data moat (aerial imagery
                + AI scoring), and deep vertical penetration across home services, solar, and real estate markets.
                Comparable SaaS businesses at this margin profile and growth stage trade at 5–10x ARR.
                The conservative (4x) and optimistic (8x) scenarios bracket the range.
              </p>
            </div>
            <div>
              <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-1">Investor Participation Structure</p>
              <p className="text-text-muted text-[11px] leading-relaxed">
                During the accelerated phase (Years 1–5, pre-threshold), the investor receives 10% of Aerial
                Insights net profit toward the $66M return target. Once the 65% return threshold is achieved,
                the accelerated share converts to a permanent 3% residual of net profit. In a company sale event,
                the investor additionally receives 3% of total sale value.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="text-text-dim text-[10px] italic mt-4">
        Post-threshold residual reflects 3% of Aerial Insights net profit (75% SaaS margin less scan costs
        and marketing). Continuation projections (Y6–10) use tapering growth assumptions. Exit valuation
        is illustrative and based on ARR multiples consistent with comparable SaaS platforms at scale.
        Investor retains 3% participation in all Aerial Insights economics and any company sale event.
      </p>
    </div>
  )
}
