import type { AllAssumptions } from '../baseAssumptions'
import type { SolarFarmOutput } from './types'

// ─── SOLAR FARM GOALS BY YEAR ───────────────────────────────────────────────
// Y1: 5 acres, Y2: 15, Y3: 30, Y4: 60, Y5: 120

function acresGoalByYear(year: number): number {
  const goals: Record<number, number> = { 1: 5, 2: 15, 3: 30, 4: 60, 5: 120 }
  return goals[year] ?? 0
}

// ─── SREC REVENUE CALCULATION ───────────────────────────────────────────────
// 5 acres/MW, 1,200 SRECs/MW
// SREC pricing: DC = $375, MD = $50, DC qualification = 40%
// Annual SREC revenue per acre = $150,000 (base case)
// Upfront SREC value per acre = $275,000 (one-time capitalized equivalent)

export function calcSolarFarm(a: AllAssumptions, year: number): SolarFarmOutput {
  const sf = a.solarFarm
  const acresGoal = acresGoalByYear(year)

  // MW capacity from new acres this year
  const totalMW = acresGoal / sf.acresPerMW

  // SREC revenue for this year's new capacity
  // Weighted average SREC price: 40% DC @ $375 + 60% MD @ $50
  const weightedSRECPrice = (sf.dcQualificationRate * sf.srecPriceDC) +
    ((1 - sf.dcQualificationRate) * sf.srecPriceMD)
  const srecsGenerated = totalMW * sf.srecsPerMW
  const srecRevenue = acresGoal * sf.annualSRECRevenuePerAcre

  // Investment required
  const landCost = acresGoal * sf.avgLandCostPerAcre
  const solarCost = acresGoal * sf.avgSolarCostPerAcre
  const totalInvestment = landCost + solarCost

  // Active acres considers 18-month build delay
  const activeAcres = calcCumulativeActiveAcres(year)

  // Cumulative annual SREC revenue from all active acres
  const cumulativeSRECRevenue = activeAcres * sf.annualSRECRevenuePerAcre

  // Annual SREC revenue and upfront SREC value (two distinct views)
  const annualSRECRevenue = activeAcres * sf.annualSRECRevenuePerAcre
  const upfrontSRECValue = activeAcres * sf.upfrontSRECValuePerAcre

  // Energy revenue: MWh generated × energy price ($55/MWh)
  const activeMW = activeAcres / sf.acresPerMW
  const annualMWh = activeMW * 1500 // 1,500 MWh per MW
  const energyRevenue = annualMWh * 55 // $55/MWh

  // SREC profit: active SRECs × weighted SREC price
  const activeSRECs = activeMW * sf.srecsPerMW
  const srecProfit = activeSRECs * weightedSRECPrice

  // Total profit: energy revenue + SREC profit (operating margin ~60%)
  const totalProfit = (energyRevenue + srecProfit) * 0.60

  return {
    acresGoal,
    totalMW,
    srecRevenue,
    totalInvestment,
    activeAcres,
    cumulativeSRECRevenue,
    energyRevenue,
    srecProfit,
    totalProfit,
    annualSRECRevenuePerAcre: sf.annualSRECRevenuePerAcre,
    upfrontSRECValuePerAcre: sf.upfrontSRECValuePerAcre,
    annualSRECRevenue,
    upfrontSRECValue,
  }
}

// Active acres: acres from prior periods that have completed 18-month build delay
function calcCumulativeActiveAcres(currentYear: number): number {
  let active = 0
  // 18-month delay = ~1.5 years. Year N acres come online midway through Year N+2
  // Simplified: acres from year Y are active starting in year Y+2
  for (let y = 1; y <= currentYear; y++) {
    if (y + 2 <= currentYear) {
      active += acresGoalByYear(y)
    } else if (y + 1 <= currentYear) {
      // Partial credit: 50% of acres from Y-1 (mid-build)
      active += acresGoalByYear(y) * 0.5
    }
  }
  return active
}

export function calcSolarFarmRevenue(a: AllAssumptions, year: number): number {
  const farm = calcSolarFarm(a, year)
  return farm.cumulativeSRECRevenue
}
