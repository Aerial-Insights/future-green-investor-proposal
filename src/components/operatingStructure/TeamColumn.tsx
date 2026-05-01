// LEFT column — team boxes by role.
// Uses the TEAM_LAYOUTS map to render hero rows + side-by-side groups.
// Every box is clickable and opens the role drawer.

import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '../../theme/animations'
import {
  ROLES,
  TEAM_LAYOUTS,
  type DivisionId,
  type RoleDetail,
  type TeamLayoutItem,
} from '../../data/investorPortal/operatingStructure'

interface TeamColumnProps {
  divisionId: DivisionId
  accentColor: string
  total: number
  flexSeats?: number
  totalNote?: string
  onSelectRole: (role: RoleDetail) => void
}

export default function TeamColumn({
  divisionId,
  accentColor,
  total,
  flexSeats,
  totalNote,
  onSelectRole,
}: TeamColumnProps) {
  const layout = TEAM_LAYOUTS[divisionId]

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <p
          className="text-[10px] uppercase tracking-[0.22em] font-semibold"
          style={{ color: accentColor }}
        >
          Team
        </p>
        <div
          className="rounded-md px-2.5 py-1 font-display font-bold text-sm text-white"
          style={{
            background: accentColor,
            boxShadow: `0 2px 8px ${accentColor}40`,
          }}
        >
          {total}
          {flexSeats ? <span className="text-white/85 text-xs ml-1">+{flexSeats}</span> : null}
        </div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-80px' }}
        className="space-y-2.5"
      >
        {layout.map((item, idx) => (
          <motion.div key={idx} variants={staggerItem}>
            {item.type === 'hero' ? (
              <HeroBox
                role={ROLES[item.roleId]}
                accentColor={accentColor}
                onClick={() => onSelectRole(ROLES[item.roleId])}
              />
            ) : (
              <GroupBox item={item} accentColor={accentColor} onSelectRole={onSelectRole} />
            )}
          </motion.div>
        ))}
      </motion.div>

      {totalNote && (
        <p className="text-text-muted text-[10px] leading-snug pt-1">{totalNote}</p>
      )}
    </div>
  )
}

function HeroBox({
  role,
  accentColor,
  onClick,
}: {
  role: RoleDetail
  accentColor: string
  onClick: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 24 }}
      className="group w-full text-left rounded-xl p-3 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface relative overflow-hidden bg-surface-elevated"
      style={{
        border: `1.5px solid ${accentColor}66`,
        boxShadow: `inset 4px 0 0 0 ${accentColor}, 0 1px 3px rgba(0,0,0,0.04)`,
      }}
      aria-label={`${role.title} — open role detail`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display font-bold text-text-primary text-sm leading-tight">
            {role.title}
          </p>
          {role.shortNote && (
            <p className="text-text-secondary text-[10px] mt-0.5 truncate">{role.shortNote}</p>
          )}
        </div>
        <span
          className="shrink-0 inline-flex items-center justify-center min-w-[36px] h-8 px-2 rounded-md font-display font-bold text-sm text-white"
          style={{ background: accentColor }}
        >
          {role.count}
        </span>
      </div>
    </motion.button>
  )
}

function GroupBox({
  item,
  accentColor,
  onSelectRole,
}: {
  item: Extract<TeamLayoutItem, { type: 'group' }>
  accentColor: string
  onSelectRole: (role: RoleDetail) => void
}) {
  return (
    <div
      className="rounded-xl p-3 bg-surface-elevated"
      style={{ border: `1.5px solid ${accentColor}55` }}
    >
      <p
        className="text-[10px] uppercase tracking-[0.2em] font-bold mb-2"
        style={{ color: accentColor }}
      >
        {item.label}
      </p>
      <div className="grid grid-cols-1 gap-1.5">
        {item.roleIds.map((id) => {
          const role = ROLES[id]
          if (!role) return null
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelectRole(role)}
              className="group text-left rounded-lg px-2.5 py-1.5 transition-colors hover:bg-surface-hover focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-offset-surface bg-surface"
              style={{ border: `1px solid ${accentColor}40` }}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-text-primary text-xs font-semibold leading-tight truncate">
                  {role.title}
                </p>
                <span
                  className="shrink-0 inline-flex items-center justify-center min-w-[26px] h-6 px-1.5 rounded font-display font-bold text-[11px] text-white"
                  style={{ background: accentColor }}
                >
                  {role.flex ? `+${role.count}` : role.count}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
