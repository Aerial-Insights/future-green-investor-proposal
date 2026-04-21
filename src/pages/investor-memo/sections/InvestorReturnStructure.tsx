import { MEMO } from '../../../data/investorPortal/memoContent'
import { useInvestorReturns } from '../../../hooks/useCalculations'
import { formatCurrency } from '../../../utils/formatCurrency'
import ChartCard from '../../../components/data-display/ChartCard'
import StackedBarChart from '../../../components/charts/StackedBarChart'
import SectionHeader from '../components/SectionHeader'
import Prose from '../components/Prose'

export default function InvestorReturnStructure() {
  const returns = useInvestorReturns()

  // Stacked bar: annual return breakdown
  const returnBarData = returns.annualReturns.map((yr) => ({
    name: `Y${yr.year}`,
    'Home Services (15%)': yr.homeServicesDistribution,
    'Solar & RE (20%)': yr.solarRealEstateDistribution,
    'Aerial (10%)': yr.aerialDistribution,
    'SREC (50%)': yr.srecDistribution,
    'Aerial Residual (3%)': yr.aerialResidualDistribution,
  }))

  const returnBars = [
    { key: 'Home Services (15%)', label: 'Home Services (15%)', color: '#c9a84c' },
    { key: 'Solar & RE (20%)', label: 'Solar & RE (20%)', color: '#2d6a4f' },
    { key: 'Aerial (10%)', label: 'Aerial (10%)', color: '#6366f1' },
    { key: 'SREC (50%)', label: 'SREC (50%)', color: '#f59e0b' },
    { key: 'Aerial Residual (3%)', label: 'Aerial Residual (3%)', color: '#8b5cf6' },
  ]

  return (
    <section id="investor-returns" className="py-24 border-t border-surface-border/60">
      <SectionHeader
        number="XIII"
        eyebrow="Returns"
        title="Investor Return Structure"
        subtitle="Accelerated distributions to threshold, followed by permanent residual participation"
      />
      <Prose paragraphs={MEMO.investorReturnNarrative} className="mb-12" />

        {/* Return overview hero */}
        <div className="luxury-card p-6 mb-10 bg-gradient-to-br from-surface-elevated to-surface-hover border border-accent-gold/20">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Capital Invested</p>
              <p className="font-display font-bold text-2xl text-text-primary">$40M</p>
            </div>
            <div>
              <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Return Threshold</p>
              <p className="font-display font-bold text-2xl text-accent-gold">{formatCurrency(returns.thresholdTarget)}</p>
            </div>
            <div>
              <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Threshold Timeline</p>
              <p className="font-display font-bold text-2xl text-text-primary">
                {returns.monthsToThreshold ? `~${returns.monthsToThreshold} mo` : '—'}
              </p>
            </div>
            <div>
              <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Total Distributed (5yr)</p>
              <p className="font-display font-bold text-2xl text-text-primary">{formatCurrency(returns.totalDistributed)}</p>
            </div>
          </div>
        </div>

        {/* How it works breakdown */}
        <div className="grid gap-4 sm:grid-cols-2 mb-10">
          <div className="luxury-card p-6 border-l-2 border-accent-gold/40">
            <h4 className="font-display font-semibold text-text-primary text-sm mb-3">Phase 1 — Accelerated Distribution</h4>
            <p className="text-text-muted text-xs mb-4">Active until cumulative returns reach the $66M threshold (1.65x on $40M)</p>
            <div className="space-y-2">
              {[
                { stream: 'Home Services Profit', share: '15%' },
                { stream: 'Solar & Real Estate Profit', share: '20%' },
                { stream: 'Aerial Insights Profit', share: '10%' },
                { stream: 'SREC Revenue', share: '50%' },
              ].map((item) => (
                <div key={item.stream} className="flex justify-between py-1 border-b border-surface-border/50">
                  <span className="text-text-secondary text-xs">{item.stream}</span>
                  <span className="text-accent-gold font-display font-semibold text-xs">{item.share}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="luxury-card p-6 border-l-2 border-accent-green/40">
            <h4 className="font-display font-semibold text-text-primary text-sm mb-3">Phase 2 — Permanent Residuals</h4>
            <p className="text-text-muted text-xs mb-4">Post-threshold — continues indefinitely, with no change in deal terms</p>
            <div className="space-y-2">
              {[
                { stream: 'SREC Revenue (20-year contracts)', share: '50%', note: 'All install cohorts originated in Years 1–5' },
                { stream: 'Aerial Insights Revenue', share: '3%', note: 'Perpetual residual, scaling with SaaS growth' },
              ].map((item) => (
                <div key={item.stream} className="py-2 border-b border-surface-border/50">
                  <div className="flex justify-between">
                    <span className="text-text-secondary text-xs">{item.stream}</span>
                    <span className="text-accent-green-light font-display font-semibold text-xs">{item.share}</span>
                  </div>
                  <p className="text-text-dim text-[10px] mt-0.5">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Return waterfall chart */}
        <ChartCard title="Annual Return Breakdown" subtitle="Distribution streams by year across every revenue source">
          <StackedBarChart
            data={returnBarData}
            bars={returnBars}
            height={300}
          />
        </ChartCard>

        {/* Annual return table */}
        <div className="mt-8 luxury-card p-6 overflow-x-auto">
          <h4 className="font-display font-semibold text-text-primary text-[15px] mb-4">Five-year distribution schedule</h4>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="text-left text-text-muted uppercase tracking-wider py-2 pr-3">Year</th>
                <th className="text-right text-text-muted uppercase tracking-wider py-2 px-2">HS 15%</th>
                <th className="text-right text-text-muted uppercase tracking-wider py-2 px-2">S&RE 20%</th>
                <th className="text-right text-text-muted uppercase tracking-wider py-2 px-2">Aerial</th>
                <th className="text-right text-text-muted uppercase tracking-wider py-2 px-2">SREC 50%</th>
                <th className="text-right text-text-muted uppercase tracking-wider py-2 px-2 font-semibold">Total</th>
                <th className="text-right text-text-muted uppercase tracking-wider py-2 pl-2">Cumulative</th>
              </tr>
            </thead>
            <tbody>
              {returns.annualReturns.map((yr) => (
                <tr key={yr.year} className="border-b border-surface-border/50">
                  <td className="text-text-secondary py-2 pr-3 font-medium">Year {yr.year}</td>
                  <td className="text-right text-text-primary py-2 px-2">{formatCurrency(yr.homeServicesDistribution)}</td>
                  <td className="text-right text-text-primary py-2 px-2">{formatCurrency(yr.solarRealEstateDistribution)}</td>
                  <td className="text-right text-text-primary py-2 px-2">
                    {formatCurrency(yr.aerialDistribution + yr.aerialResidualDistribution)}
                  </td>
                  <td className="text-right text-text-primary py-2 px-2">{formatCurrency(yr.srecDistribution)}</td>
                  <td className="text-right text-accent-gold py-2 px-2 font-bold">{formatCurrency(yr.totalReturnThisYear)}</td>
                  <td className="text-right text-text-secondary py-2 pl-2">{formatCurrency(yr.cumulativeTotalReturn)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </section>
  )
}
