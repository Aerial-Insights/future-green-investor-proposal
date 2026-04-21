export function formatCurrency(value: number, compact = true): string {
  if (compact) {
    if (Math.abs(value) >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(1)}B`
    }
    if (Math.abs(value) >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`
    }
    if (Math.abs(value) >= 1_000) {
      return `$${(value / 1_000).toFixed(0)}K`
    }
    return `$${value.toLocaleString()}`
  }
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export function formatCurrencyExact(value: number): string {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export function formatCurrencyPrecise(value: number): string {
  const abs = Math.abs(value)
  const sign = value < 0 ? '-' : ''

  const formatScaled = (scaledThousands: number, suffix: string) => {
    const whole = Math.floor(scaledThousands / 1000)
    const frac = scaledThousands % 1000
    if (frac === 0) return `${sign}$${whole}${suffix}`
    const fracStr = String(frac).padStart(3, '0').replace(/0+$/, '')
    return `${sign}$${whole}.${fracStr}${suffix}`
  }

  if (abs >= 1_000_000_000) {
    return formatScaled(Math.round(abs / 1_000_000), 'B')
  }
  if (abs >= 1_000_000) {
    return formatScaled(Math.round(abs / 1_000), 'M')
  }
  if (abs >= 1_000) {
    return formatScaled(abs, 'K')
  }
  return `${sign}$${abs.toLocaleString()}`
}
