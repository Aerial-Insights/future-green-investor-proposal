import { motion } from 'framer-motion'

interface SectionHeaderProps {
  number: string
  eyebrow: string
  title: string
  subtitle?: string
}

export default function SectionHeader({ number, eyebrow, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="flex items-baseline gap-4 mb-6"
      >
        <span className="font-display text-accent-gold/60 text-sm tracking-[0.2em]">
          {number}
        </span>
        <span className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-accent-gold/40 to-transparent" />
        <p className="text-accent-gold text-[10px] uppercase tracking-[0.25em] font-medium">
          {eyebrow}
        </p>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-bold text-text-primary leading-[1.1] tracking-tight"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-text-muted text-base mt-3 max-w-3xl"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
