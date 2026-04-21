import type { AllAssumptions } from '../baseAssumptions'
import type { AerialInsightsOutput } from './types'

// ─── AERIAL INSIGHTS ────────────────────────────────────────────────────────
// Target-based growth model with slider adjustment
// Base trajectory: 1,500 → 5,000 → 10,000 → 15,000 → 20,000 users (Y1-Y5)
// Sliders scale the trajectory proportionally via growth and starting-user factors

const BASE_NET_GROWTH = 0.04     // baseline net monthly growth (7% - 3%)
const BASE_STARTING_USERS = 500  // baseline starting users
const DEFAULT_TARGETS = [1500, 5000, 10000, 15000, 20000]

function getUsersByYear(a: AllAssumptions, year: number): number {
  const targets = a.aerial.yearEndTargets ?? DEFAULT_TARGETS
  const netGrowth = a.aerial.monthlyGrowthRate - a.aerial.churnRate

  // Growth factor: how the slider-adjusted net growth compares to baseline
  const growthFactor = BASE_NET_GROWTH > 0 ? netGrowth / BASE_NET_GROWTH : 1

  // Starting user factor: how the slider-adjusted starting users compare to baseline
  const startFactor = a.aerial.startingUsers / BASE_STARTING_USERS

  // Combined adjustment (dampened growth factor to prevent runaway)
  const adjustmentFactor = startFactor * Math.pow(Math.max(growthFactor, 0.1), 0.7)

  // Get the target for the requested year (clamp to array bounds)
  const yearIndex = Math.min(year - 1, targets.length - 1)
  const baseTarget = targets[Math.max(0, yearIndex)]

  // Apply adjustment (floor at zero, no artificial ceiling)
  const adjustedUsers = Math.round(baseTarget * adjustmentFactor)
  return Math.max(adjustedUsers, 0)
}

export function calcAerialInsights(a: AllAssumptions, year: number): AerialInsightsOutput {
  const ar = a.aerial
  const activeUsers = getUsersByYear(a, year)

  const subscriptionMRR = activeUsers * ar.subscriptionMonthly
  const totalMRR = subscriptionMRR
  const totalARR = totalMRR * 12
  const annualRevenue = totalARR

  const customerAcquisitionCost = activeUsers * ar.customerAcquisitionCost
  const scansPerUserPerMonth = 100
  const scanCostMonthly = activeUsers * scansPerUserPerMonth * ar.costPerScan

  return {
    activeUsers,
    subscriptionMRR,
    totalMRR,
    totalARR,
    annualRevenue,
    customerAcquisitionCost,
    scanCostMonthly,
  }
}
