import { useUIStore } from '../../store/useUIStore'

const divisions = [
  { key: 'all', label: 'All Divisions' },
  { key: 'homeServices', label: 'Home Services' },
  { key: 'solar', label: 'Solar' },
  { key: 'realEstate', label: 'Real Estate' },
  { key: 'aerial', label: 'Aerial Insights' },
]

export default function DivisionFilter() {
  const { activeDivisionFilter, setDivisionFilter } = useUIStore()

  return (
    <div className="flex flex-wrap gap-2">
      {divisions.map((div) => (
        <button
          key={div.key}
          onClick={() => setDivisionFilter(div.key)}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
            activeDivisionFilter === div.key
              ? 'bg-accent-gold/15 text-accent-gold border border-accent-gold/40'
              : 'bg-surface-elevated border border-surface-border text-text-secondary hover:text-text-primary hover:border-surface-light'
          }`}
        >
          {div.label}
        </button>
      ))}
    </div>
  )
}
