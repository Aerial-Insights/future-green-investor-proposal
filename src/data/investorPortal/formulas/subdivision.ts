import type { AllAssumptions } from '../baseAssumptions'
import type { SubdivisionOutput } from './types'
import { calcOutreachFunnel } from './landAcquisition'

// ─── SUBDIVISION ────────────────────────────────────────────────────────────
// Fixed yearly subdivision goals: Y1: 20, Y2: 40, Y3: 60, Y4: 80, Y5: 100
// Avg acres/property: 10 | Lots created per subdivide: 5
// Default cost/acre: $15,000 | Default profit multiplier: 2.5x

const DEFAULT_ACRES_PER_PROPERTY = 10
const DEFAULT_LOTS_PER_SUBDIVIDE = 5
const DEFAULT_COST_PER_ACRE = 15000
const DEFAULT_PROFIT_MULTIPLIER = 2.5

function subdivisionGoalByYear(year: number): number {
  const goals: Record<number, number> = { 1: 20, 2: 40, 3: 60, 4: 80, 5: 100 }
  return goals[year] ?? 0
}

export function calcSubdivision(
  a: AllAssumptions,
  year: number,
  costPerAcreOverride?: number,
  profitMultiplierOverride?: number,
): SubdivisionOutput {
  const funnel = calcOutreachFunnel(a, year)

  const costPerAcre = costPerAcreOverride ?? DEFAULT_COST_PER_ACRE
  const profitMultiplier = profitMultiplierOverride ?? DEFAULT_PROFIT_MULTIPLIER

  // Fixed yearly subdivision targets
  const subdivides = subdivisionGoalByYear(year)

  // Each subdivide = 1 property acquired
  const propertiesAcquired = subdivides

  // Acreage
  const acres = propertiesAcquired * DEFAULT_ACRES_PER_PROPERTY

  // Lots created
  const totalLots = subdivides * DEFAULT_LOTS_PER_SUBDIVIDE

  // Economics
  const totalAcquisitionCost = acres * costPerAcre
  const resaleRevenue = totalAcquisitionCost * profitMultiplier
  const profit = resaleRevenue - totalAcquisitionCost
  const profitPerSubdivide = subdivides > 0 ? profit / subdivides : 0

  // Legacy fields kept for backward compat with portfolio.ts and other consumers
  const lettersSentMonthly = funnel.monthlyLetters
  const lettersSentAnnually = lettersSentMonthly * 12
  const dealsPerMonth = funnel.monthlyAcquisitions
  const dealsPerYear = funnel.annualAcquisitions

  return {
    subdivides,
    propertiesAcquired,
    acres,
    totalLots,
    avgAcresPerProperty: DEFAULT_ACRES_PER_PROPERTY,
    subdivisionCountPerProperty: DEFAULT_LOTS_PER_SUBDIVIDE,
    acquisitionCostPerAcre: costPerAcre,
    profitMultiplier,
    totalAcquisitionCost,
    resaleRevenue,
    profit,
    profitPerSubdivide,
    // Legacy compat
    deals: subdivides,
    lettersSentMonthly,
    lettersSentAnnually,
    dealsPerMonth,
    dealsPerYear,
    subdivisionEligibleDeals: subdivides,
  }
}
