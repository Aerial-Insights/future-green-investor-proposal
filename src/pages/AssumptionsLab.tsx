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
import { useAssumptionsStore } from '../store/useAssumptionsStore'
import { useCalculations, useInvestorReturns, useLongTermSREC } from '../hooks/useCalculations'
import { formatCurrency } from '../utils/formatCurrency'
import { formatPercent } from '../utils/formatPercent'
import { DIVISION_COLORS } from '../theme/chartTheme'

export default function AssumptionsLab() {
  const { assumptions, setAssumption } = useAssumptionsStore()
  const years = useCalculations()
  const y5 = years[4]
  const investorReturns = useInvestorReturns()
  const longTermSREC = useLongTermSREC()
  const returnOnCapital = investorReturns.totalCapital > 0
    ? investorReturns.totalDistributed / investorReturns.totalCapital
    : 0

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
            </AssumptionGroup>

            <AssumptionGroup title="Solar & Real Estate">
              <SliderInput label="Mail Volume/Month" value={assumptions.realEstate.mailVolumePerMonth} min={5000} max={50000} step={1000} onChange={(v) => setAssumption('realEstate', 'mailVolumePerMonth', v)} format={(v) => v.toLocaleString()} />
              <SliderInput label="Response Rate" value={assumptions.realEstate.responseRate} min={0.005} max={0.03} step={0.001} onChange={(v) => setAssumption('realEstate', 'responseRate', v)} format={(v) => formatPercent(v)} />
              <SliderInput label="Close Rate" value={assumptions.realEstate.closeRate} min={0.05} max={0.25} step={0.01} onChange={(v) => setAssumption('realEstate', 'closeRate', v)} format={(v) => formatPercent(v)} />
              <SliderInput label="Assignment Fee" value={assumptions.realEstate.averageAssignmentFee} min={5000} max={30000} step={1000} onChange={(v) => setAssumption('realEstate', 'averageAssignmentFee', v)} format={(v) => formatCurrency(v, false)} />
              <SliderInput label="Annual SREC Rev/Acre" value={assumptions.solarFarm.annualSRECRevenuePerAcre} min={125000} max={167000} step={1000} onChange={(v) => setAssumption('solarFarm', 'annualSRECRevenuePerAcre', v)} format={(v) => formatCurrency(v, false)} />
              <SliderInput label="Upfront SREC Value/Acre" value={assumptions.solarFarm.upfrontSRECValuePerAcre} min={275000} max={327000} step={1000} onChange={(v) => setAssumption('solarFarm', 'upfrontSRECValuePerAcre', v)} format={(v) => formatCurrency(v, false)} />
              <SliderInput label="Build Cost/Unit" value={assumptions.housing.buildCostPerUnit} min={100000} max={400000} step={10000} onChange={(v) => setAssumption('housing', 'buildCostPerUnit', v)} format={(v) => formatCurrency(v, false)} />
              <SliderInput label="Market Value/Unit" value={assumptions.housing.marketValuePerUnit} min={150000} max={500000} step={10000} onChange={(v) => setAssumption('housing', 'marketValuePerUnit', v)} format={(v) => formatCurrency(v, false)} />
            </AssumptionGroup>

            <AssumptionGroup title="Aerial Insights">
              <SliderInput label="Starting Users" value={assumptions.aerial.startingUsers} min={100} max={2000} step={50} onChange={(v) => setAssumption('aerial', 'startingUsers', v)} />
              <SliderInput label="Monthly Growth Rate" value={assumptions.aerial.monthlyGrowthRate} min={0.03} max={0.25} step={0.01} onChange={(v) => setAssumption('aerial', 'monthlyGrowthRate', v)} format={(v) => formatPercent(v)} />
              <SliderInput label="Churn Rate" value={assumptions.aerial.churnRate} min={0.01} max={0.10} step={0.01} onChange={(v) => setAssumption('aerial', 'churnRate', v)} format={(v) => formatPercent(v)} />
              <SliderInput label="Subscription/Mo" value={assumptions.aerial.subscriptionMonthly} min={500} max={2000} step={100} onChange={(v) => setAssumption('aerial', 'subscriptionMonthly', v)} format={(v) => formatCurrency(v, false)} />
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
                <div className="grid grid-cols-2 gap-4">
                  <MetricCard
                    label="Total Distributed"
                    value={investorReturns.totalDistributed}
                    format="currency"
                    style={{ background: 'linear-gradient(135deg, #064e3b, #065f46)', borderColor: '#10b981' }}
                    className="!text-white [&_p]:!text-white [&_p.text-text-secondary]:!text-emerald-200"
                  />
                  <MetricCard
                    label="ROI Multiple"
                    value={returnOnCapital}
                    format="percent"
                    style={{ background: 'linear-gradient(135deg, #065f46, #047857)', borderColor: '#34d399' }}
                    className="!text-white [&_p]:!text-white [&_p.text-text-secondary]:!text-emerald-200"
                  />
                </div>
                <div className="grid grid-cols-5 gap-4">
                  {investorReturns.annualReturns.map((yr, i) => {
                    const blues = [
                      { bg: 'linear-gradient(135deg, #1e3a5f, #1e4976)', border: '#60a5fa' },
                      { bg: 'linear-gradient(135deg, #1e4976, #1a3f6b)', border: '#3b82f6' },
                      { bg: 'linear-gradient(135deg, #1a3f6b, #163560)', border: '#2563eb' },
                      { bg: 'linear-gradient(135deg, #163560, #122b55)', border: '#1d4ed8' },
                      { bg: 'linear-gradient(135deg, #122b55, #0f1f3d)', border: '#1e40af' },
                    ]
                    return (
                      <MetricCard
                        key={yr.year}
                        label={`Year ${yr.year}`}
                        value={yr.totalReturnThisYear}
                        format="currency"
                        compact
                        style={{ background: blues[i].bg, borderColor: blues[i].border }}
                        className="!text-white [&_p]:!text-white [&_p.text-text-secondary]:!text-blue-200"
                      />
                    )
                  })}
                </div>
                <MetricCard
                  label="20-Year SRECs Return (20% Investor Share)"
                  value={longTermSREC.totalInvestorSRECIncome}
                  format="currency"
                  style={{ background: 'linear-gradient(135deg, #78620a, #a17f1a)', borderColor: '#c9a84c' }}
                  className="!text-white [&_p]:!text-white [&_p.text-text-secondary]:!text-amber-200"
                />
              </div>
            </div>

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
              <MetricCard label="Y5 Active Acres" value={y5.realEstate.solarFarm.activeAcres} format="number" explanationKey="activeAcres" compact />
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
          </div>
        </div>
      </div>
    </PageShell>
  )
}
