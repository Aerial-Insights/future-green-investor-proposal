import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '../../../theme/animations'
import { useAssumptionsStore } from '../../../store/useAssumptionsStore'
import { formatCurrency } from '../../../utils/formatCurrency'
import { formatPercent } from '../../../utils/formatPercent'

// ─── SERVICE DEFINITIONS ────────────────────────────────────────────────────

interface ServiceDef {
  id: string
  label: string
  revenueKey: keyof ReturnType<typeof useServiceEconomics>
  marginKey: keyof ReturnType<typeof useServiceEconomics>
}

function useServiceEconomics() {
  const se = useAssumptionsStore((s) => s.assumptions.serviceEconomics)
  return {
    roofingRevenue: se.roofingRevenuePerJob,
    roofingMargin: se.roofingMargin,
    hvacRevenue: se.hvacRevenuePerJob,
    hvacMargin: se.hvacMargin,
    waterHeaterRevenue: se.waterHeaterRevenuePerJob,
    waterHeaterMargin: se.waterHeaterMargin,
    insulationRevenue: se.insulationRevenuePerJob,
    insulationMargin: se.insulationMargin,
    airSealingRevenue: se.airSealingRevenuePerJob,
    airSealingMargin: se.airSealingMargin,
    solarRevenue: se.solarRevenuePerJob,
    solarMargin: se.solarMargin,
  }
}

const SERVICES: ServiceDef[] = [
  { id: 'roofing', label: 'Roofing', revenueKey: 'roofingRevenue', marginKey: 'roofingMargin' },
  { id: 'hvac', label: 'HVAC', revenueKey: 'hvacRevenue', marginKey: 'hvacMargin' },
  { id: 'waterHeater', label: 'Water Heater', revenueKey: 'waterHeaterRevenue', marginKey: 'waterHeaterMargin' },
  { id: 'insulation', label: 'Insulation', revenueKey: 'insulationRevenue', marginKey: 'insulationMargin' },
  { id: 'airSealing', label: 'Air Sealing', revenueKey: 'airSealingRevenue', marginKey: 'airSealingMargin' },
  { id: 'solar', label: 'Solar', revenueKey: 'solarRevenue', marginKey: 'solarMargin' },
]

// ─── DEFAULT CROSS-SELL MATRIX ──────────────────────────────────────────────
// Row = entry service, Col = cross-sell target. Seeded from existing upsell rates.

type CrossSellMatrix = Record<string, Record<string, number>>

function buildDefaultMatrix(): CrossSellMatrix {
  return {
    roofing:     { hvac: 0.07, waterHeater: 0.04, insulation: 0.05, airSealing: 0.03, solar: 0.04 },
    hvac:        { roofing: 0.10, waterHeater: 0.04, insulation: 0.05, airSealing: 0.03, solar: 0.04 },
    waterHeater: { roofing: 0.06, hvac: 0.08, insulation: 0.05, airSealing: 0.03, solar: 0.02 },
    insulation:  { roofing: 0.06, hvac: 0.07, waterHeater: 0.04, airSealing: 0.08, solar: 0.02 },
    airSealing:  { roofing: 0.05, hvac: 0.06, waterHeater: 0.03, insulation: 0.10, solar: 0.02 },
    solar:       { roofing: 0.12, hvac: 0.05, waterHeater: 0.03, insulation: 0.04, airSealing: 0.02 },
  }
}

// ─── COMPONENT ──────────────────────────────────────────────────────────────

export default function CustomerExpansionEngine() {
  const economics = useServiceEconomics()
  const [selectedEntry, setSelectedEntry] = useState('roofing')
  const [matrix, setMatrix] = useState<CrossSellMatrix>(buildDefaultMatrix)

  const setRate = (targetId: string, value: number) => {
    setMatrix((prev) => ({
      ...prev,
      [selectedEntry]: { ...prev[selectedEntry], [targetId]: Math.max(0, Math.min(1, value)) },
    }))
  }

  const selectedLabel = SERVICES.find((s) => s.id === selectedEntry)?.label ?? ''

  // ─── CALCULATIONS ───────────────────────────────────────────────────────
  const analysis = useMemo(() => {
    const entrySvc = SERVICES.find((s) => s.id === selectedEntry)!
    const entryRevenue = economics[entrySvc.revenueKey] as number
    const entryMargin = economics[entrySvc.marginKey] as number
    const entryProfit = entryRevenue * entryMargin
    const rates = matrix[selectedEntry] || {}

    let totalCrossSellRevenue = 0
    let totalCrossSellProfit = 0

    const crossSells = SERVICES.filter((s) => s.id !== selectedEntry).map((svc) => {
      const rate = rates[svc.id] || 0
      const revenue = economics[svc.revenueKey] as number
      const margin = economics[svc.marginKey] as number
      const profit = revenue * margin
      const weightedRevenue = rate * revenue
      const weightedProfit = rate * profit
      const profitPctOfBase = entryProfit > 0 ? (weightedProfit / entryProfit) * 100 : 0
      totalCrossSellRevenue += weightedRevenue
      totalCrossSellProfit += weightedProfit
      return { ...svc, rate, revenue, margin, profit, weightedRevenue, weightedProfit, profitPctOfBase }
    })

    const expandedRevenuePerLead = entryRevenue + totalCrossSellRevenue
    const expandedProfitPerLead = entryProfit + totalCrossSellProfit
    const revenueMultiple = entryRevenue > 0 ? expandedRevenuePerLead / entryRevenue : 1
    const profitMultiple = entryProfit > 0 ? expandedProfitPerLead / entryProfit : 1
    const totalProfitPctIncrease = entryProfit > 0 ? (totalCrossSellProfit / entryProfit) * 100 : 0

    return {
      entryRevenue,
      entryProfit,
      crossSells,
      totalCrossSellRevenue,
      totalCrossSellProfit,
      expandedRevenuePerLead,
      expandedProfitPerLead,
      revenueMultiple,
      profitMultiple,
      totalProfitPctIncrease,
    }
  }, [selectedEntry, matrix, economics])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-display font-bold text-text-primary text-2xl mb-2">Customer Expansion Engine</h2>
        <p className="text-text-secondary text-sm max-w-3xl">
          Every acquired customer is a gateway to multiple revenue streams. Select an entry service below to see
          how cross-sell conversions transform a single lead into a multi-service relationship — dramatically
          increasing profit per acquired customer.
        </p>
      </div>

      {/* Entry Service Selector */}
      <div>
        <label className="text-text-muted text-xs font-medium uppercase tracking-wider mb-3 block">
          Entry Service
        </label>
        <div className="flex flex-wrap gap-2">
          {SERVICES.map((svc) => (
            <button
              key={svc.id}
              onClick={() => setSelectedEntry(svc.id)}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedEntry === svc.id
                  ? 'bg-accent-gold/15 text-accent-gold border border-accent-gold/40 shadow-[0_0_12px_rgba(201,168,76,0.1)]'
                  : 'text-text-muted hover:text-text-secondary border border-surface-border hover:border-surface-light bg-surface-elevated/50'
              }`}
            >
              {svc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        key={selectedEntry}
        className="grid grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {[
          { label: 'Base Profit per Lead', value: formatCurrency(analysis.entryProfit), accent: false },
          { label: 'Expanded Profit per Lead', value: formatCurrency(analysis.expandedProfitPerLead), accent: true },
          { label: 'Total Added Profit', value: '+' + formatCurrency(analysis.totalCrossSellProfit), accent: true },
          { label: 'Total Combined Revenue', value: formatCurrency(analysis.expandedRevenuePerLead), accent: false },
          { label: 'Profit Increase', value: '+' + analysis.totalProfitPctIncrease.toFixed(1) + '%', accent: true },
          { label: 'Profit Multiple', value: analysis.profitMultiple.toFixed(2) + 'x', accent: true },
        ].map((card) => (
          <motion.div key={card.label} variants={staggerItem} className="luxury-card text-center py-5">
            <p className="text-text-muted text-xs mb-1.5">{card.label}</p>
            <p className={`font-display font-bold text-xl ${card.accent ? 'text-accent-gold' : 'text-text-primary'}`}>
              {card.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Expansion Map */}
      <div className="luxury-card">
        <h3 className="font-display font-semibold text-text-primary text-lg mb-5">
          Service Expansion from {selectedLabel} Lead
        </h3>

        {/* Entry service header */}
        <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-accent-gold/5 border border-accent-gold/20">
          <div className="w-3 h-3 rounded-full bg-accent-gold shrink-0" />
          <div className="flex-1">
            <span className="text-text-primary font-semibold text-sm">{selectedLabel}</span>
            <span className="text-text-muted text-xs ml-2">(Entry Service)</span>
          </div>
          <div className="text-right">
            <span className="text-text-secondary text-xs">Revenue </span>
            <span className="text-text-primary font-medium text-sm">{formatCurrency(analysis.entryRevenue)}</span>
            <span className="text-text-muted text-xs ml-3">Profit </span>
            <span className="text-accent-gold font-semibold text-sm">{formatCurrency(analysis.entryProfit)}</span>
          </div>
        </div>

        {/* Cross-sell branches with profit outputs */}
        <div className="space-y-3">
          {analysis.crossSells.map((cs) => (
            <div key={cs.id} className="flex items-center gap-3">
              {/* Connector */}
              <div className="flex flex-col items-center w-6 shrink-0">
                <div className="w-px h-3 bg-surface-border" />
                <div className="w-2 h-2 rounded-full bg-surface-border" />
              </div>

              {/* Service row */}
              <div className="flex-1 flex items-center gap-3 sm:gap-4 p-3 rounded-lg bg-surface-elevated/50 border border-surface-border hover:border-surface-light transition-colors">
                <span className="text-text-primary text-sm font-medium w-24 shrink-0">{cs.label}</span>

                {/* Editable conversion rate */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={Math.round(cs.rate * 100)}
                    onChange={(e) => setRate(cs.id, parseFloat(e.target.value || '0') / 100)}
                    className="w-14 bg-surface border border-surface-border rounded px-2 py-1 text-text-primary text-sm text-center
                      focus:outline-none focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/20 transition-colors"
                  />
                  <span className="text-text-muted text-xs">%</span>
                </div>

                {/* Added profit */}
                <div className="flex-1 text-right hidden sm:block">
                  <span className="text-text-muted text-xs">+Profit </span>
                  <span className={`text-sm font-medium ${cs.weightedProfit > 0 ? 'text-accent-gold' : 'text-text-muted'}`}>
                    {formatCurrency(cs.weightedProfit)}
                  </span>
                </div>

                {/* % of base profit */}
                <div className="text-right min-w-[70px]">
                  <span className={`text-sm font-semibold ${cs.profitPctOfBase > 0 ? 'text-accent-gold' : 'text-text-muted'}`}>
                    +{cs.profitPctOfBase.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Totals summary */}
        <div className="mt-6 pt-5 border-t border-surface-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-text-secondary text-sm">Total Added Profit from Cross-Sells</span>
            <span className="text-accent-gold font-display font-bold text-lg">+{formatCurrency(analysis.totalCrossSellProfit)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-secondary text-sm">Total Combined Profit per Lead</span>
            <span className="text-accent-gold font-display font-bold text-lg">{formatCurrency(analysis.expandedProfitPerLead)}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-surface-border/50">
            <span className="text-text-primary text-sm font-semibold">Profit Increase vs Base {selectedLabel} Job</span>
            <span className="text-accent-gold font-display font-bold text-xl">+{analysis.totalProfitPctIncrease.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Why This Matters */}
      <div className="luxury-card">
        <div className="w-8 h-1 rounded-full bg-accent-gold mb-4" />
        <h3 className="font-display font-semibold text-text-primary text-lg mb-3">Why This Matters</h3>
        <div className="space-y-3">
          <p className="text-text-secondary text-sm leading-relaxed">
            Each acquired customer creates significantly more value than a single job. The multi-service
            offering allows the company to monetize the same customer relationship across roofing, HVAC, insulation,
            water heaters, air sealing, and solar — converting a one-time transaction into a multi-revenue engagement
            without reacquiring the lead.
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            At a <span className="text-accent-gold font-semibold">{analysis.profitMultiple.toFixed(2)}x profit multiple</span> per {selectedLabel.toLowerCase()} lead,
            the effective customer acquisition cost drops
            by {formatPercent(1 - 1 / analysis.profitMultiple)} when measured against total extracted value. This
            makes every marketing dollar and every rep-hour materially more productive than a single-service competitor.
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            This creates a more durable and scalable sales model. Competitors selling only one service leave
            significant value on the table with every customer interaction. The integrated platform captures that
            value systematically — improving unit economics at every scale.
          </p>
        </div>
      </div>
    </div>
  )
}
