import { useEffect, useState } from 'react'
import PageShell from '../components/layout/PageShell'
import SectionBanner from '../components/sections/SectionBanner'
import StickyTabNav from '../components/layout/StickyTabNav'
import OptionToggle from '../components/financial/OptionToggle'
import UnlockAssumptions from '../components/financial/UnlockAssumptions'
import PercentageBackView from './financial-model/PercentageBackView'
import PartnershipView from './financial-model/PartnershipView'
import CapitalDeploymentView from './financial-model/CapitalDeploymentView'
import { useAssumptionsStore } from '../store/useAssumptionsStore'
import { useFinancialOption } from '../hooks/useCalculations'

const PERCENTAGE_BACK_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'returns', label: 'Your Returns' },
  { id: 'capital', label: 'Capital Deployment' },
]

const PARTNERSHIP_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'earnings', label: 'Your Earnings' },
  { id: 'governance', label: 'Governance & Terms' },
  { id: 'capital', label: 'Capital Deployment' },
]

export default function FinancialModel() {
  const selectedOption = useFinancialOption()
  const setFinancialOption = useAssumptionsStore((s) => s.setFinancialOption)
  const [activeTab, setActiveTab] = useState('overview')

  // Reset to first tab whenever the option toggles, so users land in the
  // right place after switching structures.
  useEffect(() => {
    setActiveTab('overview')
  }, [selectedOption])

  const tabs = selectedOption === 'percentageBack' ? PERCENTAGE_BACK_TABS : PARTNERSHIP_TABS
  const subtitle =
    selectedOption === 'percentageBack'
      ? 'A 5-year, threshold-based capped return structure.'
      : 'A 20-year permanent partnership across the operating platform.'

  return (
    <PageShell fullWidth>
      <SectionBanner
        headline="Financial Model"
        subtitle={subtitle}
        accentColor="#d4d4d8"
      />

      <div className="section-container">
        <OptionToggle selected={selectedOption} onChange={setFinancialOption} />

        <StickyTabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="py-8">
          {activeTab === 'capital' ? (
            <CapitalDeploymentView />
          ) : selectedOption === 'percentageBack' ? (
            <PercentageBackView activeTab={activeTab} />
          ) : (
            <PartnershipView activeTab={activeTab} />
          )}
        </div>

        <UnlockAssumptions selectedOption={selectedOption} />
      </div>
    </PageShell>
  )
}
