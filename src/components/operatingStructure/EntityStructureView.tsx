import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '../../theme/animations'
import {
  DIVISIONS,
  ENTITY_STRUCTURE,
  type EntityDivision,
} from '../../data/investorPortal/operatingStructure'

const TRUST_ACCENT = '#2d6a4f'
const TRUST_ACCENT_ON_DARK = '#7bd2a0' // brighter sage for text/strokes on dark Trust panel
const SEPARATE_ACCENT = '#6366f1'

export default function EntityStructureView() {
  return (
    <div className="space-y-8">
      <Intro />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Trust + Divisions column (8 of 12) */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-80px' }}
          className="xl:col-span-8 space-y-5"
        >
          <motion.div variants={staggerItem}>
            <TrustNode />
          </motion.div>

          <motion.div variants={staggerItem} className="flex justify-center" aria-hidden>
            <Splitter />
          </motion.div>

          <motion.div variants={staggerItem} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {ENTITY_STRUCTURE.divisions.map((division) => (
              <DivisionEntityCard key={division.id} division={division} />
            ))}
          </motion.div>
        </motion.div>

        {/* Separate Aerial entity (4 of 12) */}
        <motion.div
          variants={staggerItem}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-80px' }}
          className="xl:col-span-4"
        >
          <SeparateEntityCard />
        </motion.div>
      </div>

      <InvestorNote />
    </div>
  )
}

function Intro() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <Pillar label="Centralized Control" tone="trust">
        Strategic direction held in a single trust.
      </Pillar>
      <Pillar label="Liability Separation" tone="hs">
        Each Home Services trade is a separate subsidiary.
      </Pillar>
      <Pillar label="Separate Technology Entity" tone="aerial">
        Aerial Insights stays structurally independent.
      </Pillar>
    </div>
  )
}

function Pillar({
  label,
  children,
  tone,
}: {
  label: string
  children: React.ReactNode
  tone: 'trust' | 'hs' | 'aerial'
}) {
  const accent =
    tone === 'aerial'
      ? SEPARATE_ACCENT
      : tone === 'hs'
      ? DIVISIONS.homeServices.accentColor
      : TRUST_ACCENT
  return (
    <div
      className="rounded-2xl border p-4"
      style={{
        borderColor: `${accent}33`,
        background: `linear-gradient(135deg, ${accent}10 0%, transparent 100%)`,
      }}
    >
      <p
        className="text-[10px] uppercase tracking-[0.22em] font-semibold mb-1"
        style={{ color: accent }}
      >
        {label}
      </p>
      <p className="text-text-secondary text-xs leading-relaxed">{children}</p>
    </div>
  )
}

function TrustNode() {
  return (
    <div
      className="relative rounded-3xl overflow-hidden border p-6 sm:p-7 text-center"
      style={{
        borderColor: `${TRUST_ACCENT}55`,
        background: `linear-gradient(135deg, rgba(22,38,28,0.96) 0%, rgba(45,106,79,0.92) 100%)`,
        boxShadow: `0 0 0 1px ${TRUST_ACCENT}33 inset, 0 12px 40px rgba(45,106,79,0.20)`,
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{ background: `linear-gradient(90deg, transparent, ${TRUST_ACCENT_ON_DARK}, transparent)` }}
        aria-hidden
      />
      <p
        className="text-[10px] uppercase tracking-[0.24em] font-semibold mb-1.5"
        style={{ color: TRUST_ACCENT_ON_DARK }}
      >
        {ENTITY_STRUCTURE.trust.badge}
      </p>
      <h3 className="font-display font-bold text-white text-2xl sm:text-3xl leading-tight">
        {ENTITY_STRUCTURE.trust.title}
      </h3>
      <p className="text-white/90 text-sm mt-2">{ENTITY_STRUCTURE.trust.note}</p>
    </div>
  )
}

function Splitter() {
  return (
    <svg width="160" height="36" viewBox="0 0 160 36" fill="none" aria-hidden>
      <path
        d="M80 0V12M80 12L20 24V36M80 12L140 24V36"
        stroke={TRUST_ACCENT}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.85"
      />
    </svg>
  )
}

function DivisionEntityCard({ division }: { division: EntityDivision }) {
  const accent = DIVISIONS[division.id].accentColor
  return (
    <div
      className="rounded-2xl border bg-surface-elevated p-5 relative overflow-hidden"
      style={{
        borderColor: `${accent}40`,
        boxShadow: `0 0 0 1px ${accent}11 inset`,
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, ${accent}, ${accent}33)` }}
        aria-hidden
      />
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p
            className="text-[10px] uppercase tracking-[0.22em] font-semibold mb-1"
            style={{ color: accent }}
          >
            {division.badge}
          </p>
          <h4 className="font-display font-bold text-text-primary text-lg leading-tight">
            {division.title}
          </h4>
        </div>
        <span
          className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-md"
          style={{
            color: accent,
            backgroundColor: `${accent}15`,
            border: `1px solid ${accent}40`,
          }}
          aria-hidden
        >
          ◆
        </span>
      </div>
      <p className="text-text-secondary text-xs leading-relaxed mb-3.5">{division.description}</p>

      <div className="flex flex-wrap gap-2">
        {division.subsidiaries.map((sub) => (
          <SubsidiaryChip key={sub.name} name={sub.name} note={sub.note} accent={accent} />
        ))}
      </div>
    </div>
  )
}

function SubsidiaryChip({
  name,
  note,
  accent,
}: {
  name: string
  note?: string
  accent: string
}) {
  return (
    <div
      className="rounded-lg border px-3 py-2 transition-colors hover:bg-surface-hover"
      style={{
        borderColor: `${accent}33`,
        background: `linear-gradient(135deg, ${accent}0a 0%, transparent 100%)`,
      }}
      title={note}
    >
      <p className="font-display font-semibold text-text-primary text-xs leading-tight">
        {name}
      </p>
      {note && <p className="text-text-muted text-[10px] mt-0.5">{note}</p>}
    </div>
  )
}

function SeparateEntityCard() {
  const entity = ENTITY_STRUCTURE.separate
  return (
    <div
      className="relative rounded-3xl border p-6 h-full overflow-hidden"
      style={{
        borderColor: `${SEPARATE_ACCENT}55`,
        background: `linear-gradient(135deg, ${SEPARATE_ACCENT}12 0%, ${SEPARATE_ACCENT}03 100%)`,
        boxShadow: `0 0 0 1px ${SEPARATE_ACCENT}22 inset`,
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{
          background: `linear-gradient(90deg, ${SEPARATE_ACCENT}, ${SEPARATE_ACCENT}33)`,
        }}
        aria-hidden
      />

      <div className="flex items-center gap-2 mb-3">
        <span
          className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-semibold"
          style={{
            color: SEPARATE_ACCENT,
            backgroundColor: `${SEPARATE_ACCENT}1a`,
            border: `1px solid ${SEPARATE_ACCENT}55`,
          }}
        >
          {entity.badge}
        </span>
      </div>

      <h4 className="font-display font-bold text-text-primary text-2xl leading-tight">
        {entity.title}
      </h4>
      <p className="text-text-secondary text-sm leading-relaxed mt-2 mb-4">{entity.description}</p>

      <div className="space-y-2">
        {entity.capabilities.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border px-3 py-2.5 bg-surface-elevated"
            style={{ borderColor: `${SEPARATE_ACCENT}26` }}
          >
            <div className="flex items-start gap-2.5">
              <span
                className="shrink-0 mt-1 inline-block w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: SEPARATE_ACCENT }}
                aria-hidden
              />
              <div className="min-w-0">
                <p className="font-display font-semibold text-text-primary text-sm leading-tight">
                  {c.label}
                </p>
                <p className="text-text-secondary text-xs mt-0.5">{c.note}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-5 rounded-lg px-3 py-2.5 text-[11px] leading-relaxed"
        style={{
          color: SEPARATE_ACCENT,
          backgroundColor: `${SEPARATE_ACCENT}10`,
          border: `1px dashed ${SEPARATE_ACCENT}55`,
        }}
      >
        Aligned with the platform — operates outside the trust to keep the technology asset structurally independent.
      </div>
    </div>
  )
}

function InvestorNote() {
  return (
    <div
      className="rounded-2xl border p-5 text-center"
      style={{
        borderColor: `${TRUST_ACCENT}33`,
        background: `linear-gradient(135deg, ${TRUST_ACCENT}0d 0%, ${SEPARATE_ACCENT}08 100%)`,
      }}
    >
      <p className="text-text-muted text-[10px] uppercase tracking-[0.22em] font-semibold mb-2">
        Why It's Structured This Way
      </p>
      <p className="font-display text-text-primary text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
        {ENTITY_STRUCTURE.investorNote}
      </p>
    </div>
  )
}
