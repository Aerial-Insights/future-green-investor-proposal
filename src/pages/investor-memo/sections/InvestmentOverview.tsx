import { motion } from 'framer-motion'
import { MEMO, OVERVIEW } from '../../../data/investorPortal/memoContent'
import SectionHeader from '../components/SectionHeader'
import Prose from '../components/Prose'

export default function InvestmentOverview() {
  return (
    <section id="investment-overview" className="py-24 border-t border-surface-border/60">
      <SectionHeader
        number="II"
        eyebrow="Structure"
        title="Investment Overview"
        subtitle="A single integrated platform, deployed across overlapping return timelines"
      />
      <Prose paragraphs={MEMO.investmentOverview} className="mb-14" />

      <div className="mb-6">
        <p className="text-accent-gold text-[10px] uppercase tracking-[0.25em] font-medium mb-2">
          Core Competitive Advantages
        </p>
        <h3 className="font-display font-semibold text-xl text-text-primary">Why the structure compounds</h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {OVERVIEW.whyThisWins.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="luxury-card p-6 border-l border-accent-gold/30 hover:border-accent-gold/60 transition-all duration-300 group"
          >
            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-display text-accent-gold/40 text-xs">0{i + 1}</span>
              <h4 className="font-display font-semibold text-text-primary text-[15px] group-hover:text-accent-gold transition-colors">
                {item.title}
              </h4>
            </div>
            <p className="text-text-muted text-sm leading-[1.7] pl-7">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
