// RIGHT column — AI / automation tool cards.
// Each card declares which funnel stages it powers; refs feed the connector overlay.

import { forwardRef, useImperativeHandle, useRef } from 'react'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '../../theme/animations'

export interface AutomationItem {
  id: string
  name: string
  tagline: string
  stages: number[]
  group?: 'lead' | 'marketing' | 'closing' // optional grouping label (Landfront)
}

export interface AutomationColumnHandle {
  getToolEl: (id: string) => HTMLElement | null
}

interface AutomationColumnProps {
  title: string
  badge?: string
  items: AutomationItem[]
  accentColor: string
  highlightedTools?: Set<string>
  onToolHover?: (id: string | null) => void
  groupLabels?: Record<string, string>
}

const AutomationColumn = forwardRef<AutomationColumnHandle, AutomationColumnProps>(
  function AutomationColumn(
    { title, badge, items, accentColor, highlightedTools, onToolHover, groupLabels },
    ref,
  ) {
    const toolRefs = useRef<Map<string, HTMLElement>>(new Map())

    useImperativeHandle(
      ref,
      () => ({
        getToolEl: (id: string) => toolRefs.current.get(id) ?? null,
      }),
      [],
    )

    // If groupLabels provided, render grouped sections; else flat list
    const grouped = groupLabels
      ? Object.entries(groupLabels).map(([key, label]) => ({
          key,
          label,
          items: items.filter((it) => it.group === key),
        }))
      : null

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p
            className="text-[10px] uppercase tracking-[0.22em] font-semibold"
            style={{ color: accentColor }}
          >
            {title}
          </p>
          {badge && (
            <span
              className="text-[10px] uppercase tracking-[0.18em] font-bold rounded px-2 py-0.5"
              style={{
                color: accentColor,
                background: `${accentColor}1f`,
                border: `1.5px solid ${accentColor}80`,
              }}
            >
              {badge}
            </span>
          )}
        </div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-3"
        >
          {grouped
            ? grouped.map((g) =>
                g.items.length === 0 ? null : (
                  <div key={g.key} className="space-y-2">
                    <p
                      className="text-[10px] uppercase tracking-[0.2em] font-bold pl-1"
                      style={{ color: accentColor }}
                    >
                      {g.label}
                    </p>
                    <div className="space-y-2">
                      {g.items.map((item) => (
                        <ToolCard
                          key={item.id}
                          item={item}
                          accentColor={accentColor}
                          highlighted={!!highlightedTools?.has(item.id)}
                          onHover={onToolHover}
                          refMap={toolRefs}
                        />
                      ))}
                    </div>
                  </div>
                ),
              )
            : items.map((item) => (
                <motion.div key={item.id} variants={staggerItem}>
                  <ToolCard
                    item={item}
                    accentColor={accentColor}
                    highlighted={!!highlightedTools?.has(item.id)}
                    onHover={onToolHover}
                    refMap={toolRefs}
                  />
                </motion.div>
              ))}
        </motion.div>
      </div>
    )
  },
)

function ToolCard({
  item,
  accentColor,
  highlighted,
  onHover,
  refMap,
}: {
  item: AutomationItem
  accentColor: string
  highlighted: boolean
  onHover?: (id: string | null) => void
  refMap: React.MutableRefObject<Map<string, HTMLElement>>
}) {
  return (
    <motion.div
      ref={(el) => {
        if (el) refMap.current.set(item.id, el)
        else refMap.current.delete(item.id)
      }}
      data-tool={item.id}
      onMouseEnter={() => onHover?.(item.id)}
      onMouseLeave={() => onHover?.(null)}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 24 }}
      className="group rounded-xl p-3 cursor-default transition-all relative overflow-hidden bg-surface-elevated"
      style={{
        border: `1.5px solid ${highlighted ? accentColor : `${accentColor}55`}`,
        boxShadow: highlighted
          ? `0 8px 24px ${accentColor}33, inset 0 0 0 1px ${accentColor}40`
          : `0 1px 3px rgba(0,0,0,0.04)`,
      }}
    >
      <div className="flex items-start justify-between gap-2.5">
        <div className="min-w-0">
          <p className="font-display font-bold text-text-primary text-sm leading-tight">
            {item.name}
          </p>
          <p className="text-text-secondary text-[11px] leading-snug mt-1">{item.tagline}</p>
        </div>
        <div className="shrink-0 flex items-center gap-1">
          {item.stages.map((s) => (
            <span
              key={s}
              className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-display font-bold text-white"
              style={{
                background: accentColor,
                boxShadow: `0 2px 6px ${accentColor}40`,
              }}
              aria-label={`Powers stage ${s}`}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default AutomationColumn
