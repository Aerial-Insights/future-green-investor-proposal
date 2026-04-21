import { motion } from 'framer-motion'
import { MEMO } from '../../../data/investorPortal/memoContent'
import { BUDGET_CATEGORIES } from '../../../data/investorPortal/budgetBreakdown'
import { formatCurrency } from '../../../utils/formatCurrency'
import ChartCard from '../../../components/data-display/ChartCard'
import DonutChart from '../../../components/charts/DonutChart'
import SectionHeader from '../components/SectionHeader'

export default function CapitalDeployment() {
  const donutData = BUDGET_CATEGORIES.map((cat) => ({
    name: cat.label,
    value: cat.total,
    color: cat.color,
  }))

  const total = BUDGET_CATEGORIES.reduce((s, c) => s + c.total, 0)

  return (
    <section id="capital-deployment" className="py-24 border-t border-surface-border/60">
      <SectionHeader
        number="X"
        eyebrow="Allocation"
        title="Capital Deployment"
        subtitle="Seven categories, each mapped to a defined output and a specific time horizon"
      />

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="text-text-secondary leading-[1.8] text-[15px] mb-12"
      >
        {MEMO.capitalDeploymentNarrative}
      </motion.p>

      <div className="mb-12">
        <ChartCard title="$40M Capital Allocation" subtitle="Share of total deployment by category">
          <DonutChart
            data={donutData}
            height={340}
            innerRadius={80}
            outerRadius={125}
            centerLabel="Total"
            centerValue="$40.0M"
          />
        </ChartCard>
      </div>

      <div className="space-y-3">
        {BUDGET_CATEGORIES.map((cat, i) => {
          const pct = (cat.total / total) * 100
          return (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="luxury-card p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-2.5 h-8 rounded-sm flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  <div className="min-w-0">
                    <h4 className="font-display font-semibold text-text-primary text-[15px] truncate">{cat.label}</h4>
                    <p className="text-text-dim text-[10px] uppercase tracking-wider">{pct.toFixed(1)}% of total</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="font-display font-bold text-base text-text-primary">{formatCurrency(cat.total)}</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1 bg-surface-hover rounded-full mb-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.05 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
              </div>

              <div className="grid gap-1.5 sm:grid-cols-2">
                {cat.items.slice(0, 4).map((item) => (
                  <div key={item.label} className="flex justify-between items-baseline py-1">
                    <span className="text-text-muted text-xs">{item.label}</span>
                    <span className="text-text-secondary text-xs font-medium ml-2">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
                {cat.items.length > 4 && (
                  <p className="text-text-dim text-[10px] col-span-2 pt-1">
                    + {cat.items.length - 4} additional line items
                  </p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
