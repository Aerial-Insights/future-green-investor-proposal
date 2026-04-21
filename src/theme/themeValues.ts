export const THEME_VARS: Record<string, string> = {
  '--color-surface': '243 248 244',        // soft green-white bg
  '--color-surface-elevated': '255 255 255', // white cards
  '--color-surface-hover': '232 242 234',  // subtle green hover
  '--color-surface-border': '200 220 206', // soft green border
  '--color-surface-light': '210 228 216',  // light green accent surface
  '--color-accent-gold': '74 124 89',      // deep forest green primary
  '--color-accent-gold-light': '123 174 127', // sage green
  '--color-accent-gold-dim': '52 100 68',  // darker forest
  '--color-accent-green': '45 106 79',
  '--color-accent-green-light': '64 145 108',
  '--color-accent-platinum': '107 158 181', // steel blue accent
  '--color-accent-blue': '107 158 181',
  '--color-text-primary': '22 38 28',      // very dark forest text
  '--color-text-secondary': '72 100 82',   // muted green text
  '--color-text-muted': '120 148 130',     // lighter muted
  '--color-text-dim': '175 195 182',       // dim green
  '--shadow-card': '0 2px 12px rgba(0, 0, 0, 0.06)',
  '--shadow-card-hover': '0 6px 20px rgba(0, 0, 0, 0.1)',
  '--shadow-glow': '0 0 20px rgba(74, 124, 89, 0.08)',
  '--shadow-glow-strong': '0 0 40px rgba(74, 124, 89, 0.12)',
  '--color-chart-axis-stroke': '#c8dccf',
  '--color-chart-axis-fill': '#486452',
  '--color-chart-tooltip-bg': '#ffffff',
  '--color-chart-tooltip-border': '#c8dcce',
  '--color-chart-grid': '#e4f0e8',
  '--color-scheme': 'light',
  '--color-slider-fill': '#4a7c59',
  '--color-slider-track': '#c8dcce',
  '--color-grid-pattern': 'rgba(74, 124, 89, 0.12)',
  '--color-logo-text': '#ffffff',
}

/** Apply theme by setting every CSS variable directly as inline styles on <html> */
export function applyThemeToDOM() {
  const el = document.documentElement
  for (const [prop, value] of Object.entries(THEME_VARS)) {
    el.style.setProperty(prop, value)
  }
}
