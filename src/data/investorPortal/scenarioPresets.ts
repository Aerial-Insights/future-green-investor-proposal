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
        closeRate: 0.38,
      },
      distributedSolar: {
        leadCost: 250,
        conversionRate: 0.06,
        srecValue: 350,
        monthlySpendY1: 35000,
        monthlySpendY2: 60000,
        monthlySpendY3: 90000,
        monthlySpendY4: 120000,
        monthlySpendY5: 150000,
        srecAdminRate: 0.18,
      },
      housing: {
        occupancyRate: 0.85,
        capRate: 0.07,
      },
      aerial: {
        startingUsers: 300,
        monthlyGrowthRate: 0.05,
        churnRate: 0.04,
        yearEndTargets: [800, 2500, 5000, 8000, 12000],
        aerialMarketingMonthly: 10000,
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
        closeRate: 0.55,
      },
      distributedSolar: {
        leadCost: 180,
        conversionRate: 0.10,
        srecValue: 425,
        monthlySpendY1: 60000,
        monthlySpendY2: 100000,
        monthlySpendY3: 140000,
        monthlySpendY4: 185000,
        monthlySpendY5: 230000,
        srecAdminRate: 0.12,
      },
      housing: {
        occupancyRate: 0.93,
        capRate: 0.055,
      },
      aerial: {
        startingUsers: 700,
        monthlyGrowthRate: 0.08,
        churnRate: 0.03,
        yearEndTargets: [2000, 7000, 14000, 22000, 35000],
        aerialMarketingMonthly: 50000,
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
        closeRate: 0.70,
        averageAssignmentFee: 22000,
      },
      distributedSolar: {
        leadCost: 160,
        conversionRate: 0.12,
        srecValue: 450,
        monthlySpendY1: 75000,
        monthlySpendY2: 130000,
        monthlySpendY3: 175000,
        monthlySpendY4: 220000,
        monthlySpendY5: 275000,
        srecAdminRate: 0.10,
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
        yearEndTargets: [3000, 10000, 25000, 40000, 60000],
        aerialMarketingMonthly: 120000,
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
