import { useState, type FormEvent } from 'react'

interface Props {
  expectedPassword: string
  onUnlock: () => void
}

// Presentation-layer obscurity gate. Anyone with browser dev tools can bypass —
// this is intentional. Threat model: prevent casual investors from accidentally
// editing assumption values, not protect secret data.
export default function PasswordGate({ expectedPassword, onUnlock }: Props) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(false)
    // Tiny artificial delay for UX feel
    window.setTimeout(() => {
      if (value === expectedPassword) {
        onUnlock()
      } else {
        setError(true)
        setSubmitting(false)
      }
    }, 350)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-md mx-auto">
      <input
        type="password"
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          setError(false)
        }}
        placeholder="Enter access code"
        autoFocus
        className={`flex-1 px-4 py-2.5 bg-surface-elevated border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none transition-colors ${
          error ? 'border-red-500/60 focus:border-red-500' : 'border-surface-border focus:border-accent-gold/60'
        }`}
      />
      <button
        type="submit"
        disabled={submitting || value.length === 0}
        className="px-5 py-2.5 bg-accent-gold/15 border border-accent-gold/40 text-accent-gold text-sm font-semibold rounded-lg hover:bg-accent-gold/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        {submitting ? 'Verifying…' : 'Unlock'}
      </button>
      {error && (
        <p className="text-red-400 text-xs sm:absolute sm:mt-12 mt-1">Incorrect access code.</p>
      )}
    </form>
  )
}
