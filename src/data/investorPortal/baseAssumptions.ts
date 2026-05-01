// ─── TYPE DEFINITIONS ────────────────────────────────────────────────────────
// All numbers sourced from master proposal spreadsheet

export interface SalesAssumptions {
  // Door-to-Door Channel
  reps: number
  doorsPerRepPerDay: number
  workingDaysPerWeek: number
  d2dConversionRate: number // 1.5% from doors to roofing jobs
  d2dAnnualCostPerRep: number // loaded cost per rep (salary + overhead + commission base)
  // Direct Mail Channel
  directMailPiecesPerMonth: number
  directMailCostPerPiece: number
  directMailLeadConversion: number // 0.5% mail to lead
  directMailLeadToJob: number // 55% lead to job
  // Commercial Paid Leads Channel
  commercialAdSpendMonthly: number
  commercialRoofingCPL: number
  commercialSolarCPL: number
  commercialLightingCPL: number
  commercialRoofingCloseRate: number
  commercialSolarCloseRate: number
  commercialLightingCloseRate: number
  // Energy Grants PPC Channel
  grantsPPCSpendMonthly: number
  hvacPPCDiversion: number // 40%
  insulationPPCDiversion: number // 30%
  waterHeaterPPCDiversion: number // 30%
  grantsPPCCostPerLead: number
  grantsPPCLeadConversion: number // 25%
}

export interface UpsellRates {
  toHVAC: number
  toInsulation: number
  toWaterHeater: number
  toAirSealing: number
  toSolar: number
  toLED: number
  // From HVAC base
  hvacToRoofing: number
  hvacToInsulation: number
  hvacToWaterHeater: number
  hvacToAirSealing: number
  hvacToSolar: number
  hvacToLED: number
}

export interface ServiceEconomics {
  // Residential
  roofingRevenuePerJob: number
  insulationRevenuePerJob: number
  airSealingRevenuePerJob: number
  hvacRevenuePerJob: number
  waterHeaterRevenuePerJob: number
  solarRevenuePerJob: number
  ledLightingRevenuePerJob: number
  roofingMargin: number
  insulationMargin: number
  airSealingMargin: number
  hvacMargin: number
  waterHeaterMargin: number
  solarMargin: number
  ledLightingMargin: number
  // Commercial
  commercialRoofingRevenuePerJob: number
  commercialSolarRevenuePerJob: number
  commercialLightingRevenuePerJob: number
  commercialRoofingMargin: number
  commercialSolarMargin: number
  commercialLightingMargin: number
  adminOverheadRate: number
}

export interface RealEstateAssumptions {
  mailVolumePerMonth: number // shared with direct mail for land
  responseRate: number // 1%
  leadRate: number // 40%
  closeRate: number // 45%
  averageParcelSize: number // 10 acres
  averageCostPerAcre: number // $10,000
  wholesaleAllocation: number // 65% (was 60%, absorbed former 5% solar farm allocation)
  housingSubdivideAllocation: number // 35%
  housingShareOfHousingSubdivide: number // 20%
  subdivisionShareOfHousingSubdivide: number // 80%
  averageAssignmentFee: number // $18,000
  avgResellPerAcre: number // $40,000
}

export interface DistributedSolarAssumptions {
  leadCost: number              // $200 blended cost per qualified solar lead
  conversionRate: number        // 8% lead-to-install (industry 5-12% for qualified leads)
  srecsPerInstall: number       // 12 SRECs per install per year
  srecValue: number             // $400 per SREC
  installFee: number            // $28,000 blended revenue per installation job
  installMargin: number         // 32% gross margin on install revenue
  // Monthly marketing ramp (spend per month by year)
  monthlySpendY1: number        // $50,000/month
  monthlySpendY2: number        // $85,000/month
  monthlySpendY3: number        // $120,000/month
  monthlySpendY4: number        // $160,000/month
  monthlySpendY5: number        // $200,000/month
  srecLifespan: number          // 20 years per cohort
  srecAdminRate: number         // 15% admin/compliance (registration, monitoring, reporting)
}

export interface HousingAssumptions {
  buildCostPerUnit: number // $200,000
  marketValuePerUnit: number // $360,000
  rentPerUnitMonthly: number // $2,200
  occupancyRate: number // 90%
  capRate: number // 6%
}

export interface AerialAssumptions {
  startingUsers: number // 500
  midTermUsers: number // 2,500
  longTermUsers: number // 25,000
  subscriptionMonthly: number // $1,200
  revenuePerUserMonthly: number // $700 (blended w/ services)
  customerAcquisitionCost: number // $200
  costPerScan: number // $0.07
  monthlyGrowthRate: number
  churnRate: number
  yearEndTargets: number[] // [Y1, Y2, Y3, Y4, Y5] user counts
  aerialMarketingMonthly: number // monthly marketing/growth budget
}

export interface CapitalAssumptions {
  totalCapitalRaise: number
  distributedSolar: number
  homeServices: number
  marketing: number
  aerialInsights: number
  wholesalePipeline: number
  lowIncomeHousing: number
  strategicPartnerships: number
}

export interface GrantAssumptions {
  grantEligibilityRate: number
  grantCloseRateUplift: number
  avgGrantCoveragePercent: number
  reimbursementLagMonths: number
  rebateEligibilityRate: number
  avgResidentialRebatePerDeal: number
  commercialRebateDealsPerYear: number
  avgCommercialRebatePerDeal: number
}

export interface DirectMailGrowth {
  y1LettersPerMonth: number
  y2LettersPerMonth: number
  y3LettersPerMonth: number
  y4LettersPerMonth: number
  y5LettersPerMonth: number
  costPerLetter: number
}

// ─── FINANCIAL MODEL OPTION (DUAL-STRUCTURE TOGGLE) ────────────────────────
// The investor proposal supports two return structures:
//   1. percentageBack — 5-year, 65%-threshold capped return (existing logic)
//   2. partnership    — 20-year permanent equity partnership across divisions
//
// All percentages, thresholds, and growth rates are centralized here so the
// UI never reads hardcoded numbers. Edits via the Unlock Assumptions panel
// flow through Zustand setters, triggering live recalculation everywhere.

export type FinancialModelOptionKey = 'percentageBack' | 'partnership'

export interface PercentageBackOptionConfig {
  homeServicesShare: number        // 0.15 of HS profits (Phase 1)
  solarRealEstateShare: number     // 0.20 of Solar+RE profits (Phase 1)
  aerialShare: number              // 0.10 of Aerial profits (Phase 1)
  srecShare: number                // 0.50 of SREC revenue (uncapped, both phases)
  aerialResidualShare: number      // 0.03 of Aerial revenue (Phase 2 permanent residual)
  returnThresholdMultiple: number  // 1.65 = 65% return target ($66M on $40M)
  timeHorizonYears: number         // 5 (model granularity)
}

export type GrowthPhaseKey = 'phase2' | 'phase3' | 'phase4' // Y6-10, Y11-15, Y16-20
export type GrowthDivisionKey = 'homeServices' | 'solarRealEstate' | 'aerial'

export interface PerDivisionGrowth {
  homeServices: number
  solarRealEstate: number          // applied to combined solarOps + RE profit
  aerial: number
}

export interface PartnershipGovernance {
  role: string                     // 'Chairman of the Board'
  boardSeatsAppointed: number      // 3
}

export interface PartnershipOptionConfig {
  // Initial Return Phase — applies until cumulative earnings reach the
  // configured return threshold. These are the "primary partnership
  // percentages" the investor participates at during the initial period.
  homeServicesShare: number        // 0.12 — initial-phase share of HS profits
  realEstateShare: number          // 0.18 — initial-phase share of Solar+RE profits
  aerialInsightsShare: number      // 0.07 — initial-phase share of Aerial profits
  // Permanent Long-Term Phase — applies after the threshold is reached and
  // continues for the rest of the partnership horizon.
  postThresholdHomeServicesShare: number    // 0.07 default
  postThresholdRealEstateShare: number      // 0.07 default — applied to Solar+RE combined
  postThresholdAerialInsightsShare: number  // 0.03 default
  // Return Threshold — investor switches to permanent phase once cumulative
  // partnership earnings cross totalCapital × returnThresholdMultiple.
  returnThresholdMultiple: number  // 2.0 = 200% (2.0x cumulative return)
  timeHorizonYears: number         // 20
  governance: PartnershipGovernance
  growthPhases: {
    phase2: PerDivisionGrowth      // Y6-10 strong moderated scaling
    phase3: PerDivisionGrowth      // Y11-15 mature national expansion
    phase4: PerDivisionGrowth      // Y16-20 stabilized tapered growth
  }
}

export interface FinancialModelOption {
  selectedOption: FinancialModelOptionKey
  percentageBack: PercentageBackOptionConfig
  partnership: PartnershipOptionConfig
}

export interface AllAssumptions {
  sales: SalesAssumptions
  upsell: UpsellRates
  serviceEconomics: ServiceEconomics
  realEstate: RealEstateAssumptions
  distributedSolar: DistributedSolarAssumptions
  housing: HousingAssumptions
  aerial: AerialAssumptions
  capital: CapitalAssumptions
  grants: GrantAssumptions
  directMailGrowth: DirectMailGrowth
  financialModelOption: FinancialModelOption
}

// ─── BASE CASE DEFAULTS (FROM MASTER SPREADSHEET) ───────────────────────────

export const BASE_ASSUMPTIONS: AllAssumptions = {
  sales: {
    // D2D Channel
    reps: 15,
    doorsPerRepPerDay: 30,
    workingDaysPerWeek: 5,
    d2dConversionRate: 0.015, // 1.5%
    d2dAnnualCostPerRep: 60000, // salary + overhead + commission base
    // Direct Mail Channel
    directMailPiecesPerMonth: 20000,
    directMailCostPerPiece: 1.07,
    directMailLeadConversion: 0.005, // 0.5%
    directMailLeadToJob: 0.55, // 55%
    // Commercial Paid Leads
    commercialAdSpendMonthly: 30000,
    commercialRoofingCPL: 500,
    commercialSolarCPL: 700,
    commercialLightingCPL: 500,
    commercialRoofingCloseRate: 0.15,
    commercialSolarCloseRate: 0.10,
    commercialLightingCloseRate: 0.10,
    // Energy Grants PPC
    grantsPPCSpendMonthly: 30000,
    hvacPPCDiversion: 0.40,
    insulationPPCDiversion: 0.30,
    waterHeaterPPCDiversion: 0.30,
    grantsPPCCostPerLead: 50, // ~$50-70 avg
    grantsPPCLeadConversion: 0.25,
  },

  upsell: {
    // From roofing base (D2D and direct mail)
    toHVAC: 0.07,
    toInsulation: 0.05,
    toWaterHeater: 0.04,
    toAirSealing: 0.03,
    toSolar: 0.04,
    toLED: 0.01,
    // From HVAC base (grants PPC)
    hvacToRoofing: 0.10,
    hvacToInsulation: 0.05,
    hvacToWaterHeater: 0.04,
    hvacToAirSealing: 0.03,
    hvacToSolar: 0.04,
    hvacToLED: 0.01,
  },

  serviceEconomics: {
    // Residential
    roofingRevenuePerJob: 18000,
    insulationRevenuePerJob: 12000,
    airSealingRevenuePerJob: 5000,
    hvacRevenuePerJob: 8000,
    waterHeaterRevenuePerJob: 6500,
    solarRevenuePerJob: 52000,
    ledLightingRevenuePerJob: 7000,
    roofingMargin: 0.45,
    insulationMargin: 0.43,
    airSealingMargin: 0.55,
    hvacMargin: 0.40,
    waterHeaterMargin: 0.52,
    solarMargin: 0.35,
    ledLightingMargin: 0.50,
    // Commercial
    commercialRoofingRevenuePerJob: 150000,
    commercialSolarRevenuePerJob: 180000,
    commercialLightingRevenuePerJob: 40000,
    commercialRoofingMargin: 0.46,
    commercialSolarMargin: 0.37,
    commercialLightingMargin: 0.52,
    adminOverheadRate: 0.12,
  },

  realEstate: {
    mailVolumePerMonth: 20000,
    responseRate: 0.01, // 1%
    leadRate: 0.40, // 40%
    closeRate: 0.45, // 45%
    averageParcelSize: 10,
    averageCostPerAcre: 10000,
    wholesaleAllocation: 0.65, // was 0.60, absorbed former 5% solar farm allocation
    housingSubdivideAllocation: 0.35,
    housingShareOfHousingSubdivide: 0.20,
    subdivisionShareOfHousingSubdivide: 0.80,
    averageAssignmentFee: 18000,
    avgResellPerAcre: 40000,
  },

  distributedSolar: {
    leadCost: 200,
    conversionRate: 0.08,
    srecsPerInstall: 12,
    srecValue: 400,
    installFee: 28000,
    installMargin: 0.32,
    monthlySpendY1: 50000,
    monthlySpendY2: 85000,
    monthlySpendY3: 120000,
    monthlySpendY4: 160000,
    monthlySpendY5: 200000,
    srecLifespan: 20,
    srecAdminRate: 0.15,
  },

  housing: {
    buildCostPerUnit: 200000,
    marketValuePerUnit: 360000,
    rentPerUnitMonthly: 2200,
    occupancyRate: 0.90,
    capRate: 0.06,
  },

  aerial: {
    startingUsers: 500,
    midTermUsers: 2500,
    longTermUsers: 25000,
    subscriptionMonthly: 1200,
    revenuePerUserMonthly: 700,
    customerAcquisitionCost: 200,
    costPerScan: 0.07,
    monthlyGrowthRate: 0.07,
    churnRate: 0.03,
    yearEndTargets: [1500, 5000, 10000, 15000, 20000],
    aerialMarketingMonthly: 30000,
  },

  capital: {
    totalCapitalRaise: 40000000,
    distributedSolar: 10000000,
    homeServices: 8475000,
    marketing: 5300000,
    aerialInsights: 1775000,
    wholesalePipeline: 3580000,
    lowIncomeHousing: 10070000,
    strategicPartnerships: 800000,
  },

  grants: {
    grantEligibilityRate: 0.60,
    grantCloseRateUplift: 0.15,
    avgGrantCoveragePercent: 0.30,
    reimbursementLagMonths: 3,
    rebateEligibilityRate: 0.60,
    avgResidentialRebatePerDeal: 3500,
    commercialRebateDealsPerYear: 4,
    avgCommercialRebatePerDeal: 375000,
  },

  directMailGrowth: {
    y1LettersPerMonth: 20000,
    y2LettersPerMonth: 27500,
    y3LettersPerMonth: 35000,
    y4LettersPerMonth: 42500,
    y5LettersPerMonth: 50000,
    costPerLetter: 1.50,
  },

  // Centralized return-structure config — drives both options.
  // Defaults preserve existing percentage-back behavior byte-for-byte.
  financialModelOption: {
    selectedOption: 'percentageBack',
    percentageBack: {
      homeServicesShare: 0.15,
      solarRealEstateShare: 0.20,
      aerialShare: 0.10,
      srecShare: 0.50,
      aerialResidualShare: 0.03,
      returnThresholdMultiple: 1.65,
      timeHorizonYears: 5,
    },
    partnership: {
      // Initial-phase shares — apply until threshold is reached.
      homeServicesShare: 0.12,
      realEstateShare: 0.18,
      aerialInsightsShare: 0.07,
      // Permanent-phase shares — apply once threshold target is reached.
      postThresholdHomeServicesShare: 0.07,
      postThresholdRealEstateShare: 0.07,
      postThresholdAerialInsightsShare: 0.03,
      // Threshold — 2.0x cumulative return on capital triggers step-down.
      returnThresholdMultiple: 2.0,
      timeHorizonYears: 20,
      governance: {
        role: 'Chairman of the Board',
        boardSeatsAppointed: 3,
      },
      // Per-division YoY growth rates by phase. Aerial (SaaS) tapers slower
      // than Home Services (regional saturation) and Solar/RE (deployment-bound).
      // At defaults, Y20 portfolio profit lands ~4-6x Y5 — credible and non-runaway.
      growthPhases: {
        phase2: { homeServices: 0.18, solarRealEstate: 0.22, aerial: 0.30 }, // Y6-10
        phase3: { homeServices: 0.10, solarRealEstate: 0.12, aerial: 0.15 }, // Y11-15
        phase4: { homeServices: 0.04, solarRealEstate: 0.05, aerial: 0.06 }, // Y16-20
      },
    },
  },
}
