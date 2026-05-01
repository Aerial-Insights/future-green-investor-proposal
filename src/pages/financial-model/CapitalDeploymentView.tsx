import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ChartCard from '../../components/data-display/ChartCard'
import DonutChart from '../../components/charts/DonutChart'
import { formatCurrencyPrecise } from '../../utils/formatCurrency'
import { BUDGET_CATEGORIES, BUDGET_GRAND_TOTAL } from '../../data/investorPortal/budgetBreakdown'
import type { BudgetCategory } from '../../data/investorPortal/budgetBreakdown'
import { DEPLOYMENT_OUTPUTS } from '../../data/investorPortal/deploymentOutputs'
import DeploymentOutputCard from '../../components/data-display/DeploymentOutputCard'
import SimulationPanel from '../../components/interactive/SimulationPanel'
import { SIMULATION_CONFIGS } from '../../data/investorPortal/simulationConfigs'

export default function CapitalDeploymentView() {
  const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | null>(null)

  const mainCapitalData = BUDGET_CATEGORIES.map((cat) => ({
    name: cat.label,
    value: cat.total,
    color: cat.color,
  }))

  const drillDownChartData = selectedCategory
    ? selectedCategory.items.map((item, i) => {
        const shades = ['#c9a84c', '#e2c97e', '#f59e0b', '#40916c', '#2d6a4f', '#6366f1', '#a3a3a3', '#d4d4d8', '#737373', '#525252']
        return { name: item.label.length > 25 ? item.label.slice(0, 25) + '...' : item.label, value: item.amount, color: shades[i % shades.length] }
      })
    : null

  const budgetTotal = formatCurrencyPrecise(BUDGET_GRAND_TOTAL)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-text-primary text-2xl">Capital Deployment</h2>
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-accent-gold text-sm font-semibold hover:text-accent-gold-light transition-colors flex items-center gap-1"
          >
            <span>&larr;</span> Back to Overview
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!selectedCategory ? (
          <motion.div key="main" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Allocation Breakdown" explanationKey="capitalDeployment">
                <DonutChart data={mainCapitalData} centerLabel="Total" centerValue={budgetTotal} />
              </ChartCard>
              <div className="space-y-3">
                {BUDGET_CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat)}
                    className="w-full luxury-card p-4 text-left hover:border-accent-gold/30 hover:shadow-glow transition-all duration-200 group cursor-pointer"
                  >
                    <div className="flex justify-between items-baseline mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-text-primary text-sm font-semibold">{cat.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-accent-gold font-display font-semibold">{formatCurrencyPrecise(cat.total)}</span>
                        <span className="text-text-dim text-xs group-hover:text-accent-gold transition-colors">&rarr;</span>
                      </div>
                    </div>
                    <p className="text-text-muted text-xs pl-4">{cat.items.length} line items</p>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key={selectedCategory.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title={`${selectedCategory.label} Breakdown`} subtitle={formatCurrencyPrecise(selectedCategory.total)}>
                <DonutChart
                  data={drillDownChartData!}
                  centerLabel={selectedCategory.label.split(' ')[0]}
                  centerValue={formatCurrencyPrecise(selectedCategory.total)}
                />
              </ChartCard>
              <div className="space-y-2">
                {selectedCategory.items.map((item) => {
                  const outputs = DEPLOYMENT_OUTPUTS[selectedCategory.key]?.[item.label]
                  const simConfig = SIMULATION_CONFIGS[selectedCategory.key]?.[item.label]
                  return (
                    <div key={item.label} className="luxury-card p-4">
                      <div className={outputs ? 'flex flex-col lg:flex-row gap-4' : ''}>
                        <div className={outputs ? 'flex-1 min-w-0' : ''}>
                          <div className="flex justify-between items-baseline mb-1.5">
                            <span className="text-text-primary text-sm font-semibold">{item.label}</span>
                            <span className="text-accent-gold font-display font-semibold text-sm">{formatCurrencyPrecise(item.amount)}</span>
                          </div>
                          <p className="text-text-muted text-xs">{item.why}</p>
                        </div>
                        {outputs && (
                          <div className="w-full lg:w-56 flex-shrink-0">
                            <DeploymentOutputCard allocation={item.amount} outputs={outputs} />
                          </div>
                        )}
                      </div>
                      {simConfig && outputs && (
                        <SimulationPanel
                          config={simConfig}
                          baseQuantity={Math.floor((outputs[0].allocationOverride ?? item.amount) / outputs[0].unitCost)}
                          allocation={item.amount}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {BUDGET_CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    cat.key === selectedCategory.key
                      ? 'bg-accent-gold/15 text-accent-gold border border-accent-gold/30'
                      : 'bg-surface-elevated text-text-secondary border border-surface-border hover:border-surface-light hover:text-text-primary'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
