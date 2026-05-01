import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import type { RoleDetail } from '../../data/investorPortal/operatingStructure'
import { DIVISIONS } from '../../data/investorPortal/operatingStructure'

interface RoleDrawerProps {
  role: RoleDetail | null
  onClose: () => void
}

export default function RoleDrawer({ role, onClose }: RoleDrawerProps) {
  useEffect(() => {
    if (!role) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [role, onClose])

  return (
    <AnimatePresence>
      {role && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-surface-elevated border-l border-surface-border z-50 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label={`${role.title} role detail`}
          >
            <RoleDrawerContent role={role} onClose={onClose} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function RoleDrawerContent({ role, onClose }: { role: RoleDetail; onClose: () => void }) {
  const division = DIVISIONS[role.divisionId]
  const accent = division.accentColor
  return (
    <div>
      <div
        className="px-6 pt-6 pb-5 border-b border-surface-border relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${accent}14 0%, transparent 70%)`,
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-[3px]"
          style={{ background: `linear-gradient(90deg, ${accent}, ${accent}33)` }}
          aria-hidden
        />
        <div className="flex items-start justify-between gap-3">
          <div>
            <p
              className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-1"
              style={{ color: accent }}
            >
              {division.shortName} · {role.group}
            </p>
            <h2 className="font-display font-bold text-text-primary text-2xl leading-tight">
              {role.title}
            </h2>
            {role.shortNote && (
              <p className="text-text-muted text-xs mt-1">{role.shortNote}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
            aria-label="Close role detail"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <span
            className="inline-flex items-center justify-center min-w-[44px] h-8 px-3 rounded-md font-display text-base font-bold"
            style={{ color: accent, backgroundColor: `${accent}15`, border: `1px solid ${accent}40` }}
          >
            {role.flex ? `+${role.count}` : role.count}
          </span>
          <span className="text-text-secondary text-xs">
            {role.flex ? 'Flexible growth seats' : 'Year-One headcount'}
          </span>
        </div>
      </div>

      <div className="px-6 py-5 space-y-5">
        <Section label="Description">
          <p className="text-text-primary text-sm leading-relaxed">{role.description}</p>
        </Section>

        <Section label="Main Responsibilities">
          <ul className="space-y-2">
            {role.responsibilities.map((r) => (
              <li key={r} className="flex items-start gap-2.5">
                <span
                  className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: accent }}
                  aria-hidden
                />
                <span className="text-text-secondary text-sm leading-relaxed">{r}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section label="Revenue / Operations Impact">
          <p
            className="text-text-primary text-sm leading-relaxed rounded-lg p-3.5 border"
            style={{
              borderColor: `${accent}33`,
              background: `linear-gradient(135deg, ${accent}0d 0%, transparent 100%)`,
            }}
          >
            {role.revenueImpact}
          </p>
        </Section>
      </div>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-text-muted text-[10px] uppercase tracking-[0.2em] font-semibold mb-2">
        {label}
      </p>
      {children}
    </div>
  )
}
