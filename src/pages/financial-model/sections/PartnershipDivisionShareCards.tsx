import { motion } from 'framer-motion'
import { formatCurrency } from '../../../utils/formatCurrency'
import { formatPercent } from '../../../utils/formatPercent'
import { DIVISION_COLORS } from '../../../theme/chartTheme'
import type { PartnershipReturnSummary } from '../../../data/investorPortal/formulas/types'
import type { PartnershipOptionConfig } from '../../../data/investorPortal/baseAssumptions'

interface Props {
  summary: PartnershipReturnSummary
  config: PartnershipOptionConfig
}

export default function PartnershipDivisionShareCards({ summary, config }: Props) {
  const findYear = (year: number) => summary.annualReturns.find((r) => r.year === year)
  const horizonYear = summary.annualReturns[summary.annualReturns.length - 1]?.year ?? 20

  const divisions = [
    {
      title: 'Home Services',
      subtitle: 'Immediate Cash Flow',
      color: DIVISION_COLORS.homeServices,
      initialShare: config.homeServicesShare,
      permanentShare: config.postThresholdHomeServicesShare,
      desc: 'Initial-phase share of Home Services profits across all four sales channels, stepping down after the threshold.',
      earningsKey: 'homeServicesEarnings' as const,
    },
    {
      title: 'Real Estate',
      subtitle: 'Asset-Backed Returns',
      color: DIVISION_COLORS.realEstate,
      initialShare: config.realEstateShare,
      permanentShare: config.postThresholdRealEstateShare,
      desc: 'Initial-phase share of combined Solar Operations and Real Estate profits, stepping down after the threshold.',
      earningsKey: 'solarRealEstateEarnings' as const,
    },
    {
      title: 'Aerial Insights',
      subtitle: 'Recurring SaaS Revenue',
      color: DIVISION_COLORS.aerialInsights,
      initialShare: config.aerialInsightsShare,
      permanentShare: config.postThresholdAerialInsightsShare,
      desc: 'Initial-phase share of Aerial Insights subscription and SaaS revenue, stepping down after the threshold.',
      earningsKey: 'aerialEarnings' as const,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {divisions.map((d) => {
          const y5 = findYear(5)
          const y10 = findYear(10)
          const y20 = findYear(horizonYear)
          const cumulative20 = summary.annualReturns.reduce((s, r) => s + r[d.earningsKey], 0)
          return (
            <div key={d.title} className="luxury-card p-6 relative overflow-hidden group hover:border-surface-light transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-1 opacity-80" style={{ backgroundColor: d.color }} />
              <div className="flex items-center gap-2 mb-3 mt-1">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-text-muted text-xs uppercase tracking-wider font-medium">{d.subtitle}</span>
              </div>
              <h4 className="font-display font-semibold text-text-primary text-base mb-2">{d.title}</h4>
              <p className="text-text-secondary text-xs leading-relaxed mb-4">{d.desc}</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-lg border border-accent-gold/30 bg-accent-gold/[0.06] p-2.5">
                  <p className="text-[9px] uppercase tracking-wider text-accent-gold mb-1 font-semibold">Initial Phase</p>
                  <p className="text-accent-gold font-display font-bold text-2xl leading-none">{formatPercent(d.initialShare)}</p>
                </div>
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-700/10 p-2.5">
                  <p className="text-[9px] uppercase tracking-wider text-emerald-300 mb-1 font-semibold">Permanent Phase</p>
                  <p className="text-emerald-300 font-display font-bold text-2xl leading-none">{formatPercent(d.permanentShare)}</p>
                </div>
              </div>
              <div className="space-y-2 pt-3 border-t border-surface-border/40">
                {y5 && (
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted text-xs">Year 5 earnings</span>
                    <span className="text-text-primary font-display font-semibold text-sm">{formatCurrency(y5[d.earningsKey])}</span>
                  </div>
                )}
                {y10 && (
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted text-xs">Year 10 earnings</span>
                    <span className="text-text-primary font-display font-semibold text-sm">{formatCurrency(y10[d.earningsKey])}</span>
                  </div>
                )}
                {y20 && (
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted text-xs">Year {horizonYear} earnings</span>
                    <span className="text-text-primary font-display font-semibold text-sm">{formatCurrency(y20[d.earningsKey])}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-surface-border/30">
                  <span className="text-text-muted text-xs font-medium">{horizonYear}-Year Total</span>
                  <span className="text-accent-gold font-display font-bold text-base">{formatCurrency(cumulative20)}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
