import type { AllAssumptions } from '../baseAssumptions'
import type { SolarOperationsOutput } from './types'
import { calcD2D, calcDirectMail } from './homeServices'

// Solar operations: residential solar from home services upsell + commercial from paid leads
// Residential: $52K/job, 35% margin
// Commercial: $180K/job, 37% margin
// LED: $7K/job, 50% margin

function solarGrowthMultiplier(year: number): number {
  const multipliers: Record<number, number> = { 1: 1, 2: 1.3, 3: 1.7, 4: 2.2, 5: 2.8 }
  return multipliers[year] ?? 1
}

export function calcSolarOperations(a: AllAssumptions, year: number): SolarOperationsOutput {
  const se = a.serviceEconomics
  const growth = solarGrowthMultiplier(year)

  // Residential solar installs come from D2D and direct mail roofing customer upsells at 4%
  const d2d = calcD2D(a, year)
  const dm = calcDirectMail(a, year)
  const totalRoofingCustomersMonthly = d2d.roofingJobsPerMonth + dm.roofingJobsPerMonth
  const residentialSolarMonthly = totalRoofingCustomersMonthly * 0.04 // 4% solar conversion
  const residentialInstalls = Math.round(residentialSolarMonthly * 12)

  const residentialRevenue = residentialInstalls * se.solarRevenuePerJob
  const residentialProfit = residentialRevenue * se.solarMargin

  // Commercial solar from paid leads channel (already calculated in homeServices commercial)
  // Here we track the standalone solar operations metrics
  const commercialInstalls = Math.round(3 * growth * 12) // ~3/month base scaling
  const commercialRevenue = commercialInstalls * se.commercialSolarRevenuePerJob
  const commercialProfit = commercialRevenue * se.commercialSolarMargin

  // LED lighting retrofits
  const ledInstalls = Math.round(2 * growth * 12) // ~2/month base scaling
  const lightingRevenue = ledInstalls * se.ledLightingRevenuePerJob
  const lightingProfit = lightingRevenue * se.ledLightingMargin

  const totalOperatingRevenue = residentialRevenue + commercialRevenue + lightingRevenue
  const totalProfit = residentialProfit + commercialProfit + lightingProfit
  const grossMarginPercent = totalOperatingRevenue > 0 ? totalProfit / totalOperatingRevenue : 0

  return {
    residentialInstalls,
    commercialInstalls,
    residentialRevenue,
    commercialRevenue,
    lightingRevenue,
    totalOperatingRevenue,
    totalProfit,
    grossMarginPercent,
  }
}
