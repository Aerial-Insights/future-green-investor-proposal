import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '../../theme/animations'

const divisions = [
  {
    name: 'Aerial Insights',
    role: 'Intelligence Layer',
    color: '#6366f1',
    description: 'AI-powered property intelligence and lead generation',
    position: 'top',
  },
  {
    name: 'Home Services',
    role: 'Cash Flow Engine',
    color: '#c9a84c',
    description: 'Immediate revenue through direct-to-consumer services',
    position: 'left',
  },
  {
    name: 'Solar Operations',
    role: 'Energy Revenue',
    color: '#f59e0b',
    description: 'Residential & commercial solar installations',
    position: 'right',
  },
  {
    name: 'Real Estate',
    role: 'Asset Engine',
    color: '#2d6a4f',
    description: 'Land acquisition, development, and long-term assets',
    position: 'bottom',
  },
]

export default function PlatformArchitecture() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="luxury-card p-8 sm:p-12"
    >
      <h3 className="font-display font-bold text-text-primary text-xl mb-2 text-center">Platform Architecture</h3>
      <p className="text-text-muted text-sm text-center mb-10">How each division reinforces the others</p>

      <div className="relative max-w-2xl mx-auto">
        {/* Center node */}
        <div className="flex justify-center mb-8">
          <motion.div variants={staggerItem} className="relative">
            <div
              className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border-2 flex flex-col items-center justify-center text-center p-4"
              style={{ borderColor: '#6366f1', background: 'rgba(99, 102, 241, 0.08)' }}
            >
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#6366f1' }}>Intelligence Layer</p>
              <p className="font-display font-bold text-text-primary text-lg mt-1">Aerial Insights</p>
              <p className="text-text-muted text-xs mt-1">AI Property Intelligence</p>
            </div>
            {/* Downward connectors */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-px h-8 bg-surface-border" />
          </motion.div>
        </div>

        {/* Three pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {divisions.slice(1).map((div) => (
            <motion.div
              key={div.name}
              variants={staggerItem}
              className="relative rounded-xl border p-5 text-center"
              style={{ borderColor: div.color + '40', background: div.color + '08' }}
            >
              <div className="w-3 h-3 rounded-full mx-auto mb-3" style={{ backgroundColor: div.color }} />
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: div.color }}>{div.role}</p>
              <p className="font-display font-semibold text-text-primary mt-1">{div.name}</p>
              <p className="text-text-muted text-xs mt-2">{div.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Connection labels */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {[
            'Leads flow from Aerial → Services',
            'Customers cross-sell into Solar',
            'Acquisitions route through Real Estate',
            'Data loops back to improve AI',
          ].map((label) => (
            <span key={label} className="text-text-dim text-xs px-3 py-1.5 rounded-full border border-surface-border bg-surface-elevated">
              {label}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
