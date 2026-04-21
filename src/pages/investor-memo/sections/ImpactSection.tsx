import { motion } from 'framer-motion'
import { MEMO, STRATEGIC_IMPACT } from '../../../data/investorPortal/memoContent'
import SectionHeader from '../components/SectionHeader'

export default function ImpactSection() {
  return (
    <section id="impact" className="py-24 border-t border-surface-border/60">
      <SectionHeader
        number="XVI"
        eyebrow="Beyond Returns"
        title="Strategic Impact"
        subtitle="Measurable economic, environmental, and social output — a byproduct of the business model"
      />

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="text-text-secondary leading-[1.8] text-[15px] sm:text-[15.5px] mb-12"
      >
        {MEMO.impactNarrative}
      </motion.p>

      {/* Impact grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {STRATEGIC_IMPACT.impacts.map((impact, i) => (
          <motion.div
            key={impact.title}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            className="luxury-card p-5 hover:shadow-card-hover transition-shadow duration-300"
          >
            <p className="font-display font-bold text-2xl text-accent-gold mb-1">{impact.metric}</p>
            <p className="text-text-primary text-sm font-medium mb-2">{impact.title}</p>
            <p className="text-text-muted text-xs leading-[1.6]">{impact.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
