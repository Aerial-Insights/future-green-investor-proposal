import { useState } from 'react'
import PageShell from '../components/layout/PageShell'
import SectionBanner from '../components/sections/SectionBanner'
import StickyTabNav from '../components/layout/StickyTabNav'
import MetricStrip from '../components/data-display/MetricStrip'
import MetricCard from '../components/data-display/MetricCard'
import ChartCard from '../components/data-display/ChartCard'
import ServiceCard from '../components/data-display/ServiceCard'
import RevenueLineChart from '../components/charts/RevenueLineChart'
import StackedBarChart from '../components/charts/StackedBarChart'
import FunnelDiagram from '../components/charts/FunnelDiagram'
import OperationalModel from '../components/sections/OperationalModel'
import D2DChannel from '../components/sections/sales-engine/D2DChannel'
import DirectMailChannel from '../components/sections/sales-engine/DirectMailChannel'
import CommercialChannel from '../components/sections/sales-engine/CommercialChannel'
import PPCChannel from '../components/sections/sales-engine/PPCChannel'
import CustomerExpansionEngine from '../components/sections/sales-engine/CustomerExpansionEngine'
import { useCalculations } from '../hooks/useCalculations'
import { useAssumptionsStore } from '../store/useAssumptionsStore'
import { HOME_SERVICES } from '../data/investorPortal/content'
import { formatCurrency } from '../utils/formatCurrency'
import { formatPercent } from '../utils/formatPercent'
import { DIVISION_COLORS } from '../theme/chartTheme'

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'services', label: 'Services' },
  { id: 'solar-installs', label: 'Solar Installs' },
  { id: 'sales-engine', label: 'Sales Engine' },
  { id: 'unit-economics', label: 'Unit Economics' },
  { id: 'grant-integration', label: 'Grant Integration' },
  { id: 'operations', label: 'Operations' },
  { id: 'projections', label: 'Projections' },
]

export default function HomeServices() {
  const [activeTab, setActiveTab] = useState('overview')
  const [salesSubTab, setSalesSubTab] = useState('d2d')
  const years = useCalculations()
  const assumptions = useAssumptionsStore((s) => s.assumptions)
  const y1 = years[0]
  const y5 = years[4]

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

  const solarOpsRevenue = years.map((y) => ({
    name: `Year ${y.year}`,
    Residential: y.solarOperations.residentialRevenue,
    Commercial: y.solarOperations.commercialRevenue,
    Lighting: y.solarOperations.lightingRevenue,
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

          {activeTab === 'solar-installs' && (
            <div className="space-y-8">
              <h2 className="font-display font-bold text-text-primary text-2xl">Solar Installations</h2>

              {/* Conversion-Origin Overview */}
              <div className="luxury-card border-l-4 border-l-[#f59e0b]">
                <h3 className="font-display font-semibold text-text-primary text-lg mb-3">Where Solar Deals Originate</h3>
                <div className="space-y-3">
                  <p className="text-text-secondary text-sm leading-relaxed">
                    Solar installations are not treated as a standalone acquisition category. The majority of residential solar revenue is expected to come through conversion from the existing Home Services customer base — particularly from roofing.
                  </p>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    Roofing is the strongest feeder channel into solar because the two services are closely related from both an operational and homeowner-decision perspective. When a roof is already being replaced or upgraded, the structural work is done, the crew is on-site, and the homeowner is already engaged in a major home investment. This creates an ideal moment to present solar — friction is low, timing alignment is strong, and the combined project often qualifies for better financing terms.
                  </p>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    This conversion-driven model means solar revenue scales naturally with Home Services volume. As the D2D and Direct Mail channels grow roofing job count, solar installations grow in parallel at a 4% cross-sell rate — without requiring a separate solar-specific sales force or marketing spend.
                  </p>
                </div>
              </div>

              <MetricStrip
                metrics={[
                  { label: 'Y1 Residential Installs', value: y1.solarOperations.residentialInstalls, format: 'number' },
                  { label: 'Y1 Commercial Installs', value: y1.solarOperations.commercialInstalls, format: 'number' },
                  { label: 'Avg Residential Value', value: 52000, format: 'currency' },
                  { label: 'Gross Margin', value: y1.solarOperations.grossMarginPercent, format: 'percent' },
                ]}
                columns={4}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="luxury-card">
                  <h3 className="font-display font-semibold text-text-primary text-lg mb-4">Revenue Model</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Residential Solar', value: formatCurrency(52000) + '/install', desc: 'Residential rooftop systems. 35% margin. Cross-sold from Home Services customers at 4% conversion.' },
                      { label: 'Commercial Solar', value: formatCurrency(180000) + '/install', desc: 'Commercial and multi-family systems. 37% margin. Higher value, longer sales cycle.' },
                      { label: 'LED Lighting', value: formatCurrency(7000) + '/project', desc: 'Energy-efficient lighting retrofits. 50% margin. Quick install, good add-on revenue.' },
                    ].map((item) => (
                      <div key={item.label} className="p-3 rounded-lg bg-surface/50 border border-surface-border">
                        <div className="flex justify-between mb-1">
                          <span className="text-text-primary font-semibold text-sm">{item.label}</span>
                          <span className="text-accent-gold font-display font-semibold text-sm">{item.value}</span>
                        </div>
                        <p className="text-text-muted text-xs">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <ChartCard title="Installation Revenue Growth">
                  <StackedBarChart
                    data={solarOpsRevenue}
                    bars={[
                      { key: 'Residential', label: 'Residential', color: '#f59e0b' },
                      { key: 'Commercial', label: 'Commercial', color: '#c9a84c' },
                      { key: 'Lighting', label: 'Lighting', color: '#d4d4d8' },
                    ]}
                  />
                </ChartCard>
              </div>
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

          {activeTab === 'unit-economics' && (
            <div className="space-y-8">
              <h2 className="font-display font-bold text-text-primary text-2xl">Unit Economics</h2>
              <MetricStrip
                metrics={[
                  { label: 'Roofing Profit/Job', value: 8100, format: 'currency', explanationKey: 'averageJobValue' },
                  { label: 'HVAC Profit/Job', value: 3200, format: 'currency' },
                  { label: 'Solar Profit/Job', value: 18200, format: 'currency' },
                  { label: 'Insulation Profit/Job', value: 5160, format: 'currency' },
                ]}
                columns={4}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { label: 'Roofing', value: '45%', revenue: '$18,000', desc: 'Highest volume service. $8,100 profit per job via subcontractor execution.' },
                  { label: 'Insulation', value: '43%', revenue: '$12,000', desc: 'Grant-eligible. $5,160 profit per job. Material costs low relative to labor.' },
                  { label: 'Air Sealing', value: '55%', revenue: '$5,000', desc: 'Highest margin service. $2,750 profit. Quick execution, minimal material cost.' },
                  { label: 'HVAC', value: '40%', revenue: '$8,000', desc: 'Strong ticket size. $3,200 profit. Growing demand from efficiency mandates.' },
                  { label: 'Water Heater', value: '52%', revenue: '$6,500', desc: '$3,380 profit per job. High margin with grant eligibility.' },
                  { label: 'Solar (Residential)', value: '35%', revenue: '$52,000', desc: '$18,200 profit per job. 4% upsell from roofing customers.' },
                  { label: 'LED Lighting', value: '50%', revenue: '$7,000', desc: '$3,500 profit per job. Quick-install commercial and residential.' },
                ].map((item) => (
                  <div key={item.label} className="luxury-card">
                    <div className="flex justify-between items-baseline mb-2">
                      <h4 className="font-display font-semibold text-text-primary">{item.label}</h4>
                      <span className="text-accent-gold font-display font-bold text-xl">{item.value}</span>
                    </div>
                    <p className="text-text-muted text-xs mb-1">Revenue: {item.revenue}/job</p>
                    <p className="text-text-secondary text-sm">{item.desc}</p>
                  </div>
                ))}
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
                  { label: 'Est. Annual Reimbursement', value: y1.homeServices.grants.estimatedReimbursement, format: 'currency' },
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
                    Revenue per job remains unchanged. Net profit increases due to rebate offsets reducing effective material and labor costs.
                  </p>
                </div>
              </div>

              {/* Rebate Metrics */}
              <MetricStrip
                metrics={[
                  { label: 'Rebate Eligibility Rate', value: assumptions.grants.rebateEligibilityRate, format: 'percent' },
                  { label: 'Rebate-Eligible Deals/Year', value: y1.homeServices.grants.rebateEligibleDeals, format: 'number' },
                  { label: 'Est. Annual Rebate Offset', value: y1.homeServices.grants.estimatedRebateOffset, format: 'currency' },
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
                          const baseCost = svc.revenue * (1 - svc.margin)
                          const rebateOffset = g.rebateEligibilityRate * g.avgRebateCoveragePercent * baseCost
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
