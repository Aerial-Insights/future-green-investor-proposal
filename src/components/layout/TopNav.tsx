import { NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import NavDropdown from './NavDropdown'
import { NAV_GROUPS, isNavGroup, type NavGroup } from '../../data/investorPortal/navigation'

export default function TopNav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const location = useLocation()

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
    setOpenGroup(null)
  }, [location.pathname])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 shrink-0">
            <img src="/images/logo.png" alt="Future Green Energy Group × International Petrotech and Investments Inc." className="w-[60px] h-[60px] object-contain rounded-lg" />
            <div className="font-display hidden sm:flex flex-col leading-tight">
              <span className="text-[13px] font-semibold text-text-primary tracking-[0.08em] uppercase">Future Green Energy Group</span>
              <span className="flex items-center gap-1.5 mt-1">
                <span className="text-accent-gold text-[11px] font-light leading-none">×</span>
                <span className="text-[11px] text-text-secondary tracking-[0.04em]">International Petrotech and Investments Inc.</span>
              </span>
            </div>
          </NavLink>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_GROUPS.map((entry) => {
              if (isNavGroup(entry)) {
                return <NavDropdown key={entry.label} label={entry.label} items={entry.items} />
              }
              return (
                <NavLink
                  key={entry.path}
                  to={entry.path}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? 'text-accent-gold bg-accent-gold/10'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                    }`
                  }
                  end={entry.path === '/'}
                >
                  {entry.label}
                </NavLink>
              )
            })}
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
              aria-label="Toggle navigation"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="lg:hidden bg-surface-elevated border-b border-surface-border overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_GROUPS.map((entry) => {
                if (isNavGroup(entry)) {
                  return (
                    <MobileGroup
                      key={entry.label}
                      group={entry}
                      isOpen={openGroup === entry.label}
                      onToggle={() => setOpenGroup(openGroup === entry.label ? null : entry.label)}
                      activePath={location.pathname}
                    />
                  )
                }
                return (
                  <NavLink
                    key={entry.path}
                    to={entry.path}
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === entry.path
                        ? 'text-accent-gold bg-accent-gold/10'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                    }`}
                    end={entry.path === '/'}
                  >
                    {entry.label}
                  </NavLink>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

function MobileGroup({
  group,
  isOpen,
  onToggle,
  activePath,
}: {
  group: NavGroup
  isOpen: boolean
  onToggle: () => void
  activePath: string
}) {
  const isGroupActive = group.items.some((i) => i.path === activePath)
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isGroupActive
            ? 'text-accent-gold bg-accent-gold/10'
            : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
        }`}
        aria-expanded={isOpen}
      >
        <span>{group.label}</span>
        <svg
          className="w-4 h-4 transition-transform duration-200"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="pl-4 mt-1 mb-1 space-y-1 border-l border-surface-border ml-3">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-accent-gold bg-accent-gold/10'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
