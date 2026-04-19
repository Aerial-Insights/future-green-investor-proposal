import { motion } from 'framer-motion'
import InfoIcon from '../explanation/InfoIcon'
import type { ReactNode } from 'react'

interface ChartCardProps {
  title: string
  subtitle?: string
  explanationKey?: string
  children: ReactNode
  className?: string
}

export default function ChartCard({ title, subtitle, explanationKey, children, className = '' }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`luxury-card ${className}`}
    >
      <div className="flex items-start justify-between gap-2 mb-6">
        <div>
          <h3 className="font-display font-semibold text-text-primary text-lg">{title}</h3>
          {subtitle && <p className="text-text-muted text-sm mt-1">{subtitle}</p>}
        </div>
        {explanationKey && <InfoIcon explanationKey={explanationKey} />}
      </div>
      <div className="w-full">{children}</div>
    </motion.div>
  )
}
