import { motion } from 'framer-motion'

interface MetricBlockProps {
  label: string
  value: string
  accent?: boolean
  delay?: number
}

export default function MetricBlock({ label, value, accent = false, delay = 0 }: MetricBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay }}
      className="luxury-card p-5 hover:shadow-card-hover transition-shadow duration-300"
    >
      <p className="text-text-muted text-[10px] uppercase tracking-[0.15em] mb-2">{label}</p>
      <p className={`font-display font-bold text-xl sm:text-[22px] tracking-tight ${accent ? 'text-accent-gold' : 'text-text-primary'}`}>
        {value}
      </p>
    </motion.div>
  )
}

export function MetricGrid({ children, cols = 4 }: { children: React.ReactNode; cols?: 2 | 3 | 4 | 5 }) {
  const colsClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5',
  }[cols]
  return <div className={`grid ${colsClass} gap-4`}>{children}</div>
}
