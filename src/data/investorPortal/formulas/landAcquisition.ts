import type { AllAssumptions } from '../baseAssumptions'
import type {
  OutreachFunnelOutput,
  DealAllocationOutput,
  WholesaleOutput,
} from './types'

// ─── MAIL VOLUME BY YEAR ────────────────────────────────────────────────────
// Uses directMailGrowth from assumptions: 20K -> 30K -> 35K -> 40K -> 45K/month

function getMonthlyLetters(a: AllAssumptions, year: number): number {
  const g = a.directMailGrowth
  const base = g.y1LettersPerMonth
  const scale = base > 0 ? a.realEstate.mailVolumePerMonth / base : 1
  const volumes: Record<number, number> = {
    1: g.y1LettersPerMonth * scale,
    2: g.y2LettersPerMonth * scale,
    3: g.y3LettersPerMonth * scale,
    4: g.y4LettersPerMonth * scale,
    5: g.y5LettersPerMonth * scale,
  }
  return volumes[year] ?? g.y5LettersPerMonth * scale
}

// ─── OUTREACH FUNNEL ────────────────────────────────────────────────────────
// Mail -> 1% response -> 40% lead rate -> 45% close rate
// Y1: 20,000/month × 12 = 240,000 annual letters -> 432 deals

export function calcOutreachFunnel(a: AllAssumptions, year: number): OutreachFunnelOutput {
  const re = a.realEstate
  const monthlyLetters = getMonthlyLetters(a, year)
  const monthlyResponses = monthlyLetters * re.responseRate // 1%
  const monthlyQualifiedLeads = monthlyResponses * re.leadRate // 40%
  const monthlyAcquisitions = monthlyQualifiedLeads * re.closeRate // 45%
  const annualAcquisitions = monthlyAcquisitions * 12
  const annualAcresAcquired = annualAcquisitions * re.averageParcelSize

  return {
    monthlyLetters,
    monthlyResponses,
    monthlyQualifiedLeads,
    monthlyAcquisitions,
    annualAcquisitions,
    annualAcresAcquired,
  }
}

// ─── DEAL ALLOCATION ────────────────────────────────────────────────────────
// Wholesale: 65%, Housing+Subdivide: 35% (20% housing, 80% subdivide)

export function calcDealAllocation(a: AllAssumptions, year: number): DealAllocationOutput {
  const funnel = calcOutreachFunnel(a, year)
  const total = funnel.annualAcquisitions
  const re = a.realEstate
  const parcelSize = re.averageParcelSize

  const wholesaleDeals = total * re.wholesaleAllocation
  const housingSubdivideDeals = total * re.housingSubdivideAllocation
  const housingDeals = housingSubdivideDeals * re.housingShareOfHousingSubdivide
  const subdivisionDeals = housingSubdivideDeals * re.subdivisionShareOfHousingSubdivide

  return {
    wholesaleDeals,
    housingDeals,
    subdivisionDeals,
    wholesaleAcres: wholesaleDeals * parcelSize,
    housingAcres: housingDeals * parcelSize,
    subdivisionAcres: subdivisionDeals * parcelSize,
  }
}

// ─── WHOLESALE ──────────────────────────────────────────────────────────────
// 65% of deals at $18,000 assignment fee

export function calcWholesale(a: AllAssumptions, year: number): WholesaleOutput {
  const allocation = calcDealAllocation(a, year)
  const totalRevenue = allocation.wholesaleDeals * a.realEstate.averageAssignmentFee
  // Wholesale is high margin - minimal holding costs
  const totalProfit = totalRevenue * 0.85

  return {
    totalDeals: allocation.wholesaleDeals,
    totalRevenue,
    totalProfit,
  }
}
