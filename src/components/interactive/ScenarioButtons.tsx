import { useAssumptionsStore } from '../../store/useAssumptionsStore'
import { SCENARIO_PRESETS, type ScenarioKey } from '../../data/investorPortal/scenarioPresets'

export default function ScenarioButtons() {
  const { activeScenario, applyScenarioPreset, resetToBase } = useAssumptionsStore()

  const scenarios: ScenarioKey[] = ['conservative', 'base', 'growth', 'aggressive']

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-text-secondary text-xs font-semibold uppercase tracking-wider">Scenario Presets</p>
        <button
          onClick={resetToBase}
          className="text-text-muted text-xs hover:text-accent-gold transition-colors"
        >
          Reset
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {scenarios.map((key) => {
          const preset = SCENARIO_PRESETS[key]
          return (
            <button
              key={key}
              onClick={() => applyScenarioPreset(key)}
              className={`px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeScenario === key
                  ? 'bg-accent-gold/15 text-accent-gold border border-accent-gold/40'
                  : 'bg-surface border border-surface-border text-text-secondary hover:text-text-primary hover:border-surface-light'
              }`}
            >
              {preset.label}
            </button>
          )
        })}
      </div>
      {activeScenario === 'custom' && (
        <p className="text-accent-gold/70 text-xs italic">Custom scenario — inputs modified from preset</p>
      )}
    </div>
  )
}
