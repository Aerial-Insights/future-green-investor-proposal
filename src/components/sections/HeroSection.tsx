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
  featuredCta?: { label: string; caption?: string; to: string }
}

export default function HeroSection({
  title,
  subtitle,
  thesis,
  stats,
  primaryCta,
  secondaryCta,
  tertiaryCta,
  featuredCta,
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
          backgroundImage: `linear-gradient(var(--color-grid-pattern) 1px, transparent 1px), linear-gradient(90deg, var(--color-grid-pattern) 1px, transparent 1px)`,
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

          {featuredCta && (
            <motion.div
              variants={slideUp}
              initial="initial"
              animate="animate"
              className="mt-6 max-w-2xl"
            >
              <Link
                to={featuredCta.to}
                className="group relative flex items-center justify-between gap-4 w-full px-7 py-5 rounded-xl overflow-hidden bg-gradient-to-r from-accent-gold via-accent-gold-light to-accent-gold text-surface shadow-glow hover:shadow-glow-strong transition-all duration-300 hover:scale-[1.01]"
                style={{ backgroundSize: '200% 100%', backgroundPosition: '0% 50%' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundPosition = '100% 50%' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundPosition = '0% 50%' }}
              >
                {/* Shimmer */}
                <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)',
                    transform: 'translateX(-100%)',
                    animation: 'none',
                  }}
                />

                <div className="relative flex items-center gap-4 min-w-0">
                  {/* Document icon */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-surface/15 border border-surface/20 flex items-center justify-center backdrop-blur-sm">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="8" y1="13" x2="16" y2="13" />
                      <line x1="8" y1="17" x2="13" y2="17" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.25em] font-semibold opacity-70 mb-0.5">
                      {featuredCta.caption ?? 'Confidential Document'}
                    </p>
                    <p className="font-display font-bold text-base sm:text-lg tracking-tight truncate">
                      {featuredCta.label}
                    </p>
                  </div>
                </div>

                <div className="relative flex items-center gap-2 flex-shrink-0">
                  <span className="hidden sm:inline text-[11px] uppercase tracking-[0.2em] font-semibold opacity-80">
                    Open
                  </span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
