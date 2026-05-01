// True inverted-pyramid funnel.
// Each stage is a clip-pathed trapezoid that tapers — not stacked rectangles.
// Stage refs are exposed so an overlay can draw connectors to AI tool cards.

import { forwardRef, useImperativeHandle, useRef } from 'react'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '../../theme/animations'
import type { FunnelDef } from '../../data/investorPortal/operatingStructure'

// Maximum total horizontal narrowing across the whole funnel (each side).
// 0.16 means the bottom stage shrinks 16% from each side vs. the top.
const TAPER = 0.16

export interface FunnelPyramidHandle {
  getStageEl: (stage: number) => HTMLElement | null
  // Midheight right-edge of the actual trapezoid (in viewport coords) — accounts for taper.
  getStageEdge: (stage: number) => { x: number; y: number } | null
}

interface FunnelPyramidProps {
  funnel: FunnelDef
  accentColor: string
  highlightedStages?: Set<number>
  onStageHover?: (stage: number | null) => void
}

const FunnelPyramid = forwardRef<FunnelPyramidHandle, FunnelPyramidProps>(
  function FunnelPyramid({ funnel, accentColor, highlightedStages, onStageHover }, ref) {
    const stageRefs = useRef<Map<number, HTMLElement>>(new Map())
    const total = funnel.stages.length

    useImperativeHandle(
      ref,
      () => ({
        getStageEl: (stage: number) => stageRefs.current.get(stage) ?? null,
        getStageEdge: (stage: number) => {
          const el = stageRefs.current.get(stage)
          if (!el) return null
          const idx = stage - 1
          const topInset = (idx / total) * TAPER
          const bottomInset = ((idx + 1) / total) * TAPER
          const midInset = (topInset + bottomInset) / 2
          const box = el.getBoundingClientRect()
          return {
            x: box.right - box.width * midInset,
            y: box.top + box.height / 2,
          }
        },
      }),
      [total],
    )

    return (
      <motion.ol
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="relative space-y-1.5"
        aria-label="Operating funnel"
      >
        {funnel.stages.map((stage, idx) => {
          const stageNum = idx + 1
          const topInset = (idx / total) * TAPER * 100
          const bottomInset = ((idx + 1) / total) * TAPER * 100
          const isHighlighted = highlightedStages?.has(stageNum)
          const polygon = `polygon(
            ${topInset}% 0%,
            ${100 - topInset}% 0%,
            ${100 - bottomInset}% 100%,
            ${bottomInset}% 100%
          )`

          return (
            <motion.li
              key={stage.label + idx}
              variants={staggerItem}
              ref={(el) => {
                if (el) stageRefs.current.set(stageNum, el)
                else stageRefs.current.delete(stageNum)
              }}
              data-stage={stageNum}
              onMouseEnter={() => onStageHover?.(stageNum)}
              onMouseLeave={() => onStageHover?.(null)}
              onFocus={() => onStageHover?.(stageNum)}
              onBlur={() => onStageHover?.(null)}
              tabIndex={0}
              className="relative outline-none"
              style={{ height: 64 }}
            >
              {/* Tapered surface */}
              <div
                className="absolute inset-0 transition-all duration-300"
                style={{
                  clipPath: polygon,
                  background: isHighlighted
                    ? `linear-gradient(135deg, ${accentColor}40 0%, ${accentColor}1a 100%)`
                    : `linear-gradient(135deg, ${accentColor}26 0%, ${accentColor}0d 100%)`,
                  boxShadow: isHighlighted
                    ? `inset 0 0 0 1.5px ${accentColor}`
                    : `inset 0 0 0 1px ${accentColor}80`,
                }}
                aria-hidden
              />
              {/* Glow ring on highlight */}
              {isHighlighted && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    clipPath: polygon,
                    boxShadow: `inset 0 0 24px ${accentColor}55`,
                  }}
                  aria-hidden
                />
              )}
              {/* Content */}
              <div className="relative h-full flex items-center justify-center px-6 gap-3">
                <span
                  className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full font-display font-bold text-xs text-white"
                  style={{
                    backgroundColor: accentColor,
                    boxShadow: `0 2px 8px ${accentColor}55`,
                  }}
                >
                  {stageNum}
                </span>
                <div className="text-center min-w-0">
                  <p className="font-display font-bold text-text-primary text-sm leading-tight truncate">
                    {stage.label}
                  </p>
                  {stage.sub && (
                    <p
                      className="text-[10px] leading-tight mt-0.5 truncate font-semibold"
                      style={{ color: accentColor }}
                    >
                      {stage.sub}
                    </p>
                  )}
                </div>
              </div>
            </motion.li>
          )
        })}
      </motion.ol>
    )
  },
)

export default FunnelPyramid
