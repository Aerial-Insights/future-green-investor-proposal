import type {
  YearlyOutputs,
  InvestorReturnSummary,
  AnnualInvestorReturn,
  SRECCohort,
  LongTermSRECYear,
  LongTermSRECSummary,
} from './types'

const HS_SHARE = 0.15
const SOLAR_RE_SHARE = 0.20
const AERIAL_SHARE = 0.10
const RETURN_MULTIPLIER = 1.65       // 65% return = investor receives 1.65x capital
const SREC_SHARE = 0.50
const AERIAL_RESIDUAL_SHARE = 0.03

// ─── 5-YEAR INVESTOR RETURN MODEL ──────────────────────────────────────────
// ACCELERATED PHASE: Investor receives 15% of HS, 20% of Solar & RE
// (INSTALL revenue only), and 10% of Aerial profits. SREC participation
// (50%) also runs from Year 1. ALL investor cash flows (accelerated + SREC)
// count toward the 65% return threshold ($66M on a $40M raise — meaning
// the investor receives their capital back plus a 65% return).
// Once cumulative total returns reach the threshold, the three accelerated
// streams stop entirely.
//
// LONG-TERM RESIDUAL PHASE (post-threshold):
// - 50% of SREC revenue continues for the full life of each contract (20 years)
// - 3% of Aerial Insights revenue continues as a permanent residual
//
// Aerial residual (3%) activates post-threshold only (during accelerated
// phase, the 10% share already exceeds the 3%).

export function calcInvestorReturns(
  years: YearlyOutputs[],
  totalCapital: number
): InvestorReturnSummary {
  const thresholdTarget = totalCapital * RETURN_MULTIPLIER  // $66M on $40M
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

    // SREC participation — 50% of annual SREC revenue every year (before AND after threshold)
    const srecDistribution = Math.max(0, y.realEstate.distributedSolar.srecRevenue * SREC_SHARE)

    if (thresholdYear === null) {
      // ACCELERATED PHASE: full revenue shares + SREC all count toward threshold
      homeServicesDistribution = Math.max(0, y.portfolio.homeServicesProfit * HS_SHARE)
      solarRealEstateDistribution = Math.max(
        0,
        (y.portfolio.solarOperationsProfit + y.portfolio.realEstateProfit) * SOLAR_RE_SHARE
      )
      aerialDistribution = Math.max(0, y.portfolio.aerialProfit * AERIAL_SHARE)
      aerialResidualDistribution = 0 // subsumed by the 10% accelerated share
      totalDistribution = homeServicesDistribution + solarRealEstateDistribution + aerialDistribution

      // Total investor cash flow this year (accelerated + SREC)
      const totalCashThisYear = totalDistribution + srecDistribution
      cumulativeTotalReturn += totalCashThisYear

      // Check if the $66M threshold is crossed this year
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
      // POST-THRESHOLD: accelerated streams stop, 3% Aerial residual continues permanently
      homeServicesDistribution = 0
      solarRealEstateDistribution = 0
      aerialDistribution = 0
      aerialResidualDistribution = Math.max(0, y.portfolio.aerialProfit * AERIAL_RESIDUAL_SHARE)
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

  // Calculate months to reach the $66M threshold (all streams combined)
  // If not reached within 5 years, extrapolate using Year 5 annual rate
  let monthsToThreshold: number | null = null
  if (thresholdYear !== null) {
    // Threshold was reached within the modeled years — calculate precise month
    const thresholdIdx = thresholdYear - 1
    const prevCumulative = thresholdIdx > 0 ? annualReturns[thresholdIdx - 1].cumulativeTotalReturn : 0

    // Compute uncapped total return for the threshold year from raw data
    const thresholdYearData = years[thresholdIdx]
    const uncappedAccelerated =
      Math.max(0, thresholdYearData.portfolio.homeServicesProfit * HS_SHARE) +
      Math.max(0, (thresholdYearData.portfolio.solarOperationsProfit + thresholdYearData.portfolio.realEstateProfit) * SOLAR_RE_SHARE) +
      Math.max(0, thresholdYearData.portfolio.aerialProfit * AERIAL_SHARE)
    const uncappedSREC = Math.max(0, thresholdYearData.realEstate.distributedSolar.srecRevenue * SREC_SHARE)
    const uncappedTotal = uncappedAccelerated + uncappedSREC

    const remaining = thresholdTarget - prevCumulative
    const fractionOfYear = uncappedTotal > 0 ? Math.min(remaining / uncappedTotal, 1) : 1
    monthsToThreshold = thresholdIdx * 12 + Math.max(1, Math.round(fractionOfYear * 12))
  } else if (annualReturns.length > 0) {
    // Extrapolate beyond Year 5 using Year 5's annual return rate
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
  // as a permanent residual post-threshold (based on Y5 aerial profit × 3%).
  // Always computed so the UI can display it even when threshold is met late
  // in the model and totalAerialResidualDistributed is near zero.
  const projectedAnnualAerialResidual =
    Math.max(0, years[years.length - 1].portfolio.aerialProfit * AERIAL_RESIDUAL_SHARE)

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
// Each Year 1-5 install cohort generates SREC revenue for 20 years.
// The investor retains 50% equity in the SREC economics for all installs
// originated during the initial 5-year deployment period.
// No build delay — distributed rooftop installs produce SRECs immediately.
// Install counts now vary by year (monthly marketing ramp model).

const SREC_LIFESPAN = 20
const INVESTOR_SREC_EQUITY = 0.50

export function calcLongTermSREC(
  years: YearlyOutputs[],
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
    // Each cohort starts producing SREC revenue immediately (no build delay)
    const startYear = buildYear
    const endYear = startYear + SREC_LIFESPAN - 1
    const annualSRECRevenue = installCount * srecsPerInstall * srecValuePerCredit
    cohorts.push({
      buildYear,
      installCount,
      srecsPerInstall,
      srecValuePerCredit,
      annualSRECRevenue,
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
        cohortContributions[cohort.buildYear] = cohort.annualSRECRevenue
        totalSRECRevenue += cohort.annualSRECRevenue
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
