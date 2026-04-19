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
        set((state) => ({
          assumptions: {
            ...state.assumptions,
            [group]: {
              ...state.assumptions[group],
              [key]: value,
            },
          },
          activeScenario: 'custom' as const,
        })),

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
      version: 7,
      migrate: () => {
        // Version 7: Updated directMailGrowth defaults (20K-50K smooth) + wholesale tab restructuring.
        // Discard any old persisted state and start fresh.
        return {
          assumptions: { ...BASE_ASSUMPTIONS },
          activeScenario: 'base' as ScenarioKey | 'custom',
        }
      },
    }
  )
)
