import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  BASE_ASSUMPTIONS,
  type AllAssumptions,
  type FinancialModelOptionKey,
  type PercentageBackOptionConfig,
  type PartnershipOptionConfig,
  type GrowthPhaseKey,
  type GrowthDivisionKey,
  type PartnershipGovernance,
} from '../data/investorPortal/baseAssumptions'
import { SCENARIO_PRESETS, applyPreset, type ScenarioKey } from '../data/investorPortal/scenarioPresets'

type PartnershipShareKey =
  | 'homeServicesShare'
  | 'realEstateShare'
  | 'aerialInsightsShare'
  | 'postThresholdHomeServicesShare'
  | 'postThresholdRealEstateShare'
  | 'postThresholdAerialInsightsShare'
  | 'returnThresholdMultiple'

interface AssumptionsState {
  assumptions: AllAssumptions
  activeScenario: ScenarioKey | 'custom'
  setAssumption: <G extends keyof AllAssumptions>(
    group: G,
    key: keyof AllAssumptions[G],
    value: number
  ) => void
  applyScenarioPreset: (scenario: ScenarioKey) => void
  resetToBase: () => void
  // Financial model option setters
  setFinancialOption: (option: FinancialModelOptionKey) => void
  setPercentageBackConfig: <K extends keyof PercentageBackOptionConfig>(
    key: K,
    value: PercentageBackOptionConfig[K]
  ) => void
  setPartnershipShare: (key: PartnershipShareKey, value: number) => void
  setPartnershipHorizon: (years: number) => void
  setGrowthPhaseRate: (phase: GrowthPhaseKey, division: GrowthDivisionKey, rate: number) => void
  setGovernance: <K extends keyof PartnershipGovernance>(
    key: K,
    value: PartnershipGovernance[K]
  ) => void
}

export const useAssumptionsStore = create<AssumptionsState>()(
  persist(
    (set) => ({
      assumptions: { ...BASE_ASSUMPTIONS },
      activeScenario: 'base' as ScenarioKey | 'custom',

      setAssumption: (group, key, value) =>
        set((state) => {
          const updated = {
            ...state.assumptions,
            [group]: {
              ...state.assumptions[group],
              [key]: value,
            },
          }

          // Auto-interpolate Y2-Y4 solar spend when Y1 or Y5 changes
          if (group === 'distributedSolar' && (key === 'monthlySpendY1' || key === 'monthlySpendY5')) {
            const ds = updated.distributedSolar
            const y1 = ds.monthlySpendY1
            const y5 = ds.monthlySpendY5
            const step = (y5 - y1) / 4
            updated.distributedSolar = {
              ...ds,
              monthlySpendY2: Math.round(y1 + step),
              monthlySpendY3: Math.round(y1 + step * 2),
              monthlySpendY4: Math.round(y1 + step * 3),
            }
          }

          return { assumptions: updated, activeScenario: 'custom' as const }
        }),

      applyScenarioPreset: (scenario) =>
        set((state) => ({
          // Preserve existing financialModelOption — scenarios drive business
          // assumptions only, not the return-structure overlay
          assumptions: {
            ...applyPreset(BASE_ASSUMPTIONS, SCENARIO_PRESETS[scenario].overrides),
            financialModelOption: state.assumptions.financialModelOption,
          },
          activeScenario: scenario,
        })),

      resetToBase: () =>
        set(() => ({
          assumptions: { ...BASE_ASSUMPTIONS },
          activeScenario: 'base' as const,
        })),

      setFinancialOption: (option) =>
        set((state) => ({
          assumptions: {
            ...state.assumptions,
            financialModelOption: {
              ...state.assumptions.financialModelOption,
              selectedOption: option,
            },
          },
        })),

      setPercentageBackConfig: (key, value) =>
        set((state) => ({
          assumptions: {
            ...state.assumptions,
            financialModelOption: {
              ...state.assumptions.financialModelOption,
              percentageBack: {
                ...state.assumptions.financialModelOption.percentageBack,
                [key]: value,
              },
            },
          },
          activeScenario: 'custom' as const,
        })),

      setPartnershipShare: (key, value) =>
        set((state) => ({
          assumptions: {
            ...state.assumptions,
            financialModelOption: {
              ...state.assumptions.financialModelOption,
              partnership: {
                ...state.assumptions.financialModelOption.partnership,
                [key]: value,
              },
            },
          },
          activeScenario: 'custom' as const,
        })),

      setPartnershipHorizon: (years) =>
        set((state) => ({
          assumptions: {
            ...state.assumptions,
            financialModelOption: {
              ...state.assumptions.financialModelOption,
              partnership: {
                ...state.assumptions.financialModelOption.partnership,
                timeHorizonYears: years,
              },
            },
          },
          activeScenario: 'custom' as const,
        })),

      setGrowthPhaseRate: (phase, division, rate) =>
        set((state) => {
          const partnership = state.assumptions.financialModelOption.partnership
          return {
            assumptions: {
              ...state.assumptions,
              financialModelOption: {
                ...state.assumptions.financialModelOption,
                partnership: {
                  ...partnership,
                  growthPhases: {
                    ...partnership.growthPhases,
                    [phase]: {
                      ...partnership.growthPhases[phase],
                      [division]: rate,
                    },
                  },
                },
              },
            },
            activeScenario: 'custom' as const,
          }
        }),

      setGovernance: (key, value) =>
        set((state) => ({
          assumptions: {
            ...state.assumptions,
            financialModelOption: {
              ...state.assumptions.financialModelOption,
              partnership: {
                ...state.assumptions.financialModelOption.partnership,
                governance: {
                  ...state.assumptions.financialModelOption.partnership.governance,
                  [key]: value,
                },
              },
            },
          },
          activeScenario: 'custom' as const,
        })),
    }),
    {
      name: 'investor-portal-assumptions',
      version: 18,
      // Non-destructive migrate: preserves existing slider state when bumping
      // version. v18 introduces the partnership return-waterfall fields.
      migrate: (persistedState: unknown, fromVersion: number) => {
        const prev = (persistedState ?? {}) as {
          assumptions?: Partial<AllAssumptions>
          activeScenario?: ScenarioKey | 'custom'
        }
        if (fromVersion < 17) {
          return {
            assumptions: {
              ...BASE_ASSUMPTIONS,
              ...(prev.assumptions ?? {}),
              financialModelOption:
                prev.assumptions?.financialModelOption ?? BASE_ASSUMPTIONS.financialModelOption,
            },
            activeScenario: prev.activeScenario ?? ('base' as ScenarioKey | 'custom'),
          }
        }
        if (fromVersion < 18) {
          const prevPartnership =
            (prev.assumptions?.financialModelOption?.partnership ?? {}) as Partial<PartnershipOptionConfig>
          const partnershipDefaults = BASE_ASSUMPTIONS.financialModelOption.partnership
          return {
            assumptions: {
              ...BASE_ASSUMPTIONS,
              ...(prev.assumptions ?? {}),
              financialModelOption: {
                ...BASE_ASSUMPTIONS.financialModelOption,
                ...(prev.assumptions?.financialModelOption ?? {}),
                partnership: {
                  ...partnershipDefaults,
                  ...prevPartnership,
                  postThresholdHomeServicesShare:
                    prevPartnership.postThresholdHomeServicesShare ??
                    partnershipDefaults.postThresholdHomeServicesShare,
                  postThresholdRealEstateShare:
                    prevPartnership.postThresholdRealEstateShare ??
                    partnershipDefaults.postThresholdRealEstateShare,
                  postThresholdAerialInsightsShare:
                    prevPartnership.postThresholdAerialInsightsShare ??
                    partnershipDefaults.postThresholdAerialInsightsShare,
                  returnThresholdMultiple:
                    prevPartnership.returnThresholdMultiple ??
                    partnershipDefaults.returnThresholdMultiple,
                },
              },
            },
            activeScenario: prev.activeScenario ?? ('base' as ScenarioKey | 'custom'),
          }
        }
        return persistedState
      },
    }
  )
)
