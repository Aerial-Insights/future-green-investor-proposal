import { motion } from 'framer-motion'
import { useAssumptionsStore } from '../../store/useAssumptionsStore'
import { usePartnershipReturns, usePartnershipPositionValue } from '../../hooks/useCalculations'
import PartnershipHero from './sections/PartnershipHero'
import PartnershipDivisionShareCards from './sections/PartnershipDivisionShareCards'
import PartnershipMilestones from './sections/PartnershipMilestones'
import PartnershipGrowthChart from './sections/PartnershipGrowthChart'
import PartnershipDivisionContributionChart from './sections/PartnershipDivisionContributionChart'
import PartnershipYearlyEarnings from '../../components/financial/PartnershipYearlyEarnings'
import PartnershipGovernanceSummary from './sections/PartnershipGovernanceSummary'
import PartnershipUpsideSummary from './sections/PartnershipUpsideSummary'
import PartnershipPositionValueOverTime from './sections/PartnershipPositionValueOverTime'
import PartnershipWaterfallExplanation from '../../components/financial/PartnershipWaterfallExplanation'
import SuretyBondSection from '../../components/sections/SuretyBondSection'

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

interface Props {
  activeTab: string
}

export default function PartnershipView({ activeTab }: Props) {
  const summary = usePartnershipReturns()
  const positionValue = usePartnershipPositionValue()
  const config = useAssumptionsStore((s) => s.assumptions.financialModelOption.partnership)

  return (
    <motion.div className="space-y-10" variants={stagger} initial="hidden" animate="visible">
      {activeTab === 'overview' && (
        <>
          <PartnershipHero summary={summary} config={config} />
          <PartnershipWaterfallExplanation summary={summary} config={config} />
          <SuretyBondSection />
          <PartnershipDivisionShareCards summary={summary} config={config} />
          <PartnershipGrowthChart summary={summary} />
          <PartnershipDivisionContributionChart summary={summary} />
          <PartnershipPositionValueOverTime summary={positionValue} />
        </>
      )}

      {activeTab === 'earnings' && (
        <>
          <PartnershipYearlyEarnings summary={summary} />
          <PartnershipWaterfallExplanation summary={summary} config={config} />
          <PartnershipMilestones summary={summary} />
          <PartnershipPositionValueOverTime summary={positionValue} />
          <PartnershipUpsideSummary summary={summary} config={config} />
        </>
      )}

      {activeTab === 'governance' && (
        <>
          <PartnershipGovernanceSummary config={config} />
          <PartnershipUpsideSummary summary={summary} config={config} />
        </>
      )}
    </motion.div>
  )
}
