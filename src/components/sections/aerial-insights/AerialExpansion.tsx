import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '../../../theme/animations'

const phases = [
  {
    phase: 'Phase 1',
    timeline: 'Year 1',
    title: 'Market Entry',
    description: '500 users across Mid-Atlantic roofing contractors. Establish product-market fit, refine AI scoring models with real-world deployment data, and validate unit economics at scale.',
    accent: '#6366f1',
  },
  {
    phase: 'Phase 2',
    timeline: 'Years 2–3',
    title: 'Vertical & Geographic Expansion',
    description: '2,500 users. Expand into solar installers, HVAC companies, and property investors. Enter adjacent geographic markets. Larger datasets accelerate model accuracy and strengthen the intelligence moat.',
    accent: '#c9a84c',
  },
  {
    phase: 'Phase 3',
    timeline: 'Years 4–5',
    title: 'National Scale',
    description: '10,000–25,000 users. National expansion with enterprise accounts, API access, and white-label partnerships. The accumulated dataset becomes an industry-defining competitive advantage.',
    accent: '#2d6a4f',
  },
]

export default function AerialExpansion() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display font-bold text-text-primary text-2xl mb-2">Market Expansion Roadmap</h2>
        <p className="text-text-secondary text-sm max-w-2xl">
          A disciplined three-phase strategy — more users, more markets, better AI, larger datasets.
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="relative"
      >
        {/* Timeline connector */}
        <div className="absolute left-[19px] top-8 bottom-8 w-px bg-surface-border hidden lg:block" />

        <div className="space-y-6">
          {phases.map((item, i) => (
            <motion.div key={item.phase} variants={staggerItem} className="relative flex gap-6">
              {/* Timeline dot */}
              <div className="hidden lg:flex flex-col items-center pt-6 shrink-0">
                <div
                  className="w-10 h-10 rounded-full border-2 flex items-center justify-center z-10"
                  style={{ borderColor: item.accent, backgroundColor: `${item.accent}15` }}
                >
                  <span className="text-xs font-display font-bold" style={{ color: item.accent }}>{i + 1}</span>
                </div>
              </div>

              {/* Card */}
              <div className="luxury-card flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: `${item.accent}15`, color: item.accent }}
                  >
                    {item.phase}
                  </span>
                  <span className="text-text-muted text-xs font-medium">{item.timeline}</span>
                </div>
                <h3 className="font-display font-semibold text-text-primary text-lg mb-2">{item.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
