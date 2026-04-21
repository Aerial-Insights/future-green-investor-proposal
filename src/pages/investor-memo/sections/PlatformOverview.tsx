import { motion } from 'framer-motion'
import { MEMO, OVERVIEW_HOW_IT_WORKS } from '../../../data/investorPortal/memoContent'
import SectionHeader from '../components/SectionHeader'

export default function PlatformOverview() {
  return (
    <section id="platform" className="py-24 border-t border-surface-border/60">
      <SectionHeader
        number="III"
        eyebrow="Architecture"
        title="Integrated Platform Architecture"
        subtitle="Four divisions operating as one system — each engineered to strengthen the others"
      />

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="text-text-secondary leading-[1.8] text-[15px] sm:text-[15.5px] mb-14"
      >
        {MEMO.platformNarrative}
      </motion.p>

      {/* Four engines */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-14">
        {[
          { name: 'Home Services', role: 'Immediate Cash Flow', color: '#c9a84c', hex: 'rgba(201,168,76,0.08)' },
          { name: 'Distributed Solar', role: 'Recurring Revenue', color: '#f59e0b', hex: 'rgba(245,158,11,0.08)' },
          { name: 'Real Estate', role: 'Asset Creation', color: '#2d6a4f', hex: 'rgba(45,106,79,0.12)' },
          { name: 'Aerial Insights', role: 'Intelligence Moat', color: '#6366f1', hex: 'rgba(99,102,241,0.08)' },
        ].map((engine, i) => (
          <motion.div
            key={engine.name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="relative luxury-card p-5 overflow-hidden"
          >
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: engine.color }}
            />
            <div
              className="absolute top-0 left-0 w-full h-full opacity-30"
              style={{
                background: `radial-gradient(circle at top right, ${engine.hex}, transparent 70%)`,
              }}
            />
            <div className="relative">
              <p className="font-display font-semibold text-text-primary text-sm">{engine.name}</p>
              <p className="text-text-muted text-xs mt-1">{engine.role}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mb-4">
        <p className="text-accent-gold text-[10px] uppercase tracking-[0.25em] font-medium mb-2">
          Operating Flow
        </p>
        <h3 className="font-display font-semibold text-xl text-text-primary">The reinforcement loop</h3>
      </div>

      {/* Flow steps */}
      <div className="relative space-y-4">
        {/* Vertical line connector */}
        <div className="absolute left-[19px] top-6 bottom-6 w-px bg-accent-gold/20" />

        {OVERVIEW_HOW_IT_WORKS.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="relative luxury-card p-5 pl-16"
          >
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-surface flex items-center justify-center border border-accent-gold/40 z-10">
              <span className="font-display font-bold text-accent-gold text-xs">{i + 1}</span>
            </div>
            <h4 className="font-display font-semibold text-text-primary text-[15px] mb-1">{step.title}</h4>
            <p className="text-text-muted text-sm leading-[1.7]">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
