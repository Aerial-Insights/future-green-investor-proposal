import { motion } from 'framer-motion'
import { slideUp } from '../../theme/animations'
import { OVERVIEW_PLATFORM_SUMMARY } from '../../data/investorPortal/content'

export default function StrategicSummary() {
  return (
    <section>
      <h2 className="font-display font-bold text-text-primary text-2xl mb-6">Platform Overview</h2>
      <motion.div
        variants={slideUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="luxury-card"
      >
        <div className="w-12 h-1 rounded-full bg-accent-gold mb-6" />
        <div className="space-y-4">
          {OVERVIEW_PLATFORM_SUMMARY.map((paragraph, i) => (
            <p key={i} className="text-text-secondary text-sm leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
