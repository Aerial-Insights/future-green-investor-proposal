import { MEMO } from '../../../data/investorPortal/memoContent'
import { useInvestorReturns, useLongTermSREC, useLatestYear } from '../../../hooks/useCalculations'
import { formatCurrency } from '../../../utils/formatCurrency'
import SectionHeader from '../components/SectionHeader'
import Prose from '../components/Prose'
import MetricBlock, { MetricGrid } from '../components/MetricBlock'

export default function ExecutiveSummary() {
  const returns = useInvestorReturns()
  const srec = useLongTermSREC()
  const y5 = useLatestYear()

  return (
    <section id="executive-summary" className="py-24 border-t border-surface-border/60">
      <SectionHeader
        number="I"
        eyebrow="Opening"
        title="Executive Summary"
        subtitle="A vertically integrated platform structured for compounding, multi-horizon returns"
      />
      <Prose paragraphs={MEMO.executiveSummary} />
      <div className="mt-12">
        <MetricGrid cols={4}>
          <MetricBlock label="Capital Raise" value="$40M" delay={0.0} />
          <MetricBlock label="Return Threshold" value={formatCurrency(returns.thresholdTarget)} accent delay={0.08} />
          <MetricBlock label="Y5 Portfolio Profit" value={formatCurrency(y5.portfolio.totalProfit)} delay={0.16} />
          <MetricBlock label="20-Year SREC Value" value={formatCurrency(srec.totalInvestorSRECIncome)} delay={0.24} />
        </MetricGrid>
      </div>
    </section>
  )
}
