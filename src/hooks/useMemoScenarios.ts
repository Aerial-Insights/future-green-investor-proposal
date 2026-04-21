import { useMemo } from 'react'
import { BASE_ASSUMPTIONS } from '../data/investorPortal/baseAssumptions'
import { SCENARIO_PRESETS, applyPreset } from '../data/investorPortal/scenarioPresets'
import type { ScenarioKey } from '../data/investorPortal/scenarioPresets'
import { calcAllYears, calcInvestorReturns } from '../data/investorPortal/formulas'
import type { YearlyOutputs, InvestorReturnSummary } from '../data/investorPortal/formulas/types'

export interface ScenarioResult {
  key: ScenarioKey
  label: string
  description: string
  years: YearlyOutputs[]
  returns: InvestorReturnSummary
}

export function useMemoScenarios(): Record<ScenarioKey, ScenarioResult> {
  return useMemo(() => {
    const results = {} as Record<ScenarioKey, ScenarioResult>
    for (const [key, preset] of Object.entries(SCENARIO_PRESETS)) {
      const assumptions = applyPreset(BASE_ASSUMPTIONS, preset.overrides)
      const years = calcAllYears(assumptions, 5)
      const returns = calcInvestorReturns(years, assumptions.capital.totalCapitalRaise)
      results[key as ScenarioKey] = {
        key: key as ScenarioKey,
        label: preset.label,
        description: preset.description,
        years,
        returns,
      }
    }
    return results
  }, [])
}
