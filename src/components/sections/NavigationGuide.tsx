import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '../../theme/animations'
import { OVERVIEW_NAV_GUIDE } from '../../data/investorPortal/content'
import { DIVISION_COLORS } from '../../theme/chartTheme'

const accentColors: Record<string, string> = {
  '/home-services': DIVISION_COLORS.homeServices,
  '/solar-real-estate': DIVISION_COLORS.realEstate,
  '/aerial-insights': DIVISION_COLORS.aerialInsights,
  '/financial-model': '#d4d4d8',
  '/assumptions-lab': '#f59e0b',
  '/strategic-impact': '#a3a3a3',
}

export default function NavigationGuide() {
  return (
    <section>
      <h2 className="font-display font-bold text-text-primary text-2xl mb-8">How to Navigate This Proposal</h2>
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {OVERVIEW_NAV_GUIDE.map((item) => (
          <motion.div key={item.route} variants={staggerItem}>
            <Link
              to={item.route}
              className="luxury-card block h-full transition-all duration-200 hover:border-accent-gold/30 border-l-4"
              style={{ borderLeftColor: accentColors[item.route] || DIVISION_COLORS.homeServices }}
            >
              <h3 className="font-display font-semibold text-text-primary mb-2">{item.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed mb-3">{item.description}</p>
              <p className="text-text-muted text-xs italic">{item.whyItMatters}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
