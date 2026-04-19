import type { AllAssumptions } from '../baseAssumptions'
import type { AerialInsightsOutput } from './types'

// ─── AERIAL INSIGHTS ────────────────────────────────────────────────────────
// $1,200/month subscription — single product, single revenue stream
// 500 starting users -> 2,500 mid-term -> 25,000 long-term
// CAC: $200, cost per scan: $0.07

function getUsersByYear(a: AllAssumptions, year: number): number {
  const netGrowthRate = a.aerial.monthlyGrowthRate - a.aerial.churnRate
  const monthsElapsed = year * 12
  const rawUsers = a.aerial.startingUsers * Math.pow(1 + netGrowthRate, monthsElapsed)
  return Math.min(Math.round(rawUsers), a.aerial.longTermUsers)
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
