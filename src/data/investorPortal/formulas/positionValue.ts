import type {
  ExtendedYearOutput,
  PartnershipPositionValueMilestone,
  PartnershipPositionValueSummary,
  PositionSectorValuation,
  ValuationMultipleRange,
} from './types'
import type { PartnershipOptionConfig } from '../baseAssumptions'

// ─── PARTNERSHIP POSITION VALUE ────────────────────────────────────────────
// Investor-facing planning estimate of the *enterprise value* of the
// investor's permanent partnership position at each milestone year.
//
// Methodology — illustrative, not appraisal:
//   • Home Services → EBITDA × multiple (mature, cash-yielding services)
//   • Real Estate (incl. Solar Operations) → EBITDA × multiple
//   • Aerial Insights → Annual Revenue / ARR × multiple (SaaS standard)
//
// Investor position value is computed per-sector using the actual
// partnership ownership share for that sector (shares differ by division),
// then summed. A blended ownership % is reported for context.
//
// Operating profit from the underlying model is used as an EBITDA proxy.
// In the current model formulation there is no separate D&A line, so
// operating profit ≈ EBITDA at this level of granularity. This is
// acceptable for an investor-facing planning view and is documented in the
// UI so the investor understands the assumption.

export const POSITION_VALUE_MILESTONE_YEARS = [5, 10, 15, 20] as const

export const POSITION_VALUATION_MULTIPLES = {
  homeServices: { low: 2.0, base: 3.0, high: 4.0 } as ValuationMultipleRange,
  realEstate: { low: 2.0, base: 2.5, high: 3.0 } as ValuationMultipleRange,
  aerialInsights: { low: 5.0, base: 6.0, high: 7.0 } as ValuationMultipleRange,
} as const

function applyMultiple(driver: number, m: ValuationMultipleRange): ValuationMultipleRange {
  return {
    low: Math.max(0, driver) * m.low,
    base: Math.max(0, driver) * m.base,
    high: Math.max(0, driver) * m.high,
  }
}

function scaleRange(r: ValuationMultipleRange, factor: number): ValuationMultipleRange {
  return { low: r.low * factor, base: r.base * factor, high: r.high * factor }
}

function addRanges(a: ValuationMultipleRange, b: ValuationMultipleRange): ValuationMultipleRange {
  return { low: a.low + b.low, base: a.base + b.base, high: a.high + b.high }
}

function divideRanges(a: ValuationMultipleRange, b: ValuationMultipleRange): ValuationMultipleRange {
  return {
    low: b.low > 0 ? a.low / b.low : 0,
    base: b.base > 0 ? a.base / b.base : 0,
    high: b.high > 0 ? a.high / b.high : 0,
  }
}

function buildSector(
  driver: number,
  driverLabel: 'EBITDA' | 'ARR',
  multiple: ValuationMultipleRange,
  ownershipShare: number
): PositionSectorValuation {
  const enterpriseValue = applyMultiple(driver, multiple)
  return {
    driver,
    driverLabel,
    multiple,
    enterpriseValue,
    ownershipShare,
    investorPositionValue: scaleRange(enterpriseValue, ownershipShare),
  }
}

export function calcPartnershipPositionValue(
  extendedYears: ExtendedYearOutput[],
  config: PartnershipOptionConfig
): PartnershipPositionValueSummary {
  // Position value reflects the investor's *permanent* long-term ownership —
  // i.e., the post-threshold shares. By the Y5+ valuation milestones the
  // partnership is modeled to have stepped down to its permanent phase, so
  // those are the percentages that drive enterprise-value participation.
  const ownership = {
    homeServices: config.postThresholdHomeServicesShare,
    realEstate: config.postThresholdRealEstateShare,
    aerialInsights: config.postThresholdAerialInsightsShare,
  }

  const milestones: PartnershipPositionValueMilestone[] = []

  for (const year of POSITION_VALUE_MILESTONE_YEARS) {
    const row = extendedYears.find((y) => y.year === year)
    if (!row) continue

    const homeServices = buildSector(
      row.homeServicesProfit,
      'EBITDA',
      POSITION_VALUATION_MULTIPLES.homeServices,
      ownership.homeServices
    )
    const realEstate = buildSector(
      row.combinedSolarRealEstateProfit,
      'EBITDA',
      POSITION_VALUATION_MULTIPLES.realEstate,
      ownership.realEstate
    )
    const aerialInsights = buildSector(
      row.aerialAnnualRevenue,
      'ARR',
      POSITION_VALUATION_MULTIPLES.aerialInsights,
      ownership.aerialInsights
    )

    const totalPlatformValue = addRanges(
      addRanges(homeServices.enterpriseValue, realEstate.enterpriseValue),
      aerialInsights.enterpriseValue
    )
    const investorPositionValue = addRanges(
      addRanges(homeServices.investorPositionValue, realEstate.investorPositionValue),
      aerialInsights.investorPositionValue
    )
    const blendedOwnershipPercent = divideRanges(investorPositionValue, totalPlatformValue)

    milestones.push({
      year,
      homeServices,
      realEstate,
      aerialInsights,
      totalPlatformValue,
      investorPositionValue,
      blendedOwnershipPercent,
    })
  }

  return {
    multiples: POSITION_VALUATION_MULTIPLES,
    ownership,
    milestones,
  }
}
