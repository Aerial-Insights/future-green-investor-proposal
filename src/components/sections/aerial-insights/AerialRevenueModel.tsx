import { useState } from 'react'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '../../../theme/animations'
import { useCalculations } from '../../../hooks/useCalculations'
import { AERIAL_INSIGHTS } from '../../../data/investorPortal/content'
import { DIVISION_COLORS } from '../../../theme/chartTheme'
import { formatCurrency } from '../../../utils/formatCurrency'
import { formatNumber } from '../../../utils/formatNumber'
import MetricStrip from '../../data-display/MetricStrip'
import ChartCard from '../../data-display/ChartCard'
import AreaChartComponent from '../../charts/AreaChartComponent'

export default function AerialRevenueModel() {
  const [chartView, setChartView] = useState<'mrr' | 'users'>('mrr')
  const years = useCalculations()
  const y1 = years[0]
  const y5 = years[4]

  const mrrData = years.map((y) => ({
    name: `Year ${y.year}`,
    mrr: y.aerial.totalMRR,
  }))

  const userData = years.map((y) => ({
    name: `Year ${y.year}`,
    users: y.aerial.activeUsers,
  }))

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display font-bold text-text-primary text-2xl mb-2">Revenue Model</h2>
        <p className="text-text-secondary text-sm max-w-2xl">
          One product. One price. One scalable revenue engine.
        </p>
      </div>

      {/* ── SUBSCRIPTION CARD ──────────────────────────────────────────── */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <motion.div variants={staggerItem} className="luxury-card border-l-2 border-l-[#6366f1]">
          <div className="text-text-muted text-xs font-medium uppercase tracking-wider mb-2">Aerial Insights Platform</div>
          <div className="font-display font-bold text-3xl text-accent-gold mb-4">{AERIAL_INSIGHTS.subscription.price}</div>
          <div className="space-y-2">
            {AERIAL_INSIGHTS.subscription.features.map((feature) => (
              <div key={feature} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#6366f1] mt-1.5 shrink-0" />
                <span className="text-text-secondary text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Key Economics */}
        <motion.div variants={staggerItem} className="luxury-card lg:col-span-2">
          <h3 className="font-display font-semibold text-text-primary text-base mb-4">Unit Economics</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            <div>
              <div className="text-text-muted text-xs font-medium uppercase tracking-wider mb-1">Subscription</div>
              <div className="font-display font-bold text-xl text-text-primary">$1,200</div>
              <div className="text-text-muted text-xs">per user / month</div>
            </div>
            <div>
              <div className="text-text-muted text-xs font-medium uppercase tracking-wider mb-1">Lead Acquisition Cost</div>
              <div className="font-display font-bold text-xl text-[#6366f1]">$0.15</div>
              <div className="text-text-muted text-xs">avg cost per lead via AI</div>
            </div>
            <div>
              <div className="text-text-muted text-xs font-medium uppercase tracking-wider mb-1">Lead Sale Price</div>
              <div className="font-display font-bold text-xl text-accent-gold">$3–$10</div>
              <div className="text-text-muted text-xs">based on lead score</div>
            </div>
            <div>
              <div className="text-text-muted text-xs font-medium uppercase tracking-wider mb-1">Lead Margin</div>
              <div className="font-display font-bold text-xl text-text-primary">20x–67x</div>
              <div className="text-text-muted text-xs">acquisition to sale</div>
            </div>
            <div>
              <div className="text-text-muted text-xs font-medium uppercase tracking-wider mb-1">CAC</div>
              <div className="font-display font-bold text-xl text-text-primary">$200</div>
              <div className="text-text-muted text-xs">customer acquisition</div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── METRICS ────────────────────────────────────────────────────── */}
      <MetricStrip
        metrics={[
          { label: 'Y1 Users', value: y1.aerial.activeUsers, format: 'number' },
          { label: 'Y1 MRR', value: y1.aerial.totalMRR, format: 'currency' },
          { label: 'Y5 Users', value: y5.aerial.activeUsers, format: 'number' },
          { label: 'Y5 ARR', value: y5.aerial.totalARR, format: 'currency' },
        ]}
        columns={4}
      />

      {/* ── MRR / USERS CHART ──────────────────────────────────────────── */}
      <div className="luxury-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-semibold text-text-primary text-lg">
              {chartView === 'mrr' ? 'Monthly Recurring Revenue' : 'Total Users'}
            </h3>
            <p className="text-text-muted text-xs mt-0.5">
              {chartView === 'mrr' ? 'Subscription revenue growth over 5-year horizon' : 'Active subscribers over 5-year horizon'}
            </p>
          </div>
          <div className="flex rounded-lg border border-surface-border overflow-hidden shrink-0">
            <button
              onClick={() => setChartView('mrr')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                chartView === 'mrr'
                  ? 'bg-[#6366f1]/15 text-[#6366f1]'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              MRR
            </button>
            <button
              onClick={() => setChartView('users')}
              className={`px-3 py-1.5 text-xs font-medium transition-colors border-l border-surface-border ${
                chartView === 'users'
                  ? 'bg-[#6366f1]/15 text-[#6366f1]'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              Users
            </button>
          </div>
        </div>
        {chartView === 'mrr' ? (
          <AreaChartComponent
            data={mrrData}
            dataKey="mrr"
            label="MRR"
            color={DIVISION_COLORS.aerialInsights}
            height={340}
          />
        ) : (
          <AreaChartComponent
            data={userData}
            dataKey="users"
            label="Active Users"
            color={DIVISION_COLORS.aerialInsights}
            height={340}
            formatValue={(v) => formatNumber(v)}
          />
        )}
      </div>

      {/* ── REVENUE SUMMARY ────────────────────────────────────────────── */}
      <div className="luxury-card">
        <h3 className="font-display font-semibold text-text-primary text-lg mb-4">Revenue Trajectory</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {years.map((y) => (
            <div key={y.year}>
              <div className="text-text-muted text-xs font-medium uppercase tracking-wider mb-1">Year {y.year}</div>
              <div className="font-display font-bold text-lg text-text-primary">{formatCurrency(y.aerial.totalARR)}</div>
              <div className="text-text-muted text-xs">{y.aerial.activeUsers.toLocaleString()} users</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
