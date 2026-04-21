import { useState } from 'react'
import PageShell from '../components/layout/PageShell'
import SectionBanner from '../components/sections/SectionBanner'
import StickyTabNav from '../components/layout/StickyTabNav'
import MetricStrip from '../components/data-display/MetricStrip'
import MetricCard from '../components/data-display/MetricCard'
import ChartCard from '../components/data-display/ChartCard'
import ChannelFinancialTable from '../components/data-display/ChannelFinancialTable'
import ServiceCard from '../components/data-display/ServiceCard'
import RevenueLineChart from '../components/charts/RevenueLineChart'
import StackedBarChart from '../components/charts/StackedBarChart'
import AreaChartComponent from '../components/charts/AreaChartComponent'
import FunnelDiagram from '../components/charts/FunnelDiagram'
import OperationalModel from '../components/sections/OperationalModel'
import D2DChannel from '../components/sections/sales-engine/D2DChannel'
import DirectMailChannel from '../components/sections/sales-engine/DirectMailChannel'
import CommercialChannel from '../components/sections/sales-engine/CommercialChannel'
import PPCChannel from '../components/sections/sales-engine/PPCChannel'
import CustomerExpansionEngine from '../components/sections/sales-engine/CustomerExpansionEngine'
import SliderInput from '../components/interactive/SliderInput'
import TimelineBlock from '../components/data-display/TimelineBlock'
import { useCalculations } from '../hooks/useCalculations'
import { useAssumptionsStore } from '../store/useAssumptionsStore'
import { HOME_SERVICES } from '../data/investorPortal/content'
import { formatCurrency } from '../utils/formatCurrency'
import { formatPercent } from '../utils/formatPercent'
import { DIVISION_COLORS } from '../theme/chartTheme'
import { BUDGET_CATEGORIES } from '../data/investorPortal/budgetBreakdown'

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'services', label: 'Services' },
  { id: 'distributed-solar', label: 'Distributed Solar' },
  { id: 'sales-engine', label: 'Sales Engine' },
  { id: 'grant-integration', label: 'Grant Integration' },
  { id: 'operations', label: 'Operations' },
  { id: 'projections', label: 'Projections' },
]

export default function HomeServices() {
  const [activeTab, setActiveTab] = useState('overview')
  const [salesSubTab, setSalesSubTab] = useState('d2d')
  const [selectedYear, setSelectedYear] = useState(1)
  const years = useCalculations()
  const { assumptions, setAssumption } = useAssumptionsStore()
  const y1 = years[0]
  const y5 = years[4]

  // Budget tracking for distributed solar
  const dsBudget = BUDGET_CATEGORIES.find(c => c.key === 'distributedSolar')?.total ?? 0
  const marketingCategory = BUDGET_CATEGORIES.find(c => c.key === 'marketing')
  const solarMarketingBudget = marketingCategory?.items.find(i => i.label.includes('Solar'))?.amount ?? 0
  const totalAllocatedBudget = dsBudget + solarMarketingBudget
  const totalFiveYearMarketingSpend = years.reduce((sum, y) => sum + y.realEstate.distributedSolar.marketingSpend, 0)
  const budgetVariance = totalAllocatedBudget - totalFiveYearMarketingSpend - dsBudget
  const spendRatio = totalFiveYearMarketingSpend / solarMarketingBudget

  // Distributed solar funnel data
  const solarFunnelData = years.map((y) => ({
    name: `Year ${y.year}`,
    'New Installs': y.realEstate.distributedSolar.newInstalls,
    'Cumulative Installs': y.realEstate.distributedSolar.cumulativeInstalls,
  }))

  const srecRevenueData = years.map((y) => ({
    name: `Year ${y.year}`,
    'SREC Revenue': y.realEstate.distributedSolar.netSrecRevenue,
  }))

  const profitByYear = years.map((y) => ({
    name: `Year ${y.year}`,
    profit: y.homeServices.totalProfitAnnual,
  }))

  const channelProfitByYear = years.map((y) => ({
    name: `Year ${y.year}`,
    'D2D': y.homeServices.d2d.totalProfitAnnual,
    'Direct Mail': y.homeServices.directMail.totalProfitAnnual,
    'Commercial': y.homeServices.commercial.totalProfitAnnual,
    'Energy Grants': y.homeServices.energyGrants.totalProfitAnnual,
  }))

  return (
    <PageShell fullWidth>
      <SectionBanner
        headline={HOME_SERVICES.headline}
        subtitle={HOME_SERVICES.subtitle}
        accentColor={DIVISION_COLORS.homeServices}
      />

      <div className="section-container">
        <StickyTabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="py-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Strategy Intro Block */}
              <div className="luxury-card border-l-4 border-l-accent-gold">
                <h2 className="font-display font-bold text-text-primary text-xl mb-4">Acquire Through Major Services. Expand Across the Full Envelope.</h2>
                <div className="space-y-3">
                  <p className="text-text-secondary text-sm leading-relaxed">
                    Home Services is the primary cash flow engine of the platform. The strategy is built on a simple but powerful operating principle: acquire customers through high-value, high-intent service categories — roofing, HVAC, insulation — then expand that relationship across the full range of home improvement and energy efficiency services.
                  </p>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    These anchor services create the initial entry point into the customer relationship. A homeowner who needs a roof replaced or an HVAC system upgraded is already engaged in a significant home investment decision. That engagement creates a natural window to identify and fulfill adjacent needs — air sealing, water heater upgrades, insulation improvements, and residential solar — without reacquiring the lead.
                  </p>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    The result is materially higher revenue and profit per acquired customer. Instead of winning isolated jobs, the platform systematically converts each customer into a multi-service engagement. This compresses effective customer acquisition cost, improves monetization efficiency per lead, and creates a durable operating advantage over single-service competitors.
                  </p>
                </div>
              </div>

              <MetricStrip
                metrics={[
                  { label: 'Y1 Annual Profit', value: y1.homeServices.totalProfitAnnual, format: 'currency', explanationKey: 'totalRevenue' },
                  { label: 'Y5 Annual Profit', value: y5.homeServices.totalProfitAnnual, format: 'currency' },
                  { label: 'Y1 D2D Monthly', value: y1.homeServices.d2d.totalProfitMonthly, format: 'currency' },
                  { label: 'Y1 Direct Mail Monthly', value: y1.homeServices.directMail.totalProfitMonthly, format: 'currency' },
                ]}
                columns={4}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Profit Growth" subtitle="Annual home services profit across all channels">
                  <RevenueLineChart
                    data={profitByYear}
                    lines={[
                      { key: 'profit', label: 'Total Profit', color: DIVISION_COLORS.homeServices },
                    ]}
                  />
                </ChartCard>
                <ChartCard title="Profit by Channel" subtitle="Annual breakdown by sales channel">
                  <StackedBarChart
                    data={channelProfitByYear}
                    bars={[
                      { key: 'D2D', label: 'Door-to-Door' },
                      { key: 'Direct Mail', label: 'Direct Mail' },
                      { key: 'Commercial', label: 'Commercial Paid' },
                      { key: 'Energy Grants', label: 'Energy Grants PPC' },
                    ]}
                  />
                </ChartCard>
              </div>
              <div className="luxury-card">
                <h3 className="font-display font-semibold text-text-primary text-lg mb-3">Division Role</h3>
                <p className="text-text-secondary leading-relaxed">
                  Home Services is the immediate cash flow engine of the platform. Through 4 distinct sales channels
                  — Door-to-Door, Direct Mail, Commercial Paid Leads, and Energy Grants PPC — the division generates
                  profit from day one across roofing, insulation, air sealing, HVAC, water heater, solar, and LED services.
                  Government energy efficiency grants improve close rates and reduce homeowner cost, driving higher adoption.
                </p>
              </div>
              <OperationalModel />
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-6">
              <h2 className="font-display font-bold text-text-primary text-2xl">Service Portfolio</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {HOME_SERVICES.services.map((service) => (
                  <ServiceCard
                    key={service.name}
                    {...service}
                    margin={
                      service.name === 'Roofing' ? 0.45 :
                      service.name === 'Insulation' ? 0.43 :
                      service.name === 'Air Sealing' ? 0.55 :
                      service.name === 'HVAC' ? 0.40 : 0.52
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'distributed-solar' && (
            <div className="space-y-8">
              <h2 className="font-display font-bold text-text-primary text-2xl">Distributed Solar Portfolio</h2>

              {/* Strategic Overview */}
              <div className="luxury-card">
                <h3 className="font-display font-semibold text-text-primary text-lg mb-3">Marketing-Driven Solar Installation Model</h3>
                <p className="text-text-secondary leading-relaxed mb-3">
                  The distributed solar strategy uses a monthly marketing ramp to build a growing portfolio of residential, commercial, and institutional rooftop installations. Marketing spend scales from <strong className="text-text-primary">{formatCurrency(assumptions.distributedSolar.monthlySpendY1, false)}/mo</strong> in Year 1 to <strong className="text-text-primary">{formatCurrency(assumptions.distributedSolar.monthlySpendY5, false)}/mo</strong> by Year 5, generating an accelerating pipeline of leads that convert into installations producing long-duration SREC revenue.
                </p>
                <p className="text-text-secondary leading-relaxed mb-3">
                  Each install produces <strong className="text-text-primary">{assumptions.distributedSolar.srecsPerInstall} SRECs per year</strong> at <strong className="text-text-primary">{formatCurrency(assumptions.distributedSolar.srecValue, false)} per credit</strong>, generating <strong className="text-text-primary">{formatCurrency(assumptions.distributedSolar.srecsPerInstall * assumptions.distributedSolar.srecValue, false)}/year</strong> in recurring revenue per installation. With no build delay — distributed rooftop systems begin producing SRECs immediately upon activation — the cumulative install portfolio compounds revenue year over year.
                </p>
                <p className="text-text-secondary leading-relaxed mb-3">
                  By Year 5, the portfolio reaches <strong className="text-text-primary">{y5.realEstate.distributedSolar.cumulativeInstalls.toLocaleString()} cumulative installs</strong> generating <strong className="text-text-primary">{formatCurrency(y5.realEstate.distributedSolar.netSrecRevenue)}/year</strong> in net SREC revenue after admin and compliance costs. Each cohort continues producing for 20+ years, creating a durable long-duration income stream for investors.
                </p>
                <p className="text-text-muted text-xs italic">
                  These installs are sourced through dedicated solar marketing — a separate pipeline from Home Services cross-sell solar upsells.
                </p>
              </div>

              {/* SREC Revenue by Year */}
              <div className="luxury-card">
                <div className="mb-4">
                  <h3 className="font-display font-semibold text-text-primary text-lg">SREC Revenue by Year</h3>
                  <p className="text-text-muted text-xs mt-1">Annual net SREC revenue from cumulative installation portfolio</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {years.map((y) => {
                    const ds = y.realEstate.distributedSolar
                    return (
                      <div key={y.year} className="p-4 rounded-lg bg-surface/50 border border-surface-border text-center">
                        <span className="text-text-muted text-xs uppercase tracking-wider block mb-1">Year {y.year}</span>
                        <span className="text-accent-gold font-display font-bold text-xl">{formatCurrency(ds.netSrecRevenue)}</span>
                        <span className="text-text-muted text-xs block mt-1">{ds.cumulativeInstalls.toLocaleString()} installs &middot; {formatCurrency(ds.marketingSpend / 12, false)}/mo spend</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <MetricStrip
                metrics={[
                  { label: 'Y5 Cumulative Installs', value: y5.realEstate.distributedSolar.cumulativeInstalls, format: 'number', explanationKey: 'cumulativeInstalls' },
                  { label: 'Gross SREC/Install/Year', value: y5.realEstate.distributedSolar.grossSrecPerInstall, format: 'currency' },
                  { label: 'Net SREC/Install/Year', value: y5.realEstate.distributedSolar.netSrecPerInstall, format: 'currency' },
                  { label: 'Y5 Net SREC Revenue', value: y5.realEstate.distributedSolar.netSrecRevenue, format: 'currency', highlighted: true },
                ]}
                columns={4}
              />

              {/* SREC Economics Per Install */}
              <div className="luxury-card">
                <h3 className="font-display font-semibold text-text-primary text-lg mb-4">SREC Economics Per Install (Annual)</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <span className="text-text-muted text-xs uppercase tracking-wider block mb-1">Gross SREC Revenue</span>
                    <span className="text-text-primary font-display font-bold text-xl">{formatCurrency(y5.realEstate.distributedSolar.grossSrecPerInstall, false)}/yr</span>
                    <span className="text-text-muted text-xs block mt-1">{assumptions.distributedSolar.srecsPerInstall} SRECs &times; {formatCurrency(assumptions.distributedSolar.srecValue, false)}/credit</span>
                  </div>
                  <div className="text-center">
                    <span className="text-text-muted text-xs uppercase tracking-wider block mb-1">Admin &amp; Compliance</span>
                    <span className="text-red-400/80 font-display font-bold text-xl">-{formatCurrency(y5.realEstate.distributedSolar.grossSrecPerInstall * assumptions.distributedSolar.srecAdminRate, false)}/yr</span>
                    <span className="text-text-muted text-xs block mt-1">{formatPercent(assumptions.distributedSolar.srecAdminRate)} for registration, monitoring, reporting</span>
                  </div>
                  <div className="text-center">
                    <span className="text-text-muted text-xs uppercase tracking-wider block mb-1">Net SREC Revenue</span>
                    <span className="text-accent-gold font-display font-bold text-xl">{formatCurrency(y5.realEstate.distributedSolar.netSrecPerInstall, false)}/yr</span>
                    <span className="text-text-muted text-xs block mt-1">Per install, recurring for {assumptions.distributedSolar.srecLifespan} years</span>
                  </div>
                </div>
                <p className="text-text-muted text-xs mt-4 italic">Targeting NJ/DC SREC-II markets. Admin includes SREC registration, compliance monitoring, aggregation fees, and reporting.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Cumulative Solar Installs" subtitle="Install portfolio growth over 5 years">
                  <AreaChartComponent
                    data={solarFunnelData.map(d => ({ name: d.name, installs: d['Cumulative Installs'] }))}
                    dataKey="installs"
                    color="#f59e0b"
                    formatValue={(v) => `${Math.round(v)} installs`}
                  />
                </ChartCard>
                <ChartCard title="Annual Net SREC Revenue" subtitle="Net recurring revenue after admin/compliance costs">
                  <AreaChartComponent
                    data={srecRevenueData.map(d => ({ name: d.name, revenue: d['SREC Revenue'] }))}
                    dataKey="revenue"
                    color="#c9a84c"
                    formatValue={(v) => formatCurrency(v)}
                  />
                </ChartCard>
              </div>

              {/* Cost vs Profit — Distributed Solar */}
              <ChartCard title="Marketing Cost vs. Profit" subtitle="Annual marketing spend compared to install profit and net SREC revenue">
                <StackedBarChart
                  data={years.map((y, i) => ({
                    name: `Year ${i + 1}`,
                    'Marketing Cost': y.realEstate.distributedSolar.marketingSpend,
                    'Install Profit': y.realEstate.distributedSolar.installProfit,
                    'Net SREC': y.realEstate.distributedSolar.netSrecRevenue,
                  }))}
                  bars={[
                    { key: 'Marketing Cost', label: 'Marketing Cost', color: '#ef4444' },
                    { key: 'Install Profit', label: 'Install Profit', color: '#f59e0b' },
                    { key: 'Net SREC', label: 'Net SREC Revenue', color: '#c9a84c' },
                  ]}
                  stacked={false}
                />
              </ChartCard>

              {/* Distributed Solar Financial Summary */}
              <ChannelFinancialTable
                title="Distributed Solar — 5-Year Financial Summary"
                data={years.map((y, i) => ({
                  year: i + 1,
                  cost: y.realEstate.distributedSolar.marketingSpend,
                  revenue: y.realEstate.distributedSolar.totalRevenue,
                  profit: y.realEstate.distributedSolar.installProfit + y.realEstate.distributedSolar.netSrecRevenue,
                }))}
                highlightYear={selectedYear}
              />

              {/* SREC & Installation Detail by Year */}
              <div className="luxury-card">
                <div className="mb-4">
                  <h3 className="font-display font-semibold text-text-primary text-lg">SREC & Installation Detail by Year</h3>
                  <p className="text-text-muted text-xs mt-1">Select a year to inspect marketing spend, installation volume, and SREC output</p>
                </div>
                <SliderInput
                  label="Select Year"
                  value={selectedYear}
                  min={1}
                  max={5}
                  step={1}
                  onChange={(v) => setSelectedYear(v)}
                  format={(v) => `Year ${v}`}
                />
                {(() => {
                  const ds = years[selectedYear - 1].realEstate.distributedSolar
                  return (
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div className="p-3 rounded-lg bg-surface/50 border border-surface-border">
                        <span className="text-text-muted text-xs block mb-1">New Installs</span>
                        <span className="text-text-primary font-display font-bold text-lg">{ds.newInstalls.toLocaleString()}</span>
                      </div>
                      <div className="p-3 rounded-lg bg-surface/50 border border-surface-border">
                        <span className="text-text-muted text-xs block mb-1">Cumulative Installs</span>
                        <span className="text-text-primary font-display font-bold text-lg">{ds.cumulativeInstalls.toLocaleString()}</span>
                      </div>
                      <div className="p-3 rounded-lg bg-surface/50 border border-surface-border">
                        <span className="text-text-muted text-xs block mb-1">Gross SREC Revenue</span>
                        <span className="text-text-primary font-display font-bold text-lg">{formatCurrency(ds.srecRevenue)}</span>
                      </div>
                      <div className="p-3 rounded-lg bg-surface/50 border border-surface-border">
                        <span className="text-text-muted text-xs block mb-1">Admin/Compliance</span>
                        <span className="text-red-400/80 font-display font-bold text-lg">-{formatCurrency(ds.adminCost)}</span>
                      </div>
                      <div className="p-3 rounded-lg bg-surface/50 border border-accent-gold/20">
                        <span className="text-text-muted text-xs block mb-1">Net SREC Revenue</span>
                        <span className="text-accent-gold font-display font-bold text-lg">{formatCurrency(ds.netSrecRevenue)}</span>
                        <span className="text-text-muted text-xs block mt-0.5">{formatCurrency(ds.netSrecRevenue / 12, false)}/mo</span>
                      </div>
                      <div className="p-3 rounded-lg bg-surface/50 border border-surface-border">
                        <span className="text-text-muted text-xs block mb-1">Install Revenue</span>
                        <span className="text-text-primary font-display font-bold text-lg">{formatCurrency(ds.installRevenue)}</span>
                        <span className="text-text-muted text-xs block mt-0.5">Profit: {formatCurrency(ds.installProfit)}</span>
                      </div>
                      <div className="p-3 rounded-lg bg-surface/50 border border-surface-border">
                        <span className="text-text-muted text-xs block mb-1">Marketing Spend</span>
                        <span className="text-text-primary font-display font-bold text-lg">{formatCurrency(ds.marketingSpend)}</span>
                        <span className="text-text-muted text-xs block mt-0.5">{formatCurrency(ds.marketingSpend / 12, false)}/mo</span>
                      </div>
                      <div className="p-3 rounded-lg bg-surface/50 border border-surface-border">
                        <span className="text-text-muted text-xs block mb-1">Cumulative Marketing Spend</span>
                        <span className="text-text-primary font-display font-bold text-lg">{formatCurrency(ds.cumulativeMarketingSpend)}</span>
                      </div>
                      <div className="p-3 rounded-lg bg-surface/50 border border-surface-border">
                        <span className="text-text-muted text-xs block mb-1">Leads Generated</span>
                        <span className="text-text-primary font-display font-bold text-lg">{ds.leadsGenerated.toLocaleString()}</span>
                      </div>
                    </div>
                  )
                })()}
              </div>

              {/* Budget Tracking */}
              <div className="luxury-card">
                <h3 className="font-display font-semibold text-text-primary text-lg mb-4">Budget Allocation vs. Modeled Spend</h3>
                <div className="space-y-4">
                  {/* Solar Marketing Budget */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-secondary">Solar Marketing Budget</span>
                      <span className="text-text-primary font-medium">{formatCurrency(solarMarketingBudget)} allocated</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-text-secondary">5-Year Modeled Marketing Spend</span>
                      <span className="text-text-primary font-medium">{formatCurrency(totalFiveYearMarketingSpend)}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-border overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          spendRatio <= 1 ? 'bg-accent-green' : spendRatio <= 1.5 ? 'bg-amber-500' : 'bg-red-400/80'
                        }`}
                        style={{ width: `${Math.min(spendRatio * 100, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-text-muted">{Math.round(spendRatio * 100)}% of allocation</span>
                      <span className={spendRatio > 1 ? 'text-amber-500' : 'text-accent-green'}>
                        {spendRatio > 1
                          ? `${formatCurrency(totalFiveYearMarketingSpend - solarMarketingBudget)} over budget`
                          : `${formatCurrency(solarMarketingBudget - totalFiveYearMarketingSpend)} remaining`
                        }
                      </span>
                    </div>
                  </div>

                  {/* Development Budget */}
                  <div className="pt-3 border-t border-surface-border">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-secondary">DS Development Budget</span>
                      <span className="text-text-primary font-medium">{formatCurrency(dsBudget)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Combined Allocation (Dev + Marketing)</span>
                      <span className="text-text-primary font-medium">{formatCurrency(totalAllocatedBudget)}</span>
                    </div>
                  </div>
                </div>
                <p className="text-text-muted text-xs mt-4 italic">
                  Marketing spend above the initial allocation is expected to be funded through revenue reinvestment as install fees and SREC revenue recycle into the marketing budget.
                </p>
              </div>

              {/* Solar Funnel Table */}
              <div className="luxury-card overflow-x-auto">
                <h3 className="font-display font-semibold text-text-primary text-lg mb-4">Solar Funnel — Year-by-Year Breakdown</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-border">
                      <th className="text-left text-text-muted font-medium py-3 pr-4">Year</th>
                      <th className="text-right text-text-muted font-medium py-3 px-2">Marketing Spend</th>
                      <th className="text-right text-text-muted font-medium py-3 px-2">Leads</th>
                      <th className="text-right text-text-muted font-medium py-3 px-2">New Installs</th>
                      <th className="text-right text-text-muted font-medium py-3 px-2">Cumulative Installs</th>
                      <th className="text-right text-text-muted font-medium py-3 px-2">Net SREC Revenue</th>
                      <th className="text-right text-text-muted font-medium py-3 pl-2">Install Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {years.map((y) => {
                      const ds = y.realEstate.distributedSolar
                      return (
                        <tr key={y.year} className="border-b border-surface-border/50">
                          <td className="text-text-secondary py-3 pr-4">Year {y.year}</td>
                          <td className="text-right text-text-primary py-3 px-2">{formatCurrency(ds.marketingSpend)}</td>
                          <td className="text-right text-text-primary py-3 px-2">{ds.leadsGenerated.toLocaleString()}</td>
                          <td className="text-right text-text-primary font-medium py-3 px-2">{ds.newInstalls.toLocaleString()}</td>
                          <td className="text-right text-text-primary font-medium py-3 px-2">{ds.cumulativeInstalls.toLocaleString()}</td>
                          <td className="text-right text-accent-gold font-display font-semibold py-3 px-2">{formatCurrency(ds.netSrecRevenue)}</td>
                          <td className="text-right text-text-primary font-medium py-3 pl-2">{formatCurrency(ds.installProfit)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Interactive Assumptions + Key Economics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="luxury-card">
                  <h3 className="font-display font-semibold text-text-primary text-lg mb-4">Funnel Assumptions</h3>
                  <div className="space-y-4">
                    <SliderInput
                      label="Lead Cost (Blended)"
                      value={assumptions.distributedSolar.leadCost}
                      min={120}
                      max={350}
                      step={10}
                      onChange={(v) => setAssumption('distributedSolar', 'leadCost', v)}
                      format={(v) => formatCurrency(v, false)}
                    />
                    <SliderInput
                      label="Conversion Rate"
                      value={assumptions.distributedSolar.conversionRate}
                      min={0.04}
                      max={0.15}
                      step={0.01}
                      onChange={(v) => setAssumption('distributedSolar', 'conversionRate', v)}
                      format={(v) => formatPercent(v)}
                    />
                    <SliderInput
                      label="SREC Value/Credit"
                      value={assumptions.distributedSolar.srecValue}
                      min={300}
                      max={500}
                      step={25}
                      onChange={(v) => setAssumption('distributedSolar', 'srecValue', v)}
                      format={(v) => formatCurrency(v, false)}
                    />
                    <SliderInput
                      label="SRECs Per Install"
                      value={assumptions.distributedSolar.srecsPerInstall}
                      min={8}
                      max={16}
                      step={1}
                      onChange={(v) => setAssumption('distributedSolar', 'srecsPerInstall', v)}
                      format={(v) => `${v}/year`}
                    />
                    <SliderInput
                      label="SREC Admin/Compliance Rate"
                      value={assumptions.distributedSolar.srecAdminRate}
                      min={0.05}
                      max={0.25}
                      step={0.01}
                      onChange={(v) => setAssumption('distributedSolar', 'srecAdminRate', v)}
                      format={(v) => formatPercent(v)}
                    />
                  </div>
                  <h4 className="font-display font-semibold text-text-primary text-sm mt-6 mb-3">Monthly Marketing Ramp</h4>
                  <div className="space-y-3">
                    <SliderInput label="Y1 Spend/Month" value={assumptions.distributedSolar.monthlySpendY1} min={20000} max={150000} step={5000} onChange={(v) => setAssumption('distributedSolar', 'monthlySpendY1', v)} format={(v) => formatCurrency(v, false)} />
                    <SliderInput label="Y2 Spend/Month" value={assumptions.distributedSolar.monthlySpendY2} min={50000} max={200000} step={5000} onChange={(v) => setAssumption('distributedSolar', 'monthlySpendY2', v)} format={(v) => formatCurrency(v, false)} />
                    <SliderInput label="Y3 Spend/Month" value={assumptions.distributedSolar.monthlySpendY3} min={75000} max={300000} step={5000} onChange={(v) => setAssumption('distributedSolar', 'monthlySpendY3', v)} format={(v) => formatCurrency(v, false)} />
                    <SliderInput label="Y4 Spend/Month" value={assumptions.distributedSolar.monthlySpendY4} min={100000} max={400000} step={5000} onChange={(v) => setAssumption('distributedSolar', 'monthlySpendY4', v)} format={(v) => formatCurrency(v, false)} />
                    <SliderInput label="Y5 Spend/Month" value={assumptions.distributedSolar.monthlySpendY5} min={150000} max={500000} step={5000} onChange={(v) => setAssumption('distributedSolar', 'monthlySpendY5', v)} format={(v) => formatCurrency(v, false)} />
                  </div>
                </div>

                <div className="luxury-card">
                  <h3 className="font-display font-semibold text-text-primary text-lg mb-4">Key Economics</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Lead Cost (Blended)', value: formatCurrency(assumptions.distributedSolar.leadCost, false) },
                      { label: 'Conversion Rate', value: formatPercent(assumptions.distributedSolar.conversionRate) },
                      { label: 'SRECs Per Install', value: `${assumptions.distributedSolar.srecsPerInstall}/year` },
                      { label: 'SREC Value', value: `${formatCurrency(assumptions.distributedSolar.srecValue, false)}/credit` },
                      { label: 'Gross SREC/Install/Year', value: `${formatCurrency(assumptions.distributedSolar.srecsPerInstall * assumptions.distributedSolar.srecValue, false)}/year` },
                      { label: 'Admin/Compliance Rate', value: formatPercent(assumptions.distributedSolar.srecAdminRate) },
                      { label: 'Net SREC/Install/Year', value: `${formatCurrency(assumptions.distributedSolar.srecsPerInstall * assumptions.distributedSolar.srecValue * (1 - assumptions.distributedSolar.srecAdminRate), false)}/year` },
                      { label: 'Install Fee', value: `${formatCurrency(assumptions.distributedSolar.installFee, false)}/job` },
                      { label: 'Install Margin', value: formatPercent(assumptions.distributedSolar.installMargin) },
                      { label: 'Total 5-Year Marketing', value: formatCurrency(totalFiveYearMarketingSpend, false) },
                      { label: 'SREC Lifespan', value: `${assumptions.distributedSolar.srecLifespan} years per cohort` },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between py-2 border-b border-surface-border">
                        <span className="text-text-secondary text-sm">{item.label}</span>
                        <span className="text-text-primary text-sm font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <TimelineBlock
                phases={[
                  { label: 'Year 1', title: 'Launch & First Cohort', description: `$${(assumptions.distributedSolar.monthlySpendY1 / 1000).toFixed(0)}K/mo marketing generates ${y1.realEstate.distributedSolar.newInstalls.toLocaleString()} installs. SREC revenue begins immediately.`, highlight: 'No build delay — revenue from day one' },
                  { label: 'Year 2-3', title: 'Accelerating Ramp', description: `Marketing doubles then triples. Cumulative installs reach ${years[2].realEstate.distributedSolar.cumulativeInstalls.toLocaleString()} by Year 3. SREC revenue compounds as cohorts stack.` },
                  { label: 'Year 4-5', title: 'Full Portfolio Scale', description: `${y5.realEstate.distributedSolar.cumulativeInstalls.toLocaleString()} cumulative installs generating ${formatCurrency(y5.realEstate.distributedSolar.srecRevenue)}/year in SREC revenue. Each cohort continues for 20+ years.`, highlight: 'Revenue compounds as portfolio matures' },
                ]}
              />
            </div>
          )}

          {activeTab === 'sales-engine' && (
            <div className="space-y-8">
              <h2 className="font-display font-bold text-text-primary text-2xl">4-Channel Sales Engine</h2>

              {/* Premium Channel Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    id: 'd2d',
                    title: 'Door-to-Door',
                    subtitle: 'High-volume residential canvassing with AI-optimized routing',
                    metric: formatCurrency(y1.homeServices.d2d.totalProfitMonthly),
                    metricLabel: 'Monthly Profit (Y1)',
                    secondMetric: Math.round(y1.homeServices.d2d.roofingJobsPerMonth).toString(),
                    secondLabel: 'Roofing Jobs/Mo',
                    color: DIVISION_COLORS.homeServices,
                  },
                  {
                    id: 'direct-mail',
                    title: 'Direct Mail',
                    subtitle: 'Targeted storm zone and high-value property campaigns',
                    metric: formatCurrency(y1.homeServices.directMail.totalProfitMonthly),
                    metricLabel: 'Monthly Profit (Y1)',
                    secondMetric: Math.round(y1.homeServices.directMail.roofingJobsPerMonth).toString(),
                    secondLabel: 'Roofing Jobs/Mo',
                    color: '#40916c',
                  },
                  {
                    id: 'commercial',
                    title: 'Commercial Leads',
                    subtitle: 'High-ticket commercial roofing, solar, and lighting projects',
                    metric: formatCurrency(y1.homeServices.commercial.totalProfitMonthly),
                    metricLabel: 'Monthly Profit (Y1)',
                    secondMetric: formatCurrency(y1.homeServices.commercial.adSpendMonthly),
                    secondLabel: 'Monthly Ad Spend',
                    color: '#2d6a4f',
                  },
                  {
                    id: 'ppc',
                    title: 'PPC (Grants + Energy)',
                    subtitle: 'High-intent inbound leads for grant-eligible energy services',
                    metric: formatCurrency(y1.homeServices.energyGrants.totalProfitMonthly),
                    metricLabel: 'Monthly Profit (Y1)',
                    secondMetric: Math.round(y1.homeServices.energyGrants.hvacJobs + y1.homeServices.energyGrants.insulationJobs + y1.homeServices.energyGrants.waterHeaterJobs).toString(),
                    secondLabel: 'Energy Jobs/Mo',
                    color: '#1b4332',
                  },
                ].map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setSalesSubTab(channel.id)}
                    className={`w-full text-left p-6 rounded-xl border transition-all duration-200 group ${
                      salesSubTab === channel.id
                        ? 'border-accent-gold/40 bg-accent-gold/5 shadow-[0_0_24px_rgba(201,168,76,0.08)]'
                        : 'border-surface-border bg-surface-elevated/50 hover:border-surface-light hover:bg-surface-elevated'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: channel.color }} />
                          <h3 className="font-display font-bold text-text-primary text-lg">{channel.title}</h3>
                        </div>
                        <p className="text-text-muted text-xs">{channel.subtitle}</p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded transition-colors ${
                        salesSubTab === channel.id ? 'bg-accent-gold/20 text-accent-gold' : 'bg-surface text-text-muted group-hover:text-text-secondary'
                      }`}>
                        {salesSubTab === channel.id ? 'Active' : 'View'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-text-muted text-xs mb-0.5">{channel.metricLabel}</p>
                        <p className="font-display font-bold text-accent-gold text-xl">{channel.metric}</p>
                      </div>
                      <div>
                        <p className="text-text-muted text-xs mb-0.5">{channel.secondLabel}</p>
                        <p className="font-display font-semibold text-text-primary text-xl">{channel.secondMetric}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Active Channel Detail */}
              <div className="pt-4">
                {salesSubTab === 'd2d' && <D2DChannel years={years} />}
                {salesSubTab === 'direct-mail' && <DirectMailChannel years={years} />}
                {salesSubTab === 'commercial' && <CommercialChannel years={years} />}
                {salesSubTab === 'ppc' && <PPCChannel years={years} />}
              </div>

              {/* Customer Expansion Engine */}
              <div className="mt-12 pt-10 border-t border-surface-border">
                <CustomerExpansionEngine />
              </div>
            </div>
          )}


          {activeTab === 'grant-integration' && (
            <div className="space-y-8">
              <h2 className="font-display font-bold text-text-primary text-2xl">Grant & Rebate Integration</h2>
              <MetricStrip
                metrics={[
                  { label: 'Grant Eligibility Rate', value: 0.60, format: 'percent', explanationKey: 'grantEligibility' },
                  { label: 'Close Rate Uplift', value: 0.15, format: 'percent' },
                  { label: 'Grant-Backed Deals/Year', value: y1.homeServices.grants.grantSupportedDeals, format: 'number' },
                  { label: 'Est. Annual Reimbursement', value: y1.homeServices.grants.estimatedReimbursement, format: 'currency', highlighted: true },
                ]}
                columns={4}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="luxury-card">
                  <h3 className="font-display font-semibold text-text-primary text-lg mb-4">How Grants Drive Adoption</h3>
                  <div className="space-y-4">
                    {[
                      { title: 'Eligibility', desc: 'Approximately 60% of homeowners in target markets qualify for federal or state energy efficiency grants based on income and property criteria.' },
                      { title: 'Cost Reduction', desc: 'Grants cover ~30% of project costs on average, significantly reducing the homeowner\'s out-of-pocket expense.' },
                      { title: 'Close Rate Impact', desc: 'Grant-eligible jobs close at approximately 15% higher rates than non-eligible projects.' },
                      { title: 'Reimbursement', desc: 'Grant funds typically reimburse within 2-4 months of project completion, creating a manageable working capital cycle.' },
                    ].map((item) => (
                      <div key={item.title}>
                        <h4 className="text-accent-gold text-sm font-semibold">{item.title}</h4>
                        <p className="text-text-secondary text-sm mt-1">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="luxury-card">
                  <h3 className="font-display font-semibold text-text-primary text-lg mb-4">ESG & Community Impact</h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">
                    Grant-backed energy efficiency improvements create measurable environmental and social impact.
                    Each completed project reduces household energy consumption by 20-40%, lowering utility bills
                    and carbon emissions while improving home comfort and value.
                  </p>
                  <div className="space-y-3">
                    {['Reduced household energy costs', 'Lower carbon emissions per home', 'Improved home comfort and resale value', 'Community resilience through weatherization'].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-green shrink-0" />
                        <span className="text-text-secondary text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grants and Rebates Optimization */}
              <div className="luxury-card">
                <div className="w-8 h-1 rounded-full bg-accent-gold mb-4" />
                <h3 className="font-display font-semibold text-text-primary text-lg mb-4">Grants and Rebates Optimization</h3>
                <div className="space-y-4">
                  <p className="text-text-secondary text-sm leading-relaxed">
                    Federal and state energy efficiency grants cover approximately 33–35% of eligible project costs,
                    directly reducing the homeowner's financial barrier. In addition, manufacturer and utility rebates
                    on qualifying equipment (heat pumps, high-efficiency water heaters, insulation materials) further
                    offset material costs — significantly increasing effective margins on energy-related services.
                  </p>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    The combined effect of grants and rebates can approximately double profitability on energy-related
                    services compared to base margin assumptions. This makes the energy efficiency service lines —
                    HVAC, water heater, insulation, and air sealing — disproportionately profitable relative to their
                    ticket size.
                  </p>
                  <p className="text-text-muted text-xs italic">
                    Rebate values based on real-world average of $3,500 per eligible residential deal.
                    Commercial rebates reflect proven project history ($1.2M+ individual projects).
                  </p>
                </div>
              </div>

              {/* Rebate Metrics */}
              <MetricStrip
                metrics={[
                  { label: 'Rebate Eligibility Rate', value: assumptions.grants.rebateEligibilityRate, format: 'percent' },
                  { label: 'Residential Rebate-Eligible Deals', value: y1.homeServices.grants.rebateEligibleDeals, format: 'number' },
                  { label: 'Est. Residential Rebate Offset', value: y1.homeServices.grants.estimatedRebateOffset, format: 'currency', highlighted: true },
                  { label: 'Commercial Rebate Projects', value: y1.homeServices.grants.commercialRebateDeals, format: 'number' },
                  { label: 'Est. Commercial Rebate Offset', value: y1.homeServices.grants.estimatedCommercialRebateOffset, format: 'currency', highlighted: true },
                  { label: 'Total Rebate Opportunity', value: y1.homeServices.grants.totalRebateOffset, format: 'currency', highlighted: true },
                  { label: 'Avg Profit Multiplier', value: y1.homeServices.grants.profitMultiplier, format: 'number' },
                ]}
                columns={4}
              />

              {/* Per-Service Rebate Impact */}
              <div className="luxury-card">
                <h3 className="font-display font-semibold text-text-primary text-lg mb-4">Per-Service Rebate Impact</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-surface-border">
                        <th className="text-left text-text-muted font-medium py-3 pr-4">Service</th>
                        <th className="text-right text-text-muted font-medium py-3 px-3">Revenue/Job</th>
                        <th className="text-right text-text-muted font-medium py-3 px-3">Base Margin</th>
                        <th className="text-right text-text-muted font-medium py-3 px-3">Base Profit</th>
                        <th className="text-right text-text-muted font-medium py-3 px-3">Rebate-Adj Profit</th>
                        <th className="text-right text-text-muted font-medium py-3 px-3">Multiplier</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const se = assumptions.serviceEconomics
                        const g = assumptions.grants
                        const services = [
                          { name: 'HVAC', revenue: se.hvacRevenuePerJob, margin: se.hvacMargin },
                          { name: 'Water Heater', revenue: se.waterHeaterRevenuePerJob, margin: se.waterHeaterMargin },
                          { name: 'Insulation', revenue: se.insulationRevenuePerJob, margin: se.insulationMargin },
                          { name: 'Air Sealing', revenue: se.airSealingRevenuePerJob, margin: se.airSealingMargin },
                        ]
                        return services.map((svc) => {
                          const baseProfit = svc.revenue * svc.margin
                          const rebateOffset = g.rebateEligibilityRate * g.avgResidentialRebatePerDeal
                          const adjProfit = baseProfit + rebateOffset
                          const multiplier = adjProfit / baseProfit
                          return (
                            <tr key={svc.name} className="border-b border-surface-border/50">
                              <td className="text-text-primary py-3 pr-4 font-medium">{svc.name}</td>
                              <td className="text-right text-text-secondary py-3 px-3">{formatCurrency(svc.revenue)}</td>
                              <td className="text-right text-text-secondary py-3 px-3">{formatPercent(svc.margin)}</td>
                              <td className="text-right text-text-secondary py-3 px-3">{formatCurrency(baseProfit)}</td>
                              <td className="text-right text-accent-gold font-medium py-3 px-3">{formatCurrency(adjProfit)}</td>
                              <td className="text-right text-accent-gold font-display font-semibold py-3 px-3">{multiplier.toFixed(2)}x</td>
                            </tr>
                          )
                        })
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'operations' && (
            <div className="space-y-8">
              <h2 className="font-display font-bold text-text-primary text-2xl">Operations Model</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="luxury-card">
                  <h3 className="font-display font-semibold text-text-primary text-lg mb-4">Subcontractor Execution</h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">
                    All installation work is performed by vetted subcontractor crews. This model allows rapid scaling
                    without the overhead of a full W-2 labor force while maintaining quality through standardized processes.
                  </p>
                  <div className="space-y-3">
                    {[
                      { label: 'Current Crew Capacity', value: '18 active crews' },
                      { label: 'Target Crew Capacity', value: '40+ crews by Year 3' },
                      { label: 'Avg Project Cycle', value: '1-5 days depending on service' },
                      { label: 'Quality Standard', value: 'Post-inspection on 100% of jobs' },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between py-2 border-b border-surface-border">
                        <span className="text-text-secondary text-sm">{item.label}</span>
                        <span className="text-text-primary text-sm font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="luxury-card">
                  <h3 className="font-display font-semibold text-text-primary text-lg mb-4">Cash Flow Cycle</h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">
                    The Home Services division generates fast-cycle revenue with predictable cash conversion.
                  </p>
                  <div className="space-y-3">
                    {[
                      { label: 'Sale to Start', value: '3-7 days' },
                      { label: 'Project Duration', value: '1-5 days' },
                      { label: 'Invoicing', value: 'On completion' },
                      { label: 'Collection Cycle', value: '15-30 days' },
                      { label: 'Sub Payment', value: 'Net 30 from completion' },
                      { label: 'Working Capital Need', value: 'Moderate — funded from operations' },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between py-2 border-b border-surface-border">
                        <span className="text-text-secondary text-sm">{item.label}</span>
                        <span className="text-text-primary text-sm font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projections' && (
            <div className="space-y-8">
              <h2 className="font-display font-bold text-text-primary text-2xl">Projections</h2>
              <MetricStrip
                metrics={[
                  { label: 'Y1 Annual Profit', value: y1.homeServices.totalProfitAnnual, format: 'currency' },
                  { label: 'Y5 Annual Profit', value: y5.homeServices.totalProfitAnnual, format: 'currency' },
                  { label: 'Y1 Monthly Profit', value: y1.homeServices.totalProfitMonthly, format: 'currency' },
                  { label: 'Y5 Monthly Profit', value: y5.homeServices.totalProfitMonthly, format: 'currency' },
                ]}
                columns={4}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Annual Profit" subtitle="Home services profit trajectory">
                  <RevenueLineChart
                    data={profitByYear}
                    lines={[{ key: 'profit', label: 'Profit', color: DIVISION_COLORS.homeServices }]}
                  />
                </ChartCard>
                <ChartCard title="Profit by Channel" subtitle="Stacked annual contribution">
                  <StackedBarChart
                    data={channelProfitByYear}
                    bars={[
                      { key: 'D2D', label: 'D2D' },
                      { key: 'Direct Mail', label: 'Direct Mail' },
                      { key: 'Commercial', label: 'Commercial' },
                      { key: 'Energy Grants', label: 'Energy Grants' },
                    ]}
                  />
                </ChartCard>
              </div>
              {/* Year-by-year table */}
              <div className="luxury-card overflow-x-auto">
                <h3 className="font-display font-semibold text-text-primary text-lg mb-4">Year-by-Year Summary</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-border">
                      <th className="text-left text-text-muted font-medium py-3 pr-4">Metric</th>
                      {years.map((y) => (
                        <th key={y.year} className="text-right text-text-muted font-medium py-3 px-3">Year {y.year}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-surface-border/50">
                      <td className="text-text-secondary py-3 pr-4">D2D Annual Profit</td>
                      {years.map((y) => (
                        <td key={y.year} className="text-right text-text-primary font-medium py-3 px-3">{formatCurrency(y.homeServices.d2d.totalProfitAnnual)}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-surface-border/50">
                      <td className="text-text-secondary py-3 pr-4">Direct Mail Annual Profit</td>
                      {years.map((y) => (
                        <td key={y.year} className="text-right text-text-primary font-medium py-3 px-3">{formatCurrency(y.homeServices.directMail.totalProfitAnnual)}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-surface-border/50">
                      <td className="text-text-secondary py-3 pr-4">Commercial Annual Profit</td>
                      {years.map((y) => (
                        <td key={y.year} className="text-right text-text-primary font-medium py-3 px-3">{formatCurrency(y.homeServices.commercial.totalProfitAnnual)}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-surface-border/50">
                      <td className="text-text-secondary py-3 pr-4">Energy Grants Annual Profit</td>
                      {years.map((y) => (
                        <td key={y.year} className="text-right text-text-primary font-medium py-3 px-3">{formatCurrency(y.homeServices.energyGrants.totalProfitAnnual)}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="text-text-secondary py-3 pr-4">Total Annual Profit</td>
                      {years.map((y) => (
                        <td key={y.year} className="text-right text-accent-gold font-display font-semibold py-3 px-3">{formatCurrency(y.homeServices.totalProfitAnnual)}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  )
}
