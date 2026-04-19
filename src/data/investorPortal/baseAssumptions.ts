// ─── TYPE DEFINITIONS ────────────────────────────────────────────────────────
// All numbers sourced from master proposal spreadsheet

export interface SalesAssumptions {
  // Door-to-Door Channel
  reps: number
  doorsPerRepPerDay: number
  workingDaysPerWeek: number
  d2dConversionRate: number // 1.5% from doors to roofing jobs
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
  closeRate: number // 10%
  averageParcelSize: number // 10 acres
  averageCostPerAcre: number // $10,000
  wholesaleAllocation: number // 60%
  solarFarmAllocation: number // 5%
  housingSubdivideAllocation: number // 35%
  housingShareOfHousingSubdivide: number // 20%
  subdivisionShareOfHousingSubdivide: number // 80%
  averageAssignmentFee: number // $18,000
  avgResellPerAcre: number // $40,000
}

export interface SolarFarmAssumptions {
  acresPerMW: number // 5
  srecsPerMW: number // 1,200
  srecPriceDC: number // $375
  srecPriceMD: number // $50
  dcQualificationRate: number // 40%
  /** @deprecated Use annualSRECRevenuePerAcre instead */
  revenuePerAcre: number // $250,000 (legacy — kept for backward compat)
  annualSRECRevenuePerAcre: number // $150,000 (DC-area annual SREC revenue per acre)
  upfrontSRECValuePerAcre: number // $275,000 (one-time capitalized SREC value per acre)
  buildDelayMonths: number // 18
  avgLandCostPerAcre: number // $22,000
  avgSolarCostPerAcre: number // $450,000
}

export interface HousingAssumptions {
  buildCostPerUnit: number // $200,000
  marketValuePerUnit: number // $300,000
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
}

export interface CapitalAssumptions {
  totalCapitalRaise: number
  solarFarms: number
  lowIncomeHousing: number
  landAcquisitions: number
  holdTargetLandMarketing: number
  wholesaleLandMarketing: number
  wholesaleBuyerMarketing: number
  homeServiceOperations: number
  roofingDirectMail: number
  grantPPCCampaign: number
  commercialCampaign: number
  doorToDoorExpansion: number
  adminStaffExpansion: number
  aerialInsightsDVP: number
  aerialInsightsDATA: number
  aerialInsightsMRT: number
}

export interface GrantAssumptions {
  grantEligibilityRate: number
  grantCloseRateUplift: number
  avgGrantCoveragePercent: number
  reimbursementLagMonths: number
  rebateEligibilityRate: number
  avgRebateCoveragePercent: number
}

export interface DirectMailGrowth {
  y1LettersPerMonth: number
  y2LettersPerMonth: number
  y3LettersPerMonth: number
  y4LettersPerMonth: number
  y5LettersPerMonth: number
  costPerLetter: number
}

export interface AllAssumptions {
  sales: SalesAssumptions
  upsell: UpsellRates
  serviceEconomics: ServiceEconomics
  realEstate: RealEstateAssumptions
  solarFarm: SolarFarmAssumptions
  housing: HousingAssumptions
  aerial: AerialAssumptions
  capital: CapitalAssumptions
  grants: GrantAssumptions
  directMailGrowth: DirectMailGrowth
}

// ─── BASE CASE DEFAULTS (FROM MASTER SPREADSHEET) ───────────────────────────

export const BASE_ASSUMPTIONS: AllAssumptions = {
  sales: {
    // D2D Channel
    reps: 15,
    doorsPerRepPerDay: 30,
    workingDaysPerWeek: 5,
    d2dConversionRate: 0.015, // 1.5%
    // Direct Mail Channel
    directMailPiecesPerMonth: 20000,
    directMailCostPerPiece: 1.50,
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
    closeRate: 0.10, // 10%
    averageParcelSize: 10,
    averageCostPerAcre: 10000,
    wholesaleAllocation: 0.60,
    solarFarmAllocation: 0.05,
    housingSubdivideAllocation: 0.35,
    housingShareOfHousingSubdivide: 0.20,
    subdivisionShareOfHousingSubdivide: 0.80,
    averageAssignmentFee: 18000,
    avgResellPerAcre: 40000,
  },

  solarFarm: {
    acresPerMW: 5,
    srecsPerMW: 1200,
    srecPriceDC: 375,
    srecPriceMD: 50,
    dcQualificationRate: 0.40,
    revenuePerAcre: 250000,
    annualSRECRevenuePerAcre: 150000,
    upfrontSRECValuePerAcre: 275000,
    buildDelayMonths: 18,
    avgLandCostPerAcre: 22000,
    avgSolarCostPerAcre: 450000,
  },

  housing: {
    buildCostPerUnit: 200000,
    marketValuePerUnit: 300000,
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
    monthlyGrowthRate: 0.12,
    churnRate: 0.04,
  },

  capital: {
    totalCapitalRaise: 39975000,
    solarFarms: 18500000,
    lowIncomeHousing: 9000000,
    landAcquisitions: 3950000,
    holdTargetLandMarketing: 0,
    wholesaleLandMarketing: 0,
    wholesaleBuyerMarketing: 0,
    homeServiceOperations: 4950000,
    roofingDirectMail: 0,
    grantPPCCampaign: 0,
    commercialCampaign: 0,
    doorToDoorExpansion: 0,
    adminStaffExpansion: 0,
    aerialInsightsDVP: 875000,
    aerialInsightsDATA: 0,
    aerialInsightsMRT: 0,
  },

  grants: {
    grantEligibilityRate: 0.60,
    grantCloseRateUplift: 0.15,
    avgGrantCoveragePercent: 0.30,
    reimbursementLagMonths: 3,
    rebateEligibilityRate: 0.60,
    avgRebateCoveragePercent: 0.33,
  },

  directMailGrowth: {
    y1LettersPerMonth: 20000,
    y2LettersPerMonth: 27500,
    y3LettersPerMonth: 35000,
    y4LettersPerMonth: 42500,
    y5LettersPerMonth: 50000,
    costPerLetter: 1.50,
  },
}
