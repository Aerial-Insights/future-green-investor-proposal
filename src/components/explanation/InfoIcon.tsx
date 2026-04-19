import { useUIStore } from '../../store/useUIStore'

interface InfoIconProps {
  explanationKey: string
  size?: 'sm' | 'md'
}

export default function InfoIcon({ explanationKey, size = 'sm' }: InfoIconProps) {
  const openExplanation = useUIStore((s) => s.openExplanation)
  const dims = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        openExplanation(explanationKey)
      }}
      className={`${dims} shrink-0 rounded-full border border-surface-border text-text-muted hover:text-accent-gold hover:border-accent-gold transition-colors duration-200 flex items-center justify-center`}
      aria-label={`Learn more about ${explanationKey}`}
    >
      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button>
  )
}
