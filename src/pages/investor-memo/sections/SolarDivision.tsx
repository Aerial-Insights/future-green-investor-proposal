import { MEMO } from '../../../data/investorPortal/memoContent'
import { useCalculations, useLongTermSREC } from '../../../hooks/useCalculations'
import { formatCurrency } from '../../../utils/formatCurrency'
import { formatNumber } from '../../../utils/formatNumber'
import ChartCard from '../../../components/data-display/ChartCard'
import AreaChartComponent from '../../../components/charts/AreaChartComponent'
import SectionHeader from '../components/SectionHeader'
import Prose from '../components/Prose'
import MetricBlock, { MetricGrid } from '../components/MetricBlock'

export default function SolarDivision() {
  const years = useCalculations()
  const srec = useLongTermSREC()
  const y5 = years[4]
  const ds5 = y5.realEstate.distributedSolar

  const srecChartData = srec.annualProjections.slice(0, 20).map((p) => ({
    name: `Y${p.year}`,
    investorSREC: p.investorShare,
  }))

  return (
    <section id="solar" className="py-24 border-t border-surface-border/60">
      <SectionHeader
        number="VII"
        eyebrow="Division 02"
        title="Distributed Solar & SREC Revenue"
        subtitle="A marketing-acquired install base producing stacked twenty-year annuity revenue"
      />

      <Prose paragraphs={MEMO.solarNarrative} className="mb-12" />

      <div className="mb-12">
        <MetricGrid cols={4}>
          <MetricBlock label="Y5 Cumulative Installs" value={formatNumber(ds5.cumulativeInstalls, false)} delay={0} />
          <MetricBlock label="Annual SREC / Install" value={formatCurrency(ds5.grossSrecPerInstall)} delay={0.08} />
          <MetricBlock label="Y5 Net SREC Revenue" value={formatCurrency(ds5.netSrecRevenue)} delay={0.16} />
          <MetricBlock label="20-Yr Investor SREC" value={formatCurrency(srec.totalInvestorSRECIncome)} accent delay={0.24} />
        </MetricGrid>
      </div>

      {/* Cohort visualization */}
      <div className="luxury-card p-6 mb-12 border-l-2 border-[#f59e0b]/40">
        <h4 className="font-display font-semibold text-text-primary text-[15px] mb-3">A stacked-cohort revenue structure</h4>
        <p className="text-text-muted text-sm leading-[1.7] mb-5">
          Each deployment year produces a new cohort of SREC-generating installations. Year 1 installs produce for twenty years. Year 2 installs begin their own twenty-year cycle. By Year 5, all five cohorts are producing simultaneously — and each cohort continues for fifteen to nineteen additional years after the deployment period ends. The revenue profile is a stacked annuity, not a flow.
        </p>
        <div className="grid grid-cols-5 gap-2">
          {years.map((y, i) => (
            <div
              key={y.year}
              className="text-center p-3 rounded-lg bg-surface-hover/40 border border-surface-border/50"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <p className="text-text-dim text-[9px] uppercase tracking-wider mb-1">Y{y.year} Cohort</p>
              <p className="font-display font-bold text-base text-[#f59e0b]">{formatNumber(y.realEstate.distributedSolar.newInstalls, false)}</p>
              <p className="text-[9px] text-text-muted">installs × 20yr</p>
            </div>
          ))}
        </div>
      </div>

      <ChartCard title="Investor SREC Income Curve" subtitle="Annual 50% investor share across all cohorts, twenty-year horizon">
        <AreaChartComponent
          data={srecChartData}
          dataKey="investorSREC"
          label="Investor SREC Income"
          color="#f59e0b"
          height={280}
        />
      </ChartCard>
    </section>
  )
}
