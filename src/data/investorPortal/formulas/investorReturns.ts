import type {
  YearlyOutputs,
  InvestorReturnSummary,
  AnnualInvestorReturn,
  SRECCohort,
  LongTermSRECYear,
  LongTermSRECSummary,
} from './types'

const HS_SHARE = 0.20
const SOLAR_RE_SHARE = 0.20
const AERIAL_SHARE = 0.03
const HURDLE_PERCENT = 0.50
const POST_HURDLE_SREC_SHARE = 0.25

// ─── 5-YEAR INVESTOR RETURN MODEL ──────────────────────────────────────────

export function calcInvestorReturns(
  years: YearlyOutputs[],
  totalCapital: number
): InvestorReturnSummary {
  const hurdleTarget = totalCapital * HURDLE_PERCENT
  let cumulativeDistributions = 0
  let cumulativeTotalReturn = 0
  let hurdleYear: number | null = null
  let postHurdleSRECTotal = 0

  const annualReturns: AnnualInvestorReturn[] = years.map((y) => {
    const homeServicesDistribution = Math.max(0, y.portfolio.homeServicesProfit * HS_SHARE)
    const solarRealEstateDistribution = Math.max(
      0,
      (y.portfolio.solarOperationsProfit + y.portfolio.realEstateProfit) * SOLAR_RE_SHARE
    )
    const aerialDistribution = Math.max(0, y.portfolio.aerialProfit * AERIAL_SHARE)
    const totalDistribution = homeServicesDistribution + solarRealEstateDistribution + aerialDistribution

    cumulativeDistributions += totalDistribution

    const hurdleMet = cumulativeDistributions >= hurdleTarget
    const hurdleMetThisYear = hurdleMet && hurdleYear === null

    if (hurdleMetThisYear) {
      hurdleYear = y.year
    }

    let postHurdleSRECParticipation = 0
    if (hurdleMet) {
      const srecRevenue = y.realEstate.solarFarm.cumulativeSRECRevenue
      postHurdleSRECParticipation = srecRevenue * POST_HURDLE_SREC_SHARE
      postHurdleSRECTotal += postHurdleSRECParticipation
    }

    const totalReturnThisYear = totalDistribution + postHurdleSRECParticipation
    cumulativeTotalReturn += totalReturnThisYear

    return {
      year: y.year,
      homeServicesDistribution,
      solarRealEstateDistribution,
      aerialDistribution,
      totalDistribution,
      cumulativeDistributions,
      hurdleMet,
      hurdleMetThisYear,
      postHurdleSRECParticipation,
      totalReturnThisYear,
      cumulativeTotalReturn,
    }
  })

  return {
    totalCapital,
    hurdleTarget,
    annualReturns,
    totalDistributed: cumulativeTotalReturn,
    hurdleProgress: Math.min(1, cumulativeDistributions / hurdleTarget),
    hurdleYear,
    postHurdleSRECTotal,
    isHurdleMet: hurdleYear !== null,
  }
}

// ─── 20-YEAR SREC COHORT MODEL ─────────────────────────────────────────────
// Each Year 1-5 solar farm vintage generates SREC revenue for 20 years.
// The investor retains 20% equity in the SREC economics for all farms
// originated during the initial 5-year build period.

const SREC_LIFESPAN = 20
const INVESTOR_SREC_EQUITY = 0.20
const BUILD_DELAY_YEARS = 2 // 18-month delay simplified to 2-year start

// Acres acquired by build year (matches solarFarms.ts acresGoalByYear)
function acresGoalByYear(year: number): number {
  const goals: Record<number, number> = { 1: 5, 2: 15, 3: 30, 4: 60, 5: 120 }
  return goals[year] ?? 0
}

export function calcLongTermSREC(
  years: YearlyOutputs[],
): LongTermSRECSummary {
  // Get the annual SREC revenue per acre from the model's existing data
  const annualSRECRevenuePerAcre = years[0]?.realEstate.solarFarm.annualSRECRevenuePerAcre ?? 150000

  // Build cohorts: one per build year (1-5)
  const cohorts: SRECCohort[] = []
  for (let buildYear = 1; buildYear <= 5; buildYear++) {
    const acres = acresGoalByYear(buildYear)
    if (acres <= 0) continue
    // Each cohort starts producing SREC revenue after the build delay
    const startYear = buildYear + BUILD_DELAY_YEARS
    const endYear = startYear + SREC_LIFESPAN - 1
    cohorts.push({
      buildYear,
      acresGoal: acres,
      annualSRECRevenuePerAcre,
      srecLifespan: SREC_LIFESPAN,
      startYear,
      endYear,
    })
  }

  // Find the full timeline: earliest start to latest end
  const maxEndYear = Math.max(...cohorts.map((c) => c.endYear))
  const minStartYear = Math.min(...cohorts.map((c) => c.startYear))

  // Project annual SREC revenue across the full timeline
  const annualProjections: LongTermSRECYear[] = []
  let cumulativeInvestorShare = 0
  let totalPlatformSRECRevenue = 0
  let peakAnnualInvestorIncome = 0

  for (let year = minStartYear; year <= maxEndYear; year++) {
    const cohortContributions: Record<number, number> = {}
    let totalSRECRevenue = 0

    for (const cohort of cohorts) {
      if (year >= cohort.startYear && year <= cohort.endYear) {
        const revenue = cohort.acresGoal * cohort.annualSRECRevenuePerAcre
        cohortContributions[cohort.buildYear] = revenue
        totalSRECRevenue += revenue
      }
    }

    const investorShare = totalSRECRevenue * INVESTOR_SREC_EQUITY
    cumulativeInvestorShare += investorShare
    totalPlatformSRECRevenue += totalSRECRevenue
    if (investorShare > peakAnnualInvestorIncome) {
      peakAnnualInvestorIncome = investorShare
    }

    annualProjections.push({
      year,
      cohortContributions,
      totalSRECRevenue,
      investorShare,
      cumulativeInvestorShare,
    })
  }

  return {
    cohorts,
    annualProjections,
    totalInvestorSRECIncome: cumulativeInvestorShare,
    totalPlatformSRECRevenue,
    peakAnnualInvestorIncome,
    investorEquityShare: INVESTOR_SREC_EQUITY,
  }
}
