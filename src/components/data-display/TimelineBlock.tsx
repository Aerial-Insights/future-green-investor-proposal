import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '../../theme/animations'

interface Phase {
  label: string
  title: string
  description: string
  highlight?: string
}

interface TimelineBlockProps {
  phases: Phase[]
}

export default function TimelineBlock({ phases }: TimelineBlockProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="relative"
    >
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-surface-border" />

      <div className="space-y-8">
        {phases.map((phase, i) => (
          <motion.div key={i} variants={staggerItem} className="relative pl-12">
            {/* Dot */}
            <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-accent-gold border-2 border-surface" />

            <div className="luxury-card">
              <span className="text-accent-gold text-xs font-semibold uppercase tracking-wider">{phase.label}</span>
              <h4 className="font-display font-semibold text-text-primary mt-1">{phase.title}</h4>
              <p className="text-text-secondary text-sm mt-2">{phase.description}</p>
              {phase.highlight && (
                <p className="text-accent-gold-light text-sm font-medium mt-2">{phase.highlight}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
