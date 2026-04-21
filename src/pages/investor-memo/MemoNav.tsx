import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useMemoNavigation } from '../../hooks/useMemoNavigation'
import type { MemoSection } from '../../hooks/useMemoNavigation'

interface MemoNavProps {
  sections: MemoSection[]
}

export default function MemoNav({ sections }: MemoNavProps) {
  const { activeSection, scrollToSection } = useMemoNavigation(sections)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[240px] flex-col bg-surface border-r border-surface-border z-40 overflow-y-auto">
        <div className="px-5 pt-8 pb-4">
          <Link
            to="/"
            className="text-text-muted text-xs uppercase tracking-widest hover:text-accent-gold transition-colors"
          >
            &larr; Back to Portal
          </Link>
          <div className="mt-6 mb-2">
            <p className="text-accent-gold font-display font-semibold text-xs uppercase tracking-[0.15em]">
              Investment Memorandum
            </p>
          </div>
        </div>
        <div className="flex-1 px-3 pb-8">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              className={`
                w-full text-left px-3 py-2 rounded-md text-[13px] transition-all duration-200
                ${
                  activeSection === s.id
                    ? 'text-accent-gold bg-surface-hover font-medium'
                    : 'text-text-muted hover:text-text-secondary hover:bg-surface-hover/50'
                }
              `}
            >
              {s.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-b border-surface-border">
        <div className="flex items-center justify-between px-4 h-14">
          <Link
            to="/"
            className="text-text-muted text-xs uppercase tracking-widest hover:text-accent-gold transition-colors"
          >
            &larr; Portal
          </Link>
          <p className="text-accent-gold font-display text-xs uppercase tracking-[0.12em] font-semibold">
            Memo
          </p>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-text-secondary p-2 hover:text-accent-gold transition-colors"
            aria-label="Toggle navigation"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed top-14 left-0 right-0 z-40 bg-surface/98 backdrop-blur-lg border-b border-surface-border max-h-[70vh] overflow-y-auto"
          >
            <div className="px-4 py-3 space-y-0.5">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    scrollToSection(s.id)
                    setMobileOpen(false)
                  }}
                  className={`
                    w-full text-left px-3 py-2 rounded-md text-sm transition-all
                    ${
                      activeSection === s.id
                        ? 'text-accent-gold bg-surface-hover font-medium'
                        : 'text-text-muted hover:text-text-secondary'
                    }
                  `}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
