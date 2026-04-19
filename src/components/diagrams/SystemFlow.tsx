import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '../../theme/animations'
import { OVERVIEW_HOW_IT_WORKS } from '../../data/investorPortal/content'

export default function SystemFlow() {
  return (
    <section>
      <h2 className="font-display font-bold text-text-primary text-2xl mb-8">How It Works</h2>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0"
      >
        {OVERVIEW_HOW_IT_WORKS.map((step, i) => (
          <motion.div key={step.title} variants={staggerItem} className="relative flex flex-col items-center">
            {/* Connector arrow (hidden on first item and mobile) */}
            {i > 0 && (
              <>
                {/* Desktop horizontal connector */}
                <div className="hidden lg:block absolute left-0 top-8 -translate-x-1/2 w-full">
                  <div className="h-px bg-surface-border w-full" />
                  <div className="absolute right-[calc(50%-4px)] -top-[3px] w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-surface-border" />
                </div>
                {/* Mobile / tablet vertical connector */}
                <div className="lg:hidden w-px h-6 bg-surface-border mb-2" />
              </>
            )}
            <div className="luxury-card w-full text-center px-5 py-6">
              <div className="w-10 h-10 rounded-full bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center mx-auto mb-4">
                <span className="font-display font-bold text-accent-gold text-sm">{i + 1}</span>
              </div>
              <h3 className="font-display font-semibold text-text-primary text-sm mb-2">{step.title}</h3>
              <p className="text-text-secondary text-xs leading-relaxed">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
