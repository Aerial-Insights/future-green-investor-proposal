import { motion } from 'framer-motion'
import { MEMO, SALES_ENGINE_CHANNELS } from '../../../data/investorPortal/memoContent'
import { useCalculations } from '../../../hooks/useCalculations'
import { formatCurrency } from '../../../utils/formatCurrency'
import SectionHeader from '../components/SectionHeader'

export default function SalesEngine() {
  const years = useCalculations()
  const y5 = years[4]

  const channels = [
    { ...SALES_ENGINE_CHANNELS.d2d, profit: y5.homeServices.d2d.totalProfitAnnual, label: 'Door-to-Door' },
    { ...SALES_ENGINE_CHANNELS.directMail, profit: y5.homeServices.directMail.totalProfitAnnual, label: 'Direct Mail' },
    { ...SALES_ENGINE_CHANNELS.commercial, profit: y5.homeServices.commercial.totalProfitAnnual, label: 'Commercial' },
    { ...SALES_ENGINE_CHANNELS.ppc, profit: y5.homeServices.energyGrants.totalProfitAnnual, label: 'PPC / Grants' },
  ]

  return (
    <section id="sales-engine" className="py-24 border-t border-surface-border/60">
      <SectionHeader
        number="V"
        eyebrow="Acquisition"
        title="Four-Channel Acquisition Engine"
        subtitle="Four independent channels, each with discrete unit economics and a distinct strategic role"
      />

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="text-text-secondary leading-[1.8] text-[15px] mb-12"
      >
        {MEMO.salesEngineNarrative}
      </motion.p>

      <div className="grid gap-5 sm:grid-cols-2">
        {channels.map((ch, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="luxury-card p-6 relative overflow-hidden group"
          >
            <div className="absolute -top-4 right-2 text-accent-gold/[0.08] text-[128px] font-display font-bold leading-none pointer-events-none select-none">
              0{i + 1}
            </div>
            <div className="relative">
              <p className="text-accent-gold text-[10px] uppercase tracking-[0.2em] mb-1">{ch.label}</p>
              <h4 className="font-display font-semibold text-text-primary text-lg mb-2">{ch.title}</h4>
              <p className="text-text-muted text-xs leading-[1.6] mb-5">{ch.subtitle}</p>

              <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-5 pb-5 border-b border-surface-border">
                {ch.metrics.map((m) => (
                  <div key={m.label}>
                    <p className="text-text-dim text-[10px] uppercase tracking-wider mb-0.5">{m.label}</p>
                    <p className="text-text-primary font-display font-semibold text-sm">{m.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-text-dim text-[10px] uppercase tracking-[0.15em]">Y5 Annual Profit</span>
                <span className="font-display font-bold text-lg text-accent-gold">{formatCurrency(ch.profit)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
