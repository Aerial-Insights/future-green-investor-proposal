import { useMemo } from 'react'
import { useAssumptionsStore } from '../store/useAssumptionsStore'
import {
  calcAllYears,
  calcInvestorReturns,
  calcLongTermSREC,
  calcAerialResiduals,
  calcExtendedYears,
  calcPartnershipReturns,
  calcPartnershipPositionValue,
} from '../data/investorPortal/formulas'
import type {
  YearlyOutputs,
  InvestorReturnSummary,
  LongTermSRECSummary,
  AerialResidualSummary,
  ExtendedYearOutput,
  PartnershipReturnSummary,
  PartnershipPositionValueSummary,
} from '../data/investorPortal/formulas/types'
import type { FinancialModelOptionKey } from '../data/investorPortal/baseAssumptions'

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
  const config = useAssumptionsStore((s) => s.assumptions.financialModelOption.percentageBack)
  return useMemo(
    () =>
      calcInvestorReturns(years, totalCapital, {
        homeServicesShare: config.homeServicesShare,
        solarRealEstateShare: config.solarRealEstateShare,
        aerialShare: config.aerialShare,
        srecShare: config.srecShare,
        aerialResidualShare: config.aerialResidualShare,
        returnThresholdMultiple: config.returnThresholdMultiple,
      }),
    [years, totalCapital, config]
  )
}

export function useLongTermSREC(): LongTermSRECSummary {
  const years = useCalculations()
  const srecShare = useAssumptionsStore(
    (s) => s.assumptions.financialModelOption.percentageBack.srecShare
  )
  const srecLifespan = useAssumptionsStore((s) => s.assumptions.distributedSolar.srecLifespan)
  return useMemo(
    () => calcLongTermSREC(years, srecShare, srecLifespan),
    [years, srecShare, srecLifespan]
  )
}

export function useAerialResiduals(): AerialResidualSummary {
  const years = useCalculations()
  const assumptions = useAssumptionsStore((s) => s.assumptions)
  return useMemo(
    () => calcAerialResiduals(years, assumptions),
    [years, assumptions]
  )
}

// ─── PARTNERSHIP OPTION HOOKS ──────────────────────────────────────────────

export function useFinancialOption(): FinancialModelOptionKey {
  return useAssumptionsStore((s) => s.assumptions.financialModelOption.selectedOption)
}

export function useExtendedYears(): ExtendedYearOutput[] {
  const baseYears = useCalculations()
  const partnership = useAssumptionsStore(
    (s) => s.assumptions.financialModelOption.partnership
  )
  return useMemo(
    () =>
      calcExtendedYears({
        baseYears,
        totalYears: partnership.timeHorizonYears,
        growthPhases: partnership.growthPhases,
      }),
    [baseYears, partnership.timeHorizonYears, partnership.growthPhases]
  )
}

export function usePartnershipReturns(): PartnershipReturnSummary {
  const extendedYears = useExtendedYears()
  const totalCapital = useAssumptionsStore((s) => s.assumptions.capital.totalCapitalRaise)
  const partnership = useAssumptionsStore(
    (s) => s.assumptions.financialModelOption.partnership
  )
  return useMemo(
    () => calcPartnershipReturns(extendedYears, totalCapital, partnership),
    [extendedYears, totalCapital, partnership]
  )
}

export function usePartnershipPositionValue(): PartnershipPositionValueSummary {
  const extendedYears = useExtendedYears()
  const partnership = useAssumptionsStore(
    (s) => s.assumptions.financialModelOption.partnership
  )
  return useMemo(
    () => calcPartnershipPositionValue(extendedYears, partnership),
    [extendedYears, partnership]
  )
}
