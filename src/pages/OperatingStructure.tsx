// Operating Structure — visual-first investor system.
// Tabs: Home Services · Real Estate · Aerial Insights · Entity Structure.
// Each division renders a 3-column OS view: team boxes · funnel pyramid · AI tools.
// Visual reference: https://canva.link/7no0j2hm723wmve

import { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PageShell from '../components/layout/PageShell'
import SectionBanner from '../components/sections/SectionBanner'
import StickyTabNav from '../components/layout/StickyTabNav'
import DivisionOS from '../components/operatingStructure/DivisionOS'
import EntityStructureView from '../components/operatingStructure/EntityStructureView'
import RoleDrawer from '../components/operatingStructure/RoleDrawer'
import {
  DIVISIONS,
  OPERATING_STRUCTURE_PAGE,
  type DivisionId,
  type RoleDetail,
} from '../data/investorPortal/operatingStructure'
import { slideUp } from '../theme/animations'

type TabId = DivisionId | 'entity'

const tabs: { id: TabId; label: string }[] = [
  { id: 'homeServices', label: 'Home Services' },
  { id: 'realEstate', label: 'Real Estate' },
  { id: 'aerialInsights', label: 'Aerial Insights' },
  { id: 'entity', label: 'Entity Structure' },
]

export default function OperatingStructure() {
  const [activeTab, setActiveTab] = useState<TabId>('homeServices')
  const [activeRole, setActiveRole] = useState<RoleDetail | null>(null)

  const onSelectRole = useCallback((role: RoleDetail) => setActiveRole(role), [])
  const onCloseRole = useCallback(() => setActiveRole(null), [])

  return (
    <PageShell fullWidth>
      <SectionBanner
        headline={OPERATING_STRUCTURE_PAGE.headline}
        subtitle={OPERATING_STRUCTURE_PAGE.subtitle}
        accentColor={DIVISIONS.homeServices.accentColor}
      />

      <div className="section-container">
        <StickyTabNav
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(id) => setActiveTab(id as TabId)}
        />
      </div>

      <div className="section-container py-8 sm:py-10">
        <AnimatePresence mode="wait">
          {activeTab === 'entity' ? (
            <motion.div
              key="entity"
              variants={slideUp}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <EntityStructureView />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              variants={slideUp}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <DivisionOS divisionId={activeTab as DivisionId} onSelectRole={onSelectRole} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <RoleDrawer role={activeRole} onClose={onCloseRole} />
    </PageShell>
  )
}
