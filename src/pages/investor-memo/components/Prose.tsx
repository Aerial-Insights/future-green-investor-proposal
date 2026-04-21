import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface ProseProps {
  paragraphs: string[]
  className?: string
}

export default function Prose({ paragraphs, className = '' }: ProseProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
      className={`space-y-5 ${className}`}
    >
      {paragraphs.map((para, i) => (
        <p key={i} className="text-text-secondary leading-[1.8] text-[15px] sm:text-[15.5px]">
          {para}
        </p>
      ))}
    </motion.div>
  )
}

export function SectionNote({ children, accent = 'gold' }: { children: ReactNode; accent?: 'gold' | 'green' | 'blue' }) {
  const accentClass = {
    gold: 'border-accent-gold/40',
    green: 'border-accent-green/40',
    blue: 'border-accent-blue/40',
  }[accent]
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className={`luxury-card p-6 border-l-2 ${accentClass}`}
    >
      {children}
    </motion.div>
  )
}
