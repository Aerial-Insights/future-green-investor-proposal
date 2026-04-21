// ─── HOME SERVICES OUTPUTS ───────────────────────────────────────────────────

export interface D2DChannelOutput {
  reps: number
  doorsPerWeek: number
  doorsPerMonth: number
  roofingJobsPerMonth: number
  roofingProfitMonthly: number
  upsellProfitMonthly: number
  totalProfitMonthly: number
  totalProfitAnnual: number
  totalCostAnnual: number
  totalRevenueAnnual: number
}

export interface DirectMailChannelOutput {
  piecesPerMonth: number
  costPerMonth: number
  leadsPerMonth: number
  roofingJobsPerMonth: number
  roofingProfitMonthly: number
  upsellProfitMonthly: number
  totalProfitMonthly: number
  totalProfitAnnual: number
  totalCostAnnual: number
  totalRevenueAnnual: number
}

export interface CommercialPaidLeadsOutput {
  adSpendMonthly: number
  roofingJobs: number
  solarJobs: number
  lightingJobs: number
  roofingProfit: number
  solarProfit: number
  lightingProfit: number
  totalProfitMonthly: number
  totalProfitAnnual: number
  totalCostAnnual: number
  totalRevenueAnnual: number
}

export interface EnergyGrantsPPCOutput {
  adSpendMonthly: number
  hvacJobs: number
  insulationJobs: number
  waterHeaterJobs: number
  hvacProfit: number
  insulationProfit: number
  waterHeaterProfit: number
  baseProfitMonthly: number
  upsellProfitMonthly: number
  totalProfitMonthly: number
  totalProfitAnnual: number
  totalCostAnnual: number
  totalRevenueAnnual: number
}

export interface UpsellBreakdown {
  hvacProfit: number
  insulationProfit: number
  waterHeaterProfit: number
  airSealingProfit: number
  solarProfit: number
  ledProfit: number
  totalProfit: number
  totalRevenue: number
}

export interface GrantOutput {
  grantSupportedDeals: number
  effectiveCloseRate: number
  estimatedReimbursement: number
  rebateEligibleDeals: number
  estimatedRebateOffset: number
  commercialRebateDeals: number
  estimatedCommercialRebateOffset: number
  totalRebateOffset: number
  profitMultiplier: number
}

export interface HomeServicesFullOutput {
  d2d: D2DChannelOutput
  directMail: DirectMailChannelOutput
  commercial: CommercialPaidLeadsOutput
  energyGrants: EnergyGrantsPPCOutput
  grants: GrantOutput
  totalProfitMonthly: number
  totalProfitAnnual: number
}

// ─── SOLAR OPERATIONS OUTPUTS ────────────────────────────────────────────────

export interface SolarOperationsOutput {
  residentialInstalls: number
  commercialInstalls: number
  residentialRevenue: number
  commercialRevenue: number
  lightingRevenue: number
  totalOperatingRevenue: number
  totalProfit: number
  grossMarginPercent: number
}

// ─── DISTRIBUTED SOLAR OUTPUTS ──────────────────────────────────────────────

export interface DistributedSolarOutput {
  marketingSpend: number
  leadsGenerated: number
  newInstalls: number
  cumulativeInstalls: number
  installRevenue: number    // counts toward investor threshold
  installProfit: number     // installRevenue * installMargin
  srecRevenue: number       // gross SREC revenue — does NOT count toward threshold
  adminCostRate: number     // SREC admin/compliance rate (registration, monitoring, reporting)
  adminCost: number         // srecRevenue * adminCostRate
  netSrecRevenue: number    // srecRevenue - adminCost
  totalRevenue: number
  revenuePerInstall: number
  grossSrecPerInstall: number  // annual gross SREC per install
  netSrecPerInstall: number    // annual net SREC per install
  cumulativeMarketingSpend: number // sum of marketing spend Y1 through current year
  srecsPerInstall: number
  srecValuePerCredit: number
}

// ─── LAND & REAL ESTATE OUTPUTS ──────────────────────────────────────────────

export interface OutreachFunnelOutput {
  monthlyLetters: number
  monthlyResponses: number
  monthlyQualifiedLeads: number
  monthlyAcquisitions: number
  annualAcquisitions: number
  annualAcresAcquired: number
}

export interface DealAllocationOutput {
  wholesaleDeals: number
  housingDeals: number
  subdivisionDeals: number
  wholesaleAcres: number
  housingAcres: number
  subdivisionAcres: number
}

export interface WholesaleOutput {
  totalDeals: number
  totalRevenue: number
  totalProfit: number
}

export interface HousingOutput {
  homesBuilt: number
  buildCostPerUnit: number
  marketValuePerUnit: number
  profitPerUnit: number
  totalBuildCost: number
  totalMarketValue: number
  totalProfit: number
}

export interface SubdivisionOutput {
  subdivides: number
  propertiesAcquired: number
  acres: number
  totalLots: number
  avgAcresPerProperty: number
  subdivisionCountPerProperty: number
  acquisitionCostPerAcre: number
  profitMultiplier: number
  totalAcquisitionCost: number
  resaleRevenue: number
  profit: number
  profitPerSubdivide: number
  /** @deprecated kept for backward compat — use subdivides instead */
  deals: number
  /** @deprecated kept for backward compat */
  lettersSentMonthly: number
  /** @deprecated kept for backward compat */
  lettersSentAnnually: number
  /** @deprecated kept for backward compat */
  dealsPerMonth: number
  /** @deprecated kept for backward compat */
  dealsPerYear: number
  /** @deprecated kept for backward compat — use subdivides instead */
  subdivisionEligibleDeals: number
}

export interface RealEstateFullOutput {
  funnel: OutreachFunnelOutput
  allocation: DealAllocationOutput
  wholesale: WholesaleOutput
  distributedSolar: DistributedSolarOutput
  housing: HousingOutput
  subdivision: SubdivisionOutput
  totalRevenue: number
  totalProfit: number
}

// ─── AERIAL INSIGHTS OUTPUTS ─────────────────────────────────────────────────

export interface AerialInsightsOutput {
  activeUsers: number
  subscriptionMRR: number
  totalMRR: number
  totalARR: number
  annualRevenue: number
  customerAcquisitionCost: number
  scanCostMonthly: number
}

// ─── PORTFOLIO OUTPUTS ───────────────────────────────────────────────────────

export interface PortfolioOutput {
  totalProfit: number
  homeServicesProfit: number
  solarOperationsProfit: number
  distributedSolarProfit: number
  realEstateProfit: number
  aerialProfit: number
  homeServicesMix: number
  solarMix: number
  distributedSolarMix: number
  realEstateMix: number
  aerialMix: number
}

export interface CapitalDeploymentOutput {
  distributedSolar: number
  homeServices: number
  marketing: number
  aerialInsights: number
  wholesalePipeline: number
  lowIncomeHousing: number
  strategicPartnerships: number
  totalDeployed: number
}

export interface ReturnTimelineOutput {
  nearTermProfit: number
  nearTermDescription: string
  mediumTermProfit: number
  mediumTermDescription: string
  longTermProfit: number
  longTermDescription: string
}

// ─── INVESTOR RETURN OUTPUTS ────────────────────────────────────────────────

export interface AnnualInvestorReturn {
  year: number
  homeServicesDistribution: number
  solarRealEstateDistribution: number
  aerialDistribution: number
  aerialResidualDistribution: number
  totalDistribution: number
  cumulativeDistributions: number
  thresholdMet: boolean
  thresholdMetThisYear: boolean
  srecDistribution: number
  totalReturnThisYear: number
  cumulativeTotalReturn: number
}

export interface InvestorReturnSummary {
  totalCapital: number
  thresholdTarget: number
  annualReturns: AnnualInvestorReturn[]
  totalDistributed: number
  thresholdProgress: number
  thresholdYear: number | null
  totalSRECDistributed: number
  totalAerialResidualDistributed: number
  isThresholdMet: boolean
  monthsToThreshold: number | null
  projectedAnnualAerialResidual: number
}

// ─── 20-YEAR SREC COHORT MODEL ─────────────────────────────────────────────

export interface SRECCohort {
  buildYear: number
  installCount: number
  srecsPerInstall: number
  srecValuePerCredit: number
  annualSRECRevenue: number
  srecLifespan: number
  startYear: number
  endYear: number
}

export interface LongTermSRECYear {
  year: number
  cohortContributions: Record<number, number>
  totalSRECRevenue: number
  investorShare: number
  cumulativeInvestorShare: number
}

export interface LongTermSRECSummary {
  cohorts: SRECCohort[]
  annualProjections: LongTermSRECYear[]
  totalInvestorSRECIncome: number
  totalPlatformSRECRevenue: number
  peakAnnualInvestorIncome: number
  investorEquityShare: number
}

// ─── AERIAL RESIDUAL ECONOMICS ─────────────────────────────────────────────

export interface AerialContinuationYear {
  year: number
  activeUsers: number
  annualRevenue: number
  aerialProfit: number
  investorShare: number
  investorSharePercent: number
  isContinuation: boolean
}

export interface AerialExitValuation {
  exitYear: number
  arrAtExit: number
  valuationMultiple: number
  companyValuation: number
  investorSharePercent: number
  investorExitValue: number
  conservativeMultiple: number
  conservativeValuation: number
  conservativeInvestorValue: number
  optimisticMultiple: number
  optimisticValuation: number
  optimisticInvestorValue: number
}

export interface AerialResidualSummary {
  yearlyBreakdown: AerialContinuationYear[]
  totalInvestorY1to5: number
  totalInvestorY6to10: number
  totalInvestor10Year: number
  exitValuation: AerialExitValuation
  peakAnnualResidual: number
  y5ActiveUsers: number
  revenuePerUser: number
}

// ─── YEAR-OVER-YEAR STRUCTURE ────────────────────────────────────────────────

export interface YearlyOutputs {
  year: number
  homeServices: HomeServicesFullOutput
  solarOperations: SolarOperationsOutput
  realEstate: RealEstateFullOutput
  aerial: AerialInsightsOutput
  portfolio: PortfolioOutput
  capitalDeployment: CapitalDeploymentOutput
  returnTimeline: ReturnTimelineOutput
}
