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
import { calcSolarFarm, calcSolarFarmRevenue } from './solarFarms'
import { calcHousing } from './housingDev'
import { calcSubdivision } from './subdivision'
import { calcAerialInsights } from './aerialInsights'

// ─── REAL ESTATE COMBINED ───────────────────────────────────────────────────

function calcRealEstateAll(a: AllAssumptions, year: number): RealEstateFullOutput {
  const funnel = calcOutreachFunnel(a, year)
  const allocation = calcDealAllocation(a, year)
  const wholesale = calcWholesale(a, year)
  const solarFarm = calcSolarFarm(a, year)
  const housing = calcHousing(a, year)
  const subdivision = calcSubdivision(a, year)

  // Solar farm revenue comes from cumulative active acres
  const solarFarmActiveRevenue = calcSolarFarmRevenue(a, year)

  const totalRevenue = wholesale.totalRevenue + solarFarmActiveRevenue +
    housing.totalMarketValue + subdivision.resaleRevenue
  const totalProfit = wholesale.totalProfit + solarFarmActiveRevenue * 0.60 +
    housing.totalProfit + subdivision.profit

  return {
    funnel,
    allocation,
    wholesale,
    solarFarm,
    housing,
    subdivision,
    totalRevenue,
    totalProfit,
  }
}

// ─── PORTFOLIO AGGREGATION ──────────────────────────────────────────────────
// 5-year profit totals from spreadsheet:
// Y1: $8,200,400 | Y2: $15,425,600 | Y3: $24,663,200 | Y4: $41,400,800 | Y5: $73,138,400

function calcPortfolio(a: AllAssumptions, year: number): PortfolioOutput {
  const hs = calcHomeServicesAll(a, year)
  const solar = calcSolarOperations(a, year)
  const re = calcRealEstateAll(a, year)
  const aerial = calcAerialInsights(a, year)

  const homeServicesProfit = hs.totalProfitAnnual
  const solarOperationsProfit = solar.totalProfit
  const realEstateProfit = re.totalProfit
  // Aerial profit: high SaaS margins (~75%) minus scan costs
  const aerialProfit = aerial.annualRevenue * 0.75 - aerial.scanCostMonthly * 12

  const totalProfit = homeServicesProfit + solarOperationsProfit + realEstateProfit + aerialProfit

  const homeServicesMix = totalProfit > 0 ? homeServicesProfit / totalProfit : 0
  const solarMix = totalProfit > 0 ? solarOperationsProfit / totalProfit : 0
  const realEstateMix = totalProfit > 0 ? realEstateProfit / totalProfit : 0
  const aerialMix = totalProfit > 0 ? aerialProfit / totalProfit : 0

  return {
    totalProfit,
    homeServicesProfit,
    solarOperationsProfit,
    realEstateProfit,
    aerialProfit,
    homeServicesMix,
    solarMix,
    realEstateMix,
    aerialMix,
  }
}

// ─── CAPITAL DEPLOYMENT ─────────────────────────────────────────────────────

function calcCapitalDeployment(a: AllAssumptions): CapitalDeploymentOutput {
  const c = a.capital
  const solarFarms = c.solarFarms
  const lowIncomeHousing = c.lowIncomeHousing
  const landAcquisitions = c.landAcquisitions
  const homeServiceOperations = c.homeServiceOperations
  const aerialInsights = c.aerialInsightsDVP + c.aerialInsightsDATA + c.aerialInsightsMRT
  const marketing = c.totalCapitalRaise - solarFarms - lowIncomeHousing - landAcquisitions - homeServiceOperations - aerialInsights
  return {
    solarFarms,
    lowIncomeHousing,
    landAcquisitions,
    homeServiceOperations,
    aerialInsights,
    marketing,
    totalDeployed: c.totalCapitalRaise,
  }
}

// ─── RETURN TIMELINE ────────────────────────────────────────────────────────

function calcReturnTimeline(a: AllAssumptions): ReturnTimelineOutput {
  const hsY1 = calcHomeServicesAll(a, 1)
  const wholesaleY1 = calcWholesale(a, 1)

  const solarY3 = calcSolarOperations(a, 3)
  const aerialY3 = calcAerialInsights(a, 3)

  const solarFarmY5 = calcSolarFarmRevenue(a, 5)
  const housingY5 = calcHousing(a, 5)

  return {
    nearTermProfit: hsY1.totalProfitAnnual + wholesaleY1.totalProfit,
    nearTermDescription: 'Home Services 4-channel profit and wholesale land flips generate immediate cash flow within months of deployment.',
    mediumTermProfit: solarY3.totalProfit + aerialY3.annualRevenue * 0.75,
    mediumTermDescription: 'Solar installations and Aerial Insights SaaS revenue scale through years 2-3 as sales teams grow and platform adoption increases.',
    longTermProfit: solarFarmY5 * 0.60 + housingY5.totalProfit,
    longTermDescription: 'Solar farm SREC revenue and housing development sale profits activate in years 3-5 as development projects complete and homes are sold.',
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
