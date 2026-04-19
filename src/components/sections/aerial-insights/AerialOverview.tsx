import { motion } from 'framer-motion'
import { staggerContainer, staggerItem, fadeIn } from '../../../theme/animations'
import { AERIAL_INSIGHTS } from '../../../data/investorPortal/content'
import { useCalculations } from '../../../hooks/useCalculations'
import { formatCurrency } from '../../../utils/formatCurrency'

export default function AerialOverview() {
  const years = useCalculations()
  const y5 = years[4]

  return (
    <div className="space-y-12">
      {/* ── HERO BLOCK ─────────────────────────────────────────────────── */}
      <motion.div
        variants={fadeIn}
        initial="initial"
        animate="animate"
        className="relative overflow-hidden rounded-2xl border border-surface-border"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/10 via-surface-elevated to-surface" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.12),transparent_60%)]" />
        <div className="relative px-8 py-14 sm:px-12 sm:py-20 max-w-3xl">
          <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-text-primary leading-tight mb-4">
            {AERIAL_INSIGHTS.heroHeadline}
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary leading-relaxed">
            {AERIAL_INSIGHTS.heroSubheading}
          </p>
        </div>
      </motion.div>

      {/* ── CORE EXPLANATION ───────────────────────────────────────────── */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-4"
      >
        <motion.h2 variants={staggerItem} className="font-display font-bold text-text-primary text-2xl">
          What Is Aerial Insights?
        </motion.h2>
        {AERIAL_INSIGHTS.coreExplanation.map((paragraph, i) => (
          <motion.p
            key={i}
            variants={staggerItem}
            className="text-text-secondary text-sm sm:text-base leading-relaxed max-w-3xl"
          >
            {paragraph}
          </motion.p>
        ))}
      </motion.div>

      {/* ── COMPETITIVE COMPARISON ─────────────────────────────────────── */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-6"
      >
        <motion.h2 variants={staggerItem} className="font-display font-bold text-text-primary text-2xl">
          Competitive Advantage
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional Model */}
          <motion.div variants={staggerItem} className="luxury-card border-l-2 border-l-text-dim">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-text-dim" />
              <h3 className="font-display font-semibold text-text-muted text-lg">Traditional Model</h3>
            </div>
            <div className="space-y-3">
              {AERIAL_INSIGHTS.traditionalModel.map((item) => (
                <div key={item.label}>
                  <div className="text-text-primary text-sm font-medium">{item.label}</div>
                  <div className="text-text-muted text-xs mt-0.5">{item.detail}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Aerial Insights Model */}
          <motion.div variants={staggerItem} className="luxury-card border-l-2 border-l-[#6366f1]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#6366f1]" />
              <h3 className="font-display font-semibold text-[#6366f1] text-lg">Aerial Insights</h3>
            </div>
            <div className="space-y-3">
              {AERIAL_INSIGHTS.aerialModel.map((item) => (
                <div key={item.label}>
                  <div className="text-text-primary text-sm font-medium">{item.label}</div>
                  <div className="text-text-muted text-xs mt-0.5">{item.detail}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ── COST ADVANTAGE ─────────────────────────────────────────────── */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-6"
      >
        <motion.h2 variants={staggerItem} className="font-display font-bold text-text-primary text-2xl">
          Cost Advantage
        </motion.h2>

        <motion.div variants={staggerItem} className="luxury-card">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-6">
            <div>
              <div className="text-text-muted text-xs font-medium uppercase tracking-wider mb-1">Traditional Cost Per Lead</div>
              <div className="font-display font-bold text-2xl text-text-primary">{AERIAL_INSIGHTS.costAdvantage.traditionalRange}</div>
              <div className="text-text-muted text-xs mt-1">Industry average across paid channels</div>
            </div>
            <div>
              <div className="text-text-muted text-xs font-medium uppercase tracking-wider mb-1">Our Acquisition Cost</div>
              <div className="font-display font-bold text-2xl text-[#6366f1]">{AERIAL_INSIGHTS.costAdvantage.aerialCost}</div>
              <div className="text-text-muted text-xs mt-1">Average cost per lead via proprietary AI</div>
            </div>
            <div>
              <div className="text-text-muted text-xs font-medium uppercase tracking-wider mb-1">Lead Sale Price</div>
              <div className="font-display font-bold text-2xl text-accent-gold">{AERIAL_INSIGHTS.costAdvantage.sellRange}</div>
              <div className="text-text-muted text-xs mt-1">Per lead, based on lead score</div>
            </div>
          </div>

          <div className="border-t border-surface-border pt-5">
            <div className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-3">What This Enables</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {AERIAL_INSIGHTS.costAdvantage.benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-gold mt-1.5 shrink-0" />
                  <span className="text-text-secondary text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── STRATEGIC VALUE ────────────────────────────────────────────── */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-6"
      >
        <motion.h2 variants={staggerItem} className="font-display font-bold text-text-primary text-2xl">
          Strategic Value
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {AERIAL_INSIGHTS.strategicValue.map((block) => (
            <motion.div key={block.title} variants={staggerItem} className="luxury-card">
              <div className="w-8 h-1 rounded-full bg-[#6366f1] mb-4" />
              <h3 className="font-display font-semibold text-text-primary text-base mb-2">{block.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{block.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div variants={staggerItem} className="luxury-card bg-[#6366f1]/5 border-[#6366f1]/20">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="text-text-muted text-xs font-medium uppercase tracking-wider mb-1">Projected Y5 Platform ARR</div>
              <div className="font-display font-bold text-2xl text-accent-gold">{formatCurrency(y5.aerial.totalARR)}</div>
            </div>
            <div className="flex-1">
              <div className="text-text-muted text-xs font-medium uppercase tracking-wider mb-1">Y5 Active Users</div>
              <div className="font-display font-bold text-2xl text-text-primary">{y5.aerial.activeUsers.toLocaleString()}</div>
            </div>
            <div className="flex-1">
              <div className="text-text-muted text-xs font-medium uppercase tracking-wider mb-1">Monthly Subscription</div>
              <div className="font-display font-bold text-2xl text-text-primary">$1,200</div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
