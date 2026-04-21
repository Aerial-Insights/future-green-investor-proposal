import type { AllAssumptions } from '../baseAssumptions'
import type {
  PortfolioOutput,
  CapitalDeploymentOutput,
  ReturnTimelineOutput,
  YearlyOutputs,
  RealEstateFullOutput,
} from './types'
import { calcHomeServicesAll } from './homeServices'
import { calcSolarOperations } from './solarOperations'
import { calcOutreachFunnel, calcDealAllocation, calcWholesale } from './landAcquisition'
import { calcDistributedSolar } from './distributedSolar'
import { calcHousing } from './housingDev'
import { calcSubdivision } from './subdivision'
import { calcAerialInsights } from './aerialInsights'

// ─── REAL ESTATE COMBINED ───────────────────────────────────────────────────

function calcRealEstateAll(a: AllAssumptions, year: number): RealEstateFullOutput {
  const funnel = calcOutreachFunnel(a, year)
  const allocation = calcDealAllocation(a, year)
  const wholesale = calcWholesale(a, year)
  const distributedSolar = calcDistributedSolar(a, year)
  const housing = calcHousing(a, year)
  const subdivision = calcSubdivision(a, year)

  // Total revenue includes wholesale, distributed solar install revenue, housing, subdivision
  // Note: SREC revenue is tracked separately and does NOT count toward threshold
  const totalRevenue = wholesale.totalRevenue + distributedSolar.installRevenue +
    housing.totalMarketValue + subdivision.resaleRevenue
  const totalProfit = wholesale.totalProfit + distributedSolar.installRevenue * a.distributedSolar.installMargin +
    housing.totalProfit + subdivision.profit

  return {
    funnel,
    allocation,
    wholesale,
    distributedSolar,
    housing,
    subdivision,
    totalRevenue,
    totalProfit,
  }
}

// ─── PORTFOLIO AGGREGATION ──────────────────────────────────────────────────

function calcPortfolio(a: AllAssumptions, year: number): PortfolioOutput {
  const hs = calcHomeServicesAll(a, year)
  const solar = calcSolarOperations(a, year)
  const re = calcRealEstateAll(a, year)
  const aerial = calcAerialInsights(a, year)
  const ds = calcDistributedSolar(a, year)

  const homeServicesProfit = hs.totalProfitAnnual
  const solarOperationsProfit = solar.totalProfit
  // DS install profit is already included in realEstateProfit via calcRealEstateAll
  // We track it separately for reporting but do NOT add it again to totalProfit
  const distributedSolarProfit = ds.installRevenue * a.distributedSolar.installMargin
  const realEstateProfit = re.totalProfit
  // Aerial profit: high SaaS margins (~75%) minus scan costs minus marketing spend
  const aerialMarketingAnnual = a.aerial.aerialMarketingMonthly * 12
  const aerialProfit = aerial.annualRevenue * 0.75 - aerial.scanCostMonthly * 12 - aerialMarketingAnnual

  // realEstateProfit already includes distributedSolarProfit, so don't add it separately
  const totalProfit = homeServicesProfit + solarOperationsProfit + realEstateProfit + aerialProfit

  const homeServicesMix = totalProfit > 0 ? homeServicesProfit / totalProfit : 0
  const solarMix = totalProfit > 0 ? solarOperationsProfit / totalProfit : 0
  const distributedSolarMix = totalProfit > 0 ? distributedSolarProfit / totalProfit : 0
  const realEstateMix = totalProfit > 0 ? realEstateProfit / totalProfit : 0
  const aerialMix = totalProfit > 0 ? aerialProfit / totalProfit : 0

  return {
    totalProfit,
    homeServicesProfit,
    solarOperationsProfit,
    distributedSolarProfit,
    realEstateProfit,
    aerialProfit,
    homeServicesMix,
    solarMix,
    distributedSolarMix,
    realEstateMix,
    aerialMix,
  }
}

// ─── CAPITAL DEPLOYMENT ─────────────────────────────────────────────────────

function calcCapitalDeployment(a: AllAssumptions): CapitalDeploymentOutput {
  const c = a.capital
  return {
    distributedSolar: c.distributedSolar,
    homeServices: c.homeServices,
    marketing: c.marketing,
    aerialInsights: c.aerialInsights,
    wholesalePipeline: c.wholesalePipeline,
    lowIncomeHousing: c.lowIncomeHousing,
    strategicPartnerships: c.strategicPartnerships,
    totalDeployed: c.totalCapitalRaise,
  }
}

// ─── RETURN TIMELINE ────────────────────────────────────────────────────────

function calcReturnTimeline(a: AllAssumptions): ReturnTimelineOutput {
  const hsY1 = calcHomeServicesAll(a, 1)
  const wholesaleY1 = calcWholesale(a, 1)

  const solarY3 = calcSolarOperations(a, 3)
  const aerialY3 = calcAerialInsights(a, 3)

  const dsY5 = calcDistributedSolar(a, 5)
  const housingY5 = calcHousing(a, 5)

  return {
    nearTermProfit: hsY1.totalProfitAnnual + wholesaleY1.totalProfit,
    nearTermDescription: 'Home Services 4-channel profit and wholesale land flips generate immediate cash flow within months of deployment.',
    mediumTermProfit: solarY3.totalProfit + aerialY3.annualRevenue * 0.75,
    mediumTermDescription: 'Solar installations and Aerial Insights SaaS revenue scale through years 2-3 as sales teams grow and platform adoption increases.',
    longTermProfit: dsY5.srecRevenue + housingY5.totalProfit,
    longTermDescription: 'Distributed solar SREC revenue and housing development sale profits activate as install cohorts accumulate and homes are sold.',
  }
}

// ─── YEARLY OUTPUTS ─────────────────────────────────────────────────────────

export function calcYearlyOutputs(a: AllAssumptions, year: number): YearlyOutputs {
  return {
    year,
    homeServices: calcHomeServicesAll(a, year),
    solarOperations: calcSolarOperations(a, year),
    realEstate: calcRealEstateAll(a, year),
    aerial: calcAerialInsights(a, year),
    portfolio: calcPortfolio(a, year),
    capitalDeployment: calcCapitalDeployment(a),
    returnTimeline: calcReturnTimeline(a),
  }
}

export function calcAllYears(a: AllAssumptions, years: number = 5): YearlyOutputs[] {
  return Array.from({ length: years }, (_, i) => calcYearlyOutputs(a, i + 1))
}

export { calcRealEstateAll }
