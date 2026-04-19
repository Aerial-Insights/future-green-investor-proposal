import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fadeIn, slideUp } from '../../theme/animations'

interface HeroSectionProps {
  title: string
  subtitle: string
  thesis: string
  stats?: { label: string; value: string }[]
  primaryCta?: { label: string; to: string }
  secondaryCta?: { label: string; to: string }
  tertiaryCta?: { label: string; to: string }
}

export default function HeroSection({
  title,
  subtitle,
  thesis,
  stats,
  primaryCta,
  secondaryCta,
  tertiaryCta,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface-elevated/30 to-surface" />
      <div className="absolute inset-0 bg-gradient-radial from-accent-gold/5 via-transparent to-transparent opacity-60" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(201,168,76,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative section-container w-full py-20">
        <motion.div variants={fadeIn} initial="initial" animate="animate" className="max-w-4xl">
          <motion.p
            variants={slideUp}
            initial="initial"
            animate="animate"
            className="text-accent-gold text-sm font-semibold uppercase tracking-[0.2em] mb-6"
          >
            {subtitle}
          </motion.p>

          <motion.h1
            variants={slideUp}
            initial="initial"
            animate="animate"
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary leading-tight mb-6"
          >
            {title}
          </motion.h1>

          <motion.p
            variants={slideUp}
            initial="initial"
            animate="animate"
            className="text-text-secondary text-lg sm:text-xl leading-relaxed max-w-3xl mb-8"
          >
            {thesis}
          </motion.p>

          {stats && (
            <motion.div
              variants={slideUp}
              initial="initial"
              animate="animate"
              className="flex flex-wrap gap-6 sm:gap-10 mb-10"
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-display font-bold text-2xl sm:text-3xl text-accent-gold">{stat.value}</p>
                  <p className="text-text-muted text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          )}

          <motion.div variants={slideUp} initial="initial" animate="animate" className="flex flex-wrap gap-4">
            {primaryCta && (
              <Link
                to={primaryCta.to}
                className="px-6 py-3 bg-accent-gold text-surface font-semibold rounded-lg hover:bg-accent-gold-light transition-colors duration-200"
              >
                {primaryCta.label}
              </Link>
            )}
            {secondaryCta && (
              <Link
                to={secondaryCta.to}
                className="px-6 py-3 border border-accent-gold/40 text-accent-gold font-semibold rounded-lg hover:bg-accent-gold/10 transition-colors duration-200"
              >
                {secondaryCta.label}
              </Link>
            )}
            {tertiaryCta && (
              <Link
                to={tertiaryCta.to}
                className="px-6 py-3 border border-surface-border text-text-secondary font-medium rounded-lg hover:text-text-primary hover:border-text-muted transition-colors duration-200"
              >
                {tertiaryCta.label}
              </Link>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
