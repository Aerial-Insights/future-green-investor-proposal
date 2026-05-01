import { motion } from 'framer-motion'
import type { FinancialModelOptionKey } from '../../data/investorPortal/baseAssumptions'

interface OptionToggleProps {
  selected: FinancialModelOptionKey
  onChange: (option: FinancialModelOptionKey) => void
}

const OPTIONS: Array<{
  key: FinancialModelOptionKey
  label: string
  badge: string
  subtitle: string
}> = [
  {
    key: 'percentageBack',
    label: 'Percentage Back Option',
    badge: '65% Return',
    subtitle: '5-Year Threshold Model',
  },
  {
    key: 'partnership',
    label: 'Partnership Option',
    badge: 'Long-Term Equity',
    subtitle: '20-Year Permanent Partnership',
  },
]

export default function OptionToggle({ selected, onChange }: OptionToggleProps) {
  return (
    <div className="mb-8">
      <p className="text-accent-gold text-[10px] uppercase tracking-[0.2em] font-semibold mb-3 text-center">
        Investor Return Structure
      </p>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-1 p-1.5 bg-surface-elevated border border-surface-border rounded-2xl max-w-2xl mx-auto">
        {OPTIONS.map((opt) => {
          const isActive = opt.key === selected
          return (
            <button
              key={opt.key}
              onClick={() => onChange(opt.key)}
              className={`relative flex-1 px-5 py-4 rounded-xl text-left transition-colors duration-300 ${
                isActive ? '' : 'hover:bg-surface-hover/40'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="option-toggle-bg"
                  className="absolute inset-0 rounded-xl bg-accent-gold/15 border border-accent-gold/40"
                  transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                />
              )}
              <div className="relative">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span
                    className={`text-sm sm:text-base font-display font-semibold ${
                      isActive ? 'text-accent-gold' : 'text-text-primary'
                    }`}
                  >
                    {opt.label}
                  </span>
                  <span
                    className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                      isActive
                        ? 'bg-accent-gold text-surface-elevated'
                        : 'bg-surface-border/40 text-text-muted'
                    }`}
                  >
                    {opt.badge}
                  </span>
                </div>
                <p
                  className={`text-[11px] ${
                    isActive ? 'text-accent-gold/80' : 'text-text-muted'
                  }`}
                >
                  {opt.subtitle}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
