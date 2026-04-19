import PageShell from '../components/layout/PageShell'
import { motion } from 'framer-motion'
import { slideUp, fadeIn } from '../theme/animations'
import { useCalculations } from '../hooks/useCalculations'
import { formatCurrency } from '../utils/formatCurrency'
import { NEXT_STEP, PLATFORM_NAME } from '../data/investorPortal/content'
import { Link } from 'react-router-dom'

export default function NextStep() {
  const years = useCalculations()
  const y5 = years[4]

  return (
    <PageShell fullWidth>
      {/* Hero closing section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface-elevated/20 to-surface" />
        <div className="absolute inset-0 bg-gradient-radial from-accent-gold/5 via-transparent to-transparent opacity-40" />

        <div className="relative section-container py-20 text-center max-w-4xl mx-auto">
          <motion.p
            variants={slideUp}
            initial="initial"
            animate="animate"
            className="text-accent-gold text-sm font-semibold uppercase tracking-[0.2em] mb-6"
          >
            {NEXT_STEP.capitalAsk}
          </motion.p>

          <motion.h1
            variants={slideUp}
            initial="initial"
            animate="animate"
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary leading-tight mb-6"
          >
            {NEXT_STEP.headline}
          </motion.h1>

          <motion.p
            variants={slideUp}
            initial="initial"
            animate="animate"
            className="text-text-secondary text-lg leading-relaxed max-w-3xl mx-auto mb-10"
          >
            {NEXT_STEP.summary}
          </motion.p>

          <motion.div
            variants={slideUp}
            initial="initial"
            animate="animate"
            className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-12"
          >
            {[
              { label: 'Year 5 Profit', value: formatCurrency(y5.portfolio.totalProfit) },
              { label: 'Capital Raise', value: '$39.98M' },
              { label: 'Divisions', value: '4' },
              { label: 'Y5 Aerial ARR', value: formatCurrency(y5.aerial.totalARR) },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display font-bold text-2xl sm:text-3xl text-accent-gold">{stat.value}</p>
                <p className="text-text-muted text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="section-container py-12 space-y-16">
        {/* Closing narrative */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="luxury-card max-w-3xl mx-auto text-center"
        >
          <div className="w-12 h-1 rounded-full bg-accent-gold mx-auto mb-6" />
          <p className="text-text-secondary text-lg leading-relaxed">
            {NEXT_STEP.closingNarrative}
          </p>
        </motion.div>

        {/* Platform review links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Review the Model', to: '/financial-model', desc: 'Full 5-year projections' },
            { title: 'Adjust Assumptions', to: '/assumptions-lab', desc: 'Test your own scenarios' },
            { title: 'Explore Divisions', to: '/home-services', desc: 'Deep-dive each pillar' },
            { title: 'See the Impact', to: '/strategic-impact', desc: 'Beyond financial returns' },
          ].map((item) => (
            <Link key={item.title} to={item.to} className="luxury-card text-center group hover:shadow-glow">
              <h3 className="font-display font-semibold text-text-primary group-hover:text-accent-gold transition-colors">{item.title}</h3>
              <p className="text-text-muted text-sm mt-1">{item.desc}</p>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center py-12">
          <div className="inline-flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-gold to-accent-gold-dim flex items-center justify-center mb-6">
              <span className="text-surface font-display font-bold text-2xl">U</span>
            </div>
            <h2 className="font-display font-bold text-text-primary text-3xl mb-3">{NEXT_STEP.cta}</h2>
            <p className="text-text-muted text-sm mb-6">
              {PLATFORM_NAME} — Confidential Investment Materials
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-3 bg-accent-gold text-surface font-semibold rounded-lg hover:bg-accent-gold-light transition-colors">
                Contact Us
              </button>
              <Link
                to="/"
                className="px-8 py-3 border border-surface-border text-text-secondary font-medium rounded-lg hover:text-text-primary hover:border-text-muted transition-colors"
              >
                Back to Overview
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
