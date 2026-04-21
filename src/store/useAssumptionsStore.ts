import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { BASE_ASSUMPTIONS, type AllAssumptions } from '../data/investorPortal/baseAssumptions'
import { SCENARIO_PRESETS, applyPreset, type ScenarioKey } from '../data/investorPortal/scenarioPresets'

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
        set(() => ({
          assumptions: applyPreset(BASE_ASSUMPTIONS, SCENARIO_PRESETS[scenario].overrides),
          activeScenario: scenario,
        })),

      resetToBase: () =>
        set(() => ({
          assumptions: { ...BASE_ASSUMPTIONS },
          activeScenario: 'base' as const,
        })),
    }),
    {
      name: 'investor-portal-assumptions',
      version: 16,
      migrate: () => {
        // Version 16: Add aerialMarketingMonthly to aerial assumptions.
        // Discard any old persisted state and start fresh.
        return {
          assumptions: { ...BASE_ASSUMPTIONS },
          activeScenario: 'base' as ScenarioKey | 'custom',
        }
      },
    }
  )
)
