// Theme colors are now defined as CSS custom properties in index.css.
// This file provides a helper to read current theme values at runtime,
// and keeps the static palette for contexts that need hardcoded values
// (e.g. division-specific branding colors that don't change per theme).

export function getThemeColor(varName: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
}

// Static division branding colors (theme-independent)
export const divisionColors = {
  homeServices: '#c9a84c',
  solar: '#f59e0b',
  realEstate: '#2d6a4f',
  aerialInsights: '#6366f1',
}

// Legacy export for any remaining consumers
export const colors = {
  surface: {
    base: '#0a0a0a',
    elevated: '#141414',
    hover: '#1a1a1a',
    border: '#262626',
    light: '#2a2a2a',
  },
  accent: {
    gold: '#c9a84c',
    goldLight: '#e2c97e',
    goldDim: '#8a7235',
    green: '#2d6a4f',
    greenLight: '#40916c',
    platinum: '#d4d4d8',
    blue: '#6366f1',
  },
  text: {
    primary: '#fafafa',
    secondary: '#a3a3a3',
    muted: '#737373',
    dim: '#525252',
  },
}
