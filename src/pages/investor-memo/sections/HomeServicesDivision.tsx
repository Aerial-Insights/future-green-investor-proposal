import { motion } from 'framer-motion'
import { MEMO, HOME_SERVICES } from '../../../data/investorPortal/memoContent'
import { useCalculations } from '../../../hooks/useCalculations'
import { formatCurrency } from '../../../utils/formatCurrency'
import SectionHeader from '../components/SectionHeader'
import Prose, { SectionNote } from '../components/Prose'
import MetricBlock, { MetricGrid } from '../components/MetricBlock'

export default function HomeServicesDivision() {
  const years = useCalculations()
  const y1 = years[0]
  const y5 = years[4]

  return (
    <section id="home-services" className="py-24 border-t border-surface-border/60">
      <SectionHeader
        number="IV"
        eyebrow="Division 01"
        title="The Cash Flow Engine"
        subtitle="Seven service lines, four acquisition channels, and the platform's primary source of near-term cash generation"
      />

      <Prose paragraphs={MEMO.homeServicesNarrative} className="mb-12" />

      <div className="mb-12">
        <MetricGrid cols={4}>
          <MetricBlock label="Y1 Annual Profit" value={formatCurrency(y1.homeServices.totalProfitAnnual)} delay={0.0} />
          <MetricBlock label="Y5 Annual Profit" value={formatCurrency(y5.homeServices.totalProfitAnnual)} accent delay={0.08} />
          <MetricBlock label="Service Lines" value="7" delay={0.16} />
          <MetricBlock label="Sales Channels" value="4" delay={0.24} />
        </MetricGrid>
      </div>

      <div className="mb-4">
        <p className="text-accent-gold text-[10px] uppercase tracking-[0.25em] font-medium mb-2">
          Service Economics
        </p>
        <h3 className="font-display font-semibold text-xl text-text-primary">Per-service unit economics</h3>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-12">
        {HOME_SERVICES.services.map((svc, i) => (
          <motion.div
            key={svc.name}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="luxury-card p-5 hover:border-accent-gold/30 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-display font-semibold text-text-primary text-sm">{svc.name}</h4>
              {svc.grantEligible && (
                <span className="text-[9px] uppercase tracking-[0.15em] text-accent-green-light bg-accent-green/10 px-2 py-0.5 rounded">
                  Grant
                </span>
              )}
            </div>
            <div className="flex gap-5 text-xs mb-3">
              <div>
                <p className="text-text-dim text-[10px] uppercase tracking-wider">Avg Revenue</p>
                <p className="text-accent-gold font-display font-semibold">{formatCurrency(svc.avgRevenue)}</p>
              </div>
              <div>
                <p className="text-text-dim text-[10px] uppercase tracking-wider">Cycle</p>
                <p className="text-text-primary font-medium">{svc.cycleTime}</p>
              </div>
            </div>
            <p className="text-text-muted text-xs leading-[1.6]">{svc.description}</p>
          </motion.div>
        ))}
      </div>

      <SectionNote>
        <h4 className="font-display font-semibold text-text-primary text-[15px] mb-2">Customer Expansion Engine</h4>
        <p className="text-text-secondary text-sm leading-[1.7]">{MEMO.customerExpansionNarrative}</p>
      </SectionNote>
    </section>
  )
}
