import type { AllAssumptions } from '../baseAssumptions'
import type {
  D2DChannelOutput,
  DirectMailChannelOutput,
  CommercialPaidLeadsOutput,
  EnergyGrantsPPCOutput,
  UpsellBreakdown,
  GrantOutput,
  HomeServicesFullOutput,
} from './types'

// ─── GROWTH MULTIPLIERS ─────────────────────────────────────────────────────
// Year 1 = baseline, scaling reps/channels over 5 years

function repGrowthMultiplier(year: number): number {
  const multipliers: Record<number, number> = { 1: 1, 2: 1.3, 3: 1.7, 4: 2.2, 5: 2.8 }
  return multipliers[year] ?? 1
}

function mailGrowthMultiplier(year: number): number {
  const multipliers: Record<number, number> = { 1: 1, 2: 1.3, 3: 1.6, 4: 2.0, 5: 2.5 }
  return multipliers[year] ?? 1
}

function commercialGrowthMultiplier(year: number): number {
  const multipliers: Record<number, number> = { 1: 1, 2: 1.4, 3: 1.9, 4: 2.5, 5: 3.2 }
  return multipliers[year] ?? 1
}

function ppcGrowthMultiplier(year: number): number {
  const multipliers: Record<number, number> = { 1: 1, 2: 1.3, 3: 1.7, 4: 2.2, 5: 2.8 }
  return multipliers[year] ?? 1
}

// ─── PROFIT HELPERS ─────────────────────────────────────────────────────────

function profitPerJob(revenuePerJob: number, margin: number): number {
  return revenuePerJob * margin
}

function rebateAdjustedProfit(
  revenuePerJob: number,
  baseMargin: number,
  rebateEligRate: number,
  avgRebatePerDeal: number
): number {
  const baseProfit = revenuePerJob * baseMargin
  const rebateOffset = rebateEligRate * avgRebatePerDeal
  return baseProfit + rebateOffset
}

// ─── UPSELLS FROM ROOFING BASE ──────────────────────────────────────────────
// Given a base number of roofing jobs, calculate upsell profits

function calcRoofingUpsells(roofingJobs: number, a: AllAssumptions): UpsellBreakdown {
  const se = a.serviceEconomics
  const u = a.upsell
  const g = a.grants

  const hvacJobs = roofingJobs * u.toHVAC
  const insulationJobs = roofingJobs * u.toInsulation
  const waterHeaterJobs = roofingJobs * u.toWaterHeater
  const airSealingJobs = roofingJobs * u.toAirSealing
  const solarJobs = roofingJobs * u.toSolar
  const ledJobs = roofingJobs * u.toLED

  const hvacProfit = hvacJobs * rebateAdjustedProfit(se.hvacRevenuePerJob, se.hvacMargin, g.rebateEligibilityRate, g.avgResidentialRebatePerDeal)
  const insulationProfit = insulationJobs * rebateAdjustedProfit(se.insulationRevenuePerJob, se.insulationMargin, g.rebateEligibilityRate, g.avgResidentialRebatePerDeal)
  const waterHeaterProfit = waterHeaterJobs * rebateAdjustedProfit(se.waterHeaterRevenuePerJob, se.waterHeaterMargin, g.rebateEligibilityRate, g.avgResidentialRebatePerDeal)
  const airSealingProfit = airSealingJobs * rebateAdjustedProfit(se.airSealingRevenuePerJob, se.airSealingMargin, g.rebateEligibilityRate, g.avgResidentialRebatePerDeal)
  const solarProfit = solarJobs * profitPerJob(se.solarRevenuePerJob, se.solarMargin)
  const ledProfit = ledJobs * profitPerJob(se.ledLightingRevenuePerJob, se.ledLightingMargin)

  const totalRevenue = (hvacJobs * se.hvacRevenuePerJob) + (insulationJobs * se.insulationRevenuePerJob) +
    (waterHeaterJobs * se.waterHeaterRevenuePerJob) + (airSealingJobs * se.airSealingRevenuePerJob) +
    (solarJobs * se.solarRevenuePerJob) + (ledJobs * se.ledLightingRevenuePerJob)

  return {
    hvacProfit,
    insulationProfit,
    waterHeaterProfit,
    airSealingProfit,
    solarProfit,
    ledProfit,
    totalProfit: hvacProfit + insulationProfit + waterHeaterProfit + airSealingProfit + solarProfit + ledProfit,
    totalRevenue,
  }
}

// Upsells from HVAC base (used in energy grants PPC)
function calcHVACUpsells(hvacJobs: number, a: AllAssumptions): UpsellBreakdown {
  const se = a.serviceEconomics
  const u = a.upsell
  const g = a.grants

  const roofingJobs = hvacJobs * u.hvacToRoofing
  const insulationJobs = hvacJobs * u.hvacToInsulation
  const waterHeaterJobs = hvacJobs * u.hvacToWaterHeater
  const airSealingJobs = hvacJobs * u.hvacToAirSealing
  const solarJobs = hvacJobs * u.hvacToSolar
  const ledJobs = hvacJobs * u.hvacToLED

  // "hvacProfit" here is really roofing-from-hvac upsell (not rebate-eligible)
  const hvacProfit = roofingJobs * profitPerJob(se.roofingRevenuePerJob, se.roofingMargin)
  const insulationProfit = insulationJobs * rebateAdjustedProfit(se.insulationRevenuePerJob, se.insulationMargin, g.rebateEligibilityRate, g.avgResidentialRebatePerDeal)
  const waterHeaterProfit = waterHeaterJobs * rebateAdjustedProfit(se.waterHeaterRevenuePerJob, se.waterHeaterMargin, g.rebateEligibilityRate, g.avgResidentialRebatePerDeal)
  const airSealingProfit = airSealingJobs * rebateAdjustedProfit(se.airSealingRevenuePerJob, se.airSealingMargin, g.rebateEligibilityRate, g.avgResidentialRebatePerDeal)
  const solarProfit = solarJobs * profitPerJob(se.solarRevenuePerJob, se.solarMargin)
  const ledProfit = ledJobs * profitPerJob(se.ledLightingRevenuePerJob, se.ledLightingMargin)

  const totalRevenue = (roofingJobs * se.roofingRevenuePerJob) + (insulationJobs * se.insulationRevenuePerJob) +
    (waterHeaterJobs * se.waterHeaterRevenuePerJob) + (airSealingJobs * se.airSealingRevenuePerJob) +
    (solarJobs * se.solarRevenuePerJob) + (ledJobs * se.ledLightingRevenuePerJob)

  return {
    hvacProfit,
    insulationProfit,
    waterHeaterProfit,
    airSealingProfit,
    solarProfit,
    ledProfit,
    totalProfit: hvacProfit + insulationProfit + waterHeaterProfit + airSealingProfit + solarProfit + ledProfit,
    totalRevenue,
  }
}

// Upsells from insulation/water heater base jobs (energy grants PPC sub-channels)
function calcInsulationUpsells(insulationBaseJobs: number, a: AllAssumptions): number {
  const se = a.serviceEconomics
  const u = a.upsell
  const g = a.grants
  const hvac = insulationBaseJobs * u.hvacToRoofing * rebateAdjustedProfit(se.hvacRevenuePerJob, se.hvacMargin, g.rebateEligibilityRate, g.avgResidentialRebatePerDeal)
  const waterHeater = insulationBaseJobs * u.hvacToWaterHeater * rebateAdjustedProfit(se.waterHeaterRevenuePerJob, se.waterHeaterMargin, g.rebateEligibilityRate, g.avgResidentialRebatePerDeal)
  const airSealing = insulationBaseJobs * u.hvacToAirSealing * rebateAdjustedProfit(se.airSealingRevenuePerJob, se.airSealingMargin, g.rebateEligibilityRate, g.avgResidentialRebatePerDeal)
  return hvac + waterHeater + airSealing
}

function calcWaterHeaterUpsells(whBaseJobs: number, a: AllAssumptions): number {
  const se = a.serviceEconomics
  const u = a.upsell
  const g = a.grants
  const hvac = whBaseJobs * u.hvacToRoofing * rebateAdjustedProfit(se.hvacRevenuePerJob, se.hvacMargin, g.rebateEligibilityRate, g.avgResidentialRebatePerDeal)
  const insulation = whBaseJobs * u.hvacToInsulation * rebateAdjustedProfit(se.insulationRevenuePerJob, se.insulationMargin, g.rebateEligibilityRate, g.avgResidentialRebatePerDeal)
  const airSealing = whBaseJobs * u.hvacToAirSealing * rebateAdjustedProfit(se.airSealingRevenuePerJob, se.airSealingMargin, g.rebateEligibilityRate, g.avgResidentialRebatePerDeal)
  return hvac + insulation + airSealing
}

// ─── CHANNEL 1: DOOR-TO-DOOR ────────────────────────────────────────────────

export function calcD2D(a: AllAssumptions, year: number): D2DChannelOutput {
  const s = a.sales
  const se = a.serviceEconomics
  const reps = Math.round(s.reps * repGrowthMultiplier(year))
  const weeksPerMonth = (s.workingDaysPerWeek * 52) / 12 / s.workingDaysPerWeek // ~4.33

  const doorsPerWeek = reps * s.doorsPerRepPerDay * s.workingDaysPerWeek
  const doorsPerMonth = doorsPerWeek * weeksPerMonth
  const roofingJobsPerMonth = doorsPerMonth * s.d2dConversionRate

  const roofingProfitPerJob = profitPerJob(se.roofingRevenuePerJob, se.roofingMargin)
  const roofingProfitMonthly = roofingJobsPerMonth * roofingProfitPerJob

  const upsells = calcRoofingUpsells(roofingJobsPerMonth, a)
  const upsellProfitMonthly = upsells.totalProfit

  const totalProfitMonthly = roofingProfitMonthly + upsellProfitMonthly
  const totalProfitAnnual = totalProfitMonthly * 12

  const totalCostAnnual = reps * s.d2dAnnualCostPerRep
  const roofingRevenueMonthly = roofingJobsPerMonth * se.roofingRevenuePerJob
  const totalRevenueAnnual = (roofingRevenueMonthly + upsells.totalRevenue) * 12

  return {
    reps,
    doorsPerWeek,
    doorsPerMonth,
    roofingJobsPerMonth,
    roofingProfitMonthly,
    upsellProfitMonthly,
    totalProfitMonthly,
    totalProfitAnnual,
    totalCostAnnual,
    totalRevenueAnnual,
  }
}

// ─── CHANNEL 2: DIRECT MAIL ────────────────────────────────────────────────

export function calcDirectMail(a: AllAssumptions, year: number): DirectMailChannelOutput {
  const s = a.sales
  const se = a.serviceEconomics

  const piecesPerMonth = s.directMailPiecesPerMonth * mailGrowthMultiplier(year)
  const costPerMonth = piecesPerMonth * s.directMailCostPerPiece
  const leadsPerMonth = piecesPerMonth * s.directMailLeadConversion
  const roofingJobsPerMonth = leadsPerMonth * s.directMailLeadToJob

  const roofingProfitPerJob = profitPerJob(se.roofingRevenuePerJob, se.roofingMargin)
  const roofingProfitMonthly = roofingJobsPerMonth * roofingProfitPerJob

  const upsells = calcRoofingUpsells(roofingJobsPerMonth, a)
  const upsellProfitMonthly = upsells.totalProfit

  const totalProfitMonthly = roofingProfitMonthly + upsellProfitMonthly
  const totalProfitAnnual = totalProfitMonthly * 12

  const totalCostAnnual = costPerMonth * 12
  const roofingRevenueMonthly = roofingJobsPerMonth * se.roofingRevenuePerJob
  const totalRevenueAnnual = (roofingRevenueMonthly + upsells.totalRevenue) * 12

  return {
    piecesPerMonth,
    costPerMonth,
    leadsPerMonth,
    roofingJobsPerMonth,
    roofingProfitMonthly,
    upsellProfitMonthly,
    totalProfitMonthly,
    totalProfitAnnual,
    totalCostAnnual,
    totalRevenueAnnual,
  }
}

// ─── CHANNEL 3: COMMERCIAL PAID LEADS ───────────────────────────────────────

export function calcCommercialPaidLeads(a: AllAssumptions, year: number): CommercialPaidLeadsOutput {
  const s = a.sales
  const se = a.serviceEconomics
  const growth = commercialGrowthMultiplier(year)

  const adSpendMonthly = s.commercialAdSpendMonthly * growth

  // Leads from ad spend split roughly 40% roofing, 30% solar, 30% lighting
  const roofingLeads = (adSpendMonthly * 0.40) / s.commercialRoofingCPL
  const solarLeads = (adSpendMonthly * 0.30) / s.commercialSolarCPL
  const lightingLeads = (adSpendMonthly * 0.30) / s.commercialLightingCPL

  const roofingJobs = roofingLeads * s.commercialRoofingCloseRate
  const solarJobs = solarLeads * s.commercialSolarCloseRate
  const lightingJobs = lightingLeads * s.commercialLightingCloseRate

  const roofingProfit = roofingJobs * profitPerJob(se.commercialRoofingRevenuePerJob, se.commercialRoofingMargin)
  const solarProfit = solarJobs * profitPerJob(se.commercialSolarRevenuePerJob, se.commercialSolarMargin)
  const lightingProfit = lightingJobs * profitPerJob(se.commercialLightingRevenuePerJob, se.commercialLightingMargin)

  const totalProfitMonthly = roofingProfit + solarProfit + lightingProfit
  const totalProfitAnnual = totalProfitMonthly * 12

  const totalCostAnnual = adSpendMonthly * 12
  const totalRevenueAnnual = (roofingJobs * se.commercialRoofingRevenuePerJob +
    solarJobs * se.commercialSolarRevenuePerJob +
    lightingJobs * se.commercialLightingRevenuePerJob) * 12

  return {
    adSpendMonthly,
    roofingJobs,
    solarJobs,
    lightingJobs,
    roofingProfit,
    solarProfit,
    lightingProfit,
    totalProfitMonthly,
    totalProfitAnnual,
    totalCostAnnual,
    totalRevenueAnnual,
  }
}

// ─── CHANNEL 4: ENERGY GRANTS PPC ──────────────────────────────────────────

export function calcEnergyGrantsPPC(a: AllAssumptions, year: number): EnergyGrantsPPCOutput {
  const s = a.sales
  const se = a.serviceEconomics
  const growth = ppcGrowthMultiplier(year)

  const adSpendMonthly = s.grantsPPCSpendMonthly * growth

  const g = a.grants

  // HVAC channel: 40% of spend
  const hvacSpend = adSpendMonthly * s.hvacPPCDiversion
  const hvacCPL = s.grantsPPCCostPerLead // $50
  const hvacLeads = hvacSpend / hvacCPL
  const hvacJobs = hvacLeads * s.grantsPPCLeadConversion
  const hvacProfit = hvacJobs * rebateAdjustedProfit(se.hvacRevenuePerJob, se.hvacMargin, g.rebateEligibilityRate, g.avgResidentialRebatePerDeal)

  // Insulation channel: 30% of spend
  const insulationSpend = adSpendMonthly * s.insulationPPCDiversion
  const insulationCPL = 70 // $70 CPL for insulation leads
  const insulationLeads = insulationSpend / insulationCPL
  const insulationJobs = insulationLeads * s.grantsPPCLeadConversion
  const insulationProfit = insulationJobs * rebateAdjustedProfit(se.insulationRevenuePerJob, se.insulationMargin, g.rebateEligibilityRate, g.avgResidentialRebatePerDeal)

  // Water heater channel: 30% of spend
  const waterHeaterSpend = adSpendMonthly * s.waterHeaterPPCDiversion
  const waterHeaterCPL = s.grantsPPCCostPerLead // $50
  const waterHeaterLeads = waterHeaterSpend / waterHeaterCPL
  const waterHeaterJobs = waterHeaterLeads * s.grantsPPCLeadConversion
  const waterHeaterProfit = waterHeaterJobs * rebateAdjustedProfit(se.waterHeaterRevenuePerJob, se.waterHeaterMargin, g.rebateEligibilityRate, g.avgResidentialRebatePerDeal)

  const baseProfitMonthly = hvacProfit + insulationProfit + waterHeaterProfit

  // Upsells from each base service
  const hvacUpsells = calcHVACUpsells(hvacJobs, a)
  const insulationUpsells = calcInsulationUpsells(insulationJobs, a)
  const waterHeaterUpsells = calcWaterHeaterUpsells(waterHeaterJobs, a)
  const upsellProfitMonthly = hvacUpsells.totalProfit + insulationUpsells + waterHeaterUpsells

  const totalProfitMonthly = baseProfitMonthly + upsellProfitMonthly
  const totalProfitAnnual = totalProfitMonthly * 12

  const totalCostAnnual = adSpendMonthly * 12
  const baseRevenueMonthly = (hvacJobs * se.hvacRevenuePerJob) + (insulationJobs * se.insulationRevenuePerJob) +
    (waterHeaterJobs * se.waterHeaterRevenuePerJob)
  const totalRevenueAnnual = (baseRevenueMonthly + hvacUpsells.totalRevenue) * 12

  return {
    adSpendMonthly,
    hvacJobs,
    insulationJobs,
    waterHeaterJobs,
    hvacProfit,
    insulationProfit,
    waterHeaterProfit,
    baseProfitMonthly,
    upsellProfitMonthly,
    totalProfitMonthly,
    totalProfitAnnual,
    totalCostAnnual,
    totalRevenueAnnual,
  }
}

// ─── GRANT IMPACT ───────────────────────────────────────────────────────────

export function calcGrantImpact(a: AllAssumptions, year: number): GrantOutput {
  // Grants apply mainly to energy-efficiency services (insulation, air sealing, HVAC)
  const grants = calcEnergyGrantsPPC(a, year)
  const totalEnergyJobs = grants.hvacJobs + grants.insulationJobs + grants.waterHeaterJobs
  const grantSupportedDeals = totalEnergyJobs * a.grants.grantEligibilityRate * 12
  const effectiveCloseRate = a.sales.grantsPPCLeadConversion * (1 + a.grants.grantCloseRateUplift)

  const avgJobRevenue = (a.serviceEconomics.hvacRevenuePerJob + a.serviceEconomics.insulationRevenuePerJob + a.serviceEconomics.waterHeaterRevenuePerJob) / 3
  const estimatedReimbursement = grantSupportedDeals * a.grants.avgGrantCoveragePercent * avgJobRevenue

  // Rebate impact calculations
  const se = a.serviceEconomics
  const g = a.grants
  const rebateEligibleDeals = totalEnergyJobs * g.rebateEligibilityRate * 12

  // Residential rebate offset: flat per-deal model based on real-world avg of $3,500/deal
  const estimatedRebateOffset = rebateEligibleDeals * g.avgResidentialRebatePerDeal

  // Commercial rebate offset: large commercial projects (e.g. $1.2M, $300K proven examples)
  const commercialGrowth = commercialGrowthMultiplier(year)
  const commercialRebateDeals = Math.round(g.commercialRebateDealsPerYear * commercialGrowth)
  const estimatedCommercialRebateOffset = commercialRebateDeals * g.avgCommercialRebatePerDeal
  const totalRebateOffset = estimatedRebateOffset + estimatedCommercialRebateOffset

  // Profit multiplier: ratio of rebate-adjusted profit to base profit for energy services
  const baseProfit = totalEnergyJobs * (
    profitPerJob(se.hvacRevenuePerJob, se.hvacMargin) +
    profitPerJob(se.insulationRevenuePerJob, se.insulationMargin) +
    profitPerJob(se.waterHeaterRevenuePerJob, se.waterHeaterMargin)
  ) / 3
  const adjustedProfit = totalEnergyJobs * (
    rebateAdjustedProfit(se.hvacRevenuePerJob, se.hvacMargin, g.rebateEligibilityRate, g.avgResidentialRebatePerDeal) +
    rebateAdjustedProfit(se.insulationRevenuePerJob, se.insulationMargin, g.rebateEligibilityRate, g.avgResidentialRebatePerDeal) +
    rebateAdjustedProfit(se.waterHeaterRevenuePerJob, se.waterHeaterMargin, g.rebateEligibilityRate, g.avgResidentialRebatePerDeal)
  ) / 3
  const profitMultiplier = baseProfit > 0 ? adjustedProfit / baseProfit : 1

  return { grantSupportedDeals, effectiveCloseRate, estimatedReimbursement, rebateEligibleDeals, estimatedRebateOffset, commercialRebateDeals, estimatedCommercialRebateOffset, totalRebateOffset, profitMultiplier }
}

// ─── COMBINED HOME SERVICES ─────────────────────────────────────────────────

export function calcHomeServicesAll(a: AllAssumptions, year: number): HomeServicesFullOutput {
  const d2d = calcD2D(a, year)
  const directMail = calcDirectMail(a, year)
  const commercial = calcCommercialPaidLeads(a, year)
  const energyGrants = calcEnergyGrantsPPC(a, year)
  const grants = calcGrantImpact(a, year)

  const totalProfitMonthly = d2d.totalProfitMonthly + directMail.totalProfitMonthly +
    commercial.totalProfitMonthly + energyGrants.totalProfitMonthly
  const totalProfitAnnual = totalProfitMonthly * 12

  return {
    d2d,
    directMail,
    commercial,
    energyGrants,
    grants,
    totalProfitMonthly,
    totalProfitAnnual,
  }
}
