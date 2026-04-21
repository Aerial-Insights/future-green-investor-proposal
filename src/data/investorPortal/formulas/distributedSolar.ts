import type { AllAssumptions } from '../baseAssumptions'
import type { DistributedSolarOutput } from './types'

// ─── DISTRIBUTED SOLAR PORTFOLIO MODEL (MONTHLY RAMP) ─────────────────────
// Marketing-driven distributed solar: residential, commercial, institutional,
// and community solar participation.
//
// Funnel: Monthly Marketing Spend → Leads → Installs → Two Revenue Streams
//
// Revenue Stream 1: INSTALL REVENUE (job fee from performing the installation)
//   - Blended install fee: $28,000 per job
//   - Gross margin: 32%
//   - This revenue COUNTS toward investor payback threshold
//
// Revenue Stream 2: SREC REVENUE (recurring credits from installed systems)
//   - 12 SRECs/install/year × $400/credit = $4,800/year per install
//   - Cumulative: all prior cohorts keep producing
//   - This revenue does NOT count toward threshold
//   - Investor receives 50% of SREC revenue independently
//
// Monthly spend ramps over 5 years:
//   Y1: $50K/mo → Y2: $85K/mo → Y3: $120K/mo → Y4: $160K/mo → Y5: $200K/mo
//
// Assumptions (base case):
//   Lead cost:         $200 (blended qualified solar lead)
//   Conversion rate:   8% (industry range 5-12% for qualified leads)
//   Install fee:       $28,000 (blended residential/commercial)
//   Install margin:    32% gross margin

// ─── MONTHLY SPEND BY YEAR ─────────────────────────────────────────────────

function getMonthlySpend(a: AllAssumptions, year: number): number {
  const ds = a.distributedSolar
  const spends: Record<number, number> = {
    1: ds.monthlySpendY1,
    2: ds.monthlySpendY2,
    3: ds.monthlySpendY3,
    4: ds.monthlySpendY4,
    5: ds.monthlySpendY5,
  }
  return spends[year] ?? ds.monthlySpendY5
}

// ─── INSTALLS FOR A SINGLE YEAR ────────────────────────────────────────────

function installsForYear(a: AllAssumptions, year: number): number {
  const ds = a.distributedSolar
  const monthlySpend = getMonthlySpend(a, year)
  const leadsPerMonth = monthlySpend / ds.leadCost
  const installsPerMonth = Math.floor(leadsPerMonth * ds.conversionRate)
  return installsPerMonth * 12
}

// ─── CUMULATIVE INSTALLS THROUGH A GIVEN YEAR ──────────────────────────────

function cumulativeInstallsThrough(a: AllAssumptions, year: number): number {
  let total = 0
  for (let y = 1; y <= year; y++) {
    total += installsForYear(a, y)
  }
  return total
}

// ─── CUMULATIVE MARKETING SPEND THROUGH A GIVEN YEAR ───────────────────────

function cumulativeMarketingSpendThrough(a: AllAssumptions, year: number): number {
  let total = 0
  for (let y = 1; y <= year; y++) {
    total += getMonthlySpend(a, y) * 12
  }
  return total
}

// ─── MAIN CALCULATION ──────────────────────────────────────────────────────

export function calcDistributedSolar(a: AllAssumptions, year: number): DistributedSolarOutput {
  const ds = a.distributedSolar
  const monthlySpend = getMonthlySpend(a, year)
  const marketingSpend = monthlySpend * 12
  const leadsPerMonth = monthlySpend / ds.leadCost
  const leadsGenerated = leadsPerMonth * 12
  const installsPerMonth = Math.floor(leadsPerMonth * ds.conversionRate)
  const newInstalls = installsPerMonth * 12

  const cumulativeInstalls = cumulativeInstallsThrough(a, year)

  // INSTALL REVENUE: actual job fee from performing new installations this year
  // This is the service revenue that counts toward investor payback threshold
  const installRevenue = newInstalls * ds.installFee
  const installProfit = installRevenue * ds.installMargin

  // SREC REVENUE: recurring credits from ALL cumulative installed systems
  // This does NOT count toward threshold — investor gets 50% independently
  const srecRevenue = cumulativeInstalls * ds.srecsPerInstall * ds.srecValue

  // SREC admin/compliance: registration, monitoring, aggregation, reporting
  const adminCostRate = ds.srecAdminRate
  const adminCost = srecRevenue * adminCostRate
  const netSrecRevenue = srecRevenue - adminCost

  // Per-install SREC economics (annual)
  const grossSrecPerInstall = ds.srecsPerInstall * ds.srecValue
  const netSrecPerInstall = grossSrecPerInstall * (1 - adminCostRate)
  const revenuePerInstall = grossSrecPerInstall // backward-compatible alias

  // Cumulative marketing spend through this year
  const cumulativeMarketingSpend = cumulativeMarketingSpendThrough(a, year)

  return {
    marketingSpend,
    leadsGenerated,
    newInstalls,
    cumulativeInstalls,
    installRevenue,
    installProfit,
    srecRevenue,
    adminCostRate,
    adminCost,
    netSrecRevenue,
    totalRevenue: installRevenue + srecRevenue,
    revenuePerInstall,
    grossSrecPerInstall,
    netSrecPerInstall,
    cumulativeMarketingSpend,
    srecsPerInstall: ds.srecsPerInstall,
    srecValuePerCredit: ds.srecValue,
  }
}

// Returns the cumulative annual SREC revenue for a given year
export function calcDistributedSolarSRECRevenue(a: AllAssumptions, year: number): number {
  const ds = a.distributedSolar
  const cumulativeInstalls = cumulativeInstallsThrough(a, year)
  return cumulativeInstalls * ds.srecsPerInstall * ds.srecValue
}

// Export helper for the long-term SREC model to get installs per year
export function getInstallsForYear(a: AllAssumptions, year: number): number {
  return installsForYear(a, year)
}
