import { motion } from 'framer-motion'
import { PLATFORM_NAME, MEMO } from '../../../data/investorPortal/memoContent'
import { useInvestorReturns, useLatestYear } from '../../../hooks/useCalculations'
import { formatCurrency } from '../../../utils/formatCurrency'

export default function MemoHero() {
  const returns = useInvestorReturns()
  const y5 = useLatestYear()

  const stats = [
    { label: 'Capital Raise', value: '$40M' },
    { label: 'Target Return', value: '65% (1.65x)' },
    { label: 'Year 5 Profit', value: formatCurrency(y5.portfolio.totalProfit) },
    {
      label: 'Threshold Timeline',
      value: returns.monthsToThreshold ? `~${returns.monthsToThreshold} mo` : 'Projected',
    },
  ]

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center py-20 lg:py-24">
      {/* Ornamental corner brackets */}
      <div className="absolute top-6 left-0 lg:top-12 flex items-center gap-3 text-text-muted text-[10px] tracking-[0.3em] uppercase">
        <span className="w-6 h-px bg-accent-gold/40" />
        <span>Private &amp; Confidential</span>
      </div>
      <div className="absolute top-6 right-0 lg:top-12 hidden sm:flex items-center gap-3 text-text-muted text-[10px] tracking-[0.3em] uppercase">
        <span>No. 001 / {MEMO.coverDate.replace(' ', '-')}</span>
        <span className="w-6 h-px bg-accent-gold/40" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="space-y-8"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="flex items-center gap-3"
        >
          <div className="h-px w-10 bg-accent-gold/70" />
          <p className="text-accent-gold text-[11px] uppercase tracking-[0.25em] font-semibold">
            {MEMO.coverSubtitle}
          </p>
        </motion.div>

        {/* Company name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
          className="font-display text-[clamp(2.5rem,7vw,5.5rem)] font-bold text-text-primary leading-[1.02] tracking-[-0.02em]"
        >
          {PLATFORM_NAME}
        </motion.h1>

        {/* Joint venture attribution */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="space-y-3"
        >
          <p className="text-text-muted text-[11px] sm:text-xs uppercase tracking-[0.3em]">A Joint Venture of</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-display text-[clamp(1.25rem,2.6vw,2rem)] font-semibold text-text-primary leading-[1.15] tracking-[-0.01em]">
            <span>Future Green Energy Group</span>
            <span className="text-accent-gold font-light text-[0.9em]">×</span>
            <span>International Petrotech and Investments Inc.</span>
          </div>
        </motion.div>

        {/* Thesis line */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-text-secondary text-lg sm:text-xl max-w-2xl leading-[1.6] font-light"
        >
          {MEMO.coverThesis}
        </motion.p>

        {/* Gold separator */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="origin-left h-px w-32 bg-gradient-to-r from-accent-gold via-accent-gold-light to-transparent"
        />

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.08, duration: 0.5 }}
            >
              <p className="text-text-muted text-[10px] uppercase tracking-[0.15em] mb-2">
                {stat.label}
              </p>
              <p className="font-display font-semibold text-xl sm:text-2xl text-text-primary tracking-tight">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer meta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-10 text-text-muted text-[11px] tracking-[0.12em] uppercase"
        >
          <span>{MEMO.coverDate}</span>
          <span className="text-surface-border">•</span>
          <span>Mid-Atlantic &amp; Southeast US</span>
          <span className="text-surface-border">•</span>
          <span>5-Year Deployment</span>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-0 hidden sm:flex items-center gap-3 text-text-muted text-[10px] tracking-[0.25em] uppercase"
      >
        <div className="relative w-6 h-10 rounded-full border border-accent-gold/40 overflow-hidden">
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-1/2 top-2 -translate-x-1/2 w-1 h-1.5 bg-accent-gold rounded-full"
          />
        </div>
        <span>Scroll to Begin</span>
      </motion.div>
    </section>
  )
}
