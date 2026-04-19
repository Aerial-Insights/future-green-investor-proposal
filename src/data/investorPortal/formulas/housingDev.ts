import type { AllAssumptions } from '../baseAssumptions'
import type { HousingOutput } from './types'

// ─── HOUSING UNIT GOALS BY YEAR (BUILD-TO-SELL) ────────────────────────────
// Y1: 0, Y2: 10, Y3: 25, Y4: 40, Y5: 60
// Build cost: $180,000 | Market value: $300,000 | Profit per home: $120,000

function homesGoalByYear(year: number): number {
  const goals: Record<number, number> = { 1: 0, 2: 10, 3: 25, 4: 40, 5: 60 }
  return goals[year] ?? 0
}

// ─── HOUSING DEVELOPMENT (BUILD-TO-SELL) ───────────────────────────────────
// Primary strategy: build homes and sell them for realized profit
// $180K build cost, $300K market value, $120K profit per home

export function calcHousing(a: AllAssumptions, year: number): HousingOutput {
  const buildCostPerUnit = 180000
  const marketValuePerUnit = 300000
  const profitPerUnit = marketValuePerUnit - buildCostPerUnit

  const homesBuilt = homesGoalByYear(year)
  const totalBuildCost = homesBuilt * buildCostPerUnit
  const totalMarketValue = homesBuilt * marketValuePerUnit
  const totalProfit = homesBuilt * profitPerUnit

  return {
    homesBuilt,
    buildCostPerUnit,
    marketValuePerUnit,
    profitPerUnit,
    totalBuildCost,
    totalMarketValue,
    totalProfit,
  }
}
