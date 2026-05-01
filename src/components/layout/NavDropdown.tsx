import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import type { NavLeaf } from '../../data/investorPortal/navigation'

interface NavDropdownProps {
  label: string
  items: NavLeaf[]
}

export default function NavDropdown({ label, items }: NavDropdownProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const closeTimerRef = useRef<number | null>(null)
  const location = useLocation()

  const isGroupActive = items.some((item) => location.pathname === item.path)

  // Close on route change
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  const cancelClose = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  const scheduleClose = () => {
    cancelClose()
    closeTimerRef.current = window.setTimeout(() => setOpen(false), 120)
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => {
        cancelClose()
        setOpen(true)
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap inline-flex items-center gap-1.5 ${
          isGroupActive || open
            ? 'text-accent-gold bg-accent-gold/10'
            : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
        }`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {label}
        <svg
          className="w-3 h-3 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 top-full mt-2 min-w-[220px] rounded-xl border border-surface-border bg-surface-elevated/95 backdrop-blur-xl shadow-card-hover py-1.5 z-50"
            role="menu"
          >
            {items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `block px-3.5 py-2 mx-1 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-accent-gold bg-accent-gold/10'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                  }`
                }
                end={item.path === '/'}
                role="menuitem"
              >
                {item.label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
