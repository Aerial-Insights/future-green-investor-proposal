import { MEMO } from '../../../data/investorPortal/memoContent'
import { useLongTermSREC, useAerialResiduals } from '../../../hooks/useCalculations'
import { formatCurrency } from '../../../utils/formatCurrency'
import { formatNumber } from '../../../utils/formatNumber'
import ChartCard from '../../../components/data-display/ChartCard'
import AreaChartComponent from '../../../components/charts/AreaChartComponent'
import SectionHeader from '../components/SectionHeader'
import Prose from '../components/Prose'
import MetricBlock, { MetricGrid } from '../components/MetricBlock'

export default function ResidualIncome() {
  const srec = useLongTermSREC()
  const aerial = useAerialResiduals()

  // 20-year SREC investor income chart
  const srecChartData = srec.annualProjections.slice(0, 24).map((p) => ({
    name: `Y${p.year}`,
    investorSREC: p.investorShare,
  }))

  // Aerial residual chart (10 years)
  const aerialChartData = aerial.yearlyBreakdown.map((y) => ({
    name: `Y${y.year}`,
    residual: y.investorShare,
  }))

  const exitVal = aerial.exitValuation

  return (
    <section id="residual-income" className="py-24 border-t border-surface-border/60">
      <SectionHeader
        number="XIV"
        eyebrow="Post-Threshold"
        title="Residual Income & Exit Participation"
        subtitle="Permanent positions that continue producing income after capital is returned"
      />
      <Prose paragraphs={MEMO.residualNarrative} className="mb-12" />

        {/* SREC section */}
        <div className="mb-4">
          <p className="text-accent-gold text-[10px] uppercase tracking-[0.25em] font-medium mb-2">SREC Portfolio</p>
          <h3 className="font-display font-semibold text-xl text-text-primary">Twenty-year SREC participation</h3>
        </div>
        <div className="mb-6">
        <MetricGrid cols={4}>
          <MetricBlock label="Total Investor SREC" value={formatCurrency(srec.totalInvestorSRECIncome)} accent delay={0} />
          <MetricBlock label="Peak Annual Income" value={formatCurrency(srec.peakAnnualInvestorIncome)} delay={0.08} />
          <MetricBlock label="Investor Equity" value="50%" delay={0.16} />
          <MetricBlock label="Install Cohorts" value={String(srec.cohorts.length)} delay={0.24} />
        </MetricGrid>
        </div>

        <div className="mb-12">
          <ChartCard title="Investor SREC Income Curve" subtitle="Annual 50% investor share — all cohorts, twenty-year horizon">
            <AreaChartComponent
              data={srecChartData}
              dataKey="investorSREC"
              label="Investor SREC Income"
              color="#f59e0b"
              height={280}
            />
          </ChartCard>
        </div>

        {/* Aerial residual section */}
        <div className="mb-4">
          <p className="text-accent-gold text-[10px] uppercase tracking-[0.25em] font-medium mb-2">SaaS Residual</p>
          <h3 className="font-display font-semibold text-xl text-text-primary">Aerial Insights perpetual residual</h3>
        </div>
        <div className="mb-6">
        <MetricGrid cols={4}>
          <MetricBlock label="10-Year Investor Share" value={formatCurrency(aerial.totalInvestor10Year)} accent delay={0} />
          <MetricBlock label="Peak Annual Residual" value={formatCurrency(aerial.peakAnnualResidual)} delay={0.08} />
          <MetricBlock label="Residual Share" value="3%" delay={0.16} />
          <MetricBlock label="Y5 Active Users" value={formatNumber(aerial.y5ActiveUsers, false)} delay={0.24} />
        </MetricGrid>
        </div>

        <div className="mb-10">
          <ChartCard title="Aerial 3% Residual Curve" subtitle="Investor perpetual residual income, Years 1–10">
            <AreaChartComponent
              data={aerialChartData}
              dataKey="residual"
              label="Investor Residual"
              color="#6366f1"
              height={260}
            />
          </ChartCard>
        </div>

        {/* Exit valuation */}
        <div className="luxury-card p-6 border-l-2 border-accent-blue/40">
          <h4 className="font-display font-semibold text-text-primary text-[15px] mb-3">
            Year {exitVal.exitYear} Exit Scenario — Aerial Insights
          </h4>
          <p className="text-text-muted text-xs mb-5 leading-[1.7]">
            Investor value at a hypothetical Year {exitVal.exitYear} exit, calculated as a 3% equity share of the company's valuation at three ARR-multiple outcomes. Year {exitVal.exitYear} ARR: {formatCurrency(exitVal.arrAtExit)}.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Conservative (4x)', value: exitVal.conservativeInvestorValue },
              { label: 'Base (6x)', value: exitVal.investorExitValue },
              { label: 'Optimistic (8x)', value: exitVal.optimisticInvestorValue },
            ].map((scenario) => (
              <div key={scenario.label} className="text-center p-3 rounded-lg bg-surface-hover/50">
                <p className="text-text-dim text-[10px] uppercase tracking-wider mb-1">{scenario.label}</p>
                <p className="font-display font-bold text-base text-text-primary">{formatCurrency(scenario.value)}</p>
              </div>
            ))}
          </div>
        </div>
    </section>
  )
}
