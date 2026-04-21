import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SliderInput from './SliderInput'
import { formatWholeNumber } from '../../utils/formatNumber'
import type { SimulationConfig } from '../../data/investorPortal/simulationConfigs'

interface SimulationPanelProps {
  config: SimulationConfig
  baseQuantity: number
  allocation: number
}

export default function SimulationPanel({ config, baseQuantity }: SimulationPanelProps) {
  const [open, setOpen] = useState(false)

  const [sliderValues, setSliderValues] = useState<Record<string, number>>(() => {
    const defaults: Record<string, number> = {}
    for (const s of config.sliders) {
      defaults[s.key] = s.defaultValue
    }
    return defaults
  })

  const outputs = useMemo(
    () => config.calculate(sliderValues, baseQuantity),
    [config, sliderValues, baseQuantity],
  )

  const updateSlider = (key: string, value: number) => {
    setSliderValues((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="mt-3">
      {/* Toggle bar */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg
          bg-gradient-to-r from-accent-gold/[0.06] to-accent-gold/[0.02]
          border border-accent-gold/20 hover:border-accent-gold/35
          transition-all duration-200 group cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-accent-gold opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="text-accent-gold text-xs font-semibold tracking-wide">
            Simulate Outcomes
          </span>
        </div>
        <svg
          className={`w-3.5 h-3.5 text-accent-gold/60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expandable panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-4">
              {/* Starting quantity callout */}
              <div className="flex items-center gap-2 px-1">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-gold/50" />
                <p className="text-text-muted text-[11px]">
                  Starting with{' '}
                  <span className="text-text-primary font-semibold">{formatWholeNumber(baseQuantity)}</span>
                  {' '}{config.startingLabel}
                </p>
              </div>

              {/* Sliders */}
              <div className="space-y-3 bg-surface/50 border border-surface-border rounded-lg p-3.5">
                {config.sliders.map((slider) => (
                  <SliderInput
                    key={slider.key}
                    label={slider.label}
                    value={sliderValues[slider.key]}
                    min={slider.min}
                    max={slider.max}
                    step={slider.step}
                    onChange={(v) => updateSlider(slider.key, v)}
                    format={slider.format}
                  />
                ))}
              </div>

              {/* Output metrics */}
              <div className={`grid gap-2.5 ${
                outputs.length <= 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'
              }`}>
                {outputs.map((metric) => (
                  <div
                    key={metric.label}
                    className={`rounded-lg p-3 ${
                      metric.highlight
                        ? 'bg-gradient-to-br from-accent-gold/[0.08] to-accent-gold/[0.03] border border-accent-gold/25'
                        : 'bg-surface-elevated border border-surface-border'
                    }`}
                  >
                    <p className="text-[10px] font-semibold tracking-wider uppercase text-text-dim mb-1">
                      {metric.label}
                    </p>
                    <p className={`font-display font-bold text-lg leading-tight ${
                      metric.highlight ? 'gold-gradient-text' : 'text-text-primary'
                    }`}>
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
