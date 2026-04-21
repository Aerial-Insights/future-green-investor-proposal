import MemoLayout from './investor-memo/MemoLayout'
import MemoHero from './investor-memo/sections/MemoHero'
import ExecutiveSummary from './investor-memo/sections/ExecutiveSummary'
import InvestmentOverview from './investor-memo/sections/InvestmentOverview'
import PlatformOverview from './investor-memo/sections/PlatformOverview'
import HomeServicesDivision from './investor-memo/sections/HomeServicesDivision'
import SalesEngine from './investor-memo/sections/SalesEngine'
import GrantAdvantage from './investor-memo/sections/GrantAdvantage'
import SolarDivision from './investor-memo/sections/SolarDivision'
import RealEstateDivision from './investor-memo/sections/RealEstateDivision'
import AerialInsightsDivision from './investor-memo/sections/AerialInsightsDivision'
import CapitalDeployment from './investor-memo/sections/CapitalDeployment'
import FinancialProjections from './investor-memo/sections/FinancialProjections'
import ScenarioAnalysis from './investor-memo/sections/ScenarioAnalysis'
import InvestorReturnStructure from './investor-memo/sections/InvestorReturnStructure'
import ResidualIncome from './investor-memo/sections/ResidualIncome'
import QualificationsSection from './investor-memo/sections/QualificationsSection'
import ImpactSection from './investor-memo/sections/ImpactSection'
import ClosingThesis from './investor-memo/sections/ClosingThesis'

export default function InvestorMemo() {
  return (
    <MemoLayout>
      <MemoHero />
      <ExecutiveSummary />
      <InvestmentOverview />
      <PlatformOverview />
      <HomeServicesDivision />
      <SalesEngine />
      <GrantAdvantage />
      <SolarDivision />
      <RealEstateDivision />
      <AerialInsightsDivision />
      <CapitalDeployment />
      <FinancialProjections />
      <ScenarioAnalysis />
      <InvestorReturnStructure />
      <ResidualIncome />
      <QualificationsSection />
      <ImpactSection />
      <ClosingThesis />
    </MemoLayout>
  )
}
