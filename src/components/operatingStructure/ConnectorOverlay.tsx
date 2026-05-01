// SVG overlay that draws glowing curves from each funnel stage to each AI tool card.
// Uses refs from FunnelPyramid + AutomationColumn and recomputes on resize.

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { FunnelPyramidHandle } from './FunnelPyramid'
import type { AutomationColumnHandle } from './AutomationColumn'

interface Connection {
  toolId: string
  stage: number
}

interface ConnectorOverlayProps {
  containerRef: React.RefObject<HTMLDivElement>
  funnelRef: React.RefObject<FunnelPyramidHandle>
  toolRef: React.RefObject<AutomationColumnHandle>
  connections: Connection[]
  accentColor: string
  highlightedTools?: Set<string>
  highlightedStages?: Set<number>
}

interface PathSpec {
  key: string
  d: string
  highlighted: boolean
}

export default function ConnectorOverlay({
  containerRef,
  funnelRef,
  toolRef,
  connections,
  accentColor,
  highlightedTools,
  highlightedStages,
}: ConnectorOverlayProps) {
  const [paths, setPaths] = useState<PathSpec[]>([])
  const [size, setSize] = useState({ w: 0, h: 0 })
  const rafRef = useRef<number | null>(null)

  const compute = () => {
    if (!containerRef.current || !funnelRef.current || !toolRef.current) return
    const cBox = containerRef.current.getBoundingClientRect()
    const next: PathSpec[] = []

    connections.forEach((conn) => {
      const stageEdge = funnelRef.current!.getStageEdge(conn.stage)
      const tEl = toolRef.current!.getToolEl(conn.toolId)
      if (!stageEdge || !tEl) return
      const tBox = tEl.getBoundingClientRect()

      // Origin: midheight right edge of the actual trapezoid.
      const sx = stageEdge.x - cBox.left
      const sy = stageEdge.y - cBox.top
      // Target: left-edge midpoint of the tool card.
      const tx = tBox.left - cBox.left
      const ty = tBox.top + tBox.height / 2 - cBox.top

      const dx = tx - sx
      const c1x = sx + dx * 0.5
      const c2x = tx - dx * 0.5

      const d = `M ${sx.toFixed(1)} ${sy.toFixed(1)} C ${c1x.toFixed(1)} ${sy.toFixed(1)}, ${c2x.toFixed(1)} ${ty.toFixed(1)}, ${tx.toFixed(1)} ${ty.toFixed(1)}`

      const highlighted =
        !!highlightedTools?.has(conn.toolId) || !!highlightedStages?.has(conn.stage)

      next.push({ key: `${conn.toolId}__${conn.stage}`, d, highlighted })
    })

    setSize({ w: cBox.width, h: cBox.height })
    setPaths(next)
  }

  const schedule = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(compute)
  }

  useLayoutEffect(() => {
    schedule()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connections, highlightedTools, highlightedStages])

  useEffect(() => {
    const ro = new ResizeObserver(schedule)
    if (containerRef.current) ro.observe(containerRef.current)
    window.addEventListener('resize', schedule)
    window.addEventListener('scroll', schedule, true)
    const t = setTimeout(schedule, 60)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', schedule)
      window.removeEventListener('scroll', schedule, true)
      clearTimeout(t)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <svg
      className="pointer-events-none absolute inset-0"
      width={size.w || '100%'}
      height={size.h || '100%'}
      viewBox={`0 0 ${size.w || 1} ${size.h || 1}`}
      aria-hidden
    >
      <defs>
        <linearGradient id={`conn-${accentColor.replace('#', '')}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.6" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0.9" />
        </linearGradient>
      </defs>
      {paths.map((p) => (
        <g key={p.key}>
          {p.highlighted && (
            <path
              d={p.d}
              fill="none"
              stroke={accentColor}
              strokeOpacity="0.5"
              strokeWidth="4"
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 6px ${accentColor})` }}
            />
          )}
          <path
            d={p.d}
            fill="none"
            stroke={`url(#conn-${accentColor.replace('#', '')})`}
            strokeWidth={p.highlighted ? 2 : 1.5}
            strokeLinecap="round"
            strokeOpacity={p.highlighted ? 1 : 0.85}
          />
        </g>
      ))}
    </svg>
  )
}
