import { MEMO } from '../../../data/investorPortal/memoContent'
import { useLatestYear } from '../../../hooks/useCalculations'
import { formatCurrency } from '../../../utils/formatCurrency'
import SectionHeader from '../components/SectionHeader'
import Prose, { SectionNote } from '../components/Prose'
import MetricBlock, { MetricGrid } from '../components/MetricBlock'

export default function GrantAdvantage() {
  const y5 = useLatestYear()
  const grants = y5.homeServices.grants

  return (
    <section id="grants" className="py-24 border-t border-surface-border/60">
      <SectionHeader
        number="VI"
        eyebrow="Policy Advantage"
        title="Grant & Rebate Infrastructure"
        subtitle="A policy-backed margin structure embedded directly into customer economics"
      />

      <Prose paragraphs={MEMO.grantNarrative} className="mb-12" />

      <div className="mb-10">
        <MetricGrid cols={4}>
          <MetricBlock label="Lead Eligibility" value="60%" delay={0} />
          <MetricBlock label="Close Rate Uplift" value="+15%" delay={0.08} />
          <MetricBlock label="Y5 Rebate Offset" value={formatCurrency(grants.totalRebateOffset)} delay={0.16} />
          <MetricBlock label="Profit Multiplier" value={`${grants.profitMultiplier.toFixed(1)}x`} accent delay={0.24} />
        </MetricGrid>
      </div>

      <SectionNote accent="green">
        <h4 className="font-display font-semibold text-text-primary text-[15px] mb-2">Structural, not cyclical</h4>
        <p className="text-text-secondary text-sm leading-[1.7]">
          Grant infrastructure is a permanent input to the margin profile. Each grant-eligible lead converts at a higher rate, costs the customer less, and produces a better margin for the platform — an advantage that is policy-backed, multi-administration, and positioned to expand. Energy services are therefore consistently more profitable than traditional home services, by design rather than by timing.
        </p>
      </SectionNote>
    </section>
  )
}
