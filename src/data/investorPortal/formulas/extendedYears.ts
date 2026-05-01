import type { YearlyOutputs, ExtendedYearOutput } from './types'
import type { PartnershipOptionConfig } from '../baseAssumptions'

// ─── EXTENDED YEARS — PARTNERSHIP 20-YEAR PROJECTION ───────────────────────
// Years 1-5 copy from the full calculation model.
// Years 6+ extrapolate per-division profit forward using growth-phase rates.
// Phases: 2 = Y6-10, 3 = Y11-15, 4 = Y16-20.
//
// We extrapolate at the per-division-profit level (not full sub-channel detail)
// because the Partnership view only needs portfolio-level numbers per year.
// Building full YearlyOutputs for Y6-20 would require simulating sub-channel
// dynamics that don't materially change the investor narrative.

export interface ExtendedYearsConfig {
  baseYears: YearlyOutputs[]                       // length >= 5 from calcAllYears
  totalYears: number                               // 20 by default
  growthPhases: PartnershipOptionConfig['growthPhases']
  phaseBoundaries?: { phase2End: number; phase3End: number }  // defaults {10, 15}
}

function phaseForYear(year: number, boundaries: { phase2End: number; phase3End: number }): 1 | 2 | 3 | 4 {
  if (year <= 5) return 1
  if (year <= boundaries.phase2End) return 2
  if (year <= boundaries.phase3End) return 3
  return 4
}

export function calcExtendedYears(config: ExtendedYearsConfig): ExtendedYearOutput[] {
  const { baseYears, totalYears, growthPhases } = config
  const boundaries = config.phaseBoundaries ?? { phase2End: 10, phase3End: 15 }

  const result: ExtendedYearOutput[] = []

  for (let y = 1; y <= totalYears; y++) {
    const phase = phaseForYear(y, boundaries)

    if (phase === 1 && baseYears[y - 1]) {
      // Pull directly from the full model
      const yearly = baseYears[y - 1]
      const p = yearly.portfolio
      const combined = p.solarOperationsProfit + p.realEstateProfit
      result.push({
        year: y,
        phase: 1,
        isExtrapolated: false,
        homeServicesProfit: p.homeServicesProfit,
        solarOperationsProfit: p.solarOperationsProfit,
        realEstateProfit: p.realEstateProfit,
        combinedSolarRealEstateProfit: combined,
        aerialProfit: p.aerialProfit,
        aerialAnnualRevenue: yearly.aerial.annualRevenue,
        totalProfit: p.totalProfit,
      })
    } else {
      // Extrapolate from prior year using phase-specific growth rates
      const prev = result[result.length - 1]
      const phaseKey = phase === 2 ? 'phase2' : phase === 3 ? 'phase3' : 'phase4'
      const rates = growthPhases[phaseKey]

      const homeServicesProfit = prev.homeServicesProfit * (1 + rates.homeServices)
      // Apply combined solar+RE growth proportionally to both sub-streams to
      // preserve their existing ratio in the visualization
      const solarOperationsProfit = prev.solarOperationsProfit * (1 + rates.solarRealEstate)
      const realEstateProfit = prev.realEstateProfit * (1 + rates.solarRealEstate)
      const aerialProfit = prev.aerialProfit * (1 + rates.aerial)
      const aerialAnnualRevenue = prev.aerialAnnualRevenue * (1 + rates.aerial)
      const combined = solarOperationsProfit + realEstateProfit
      const totalProfit = homeServicesProfit + combined + aerialProfit

      result.push({
        year: y,
        phase,
        isExtrapolated: true,
        homeServicesProfit,
        solarOperationsProfit,
        realEstateProfit,
        combinedSolarRealEstateProfit: combined,
        aerialProfit,
        aerialAnnualRevenue,
        totalProfit,
      })
    }
  }

  return result
}
