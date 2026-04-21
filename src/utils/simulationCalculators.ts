// ─── SIMULATION CALCULATORS ─────────────────────────────────────────────────
// Pure functions for the expandable simulation panels on Capital Deployment.
// All canonical values imported from BASE_ASSUMPTIONS.

import { BASE_ASSUMPTIONS } from '../data/investorPortal/baseAssumptions'

// ── Lead Conversion ─────────────────────────────────────────────────────────

export function calcLeadConversion(
  leads: number,
  conversionRate: number,
  revenuePerJob: number,
  margin: number,
) {
  const convertedJobs = Math.floor(leads * conversionRate)
  const totalRevenue = convertedJobs * revenuePerJob
  const totalProfit = convertedJobs * revenuePerJob * margin
  return { convertedJobs, totalRevenue, totalProfit }
}

// ── SREC Revenue from Installs ──────────────────────────────────────────────

export function calcSRECRevenue(installs: number) {
  const { srecsPerInstall, srecValue, srecAdminRate } = BASE_ASSUMPTIONS.distributedSolar
  const annualGrossSREC = installs * srecsPerInstall * srecValue
  const annualNetSREC = annualGrossSREC * (1 - srecAdminRate)
  return { annualGrossSREC, annualNetSREC }
}

// ── Blended Service Economics ───────────────────────────────────────────────

export interface ServiceWeight {
  weight: number
  revenuePerJob: number
  margin: number
}

export function calcBlendedServiceEconomics(services: ServiceWeight[]) {
  let blendedRevenue = 0
  let blendedProfit = 0
  for (const s of services) {
    blendedRevenue += s.weight * s.revenuePerJob
    blendedProfit += s.weight * s.revenuePerJob * s.margin
  }
  return { blendedRevenue, blendedProfit }
}

/** PPC Grants blend: HVAC 40%, Insulation 30%, Water Heater 30% */
export function getGrantsServiceWeights(): ServiceWeight[] {
  const se = BASE_ASSUMPTIONS.serviceEconomics
  return [
    { weight: 0.40, revenuePerJob: se.hvacRevenuePerJob, margin: se.hvacMargin },
    { weight: 0.30, revenuePerJob: se.insulationRevenuePerJob, margin: se.insulationMargin },
    { weight: 0.30, revenuePerJob: se.waterHeaterRevenuePerJob, margin: se.waterHeaterMargin },
  ]
}

/** Retargeting blend: equal weight across all residential services */
export function getRetargetingServiceWeights(): ServiceWeight[] {
  const se = BASE_ASSUMPTIONS.serviceEconomics
  const services = [
    { revenuePerJob: se.roofingRevenuePerJob, margin: se.roofingMargin },
    { revenuePerJob: se.hvacRevenuePerJob, margin: se.hvacMargin },
    { revenuePerJob: se.insulationRevenuePerJob, margin: se.insulationMargin },
    { revenuePerJob: se.waterHeaterRevenuePerJob, margin: se.waterHeaterMargin },
    { revenuePerJob: se.airSealingRevenuePerJob, margin: se.airSealingMargin },
  ]
  const weight = 1 / services.length
  return services.map((s) => ({ ...s, weight }))
}

/** Commercial blend: equal weight across commercial services */
export function getCommercialBlendedProfit(): number {
  const se = BASE_ASSUMPTIONS.serviceEconomics
  const profits = [
    se.commercialRoofingRevenuePerJob * se.commercialRoofingMargin,
    se.commercialSolarRevenuePerJob * se.commercialSolarMargin,
    se.commercialLightingRevenuePerJob * se.commercialLightingMargin,
  ]
  return profits.reduce((a, b) => a + b, 0) / profits.length
}

// ── Subscription Churn ──────────────────────────────────────────────────────

export function calcSubscriptionChurn(
  users: number,
  monthlySubscription: number,
  monthlyChurnRate: number,
) {
  const month1Revenue = users * monthlySubscription
  let cumulativeRevenue = 0
  let month12Revenue = 0
  for (let m = 0; m < 12; m++) {
    const retained = users * Math.pow(1 - monthlyChurnRate, m)
    const monthRevenue = retained * monthlySubscription
    cumulativeRevenue += monthRevenue
    if (m === 11) month12Revenue = monthRevenue
  }
  return { month1Revenue, month12Revenue, cumulativeRevenue12Mo: cumulativeRevenue }
}

// ── Wholesale Projection ────────────────────────────────────────────────────

export function calcWholesaleProjection(
  leads: number,
  conversionRate: number,
  wholesaleFee: number,
  wholesaleAllocation: number,
) {
  const convertedDeals = Math.floor(leads * conversionRate)
  const wholesaleDeals = Math.floor(convertedDeals * wholesaleAllocation)
  const totalWholesaleRevenue = wholesaleDeals * wholesaleFee
  return { convertedDeals, wholesaleDeals, totalWholesaleRevenue }
}
