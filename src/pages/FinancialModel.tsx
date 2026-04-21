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
import { formatCurrency, formatCurrencyPrecise } from '../utils/formatCurrency'
import { DIVISION_COLORS } from '../theme/chartTheme'
import { BUDGET_CATEGORIES, BUDGET_GRAND_TOTAL } from '../data/investorPortal/budgetBreakdown'
import type { BudgetCategory } from '../data/investorPortal/budgetBreakdown'
import { DEPLOYMENT_OUTPUTS } from '../data/investorPortal/deploymentOutputs'
import DeploymentOutputCard from '../components/data-display/DeploymentOutputCard'
import SimulationPanel from '../components/interactive/SimulationPanel'
import { SIMULATION_CONFIGS } from '../data/investorPortal/simulationConfigs'

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

  // Accelerated-phase distribution data (HS, Solar/RE, Aerial 10%)
  const acceleratedDistributionData = investorReturns.annualReturns.map((r) => ({
    name: `Year ${r.year}`,
    'Home Services': r.homeServicesDistribution,
    'Solar & RE': r.solarRealEstateDistribution,
    Aerial: r.aerialDistribution,
    total: r.homeServicesDistribution + r.solarRealEstateDistribution + r.aerialDistribution,
  }))

  // Full distribution data (all streams)
  const distributionData = investorReturns.annualReturns.map((r) => ({
    name: `Year ${r.year}`,
    'Home Services': r.homeServicesDistribution,
    'Solar & RE': r.solarRealEstateDistribution,
    'Aerial (Accel.)': r.aerialDistribution,
    'SREC (50%)': r.srecDistribution,
    'Aerial Residual (3%)': r.aerialResidualDistribution,
    total: r.totalReturnThisYear,
  }))

  const cumulativeData = investorReturns.annualReturns.map((r) => ({
    name: `Year ${r.year}`,
    cumulative: r.cumulativeTotalReturn,
    hurdle: investorReturns.thresholdTarget,
  }))

  const returnOnCapital = investorReturns.totalCapital > 0
    ? (investorReturns.totalDistributed / investorReturns.totalCapital) * 100
    : 0

  // 20-year SREC chart data
  const srecChartData = longTermSREC.annualProjections.map((p) => {
    const entry: Record<string, number | string> = { name: `Y${p.year}` }
    for (const cohort of longTermSREC.cohorts) {
      entry[`Y${cohort.buildYear} Cohort`] = (p.cohortContributions[cohort.buildYear] ?? 0) * longTermSREC.investorEquityShare
    }
    return entry
  })

  const srecCohortBars = longTermSREC.cohorts.map((c, i) => {
    const colors = ['#c9a84c', '#e2c97e', '#f59e0b', '#40916c', '#2d6a4f']
    return { key: `Y${c.buildYear} Cohort`, label: `Year ${c.buildYear} Installs`, color: colors[i % colors.length] }
  })

  const srecCumulativeData = longTermSREC.annualProjections.map((p) => ({
    name: `Y${p.year}`,
    cumulative: p.cumulativeInvestorShare,
  }))

  const profitGrowthMultiple = y1.portfolio.totalProfit > 0
    ? (y5.portfolio.totalProfit / y1.portfolio.totalProfit)
    : 0

  // Month-precision threshold timing
  const thresholdYears = investorReturns.monthsToThreshold !== null
    ? Math.floor(investorReturns.monthsToThreshold / 12)
    : null
  const thresholdMonths = investorReturns.monthsToThreshold !== null
    ? investorReturns.monthsToThreshold % 12
    : null
  const thresholdTimeLabel = thresholdYears !== null
    ? `${thresholdYears} Year${thresholdYears !== 1 ? 's' : ''}${thresholdMonths ? `, ${thresholdMonths} Mo` : ''}`
    : 'In Progress'

  const fiveYearTotalProfit = years.reduce((s, y) => s + y.portfolio.totalProfit, 0)

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

  const budgetTotal = formatCurrencyPrecise(BUDGET_GRAND_TOTAL)

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
                <div className="relative overflow-hidden rounded-2xl border border-accent-gold/20 bg-gradient-to-br from-surface-elevated via-surface-elevated to-surface-hover p-8 md:p-12">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-accent-gold/[0.04] rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-gold/[0.02] rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-[10px] font-bold text-surface-elevated bg-accent-gold px-3 py-1.5 rounded-full uppercase tracking-wider">$40M Capital Raise</span>
                      <span className="text-accent-gold text-xs uppercase tracking-[0.2em] font-semibold">Consolidated Platform Economics</span>
                    </div>
                    <h2 className="font-display font-bold text-text-primary text-4xl md:text-5xl mb-3 leading-tight">Three engines.<br className="hidden md:block" /> One compounding portfolio.</h2>
                    <p className="text-text-secondary text-base leading-relaxed max-w-3xl mb-10">
                      Home Services generates immediate cash flow. Real Estate builds long-duration,
                      asset-backed income. Aerial Insights compounds recurring SaaS revenue. Together, they scale
                      from {formatCurrency(y1.portfolio.totalProfit)} in Year 1 to {formatCurrency(y5.portfolio.totalProfit)} by
                      Year 5 — a <span className="text-accent-gold font-semibold">{profitGrowthMultiple.toFixed(1)}x</span> growth trajectory
                      with {formatCurrency(investorReturns.totalDistributed)} in total investor distributions.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-5">
                      <div className="bg-surface/40 border border-surface-border/50 rounded-xl p-5">
                        <p className="text-text-muted text-[10px] uppercase tracking-wider mb-2">Year 1 Profit</p>
                        <p className="text-text-primary font-display font-bold text-2xl">{formatCurrency(y1.portfolio.totalProfit)}</p>
                      </div>
                      <div className="bg-surface/40 border border-accent-gold/30 rounded-xl p-5">
                        <p className="text-text-muted text-[10px] uppercase tracking-wider mb-2">Year 5 Profit</p>
                        <p className="text-accent-gold font-display font-bold text-2xl">{formatCurrency(y5.portfolio.totalProfit)}</p>
                      </div>
                      <div className="bg-surface/40 border border-surface-border/50 rounded-xl p-5">
                        <p className="text-text-muted text-[10px] uppercase tracking-wider mb-2">5-Year Growth</p>
                        <p className="text-text-primary font-display font-bold text-2xl">{profitGrowthMultiple.toFixed(1)}x</p>
                      </div>
                      <div className="bg-surface/40 border border-surface-border/50 rounded-xl p-5">
                        <p className="text-text-muted text-[10px] uppercase tracking-wider mb-2">Time to 65% Return</p>
                        <p className="text-text-primary font-display font-bold text-2xl">{thresholdTimeLabel}</p>
                      </div>
                      <div className="bg-surface/40 border border-accent-gold/20 rounded-xl p-5">
                        <p className="text-text-muted text-[10px] uppercase tracking-wider mb-2">5-Year Distributed</p>
                        <p className="text-accent-gold font-display font-bold text-2xl">{formatCurrency(investorReturns.totalDistributed)}</p>
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
                      title: 'Real Estate', subtitle: 'Asset-Backed Returns',
                      color: DIVISION_COLORS.realEstate,
                      desc: 'Distributed solar portfolio, wholesale pipeline, and housing development — compounding asset-backed profit streams with 20-year SREC tails from a growing install base.',
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
                        { label: 'Long-Tail Asset Income', detail: 'Distributed solar installs produce SREC revenue for 20+ years per cohort, creating durable income well beyond the initial deployment.' },
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

              {/* ── RETURN OVERVIEW HERO ─────────────────────────────────── */}
              <motion.div variants={fadeUp}>
                <div className="relative overflow-hidden rounded-2xl border border-accent-gold/20 bg-gradient-to-br from-surface-elevated via-surface-elevated to-surface-hover p-8 md:p-10">
                  <div className="absolute top-0 right-0 w-72 h-72 bg-accent-gold/[0.03] rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-56 h-56 bg-accent-gold/[0.02] rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
                  <div className="relative">
                    <p className="text-accent-gold text-xs uppercase tracking-[0.2em] font-semibold mb-2">Time to 65% Return</p>
                    <h2 className="font-display font-bold text-text-primary text-4xl md:text-5xl lg:text-6xl mb-2">
                      {thresholdTimeLabel}
                    </h2>
                    <p className="text-text-secondary text-sm mb-2">
                      {formatCurrency(investorReturns.thresholdTarget)} returned on a {formatCurrency(investorReturns.totalCapital)} investment
                      {investorReturns.isThresholdMet
                        ? <span className="text-accent-gold ml-2 font-semibold">Threshold achieved within 5 years</span>
                        : <span className="text-text-muted ml-2">In progress</span>
                      }
                    </p>
                    {investorReturns.monthsToThreshold !== null && (
                      <p className="text-text-muted text-xs mb-6">
                        {investorReturns.monthsToThreshold} months total — calculated from monthly cash flow accumulation
                      </p>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-text-muted text-xs uppercase tracking-wider mb-1">5-Year Total Distributed</p>
                        <p className="text-accent-gold font-display font-semibold text-xl">{formatCurrency(investorReturns.totalDistributed)}</p>
                      </div>
                      <div>
                        <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Return on Capital</p>
                        <p className="text-text-primary font-display font-semibold text-xl">{returnOnCapital.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-text-muted text-xs uppercase tracking-wider mb-1">65% Threshold Target</p>
                        <p className="text-text-primary font-display font-semibold text-xl">{formatCurrency(investorReturns.thresholdTarget)}</p>
                      </div>
                      <div>
                        <p className="text-text-muted text-xs uppercase tracking-wider mb-1">20-Year SREC Value</p>
                        <p className="text-text-primary font-display font-semibold text-xl">{formatCurrency(longTermSREC.totalInvestorSRECIncome)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ══════════════════════════════════════════════════════════
                  RETURN STRUCTURE EXPLANATION
                  ══════════════════════════════════════════════════════════ */}
              <motion.div variants={fadeUp}>
                <div className="luxury-card p-6 md:p-8 border-accent-gold/15">
                  <h3 className="font-display font-bold text-text-primary text-xl mb-5">How Your Returns Work</h3>
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-8 items-start">
                    {/* Phase 1 */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-[10px] font-bold text-surface-elevated bg-accent-gold px-2.5 py-1 rounded-full uppercase tracking-wider">Phase 1</span>
                        <span className="text-text-primary text-sm font-semibold">Accelerated Distributions</span>
                      </div>
                      <p className="text-text-secondary text-xs leading-relaxed mb-4">
                        The investor receives profit-share distributions from three revenue streams plus 50% of SREC income until cumulative total returns reach {formatCurrency(investorReturns.thresholdTarget)} — a 65% return on the {formatCurrency(investorReturns.totalCapital)} investment ({formatCurrency(investorReturns.totalCapital)} principal plus {formatCurrency(investorReturns.thresholdTarget - investorReturns.totalCapital)} profit).
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-surface/40 border border-surface-border/30">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: DIVISION_COLORS.homeServices }} />
                          <div className="flex-1">
                            <span className="text-text-primary text-sm font-semibold">15%</span>
                            <span className="text-text-muted text-xs ml-2">of Home Services profits</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-surface/40 border border-surface-border/30">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: DIVISION_COLORS.realEstate }} />
                          <div className="flex-1">
                            <span className="text-text-primary text-sm font-semibold">20%</span>
                            <span className="text-text-muted text-xs ml-2">of Solar & Real Estate profits</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-surface/40 border border-surface-border/30">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: DIVISION_COLORS.aerialInsights }} />
                          <div className="flex-1">
                            <span className="text-text-primary text-sm font-semibold">10%</span>
                            <span className="text-text-muted text-xs ml-2">of Aerial Insights profits</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-surface/40 border border-surface-border/30">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-emerald-500" />
                          <div className="flex-1">
                            <span className="text-text-primary text-sm font-semibold">50%</span>
                            <span className="text-text-muted text-xs ml-2">of SREC revenue (counts toward threshold)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Arrow / Divider */}
                    <div className="hidden md:flex flex-col items-center justify-center self-center py-4">
                      <div className="w-px h-8 bg-accent-gold/30" />
                      <div className="my-2 px-3 py-1.5 rounded-full border border-accent-gold/30 bg-accent-gold/5">
                        <p className="text-accent-gold text-[10px] uppercase tracking-wider font-bold whitespace-nowrap">Until {formatCurrency(investorReturns.thresholdTarget)}</p>
                      </div>
                      <div className="w-px h-8 bg-accent-gold/30" />
                    </div>
                    <div className="md:hidden flex justify-center py-2">
                      <div className="px-3 py-1.5 rounded-full border border-accent-gold/30 bg-accent-gold/5">
                        <p className="text-accent-gold text-[10px] uppercase tracking-wider font-bold">Then transitions to</p>
                      </div>
                    </div>
                    {/* Phase 2 */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-[10px] font-bold text-white bg-emerald-600 px-2.5 py-1 rounded-full uppercase tracking-wider">Phase 2</span>
                        <span className="text-text-primary text-sm font-semibold">Permanent Residual Income</span>
                      </div>
                      <p className="text-text-secondary text-xs leading-relaxed mb-4">
                        Once {formatCurrency(investorReturns.thresholdTarget)} total has been returned, the accelerated profit-share distributions stop. The investor retains two permanent income streams that continue generating returns indefinitely.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-surface/40 border border-surface-border/30">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-emerald-500" />
                          <div className="flex-1">
                            <span className="text-text-primary text-sm font-semibold">50%</span>
                            <span className="text-text-muted text-xs ml-2">of SREC revenue — 20-year contracts</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-surface/40 border border-surface-border/30">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: DIVISION_COLORS.aerialInsights }} />
                          <div className="flex-1">
                            <span className="text-text-primary text-sm font-semibold">3%</span>
                            <span className="text-text-muted text-xs ml-2">of Aerial Insights revenue — permanent</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-text-muted text-[10px] mt-3 leading-relaxed">
                        SREC participation covers all solar installations originated during the 5-year deployment window, including contracts signed through Year 5, for the full 20-year operating life of each cohort.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ══════════════════════════════════════════════════════════
                  SECTION A — ACCELERATED RETURN PHASE
                  ══════════════════════════════════════════════════════════ */}
              <motion.div variants={fadeUp}>
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-accent-gold/20" /></div>
                  <div className="relative flex justify-center">
                    <span className="bg-surface px-6 text-accent-gold text-xs uppercase tracking-[0.2em] font-semibold">Phase 1 — Accelerated Returns</span>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeUp}>
                <div className="luxury-card p-6 md:p-8 border-accent-gold/15">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[10px] font-bold text-surface-elevated bg-accent-gold px-2.5 py-1 rounded-full uppercase tracking-wider">Temporary</span>
                        <span className="text-text-muted text-xs">Until {formatCurrency(investorReturns.thresholdTarget)} cumulative return</span>
                      </div>
                      <h3 className="font-display font-bold text-text-primary text-xl mb-3">Accelerated Profit-Share Distributions</h3>
                      <p className="text-text-secondary text-sm leading-relaxed mb-4">
                        The investor receives profit-share distributions from three revenue streams plus SREC income until cumulative
                        total returns reach <span className="text-accent-gold font-semibold">{formatCurrency(investorReturns.thresholdTarget)}</span> —
                        representing {formatCurrency(investorReturns.totalCapital)} principal returned plus a 65% profit ({formatCurrency(investorReturns.thresholdTarget - investorReturns.totalCapital)}).
                        Once that threshold is reached, the three accelerated streams stop entirely and are replaced by
                        long-term residual income.
                      </p>
                    </div>
                    <div className="flex-shrink-0 w-full md:w-64">
                      <div className="bg-surface/60 border border-surface-border rounded-xl p-5 space-y-4">
                        <div>
                          <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Threshold</p>
                          <p className="text-text-primary font-display font-bold text-2xl">{formatCurrency(investorReturns.thresholdTarget)}</p>
                        </div>
                        <div>
                          <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Progress</p>
                          <div className="w-full bg-surface-border rounded-full h-2.5 mb-1">
                            <div className="bg-accent-gold h-2.5 rounded-full transition-all duration-700" style={{ width: `${Math.min(100, investorReturns.thresholdProgress * 100)}%` }} />
                          </div>
                          <p className="text-accent-gold font-display font-semibold text-sm">{(investorReturns.thresholdProgress * 100).toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-text-muted text-xs uppercase tracking-wider mb-1">{investorReturns.isThresholdMet ? 'Achieved' : 'Status'}</p>
                          <p className="text-text-primary font-display font-bold text-lg">{investorReturns.isThresholdMet ? `Year ${investorReturns.thresholdYear}` : 'In Progress'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Accelerated Stream Cards */}
              <motion.div variants={fadeUp}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {(() => {
                    const peakFor = (key: 'homeServicesDistribution' | 'solarRealEstateDistribution' | 'aerialDistribution') => {
                      let idx = 0
                      let val = 0
                      investorReturns.annualReturns.forEach((r, i) => {
                        if (r[key] > val) { val = r[key]; idx = i }
                      })
                      return { year: idx + 1, value: val }
                    }
                    const hsPeak = peakFor('homeServicesDistribution')
                    const rePeak = peakFor('solarRealEstateDistribution')
                    const aerialPeak = peakFor('aerialDistribution')
                    return [
                      { division: 'Home Services', color: DIVISION_COLORS.homeServices, share: '15%', desc: 'of Home Services profits until 65% threshold is reached',
                        y1: investorReturns.annualReturns[0].homeServicesDistribution, peak: hsPeak,
                        cumulative: investorReturns.annualReturns.reduce((s, r) => s + r.homeServicesDistribution, 0) },
                      { division: 'Real Estate', color: DIVISION_COLORS.realEstate, share: '20%', desc: 'of Real Estate profits until 65% threshold is reached',
                        y1: investorReturns.annualReturns[0].solarRealEstateDistribution, peak: rePeak,
                        cumulative: investorReturns.annualReturns.reduce((s, r) => s + r.solarRealEstateDistribution, 0) },
                      { division: 'Aerial Insights', color: DIVISION_COLORS.aerialInsights, share: '10%', desc: 'of Aerial Insights profits until 65% threshold is reached',
                        y1: investorReturns.annualReturns[0].aerialDistribution, peak: aerialPeak,
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
                          <div className="flex justify-between"><span className="text-text-muted text-xs">Peak Year (Y{stream.peak.year})</span><span className="text-text-primary font-display font-semibold text-sm">{formatCurrency(stream.peak.value)}</span></div>
                          <div className="flex justify-between pt-2 border-t border-surface-border/30">
                            <span className="text-text-muted text-xs font-medium">5-Year Total</span>
                            <span className="text-accent-gold font-display font-bold text-base">{formatCurrency(stream.cumulative)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  })()}
                </div>
              </motion.div>

              {/* Accelerated Phase Chart */}
              <motion.div variants={fadeUp}>
                <ChartCard title="Accelerated Distributions by Source" subtitle="Annual profit-share income until threshold is met">
                  <StackedBarChart data={acceleratedDistributionData} bars={[
                    { key: 'Home Services', label: 'Home Services (15%)', color: DIVISION_COLORS.homeServices },
                    { key: 'Solar & RE', label: 'Real Estate (20%)', color: DIVISION_COLORS.solar },
                    { key: 'Aerial', label: 'Aerial Insights (10%)', color: DIVISION_COLORS.aerialInsights },
                  ]} height={340} />
                </ChartCard>
              </motion.div>

              {/* ══════════════════════════════════════════════════════════
                  SECTION B — LONG-TERM RESIDUAL RETURNS
                  ══════════════════════════════════════════════════════════ */}
              <motion.div variants={fadeUp}>
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-accent-gold/20" /></div>
                  <div className="relative flex justify-center">
                    <span className="bg-surface px-6 text-accent-gold text-xs uppercase tracking-[0.2em] font-semibold">Phase 2 — Long-Term Residual Returns</span>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeUp}>
                <div className="luxury-card p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-bold text-white bg-emerald-600 px-2.5 py-1 rounded-full uppercase tracking-wider">Permanent</span>
                    <span className="text-text-muted text-xs">Continues after accelerated threshold is met</span>
                  </div>
                  <h3 className="font-display font-bold text-text-primary text-xl mb-3">Long-Term Residual Income Streams</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    After {formatCurrency(investorReturns.thresholdTarget)} total has been returned, the investor retains two permanent income streams
                    that continue generating returns indefinitely.
                  </p>
                </div>
              </motion.div>

              {/* Residual Stream Cards */}
              <motion.div variants={fadeUp}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="luxury-card p-6 relative overflow-hidden group hover:border-surface-light transition-all duration-300">
                    <div className="absolute top-0 left-0 w-full h-1 opacity-80 bg-emerald-500" />
                    <div className="flex items-center gap-2 mb-4 mt-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-text-primary text-sm font-semibold">SREC Revenue</span>
                    </div>
                    <span className="text-accent-gold font-display font-bold text-4xl">50%</span>
                    <p className="text-text-muted text-xs mb-5 mt-2">
                      of all SREC revenue from solar assets built during the 5-year deployment window — for the full 20-year life of each contract/cohort
                    </p>
                    <div className="space-y-2.5 pt-4 border-t border-surface-border/40">
                      <div className="flex justify-between"><span className="text-text-muted text-xs">Year 1</span><span className="text-text-primary font-display font-semibold text-sm">{formatCurrency(investorReturns.annualReturns[0].srecDistribution)}</span></div>
                      <div className="flex justify-between"><span className="text-text-muted text-xs">Year 5</span><span className="text-text-primary font-display font-semibold text-sm">{formatCurrency(investorReturns.annualReturns[4].srecDistribution)}</span></div>
                      <div className="flex justify-between pt-2 border-t border-surface-border/30">
                        <span className="text-text-muted text-xs font-medium">5-Year SREC Total</span>
                        <span className="text-accent-gold font-display font-bold text-base">{formatCurrency(investorReturns.totalSRECDistributed)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted text-xs font-medium">20-Year SREC Total</span>
                        <span className="text-accent-gold font-display font-bold text-base">{formatCurrency(longTermSREC.totalInvestorSRECIncome)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="luxury-card p-6 relative overflow-hidden group hover:border-surface-light transition-all duration-300">
                    <div className="absolute top-0 left-0 w-full h-1 opacity-80" style={{ backgroundColor: DIVISION_COLORS.aerialInsights }} />
                    <div className="flex items-center gap-2 mb-4 mt-1">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DIVISION_COLORS.aerialInsights }} />
                      <span className="text-text-primary text-sm font-semibold">Aerial Insights Residual</span>
                    </div>
                    <span className="text-accent-gold font-display font-bold text-4xl">3%</span>
                    <p className="text-text-muted text-xs mb-5 mt-2">
                      of Aerial Insights revenue as a permanent residual participation — continues indefinitely after the accelerated phase ends
                    </p>
                    <div className="space-y-2.5 pt-4 border-t border-surface-border/40">
                      <div className="flex justify-between"><span className="text-text-muted text-xs">Status</span><span className="text-text-primary font-display font-semibold text-sm">{investorReturns.isThresholdMet ? 'Active (post-threshold)' : 'Activates after threshold'}</span></div>
                      <div className="flex justify-between"><span className="text-text-muted text-xs">Annual (at Y5 scale)</span><span className="text-text-primary font-display font-semibold text-sm">{formatCurrency(years[4].portfolio.aerialProfit * 0.03)}</span></div>
                      <div className="flex justify-between pt-2 border-t border-surface-border/30">
                        <span className="text-text-muted text-xs font-medium">5-Year Residual Total</span>
                        <span className="text-accent-gold font-display font-bold text-base">{formatCurrency(investorReturns.totalAerialResidualDistributed)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 20-Year SREC Model */}
              <motion.div variants={fadeUp}>
                <div className="relative overflow-hidden rounded-2xl border border-accent-gold/15 bg-gradient-to-br from-surface-elevated via-surface-elevated to-surface-hover p-8 md:p-10">
                  <div className="absolute top-0 left-0 w-64 h-64 bg-accent-green/[0.03] rounded-full -translate-y-1/2 -translate-x-1/4 blur-3xl" />
                  <div className="relative">
                    <p className="text-accent-gold text-xs uppercase tracking-[0.2em] font-semibold mb-2">20-Year Investor SREC Income</p>
                    <h2 className="font-display font-bold text-text-primary text-3xl md:text-4xl lg:text-5xl mb-2">{formatCurrency(longTermSREC.totalInvestorSRECIncome)}</h2>
                    <p className="text-text-secondary text-sm mb-8 max-w-2xl">
                      The investor retains <span className="text-accent-gold font-semibold">{(longTermSREC.investorEquityShare * 100).toFixed(0)}% equity</span> in
                      all SREC revenue from solar installations originated during the 5-year deployment period.
                      Each contract runs for 20 years from the date of installation.
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
                        <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Total Installs</p>
                        <p className="text-text-primary font-display font-bold text-xl">{longTermSREC.cohorts.reduce((s, c) => s + c.installCount, 0)}</p>
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
                        Solar installations originated during the initial 5-year deployment period each produce SREC revenue for their full 20-year operating life.
                        The investor retains <span className="text-accent-gold font-semibold">50% equity</span> in the SREC economics of every install cohort built during this window.
                      </p>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        Each annual install cohort begins producing SRECs immediately — no build delay. As marketing spend ramps monthly, each year's cohort grows larger, and the return stream stacks to create compounding annual income.
                      </p>
                    </div>
                    <div className="space-y-3">
                      {longTermSREC.cohorts.map((c) => (
                        <div key={c.buildYear} className="flex items-center justify-between py-2.5 px-4 rounded-lg bg-surface/30 border border-surface-border/30">
                          <div>
                            <span className="text-text-primary text-sm font-semibold">Year {c.buildYear} Installs</span>
                            <span className="text-text-muted text-xs ml-2">{c.installCount} installs</span>
                          </div>
                          <div className="text-right">
                            <span className="text-text-muted text-xs">Y{c.startYear}–Y{c.endYear}</span>
                            <span className="text-accent-gold font-display font-semibold text-sm ml-3">
                              {formatCurrency(c.annualSRECRevenue * longTermSREC.investorEquityShare)}/yr
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
                  <ChartCard title="Annual SREC Income by Cohort" subtitle="Investor's 50% equity share, stacked by install cohort">
                    <StackedBarChart data={srecChartData} bars={srecCohortBars} height={400} />
                  </ChartCard>
                  <ChartCard title="Cumulative SREC Income" subtitle="Total investor SREC earnings over time">
                    <AreaChartComponent data={srecCumulativeData} dataKey="cumulative" color="#c9a84c" height={400} />
                  </ChartCard>
                </div>
              </motion.div>

              {/* ══════════════════════════════════════════════════════════
                  COMBINED SUMMARY — All Streams
                  ══════════════════════════════════════════════════════════ */}
              <motion.div variants={fadeUp}>
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-accent-gold/20" /></div>
                  <div className="relative flex justify-center">
                    <span className="bg-surface px-6 text-accent-gold text-xs uppercase tracking-[0.2em] font-semibold">Combined 5-Year Return Summary</span>
                  </div>
                </div>
              </motion.div>

              {/* Charts + Cumulative */}
              <motion.div variants={fadeUp}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ChartCard title="Annual Distributions — All Streams" subtitle="Complete investor income by source, each year">
                    <StackedBarChart data={distributionData} bars={[
                      { key: 'Home Services', label: 'Home Services (15%)', color: DIVISION_COLORS.homeServices },
                      { key: 'Solar & RE', label: 'Solar & RE (20%)', color: DIVISION_COLORS.solar },
                      { key: 'Aerial (Accel.)', label: 'Aerial (10%)', color: DIVISION_COLORS.aerialInsights },
                      { key: 'SREC (50%)', label: 'SREC (50%)', color: DIVISION_COLORS.realEstate },
                      { key: 'Aerial Residual (3%)', label: 'Aerial Residual (3%)', color: '#818cf8' },
                    ]} height={380} />
                  </ChartCard>
                  <ChartCard title="Cumulative Return vs. Threshold" subtitle="Total accumulated returns including all streams">
                    <RevenueLineChart data={cumulativeData} lines={[
                      { key: 'cumulative', label: 'Cumulative Returns', color: '#c9a84c' },
                      { key: 'hurdle', label: '65% Threshold', color: '#ef4444' },
                    ]} height={380} />
                  </ChartCard>
                </div>
              </motion.div>

              {/* Annual Return Totals Strip */}
              <motion.div variants={fadeUp}>
                <div className="luxury-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-display font-semibold text-text-primary text-sm">Annual Return Totals</h4>
                    <span className="text-text-muted text-xs">All streams combined</span>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {investorReturns.annualReturns.map((r) => (
                      <div key={r.year} className={`text-center rounded-lg p-3 ${r.thresholdMetThisYear ? 'bg-accent-gold/10 border border-accent-gold/30' : 'bg-surface/40 border border-surface-border/30'}`}>
                        <p className="text-text-muted text-xs mb-1">Year {r.year}</p>
                        <p className={`font-display font-bold text-lg ${r.thresholdMetThisYear ? 'text-accent-gold' : 'text-text-primary'}`}>
                          {formatCurrency(r.totalReturnThisYear)}
                        </p>
                        {r.thresholdMetThisYear && <p className="text-accent-gold text-[10px] uppercase tracking-wider font-bold mt-1">Threshold Met</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Complete 5-Year Return Table */}
              <motion.div variants={fadeUp}>
                <div className="luxury-card overflow-x-auto">
                  <div className="flex items-baseline justify-between mb-5">
                    <h3 className="font-display font-bold text-text-primary text-xl">5-Year Return Schedule</h3>
                    <span className="text-text-muted text-xs">All values reflect live model inputs</span>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-surface-border">
                        {['Year', 'Home Svc (15%)', 'Solar/RE (20%)', 'Aerial (10%)', 'SREC (50%)', 'Aerial Res. (3%)', 'Annual Total', 'Cumulative'].map((h) => (
                          <th key={h} className={`${h === 'Year' ? 'text-left pr-4' : 'text-right px-2'} text-text-muted font-semibold py-3 text-xs uppercase tracking-wider`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {investorReturns.annualReturns.map((r) => (
                        <tr key={r.year} className={r.thresholdMetThisYear ? 'border-b border-accent-gold/30 bg-accent-gold/[0.04]' : 'border-b border-surface-border/40'}>
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-2">
                              <span className="text-text-primary font-display font-semibold">Year {r.year}</span>
                              {r.thresholdMetThisYear && <span className="text-[10px] font-bold text-surface-elevated bg-accent-gold px-2 py-0.5 rounded-full uppercase tracking-wider">Threshold Met</span>}
                            </div>
                          </td>
                          <td className="text-right text-text-primary py-4 px-2 font-medium">{r.homeServicesDistribution > 0 ? formatCurrency(r.homeServicesDistribution) : <span className="text-text-dim">—</span>}</td>
                          <td className="text-right text-text-primary py-4 px-2 font-medium">{r.solarRealEstateDistribution > 0 ? formatCurrency(r.solarRealEstateDistribution) : <span className="text-text-dim">—</span>}</td>
                          <td className="text-right text-text-primary py-4 px-2 font-medium">{r.aerialDistribution > 0 ? formatCurrency(r.aerialDistribution) : <span className="text-text-dim">—</span>}</td>
                          <td className="text-right py-4 px-2 font-medium">
                            {r.srecDistribution > 0 ? <span className="text-accent-gold">{formatCurrency(r.srecDistribution)}</span> : <span className="text-text-dim">—</span>}
                          </td>
                          <td className="text-right py-4 px-2 font-medium">
                            {r.aerialResidualDistribution > 0 ? <span className="text-indigo-400">{formatCurrency(r.aerialResidualDistribution)}</span> : <span className="text-text-dim">—</span>}
                          </td>
                          <td className="text-right text-text-primary py-4 px-2 font-display font-semibold">{formatCurrency(r.totalReturnThisYear)}</td>
                          <td className="text-right text-accent-gold py-4 pl-2 font-display font-bold text-base">{formatCurrency(r.cumulativeTotalReturn)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-accent-gold/30">
                        <td className="py-4 pr-4"><span className="text-accent-gold font-display font-bold">Total</span></td>
                        <td className="text-right text-text-primary py-4 px-2 font-display font-semibold">{formatCurrency(investorReturns.annualReturns.reduce((s, r) => s + r.homeServicesDistribution, 0))}</td>
                        <td className="text-right text-text-primary py-4 px-2 font-display font-semibold">{formatCurrency(investorReturns.annualReturns.reduce((s, r) => s + r.solarRealEstateDistribution, 0))}</td>
                        <td className="text-right text-text-primary py-4 px-2 font-display font-semibold">{formatCurrency(investorReturns.annualReturns.reduce((s, r) => s + r.aerialDistribution, 0))}</td>
                        <td className="text-right text-accent-gold py-4 px-2 font-display font-semibold">{formatCurrency(investorReturns.totalSRECDistributed)}</td>
                        <td className="text-right text-indigo-400 py-4 px-2 font-display font-semibold">{formatCurrency(investorReturns.totalAerialResidualDistributed)}</td>
                        <td colSpan={2} className="text-right text-accent-gold py-4 pl-2 font-display font-bold text-lg">{formatCurrency(investorReturns.totalDistributed)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </motion.div>

              <motion.div variants={fadeUp}>
                <div className="text-center py-4">
                  <p className="text-text-muted text-xs uppercase tracking-[0.15em] mb-2">Return Structure Summary</p>
                  <p className="text-text-secondary text-sm max-w-2xl mx-auto leading-relaxed">
                    All returns are dynamically calculated from the live financial model. Adjusting assumptions updates every projection in real time.
                    Accelerated distributions end when {formatCurrency(investorReturns.thresholdTarget)} total has been returned. SREC participation (50%) and Aerial residual (3%) continue permanently.
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
                                <span className="text-accent-gold font-display font-semibold">{formatCurrencyPrecise(cat.total)}</span>
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
                      <ChartCard title={`${selectedCategory.label} Breakdown`} subtitle={formatCurrencyPrecise(selectedCategory.total)}>
                        <DonutChart
                          data={drillDownChartData!}
                          centerLabel={selectedCategory.label.split(' ')[0]}
                          centerValue={formatCurrencyPrecise(selectedCategory.total)}
                        />
                      </ChartCard>
                      <div className="space-y-2">
                        {selectedCategory.items.map((item) => {
                          const outputs = DEPLOYMENT_OUTPUTS[selectedCategory.key]?.[item.label]
                          const simConfig = SIMULATION_CONFIGS[selectedCategory.key]?.[item.label]
                          return (
                            <div key={item.label} className="luxury-card p-4">
                              <div className={outputs ? 'flex flex-col lg:flex-row gap-4' : ''}>
                                <div className={outputs ? 'flex-1 min-w-0' : ''}>
                                  <div className="flex justify-between items-baseline mb-1.5">
                                    <span className="text-text-primary text-sm font-semibold">{item.label}</span>
                                    <span className="text-accent-gold font-display font-semibold text-sm">{formatCurrencyPrecise(item.amount)}</span>
                                  </div>
                                  <p className="text-text-muted text-xs">{item.why}</p>
                                </div>
                                {outputs && (
                                  <div className="w-full lg:w-56 flex-shrink-0">
                                    <DeploymentOutputCard allocation={item.amount} outputs={outputs} />
                                  </div>
                                )}
                              </div>
                              {simConfig && outputs && (
                                <SimulationPanel
                                  config={simConfig}
                                  baseQuantity={Math.floor((outputs[0].allocationOverride ?? item.amount) / outputs[0].unitCost)}
                                  allocation={item.amount}
                                />
                              )}
                            </div>
                          )
                        })}
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
