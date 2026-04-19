import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageShell from '../components/layout/PageShell'
import SectionBanner from '../components/sections/SectionBanner'
import StickyTabNav from '../components/layout/StickyTabNav'
import ChartCard from '../components/data-display/ChartCard'
import RevenueLineChart from '../components/charts/RevenueLineChart'
import StackedBarChart from '../components/charts/StackedBarChart'
import DonutChart from '../components/charts/DonutChart'
import AreaChartComponent from '../components/charts/AreaChartComponent'
import { useCalculations, useInvestorReturns, useLongTermSREC } from '../hooks/useCalculations'
import { formatCurrency } from '../utils/formatCurrency'
import { DIVISION_COLORS } from '../theme/chartTheme'
import { BUDGET_CATEGORIES, BUDGET_GRAND_TOTAL } from '../data/investorPortal/budgetBreakdown'
import type { BudgetCategory } from '../data/investorPortal/budgetBreakdown'

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'returns', label: 'Your Returns' },
  { id: 'capital', label: 'Capital Deployment' },
]

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function FinancialModel() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | null>(null)
  const years = useCalculations()
  const investorReturns = useInvestorReturns()
  const longTermSREC = useLongTermSREC()
  const y1 = years[0]
  const y5 = years[4]

  const profitByDivision = years.map((y) => ({
    name: `Year ${y.year}`,
    'Home Services': y.portfolio.homeServicesProfit,
    Solar: y.portfolio.solarOperationsProfit,
    'Real Estate': y.portfolio.realEstateProfit,
    Aerial: y.portfolio.aerialProfit,
    total: y.portfolio.totalProfit,
  }))

  const totalProfitByYear = years.map((y) => ({
    name: `Year ${y.year}`,
    profit: y.portfolio.totalProfit,
  }))

  const y5Mix = [
    { name: 'Home Services', value: y5.portfolio.homeServicesProfit, color: DIVISION_COLORS.homeServices },
    { name: 'Solar Ops', value: y5.portfolio.solarOperationsProfit, color: DIVISION_COLORS.solar },
    { name: 'Real Estate', value: y5.portfolio.realEstateProfit, color: DIVISION_COLORS.realEstate },
    { name: 'Aerial Insights', value: y5.portfolio.aerialProfit, color: DIVISION_COLORS.aerialInsights },
  ]

  const distributionData = investorReturns.annualReturns.map((r) => ({
    name: `Year ${r.year}`,
    'Home Services': r.homeServicesDistribution,
    'Solar & RE': r.solarRealEstateDistribution,
    Aerial: r.aerialDistribution,
    'SREC Participation': r.postHurdleSRECParticipation,
    total: r.totalReturnThisYear,
  }))

  const cumulativeData = investorReturns.annualReturns.map((r) => ({
    name: `Year ${r.year}`,
    cumulative: r.cumulativeTotalReturn,
    hurdle: investorReturns.hurdleTarget,
  }))

  const y5Return = investorReturns.annualReturns[4]
  const returnOnCapital = investorReturns.totalCapital > 0
    ? (investorReturns.totalDistributed / investorReturns.totalCapital) * 100
    : 0

  // 20-year SREC chart data
  const srecChartData = longTermSREC.annualProjections.map((p) => {
    const entry: Record<string, number | string> = { name: `Y${p.year}` }
    for (const cohort of longTermSREC.cohorts) {
      entry[`Y${cohort.buildYear} Farm`] = (p.cohortContributions[cohort.buildYear] ?? 0) * longTermSREC.investorEquityShare
    }
    return entry
  })

  const srecCohortBars = longTermSREC.cohorts.map((c, i) => {
    const colors = ['#c9a84c', '#e2c97e', '#f59e0b', '#40916c', '#2d6a4f']
    return { key: `Y${c.buildYear} Farm`, label: `Year ${c.buildYear} Farms`, color: colors[i % colors.length] }
  })

  const srecCumulativeData = longTermSREC.annualProjections.map((p) => ({
    name: `Y${p.year}`,
    cumulative: p.cumulativeInvestorShare,
  }))

  const profitGrowthMultiple = y1.portfolio.totalProfit > 0
    ? (y5.portfolio.totalProfit / y1.portfolio.totalProfit)
    : 0

  // Capital deployment chart data
  const mainCapitalData = BUDGET_CATEGORIES.map((cat) => ({
    name: cat.label,
    value: cat.total,
    color: cat.color,
  }))

  const drillDownChartData = selectedCategory
    ? selectedCategory.items.map((item, i) => {
        const shades = ['#c9a84c', '#e2c97e', '#f59e0b', '#40916c', '#2d6a4f', '#6366f1', '#a3a3a3', '#d4d4d8', '#737373', '#525252']
        return { name: item.label.length > 25 ? item.label.slice(0, 25) + '...' : item.label, value: item.amount, color: shades[i % shades.length] }
      })
    : null

  const budgetTotal = formatCurrency(BUDGET_GRAND_TOTAL)

  return (
    <PageShell fullWidth>
      <SectionBanner
        headline="Financial Model"
        subtitle="The financial command center for the full business portfolio."
        accentColor="#d4d4d8"
      />

      <div className="section-container">
        <StickyTabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="py-8">

          {/* ═══════════════════════════════════════════════════════════════════
              OVERVIEW TAB
              ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'overview' && (
            <motion.div className="space-y-8" variants={stagger} initial="hidden" animate="visible">

              <motion.div variants={fadeUp}>
                <div className="relative overflow-hidden rounded-2xl border border-surface-border bg-gradient-to-br from-surface-elevated via-surface-elevated to-surface-hover p-8 md:p-10">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-accent-gold/[0.03] rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
                  <div className="relative">
                    <p className="text-accent-gold text-xs uppercase tracking-[0.2em] font-semibold mb-3">Consolidated Platform Economics</p>
                    <h2 className="font-display font-bold text-text-primary text-3xl md:text-4xl mb-2">Three engines. One compounding portfolio.</h2>
                    <p className="text-text-secondary text-sm leading-relaxed max-w-3xl mb-8">
                      Home Services generates immediate cash flow. Solar &amp; Real Estate builds long-duration,
                      asset-backed income. Aerial Insights compounds recurring SaaS revenue. Together, they scale
                      from {formatCurrency(y1.portfolio.totalProfit)} in Year 1 to {formatCurrency(y5.portfolio.totalProfit)} by
                      Year 5 — a <span className="text-accent-gold font-semibold">{profitGrowthMultiple.toFixed(1)}x</span> growth trajectory.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                      <div className="bg-surface/40 border border-surface-border/50 rounded-xl p-4">
                        <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Year 1 Profit</p>
                        <p className="text-text-primary font-display font-bold text-2xl">{formatCurrency(y1.portfolio.totalProfit)}</p>
                      </div>
                      <div className="bg-surface/40 border border-surface-border/50 rounded-xl p-4">
                        <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Year 5 Profit</p>
                        <p className="text-accent-gold font-display font-bold text-2xl">{formatCurrency(y5.portfolio.totalProfit)}</p>
                      </div>
                      <div className="bg-surface/40 border border-surface-border/50 rounded-xl p-4">
                        <p className="text-text-muted text-xs uppercase tracking-wider mb-1">5-Year Growth</p>
                        <p className="text-text-primary font-display font-bold text-2xl">{profitGrowthMultiple.toFixed(1)}x</p>
                      </div>
                      <div className="bg-surface/40 border border-surface-border/50 rounded-xl p-4">
                        <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Revenue Engines</p>
                        <p className="text-text-primary font-display font-bold text-2xl">3</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Division cards — all use Year 1 / Year 5 pattern */}
              <motion.div variants={fadeUp}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[
                    {
                      title: 'Home Services', subtitle: 'Immediate Cash Flow',
                      color: DIVISION_COLORS.homeServices,
                      desc: 'Four active sales channels generating roofing, solar, HVAC, and energy-efficiency revenue from day one.',
                      y1Val: y1.portfolio.homeServicesProfit,
                      y5Val: y5.portfolio.homeServicesProfit,
                    },
                    {
                      title: 'Solar & Real Estate', subtitle: 'Asset-Backed Returns',
                      color: DIVISION_COLORS.realEstate,
                      desc: '$18.5M deployed into solar farms, land acquisition, wholesale flips, and housing — compounding asset-backed profit streams with 20-year SREC tails.',
                      y1Val: y1.portfolio.solarOperationsProfit + y1.portfolio.realEstateProfit,
                      y5Val: y5.portfolio.solarOperationsProfit + y5.portfolio.realEstateProfit,
                    },
                    {
                      title: 'Aerial Insights', subtitle: 'Recurring SaaS Revenue',
                      color: DIVISION_COLORS.aerialInsights,
                      desc: 'Subscription-based software platform with CRM, Crew Tracker, and sub-app add-ons. High-margin recurring revenue with compounding user growth.',
                      y1Val: y1.portfolio.aerialProfit,
                      y5Val: y5.portfolio.aerialProfit,
                    },
                  ].map((div) => (
                    <div key={div.title} className="luxury-card p-6 relative overflow-hidden group hover:border-surface-light transition-all duration-300">
                      <div className="absolute top-0 left-0 w-full h-1 opacity-80" style={{ backgroundColor: div.color }} />
                      <div className="flex items-center gap-2 mb-3 mt-1">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: div.color }} />
                        <span className="text-text-muted text-xs uppercase tracking-wider font-medium">{div.subtitle}</span>
                      </div>
                      <h4 className="font-display font-semibold text-text-primary text-base mb-2">{div.title}</h4>
                      <p className="text-text-secondary text-xs leading-relaxed mb-4">{div.desc}</p>
                      <div className="space-y-2 pt-3 border-t border-surface-border/40">
                        <div className="flex justify-between items-center">
                          <span className="text-text-muted text-xs">Year 1</span>
                          <span className="text-text-primary font-display font-semibold text-sm">{formatCurrency(div.y1Val)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-text-muted text-xs">Year 5</span>
                          <span className="text-accent-gold font-display font-bold text-base">{formatCurrency(div.y5Val)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeUp}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ChartCard title="Profit by Division" subtitle="Annual profit contribution from each division">
                    <StackedBarChart data={profitByDivision} bars={[
                      { key: 'Home Services', label: 'Home Services', color: DIVISION_COLORS.homeServices },
                      { key: 'Solar', label: 'Solar Ops', color: DIVISION_COLORS.solar },
                      { key: 'Real Estate', label: 'Real Estate', color: DIVISION_COLORS.realEstate },
                      { key: 'Aerial', label: 'Aerial Insights', color: DIVISION_COLORS.aerialInsights },
                    ]} height={380} />
                  </ChartCard>
                  <ChartCard title="Profit Growth Trend" subtitle="Total platform profit over 5 years">
                    <AreaChartComponent data={totalProfitByYear} dataKey="profit" color="#c9a84c" height={380} />
                  </ChartCard>
                </div>
              </motion.div>

              <motion.div variants={fadeUp}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ChartCard title="Year 5 Profit Mix" explanationKey="divisionMix">
                    <DonutChart data={y5Mix} centerLabel="Y5 Profit" centerValue={formatCurrency(y5.portfolio.totalProfit)} />
                  </ChartCard>
                  <div className="luxury-card p-6 flex flex-col justify-center">
                    <p className="text-accent-gold text-xs uppercase tracking-[0.15em] font-semibold mb-3">Why This Compounds</p>
                    <div className="space-y-4">
                      {[
                        { label: 'Layered Revenue Timing', detail: 'Home Services pays immediately, real estate and solar build over time, Aerial compounds monthly.' },
                        { label: 'Shared Customer Base', detail: 'Home Services customers become solar leads, solar sites generate SREC revenue, aerial data drives all divisions.' },
                        { label: 'Long-Tail Asset Income', detail: 'Solar farms produce SREC revenue for 20+ years, creating durable income well beyond the initial deployment.' },
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

              <motion.div variants={fadeUp}>
                <div className="luxury-card overflow-x-auto">
                  <h3 className="font-display font-semibold text-text-primary text-lg mb-4">Portfolio Summary</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-surface-border">
                        <th className="text-left text-text-muted font-medium py-3 pr-4">Division</th>
                        {years.map((y) => <th key={y.year} className="text-right text-text-muted font-medium py-3 px-3">Year {y.year}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: 'Home Services', key: 'homeServicesProfit' as const },
                        { label: 'Solar Operations', key: 'solarOperationsProfit' as const },
                        { label: 'Real Estate', key: 'realEstateProfit' as const },
                        { label: 'Aerial Insights', key: 'aerialProfit' as const },
                      ].map((row) => (
                        <tr key={row.label} className="border-b border-surface-border/50">
                          <td className="text-text-secondary py-3 pr-4">{row.label}</td>
                          {years.map((y) => <td key={y.year} className="text-right text-text-primary font-medium py-3 px-3">{formatCurrency(y.portfolio[row.key])}</td>)}
                        </tr>
                      ))}
                      <tr>
                        <td className="text-accent-gold font-display font-semibold py-3 pr-4">Total Profit</td>
                        {years.map((y) => <td key={y.year} className="text-right text-accent-gold font-display font-semibold py-3 px-3">{formatCurrency(y.portfolio.totalProfit)}</td>)}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              YOUR RETURNS TAB
              ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'returns' && (
            <motion.div className="space-y-10" variants={stagger} initial="hidden" animate="visible">

              {/* Hero */}
              <motion.div variants={fadeUp}>
                <div className="relative overflow-hidden rounded-2xl border border-accent-gold/20 bg-gradient-to-br from-surface-elevated via-surface-elevated to-surface-hover p-8 md:p-10">
                  <div className="absolute top-0 right-0 w-72 h-72 bg-accent-gold/[0.03] rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-56 h-56 bg-accent-gold/[0.02] rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
                  <div className="relative">
                    <p className="text-accent-gold text-xs uppercase tracking-[0.2em] font-semibold mb-2">Projected 5-Year Total Return</p>
                    <h2 className="font-display font-bold text-text-primary text-4xl md:text-5xl lg:text-6xl mb-2">{formatCurrency(investorReturns.totalDistributed)}</h2>
                    <p className="text-text-secondary text-sm mb-8">
                      on a {formatCurrency(investorReturns.totalCapital)} investment
                      <span className="text-accent-gold ml-2 font-semibold">{returnOnCapital.toFixed(1)}% return</span>
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Year 1 Return</p>
                        <p className="text-text-primary font-display font-semibold text-xl">{formatCurrency(investorReturns.annualReturns[0].totalReturnThisYear)}</p>
                      </div>
                      <div>
                        <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Year 5 Return</p>
                        <p className="text-text-primary font-display font-semibold text-xl">{formatCurrency(y5Return.totalReturnThisYear)}</p>
                      </div>
                      <div>
                        <p className="text-text-muted text-xs uppercase tracking-wider mb-1">50% Hurdle</p>
                        <p className="text-text-primary font-display font-semibold text-xl">
                          {investorReturns.isHurdleMet ? `Year ${investorReturns.hurdleYear}` : `${(investorReturns.hurdleProgress * 100).toFixed(0)}%`}
                        </p>
                      </div>
                      <div>
                        <p className="text-text-muted text-xs uppercase tracking-wider mb-1">20-Year SREC Value</p>
                        <p className="text-text-primary font-display font-semibold text-xl">{formatCurrency(longTermSREC.totalInvestorSRECIncome)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* How You Get Paid */}
              <motion.div variants={fadeUp}>
                <div className="mb-6">
                  <h3 className="font-display font-bold text-text-primary text-2xl mb-1">How You Get Paid</h3>
                  <p className="text-text-secondary text-sm">Three profit streams, one structured path to returns.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[
                    { division: 'Home Services', color: DIVISION_COLORS.homeServices, share: '20%', desc: 'of all Home Services operating profits',
                      y1: investorReturns.annualReturns[0].homeServicesDistribution, y5: investorReturns.annualReturns[4].homeServicesDistribution,
                      cumulative: investorReturns.annualReturns.reduce((s, r) => s + r.homeServicesDistribution, 0) },
                    { division: 'Solar & Real Estate', color: DIVISION_COLORS.realEstate, share: '20%', desc: 'of all Solar & Real Estate profits',
                      y1: investorReturns.annualReturns[0].solarRealEstateDistribution, y5: investorReturns.annualReturns[4].solarRealEstateDistribution,
                      cumulative: investorReturns.annualReturns.reduce((s, r) => s + r.solarRealEstateDistribution, 0) },
                    { division: 'Aerial Insights', color: DIVISION_COLORS.aerialInsights, share: '3%', desc: 'of all Aerial Insights profits',
                      y1: investorReturns.annualReturns[0].aerialDistribution, y5: investorReturns.annualReturns[4].aerialDistribution,
                      cumulative: investorReturns.annualReturns.reduce((s, r) => s + r.aerialDistribution, 0) },
                  ].map((stream) => (
                    <div key={stream.division} className="luxury-card p-6 relative overflow-hidden group hover:border-surface-light transition-all duration-300">
                      <div className="absolute top-0 left-0 w-full h-1 opacity-80" style={{ backgroundColor: stream.color }} />
                      <div className="flex items-center gap-2 mb-4 mt-1">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stream.color }} />
                        <span className="text-text-primary text-sm font-semibold">{stream.division}</span>
                      </div>
                      <span className="text-accent-gold font-display font-bold text-4xl">{stream.share}</span>
                      <p className="text-text-muted text-xs mb-5 mt-2">{stream.desc}</p>
                      <div className="space-y-2.5 pt-4 border-t border-surface-border/40">
                        <div className="flex justify-between"><span className="text-text-muted text-xs">Year 1</span><span className="text-text-primary font-display font-semibold text-sm">{formatCurrency(stream.y1)}</span></div>
                        <div className="flex justify-between"><span className="text-text-muted text-xs">Year 5</span><span className="text-text-primary font-display font-semibold text-sm">{formatCurrency(stream.y5)}</span></div>
                        <div className="flex justify-between pt-2 border-t border-surface-border/30">
                          <span className="text-text-muted text-xs font-medium">5-Year Total</span>
                          <span className="text-accent-gold font-display font-bold text-base">{formatCurrency(stream.cumulative)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Charts + Yearly Totals Strip */}
              <motion.div variants={fadeUp}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ChartCard title="Annual Distributions" subtitle="Your income by source, each year">
                    <StackedBarChart data={distributionData} bars={[
                      { key: 'Home Services', label: 'Home Services', color: DIVISION_COLORS.homeServices },
                      { key: 'Solar & RE', label: 'Solar & Real Estate', color: DIVISION_COLORS.solar },
                      { key: 'Aerial', label: 'Aerial Insights', color: DIVISION_COLORS.aerialInsights },
                      { key: 'SREC Participation', label: 'Post-Hurdle SREC', color: DIVISION_COLORS.realEstate },
                    ]} height={380} />
                  </ChartCard>
                  <ChartCard title="Cumulative Return" subtitle="Total accumulated vs. 50% hurdle target">
                    <RevenueLineChart data={cumulativeData} lines={[
                      { key: 'cumulative', label: 'Cumulative Returns', color: '#c9a84c' },
                      { key: 'hurdle', label: '50% Hurdle', color: '#ef4444' },
                    ]} height={380} />
                  </ChartCard>
                </div>

                {/* Yearly Totals Strip */}
                <div className="mt-6 luxury-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-display font-semibold text-text-primary text-sm">Annual Return Totals</h4>
                    <span className="text-text-muted text-xs">Quick reference</span>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {investorReturns.annualReturns.map((r) => (
                      <div key={r.year} className={`text-center rounded-lg p-3 ${r.hurdleMetThisYear ? 'bg-accent-gold/10 border border-accent-gold/30' : 'bg-surface/40 border border-surface-border/30'}`}>
                        <p className="text-text-muted text-xs mb-1">Year {r.year}</p>
                        <p className={`font-display font-bold text-lg ${r.hurdleMetThisYear ? 'text-accent-gold' : 'text-text-primary'}`}>
                          {formatCurrency(r.totalReturnThisYear)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* 50% Hurdle */}
              <motion.div variants={fadeUp}>
                <div className="luxury-card p-6 md:p-8 border-accent-gold/15">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="flex-1">
                      <p className="text-accent-gold text-xs uppercase tracking-[0.15em] font-semibold mb-2">Return Milestone</p>
                      <h3 className="font-display font-bold text-text-primary text-xl mb-3">The 50% Return Hurdle</h3>
                      <p className="text-text-secondary text-sm leading-relaxed mb-4">
                        Distributions continue under the profit-share structure above until cumulative returns
                        reach <span className="text-accent-gold font-semibold">{formatCurrency(investorReturns.hurdleTarget)}</span> —
                        representing a 50% return on the total {formatCurrency(investorReturns.totalCapital)} investment.
                      </p>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        Once the hurdle is achieved, the investor retains ongoing upside through a dedicated SREC revenue
                        stream — receiving <span className="text-accent-gold font-semibold">25% of all Solar Renewable Energy Certificate revenue</span> generated from that point forward.
                      </p>
                    </div>
                    <div className="flex-shrink-0 w-full md:w-64">
                      <div className="bg-surface/60 border border-surface-border rounded-xl p-5 space-y-4">
                        <div>
                          <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Target</p>
                          <p className="text-text-primary font-display font-bold text-2xl">{formatCurrency(investorReturns.hurdleTarget)}</p>
                        </div>
                        <div>
                          <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Progress</p>
                          <div className="w-full bg-surface-border rounded-full h-2.5 mb-1">
                            <div className="bg-accent-gold h-2.5 rounded-full transition-all duration-700" style={{ width: `${Math.min(100, investorReturns.hurdleProgress * 100)}%` }} />
                          </div>
                          <p className="text-accent-gold font-display font-semibold text-sm">{(investorReturns.hurdleProgress * 100).toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-text-muted text-xs uppercase tracking-wider mb-1">{investorReturns.isHurdleMet ? 'Achieved' : 'Status'}</p>
                          <p className="text-text-primary font-display font-bold text-lg">{investorReturns.isHurdleMet ? `Year ${investorReturns.hurdleYear}` : 'In Progress'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 5-Year Return Table */}
              <motion.div variants={fadeUp}>
                <div className="luxury-card overflow-x-auto">
                  <div className="flex items-baseline justify-between mb-5">
                    <h3 className="font-display font-bold text-text-primary text-xl">5-Year Return Schedule</h3>
                    <span className="text-text-muted text-xs">All values reflect live model inputs</span>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-surface-border">
                        {['Year', 'Home Services', 'Solar & RE', 'Aerial', 'SREC', 'Annual Total', 'Cumulative'].map((h) => (
                          <th key={h} className={`${h === 'Year' ? 'text-left pr-4' : 'text-right px-3'} text-text-muted font-semibold py-3 text-xs uppercase tracking-wider`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {investorReturns.annualReturns.map((r) => (
                        <tr key={r.year} className={r.hurdleMetThisYear ? 'border-b border-accent-gold/30 bg-accent-gold/[0.04]' : 'border-b border-surface-border/40'}>
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-2">
                              <span className="text-text-primary font-display font-semibold">Year {r.year}</span>
                              {r.hurdleMetThisYear && <span className="text-[10px] font-bold text-surface-elevated bg-accent-gold px-2 py-0.5 rounded-full uppercase tracking-wider">Hurdle Met</span>}
                            </div>
                          </td>
                          <td className="text-right text-text-primary py-4 px-3 font-medium">{formatCurrency(r.homeServicesDistribution)}</td>
                          <td className="text-right text-text-primary py-4 px-3 font-medium">{formatCurrency(r.solarRealEstateDistribution)}</td>
                          <td className="text-right text-text-primary py-4 px-3 font-medium">{formatCurrency(r.aerialDistribution)}</td>
                          <td className="text-right py-4 px-3 font-medium">
                            {r.postHurdleSRECParticipation > 0 ? <span className="text-accent-gold">{formatCurrency(r.postHurdleSRECParticipation)}</span> : <span className="text-text-dim">—</span>}
                          </td>
                          <td className="text-right text-text-primary py-4 px-3 font-display font-semibold">{formatCurrency(r.totalReturnThisYear)}</td>
                          <td className="text-right text-accent-gold py-4 pl-3 font-display font-bold text-base">{formatCurrency(r.cumulativeTotalReturn)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-accent-gold/30">
                        <td className="py-4 pr-4"><span className="text-accent-gold font-display font-bold">Total</span></td>
                        <td className="text-right text-text-primary py-4 px-3 font-display font-semibold">{formatCurrency(investorReturns.annualReturns.reduce((s, r) => s + r.homeServicesDistribution, 0))}</td>
                        <td className="text-right text-text-primary py-4 px-3 font-display font-semibold">{formatCurrency(investorReturns.annualReturns.reduce((s, r) => s + r.solarRealEstateDistribution, 0))}</td>
                        <td className="text-right text-text-primary py-4 px-3 font-display font-semibold">{formatCurrency(investorReturns.annualReturns.reduce((s, r) => s + r.aerialDistribution, 0))}</td>
                        <td className="text-right text-accent-gold py-4 px-3 font-display font-semibold">{formatCurrency(investorReturns.postHurdleSRECTotal)}</td>
                        <td colSpan={2} className="text-right text-accent-gold py-4 pl-3 font-display font-bold text-lg">{formatCurrency(investorReturns.totalDistributed)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </motion.div>

              {/* 20-Year SREC Section */}
              <motion.div variants={fadeUp}>
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-accent-gold/20" /></div>
                  <div className="relative flex justify-center">
                    <span className="bg-surface px-6 text-accent-gold text-xs uppercase tracking-[0.2em] font-semibold">Long-Term SREC Return Model</span>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeUp}>
                <div className="relative overflow-hidden rounded-2xl border border-accent-gold/15 bg-gradient-to-br from-surface-elevated via-surface-elevated to-surface-hover p-8 md:p-10">
                  <div className="absolute top-0 left-0 w-64 h-64 bg-accent-green/[0.03] rounded-full -translate-y-1/2 -translate-x-1/4 blur-3xl" />
                  <div className="relative">
                    <p className="text-accent-gold text-xs uppercase tracking-[0.2em] font-semibold mb-2">20-Year Investor SREC Income</p>
                    <h2 className="font-display font-bold text-text-primary text-3xl md:text-4xl lg:text-5xl mb-2">{formatCurrency(longTermSREC.totalInvestorSRECIncome)}</h2>
                    <p className="text-text-secondary text-sm mb-8 max-w-2xl">
                      The investor retains <span className="text-accent-gold font-semibold">{(longTermSREC.investorEquityShare * 100).toFixed(0)}% equity</span> in
                      all SREC revenue from solar farms originated during the 5-year build period.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-surface/40 border border-surface-border/50 rounded-xl p-4">
                        <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Peak Annual Income</p>
                        <p className="text-accent-gold font-display font-bold text-xl">{formatCurrency(longTermSREC.peakAnnualInvestorIncome)}</p>
                      </div>
                      <div className="bg-surface/40 border border-surface-border/50 rounded-xl p-4">
                        <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Cohorts</p>
                        <p className="text-text-primary font-display font-bold text-xl">{longTermSREC.cohorts.length}</p>
                      </div>
                      <div className="bg-surface/40 border border-surface-border/50 rounded-xl p-4">
                        <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Total Acres</p>
                        <p className="text-text-primary font-display font-bold text-xl">{longTermSREC.cohorts.reduce((s, c) => s + c.acresGoal, 0)}</p>
                      </div>
                      <div className="bg-surface/40 border border-surface-border/50 rounded-xl p-4">
                        <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Timeline</p>
                        <p className="text-text-primary font-display font-bold text-xl">Y{longTermSREC.annualProjections[0]?.year}–Y{longTermSREC.annualProjections[longTermSREC.annualProjections.length - 1]?.year}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeUp}>
                <div className="luxury-card p-6 md:p-8">
                  <h3 className="font-display font-bold text-text-primary text-xl mb-4">How the 20-Year SREC Model Works</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-text-secondary text-sm leading-relaxed mb-4">
                        Solar farms originated during the initial 5-year deployment period each produce SREC revenue for their full 20-year operating life.
                        The investor retains <span className="text-accent-gold font-semibold">20% equity</span> in the SREC economics of every farm built during this window.
                      </p>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        As each annual cohort comes online after the 2-year build delay, the return stream stacks — creating compounding annual income.
                      </p>
                    </div>
                    <div className="space-y-3">
                      {longTermSREC.cohorts.map((c) => (
                        <div key={c.buildYear} className="flex items-center justify-between py-2.5 px-4 rounded-lg bg-surface/30 border border-surface-border/30">
                          <div>
                            <span className="text-text-primary text-sm font-semibold">Year {c.buildYear} Farms</span>
                            <span className="text-text-muted text-xs ml-2">{c.acresGoal} acres</span>
                          </div>
                          <div className="text-right">
                            <span className="text-text-muted text-xs">Y{c.startYear}–Y{c.endYear}</span>
                            <span className="text-accent-gold font-display font-semibold text-sm ml-3">
                              {formatCurrency(c.acresGoal * c.annualSRECRevenuePerAcre * longTermSREC.investorEquityShare)}/yr
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeUp}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ChartCard title="Annual SREC Income by Cohort" subtitle="Investor's 20% equity share, stacked by farm vintage">
                    <StackedBarChart data={srecChartData} bars={srecCohortBars} height={400} />
                  </ChartCard>
                  <ChartCard title="Cumulative SREC Income" subtitle="Total investor SREC earnings over time">
                    <AreaChartComponent data={srecCumulativeData} dataKey="cumulative" color="#c9a84c" height={400} />
                  </ChartCard>
                </div>
              </motion.div>

              <motion.div variants={fadeUp}>
                <div className="text-center py-4">
                  <p className="text-text-muted text-xs uppercase tracking-[0.15em] mb-2">Return Structure Summary</p>
                  <p className="text-text-secondary text-sm max-w-2xl mx-auto leading-relaxed">
                    All returns are dynamically calculated from the live financial model. Adjusting assumptions updates every projection in real time.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════
              CAPITAL DEPLOYMENT TAB — Interactive Drill-Down
              ═══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'capital' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-text-primary text-2xl">Capital Deployment</h2>
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-accent-gold text-sm font-semibold hover:text-accent-gold-light transition-colors flex items-center gap-1"
                  >
                    <span>&larr;</span> Back to Overview
                  </button>
                )}
              </div>

              <AnimatePresence mode="wait">
                {!selectedCategory ? (
                  /* ── MAIN VIEW ─────────────────────────────────────────── */
                  <motion.div key="main" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <ChartCard title="Allocation Breakdown" explanationKey="capitalDeployment">
                        <DonutChart data={mainCapitalData} centerLabel="Total" centerValue={budgetTotal} />
                      </ChartCard>
                      <div className="space-y-3">
                        {BUDGET_CATEGORIES.map((cat) => (
                          <button
                            key={cat.key}
                            onClick={() => setSelectedCategory(cat)}
                            className="w-full luxury-card p-4 text-left hover:border-accent-gold/30 hover:shadow-glow transition-all duration-200 group cursor-pointer"
                          >
                            <div className="flex justify-between items-baseline mb-1">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                                <span className="text-text-primary text-sm font-semibold">{cat.label}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-accent-gold font-display font-semibold">{formatCurrency(cat.total)}</span>
                                <span className="text-text-dim text-xs group-hover:text-accent-gold transition-colors">&rarr;</span>
                              </div>
                            </div>
                            <p className="text-text-muted text-xs pl-4">{cat.items.length} line items</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* ── DRILL-DOWN VIEW ───────────────────────────────────── */
                  <motion.div key={selectedCategory.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <ChartCard title={`${selectedCategory.label} Breakdown`} subtitle={formatCurrency(selectedCategory.total)}>
                        <DonutChart
                          data={drillDownChartData!}
                          centerLabel={selectedCategory.label.split(' ')[0]}
                          centerValue={formatCurrency(selectedCategory.total)}
                        />
                      </ChartCard>
                      <div className="space-y-2">
                        {selectedCategory.items.map((item) => (
                          <div key={item.label} className="luxury-card p-4">
                            <div className="flex justify-between items-baseline mb-1.5">
                              <span className="text-text-primary text-sm font-semibold">{item.label}</span>
                              <span className="text-accent-gold font-display font-semibold text-sm">{formatCurrency(item.amount)}</span>
                            </div>
                            <p className="text-text-muted text-xs">{item.why}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Category navigation */}
                    <div className="mt-6 flex flex-wrap gap-2">
                      {BUDGET_CATEGORIES.map((cat) => (
                        <button
                          key={cat.key}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                            cat.key === selectedCategory.key
                              ? 'bg-accent-gold/15 text-accent-gold border border-accent-gold/30'
                              : 'bg-surface-elevated text-text-secondary border border-surface-border hover:border-surface-light hover:text-text-primary'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

        </div>
      </div>
    </PageShell>
  )
}
