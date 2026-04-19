import { useState } from 'react'
import PageShell from '../components/layout/PageShell'
import SectionBanner from '../components/sections/SectionBanner'
import StickyTabNav from '../components/layout/StickyTabNav'
import AerialOverview from '../components/sections/aerial-insights/AerialOverview'
import AerialWorkflow from '../components/sections/aerial-insights/AerialWorkflow'
import AerialRevenueModel from '../components/sections/aerial-insights/AerialRevenueModel'
import AerialExpansion from '../components/sections/aerial-insights/AerialExpansion'
import AerialProjections from '../components/sections/aerial-insights/AerialProjections'
import { AERIAL_INSIGHTS } from '../data/investorPortal/content'
import { DIVISION_COLORS } from '../theme/chartTheme'

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'workflow', label: 'Platform Workflow' },
  { id: 'revenue', label: 'Revenue Model' },
  { id: 'expansion', label: 'Expansion' },
  { id: 'projections', label: 'Projections' },
]

export default function AerialInsights() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <PageShell fullWidth>
      <SectionBanner
        headline={AERIAL_INSIGHTS.headline}
        subtitle={AERIAL_INSIGHTS.subtitle}
        accentColor={DIVISION_COLORS.aerialInsights}
      />

      <div className="section-container">
        <StickyTabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="py-8">
          {activeTab === 'overview' && <AerialOverview />}
          {activeTab === 'workflow' && <AerialWorkflow />}
          {activeTab === 'revenue' && <AerialRevenueModel />}
          {activeTab === 'expansion' && <AerialExpansion />}
          {activeTab === 'projections' && <AerialProjections />}
        </div>
      </div>
    </PageShell>
  )
}
