import type { AllAssumptions } from '../baseAssumptions'
import type {
  YearlyOutputs,
  AerialContinuationYear,
  AerialExitValuation,
  AerialResidualSummary,
} from './types'

// ─── AERIAL INSIGHTS RESIDUAL ECONOMICS ────────────────────────────────────
// Models the investor's 3% perpetual residual from Aerial Insights:
//  - Y1-5: actual model outputs with 3% residual applied consistently
//  - Y6-10: continuation projections with tapering growth and 3% residual
//  - Year 7 exit valuation: ARR-based with conservative/base/optimistic multiples
//
// All years use 3% so the investor share scales smoothly with business growth.
// During the accelerated phase (pre-threshold) the investor actually receives
// 10% of aerial profit, which is higher — that is shown in the Investor Returns
// section above. This section focuses on the long-term residual trajectory.

const CONTINUATION_GROWTH_RATES = [0.10, 0.12, 0.08, 0.06, 0.05] // Y6-Y10
const SAAS_MARGIN = 0.75
const SCANS_PER_USER_PER_MONTH = 100
const RESIDUAL_SHARE = 0.03

// Exit valuation multiples (ARR-based)
const CONSERVATIVE_MULTIPLE = 4
const BASE_MULTIPLE = 6
const OPTIMISTIC_MULTIPLE = 8
const EXIT_YEAR = 7

export function calcAerialResiduals(
  years: YearlyOutputs[],
  assumptions: AllAssumptions,
): AerialResidualSummary {
  const ar = assumptions.aerial
  const revenuePerUser = ar.subscriptionMonthly * 12

  // ── Y1-5: read directly from canonical model outputs ────────────────────
  // This section shows the 3% residual economics consistently for all years.
  // During the accelerated phase (pre-threshold) the investor actually receives
  // 10% — which is higher — but this section illustrates the perpetual 3%
  // residual trajectory so the progression scales smoothly with the business.
  const y1to5: AerialContinuationYear[] = years.map((y) => {
    const aerialProfit = y.portfolio.aerialProfit
    const investorShare = Math.max(0, aerialProfit * RESIDUAL_SHARE)

    return {
      year: y.year,
      activeUsers: y.aerial.activeUsers,
      annualRevenue: y.aerial.annualRevenue,
      aerialProfit,
      investorShare,
      investorSharePercent: RESIDUAL_SHARE,
      isContinuation: false,
    }
  })

  // ── Y6-10: continuation projections ─────────────────────────────────────
  const y5 = years[years.length - 1]
  let prevUsers = y5.aerial.activeUsers
  const baseMarketing = ar.aerialMarketingMonthly * 12

  const y6to10: AerialContinuationYear[] = CONTINUATION_GROWTH_RATES.map((rate, i) => {
    const yearNum = 6 + i
    const activeUsers = Math.round(prevUsers * (1 + rate))
    const annualRevenue = activeUsers * revenuePerUser
    // Marketing scales modestly with growth (10% increase per year beyond Y5)
    const marketingAnnual = baseMarketing * (1 + (i + 1) * 0.10)
    const scanCostAnnual = activeUsers * SCANS_PER_USER_PER_MONTH * ar.costPerScan * 12
    const aerialProfit = annualRevenue * SAAS_MARGIN - scanCostAnnual - marketingAnnual

    const investorShare = Math.max(0, aerialProfit * RESIDUAL_SHARE)
    prevUsers = activeUsers

    return {
      year: yearNum,
      activeUsers,
      annualRevenue,
      aerialProfit,
      investorShare,
      investorSharePercent: RESIDUAL_SHARE,
      isContinuation: true,
    }
  })

  const yearlyBreakdown = [...y1to5, ...y6to10]

  // ── Aggregates ──────────────────────────────────────────────────────────
  const totalInvestorY1to5 = y1to5.reduce((s, y) => s + y.investorShare, 0)
  const totalInvestorY6to10 = y6to10.reduce((s, y) => s + y.investorShare, 0)
  const totalInvestor10Year = totalInvestorY1to5 + totalInvestorY6to10

  const peakAnnualResidual = Math.max(...y6to10.map((y) => y.investorShare))

  // ── Year 7 Exit Valuation ──────────────────────────────────────────────
  const y7 = yearlyBreakdown.find((y) => y.year === EXIT_YEAR)
  const arrAtExit = y7?.annualRevenue ?? 0

  const exitValuation: AerialExitValuation = {
    exitYear: EXIT_YEAR,
    arrAtExit,
    valuationMultiple: BASE_MULTIPLE,
    companyValuation: arrAtExit * BASE_MULTIPLE,
    investorSharePercent: RESIDUAL_SHARE,
    investorExitValue: arrAtExit * BASE_MULTIPLE * RESIDUAL_SHARE,
    conservativeMultiple: CONSERVATIVE_MULTIPLE,
    conservativeValuation: arrAtExit * CONSERVATIVE_MULTIPLE,
    conservativeInvestorValue: arrAtExit * CONSERVATIVE_MULTIPLE * RESIDUAL_SHARE,
    optimisticMultiple: OPTIMISTIC_MULTIPLE,
    optimisticValuation: arrAtExit * OPTIMISTIC_MULTIPLE,
    optimisticInvestorValue: arrAtExit * OPTIMISTIC_MULTIPLE * RESIDUAL_SHARE,
  }

  return {
    yearlyBreakdown,
    totalInvestorY1to5,
    totalInvestorY6to10,
    totalInvestor10Year,
    exitValuation,
    peakAnnualResidual,
    y5ActiveUsers: y5.aerial.activeUsers,
    revenuePerUser,
  }
}
