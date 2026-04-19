export const CHART_COLORS = {
  primary: '#c9a84c',
  secondary: '#2d6a4f',
  tertiary: '#d4d4d8',
  quaternary: '#6366f1',
  quinary: '#f59e0b',
  senary: '#40916c',
}

export const CHART_COLOR_ARRAY = [
  '#c9a84c',
  '#2d6a4f',
  '#d4d4d8',
  '#6366f1',
  '#f59e0b',
  '#40916c',
  '#e2c97e',
  '#8a7235',
]

export const DIVISION_COLORS = {
  homeServices: '#c9a84c',
  solar: '#f59e0b',
  realEstate: '#2d6a4f',
  aerialInsights: '#6366f1',
}

export const AXIS_STYLE = {
  stroke: '#404040',
  fontSize: 12,
  fill: '#a3a3a3',
  fontFamily: 'Inter, system-ui, sans-serif',
}

export const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #262626',
    borderRadius: 8,
    color: '#fafafa',
    fontSize: 13,
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  cursor: { stroke: '#c9a84c', strokeWidth: 1, strokeDasharray: '4 4' },
}

export const GRID_STYLE = {
  strokeDasharray: '3 3',
  stroke: '#262626',
}

export const CHART_ANIMATION = {
  duration: 600,
  easing: 'ease-out' as const,
}
