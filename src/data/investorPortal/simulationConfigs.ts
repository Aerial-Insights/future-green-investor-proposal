// ─── SIMULATION PANEL CONFIGURATIONS ────────────────────────────────────────
// Keyed by BudgetCategory.key → BudgetLineItem.label, mirroring DEPLOYMENT_OUTPUTS.
// Each config defines sliders and a calculate function for its expandable panel.

import { BASE_ASSUMPTIONS } from './baseAssumptions'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatWholeNumber } from '../../utils/formatNumber'
import {
  calcLeadConversion,
  calcSRECRevenue,
  calcBlendedServiceEconomics,
  calcSubscriptionChurn,
  calcWholesaleProjection,
  getGrantsServiceWeights,
  getRetargetingServiceWeights,
  getCommercialBlendedProfit,
} from '../../utils/simulationCalculators'

// ── Types ───────────────────────────────────────────────────────────────────

export interface SliderConfig {
  key: string
  label: string
  min: number
  max: number
  step: number
  defaultValue: number
  format: (v: number) => string
}

export interface OutputMetric {
  label: string
  value: string
  highlight?: boolean
}

export interface SimulationConfig {
  sliders: SliderConfig[]
  startingLabel: string
  calculate: (
    sliderValues: Record<string, number>,
    baseQuantity: number,
  ) => OutputMetric[]
}

// ── Formatters ──────────────────────────────────────────────────────────────

const fmtPct = (v: number) => `${(v * 100).toFixed(0)}%`
const fmtDollar = (v: number) => formatCurrency(v)

// ── Configs ─────────────────────────────────────────────────────────────────

export const SIMULATION_CONFIGS: Record<string, Record<string, SimulationConfig>> = {

  // ═══════════════════════════════════════════════════════════════════════════
  // MARKETING
  // ═══════════════════════════════════════════════════════════════════════════
  marketing: {

    // 1A — Solar Customer Acquisition
    'Solar Customer Acquisition': {
      startingLabel: 'solar leads',
      sliders: [
        { key: 'conversion', label: 'Lead-to-Install Conversion', min: 0.10, max: 0.50, step: 0.01, defaultValue: 0.20, format: fmtPct },
      ],
      calculate(sv, baseQty) {
        const installs = Math.floor(baseQty * sv.conversion)
        const { annualNetSREC } = calcSRECRevenue(installs)
        return [
          { label: 'Converted Installs', value: formatWholeNumber(installs) },
          { label: 'Annual SREC Revenue', value: formatCurrency(annualNetSREC), highlight: true },
        ]
      },
    },

    // 1B — PPC (High Intent Only) — Grants
    'PPC (High Intent Only)': {
      startingLabel: 'high-intent grant leads',
      sliders: [
        { key: 'conversion', label: 'Lead-to-Job Conversion', min: 0.10, max: 0.50, step: 0.01, defaultValue: 0.20, format: fmtPct },
      ],
      calculate(sv, baseQty) {
        const weights = getGrantsServiceWeights()
        const { blendedRevenue, blendedProfit } = calcBlendedServiceEconomics(weights)
        const jobs = Math.floor(baseQty * sv.conversion)
        return [
          { label: 'Converted Jobs', value: formatWholeNumber(jobs) },
          { label: 'Total Revenue', value: formatCurrency(jobs * blendedRevenue), highlight: true },
          { label: 'Total Profit', value: formatCurrency(jobs * blendedProfit) },
        ]
      },
    },

    // 1C — Direct Mail Campaigns (Roofing)
    'Direct Mail Campaigns (Land Acquisition)': {
      startingLabel: 'roofing leads',
      sliders: [
        { key: 'conversion', label: 'Lead-to-Job Conversion', min: 0.10, max: 0.50, step: 0.01, defaultValue: 0.20, format: fmtPct },
      ],
      calculate(sv, baseQty) {
        const se = BASE_ASSUMPTIONS.serviceEconomics
        const { convertedJobs, totalRevenue, totalProfit } = calcLeadConversion(
          baseQty, sv.conversion, se.roofingRevenuePerJob, se.roofingMargin,
        )
        return [
          { label: 'Converted Roofing Jobs', value: formatWholeNumber(convertedJobs) },
          { label: 'Total Revenue', value: formatCurrency(totalRevenue), highlight: true },
          { label: 'Total Profit', value: formatCurrency(totalProfit) },
        ]
      },
    },

    // 1D — Commercial Campaigns
    'Commercial Campaigns': {
      startingLabel: 'commercial leads',
      sliders: [
        { key: 'conversion', label: 'Lead-to-Job Conversion', min: 0.10, max: 0.50, step: 0.01, defaultValue: 0.20, format: fmtPct },
        { key: 'avgProfit', label: 'Avg Profit per Job', min: 20000, max: 70000, step: 1000, defaultValue: Math.round(getCommercialBlendedProfit()), format: fmtDollar },
      ],
      calculate(sv, baseQty) {
        const jobs = Math.floor(baseQty * sv.conversion)
        return [
          { label: 'Converted Jobs', value: formatWholeNumber(jobs) },
          { label: 'Total Profit', value: formatCurrency(jobs * sv.avgProfit), highlight: true },
        ]
      },
    },

    // 1E — Retargeting Campaigns
    'Retargeting Campaigns': {
      startingLabel: 'retargeted leads',
      sliders: [
        { key: 'conversion', label: 'Lead-to-Job Conversion', min: 0.10, max: 0.50, step: 0.01, defaultValue: 0.15, format: fmtPct },
      ],
      calculate(sv, baseQty) {
        const weights = getRetargetingServiceWeights()
        const { blendedRevenue } = calcBlendedServiceEconomics(weights)
        const jobs = Math.floor(baseQty * sv.conversion)
        return [
          { label: 'Converted Jobs', value: formatWholeNumber(jobs) },
          { label: 'Total Revenue', value: formatCurrency(jobs * blendedRevenue), highlight: true },
        ]
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // AERIAL INSIGHTS
  // ═══════════════════════════════════════════════════════════════════════════
  aerialInsights: {

    // 2A — PPC Marketing
    'PPC Marketing (Avg. CAC $150)': {
      startingLabel: 'new user accounts',
      sliders: [
        { key: 'subscription', label: 'Monthly Subscription', min: 800, max: 2500, step: 50, defaultValue: BASE_ASSUMPTIONS.aerial.subscriptionMonthly, format: fmtDollar },
        { key: 'churn', label: 'Monthly Churn Rate', min: 0.01, max: 0.10, step: 0.005, defaultValue: BASE_ASSUMPTIONS.aerial.churnRate, format: fmtPct },
      ],
      calculate(sv, baseQty) {
        const { month1Revenue, month12Revenue, cumulativeRevenue12Mo } = calcSubscriptionChurn(
          baseQty, sv.subscription, sv.churn,
        )
        return [
          { label: 'Month 1 Revenue', value: formatCurrency(month1Revenue) },
          { label: 'Month 12 Revenue', value: formatCurrency(month12Revenue) },
          { label: '12-Month Revenue (Churn-Adjusted)', value: formatCurrency(cumulativeRevenue12Mo), highlight: true },
        ]
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // WHOLESALE PIPELINE
  // ═══════════════════════════════════════════════════════════════════════════
  wholesalePipeline: {

    // 4A — Direct Mail Campaigns (Wholesale)
    'Direct Mail Campaigns': {
      startingLabel: 'land deal conversions',
      sliders: [
        { key: 'conversion', label: 'Conversion Rate', min: 0.10, max: 0.50, step: 0.01, defaultValue: 0.30, format: fmtPct },
        { key: 'wholesaleFee', label: 'Average Wholesale Fee', min: 8000, max: 25000, step: 1000, defaultValue: 15000, format: fmtDollar },
        { key: 'allocation', label: 'Wholesale Allocation', min: 0.50, max: 1.00, step: 0.05, defaultValue: 0.75, format: fmtPct },
      ],
      calculate(sv, baseQty) {
        const { convertedDeals, wholesaleDeals, totalWholesaleRevenue } = calcWholesaleProjection(
          baseQty, sv.conversion, sv.wholesaleFee, sv.allocation,
        )
        return [
          { label: 'Converted Deals', value: formatWholeNumber(convertedDeals) },
          { label: 'Wholesale Deals', value: formatWholeNumber(wholesaleDeals) },
          { label: 'Total Wholesale Revenue', value: formatCurrency(totalWholesaleRevenue), highlight: true },
        ]
      },
    },

    // 4B — Paid Leads Campaigns
    'Paid Leads Campaigns': {
      startingLabel: 'paid leads',
      sliders: [
        { key: 'conversion', label: 'Conversion Rate', min: 0.10, max: 0.50, step: 0.01, defaultValue: 0.15, format: fmtPct },
        { key: 'wholesaleFee', label: 'Average Wholesale Fee', min: 8000, max: 25000, step: 1000, defaultValue: 15000, format: fmtDollar },
        { key: 'allocation', label: 'Wholesale Allocation', min: 0.50, max: 1.00, step: 0.05, defaultValue: 0.75, format: fmtPct },
      ],
      calculate(sv, baseQty) {
        const { convertedDeals, wholesaleDeals, totalWholesaleRevenue } = calcWholesaleProjection(
          baseQty, sv.conversion, sv.wholesaleFee, sv.allocation,
        )
        return [
          { label: 'Converted Deals', value: formatWholeNumber(convertedDeals) },
          { label: 'Wholesale Deals', value: formatWholeNumber(wholesaleDeals) },
          { label: 'Total Wholesale Revenue', value: formatCurrency(totalWholesaleRevenue), highlight: true },
        ]
      },
    },
  },
}
