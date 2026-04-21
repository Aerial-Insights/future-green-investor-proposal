import { motion } from 'framer-motion'
import { pageTransition } from '../../theme/animations'
import type { ReactNode } from 'react'

interface PageShellProps {
  children: ReactNode
  className?: string
  fullWidth?: boolean
}

export default function PageShell({ children, className = '', fullWidth = false }: PageShellProps) {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`min-h-screen pt-20 ${className}`}
    >
      {fullWidth ? (
        children
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {children}
        </div>
      )}
    </motion.div>
  )
}
