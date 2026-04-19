interface NumberInputProps {
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  onChange: (value: number) => void
  prefix?: string
  suffix?: string
}

export default function NumberInput({ label, value, min, max, step = 1, onChange, prefix, suffix }: NumberInputProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-text-secondary text-xs font-medium block">{label}</label>
      <div className="flex items-center gap-1 bg-surface rounded-lg border border-surface-border px-3 py-2 focus-within:border-accent-gold/50 transition-colors">
        {prefix && <span className="text-text-muted text-sm">{prefix}</span>}
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="bg-transparent text-text-primary text-sm font-display w-full outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        {suffix && <span className="text-text-muted text-sm">{suffix}</span>}
      </div>
    </div>
  )
}
