import { motion, AnimatePresence } from 'framer-motion'
import { useExplanationDrawer } from '../../hooks/useExplanation'

export default function ExplanationDrawer() {
  const { isOpen, explanation, close } = useExplanationDrawer()

  return (
    <AnimatePresence>
      {isOpen && explanation && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-surface-elevated border-l border-surface-border z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-accent-gold text-xs font-semibold uppercase tracking-wider mb-1">Metric Explanation</p>
                  <h2 className="font-display font-bold text-text-primary text-xl">{explanation.metricName}</h2>
                </div>
                <button
                  onClick={close}
                  className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-2">Definition</h3>
                  <p className="text-text-primary text-sm leading-relaxed">{explanation.definition}</p>
                </div>

                <div>
                  <h3 className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-2">Why It Matters</h3>
                  <p className="text-text-primary text-sm leading-relaxed">{explanation.whyItMatters}</p>
                </div>

                <div>
                  <h3 className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-2">Key Drivers</h3>
                  <ul className="space-y-1">
                    {explanation.inputDrivers.map((driver) => (
                      <li key={driver} className="text-text-secondary text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-gold shrink-0" />
                        {driver}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-2">Formula Logic</h3>
                  <p className="text-text-primary text-sm leading-relaxed bg-surface/50 p-3 rounded-lg border border-surface-border font-mono text-xs">
                    {explanation.formulaLogic}
                  </p>
                </div>

                <div>
                  <h3 className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-2">Scenario Context</h3>
                  <p className="text-text-primary text-sm leading-relaxed">{explanation.scenarioContext}</p>
                </div>

                {explanation.notes && (
                  <div>
                    <h3 className="text-text-secondary text-xs font-semibold uppercase tracking-wider mb-2">Notes</h3>
                    <p className="text-text-muted text-sm leading-relaxed italic">{explanation.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
