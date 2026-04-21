import { motion } from 'framer-motion'
import { MEMO, AERIAL_INSIGHTS } from '../../../data/investorPortal/memoContent'
import { useCalculations, useAerialResiduals } from '../../../hooks/useCalculations'
import { formatCurrency } from '../../../utils/formatCurrency'
import { formatNumber } from '../../../utils/formatNumber'
import ChartCard from '../../../components/data-display/ChartCard'
import AreaChartComponent from '../../../components/charts/AreaChartComponent'
import SectionHeader from '../components/SectionHeader'
import Prose from '../components/Prose'
import MetricBlock, { MetricGrid } from '../components/MetricBlock'

export default function AerialInsightsDivision() {
  const years = useCalculations()
  useAerialResiduals()
  const y5 = years[4]

  const userChartData = years.map((y) => ({
    name: `Y${y.year}`,
    users: y.aerial.activeUsers,
  }))

  return (
    <section id="aerial-insights" className="py-24 border-t border-surface-border/60">
      <SectionHeader
        number="IX"
        eyebrow="Division 04"
        title="The Intelligence Moat"
        subtitle="A proprietary AI layer that compresses acquisition cost across every division — and operates as a standalone SaaS business"
      />

      <Prose paragraphs={MEMO.aerialNarrative} className="mb-12" />

      <div className="mb-12">
        <MetricGrid cols={4}>
          <MetricBlock label="Y5 Active Users" value={formatNumber(y5.aerial.activeUsers, false)} delay={0} />
          <MetricBlock label="Y5 ARR" value={formatCurrency(y5.aerial.totalARR)} accent delay={0.08} />
          <MetricBlock label="Subscription" value="$1,200 / mo" delay={0.16} />
          <MetricBlock label="Lead Cost vs Traditional" value="$0.15 vs $50–$200+" delay={0.24} />
        </MetricGrid>
      </div>

      {/* Cost advantage comparison */}
      <div className="grid gap-4 sm:grid-cols-2 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="luxury-card p-6 border-l-2 border-red-400/30 bg-gradient-to-br from-surface-elevated to-surface-elevated/50"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-red-400/60" />
            <h4 className="font-display font-semibold text-text-primary text-sm">Traditional Acquisition</h4>
          </div>
          <ul className="space-y-3">
            {AERIAL_INSIGHTS.traditionalModel.map((item, i) => (
              <li key={i}>
                <p className="text-text-secondary text-xs font-medium">{item.label}</p>
                <p className="text-text-muted text-xs mt-0.5 leading-[1.6]">{item.detail}</p>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="luxury-card p-6 border-l-2 border-accent-gold/40 bg-gradient-to-br from-surface-elevated to-surface-elevated/50"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-accent-gold" />
            <h4 className="font-display font-semibold text-text-primary text-sm">Aerial Insights Advantage</h4>
          </div>
          <ul className="space-y-3">
            {AERIAL_INSIGHTS.aerialModel.map((item, i) => (
              <li key={i}>
                <p className="text-accent-gold text-xs font-medium">{item.label}</p>
                <p className="text-text-muted text-xs mt-0.5 leading-[1.6]">{item.detail}</p>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Strategic value */}
      <div className="grid gap-3 sm:grid-cols-3 mb-12">
        {AERIAL_INSIGHTS.strategicValue.map((sv, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="luxury-card p-5 border-t border-accent-blue/40"
          >
            <h4 className="font-display font-semibold text-text-primary text-sm mb-2">{sv.title}</h4>
            <p className="text-text-muted text-xs leading-[1.7]">{sv.description}</p>
          </motion.div>
        ))}
      </div>

      <ChartCard title="Subscriber Trajectory" subtitle="Active Aerial Insights subscribers, Years 1–5">
        <AreaChartComponent
          data={userChartData}
          dataKey="users"
          label="Active Users"
          color="#6366f1"
          height={260}
          formatValue={(v) => formatNumber(v)}
        />
      </ChartCard>
    </section>
  )
}
