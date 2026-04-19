import { useState } from 'react'
import PageShell from '../components/layout/PageShell'
import SectionBanner from '../components/sections/SectionBanner'
import StickyTabNav from '../components/layout/StickyTabNav'
import MetricStrip from '../components/data-display/MetricStrip'
import ChartCard from '../components/data-display/ChartCard'
import StackedBarChart from '../components/charts/StackedBarChart'
import DonutChart from '../components/charts/DonutChart'
import AreaChartComponent from '../components/charts/AreaChartComponent'
import TimelineBlock from '../components/data-display/TimelineBlock'
import SliderInput from '../components/interactive/SliderInput'
import NumberInput from '../components/interactive/NumberInput'
import { useCalculations } from '../hooks/useCalculations'
import { SOLAR_REAL_ESTATE } from '../data/investorPortal/content'
import { formatCurrency } from '../utils/formatCurrency'
import { formatPercent } from '../utils/formatPercent'
import { DIVISION_COLORS } from '../theme/chartTheme'
import { calcSubdivision } from '../data/investorPortal/formulas/subdivision'
import { useAssumptionsStore } from '../store/useAssumptionsStore'

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'solar-farms', label: 'Solar Farms' },
  { id: 'wholesale', label: 'Wholesale' },
  { id: 'housing', label: 'Housing Development' },
  { id: 'subdivision', label: 'Subdivision' },
  { id: 'revenue-model', label: 'Revenue Model' },
  { id: 'projections', label: 'Projections' },
]

export default function SolarRealEstate() {
  const [activeTab, setActiveTab] = useState('overview')
  const years = useCalculations()
  const y1 = years[0]
  const y5 = years[4]
  const { assumptions, setAssumption } = useAssumptionsStore()

  // Solar farms toggle
  const [showProfit, setShowProfit] = useState(false)
  const [srecMode, setSrecMode] = useState<'annual' | 'upfront'>('annual')

  // Subdivision interactive controls
  const [subdivCostPerAcre, setSubdivCostPerAcre] = useState(15000)
  const [subdivMultiplier, setSubdivMultiplier] = useState(2.5)

  // Compute subdivision with overrides for all 5 years
  const subdivYears = Array.from({ length: 5 }, (_, i) =>
    calcSubdivision(assumptions, i + 1, subdivCostPerAcre, subdivMultiplier)
  )

  const reSegmentRevenue = years.map((y) => ({
    name: `Year ${y.year}`,
    Wholesale: y.realEstate.wholesale.totalRevenue,
    'Solar Farms': y.realEstate.solarFarm.cumulativeSRECRevenue,
    Housing: y.realEstate.housing.totalMarketValue,
    Subdivision: y.realEstate.subdivision.resaleRevenue,
  }))

  const activeAcresData = years.map((y) => ({
    name: `Year ${y.year}`,
    acres: y.realEstate.solarFarm.activeAcres,
  }))

  const solarProfitData = years.map((y) => ({
    name: `Year ${y.year}`,
    'Energy Revenue': y.realEstate.solarFarm.energyRevenue,
    'SREC Revenue': srecMode === 'annual'
      ? y.realEstate.solarFarm.annualSRECRevenue
      : y.realEstate.solarFarm.upfrontSRECValue,
  }))

  // Wholesale 5-year model — uses existing funnel + wholesale calculations
  const wholesaleYearData = years.map((y) => {
    const f = y.realEstate.funnel
    const w = y.realEstate.wholesale
    const subdiv = y.realEstate.subdivision
    return {
      year: y.year,
      monthlyLetters: f.monthlyLetters,
      annualLetters: f.monthlyLetters * 12,
      totalLeads: f.monthlyResponses * 12,
      qualifiedOpps: f.monthlyQualifiedLeads * 12,
      propertiesAcquired: f.annualAcquisitions,
      toSubdivision: subdiv.subdivides,
      toWholesale: w.totalDeals,
      avgProfitPerDeal: w.totalDeals > 0 ? w.totalProfit / w.totalDeals : 0,
      totalWholesaleProfit: w.totalProfit,
      totalWholesaleRevenue: w.totalRevenue,
    }
  })

  // Housing build-to-sell data
  const housingGoals = [
    { year: 1, homes: 0 },
    { year: 2, homes: 10 },
    { year: 3, homes: 25 },
    { year: 4, homes: 40 },
    { year: 5, homes: 60 },
  ]
  const buildCost = 180000
  const marketValue = 300000
  const profitPerHome = marketValue - buildCost

  const housingProfitData = housingGoals.map((g) => ({
    name: `Year ${g.year}`,
    profit: g.homes * profitPerHome,
  }))

  // Subdivision profit data (driven by interactive controls)
  const subdivProfitData = subdivYears.map((s, i) => ({
    name: `Year ${i + 1}`,
    profit: s.profit,
  }))

  return (
    <PageShell fullWidth>
      <SectionBanner
        headline={SOLAR_REAL_ESTATE.headline}
        subtitle={SOLAR_REAL_ESTATE.subtitle}
        accentColor={DIVISION_COLORS.realEstate}
      />

      <div className="section-container">
        <StickyTabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="py-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <MetricStrip
                metrics={[
                  { label: 'Y5 Total RE Revenue', value: y5.realEstate.totalRevenue, format: 'currency' },
                  { label: 'Y5 RE Profit', value: y5.realEstate.totalProfit, format: 'currency' },
                  { label: 'Y5 Active Solar Acres', value: y5.realEstate.solarFarm.activeAcres, format: 'number', explanationKey: 'activeAcres' },
                  { label: 'Y5 Homes Sold', value: y5.realEstate.housing.homesBuilt, format: 'number' },
                ]}
                columns={4}
              />

              {/* Real Estate and Development Strategy */}
              <div className="luxury-card">
                <h3 className="font-display font-semibold text-text-primary text-lg mb-3">Real Estate and Development Strategy</h3>
                <p className="text-text-secondary leading-relaxed mb-4">{SOLAR_REAL_ESTATE.overviewNarrative}</p>
                <p className="text-text-secondary leading-relaxed">{SOLAR_REAL_ESTATE.strategyDetail}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {SOLAR_REAL_ESTATE.pathways.map((p) => (
                  <div key={p.name} className="luxury-card text-center">
                    <div className="w-10 h-10 rounded-lg bg-accent-green/10 mx-auto mb-3 flex items-center justify-center">
                      <span className="text-accent-green-light font-bold text-sm">{p.name[0]}</span>
                    </div>
                    <h4 className="font-display font-semibold text-text-primary text-sm">{p.name}</h4>
                    <p className="text-text-muted text-xs mt-1">{p.description}</p>
                  </div>
                ))}
              </div>

              <ChartCard title="Revenue by Pathway" subtitle="Annual real estate segment contribution">
                <StackedBarChart
                  data={reSegmentRevenue}
                  bars={[
                    { key: 'Wholesale', label: 'Wholesale', color: '#c9a84c' },
                    { key: 'Solar Farms', label: 'Solar Farms', color: '#f59e0b' },
                    { key: 'Housing', label: 'Housing', color: '#2d6a4f' },
                    { key: 'Subdivision', label: 'Subdivision', color: '#6366f1' },
                  ]}
                />
              </ChartCard>
            </div>
          )}

          {activeTab === 'solar-farms' && (
            <div className="space-y-8">
              <h2 className="font-display font-bold text-text-primary text-2xl">Solar Farm Development</h2>

              {/* Strategic Overview */}
              <div className="luxury-card">
                <h3 className="font-display font-semibold text-text-primary text-lg mb-3">Why DC-Area Solar Farms Are a Core Strategic Asset</h3>
                <p className="text-text-secondary leading-relaxed mb-3">
                  Solar farms in the Washington, D.C. corridor represent one of the highest-conviction long-term revenue opportunities in the portfolio. The District's Renewable Portfolio Standard creates structural demand for Solar Renewable Energy Credits (SRECs), producing premium pricing that significantly exceeds national averages. This is not speculative — it is policy-driven, contractable, and durable.
                </p>
                <p className="text-text-secondary leading-relaxed mb-3">
                  Critically, SREC revenue extends for approximately <strong className="text-text-primary">20 years</strong> per qualifying system. This creates a long-duration payout stream for investors — each acre of solar farmland deployed today generates recurring annual income for two decades. The compounding effect of adding new acreage each year means the portfolio's annual revenue grows while prior-year installations continue producing income.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  The company holds a meaningful operational advantage: existing solar installation crews and solar-related execution infrastructure are already in place through the Home Services division. This overlapping capability means the business can expand into solar farm development at lower marginal cost, with proven labor and permitting expertise — capitalizing on highly profitable SREC economics using resources that already exist within the platform.
                </p>
              </div>

              {/* Supporting callouts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="luxury-card text-center py-5">
                  <span className="text-accent-gold font-display font-bold text-3xl">~20 yr</span>
                  <span className="text-text-muted text-xs block mt-2">SREC Revenue Duration per System</span>
                </div>
                <div className="luxury-card text-center py-5">
                  <span className="text-accent-gold font-display font-bold text-3xl">${assumptions.solarFarm.srecPriceDC}</span>
                  <span className="text-text-muted text-xs block mt-2">DC SREC Price per Credit</span>
                </div>
                <div className="luxury-card text-center py-5">
                  <span className="text-accent-gold font-display font-bold text-3xl">{formatCurrency(assumptions.solarFarm.annualSRECRevenuePerAcre, false)}</span>
                  <span className="text-text-muted text-xs block mt-2">Annual SREC Revenue per Acre</span>
                </div>
              </div>

              <MetricStrip
                metrics={[
                  { label: 'Y5 Active Acres', value: y5.realEstate.solarFarm.activeAcres, format: 'number', explanationKey: 'activeAcres' },
                  { label: 'Annual SREC Rev/Acre', value: assumptions.solarFarm.annualSRECRevenuePerAcre, format: 'currency' },
                  { label: 'Y5 Annual SREC Revenue', value: y5.realEstate.solarFarm.annualSRECRevenue, format: 'currency' },
                  { label: 'Y5 Total Profit', value: y5.realEstate.solarFarm.totalProfit, format: 'currency' },
                ]}
                columns={4}
              />

              {/* Toggle between acreage and profit view */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowProfit(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!showProfit ? 'bg-accent-gold/10 text-accent-gold border border-accent-gold/30' : 'bg-surface border border-surface-border text-text-secondary hover:text-text-primary'}`}
                >
                  Acreage View
                </button>
                <button
                  onClick={() => setShowProfit(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${showProfit ? 'bg-accent-gold/10 text-accent-gold border border-accent-gold/30' : 'bg-surface border border-surface-border text-text-secondary hover:text-text-primary'}`}
                >
                  Profit View
                </button>
                {showProfit && (
                  <>
                    <div className="w-px bg-surface-border mx-1" />
                    <button
                      onClick={() => setSrecMode('annual')}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${srecMode === 'annual' ? 'bg-accent-green/10 text-accent-green-light border border-accent-green/30' : 'bg-surface border border-surface-border text-text-secondary hover:text-text-primary'}`}
                    >
                      Annual SREC Revenue
                    </button>
                    <button
                      onClick={() => setSrecMode('upfront')}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${srecMode === 'upfront' ? 'bg-accent-green/10 text-accent-green-light border border-accent-green/30' : 'bg-surface border border-surface-border text-text-secondary hover:text-text-primary'}`}
                    >
                      Upfront SREC Value
                    </button>
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {!showProfit ? (
                  <ChartCard title="Active Solar Acres" subtitle="Cumulative qualifying acres after development lag">
                    <AreaChartComponent data={activeAcresData} dataKey="acres" color="#f59e0b" formatValue={(v) => `${Math.round(v)} acres`} />
                  </ChartCard>
                ) : (
                  <ChartCard
                    title={srecMode === 'annual' ? 'Annual SREC Revenue' : 'Upfront SREC Value'}
                    subtitle={srecMode === 'annual' ? 'Recurring annual revenue from energy + SREC sales' : 'One-time capitalized SREC monetization equivalent'}
                  >
                    <StackedBarChart
                      data={solarProfitData}
                      bars={[
                        { key: 'Energy Revenue', label: 'Energy Revenue', color: '#f59e0b' },
                        { key: 'SREC Revenue', label: srecMode === 'annual' ? 'Annual SREC Revenue' : 'Upfront SREC Value', color: '#c9a84c' },
                      ]}
                    />
                  </ChartCard>
                )}
                <div className="luxury-card">
                  <h3 className="font-display font-semibold text-text-primary text-lg mb-4">Key Economics</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Acres per MW', value: `${assumptions.solarFarm.acresPerMW} acres` },
                      { label: 'Annual MWh per MW', value: '1,500 MWh' },
                      { label: 'Energy Price', value: '$55/MWh' },
                      { label: 'DC SREC Price', value: `$${assumptions.solarFarm.srecPriceDC}/SREC` },
                      { label: 'MD SREC Price', value: `$${assumptions.solarFarm.srecPriceMD}/SREC` },
                      { label: 'DC Qualification Rate', value: formatPercent(assumptions.solarFarm.dcQualificationRate) },
                      { label: 'Development Lag', value: `${assumptions.solarFarm.buildDelayMonths} months` },
                      { label: 'Annual SREC Rev/Acre', value: formatCurrency(assumptions.solarFarm.annualSRECRevenuePerAcre, false) },
                      { label: 'Upfront SREC Value/Acre', value: formatCurrency(assumptions.solarFarm.upfrontSRECValuePerAcre, false) + ' (one-time)' },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between py-2 border-b border-surface-border">
                        <span className="text-text-secondary text-sm">{item.label}</span>
                        <span className="text-text-primary text-sm font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SREC Assumptions Controls */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="luxury-card">
                  <h3 className="font-display font-semibold text-text-primary text-lg mb-4">SREC Assumptions</h3>
                  <div className="space-y-4">
                    <SliderInput
                      label="Annual SREC Revenue/Acre"
                      value={assumptions.solarFarm.annualSRECRevenuePerAcre}
                      min={125000}
                      max={167000}
                      step={1000}
                      onChange={(v) => setAssumption('solarFarm', 'annualSRECRevenuePerAcre', v)}
                      format={(v) => formatCurrency(v, false)}
                    />
                    <SliderInput
                      label="Upfront SREC Value/Acre"
                      value={assumptions.solarFarm.upfrontSRECValuePerAcre}
                      min={275000}
                      max={327000}
                      step={1000}
                      onChange={(v) => setAssumption('solarFarm', 'upfrontSRECValuePerAcre', v)}
                      format={(v) => formatCurrency(v, false)}
                    />
                  </div>
                  <p className="text-text-muted text-xs mt-4 leading-relaxed">
                    Annual SREC Revenue reflects recurring yearly income per acre. Upfront SREC Value represents the equivalent one-time capitalized value if SRECs are contracted or sold forward. These are two ways to model the same underlying economics.
                  </p>
                </div>

                {/* DC SREC Economics Explanation */}
                <div className="luxury-card">
                  <h3 className="font-display font-semibold text-text-primary text-lg mb-3">DC SREC Market Economics</h3>
                  <p className="text-text-secondary text-sm leading-relaxed mb-3">
                    Washington, D.C. maintains one of the strongest Solar Renewable Energy Credit markets in the United States. The District's aggressive Renewable Portfolio Standard requires utilities to source an increasing share of electricity from solar, creating structural demand that supports premium SREC pricing.
                  </p>
                  <p className="text-text-secondary text-sm leading-relaxed mb-3">
                    DC-qualified systems generate SRECs valued at ${assumptions.solarFarm.srecPriceDC}/credit, compared to ${assumptions.solarFarm.srecPriceMD}/credit in Maryland. With {formatPercent(assumptions.solarFarm.dcQualificationRate)} of portfolio systems qualifying for DC pricing, annual SREC economics can materially increase solar farm profitability above national benchmarks.
                  </p>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    The model distinguishes between <strong className="text-text-primary">Annual SREC Revenue</strong> ($125K-$167K/acre/year recurring) and <strong className="text-text-primary">Upfront SREC Value</strong> ($275K-$327K/acre one-time equivalent). In some structures, SRECs can be monetized as a large upfront payment rather than annual income.
                  </p>
                </div>
              </div>

              <TimelineBlock
                phases={[
                  { label: 'Year 1-2', title: 'Acquisition & Permitting', description: 'Source land below market, secure zoning and permits, begin site preparation.', highlight: 'Development lag period — no revenue yet' },
                  { label: 'Year 3', title: 'First Farms Active', description: 'Year 1 acquisitions come online. Energy sales and SREC generation begin.' },
                  { label: 'Year 4-5', title: 'Compounding Portfolio', description: 'Multiple years of acquisitions now active. Revenue from energy and SRECs compounds as active acreage grows.', highlight: 'Revenue accelerates as portfolio matures' },
                ]}
              />
            </div>
          )}

          {activeTab === 'wholesale' && (() => {
            const total5YProfit = wholesaleYearData.reduce((sum, w) => sum + w.totalWholesaleProfit, 0)
            const total5YDeals = wholesaleYearData.reduce((sum, w) => sum + w.toWholesale, 0)
            const wholesaleProfitChartData = wholesaleYearData.map((w) => ({
              name: `Year ${w.year}`,
              profit: w.totalWholesaleProfit,
            }))
            return (
            <div className="space-y-8">
              <h2 className="font-display font-bold text-text-primary text-2xl">Wholesale Strategy</h2>

              {/* Strategy Overview */}
              <div className="luxury-card">
                <h3 className="font-display font-semibold text-text-primary text-lg mb-3">Fast-Turn Property Monetization</h3>
                <p className="text-text-secondary leading-relaxed mb-3">
                  The direct-to-owner acquisition engine generates a high volume of property leads each month. Only a select portion of qualifying opportunities — those with the highest subdivision or development potential — are retained for higher-yield strategies. The remainder of viable properties are wholesaled to an established buyer network for fast cash flow.
                </p>
                <p className="text-text-secondary leading-relaxed mb-3">
                  This creates near-term liquidity while the company selectively retains the strongest properties for subdivision and development. Wholesale does not compete with subdivision — it complements it. Every property that enters the pipeline either becomes a high-upside hold or an immediate-profit wholesale exit.
                </p>
                <p className="text-text-secondary leading-relaxed">
                  Wholesale revenue supports operating cash flow, solar farm maintenance, housing development, and broader reinvestment across the platform. This fast-turn monetization engine is what keeps the entire business operationally funded while higher-yield projects mature over longer timelines.
                </p>
              </div>

              {/* Summary Metrics */}
              <MetricStrip
                metrics={[
                  { label: 'Y1 Wholesale Deals', value: Math.round(wholesaleYearData[0].toWholesale), format: 'number' },
                  { label: 'Y5 Wholesale Deals', value: Math.round(wholesaleYearData[4].toWholesale), format: 'number' },
                  { label: 'Avg Profit/Deal', value: assumptions.realEstate.averageAssignmentFee * 0.85, format: 'currency' },
                  { label: 'Total 5-Year Profit', value: total5YProfit, format: 'currency' },
                ]}
                columns={4}
              />

              {/* Editable Assumptions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="luxury-card">
                  <h3 className="font-display font-semibold text-text-primary text-lg mb-4">Mail Volume by Year</h3>
                  <div className="space-y-3">
                    <NumberInput label="Year 1 Letters/Month" value={assumptions.directMailGrowth.y1LettersPerMonth} min={5000} max={100000} step={500} onChange={(v) => setAssumption('directMailGrowth', 'y1LettersPerMonth', v)} />
                    <NumberInput label="Year 2 Letters/Month" value={assumptions.directMailGrowth.y2LettersPerMonth} min={5000} max={100000} step={500} onChange={(v) => setAssumption('directMailGrowth', 'y2LettersPerMonth', v)} />
                    <NumberInput label="Year 3 Letters/Month" value={assumptions.directMailGrowth.y3LettersPerMonth} min={5000} max={100000} step={500} onChange={(v) => setAssumption('directMailGrowth', 'y3LettersPerMonth', v)} />
                    <NumberInput label="Year 4 Letters/Month" value={assumptions.directMailGrowth.y4LettersPerMonth} min={5000} max={100000} step={500} onChange={(v) => setAssumption('directMailGrowth', 'y4LettersPerMonth', v)} />
                    <NumberInput label="Year 5 Letters/Month" value={assumptions.directMailGrowth.y5LettersPerMonth} min={5000} max={100000} step={500} onChange={(v) => setAssumption('directMailGrowth', 'y5LettersPerMonth', v)} />
                  </div>
                </div>
                <div className="luxury-card">
                  <h3 className="font-display font-semibold text-text-primary text-lg mb-4">Funnel Assumptions</h3>
                  <div className="space-y-3">
                    <SliderInput label="Response Rate" value={assumptions.realEstate.responseRate} min={0.005} max={0.03} step={0.001} onChange={(v) => setAssumption('realEstate', 'responseRate', v)} format={(v) => formatPercent(v)} />
                    <SliderInput label="Lead Conversion Rate" value={assumptions.realEstate.leadRate} min={0.20} max={0.60} step={0.05} onChange={(v) => setAssumption('realEstate', 'leadRate', v)} format={(v) => formatPercent(v)} />
                    <SliderInput label="Close Rate" value={assumptions.realEstate.closeRate} min={0.05} max={0.25} step={0.01} onChange={(v) => setAssumption('realEstate', 'closeRate', v)} format={(v) => formatPercent(v)} />
                  </div>
                </div>
                <div className="luxury-card">
                  <h3 className="font-display font-semibold text-text-primary text-lg mb-4">Allocation & Pricing</h3>
                  <div className="space-y-3">
                    <SliderInput label="Wholesale Allocation" value={assumptions.realEstate.wholesaleAllocation} min={0.40} max={0.85} step={0.05} onChange={(v) => setAssumption('realEstate', 'wholesaleAllocation', v)} format={(v) => formatPercent(v)} />
                    <SliderInput label="Avg Assignment Fee" value={assumptions.realEstate.averageAssignmentFee} min={5000} max={30000} step={1000} onChange={(v) => setAssumption('realEstate', 'averageAssignmentFee', v)} format={(v) => formatCurrency(v, false)} />
                  </div>
                  <div className="mt-4 space-y-2">
                    {[
                      { label: 'Subdivision Allocation', value: formatPercent(1 - assumptions.realEstate.wholesaleAllocation - assumptions.realEstate.solarFarmAllocation) },
                      { label: 'Solar Farm Allocation', value: formatPercent(assumptions.realEstate.solarFarmAllocation) },
                      { label: 'Operating Margin', value: '85%' },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between py-1">
                        <span className="text-text-muted text-xs">{item.label}</span>
                        <span className="text-text-secondary text-xs font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 5-Year Wholesale Model Table */}
              <div className="luxury-card overflow-x-auto">
                <h3 className="font-display font-semibold text-text-primary text-lg mb-4">Five-Year Wholesale Model</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-border">
                      <th className="text-left text-text-muted font-medium py-3 pr-3">Year</th>
                      <th className="text-right text-text-muted font-medium py-3 px-2">Letters/Mo</th>
                      <th className="text-right text-text-muted font-medium py-3 px-2">Annual Letters</th>
                      <th className="text-right text-text-muted font-medium py-3 px-2">Leads</th>
                      <th className="text-right text-text-muted font-medium py-3 px-2">Qualified</th>
                      <th className="text-right text-text-muted font-medium py-3 px-2">Acquired</th>
                      <th className="text-right text-text-muted font-medium py-3 px-2">To Subdiv</th>
                      <th className="text-right text-text-muted font-medium py-3 px-2">To Wholesale</th>
                      <th className="text-right text-text-muted font-medium py-3 px-2">Profit/Deal</th>
                      <th className="text-right text-text-muted font-medium py-3 pl-2">Total Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wholesaleYearData.map((w) => (
                      <tr key={w.year} className="border-b border-surface-border/50">
                        <td className="text-text-secondary py-3 pr-3">Year {w.year}</td>
                        <td className="text-right text-text-primary py-3 px-2">{Math.round(w.monthlyLetters).toLocaleString()}</td>
                        <td className="text-right text-text-primary py-3 px-2">{Math.round(w.annualLetters).toLocaleString()}</td>
                        <td className="text-right text-text-primary py-3 px-2">{Math.round(w.totalLeads).toLocaleString()}</td>
                        <td className="text-right text-text-primary py-3 px-2">{Math.round(w.qualifiedOpps).toLocaleString()}</td>
                        <td className="text-right text-text-primary py-3 px-2">{Math.round(w.propertiesAcquired).toLocaleString()}</td>
                        <td className="text-right text-text-primary py-3 px-2">{w.toSubdivision}</td>
                        <td className="text-right text-text-primary font-medium py-3 px-2">{Math.round(w.toWholesale).toLocaleString()}</td>
                        <td className="text-right text-text-primary py-3 px-2">{formatCurrency(w.avgProfitPerDeal)}</td>
                        <td className="text-right text-accent-gold font-display font-semibold py-3 pl-2">{formatCurrency(w.totalWholesaleProfit)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td className="text-accent-gold font-display font-semibold py-3 pr-3">Total</td>
                      <td className="text-right py-3 px-2" />
                      <td className="text-right text-accent-gold font-display font-semibold py-3 px-2">{wholesaleYearData.reduce((s, w) => s + w.annualLetters, 0).toLocaleString()}</td>
                      <td className="text-right py-3 px-2" />
                      <td className="text-right py-3 px-2" />
                      <td className="text-right py-3 px-2" />
                      <td className="text-right py-3 px-2" />
                      <td className="text-right text-accent-gold font-display font-semibold py-3 px-2">{Math.round(total5YDeals).toLocaleString()}</td>
                      <td className="text-right py-3 px-2" />
                      <td className="text-right text-accent-gold font-display font-semibold py-3 pl-2">{formatCurrency(total5YProfit)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Profit Chart */}
              <ChartCard title="Wholesale Profit Growth" subtitle="Annual wholesale profit driven by mail volume scaling">
                <AreaChartComponent
                  data={wholesaleProfitChartData}
                  dataKey="profit"
                  color="#c9a84c"
                  formatValue={(v) => formatCurrency(v)}
                />
              </ChartCard>

              {/* Buyer Network Explainer */}
              <div className="luxury-card">
                <h3 className="font-display font-semibold text-text-primary text-lg mb-3">Buyer Network Infrastructure</h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-4">
                  A portion of deployed capital supports building an extensive buyer network — the strategic infrastructure that makes wholesale exits faster and more profitable. This network is a compounding asset: every new buyer added increases the speed and certainty of future transactions.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: 'Buyer List Acquisition', desc: 'Purchase and aggregate verified buyer lists segmented by geography, budget range, and asset preferences.' },
                    { title: 'Criteria Collection', desc: 'Collect buyer criteria through structured intake forms — property type, location, size, and price range — to enable instant matching.' },
                    { title: 'AI-Based Matching', desc: 'Use automated matching to pair newly acquired properties with the best-fit buyers in the network, reducing days-to-sale.' },
                    { title: 'Network Growth', desc: 'As the network grows, each deal closes faster with higher certainty — increasing profit realization and operating efficiency.' },
                  ].map((item) => (
                    <div key={item.title} className="bg-surface/50 border border-surface-border rounded-lg p-4">
                      <h4 className="text-text-primary text-sm font-semibold mb-2">{item.title}</h4>
                      <p className="text-text-muted text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            )
          })()}

          {activeTab === 'housing' && (
            <div className="space-y-8">
              <h2 className="font-display font-bold text-text-primary text-2xl">Housing Development</h2>

              {/* Strategic framing */}
              <div className="luxury-card">
                <h3 className="font-display font-semibold text-text-primary text-lg mb-3">Build-to-Sell Strategy</h3>
                <p className="text-text-secondary leading-relaxed">
                  The primary housing development strategy is build-to-sell. The purpose is to convert development capital into realized profits through home sales, creating measurable yearly profit growth across the five-year model. Each home is built at a controlled cost basis and sold at market value, generating immediate profit realization rather than long-duration hold strategies.
                </p>
              </div>

              <MetricStrip
                metrics={[
                  { label: 'Build Cost/Home', value: buildCost, format: 'currency' },
                  { label: 'Market Value/Home', value: marketValue, format: 'currency' },
                  { label: 'Profit/Home', value: profitPerHome, format: 'currency' },
                  { label: 'Y5 Annual Profit', value: 60 * profitPerHome, format: 'currency' },
                ]}
                columns={4}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 5-Year Goal Structure */}
                <div className="luxury-card">
                  <h3 className="font-display font-semibold text-text-primary text-lg mb-4">5-Year Housing Targets</h3>
                  <div className="space-y-3">
                    {housingGoals.map((g) => (
                      <div key={g.year} className="flex justify-between py-2 border-b border-surface-border">
                        <span className="text-text-secondary text-sm">Year {g.year}</span>
                        <div className="text-right">
                          <span className="text-text-primary text-sm font-medium">{g.homes} homes</span>
                          <span className="text-text-muted text-xs ml-3">{formatCurrency(g.homes * profitPerHome)} profit</span>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2">
                      <span className="text-accent-gold text-sm font-semibold">Total (5-Year)</span>
                      <div className="text-right">
                        <span className="text-accent-gold text-sm font-display font-semibold">135 homes</span>
                        <span className="text-accent-gold text-xs font-display font-semibold ml-3">{formatCurrency(135 * profitPerHome)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Development Economics */}
                <div className="luxury-card">
                  <h3 className="font-display font-semibold text-text-primary text-lg mb-4">Development Economics</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Build Cost Per Home', value: formatCurrency(buildCost) },
                      { label: 'Market Value Per Home', value: formatCurrency(marketValue) },
                      { label: 'Profit Per Home', value: formatCurrency(profitPerHome) },
                      { label: 'Profit Margin', value: '40%' },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between py-2 border-b border-surface-border">
                        <span className="text-text-secondary text-sm">{item.label}</span>
                        <span className="text-text-primary text-sm font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Year-by-Year Profit Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Annual Housing Profit" subtitle="Projected profit from home sales">
                  <AreaChartComponent
                    data={housingProfitData}
                    dataKey="profit"
                    color={DIVISION_COLORS.realEstate}
                    formatValue={(v) => formatCurrency(v)}
                  />
                </ChartCard>
                <div className="luxury-card overflow-x-auto">
                  <h3 className="font-display font-semibold text-text-primary text-lg mb-4">Year-by-Year Breakdown</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-surface-border">
                        <th className="text-left text-text-muted font-medium py-3 pr-4">Year</th>
                        <th className="text-right text-text-muted font-medium py-3 px-2">Homes</th>
                        <th className="text-right text-text-muted font-medium py-3 px-2">Build Cost</th>
                        <th className="text-right text-text-muted font-medium py-3 px-2">Market Value</th>
                        <th className="text-right text-text-muted font-medium py-3 pl-2">Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {housingGoals.map((g) => (
                        <tr key={g.year} className="border-b border-surface-border/50">
                          <td className="text-text-secondary py-3 pr-4">Year {g.year}</td>
                          <td className="text-right text-text-primary font-medium py-3 px-2">{g.homes}</td>
                          <td className="text-right text-text-primary py-3 px-2">{formatCurrency(g.homes * buildCost)}</td>
                          <td className="text-right text-text-primary py-3 px-2">{formatCurrency(g.homes * marketValue)}</td>
                          <td className="text-right text-accent-gold font-display font-semibold py-3 pl-2">{formatCurrency(g.homes * profitPerHome)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'subdivision' && (() => {
            const totalSubdivides = subdivYears.reduce((sum, s) => sum + s.subdivides, 0)
            const totalProfit5Y = subdivYears.reduce((sum, s) => sum + s.profit, 0)
            return (
            <div className="space-y-8">
              <h2 className="font-display font-bold text-text-primary text-2xl">Subdivision Strategy</h2>

              {/* Strategic explanation */}
              <div className="luxury-card">
                <h3 className="font-display font-semibold text-text-primary text-lg mb-3">Subdivision Growth Plan</h3>
                <p className="text-text-secondary leading-relaxed">
                  The subdivision strategy scales intentionally over five years, growing from 20 subdivides in Year 1 to 100 in Year 5. Higher yearly subdivision volume increases land monetization and profit generation as the acquisition engine matures. The model is designed to show both operational scale and economic upside — each subdivide converts a single acquired property into multiple high-value lots, creating significant multiple expansion relative to raw land acquisition cost.
                </p>
              </div>

              {/* Yearly Subdivision Targets */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {subdivYears.map((s, i) => (
                  <div key={i} className="luxury-card text-center py-4">
                    <span className="text-text-muted text-xs uppercase tracking-wider block mb-1">Year {i + 1}</span>
                    <span className="text-accent-gold font-display font-bold text-2xl">{s.subdivides}</span>
                    <span className="text-text-muted text-xs block mt-1">subdivides</span>
                  </div>
                ))}
              </div>

              {/* Summary Metrics */}
              <MetricStrip
                metrics={[
                  { label: 'Total 5-Year Subdivides', value: totalSubdivides, format: 'number' },
                  { label: 'Avg Acres / Property', value: subdivYears[0].avgAcresPerProperty, format: 'number' },
                  { label: 'Avg Lots / Subdivide', value: subdivYears[0].subdivisionCountPerProperty, format: 'number' },
                  { label: 'Est. Profit / Subdivide', value: subdivYears[0].profitPerSubdivide, format: 'currency' },
                  { label: 'Total 5-Year Profit', value: totalProfit5Y, format: 'currency' },
                ]}
                columns={5}
              />

              {/* Year-by-Year Breakdown Table + Assumptions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 luxury-card overflow-x-auto">
                  <h3 className="font-display font-semibold text-text-primary text-lg mb-4">Year-by-Year Breakdown</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-surface-border">
                        <th className="text-left text-text-muted font-medium py-3 pr-4">Year</th>
                        <th className="text-right text-text-muted font-medium py-3 px-2">Subdivides</th>
                        <th className="text-right text-text-muted font-medium py-3 px-2">Acres</th>
                        <th className="text-right text-text-muted font-medium py-3 px-2">Lots Created</th>
                        <th className="text-right text-text-muted font-medium py-3 px-2">Acquisition Cost</th>
                        <th className="text-right text-text-muted font-medium py-3 px-2">Gross Revenue</th>
                        <th className="text-right text-text-muted font-medium py-3 pl-2">Profit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subdivYears.map((s, i) => (
                        <tr key={i} className="border-b border-surface-border/50">
                          <td className="text-text-secondary py-3 pr-4">Year {i + 1}</td>
                          <td className="text-right text-text-primary font-medium py-3 px-2">{s.subdivides}</td>
                          <td className="text-right text-text-primary py-3 px-2">{s.acres.toLocaleString()}</td>
                          <td className="text-right text-text-primary py-3 px-2">{s.totalLots.toLocaleString()}</td>
                          <td className="text-right text-text-primary py-3 px-2">{formatCurrency(s.totalAcquisitionCost)}</td>
                          <td className="text-right text-text-primary py-3 px-2">{formatCurrency(s.resaleRevenue)}</td>
                          <td className="text-right text-accent-gold font-display font-semibold py-3 pl-2">{formatCurrency(s.profit)}</td>
                        </tr>
                      ))}
                      <tr>
                        <td className="text-accent-gold font-display font-semibold py-3 pr-4">Total</td>
                        <td className="text-right text-accent-gold font-display font-semibold py-3 px-2">{totalSubdivides}</td>
                        <td className="text-right text-accent-gold font-display font-semibold py-3 px-2">{subdivYears.reduce((sum, s) => sum + s.acres, 0).toLocaleString()}</td>
                        <td className="text-right text-accent-gold font-display font-semibold py-3 px-2">{subdivYears.reduce((sum, s) => sum + s.totalLots, 0).toLocaleString()}</td>
                        <td className="text-right text-accent-gold font-display font-semibold py-3 px-2">{formatCurrency(subdivYears.reduce((sum, s) => sum + s.totalAcquisitionCost, 0))}</td>
                        <td className="text-right text-accent-gold font-display font-semibold py-3 px-2">{formatCurrency(subdivYears.reduce((sum, s) => sum + s.resaleRevenue, 0))}</td>
                        <td className="text-right text-accent-gold font-display font-semibold py-3 pl-2">{formatCurrency(totalProfit5Y)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Assumptions Panel */}
                <div className="luxury-card">
                  <h3 className="font-display font-semibold text-text-primary text-lg mb-4">Assumptions</h3>
                  <div className="space-y-3 mb-6">
                    {[
                      { label: 'Avg Acres Per Property', value: `${subdivYears[0].avgAcresPerProperty}` },
                      { label: 'Avg Lots Per Subdivide', value: `${subdivYears[0].subdivisionCountPerProperty}` },
                      { label: 'Profit Multiplier', value: `${subdivMultiplier.toFixed(1)}x` },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between py-2 border-b border-surface-border">
                        <span className="text-text-secondary text-sm">{item.label}</span>
                        <span className="text-text-primary text-sm font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <NumberInput
                      label="Average Cost Per Acre"
                      value={subdivCostPerAcre}
                      min={5000}
                      max={50000}
                      step={1000}
                      onChange={setSubdivCostPerAcre}
                      prefix="$"
                    />
                    <SliderInput
                      label="Profit Multiplier"
                      value={subdivMultiplier}
                      min={1.5}
                      max={4.0}
                      step={0.1}
                      onChange={setSubdivMultiplier}
                      format={(v) => `${v.toFixed(1)}x`}
                    />
                  </div>
                </div>
              </div>

              {/* Profit Graph */}
              <ChartCard title="Projected Subdivision Profit" subtitle="5-year profit driven by yearly subdivision targets">
                <AreaChartComponent
                  data={subdivProfitData}
                  dataKey="profit"
                  color="#6366f1"
                  formatValue={(v) => formatCurrency(v)}
                />
              </ChartCard>

              {/* Process Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { title: 'Identify', desc: 'Parcels with subdivision potential are flagged during acquisition due diligence based on acreage, zoning, and local demand.' },
                  { title: 'Split', desc: 'Survey, plat, and obtain regulatory approvals to divide into individual lots. Timeline: 3-6 months per parcel.' },
                  { title: 'Sell', desc: 'Individual lots sold at 2-3x+ the per-acre acquisition cost to builders, investors, or end buyers.' },
                ].map((item) => (
                  <div key={item.title} className="luxury-card">
                    <h4 className="text-accent-gold font-semibold text-sm mb-2">{item.title}</h4>
                    <p className="text-text-muted text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            )
          })()}

          {activeTab === 'revenue-model' && (
            <div className="space-y-8">
              <h2 className="font-display font-bold text-text-primary text-2xl">Integrated Revenue Model</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Revenue by Pathway" subtitle="How each pathway contributes to total RE revenue">
                  <DonutChart
                    data={[
                      { name: 'Wholesale', value: y5.realEstate.wholesale.totalRevenue, color: '#c9a84c' },
                      { name: 'Solar Farms', value: y5.realEstate.solarFarm.cumulativeSRECRevenue, color: '#f59e0b' },
                      { name: 'Housing', value: y5.realEstate.housing.totalMarketValue, color: '#2d6a4f' },
                      { name: 'Subdivision', value: y5.realEstate.subdivision.resaleRevenue, color: '#6366f1' },
                    ]}
                    centerLabel="Y5 Total"
                    centerValue={formatCurrency(y5.realEstate.totalRevenue)}
                  />
                </ChartCard>
                <ChartCard title="Deal Allocation" subtitle="Year 5 deal routing">
                  <DonutChart
                    data={[
                      { name: 'Wholesale (40%)', value: 40, color: '#c9a84c' },
                      { name: 'Solar Farms (25%)', value: 25, color: '#f59e0b' },
                      { name: 'Housing (20%)', value: 20, color: '#2d6a4f' },
                      { name: 'Subdivision (15%)', value: 15, color: '#6366f1' },
                    ]}
                    formatAs="percent"
                    centerLabel="Allocation"
                    centerValue="By Deal"
                  />
                </ChartCard>
              </div>
            </div>
          )}

          {activeTab === 'projections' && (
            <div className="space-y-8">
              <h2 className="font-display font-bold text-text-primary text-2xl">Projections</h2>
              <MetricStrip
                metrics={[
                  { label: 'Y1 RE Revenue', value: y1.realEstate.totalRevenue, format: 'currency' },
                  { label: 'Y5 RE Revenue', value: y5.realEstate.totalRevenue, format: 'currency' },
                  { label: 'Y1 RE Profit', value: y1.realEstate.totalProfit, format: 'currency' },
                  { label: 'Y5 RE Profit', value: y5.realEstate.totalProfit, format: 'currency' },
                ]}
                columns={4}
              />
              <ChartCard title="Real Estate Revenue by Pathway" subtitle="5-year stacked view">
                <StackedBarChart
                  data={reSegmentRevenue}
                  bars={[
                    { key: 'Wholesale', label: 'Wholesale', color: '#c9a84c' },
                    { key: 'Solar Farms', label: 'Solar Farms', color: '#f59e0b' },
                    { key: 'Housing', label: 'Housing', color: '#2d6a4f' },
                    { key: 'Subdivision', label: 'Subdivision', color: '#6366f1' },
                  ]}
                  height={350}
                />
              </ChartCard>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  )
}
