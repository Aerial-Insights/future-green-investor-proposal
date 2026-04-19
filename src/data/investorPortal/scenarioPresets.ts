import type { AllAssumptions } from './baseAssumptions'

type DeepPartial<T> = { [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P] }

export type ScenarioKey = 'conservative' | 'base' | 'growth' | 'aggressive'

export interface ScenarioPreset {
  key: ScenarioKey
  label: string
  description: string
  overrides: DeepPartial<AllAssumptions>
}

export const SCENARIO_PRESETS: Record<ScenarioKey, ScenarioPreset> = {
  conservative: {
    key: 'conservative',
    label: 'Conservative',
    description: 'Lower growth rates, tighter margins, slower deployment',
    overrides: {
      sales: {
        reps: 12,
        d2dConversionRate: 0.01,
        doorsPerRepPerDay: 25,
        directMailPiecesPerMonth: 15000,
        commercialAdSpendMonthly: 20000,
        grantsPPCSpendMonthly: 20000,
      },
      realEstate: {
        mailVolumePerMonth: 15000,
        responseRate: 0.008,
        closeRate: 0.08,
      },
      solarFarm: {
        dcQualificationRate: 0.30,
        annualSRECRevenuePerAcre: 125000,
        upfrontSRECValuePerAcre: 275000,
      },
      housing: {
        occupancyRate: 0.85,
        capRate: 0.07,
      },
      aerial: {
        startingUsers: 300,
        monthlyGrowthRate: 0.08,
        churnRate: 0.06,
      },
    },
  },

  base: {
    key: 'base',
    label: 'Base Case',
    description: 'Realistic growth based on current trajectory and market conditions',
    overrides: {},
  },

  growth: {
    key: 'growth',
    label: 'Growth Case',
    description: 'Accelerated scaling with expanded sales force and market penetration',
    overrides: {
      sales: {
        reps: 20,
        d2dConversionRate: 0.02,
        doorsPerRepPerDay: 35,
        directMailPiecesPerMonth: 25000,
        commercialAdSpendMonthly: 40000,
        grantsPPCSpendMonthly: 40000,
      },
      realEstate: {
        mailVolumePerMonth: 25000,
        responseRate: 0.012,
        closeRate: 0.12,
      },
      solarFarm: {
        dcQualificationRate: 0.50,
        annualSRECRevenuePerAcre: 155000,
        upfrontSRECValuePerAcre: 300000,
      },
      housing: {
        occupancyRate: 0.93,
        capRate: 0.055,
      },
      aerial: {
        startingUsers: 700,
        monthlyGrowthRate: 0.15,
        churnRate: 0.035,
      },
    },
  },

  aggressive: {
    key: 'aggressive',
    label: 'Aggressive Scale',
    description: 'Maximum deployment speed, expanded geography, full platform leverage',
    overrides: {
      sales: {
        reps: 30,
        d2dConversionRate: 0.025,
        doorsPerRepPerDay: 40,
        directMailPiecesPerMonth: 35000,
        commercialAdSpendMonthly: 60000,
        grantsPPCSpendMonthly: 60000,
      },
      realEstate: {
        mailVolumePerMonth: 30000,
        responseRate: 0.015,
        closeRate: 0.15,
        averageAssignmentFee: 22000,
      },
      solarFarm: {
        dcQualificationRate: 0.55,
        annualSRECRevenuePerAcre: 167000,
        upfrontSRECValuePerAcre: 327000,
      },
      housing: {
        occupancyRate: 0.95,
        rentPerUnitMonthly: 2500,
        capRate: 0.05,
      },
      aerial: {
        startingUsers: 1000,
        monthlyGrowthRate: 0.18,
        churnRate: 0.03,
      },
    },
  },
}

export function applyPreset(
  base: AllAssumptions,
  preset: DeepPartial<AllAssumptions>
): AllAssumptions {
  const result = JSON.parse(JSON.stringify(base)) as AllAssumptions
  for (const groupKey of Object.keys(preset) as (keyof AllAssumptions)[]) {
    const overrides = preset[groupKey]
    if (overrides && typeof overrides === 'object') {
      for (const key of Object.keys(overrides)) {
        const value = (overrides as unknown as Record<string, unknown>)[key]
        if (value !== undefined) {
          ;(result[groupKey] as unknown as Record<string, unknown>)[key] = value
        }
      }
    }
  }
  return result
}
