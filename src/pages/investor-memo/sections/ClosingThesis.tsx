import { motion } from 'framer-motion'
import { MEMO, PLATFORM_NAME } from '../../../data/investorPortal/memoContent'
import { useInvestorReturns, useLongTermSREC, useLatestYear } from '../../../hooks/useCalculations'
import { formatCurrency } from '../../../utils/formatCurrency'
import SectionHeader from '../components/SectionHeader'
import Prose from '../components/Prose'
import MetricBlock, { MetricGrid } from '../components/MetricBlock'

export default function ClosingThesis() {
  const returns = useInvestorReturns()
  const srec = useLongTermSREC()
  const y5 = useLatestYear()

  return (
    <section id="closing" className="py-24 border-t border-surface-border/60">
      <SectionHeader
        number="XVII"
        eyebrow="Closing"
        title="Investment Thesis"
        subtitle="A concentrated summary of what this capital funds — and what it returns"
      />

      <Prose paragraphs={MEMO.closingThesis} className="mb-12" />

      {/* Final metrics strip */}
      <div className="mb-12">
        <MetricGrid cols={5}>
          <MetricBlock label="Capital Raise" value="$40M" delay={0} />
          <MetricBlock label="Return Threshold" value={formatCurrency(returns.thresholdTarget)} accent delay={0.08} />
          <MetricBlock label="Y5 Portfolio Profit" value={formatCurrency(y5.portfolio.totalProfit)} delay={0.16} />
          <MetricBlock label="20-Year SREC Value" value={formatCurrency(srec.totalInvestorSRECIncome)} delay={0.24} />
          <MetricBlock label="Integrated Divisions" value="4" delay={0.32} />
        </MetricGrid>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center py-12"
      >
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-accent-gold/40 to-transparent mx-auto mb-8" />
        <p className="text-text-secondary text-sm leading-[1.8] max-w-xl mx-auto mb-10">
          {MEMO.closingCTA}
        </p>
        <p className="font-display font-semibold text-text-primary text-xl tracking-tight">{PLATFORM_NAME}</p>
        <p className="text-text-muted text-[11px] uppercase tracking-[0.2em] mt-2">Confidential Investment Memorandum</p>
      </motion.div>

      {/* Disclaimer */}
      <div className="mt-8 pt-6 border-t border-surface-border/40">
        <p className="text-text-dim text-[10px] leading-[1.8] max-w-2xl">
          {MEMO.coverDisclaimer}
        </p>
      </div>
    </section>
  )
}
