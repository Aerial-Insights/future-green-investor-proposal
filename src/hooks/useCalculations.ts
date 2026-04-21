import { useMemo } from 'react'
import { useAssumptionsStore } from '../store/useAssumptionsStore'
import { calcAllYears, calcInvestorReturns, calcLongTermSREC, calcAerialResiduals } from '../data/investorPortal/formulas'
import type { YearlyOutputs, InvestorReturnSummary, LongTermSRECSummary, AerialResidualSummary } from '../data/investorPortal/formulas/types'

export function useCalculations(years: number = 5): YearlyOutputs[] {
  const assumptions = useAssumptionsStore((s) => s.assumptions)

  return useMemo(() => calcAllYears(assumptions, years), [assumptions, years])
}

export function useYear(year: number): YearlyOutputs {
  const allYears = useCalculations()
  return allYears[year - 1] ?? allYears[0]
}

export function useLatestYear(): YearlyOutputs {
  const allYears = useCalculations()
  return allYears[allYears.length - 1]
}

export function useInvestorReturns(): InvestorReturnSummary {
  const years = useCalculations()
  const totalCapital = useAssumptionsStore((s) => s.assumptions.capital.totalCapitalRaise)
  return useMemo(() => calcInvestorReturns(years, totalCapital), [years, totalCapital])
}

export function useLongTermSREC(): LongTermSRECSummary {
  const years = useCalculations()
  return useMemo(() => calcLongTermSREC(years), [years])
}

export function useAerialResiduals(): AerialResidualSummary {
  const years = useCalculations()
  const assumptions = useAssumptionsStore((s) => s.assumptions)
  return useMemo(
    () => calcAerialResiduals(years, assumptions),
    [years, assumptions]
  )
}
