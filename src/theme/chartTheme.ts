import { useMemo } from 'react'

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

function getCSSVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

export function useChartTheme() {
  return useMemo(() => {
    const axisStroke = getCSSVar('--color-chart-axis-stroke')
    const axisFill = getCSSVar('--color-chart-axis-fill')
    const tooltipBg = getCSSVar('--color-chart-tooltip-bg')
    const tooltipBorder = getCSSVar('--color-chart-tooltip-border')
    const gridStroke = getCSSVar('--color-chart-grid')
    const textPrimary = getCSSVar('--color-text-primary')
    const textSecondary = getCSSVar('--color-text-secondary')

    return {
      axisStyle: {
        stroke: axisStroke,
        fontSize: 12,
        fill: axisFill,
        fontFamily: 'Inter, system-ui, sans-serif',
      },
      tooltipStyle: {
        contentStyle: {
          backgroundColor: tooltipBg,
          border: `1px solid ${tooltipBorder}`,
          borderRadius: 8,
          color: textPrimary,
          fontSize: 13,
          fontFamily: 'Inter, system-ui, sans-serif',
        },
        cursor: { stroke: getCSSVar('--color-accent-gold'), strokeWidth: 1, strokeDasharray: '4 4' },
      },
      gridStyle: {
        strokeDasharray: '3 3',
        stroke: gridStroke,
      },
      legendStyle: {
        fontSize: 12,
        color: textSecondary,
      },
      textPrimary,
      textSecondary,
    }
  }, [])
}

// Keep legacy exports for backward compatibility during migration
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
