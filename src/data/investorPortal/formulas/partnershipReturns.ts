import type {
  ExtendedYearOutput,
  PartnershipAnnualReturn,
  PartnershipMilestone,
  PartnershipPhaseLabel,
  PartnershipPhaseTotals,
  PartnershipReturnSummary,
} from './types'
import type { PartnershipOptionConfig } from '../baseAssumptions'

// ─── PARTNERSHIP RETURN WATERFALL ──────────────────────────────────────────
// Two-phase return structure:
//   1. Initial Return Phase — investor receives the higher partnership shares
//      (homeServicesShare / realEstateShare / aerialInsightsShare) until
//      cumulative earnings reach the configured return threshold.
//   2. Permanent Long-Term Phase — once the threshold is reached, the investor
//      steps down to the post-threshold percentages and continues receiving
//      that profit-share for the remainder of the partnership horizon.
//
// Threshold crossings inside a year are prorated cleanly: the portion of the
// year required to reach the threshold runs at initial-phase shares; the
// remainder of the year runs at permanent-phase shares. This keeps every
// year-by-year row, milestone, and chart self-consistent.

const MILESTONE_YEARS = [5, 10, 15, 20]

function emptyTotals(): PartnershipPhaseTotals {
  return {
    homeServices: 0,
    solarEnergy: 0,
    realEstate: 0,
    solarRealEstate: 0,
    aerial: 0,
    total: 0,
  }
}

export function calcPartnershipReturns(
  extendedYears: ExtendedYearOutput[],
  totalCapital: number,
  config: PartnershipOptionConfig
): PartnershipReturnSummary {
  const {
    homeServicesShare,
    realEstateShare,
    aerialInsightsShare,
    postThresholdHomeServicesShare,
    postThresholdRealEstateShare,
    postThresholdAerialInsightsShare,
    returnThresholdMultiple,
  } = config

  const thresholdTarget = totalCapital * returnThresholdMultiple

  let cumulativeEarnings = 0
  let cumulativeHS = 0
  let cumulativeSolarEnergy = 0
  let cumulativeRE = 0
  let cumulativeAerial = 0

  let thresholdReached = false
  let thresholdYear: number | null = null
  let thresholdYearFractional: number | null = null
  let thresholdReturnAmount = 0

  const preTotals = emptyTotals()
  const postTotals = emptyTotals()

  const annualReturns: PartnershipAnnualReturn[] = extendedYears.map((y) => {
    // Full-year hypothetical earnings under each phase
    const preFullHS = y.homeServicesProfit * homeServicesShare
    const preFullSolarEnergy = y.solarOperationsProfit * realEstateShare
    const preFullRE = y.realEstateProfit * realEstateShare
    const preFullAerial = y.aerialProfit * aerialInsightsShare
    const preFullTotal = preFullHS + preFullSolarEnergy + preFullRE + preFullAerial

    const postFullHS = y.homeServicesProfit * postThresholdHomeServicesShare
    const postFullSolarEnergy = y.solarOperationsProfit * postThresholdRealEstateShare
    const postFullRE = y.realEstateProfit * postThresholdRealEstateShare
    const postFullAerial = y.aerialProfit * postThresholdAerialInsightsShare

    // Determine pre/post split for this year
    let preFraction = 0
    let thresholdReachedThisYear = false
    let activePhase: PartnershipPhaseLabel
    if (thresholdReached) {
      preFraction = 0
      activePhase = 'permanent'
    } else if (cumulativeEarnings + preFullTotal <= thresholdTarget || preFullTotal <= 0) {
      preFraction = preFullTotal > 0 ? 1 : 0
      activePhase = 'initial'
      // If the pre-full year ends *exactly* at the threshold, mark it reached.
      if (cumulativeEarnings + preFullTotal >= thresholdTarget && preFullTotal > 0) {
        thresholdReached = true
        thresholdReachedThisYear = true
        thresholdYear = y.year
        thresholdYearFractional = y.year
        thresholdReturnAmount = cumulativeEarnings + preFullTotal
      }
    } else {
      // Mid-year crossing — prorate
      const remaining = thresholdTarget - cumulativeEarnings
      preFraction = Math.max(0, Math.min(1, remaining / preFullTotal))
      thresholdReached = true
      thresholdReachedThisYear = true
      thresholdYear = y.year
      // Fractional placement: e.g. Y4 + 0.62 = 4.62 (year - 1 + preFraction)
      thresholdYearFractional = y.year - 1 + preFraction
      thresholdReturnAmount = thresholdTarget
      activePhase = 'threshold-year'
    }
    const postFraction = 1 - preFraction

    // Blended sector earnings
    const preHS = preFraction * preFullHS
    const postHS = postFraction * postFullHS
    const homeServicesEarnings = preHS + postHS

    const preSolarEnergy = preFraction * preFullSolarEnergy
    const postSolarEnergy = postFraction * postFullSolarEnergy
    const solarEnergyEarnings = preSolarEnergy + postSolarEnergy

    const preRE = preFraction * preFullRE
    const postRE = postFraction * postFullRE
    const realEstateEarnings = preRE + postRE

    const solarRealEstateEarnings = solarEnergyEarnings + realEstateEarnings

    const preAerial = preFraction * preFullAerial
    const postAerial = postFraction * postFullAerial
    const aerialEarnings = preAerial + postAerial

    const totalEarnings = homeServicesEarnings + solarRealEstateEarnings + aerialEarnings
    const preThresholdEarnings = preHS + preSolarEnergy + preRE + preAerial
    const postThresholdEarnings = postHS + postSolarEnergy + postRE + postAerial

    cumulativeEarnings += totalEarnings
    cumulativeHS += homeServicesEarnings
    cumulativeSolarEnergy += solarEnergyEarnings
    cumulativeRE += realEstateEarnings
    cumulativeAerial += aerialEarnings

    preTotals.homeServices += preHS
    preTotals.solarEnergy += preSolarEnergy
    preTotals.realEstate += preRE
    preTotals.solarRealEstate += preSolarEnergy + preRE
    preTotals.aerial += preAerial
    preTotals.total += preThresholdEarnings

    postTotals.homeServices += postHS
    postTotals.solarEnergy += postSolarEnergy
    postTotals.realEstate += postRE
    postTotals.solarRealEstate += postSolarEnergy + postRE
    postTotals.aerial += postAerial
    postTotals.total += postThresholdEarnings

    // Applied (effective) share % per sector this year — derive from earnings
    // so the displayed % always matches the actual dollar amounts shown.
    const appliedHomeServicesShare =
      y.homeServicesProfit > 0 ? homeServicesEarnings / y.homeServicesProfit : 0
    const appliedRealEstateShare =
      y.combinedSolarRealEstateProfit > 0
        ? solarRealEstateEarnings / y.combinedSolarRealEstateProfit
        : 0
    const appliedAerialInsightsShare =
      y.aerialProfit > 0 ? aerialEarnings / y.aerialProfit : 0

    return {
      year: y.year,
      phase: y.phase,
      isExtrapolated: y.isExtrapolated,
      homeServicesProfit: y.homeServicesProfit,
      solarOperationsProfit: y.solarOperationsProfit,
      realEstateProfit: y.realEstateProfit,
      solarRealEstateProfit: y.combinedSolarRealEstateProfit,
      aerialProfit: y.aerialProfit,
      totalCompanyProfit: y.totalProfit,
      homeServicesEarnings,
      solarEnergyEarnings,
      realEstateEarnings,
      solarRealEstateEarnings,
      aerialEarnings,
      totalEarnings,
      cumulativeEarnings,
      activePhase,
      preThresholdFraction: preFraction,
      postThresholdFraction: postFraction,
      appliedHomeServicesShare,
      appliedRealEstateShare,
      appliedAerialInsightsShare,
      preThresholdEarnings,
      postThresholdEarnings,
      thresholdReachedThisYear,
    }
  })

  // Milestone snapshots at Y5/10/15/20 (whichever fall within the configured horizon)
  const milestones: PartnershipMilestone[] = []
  for (const target of MILESTONE_YEARS) {
    const row = annualReturns.find((r) => r.year === target)
    if (!row) continue
    const cumulativeCompanyProfit = annualReturns
      .slice(0, target)
      .reduce((s, r) => s + r.totalCompanyProfit, 0)
    milestones.push({
      year: target,
      cumulativeEarnings: row.cumulativeEarnings,
      roiMultiple: totalCapital > 0 ? row.cumulativeEarnings / totalCapital : 0,
      cumulativeCompanyProfit,
      activePhase: row.activePhase,
    })
  }

  // Estimated post-threshold annual run-rate: use the first row that is
  // entirely on permanent-phase economics; fall back to the year-after-
  // threshold scaled if no fully permanent year exists in the horizon.
  const firstFullPermanentRow = annualReturns.find(
    (r) => r.activePhase === 'permanent' && r.postThresholdFraction === 1
  )
  const postThresholdAnnualEstimate = firstFullPermanentRow?.totalEarnings ?? 0

  const totalEarnings = cumulativeEarnings
  const roiMultiple = totalCapital > 0 ? totalEarnings / totalCapital : 0

  return {
    totalCapital,
    annualReturns,
    milestones,
    totalEarnings,
    roiMultiple,
    divisionContribution: {
      homeServices: cumulativeHS,
      solarEnergy: cumulativeSolarEnergy,
      realEstate: cumulativeRE,
      solarRealEstate: cumulativeSolarEnergy + cumulativeRE,
      aerial: cumulativeAerial,
    },
    returnThresholdMultiple,
    thresholdTarget,
    thresholdReached,
    thresholdYear,
    thresholdYearFractional,
    thresholdReturnAmount: thresholdReached ? thresholdReturnAmount : cumulativeEarnings,
    preThresholdTotals: preTotals,
    postThresholdTotals: postTotals,
    postThresholdAnnualEstimate,
  }
}
