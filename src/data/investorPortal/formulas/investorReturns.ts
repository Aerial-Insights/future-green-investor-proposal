import type {
  YearlyOutputs,
  InvestorReturnSummary,
  AnnualInvestorReturn,
  SRECCohort,
  LongTermSRECYear,
  LongTermSRECSummary,
} from './types'

// ─── INVESTOR RETURN MODEL — PERCENTAGE BACK OPTION ────────────────────────
// Configuration-driven so the Unlock Assumptions panel can edit any rate or
// threshold and have the entire model recalculate live.
//
// ACCELERATED PHASE: Investor receives configurable shares of HS, Solar+RE,
// and Aerial profits, plus 50% (default) of SREC revenue. ALL investor cash
// flows count toward the return threshold (1.65x by default = 65% return on
// $40M = $66M target).
//
// Once cumulative total returns reach the threshold, the three accelerated
// streams stop entirely.
//
// LONG-TERM RESIDUAL PHASE (post-threshold):
//  - SREC share continues for the full life of each contract (20 years)
//  - Aerial residual share continues as a permanent residual
//
// Aerial residual activates post-threshold only (during accelerated phase,
// the larger Aerial share already exceeds the residual rate).

export interface InvestorReturnsConfig {
  homeServicesShare: number
  solarRealEstateShare: number
  aerialShare: number
  srecShare: number
  aerialResidualShare: number
  returnThresholdMultiple: number
}

export function calcInvestorReturns(
  years: YearlyOutputs[],
  totalCapital: number,
  config: InvestorReturnsConfig
): InvestorReturnSummary {
  const {
    homeServicesShare: hsShare,
    solarRealEstateShare: solarReShare,
    aerialShare: aerialShareCfg,
    srecShare: srecShareCfg,
    aerialResidualShare: aerialResidualShareCfg,
    returnThresholdMultiple,
  } = config

  const thresholdTarget = totalCapital * returnThresholdMultiple
  let cumulativeTotalReturn = 0
  let cumulativeDistributions = 0   // accelerated-only subtotal (for reporting)
  let thresholdYear: number | null = null
  let totalSRECDistributed = 0
  let totalAerialResidualDistributed = 0

  const annualReturns: AnnualInvestorReturn[] = years.map((y) => {
    let homeServicesDistribution: number
    let solarRealEstateDistribution: number
    let aerialDistribution: number
    let aerialResidualDistribution: number
    let totalDistribution: number

    // SREC participation — configurable share of annual SREC revenue every year
    const srecDistribution = Math.max(0, y.realEstate.distributedSolar.srecRevenue * srecShareCfg)

    if (thresholdYear === null) {
      // ACCELERATED PHASE: full revenue shares + SREC all count toward threshold
      homeServicesDistribution = Math.max(0, y.portfolio.homeServicesProfit * hsShare)
      solarRealEstateDistribution = Math.max(
        0,
        (y.portfolio.solarOperationsProfit + y.portfolio.realEstateProfit) * solarReShare
      )
      aerialDistribution = Math.max(0, y.portfolio.aerialProfit * aerialShareCfg)
      aerialResidualDistribution = 0 // subsumed by the larger accelerated share
      totalDistribution = homeServicesDistribution + solarRealEstateDistribution + aerialDistribution

      // Total investor cash flow this year (accelerated + SREC)
      const totalCashThisYear = totalDistribution + srecDistribution
      cumulativeTotalReturn += totalCashThisYear

      // Check if the return threshold is crossed this year
      if (cumulativeTotalReturn >= thresholdTarget) {
        // Reduce only accelerated streams to cap cumulative at exactly the threshold
        // SREC flows through uncapped since it continues post-threshold
        const overshoot = cumulativeTotalReturn - thresholdTarget
        if (totalDistribution > 0 && overshoot <= totalDistribution) {
          // Proportionally reduce accelerated streams
          const ratio = (totalDistribution - overshoot) / totalDistribution
          homeServicesDistribution *= ratio
          solarRealEstateDistribution *= ratio
          aerialDistribution *= ratio
          totalDistribution -= overshoot
        } else {
          // Edge case: SREC alone pushes past threshold — zero out accelerated entirely
          homeServicesDistribution = 0
          solarRealEstateDistribution = 0
          aerialDistribution = 0
          totalDistribution = 0
        }
        cumulativeTotalReturn = thresholdTarget
        thresholdYear = y.year
      }

      cumulativeDistributions += totalDistribution
    } else {
      // POST-THRESHOLD: accelerated streams stop, aerial residual continues permanently
      homeServicesDistribution = 0
      solarRealEstateDistribution = 0
      aerialDistribution = 0
      aerialResidualDistribution = Math.max(0, y.portfolio.aerialProfit * aerialResidualShareCfg)
      totalDistribution = 0

      // Post-threshold: only SREC + aerial residual count
      cumulativeTotalReturn += srecDistribution + aerialResidualDistribution
    }

    totalAerialResidualDistributed += aerialResidualDistribution
    totalSRECDistributed += srecDistribution

    const totalReturnThisYear = totalDistribution + srecDistribution + aerialResidualDistribution

    return {
      year: y.year,
      homeServicesDistribution,
      solarRealEstateDistribution,
      aerialDistribution,
      aerialResidualDistribution,
      totalDistribution,
      cumulativeDistributions,
      thresholdMet: thresholdYear !== null,
      thresholdMetThisYear: thresholdYear === y.year,
      srecDistribution,
      totalReturnThisYear,
      cumulativeTotalReturn,
    }
  })

  // Calculate months to reach the threshold (all streams combined).
  // If not reached within the modeled horizon, extrapolate using the last
  // year's annual rate.
  let monthsToThreshold: number | null = null
  if (thresholdYear !== null) {
    const thresholdIdx = thresholdYear - 1
    const prevCumulative = thresholdIdx > 0 ? annualReturns[thresholdIdx - 1].cumulativeTotalReturn : 0

    // Compute uncapped total return for the threshold year from raw data
    const thresholdYearData = years[thresholdIdx]
    const uncappedAccelerated =
      Math.max(0, thresholdYearData.portfolio.homeServicesProfit * hsShare) +
      Math.max(0, (thresholdYearData.portfolio.solarOperationsProfit + thresholdYearData.portfolio.realEstateProfit) * solarReShare) +
      Math.max(0, thresholdYearData.portfolio.aerialProfit * aerialShareCfg)
    const uncappedSREC = Math.max(0, thresholdYearData.realEstate.distributedSolar.srecRevenue * srecShareCfg)
    const uncappedTotal = uncappedAccelerated + uncappedSREC

    const remaining = thresholdTarget - prevCumulative
    const fractionOfYear = uncappedTotal > 0 ? Math.min(remaining / uncappedTotal, 1) : 1
    monthsToThreshold = thresholdIdx * 12 + Math.max(1, Math.round(fractionOfYear * 12))
  } else if (annualReturns.length > 0) {
    const lastYear = annualReturns[annualReturns.length - 1]
    const annualRate = lastYear.totalReturnThisYear
    if (annualRate > 0) {
      const remaining = thresholdTarget - lastYear.cumulativeTotalReturn
      if (remaining > 0) {
        const additionalMonths = Math.round((remaining / annualRate) * 12)
        monthsToThreshold = annualReturns.length * 12 + additionalMonths
      } else {
        monthsToThreshold = annualReturns.length * 12
      }
    }
  }

  // Projected annual aerial residual: what the investor WILL receive annually
  // as a permanent residual post-threshold (last-year aerial profit × residual share).
  const projectedAnnualAerialResidual =
    Math.max(0, years[years.length - 1].portfolio.aerialProfit * aerialResidualShareCfg)

  return {
    totalCapital,
    thresholdTarget,
    annualReturns,
    totalDistributed: cumulativeTotalReturn,
    thresholdProgress: Math.min(1, cumulativeTotalReturn / thresholdTarget),
    thresholdYear,
    totalSRECDistributed,
    totalAerialResidualDistributed,
    isThresholdMet: thresholdYear !== null,
    monthsToThreshold,
    projectedAnnualAerialResidual,
  }
}

// ─── 20-YEAR SREC COHORT MODEL ─────────────────────────────────────────────
// Each Year 1-5 install cohort generates SREC revenue for `srecLifespan` years.
// The investor retains `investorEquityShare` of the SREC economics for all
// installs originated during the initial deployment period.
// No build delay — distributed rooftop installs produce SRECs immediately.

export function calcLongTermSREC(
  years: YearlyOutputs[],
  investorEquityShare: number = 0.50,
  srecLifespan: number = 20,
): LongTermSRECSummary {
  // Get SREC parameters from the model's existing data
  const ds0 = years[0]?.realEstate.distributedSolar
  const srecsPerInstall = ds0?.srecsPerInstall ?? 12
  const srecValuePerCredit = ds0?.srecValuePerCredit ?? 400

  // Build cohorts: one per install year (1-5), using ACTUAL installs per year
  const cohorts: SRECCohort[] = []
  for (let buildYear = 1; buildYear <= 5; buildYear++) {
    const yearData = years[buildYear - 1]
    const installCount = yearData?.realEstate.distributedSolar.newInstalls ?? 0
    if (installCount <= 0) continue
    const startYear = buildYear
    const endYear = startYear + srecLifespan - 1
    const annualSRECRevenue = installCount * srecsPerInstall * srecValuePerCredit
    cohorts.push({
      buildYear,
      installCount,
      srecsPerInstall,
      srecValuePerCredit,
      annualSRECRevenue,
      srecLifespan,
      startYear,
      endYear,
    })
  }

  // Edge case: no cohorts — return empty summary
  if (cohorts.length === 0) {
    return {
      cohorts: [],
      annualProjections: [],
      totalInvestorSRECIncome: 0,
      totalPlatformSRECRevenue: 0,
      peakAnnualInvestorIncome: 0,
      investorEquityShare,
    }
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
        cohortContributions[cohort.buildYear] = cohort.annualSRECRevenue
        totalSRECRevenue += cohort.annualSRECRevenue
      }
    }

    const investorShare = totalSRECRevenue * investorEquityShare
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
    investorEquityShare,
  }
}
