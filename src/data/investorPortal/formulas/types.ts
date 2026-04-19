// ─── HOME SERVICES OUTPUTS ───────────────────────────────────────────────────

export interface D2DChannelOutput {
  doorsPerWeek: number
  doorsPerMonth: number
  roofingJobsPerMonth: number
  roofingProfitMonthly: number
  upsellProfitMonthly: number
  totalProfitMonthly: number
  totalProfitAnnual: number
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
}

export interface UpsellBreakdown {
  hvacProfit: number
  insulationProfit: number
  waterHeaterProfit: number
  airSealingProfit: number
  solarProfit: number
  ledProfit: number
  totalProfit: number
}

export interface GrantOutput {
  grantSupportedDeals: number
  effectiveCloseRate: number
  estimatedReimbursement: number
  rebateEligibleDeals: number
  estimatedRebateOffset: number
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
  solarFarmDeals: number
  housingDeals: number
  subdivisionDeals: number
  wholesaleAcres: number
  solarFarmAcres: number
  housingAcres: number
  subdivisionAcres: number
}

export interface WholesaleOutput {
  totalDeals: number
  totalRevenue: number
  totalProfit: number
}

export interface SolarFarmOutput {
  acresGoal: number
  totalMW: number
  srecRevenue: number
  totalInvestment: number
  activeAcres: number
  cumulativeSRECRevenue: number
  energyRevenue: number
  srecProfit: number
  totalProfit: number
  annualSRECRevenuePerAcre: number
  upfrontSRECValuePerAcre: number
  annualSRECRevenue: number
  upfrontSRECValue: number
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
  solarFarm: SolarFarmOutput
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
  realEstateProfit: number
  aerialProfit: number
  homeServicesMix: number
  solarMix: number
  realEstateMix: number
  aerialMix: number
}

export interface CapitalDeploymentOutput {
  solarFarms: number
  lowIncomeHousing: number
  landAcquisitions: number
  homeServiceOperations: number
  aerialInsights: number
  marketing: number
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
  totalDistribution: number
  cumulativeDistributions: number
  hurdleMet: boolean
  hurdleMetThisYear: boolean
  postHurdleSRECParticipation: number
  totalReturnThisYear: number
  cumulativeTotalReturn: number
}

export interface InvestorReturnSummary {
  totalCapital: number
  hurdleTarget: number
  annualReturns: AnnualInvestorReturn[]
  totalDistributed: number
  hurdleProgress: number
  hurdleYear: number | null
  postHurdleSRECTotal: number
  isHurdleMet: boolean
}

// ─── 20-YEAR SREC COHORT MODEL ─────────────────────────────────────────────

export interface SRECCohort {
  buildYear: number
  acresGoal: number
  annualSRECRevenuePerAcre: number
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
