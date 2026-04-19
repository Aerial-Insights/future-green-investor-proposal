import { NavLink, useLocation } from 'react-router-dom'
import { useState } from 'react'

const navItems = [
  { path: '/', label: 'Overview' },
  { path: '/home-services', label: 'Home Services' },
  { path: '/solar-real-estate', label: 'Solar & Real Estate' },
  { path: '/aerial-insights', label: 'Aerial Insights' },
  { path: '/financial-model', label: 'Financial Model' },
  { path: '/assumptions-lab', label: 'Assumptions Lab' },
  { path: '/strategic-impact', label: 'Strategic Impact' },
  { path: '/qualifications', label: 'Qualifications' },
  { path: '/next-step', label: 'Next Step' },
]

export default function TopNav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-gold to-accent-gold-dim flex items-center justify-center">
              <span className="text-surface font-display font-bold text-sm">U</span>
            </div>
            <span className="font-display font-semibold text-text-primary text-sm tracking-wide hidden sm:block">
              Unity Capital Group
            </span>
          </NavLink>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'text-accent-gold bg-accent-gold/10'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                  }`
                }
                end={item.path === '/'}
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile hamburger */}
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

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-surface-elevated border-b border-surface-border">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path || (item.path === '/' && location.pathname === '/')
                    ? 'text-accent-gold bg-accent-gold/10'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                }`}
                end={item.path === '/'}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
