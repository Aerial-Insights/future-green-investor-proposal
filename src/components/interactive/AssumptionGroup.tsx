import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AssumptionGroupProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export default function AssumptionGroup({ title, children, defaultOpen = false }: AssumptionGroupProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border border-surface-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-surface-elevated hover:bg-surface-hover transition-colors"
      >
        <span className="text-text-primary text-sm font-semibold">{title}</span>
        <svg
          className={`w-4 h-4 text-text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-4 space-y-4 bg-surface/50">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
