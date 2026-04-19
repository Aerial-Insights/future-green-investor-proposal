import { motion } from 'framer-motion'
import { slideUp } from '../../theme/animations'

interface SectionBannerProps {
  headline: string
  subtitle: string
  accentColor?: string
}

export default function SectionBanner({ headline, subtitle, accentColor }: SectionBannerProps) {
  return (
    <section className="relative py-16 sm:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-elevated/60 to-surface" />
      {accentColor && (
        <div
          className="absolute inset-0 opacity-5"
          style={{ background: `radial-gradient(ellipse at 30% 50%, ${accentColor}, transparent 70%)` }}
        />
      )}

      <div className="relative section-container">
        <motion.div variants={slideUp} initial="initial" animate="animate" className="max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary leading-tight">
            {headline}
          </h1>
          <p className="text-text-secondary text-lg mt-4 leading-relaxed">{subtitle}</p>
        </motion.div>
      </div>
    </section>
  )
}
