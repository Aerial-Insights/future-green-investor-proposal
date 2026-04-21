import { motion } from 'framer-motion'
import { MEMO } from '../../../data/investorPortal/memoContent'
import { useCalculations } from '../../../hooks/useCalculations'
import { formatCurrency } from '../../../utils/formatCurrency'
import { formatNumber } from '../../../utils/formatNumber'
import SectionHeader from '../components/SectionHeader'
import Prose from '../components/Prose'
import MetricBlock, { MetricGrid } from '../components/MetricBlock'

export default function RealEstateDivision() {
  const years = useCalculations()
  const y5 = years[4]

  const pathways = [
    {
      name: 'Wholesale',
      role: 'Liquidity',
      description: 'Below-market land acquisitions assigned to buyers at an average $18,000 fee per deal. Provides fast-turn liquidity and consistent deal flow.',
      y5Profit: y5.realEstate.wholesale.totalProfit,
      y5Metric: `${y5.realEstate.wholesale.totalDeals} deals`,
    },
    {
      name: 'Housing Development',
      role: 'Margin',
      description: 'Standardized build-and-sell execution creating high-margin profits. Build cost averages $200K per unit against $360K market value.',
      y5Profit: y5.realEstate.housing.totalProfit,
      y5Metric: `${y5.realEstate.housing.homesBuilt} homes`,
    },
    {
      name: 'Subdivision',
      role: 'Multiple',
      description: 'Parcel reconfiguration and lot splitting unlocks embedded land value. Larger acreage is split into sellable lots at a significant markup per acre.',
      y5Profit: y5.realEstate.subdivision.profit,
      y5Metric: `${y5.realEstate.subdivision.subdivides} parcels`,
    },
  ]

  return (
    <section id="real-estate" className="py-24 border-t border-surface-border/60">
      <SectionHeader
        number="VIII"
        eyebrow="Division 03"
        title="Real Estate Division"
        subtitle="Three deployment pathways, each engineered for a distinct return profile"
      />

      <Prose paragraphs={MEMO.realEstateNarrative} className="mb-12" />

      <div className="mb-12">
        <MetricGrid cols={4}>
          <MetricBlock label="Y5 RE Revenue" value={formatCurrency(y5.realEstate.totalRevenue)} delay={0} />
          <MetricBlock label="Y5 RE Profit" value={formatCurrency(y5.realEstate.totalProfit)} accent delay={0.08} />
          <MetricBlock label="Y5 Homes Built" value={formatNumber(y5.realEstate.housing.homesBuilt, false)} delay={0.16} />
          <MetricBlock label="Y5 Wholesale Deals" value={formatNumber(y5.realEstate.wholesale.totalDeals, false)} delay={0.24} />
        </MetricGrid>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {pathways.map((pw, i) => (
          <motion.div
            key={pw.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="luxury-card p-6 border-t-2 border-accent-green/40 relative"
          >
            <p className="text-accent-green-light text-[10px] uppercase tracking-[0.2em] mb-1">{pw.role}</p>
            <h4 className="font-display font-semibold text-text-primary text-base mb-3">{pw.name}</h4>
            <p className="text-text-muted text-xs leading-[1.7] mb-5">{pw.description}</p>
            <div className="border-t border-surface-border pt-4 space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-text-dim text-[10px] uppercase tracking-wider">Y5 Profit</span>
                <span className="font-display font-bold text-sm text-accent-gold">{formatCurrency(pw.y5Profit)}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-text-dim text-[10px] uppercase tracking-wider">Y5 Volume</span>
                <span className="font-display font-semibold text-sm text-text-primary">{pw.y5Metric}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
