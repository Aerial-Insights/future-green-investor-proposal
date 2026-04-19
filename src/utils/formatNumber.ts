export function formatNumber(value: number, compact = true): string {
  if (compact) {
    if (Math.abs(value) >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`
    }
    if (Math.abs(value) >= 1_000) {
      return `${(value / 1_000).toFixed(1)}K`
    }
    return value.toFixed(0)
  }
  return value.toLocaleString('en-US')
}

export function formatWholeNumber(value: number): string {
  return Math.round(value).toLocaleString('en-US')
}
