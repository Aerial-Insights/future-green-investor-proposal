import { motion } from 'framer-motion'
import ChartCard from '../../components/data-display/ChartCard'
import RevenueLineChart from '../../components/charts/RevenueLineChart'
import StackedBarChart from '../../components/charts/StackedBarChart'
import DonutChart from '../../components/charts/DonutChart'
import AreaChartComponent from '../../components/charts/AreaChartComponent'
import { useCalculations, useInvestorReturns, useLongTermSREC } from '../../hooks/useCalculations'
import { useAssumptionsStore } from '../../store/useAssumptionsStore'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatPercent } from '../../utils/formatPercent'
import { DIVISION_COLORS } from '../../theme/chartTheme'
import SuretyBondSection from '../../components/sections/SuretyBondSection'

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

interface Props {
  activeTab: string
}

export default function PercentageBackView({ activeTab }: Props) {
  const years = useCalculations()
  const investorReturns = useInvestorReturns()
  const longTermSREC = useLongTermSREC()
  const config = useAssumptionsStore((s) => s.assumptions.financialModelOption.percentageBack)
  const y1 = years[0]
  const y5 = years[4]

  // Pull all percentages from config so unlock-mode edits flow through visually
  const hsSharePct = formatPercent(config.homeServicesShare)
  const solarReSharePct = formatPercent(config.solarRealEstateShare)
  const aerialSharePct = formatPercent(config.aerialShare)
  const srecSharePct = formatPercent(config.srecShare)
  const aerialResSharePct = formatPercent(config.aerialResidualShare)
  const returnPct = `${Math.round((config.returnThresholdMultiple - 1) * 100)}%`

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

  const acceleratedDistributionData = investorReturns.annualReturns.map((r) => ({
    name: `Year ${r.year}`,
    'Home Services': r.homeServicesDistribution,
    'Solar & RE': r.solarRealEstateDistribution,
    Aerial: r.aerialDistribution,
    total: r.homeServicesDistribution + r.solarRealEstateDistribution + r.aerialDistribution,
  }))

  const distributionData = investorReturns.annualReturns.map((r) => ({
    name: `Year ${r.year}`,
    'Home Services': r.homeServicesDistribution,
    'Solar & RE': r.solarRealEstateDistribution,
    'Aerial (Accel.)': r.aerialDistribution,
    [`SREC (${srecSharePct})`]: r.srecDistribution,
    [`Aerial Residual (${aerialResSharePct})`]: r.aerialResidualDistribution,
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

  return (
    <>
      {activeTab === 'overview' && (
        <motion.div className="space-y-8" variants={stagger} initial="hidden" animate="visible">
          <motion.div variants={fadeUp}>
            <div className="relative overflow-hidden rounded-2xl border border-accent-gold/20 bg-gradient-to-br from-surface-elevated via-surface-elevated to-surface-hover p-8 md:p-12">
              <div className="absolute top-0 right-0 w-96 h-96 bg-accent-gold/[0.04] rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-gold/[0.02] rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-[10px] font-bold text-surface-elevated bg-accent-gold px-3 py-1.5 rounded-full uppercase tracking-wider">$40M Capital Raise</span>
                  <span className="text-accent-gold text-xs uppercase tracking-[0.2em] font-semibold">Capped Return Structure</span>
                </div>
                <h2 className="font-display font-bold text-text-primary text-4xl md:text-5xl mb-3 leading-tight">Three engines.<br className="hidden md:block" /> One compounding portfolio.</h2>
                <p className="text-text-secondary text-base leading-relaxed max-w-3xl mb-10">
                  This model prioritizes investor repayment until the {returnPct} return threshold is reached, then transitions into permanent residual economics.
                  Home Services generates immediate cash flow. Real Estate builds long-duration, asset-backed income. Aerial Insights compounds recurring SaaS revenue.
                  Together, they scale from {formatCurrency(y1.portfolio.totalProfit)} in Year 1 to {formatCurrency(y5.portfolio.totalProfit)} by Year 5 —
                  a <span className="text-accent-gold font-semibold">{profitGrowthMultiple.toFixed(1)}x</span> growth trajectory
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
                    <p className="text-text-muted text-[10px] uppercase tracking-wider mb-2">Time to {returnPct} Return</p>
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

          <motion.div variants={fadeUp}>
            <SuretyBondSection />
          </motion.div>

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

      {activeTab === 'returns' && (
        <motion.div className="space-y-10" variants={stagger} initial="hidden" animate="visible">
          <motion.div variants={fadeUp}>
            <div className="relative overflow-hidden rounded-2xl border border-accent-gold/20 bg-gradient-to-br from-surface-elevated via-surface-elevated to-surface-hover p-8 md:p-10">
              <div className="absolute top-0 right-0 w-72 h-72 bg-accent-gold/[0.03] rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-56 h-56 bg-accent-gold/[0.02] rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
              <div className="relative">
                <p className="text-accent-gold text-xs uppercase tracking-[0.2em] font-semibold mb-2">Time to {returnPct} Return</p>
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
                    <p className="text-text-muted text-xs uppercase tracking-wider mb-1">{returnPct} Threshold Target</p>
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

          <motion.div variants={fadeUp}>
            <div className="luxury-card p-6 md:p-8 border-accent-gold/15">
              <h3 className="font-display font-bold text-text-primary text-xl mb-5">How Your Returns Work</h3>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-8 items-start">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[10px] font-bold text-surface-elevated bg-accent-gold px-2.5 py-1 rounded-full uppercase tracking-wider">Phase 1</span>
                    <span className="text-text-primary text-sm font-semibold">Accelerated Distributions</span>
                  </div>
                  <p className="text-text-secondary text-xs leading-relaxed mb-4">
                    The investor receives profit-share distributions from three revenue streams plus {srecSharePct} of SREC income until cumulative total returns reach {formatCurrency(investorReturns.thresholdTarget)} — a {returnPct} return on the {formatCurrency(investorReturns.totalCapital)} investment ({formatCurrency(investorReturns.totalCapital)} principal plus {formatCurrency(investorReturns.thresholdTarget - investorReturns.totalCapital)} profit).
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-surface/40 border border-surface-border/30">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: DIVISION_COLORS.homeServices }} />
                      <div className="flex-1">
                        <span className="text-text-primary text-sm font-semibold">{hsSharePct}</span>
                        <span className="text-text-muted text-xs ml-2">of Home Services profits</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-surface/40 border border-surface-border/30">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: DIVISION_COLORS.realEstate }} />
                      <div className="flex-1">
                        <span className="text-text-primary text-sm font-semibold">{solarReSharePct}</span>
                        <span className="text-text-muted text-xs ml-2">of Solar & Real Estate profits</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-surface/40 border border-surface-border/30">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: DIVISION_COLORS.aerialInsights }} />
                      <div className="flex-1">
                        <span className="text-text-primary text-sm font-semibold">{aerialSharePct}</span>
                        <span className="text-text-muted text-xs ml-2">of Aerial Insights profits</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-surface/40 border border-surface-border/30">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-emerald-500" />
                      <div className="flex-1">
                        <span className="text-text-primary text-sm font-semibold">{srecSharePct}</span>
                        <span className="text-text-muted text-xs ml-2">of SREC revenue (counts toward threshold)</span>
                      </div>
                    </div>
                  </div>
                </div>
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
                        <span className="text-text-primary text-sm font-semibold">{srecSharePct}</span>
                        <span className="text-text-muted text-xs ml-2">of SREC revenue — 20-year contracts</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-surface/40 border border-surface-border/30">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: DIVISION_COLORS.aerialInsights }} />
                      <div className="flex-1">
                        <span className="text-text-primary text-sm font-semibold">{aerialResSharePct}</span>
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
                    representing {formatCurrency(investorReturns.totalCapital)} principal returned plus a {returnPct} profit ({formatCurrency(investorReturns.thresholdTarget - investorReturns.totalCapital)}).
                    Once that threshold is reached, the three accelerated streams stop entirely and are replaced by long-term residual income.
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
                  { division: 'Home Services', color: DIVISION_COLORS.homeServices, share: hsSharePct, desc: `of Home Services profits until ${returnPct} threshold is reached`,
                    y1: investorReturns.annualReturns[0].homeServicesDistribution, peak: hsPeak,
                    cumulative: investorReturns.annualReturns.reduce((s, r) => s + r.homeServicesDistribution, 0) },
                  { division: 'Real Estate', color: DIVISION_COLORS.realEstate, share: solarReSharePct, desc: `of Real Estate profits until ${returnPct} threshold is reached`,
                    y1: investorReturns.annualReturns[0].solarRealEstateDistribution, peak: rePeak,
                    cumulative: investorReturns.annualReturns.reduce((s, r) => s + r.solarRealEstateDistribution, 0) },
                  { division: 'Aerial Insights', color: DIVISION_COLORS.aerialInsights, share: aerialSharePct, desc: `of Aerial Insights profits until ${returnPct} threshold is reached`,
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

          <motion.div variants={fadeUp}>
            <ChartCard title="Accelerated Distributions by Source" subtitle="Annual profit-share income until threshold is met">
              <StackedBarChart data={acceleratedDistributionData} bars={[
                { key: 'Home Services', label: `Home Services (${hsSharePct})`, color: DIVISION_COLORS.homeServices },
                { key: 'Solar & RE', label: `Real Estate (${solarReSharePct})`, color: DIVISION_COLORS.solar },
                { key: 'Aerial', label: `Aerial Insights (${aerialSharePct})`, color: DIVISION_COLORS.aerialInsights },
              ]} height={340} />
            </ChartCard>
          </motion.div>

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

          <motion.div variants={fadeUp}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="luxury-card p-6 relative overflow-hidden group hover:border-surface-light transition-all duration-300">
                <div className="absolute top-0 left-0 w-full h-1 opacity-80 bg-emerald-500" />
                <div className="flex items-center gap-2 mb-4 mt-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-text-primary text-sm font-semibold">SREC Revenue</span>
                </div>
                <span className="text-accent-gold font-display font-bold text-4xl">{srecSharePct}</span>
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
                <span className="text-accent-gold font-display font-bold text-4xl">{aerialResSharePct}</span>
                <p className="text-text-muted text-xs mb-5 mt-2">
                  of Aerial Insights revenue as a permanent residual participation — continues indefinitely after the accelerated phase ends
                </p>
                <div className="space-y-2.5 pt-4 border-t border-surface-border/40">
                  <div className="flex justify-between"><span className="text-text-muted text-xs">Status</span><span className="text-text-primary font-display font-semibold text-sm">{investorReturns.isThresholdMet ? 'Active (post-threshold)' : 'Activates after threshold'}</span></div>
                  <div className="flex justify-between"><span className="text-text-muted text-xs">Annual (at Y5 scale)</span><span className="text-text-primary font-display font-semibold text-sm">{formatCurrency(years[4].portfolio.aerialProfit * config.aerialResidualShare)}</span></div>
                  <div className="flex justify-between pt-2 border-t border-surface-border/30">
                    <span className="text-text-muted text-xs font-medium">5-Year Residual Total</span>
                    <span className="text-accent-gold font-display font-bold text-base">{formatCurrency(investorReturns.totalAerialResidualDistributed)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-accent-gold/20" /></div>
              <div className="relative flex justify-center">
                <span className="bg-surface px-6 text-accent-gold text-xs uppercase tracking-[0.2em] font-semibold">Combined 5-Year Return Summary</span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Annual Distributions — All Streams" subtitle="Complete investor income by source, each year">
                <StackedBarChart data={distributionData} bars={[
                  { key: 'Home Services', label: `Home Services (${hsSharePct})`, color: DIVISION_COLORS.homeServices },
                  { key: 'Solar & RE', label: `Solar & RE (${solarReSharePct})`, color: DIVISION_COLORS.solar },
                  { key: 'Aerial (Accel.)', label: `Aerial (${aerialSharePct})`, color: DIVISION_COLORS.aerialInsights },
                  { key: `SREC (${srecSharePct})`, label: `SREC (${srecSharePct})`, color: DIVISION_COLORS.realEstate },
                  { key: `Aerial Residual (${aerialResSharePct})`, label: `Aerial Residual (${aerialResSharePct})`, color: '#818cf8' },
                ]} height={380} />
              </ChartCard>
              <ChartCard title="Cumulative Return vs. Threshold" subtitle="Total accumulated returns including all streams">
                <RevenueLineChart data={cumulativeData} lines={[
                  { key: 'cumulative', label: 'Cumulative Returns', color: '#c9a84c' },
                  { key: 'hurdle', label: `${returnPct} Threshold`, color: '#ef4444' },
                ]} height={380} />
              </ChartCard>
            </div>
          </motion.div>

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

          <motion.div variants={fadeUp}>
            <div className="luxury-card overflow-x-auto">
              <div className="flex items-baseline justify-between mb-5">
                <h3 className="font-display font-bold text-text-primary text-xl">5-Year Return Schedule</h3>
                <span className="text-text-muted text-xs">All values reflect live model inputs</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-surface-border">
                    {['Year', `Home Svc (${hsSharePct})`, `Solar/RE (${solarReSharePct})`, `Aerial (${aerialSharePct})`, `SREC (${srecSharePct})`, `Aerial Res. (${aerialResSharePct})`, 'Annual Total', 'Cumulative'].map((h) => (
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
                Accelerated distributions end when {formatCurrency(investorReturns.thresholdTarget)} total has been returned. SREC participation ({srecSharePct}) and Aerial residual ({aerialResSharePct}) continue permanently.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}
