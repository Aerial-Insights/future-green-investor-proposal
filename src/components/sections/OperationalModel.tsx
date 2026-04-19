import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '../../theme/animations'
import { HOME_SERVICES_OPERATIONAL_MODEL } from '../../data/investorPortal/content'

const sections = [
  HOME_SERVICES_OPERATIONAL_MODEL.salesInfrastructure,
  HOME_SERVICES_OPERATIONAL_MODEL.productionCapacity,
  HOME_SERVICES_OPERATIONAL_MODEL.revenueExpansion,
]

export default function OperationalModel() {
  return (
    <div className="space-y-6">
      <h3 className="font-display font-bold text-text-primary text-xl">Operational Model</h3>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {sections.map((section) => (
          <motion.div key={section.title} variants={staggerItem} className="luxury-card">
            <div className="w-8 h-1 rounded-full bg-accent-gold mb-4" />
            <h4 className="font-display font-semibold text-text-primary mb-3">{section.title}</h4>
            <div className="space-y-2 mb-4">
              {section.items.map((item) => (
                <div key={item.label} className="flex justify-between py-1.5 border-b border-surface-border">
                  <span className="text-text-secondary text-sm">{item.label}</span>
                  <span className="text-text-primary text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
            <p className="text-text-muted text-xs leading-relaxed">{section.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
