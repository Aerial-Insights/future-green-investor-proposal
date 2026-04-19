import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '../../../theme/animations'
import { AERIAL_INSIGHTS } from '../../../data/investorPortal/content'

export default function AerialWorkflow() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display font-bold text-text-primary text-2xl mb-2">Platform Workflow</h2>
        <p className="text-text-secondary text-sm max-w-2xl">
          A 9-stage intelligence pipeline that transforms raw imagery into actionable, scored property leads — fully automated, scalable, and precise.
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {AERIAL_INSIGHTS.workflow.map((step) => (
          <motion.div key={step.step} variants={staggerItem} className="luxury-card group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#6366f1]/15 flex items-center justify-center shrink-0">
                <span className="text-sm font-display font-bold text-[#6366f1]">{step.step}</span>
              </div>
              <h3 className="font-display font-semibold text-text-primary text-base leading-tight">{step.title}</h3>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">{step.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
