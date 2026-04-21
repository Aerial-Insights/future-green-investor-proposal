import { useState } from 'react'
import PageShell from '../components/layout/PageShell'
import SectionBanner from '../components/sections/SectionBanner'
import MetricCard from '../components/data-display/MetricCard'
import ChartCard from '../components/data-display/ChartCard'
import ScenarioButtons from '../components/interactive/ScenarioButtons'
import AssumptionGroup from '../components/interactive/AssumptionGroup'
import SliderInput from '../components/interactive/SliderInput'
import RevenueLineChart from '../components/charts/RevenueLineChart'
import StackedBarChart from '../components/charts/StackedBarChart'
import DonutChart from '../components/charts/DonutChart'
import CostBox from '../components/data-display/CostBox'
import { useAssumptionsStore } from '../store/useAssumptionsStore'
import { useCalculations, useInvestorReturns, useLongTermSREC, useAerialResiduals } from '../hooks/useCalculations'
import AerialResidualsBreakdown from '../components/sections/AerialResidualsBreakdown'
import type { AllAssumptions } from '../data/investorPortal/baseAssumptions'
import type { YearlyOutputs } from '../data/investorPortal/formulas/types'
import { formatCurrency } from '../utils/formatCurrency'
import { formatPercent } from '../utils/formatPercent'
import { DIVISION_COLORS, useChartTheme } from '../theme/chartTheme'
import {
  ComposedChart, Bar as RechartsBar, Line as RechartsLine,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

export default function AssumptionsLab() {
  const { assumptions, setAssumption } = useAssumptionsStore()
  const years = useCalculations()
  const y5 = years[4]
  const investorReturns = useInvestorReturns()
  const longTermSREC = useLongTermSREC()
  const aerialResiduals = useAerialResiduals()

  const revenueData = years.map((y) => ({
    name: `Y${y.year}`,
    'Home Services': y.portfolio.homeServicesProfit,
    Solar: y.portfolio.solarOperationsProfit,
    'Real Estate': y.portfolio.realEstateProfit,
    Aerial: y.portfolio.aerialProfit,
  }))

  const totalRevenueData = years.map((y) => ({
    name: `Y${y.year}`,
    profit: y.portfolio.totalProfit,
  }))

  // ─── Cost Computations ──────────────────────────────────────────────
  // Home Services: direct mail + commercial ads + PPC + solar lead generation
  const hsDirectMailCost = years.reduce((s, y) => s + y.homeServices.directMail.costPerMonth * 12, 0)
  const hsCommercialCost = years.reduce((s, y) => s + y.homeServices.commercial.adSpendMonthly * 12, 0)
  const hsPPCCost = years.reduce((s, y) => s + y.homeServices.energyGrants.adSpendMonthly * 12, 0)
  const hsSolarLeadCost = years.reduce((s, y) => s + y.realEstate.distributedSolar.marketingSpend, 0)
  const hsTotalCost = hsDirectMailCost + hsCommercialCost + hsPPCCost + hsSolarLeadCost

  // Real Estate Operations: land acquisition mail marketing
  const srLandMailCost = years.reduce((s, y) =>
    s + y.realEstate.funnel.monthlyLetters * assumptions.directMailGrowth.costPerLetter * 12, 0)
  const srTotalCost = srLandMailCost

  // Aerial Insights: monthly marketing budget is the canonical spend
  // (CAC × users is a derived efficiency metric, not a separate spend line)
  const aerialMarketingCost = assumptions.aerial.aerialMarketingMonthly * 12 * 5
  const aerialTotalCost = aerialMarketingCost
  // Derived: effective CAC across all new users acquired over 5 years
  const aerialTotalNewUsers = years.reduce((s, y, i) => {
    const prevUsers = i > 0 ? years[i - 1].aerial.activeUsers : assumptions.aerial.startingUsers
    return s + Math.max(0, y.aerial.activeUsers - prevUsers)
  }, 0)
  const aerialEffectiveCAC = aerialTotalNewUsers > 0 ? aerialMarketingCost / aerialTotalNewUsers : 0

  return (
    <PageShell fullWidth>
      <SectionBanner
        headline="Assumptions Lab"
        subtitle="Adjust key business levers and see live updates to revenue, profit, and return projections."
        accentColor="#f59e0b"
      />

      <div className="section-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT PANEL — Controls */}
          <div className="lg:col-span-4 space-y-4">
            <ScenarioButtons />

            <AssumptionGroup title="Home Services" defaultOpen>
              <SliderInput label="Sales Reps" value={assumptions.sales.reps} min={5} max={60} step={1} onChange={(v) => setAssumption('sales', 'reps', v)} />
              <SliderInput label="Doors/Rep/Day" value={assumptions.sales.doorsPerRepPerDay} min={20} max={80} step={5} onChange={(v) => setAssumption('sales', 'doorsPerRepPerDay', v)} />
              <SliderInput label="D2D Conversion Rate" value={assumptions.sales.d2dConversionRate} min={0.005} max={0.05} step={0.005} onChange={(v) => setAssumption('sales', 'd2dConversionRate', v)} format={(v) => formatPercent(v)} />
              <SliderInput label="Mail Pieces/Month" value={assumptions.sales.directMailPiecesPerMonth} min={5000} max={50000} step={1000} onChange={(v) => setAssumption('sales', 'directMailPiecesPerMonth', v)} format={(v) => v.toLocaleString()} />
              <SliderInput label="Commercial Ad Spend" value={assumptions.sales.commercialAdSpendMonthly} min={10000} max={100000} step={5000} onChange={(v) => setAssumption('sales', 'commercialAdSpendMonthly', v)} format={(v) => formatCurrency(v, false)} />
              <SliderInput label="Grants PPC Spend" value={assumptions.sales.grantsPPCSpendMonthly} min={10000} max={100000} step={5000} onChange={(v) => setAssumption('sales', 'grantsPPCSpendMonthly', v)} format={(v) => formatCurrency(v, false)} />
              <SliderInput label="Roofing Revenue/Job" value={assumptions.serviceEconomics.roofingRevenuePerJob} min={5000} max={30000} step={500} onChange={(v) => setAssumption('serviceEconomics', 'roofingRevenuePerJob', v)} format={(v) => formatCurrency(v, false)} />
              <SliderInput label="Insulation Revenue/Job" value={assumptions.serviceEconomics.insulationRevenuePerJob} min={3000} max={20000} step={500} onChange={(v) => setAssumption('serviceEconomics', 'insulationRevenuePerJob', v)} format={(v) => formatCurrency(v, false)} />
              <SliderInput label="HVAC Revenue/Job" value={assumptions.serviceEconomics.hvacRevenuePerJob} min={4000} max={15000} step={500} onChange={(v) => setAssumption('serviceEconomics', 'hvacRevenuePerJob', v)} format={(v) => formatCurrency(v, false)} />
              <SliderInput label="Roofing Margin" value={assumptions.serviceEconomics.roofingMargin} min={0.20} max={0.60} step={0.02} onChange={(v) => setAssumption('serviceEconomics', 'roofingMargin', v)} format={(v) => formatPercent(v)} />
              <SliderInput label="Cost Per Mail Piece" value={assumptions.sales.directMailCostPerPiece} min={0.50} max={3.00} step={0.10} onChange={(v) => setAssumption('sales', 'directMailCostPerPiece', v)} format={(v) => formatCurrency(v, false)} />
              <SliderInput label="Solar Lead Cost" value={assumptions.distributedSolar.leadCost} min={120} max={350} step={10} onChange={(v) => setAssumption('distributedSolar', 'leadCost', v)} format={(v) => formatCurrency(v, false)} />
              <SliderInput label="Solar Conversion Rate" value={assumptions.distributedSolar.conversionRate} min={0.04} max={0.15} step={0.01} onChange={(v) => setAssumption('distributedSolar', 'conversionRate', v)} format={(v) => formatPercent(v)} />
              <SliderInput label="Y1 Solar Spend/Mo" value={assumptions.distributedSolar.monthlySpendY1} min={20000} max={150000} step={5000} onChange={(v) => setAssumption('distributedSolar', 'monthlySpendY1', v)} format={(v) => formatCurrency(v, false)} />
              <SliderInput label="Y5 Solar Spend/Mo" value={assumptions.distributedSolar.monthlySpendY5} min={100000} max={350000} step={5000} onChange={(v) => setAssumption('distributedSolar', 'monthlySpendY5', v)} format={(v) => formatCurrency(v, false)} />
            </AssumptionGroup>

            <AssumptionGroup title="Real Estate">
              <SliderInput label="Mail Volume/Month" value={assumptions.realEstate.mailVolumePerMonth} min={5000} max={50000} step={1000} onChange={(v) => setAssumption('realEstate', 'mailVolumePerMonth', v)} format={(v) => v.toLocaleString()} />
              <SliderInput label="Response Rate" value={assumptions.realEstate.responseRate} min={0.005} max={0.03} step={0.001} onChange={(v) => setAssumption('realEstate', 'responseRate', v)} format={(v) => formatPercent(v)} />
              <SliderInput label="Close Rate" value={assumptions.realEstate.closeRate} min={0.35} max={0.80} step={0.01} onChange={(v) => setAssumption('realEstate', 'closeRate', v)} format={(v) => formatPercent(v)} />
              <SliderInput label="Assignment Fee" value={assumptions.realEstate.averageAssignmentFee} min={5000} max={30000} step={1000} onChange={(v) => setAssumption('realEstate', 'averageAssignmentFee', v)} format={(v) => formatCurrency(v, false)} />
              <SliderInput label="SREC Value/Credit" value={assumptions.distributedSolar.srecValue} min={300} max={500} step={25} onChange={(v) => setAssumption('distributedSolar', 'srecValue', v)} format={(v) => formatCurrency(v, false)} />
              <SliderInput label="SRECs Per Install" value={assumptions.distributedSolar.srecsPerInstall} min={8} max={16} step={1} onChange={(v) => setAssumption('distributedSolar', 'srecsPerInstall', v)} format={(v) => `${v}/yr`} />
              <SliderInput label="Build Cost/Unit" value={assumptions.housing.buildCostPerUnit} min={100000} max={400000} step={10000} onChange={(v) => setAssumption('housing', 'buildCostPerUnit', v)} format={(v) => formatCurrency(v, false)} />
              <SliderInput label="Market Value/Unit" value={assumptions.housing.marketValuePerUnit} min={150000} max={500000} step={10000} onChange={(v) => setAssumption('housing', 'marketValuePerUnit', v)} format={(v) => formatCurrency(v, false)} />
            </AssumptionGroup>

            <AssumptionGroup title="Aerial Insights">
              <SliderInput label="Starting Users" value={assumptions.aerial.startingUsers} min={100} max={10000} step={50} onChange={(v) => setAssumption('aerial', 'startingUsers', v)} />
              <SliderInput label="Monthly Growth Rate" value={assumptions.aerial.monthlyGrowthRate} min={0.03} max={0.50} step={0.01} onChange={(v) => setAssumption('aerial', 'monthlyGrowthRate', v)} format={(v) => formatPercent(v)} />
              <SliderInput label="Churn Rate" value={assumptions.aerial.churnRate} min={0.01} max={0.10} step={0.01} onChange={(v) => setAssumption('aerial', 'churnRate', v)} format={(v) => formatPercent(v)} />
              <SliderInput label="Subscription/Mo" value={assumptions.aerial.subscriptionMonthly} min={500} max={5000} step={100} onChange={(v) => setAssumption('aerial', 'subscriptionMonthly', v)} format={(v) => formatCurrency(v, false)} />
              <SliderInput label="CAC" value={assumptions.aerial.customerAcquisitionCost} min={50} max={500} step={25} onChange={(v) => setAssumption('aerial', 'customerAcquisitionCost', v)} format={(v) => formatCurrency(v, false)} />
              <SliderInput label="Marketing Spend/Mo" value={assumptions.aerial.aerialMarketingMonthly} min={5000} max={200000} step={5000} onChange={(v) => setAssumption('aerial', 'aerialMarketingMonthly', v)} format={(v) => formatCurrency(v, false)} />
              <div className="flex items-center justify-between py-1.5 px-1">
                <span className="text-text-secondary text-xs font-medium">Avg Monthly Spend</span>
                <span className="text-text-primary text-xs font-display font-semibold">
                  {formatCurrency(years[0].aerial.customerAcquisitionCost / 12 + years[0].aerial.scanCostMonthly, false)}
                </span>
              </div>
            </AssumptionGroup>

          </div>

          {/* RIGHT PANEL — Outputs */}
          <div className="lg:col-span-8 space-y-6">
            {/* Investor Returns */}
            <div className="luxury-card p-6 border border-surface-border/60">
              <h3 className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-4">
                Investor Returns
              </h3>
              <div className="space-y-4">
                {/* 65% Return Threshold — $66M total returned */}
                <div className="rounded-xl p-5 text-center" style={{ background: 'linear-gradient(135deg, #064e3b, #065f46)', borderColor: '#10b981', border: '1px solid #10b981' }}>
                  <p className="text-emerald-200 text-xs uppercase tracking-[0.15em] font-semibold mb-1">65% Return Target</p>
                  <p className="text-white font-display font-bold text-4xl mb-1">{formatCurrency(investorReturns.thresholdTarget)}</p>
                  <p className="text-emerald-200 text-sm font-medium">
                    {investorReturns.monthsToThreshold !== null
                      ? `Reached in ${Math.floor(investorReturns.monthsToThreshold / 12)} year${Math.floor(investorReturns.monthsToThreshold / 12) !== 1 ? 's' : ''}${investorReturns.monthsToThreshold % 12 > 0 ? `, ${investorReturns.monthsToThreshold % 12} month${investorReturns.monthsToThreshold % 12 !== 1 ? 's' : ''}` : ''}`
                      : `${formatCurrency(investorReturns.totalDistributed)} returned through Year 5`}
                  </p>
                  <p className="text-emerald-300/60 text-[10px] mt-1">
                    {formatCurrency(investorReturns.totalCapital)} principal + 65% return — all investor cash flows count toward threshold
                  </p>
                </div>
                {/* Year 1-5 Annual Returns */}
                <div className="grid grid-cols-5 gap-4">
                  {investorReturns.annualReturns.map((yr, i) => {
                    const blues = [
                      { bg: 'linear-gradient(135deg, #1e3a5f, #1e4976)', border: '#60a5fa' },
                      { bg: 'linear-gradient(135deg, #1e4976, #1a3f6b)', border: '#3b82f6' },
                      { bg: 'linear-gradient(135deg, #1a3f6b, #163560)', border: '#2563eb' },
                      { bg: 'linear-gradient(135deg, #163560, #122b55)', border: '#1d4ed8' },
                      { bg: 'linear-gradient(135deg, #122b55, #0f1f3d)', border: '#1e40af' },
                    ]
                    const phaseLabel = yr.thresholdMetThisYear
                      ? 'Threshold'
                      : yr.thresholdMet
                        ? 'Residual'
                        : 'Accelerated'
                    return (
                      <div key={yr.year} className="text-center">
                        <MetricCard
                          label={`Year ${yr.year}`}
                          value={yr.totalReturnThisYear}
                          format="currency"
                          compact
                          style={{ background: blues[i].bg, borderColor: blues[i].border }}
                          className="!text-white [&_p]:!text-white [&_p.text-text-secondary]:!text-blue-200"
                        />
                        <p className="text-[10px] text-blue-300/70 mt-1 uppercase tracking-wider font-medium">{phaseLabel}</p>
                      </div>
                    )
                  })}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <MetricCard
                    label="20-Year SRECs (50%)"
                    value={longTermSREC.totalInvestorSRECIncome}
                    format="currency"
                    style={{ background: 'linear-gradient(135deg, #78620a, #a17f1a)', borderColor: '#c9a84c' }}
                    className="!text-white [&_p]:!text-white [&_p.text-text-secondary]:!text-amber-200"
                  />
                  <div>
                    <MetricCard
                      label="Aerial Residual (3%)"
                      value={investorReturns.projectedAnnualAerialResidual}
                      format="currency"
                      style={{ background: 'linear-gradient(135deg, #312e81, #4338ca)', borderColor: '#6366f1' }}
                      className="!text-white [&_p]:!text-white [&_p.text-text-secondary]:!text-indigo-200"
                    />
                    <p className="text-indigo-300/60 text-[10px] text-center mt-1 px-2">
                      Annual post-threshold residual
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 20-Year SREC Revenue Breakdown */}
            <SRECBreakdown longTermSREC={longTermSREC} />

            {/* Aerial Insights Residual Economics */}
            <AerialResidualsBreakdown residuals={aerialResiduals} />

            {/* KPI Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <MetricCard label="Y5 Total Profit" value={y5.portfolio.totalProfit} format="currency" explanationKey="totalRevenue" compact />
              <MetricCard label="Y5 Home Services" value={y5.portfolio.homeServicesProfit} format="currency" compact />
              <MetricCard label="Y5 Real Estate" value={y5.portfolio.realEstateProfit} format="currency" compact />
              <MetricCard label="Y5 Aerial ARR" value={y5.aerial.totalARR} format="currency" explanationKey="mrr" compact />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <MetricCard label="Y5 Solar Ops" value={y5.portfolio.solarOperationsProfit} format="currency" compact />
              <MetricCard label="Y5 Aerial Profit" value={y5.portfolio.aerialProfit} format="currency" compact />
              <MetricCard label="Y5 Homes Sold" value={y5.realEstate.housing.homesBuilt} format="number" compact />
              <MetricCard label="Y5 Cumulative Installs" value={y5.realEstate.distributedSolar.cumulativeInstalls} format="number" explanationKey="cumulativeInstalls" compact />
            </div>

            {/* Cost Boxes */}
            <div>
              <h3 className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-3">
                Marketing Spend by Division
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <CostBox
                  title="Home Services — Acquisition Marketing"
                  totalCost={hsTotalCost}
                  subtitle="5-Year Marketing Spend"
                  breakdowns={[
                    { label: 'Direct Mail', value: hsDirectMailCost },
                    { label: 'Commercial Ads', value: hsCommercialCost },
                    { label: 'Grants PPC', value: hsPPCCost },
                    { label: 'Solar Lead Generation', value: hsSolarLeadCost },
                  ]}
                />
                <CostBox
                  title="Real Estate Operations — Marketing"
                  totalCost={srTotalCost}
                  subtitle="5-Year Marketing Spend"
                  breakdowns={[
                    { label: 'Land Acquisition Mail', value: srLandMailCost },
                  ]}
                />
                <CostBox
                  title="Aerial Insights — Growth Marketing"
                  totalCost={aerialTotalCost}
                  subtitle={`5-Year Marketing Spend · Effective CAC: ${formatCurrency(aerialEffectiveCAC, false)}/user`}
                  breakdowns={[
                    { label: 'Marketing Budget (5yr)', value: aerialMarketingCost },
                  ]}
                />
              </div>
              <div className="mt-3 luxury-card p-4 border-accent-gold/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-accent-gold text-xs uppercase tracking-[0.15em] font-semibold">Total 5-Year Marketing Spend</p>
                    <p className="text-text-muted text-[10px] mt-0.5">Combined across all divisions</p>
                  </div>
                  <p className="text-accent-gold font-display font-bold text-2xl">{formatCurrency(hsTotalCost + srTotalCost + aerialTotalCost)}</p>
                </div>
              </div>
            </div>

            {/* Charts */}
            <ChartCard title="Profit Trajectory" subtitle="Total portfolio performance over 5 years">
              <RevenueLineChart
                data={totalRevenueData}
                lines={[
                  { key: 'profit', label: 'Total Profit', color: '#c9a84c' },
                ]}
                height={300}
              />
            </ChartCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Profit by Division" subtitle="Stacked annual contribution">
                <StackedBarChart
                  data={revenueData}
                  bars={[
                    { key: 'Home Services', label: 'Home Services', color: DIVISION_COLORS.homeServices },
                    { key: 'Solar', label: 'Solar Ops', color: DIVISION_COLORS.solar },
                    { key: 'Real Estate', label: 'Real Estate', color: DIVISION_COLORS.realEstate },
                    { key: 'Aerial', label: 'Aerial', color: DIVISION_COLORS.aerialInsights },
                  ]}
                  height={280}
                />
              </ChartCard>
              <ChartCard title="Year 5 Profit Mix" explanationKey="divisionMix">
                <DonutChart
                  data={[
                    { name: 'Home Services', value: y5.portfolio.homeServicesProfit, color: DIVISION_COLORS.homeServices },
                    { name: 'Solar Ops', value: y5.portfolio.solarOperationsProfit, color: DIVISION_COLORS.solar },
                    { name: 'Real Estate', value: y5.portfolio.realEstateProfit, color: DIVISION_COLORS.realEstate },
                    { name: 'Aerial', value: y5.portfolio.aerialProfit, color: DIVISION_COLORS.aerialInsights },
                  ]}
                  height={280}
                  centerLabel="Y5 Profit"
                  centerValue={formatCurrency(y5.portfolio.totalProfit)}
                />
              </ChartCard>
            </div>

            {/* Year-by-Year Assumptions Reference */}
            <YearByYearReference assumptions={assumptions} years={years} />
          </div>
        </div>
      </div>
    </PageShell>
  )
}

// ─── 20-YEAR SREC BREAKDOWN ────────────────────────────────────────────────

function SRECBreakdown({ longTermSREC }: { longTermSREC: import('../data/investorPortal/formulas/types').LongTermSRECSummary }) {
  const { axisStyle, tooltipStyle, gridStyle } = useChartTheme()
  const totalInstalls = longTermSREC.cohorts.reduce((s, c) => s + c.installCount, 0)

  // Build table rows with running cumulative
  let cumulativeInstalls = 0
  const tableRows = longTermSREC.cohorts.map((cohort) => {
    cumulativeInstalls += cohort.installCount
    return {
      year: cohort.buildYear,
      newInstalls: cohort.installCount,
      cumulative: cumulativeInstalls,
      annualSREC: cohort.annualSRECRevenue,
      lifetimeValue: cohort.annualSRECRevenue * cohort.srecLifespan,
    }
  })

  // Chart data: bars for installs, line for cumulative annual SREC
  const chartData = longTermSREC.cohorts.map((cohort, i) => {
    const cumulativeAnnualSREC = longTermSREC.cohorts
      .slice(0, i + 1)
      .reduce((s, c) => s + c.annualSRECRevenue, 0)
    return {
      name: `Year ${cohort.buildYear}`,
      'New Installs': cohort.installCount,
      'Cumulative Annual SREC': cumulativeAnnualSREC,
    }
  })

  if (longTermSREC.cohorts.length === 0) return null

  const firstCohort = longTermSREC.cohorts[0]

  return (
    <div className="luxury-card p-6 border border-surface-border/60">
      {/* Header */}
      <div className="rounded-xl p-5 mb-5" style={{ background: 'linear-gradient(135deg, #78620a, #a17f1a)', border: '1px solid rgba(201, 168, 76, 0.4)' }}>
        <p className="text-amber-100 text-xs uppercase tracking-[0.15em] font-semibold mb-1">
          20-Year SREC Revenue Breakdown
        </p>
        <p className="text-amber-200/70 text-[11px] leading-relaxed">
          Each solar installation generates contracted Solar Renewable Energy Credits for 20 years.
          The following breakdown shows the install ramp required to support the projected SREC economics.
        </p>
      </div>

      {/* Hero Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <MetricCard
          label="Total 20-Year SREC Value"
          value={longTermSREC.totalPlatformSRECRevenue}
          format="currency"
          compact
          highlighted
        />
        <MetricCard
          label="Investor Share (50%)"
          value={longTermSREC.totalInvestorSRECIncome}
          format="currency"
          compact
          highlighted
        />
        <MetricCard
          label="Total Installs Required"
          value={totalInstalls}
          format="number"
          compact
        />
        <MetricCard
          label="Peak Annual Investor Income"
          value={longTermSREC.peakAnnualInvestorIncome}
          format="currency"
          compact
        />
      </div>

      {/* Year 1-5 Install Breakdown Table */}
      <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-2">
        Year 1–5 Install Distribution
      </p>
      <div className="overflow-x-auto mb-5">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-surface-border/50">
              <th className="py-2 px-3 text-left font-medium text-text-muted">Year</th>
              <th className="py-2 px-3 text-right font-medium text-text-muted">New Installs</th>
              <th className="py-2 px-3 text-right font-medium text-text-muted">Cumulative</th>
              <th className="py-2 px-3 text-right font-medium text-text-muted">Annual SREC Revenue</th>
              <th className="py-2 px-3 text-right font-medium text-text-muted">20-Year Cohort Value</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row) => (
              <tr key={row.year} className="border-b border-surface-border/20">
                <td className="py-2 px-3 text-left text-text-secondary font-medium">Year {row.year}</td>
                <td className="py-2 px-3 text-right text-text-primary">{row.newInstalls.toLocaleString()}</td>
                <td className="py-2 px-3 text-right text-text-primary font-semibold">{row.cumulative.toLocaleString()}</td>
                <td className="py-2 px-3 text-right text-accent-gold">{formatCurrency(row.annualSREC)}</td>
                <td className="py-2 px-3 text-right text-text-primary">{formatCurrency(row.lifetimeValue)}</td>
              </tr>
            ))}
            <tr className="border-t border-accent-gold/30">
              <td className="py-2 px-3 text-left text-accent-gold font-semibold">Total</td>
              <td className="py-2 px-3 text-right text-accent-gold font-semibold">{totalInstalls.toLocaleString()}</td>
              <td className="py-2 px-3 text-right text-text-muted">—</td>
              <td className="py-2 px-3 text-right text-accent-gold font-semibold">
                {formatCurrency(tableRows.reduce((s, r) => s + r.annualSREC, 0))}
              </td>
              <td className="py-2 px-3 text-right text-accent-gold font-semibold">
                {formatCurrency(tableRows.reduce((s, r) => s + r.lifetimeValue, 0))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Stepped Bar + Line Chart */}
      <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-2">
        Install Ramp & SREC Accumulation
      </p>
      <div className="rounded-lg bg-surface/50 p-3">
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
            <CartesianGrid {...gridStyle} />
            <XAxis dataKey="name" {...axisStyle} />
            <YAxis
              yAxisId="left"
              {...axisStyle}
              tickFormatter={(v: number) => v.toLocaleString()}
              label={{ value: 'Installs', angle: -90, position: 'insideLeft', style: { fill: axisStyle.fill, fontSize: 10 } }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              {...axisStyle}
              tickFormatter={(v: number) => `$${(v / 1_000_000).toFixed(1)}M`}
              label={{ value: 'Annual SREC', angle: 90, position: 'insideRight', style: { fill: axisStyle.fill, fontSize: 10 } }}
            />
            <Tooltip
              {...tooltipStyle}
              formatter={(value: number, name: string) =>
                name === 'New Installs'
                  ? [value.toLocaleString(), name]
                  : [formatCurrency(value), name]
              }
            />
            <RechartsBar yAxisId="left" dataKey="New Installs" fill="#c9a84c" radius={[4, 4, 0, 0]} barSize={48} />
            <RechartsLine
              yAxisId="right"
              type="monotone"
              dataKey="Cumulative Annual SREC"
              stroke="#f59e0b"
              strokeWidth={2.5}
              dot={{ fill: '#f59e0b', r: 5, stroke: '#78620a', strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <p className="text-text-dim text-[10px] italic mt-4">
        Each install cohort generates SRECs for 20 years at {firstCohort.srecsPerInstall} credits/install/year
        {' '}× {formatCurrency(firstCohort.srecValuePerCredit, false)}/credit.
        Investor retains 50% equity in all SREC economics originated during the 5-year deployment period.
      </p>
    </div>
  )
}

// ─── YEAR-BY-YEAR REFERENCE (read-only transparency section) ───────────────

function YearByYearReference({ assumptions, years }: { assumptions: AllAssumptions; years: YearlyOutputs[] }) {
  const [open, setOpen] = useState(false)
  const ds = assumptions.distributedSolar
  const dm = assumptions.directMailGrowth

  const tables: { title: string; headers: string[]; rows: (string | number)[][] }[] = [
    {
      title: 'Sales Growth Multipliers',
      headers: ['Channel', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5'],
      rows: [
        ['D2D Reps', '1.0x', '1.3x', '1.7x', '2.2x', '2.8x'],
        ['Direct Mail', '1.0x', '1.3x', '1.6x', '2.0x', '2.5x'],
        ['Commercial', '1.0x', '1.4x', '1.9x', '2.5x', '3.2x'],
        ['Grants PPC', '1.0x', '1.3x', '1.7x', '2.2x', '2.8x'],
      ],
    },
    {
      title: 'Solar Monthly Marketing Spend',
      headers: ['', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5'],
      rows: [
        ['Spend/Mo', formatCurrency(ds.monthlySpendY1, false), formatCurrency(ds.monthlySpendY2, false), formatCurrency(ds.monthlySpendY3, false), formatCurrency(ds.monthlySpendY4, false), formatCurrency(ds.monthlySpendY5, false)],
        ['Installs/Yr', ...years.map((y) => y.realEstate.distributedSolar.newInstalls.toLocaleString())],
        ['Cumulative', ...years.map((y) => y.realEstate.distributedSolar.cumulativeInstalls.toLocaleString())],
      ],
    },
    {
      title: 'Real Estate Development Goals',
      headers: ['Program', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5'],
      rows: [
        ['Homes Built', 0, 10, 25, 40, 60],
        ['Subdivisions', 20, 40, 60, 80, 100],
      ],
    },
    {
      title: 'Land Acquisition Mail Ramp',
      headers: ['', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5'],
      rows: [
        ['Letters/Mo', dm.y1LettersPerMonth.toLocaleString(), dm.y2LettersPerMonth.toLocaleString(), dm.y3LettersPerMonth.toLocaleString(), dm.y4LettersPerMonth.toLocaleString(), dm.y5LettersPerMonth.toLocaleString()],
      ],
    },
  ]

  return (
    <div className="luxury-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-hover/30 transition-colors"
      >
        <div>
          <h3 className="text-text-primary text-sm font-semibold">Year-by-Year Growth Assumptions</h3>
          <p className="text-text-muted text-xs mt-0.5">Reference values driving the 5-year projections</p>
        </div>
        <span className="text-text-muted text-xs font-medium">{open ? '▲ Collapse' : '▼ Expand'}</span>
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-5 border-t border-surface-border/40">
          {tables.map((t) => (
            <div key={t.title}>
              <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider mt-4 mb-2">{t.title}</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-surface-border/50">
                      {t.headers.map((h) => (
                        <th key={h} className={`py-2 px-2 font-medium text-text-muted ${h === t.headers[0] ? 'text-left' : 'text-right'}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {t.rows.map((row, ri) => (
                      <tr key={ri} className="border-b border-surface-border/20">
                        {row.map((cell, ci) => (
                          <td key={ci} className={`py-1.5 px-2 ${ci === 0 ? 'text-left text-text-secondary font-medium' : 'text-right text-text-primary'}`}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
          <p className="text-text-dim text-[10px] italic pt-1">
            Growth multipliers and development goals are fixed model assumptions. Solar spend interpolates linearly between Y1 and Y5 slider values.
          </p>
        </div>
      )}
    </div>
  )
}
