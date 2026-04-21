import { motion } from 'framer-motion'

interface Props {
  selectedYear: number
  onSelect: (yearIndex: number) => void
}

export default function YearSelector({ selectedYear, onSelect }: Props) {
  return (
    <div className="flex items-center gap-2">
      {[0, 1, 2, 3, 4].map((i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={`relative px-4 py-2 rounded-lg text-sm font-display font-semibold transition-all duration-200 ${
            selectedYear === i
              ? 'text-accent-gold'
              : 'text-text-muted hover:text-text-secondary hover:bg-surface-hover'
          }`}
        >
          {selectedYear === i && (
            <motion.div
              layoutId="year-selector-pill"
              className="absolute inset-0 rounded-lg border border-accent-gold/40 bg-accent-gold/10"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span className="relative z-10">Year {i + 1}</span>
        </button>
      ))}
    </div>
  )
}
