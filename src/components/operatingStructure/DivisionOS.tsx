// 3-column operating system view for one division.
// LEFT: team boxes · CENTER: tapered funnel · RIGHT: AI tool stack with connectors.
// Home Services adds a Service toggle (Roofing flips funnel + reveals SupoTrack).
// Aerial Insights appends a Data → Annotation → KB → Model feedback loop.

import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import TeamColumn from './TeamColumn'
import FunnelPyramid, { type FunnelPyramidHandle } from './FunnelPyramid'
import AutomationColumn, {
  type AutomationColumnHandle,
  type AutomationItem,
} from './AutomationColumn'
import ConnectorOverlay from './ConnectorOverlay'
import {
  AERIAL_FEEDBACK_LOOP,
  AERIAL_TOOLS,
  AI_FUNNEL,
  DIVISIONS,
  DIVISION_ACCENTS_ON_DARK,
  HS_FUNNEL_ROOFING,
  HS_FUNNEL_STANDARD,
  HS_SERVICES,
  HS_TOOLS,
  LANDFRONT_FEATURES,
  RE_FUNNEL,
  type DivisionId,
  type HsServiceId,
  type RoleDetail,
} from '../../data/investorPortal/operatingStructure'

interface DivisionOSProps {
  divisionId: DivisionId
  onSelectRole: (role: RoleDetail) => void
}

export default function DivisionOS({ divisionId, onSelectRole }: DivisionOSProps) {
  const division = DIVISIONS[divisionId]
  const [service, setService] = useState<HsServiceId>('roofing')
  const [hoveredStage, setHoveredStage] = useState<number | null>(null)
  const [hoveredTool, setHoveredTool] = useState<string | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const funnelRef = useRef<FunnelPyramidHandle>(null)
  const toolRef = useRef<AutomationColumnHandle>(null)

  // Resolve funnel + tools per division
  const funnel =
    divisionId === 'homeServices'
      ? service === 'roofing'
        ? HS_FUNNEL_ROOFING
        : HS_FUNNEL_STANDARD
      : divisionId === 'realEstate'
      ? RE_FUNNEL
      : AI_FUNNEL

  const tools: AutomationItem[] = useMemo(() => {
    if (divisionId === 'homeServices') {
      return HS_TOOLS.filter((t) => !t.serviceFilter || t.serviceFilter.includes(service)).map(
        (t) => ({
          id: t.id,
          name: t.name,
          tagline: t.tagline,
          stages: t.stagesByFunnel[funnel.id] ?? [],
        }),
      )
    }
    if (divisionId === 'realEstate') {
      return LANDFRONT_FEATURES.map((f) => ({
        id: f.id,
        name: f.name,
        tagline: f.tagline,
        stages: f.stages,
        group: f.group,
      }))
    }
    return AERIAL_TOOLS.map((t) => ({
      id: t.id,
      name: t.name,
      tagline: t.tagline,
      stages: t.stagesByFunnel[funnel.id] ?? [],
    }))
  }, [divisionId, service, funnel.id])

  const connections = useMemo(
    () => tools.flatMap((t) => t.stages.map((s) => ({ toolId: t.id, stage: s }))),
    [tools],
  )

  // Highlight set: hovering a stage lights connected tools, hovering a tool lights its stages
  const highlightedTools = useMemo(() => {
    const set = new Set<string>()
    if (hoveredTool) set.add(hoveredTool)
    if (hoveredStage != null) {
      tools.forEach((t) => {
        if (t.stages.includes(hoveredStage)) set.add(t.id)
      })
    }
    return set
  }, [hoveredTool, hoveredStage, tools])

  const highlightedStages = useMemo(() => {
    const set = new Set<number>()
    if (hoveredStage != null) set.add(hoveredStage)
    if (hoveredTool) {
      const tool = tools.find((t) => t.id === hoveredTool)
      tool?.stages.forEach((s) => set.add(s))
    }
    return set
  }, [hoveredStage, hoveredTool, tools])

  // Use the base (deep) accent for text/icons/borders. The panel background is
  // theme-aware (surface-elevated → light in light mode, dark in dark mode), so
  // theme text tokens carry contrast and the deep accent reads on either bg.
  const accent = division.accentColor
  const baseAccent = division.accentColor
  // Suppress unused-import warning while we keep the symbol available.
  void DIVISION_ACCENTS_ON_DARK

  const automationTitle =
    divisionId === 'homeServices'
      ? 'AI Automation Layer'
      : divisionId === 'realEstate'
      ? 'Landfront — AI Engine'
      : 'Sub-App Ecosystem'

  const automationBadge =
    divisionId === 'realEstate'
      ? 'Deal Automation Engine'
      : divisionId === 'aerialInsights'
      ? 'Annotation → Model Loop'
      : 'Connected to every stage'

  const groupLabels =
    divisionId === 'realEstate'
      ? { lead: 'Lead Stage', marketing: 'Marketing Stage', closing: 'Closing Stage' }
      : undefined

  return (
    <section
      className="relative rounded-3xl overflow-hidden bg-surface-elevated"
      style={{
        border: `1px solid ${accent}55`,
        boxShadow: `0 0 0 1px ${accent}1a inset, 0 24px 60px rgba(0,0,0,0.18)`,
      }}
    >
      {/* Subtle accent wash — keeps the panel distinct from the page without
          drowning text/icons in dark gray. */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background: `linear-gradient(135deg, ${baseAccent}10 0%, transparent 60%)`,
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{ background: `linear-gradient(90deg, ${accent}, ${accent}33)` }}
        aria-hidden
      />
      <div
        className="absolute -top-32 -right-32 w-72 h-72 rounded-full opacity-25 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${accent}66, transparent 70%)` }}
        aria-hidden
      />

      {/* Header */}
      <div className="relative px-5 sm:px-7 lg:px-8 pt-6 pb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p
            className="text-[10px] uppercase tracking-[0.22em] font-semibold mb-1.5"
            style={{ color: accent }}
          >
            {division.engineLabel}
          </p>
          <h2 className="font-display font-bold text-text-primary text-2xl sm:text-3xl leading-tight">
            {division.title}
          </h2>
          <p className="text-text-secondary text-sm mt-1.5 max-w-xl leading-snug">
            {division.tagline}
          </p>
        </div>
        {divisionId === 'homeServices' && (
          <ServiceTabs accentColor={accent} active={service} onChange={setService} />
        )}
      </div>

      {/* 3-column grid */}
      <div
        ref={containerRef}
        className="relative px-5 sm:px-7 lg:px-8 pb-8 pt-2 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-4"
      >
        {/* LEFT: Team */}
        <div className="lg:col-span-3 relative z-10">
          <TeamColumn
            divisionId={divisionId}
            accentColor={accent}
            total={division.total}
            flexSeats={division.flexSeats}
            totalNote={division.totalNote}
            onSelectRole={onSelectRole}
          />
        </div>

        {/* CENTER: Funnel */}
        <div className="lg:col-span-5 relative z-10">
          <div className="flex items-center justify-between gap-3 mb-3">
            <p
              className="text-[10px] uppercase tracking-[0.22em] font-semibold"
              style={{ color: accent }}
            >
              Operating Funnel
            </p>
            <span className="text-text-muted text-[10px]">
              {funnel.stages.length} stages
            </span>
          </div>
          <FunnelPyramid
            // Remount on funnel swap so the stagger animation re-triggers and
            // every newly-keyed stage is guaranteed to render visibly.
            key={funnel.id}
            ref={funnelRef}
            funnel={funnel}
            accentColor={accent}
            highlightedStages={highlightedStages}
            onStageHover={setHoveredStage}
          />
        </div>

        {/* RIGHT: Automation */}
        <div className="lg:col-span-4 relative z-10">
          <AutomationColumn
            // Remount on service swap so newly-added tools (e.g. SupoTrack on
            // Roofing) animate in from the initial state instead of staying at
            // opacity 0 from a once:true viewport trigger.
            key={`${divisionId}-${service}`}
            ref={toolRef}
            title={automationTitle}
            badge={automationBadge}
            items={tools}
            accentColor={accent}
            highlightedTools={highlightedTools}
            onToolHover={setHoveredTool}
            groupLabels={groupLabels}
          />
        </div>

        {/* SVG connector overlay (desktop only — hidden on mobile where columns stack).
            Spans the full grid container; coordinates are relative to it. */}
        <div className="hidden lg:block absolute inset-0 z-0 pointer-events-none">
          <ConnectorOverlay
            containerRef={containerRef}
            funnelRef={funnelRef}
            toolRef={toolRef}
            connections={connections}
            accentColor={accent}
            highlightedTools={highlightedTools}
            highlightedStages={highlightedStages}
          />
        </div>
      </div>

      {/* Aerial feedback loop */}
      {divisionId === 'aerialInsights' && (
        <FeedbackLoop accentColor={accent} />
      )}
    </section>
  )
}

// ─── Service tabs (Home Services) ─────────────────────────────────────────

function ServiceTabs({
  active,
  onChange,
  accentColor,
}: {
  active: HsServiceId
  onChange: (id: HsServiceId) => void
  accentColor: string
}) {
  return (
    <div
      className="inline-flex rounded-xl p-1 gap-1 bg-surface"
      style={{ border: `1px solid ${accentColor}55` }}
      role="tablist"
      aria-label="Service funnel"
    >
      {HS_SERVICES.map((s) => {
        const selected = s.id === active
        return (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(s.id)}
            className={`relative px-3 py-1.5 rounded-lg text-xs font-display font-semibold transition-colors ${
              selected ? '' : 'text-text-secondary hover:text-text-primary'
            }`}
            style={{
              color: selected ? '#ffffff' : undefined,
              background: selected ? accentColor : 'transparent',
              boxShadow: selected ? `0 4px 16px ${accentColor}55` : 'none',
            }}
          >
            {s.label}
          </button>
        )
      })}
    </div>
  )
}

// ─── Aerial feedback loop ─────────────────────────────────────────────────

function FeedbackLoop({ accentColor }: { accentColor: string }) {
  return (
    <div
      className="relative px-5 sm:px-7 lg:px-8 py-6 border-t"
      style={{ borderColor: `${accentColor}22` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <span
          className="inline-flex items-center justify-center w-6 h-6 rounded-full font-display font-bold text-xs text-white"
          style={{ background: accentColor }}
        >
          ↻
        </span>
        <p
          className="text-[10px] uppercase tracking-[0.22em] font-semibold"
          style={{ color: accentColor }}
        >
          Compounding Data Loop
        </p>
        <div className="flex-1 h-px" style={{ background: `${accentColor}55` }} aria-hidden />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {AERIAL_FEEDBACK_LOOP.map((node, idx) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.08, duration: 0.3 }}
            className="flex items-center gap-2"
          >
            <div
              className="rounded-lg px-3 py-2 font-display font-bold text-xs text-text-primary"
              style={{
                background: `${accentColor}1a`,
                border: `1.5px solid ${accentColor}`,
              }}
            >
              {node.label}
            </div>
            <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden>
              <path
                d="M1 5H16M16 5L12 1M16 5L12 9"
                stroke={accentColor}
                strokeOpacity="0.9"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: AERIAL_FEEDBACK_LOOP.length * 0.08, duration: 0.3 }}
          className="rounded-lg px-3 py-2 font-display font-bold text-xs text-white"
          style={{
            background: accentColor,
            boxShadow: `0 4px 16px ${accentColor}55`,
          }}
        >
          More Data ↻
        </motion.div>
      </div>
    </div>
  )
}
