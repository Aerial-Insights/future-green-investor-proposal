import PageShell from '../components/layout/PageShell'
import HeroSection from '../components/sections/HeroSection'
import MetricStrip from '../components/data-display/MetricStrip'
import ChartCard from '../components/data-display/ChartCard'
import DonutChart from '../components/charts/DonutChart'
import PlatformArchitecture from '../components/diagrams/PlatformArchitecture'
import PreviewCardGrid from '../components/sections/PreviewCardGrid'
import StrategicSummary from '../components/sections/StrategicSummary'
import SystemFlow from '../components/diagrams/SystemFlow'
import NavigationGuide from '../components/sections/NavigationGuide'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '../theme/animations'
import { useCalculations, useInvestorReturns } from '../hooks/useCalculations'
import { useAssumptionsStore } from '../store/useAssumptionsStore'
import { OVERVIEW, PLATFORM_NAME, HERO_SUBTITLE, CAPITAL_RAISE, GEOGRAPHY, RETURN_WINDOW } from '../data/investorPortal/content'
import { formatCurrency } from '../utils/formatCurrency'
import { DIVISION_COLORS } from '../theme/chartTheme'

export default function Overview() {
  const years = useCalculations()
  const assumptions = useAssumptionsStore((s) => s.assumptions)
  const investorReturns = useInvestorReturns()
  const y5 = years[4]

  const executiveMetrics = [
    { label: 'Capital Targeted', value: assumptions.capital.totalCapitalRaise, format: 'currency' as const, explanationKey: 'capitalDeployment' },
    { label: 'Business Divisions', value: 4, format: 'number' as const },
    { label: 'Year 5 Profit', value: y5.portfolio.totalProfit, format: 'currency' as const, explanationKey: 'totalRevenue' },
    { label: 'Target Jobs Created', value: 500, format: 'number' as const, suffix: '+' },
    { label: 'Target Geography', value: 0, format: 'number' as const },
    { label: 'Technology Moat', value: 0, format: 'number' as const },
  ]

  // Override the last two with string display (handled via prefix)
  const displayMetrics = executiveMetrics.slice(0, 4)

  const c = assumptions.capital
  const capitalData = [
    { name: 'Distributed Solar', value: c.distributedSolar, color: DIVISION_COLORS.solar },
    { name: 'Home Services', value: c.homeServices, color: DIVISION_COLORS.homeServices },
    { name: 'Marketing', value: c.marketing, color: '#525252' },
    { name: 'Aerial Insights', value: c.aerialInsights, color: DIVISION_COLORS.aerialInsights },
    { name: 'Wholesale Pipeline', value: c.wholesalePipeline, color: '#40916c' },
    { name: 'Housing', value: c.lowIncomeHousing, color: DIVISION_COLORS.realEstate },
    { name: 'Strategic Partnerships', value: c.strategicPartnerships, color: '#8b5cf6' },
  ]

  const previewCards = [
    { title: 'Home Services', description: 'Immediate cash flow through roofing, insulation, HVAC, and grant-backed energy services.', to: '/home-services', accent: DIVISION_COLORS.homeServices },
    { title: 'Real Estate', description: 'Distributed solar portfolio, wholesale pipeline, housing development, and subdivision.', to: '/solar-real-estate', accent: DIVISION_COLORS.realEstate },
    { title: 'Aerial Insights', description: 'Proprietary AI platform for property intelligence, lead generation, and SaaS monetization.', to: '/aerial-insights', accent: DIVISION_COLORS.aerialInsights },
    { title: 'Financial Model', description: 'Full portfolio projections with annual revenue, profitability, and capital deployment analysis.', to: '/financial-model', accent: '#d4d4d8' },
    { title: 'Assumptions Lab', description: 'Adjust key business levers and see live updates to revenue, profit, and return projections.', to: '/assumptions-lab', accent: '#f59e0b' },
  ]

  return (
    <PageShell fullWidth>
      {/* Hero */}
      <HeroSection
        title={OVERVIEW.headline}
        subtitle={HERO_SUBTITLE}
        thesis={OVERVIEW.introCopy}
        stats={[
          { label: 'Capital Raise', value: CAPITAL_RAISE },
          { label: 'Geography', value: 'Mid-Atlantic & SE' },
          { label: 'Time to 65% Return', value: investorReturns.isThresholdMet ? `Year ${investorReturns.thresholdYear}` : `${(investorReturns.thresholdProgress * 100).toFixed(0)}%` },
          { label: 'Y5 Profit Target', value: formatCurrency(y5.portfolio.totalProfit) },
        ]}
        primaryCta={{ label: 'Explore the Platform', to: '/home-services' }}
        secondaryCta={{ label: 'View Financial Model', to: '/financial-model' }}
        tertiaryCta={{ label: 'Adjust Assumptions', to: '/assumptions-lab' }}
        featuredCta={{
          caption: 'Private Investor Document',
          label: 'Read the Confidential Investment Memorandum',
          to: '/investor-memo',
        }}
      />

      <div className="section-container py-16 space-y-20">
        {/* Platform Overview — Strategic Summary */}
        <StrategicSummary />

        {/* Executive Summary Metrics */}
        <section>
          <h2 className="font-display font-bold text-text-primary text-2xl mb-6">Executive Summary</h2>
          <MetricStrip metrics={displayMetrics} columns={4} />
        </section>

        {/* How It Works — System Flow */}
        <SystemFlow />

        {/* Platform Architecture */}
        <section>
          <PlatformArchitecture />
        </section>

        {/* How to Navigate This Proposal */}
        <NavigationGuide />

        {/* Why This Wins */}
        <section>
          <h2 className="font-display font-bold text-text-primary text-2xl mb-8">Why This Wins</h2>
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {OVERVIEW.whyThisWins.map((item) => (
              <motion.div key={item.title} variants={staggerItem} className="luxury-card">
                <div className="w-8 h-1 rounded-full bg-accent-gold mb-4" />
                <h3 className="font-display font-semibold text-text-primary mb-2">{item.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Capital Deployment */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChartCard title="Capital Deployment" subtitle="How the $40M raise is allocated" explanationKey="capitalDeployment">
              <DonutChart
                data={capitalData}
                height={320}
                centerLabel="Total Raise"
                centerValue={CAPITAL_RAISE}
              />
            </ChartCard>
            <div className="space-y-4">
              <h3 className="font-display font-semibold text-text-primary text-lg">Deployment Breakdown</h3>
              {capitalData.map((item) => (
                <div key={item.name} className="flex items-center justify-between py-2 border-b border-surface-border">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-text-secondary text-sm">{item.name}</span>
                  </div>
                  <span className="font-display font-semibold text-text-primary text-sm">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Preview Cards */}
        <section>
          <h2 className="font-display font-bold text-text-primary text-2xl mb-8">Explore the Platform</h2>
          <PreviewCardGrid cards={previewCards} />
        </section>
      </div>
    </PageShell>
  )
}
